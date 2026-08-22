// ============================================================================
// Geprüfte Quiz-Fragen — Realschule · Mathematik · Bayern (LehrplanPLUS)
// Lösungen von Hand durchgerechnet. Themen-Schlüssel = Thema OHNE Emoji.
// ============================================================================

import type { KlassenFragen } from "@/lib/quiz/catalog";

const REALSCHULE_MATHE: KlassenFragen = {
  6: {
    "Bruchrechnen": [
      { frage: "Kürze den Bruch 6/9 vollständig.", antworten: ["2/3", "3/2", "1/3", "2/9"], richtig: 0, erklaerung: "6 und 9 durch 3 teilen: 6:3 = 2, 9:3 = 3. Also 2/3." },
      { frage: "Erweitere 2/5 auf den Nenner 15.", antworten: ["6/15", "10/15", "2/15", "4/15"], richtig: 0, erklaerung: "15 : 5 = 3, also Zähler und Nenner mal 3: 2·3/5·3 = 6/15." },
      { frage: "Berechne 2/7 + 3/7.", antworten: ["5/7", "5/14", "6/7", "1/7"], richtig: 0, erklaerung: "Gleicher Nenner: Zähler addieren: 2+3 = 5, also 5/7." },
      { frage: "Berechne 1/2 + 1/4.", antworten: ["3/4", "2/6", "1/6", "2/8"], richtig: 0, erklaerung: "1/2 = 2/4. Dann 2/4 + 1/4 = 3/4." },
      { frage: "Berechne 3/4 − 1/4.", antworten: ["1/2", "1/4", "3/8", "1/3"], richtig: 0, erklaerung: "3/4 − 1/4 = 2/4 = 1/2." },
      { frage: "Berechne 5/6 − 1/2.", antworten: ["1/3", "1/2", "1", "2/3"], richtig: 0, erklaerung: "1/2 = 3/6. Dann 5/6 − 3/6 = 2/6 = 1/3." },
      { frage: "Berechne 1/2 · 4/5.", antworten: ["2/5", "5/7", "1/5", "4/7"], richtig: 0, erklaerung: "Zähler mal Zähler, Nenner mal Nenner: 1·4/2·5 = 4/10 = 2/5." },
      { frage: "Berechne 3/5 · 10.", antworten: ["6", "5", "30", "8"], richtig: 0, erklaerung: "3/5 · 10 = 30/5 = 6 (oder: 1/5 von 10 ist 2, mal 3 = 6)." },
      { frage: "Wie viel ist 1/4 von 12?", antworten: ["3", "4", "6", "8"], richtig: 0, erklaerung: "12 : 4 = 3." },
      { frage: "Wie viel ist 2/3 von 9?", antworten: ["6", "3", "5", "9"], richtig: 0, erklaerung: "9 : 3 = 3 (das ist 1/3), mal 2 = 6." },
      { frage: "Wandle 9/4 in eine gemischte Zahl um.", antworten: ["2 1/4", "1 1/4", "2 3/4", "4 1/2"], richtig: 0, erklaerung: "9 : 4 = 2 Rest 1, also 2 1/4." },
      { frage: "Wandle die gemischte Zahl 1 2/5 in einen unechten Bruch um.", antworten: ["7/5", "3/5", "5/7", "12/5"], richtig: 0, erklaerung: "1 · 5 = 5, plus 2 = 7, Nenner bleibt 5: 7/5." },
      { frage: "Welcher Bruch ist größer: 3/8 oder 1/2?", antworten: ["1/2", "3/8", "Sie sind gleich", "3/8 ist größer"], richtig: 0, erklaerung: "1/2 = 4/8. Und 4/8 > 3/8, also ist 1/2 größer." },
      { frage: "Eine Pizza hat 8 Stücke, 2 werden gegessen. Welcher Bruch bleibt übrig?", antworten: ["3/4", "1/4", "2/8", "5/8"], richtig: 0, erklaerung: "Übrig sind 6 von 8 Stücken: 6/8 = 3/4." },
      { frage: "Berechne 3/4 : 3.", antworten: ["1/4", "9/4", "1/3", "3/7"], richtig: 0, erklaerung: "Durch 3 teilen = mit 1/3 malnehmen: 3/4 · 1/3 = 3/12 = 1/4." },
    ],
  },
};

export default REALSCHULE_MATHE;
