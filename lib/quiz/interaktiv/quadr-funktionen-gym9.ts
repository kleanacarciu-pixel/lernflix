// ============================================================================
// Interaktive Aufgaben — Quadratische Funktionen · Gymnasium Kl. 9 · Bayern
// Normalparabel y = x², Verschiebungen, Scheitel, Öffnung, Nullstellen.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const QUADR_FUNKTIONEN_GYM9: Aufgabe[] = [
  { typ: "input", frage: "Gegeben y = x². Welchen y-Wert hat der Graph bei x = 3?", loesung: ["9"], platzhalter: "Zahl", erklaerung: "y = 3² = 9." },
  { typ: "input", frage: "Gegeben y = x². Welchen y-Wert hat der Graph bei x = −2?", loesung: ["4"], platzhalter: "Zahl", erklaerung: "y = (−2)² = 4." },
  {
    typ: "mc",
    frage: "Wie heißt der Graph von y = x²?",
    antworten: ["Parabel", "Gerade", "Kreis", "Hyperbel"],
    richtig: 0,
    erklaerung: "Der Graph einer quadratischen Funktion ist eine Parabel.",
  },
  {
    typ: "mc",
    frage: "Wo liegt der Scheitelpunkt der Normalparabel y = x²?",
    antworten: ["im Punkt (0|0)", "im Punkt (1|1)", "im Punkt (0|1)", "im Hochpunkt"],
    richtig: 0,
    erklaerung: "Die Normalparabel y = x² hat ihren tiefsten Punkt (Scheitel) im Ursprung (0|0).",
  },
  { typ: "input", frage: "Bei y = x² + 3 — welchen y-Wert hat der Scheitelpunkt?", loesung: ["3"], platzhalter: "Zahl", erklaerung: "Die Parabel ist um 3 nach oben verschoben, Scheitel bei (0|3)." },
  { typ: "input", frage: "Bei y = (x − 2)² — bei welchem x-Wert liegt der Scheitelpunkt?", loesung: ["2"], platzhalter: "Zahl", erklaerung: "Verschiebung um 2 nach rechts, Scheitel bei x = 2." },
  { typ: "input", frage: "Gegeben y = 2x². Welchen y-Wert hat der Graph bei x = 3?", loesung: ["18"], platzhalter: "Zahl", erklaerung: "y = 2 · 3² = 2 · 9 = 18." },
  {
    typ: "mc",
    frage: "Bei y = a·x² mit a > 0 ist die Parabel …",
    antworten: ["nach oben geöffnet", "nach unten geöffnet", "eine Gerade", "ein Kreis"],
    richtig: 0,
    erklaerung: "Ist a positiv, öffnet sich die Parabel nach oben.",
  },
  {
    typ: "mc",
    frage: "Bei y = −x² ist die Parabel …",
    antworten: ["nach unten geöffnet", "nach oben geöffnet", "waagerecht", "senkrecht"],
    richtig: 0,
    erklaerung: "Das Minus (a = −1) öffnet die Parabel nach unten.",
  },
  { typ: "input", frage: "Bei y = x² − 4 — gib die positive Nullstelle an (wo y = 0).", loesung: ["2"], platzhalter: "Zahl", erklaerung: "x² − 4 = 0 → x² = 4 → x = 2 (und x = −2)." },
  {
    typ: "luecke",
    frage: "Berechne Funktionswerte von y = x².",
    segmente: ["Bei x = 4 ist y = ", { luecke: ["16"] }, " und bei x = 5 ist y = ", { luecke: ["25"] }, "."],
    erklaerung: "4² = 16 und 5² = 25.",
  },
  { typ: "input", frage: "Gegeben y = x². Welchen y-Wert hat der Graph bei x = 0?", loesung: ["0"], platzhalter: "Zahl", erklaerung: "y = 0² = 0 — das ist der Scheitelpunkt." },
  { typ: "input", frage: "Bei y = (x + 1)² — bei welchem x-Wert liegt der Scheitelpunkt?", loesung: ["-1", "−1"], platzhalter: "Zahl", erklaerung: "Verschiebung um 1 nach links, Scheitel bei x = −1." },
  { typ: "input", frage: "Bei y = x² − 9 — gib die positive Nullstelle an.", loesung: ["3"], platzhalter: "Zahl", erklaerung: "x² = 9 → x = 3 (und x = −3)." },
  {
    typ: "mc",
    frage: "Die Nullstellen einer Parabel sind die Stellen, an denen sie …",
    antworten: ["die x-Achse schneidet", "die y-Achse schneidet", "am höchsten ist", "die Steigung 0 hat"],
    richtig: 0,
    erklaerung: "Nullstellen sind die x-Werte mit y = 0 — dort schneidet die Parabel die x-Achse.",
  },
];

export default QUADR_FUNKTIONEN_GYM9;
