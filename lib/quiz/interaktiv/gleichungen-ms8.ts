// ============================================================================
// Interaktive Aufgaben — Gleichungen lösen · Mittelschule Kl. 8 · Bayern
// Äquivalenzumformungen, Gleichungen mit x auf einer Seite, Probe, Sachaufgaben.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const GLEICHUNGEN_MS8: Aufgabe[] = [
  { typ: "input", frage: "Löse die Gleichung: x + 9 = 15", loesung: ["6", "x=6", "x = 6"], platzhalter: "Zahl", erklaerung: "Auf beiden Seiten − 9: x = 15 − 9 = 6." },
  { typ: "input", frage: "Löse die Gleichung: x − 7 = 3", loesung: ["10", "x=10", "x = 10"], platzhalter: "Zahl", erklaerung: "Auf beiden Seiten + 7: x = 3 + 7 = 10." },
  { typ: "input", frage: "Löse die Gleichung: 4x = 28", loesung: ["7", "x=7", "x = 7"], platzhalter: "Zahl", erklaerung: "Auf beiden Seiten : 4: x = 28 : 4 = 7." },
  { typ: "input", frage: "Löse die Gleichung: x : 5 = 6", loesung: ["30", "x=30", "x = 30"], platzhalter: "Zahl", erklaerung: "Auf beiden Seiten · 5: x = 6 · 5 = 30." },
  { typ: "input", frage: "Löse die Gleichung: 3x + 4 = 19", loesung: ["5", "x=5", "x = 5"], platzhalter: "Zahl", erklaerung: "− 4: 3x = 15. Dann : 3: x = 5." },
  { typ: "input", frage: "Löse die Gleichung: 2x − 5 = 11", loesung: ["8", "x=8", "x = 8"], platzhalter: "Zahl", erklaerung: "+ 5: 2x = 16. Dann : 2: x = 8." },
  { typ: "input", frage: "Löse die Gleichung: 5x + 2 = 3x + 10", loesung: ["4", "x=4", "x = 4"], platzhalter: "Zahl", erklaerung: "− 3x: 2x + 2 = 10. − 2: 2x = 8. : 2: x = 4." },
  {
    typ: "mc",
    frage: "Welche Umformung ist erlaubt, ohne dass sich die Lösung ändert?",
    antworten: ["Auf beiden Seiten dieselbe Zahl addieren", "Nur auf einer Seite eine Zahl addieren", "Auf beiden Seiten durch 0 teilen", "Die Seiten einfach vertauschen und ein Minus davor setzen"],
    richtig: 0,
    erklaerung: "Äquivalenzumformung: Auf BEIDEN Seiten dasselbe tun (+, −, ·, : — aber nie durch 0 teilen).",
  },
  {
    typ: "mc",
    frage: "Ist x = 3 eine Lösung der Gleichung 4x − 2 = 10?",
    antworten: ["Ja, denn 4 · 3 − 2 = 10", "Nein, denn 4 · 3 − 2 = 14", "Nein, denn 4 · 3 − 2 = 12", "Das kann man nicht prüfen"],
    richtig: 0,
    erklaerung: "Probe: 4 · 3 − 2 = 12 − 2 = 10. Stimmt, also ist x = 3 Lösung.",
  },
  {
    typ: "luecke",
    frage: "Löse Schritt für Schritt: 2x + 6 = 14",
    segmente: ["Nach − 6: 2x = ", { luecke: ["8"] }, ", also x = ", { luecke: ["4"] }, "."],
    erklaerung: "2x = 14 − 6 = 8, dann x = 8 : 2 = 4.",
  },
  {
    typ: "zuordnen",
    frage: "Ordne jeder Gleichung ihre Lösung zu.",
    paare: [
      { links: "x + 5 = 11", rechts: "x = 6" },
      { links: "3x = 27", rechts: "x = 9" },
      { links: "2x − 1 = 13", rechts: "x = 7" },
      { links: "x : 3 = 4", rechts: "x = 12" },
    ],
    erklaerung: "11 − 5 = 6; 27 : 3 = 9; (13 + 1) : 2 = 7; 4 · 3 = 12.",
  },
  { typ: "input", frage: "Denke an eine Zahl: Das Dreifache der Zahl plus 6 ergibt 27. Wie heißt die Zahl?", loesung: ["7"], platzhalter: "Zahl", erklaerung: "3x + 6 = 27 → 3x = 21 → x = 7." },
  { typ: "input", frage: "Tom und sein Bruder sind zusammen 20 Jahre alt. Tom ist 4 Jahre älter. Wie alt ist der Bruder?", loesung: ["8"], platzhalter: "Zahl", erklaerung: "x + (x + 4) = 20 → 2x = 16 → x = 8. Der Bruder ist 8, Tom 12." },
  {
    typ: "mc",
    frage: "Wie lautet die Gleichung zu: „Eine Pizza kostet x €. 4 Pizzen und 2 € Trinkgeld kosten 30 €“?",
    antworten: ["4x + 2 = 30", "4x − 2 = 30", "2x + 4 = 30", "4 + x = 30"],
    richtig: 0,
    erklaerung: "4 Pizzen: 4x, plus 2 € Trinkgeld: 4x + 2 = 30. (Übrigens: x = 7 €.)",
  },
  { typ: "input", frage: "Löse die Gleichung: 10 − x = 4", loesung: ["6", "x=6", "x = 6"], platzhalter: "Zahl", erklaerung: "x = 10 − 4 = 6. Probe: 10 − 6 = 4. ✓" },
];

export default GLEICHUNGEN_MS8;
