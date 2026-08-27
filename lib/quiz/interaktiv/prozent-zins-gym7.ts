// ============================================================================
// Interaktive Aufgaben — Prozent- & Zinsrechnung · Gymnasium Kl. 7 · Bayern
// Prozentwert/-satz/Grundwert, Rabatt & Erhöhung, Jahreszinsen.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const PROZENT_ZINS_GYM7: Aufgabe[] = [
  { typ: "input", frage: "Berechne 15 % von 300.", loesung: ["45"], platzhalter: "Zahl", erklaerung: "15 % = 0,15. 300 · 0,15 = 45." },
  { typ: "input", frage: "Wie viel Prozent sind 24 von 80?", loesung: ["30"], einheit: "%", platzhalter: "Zahl", erklaerung: "24 : 80 = 0,3 = 30 %." },
  { typ: "input", frage: "20 % eines Betrags sind 50 €. Wie groß ist der ganze Betrag?", loesung: ["250"], einheit: "€", platzhalter: "Zahl", erklaerung: "20 % sind 50 €, also 1 % = 2,50 €, und 100 % = 250 €." },
  { typ: "input", frage: "Du legst 200 € zu 3 % Zinsen pro Jahr an. Wie viel Zinsen bekommst du nach einem Jahr?", loesung: ["6"], einheit: "€", platzhalter: "Zahl", erklaerung: "Zinsen = 200 € · 3 % = 200 · 0,03 = 6 €." },
  { typ: "input", frage: "500 € werden zu 2 % pro Jahr verzinst. Wie viel Zinsen nach einem Jahr?", loesung: ["10"], einheit: "€", platzhalter: "Zahl", erklaerung: "500 € · 0,02 = 10 €." },
  { typ: "input", frage: "Ein Artikel kostet 120 € und wird um 15 % reduziert. Neuer Preis?", loesung: ["102"], einheit: "€", platzhalter: "Zahl", erklaerung: "15 % von 120 € = 18 € Rabatt. 120 € − 18 € = 102 €." },
  { typ: "input", frage: "Ein Preis von 80 € steigt um 25 %. Neuer Preis?", loesung: ["100"], einheit: "€", platzhalter: "Zahl", erklaerung: "25 % von 80 € = 20 €. 80 € + 20 € = 100 €." },
  {
    typ: "luecke",
    frage: "Zinsen = Kapital · Zinssatz.",
    segmente: ["Bei 400 € und 5 % pro Jahr sind das ", { luecke: ["20"] }, " € Zinsen im Jahr."],
    erklaerung: "400 € · 0,05 = 20 €.",
  },
  { typ: "input", frage: "Schreibe 250 % als Dezimalzahl.", loesung: ["2,5"], platzhalter: "z. B. 2,5", erklaerung: "250 % = 250 : 100 = 2,5." },
  {
    typ: "mc",
    frage: "Ein Pullover kostet nach 20 % Rabatt noch 40 €. Wie viel kostete er vorher?",
    antworten: ["50 €", "48 €", "32 €", "60 €"],
    richtig: 0,
    erklaerung: "40 € sind 80 % des alten Preises. 1 % = 0,50 €, 100 % = 50 €.",
  },
  { typ: "input", frage: "600 € werden zu 4 % pro Jahr verzinst. Zinsen nach einem Jahr?", loesung: ["24"], einheit: "€", platzhalter: "Zahl", erklaerung: "600 € · 0,04 = 24 €." },
  { typ: "input", frage: "Berechne 7 % von 1500.", loesung: ["105"], platzhalter: "Zahl", erklaerung: "1 % von 1500 = 15, also 7 % = 105." },
  { typ: "input", frage: "Ein Handy kostet 300 € und ist im Angebot 10 % billiger. Neuer Preis?", loesung: ["270"], einheit: "€", platzhalter: "Zahl", erklaerung: "10 % von 300 € = 30 €. 300 € − 30 € = 270 €." },
  { typ: "input", frage: "Für 100 € Kapital bekommst du 5 € Zinsen im Jahr. Wie hoch ist der Zinssatz?", loesung: ["5"], einheit: "%", platzhalter: "Zahl", erklaerung: "5 € von 100 € = 5 %." },
  {
    typ: "mc",
    frage: "Wie viel Prozent sind 1/4?",
    antworten: ["25 %", "20 %", "40 %", "14 %"],
    richtig: 0,
    erklaerung: "1/4 = 0,25 = 25 %.",
  },
];

export default PROZENT_ZINS_GYM7;
