// ============================================================================
// Interaktive Aufgaben — Dreiecke & Flächen · Realschule Kl. 7 · Bayern
// Winkelsumme, Dreiecksarten, Flächen von Dreieck/Parallelogramm.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const DREIECKE_RS7: Aufgabe[] = [
  { typ: "input", frage: "Wie groß ist die Winkelsumme in einem Dreieck (in Grad)?", loesung: ["180"], einheit: "°", platzhalter: "Zahl", erklaerung: "Die drei Innenwinkel ergeben zusammen immer 180°." },
  { typ: "input", frage: "Zwei Winkel eines Dreiecks sind 70° und 60°. Wie groß ist der dritte?", loesung: ["50"], einheit: "°", platzhalter: "Zahl", erklaerung: "180° − 70° − 60° = 50°." },
  { typ: "input", frage: "Ein Dreieck hat die Grundseite 8 cm und die Höhe 5 cm. Wie groß ist der Flächeninhalt?", loesung: ["20"], einheit: "cm²", platzhalter: "Zahl", erklaerung: "A = ½ · g · h = ½ · 8 · 5 = 20 cm²." },
  { typ: "input", frage: "Ein Dreieck hat die Grundseite 12 cm und die Höhe 4 cm. Wie groß ist der Flächeninhalt?", loesung: ["24"], einheit: "cm²", platzhalter: "Zahl", erklaerung: "A = ½ · 12 · 4 = 24 cm²." },
  { typ: "input", frage: "Ein Parallelogramm hat die Grundseite 9 cm und die Höhe 4 cm. Wie groß ist der Flächeninhalt?", loesung: ["36"], einheit: "cm²", platzhalter: "Zahl", erklaerung: "A = g · h = 9 · 4 = 36 cm²." },
  {
    typ: "mc",
    frage: "Was kennzeichnet ein gleichschenkliges Dreieck?",
    antworten: ["zwei gleich lange Seiten", "drei verschiedene Seiten", "einen Winkel von 100°", "immer einen rechten Winkel"],
    richtig: 0,
    erklaerung: "Ein gleichschenkliges Dreieck hat (mindestens) zwei gleich lange Seiten — die Schenkel.",
  },
  {
    typ: "mc",
    frage: "Wie groß ist jeder Winkel in einem gleichseitigen Dreieck?",
    antworten: ["60°", "90°", "45°", "120°"],
    richtig: 0,
    erklaerung: "180° : 3 = 60°.",
  },
  {
    typ: "luecke",
    frage: "Ergänze die fehlende Gradzahl im rechtwinkligen Dreieck.",
    segmente: ["90° + 30° + ", { luecke: ["60"] }, "° = 180°."],
    erklaerung: "180° − 90° − 30° = 60°.",
  },
  { typ: "input", frage: "Ein gleichschenkliges Dreieck hat zwei Basiswinkel von je 65°. Wie groß ist der Winkel an der Spitze?", loesung: ["50"], einheit: "°", platzhalter: "Zahl", erklaerung: "180° − 65° − 65° = 50°." },
  { typ: "input", frage: "Ein Rechteck ist 11 cm lang und 6 cm breit. Wie groß ist der Flächeninhalt?", loesung: ["66"], einheit: "cm²", platzhalter: "Zahl", erklaerung: "A = 11 · 6 = 66 cm²." },
  { typ: "input", frage: "Ein Dreieck hat den Flächeninhalt 18 cm² und die Grundseite 6 cm. Wie groß ist die Höhe?", loesung: ["6"], einheit: "cm", platzhalter: "Zahl", erklaerung: "h = 2 · A : g = 2 · 18 : 6 = 6 cm." },
  {
    typ: "mc",
    frage: "Ein Dreieck mit einem Winkel größer als 90° heißt …",
    antworten: ["stumpfwinklig", "rechtwinklig", "spitzwinklig", "gleichseitig"],
    richtig: 0,
    erklaerung: "Ein Dreieck mit einem stumpfen Winkel (> 90°) heißt stumpfwinklig.",
  },
  { typ: "input", frage: "Ein Quadrat hat die Seitenlänge 9 cm. Wie groß ist der Flächeninhalt?", loesung: ["81"], einheit: "cm²", platzhalter: "Zahl", erklaerung: "A = 9 · 9 = 81 cm²." },
  {
    typ: "zuordnen",
    frage: "Ordne jeder Figur die Formel für den Flächeninhalt zu.",
    paare: [
      { links: "Dreieck", rechts: "½ · g · h" },
      { links: "Parallelogramm", rechts: "g · h" },
      { links: "Rechteck", rechts: "Länge · Breite" },
      { links: "Quadrat", rechts: "a · a" },
    ],
    erklaerung: "Dreieck: ½·g·h; Parallelogramm: g·h; Rechteck: Länge·Breite; Quadrat: a·a.",
  },
  { typ: "input", frage: "In einem rechtwinkligen Dreieck ist ein Winkel 90°, ein anderer 45°. Wie groß ist der dritte?", loesung: ["45"], einheit: "°", platzhalter: "Zahl", erklaerung: "180° − 90° − 45° = 45°." },
];

export default DREIECKE_RS7;
