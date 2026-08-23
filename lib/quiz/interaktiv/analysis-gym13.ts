// ============================================================================
// Interaktive Aufgaben — Analysis (Abitur) · Gymnasium Kl. 13 · Bayern
// Wiederholung: Ableitung, Integral, Kurvendiskussion, e-/ln-Funktion.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const ANALYSIS_GYM13: Aufgabe[] = [
  { typ: "input", frage: "f(x) = x³, also f'(x) = 3x². Berechne f'(2).", loesung: ["12"], platzhalter: "Zahl", erklaerung: "f'(2) = 3 · 2² = 3 · 4 = 12." },
  { typ: "input", frage: "f(x) = x². Berechne f'(5).", loesung: ["10"], platzhalter: "Zahl", erklaerung: "f'(x) = 2x, also f'(5) = 10." },
  { typ: "input", frage: "Berechne das Integral von 2x von 0 bis 2. (Stammfunktion x².)", loesung: ["4"], platzhalter: "Zahl", erklaerung: "2² − 0² = 4." },
  { typ: "input", frage: "Berechne das Integral von x² von 0 bis 3. (Stammfunktion 1/3·x³.)", loesung: ["9"], platzhalter: "Zahl", erklaerung: "1/3 · 27 = 9." },
  {
    typ: "mc",
    frage: "Wie lautet die Ableitung von f(x) = eˣ?",
    antworten: ["eˣ", "x·eˣ", "1", "0"],
    richtig: 0,
    erklaerung: "(eˣ)' = eˣ.",
  },
  {
    typ: "mc",
    frage: "Wie lautet die Ableitung von f(x) = ln(x)?",
    antworten: ["1/x", "x", "eˣ", "ln(x)"],
    richtig: 0,
    erklaerung: "(ln x)' = 1/x.",
  },
  { typ: "input", frage: "f(x) = x² − 6x + 8. Gib die kleinere Nullstelle an.", loesung: ["2"], platzhalter: "Zahl", erklaerung: "x² − 6x + 8 = 0 → x = 2 und x = 4." },
  { typ: "input", frage: "f(x) = x² − 6x + 8, also f'(x) = 2x − 6. Bei welchem x liegt die Extremstelle?", loesung: ["3"], platzhalter: "Zahl", erklaerung: "2x − 6 = 0 → x = 3." },
  {
    typ: "mc",
    frage: "An einem Hoch- oder Tiefpunkt ist f'(x) gleich …",
    antworten: ["0", "1", "−1", "unendlich"],
    richtig: 0,
    erklaerung: "Die notwendige Bedingung für eine Extremstelle ist f'(x) = 0.",
  },
  { typ: "input", frage: "Berechne das Integral von 3x² von 0 bis 1. (Stammfunktion x³.)", loesung: ["1"], platzhalter: "Zahl", erklaerung: "1³ − 0 = 1." },
  {
    typ: "mc",
    frage: "f(x) = x² hat im Scheitel einen …",
    antworten: ["Tiefpunkt", "Hochpunkt", "Wendepunkt", "Sattelpunkt"],
    richtig: 0,
    erklaerung: "Die nach oben geöffnete Parabel hat einen Tiefpunkt.",
  },
  { typ: "input", frage: "Berechne ln(e⁴).", loesung: ["4"], platzhalter: "Zahl", erklaerung: "ln(e⁴) = 4." },
  { typ: "input", frage: "f(x) = 2x² − 4x, also f'(x) = 4x − 4. Bei welchem x liegt die Extremstelle?", loesung: ["1"], platzhalter: "Zahl", erklaerung: "4x − 4 = 0 → x = 1." },
  {
    typ: "mc",
    frage: "Das bestimmte Integral einer Funktion f ≥ 0 von a bis b entspricht …",
    antworten: ["der Fläche zwischen Graph und x-Achse", "der Steigung im Punkt a", "der Nullstelle", "dem Hochpunkt"],
    richtig: 0,
    erklaerung: "Das bestimmte Integral misst die Fläche unter dem Graphen.",
  },
  { typ: "input", frage: "f(x) = eˣ. Berechne f'(0).", loesung: ["1"], platzhalter: "Zahl", erklaerung: "f'(x) = eˣ, also f'(0) = e⁰ = 1." },
];

export default ANALYSIS_GYM13;
