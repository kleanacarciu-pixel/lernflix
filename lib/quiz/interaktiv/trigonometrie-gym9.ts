// ============================================================================
// Interaktive Aufgaben — Trigonometrie (sin, cos, tan) · Gymnasium Kl. 9
// Seitenverhältnisse im rechtwinkligen Dreieck, besondere Winkel.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const TRIGONOMETRIE_GYM9: Aufgabe[] = [
  {
    typ: "mc",
    frage: "Wie ist der Sinus eines Winkels im rechtwinkligen Dreieck definiert?",
    antworten: ["Gegenkathete / Hypotenuse", "Ankathete / Hypotenuse", "Gegenkathete / Ankathete", "Hypotenuse / Gegenkathete"],
    richtig: 0,
    erklaerung: "sin(α) = Gegenkathete / Hypotenuse.",
  },
  {
    typ: "mc",
    frage: "Wie ist der Kosinus definiert?",
    antworten: ["Ankathete / Hypotenuse", "Gegenkathete / Hypotenuse", "Gegenkathete / Ankathete", "Hypotenuse / Ankathete"],
    richtig: 0,
    erklaerung: "cos(α) = Ankathete / Hypotenuse.",
  },
  {
    typ: "mc",
    frage: "Wie ist der Tangens definiert?",
    antworten: ["Gegenkathete / Ankathete", "Ankathete / Gegenkathete", "Gegenkathete / Hypotenuse", "Ankathete / Hypotenuse"],
    richtig: 0,
    erklaerung: "tan(α) = Gegenkathete / Ankathete.",
  },
  { typ: "input", frage: "Gegenkathete 3, Hypotenuse 5. Wie groß ist sin(α)? (Als Bruch.)", loesung: ["3/5"], platzhalter: "z. B. 3/5", erklaerung: "sin = Gegenkathete/Hypotenuse = 3/5." },
  { typ: "input", frage: "Ankathete 4, Hypotenuse 5. Wie groß ist cos(α)? (Als Bruch.)", loesung: ["4/5"], platzhalter: "z. B. 4/5", erklaerung: "cos = Ankathete/Hypotenuse = 4/5." },
  { typ: "input", frage: "Gegenkathete 3, Ankathete 4. Wie groß ist tan(α)? (Als Bruch.)", loesung: ["3/4"], platzhalter: "z. B. 3/4", erklaerung: "tan = Gegenkathete/Ankathete = 3/4." },
  { typ: "input", frage: "Wie groß ist sin(30°)? (Als Dezimalzahl.)", loesung: ["0,5"], platzhalter: "z. B. 0,5", erklaerung: "sin(30°) = 0,5." },
  { typ: "input", frage: "Wie groß ist tan(45°)?", loesung: ["1"], platzhalter: "Zahl", erklaerung: "Im rechtwinklig-gleichschenkligen Dreieck sind Gegen- und Ankathete gleich: tan(45°) = 1." },
  { typ: "input", frage: "Wie groß ist cos(60°)? (Als Dezimalzahl.)", loesung: ["0,5"], platzhalter: "z. B. 0,5", erklaerung: "cos(60°) = 0,5." },
  {
    typ: "mc",
    frage: "In welchem Dreieck gelten diese Definitionen von sin, cos und tan?",
    antworten: ["im rechtwinkligen Dreieck", "in jedem Dreieck", "nur im gleichseitigen Dreieck", "im Viereck"],
    richtig: 0,
    erklaerung: "sin, cos und tan über Seitenverhältnisse sind im rechtwinkligen Dreieck definiert.",
  },
  { typ: "input", frage: "Gegenkathete 6, Hypotenuse 10. Wie groß ist sin(α)? (Als gekürzter Bruch.)", loesung: ["3/5"], platzhalter: "z. B. 3/5", erklaerung: "6/10 = 3/5." },
  {
    typ: "mc",
    frage: "Welche Seite ist die Hypotenuse?",
    antworten: ["die dem rechten Winkel gegenüberliegende, längste Seite", "die kürzeste Seite", "die untere Seite", "das ist egal"],
    richtig: 0,
    erklaerung: "Die Hypotenuse liegt dem rechten Winkel gegenüber und ist die längste Seite.",
  },
  { typ: "input", frage: "Wie groß ist sin(90°)?", loesung: ["1"], platzhalter: "Zahl", erklaerung: "sin(90°) = 1." },
  { typ: "input", frage: "Wie groß ist cos(0°)?", loesung: ["1"], platzhalter: "Zahl", erklaerung: "cos(0°) = 1." },
  { typ: "input", frage: "Wie groß ist tan(0°)?", loesung: ["0"], platzhalter: "Zahl", erklaerung: "tan(0°) = 0." },
];

export default TRIGONOMETRIE_GYM9;
