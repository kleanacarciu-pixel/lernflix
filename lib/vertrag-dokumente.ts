// =============================================================================
// Schuljahresmodell – PDF-Dokumente
//
// Erzeugt Terminliste, Vertragsbestätigung und AGB als PDF. Die Dateien
// gehen der Bestätigungs-E-Mail als Anhang bei und sind im Portal abrufbar.
//
// Bankverbindung: über die Umgebungsvariablen BANK_IBAN / BANK_INHABER /
// BANK_NAME pflegbar (Vercel → Settings → Environment Variables), damit
// dafür keine Code-Änderung nötig ist.
// =============================================================================
import PDFDocument from "pdfkit";
import { datumDe, WOCHENTAGE } from "@/lib/schuljahr-kern";
import { centFormat } from "@/lib/vertrag-kern";

export type Bankverbindung = { inhaber: string; iban: string; bank: string };

export function bankverbindung(): Bankverbindung {
  return {
    inhaber: process.env.BANK_INHABER || "Kleana Carciu",
    iban: process.env.BANK_IBAN || "— bitte BANK_IBAN in den Umgebungsvariablen setzen —",
    bank: process.env.BANK_NAME || "",
  };
}

// --- Grundgerüst ------------------------------------------------------------

const RAND = 56;
const TEAL = "#2BB3C0";
const INK = "#1A1A1A";
const GRAU = "#5f574f";

function neuesDokument(): PDFKit.PDFDocument {
  return new PDFDocument({ size: "A4", margin: RAND, info: { Author: "Lerne mit Anna" } });
}

function kopf(d: PDFKit.PDFDocument, titel: string, unterzeile?: string): void {
  d.fillColor(TEAL).fontSize(11).font("Helvetica-Bold").text("Lerne mit Anna");
  d.moveDown(0.3);
  d.fillColor(INK).fontSize(19).font("Helvetica-Bold").text(titel);
  if (unterzeile) {
    d.moveDown(0.15);
    d.fillColor(GRAU).fontSize(11).font("Helvetica").text(unterzeile);
  }
  d.moveDown(0.6);
  const y = d.y;
  d.moveTo(RAND, y).lineTo(d.page.width - RAND, y).strokeColor(TEAL).lineWidth(1.2).stroke();
  d.moveDown(0.9);
  d.fillColor(INK).font("Helvetica").fontSize(11);
}

function fuss(d: PDFKit.PDFDocument): void {
  const y = d.page.height - RAND + 8;
  d.fontSize(8).fillColor(GRAU).font("Helvetica")
    .text("Kleana Carciu · Lerne mit Anna · Kohlbrennerstraße 16 · 81929 München · lernemitanna@outlook.com",
      RAND, y, { width: d.page.width - 2 * RAND, align: "center" });
}

/** Dokument abschließen und als Bytes zurückgeben. */
function fertig(d: PDFKit.PDFDocument): Promise<Buffer> {
  return new Promise((loesen, ablehnen) => {
    const teile: Buffer[] = [];
    d.on("data", (c: Buffer) => teile.push(c));
    d.on("end", () => loesen(Buffer.concat(teile)));
    d.on("error", ablehnen);
    fuss(d);
    d.end();
  });
}

function zeile(d: PDFKit.PDFDocument, links: string, rechts: string, fett = false): void {
  const breite = d.page.width - 2 * RAND;
  const y = d.y;
  d.font(fett ? "Helvetica-Bold" : "Helvetica").fontSize(11).fillColor(INK);
  d.text(links, RAND, y, { width: breite * 0.6, continued: false });
  d.text(rechts, RAND + breite * 0.6, y, { width: breite * 0.4, align: "right" });
  d.moveDown(0.35);
}

// --- Terminliste ------------------------------------------------------------

export type TerminlisteDaten = {
  schuelerName: string;
  schuljahrName: string;
  zeiten: { wochentag: number; uhrzeit?: string }[];
  termine: string[];
};

export async function terminlistePdf(dat: TerminlisteDaten): Promise<Buffer> {
  const d = neuesDokument();
  const zeitText = dat.zeiten
    .map((z) => `${WOCHENTAGE[z.wochentag]}${z.uhrzeit ? ` ${z.uhrzeit.slice(0, 5)} Uhr` : ""}`)
    .join(" und ");

  kopf(d, `Terminliste Schuljahr ${dat.schuljahrName}`, `${dat.schuelerName} · ${zeitText}`);

  d.fontSize(11).fillColor(GRAU)
    .text(`${dat.termine.length} Termine. Unterrichtsfreie Tage (Ferien und Feiertage) sind bereits ausgenommen.`);
  d.moveDown(0.8);

  // Termine in vier Spalten – passt fürs ganze Schuljahr auf eine Seite
  const spalten = 4;
  const breite = (d.page.width - 2 * RAND) / spalten;
  const proSpalte = Math.ceil(dat.termine.length / spalten);
  const startY = d.y;
  d.fontSize(10).fillColor(INK).font("Helvetica");

  for (let s = 0; s < spalten; s++) {
    const teil = dat.termine.slice(s * proSpalte, (s + 1) * proSpalte);
    let y = startY;
    teil.forEach((t, i) => {
      // Durchlaufende Nummer über alle Spalten hinweg – so lässt sich am
      // Telefon schnell sagen „die 14. Stunde am …".
      const nr = s * proSpalte + i + 1;
      d.fillColor(GRAU).text(`${nr}.`, RAND + s * breite, y, { width: 22, align: "right" });
      d.fillColor(INK).text(datumDe(t), RAND + s * breite + 26, y, { width: breite - 34 });
      y += 15;
    });
  }
  d.y = startY + proSpalte * 15 + 12;

  return fertig(d);
}

// --- Vertragsbestätigung ----------------------------------------------------

export type VertragsbestaetigungDaten = {
  schuelerName: string;
  schuljahrName: string;
  zeiten: { wochentag: number; uhrzeit?: string }[];
  posten: { wochentag: number; anzahl: number; satzCent: number; ermaessigt?: boolean }[];
  jahresbetragCent: number;
  zahlweise: "raten" | "einmal";
  raten: { monat: string; betragCent: number }[];
  einmalCent: number;
  bestaetigtAm: string;   // ISO
};

export async function vertragsbestaetigungPdf(dat: VertragsbestaetigungDaten): Promise<Buffer> {
  const d = neuesDokument();
  const bank = bankverbindung();
  const zeitText = dat.zeiten
    .map((z) => `${WOCHENTAGE[z.wochentag]}${z.uhrzeit ? ` ${z.uhrzeit.slice(0, 5)} Uhr` : ""}`)
    .join(" und ");

  kopf(d, "Vertragsbestätigung", `Schuljahr ${dat.schuljahrName}`);

  zeile(d, "Schüler/in", dat.schuelerName, true);
  zeile(d, "Wochentermin", zeitText);
  d.moveDown(0.6);

  d.font("Helvetica-Bold").fontSize(12).fillColor(INK).text("Jahresbetrag");
  d.moveDown(0.3);
  for (const p of dat.posten) {
    zeile(d, `${WOCHENTAGE[p.wochentag]}: ${p.anzahl} Termine × ${centFormat(p.satzCent)}`
      + (p.ermaessigt ? " (Familienpreis)" : ""),
      centFormat(p.anzahl * p.satzCent));
  }
  zeile(d, "Jahresbetrag gesamt", centFormat(dat.jahresbetragCent), true);
  d.moveDown(0.7);

  d.font("Helvetica-Bold").fontSize(12).text("Gewählte Zahlweise");
  d.moveDown(0.3);
  if (dat.zahlweise === "einmal") {
    zeile(d, "Einmalzahlung (50,00 € Nachlass)", centFormat(dat.einmalCent), true);
    d.fontSize(10).fillColor(GRAU).text("Fällig innerhalb von 14 Tagen nach Vertragsbestätigung.");
  } else {
    zeile(d, `Monatsraten (${dat.raten.length} Raten)`, "", true);
    for (const r of dat.raten) {
      const [j, m] = r.monat.split("-");
      const name = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli",
        "August", "September", "Oktober", "November", "Dezember"][Number(m) - 1];
      zeile(d, `${name} ${j}`, centFormat(r.betragCent));
    }
    d.fontSize(10).fillColor(GRAU).text("Jede Rate ist vom 1. bis 10. des Monats fällig.");
  }
  d.moveDown(0.8);

  d.font("Helvetica-Bold").fontSize(12).fillColor(INK).text("Bankverbindung");
  d.moveDown(0.3);
  zeile(d, "Kontoinhaberin", bank.inhaber);
  zeile(d, "IBAN", bank.iban);
  if (bank.bank) zeile(d, "Bank", bank.bank);
  zeile(d, "Verwendungszweck", `Nachhilfe ${dat.schuelerName} ${dat.schuljahrName}`);
  d.moveDown(0.9);

  d.fontSize(10).fillColor(GRAU)
    .text(`Bestätigt am ${datumDe(dat.bestaetigtAm.slice(0, 10))}. Dieses Dokument dient als Jahresbeleg und ist jederzeit im Portal abrufbar.`);

  return fertig(d);
}

// --- Plusstunden-Abrechnung -------------------------------------------------

export type PlusstundenDaten = {
  schuelerName: string;
  termine: string[];
  stundensatzCent: number;
  summeCent: number;
  faelligAm: string;      // ISO
  erstelltAm: string;     // ISO
};

export async function plusstundenPdf(dat: PlusstundenDaten): Promise<Buffer> {
  const d = neuesDokument();
  const bank = bankverbindung();

  kopf(d, "Abrechnung Zusatzstunden", `${dat.schuelerName} · ${datumDe(dat.erstelltAm.slice(0, 10))}`);

  d.fontSize(11).fillColor(GRAU).text(
    "Diese Stunden liegen über dem im Schuljahresvertrag vereinbarten Wochentermin und werden "
    + "zusätzlich abgerechnet. Nachhol- und Minusstunden sind bereits verrechnet.",
  );
  d.moveDown(0.8);

  d.font("Helvetica-Bold").fontSize(12).fillColor(INK).text("Abgerechnete Stunden");
  d.moveDown(0.3);
  for (const t of dat.termine) zeile(d, datumDe(t), centFormat(dat.stundensatzCent));
  zeile(d, `${dat.termine.length} Zusatzstunden gesamt`, centFormat(dat.summeCent), true);
  d.moveDown(0.8);

  d.font("Helvetica-Bold").fontSize(12).fillColor(INK).text("Zahlung");
  d.moveDown(0.3);
  zeile(d, "Fällig bis", datumDe(dat.faelligAm.slice(0, 10)), true);
  zeile(d, "Kontoinhaberin", bank.inhaber);
  zeile(d, "IBAN", bank.iban);
  if (bank.bank) zeile(d, "Bank", bank.bank);
  zeile(d, "Verwendungszweck", `Zusatzstunden ${dat.schuelerName}`);
  d.moveDown(0.9);

  d.fontSize(10).fillColor(GRAU).text(
    "Kleinunternehmerin nach § 19 UStG – es wird keine Umsatzsteuer ausgewiesen.",
  );

  return fertig(d);
}

// --- Jahresbescheinigung ----------------------------------------------------

export type BescheinigungPdfDaten = {
  schuelerName: string;
  schuljahrName: string;
  posten: { datum: string; betragCent: number }[];
  summeCent: number;
  erstelltAm: string;    // ISO
};

export async function bescheinigungPdf(dat: BescheinigungPdfDaten): Promise<Buffer> {
  const d = neuesDokument();

  kopf(d, "Zahlungsbescheinigung", `${dat.schuelerName} · Schuljahr ${dat.schuljahrName}`);

  d.fontSize(11).fillColor(GRAU).text(
    "Hiermit wird bestätigt, dass für die unten aufgeführten Nachhilfestunden die "
    + "folgenden Zahlungen eingegangen sind.",
  );
  d.moveDown(0.8);

  d.font("Helvetica-Bold").fontSize(12).fillColor(INK).text("Eingegangene Zahlungen");
  d.moveDown(0.3);
  if (!dat.posten.length) {
    d.font("Helvetica").fontSize(11).fillColor(GRAU).text("Bisher sind keine Zahlungen vermerkt.");
    d.moveDown(0.4);
  } else {
    for (const p of dat.posten) zeile(d, datumDe(p.datum.slice(0, 10)), centFormat(p.betragCent));
  }
  zeile(d, "Summe", centFormat(dat.summeCent), true);
  d.moveDown(0.9);

  d.font("Helvetica").fontSize(10).fillColor(GRAU).text(
    "Kleinunternehmerin nach § 19 UStG – es wird keine Umsatzsteuer ausgewiesen. "
    + "Nachhilfeunterricht kann je nach persönlicher Situation steuerlich absetzbar sein; "
    + "das prüft das zuständige Finanzamt.",
    { lineGap: 1.5 },
  );
  d.moveDown(0.9);
  d.fillColor(INK).fontSize(11).font("Helvetica")
    .text(`München, den ${datumDe(dat.erstelltAm.slice(0, 10))}`);
  d.moveDown(0.3);
  d.text("Kleana Carciu · Lerne mit Anna");

  return fertig(d);
}

// --- AGB --------------------------------------------------------------------

export type Abschnitt = { titel: string; text: string };

export async function textPdf(titel: string, unterzeile: string, abschnitte: Abschnitt[]): Promise<Buffer> {
  const d = neuesDokument();
  kopf(d, titel, unterzeile);
  for (const a of abschnitte) {
    d.font("Helvetica-Bold").fontSize(11).fillColor(INK).text(a.titel);
    d.moveDown(0.2);
    d.font("Helvetica").fontSize(10).fillColor(GRAU).text(a.text, { align: "left", lineGap: 1.5 });
    d.moveDown(0.6);
    d.fillColor(INK);
  }
  return fertig(d);
}
