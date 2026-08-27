// ============================================================================
// Interaktive Aufgaben — Prozent — Einstieg · Hauptschule Kl. 6 · Bayern
// Prozent als "von Hundert", einfache Prozentwerte, Alltag (Rabatt, Akku).
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const PROZENT_HS6: Aufgabe[] = [
  {
    typ: "mc",
    frage: "Was bedeutet „Prozent“?",
    antworten: ["von Hundert", "von Tausend", "von Zehn", "die Hälfte"],
    richtig: 0,
    erklaerung: "Prozent kommt aus dem Lateinischen und heißt „von Hundert“: 1 % = 1 von 100.",
  },
  { typ: "input", frage: "Wie viel Prozent sind die Hälfte?", loesung: ["50"], einheit: "%", platzhalter: "Zahl", erklaerung: "Die Hälfte = 50/100 = 50 %." },
  { typ: "input", frage: "Wie viel Prozent ist ein Viertel?", loesung: ["25"], einheit: "%", platzhalter: "Zahl", erklaerung: "1/4 = 25/100 = 25 %." },
  { typ: "input", frage: "Wie viel Prozent ist das Ganze?", loesung: ["100"], einheit: "%", platzhalter: "Zahl", erklaerung: "Das Ganze = 100 %." },
  { typ: "input", frage: "Berechne 50 % von 80 €.", loesung: ["40"], einheit: "€", platzhalter: "Zahl", erklaerung: "50 % ist die Hälfte: 80 : 2 = 40 €." },
  { typ: "input", frage: "Berechne 25 % von 40 €.", loesung: ["10"], einheit: "€", platzhalter: "Zahl", erklaerung: "25 % ist ein Viertel: 40 : 4 = 10 €." },
  { typ: "input", frage: "Berechne 10 % von 90 €.", loesung: ["9"], einheit: "€", platzhalter: "Zahl", erklaerung: "10 % ist ein Zehntel: 90 : 10 = 9 €." },
  { typ: "input", frage: "Von 100 Schülern essen 45 in der Mensa. Wie viel Prozent sind das?", loesung: ["45"], einheit: "%", platzhalter: "Zahl", erklaerung: "45 von 100 = 45 %." },
  {
    typ: "mc",
    frage: "Dein Handy-Akku zeigt 50 %. Was heißt das?",
    antworten: ["Der Akku ist halb voll", "Der Akku ist ganz voll", "Der Akku ist fast leer", "Das Handy ist kaputt"],
    richtig: 0,
    erklaerung: "50 % = die Hälfte — der Akku ist halb voll.",
  },
  {
    typ: "mc",
    frage: "Ein T-Shirt ist um 50 % reduziert. Es kostete 20 €. Was kostet es jetzt?",
    antworten: ["10 €", "15 €", "5 €", "19,50 €"],
    richtig: 0,
    erklaerung: "50 % Rabatt = halber Preis: 20 : 2 = 10 €.",
  },
  {
    typ: "luecke",
    frage: "Brüche und Prozente.",
    segmente: ["1/2 = ", { luecke: ["50"] }, " % und 1/4 = ", { luecke: ["25"] }, " %."],
    erklaerung: "1/2 = 50 %, 1/4 = 25 %.",
  },
  {
    typ: "zuordnen",
    frage: "Ordne jedem Anteil die Prozentzahl zu.",
    paare: [
      { links: "das Ganze", rechts: "100 %" },
      { links: "die Hälfte", rechts: "50 %" },
      { links: "ein Viertel", rechts: "25 %" },
      { links: "ein Zehntel", rechts: "10 %" },
    ],
    erklaerung: "Ganzes = 100 %, Hälfte = 50 %, Viertel = 25 %, Zehntel = 10 %.",
  },
  {
    typ: "sortieren",
    frage: "Ordne die Anteile aufsteigend — beginne beim kleinsten: 75 %, 10 %, 100 %, 25 %",
    richtig: ["10 %", "25 %", "75 %", "100 %"],
    erklaerung: "10 % < 25 % < 75 % < 100 %.",
  },
  { typ: "input", frage: "Bei einem Gewinnspiel gewinnen 10 von 100 Losen. Wie viel Prozent der Lose gewinnen?", loesung: ["10"], einheit: "%", platzhalter: "Zahl", erklaerung: "10 von 100 = 10 %." },
  { typ: "input", frage: "Ein Schokoriegel kostet 1 €. Der Preis steigt um 10 %. Wie viel kostet er danach? (Als Kommazahl.)", loesung: ["1,10", "1,1"], einheit: "€", platzhalter: "z. B. 1,10", erklaerung: "10 % von 1 € = 0,10 €. Neuer Preis: 1,10 €." },
];

export default PROZENT_HS6;
