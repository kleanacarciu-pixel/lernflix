// ============================================================================
// Interaktive Aufgaben — Satz des Pythagoras · Mittelschule Kl. 9 · Bayern
// Hypotenuse und Kathete berechnen, pythagoreische Tripel, Sachaufgaben.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const PYTHAGORAS_MS9: Aufgabe[] = [
  {
    typ: "mc",
    frage: "Wie lautet der Satz des Pythagoras für ein rechtwinkliges Dreieck mit den Katheten a, b und der Hypotenuse c?",
    antworten: ["a² + b² = c²", "a + b = c", "a² − b² = c²", "a · b = c"],
    richtig: 0,
    erklaerung: "Im rechtwinkligen Dreieck gilt: Kathete² + Kathete² = Hypotenuse², also a² + b² = c².",
  },
  {
    typ: "mc",
    frage: "In welchem Dreieck gilt der Satz des Pythagoras?",
    antworten: ["im rechtwinkligen Dreieck", "in jedem Dreieck", "nur im gleichseitigen Dreieck", "nur im gleichschenkligen Dreieck"],
    richtig: 0,
    erklaerung: "Der Satz des Pythagoras gilt genau in rechtwinkligen Dreiecken.",
  },
  { typ: "input", frage: "Die Katheten sind a = 3 cm und b = 4 cm. Berechne die Hypotenuse c.", loesung: ["5"], einheit: "cm", platzhalter: "Zahl", erklaerung: "c² = 3² + 4² = 9 + 16 = 25, also c = √25 = 5 cm." },
  { typ: "input", frage: "Die Katheten sind a = 6 cm und b = 8 cm. Berechne die Hypotenuse c.", loesung: ["10"], einheit: "cm", platzhalter: "Zahl", erklaerung: "c² = 36 + 64 = 100, also c = 10 cm." },
  { typ: "input", frage: "Die Hypotenuse ist c = 13 cm, eine Kathete a = 5 cm. Berechne die andere Kathete b.", loesung: ["12"], einheit: "cm", platzhalter: "Zahl", erklaerung: "b² = 13² − 5² = 169 − 25 = 144, also b = √144 = 12 cm." },
  { typ: "input", frage: "Die Hypotenuse ist c = 10 cm, eine Kathete a = 6 cm. Berechne die andere Kathete b.", loesung: ["8"], einheit: "cm", platzhalter: "Zahl", erklaerung: "b² = 100 − 36 = 64, also b = 8 cm." },
  {
    typ: "mc",
    frage: "Welche Seite ist die Hypotenuse?",
    antworten: ["die dem rechten Winkel gegenüberliegende, längste Seite", "die kürzeste Seite", "immer die untere Seite", "eine der beiden Seiten am rechten Winkel"],
    richtig: 0,
    erklaerung: "Die Hypotenuse liegt dem rechten Winkel gegenüber und ist die längste Seite.",
  },
  {
    typ: "luecke",
    frage: "Katheten a = 9 cm und b = 12 cm.",
    segmente: ["c² = 81 + 144 = ", { luecke: ["225"] }, ", also c = ", { luecke: ["15"] }, " cm."],
    erklaerung: "9² = 81, 12² = 144, Summe 225. √225 = 15 cm.",
  },
  {
    typ: "mc",
    frage: "Welches Zahlentripel gehört zu einem rechtwinkligen Dreieck?",
    antworten: ["3, 4, 5", "2, 3, 4", "4, 5, 6", "1, 2, 3"],
    richtig: 0,
    erklaerung: "3² + 4² = 9 + 16 = 25 = 5². Bei den anderen stimmt die Gleichung nicht.",
  },
  { typ: "input", frage: "Eine 5 m lange Leiter lehnt an einer Wand. Ihr Fuß steht 3 m von der Wand entfernt. Wie hoch reicht die Leiter?", loesung: ["4"], einheit: "m", platzhalter: "Zahl", erklaerung: "h² = 5² − 3² = 25 − 9 = 16, also h = 4 m." },
  { typ: "input", frage: "Ein rechteckiger Sportplatz ist 40 m lang und 30 m breit. Wie lang ist die Diagonale?", loesung: ["50"], einheit: "m", platzhalter: "Zahl", erklaerung: "d² = 40² + 30² = 1 600 + 900 = 2 500, also d = 50 m." },
  { typ: "input", frage: "Ein quadratischer Rahmen hat die Seitenlänge 1 m. Die Diagonale ist √2 m lang. Runde √2 auf zwei Nachkommastellen.", loesung: ["1,41"], platzhalter: "z. B. 1,41", erklaerung: "√2 = 1,4142… ≈ 1,41." },
  {
    typ: "zuordnen",
    frage: "Ordne jedem Katheten-Paar die Hypotenuse zu.",
    paare: [
      { links: "a = 3, b = 4", rechts: "c = 5" },
      { links: "a = 6, b = 8", rechts: "c = 10" },
      { links: "a = 5, b = 12", rechts: "c = 13" },
      { links: "a = 8, b = 15", rechts: "c = 17" },
    ],
    erklaerung: "9+16=25 → 5; 36+64=100 → 10; 25+144=169 → 13; 64+225=289 → 17.",
  },
  {
    typ: "mc",
    frage: "Ein Dreieck hat die Seiten 5 cm, 12 cm und 13 cm. Ist es rechtwinklig?",
    antworten: ["Ja, denn 5² + 12² = 13²", "Nein, denn 5 + 12 ≠ 13", "Nein, denn alle Seiten sind verschieden", "Das kann man nicht prüfen"],
    richtig: 0,
    erklaerung: "25 + 144 = 169 = 13². Die Umkehrung des Satzes von Pythagoras: Das Dreieck ist rechtwinklig.",
  },
  { typ: "input", frage: "Berechne die Diagonale eines Rechtecks mit den Seiten 9 cm und 12 cm.", loesung: ["15"], einheit: "cm", platzhalter: "Zahl", erklaerung: "d² = 81 + 144 = 225, also d = 15 cm." },
];

export default PYTHAGORAS_MS9;
