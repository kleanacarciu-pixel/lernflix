// ============================================================================
// Interaktive Aufgaben — Volumen (Quader, Prisma) · Mittelschule Kl. 8 · Bayern
// Volumenformeln, Einheiten (cm³, Liter), zusammengesetzte Sachaufgaben.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const VOLUMEN_MS8: Aufgabe[] = [
  { typ: "input", frage: "Ein Quader ist 6 cm lang, 4 cm breit und 3 cm hoch. Berechne sein Volumen.", loesung: ["72"], einheit: "cm³", platzhalter: "Zahl", erklaerung: "V = 6 · 4 · 3 = 72 cm³." },
  { typ: "input", frage: "Ein Würfel hat die Kantenlänge 5 cm. Berechne sein Volumen.", loesung: ["125"], einheit: "cm³", platzhalter: "Zahl", erklaerung: "V = 5 · 5 · 5 = 125 cm³." },
  {
    typ: "mc",
    frage: "Wie berechnet man das Volumen eines Prismas?",
    antworten: ["V = Grundfläche · Höhe", "V = Grundfläche + Höhe", "V = Umfang · Höhe", "V = Grundfläche · Grundfläche"],
    richtig: 0,
    erklaerung: "Prisma: V = G · h (Grundfläche mal Körperhöhe).",
  },
  { typ: "input", frage: "Ein Prisma hat die Grundfläche G = 20 cm² und die Höhe h = 7 cm. Berechne sein Volumen.", loesung: ["140"], einheit: "cm³", platzhalter: "Zahl", erklaerung: "V = G · h = 20 · 7 = 140 cm³." },
  { typ: "input", frage: "Die Grundfläche eines Prismas ist ein Dreieck mit g = 6 cm und Dreieckshöhe 4 cm. Das Prisma ist 10 cm hoch. Berechne sein Volumen.", loesung: ["120"], einheit: "cm³", platzhalter: "Zahl", erklaerung: "Grundfläche: 6 · 4 : 2 = 12 cm². Volumen: 12 · 10 = 120 cm³." },
  { typ: "input", frage: "Wie viele Kubikzentimeter (cm³) sind 1 Liter?", loesung: ["1000", "1 000"], einheit: "cm³", platzhalter: "Zahl", erklaerung: "1 l = 1 dm³ = 1 000 cm³." },
  { typ: "input", frage: "Ein Aquarium ist 50 cm lang, 30 cm breit und 40 cm hoch. Wie viele Liter passen hinein?", loesung: ["60"], einheit: "l", platzhalter: "Zahl", erklaerung: "V = 50 · 30 · 40 = 60 000 cm³ = 60 l." },
  {
    typ: "mc",
    frage: "Welcher Körper ist ein Prisma?",
    antworten: ["eine Toblerone-Packung (dreieckiger Querschnitt)", "ein Fußball", "eine Eiswaffel (Kegel)", "eine Pyramide"],
    richtig: 0,
    erklaerung: "Ein Prisma hat überall den gleichen Querschnitt — wie die dreieckige Schokoladenpackung.",
  },
  {
    typ: "luecke",
    frage: "Ein Quader ist 8 cm lang, 5 cm breit und 2 cm hoch.",
    segmente: ["Volumen: ", { luecke: ["80"] }, " cm³. Verdoppelt man die Höhe, wird das Volumen ", { luecke: ["160"] }, " cm³."],
    erklaerung: "V = 8 · 5 · 2 = 80 cm³. Doppelte Höhe → doppeltes Volumen: 160 cm³.",
  },
  {
    typ: "zuordnen",
    frage: "Ordne jedem Körper sein Volumen zu.",
    paare: [
      { links: "Würfel, Kante 2 cm", rechts: "8 cm³" },
      { links: "Würfel, Kante 4 cm", rechts: "64 cm³" },
      { links: "Quader 5 · 2 · 3 cm", rechts: "30 cm³" },
      { links: "Prisma G = 10 cm², h = 10 cm", rechts: "100 cm³" },
    ],
    erklaerung: "2³ = 8; 4³ = 64; 5 · 2 · 3 = 30; 10 · 10 = 100 (alle in cm³).",
  },
  { typ: "input", frage: "Wie viele Liter sind 4 500 cm³? (Als Kommazahl.)", loesung: ["4,5"], einheit: "l", platzhalter: "z. B. 4,5", erklaerung: "4 500 : 1 000 = 4,5 l." },
  { typ: "input", frage: "Ein Quader hat das Volumen 96 cm³, ist 8 cm lang und 4 cm breit. Wie hoch ist er?", loesung: ["3"], einheit: "cm", platzhalter: "Zahl", erklaerung: "8 · 4 = 32 cm² Grundfläche. Höhe: 96 : 32 = 3 cm." },
  {
    typ: "mc",
    frage: "Ein Schwimmbecken ist 25 m lang, 10 m breit und 2 m tief. Wie viel Wasser passt hinein?",
    antworten: ["500 m³", "50 m³", "250 m³", "5 000 m³"],
    richtig: 0,
    erklaerung: "V = 25 · 10 · 2 = 500 m³.",
  },
  { typ: "input", frage: "Eine Getränkekiste ist 40 cm lang, 30 cm breit und 25 cm hoch. Berechne ihr Volumen in cm³.", loesung: ["30000", "30 000"], einheit: "cm³", platzhalter: "Zahl", erklaerung: "V = 40 · 30 · 25 = 30 000 cm³ (= 30 Liter)." },
  {
    typ: "sortieren",
    frage: "Ordne die Volumen aufsteigend — beginne beim kleinsten: 500 cm³, 2 l, 1 200 cm³, 0,8 l",
    richtig: ["500 cm³", "0,8 l", "1 200 cm³", "2 l"],
    erklaerung: "In cm³: 500 < 800 (= 0,8 l) < 1 200 < 2 000 (= 2 l).",
  },
];

export default VOLUMEN_MS8;
