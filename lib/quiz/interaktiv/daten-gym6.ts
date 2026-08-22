// ============================================================================
// Interaktive Aufgaben — Daten & Diagramme · Gymnasium Kl. 6 · Bayern
// Häufigkeit, Mittelwert, Median, Spannweite, Anteile, Diagramme.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const DATEN_GYM6: Aufgabe[] = [
  { typ: "input", frage: "Wie groß ist der Mittelwert (Durchschnitt) von 4, 6 und 8?", loesung: ["6"], platzhalter: "Zahl", erklaerung: "(4 + 6 + 8) : 3 = 18 : 3 = 6." },
  { typ: "input", frage: "Wie groß ist der Mittelwert von 2, 3, 5 und 10?", loesung: ["5"], platzhalter: "Zahl", erklaerung: "(2 + 3 + 5 + 10) : 4 = 20 : 4 = 5." },
  { typ: "input", frage: "Bei 20 Würfen fällt 5-mal die Sechs. Wie groß ist die relative Häufigkeit in Prozent?", loesung: ["25"], einheit: "%", platzhalter: "Zahl", erklaerung: "5 : 20 = 0,25 = 25 %." },
  { typ: "input", frage: "In einer Klasse: 3-mal Note 1, 8-mal Note 2, 6-mal Note 3, 3-mal Note 4. Wie viele Schüler sind das?", loesung: ["20"], platzhalter: "Zahl", erklaerung: "3 + 8 + 6 + 3 = 20 Schüler." },
  { typ: "input", frage: "Bei einer Umfrage sagen 12 von 40 Personen „ja“. Wie viel Prozent sind das?", loesung: ["30"], einheit: "%", platzhalter: "Zahl", erklaerung: "12 : 40 = 0,3 = 30 %." },
  { typ: "input", frage: "Der kleinste Messwert ist 3, der größte 15. Wie groß ist die Spannweite?", loesung: ["12"], platzhalter: "Zahl", erklaerung: "Spannweite = größter Wert − kleinster Wert = 15 − 3 = 12." },
  {
    typ: "luecke",
    frage: "Vervollständige.",
    segmente: ["Der Mittelwert von 10 und 20 ist ", { luecke: ["15"] }, "."],
    erklaerung: "(10 + 20) : 2 = 30 : 2 = 15.",
  },
  {
    typ: "mc",
    frage: "Wie berechnet man den Mittelwert (Durchschnitt)?",
    antworten: ["Alle Werte addieren und durch die Anzahl der Werte teilen", "Den größten Wert nehmen", "Immer durch 2 teilen", "Alle Werte multiplizieren"],
    richtig: 0,
    erklaerung: "Mittelwert = Summe aller Werte : Anzahl der Werte.",
  },
  { typ: "input", frage: "Gemessene Temperaturen: 18 °C, 20 °C, 22 °C, 20 °C. Wie groß ist der Mittelwert?", loesung: ["20"], einheit: "°C", platzhalter: "Zahl", erklaerung: "(18 + 20 + 22 + 20) : 4 = 80 : 4 = 20 °C." },
  { typ: "input", frage: "Von 50 Autos sind 10 rot. Wie viel Prozent sind rot?", loesung: ["20"], einheit: "%", platzhalter: "Zahl", erklaerung: "10 : 50 = 0,2 = 20 %." },
  {
    typ: "sortieren",
    frage: "Ordne die Messwerte der Größe nach (Rangliste) — beginne beim kleinsten.",
    richtig: ["3", "5", "7", "9"],
    erklaerung: "Der Größe nach geordnet: 3, 5, 7, 9.",
  },
  { typ: "input", frage: "Wie groß ist der Median (der mittlere Wert) von 3, 5 und 9?", loesung: ["5"], platzhalter: "Zahl", erklaerung: "Der Median ist der mittlere Wert der geordneten Reihe: 3, 5, 9 → 5." },
  { typ: "input", frage: "Vier Klassenarbeiten hatten die Noten 2, 3, 1 und 2. Wie groß ist der Notendurchschnitt?", loesung: ["2"], platzhalter: "Zahl", erklaerung: "(2 + 3 + 1 + 2) : 4 = 8 : 4 = 2." },
  { typ: "input", frage: "Bei 5 Spielen wurden 2, 4, 4, 6 und 4 Tore geschossen. Wie oft kam die Zahl 4 vor?", loesung: ["3"], platzhalter: "Zahl", erklaerung: "Die 4 kommt dreimal vor — das ist ihre absolute Häufigkeit." },
  {
    typ: "mc",
    frage: "Welches Diagramm zeigt am besten die Anteile eines Ganzen (z. B. Lieblingsfächer einer Klasse)?",
    antworten: ["Kreisdiagramm", "Liniendiagramm", "eine lange Tabelle", "kein Diagramm"],
    richtig: 0,
    erklaerung: "Ein Kreisdiagramm zeigt Anteile am Ganzen besonders anschaulich.",
  },
];

export default DATEN_GYM6;
