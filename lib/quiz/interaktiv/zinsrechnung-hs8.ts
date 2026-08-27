// ============================================================================
// Interaktive Aufgaben — Zinsrechnung · Hauptschule Kl. 8 · Bayern
// Kapital, Zinssatz, Jahreszinsen — Sparbuch und Kredit im Alltag.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const ZINSRECHNUNG_HS8: Aufgabe[] = [
  {
    typ: "mc",
    frage: "Du legst Geld auf ein Sparkonto. Wie heißt das Geld, das die Bank dir dafür zahlt?",
    antworten: ["Zinsen", "Kapital", "Rabatt", "Miete"],
    richtig: 0,
    erklaerung: "Die Bank zahlt Zinsen. Dein angelegtes Geld heißt Kapital.",
  },
  { typ: "input", frage: "Kapital 100 €, Zinssatz 3 % pro Jahr. Wie viel Zinsen gibt es in einem Jahr?", loesung: ["3"], einheit: "€", platzhalter: "Zahl", erklaerung: "3 % von 100 € = 3 €." },
  { typ: "input", frage: "Kapital 500 €, Zinssatz 2 % pro Jahr. Wie viel Zinsen gibt es in einem Jahr?", loesung: ["10"], einheit: "€", platzhalter: "Zahl", erklaerung: "1 % von 500 € = 5 €, also 2 % = 10 €." },
  { typ: "input", frage: "Kapital 1 000 €, Zinssatz 4 % pro Jahr. Wie viel Zinsen gibt es in einem Jahr?", loesung: ["40"], einheit: "€", platzhalter: "Zahl", erklaerung: "4 % von 1 000 € = 40 €." },
  { typ: "input", frage: "Kapital 600 €, Zinssatz 3 %. Wie viel Geld ist nach einem Jahr insgesamt auf dem Konto?", loesung: ["618"], einheit: "€", platzhalter: "Zahl", erklaerung: "Zinsen: 3 % von 600 € = 18 €. Insgesamt: 600 + 18 = 618 €." },
  { typ: "input", frage: "Bei 400 € Kapital gibt es 8 € Zinsen im Jahr. Wie hoch ist der Zinssatz?", loesung: ["2"], einheit: "%", platzhalter: "Zahl", erklaerung: "8 von 400 = 2 von 100 = 2 %." },
  {
    typ: "mc",
    frage: "Du leihst dir 1 000 € zu 8 % Zinsen pro Jahr. Wie viel Zinsen musst du nach einem Jahr zahlen?",
    antworten: ["80 €", "8 €", "800 €", "108 €"],
    richtig: 0,
    erklaerung: "8 % von 1 000 € = 80 €.",
  },
  {
    typ: "mc",
    frage: "Was ist für dich besser, wenn du sparst?",
    antworten: ["ein hoher Zinssatz", "ein niedriger Zinssatz", "gar keine Zinsen", "das ist egal"],
    richtig: 0,
    erklaerung: "Beim Sparen bekommst du die Zinsen — je höher der Zinssatz, desto mehr.",
  },
  {
    typ: "luecke",
    frage: "Kapital 200 €, Zinssatz 5 % pro Jahr.",
    segmente: ["Zinsen: ", { luecke: ["10"] }, " €, Kontostand nach 1 Jahr: ", { luecke: ["210"] }, " €."],
    erklaerung: "5 % von 200 € = 10 €. 200 + 10 = 210 €.",
  },
  {
    typ: "zuordnen",
    frage: "Zinssatz 2 % pro Jahr. Ordne jedem Kapital die Jahreszinsen zu.",
    paare: [
      { links: "50 €", rechts: "1 €" },
      { links: "200 €", rechts: "4 €" },
      { links: "500 €", rechts: "10 €" },
      { links: "1 500 €", rechts: "30 €" },
    ],
    erklaerung: "2 % = Kapital : 100 · 2: 1 €, 4 €, 10 €, 30 €.",
  },
  { typ: "input", frage: "Oma legt 2 000 € zu 1,5 % pro Jahr an. Wie viel Zinsen bekommt sie in einem Jahr?", loesung: ["30"], einheit: "€", platzhalter: "Zahl", erklaerung: "1 % = 20 €, also 1,5 % = 30 €." },
  { typ: "input", frage: "Kapital 800 €, Zinssatz 3 % pro Jahr. Wie viel Zinsen gibt es in einem halben Jahr?", loesung: ["12"], einheit: "€", platzhalter: "Zahl", erklaerung: "Jahreszinsen: 24 €. Halbes Jahr: 24 : 2 = 12 €." },
  {
    typ: "mc",
    frage: "Kapital 300 €, nach einem Jahr sind 309 € auf dem Konto. Wie hoch war der Zinssatz?",
    antworten: ["3 %", "9 %", "1 %", "30 %"],
    richtig: 0,
    erklaerung: "Zinsen: 9 €. 9 von 300 = 3 von 100 = 3 %.",
  },
  { typ: "input", frage: "Herr Kaya leiht sich 3 000 € zu 5 % Zinsen pro Jahr. Wie viel muss er nach einem Jahr insgesamt zurückzahlen?", loesung: ["3150", "3 150"], einheit: "€", platzhalter: "Zahl", erklaerung: "Zinsen: 5 % von 3 000 € = 150 €. Rückzahlung: 3 150 €." },
  {
    typ: "sortieren",
    frage: "Ordne nach den Jahreszinsen aufsteigend — beginne beim kleinsten: 2 % von 100 €, 1 % von 500 €, 2 % von 500 €, 3 % von 1 000 €",
    richtig: ["2 % von 100 €", "1 % von 500 €", "2 % von 500 €", "3 % von 1 000 €"],
    erklaerung: "2 € < 5 € < 10 € < 30 €.",
  },
];

export default ZINSRECHNUNG_HS8;
