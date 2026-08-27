// ============================================================================
// Interaktive Aufgaben — Schriftlich Multiplizieren · Grundschule Kl. 4 · Bayern
// Mal mit einstelligen und zweistelligen Zahlen, Überschlag, Sachaufgaben.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const MULTIPLIZIEREN_GS4: Aufgabe[] = [
  { typ: "input", frage: "Rechne schriftlich: 123 · 3", loesung: ["369"], platzhalter: "Zahl", erklaerung: "3 · 3 = 9, 2 · 3 = 6, 1 · 3 = 3 → 369." },
  { typ: "input", frage: "Rechne schriftlich: 214 · 4", loesung: ["856"], platzhalter: "Zahl", erklaerung: "4 · 4 = 16 (Übertrag 1), 1 · 4 + 1 = 5, 2 · 4 = 8 → 856." },
  { typ: "input", frage: "Rechne schriftlich: 305 · 6", loesung: ["1830", "1 830"], platzhalter: "Zahl", erklaerung: "305 · 6 = 1 830." },
  { typ: "input", frage: "Rechne: 25 · 10", loesung: ["250"], platzhalter: "Zahl", erklaerung: "Mal 10: eine Null anhängen → 250." },
  { typ: "input", frage: "Rechne: 36 · 100", loesung: ["3600", "3 600"], platzhalter: "Zahl", erklaerung: "Mal 100: zwei Nullen anhängen → 3 600." },
  { typ: "input", frage: "Rechne schriftlich: 42 · 21", loesung: ["882"], platzhalter: "Zahl", erklaerung: "42 · 20 = 840, 42 · 1 = 42, zusammen 882." },
  { typ: "input", frage: "Rechne schriftlich: 53 · 12", loesung: ["636"], platzhalter: "Zahl", erklaerung: "53 · 10 = 530, 53 · 2 = 106, zusammen 636." },
  {
    typ: "mc",
    frage: "Überschlag für 398 · 4: Was ist eine gute Näherung?",
    antworten: ["400 · 4 = 1 600", "300 · 4 = 1 200", "398 + 4 = 402", "500 · 4 = 2 000"],
    richtig: 0,
    erklaerung: "398 ist fast 400 — der Überschlag 400 · 4 = 1 600 liegt nah am genauen Ergebnis 1 592.",
  },
  {
    typ: "mc",
    frage: "Was passiert, wenn man eine Zahl mit 10 malnimmt?",
    antworten: ["Man hängt eine Null an", "Man streicht eine Null", "Die Zahl bleibt gleich", "Man addiert 10"],
    richtig: 0,
    erklaerung: "Mal 10 verschiebt alle Ziffern eine Stelle nach links — eine Null wird angehängt.",
  },
  {
    typ: "luecke",
    frage: "Schrittweise: 34 · 5.",
    segmente: ["30 · 5 = ", { luecke: ["150"] }, " und 4 · 5 = 20, zusammen ", { luecke: ["170"] }, "."],
    erklaerung: "150 + 20 = 170.",
  },
  {
    typ: "zuordnen",
    frage: "Ordne jeder Aufgabe das Ergebnis zu.",
    paare: [
      { links: "50 · 4", rechts: "200" },
      { links: "12 · 12", rechts: "144" },
      { links: "111 · 5", rechts: "555" },
      { links: "20 · 30", rechts: "600" },
    ],
    erklaerung: "50·4=200; 12·12=144; 111·5=555; 20·30=600.",
  },
  { typ: "input", frage: "Eine Klasse verkauft 45 Lose zu je 2 €. Wie viele Euro nimmt sie ein?", loesung: ["90"], einheit: "€", platzhalter: "Zahl", erklaerung: "45 · 2 = 90 €." },
  { typ: "input", frage: "In einer Kiste sind 24 Flaschen. Wie viele Flaschen sind in 6 Kisten?", loesung: ["144"], platzhalter: "Zahl", erklaerung: "24 · 6 = 144 Flaschen." },
  { typ: "input", frage: "Ein Schulbus fährt jeden Tag 35 km. Wie viele Kilometer fährt er in 5 Tagen?", loesung: ["175"], einheit: "km", platzhalter: "Zahl", erklaerung: "35 · 5 = 175 km." },
  {
    typ: "sortieren",
    frage: "Ordne die Ergebnisse von klein nach groß: 30 · 3, 15 · 4, 25 · 2, 40 · 3",
    richtig: ["25 · 2", "15 · 4", "30 · 3", "40 · 3"],
    erklaerung: "50 < 60 < 90 < 120.",
  },
];

export default MULTIPLIZIEREN_GS4;
