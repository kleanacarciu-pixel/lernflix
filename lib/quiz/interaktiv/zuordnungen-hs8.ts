// ============================================================================
// Interaktive Aufgaben — Zuordnungen · Hauptschule Kl. 8 · Bayern
// Proportionale Zuordnungen erkennen und rechnen, Tabellen und Diagramme lesen.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const ZUORDNUNGEN_HS8: Aufgabe[] = [
  {
    typ: "mc",
    frage: "Welche Zuordnung ist proportional (doppelt so viel → doppelt so teuer)?",
    antworten: ["Anzahl der Semmeln → Preis", "Alter → Körpergröße", "Hausnummer → Alter", "Wetter → Laune"],
    richtig: 0,
    erklaerung: "Beim Semmel-Kauf gilt: doppelte Anzahl = doppelter Preis. Das ist proportional.",
  },
  { typ: "input", frage: "1 kg Bananen kostet 2 €. Wie viel kosten 3 kg?", loesung: ["6"], einheit: "€", platzhalter: "Zahl", erklaerung: "3 · 2 = 6 €." },
  { typ: "input", frage: "Proportionale Zuordnung: 2 → 8. Was gehört zu 4?", loesung: ["16"], platzhalter: "Zahl", erklaerung: "4 ist das Doppelte von 2, also 2 · 8 = 16." },
  { typ: "input", frage: "Proportionale Zuordnung: 5 → 15. Was gehört zu 1?", loesung: ["3"], platzhalter: "Zahl", erklaerung: "15 : 5 = 3." },
  { typ: "input", frage: "Proportionale Zuordnung: 3 → 12. Was gehört zu 7?", loesung: ["28"], platzhalter: "Zahl", erklaerung: "Zu 1 gehört 12 : 3 = 4. Zu 7 gehört 7 · 4 = 28." },
  {
    typ: "mc",
    frage: "Bei einer proportionalen Zuordnung wird die erste Größe halbiert. Was passiert mit der zweiten?",
    antworten: ["Sie halbiert sich auch", "Sie verdoppelt sich", "Sie bleibt gleich", "Sie wird null"],
    richtig: 0,
    erklaerung: "Proportional heißt: beide ändern sich im gleichen Verhältnis.",
  },
  {
    typ: "luecke",
    frage: "Ein Moped fährt gleichmäßig 40 km in einer Stunde.",
    segmente: ["In 2 Stunden: ", { luecke: ["80"] }, " km, in einer halben Stunde: ", { luecke: ["20"] }, " km."],
    erklaerung: "2 · 40 = 80 km. 40 : 2 = 20 km.",
  },
  {
    typ: "zuordnen",
    frage: "1 Stunde Babysitten bringt 9 €. Ordne zu.",
    paare: [
      { links: "2 Stunden", rechts: "18 €" },
      { links: "3 Stunden", rechts: "27 €" },
      { links: "4 Stunden", rechts: "36 €" },
      { links: "6 Stunden", rechts: "54 €" },
    ],
    erklaerung: "Stunden mal 9 €: 18 €, 27 €, 36 €, 54 €.",
  },
  {
    typ: "mc",
    frage: "Ein Säulendiagramm zeigt verkaufte Getränke: Cola 25, Wasser 40, Saft 15. Was wurde am meisten verkauft?",
    antworten: ["Wasser", "Cola", "Saft", "alles gleich oft"],
    richtig: 0,
    erklaerung: "40 (Wasser) > 25 (Cola) > 15 (Saft).",
  },
  { typ: "input", frage: "Cola 25, Wasser 40, Saft 15 Verkäufe. Wie viele Getränke wurden insgesamt verkauft?", loesung: ["80"], platzhalter: "Zahl", erklaerung: "25 + 40 + 15 = 80." },
  {
    typ: "mc",
    frage: "Welche Wertetabelle ist proportional?",
    antworten: ["1 → 5, 2 → 10, 4 → 20", "1 → 5, 2 → 8, 4 → 20", "1 → 5, 2 → 5, 4 → 5", "1 → 2, 2 → 5, 4 → 11"],
    richtig: 0,
    erklaerung: "Bei 1 → 5, 2 → 10, 4 → 20 wird immer mit 5 multipliziert.",
  },
  { typ: "input", frage: "Ein Auto braucht für 100 km genau 7 Liter. Wie viele Liter braucht es für 200 km?", loesung: ["14"], einheit: "l", platzhalter: "Zahl", erklaerung: "200 km = 2 · 100 km, also 2 · 7 = 14 Liter." },
  { typ: "input", frage: "5 Minuten Duschen verbrauchen 60 Liter Wasser. Wie viele Liter sind es bei 10 Minuten?", loesung: ["120"], einheit: "l", platzhalter: "Zahl", erklaerung: "Doppelte Zeit → doppelte Menge: 120 Liter." },
  {
    typ: "sortieren",
    frage: "Ordne die Angebote nach dem Preis pro Stück aufsteigend — beginne beim günstigsten: 10 Stück für 5 €, 4 Stück für 4 €, 3 Stück für 6 €, 1 Stück für 3 €",
    richtig: ["10 Stück für 5 €", "4 Stück für 4 €", "3 Stück für 6 €", "1 Stück für 3 €"],
    erklaerung: "Pro Stück: 0,50 € < 1 € < 2 € < 3 €.",
  },
  { typ: "input", frage: "Proportionale Zuordnung: Zu 4 gehört 10. Was gehört zu 2?", loesung: ["5"], platzhalter: "Zahl", erklaerung: "2 ist die Hälfte von 4, also 10 : 2 = 5." },
];

export default ZUORDNUNGEN_HS8;
