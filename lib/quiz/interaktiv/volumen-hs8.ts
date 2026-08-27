// ============================================================================
// Interaktive Aufgaben — Volumen (Quader) · Hauptschule Kl. 8 · Bayern
// Volumen von Quader und Würfel, cm³ und Liter, Alltagsaufgaben.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const VOLUMEN_HS8: Aufgabe[] = [
  {
    typ: "mc",
    frage: "Mit welcher Formel berechnet man das Volumen eines Quaders?",
    antworten: ["V = Länge · Breite · Höhe", "V = Länge + Breite + Höhe", "V = Länge · Breite", "V = 6 · Länge"],
    richtig: 0,
    erklaerung: "Quader: V = l · b · h.",
  },
  { typ: "input", frage: "Ein Quader ist 4 cm lang, 3 cm breit und 2 cm hoch. Berechne sein Volumen.", loesung: ["24"], einheit: "cm³", platzhalter: "Zahl", erklaerung: "V = 4 · 3 · 2 = 24 cm³." },
  { typ: "input", frage: "Ein Würfel hat die Kantenlänge 2 cm. Berechne sein Volumen.", loesung: ["8"], einheit: "cm³", platzhalter: "Zahl", erklaerung: "V = 2 · 2 · 2 = 8 cm³." },
  { typ: "input", frage: "Ein Würfel hat die Kantenlänge 10 cm. Berechne sein Volumen.", loesung: ["1000", "1 000"], einheit: "cm³", platzhalter: "Zahl", erklaerung: "V = 10 · 10 · 10 = 1 000 cm³ (= 1 Liter)." },
  { typ: "input", frage: "Wie viele Kubikzentimeter (cm³) sind 1 Liter?", loesung: ["1000", "1 000"], einheit: "cm³", platzhalter: "Zahl", erklaerung: "1 l = 1 000 cm³." },
  { typ: "input", frage: "Ein Karton ist 30 cm lang, 20 cm breit und 10 cm hoch. Berechne sein Volumen.", loesung: ["6000", "6 000"], einheit: "cm³", platzhalter: "Zahl", erklaerung: "V = 30 · 20 · 10 = 6 000 cm³." },
  {
    typ: "mc",
    frage: "In welcher Einheit misst man, wie viel Wasser in eine Badewanne passt?",
    antworten: ["Liter", "Meter", "Quadratmeter", "Kilogramm"],
    richtig: 0,
    erklaerung: "Flüssigkeitsmengen misst man in Litern.",
  },
  {
    typ: "mc",
    frage: "Wie viele Kanten hat ein Quader?",
    antworten: ["12", "6", "8", "4"],
    richtig: 0,
    erklaerung: "Ein Quader hat 12 Kanten, 8 Ecken und 6 Flächen.",
  },
  {
    typ: "luecke",
    frage: "Ein Würfel mit Kantenlänge 3 cm.",
    segmente: ["Volumen: ", { luecke: ["27"] }, " cm³. Ein Würfel mit Kante 1 cm hat das Volumen ", { luecke: ["1"] }, " cm³."],
    erklaerung: "3 · 3 · 3 = 27 cm³. 1 · 1 · 1 = 1 cm³.",
  },
  {
    typ: "zuordnen",
    frage: "Ordne jedem Körper sein Volumen zu.",
    paare: [
      { links: "Würfel, Kante 2 cm", rechts: "8 cm³" },
      { links: "Würfel, Kante 5 cm", rechts: "125 cm³" },
      { links: "Quader 6 · 2 · 2 cm", rechts: "24 cm³" },
      { links: "Quader 10 · 5 · 2 cm", rechts: "100 cm³" },
    ],
    erklaerung: "2³ = 8; 5³ = 125; 6 · 2 · 2 = 24; 10 · 5 · 2 = 100 (alle in cm³).",
  },
  { typ: "input", frage: "Ein Aquarium ist 40 cm lang, 25 cm breit und 30 cm hoch. Wie viele Liter passen hinein?", loesung: ["30"], einheit: "l", platzhalter: "Zahl", erklaerung: "V = 40 · 25 · 30 = 30 000 cm³ = 30 l." },
  { typ: "input", frage: "Wie viele Liter sind 5 000 cm³?", loesung: ["5"], einheit: "l", platzhalter: "Zahl", erklaerung: "5 000 : 1 000 = 5 l." },
  { typ: "input", frage: "Ein Quader hat das Volumen 40 cm³, ist 5 cm lang und 4 cm breit. Wie hoch ist er?", loesung: ["2"], einheit: "cm", platzhalter: "Zahl", erklaerung: "Grundfläche: 5 · 4 = 20 cm². Höhe: 40 : 20 = 2 cm." },
  {
    typ: "mc",
    frage: "Was passt zusammen: Ein Getränkekasten mit 12 Flaschen à 1 Liter enthält …",
    antworten: ["12 Liter", "1,2 Liter", "120 Liter", "12 cm³"],
    richtig: 0,
    erklaerung: "12 · 1 l = 12 Liter.",
  },
  {
    typ: "sortieren",
    frage: "Ordne die Volumen aufsteigend — beginne beim kleinsten: 700 cm³, 1 l, 1 500 cm³, 2 l",
    richtig: ["700 cm³", "1 l", "1 500 cm³", "2 l"],
    erklaerung: "In cm³: 700 < 1 000 (= 1 l) < 1 500 < 2 000 (= 2 l).",
  },
];

export default VOLUMEN_HS8;
