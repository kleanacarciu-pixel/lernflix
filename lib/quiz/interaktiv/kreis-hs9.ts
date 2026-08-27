// ============================================================================
// Interaktive Aufgaben — Kreis: Umfang & Fläche · Hauptschule Kl. 9 · Bayern
// U = π·d und A = π·r² mit π ≈ 3,14, runde Dinge aus dem Alltag.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const KREIS_HS9: Aufgabe[] = [
  {
    typ: "mc",
    frage: "Wie heißt die Strecke vom Mittelpunkt bis zum Rand eines Kreises?",
    antworten: ["Radius", "Durchmesser", "Umfang", "Sehne"],
    richtig: 0,
    erklaerung: "Mittelpunkt bis Rand = Radius. Ganz durch den Kreis = Durchmesser.",
  },
  { typ: "input", frage: "Ein Kreis hat den Radius 4 cm. Wie lang ist der Durchmesser?", loesung: ["8"], einheit: "cm", platzhalter: "Zahl", erklaerung: "d = 2 · r = 8 cm." },
  { typ: "input", frage: "Ein Kreis hat den Durchmesser 12 cm. Wie lang ist der Radius?", loesung: ["6"], einheit: "cm", platzhalter: "Zahl", erklaerung: "r = d : 2 = 6 cm." },
  {
    typ: "mc",
    frage: "Mit welcher Formel berechnet man den Umfang eines Kreises?",
    antworten: ["U = π · d", "U = π · r²", "U = 4 · r", "U = d · d"],
    richtig: 0,
    erklaerung: "U = π · d (oder U = 2 · π · r).",
  },
  { typ: "input", frage: "Berechne den Umfang eines Kreises mit d = 10 cm. (π ≈ 3,14)", loesung: ["31,4"], einheit: "cm", platzhalter: "z. B. 31,4", erklaerung: "U = 3,14 · 10 = 31,4 cm." },
  { typ: "input", frage: "Berechne den Umfang eines Kreises mit r = 5 cm. (π ≈ 3,14)", loesung: ["31,4"], einheit: "cm", platzhalter: "z. B. 31,4", erklaerung: "d = 10 cm, U = 3,14 · 10 = 31,4 cm." },
  { typ: "input", frage: "Berechne die Fläche eines Kreises mit r = 10 cm. (π ≈ 3,14)", loesung: ["314"], einheit: "cm²", platzhalter: "Zahl", erklaerung: "A = 3,14 · 10² = 314 cm²." },
  { typ: "input", frage: "Berechne die Fläche eines Kreises mit r = 3 cm. (π ≈ 3,14)", loesung: ["28,26"], einheit: "cm²", platzhalter: "z. B. 28,26", erklaerung: "A = 3,14 · 9 = 28,26 cm²." },
  {
    typ: "luecke",
    frage: "Die Kreiszahl.",
    segmente: ["π ≈ ", { luecke: ["3,14", "3,141", "3,1416", "3,14159"] }, ". Der Umfang ist π mal der ", { luecke: ["Durchmesser"] }, " (Radius/Durchmesser)."],
    erklaerung: "π ≈ 3,14 und U = π · d.",
  },
  { typ: "input", frage: "Ein rundes Trampolin hat den Durchmesser 3 m. Wie lang ist der Rand (Umfang)? (π ≈ 3,14; als Kommazahl)", loesung: ["9,42"], einheit: "m", platzhalter: "z. B. 9,42", erklaerung: "U = 3,14 · 3 = 9,42 m." },
  { typ: "input", frage: "Ein Fahrrad-Reifen hat den Durchmesser 70 cm. Wie weit rollt das Rad bei einer Umdrehung? (π ≈ 3,14; als Kommazahl in cm)", loesung: ["219,8", "219,80"], einheit: "cm", platzhalter: "z. B. 219,8", erklaerung: "Eine Umdrehung = Umfang = 3,14 · 70 = 219,8 cm." },
  {
    typ: "mc",
    frage: "Eine runde Pizza hat den Durchmesser 32 cm. Wie groß ist ihr Radius?",
    antworten: ["16 cm", "32 cm", "64 cm", "8 cm"],
    richtig: 0,
    erklaerung: "r = 32 : 2 = 16 cm.",
  },
  {
    typ: "zuordnen",
    frage: "π ≈ 3,14. Ordne jedem Kreis den Umfang zu.",
    paare: [
      { links: "d = 1 cm", rechts: "3,14 cm" },
      { links: "d = 2 cm", rechts: "6,28 cm" },
      { links: "d = 5 cm", rechts: "15,7 cm" },
      { links: "d = 20 cm", rechts: "62,8 cm" },
    ],
    erklaerung: "U = 3,14 · d: 3,14; 6,28; 15,7; 62,8 cm.",
  },
  {
    typ: "mc",
    frage: "Ein Kreis hat den Umfang 62,8 cm. Wie groß ist der Durchmesser? (π ≈ 3,14)",
    antworten: ["20 cm", "10 cm", "62,8 cm", "31,4 cm"],
    richtig: 0,
    erklaerung: "d = U : π = 62,8 : 3,14 = 20 cm.",
  },
  {
    typ: "sortieren",
    frage: "Ordne die Kreise nach ihrem Umfang aufsteigend — beginne beim kleinsten: d = 4 cm, r = 3 cm, d = 8 cm, r = 5 cm",
    richtig: ["d = 4 cm", "r = 3 cm", "d = 8 cm", "r = 5 cm"],
    erklaerung: "Durchmesser: 4 cm < 6 cm (r = 3) < 8 cm < 10 cm (r = 5) — größerer Durchmesser heißt größerer Umfang.",
  },
];

export default KREIS_HS9;
