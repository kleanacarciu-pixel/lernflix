// ============================================================================
// Interaktive Aufgaben — Multiplizieren & Dividieren · Gymnasium Kl. 5
// Schriftliches Rechnen, Division mit Rest, Distributivgesetz.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const MALNEHMEN_GYM5: Aufgabe[] = [
  { typ: "input", frage: "Berechne 234 · 3.", loesung: ["702"], platzhalter: "Zahl", erklaerung: "234 · 3 = 702." },
  { typ: "input", frage: "Berechne 125 · 8.", loesung: ["1000", "1 000"], platzhalter: "Zahl", erklaerung: "125 · 8 = 1 000." },
  { typ: "input", frage: "Berechne 4 · 250.", loesung: ["1000", "1 000"], platzhalter: "Zahl", erklaerung: "4 · 250 = 1 000." },
  { typ: "input", frage: "Berechne 96 : 4.", loesung: ["24"], platzhalter: "Zahl", erklaerung: "96 : 4 = 24." },
  { typ: "input", frage: "Berechne 84 : 7.", loesung: ["12"], platzhalter: "Zahl", erklaerung: "7 · 12 = 84, also 84 : 7 = 12." },
  { typ: "input", frage: "Wie groß ist der Rest bei 100 : 8?", loesung: ["4"], platzhalter: "Zahl", erklaerung: "8 · 12 = 96, und 100 − 96 = 4. Rest 4." },
  { typ: "input", frage: "Berechne 13 · 20.", loesung: ["260"], platzhalter: "Zahl", erklaerung: "13 · 2 = 26, also 13 · 20 = 260." },
  { typ: "input", frage: "Berechne 7 · 100.", loesung: ["700"], platzhalter: "Zahl", erklaerung: "Mal 100 hängt zwei Nullen an: 700." },
  {
    typ: "luecke",
    frage: "Rechne geschickt.",
    segmente: ["25 · 4 = ", { luecke: ["100"] }, "  und  4 · 25 · 3 = ", { luecke: ["300"] }, "."],
    erklaerung: "25 · 4 = 100, dann 100 · 3 = 300.",
  },
  { typ: "input", frage: "In 6 Kisten sind je 24 Flaschen. Wie viele Flaschen sind das insgesamt?", loesung: ["144"], platzhalter: "Zahl", erklaerung: "6 · 24 = 144 Flaschen." },
  { typ: "input", frage: "120 Bonbons werden gleichmäßig auf 8 Kinder verteilt. Wie viele bekommt jedes Kind?", loesung: ["15"], platzhalter: "Zahl", erklaerung: "120 : 8 = 15 Bonbons." },
  {
    typ: "mc",
    frage: "Welches Rechengesetz steckt hinter 3 · (4 + 5) = 3 · 4 + 3 · 5?",
    antworten: ["Verteilungsgesetz (Distributivgesetz)", "Vertauschungsgesetz", "Verbindungsgesetz", "gar keins"],
    richtig: 0,
    erklaerung: "Beim Distributivgesetz wird der Faktor auf beide Summanden verteilt.",
  },
  { typ: "input", frage: "Berechne 15 · 12.", loesung: ["180"], platzhalter: "Zahl", erklaerung: "15 · 12 = 15 · 10 + 15 · 2 = 150 + 30 = 180." },
  { typ: "input", frage: "Berechne 240 : 6.", loesung: ["40"], platzhalter: "Zahl", erklaerung: "240 : 6 = 40." },
  { typ: "input", frage: "Wie groß ist der Rest bei 45 : 6?", loesung: ["3"], platzhalter: "Zahl", erklaerung: "6 · 7 = 42, und 45 − 42 = 3. Rest 3." },
];

export default MALNEHMEN_GYM5;
