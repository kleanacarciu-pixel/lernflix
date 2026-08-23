// ============================================================================
// Interaktive Aufgaben — Logarithmen · Gymnasium Kl. 10 · Bayern
// Logarithmus als Umkehrung des Potenzierens: „b hoch was ergibt x?"
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const LOGARITHMEN_GYM10: Aufgabe[] = [
  { typ: "input", frage: "2 hoch welcher Zahl ergibt 8? (Das ist log₂(8).)", loesung: ["3"], platzhalter: "Zahl", erklaerung: "2³ = 8, also log₂(8) = 3." },
  { typ: "input", frage: "10 hoch welcher Zahl ergibt 1000?", loesung: ["3"], platzhalter: "Zahl", erklaerung: "10³ = 1000, also log₁₀(1000) = 3." },
  { typ: "input", frage: "2 hoch welcher Zahl ergibt 16?", loesung: ["4"], platzhalter: "Zahl", erklaerung: "2⁴ = 16." },
  { typ: "input", frage: "10 hoch welcher Zahl ergibt 100?", loesung: ["2"], platzhalter: "Zahl", erklaerung: "10² = 100." },
  { typ: "input", frage: "3 hoch welcher Zahl ergibt 9?", loesung: ["2"], platzhalter: "Zahl", erklaerung: "3² = 9." },
  { typ: "input", frage: "5 hoch welcher Zahl ergibt 25?", loesung: ["2"], platzhalter: "Zahl", erklaerung: "5² = 25." },
  {
    typ: "mc",
    frage: "Was bedeutet log₂(8)?",
    antworten: ["2 hoch welche Zahl ergibt 8? → 3", "8 · 2 = 16", "2 · 8 = 16", "8 hoch 2"],
    richtig: 0,
    erklaerung: "log₂(8) fragt: „2 hoch was ergibt 8?“ Antwort: 3.",
  },
  { typ: "input", frage: "2 hoch welcher Zahl ergibt 1?", loesung: ["0"], platzhalter: "Zahl", erklaerung: "2⁰ = 1, also log₂(1) = 0." },
  { typ: "input", frage: "10 hoch welcher Zahl ergibt 10?", loesung: ["1"], platzhalter: "Zahl", erklaerung: "10¹ = 10." },
  {
    typ: "luecke",
    frage: "Bestimme die Logarithmen.",
    segmente: ["log₂(16) = ", { luecke: ["4"] }, " und log₁₀(1000) = ", { luecke: ["3"] }, "."],
    erklaerung: "2⁴ = 16 und 10³ = 1000.",
  },
  { typ: "input", frage: "2 hoch welcher Zahl ergibt 32?", loesung: ["5"], platzhalter: "Zahl", erklaerung: "2⁵ = 32." },
  { typ: "input", frage: "10 hoch welcher Zahl ergibt 1?", loesung: ["0"], platzhalter: "Zahl", erklaerung: "10⁰ = 1." },
  {
    typ: "mc",
    frage: "Der Logarithmus ist die Umkehrung des …",
    antworten: ["Potenzierens", "Addierens", "Subtrahierens", "Multiplizierens"],
    richtig: 0,
    erklaerung: "Der Logarithmus macht das Potenzieren rückgängig.",
  },
  { typ: "input", frage: "4 hoch welcher Zahl ergibt 64?", loesung: ["3"], platzhalter: "Zahl", erklaerung: "4³ = 64." },
  { typ: "input", frage: "10 hoch welcher Zahl ergibt 10000?", loesung: ["4"], platzhalter: "Zahl", erklaerung: "10⁴ = 10000." },
];

export default LOGARITHMEN_GYM10;
