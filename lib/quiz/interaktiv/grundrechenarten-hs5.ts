// ============================================================================
// Interaktive Aufgaben — Grundrechenarten · Hauptschule Kl. 5 · Bayern
// Plus, Minus, Mal, Geteilt — Kopfrechnen und einfache Sachaufgaben.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const GRUNDRECHENARTEN_HS5: Aufgabe[] = [
  { typ: "input", frage: "Berechne: 236 + 145", loesung: ["381"], platzhalter: "Zahl", erklaerung: "236 + 145 = 381 (6+5=11, Übertrag; 3+4+1=8; 2+1=3)." },
  { typ: "input", frage: "Berechne: 512 − 138", loesung: ["374"], platzhalter: "Zahl", erklaerung: "512 − 138 = 374. Probe: 374 + 138 = 512." },
  { typ: "input", frage: "Berechne: 17 · 3", loesung: ["51"], platzhalter: "Zahl", erklaerung: "17 · 3 = 10 · 3 + 7 · 3 = 30 + 21 = 51." },
  { typ: "input", frage: "Berechne: 84 : 4", loesung: ["21"], platzhalter: "Zahl", erklaerung: "84 : 4 = 21, denn 21 · 4 = 84." },
  { typ: "input", frage: "Berechne: 6 · 9", loesung: ["54"], platzhalter: "Zahl", erklaerung: "6 · 9 = 54 (Einmaleins)." },
  { typ: "input", frage: "Berechne: 63 : 7", loesung: ["9"], platzhalter: "Zahl", erklaerung: "9 · 7 = 63, also 63 : 7 = 9." },
  { typ: "input", frage: "Berechne: 4 + 2 · 6", loesung: ["16"], platzhalter: "Zahl", erklaerung: "Punkt vor Strich: erst 2 · 6 = 12, dann 4 + 12 = 16." },
  {
    typ: "mc",
    frage: "Wie heißt das Ergebnis einer Multiplikation?",
    antworten: ["Produkt", "Summe", "Differenz", "Quotient"],
    richtig: 0,
    erklaerung: "Mal-Rechnen → Produkt. (Plus → Summe, Minus → Differenz, Geteilt → Quotient.)",
  },
  {
    typ: "mc",
    frage: "Welche Rechnung ist richtig?",
    antworten: ["10 − 2 · 3 = 4", "10 − 2 · 3 = 24", "10 − 2 · 3 = 30", "10 − 2 · 3 = 16"],
    richtig: 0,
    erklaerung: "Punkt vor Strich: 2 · 3 = 6, dann 10 − 6 = 4.",
  },
  {
    typ: "luecke",
    frage: "Rechne im Kopf.",
    segmente: ["8 · 7 = ", { luecke: ["56"] }, " und 45 : 9 = ", { luecke: ["5"] }, "."],
    erklaerung: "8 · 7 = 56 und 45 : 9 = 5 (denn 5 · 9 = 45).",
  },
  {
    typ: "zuordnen",
    frage: "Ordne jeder Rechnung ihr Ergebnis zu.",
    paare: [
      { links: "25 + 25", rechts: "50" },
      { links: "100 − 40", rechts: "60" },
      { links: "9 · 8", rechts: "72" },
      { links: "90 : 3", rechts: "30" },
    ],
    erklaerung: "25 + 25 = 50; 100 − 40 = 60; 9 · 8 = 72; 90 : 3 = 30.",
  },
  { typ: "input", frage: "Ein Eis kostet 2 €. Du kaufst 3 Eis und bezahlst mit einem 10-€-Schein. Wie viel Euro bekommst du zurück?", loesung: ["4"], einheit: "€", platzhalter: "Zahl", erklaerung: "3 · 2 € = 6 €. Rückgeld: 10 € − 6 € = 4 €." },
  { typ: "input", frage: "In eine Schulklasse passen 28 Kinder. Wie viele Kinder passen in 3 solche Klassen?", loesung: ["84"], platzhalter: "Zahl", erklaerung: "3 · 28 = 84 Kinder." },
  { typ: "input", frage: "40 Äpfel werden gerecht auf 8 Kinder verteilt. Wie viele Äpfel bekommt jedes Kind?", loesung: ["5"], platzhalter: "Zahl", erklaerung: "40 : 8 = 5 Äpfel." },
  {
    typ: "sortieren",
    frage: "Ordne die Ergebnisse aufsteigend — beginne beim kleinsten: 7 · 4, 60 : 2, 15 + 12, 50 − 24",
    richtig: ["50 − 24", "15 + 12", "7 · 4", "60 : 2"],
    erklaerung: "50 − 24 = 26, 15 + 12 = 27, 7 · 4 = 28, 60 : 2 = 30.",
  },
];

export default GRUNDRECHENARTEN_HS5;
