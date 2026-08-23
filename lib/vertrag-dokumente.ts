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
  /** Kleanas Unterschrift als Bytes – fehlt sie, bleibt das Feld leer. */
  unterschriftAnbieterin?: Buffer | null;
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

  unterschriftsfeld(d, dat.unterschriftAnbieterin ?? null);

  return fertig(d);
}

/**
 * Unterschrift der Anbieterin unten auf der Seite.
 * Ohne hinterlegtes Bild bleibt die Linie leer – die PDF entsteht trotzdem,
 * damit ein fehlendes Bild nie den ganzen Vertrag blockiert.
 */
function unterschriftsfeld(d: PDFKit.PDFDocument, bild: Buffer | null): void {
  d.moveDown(1.4);
  const y = d.y;
  const breite = 190;

  if (bild) {
    try {
      d.image(bild, RAND, y, { fit: [breite, 46] });
    } catch {
      // Unbrauchbares Bild: lieber ohne Unterschrift als ohne Vertrag.
    }
  }
  const linieY = y + 52;
  d.moveTo(RAND, linieY).lineTo(RAND + breite, linieY).strokeColor(GRAU).lineWidth(0.7).stroke();
  d.fontSize(9).fillColor(GRAU).font("Helvetica")
    .text("Kleana Carciu · Lerne mit Anna", RAND, linieY + 4, { width: breite });
  d.y = linieY + 20;
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

// --- Nachhilfevertrag (Vertragsabschluss im System) -------------------------

import {
  TITEL, ANBIETERIN, FUSSZEILE, unterzeile, HINWEIS_FERIEN, zahlungshinweis,
  WICHTIGSTES, BESTAETIGUNG_AGB, BESTAETIGUNG_WIDERRUF, FARBEN,
} from "@/lib/vertrag-pdf-texte";

export type VertragPdfDaten = {
  schuljahrName: string;
  /** Erziehungsberechtigte – Unbekanntes wird weggelassen. */
  eltern: { name?: string | null; anschrift?: string | null; email?: string | null; telefon?: string | null };
  kind: { name: string; schule?: string | null };
  /** Fester Wochentermin. */
  zeiten: { wochentag: number; uhrzeit?: string | null }[];
  anzahlTermine: number;
  /** Beginn bei Quereinstieg – nur gesetzt, wenn nicht ab Schuljahresbeginn. */
  abDatum?: string | null;
  stundensatzCent: number;
  jahresbetragCent: number;
  zahlweise: "raten" | "einmal";
  raten: { monat: string; betragCent: number }[];
  einmalCent: number;
  /** Zeitstempel der beiden Bestätigungen (ISO) – null = noch offen. */
  agbBestaetigtAm?: string | null;
  widerrufBestaetigtAm?: string | null;
  /** Unterschriften als Bytes. */
  unterschriftAnbieterin?: Buffer | null;
  unterschriftEltern?: Buffer | null;
  unterzeichnetAm?: string | null;
};

const zeitstempel = (iso: string) => {
  const d = new Date(iso);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(d.getUTCDate())}.${p(d.getUTCMonth() + 1)}.${d.getUTCFullYear()}, `
    + `${p(d.getUTCHours())}:${p(d.getUTCMinutes())} Uhr`;
};

/**
 * Ankreuzkästchen als Vektor.
 *
 * Die Zeichen ✓ und □ stehen NICHT im WinAnsi-Zeichensatz der eingebauten
 * PDF-Schriften – sie kämen gar nicht an. Deshalb gezeichnet statt gesetzt.
 */
function kaestchen(d: PDFKit.PDFDocument, x: number, y: number, gesetzt: boolean): void {
  d.save();
  d.rect(x, y, 8.5, 8.5).lineWidth(0.7).strokeColor(gesetzt ? FARBEN.teal : FARBEN.grau).stroke();
  if (gesetzt) {
    d.moveTo(x + 1.8, y + 4.4).lineTo(x + 3.5, y + 6.4).lineTo(x + 6.8, y + 1.9)
      .lineWidth(1.3).strokeColor(FARBEN.teal).stroke();
  }
  d.restore();
}

/** Überschrift eines Abschnitts – Times-Bold auf Teal. */
function abschnitt(d: PDFKit.PDFDocument, nummer: number, titel: string, x = 56): void {
  d.moveDown(0.75);
  // Ausdrücklich am linken Rand: pdfkit merkt sich sonst die letzte
  // Schreibposition, und die lag zuletzt in einem Formularkasten.
  d.font("Times-Bold").fontSize(12).fillColor(FARBEN.teal)
    .text(`${nummer}. ${titel}`, x, d.y);
  d.moveDown(0.3);
  d.font("Helvetica").fontSize(9.5).fillColor(FARBEN.ink);
}

/**
 * Der eigentliche Nachhilfevertrag – eine Seite, alle Daten aus der Datenbank.
 *
 * Das Layout folgt Kleanas Vorlage: zentrierter Kopf mit goldener Linie,
 * die Parteien als beschriftete Formularzeilen, Ankreuzkästchen für die
 * Zahlweise und Unterschriftslinien unten. Wo in der Vorlage leere Felder
 * zum Ausfüllen stehen, steht hier der Wert aus der Datenbank.
 */
export async function nachhilfevertragPdf(dat: VertragPdfDaten): Promise<Buffer> {
  const d = new PDFDocument({ size: "A4", margin: 56, info: { Title: TITEL, Author: "Lerne mit Anna" } });
  const R = 56;
  const breite = d.page.width - 2 * R;
  const mitte = d.page.width / 2;

  // --- Kopf: zentriert, darunter eine goldene Linie ---
  d.font("Times-Bold").fontSize(20).fillColor(FARBEN.ink)
    .text(TITEL, R, 54, { width: breite, align: "center" });
  d.moveDown(0.25);
  d.font("Helvetica").fontSize(9.5).fillColor(FARBEN.teal)
    .text(unterzeile(dat.schuljahrName), { width: breite, align: "center", characterSpacing: 0.4 });
  d.moveDown(0.55);
  d.moveTo(R, d.y).lineTo(R + breite, d.y).strokeColor(FARBEN.gold).lineWidth(0.9).stroke();
  d.moveDown(0.85);

  // --- Parteien ---
  const yZw = d.y;
  d.font("Helvetica").fontSize(9).fillColor(FARBEN.teal).text("Zwischen", R, yZw, { width: 58 });
  d.font("Helvetica-Bold").fontSize(9).fillColor(FARBEN.ink)
    .text(ANBIETERIN.zeile, R + 62, yZw, { width: breite - 62 });
  d.font("Helvetica").fontSize(9).fillColor(FARBEN.ink)
    .text(`(${ANBIETERIN.rolle}) und`, R, d.y, { width: breite });
  d.moveDown(0.45);

  zeileMitFeld(d, R, breite, "Name des Erziehungsberechtigten:", dat.eltern.name);
  zeileMitFeld(d, R, breite, "Anschrift:", dat.eltern.anschrift);
  zeileMitFeld(d, R, breite, "E-Mail / Telefon:",
    [dat.eltern.email, dat.eltern.telefon].filter(Boolean).join(" · "));
  zeileMitFeld(d, R, breite, "Name des Kindes / Schule:",
    [dat.kind.name, dat.kind.schule].filter(Boolean).join(" · "));

  // --- 1. Unterricht ---
  abschnitt(d, 1, "Unterricht");
  const zeitText = dat.zeiten
    .map((z) => `${WOCHENTAGE[z.wochentag]}${z.uhrzeit ? ` ${String(z.uhrzeit).slice(0, 5)} Uhr` : ""}`)
    .join(" und ");
  zeileMitFeld(d, R, breite, "Fester Wochentermin (Tag / Uhrzeit):", zeitText, "Dauer: 60 Min.", 190);
  zeileMitFeld(d, R, breite,
    `Unterrichtstermine im Vertragszeitraum laut Terminliste (Anlage):`,
    `${dat.anzahlTermine}${dat.abDatum ? ` (ab ${datumDe(dat.abDatum)})` : ""}`, "Termine", 270);
  d.moveDown(0.15);
  d.font("Helvetica").fontSize(8).fillColor(FARBEN.grau)
    .text(HINWEIS_FERIEN, R, d.y, { width: breite, lineGap: 0.5 });

  // --- 2. Vergütung ---
  abschnitt(d, 2, "Vergütung und Zahlung");
  const yV = d.y;
  d.font("Helvetica").fontSize(9).fillColor(FARBEN.ink).text("Stundensatz:", R, yV, { width: 90 });
  feldKasten(d, R + 92, yV - 3, 96, centFormat(dat.stundensatzCent));
  d.font("Helvetica").fontSize(9).fillColor(FARBEN.ink)
    .text("· Schuljahresbetrag gesamt:", R + 196, yV, { width: 140 });
  feldKasten(d, R + 336, yV - 3, 110, centFormat(dat.jahresbetragCent));
  d.y = yV + 20;

  d.font("Helvetica").fontSize(9).fillColor(FARBEN.ink).text("Zahlweise:", R, d.y);
  d.moveDown(0.25);
  ankreuzZeile(d, R, dat.zahlweise === "raten",
    `${dat.raten.length} Monatsraten à ${centFormat(dat.raten[0]?.betragCent ?? 0)} (Sep–Jul, fällig 1.–10.)`);
  ankreuzZeile(d, R, dat.zahlweise === "einmal",
    `Einmalzahlung von ${centFormat(dat.einmalCent)} (Jahresbetrag – 50 €)`);
  d.moveDown(0.2);
  d.font("Helvetica").fontSize(8).fillColor(FARBEN.grau)
    .text(zahlungshinweis(dat.kind.name.split(" ")[0], dat.schuljahrName), R, d.y, { width: breite });

  // --- 3. Das Wichtigste ---
  abschnitt(d, 3, "Das Wichtigste auf einen Blick");
  for (const p of WICHTIGSTES) {
    d.font("Helvetica-Bold").fontSize(8.5).fillColor(FARBEN.ink)
      .text(`${p.titel}: `, { continued: true });
    d.font("Helvetica").fillColor(FARBEN.grau).text(p.text, { lineGap: 0.6 });
    d.moveDown(0.2);
  }

  // --- Bestätigungen ---
  d.moveDown(0.5);
  for (const [text, wann] of [
    [BESTAETIGUNG_AGB, dat.agbBestaetigtAm],
    [BESTAETIGUNG_WIDERRUF, dat.widerrufBestaetigtAm],
  ] as [string, string | null | undefined][]) {
    const y = d.y;
    kaestchen(d, R, y + 1, !!wann);
    d.font("Helvetica").fontSize(8.5).fillColor(FARBEN.ink)
      .text(text, R + 16, y, { width: breite - 16, lineGap: 0.6 });
    if (wann) {
      d.fontSize(7).fillColor(FARBEN.grau)
        .text(`bestätigt am ${zeitstempel(wann)}`, R + 16, d.y + 1);
    }
    d.moveDown(0.45);
  }

  // --- Unterschriften: links Eltern, rechts Kleana (wie in der Vorlage) ---
  const sigY = Math.max(d.y + 26, d.page.height - 168);
  const spalte = (breite - 40) / 2;
  const felder: [number, Buffer | null | undefined, string, string][] = [
    [R, dat.unterschriftEltern, "Ort, Datum · Unterschrift Erziehungsberechtigte(r)",
      dat.unterzeichnetAm ? zeitstempel(dat.unterzeichnetAm) : ""],
    [R + spalte + 40, dat.unterschriftAnbieterin, `Ort, Datum · Unterschrift ${ANBIETERIN.name}`,
      `${ANBIETERIN.ort}, den ${datumDe(new Date().toISOString().slice(0, 10))}`],
  ];
  for (const [x, bild, beschriftung, wann] of felder) {
    if (bild) {
      try { d.image(bild, x + 4, sigY, { fit: [spalte - 8, 40] }); } catch { /* lieber ohne Bild */ }
    }
    const linie = sigY + 46;
    d.moveTo(x, linie).lineTo(x + spalte, linie).strokeColor(FARBEN.grau).lineWidth(0.6).stroke();
    d.font("Helvetica").fontSize(7.5).fillColor(FARBEN.teal)
      .text(beschriftung, x, linie + 4, { width: spalte, lineBreak: false });
    if (wann) {
      d.fontSize(7).fillColor(FARBEN.grau).text(wann, x, linie + 15, { width: spalte, lineBreak: false });
    }
  }

  // --- Fußzeile mit goldener Linie darüber ---
  const fussY = d.page.height - d.page.margins.bottom - 16;
  d.moveTo(mitte - 90, fussY - 10).lineTo(mitte + 90, fussY - 10)
    .strokeColor(FARBEN.gold).lineWidth(0.8).stroke();
  d.font("Helvetica").fontSize(7.5).fillColor(FARBEN.grau)
    .text(FUSSZEILE, R, fussY, { width: breite, align: "center", lineBreak: false });

  return new Promise((loesen, ablehnen) => {
    const teile: Buffer[] = [];
    d.on("data", (c: Buffer) => teile.push(c));
    d.on("end", () => loesen(Buffer.concat(teile)));
    d.on("error", ablehnen);
    d.end();
  });
}

/** Beschriftung links, Wert in einem hellen Kasten rechts – wie im Formular. */
function zeileMitFeld(
  d: PDFKit.PDFDocument, R: number, breite: number,
  beschriftung: string, wert?: string | null, nachtext?: string, labelBreite = 175,
): void {
  const y = d.y;
  d.font("Helvetica").fontSize(9).fillColor(FARBEN.teal)
    .text(beschriftung, R, y + 2, { width: labelBreite, lineBreak: false });
  const x = R + labelBreite + 6;
  const feldBreite = nachtext ? breite - labelBreite - 6 - 82 : breite - labelBreite - 6;
  feldKasten(d, x, y - 1, feldBreite, wert);
  if (nachtext) {
    d.font("Helvetica").fontSize(9).fillColor(FARBEN.ink)
      .text(nachtext, x + feldBreite + 8, y + 2, { width: 76, lineBreak: false });
  }
  d.y = y + 21;
}

/** Heller Kasten mit dem Wert darin – dort, wo die Vorlage ein Feld zeigt. */
function feldKasten(
  d: PDFKit.PDFDocument, x: number, y: number, breite: number, wert?: string | null,
): void {
  d.save();
  d.roundedRect(x, y, breite, 17, 2.5).fillColor("#F6F7F8").fill();
  d.roundedRect(x, y, breite, 17, 2.5).lineWidth(0.5).strokeColor("#D8DCDF").stroke();
  d.restore();
  if (wert) {
    d.font("Helvetica-Bold").fontSize(8.5).fillColor(FARBEN.ink)
      .text(wert, x + 6, y + 4.5, { width: breite - 12, lineBreak: false, ellipsis: true });
  }
}

/** Ankreuzzeile für die Zahlweise. */
function ankreuzZeile(d: PDFKit.PDFDocument, R: number, gesetzt: boolean, text: string): void {
  const y = d.y;
  kaestchen(d, R + 6, y + 1, gesetzt);
  d.font(gesetzt ? "Helvetica-Bold" : "Helvetica").fontSize(9)
    .fillColor(gesetzt ? FARBEN.teal : FARBEN.grau)
    .text(text, R + 22, y, { width: 430, lineBreak: false });
  d.y = y + 16;
}
