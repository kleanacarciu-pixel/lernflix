// ============================================================================
// Interaktive Aufgaben — Prozent: Grundlagen · Realschule Kl. 6 · Bayern
// Prozentbegriff, einfache Prozentwerte, Umwandlungen. Lösungen geprüft.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const PROZENT_RS6: Aufgabe[] = [
  { typ: "input", frage: "Berechne 50 % von 60.", loesung: ["30"], platzhalter: "Zahl", erklaerung: "50 % ist die Hälfte: 60 : 2 = 30." },
  { typ: "input", frage: "Berechne 25 % von 80.", loesung: ["20"], platzhalter: "Zahl", erklaerung: "25 % ist ein Viertel: 80 : 4 = 20." },
  { typ: "input", frage: "Berechne 10 % von 340.", loesung: ["34"], platzhalter: "Zahl", erklaerung: "10 % ist ein Zehntel: 340 : 10 = 34." },
  { typ: "input", frage: "Berechne 1 % von 500.", loesung: ["5"], platzhalter: "Zahl", erklaerung: "1 % ist ein Hundertstel: 500 : 100 = 5." },
  { typ: "input", frage: "Wie viel Prozent sind 1/2?", loesung: ["50"], einheit: "%", platzhalter: "Zahl", erklaerung: "1/2 = 50/100 = 50 %." },
  { typ: "input", frage: "Schreibe 0,3 als Prozent.", loesung: ["30"], einheit: "%", platzhalter: "Zahl", erklaerung: "0,3 = 30/100 = 30 %." },
  { typ: "input", frage: "Wie viel Prozent sind 12 von 50?", loesung: ["24"], einheit: "%", platzhalter: "Zahl", erklaerung: "12 : 50 = 0,24 = 24 %." },
  {
    typ: "zuordnen",
    frage: "Ordne jedem Bruch den passenden Prozentsatz zu.",
    paare: [
      { links: "1/2", rechts: "50 %" },
      { links: "1/4", rechts: "25 %" },
      { links: "3/4", rechts: "75 %" },
      { links: "1/10", rechts: "10 %" },
    ],
    erklaerung: "1/2 = 50 %; 1/4 = 25 %; 3/4 = 75 %; 1/10 = 10 %.",
  },
  { typ: "input", frage: "Berechne 20 % von 45.", loesung: ["9"], platzhalter: "Zahl", erklaerung: "10 % von 45 sind 4,5, also 20 % = 9." },
  {
    typ: "luecke",
    frage: "Rechne mit dem 10-Prozent-Trick.",
    segmente: ["10 % von 120 sind ", { luecke: ["12"] }, " und 5 % von 120 sind ", { luecke: ["6"] }, "."],
    erklaerung: "10 % = 120 : 10 = 12. 5 % ist die Hälfte davon: 6.",
  },
  { typ: "input", frage: "Berechne 75 % von 8.", loesung: ["6"], platzhalter: "Zahl", erklaerung: "25 % von 8 sind 2, also 75 % = 3 · 2 = 6." },
  {
    typ: "mc",
    frage: "Wie viel sind 100 % von 33?",
    antworten: ["33", "100", "66", "3,3"],
    richtig: 0,
    erklaerung: "100 % ist das Ganze, also 33.",
  },
  { typ: "input", frage: "In einer Klasse mit 25 Schülern fehlen 5. Wie viel Prozent fehlen?", loesung: ["20"], einheit: "%", platzhalter: "Zahl", erklaerung: "5 : 25 = 0,2 = 20 %." },
  { typ: "input", frage: "Schreibe 30 % als vollständig gekürzten Bruch.", loesung: ["3/10"], platzhalter: "z. B. 3/10", erklaerung: "30 % = 30/100 = 3/10." },
  { typ: "input", frage: "Berechne 5 % von 200.", loesung: ["10"], platzhalter: "Zahl", erklaerung: "1 % von 200 sind 2, also 5 % = 10." },
];

export default PROZENT_RS6;
