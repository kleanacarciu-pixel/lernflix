// ============================================================================
// Interaktive Aufgaben — Terme & Gleichungen · Realschule Kl. 7 · Bayern
// Zusammenfassen, Ausmultiplizieren, Werte einsetzen, einfache Gleichungen.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const TERME_RS7: Aufgabe[] = [
  { typ: "input", frage: "Fasse zusammen: 4a + 3a.", loesung: ["7a"], platzhalter: "z. B. 7a", erklaerung: "Gleiche Variablen addieren: 4a + 3a = 7a." },
  { typ: "input", frage: "Fasse zusammen: 9x − 4x.", loesung: ["5x"], platzhalter: "z. B. 5x", erklaerung: "9x − 4x = 5x." },
  {
    typ: "mc",
    frage: "Fasse zusammen: 5a + 2b + 3a.",
    antworten: ["8a + 2b", "10ab", "8ab", "5a + 5b"],
    richtig: 0,
    erklaerung: "Nur gleiche Variablen zusammenfassen: 5a + 3a = 8a, das b bleibt: 8a + 2b.",
  },
  {
    typ: "mc",
    frage: "Multipliziere aus: 2 · (x + 3).",
    antworten: ["2x + 6", "2x + 3", "x + 6", "2x · 3"],
    richtig: 0,
    erklaerung: "Jeder Summand mal 2: 2 · x + 2 · 3 = 2x + 6.",
  },
  {
    typ: "mc",
    frage: "Multipliziere aus: 4 · (a − 2).",
    antworten: ["4a − 8", "4a − 2", "4a + 8", "a − 8"],
    richtig: 0,
    erklaerung: "4 · a − 4 · 2 = 4a − 8.",
  },
  { typ: "input", frage: "Berechne den Wert von 3x + 2 für x = 4.", loesung: ["14"], platzhalter: "Zahl", erklaerung: "3 · 4 + 2 = 12 + 2 = 14." },
  { typ: "input", frage: "Berechne den Wert von 5a − 3 für a = 2.", loesung: ["7"], platzhalter: "Zahl", erklaerung: "5 · 2 − 3 = 10 − 3 = 7." },
  {
    typ: "luecke",
    frage: "Fasse zusammen.",
    segmente: ["2a + 5a = ", { luecke: ["7a"] }, "  und  8x − x = ", { luecke: ["7x"] }, "."],
    erklaerung: "2a + 5a = 7a; 8x − 1x = 7x.",
  },
  { typ: "input", frage: "Löse die Gleichung: x + 5 = 11.", loesung: ["6"], platzhalter: "Zahl", erklaerung: "Auf beiden Seiten 5 abziehen: x = 6." },
  { typ: "input", frage: "Löse: x − 4 = 9.", loesung: ["13"], platzhalter: "Zahl", erklaerung: "Auf beiden Seiten 4 addieren: x = 13." },
  { typ: "input", frage: "Löse: 3x = 21.", loesung: ["7"], platzhalter: "Zahl", erklaerung: "Durch 3 teilen: x = 7." },
  { typ: "input", frage: "Löse: x : 4 = 5.", loesung: ["20"], platzhalter: "Zahl", erklaerung: "Mit 4 malnehmen: x = 20." },
  { typ: "input", frage: "Löse: 2x + 1 = 9.", loesung: ["4"], platzhalter: "Zahl", erklaerung: "1 abziehen: 2x = 8. Durch 2 teilen: x = 4." },
  {
    typ: "mc",
    frage: "Wie löst man x + 6 = 10 im ersten Schritt?",
    antworten: ["auf beiden Seiten 6 abziehen", "auf beiden Seiten 6 addieren", "mit 6 malnehmen", "durch 6 teilen"],
    richtig: 0,
    erklaerung: "Um x allein zu bekommen, zieht man auf beiden Seiten 6 ab: x = 4.",
  },
  { typ: "input", frage: "Das Doppelte einer Zahl plus 3 ergibt 11. Wie heißt die Zahl?", loesung: ["4"], platzhalter: "Zahl", erklaerung: "2x + 3 = 11 → 2x = 8 → x = 4." },
];

export default TERME_RS7;
