// ============================================================================
// Interaktive Aufgaben — Zahlen bis 20 · Grundschule Kl. 1 · Bayern
// Zählen, Nachbarzahlen, Vergleichen und Ordnen im Zahlenraum bis 20.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const ZAHLEN20_GS1: Aufgabe[] = [
  { typ: "input", frage: "Welche Zahl kommt nach der 7?", loesung: ["8"], platzhalter: "Zahl", erklaerung: "Beim Zählen: 7, 8. Nach der 7 kommt die 8." },
  { typ: "input", frage: "Welche Zahl kommt vor der 10?", loesung: ["9"], platzhalter: "Zahl", erklaerung: "Beim Zählen: 9, 10. Vor der 10 kommt die 9." },
  { typ: "input", frage: "Welche Zahl kommt nach der 19?", loesung: ["20"], platzhalter: "Zahl", erklaerung: "19, 20. Nach der 19 kommt die 20." },
  { typ: "input", frage: "Zweierschritte: 2, 4, 6 — welche Zahl kommt als Nächstes?", loesung: ["8"], platzhalter: "Zahl", erklaerung: "Immer 2 mehr: 2, 4, 6, 8." },
  {
    typ: "mc",
    frage: "Welche Zahl ist größer: 12 oder 15?",
    antworten: ["15", "12", "beide gleich", "das weiß man nicht"],
    richtig: 0,
    erklaerung: "15 kommt beim Zählen nach 12 — also ist 15 größer.",
  },
  {
    typ: "mc",
    frage: "Welche Zahl ist am kleinsten?",
    antworten: ["3", "8", "13", "18"],
    richtig: 0,
    erklaerung: "3 kommt beim Zählen zuerst — sie ist am kleinsten.",
  },
  {
    typ: "sortieren",
    frage: "Ordne die Zahlen von klein nach groß.",
    richtig: ["4", "9", "13", "17"],
    erklaerung: "4 < 9 < 13 < 17.",
  },
  { typ: "input", frage: "Wie viele Finger hast du an beiden Händen zusammen?", loesung: ["10"], platzhalter: "Zahl", erklaerung: "5 Finger + 5 Finger = 10 Finger." },
  {
    typ: "luecke",
    frage: "Nachbarzahlen von 12.",
    segmente: ["Vor der 12 kommt die ", { luecke: ["11"] }, ", nach der 12 kommt die ", { luecke: ["13"] }, "."],
    erklaerung: "11, 12, 13 — die Nachbarn von 12 sind 11 und 13.",
  },
  {
    typ: "mc",
    frage: "Was zeigt die Zahl 16?",
    antworten: ["1 Zehner und 6 Einer", "6 Zehner und 1 Einer", "16 Zehner", "nur Einer"],
    richtig: 0,
    erklaerung: "16 = 10 + 6, also 1 Zehner und 6 Einer.",
  },
  {
    typ: "zuordnen",
    frage: "Ordne jeder Zahl das passende Bild zu.",
    paare: [
      { links: "5", rechts: "🖐️ eine Hand voll Finger" },
      { links: "2", rechts: "👀 zwei Augen" },
      { links: "10", rechts: "🙌 alle Finger beider Hände" },
      { links: "1", rechts: "👃 eine Nase" },
    ],
    erklaerung: "5 Finger an einer Hand, 2 Augen, 10 Finger an beiden Händen, 1 Nase.",
  },
  { typ: "input", frage: "Rückwärts zählen: 10, 9, 8 — welche Zahl kommt als Nächstes?", loesung: ["7"], platzhalter: "Zahl", erklaerung: "Rückwärts: 10, 9, 8, 7." },
  {
    typ: "mc",
    frage: "Welche Zahl liegt zwischen 14 und 16?",
    antworten: ["15", "13", "17", "12"],
    richtig: 0,
    erklaerung: "14, 15, 16 — dazwischen liegt die 15.",
  },
  { typ: "input", frage: "Auf dem Tisch liegen 6 Äpfel und noch 1 Apfel dazu. Wie viele Äpfel sind das?", loesung: ["7"], platzhalter: "Zahl", erklaerung: "6 und noch 1 = 7 Äpfel." },
  { typ: "input", frage: "Welche Zahl ist um 1 kleiner als 20?", loesung: ["19"], platzhalter: "Zahl", erklaerung: "20 − 1 = 19." },
];

export default ZAHLEN20_GS1;
