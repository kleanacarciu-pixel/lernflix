// ============================================================================
// Interaktive Aufgaben — Zuordnungen & Diagramme · Mittelschule Kl. 8 · Bayern
// Proportionale Zuordnungen, Tabellen lesen, Diagramme deuten.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const ZUORDNUNGEN_MS8: Aufgabe[] = [
  {
    typ: "mc",
    frage: "Welche Zuordnung ist proportional?",
    antworten: ["Anzahl der Brötchen → Preis", "Alter eines Autos → Wert", "Geschwindigkeit → Fahrzeit für 100 km", "Körpergröße → Schulnote"],
    richtig: 0,
    erklaerung: "Doppelt so viele Brötchen kosten doppelt so viel — das ist proportional.",
  },
  { typ: "input", frage: "1 kg Birnen kostet 3 €. Wie viel kosten 4 kg?", loesung: ["12"], einheit: "€", platzhalter: "Zahl", erklaerung: "4 · 3 € = 12 € (proportionale Zuordnung)." },
  { typ: "input", frage: "Eine proportionale Zuordnung: 2 → 10. Was gehört zu 6?", loesung: ["30"], platzhalter: "Zahl", erklaerung: "6 ist das Dreifache von 2, also 3 · 10 = 30." },
  { typ: "input", frage: "Eine proportionale Zuordnung: 5 → 20. Was gehört zu 1?", loesung: ["4"], platzhalter: "Zahl", erklaerung: "20 : 5 = 4." },
  {
    typ: "mc",
    frage: "Bei einer proportionalen Zuordnung wird die erste Größe verdoppelt. Was passiert mit der zweiten?",
    antworten: ["Sie verdoppelt sich auch", "Sie halbiert sich", "Sie bleibt gleich", "Sie wird um 2 größer"],
    richtig: 0,
    erklaerung: "Proportional: beide Größen ändern sich im gleichen Verhältnis.",
  },
  {
    typ: "luecke",
    frage: "Ein Radfahrer fährt gleichmäßig 15 km in einer Stunde.",
    segmente: ["In 2 Stunden schafft er ", { luecke: ["30"] }, " km, in 4 Stunden ", { luecke: ["60"] }, " km."],
    erklaerung: "2 · 15 = 30 km und 4 · 15 = 60 km.",
  },
  {
    typ: "zuordnen",
    frage: "1 Stunde Arbeit bringt 11 € Lohn. Ordne zu.",
    paare: [
      { links: "2 Stunden", rechts: "22 €" },
      { links: "3 Stunden", rechts: "33 €" },
      { links: "5 Stunden", rechts: "55 €" },
      { links: "8 Stunden", rechts: "88 €" },
    ],
    erklaerung: "Stunden mal 11 €: 22 €, 33 €, 55 €, 88 €.",
  },
  {
    typ: "mc",
    frage: "In einem Säulendiagramm zeigt die Säule für Montag 12 verkaufte Eis, die für Dienstag 18. Wie viele mehr wurden am Dienstag verkauft?",
    antworten: ["6", "30", "12", "18"],
    richtig: 0,
    erklaerung: "18 − 12 = 6 Eis mehr.",
  },
  { typ: "input", frage: "Ein Kreisdiagramm zeigt: Die Hälfte des Kreises steht für „Fußball“. Wie viel Prozent der Stimmen sind das?", loesung: ["50"], einheit: "%", platzhalter: "Zahl", erklaerung: "Der halbe Kreis entspricht 50 %." },
  { typ: "input", frage: "Klassensprecherwahl mit 24 Stimmen: Im Diagramm entfallen 12 auf Mia, 8 auf Tom, der Rest auf Lea. Wie viele Stimmen hat Lea?", loesung: ["4"], platzhalter: "Zahl", erklaerung: "24 − 12 − 8 = 4 Stimmen." },
  {
    typ: "mc",
    frage: "Welche Wertetabelle gehört zu einer proportionalen Zuordnung?",
    antworten: ["1 → 4, 2 → 8, 3 → 12", "1 → 4, 2 → 6, 3 → 8", "1 → 4, 2 → 4, 3 → 4", "1 → 1, 2 → 4, 3 → 9"],
    richtig: 0,
    erklaerung: "Bei 1 → 4, 2 → 8, 3 → 12 ist der Quotient immer 4 — das ist proportional.",
  },
  { typ: "input", frage: "Eine proportionale Zuordnung: 3 → 12. Wie lautet der Proportionalitätsfaktor (Zahl pro 1)?", loesung: ["4"], platzhalter: "Zahl", erklaerung: "12 : 3 = 4. Jede Einheit wird mit 4 multipliziert." },
  { typ: "input", frage: "Ein Auto verbraucht auf 100 km genau 6 Liter. Wie viele Liter braucht es für 300 km?", loesung: ["18"], einheit: "l", platzhalter: "Zahl", erklaerung: "300 km sind 3 · 100 km, also 3 · 6 = 18 Liter." },
  {
    typ: "sortieren",
    frage: "Ordne die Angebote nach dem Preis pro Kilogramm aufsteigend — beginne beim günstigsten: 2 kg für 10 €, 3 kg für 12 €, 1 kg für 6 €, 4 kg für 12 €",
    richtig: ["4 kg für 12 €", "3 kg für 12 €", "2 kg für 10 €", "1 kg für 6 €"],
    erklaerung: "Pro kg: 12 : 4 = 3 €, 12 : 3 = 4 €, 10 : 2 = 5 €, 6 : 1 = 6 €.",
  },
  {
    typ: "mc",
    frage: "Welches Diagramm eignet sich am besten, um Anteile am Ganzen (z. B. Wahlergebnisse) zu zeigen?",
    antworten: ["Kreisdiagramm", "Zahlenstrahl", "Koordinatensystem ohne Daten", "Geodreieck"],
    richtig: 0,
    erklaerung: "Ein Kreisdiagramm zeigt, wie sich das Ganze (100 %) in Anteile aufteilt.",
  },
];

export default ZUORDNUNGEN_MS8;
