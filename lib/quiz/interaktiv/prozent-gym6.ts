// ============================================================================
// Interaktive Aufgaben — Prozent (Grundlagen) · Gymnasium Klasse 6 · Bayern
// Gemischte Typen, Lösungen von Hand geprüft.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const PROZENT_GYM6: Aufgabe[] = [
  { typ: "input", frage: "Berechne 30 % von 250.", loesung: ["75"], platzhalter: "Zahl", erklaerung: "30 % = 0,3. 250 · 0,3 = 75. (Oder: 10 % sind 25, mal 3 = 75.)" },
  { typ: "input", frage: "Wie viel Prozent sind 18 von 60?", loesung: ["30"], einheit: "%", platzhalter: "Zahl", erklaerung: "18 : 60 = 0,3 = 30 %." },
  { typ: "input", frage: "12 % eines Betrags sind 60 €. Wie groß ist der ganze Betrag?", loesung: ["500"], einheit: "€", platzhalter: "Zahl", hinweis: "Finde zuerst 1 % heraus.", erklaerung: "12 % sind 60 €, also 1 % = 5 €. Das Ganze (100 %) sind 500 €." },
  { typ: "input", frage: "Schreibe 0,08 als Prozent.", loesung: ["8"], einheit: "%", platzhalter: "Zahl", erklaerung: "Mal 100: 0,08 = 8 %." },
  { typ: "input", frage: "Schreibe 3/8 in Prozent.", loesung: ["37,5"], einheit: "%", platzhalter: "z. B. 37,5", erklaerung: "3/8 = 0,375 = 37,5 %." },
  { typ: "input", frage: "Eine Jacke kostet 80 € und wird um 25 % reduziert. Was ist der neue Preis?", loesung: ["60"], einheit: "€", platzhalter: "Zahl", erklaerung: "25 % von 80 € sind 20 €. Neuer Preis: 80 € − 20 € = 60 €." },
  { typ: "input", frage: "Ein Preis von 40 € steigt um 10 %. Wie hoch ist der neue Preis?", loesung: ["44"], einheit: "€", platzhalter: "Zahl", erklaerung: "10 % von 40 € sind 4 €. Neuer Preis: 44 €." },
  {
    typ: "zuordnen",
    frage: "Ordne jedem Wert den passenden Prozentsatz zu.",
    paare: [
      { links: "1/2", rechts: "50 %" },
      { links: "1/4", rechts: "25 %" },
      { links: "0,1", rechts: "10 %" },
      { links: "3/4", rechts: "75 %" },
    ],
    erklaerung: "1/2 = 50 %; 1/4 = 25 %; 0,1 = 10 %; 3/4 = 75 %.",
  },
  {
    typ: "luecke",
    frage: "Rechne mit dem 1-Prozent-Trick.",
    segmente: ["10 % von 250 sind ", { luecke: ["25"] }, " und 1 % von 250 sind ", { luecke: ["2,5"] }, "."],
    erklaerung: "10 % ist ein Zehntel: 250 : 10 = 25. 1 % ist ein Hundertstel: 250 : 100 = 2,5.",
  },
  { typ: "input", frage: "Schreibe 40 % als vollständig gekürzten Bruch.", loesung: ["2/5"], platzhalter: "z. B. 2/5", erklaerung: "40 % = 40/100 = 2/5." },
  { typ: "input", frage: "In einer Klasse mit 25 Schülern sind 15 Jungen. Wie viel Prozent sind Jungen?", loesung: ["60"], einheit: "%", platzhalter: "Zahl", erklaerung: "15 : 25 = 0,6 = 60 %." },
  { typ: "input", frage: "Berechne 5 % von 1200.", loesung: ["60"], platzhalter: "Zahl", erklaerung: "1 % von 1200 sind 12, also 5 % = 60." },
  {
    typ: "mc",
    frage: "Was ist mehr: 20 % von 50 oder 50 % von 20?",
    antworten: ["Sie sind gleich (beide 10)", "20 % von 50", "50 % von 20", "Das lässt sich nicht sagen"],
    richtig: 0,
    erklaerung: "20 % von 50 = 10 und 50 % von 20 = 10. Prozentsatz und Grundwert dürfen vertauscht werden: p % von G = G % von p.",
  },
  { typ: "input", frage: "Nach einer Erhöhung um 100 % kostet ein Artikel 30 €. Wie viel kostete er vorher?", loesung: ["15"], einheit: "€", platzhalter: "Zahl", erklaerung: "Erhöhung um 100 % = Verdopplung. Der neue Preis (200 %) ist 30 €, der alte (100 %) also 15 €." },
  { typ: "input", frage: "Ein Test hat 40 Aufgaben, du hast 34 richtig. Wie viel Prozent sind das?", loesung: ["85"], einheit: "%", platzhalter: "Zahl", erklaerung: "34 : 40 = 0,85 = 85 %." },
  { typ: "input", frage: "Ein Pullover kostet 50 €. Erst −20 %, dann noch einmal −10 % auf den neuen Preis. Endpreis?", loesung: ["36"], einheit: "€", platzhalter: "Zahl", hinweis: "Rechne in zwei Schritten – nicht 30 % auf einmal!", erklaerung: "50 € − 20 % = 40 €. Davon 10 % = 4 €, also 40 € − 4 € = 36 €." },
  {
    typ: "sortieren",
    frage: "Ordne der Größe nach — beginne beim kleinsten.",
    hinweis: "Tipp: Alles in Dezimalzahlen umrechnen.",
    richtig: ["20 %", "1/4", "0,3", "1/2"],
    erklaerung: "20 % = 0,2; 1/4 = 0,25; 0,3; 1/2 = 0,5. Also 20 % < 1/4 < 0,3 < 1/2.",
  },
  { typ: "input", frage: "Schreibe 0,45 als Prozent.", loesung: ["45"], einheit: "%", platzhalter: "Zahl", erklaerung: "Mal 100: 0,45 = 45 %." },
];

export default PROZENT_GYM6;
