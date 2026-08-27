// ============================================================================
// Interaktive Aufgaben — Oberfläche & Volumen · Mittelschule Kl. 9 · Bayern
// Oberfläche und Volumen von Würfel, Quader, Zylinder; Einheiten; Sachaufgaben.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const OBERFLAECHE_VOLUMEN_MS9: Aufgabe[] = [
  { typ: "input", frage: "Ein Würfel hat die Kantenlänge 4 cm. Berechne sein Volumen.", loesung: ["64"], einheit: "cm³", platzhalter: "Zahl", erklaerung: "V = 4 · 4 · 4 = 64 cm³." },
  { typ: "input", frage: "Ein Würfel hat die Kantenlänge 4 cm. Berechne seine Oberfläche.", loesung: ["96"], einheit: "cm²", platzhalter: "Zahl", erklaerung: "Eine Fläche: 4 · 4 = 16 cm². Sechs Flächen: 6 · 16 = 96 cm²." },
  { typ: "input", frage: "Ein Quader ist 5 cm lang, 4 cm breit und 3 cm hoch. Berechne sein Volumen.", loesung: ["60"], einheit: "cm³", platzhalter: "Zahl", erklaerung: "V = 5 · 4 · 3 = 60 cm³." },
  { typ: "input", frage: "Ein Quader ist 5 cm lang, 4 cm breit und 3 cm hoch. Berechne seine Oberfläche.", loesung: ["94"], einheit: "cm²", platzhalter: "Zahl", erklaerung: "O = 2 · (5·4 + 5·3 + 4·3) = 2 · (20 + 15 + 12) = 2 · 47 = 94 cm²." },
  {
    typ: "mc",
    frage: "Mit welcher Formel berechnet man die Oberfläche eines Würfels mit Kantenlänge a?",
    antworten: ["O = 6 · a²", "O = a³", "O = 4 · a", "O = 12 · a"],
    richtig: 0,
    erklaerung: "Ein Würfel hat 6 gleich große quadratische Flächen: O = 6 · a².",
  },
  {
    typ: "mc",
    frage: "Was gibt das Volumen eines Körpers an?",
    antworten: ["wie viel Raum er einnimmt", "wie schwer er ist", "wie groß seine Außenhaut ist", "wie lang seine Kanten zusammen sind"],
    richtig: 0,
    erklaerung: "Volumen = Rauminhalt. Die Außenhaut ist die Oberfläche.",
  },
  { typ: "input", frage: "Ein Zylinder hat die Grundfläche G = 30 cm² und die Höhe h = 5 cm. Berechne sein Volumen.", loesung: ["150"], einheit: "cm³", platzhalter: "Zahl", erklaerung: "V = G · h = 30 · 5 = 150 cm³." },
  { typ: "input", frage: "Berechne das Volumen eines Zylinders mit r = 2 cm und h = 10 cm. (π ≈ 3,14)", loesung: ["125,6"], einheit: "cm³", platzhalter: "z. B. 125,6", erklaerung: "G = 3,14 · 2² = 12,56 cm². V = 12,56 · 10 = 125,6 cm³." },
  {
    typ: "luecke",
    frage: "Ein Würfel mit Kantenlänge 3 cm.",
    segmente: ["Volumen: ", { luecke: ["27"] }, " cm³, Oberfläche: ", { luecke: ["54"] }, " cm²."],
    erklaerung: "V = 3³ = 27 cm³. O = 6 · 9 = 54 cm².",
  },
  { typ: "input", frage: "Wie viele Liter sind 250 000 cm³?", loesung: ["250"], einheit: "l", platzhalter: "Zahl", erklaerung: "1 000 cm³ = 1 l, also 250 000 cm³ = 250 l." },
  {
    typ: "zuordnen",
    frage: "Ordne jedem Körper die passende Größe zu.",
    paare: [
      { links: "Würfel, Kante 2 cm: Volumen", rechts: "8 cm³" },
      { links: "Würfel, Kante 2 cm: Oberfläche", rechts: "24 cm²" },
      { links: "Quader 4 · 3 · 2 cm: Volumen", rechts: "24 cm³" },
      { links: "Quader 4 · 3 · 2 cm: Oberfläche", rechts: "52 cm²" },
    ],
    erklaerung: "2³ = 8 cm³; 6 · 4 = 24 cm²; 4·3·2 = 24 cm³; 2 · (12 + 8 + 6) = 52 cm².",
  },
  {
    typ: "mc",
    frage: "Die Kantenlänge eines Würfels wird verdoppelt. Was passiert mit dem Volumen?",
    antworten: ["Es wird 8-mal so groß", "Es verdoppelt sich", "Es wird 4-mal so groß", "Es bleibt gleich"],
    richtig: 0,
    erklaerung: "V = a³: (2a)³ = 8 · a³ — das Volumen verachtfacht sich.",
  },
  { typ: "input", frage: "Ein Umzugskarton ist 60 cm lang, 40 cm breit und 50 cm hoch. Berechne sein Volumen in Litern.", loesung: ["120"], einheit: "l", platzhalter: "Zahl", erklaerung: "V = 60 · 40 · 50 = 120 000 cm³ = 120 l." },
  { typ: "input", frage: "Ein Würfel hat das Volumen 125 cm³. Wie lang ist eine Kante?", loesung: ["5"], einheit: "cm", platzhalter: "Zahl", erklaerung: "5 · 5 · 5 = 125, also a = 5 cm." },
  {
    typ: "sortieren",
    frage: "Ordne die Volumen aufsteigend — beginne beim kleinsten: 900 cm³, 1,5 l, 1 200 cm³, 2 l",
    richtig: ["900 cm³", "1 200 cm³", "1,5 l", "2 l"],
    erklaerung: "In cm³: 900 < 1 200 < 1 500 (= 1,5 l) < 2 000 (= 2 l).",
  },
];

export default OBERFLAECHE_VOLUMEN_MS9;
