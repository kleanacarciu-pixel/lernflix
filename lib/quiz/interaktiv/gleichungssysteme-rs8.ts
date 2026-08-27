// ============================================================================
// Interaktive Aufgaben — Gleichungssysteme · Realschule Kl. 8 · Bayern
// Zwei Gleichungen, zwei Unbekannte: einsetzen, gleichsetzen, addieren.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const GLEICHUNGSSYSTEME_RS8: Aufgabe[] = [
  { typ: "input", frage: "Gegeben: x + y = 9 und x = 5. Wie groß ist y?", loesung: ["4"], platzhalter: "Zahl", erklaerung: "5 + y = 9 → y = 4." },
  { typ: "input", frage: "Gegeben: x + y = 8 und x − y = 2. Wie groß ist x?", loesung: ["5"], platzhalter: "Zahl", erklaerung: "Beide Gleichungen addieren: 2x = 10 → x = 5." },
  { typ: "input", frage: "Gegeben: x + y = 8 und x − y = 2. Wie groß ist y?", loesung: ["3"], platzhalter: "Zahl", erklaerung: "x = 5, eingesetzt: 5 + y = 8 → y = 3." },
  { typ: "input", frage: "Gegeben: 3x = 12 und y = x + 2. Wie groß ist y?", loesung: ["6"], platzhalter: "Zahl", erklaerung: "x = 4, also y = 4 + 2 = 6." },
  { typ: "input", frage: "Gegeben: x + y = 15 und y = 2x. Wie groß ist x?", loesung: ["5"], platzhalter: "Zahl", erklaerung: "x + 2x = 15 → 3x = 15 → x = 5." },
  { typ: "input", frage: "Gegeben: x + y = 15 und y = 2x. Wie groß ist y?", loesung: ["10"], platzhalter: "Zahl", erklaerung: "x = 5, also y = 2 · 5 = 10." },
  {
    typ: "mc",
    frage: "Was macht man beim Einsetzungsverfahren?",
    antworten: ["eine Gleichung nach einer Variablen auflösen und in die andere einsetzen", "beide Gleichungen malnehmen", "immer beide addieren", "raten"],
    richtig: 0,
    erklaerung: "Man löst eine Gleichung nach x oder y auf und setzt den Ausdruck in die andere Gleichung ein.",
  },
  { typ: "input", frage: "Gegeben: 2x + y = 11 und y = 3. Wie groß ist x?", loesung: ["4"], platzhalter: "Zahl", erklaerung: "2x + 3 = 11 → 2x = 8 → x = 4." },
  { typ: "input", frage: "Gegeben: x − y = 4 und x + y = 10. Wie groß ist x?", loesung: ["7"], platzhalter: "Zahl", erklaerung: "Addieren: 2x = 14 → x = 7." },
  {
    typ: "luecke",
    frage: "Löse durch Addieren.",
    segmente: ["Aus x + y = 10 und x − y = 2 folgt 2x = ", { luecke: ["12"] }, ", also x = ", { luecke: ["6"] }, "."],
    erklaerung: "Beide Gleichungen addieren: 2x = 12, also x = 6.",
  },
  { typ: "input", frage: "Aus x + y = 10 und x − y = 2 ergibt sich x = 6. Wie groß ist dann y?", loesung: ["4"], platzhalter: "Zahl", erklaerung: "6 + y = 10 → y = 4." },
  {
    typ: "mc",
    frage: "Ein lineares Gleichungssystem mit zwei Gleichungen und zwei Unbekannten hat meistens …",
    antworten: ["genau eine Lösung", "keine Lösung", "unendlich viele Lösungen", "immer zwei Lösungen"],
    richtig: 0,
    erklaerung: "In der Regel schneiden sich die beiden Geraden in genau einem Punkt.",
  },
  { typ: "input", frage: "Zwei Zahlen: ihre Summe ist 30, ihre Differenz 6. Wie groß ist die größere Zahl?", loesung: ["18"], platzhalter: "Zahl", erklaerung: "x + y = 30 und x − y = 6. Addieren: 2x = 36 → x = 18." },
  { typ: "input", frage: "Zwei Zahlen: ihre Summe ist 30, ihre Differenz 6. Wie groß ist die kleinere Zahl?", loesung: ["12"], platzhalter: "Zahl", erklaerung: "Die größere ist 18, also 30 − 18 = 12." },
  { typ: "input", frage: "Gegeben: 4x + y = 13 und y = 1. Wie groß ist x?", loesung: ["3"], platzhalter: "Zahl", erklaerung: "4x + 1 = 13 → 4x = 12 → x = 3." },
];

export default GLEICHUNGSSYSTEME_RS8;
