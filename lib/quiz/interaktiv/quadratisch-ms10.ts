// ============================================================================
// Interaktive Aufgaben — Quadratische Zusammenhänge · Mittelschule Kl. 10
// Parabel y = x², Quadratzahlen, quadratische Zusammenhänge im Alltag.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const QUADRATISCH_MS10: Aufgabe[] = [
  {
    typ: "mc",
    frage: "Wie heißt der Graph der Funktion y = x²?",
    antworten: ["Parabel", "Gerade", "Hyperbel", "Kreis"],
    richtig: 0,
    erklaerung: "y = x² ergibt eine (nach oben geöffnete) Parabel.",
  },
  { typ: "input", frage: "Gegeben ist y = x². Berechne y für x = 5.", loesung: ["25"], platzhalter: "Zahl", erklaerung: "y = 5² = 25." },
  { typ: "input", frage: "Gegeben ist y = x². Berechne y für x = −3.", loesung: ["9"], platzhalter: "Zahl", erklaerung: "y = (−3)² = (−3) · (−3) = 9." },
  { typ: "input", frage: "Gegeben ist y = x² + 2. Berechne y für x = 3.", loesung: ["11"], platzhalter: "Zahl", erklaerung: "y = 3² + 2 = 9 + 2 = 11." },
  { typ: "input", frage: "Gegeben ist y = 2x². Berechne y für x = 4.", loesung: ["32"], platzhalter: "Zahl", erklaerung: "y = 2 · 4² = 2 · 16 = 32." },
  {
    typ: "mc",
    frage: "Für welche x-Werte gilt x² = 16?",
    antworten: ["x = 4 und x = −4", "nur x = 4", "nur x = 8", "x = 4 und x = 8"],
    richtig: 0,
    erklaerung: "4² = 16 und (−4)² = 16 — beide Lösungen gelten.",
  },
  {
    typ: "mc",
    frage: "Wo liegt der tiefste Punkt (Scheitel) der Parabel y = x²?",
    antworten: ["im Nullpunkt (0|0)", "bei (1|1)", "bei (0|1)", "die Parabel hat keinen tiefsten Punkt"],
    richtig: 0,
    erklaerung: "Für x = 0 ist y = 0 — kleiner wird y = x² nie. Scheitel: (0|0).",
  },
  {
    typ: "luecke",
    frage: "Quadratzahlen.",
    segmente: ["11² = ", { luecke: ["121"] }, " und 13² = ", { luecke: ["169"] }, "."],
    erklaerung: "11 · 11 = 121 und 13 · 13 = 169.",
  },
  {
    typ: "mc",
    frage: "Was passiert mit y = x², wenn man x verdoppelt?",
    antworten: ["y wird viermal so groß", "y verdoppelt sich", "y bleibt gleich", "y wird achtmal so groß"],
    richtig: 0,
    erklaerung: "(2x)² = 4x² — quadratischer Zusammenhang: doppeltes x → vierfaches y.",
  },
  { typ: "input", frage: "Ein Quadrat hat die Seitenlänge 7 cm. Berechne seinen Flächeninhalt.", loesung: ["49"], einheit: "cm²", platzhalter: "Zahl", erklaerung: "A = 7² = 49 cm²." },
  { typ: "input", frage: "Ein Quadrat hat den Flächeninhalt 81 m². Wie lang ist eine Seite?", loesung: ["9"], einheit: "m", platzhalter: "Zahl", erklaerung: "9 · 9 = 81, also Seite = √81 = 9 m." },
  {
    typ: "zuordnen",
    frage: "y = x². Ordne jedem x-Wert den y-Wert zu.",
    paare: [
      { links: "x = 2", rechts: "y = 4" },
      { links: "x = 6", rechts: "y = 36" },
      { links: "x = 10", rechts: "y = 100" },
      { links: "x = 12", rechts: "y = 144" },
    ],
    erklaerung: "2² = 4, 6² = 36, 10² = 100, 12² = 144.",
  },
  {
    typ: "mc",
    frage: "Welcher Punkt liegt auf der Parabel y = x²?",
    antworten: ["(3|9)", "(3|6)", "(9|3)", "(2|2)"],
    richtig: 0,
    erklaerung: "3² = 9, also liegt (3|9) auf der Parabel.",
  },
  { typ: "input", frage: "Der Bremsweg (in m) bei Tempo v (km/h) ist ungefähr (v : 10)². Wie lang ist der Bremsweg bei 50 km/h?", loesung: ["25"], einheit: "m", platzhalter: "Zahl", erklaerung: "(50 : 10)² = 5² = 25 m." },
  {
    typ: "sortieren",
    frage: "Ordne die Werte aufsteigend — beginne beim kleinsten: 3², 2³, 4², 10",
    richtig: ["2³", "3²", "10", "4²"],
    erklaerung: "2³ = 8 < 3² = 9 < 10 < 4² = 16.",
  },
];

export default QUADRATISCH_MS10;
