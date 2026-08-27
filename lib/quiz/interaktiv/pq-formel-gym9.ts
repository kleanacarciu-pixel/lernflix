// ============================================================================
// Interaktive Aufgaben — pq-Formel & quadratische Gleichungen · Gym. Kl. 9
// x² + px + q = 0. Saubere (ganzzahlige) Lösungen.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const PQ_FORMEL_GYM9: Aufgabe[] = [
  { typ: "input", frage: "Löse x² = 9. Gib die positive Lösung an.", loesung: ["3"], platzhalter: "Zahl", erklaerung: "x² = 9 → x = 3 (und x = −3)." },
  { typ: "input", frage: "Löse x² = 49. Gib die positive Lösung an.", loesung: ["7"], platzhalter: "Zahl", erklaerung: "x = √49 = 7 (und −7)." },
  { typ: "input", frage: "Löse x² − 5x + 6 = 0. Gib die kleinere Lösung an.", loesung: ["2"], platzhalter: "Zahl", erklaerung: "Lösungen x = 2 und x = 3 (denn 2 + 3 = 5 und 2 · 3 = 6)." },
  { typ: "input", frage: "Löse x² − 5x + 6 = 0. Gib die größere Lösung an.", loesung: ["3"], platzhalter: "Zahl", erklaerung: "Lösungen x = 2 und x = 3." },
  { typ: "input", frage: "Löse x² − 7x + 12 = 0. Gib die kleinere Lösung an.", loesung: ["3"], platzhalter: "Zahl", erklaerung: "Lösungen x = 3 und x = 4 (3 + 4 = 7, 3 · 4 = 12)." },
  { typ: "input", frage: "Löse x² − 7x + 12 = 0. Gib die größere Lösung an.", loesung: ["4"], platzhalter: "Zahl", erklaerung: "Lösungen x = 3 und x = 4." },
  {
    typ: "mc",
    frage: "Wie lautet die pq-Formel für x² + px + q = 0?",
    antworten: ["x = −p/2 ± √((p/2)² − q)", "x = −p ± √(p² − q)", "x = p/2 ± √q", "x = −q/2 ± √p"],
    richtig: 0,
    erklaerung: "x = −p/2 ± √((p/2)² − q).",
  },
  { typ: "input", frage: "Löse x² − 4 = 0. Gib die positive Lösung an.", loesung: ["2"], platzhalter: "Zahl", erklaerung: "x² = 4 → x = 2 (und −2)." },
  { typ: "input", frage: "Löse x² + 2x − 8 = 0. Gib die positive Lösung an.", loesung: ["2"], platzhalter: "Zahl", erklaerung: "Lösungen x = 2 und x = −4 (2 · (−4) = −8, 2 + (−4) = −2)." },
  {
    typ: "luecke",
    frage: "Die Gleichung x² − 6x + 8 = 0 lösen. (Kleinere Lösung zuerst.)",
    segmente: ["Die Lösungen sind x = ", { luecke: ["2"] }, " und x = ", { luecke: ["4"] }, "."],
    erklaerung: "2 + 4 = 6 und 2 · 4 = 8, also x = 2 und x = 4.",
  },
  { typ: "input", frage: "Wie viele Lösungen hat x² = 0?", loesung: ["1"], platzhalter: "Zahl", erklaerung: "Nur x = 0 (doppelte Lösung) — also eine Lösung." },
  {
    typ: "mc",
    frage: "Wie viele reelle Lösungen hat x² + 1 = 0?",
    antworten: ["keine", "eine", "zwei", "unendlich viele"],
    richtig: 0,
    erklaerung: "x² = −1 hat keine reelle Lösung (ein Quadrat ist nie negativ).",
  },
  { typ: "input", frage: "Löse x² − 10x + 25 = 0.", loesung: ["5"], platzhalter: "Zahl", erklaerung: "(x − 5)² = 0, also x = 5 (doppelte Lösung)." },
  { typ: "input", frage: "Löse x² − x − 6 = 0. Gib die positive Lösung an.", loesung: ["3"], platzhalter: "Zahl", erklaerung: "Lösungen x = 3 und x = −2 (3 · (−2) = −6, 3 + (−2) = 1)." },
  { typ: "input", frage: "Löse 2x² = 18. Gib die positive Lösung an.", loesung: ["3"], platzhalter: "Zahl", erklaerung: "x² = 9 → x = 3 (und −3)." },
];

export default PQ_FORMEL_GYM9;
