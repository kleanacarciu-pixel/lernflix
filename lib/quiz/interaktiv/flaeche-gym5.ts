// ============================================================================
// Interaktive Aufgaben — Umfang & Flächeninhalt · Gymnasium Kl. 5
// Rechteck und Quadrat: Umfang und Flächeninhalt.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const FLAECHE_GYM5: Aufgabe[] = [
  { typ: "input", frage: "Ein Rechteck ist 6 cm lang und 4 cm breit. Wie groß ist der Flächeninhalt?", loesung: ["24"], einheit: "cm²", platzhalter: "Zahl", erklaerung: "Fläche = Länge · Breite = 6 · 4 = 24 cm²." },
  { typ: "input", frage: "Ein Rechteck ist 6 cm lang und 4 cm breit. Wie groß ist der Umfang?", loesung: ["20"], einheit: "cm", platzhalter: "Zahl", erklaerung: "Umfang = 2 · (6 + 4) = 20 cm." },
  { typ: "input", frage: "Ein Quadrat hat die Seitenlänge 5 cm. Wie groß ist der Flächeninhalt?", loesung: ["25"], einheit: "cm²", platzhalter: "Zahl", erklaerung: "Fläche = a · a = 5 · 5 = 25 cm²." },
  { typ: "input", frage: "Ein Quadrat hat die Seitenlänge 5 cm. Wie groß ist der Umfang?", loesung: ["20"], einheit: "cm", platzhalter: "Zahl", erklaerung: "Umfang = 4 · a = 4 · 5 = 20 cm." },
  { typ: "input", frage: "Ein Rechteck ist 10 cm lang und 3 cm breit. Wie groß ist der Flächeninhalt?", loesung: ["30"], einheit: "cm²", platzhalter: "Zahl", erklaerung: "Fläche = 10 · 3 = 30 cm²." },
  { typ: "input", frage: "Ein Rechteck ist 10 cm lang und 3 cm breit. Wie groß ist der Umfang?", loesung: ["26"], einheit: "cm", platzhalter: "Zahl", erklaerung: "Umfang = 2 · (10 + 3) = 26 cm." },
  {
    typ: "luecke",
    frage: "Ein Rechteck ist 8 cm lang und 2 cm breit.",
    segmente: ["Umfang = ", { luecke: ["20"] }, " cm und Flächeninhalt = ", { luecke: ["16"] }, " cm²."],
    erklaerung: "U = 2 · (8 + 2) = 20 cm. A = 8 · 2 = 16 cm².",
  },
  { typ: "input", frage: "Ein Rechteck hat den Flächeninhalt 20 cm² und ist 4 cm breit. Wie lang ist es?", loesung: ["5"], einheit: "cm", platzhalter: "Zahl", erklaerung: "Länge = Fläche : Breite = 20 : 4 = 5 cm." },
  {
    typ: "mc",
    frage: "In welcher Einheit gibt man einen Umfang an?",
    antworten: ["cm", "cm²", "cm³", "kg"],
    richtig: 0,
    erklaerung: "Ein Umfang ist eine Länge und wird z. B. in cm angegeben. Flächen: cm², Volumen: cm³.",
  },
  { typ: "input", frage: "Ein Zimmer ist 5 m lang und 4 m breit. Wie groß ist die Bodenfläche (in m²)?", loesung: ["20"], einheit: "m²", platzhalter: "Zahl", erklaerung: "Fläche = 5 m · 4 m = 20 m²." },
  { typ: "input", frage: "Ein Quadrat hat die Seitenlänge 7 cm. Wie groß ist der Umfang?", loesung: ["28"], einheit: "cm", platzhalter: "Zahl", erklaerung: "Umfang = 4 · 7 = 28 cm." },
  { typ: "input", frage: "Ein Quadrat hat die Seitenlänge 3 cm. Wie groß ist der Flächeninhalt?", loesung: ["9"], einheit: "cm²", platzhalter: "Zahl", erklaerung: "Fläche = 3 · 3 = 9 cm²." },
  {
    typ: "zuordnen",
    frage: "Ordne jeder Größe die passende Formel zu.",
    paare: [
      { links: "Rechteck-Fläche", rechts: "Länge · Breite" },
      { links: "Rechteck-Umfang", rechts: "2 · (Länge + Breite)" },
      { links: "Quadrat-Fläche", rechts: "Seite · Seite" },
      { links: "Quadrat-Umfang", rechts: "4 · Seite" },
    ],
    erklaerung: "Rechteck: A = Länge · Breite, U = 2 · (Länge + Breite). Quadrat: A = Seite · Seite, U = 4 · Seite.",
  },
  { typ: "input", frage: "Ein Rechteck ist 12 cm lang und 5 cm breit. Wie groß ist der Umfang?", loesung: ["34"], einheit: "cm", platzhalter: "Zahl", erklaerung: "Umfang = 2 · (12 + 5) = 34 cm." },
  { typ: "input", frage: "Ein Rechteck ist 12 cm lang und 5 cm breit. Wie groß ist der Flächeninhalt?", loesung: ["60"], einheit: "cm²", platzhalter: "Zahl", erklaerung: "Fläche = 12 · 5 = 60 cm²." },
];

export default FLAECHE_GYM5;
