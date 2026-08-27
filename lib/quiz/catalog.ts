// ============================================================================
// QUIZ-KATALOG — Bayern (LehrplanPLUS)
// ----------------------------------------------------------------------------
// Diese Datei enthaelt NUR die Struktur (Schularten, Klassen, Themen-Namen).
// Sie ist bewusst klein und ohne Fragen-Inhalte, damit sie gefahrlos auch im
// Browser (Client-Komponente) genutzt werden kann.
//
// Die eigentlichen (geprueften) Fragen liegen server-seitig unter
//   lib/quiz/daten/*.ts   und werden ueber  lib/quiz/store.ts  ausgeliefert.
//
// Grundsatz: KEINE Live-KI mehr. Ein Thema ist erst spielbar, wenn dafuer
// gepruefte Fragen hinterlegt sind (sonst zeigt die App "Bald verfuegbar").
// ============================================================================

export type Fach = "mathe" | "physik";

export type SchulartId =
  | "grundschule"
  | "mittelschule"
  | "hauptschule"
  | "realschule"
  | "gymnasium";

export type Frage = {
  frage: string;
  antworten: string[]; // genau 4
  richtig: number; // Index 0..3 der korrekten Antwort
  erklaerung: string; // kurzer Loesungsweg / Begruendung
};

// Fragen einer Schulart+Fach: KlassenFragen[klasse][thema(ohne Emoji)] = Frage[]
export type KlassenFragen = Record<number, Record<string, Frage[]>>;

export type Schulart = {
  id: SchulartId;
  name: string; // Anzeigename
  kurz: string; // kurzes Label
  klassen: number[]; // in Bayern uebliche Jahrgangsstufen dieser Schulart
};

// Reihenfolge = Anzeige-Reihenfolge in der Auswahl.
export const SCHULARTEN: Schulart[] = [
  { id: "grundschule", name: "Grundschule", kurz: "GS", klassen: [1, 2, 3, 4] },
  { id: "mittelschule", name: "Mittelschule", kurz: "MS", klassen: [5, 6, 7, 8, 9, 10] },
  { id: "hauptschule", name: "Hauptschule", kurz: "HS", klassen: [5, 6, 7, 8, 9] },
  { id: "realschule", name: "Realschule", kurz: "RS", klassen: [5, 6, 7, 8, 9, 10] },
  { id: "gymnasium", name: "Gymnasium", kurz: "GY", klassen: [5, 6, 7, 8, 9, 10, 11, 12, 13] },
];

// Klassen-weise Themenlisten. Schluessel: KATALOG[fach][schulart][klasse] = string[]
// Nur vorhandene (fach, schulart, klasse)-Kombinationen sind spielbar.
// (Grundschule hat kein eigenes Fach Physik — dort nur Mathematik.)
type ThemenBaum = Partial<Record<Fach, Partial<Record<SchulartId, Record<number, string[]>>>>>;

export const KATALOG: ThemenBaum = {
  mathe: {
    grundschule: {
      1: [
        "🔢 Zahlen bis 20",
        "➕ Plus & Minus bis 20",
        "🧩 Zahlen zerlegen",
        "📏 Längen & Größenvergleich",
        "💶 Geld bis 20 Cent/Euro",
        "🔷 Formen & Muster",
      ],
      2: [
        "🔢 Zahlen bis 100",
        "➕ Addieren & Subtrahieren bis 100",
        "✖️ Einmaleins",
        "🕐 Uhrzeit ablesen",
        "📏 Längen (m, cm)",
        "💶 Geld rechnen",
      ],
      3: [
        "🔢 Zahlen bis 1000",
        "📝 Schriftlich Addieren & Subtrahieren",
        "✖️ Malnehmen & Teilen",
        "📏 Längen & Gewichte",
        "🕐 Zeitspannen",
        "🔷 Geometrie: Formen & Flächen",
      ],
      4: [
        "🔢 Zahlen bis 1 Million",
        "📝 Schriftlich Multiplizieren",
        "📝 Schriftlich Dividieren",
        "🔄 Größen umrechnen",
        "📚 Sachaufgaben",
        "📐 Umfang & Fläche (Rechteck)",
      ],
    },
    mittelschule: {
      5: [
        "🔢 Natürliche Zahlen",
        "➕ Grundrechenarten",
        "📏 Größen & Einheiten",
        "📐 Umfang & Fläche",
        "🔢 Teilbarkeit",
      ],
      6: [
        "➗ Bruchrechnen — Grundlagen",
        "🔢 Dezimalzahlen",
        "📊 Prozent — Einstieg",
        "📏 Maßstab & Größen",
        "📐 Flächen & Körper",
      ],
      7: [
        "📊 Prozentrechnung",
        "🧮 Dreisatz",
        "➖ Rechnen mit negativen Zahlen",
        "🔣 Terme & Gleichungen (Einstieg)",
        "📐 Flächen (Dreieck, Parallelogramm)",
      ],
      8: [
        "💰 Zinsrechnung",
        "📈 Zuordnungen & Diagramme",
        "🔣 Gleichungen lösen",
        "📦 Volumen (Quader, Prisma)",
        "🎲 Wahrscheinlichkeit (Einstieg)",
      ],
      9: [
        "📐 Satz des Pythagoras",
        "⭕ Kreis: Umfang & Fläche",
        "💰 Zinsrechnung vertieft",
        "📦 Oberfläche & Volumen",
        "📊 Daten & Statistik",
      ],
      10: [
        "📈 Lineare Funktionen",
        "📉 Quadratische Zusammenhänge",
        "📐 Trigonometrie (Einstieg)",
        "💰 Prozent & Zins im Alltag",
        "🎲 Wahrscheinlichkeit",
      ],
    },
    hauptschule: {
      5: [
        "🔢 Natürliche Zahlen",
        "➕ Grundrechenarten",
        "📏 Größen & Einheiten",
        "📐 Umfang & Fläche",
      ],
      6: [
        "➗ Bruchrechnen — Grundlagen",
        "🔢 Dezimalzahlen",
        "📊 Prozent — Einstieg",
        "📏 Maßstab & Größen",
      ],
      7: [
        "📊 Prozentrechnung",
        "🧮 Dreisatz",
        "➖ Negative Zahlen",
        "📐 Flächenberechnung",
      ],
      8: [
        "💰 Zinsrechnung",
        "🔣 Gleichungen (Einstieg)",
        "📦 Volumen (Quader)",
        "📈 Zuordnungen",
      ],
      9: [
        "📐 Satz des Pythagoras",
        "⭕ Kreis: Umfang & Fläche",
        "💰 Rechnen im Alltag",
        "📊 Daten & Diagramme",
      ],
    },
    realschule: {
      5: [
        "🔢 Natürliche Zahlen & Stellenwert",
        "➕ Rechnen mit natürlichen Zahlen",
        "📏 Größen & Einheiten",
        "📐 Umfang & Flächeninhalt (Rechteck)",
        "🔢 Teilbarkeit & Primzahlen",
      ],
      6: [
        "➗ Bruchrechnen",
        "🔢 Dezimalbrüche",
        "📊 Prozent — Grundlagen",
        "➖ Ganze Zahlen (negativ)",
        "📐 Flächen & Winkel",
      ],
      7: [
        "📊 Prozent- & Zinsrechnung",
        "🧮 Dreisatz & Proportionalität",
        "🔣 Terme & Gleichungen",
        "📐 Dreiecke & Flächen",
        "🎲 Wahrscheinlichkeit",
      ],
      8: [
        "📈 Lineare Funktionen",
        "🧩 Gleichungssysteme",
        "🔢 Potenzen & Wurzeln",
        "📦 Körper: Volumen & Oberfläche",
        "📊 Statistik",
      ],
      9: [
        "📐 Satz des Pythagoras",
        "📐 Trigonometrie (sin, cos, tan)",
        "⭕ Kreis & Kreisteile",
        "📉 Quadratische Funktionen",
        "📦 Prisma, Zylinder",
      ],
      10: [
        "📉 Quadratische Gleichungen",
        "📈 Exponentielles Wachstum",
        "📐 Trigonometrie vertieft",
        "🌐 Kugel, Kegel, Pyramide",
        "🎲 Stochastik",
      ],
    },
    gymnasium: {
      5: [
        "🔢 Natürliche Zahlen & Stellenwert",
        "➕ Rechnen mit natürlichen Zahlen",
        "✖️ Multiplizieren & Dividieren",
        "🔢 Teilbarkeit & Primzahlen",
        "📏 Größen & Einheiten",
        "📐 Umfang & Flächeninhalt",
        "🧭 Geometrie & Koordinaten",
        "🪞 Achsensymmetrie",
      ],
      6: [
        "➗ Bruchrechnen",
        "🔢 Dezimalbrüche",
        "➖ Ganze Zahlen (negativ)",
        "📊 Prozent — Grundlagen",
        "🔢 Teilbarkeit & Primfaktoren",
        "📏 Rechnen mit Größen",
        "📐 Flächeninhalt & Umfang",
        "📦 Volumen & Oberfläche",
        "📐 Winkel",
        "🪞 Symmetrie",
        "📊 Daten & Diagramme",
      ],
      7: [
        "📊 Prozent- & Zinsrechnung",
        "🧮 Proportionalität & Dreisatz",
        "🔣 Terme & Termumformung",
        "⚖️ Lineare Gleichungen",
        "📐 Winkel & Dreiecke",
        "🎲 Wahrscheinlichkeit",
      ],
      8: [
        "📈 Lineare Funktionen",
        "🧩 Lineare Gleichungssysteme",
        "📐 Binomische Formeln",
        "√ Wurzeln & reelle Zahlen",
        "⭕ Kreis: Umfang & Fläche",
        "🎲 Wahrscheinlichkeit (mehrstufig)",
      ],
      9: [
        "📐 Satz des Pythagoras",
        "📉 Quadratische Funktionen",
        "📊 pq-Formel & quadratische Gleichungen",
        "📐 Strahlensätze & Ähnlichkeit",
        "🔢 Potenzen & Potenzgesetze",
        "📐 Trigonometrie (sin, cos, tan)",
      ],
      10: [
        "📈 Exponentialfunktionen",
        "📉 Logarithmen",
        "📊 Wachstum & Zerfall",
        "🌐 Körper: Pyramide, Kegel, Kugel",
        "📐 Trigonometrie: Seiten & Winkel",
        "🎲 Stochastik",
      ],
      11: [
        "📊 Ableitung — Grundlagen",
        "🔗 Ableitungsregeln (Produkt- & Kettenregel)",
        "📈 Kurvendiskussion",
        "∫ Integralrechnung — Einstieg",
        "➡️ Vektoren — Grundlagen",
      ],
      12: [
        "∫ Integralrechnung vertieft",
        "📊 e- und ln-Funktion",
        "➡️ Geraden & Ebenen im Raum",
        "🎲 Stochastik (Binomialverteilung)",
      ],
      13: [
        "📊 Analysis (Abitur)",
        "➡️ Analytische Geometrie (Abitur)",
        "🎲 Stochastik (Abitur)",
      ],
    },
  },
  physik: {
    mittelschule: {
      7: ["🏃 Geschwindigkeit & Bewegung", "💪 Kräfte", "⚡ Stromkreis"],
      8: ["⚡ Ohm'sches Gesetz", "🔥 Energie & Wärme", "🧲 Magnetismus"],
      9: ["⚙️ Energie & Leistung", "⚡ Elektrische Energie", "💡 Optik"],
    },
    hauptschule: {
      7: ["🏃 Bewegung & Geschwindigkeit", "💪 Kräfte", "⚡ Strom"],
      8: ["⚡ Stromstärke & Spannung", "🔥 Wärme", "🧲 Magnetismus"],
      9: ["⚙️ Energie", "💡 Licht & Optik", "⚡ Elektrizität im Alltag"],
    },
    realschule: {
      7: ["🏃 Geschwindigkeit", "💪 Kräfte & Reibung", "💡 Optik: Licht & Schatten"],
      8: ["⚡ Ohm'sches Gesetz", "🔌 Reihen- & Parallelschaltung", "🔥 Wärmelehre"],
      9: ["⚙️ Mechanik: Arbeit & Energie", "🧲 Elektromagnetismus", "🌊 Schwingungen & Wellen"],
      10: ["⚛️ Atom- & Kernphysik", "⚡ Induktion", "🔭 Astronomie & Optik"],
    },
    gymnasium: {
      7: ["🏃 Geschwindigkeit & Bewegung", "💪 Kräfte", "💡 Optik: Reflexion & Brechung"],
      8: ["⚡ Elektrischer Stromkreis", "⚡ Ohm'sches Gesetz", "🔥 Wärmelehre (Temperatur, Energie)"],
      9: ["⚙️ Mechanik: Arbeit, Energie, Leistung", "🧲 Elektromagnetismus", "⚡ Elektrische Energie"],
      10: ["🏃 Kinematik & Dynamik", "🌊 Schwingungen & Wellen", "⚛️ Atom- & Kernphysik"],
      11: ["⚡ Elektrische & magnetische Felder", "🌊 Wellenoptik", "⚛️ Quantenphysik (Einstieg)"],
      12: ["🌌 Quantenphysik", "☢️ Kernphysik", "🔭 Astrophysik"],
    },
  },
};

// --- Hilfsfunktionen (rein strukturell, ohne Fragen-Inhalte) ------------------

export function schulartById(id: string): Schulart | undefined {
  return SCHULARTEN.find((s) => s.id === id);
}

/** Klassen einer Schulart, die fuer ein Fach ueberhaupt Themen haben. */
export function klassenFuer(fach: Fach, schulart: SchulartId): number[] {
  const baum = KATALOG[fach]?.[schulart];
  if (!baum) return [];
  return Object.keys(baum)
    .map((k) => parseInt(k, 10))
    .filter((k) => Array.isArray(baum[k]) && baum[k].length > 0)
    .sort((a, b) => a - b);
}

/** Themen (mit Emoji-Praefix) fuer eine konkrete Auswahl. */
export function themenFuer(fach: Fach, schulart: SchulartId, klasse: number): string[] {
  return KATALOG[fach]?.[schulart]?.[klasse] ?? [];
}

/** Emoji-Praefix entfernen — so wird das Thema als Schluessel/Anzeige normalisiert. */
export function themaOhneEmoji(s: string): string {
  return s.replace(/^[^a-zA-ZÄÖÜäöüß0-9]+/, "").trim();
}

/** Eindeutiger Schluessel fuer Verfuegbarkeit/Store: fach|schulart|klasse|thema(ohne Emoji). */
export function themaKey(fach: string, schulart: string, klasse: number, thema: string): string {
  return `${fach}|${schulart}|${klasse}|${themaOhneEmoji(thema)}`;
}
