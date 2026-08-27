// ============================================================================
// Interaktive Aufgaben — Größen & Einheiten · Mittelschule Kl. 5 · Bayern
// Länge, Masse, Zeit, Geld: umrechnen, vergleichen, Sachaufgaben aus dem Alltag.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const GROESSEN_MS5: Aufgabe[] = [
  { typ: "input", frage: "Wie viele Zentimeter sind 3 m?", loesung: ["300"], einheit: "cm", platzhalter: "Zahl", erklaerung: "1 m = 100 cm, also 3 m = 300 cm." },
  { typ: "input", frage: "Wie viele Meter sind 5 km?", loesung: ["5000", "5 000"], einheit: "m", platzhalter: "Zahl", erklaerung: "1 km = 1 000 m, also 5 km = 5 000 m." },
  { typ: "input", frage: "Wie viele Millimeter sind 7 cm?", loesung: ["70"], einheit: "mm", platzhalter: "Zahl", erklaerung: "1 cm = 10 mm, also 7 cm = 70 mm." },
  { typ: "input", frage: "Wie viele Gramm sind 2 kg?", loesung: ["2000", "2 000"], einheit: "g", platzhalter: "Zahl", erklaerung: "1 kg = 1 000 g, also 2 kg = 2 000 g." },
  { typ: "input", frage: "Wie viele Kilogramm sind 4 t?", loesung: ["4000", "4 000"], einheit: "kg", platzhalter: "Zahl", erklaerung: "1 t = 1 000 kg, also 4 t = 4 000 kg." },
  { typ: "input", frage: "Wie viele Minuten sind 2 Stunden?", loesung: ["120"], einheit: "min", platzhalter: "Zahl", erklaerung: "1 h = 60 min, also 2 h = 120 min." },
  { typ: "input", frage: "Wie viele Sekunden sind 3 Minuten?", loesung: ["180"], einheit: "s", platzhalter: "Zahl", erklaerung: "1 min = 60 s, also 3 min = 180 s." },
  {
    typ: "mc",
    frage: "Welche Einheit passt am besten zur Masse eines Apfels?",
    antworten: ["Gramm", "Tonne", "Kilometer", "Liter"],
    richtig: 0,
    erklaerung: "Ein Apfel wiegt ungefähr 150 bis 200 Gramm.",
  },
  {
    typ: "mc",
    frage: "Welche Länge ist am größten?",
    antworten: ["2 km", "1 900 m", "20 000 cm", "1 500 m"],
    richtig: 0,
    erklaerung: "Alles in Meter: 2 km = 2 000 m, 20 000 cm = 200 m. Vergleich: 2 000 m > 1 900 m > 1 500 m > 200 m — also ist 2 km am größten.",
  },
  {
    typ: "luecke",
    frage: "Ergänze die Umrechnungszahlen.",
    segmente: ["1 km = ", { luecke: ["1000", "1 000"] }, " m und 1 m = ", { luecke: ["100"] }, " cm."],
    erklaerung: "1 km = 1 000 m, 1 m = 100 cm.",
  },
  {
    typ: "zuordnen",
    frage: "Ordne jeder Größe die passende Einheit zu.",
    paare: [
      { links: "Länge", rechts: "Meter" },
      { links: "Masse", rechts: "Kilogramm" },
      { links: "Zeit", rechts: "Sekunde" },
      { links: "Geld", rechts: "Euro" },
    ],
    erklaerung: "Länge in Metern, Masse in Kilogramm, Zeit in Sekunden, Geld in Euro.",
  },
  { typ: "input", frage: "Ein Brot kostet 2,50 €. Du bezahlst mit 5 €. Wie viel Euro bekommst du zurück? (Als Kommazahl.)", loesung: ["2,50", "2,5"], einheit: "€", platzhalter: "z. B. 2,50", erklaerung: "5 € − 2,50 € = 2,50 €." },
  { typ: "input", frage: "Der Unterricht beginnt um 8:00 Uhr und dauert 45 Minuten. Wann endet die Stunde? (Format h:mm)", loesung: ["8:45", "08:45"], einheit: "Uhr", platzhalter: "z. B. 8:45", erklaerung: "8:00 Uhr + 45 min = 8:45 Uhr." },
  {
    typ: "sortieren",
    frage: "Ordne die Längen aufsteigend — beginne bei der kürzesten: 5 m, 45 cm, 2 km, 300 cm",
    richtig: ["45 cm", "300 cm", "5 m", "2 km"],
    erklaerung: "45 cm < 300 cm (= 3 m) < 5 m < 2 km (= 2 000 m).",
  },
  { typ: "input", frage: "Eine Packung Mehl wiegt 500 g. Wie viele Kilogramm wiegen 4 Packungen?", loesung: ["2", "2,0"], einheit: "kg", platzhalter: "Zahl", erklaerung: "4 · 500 g = 2 000 g = 2 kg." },
];

export default GROESSEN_MS5;
