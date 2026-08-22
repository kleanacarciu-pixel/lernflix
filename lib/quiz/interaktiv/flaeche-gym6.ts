// ============================================================================
// Interaktive Aufgaben — Flächeninhalt & Umfang · Gymnasium Kl. 6 · Bayern
// Rechteck, Quadrat, Dreieck, Parallelogramm. Lösungen geprüft.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const FLAECHE_GYM6: Aufgabe[] = [
  { typ: "input", frage: "Ein Rechteck ist 5 cm lang und 3 cm breit. Wie groß ist der Flächeninhalt?", loesung: ["15"], einheit: "cm²", platzhalter: "Zahl", erklaerung: "Flächeninhalt = Länge · Breite = 5 · 3 = 15 cm²." },
  { typ: "input", frage: "Ein Rechteck ist 5 cm lang und 3 cm breit. Wie groß ist der Umfang?", loesung: ["16"], einheit: "cm", platzhalter: "Zahl", erklaerung: "Umfang = 2 · (Länge + Breite) = 2 · (5 + 3) = 16 cm." },
  { typ: "input", frage: "Ein Quadrat hat die Seitenlänge 4 cm. Wie groß ist der Flächeninhalt?", loesung: ["16"], einheit: "cm²", platzhalter: "Zahl", erklaerung: "Flächeninhalt = a · a = 4 · 4 = 16 cm²." },
  { typ: "input", frage: "Ein Quadrat hat die Seitenlänge 4 cm. Wie groß ist der Umfang?", loesung: ["16"], einheit: "cm", platzhalter: "Zahl", erklaerung: "Umfang = 4 · a = 4 · 4 = 16 cm." },
  { typ: "input", frage: "Ein Dreieck hat die Grundseite 6 cm und die Höhe 4 cm. Wie groß ist der Flächeninhalt?", loesung: ["12"], einheit: "cm²", platzhalter: "Zahl", erklaerung: "Flächeninhalt Dreieck = ½ · Grundseite · Höhe = ½ · 6 · 4 = 12 cm²." },
  { typ: "input", frage: "Ein Parallelogramm hat die Grundseite 7 cm und die Höhe 3 cm. Wie groß ist der Flächeninhalt?", loesung: ["21"], einheit: "cm²", platzhalter: "Zahl", erklaerung: "Flächeninhalt Parallelogramm = Grundseite · Höhe = 7 · 3 = 21 cm²." },
  {
    typ: "luecke",
    frage: "Vervollständige die Formeln für das Rechteck.",
    segmente: ["Flächeninhalt = Länge · ", { luecke: ["Breite", "breite"], breite: 8 }, ". Umfang = 2 · (Länge + ", { luecke: ["Breite", "breite"], breite: 8 }, ")."],
    erklaerung: "Beim Rechteck: A = Länge · Breite und U = 2 · (Länge + Breite).",
  },
  { typ: "input", frage: "Ein Rechteck hat den Flächeninhalt 24 cm² und ist 6 cm lang. Wie breit ist es?", loesung: ["4"], einheit: "cm", platzhalter: "Zahl", erklaerung: "Breite = Fläche : Länge = 24 : 6 = 4 cm." },
  { typ: "input", frage: "Ein rechteckiges Zimmer ist 4 m lang und 3 m breit. Wie viele Quadratmeter Teppich braucht man für den Boden?", loesung: ["12"], einheit: "m²", platzhalter: "Zahl", erklaerung: "Fläche = 4 m · 3 m = 12 m²." },
  {
    typ: "mc",
    frage: "In welcher Einheit gibt man einen Flächeninhalt an?",
    antworten: ["cm²", "cm", "cm³", "Liter"],
    richtig: 0,
    erklaerung: "Flächen werden in Quadrat-Einheiten angegeben, z. B. cm². cm ist eine Länge, cm³ ein Volumen.",
  },
  { typ: "input", frage: "Ein Rechteck ist 10 cm lang und 2 cm breit. Wie groß ist der Flächeninhalt?", loesung: ["20"], einheit: "cm²", platzhalter: "Zahl", erklaerung: "Fläche = 10 · 2 = 20 cm²." },
  { typ: "input", frage: "Ein Dreieck hat die Grundseite 10 cm und die Höhe 5 cm. Wie groß ist der Flächeninhalt?", loesung: ["25"], einheit: "cm²", platzhalter: "Zahl", erklaerung: "A = ½ · 10 · 5 = 25 cm²." },
  {
    typ: "zuordnen",
    frage: "Ordne jeder Figur die Formel für den Flächeninhalt zu.",
    paare: [
      { links: "Rechteck", rechts: "a · b" },
      { links: "Quadrat", rechts: "a · a" },
      { links: "Dreieck", rechts: "½ · g · h" },
      { links: "Parallelogramm", rechts: "g · h" },
    ],
    erklaerung: "Rechteck: a · b; Quadrat: a · a; Dreieck: ½ · g · h; Parallelogramm: g · h.",
  },
  { typ: "input", frage: "Ein quadratischer Garten hat die Seitenlänge 12 m. Wie lang muss der Zaun rundherum sein?", loesung: ["48"], einheit: "m", platzhalter: "Zahl", erklaerung: "Umfang = 4 · 12 m = 48 m." },
  { typ: "input", frage: "Ein Rechteck ist 7 cm lang und 4 cm breit. Wie groß ist der Umfang?", loesung: ["22"], einheit: "cm", platzhalter: "Zahl", erklaerung: "U = 2 · (7 + 4) = 2 · 11 = 22 cm." },
];

export default FLAECHE_GYM6;
