// ============================================================================
// Interaktive Aufgaben — Daten & Diagramme · Hauptschule Kl. 9 · Bayern
// Tabellen und Diagramme lesen, Mittelwert, häufigster Wert, Spannweite.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const DATEN_HS9: Aufgabe[] = [
  { typ: "input", frage: "Berechne den Mittelwert der Zahlen 3, 5, 7.", loesung: ["5"], platzhalter: "Zahl", erklaerung: "(3 + 5 + 7) : 3 = 15 : 3 = 5." },
  { typ: "input", frage: "Berechne den Mittelwert der Zahlen 10, 20, 30, 40.", loesung: ["25"], platzhalter: "Zahl", erklaerung: "(10 + 20 + 30 + 40) : 4 = 100 : 4 = 25." },
  { typ: "input", frage: "Lara hat die Noten 2, 4, 3, 3. Berechne ihren Notendurchschnitt.", loesung: ["3"], platzhalter: "Zahl", erklaerung: "(2 + 4 + 3 + 3) : 4 = 12 : 4 = 3." },
  { typ: "input", frage: "Welcher Wert kommt in der Reihe 4, 7, 4, 9, 4, 2 am häufigsten vor?", loesung: ["4"], platzhalter: "Zahl", erklaerung: "Die 4 kommt dreimal vor — öfter als jeder andere Wert." },
  { typ: "input", frage: "Bestimme die Spannweite der Zahlen 5, 12, 8, 20.", loesung: ["15"], platzhalter: "Zahl", erklaerung: "Größter − kleinster Wert: 20 − 5 = 15." },
  {
    typ: "mc",
    frage: "Wie berechnet man den Mittelwert (Durchschnitt)?",
    antworten: ["Alle Werte addieren und durch die Anzahl teilen", "Den größten Wert nehmen", "Den mittleren Wert der Liste nehmen, ohne zu ordnen", "Alle Werte malnehmen"],
    richtig: 0,
    erklaerung: "Mittelwert = Summe aller Werte : Anzahl der Werte.",
  },
  {
    typ: "mc",
    frage: "Ein Säulendiagramm zeigt die Lieblingssportarten: Fußball 12, Basketball 7, Schwimmen 5, Tanzen 6. Was ist am beliebtesten?",
    antworten: ["Fußball", "Basketball", "Schwimmen", "Tanzen"],
    richtig: 0,
    erklaerung: "12 ist die höchste Säule.",
  },
  { typ: "input", frage: "Fußball 12, Basketball 7, Schwimmen 5, Tanzen 6 Stimmen. Wie viele Schüler wurden befragt?", loesung: ["30"], platzhalter: "Zahl", erklaerung: "12 + 7 + 5 + 6 = 30." },
  { typ: "input", frage: "Von 30 Befragten wählten 12 Fußball. Wie viel Prozent sind das?", loesung: ["40"], einheit: "%", platzhalter: "Zahl", erklaerung: "12/30 = 4/10 = 40 %." },
  {
    typ: "luecke",
    frage: "Temperaturen einer Woche: 12, 14, 16, 14, 14 °C (5 Tage).",
    segmente: ["Mittelwert: ", { luecke: ["14"] }, " °C, häufigster Wert: ", { luecke: ["14"] }, " °C."],
    erklaerung: "Summe 70 : 5 = 14 °C. Die 14 kommt dreimal vor.",
  },
  {
    typ: "zuordnen",
    frage: "Datenreihe: 2, 6, 6, 10. Ordne jeder Kenngröße ihren Wert zu.",
    paare: [
      { links: "Mittelwert", rechts: "6" },
      { links: "häufigster Wert", rechts: "6 (zweimal)" },
      { links: "Spannweite", rechts: "8" },
      { links: "Anzahl der Werte", rechts: "4" },
    ],
    erklaerung: "24 : 4 = 6. Die 6 kommt zweimal vor. 10 − 2 = 8. Es sind 4 Werte.",
  },
  {
    typ: "mc",
    frage: "Welches Diagramm zeigt am besten, wie sich die Temperatur über einen Tag verändert?",
    antworten: ["ein Liniendiagramm", "ein Kreisdiagramm", "eine einzelne Zahl", "eine Tabelle ohne Zeiten"],
    richtig: 0,
    erklaerung: "Ein Liniendiagramm zeigt den Verlauf über die Zeit.",
  },
  { typ: "input", frage: "In vier Spielen schießt eine Mannschaft 1, 3, 0 und 4 Tore. Berechne den Mittelwert.", loesung: ["2"], platzhalter: "Zahl", erklaerung: "(1 + 3 + 0 + 4) : 4 = 8 : 4 = 2 Tore." },
  { typ: "input", frage: "Der Mittelwert von zwei Zahlen ist 10. Eine Zahl ist 6. Wie heißt die andere?", loesung: ["14"], platzhalter: "Zahl", erklaerung: "Summe = 2 · 10 = 20. Andere Zahl: 20 − 6 = 14." },
  {
    typ: "sortieren",
    frage: "Taschengeld pro Monat: Ali 20 €, Ben 35 €, Cem 15 €, Deniz 25 €. Ordne aufsteigend — beginne beim wenigsten.",
    richtig: ["Cem 15 €", "Ali 20 €", "Deniz 25 €", "Ben 35 €"],
    erklaerung: "15 € < 20 € < 25 € < 35 €.",
  },
];

export default DATEN_HS9;
