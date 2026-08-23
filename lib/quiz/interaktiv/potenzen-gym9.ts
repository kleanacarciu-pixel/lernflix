// ============================================================================
// Interaktive Aufgaben — Potenzen & Potenzgesetze · Gymnasium Kl. 9
// Potenzen berechnen, Potenzgesetze, Zehnerpotenzen, a⁰ und a⁻¹.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const POTENZEN_GYM9: Aufgabe[] = [
  { typ: "input", frage: "Berechne 2³.", loesung: ["8"], platzhalter: "Zahl", erklaerung: "2 · 2 · 2 = 8." },
  { typ: "input", frage: "Berechne 3².", loesung: ["9"], platzhalter: "Zahl", erklaerung: "3 · 3 = 9." },
  { typ: "input", frage: "Berechne 10⁴.", loesung: ["10000", "10 000"], platzhalter: "Zahl", erklaerung: "10⁴ = 10 000 (eine 1 mit vier Nullen)." },
  { typ: "input", frage: "Berechne 5².", loesung: ["25"], platzhalter: "Zahl", erklaerung: "5 · 5 = 25." },
  { typ: "input", frage: "Berechne 2⁵.", loesung: ["32"], platzhalter: "Zahl", erklaerung: "2 · 2 · 2 · 2 · 2 = 32." },
  {
    typ: "mc",
    frage: "Wie lautet das Potenzgesetz für aⁿ · aᵐ?",
    antworten: ["aⁿ⁺ᵐ", "aⁿ·ᵐ", "aⁿ⁻ᵐ", "a"],
    richtig: 0,
    erklaerung: "Bei gleicher Basis werden die Exponenten addiert: aⁿ · aᵐ = aⁿ⁺ᵐ.",
  },
  { typ: "input", frage: "2³ · 2² = 2 hoch welcher Zahl? Gib nur den Exponenten an.", loesung: ["5"], platzhalter: "Zahl", erklaerung: "Exponenten addieren: 3 + 2 = 5, also 2⁵." },
  { typ: "input", frage: "(2³)² = 2 hoch welcher Zahl? Gib nur den Exponenten an.", loesung: ["6"], platzhalter: "Zahl", erklaerung: "Potenz einer Potenz: Exponenten multiplizieren, 3 · 2 = 6." },
  { typ: "input", frage: "Berechne 2⁰.", loesung: ["1"], platzhalter: "Zahl", erklaerung: "Jede Zahl (außer 0) hoch 0 ergibt 1." },
  {
    typ: "mc",
    frage: "Was ergibt a⁰ (für a ≠ 0)?",
    antworten: ["1", "0", "a", "unendlich"],
    richtig: 0,
    erklaerung: "a⁰ = 1 für jede Basis a ≠ 0.",
  },
  { typ: "input", frage: "Berechne 10².", loesung: ["100"], platzhalter: "Zahl", erklaerung: "10 · 10 = 100." },
  {
    typ: "luecke",
    frage: "Berechne die Potenzen.",
    segmente: ["2³ = ", { luecke: ["8"] }, " und 3³ = ", { luecke: ["27"] }, "."],
    erklaerung: "2³ = 8 und 3³ = 27.",
  },
  { typ: "input", frage: "Berechne 4².", loesung: ["16"], platzhalter: "Zahl", erklaerung: "4 · 4 = 16." },
  { typ: "input", frage: "Es gilt 2⁻¹ = 1/n. Welche Zahl ist n?", loesung: ["2"], platzhalter: "Zahl", erklaerung: "2⁻¹ = 1/2, also n = 2." },
  {
    typ: "mc",
    frage: "Welche Zahl ist 10⁶?",
    antworten: ["eine Million", "ein Tausend", "eine Milliarde", "hundert"],
    richtig: 0,
    erklaerung: "10⁶ = 1 000 000 = eine Million.",
  },
];

export default POTENZEN_GYM9;
