// ============================================================================
// Interaktive Aufgaben — Teilbarkeit & Primfaktoren · Gymnasium Kl. 6 · Bayern
// Gemischte Typen, Lösungen von Hand geprüft.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const TEILBARKEIT_GYM6: Aufgabe[] = [
  {
    typ: "mc",
    frage: "Welche dieser Zahlen ist durch 6 teilbar?",
    antworten: ["342", "116", "214", "128"],
    richtig: 0,
    erklaerung: "Durch 6 teilbar = durch 2 UND durch 3. 342 ist gerade und hat die Quersumme 9. 342 : 6 = 57.",
  },
  {
    typ: "mc",
    frage: "Welche dieser Zahlen ist durch 9 teilbar?",
    antworten: ["756", "742", "651", "843"],
    richtig: 0,
    erklaerung: "Quersumme durch 9 teilbar: 7+5+6 = 18. 756 : 9 = 84.",
  },
  { typ: "input", frage: "Bestimme den größten gemeinsamen Teiler (ggT) von 36 und 60.", loesung: ["12"], platzhalter: "Zahl", erklaerung: "36 = 2²·3², 60 = 2²·3·5. Gemeinsam: 2²·3 = 12." },
  { typ: "input", frage: "Bestimme das kleinste gemeinsame Vielfache (kgV) von 12 und 18.", loesung: ["36"], platzhalter: "Zahl", erklaerung: "12 = 2²·3, 18 = 2·3². kgV = 2²·3² = 36." },
  { typ: "input", frage: "Zwei Leuchttürme blinken alle 12 s bzw. alle 18 s. Nach wie vielen Sekunden blinken sie erstmals wieder gleichzeitig?", loesung: ["36"], einheit: "s", platzhalter: "Zahl", erklaerung: "Gesucht ist das kgV von 12 und 18 = 36." },
  { typ: "input", frage: "Du hast 24 rote und 36 blaue Perlen und willst möglichst viele gleiche Sträußchen ohne Rest machen. Wie viele sind das höchstens?", loesung: ["12"], platzhalter: "Zahl", erklaerung: "Gesucht ist der ggT von 24 und 36 = 12." },
  {
    typ: "luecke",
    frage: "Bestimme ggT und kgV mit den Primfaktoren: 36 = 2²·3², 60 = 2²·3·5.",
    segmente: ["Der ggT ist ", { luecke: ["12"] }, " und das kgV ist ", { luecke: ["180"] }, "."],
    erklaerung: "ggT = gemeinsame Faktoren = 2²·3 = 12. kgV = alle Faktoren, höchste Potenz = 2²·3²·5 = 180.",
  },
  { typ: "input", frage: "Was ist der größte Primfaktor von 90?", loesung: ["5"], platzhalter: "Zahl", erklaerung: "90 = 2 · 3 · 3 · 5. Der größte Primfaktor ist 5." },
  { typ: "input", frage: "Wie viele Teiler hat die Zahl 24?", loesung: ["8"], platzhalter: "Zahl", erklaerung: "Teiler: 1, 2, 3, 4, 6, 8, 12, 24 — das sind 8 Stück." },
  {
    typ: "mc",
    frage: "Welche dieser Zahlen ist eine Primzahl?",
    antworten: ["53", "51", "57", "91"],
    richtig: 0,
    erklaerung: "53 ist nur durch 1 und 53 teilbar. 51 = 3·17, 57 = 3·19, 91 = 7·13.",
  },
  {
    typ: "zuordnen",
    frage: "Ordne jeder Zahl ihre Primfaktorzerlegung zu.",
    paare: [
      { links: "12", rechts: "2·2·3" },
      { links: "18", rechts: "2·3·3" },
      { links: "20", rechts: "2·2·5" },
      { links: "30", rechts: "2·3·5" },
    ],
    erklaerung: "12 = 2·2·3; 18 = 2·3·3; 20 = 2·2·5; 30 = 2·3·5.",
  },
  {
    typ: "mc",
    frage: "Welche dieser Zahlen ist durch 4 teilbar?",
    antworten: ["1316", "1322", "1230", "1114"],
    richtig: 0,
    erklaerung: "Regel: die letzten zwei Ziffern müssen durch 4 teilbar sein. 16 = 4·4, also ist 1316 : 4 = 329.",
  },
  { typ: "input", frage: "Welche Zahl zwischen 170 und 180 ist durch 25 teilbar?", loesung: ["175"], platzhalter: "Zahl", erklaerung: "Durch 25 teilbare Zahlen enden auf 00, 25, 50 oder 75. Das ist 175 (= 25 · 7)." },
  { typ: "input", frage: "Ein Boden von 48 cm × 36 cm soll mit gleich großen quadratischen Fliesen ohne Rest ausgelegt werden. Wie lang ist die größtmögliche Fliesenkante?", loesung: ["12"], einheit: "cm", platzhalter: "Zahl", erklaerung: "Die Kantenlänge muss 48 und 36 teilen — gesucht ist der ggT(48, 36) = 12 cm." },
  { typ: "input", frage: "Bestimme das kleinste gemeinsame Vielfache (kgV) von 4, 6 und 8.", loesung: ["24"], platzhalter: "Zahl", erklaerung: "4 = 2², 6 = 2·3, 8 = 2³. kgV = 2³·3 = 24." },
  {
    typ: "luecke",
    frage: "Vervollständige die Teilbarkeitsregel.",
    segmente: ["Eine Zahl ist durch 3 teilbar, wenn ihre ", { luecke: ["Quersumme", "quersumme"], breite: 10 }, " durch 3 teilbar ist."],
    erklaerung: "Die Quersumme ist die Summe aller Ziffern. Beispiel: 24 → 2 + 4 = 6, durch 3 teilbar.",
  },
  {
    typ: "mc",
    frage: "Welche Aussage über Primzahlen stimmt?",
    antworten: ["Eine Primzahl hat genau zwei Teiler.", "1 ist eine Primzahl.", "Alle Primzahlen sind ungerade.", "2 ist keine Primzahl."],
    richtig: 0,
    erklaerung: "Eine Primzahl hat genau zwei Teiler: 1 und sich selbst. 1 hat nur einen Teiler, und 2 ist eine gerade Primzahl.",
  },
  { typ: "input", frage: "Bestimme den größten gemeinsamen Teiler (ggT) von 18 und 24.", loesung: ["6"], platzhalter: "Zahl", erklaerung: "Gemeinsame Teiler von 18 und 24: 1, 2, 3, 6. Der größte ist 6." },
];

export default TEILBARKEIT_GYM6;
