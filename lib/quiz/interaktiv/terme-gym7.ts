// ============================================================================
// Interaktive Aufgaben — Terme & Termumformung · Gymnasium Kl. 7 · Bayern
// Zusammenfassen, Ausmultiplizieren, Ausklammern, Werte einsetzen.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const TERME_GYM7: Aufgabe[] = [
  { typ: "input", frage: "Fasse zusammen: 3a + 5a.", loesung: ["8a"], platzhalter: "z. B. 8a", erklaerung: "Gleiche Variablen addieren: 3a + 5a = 8a." },
  { typ: "input", frage: "Fasse zusammen: 7x − 2x.", loesung: ["5x"], platzhalter: "z. B. 5x", erklaerung: "7x − 2x = 5x." },
  {
    typ: "mc",
    frage: "Fasse zusammen: 4a + 3b + 2a.",
    antworten: ["6a + 3b", "9ab", "6ab", "5a + 4b"],
    richtig: 0,
    erklaerung: "Nur gleiche Variablen zusammenfassen: 4a + 2a = 6a, das b bleibt: 6a + 3b.",
  },
  {
    typ: "mc",
    frage: "Multipliziere aus: 3 · (x + 2).",
    antworten: ["3x + 6", "3x + 2", "x + 6", "3x · 6"],
    richtig: 0,
    erklaerung: "Jeder Summand mal 3: 3 · x + 3 · 2 = 3x + 6.",
  },
  {
    typ: "mc",
    frage: "Multipliziere aus: 2 · (a − 4).",
    antworten: ["2a − 8", "2a − 4", "2a + 8", "a − 8"],
    richtig: 0,
    erklaerung: "2 · a − 2 · 4 = 2a − 8.",
  },
  { typ: "input", frage: "Klammere aus: 4x + 8 = 4 · (…). Was steht in der Klammer?", loesung: ["x+2", "x + 2"], platzhalter: "z. B. x+2", erklaerung: "4x + 8 = 4 · x + 4 · 2 = 4 · (x + 2)." },
  { typ: "input", frage: "Berechne den Wert von 2x + 3 für x = 5.", loesung: ["13"], platzhalter: "Zahl", erklaerung: "2 · 5 + 3 = 10 + 3 = 13." },
  { typ: "input", frage: "Berechne den Wert von 3a − 1 für a = 4.", loesung: ["11"], platzhalter: "Zahl", erklaerung: "3 · 4 − 1 = 12 − 1 = 11." },
  {
    typ: "luecke",
    frage: "Fasse zusammen.",
    segmente: ["3a + 4a = ", { luecke: ["7a"] }, "  und  6x − x = ", { luecke: ["5x"] }, "."],
    erklaerung: "3a + 4a = 7a; 6x − 1x = 5x.",
  },
  {
    typ: "mc",
    frage: "Welcher Term passt zu „das Doppelte einer Zahl x, vermehrt um 5“?",
    antworten: ["2x + 5", "x + 2 + 5", "2 · (x + 5)", "x² + 5"],
    richtig: 0,
    erklaerung: "Das Doppelte von x ist 2x, „vermehrt um 5“ heißt + 5: also 2x + 5.",
  },
  {
    typ: "mc",
    frage: "Fasse zusammen: 5x + 2 − 3x.",
    antworten: ["2x + 2", "2x − 2", "8x + 2", "2x"],
    richtig: 0,
    erklaerung: "5x − 3x = 2x, die + 2 bleibt: 2x + 2.",
  },
  {
    typ: "mc",
    frage: "Multipliziere aus: 5 · (2a + 3).",
    antworten: ["10a + 15", "7a + 8", "10a + 3", "10a + 8"],
    richtig: 0,
    erklaerung: "5 · 2a + 5 · 3 = 10a + 15.",
  },
  { typ: "input", frage: "Fasse zusammen: 2a · 3.", loesung: ["6a"], platzhalter: "z. B. 6a", erklaerung: "2a · 3 = 6a." },
  { typ: "input", frage: "Berechne den Wert von 4 · (x − 1) für x = 3.", loesung: ["8"], platzhalter: "Zahl", erklaerung: "4 · (3 − 1) = 4 · 2 = 8." },
  {
    typ: "mc",
    frage: "Wie viele Summanden hat der Term 3a + 2b − 5?",
    antworten: ["3", "2", "1", "4"],
    richtig: 0,
    erklaerung: "Die Summanden sind 3a, 2b und −5 — das sind 3.",
  },
];

export default TERME_GYM7;
