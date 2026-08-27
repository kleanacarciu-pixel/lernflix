// ============================================================================
// Interaktive Aufgaben — Lineare Funktionen · Gymnasium Kl. 8 · Bayern
// y = mx + t: Steigung, y-Achsenabschnitt, Funktionswerte, Nullstelle.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const LINEARE_FUNKTIONEN_GYM8: Aufgabe[] = [
  { typ: "input", frage: "Gegeben ist y = 2x + 3. Welchen y-Wert hat der Graph bei x = 4?", loesung: ["11"], platzhalter: "Zahl", erklaerung: "y = 2 · 4 + 3 = 8 + 3 = 11." },
  { typ: "input", frage: "Wie groß ist die Steigung m bei y = 2x + 3?", loesung: ["2"], platzhalter: "Zahl", erklaerung: "Bei y = mx + t ist m die Steigung. Hier m = 2." },
  { typ: "input", frage: "Bei welchem y-Wert schneidet der Graph von y = 2x + 3 die y-Achse?", loesung: ["3"], platzhalter: "Zahl", erklaerung: "Der y-Achsenabschnitt ist t = 3 (der Graph schneidet bei (0|3))." },
  { typ: "input", frage: "Berechne den y-Wert von y = −x + 5 bei x = 2.", loesung: ["3"], platzhalter: "Zahl", erklaerung: "y = −2 + 5 = 3." },
  { typ: "input", frage: "Welchen y-Wert hat y = 3x bei x = 0?", loesung: ["0"], platzhalter: "Zahl", erklaerung: "y = 3 · 0 = 0. Die Gerade geht durch den Ursprung." },
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
    erklaerung: "Positive Steigung: Der Graph geht von links nach rechts nach oben, er steigt.",
  },
  { typ: "input", frage: "Berechne den y-Wert von y = 0,5x + 1 bei x = 4.", loesung: ["3"], platzhalter: "Zahl", erklaerung: "y = 0,5 · 4 + 1 = 2 + 1 = 3." },
  { typ: "input", frage: "Eine Gerade geht durch (0|2). Wie groß ist der y-Achsenabschnitt t?", loesung: ["2"], platzhalter: "Zahl", erklaerung: "Der Punkt (0|2) liegt auf der y-Achse, also ist t = 2." },
  {
    typ: "luecke",
    frage: "Lies Steigung und y-Achsenabschnitt ab.",
    segmente: ["y = 4x − 1 hat die Steigung ", { luecke: ["4"] }, " und den y-Achsenabschnitt ", { luecke: ["-1", "−1"] }, "."],
    erklaerung: "Bei y = mx + t ist m = 4 und t = −1.",
  },
  { typ: "input", frage: "Bei welchem x-Wert hat y = 2x − 6 den Wert 0 (Nullstelle)?", loesung: ["3"], platzhalter: "Zahl", erklaerung: "2x − 6 = 0 → 2x = 6 → x = 3." },
  {
    typ: "mc",
    frage: "Der Graph von y = 5 ist …",
    antworten: ["eine waagerechte Gerade", "eine senkrechte Gerade", "eine steigende Gerade", "eine Parabel"],
    richtig: 0,
    erklaerung: "y ist immer 5, egal welches x — das ergibt eine waagerechte Gerade.",
  },
  { typ: "input", frage: "Eine Steigung von m = 2 bedeutet: pro 1 Schritt nach rechts geht der Graph um wie viel nach oben?", loesung: ["2"], platzhalter: "Zahl", erklaerung: "Die Steigung 2 heißt: 1 nach rechts, 2 nach oben." },
  { typ: "input", frage: "Berechne den y-Wert von y = −2x + 8 bei x = 3.", loesung: ["2"], platzhalter: "Zahl", erklaerung: "y = −2 · 3 + 8 = −6 + 8 = 2." },
  { typ: "input", frage: "Berechne den y-Wert von y = x + 7 bei x = −3.", loesung: ["4"], platzhalter: "Zahl", erklaerung: "y = −3 + 7 = 4." },
];

export default LINEARE_FUNKTIONEN_GYM8;
