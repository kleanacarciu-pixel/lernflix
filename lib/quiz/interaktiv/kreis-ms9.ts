// ============================================================================
// Interaktive Aufgaben — Kreis: Umfang & Fläche · Mittelschule Kl. 9 · Bayern
// Umfang U = 2·π·r, Fläche A = π·r², Rechnen mit π ≈ 3,14, Sachaufgaben.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const KREIS_MS9: Aufgabe[] = [
  {
    typ: "mc",
    frage: "Mit welcher Formel berechnet man den Umfang eines Kreises?",
    antworten: ["U = 2 · π · r", "U = π · r²", "U = 4 · r", "U = r · r"],
    richtig: 0,
    erklaerung: "Umfang: U = 2 · π · r (oder U = π · d mit dem Durchmesser d).",
  },
  {
    typ: "mc",
    frage: "Mit welcher Formel berechnet man den Flächeninhalt eines Kreises?",
    antworten: ["A = π · r²", "A = 2 · π · r", "A = π · d", "A = r²"],
    richtig: 0,
    erklaerung: "Fläche: A = π · r² (Radius zum Quadrat mal π).",
  },
  { typ: "input", frage: "Ein Kreis hat den Radius r = 5 cm. Wie lang ist sein Durchmesser?", loesung: ["10"], einheit: "cm", platzhalter: "Zahl", erklaerung: "d = 2 · r = 2 · 5 = 10 cm." },
  { typ: "input", frage: "Berechne den Umfang eines Kreises mit r = 10 cm. (π ≈ 3,14)", loesung: ["62,8"], einheit: "cm", platzhalter: "z. B. 62,8", erklaerung: "U = 2 · 3,14 · 10 = 62,8 cm." },
  { typ: "input", frage: "Berechne den Umfang eines Kreises mit d = 20 cm. (π ≈ 3,14)", loesung: ["62,8"], einheit: "cm", platzhalter: "z. B. 62,8", erklaerung: "U = π · d = 3,14 · 20 = 62,8 cm." },
  { typ: "input", frage: "Berechne die Fläche eines Kreises mit r = 10 cm. (π ≈ 3,14)", loesung: ["314"], einheit: "cm²", platzhalter: "Zahl", erklaerung: "A = 3,14 · 10² = 3,14 · 100 = 314 cm²." },
  { typ: "input", frage: "Berechne die Fläche eines Kreises mit r = 2 cm. (π ≈ 3,14)", loesung: ["12,56"], einheit: "cm²", platzhalter: "z. B. 12,56", erklaerung: "A = 3,14 · 2² = 3,14 · 4 = 12,56 cm²." },
  {
    typ: "luecke",
    frage: "Die Kreiszahl π.",
    segmente: ["π ≈ ", { luecke: ["3,14", "3,141", "3,1416", "3,14159"] }, " — sie gibt an, wie oft der ", { luecke: ["Durchmesser"] }, " in den Umfang passt (Radius/Durchmesser)."],
    erklaerung: "π ≈ 3,14. Der Umfang ist π-mal so lang wie der Durchmesser: U = π · d.",
  },
  {
    typ: "mc",
    frage: "Der Radius eines Kreises wird verdoppelt. Was passiert mit dem Umfang?",
    antworten: ["Er verdoppelt sich", "Er vervierfacht sich", "Er bleibt gleich", "Er halbiert sich"],
    richtig: 0,
    erklaerung: "U = 2 · π · r wächst direkt mit r: doppelter Radius → doppelter Umfang. (Die Fläche würde sich vervierfachen!)",
  },
  { typ: "input", frage: "Ein runder Gartenteich hat den Radius 3 m. Wie viel Meter Zaun braucht man für den Rand? (π ≈ 3,14)", loesung: ["18,84"], einheit: "m", platzhalter: "z. B. 18,84", erklaerung: "U = 2 · 3,14 · 3 = 18,84 m." },
  { typ: "input", frage: "Eine runde Pizza hat den Durchmesser 30 cm. Wie groß ist ihr Radius?", loesung: ["15"], einheit: "cm", platzhalter: "Zahl", erklaerung: "r = d : 2 = 30 : 2 = 15 cm." },
  {
    typ: "zuordnen",
    frage: "Ordne jedem Kreis (π ≈ 3,14) den richtigen Wert zu.",
    paare: [
      { links: "r = 1 cm: Umfang", rechts: "6,28 cm" },
      { links: "r = 1 cm: Fläche", rechts: "3,14 cm²" },
      { links: "r = 3 cm: Umfang", rechts: "18,84 cm" },
      { links: "r = 3 cm: Fläche", rechts: "28,26 cm²" },
    ],
    erklaerung: "U = 2 · 3,14 · r: 6,28 bzw. 18,84 cm. A = 3,14 · r²: 3,14 bzw. 28,26 cm².",
  },
  {
    typ: "mc",
    frage: "Ein Kreis hat den Umfang 31,4 cm. Wie groß ist sein Durchmesser? (π ≈ 3,14)",
    antworten: ["10 cm", "5 cm", "31,4 cm", "100 cm"],
    richtig: 0,
    erklaerung: "d = U : π = 31,4 : 3,14 = 10 cm.",
  },
  { typ: "input", frage: "Ein Rad hat den Durchmesser 70 cm. Wie weit rollt es bei einer Umdrehung? (π ≈ 3,14; als Kommazahl in cm)", loesung: ["219,8", "219,80"], einheit: "cm", platzhalter: "z. B. 219,8", erklaerung: "Eine Umdrehung = Umfang: U = 3,14 · 70 = 219,8 cm (ca. 2,20 m)." },
  {
    typ: "sortieren",
    frage: "Ordne die Kreise nach ihrer Fläche aufsteigend — beginne beim kleinsten: Kreis mit r = 2 cm, Kreis mit d = 2 cm, Kreis mit r = 3 cm, Kreis mit d = 8 cm",
    richtig: ["Kreis mit d = 2 cm", "Kreis mit r = 2 cm", "Kreis mit r = 3 cm", "Kreis mit d = 8 cm"],
    erklaerung: "Radien: 1 cm < 2 cm < 3 cm < 4 cm — je größer der Radius, desto größer die Fläche.",
  },
];

export default KREIS_MS9;
