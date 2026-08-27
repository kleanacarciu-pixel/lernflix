// ============================================================================
// Interaktive Aufgaben — Natürliche Zahlen · Hauptschule Kl. 5 · Bayern
// Stellenwert, Runden, Ordnen, Zahlenstrahl — einfache Zahlen, viel Alltag.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const NAT_ZAHLEN_HS5: Aufgabe[] = [
  { typ: "input", frage: "Welche Ziffer steht in der Zahl 528 an der Zehnerstelle?", loesung: ["2"], platzhalter: "Ziffer", erklaerung: "528: 5 = Hunderter, 2 = Zehner, 8 = Einer." },
  { typ: "input", frage: "Welche Ziffer steht in der Zahl 1 746 an der Hunderterstelle?", loesung: ["7"], platzhalter: "Ziffer", erklaerung: "1 746: 1 = Tausender, 7 = Hunderter, 4 = Zehner, 6 = Einer." },
  { typ: "input", frage: "Runde 47 auf Zehner.", loesung: ["50"], platzhalter: "Zahl", erklaerung: "Die Einerstelle ist 7 (≥ 5), also aufrunden: 50." },
  { typ: "input", frage: "Runde 132 auf Zehner.", loesung: ["130"], platzhalter: "Zahl", erklaerung: "Die Einerstelle ist 2 (< 5), also abrunden: 130." },
  { typ: "input", frage: "Runde 1 850 auf Hunderter.", loesung: ["1900", "1 900"], platzhalter: "Zahl", erklaerung: "Die Zehnerstelle ist 5, also aufrunden: 1 900." },
  {
    typ: "mc",
    frage: "Welche Zahl ist am kleinsten?",
    antworten: ["489", "498", "849", "894"],
    richtig: 0,
    erklaerung: "489 < 498 < 849 < 894.",
  },
  {
    typ: "sortieren",
    frage: "Ordne die Zahlen aufsteigend — beginne bei der kleinsten.",
    richtig: ["67", "76", "607", "670"],
    erklaerung: "67 < 76 < 607 < 670.",
  },
  { typ: "input", frage: "Schreibe die Zahl „dreitausendfünfzig“ in Ziffern.", loesung: ["3050", "3 050"], platzhalter: "Zahl", erklaerung: "3 Tausender, 0 Hunderter, 5 Zehner, 0 Einer = 3 050." },
  { typ: "input", frage: "Welche Zahl kommt direkt nach 499?", loesung: ["500"], platzhalter: "Zahl", erklaerung: "499 + 1 = 500." },
  { typ: "input", frage: "Welche Zahl kommt direkt vor 800?", loesung: ["799"], platzhalter: "Zahl", erklaerung: "800 − 1 = 799." },
  {
    typ: "mc",
    frage: "Welche Zahl liegt zwischen 120 und 140?",
    antworten: ["130", "115", "145", "150"],
    richtig: 0,
    erklaerung: "120 < 130 < 140.",
  },
  {
    typ: "luecke",
    frage: "Die Zahl 2 807.",
    segmente: ["Tausenderstelle: ", { luecke: ["2"] }, ", Zehnerstelle: ", { luecke: ["0"] }, "."],
    erklaerung: "2 807: 2 = Tausender, 8 = Hunderter, 0 = Zehner, 7 = Einer.",
  },
  {
    typ: "zuordnen",
    frage: "Runde jede Zahl auf Zehner und ordne zu.",
    paare: [
      { links: "24", rechts: "20" },
      { links: "36", rechts: "40" },
      { links: "65", rechts: "70" },
      { links: "81", rechts: "80" },
    ],
    erklaerung: "24 → 20 (ab), 36 → 40 (auf), 65 → 70 (auf, denn Einer ist 5), 81 → 80 (ab).",
  },
  { typ: "input", frage: "Bei einem Konzert waren 2 380 Besucher. Runde auf Tausender.", loesung: ["2000", "2 000"], platzhalter: "Zahl", erklaerung: "Die Hunderterstelle ist 3 (< 5), also abrunden: 2 000." },
  { typ: "input", frage: "Wie viele Zehner stecken in der Zahl 380?", loesung: ["38"], platzhalter: "Zahl", erklaerung: "380 : 10 = 38 Zehner." },
];

export default NAT_ZAHLEN_HS5;
