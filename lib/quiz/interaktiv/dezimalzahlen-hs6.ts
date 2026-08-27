// ============================================================================
// Interaktive Aufgaben — Dezimalzahlen · Hauptschule Kl. 6 · Bayern
// Kommazahlen lesen, vergleichen, addieren/subtrahieren — vor allem mit Geld.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const DEZIMALZAHLEN_HS6: Aufgabe[] = [
  { typ: "input", frage: "Welche Ziffer steht bei 6,25 direkt nach dem Komma (Zehntelstelle)?", loesung: ["2"], platzhalter: "Ziffer", erklaerung: "6,25: die 2 ist die Zehntelstelle, die 5 die Hundertstelstelle." },
  { typ: "input", frage: "Schreibe den Bruch 5/10 als Dezimalzahl.", loesung: ["0,5"], platzhalter: "z. B. 0,5", erklaerung: "5 Zehntel = 0,5." },
  { typ: "input", frage: "Schreibe 1/2 als Dezimalzahl.", loesung: ["0,5"], platzhalter: "z. B. 0,5", erklaerung: "1/2 = 5/10 = 0,5." },
  { typ: "input", frage: "Berechne: 1,5 + 2,3", loesung: ["3,8"], platzhalter: "z. B. 3,8", erklaerung: "1,5 + 2,3 = 3,8 (Komma unter Komma)." },
  { typ: "input", frage: "Berechne: 4,80 € + 2,50 € (Als Kommazahl.)", loesung: ["7,30", "7,3"], einheit: "€", platzhalter: "z. B. 7,30", erklaerung: "4,80 + 2,50 = 7,30 €." },
  { typ: "input", frage: "Berechne: 6,4 − 2,1", loesung: ["4,3"], platzhalter: "z. B. 4,3", erklaerung: "6,4 − 2,1 = 4,3." },
  { typ: "input", frage: "Du kaufst für 7,20 € ein und bezahlst mit 10 €. Wie viel Rückgeld bekommst du? (Als Kommazahl.)", loesung: ["2,80", "2,8"], einheit: "€", platzhalter: "z. B. 2,80", erklaerung: "10,00 € − 7,20 € = 2,80 €." },
  {
    typ: "mc",
    frage: "Welche Zahl ist größer: 0,7 oder 0,59?",
    antworten: ["0,7", "0,59", "beide gleich groß", "das kann man nicht vergleichen"],
    richtig: 0,
    erklaerung: "0,7 = 0,70 und 0,70 > 0,59.",
  },
  {
    typ: "mc",
    frage: "Was kostet mehr: 1,05 € oder 1,50 €?",
    antworten: ["1,50 €", "1,05 €", "beides gleich", "das sieht man nicht"],
    richtig: 0,
    erklaerung: "1,50 € = 1 Euro 50 Cent, 1,05 € = 1 Euro 5 Cent. 1,50 € ist mehr.",
  },
  {
    typ: "luecke",
    frage: "Geld als Kommazahl.",
    segmente: ["50 Cent = ", { luecke: ["0,50", "0,5"] }, " € und 1 Euro 25 Cent = ", { luecke: ["1,25"] }, " €."],
    erklaerung: "50 ct = 0,50 €. 1 € + 25 ct = 1,25 €.",
  },
  {
    typ: "zuordnen",
    frage: "Ordne jedem Bruch die passende Dezimalzahl zu.",
    paare: [
      { links: "1/2", rechts: "0,5" },
      { links: "1/4", rechts: "0,25" },
      { links: "3/4", rechts: "0,75" },
      { links: "1/10", rechts: "0,1" },
    ],
    erklaerung: "1/2 = 0,5; 1/4 = 0,25; 3/4 = 0,75; 1/10 = 0,1.",
  },
  {
    typ: "sortieren",
    frage: "Ordne die Preise aufsteigend — beginne beim billigsten: 2,09 €, 2,90 €, 0,95 €, 2,50 €",
    richtig: ["0,95 €", "2,09 €", "2,50 €", "2,90 €"],
    erklaerung: "0,95 < 2,09 < 2,50 < 2,90.",
  },
  { typ: "input", frage: "Eine Flasche Wasser kostet 0,75 €. Wie viel kosten 2 Flaschen? (Als Kommazahl.)", loesung: ["1,50", "1,5"], einheit: "€", platzhalter: "z. B. 1,50", erklaerung: "2 · 0,75 € = 1,50 €." },
  { typ: "input", frage: "Runde 3,86 auf eine Stelle nach dem Komma.", loesung: ["3,9"], platzhalter: "z. B. 3,9", erklaerung: "Die zweite Nachkommastelle ist 6 (≥ 5), also aufrunden: 3,9." },
  { typ: "input", frage: "Lukas läuft 100 m in 16,8 Sekunden, Ali in 15,9 Sekunden. Wie viele Sekunden ist Ali schneller? (Als Kommazahl.)", loesung: ["0,9"], einheit: "s", platzhalter: "z. B. 0,9", erklaerung: "16,8 − 15,9 = 0,9 Sekunden." },
];

export default DEZIMALZAHLEN_HS6;
