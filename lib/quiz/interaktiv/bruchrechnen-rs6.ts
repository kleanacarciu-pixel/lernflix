// ============================================================================
// Interaktive Aufgaben — Bruchrechnen · Realschule Kl. 6 · Bayern
// Kürzen, Erweitern, Addieren/Subtrahieren, Anteile. Lösungen geprüft.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const BRUCHRECHNEN_RS6: Aufgabe[] = [
  { typ: "input", frage: "Kürze den Bruch 6/9 vollständig.", loesung: ["2/3"], platzhalter: "z. B. 2/3", erklaerung: "6 und 9 durch 3 teilen: 6:3 = 2, 9:3 = 3. Also 2/3." },
  { typ: "input", frage: "Erweitere 2/5 auf den Nenner 20. Wie heißt der neue Zähler?", loesung: ["8"], platzhalter: "Zahl", erklaerung: "20 : 5 = 4, also Zähler mal 4: 2 · 4 = 8. Der Bruch ist 8/20." },
  { typ: "input", frage: "Berechne 2/7 + 3/7.", loesung: ["5/7"], platzhalter: "z. B. 5/7", erklaerung: "Gleicher Nenner: Zähler addieren: 2 + 3 = 5, also 5/7." },
  { typ: "input", frage: "Berechne 1/2 + 1/4.", loesung: ["3/4"], platzhalter: "z. B. 3/4", erklaerung: "1/2 = 2/4. Dann 2/4 + 1/4 = 3/4." },
  {
    typ: "luecke",
    frage: "Bringe die Brüche auf den Nenner 6.",
    segmente: ["1/2 = ", { luecke: ["3"] }, "/6  und  2/3 = ", { luecke: ["4"] }, "/6."],
    erklaerung: "1/2 = 3/6 (mit 3 erweitert) und 2/3 = 4/6 (mit 2 erweitert).",
  },
  { typ: "input", frage: "Berechne 5/6 − 1/2. (Vollständig gekürzt.)", loesung: ["1/3"], platzhalter: "z. B. 1/3", erklaerung: "1/2 = 3/6. Dann 5/6 − 3/6 = 2/6 = 1/3." },
  { typ: "input", frage: "Berechne 1/2 · 4/5. (Vollständig gekürzt.)", loesung: ["2/5"], platzhalter: "z. B. 2/5", erklaerung: "Zähler mal Zähler, Nenner mal Nenner: 4/10 = 2/5." },
  { typ: "input", frage: "Wie viel sind 3/5 von 10?", loesung: ["6"], platzhalter: "Zahl", erklaerung: "10 : 5 = 2 (das ist 1/5), mal 3 = 6." },
  { typ: "input", frage: "Wie viel sind 1/4 von 12?", loesung: ["3"], platzhalter: "Zahl", erklaerung: "12 : 4 = 3." },
  { typ: "input", frage: "Wie viel sind 2/3 von 9?", loesung: ["6"], platzhalter: "Zahl", erklaerung: "9 : 3 = 3, mal 2 = 6." },
  { typ: "input", frage: "Wandle 9/4 in eine gemischte Zahl um.", loesung: ["2 1/4"], platzhalter: "z. B. 2 1/4", erklaerung: "9 : 4 = 2 Rest 1, also 2 1/4." },
  { typ: "input", frage: "Wandle die gemischte Zahl 1 2/5 in einen unechten Bruch um.", loesung: ["7/5"], platzhalter: "z. B. 7/5", erklaerung: "1 · 5 = 5, plus 2 = 7, Nenner bleibt 5: 7/5." },
  {
    typ: "mc",
    frage: "Welcher Bruch ist größer: 3/8 oder 1/2?",
    antworten: ["1/2", "3/8", "Sie sind gleich groß", "Das lässt sich nicht vergleichen"],
    richtig: 0,
    erklaerung: "1/2 = 4/8, und 4/8 > 3/8.",
  },
  { typ: "input", frage: "Eine Pizza hat 8 Stücke, 2 werden gegessen. Welcher Bruchteil bleibt übrig? (Vollständig gekürzt.)", loesung: ["3/4"], platzhalter: "z. B. 3/4", erklaerung: "Übrig sind 6 von 8 Stücken: 6/8 = 3/4." },
  { typ: "input", frage: "Berechne 3/4 : 3.", loesung: ["1/4"], platzhalter: "z. B. 1/4", erklaerung: "Durch 3 teilen: 3/4 : 3 = 1/4 (der Zähler wird durch 3 geteilt)." },
  {
    typ: "sortieren",
    frage: "Ordne die Brüche der Größe nach — beginne beim kleinsten.",
    richtig: ["1/4", "1/2", "3/4"],
    erklaerung: "Auf Viertel gebracht: 1/4 < 2/4 < 3/4.",
  },
];

export default BRUCHRECHNEN_RS6;
