// ============================================================================
// Interaktive Aufgaben — Prozentrechnung · Hauptschule Kl. 7 · Bayern
// Prozentwert mit 10-%-Trick, Prozentsatz bestimmen, Rabatt im Alltag.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const PROZENTRECHNUNG_HS7: Aufgabe[] = [
  { typ: "input", frage: "Berechne 10 % von 60 €.", loesung: ["6"], einheit: "€", platzhalter: "Zahl", erklaerung: "10 % = ein Zehntel: 60 : 10 = 6 €." },
  { typ: "input", frage: "Berechne 20 % von 60 €.", loesung: ["12"], einheit: "€", platzhalter: "Zahl", erklaerung: "10 % = 6 €, also 20 % = 2 · 6 = 12 €." },
  { typ: "input", frage: "Berechne 5 % von 60 €.", loesung: ["3"], einheit: "€", platzhalter: "Zahl", erklaerung: "10 % = 6 €, also 5 % = die Hälfte davon = 3 €." },
  { typ: "input", frage: "Berechne 25 % von 200 g.", loesung: ["50"], einheit: "g", platzhalter: "Zahl", erklaerung: "25 % = ein Viertel: 200 : 4 = 50 g." },
  { typ: "input", frage: "Berechne 1 % von 300 €.", loesung: ["3"], einheit: "€", platzhalter: "Zahl", erklaerung: "1 % = ein Hundertstel: 300 : 100 = 3 €." },
  { typ: "input", frage: "15 von 60 Schülern fahren mit dem Bus. Wie viel Prozent sind das?", loesung: ["25"], einheit: "%", platzhalter: "Zahl", erklaerung: "15/60 = 1/4 = 25 %." },
  { typ: "input", frage: "6 von 30 Losen gewinnen. Wie viel Prozent sind das?", loesung: ["20"], einheit: "%", platzhalter: "Zahl", erklaerung: "6/30 = 1/5 = 20 %." },
  {
    typ: "mc",
    frage: "Eine Hose kostet 50 €. Sie ist um 20 % reduziert. Wie viel sparst du?",
    antworten: ["10 €", "20 €", "5 €", "40 €"],
    richtig: 0,
    erklaerung: "20 % von 50 € = 10 €.",
  },
  {
    typ: "mc",
    frage: "Eine Hose kostet 50 € und ist um 20 % reduziert. Was kostet sie jetzt?",
    antworten: ["40 €", "30 €", "45 €", "10 €"],
    richtig: 0,
    erklaerung: "Rabatt: 10 €. Neuer Preis: 50 − 10 = 40 €.",
  },
  {
    typ: "luecke",
    frage: "10-%-Trick bei 250 €.",
    segmente: ["10 % = ", { luecke: ["25"] }, " €, also 30 % = ", { luecke: ["75"] }, " €."],
    erklaerung: "250 : 10 = 25 €. 30 % = 3 · 25 = 75 €.",
  },
  {
    typ: "zuordnen",
    frage: "Ordne jedem Prozentsatz von 400 € den Wert zu.",
    paare: [
      { links: "1 %", rechts: "4 €" },
      { links: "10 %", rechts: "40 €" },
      { links: "25 %", rechts: "100 €" },
      { links: "50 %", rechts: "200 €" },
    ],
    erklaerung: "400 : 100 = 4 €; 400 : 10 = 40 €; 400 : 4 = 100 €; 400 : 2 = 200 €.",
  },
  { typ: "input", frage: "Ein Fahrrad kostet 400 €. Der Preis steigt um 5 %. Wie viel kostet es danach?", loesung: ["420"], einheit: "€", platzhalter: "Zahl", erklaerung: "5 % von 400 € = 20 €. Neuer Preis: 420 €." },
  { typ: "input", frage: "Von 200 Besuchern eines Konzerts sind 40 Kinder. Wie viel Prozent sind Kinder?", loesung: ["20"], einheit: "%", platzhalter: "Zahl", erklaerung: "40/200 = 20/100 = 20 %." },
  {
    typ: "mc",
    frage: "Was ist mehr: 10 % von 300 € oder 20 % von 100 €?",
    antworten: ["10 % von 300 €", "20 % von 100 €", "beides gleich", "das kann man nicht rechnen"],
    richtig: 0,
    erklaerung: "10 % von 300 € = 30 €, aber 20 % von 100 € = 20 €.",
  },
  {
    typ: "sortieren",
    frage: "Ordne nach dem Geldwert aufsteigend — beginne beim kleinsten: 10 % von 40 €, 50 % von 12 €, 25 % von 40 €, 20 % von 60 €",
    richtig: ["10 % von 40 €", "50 % von 12 €", "25 % von 40 €", "20 % von 60 €"],
    erklaerung: "4 € < 6 € < 10 € < 12 €.",
  },
];

export default PROZENTRECHNUNG_HS7;
