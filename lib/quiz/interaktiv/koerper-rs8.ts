// ============================================================================
// Interaktive Aufgaben — Körper: Volumen & Oberfläche · Realschule Kl. 8
// Quader, Würfel, Prisma. Lösungen von Hand geprüft.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const KOERPER_RS8: Aufgabe[] = [
  { typ: "input", frage: "Ein Quader ist 4 cm, 3 cm und 2 cm groß. Wie groß ist sein Volumen?", loesung: ["24"], einheit: "cm³", platzhalter: "Zahl", erklaerung: "V = 4 · 3 · 2 = 24 cm³." },
  { typ: "input", frage: "Ein Würfel hat die Kantenlänge 3 cm. Wie groß ist sein Volumen?", loesung: ["27"], einheit: "cm³", platzhalter: "Zahl", erklaerung: "V = 3 · 3 · 3 = 27 cm³." },
  { typ: "input", frage: "Ein Würfel hat die Kantenlänge 2 cm. Wie groß ist seine Oberfläche?", loesung: ["24"], einheit: "cm²", platzhalter: "Zahl", erklaerung: "6 gleiche Flächen: 6 · (2 · 2) = 24 cm²." },
  { typ: "input", frage: "Ein Quader ist 5 cm, 4 cm und 2 cm groß. Wie groß ist sein Volumen?", loesung: ["40"], einheit: "cm³", platzhalter: "Zahl", erklaerung: "V = 5 · 4 · 2 = 40 cm³." },
  {
    typ: "mc",
    frage: "In welcher Einheit gibt man ein Volumen an?",
    antworten: ["cm³", "cm²", "cm", "kg"],
    richtig: 0,
    erklaerung: "Volumen (Rauminhalt) wird in Kubik-Einheiten angegeben, z. B. cm³.",
  },
  { typ: "input", frage: "Ein Würfel hat die Kantenlänge 5 cm. Wie groß ist sein Volumen?", loesung: ["125"], einheit: "cm³", platzhalter: "Zahl", erklaerung: "V = 5 · 5 · 5 = 125 cm³." },
  { typ: "input", frage: "Ein Quader hat das Volumen 48 cm³ und die Grundfläche 12 cm². Wie hoch ist er?", loesung: ["4"], einheit: "cm", platzhalter: "Zahl", erklaerung: "Höhe = Volumen : Grundfläche = 48 : 12 = 4 cm." },
  { typ: "input", frage: "Wie viele Kubikzentimeter (cm³) sind 1 Liter?", loesung: ["1000", "1 000"], einheit: "cm³", platzhalter: "Zahl", erklaerung: "1 Liter = 1000 cm³." },
  {
    typ: "luecke",
    frage: "Vervollständige die Formel.",
    segmente: ["Volumen eines Quaders = Länge · Breite · ", { luecke: ["Höhe", "höhe"], breite: 7 }, "."],
    erklaerung: "V = Länge · Breite · Höhe.",
  },
  { typ: "input", frage: "Ein Prisma hat die Grundfläche 10 cm² und die Höhe 6 cm. Wie groß ist sein Volumen?", loesung: ["60"], einheit: "cm³", platzhalter: "Zahl", erklaerung: "V = Grundfläche · Höhe = 10 · 6 = 60 cm³." },
  { typ: "input", frage: "Ein Prisma hat die Grundfläche 8 cm² und die Höhe 5 cm. Volumen?", loesung: ["40"], einheit: "cm³", platzhalter: "Zahl", erklaerung: "V = 8 · 5 = 40 cm³." },
  {
    typ: "mc",
    frage: "Wie berechnet man das Volumen eines Prismas?",
    antworten: ["Grundfläche · Höhe", "1/3 · Grundfläche · Höhe", "4/3 · π · r³", "Länge + Breite + Höhe"],
    richtig: 0,
    erklaerung: "V = Grundfläche · Höhe (das Prisma hat überall denselben Querschnitt).",
  },
  { typ: "input", frage: "Ein Würfel hat die Kantenlänge 4 cm. Wie groß ist seine Oberfläche?", loesung: ["96"], einheit: "cm²", platzhalter: "Zahl", erklaerung: "6 · (4 · 4) = 6 · 16 = 96 cm²." },
  { typ: "input", frage: "Ein Aquarium ist 50 cm lang, 30 cm breit und 20 cm hoch. Wie viele Liter passen hinein?", loesung: ["30"], einheit: "l", platzhalter: "Zahl", erklaerung: "V = 50 · 30 · 20 = 30 000 cm³ = 30 Liter." },
  { typ: "input", frage: "Ein Würfel hat die Kantenlänge 10 cm. Wie groß ist sein Volumen?", loesung: ["1000", "1 000"], einheit: "cm³", platzhalter: "Zahl", erklaerung: "V = 10 · 10 · 10 = 1000 cm³." },
];

export default KOERPER_RS8;
