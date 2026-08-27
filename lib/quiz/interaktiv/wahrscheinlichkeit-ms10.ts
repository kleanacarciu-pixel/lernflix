// ============================================================================
// Interaktive Aufgaben — Wahrscheinlichkeit · Mittelschule Kl. 10 · Bayern
// Laplace-Wahrscheinlichkeit, Gegenereignis, zweistufige Experimente, relative Häufigkeit.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const WAHRSCHEINLICHKEIT_MS10: Aufgabe[] = [
  { typ: "input", frage: "Du würfelst einmal. Wie groß ist die Wahrscheinlichkeit für eine Zahl größer als 4? (Als Bruch.)", loesung: ["1/3", "2/6"], platzhalter: "z. B. 1/3", erklaerung: "Größer als 4: 5 und 6 — also 2 von 6: 2/6 = 1/3." },
  { typ: "input", frage: "In einer Urne sind 5 rote, 3 blaue und 2 grüne Kugeln. Wie groß ist die Wahrscheinlichkeit, Blau zu ziehen? (Als Bruch.)", loesung: ["3/10"], platzhalter: "z. B. 3/10", erklaerung: "3 blaue von 10 Kugeln: 3/10." },
  { typ: "input", frage: "Die Regenwahrscheinlichkeit beträgt 30 %. Wie groß ist die Wahrscheinlichkeit, dass es NICHT regnet?", loesung: ["70"], einheit: "%", platzhalter: "Zahl", erklaerung: "Gegenereignis: 100 % − 30 % = 70 %." },
  { typ: "input", frage: "Du wirfst zwei Münzen. Wie groß ist die Wahrscheinlichkeit für zweimal Zahl? (Als Bruch.)", loesung: ["1/4"], platzhalter: "z. B. 1/4", erklaerung: "1/2 · 1/2 = 1/4 (Möglichkeiten: ZZ, ZK, KZ, KK)." },
  { typ: "input", frage: "Ein Glücksrad hat 10 gleich große Felder mit den Zahlen 1 bis 10. Wie groß ist die Wahrscheinlichkeit für eine Zahl bis höchstens 3? (Als Bruch.)", loesung: ["3/10"], platzhalter: "z. B. 3/10", erklaerung: "1, 2, 3 — also 3 von 10: 3/10." },
  {
    typ: "mc",
    frage: "Was ist ein Laplace-Experiment?",
    antworten: ["Alle Ergebnisse sind gleich wahrscheinlich", "Es gibt genau zwei Ergebnisse", "Das Ergebnis steht vorher fest", "Es wird mehrmals wiederholt"],
    richtig: 0,
    erklaerung: "Laplace: jedes Ergebnis hat dieselbe Wahrscheinlichkeit (z. B. fairer Würfel).",
  },
  {
    typ: "mc",
    frage: "Beim Würfeln: Wie groß ist die Wahrscheinlichkeit, KEINE 6 zu würfeln?",
    antworten: ["5/6", "1/6", "1/2", "4/6"],
    richtig: 0,
    erklaerung: "Gegenereignis von „6“: P = 1 − 1/6 = 5/6.",
  },
  { typ: "input", frage: "Eine Klasse wirft 200-mal eine Reißzwecke; 80-mal landet sie mit der Spitze nach oben. Berechne die relative Häufigkeit in Prozent.", loesung: ["40"], einheit: "%", platzhalter: "Zahl", erklaerung: "80/200 = 40/100 = 40 %." },
  {
    typ: "luecke",
    frage: "Urne mit 4 weißen und 6 schwarzen Kugeln.",
    segmente: ["P(Weiß) = ", { luecke: ["2/5", "4/10"] }, " und P(Schwarz) = ", { luecke: ["3/5", "6/10"] }, ". (Als Bruch.)"],
    erklaerung: "4/10 = 2/5 und 6/10 = 3/5. Zusammen ergeben sie 1.",
  },
  {
    typ: "zuordnen",
    frage: "Ordne jedem Ereignis seine Wahrscheinlichkeit zu.",
    paare: [
      { links: "Münze: Kopf", rechts: "1/2" },
      { links: "Würfel: eine 3", rechts: "1/6" },
      { links: "Würfel: Zahl bis 6", rechts: "1" },
      { links: "zwei Münzen: zweimal Kopf", rechts: "1/4" },
    ],
    erklaerung: "Münze 1/2, Würfel 1/6, sicheres Ereignis 1, zweimal Kopf 1/2 · 1/2 = 1/4.",
  },
  {
    typ: "mc",
    frage: "Ein Spiel: Du gewinnst mit Wahrscheinlichkeit 1/5. Du spielst 100-mal. Wie oft gewinnst du ungefähr (Erwartung)?",
    antworten: ["ungefähr 20-mal", "genau 20-mal, garantiert", "ungefähr 5-mal", "ungefähr 50-mal"],
    richtig: 0,
    erklaerung: "1/5 von 100 = 20 — im Durchschnitt etwa 20 Gewinne, aber ohne Garantie.",
  },
  { typ: "input", frage: "Du ziehst eine Karte aus einem Stapel mit 32 Karten, davon 8 Herz. Wie groß ist die Wahrscheinlichkeit für Herz? (Als Bruch.)", loesung: ["1/4", "8/32"], platzhalter: "z. B. 1/4", erklaerung: "8 von 32: 8/32 = 1/4." },
  { typ: "input", frage: "In einer Urne sind nur rote Kugeln. Wie groß ist die Wahrscheinlichkeit, eine rote Kugel zu ziehen? (Als Zahl von 0 bis 1 oder in Prozent.)", loesung: ["1", "100 %", "100%"], platzhalter: "z. B. 1", erklaerung: "Sicheres Ereignis: P = 1 = 100 %." },
  {
    typ: "mc",
    frage: "Beim zweimaligen Münzwurf: Wie groß ist die Wahrscheinlichkeit für mindestens einmal Kopf?",
    antworten: ["3/4", "1/2", "1/4", "1"],
    richtig: 0,
    erklaerung: "Gegenereignis „kein Kopf“ (= ZZ) hat 1/4. Also: 1 − 1/4 = 3/4.",
  },
  {
    typ: "sortieren",
    frage: "Ordne die Ereignisse nach ihrer Wahrscheinlichkeit aufsteigend — beginne beim unwahrscheinlichsten: Würfel zeigt eine 2, Münze zeigt Kopf, Würfel zeigt Zahl bis 5, Würfel zeigt eine 0",
    richtig: ["Würfel zeigt eine 0", "Würfel zeigt eine 2", "Münze zeigt Kopf", "Würfel zeigt Zahl bis 5"],
    erklaerung: "0 < 1/6 < 1/2 < 5/6.",
  },
];

export default WAHRSCHEINLICHKEIT_MS10;
