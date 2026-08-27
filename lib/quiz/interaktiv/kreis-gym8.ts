// ============================================================================
// Interaktive Aufgaben — Kreis: Umfang & Fläche · Gymnasium Kl. 8 · Bayern
// U = 2·π·r = π·d, A = π·r²; gerechnet mit π ≈ 3,14.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const KREIS_GYM8: Aufgabe[] = [
  { typ: "input", frage: "Ein Kreis hat den Radius 5 cm. Wie groß ist der Umfang? (U = 2 · π · r, π ≈ 3,14)", loesung: ["31,4"], einheit: "cm", platzhalter: "Zahl", erklaerung: "U = 2 · 3,14 · 5 = 31,4 cm." },
  { typ: "input", frage: "Ein Kreis hat den Durchmesser 10 cm. Wie groß ist der Umfang? (U = π · d, π ≈ 3,14)", loesung: ["31,4"], einheit: "cm", platzhalter: "Zahl", erklaerung: "U = 3,14 · 10 = 31,4 cm." },
  { typ: "input", frage: "Ein Kreis hat den Radius 2 cm. Wie groß ist der Flächeninhalt? (A = π · r², π ≈ 3,14)", loesung: ["12,56"], einheit: "cm²", platzhalter: "Zahl", erklaerung: "A = 3,14 · 2² = 3,14 · 4 = 12,56 cm²." },
  { typ: "input", frage: "Ein Kreis hat den Radius 10 cm. Wie groß ist der Flächeninhalt? (π ≈ 3,14)", loesung: ["314"], einheit: "cm²", platzhalter: "Zahl", erklaerung: "A = 3,14 · 10² = 3,14 · 100 = 314 cm²." },
  {
    typ: "mc",
    frage: "Mit welcher Formel berechnet man den Umfang eines Kreises?",
    antworten: ["2 · π · r", "π · r²", "π · r", "2 · r"],
    richtig: 0,
    erklaerung: "Der Umfang ist U = 2 · π · r (oder π · d).",
  },
  {
    typ: "mc",
    frage: "Mit welcher Formel berechnet man den Flächeninhalt eines Kreises?",
    antworten: ["π · r²", "2 · π · r", "π · d", "r²"],
    richtig: 0,
    erklaerung: "Der Flächeninhalt ist A = π · r².",
  },
  { typ: "input", frage: "Der Radius eines Kreises ist 6 cm. Wie groß ist der Durchmesser?", loesung: ["12"], einheit: "cm", platzhalter: "Zahl", erklaerung: "Durchmesser = 2 · Radius = 2 · 6 = 12 cm." },
  { typ: "input", frage: "Der Durchmesser eines Kreises ist 14 cm. Wie groß ist der Radius?", loesung: ["7"], einheit: "cm", platzhalter: "Zahl", erklaerung: "Radius = Durchmesser : 2 = 14 : 2 = 7 cm." },
  {
    typ: "luecke",
    frage: "Vervollständige.",
    segmente: ["Die Kreiszahl π ist ungefähr ", { luecke: ["3,14"] }, "."],
    erklaerung: "π ≈ 3,14 (genauer 3,14159…).",
  },
  { typ: "input", frage: "Ein Kreis hat den Radius 3 cm. Wie groß ist der Umfang? (π ≈ 3,14)", loesung: ["18,84"], einheit: "cm", platzhalter: "Zahl", erklaerung: "U = 2 · 3,14 · 3 = 18,84 cm." },
  { typ: "input", frage: "Ein Kreis hat den Radius 1 cm. Wie groß ist der Flächeninhalt? (π ≈ 3,14)", loesung: ["3,14"], einheit: "cm²", platzhalter: "Zahl", erklaerung: "A = 3,14 · 1² = 3,14 cm²." },
  {
    typ: "mc",
    frage: "Was für eine Zahl ist π?",
    antworten: ["eine irrationale Zahl", "genau 3", "eine ganze Zahl", "genau 22"],
    richtig: 0,
    erklaerung: "π hat unendlich viele, nicht periodische Nachkommastellen — sie ist irrational.",
  },
  { typ: "input", frage: "Ein Kreis hat den Durchmesser 20 cm. Wie groß ist der Umfang? (π ≈ 3,14)", loesung: ["62,8"], einheit: "cm", platzhalter: "Zahl", erklaerung: "U = 3,14 · 20 = 62,8 cm." },
  { typ: "input", frage: "Ein Kreis hat den Radius 5 cm. Wie groß ist der Flächeninhalt? (π ≈ 3,14)", loesung: ["78,5"], einheit: "cm²", platzhalter: "Zahl", erklaerung: "A = 3,14 · 5² = 3,14 · 25 = 78,5 cm²." },
  { typ: "input", frage: "Ein Kreis hat den Radius 4 cm. Wie groß ist der Umfang? (π ≈ 3,14)", loesung: ["25,12"], einheit: "cm", platzhalter: "Zahl", erklaerung: "U = 2 · 3,14 · 4 = 25,12 cm." },
];

export default KREIS_GYM8;
