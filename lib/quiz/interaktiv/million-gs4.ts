// ============================================================================
// Interaktive Aufgaben — Zahlen bis 1 Million · Grundschule Kl. 4 · Bayern
// Stellenwerttafel bis zur Million, Runden, Vergleichen, große Zahlen lesen.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const MILLION_GS4: Aufgabe[] = [
  { typ: "input", frage: "Wie viele Nullen hat eine Million?", loesung: ["6"], platzhalter: "Zahl", erklaerung: "1 000 000 hat 6 Nullen." },
  { typ: "input", frage: "Welche Ziffer steht bei 348 512 an der Zehntausenderstelle?", loesung: ["4"], platzhalter: "Ziffer", erklaerung: "348 512: 3 = Hunderttausender, 4 = Zehntausender, 8 = Tausender." },
  { typ: "input", frage: "Welche Zahl kommt nach 99 999?", loesung: ["100000", "100 000"], platzhalter: "Zahl", erklaerung: "99 999 + 1 = 100 000." },
  { typ: "input", frage: "Runde 47 300 auf den nächsten Tausender.", loesung: ["47000", "47 000"], platzhalter: "Zahl", erklaerung: "Die Hunderterstelle ist 3 (< 5), also abrunden: 47 000." },
  { typ: "input", frage: "Runde 285 000 auf den nächsten Hunderttausender.", loesung: ["300000", "300 000"], platzhalter: "Zahl", erklaerung: "Die Zehntausenderstelle ist 8 (≥ 5), also aufrunden: 300 000." },
  { typ: "input", frage: "Welche Zahl ist um 1 000 größer als 56 200?", loesung: ["57200", "57 200"], platzhalter: "Zahl", erklaerung: "56 200 + 1 000 = 57 200." },
  {
    typ: "mc",
    frage: "Welche Zahl ist am größten?",
    antworten: ["510 000", "501 000", "500 100", "500 010"],
    richtig: 0,
    erklaerung: "510 000 > 501 000 > 500 100 > 500 010.",
  },
  {
    typ: "mc",
    frage: "Wie schreibt man „zweihunderttausend“ in Ziffern?",
    antworten: ["200 000", "2 000", "20 000", "2 000 000"],
    richtig: 0,
    erklaerung: "Zweihunderttausend = 200 000 (5 Nullen).",
  },
  {
    typ: "luecke",
    frage: "Die Zahl 630 500 in der Stellenwerttafel: Welche Ziffer steht an der jeweiligen Stelle?",
    segmente: ["Ziffer an der Hunderttausenderstelle: ", { luecke: ["6"] }, ", Ziffer an der Tausenderstelle: ", { luecke: ["0"] }, "."],
    erklaerung: "630 500 = 6 Hunderttausender, 3 Zehntausender, 0 Tausender, 5 Hunderter.",
  },
  {
    typ: "zuordnen",
    frage: "Ordne die Zahlwörter den Zahlen zu.",
    paare: [
      { links: "zehntausend", rechts: "10 000" },
      { links: "hunderttausend", rechts: "100 000" },
      { links: "eine Million", rechts: "1 000 000" },
      { links: "fünftausend", rechts: "5 000" },
    ],
    erklaerung: "10 000, 100 000, 1 000 000 und 5 000.",
  },
  {
    typ: "sortieren",
    frage: "Ordne die Zahlen von klein nach groß.",
    richtig: ["9 999", "90 099", "99 009", "900 990"],
    erklaerung: "9 999 < 90 099 < 99 009 < 900 990.",
  },
  { typ: "input", frage: "Eine Stadt hat 68 490 Einwohner. Runde auf den nächsten Tausender.", loesung: ["68000", "68 000"], platzhalter: "Zahl", erklaerung: "Die Hunderterstelle ist 4 (< 5), also abrunden: 68 000." },
  { typ: "input", frage: "Schreibe die Zahl „dreißigtausendzwanzig“ in Ziffern.", loesung: ["30020", "30 020"], platzhalter: "Zahl", erklaerung: "30 000 + 20 = 30 020." },
  {
    typ: "mc",
    frage: "Was ist die Hälfte von 1 Million?",
    antworten: ["500 000", "100 000", "50 000", "250 000"],
    richtig: 0,
    erklaerung: "1 000 000 : 2 = 500 000.",
  },
  { typ: "input", frage: "Zähle in Zehntausenderschritten: 40 000, 50 000, 60 000 — welche Zahl kommt als Nächstes?", loesung: ["70000", "70 000"], platzhalter: "Zahl", erklaerung: "Immer 10 000 mehr: 70 000." },
];

export default MILLION_GS4;
