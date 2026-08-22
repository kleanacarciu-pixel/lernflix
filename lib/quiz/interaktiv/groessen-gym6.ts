// ============================================================================
// Interaktive Aufgaben — Rechnen mit Größen · Gymnasium Kl. 6 · Bayern
// Längen, Massen, Zeit, Geld, Hohlmaße: umrechnen und rechnen.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const GROESSEN_GYM6: Aufgabe[] = [
  { typ: "input", frage: "3 m sind wie viele Zentimeter?", loesung: ["300"], einheit: "cm", platzhalter: "Zahl", erklaerung: "1 m = 100 cm, also 3 m = 300 cm." },
  { typ: "input", frage: "2,5 km sind wie viele Meter?", loesung: ["2500"], einheit: "m", platzhalter: "Zahl", erklaerung: "1 km = 1000 m, also 2,5 km = 2500 m." },
  { typ: "input", frage: "1500 g sind wie viele Kilogramm?", loesung: ["1,5"], einheit: "kg", platzhalter: "Zahl", erklaerung: "1 kg = 1000 g, also 1500 g = 1,5 kg." },
  { typ: "input", frage: "2 h 15 min sind wie viele Minuten?", loesung: ["135"], einheit: "min", platzhalter: "Zahl", erklaerung: "2 h = 120 min, plus 15 min = 135 min." },
  { typ: "input", frage: "750 ml sind wie viele Liter?", loesung: ["0,75"], einheit: "l", platzhalter: "Zahl", erklaerung: "1 l = 1000 ml, also 750 ml = 0,75 l." },
  {
    typ: "luecke",
    frage: "Vervollständige die Umrechnungen.",
    segmente: ["1 m = ", { luecke: ["100"] }, " cm  und  1 km = ", { luecke: ["1000"] }, " m."],
    erklaerung: "1 m = 100 cm, 1 km = 1000 m.",
  },
  { typ: "input", frage: "3,2 kg + 800 g = wie viele Kilogramm?", loesung: ["4"], einheit: "kg", platzhalter: "Zahl", erklaerung: "800 g = 0,8 kg. 3,2 kg + 0,8 kg = 4 kg." },
  { typ: "input", frage: "1 h − 25 min = wie viele Minuten?", loesung: ["35"], einheit: "min", platzhalter: "Zahl", erklaerung: "1 h = 60 min. 60 min − 25 min = 35 min." },
  {
    typ: "zuordnen",
    frage: "Ordne die gleich großen Größen einander zu.",
    paare: [
      { links: "2 m", rechts: "200 cm" },
      { links: "3 kg", rechts: "3000 g" },
      { links: "5 min", rechts: "300 s" },
      { links: "2 l", rechts: "2000 ml" },
    ],
    erklaerung: "2 m = 200 cm; 3 kg = 3000 g; 5 min = 300 s; 2 l = 2000 ml.",
  },
  { typ: "input", frage: "Ein Seil ist 5 m lang. Du schneidest 120 cm ab. Wie viele Zentimeter bleiben übrig?", loesung: ["380"], einheit: "cm", platzhalter: "Zahl", erklaerung: "5 m = 500 cm. 500 cm − 120 cm = 380 cm." },
  {
    typ: "mc",
    frage: "Welche Länge ist am größten?",
    antworten: ["1,2 m", "900 mm", "50 cm", "1 m"],
    richtig: 0,
    erklaerung: "In Zentimeter: 1,2 m = 120 cm; 900 mm = 90 cm; 50 cm; 1 m = 100 cm. Am größten ist 1,2 m.",
  },
  { typ: "input", frage: "4 t (Tonnen) sind wie viele Kilogramm?", loesung: ["4000"], einheit: "kg", platzhalter: "Zahl", erklaerung: "1 t = 1000 kg, also 4 t = 4000 kg." },
  { typ: "input", frage: "3 Stifte kosten je 1,20 €. Wie viel kosten sie zusammen?", loesung: ["3,60", "3,6"], einheit: "€", platzhalter: "Zahl", erklaerung: "3 · 1,20 € = 3,60 €." },
  { typ: "input", frage: "0,5 h sind wie viele Minuten?", loesung: ["30"], einheit: "min", platzhalter: "Zahl", erklaerung: "1 h = 60 min, also 0,5 h = 30 min." },
  {
    typ: "luecke",
    frage: "Rechne in die größere Einheit um.",
    segmente: ["250 cm = ", { luecke: ["2,5"] }, " m  und  2000 g = ", { luecke: ["2"] }, " kg."],
    erklaerung: "250 cm : 100 = 2,5 m. 2000 g : 1000 = 2 kg.",
  },
];

export default GROESSEN_GYM6;
