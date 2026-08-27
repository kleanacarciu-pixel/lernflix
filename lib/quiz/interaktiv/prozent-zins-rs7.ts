// ============================================================================
// Interaktive Aufgaben — Prozent- & Zinsrechnung · Realschule Kl. 7 · Bayern
// Prozentwert/-satz/Grundwert, Rabatt/Erhöhung, Jahreszinsen.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const PROZENT_ZINS_RS7: Aufgabe[] = [
  { typ: "input", frage: "Berechne 15 % von 200.", loesung: ["30"], platzhalter: "Zahl", erklaerung: "15 % = 0,15. 200 · 0,15 = 30." },
  { typ: "input", frage: "Wie viel Prozent sind 18 von 60?", loesung: ["30"], einheit: "%", platzhalter: "Zahl", erklaerung: "18 : 60 = 0,3 = 30 %." },
  { typ: "input", frage: "25 % eines Betrags sind 20 €. Wie groß ist der ganze Betrag?", loesung: ["80"], einheit: "€", platzhalter: "Zahl", erklaerung: "25 % sind 20 €, also 100 % = 4 · 20 = 80 €." },
  { typ: "input", frage: "Du legst 300 € zu 2 % Zinsen pro Jahr an. Wie viel Zinsen bekommst du nach einem Jahr?", loesung: ["6"], einheit: "€", platzhalter: "Zahl", erklaerung: "300 · 0,02 = 6 €." },
  { typ: "input", frage: "400 € werden zu 5 % pro Jahr verzinst. Wie viel Zinsen nach einem Jahr?", loesung: ["20"], einheit: "€", platzhalter: "Zahl", erklaerung: "400 · 0,05 = 20 €." },
  { typ: "input", frage: "Ein Pullover kostet 60 € und wird um 10 % reduziert. Neuer Preis?", loesung: ["54"], einheit: "€", platzhalter: "Zahl", erklaerung: "10 % von 60 € = 6 € Rabatt. 60 − 6 = 54 €." },
  { typ: "input", frage: "Ein Preis von 50 € steigt um 20 %. Neuer Preis?", loesung: ["60"], einheit: "€", platzhalter: "Zahl", erklaerung: "20 % von 50 € = 10 €. 50 + 10 = 60 €." },
  {
    typ: "luecke",
    frage: "Zinsen = Kapital · Zinssatz.",
    segmente: ["Bei 200 € und 3 % pro Jahr sind das ", { luecke: ["6"] }, " € Zinsen im Jahr."],
    erklaerung: "200 · 0,03 = 6 €.",
  },
  { typ: "input", frage: "Schreibe 150 % als Dezimalzahl.", loesung: ["1,5"], platzhalter: "z. B. 1,5", erklaerung: "150 % = 150 : 100 = 1,5." },
  {
    typ: "mc",
    frage: "Eine Hose kostet nach 25 % Rabatt noch 30 €. Wie viel kostete sie vorher?",
    antworten: ["40 €", "37,50 €", "22,50 €", "55 €"],
    richtig: 0,
    erklaerung: "30 € sind 75 % des alten Preises. 1 % = 0,40 €, also 100 % = 40 €.",
  },
  { typ: "input", frage: "Berechne 2 % von 800.", loesung: ["16"], platzhalter: "Zahl", erklaerung: "1 % von 800 = 8, also 2 % = 16." },
  { typ: "input", frage: "Ein Handy kostet 240 € und ist im Angebot 15 % billiger. Neuer Preis?", loesung: ["204"], einheit: "€", platzhalter: "Zahl", erklaerung: "15 % von 240 € = 36 €. 240 − 36 = 204 €." },
  { typ: "input", frage: "Für 200 € Kapital bekommst du 8 € Zinsen im Jahr. Wie hoch ist der Zinssatz?", loesung: ["4"], einheit: "%", platzhalter: "Zahl", erklaerung: "8 : 200 = 0,04 = 4 %." },
  {
    typ: "mc",
    frage: "Wie viel Prozent sind 3/4?",
    antworten: ["75 %", "34 %", "50 %", "80 %"],
    richtig: 0,
    erklaerung: "3/4 = 0,75 = 75 %.",
  },
  { typ: "input", frage: "Berechne 6 % von 150.", loesung: ["9"], platzhalter: "Zahl", erklaerung: "1 % von 150 = 1,5, also 6 % = 9." },
];

export default PROZENT_ZINS_RS7;
