// ============================================================================
// Interaktive Aufgaben — Prisma, Zylinder · Realschule Kl. 9 · Bayern
// V_Prisma = G·h, V_Zylinder = π·r²·h (π ≈ 3,14). Lösungen geprüft.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const PRISMA_ZYLINDER_RS9: Aufgabe[] = [
  { typ: "input", frage: "Ein Prisma hat die Grundfläche 12 cm² und die Höhe 5 cm. Wie groß ist sein Volumen?", loesung: ["60"], einheit: "cm³", platzhalter: "Zahl", erklaerung: "V = G · h = 12 · 5 = 60 cm³." },
  { typ: "input", frage: "Ein Prisma hat G = 20 cm² und h = 4 cm. Volumen?", loesung: ["80"], einheit: "cm³", platzhalter: "Zahl", erklaerung: "V = 20 · 4 = 80 cm³." },
  { typ: "input", frage: "Ein Zylinder hat r = 2 cm und h = 5 cm. Volumen? (V = π · r² · h, π ≈ 3,14)", loesung: ["62,8"], einheit: "cm³", platzhalter: "Zahl", erklaerung: "V = 3,14 · 4 · 5 = 62,8 cm³." },
  { typ: "input", frage: "Ein Zylinder hat r = 3 cm und h = 10 cm. Volumen? (π ≈ 3,14)", loesung: ["282,6"], einheit: "cm³", platzhalter: "Zahl", erklaerung: "V = 3,14 · 9 · 10 = 282,6 cm³." },
  {
    typ: "mc",
    frage: "Wie berechnet man das Volumen eines Zylinders?",
    antworten: ["π · r² · h", "2 · π · r", "G + h", "1/3 · π · r² · h"],
    richtig: 0,
    erklaerung: "V = Grundfläche · Höhe = π · r² · h.",
  },
  {
    typ: "mc",
    frage: "Wie berechnet man das Volumen eines Prismas?",
    antworten: ["Grundfläche · Höhe", "1/3 · Grundfläche · Höhe", "4/3 · π · r³", "Umfang · Höhe"],
    richtig: 0,
    erklaerung: "V = Grundfläche · Höhe.",
  },
  { typ: "input", frage: "Ein Zylinder hat r = 1 cm und h = 7 cm. Volumen? (π ≈ 3,14)", loesung: ["21,98"], einheit: "cm³", platzhalter: "Zahl", erklaerung: "V = 3,14 · 1 · 7 = 21,98 cm³." },
  {
    typ: "luecke",
    frage: "Prisma: V = G · h.",
    segmente: ["Bei G = 15 cm² und h = 4 cm ist V = ", { luecke: ["60"] }, " cm³."],
    erklaerung: "15 · 4 = 60 cm³.",
  },
  { typ: "input", frage: "Ein Zylinder hat den Durchmesser 10 cm (also r = 5 cm) und die Höhe 2 cm. Volumen? (π ≈ 3,14)", loesung: ["157"], einheit: "cm³", platzhalter: "Zahl", erklaerung: "V = 3,14 · 25 · 2 = 157 cm³." },
  { typ: "input", frage: "Ein Prisma hat das Volumen 90 cm³ und die Grundfläche 15 cm². Wie hoch ist es?", loesung: ["6"], einheit: "cm", platzhalter: "Zahl", erklaerung: "h = V : G = 90 : 15 = 6 cm." },
  {
    typ: "mc",
    frage: "In welcher Einheit gibt man ein Volumen an?",
    antworten: ["cm³", "cm²", "cm", "Grad"],
    richtig: 0,
    erklaerung: "Volumen wird in Kubik-Einheiten angegeben, z. B. cm³.",
  },
  { typ: "input", frage: "Ein Zylinder hat r = 5 cm und h = 10 cm. Volumen? (π ≈ 3,14)", loesung: ["785"], einheit: "cm³", platzhalter: "Zahl", erklaerung: "V = 3,14 · 25 · 10 = 785 cm³." },
  { typ: "input", frage: "Ein Prisma hat als Grundfläche ein Dreieck mit g = 6 cm und Dreieckshöhe 4 cm (G = 12 cm²). Das Prisma ist 10 cm hoch. Volumen?", loesung: ["120"], einheit: "cm³", platzhalter: "Zahl", erklaerung: "G = ½ · 6 · 4 = 12 cm². V = 12 · 10 = 120 cm³." },
  { typ: "input", frage: "Ein Zylinder hat r = 2 cm und h = 10 cm. Volumen? (π ≈ 3,14)", loesung: ["125,6"], einheit: "cm³", platzhalter: "Zahl", erklaerung: "V = 3,14 · 4 · 10 = 125,6 cm³." },
  {
    typ: "mc",
    frage: "Was kennzeichnet ein Prisma?",
    antworten: ["überall derselbe Querschnitt (Grundfläche)", "eine Spitze", "eine runde Grundfläche ohne Höhe", "keine Kanten"],
    richtig: 0,
    erklaerung: "Ein Prisma hat überall denselben Querschnitt — deshalb V = G · h.",
  },
];

export default PRISMA_ZYLINDER_RS9;
