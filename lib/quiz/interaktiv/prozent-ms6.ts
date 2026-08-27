// ============================================================================
// Interaktive Aufgaben — Prozent — Einstieg · Mittelschule Kl. 6 · Bayern
// Prozent als Hundertstel, Bruch/Dezimal/Prozent umwandeln, einfache Anteile.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const PROZENT_MS6: Aufgabe[] = [
  {
    typ: "mc",
    frage: "Was bedeutet 1 %?",
    antworten: ["1 von 100", "1 von 10", "1 von 1000", "die Hälfte"],
    richtig: 0,
    erklaerung: "Prozent heißt „von Hundert“: 1 % = 1/100.",
  },
  { typ: "input", frage: "Schreibe den Bruch 1/2 in Prozent.", loesung: ["50"], einheit: "%", platzhalter: "Zahl", erklaerung: "1/2 = 50/100 = 50 %." },
  { typ: "input", frage: "Schreibe den Bruch 1/4 in Prozent.", loesung: ["25"], einheit: "%", platzhalter: "Zahl", erklaerung: "1/4 = 25/100 = 25 %." },
  { typ: "input", frage: "Schreibe den Bruch 3/4 in Prozent.", loesung: ["75"], einheit: "%", platzhalter: "Zahl", erklaerung: "3/4 = 75/100 = 75 %." },
  { typ: "input", frage: "Schreibe den Bruch 1/10 in Prozent.", loesung: ["10"], einheit: "%", platzhalter: "Zahl", erklaerung: "1/10 = 10/100 = 10 %." },
  { typ: "input", frage: "Schreibe 30 % als Dezimalzahl.", loesung: ["0,3", "0,30"], platzhalter: "z. B. 0,3", erklaerung: "30 % = 30/100 = 0,30 = 0,3." },
  { typ: "input", frage: "Berechne 50 % von 60 €.", loesung: ["30"], einheit: "€", platzhalter: "Zahl", erklaerung: "50 % ist die Hälfte: 60 : 2 = 30 €." },
  { typ: "input", frage: "Berechne 25 % von 80 €.", loesung: ["20"], einheit: "€", platzhalter: "Zahl", erklaerung: "25 % ist ein Viertel: 80 : 4 = 20 €." },
  { typ: "input", frage: "Berechne 10 % von 250 g.", loesung: ["25"], einheit: "g", platzhalter: "Zahl", erklaerung: "10 % ist ein Zehntel: 250 : 10 = 25 g." },
  { typ: "input", frage: "Von 100 Schülern kommen 37 mit dem Rad. Wie viel Prozent sind das?", loesung: ["37"], einheit: "%", platzhalter: "Zahl", erklaerung: "37 von 100 = 37 %." },
  {
    typ: "mc",
    frage: "Wie viel Prozent sind das Ganze?",
    antworten: ["100 %", "50 %", "10 %", "1 %"],
    richtig: 0,
    erklaerung: "Das Ganze entspricht immer 100 %.",
  },
  {
    typ: "luecke",
    frage: "Wandle um.",
    segmente: ["1/5 = ", { luecke: ["20"] }, " % und 3/10 = ", { luecke: ["30"] }, " %."],
    erklaerung: "1/5 = 20/100 = 20 % und 3/10 = 30/100 = 30 %.",
  },
  {
    typ: "zuordnen",
    frage: "Ordne jedem Bruch die passende Prozentzahl zu.",
    paare: [
      { links: "1/2", rechts: "50 %" },
      { links: "1/4", rechts: "25 %" },
      { links: "1/5", rechts: "20 %" },
      { links: "1/10", rechts: "10 %" },
    ],
    erklaerung: "1/2 = 50 %, 1/4 = 25 %, 1/5 = 20 %, 1/10 = 10 %.",
  },
  {
    typ: "sortieren",
    frage: "Ordne aufsteigend — beginne beim kleinsten Anteil.",
    richtig: ["5 %", "1/4", "0,3", "1/2"],
    erklaerung: "Alles in Prozent: 5 % < 25 % (= 1/4) < 30 % (= 0,3) < 50 % (= 1/2).",
  },
  { typ: "input", frage: "Ein T-Shirt kostet 20 €. Es wird um 10 % billiger. Wie viel Euro sparst du?", loesung: ["2"], einheit: "€", platzhalter: "Zahl", erklaerung: "10 % von 20 € = 20 : 10 = 2 €." },
];

export default PROZENT_MS6;
