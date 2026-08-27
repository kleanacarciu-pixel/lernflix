// ============================================================================
// Interaktive Aufgaben — Gleichungen (Einstieg) · Hauptschule Kl. 8 · Bayern
// Einfache Gleichungen durch Umkehraufgaben lösen, Probe machen, Sachbezug.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const GLEICHUNGEN_HS8: Aufgabe[] = [
  { typ: "input", frage: "Löse die Gleichung: x + 5 = 12", loesung: ["7", "x=7", "x = 7"], platzhalter: "Zahl", erklaerung: "x = 12 − 5 = 7." },
  { typ: "input", frage: "Löse die Gleichung: x − 3 = 8", loesung: ["11", "x=11", "x = 11"], platzhalter: "Zahl", erklaerung: "x = 8 + 3 = 11." },
  { typ: "input", frage: "Löse die Gleichung: 2x = 14", loesung: ["7", "x=7", "x = 7"], platzhalter: "Zahl", erklaerung: "x = 14 : 2 = 7." },
  { typ: "input", frage: "Löse die Gleichung: x : 3 = 4", loesung: ["12", "x=12", "x = 12"], platzhalter: "Zahl", erklaerung: "x = 4 · 3 = 12." },
  { typ: "input", frage: "Löse die Gleichung: 2x + 1 = 9", loesung: ["4", "x=4", "x = 4"], platzhalter: "Zahl", erklaerung: "2x = 9 − 1 = 8, also x = 4." },
  { typ: "input", frage: "Löse die Gleichung: 3x − 2 = 10", loesung: ["4", "x=4", "x = 4"], platzhalter: "Zahl", erklaerung: "3x = 12, also x = 4." },
  {
    typ: "mc",
    frage: "Welche Zahl macht die Gleichung richtig: x + 6 = 10?",
    antworten: ["4", "16", "6", "10"],
    richtig: 0,
    erklaerung: "4 + 6 = 10 stimmt.",
  },
  {
    typ: "mc",
    frage: "Wie prüfst du, ob x = 5 die Gleichung 3x = 15 löst?",
    antworten: ["5 einsetzen: 3 · 5 = 15 — stimmt", "5 + 3 rechnen", "15 durch 5 teilen und raten", "gar nicht, das geht nicht"],
    richtig: 0,
    erklaerung: "Probe: den Wert einsetzen und prüfen, ob beide Seiten gleich sind.",
  },
  {
    typ: "mc",
    frage: "„Eine Zahl plus 9 ergibt 20.“ Welche Gleichung passt?",
    antworten: ["x + 9 = 20", "x − 9 = 20", "9x = 20", "x : 9 = 20"],
    richtig: 0,
    erklaerung: "„Zahl plus 9“ heißt x + 9, und das ergibt 20.",
  },
  {
    typ: "luecke",
    frage: "Löse.",
    segmente: ["x + 4 = 11 → x = ", { luecke: ["7"] }, "  und  6x = 18 → x = ", { luecke: ["3"] }, "."],
    erklaerung: "11 − 4 = 7 und 18 : 6 = 3.",
  },
  {
    typ: "zuordnen",
    frage: "Ordne jeder Gleichung ihre Lösung zu.",
    paare: [
      { links: "x + 3 = 10", rechts: "x = 7" },
      { links: "x − 2 = 2", rechts: "x = 4" },
      { links: "5x = 25", rechts: "x = 5" },
      { links: "x : 2 = 6", rechts: "x = 12" },
    ],
    erklaerung: "10 − 3 = 7; 2 + 2 = 4; 25 : 5 = 5; 6 · 2 = 12.",
  },
  { typ: "input", frage: "Ein Döner kostet x Euro. 3 Döner kosten 18 €. Wie viel kostet ein Döner?", loesung: ["6"], einheit: "€", platzhalter: "Zahl", erklaerung: "3x = 18, also x = 18 : 3 = 6 €." },
  { typ: "input", frage: "Mia denkt sich eine Zahl, nimmt sie mal 2 und zählt 3 dazu. Sie bekommt 13. Welche Zahl war es?", loesung: ["5"], platzhalter: "Zahl", erklaerung: "2x + 3 = 13 → 2x = 10 → x = 5." },
  { typ: "input", frage: "Löse die Gleichung: 10 − x = 3", loesung: ["7", "x=7", "x = 7"], platzhalter: "Zahl", erklaerung: "x = 10 − 3 = 7. Probe: 10 − 7 = 3. ✓" },
  { typ: "input", frage: "Löse die Gleichung: 4x + 2 = 18", loesung: ["4", "x=4", "x = 4"], platzhalter: "Zahl", erklaerung: "4x = 16, also x = 4." },
];

export default GLEICHUNGEN_HS8;
