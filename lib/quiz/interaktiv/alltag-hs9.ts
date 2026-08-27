// ============================================================================
// Interaktive Aufgaben — Rechnen im Alltag · Hauptschule Kl. 9 · Bayern
// Einkauf, Lohn, Miete, Handyvertrag, Sparen — angewandtes Rechnen.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const ALLTAG_HS9: Aufgabe[] = [
  { typ: "input", frage: "Ein Handyvertrag kostet 15 € im Monat. Wie viel kostet er im Jahr?", loesung: ["180"], einheit: "€", platzhalter: "Zahl", erklaerung: "12 · 15 = 180 €." },
  { typ: "input", frage: "Du verdienst 12 € pro Stunde und arbeitest 8 Stunden. Wie viel verdienst du?", loesung: ["96"], einheit: "€", platzhalter: "Zahl", erklaerung: "8 · 12 = 96 €." },
  { typ: "input", frage: "Einkauf: 2,50 € + 1,20 € + 3,30 €. Wie viel zusammen?", loesung: ["7", "7,00", "7,0"], einheit: "€", platzhalter: "Zahl", erklaerung: "2,50 + 1,20 + 3,30 = 7,00 €." },
  { typ: "input", frage: "Du bezahlst 7 € mit einem 20-€-Schein. Wie viel Rückgeld bekommst du?", loesung: ["13"], einheit: "€", platzhalter: "Zahl", erklaerung: "20 − 7 = 13 €." },
  { typ: "input", frage: "Miete 450 €, Strom 60 €, Internet 30 €. Wie viel zahlst du im Monat zusammen?", loesung: ["540"], einheit: "€", platzhalter: "Zahl", erklaerung: "450 + 60 + 30 = 540 €." },
  { typ: "input", frage: "Ein Angebot: 3 Duschgels für 4,50 €. Wie viel kostet ein Duschgel? (Als Kommazahl.)", loesung: ["1,50", "1,5"], einheit: "€", platzhalter: "z. B. 1,50", erklaerung: "4,50 : 3 = 1,50 €." },
  {
    typ: "mc",
    frage: "Was ist günstiger pro Liter: 2 Liter Saft für 3 € oder 1 Liter für 1,80 €?",
    antworten: ["2 Liter für 3 €", "1 Liter für 1,80 €", "beides gleich", "das kann man nicht rechnen"],
    richtig: 0,
    erklaerung: "2 Liter für 3 € = 1,50 € pro Liter — billiger als 1,80 €.",
  },
  {
    typ: "mc",
    frage: "Dein Netto-Lohn ist 1 400 €. Die Miete kostet 500 €. Wie viel bleibt dir?",
    antworten: ["900 €", "1 000 €", "800 €", "1 900 €"],
    richtig: 0,
    erklaerung: "1 400 − 500 = 900 €.",
  },
  { typ: "input", frage: "Du sparst jeden Monat 25 €. Wie viel hast du nach einem Jahr gespart?", loesung: ["300"], einheit: "€", platzhalter: "Zahl", erklaerung: "12 · 25 = 300 €." },
  { typ: "input", frage: "Eine Jeans kostet 60 € und ist um 25 % reduziert. Was kostet sie jetzt?", loesung: ["45"], einheit: "€", platzhalter: "Zahl", erklaerung: "25 % von 60 € = 15 €. Neuer Preis: 45 €." },
  {
    typ: "luecke",
    frage: "Tanken: 40 Liter zu je 1,80 €.",
    segmente: ["Das kostet ", { luecke: ["72", "72,00"] }, " €. Bei 1,90 € pro Liter wären es ", { luecke: ["76", "76,00"] }, " €."],
    erklaerung: "40 · 1,80 = 72 €. 40 · 1,90 = 76 €.",
  },
  {
    typ: "zuordnen",
    frage: "Ordne jedem Einkauf den Preis zu.",
    paare: [
      { links: "4 Semmeln à 0,50 €", rechts: "2 €" },
      { links: "2 kg Äpfel à 3 €", rechts: "6 €" },
      { links: "3 Flaschen à 1,50 €", rechts: "4,50 €" },
      { links: "5 Postkarten à 0,80 €", rechts: "4 €" },
    ],
    erklaerung: "4 · 0,50 = 2 €; 2 · 3 = 6 €; 3 · 1,50 = 4,50 €; 5 · 0,80 = 4 €.",
  },
  {
    typ: "mc",
    frage: "Ein Streaming-Abo kostet 9 € im Monat, ein anderes 99 € im Jahr. Welches ist aufs Jahr gerechnet billiger?",
    antworten: ["das Jahres-Abo für 99 €", "das Monats-Abo", "beide gleich teuer", "das kann man nicht vergleichen"],
    richtig: 0,
    erklaerung: "Monats-Abo: 12 · 9 = 108 € im Jahr. 99 € ist billiger.",
  },
  { typ: "input", frage: "Für ein Klassenfest kaufen 24 Schüler je ein Getränk für 1,50 €. Wie viel kostet das zusammen?", loesung: ["36"], einheit: "€", platzhalter: "Zahl", erklaerung: "24 · 1,50 = 36 €." },
  {
    typ: "sortieren",
    frage: "Ordne die Monatskosten aufsteigend — beginne bei den niedrigsten: Handy 15 €, Fitnessstudio 30 €, Busticket 49 €, Streaming 9 €",
    richtig: ["Streaming 9 €", "Handy 15 €", "Fitnessstudio 30 €", "Busticket 49 €"],
    erklaerung: "9 € < 15 € < 30 € < 49 €.",
  },
];

export default ALLTAG_HS9;
