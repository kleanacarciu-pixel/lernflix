// ============================================================================
// Interaktive Aufgaben — Ableitungsregeln (Produkt- & Kettenregel) · Gym. 11
// Ableitungen von e^x, sin, cos, ln; Ketten- und Produktregel.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const ABLEITUNGSREGELN_GYM11: Aufgabe[] = [
  {
    typ: "mc",
    frage: "Mit welcher Regel leitet man f(x) = (2x + 1)³ ab?",
    antworten: ["Kettenregel", "Produktregel", "Quotientenregel", "Summenregel"],
    richtig: 0,
    erklaerung: "Eine Funktion in einer Funktion (Verkettung) leitet man mit der Kettenregel ab.",
  },
  {
    typ: "mc",
    frage: "Mit welcher Regel leitet man f(x) = x² · sin(x) ab?",
    antworten: ["Produktregel", "Kettenregel", "Summenregel", "Potenzregel"],
    richtig: 0,
    erklaerung: "Ein Produkt zweier Funktionen leitet man mit der Produktregel ab.",
  },
  {
    typ: "mc",
    frage: "Wie lautet die Ableitung von f(x) = (x + 1)²?",
    antworten: ["2x + 2", "x² + 1", "2x", "2(x + 1)²"],
    richtig: 0,
    erklaerung: "Kettenregel: 2·(x + 1)·1 = 2x + 2.",
  },
  {
    typ: "mc",
    frage: "Wie lautet die Ableitung von f(x) = eˣ?",
    antworten: ["eˣ", "x · eˣ⁻¹", "1", "0"],
    richtig: 0,
    erklaerung: "Die e-Funktion ist ihre eigene Ableitung: (eˣ)' = eˣ.",
  },
  {
    typ: "mc",
    frage: "Wie lautet die Ableitung von f(x) = sin(x)?",
    antworten: ["cos(x)", "−cos(x)", "−sin(x)", "tan(x)"],
    richtig: 0,
    erklaerung: "(sin x)' = cos x.",
  },
  {
    typ: "mc",
    frage: "Wie lautet die Ableitung von f(x) = cos(x)?",
    antworten: ["−sin(x)", "sin(x)", "cos(x)", "−cos(x)"],
    richtig: 0,
    erklaerung: "(cos x)' = −sin x.",
  },
  {
    typ: "mc",
    frage: "Wie lautet die Ableitung von f(x) = ln(x)?",
    antworten: ["1/x", "x", "eˣ", "ln(x)"],
    richtig: 0,
    erklaerung: "(ln x)' = 1/x.",
  },
  {
    typ: "mc",
    frage: "Wie lautet die Produktregel für f(x) = u(x) · v(x)?",
    antworten: ["f' = u'·v + u·v'", "f' = u'·v'", "f' = u' + v'", "f' = u·v"],
    richtig: 0,
    erklaerung: "Produktregel: f' = u'·v + u·v'.",
  },
  {
    typ: "mc",
    frage: "Was ist die innere Funktion von (x² + 1)⁵?",
    antworten: ["x² + 1", "x⁵", "5", "2x"],
    richtig: 0,
    erklaerung: "Die innere Funktion ist der Ausdruck in der Klammer: x² + 1.",
  },
  {
    typ: "mc",
    frage: "Wie lautet die Ableitung von f(x) = 2·eˣ?",
    antworten: ["2·eˣ", "eˣ", "2x·eˣ", "2"],
    richtig: 0,
    erklaerung: "Der Faktor 2 bleibt: (2eˣ)' = 2eˣ.",
  },
  { typ: "input", frage: "f(x) = (x + 1)². Berechne f'(2). (Tipp: f'(x) = 2(x + 1).)", loesung: ["6"], platzhalter: "Zahl", erklaerung: "f'(x) = 2(x + 1), also f'(2) = 2·3 = 6." },
  { typ: "input", frage: "f(x) = (2x − 1)². Berechne f'(1). (Tipp: f'(x) = 4(2x − 1).)", loesung: ["4"], platzhalter: "Zahl", erklaerung: "f'(x) = 2·(2x − 1)·2 = 4(2x − 1), also f'(1) = 4·1 = 4." },
  {
    typ: "mc",
    frage: "Wie lautet die Ableitung von f(x) = 5·sin(x)?",
    antworten: ["5·cos(x)", "5·(−sin x)", "cos(x)", "5x·cos(x)"],
    richtig: 0,
    erklaerung: "Der Faktor 5 bleibt: (5 sin x)' = 5 cos x.",
  },
  {
    typ: "mc",
    frage: "Die Kettenregel lautet: „äußere Ableitung mal …",
    antworten: ["innere Ableitung", "äußere Funktion", "null", "eins"],
    richtig: 0,
    erklaerung: "Kettenregel: äußere Ableitung · innere Ableitung.",
  },
  { typ: "input", frage: "f(x) = eˣ. Berechne f'(0). (Tipp: e⁰ = 1.)", loesung: ["1"], platzhalter: "Zahl", erklaerung: "f'(x) = eˣ, also f'(0) = e⁰ = 1." },
];

export default ABLEITUNGSREGELN_GYM11;
