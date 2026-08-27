// ============================================================================
// Interaktive Aufgaben — Uhrzeit ablesen · Grundschule Kl. 2 · Bayern
// Volle und halbe Stunden, Viertelstunden, Minuten, Tagesablauf.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const UHRZEIT_GS2: Aufgabe[] = [
  { typ: "input", frage: "Wie viele Minuten hat eine Stunde?", loesung: ["60"], einheit: "min", platzhalter: "Zahl", erklaerung: "1 Stunde = 60 Minuten." },
  { typ: "input", frage: "Wie viele Stunden hat ein ganzer Tag?", loesung: ["24"], platzhalter: "Zahl", erklaerung: "Ein Tag hat 24 Stunden." },
  { typ: "input", frage: "Wie viele Minuten ist eine halbe Stunde?", loesung: ["30"], einheit: "min", platzhalter: "Zahl", erklaerung: "60 : 2 = 30 Minuten." },
  { typ: "input", frage: "Wie viele Minuten ist eine Viertelstunde?", loesung: ["15"], einheit: "min", platzhalter: "Zahl", erklaerung: "60 : 4 = 15 Minuten." },
  {
    typ: "mc",
    frage: "Der große Zeiger steht auf der 12, der kleine auf der 3. Wie spät ist es?",
    antworten: ["3 Uhr", "12 Uhr", "halb 4", "viertel nach 12"],
    richtig: 0,
    erklaerung: "Großer Zeiger auf 12 = volle Stunde. Kleiner Zeiger auf 3 = 3 Uhr.",
  },
  {
    typ: "mc",
    frage: "Der große Zeiger steht auf der 6, der kleine zwischen 7 und 8. Wie spät ist es?",
    antworten: ["halb 8", "halb 7", "7 Uhr", "8 Uhr"],
    richtig: 0,
    erklaerung: "Großer Zeiger auf 6 = halb. Der kleine Zeiger ist zwischen 7 und 8 — also halb 8 (7:30 Uhr).",
  },
  {
    typ: "mc",
    frage: "Was ist dasselbe wie 15:00 Uhr?",
    antworten: ["3 Uhr nachmittags", "5 Uhr nachmittags", "3 Uhr nachts", "15 Uhr morgens"],
    richtig: 0,
    erklaerung: "15 − 12 = 3, also 3 Uhr am Nachmittag.",
  },
  { typ: "input", frage: "Es ist 8:00 Uhr. Wie spät ist es in 2 Stunden? (Format h:mm)", loesung: ["10:00", "10"], einheit: "Uhr", platzhalter: "z. B. 10:00", erklaerung: "8 + 2 = 10 — es ist 10:00 Uhr." },
  { typ: "input", frage: "Es ist 14:00 Uhr. Wie spät war es vor 3 Stunden? (Format h:mm)", loesung: ["11:00", "11"], einheit: "Uhr", platzhalter: "z. B. 11:00", erklaerung: "14 − 3 = 11 — es war 11:00 Uhr." },
  {
    typ: "luecke",
    frage: "Umrechnen.",
    segmente: ["2 Stunden = ", { luecke: ["120"] }, " Minuten und 1 Minute = ", { luecke: ["60"] }, " Sekunden."],
    erklaerung: "2 · 60 = 120 Minuten. 1 Minute = 60 Sekunden.",
  },
  {
    typ: "zuordnen",
    frage: "Ordne die Uhrzeiten zu.",
    paare: [
      { links: "7:00 Uhr", rechts: "aufstehen" },
      { links: "8:00 Uhr", rechts: "Schule beginnt" },
      { links: "12:30 Uhr", rechts: "Mittagessen" },
      { links: "20:00 Uhr", rechts: "schlafen gehen" },
    ],
    erklaerung: "Ein typischer Tag: 7 Uhr aufstehen, 8 Uhr Schule, 12:30 Mittagessen, 20 Uhr ins Bett.",
  },
  {
    typ: "mc",
    frage: "„Viertel nach 5“ — welche Uhrzeit ist das?",
    antworten: ["5:15 Uhr", "5:45 Uhr", "4:45 Uhr", "5:30 Uhr"],
    richtig: 0,
    erklaerung: "Viertel nach 5 = 15 Minuten nach 5 = 5:15 Uhr.",
  },
  { typ: "input", frage: "Der Unterricht dauert von 8:00 bis 9:00 Uhr. Wie viele Minuten sind das?", loesung: ["60"], einheit: "min", platzhalter: "Zahl", erklaerung: "Von 8 bis 9 Uhr ist genau 1 Stunde = 60 Minuten." },
  { typ: "input", frage: "Die Pause beginnt um 9:30 Uhr und dauert 30 Minuten. Wann endet sie? (Format h:mm)", loesung: ["10:00", "10"], einheit: "Uhr", platzhalter: "z. B. 10:00", erklaerung: "9:30 Uhr + 30 min = 10:00 Uhr." },
  {
    typ: "sortieren",
    frage: "Ordne die Uhrzeiten vom Morgen zum Abend: 15:00 Uhr, 7:30 Uhr, 12:00 Uhr, 19:00 Uhr",
    richtig: ["7:30 Uhr", "12:00 Uhr", "15:00 Uhr", "19:00 Uhr"],
    erklaerung: "7:30 (Morgen) < 12:00 (Mittag) < 15:00 (Nachmittag) < 19:00 (Abend).",
  },
];

export default UHRZEIT_GS2;
