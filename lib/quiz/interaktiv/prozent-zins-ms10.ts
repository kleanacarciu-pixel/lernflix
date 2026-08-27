// ============================================================================
// Interaktive Aufgaben — Prozent & Zins im Alltag · Mittelschule Kl. 10 · Bayern
// Rabatt, Mehrwertsteuer, Preiserhöhung, Zinsen, Ratenkauf — Anwendungsniveau.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const PROZENT_ZINS_MS10: Aufgabe[] = [
  { typ: "input", frage: "Ein Laptop kostet 800 €. Im Sale gibt es 15 % Rabatt. Wie viel Euro sparst du?", loesung: ["120"], einheit: "€", platzhalter: "Zahl", erklaerung: "10 % = 80 €, 5 % = 40 €, zusammen 15 % = 120 €." },
  { typ: "input", frage: "Ein Laptop kostet 800 €. Im Sale gibt es 15 % Rabatt. Wie viel kostet er dann?", loesung: ["680"], einheit: "€", platzhalter: "Zahl", erklaerung: "Rabatt: 120 €. Neuer Preis: 800 − 120 = 680 €." },
  { typ: "input", frage: "Eine Ware kostet netto 200 €. Dazu kommen 19 % Mehrwertsteuer. Wie hoch ist der Endpreis?", loesung: ["238"], einheit: "€", platzhalter: "Zahl", erklaerung: "19 % von 200 € = 38 €. Endpreis: 200 + 38 = 238 €." },
  { typ: "input", frage: "Die Miete steigt von 600 € um 5 %. Wie hoch ist die neue Miete?", loesung: ["630"], einheit: "€", platzhalter: "Zahl", erklaerung: "5 % von 600 € = 30 €. Neu: 600 + 30 = 630 €." },
  { typ: "input", frage: "Ein Pullover kostete 40 €, jetzt nur noch 30 €. Um wie viel Prozent wurde er billiger?", loesung: ["25"], einheit: "%", platzhalter: "Zahl", erklaerung: "Ersparnis: 10 €. 10/40 = 1/4 = 25 %." },
  {
    typ: "mc",
    frage: "Ein Preis wird erst um 50 % erhöht und dann um 50 % gesenkt. Was gilt?",
    antworten: ["Der Endpreis ist niedriger als der Anfangspreis", "Der Endpreis ist gleich dem Anfangspreis", "Der Endpreis ist höher", "Das hängt vom Wochentag ab"],
    richtig: 0,
    erklaerung: "Beispiel 100 €: +50 % → 150 €, −50 % davon → 75 €. Die Senkung wirkt auf den höheren Preis.",
  },
  { typ: "input", frage: "Sparbuch: 2 500 € zu 2 % pro Jahr. Wie viel Zinsen gibt es in einem Jahr?", loesung: ["50"], einheit: "€", platzhalter: "Zahl", erklaerung: "1 % = 25 €, also 2 % = 50 €." },
  { typ: "input", frage: "Kredit: 10 000 € zu 4 % pro Jahr. Wie viel Zinsen fallen in einem Jahr an?", loesung: ["400"], einheit: "€", platzhalter: "Zahl", erklaerung: "4 % von 10 000 € = 400 €." },
  {
    typ: "luecke",
    frage: "Ein Fahrrad kostet 500 €. Es wird um 20 % reduziert.",
    segmente: ["Rabatt: ", { luecke: ["100"] }, " €, neuer Preis: ", { luecke: ["400"] }, " €."],
    erklaerung: "20 % von 500 € = 100 €. 500 − 100 = 400 €.",
  },
  {
    typ: "mc",
    frage: "Was ist günstiger für den Käufer: 20 % Rabatt auf 50 € oder 15 € Rabatt auf 50 €?",
    antworten: ["15 € Rabatt", "20 % Rabatt", "beides gleich", "keins von beiden"],
    richtig: 0,
    erklaerung: "20 % von 50 € = 10 € Rabatt. 15 € Rabatt ist mehr — also günstiger für den Käufer.",
  },
  {
    typ: "zuordnen",
    frage: "Ordne jeder Situation den Endpreis zu (Ausgangspreis je 100 €).",
    paare: [
      { links: "10 % Rabatt", rechts: "90 €" },
      { links: "25 % Rabatt", rechts: "75 €" },
      { links: "10 % Aufschlag", rechts: "110 €" },
      { links: "50 % Rabatt", rechts: "50 €" },
    ],
    erklaerung: "100 € − 10 % = 90 €; − 25 % = 75 €; + 10 % = 110 €; − 50 % = 50 €.",
  },
  { typ: "input", frage: "Beim Ratenkauf zahlst du 12 Raten zu je 90 €. Bar würde das Gerät 1 000 € kosten. Wie viel Euro zahlst du beim Ratenkauf mehr?", loesung: ["80"], einheit: "€", platzhalter: "Zahl", erklaerung: "12 · 90 = 1 080 €. Mehrkosten: 1 080 − 1 000 = 80 €." },
  { typ: "input", frage: "Von 1 200 € Gehalt gehen 20 % für Miete weg. Wie viel Euro bleiben übrig?", loesung: ["960"], einheit: "€", platzhalter: "Zahl", erklaerung: "Miete: 20 % von 1 200 € = 240 €. Rest: 1 200 − 240 = 960 €." },
  {
    typ: "mc",
    frage: "Ein Konto wird mit 12 % Dispozinsen pro Jahr belastet. Du bist ein halbes Jahr mit 500 € im Minus. Wie viel Zinsen kostet das ungefähr?",
    antworten: ["30 €", "60 €", "12 €", "6 €"],
    richtig: 0,
    erklaerung: "Jahreszinsen: 12 % von 500 € = 60 €. Ein halbes Jahr: 30 €.",
  },
  {
    typ: "sortieren",
    frage: "Ordne die Angebote für dieselbe Jacke (Originalpreis 80 €) nach dem Endpreis aufsteigend — beginne beim günstigsten: 25 % Rabatt, 10 € Rabatt, 5 % Rabatt, kein Rabatt",
    richtig: ["25 % Rabatt", "10 € Rabatt", "5 % Rabatt", "kein Rabatt"],
    erklaerung: "Endpreise: 60 € (− 20 €) < 70 € < 76 € (− 4 €) < 80 €.",
  },
];

export default PROZENT_ZINS_MS10;
