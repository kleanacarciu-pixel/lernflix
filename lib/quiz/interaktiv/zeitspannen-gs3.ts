// ============================================================================
// Interaktive Aufgaben — Zeitspannen · Grundschule Kl. 3 · Bayern
// Uhrzeiten und Dauer: Minuten, Stunden, Tage; Start- und Endzeiten berechnen.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const ZEITSPANNEN_GS3: Aufgabe[] = [
  { typ: "input", frage: "Wie viele Minuten hat eine Stunde?", loesung: ["60"], einheit: "min", platzhalter: "Zahl", erklaerung: "1 h = 60 min." },
  { typ: "input", frage: "Wie viele Stunden hat ein Tag?", loesung: ["24"], platzhalter: "Zahl", erklaerung: "Ein Tag hat 24 Stunden." },
  { typ: "input", frage: "Wie viele Tage hat eine Woche?", loesung: ["7"], platzhalter: "Zahl", erklaerung: "Eine Woche hat 7 Tage." },
  { typ: "input", frage: "Wie viele Monate hat ein Jahr?", loesung: ["12"], platzhalter: "Zahl", erklaerung: "Ein Jahr hat 12 Monate." },
  { typ: "input", frage: "Wie viele Minuten sind 2 Stunden?", loesung: ["120"], einheit: "min", platzhalter: "Zahl", erklaerung: "2 · 60 = 120 min." },
  { typ: "input", frage: "Der Film beginnt um 15:00 Uhr und dauert 90 Minuten. Wann endet er? (Format h:mm)", loesung: ["16:30"], einheit: "Uhr", platzhalter: "z. B. 16:30", erklaerung: "90 min = 1 h 30 min. 15:00 + 1:30 = 16:30 Uhr." },
  { typ: "input", frage: "Die Schule beginnt um 8:00 Uhr und endet um 13:00 Uhr. Wie viele Stunden bist du in der Schule?", loesung: ["5"], einheit: "h", platzhalter: "Zahl", erklaerung: "Von 8 bis 13 Uhr sind es 5 Stunden." },
  { typ: "input", frage: "Das Training geht von 16:30 bis 17:15 Uhr. Wie viele Minuten dauert es?", loesung: ["45"], einheit: "min", platzhalter: "Zahl", erklaerung: "16:30 bis 17:00 sind 30 min, bis 17:15 noch 15 min: 45 min." },
  {
    typ: "mc",
    frage: "Was dauert ungefähr eine Minute?",
    antworten: ["60-mal langsam zählen", "eine Schulstunde", "eine Nacht", "ein Fußballspiel"],
    richtig: 0,
    erklaerung: "Eine Minute = 60 Sekunden — ungefähr 60-mal langsam zählen.",
  },
  {
    typ: "mc",
    frage: "Paul geht um 19:30 Uhr ins Bett und steht um 7:00 Uhr auf. Wie lange schläft er ungefähr?",
    antworten: ["11 Stunden und 30 Minuten", "8 Stunden", "13 Stunden", "10 Stunden"],
    richtig: 0,
    erklaerung: "Von 19:30 bis 7:00 Uhr sind es 11 Stunden und 30 Minuten.",
  },
  {
    typ: "luecke",
    frage: "Umrechnen.",
    segmente: ["3 h = ", { luecke: ["180"] }, " min und 1 h 20 min = ", { luecke: ["80"] }, " min."],
    erklaerung: "3 · 60 = 180 min. 60 + 20 = 80 min.",
  },
  {
    typ: "zuordnen",
    frage: "Ordne jeder Tätigkeit die passende Dauer zu.",
    paare: [
      { links: "Zähne putzen", rechts: "3 Minuten" },
      { links: "Schulstunde", rechts: "45 Minuten" },
      { links: "Nachtschlaf", rechts: "10 Stunden" },
      { links: "Sommerferien", rechts: "6 Wochen" },
    ],
    erklaerung: "Zähne putzen ≈ 3 min, Schulstunde = 45 min, Schlaf ≈ 10 h, Sommerferien in Bayern = 6 Wochen.",
  },
  { typ: "input", frage: "Lena übt jeden Tag 20 Minuten Flöte. Wie viele Minuten übt sie in einer Woche (7 Tage)?", loesung: ["140"], einheit: "min", platzhalter: "Zahl", erklaerung: "7 · 20 = 140 min." },
  { typ: "input", frage: "Der Bus fährt um 7:45 Uhr ab. Du brauchst 10 Minuten zur Haltestelle. Wann musst du spätestens losgehen? (Format h:mm)", loesung: ["7:35", "07:35"], einheit: "Uhr", platzhalter: "z. B. 7:35", erklaerung: "7:45 − 10 min = 7:35 Uhr." },
  {
    typ: "sortieren",
    frage: "Ordne die Zeitspannen von kurz nach lang: 1 Stunde, 90 Minuten, 45 Minuten, 1 Tag",
    richtig: ["45 Minuten", "1 Stunde", "90 Minuten", "1 Tag"],
    erklaerung: "45 min < 60 min (= 1 h) < 90 min < 24 h (= 1 Tag).",
  },
];

export default ZEITSPANNEN_GS3;
