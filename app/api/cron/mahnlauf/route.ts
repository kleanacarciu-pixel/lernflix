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
  // anFamilien: false = Kleanas Wahl (Sept. 2026): KEINE automatische
  // Erinnerungs-Mail an die Familien mehr. Fällige Verträge werden nur
  // eingesammelt; Kleana bekommt sie unten einmalig gemeldet und erinnert
  // selbst über „nochmal senden" auf der Verträge-Seite.
  const unterschriften = await erinnerungslauf({ heute: datum, basisUrl, probelauf: testlauf, anFamilien: false });

  if (testlauf) {
    await sendMail(
      ADMIN_EMAIL,
      "Probelauf der täglichen Automatik",
      `<p>Der Lauf für den ${datum} hat Folgendes ergeben:</p>
       <ul>
         <li>Bank-Check an dich: ${ergebnis.adminHinweis ? "ja" : "nein"}</li>
         <li>Zahlungserinnerungen an Eltern: ${ergebnis.erinnerungen}</li>
         <li>Pausierungen: ${ergebnis.pausierungen}</li>
         <li>Offene Verträge, die dir heute zum Selbst-Erinnern gemeldet
             würden: ${unterschriften.faellig.length} (geprüft: ${unterschriften.geprueft})</li>
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

  // Statt die Familien automatisch anzumailen (Kleanas Wahl: keine Mails
  // ohne ihr Okay), bekommt KLEANA einmalig Bescheid, wer nach fünf Tagen
  // noch nicht unterschrieben hat – erinnern kann sie dann selbst.
  if (!testlauf && unterschriften.faellig.length) {
    await sendMail(
      ADMIN_EMAIL,
      "Noch nicht unterschrieben – magst du erinnern?",
      `<p>Diese Verträge warten seit mehr als ${5} Tagen auf die Unterschrift:</p>
       <ul>${unterschriften.faellig.map((n) => `<li>${n}</li>`).join("")}</ul>
       <p>Es wurde <b>keine</b> automatische Mail an die Familien geschickt –
          so wie du es eingestellt hast. Wenn du erinnern möchtest: Seite
          „Verträge" → beim Vertrag auf <b>„nochmal senden"</b>.</p>`,
    );
  }
  // Ging beim Vormerken etwas schief, soll Kleana das erfahren.
  if (!testlauf && unterschriften.probleme.length) {
    await sendMail(
      ADMIN_EMAIL,
      "Erinnerungs-Vormerkung fehlgeschlagen",
      `<p>Bei diesen Verträgen klappte das Vormerken nicht – sie tauchen
          morgen eventuell noch einmal in der Liste auf:</p>
       <ul>${unterschriften.probleme.map((p) => `<li>${p.name}: ${p.grund}</li>`).join("")}</ul>`,
    );
  }

  return NextResponse.json({ ok: true, datum, ...ergebnis, unterschriften });
}
