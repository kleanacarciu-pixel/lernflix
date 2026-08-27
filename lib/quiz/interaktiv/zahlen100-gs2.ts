// ============================================================================
// Interaktive Aufgaben — Zahlen bis 100 · Grundschule Kl. 2 · Bayern
// Zehner und Einer, Nachbarzahlen, Zahlenreihen, Vergleichen bis 100.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const ZAHLEN100_GS2: Aufgabe[] = [
  { typ: "input", frage: "Wie viele Zehner hat die Zahl 47?", loesung: ["4"], platzhalter: "Zahl", erklaerung: "47 = 4 Zehner und 7 Einer." },
  { typ: "input", frage: "Wie viele Einer hat die Zahl 63?", loesung: ["3"], platzhalter: "Zahl", erklaerung: "63 = 6 Zehner und 3 Einer." },
  { typ: "input", frage: "Welche Zahl besteht aus 5 Zehnern und 2 Einern?", loesung: ["52"], platzhalter: "Zahl", erklaerung: "50 + 2 = 52." },
  { typ: "input", frage: "Welche Zahl kommt nach 79?", loesung: ["80"], platzhalter: "Zahl", erklaerung: "79 + 1 = 80." },
  { typ: "input", frage: "Welche Zahl kommt vor 100?", loesung: ["99"], platzhalter: "Zahl", erklaerung: "100 − 1 = 99." },
  { typ: "input", frage: "Zehnerschritte: 30, 40, 50 — welche Zahl kommt als Nächstes?", loesung: ["60"], platzhalter: "Zahl", erklaerung: "Immer 10 mehr: 30, 40, 50, 60." },
  { typ: "input", frage: "Fünferschritte: 15, 20, 25 — welche Zahl kommt als Nächstes?", loesung: ["30"], platzhalter: "Zahl", erklaerung: "Immer 5 mehr: 15, 20, 25, 30." },
  {
    typ: "mc",
    frage: "Welche Zahl ist größer?",
    antworten: ["76", "67", "beide gleich", "das weiß man nicht"],
    richtig: 0,
    erklaerung: "76 hat 7 Zehner, 67 nur 6 Zehner — 76 ist größer.",
  },
  {
    typ: "mc",
    frage: "Welche Zahl liegt zwischen 49 und 51?",
    antworten: ["50", "48", "52", "54"],
    richtig: 0,
    erklaerung: "49, 50, 51 — dazwischen liegt die 50.",
  },
  {
    typ: "luecke",
    frage: "Nachbarzehner von 47.",
    segmente: ["Der Zehner davor ist ", { luecke: ["40"] }, ", der Zehner danach ist ", { luecke: ["50"] }, "."],
    erklaerung: "47 liegt zwischen den Zehnern 40 und 50.",
  },
  {
    typ: "zuordnen",
    frage: "Ordne jeder Zahl ihre Zerlegung zu.",
    paare: [
      { links: "34", rechts: "30 + 4" },
      { links: "70", rechts: "7 Zehner" },
      { links: "58", rechts: "50 + 8" },
      { links: "9", rechts: "nur Einer" },
    ],
    erklaerung: "34 = 30 + 4; 70 = 7 Zehner; 58 = 50 + 8; 9 hat keinen Zehner.",
  },
  {
    typ: "sortieren",
    frage: "Ordne die Zahlen von klein nach groß.",
    richtig: ["19", "36", "63", "91"],
    erklaerung: "19 < 36 < 63 < 91.",
  },
  { typ: "input", frage: "Welche Zahl ist um 10 größer als 57?", loesung: ["67"], platzhalter: "Zahl", erklaerung: "57 + 10 = 67." },
  { typ: "input", frage: "Welche Zahl ist um 1 kleiner als 60?", loesung: ["59"], platzhalter: "Zahl", erklaerung: "60 − 1 = 59." },
  {
    typ: "mc",
    frage: "Was ist an den Zahlen 38 und 83 verschieden?",
    antworten: ["Zehner und Einer sind vertauscht", "Sie sind gleich groß", "83 ist kleiner", "38 hat mehr Zehner"],
    richtig: 0,
    erklaerung: "38 = 3 Zehner, 8 Einer. 83 = 8 Zehner, 3 Einer — vertauscht, und 83 ist größer.",
  },
];

export default ZAHLEN100_GS2;
