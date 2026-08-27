// ============================================================================
// Interaktive Aufgaben — Bruchrechnen — Grundlagen · Hauptschule Kl. 6 · Bayern
// Bruch als Anteil verstehen, einfaches Kürzen, gleichnamig rechnen, Alltag.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const BRUCHRECHNEN_HS6: Aufgabe[] = [
  {
    typ: "mc",
    frage: "Eine Pizza wird in 4 gleiche Stücke geteilt. Du isst 1 Stück. Welcher Bruch passt?",
    antworten: ["1/4", "4/1", "1/2", "3/4"],
    richtig: 0,
    erklaerung: "1 von 4 gleichen Teilen = 1/4.",
  },
  { typ: "input", frage: "Ein Kuchen hat 8 Stücke. Du isst 2 Stücke. Welcher Bruchteil ist das? (Vollständig gekürzt.)", loesung: ["1/4"], platzhalter: "z. B. 1/4", erklaerung: "2 von 8 Stücken: 2/8 = 1/4 (mit 2 gekürzt)." },
  { typ: "input", frage: "Kürze den Bruch 5/10 vollständig.", loesung: ["1/2"], platzhalter: "z. B. 1/2", erklaerung: "5 und 10 durch 5 teilen: 5/10 = 1/2." },
  { typ: "input", frage: "Kürze den Bruch 6/8 vollständig.", loesung: ["3/4"], platzhalter: "z. B. 3/4", erklaerung: "6 und 8 durch 2 teilen: 6/8 = 3/4." },
  { typ: "input", frage: "Berechne 2/6 + 3/6.", loesung: ["5/6"], platzhalter: "z. B. 5/6", erklaerung: "Gleicher Nenner: Zähler addieren: 2 + 3 = 5, also 5/6." },
  { typ: "input", frage: "Berechne 4/5 − 1/5.", loesung: ["3/5"], platzhalter: "z. B. 3/5", erklaerung: "4 − 1 = 3, Nenner bleibt: 3/5." },
  { typ: "input", frage: "Wie viel ist 1/2 von 10 €?", loesung: ["5"], einheit: "€", platzhalter: "Zahl", erklaerung: "10 : 2 = 5 €." },
  { typ: "input", frage: "Wie viel ist 1/4 von 20 €?", loesung: ["5"], einheit: "€", platzhalter: "Zahl", erklaerung: "20 : 4 = 5 €." },
  { typ: "input", frage: "Wie viel ist 1/3 von 15 Gummibärchen?", loesung: ["5"], platzhalter: "Zahl", erklaerung: "15 : 3 = 5 Gummibärchen." },
  {
    typ: "mc",
    frage: "Was bedeutet der Nenner (die Zahl unten) in einem Bruch?",
    antworten: ["In wie viele gleiche Teile das Ganze geteilt ist", "Wie viele Teile man nimmt", "Wie groß das Ganze ist", "Er hat keine Bedeutung"],
    richtig: 0,
    erklaerung: "Der Nenner sagt, in wie viele gleiche Teile geteilt wird. Der Zähler (oben) sagt, wie viele Teile gemeint sind.",
  },
  {
    typ: "luecke",
    frage: "Kürze vollständig.",
    segmente: ["4/8 = 1/", { luecke: ["2"] }, " und 3/9 = 1/", { luecke: ["3"] }, "."],
    erklaerung: "4/8 mit 4 gekürzt = 1/2. 3/9 mit 3 gekürzt = 1/3.",
  },
  {
    typ: "zuordnen",
    frage: "Ordne jedem Bruch den passenden Anteil zu.",
    paare: [
      { links: "1/2", rechts: "die Hälfte" },
      { links: "1/4", rechts: "ein Viertel" },
      { links: "3/4", rechts: "drei Viertel" },
      { links: "1/3", rechts: "ein Drittel" },
    ],
    erklaerung: "1/2 = Hälfte, 1/4 = Viertel, 3/4 = drei Viertel, 1/3 = Drittel.",
  },
  {
    typ: "mc",
    frage: "Welcher Bruch ist größer: 1/2 oder 1/4?",
    antworten: ["1/2", "1/4", "beide gleich groß", "das kann man nicht sagen"],
    richtig: 0,
    erklaerung: "Eine halbe Pizza ist mehr als eine viertel Pizza: 1/2 > 1/4.",
  },
  {
    typ: "sortieren",
    frage: "Ordne die Brüche der Größe nach — beginne beim kleinsten.",
    richtig: ["1/6", "1/3", "1/2", "5/6"],
    erklaerung: "Auf Sechstel gebracht: 1/6 < 2/6 (= 1/3) < 3/6 (= 1/2) < 5/6.",
  },
  { typ: "input", frage: "In einer Klasse sind 20 Kinder. 1/4 davon hat ein Haustier. Wie viele Kinder sind das?", loesung: ["5"], platzhalter: "Zahl", erklaerung: "20 : 4 = 5 Kinder." },
];

export default BRUCHRECHNEN_HS6;
