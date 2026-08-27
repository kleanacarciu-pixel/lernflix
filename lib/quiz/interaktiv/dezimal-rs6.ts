// ============================================================================
// Interaktive Aufgaben — Dezimalbrüche · Realschule Kl. 6 · Bayern
// Rechnen mit Dezimalzahlen, Runden, Umwandeln. Lösungen geprüft.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const DEZIMAL_RS6: Aufgabe[] = [
  { typ: "input", frage: "Berechne 0,4 + 0,35.", loesung: ["0,75"], platzhalter: "z. B. 0,75", erklaerung: "Komma unter Komma: 0,40 + 0,35 = 0,75." },
  { typ: "input", frage: "Berechne 1,5 − 0,6.", loesung: ["0,9"], platzhalter: "z. B. 0,9", erklaerung: "1,5 − 0,6 = 0,9." },
  { typ: "input", frage: "Berechne 0,3 · 0,2.", loesung: ["0,06"], platzhalter: "z. B. 0,06", erklaerung: "3 · 2 = 6, zusammen zwei Nachkommastellen: 0,06." },
  { typ: "input", frage: "Berechne 3,6 : 0,6.", loesung: ["6"], platzhalter: "Zahl", erklaerung: "Beide Zahlen mal 10: 36 : 6 = 6." },
  { typ: "input", frage: "Berechne 0,7 · 10.", loesung: ["7"], platzhalter: "Zahl", erklaerung: "Mal 10 rückt das Komma eine Stelle nach rechts: 7." },
  { typ: "input", frage: "Berechne 4,2 : 10.", loesung: ["0,42"], platzhalter: "z. B. 0,42", erklaerung: "Geteilt durch 10 rückt das Komma eine Stelle nach links: 0,42." },
  {
    typ: "luecke",
    frage: "Verschiebe das Komma richtig.",
    segmente: ["1,5 · 100 = ", { luecke: ["150"] }, "  und  1,5 : 100 = ", { luecke: ["0,015"] }, "."],
    erklaerung: "Mal 100: zwei Stellen nach rechts (150). Geteilt durch 100: zwei Stellen nach links (0,015).",
  },
  { typ: "input", frage: "Schreibe 1/2 als Dezimalzahl.", loesung: ["0,5"], platzhalter: "z. B. 0,5", erklaerung: "1 : 2 = 0,5." },
  { typ: "input", frage: "Schreibe 0,25 als vollständig gekürzten Bruch.", loesung: ["1/4"], platzhalter: "z. B. 1/4", erklaerung: "0,25 = 25/100 = 1/4." },
  {
    typ: "sortieren",
    frage: "Ordne die Dezimalzahlen der Größe nach — beginne bei der kleinsten.",
    richtig: ["0,09", "0,9", "1,09", "1,9"],
    erklaerung: "0,09 < 0,90 < 1,09 < 1,90.",
  },
  { typ: "input", frage: "Runde 5,678 auf zwei Nachkommastellen.", loesung: ["5,68"], platzhalter: "z. B. 5,68", erklaerung: "Die dritte Stelle ist 8 (≥ 5), also aufrunden: 5,68." },
  { typ: "input", frage: "Eine Breze kostet 0,90 €. Was kosten 3 Brezen?", loesung: ["2,70", "2,7"], einheit: "€", platzhalter: "Zahl", erklaerung: "3 · 0,90 € = 2,70 €." },
  { typ: "input", frage: "Du zahlst mit 5 € und kaufst für 3,25 € ein. Wie viel Rückgeld bekommst du?", loesung: ["1,75"], einheit: "€", platzhalter: "Zahl", erklaerung: "5,00 € − 3,25 € = 1,75 €." },
  {
    typ: "mc",
    frage: "Welche Zahl ist größer: 0,5 oder 0,45?",
    antworten: ["0,5", "0,45", "Sie sind gleich groß", "Das lässt sich nicht vergleichen"],
    richtig: 0,
    erklaerung: "0,5 = 0,50, und 0,50 > 0,45.",
  },
  { typ: "input", frage: "Berechne 0,2 · 0,4.", loesung: ["0,08"], platzhalter: "z. B. 0,08", erklaerung: "2 · 4 = 8, zusammen zwei Nachkommastellen: 0,08." },
];

export default DEZIMAL_RS6;
