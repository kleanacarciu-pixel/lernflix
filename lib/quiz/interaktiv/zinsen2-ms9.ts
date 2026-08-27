// ============================================================================
// Interaktive Aufgaben — Zinsrechnung vertieft · Mittelschule Kl. 9 · Bayern
// Jahres-, Monats- und Tageszinsen, Zinssatz und Kapital berechnen, Kredit.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const ZINSEN2_MS9: Aufgabe[] = [
  { typ: "input", frage: "Kapital 1 500 €, Zinssatz 4 % pro Jahr. Berechne die Jahreszinsen.", loesung: ["60"], einheit: "€", platzhalter: "Zahl", erklaerung: "1 % von 1 500 € = 15 €, also 4 % = 60 €." },
  { typ: "input", frage: "Kapital 2 400 €, Zinssatz 3 % pro Jahr. Wie viel Zinsen gibt es in 6 Monaten?", loesung: ["36"], einheit: "€", platzhalter: "Zahl", erklaerung: "Jahreszinsen: 3 % von 2 400 € = 72 €. Halbes Jahr: 72 : 2 = 36 €." },
  { typ: "input", frage: "Kapital 1 200 €, Zinssatz 5 % pro Jahr. Wie viel Zinsen gibt es in 3 Monaten?", loesung: ["15"], einheit: "€", platzhalter: "Zahl", erklaerung: "Jahreszinsen: 60 €. 3 Monate = 1/4 Jahr: 60 : 4 = 15 €." },
  { typ: "input", frage: "Bei 800 € Kapital gibt es 24 € Zinsen im Jahr. Wie hoch ist der Zinssatz?", loesung: ["3"], einheit: "%", platzhalter: "Zahl", erklaerung: "24/800 = 3/100 = 3 %." },
  { typ: "input", frage: "Bei einem Zinssatz von 2 % gibt es 44 € Zinsen im Jahr. Wie groß ist das Kapital?", loesung: ["2200", "2 200"], einheit: "€", platzhalter: "Zahl", erklaerung: "2 % = 44 €, also 1 % = 22 €, und 100 % = 2 200 €." },
  {
    typ: "mc",
    frage: "Mit welcher Formel berechnet man Monatszinsen für m Monate?",
    antworten: ["Jahreszinsen · m/12", "Jahreszinsen · m", "Jahreszinsen : m", "Kapital · m"],
    richtig: 0,
    erklaerung: "m Monate sind m/12 eines Jahres — die Jahreszinsen werden anteilig gerechnet.",
  },
  { typ: "input", frage: "Kapital 3 000 €, Zinssatz 2 % pro Jahr. Wie viel Zinsen gibt es in 8 Monaten?", loesung: ["40"], einheit: "€", platzhalter: "Zahl", erklaerung: "Jahreszinsen: 60 €. Für 8 Monate: 60 · 8/12 = 40 €." },
  {
    typ: "luecke",
    frage: "Kredit: 5 000 € zu 6 % pro Jahr.",
    segmente: ["Jahreszinsen: ", { luecke: ["300"] }, " €, Rückzahlung nach 1 Jahr insgesamt: ", { luecke: ["5300", "5 300"] }, " €."],
    erklaerung: "6 % von 5 000 € = 300 €. 5 000 + 300 = 5 300 €.",
  },
  {
    typ: "mc",
    frage: "Was ist für den Sparer am besten?",
    antworten: ["hoher Zinssatz beim Sparen, niedriger beim Kredit", "niedriger Zinssatz beim Sparen", "hoher Zinssatz beim Kredit", "Zinsen spielen keine Rolle"],
    richtig: 0,
    erklaerung: "Beim Sparen bekommt man Zinsen (hoch = gut), beim Kredit zahlt man sie (niedrig = gut).",
  },
  {
    typ: "zuordnen",
    frage: "Zinssatz 3 % pro Jahr. Ordne jedem Kapital die Jahreszinsen zu.",
    paare: [
      { links: "500 €", rechts: "15 €" },
      { links: "1 000 €", rechts: "30 €" },
      { links: "3 000 €", rechts: "90 €" },
      { links: "10 000 €", rechts: "300 €" },
    ],
    erklaerung: "3 % = Kapital : 100 · 3: 15 €, 30 €, 90 €, 300 €.",
  },
  { typ: "input", frage: "Frau Huber legt 4 000 € für 2 Jahre zu 3 % pro Jahr an (einfache Zinsen, keine Zinseszinsen). Wie viel Zinsen bekommt sie insgesamt?", loesung: ["240"], einheit: "€", platzhalter: "Zahl", erklaerung: "Pro Jahr: 3 % von 4 000 € = 120 €. In 2 Jahren: 240 €." },
  { typ: "input", frage: "Ein Fernseher kostet 900 €. Bei Ratenzahlung zahlt man insgesamt 954 €. Wie viel Prozent Aufschlag sind das?", loesung: ["6"], einheit: "%", platzhalter: "Zahl", erklaerung: "Aufschlag: 54 €. 54/900 = 6/100 = 6 %." },
  {
    typ: "mc",
    frage: "Kapital 2 000 €, nach einem Jahr sind es 2 080 €. Wie hoch war der Zinssatz?",
    antworten: ["4 %", "8 %", "2 %", "80 %"],
    richtig: 0,
    erklaerung: "Zinsen: 80 €. 80/2 000 = 4/100 = 4 %.",
  },
  {
    typ: "sortieren",
    frage: "Ordne nach den Jahreszinsen aufsteigend — beginne beim kleinsten: 1 % von 3 000 €, 2 % von 2 000 €, 3 % von 2 000 €, 4 % von 2 500 €",
    richtig: ["1 % von 3 000 €", "2 % von 2 000 €", "3 % von 2 000 €", "4 % von 2 500 €"],
    erklaerung: "30 € < 40 € < 60 € < 100 €.",
  },
  { typ: "input", frage: "Kapital 6 000 €, Zinssatz 2,5 % pro Jahr. Berechne die Jahreszinsen.", loesung: ["150"], einheit: "€", platzhalter: "Zahl", erklaerung: "1 % = 60 €, also 2,5 % = 2,5 · 60 = 150 €." },
];

export default ZINSEN2_MS9;
