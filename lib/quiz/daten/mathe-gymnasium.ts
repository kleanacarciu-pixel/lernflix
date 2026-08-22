// ============================================================================
// Geprüfte Quiz-Fragen — Gymnasium · Mathematik · Bayern (LehrplanPLUS)
// ----------------------------------------------------------------------------
// Jede Frage ist von Hand erstellt und die Lösung selbst durchgerechnet.
// KEINE KI-Live-Generierung. Themen-Schlüssel = Thema OHNE Emoji-Präfix
// (siehe catalog.ts → themaOhneEmoji), damit Katalog und Store zusammenpassen.
//
// Format je Frage: { frage, antworten[4], richtig (Index 0..3), erklaerung }
// ============================================================================

import type { KlassenFragen } from "@/lib/quiz/catalog";

const GYMNASIUM_MATHE: KlassenFragen = {
  6: {
    // ---------------------------------------------------------------------
    "Bruchrechnen": [
      { frage: "Kürze den Bruch 8/12 vollständig.", antworten: ["2/3", "4/6", "3/4", "2/4"], richtig: 0, erklaerung: "8 und 12 durch 4 teilen: 8:4 = 2, 12:4 = 3. Also 2/3." },
      { frage: "Erweitere 3/4 auf den Nenner 20.", antworten: ["12/20", "15/20", "7/20", "3/20"], richtig: 1, erklaerung: "20 : 4 = 5, also Zähler und Nenner mal 5: 3·5/4·5 = 15/20." },
      { frage: "Welcher Bruch ist größer: 3/5 oder 2/3?", antworten: ["3/5", "2/3", "Sie sind gleich groß", "Nicht vergleichbar"], richtig: 1, erklaerung: "Gleichnamig machen: 3/5 = 9/15 und 2/3 = 10/15. 10/15 ist größer, also 2/3." },
      { frage: "Berechne 1/4 + 2/4.", antworten: ["3/8", "3/4", "2/8", "1/2"], richtig: 1, erklaerung: "Gleicher Nenner: nur die Zähler addieren: 1+2 = 3, also 3/4." },
      { frage: "Berechne 1/3 + 1/6.", antworten: ["1/2", "2/9", "1/9", "2/3"], richtig: 0, erklaerung: "1/3 = 2/6. Dann 2/6 + 1/6 = 3/6 = 1/2." },
      { frage: "Berechne 5/6 − 1/3.", antworten: ["2/3", "1/2", "1/3", "4/9"], richtig: 1, erklaerung: "1/3 = 2/6. Dann 5/6 − 2/6 = 3/6 = 1/2." },
      { frage: "Berechne 2/3 · 3/4.", antworten: ["1/2", "6/7", "5/12", "2/7"], richtig: 0, erklaerung: "Zähler mal Zähler, Nenner mal Nenner: 2·3/3·4 = 6/12 = 1/2." },
      { frage: "Berechne 3/4 : 1/2.", antworten: ["1 1/2", "3/8", "2/3", "3/4"], richtig: 0, erklaerung: "Durch einen Bruch teilen = mit dem Kehrwert malnehmen: 3/4 · 2/1 = 6/4 = 1 1/2." },
      { frage: "Wandle 7/4 in eine gemischte Zahl um.", antworten: ["1 3/4", "1 1/4", "2 1/4", "3 1/4"], richtig: 0, erklaerung: "7 : 4 = 1 Rest 3, also 1 3/4." },
      { frage: "Wandle die gemischte Zahl 2 1/3 in einen unechten Bruch um.", antworten: ["7/3", "6/3", "5/3", "3/7"], richtig: 0, erklaerung: "2 · 3 = 6, plus 1 = 7, Nenner bleibt 3: 7/3." },
      { frage: "Wie viel sind 3/4 von 20 €?", antworten: ["15 €", "5 €", "12 €", "16 €"], richtig: 0, erklaerung: "20 : 4 = 5 (das ist 1/4), mal 3 = 15 €." },
      { frage: "Welcher Bruch entspricht der Dezimalzahl 0,25?", antworten: ["1/4", "1/25", "25/10", "1/5"], richtig: 0, erklaerung: "0,25 = 25/100 = 1/4." },
      { frage: "Berechne 1/2 von 1/4.", antworten: ["1/8", "1/6", "2/6", "1/2"], richtig: 0, erklaerung: "„von“ bedeutet malnehmen: 1/2 · 1/4 = 1/8." },
      { frage: "Ein Kuchen wird in 8 gleiche Stücke geteilt. Anna isst 3 Stücke. Welcher Bruch des Kuchens ist gegessen?", antworten: ["3/8", "5/8", "3/5", "8/3"], richtig: 0, erklaerung: "3 von 8 Stücken sind gegessen: 3/8." },
      { frage: "Kürze den Bruch 15/25 vollständig.", antworten: ["3/5", "5/3", "1/5", "3/25"], richtig: 0, erklaerung: "15 und 25 durch 5 teilen: 15:5 = 3, 25:5 = 5. Also 3/5." },
    ],
    // ---------------------------------------------------------------------
    "Dezimalbrüche": [
      { frage: "Berechne 0,3 + 0,45.", antworten: ["0,75", "0,48", "0,075", "7,5"], richtig: 0, erklaerung: "Komma unter Komma: 0,30 + 0,45 = 0,75." },
      { frage: "Berechne 1,2 − 0,35.", antworten: ["0,95", "0,87", "1,15", "0,85"], richtig: 3, erklaerung: "1,20 − 0,35 = 0,85." },
      { frage: "Berechne 0,4 · 0,2.", antworten: ["0,08", "0,8", "0,6", "0,006"], richtig: 0, erklaerung: "4 · 2 = 8, zwei Nachkommastellen zusammen: 0,08." },
      { frage: "Berechne 0,6 · 10.", antworten: ["6", "0,06", "60", "0,6"], richtig: 0, erklaerung: "Mal 10 verschiebt das Komma um eine Stelle nach rechts: 6." },
      { frage: "Berechne 3,5 : 10.", antworten: ["0,35", "35", "0,035", "3,05"], richtig: 0, erklaerung: "Geteilt durch 10 verschiebt das Komma um eine Stelle nach links: 0,35." },
      { frage: "Berechne 2,5 · 4.", antworten: ["10", "8", "10,5", "100"], richtig: 0, erklaerung: "2,5 · 4 = 10." },
      { frage: "Schreibe 0,75 als vollständig gekürzten Bruch.", antworten: ["3/4", "7/5", "75/10", "1/4"], richtig: 0, erklaerung: "0,75 = 75/100 = 3/4." },
      { frage: "Welche Zahl ist größer: 0,7 oder 0,65?", antworten: ["0,7", "0,65", "Sie sind gleich", "0,65 ist größer"], richtig: 0, erklaerung: "0,7 = 0,70. Und 0,70 > 0,65." },
      { frage: "Runde 3,847 auf zwei Nachkommastellen.", antworten: ["3,85", "3,84", "3,90", "3,80"], richtig: 0, erklaerung: "Die dritte Stelle ist 7 (≥ 5), also wird aufgerundet: 3,85." },
      { frage: "Schreibe 1/5 als Dezimalzahl.", antworten: ["0,2", "0,15", "0,5", "0,25"], richtig: 0, erklaerung: "1 : 5 = 0,2 (oder 1/5 = 2/10 = 0,2)." },
      { frage: "Schreibe 0,125 als vollständig gekürzten Bruch.", antworten: ["1/8", "1/4", "125/10", "1/12"], richtig: 0, erklaerung: "0,125 = 125/1000 = 1/8." },
      { frage: "Berechne 4,2 + 3,08.", antworten: ["7,28", "7,10", "4,50", "7,82"], richtig: 0, erklaerung: "4,20 + 3,08 = 7,28." },
      { frage: "Berechne 6 − 0,25.", antworten: ["5,75", "5,25", "6,25", "5,80"], richtig: 0, erklaerung: "6,00 − 0,25 = 5,75." },
      { frage: "Berechne 0,9 · 100.", antworten: ["90", "9", "900", "0,9"], richtig: 0, erklaerung: "Mal 100 verschiebt das Komma um zwei Stellen nach rechts: 90." },
      { frage: "Ein Stift kostet 0,80 €. Was kosten 5 Stifte?", antworten: ["4,00 €", "0,40 €", "40,00 €", "5,80 €"], richtig: 0, erklaerung: "0,80 € · 5 = 4,00 €." },
    ],
    // ---------------------------------------------------------------------
    "Prozent — Grundlagen": [
      { frage: "Berechne 50 % von 80.", antworten: ["40", "30", "50", "160"], richtig: 0, erklaerung: "50 % ist die Hälfte: 80 : 2 = 40." },
      { frage: "Berechne 25 % von 200.", antworten: ["50", "25", "75", "100"], richtig: 0, erklaerung: "25 % ist ein Viertel: 200 : 4 = 50." },
      { frage: "Berechne 10 % von 250.", antworten: ["25", "10", "2,5", "250"], richtig: 0, erklaerung: "10 % ist ein Zehntel: 250 : 10 = 25." },
      { frage: "Wie schreibt man 1/2 in Prozent?", antworten: ["50 %", "12 %", "25 %", "20 %"], richtig: 0, erklaerung: "1/2 = 50/100 = 50 %." },
      { frage: "Schreibe 0,2 als Prozent.", antworten: ["20 %", "2 %", "200 %", "0,2 %"], richtig: 0, erklaerung: "0,2 = 20/100 = 20 %." },
      { frage: "Berechne 20 % von 50.", antworten: ["10", "20", "25", "30"], richtig: 0, erklaerung: "10 % von 50 sind 5, also 20 % sind 10." },
      { frage: "Welcher Anteil sind 30 von 100?", antworten: ["30 %", "3 %", "70 %", "300 %"], richtig: 0, erklaerung: "30 von 100 = 30/100 = 30 %." },
      { frage: "Berechne 100 % von 45.", antworten: ["45", "90", "0", "100"], richtig: 0, erklaerung: "100 % ist das Ganze, also 45." },
      { frage: "Berechne 75 % von 40.", antworten: ["30", "25", "35", "15"], richtig: 0, erklaerung: "25 % von 40 sind 10, also 75 % sind 3 · 10 = 30." },
      { frage: "Berechne 1 % von 700.", antworten: ["7", "70", "0,7", "1"], richtig: 0, erklaerung: "1 % ist ein Hundertstel: 700 : 100 = 7." },
      { frage: "Wie viel Prozent sind 1/4?", antworten: ["25 %", "14 %", "40 %", "4 %"], richtig: 0, erklaerung: "1/4 = 25/100 = 25 %." },
      { frage: "Berechne 5 % von 300.", antworten: ["15", "5", "60", "150"], richtig: 0, erklaerung: "1 % von 300 sind 3, also 5 % sind 15." },
      { frage: "In einer Klasse mit 20 Kindern sind 10 Mädchen. Wie viel Prozent sind Mädchen?", antworten: ["50 %", "10 %", "20 %", "40 %"], richtig: 0, erklaerung: "10 von 20 = die Hälfte = 50 %." },
      { frage: "Berechne 40 % von 25.", antworten: ["10", "15", "40", "12,5"], richtig: 0, erklaerung: "10 % von 25 sind 2,5, also 40 % sind 4 · 2,5 = 10." },
      { frage: "Schreibe 3/10 in Prozent.", antworten: ["30 %", "3 %", "13 %", "300 %"], richtig: 0, erklaerung: "3/10 = 30/100 = 30 %." },
    ],
    // ---------------------------------------------------------------------
    "Teilbarkeit & Primfaktoren": [
      { frage: "Welche dieser Zahlen ist eine Primzahl?", antworten: ["17", "15", "21", "9"], richtig: 0, erklaerung: "17 hat nur die Teiler 1 und 17. 15 = 3·5, 21 = 3·7, 9 = 3·3." },
      { frage: "Welche dieser Zahlen ist KEINE Primzahl?", antworten: ["9", "2", "7", "13"], richtig: 0, erklaerung: "9 = 3 · 3 ist zerlegbar. 2, 7 und 13 sind Primzahlen." },
      { frage: "Durch welche dieser Zahlen ist 45 teilbar?", antworten: ["9", "4", "7", "8"], richtig: 0, erklaerung: "45 = 9 · 5. Durch 4, 7 und 8 ist 45 nicht ohne Rest teilbar." },
      { frage: "Was ist der größte gemeinsame Teiler (ggT) von 12 und 18?", antworten: ["6", "3", "12", "36"], richtig: 0, erklaerung: "Teiler von 12: 1,2,3,4,6,12; von 18: 1,2,3,6,9,18. Größter gemeinsamer: 6." },
      { frage: "Was ist das kleinste gemeinsame Vielfache (kgV) von 4 und 6?", antworten: ["12", "24", "6", "10"], richtig: 0, erklaerung: "Vielfache von 4: 4,8,12; von 6: 6,12. Kleinstes gemeinsames: 12." },
      { frage: "Wie lautet die Primfaktorzerlegung von 12?", antworten: ["2 · 2 · 3", "2 · 3 · 3", "2 · 6", "3 · 4"], richtig: 0, erklaerung: "12 = 2 · 6 = 2 · 2 · 3. Nur 2 und 3 sind Primzahlen." },
      { frage: "Wie lautet die Primfaktorzerlegung von 30?", antworten: ["2 · 3 · 5", "2 · 15", "5 · 6", "3 · 10"], richtig: 0, erklaerung: "30 = 2 · 15 = 2 · 3 · 5, alles Primzahlen." },
      { frage: "Welche dieser Zahlen ist durch 3 teilbar?", antworten: ["24", "25", "26", "28"], richtig: 0, erklaerung: "Quersumme von 24 ist 2+4 = 6, und 6 ist durch 3 teilbar." },
      { frage: "Welche dieser Zahlen ist durch 9 teilbar?", antworten: ["54", "44", "46", "51"], richtig: 0, erklaerung: "Quersumme von 54 ist 5+4 = 9, durch 9 teilbar. Bei 51 ist die Quersumme 6." },
      { frage: "Ist 91 eine Primzahl?", antworten: ["Nein (7 · 13)", "Ja", "Nein (9 · 10)", "Nein (3 · 27)"], richtig: 0, erklaerung: "91 = 7 · 13, also keine Primzahl." },
      { frage: "Wie viele Teiler hat die Zahl 6?", antworten: ["4", "2", "3", "6"], richtig: 0, erklaerung: "Die Teiler sind 1, 2, 3 und 6 — das sind 4 Teiler." },
      { frage: "Welche Zahl ist sowohl durch 5 als auch durch 2 teilbar?", antworten: ["30", "25", "12", "15"], richtig: 0, erklaerung: "Durch 5 und 2 teilbar heißt durch 10 teilbar. 30 : 10 = 3." },
      { frage: "Was ist der ggT von 8 und 20?", antworten: ["4", "2", "8", "40"], richtig: 0, erklaerung: "Gemeinsame Teiler von 8 und 20 sind 1, 2, 4. Der größte ist 4." },
      { frage: "Was ist das kgV von 3 und 5?", antworten: ["15", "8", "30", "5"], richtig: 0, erklaerung: "3 und 5 haben keinen gemeinsamen Teiler, also kgV = 3 · 5 = 15." },
      { frage: "Welche Zahl zwischen 20 und 30 ist eine Primzahl?", antworten: ["23", "21", "25", "27"], richtig: 0, erklaerung: "23 ist nur durch 1 und 23 teilbar. 21 = 3·7, 25 = 5·5, 27 = 3·9." },
    ],
    // ---------------------------------------------------------------------
    "Ganze Zahlen (negativ)": [
      { frage: "Berechne (−3) + 5.", antworten: ["2", "−2", "8", "−8"], richtig: 0, erklaerung: "Von −3 um 5 nach oben: −3, −2, −1, 0, 1, 2. Ergebnis 2." },
      { frage: "Berechne 4 + (−7).", antworten: ["−3", "3", "11", "−11"], richtig: 0, erklaerung: "4 − 7 = −3." },
      { frage: "Berechne (−6) + (−2).", antworten: ["−8", "8", "−4", "4"], richtig: 0, erklaerung: "Zwei negative Zahlen: Beträge addieren, Minus bleibt: −8." },
      { frage: "Berechne 3 − 8.", antworten: ["−5", "5", "−11", "11"], richtig: 0, erklaerung: "3 − 8 = −5 (5 unter 0)." },
      { frage: "Berechne (−5) − 3.", antworten: ["−8", "−2", "2", "8"], richtig: 0, erklaerung: "Von −5 noch 3 abziehen: −8." },
      { frage: "Berechne (−4) − (−9).", antworten: ["5", "−5", "−13", "13"], richtig: 0, erklaerung: "Minus ein Minus wird plus: −4 + 9 = 5." },
      { frage: "Welche Zahl ist kleiner: −7 oder −3?", antworten: ["−7", "−3", "Sie sind gleich", "0"], richtig: 0, erklaerung: "Auf der Zahlengeraden liegt −7 weiter links, also ist −7 kleiner." },
      { frage: "Wie groß ist der Betrag von −12?", antworten: ["12", "−12", "0", "1"], richtig: 0, erklaerung: "Der Betrag ist der Abstand zur 0, immer positiv: 12." },
      { frage: "Welche dieser Zahlen ist die größte: −2, −10, 3, 0?", antworten: ["3", "0", "−2", "−10"], richtig: 0, erklaerung: "Positive Zahlen sind größer als 0 und alle negativen: 3 ist am größten." },
      { frage: "Die Temperatur steigt von −5 °C um 8 °C. Wie warm ist es dann?", antworten: ["3 °C", "−3 °C", "13 °C", "−13 °C"], richtig: 0, erklaerung: "−5 + 8 = 3 °C." },
      { frage: "Berechne 0 − 6.", antworten: ["−6", "6", "0", "−1"], richtig: 0, erklaerung: "0 − 6 = −6." },
      { frage: "Ein Taucher ist auf −12 m und taucht 5 m tiefer. Auf welcher Höhe ist er?", antworten: ["−17 m", "−7 m", "17 m", "−60 m"], richtig: 0, erklaerung: "Tiefer heißt kleiner: −12 − 5 = −17 m." },
      { frage: "Berechne (−8) + 8.", antworten: ["0", "−16", "16", "8"], richtig: 0, erklaerung: "Eine Zahl plus ihre Gegenzahl ergibt 0." },
      { frage: "Welche Zahl liegt zwischen −4 und −2?", antworten: ["−3", "−5", "−1", "0"], richtig: 0, erklaerung: "Auf der Zahlengeraden liegt −3 zwischen −4 und −2." },
      { frage: "Berechne 5 + (−2) + (−4).", antworten: ["−1", "1", "3", "−11"], richtig: 0, erklaerung: "5 − 2 = 3, dann 3 − 4 = −1." },
    ],
  },
};

export default GYMNASIUM_MATHE;
