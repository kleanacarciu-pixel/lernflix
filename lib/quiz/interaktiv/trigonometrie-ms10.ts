// ============================================================================
// Interaktive Aufgaben — Trigonometrie (Einstieg) · Mittelschule Kl. 10 · Bayern
// sin/cos/tan im rechtwinkligen Dreieck, Seiten benennen, einfache Berechnungen.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const TRIGONOMETRIE_MS10: Aufgabe[] = [
  {
    typ: "mc",
    frage: "In einem rechtwinkligen Dreieck: Wie heißt die Seite gegenüber dem rechten Winkel?",
    antworten: ["Hypotenuse", "Gegenkathete", "Ankathete", "Höhe"],
    richtig: 0,
    erklaerung: "Die Hypotenuse liegt dem rechten Winkel gegenüber — sie ist die längste Seite.",
  },
  {
    typ: "mc",
    frage: "Wie ist sin(α) im rechtwinkligen Dreieck definiert?",
    antworten: ["Gegenkathete : Hypotenuse", "Ankathete : Hypotenuse", "Gegenkathete : Ankathete", "Hypotenuse : Ankathete"],
    richtig: 0,
    erklaerung: "sin(α) = Gegenkathete : Hypotenuse.",
  },
  {
    typ: "mc",
    frage: "Wie ist cos(α) definiert?",
    antworten: ["Ankathete : Hypotenuse", "Gegenkathete : Hypotenuse", "Ankathete : Gegenkathete", "Hypotenuse : Gegenkathete"],
    richtig: 0,
    erklaerung: "cos(α) = Ankathete : Hypotenuse.",
  },
  {
    typ: "mc",
    frage: "Wie ist tan(α) definiert?",
    antworten: ["Gegenkathete : Ankathete", "Ankathete : Gegenkathete", "Gegenkathete : Hypotenuse", "Ankathete : Hypotenuse"],
    richtig: 0,
    erklaerung: "tan(α) = Gegenkathete : Ankathete.",
  },
  { typ: "input", frage: "Gegenkathete 4 cm, Hypotenuse 8 cm. Berechne sin(α). (Als Dezimalzahl.)", loesung: ["0,5"], platzhalter: "z. B. 0,5", erklaerung: "sin(α) = 4 : 8 = 0,5." },
  { typ: "input", frage: "Ankathete 6 cm, Hypotenuse 10 cm. Berechne cos(α). (Als Dezimalzahl.)", loesung: ["0,6"], platzhalter: "z. B. 0,6", erklaerung: "cos(α) = 6 : 10 = 0,6." },
  { typ: "input", frage: "Gegenkathete 9 cm, Ankathete 9 cm. Berechne tan(α).", loesung: ["1"], platzhalter: "Zahl", erklaerung: "tan(α) = 9 : 9 = 1. (Das ist der Fall bei α = 45°.)" },
  { typ: "input", frage: "Wie groß ist sin(30°)? (Als Dezimalzahl.)", loesung: ["0,5"], platzhalter: "z. B. 0,5", erklaerung: "sin(30°) = 0,5 — ein besonderer Wert." },
  { typ: "input", frage: "sin(α) = 0,5 und die Hypotenuse ist 14 cm lang. Wie lang ist die Gegenkathete?", loesung: ["7"], einheit: "cm", platzhalter: "Zahl", erklaerung: "Gegenkathete = sin(α) · Hypotenuse = 0,5 · 14 = 7 cm." },
  { typ: "input", frage: "cos(α) = 0,8 und die Hypotenuse ist 20 cm lang. Wie lang ist die Ankathete?", loesung: ["16"], einheit: "cm", platzhalter: "Zahl", erklaerung: "Ankathete = 0,8 · 20 = 16 cm." },
  {
    typ: "luecke",
    frage: "Besondere Werte.",
    segmente: ["tan(45°) = ", { luecke: ["1"] }, " und cos(60°) = ", { luecke: ["0,5", "1/2"] }, "."],
    erklaerung: "Bei 45° sind beide Katheten gleich lang: tan = 1. cos(60°) = 0,5.",
  },
  {
    typ: "zuordnen",
    frage: "Rechtwinkliges Dreieck mit den Seiten 3, 4 und 5 cm (rechter Winkel zwischen 3 und 4). α liegt der Seite 3 gegenüber. Ordne zu.",
    paare: [
      { links: "sin(α)", rechts: "3/5" },
      { links: "cos(α)", rechts: "4/5" },
      { links: "tan(α)", rechts: "3/4" },
      { links: "Hypotenuse", rechts: "5 cm" },
    ],
    erklaerung: "Gegenkathete 3, Ankathete 4, Hypotenuse 5: sin = 3/5, cos = 4/5, tan = 3/4.",
  },
  {
    typ: "mc",
    frage: "In welchem Dreieck gelten die Definitionen von sin, cos und tan über die Seitenverhältnisse?",
    antworten: ["im rechtwinkligen Dreieck", "in jedem Dreieck", "nur im gleichseitigen Dreieck", "im Kreis"],
    richtig: 0,
    erklaerung: "Die Seitenverhältnis-Definitionen gelten im rechtwinkligen Dreieck.",
  },
  { typ: "input", frage: "Wie groß ist die Winkelsumme in jedem Dreieck (in Grad)?", loesung: ["180"], einheit: "°", platzhalter: "Zahl", erklaerung: "Die Innenwinkel jedes Dreiecks ergeben zusammen 180°." },
  {
    typ: "mc",
    frage: "Ein rechtwinkliges Dreieck hat bei α = 30° eine 5 cm lange Gegenkathete. Wie lang ist die Hypotenuse? (sin 30° = 0,5)",
    antworten: ["10 cm", "2,5 cm", "5 cm", "15 cm"],
    richtig: 0,
    erklaerung: "sin = Gegenkathete : Hypotenuse → 0,5 = 5 : Hypotenuse → Hypotenuse = 5 : 0,5 = 10 cm.",
  },
];

export default TRIGONOMETRIE_MS10;
