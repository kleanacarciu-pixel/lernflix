// ============================================================================
// Interaktive Aufgaben — Grundrechenarten · Mittelschule Kl. 5 · Bayern
// Kopfrechnen, schriftliche Verfahren, Fachbegriffe, Punkt vor Strich, Sachaufgaben.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const GRUNDRECHENARTEN_MS5: Aufgabe[] = [
  { typ: "input", frage: "Berechne: 347 + 258", loesung: ["605"], platzhalter: "Zahl", erklaerung: "347 + 258 = 605 (7+8=15, Übertrag; 4+5+1=10, Übertrag; 3+2+1=6)." },
  { typ: "input", frage: "Berechne: 703 − 458", loesung: ["245"], platzhalter: "Zahl", erklaerung: "703 − 458 = 245. Probe: 245 + 458 = 703." },
  { typ: "input", frage: "Berechne: 26 · 4", loesung: ["104"], platzhalter: "Zahl", erklaerung: "26 · 4 = 20 · 4 + 6 · 4 = 80 + 24 = 104." },
  { typ: "input", frage: "Berechne: 132 : 6", loesung: ["22"], platzhalter: "Zahl", erklaerung: "132 : 6 = 22, denn 22 · 6 = 132." },
  {
    typ: "mc",
    frage: "Wie heißt das Ergebnis einer Addition?",
    antworten: ["Summe", "Differenz", "Produkt", "Quotient"],
    richtig: 0,
    erklaerung: "Addition → Summe, Subtraktion → Differenz, Multiplikation → Produkt, Division → Quotient.",
  },
  {
    typ: "zuordnen",
    frage: "Ordne jeder Rechenart den Namen ihres Ergebnisses zu.",
    paare: [
      { links: "Addition", rechts: "Summe" },
      { links: "Subtraktion", rechts: "Differenz" },
      { links: "Multiplikation", rechts: "Produkt" },
      { links: "Division", rechts: "Quotient" },
    ],
    erklaerung: "Plus → Summe, Minus → Differenz, Mal → Produkt, Geteilt → Quotient.",
  },
  { typ: "input", frage: "Berechne: 5 + 3 · 4", loesung: ["17"], platzhalter: "Zahl", erklaerung: "Punkt vor Strich: erst 3 · 4 = 12, dann 5 + 12 = 17." },
  { typ: "input", frage: "Berechne: (5 + 3) · 4", loesung: ["32"], platzhalter: "Zahl", erklaerung: "Klammer zuerst: 5 + 3 = 8, dann 8 · 4 = 32." },
  { typ: "input", frage: "Berechne: 20 − 12 : 4", loesung: ["17"], platzhalter: "Zahl", erklaerung: "Punkt vor Strich: erst 12 : 4 = 3, dann 20 − 3 = 17." },
  {
    typ: "mc",
    frage: "Welche Rechnung ist richtig gelöst?",
    antworten: ["8 + 2 · 5 = 18", "8 + 2 · 5 = 50", "8 + 2 · 5 = 80", "8 + 2 · 5 = 25"],
    richtig: 0,
    erklaerung: "Punkt vor Strich: 2 · 5 = 10, dann 8 + 10 = 18.",
  },
  {
    typ: "luecke",
    frage: "Rechne im Kopf.",
    segmente: ["7 · 8 = ", { luecke: ["56"] }, " und 72 : 9 = ", { luecke: ["8"] }, "."],
    erklaerung: "7 · 8 = 56 und 72 : 9 = 8 (denn 8 · 9 = 72).",
  },
  { typ: "input", frage: "Ein Heft kostet 2 €. Lisa kauft 6 Hefte und bezahlt mit einem 20-€-Schein. Wie viel Euro bekommt sie zurück?", loesung: ["8", "8,00"], einheit: "€", platzhalter: "Zahl", erklaerung: "6 · 2 € = 12 €. Rückgeld: 20 € − 12 € = 8 €." },
  { typ: "input", frage: "In einen Bus passen 45 Personen. Wie viele Personen passen in 3 solche Busse?", loesung: ["135"], platzhalter: "Zahl", erklaerung: "3 · 45 = 135 Personen." },
  { typ: "input", frage: "96 Schüler werden in Gruppen zu je 8 aufgeteilt. Wie viele Gruppen entstehen?", loesung: ["12"], platzhalter: "Zahl", erklaerung: "96 : 8 = 12 Gruppen." },
  {
    typ: "sortieren",
    frage: "Ordne die Ergebnisse aufsteigend — beginne beim kleinsten: 6 · 7, 50 − 12, 90 : 2, 19 + 22",
    richtig: ["50 − 12", "19 + 22", "6 · 7", "90 : 2"],
    erklaerung: "50 − 12 = 38, 19 + 22 = 41, 6 · 7 = 42, 90 : 2 = 45. Also 38 < 41 < 42 < 45.",
  },
];

export default GRUNDRECHENARTEN_MS5;
