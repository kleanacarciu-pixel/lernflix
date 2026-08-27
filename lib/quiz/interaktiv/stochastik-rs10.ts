// ============================================================================
// Interaktive Aufgaben — Stochastik · Realschule Kl. 10 · Bayern
// Mehrstufige Experimente, Pfadregel, Gegenwahrscheinlichkeit.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const STOCHASTIK_RS10: Aufgabe[] = [
  { typ: "input", frage: "Du wirfst zweimal eine Münze. Wie wahrscheinlich ist zweimal Kopf? (Als Bruch.)", loesung: ["1/4"], platzhalter: "z. B. 1/4", erklaerung: "Pfadregel: 1/2 · 1/2 = 1/4." },
  { typ: "input", frage: "Du würfelst zweimal. Wie wahrscheinlich ist zweimal die 6? (Als Bruch.)", loesung: ["1/36"], platzhalter: "z. B. 1/36", erklaerung: "1/6 · 1/6 = 1/36." },
  {
    typ: "mc",
    frage: "Bei mehrstufigen Zufallsexperimenten multipliziert man entlang eines Pfades die …",
    antworten: ["Wahrscheinlichkeiten", "Ergebnisse", "Anzahlen", "Summen"],
    richtig: 0,
    erklaerung: "Pfadregel: Die Wahrscheinlichkeiten entlang des Pfades werden multipliziert.",
  },
  { typ: "input", frage: "Du wirfst dreimal eine Münze. Wie wahrscheinlich ist dreimal Kopf? (Als Bruch.)", loesung: ["1/8"], platzhalter: "z. B. 1/8", erklaerung: "1/2 · 1/2 · 1/2 = 1/8." },
  { typ: "input", frage: "Wie groß ist die Gegenwahrscheinlichkeit von P = 1/4? (Als Bruch.)", loesung: ["3/4"], platzhalter: "z. B. 3/4", erklaerung: "1 − 1/4 = 3/4." },
  { typ: "input", frage: "Wie wahrscheinlich würfelst du KEINE 6? (Als Bruch.)", loesung: ["5/6"], platzhalter: "z. B. 5/6", erklaerung: "5 günstige von 6: 5/6." },
  {
    typ: "luecke",
    frage: "Zweimal Kopf werfen — Pfadregel.",
    segmente: ["P = 1/2 · 1/2 = ", { luecke: ["1"] }, "/", { luecke: ["4"] }, "."],
    erklaerung: "1/2 · 1/2 = 1/4.",
  },
  { typ: "input", frage: "Urne mit 3 roten und 7 blauen Kugeln. Wie wahrscheinlich ist rot? (Als Bruch.)", loesung: ["3/10"], platzhalter: "z. B. 3/10", erklaerung: "3 von 10 Kugeln: 3/10." },
  {
    typ: "mc",
    frage: "„Mit Zurücklegen“ bedeutet: die Wahrscheinlichkeit bleibt bei jedem Zug …",
    antworten: ["gleich", "kleiner", "größer", "null"],
    richtig: 0,
    erklaerung: "Die gezogene Kugel wird zurückgelegt — die Zusammensetzung ändert sich nicht.",
  },
  { typ: "input", frage: "Wie viele mögliche Ergebnis-Kombinationen gibt es, wenn du zweimal würfelst?", loesung: ["36"], platzhalter: "Zahl", erklaerung: "6 · 6 = 36." },
  { typ: "input", frage: "Wie viele Kombinationen gibt es bei Münze und Würfel zusammen?", loesung: ["12"], platzhalter: "Zahl", erklaerung: "2 · 6 = 12." },
  {
    typ: "mc",
    frage: "Wozu dient ein Baumdiagramm?",
    antworten: ["mehrstufige Zufallsexperimente übersichtlich darzustellen", "Kreise zu zeichnen", "Terme zu vereinfachen", "Winkel zu messen"],
    richtig: 0,
    erklaerung: "Im Baumdiagramm sieht man alle Pfade eines mehrstufigen Zufallsexperiments.",
  },
  { typ: "input", frage: "Ein Glücksrad ist zur Hälfte rot. Du drehst zweimal. Wie wahrscheinlich ist zweimal rot? (Als Bruch.)", loesung: ["1/4"], platzhalter: "z. B. 1/4", erklaerung: "1/2 · 1/2 = 1/4." },
  { typ: "input", frage: "Wie groß ist die Wahrscheinlichkeit eines sicheren Ereignisses?", loesung: ["1", "100 %", "100%"], platzhalter: "Zahl", erklaerung: "Ein sicheres Ereignis hat P = 1." },
  { typ: "input", frage: "Von 20 Losen gewinnen 4. Wie wahrscheinlich ist ein Gewinn? (Als Bruch.)", loesung: ["1/5", "4/20"], platzhalter: "z. B. 1/5", erklaerung: "4 von 20: 4/20 = 1/5." },
];

export default STOCHASTIK_RS10;
