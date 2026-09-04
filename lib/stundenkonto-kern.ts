// =============================================================================
// Stundenkonto – die bestehenden Regeln, herausgelöst und dadurch testbar
//
// ACHTUNG: Hier wird nichts Neues entschieden. Die Regeln standen bisher
// mitten in app/api/kalender/route.ts zwischen den Datenbank-Aufrufen und
// waren deshalb nicht prüfbar. Sie sind unverändert übernommen; die Route
// ruft sie jetzt auf, statt sie selbst zu rechnen. Die Datenbank-Schreibungen
// bleiben in der Route – deshalb geben die Funktionen genau die Teil-Änderung
// zurück, die vorher direkt geschrieben wurde.
//
// Die Regeln:
//   * Verrechnung einer Einzelstunde: Nachhol-Guthaben -> Minus -> sonst Plus
//   * Absage durch den Schüler: ab 4 Stunden Vorlauf gibt es eine Minus-Stunde
//     gutgeschrieben, aber höchstens MAX_MINUS gleichzeitig
//   * Rückgängig: die Verrechnung wird spiegelbildlich zurückgedreht
//
// Bewusst ohne Importe, damit die Regeln ohne Datenbank testbar bleiben.
// =============================================================================

/**
 * Höchstzahl offener Minus-Stunden. Ist das Konto voll, bringt eine weitere
 * Absage keine Gutschrift mehr – gebucht werden darf aber weiterhin, denn
 * genau darüber werden die offenen Stunden ja wieder abgebaut.
 */
export const MAX_MINUS = 4;
/** Ab diesem Vorlauf gilt eine Absage als rechtzeitig. */
export const ABSAGE_FRIST_STUNDEN = 4;

/**
 * Ab so vielen offenen Minus-Stunden wird vorgewarnt: eine Gutschrift ist
 * dann noch frei. Die Familie soll nicht überrascht werden, wenn die
 * nächste Absage verfällt.
 */
export const WARNUNG_AB_MINUS = MAX_MINUS - 1;

export type Konto = {
  minus_hours: number;
  plus_hours: number;
  makeup_credits: number;
};

/** Wie eine Einzelstunde verrechnet wurde – entspricht `appointments.counted`. */
export type Verrechnung = "makeup" | "minus" | "plus";

/** Nur die Felder, die sich ändern – so wie sie bisher geschrieben wurden. */
export type Aenderung = Partial<Konto>;

/**
 * Verrechnung einer bestätigten Einzelstunde.
 * Reihenfolge: erst Nachhol-Guthaben, dann Minus-Stunden, sonst Plus.
 */
export function verrechne(k: Konto): { counted: Verrechnung; aenderung: Aenderung } {
  if (k.makeup_credits > 0) return { counted: "makeup", aenderung: { makeup_credits: k.makeup_credits - 1 } };
  if (k.minus_hours > 0) return { counted: "minus", aenderung: { minus_hours: k.minus_hours - 1 } };
  return { counted: "plus", aenderung: { plus_hours: k.plus_hours + 1 } };
}

/** Was die Verrechnung dem Schüler ankündigt, bevor er bucht. */
export function verrechnungsVorschau(k: Konto): string {
  if (k.makeup_credits > 0) return "Nachhol-Guthaben wird eingelöst.";
  if (k.minus_hours > 0) return "Minus-Stunde wird nachgeholt.";
  return "Zählt als Extra-Stunde (Plus).";
}

/**
 * Verrechnung zurückdrehen, wenn eine Einzelstunde doch abgesagt wird.
 * Plus geht nicht unter null, Minus nicht über die Obergrenze.
 */
export function macheRueckgaengig(k: Konto, counted: string | null): Aenderung | null {
  if (counted === "plus") return { plus_hours: Math.max(0, k.plus_hours - 1) };
  if (counted === "minus") return { minus_hours: Math.min(MAX_MINUS, k.minus_hours + 1) };
  if (counted === "makeup") return { makeup_credits: k.makeup_credits + 1 };
  return null;
}

export type Absagebewertung = {
  /** Bekommt der Schüler eine Minus-Stunde gutgeschrieben? */
  gutschrift: boolean;
  /** Wurde die Absage direkt mit einer offenen Plusstunde verrechnet? */
  plusVerrechnet: boolean;
  /** Vermerk auf der Absage-Zeile: null bei Gutschrift, sonst der Grund. */
  note: null | "late" | "overmax" | "plusverrechnet";
  /** Änderung am Konto – null, wenn es nichts zu verrechnen gibt. */
  aenderung: Aenderung | null;
  /** Rückmeldung an den Schüler. */
  text: string;
};

/**
 * Absage eines festen Termins durch den Schüler (Vier-Stunden-Regel).
 *
 * Kleanas Regel: Plus- und Minus-Stunden gehören zusammen. Stehen bei einer
 * rechtzeitigen Absage noch offene Plusstunden (gehaltene, unabgerechnete
 * Extra-Stunden), gilt eine davon sofort als Ersatz der abgesagten Stunde –
 * die Familie zahlt sie nicht extra, und es entsteht KEIN Minus. Erst ohne
 * offene Plusstunden gibt es die Minus-Gutschrift (bis MAX_MINUS).
 * Nachhol-Guthaben (Kleanas eigene Absagen) bleiben davon unberührt – die
 * schuldet sie der Familie in jedem Fall.
 *
 * @param stundenBisTermin Stunden bis zum Termin; negativ heißt vorbei.
 */
export function bewerteAbsage(k: Konto, stundenBisTermin: number): Absagebewertung {
  const rechtzeitig = stundenBisTermin >= ABSAGE_FRIST_STUNDEN;
  if (rechtzeitig && k.plus_hours > 0) {
    return {
      gutschrift: false, plusVerrechnet: true, note: "plusverrechnet",
      aenderung: { plus_hours: k.plus_hours - 1 },
      text: "Abgesagt. Die Stunde wurde direkt mit einer offenen Zusatzstunde (Plus) verrechnet – nichts nachzuholen, nichts extra zu zahlen.",
    };
  }
  const gutschrift = rechtzeitig && k.minus_hours < MAX_MINUS;
  const note = gutschrift ? null : (!rechtzeitig ? "late" : "overmax");

  const text = rechtzeitig
    ? (gutschrift
        ? "Abgesagt. +1 Minus-Stunde gutgeschrieben."
        : `Abgesagt. (Minus-Konto bereits voll: ${MAX_MINUS}/${MAX_MINUS}.)`)
    : `Abgesagt. Weniger als ${ABSAGE_FRIST_STUNDEN} Std. vorher – keine Gutschrift.`;

  return {
    gutschrift, plusVerrechnet: false, note, text,
    aenderung: gutschrift ? { minus_hours: k.minus_hours + 1 } : null,
  };
}

/**
 * Absage durch KLEANA (Anna). Kleanas Regel, gleiche Logik wie bei den
 * Minus-Stunden: Stehen offene Plusstunden (gehaltene, unabgerechnete
 * Extra-Stunden), gilt eine davon sofort als die geschuldete Nachholstunde –
 * die Familie zahlt sie nicht extra, und es entsteht KEIN Nachhol-Guthaben.
 * Erst ohne offene Plusstunden wird wie bisher ein Nachhol-Guthaben
 * gutgeschrieben (das Kleana der Familie in jedem Fall schuldet).
 */
export function bewerteAnnaAbsage(k: Konto): { plusVerrechnet: boolean; aenderung: Aenderung } {
  if (k.plus_hours > 0) return { plusVerrechnet: true, aenderung: { plus_hours: k.plus_hours - 1 } };
  return { plusVerrechnet: false, aenderung: { makeup_credits: k.makeup_credits + 1 } };
}

// --- Vorwarnungen -----------------------------------------------------------

/** Ist das Konto so voll, dass vorgewarnt werden sollte? */
export function warntVorLimit(k: Konto): boolean {
  return k.minus_hours >= WARNUNG_AB_MINUS && k.minus_hours < MAX_MINUS;
}

/** Wie viele Gutschriften sind noch frei? */
export function freieGutschriften(k: Konto): number {
  return Math.max(0, MAX_MINUS - k.minus_hours);
}

export type Absagevorschau = {
  /** Bekäme die Familie eine Gutschrift, wenn sie jetzt absagt? */
  gutschrift: boolean;
  /** Muss sie den Verfall ausdrücklich bestätigen? */
  bestaetigungNoetig: boolean;
  /** Warum es keine Gutschrift gäbe – null, wenn es eine gibt. */
  grund: null | "kontoVoll" | "zuSpaet";
  /** Text für den Bestätigungsdialog. */
  text: string;
};

/**
 * Was passiert, WENN jetzt abgesagt wird? Gleiche Regel wie bewerteAbsage,
 * nur vorher statt nachher – damit der Dialog warnen kann, bevor eine
 * Stunde ersatzlos verfällt.
 */
export function absageVorschau(k: Konto, stundenBisTermin: number): Absagevorschau {
  const b = bewerteAbsage(k, stundenBisTermin);
  if (b.plusVerrechnet) {
    return {
      gutschrift: false, bestaetigungNoetig: false, grund: null,
      text: "Wird direkt mit einer offenen Zusatzstunde (Plus) verrechnet – nichts nachzuholen, nichts extra zu zahlen.",
    };
  }
  if (b.gutschrift) {
    const frei = freieGutschriften(k) - 1;
    return {
      gutschrift: true, bestaetigungNoetig: false, grund: null,
      text: frei > 0
        ? `Wird als Minus-Stunde gutgeschrieben. Danach ${frei} von ${MAX_MINUS} Gutschriften frei.`
        : `Wird als Minus-Stunde gutgeschrieben. Danach ist dein Stundenkonto voll (${MAX_MINUS}/${MAX_MINUS}).`,
    };
  }
  const kontoVoll = b.note === "overmax";
  return {
    gutschrift: false,
    bestaetigungNoetig: true,
    grund: kontoVoll ? "kontoVoll" : "zuSpaet",
    text: kontoVoll
      ? `Achtung: Euer Stundenkonto ist voll (${MAX_MINUS}/${MAX_MINUS}). `
        + "Diese Stunde wird NICHT gutgeschrieben und verfällt. "
        + "Bucht am besten zuerst Nachholtermine."
      : `Achtung: Weniger als ${ABSAGE_FRIST_STUNDEN} Stunden vorher. `
        + "Diese Stunde wird NICHT gutgeschrieben und verfällt.",
  };
}
