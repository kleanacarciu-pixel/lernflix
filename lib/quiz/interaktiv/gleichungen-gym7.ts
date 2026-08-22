// ============================================================================
// Interaktive Aufgaben — Lineare Gleichungen · Gymnasium Kl. 7 · Bayern
// Äquivalenzumformungen, Gleichungen lösen, einfache Textgleichungen.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const GLEICHUNGEN_GYM7: Aufgabe[] = [
  { typ: "input", frage: "Löse die Gleichung: x + 5 = 12. Wie groß ist x?", loesung: ["7"], platzhalter: "Zahl", erklaerung: "Auf beiden Seiten 5 abziehen: x = 12 − 5 = 7." },
  { typ: "input", frage: "Löse: x − 3 = 10.", loesung: ["13"], platzhalter: "Zahl", erklaerung: "Auf beiden Seiten 3 addieren: x = 13." },
  { typ: "input", frage: "Löse: 4x = 20.", loesung: ["5"], platzhalter: "Zahl", erklaerung: "Durch 4 teilen: x = 20 : 4 = 5." },
  { typ: "input", frage: "Löse: x : 3 = 6.", loesung: ["18"], platzhalter: "Zahl", erklaerung: "Mit 3 malnehmen: x = 6 · 3 = 18." },
  { typ: "input", frage: "Löse: 2x + 3 = 11.", loesung: ["4"], platzhalter: "Zahl", erklaerung: "3 abziehen: 2x = 8. Durch 2 teilen: x = 4." },
  { typ: "input", frage: "Löse: 3x − 5 = 10.", loesung: ["5"], platzhalter: "Zahl", erklaerung: "5 addieren: 3x = 15. Durch 3 teilen: x = 5." },
  { typ: "input", frage: "Löse: 5x + 2 = 2x + 14.", loesung: ["4"], platzhalter: "Zahl", erklaerung: "2x abziehen: 3x + 2 = 14. Dann 2 abziehen: 3x = 12, also x = 4." },
  {
    typ: "luecke",
    frage: "Löse 2x = 10 Schritt für Schritt.",
    segmente: ["Durch 2 teilen ergibt x = ", { luecke: ["5"] }, "."],
    erklaerung: "10 : 2 = 5.",
  },
  { typ: "input", frage: "Löse: 7 = x + 4.", loesung: ["3"], platzhalter: "Zahl", erklaerung: "4 abziehen: x = 7 − 4 = 3." },
  { typ: "input", frage: "Löse: 10 − x = 4.", loesung: ["6"], platzhalter: "Zahl", erklaerung: "x = 10 − 4 = 6." },
  {
    typ: "mc",
    frage: "Wie löst man x + 7 = 12 im ersten Schritt?",
    antworten: ["auf beiden Seiten 7 abziehen", "auf beiden Seiten 7 addieren", "mit 7 malnehmen", "durch 7 teilen"],
    richtig: 0,
    erklaerung: "Um x allein zu bekommen, zieht man auf beiden Seiten 7 ab: x = 5.",
  },
  { typ: "input", frage: "Löse: 6x = 0.", loesung: ["0"], platzhalter: "Zahl", erklaerung: "0 : 6 = 0, also x = 0." },
  { typ: "input", frage: "Eine Zahl plus 8 ergibt 20. Wie heißt die Zahl?", loesung: ["12"], platzhalter: "Zahl", erklaerung: "x + 8 = 20, also x = 12." },
  { typ: "input", frage: "Das Dreifache einer Zahl ist 27. Wie heißt die Zahl?", loesung: ["9"], platzhalter: "Zahl", erklaerung: "3x = 27, also x = 9." },
  { typ: "input", frage: "Löse: 4x − 1 = 2x + 7.", loesung: ["4"], platzhalter: "Zahl", erklaerung: "2x abziehen: 2x − 1 = 7. Dann 1 addieren: 2x = 8, also x = 4." },
];

export default GLEICHUNGEN_GYM7;
