// ============================================================================
// Geprüfte Quiz-Fragen — Gymnasium · Mathematik · Bayern (LehrplanPLUS)
// ----------------------------------------------------------------------------
// Anspruch: Schulbuch-Niveau (z. B. Lambacher Schweizer, delta). Wer alle
// Aufgaben eines Themas richtig löst, hat das Thema wirklich verstanden —
// deshalb decken die ~18 Fragen je Thema die gesamte Bandbreite ab
// (Grundlagen → mehrschrittig → Text-/Umkehraufgaben). Falsche Antworten sind
// bewusst typische Schülerfehler.
//
// Jede Lösung ist von Hand durchgerechnet. KEINE KI-Live-Generierung.
// Die Antwort-Reihenfolge wird beim Ausliefern serverseitig gemischt, deshalb
// steht hier die richtige Antwort der Übersicht halber an erster Stelle
// (richtig: 0). Themen-Schlüssel = Thema OHNE Emoji-Präfix (siehe catalog.ts).
// ============================================================================

import type { KlassenFragen } from "@/lib/quiz/catalog";

const GYMNASIUM_MATHE: KlassenFragen = {
  6: {
    // =====================================================================
    "Bruchrechnen": [
      { frage: "Berechne 2/3 + 1/4.", antworten: ["11/12", "3/7", "3/12", "2/7"], richtig: 0, erklaerung: "Hauptnenner ist 12: 2/3 = 8/12 und 1/4 = 3/12. Dann 8/12 + 3/12 = 11/12." },
      { frage: "Berechne 5/6 − 3/8.", antworten: ["11/24", "1", "2/24", "7/24"], richtig: 0, erklaerung: "Hauptnenner 24: 5/6 = 20/24, 3/8 = 9/24. 20/24 − 9/24 = 11/24. (Nicht die Zähler und Nenner getrennt abziehen!)" },
      { frage: "Berechne 1 1/2 · 2/3.", antworten: ["1", "1 1/3", "2 1/2", "3/5"], richtig: 0, erklaerung: "Gemischte Zahl in Bruch: 1 1/2 = 3/2. Dann 3/2 · 2/3 = 6/6 = 1." },
      { frage: "Berechne 5/8 : 5/6.", antworten: ["3/4", "25/48", "1", "6/5"], richtig: 0, erklaerung: "Durch einen Bruch teilen = mit dem Kehrwert malnehmen: 5/8 · 6/5 = 30/40 = 3/4." },
      { frage: "Wie viele Minuten sind 3/4 einer Stunde?", antworten: ["45 min", "34 min", "30 min", "75 min"], richtig: 0, erklaerung: "Eine Stunde hat 60 min. 60 : 4 = 15 (das ist 1/4), mal 3 = 45 min." },
      { frage: "5/8 von 2 kg sind wie viele Gramm?", antworten: ["1250 g", "625 g", "1600 g", "400 g"], richtig: 0, erklaerung: "2 kg = 2000 g. 2000 : 8 = 250, mal 5 = 1250 g." },
      { frage: "Von einem Kuchen isst Tim 1/3, Lisa isst 1/4. Welcher Bruchteil bleibt übrig?", antworten: ["5/12", "1/12", "7/12", "2/7"], richtig: 0, erklaerung: "Ganzes = 12/12. 12/12 − 4/12 − 3/12 = 5/12." },
      { frage: "Welcher dieser Brüche ist am größten: 2/3, 3/5, 7/10, 4/6?", antworten: ["7/10", "2/3", "4/6", "3/5"], richtig: 0, erklaerung: "Als Dezimalzahl: 2/3 ≈ 0,67; 3/5 = 0,6; 7/10 = 0,7; 4/6 = 0,67. Am größten ist 7/10. (2/3 und 4/6 sind gleich groß.)" },
      { frage: "Berechne 1/2 + 1/2 · 1/3.", antworten: ["2/3", "1/3", "1/6", "1/2"], richtig: 0, erklaerung: "Punkt vor Strich: zuerst 1/2 · 1/3 = 1/6, dann 1/2 + 1/6 = 3/6 + 1/6 = 4/6 = 2/3." },
      { frage: "3/4 der Klasse sind anwesend. Davon sind 2/3 Mädchen. Welcher Bruchteil der ganzen Klasse sind anwesende Mädchen?", antworten: ["1/2", "5/7", "2/4", "6/7"], richtig: 0, erklaerung: "„Von“ bedeutet malnehmen: 3/4 · 2/3 = 6/12 = 1/2." },
      { frage: "Kürze 24/36 vollständig.", antworten: ["2/3", "3/4", "5/6", "8/9"], richtig: 0, erklaerung: "ggT(24, 36) = 12. 24 : 12 = 2, 36 : 12 = 3, also 2/3." },
      { frage: "Berechne 2 1/4 − 3/4.", antworten: ["1 1/2", "1 1/4", "2", "1 3/4"], richtig: 0, erklaerung: "2 1/4 = 9/4. Dann 9/4 − 3/4 = 6/4 = 1 2/4 = 1 1/2." },
      { frage: "Schreibe 0,6 als vollständig gekürzten Bruch.", antworten: ["3/5", "6/10", "2/3", "1/6"], richtig: 0, erklaerung: "0,6 = 6/10. Mit 2 kürzen: 6/10 = 3/5. (6/10 ist noch nicht vollständig gekürzt.)" },
      { frage: "3/5 eines Geldbetrags sind 30 €. Wie groß ist der ganze Betrag?", antworten: ["50 €", "18 €", "90 €", "45 €"], richtig: 0, erklaerung: "3/5 sind 30 €, also 1/5 = 30 : 3 = 10 €. Das Ganze sind 5/5 = 5 · 10 = 50 €." },
      { frage: "Berechne 1 2/3 + 2 3/4.", antworten: ["4 5/12", "3 5/12", "4 1/12", "3 5/7"], richtig: 0, erklaerung: "Ganze: 1 + 2 = 3. Brüche: 2/3 + 3/4 = 8/12 + 9/12 = 17/12 = 1 5/12. Zusammen 3 + 1 5/12 = 4 5/12." },
      { frage: "Welche Aussage stimmt?", antworten: ["Beim Erweitern ändert sich der Wert des Bruchs nicht.", "Beim Erweitern wird der Bruch größer.", "1/2 ist kleiner als 1/3.", "Ein Bruch mit größerem Nenner ist immer größer."], richtig: 0, erklaerung: "Beim Erweitern multipliziert man Zähler und Nenner mit derselben Zahl — der Wert bleibt gleich, nur die Darstellung ändert sich." },
      { frage: "Welcher Term gehört zu „3/4 von 20“?", antworten: ["20 · 3/4", "20 : 3/4", "20 + 3/4", "20 − 3/4"], richtig: 0, erklaerung: "„Von“ bedeutet in der Bruchrechnung immer malnehmen: 20 · 3/4 = 15." },
      { frage: "Ordne von klein nach groß: 3/4, 2/3, 5/6.", antworten: ["2/3, 3/4, 5/6", "3/4, 2/3, 5/6", "5/6, 3/4, 2/3", "2/3, 5/6, 3/4"], richtig: 0, erklaerung: "Hauptnenner 12: 2/3 = 8/12, 3/4 = 9/12, 5/6 = 10/12. Also 2/3 < 3/4 < 5/6." },
    ],
    // =====================================================================
    "Dezimalbrüche": [
      { frage: "Welche Zahl ist am größten: 0,7; 0,68; 0,709; 0,71?", antworten: ["0,71", "0,709", "0,7", "0,68"], richtig: 0, erklaerung: "Stellenweise vergleichen: 0,710 > 0,709 > 0,700 > 0,680. Am größten ist 0,71." },
      { frage: "Berechne 1,5 · 0,4.", antworten: ["0,6", "6", "0,06", "60"], richtig: 0, erklaerung: "15 · 4 = 60. Zusammen zwei Nachkommastellen: 0,60 = 0,6." },
      { frage: "Berechne 4,8 : 0,6.", antworten: ["8", "0,8", "80", "0,08"], richtig: 0, erklaerung: "Beide Zahlen mal 10: 48 : 6 = 8." },
      { frage: "Schreibe 1/3 als Dezimalzahl.", antworten: ["0,333… (periodisch)", "0,3", "0,13", "3,0"], richtig: 0, erklaerung: "1 : 3 = 0,3333… Die 3 wiederholt sich unendlich, man schreibt 0,3 mit Periodenstrich." },
      { frage: "Schreibe 3/8 als Dezimalzahl.", antworten: ["0,375", "0,38", "0,83", "2,67"], richtig: 0, erklaerung: "3 : 8 = 0,375 (schriftlich dividiert)." },
      { frage: "Ein Kassenbon zeigt 12,347 €. Auf Cent (2 Stellen) gerundet sind das?", antworten: ["12,35 €", "12,34 €", "12,30 €", "12,40 €"], richtig: 0, erklaerung: "Die dritte Nachkommastelle ist 7 (≥ 5), also wird aufgerundet: 12,35 €." },
      { frage: "1 Liter Saft kostet 1,60 €. Was kosten 0,75 Liter?", antworten: ["1,20 €", "2,13 €", "0,85 €", "1,35 €"], richtig: 0, erklaerung: "1,60 € · 0,75 = 1,20 €." },
      { frage: "Berechne 5 − 2,375.", antworten: ["2,625", "3,375", "2,375", "3,625"], richtig: 0, erklaerung: "5,000 − 2,375 = 2,625." },
      { frage: "Berechne 34 · 0,1.", antworten: ["3,4", "34", "340", "0,34"], richtig: 0, erklaerung: "Mal 0,1 ist dasselbe wie geteilt durch 10: das Komma rückt eine Stelle nach links, also 3,4." },
      { frage: "Schreibe 0,35 als vollständig gekürzten Bruch.", antworten: ["7/20", "35/100", "1/3", "7/25"], richtig: 0, erklaerung: "0,35 = 35/100. Mit 5 kürzen: 35/100 = 7/20." },
      { frage: "Welche Zahl ist größer: 3/4 oder 0,7?", antworten: ["3/4", "0,7", "Sie sind gleich", "0,7 ist größer"], richtig: 0, erklaerung: "3/4 = 0,75, und 0,75 > 0,70." },
      { frage: "Wie groß ist der Mittelwert (Durchschnitt) von 2,4 und 3,0?", antworten: ["2,7", "5,4", "2,4", "3,0"], richtig: 0, erklaerung: "Mittelwert = (2,4 + 3,0) : 2 = 5,4 : 2 = 2,7." },
      { frage: "1,25 m sind wie viele Zentimeter?", antworten: ["125 cm", "12,5 cm", "1250 cm", "1,25 cm"], richtig: 0, erklaerung: "1 m = 100 cm, also 1,25 m = 1,25 · 100 cm = 125 cm." },
      { frage: "Berechne 2,5 + 1,5 · 2.", antworten: ["5,5", "8", "5,0", "7"], richtig: 0, erklaerung: "Punkt vor Strich: zuerst 1,5 · 2 = 3, dann 2,5 + 3 = 5,5." },
      { frage: "Berechne 3 : 4.", antworten: ["0,75", "1,33", "0,34", "7,5"], richtig: 0, erklaerung: "3 : 4 = 0,75 (denn 3/4 = 0,75)." },
      { frage: "Welcher Bruch ergibt eine periodische (nicht abbrechende) Dezimalzahl?", antworten: ["2/3", "1/4", "3/5", "7/8"], richtig: 0, erklaerung: "2/3 = 0,666… ist periodisch. 1/4 = 0,25; 3/5 = 0,6; 7/8 = 0,875 brechen ab (Nenner nur aus 2 und 5)." },
      { frage: "Du kaufst 3 Hefte zu je 1,45 € und zahlst mit 10 €. Wie viel bekommst du zurück?", antworten: ["5,65 €", "4,35 €", "5,55 €", "6,55 €"], richtig: 0, erklaerung: "3 · 1,45 € = 4,35 €. Rückgeld: 10,00 € − 4,35 € = 5,65 €." },
      { frage: "Welche Ziffer steht in 4,376 an der Hundertstelstelle?", antworten: ["7", "3", "6", "4"], richtig: 0, erklaerung: "Nach dem Komma: 3 = Zehntel, 7 = Hundertstel, 6 = Tausendstel. Die Hundertstelstelle ist die 7." },
    ],
    // =====================================================================
    "Prozent — Grundlagen": [
      { frage: "Berechne 30 % von 250.", antworten: ["75", "30", "83", "7,5"], richtig: 0, erklaerung: "30 % = 0,3. 250 · 0,3 = 75. (Oder: 10 % sind 25, mal 3 = 75.)" },
      { frage: "Wie viel Prozent sind 18 von 60?", antworten: ["30 %", "18 %", "42 %", "3,3 %"], richtig: 0, erklaerung: "18 : 60 = 0,3 = 30 %." },
      { frage: "12 % eines Betrags sind 60 €. Wie groß ist der ganze Betrag?", antworten: ["500 €", "72 €", "720 €", "50 €"], richtig: 0, erklaerung: "12 % sind 60 €, also 1 % = 5 €. Das Ganze (100 %) sind 100 · 5 = 500 €." },
      { frage: "Schreibe 0,08 als Prozent.", antworten: ["8 %", "80 %", "0,8 %", "0,08 %"], richtig: 0, erklaerung: "Mal 100: 0,08 = 8 %." },
      { frage: "Schreibe 3/8 in Prozent.", antworten: ["37,5 %", "38 %", "3,8 %", "24 %"], richtig: 0, erklaerung: "3/8 = 0,375 = 37,5 %." },
      { frage: "Eine Jacke kostet 80 € und wird um 25 % reduziert. Was ist der neue Preis?", antworten: ["60 €", "20 €", "55 €", "75 €"], richtig: 0, erklaerung: "25 % von 80 € sind 20 € Rabatt. Neuer Preis: 80 € − 20 € = 60 €." },
      { frage: "Ein Preis von 40 € steigt um 10 %. Neuer Preis?", antworten: ["44 €", "50 €", "36 €", "4 €"], richtig: 0, erklaerung: "10 % von 40 € sind 4 €. Neuer Preis: 40 € + 4 € = 44 €." },
      { frage: "In einer Klasse mit 25 Schülern sind 15 Jungen. Wie viel Prozent sind Jungen?", antworten: ["60 %", "40 %", "15 %", "66 %"], richtig: 0, erklaerung: "15 : 25 = 0,6 = 60 %." },
      { frage: "Berechne 5 % von 1200.", antworten: ["60", "240", "600", "6"], richtig: 0, erklaerung: "1 % von 1200 sind 12, also 5 % = 5 · 12 = 60." },
      { frage: "Schreibe 40 % als vollständig gekürzten Bruch.", antworten: ["2/5", "40/100", "4/10", "1/40"], richtig: 0, erklaerung: "40 % = 40/100. Vollständig kürzen: 40/100 = 2/5." },
      { frage: "Wie viel sind 19 % von 200 €?", antworten: ["38 €", "19 €", "380 €", "3,8 €"], richtig: 0, erklaerung: "1 % von 200 € sind 2 €, also 19 % = 19 · 2 = 38 €." },
      { frage: "Was ist mehr: 20 % von 50 oder 50 % von 20?", antworten: ["Sie sind gleich (beide 10)", "20 % von 50", "50 % von 20", "Das lässt sich nicht sagen"], richtig: 0, erklaerung: "20 % von 50 = 10 und 50 % von 20 = 10. Beim Prozentwert darf man vertauschen." },
      { frage: "Nach einer Erhöhung um 100 % kostet ein Artikel 30 €. Wie viel kostete er vorher?", antworten: ["15 €", "30 €", "60 €", "0 €"], richtig: 0, erklaerung: "Erhöhung um 100 % heißt Verdopplung. Der neue Preis (200 %) ist 30 €, der alte (100 %) also die Hälfte: 15 €." },
      { frage: "Schreibe 0,45 als Prozent.", antworten: ["45 %", "4,5 %", "450 %", "0,45 %"], richtig: 0, erklaerung: "Mal 100: 0,45 = 45 %." },
      { frage: "60 % der 30 Kinder einer Gruppe können schwimmen. Wie viele sind das?", antworten: ["18", "12", "20", "50"], richtig: 0, erklaerung: "60 % von 30 = 0,6 · 30 = 18 Kinder." },
      { frage: "Ein Test hat 40 Aufgaben, du hast 34 richtig. Wie viel Prozent sind das?", antworten: ["85 %", "34 %", "80 %", "88 %"], richtig: 0, erklaerung: "34 : 40 = 0,85 = 85 %." },
      { frage: "Ein Pullover kostet 50 €. Erst wird er um 20 % reduziert, dann noch einmal um 10 % auf den neuen Preis. Endpreis?", antworten: ["36 €", "35 €", "30 €", "40 €"], richtig: 0, erklaerung: "50 € − 20 % = 40 €. Davon 10 % = 4 €, also 40 € − 4 € = 36 €. (Nicht einfach 30 % auf einmal — das wären 35 €.)" },
      { frage: "Von 200 Schülern kommen 50 mit dem Fahrrad. Wie viel Prozent sind das?", antworten: ["25 %", "50 %", "20 %", "4 %"], richtig: 0, erklaerung: "50 : 200 = 0,25 = 25 %." },
    ],
    // =====================================================================
    "Teilbarkeit & Primfaktoren": [
      { frage: "Welche dieser Zahlen ist durch 6 teilbar?", antworten: ["342", "116", "214", "128"], richtig: 0, erklaerung: "Durch 6 teilbar heißt: durch 2 UND durch 3. 342 ist gerade und hat die Quersumme 9 (durch 3). 342 : 6 = 57." },
      { frage: "Welche dieser Zahlen ist durch 9 teilbar?", antworten: ["756", "742", "651", "843"], richtig: 0, erklaerung: "Regel: Quersumme durch 9 teilbar. 7+5+6 = 18, und 18 ist durch 9 teilbar. 756 : 9 = 84." },
      { frage: "Welche dieser Zahlen ist durch 4 teilbar?", antworten: ["1316", "1322", "1230", "1114"], richtig: 0, erklaerung: "Regel: die letzten zwei Ziffern müssen durch 4 teilbar sein. Bei 1316 ist das 16 = 4 · 4. 1316 : 4 = 329." },
      { frage: "Wie lautet die Primfaktorzerlegung von 84?", antworten: ["2 · 2 · 3 · 7", "2 · 3 · 14", "4 · 21", "2 · 2 · 21"], richtig: 0, erklaerung: "84 = 2 · 42 = 2 · 2 · 21 = 2 · 2 · 3 · 7. Nur Primzahlen dürfen im Ergebnis stehen." },
      { frage: "Bestimme den größten gemeinsamen Teiler (ggT) von 36 und 60.", antworten: ["12", "6", "180", "24"], richtig: 0, erklaerung: "36 = 2²·3², 60 = 2²·3·5. Gemeinsam: 2²·3 = 12." },
      { frage: "Bestimme das kleinste gemeinsame Vielfache (kgV) von 12 und 18.", antworten: ["36", "6", "216", "72"], richtig: 0, erklaerung: "12 = 2²·3, 18 = 2·3². kgV = 2²·3² = 36." },
      { frage: "Zwei Leuchttürme blinken alle 12 s bzw. alle 18 s. Nach wie vielen Sekunden blinken sie erstmals wieder gleichzeitig?", antworten: ["36 s", "6 s", "30 s", "216 s"], richtig: 0, erklaerung: "Gesucht ist das kgV von 12 und 18, und das ist 36. Nach 36 s blinken beide zusammen." },
      { frage: "Du hast 24 rote und 36 blaue Perlen und willst daraus möglichst viele gleiche Sträußchen ohne Rest machen. Wie viele Sträußchen sind das höchstens?", antworten: ["12", "6", "4", "60"], richtig: 0, erklaerung: "Gesucht ist der ggT von 24 und 36, also 12. Jedes Sträußchen bekommt 2 rote und 3 blaue Perlen." },
      { frage: "Welche dieser Zahlen ist eine Primzahl?", antworten: ["53", "51", "57", "91"], richtig: 0, erklaerung: "53 hat nur die Teiler 1 und 53. Dagegen 51 = 3·17, 57 = 3·19, 91 = 7·13." },
      { frage: "Wie viele Teiler hat die Zahl 24?", antworten: ["8", "6", "4", "24"], richtig: 0, erklaerung: "Die Teiler sind 1, 2, 3, 4, 6, 8, 12, 24 — das sind 8 Stück." },
      { frage: "Welche dieser Zahlen ist durch 25 teilbar?", antworten: ["175", "160", "120", "140"], richtig: 0, erklaerung: "Durch 25 teilbar sind Zahlen, die auf 00, 25, 50 oder 75 enden. 175 : 25 = 7." },
      { frage: "Welche Aussage über Primzahlen stimmt?", antworten: ["Eine Primzahl hat genau zwei Teiler.", "1 ist eine Primzahl.", "Alle Primzahlen sind ungerade.", "2 ist keine Primzahl."], richtig: 0, erklaerung: "Eine Primzahl hat genau zwei Teiler: 1 und sich selbst. 1 hat nur einen Teiler, und 2 ist die einzige gerade Primzahl." },
      { frage: "Welche Zahl ist ein gemeinsamer Teiler von 18 und 24?", antworten: ["6", "8", "9", "12"], richtig: 0, erklaerung: "Teiler von 18: 1,2,3,6,9,18; Teiler von 24: 1,2,3,4,6,8,12,24. Gemeinsam (außer 1,2,3) ist die 6." },
      { frage: "Was ist der größte Primfaktor von 90?", antworten: ["5", "3", "9", "45"], richtig: 0, erklaerung: "90 = 2 · 3 · 3 · 5. Der größte Primfaktor ist 5 (9 und 45 sind keine Primzahlen)." },
      { frage: "Welche Ziffer muss für ▢ stehen, damit 4▢2 durch 3 teilbar ist (kleinste Möglichkeit)?", antworten: ["0", "1", "2", "5"], richtig: 0, erklaerung: "Quersumme 4 + ▢ + 2 = 6 + ▢ muss durch 3 teilbar sein. Für ▢ = 0 ist die Summe 6 — die kleinste Lösung." },
      { frage: "Das kleinste gemeinsame Vielfache zweier teilerfremder Zahlen 7 und 8 ist?", antworten: ["56", "15", "1", "28"], richtig: 0, erklaerung: "Teilerfremd heißt ggT = 1. Dann ist das kgV einfach das Produkt: 7 · 8 = 56." },
      { frage: "Ein Boden von 48 cm × 36 cm soll mit gleich großen quadratischen Fliesen ohne Rest ausgelegt werden. Wie lang ist die größtmögliche Fliesenkante?", antworten: ["12 cm", "6 cm", "4 cm", "144 cm"], richtig: 0, erklaerung: "Die Kantenlänge muss 48 und 36 ohne Rest teilen — gesucht ist der ggT(48, 36) = 12 cm." },
      { frage: "Bestimme das kleinste gemeinsame Vielfache (kgV) von 4, 6 und 8.", antworten: ["24", "48", "12", "16"], richtig: 0, erklaerung: "4 = 2², 6 = 2·3, 8 = 2³. kgV = 2³·3 = 24." },
    ],
    // =====================================================================
    "Ganze Zahlen (negativ)": [
      { frage: "Berechne (−3) + 5.", antworten: ["2", "−2", "8", "−8"], richtig: 0, erklaerung: "Von −3 fünf Schritte nach oben: −3, −2, −1, 0, 1, 2. Ergebnis 2." },
      { frage: "Berechne 4 + (−7).", antworten: ["−3", "3", "11", "−11"], richtig: 0, erklaerung: "Plus eine negative Zahl heißt abziehen: 4 − 7 = −3." },
      { frage: "Berechne (−6) + (−9).", antworten: ["−15", "15", "−3", "3"], richtig: 0, erklaerung: "Zwei negative Zahlen: Beträge addieren (6 + 9 = 15), das Minus bleibt: −15." },
      { frage: "Berechne (−5) − 8.", antworten: ["−13", "−3", "3", "13"], richtig: 0, erklaerung: "Von −5 noch 8 abziehen führt weiter ins Minus: −5 − 8 = −13." },
      { frage: "Berechne (−4) − (−9).", antworten: ["5", "−5", "−13", "13"], richtig: 0, erklaerung: "Minus ein Minus wird plus: −4 − (−9) = −4 + 9 = 5." },
      { frage: "Berechne 3 − 10.", antworten: ["−7", "7", "−13", "13"], richtig: 0, erklaerung: "3 − 10 = −7 (7 unter null)." },
      { frage: "Welche Zahl ist die kleinste: −7, −3, −12, −1?", antworten: ["−12", "−1", "−3", "−7"], richtig: 0, erklaerung: "Je weiter links auf der Zahlengeraden, desto kleiner. −12 liegt am weitesten links." },
      { frage: "Wie groß ist der Betrag von −15?", antworten: ["15", "−15", "0", "1"], richtig: 0, erklaerung: "Der Betrag ist der Abstand zur 0 und immer positiv: |−15| = 15." },
      { frage: "Die Temperatur steigt von −8 °C um 11 °C. Wie warm ist es dann?", antworten: ["3 °C", "−3 °C", "19 °C", "−19 °C"], richtig: 0, erklaerung: "−8 + 11 = 3 °C." },
      { frage: "Nachts sind es −6 °C, tagsüber 4 °C. Um wie viel Grad steigt die Temperatur?", antworten: ["10 °C", "2 °C", "−2 °C", "−10 °C"], richtig: 0, erklaerung: "Unterschied: 4 − (−6) = 4 + 6 = 10 °C." },
      { frage: "Ein Taucher ist auf −12 m und taucht 5 m tiefer. Auf welcher Höhe ist er?", antworten: ["−17 m", "−7 m", "17 m", "−60 m"], richtig: 0, erklaerung: "Tiefer heißt kleiner: −12 − 5 = −17 m." },
      { frage: "Berechne (−8) + 8.", antworten: ["0", "−16", "16", "8"], richtig: 0, erklaerung: "Eine Zahl plus ihre Gegenzahl ergibt immer 0." },
      { frage: "Welche Zahl liegt genau zwischen −5 und −1?", antworten: ["−3", "−6", "−2", "0"], richtig: 0, erklaerung: "Mitte von −5 und −1: (−5 + (−1)) : 2 = −6 : 2 = −3." },
      { frage: "Berechne 5 + (−2) + (−6).", antworten: ["−3", "3", "13", "−13"], richtig: 0, erklaerung: "Der Reihe nach: 5 − 2 = 3, dann 3 − 6 = −3." },
      { frage: "Berechne (−7) + 3 − (−2).", antworten: ["−2", "−12", "2", "−8"], richtig: 0, erklaerung: "−7 + 3 = −4, dann −4 − (−2) = −4 + 2 = −2." },
      { frage: "Ein Konto steht bei −40 €. Es werden 25 € eingezahlt. Wie ist der neue Kontostand?", antworten: ["−15 €", "−65 €", "15 €", "65 €"], richtig: 0, erklaerung: "−40 + 25 = −15 €. Das Konto ist noch im Minus." },
      { frage: "Welche Rechnung ergibt eine positive Zahl?", antworten: ["(−2) − (−9)", "(−2) + (−9)", "2 − 9", "(−9) − 2"], richtig: 0, erklaerung: "(−2) − (−9) = −2 + 9 = 7 (positiv). Die anderen ergeben −11, −7 bzw. −11." },
      { frage: "Ordne von klein nach groß: 0, −4, 2, −1.", antworten: ["−4, −1, 0, 2", "−1, −4, 0, 2", "0, −1, −4, 2", "2, 0, −1, −4"], richtig: 0, erklaerung: "Auf der Zahlengeraden von links nach rechts: −4 < −1 < 0 < 2." },
    ],
  },
};

export default GYMNASIUM_MATHE;
