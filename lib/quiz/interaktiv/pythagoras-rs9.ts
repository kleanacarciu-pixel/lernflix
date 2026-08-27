// ============================================================================
// Interaktive Aufgaben — Satz des Pythagoras · Realschule Kl. 9 · Bayern
// a² + b² = c². Pythagoreische Tripel, saubere Werte.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const PYTHAGORAS_RS9: Aufgabe[] = [
  { typ: "input", frage: "Ein rechtwinkliges Dreieck hat die Katheten 6 cm und 8 cm. Wie lang ist die Hypotenuse?", loesung: ["10"], einheit: "cm", platzhalter: "Zahl", erklaerung: "c² = 36 + 64 = 100, also c = 10 cm." },
  { typ: "input", frage: "Die Katheten sind 3 cm und 4 cm. Wie lang ist die Hypotenuse?", loesung: ["5"], einheit: "cm", platzhalter: "Zahl", erklaerung: "c² = 9 + 16 = 25, also c = 5 cm." },
  { typ: "input", frage: "Die Katheten sind 5 cm und 12 cm. Wie lang ist die Hypotenuse?", loesung: ["13"], einheit: "cm", platzhalter: "Zahl", erklaerung: "c² = 25 + 144 = 169, also c = 13 cm." },
  { typ: "input", frage: "Die Hypotenuse ist 5 cm, eine Kathete 3 cm. Wie lang ist die andere Kathete?", loesung: ["4"], einheit: "cm", platzhalter: "Zahl", erklaerung: "b² = 25 − 9 = 16, also b = 4 cm." },
  { typ: "input", frage: "Die Hypotenuse ist 13 cm, eine Kathete 12 cm. Wie lang ist die andere Kathete?", loesung: ["5"], einheit: "cm", platzhalter: "Zahl", erklaerung: "b² = 169 − 144 = 25, also b = 5 cm." },
  {
    typ: "mc",
    frage: "Wie lautet der Satz des Pythagoras?",
    antworten: ["a² + b² = c²", "a + b = c", "a² − b² = c²", "a · b = c"],
    richtig: 0,
    erklaerung: "Im rechtwinkligen Dreieck gilt a² + b² = c², wobei c die Hypotenuse ist.",
  },
  {
    typ: "mc",
    frage: "Was ist in a² + b² = c² die Seite c?",
    antworten: ["die Hypotenuse (längste Seite)", "eine Kathete", "der rechte Winkel", "die Höhe"],
    richtig: 0,
    erklaerung: "c ist die Hypotenuse — sie liegt dem rechten Winkel gegenüber und ist die längste Seite.",
  },
  { typ: "input", frage: "Die Katheten sind 9 cm und 12 cm. Wie lang ist die Hypotenuse?", loesung: ["15"], einheit: "cm", platzhalter: "Zahl", erklaerung: "c² = 81 + 144 = 225, also c = 15 cm." },
  {
    typ: "luecke",
    frage: "Berechne die Hypotenuse bei den Katheten 6 und 8.",
    segmente: ["c² = 6² + 8² = 36 + 64 = ", { luecke: ["100"] }, ", also c = ", { luecke: ["10"] }, "."],
    erklaerung: "100 = 10², also c = 10.",
  },
  { typ: "input", frage: "Die Katheten sind 8 cm und 15 cm. Wie lang ist die Hypotenuse?", loesung: ["17"], einheit: "cm", platzhalter: "Zahl", erklaerung: "c² = 64 + 225 = 289, also c = 17 cm." },
  {
    typ: "mc",
    frage: "In welchen Dreiecken gilt der Satz des Pythagoras?",
    antworten: ["nur in rechtwinkligen Dreiecken", "in allen Dreiecken", "nur in gleichseitigen Dreiecken", "in Vierecken"],
    richtig: 0,
    erklaerung: "Der Satz des Pythagoras gilt nur in rechtwinkligen Dreiecken.",
  },
  { typ: "input", frage: "Die Hypotenuse ist 10 cm, eine Kathete 8 cm. Wie lang ist die andere Kathete?", loesung: ["6"], einheit: "cm", platzhalter: "Zahl", erklaerung: "b² = 100 − 64 = 36, also b = 6 cm." },
  { typ: "input", frage: "Für eine Hypotenuse gilt c² = 169. Wie lang ist c?", loesung: ["13"], einheit: "cm", platzhalter: "Zahl", erklaerung: "c = √169 = 13." },
  { typ: "input", frage: "Eine 5 m lange Leiter lehnt an einer Wand; ihr Fuß ist 4 m von der Wand entfernt. Wie hoch reicht die Leiter?", loesung: ["3"], einheit: "m", platzhalter: "Zahl", erklaerung: "Höhe² = 25 − 16 = 9, also 3 m." },
  { typ: "input", frage: "Die Katheten sind 12 cm und 16 cm. Wie lang ist die Hypotenuse?", loesung: ["20"], einheit: "cm", platzhalter: "Zahl", erklaerung: "c² = 144 + 256 = 400, also c = 20 cm." },
];

export default PYTHAGORAS_RS9;
