// ============================================================================
// Interaktive Aufgaben — Strahlensätze & Ähnlichkeit · Gymnasium Kl. 9
// Ähnlichkeit, Vergrößerungsfaktor, Maßstab, Strahlensatz-Verhältnisse.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const STRAHLENSATZ_GYM9: Aufgabe[] = [
  {
    typ: "mc",
    frage: "Ähnliche Figuren haben …",
    antworten: ["dieselbe Form, aber verschiedene Größe", "dieselbe Größe", "denselben Flächeninhalt", "nichts gemeinsam"],
    richtig: 0,
    erklaerung: "Ähnliche Figuren sehen gleich aus (gleiche Form/Winkel), können aber unterschiedlich groß sein.",
  },
  { typ: "input", frage: "Ein Dreieck wird mit dem Faktor 3 vergrößert. Aus einer 4 cm langen Seite werden … cm?", loesung: ["12"], einheit: "cm", platzhalter: "Zahl", erklaerung: "4 · 3 = 12 cm." },
  { typ: "input", frage: "Vergrößerungsfaktor 2: Aus 5 cm werden … cm?", loesung: ["10"], einheit: "cm", platzhalter: "Zahl", erklaerung: "5 · 2 = 10 cm." },
  { typ: "input", frage: "Strahlensatz: Auf einem Strahl 2 cm und 6 cm, auf dem anderen 3 cm und x. Wie groß ist x?", loesung: ["9"], einheit: "cm", platzhalter: "Zahl", erklaerung: "2/6 = 3/x → x = 3 · 6 : 2 = 9 cm." },
  {
    typ: "luecke",
    frage: "Zwei Strecken im Verhältnis 1 : 3.",
    segmente: ["Ist die kleine Strecke 4 cm lang, dann ist die große ", { luecke: ["12"] }, " cm lang."],
    erklaerung: "4 · 3 = 12 cm.",
  },
  { typ: "input", frage: "Ein Foto 10 cm × 15 cm wird mit dem Faktor 2 vergrößert. Wie lang ist die längere Seite dann?", loesung: ["30"], einheit: "cm", platzhalter: "Zahl", erklaerung: "15 · 2 = 30 cm." },
  {
    typ: "mc",
    frage: "Bei ähnlichen Dreiecken sind die einander entsprechenden Winkel …",
    antworten: ["gleich groß", "verschieden", "alle 90°", "zusammen 180°"],
    richtig: 0,
    erklaerung: "Ähnliche Dreiecke haben paarweise gleich große Winkel.",
  },
  { typ: "input", frage: "Maßstab 1 : 100. 2 cm auf der Karte sind in Wirklichkeit wie viele cm?", loesung: ["200"], einheit: "cm", platzhalter: "Zahl", erklaerung: "2 · 100 = 200 cm." },
  { typ: "input", frage: "Maßstab 1 : 50. 4 cm auf dem Plan sind in Wirklichkeit wie viele cm?", loesung: ["200"], einheit: "cm", platzhalter: "Zahl", erklaerung: "4 · 50 = 200 cm." },
  { typ: "input", frage: "Strahlensatz: 4 cm und 8 cm auf einem Strahl, 5 cm und x auf dem anderen. Wie groß ist x?", loesung: ["10"], einheit: "cm", platzhalter: "Zahl", erklaerung: "4/8 = 5/x → x = 5 · 8 : 4 = 10 cm." },
  {
    typ: "mc",
    frage: "Vergrößert man eine Figur mit dem Faktor 2, wird ihr Flächeninhalt …",
    antworten: ["4-mal so groß", "2-mal so groß", "gleich", "8-mal so groß"],
    richtig: 0,
    erklaerung: "Die Fläche wächst mit dem Quadrat des Faktors: 2² = 4.",
  },
  { typ: "input", frage: "Ein Baum wirft einen 6 m langen Schatten. Ein 1 m hoher Stab wirft gleichzeitig 2 m Schatten. Wie hoch ist der Baum?", loesung: ["3"], einheit: "m", platzhalter: "Zahl", erklaerung: "Höhe/Schatten ist gleich: h/6 = 1/2 → h = 3 m." },
  { typ: "input", frage: "Zwei Strecken im Verhältnis 2 : 5. Die kleine ist 6 cm. Wie lang ist die große?", loesung: ["15"], einheit: "cm", platzhalter: "Zahl", erklaerung: "6 : 2 = 3, dann 3 · 5 = 15 cm." },
  { typ: "input", frage: "Maßstab 1 : 1000. 3 cm auf der Karte sind in Wirklichkeit wie viele Meter?", loesung: ["30"], einheit: "m", platzhalter: "Zahl", erklaerung: "3 · 1000 = 3000 cm = 30 m." },
  {
    typ: "mc",
    frage: "Zwei beliebige Quadrate sind zueinander immer …",
    antworten: ["ähnlich", "kongruent", "gleich groß", "verschieden geformt"],
    richtig: 0,
    erklaerung: "Alle Quadrate haben dieselbe Form (nur andere Größe) — sie sind ähnlich.",
  },
];

export default STRAHLENSATZ_GYM9;
