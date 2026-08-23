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
  /** Vermerk auf der Absage-Zeile: null bei Gutschrift, sonst der Grund. */
  note: null | "late" | "overmax";
  /** Änderung am Konto – null, wenn es nichts gutzuschreiben gibt. */
  aenderung: Aenderung | null;
  /** Rückmeldung an den Schüler. */
  text: string;
};

/**
 * Absage eines festen Termins durch den Schüler (Vier-Stunden-Regel).
 *
 * @param stundenBisTermin Stunden bis zum Termin; negativ heißt vorbei.
 */
export function bewerteAbsage(k: Konto, stundenBisTermin: number): Absagebewertung {
  const rechtzeitig = stundenBisTermin >= ABSAGE_FRIST_STUNDEN;
  const gutschrift = rechtzeitig && k.minus_hours < MAX_MINUS;
  const note = gutschrift ? null : (!rechtzeitig ? "late" : "overmax");

  const text = rechtzeitig
    ? (gutschrift
        ? "Abgesagt. +1 Minus-Stunde gutgeschrieben."
        : `Abgesagt. (Minus-Konto bereits voll: ${MAX_MINUS}/${MAX_MINUS}.)`)
    : `Abgesagt. Weniger als ${ABSAGE_FRIST_STUNDEN} Std. vorher – keine Gutschrift.`;

  return {
    gutschrift, note, text,
    aenderung: gutschrift ? { minus_hours: k.minus_hours + 1 } : null,
  };
}
