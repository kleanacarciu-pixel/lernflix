// ============================================================================
// Interaktive Aufgaben — Größen umrechnen · Grundschule Kl. 4 · Bayern
// km/m/cm/mm, kg/g, Euro/Cent, Stunden/Minuten sicher umrechnen.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const UMRECHNEN_GS4: Aufgabe[] = [
  { typ: "input", frage: "Wie viele Meter sind 3 km?", loesung: ["3000", "3 000"], einheit: "m", platzhalter: "Zahl", erklaerung: "3 · 1 000 = 3 000 m." },
  { typ: "input", frage: "Wie viele Millimeter sind 6 cm?", loesung: ["60"], einheit: "mm", platzhalter: "Zahl", erklaerung: "6 · 10 = 60 mm." },
  { typ: "input", frage: "Wie viele Zentimeter sind 2 m und 45 cm zusammen?", loesung: ["245"], einheit: "cm", platzhalter: "Zahl", erklaerung: "200 + 45 = 245 cm." },
  { typ: "input", frage: "Wie viele Gramm sind 2,5 kg?", loesung: ["2500", "2 500"], einheit: "g", platzhalter: "Zahl", erklaerung: "2,5 · 1 000 = 2 500 g." },
  { typ: "input", frage: "Wie viele Kilogramm sind 4 000 g?", loesung: ["4"], einheit: "kg", platzhalter: "Zahl", erklaerung: "4 000 : 1 000 = 4 kg." },
  { typ: "input", frage: "Wie viele Cent sind 3,50 €?", loesung: ["350"], einheit: "ct", platzhalter: "Zahl", erklaerung: "3,50 € = 3 · 100 + 50 = 350 Cent." },
  { typ: "input", frage: "Wie viele Minuten sind 3 Stunden?", loesung: ["180"], einheit: "min", platzhalter: "Zahl", erklaerung: "3 · 60 = 180 min." },
  { typ: "input", frage: "Wie viele Meter sind 1,5 km?", loesung: ["1500", "1 500"], einheit: "m", platzhalter: "Zahl", erklaerung: "1,5 · 1 000 = 1 500 m." },
  {
    typ: "mc",
    frage: "Welche Umrechnung stimmt?",
    antworten: ["1 km = 1 000 m", "1 m = 10 cm", "1 kg = 100 g", "1 € = 10 Cent"],
    richtig: 0,
    erklaerung: "1 km = 1 000 m stimmt. (1 m = 100 cm, 1 kg = 1 000 g, 1 € = 100 Cent.)",
  },
  {
    typ: "mc",
    frage: "Was ist länger: 1 500 m oder 2 km?",
    antworten: ["2 km", "1 500 m", "beides gleich", "das weiß man nicht"],
    richtig: 0,
    erklaerung: "2 km = 2 000 m > 1 500 m.",
  },
  {
    typ: "luecke",
    frage: "Umrechnen.",
    segmente: ["5 m = ", { luecke: ["500"] }, " cm und 7 000 g = ", { luecke: ["7"] }, " kg."],
    erklaerung: "5 · 100 = 500 cm. 7 000 : 1 000 = 7 kg.",
  },
  {
    typ: "zuordnen",
    frage: "Ordne die gleichen Längen zu.",
    paare: [
      { links: "1 km", rechts: "1 000 m" },
      { links: "1 m", rechts: "100 cm" },
      { links: "1 cm", rechts: "10 mm" },
      { links: "einhalb km", rechts: "500 m" },
    ],
    erklaerung: "1 km = 1 000 m; 1 m = 100 cm; 1 cm = 10 mm; ein halber km = 500 m.",
  },
  { typ: "input", frage: "Ein Läufer schafft 2 500 m. Wie viele Kilometer sind das? (Als Kommazahl.)", loesung: ["2,5"], einheit: "km", platzhalter: "z. B. 2,5", erklaerung: "2 500 : 1 000 = 2,5 km." },
  { typ: "input", frage: "Ein Paket wiegt 1 kg und 250 g. Wie viele Gramm sind das zusammen?", loesung: ["1250", "1 250"], einheit: "g", platzhalter: "Zahl", erklaerung: "1 000 + 250 = 1 250 g." },
  {
    typ: "sortieren",
    frage: "Ordne von kurz nach lang: 2 km, 250 cm, 30 m, 1 800 m",
    richtig: ["250 cm", "30 m", "1 800 m", "2 km"],
    erklaerung: "250 cm (= 2,5 m) < 30 m < 1 800 m < 2 000 m (= 2 km).",
  },
];

export default UMRECHNEN_GS4;
