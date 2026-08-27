// ============================================================================
// Interaktive Aufgaben — Rechnen mit natürlichen Zahlen · Gymnasium Kl. 5
// Addition/Subtraktion, Überschlag, Rechengesetze, Rechenreihenfolge.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const RECHNEN_GYM5: Aufgabe[] = [
  { typ: "input", frage: "Berechne 3 456 + 2 789.", loesung: ["6245", "6 245"], platzhalter: "Zahl", erklaerung: "3 456 + 2 789 = 6 245." },
  { typ: "input", frage: "Berechne 8 000 − 3 567.", loesung: ["4433", "4 433"], platzhalter: "Zahl", erklaerung: "8 000 − 3 567 = 4 433." },
  { typ: "input", frage: "Überschlage 297 + 405, indem du auf Hunderter rundest.", loesung: ["700"], platzhalter: "Zahl", erklaerung: "297 ≈ 300 und 405 ≈ 400. Überschlag: 300 + 400 = 700." },
  { typ: "input", frage: "Berechne 45 + 55 + 20.", loesung: ["120"], platzhalter: "Zahl", erklaerung: "Geschickt: 45 + 55 = 100, plus 20 = 120." },
  {
    typ: "luecke",
    frage: "Rechne geschickt: 25 + 47 + 75.",
    segmente: ["Zuerst 25 + 75 = ", { luecke: ["100"] }, ", plus 47 = ", { luecke: ["147"] }, "."],
    erklaerung: "25 + 75 = 100, dann 100 + 47 = 147.",
  },
  { typ: "input", frage: "Berechne 20 − 4 · 3. (Punkt vor Strich!)", loesung: ["8"], platzhalter: "Zahl", erklaerung: "Zuerst 4 · 3 = 12, dann 20 − 12 = 8." },
  { typ: "input", frage: "Berechne (20 − 4) · 3.", loesung: ["48"], platzhalter: "Zahl", erklaerung: "Zuerst die Klammer: 20 − 4 = 16, dann 16 · 3 = 48." },
  { typ: "input", frage: "Berechne 100 − 45 − 25.", loesung: ["30"], platzhalter: "Zahl", erklaerung: "100 − 45 = 55, dann 55 − 25 = 30." },
  {
    typ: "mc",
    frage: "Welche Gleichung zeigt das Vertauschungsgesetz (Kommutativgesetz)?",
    antworten: ["7 + 9 = 9 + 7", "7 · 1 = 7", "5 + 0 = 5", "(2 + 3) + 4 = 2 + (3 + 4)"],
    richtig: 0,
    erklaerung: "Beim Vertauschungsgesetz darf man die Summanden tauschen: a + b = b + a.",
  },
  { typ: "input", frage: "Berechne 12 · 5.", loesung: ["60"], platzhalter: "Zahl", erklaerung: "12 · 5 = 60." },
  { typ: "input", frage: "Berechne 7 · 8.", loesung: ["56"], platzhalter: "Zahl", erklaerung: "7 · 8 = 56." },
  { typ: "input", frage: "Berechne 63 : 9.", loesung: ["7"], platzhalter: "Zahl", erklaerung: "9 · 7 = 63, also 63 : 9 = 7." },
  { typ: "input", frage: "Ein Bus hat 52 Sitzplätze. Wie viele Sitzplätze haben 3 gleiche Busse?", loesung: ["156"], platzhalter: "Zahl", erklaerung: "52 · 3 = 156." },
  { typ: "input", frage: "Berechne 6 + 6 · 0. (Punkt vor Strich!)", loesung: ["6"], platzhalter: "Zahl", erklaerung: "Zuerst 6 · 0 = 0, dann 6 + 0 = 6." },
  {
    typ: "mc",
    frage: "Was rechnet man in 2 + 3 · 4 zuerst?",
    antworten: ["3 · 4", "2 + 3", "von links nach rechts", "alles gleichzeitig"],
    richtig: 0,
    erklaerung: "Punkt vor Strich: zuerst 3 · 4 = 12, dann 2 + 12 = 14.",
  },
];

export default RECHNEN_GYM5;
