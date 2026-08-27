// ============================================================================
// Interaktive Aufgaben — Natürliche Zahlen & Stellenwert · Realschule Kl. 5
// Bayern LehrplanPLUS. Lösungen von Hand geprüft.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const NAT_ZAHLEN_RS5: Aufgabe[] = [
  { typ: "input", frage: "Welche Ziffer steht in der Zahl 4 386 an der Zehnerstelle?", loesung: ["8"], platzhalter: "Ziffer", erklaerung: "4 386: 4 = Tausender, 3 = Hunderter, 8 = Zehner, 6 = Einer." },
  { typ: "input", frage: "Runde 7 849 auf Hunderter.", loesung: ["7800", "7 800"], platzhalter: "Zahl", erklaerung: "Die Zehnerstelle ist 4 (< 5), also abrunden: 7 800." },
  { typ: "input", frage: "Runde 3 561 auf Tausender.", loesung: ["4000", "4 000"], platzhalter: "Zahl", erklaerung: "Die Hunderterstelle ist 5 (≥ 5), also aufrunden: 4 000." },
  {
    typ: "mc",
    frage: "Welche Zahl ist am größten?",
    antworten: ["25 100", "25 010", "24 999", "25 001"],
    richtig: 0,
    erklaerung: "25 100 > 25 010 > 25 001 > 24 999.",
  },
  {
    typ: "sortieren",
    frage: "Ordne die Zahlen aufsteigend — beginne bei der kleinsten.",
    richtig: ["340", "430", "3400", "4300"],
    erklaerung: "340 < 430 < 3400 < 4300.",
  },
  { typ: "input", frage: "Schreibe die Zahl „fünftausendzweihundertsieben“ in Ziffern.", loesung: ["5207", "5 207"], platzhalter: "Zahl", erklaerung: "5 Tausender, 2 Hunderter, 0 Zehner, 7 Einer = 5 207." },
  {
    typ: "luecke",
    frage: "Welche Ziffer steht an welcher Stelle von 6 084?",
    segmente: ["Tausenderstelle: ", { luecke: ["6"] }, ", Zehnerstelle: ", { luecke: ["8"] }, "."],
    erklaerung: "6 084: 6 = Tausender, 0 = Hunderter, 8 = Zehner, 4 = Einer.",
  },
  { typ: "input", frage: "Welche Zahl kommt direkt nach 4 999?", loesung: ["5000", "5 000"], platzhalter: "Zahl", erklaerung: "4 999 + 1 = 5 000." },
  { typ: "input", frage: "Welche Zahl kommt direkt vor 10 000?", loesung: ["9999", "9 999"], platzhalter: "Zahl", erklaerung: "10 000 − 1 = 9 999." },
  {
    typ: "mc",
    frage: "Runde 8 550 auf Hunderter.",
    antworten: ["8 600", "8 500", "8 550", "9 000"],
    richtig: 0,
    erklaerung: "Die Zehnerstelle ist 5 (≥ 5), also aufrunden: 8 600.",
  },
  { typ: "input", frage: "Wie viele Zehner stecken in der Zahl 730?", loesung: ["73"], platzhalter: "Zahl", erklaerung: "730 : 10 = 73 Zehner." },
  { typ: "input", frage: "Runde 9 470 auf Tausender.", loesung: ["9000", "9 000"], platzhalter: "Zahl", erklaerung: "Die Hunderterstelle ist 4 (< 5), also abrunden: 9 000." },
  {
    typ: "mc",
    frage: "Welchen Wert hat die römische Zahl XII?",
    antworten: ["12", "11", "22", "7"],
    richtig: 0,
    erklaerung: "X = 10, dazu II = 2: zusammen 12.",
  },
  { typ: "input", frage: "Schreibe die römische Zahl IX als normale Zahl.", loesung: ["9"], platzhalter: "Zahl", erklaerung: "I vor X bedeutet 10 − 1 = 9." },
  {
    typ: "zuordnen",
    frage: "Runde jede Zahl auf Zehner und ordne zu.",
    paare: [
      { links: "24", rechts: "20" },
      { links: "25", rechts: "30" },
      { links: "87", rechts: "90" },
      { links: "42", rechts: "40" },
    ],
    erklaerung: "24 → 20 (ab), 25 → 30 (auf), 87 → 90 (auf), 42 → 40 (ab).",
  },
];

export default NAT_ZAHLEN_RS5;
