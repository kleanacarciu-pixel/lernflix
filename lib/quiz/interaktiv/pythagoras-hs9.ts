// ============================================================================
// Interaktive Aufgaben — Satz des Pythagoras · Hauptschule Kl. 9 · Bayern
// a² + b² = c² mit einfachen Tripeln, Leiter- und Diagonalen-Aufgaben.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const PYTHAGORAS_HS9: Aufgabe[] = [
  {
    typ: "mc",
    frage: "Wie lautet der Satz des Pythagoras (Katheten a, b; Hypotenuse c)?",
    antworten: ["a² + b² = c²", "a + b = c", "a · b = c", "a² − b² = c²"],
    richtig: 0,
    erklaerung: "Im rechtwinkligen Dreieck: a² + b² = c².",
  },
  {
    typ: "mc",
    frage: "Für welche Dreiecke gilt der Satz des Pythagoras?",
    antworten: ["nur für rechtwinklige Dreiecke", "für alle Dreiecke", "nur für gleichseitige Dreiecke", "für Vierecke"],
    richtig: 0,
    erklaerung: "Er gilt genau dann, wenn das Dreieck einen rechten Winkel hat.",
  },
  {
    typ: "mc",
    frage: "Welche Seite ist die Hypotenuse?",
    antworten: ["die längste Seite, gegenüber dem rechten Winkel", "die kürzeste Seite", "immer die linke Seite", "eine der beiden Seiten am rechten Winkel"],
    richtig: 0,
    erklaerung: "Die Hypotenuse liegt dem rechten Winkel gegenüber.",
  },
  { typ: "input", frage: "Die Katheten sind a = 3 cm und b = 4 cm. Berechne die Hypotenuse c.", loesung: ["5"], einheit: "cm", platzhalter: "Zahl", erklaerung: "c² = 9 + 16 = 25, also c = 5 cm." },
  { typ: "input", frage: "Berechne 8² (8 zum Quadrat).", loesung: ["64"], platzhalter: "Zahl", erklaerung: "8 · 8 = 64." },
  { typ: "input", frage: "Berechne √49.", loesung: ["7"], platzhalter: "Zahl", erklaerung: "7 · 7 = 49, also √49 = 7." },
  { typ: "input", frage: "Die Katheten sind a = 6 cm und b = 8 cm. Berechne die Hypotenuse c.", loesung: ["10"], einheit: "cm", platzhalter: "Zahl", erklaerung: "c² = 36 + 64 = 100, also c = 10 cm." },
  { typ: "input", frage: "Die Hypotenuse ist c = 5 cm, eine Kathete a = 3 cm. Berechne die andere Kathete b.", loesung: ["4"], einheit: "cm", platzhalter: "Zahl", erklaerung: "b² = 25 − 9 = 16, also b = 4 cm." },
  {
    typ: "luecke",
    frage: "Katheten a = 9 cm, b = 12 cm.",
    segmente: ["c² = 81 + 144 = ", { luecke: ["225"] }, ", also c = ", { luecke: ["15"] }, " cm."],
    erklaerung: "81 + 144 = 225 und √225 = 15.",
  },
  { typ: "input", frage: "Eine 5 m lange Leiter steht 3 m von der Hauswand entfernt. Wie hoch reicht sie an der Wand?", loesung: ["4"], einheit: "m", platzhalter: "Zahl", erklaerung: "h² = 25 − 9 = 16, also h = 4 m." },
  { typ: "input", frage: "Ein rechteckiges Fußballfeld ist 80 m lang und 60 m breit. Wie lang ist die Diagonale?", loesung: ["100"], einheit: "m", platzhalter: "Zahl", erklaerung: "d² = 6 400 + 3 600 = 10 000, also d = 100 m." },
  {
    typ: "zuordnen",
    frage: "Ordne jedem Katheten-Paar die Hypotenuse zu.",
    paare: [
      { links: "3 und 4", rechts: "5" },
      { links: "6 und 8", rechts: "10" },
      { links: "9 und 12", rechts: "15" },
      { links: "5 und 12", rechts: "13" },
    ],
    erklaerung: "25 → 5; 100 → 10; 225 → 15; 169 → 13.",
  },
  {
    typ: "mc",
    frage: "Ein Dreieck hat die Seiten 6 cm, 8 cm und 10 cm. Ist es rechtwinklig?",
    antworten: ["Ja, denn 6² + 8² = 10²", "Nein, denn 6 + 8 ≠ 10", "Nein, alle Seiten müssten gleich sein", "Das kann man nicht wissen"],
    richtig: 0,
    erklaerung: "36 + 64 = 100 = 10² — also rechtwinklig.",
  },
  { typ: "input", frage: "Berechne die Diagonale eines Rechtecks mit den Seiten 12 cm und 5 cm.", loesung: ["13"], einheit: "cm", platzhalter: "Zahl", erklaerung: "d² = 144 + 25 = 169, also d = 13 cm." },
  {
    typ: "sortieren",
    frage: "Ordne die Werte aufsteigend — beginne beim kleinsten: √16, 3², √100, 2³",
    richtig: ["√16", "2³", "3²", "√100"],
    erklaerung: "√16 = 4 < 2³ = 8 < 3² = 9 < √100 = 10.",
  },
];

export default PYTHAGORAS_HS9;
