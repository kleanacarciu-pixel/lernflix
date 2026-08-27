// ============================================================================
// Interaktive Aufgaben — Maßstab & Größen · Hauptschule Kl. 6 · Bayern
// Einfache Maßstäbe lesen, Karte und Wirklichkeit, Einheiten umrechnen.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const MASSSTAB_HS6: Aufgabe[] = [
  {
    typ: "mc",
    frage: "Was bedeutet der Maßstab 1 : 100 auf einem Bauplan?",
    antworten: ["1 cm auf dem Plan sind 100 cm in echt", "1 cm auf dem Plan sind 100 km in echt", "Der Plan ist 100-mal größer als echt", "100 cm auf dem Plan sind 1 cm in echt"],
    richtig: 0,
    erklaerung: "1 : 100 heißt: In echt ist alles 100-mal so groß wie auf dem Plan.",
  },
  { typ: "input", frage: "Maßstab 1 : 100. Eine Wand ist auf dem Plan 4 cm lang. Wie lang ist sie in echt?", loesung: ["400"], einheit: "cm", platzhalter: "Zahl", erklaerung: "4 · 100 = 400 cm (= 4 m)." },
  { typ: "input", frage: "Maßstab 1 : 100. Eine Wand ist auf dem Plan 4 cm lang. Wie viele Meter sind das in echt?", loesung: ["4"], einheit: "m", platzhalter: "Zahl", erklaerung: "4 · 100 = 400 cm = 4 m." },
  { typ: "input", frage: "Maßstab 1 : 10. Ein Spielzeugauto ist 30 cm lang. Wie viele Meter ist das echte Auto lang?", loesung: ["3"], einheit: "m", platzhalter: "Zahl", erklaerung: "30 · 10 = 300 cm = 3 m." },
  { typ: "input", frage: "Maßstab 1 : 50. Ein Schrank ist in echt 200 cm hoch. Wie hoch ist er auf dem Plan?", loesung: ["4"], einheit: "cm", platzhalter: "Zahl", erklaerung: "200 : 50 = 4 cm." },
  {
    typ: "mc",
    frage: "Auf einer Landkarte steht der Maßstab 1 : 100 000. 1 cm auf der Karte ist in echt …",
    antworten: ["1 km", "100 m", "10 km", "1 m"],
    richtig: 0,
    erklaerung: "1 cm · 100 000 = 100 000 cm = 1 000 m = 1 km.",
  },
  { typ: "input", frage: "Karte mit Maßstab 1 : 100 000. Der Weg zur Oma ist auf der Karte 5 cm. Wie viele Kilometer sind das in echt?", loesung: ["5"], einheit: "km", platzhalter: "Zahl", erklaerung: "5 cm entsprechen 5 · 1 km = 5 km." },
  {
    typ: "luecke",
    frage: "Umrechnen.",
    segmente: ["1,5 m = ", { luecke: ["150"] }, " cm und 2 000 m = ", { luecke: ["2"] }, " km."],
    erklaerung: "1,5 · 100 = 150 cm. 2 000 : 1 000 = 2 km.",
  },
  { typ: "input", frage: "Wie viele Zentimeter sind 3,5 m?", loesung: ["350"], einheit: "cm", platzhalter: "Zahl", erklaerung: "3,5 · 100 = 350 cm." },
  { typ: "input", frage: "Wie viele Kilogramm sind 4 500 g? (Als Kommazahl.)", loesung: ["4,5"], einheit: "kg", platzhalter: "z. B. 4,5", erklaerung: "4 500 : 1 000 = 4,5 kg." },
  {
    typ: "zuordnen",
    frage: "Maßstab 1 : 100. Ordne jeder Plan-Länge die echte Länge zu.",
    paare: [
      { links: "1 cm", rechts: "1 m" },
      { links: "3 cm", rechts: "3 m" },
      { links: "5,5 cm", rechts: "5,5 m" },
      { links: "10 cm", rechts: "10 m" },
    ],
    erklaerung: "Bei 1 : 100 wird aus jedem Zentimeter ein Meter (100 cm).",
  },
  {
    typ: "mc",
    frage: "Welcher Maßstab passt zu einer Weltkarte am besten?",
    antworten: ["1 : 50 000 000", "1 : 10", "1 : 100", "1 : 1"],
    richtig: 0,
    erklaerung: "Die Erde ist riesig — für eine Weltkarte braucht man eine sehr starke Verkleinerung.",
  },
  {
    typ: "sortieren",
    frage: "Ordne die Strecken aufsteigend — beginne bei der kürzesten: 1,2 m, 90 cm, 0,5 km, 200 cm",
    richtig: ["90 cm", "1,2 m", "200 cm", "0,5 km"],
    erklaerung: "In cm: 90 < 120 (= 1,2 m) < 200 < 50 000 (= 0,5 km).",
  },
  { typ: "input", frage: "Maßstab 1 : 20. Eine Tür ist auf dem Plan 10 cm hoch. Wie viele Meter ist sie in echt?", loesung: ["2"], einheit: "m", platzhalter: "Zahl", erklaerung: "10 · 20 = 200 cm = 2 m." },
  { typ: "input", frage: "Ein Zimmer ist in echt 6 m lang. Auf dem Plan (Maßstab 1 : 100) sind das wie viele Zentimeter?", loesung: ["6"], einheit: "cm", platzhalter: "Zahl", erklaerung: "6 m = 600 cm. 600 : 100 = 6 cm." },
];

export default MASSSTAB_HS6;
