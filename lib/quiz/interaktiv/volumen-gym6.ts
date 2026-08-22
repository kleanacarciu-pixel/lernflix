// ============================================================================
// Interaktive Aufgaben — Volumen & Oberfläche · Gymnasium Kl. 6 · Bayern
// Quader und Würfel. Lösungen geprüft.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const VOLUMEN_GYM6: Aufgabe[] = [
  { typ: "input", frage: "Ein Quader ist 2 cm, 3 cm und 4 cm groß. Wie groß ist sein Volumen?", loesung: ["24"], einheit: "cm³", platzhalter: "Zahl", erklaerung: "Volumen = Länge · Breite · Höhe = 2 · 3 · 4 = 24 cm³." },
  { typ: "input", frage: "Ein Würfel hat die Kantenlänge 3 cm. Wie groß ist sein Volumen?", loesung: ["27"], einheit: "cm³", platzhalter: "Zahl", erklaerung: "Volumen Würfel = a · a · a = 3 · 3 · 3 = 27 cm³." },
  { typ: "input", frage: "Ein Würfel hat die Kantenlänge 2 cm. Wie groß ist seine Oberfläche?", loesung: ["24"], einheit: "cm²", platzhalter: "Zahl", erklaerung: "Der Würfel hat 6 gleiche Flächen: 6 · (2 · 2) = 6 · 4 = 24 cm²." },
  { typ: "input", frage: "Ein Quader ist 5 cm, 2 cm und 3 cm groß. Wie groß ist sein Volumen?", loesung: ["30"], einheit: "cm³", platzhalter: "Zahl", erklaerung: "V = 5 · 2 · 3 = 30 cm³." },
  {
    typ: "luecke",
    frage: "Vervollständige die Formel.",
    segmente: ["Volumen eines Quaders = Länge · Breite · ", { luecke: ["Höhe", "höhe"], breite: 7 }, "."],
    erklaerung: "V = Länge · Breite · Höhe.",
  },
  {
    typ: "mc",
    frage: "In welcher Einheit gibt man ein Volumen an?",
    antworten: ["cm³", "cm²", "cm", "Liter pro Meter"],
    richtig: 0,
    erklaerung: "Volumen (Rauminhalt) wird in Kubik-Einheiten angegeben, z. B. cm³.",
  },
  { typ: "input", frage: "Ein Würfel hat die Kantenlänge 4 cm. Wie groß ist sein Volumen?", loesung: ["64"], einheit: "cm³", platzhalter: "Zahl", erklaerung: "V = 4 · 4 · 4 = 64 cm³." },
  { typ: "input", frage: "Ein Quader hat das Volumen 60 cm³ und die Grundfläche 12 cm². Wie hoch ist er?", loesung: ["5"], einheit: "cm", platzhalter: "Zahl", erklaerung: "Höhe = Volumen : Grundfläche = 60 : 12 = 5 cm." },
  { typ: "input", frage: "Wie viele Kubikzentimeter (cm³) sind 1 Liter?", loesung: ["1000"], einheit: "cm³", platzhalter: "Zahl", erklaerung: "1 Liter = 1000 cm³." },
  { typ: "input", frage: "Ein Aquarium ist 40 cm lang, 20 cm breit und 25 cm hoch. Wie groß ist sein Volumen?", loesung: ["20000"], einheit: "cm³", platzhalter: "Zahl", erklaerung: "V = 40 · 20 · 25 = 20 000 cm³ (das sind 20 Liter)." },
  {
    typ: "zuordnen",
    frage: "Ordne jeder Beschreibung den passenden Term zu.",
    paare: [
      { links: "Volumen Würfel", rechts: "a · a · a" },
      { links: "Volumen Quader", rechts: "a · b · c" },
      { links: "Oberfläche Würfel", rechts: "6 · a · a" },
      { links: "Ecken eines Würfels", rechts: "8" },
    ],
    erklaerung: "Würfel-Volumen a³, Quader-Volumen a·b·c, Würfel-Oberfläche 6·a², und ein Würfel hat 8 Ecken.",
  },
  { typ: "input", frage: "Ein Würfel hat die Kantenlänge 5 cm. Wie groß ist sein Volumen?", loesung: ["125"], einheit: "cm³", platzhalter: "Zahl", erklaerung: "V = 5 · 5 · 5 = 125 cm³." },
  { typ: "input", frage: "Ein Quader ist 10 cm, 10 cm und 1 cm groß. Wie groß ist sein Volumen?", loesung: ["100"], einheit: "cm³", platzhalter: "Zahl", erklaerung: "V = 10 · 10 · 1 = 100 cm³." },
  { typ: "input", frage: "Ein Würfel hat die Kantenlänge 3 cm. Wie groß ist seine Oberfläche?", loesung: ["54"], einheit: "cm²", platzhalter: "Zahl", erklaerung: "6 · (3 · 3) = 6 · 9 = 54 cm²." },
  { typ: "input", frage: "Wie viele Kubikzentimeter (cm³) sind 2 Liter?", loesung: ["2000"], einheit: "cm³", platzhalter: "Zahl", erklaerung: "1 Liter = 1000 cm³, also 2 Liter = 2000 cm³." },
];

export default VOLUMEN_GYM6;
