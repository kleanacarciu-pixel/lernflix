// ============================================================================
// Interaktive Aufgaben — Winkel & Dreiecke · Gymnasium Kl. 7 · Bayern
// Winkelsumme, Stufen-/Wechselwinkel, besondere Dreiecke, Außenwinkel.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const WINKEL_DREIECKE_GYM7: Aufgabe[] = [
  { typ: "input", frage: "Wie groß ist die Winkelsumme in einem Dreieck (in Grad)?", loesung: ["180"], einheit: "°", platzhalter: "Zahl", erklaerung: "Die drei Innenwinkel eines Dreiecks ergeben zusammen immer 180°." },
  { typ: "input", frage: "Zwei Winkel eines Dreiecks sind 50° und 60°. Wie groß ist der dritte?", loesung: ["70"], einheit: "°", platzhalter: "Zahl", erklaerung: "180° − 50° − 60° = 70°." },
  { typ: "input", frage: "In einem gleichseitigen Dreieck: Wie groß ist jeder Winkel?", loesung: ["60"], einheit: "°", platzhalter: "Zahl", erklaerung: "180° : 3 = 60°." },
  {
    typ: "mc",
    frage: "Die beiden Basiswinkel eines gleichschenkligen Dreiecks sind …",
    antworten: ["gleich groß", "immer 90°", "immer 60°", "verschieden groß"],
    richtig: 0,
    erklaerung: "In einem gleichschenkligen Dreieck sind die beiden Basiswinkel gleich groß.",
  },
  { typ: "input", frage: "Ein gleichschenkliges Dreieck hat zwei Basiswinkel von je 70°. Wie groß ist der Winkel an der Spitze?", loesung: ["40"], einheit: "°", platzhalter: "Zahl", erklaerung: "180° − 70° − 70° = 40°." },
  {
    typ: "mc",
    frage: "Stufenwinkel an geschnittenen Parallelen sind …",
    antworten: ["gleich groß", "zusammen 180°", "zusammen 90°", "immer verschieden"],
    richtig: 0,
    erklaerung: "An parallelen Geraden sind Stufenwinkel (F-Winkel) gleich groß.",
  },
  {
    typ: "mc",
    frage: "Wechselwinkel an geschnittenen Parallelen sind …",
    antworten: ["gleich groß", "zusammen 180°", "zusammen 90°", "immer verschieden"],
    richtig: 0,
    erklaerung: "An parallelen Geraden sind Wechselwinkel (Z-Winkel) gleich groß.",
  },
  { typ: "input", frage: "Ein Winkel ist 115°. Wie groß ist sein Nebenwinkel?", loesung: ["65"], einheit: "°", platzhalter: "Zahl", erklaerung: "Nebenwinkel ergänzen sich zu 180°: 180° − 115° = 65°." },
  { typ: "input", frage: "Wie groß ist der Scheitelwinkel eines 40°-Winkels?", loesung: ["40"], einheit: "°", platzhalter: "Zahl", erklaerung: "Scheitelwinkel sind gleich groß: 40°." },
  {
    typ: "luecke",
    frage: "Ergänze die fehlende Gradzahl im Dreieck.",
    segmente: ["90° + 45° + ", { luecke: ["45"] }, "° = 180°."],
    erklaerung: "180° − 90° − 45° = 45°.",
  },
  { typ: "input", frage: "In einem rechtwinkligen Dreieck ist ein Winkel 90° und ein anderer 30°. Wie groß ist der dritte?", loesung: ["60"], einheit: "°", platzhalter: "Zahl", erklaerung: "180° − 90° − 30° = 60°." },
  {
    typ: "mc",
    frage: "Ein Dreieck mit einem Winkel größer als 90° heißt …",
    antworten: ["stumpfwinklig", "rechtwinklig", "spitzwinklig", "gleichseitig"],
    richtig: 0,
    erklaerung: "Ein Dreieck mit einem stumpfen Winkel (> 90°) heißt stumpfwinklig.",
  },
  { typ: "input", frage: "Der Außenwinkel eines Dreiecks ist so groß wie die Summe der beiden nicht anliegenden Innenwinkel. Diese sind 50° und 60°. Wie groß ist der Außenwinkel?", loesung: ["110"], einheit: "°", platzhalter: "Zahl", erklaerung: "50° + 60° = 110°." },
  {
    typ: "mc",
    frage: "Wie groß ist die Winkelsumme in einem Viereck?",
    antworten: ["360°", "180°", "270°", "400°"],
    richtig: 0,
    erklaerung: "Ein Viereck lässt sich in zwei Dreiecke teilen: 2 · 180° = 360°.",
  },
  { typ: "input", frage: "In einem gleichschenklig-rechtwinkligen Dreieck ist ein Winkel 90°. Wie groß ist jeder der beiden anderen Winkel?", loesung: ["45"], einheit: "°", platzhalter: "Zahl", erklaerung: "180° − 90° = 90°, aufgeteilt auf zwei gleiche Winkel: je 45°." },
];

export default WINKEL_DREIECKE_GYM7;
