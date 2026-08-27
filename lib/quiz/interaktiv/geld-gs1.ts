// ============================================================================
// Interaktive Aufgaben — Geld bis 20 Cent/Euro · Grundschule Kl. 1 · Bayern
// Münzen kennen, Beträge legen, einfaches Bezahlen und Rückgeld.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const GELD_GS1: Aufgabe[] = [
  {
    typ: "mc",
    frage: "Welche Münzen gibt es wirklich?",
    antworten: ["1 Cent, 2 Cent, 5 Cent", "3 Cent, 4 Cent, 6 Cent", "7 Cent und 9 Cent", "nur 10 Cent"],
    richtig: 0,
    erklaerung: "Es gibt 1-, 2-, 5-, 10-, 20- und 50-Cent-Münzen (und 1 und 2 Euro).",
  },
  { typ: "input", frage: "Du hast eine 5-Cent-Münze und eine 2-Cent-Münze. Wie viele Cent sind das zusammen?", loesung: ["7"], einheit: "ct", platzhalter: "Zahl", erklaerung: "5 + 2 = 7 Cent." },
  { typ: "input", frage: "Du hast zwei 10-Cent-Münzen. Wie viele Cent sind das?", loesung: ["20"], einheit: "ct", platzhalter: "Zahl", erklaerung: "10 + 10 = 20 Cent." },
  { typ: "input", frage: "Du hast eine 10-Cent-Münze, eine 5-Cent-Münze und eine 2-Cent-Münze. Wie viele Cent zusammen?", loesung: ["17"], einheit: "ct", platzhalter: "Zahl", erklaerung: "10 + 5 + 2 = 17 Cent." },
  { typ: "input", frage: "Ein Kaugummi kostet 10 Cent. Du bezahlst mit 20 Cent. Wie viele Cent bekommst du zurück?", loesung: ["10"], einheit: "ct", platzhalter: "Zahl", erklaerung: "20 − 10 = 10 Cent zurück." },
  { typ: "input", frage: "Ein Sticker kostet 8 Cent. Du bezahlst mit einer 10-Cent-Münze. Wie viele Cent bekommst du zurück?", loesung: ["2"], einheit: "ct", platzhalter: "Zahl", erklaerung: "10 − 8 = 2 Cent zurück." },
  {
    typ: "mc",
    frage: "Womit kannst du genau 6 Cent bezahlen?",
    antworten: ["5 Cent + 1 Cent", "2 Cent + 2 Cent", "5 Cent + 5 Cent", "10 Cent + 1 Cent"],
    richtig: 0,
    erklaerung: "5 + 1 = 6 Cent.",
  },
  {
    typ: "mc",
    frage: "Was ist mehr Geld: 1 Euro oder 50 Cent?",
    antworten: ["1 Euro", "50 Cent", "beides gleich viel", "das weiß man nicht"],
    richtig: 0,
    erklaerung: "1 Euro = 100 Cent, das ist mehr als 50 Cent.",
  },
  {
    typ: "luecke",
    frage: "Zusammenzählen.",
    segmente: ["2 Cent + 2 Cent + 1 Cent = ", { luecke: ["5"] }, " Cent und 10 Cent + 10 Cent = ", { luecke: ["20"] }, " Cent."],
    erklaerung: "2 + 2 + 1 = 5 und 10 + 10 = 20.",
  },
  {
    typ: "zuordnen",
    frage: "Ordne die Münzen zusammen, die den Betrag ergeben.",
    paare: [
      { links: "5 Cent + 5 Cent", rechts: "10 Cent" },
      { links: "10 Cent + 5 Cent", rechts: "15 Cent" },
      { links: "1 Cent + 2 Cent", rechts: "3 Cent" },
      { links: "10 Cent + 10 Cent", rechts: "20 Cent" },
    ],
    erklaerung: "5+5=10, 10+5=15, 1+2=3, 10+10=20 (alles in Cent).",
  },
  { typ: "input", frage: "Ein Apfel kostet 12 Cent, eine Banane 6 Cent. Wie viele Cent kosten beide zusammen?", loesung: ["18"], einheit: "ct", platzhalter: "Zahl", erklaerung: "12 + 6 = 18 Cent." },
  { typ: "input", frage: "Du hast 15 Cent und kaufst ein Bild für 5 Cent. Wie viele Cent hast du noch?", loesung: ["10"], einheit: "ct", platzhalter: "Zahl", erklaerung: "15 − 5 = 10 Cent." },
  {
    typ: "mc",
    frage: "Mit welchen Münzen kannst du genau 20 Cent legen?",
    antworten: ["10 + 5 + 5", "10 + 5 + 2", "5 + 5 + 5", "10 + 2 + 2"],
    richtig: 0,
    erklaerung: "10 + 5 + 5 = 20 Cent. Die anderen ergeben 17, 15 und 14 Cent.",
  },
  {
    typ: "sortieren",
    frage: "Ordne die Beträge von wenig nach viel: 12 Cent, 3 Cent, 20 Cent, 8 Cent",
    richtig: ["3 Cent", "8 Cent", "12 Cent", "20 Cent"],
    erklaerung: "3 < 8 < 12 < 20.",
  },
  { typ: "input", frage: "Oma schenkt dir 2 Euro und Opa schenkt dir 1 Euro. Wie viele Euro hast du bekommen?", loesung: ["3"], einheit: "€", platzhalter: "Zahl", erklaerung: "2 + 1 = 3 Euro." },
];

export default GELD_GS1;
