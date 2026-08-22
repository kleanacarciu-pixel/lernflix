// ============================================================================
// Interaktive Aufgaben — Natürliche Zahlen & Stellenwert · Gymnasium Kl. 5
// Große Zahlen, Stellenwerte, Runden, Ordnen, römische Zahlen.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const NAT_ZAHLEN_GYM5: Aufgabe[] = [
  { typ: "input", frage: "Welche Ziffer steht in der Zahl 34 582 an der Tausenderstelle?", loesung: ["4"], platzhalter: "Ziffer", erklaerung: "34 582: 3 = Zehntausender, 4 = Tausender, 5 = Hunderter, 8 = Zehner, 2 = Einer." },
  { typ: "input", frage: "Runde 6 473 auf Hunderter.", loesung: ["6500", "6 500"], platzhalter: "Zahl", erklaerung: "Die Zehnerstelle ist 7 (≥ 5), also aufrunden: 6 500." },
  { typ: "input", frage: "Runde 2 847 auf Tausender.", loesung: ["3000", "3 000"], platzhalter: "Zahl", erklaerung: "Die Hunderterstelle ist 8 (≥ 5), also aufrunden: 3 000." },
  {
    typ: "mc",
    frage: "Welche Zahl ist am größten?",
    antworten: ["10 900", "10 090", "10 009", "9 999"],
    richtig: 0,
    erklaerung: "10 900 > 10 090 > 10 009 > 9 999.",
  },
  {
    typ: "sortieren",
    frage: "Ordne die Zahlen aufsteigend — beginne bei der kleinsten.",
    richtig: ["120", "210", "1200", "2100"],
    erklaerung: "120 < 210 < 1200 < 2100.",
  },
  { typ: "input", frage: "Schreibe die Zahl „dreitausendzweihundertfünf“ in Ziffern.", loesung: ["3205", "3 205"], platzhalter: "Zahl", erklaerung: "3 Tausender, 2 Hunderter, 0 Zehner, 5 Einer = 3 205." },
  {
    typ: "luecke",
    frage: "Welche Ziffer steht an welcher Stelle von 7 250?",
    segmente: ["Hunderterstelle: ", { luecke: ["2"] }, ", Zehnerstelle: ", { luecke: ["5"] }, "."],
    erklaerung: "7 250: 7 = Tausender, 2 = Hunderter, 5 = Zehner, 0 = Einer.",
  },
  { typ: "input", frage: "Welche Zahl kommt direkt nach 9 999?", loesung: ["10000", "10 000"], platzhalter: "Zahl", erklaerung: "9 999 + 1 = 10 000." },
  { typ: "input", frage: "Welche Zahl kommt direkt vor 8 000?", loesung: ["7999", "7 999"], platzhalter: "Zahl", erklaerung: "8 000 − 1 = 7 999." },
  {
    typ: "mc",
    frage: "Runde 4 950 auf Hunderter.",
    antworten: ["5 000", "4 900", "4 950", "5 100"],
    richtig: 0,
    erklaerung: "Die Zehnerstelle ist 5, also aufrunden: 4 950 → 5 000.",
  },
  { typ: "input", frage: "Wie viele Hunderter sind in 3 400 enthalten?", loesung: ["34"], platzhalter: "Zahl", erklaerung: "3 400 : 100 = 34 Hunderter." },
  { typ: "input", frage: "Runde 6 200 auf Tausender.", loesung: ["6000", "6 000"], platzhalter: "Zahl", erklaerung: "Die Hunderterstelle ist 2 (< 5), also abrunden: 6 000." },
  {
    typ: "mc",
    frage: "Welchen Wert hat die römische Zahl X?",
    antworten: ["10", "5", "50", "100"],
    richtig: 0,
    erklaerung: "Im römischen Zahlensystem steht X für 10 (V = 5, L = 50, C = 100).",
  },
  { typ: "input", frage: "Schreibe die römische Zahl VII als normale Zahl.", loesung: ["7"], platzhalter: "Zahl", erklaerung: "V = 5, dazu zwei I: 5 + 1 + 1 = 7." },
  {
    typ: "zuordnen",
    frage: "Ordne jeder Zahl ihre Rundung auf Hunderter zu.",
    paare: [
      { links: "349", rechts: "300" },
      { links: "350", rechts: "400" },
      { links: "512", rechts: "500" },
      { links: "681", rechts: "700" },
    ],
    erklaerung: "349 → 300 (ab), 350 → 400 (auf), 512 → 500 (ab), 681 → 700 (auf).",
  },
];

export default NAT_ZAHLEN_GYM5;
