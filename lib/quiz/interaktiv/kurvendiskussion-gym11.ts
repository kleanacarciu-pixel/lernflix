// ============================================================================
// Interaktive Aufgaben — Kurvendiskussion · Gymnasium Kl. 11 · Bayern
// Nullstellen, Extremstellen (f' = 0), Monotonie, Hoch-/Tiefpunkt.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const KURVENDISKUSSION_GYM11: Aufgabe[] = [
  { typ: "input", frage: "f(x) = x² − 4x + 3. Die Ableitung ist f'(x) = 2x − 4. Bei welchem x liegt die Extremstelle (f'(x) = 0)?", loesung: ["2"], platzhalter: "Zahl", erklaerung: "2x − 4 = 0 → x = 2." },
  {
    typ: "mc",
    frage: "An einer Extremstelle (Hoch- oder Tiefpunkt) ist die Steigung f'(x) gleich …",
    antworten: ["0", "1", "−1", "unendlich"],
    richtig: 0,
    erklaerung: "Im Hoch- oder Tiefpunkt ist die Tangente waagerecht, also f'(x) = 0.",
  },
  { typ: "input", frage: "Bei welchem x hat f(x) = x² seine Extremstelle?", loesung: ["0"], platzhalter: "Zahl", erklaerung: "f'(x) = 2x = 0 → x = 0." },
  {
    typ: "mc",
    frage: "f(x) = x² hat im Scheitel einen …",
    antworten: ["Tiefpunkt", "Hochpunkt", "Wendepunkt", "Sattelpunkt"],
    richtig: 0,
    erklaerung: "Die nach oben geöffnete Parabel hat einen Tiefpunkt.",
  },
  {
    typ: "mc",
    frage: "f(x) = −x² hat einen …",
    antworten: ["Hochpunkt", "Tiefpunkt", "Wendepunkt", "Sattelpunkt"],
    richtig: 0,
    erklaerung: "Die nach unten geöffnete Parabel hat einen Hochpunkt.",
  },
  { typ: "input", frage: "f(x) = x² − 6x + 5. Gib die kleinere Nullstelle an (f(x) = 0).", loesung: ["1"], platzhalter: "Zahl", erklaerung: "x² − 6x + 5 = 0 → x = 1 und x = 5." },
  { typ: "input", frage: "f(x) = x² − 6x + 5. Gib die größere Nullstelle an.", loesung: ["5"], platzhalter: "Zahl", erklaerung: "Nullstellen x = 1 und x = 5." },
  {
    typ: "mc",
    frage: "Ist f'(x) > 0, dann ist der Graph …",
    antworten: ["monoton steigend", "monoton fallend", "konstant", "waagerecht"],
    richtig: 0,
    erklaerung: "Positive Ableitung bedeutet: der Graph steigt.",
  },
  {
    typ: "mc",
    frage: "Ist f'(x) < 0, dann ist der Graph …",
    antworten: ["monoton fallend", "monoton steigend", "konstant", "senkrecht"],
    richtig: 0,
    erklaerung: "Negative Ableitung bedeutet: der Graph fällt.",
  },
  { typ: "input", frage: "f(x) = x² − 2x. Ableitung f'(x) = 2x − 2. Bei welchem x liegt die Extremstelle?", loesung: ["1"], platzhalter: "Zahl", erklaerung: "2x − 2 = 0 → x = 1." },
  {
    typ: "luecke",
    frage: "f(x) = x² + 2x, also f'(x) = 2x + 2.",
    segmente: ["Die Extremstelle liegt bei x = ", { luecke: ["-1", "−1"] }, "."],
    erklaerung: "2x + 2 = 0 → x = −1.",
  },
  { typ: "input", frage: "f(x) = x³, also f'(x) = 3x². Berechne f'(0).", loesung: ["0"], platzhalter: "Zahl", erklaerung: "f'(0) = 3·0² = 0 (hier ein Sattelpunkt)." },
  {
    typ: "mc",
    frage: "Ein Wendepunkt ist eine Stelle, an der sich …",
    antworten: ["die Krümmung des Graphen ändert", "eine Nullstelle befindet", "die Steigung 0 ist", "die Funktion 0 ist"],
    richtig: 0,
    erklaerung: "Im Wendepunkt wechselt die Krümmung (von Links- zu Rechtskurve oder umgekehrt).",
  },
  { typ: "input", frage: "f(x) = x² − 8x + 7, also f'(x) = 2x − 8. Bei welchem x liegt die Extremstelle?", loesung: ["4"], platzhalter: "Zahl", erklaerung: "2x − 8 = 0 → x = 4." },
  {
    typ: "mc",
    frage: "Die Nullstellen einer Funktion findet man, indem man …",
    antworten: ["f(x) = 0 setzt", "f'(x) = 0 setzt", "f''(x) berechnet", "x = 0 setzt"],
    richtig: 0,
    erklaerung: "Nullstellen sind die x-Werte mit f(x) = 0.",
  },
];

export default KURVENDISKUSSION_GYM11;
