// ============================================================================
// Interaktive Aufgaben — Addieren & Subtrahieren bis 100 · Grundschule Kl. 2
// Plus und Minus mit Zehnern und Einern, auch mit Zehnerübergang, Sachaufgaben.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const PLUSMINUS100_GS2: Aufgabe[] = [
  { typ: "input", frage: "Rechne: 30 + 40", loesung: ["70"], platzhalter: "Zahl", erklaerung: "3 Zehner + 4 Zehner = 7 Zehner = 70." },
  { typ: "input", frage: "Rechne: 25 + 3", loesung: ["28"], platzhalter: "Zahl", erklaerung: "25 + 3 = 28." },
  { typ: "input", frage: "Rechne: 46 + 20", loesung: ["66"], platzhalter: "Zahl", erklaerung: "46 + 20 = 66 (nur die Zehner werden mehr)." },
  { typ: "input", frage: "Rechne: 38 + 5", loesung: ["43"], platzhalter: "Zahl", erklaerung: "38 + 2 = 40, dann noch 3 dazu: 43." },
  { typ: "input", frage: "Rechne: 70 − 30", loesung: ["40"], platzhalter: "Zahl", erklaerung: "7 Zehner − 3 Zehner = 4 Zehner = 40." },
  { typ: "input", frage: "Rechne: 54 − 4", loesung: ["50"], platzhalter: "Zahl", erklaerung: "54 − 4 = 50." },
  { typ: "input", frage: "Rechne: 62 − 5", loesung: ["57"], platzhalter: "Zahl", erklaerung: "62 − 2 = 60, dann noch 3 weg: 57." },
  { typ: "input", frage: "Rechne: 27 + 36", loesung: ["63"], platzhalter: "Zahl", erklaerung: "27 + 30 = 57, dann + 6 = 63." },
  { typ: "input", frage: "Rechne: 81 − 25", loesung: ["56"], platzhalter: "Zahl", erklaerung: "81 − 20 = 61, dann − 5 = 56." },
  {
    typ: "mc",
    frage: "Welche Rechnung ergibt 100?",
    antworten: ["60 + 40", "50 + 40", "70 + 20", "80 + 30"],
    richtig: 0,
    erklaerung: "60 + 40 = 100. Die anderen ergeben 90, 90 und 110.",
  },
  {
    typ: "luecke",
    frage: "Ergänze bis 100.",
    segmente: ["70 + ", { luecke: ["30"] }, " = 100 und 45 + ", { luecke: ["55"] }, " = 100."],
    erklaerung: "70 und 30 sind zusammen 100. 45 und 55 sind zusammen 100.",
  },
  {
    typ: "zuordnen",
    frage: "Ordne jeder Rechnung das Ergebnis zu.",
    paare: [
      { links: "20 + 30", rechts: "50" },
      { links: "90 − 20", rechts: "70" },
      { links: "30 + 35", rechts: "65" },
      { links: "100 − 60", rechts: "40" },
    ],
    erklaerung: "20+30=50; 90−20=70; 30+35=65; 100−60=40.",
  },
  { typ: "input", frage: "Im Schulbus sitzen 34 Kinder. 12 steigen aus. Wie viele Kinder sind noch im Bus?", loesung: ["22"], platzhalter: "Zahl", erklaerung: "34 − 12 = 22 Kinder." },
  { typ: "input", frage: "Lea sammelt Sticker: Sie hat 45 und bekommt 15 dazu. Wie viele hat sie jetzt?", loesung: ["60"], platzhalter: "Zahl", erklaerung: "45 + 15 = 60 Sticker." },
  {
    typ: "sortieren",
    frage: "Ordne die Ergebnisse von klein nach groß: 20 + 20, 100 − 30, 15 + 10, 90 − 5",
    richtig: ["15 + 10", "20 + 20", "100 − 30", "90 − 5"],
    erklaerung: "25 < 40 < 70 < 85.",
  },
];

export default PLUSMINUS100_GS2;
