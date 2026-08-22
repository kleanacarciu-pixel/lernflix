// ============================================================================
// Interaktive Aufgaben — Ganze Zahlen (negativ) · Gymnasium Kl. 6 · Bayern
// Nur Addition/Subtraktion (Multiplikation negativer Zahlen erst Kl. 7).
// Lösungen von Hand geprüft.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const GANZE_ZAHLEN_GYM6: Aufgabe[] = [
  { typ: "input", frage: "Berechne (−3) + 5.", loesung: ["2"], platzhalter: "Zahl", erklaerung: "Von −3 fünf Schritte nach oben: −3, −2, −1, 0, 1, 2. Ergebnis 2." },
  { typ: "input", frage: "Berechne 4 + (−7).", loesung: ["−3"], platzhalter: "Zahl", erklaerung: "Plus eine negative Zahl heißt abziehen: 4 − 7 = −3." },
  { typ: "input", frage: "Berechne (−6) + (−9).", loesung: ["−15"], platzhalter: "Zahl", erklaerung: "Zwei negative Zahlen: Beträge addieren (6 + 9 = 15), Minus bleibt: −15." },
  { typ: "input", frage: "Berechne (−5) − 8.", loesung: ["−13"], platzhalter: "Zahl", erklaerung: "Von −5 noch 8 abziehen: −13." },
  { typ: "input", frage: "Berechne (−4) − (−9).", loesung: ["5"], platzhalter: "Zahl", erklaerung: "Minus ein Minus wird plus: −4 + 9 = 5." },
  {
    typ: "sortieren",
    frage: "Ordne die Zahlen der Größe nach — beginne bei der kleinsten.",
    richtig: ["−4", "−1", "0", "2"],
    erklaerung: "Auf der Zahlengeraden von links nach rechts: −4 < −1 < 0 < 2.",
  },
  { typ: "input", frage: "Wie groß ist der Betrag von −15?", loesung: ["15"], platzhalter: "Zahl", erklaerung: "Der Betrag ist der Abstand zur 0 und immer positiv: |−15| = 15." },
  { typ: "input", frage: "Die Temperatur steigt von −8 °C um 11 °C. Wie warm ist es dann?", loesung: ["3"], einheit: "°C", platzhalter: "Zahl", erklaerung: "−8 + 11 = 3 °C." },
  { typ: "input", frage: "Nachts sind es −6 °C, tagsüber 4 °C. Um wie viel Grad steigt die Temperatur?", loesung: ["10"], einheit: "°C", platzhalter: "Zahl", erklaerung: "Unterschied: 4 − (−6) = 4 + 6 = 10 °C." },
  { typ: "input", frage: "Ein Taucher ist auf −12 m und taucht 5 m tiefer. Auf welcher Höhe ist er?", loesung: ["−17"], einheit: "m", platzhalter: "Zahl", erklaerung: "Tiefer heißt kleiner: −12 − 5 = −17 m." },
  { typ: "input", frage: "Ein Konto steht bei −40 €. Es werden 25 € eingezahlt. Wie ist der neue Kontostand?", loesung: ["−15"], einheit: "€", platzhalter: "Zahl", erklaerung: "−40 + 25 = −15 €. Das Konto ist noch im Minus." },
  {
    typ: "luecke",
    frage: "Ergänze die fehlende Zahl.",
    segmente: ["(−5) + ", { luecke: ["5"] }, " = 0  und  (−5) + ", { luecke: ["8"] }, " = 3."],
    erklaerung: "Die Gegenzahl von −5 ist 5 (ergibt 0). Und −5 + 8 = 3.",
  },
  {
    typ: "mc",
    frage: "Welche dieser Zahlen ist die kleinste?",
    antworten: ["−12", "−7", "−3", "−1"],
    richtig: 0,
    erklaerung: "Je weiter links auf der Zahlengeraden, desto kleiner. −12 liegt am weitesten links.",
  },
  { typ: "input", frage: "Berechne (−7) + 3 − (−2).", loesung: ["−2"], platzhalter: "Zahl", erklaerung: "−7 + 3 = −4, dann −4 − (−2) = −4 + 2 = −2." },
  {
    typ: "mc",
    frage: "Welche Rechnung ergibt eine positive Zahl?",
    antworten: ["(−2) − (−9)", "(−2) + (−9)", "2 − 9", "(−9) − 2"],
    richtig: 0,
    erklaerung: "(−2) − (−9) = −2 + 9 = 7 (positiv). Die anderen ergeben −11, −7 und −11.",
  },
  { typ: "input", frage: "Berechne (−8) + 8.", loesung: ["0"], platzhalter: "Zahl", erklaerung: "Eine Zahl plus ihre Gegenzahl ergibt immer 0." },
  {
    typ: "zuordnen",
    frage: "Ordne jeder Rechnung ihr Ergebnis zu.",
    paare: [
      { links: "(−3) + 5", rechts: "2" },
      { links: "3 − 10", rechts: "−7" },
      { links: "(−6) + (−2)", rechts: "−8" },
      { links: "(−4) − (−9)", rechts: "5" },
    ],
    erklaerung: "(−3)+5 = 2; 3−10 = −7; (−6)+(−2) = −8; (−4)−(−9) = 5.",
  },
  { typ: "input", frage: "Welche Zahl liegt genau in der Mitte zwischen −5 und −1?", loesung: ["−3"], platzhalter: "Zahl", erklaerung: "Mitte = (−5 + (−1)) : 2 = −6 : 2 = −3." },
];

export default GANZE_ZAHLEN_GYM6;
