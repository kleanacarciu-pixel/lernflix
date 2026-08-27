// ============================================================================
// Interaktive Aufgaben — Wahrscheinlichkeit (mehrstufig) · Gymnasium Kl. 8
// Mehrstufige Zufallsexperimente, Pfadregel (Produkt der Wahrscheinlichkeiten).
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const WAHRSCHEINLICHKEIT2_GYM8: Aufgabe[] = [
  { typ: "input", frage: "Du wirfst zweimal eine Münze. Wie wahrscheinlich ist zweimal Kopf? (Als Bruch.)", loesung: ["1/4"], platzhalter: "z. B. 1/4", erklaerung: "Pfadregel: 1/2 · 1/2 = 1/4." },
  { typ: "input", frage: "Du würfelst zweimal. Wie wahrscheinlich ist zweimal die 6? (Als Bruch.)", loesung: ["1/36"], platzhalter: "z. B. 1/36", erklaerung: "1/6 · 1/6 = 1/36." },
  {
    typ: "mc",
    frage: "Bei mehrstufigen Zufallsexperimenten multipliziert man entlang eines Pfades die …",
    antworten: ["Wahrscheinlichkeiten", "Ergebnisse", "Anzahlen", "Summen"],
    richtig: 0,
    erklaerung: "Nach der Pfadregel werden die Wahrscheinlichkeiten entlang des Pfades multipliziert.",
  },
  { typ: "input", frage: "Du wirfst dreimal eine Münze. Wie wahrscheinlich ist dreimal Kopf? (Als Bruch.)", loesung: ["1/8"], platzhalter: "z. B. 1/8", erklaerung: "1/2 · 1/2 · 1/2 = 1/8." },
  { typ: "input", frage: "Ein Glücksrad ist zur Hälfte rot. Du drehst zweimal. Wie wahrscheinlich ist zweimal rot? (Als Bruch.)", loesung: ["1/4"], platzhalter: "z. B. 1/4", erklaerung: "1/2 · 1/2 = 1/4." },
  {
    typ: "mc",
    frage: "Wie groß ist die Summe der Wahrscheinlichkeiten aller Pfade in einem Baumdiagramm?",
    antworten: ["1", "0", "1/2", "2"],
    richtig: 0,
    erklaerung: "Alle Pfade zusammen decken alle Möglichkeiten ab, ihre Wahrscheinlichkeiten ergeben 1.",
  },
  { typ: "input", frage: "Du wirfst eine Münze und einen Würfel. Wie wahrscheinlich ist „Kopf und 6“? (Als Bruch.)", loesung: ["1/12"], platzhalter: "z. B. 1/12", erklaerung: "1/2 · 1/6 = 1/12." },
  { typ: "input", frage: "Du wirfst eine Münze zweimal. Wie wahrscheinlich ist erst Kopf, dann Zahl? (Als Bruch.)", loesung: ["1/4"], platzhalter: "z. B. 1/4", erklaerung: "1/2 · 1/2 = 1/4." },
  {
    typ: "luecke",
    frage: "Zweimal Kopf werfen — rechne mit der Pfadregel.",
    segmente: ["P = 1/2 · 1/2 = ", { luecke: ["1"] }, "/", { luecke: ["4"] }, "."],
    erklaerung: "1/2 · 1/2 = 1/4.",
  },
  { typ: "input", frage: "In einer Urne sind gleich viele rote und blaue Kugeln (mit Zurücklegen). Wie wahrscheinlich ziehst du zweimal rot? (Als Bruch.)", loesung: ["1/4"], platzhalter: "z. B. 1/4", erklaerung: "1/2 · 1/2 = 1/4." },
  {
    typ: "mc",
    frage: "„Mit Zurücklegen“ bedeutet: die Wahrscheinlichkeit bleibt bei jedem Zug …",
    antworten: ["gleich", "kleiner", "größer", "null"],
    richtig: 0,
    erklaerung: "Da die gezogene Kugel zurückgelegt wird, ändert sich die Zusammensetzung nicht — die Wahrscheinlichkeit bleibt gleich.",
  },
  { typ: "input", frage: "Wie viele mögliche Ergebnis-Kombinationen gibt es, wenn du dreimal würfelst?", loesung: ["216"], platzhalter: "Zahl", erklaerung: "6 · 6 · 6 = 216." },
  { typ: "input", frage: "Wie viele mögliche Ergebnis-Kombinationen gibt es, wenn du zweimal würfelst?", loesung: ["36"], platzhalter: "Zahl", erklaerung: "6 · 6 = 36." },
  { typ: "input", frage: "Du wirfst zwei Münzen. Wie wahrscheinlich ist zweimal Zahl? (Als Bruch.)", loesung: ["1/4"], platzhalter: "z. B. 1/4", erklaerung: "1/2 · 1/2 = 1/4." },
  {
    typ: "mc",
    frage: "Wozu dient ein Baumdiagramm?",
    antworten: ["mehrstufige Zufallsexperimente übersichtlich darzustellen", "Kreise zu zeichnen", "Terme zu vereinfachen", "Winkel zu messen"],
    richtig: 0,
    erklaerung: "Im Baumdiagramm sieht man alle Pfade eines mehrstufigen Zufallsexperiments.",
  },
];

export default WAHRSCHEINLICHKEIT2_GYM8;
