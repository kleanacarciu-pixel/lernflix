// ============================================================================
// Interaktive Aufgaben — Kreis & Kreisteile · Realschule Kl. 9 · Bayern
// U = 2·π·r = π·d, A = π·r², Halb-/Viertelkreis; π ≈ 3,14.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const KREIS_RS9: Aufgabe[] = [
  { typ: "input", frage: "Ein Kreis hat den Radius 5 cm. Wie groß ist der Umfang? (U = 2 · π · r, π ≈ 3,14)", loesung: ["31,4"], einheit: "cm", platzhalter: "Zahl", erklaerung: "U = 2 · 3,14 · 5 = 31,4 cm." },
  { typ: "input", frage: "Ein Kreis hat den Durchmesser 10 cm. Wie groß ist der Umfang? (U = π · d, π ≈ 3,14)", loesung: ["31,4"], einheit: "cm", platzhalter: "Zahl", erklaerung: "U = 3,14 · 10 = 31,4 cm." },
  { typ: "input", frage: "Ein Kreis hat den Radius 2 cm. Wie groß ist der Flächeninhalt? (A = π · r², π ≈ 3,14)", loesung: ["12,56"], einheit: "cm²", platzhalter: "Zahl", erklaerung: "A = 3,14 · 4 = 12,56 cm²." },
  { typ: "input", frage: "Ein Kreis hat den Radius 10 cm. Wie groß ist der Flächeninhalt? (π ≈ 3,14)", loesung: ["314"], einheit: "cm²", platzhalter: "Zahl", erklaerung: "A = 3,14 · 100 = 314 cm²." },
  {
    typ: "mc",
    frage: "Mit welcher Formel berechnet man den Umfang eines Kreises?",
    antworten: ["2 · π · r", "π · r²", "π · r", "2 · r"],
    richtig: 0,
    erklaerung: "U = 2 · π · r (oder π · d).",
  },
  {
    typ: "mc",
    frage: "Mit welcher Formel berechnet man den Flächeninhalt eines Kreises?",
    antworten: ["π · r²", "2 · π · r", "π · d", "r²"],
    richtig: 0,
    erklaerung: "A = π · r².",
  },
  { typ: "input", frage: "Der Radius eines Kreises ist 6 cm. Wie groß ist der Durchmesser?", loesung: ["12"], einheit: "cm", platzhalter: "Zahl", erklaerung: "d = 2 · r = 12 cm." },
  { typ: "input", frage: "Der Durchmesser eines Kreises ist 14 cm. Wie groß ist der Radius?", loesung: ["7"], einheit: "cm", platzhalter: "Zahl", erklaerung: "r = d : 2 = 7 cm." },
  {
    typ: "luecke",
    frage: "Vervollständige.",
    segmente: ["Die Kreiszahl π ist ungefähr ", { luecke: ["3,14", "3,141", "3,1416", "3,14159"] }, "."],
    erklaerung: "π ≈ 3,14159…",
  },
  { typ: "input", frage: "Ein Halbkreis hat den Radius 10 cm. Wie groß ist seine Fläche? (π ≈ 3,14)", loesung: ["157"], einheit: "cm²", platzhalter: "Zahl", erklaerung: "Ganzer Kreis: 3,14 · 100 = 314 cm². Halbkreis: 314 : 2 = 157 cm²." },
  { typ: "input", frage: "Ein Kreis hat den Radius 3 cm. Wie groß ist der Umfang? (π ≈ 3,14)", loesung: ["18,84"], einheit: "cm", platzhalter: "Zahl", erklaerung: "U = 2 · 3,14 · 3 = 18,84 cm." },
  { typ: "input", frage: "Ein Kreis hat den Radius 1 cm. Wie groß ist der Flächeninhalt? (π ≈ 3,14)", loesung: ["3,14"], einheit: "cm²", platzhalter: "Zahl", erklaerung: "A = 3,14 · 1 = 3,14 cm²." },
  {
    typ: "mc",
    frage: "Was für eine Zahl ist π?",
    antworten: ["eine irrationale Zahl", "genau 3", "eine ganze Zahl", "genau 22"],
    richtig: 0,
    erklaerung: "π hat unendlich viele, nicht periodische Nachkommastellen — sie ist irrational.",
  },
  { typ: "input", frage: "Ein Viertelkreis hat den Radius 10 cm. Wie groß ist seine Fläche? (π ≈ 3,14)", loesung: ["78,5"], einheit: "cm²", platzhalter: "Zahl", erklaerung: "Ganzer Kreis: 314 cm². Viertel: 314 : 4 = 78,5 cm²." },
  { typ: "input", frage: "Ein Kreis hat den Radius 4 cm. Wie groß ist der Umfang? (π ≈ 3,14)", loesung: ["25,12"], einheit: "cm", platzhalter: "Zahl", erklaerung: "U = 2 · 3,14 · 4 = 25,12 cm." },
];

export default KREIS_RS9;
