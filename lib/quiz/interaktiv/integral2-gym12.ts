// ============================================================================
// Interaktive Aufgaben — Integralrechnung vertieft · Gymnasium Kl. 12
// Bestimmte Integrale mit ganzzahligem Ergebnis, Fläche unter dem Graphen.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const INTEGRAL2_GYM12: Aufgabe[] = [
  { typ: "input", frage: "Berechne das Integral von x² von 0 bis 3. (Stammfunktion 1/3·x³.)", loesung: ["9"], platzhalter: "Zahl", erklaerung: "1/3·3³ − 0 = 1/3·27 = 9." },
  { typ: "input", frage: "Berechne das Integral von x² von 0 bis 6.", loesung: ["72"], platzhalter: "Zahl", erklaerung: "1/3·6³ = 1/3·216 = 72." },
  { typ: "input", frage: "Berechne das Integral von 3x² von 0 bis 2. (Stammfunktion x³.)", loesung: ["8"], platzhalter: "Zahl", erklaerung: "2³ − 0 = 8." },
  { typ: "input", frage: "Berechne das Integral von 4x³ von 0 bis 1. (Stammfunktion x⁴.)", loesung: ["1"], platzhalter: "Zahl", erklaerung: "1⁴ − 0 = 1." },
  { typ: "input", frage: "Berechne das Integral von 4x³ von 0 bis 2.", loesung: ["16"], platzhalter: "Zahl", erklaerung: "2⁴ − 0 = 16." },
  { typ: "input", frage: "Berechne das Integral von 2x von 0 bis 4. (Stammfunktion x².)", loesung: ["16"], platzhalter: "Zahl", erklaerung: "4² − 0 = 16." },
  { typ: "input", frage: "Berechne das Integral von 2x von 2 bis 4.", loesung: ["12"], platzhalter: "Zahl", erklaerung: "4² − 2² = 16 − 4 = 12." },
  {
    typ: "mc",
    frage: "Womit berechnet man die Fläche zwischen dem Graphen und der x-Achse?",
    antworten: ["mit dem bestimmten Integral", "mit dem Ableiten", "mit dem Skalarprodukt", "mit dem Betrag"],
    richtig: 0,
    erklaerung: "Das bestimmte Integral liefert (für f ≥ 0) die Fläche unter dem Graphen.",
  },
  { typ: "input", frage: "Berechne das Integral von 1 von 0 bis 1. (Stammfunktion x.)", loesung: ["1"], platzhalter: "Zahl", erklaerung: "[x] von 0 bis 1 = 1 − 0 = 1." },
  { typ: "input", frage: "Berechne das Integral von 2 von 0 bis 3. (Stammfunktion 2x.)", loesung: ["6"], platzhalter: "Zahl", erklaerung: "[2x] von 0 bis 3 = 6 − 0 = 6." },
  { typ: "input", frage: "Berechne das Integral von (2x + 1) von 0 bis 1. (Stammfunktion x² + x.)", loesung: ["2"], platzhalter: "Zahl", erklaerung: "[x² + x] von 0 bis 1 = (1 + 1) − 0 = 2." },
  {
    typ: "luecke",
    frage: "Bestimmtes Integral von 3x².",
    segmente: ["Von 0 bis 2: 2³ − 0³ = ", { luecke: ["8"] }, "."],
    erklaerung: "Stammfunktion x³, also 2³ − 0 = 8.",
  },
  { typ: "input", frage: "Berechne das Integral von 2x von 0 bis 5.", loesung: ["25"], platzhalter: "Zahl", erklaerung: "5² − 0 = 25." },
  {
    typ: "mc",
    frage: "In der Formel ∫ von a bis b über f(x) dx = F(b) − F(a) ist F …",
    antworten: ["eine Stammfunktion von f", "die Ableitung von f", "eine Nullstelle", "der Betrag von f"],
    richtig: 0,
    erklaerung: "F ist eine Stammfunktion von f (Hauptsatz der Differential- und Integralrechnung).",
  },
  { typ: "input", frage: "Berechne das Integral von 2x von 1 bis 3.", loesung: ["8"], platzhalter: "Zahl", erklaerung: "3² − 1² = 9 − 1 = 8." },
];

export default INTEGRAL2_GYM12;
