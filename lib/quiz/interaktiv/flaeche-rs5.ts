// ============================================================================
// Interaktive Aufgaben — Umfang & Flächeninhalt (Rechteck) · Realschule Kl. 5
// Rechteck und Quadrat. Lösungen von Hand geprüft.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const FLAECHE_RS5: Aufgabe[] = [
  { typ: "input", frage: "Ein Rechteck ist 7 cm lang und 4 cm breit. Wie groß ist der Flächeninhalt?", loesung: ["28"], einheit: "cm²", platzhalter: "Zahl", erklaerung: "Fläche = Länge · Breite = 7 · 4 = 28 cm²." },
  { typ: "input", frage: "Ein Rechteck ist 7 cm lang und 4 cm breit. Wie groß ist der Umfang?", loesung: ["22"], einheit: "cm", platzhalter: "Zahl", erklaerung: "Umfang = 2 · (7 + 4) = 22 cm." },
  { typ: "input", frage: "Ein Quadrat hat die Seitenlänge 6 cm. Wie groß ist der Flächeninhalt?", loesung: ["36"], einheit: "cm²", platzhalter: "Zahl", erklaerung: "Fläche = 6 · 6 = 36 cm²." },
  { typ: "input", frage: "Ein Quadrat hat die Seitenlänge 6 cm. Wie groß ist der Umfang?", loesung: ["24"], einheit: "cm", platzhalter: "Zahl", erklaerung: "Umfang = 4 · 6 = 24 cm." },
  { typ: "input", frage: "Ein Rechteck ist 9 cm lang und 5 cm breit. Wie groß ist der Flächeninhalt?", loesung: ["45"], einheit: "cm²", platzhalter: "Zahl", erklaerung: "Fläche = 9 · 5 = 45 cm²." },
  { typ: "input", frage: "Ein Rechteck ist 9 cm lang und 5 cm breit. Wie groß ist der Umfang?", loesung: ["28"], einheit: "cm", platzhalter: "Zahl", erklaerung: "Umfang = 2 · (9 + 5) = 28 cm." },
  {
    typ: "luecke",
    frage: "Ein Rechteck ist 10 cm lang und 3 cm breit.",
    segmente: ["Umfang = ", { luecke: ["26"] }, " cm und Flächeninhalt = ", { luecke: ["30"] }, " cm²."],
    erklaerung: "U = 2 · (10 + 3) = 26 cm. A = 10 · 3 = 30 cm².",
  },
  { typ: "input", frage: "Ein Rechteck hat den Flächeninhalt 36 cm² und ist 4 cm breit. Wie lang ist es?", loesung: ["9"], einheit: "cm", platzhalter: "Zahl", erklaerung: "Länge = Fläche : Breite = 36 : 4 = 9 cm." },
  {
    typ: "mc",
    frage: "In welcher Einheit gibt man einen Flächeninhalt an?",
    antworten: ["cm²", "cm", "cm³", "kg"],
    richtig: 0,
    erklaerung: "Flächen werden in Quadrat-Einheiten angegeben, z. B. cm².",
  },
  { typ: "input", frage: "Ein Zimmer ist 6 m lang und 4 m breit. Wie groß ist die Bodenfläche (in m²)?", loesung: ["24"], einheit: "m²", platzhalter: "Zahl", erklaerung: "Fläche = 6 m · 4 m = 24 m²." },
  { typ: "input", frage: "Ein Quadrat hat die Seitenlänge 8 cm. Wie groß ist der Umfang?", loesung: ["32"], einheit: "cm", platzhalter: "Zahl", erklaerung: "Umfang = 4 · 8 = 32 cm." },
  { typ: "input", frage: "Ein Quadrat hat die Seitenlänge 4 cm. Wie groß ist der Flächeninhalt?", loesung: ["16"], einheit: "cm²", platzhalter: "Zahl", erklaerung: "Fläche = 4 · 4 = 16 cm²." },
  {
    typ: "zuordnen",
    frage: "Ordne jeder Größe die passende Formel zu.",
    paare: [
      { links: "Rechteck-Fläche", rechts: "Länge · Breite" },
      { links: "Rechteck-Umfang", rechts: "2 · (Länge + Breite)" },
      { links: "Quadrat-Fläche", rechts: "Seitenlänge · Seitenlänge" },
      { links: "Quadrat-Umfang", rechts: "4 · Seitenlänge" },
    ],
    erklaerung: "Rechteck: A = Länge · Breite, U = 2 · (Länge + Breite). Quadrat: A = a · a, U = 4 · a.",
  },
  { typ: "input", frage: "Ein Rechteck ist 15 cm lang und 2 cm breit. Wie groß ist der Umfang?", loesung: ["34"], einheit: "cm", platzhalter: "Zahl", erklaerung: "Umfang = 2 · (15 + 2) = 34 cm." },
  { typ: "input", frage: "Ein quadratischer Garten hat die Seitenlänge 9 m. Wie lang muss der Zaun rundherum sein?", loesung: ["36"], einheit: "m", platzhalter: "Zahl", erklaerung: "Umfang = 4 · 9 = 36 m." },
];

export default FLAECHE_RS5;
