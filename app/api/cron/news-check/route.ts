// Woechentliche Ueberwachung der Nachrichten-Quellen von lernemitanna.de.
//
// Hintergrund: Die Schlagzeilen kommen von fremden Webseiten. Aendert eine
// davon ihre Feed-Adresse, liefert sie stillschweigend nichts mehr - die
// Seite sieht dabei voellig normal aus, es sind nur weniger Meldungen da.
// Dieser Job prueft das und meldet sich per E-Mail NUR im Problemfall.
import { NextResponse } from "next/server";
import { sammleNews, QUELLEN } from "@/lib/news";
import { sendMail, ADMIN_EMAIL } from "@/lib/kalender";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

// NUR der geheime Bearer-Token zählt: Die x-vercel-cron-Kopfzeile kann jeder
// von außen mitschicken. Vercels eigene Cron-Aufrufe tragen den
// CRON_SECRET-Bearer, sobald der in den Projektvariablen gesetzt ist.
function authorisiert(req: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const auth = req.headers.get("authorization") || "";
  return auth === `Bearer ${secret}`;
}

const esc = (s: string) =>
  s.replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c] || c));

export async function GET(req: Request): Promise<Response> {
  if (!authorisiert(req)) {
    return NextResponse.json({ ok: false, error: "nicht autorisiert" }, { status: 401 });
  }

  const testlauf = new URL(req.url).searchParams.get("test") === "1";
  const { eintraege, ergebnisse } = await sammleNews();

  const kaputt = ergebnisse.filter((r) => r.eintraege.length === 0);
  const laeuft = ergebnisse.filter((r) => r.eintraege.length > 0);
  const problem = kaputt.length > 0 || eintraege.length < 8;

  const bericht = {
    ok: true,
    geprueft: QUELLEN.length,
    funktionieren: laeuft.length,
    ausgefallen: kaputt.map((r) => ({ name: r.q.name, fehler: r.fehler ?? null })),
    meldungen: eintraege.length,
    benachrichtigt: false as boolean,
  };

  // Alles in Ordnung -> keine E-Mail, damit die Ueberwachung nicht nervt.
  if (!problem && !testlauf) {
    return NextResponse.json(bericht);
  }

  const zeilen = ergebnisse
    .map((r) => {
      const gut = r.eintraege.length > 0;
      const status = gut
        ? `<span style="color:#127a5c">✓ ${r.eintraege.length} Meldungen</span>`
        : `<span style="color:#a12a2a">✗ liefert nichts</span>`;
      const detail = gut ? "" : `<br><span style="color:#888;font-size:12px">${esc(r.fehler || "")}</span>`;
      return `<li style="margin-bottom:6px"><b>${esc(r.q.name)}</b> – ${status}${detail}</li>`;
    })
    .join("");

  const betreff = kaputt.length
    ? `Nachrichten-Quellen: ${kaputt.length} von ${QUELLEN.length} ausgefallen`
    : `Nachrichten-Quellen: nur noch ${eintraege.length} Meldungen`;

  const html = `
    <div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;color:#1A1A1A;line-height:1.6">
      <h2 style="font-size:18px;margin:0 0 4px">Hinweis zu den Schlagzeilen auf lernemitanna.de</h2>
      <p style="margin:0 0 14px;color:#5f574f">
        ${kaputt.length
          ? `${kaputt.length} von ${QUELLEN.length} Nachrichten-Quellen liefern derzeit nichts mehr.
             Die Seite funktioniert weiter, zeigt aber weniger Meldungen an.`
          : `Es kommen nur noch ${eintraege.length} Meldungen zusammen – das ist ungewöhnlich wenig.`}
      </p>
      <ul style="padding-left:18px;margin:0 0 16px">${zeilen}</ul>
      <p style="margin:0 0 6px">Insgesamt aktuell <b>${eintraege.length} Meldungen</b> auf
        <a href="https://lernemitanna.de/schlagzeilen">lernemitanna.de/schlagzeilen</a>.</p>
      <p style="margin:0;color:#5f574f;font-size:14px">
        Meist hat der Anbieter einfach die Adresse seines Feeds geändert. Gib mir Bescheid,
        dann tausche ich sie aus – die Seite muss dafür nicht abgeschaltet werden.
      </p>
    </div>`;

  const res = await sendMail(ADMIN_EMAIL, betreff, html);
  bericht.benachrichtigt = res.ok;
  return NextResponse.json(res.ok ? bericht : { ...bericht, mailFehler: res.error });
}
