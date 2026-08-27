// ============================================================================
// Interaktive Aufgaben — Teilbarkeit & Primzahlen · Realschule Kl. 5 · Bayern
// Teiler, Vielfache, Teilbarkeitsregeln, Primzahlen.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const TEILBARKEIT_RS5: Aufgabe[] = [
  {
    typ: "mc",
    frage: "Welche dieser Zahlen ist eine Primzahl?",
    antworten: ["11", "21", "15", "27"],
    richtig: 0,
    erklaerung: "11 hat nur die Teiler 1 und 11. 21 = 3·7, 15 = 3·5, 27 = 3·9.",
  },
  {
    typ: "mc",
    frage: "Welche dieser Zahlen ist durch 2 teilbar?",
    antworten: ["74", "73", "71", "77"],
    richtig: 0,
    erklaerung: "Durch 2 teilbar sind gerade Zahlen (Endziffer 0, 2, 4, 6, 8). Das ist 74.",
  },
  {
    typ: "mc",
    frage: "Welche dieser Zahlen ist durch 5 teilbar?",
    antworten: ["85", "82", "78", "91"],
    richtig: 0,
    erklaerung: "Durch 5 teilbar sind Zahlen mit Endziffer 0 oder 5. Das ist 85.",
  },
  {
    typ: "mc",
    frage: "Welche dieser Zahlen ist durch 10 teilbar?",
    antworten: ["120", "125", "102", "115"],
    richtig: 0,
    erklaerung: "Durch 10 teilbar sind Zahlen mit Endziffer 0. Das ist 120.",
  },
  { typ: "input", frage: "Wie heißt die kleinste Primzahl?", loesung: ["2"], platzhalter: "Zahl", erklaerung: "Die kleinste Primzahl ist 2 — sie ist auch die einzige gerade Primzahl." },
  {
    typ: "mc",
    frage: "Welche dieser Zahlen ist durch 3 teilbar?",
    antworten: ["51", "52", "53", "55"],
    richtig: 0,
    erklaerung: "Regel: Quersumme durch 3 teilbar. 5 + 1 = 6, also ist 51 durch 3 teilbar (51 = 3 · 17).",
  },
  { typ: "input", frage: "Wie viele Teiler hat die Zahl 15?", loesung: ["4"], platzhalter: "Zahl", erklaerung: "Die Teiler von 15 sind 1, 3, 5, 15 — das sind 4 Stück." },
  {
    typ: "luecke",
    frage: "Vervollständige alle Teiler von 18.",
    segmente: ["1, 2, 3, ", { luecke: ["6"] }, ", 9 und ", { luecke: ["18"] }, "."],
    erklaerung: "Die Teiler von 18 sind 1, 2, 3, 6, 9 und 18.",
  },
  { typ: "input", frage: "Wie heißt das kleinste gemeinsame Vielfache von 4 und 6?", loesung: ["12"], platzhalter: "Zahl", erklaerung: "Vielfache von 4: 4, 8, 12 … und von 6: 6, 12 … Das kleinste gemeinsame ist 12." },
  {
    typ: "mc",
    frage: "Welche dieser Zahlen ist KEINE Primzahl?",
    antworten: ["25", "5", "3", "11"],
    richtig: 0,
    erklaerung: "25 = 5 · 5 ist zerlegbar. 5, 3 und 11 sind Primzahlen.",
  },
  { typ: "input", frage: "Gibt es eine gerade Primzahl? Antworte mit „ja“ oder „nein“.", loesung: ["ja"], platzhalter: "ja oder nein", erklaerung: "Ja — die 2 ist gerade und eine Primzahl (die einzige gerade Primzahl)." },
  {
    typ: "zuordnen",
    frage: "Ordne jeder Zahl einen ihrer Teiler zu (jeder Teiler passt nur zu einer Zahl).",
    paare: [
      { links: "21", rechts: "7" },
      { links: "22", rechts: "11" },
      { links: "25", rechts: "5" },
      { links: "26", rechts: "13" },
    ],
    erklaerung: "21 = 3·7, 22 = 2·11, 25 = 5·5, 26 = 2·13.",
  },
  { typ: "input", frage: "Welche Zahl zwischen 30 und 40 ist durch 9 teilbar?", loesung: ["36"], platzhalter: "Zahl", erklaerung: "36 = 9 · 4. (27 und 45 liegen nicht zwischen 30 und 40.)" },
  {
    typ: "mc",
    frage: "Auf welche Ziffern enden gerade Zahlen?",
    antworten: ["0, 2, 4, 6 oder 8", "1, 3, 5, 7 oder 9", "nur 0", "nur 2"],
    richtig: 0,
    erklaerung: "Gerade Zahlen enden auf 0, 2, 4, 6 oder 8.",
  },
  { typ: "input", frage: "Nenne die Primzahl zwischen 20 und 25.", loesung: ["23"], platzhalter: "Zahl", erklaerung: "23 ist nur durch 1 und 23 teilbar. 21 = 3·7, 22 = 2·11, 24 = 2·12." },
];

export default TEILBARKEIT_RS5;
