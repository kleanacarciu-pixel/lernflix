// ============================================================================
// Interaktive Aufgaben — Plus & Minus bis 20 · Grundschule Kl. 1 · Bayern
// Addieren und Subtrahieren bis 20, auch mit Zehnerübergang, kleine Sachaufgaben.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const PLUSMINUS20_GS1: Aufgabe[] = [
  { typ: "input", frage: "Rechne: 3 + 4", loesung: ["7"], platzhalter: "Zahl", erklaerung: "3 + 4 = 7." },
  { typ: "input", frage: "Rechne: 5 + 5", loesung: ["10"], platzhalter: "Zahl", erklaerung: "5 + 5 = 10." },
  { typ: "input", frage: "Rechne: 8 − 3", loesung: ["5"], platzhalter: "Zahl", erklaerung: "8 − 3 = 5." },
  { typ: "input", frage: "Rechne: 10 − 6", loesung: ["4"], platzhalter: "Zahl", erklaerung: "10 − 6 = 4." },
  { typ: "input", frage: "Rechne: 9 + 4", loesung: ["13"], platzhalter: "Zahl", erklaerung: "9 + 1 = 10, dann noch 3 dazu: 13." },
  { typ: "input", frage: "Rechne: 7 + 6", loesung: ["13"], platzhalter: "Zahl", erklaerung: "7 + 3 = 10, dann noch 3 dazu: 13." },
  { typ: "input", frage: "Rechne: 14 − 5", loesung: ["9"], platzhalter: "Zahl", erklaerung: "14 − 4 = 10, dann noch 1 weg: 9." },
  { typ: "input", frage: "Rechne: 12 + 7", loesung: ["19"], platzhalter: "Zahl", erklaerung: "12 + 7 = 19." },
  {
    typ: "mc",
    frage: "Welche Rechnung ergibt 10?",
    antworten: ["6 + 4", "5 + 4", "7 + 2", "3 + 6"],
    richtig: 0,
    erklaerung: "6 + 4 = 10. Die anderen ergeben 9.",
  },
  {
    typ: "mc",
    frage: "Lena hat 5 Bonbons. Sie bekommt 3 dazu. Wie viele hat sie jetzt?",
    antworten: ["8", "2", "7", "9"],
    richtig: 0,
    erklaerung: "5 + 3 = 8 Bonbons.",
  },
  {
    typ: "luecke",
    frage: "Verliebte Zahlen (zusammen 10).",
    segmente: ["7 + ", { luecke: ["3"] }, " = 10 und 2 + ", { luecke: ["8"] }, " = 10."],
    erklaerung: "7 und 3 sind zusammen 10. 2 und 8 sind zusammen 10.",
  },
  {
    typ: "zuordnen",
    frage: "Ordne jeder Rechnung das Ergebnis zu.",
    paare: [
      { links: "4 + 4", rechts: "8" },
      { links: "9 − 4", rechts: "5" },
      { links: "6 + 6", rechts: "12" },
      { links: "10 − 10", rechts: "0" },
    ],
    erklaerung: "4 + 4 = 8; 9 − 4 = 5; 6 + 6 = 12; 10 − 10 = 0.",
  },
  { typ: "input", frage: "Tim hat 12 Murmeln. Er verschenkt 4. Wie viele Murmeln hat er noch?", loesung: ["8"], platzhalter: "Zahl", erklaerung: "12 − 4 = 8 Murmeln." },
  { typ: "input", frage: "Im Bus sitzen 9 Kinder. An der Haltestelle steigen 6 Kinder ein. Wie viele Kinder sind jetzt im Bus?", loesung: ["15"], platzhalter: "Zahl", erklaerung: "9 + 6 = 15 Kinder." },
  {
    typ: "sortieren",
    frage: "Ordne die Ergebnisse von klein nach groß: 5 + 2, 10 − 7, 6 + 5, 9 − 0",
    richtig: ["10 − 7", "5 + 2", "9 − 0", "6 + 5"],
    erklaerung: "10 − 7 = 3, 5 + 2 = 7, 9 − 0 = 9, 6 + 5 = 11.",
  },
];

export default PLUSMINUS20_GS1;
