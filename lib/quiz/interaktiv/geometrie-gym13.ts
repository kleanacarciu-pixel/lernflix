// ============================================================================
// Interaktive Aufgaben — Analytische Geometrie (Abitur) · Gymnasium Kl. 13
// Wiederholung: Vektoren im Raum, Betrag, Skalarprodukt, Geraden & Ebenen.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const GEOMETRIE_GYM13: Aufgabe[] = [
  { typ: "input", frage: "Berechne den Betrag |(3, 4, 0)| = √(9 + 16 + 0).", loesung: ["5"], platzhalter: "Zahl", erklaerung: "√25 = 5." },
  { typ: "input", frage: "Berechne den Betrag |(2, 3, 6)|.", loesung: ["7"], platzhalter: "Zahl", erklaerung: "√(4 + 9 + 36) = √49 = 7." },
  { typ: "input", frage: "Skalarprodukt (1, 2, 3) · (1, 1, 1).", loesung: ["6"], platzhalter: "Zahl", erklaerung: "1 + 2 + 3 = 6." },
  { typ: "input", frage: "Skalarprodukt (1, 0, 0) · (0, 1, 0).", loesung: ["0"], platzhalter: "Zahl", erklaerung: "0 (die Vektoren sind orthogonal)." },
  {
    typ: "mc",
    frage: "Ein Skalarprodukt von 0 bedeutet, die Vektoren sind …",
    antworten: ["orthogonal (senkrecht)", "parallel", "gleich lang", "gleich"],
    richtig: 0,
    erklaerung: "Skalarprodukt 0 ⇔ die Vektoren stehen senkrecht aufeinander.",
  },
  { typ: "input", frage: "Skalarprodukt (2, 2, 2) · (1, 1, 1).", loesung: ["6"], platzhalter: "Zahl", erklaerung: "2 + 2 + 2 = 6." },
  { typ: "input", frage: "Berechne den Betrag |(1, 2, 2)|.", loesung: ["3"], platzhalter: "Zahl", erklaerung: "√(1 + 4 + 4) = √9 = 3." },
  {
    typ: "mc",
    frage: "Eine Gerade im Raum beschreibt man durch einen Punkt und …",
    antworten: ["einen Richtungsvektor", "eine Zahl", "einen Winkel", "eine Fläche"],
    richtig: 0,
    erklaerung: "Geradengleichung: x = Stützvektor + t · Richtungsvektor.",
  },
  { typ: "input", frage: "Berechne 3 · (1, 2, 3). Erste Komponente?", loesung: ["3"], platzhalter: "Zahl", erklaerung: "3 · 1 = 3." },
  { typ: "input", frage: "Berechne (4, 4, 4) − (1, 2, 3). Dritte Komponente?", loesung: ["1"], platzhalter: "Zahl", erklaerung: "4 − 3 = 1." },
  {
    typ: "mc",
    frage: "Eine Ebene im Raum beschreibt man (in Parameterform) durch …",
    antworten: ["einen Punkt und zwei Richtungsvektoren", "einen Punkt allein", "eine Zahl", "einen Winkel"],
    richtig: 0,
    erklaerung: "x = Stützvektor + s·u + t·v mit zwei Richtungsvektoren.",
  },
  { typ: "input", frage: "Skalarprodukt (3, 0, 4) · (3, 0, 4). (Das ist |v|².)", loesung: ["25"], platzhalter: "Zahl", erklaerung: "9 + 0 + 16 = 25." },
  {
    typ: "luecke",
    frage: "Betrag von (6, 8, 0).",
    segmente: ["√(36 + 64 + 0) = √", { luecke: ["100"] }, " = ", { luecke: ["10"] }, "."],
    erklaerung: "36 + 64 = 100 und √100 = 10.",
  },
  { typ: "input", frage: "Berechne den Betrag |(0, 0, 7)|.", loesung: ["7"], platzhalter: "Zahl", erklaerung: "√(0 + 0 + 49) = 7." },
  { typ: "input", frage: "Skalarprodukt (5, 1, 2) · (1, 0, 0).", loesung: ["5"], platzhalter: "Zahl", erklaerung: "5 · 1 + 1 · 0 + 2 · 0 = 5." },
];

export default GEOMETRIE_GYM13;
