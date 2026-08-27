// ============================================================================
// Interaktive Aufgaben — Körper: Pyramide, Kegel, Kugel · Gymnasium Kl. 10
// V_Pyramide = 1/3·G·h, V_Kegel = 1/3·π·r²·h, V_Kugel = 4/3·π·r³ (π ≈ 3,14).
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const KOERPER_GYM10: Aufgabe[] = [
  { typ: "input", frage: "Eine Pyramide hat die Grundfläche 12 cm² und die Höhe 5 cm. Wie groß ist ihr Volumen? (V = 1/3 · G · h)", loesung: ["20"], einheit: "cm³", platzhalter: "Zahl", erklaerung: "V = 1/3 · 12 · 5 = 1/3 · 60 = 20 cm³." },
  { typ: "input", frage: "Eine Pyramide hat G = 30 cm² und h = 6 cm. Wie groß ist ihr Volumen?", loesung: ["60"], einheit: "cm³", platzhalter: "Zahl", erklaerung: "V = 1/3 · 30 · 6 = 60 cm³." },
  {
    typ: "mc",
    frage: "Wie berechnet man das Volumen einer Pyramide?",
    antworten: ["1/3 · Grundfläche · Höhe", "Grundfläche · Höhe", "1/2 · G · h", "π · r²"],
    richtig: 0,
    erklaerung: "V = 1/3 · Grundfläche · Höhe.",
  },
  { typ: "input", frage: "Ein Kegel hat r = 3 cm und h = 10 cm. Volumen? (V = 1/3 · π · r² · h, π ≈ 3,14)", loesung: ["94,2"], einheit: "cm³", platzhalter: "Zahl", erklaerung: "V = 1/3 · 3,14 · 9 · 10 = 1/3 · 282,6 = 94,2 cm³." },
  {
    typ: "mc",
    frage: "Wie berechnet man das Volumen eines Kegels?",
    antworten: ["1/3 · π · r² · h", "π · r² · h", "4/3 · π · r³", "2 · π · r"],
    richtig: 0,
    erklaerung: "V = 1/3 · π · r² · h.",
  },
  { typ: "input", frage: "Eine Kugel hat r = 3 cm. Volumen? (V = 4/3 · π · r³, π ≈ 3,14)", loesung: ["113,04"], einheit: "cm³", platzhalter: "Zahl", erklaerung: "V = 4/3 · 3,14 · 27 = 4/3 · 84,78 = 113,04 cm³." },
  {
    typ: "mc",
    frage: "Wie berechnet man das Volumen einer Kugel?",
    antworten: ["4/3 · π · r³", "π · r²", "1/3 · π · r² · h", "4 · π · r²"],
    richtig: 0,
    erklaerung: "V = 4/3 · π · r³.",
  },
  { typ: "input", frage: "Eine Kugel hat r = 3 cm. Oberfläche? (O = 4 · π · r², π ≈ 3,14)", loesung: ["113,04"], einheit: "cm²", platzhalter: "Zahl", erklaerung: "O = 4 · 3,14 · 9 = 113,04 cm²." },
  { typ: "input", frage: "Eine Pyramide hat G = 9 cm² und h = 4 cm. Volumen?", loesung: ["12"], einheit: "cm³", platzhalter: "Zahl", erklaerung: "V = 1/3 · 9 · 4 = 12 cm³." },
  {
    typ: "luecke",
    frage: "Berechne das Pyramidenvolumen.",
    segmente: ["Bei G = 15 cm² und h = 4 cm ist V = 1/3 · 15 · 4 = ", { luecke: ["20"] }, " cm³."],
    erklaerung: "1/3 · 15 · 4 = 20 cm³.",
  },
  { typ: "input", frage: "Ein Kegel hat r = 1 cm und h = 3 cm. Volumen? (π ≈ 3,14)", loesung: ["3,14"], einheit: "cm³", platzhalter: "Zahl", erklaerung: "V = 1/3 · 3,14 · 1 · 3 = 3,14 cm³." },
  {
    typ: "mc",
    frage: "Wie berechnet man die Oberfläche einer Kugel?",
    antworten: ["4 · π · r²", "π · r²", "4/3 · π · r³", "2 · π · r"],
    richtig: 0,
    erklaerung: "O = 4 · π · r².",
  },
  { typ: "input", frage: "Eine Pyramide mit quadratischer Grundfläche (Seite 3 cm, also G = 9 cm²) hat die Höhe 10 cm. Volumen?", loesung: ["30"], einheit: "cm³", platzhalter: "Zahl", erklaerung: "V = 1/3 · 9 · 10 = 30 cm³." },
  { typ: "input", frage: "Ein Kegel hat r = 6 cm und h = 5 cm. Volumen? (π ≈ 3,14)", loesung: ["188,4"], einheit: "cm³", platzhalter: "Zahl", erklaerung: "V = 1/3 · 3,14 · 36 · 5 = 1/3 · 565,2 = 188,4 cm³." },
  { typ: "input", frage: "Eine Pyramide hat G = 21 cm² und h = 1 cm. Volumen?", loesung: ["7"], einheit: "cm³", platzhalter: "Zahl", erklaerung: "V = 1/3 · 21 · 1 = 7 cm³." },
];

export default KOERPER_GYM10;
