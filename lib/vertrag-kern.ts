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

/**
 * Ein Wochentermin des Vertrags: seine konkreten Termine und der Zeitraum,
 * in dem er gilt. Der Zeitraum wird gebraucht, weil der Familienpreis
 * monatsweise gilt – ein Wochentermin kann mitten im Schuljahr enden.
 */
export type TerminTag = {
  wochentag: number;   // 0=Mo .. 6=So
  termine: string[];   // konkrete Daten, aufsteigend
  ab: string;          // erster Tag, an dem dieser Wochentermin gilt
  bis: string;         // letzter Tag, an dem er gilt
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

export type Posten = {
  wochentag: number;
  anzahl: number;
  satzCent: number;
  summeCent: number;
  /** true = Familienpreis (um ZWEIT_ABSCHLAG_CENT reduziert) */
  ermaessigt: boolean;
  /** Zeitraum dieses Postens – ein Wochentag kann zwei Posten haben. */
  von: string;
  bis: string;
};

export type Preisaufstellung = {
  jahresbetragCent: number;
  posten: Posten[];
  /** Monate, in denen der Familienpreis gilt ("YYYY-MM"). */
  familienMonate: string[];
};

/** Alle Monate "YYYY-MM" zwischen zwei Daten, beide einschließlich. */
export function monateZwischen(von: string, bis: string): string[] {
  const out: string[] = [];
  let j = Number(von.slice(0, 4)), m = Number(von.slice(5, 7));
  const endJ = Number(bis.slice(0, 4)), endM = Number(bis.slice(5, 7));
  while (j < endJ || (j === endJ && m <= endM)) {
    out.push(`${j}-${String(m).padStart(2, "0")}`);
    if (++m > 12) { m = 1; j++; }
  }
  return out;
}

/**
 * In welchen Monaten gilt der Familienpreis?
 *
 * Nur wenn zwei Wochentermine ECHT GLEICHZEITIG laufen. Das ist wichtig:
 * Bei einem Wochentagswechsel (Abschnitt 5) gibt es zwei Zeilen, die
 * aneinander anschließen – alter Tag bis zum 10.01., neuer ab dem 11.01.
 * Das ist EIN Wochentermin, der umzieht, und darf keinen Familienpreis
 * auslösen. Deshalb zählt die Überschneidung der Zeiträume, nicht die
 * bloße Anwesenheit im selben Monat.
 *
 * Maßgeblich ist der Geltungszeitraum, nicht ob zufällig ein Termin in den
 * Monat fällt – sonst würde ein Ferienmonat den Familienpreis kippen.
 */
export function familienMonateVon(tage: TerminTag[]): string[] {
  const monate = new Set<string>();
  for (let i = 0; i < tage.length; i++) {
    for (let j = i + 1; j < tage.length; j++) {
      const von = tage[i].ab > tage[j].ab ? tage[i].ab : tage[j].ab;
      const bis = tage[i].bis < tage[j].bis ? tage[i].bis : tage[j].bis;
      if (von > bis) continue;                      // keine Überschneidung
      for (const m of monateZwischen(von, bis)) monate.add(m);
    }
  }
  return [...monate].sort();
}

/**
 * Jahresbetrag aus den Wochenterminen.
 *
 * FAMILIENPREIS: Ab dem zweiten festen Wochentermin – zweites Kind oder
 * Doppeltermin – wird JEDER Termin der Familie mit dem reduzierten Satz
 * berechnet, nicht nur der zweite Tag.
 *
 * Endet einer der beiden Termine, gilt für den verbleibenden ab dem
 * FOLGEMONAT wieder der reguläre Satz (AGB § 6 Abs. 2). Deshalb kann ein
 * Wochentag zwei Posten haben: einen ermäßigten und einen regulären.
 */
export function berechneJahresbetrag(opt: {
  tage: TerminTag[];
  stundensatzCent: number;
  stundensatzZweitCent: number;
  zweitesKind?: boolean;
}): Preisaufstellung {
  const { stundensatzCent, stundensatzZweitCent, zweitesKind = false } = opt;
  const tage = opt.tage.filter((t) => t.termine.length > 0);
  if (tage.length === 0) return { jahresbetragCent: 0, posten: [], familienMonate: [] };

  const familien = new Set(familienMonateVon(tage));

  const posten: Posten[] = [];
  for (const t of [...tage].sort((a, b) => a.wochentag - b.wochentag)) {
    // Termine dieses Wochentags nach Satz gruppieren.
    const gruppen = new Map<boolean, string[]>();
    for (const d of [...t.termine].sort()) {
      const erm = zweitesKind || familien.has(d.slice(0, 7));
      const liste = gruppen.get(erm) ?? [];
      liste.push(d);
      gruppen.set(erm, liste);
    }
    // Ermäßigte Posten zuerst – sie liegen zeitlich vorn.
    for (const erm of [true, false]) {
      const daten = gruppen.get(erm);
      if (!daten?.length) continue;
      const satzCent = erm ? stundensatzZweitCent : stundensatzCent;
      posten.push({
        wochentag: t.wochentag, anzahl: daten.length, satzCent,
        summeCent: daten.length * satzCent, ermaessigt: erm,
        von: daten[0], bis: daten[daten.length - 1],
      });
    }
  }

  return {
    jahresbetragCent: posten.reduce((s, p) => s + p.summeCent, 0),
    posten,
    familienMonate: [...familien].sort(),
  };
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
