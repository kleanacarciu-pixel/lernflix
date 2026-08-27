// ============================================================================
// Interaktive Aufgaben — Zahlen zerlegen · Grundschule Kl. 1 · Bayern
// Zahlen in Teile zerlegen (Schüttelbox), verliebte Zahlen, Verdoppeln/Halbieren.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const ZERLEGEN_GS1: Aufgabe[] = [
  { typ: "input", frage: "Zerlege die 6: 4 und wie viel?", loesung: ["2"], platzhalter: "Zahl", erklaerung: "4 + 2 = 6." },
  { typ: "input", frage: "Zerlege die 8: 5 und wie viel?", loesung: ["3"], platzhalter: "Zahl", erklaerung: "5 + 3 = 8." },
  { typ: "input", frage: "Zerlege die 10: 7 und wie viel?", loesung: ["3"], platzhalter: "Zahl", erklaerung: "7 + 3 = 10." },
  { typ: "input", frage: "Zerlege die 9: 4 und wie viel?", loesung: ["5"], platzhalter: "Zahl", erklaerung: "4 + 5 = 9." },
  { typ: "input", frage: "Verdopple die 3.", loesung: ["6"], platzhalter: "Zahl", erklaerung: "3 + 3 = 6." },
  { typ: "input", frage: "Verdopple die 7.", loesung: ["14"], platzhalter: "Zahl", erklaerung: "7 + 7 = 14." },
  { typ: "input", frage: "Die Hälfte von 8 ist …", loesung: ["4"], platzhalter: "Zahl", erklaerung: "4 + 4 = 8, also ist die Hälfte 4." },
  { typ: "input", frage: "Die Hälfte von 10 ist …", loesung: ["5"], platzhalter: "Zahl", erklaerung: "5 + 5 = 10, also ist die Hälfte 5." },
  {
    typ: "mc",
    frage: "Welche Zerlegung passt zur 7?",
    antworten: ["3 und 4", "3 und 3", "5 und 3", "4 und 4"],
    richtig: 0,
    erklaerung: "3 + 4 = 7.",
  },
  {
    typ: "mc",
    frage: "Welche zwei Zahlen sind „verliebte Zahlen“ (zusammen 10)?",
    antworten: ["6 und 4", "6 und 5", "7 und 4", "8 und 3"],
    richtig: 0,
    erklaerung: "6 + 4 = 10 — sie sind verliebte Zahlen.",
  },
  {
    typ: "luecke",
    frage: "Zerlege die 5 auf zwei Arten.",
    segmente: ["5 = 1 + ", { luecke: ["4"] }, " und 5 = 2 + ", { luecke: ["3"] }, "."],
    erklaerung: "1 + 4 = 5 und 2 + 3 = 5.",
  },
  {
    typ: "zuordnen",
    frage: "Ordne jeder Zahl ihre Zerlegung zu.",
    paare: [
      { links: "6", rechts: "2 und 4" },
      { links: "8", rechts: "4 und 4" },
      { links: "9", rechts: "6 und 3" },
      { links: "10", rechts: "5 und 5" },
    ],
    erklaerung: "2 + 4 = 6; 4 + 4 = 8; 6 + 3 = 9; 5 + 5 = 10.",
  },
  { typ: "input", frage: "In der Schüttelbox sind 10 Kugeln. Links liegen 6. Wie viele liegen rechts?", loesung: ["4"], platzhalter: "Zahl", erklaerung: "6 + 4 = 10, also liegen rechts 4 Kugeln." },
  { typ: "input", frage: "Mama teilt 12 Kekse gerecht auf 2 Teller. Wie viele Kekse liegen auf jedem Teller?", loesung: ["6"], platzhalter: "Zahl", erklaerung: "Die Hälfte von 12 ist 6." },
  {
    typ: "mc",
    frage: "Das Doppelte von 6 ist …",
    antworten: ["12", "8", "10", "3"],
    richtig: 0,
    erklaerung: "6 + 6 = 12.",
  },
];

export default ZERLEGEN_GS1;
