// ============================================================================
// Interaktive Aufgaben — Formen & Muster · Grundschule Kl. 1 · Bayern
// Kreis, Dreieck, Viereck erkennen; Muster fortsetzen; Formen im Alltag.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const FORMEN_GS1: Aufgabe[] = [
  {
    typ: "mc",
    frage: "Wie viele Ecken hat ein Dreieck?",
    antworten: ["3", "4", "2", "0"],
    richtig: 0,
    erklaerung: "Ein Dreieck hat 3 Ecken und 3 Seiten.",
  },
  {
    typ: "mc",
    frage: "Wie viele Ecken hat ein Viereck?",
    antworten: ["4", "3", "5", "0"],
    richtig: 0,
    erklaerung: "Ein Viereck hat 4 Ecken und 4 Seiten.",
  },
  {
    typ: "mc",
    frage: "Welche Form hat keine Ecken?",
    antworten: ["der Kreis", "das Dreieck", "das Viereck", "das Rechteck"],
    richtig: 0,
    erklaerung: "Der Kreis ist ganz rund — er hat keine Ecken.",
  },
  {
    typ: "mc",
    frage: "Welche Form hat ein Ball?",
    antworten: ["rund wie eine Kugel", "eckig wie ein Würfel", "spitz wie ein Dreieck", "flach wie ein Blatt"],
    richtig: 0,
    erklaerung: "Ein Ball ist rund — eine Kugel.",
  },
  { typ: "input", frage: "Wie viele Seiten hat ein Quadrat?", loesung: ["4"], platzhalter: "Zahl", erklaerung: "Ein Quadrat hat 4 gleich lange Seiten." },
  { typ: "input", frage: "Schau auf die Reihe: Kreis, Dreieck, Kreis, Dreieck. Wie oft kommt das Dreieck vor?", loesung: ["2"], platzhalter: "Zahl", erklaerung: "In der Reihe steht das Dreieck 2-mal." },
  {
    typ: "mc",
    frage: "Muster: 🔴🔵🔴🔵🔴 … Welche Farbe kommt als Nächstes?",
    antworten: ["🔵 blau", "🔴 rot", "🟢 grün", "🟡 gelb"],
    richtig: 0,
    erklaerung: "Das Muster wechselt immer ab: rot, blau, rot, blau — als Nächstes kommt blau.",
  },
  {
    typ: "mc",
    frage: "Muster: ⭐⭐🌙⭐⭐🌙⭐⭐ … Was kommt als Nächstes?",
    antworten: ["🌙 Mond", "⭐ Stern", "☀️ Sonne", "🔴 Kreis"],
    richtig: 0,
    erklaerung: "Immer zwei Sterne, dann ein Mond — nach zwei Sternen kommt der Mond.",
  },
  {
    typ: "zuordnen",
    frage: "Ordne jedem Ding die passende Form zu.",
    paare: [
      { links: "Pizza", rechts: "Kreis" },
      { links: "Fenster", rechts: "Viereck" },
      { links: "Verkehrsschild „Vorfahrt achten“", rechts: "Dreieck" },
      { links: "Würfel", rechts: "eckiger Körper" },
    ],
    erklaerung: "Pizza = Kreis, Fenster = Viereck, das Vorfahrt-achten-Schild = Dreieck, Würfel = eckiger Körper.",
  },
  {
    typ: "luecke",
    frage: "Ecken zählen.",
    segmente: ["Ein Dreieck hat ", { luecke: ["3"] }, " Ecken, ein Viereck hat ", { luecke: ["4"] }, " Ecken."],
    erklaerung: "Dreieck: 3 Ecken. Viereck: 4 Ecken.",
  },
  { typ: "input", frage: "Du legst 2 Dreiecke und 3 Kreise. Wie viele Formen sind das zusammen?", loesung: ["5"], platzhalter: "Zahl", erklaerung: "2 + 3 = 5 Formen." },
  { typ: "input", frage: "Wie viele Ecken haben 2 Dreiecke zusammen?", loesung: ["6"], platzhalter: "Zahl", erklaerung: "3 + 3 = 6 Ecken." },
  {
    typ: "mc",
    frage: "Was ist ein Muster?",
    antworten: ["etwas, das sich immer wiederholt", "eine einzelne Form", "eine Zahl", "ein Fehler"],
    richtig: 0,
    erklaerung: "Bei einem Muster wiederholt sich etwas immer wieder, z. B. rot, blau, rot, blau.",
  },
  {
    typ: "sortieren",
    frage: "Ordne die Formen nach der Zahl ihrer Ecken — beginne bei den wenigsten: Fünfeck, Kreis, Viereck, Dreieck",
    richtig: ["Kreis", "Dreieck", "Viereck", "Fünfeck"],
    erklaerung: "Kreis 0 Ecken < Dreieck 3 < Viereck 4 < Fünfeck 5.",
  },
  {
    typ: "mc",
    frage: "Ein Quadrat und ein Rechteck: Was haben beide gemeinsam?",
    antworten: ["4 Ecken", "keine Ecken", "3 Seiten", "sie sind rund"],
    richtig: 0,
    erklaerung: "Beide sind Vierecke mit 4 Ecken.",
  },
];

export default FORMEN_GS1;
