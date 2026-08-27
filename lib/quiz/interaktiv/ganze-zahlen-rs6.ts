// ============================================================================
// Interaktive Aufgaben — Ganze Zahlen (negativ) · Realschule Kl. 6 · Bayern
// Addition/Subtraktion negativer Zahlen, Zahlengerade, Sachkontexte.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const GANZE_ZAHLEN_RS6: Aufgabe[] = [
  { typ: "input", frage: "Berechne (−2) + 6.", loesung: ["4"], platzhalter: "Zahl", erklaerung: "Von −2 sechs Schritte nach oben: 4." },
  { typ: "input", frage: "Berechne 3 + (−8).", loesung: ["−5", "-5"], platzhalter: "Zahl", erklaerung: "Plus eine negative Zahl heißt abziehen: 3 − 8 = −5." },
  { typ: "input", frage: "Berechne (−4) + (−5).", loesung: ["−9", "-9"], platzhalter: "Zahl", erklaerung: "Beträge addieren (4 + 5 = 9), das Minus bleibt: −9." },
  { typ: "input", frage: "Berechne 2 − 9.", loesung: ["−7", "-7"], platzhalter: "Zahl", erklaerung: "2 − 9 = −7." },
  { typ: "input", frage: "Berechne (−6) − 2.", loesung: ["−8", "-8"], platzhalter: "Zahl", erklaerung: "Von −6 noch 2 abziehen: −8." },
  { typ: "input", frage: "Berechne (−3) − (−7).", loesung: ["4"], platzhalter: "Zahl", erklaerung: "Minus ein Minus wird plus: −3 + 7 = 4." },
  {
    typ: "sortieren",
    frage: "Ordne die Zahlen der Größe nach — beginne bei der kleinsten.",
    richtig: ["−5", "−2", "0", "3"],
    erklaerung: "Auf der Zahlengeraden von links nach rechts: −5 < −2 < 0 < 3.",
  },
  { typ: "input", frage: "Wie groß ist der Betrag von −9?", loesung: ["9"], platzhalter: "Zahl", erklaerung: "Der Betrag ist der Abstand zur 0, immer positiv: 9." },
  { typ: "input", frage: "Die Temperatur steigt von −4 °C um 9 °C. Wie warm ist es dann?", loesung: ["5"], einheit: "°C", platzhalter: "Zahl", erklaerung: "−4 + 9 = 5 °C." },
  { typ: "input", frage: "Nachts sind es −8 °C, tagsüber 2 °C. Um wie viel Grad steigt die Temperatur?", loesung: ["10"], einheit: "°C", platzhalter: "Zahl", erklaerung: "Unterschied: 2 − (−8) = 2 + 8 = 10 °C." },
  { typ: "input", frage: "Ein Taucher ist auf −7 m und taucht 4 m tiefer. Auf welcher Höhe ist er?", loesung: ["−11", "-11"], einheit: "m", platzhalter: "Zahl", erklaerung: "Tiefer heißt kleiner: −7 − 4 = −11 m." },
  { typ: "input", frage: "Berechne (−5) + 5.", loesung: ["0"], platzhalter: "Zahl", erklaerung: "Eine Zahl plus ihre Gegenzahl ergibt 0." },
  {
    typ: "luecke",
    frage: "Ergänze die fehlende Zahl.",
    segmente: ["(−3) + ", { luecke: ["3"] }, " = 0  und  (−3) + ", { luecke: ["5"] }, " = 2."],
    erklaerung: "Die Gegenzahl von −3 ist 3. Und −3 + 5 = 2.",
  },
  {
    typ: "mc",
    frage: "Welche dieser Zahlen ist die kleinste?",
    antworten: ["−10", "−9", "−1", "0"],
    richtig: 0,
    erklaerung: "Je weiter links auf der Zahlengeraden, desto kleiner: −10.",
  },
  { typ: "input", frage: "Berechne 4 + (−2) + (−5).", loesung: ["−3", "-3"], platzhalter: "Zahl", erklaerung: "4 − 2 = 2, dann 2 − 5 = −3." },
];

export default GANZE_ZAHLEN_RS6;
