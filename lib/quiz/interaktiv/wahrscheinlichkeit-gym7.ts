// ============================================================================
// Interaktive Aufgaben — Wahrscheinlichkeit · Gymnasium Kl. 7 · Bayern
// Laplace-Wahrscheinlichkeit: günstige/mögliche Ergebnisse.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const WAHRSCHEINLICHKEIT_GYM7: Aufgabe[] = [
  { typ: "input", frage: "Mit welcher Wahrscheinlichkeit würfelst du mit einem Würfel eine 6? (Als Bruch.)", loesung: ["1/6"], platzhalter: "z. B. 1/6", erklaerung: "1 günstiges Ergebnis von 6 möglichen: 1/6." },
  { typ: "input", frage: "Wie wahrscheinlich ist eine gerade Zahl (2, 4, 6) beim Würfeln? (Als gekürzter Bruch.)", loesung: ["1/2", "3/6"], platzhalter: "z. B. 1/2", erklaerung: "3 günstige von 6 möglichen: 3/6 = 1/2." },
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
  { typ: "input", frage: "In einer Urne sind 3 rote und 2 blaue Kugeln. Wie wahrscheinlich ziehst du rot? (Als Bruch.)", loesung: ["3/5"], platzhalter: "z. B. 3/5", erklaerung: "3 rote von 5 Kugeln insgesamt: 3/5." },
  { typ: "input", frage: "Wie wahrscheinlich würfelst du eine Zahl kleiner als 3 (also 1 oder 2)? (Als gekürzter Bruch.)", loesung: ["1/3", "2/6"], platzhalter: "z. B. 1/3", erklaerung: "2 günstige von 6: 2/6 = 1/3." },
  { typ: "input", frage: "Wie wahrscheinlich würfelst du mit einem normalen Würfel eine 7?", loesung: ["0", "0/6", "0 %"], platzhalter: "Zahl", erklaerung: "Eine 7 gibt es nicht: 0 günstige Ergebnisse, also P = 0." },
  {
    typ: "luecke",
    frage: "Beim Würfel: Wie wahrscheinlich ist eine gerade Zahl?",
    segmente: ["P(gerade) = ", { luecke: ["3"] }, "/6 = ", { luecke: ["1"] }, "/2."],
    erklaerung: "3 gerade Zahlen (2, 4, 6) von 6: 3/6 = 1/2.",
  },
  { typ: "input", frage: "Eine Wahrscheinlichkeit von 1/4 entspricht wie viel Prozent?", loesung: ["25"], einheit: "%", platzhalter: "Zahl", erklaerung: "1/4 = 0,25 = 25 %." },
  {
    typ: "mc",
    frage: "Bei einem Laplace-Experiment sind alle Ergebnisse …",
    antworten: ["gleich wahrscheinlich", "unmöglich", "verschieden wahrscheinlich", "sicher"],
    richtig: 0,
    erklaerung: "Ein Laplace-Experiment hat lauter gleich wahrscheinliche Ergebnisse (z. B. der faire Würfel).",
  },
  { typ: "input", frage: "In einer Klasse mit 20 Kindern tragen 5 eine Brille. Wie wahrscheinlich ist es, zufällig ein Brillenkind auszuwählen? (Als gekürzter Bruch.)", loesung: ["1/4", "5/20"], platzhalter: "z. B. 1/4", erklaerung: "5 von 20: 5/20 = 1/4." },
  { typ: "input", frage: "Wie wahrscheinlich würfelst du eine Zahl kleiner oder gleich 6?", loesung: ["1", "6/6", "100 %", "100%"], platzhalter: "Zahl", erklaerung: "Alle 6 Ergebnisse sind günstig: 6/6 = 1 (sicheres Ereignis)." },
  {
    typ: "mc",
    frage: "Je größer die Wahrscheinlichkeit eines Ereignisses ist, …",
    antworten: ["desto eher tritt es ein", "desto unmöglicher ist es", "desto seltener ist es", "desto kleiner ist es"],
    richtig: 0,
    erklaerung: "Eine größere Wahrscheinlichkeit bedeutet, dass das Ereignis eher eintritt.",
  },
  { typ: "input", frage: "Ein Glücksrad hat 8 gleich große Felder, 2 davon sind rot. Wie wahrscheinlich ist rot? (Als gekürzter Bruch.)", loesung: ["1/4", "2/8"], platzhalter: "z. B. 1/4", erklaerung: "2 von 8 Feldern: 2/8 = 1/4." },
];

export default WAHRSCHEINLICHKEIT_GYM7;
