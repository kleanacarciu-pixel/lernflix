// ============================================================================
// Interaktive Aufgaben — Potenzen & Wurzeln · Realschule Kl. 8 · Bayern
// Potenzen berechnen, Quadratwurzeln, Abschätzen.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const POTENZEN_WURZELN_RS8: Aufgabe[] = [
  { typ: "input", frage: "Berechne 3².", loesung: ["9"], platzhalter: "Zahl", erklaerung: "3 · 3 = 9." },
  { typ: "input", frage: "Berechne 2⁴.", loesung: ["16"], platzhalter: "Zahl", erklaerung: "2 · 2 · 2 · 2 = 16." },
  { typ: "input", frage: "Berechne 5³.", loesung: ["125"], platzhalter: "Zahl", erklaerung: "5 · 5 · 5 = 125." },
  { typ: "input", frage: "Berechne 10³.", loesung: ["1000", "1 000"], platzhalter: "Zahl", erklaerung: "10 · 10 · 10 = 1000." },
  { typ: "input", frage: "Berechne √16.", loesung: ["4"], platzhalter: "Zahl", erklaerung: "4 · 4 = 16, also √16 = 4." },
  { typ: "input", frage: "Berechne √81.", loesung: ["9"], platzhalter: "Zahl", erklaerung: "9 · 9 = 81, also √81 = 9." },
  { typ: "input", frage: "Berechne √100.", loesung: ["10"], platzhalter: "Zahl", erklaerung: "10 · 10 = 100, also √100 = 10." },
  { typ: "input", frage: "Berechne √64.", loesung: ["8"], platzhalter: "Zahl", erklaerung: "8 · 8 = 64, also √64 = 8." },
  {
    typ: "luecke",
    frage: "Berechne die Potenzen.",
    segmente: ["2³ = ", { luecke: ["8"] }, " und 4² = ", { luecke: ["16"] }, "."],
    erklaerung: "2³ = 8 und 4² = 16.",
  },
  {
    typ: "mc",
    frage: "Was ergibt a⁰ (für a ≠ 0)?",
    antworten: ["1", "0", "a", "unendlich"],
    richtig: 0,
    erklaerung: "Jede Zahl (außer 0) hoch 0 ergibt 1.",
  },
  { typ: "input", frage: "2² · 2³ = 2 hoch welcher Zahl? Gib nur den Exponenten an.", loesung: ["5"], platzhalter: "Zahl", erklaerung: "Bei gleicher Basis Exponenten addieren: 2 + 3 = 5." },
  {
    typ: "mc",
    frage: "Zwischen welchen ganzen Zahlen liegt √30?",
    antworten: ["5 und 6", "4 und 5", "6 und 7", "29 und 31"],
    richtig: 0,
    erklaerung: "25 < 30 < 36, also liegt √30 zwischen √25 = 5 und √36 = 6.",
  },
  { typ: "input", frage: "Ein Quadrat hat den Flächeninhalt 49 cm². Wie lang ist eine Seite?", loesung: ["7"], einheit: "cm", platzhalter: "Zahl", erklaerung: "Seite = √49 = 7 cm." },
  { typ: "input", frage: "Berechne √144.", loesung: ["12"], platzhalter: "Zahl", erklaerung: "12 · 12 = 144, also √144 = 12." },
  { typ: "input", frage: "Berechne 6².", loesung: ["36"], platzhalter: "Zahl", erklaerung: "6 · 6 = 36." },
];

export default POTENZEN_WURZELN_RS8;
