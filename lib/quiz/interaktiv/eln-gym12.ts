// ============================================================================
// Interaktive Aufgaben — e- und ln-Funktion · Gymnasium Kl. 12 · Bayern
// Eigenschaften und Ableitungen von e^x und ln(x).
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const ELN_GYM12: Aufgabe[] = [
  {
    typ: "mc",
    frage: "Wie lautet die Ableitung von f(x) = eˣ?",
    antworten: ["eˣ", "x·eˣ", "1", "0"],
    richtig: 0,
    erklaerung: "Die e-Funktion ist ihre eigene Ableitung: (eˣ)' = eˣ.",
  },
  {
    typ: "mc",
    frage: "Wie lautet die Ableitung von f(x) = ln(x)?",
    antworten: ["1/x", "x", "eˣ", "ln(x)"],
    richtig: 0,
    erklaerung: "(ln x)' = 1/x.",
  },
  { typ: "input", frage: "Berechne e⁰.", loesung: ["1"], platzhalter: "Zahl", erklaerung: "Jede Zahl hoch 0 ist 1: e⁰ = 1." },
  { typ: "input", frage: "Berechne ln(1).", loesung: ["0"], platzhalter: "Zahl", erklaerung: "e⁰ = 1, also ln(1) = 0." },
  { typ: "input", frage: "Berechne ln(e).", loesung: ["1"], platzhalter: "Zahl", erklaerung: "e¹ = e, also ln(e) = 1." },
  {
    typ: "mc",
    frage: "Die Werte von eˣ sind …",
    antworten: ["immer positiv", "manchmal negativ", "manchmal 0", "immer 1"],
    richtig: 0,
    erklaerung: "eˣ ist für jedes x größer als 0.",
  },
  { typ: "input", frage: "Wie groß ist die Zahl e ungefähr? (Auf 2 Nachkommastellen gerundet.)", loesung: ["2,72", "2,718"], platzhalter: "z. B. 2,72", erklaerung: "e ≈ 2,71828…, auf zwei Nachkommastellen gerundet 2,72 (die dritte Stelle 8 rundet auf)." },
  {
    typ: "mc",
    frage: "ln ist die Umkehrfunktion von …",
    antworten: ["eˣ", "x²", "sin(x)", "1/x"],
    richtig: 0,
    erklaerung: "Der natürliche Logarithmus ln macht die e-Funktion rückgängig.",
  },
  { typ: "input", frage: "Berechne ln(e²).", loesung: ["2"], platzhalter: "Zahl", erklaerung: "ln(e²) = 2 (Logarithmus und e-Funktion heben sich auf)." },
  { typ: "input", frage: "Berechne e^(ln 5).", loesung: ["5"], platzhalter: "Zahl", erklaerung: "e^(ln 5) = 5 — die Funktionen sind Umkehrungen." },
  {
    typ: "mc",
    frage: "Wo schneidet der Graph von f(x) = eˣ die y-Achse?",
    antworten: ["im Punkt (0|1)", "im Punkt (0|0)", "im Punkt (1|0)", "im Punkt (0|e)"],
    richtig: 0,
    erklaerung: "Bei x = 0 ist eˣ = e⁰ = 1, also (0|1).",
  },
  { typ: "input", frage: "Berechne ln(e³).", loesung: ["3"], platzhalter: "Zahl", erklaerung: "ln(e³) = 3." },
  {
    typ: "mc",
    frage: "Für x → ∞ geht ln(x) …",
    antworten: ["gegen unendlich (langsam)", "gegen 0", "gegen 1", "gegen −∞"],
    richtig: 0,
    erklaerung: "ln(x) wächst unbeschränkt, aber sehr langsam.",
  },
  { typ: "input", frage: "f(x) = 3·eˣ. Berechne f'(0). (f'(x) = 3·eˣ.)", loesung: ["3"], platzhalter: "Zahl", erklaerung: "f'(0) = 3·e⁰ = 3·1 = 3." },
  {
    typ: "luecke",
    frage: "Besondere Werte.",
    segmente: ["e⁰ = ", { luecke: ["1"] }, " und ln(1) = ", { luecke: ["0"] }, "."],
    erklaerung: "e⁰ = 1 und ln(1) = 0.",
  },
];

export default ELN_GYM12;
