// ============================================================================
// Interaktive Aufgaben — Binomische Formeln · Gymnasium Kl. 8 · Bayern
// (a+b)², (a−b)², (a+b)(a−b) — mit Termen und im Kopfrechnen.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const BINOME_GYM8: Aufgabe[] = [
  {
    typ: "mc",
    frage: "Wie lautet die erste binomische Formel: (a + b)² = ?",
    antworten: ["a² + 2ab + b²", "a² + b²", "a² − 2ab + b²", "2a + 2b"],
    richtig: 0,
    erklaerung: "(a + b)² = a² + 2ab + b².",
  },
  {
    typ: "mc",
    frage: "Wie lautet die zweite binomische Formel: (a − b)² = ?",
    antworten: ["a² − 2ab + b²", "a² + 2ab + b²", "a² − b²", "a − b"],
    richtig: 0,
    erklaerung: "(a − b)² = a² − 2ab + b².",
  },
  {
    typ: "mc",
    frage: "Wie lautet die dritte binomische Formel: (a + b)(a − b) = ?",
    antworten: ["a² − b²", "a² + b²", "a² − 2ab", "(a + b)²"],
    richtig: 0,
    erklaerung: "(a + b)(a − b) = a² − b².",
  },
  { typ: "input", frage: "Berechne mit der binomischen Formel: 21² = (20 + 1)².", loesung: ["441"], platzhalter: "Zahl", erklaerung: "20² + 2·20·1 + 1² = 400 + 40 + 1 = 441." },
  { typ: "input", frage: "Berechne 19² = (20 − 1)².", loesung: ["361"], platzhalter: "Zahl", erklaerung: "400 − 40 + 1 = 361." },
  { typ: "input", frage: "Berechne 21 · 19 = (20 + 1)(20 − 1).", loesung: ["399"], platzhalter: "Zahl", erklaerung: "20² − 1² = 400 − 1 = 399." },
  {
    typ: "mc",
    frage: "Multipliziere aus: (x + 3)².",
    antworten: ["x² + 6x + 9", "x² + 9", "x² + 3x + 9", "x² + 6x + 3"],
    richtig: 0,
    erklaerung: "x² + 2·x·3 + 3² = x² + 6x + 9.",
  },
  {
    typ: "mc",
    frage: "Multipliziere aus: (x − 5)².",
    antworten: ["x² − 10x + 25", "x² − 25", "x² + 10x + 25", "x² − 5x + 25"],
    richtig: 0,
    erklaerung: "x² − 2·x·5 + 5² = x² − 10x + 25.",
  },
  {
    typ: "mc",
    frage: "Multipliziere aus: (x + 4)(x − 4).",
    antworten: ["x² − 16", "x² + 16", "x² − 8x", "x² − 4"],
    richtig: 0,
    erklaerung: "Dritte binomische Formel: x² − 4² = x² − 16.",
  },
  { typ: "input", frage: "In (a + b)² = a² + ? + b² — wie heißt der mittlere Term?", loesung: ["2ab"], platzhalter: "z. B. 2ab", erklaerung: "Der mittlere Term ist 2ab." },
  { typ: "input", frage: "Berechne 25².", loesung: ["625"], platzhalter: "Zahl", erklaerung: "25² = 625." },
  {
    typ: "luecke",
    frage: "Multipliziere aus: (x + 2)².",
    segmente: ["(x + 2)² = x² + ", { luecke: ["4"] }, "x + ", { luecke: ["4"] }, "."],
    erklaerung: "x² + 2·x·2 + 2² = x² + 4x + 4.",
  },
  {
    typ: "mc",
    frage: "Wie viel ist 12²?",
    antworten: ["144", "124", "96", "121"],
    richtig: 0,
    erklaerung: "12 · 12 = 144.",
  },
  { typ: "input", frage: "Berechne (x − 1)² für x = 4.", loesung: ["9"], platzhalter: "Zahl", erklaerung: "(4 − 1)² = 3² = 9." },
  { typ: "input", frage: "Berechne 102 · 98 = (100 + 2)(100 − 2).", loesung: ["9996", "9 996"], platzhalter: "Zahl", erklaerung: "100² − 2² = 10 000 − 4 = 9 996." },
];

export default BINOME_GYM8;
