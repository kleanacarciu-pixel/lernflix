// ============================================================================
// Interaktive Aufgaben — Bruchrechnen — Grundlagen · Mittelschule Kl. 6 · Bayern
// Bruch als Anteil, Kürzen, Erweitern, gleichnamige Brüche addieren, Alltag.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const BRUCHRECHNEN_MS6: Aufgabe[] = [
  { typ: "input", frage: "Eine Schokolade hat 12 Stücke. Du isst 3 Stücke. Welcher Bruchteil ist das? (Vollständig gekürzt.)", loesung: ["1/4"], platzhalter: "z. B. 1/4", erklaerung: "3 von 12 Stücken: 3/12 = 1/4 (mit 3 gekürzt)." },
  { typ: "input", frage: "Kürze den Bruch 4/8 vollständig.", loesung: ["1/2"], platzhalter: "z. B. 1/2", erklaerung: "4 und 8 durch 4 teilen: 4/8 = 1/2." },
  { typ: "input", frage: "Kürze den Bruch 10/15 vollständig.", loesung: ["2/3"], platzhalter: "z. B. 2/3", erklaerung: "10 und 15 durch 5 teilen: 10/15 = 2/3." },
  { typ: "input", frage: "Erweitere 1/3 auf den Nenner 12. Wie heißt der neue Zähler?", loesung: ["4"], platzhalter: "Zahl", erklaerung: "12 : 3 = 4, also auch den Zähler mal 4: 1 · 4 = 4. Der Bruch ist 4/12." },
  { typ: "input", frage: "Berechne 3/8 + 2/8.", loesung: ["5/8"], platzhalter: "z. B. 5/8", erklaerung: "Gleicher Nenner: Zähler addieren: 3 + 2 = 5, also 5/8." },
  { typ: "input", frage: "Berechne 7/10 − 3/10. (Vollständig gekürzt.)", loesung: ["2/5"], platzhalter: "z. B. 2/5", erklaerung: "7 − 3 = 4, also 4/10 = 2/5 (mit 2 gekürzt)." },
  { typ: "input", frage: "Wie viel sind 1/2 von 18?", loesung: ["9"], platzhalter: "Zahl", erklaerung: "18 : 2 = 9." },
  { typ: "input", frage: "Wie viel sind 3/4 von 20?", loesung: ["15"], platzhalter: "Zahl", erklaerung: "20 : 4 = 5 (das ist 1/4), mal 3 = 15." },
  {
    typ: "mc",
    frage: "Welches Bild passt zu 2/5?",
    antworten: ["2 von 5 gleich großen Teilen sind gefärbt", "5 von 2 Teilen sind gefärbt", "2 ganze Kreise und 5 Teile", "alle 5 Teile sind gefärbt"],
    richtig: 0,
    erklaerung: "Der Nenner 5 sagt: in 5 gleiche Teile geteilt. Der Zähler 2 sagt: 2 davon sind gemeint.",
  },
  {
    typ: "mc",
    frage: "Welcher Bruch ist gleich groß wie 1/2?",
    antworten: ["3/6", "2/3", "1/3", "3/4"],
    richtig: 0,
    erklaerung: "3/6 lässt sich mit 3 kürzen: 3/6 = 1/2.",
  },
  {
    typ: "luecke",
    frage: "Erweitere die Brüche.",
    segmente: ["1/2 = ", { luecke: ["2"] }, "/4  und  1/4 = ", { luecke: ["2"] }, "/8."],
    erklaerung: "1/2 mit 2 erweitert = 2/4. 1/4 mit 2 erweitert = 2/8.",
  },
  {
    typ: "zuordnen",
    frage: "Ordne jedem Bruch den vollständig gekürzten Bruch zu.",
    paare: [
      { links: "2/4", rechts: "1/2" },
      { links: "6/9", rechts: "2/3" },
      { links: "5/20", rechts: "1/4" },
      { links: "8/10", rechts: "4/5" },
    ],
    erklaerung: "2/4 = 1/2 (mit 2), 6/9 = 2/3 (mit 3), 5/20 = 1/4 (mit 5), 8/10 = 4/5 (mit 2).",
  },
  {
    typ: "sortieren",
    frage: "Ordne die Brüche der Größe nach — beginne beim kleinsten.",
    richtig: ["1/8", "1/4", "1/2", "3/4"],
    erklaerung: "Alle auf Achtel gebracht: 1/8 < 2/8 (= 1/4) < 4/8 (= 1/2) < 6/8 (= 3/4).",
  },
  { typ: "input", frage: "In einer Klasse sind 24 Kinder. 1/3 davon fährt mit dem Bus. Wie viele Kinder sind das?", loesung: ["8"], platzhalter: "Zahl", erklaerung: "24 : 3 = 8 Kinder." },
  {
    typ: "mc",
    frage: "Welcher Bruch ist größer: 2/3 oder 1/3?",
    antworten: ["2/3", "1/3", "Sie sind gleich groß", "Das kann man nicht vergleichen"],
    richtig: 0,
    erklaerung: "Gleicher Nenner: Der Bruch mit dem größeren Zähler ist größer, also 2/3.",
  },
];

export default BRUCHRECHNEN_MS6;
