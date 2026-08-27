// ============================================================================
// Interaktive Aufgaben — Stochastik (Abitur) · Gymnasium Kl. 13 · Bayern
// Wiederholung: Wahrscheinlichkeit, Binomialverteilung, Erwartungswert.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const STOCHASTIK_GYM13: Aufgabe[] = [
  { typ: "input", frage: "Binomialverteilung mit n = 50 und p = 0,2. Erwartungswert E = n · p?", loesung: ["10"], platzhalter: "Zahl", erklaerung: "E = 50 · 0,2 = 10." },
  { typ: "input", frage: "Ein Würfel wird 30-mal geworfen. Erwartete Anzahl an Sechsen? (p = 1/6)", loesung: ["5"], platzhalter: "Zahl", erklaerung: "E = 30 · 1/6 = 5." },
  {
    typ: "mc",
    frage: "Wie berechnet man den Erwartungswert einer Binomialverteilung?",
    antworten: ["n · p", "n + p", "p / n", "n − p"],
    richtig: 0,
    erklaerung: "E = n · p.",
  },
  { typ: "input", frage: "Würfel: Wie wahrscheinlich ist eine gerade Zahl? (Als gekürzter Bruch.)", loesung: ["1/2", "3/6"], platzhalter: "z. B. 1/2", erklaerung: "3 von 6: 3/6 = 1/2." },
  { typ: "input", frage: "Wie groß ist die Wahrscheinlichkeit eines sicheren Ereignisses?", loesung: ["1"], platzhalter: "Zahl", erklaerung: "Ein sicheres Ereignis hat P = 1." },
  { typ: "input", frage: "Wie viele Möglichkeiten gibt es, aus 4 Dingen 2 auszuwählen?", loesung: ["6"], platzhalter: "Zahl", erklaerung: "C(4, 2) = 6." },
  { typ: "input", frage: "Wie groß ist die Gegenwahrscheinlichkeit von P = 1/4? (Als Bruch.)", loesung: ["3/4"], platzhalter: "z. B. 3/4", erklaerung: "1 − 1/4 = 3/4." },
  { typ: "input", frage: "Eine Münze wird 4-mal geworfen. Wie wahrscheinlich ist 4-mal Kopf? (Als Bruch.)", loesung: ["1/16"], platzhalter: "z. B. 1/16", erklaerung: "(1/2)⁴ = 1/16." },
  {
    typ: "mc",
    frage: "Die Binomialverteilung beschreibt Versuche mit …",
    antworten: ["genau zwei Ergebnissen (Treffer / Niete)", "drei Ergebnissen", "stetigen Werten", "keiner Wahrscheinlichkeit"],
    richtig: 0,
    erklaerung: "Ein Bernoulli-Versuch hat zwei Ausgänge: Treffer oder Niete.",
  },
  { typ: "input", frage: "10 Lose, 3 davon gewinnen. Wie wahrscheinlich ist ein Gewinn? (Als Bruch.)", loesung: ["3/10"], platzhalter: "z. B. 3/10", erklaerung: "3 von 10: 3/10." },
  { typ: "input", frage: "Berechne den Binomialkoeffizienten „5 über 0“.", loesung: ["1"], platzhalter: "Zahl", erklaerung: "C(n, 0) = 1." },
  {
    typ: "luecke",
    frage: "Erwartungswert E = n · p.",
    segmente: ["Bei n = 100 und p = 0,3 ist E = ", { luecke: ["30"] }, "."],
    erklaerung: "100 · 0,3 = 30.",
  },
  {
    typ: "mc",
    frage: "Ein Ereignis mit der Wahrscheinlichkeit 0 ist …",
    antworten: ["unmöglich", "sicher", "wahrscheinlich", "häufig"],
    richtig: 0,
    erklaerung: "P = 0 bedeutet, das Ereignis kann nicht eintreten.",
  },
  { typ: "input", frage: "Urne mit 2 roten und 3 blauen Kugeln. Wie wahrscheinlich ist rot? (Als Bruch.)", loesung: ["2/5"], platzhalter: "z. B. 2/5", erklaerung: "2 von 5: 2/5." },
  { typ: "input", frage: "Würfel: Wie wahrscheinlich ist eine Zahl größer als 4? (Als gekürzter Bruch.)", loesung: ["1/3", "2/6"], platzhalter: "z. B. 1/3", erklaerung: "5 und 6 sind günstig: 2/6 = 1/3." },
];

export default STOCHASTIK_GYM13;
