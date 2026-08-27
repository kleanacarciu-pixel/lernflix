// ============================================================================
// Interaktive Aufgaben — Flächen & Winkel · Realschule Kl. 6 · Bayern
// Winkelarten, Winkelsumme, Flächen von Rechteck/Dreieck/Parallelogramm.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const FLAECHEN_WINKEL_RS6: Aufgabe[] = [
  { typ: "input", frage: "Wie viele Grad hat ein rechter Winkel?", loesung: ["90"], einheit: "°", platzhalter: "Zahl", erklaerung: "Ein rechter Winkel misst genau 90°." },
  { typ: "input", frage: "Wie viele Grad hat ein gestreckter Winkel?", loesung: ["180"], einheit: "°", platzhalter: "Zahl", erklaerung: "Ein gestreckter Winkel ist eine halbe Drehung: 180°." },
  {
    typ: "mc",
    frage: "Wie heißt ein Winkel von 60°?",
    antworten: ["spitzer Winkel", "rechter Winkel", "stumpfer Winkel", "gestreckter Winkel"],
    richtig: 0,
    erklaerung: "Ein Winkel kleiner als 90° heißt spitzer Winkel.",
  },
  {
    typ: "mc",
    frage: "Wie heißt ein Winkel von 140°?",
    antworten: ["stumpfer Winkel", "spitzer Winkel", "rechter Winkel", "voller Winkel"],
    richtig: 0,
    erklaerung: "Ein Winkel zwischen 90° und 180° heißt stumpfer Winkel.",
  },
  { typ: "input", frage: "Wie groß ist die Winkelsumme in einem Dreieck (in Grad)?", loesung: ["180"], einheit: "°", platzhalter: "Zahl", erklaerung: "Die drei Innenwinkel eines Dreiecks ergeben zusammen 180°." },
  { typ: "input", frage: "Zwei Winkel eines Dreiecks sind 80° und 40°. Wie groß ist der dritte?", loesung: ["60"], einheit: "°", platzhalter: "Zahl", erklaerung: "180° − 80° − 40° = 60°." },
  { typ: "input", frage: "Ein Parallelogramm hat die Grundseite 8 cm und die Höhe 3 cm. Wie groß ist der Flächeninhalt?", loesung: ["24"], einheit: "cm²", platzhalter: "Zahl", erklaerung: "Fläche = Grundseite · Höhe = 8 · 3 = 24 cm²." },
  { typ: "input", frage: "Ein Dreieck hat die Grundseite 10 cm und die Höhe 4 cm. Wie groß ist der Flächeninhalt?", loesung: ["20"], einheit: "cm²", platzhalter: "Zahl", erklaerung: "Fläche Dreieck = ½ · Grundseite · Höhe = ½ · 10 · 4 = 20 cm²." },
  { typ: "input", frage: "Ein Rechteck ist 12 cm lang und 5 cm breit. Wie groß ist der Flächeninhalt?", loesung: ["60"], einheit: "cm²", platzhalter: "Zahl", erklaerung: "Fläche = 12 · 5 = 60 cm²." },
  {
    typ: "luecke",
    frage: "Vervollständige.",
    segmente: ["Ein voller Winkel hat ", { luecke: ["360"] }, "° und ein gestreckter Winkel ", { luecke: ["180"] }, "°."],
    erklaerung: "Voller Winkel (ganze Drehung) = 360°, gestreckter Winkel = 180°.",
  },
  {
    typ: "zuordnen",
    frage: "Ordne jedem Winkel die passende Winkelart zu.",
    paare: [
      { links: "45°", rechts: "spitzer Winkel" },
      { links: "90°", rechts: "rechter Winkel" },
      { links: "120°", rechts: "stumpfer Winkel" },
      { links: "180°", rechts: "gestreckter Winkel" },
    ],
    erklaerung: "Unter 90° spitz, genau 90° recht, zwischen 90° und 180° stumpf, genau 180° gestreckt.",
  },
  { typ: "input", frage: "Ein Quadrat hat die Seitenlänge 7 cm. Wie groß ist der Umfang?", loesung: ["28"], einheit: "cm", platzhalter: "Zahl", erklaerung: "Umfang = 4 · 7 = 28 cm." },
  {
    typ: "mc",
    frage: "In welcher Einheit misst man Winkel?",
    antworten: ["Grad (°)", "Zentimeter (cm)", "Quadratzentimeter (cm²)", "Kilogramm (kg)"],
    richtig: 0,
    erklaerung: "Winkel werden in Grad (°) gemessen.",
  },
  { typ: "input", frage: "In einem rechtwinkligen Dreieck ist ein Winkel 90°, ein anderer 35°. Wie groß ist der dritte?", loesung: ["55"], einheit: "°", platzhalter: "Zahl", erklaerung: "180° − 90° − 35° = 55°." },
  { typ: "input", frage: "In einem gleichseitigen Dreieck sind alle Winkel gleich groß. Wie groß ist jeder?", loesung: ["60"], einheit: "°", platzhalter: "Zahl", erklaerung: "180° : 3 = 60°." },
];

export default FLAECHEN_WINKEL_RS6;
