// ============================================================================
// Interaktive Aufgaben — Dreisatz & Proportionalität · Realschule Kl. 7
// Direkt/umgekehrt proportional, Dreisatz-Sachaufgaben.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const DREISATZ_RS7: Aufgabe[] = [
  { typ: "input", frage: "4 Äpfel kosten 2 €. Was kosten 6 Äpfel?", loesung: ["3"], einheit: "€", platzhalter: "Zahl", erklaerung: "1 Apfel: 2 € : 4 = 0,50 €. 6 Äpfel: 6 · 0,50 € = 3 €." },
  { typ: "input", frage: "3 Hefte kosten 4,50 €. Was kostet 1 Heft?", loesung: ["1,50", "1,5"], einheit: "€", platzhalter: "Zahl", erklaerung: "4,50 € : 3 = 1,50 €." },
  { typ: "input", frage: "2 kg Kartoffeln kosten 1,80 €. Was kosten 5 kg?", loesung: ["4,50", "4,5"], einheit: "€", platzhalter: "Zahl", erklaerung: "1 kg: 1,80 € : 2 = 0,90 €. 5 kg: 5 · 0,90 € = 4,50 €." },
  {
    typ: "mc",
    frage: "„Je mehr Arbeiter, desto weniger Zeit“ — welche Art von Zusammenhang ist das?",
    antworten: ["umgekehrt proportional", "direkt proportional", "gar nicht proportional", "konstant"],
    richtig: 0,
    erklaerung: "Wird die eine Größe größer und die andere entsprechend kleiner, ist der Zusammenhang umgekehrt proportional.",
  },
  {
    typ: "mc",
    frage: "„Je mehr Kilogramm Äpfel, desto höher der Preis“ — welche Art von Zusammenhang ist das?",
    antworten: ["direkt proportional", "umgekehrt proportional", "gar nicht proportional", "konstant"],
    richtig: 0,
    erklaerung: "Doppelte Menge → doppelter Preis: direkt proportional.",
  },
  { typ: "input", frage: "3 Arbeiter brauchen für eine Arbeit 8 Stunden. Wie lange brauchen 6 Arbeiter?", loesung: ["4"], einheit: "h", platzhalter: "Zahl", erklaerung: "Gesamtarbeit: 3 · 8 = 24 „Arbeiterstunden“. 24 : 6 = 4 Stunden." },
  { typ: "input", frage: "4 Pumpen füllen ein Becken in 6 Stunden. Wie lange brauchen 8 Pumpen?", loesung: ["3"], einheit: "h", platzhalter: "Zahl", erklaerung: "4 · 6 = 24. 24 : 8 = 3 Stunden (umgekehrt proportional)." },
  {
    typ: "luecke",
    frage: "Dreisatz: 6 Brötchen kosten 3 €.",
    segmente: ["1 Brötchen kostet ", { luecke: ["0,50", "0,5"] }, " € und 10 Brötchen kosten ", { luecke: ["5"] }, " €."],
    erklaerung: "3 € : 6 = 0,50 €. 10 · 0,50 € = 5 €.",
  },
  { typ: "input", frage: "Ein Auto fährt mit gleicher Geschwindigkeit 100 km in 2 Stunden. Wie weit kommt es in 5 Stunden?", loesung: ["250"], einheit: "km", platzhalter: "Zahl", erklaerung: "100 : 2 = 50 km pro Stunde. 5 · 50 = 250 km." },
  { typ: "input", frage: "8 m Stoff kosten 24 €. Was kosten 5 m?", loesung: ["15"], einheit: "€", platzhalter: "Zahl", erklaerung: "24 € : 8 = 3 € pro Meter. 5 · 3 € = 15 €." },
  { typ: "input", frage: "2 Maschinen schaffen 50 Teile pro Stunde. Wie viele Teile schaffen 6 Maschinen pro Stunde?", loesung: ["150"], platzhalter: "Zahl", erklaerung: "50 : 2 = 25 Teile pro Maschine. 6 · 25 = 150 Teile." },
  {
    typ: "mc",
    frage: "Bei direkter Proportionalität gilt: doppelte Menge bedeutet …",
    antworten: ["doppelter Preis", "halber Preis", "gleicher Preis", "dreifacher Preis"],
    richtig: 0,
    erklaerung: "Direkt proportional: Verdoppelt sich die Menge, verdoppelt sich auch der Preis.",
  },
  { typ: "input", frage: "12 Bonbons kosten 3 €. Wie viele Bonbons bekommst du für 1 €?", loesung: ["4"], platzhalter: "Zahl", erklaerung: "12 : 3 = 4 Bonbons pro Euro." },
  { typ: "input", frage: "Ein Läufer schafft 60 m in 1,5 Minuten (gleiches Tempo). Wie viele Meter in 1 Minute?", loesung: ["40"], einheit: "m", platzhalter: "Zahl", erklaerung: "60 : 1,5 = 40 m pro Minute." },
  { typ: "input", frage: "4 Maler streichen ein Haus in 9 Tagen. Wie lange brauchen 6 Maler?", loesung: ["6"], einheit: "Tage", platzhalter: "Zahl", erklaerung: "4 · 9 = 36. 36 : 6 = 6 Tage (umgekehrt proportional)." },
];

export default DREISATZ_RS7;
