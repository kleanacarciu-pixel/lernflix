// ============================================================================
// Interaktive Aufgaben — Daten & Statistik · Mittelschule Kl. 9 · Bayern
// Mittelwert, Median, Spannweite, Modalwert; Daten lesen und deuten.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const STATISTIK_MS9: Aufgabe[] = [
  { typ: "input", frage: "Berechne den Mittelwert der Zahlen 4, 6, 8.", loesung: ["6"], platzhalter: "Zahl", erklaerung: "(4 + 6 + 8) : 3 = 18 : 3 = 6." },
  { typ: "input", frage: "Berechne den Mittelwert der Zahlen 2, 5, 5, 8.", loesung: ["5"], platzhalter: "Zahl", erklaerung: "(2 + 5 + 5 + 8) : 4 = 20 : 4 = 5." },
  { typ: "input", frage: "Notenliste: 1, 2, 2, 3, 4, 4, 5. Wie oft kommt die Note 2 vor?", loesung: ["2"], platzhalter: "Zahl", erklaerung: "Die Note 2 steht zweimal in der Liste." },
  {
    typ: "mc",
    frage: "Was ist der Median einer geordneten Datenreihe?",
    antworten: ["der Wert genau in der Mitte", "der größte Wert", "der häufigste Wert", "die Summe aller Werte"],
    richtig: 0,
    erklaerung: "Der Median ist der mittlere Wert der geordneten Reihe. (Der häufigste Wert heißt Modalwert.)",
  },
  { typ: "input", frage: "Bestimme den Median der Zahlen 3, 7, 9, 12, 15.", loesung: ["9"], platzhalter: "Zahl", erklaerung: "Die Reihe ist geordnet, der mittlere (3.) Wert ist 9." },
  { typ: "input", frage: "Bestimme den Median der Zahlen 8, 2, 5. (Erst ordnen!)", loesung: ["5"], platzhalter: "Zahl", erklaerung: "Geordnet: 2, 5, 8 — der mittlere Wert ist 5." },
  { typ: "input", frage: "Bestimme die Spannweite der Zahlen 3, 8, 12, 20.", loesung: ["17"], platzhalter: "Zahl", erklaerung: "Spannweite = größter − kleinster Wert = 20 − 3 = 17." },
  { typ: "input", frage: "Bestimme den Modalwert (häufigsten Wert) der Reihe 2, 3, 3, 3, 5, 7.", loesung: ["3"], platzhalter: "Zahl", erklaerung: "Die 3 kommt dreimal vor — öfter als jeder andere Wert." },
  {
    typ: "mc",
    frage: "Lara hat die Noten 2, 3, 2, 5. Welchen Notendurchschnitt hat sie?",
    antworten: ["3", "2,5", "4", "2"],
    richtig: 0,
    erklaerung: "(2 + 3 + 2 + 5) : 4 = 12 : 4 = 3.",
  },
  {
    typ: "luecke",
    frage: "Datenreihe: 4, 4, 6, 10.",
    segmente: ["Mittelwert: ", { luecke: ["6"] }, ", Spannweite: ", { luecke: ["6"] }, "."],
    erklaerung: "Mittelwert: 24 : 4 = 6. Spannweite: 10 − 4 = 6.",
  },
  {
    typ: "zuordnen",
    frage: "Datenreihe: 1, 2, 2, 2, 8. Ordne jeder Kenngröße ihren Wert zu.",
    paare: [
      { links: "Mittelwert", rechts: "3" },
      { links: "Median", rechts: "2" },
      { links: "Spannweite", rechts: "7" },
      { links: "Anzahl der Werte", rechts: "5" },
    ],
    erklaerung: "Mittelwert: 15 : 5 = 3. Median (3. Wert): 2. Spannweite: 8 − 1 = 7. Es sind 5 Werte.",
  },
  {
    typ: "mc",
    frage: "Temperaturen einer Woche: 18, 20, 22, 19, 21, 20, 20 (in °C). Welcher Wert ist der Modalwert?",
    antworten: ["20", "18", "22", "19"],
    richtig: 0,
    erklaerung: "20 °C kommt dreimal vor — häufiger als alle anderen Werte.",
  },
  { typ: "input", frage: "In vier Spielen erzielt eine Mannschaft 0, 2, 1 und 5 Tore. Berechne den Mittelwert.", loesung: ["2"], platzhalter: "Zahl", erklaerung: "(0 + 2 + 1 + 5) : 4 = 8 : 4 = 2 Tore." },
  { typ: "input", frage: "Der Mittelwert von drei Zahlen ist 10. Zwei davon sind 8 und 9. Wie heißt die dritte?", loesung: ["13"], platzhalter: "Zahl", erklaerung: "Summe = 3 · 10 = 30. Dritte Zahl: 30 − 8 − 9 = 13." },
  {
    typ: "sortieren",
    frage: "Ordne die Datenreihen nach ihrem Mittelwert aufsteigend — beginne beim kleinsten: Reihe A: 1 und 3, Reihe B: 2 und 4, Reihe C: 5 und 5, Reihe D: 4 und 8",
    richtig: ["Reihe A: 1 und 3", "Reihe B: 2 und 4", "Reihe C: 5 und 5", "Reihe D: 4 und 8"],
    erklaerung: "Mittelwerte: A = 2, B = 3, C = 5, D = 6.",
  },
];

export default STATISTIK_MS9;
