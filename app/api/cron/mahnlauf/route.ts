// =============================================================================
// Täglicher Mahnlauf des Schuljahresmodells (Abschnitt 6).
//
// Der Job arbeitet ausschließlich mit Zahlungen, die Kleana ausdrücklich als
// FEHLEND markiert hat (Umkehrlogik). Ist nichts markiert, passiert nichts –
// er kostet dann praktisch nichts und verschickt keine E-Mail.
//
//   Tag  9  Erinnerung an Kleana, kurz aufs Konto zu schauen
//   Tag 10  „letzter Tag"-E-Mail an die Eltern (bei späterer Markierung sofort)
//   Tag 15  Vertrag pausieren (bei später Markierung: 5 Tage nach Markierung)
//
// Läuft täglich um 06:07 UTC. Mit ?test=1 kommt eine Zusammenfassung per Mail,
// ohne dass etwas verschickt oder gespeichert würde (Probelauf).
// =============================================================================
import { NextResponse } from "next/server";
import { sendMail, ADMIN_EMAIL } from "@/lib/kalender";
import { mahnlauf, heuteIso } from "@/lib/zahlung";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Vercel Cron ruft die Route mit x-vercel-cron auf; manuelle Aufrufe brauchen
// den Geheim-Token aus CRON_SECRET.
function authorisiert(req: Request): boolean {
  if (req.headers.get("x-vercel-cron")) return true;
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return (req.headers.get("authorization") || "") === `Bearer ${secret}`;
}

export async function GET(req: Request): Promise<Response> {
  if (!authorisiert(req)) {
    return NextResponse.json({ ok: false, error: "nicht autorisiert" }, { status: 401 });
  }

  const url = new URL(req.url);
  const testlauf = url.searchParams.get("test") === "1";
  // Für Probeläufe darf ein Datum vorgegeben werden.
  const datum = url.searchParams.get("datum") || heuteIso();

  const ergebnis = await mahnlauf(datum);

  if (testlauf) {
    await sendMail(
      ADMIN_EMAIL,
      "Probelauf Mahn-Automatik",
      `<p>Der Mahnlauf für den ${datum} hat Folgendes ergeben:</p>
       <ul>
         <li>Bank-Check an dich: ${ergebnis.adminHinweis ? "ja" : "nein"}</li>
         <li>Erinnerungen an Eltern: ${ergebnis.erinnerungen}</li>
         <li>Pausierungen: ${ergebnis.pausierungen}</li>
       </ul>
       <p>Sind alle Zahlen 0, ist gerade keine Rate als fehlend markiert – das ist der Normalfall.</p>`,
    );
  }

  return NextResponse.json({ ok: true, datum, ...ergebnis });
}
