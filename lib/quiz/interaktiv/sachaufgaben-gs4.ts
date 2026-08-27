// ============================================================================
// Interaktive Aufgaben — Sachaufgaben · Grundschule Kl. 4 · Bayern
// Textaufgaben mit allen vier Rechenarten, Zweischritt-Aufgaben, Überschlag.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const SACHAUFGABEN_GS4: Aufgabe[] = [
  { typ: "input", frage: "Ein Kinosaal hat 18 Reihen mit je 25 Plätzen. Wie viele Plätze hat er?", loesung: ["450"], platzhalter: "Zahl", erklaerung: "18 · 25 = 450 Plätze." },
  { typ: "input", frage: "Auf dem Schulfest werden 320 Brezen bestellt, 145 werden am Vormittag verkauft. Wie viele sind noch da?", loesung: ["175"], platzhalter: "Zahl", erklaerung: "320 − 145 = 175 Brezen." },
  { typ: "input", frage: "Eine Familie fährt 380 km in den Urlaub. Nach 215 km machen sie Pause. Wie viele Kilometer fehlen noch?", loesung: ["165"], einheit: "km", platzhalter: "Zahl", erklaerung: "380 − 215 = 165 km." },
  { typ: "input", frage: "4 Freunde teilen sich den Gewinn von 120 € gerecht. Wie viel bekommt jeder?", loesung: ["30"], einheit: "€", platzhalter: "Zahl", erklaerung: "120 : 4 = 30 €." },
  { typ: "input", frage: "Lena spart jeden Monat 15 €. Wie viel hat sie nach einem Jahr?", loesung: ["180"], einheit: "€", platzhalter: "Zahl", erklaerung: "12 · 15 = 180 €." },
  { typ: "input", frage: "Ein Bäcker backt 96 Semmeln und legt sie in Körbe zu je 12. Wie viele Körbe braucht er?", loesung: ["8"], platzhalter: "Zahl", erklaerung: "96 : 12 = 8 Körbe." },
  {
    typ: "mc",
    frage: "Klassenfahrt: 27 Kinder zahlen je 95 €. Welcher Überschlag passt?",
    antworten: ["ungefähr 30 · 100 = 3 000 €", "ungefähr 20 · 90 = 1 800 €", "ungefähr 27 + 95 = 122 €", "ungefähr 100 · 100 = 10 000 €"],
    richtig: 0,
    erklaerung: "27 ≈ 30 und 95 ≈ 100: rund 3 000 € (genau: 2 565 €).",
  },
  {
    typ: "mc",
    frage: "Was musst du bei einer Sachaufgabe ZUERST tun?",
    antworten: ["Die Frage genau lesen und verstehen", "Sofort irgendwas rechnen", "Alle Zahlen addieren", "Das Ergebnis raten"],
    richtig: 0,
    erklaerung: "Erst verstehen: Was ist gegeben, was ist gefragt? Dann rechnen.",
  },
  {
    typ: "luecke",
    frage: "Zweischritt-Aufgabe: Tom kauft 3 Hefte zu je 2 € und einen Block für 4 €.",
    segmente: ["Die Hefte kosten ", { luecke: ["6"] }, " €, alles zusammen ", { luecke: ["10"] }, " €."],
    erklaerung: "3 · 2 = 6 €. 6 + 4 = 10 €.",
  },
  {
    typ: "zuordnen",
    frage: "Ordne jeder Frage die passende Rechenart zu.",
    paare: [
      { links: "Wie viel zusammen?", rechts: "Plus" },
      { links: "Wie viel bleibt übrig?", rechts: "Minus" },
      { links: "Wie viel sind 5 Packungen?", rechts: "Mal" },
      { links: "Wie viel bekommt jeder?", rechts: "Geteilt" },
    ],
    erklaerung: "Zusammen → +, übrig → −, mehrere gleiche → ·, gerecht verteilen → :.",
  },
  { typ: "input", frage: "Ein Zug hat 8 Wagen mit je 64 Plätzen. 380 Plätze sind besetzt. Wie viele Plätze sind frei?", loesung: ["132"], platzhalter: "Zahl", erklaerung: "8 · 64 = 512 Plätze. 512 − 380 = 132 frei." },
  { typ: "input", frage: "Klassenkasse: 24 Kinder zahlen je 5 € ein. Der Ausflug kostet 100 €. Wie viel Euro bleiben in der Kasse?", loesung: ["20"], einheit: "€", platzhalter: "Zahl", erklaerung: "24 · 5 = 120 €. 120 − 100 = 20 €." },
  { typ: "input", frage: "Ein Buch hat 240 Seiten. Anna liest jeden Tag 30 Seiten. Nach wie vielen Tagen ist sie fertig?", loesung: ["8"], platzhalter: "Zahl", erklaerung: "240 : 30 = 8 Tage." },
  {
    typ: "mc",
    frage: "Papa tankt 45 Liter zu je 2 €. Er bezahlt mit 100 €. Wie viel bekommt er zurück?",
    antworten: ["10 €", "90 €", "55 €", "20 €"],
    richtig: 0,
    erklaerung: "45 · 2 = 90 €. 100 − 90 = 10 €.",
  },
  {
    typ: "sortieren",
    frage: "Ordne die Einkäufe nach dem Preis von billig nach teuer: 3 Hefte à 2 €, 1 Buch für 12 €, 2 Stifte à 1 €, 4 Blöcke à 4 €",
    richtig: ["2 Stifte à 1 €", "3 Hefte à 2 €", "1 Buch für 12 €", "4 Blöcke à 4 €"],
    erklaerung: "2 € < 6 € < 12 € < 16 €.",
  },
];

export default SACHAUFGABEN_GS4;
