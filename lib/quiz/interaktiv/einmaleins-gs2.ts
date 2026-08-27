// ============================================================================
// Interaktive Aufgaben — Einmaleins · Grundschule Kl. 2 · Bayern
// Kernaufgaben des kleinen Einmaleins, Tauschaufgaben, Malaufgaben im Alltag.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const EINMALEINS_GS2: Aufgabe[] = [
  { typ: "input", frage: "Rechne: 2 · 5", loesung: ["10"], platzhalter: "Zahl", erklaerung: "2 · 5 = 5 + 5 = 10." },
  { typ: "input", frage: "Rechne: 3 · 4", loesung: ["12"], platzhalter: "Zahl", erklaerung: "3 · 4 = 4 + 4 + 4 = 12." },
  { typ: "input", frage: "Rechne: 5 · 5", loesung: ["25"], platzhalter: "Zahl", erklaerung: "5 · 5 = 25." },
  { typ: "input", frage: "Rechne: 6 · 2", loesung: ["12"], platzhalter: "Zahl", erklaerung: "6 · 2 = 12." },
  { typ: "input", frage: "Rechne: 4 · 10", loesung: ["40"], platzhalter: "Zahl", erklaerung: "4 · 10 = 40." },
  { typ: "input", frage: "Rechne: 7 · 2", loesung: ["14"], platzhalter: "Zahl", erklaerung: "7 · 2 = 14." },
  { typ: "input", frage: "Rechne: 3 · 8", loesung: ["24"], platzhalter: "Zahl", erklaerung: "3 · 8 = 24." },
  {
    typ: "mc",
    frage: "Was bedeutet 4 · 3?",
    antworten: ["3 + 3 + 3 + 3", "4 + 3", "4 − 3", "3 + 4 + 5"],
    richtig: 0,
    erklaerung: "4 · 3 heißt: viermal die 3, also 3 + 3 + 3 + 3 = 12.",
  },
  {
    typ: "mc",
    frage: "Welche Tauschaufgabe gehört zu 5 · 3?",
    antworten: ["3 · 5", "5 · 5", "3 · 3", "5 + 3"],
    richtig: 0,
    erklaerung: "Beim Malnehmen darf man tauschen: 5 · 3 = 3 · 5 = 15.",
  },
  {
    typ: "luecke",
    frage: "Ergänze die Malreihe der 5: 5, 10, 15, …",
    segmente: ["Danach kommt ", { luecke: ["20"] }, ", dann ", { luecke: ["25"] }, "."],
    erklaerung: "Immer 5 mehr: 15, 20, 25.",
  },
  {
    typ: "zuordnen",
    frage: "Ordne jeder Malaufgabe das Ergebnis zu.",
    paare: [
      { links: "2 · 2", rechts: "4" },
      { links: "3 · 3", rechts: "9" },
      { links: "4 · 4", rechts: "16" },
      { links: "5 · 4", rechts: "20" },
    ],
    erklaerung: "2·2=4; 3·3=9; 4·4=16; 5·4=20.",
  },
  { typ: "input", frage: "Ein Fahrrad hat 2 Räder. Wie viele Räder haben 6 Fahrräder?", loesung: ["12"], platzhalter: "Zahl", erklaerung: "6 · 2 = 12 Räder." },
  { typ: "input", frage: "In einer Packung sind 4 Joghurts. Mama kauft 3 Packungen. Wie viele Joghurts sind das?", loesung: ["12"], platzhalter: "Zahl", erklaerung: "3 · 4 = 12 Joghurts." },
  { typ: "input", frage: "Auf jedem Tisch stehen 5 Becher. Es gibt 4 Tische. Wie viele Becher sind das?", loesung: ["20"], platzhalter: "Zahl", erklaerung: "4 · 5 = 20 Becher." },
  {
    typ: "sortieren",
    frage: "Ordne die Ergebnisse von klein nach groß: 2 · 3, 10 · 2, 4 · 3, 3 · 3",
    richtig: ["2 · 3", "3 · 3", "4 · 3", "10 · 2"],
    erklaerung: "6 < 9 < 12 < 20.",
  },
];

export default EINMALEINS_GS2;
