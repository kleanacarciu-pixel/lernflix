// ============================================================================
// Interaktive Aufgaben — Rechnen mit negativen Zahlen · Mittelschule Kl. 7
// Zahlengerade, Vergleichen, Addieren/Subtrahieren, Alltag (Temperatur, Konto).
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const NEGATIVE_ZAHLEN_MS7: Aufgabe[] = [
  { typ: "input", frage: "Berechne: (−3) + 5", loesung: ["2"], platzhalter: "Zahl", erklaerung: "Von −3 aus 5 Schritte nach rechts: −3 + 5 = 2." },
  { typ: "input", frage: "Berechne: (−4) + (−2)", loesung: ["-6", "−6"], platzhalter: "Zahl", erklaerung: "Zwei Schulden zusammen: −4 − 2 = −6." },
  { typ: "input", frage: "Berechne: 3 − 8", loesung: ["-5", "−5"], platzhalter: "Zahl", erklaerung: "3 − 8 = −5 (5 unter null)." },
  { typ: "input", frage: "Berechne: (−7) + 7", loesung: ["0"], platzhalter: "Zahl", erklaerung: "Eine Zahl plus ihre Gegenzahl ergibt 0." },
  { typ: "input", frage: "Berechne: (−2) − 6", loesung: ["-8", "−8"], platzhalter: "Zahl", erklaerung: "Von −2 aus 6 Schritte nach links: −8." },
  { typ: "input", frage: "Berechne: 5 − (−3)", loesung: ["8"], platzhalter: "Zahl", erklaerung: "Minus Minus wird Plus: 5 + 3 = 8." },
  {
    typ: "mc",
    frage: "Welche Zahl ist kleiner: −7 oder −2?",
    antworten: ["−7", "−2", "Sie sind gleich groß", "Das kann man nicht vergleichen"],
    richtig: 0,
    erklaerung: "Auf der Zahlengeraden liegt −7 weiter links als −2, also ist −7 kleiner.",
  },
  {
    typ: "mc",
    frage: "Draußen sind es −5 °C. Die Temperatur steigt um 8 °C. Wie warm ist es dann?",
    antworten: ["3 °C", "−3 °C", "13 °C", "−13 °C"],
    richtig: 0,
    erklaerung: "−5 + 8 = 3, also 3 °C.",
  },
  {
    typ: "mc",
    frage: "Was ist die Gegenzahl von −9?",
    antworten: ["9", "−9", "0", "1/9"],
    richtig: 0,
    erklaerung: "Die Gegenzahl hat das umgekehrte Vorzeichen: −9 → 9.",
  },
  {
    typ: "luecke",
    frage: "Temperaturen: Nachts sind es −6 °C, tagsüber 4 °C.",
    segmente: ["Der Unterschied beträgt ", { luecke: ["10"] }, " °C, und −6 °C ist die ", { luecke: ["kältere", "kaeltere", "kälter", "kaelter"] }, " Temperatur (wärmere/kältere)."],
    erklaerung: "Von −6 bis 4 sind es 6 + 4 = 10 Grad. −6 °C ist kälter als 4 °C.",
  },
  {
    typ: "sortieren",
    frage: "Ordne die Zahlen aufsteigend — beginne bei der kleinsten.",
    richtig: ["−8", "−3", "0", "5"],
    erklaerung: "Auf der Zahlengeraden von links nach rechts: −8 < −3 < 0 < 5.",
  },
  {
    typ: "zuordnen",
    frage: "Ordne jeder Rechnung ihr Ergebnis zu.",
    paare: [
      { links: "(−5) + 3", rechts: "−2" },
      { links: "(−1) − 4", rechts: "−5" },
      { links: "2 − (−2)", rechts: "4" },
      { links: "(−3) + 3", rechts: "0" },
    ],
    erklaerung: "−5 + 3 = −2; −1 − 4 = −5; 2 − (−2) = 2 + 2 = 4; −3 + 3 = 0.",
  },
  { typ: "input", frage: "Ein Konto steht bei −20 €. Es werden 50 € eingezahlt. Wie ist der neue Kontostand?", loesung: ["30"], einheit: "€", platzhalter: "Zahl", erklaerung: "−20 + 50 = 30 €." },
  { typ: "input", frage: "Ein Taucher ist bei −3 m und taucht 5 m tiefer. Bei wie viel Metern ist er jetzt?", loesung: ["-8", "−8"], einheit: "m", platzhalter: "Zahl", erklaerung: "−3 − 5 = −8 m." },
  { typ: "input", frage: "Berechne: (−10) + 4 − 3", loesung: ["-9", "−9"], platzhalter: "Zahl", erklaerung: "−10 + 4 = −6, dann −6 − 3 = −9." },
];

export default NEGATIVE_ZAHLEN_MS7;
