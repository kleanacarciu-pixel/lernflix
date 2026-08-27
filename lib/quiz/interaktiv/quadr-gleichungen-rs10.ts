// ============================================================================
// Interaktive Aufgaben — Quadratische Gleichungen · Realschule Kl. 10 · Bayern
// x² = a, Faktorisieren, pq-Formel. Ganzzahlige Lösungen.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const QUADR_GLEICHUNGEN_RS10: Aufgabe[] = [
  { typ: "input", frage: "Löse x² = 25. Gib die positive Lösung an.", loesung: ["5"], platzhalter: "Zahl", erklaerung: "x = √25 = 5 (und x = −5)." },
  { typ: "input", frage: "Löse x² = 64. Gib die positive Lösung an.", loesung: ["8"], platzhalter: "Zahl", erklaerung: "x = √64 = 8 (und −8)." },
  { typ: "input", frage: "Löse x² − 5x + 6 = 0. Gib die kleinere Lösung an.", loesung: ["2"], platzhalter: "Zahl", erklaerung: "Lösungen x = 2 und x = 3 (2 + 3 = 5, 2 · 3 = 6)." },
  { typ: "input", frage: "Löse x² − 5x + 6 = 0. Gib die größere Lösung an.", loesung: ["3"], platzhalter: "Zahl", erklaerung: "Lösungen x = 2 und x = 3." },
  { typ: "input", frage: "Löse x² − 9 = 0. Gib die positive Lösung an.", loesung: ["3"], platzhalter: "Zahl", erklaerung: "x² = 9 → x = 3 (und −3)." },
  { typ: "input", frage: "Löse x² + 3x − 10 = 0. Gib die positive Lösung an.", loesung: ["2"], platzhalter: "Zahl", erklaerung: "Lösungen x = 2 und x = −5 (2 · (−5) = −10, 2 + (−5) = −3)." },
  {
    typ: "mc",
    frage: "Wie lautet die pq-Formel für x² + px + q = 0?",
    antworten: ["x = −p/2 ± √((p/2)² − q)", "x = −p ± √(p² − q)", "x = p/2 ± √q", "x = −q/2 ± √p"],
    richtig: 0,
    erklaerung: "x = −p/2 ± √((p/2)² − q).",
  },
  { typ: "input", frage: "Löse x² − 8x + 16 = 0.", loesung: ["4"], platzhalter: "Zahl", erklaerung: "(x − 4)² = 0, also x = 4 (doppelte Lösung)." },
  {
    typ: "mc",
    frage: "Wie viele reelle Lösungen hat x² + 4 = 0?",
    antworten: ["keine", "eine", "zwei", "unendlich viele"],
    richtig: 0,
    erklaerung: "x² = −4 hat keine reelle Lösung — ein Quadrat ist nie negativ.",
  },
  {
    typ: "luecke",
    frage: "Löse x² − 7x + 10 = 0.",
    segmente: ["Die Lösungen sind x = ", { luecke: ["2"] }, " und x = ", { luecke: ["5"] }, "."],
    erklaerung: "2 + 5 = 7 und 2 · 5 = 10, also x = 2 und x = 5.",
  },
  { typ: "input", frage: "Wie viele Lösungen hat x² = 0?", loesung: ["1"], platzhalter: "Zahl", erklaerung: "Nur x = 0 (doppelte Lösung) — also eine Lösung." },
  { typ: "input", frage: "Löse 3x² = 27. Gib die positive Lösung an.", loesung: ["3"], platzhalter: "Zahl", erklaerung: "x² = 9 → x = 3 (und −3)." },
  { typ: "input", frage: "Löse x² − 4x = 0. Gib die positive Lösung an.", loesung: ["4"], platzhalter: "Zahl", erklaerung: "x · (x − 4) = 0 → x = 0 oder x = 4. Die positive Lösung ist 4." },
  { typ: "input", frage: "Löse x² − 1 = 0. Gib die positive Lösung an.", loesung: ["1"], platzhalter: "Zahl", erklaerung: "x² = 1 → x = 1 (und −1)." },
  { typ: "input", frage: "Löse x² − 6x + 9 = 0.", loesung: ["3"], platzhalter: "Zahl", erklaerung: "(x − 3)² = 0, also x = 3 (doppelte Lösung)." },
];

export default QUADR_GLEICHUNGEN_RS10;
