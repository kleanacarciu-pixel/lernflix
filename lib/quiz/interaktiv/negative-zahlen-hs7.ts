// ============================================================================
// Interaktive Aufgaben — Negative Zahlen · Hauptschule Kl. 7 · Bayern
// Zahlengerade, Temperatur, Kontostand — Plus und Minus mit negativen Zahlen.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const NEGATIVE_ZAHLEN_HS7: Aufgabe[] = [
  {
    typ: "mc",
    frage: "Welche Temperatur ist kälter: −5 °C oder −1 °C?",
    antworten: ["−5 °C", "−1 °C", "beide gleich kalt", "das kann man nicht sagen"],
    richtig: 0,
    erklaerung: "−5 liegt auf der Zahlengeraden weiter links (tiefer) als −1 — also kälter.",
  },
  { typ: "input", frage: "Berechne: (−2) + 6", loesung: ["4"], platzhalter: "Zahl", erklaerung: "Von −2 aus 6 Schritte nach rechts: 4." },
  { typ: "input", frage: "Berechne: 2 − 7", loesung: ["-5", "−5"], platzhalter: "Zahl", erklaerung: "2 − 7 = −5 (5 unter null)." },
  { typ: "input", frage: "Berechne: (−3) − 4", loesung: ["-7", "−7"], platzhalter: "Zahl", erklaerung: "Von −3 noch 4 nach links: −7." },
  { typ: "input", frage: "Berechne: (−6) + 6", loesung: ["0"], platzhalter: "Zahl", erklaerung: "Eine Zahl plus ihre Gegenzahl ergibt 0." },
  { typ: "input", frage: "Draußen sind es −4 °C. Die Temperatur steigt um 9 °C. Wie warm ist es dann?", loesung: ["5"], einheit: "°C", platzhalter: "Zahl", erklaerung: "−4 + 9 = 5 °C." },
  { typ: "input", frage: "Tagsüber sind es 3 °C, nachts fällt die Temperatur um 8 °C. Wie kalt ist es nachts?", loesung: ["-5", "−5"], einheit: "°C", platzhalter: "Zahl", erklaerung: "3 − 8 = −5 °C." },
  { typ: "input", frage: "Dein Konto steht bei −15 €. Du zahlst 20 € ein. Wie ist der neue Kontostand?", loesung: ["5"], einheit: "€", platzhalter: "Zahl", erklaerung: "−15 + 20 = 5 €." },
  {
    typ: "mc",
    frage: "Was ist die Gegenzahl von 7?",
    antworten: ["−7", "7", "0", "1/7"],
    richtig: 0,
    erklaerung: "Die Gegenzahl hat das andere Vorzeichen: 7 → −7.",
  },
  {
    typ: "mc",
    frage: "Ein Aufzug fährt vom 2. Stock 3 Stockwerke nach unten. Wo ist er dann?",
    antworten: ["im 1. Untergeschoss (−1)", "im 5. Stock", "im Erdgeschoss (0)", "im 1. Stock"],
    richtig: 0,
    erklaerung: "2 − 3 = −1 — ein Stockwerk unter dem Erdgeschoss.",
  },
  {
    typ: "luecke",
    frage: "Zahlengerade.",
    segmente: ["(−1) − 2 = ", { luecke: ["-3", "−3"] }, " und (−1) + 2 = ", { luecke: ["1"] }, "."],
    erklaerung: "Nach links: −3. Nach rechts: 1.",
  },
  {
    typ: "sortieren",
    frage: "Ordne die Temperaturen vom kältesten zum wärmsten.",
    richtig: ["−10 °C", "−2 °C", "0 °C", "7 °C"],
    erklaerung: "−10 < −2 < 0 < 7.",
  },
  {
    typ: "zuordnen",
    frage: "Ordne jeder Rechnung ihr Ergebnis zu.",
    paare: [
      { links: "(−4) + 6", rechts: "2" },
      { links: "(−4) − 6", rechts: "−10" },
      { links: "4 − 6", rechts: "−2" },
      { links: "(−4) + 4", rechts: "0" },
    ],
    erklaerung: "−4 + 6 = 2; −4 − 6 = −10; 4 − 6 = −2; −4 + 4 = 0.",
  },
  { typ: "input", frage: "Ein Taucher ist 6 m unter Wasser (−6 m) und steigt 4 m nach oben. Bei wie viel Metern ist er jetzt?", loesung: ["-2", "−2"], einheit: "m", platzhalter: "Zahl", erklaerung: "−6 + 4 = −2 m (2 m unter der Wasseroberfläche)." },
  { typ: "input", frage: "Berechne: (−8) + 3 + 5", loesung: ["0"], platzhalter: "Zahl", erklaerung: "−8 + 3 = −5, dann −5 + 5 = 0." },
];

export default NEGATIVE_ZAHLEN_HS7;
