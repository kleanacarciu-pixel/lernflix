// ============================================================================
// Interaktive Aufgaben — Terme & Gleichungen (Einstieg) · Mittelschule Kl. 7
// Terme aufstellen und vereinfachen, einfache Gleichungen durch Umkehraufgaben.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const TERME_GLEICHUNGEN_MS7: Aufgabe[] = [
  { typ: "input", frage: "Vereinfache den Term: 3x + 5x", loesung: ["8x", "8 x", "8·x", "8 · x"], platzhalter: "z. B. 8x", erklaerung: "3x + 5x = (3 + 5) · x = 8x." },
  { typ: "input", frage: "Vereinfache den Term: 9a − 4a", loesung: ["5a", "5 a", "5·a", "5 · a"], platzhalter: "z. B. 5a", erklaerung: "9a − 4a = 5a." },
  { typ: "input", frage: "Vereinfache den Term: 2x + 3 + 4x", loesung: ["6x+3", "6x + 3", "3+6x", "3 + 6x"], platzhalter: "z. B. 6x + 3", erklaerung: "2x + 4x = 6x, die 3 bleibt: 6x + 3." },
  { typ: "input", frage: "Berechne den Wert des Terms 4x + 2 für x = 3.", loesung: ["14"], platzhalter: "Zahl", erklaerung: "4 · 3 + 2 = 12 + 2 = 14." },
  { typ: "input", frage: "Berechne den Wert des Terms 5x − 1 für x = 2.", loesung: ["9"], platzhalter: "Zahl", erklaerung: "5 · 2 − 1 = 10 − 1 = 9." },
  { typ: "input", frage: "Löse die Gleichung: x + 7 = 12", loesung: ["5", "x=5", "x = 5"], platzhalter: "Zahl", erklaerung: "x = 12 − 7 = 5." },
  { typ: "input", frage: "Löse die Gleichung: x − 4 = 9", loesung: ["13", "x=13", "x = 13"], platzhalter: "Zahl", erklaerung: "x = 9 + 4 = 13." },
  { typ: "input", frage: "Löse die Gleichung: 3x = 21", loesung: ["7", "x=7", "x = 7"], platzhalter: "Zahl", erklaerung: "x = 21 : 3 = 7." },
  { typ: "input", frage: "Löse die Gleichung: x : 4 = 5", loesung: ["20", "x=20", "x = 20"], platzhalter: "Zahl", erklaerung: "x = 5 · 4 = 20." },
  { typ: "input", frage: "Löse die Gleichung: 2x + 3 = 11", loesung: ["4", "x=4", "x = 4"], platzhalter: "Zahl", erklaerung: "2x = 11 − 3 = 8, also x = 8 : 2 = 4." },
  {
    typ: "mc",
    frage: "Welcher Term passt zu: „Ich denke mir eine Zahl x, verdopple sie und zähle 5 dazu“?",
    antworten: ["2x + 5", "5x + 2", "2 · (x + 5)", "x + 7"],
    richtig: 0,
    erklaerung: "Verdoppeln: 2x. Dann 5 dazu: 2x + 5.",
  },
  {
    typ: "mc",
    frage: "Für welchen Wert von x stimmt die Gleichung x + x = 16?",
    antworten: ["8", "16", "4", "32"],
    richtig: 0,
    erklaerung: "x + x = 2x = 16, also x = 8.",
  },
  {
    typ: "luecke",
    frage: "Löse die Gleichungen.",
    segmente: ["x + 6 = 10 → x = ", { luecke: ["4"] }, "  und  5x = 30 → x = ", { luecke: ["6"] }, "."],
    erklaerung: "x = 10 − 6 = 4 und x = 30 : 5 = 6.",
  },
  {
    typ: "zuordnen",
    frage: "Ordne jeder Gleichung ihre Lösung zu.",
    paare: [
      { links: "x + 2 = 9", rechts: "x = 7" },
      { links: "x − 5 = 5", rechts: "x = 10" },
      { links: "4x = 12", rechts: "x = 3" },
      { links: "x : 2 = 8", rechts: "x = 16" },
    ],
    erklaerung: "9 − 2 = 7; 5 + 5 = 10; 12 : 4 = 3; 8 · 2 = 16.",
  },
  { typ: "input", frage: "Ein Kinoticket kostet x Euro. 3 Tickets kosten zusammen 24 €. Wie viel kostet ein Ticket?", loesung: ["8"], einheit: "€", platzhalter: "Zahl", erklaerung: "3x = 24, also x = 24 : 3 = 8 €." },
];

export default TERME_GLEICHUNGEN_MS7;
