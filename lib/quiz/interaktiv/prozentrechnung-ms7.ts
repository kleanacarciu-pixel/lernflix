// ============================================================================
// Interaktive Aufgaben — Prozentrechnung · Mittelschule Kl. 7 · Bayern
// Grundwert, Prozentwert, Prozentsatz; Rabatt und Alltagsaufgaben.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const PROZENTRECHNUNG_MS7: Aufgabe[] = [
  { typ: "input", frage: "Berechne 20 % von 150 €.", loesung: ["30"], einheit: "€", platzhalter: "Zahl", erklaerung: "10 % von 150 € sind 15 €, also 20 % = 2 · 15 = 30 €." },
  { typ: "input", frage: "Berechne 5 % von 200 kg.", loesung: ["10"], einheit: "kg", platzhalter: "Zahl", erklaerung: "1 % von 200 = 2, also 5 % = 5 · 2 = 10 kg." },
  { typ: "input", frage: "Berechne 75 % von 400 €.", loesung: ["300"], einheit: "€", platzhalter: "Zahl", erklaerung: "75 % = 3/4. 400 : 4 = 100, mal 3 = 300 €." },
  { typ: "input", frage: "12 von 48 Schülern tragen eine Brille. Wie viel Prozent sind das?", loesung: ["25"], einheit: "%", platzhalter: "Zahl", erklaerung: "12/48 = 1/4 = 25 %." },
  { typ: "input", frage: "9 von 30 Losen gewinnen. Wie viel Prozent sind das?", loesung: ["30"], einheit: "%", platzhalter: "Zahl", erklaerung: "9/30 = 3/10 = 30 %." },
  { typ: "input", frage: "30 % eines Betrags sind 60 €. Wie groß ist der ganze Betrag (Grundwert)?", loesung: ["200"], einheit: "€", platzhalter: "Zahl", erklaerung: "30 % = 60 €, also 10 % = 20 €, und 100 % = 200 €." },
  {
    typ: "mc",
    frage: "Eine Jacke kostet 80 €. Sie ist um 25 % reduziert. Wie viel kostet sie jetzt?",
    antworten: ["60 €", "55 €", "20 €", "75 €"],
    richtig: 0,
    erklaerung: "25 % von 80 € = 20 € Rabatt. Neuer Preis: 80 € − 20 € = 60 €.",
  },
  {
    typ: "mc",
    frage: "Wie heißt in der Aufgabe „20 % von 150 € sind 30 €“ die Zahl 150 €?",
    antworten: ["Grundwert", "Prozentwert", "Prozentsatz", "Rabatt"],
    richtig: 0,
    erklaerung: "Der Grundwert ist das Ganze (150 €). 30 € ist der Prozentwert, 20 % der Prozentsatz.",
  },
  {
    typ: "luecke",
    frage: "Rechne mit dem 10-%-Trick: 10 % von 90 € und dann 30 %.",
    segmente: ["10 % von 90 € = ", { luecke: ["9"] }, " €, also 30 % = ", { luecke: ["27"] }, " €."],
    erklaerung: "10 % = 90 : 10 = 9 €. 30 % = 3 · 9 = 27 €.",
  },
  {
    typ: "zuordnen",
    frage: "Ordne jedem Prozentsatz von 200 € den richtigen Wert zu.",
    paare: [
      { links: "10 % von 200 €", rechts: "20 €" },
      { links: "25 % von 200 €", rechts: "50 €" },
      { links: "50 % von 200 €", rechts: "100 €" },
      { links: "1 % von 200 €", rechts: "2 €" },
    ],
    erklaerung: "10 % = 200 : 10 = 20 €; 25 % = 200 : 4 = 50 €; 50 % = 200 : 2 = 100 €; 1 % = 200 : 100 = 2 €.",
  },
  { typ: "input", frage: "Ein Handy kostet 300 €. Der Preis steigt um 10 %. Wie viel kostet es danach?", loesung: ["330"], einheit: "€", platzhalter: "Zahl", erklaerung: "10 % von 300 € = 30 €. Neuer Preis: 300 + 30 = 330 €." },
  { typ: "input", frage: "In einer Klasse mit 25 Kindern sind 40 % Jungen. Wie viele Jungen sind das?", loesung: ["10"], platzhalter: "Zahl", erklaerung: "10 % von 25 = 2,5, also 40 % = 4 · 2,5 = 10 Jungen." },
  {
    typ: "mc",
    frage: "Was ist mehr: 30 % von 200 € oder 50 % von 100 €?",
    antworten: ["30 % von 200 €", "50 % von 100 €", "beides gleich viel", "das kann man nicht vergleichen"],
    richtig: 0,
    erklaerung: "30 % von 200 € = 60 €, aber 50 % von 100 € = 50 €. Also ist 60 € mehr.",
  },
  { typ: "input", frage: "Von 120 Fahrgästen steigen 30 aus. Wie viel Prozent sind das?", loesung: ["25"], einheit: "%", platzhalter: "Zahl", erklaerung: "30/120 = 1/4 = 25 %." },
  {
    typ: "sortieren",
    frage: "Ordne aufsteigend nach dem Geldwert — beginne beim kleinsten: 10 % von 50 €, 20 % von 40 €, 50 % von 30 €, 25 % von 80 €",
    richtig: ["10 % von 50 €", "20 % von 40 €", "50 % von 30 €", "25 % von 80 €"],
    erklaerung: "5 € < 8 € < 15 € < 20 €.",
  },
];

export default PROZENTRECHNUNG_MS7;
