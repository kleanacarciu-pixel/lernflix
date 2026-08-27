// ============================================================================
// Interaktive Aufgaben — Integralrechnung: Einstieg · Gymnasium Kl. 11
// Stammfunktionen und bestimmte Integrale einfacher Polynome.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const INTEGRAL_GYM11: Aufgabe[] = [
  {
    typ: "mc",
    frage: "Welche Funktion ist eine Stammfunktion von f(x) = 2x?",
    antworten: ["x²", "2", "x", "2x²"],
    richtig: 0,
    erklaerung: "Die Ableitung von x² ist 2x, also ist x² eine Stammfunktion von 2x.",
  },
  {
    typ: "mc",
    frage: "Welche Funktion ist eine Stammfunktion von f(x) = x?",
    antworten: ["1/2·x²", "x²", "1", "2x"],
    richtig: 0,
    erklaerung: "Die Ableitung von ½x² ist x.",
  },
  {
    typ: "mc",
    frage: "Welche Funktion ist eine Stammfunktion von f(x) = 3x²?",
    antworten: ["x³", "3x", "6x", "x²"],
    richtig: 0,
    erklaerung: "Die Ableitung von x³ ist 3x².",
  },
  {
    typ: "mc",
    frage: "Das Integrieren ist die Umkehrung des …",
    antworten: ["Ableitens", "Multiplizierens", "Addierens", "Wurzelziehens"],
    richtig: 0,
    erklaerung: "Integrieren macht das Ableiten rückgängig.",
  },
  { typ: "input", frage: "Berechne das Integral von 2x von 0 bis 1. (Stammfunktion x²: 1² − 0².)", loesung: ["1"], platzhalter: "Zahl", erklaerung: "[x²] von 0 bis 1 = 1 − 0 = 1." },
  { typ: "input", frage: "Berechne das Integral von 2x von 0 bis 2.", loesung: ["4"], platzhalter: "Zahl", erklaerung: "[x²] von 0 bis 2 = 4 − 0 = 4." },
  { typ: "input", frage: "Berechne das Integral von 2x von 0 bis 3.", loesung: ["9"], platzhalter: "Zahl", erklaerung: "[x²] von 0 bis 3 = 9 − 0 = 9." },
  { typ: "input", frage: "Berechne das Integral von 3x² von 0 bis 2. (Stammfunktion x³.)", loesung: ["8"], platzhalter: "Zahl", erklaerung: "[x³] von 0 bis 2 = 8 − 0 = 8." },
  {
    typ: "mc",
    frage: "Das bestimmte Integral einer Funktion f ≥ 0 von a bis b entspricht …",
    antworten: ["der Fläche zwischen Graph und x-Achse", "der Steigung", "der Nullstelle", "dem Maximum"],
    richtig: 0,
    erklaerung: "Das bestimmte Integral misst die Fläche zwischen Graph und x-Achse.",
  },
  {
    typ: "mc",
    frage: "Welche Funktion ist eine Stammfunktion von f(x) = 4x³?",
    antworten: ["x⁴", "4x⁴", "12x²", "x³"],
    richtig: 0,
    erklaerung: "Die Ableitung von x⁴ ist 4x³.",
  },
  { typ: "input", frage: "Berechne das Integral von 3x² von 0 bis 1.", loesung: ["1"], platzhalter: "Zahl", erklaerung: "[x³] von 0 bis 1 = 1 − 0 = 1." },
  {
    typ: "mc",
    frage: "Welche Funktion ist eine Stammfunktion der Konstanten f(x) = 1?",
    antworten: ["x", "0", "1", "x²"],
    richtig: 0,
    erklaerung: "Die Ableitung von x ist 1.",
  },
  { typ: "input", frage: "Berechne das Integral von 2x von 1 bis 2. (2² − 1².)", loesung: ["3"], platzhalter: "Zahl", erklaerung: "[x²] von 1 bis 2 = 4 − 1 = 3." },
  {
    typ: "luecke",
    frage: "Bestimmtes Integral von 2x.",
    segmente: ["Von 0 bis 2: 2² − 0² = ", { luecke: ["4"] }, "."],
    erklaerung: "[x²] von 0 bis 2 = 4 − 0 = 4.",
  },
  {
    typ: "mc",
    frage: "Wie viele Stammfunktionen hat eine Funktion?",
    antworten: ["unendlich viele (sie unterscheiden sich um eine Konstante +C)", "genau eine", "keine", "genau zwei"],
    richtig: 0,
    erklaerung: "Stammfunktionen unterscheiden sich nur um eine additive Konstante C.",
  },
];

export default INTEGRAL_GYM11;
