// =============================================================================
// Tägliche automatische Datensicherung.
//
// Sichert einmal am Tag ALLE Tabellen (Profile, Termine, Verträge, Zahlungen,
// Klassenzimmer-Verlauf usw.) als eine JSON-Datei in den privaten
// Storage-Ordner "backups/taeglich/". Ältere Sicherungen als AUFBEWAHRUNG_TAGE
// werden automatisch gelöscht, damit der Speicherplatz nicht unbegrenzt wächst.
//
// Läuft täglich um 04:17 UTC (ruhige Uhrzeit). Bei einem Fehler bekommt
// Kleana eine E-Mail – läuft alles glatt, passiert nichts (wie beim Mahnlauf).
// =============================================================================
import { NextResponse } from "next/server";
import { service, sendMail, ADMIN_EMAIL } from "@/lib/kalender";
import { ladeAlleTabellen } from "@/lib/backup";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const ORDNER = "taeglich";
const AUFBEWAHRUNG_TAGE = 90;

// Gibt bei Ablehnung den Grund zurück (fürs Protokoll), sonst null.
function unauthorisiertGrund(req: Request): string | null {
  if (req.headers.get("x-vercel-cron")) return null;
  const secret = process.env.CRON_SECRET;
  if (!secret) return "CRON_SECRET ist in Vercel nicht gesetzt";
  if ((req.headers.get("authorization") || "") === `Bearer ${secret}`) return null;
  return "weder x-vercel-cron-Kopfzeile noch gültiger CRON_SECRET-Bearer-Token vorhanden";
}

export async function GET(req: Request): Promise<Response> {
  const grund = unauthorisiertGrund(req);
  if (grund) {
    // Das darf nicht lautlos bleiben: schlägt die Berechtigung fehl, hat das
    // Backup noch nie richtig gelaufen – also genauso eine Mail wie bei
    // einem echten Fehler weiter unten.
    console.error("[cron/backup] nicht autorisiert:", grund);
    await sendMail(ADMIN_EMAIL, "Automatisches Backup: Berechtigung fehlgeschlagen",
      `<p>Die tägliche Datensicherung wurde heute abgelehnt (nicht autorisiert):</p>
       <p style="color:#a12a2a">${grund}</p>
       <p>Bitte kurz Bescheid geben, damit das behoben wird.</p>`);
    return NextResponse.json({ ok: false, error: "nicht autorisiert", grund }, { status: 401 });
  }

  try {
    const sicherung = await ladeAlleTabellen();
    const heute = new Date().toISOString().slice(0, 10);
    const pfad = `${ORDNER}/${heute}.json`;
    const inhalt = JSON.stringify(sicherung);

    const bucket = service().storage.from("backups");
    const up = await bucket.upload(pfad, new Blob([inhalt], { type: "application/json" }), {
      contentType: "application/json; charset=utf-8", upsert: true,
    });
    if (up.error) throw new Error(up.error.message);

    // Alte Sicherungen aufräumen (älter als AUFBEWAHRUNG_TAGE).
    const liste = await bucket.list(ORDNER, { limit: 1000 });
    const grenze = Date.now() - AUFBEWAHRUNG_TAGE * 86400000;
    const alt = (liste.data || [])
      .filter((f) => /^\d{4}-\d{2}-\d{2}\.json$/.test(f.name))
      .filter((f) => new Date(f.name.slice(0, 10)).getTime() < grenze)
      .map((f) => `${ORDNER}/${f.name}`);
    if (alt.length) await bucket.remove(alt);

    const anzahlZeilen = Object.values(sicherung.tabellen).reduce((n, t) => n + t.length, 0);
    return NextResponse.json({
      ok: true, datei: pfad, tabellen: Object.keys(sicherung.tabellen).length,
      zeilen: anzahlZeilen, groesseKB: Math.round(inhalt.length / 1024), geloescht: alt.length,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    await sendMail(ADMIN_EMAIL, "Automatisches Backup fehlgeschlagen",
      `<p>Die tägliche Datensicherung hat heute nicht geklappt:</p><p style="color:#a12a2a">${msg}</p>
       <p>Bitte kurz Bescheid geben, damit das behoben wird – deine Daten in der Datenbank selbst sind davon nicht betroffen, es ist nur die zusätzliche Sicherungskopie ausgefallen.</p>`);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
