// ============================================================================
// Interaktive Aufgaben — Trigonometrie: Seiten & Winkel · Gymnasium Kl. 10
// Seiten im rechtwinkligen Dreieck über sin/cos/tan; Sinus-/Kosinussatz.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const TRIG_SEITEN_GYM10: Aufgabe[] = [
  { typ: "input", frage: "sin(α) = 0,5 und die Hypotenuse ist 10 cm. Wie lang ist die Gegenkathete? (Gegenkathete = sin · Hypotenuse)", loesung: ["5"], einheit: "cm", platzhalter: "Zahl", erklaerung: "Gegenkathete = 0,5 · 10 = 5 cm." },
  { typ: "input", frage: "cos(α) = 0,8 und die Hypotenuse ist 10 cm. Wie lang ist die Ankathete?", loesung: ["8"], einheit: "cm", platzhalter: "Zahl", erklaerung: "Ankathete = cos · Hypotenuse = 0,8 · 10 = 8 cm." },
  { typ: "input", frage: "Ein Winkel ist 30°, die Hypotenuse 20 cm. Wie lang ist die Gegenkathete? (sin 30° = 0,5)", loesung: ["10"], einheit: "cm", platzhalter: "Zahl", erklaerung: "Gegenkathete = sin(30°) · 20 = 0,5 · 20 = 10 cm." },
  {
    typ: "mc",
    frage: "Wozu benutzt man den Sinussatz?",
    antworten: ["um in einem Dreieck Seiten und Winkel zu berechnen", "um Flächen zu berechnen", "um Kreise zu zeichnen", "um Terme zu kürzen"],
    richtig: 0,
    erklaerung: "Der Sinussatz verknüpft Seiten und ihre Gegenwinkel in einem Dreieck.",
  },
  {
    typ: "mc",
    frage: "Wie lautet der Sinussatz?",
    antworten: ["a / sin α = b / sin β", "a² = b² + c²", "a · b = c", "sin α = a · b"],
    richtig: 0,
    erklaerung: "Im Dreieck gilt a / sin α = b / sin β = c / sin γ.",
  },
  { typ: "input", frage: "tan(45°) = 1 und die Ankathete ist 7 cm. Wie lang ist die Gegenkathete? (Gegenkathete = tan · Ankathete)", loesung: ["7"], einheit: "cm", platzhalter: "Zahl", erklaerung: "Gegenkathete = 1 · 7 = 7 cm." },
  { typ: "input", frage: "Wie groß ist sin(90°)?", loesung: ["1"], platzhalter: "Zahl", erklaerung: "sin(90°) = 1." },
  {
    typ: "mc",
    frage: "Der Kosinussatz ist eine Verallgemeinerung von …",
    antworten: ["dem Satz des Pythagoras", "dem Strahlensatz", "der pq-Formel", "dem Dreisatz"],
    richtig: 0,
    erklaerung: "Der Kosinussatz a² = b² + c² − 2bc·cos α wird für α = 90° zum Satz des Pythagoras.",
  },
  { typ: "input", frage: "Die Hypotenuse ist 12 cm und sin(α) = 0,5. Wie lang ist die Gegenkathete?", loesung: ["6"], einheit: "cm", platzhalter: "Zahl", erklaerung: "0,5 · 12 = 6 cm." },
  { typ: "input", frage: "Wie groß ist cos(60°)? (Als Dezimalzahl.)", loesung: ["0,5"], platzhalter: "z. B. 0,5", erklaerung: "cos(60°) = 0,5." },
  {
    typ: "luecke",
    frage: "Besondere Werte.",
    segmente: ["sin(30°) = ", { luecke: ["0,5", "1/2"] }, " und cos(60°) = ", { luecke: ["0,5", "1/2"] }, "."],
    erklaerung: "Beide besonderen Werte sind 0,5.",
  },
  { typ: "input", frage: "In einem gleichseitigen Dreieck: Wie groß ist jeder Winkel?", loesung: ["60"], einheit: "°", platzhalter: "Zahl", erklaerung: "180° : 3 = 60°." },
  {
    typ: "mc",
    frage: "In welchem Dreieck genügt der Satz des Pythagoras zur Seitenberechnung?",
    antworten: ["im rechtwinkligen Dreieck", "in jedem Dreieck", "im stumpfwinkligen Dreieck", "im gleichseitigen Dreieck"],
    richtig: 0,
    erklaerung: "Nur im rechtwinkligen Dreieck; sonst braucht man Sinus-/Kosinussatz.",
  },
  { typ: "input", frage: "Ein Winkel ist 30°, die Hypotenuse 8 cm. Gegenkathete? (sin 30° = 0,5)", loesung: ["4"], einheit: "cm", platzhalter: "Zahl", erklaerung: "0,5 · 8 = 4 cm." },
  { typ: "input", frage: "Wie groß ist tan(45°)?", loesung: ["1"], platzhalter: "Zahl", erklaerung: "tan(45°) = 1." },
];

export default TRIG_SEITEN_GYM10;
