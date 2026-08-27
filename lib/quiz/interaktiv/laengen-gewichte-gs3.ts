// ============================================================================
// Interaktive Aufgaben — Längen & Gewichte · Grundschule Kl. 3 · Bayern
// km, m, cm und kg, g: umrechnen, schätzen, vergleichen, Sachaufgaben.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const LAENGEN_GEWICHTE_GS3: Aufgabe[] = [
  { typ: "input", frage: "Wie viele Meter sind 1 km?", loesung: ["1000", "1 000"], einheit: "m", platzhalter: "Zahl", erklaerung: "1 km = 1 000 m." },
  { typ: "input", frage: "Wie viele Gramm sind 1 kg?", loesung: ["1000", "1 000"], einheit: "g", platzhalter: "Zahl", erklaerung: "1 kg = 1 000 g." },
  { typ: "input", frage: "Wie viele Meter sind 2 km?", loesung: ["2000", "2 000"], einheit: "m", platzhalter: "Zahl", erklaerung: "2 · 1 000 = 2 000 m." },
  { typ: "input", frage: "Wie viele Gramm sind ein halbes Kilogramm?", loesung: ["500"], einheit: "g", platzhalter: "Zahl", erklaerung: "1 000 : 2 = 500 g." },
  { typ: "input", frage: "Wie viele Zentimeter sind 3 m?", loesung: ["300"], einheit: "cm", platzhalter: "Zahl", erklaerung: "3 · 100 = 300 cm." },
  {
    typ: "mc",
    frage: "Was wiegt ungefähr 1 kg?",
    antworten: ["ein Päckchen Mehl", "eine Feder", "ein Auto", "ein Radiergummi"],
    richtig: 0,
    erklaerung: "Ein Päckchen Mehl wiegt üblicherweise 1 kg.",
  },
  {
    typ: "mc",
    frage: "Was misst man in Kilometern?",
    antworten: ["den Weg zur nächsten Stadt", "die Länge eines Bleistifts", "die Höhe eines Tisches", "die Breite eines Buches"],
    richtig: 0,
    erklaerung: "Lange Wege misst man in Kilometern.",
  },
  {
    typ: "mc",
    frage: "Was ist schwerer: 900 g oder 1 kg?",
    antworten: ["1 kg", "900 g", "beides gleich", "das weiß man nicht"],
    richtig: 0,
    erklaerung: "1 kg = 1 000 g, und 1 000 g > 900 g.",
  },
  {
    typ: "luecke",
    frage: "Umrechnen.",
    segmente: ["4 km = ", { luecke: ["4000", "4 000"] }, " m und 2 kg = ", { luecke: ["2000", "2 000"] }, " g."],
    erklaerung: "4 · 1 000 = 4 000 m und 2 · 1 000 = 2 000 g.",
  },
  {
    typ: "zuordnen",
    frage: "Ordne jedem Ding das passende Gewicht zu.",
    paare: [
      { links: "Tafel Schokolade", rechts: "100 g" },
      { links: "Packung Zucker", rechts: "1 kg" },
      { links: "Apfel", rechts: "150 g" },
      { links: "Schulranzen (gepackt)", rechts: "5 kg" },
    ],
    erklaerung: "Schokolade ≈ 100 g, Zucker = 1 kg, Apfel ≈ 150 g, Schulranzen ≈ 5 kg.",
  },
  { typ: "input", frage: "Mia wiegt 28 kg, ihr kleiner Bruder 19 kg. Wie viele Kilogramm ist Mia schwerer?", loesung: ["9"], einheit: "kg", platzhalter: "Zahl", erklaerung: "28 − 19 = 9 kg." },
  { typ: "input", frage: "Ein Brot wiegt 750 g, ein zweites 250 g. Wie viele Gramm wiegen beide zusammen?", loesung: ["1000", "1 000"], einheit: "g", platzhalter: "Zahl", erklaerung: "750 + 250 = 1 000 g (= 1 kg)." },
  { typ: "input", frage: "Der Schulweg ist 800 m lang. Wie viele Meter läufst du hin und zurück?", loesung: ["1600", "1 600"], einheit: "m", platzhalter: "Zahl", erklaerung: "800 + 800 = 1 600 m." },
  {
    typ: "sortieren",
    frage: "Ordne die Gewichte von leicht nach schwer: 2 kg, 800 g, 1 kg, 1 500 g",
    richtig: ["800 g", "1 kg", "1 500 g", "2 kg"],
    erklaerung: "800 g < 1 000 g (= 1 kg) < 1 500 g < 2 000 g (= 2 kg).",
  },
  {
    typ: "sortieren",
    frage: "Ordne die Längen von kurz nach lang: 1 km, 50 m, 700 m, 2 km",
    richtig: ["50 m", "700 m", "1 km", "2 km"],
    erklaerung: "50 m < 700 m < 1 000 m (= 1 km) < 2 000 m (= 2 km).",
  },
];

export default LAENGEN_GEWICHTE_GS3;
