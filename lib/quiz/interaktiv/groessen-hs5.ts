// ============================================================================
// Interaktive Aufgaben — Größen & Einheiten · Hauptschule Kl. 5 · Bayern
// Länge, Masse, Zeit, Geld — umrechnen und im Alltag anwenden.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const GROESSEN_HS5: Aufgabe[] = [
  { typ: "input", frage: "Wie viele Zentimeter sind 2 m?", loesung: ["200"], einheit: "cm", platzhalter: "Zahl", erklaerung: "1 m = 100 cm, also 2 m = 200 cm." },
  { typ: "input", frage: "Wie viele Meter sind 3 km?", loesung: ["3000", "3 000"], einheit: "m", platzhalter: "Zahl", erklaerung: "1 km = 1 000 m, also 3 km = 3 000 m." },
  { typ: "input", frage: "Wie viele Millimeter sind 4 cm?", loesung: ["40"], einheit: "mm", platzhalter: "Zahl", erklaerung: "1 cm = 10 mm, also 4 cm = 40 mm." },
  { typ: "input", frage: "Wie viele Gramm sind 3 kg?", loesung: ["3000", "3 000"], einheit: "g", platzhalter: "Zahl", erklaerung: "1 kg = 1 000 g, also 3 kg = 3 000 g." },
  { typ: "input", frage: "Wie viele Minuten sind 1 Stunde und 30 Minuten?", loesung: ["90"], einheit: "min", platzhalter: "Zahl", erklaerung: "60 min + 30 min = 90 min." },
  { typ: "input", frage: "Wie viele Cent sind 3 €?", loesung: ["300"], einheit: "ct", platzhalter: "Zahl", erklaerung: "1 € = 100 Cent, also 3 € = 300 Cent." },
  {
    typ: "mc",
    frage: "Welche Einheit passt am besten zur Länge eines Klassenzimmers?",
    antworten: ["Meter", "Kilometer", "Millimeter", "Kilogramm"],
    richtig: 0,
    erklaerung: "Ein Klassenzimmer ist ungefähr 8 bis 10 Meter lang.",
  },
  {
    typ: "mc",
    frage: "Was ist schwerer: 1 kg Federn oder 1 kg Steine?",
    antworten: ["beides gleich schwer", "die Steine", "die Federn", "das kann man nicht wissen"],
    richtig: 0,
    erklaerung: "1 kg ist 1 kg — die Masse ist gleich, nur das Volumen ist verschieden.",
  },
  {
    typ: "luecke",
    frage: "Ergänze die Umrechnungszahlen.",
    segmente: ["1 m = ", { luecke: ["100"] }, " cm und 1 kg = ", { luecke: ["1000", "1 000"] }, " g."],
    erklaerung: "1 m = 100 cm und 1 kg = 1 000 g.",
  },
  {
    typ: "zuordnen",
    frage: "Ordne jedem Gegenstand die passende Größe zu.",
    paare: [
      { links: "Tafel Schokolade", rechts: "100 g" },
      { links: "Schulweg", rechts: "2 km" },
      { links: "Bleistift", rechts: "18 cm" },
      { links: "Pausenbrot-Zeit", rechts: "15 min" },
    ],
    erklaerung: "Schokolade ≈ 100 g, Schulweg ≈ 2 km, Bleistift ≈ 18 cm, Pause ≈ 15 min.",
  },
  { typ: "input", frage: "Ein Comic kostet 3,50 €. Du bezahlst mit 5 €. Wie viel Euro bekommst du zurück? (Als Kommazahl.)", loesung: ["1,50", "1,5"], einheit: "€", platzhalter: "z. B. 1,50", erklaerung: "5,00 € − 3,50 € = 1,50 €." },
  { typ: "input", frage: "Der Film beginnt um 15:00 Uhr und dauert 2 Stunden. Wann ist er zu Ende? (Format h:mm)", loesung: ["17:00", "17"], einheit: "Uhr", platzhalter: "z. B. 17:00", erklaerung: "15:00 Uhr + 2 h = 17:00 Uhr." },
  { typ: "input", frage: "Eine Flasche enthält 500 ml Saft. Wie viele Milliliter enthalten 2 Flaschen?", loesung: ["1000", "1 000"], einheit: "ml", platzhalter: "Zahl", erklaerung: "2 · 500 ml = 1 000 ml (= 1 Liter)." },
  {
    typ: "sortieren",
    frage: "Ordne die Längen aufsteigend — beginne bei der kürzesten: 3 m, 25 cm, 1 km, 80 cm",
    richtig: ["25 cm", "80 cm", "3 m", "1 km"],
    erklaerung: "25 cm < 80 cm < 300 cm (= 3 m) < 1 000 m (= 1 km).",
  },
  { typ: "input", frage: "Ein Paket wiegt 2 500 g. Wie viele Kilogramm sind das? (Als Kommazahl.)", loesung: ["2,5", "2,50"], einheit: "kg", platzhalter: "z. B. 2,5", erklaerung: "2 500 : 1 000 = 2,5 kg." },
];

export default GROESSEN_HS5;
