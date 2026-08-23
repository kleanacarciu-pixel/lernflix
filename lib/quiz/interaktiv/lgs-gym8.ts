// ============================================================================
// Interaktive Aufgaben — Lineare Gleichungssysteme · Gymnasium Kl. 8 · Bayern
// Zwei Gleichungen, zwei Unbekannte: einsetzen, gleichsetzen, addieren.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const LGS_GYM8: Aufgabe[] = [
  { typ: "input", frage: "Gegeben: x + y = 10 und x = 4. Wie groß ist y?", loesung: ["6"], platzhalter: "Zahl", erklaerung: "4 + y = 10 → y = 6." },
  { typ: "input", frage: "Gegeben: x + y = 7 und x − y = 1. Wie groß ist x?", loesung: ["4"], platzhalter: "Zahl", erklaerung: "Beide Gleichungen addieren: 2x = 8 → x = 4." },
  { typ: "input", frage: "Gegeben: x + y = 7 und x − y = 1. Wie groß ist y?", loesung: ["3"], platzhalter: "Zahl", erklaerung: "x = 4, eingesetzt: 4 + y = 7 → y = 3." },
  { typ: "input", frage: "Gegeben: 2x = 10 und y = x + 1. Wie groß ist y?", loesung: ["6"], platzhalter: "Zahl", erklaerung: "x = 5, also y = 5 + 1 = 6." },
  { typ: "input", frage: "Gegeben: x + y = 12 und y = 2x. Wie groß ist x?", loesung: ["4"], platzhalter: "Zahl", erklaerung: "x + 2x = 12 → 3x = 12 → x = 4." },
  { typ: "input", frage: "Gegeben: x + y = 12 und y = 2x. Wie groß ist y?", loesung: ["8"], platzhalter: "Zahl", erklaerung: "x = 4, also y = 2 · 4 = 8." },
  {
    typ: "mc",
    frage: "Was macht man beim Einsetzungsverfahren?",
    antworten: ["eine Gleichung nach einer Variablen auflösen und in die andere einsetzen", "beide Gleichungen malnehmen", "immer beide addieren", "einen Kreis zeichnen"],
    richtig: 0,
    erklaerung: "Man löst eine Gleichung nach x oder y auf und setzt den Ausdruck in die andere Gleichung ein.",
  },
  { typ: "input", frage: "Gegeben: 3x + y = 10 und y = 1. Wie groß ist x?", loesung: ["3"], platzhalter: "Zahl", erklaerung: "3x + 1 = 10 → 3x = 9 → x = 3." },
  { typ: "input", frage: "Gegeben: x − y = 5 und x + y = 11. Wie groß ist x?", loesung: ["8"], platzhalter: "Zahl", erklaerung: "Addieren: 2x = 16 → x = 8." },
  {
    typ: "luecke",
    frage: "Löse durch Addieren.",
    segmente: ["Aus x + y = 9 und x − y = 3 folgt 2x = ", { luecke: ["12"] }, ", also x = ", { luecke: ["6"] }, "."],
    erklaerung: "Beide Gleichungen addieren: 2x = 12, also x = 6.",
  },
  { typ: "input", frage: "Aus x + y = 9 und x − y = 3 ergibt sich x = 6. Wie groß ist dann y?", loesung: ["3"], platzhalter: "Zahl", erklaerung: "6 + y = 9 → y = 3." },
  { typ: "input", frage: "Gegeben: 2x + y = 8 und y = 2. Wie groß ist x?", loesung: ["3"], platzhalter: "Zahl", erklaerung: "2x + 2 = 8 → 2x = 6 → x = 3." },
  { typ: "input", frage: "Zwei Zahlen: ihre Summe ist 20, ihre Differenz 4. Wie groß ist die größere Zahl?", loesung: ["12"], platzhalter: "Zahl", erklaerung: "x + y = 20 und x − y = 4. Addieren: 2x = 24 → x = 12." },
  { typ: "input", frage: "Zwei Zahlen: ihre Summe ist 20, ihre Differenz 4. Wie groß ist die kleinere Zahl?", loesung: ["8"], platzhalter: "Zahl", erklaerung: "Die größere ist 12, also 20 − 12 = 8." },
  {
    typ: "mc",
    frage: "Ein lineares Gleichungssystem mit zwei Gleichungen und zwei Unbekannten hat meistens …",
    antworten: ["genau eine Lösung", "keine Lösung", "unendlich viele Lösungen", "immer zwei Lösungen"],
    richtig: 0,
    erklaerung: "In der Regel schneiden sich die beiden Geraden in genau einem Punkt — eine Lösung.",
  },
];

export default LGS_GYM8;
