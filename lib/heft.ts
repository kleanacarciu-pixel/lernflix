// lib/heft.ts — Server-Logik für das PDF-Produkt "Masterclass-Heft Mathe Klasse 6".
// NUR serverseitig nutzen (Service-Role-Key, Resend). Muster wie lib/kalender.ts.
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// --- Produkt-Konfiguration --------------------------------------------------
export const PRODUCT = {
  id: "heft-mathe-6",
  name: "Das Masterclass-Heft — Mathe Klasse 6 (Gymnasium Bayern)",
  price: 1290, // in Cent = 12,90 €
  currency: "eur" as const,
  bucket: "products", // privater Supabase-Storage-Bucket
  file: "Masterclass-Heft-Klasse6-Mathe.pdf", // Dateiname im Bucket
};

const MAIL_FROM = process.env.HEFT_MAIL_FROM || "Lerne mit Anna <shop@lernemitanna.de>";
const APP_URL = (process.env.HEFT_APP_URL || "https://lernflix.lernemitanna.de").replace(/\/$/, "");
export const SUPPORT_EMAIL = "lernemitanna@outlook.com";
const SIGNED_URL_TTL = 60 * 60 * 24; // 24 Stunden

// --- Supabase (Service-Role, lazy) — Muster aus lib/kalender.ts -------------
let _sb: SupabaseClient | null = null;
export function service(): SupabaseClient {
  if (_sb) return _sb;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY fehlen");
  _sb = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  return _sb;
}

// --- Kauf idempotent speichern ---------------------------------------------
// Gibt true zurück, wenn der Eintrag NEU angelegt wurde (dann E-Mail senden),
// false bei bereits vorhandener session (doppeltes Webhook-Event).
export async function recordPurchase(sessionId: string, email: string | null): Promise<boolean> {
  const { error } = await service().from("product_purchases").insert({
    stripe_session_id: sessionId,
    email,
    product_id: PRODUCT.id,
  });
  if (!error) return true;
  // 23505 = unique_violation -> Session schon gespeichert -> nicht neu (idempotent)
  if ((error as { code?: string }).code === "23505") return false;
  throw error;
}

// --- Frische 24h-Signed-URL + download_count erhöhen ------------------------
export async function freshDownloadUrl(sessionId: string): Promise<string> {
  const sb = service();
  const { data, error } = await sb.storage
    .from(PRODUCT.bucket)
    .createSignedUrl(PRODUCT.file, SIGNED_URL_TTL, { download: PRODUCT.file });
  if (error || !data?.signedUrl) {
    throw new Error("Signed-URL fehlgeschlagen: " + (error?.message || "unbekannt"));
  }
  // Zähler atomar erhöhen (SQL-Funktion, siehe supabase/product_purchases.sql).
  await sb.rpc("increment_heft_download", { sid: sessionId }).then(
    () => {},
    (e: unknown) => console.error("[heft] download_count-Fehler:", String(e)),
  );
  return data.signedUrl;
}

// --- Bestätigungs-E-Mail (Resend via fetch, Muster aus lib/kalender.ts) -----
// Der Link führt bewusst auf /heft/download?session_id=… (nicht die Signed-URL),
// damit er auch nach 24h funktioniert — die URL wird jedes Mal frisch erzeugt.
export async function sendPurchaseEmail(to: string, sessionId: string): Promise<{ ok: boolean; error?: string }> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { ok: false, error: "RESEND_API_KEY fehlt" };
  const link = `${APP_URL}/heft/download?session_id=${encodeURIComponent(sessionId)}`;
  const html = `<!doctype html><html lang="de"><body style="margin:0;background:#F4F7FC;font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#0F172A">
  <div style="max-width:560px;margin:0 auto;padding:32px 20px">
    <div style="background:#ffffff;border:1px solid #E2E8F0;border-radius:20px;padding:36px 32px;box-shadow:0 10px 30px rgba(15,23,42,.06)">
      <p style="margin:0 0 6px;font-size:13px;letter-spacing:.12em;text-transform:uppercase;color:#1769FF;font-weight:700">Lerne mit Anna</p>
      <h1 style="margin:0 0 14px;font-size:24px;line-height:1.25;color:#0F172A">Danke für deinen Kauf! 🎉</h1>
      <p style="margin:0 0 8px;font-size:15px;line-height:1.6;color:#475569">Du hast <strong>${PRODUCT.name}</strong> gekauft. Hier geht's zu deinem Download:</p>
      <p style="margin:26px 0;text-align:center">
        <a href="${link}" style="display:inline-block;background:#1769FF;color:#ffffff;text-decoration:none;padding:15px 30px;border-radius:14px;font-size:16px;font-weight:700">📘 Heft herunterladen</a>
      </p>
      <p style="margin:0 0 8px;font-size:13px;line-height:1.6;color:#94A3B8">Der Link ist dauerhaft für dich gültig — beim Klick wird jedes Mal ein frischer, sicherer Download erzeugt (jeweils 24 Stunden gültig). Bewahre diese E-Mail also einfach auf.</p>
      <p style="margin:14px 0 0;font-size:13px;line-height:1.6;color:#94A3B8">Fragen? Antworte einfach auf diese E-Mail oder schreib an <a href="mailto:${SUPPORT_EMAIL}" style="color:#1769FF">${SUPPORT_EMAIL}</a>.</p>
    </div>
    <p style="text-align:center;font-size:12px;color:#94A3B8;margin:18px 0 0">lernemitanna.de</p>
  </div></body></html>`;

  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: MAIL_FROM,
        to,
        subject: "Dein Masterclass-Heft — Download",
        html,
        reply_to: SUPPORT_EMAIL,
      }),
    });
    if (!r.ok) {
      const txt = await r.text().catch(() => "");
      return { ok: false, error: `Resend ${r.status}: ${txt.slice(0, 220)}` };
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}
