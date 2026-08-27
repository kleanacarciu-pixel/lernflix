// ============================================================================
// Interaktive Aufgaben — Schriftlich Addieren & Subtrahieren · Grundschule Kl. 3
// Stellengerecht untereinander rechnen, mit und ohne Übertrag, Probe.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const SCHRIFTLICH_GS3: Aufgabe[] = [
  { typ: "input", frage: "Rechne schriftlich: 234 + 152", loesung: ["386"], platzhalter: "Zahl", erklaerung: "4+2=6, 3+5=8, 2+1=3 → 386." },
  { typ: "input", frage: "Rechne schriftlich: 347 + 226", loesung: ["573"], platzhalter: "Zahl", erklaerung: "7+6=13 (3 anschreiben, 1 Übertrag), 4+2+1=7, 3+2=5 → 573." },
  { typ: "input", frage: "Rechne schriftlich: 456 + 378", loesung: ["834"], platzhalter: "Zahl", erklaerung: "6+8=14 (Übertrag), 5+7+1=13 (Übertrag), 4+3+1=8 → 834." },
  { typ: "input", frage: "Rechne schriftlich: 568 − 234", loesung: ["334"], platzhalter: "Zahl", erklaerung: "8−4=4, 6−3=3, 5−2=3 → 334." },
  { typ: "input", frage: "Rechne schriftlich: 625 − 348", loesung: ["277"], platzhalter: "Zahl", erklaerung: "625 − 348 = 277. Probe: 277 + 348 = 625." },
  { typ: "input", frage: "Rechne schriftlich: 700 − 265", loesung: ["435"], platzhalter: "Zahl", erklaerung: "700 − 265 = 435. Probe: 435 + 265 = 700." },
  {
    typ: "mc",
    frage: "Worauf musst du beim schriftlichen Rechnen unbedingt achten?",
    antworten: ["Einer unter Einer, Zehner unter Zehner schreiben", "Die Zahlen irgendwie untereinander schreiben", "Immer mit der größten Stelle beginnen", "Den Übertrag weglassen"],
    richtig: 0,
    erklaerung: "Stellengerecht untereinander: Einer unter Einer, Zehner unter Zehner, Hunderter unter Hunderter.",
  },
  {
    typ: "mc",
    frage: "Bei 38 + 25 rechnest du 8 + 5 = 13. Was machst du mit der 1?",
    antworten: ["Als Übertrag zur Zehnerstelle dazu", "Weglassen", "Als Einer aufschreiben", "Am Ende abziehen"],
    richtig: 0,
    erklaerung: "13 = 3 Einer und 1 Zehner — die 1 wandert als Übertrag zu den Zehnern.",
  },
  {
    typ: "mc",
    frage: "Wie prüfst du 512 − 178 = 334?",
    antworten: ["334 + 178 rechnen — es muss 512 herauskommen", "334 − 178 rechnen", "512 + 178 rechnen", "einfach glauben"],
    richtig: 0,
    erklaerung: "Probe bei Minus: Ergebnis plus abgezogene Zahl = Anfangszahl. 334 + 178 = 512 ✓",
  },
  {
    typ: "luecke",
    frage: "Rechne schriftlich.",
    segmente: ["123 + 456 = ", { luecke: ["579"] }, " und 999 − 111 = ", { luecke: ["888"] }, "."],
    erklaerung: "123 + 456 = 579 und 999 − 111 = 888.",
  },
  {
    typ: "zuordnen",
    frage: "Ordne jeder Aufgabe das Ergebnis zu.",
    paare: [
      { links: "200 + 300", rechts: "500" },
      { links: "450 + 450", rechts: "900" },
      { links: "800 − 150", rechts: "650" },
      { links: "1000 − 250", rechts: "750" },
    ],
    erklaerung: "200+300=500; 450+450=900; 800−150=650; 1000−250=750.",
  },
  { typ: "input", frage: "In einer Schule sind 328 Mädchen und 296 Buben. Wie viele Kinder sind das zusammen?", loesung: ["624"], platzhalter: "Zahl", erklaerung: "328 + 296 = 624 Kinder." },
  { typ: "input", frage: "Ein Buch hat 350 Seiten. Paul hat schon 185 Seiten gelesen. Wie viele Seiten fehlen noch?", loesung: ["165"], platzhalter: "Zahl", erklaerung: "350 − 185 = 165 Seiten." },
  { typ: "input", frage: "Rechne schriftlich: 409 + 391", loesung: ["800"], platzhalter: "Zahl", erklaerung: "409 + 391 = 800." },
  {
    typ: "sortieren",
    frage: "Ordne die Ergebnisse von klein nach groß: 100 + 250, 900 − 600, 400 + 90, 1000 − 350",
    richtig: ["900 − 600", "100 + 250", "400 + 90", "1000 − 350"],
    erklaerung: "300 < 350 < 490 < 650.",
  },
];

export default SCHRIFTLICH_GS3;
