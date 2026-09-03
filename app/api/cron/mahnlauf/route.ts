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
// Seit dem Vertragsabschluss im Portal hängt hier noch der Erinnerungslauf
// mit drin: Wer nach fünf Tagen nicht unterschrieben hat, bekommt einmal
// eine Nachricht. Bewusst im selben täglichen Job statt in einem zweiten –
// beides ist „was heute zu tun ist", und ein Job weniger heißt eine
// Fehlerquelle weniger.
//
// Läuft täglich um 06:07 UTC. Mit ?test=1 kommt eine Zusammenfassung per Mail;
// die Unterschrifts-Erinnerungen sind darin ein echter Probelauf, der Mahnteil
// dagegen läuft auch dann wirklich – er kennt keinen Probemodus.
// =============================================================================
import { NextResponse } from "next/server";
import { sendMail, ADMIN_EMAIL } from "@/lib/kalender";
import { mahnlauf, heuteIso } from "@/lib/zahlung";
import { erinnerungslauf } from "@/lib/unterzeichnung";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

// NUR der geheime Bearer-Token zählt: Die x-vercel-cron-Kopfzeile kann jeder
// von außen mitschicken (und ein Fremder könnte damit z. B. den Mahnlauf mit
// erfundenem ?datum auslösen). Vercels eigene Cron-Aufrufe tragen den
// CRON_SECRET-Bearer, sobald der in den Projektvariablen gesetzt ist.
function authorisiert(req: Request): boolean {
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

  // Achtung: Der Mahnlauf läuft auch bei ?test=1 wirklich – er kennt keinen
  // Probemodus und verschickt sofort. Der Erinnerungslauf dagegen schon.
  const ergebnis = await mahnlauf(datum);

  const basisUrl = process.env.KALENDER_URL
    || `https://${req.headers.get("host") || "lernflix.lernemitanna.de"}`;
  const unterschriften = await erinnerungslauf({ heute: datum, basisUrl, probelauf: testlauf });

  if (testlauf) {
    await sendMail(
      ADMIN_EMAIL,
      "Probelauf der täglichen Automatik",
      `<p>Der Lauf für den ${datum} hat Folgendes ergeben:</p>
       <ul>
         <li>Bank-Check an dich: ${ergebnis.adminHinweis ? "ja" : "nein"}</li>
         <li>Zahlungserinnerungen an Eltern: ${ergebnis.erinnerungen}</li>
         <li>Pausierungen: ${ergebnis.pausierungen}</li>
         <li>Offene Verträge, für die heute eine Unterschrifts-Erinnerung fällig
             wäre: ${unterschriften.verschickt} (geprüft: ${unterschriften.geprueft})</li>
       </ul>
       ${unterschriften.probleme.length
          ? `<p><b>Dabei gäbe es Probleme:</b></p><ul>${unterschriften.probleme
              .map((p) => `<li>${p.name}: ${p.grund}</li>`).join("")}</ul>`
          : ""}
       <p style="color:#5f574f;font-size:14px">Nur der letzte Punkt ist ein
          Probelauf – dort wurde nichts verschickt. Der Mahnteil darüber ist
          wirklich gelaufen; einen Probemodus hat er nicht.</p>
       <p>Sind alle Zahlen 0, ist gerade nichts offen – das ist der Normalfall.</p>`,
    );
  }

  // Ging bei den Erinnerungen etwas schief, soll Kleana das erfahren –
  // still verschluckt wäre der Vertrag einfach nie unterschrieben worden.
  if (!testlauf && unterschriften.probleme.length) {
    await sendMail(
      ADMIN_EMAIL,
      "Erinnerung an offene Verträge nicht möglich",
      `<p>Diese Familien hätten heute eine Erinnerung zum Unterschreiben bekommen sollen:</p>
       <ul>${unterschriften.probleme.map((p) => `<li>${p.name}: ${p.grund}</li>`).join("")}</ul>
       <p>Am besten kurz selbst melden.</p>`,
    );
  }

  return NextResponse.json({ ok: true, datum, ...ergebnis, unterschriften });
}
