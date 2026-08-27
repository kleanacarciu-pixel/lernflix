// ============================================================================
// Interaktive Aufgaben — Dreisatz · Mittelschule Kl. 7 · Bayern
// Proportionaler Dreisatz mit Alltagsbezug (Einkauf, Rezepte, Wege, Lohn).
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const DREISATZ_MS7: Aufgabe[] = [
  { typ: "input", frage: "3 Brezen kosten 1,80 €. Wie viel kostet 1 Breze? (Als Kommazahl.)", loesung: ["0,60", "0,6"], einheit: "€", platzhalter: "z. B. 0,60", erklaerung: "1,80 € : 3 = 0,60 €." },
  { typ: "input", frage: "3 Brezen kosten 1,80 €. Wie viel kosten 5 Brezen? (Als Kommazahl.)", loesung: ["3,00", "3"], einheit: "€", platzhalter: "z. B. 3,00", erklaerung: "1 Breze: 1,80 : 3 = 0,60 €. 5 Brezen: 5 · 0,60 = 3,00 €." },
  { typ: "input", frage: "4 kg Äpfel kosten 8 €. Wie viel kosten 7 kg?", loesung: ["14"], einheit: "€", platzhalter: "Zahl", erklaerung: "1 kg: 8 : 4 = 2 €. 7 kg: 7 · 2 = 14 €." },
  { typ: "input", frage: "Ein Auto fährt in 2 Stunden 160 km. Wie weit kommt es in 5 Stunden (gleiches Tempo)?", loesung: ["400"], einheit: "km", platzhalter: "Zahl", erklaerung: "In 1 Stunde: 160 : 2 = 80 km. In 5 Stunden: 5 · 80 = 400 km." },
  { typ: "input", frage: "Für 6 Muffins braucht man 300 g Mehl. Wie viel Gramm braucht man für 10 Muffins?", loesung: ["500"], einheit: "g", platzhalter: "Zahl", erklaerung: "Für 1 Muffin: 300 : 6 = 50 g. Für 10: 10 · 50 = 500 g." },
  { typ: "input", frage: "5 Hefte kosten 4 €. Wie viel kosten 15 Hefte?", loesung: ["12"], einheit: "€", platzhalter: "Zahl", erklaerung: "15 Hefte sind 3-mal so viele wie 5: 3 · 4 = 12 €." },
  {
    typ: "mc",
    frage: "Bei welcher Zuordnung hilft der proportionale Dreisatz?",
    antworten: ["Je mehr Kilogramm, desto höher der Preis", "Je mehr Arbeiter, desto kürzer die Bauzeit", "Je älter das Auto, desto niedriger der Preis", "Je größer die Schuhgröße, desto besser die Note"],
    richtig: 0,
    erklaerung: "Proportional heißt: doppelte Menge → doppelter Preis. Das gilt für Kilogramm und Preis.",
  },
  {
    typ: "luecke",
    frage: "2 kg Kartoffeln kosten 3 €.",
    segmente: ["1 kg kostet ", { luecke: ["1,50", "1,5"] }, " €, also kosten 6 kg ", { luecke: ["9", "9,00"] }, " €."],
    erklaerung: "3 € : 2 = 1,50 €. 6 · 1,50 € = 9 €.",
  },
  {
    typ: "mc",
    frage: "Wie geht man beim Dreisatz vor?",
    antworten: ["Erst auf 1 Einheit zurückrechnen (geteilt), dann auf die gesuchte Menge (mal)", "Immer beide Zahlen addieren", "Immer beide Zahlen multiplizieren", "Die größere durch die kleinere Zahl teilen — fertig"],
    richtig: 0,
    erklaerung: "Der klassische Dreisatz: durch Teilen auf die Einheit, durch Malnehmen auf die gesuchte Menge.",
  },
  { typ: "input", frage: "Timo bekommt für 4 Stunden Arbeit 48 €. Wie viel bekommt er für 7 Stunden?", loesung: ["84"], einheit: "€", platzhalter: "Zahl", erklaerung: "1 Stunde: 48 : 4 = 12 €. 7 Stunden: 7 · 12 = 84 €." },
  { typ: "input", frage: "Ein Drucker druckt 90 Seiten in 3 Minuten. Wie viele Seiten druckt er in 8 Minuten?", loesung: ["240"], platzhalter: "Zahl", erklaerung: "Pro Minute: 90 : 3 = 30 Seiten. In 8 Minuten: 8 · 30 = 240 Seiten." },
  { typ: "input", frage: "8 gleiche Flaschen enthalten zusammen 6 Liter. Wie viele Liter enthalten 4 Flaschen?", loesung: ["3"], einheit: "l", platzhalter: "Zahl", erklaerung: "4 Flaschen sind die Hälfte von 8: 6 : 2 = 3 Liter." },
  {
    typ: "zuordnen",
    frage: "1 kg Tomaten kostet 4 €. Ordne jeder Menge den Preis zu.",
    paare: [
      { links: "0,5 kg", rechts: "2 €" },
      { links: "2 kg", rechts: "8 €" },
      { links: "3 kg", rechts: "12 €" },
      { links: "5 kg", rechts: "20 €" },
    ],
    erklaerung: "Menge mal 4 €: 0,5 · 4 = 2 €; 2 · 4 = 8 €; 3 · 4 = 12 €; 5 · 4 = 20 €.",
  },
  {
    typ: "sortieren",
    frage: "Vergleiche, wie viele Kisten pro Stunde geschafft werden. Ordne aufsteigend — beginne beim langsamsten: Anna packt 60 Kisten in 2 h, Ben packt 120 Kisten in 3 h, Carla packt 50 Kisten in 1 h, David packt 80 Kisten in 4 h",
    richtig: ["David packt 80 Kisten in 4 h", "Anna packt 60 Kisten in 2 h", "Ben packt 120 Kisten in 3 h", "Carla packt 50 Kisten in 1 h"],
    erklaerung: "Pro Stunde: David 80 : 4 = 20, Anna 60 : 2 = 30, Ben 120 : 3 = 40, Carla 50 : 1 = 50 Kisten.",
  },
  { typ: "input", frage: "250 g Käse kosten 5 €. Wie viel kosten 750 g?", loesung: ["15"], einheit: "€", platzhalter: "Zahl", erklaerung: "750 g sind 3-mal so viel wie 250 g: 3 · 5 = 15 €." },
];

export default DREISATZ_MS7;
