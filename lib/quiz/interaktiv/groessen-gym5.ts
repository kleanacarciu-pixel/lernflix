// ============================================================================
// Interaktive Aufgaben — Größen & Einheiten · Gymnasium Kl. 5
// Länge, Masse, Zeit, Geld: umrechnen und mit Größen rechnen.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const GROESSEN_GYM5: Aufgabe[] = [
  { typ: "input", frage: "1 m sind wie viele Zentimeter?", loesung: ["100"], einheit: "cm", platzhalter: "Zahl", erklaerung: "1 m = 100 cm." },
  { typ: "input", frage: "1 km sind wie viele Meter?", loesung: ["1000", "1 000"], einheit: "m", platzhalter: "Zahl", erklaerung: "1 km = 1000 m." },
  { typ: "input", frage: "1 kg sind wie viele Gramm?", loesung: ["1000", "1 000"], einheit: "g", platzhalter: "Zahl", erklaerung: "1 kg = 1000 g." },
  { typ: "input", frage: "1 Stunde sind wie viele Minuten?", loesung: ["60"], einheit: "min", platzhalter: "Zahl", erklaerung: "1 h = 60 min." },
  { typ: "input", frage: "3 m sind wie viele Zentimeter?", loesung: ["300"], einheit: "cm", platzhalter: "Zahl", erklaerung: "3 · 100 cm = 300 cm." },
  { typ: "input", frage: "2 kg sind wie viele Gramm?", loesung: ["2000", "2 000"], einheit: "g", platzhalter: "Zahl", erklaerung: "2 · 1000 g = 2000 g." },
  { typ: "input", frage: "120 Minuten sind wie viele Stunden?", loesung: ["2"], einheit: "h", platzhalter: "Zahl", erklaerung: "120 : 60 = 2 Stunden." },
  { typ: "input", frage: "5 € sind wie viele Cent?", loesung: ["500"], einheit: "Cent", platzhalter: "Zahl", erklaerung: "1 € = 100 Cent, also 5 € = 500 Cent." },
  {
    typ: "luecke",
    frage: "Vervollständige die Umrechnungen.",
    segmente: ["1 m = ", { luecke: ["100"] }, " cm  und  1 kg = ", { luecke: ["1000", "1 000"] }, " g."],
    erklaerung: "1 m = 100 cm, 1 kg = 1000 g.",
  },
  { typ: "input", frage: "250 cm sind wie viele Meter?", loesung: ["2,5"], einheit: "m", platzhalter: "Zahl", erklaerung: "250 : 100 = 2,5 m." },
  {
    typ: "zuordnen",
    frage: "Ordne die gleich großen Größen einander zu.",
    paare: [
      { links: "1 m", rechts: "100 cm" },
      { links: "1 kg", rechts: "1000 g" },
      { links: "1 h", rechts: "60 min" },
      { links: "1 €", rechts: "100 Cent" },
    ],
    erklaerung: "1 m = 100 cm; 1 kg = 1000 g; 1 h = 60 min; 1 € = 100 Cent.",
  },
  { typ: "input", frage: "3 Bretter sind je 80 cm lang. Wie lang sind sie zusammen (in cm)?", loesung: ["240"], einheit: "cm", platzhalter: "Zahl", erklaerung: "3 · 80 cm = 240 cm." },
  {
    typ: "mc",
    frage: "Welche Angabe passt am besten zur Masse eines Apfels?",
    antworten: ["150 g", "150 kg", "150 cm", "150 l"],
    richtig: 0,
    erklaerung: "Ein Apfel wiegt etwa 150 g. kg wäre viel zu schwer, cm und l sind keine Masse.",
  },
  { typ: "input", frage: "1 t (Tonne) sind wie viele Kilogramm?", loesung: ["1000", "1 000"], einheit: "kg", platzhalter: "Zahl", erklaerung: "1 t = 1000 kg." },
  { typ: "input", frage: "1,5 h sind wie viele Minuten?", loesung: ["90"], einheit: "min", platzhalter: "Zahl", erklaerung: "1 h = 60 min, dazu die halbe Stunde 30 min: 60 + 30 = 90 min." },
];

export default GROESSEN_GYM5;
