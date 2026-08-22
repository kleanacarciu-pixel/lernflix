// ============================================================================
// Interaktive Aufgaben — Proportionalität & Dreisatz · Gymnasium Kl. 7
// Direkt/indirekt proportional, Dreisatz, Sachaufgaben.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const DREISATZ_GYM7: Aufgabe[] = [
  { typ: "input", frage: "3 Äpfel kosten 1,20 €. Was kosten 5 Äpfel?", loesung: ["2", "2,00"], einheit: "€", platzhalter: "Zahl", erklaerung: "1 Apfel: 1,20 € : 3 = 0,40 €. 5 Äpfel: 5 · 0,40 € = 2,00 €." },
  { typ: "input", frage: "4 Hefte kosten 6 €. Was kostet 1 Heft?", loesung: ["1,5", "1,50"], einheit: "€", platzhalter: "Zahl", erklaerung: "6 € : 4 = 1,50 €." },
  { typ: "input", frage: "2 kg Äpfel kosten 3 €. Was kosten 6 kg?", loesung: ["9"], einheit: "€", platzhalter: "Zahl", erklaerung: "1 kg: 3 € : 2 = 1,50 €. 6 kg: 6 · 1,50 € = 9 €." },
  {
    typ: "mc",
    frage: "„Je mehr Arbeiter, desto weniger Zeit“ — welche Art von Zusammenhang ist das?",
    antworten: ["umgekehrt proportional", "direkt proportional", "gar nicht proportional", "konstant"],
    richtig: 0,
    erklaerung: "Wenn die eine Größe größer wird und die andere entsprechend kleiner, ist der Zusammenhang umgekehrt (indirekt) proportional.",
  },
  {
    typ: "mc",
    frage: "„Je mehr Liter Benzin, desto höher der Preis“ — welche Art von Zusammenhang ist das?",
    antworten: ["direkt proportional", "umgekehrt proportional", "gar nicht proportional", "konstant"],
    richtig: 0,
    erklaerung: "Doppelte Menge → doppelter Preis: das ist direkt proportional.",
  },
  { typ: "input", frage: "4 Arbeiter brauchen für eine Arbeit 6 Stunden. Wie lange brauchen 8 Arbeiter?", loesung: ["3"], einheit: "h", platzhalter: "Zahl", erklaerung: "Gesamtarbeit: 4 · 6 = 24 „Arbeiterstunden“. 24 : 8 = 3 Stunden." },
  { typ: "input", frage: "2 Pumpen füllen ein Becken in 6 Stunden. Wie lange brauchen 3 Pumpen?", loesung: ["4"], einheit: "h", platzhalter: "Zahl", erklaerung: "2 · 6 = 12. 12 : 3 = 4 Stunden (umgekehrt proportional)." },
  {
    typ: "luecke",
    frage: "Dreisatz: 5 Brötchen kosten 2 €.",
    segmente: ["1 Brötchen kostet ", { luecke: ["0,40", "0,4"] }, " € und 10 Brötchen kosten ", { luecke: ["4"] }, " €."],
    erklaerung: "2 € : 5 = 0,40 €. 10 · 0,40 € = 4 €.",
  },
  { typ: "input", frage: "Ein Auto fährt mit gleicher Geschwindigkeit 120 km in 2 Stunden. Wie weit kommt es in 3 Stunden?", loesung: ["180"], einheit: "km", platzhalter: "Zahl", erklaerung: "120 : 2 = 60 km pro Stunde. 3 · 60 = 180 km." },
  { typ: "input", frage: "6 m Stoff kosten 18 €. Was kosten 10 m?", loesung: ["30"], einheit: "€", platzhalter: "Zahl", erklaerung: "18 € : 6 = 3 € pro Meter. 10 · 3 € = 30 €." },
  { typ: "input", frage: "3 Maschinen schaffen 60 Teile pro Stunde. Wie viele Teile schaffen 5 Maschinen pro Stunde?", loesung: ["100"], platzhalter: "Zahl", erklaerung: "60 : 3 = 20 Teile pro Maschine. 5 · 20 = 100 Teile." },
  {
    typ: "mc",
    frage: "Bei direkter Proportionalität gilt: doppelte Menge bedeutet …",
    antworten: ["doppelter Preis", "halber Preis", "gleicher Preis", "dreifacher Preis"],
    richtig: 0,
    erklaerung: "Direkt proportional: Verdoppelt sich die Menge, verdoppelt sich auch der Preis.",
  },
  { typ: "input", frage: "8 Bonbons kosten 2 €. Wie viele Bonbons bekommst du für 5 €?", loesung: ["20"], platzhalter: "Zahl", erklaerung: "8 : 2 = 4 Bonbons pro Euro. 5 · 4 = 20 Bonbons." },
  { typ: "input", frage: "Ein Läufer schafft 90 m in 1,5 Minuten (gleiches Tempo). Wie viele Meter in 1 Minute?", loesung: ["60"], einheit: "m", platzhalter: "Zahl", erklaerung: "90 m : 1,5 = 60 m pro Minute." },
  { typ: "input", frage: "5 Arbeiter bauen eine Mauer in 12 Tagen. Wie lange brauchen 10 Arbeiter?", loesung: ["6"], einheit: "Tage", platzhalter: "Zahl", erklaerung: "5 · 12 = 60. 60 : 10 = 6 Tage (umgekehrt proportional)." },
];

export default DREISATZ_GYM7;
