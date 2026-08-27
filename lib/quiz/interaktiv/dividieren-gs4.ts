// ============================================================================
// Interaktive Aufgaben — Schriftlich Dividieren · Grundschule Kl. 4 · Bayern
// Teilen durch einstellige Zahlen, mit und ohne Rest, Probe, Sachaufgaben.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const DIVIDIEREN_GS4: Aufgabe[] = [
  { typ: "input", frage: "Rechne schriftlich: 84 : 4", loesung: ["21"], platzhalter: "Zahl", erklaerung: "8 : 4 = 2, 4 : 4 = 1 → 21." },
  { typ: "input", frage: "Rechne schriftlich: 96 : 3", loesung: ["32"], platzhalter: "Zahl", erklaerung: "9 : 3 = 3, 6 : 3 = 2 → 32." },
  { typ: "input", frage: "Rechne schriftlich: 132 : 6", loesung: ["22"], platzhalter: "Zahl", erklaerung: "132 : 6 = 22, denn 22 · 6 = 132." },
  { typ: "input", frage: "Rechne schriftlich: 455 : 5", loesung: ["91"], platzhalter: "Zahl", erklaerung: "45 : 5 = 9, 5 : 5 = 1 → 91." },
  { typ: "input", frage: "Rechne schriftlich: 812 : 4", loesung: ["203"], platzhalter: "Zahl", erklaerung: "8 : 4 = 2, 1 : 4 geht nicht (0, Rest 1), 12 : 4 = 3 → 203." },
  { typ: "input", frage: "Rechne: 70 : 10", loesung: ["7"], platzhalter: "Zahl", erklaerung: "Geteilt durch 10: eine Null streichen → 7." },
  { typ: "input", frage: "Rechne: 29 : 4 — wie groß ist der Rest?", loesung: ["1", "Rest 1", "7 Rest 1"], platzhalter: "Zahl", erklaerung: "29 : 4 = 7 Rest 1 (denn 7 · 4 = 28)." },
  {
    typ: "mc",
    frage: "Wie prüfst du, ob 91 : 7 = 13 stimmt?",
    antworten: ["13 · 7 rechnen — es muss 91 herauskommen", "91 + 7 rechnen", "13 : 7 rechnen", "91 − 13 rechnen"],
    richtig: 0,
    erklaerung: "Probe beim Teilen: Ergebnis mal Teiler = Anfangszahl. 13 · 7 = 91 ✓",
  },
  {
    typ: "mc",
    frage: "23 Kinder wollen 4er-Gruppen bilden. Wie viele volle Gruppen entstehen?",
    antworten: ["5 Gruppen, 3 Kinder bleiben übrig", "6 Gruppen genau", "4 Gruppen, 7 bleiben übrig", "23 Gruppen"],
    richtig: 0,
    erklaerung: "23 : 4 = 5 Rest 3 — fünf volle Gruppen, 3 Kinder übrig.",
  },
  {
    typ: "luecke",
    frage: "Teilen und Probe.",
    segmente: ["120 : 6 = ", { luecke: ["20"] }, ", Probe: 20 · 6 = ", { luecke: ["120"] }, "."],
    erklaerung: "120 : 6 = 20 und 20 · 6 = 120.",
  },
  {
    typ: "zuordnen",
    frage: "Ordne jeder Aufgabe das Ergebnis zu.",
    paare: [
      { links: "100 : 4", rechts: "25" },
      { links: "99 : 9", rechts: "11" },
      { links: "480 : 8", rechts: "60" },
      { links: "350 : 7", rechts: "50" },
    ],
    erklaerung: "100:4=25; 99:9=11; 480:8=60; 350:7=50.",
  },
  { typ: "input", frage: "6 Freunde teilen sich 90 Sammelkarten gerecht. Wie viele Karten bekommt jeder?", loesung: ["15"], platzhalter: "Zahl", erklaerung: "90 : 6 = 15 Karten." },
  { typ: "input", frage: "Ein Gärtner pflanzt 144 Blumen in Reihen zu je 8 Blumen. Wie viele Reihen werden das?", loesung: ["18"], platzhalter: "Zahl", erklaerung: "144 : 8 = 18 Reihen." },
  { typ: "input", frage: "252 Schüler stellen sich in 6er-Reihen auf. Wie viele Reihen entstehen?", loesung: ["42"], platzhalter: "Zahl", erklaerung: "252 : 6 = 42 Reihen." },
  {
    typ: "sortieren",
    frage: "Ordne die Ergebnisse von klein nach groß: 60 : 5, 80 : 4, 90 : 6, 100 : 10",
    richtig: ["100 : 10", "60 : 5", "90 : 6", "80 : 4"],
    erklaerung: "10 < 12 < 15 < 20.",
  },
];

export default DIVIDIEREN_GS4;
