// ============================================================================
// Interaktive Aufgaben — Stochastik: Binomialverteilung · Gymnasium Kl. 12
// Erwartungswert n·p, Bernoulli-Ketten, Binomialkoeffizient C(n,k).
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const BINOMIAL_GYM12: Aufgabe[] = [
  { typ: "input", frage: "Binomialverteilung mit n = 10 und p = 0,2. Wie groß ist der Erwartungswert E = n · p?", loesung: ["2"], platzhalter: "Zahl", erklaerung: "E = 10 · 0,2 = 2." },
  { typ: "input", frage: "n = 20, p = 0,5. Erwartungswert E = n · p?", loesung: ["10"], platzhalter: "Zahl", erklaerung: "E = 20 · 0,5 = 10." },
  { typ: "input", frage: "n = 100, p = 0,1. Erwartungswert?", loesung: ["10"], platzhalter: "Zahl", erklaerung: "E = 100 · 0,1 = 10." },
  {
    typ: "mc",
    frage: "Wie berechnet man den Erwartungswert einer Binomialverteilung?",
    antworten: ["n · p", "n + p", "p / n", "n − p"],
    richtig: 0,
    erklaerung: "E = n · p.",
  },
  { typ: "input", frage: "Ein Würfel wird 60-mal geworfen. Wie viele Sechsen erwartet man? (p = 1/6)", loesung: ["10"], platzhalter: "Zahl", erklaerung: "E = 60 · 1/6 = 10." },
  { typ: "input", frage: "Eine Münze wird 10-mal geworfen. Erwartete Anzahl an „Kopf“? (p = 0,5)", loesung: ["5"], platzhalter: "Zahl", erklaerung: "E = 10 · 0,5 = 5." },
  {
    typ: "mc",
    frage: "Die Binomialverteilung beschreibt Versuche mit …",
    antworten: ["genau zwei möglichen Ergebnissen (Treffer / Niete)", "drei Ergebnissen", "stetigen Werten", "keiner Wahrscheinlichkeit"],
    richtig: 0,
    erklaerung: "Ein Bernoulli-Experiment hat genau zwei Ausgänge: Treffer oder Niete.",
  },
  { typ: "input", frage: "Wie viele Möglichkeiten gibt es, aus 4 Dingen 2 auszuwählen? (Binomialkoeffizient „4 über 2“)", loesung: ["6"], platzhalter: "Zahl", erklaerung: "C(4, 2) = 6." },
  { typ: "input", frage: "Berechne den Binomialkoeffizienten „5 über 1“.", loesung: ["5"], platzhalter: "Zahl", erklaerung: "C(5, 1) = 5." },
  { typ: "input", frage: "Berechne den Binomialkoeffizienten „6 über 0“.", loesung: ["1"], platzhalter: "Zahl", erklaerung: "C(n, 0) = 1 für jedes n." },
  { typ: "input", frage: "Eine Münze wird 3-mal geworfen. Wie wahrscheinlich ist 3-mal Kopf? (Als Bruch.)", loesung: ["1/8"], platzhalter: "z. B. 1/8", erklaerung: "(1/2)³ = 1/8." },
  {
    typ: "luecke",
    frage: "Erwartungswert E = n · p.",
    segmente: ["Bei n = 50 und p = 0,2 ist E = ", { luecke: ["10"] }, "."],
    erklaerung: "50 · 0,2 = 10.",
  },
  { typ: "input", frage: "Berechne den Binomialkoeffizienten „4 über 4“.", loesung: ["1"], platzhalter: "Zahl", erklaerung: "C(n, n) = 1." },
  {
    typ: "mc",
    frage: "Bei einer Bernoulli-Kette „mit Zurücklegen“ bleibt die Trefferwahrscheinlichkeit p …",
    antworten: ["konstant", "kleiner", "größer", "immer 0"],
    richtig: 0,
    erklaerung: "Da zurückgelegt wird, ändert sich p von Versuch zu Versuch nicht.",
  },
  { typ: "input", frage: "n = 200, p = 0,05. Erwartungswert?", loesung: ["10"], platzhalter: "Zahl", erklaerung: "E = 200 · 0,05 = 10." },
];

export default BINOMIAL_GYM12;
