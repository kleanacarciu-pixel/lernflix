// ============================================================================
// Interaktive Aufgaben — Kugel, Kegel, Pyramide · Realschule Kl. 10 · Bayern
// V_Pyramide = 1/3·G·h, V_Kegel = 1/3·π·r²·h, V_Kugel = 4/3·π·r³ (π ≈ 3,14).
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const KUGEL_KEGEL_RS10: Aufgabe[] = [
  { typ: "input", frage: "Eine Pyramide hat die Grundfläche 12 cm² und die Höhe 5 cm. Volumen? (V = 1/3 · G · h)", loesung: ["20"], einheit: "cm³", platzhalter: "Zahl", erklaerung: "V = 1/3 · 12 · 5 = 20 cm³." },
  { typ: "input", frage: "Eine Pyramide hat G = 18 cm² und h = 4 cm. Volumen?", loesung: ["24"], einheit: "cm³", platzhalter: "Zahl", erklaerung: "V = 1/3 · 18 · 4 = 24 cm³." },
  { typ: "input", frage: "Ein Kegel hat r = 3 cm und h = 10 cm. Volumen? (V = 1/3 · π · r² · h, π ≈ 3,14)", loesung: ["94,2"], einheit: "cm³", platzhalter: "Zahl", erklaerung: "V = 1/3 · 3,14 · 9 · 10 = 94,2 cm³." },
  { typ: "input", frage: "Eine Kugel hat r = 3 cm. Volumen? (V = 4/3 · π · r³, π ≈ 3,14)", loesung: ["113,04"], einheit: "cm³", platzhalter: "Zahl", erklaerung: "V = 4/3 · 3,14 · 27 = 113,04 cm³." },
  { typ: "input", frage: "Eine Kugel hat r = 3 cm. Oberfläche? (O = 4 · π · r², π ≈ 3,14)", loesung: ["113,04"], einheit: "cm²", platzhalter: "Zahl", erklaerung: "O = 4 · 3,14 · 9 = 113,04 cm²." },
  {
    typ: "mc",
    frage: "Wie berechnet man das Volumen einer Pyramide?",
    antworten: ["1/3 · Grundfläche · Höhe", "Grundfläche · Höhe", "1/2 · G · h", "π · r²"],
    richtig: 0,
    erklaerung: "V = 1/3 · Grundfläche · Höhe.",
  },
  {
    typ: "mc",
    frage: "Wie berechnet man das Volumen eines Kegels?",
    antworten: ["1/3 · π · r² · h", "π · r² · h", "4/3 · π · r³", "2 · π · r"],
    richtig: 0,
    erklaerung: "V = 1/3 · π · r² · h.",
  },
  {
    typ: "mc",
    frage: "Wie berechnet man das Volumen einer Kugel?",
    antworten: ["4/3 · π · r³", "π · r²", "1/3 · π · r² · h", "4 · π · r²"],
    richtig: 0,
    erklaerung: "V = 4/3 · π · r³.",
  },
  {
    typ: "luecke",
    frage: "Pyramidenvolumen berechnen.",
    segmente: ["Bei G = 15 cm² und h = 8 cm ist V = 1/3 · 15 · 8 = ", { luecke: ["40"] }, " cm³."],
    erklaerung: "1/3 · 120 = 40 cm³.",
  },
  { typ: "input", frage: "Ein Kegel hat r = 1 cm und h = 6 cm. Volumen? (π ≈ 3,14)", loesung: ["6,28"], einheit: "cm³", platzhalter: "Zahl", erklaerung: "V = 1/3 · 3,14 · 1 · 6 = 6,28 cm³." },
  {
    typ: "mc",
    frage: "Wie berechnet man die Oberfläche einer Kugel?",
    antworten: ["4 · π · r²", "π · r²", "4/3 · π · r³", "2 · π · r"],
    richtig: 0,
    erklaerung: "O = 4 · π · r².",
  },
  { typ: "input", frage: "Eine Pyramide mit quadratischer Grundfläche (Seite 6 cm, G = 36 cm²) hat die Höhe 5 cm. Volumen?", loesung: ["60"], einheit: "cm³", platzhalter: "Zahl", erklaerung: "V = 1/3 · 36 · 5 = 60 cm³." },
  { typ: "input", frage: "Ein Kegel hat r = 6 cm und h = 5 cm. Volumen? (π ≈ 3,14)", loesung: ["188,4"], einheit: "cm³", platzhalter: "Zahl", erklaerung: "V = 1/3 · 3,14 · 36 · 5 = 188,4 cm³." },
  { typ: "input", frage: "Eine Pyramide hat G = 9 cm² und h = 7 cm. Volumen?", loesung: ["21"], einheit: "cm³", platzhalter: "Zahl", erklaerung: "V = 1/3 · 9 · 7 = 21 cm³." },
  {
    typ: "mc",
    frage: "Welche beiden Körper laufen in einer Spitze zusammen?",
    antworten: ["Pyramide und Kegel", "Würfel und Quader", "Kugel und Zylinder", "Prisma und Quader"],
    richtig: 0,
    erklaerung: "Pyramide und Kegel haben eine Spitze — deshalb der Faktor 1/3 im Volumen.",
  },
];

export default KUGEL_KEGEL_RS10;
