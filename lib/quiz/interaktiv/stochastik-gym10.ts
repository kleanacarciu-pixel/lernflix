// ============================================================================
// Interaktive Aufgaben — Stochastik · Gymnasium Kl. 10 · Bayern
// Laplace-Wahrscheinlichkeit, Gegenwahrscheinlichkeit, mehrstufig.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const STOCHASTIK_GYM10: Aufgabe[] = [
  { typ: "input", frage: "Würfel: Wie wahrscheinlich ist eine Primzahl (2, 3, 5)? (Als gekürzter Bruch.)", loesung: ["1/2", "3/6"], platzhalter: "z. B. 1/2", erklaerung: "3 günstige von 6: 3/6 = 1/2." },
  { typ: "input", frage: "Würfel: Wie wahrscheinlich ist eine Zahl größer als 4 (5 oder 6)? (Als gekürzter Bruch.)", loesung: ["1/3", "2/6"], platzhalter: "z. B. 1/3", erklaerung: "2 günstige von 6: 2/6 = 1/3." },
  { typ: "input", frage: "10 Lose, 2 davon gewinnen. Wie wahrscheinlich ist ein Gewinn? (Als gekürzter Bruch.)", loesung: ["1/5", "2/10"], platzhalter: "z. B. 1/5", erklaerung: "2 von 10: 2/10 = 1/5." },
  { typ: "input", frage: "Karten mit den Zahlen 1 bis 8. Wie wahrscheinlich ist eine gerade Zahl? (Als gekürzter Bruch.)", loesung: ["1/2", "4/8"], platzhalter: "z. B. 1/2", erklaerung: "Gerade: 2, 4, 6, 8 — das sind 4 von 8, also 1/2." },
  {
    typ: "mc",
    frage: "Wie groß ist die Wahrscheinlichkeit eines sicheren Ereignisses?",
    antworten: ["1", "0", "1/2", "100"],
    richtig: 0,
    erklaerung: "Ein sicheres Ereignis hat die Wahrscheinlichkeit 1.",
  },
  { typ: "input", frage: "Zweimal Würfeln: Wie wahrscheinlich ist zweimal die 6? (Als Bruch.)", loesung: ["1/36"], platzhalter: "z. B. 1/36", erklaerung: "1/6 · 1/6 = 1/36." },
  { typ: "input", frage: "Münze und Würfel: Wie wahrscheinlich ist „Kopf und eine gerade Zahl“? (Als Bruch.)", loesung: ["1/4"], platzhalter: "z. B. 1/4", erklaerung: "1/2 · 1/2 = 1/4 (gerade Zahl hat P = 3/6 = 1/2)." },
  {
    typ: "mc",
    frage: "Die Gegenwahrscheinlichkeit von P = 1/4 ist …",
    antworten: ["3/4", "1/4", "4", "0"],
    richtig: 0,
    erklaerung: "Gegenwahrscheinlichkeit = 1 − 1/4 = 3/4.",
  },
  { typ: "input", frage: "P(Gewinn) = 1/5. Wie groß ist P(kein Gewinn)? (Als Bruch.)", loesung: ["4/5"], platzhalter: "z. B. 4/5", erklaerung: "1 − 1/5 = 4/5." },
  {
    typ: "luecke",
    frage: "Würfel-Wahrscheinlichkeiten.",
    segmente: ["P(6) = 1/", { luecke: ["6"] }, " und P(keine 6) = ", { luecke: ["5"] }, "/6."],
    erklaerung: "P(6) = 1/6, P(keine 6) = 5/6.",
  },
  { typ: "input", frage: "Urne mit 3 roten und 7 blauen Kugeln. Wie wahrscheinlich ist rot? (Als Bruch.)", loesung: ["3/10"], platzhalter: "z. B. 3/10", erklaerung: "3 rote von 10 Kugeln: 3/10." },
  {
    typ: "mc",
    frage: "Ein Ereignis mit der Wahrscheinlichkeit 0 ist …",
    antworten: ["unmöglich", "sicher", "wahrscheinlich", "häufig"],
    richtig: 0,
    erklaerung: "P = 0 bedeutet, das Ereignis kann nicht eintreten.",
  },
  { typ: "input", frage: "20 Kinder, 8 tragen eine Brille. Wie wahrscheinlich ist ein Brillenkind? (Als gekürzter Bruch.)", loesung: ["2/5", "8/20"], platzhalter: "z. B. 2/5", erklaerung: "8 von 20: 8/20 = 2/5." },
  { typ: "input", frage: "Glücksrad mit 5 gleich großen Feldern, 1 davon rot. Wie wahrscheinlich ist rot? (Als Bruch.)", loesung: ["1/5"], platzhalter: "z. B. 1/5", erklaerung: "1 von 5: 1/5." },
  { typ: "input", frage: "Würfel: Wie wahrscheinlich ist eine Zahl kleiner oder gleich 3? (Als gekürzter Bruch.)", loesung: ["1/2", "3/6"], platzhalter: "z. B. 1/2", erklaerung: "1, 2, 3 sind günstig: 3/6 = 1/2." },
];

export default STOCHASTIK_GYM10;
