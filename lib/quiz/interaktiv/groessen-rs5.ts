// ============================================================================
// Interaktive Aufgaben — Größen & Einheiten · Realschule Kl. 5 · Bayern
// Länge, Masse, Zeit, Geld: umrechnen und rechnen.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const GROESSEN_RS5: Aufgabe[] = [
  { typ: "input", frage: "1 m sind wie viele Zentimeter?", loesung: ["100"], einheit: "cm", platzhalter: "Zahl", erklaerung: "1 m = 100 cm." },
  { typ: "input", frage: "2 km sind wie viele Meter?", loesung: ["2000", "2 000"], einheit: "m", platzhalter: "Zahl", erklaerung: "1 km = 1000 m, also 2 km = 2000 m." },
  { typ: "input", frage: "3 kg sind wie viele Gramm?", loesung: ["3000", "3 000"], einheit: "g", platzhalter: "Zahl", erklaerung: "1 kg = 1000 g, also 3 kg = 3000 g." },
  { typ: "input", frage: "2 Stunden sind wie viele Minuten?", loesung: ["120"], einheit: "min", platzhalter: "Zahl", erklaerung: "2 · 60 min = 120 min." },
  { typ: "input", frage: "4 € sind wie viele Cent?", loesung: ["400"], einheit: "Cent", platzhalter: "Zahl", erklaerung: "1 € = 100 Cent, also 4 € = 400 Cent." },
  {
    typ: "luecke",
    frage: "Vervollständige die Umrechnungen.",
    segmente: ["1 km = ", { luecke: ["1000", "1 000"] }, " m  und  1 t = ", { luecke: ["1000", "1 000"] }, " kg."],
    erklaerung: "1 km = 1000 m und 1 t = 1000 kg.",
  },
  { typ: "input", frage: "350 cm sind wie viele Meter?", loesung: ["3,5"], einheit: "m", platzhalter: "Zahl", erklaerung: "350 : 100 = 3,5 m." },
  { typ: "input", frage: "1 500 g sind wie viele Kilogramm?", loesung: ["1,5"], einheit: "kg", platzhalter: "Zahl", erklaerung: "1500 : 1000 = 1,5 kg." },
  {
    typ: "zuordnen",
    frage: "Ordne die gleich großen Größen einander zu.",
    paare: [
      { links: "5 m", rechts: "500 cm" },
      { links: "2 min", rechts: "120 s" },
      { links: "4 kg", rechts: "4000 g" },
      { links: "3 €", rechts: "300 Cent" },
    ],
    erklaerung: "5 m = 500 cm; 2 min = 120 s; 4 kg = 4000 g; 3 € = 300 Cent.",
  },
  { typ: "input", frage: "90 Minuten sind wie viele Stunden?", loesung: ["1,5"], einheit: "h", platzhalter: "Zahl", erklaerung: "90 : 60 = 1,5 Stunden." },
  { typ: "input", frage: "Ein Brett ist 2 m lang. Du sägst 45 cm ab. Wie viele Zentimeter bleiben übrig?", loesung: ["155"], einheit: "cm", platzhalter: "Zahl", erklaerung: "2 m = 200 cm. 200 − 45 = 155 cm." },
  {
    typ: "mc",
    frage: "Welche Angabe passt am besten zur Masse eines vollen Schulranzens?",
    antworten: ["5 kg", "5 g", "50 kg", "500 kg"],
    richtig: 0,
    erklaerung: "Ein voller Schulranzen wiegt etwa 5 kg. 5 g wäre federleicht, 50 kg viel zu schwer.",
  },
  { typ: "input", frage: "2,5 kg sind wie viele Gramm?", loesung: ["2500", "2 500"], einheit: "g", platzhalter: "Zahl", erklaerung: "2,5 · 1000 = 2500 g." },
  { typ: "input", frage: "0,5 km sind wie viele Meter?", loesung: ["500"], einheit: "m", platzhalter: "Zahl", erklaerung: "0,5 · 1000 = 500 m." },
  { typ: "input", frage: "3 h 20 min sind wie viele Minuten?", loesung: ["200"], einheit: "min", platzhalter: "Zahl", erklaerung: "3 h = 180 min, plus 20 min = 200 min." },
];

export default GROESSEN_RS5;
