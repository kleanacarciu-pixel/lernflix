// ============================================================================
// Interaktive Aufgaben — Dezimalbrüche · Gymnasium Klasse 6 · Bayern
// Gemischte Typen, Lösungen von Hand geprüft.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const DEZIMALBRUECHE_GYM6: Aufgabe[] = [
  { typ: "input", frage: "Berechne 0,3 + 0,45.", loesung: ["0,75"], platzhalter: "z. B. 0,75", erklaerung: "Komma unter Komma schreiben: 0,30 + 0,45 = 0,75." },
  { typ: "input", frage: "Berechne 1,2 − 0,35.", loesung: ["0,85"], platzhalter: "z. B. 0,85", erklaerung: "1,20 − 0,35 = 0,85." },
  { typ: "input", frage: "Berechne 0,4 · 0,2.", loesung: ["0,08"], platzhalter: "z. B. 0,08", erklaerung: "4 · 2 = 8. Zusammen zwei Nachkommastellen: 0,08." },
  { typ: "input", frage: "Berechne 4,8 : 0,6.", loesung: ["8"], platzhalter: "Zahl", erklaerung: "Beide Zahlen mal 10: 48 : 6 = 8." },
  {
    typ: "sortieren",
    frage: "Ordne die Dezimalzahlen der Größe nach — beginne bei der kleinsten.",
    richtig: ["0,68", "0,7", "0,709", "0,71"],
    erklaerung: "Auf gleiche Stellenzahl bringen: 0,680; 0,700; 0,709; 0,710. Also 0,68 < 0,7 < 0,709 < 0,71.",
  },
  {
    typ: "zuordnen",
    frage: "Ordne jedem Bruch die passende Dezimalzahl zu.",
    paare: [
      { links: "1/8", rechts: "0,125" },
      { links: "3/4", rechts: "0,75" },
      { links: "2/5", rechts: "0,4" },
      { links: "1/2", rechts: "0,5" },
    ],
    erklaerung: "1/8 = 0,125; 3/4 = 0,75; 2/5 = 0,4; 1/2 = 0,5.",
  },
  {
    typ: "luecke",
    frage: "Verschiebe das Komma richtig.",
    segmente: ["2,5 · 100 = ", { luecke: ["250"] }, "  und  2,5 : 100 = ", { luecke: ["0,025"] }, "."],
    erklaerung: "Mal 100 rückt das Komma zwei Stellen nach rechts (250), geteilt durch 100 zwei Stellen nach links (0,025).",
  },
  { typ: "input", frage: "Schreibe 3/8 als Dezimalzahl.", loesung: ["0,375"], platzhalter: "z. B. 0,375", erklaerung: "3 : 8 = 0,375 (schriftlich dividiert)." },
  { typ: "input", frage: "Schreibe 0,35 als vollständig gekürzten Bruch.", loesung: ["7/20"], platzhalter: "z. B. 7/20", erklaerung: "0,35 = 35/100. Mit 5 kürzen: 7/20." },
  { typ: "input", frage: "Runde 3,847 auf zwei Nachkommastellen.", loesung: ["3,85"], platzhalter: "z. B. 3,85", erklaerung: "Die dritte Stelle ist 7 (≥ 5), also aufrunden: 3,85." },
  { typ: "input", frage: "1 Liter Saft kostet 1,60 €. Was kosten 0,75 Liter?", loesung: ["1,20", "1,2"], einheit: "€", platzhalter: "Zahl", erklaerung: "1,60 € · 0,75 = 1,20 €." },
  { typ: "input", frage: "Du kaufst 3 Hefte zu je 1,45 € und zahlst mit 10 €. Wie viel Rückgeld bekommst du?", loesung: ["5,65"], einheit: "€", platzhalter: "Zahl", erklaerung: "3 · 1,45 € = 4,35 €. 10,00 € − 4,35 € = 5,65 €." },
  {
    typ: "mc",
    frage: "Welcher Bruch ergibt eine periodische (nicht abbrechende) Dezimalzahl?",
    antworten: ["2/3", "1/4", "3/5", "7/8"],
    richtig: 0,
    erklaerung: "2/3 = 0,666… ist periodisch. 1/4 = 0,25; 3/5 = 0,6; 7/8 = 0,875 brechen ab.",
  },
  { typ: "input", frage: "Wie groß ist der Mittelwert (Durchschnitt) von 2,4 und 3,0?", loesung: ["2,7"], platzhalter: "z. B. 2,7", erklaerung: "(2,4 + 3,0) : 2 = 5,4 : 2 = 2,7." },
  {
    typ: "luecke",
    frage: "Welche Ziffer steht an welcher Stelle von 4,376?",
    segmente: ["Zehntel: ", { luecke: ["3"] }, ", Hundertstel: ", { luecke: ["7"] }, ", Tausendstel: ", { luecke: ["6"] }, "."],
    erklaerung: "Nach dem Komma: 3 = Zehntel, 7 = Hundertstel, 6 = Tausendstel.",
  },
  { typ: "input", frage: "Berechne 2,5 + 1,5 · 2. (Punkt vor Strich!)", loesung: ["5,5"], platzhalter: "z. B. 5,5", erklaerung: "Zuerst 1,5 · 2 = 3, dann 2,5 + 3 = 5,5." },
  { typ: "input", frage: "Berechne 6 − 0,25.", loesung: ["5,75"], platzhalter: "z. B. 5,75", erklaerung: "6,00 − 0,25 = 5,75." },
  {
    typ: "mc",
    frage: "Welche Zahl ist größer: 3/4 oder 0,7?",
    antworten: ["3/4", "0,7", "Sie sind gleich groß", "Das lässt sich nicht vergleichen"],
    richtig: 0,
    erklaerung: "3/4 = 0,75, und 0,75 > 0,70.",
  },
];

export default DEZIMALBRUECHE_GYM6;
