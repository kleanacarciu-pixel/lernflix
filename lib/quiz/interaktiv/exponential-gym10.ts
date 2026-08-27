// ============================================================================
// Interaktive Aufgaben — Exponentialfunktionen · Gymnasium Kl. 10 · Bayern
// y = a·bˣ: Funktionswerte, Wachstum/Fallen, y-Achsenschnitt.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const EXPONENTIAL_GYM10: Aufgabe[] = [
  { typ: "input", frage: "Gegeben y = 2ˣ. Welchen y-Wert hat der Graph bei x = 3?", loesung: ["8"], platzhalter: "Zahl", erklaerung: "2³ = 8." },
  { typ: "input", frage: "Gegeben y = 2ˣ. Welchen y-Wert hat der Graph bei x = 0?", loesung: ["1"], platzhalter: "Zahl", erklaerung: "2⁰ = 1." },
  { typ: "input", frage: "Gegeben y = 3ˣ. Welchen y-Wert hat der Graph bei x = 2?", loesung: ["9"], platzhalter: "Zahl", erklaerung: "3² = 9." },
  { typ: "input", frage: "Gegeben y = 2ˣ. Welchen y-Wert hat der Graph bei x = 4?", loesung: ["16"], platzhalter: "Zahl", erklaerung: "2⁴ = 16." },
  { typ: "input", frage: "Gegeben y = 2ˣ. Welchen y-Wert hat der Graph bei x = −1? (Als Dezimalzahl.)", loesung: ["0,5"], platzhalter: "z. B. 0,5", erklaerung: "2⁻¹ = 1/2 = 0,5." },
  {
    typ: "mc",
    frage: "Bei y = bˣ mit b > 1 …",
    antworten: ["wächst der Graph", "fällt der Graph", "ist der Graph konstant", "ist der Graph eine Gerade"],
    richtig: 0,
    erklaerung: "Für eine Basis größer als 1 wächst die Exponentialfunktion.",
  },
  {
    typ: "mc",
    frage: "Bei y = (1/2)ˣ …",
    antworten: ["fällt der Graph", "wächst der Graph", "ist der Graph konstant", "ist der Graph eine Parabel"],
    richtig: 0,
    erklaerung: "Für eine Basis zwischen 0 und 1 fällt die Exponentialfunktion.",
  },
  { typ: "input", frage: "Gegeben y = 5 · 2ˣ. Welchen y-Wert hat der Graph bei x = 0?", loesung: ["5"], platzhalter: "Zahl", erklaerung: "5 · 2⁰ = 5 · 1 = 5." },
  { typ: "input", frage: "Gegeben y = 3 · 2ˣ. Welchen y-Wert hat der Graph bei x = 2?", loesung: ["12"], platzhalter: "Zahl", erklaerung: "3 · 2² = 3 · 4 = 12." },
  {
    typ: "luecke",
    frage: "Berechne Funktionswerte von y = 2ˣ.",
    segmente: ["Bei x = 3 ist y = ", { luecke: ["8"] }, " und bei x = 5 ist y = ", { luecke: ["32"] }, "."],
    erklaerung: "2³ = 8 und 2⁵ = 32.",
  },
  {
    typ: "mc",
    frage: "Wo schneidet der Graph von y = 2ˣ die y-Achse?",
    antworten: ["im Punkt (0|1)", "im Punkt (0|0)", "im Punkt (1|0)", "im Punkt (0|2)"],
    richtig: 0,
    erklaerung: "Bei x = 0 ist y = 2⁰ = 1, also (0|1).",
  },
  { typ: "input", frage: "Gegeben y = 10ˣ. Welchen y-Wert hat der Graph bei x = 2?", loesung: ["100"], platzhalter: "Zahl", erklaerung: "10² = 100." },
  { typ: "input", frage: "Gegeben y = 2ˣ. Welchen y-Wert hat der Graph bei x = 10?", loesung: ["1024", "1 024"], platzhalter: "Zahl", erklaerung: "2¹⁰ = 1024." },
  {
    typ: "mc",
    frage: "Eine wachsende Exponentialfunktion (Basis größer als 1) wächst …",
    antworten: ["immer schneller", "gleichmäßig (linear)", "gar nicht", "immer langsamer"],
    richtig: 0,
    erklaerung: "Anders als eine Gerade wächst eine Exponentialfunktion mit Basis > 1 immer steiler.",
  },
  { typ: "input", frage: "Gegeben y = 4ˣ. Welchen y-Wert hat der Graph bei x = 0,5? (Tipp: 4 hoch 0,5 = √4)", loesung: ["2"], platzhalter: "Zahl", erklaerung: "4^0,5 = √4 = 2." },
];

export default EXPONENTIAL_GYM10;
