// ============================================================================
// Interaktive Aufgaben — Wurzeln & reelle Zahlen · Gymnasium Kl. 8 · Bayern
// Quadratwurzeln, Quadratzahlen, irrationale Zahlen, Abschätzen.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const WURZELN_GYM8: Aufgabe[] = [
  { typ: "input", frage: "Berechne √25.", loesung: ["5"], platzhalter: "Zahl", erklaerung: "5 · 5 = 25, also √25 = 5." },
  { typ: "input", frage: "Berechne √81.", loesung: ["9"], platzhalter: "Zahl", erklaerung: "9 · 9 = 81, also √81 = 9." },
  { typ: "input", frage: "Berechne √100.", loesung: ["10"], platzhalter: "Zahl", erklaerung: "10 · 10 = 100, also √100 = 10." },
  { typ: "input", frage: "Berechne √49.", loesung: ["7"], platzhalter: "Zahl", erklaerung: "7 · 7 = 49, also √49 = 7." },
  { typ: "input", frage: "Berechne √144.", loesung: ["12"], platzhalter: "Zahl", erklaerung: "12 · 12 = 144, also √144 = 12." },
  { typ: "input", frage: "Berechne √1.", loesung: ["1"], platzhalter: "Zahl", erklaerung: "1 · 1 = 1, also √1 = 1." },
  { typ: "input", frage: "Berechne √0.", loesung: ["0"], platzhalter: "Zahl", erklaerung: "0 · 0 = 0, also √0 = 0." },
  {
    typ: "mc",
    frage: "Zwischen welchen ganzen Zahlen liegt √20?",
    antworten: ["4 und 5", "3 und 4", "5 und 6", "20 und 21"],
    richtig: 0,
    erklaerung: "16 < 20 < 25, also liegt √20 zwischen √16 = 4 und √25 = 5.",
  },
  { typ: "input", frage: "Berechne √36.", loesung: ["6"], platzhalter: "Zahl", erklaerung: "6 · 6 = 36, also √36 = 6." },
  { typ: "input", frage: "Berechne (√7)².", loesung: ["7"], platzhalter: "Zahl", erklaerung: "Wurzelziehen und Quadrieren heben sich auf: (√7)² = 7." },
  {
    typ: "mc",
    frage: "Was für eine Zahl ist √2?",
    antworten: ["eine irrationale Zahl", "eine ganze Zahl", "eine natürliche Zahl", "genau 1"],
    richtig: 0,
    erklaerung: "√2 ≈ 1,414… hat unendlich viele, nicht periodische Nachkommastellen — sie ist irrational.",
  },
  {
    typ: "luecke",
    frage: "Berechne die Wurzeln.",
    segmente: ["√64 = ", { luecke: ["8"] }, " und √9 = ", { luecke: ["3"] }, "."],
    erklaerung: "8 · 8 = 64 und 3 · 3 = 9.",
  },
  { typ: "input", frage: "Berechne √121.", loesung: ["11"], platzhalter: "Zahl", erklaerung: "11 · 11 = 121, also √121 = 11." },
  {
    typ: "mc",
    frage: "Welche dieser Zahlen ist eine Quadratzahl?",
    antworten: ["64", "60", "50", "72"],
    richtig: 0,
    erklaerung: "64 = 8². Die anderen sind keine Quadratzahlen.",
  },
  { typ: "input", frage: "Ein Quadrat hat den Flächeninhalt 16 cm². Wie lang ist eine Seite?", loesung: ["4"], einheit: "cm", platzhalter: "Zahl", erklaerung: "Seite = √Fläche = √16 = 4 cm." },
];

export default WURZELN_GYM8;
