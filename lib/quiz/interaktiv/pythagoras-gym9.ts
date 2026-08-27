// ============================================================================
// Interaktive Aufgaben — Satz des Pythagoras · Gymnasium Kl. 9 · Bayern
// a² + b² = c² (c = Hypotenuse). Pythagoreische Tripel, saubere Werte.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const PYTHAGORAS_GYM9: Aufgabe[] = [
  { typ: "input", frage: "Ein rechtwinkliges Dreieck hat die Katheten 3 cm und 4 cm. Wie lang ist die Hypotenuse?", loesung: ["5"], einheit: "cm", platzhalter: "Zahl", erklaerung: "c² = 3² + 4² = 9 + 16 = 25, also c = 5 cm." },
  { typ: "input", frage: "Die Katheten sind 6 cm und 8 cm. Wie lang ist die Hypotenuse?", loesung: ["10"], einheit: "cm", platzhalter: "Zahl", erklaerung: "c² = 36 + 64 = 100, also c = 10 cm." },
  { typ: "input", frage: "Die Katheten sind 5 cm und 12 cm. Wie lang ist die Hypotenuse?", loesung: ["13"], einheit: "cm", platzhalter: "Zahl", erklaerung: "c² = 25 + 144 = 169, also c = 13 cm." },
  { typ: "input", frage: "Die Hypotenuse ist 13 cm, eine Kathete 5 cm. Wie lang ist die andere Kathete?", loesung: ["12"], einheit: "cm", platzhalter: "Zahl", erklaerung: "b² = 13² − 5² = 169 − 25 = 144, also b = 12 cm." },
  { typ: "input", frage: "Die Hypotenuse ist 10 cm, eine Kathete 6 cm. Wie lang ist die andere Kathete?", loesung: ["8"], einheit: "cm", platzhalter: "Zahl", erklaerung: "b² = 100 − 36 = 64, also b = 8 cm." },
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
    erklaerung: "c ist die Hypotenuse — die dem rechten Winkel gegenüberliegende, längste Seite.",
  },
  { typ: "input", frage: "Die Katheten sind 8 cm und 15 cm. Wie lang ist die Hypotenuse?", loesung: ["17"], einheit: "cm", platzhalter: "Zahl", erklaerung: "c² = 64 + 225 = 289, also c = 17 cm." },
  {
    typ: "luecke",
    frage: "Berechne die Hypotenuse bei den Katheten 9 und 12.",
    segmente: ["c² = 9² + 12² = 81 + 144 = ", { luecke: ["225"] }, ", also c = ", { luecke: ["15"] }, "."],
    erklaerung: "225 = 15², also c = 15.",
  },
  { typ: "input", frage: "Die Katheten sind 7 cm und 24 cm. Wie lang ist die Hypotenuse?", loesung: ["25"], einheit: "cm", platzhalter: "Zahl", erklaerung: "c² = 49 + 576 = 625, also c = 25 cm." },
  {
    typ: "mc",
    frage: "In welchen Dreiecken gilt der Satz des Pythagoras?",
    antworten: ["nur in rechtwinkligen Dreiecken", "in allen Dreiecken", "nur in gleichseitigen Dreiecken", "in Vierecken"],
    richtig: 0,
    erklaerung: "Der Satz des Pythagoras gilt nur in rechtwinkligen Dreiecken.",
  },
  { typ: "input", frage: "Die Hypotenuse ist 25 cm, eine Kathete 24 cm. Wie lang ist die andere Kathete?", loesung: ["7"], einheit: "cm", platzhalter: "Zahl", erklaerung: "b² = 625 − 576 = 49, also b = 7 cm." },
  { typ: "input", frage: "Die Katheten sind 9 cm und 40 cm. Wie lang ist die Hypotenuse?", loesung: ["41"], einheit: "cm", platzhalter: "Zahl", erklaerung: "c² = 81 + 1600 = 1681, also c = 41 cm." },
  { typ: "input", frage: "Für eine Hypotenuse gilt c² = 100. Wie lang ist c?", loesung: ["10"], einheit: "cm", platzhalter: "Zahl", erklaerung: "c = √100 = 10." },
  { typ: "input", frage: "Eine 5 m lange Leiter lehnt an einer Wand; ihr Fuß ist 3 m von der Wand entfernt. Wie hoch reicht die Leiter an der Wand?", loesung: ["4"], einheit: "m", platzhalter: "Zahl", erklaerung: "Höhe² = 5² − 3² = 25 − 9 = 16, also 4 m." },
];

export default PYTHAGORAS_GYM9;
