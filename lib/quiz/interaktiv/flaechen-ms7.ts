// ============================================================================
// Interaktive Aufgaben — Flächen (Dreieck, Parallelogramm) · Mittelschule Kl. 7
// Flächenformeln anwenden, Grundseite und Höhe erkennen, Sachaufgaben.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const FLAECHEN_MS7: Aufgabe[] = [
  {
    typ: "mc",
    frage: "Mit welcher Formel berechnet man den Flächeninhalt eines Dreiecks?",
    antworten: ["A = g · h : 2", "A = g · h", "A = g + h", "A = 2 · (g + h)"],
    richtig: 0,
    erklaerung: "Dreieck: A = Grundseite · Höhe : 2.",
  },
  {
    typ: "mc",
    frage: "Mit welcher Formel berechnet man den Flächeninhalt eines Parallelogramms?",
    antworten: ["A = g · h", "A = g · h : 2", "A = 4 · g", "A = g + g + h + h"],
    richtig: 0,
    erklaerung: "Parallelogramm: A = Grundseite · Höhe (ohne : 2).",
  },
  { typ: "input", frage: "Ein Dreieck hat die Grundseite g = 8 cm und die Höhe h = 5 cm. Berechne den Flächeninhalt.", loesung: ["20"], einheit: "cm²", platzhalter: "Zahl", erklaerung: "A = 8 · 5 : 2 = 40 : 2 = 20 cm²." },
  { typ: "input", frage: "Ein Dreieck hat die Grundseite g = 10 cm und die Höhe h = 6 cm. Berechne den Flächeninhalt.", loesung: ["30"], einheit: "cm²", platzhalter: "Zahl", erklaerung: "A = 10 · 6 : 2 = 60 : 2 = 30 cm²." },
  { typ: "input", frage: "Ein Parallelogramm hat die Grundseite g = 7 cm und die Höhe h = 4 cm. Berechne den Flächeninhalt.", loesung: ["28"], einheit: "cm²", platzhalter: "Zahl", erklaerung: "A = 7 · 4 = 28 cm²." },
  { typ: "input", frage: "Ein Parallelogramm hat die Grundseite g = 12 m und die Höhe h = 5 m. Berechne den Flächeninhalt.", loesung: ["60"], einheit: "m²", platzhalter: "Zahl", erklaerung: "A = 12 · 5 = 60 m²." },
  { typ: "input", frage: "Ein Dreieck hat den Flächeninhalt 24 cm² und die Grundseite g = 8 cm. Wie groß ist die Höhe h?", loesung: ["6"], einheit: "cm", platzhalter: "Zahl", erklaerung: "A = g · h : 2 → 24 = 8 · h : 2 → 8 · h = 48 → h = 6 cm." },
  { typ: "input", frage: "Ein Parallelogramm hat den Flächeninhalt 45 cm² und die Grundseite g = 9 cm. Wie groß ist die Höhe h?", loesung: ["5"], einheit: "cm", platzhalter: "Zahl", erklaerung: "A = g · h → 45 = 9 · h → h = 45 : 9 = 5 cm." },
  {
    typ: "mc",
    frage: "Ein Dreieck und ein Parallelogramm haben dieselbe Grundseite und dieselbe Höhe. Was gilt?",
    antworten: ["Das Dreieck hat die halbe Fläche des Parallelogramms", "Beide haben die gleiche Fläche", "Das Dreieck hat die doppelte Fläche", "Das kann man nicht wissen"],
    richtig: 0,
    erklaerung: "Dreieck: g · h : 2, Parallelogramm: g · h — das Dreieck hat genau die Hälfte.",
  },
  {
    typ: "luecke",
    frage: "Grundseite g = 6 cm, Höhe h = 4 cm.",
    segmente: ["Dreieck: A = ", { luecke: ["12"] }, " cm², Parallelogramm: A = ", { luecke: ["24"] }, " cm²."],
    erklaerung: "Dreieck: 6 · 4 : 2 = 12 cm². Parallelogramm: 6 · 4 = 24 cm².",
  },
  {
    typ: "mc",
    frage: "Wie muss die Höhe im Dreieck zur Grundseite stehen?",
    antworten: ["senkrecht (im rechten Winkel)", "parallel", "im 45°-Winkel", "das ist egal"],
    richtig: 0,
    erklaerung: "Die Höhe steht immer senkrecht auf der Grundseite.",
  },
  {
    typ: "zuordnen",
    frage: "Ordne jeder Figur ihren Flächeninhalt zu.",
    paare: [
      { links: "Dreieck: g = 4 cm, h = 3 cm", rechts: "6 cm²" },
      { links: "Dreieck: g = 10 cm, h = 4 cm", rechts: "20 cm²" },
      { links: "Parallelogramm: g = 5 cm, h = 3 cm", rechts: "15 cm²" },
      { links: "Parallelogramm: g = 8 cm, h = 4 cm", rechts: "32 cm²" },
    ],
    erklaerung: "4 · 3 : 2 = 6; 10 · 4 : 2 = 20; 5 · 3 = 15; 8 · 4 = 32 (alle in cm²).",
  },
  { typ: "input", frage: "Ein dreieckiges Verkehrsschild hat die Grundseite 60 cm und die Höhe 50 cm. Berechne den Flächeninhalt.", loesung: ["1500", "1 500"], einheit: "cm²", platzhalter: "Zahl", erklaerung: "A = 60 · 50 : 2 = 3 000 : 2 = 1 500 cm²." },
  { typ: "input", frage: "Ein Rechteck ist 9 cm lang und 4 cm breit. Berechne den Flächeninhalt.", loesung: ["36"], einheit: "cm²", platzhalter: "Zahl", erklaerung: "A = 9 · 4 = 36 cm²." },
  {
    typ: "sortieren",
    frage: "Ordne die Flächen aufsteigend — beginne bei der kleinsten: Dreieck g = 6 cm h = 4 cm, Parallelogramm g = 4 cm h = 4 cm, Dreieck g = 10 cm h = 4 cm, Parallelogramm g = 6 cm h = 4 cm",
    richtig: ["Dreieck g = 6 cm h = 4 cm", "Parallelogramm g = 4 cm h = 4 cm", "Dreieck g = 10 cm h = 4 cm", "Parallelogramm g = 6 cm h = 4 cm"],
    erklaerung: "12 cm² < 16 cm² < 20 cm² < 24 cm².",
  },
];

export default FLAECHEN_MS7;
