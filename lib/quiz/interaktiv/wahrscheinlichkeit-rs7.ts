// ============================================================================
// Interaktive Aufgaben — Wahrscheinlichkeit · Realschule Kl. 7 · Bayern
// Laplace-Wahrscheinlichkeit: günstige / mögliche Ergebnisse.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const WAHRSCHEINLICHKEIT_RS7: Aufgabe[] = [
  { typ: "input", frage: "Mit welcher Wahrscheinlichkeit würfelst du eine 6? (Als Bruch.)", loesung: ["1/6"], platzhalter: "z. B. 1/6", erklaerung: "1 günstiges Ergebnis von 6 möglichen: 1/6." },
  { typ: "input", frage: "Wie wahrscheinlich ist eine gerade Zahl beim Würfeln? (Als Bruch.)", loesung: ["1/2", "3/6"], platzhalter: "z. B. 1/2", erklaerung: "3 günstige (2, 4, 6) von 6: 3/6 = 1/2." },
  { typ: "input", frage: "Wie wahrscheinlich ist beim Münzwurf „Kopf“? (Als Bruch.)", loesung: ["1/2"], platzhalter: "z. B. 1/2", erklaerung: "1 von 2 möglichen Ergebnissen: 1/2." },
  {
    typ: "mc",
    frage: "Eine Wahrscheinlichkeit von 1 bedeutet, das Ereignis ist …",
    antworten: ["sicher", "unmöglich", "genau 50 %", "selten"],
    richtig: 0,
    erklaerung: "P = 1 bedeutet: Das Ereignis tritt sicher ein.",
  },
  {
    typ: "mc",
    frage: "Eine Wahrscheinlichkeit von 0 bedeutet, das Ereignis ist …",
    antworten: ["unmöglich", "sicher", "immer", "oft"],
    richtig: 0,
    erklaerung: "P = 0 bedeutet: Das Ereignis kann nicht eintreten.",
  },
  { typ: "input", frage: "In einer Urne sind 4 rote und 6 blaue Kugeln. Wie wahrscheinlich ziehst du rot? (Als Bruch.)", loesung: ["2/5", "4/10"], platzhalter: "z. B. 2/5", erklaerung: "4 rote von 10 Kugeln: 4/10 = 2/5." },
  { typ: "input", frage: "Wie wahrscheinlich würfelst du eine Zahl kleiner als 3? (Als Bruch.)", loesung: ["1/3", "2/6"], platzhalter: "z. B. 1/3", erklaerung: "1 und 2 sind günstig: 2/6 = 1/3." },
  {
    typ: "luecke",
    frage: "Beim Würfel: Wie wahrscheinlich ist eine gerade Zahl?",
    segmente: ["P(gerade) = ", { luecke: ["3"] }, "/6 = ", { luecke: ["1"] }, "/2."],
    erklaerung: "3 gerade Zahlen (2, 4, 6) von 6: 3/6 = 1/2.",
  },
  { typ: "input", frage: "Eine Wahrscheinlichkeit von 1/5 entspricht wie viel Prozent?", loesung: ["20"], einheit: "%", platzhalter: "Zahl", erklaerung: "1/5 = 0,2 = 20 %." },
  { typ: "input", frage: "Ein Glücksrad hat 8 gleich große Felder, 2 davon sind rot. Wie wahrscheinlich ist rot? (Als Bruch.)", loesung: ["1/4", "2/8"], platzhalter: "z. B. 1/4", erklaerung: "2 von 8 Feldern: 2/8 = 1/4." },
  { typ: "input", frage: "Von 20 Losen gewinnen 5. Wie wahrscheinlich ist ein Gewinn? (Als Bruch.)", loesung: ["1/4", "5/20"], platzhalter: "z. B. 1/4", erklaerung: "5 von 20: 5/20 = 1/4." },
  {
    typ: "mc",
    frage: "Bei einem Laplace-Experiment sind alle Ergebnisse …",
    antworten: ["gleich wahrscheinlich", "unmöglich", "verschieden wahrscheinlich", "sicher"],
    richtig: 0,
    erklaerung: "Ein Laplace-Experiment hat lauter gleich wahrscheinliche Ergebnisse (z. B. der faire Würfel).",
  },
  { typ: "input", frage: "Wie wahrscheinlich würfelst du KEINE 6? (Als Bruch.)", loesung: ["5/6"], platzhalter: "z. B. 5/6", erklaerung: "5 günstige (1 bis 5) von 6: 5/6." },
  { typ: "input", frage: "Karten mit den Zahlen 1 bis 10. Wie wahrscheinlich ist eine Zahl größer als 8? (Als Bruch.)", loesung: ["1/5", "2/10"], platzhalter: "z. B. 1/5", erklaerung: "9 und 10 sind günstig: 2/10 = 1/5." },
  {
    typ: "mc",
    frage: "Wie groß ist die Gegenwahrscheinlichkeit von P = 1/3?",
    antworten: ["2/3", "1/3", "3", "0"],
    richtig: 0,
    erklaerung: "Gegenwahrscheinlichkeit = 1 − 1/3 = 2/3.",
  },
];

export default WAHRSCHEINLICHKEIT_RS7;
