// ============================================================================
// Interaktive Aufgaben — Umfang & Fläche · Mittelschule Kl. 5 · Bayern
// Umfang und Flächeninhalt von Rechteck und Quadrat, Einheiten, Sachaufgaben.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const FLAECHE_MS5: Aufgabe[] = [
  { typ: "input", frage: "Ein Rechteck ist 6 cm lang und 4 cm breit. Berechne den Umfang.", loesung: ["20"], einheit: "cm", platzhalter: "Zahl", erklaerung: "U = 2 · (6 + 4) = 2 · 10 = 20 cm." },
  { typ: "input", frage: "Ein Rechteck ist 6 cm lang und 4 cm breit. Berechne den Flächeninhalt.", loesung: ["24"], einheit: "cm²", platzhalter: "Zahl", erklaerung: "A = 6 · 4 = 24 cm²." },
  { typ: "input", frage: "Ein Quadrat hat die Seitenlänge 5 cm. Berechne den Umfang.", loesung: ["20"], einheit: "cm", platzhalter: "Zahl", erklaerung: "U = 4 · 5 = 20 cm." },
  { typ: "input", frage: "Ein Quadrat hat die Seitenlänge 5 cm. Berechne den Flächeninhalt.", loesung: ["25"], einheit: "cm²", platzhalter: "Zahl", erklaerung: "A = 5 · 5 = 25 cm²." },
  {
    typ: "mc",
    frage: "Mit welcher Formel berechnet man den Flächeninhalt eines Rechtecks?",
    antworten: ["A = Länge · Breite", "A = Länge + Breite", "A = 2 · (Länge + Breite)", "A = 4 · Länge"],
    richtig: 0,
    erklaerung: "Flächeninhalt Rechteck: A = Länge · Breite. (2 · (Länge + Breite) ist der Umfang.)",
  },
  {
    typ: "mc",
    frage: "In welcher Einheit gibt man einen Flächeninhalt an?",
    antworten: ["cm²", "cm", "cm³", "kg"],
    richtig: 0,
    erklaerung: "Flächen misst man in Quadrat-Einheiten, z. B. cm² oder m².",
  },
  {
    typ: "luecke",
    frage: "Ein Rechteck ist 8 m lang und 3 m breit.",
    segmente: ["Umfang: ", { luecke: ["22"] }, " m, Flächeninhalt: ", { luecke: ["24"] }, " m²."],
    erklaerung: "U = 2 · (8 + 3) = 22 m und A = 8 · 3 = 24 m².",
  },
  { typ: "input", frage: "Ein rechteckiger Garten ist 12 m lang und 8 m breit. Wie viele Meter Zaun braucht man für den ganzen Garten?", loesung: ["40"], einheit: "m", platzhalter: "Zahl", erklaerung: "Zaun = Umfang: U = 2 · (12 + 8) = 2 · 20 = 40 m." },
  { typ: "input", frage: "Ein Zimmer ist 5 m lang und 4 m breit. Wie viel Quadratmeter Teppich braucht man für den ganzen Boden?", loesung: ["20"], einheit: "m²", platzhalter: "Zahl", erklaerung: "A = 5 · 4 = 20 m²." },
  { typ: "input", frage: "Ein Rechteck hat den Flächeninhalt 36 cm² und ist 9 cm lang. Wie breit ist es?", loesung: ["4"], einheit: "cm", platzhalter: "Zahl", erklaerung: "Breite = A : Länge = 36 : 9 = 4 cm." },
  { typ: "input", frage: "Ein Quadrat hat den Umfang 28 cm. Wie lang ist eine Seite?", loesung: ["7"], einheit: "cm", platzhalter: "Zahl", erklaerung: "Seite = U : 4 = 28 : 4 = 7 cm." },
  {
    typ: "mc",
    frage: "Ein Rechteck hat den Umfang 24 cm. Welche Seitenlängen passen dazu?",
    antworten: ["8 cm und 4 cm", "8 cm und 3 cm", "6 cm und 4 cm", "12 cm und 2 cm"],
    richtig: 0,
    erklaerung: "U = 2 · (8 + 4) = 2 · 12 = 24 cm. Die anderen ergeben 22 cm, 20 cm und 28 cm.",
  },
  {
    typ: "zuordnen",
    frage: "Ordne jeder Figur die richtige Größe zu.",
    paare: [
      { links: "Quadrat, Seite 3 cm: Umfang", rechts: "12 cm" },
      { links: "Quadrat, Seite 3 cm: Fläche", rechts: "9 cm²" },
      { links: "Rechteck 5 cm · 2 cm: Umfang", rechts: "14 cm" },
      { links: "Rechteck 5 cm · 2 cm: Fläche", rechts: "10 cm²" },
    ],
    erklaerung: "Quadrat: U = 4 · 3 = 12 cm, A = 3 · 3 = 9 cm². Rechteck: U = 2 · (5 + 2) = 14 cm, A = 5 · 2 = 10 cm².",
  },
  { typ: "input", frage: "Wie viele Quadratzentimeter (cm²) sind 1 dm²?", loesung: ["100"], einheit: "cm²", platzhalter: "Zahl", erklaerung: "1 dm = 10 cm, also 1 dm² = 10 · 10 = 100 cm²." },
  {
    typ: "sortieren",
    frage: "Ordne die Flächen aufsteigend — beginne bei der kleinsten: Quadrat mit Seite 4 cm, Rechteck 3 cm · 5 cm, Rechteck 2 cm · 6 cm, Quadrat mit Seite 5 cm",
    richtig: ["Rechteck 2 cm · 6 cm", "Rechteck 3 cm · 5 cm", "Quadrat mit Seite 4 cm", "Quadrat mit Seite 5 cm"],
    erklaerung: "2 · 6 = 12 cm² < 3 · 5 = 15 cm² < 4 · 4 = 16 cm² < 5 · 5 = 25 cm².",
  },
];

export default FLAECHE_MS5;
