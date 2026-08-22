// ============================================================================
// Geprüfte Quiz-Fragen — Mittelschule · Mathematik · Bayern (LehrplanPLUS)
// Grundlagen-Niveau, Lösungen von Hand durchgerechnet.
// Themen-Schlüssel = Thema OHNE Emoji.
// ============================================================================

import type { KlassenFragen } from "@/lib/quiz/catalog";

const MITTELSCHULE_MATHE: KlassenFragen = {
  6: {
    "Bruchrechnen — Grundlagen": [
      { frage: "Welcher Bruch bedeutet „ein Halbes“?", antworten: ["1/2", "1/4", "2/1", "1/3"], richtig: 0, erklaerung: "Ein Halbes = eins von zwei gleichen Teilen = 1/2." },
      { frage: "In wie viele gleiche Teile ist das Ganze bei 1/4 geteilt?", antworten: ["4", "1", "2", "14"], richtig: 0, erklaerung: "Der Nenner (unten) sagt die Anzahl der Teile: 4." },
      { frage: "Kürze den Bruch 4/8.", antworten: ["1/2", "1/4", "1/8", "2/3"], richtig: 0, erklaerung: "4 und 8 durch 4 teilen: 4:4 = 1, 8:4 = 2. Also 1/2." },
      { frage: "Berechne 1/5 + 2/5.", antworten: ["3/5", "3/10", "1/5", "3/25"], richtig: 0, erklaerung: "Gleicher Nenner: Zähler addieren: 1+2 = 3, also 3/5." },
      { frage: "Berechne 4/6 − 1/6.", antworten: ["1/2", "1/6", "5/6", "1/3"], richtig: 0, erklaerung: "4/6 − 1/6 = 3/6 = 1/2." },
      { frage: "Welcher Bruch ist größer: 1/2 oder 1/4?", antworten: ["1/2", "1/4", "Sie sind gleich", "1/4 ist größer"], richtig: 0, erklaerung: "Je größer der Nenner, desto kleiner die Teile. 1/2 ist größer als 1/4." },
      { frage: "Wie viel ist 1/2 von 10?", antworten: ["5", "2", "10", "20"], richtig: 0, erklaerung: "Die Hälfte von 10 ist 5." },
      { frage: "Wie viel ist 1/4 von 8?", antworten: ["2", "4", "1", "8"], richtig: 0, erklaerung: "8 : 4 = 2." },
      { frage: "Wie viel ist 1/3 von 9?", antworten: ["3", "6", "9", "1"], richtig: 0, erklaerung: "9 : 3 = 3." },
      { frage: "Welcher Bruch ist ein Ganzes?", antworten: ["4/4", "1/4", "3/4", "0/4"], richtig: 0, erklaerung: "Wenn Zähler und Nenner gleich sind, ist es ein Ganzes: 4/4 = 1." },
      { frage: "3/4 einer Tafel Schokolade sind gegessen. Wie viel bleibt übrig?", antworten: ["1/4", "3/4", "2/4", "4/4"], richtig: 0, erklaerung: "Ein Ganzes ist 4/4. Übrig: 4/4 − 3/4 = 1/4." },
      { frage: "Welcher dieser Brüche ist am kleinsten?", antworten: ["1/8", "1/2", "1/4", "1/3"], richtig: 0, erklaerung: "Bei gleichem Zähler 1 ist der Bruch mit dem größten Nenner am kleinsten: 1/8." },
      { frage: "Wie schreibt man „drei Viertel“ als Bruch?", antworten: ["3/4", "4/3", "3/40", "34"], richtig: 0, erklaerung: "Drei von vier Teilen: 3/4." },
      { frage: "Ein Kuchen hat 6 Stücke, 3 sind weg. Welcher Bruch ist weg?", antworten: ["1/2", "1/3", "2/3", "1/6"], richtig: 0, erklaerung: "3 von 6 Stücken sind weg: 3/6 = 1/2." },
      { frage: "Berechne 2/2.", antworten: ["1", "2", "1/2", "0"], richtig: 0, erklaerung: "Zähler und Nenner gleich: 2/2 = ein Ganzes = 1." },
    ],
  },
};

export default MITTELSCHULE_MATHE;
