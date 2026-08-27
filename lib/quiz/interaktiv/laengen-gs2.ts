// ============================================================================
// Interaktive Aufgaben — Längen (m, cm) · Grundschule Kl. 2 · Bayern
// Meter und Zentimeter kennen, messen, umrechnen und vergleichen.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const LAENGEN_GS2: Aufgabe[] = [
  { typ: "input", frage: "Wie viele Zentimeter sind 1 m?", loesung: ["100"], einheit: "cm", platzhalter: "Zahl", erklaerung: "1 m = 100 cm." },
  { typ: "input", frage: "Wie viele Zentimeter sind 2 m?", loesung: ["200"], einheit: "cm", platzhalter: "Zahl", erklaerung: "2 · 100 = 200 cm." },
  { typ: "input", frage: "Wie viele Zentimeter sind 1 m und 50 cm zusammen?", loesung: ["150"], einheit: "cm", platzhalter: "Zahl", erklaerung: "100 + 50 = 150 cm." },
  {
    typ: "mc",
    frage: "Was misst man am besten in Metern?",
    antworten: ["die Länge des Klassenzimmers", "die Länge eines Radiergummis", "die Dicke eines Buches", "die Länge eines Fingernagels"],
    richtig: 0,
    erklaerung: "Große Längen wie ein Zimmer misst man in Metern, kleine Dinge in Zentimetern.",
  },
  {
    typ: "mc",
    frage: "Was misst man am besten in Zentimetern?",
    antworten: ["die Länge eines Stiftes", "die Länge des Schulwegs", "die Höhe eines Hauses", "die Länge des Pausenhofs"],
    richtig: 0,
    erklaerung: "Kleine Dinge wie einen Stift misst man in Zentimetern.",
  },
  {
    typ: "mc",
    frage: "Wie groß ist ein Kind in der 2. Klasse ungefähr?",
    antworten: ["ungefähr 1 m 30 cm", "ungefähr 3 m", "ungefähr 30 cm", "ungefähr 13 m"],
    richtig: 0,
    erklaerung: "Zweitklässler sind meist zwischen 1,20 m und 1,40 m groß.",
  },
  { typ: "input", frage: "Ein Stift ist 12 cm lang, ein anderer 8 cm. Wie viele Zentimeter ist der erste länger?", loesung: ["4"], einheit: "cm", platzhalter: "Zahl", erklaerung: "12 − 8 = 4 cm." },
  { typ: "input", frage: "Ein Band ist 60 cm lang. Du schneidest 25 cm ab. Wie lang ist der Rest?", loesung: ["35"], einheit: "cm", platzhalter: "Zahl", erklaerung: "60 − 25 = 35 cm." },
  { typ: "input", frage: "Zwei Bretter sind 40 cm und 60 cm lang. Wie lang sind sie zusammen?", loesung: ["100"], einheit: "cm", platzhalter: "Zahl", erklaerung: "40 + 60 = 100 cm (= 1 m)." },
  {
    typ: "luecke",
    frage: "Umrechnen.",
    segmente: ["1 m = ", { luecke: ["100"] }, " cm und 3 m = ", { luecke: ["300"] }, " cm."],
    erklaerung: "1 m = 100 cm, 3 m = 300 cm.",
  },
  {
    typ: "zuordnen",
    frage: "Ordne jedem Ding die passende Länge zu.",
    paare: [
      { links: "Bleistift", rechts: "15 cm" },
      { links: "Tür", rechts: "2 m" },
      { links: "Lineal", rechts: "30 cm" },
      { links: "Fußballtor", rechts: "7 m breit" },
    ],
    erklaerung: "Bleistift ≈ 15 cm, Tür ≈ 2 m, Lineal = 30 cm, Fußballtor ≈ 7 m.",
  },
  {
    typ: "sortieren",
    frage: "Ordne von kurz nach lang: 1 m, 20 cm, 150 cm, 90 cm",
    richtig: ["20 cm", "90 cm", "1 m", "150 cm"],
    erklaerung: "20 cm < 90 cm < 100 cm (= 1 m) < 150 cm.",
  },
  {
    typ: "mc",
    frage: "Womit misst man eine lange Strecke im Sportunterricht?",
    antworten: ["mit einem Maßband", "mit einem Radiergummi", "mit einem Becher", "mit einer Schere"],
    richtig: 0,
    erklaerung: "Mit dem Maßband kann man lange Strecken messen.",
  },
  { typ: "input", frage: "Lisa springt 95 cm weit, Tom springt 1 m weit. Wie viele Zentimeter springt Tom weiter?", loesung: ["5"], einheit: "cm", platzhalter: "Zahl", erklaerung: "1 m = 100 cm. 100 − 95 = 5 cm." },
  { typ: "input", frage: "Ein Seil ist 4 m lang. Wie viele Zentimeter sind das?", loesung: ["400"], einheit: "cm", platzhalter: "Zahl", erklaerung: "4 · 100 = 400 cm." },
];

export default LAENGEN_GS2;
