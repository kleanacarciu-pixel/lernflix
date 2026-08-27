// ============================================================================
// Interaktive Aufgaben — Dreisatz · Hauptschule Kl. 7 · Bayern
// Auf 1 zurückrechnen, dann hochrechnen — Einkauf, Rezepte, Arbeit.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const DREISATZ_HS7: Aufgabe[] = [
  { typ: "input", frage: "4 Semmeln kosten 2 €. Wie viel kostet 1 Semmel? (Als Kommazahl.)", loesung: ["0,50", "0,5"], einheit: "€", platzhalter: "z. B. 0,50", erklaerung: "2 € : 4 = 0,50 €." },
  { typ: "input", frage: "4 Semmeln kosten 2 €. Wie viel kosten 10 Semmeln?", loesung: ["5"], einheit: "€", platzhalter: "Zahl", erklaerung: "1 Semmel: 0,50 €. 10 Semmeln: 10 · 0,50 = 5 €." },
  { typ: "input", frage: "3 kg Kartoffeln kosten 6 €. Wie viel kosten 5 kg?", loesung: ["10"], einheit: "€", platzhalter: "Zahl", erklaerung: "1 kg: 6 : 3 = 2 €. 5 kg: 5 · 2 = 10 €." },
  { typ: "input", frage: "2 Kinokarten kosten 16 €. Wie viel kosten 5 Karten?", loesung: ["40"], einheit: "€", platzhalter: "Zahl", erklaerung: "1 Karte: 16 : 2 = 8 €. 5 Karten: 5 · 8 = 40 €." },
  { typ: "input", frage: "Ein Radfahrer schafft in 1 Stunde 12 km. Wie weit kommt er in 3 Stunden?", loesung: ["36"], einheit: "km", platzhalter: "Zahl", erklaerung: "3 · 12 = 36 km." },
  { typ: "input", frage: "Für 4 Pizzen braucht man 800 g Mehl. Wie viel Gramm braucht man für 6 Pizzen?", loesung: ["1200", "1 200"], einheit: "g", platzhalter: "Zahl", erklaerung: "Für 1 Pizza: 800 : 4 = 200 g. Für 6: 6 · 200 = 1 200 g." },
  { typ: "input", frage: "Emre bekommt für 3 Stunden Rasenmähen 24 €. Wie viel bekommt er für 5 Stunden?", loesung: ["40"], einheit: "€", platzhalter: "Zahl", erklaerung: "1 Stunde: 24 : 3 = 8 €. 5 Stunden: 5 · 8 = 40 €." },
  {
    typ: "mc",
    frage: "Wie rechnet man beim Dreisatz?",
    antworten: ["Erst auf 1 zurückrechnen (geteilt), dann malnehmen", "Immer alles addieren", "Immer alles malnehmen", "Einfach raten"],
    richtig: 0,
    erklaerung: "Dreisatz: durch Teilen zur Einheit (1 Stück, 1 kg, 1 Stunde), dann mal die gesuchte Menge.",
  },
  {
    typ: "mc",
    frage: "6 Flaschen Limo kosten 9 €. Was kostet 1 Flasche?",
    antworten: ["1,50 €", "1,00 €", "3,00 €", "0,90 €"],
    richtig: 0,
    erklaerung: "9 € : 6 = 1,50 €.",
  },
  {
    typ: "luecke",
    frage: "5 Hefte kosten 10 €.",
    segmente: ["1 Heft kostet ", { luecke: ["2"] }, " €, also kosten 8 Hefte ", { luecke: ["16"] }, " €."],
    erklaerung: "10 : 5 = 2 €. 8 · 2 = 16 €.",
  },
  {
    typ: "zuordnen",
    frage: "1 kg Äpfel kostet 3 €. Ordne jeder Menge den Preis zu.",
    paare: [
      { links: "2 kg", rechts: "6 €" },
      { links: "4 kg", rechts: "12 €" },
      { links: "0,5 kg", rechts: "1,50 €" },
      { links: "10 kg", rechts: "30 €" },
    ],
    erklaerung: "Menge mal 3 €: 6 €, 12 €, 1,50 €, 30 €.",
  },
  { typ: "input", frage: "Ein Bus fährt in 2 Stunden 120 km. Wie weit kommt er in 3 Stunden (gleiches Tempo)?", loesung: ["180"], einheit: "km", platzhalter: "Zahl", erklaerung: "In 1 Stunde: 120 : 2 = 60 km. In 3 Stunden: 180 km." },
  { typ: "input", frage: "8 gleiche Packungen wiegen zusammen 4 kg. Wie viel wiegen 2 Packungen?", loesung: ["1"], einheit: "kg", platzhalter: "Zahl", erklaerung: "2 Packungen sind ein Viertel von 8: 4 : 4 = 1 kg." },
  {
    typ: "mc",
    frage: "Wo hilft der Dreisatz NICHT?",
    antworten: ["Je mehr man übt, desto besser die Note", "3 Brote kosten 6 € — was kosten 5?", "2 Stunden Arbeit bringen 20 € — was bringen 7?", "4 kg kosten 8 € — was kostet 1 kg?"],
    richtig: 0,
    erklaerung: "Note und Übungszeit sind nicht fest proportional — bei Preisen und Löhnen klappt der Dreisatz.",
  },
  {
    typ: "sortieren",
    frage: "Ordne die Angebote nach dem Preis für 1 kg aufsteigend — beginne beim günstigsten: 2 kg für 8 €, 5 kg für 10 €, 1 kg für 5 €, 3 kg für 9 €",
    richtig: ["5 kg für 10 €", "3 kg für 9 €", "2 kg für 8 €", "1 kg für 5 €"],
    erklaerung: "Pro kg: 2 € < 3 € < 4 € < 5 €.",
  },
];

export default DREISATZ_HS7;
