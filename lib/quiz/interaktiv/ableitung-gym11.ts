// ============================================================================
// Interaktive Aufgaben — Ableitung: Grundlagen · Gymnasium Kl. 11 · Bayern
// Potenzregel, Ableitung von Polynomen, Steigung an einer Stelle.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const ABLEITUNG_GYM11: Aufgabe[] = [
  {
    typ: "mc",
    frage: "Wie lautet die Ableitung von f(x) = x²?",
    antworten: ["2x", "x", "2", "x²"],
    richtig: 0,
    erklaerung: "Potenzregel: (xⁿ)' = n·xⁿ⁻¹, also (x²)' = 2x.",
  },
  {
    typ: "mc",
    frage: "Wie lautet die Ableitung von f(x) = x³?",
    antworten: ["3x²", "3x", "x²", "2x³"],
    richtig: 0,
    erklaerung: "(x³)' = 3x².",
  },
  { typ: "input", frage: "Wie lautet die Ableitung von f(x) = 5x? (Nur die Zahl.)", loesung: ["5"], platzhalter: "Zahl", erklaerung: "(5x)' = 5." },
  { typ: "input", frage: "Wie lautet die Ableitung der Konstanten f(x) = 7?", loesung: ["0"], platzhalter: "Zahl", erklaerung: "Die Ableitung jeder Konstanten ist 0." },
  { typ: "input", frage: "f(x) = x². Wie groß ist die Steigung bei x = 3, also f'(3)?", loesung: ["6"], platzhalter: "Zahl", erklaerung: "f'(x) = 2x, also f'(3) = 6." },
  { typ: "input", frage: "f(x) = x². Berechne f'(2).", loesung: ["4"], platzhalter: "Zahl", erklaerung: "f'(x) = 2x, also f'(2) = 4." },
  {
    typ: "mc",
    frage: "Was gibt die Ableitung f'(x) an?",
    antworten: ["die Steigung des Graphen an der Stelle x", "den Flächeninhalt", "den y-Achsenabschnitt", "die Nullstelle"],
    richtig: 0,
    erklaerung: "f'(x) ist die Steigung der Tangente, also die Steigung des Graphen an der Stelle x.",
  },
  {
    typ: "mc",
    frage: "Wie lautet die Ableitung von f(x) = 3x²?",
    antworten: ["6x", "3x", "6", "x"],
    richtig: 0,
    erklaerung: "(3x²)' = 3 · 2x = 6x.",
  },
  {
    typ: "mc",
    frage: "Wie lautet die Ableitung von f(x) = x⁴?",
    antworten: ["4x³", "4x", "x³", "3x⁴"],
    richtig: 0,
    erklaerung: "(x⁴)' = 4x³.",
  },
  { typ: "input", frage: "f(x) = 2x³. Berechne f'(3). (Tipp: f'(x) = 6x².)", loesung: ["54"], platzhalter: "Zahl", erklaerung: "f'(x) = 6x², also f'(3) = 6 · 9 = 54." },
  {
    typ: "luecke",
    frage: "f(x) = x² hat die Ableitung f'(x) = 2x.",
    segmente: ["Es gilt f'(1) = ", { luecke: ["2"] }, " und f'(5) = ", { luecke: ["10"] }, "."],
    erklaerung: "f'(x) = 2x, also f'(1) = 2 und f'(5) = 10.",
  },
  {
    typ: "mc",
    frage: "Wie lautet die Ableitung von f(x) = x² + 3x?",
    antworten: ["2x + 3", "2x", "x + 3", "2x² + 3"],
    richtig: 0,
    erklaerung: "Summenregel: (x²)' + (3x)' = 2x + 3.",
  },
  { typ: "input", frage: "f(x) = x² − 4x. Berechne f'(0). (Tipp: f'(x) = 2x − 4.)", loesung: ["-4", "−4"], platzhalter: "Zahl", erklaerung: "f'(x) = 2x − 4, also f'(0) = −4." },
  { typ: "input", frage: "f(x) = x². Berechne f'(0).", loesung: ["0"], platzhalter: "Zahl", erklaerung: "f'(x) = 2x, also f'(0) = 0." },
  {
    typ: "mc",
    frage: "Wie lautet die Ableitung der Konstanten f(x) = 8?",
    antworten: ["0", "8", "1", "x"],
    richtig: 0,
    erklaerung: "Die Ableitung jeder Konstanten ist 0.",
  },
];

export default ABLEITUNG_GYM11;
