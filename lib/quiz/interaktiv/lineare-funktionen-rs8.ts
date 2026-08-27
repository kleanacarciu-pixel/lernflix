// ============================================================================
// Interaktive Aufgaben — Lineare Funktionen · Realschule Kl. 8 · Bayern
// y = mx + t: Funktionswerte, Steigung, y-Achsenabschnitt, Nullstelle.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const LINEARE_FUNKTIONEN_RS8: Aufgabe[] = [
  { typ: "input", frage: "Gegeben ist y = 2x + 1. Welchen y-Wert hat der Graph bei x = 3?", loesung: ["7"], platzhalter: "Zahl", erklaerung: "y = 2 · 3 + 1 = 7." },
  { typ: "input", frage: "Gegeben ist y = 3x − 2. Welchen y-Wert hat der Graph bei x = 2?", loesung: ["4"], platzhalter: "Zahl", erklaerung: "y = 3 · 2 − 2 = 4." },
  { typ: "input", frage: "Wie groß ist die Steigung m bei y = 4x + 5?", loesung: ["4"], platzhalter: "Zahl", erklaerung: "Bei y = mx + t ist m die Steigung. Hier m = 4." },
  { typ: "input", frage: "Bei welchem y-Wert schneidet der Graph von y = 4x + 5 die y-Achse?", loesung: ["5"], platzhalter: "Zahl", erklaerung: "Der y-Achsenabschnitt ist t = 5, der Graph schneidet bei (0|5)." },
  { typ: "input", frage: "Berechne den y-Wert von y = −x + 6 bei x = 2.", loesung: ["4"], platzhalter: "Zahl", erklaerung: "y = −2 + 6 = 4." },
  { typ: "input", frage: "Welchen y-Wert hat y = 2x bei x = 0?", loesung: ["0"], platzhalter: "Zahl", erklaerung: "y = 2 · 0 = 0. Die Gerade geht durch den Ursprung." },
  {
    typ: "mc",
    frage: "Was ist t bei der Funktion y = mx + t?",
    antworten: ["der y-Achsenabschnitt", "die Steigung", "der x-Wert", "die Nullstelle"],
    richtig: 0,
    erklaerung: "t ist der y-Achsenabschnitt — dort schneidet der Graph die y-Achse.",
  },
  {
    typ: "mc",
    frage: "Eine positive Steigung bedeutet, der Graph …",
    antworten: ["steigt", "fällt", "ist waagerecht", "ist senkrecht"],
    richtig: 0,
    erklaerung: "Positive Steigung: Der Graph geht von links nach rechts nach oben.",
  },
  { typ: "input", frage: "Berechne den y-Wert von y = 0,5x + 2 bei x = 6.", loesung: ["5"], platzhalter: "Zahl", erklaerung: "y = 0,5 · 6 + 2 = 3 + 2 = 5." },
  { typ: "input", frage: "Bei welchem x-Wert hat y = 3x − 9 den Wert 0 (Nullstelle)?", loesung: ["3"], platzhalter: "Zahl", erklaerung: "3x − 9 = 0 → 3x = 9 → x = 3." },
  {
    typ: "luecke",
    frage: "Lies Steigung und y-Achsenabschnitt ab.",
    segmente: ["y = 5x − 2 hat die Steigung ", { luecke: ["5"] }, " und den y-Achsenabschnitt ", { luecke: ["-2", "−2"] }, "."],
    erklaerung: "Bei y = mx + t ist m = 5 und t = −2.",
  },
  {
    typ: "mc",
    frage: "Der Graph von y = 3 ist …",
    antworten: ["eine waagerechte Gerade", "eine senkrechte Gerade", "eine steigende Gerade", "eine Parabel"],
    richtig: 0,
    erklaerung: "y ist immer 3, egal welches x — das ergibt eine waagerechte Gerade.",
  },
  { typ: "input", frage: "Eine Steigung von m = 3 bedeutet: pro 1 Schritt nach rechts geht der Graph um wie viel nach oben?", loesung: ["3"], platzhalter: "Zahl", erklaerung: "Steigung 3 heißt: 1 nach rechts, 3 nach oben." },
  { typ: "input", frage: "Berechne den y-Wert von y = −2x + 10 bei x = 4.", loesung: ["2"], platzhalter: "Zahl", erklaerung: "y = −8 + 10 = 2." },
  { typ: "input", frage: "Eine Gerade geht durch den Punkt (0|4). Wie groß ist ihr y-Achsenabschnitt t?", loesung: ["4"], platzhalter: "Zahl", erklaerung: "Der Punkt (0|4) liegt auf der y-Achse, also t = 4." },
];

export default LINEARE_FUNKTIONEN_RS8;
