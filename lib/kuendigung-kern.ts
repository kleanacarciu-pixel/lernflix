// =============================================================================
// Schuljahresmodell – Kündigung und Endabrechnung (ohne Datenbank)
//
// Zwei Dinge stecken hier drin:
//
//  1. Die Frist. Gekündigt wird zum Monatsende mit mindestens vier Wochen
//     Vorlauf. Geprüft wird das immer, verboten wird es nie – Kleana darf
//     einen früheren Termin setzen, bekommt aber einen Hinweis dazu.
//
//  2. Die Abrechnung. Gezahlt wird, was tatsächlich stattgefunden hat:
//     Vertragstermine bis zum Vertragsende zum vollen Satz, dazu noch nicht
//     abgerechnete Zusatzstunden. Rechtzeitige Absagen und Absagen durch Anna
//     fallen raus; kurzfristige Absagen (Vier-Stunden-Regel) bleiben drin.
//
// Bewusst ohne Importe, damit die Regeln ohne Datenbank testbar bleiben.
// =============================================================================

/** Mindestvorlauf einer Kündigung. */
export const KUENDIGUNGSFRIST_TAGE = 28;

const p2 = (n: number) => String(n).padStart(2, "0");
const iso = (d: Date) => `${d.getUTCFullYear()}-${p2(d.getUTCMonth() + 1)}-${p2(d.getUTCDate())}`;

/** ISO-Datum um n Tage verschieben (UTC, damit die Sommerzeit nichts verschiebt). */
export function plusTage(datum: string, n: number): string {
  const [j, m, t] = datum.split("-").map(Number);
  return iso(new Date(Date.UTC(j, m - 1, t) + n * 86_400_000));
}

/** Letzter Tag des Monats, in dem dieses Datum liegt. */
export function monatsEnde(datum: string): string {
  const [j, m] = datum.split("-").map(Number);
  return iso(new Date(Date.UTC(j, m, 0)));   // Tag 0 des Folgemonats = letzter Tag
}

/** Monatsende des Folgemonats. */
function naechstesMonatsEnde(datum: string): string {
  const [j, m] = datum.split("-").map(Number);
  return iso(new Date(Date.UTC(j, m + 1, 0)));
}

/**
 * Frühestmöglicher Kündigungstermin: das erste Monatsende, das mindestens
 * vier Wochen in der Zukunft liegt.
 */
export function fruehesteKuendigung(heute: string): string {
  const frist = plusTage(heute, KUENDIGUNGSFRIST_TAGE);
  const dieserMonat = monatsEnde(heute);
  return dieserMonat >= frist ? dieserMonat : naechstesMonatsEnde(heute);
}

export type Fristpruefung = {
  ok: boolean;
  fruehestens: string;
  /** Hinweise – nie eine Blockade, Kleana darf bewusst abweichen. */
  hinweise: string[];
};

/** Gewünschten Kündigungstermin prüfen. */
export function pruefeKuendigung(heute: string, zum: string): Fristpruefung {
  const fruehestens = fruehesteKuendigung(heute);
  const hinweise: string[] = [];

  if (zum !== monatsEnde(zum)) hinweise.push("Gekündigt wird normalerweise zum Monatsende.");
  if (zum < fruehestens) hinweise.push(`Die Vier-Wochen-Frist wäre erst zum ${fruehestens} eingehalten.`);
  if (zum < heute) hinweise.push("Das Datum liegt in der Vergangenheit.");

  return { ok: hinweise.length === 0, fruehestens, hinweise };
}

// --- Endabrechnung ----------------------------------------------------------

export type Vertragstermin = { datum: string; satzCent: number };

/**
 * „gutschrift"    – rechtzeitig abgesagt oder von Anna abgesagt: fällt raus.
 * „kurzfristig"   – weniger als vier Stunden vorher abgesagt: zählt wie gehalten.
 */
export type AbsageArt = "gutschrift" | "kurzfristig";
export type Absage = { datum: string; art: AbsageArt };

export type Endabrechnung = {
  bisDatum: string;
  gehalten: Vertragstermin[];
  /** darunter: kurzfristig abgesagt, zählt trotzdem (Vier-Stunden-Regel) */
  kurzfristig: string[];
  /** rechtzeitig oder von Anna abgesagt – nicht berechnet */
  entfallen: string[];
  zusatz: Vertragstermin[];
  vertragSollCent: number;
  zusatzSollCent: number;
  sollCent: number;
  gezahltCent: number;
  /** positiv = Erstattung an die Familie, negativ = Nachzahlung */
  differenzCent: number;
  art: "erstattung" | "nachzahlung" | "ausgeglichen";
  /** Bei Einmalzahlung: der 50-€-Nachlass gilt nur fürs volle Schuljahr. */
  nachlassEntfaellt: boolean;
};

/**
 * Endabrechnung eines gekündigten Vertrags.
 *
 * Der Nachlass für die Einmalzahlung wird hier gar nicht erst angesetzt: das
 * Soll entsteht aus den tatsächlich gehaltenen Stunden zum vollen Satz. Wer
 * einmal gezahlt und vorzeitig beendet hat, bekommt entsprechend 50 € weniger
 * zurück – deshalb wird das im Ergebnis ausdrücklich ausgewiesen.
 */
export function endabrechnung(opt: {
  termine: Vertragstermin[];
  absagen: Absage[];
  zusatzstunden: Vertragstermin[];
  bisDatum: string;
  gezahltCent: number;
  einmalzahlung?: boolean;
}): Endabrechnung {
  const { termine, absagen, zusatzstunden, bisDatum, gezahltCent } = opt;

  // Eine Gutschrift schlägt eine kurzfristige Absage am selben Tag.
  const art = new Map<string, AbsageArt>();
  for (const a of absagen) {
    if (a.art === "gutschrift" || !art.has(a.datum)) art.set(a.datum, a.art);
  }

  const gehalten: Vertragstermin[] = [];
  const kurzfristig: string[] = [];
  const entfallen: string[] = [];

  for (const t of termine) {
    if (t.datum > bisDatum) continue;
    const a = art.get(t.datum);
    if (a === "gutschrift") { entfallen.push(t.datum); continue; }
    if (a === "kurzfristig") kurzfristig.push(t.datum);
    gehalten.push(t);
  }

  const zusatz = zusatzstunden.filter((z) => z.datum <= bisDatum);

  const vertragSollCent = gehalten.reduce((s, t) => s + t.satzCent, 0);
  const zusatzSollCent = zusatz.reduce((s, t) => s + t.satzCent, 0);
  const sollCent = vertragSollCent + zusatzSollCent;
  const differenzCent = gezahltCent - sollCent;

  return {
    bisDatum, gehalten, kurzfristig, entfallen, zusatz,
    vertragSollCent, zusatzSollCent, sollCent, gezahltCent, differenzCent,
    art: differenzCent > 0 ? "erstattung" : differenzCent < 0 ? "nachzahlung" : "ausgeglichen",
    nachlassEntfaellt: opt.einmalzahlung === true,
  };
}

// --- Text für die E-Mail ----------------------------------------------------

const euro = (cent: number) =>
  (cent / 100).toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
const deutsch = (iso: string) => {
  const [j, m, t] = iso.split("-");
  return t ? `${t}.${m}.${j}` : iso;
};

/**
 * Fertiger Text zum Kopieren. Bewusst Reintext: Kleana fügt ihn in ihr
 * E-Mail-Programm ein und kann vorher jeden Satz noch ändern.
 *
 * Die Bankdaten kommen von außen, damit diese Funktion ohne Umgebung
 * auskommt und mitgetestet werden kann.
 */
export function abrechnungsText(a: Endabrechnung, opt: {
  schuelerName: string;
  schuljahrName: string;
  bank: { inhaber: string; iban: string };
}): string {
  const z: string[] = ["Hallo,", ""];

  z.push(
    `hier die Endabrechnung für ${opt.schuelerName}, Schuljahr ${opt.schuljahrName}.`,
    `Der Vertrag endet zum ${deutsch(a.bisDatum)}.`,
    "",
    `Stunden bis zum Vertragsende: ${a.gehalten.length}`,
  );
  if (a.kurzfristig.length) {
    z.push(`  davon kurzfristig abgesagt und deshalb berechnet: ${a.kurzfristig.length}`);
  }
  if (a.entfallen.length) {
    z.push(`Nicht berechnet (rechtzeitig oder von mir abgesagt): ${a.entfallen.length}`);
  }
  z.push(`Betrag dafür: ${euro(a.vertragSollCent)}`);

  if (a.zusatz.length) {
    z.push("", `Zusatzstunden über dem festen Termin: ${a.zusatz.length} = ${euro(a.zusatzSollCent)}`);
  }

  z.push("", `Summe: ${euro(a.sollCent)}`, `Bereits gezahlt: ${euro(a.gezahltCent)}`, "");

  if (a.art === "erstattung") {
    z.push(
      `Du bekommst ${euro(a.differenzCent)} zurück. Schick mir bitte kurz deine IBAN,`,
      "dann überweise ich den Betrag.",
    );
  } else if (a.art === "nachzahlung") {
    z.push(
      `Offen bleiben ${euro(-a.differenzCent)}.`,
      "",
      `Empfänger: ${opt.bank.inhaber}`,
      `IBAN: ${opt.bank.iban}`,
      `Verwendungszweck: Endabrechnung ${opt.schuelerName}`,
    );
  } else {
    z.push("Damit ist alles ausgeglichen – es ist nichts mehr offen.");
  }

  if (a.nachlassEntfaellt) {
    z.push(
      "",
      "Ein Hinweis zur Einmalzahlung: Der Nachlass von 50 € gilt für ein volles",
      "Schuljahr. Da der Vertrag vorzeitig endet, ist er in dieser Abrechnung",
      "nicht berücksichtigt.",
    );
  }

  z.push("", "Danke für die gemeinsame Zeit!", "", "Liebe Grüße", "Anna");
  return z.join("\n");
}
