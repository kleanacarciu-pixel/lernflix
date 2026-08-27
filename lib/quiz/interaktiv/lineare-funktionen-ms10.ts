// ============================================================================
// Interaktive Aufgaben — Lineare Funktionen · Mittelschule Kl. 10 · Bayern
// y = m·x + t: Steigung, y-Achsenabschnitt, Wertepaare, Alltagsmodelle.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const LINEARE_FUNKTIONEN_MS10: Aufgabe[] = [
  {
    typ: "mc",
    frage: "Wie sieht der Graph einer linearen Funktion aus?",
    antworten: ["eine Gerade", "eine Parabel", "ein Kreis", "eine Zickzack-Linie"],
    richtig: 0,
    erklaerung: "Lineare Funktionen (y = m·x + t) haben als Graph immer eine Gerade.",
  },
  { typ: "input", frage: "Gegeben ist y = 2x + 3. Berechne y für x = 4.", loesung: ["11"], platzhalter: "Zahl", erklaerung: "y = 2 · 4 + 3 = 8 + 3 = 11." },
  { typ: "input", frage: "Gegeben ist y = 3x − 5. Berechne y für x = 2.", loesung: ["1"], platzhalter: "Zahl", erklaerung: "y = 3 · 2 − 5 = 6 − 5 = 1." },
  { typ: "input", frage: "Gegeben ist y = 0,5x + 1. Berechne y für x = 6.", loesung: ["4"], platzhalter: "Zahl", erklaerung: "y = 0,5 · 6 + 1 = 3 + 1 = 4." },
  {
    typ: "mc",
    frage: "Was gibt m in der Gleichung y = m·x + t an?",
    antworten: ["die Steigung der Geraden", "den Schnittpunkt mit der y-Achse", "den Schnittpunkt mit der x-Achse", "die Länge der Geraden"],
    richtig: 0,
    erklaerung: "m ist die Steigung. t ist der y-Achsenabschnitt.",
  },
  {
    typ: "mc",
    frage: "Wo schneidet die Gerade y = 2x + 3 die y-Achse?",
    antworten: ["bei y = 3", "bei y = 2", "bei y = 0", "bei y = 5"],
    richtig: 0,
    erklaerung: "Für x = 0 gilt y = 3 — der y-Achsenabschnitt ist t = 3.",
  },
  { typ: "input", frage: "Bei welchem x-Wert schneidet y = 2x − 8 die x-Achse (y = 0)?", loesung: ["4", "x=4", "x = 4"], platzhalter: "Zahl", erklaerung: "0 = 2x − 8 → 2x = 8 → x = 4." },
  {
    typ: "luecke",
    frage: "Die Gerade y = 4x + 2.",
    segmente: ["Steigung m = ", { luecke: ["4"] }, ", y-Achsenabschnitt t = ", { luecke: ["2"] }, "."],
    erklaerung: "In y = m·x + t: m = 4, t = 2.",
  },
  {
    typ: "mc",
    frage: "Welche Gerade fällt (hat negative Steigung)?",
    antworten: ["y = −2x + 5", "y = 2x + 5", "y = 0,5x", "y = x − 3"],
    richtig: 0,
    erklaerung: "Bei y = −2x + 5 ist m = −2 negativ — die Gerade fällt von links nach rechts.",
  },
  { typ: "input", frage: "Ein Handytarif kostet 10 € Grundgebühr plus 2 € pro GB. Wie viel kostet ein Monat mit 5 GB?", loesung: ["20"], einheit: "€", platzhalter: "Zahl", erklaerung: "Kosten = 2 · 5 + 10 = 20 €. (Als Funktion: y = 2x + 10.)" },
  { typ: "input", frage: "Taxi: 4 € Grundpreis plus 2 € pro Kilometer. Für eine Fahrt zahlst du 18 €. Wie viele Kilometer bist du gefahren?", loesung: ["7"], einheit: "km", platzhalter: "Zahl", erklaerung: "18 = 2x + 4 → 2x = 14 → x = 7 km." },
  {
    typ: "zuordnen",
    frage: "Ordne jeder Funktionsgleichung die passende Beschreibung zu.",
    paare: [
      { links: "y = 3x", rechts: "steigt, geht durch den Nullpunkt" },
      { links: "y = −x + 2", rechts: "fällt, schneidet die y-Achse bei 2" },
      { links: "y = 5", rechts: "waagrechte Gerade" },
      { links: "y = x + 1", rechts: "steigt, schneidet die y-Achse bei 1" },
    ],
    erklaerung: "y = 3x: m = 3, t = 0. y = −x + 2: m = −1, t = 2. y = 5: m = 0. y = x + 1: m = 1, t = 1.",
  },
  { typ: "input", frage: "Eine Gerade geht durch (0|1) und (1|4). Wie groß ist die Steigung m?", loesung: ["3"], platzhalter: "Zahl", erklaerung: "Von x = 0 auf x = 1 steigt y von 1 auf 4: m = (4 − 1) : 1 = 3." },
  {
    typ: "mc",
    frage: "Liegt der Punkt (2|7) auf der Geraden y = 3x + 1?",
    antworten: ["Ja, denn 3 · 2 + 1 = 7", "Nein, denn 3 · 2 + 1 = 8", "Nein, denn 3 · 7 + 1 = 22", "Das kann man nicht prüfen"],
    richtig: 0,
    erklaerung: "Einsetzen: y = 3 · 2 + 1 = 7. Stimmt mit dem Punkt überein — er liegt auf der Geraden.",
  },
  {
    typ: "sortieren",
    frage: "Ordne die Geraden nach ihrer Steigung aufsteigend — beginne bei der kleinsten: y = −2x, y = 0,5x + 1, y = x, y = 3x − 2",
    richtig: ["y = −2x", "y = 0,5x + 1", "y = x", "y = 3x − 2"],
    erklaerung: "Steigungen: −2 < 0,5 < 1 < 3.",
  },
];

export default LINEARE_FUNKTIONEN_MS10;
