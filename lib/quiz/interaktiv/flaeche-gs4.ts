// ============================================================================
// Interaktive Aufgaben — Umfang & Fläche (Rechteck) · Grundschule Kl. 4 · Bayern
// Umfang und Flächeninhalt von Rechteck und Quadrat, Kästchen zählen, Alltag.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const FLAECHE_GS4: Aufgabe[] = [
  { typ: "input", frage: "Ein Rechteck ist 7 cm lang und 4 cm breit. Berechne den Umfang.", loesung: ["22"], einheit: "cm", platzhalter: "Zahl", erklaerung: "7 + 4 + 7 + 4 = 22 cm." },
  { typ: "input", frage: "Ein Rechteck ist 7 cm lang und 4 cm breit. Berechne den Flächeninhalt.", loesung: ["28"], einheit: "cm²", platzhalter: "Zahl", erklaerung: "7 · 4 = 28 cm²." },
  { typ: "input", frage: "Ein Quadrat hat die Seitenlänge 8 cm. Berechne den Umfang.", loesung: ["32"], einheit: "cm", platzhalter: "Zahl", erklaerung: "4 · 8 = 32 cm." },
  { typ: "input", frage: "Ein Quadrat hat die Seitenlänge 8 cm. Berechne den Flächeninhalt.", loesung: ["64"], einheit: "cm²", platzhalter: "Zahl", erklaerung: "8 · 8 = 64 cm²." },
  {
    typ: "mc",
    frage: "Was ist der Unterschied zwischen Umfang und Flächeninhalt?",
    antworten: ["Umfang = Weg außen herum, Fläche = das Innere", "Beides ist dasselbe", "Der Umfang ist immer größer", "Die Fläche misst man in cm"],
    richtig: 0,
    erklaerung: "Umfang: die Linie außen herum (in cm). Fläche: wie viel Platz innen ist (in cm²).",
  },
  {
    typ: "mc",
    frage: "In welcher Einheit gibt man den Flächeninhalt an?",
    antworten: ["cm²", "cm", "cm³", "Liter"],
    richtig: 0,
    erklaerung: "Flächen misst man in Quadrat-Einheiten wie cm² oder m².",
  },
  {
    typ: "luecke",
    frage: "Ein Rechteck ist 9 m lang und 5 m breit.",
    segmente: ["Umfang: ", { luecke: ["28"] }, " m, Flächeninhalt: ", { luecke: ["45"] }, " m²."],
    erklaerung: "U = 2 · (9 + 5) = 28 m. A = 9 · 5 = 45 m².",
  },
  { typ: "input", frage: "Ein rechteckiger Schulhof ist 60 m lang und 40 m breit. Wie lang ist eine Runde außen herum?", loesung: ["200"], einheit: "m", platzhalter: "Zahl", erklaerung: "U = 2 · (60 + 40) = 2 · 100 = 200 m." },
  { typ: "input", frage: "Ein Zimmer ist 6 m lang und 4 m breit. Wie viele Quadratmeter Teppich braucht man?", loesung: ["24"], einheit: "m²", platzhalter: "Zahl", erklaerung: "6 · 4 = 24 m²." },
  { typ: "input", frage: "Ein Rechteck aus Kästchen: 6 Kästchen lang, 3 Kästchen breit. Wie viele Kästchen sind es innen?", loesung: ["18"], platzhalter: "Zahl", erklaerung: "6 · 3 = 18 Kästchen." },
  { typ: "input", frage: "Ein Quadrat hat den Umfang 24 cm. Wie lang ist eine Seite?", loesung: ["6"], einheit: "cm", platzhalter: "Zahl", erklaerung: "24 : 4 = 6 cm." },
  { typ: "input", frage: "Ein Rechteck hat den Flächeninhalt 32 cm² und ist 8 cm lang. Wie breit ist es?", loesung: ["4"], einheit: "cm", platzhalter: "Zahl", erklaerung: "32 : 8 = 4 cm." },
  {
    typ: "zuordnen",
    frage: "Ordne jeder Figur die richtige Größe zu.",
    paare: [
      { links: "Rechteck 5 cm · 3 cm: Umfang", rechts: "16 cm" },
      { links: "Rechteck 5 cm · 3 cm: Fläche", rechts: "15 cm²" },
      { links: "Quadrat, Seite 6 cm: Umfang", rechts: "24 cm" },
      { links: "Quadrat, Seite 6 cm: Fläche", rechts: "36 cm²" },
    ],
    erklaerung: "U = 2·(5+3) = 16 cm, A = 15 cm²; U = 4·6 = 24 cm, A = 36 cm².",
  },
  {
    typ: "mc",
    frage: "Ein Bauer zäunt eine rechteckige Weide ein: 90 m lang, 60 m breit. Wie viel Zaun braucht er?",
    antworten: ["300 m", "150 m", "5 400 m", "240 m"],
    richtig: 0,
    erklaerung: "U = 2 · (90 + 60) = 2 · 150 = 300 m.",
  },
  {
    typ: "sortieren",
    frage: "Ordne die Flächen von klein nach groß: Rechteck 4 cm · 5 cm, Quadrat mit Seite 3 cm, Rechteck 6 cm · 5 cm, Quadrat mit Seite 5 cm",
    richtig: ["Quadrat mit Seite 3 cm", "Rechteck 4 cm · 5 cm", "Quadrat mit Seite 5 cm", "Rechteck 6 cm · 5 cm"],
    erklaerung: "9 cm² < 20 cm² < 25 cm² < 30 cm².",
  },
];

export default FLAECHE_GS4;
