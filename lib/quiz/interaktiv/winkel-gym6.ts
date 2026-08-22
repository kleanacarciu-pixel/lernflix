// ============================================================================
// Interaktive Aufgaben — Winkel · Gymnasium Kl. 6 · Bayern
// Winkelarten, Winkelsumme im Dreieck, Ergänzungswinkel, Scheitel/Nebenwinkel.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const WINKEL_GYM6: Aufgabe[] = [
  {
    typ: "mc",
    frage: "Wie heißt ein Winkel von genau 90°?",
    antworten: ["rechter Winkel", "spitzer Winkel", "stumpfer Winkel", "gestreckter Winkel"],
    richtig: 0,
    erklaerung: "Ein Winkel von genau 90° ist ein rechter Winkel.",
  },
  {
    typ: "mc",
    frage: "Wie heißt ein Winkel von 45°?",
    antworten: ["spitzer Winkel", "rechter Winkel", "stumpfer Winkel", "gestreckter Winkel"],
    richtig: 0,
    erklaerung: "Ein Winkel kleiner als 90° heißt spitzer Winkel.",
  },
  {
    typ: "mc",
    frage: "Wie heißt ein Winkel von 120°?",
    antworten: ["stumpfer Winkel", "spitzer Winkel", "rechter Winkel", "voller Winkel"],
    richtig: 0,
    erklaerung: "Ein Winkel zwischen 90° und 180° heißt stumpfer Winkel.",
  },
  { typ: "input", frage: "Wie groß ist ein gestreckter Winkel (in Grad)?", loesung: ["180"], einheit: "°", platzhalter: "Zahl", erklaerung: "Ein gestreckter Winkel ist eine halbe Drehung: 180°." },
  { typ: "input", frage: "Zwei Winkel ergänzen sich zu 90°. Einer ist 30°. Wie groß ist der andere?", loesung: ["60"], einheit: "°", platzhalter: "Zahl", erklaerung: "90° − 30° = 60°." },
  { typ: "input", frage: "Zwei Winkel ergänzen sich zu 180°. Einer ist 110°. Wie groß ist der andere?", loesung: ["70"], einheit: "°", platzhalter: "Zahl", erklaerung: "180° − 110° = 70°." },
  { typ: "input", frage: "Wie groß ist die Winkelsumme in einem Dreieck (in Grad)?", loesung: ["180"], einheit: "°", platzhalter: "Zahl", erklaerung: "Die drei Innenwinkel eines Dreiecks ergeben zusammen immer 180°." },
  { typ: "input", frage: "In einem Dreieck sind zwei Winkel 60° und 70° groß. Wie groß ist der dritte?", loesung: ["50"], einheit: "°", platzhalter: "Zahl", erklaerung: "180° − 60° − 70° = 50°." },
  { typ: "input", frage: "In einem rechtwinkligen Dreieck ist ein Winkel 90°, ein anderer 35°. Wie groß ist der dritte?", loesung: ["55"], einheit: "°", platzhalter: "Zahl", erklaerung: "180° − 90° − 35° = 55°." },
  {
    typ: "luecke",
    frage: "Vervollständige.",
    segmente: ["Ein rechter Winkel hat ", { luecke: ["90"] }, "° und ein gestreckter Winkel ", { luecke: ["180"] }, "°."],
    erklaerung: "Rechter Winkel = 90°, gestreckter Winkel = 180°.",
  },
  {
    typ: "mc",
    frage: "Wie groß ist ein voller Winkel (eine ganze Drehung)?",
    antworten: ["360°", "180°", "90°", "270°"],
    richtig: 0,
    erklaerung: "Eine ganze Umdrehung sind 360°.",
  },
  { typ: "input", frage: "In einem gleichseitigen Dreieck sind alle Winkel gleich groß. Wie groß ist jeder Winkel?", loesung: ["60"], einheit: "°", platzhalter: "Zahl", erklaerung: "180° : 3 = 60°." },
  { typ: "input", frage: "Scheitelwinkel sind gleich groß. Ein Winkel ist 65°. Wie groß ist sein Scheitelwinkel?", loesung: ["65"], einheit: "°", platzhalter: "Zahl", erklaerung: "Scheitelwinkel (gegenüberliegend) sind immer gleich groß: 65°." },
  { typ: "input", frage: "Nebenwinkel ergänzen sich zu 180°. Ein Winkel ist 130°. Wie groß ist sein Nebenwinkel?", loesung: ["50"], einheit: "°", platzhalter: "Zahl", erklaerung: "180° − 130° = 50°." },
  {
    typ: "mc",
    frage: "Welcher dieser Winkel ist stumpf?",
    antworten: ["135°", "90°", "45°", "20°"],
    richtig: 0,
    erklaerung: "Ein stumpfer Winkel liegt zwischen 90° und 180°. Das trifft nur auf 135° zu.",
  },
];

export default WINKEL_GYM6;
