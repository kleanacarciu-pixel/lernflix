// ============================================================================
// Interaktive Aufgaben — Vektoren: Grundlagen · Gymnasium Kl. 11 · Bayern
// Rechnen mit Vektoren (2D): Addition, Vielfache, Betrag, Skalarprodukt.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const VEKTOREN_GYM11: Aufgabe[] = [
  { typ: "input", frage: "Der Vektor a hat die Komponenten (3, 4). Wie groß ist sein Betrag |a| = √(3² + 4²)?", loesung: ["5"], platzhalter: "Zahl", erklaerung: "√(9 + 16) = √25 = 5." },
  { typ: "input", frage: "Addiere die Vektoren (1, 2) + (3, 4). Wie lautet die erste Komponente des Ergebnisses?", loesung: ["4"], platzhalter: "Zahl", erklaerung: "Komponentenweise: 1 + 3 = 4." },
  { typ: "input", frage: "Addiere (1, 2) + (3, 4). Wie lautet die zweite Komponente?", loesung: ["6"], platzhalter: "Zahl", erklaerung: "2 + 4 = 6." },
  { typ: "input", frage: "Berechne 2 · (3, 1). Wie lautet die erste Komponente?", loesung: ["6"], platzhalter: "Zahl", erklaerung: "Jede Komponente mal 2: 2 · 3 = 6." },
  { typ: "input", frage: "Berechne das Skalarprodukt (1, 2) · (3, 4) = 1·3 + 2·4.", loesung: ["11"], platzhalter: "Zahl", erklaerung: "1·3 + 2·4 = 3 + 8 = 11." },
  { typ: "input", frage: "Berechne das Skalarprodukt (1, 0) · (0, 1).", loesung: ["0"], platzhalter: "Zahl", erklaerung: "1·0 + 0·1 = 0." },
  {
    typ: "mc",
    frage: "Zwei Vektoren stehen senkrecht zueinander, wenn ihr Skalarprodukt …",
    antworten: ["0 ist", "1 ist", "negativ ist", "gleich ist"],
    richtig: 0,
    erklaerung: "Ein Skalarprodukt von 0 bedeutet: die Vektoren sind orthogonal (senkrecht).",
  },
  { typ: "input", frage: "Wie groß ist der Betrag von (6, 8)? |(6, 8)| = √(36 + 64).", loesung: ["10"], platzhalter: "Zahl", erklaerung: "√100 = 10." },
  { typ: "input", frage: "Berechne (5, 3) − (2, 1). Erste Komponente?", loesung: ["3"], platzhalter: "Zahl", erklaerung: "5 − 2 = 3." },
  { typ: "input", frage: "Berechne (5, 3) − (2, 1). Zweite Komponente?", loesung: ["2"], platzhalter: "Zahl", erklaerung: "3 − 1 = 2." },
  {
    typ: "luecke",
    frage: "Betrag des Vektors (3, 4).",
    segmente: ["|(3, 4)| = √(9 + 16) = √", { luecke: ["25"] }, " = ", { luecke: ["5"] }, "."],
    erklaerung: "9 + 16 = 25 und √25 = 5.",
  },
  { typ: "input", frage: "Berechne das Skalarprodukt (2, 3) · (4, 1).", loesung: ["11"], platzhalter: "Zahl", erklaerung: "2·4 + 3·1 = 8 + 3 = 11." },
  {
    typ: "mc",
    frage: "Der Betrag eines Vektors ist …",
    antworten: ["seine Länge", "seine Richtung", "seine erste Komponente", "immer 1"],
    richtig: 0,
    erklaerung: "Der Betrag |a| gibt die Länge des Vektors an.",
  },
  { typ: "input", frage: "Berechne 3 · (1, 2). Zweite Komponente?", loesung: ["6"], platzhalter: "Zahl", erklaerung: "3 · 2 = 6." },
  { typ: "input", frage: "Wie groß ist der Betrag von (0, 5)?", loesung: ["5"], platzhalter: "Zahl", erklaerung: "√(0² + 5²) = √25 = 5." },
];

export default VEKTOREN_GYM11;
