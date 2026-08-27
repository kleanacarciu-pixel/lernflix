// ============================================================================
// Interaktive Aufgaben — Teilbarkeit · Mittelschule Kl. 5 · Bayern
// Teilbarkeitsregeln (2, 3, 5, 10), Teiler, Vielfache, Primzahlen (Einstieg).
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const TEILBARKEIT_MS5: Aufgabe[] = [
  {
    typ: "mc",
    frage: "Woran erkennst du, dass eine Zahl durch 2 teilbar ist?",
    antworten: ["Die letzte Ziffer ist 0, 2, 4, 6 oder 8", "Die Quersumme ist gerade", "Die Zahl endet auf 5", "Die erste Ziffer ist gerade"],
    richtig: 0,
    erklaerung: "Durch 2 teilbar (gerade) sind alle Zahlen, die auf 0, 2, 4, 6 oder 8 enden.",
  },
  {
    typ: "mc",
    frage: "Welche Zahl ist durch 5 teilbar?",
    antworten: ["285", "252", "251", "203"],
    richtig: 0,
    erklaerung: "Durch 5 teilbar sind Zahlen, die auf 0 oder 5 enden — das trifft nur auf 285 zu.",
  },
  {
    typ: "mc",
    frage: "Welche Zahl ist durch 10 teilbar?",
    antworten: ["470", "475", "407", "704"],
    richtig: 0,
    erklaerung: "Durch 10 teilbar sind Zahlen, die auf 0 enden: 470.",
  },
  { typ: "input", frage: "Berechne die Quersumme von 372.", loesung: ["12"], platzhalter: "Zahl", erklaerung: "3 + 7 + 2 = 12." },
  {
    typ: "mc",
    frage: "Ist 372 durch 3 teilbar?",
    antworten: ["Ja, denn die Quersumme 12 ist durch 3 teilbar", "Nein, denn 372 ist gerade", "Nein, denn die letzte Ziffer ist 2", "Ja, denn 372 endet auf 2"],
    richtig: 0,
    erklaerung: "Regel: Eine Zahl ist durch 3 teilbar, wenn ihre Quersumme durch 3 teilbar ist. Quersumme von 372 ist 12, und 12 : 3 = 4. Also ja.",
  },
  { typ: "input", frage: "Nenne den kleinsten Teiler von 18, der größer als 1 ist.", loesung: ["2"], platzhalter: "Zahl", erklaerung: "18 ist gerade, also ist 2 ein Teiler. Kleiner geht (außer 1) nicht." },
  { typ: "input", frage: "Wie viele Teiler hat die Zahl 12?", loesung: ["6"], platzhalter: "Zahl", erklaerung: "Teiler von 12: 1, 2, 3, 4, 6, 12 — das sind 6 Teiler." },
  { typ: "input", frage: "Nenne das kleinste gemeinsame Vielfache von 4 und 6.", loesung: ["12"], platzhalter: "Zahl", erklaerung: "Vielfache von 4: 4, 8, 12, … Vielfache von 6: 6, 12, … Das kleinste gemeinsame ist 12." },
  { typ: "input", frage: "Nenne den größten gemeinsamen Teiler von 12 und 18.", loesung: ["6"], platzhalter: "Zahl", erklaerung: "Teiler von 12: 1, 2, 3, 4, 6, 12. Teiler von 18: 1, 2, 3, 6, 9, 18. Der größte gemeinsame ist 6.",
  },
  {
    typ: "mc",
    frage: "Welche dieser Zahlen ist eine Primzahl?",
    antworten: ["13", "15", "21", "27"],
    richtig: 0,
    erklaerung: "13 hat nur die Teiler 1 und 13. (15 = 3 · 5, 21 = 3 · 7, 27 = 3 · 9.)",
  },
  {
    typ: "luecke",
    frage: "Teilbarkeitsregeln.",
    segmente: ["Eine Zahl ist durch 5 teilbar, wenn sie auf 0 oder ", { luecke: ["5"] }, " endet, und durch 10, wenn sie auf ", { luecke: ["0"] }, " endet."],
    erklaerung: "Endziffer 0 oder 5 → durch 5 teilbar; Endziffer 0 → durch 10 teilbar.",
  },
  {
    typ: "zuordnen",
    frage: "Ordne jede Zahl einer passenden Eigenschaft zu.",
    paare: [
      { links: "40", rechts: "durch 10 teilbar" },
      { links: "35", rechts: "durch 5, aber nicht durch 2 teilbar" },
      { links: "27", rechts: "durch 3, aber nicht durch 2 teilbar" },
      { links: "11", rechts: "Primzahl" },
    ],
    erklaerung: "40 endet auf 0. 35 endet auf 5, ist aber ungerade. 27 hat Quersumme 9 (durch 3), ist ungerade. 11 hat nur die Teiler 1 und 11.",
  },
  {
    typ: "mc",
    frage: "Welche Zahl ist ein Vielfaches von 7?",
    antworten: ["42", "44", "46", "40"],
    richtig: 0,
    erklaerung: "6 · 7 = 42. Die anderen Zahlen sind keine Vielfachen von 7.",
  },
  { typ: "input", frage: "Schreibe alle Teiler von 10 auf, getrennt durch Kommas — beginne beim kleinsten.", loesung: ["1, 2, 5, 10", "1,2,5,10"], platzhalter: "z. B. 1, 2, …", erklaerung: "10 = 1 · 10 = 2 · 5. Teiler: 1, 2, 5, 10." },
  {
    typ: "sortieren",
    frage: "Ordne die Primzahlen aufsteigend — beginne bei der kleinsten.",
    richtig: ["2", "5", "11", "17"],
    erklaerung: "2 < 5 < 11 < 17 — alle vier sind Primzahlen.",
  },
];

export default TEILBARKEIT_MS5;
