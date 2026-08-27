// ============================================================================
// Interaktive Aufgaben — Malnehmen & Teilen · Grundschule Kl. 3 · Bayern
// Einmaleins sicher, Teilen mit und ohne Rest, Mal-/Geteilt-Familien.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const MALTEILEN_GS3: Aufgabe[] = [
  { typ: "input", frage: "Rechne: 7 · 8", loesung: ["56"], platzhalter: "Zahl", erklaerung: "7 · 8 = 56." },
  { typ: "input", frage: "Rechne: 6 · 9", loesung: ["54"], platzhalter: "Zahl", erklaerung: "6 · 9 = 54." },
  { typ: "input", frage: "Rechne: 8 · 8", loesung: ["64"], platzhalter: "Zahl", erklaerung: "8 · 8 = 64." },
  { typ: "input", frage: "Rechne: 36 : 6", loesung: ["6"], platzhalter: "Zahl", erklaerung: "6 · 6 = 36, also 36 : 6 = 6." },
  { typ: "input", frage: "Rechne: 63 : 9", loesung: ["7"], platzhalter: "Zahl", erklaerung: "7 · 9 = 63, also 63 : 9 = 7." },
  { typ: "input", frage: "Rechne: 40 : 5", loesung: ["8"], platzhalter: "Zahl", erklaerung: "8 · 5 = 40, also 40 : 5 = 8." },
  { typ: "input", frage: "Rechne: 3 · 20", loesung: ["60"], platzhalter: "Zahl", erklaerung: "3 · 2 Zehner = 6 Zehner = 60." },
  {
    typ: "mc",
    frage: "Welche Geteilt-Aufgabe gehört zur Mal-Aufgabe 4 · 6 = 24?",
    antworten: ["24 : 4 = 6", "24 : 3 = 8", "6 : 4 = 24", "24 · 4 = 6"],
    richtig: 0,
    erklaerung: "Mal und Geteilt gehören zusammen: 4 · 6 = 24 → 24 : 4 = 6 und 24 : 6 = 4.",
  },
  {
    typ: "mc",
    frage: "17 Bonbons werden an 5 Kinder verteilt, jedes bekommt gleich viele. Wie viele bleiben übrig?",
    antworten: ["2", "0", "3", "5"],
    richtig: 0,
    erklaerung: "17 : 5 = 3 Rest 2 — jedes Kind bekommt 3 Bonbons, 2 bleiben übrig.",
  },
  {
    typ: "luecke",
    frage: "Mal-Familie der 7.",
    segmente: ["7 · 6 = ", { luecke: ["42"] }, " und 42 : 7 = ", { luecke: ["6"] }, "."],
    erklaerung: "7 · 6 = 42 und 42 : 7 = 6.",
  },
  {
    typ: "zuordnen",
    frage: "Ordne jeder Aufgabe das Ergebnis zu.",
    paare: [
      { links: "9 · 9", rechts: "81" },
      { links: "7 · 7", rechts: "49" },
      { links: "72 : 8", rechts: "9" },
      { links: "100 : 10", rechts: "10" },
    ],
    erklaerung: "9·9=81; 7·7=49; 72:8=9; 100:10=10.",
  },
  { typ: "input", frage: "In einem Regal stehen 4 Reihen mit je 9 Büchern. Wie viele Bücher sind das?", loesung: ["36"], platzhalter: "Zahl", erklaerung: "4 · 9 = 36 Bücher." },
  { typ: "input", frage: "24 Kinder bilden Mannschaften mit je 6 Kindern. Wie viele Mannschaften gibt es?", loesung: ["4"], platzhalter: "Zahl", erklaerung: "24 : 6 = 4 Mannschaften." },
  { typ: "input", frage: "Rechne: 19 : 4 — wie groß ist der Rest?", loesung: ["3", "Rest 3", "4 Rest 3"], platzhalter: "Zahl", erklaerung: "19 : 4 = 4 Rest 3 (denn 4 · 4 = 16, und 19 − 16 = 3)." },
  {
    typ: "sortieren",
    frage: "Ordne die Ergebnisse von klein nach groß: 5 · 6, 81 : 9, 4 · 7, 60 : 3",
    richtig: ["81 : 9", "60 : 3", "4 · 7", "5 · 6"],
    erklaerung: "9 < 20 < 28 < 30.",
  },
];

export default MALTEILEN_GS3;
