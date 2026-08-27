// ============================================================================
// Interaktive Aufgaben — Bruchrechnen · Gymnasium Klasse 6 · Bayern
// ----------------------------------------------------------------------------
// Prototyp im Anton-Stil: gemischte Aufgaben-Typen (eintippen, Lückentext,
// zuordnen, sortieren, Multiple Choice), aufsteigend im Anspruch, das ganze
// Thema abdeckend. Jede Lösung von Hand geprüft.
//
// Bei Eingabe-Aufgaben mit Bruch-Ergebnis wird die VOLLSTÄNDIG GEKÜRZTE Form
// verlangt (das gehört zum Können) — die Aufgabe sagt das jeweils dazu.
// ============================================================================

import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

const BRUCHRECHNEN_GYM6: Aufgabe[] = [
  {
    typ: "input",
    frage: "Kürze den Bruch 8/12 vollständig.",
    loesung: ["2/3"],
    platzhalter: "z. B. 2/3",
    erklaerung: "8 und 12 haben den größten gemeinsamen Teiler 4: 8 : 4 = 2, 12 : 4 = 3. Also 2/3.",
  },
  {
    typ: "input",
    frage: "Erweitere 3/4 auf den Nenner 20. Wie heißt der neue Zähler?",
    loesung: ["15"],
    platzhalter: "Zahl",
    erklaerung: "20 : 4 = 5, also Zähler und Nenner mal 5: 3 · 5 = 15. Der Bruch ist 15/20.",
  },
  {
    typ: "sortieren",
    frage: "Ordne die Brüche der Größe nach — beginne beim kleinsten.",
    hinweis: "Tipp: Bring sie auf denselben Nenner oder rechne in Dezimalzahlen um.",
    richtig: ["2/3", "3/4", "5/6"],
    erklaerung: "Hauptnenner 12: 2/3 = 8/12, 3/4 = 9/12, 5/6 = 10/12. Also 2/3 < 3/4 < 5/6.",
  },
  {
    typ: "input",
    frage: "Berechne 2/3 + 1/4.",
    loesung: ["11/12"],
    platzhalter: "z. B. 5/6",
    erklaerung: "Hauptnenner 12: 2/3 = 8/12, 1/4 = 3/12. Zusammen 8/12 + 3/12 = 11/12.",
  },
  {
    typ: "luecke",
    frage: "Rechne 5/6 − 3/8 Schritt für Schritt aus.",
    segmente: [
      "Hauptnenner von 6 und 8 ist ",
      { luecke: ["24"] },
      ". Dann ist 5/6 = ",
      { luecke: ["20"] },
      "/24 und 3/8 = ",
      { luecke: ["9"] },
      "/24. Das Ergebnis ist ",
      { luecke: ["11"] },
      "/24.",
    ],
    erklaerung: "Der Hauptnenner ist 24. 5/6 = 20/24, 3/8 = 9/24. 20/24 − 9/24 = 11/24.",
  },
  {
    typ: "input",
    frage: "Berechne 3/4 · 2/3 und kürze vollständig.",
    loesung: ["1/2"],
    platzhalter: "z. B. 1/2",
    erklaerung: "Zähler mal Zähler, Nenner mal Nenner: 3 · 2 = 6, 4 · 3 = 12, also 6/12 = 1/2.",
  },
  {
    typ: "input",
    frage: "Berechne 5/8 : 5/6 und kürze vollständig.",
    loesung: ["3/4"],
    platzhalter: "z. B. 3/4",
    erklaerung: "Durch einen Bruch teilen = mit dem Kehrwert malnehmen: 5/8 · 6/5 = 30/40 = 3/4.",
  },
  {
    typ: "zuordnen",
    frage: "Ordne jedem Bruch die passende Dezimalzahl zu.",
    paare: [
      { links: "1/2", rechts: "0,5" },
      { links: "1/4", rechts: "0,25" },
      { links: "3/4", rechts: "0,75" },
      { links: "1/5", rechts: "0,2" },
    ],
    erklaerung: "1/2 = 0,5; 1/4 = 0,25; 3/4 = 0,75; 1/5 = 2/10 = 0,2.",
  },
  {
    typ: "input",
    frage: "Wie viele Minuten sind 3/4 einer Stunde?",
    loesung: ["45"],
    einheit: "min",
    platzhalter: "Zahl",
    erklaerung: "Eine Stunde hat 60 min. 60 : 4 = 15 (das ist 1/4), mal 3 = 45 min.",
  },
  {
    typ: "input",
    frage: "5/8 von 2 kg sind wie viele Gramm?",
    loesung: ["1250"],
    einheit: "g",
    platzhalter: "Zahl",
    erklaerung: "2 kg = 2000 g. 2000 : 8 = 250, mal 5 = 1250 g.",
  },
  {
    typ: "input",
    frage: "3/5 eines Geldbetrags sind 30 €. Wie groß ist der ganze Betrag?",
    loesung: ["50"],
    einheit: "€",
    platzhalter: "Zahl",
    hinweis: "Finde zuerst 1/5 heraus.",
    erklaerung: "3/5 sind 30 €, also 1/5 = 30 : 3 = 10 €. Das Ganze sind 5 · 10 = 50 €.",
  },
  {
    typ: "mc",
    frage: "Was passiert mit dem Wert eines Bruchs, wenn du Zähler und Nenner mit derselben Zahl malnimmst (erweitern)?",
    antworten: ["Er bleibt gleich.", "Er wird größer.", "Er wird kleiner.", "Er verdoppelt sich."],
    richtig: 0,
    erklaerung: "Beim Erweitern ändert sich nur die Darstellung, nicht der Wert: 1/2 = 2/4 = 3/6.",
  },
  {
    typ: "input",
    frage: "Berechne 2 1/4 − 3/4. (Gib eine gemischte Zahl oder einen Bruch an.)",
    loesung: ["1 1/2", "3/2", "1,5"],
    platzhalter: "z. B. 1 1/2",
    erklaerung: "2 1/4 = 9/4. Dann 9/4 − 3/4 = 6/4 = 1 1/2.",
  },
  {
    typ: "input",
    frage: "Berechne 1 2/3 + 2 3/4. (Als gemischte Zahl.)",
    loesung: ["4 5/12", "53/12"],
    platzhalter: "z. B. 4 5/12",
    erklaerung: "Ganze: 1 + 2 = 3. Brüche: 2/3 + 3/4 = 8/12 + 9/12 = 17/12 = 1 5/12. Zusammen 4 5/12.",
  },
  {
    typ: "luecke",
    frage: "Fülle die Lücke aus.",
    segmente: ["3/4 von 20 € sind ", { luecke: ["15"] }, " €."],
    erklaerung: "20 € : 4 = 5 € (das ist 1/4), mal 3 = 15 €.",
  },
  {
    typ: "input",
    frage: "Berechne 1/2 + 1/2 · 1/3. (Denk an Punkt vor Strich!)",
    loesung: ["2/3"],
    platzhalter: "z. B. 2/3",
    erklaerung: "Zuerst 1/2 · 1/3 = 1/6, dann 1/2 + 1/6 = 3/6 + 1/6 = 4/6 = 2/3.",
  },
  {
    typ: "sortieren",
    frage: "Ordne der Größe nach — beginne beim kleinsten.",
    richtig: ["3/8", "1/2", "5/8", "3/4"],
    erklaerung: "Auf Achtel bringen: 3/8, 4/8, 5/8, 6/8. Also 3/8 < 1/2 < 5/8 < 3/4.",
  },
  {
    typ: "mc",
    frage: "Welcher dieser Brüche ist am größten?",
    antworten: ["7/10", "2/3", "4/6", "3/5"],
    richtig: 0,
    erklaerung: "Als Dezimalzahl: 7/10 = 0,7; 2/3 ≈ 0,67; 4/6 ≈ 0,67; 3/5 = 0,6. Am größten ist 7/10.",
  },
  {
    typ: "input",
    frage: "Schreibe 0,6 als vollständig gekürzten Bruch.",
    loesung: ["3/5"],
    platzhalter: "z. B. 3/5",
    erklaerung: "0,6 = 6/10. Mit 2 kürzen: 6/10 = 3/5.",
  },
  {
    typ: "zuordnen",
    frage: "Ordne jeder Rechnung ihr Ergebnis zu.",
    paare: [
      { links: "1/2 + 1/4", rechts: "3/4" },
      { links: "1/3 + 1/6", rechts: "1/2" },
      { links: "2/3 · 1/2", rechts: "1/3" },
      { links: "3/4 : 3", rechts: "1/4" },
    ],
    erklaerung: "1/2 + 1/4 = 3/4; 1/3 + 1/6 = 1/2; 2/3 · 1/2 = 1/3; 3/4 : 3 = 1/4.",
  },
];

export default BRUCHRECHNEN_GYM6;
