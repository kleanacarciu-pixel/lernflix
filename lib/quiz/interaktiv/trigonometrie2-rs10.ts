// ============================================================================
// Interaktive Aufgaben — Trigonometrie vertieft · Realschule Kl. 10 · Bayern
// Seiten berechnen mit sin/cos/tan, Sinussatz/Kosinussatz kennen.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const TRIGONOMETRIE2_RS10: Aufgabe[] = [
  { typ: "input", frage: "Ein Winkel ist 30°, die Hypotenuse 20 cm. Wie lang ist die Gegenkathete? (sin 30° = 0,5)", loesung: ["10"], einheit: "cm", platzhalter: "Zahl", erklaerung: "Gegenkathete = sin(30°) · 20 = 0,5 · 20 = 10 cm." },
  { typ: "input", frage: "cos(60°) = 0,5 und die Hypotenuse ist 8 cm. Wie lang ist die Ankathete?", loesung: ["4"], einheit: "cm", platzhalter: "Zahl", erklaerung: "Ankathete = cos · Hypotenuse = 0,5 · 8 = 4 cm." },
  { typ: "input", frage: "tan(45°) = 1 und die Ankathete ist 9 cm. Wie lang ist die Gegenkathete?", loesung: ["9"], einheit: "cm", platzhalter: "Zahl", erklaerung: "Gegenkathete = tan · Ankathete = 1 · 9 = 9 cm." },
  {
    typ: "mc",
    frage: "Wie lautet der Sinussatz?",
    antworten: ["a / sin α = b / sin β", "a² = b² + c²", "a · b = c", "sin α = a · b"],
    richtig: 0,
    erklaerung: "Im Dreieck gilt a / sin α = b / sin β = c / sin γ.",
  },
  {
    typ: "mc",
    frage: "Der Kosinussatz ist eine Verallgemeinerung von …",
    antworten: ["dem Satz des Pythagoras", "dem Strahlensatz", "der pq-Formel", "dem Dreisatz"],
    richtig: 0,
    erklaerung: "Für α = 90° wird der Kosinussatz zum Satz des Pythagoras.",
  },
  { typ: "input", frage: "Wie groß ist sin(90°)?", loesung: ["1"], platzhalter: "Zahl", erklaerung: "sin(90°) = 1." },
  { typ: "input", frage: "Wie groß ist cos(0°)?", loesung: ["1"], platzhalter: "Zahl", erklaerung: "cos(0°) = 1." },
  { typ: "input", frage: "Wie groß ist tan(0°)?", loesung: ["0"], platzhalter: "Zahl", erklaerung: "tan(0°) = 0." },
  {
    typ: "luecke",
    frage: "Besondere Werte.",
    segmente: ["sin(30°) = ", { luecke: ["0,5", "1/2"] }, " und sin(90°) = ", { luecke: ["1"] }, "."],
    erklaerung: "sin(30°) = 0,5 und sin(90°) = 1.",
  },
  { typ: "input", frage: "Gegenkathete 5, Hypotenuse 13. Wie groß ist sin(α)? (Als Bruch.)", loesung: ["5/13"], platzhalter: "z. B. 5/13", erklaerung: "sin = 5/13." },
  { typ: "input", frage: "Ankathete 12, Hypotenuse 13. Wie groß ist cos(α)? (Als Bruch.)", loesung: ["12/13"], platzhalter: "z. B. 12/13", erklaerung: "cos = 12/13." },
  { typ: "input", frage: "Gegenkathete 5, Ankathete 12. Wie groß ist tan(α)? (Als Bruch.)", loesung: ["5/12"], platzhalter: "z. B. 5/12", erklaerung: "tan = 5/12." },
  {
    typ: "mc",
    frage: "Wie groß ist jeder Winkel in einem gleichseitigen Dreieck?",
    antworten: ["60°", "90°", "45°", "30°"],
    richtig: 0,
    erklaerung: "180° : 3 = 60°.",
  },
  { typ: "input", frage: "sin(α) = 0,6 und die Hypotenuse ist 10 cm. Wie lang ist die Gegenkathete?", loesung: ["6"], einheit: "cm", platzhalter: "Zahl", erklaerung: "0,6 · 10 = 6 cm." },
  {
    typ: "mc",
    frage: "Für welche Dreiecke gelten die Seitenverhältnis-Definitionen von sin, cos und tan?",
    antworten: ["für rechtwinklige Dreiecke", "für alle Dreiecke", "nur für gleichseitige Dreiecke", "für Vierecke"],
    richtig: 0,
    erklaerung: "Die Definitionen über Gegenkathete/Ankathete/Hypotenuse gelten im rechtwinkligen Dreieck.",
  },
];

export default TRIGONOMETRIE2_RS10;
