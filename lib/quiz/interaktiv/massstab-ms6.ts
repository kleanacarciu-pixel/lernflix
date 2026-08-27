// ============================================================================
// Interaktive Aufgaben — Maßstab & Größen · Mittelschule Kl. 6 · Bayern
// Maßstab lesen und anwenden, Karte ↔ Wirklichkeit, Einheiten sicher umrechnen.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const MASSSTAB_MS6: Aufgabe[] = [
  {
    typ: "mc",
    frage: "Was bedeutet der Maßstab 1 : 100?",
    antworten: ["1 cm auf dem Plan sind 100 cm in Wirklichkeit", "1 cm auf dem Plan sind 100 km in Wirklichkeit", "100 cm auf dem Plan sind 1 cm in Wirklichkeit", "Der Plan ist 100-mal größer als die Wirklichkeit"],
    richtig: 0,
    erklaerung: "Maßstab 1 : 100 heißt: Jede Länge in Wirklichkeit ist 100-mal so groß wie auf dem Plan.",
  },
  { typ: "input", frage: "Maßstab 1 : 100. Eine Strecke ist auf dem Plan 5 cm lang. Wie lang ist sie in Wirklichkeit?", loesung: ["500"], einheit: "cm", platzhalter: "Zahl", erklaerung: "5 cm · 100 = 500 cm (= 5 m)." },
  { typ: "input", frage: "Maßstab 1 : 1 000. Eine Strecke ist auf dem Plan 3 cm lang. Wie viele Meter ist sie in Wirklichkeit?", loesung: ["30"], einheit: "m", platzhalter: "Zahl", erklaerung: "3 cm · 1 000 = 3 000 cm = 30 m." },
  { typ: "input", frage: "Maßstab 1 : 50. Ein Tisch ist in Wirklichkeit 200 cm lang. Wie lang ist er auf dem Plan?", loesung: ["4"], einheit: "cm", platzhalter: "Zahl", erklaerung: "200 cm : 50 = 4 cm." },
  { typ: "input", frage: "Maßstab 1 : 100 000. Auf der Karte sind es 4 cm. Wie viele Kilometer sind es in Wirklichkeit?", loesung: ["4"], einheit: "km", platzhalter: "Zahl", erklaerung: "4 cm · 100 000 = 400 000 cm = 4 000 m = 4 km." },
  {
    typ: "mc",
    frage: "Ein Zimmer ist in Wirklichkeit 4 m lang, auf dem Plan 4 cm. Welcher Maßstab ist das?",
    antworten: ["1 : 100", "1 : 10", "1 : 1 000", "1 : 4"],
    richtig: 0,
    erklaerung: "4 m = 400 cm. 400 cm : 4 cm = 100, also Maßstab 1 : 100.",
  },
  {
    typ: "luecke",
    frage: "Maßstab 1 : 200.",
    segmente: ["1 cm auf dem Plan = ", { luecke: ["200"] }, " cm = ", { luecke: ["2"] }, " m in Wirklichkeit."],
    erklaerung: "1 cm · 200 = 200 cm = 2 m.",
  },
  { typ: "input", frage: "Wie viele Meter sind 2,5 km?", loesung: ["2500", "2 500"], einheit: "m", platzhalter: "Zahl", erklaerung: "2,5 · 1 000 = 2 500 m." },
  { typ: "input", frage: "Wie viele Zentimeter sind 1,2 m?", loesung: ["120"], einheit: "cm", platzhalter: "Zahl", erklaerung: "1,2 · 100 = 120 cm." },
  { typ: "input", frage: "Wie viele Gramm sind 3,5 kg?", loesung: ["3500", "3 500"], einheit: "g", platzhalter: "Zahl", erklaerung: "3,5 · 1 000 = 3 500 g." },
  {
    typ: "zuordnen",
    frage: "Maßstab 1 : 1 000. Ordne jeder Plan-Länge die wirkliche Länge zu.",
    paare: [
      { links: "1 cm", rechts: "10 m" },
      { links: "2 cm", rechts: "20 m" },
      { links: "5 cm", rechts: "50 m" },
      { links: "10 cm", rechts: "100 m" },
    ],
    erklaerung: "Mal 1 000: 1 cm → 1 000 cm = 10 m, 2 cm → 20 m, 5 cm → 50 m, 10 cm → 100 m.",
  },
  {
    typ: "sortieren",
    frage: "Ordne die Längen aufsteigend — beginne bei der kürzesten: 0,5 m, 35 cm, 1 200 mm, 0,002 km",
    richtig: ["35 cm", "0,5 m", "1 200 mm", "0,002 km"],
    erklaerung: "In Zentimetern: 35 cm < 50 cm (= 0,5 m) < 120 cm (= 1 200 mm) < 200 cm (= 0,002 km).",
  },
  {
    typ: "mc",
    frage: "Welcher Maßstab zeigt die Wirklichkeit am stärksten verkleinert?",
    antworten: ["1 : 100 000", "1 : 100", "1 : 50", "1 : 10"],
    richtig: 0,
    erklaerung: "Je größer die zweite Zahl, desto stärker die Verkleinerung: 1 : 100 000 verkleinert am stärksten.",
  },
  { typ: "input", frage: "Maßstab 1 : 25. Ein Modellauto ist 16 cm lang. Wie viele Meter ist das echte Auto lang?", loesung: ["4"], einheit: "m", platzhalter: "Zahl", erklaerung: "16 cm · 25 = 400 cm = 4 m." },
  { typ: "input", frage: "Auf einer Karte (Maßstab 1 : 50 000) ist der Schulweg 6 cm lang. Wie viele Kilometer ist er wirklich?", loesung: ["3"], einheit: "km", platzhalter: "Zahl", erklaerung: "6 cm · 50 000 = 300 000 cm = 3 000 m = 3 km." },
];

export default MASSSTAB_MS6;
