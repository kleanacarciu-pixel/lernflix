// ============================================================================
// Interaktive Aufgaben — Exponentielles Wachstum · Realschule Kl. 10 · Bayern
// Wachstumsfaktor, Zu-/Abnahme, Verdopplung, Halbwertszeit.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const EXP_WACHSTUM_RS10: Aufgabe[] = [
  { typ: "input", frage: "100 € wachsen um 10 % pro Jahr. Wie viel sind es nach 1 Jahr?", loesung: ["110"], einheit: "€", platzhalter: "Zahl", erklaerung: "100 · 1,1 = 110 €." },
  { typ: "input", frage: "100 € wachsen um 10 % pro Jahr. Wie viel nach 2 Jahren?", loesung: ["121"], einheit: "€", platzhalter: "Zahl", erklaerung: "100 · 1,1 · 1,1 = 121 €." },
  { typ: "input", frage: "Wie groß ist der Wachstumsfaktor bei einer Zunahme um 20 %?", loesung: ["1,2"], platzhalter: "z. B. 1,2", erklaerung: "+20 % → Faktor 1 + 0,2 = 1,2." },
  { typ: "input", frage: "Wie groß ist der Faktor bei einer Abnahme um 20 %?", loesung: ["0,8"], platzhalter: "z. B. 0,8", erklaerung: "−20 % → Faktor 1 − 0,2 = 0,8." },
  {
    typ: "mc",
    frage: "Beim exponentiellen Wachstum wird pro Schritt …",
    antworten: ["mit demselben Faktor multipliziert", "immer dieselbe Zahl addiert", "immer dieselbe Zahl subtrahiert", "durch 2 geteilt"],
    richtig: 0,
    erklaerung: "Exponentielles Wachstum: In jedem Schritt wird mit demselben Faktor multipliziert.",
  },
  { typ: "input", frage: "Eine Bakterienkultur verdoppelt sich stündlich. Start: 50 Bakterien. Wie viele nach 3 Stunden?", loesung: ["400"], platzhalter: "Zahl", erklaerung: "50 · 2³ = 50 · 8 = 400." },
  { typ: "input", frage: "500 € nehmen jährlich um 10 % ab. Wie viel nach 1 Jahr?", loesung: ["450"], einheit: "€", platzhalter: "Zahl", erklaerung: "500 · 0,9 = 450 €." },
  { typ: "input", frage: "500 € nehmen jährlich um 10 % ab. Wie viel nach 2 Jahren?", loesung: ["405"], einheit: "€", platzhalter: "Zahl", erklaerung: "500 · 0,9 · 0,9 = 405 €." },
  {
    typ: "luecke",
    frage: "Bestimme die Faktoren.",
    segmente: ["+5 % ergibt den Faktor ", { luecke: ["1,05"] }, ", −5 % ergibt den Faktor ", { luecke: ["0,95"] }, "."],
    erklaerung: "1 + 0,05 = 1,05 und 1 − 0,05 = 0,95.",
  },
  { typ: "input", frage: "Ein Wert verdreifacht sich täglich. Start: 1. Wie groß ist er nach 3 Tagen?", loesung: ["27"], platzhalter: "Zahl", erklaerung: "1 · 3³ = 27." },
  {
    typ: "mc",
    frage: "„Halbwertszeit“ bedeutet, dass die Menge in dieser Zeit …",
    antworten: ["sich halbiert", "sich verdoppelt", "gleich bleibt", "null wird"],
    richtig: 0,
    erklaerung: "Nach einer Halbwertszeit ist nur noch die Hälfte übrig.",
  },
  { typ: "input", frage: "40 g eines Stoffes, Halbwertszeit 1 Tag. Wie viel ist nach 2 Tagen übrig?", loesung: ["10"], einheit: "g", platzhalter: "Zahl", erklaerung: "Nach 1 Tag 20 g, nach 2 Tagen 10 g." },
  { typ: "input", frage: "200 € wachsen um 50 %. Wie viel sind es dann?", loesung: ["300"], einheit: "€", platzhalter: "Zahl", erklaerung: "200 · 1,5 = 300 €." },
  { typ: "input", frage: "Berechne 2⁵.", loesung: ["32"], platzhalter: "Zahl", erklaerung: "2 · 2 · 2 · 2 · 2 = 32." },
  {
    typ: "mc",
    frage: "Was wächst auf lange Sicht schneller?",
    antworten: ["exponentielles Wachstum (mal Faktor)", "lineares Wachstum (plus feste Zahl)", "beide gleich", "keins von beiden"],
    richtig: 0,
    erklaerung: "Exponentielles Wachstum überholt jedes lineare Wachstum irgendwann.",
  },
];

export default EXP_WACHSTUM_RS10;
