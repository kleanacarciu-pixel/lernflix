// =============================================================================
// Schuljahresmodell – Preisberechnung (ohne Datenbank)
//
// Gerechnet wird durchgehend in CENT als ganze Zahlen. Mit Kommazahlen
// entstehen sonst Rundungsfehler, und die Summe aller Raten müsste nicht
// mehr exakt dem Jahresbetrag entsprechen.
//
// Der Datenbank-Teil liegt in lib/vertrag.ts.
// =============================================================================

export type Zahlweise = "raten" | "einmal";

/** Ein Wochentermin des Vertrags mit der Anzahl seiner Termine im Schuljahr. */
export type TerminTag = {
  wochentag: number;   // 0=Mo .. 6=So
  anzahl: number;      // Termine dieses Wochentags im Schuljahr
};

/** Nachlass bei Einmalzahlung. */
export const EINMAL_NACHLASS_CENT = 50_00;

/** Standard-Abschlag für Zweittermin bzw. zweites Kind. */
export const ZWEIT_ABSCHLAG_CENT = 5_00;

// --- Geldbeträge ------------------------------------------------------------

/** 45.5 -> 4550. Kaufmännisch gerundet, damit 4.56 nicht zu 455 wird. */
export function euroZuCent(euro: number): number {
  return kaufmaennisch(euro * 100);
}

/** 4550 -> "45,50 €" */
export function centFormat(cent: number): string {
  const v = (cent / 100).toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return `${v} €`;
}

/**
 * Kaufmännische Rundung (0,5 wird aufgerundet – auch bei negativen Beträgen
 * vom Betrag weg). Math.round rundet -0.5 zu -0, das wäre hier falsch.
 */
export function kaufmaennisch(x: number): number {
  return x < 0 ? -Math.round(-x) : Math.round(x);
}

// --- Jahresbetrag -----------------------------------------------------------

export type Preisaufstellung = {
  jahresbetragCent: number;
  posten: { wochentag: number; anzahl: number; satzCent: number; summeCent: number; voll: boolean }[];
};

/**
 * Jahresbetrag aus den Wochenterminen.
 *
 *  * Ein Wochentermin: voller Stundensatz.
 *  * Zwei Wochentermine: voller Satz auf den Tag mit MEHR Terminen,
 *    reduzierter Satz auf den anderen. Bei Gleichstand bekommt der frühere
 *    Wochentag den vollen Satz (damit das Ergebnis eindeutig bleibt).
 *  * Flag „zweites Kind" bei nur einem Wochentermin: der gesamte Vertrag
 *    läuft zum reduzierten Satz – der Nachlass gilt hier dem Geschwisterkind,
 *    nicht einem Zweittermin.
 */
export function berechneJahresbetrag(opt: {
  tage: TerminTag[];
  stundensatzCent: number;
  stundensatzZweitCent: number;
  zweitesKind?: boolean;
}): Preisaufstellung {
  const { stundensatzCent, stundensatzZweitCent, zweitesKind = false } = opt;
  const tage = opt.tage.filter((t) => t.anzahl > 0);
  if (tage.length === 0) return { jahresbetragCent: 0, posten: [] };

  // Meiste Termine zuerst; bei Gleichstand der frühere Wochentag.
  const sortiert = [...tage].sort((a, b) => b.anzahl - a.anzahl || a.wochentag - b.wochentag);

  const posten = sortiert.map((t, i) => {
    // Der erste Tag bekommt den vollen Satz – außer der Vertrag ist als
    // zweites Kind angelegt und hat nur einen einzigen Wochentermin.
    const voll = i === 0 && !(zweitesKind && sortiert.length === 1);
    const satzCent = voll ? stundensatzCent : stundensatzZweitCent;
    return { wochentag: t.wochentag, anzahl: t.anzahl, satzCent, summeCent: t.anzahl * satzCent, voll };
  });

  return { jahresbetragCent: posten.reduce((s, p) => s + p.summeCent, 0), posten };
}

/** Einmalzahlung: Jahresbetrag abzüglich Nachlass (nie unter null). */
export function einmalbetragCent(jahresbetragCent: number): number {
  return Math.max(0, jahresbetragCent - EINMAL_NACHLASS_CENT);
}

// --- Raten ------------------------------------------------------------------

/**
 * Ratenmonate vom Vertragsbeginn bis einschließlich Juli des Schuljahresendes.
 * August ist nie ein Ratenmonat.
 *
 * @returns Monatserste als ISO-Daten, z. B. ["2027-03-01", ...]
 */
export function ratenMonate(vertragsbeginn: string, letzterSchultag: string): string[] {
  const [bJahr, bMonat] = vertragsbeginn.split("-").map(Number);
  const zielJahr = Number(letzterSchultag.split("-")[0]);
  const monate: string[] = [];

  let jahr = bJahr, monat = bMonat;
  // Obergrenze: Juli des Jahres, in dem das Schuljahr endet.
  while (jahr < zielJahr || (jahr === zielJahr && monat <= 7)) {
    if (monat !== 8) monate.push(`${jahr}-${String(monat).padStart(2, "0")}-01`);
    monat++;
    if (monat > 12) { monat = 1; jahr++; }
    if (monate.length > 24) break; // Sicherheitsnetz gegen Fehleingaben
  }
  return monate;
}

/**
 * Jahresbetrag auf n Raten verteilen.
 * Alle Raten gleich hoch (kaufmännisch gerundet), die LETZTE gleicht die
 * Rundungsdifferenz aus – die Summe ist damit exakt der Jahresbetrag.
 */
export function berechneRaten(jahresbetragCent: number, anzahl: number): number[] {
  if (anzahl <= 0) return [];
  if (anzahl === 1) return [jahresbetragCent];
  const rate = kaufmaennisch(jahresbetragCent / anzahl);
  const raten = Array(anzahl - 1).fill(rate) as number[];
  raten.push(jahresbetragCent - rate * (anzahl - 1));
  return raten;
}

/** Fällige Raten mit Monat – die Zahlungsplanung eines Vertrags. */
export type Ratenplan = { monat: string; betragCent: number }[];

export function ratenplan(opt: {
  jahresbetragCent: number;
  vertragsbeginn: string;
  letzterSchultag: string;
}): Ratenplan {
  const monate = ratenMonate(opt.vertragsbeginn, opt.letzterSchultag);
  const betraege = berechneRaten(opt.jahresbetragCent, monate.length);
  return monate.map((monat, i) => ({ monat, betragCent: betraege[i] }));
}

/**
 * Raten nach einer Vertragsänderung neu verteilen (Abschnitt 5).
 * Bereits fällige Raten bleiben unangetastet; der Rest wird auf die
 * verbleibenden Monate verteilt.
 */
export function ratenNeuVerteilen(opt: {
  neuerJahresbetragCent: number;
  bereitsFaelligCent: number;
  verbleibendeMonate: string[];
}): Ratenplan {
  const rest = opt.neuerJahresbetragCent - opt.bereitsFaelligCent;
  const betraege = berechneRaten(rest, opt.verbleibendeMonate.length);
  return opt.verbleibendeMonate.map((monat, i) => ({ monat, betragCent: betraege[i] }));
}

// --- Buchungssperre (Abschnitt 4) -------------------------------------------

/**
 * Darf für diesen Schüler gebucht werden?
 *
 * Ohne laufenden Vertrag greift die Sperre NICHT – Probestunden und Schüler
 * ohne Schuljahresvertrag bleiben wie bisher möglich. Gibt es einen Vertrag,
 * muss er bestätigt sein.
 */
export function darfBuchen(
  vertrag: { status: string; agb_akzeptiert_am: string | null } | null,
): { erlaubt: boolean; grund?: string } {
  if (!vertrag) return { erlaubt: true };
  const laufend = vertrag.status === "angeboten" || vertrag.status === "aktiv";
  if (!laufend) return { erlaubt: true };
  if (!vertrag.agb_akzeptiert_am) {
    return { erlaubt: false, grund: "Bitte bestätige zuerst den Vertrag und die AGB." };
  }
  return { erlaubt: true };
}

// --- Wochentagswechsel (Abschnitt 5) ----------------------------------------

/** "2027-03-17" -> "2027-03-01" */
export function monatsErster(iso: string): string {
  return `${iso.slice(0, 7)}-01`;
}

/** Ein Tag zurück – für das bis_datum des alten Wochentags. */
export function tagDavor(iso: string): string {
  const [j, m, t] = iso.split("-").map(Number);
  const d = new Date(Date.UTC(j, m - 1, t) - 86_400_000);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getUTCFullYear()}-${p(d.getUTCMonth() + 1)}-${p(d.getUTCDate())}`;
}

/**
 * Teilt die Ratenmonate am Stichtag in „schon fällig" und „kommt noch".
 *
 * Eine Rate gilt als fällig, wenn ihr Monat vor dem Stichtagsmonat liegt –
 * oder wenn es der Stichtagsmonat selbst ist und der Stichtag nach dem 10.
 * liegt (bis dahin war sie zu zahlen). Nur die noch offenen Monate werden
 * nach einer Vertragsänderung neu berechnet; bereits gezahlte Raten bleiben
 * unangetastet.
 */
export function teileRatenmonate(monate: string[], stichtag: string): { faellig: string[]; verbleibend: string[] } {
  const stichMonat = monatsErster(stichtag);
  const stichTagImMonat = Number(stichtag.slice(8, 10));
  const faellig: string[] = [], verbleibend: string[] = [];
  for (const m of monate) {
    const schon = m < stichMonat || (m === stichMonat && stichTagImMonat > 10);
    (schon ? faellig : verbleibend).push(m);
  }
  return { faellig, verbleibend };
}

export type ZeitZeile = {
  wochentag: number;
  uhrzeit?: string;
  ab_datum?: string | null;
  bis_datum?: string | null;
};

/**
 * Wochentag eines Vertrags wechseln.
 *
 * Der alte Wochentag bekommt ein bis_datum (Tag vor dem Wechsel), der neue
 * ein ab_datum. Die Terminliste setzt sich danach zusammen aus allen alten
 * Terminen VOR dem Wechseldatum und allen neuen AB dem Wechseldatum.
 *
 * Ein zweiter Wochentermin bleibt unberührt.
 */
export function wochentagWechseln(zeiten: ZeitZeile[], opt: {
  alterWochentag: number;
  neuerWochentag: number;
  neueUhrzeit?: string;
  wechseldatum: string;
}): ZeitZeile[] {
  const { alterWochentag, neuerWochentag, neueUhrzeit, wechseldatum } = opt;
  const ende = tagDavor(wechseldatum);

  const angepasst = zeiten.map((z) => {
    if (z.wochentag !== alterWochentag) return z;
    // Schon beendete Zeilen nicht erneut abschneiden
    if (z.bis_datum && z.bis_datum <= ende) return z;
    return { ...z, bis_datum: ende };
  });

  const alt = zeiten.find((z) => z.wochentag === alterWochentag);
  angepasst.push({
    wochentag: neuerWochentag,
    uhrzeit: neueUhrzeit ?? alt?.uhrzeit,
    ab_datum: wechseldatum,
    bis_datum: null,
  });
  return angepasst;
}
