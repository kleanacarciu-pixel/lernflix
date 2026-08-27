// ============================================================================
// Interaktive Aufgaben — Geraden & Ebenen im Raum · Gymnasium Kl. 12
// Vektoren im Raum (3D): Betrag, Skalarprodukt, Geraden/Ebenen.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const RAUM_GYM12: Aufgabe[] = [
  { typ: "input", frage: "Betrag des Vektors (2, 3, 6): |(2, 3, 6)| = √(4 + 9 + 36).", loesung: ["7"], platzhalter: "Zahl", erklaerung: "√49 = 7." },
  { typ: "input", frage: "Betrag des Vektors (1, 2, 2): √(1 + 4 + 4).", loesung: ["3"], platzhalter: "Zahl", erklaerung: "√9 = 3." },
  { typ: "input", frage: "Skalarprodukt (1, 2, 3) · (1, 1, 1) = 1 + 2 + 3.", loesung: ["6"], platzhalter: "Zahl", erklaerung: "1·1 + 2·1 + 3·1 = 6." },
  { typ: "input", frage: "Skalarprodukt (1, 0, 0) · (0, 0, 1).", loesung: ["0"], platzhalter: "Zahl", erklaerung: "1·0 + 0·0 + 0·1 = 0 (die Vektoren sind orthogonal)." },
  {
    typ: "mc",
    frage: "Wodurch beschreibt man eine Gerade im Raum?",
    antworten: ["durch einen Punkt und einen Richtungsvektor", "durch zwei Zahlen", "durch einen Winkel", "durch eine Fläche"],
    richtig: 0,
    erklaerung: "Geradengleichung: x = Stützvektor + t · Richtungsvektor.",
  },
  { typ: "input", frage: "Berechne (3, 3, 3) + (1, 1, 1). Erste Komponente?", loesung: ["4"], platzhalter: "Zahl", erklaerung: "3 + 1 = 4." },
  { typ: "input", frage: "Skalarprodukt (2, 1, 2) · (1, 2, 1) = 2 + 2 + 2.", loesung: ["6"], platzhalter: "Zahl", erklaerung: "2·1 + 1·2 + 2·1 = 2 + 2 + 2 = 6." },
  {
    typ: "mc",
    frage: "Zwei Vektoren im Raum stehen senkrecht (orthogonal) zueinander, wenn ihr Skalarprodukt …",
    antworten: ["0 ist", "1 ist", "negativ ist", "gleich ist"],
    richtig: 0,
    erklaerung: "Skalarprodukt 0 bedeutet Orthogonalität.",
  },
  { typ: "input", frage: "Berechne 2 · (1, 2, 3). Dritte Komponente?", loesung: ["6"], platzhalter: "Zahl", erklaerung: "2 · 3 = 6." },
  { typ: "input", frage: "Betrag des Vektors (0, 0, 5).", loesung: ["5"], platzhalter: "Zahl", erklaerung: "√(0 + 0 + 25) = 5." },
  {
    typ: "luecke",
    frage: "Betrag von (2, 3, 6).",
    segmente: ["√(4 + 9 + 36) = √", { luecke: ["49"] }, " = ", { luecke: ["7"] }, "."],
    erklaerung: "4 + 9 + 36 = 49 und √49 = 7.",
  },
  { typ: "input", frage: "Berechne (5, 5, 5) − (2, 3, 1). Zweite Komponente?", loesung: ["2"], platzhalter: "Zahl", erklaerung: "5 − 3 = 2." },
  {
    typ: "mc",
    frage: "Wodurch kann man eine Ebene im Raum beschreiben?",
    antworten: ["durch einen Punkt und zwei Richtungsvektoren", "durch einen Punkt allein", "durch eine Zahl", "durch zwei Punkte allein"],
    richtig: 0,
    erklaerung: "Parameterform: x = Stützvektor + s·u + t·v mit zwei Richtungsvektoren.",
  },
  { typ: "input", frage: "Skalarprodukt (1, 1, 0) · (0, 0, 1).", loesung: ["0"], platzhalter: "Zahl", erklaerung: "1·0 + 1·0 + 0·1 = 0." },
  { typ: "input", frage: "Betrag des Vektors (6, 0, 8): √(36 + 0 + 64).", loesung: ["10"], platzhalter: "Zahl", erklaerung: "√100 = 10." },
];

export default RAUM_GYM12;
