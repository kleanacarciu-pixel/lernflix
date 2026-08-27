// ============================================================================
// Interaktive Aufgaben — Dezimalzahlen · Mittelschule Kl. 6 · Bayern
// Stellenwerte nach dem Komma, Vergleichen, Addieren/Subtrahieren, Alltag (Geld).
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const DEZIMALZAHLEN_MS6: Aufgabe[] = [
  { typ: "input", frage: "Welche Ziffer steht bei 3,47 an der Zehntelstelle?", loesung: ["4"], platzhalter: "Ziffer", erklaerung: "3,47: die 4 steht direkt nach dem Komma — das ist die Zehntelstelle." },
  { typ: "input", frage: "Schreibe den Bruch 3/10 als Dezimalzahl.", loesung: ["0,3"], platzhalter: "z. B. 0,3", erklaerung: "3 Zehntel = 0,3." },
  { typ: "input", frage: "Schreibe den Bruch 7/100 als Dezimalzahl.", loesung: ["0,07"], platzhalter: "z. B. 0,07", erklaerung: "7 Hundertstel = 0,07." },
  { typ: "input", frage: "Schreibe 0,5 als vollständig gekürzten Bruch.", loesung: ["1/2"], platzhalter: "z. B. 1/2", erklaerung: "0,5 = 5/10 = 1/2." },
  { typ: "input", frage: "Berechne: 2,3 + 1,4", loesung: ["3,7"], platzhalter: "z. B. 3,7", erklaerung: "2,3 + 1,4 = 3,7 (Komma unter Komma)." },
  { typ: "input", frage: "Berechne: 5,6 − 2,8", loesung: ["2,8"], platzhalter: "z. B. 2,8", erklaerung: "5,6 − 2,8 = 2,8." },
  { typ: "input", frage: "Berechne: 0,7 + 0,35", loesung: ["1,05"], platzhalter: "z. B. 1,05", erklaerung: "0,70 + 0,35 = 1,05 (0,7 als 0,70 schreiben, dann stellengerecht addieren)." },
  {
    typ: "mc",
    frage: "Welche Zahl ist größer: 0,3 oder 0,25?",
    antworten: ["0,3", "0,25", "Sie sind gleich groß", "Das kann man nicht vergleichen"],
    richtig: 0,
    erklaerung: "0,3 = 0,30 und 0,30 > 0,25.",
  },
  {
    typ: "mc",
    frage: "Welche Zahl liegt zwischen 2,1 und 2,2?",
    antworten: ["2,15", "2,25", "2,05", "2,3"],
    richtig: 0,
    erklaerung: "2,1 < 2,15 < 2,2. Die anderen liegen außerhalb.",
  },
  {
    typ: "luecke",
    frage: "Wandle die Brüche in Dezimalzahlen um.",
    segmente: ["1/4 = ", { luecke: ["0,25"] }, " und 3/4 = ", { luecke: ["0,75"] }, "."],
    erklaerung: "1/4 = 25/100 = 0,25 und 3/4 = 75/100 = 0,75.",
  },
  {
    typ: "sortieren",
    frage: "Ordne die Zahlen aufsteigend — beginne bei der kleinsten.",
    richtig: ["0,09", "0,2", "0,25", "0,5"],
    erklaerung: "Als Hundertstel: 0,09 < 0,20 < 0,25 < 0,50.",
  },
  {
    typ: "zuordnen",
    frage: "Ordne jedem Bruch die passende Dezimalzahl zu.",
    paare: [
      { links: "1/2", rechts: "0,5" },
      { links: "1/4", rechts: "0,25" },
      { links: "1/10", rechts: "0,1" },
      { links: "3/10", rechts: "0,3" },
    ],
    erklaerung: "1/2 = 0,5; 1/4 = 0,25; 1/10 = 0,1; 3/10 = 0,3.",
  },
  { typ: "input", frage: "Ein Brötchen kostet 0,45 €. Wie viel kosten 2 Brötchen? (Als Kommazahl.)", loesung: ["0,90", "0,9"], einheit: "€", platzhalter: "z. B. 0,90", erklaerung: "2 · 0,45 € = 0,90 €." },
  { typ: "input", frage: "Anna kauft für 3,60 € ein und bezahlt mit 5 €. Wie viel Euro bekommt sie zurück? (Als Kommazahl.)", loesung: ["1,40", "1,4"], einheit: "€", platzhalter: "z. B. 1,40", erklaerung: "5,00 € − 3,60 € = 1,40 €." },
  { typ: "input", frage: "Runde 4,67 auf eine Stelle nach dem Komma.", loesung: ["4,7"], platzhalter: "z. B. 4,7", erklaerung: "Die zweite Nachkommastelle ist 7 (≥ 5), also aufrunden: 4,7." },
];

export default DEZIMALZAHLEN_MS6;
