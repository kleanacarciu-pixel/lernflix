// =============================================================================
// Termin-Erinnerungen an Kleana – etwa 15 Minuten vor jedem Termin.
//
// Läuft ALLE 5 MINUTEN. Vercels eigener Zeitplan kann das im Hobby-Tarif
// nicht (nur täglich), deshalb stößt die Supabase-Datenbank die Route an
// (pg_cron + pg_net, SQL „erinnerungen_v1" – steht im Chat). Auth wie bei
// den anderen Cron-Routen: NUR der geheime CRON_SECRET-Bearer-Token.
//
// Erinnert wird an alles, was in den nächsten 16 Minuten beginnt:
//   * Unterrichtsstunden (aus dem Klassenzimmer-Spiegel „lessons")
//   * Kleanas private Termine (Blockierungen mit Titel, z. B. „Arzt")
// Jede Erinnerung geht genau EINMAL raus – eine kleine Gedächtnisliste in
// admin_einstellungen verhindert Doppelte über die 5-Minuten-Läufe hinweg.
// =============================================================================
import { NextResponse } from "next/server";
import { service, berlinInstant, fmtZeit, addDaysStr } from "@/lib/kalender";
import { pushAnKleana, pushKonfiguriert } from "@/lib/push";
import { ladeEinstellung, speichereEinstellung } from "@/lib/einstellungen";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

const SCHLUESSEL_ERINNERT = "push_erinnert";
const VORLAUF_MS = 16 * 60_000; // beim 5-Minuten-Takt landet die Erinnerung ~11–16 Min. vorher

function authorisiert(req: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return (req.headers.get("authorization") || "") === `Bearer ${secret}`;
}

const berlinUhr = (iso: string) =>
  new Date(iso).toLocaleTimeString("de-DE", { timeZone: "Europe/Berlin", hour: "2-digit", minute: "2-digit" });

export async function GET(req: Request): Promise<Response> {
  if (!authorisiert(req)) {
    return NextResponse.json({ ok: false, error: "nicht autorisiert" }, { status: 401 });
  }
  // Ohne Konfiguration oder Abos gleich aufhören – der Lauf kommt alle
  // 5 Minuten, da soll nichts unnötig rechnen oder Fehler werfen.
  if (!pushKonfiguriert()) return NextResponse.json({ ok: true, gesendet: 0, hinweis: "VAPID_PRIVATE_KEY fehlt" });

  try {
    const sb = service();
    const jetzt = Date.now();
    const bisIso = new Date(jetzt + VORLAUF_MS).toISOString();
    const heute = new Date(jetzt).toLocaleDateString("en-CA", { timeZone: "Europe/Berlin" });

    const [lRes, bRes, pRes, erinnertRoh] = await Promise.all([
      sb.from("lessons").select("id,title,starts_at,mode,student_id,kind")
        .gte("starts_at", new Date(jetzt).toISOString()).lt("starts_at", bisIso),
      // Private Termine: Blockierungen MIT Titel (Blocks ohne Titel sind
      // reine Sperren – dafür braucht niemand eine Erinnerung). Zwei Tage
      // voraus laden, damit auch „1 Tag vorher"-Erinnerungen greifen.
      sb.from("appointments").select("id,slot_date,hour,note,dauer_min")
        .eq("kind", "block").neq("status", "abgesagt").not("note", "is", null)
        .gte("slot_date", heute).lte("slot_date", addDaysStr(heute, 2)),
      sb.from("profiles").select("user_id,name"),
      ladeEinstellung(SCHLUESSEL_ERINNERT),
    ]);

    // Gedächtnis: [{k: id, t: Zeitstempel}] – Einträge älter als einen Tag fliegen raus.
    let erinnert: { k: string; t: number }[] = [];
    try { const alt = JSON.parse(erinnertRoh || "[]"); if (Array.isArray(alt)) erinnert = alt; } catch { /* leer */ }
    erinnert = erinnert.filter((e) => jetzt - e.t < 86_400_000);
    const schon = new Set(erinnert.map((e) => e.k));

    const namen = new Map(((pRes.data || []) as { user_id: string; name: string }[])
      .map((p) => [p.user_id, p.name]));

    type Faellig = { schluessel: string; titel: string; text: string };
    const faellig: Faellig[] = [];

    for (const l of (lRes.data || []) as { id: string; title: string | null; starts_at: string; mode: string | null; student_id: string | null; kind: string | null }[]) {
      if (l.kind === "webinar") continue; // Video-Calls legt Kleana selbst an – keine Erinnerung nötig
      const key = `l:${l.id}`;
      if (schon.has(key)) continue;
      const wer = (l.student_id && namen.get(l.student_id)) || l.title || "Unterricht";
      const wie = l.mode === "online" ? " · online 💻" : l.mode === "vor_ort" ? " · vor Ort 🏫" : "";
      faellig.push({ schluessel: key, titel: "🔔 Gleich ist Unterricht", text: `${berlinUhr(l.starts_at)} Uhr: ${wer}${wie}` });
    }

    for (const b of (bRes.data || []) as { id: string; slot_date: string; hour: number; note: string | null; dauer_min: number | null }[]) {
      // Titel und Vorlauf stecken zusammen in der Notiz („Arzt|vl:30" =
      // 30 Minuten vorher, „|vl:0" = gar keine Erinnerung). Ohne Wahl gilt
      // der Standard von ~15 Minuten.
      const titelText = (b.note || "").split("|")[0];
      const vl = /\|vl:(\d+)$/.exec(b.note || "");
      const vorlaufMin = vl ? Number(vl[1]) : 15;
      if (vorlaufMin === 0) continue;
      const start = berlinInstant(b.slot_date, Number(b.hour));
      // Fällig, sobald der Erinnerungszeitpunkt erreicht ist und der Termin
      // noch nicht begonnen hat. Wird ein Termin erst NACH diesem Zeitpunkt
      // eingetragen (z. B. „1 Tag vorher" für morgen früh), kommt die
      // Erinnerung beim nächsten Lauf einmalig sofort.
      if (jetzt < start - vorlaufMin * 60_000 || jetzt >= start) continue;
      const key = `b:${b.id}`;
      if (schon.has(key)) continue;
      const tag = b.slot_date === heute ? "" : `${b.slot_date.slice(8, 10)}.${b.slot_date.slice(5, 7)}. um `;
      faellig.push({ schluessel: key, titel: "🔔 Dein Termin", text: `${tag}${fmtZeit(Number(b.hour))} Uhr: ${titelText}` });
    }

    let gesendet = 0;
    for (const f of faellig) {
      const r = await pushAnKleana(f.titel, f.text, f.schluessel);
      // Auch bei 0 erreichten Geräten als „erinnert" vermerken – sonst
      // hämmert der Lauf alle 5 Minuten gegen dieselben toten Abos.
      erinnert.push({ k: f.schluessel, t: jetzt });
      gesendet += r.gesendet;
    }
    if (faellig.length) await speichereEinstellung(SCHLUESSEL_ERINNERT, JSON.stringify(erinnert));

    return NextResponse.json({ ok: true, faellig: faellig.length, gesendet });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[cron/erinnerungen]", msg);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
