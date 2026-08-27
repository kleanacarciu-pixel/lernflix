// ============================================================================
// Interaktive Aufgaben — Natürliche Zahlen · Mittelschule Kl. 5 · Bayern
// Stellenwert, Runden, Ordnen, Zahlenstrahl. Alltagsnah, klare Zahlen.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const NAT_ZAHLEN_MS5: Aufgabe[] = [
  { typ: "input", frage: "Welche Ziffer steht in der Zahl 3 275 an der Zehnerstelle?", loesung: ["7"], platzhalter: "Ziffer", erklaerung: "3 275: 3 = Tausender, 2 = Hunderter, 7 = Zehner, 5 = Einer." },
  { typ: "input", frage: "Runde 682 auf Zehner.", loesung: ["680"], platzhalter: "Zahl", erklaerung: "Die Einerstelle ist 2 (< 5), also abrunden: 680." },
  { typ: "input", frage: "Runde 4 651 auf Hunderter.", loesung: ["4700", "4 700"], platzhalter: "Zahl", erklaerung: "Die Zehnerstelle ist 5 (≥ 5), also aufrunden: 4 700." },
  {
    typ: "mc",
    frage: "Welche Zahl ist am größten?",
    antworten: ["8 100", "8 010", "8 001", "7 999"],
    richtig: 0,
    erklaerung: "8 100 > 8 010 > 8 001 > 7 999.",
  },
  {
    typ: "sortieren",
    frage: "Ordne die Zahlen aufsteigend — beginne bei der kleinsten.",
    richtig: ["89", "98", "890", "980"],
    erklaerung: "89 < 98 < 890 < 980.",
  },
  { typ: "input", frage: "Schreibe die Zahl „zweitausenddreihundertvier“ in Ziffern.", loesung: ["2304", "2 304"], platzhalter: "Zahl", erklaerung: "2 Tausender, 3 Hunderter, 0 Zehner, 4 Einer = 2 304." },
  {
    typ: "luecke",
    frage: "Welche Ziffer steht an welcher Stelle von 5 049?",
    segmente: ["Tausenderstelle: ", { luecke: ["5"] }, ", Einerstelle: ", { luecke: ["9"] }, "."],
    erklaerung: "5 049: 5 = Tausender, 0 = Hunderter, 4 = Zehner, 9 = Einer.",
  },
  { typ: "input", frage: "Welche Zahl kommt direkt nach 699?", loesung: ["700"], platzhalter: "Zahl", erklaerung: "699 + 1 = 700." },
  { typ: "input", frage: "Welche Zahl kommt direkt vor 1 000?", loesung: ["999"], platzhalter: "Zahl", erklaerung: "1 000 − 1 = 999." },
  {
    typ: "mc",
    frage: "Runde 750 auf Hunderter.",
    antworten: ["800", "700", "750", "1 000"],
    richtig: 0,
    erklaerung: "Die Zehnerstelle ist 5, also aufrunden: 800.",
  },
  { typ: "input", frage: "Wie viele Zehner stecken in der Zahl 460?", loesung: ["46"], platzhalter: "Zahl", erklaerung: "460 : 10 = 46 Zehner." },
  { typ: "input", frage: "Runde 3 390 auf Tausender.", loesung: ["3000", "3 000"], platzhalter: "Zahl", erklaerung: "Die Hunderterstelle ist 3 (< 5), also abrunden: 3 000." },
  {
    typ: "mc",
    frage: "Welche Zahl liegt zwischen 340 und 360?",
    antworten: ["350", "330", "365", "400"],
    richtig: 0,
    erklaerung: "350 liegt zwischen 340 und 360.",
  },
  {
    typ: "zuordnen",
    frage: "Runde jede Zahl auf Zehner und ordne zu.",
    paare: [
      { links: "13", rechts: "10" },
      { links: "15", rechts: "20" },
      { links: "78", rechts: "80" },
      { links: "52", rechts: "50" },
    ],
    erklaerung: "13 → 10 (ab), 15 → 20 (auf), 78 → 80 (auf), 52 → 50 (ab).",
  },
  { typ: "input", frage: "Ein Stadion hat 4 985 Plätze. Runde auf Tausender.", loesung: ["5000", "5 000"], platzhalter: "Zahl", erklaerung: "Die Hunderterstelle ist 9 (≥ 5), also aufrunden: 5 000." },
];

export default NAT_ZAHLEN_MS5;
