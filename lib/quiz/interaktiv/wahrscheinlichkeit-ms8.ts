// ============================================================================
// Interaktive Aufgaben — Wahrscheinlichkeit (Einstieg) · Mittelschule Kl. 8
// Zufallsexperimente, Wahrscheinlichkeit als Bruch, sicher/unmöglich, Alltag.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const WAHRSCHEINLICHKEIT_MS8: Aufgabe[] = [
  { typ: "input", frage: "Du wirfst eine Münze. Wie groß ist die Wahrscheinlichkeit für „Zahl“? (Als Bruch.)", loesung: ["1/2"], platzhalter: "z. B. 1/2", erklaerung: "2 gleich wahrscheinliche Seiten, eine davon ist Zahl: 1/2." },
  { typ: "input", frage: "Du würfelst einmal. Wie groß ist die Wahrscheinlichkeit für eine 6? (Als Bruch.)", loesung: ["1/6"], platzhalter: "z. B. 1/6", erklaerung: "6 gleich wahrscheinliche Zahlen, eine davon ist die 6: 1/6." },
  { typ: "input", frage: "Du würfelst einmal. Wie groß ist die Wahrscheinlichkeit für eine gerade Zahl? (Als Bruch.)", loesung: ["1/2", "3/6"], platzhalter: "z. B. 1/2", erklaerung: "Gerade Zahlen: 2, 4, 6 — das sind 3 von 6: 3/6 = 1/2." },
  { typ: "input", frage: "In einem Beutel sind 3 rote und 7 blaue Kugeln. Du ziehst eine Kugel. Wie groß ist die Wahrscheinlichkeit für Rot? (Als Bruch.)", loesung: ["3/10"], platzhalter: "z. B. 3/10", erklaerung: "3 rote von insgesamt 10 Kugeln: 3/10." },
  { typ: "input", frage: "Ein Glücksrad hat 8 gleich große Felder, 2 davon sind Gewinnfelder. Wie groß ist die Gewinn-Wahrscheinlichkeit? (Als Bruch.)", loesung: ["1/4", "2/8"], platzhalter: "z. B. 1/4", erklaerung: "2 von 8 Feldern: 2/8 = 1/4." },
  {
    typ: "mc",
    frage: "Wie nennt man ein Ereignis, das auf jeden Fall eintritt?",
    antworten: ["sicheres Ereignis", "unmögliches Ereignis", "seltenes Ereignis", "faires Ereignis"],
    richtig: 0,
    erklaerung: "Ein sicheres Ereignis hat die Wahrscheinlichkeit 1 (= 100 %).",
  },
  {
    typ: "mc",
    frage: "Du würfelst einmal. Welches Ereignis ist unmöglich?",
    antworten: ["eine 7 würfeln", "eine 1 würfeln", "eine gerade Zahl würfeln", "eine Zahl kleiner als 10 würfeln"],
    richtig: 0,
    erklaerung: "Ein Würfel zeigt nur 1 bis 6 — eine 7 ist unmöglich (Wahrscheinlichkeit 0).",
  },
  {
    typ: "mc",
    frage: "Welche Wahrscheinlichkeit passt zu einem sicheren Ereignis?",
    antworten: ["1", "0", "1/2", "1/6"],
    richtig: 0,
    erklaerung: "Sicher = tritt immer ein = Wahrscheinlichkeit 1 (= 100 %).",
  },
  {
    typ: "luecke",
    frage: "Münzwurf und Würfel.",
    segmente: ["P(Kopf) = 1/", { luecke: ["2"] }, " und P(Würfel zeigt 3) = 1/", { luecke: ["6"] }, "."],
    erklaerung: "Münze: 1 von 2. Würfel: 1 von 6.",
  },
  {
    typ: "zuordnen",
    frage: "Ordne jedem Ereignis beim Würfeln (1 Wurf) seine Wahrscheinlichkeit zu.",
    paare: [
      { links: "eine 4 würfeln", rechts: "1/6" },
      { links: "gerade Zahl", rechts: "1/2" },
      { links: "Zahl von 1 bis 6", rechts: "1" },
      { links: "eine 0 würfeln", rechts: "0" },
    ],
    erklaerung: "1 von 6 → 1/6; 3 von 6 → 1/2; sicher → 1; unmöglich → 0.",
  },
  { typ: "input", frage: "In einer Lostrommel sind 100 Lose, 5 davon gewinnen. Wie groß ist die Gewinn-Wahrscheinlichkeit in Prozent?", loesung: ["5"], einheit: "%", platzhalter: "Zahl", erklaerung: "5 von 100 = 5 %." },
  {
    typ: "mc",
    frage: "In einem Beutel sind 4 grüne und 4 gelbe Kugeln. Was gilt für das Ziehen einer Kugel?",
    antworten: ["Grün und Gelb sind gleich wahrscheinlich", "Grün ist wahrscheinlicher", "Gelb ist wahrscheinlicher", "Man zieht sicher Grün"],
    richtig: 0,
    erklaerung: "Je 4 von 8 Kugeln: beide Farben haben die Wahrscheinlichkeit 4/8 = 1/2.",
  },
  { typ: "input", frage: "Beim Werfen zweier Münzen: Wie groß ist die Wahrscheinlichkeit für zweimal Kopf? (Als Bruch.)", loesung: ["1/4"], platzhalter: "z. B. 1/4", erklaerung: "Möglichkeiten: KK, KZ, ZK, ZZ — eine von vier: 1/4." },
  {
    typ: "sortieren",
    frage: "Ordne die Ereignisse nach ihrer Wahrscheinlichkeit aufsteigend — beginne beim unwahrscheinlichsten: Würfel zeigt 7, Würfel zeigt 6, Würfel zeigt gerade Zahl, Würfel zeigt Zahl von 1 bis 6",
    richtig: ["Würfel zeigt 7", "Würfel zeigt 6", "Würfel zeigt gerade Zahl", "Würfel zeigt Zahl von 1 bis 6"],
    erklaerung: "0 < 1/6 < 1/2 < 1.",
  },
  { typ: "input", frage: "Ein Glücksrad hat 5 gleich große Felder mit den Zahlen 1 bis 5. Wie groß ist die Wahrscheinlichkeit für eine Zahl größer als 3? (Als Bruch.)", loesung: ["2/5"], platzhalter: "z. B. 2/5", erklaerung: "Größer als 3 sind 4 und 5 — also 2 von 5: 2/5." },
];

export default WAHRSCHEINLICHKEIT_MS8;
