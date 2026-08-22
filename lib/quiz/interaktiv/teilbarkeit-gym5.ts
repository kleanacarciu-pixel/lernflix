// ============================================================================
// Interaktive Aufgaben — Teilbarkeit & Primzahlen · Gymnasium Kl. 5
// Teiler, Vielfache, Teilbarkeitsregeln (2, 3, 5, 10), Primzahlen.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const TEILBARKEIT_GYM5: Aufgabe[] = [
  {
    typ: "mc",
    frage: "Welche dieser Zahlen ist eine Primzahl?",
    antworten: ["13", "15", "21", "9"],
    richtig: 0,
    erklaerung: "13 hat nur die Teiler 1 und 13. 15 = 3·5, 21 = 3·7, 9 = 3·3.",
  },
  {
    typ: "mc",
    frage: "Welche dieser Zahlen ist durch 2 teilbar?",
    antworten: ["38", "37", "41", "55"],
    richtig: 0,
    erklaerung: "Durch 2 teilbar sind alle geraden Zahlen (Endziffer 0, 2, 4, 6, 8). Das ist nur 38.",
  },
  {
    typ: "mc",
    frage: "Welche dieser Zahlen ist durch 5 teilbar?",
    antworten: ["45", "52", "38", "61"],
    richtig: 0,
    erklaerung: "Durch 5 teilbar sind Zahlen mit Endziffer 0 oder 5. Das ist 45.",
  },
  {
    typ: "mc",
    frage: "Welche dieser Zahlen ist durch 10 teilbar?",
    antworten: ["70", "75", "17", "107"],
    richtig: 0,
    erklaerung: "Durch 10 teilbar sind Zahlen mit Endziffer 0. Das ist 70.",
  },
  { typ: "input", frage: "Wie heißt die kleinste Primzahl?", loesung: ["2"], platzhalter: "Zahl", erklaerung: "Die kleinste Primzahl ist 2 — die einzige gerade Primzahl." },
  {
    typ: "mc",
    frage: "Welche dieser Zahlen ist durch 3 teilbar?",
    antworten: ["27", "28", "29", "31"],
    richtig: 0,
    erklaerung: "Regel: Quersumme durch 3 teilbar. 2 + 7 = 9, also ist 27 durch 3 teilbar.",
  },
  { typ: "input", frage: "Wie viele Teiler hat die Zahl 10?", loesung: ["4"], platzhalter: "Zahl", erklaerung: "Die Teiler von 10 sind 1, 2, 5, 10 — das sind 4 Stück." },
  {
    typ: "luecke",
    frage: "Vervollständige alle Teiler von 12.",
    segmente: ["1, 2, 3, ", { luecke: ["4"] }, ", 6 und ", { luecke: ["12"] }, "."],
    erklaerung: "Die Teiler von 12 sind 1, 2, 3, 4, 6 und 12.",
  },
  { typ: "input", frage: "Wie heißt das kleinste gemeinsame Vielfache von 2 und 3?", loesung: ["6"], platzhalter: "Zahl", erklaerung: "Vielfache von 2: 2, 4, 6 … und von 3: 3, 6 … Das kleinste gemeinsame ist 6." },
  {
    typ: "mc",
    frage: "Welche dieser Zahlen ist KEINE Primzahl?",
    antworten: ["9", "2", "3", "7"],
    richtig: 0,
    erklaerung: "9 = 3 · 3 ist zerlegbar. 2, 3 und 7 sind Primzahlen.",
  },
  { typ: "input", frage: "Ist die Zahl 1 eine Primzahl? Antworte mit „ja“ oder „nein“.", loesung: ["nein"], platzhalter: "ja oder nein", erklaerung: "Nein. Eine Primzahl braucht genau zwei Teiler; die 1 hat aber nur einen." },
  {
    typ: "zuordnen",
    frage: "Ordne jeder Zahl einen ihrer Teiler zu (jeder Teiler passt nur zu einer Zahl).",
    paare: [
      { links: "15", rechts: "5" },
      { links: "14", rechts: "7" },
      { links: "9", rechts: "3" },
      { links: "10", rechts: "2" },
    ],
    erklaerung: "15 ist durch 5 teilbar, 14 durch 7, 9 durch 3, 10 durch 2.",
  },
  { typ: "input", frage: "Welche Zahl zwischen 20 und 30 ist durch 6 teilbar?", loesung: ["24"], platzhalter: "Zahl", erklaerung: "24 = 6 · 4. (18 und 30 liegen nicht zwischen 20 und 30.)" },
  {
    typ: "mc",
    frage: "Eine gerade Zahl ist immer teilbar durch …",
    antworten: ["2", "3", "5", "10"],
    richtig: 0,
    erklaerung: "Gerade Zahlen enden auf 0, 2, 4, 6 oder 8 und sind immer durch 2 teilbar.",
  },
  { typ: "input", frage: "Nenne eine Primzahl zwischen 10 und 20.", loesung: ["11", "13", "17", "19"], platzhalter: "Zahl", erklaerung: "Zwischen 10 und 20 sind 11, 13, 17 und 19 Primzahlen." },
];

export default TEILBARKEIT_GYM5;
