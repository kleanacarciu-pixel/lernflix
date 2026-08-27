// ============================================================================
// Interaktive Aufgaben — Zinsrechnung · Mittelschule Kl. 8 · Bayern
// Kapital, Zinssatz, Zinsen für 1 Jahr; Monatszinsen als Einstieg.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const ZINSRECHNUNG_MS8: Aufgabe[] = [
  {
    typ: "mc",
    frage: "Wie heißt das Geld, das man bei der Bank angelegt hat?",
    antworten: ["Kapital", "Zinsen", "Zinssatz", "Rabatt"],
    richtig: 0,
    erklaerung: "Das angelegte Geld heißt Kapital. Die Zinsen sind das, was die Bank dafür zahlt.",
  },
  { typ: "input", frage: "Kapital 500 €, Zinssatz 2 % pro Jahr. Wie viel Zinsen gibt es in einem Jahr?", loesung: ["10"], einheit: "€", platzhalter: "Zahl", erklaerung: "2 % von 500 € = 500 : 100 · 2 = 10 €." },
  { typ: "input", frage: "Kapital 1 200 €, Zinssatz 3 % pro Jahr. Wie viel Zinsen gibt es in einem Jahr?", loesung: ["36"], einheit: "€", platzhalter: "Zahl", erklaerung: "1 % von 1 200 € = 12 €, also 3 % = 36 €." },
  { typ: "input", frage: "Kapital 2 000 €, Zinssatz 1,5 % pro Jahr. Wie viel Zinsen gibt es in einem Jahr?", loesung: ["30"], einheit: "€", platzhalter: "Zahl", erklaerung: "1 % von 2 000 € = 20 €, also 1,5 % = 30 €." },
  { typ: "input", frage: "Kapital 800 €, Zinssatz 2 %. Wie viel Geld ist nach einem Jahr insgesamt auf dem Konto?", loesung: ["816"], einheit: "€", platzhalter: "Zahl", erklaerung: "Zinsen: 2 % von 800 € = 16 €. Insgesamt: 800 + 16 = 816 €." },
  { typ: "input", frage: "Bei 600 € Kapital gibt es 18 € Zinsen im Jahr. Wie hoch ist der Zinssatz?", loesung: ["3"], einheit: "%", platzhalter: "Zahl", erklaerung: "18 von 600 = 18/600 = 3/100 = 3 %." },
  { typ: "input", frage: "Bei einem Zinssatz von 4 % gibt es 20 € Zinsen im Jahr. Wie groß ist das Kapital?", loesung: ["500"], einheit: "€", platzhalter: "Zahl", erklaerung: "4 % = 20 €, also 1 % = 5 €, und 100 % = 500 €." },
  {
    typ: "mc",
    frage: "Ein Kredit über 1 000 € kostet 5 % Zinsen pro Jahr. Wie viel Zinsen zahlt man in einem Jahr?",
    antworten: ["50 €", "5 €", "500 €", "105 €"],
    richtig: 0,
    erklaerung: "5 % von 1 000 € = 50 €.",
  },
  {
    typ: "luecke",
    frage: "Kapital 400 €, Zinssatz 2 % pro Jahr.",
    segmente: ["Zinsen: ", { luecke: ["8"] }, " €, Kontostand nach 1 Jahr: ", { luecke: ["408"] }, " €."],
    erklaerung: "2 % von 400 € = 8 €. 400 + 8 = 408 €.",
  },
  {
    typ: "zuordnen",
    frage: "Zinssatz 2 % pro Jahr. Ordne jedem Kapital die Jahreszinsen zu.",
    paare: [
      { links: "100 €", rechts: "2 €" },
      { links: "500 €", rechts: "10 €" },
      { links: "1 000 €", rechts: "20 €" },
      { links: "2 500 €", rechts: "50 €" },
    ],
    erklaerung: "Immer 2 % = Kapital : 100 · 2: 2 €, 10 €, 20 €, 50 €.",
  },
  { typ: "input", frage: "Wie viel Zinsen gibt es für 1 000 € bei 3 % in einem halben Jahr?", loesung: ["15"], einheit: "€", platzhalter: "Zahl", erklaerung: "Für 1 Jahr: 30 €. Für ein halbes Jahr: 30 : 2 = 15 €." },
  {
    typ: "mc",
    frage: "Was bedeutet ein Zinssatz von 2 % pro Jahr?",
    antworten: ["Für je 100 € Kapital gibt es 2 € Zinsen im Jahr", "Das Kapital verdoppelt sich jedes Jahr", "Man bekommt jeden Monat 2 €", "Die Bank behält 2 € vom Konto"],
    richtig: 0,
    erklaerung: "Prozent heißt „von Hundert“: 2 € Zinsen pro 100 € Kapital pro Jahr.",
  },
  { typ: "input", frage: "Lena legt 300 € zu 4 % pro Jahr an. Wie viel Zinsen bekommt sie in einem Jahr?", loesung: ["12"], einheit: "€", platzhalter: "Zahl", erklaerung: "4 % von 300 € = 3 · 4 = 12 €." },
  {
    typ: "sortieren",
    frage: "Ordne nach den Jahreszinsen aufsteigend — beginne beim kleinsten: 2 % von 400 €, 3 % von 500 €, 1 % von 2 000 €, 5 % von 600 €",
    richtig: ["2 % von 400 €", "3 % von 500 €", "1 % von 2 000 €", "5 % von 600 €"],
    erklaerung: "8 € < 15 € < 20 € < 30 €.",
  },
  { typ: "input", frage: "Herr Maier leiht sich 2 000 € zu 6 % Zinsen pro Jahr. Wie viel muss er nach einem Jahr insgesamt zurückzahlen?", loesung: ["2120", "2 120"], einheit: "€", platzhalter: "Zahl", erklaerung: "Zinsen: 6 % von 2 000 € = 120 €. Rückzahlung: 2 000 + 120 = 2 120 €." },
];

export default ZINSRECHNUNG_MS8;
