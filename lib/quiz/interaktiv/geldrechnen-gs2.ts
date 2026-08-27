// ============================================================================
// Interaktive Aufgaben — Geld rechnen · Grundschule Kl. 2 · Bayern
// Mit Euro und Cent rechnen, bezahlen, Rückgeld, Taschengeld bis 100.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const GELDRECHNEN_GS2: Aufgabe[] = [
  { typ: "input", frage: "Wie viele Cent sind 1 Euro?", loesung: ["100"], einheit: "ct", platzhalter: "Zahl", erklaerung: "1 € = 100 Cent." },
  { typ: "input", frage: "Ein Brezel kostet 70 Cent, ein Saft 30 Cent. Wie viele Cent zusammen?", loesung: ["100"], einheit: "ct", platzhalter: "Zahl", erklaerung: "70 + 30 = 100 Cent (= 1 €)." },
  { typ: "input", frage: "Du hast 50 Cent und bekommst 20 Cent dazu. Wie viele Cent hast du?", loesung: ["70"], einheit: "ct", platzhalter: "Zahl", erklaerung: "50 + 20 = 70 Cent." },
  { typ: "input", frage: "Ein Heft kostet 80 Cent. Du bezahlst mit 1 Euro. Wie viele Cent bekommst du zurück?", loesung: ["20"], einheit: "ct", platzhalter: "Zahl", erklaerung: "100 − 80 = 20 Cent." },
  { typ: "input", frage: "Ein Comic kostet 4 €, ein Eis 2 €. Wie viele Euro zusammen?", loesung: ["6"], einheit: "€", platzhalter: "Zahl", erklaerung: "4 + 2 = 6 €." },
  { typ: "input", frage: "Du hast 10 € und kaufst ein Buch für 7 €. Wie viele Euro bleiben dir?", loesung: ["3"], einheit: "€", platzhalter: "Zahl", erklaerung: "10 − 7 = 3 €." },
  { typ: "input", frage: "Du bekommst 4 Wochen lang je 2 € Taschengeld. Wie viele Euro sind das zusammen?", loesung: ["8"], einheit: "€", platzhalter: "Zahl", erklaerung: "4 · 2 = 8 €." },
  {
    typ: "mc",
    frage: "Womit kannst du genau 15 € bezahlen?",
    antworten: ["10-€-Schein + 5-€-Schein", "10-€-Schein + 10-€-Schein", "5-€-Schein + 5-€-Schein", "20-€-Schein"],
    richtig: 0,
    erklaerung: "10 + 5 = 15 €.",
  },
  {
    typ: "mc",
    frage: "Was ist mehr: 90 Cent oder 1 Euro?",
    antworten: ["1 Euro", "90 Cent", "beides gleich", "das weiß man nicht"],
    richtig: 0,
    erklaerung: "1 Euro = 100 Cent, und 100 > 90.",
  },
  {
    typ: "luecke",
    frage: "Rechne mit Geld.",
    segmente: ["50 Cent + 50 Cent = ", { luecke: ["100"] }, " Cent = ", { luecke: ["1"] }, " Euro."],
    erklaerung: "50 + 50 = 100 Cent, und 100 Cent = 1 Euro.",
  },
  {
    typ: "zuordnen",
    frage: "Ordne jedem Einkauf den Preis zu.",
    paare: [
      { links: "2 Brezeln à 50 Cent", rechts: "1 €" },
      { links: "3 Kaugummis à 10 Cent", rechts: "30 Cent" },
      { links: "2 Hefte à 2 €", rechts: "4 €" },
      { links: "1 Eis für 1 € und 1 Saft für 2 €", rechts: "3 €" },
    ],
    erklaerung: "2 · 50 ct = 1 €; 3 · 10 ct = 30 ct; 2 · 2 € = 4 €; 1 € + 2 € = 3 €.",
  },
  { typ: "input", frage: "Ein Spielzeugauto kostet 12 €. Du hast schon 9 € gespart. Wie viele Euro fehlen dir noch?", loesung: ["3"], einheit: "€", platzhalter: "Zahl", erklaerung: "12 − 9 = 3 €." },
  { typ: "input", frage: "Auf dem Flohmarkt verkaufst du 3 Bücher für je 2 €. Wie viele Euro bekommst du?", loesung: ["6"], einheit: "€", platzhalter: "Zahl", erklaerung: "3 · 2 = 6 €." },
  {
    typ: "mc",
    frage: "Du kaufst etwas für 45 Cent und bezahlst mit 50 Cent. Wie viel Rückgeld bekommst du?",
    antworten: ["5 Cent", "15 Cent", "10 Cent", "45 Cent"],
    richtig: 0,
    erklaerung: "50 − 45 = 5 Cent.",
  },
  {
    typ: "sortieren",
    frage: "Ordne die Beträge von wenig nach viel: 2 €, 50 Cent, 1 €, 20 Cent",
    richtig: ["20 Cent", "50 Cent", "1 €", "2 €"],
    erklaerung: "20 ct < 50 ct < 100 ct (= 1 €) < 200 ct (= 2 €).",
  },
];

export default GELDRECHNEN_GS2;
