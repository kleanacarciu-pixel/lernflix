// ============================================================================
// Interaktive Aufgaben — Statistik · Realschule Kl. 8 · Bayern
// Mittelwert, Median, Modus, Spannweite, relative Häufigkeit, Diagramme.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const STATISTIK_RS8: Aufgabe[] = [
  { typ: "input", frage: "Wie groß ist der Mittelwert (Durchschnitt) von 4, 6 und 8?", loesung: ["6"], platzhalter: "Zahl", erklaerung: "(4 + 6 + 8) : 3 = 18 : 3 = 6." },
  { typ: "input", frage: "Wie groß ist der Mittelwert von 3, 5, 7 und 9?", loesung: ["6"], platzhalter: "Zahl", erklaerung: "(3 + 5 + 7 + 9) : 4 = 24 : 4 = 6." },
  { typ: "input", frage: "Der kleinste Messwert ist 2, der größte 14. Wie groß ist die Spannweite?", loesung: ["12"], platzhalter: "Zahl", erklaerung: "Spannweite = größter − kleinster Wert = 14 − 2 = 12." },
  { typ: "input", frage: "Wie groß ist der Median (der mittlere Wert) von 3, 7 und 9?", loesung: ["7"], platzhalter: "Zahl", erklaerung: "Der Median ist der mittlere Wert der geordneten Reihe: 3, 7, 9 → 7." },
  { typ: "input", frage: "Wie groß ist der Median von 1, 4, 6, 8 und 11?", loesung: ["6"], platzhalter: "Zahl", erklaerung: "Der mittlere (dritte) Wert von fünf geordneten Werten: 6." },
  {
    typ: "mc",
    frage: "Wie berechnet man den Mittelwert (Durchschnitt)?",
    antworten: ["Alle Werte addieren und durch die Anzahl der Werte teilen", "Den größten Wert nehmen", "Immer durch 2 teilen", "Alle Werte multiplizieren"],
    richtig: 0,
    erklaerung: "Mittelwert = Summe aller Werte : Anzahl der Werte.",
  },
  { typ: "input", frage: "Vier Klassenarbeiten hatten die Noten 1, 2, 2 und 3. Wie groß ist der Notendurchschnitt?", loesung: ["2"], platzhalter: "Zahl", erklaerung: "(1 + 2 + 2 + 3) : 4 = 8 : 4 = 2." },
  { typ: "input", frage: "Bei 20 Würfen fällt 4-mal die Sechs. Wie groß ist die relative Häufigkeit in Prozent?", loesung: ["20"], einheit: "%", platzhalter: "Zahl", erklaerung: "4 : 20 = 0,2 = 20 %." },
  {
    typ: "luecke",
    frage: "Berechne den Mittelwert.",
    segmente: ["Der Mittelwert von 10 und 16 ist ", { luecke: ["13"] }, "."],
    erklaerung: "(10 + 16) : 2 = 26 : 2 = 13.",
  },
  {
    typ: "mc",
    frage: "Welches Diagramm zeigt am besten die Anteile eines Ganzen?",
    antworten: ["Kreisdiagramm", "Liniendiagramm", "eine lange Tabelle", "kein Diagramm"],
    richtig: 0,
    erklaerung: "Ein Kreisdiagramm zeigt Anteile am Ganzen besonders anschaulich.",
  },
  { typ: "input", frage: "Welcher Wert kommt in der Reihe 2, 3, 3, 3, 5 am häufigsten vor (Modus)?", loesung: ["3"], platzhalter: "Zahl", erklaerung: "Die 3 kommt dreimal vor — häufiger als alle anderen Werte." },
  { typ: "input", frage: "In 5 Spielen wurden im Durchschnitt 2 Tore geschossen. Wie viele Tore waren es insgesamt?", loesung: ["10"], platzhalter: "Zahl", erklaerung: "5 · 2 = 10 Tore." },
  { typ: "input", frage: "Bei einer Umfrage stimmen 15 von 60 Personen mit „ja“. Wie viel Prozent sind das?", loesung: ["25"], einheit: "%", platzhalter: "Zahl", erklaerung: "15 : 60 = 0,25 = 25 %." },
  {
    typ: "sortieren",
    frage: "Ordne die Messwerte der Größe nach (Rangliste) — beginne beim kleinsten.",
    richtig: ["2", "4", "6", "9"],
    erklaerung: "Der Größe nach: 2, 4, 6, 9.",
  },
  { typ: "input", frage: "Die Messwerte sind 5, 9, 12 und 20. Wie groß ist die Spannweite?", loesung: ["15"], platzhalter: "Zahl", erklaerung: "20 − 5 = 15." },
];

export default STATISTIK_RS8;
