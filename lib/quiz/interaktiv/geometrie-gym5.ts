// ============================================================================
// Interaktive Aufgaben — Geometrie & Koordinaten · Gymnasium Kl. 5
// Grundbegriffe (Punkt, Gerade, Strecke, parallel, senkrecht), Koordinaten.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const GEOMETRIE_GYM5: Aufgabe[] = [
  {
    typ: "mc",
    frage: "Wie nennt man zwei Geraden, die sich nie schneiden?",
    antworten: ["parallel", "senkrecht", "schräg", "gleich"],
    richtig: 0,
    erklaerung: "Geraden, die immer denselben Abstand haben und sich nie treffen, sind parallel.",
  },
  {
    typ: "mc",
    frage: "Wie nennt man zwei Geraden, die sich im rechten Winkel (90°) schneiden?",
    antworten: ["senkrecht", "parallel", "spitz", "stumpf"],
    richtig: 0,
    erklaerung: "Schneiden sich zwei Geraden im 90°-Winkel, stehen sie senkrecht aufeinander.",
  },
  {
    typ: "mc",
    frage: "Wie heißt eine gerade Linie, die an beiden Enden begrenzt ist (zwischen zwei Punkten)?",
    antworten: ["Strecke", "Gerade", "Halbgerade", "Kurve"],
    richtig: 0,
    erklaerung: "Eine Strecke verbindet zwei Punkte und hat einen Anfang und ein Ende.",
  },
  { typ: "input", frage: "Wie viele Grad hat ein rechter Winkel?", loesung: ["90"], einheit: "°", platzhalter: "Zahl", erklaerung: "Ein rechter Winkel misst genau 90°." },
  {
    typ: "luecke",
    frage: "Der Punkt P(3|2) im Koordinatensystem.",
    segmente: ["Er liegt bei x = ", { luecke: ["3"] }, " und y = ", { luecke: ["2"] }, "."],
    erklaerung: "Beim Punkt P(3|2) ist 3 die x-Koordinate (nach rechts) und 2 die y-Koordinate (nach oben).",
  },
  {
    typ: "mc",
    frage: "Welches Zeichen bedeutet „ist parallel zu“?",
    antworten: ["∥", "⊥", "=", "<"],
    richtig: 0,
    erklaerung: "Das Zeichen ∥ bedeutet „parallel“, ⊥ bedeutet „senkrecht“.",
  },
  {
    typ: "mc",
    frage: "Welches Zeichen bedeutet „steht senkrecht auf“?",
    antworten: ["⊥", "∥", "+", "≈"],
    richtig: 0,
    erklaerung: "Das Zeichen ⊥ steht für „senkrecht“.",
  },
  { typ: "input", frage: "Ein Punkt hat die Koordinaten (4|5). Wie groß ist die x-Koordinate?", loesung: ["4"], platzhalter: "Zahl", erklaerung: "Die erste Zahl im Punkt ist die x-Koordinate: 4." },
  { typ: "input", frage: "Ein Punkt hat die Koordinaten (4|5). Wie groß ist die y-Koordinate?", loesung: ["5"], platzhalter: "Zahl", erklaerung: "Die zweite Zahl im Punkt ist die y-Koordinate: 5." },
  {
    typ: "mc",
    frage: "Wie nennt man eine Linie, die in beide Richtungen unendlich weitergeht?",
    antworten: ["Gerade", "Strecke", "Punkt", "Ecke"],
    richtig: 0,
    erklaerung: "Eine Gerade hat weder Anfang noch Ende — sie geht endlos weiter.",
  },
  { typ: "input", frage: "Wie viele rechte Winkel hat ein Rechteck?", loesung: ["4"], platzhalter: "Zahl", erklaerung: "Ein Rechteck hat an allen 4 Ecken einen rechten Winkel." },
  {
    typ: "mc",
    frage: "Der Abstand zwischen zwei parallelen Geraden ist …",
    antworten: ["überall gleich", "überall verschieden", "null", "unendlich"],
    richtig: 0,
    erklaerung: "Parallele Geraden haben überall denselben Abstand.",
  },
  { typ: "input", frage: "Wie heißt der Punkt (0|0) im Koordinatensystem?", loesung: ["Ursprung", "der ursprung"], platzhalter: "Wort", erklaerung: "Der Punkt (0|0), in dem sich die Achsen treffen, heißt Ursprung." },
  {
    typ: "mc",
    frage: "Wie heißt die waagerechte Achse im Koordinatensystem?",
    antworten: ["x-Achse", "y-Achse", "z-Achse", "Mittelachse"],
    richtig: 0,
    erklaerung: "Die waagerechte Achse ist die x-Achse, die senkrechte die y-Achse.",
  },
  {
    typ: "zuordnen",
    frage: "Ordne die Begriffe ihrer Beschreibung zu.",
    paare: [
      { links: "Strecke", rechts: "begrenzt zwischen zwei Punkten" },
      { links: "Gerade", rechts: "endlos in beide Richtungen" },
      { links: "parallel", rechts: "schneiden sich nie" },
      { links: "senkrecht", rechts: "Winkel von 90°" },
    ],
    erklaerung: "Strecke: begrenzt; Gerade: endlos; parallel: kein Schnittpunkt; senkrecht: 90°-Winkel.",
  },
];

export default GEOMETRIE_GYM5;
