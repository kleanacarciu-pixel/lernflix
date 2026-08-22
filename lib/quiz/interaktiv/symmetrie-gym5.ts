// ============================================================================
// Interaktive Aufgaben — Achsensymmetrie · Gymnasium Kl. 5
// Symmetrieachsen zählen, achsensymmetrische Figuren und Buchstaben, Spiegeln.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const SYMMETRIE_GYM5: Aufgabe[] = [
  { typ: "input", frage: "Wie viele Symmetrieachsen hat ein Quadrat?", loesung: ["4"], platzhalter: "Zahl", erklaerung: "Ein Quadrat hat 4 Symmetrieachsen: zwei durch die Seitenmitten und zwei durch die Ecken." },
  {
    typ: "mc",
    frage: "Wie viele Symmetrieachsen hat ein Rechteck, das kein Quadrat ist?",
    antworten: ["2", "4", "1", "0"],
    richtig: 0,
    erklaerung: "Ein Rechteck hat 2 Symmetrieachsen — durch die Mitten der gegenüberliegenden Seiten.",
  },
  { typ: "input", frage: "Wie viele Symmetrieachsen hat ein gleichseitiges Dreieck?", loesung: ["3"], platzhalter: "Zahl", erklaerung: "Ein gleichseitiges Dreieck hat 3 Symmetrieachsen." },
  {
    typ: "mc",
    frage: "Welcher Großbuchstabe hat eine senkrechte Symmetrieachse?",
    antworten: ["T", "F", "L", "P"],
    richtig: 0,
    erklaerung: "T ist spiegelsymmetrisch zur senkrechten Mittelachse. F, L und P sind es nicht.",
  },
  {
    typ: "mc",
    frage: "Wie viele Symmetrieachsen hat ein Kreis?",
    antworten: ["unendlich viele", "1", "2", "4"],
    richtig: 0,
    erklaerung: "Jede Gerade durch den Mittelpunkt ist eine Symmetrieachse — unendlich viele.",
  },
  { typ: "input", frage: "Wie viele Symmetrieachsen hat der Großbuchstabe A?", loesung: ["1"], platzhalter: "Zahl", erklaerung: "Das A hat genau eine senkrechte Symmetrieachse." },
  {
    typ: "luecke",
    frage: "Vervollständige.",
    segmente: ["Ein Quadrat hat ", { luecke: ["4"] }, " Symmetrieachsen, ein Rechteck hat ", { luecke: ["2"] }, "."],
    erklaerung: "Quadrat: 4 Achsen, Rechteck: 2 Achsen.",
  },
  {
    typ: "mc",
    frage: "Bei einer Spiegelung an einer Achse bleibt der Abstand eines Punktes zur Achse …",
    antworten: ["gleich", "größer", "kleiner", "null"],
    richtig: 0,
    erklaerung: "Der Bildpunkt hat denselben Abstand zur Spiegelachse wie der ursprüngliche Punkt.",
  },
  {
    typ: "mc",
    frage: "Welche Figur ist achsensymmetrisch?",
    antworten: ["gleichschenkliges Dreieck", "beliebiges Dreieck", "schiefes Parallelogramm", "die Ziffer 7"],
    richtig: 0,
    erklaerung: "Ein gleichschenkliges Dreieck hat eine Symmetrieachse durch die Spitze.",
  },
  { typ: "input", frage: "Wie viele Symmetrieachsen hat ein regelmäßiges Sechseck?", loesung: ["6"], platzhalter: "Zahl", erklaerung: "Ein regelmäßiges n-Eck hat n Symmetrieachsen — beim Sechseck also 6." },
  {
    typ: "mc",
    frage: "Wie viele Symmetrieachsen hat der Großbuchstabe M?",
    antworten: ["1", "2", "0", "3"],
    richtig: 0,
    erklaerung: "M hat genau eine senkrechte Symmetrieachse.",
  },
  {
    typ: "mc",
    frage: "Welche Figur hat genau 2 Symmetrieachsen?",
    antworten: ["Rechteck", "Quadrat", "gleichseitiges Dreieck", "Kreis"],
    richtig: 0,
    erklaerung: "Das Rechteck hat 2 Achsen. Quadrat 4, gleichseitiges Dreieck 3, Kreis unendlich.",
  },
  { typ: "input", frage: "Wie viele Symmetrieachsen hat ein regelmäßiges Fünfeck?", loesung: ["5"], platzhalter: "Zahl", erklaerung: "Ein regelmäßiges Fünfeck hat 5 Symmetrieachsen." },
  {
    typ: "mc",
    frage: "Ein Schmetterling mit gleichen Flügeln ist ein Beispiel für …",
    antworten: ["Achsensymmetrie", "Punktsymmetrie", "keine Symmetrie", "eine Verschiebung"],
    richtig: 0,
    erklaerung: "Die beiden Flügelseiten sind Spiegelbilder — das ist Achsensymmetrie.",
  },
  { typ: "input", frage: "Wie viele Symmetrieachsen hat der Großbuchstabe H?", loesung: ["2"], platzhalter: "Zahl", erklaerung: "H hat zwei Symmetrieachsen: eine senkrechte und eine waagerechte." },
];

export default SYMMETRIE_GYM5;
