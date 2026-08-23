// ============================================================================
// Interaktive Aufgaben — Wachstum & Zerfall · Gymnasium Kl. 10 · Bayern
// Exponentielles Wachstum/Abnahme, Wachstumsfaktor, Halbwertszeit.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const WACHSTUM_GYM10: Aufgabe[] = [
  { typ: "input", frage: "Ein Kapital von 100 € wächst pro Jahr um 10 %. Wie viel ist es nach 1 Jahr?", loesung: ["110"], einheit: "€", platzhalter: "Zahl", erklaerung: "100 € · 1,1 = 110 €." },
  { typ: "input", frage: "100 € wachsen pro Jahr um 10 %. Wie viel sind es nach 2 Jahren?", loesung: ["121"], einheit: "€", platzhalter: "Zahl", erklaerung: "100 · 1,1 · 1,1 = 100 · 1,21 = 121 €." },
  { typ: "input", frage: "200 € wachsen um 5 % pro Jahr. Wie viel nach 1 Jahr?", loesung: ["210"], einheit: "€", platzhalter: "Zahl", erklaerung: "200 · 1,05 = 210 €." },
  { typ: "input", frage: "Eine Bakterienkultur verdoppelt sich stündlich. Start: 100 Bakterien. Wie viele nach 3 Stunden?", loesung: ["800"], platzhalter: "Zahl", erklaerung: "100 · 2³ = 100 · 8 = 800." },
  { typ: "input", frage: "Start 100, verdoppelt sich stündlich. Wie viele nach 1 Stunde?", loesung: ["200"], platzhalter: "Zahl", erklaerung: "100 · 2 = 200." },
  {
    typ: "mc",
    frage: "Beim exponentiellen Wachstum wird pro Schritt …",
    antworten: ["mit demselben Faktor multipliziert", "immer dieselbe Zahl addiert", "immer dieselbe Zahl subtrahiert", "durch 2 geteilt"],
    richtig: 0,
    erklaerung: "Exponentielles Wachstum bedeutet: In jedem Schritt wird mit demselben Faktor multipliziert.",
  },
  { typ: "input", frage: "1000 € nehmen jährlich um 10 % ab. Wie viel nach 1 Jahr?", loesung: ["900"], einheit: "€", platzhalter: "Zahl", erklaerung: "1000 · 0,9 = 900 €." },
  { typ: "input", frage: "1000 € nehmen jährlich um 10 % ab. Wie viel nach 2 Jahren?", loesung: ["810"], einheit: "€", platzhalter: "Zahl", erklaerung: "1000 · 0,9 · 0,9 = 1000 · 0,81 = 810 €." },
  { typ: "input", frage: "Wie groß ist der Wachstumsfaktor bei einer Zunahme um 20 %?", loesung: ["1,2"], platzhalter: "z. B. 1,2", erklaerung: "+20 % → Faktor 1 + 0,2 = 1,2." },
  { typ: "input", frage: "Wie groß ist der Faktor bei einer Abnahme um 20 %?", loesung: ["0,8"], platzhalter: "z. B. 0,8", erklaerung: "−20 % → Faktor 1 − 0,2 = 0,8." },
  {
    typ: "luecke",
    frage: "Bestimme die Wachstumsfaktoren.",
    segmente: ["+10 % ergibt den Faktor ", { luecke: ["1,1"] }, ", −10 % ergibt den Faktor ", { luecke: ["0,9"] }, "."],
    erklaerung: "1 + 0,1 = 1,1 und 1 − 0,1 = 0,9.",
  },
  { typ: "input", frage: "Eine Zellzahl verdreifacht sich täglich. Start: 2. Wie viele nach 2 Tagen?", loesung: ["18"], platzhalter: "Zahl", erklaerung: "2 · 3² = 2 · 9 = 18." },
  {
    typ: "mc",
    frage: "„Halbwertszeit“ bedeutet, dass die Menge in dieser Zeit …",
    antworten: ["sich halbiert", "sich verdoppelt", "gleich bleibt", "null wird"],
    richtig: 0,
    erklaerung: "Nach einer Halbwertszeit ist nur noch die Hälfte übrig.",
  },
  { typ: "input", frage: "80 g eines Stoffes, Halbwertszeit 1 Tag. Wie viel ist nach 2 Tagen übrig?", loesung: ["20"], einheit: "g", platzhalter: "Zahl", erklaerung: "Nach 1 Tag 40 g, nach 2 Tagen 20 g (jeweils halbiert)." },
  { typ: "input", frage: "100 € wachsen um 100 % pro Jahr. Wie viel nach 1 Jahr?", loesung: ["200"], einheit: "€", platzhalter: "Zahl", erklaerung: "+100 % = Verdopplung: 100 · 2 = 200 €." },
];

export default WACHSTUM_GYM10;
