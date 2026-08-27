// ============================================================================
// Interaktive Aufgaben — Symmetrie · Gymnasium Kl. 6 · Bayern
// Achsensymmetrie, Punktsymmetrie, Anzahl der Symmetrieachsen.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const SYMMETRIE_GYM6: Aufgabe[] = [
  { typ: "input", frage: "Wie viele Symmetrieachsen hat ein Quadrat?", loesung: ["4"], platzhalter: "Zahl", erklaerung: "Ein Quadrat hat 4 Symmetrieachsen: zwei durch die Seitenmitten und zwei durch die Ecken." },
  {
    typ: "mc",
    frage: "Wie viele Symmetrieachsen hat ein Rechteck, das kein Quadrat ist?",
    antworten: ["2", "4", "1", "0"],
    richtig: 0,
    erklaerung: "Ein Rechteck hat 2 Symmetrieachsen — durch die Mitten der gegenüberliegenden Seiten.",
  },
  { typ: "input", frage: "Wie viele Symmetrieachsen hat ein gleichseitiges Dreieck?", loesung: ["3"], platzhalter: "Zahl", erklaerung: "Ein gleichseitiges Dreieck hat 3 Symmetrieachsen — je eine durch eine Ecke und die gegenüberliegende Seitenmitte." },
  {
    typ: "mc",
    frage: "Wie viele Symmetrieachsen hat ein Kreis?",
    antworten: ["unendlich viele", "1", "4", "keine"],
    richtig: 0,
    erklaerung: "Jede Gerade durch den Mittelpunkt ist eine Symmetrieachse — das sind unendlich viele.",
  },
  { typ: "input", frage: "Wie viele Symmetrieachsen hat der Großbuchstabe A?", loesung: ["1"], platzhalter: "Zahl", erklaerung: "Das A hat genau eine senkrechte Symmetrieachse durch die Mitte." },
  {
    typ: "mc",
    frage: "Welcher Großbuchstabe ist achsensymmetrisch?",
    antworten: ["M", "F", "G", "R"],
    richtig: 0,
    erklaerung: "M hat eine senkrechte Symmetrieachse. F, G und R sind nicht symmetrisch.",
  },
  {
    typ: "mc",
    frage: "Welche Figur ist punktsymmetrisch?",
    antworten: ["Parallelogramm", "gleichschenkliges Dreieck", "gleichseitiges Dreieck", "Buchstabe A"],
    richtig: 0,
    erklaerung: "Ein Parallelogramm ist punktsymmetrisch zum Schnittpunkt seiner Diagonalen.",
  },
  {
    typ: "luecke",
    frage: "Vervollständige.",
    segmente: ["Ein Quadrat hat ", { luecke: ["4"] }, " Symmetrieachsen, ein Rechteck hat ", { luecke: ["2"] }, "."],
    erklaerung: "Quadrat: 4 Achsen, Rechteck: 2 Achsen.",
  },
  {
    typ: "mc",
    frage: "Wie viele Symmetrieachsen hat ein gleichschenkliges Dreieck, das nicht gleichseitig ist?",
    antworten: ["1", "2", "3", "0"],
    richtig: 0,
    erklaerung: "Es hat genau eine Symmetrieachse — durch die Spitze und die Mitte der Grundseite.",
  },
  {
    typ: "mc",
    frage: "Der Großbuchstabe H ist …",
    antworten: ["achsen- und punktsymmetrisch", "nur achsensymmetrisch", "nur punktsymmetrisch", "gar nicht symmetrisch"],
    richtig: 0,
    erklaerung: "H hat eine senkrechte und eine waagerechte Achse und ist zusätzlich punktsymmetrisch.",
  },
  { typ: "input", frage: "Wie viele Symmetrieachsen hat ein regelmäßiges Sechseck?", loesung: ["6"], platzhalter: "Zahl", erklaerung: "Ein regelmäßiges n-Eck hat n Symmetrieachsen — beim Sechseck also 6." },
  {
    typ: "mc",
    frage: "Welche Figur hat genau eine Symmetrieachse?",
    antworten: ["gleichschenkliges Dreieck", "Quadrat", "Kreis", "Rechteck"],
    richtig: 0,
    erklaerung: "Das gleichschenklige Dreieck hat genau eine Achse. Quadrat 4, Kreis unendlich, Rechteck 2.",
  },
  {
    typ: "mc",
    frage: "Ist der Großbuchstabe S achsensymmetrisch?",
    antworten: ["Nein, aber punktsymmetrisch", "Ja, achsensymmetrisch", "Ja, mit 2 Achsen", "Gar nicht symmetrisch"],
    richtig: 0,
    erklaerung: "S hat keine Symmetrieachse, ist aber punktsymmetrisch (Drehung um 180°)." ,
  },
  { typ: "input", frage: "Wie viele Symmetrieachsen hat ein regelmäßiges Fünfeck?", loesung: ["5"], platzhalter: "Zahl", erklaerung: "Ein regelmäßiges Fünfeck hat 5 Symmetrieachsen." },
  {
    typ: "mc",
    frage: "Um wie viel Grad dreht man eine Figur bei einer Punktspiegelung?",
    antworten: ["180°", "90°", "360°", "45°"],
    richtig: 0,
    erklaerung: "Punktsymmetrie bedeutet: Die Figur sieht nach einer Drehung um 180° gleich aus.",
  },
];

export default SYMMETRIE_GYM6;
