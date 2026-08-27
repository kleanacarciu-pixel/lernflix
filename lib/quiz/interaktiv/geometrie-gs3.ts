// ============================================================================
// Interaktive Aufgaben — Geometrie: Formen & Flächen · Grundschule Kl. 3
// Ebene Figuren und ihre Eigenschaften, Umfang mit Kästchen, Symmetrie.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const GEOMETRIE_GS3: Aufgabe[] = [
  {
    typ: "mc",
    frage: "Welche Figur hat 4 gleich lange Seiten und 4 rechte Winkel?",
    antworten: ["das Quadrat", "das Rechteck", "das Dreieck", "der Kreis"],
    richtig: 0,
    erklaerung: "Das Quadrat: alle 4 Seiten gleich lang, alle Winkel rechte Winkel.",
  },
  {
    typ: "mc",
    frage: "Was stimmt für ein Rechteck?",
    antworten: ["Gegenüberliegende Seiten sind gleich lang", "Alle 4 Seiten sind immer gleich lang", "Es hat 3 Ecken", "Es hat keine Ecken"],
    richtig: 0,
    erklaerung: "Beim Rechteck sind die gegenüberliegenden Seiten gleich lang.",
  },
  { typ: "input", frage: "Wie viele Ecken hat ein Fünfeck?", loesung: ["5"], platzhalter: "Zahl", erklaerung: "Ein Fünfeck hat 5 Ecken und 5 Seiten." },
  { typ: "input", frage: "Ein Rechteck ist 5 Kästchen lang und 3 Kästchen breit. Wie viele Kästchen passen hinein?", loesung: ["15"], platzhalter: "Zahl", erklaerung: "5 · 3 = 15 Kästchen." },
  { typ: "input", frage: "Ein Quadrat hat die Seitenlänge 4 cm. Wie lang ist der Weg einmal außen herum (Umfang)?", loesung: ["16"], einheit: "cm", platzhalter: "Zahl", erklaerung: "4 + 4 + 4 + 4 = 16 cm." },
  { typ: "input", frage: "Ein Rechteck ist 6 cm lang und 2 cm breit. Berechne den Umfang.", loesung: ["16"], einheit: "cm", platzhalter: "Zahl", erklaerung: "6 + 2 + 6 + 2 = 16 cm." },
  {
    typ: "mc",
    frage: "Welcher Buchstabe ist achsensymmetrisch (hat eine Spiegelachse)?",
    antworten: ["A", "F", "G", "J"],
    richtig: 0,
    erklaerung: "Das A kann man in der Mitte spiegeln — links und rechts sind gleich.",
  },
  {
    typ: "mc",
    frage: "Was ist ein rechter Winkel?",
    antworten: ["eine Ecke wie beim Blatt Papier", "ein ganz spitzer Winkel", "ein runder Winkel", "ein Winkel ohne Ecke"],
    richtig: 0,
    erklaerung: "Ein rechter Winkel sieht aus wie die Ecke eines Blattes Papier (90°).",
  },
  {
    typ: "luecke",
    frage: "Ecken und Seiten.",
    segmente: ["Ein Dreieck hat ", { luecke: ["3"] }, " Seiten, ein Sechseck hat ", { luecke: ["6"] }, " Seiten."],
    erklaerung: "Dreieck: 3 Seiten. Sechseck: 6 Seiten.",
  },
  {
    typ: "zuordnen",
    frage: "Ordne jeder Figur ihre Eigenschaft zu.",
    paare: [
      { links: "Kreis", rechts: "keine Ecken" },
      { links: "Dreieck", rechts: "3 Ecken" },
      { links: "Quadrat", rechts: "4 gleich lange Seiten" },
      { links: "Rechteck", rechts: "gegenüberliegende Seiten gleich lang" },
    ],
    erklaerung: "Kreis: rund. Dreieck: 3 Ecken. Quadrat: 4 gleiche Seiten. Rechteck: Gegenseiten gleich.",
  },
  { typ: "input", frage: "Du legst ein großes Quadrat aus 4 kleinen Quadraten (2 mal 2). Wie viele kleine Quadrate brauchst du für 3 mal 3?", loesung: ["9"], platzhalter: "Zahl", erklaerung: "3 · 3 = 9 kleine Quadrate." },
  { typ: "input", frage: "Wie viele rechte Winkel hat ein Rechteck?", loesung: ["4"], platzhalter: "Zahl", erklaerung: "Alle 4 Ecken eines Rechtecks sind rechte Winkel." },
  {
    typ: "mc",
    frage: "Ein Schmetterling ist symmetrisch. Was heißt das?",
    antworten: ["Beide Flügelhälften sehen gespiegelt gleich aus", "Er ist bunt", "Er kann fliegen", "Er hat 6 Beine"],
    richtig: 0,
    erklaerung: "Symmetrisch: Eine Hälfte ist das Spiegelbild der anderen.",
  },
  { typ: "input", frage: "Ein Zaun um ein quadratisches Beet ist insgesamt 20 m lang. Wie lang ist eine Seite des Beets?", loesung: ["5"], einheit: "m", platzhalter: "Zahl", erklaerung: "20 : 4 = 5 m." },
  {
    typ: "sortieren",
    frage: "Ordne die Figuren nach der Zahl ihrer Ecken — beginne bei den wenigsten: Sechseck, Dreieck, Viereck, Fünfeck",
    richtig: ["Dreieck", "Viereck", "Fünfeck", "Sechseck"],
    erklaerung: "3 < 4 < 5 < 6 Ecken.",
  },
];

export default GEOMETRIE_GS3;
