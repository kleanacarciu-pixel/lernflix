// ============================================================================
// Interaktive Aufgaben — Rechnen mit natürlichen Zahlen · Realschule Kl. 5
// Addition/Subtraktion, Überschlag, Rechenreihenfolge, Sachaufgaben.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const RECHNEN_RS5: Aufgabe[] = [
  { typ: "input", frage: "Berechne 2 345 + 4 876.", loesung: ["7221", "7 221"], platzhalter: "Zahl", erklaerung: "2 345 + 4 876 = 7 221." },
  { typ: "input", frage: "Berechne 9 000 − 4 638.", loesung: ["4362", "4 362"], platzhalter: "Zahl", erklaerung: "9 000 − 4 638 = 4 362." },
  { typ: "input", frage: "Überschlage 512 + 293, indem du auf Hunderter rundest.", loesung: ["800"], platzhalter: "Zahl", erklaerung: "512 ≈ 500 und 293 ≈ 300. Überschlag: 500 + 300 = 800." },
  { typ: "input", frage: "Berechne 35 + 65 + 18.", loesung: ["118"], platzhalter: "Zahl", erklaerung: "Geschickt: 35 + 65 = 100, plus 18 = 118." },
  {
    typ: "luecke",
    frage: "Rechne geschickt: 45 + 55 + 37.",
    segmente: ["Zuerst 45 + 55 = ", { luecke: ["100"] }, ", plus 37 = ", { luecke: ["137"] }, "."],
    erklaerung: "45 + 55 = 100, dann 100 + 37 = 137.",
  },
  { typ: "input", frage: "Berechne 30 − 5 · 4. (Punkt vor Strich!)", loesung: ["10"], platzhalter: "Zahl", erklaerung: "Zuerst 5 · 4 = 20, dann 30 − 20 = 10." },
  { typ: "input", frage: "Berechne (30 − 5) · 4.", loesung: ["100"], platzhalter: "Zahl", erklaerung: "Zuerst die Klammer: 30 − 5 = 25, dann 25 · 4 = 100." },
  { typ: "input", frage: "Berechne 6 · 9.", loesung: ["54"], platzhalter: "Zahl", erklaerung: "6 · 9 = 54." },
  { typ: "input", frage: "Berechne 72 : 8.", loesung: ["9"], platzhalter: "Zahl", erklaerung: "8 · 9 = 72, also 72 : 8 = 9." },
  { typ: "input", frage: "Ein Karton fasst 24 Flaschen. Wie viele Flaschen passen in 5 Kartons?", loesung: ["120"], platzhalter: "Zahl", erklaerung: "24 · 5 = 120 Flaschen." },
  { typ: "input", frage: "Berechne 8 · 7.", loesung: ["56"], platzhalter: "Zahl", erklaerung: "8 · 7 = 56." },
  {
    typ: "mc",
    frage: "Was rechnet man in 5 + 4 · 6 zuerst?",
    antworten: ["4 · 6", "5 + 4", "von links nach rechts", "alles gleichzeitig"],
    richtig: 0,
    erklaerung: "Punkt vor Strich: zuerst 4 · 6 = 24, dann 5 + 24 = 29.",
  },
  { typ: "input", frage: "Berechne 200 − 75 − 25.", loesung: ["100"], platzhalter: "Zahl", erklaerung: "200 − 75 = 125, dann 125 − 25 = 100." },
  {
    typ: "mc",
    frage: "Welche Gleichung zeigt das Vertauschungsgesetz (Kommutativgesetz)?",
    antworten: ["6 + 8 = 8 + 6", "6 · 1 = 6", "6 + 0 = 6", "(1 + 2) + 3 = 1 + (2 + 3)"],
    richtig: 0,
    erklaerung: "Beim Vertauschungsgesetz darf man die Summanden tauschen: a + b = b + a.",
  },
  { typ: "input", frage: "Berechne 400 : 5.", loesung: ["80"], platzhalter: "Zahl", erklaerung: "400 : 5 = 80." },
];

export default RECHNEN_RS5;
