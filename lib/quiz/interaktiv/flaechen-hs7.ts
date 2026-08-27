// ============================================================================
// Interaktive Aufgaben — Flächenberechnung · Hauptschule Kl. 7 · Bayern
// Rechteck, Quadrat, Dreieck: Fläche und Umfang, Flächeneinheiten, Alltag.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const FLAECHEN_HS7: Aufgabe[] = [
  { typ: "input", frage: "Ein Rechteck ist 8 cm lang und 6 cm breit. Berechne den Flächeninhalt.", loesung: ["48"], einheit: "cm²", platzhalter: "Zahl", erklaerung: "A = 8 · 6 = 48 cm²." },
  { typ: "input", frage: "Ein Rechteck ist 8 cm lang und 6 cm breit. Berechne den Umfang.", loesung: ["28"], einheit: "cm", platzhalter: "Zahl", erklaerung: "U = 2 · (8 + 6) = 2 · 14 = 28 cm." },
  { typ: "input", frage: "Ein Quadrat hat die Seitenlänge 9 cm. Berechne den Flächeninhalt.", loesung: ["81"], einheit: "cm²", platzhalter: "Zahl", erklaerung: "A = 9 · 9 = 81 cm²." },
  {
    typ: "mc",
    frage: "Mit welcher Formel berechnet man die Fläche eines Dreiecks?",
    antworten: ["A = g · h : 2", "A = g · h", "A = g + h", "A = 3 · g"],
    richtig: 0,
    erklaerung: "Dreieck: Grundseite mal Höhe, geteilt durch 2.",
  },
  { typ: "input", frage: "Ein Dreieck hat die Grundseite g = 10 cm und die Höhe h = 4 cm. Berechne den Flächeninhalt.", loesung: ["20"], einheit: "cm²", platzhalter: "Zahl", erklaerung: "A = 10 · 4 : 2 = 40 : 2 = 20 cm²." },
  { typ: "input", frage: "Ein Dreieck hat die Grundseite g = 6 cm und die Höhe h = 6 cm. Berechne den Flächeninhalt.", loesung: ["18"], einheit: "cm²", platzhalter: "Zahl", erklaerung: "A = 6 · 6 : 2 = 36 : 2 = 18 cm²." },
  { typ: "input", frage: "Wie viele Quadratzentimeter (cm²) sind 2 dm²?", loesung: ["200"], einheit: "cm²", platzhalter: "Zahl", erklaerung: "1 dm² = 100 cm², also 2 dm² = 200 cm²." },
  {
    typ: "mc",
    frage: "Ein Zimmer ist 5 m lang und 4 m breit. Ein Teppichboden kostet 10 € pro m². Was kostet der Teppich für das ganze Zimmer?",
    antworten: ["200 €", "90 €", "100 €", "20 €"],
    richtig: 0,
    erklaerung: "Fläche: 5 · 4 = 20 m². Kosten: 20 · 10 = 200 €.",
  },
  {
    typ: "luecke",
    frage: "Rechteck: 12 m lang, 5 m breit.",
    segmente: ["Fläche: ", { luecke: ["60"] }, " m², Umfang: ", { luecke: ["34"] }, " m."],
    erklaerung: "A = 12 · 5 = 60 m². U = 2 · (12 + 5) = 34 m.",
  },
  { typ: "input", frage: "Ein Quadrat hat den Umfang 36 cm. Wie lang ist eine Seite?", loesung: ["9"], einheit: "cm", platzhalter: "Zahl", erklaerung: "36 : 4 = 9 cm." },
  { typ: "input", frage: "Ein Rechteck hat den Flächeninhalt 42 m² und ist 7 m lang. Wie breit ist es?", loesung: ["6"], einheit: "m", platzhalter: "Zahl", erklaerung: "42 : 7 = 6 m." },
  {
    typ: "zuordnen",
    frage: "Ordne jeder Figur ihren Flächeninhalt zu.",
    paare: [
      { links: "Rechteck 7 cm · 4 cm", rechts: "28 cm²" },
      { links: "Quadrat mit Seite 5 cm", rechts: "25 cm²" },
      { links: "Dreieck g = 8 cm, h = 5 cm", rechts: "20 cm²" },
      { links: "Dreieck g = 4 cm, h = 4 cm", rechts: "8 cm²" },
    ],
    erklaerung: "7 · 4 = 28; 5 · 5 = 25; 8 · 5 : 2 = 20; 4 · 4 : 2 = 8 (alle in cm²).",
  },
  {
    typ: "mc",
    frage: "Ein Dreieck und ein Rechteck haben dieselbe Grundseite und dieselbe Höhe. Welche Figur hat die kleinere Fläche?",
    antworten: ["das Dreieck", "das Rechteck", "beide gleich groß", "das hängt von der Farbe ab"],
    richtig: 0,
    erklaerung: "Das Dreieck hat genau die halbe Fläche des Rechtecks (: 2 in der Formel).",
  },
  { typ: "input", frage: "Ein Garten (Rechteck, 15 m lang, 8 m breit) soll eingezäunt werden. Wie viele Meter Zaun braucht man?", loesung: ["46"], einheit: "m", platzhalter: "Zahl", erklaerung: "U = 2 · (15 + 8) = 2 · 23 = 46 m." },
  {
    typ: "sortieren",
    frage: "Ordne die Flächen aufsteigend — beginne bei der kleinsten: Dreieck g = 6 cm h = 2 cm, Quadrat mit Seite 3 cm, Rechteck 5 cm · 3 cm, Rechteck 6 cm · 3 cm",
    richtig: ["Dreieck g = 6 cm h = 2 cm", "Quadrat mit Seite 3 cm", "Rechteck 5 cm · 3 cm", "Rechteck 6 cm · 3 cm"],
    erklaerung: "6 cm² < 9 cm² < 15 cm² < 18 cm².",
  },
];

export default FLAECHEN_HS7;
