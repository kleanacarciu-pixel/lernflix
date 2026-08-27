// ============================================================================
// Interaktive Aufgaben — Umfang & Fläche · Hauptschule Kl. 5 · Bayern
// Umfang und Flächeninhalt von Rechteck und Quadrat mit einfachen Zahlen.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const FLAECHE_HS5: Aufgabe[] = [
  { typ: "input", frage: "Ein Rechteck ist 5 cm lang und 3 cm breit. Berechne den Umfang.", loesung: ["16"], einheit: "cm", platzhalter: "Zahl", erklaerung: "U = 5 + 3 + 5 + 3 = 16 cm." },
  { typ: "input", frage: "Ein Rechteck ist 5 cm lang und 3 cm breit. Berechne den Flächeninhalt.", loesung: ["15"], einheit: "cm²", platzhalter: "Zahl", erklaerung: "A = 5 · 3 = 15 cm²." },
  { typ: "input", frage: "Ein Quadrat hat die Seitenlänge 4 cm. Berechne den Umfang.", loesung: ["16"], einheit: "cm", platzhalter: "Zahl", erklaerung: "U = 4 · 4 = 16 cm." },
  { typ: "input", frage: "Ein Quadrat hat die Seitenlänge 6 cm. Berechne den Flächeninhalt.", loesung: ["36"], einheit: "cm²", platzhalter: "Zahl", erklaerung: "A = 6 · 6 = 36 cm²." },
  {
    typ: "mc",
    frage: "Was ist der Umfang einer Figur?",
    antworten: ["die Länge der Linie einmal außen herum", "die Fläche innen", "die Anzahl der Ecken", "die längste Seite"],
    richtig: 0,
    erklaerung: "Der Umfang ist der Weg einmal um die Figur herum.",
  },
  {
    typ: "mc",
    frage: "In welcher Einheit gibt man einen Flächeninhalt an?",
    antworten: ["m²", "m", "m³", "kg"],
    richtig: 0,
    erklaerung: "Flächen misst man in Quadrat-Einheiten wie m² oder cm².",
  },
  {
    typ: "luecke",
    frage: "Ein Rechteck ist 7 m lang und 2 m breit.",
    segmente: ["Umfang: ", { luecke: ["18"] }, " m, Flächeninhalt: ", { luecke: ["14"] }, " m²."],
    erklaerung: "U = 2 · (7 + 2) = 18 m und A = 7 · 2 = 14 m².",
  },
  { typ: "input", frage: "Ein rechteckiger Garten ist 10 m lang und 6 m breit. Wie viele Meter Zaun braucht man einmal rundherum?", loesung: ["32"], einheit: "m", platzhalter: "Zahl", erklaerung: "U = 2 · (10 + 6) = 2 · 16 = 32 m." },
  { typ: "input", frage: "Ein Zimmer ist 4 m lang und 3 m breit. Wie viel Quadratmeter Boden hat es?", loesung: ["12"], einheit: "m²", platzhalter: "Zahl", erklaerung: "A = 4 · 3 = 12 m²." },
  { typ: "input", frage: "Ein Quadrat hat den Umfang 20 cm. Wie lang ist eine Seite?", loesung: ["5"], einheit: "cm", platzhalter: "Zahl", erklaerung: "Seite = 20 : 4 = 5 cm." },
  { typ: "input", frage: "Ein Rechteck hat den Flächeninhalt 24 cm² und ist 6 cm lang. Wie breit ist es?", loesung: ["4"], einheit: "cm", platzhalter: "Zahl", erklaerung: "Breite = 24 : 6 = 4 cm." },
  {
    typ: "mc",
    frage: "Ein Fußballfeld ist ungefähr 100 m lang und 70 m breit. Wie groß ist seine Fläche ungefähr?",
    antworten: ["7 000 m²", "170 m²", "700 m²", "70 m²"],
    richtig: 0,
    erklaerung: "A = 100 · 70 = 7 000 m².",
  },
  {
    typ: "zuordnen",
    frage: "Ordne jeder Figur die richtige Größe zu.",
    paare: [
      { links: "Quadrat, Seite 2 cm: Umfang", rechts: "8 cm" },
      { links: "Quadrat, Seite 2 cm: Fläche", rechts: "4 cm²" },
      { links: "Rechteck 6 cm · 3 cm: Umfang", rechts: "18 cm" },
      { links: "Rechteck 6 cm · 3 cm: Fläche", rechts: "18 cm²" },
    ],
    erklaerung: "Quadrat: U = 4 · 2 = 8 cm, A = 2 · 2 = 4 cm². Rechteck: U = 2 · (6 + 3) = 18 cm, A = 6 · 3 = 18 cm².",
  },
  { typ: "input", frage: "Ein quadratisches Beet hat die Seitenlänge 3 m. Wie viele Meter Einfassung braucht man rundherum?", loesung: ["12"], einheit: "m", platzhalter: "Zahl", erklaerung: "U = 4 · 3 = 12 m." },
  {
    typ: "sortieren",
    frage: "Ordne die Flächen aufsteigend — beginne bei der kleinsten: Quadrat mit Seite 3 cm, Rechteck 2 cm · 4 cm, Quadrat mit Seite 4 cm, Rechteck 5 cm · 4 cm",
    richtig: ["Rechteck 2 cm · 4 cm", "Quadrat mit Seite 3 cm", "Quadrat mit Seite 4 cm", "Rechteck 5 cm · 4 cm"],
    erklaerung: "8 cm² < 9 cm² < 16 cm² < 20 cm².",
  },
];

export default FLAECHE_HS5;
