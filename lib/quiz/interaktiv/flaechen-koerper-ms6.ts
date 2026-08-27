// ============================================================================
// Interaktive Aufgaben — Flächen & Körper · Mittelschule Kl. 6 · Bayern
// Flächeneinheiten, Rechteck/Quadrat, Quader & Würfel: Volumen und Kanten.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const FLAECHEN_KOERPER_MS6: Aufgabe[] = [
  { typ: "input", frage: "Ein Rechteck ist 7 cm lang und 5 cm breit. Berechne den Flächeninhalt.", loesung: ["35"], einheit: "cm²", platzhalter: "Zahl", erklaerung: "A = 7 · 5 = 35 cm²." },
  { typ: "input", frage: "Ein Rechteck ist 9 m lang und 4 m breit. Berechne den Umfang.", loesung: ["26"], einheit: "m", platzhalter: "Zahl", erklaerung: "U = 2 · (9 + 4) = 2 · 13 = 26 m." },
  { typ: "input", frage: "Wie viele Quadratmeter (m²) sind 3 ha?", loesung: ["30000", "30 000"], einheit: "m²", platzhalter: "Zahl", erklaerung: "1 ha = 10 000 m², also 3 ha = 30 000 m²." },
  { typ: "input", frage: "Wie viele Quadratzentimeter (cm²) sind 5 dm²?", loesung: ["500"], einheit: "cm²", platzhalter: "Zahl", erklaerung: "1 dm² = 100 cm², also 5 dm² = 500 cm²." },
  { typ: "input", frage: "Ein Würfel hat die Kantenlänge 3 cm. Berechne sein Volumen.", loesung: ["27"], einheit: "cm³", platzhalter: "Zahl", erklaerung: "V = 3 · 3 · 3 = 27 cm³." },
  { typ: "input", frage: "Ein Quader ist 5 cm lang, 3 cm breit und 2 cm hoch. Berechne sein Volumen.", loesung: ["30"], einheit: "cm³", platzhalter: "Zahl", erklaerung: "V = 5 · 3 · 2 = 30 cm³." },
  {
    typ: "mc",
    frage: "In welcher Einheit gibt man ein Volumen an?",
    antworten: ["cm³", "cm²", "cm", "kg"],
    richtig: 0,
    erklaerung: "Volumen misst man in Kubik-Einheiten, z. B. cm³ oder m³.",
  },
  {
    typ: "mc",
    frage: "Wie viele Ecken hat ein Quader?",
    antworten: ["8", "6", "12", "4"],
    richtig: 0,
    erklaerung: "Ein Quader hat 8 Ecken, 12 Kanten und 6 Flächen.",
  },
  {
    typ: "mc",
    frage: "Wie viele Kanten hat ein Würfel?",
    antworten: ["12", "8", "6", "10"],
    richtig: 0,
    erklaerung: "Ein Würfel hat 12 Kanten (und 8 Ecken, 6 Flächen).",
  },
  {
    typ: "luecke",
    frage: "Ein Würfel mit Kantenlänge 2 cm.",
    segmente: ["Volumen: ", { luecke: ["8"] }, " cm³, eine Fläche hat den Inhalt ", { luecke: ["4"] }, " cm²."],
    erklaerung: "V = 2 · 2 · 2 = 8 cm³. Eine Seitenfläche: 2 · 2 = 4 cm².",
  },
  {
    typ: "zuordnen",
    frage: "Ordne jedem Körper die passende Beschreibung zu.",
    paare: [
      { links: "Würfel", rechts: "alle Kanten gleich lang" },
      { links: "Quader", rechts: "6 Rechtecke als Flächen" },
      { links: "Kugel", rechts: "keine Ecken und keine Kanten" },
      { links: "Zylinder", rechts: "2 Kreisflächen und eine gebogene Fläche" },
    ],
    erklaerung: "Würfel: alle Kanten gleich. Quader: 6 Rechteckflächen. Kugel: rund, ohne Ecken/Kanten. Zylinder: 2 Kreise + Mantel.",
  },
  { typ: "input", frage: "Wie viele Liter sind 2 000 ml?", loesung: ["2"], einheit: "l", platzhalter: "Zahl", erklaerung: "1 l = 1 000 ml, also 2 000 ml = 2 l." },
  { typ: "input", frage: "Ein Aquarium ist 40 cm lang, 20 cm breit und 30 cm hoch. Wie viele cm³ Wasser passen hinein?", loesung: ["24000", "24 000"], einheit: "cm³", platzhalter: "Zahl", erklaerung: "V = 40 · 20 · 30 = 24 000 cm³ (das sind 24 Liter)." },
  {
    typ: "mc",
    frage: "Ein Quader hat das Volumen 24 cm³. Welche Maße passen dazu?",
    antworten: ["4 cm · 3 cm · 2 cm", "4 cm · 4 cm · 2 cm", "5 cm · 3 cm · 2 cm", "6 cm · 3 cm · 2 cm"],
    richtig: 0,
    erklaerung: "4 · 3 · 2 = 24 cm³. Die anderen ergeben 32, 30 und 36 cm³.",
  },
  {
    typ: "sortieren",
    frage: "Ordne die Volumen aufsteigend — beginne beim kleinsten: Würfel mit Kante 2 cm, Quader 3 cm · 2 cm · 2 cm, Würfel mit Kante 3 cm, Quader 5 cm · 3 cm · 2 cm",
    richtig: ["Würfel mit Kante 2 cm", "Quader 3 cm · 2 cm · 2 cm", "Würfel mit Kante 3 cm", "Quader 5 cm · 3 cm · 2 cm"],
    erklaerung: "8 cm³ < 12 cm³ < 27 cm³ < 30 cm³.",
  },
];

export default FLAECHEN_KOERPER_MS6;
