// ============================================================================
// Interaktive Aufgaben — Zahlen bis 1000 · Grundschule Kl. 3 · Bayern
// Hunderter, Zehner, Einer; Nachbarzahlen, Runden, Ordnen bis 1000.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const ZAHLEN1000_GS3: Aufgabe[] = [
  { typ: "input", frage: "Wie viele Hunderter hat die Zahl 374?", loesung: ["3"], platzhalter: "Zahl", erklaerung: "374 = 3 Hunderter, 7 Zehner, 4 Einer." },
  { typ: "input", frage: "Welche Zahl besteht aus 6 Hundertern, 0 Zehnern und 5 Einern?", loesung: ["605"], platzhalter: "Zahl", erklaerung: "600 + 0 + 5 = 605." },
  { typ: "input", frage: "Welche Zahl kommt nach 599?", loesung: ["600"], platzhalter: "Zahl", erklaerung: "599 + 1 = 600." },
  { typ: "input", frage: "Welche Zahl kommt vor 1000?", loesung: ["999"], platzhalter: "Zahl", erklaerung: "1000 − 1 = 999." },
  { typ: "input", frage: "Hunderterschritte: 400, 500, 600 — welche Zahl kommt als Nächstes?", loesung: ["700"], platzhalter: "Zahl", erklaerung: "Immer 100 mehr: 700." },
  { typ: "input", frage: "Welche Zahl ist um 100 größer als 250?", loesung: ["350"], platzhalter: "Zahl", erklaerung: "250 + 100 = 350." },
  { typ: "input", frage: "Runde 468 auf den nächsten Hunderter.", loesung: ["500"], platzhalter: "Zahl", erklaerung: "Die Zehnerstelle ist 6 (≥ 5), also aufrunden: 500." },
  { typ: "input", frage: "Runde 432 auf den nächsten Hunderter.", loesung: ["400"], platzhalter: "Zahl", erklaerung: "Die Zehnerstelle ist 3 (< 5), also abrunden: 400." },
  {
    typ: "mc",
    frage: "Welche Zahl ist am größten?",
    antworten: ["909", "899", "890", "809"],
    richtig: 0,
    erklaerung: "909 > 899 > 890 > 809.",
  },
  {
    typ: "mc",
    frage: "Welche Zahl liegt genau zwischen 300 und 400?",
    antworten: ["350", "340", "390", "310"],
    richtig: 0,
    erklaerung: "Die Mitte zwischen 300 und 400 ist 350.",
  },
  {
    typ: "luecke",
    frage: "Die Zahl 728.",
    segmente: ["Hunderter: ", { luecke: ["7"] }, ", Zehner: ", { luecke: ["2"] }, ", Einer: 8."],
    erklaerung: "728 = 7 Hunderter, 2 Zehner, 8 Einer.",
  },
  {
    typ: "zuordnen",
    frage: "Ordne jeder Zahl ihre Zerlegung zu.",
    paare: [
      { links: "245", rechts: "200 + 40 + 5" },
      { links: "504", rechts: "500 + 4" },
      { links: "830", rechts: "800 + 30" },
      { links: "1000", rechts: "10 Hunderter" },
    ],
    erklaerung: "245 = 200+40+5; 504 = 500+4; 830 = 800+30; 1000 = 10 · 100.",
  },
  {
    typ: "sortieren",
    frage: "Ordne die Zahlen von klein nach groß.",
    richtig: ["89", "198", "819", "981"],
    erklaerung: "89 < 198 < 819 < 981.",
  },
  { typ: "input", frage: "Schreibe die Zahl „vierhundertsieben“ in Ziffern.", loesung: ["407"], platzhalter: "Zahl", erklaerung: "4 Hunderter, 0 Zehner, 7 Einer = 407." },
  { typ: "input", frage: "In der Turnhalle sind 3 Hunderterpäckchen und 6 Zehnerpäckchen Bälle. Wie viele Bälle sind das?", loesung: ["360"], platzhalter: "Zahl", erklaerung: "300 + 60 = 360 Bälle." },
];

export default ZAHLEN1000_GS3;
