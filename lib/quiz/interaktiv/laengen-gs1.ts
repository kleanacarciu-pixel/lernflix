// ============================================================================
// Interaktive Aufgaben — Längen & Größenvergleich · Grundschule Kl. 1 · Bayern
// Länger/kürzer, größer/kleiner, direktes Vergleichen und Messen mit Schritten.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const LAENGEN_GS1: Aufgabe[] = [
  {
    typ: "mc",
    frage: "Was ist länger: ein Bleistift oder ein Bus?",
    antworten: ["der Bus", "der Bleistift", "beide gleich lang", "das weiß man nicht"],
    richtig: 0,
    erklaerung: "Ein Bus ist viel länger als ein Bleistift.",
  },
  {
    typ: "mc",
    frage: "Was ist kleiner: eine Maus oder ein Pferd?",
    antworten: ["die Maus", "das Pferd", "beide gleich groß", "das weiß man nicht"],
    richtig: 0,
    erklaerung: "Eine Maus ist viel kleiner als ein Pferd.",
  },
  {
    typ: "mc",
    frage: "Anna ist größer als Ben. Ben ist größer als Carla. Wer ist am kleinsten?",
    antworten: ["Carla", "Anna", "Ben", "alle gleich groß"],
    richtig: 0,
    erklaerung: "Anna > Ben > Carla — Carla ist am kleinsten.",
  },
  {
    typ: "sortieren",
    frage: "Ordne von kurz nach lang: Auto, Radiergummi, Zug, Fahrrad",
    richtig: ["Radiergummi", "Fahrrad", "Auto", "Zug"],
    erklaerung: "Radiergummi (ganz kurz), dann Fahrrad, dann Auto, dann Zug (ganz lang).",
  },
  { typ: "input", frage: "Ein Turm ist 5 Bausteine hoch. Ein zweiter Turm ist 3 Bausteine hoch. Wie viele Bausteine ist der erste Turm höher?", loesung: ["2"], platzhalter: "Zahl", erklaerung: "5 − 3 = 2 Bausteine." },
  { typ: "input", frage: "Ein Tisch ist 8 Handspannen lang, ein anderer 6 Handspannen. Wie viele Handspannen sind beide zusammen?", loesung: ["14"], platzhalter: "Zahl", erklaerung: "8 + 6 = 14 Handspannen." },
  {
    typ: "mc",
    frage: "Womit kannst du eine Länge messen?",
    antworten: ["mit einem Lineal", "mit einem Löffel", "mit einer Lampe", "mit einem Kissen"],
    richtig: 0,
    erklaerung: "Mit dem Lineal misst man Längen.",
  },
  {
    typ: "luecke",
    frage: "Vergleiche mit den Wörtern länger/kürzer.",
    segmente: ["Eine Schlange ist ", { luecke: ["länger", "laenger"] }, " als ein Wurm. Ein Stift ist ", { luecke: ["kürzer", "kuerzer"] }, " als ein Besen. (länger/kürzer)"],
    erklaerung: "Die Schlange ist länger als der Wurm, der Stift ist kürzer als der Besen.",
  },
  {
    typ: "zuordnen",
    frage: "Ordne zu: Was passt zusammen?",
    paare: [
      { links: "sehr lang", rechts: "eine Straße" },
      { links: "sehr kurz", rechts: "eine Büroklammer" },
      { links: "sehr hoch", rechts: "ein Kirchturm" },
      { links: "sehr klein", rechts: "eine Ameise" },
    ],
    erklaerung: "Straße = lang, Büroklammer = kurz, Kirchturm = hoch, Ameise = klein.",
  },
  {
    typ: "mc",
    frage: "Lisa misst den Flur mit Schritten: 10 Schritte. Papa misst mit seinen großen Schritten: Braucht er mehr oder weniger Schritte?",
    antworten: ["weniger, weil seine Schritte größer sind", "mehr, weil er größer ist", "genau gleich viele", "das kann man nicht wissen"],
    richtig: 0,
    erklaerung: "Große Schritte — man braucht weniger davon für denselben Weg.",
  },
  { typ: "input", frage: "Ein Band ist 9 Kästchen lang. Du schneidest 4 Kästchen ab. Wie lang ist der Rest?", loesung: ["5", "5 Kästchen"], einheit: "Kästchen", platzhalter: "Zahl", erklaerung: "9 − 4 = 5 Kästchen." },
  {
    typ: "mc",
    frage: "Welches Tier ist am größten?",
    antworten: ["Elefant", "Hund", "Katze", "Hase"],
    richtig: 0,
    erklaerung: "Der Elefant ist das größte dieser Tiere.",
  },
  {
    typ: "sortieren",
    frage: "Ordne die Türme von niedrig nach hoch: Turm mit 7 Steinen, Turm mit 2 Steinen, Turm mit 10 Steinen, Turm mit 5 Steinen",
    richtig: ["Turm mit 2 Steinen", "Turm mit 5 Steinen", "Turm mit 7 Steinen", "Turm mit 10 Steinen"],
    erklaerung: "2 < 5 < 7 < 10.",
  },
  { typ: "input", frage: "Mias Schnur ist 6 Kästchen lang, Toms Schnur ist doppelt so lang. Wie lang ist Toms Schnur?", loesung: ["12", "12 Kästchen"], einheit: "Kästchen", platzhalter: "Zahl", erklaerung: "6 + 6 = 12 Kästchen." },
  {
    typ: "mc",
    frage: "Was bedeutet „gleich lang“?",
    antworten: ["Beide sind genauso lang", "Eins ist länger", "Eins ist kürzer", "Beide sind rund"],
    richtig: 0,
    erklaerung: "Gleich lang heißt: kein Unterschied in der Länge.",
  },
];

export default LAENGEN_GS1;
