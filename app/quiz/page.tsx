"use client";
import { useState, useEffect, useRef } from "react";

type Fach = "mathe" | "physik";

// Katalog: pro Fach pro Klasse 15 Themen. Klasse 1-13.
const KATALOG: Record<Fach, Record<number, string[]>> = {
  mathe: {
    1: [
      "🔢 Zahlen bis 10", "🔢 Zahlen bis 20", "➕ Addition bis 10", "➖ Subtraktion bis 10",
      "➕ Addition bis 20", "➖ Subtraktion bis 20", "🔁 Verdoppeln & Halbieren", "🔢 Zahlenreihen",
      "⚖️ Mengen vergleichen", "🔷 Formen erkennen", "📏 Größenvergleich", "🕐 Uhrzeit (volle Stunden)",
      "💶 Geld zählen", "🪞 Symmetrie erkennen", "📚 Sachaufgaben",
    ],
    2: [
      "🔢 Zahlen bis 100", "🔢 Stellenwert (Zehner, Einer)", "➕ Addition bis 100", "➖ Subtraktion bis 100",
      "✖️ Einmaleins 2er-Reihe", "✖️ Einmaleins 5er-Reihe", "✖️ Einmaleins 10er-Reihe", "✖️ Einmaleins gemischt",
      "➗ Aufteilen & Verteilen", "➗ Division", "📏 Längen (cm, m)", "⚖️ Gewichte (g, kg)",
      "💶 Geld rechnen", "🕐 Uhrzeit ablesen", "📦 Würfel und Quader",
    ],
    3: [
      "🔢 Zahlen bis 1000", "🔢 Stellenwert (Hunderter)", "📝 Schriftliche Addition", "📝 Schriftliche Subtraktion",
      "✖️ Großes Einmaleins", "📝 Halbschriftliche Multiplikation", "📝 Schriftliche Multiplikation", "📝 Schriftliche Division",
      "📏 Einheiten (mm, cm, m, km)", "⚖️ Gewichte umrechnen", "🕐 Zeit (min, h)", "📦 Geometrische Körper",
      "📐 Senkrechte & parallele Linien", "🪞 Spiegelungen", "📊 Diagramme lesen",
    ],
    4: [
      "🔢 Zahlen bis Million", "📝 Schriftliche Addition (große Zahlen)", "📝 Schriftliche Subtraktion (große Zahlen)", "📝 Schriftliche Multiplikation",
      "📝 Schriftliche Division", "⚡ Rechenvorteile / Klammern", "📏 Längen umrechnen", "⚖️ Gewichte umrechnen",
      "🕐 Zeit umrechnen", "🗺️ Maßstab", "➗ Brüche (Halbe, Viertel)", "📦 Geometrische Körper",
      "📊 Diagramme", "🎲 Wahrscheinlichkeit (einfach)", "📚 Sachaufgaben",
    ],
    5: [
      "🔢 Natürliche Zahlen", "🔢 Stellenwertsystem", "📝 Schriftliches Rechnen", "➗ Brüche — Einführung",
      "🔢 Dezimalzahlen — Einführung", "📏 Größen & Einheiten", "🔄 Einheiten umrechnen", "🪞 Achsenspiegelung",
      "📐 Winkel zeichnen", "📐 Winkel messen", "🟦 Flächen Rechteck/Quadrat", "📦 Volumen Würfel/Quader",
      "🔢 Teiler und Vielfache", "🔢 Primzahlen", "📊 Diagramme",
    ],
    6: [
      "➗ Brüche — Grundlagen", "➕ Brüche addieren & subtrahieren", "✖️ Brüche multiplizieren & dividieren", "🔁 Brüche kürzen & erweitern",
      "🔢 Dezimalzahlen", "🧮 Dezimalzahlen rechnen (× ÷)", "🔟 Multiplizieren mit Zehnerpotenzen", "🔟 Dividieren mit Zehnerpotenzen",
      "⚡ Rechenvorteile", "➖ Negative Zahlen", "🔢 Rationale Zahlen", "📊 Prozent — Grundlagen",
      "📐 Winkel", "📐 Dreieckskonstruktion", "🪞 Symmetrie & Verschiebung",
    ],
    7: [
      "📊 Prozentrechnung", "💰 Zinsrechnung", "🔣 Terme aufstellen", "🔣 Terme vereinfachen",
      "🔣 Klammerregeln", "⚖️ Gleichungen lösen", "⚖️ Lineare Gleichungen", "📊 Proportionen",
      "🧮 Dreisatz", "📈 Direkte Proportionalität", "📉 Umgekehrte Proportionalität", "🎲 Wahrscheinlichkeit",
      "📐 Dreiecke konstruieren", "🔺 Flächen Dreieck", "📦 Volumen Prisma",
    ],
    8: [
      "📈 Lineare Funktionen", "🧩 Lineare Gleichungssysteme", "📐 Binomische Formeln", "➗ Bruchgleichungen",
      "√ Wurzeln", "🔢 Potenzen", "📐 Satz des Pythagoras", "⭕ Kreis: Umfang",
      "⭕ Kreis: Flächeninhalt", "🎲 Wahrscheinlichkeit (mehrstufig)", "📊 Statistik: Mittelwert & Median", "≠ Ungleichungen",
      "💰 Zinseszins", "📦 Volumen Zylinder", "🔢 Reelle Zahlen",
    ],
    9: [
      "📉 Quadratische Funktionen", "📊 pq-Formel", "📊 Mitternachtsformel", "📏 Strahlensätze",
      "📐 Ähnlichkeit", "📐 Trigonometrie — Sinus", "📐 Trigonometrie — Cosinus & Tangens", "📐 Höhensatz & Kathetensatz",
      "📦 Volumen Pyramide", "🔺 Volumen Kegel", "🌐 Volumen Kugel", "📦 Oberfläche Körper",
      "📈 Exponentialfunktionen — Einstieg", "🎲 Wahrscheinlichkeit vertieft", "📊 Quadratische Gleichungen Anwendung",
    ],
    10: [
      "📈 Exponentialfunktionen", "📉 Logarithmen", "📊 Wachstum & Zerfall", "📐 Trigonometrische Funktionen",
      "📐 Sinussatz", "📐 Kosinussatz", "➡️ Vektoren — Grundlagen", "⭕ Kreisgleichung",
      "🔢 Folgen", "🔢 Reihen", "🔣 Polynomdivision", "📊 Funktionsuntersuchung",
      "💰 Zinseszins-Anwendungen", "🎲 Stochastik vertieft", "📊 Beschreibende Statistik",
    ],
    11: [
      "📊 Ableitungen — Grundlagen", "📊 Ableitungsregeln", "📊 Produkt- & Kettenregel", "📈 Extremstellen",
      "📉 Wendepunkte", "📊 Kurvendiskussion", "📈 Funktionsfamilien", "📐 Tangenten",
      "∫ Stammfunktionen", "∫ Integralrechnung — Grundlagen", "🟦 Flächeninhalte mit Integralen", "➡️ Vektoren — Skalarprodukt",
      "📐 Geraden im Raum", "🎲 Binomialverteilung", "🎲 Hypothesentests",
    ],
    12: [
      "∫ Integralrechnung vertieft", "📦 Volumenintegrale", "📊 e-Funktion ableiten", "📊 ln-Funktion ableiten",
      "📈 Differentialgleichungen", "➡️ Vektoren im Raum", "📐 Geraden und Ebenen", "📐 Schnittgeraden",
      "📐 Schnittwinkel", "📐 Lagebeziehungen", "🔢 Matrizen — Grundlagen", "📊 Normalverteilung",
      "🎲 Stochastische Prozesse", "📚 Abi: Analysis", "📚 Abi: Geometrie",
    ],
    13: [
      "📊 Komplette Kurvendiskussion", "📈 Komplexe Funktionsfamilien", "∫ Integrationsverfahren", "📦 Volumenberechnung",
      "📈 Differentialgleichungen vertieft", "➡️ Vektorgeometrie komplett", "🔢 Matrizen vertieft", "🔢 Eigenwerte",
      "🧩 Gauß-Verfahren", "🎲 Stochastik komplett", "🎲 Hypothesentests vertieft", "📊 Konfidenzintervalle",
      "📊 Markov-Ketten", "🔢 Komplexe Zahlen", "📚 Abi-Mischaufgaben",
    ],
  },
  physik: {
    1: [
      "💧 Wasser und Eis", "🌤 Wetter", "🌙 Tag und Nacht", "🔥 Wärme und Kälte",
      "☀️ Sonne, Mond, Sterne", "🛟 Schwimmen und Sinken", "🧲 Magnete", "💡 Licht und Schatten",
      "🪞 Spiegel", "🔊 Schall (Hören)", "🌱 Pflanzen wachsen", "👁️ Meine fünf Sinne",
      "🍂 Jahreszeiten", "💡 Strom (Lampe, Schalter)", "🌍 Unsere Erde",
    ],
    2: [
      "💧 Aggregatzustände (fest, flüssig, gas)", "🧲 Magnetismus — was zieht an?", "🔌 Stromkreis — einfach", "🪞 Reflexion am Spiegel",
      "🔊 Schall und Wellen", "🛟 Schwimmen und Sinken vertieft", "🔥 Wärmeausdehnung", "🌈 Licht und Farben",
      "🌤 Wetter beobachten", "🪐 Sonnensystem", "👁️ Sinne vertieft", "🌱 Pflanzen und Sonne",
      "🧭 Magnetfeld der Erde", "🌖 Mond und Sterne", "💧 Wasser-Kreislauf",
    ],
    3: [
      "💧 Aggregatzustände vertieft", "❄️ Schmelzen und Erstarren", "💨 Verdunsten und Kondensieren", "🔥 Wärmequellen",
      "🌡️ Wärmeleiter", "🔌 Stromkreis bauen", "💡 Schalter & Leiter", "🧲 Magnete vertieft",
      "🪨 Eisen und Magnete", "🌒 Licht und Schatten vertieft", "🪞 Spiegel und Reflexion", "🔍 Linsen — Einführung",
      "🔊 Schall — wie hört man?", "🎵 Töne erzeugen", "🌦️ Wetterphänomene",
    ],
    4: [
      "🛟 Auftrieb", "💧 Schwimmen und Sinken vertieft", "🪨 Dichte — was ist das?", "🌡️ Wärme messen",
      "🌡️ Thermometer", "🔌 Stromkreis vertieft", "💡 Reihenschaltung", "💡 Lichtbrechung — Einstieg",
      "🌈 Regenbogen", "🔍 Lupe", "🔊 Schallausbreitung", "🧲 Magnete und Eisen",
      "🧭 Kompass", "🪐 Sonnensystem", "🌖 Mondphasen",
    ],
    5: [
      "💧 Aggregatzustände", "🌡️ Wärme und Temperatur", "🌡️ Thermometer und Skalen", "🧲 Magnetismus",
      "🧲 Magnetpole", "🔌 Stromkreis", "📐 Schaltzeichen", "💡 Licht und Schatten",
      "🪞 Spiegel", "💡 Lichtbrechung — Einstieg", "🔊 Schall — Grundlagen", "🌈 Farben",
      "👁️ Auge und Sehen", "⚡ Energie — Einführung", "📏 Einheiten in der Physik",
    ],
    6: [
      "🔥 Wärmeausdehnung", "💧 Aggregatzustände vertieft", "🔌 Stromkreis vertieft", "📐 Schaltbilder",
      "💡 Reihen- & Parallelschaltung", "🧲 Magnetfeld", "💡 Lichtausbreitung", "🪞 Reflexionsgesetz",
      "🔍 Linsen (Sammel-/Zerstreuungslinse)", "🎵 Schall: Frequenz & Tonhöhe", "💡 Lichtbrechung", "🌈 Farben (Spektrum)",
      "👁️ Auge und Sehen vertieft", "⚡ Energieformen", "🌡️ Wärmeleitung",
    ],
    7: [
      "🏃 Geschwindigkeit", "🚗 Bewegung", "🏃 Gleichförmige Bewegung", "💪 Kräfte",
      "👢 Reibung", "🌍 Schwerkraft", "⚙️ Hebel", "📐 Schiefe Ebene",
      "🪢 Rolle (fest, lose)", "🪨 Dichte", "💨 Druck", "⚡ Spannung und Stromstärke",
      "💡 Lichtbrechung vertieft", "🔬 Optische Geräte", "🔊 Schallausbreitung",
    ],
    8: [
      "⚙️ Mechanik", "⚡ Energie und Arbeit", "💪 Leistung", "🔋 Wirkungsgrad",
      "🔥 Wärmelehre", "🌡️ Wärmekapazität", "⚡ Ohm'sches Gesetz", "🔌 Elektrische Widerstände",
      "🔌 Reihenschaltung", "🔌 Parallelschaltung", "🔊 Akustik (Schallwellen)", "🎵 Frequenz, Tonhöhe, Lautstärke",
      "🔬 Optik vertieft", "🔍 Linsen und Bilder", "🪐 Sonnensystem & Astronomie",
    ],
    9: [
      "🏃 Beschleunigung", "📐 Kinematik", "💪 Dynamik", "📜 Newton'sche Gesetze",
      "🎯 Impuls", "⚡ Energieerhaltung", "🌡️ Wärmeübertragung", "💧 Aggregatzustandsänderungen",
      "🧲 Elektromagnetismus", "🧲 Magnetfeld eines Stromleiters", "⚡ Induktion", "🔧 Generator und Motor",
      "⚡ Wechselstrom", "☢️ Radioaktivität — Einstieg", "🔬 Halbleiter — Einstieg",
    ],
    10: [
      "🌊 Schwingungen", "🌊 Wellen", "🌊 Mechanische Wellen", "📡 Elektromagnetische Wellen",
      "🔊 Akustik vertieft", "💡 Optik: Beugung", "💡 Optik: Interferenz", "⚛️ Atombau",
      "⚛️ Atomphysik", "🌌 Quantenphysik — Einstieg", "💡 Photoeffekt", "☢️ Kernphysik",
      "☢️ Radioaktiver Zerfall", "🔬 Halbleiter (Diode, Transistor)", "⚡ Energieumwandlung",
    ],
    11: [
      "⚙️ Mechanik vertieft (Vektoren)", "🌊 Schwingungen vertieft", "🌊 Wellen vertieft", "⚡ Elektrisches Feld",
      "🧲 Magnetfeld vertieft", "⚡ Induktion vertieft", "🔌 Wechselstromkreise", "💡 Photonen",
      "💡 Compton-Effekt", "🌌 Quantenphysik vertieft", "⚛️ Bohr'sches Atommodell", "🌈 Spektrallinien",
      "⚛️ Atomphysik vertieft", "☢️ Radioaktivität vertieft", "🌠 Astrophysik — Einstieg",
    ],
    12: [
      "🌌 Schrödinger-Gleichung", "🌌 Heisenberg-Unschärferelation", "🌌 Quantenmechanik", "☢️ Kernspaltung",
      "☢️ Kernfusion", "🌠 Spezielle Relativitätstheorie", "⏱️ Zeitdilatation", "📏 Längenkontraktion",
      "⚖️ Massendefekt", "⭐ Astrophysik (Sterne)", "🌌 Astrophysik (Galaxien)", "🌌 Kosmologie",
      "📡 Maxwell-Gleichungen", "🔬 Halbleitertechnik", "📚 Abi: Mechanik",
    ],
    13: [
      "🌌 Quantenmechanik vertieft", "💻 Quantencomputing — Einstieg", "🌠 Allgemeine Relativitätstheorie", "🕳 Schwarze Löcher",
      "⚛️ Standardmodell der Teilchen", "🔬 Festkörperphysik", "⚛️ Atomphysik komplett", "☢️ Kernphysik komplett",
      "📡 Komplette Elektrodynamik", "🌊 Komplette Wellenlehre", "🔥 Komplette Wärmelehre", "💡 Komplette Optik",
      "⚙️ Komplette Mechanik", "🧮 Stringtheorie — Einblick", "📚 Abi-Mischaufgaben",
    ],
  },
};

const SCHWIERIGKEITEN = [
  { id: "leicht", name: "Leicht", farbe: "#10B981", farbeHell: "#E8F7EE" },
  { id: "mittel", name: "Mittel", farbe: "#F59E0B", farbeHell: "#FEF3DD" },
  { id: "schwer", name: "Schwer", farbe: "#EF4444", farbeHell: "#FEE4E4" },
];

const EMOJIS_SUPER = ["", "", ""];
const EMOJIS_GUT = ["", "", ""];
const EMOJIS_WEITER = ["", "", ""];

// Lernflix design system
const F = {
  bg: '#fffdf8',
  bgWarm: '#fff8ee',
  bgCream: '#fef3dd',
  bgSoft: '#fef6e8',
  white: '#ffffff',
  ink: '#0F172A',
  inkSoft: '#475569',
  inkMuted: '#94A3B8',
  border: '#E2E8F0',
  coral: '#1769FF',
  coralDeep: '#1156DD',
  blue: '#1769FF',
  blueDeep: '#1156DD',
  blueLight: '#E8F0FF',
  navy: '#0B1F3A',
  navyDark: '#08182C',
  green: '#10B981',
  greenLight: '#E8F7EE',
  red: '#EF4444',
  redLight: '#FEE4E4',
};
const SANS = '"Inter", -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';

// emoji am anfang eines themas entfernen, damit titel sauber sind
function stripEmojiPrefix(s: string): string {
  return s.replace(/^[^a-zA-ZÄÖÜäöüß0-9]+/, "").trim();
}

type Frage = {
  frage: string;
  antworten: string[];
  richtig: number;
  erklaerung: string;
};

export default function QuizPage() {
  const [schritt, setSchritt] = useState<"auswahl" | "quiz" | "ergebnis">("auswahl");
  const [thema, setThema] = useState("");
  const [schwierigkeit, setSchwierigkeit] = useState("");
  const [fragen, setFragen] = useState<Frage[]>([]);
  const [aktuelle, setAktuelle] = useState(0);
  const [ausgewaehlt, setAusgewaehlt] = useState<number | null>(null);
  const [punkte, setPunkte] = useState(0);
  const [laden, setLaden] = useState(false);
  const [antwortGezeigt, setAntwortGezeigt] = useState(false);
  const [zufallsEmoji, setZufallsEmoji] = useState("");
  const [aktiverTab, setAktiverTab] = useState<"mathe" | "physik">("mathe");
  const [klassenFilter, setKlassenFilter] = useState<number | null>(null);
  const vorgeladeneRef = useRef<Frage[]>([]);

  useEffect(() => {
    if (thema && schwierigkeit) {
      vorgeladeneRef.current = [];
      const themaPlain = thema.replace(/^[^a-zA-ZÄÖÜäöüß0-9]+/, "").trim();
      fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ thema: themaPlain, schwierigkeit, klasse: klassenFilter, fach: aktiverTab }),
      })
        .then(res => res.json())
        .then(data => {
          if (data && data.fragen && data.fragen.length > 0) {
            vorgeladeneRef.current = data.fragen;
          }
        })
        .catch(() => {});
    }
  }, [thema, schwierigkeit, klassenFilter, aktiverTab]);

  function startQuiz() {
    if (!thema || !schwierigkeit) return;
    if (vorgeladeneRef.current.length > 0) {
      setFragen(vorgeladeneRef.current);
      setSchritt("quiz");
      setAktuelle(0);
      setPunkte(0);
    } else {
      setLaden(true);
      const interval = setInterval(() => {
        if (vorgeladeneRef.current.length > 0) {
          setFragen(vorgeladeneRef.current);
          setSchritt("quiz");
          setAktuelle(0);
          setPunkte(0);
          setLaden(false);
          clearInterval(interval);
        }
      }, 80); // schneller polling damit es responsive ist
      setTimeout(() => { clearInterval(interval); setLaden(false); }, 30000);
    }
  }

  function antwortWaehlen(index: number) {
    if (antwortGezeigt) return;
    setAusgewaehlt(index);
    setAntwortGezeigt(true);
    if (index === fragen[aktuelle].richtig) setPunkte((p) => p + 1);
  }

  function naechsteFrage() {
    if (aktuelle + 1 >= fragen.length) {
      const finalPunkte = punkte + (ausgewaehlt === fragen[aktuelle].richtig ? 1 : 0);
      const prozentFinal = Math.round((finalPunkte / fragen.length) * 100);
      let emojiListe = EMOJIS_WEITER;
      if (prozentFinal >= 80) emojiListe = EMOJIS_SUPER;
      else if (prozentFinal >= 50) emojiListe = EMOJIS_GUT;
      setZufallsEmoji(emojiListe[Math.floor(Math.random() * emojiListe.length)]);
      setSchritt("ergebnis");
    } else {
      setAktuelle((a) => a + 1);
      setAusgewaehlt(null);
      setAntwortGezeigt(false);
    }
  }

  function neuStarten() {
    setSchritt("auswahl");
    setThema("");
    setSchwierigkeit("");
    setKlassenFilter(null);
    setFragen([]);
    vorgeladeneRef.current = [];
    setAktuelle(0);
    setPunkte(0);
    setAusgewaehlt(null);
    setAntwortGezeigt(false);
    setZufallsEmoji("");
  }

  const gesamtFragen = fragen && fragen.length > 0 ? fragen.length : 1;
  const prozent = Math.round((punkte / gesamtFragen) * 100);

  const aktiveThemen: string[] =
    klassenFilter !== null && KATALOG[aktiverTab][klassenFilter]
      ? KATALOG[aktiverTab][klassenFilter]
      : [];
  const verfuegbareKlassen = Array.from({ length: 13 }, (_, i) => i + 1); // 1..13

  return (
    <main style={{ minHeight: "100vh", background: "#ffffff", fontFamily: SANS, color: F.ink, position: "relative", overflow: "hidden" }}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" />

      {/* Karierte papier textur (matched mit homepage) */}
      <div style={{ position: "fixed", inset: 0, backgroundImage: "linear-gradient(rgba(23,105,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(23,105,255,0.07) 1px, transparent 1px)", backgroundSize: "40px 40px", pointerEvents: "none", zIndex: 0 }} />
      {/* Dezente glow blobs */}
      <div style={{ position: "fixed", top: "10%", right: "-150px", width: "550px", height: "550px", borderRadius: "50%", background: "radial-gradient(circle, rgba(23,105,255,0.08) 0%, transparent 70%)", pointerEvents: "none", filter: "blur(40px)", zIndex: 0 }} />
      <div style={{ position: "fixed", bottom: "-100px", left: "10%", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(167,139,250,0.08) 0%, transparent 70%)", pointerEvents: "none", filter: "blur(50px)", zIndex: 0 }} />

      <style>{`
        * { -webkit-font-smoothing: antialiased; }
        body { background: #ffffff; margin: 0; font-family: ${SANS}; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { opacity: 0.8; } 50% { opacity: 1; } }
        .fade-up { animation: fadeUp 0.5s cubic-bezier(0.2,0.8,0.2,1) both; }
        .pulse { animation: pulse 1.4s ease-in-out infinite; }
        .pill { transition: all 0.18s cubic-bezier(0.2,0.8,0.2,1); cursor: pointer; }
        .pill:hover:not(.disabled) { transform: translateY(-2px); }
        .answer { transition: all 0.18s cubic-bezier(0.2,0.8,0.2,1); }
        .answer:hover:not(.locked) { transform: translateY(-2px); border-color: ${F.coral}; }
        .btn-primary {
          background: ${F.coral}; color: ${F.white};
          padding: 16px 28px; border-radius: 14px;
          font-size: 16px; font-weight: 700; letter-spacing: -0.005em;
          display: inline-flex; align-items: center; justify-content: center; gap: 8px;
          text-decoration: none; border: none; cursor: pointer;
          transition: all 0.2s ease; font-family: ${SANS};
          box-shadow: 0 1px 2px rgba(23,105,255,0.12), 0 8px 24px rgba(23,105,255,0.28);
          width: 100%;
        }
        .btn-primary:hover:not(:disabled) { background: ${F.coralDeep}; transform: translateY(-1px); box-shadow: 0 14px 32px rgba(23,105,255,0.36); }
        .btn-primary:disabled { background: ${F.inkMuted}; cursor: not-allowed; box-shadow: none; opacity: 0.6; }
      `}</style>

      {/* HEADER - matched mit homepage */}
      <header style={{ background: "rgba(255,255,255,0.85)", padding: "16px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${F.border}`, position: "sticky", top: 0, zIndex: 50, backdropFilter: "saturate(180%) blur(20px)" }}>
        <a href="/" style={{ textDecoration: "none" }}>
          <span style={{ fontSize: "24px", fontWeight: 800, color: F.ink, letterSpacing: "-0.025em" }}>
            Lern<span style={{ color: F.blue }}>flix</span>
          </span>
        </a>
        <a href="/" style={{ color: F.inkSoft, textDecoration: "none", fontSize: "14px", fontWeight: 600 }}>← Zurück</a>
      </header>

      <div style={{ maxWidth: "780px", margin: "0 auto", padding: "32px 22px 80px", position: "relative", zIndex: 1 }}>

        {schritt === "auswahl" && (
          <div className="fade-up">
            {/* Title */}
            <div style={{ textAlign: "center", marginBottom: "32px" }}>
              {/* Kleines buecher-foto (matched mit homepage und shop) */}
              <img src="/20260613_173033176_iOS.png" alt="Mathe und Physik Buecher" style={{ width: "150px", height: "auto", marginBottom: "12px", display: "inline-block" }} />
              <div>
                <span style={{ display: "inline-block", background: F.white, color: F.coral, padding: "7px 14px", borderRadius: "999px", fontSize: "12px", fontWeight: 700, marginBottom: "16px", boxShadow: "0 4px 14px rgba(23,105,255,0.18)", border: `1px solid ${F.border}` }}>
                  Kostenloses Quiz
                </span>
              </div>
              <h1 style={{ fontSize: "44px", fontWeight: 800, margin: "0 0 10px", letterSpacing: "-0.03em", lineHeight: 1.0, color: F.ink }}>
                Teste dein <span style={{ color: F.coral }}>Wissen</span>.
              </h1>
              <p style={{ fontSize: "16px", color: F.inkSoft, margin: 0, lineHeight: 1.55 }}>
                Wähle Fach, Klasse, Thema und Schwierigkeit.
              </p>
            </div>

            {/* Step 1: Fach */}
            <div style={{ marginBottom: "28px" }}>
              <p style={{ fontSize: "11.5px", color: F.inkMuted, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", margin: "0 0 10px" }}>Schritt 1 · Fach</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                {(["mathe", "physik"] as const).map((f) => (
                  <button key={f} className="pill" onClick={() => { setAktiverTab(f); setThema(""); setKlassenFilter(null); }}
                    style={{ padding: "16px 18px", borderRadius: "14px", border: `1.5px solid ${aktiverTab === f ? F.ink : F.border}`, background: aktiverTab === f ? F.ink : F.white, color: aktiverTab === f ? F.white : F.ink, fontSize: "16px", fontWeight: 700, fontFamily: SANS }}>
                    {f === "mathe" ? "Mathematik" : "Physik"}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Klasse */}
            <div style={{ marginBottom: "28px" }}>
              <p style={{ fontSize: "11.5px", color: F.inkMuted, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", margin: "0 0 10px" }}>Schritt 2 · Klasse</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "8px" }}>
                {verfuegbareKlassen.map((k) => (
                  <button key={k} className="pill" onClick={() => { setKlassenFilter(k); setThema(""); }}
                    style={{ aspectRatio: "1 / 1", borderRadius: "14px", border: `2px solid ${klassenFilter === k ? F.coral : "#CDD9F5"}`, background: klassenFilter === k ? F.coral : "#F5F8FF", color: klassenFilter === k ? F.white : F.ink, fontSize: "18px", fontWeight: 800, fontFamily: SANS, padding: 0, boxShadow: klassenFilter === k ? "0 8px 20px rgba(23,105,255,0.25)" : "0 2px 6px rgba(15,23,42,0.04)" }}>
                    {k}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Thema */}
            {klassenFilter !== null && (
              <div style={{ marginBottom: "28px" }} className="fade-up">
                <p style={{ fontSize: "11.5px", color: F.inkMuted, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", margin: "0 0 10px" }}>Schritt 3 · Thema</p>
                <div style={{ display: "grid", gap: "10px" }}>
                  {aktiveThemen.map((t) => {
                    // Behalte das emoji als visueller anker, das hilft kindern
                    const emojiMatch = t.match(/^([^a-zA-ZÄÖÜäöüß0-9]+)/);
                    const emoji = emojiMatch ? emojiMatch[1].trim() : "📘";
                    const clean = stripEmojiPrefix(t);
                    const aktiv = thema === t;
                    return (
                      <button key={t} className="pill" onClick={() => setThema(t)}
                        style={{ textAlign: "left", padding: "16px 18px", borderRadius: "14px", border: `2px solid ${aktiv ? F.coral : "#CDD9F5"}`, background: aktiv ? "#E8F0FF" : "#F5F8FF", color: F.ink, fontSize: "16px", fontWeight: 700, fontFamily: SANS, display: "flex", alignItems: "center", gap: "14px", boxShadow: aktiv ? "0 8px 20px rgba(23,105,255,0.18)" : "0 2px 6px rgba(15,23,42,0.04)" }}>
                        <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "38px", height: "38px", borderRadius: "10px", background: aktiv ? F.coral : F.white, border: `1.5px solid ${aktiv ? F.coral : "#CDD9F5"}`, fontSize: "20px", flexShrink: 0 }}>
                          {aktiv ? (
                            <svg width="18" height="18" viewBox="0 0 12 12" fill="none">
                              <path d="M3 6L5 8L9 4" stroke="#ffffff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          ) : emoji}
                        </span>
                        {clean}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 4: Schwierigkeit */}
            <div style={{ marginBottom: "32px" }}>
              <p style={{ fontSize: "11.5px", color: F.inkMuted, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", margin: "0 0 10px" }}>Schritt 4 · Schwierigkeit</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
                {SCHWIERIGKEITEN.map((s) => (
                  <button key={s.id} className="pill" onClick={() => setSchwierigkeit(s.id)}
                    style={{ padding: "16px 12px", borderRadius: "14px", border: `2px solid ${schwierigkeit === s.id ? s.farbe : "#CDD9F5"}`, background: schwierigkeit === s.id ? s.farbeHell : "#F5F8FF", color: schwierigkeit === s.id ? s.farbe : F.ink, fontSize: "16px", fontWeight: 800, fontFamily: SANS, boxShadow: schwierigkeit === s.id ? `0 8px 20px ${s.farbe}30` : "0 2px 6px rgba(15,23,42,0.04)" }}>
                    {s.name}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={startQuiz} disabled={!thema || !schwierigkeit || laden} className="btn-primary">
              {laden ? (
                <span className="pulse" style={{ display: "inline-flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: F.white }} />
                  Fragen werden geladen ...
                </span>
              ) : (
                <>Quiz starten <span style={{ fontSize: "18px" }}>→</span></>
              )}
            </button>
          </div>
        )}

        {schritt === "quiz" && fragen && fragen.length > 0 && (
          <div className="fade-up">
            {/* Progress header */}
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "14px", alignItems: "center" }}>
              <span style={{ color: F.inkSoft, fontWeight: 700, fontSize: "13.5px" }}>Frage {aktuelle + 1} von {fragen.length}</span>
              <span style={{ background: F.ink, color: F.white, padding: "5px 13px", borderRadius: "999px", fontWeight: 700, fontSize: "13px" }}>{punkte} richtig</span>
            </div>

            <div style={{ background: F.border, borderRadius: "999px", height: "6px", marginBottom: "26px", overflow: "hidden" }}>
              <div style={{ background: F.coral, height: "6px", borderRadius: "999px", width: `${((aktuelle + 1) / fragen.length) * 100}%`, transition: "width 0.4s ease" }} />
            </div>

            {/* Question card */}
            <div style={{ background: F.white, borderRadius: "20px", padding: "28px 28px 26px", marginBottom: "20px", boxShadow: "0 1px 2px rgba(15,23,42,0.04), 0 8px 24px rgba(15,23,42,0.06)", border: `1px solid ${F.border}` }}>
              <h2 style={{ fontSize: "22px", color: F.ink, margin: 0, lineHeight: 1.4, fontWeight: 700, letterSpacing: "-0.015em" }}>{fragen[aktuelle].frage}</h2>
            </div>

            {/* Answers */}
            <div style={{ display: "grid", gap: "10px", marginBottom: "20px" }}>
              {fragen[aktuelle].antworten.map((antwort, i) => {
                let bg = F.white;
                let border = F.border;
                let textColor = F.ink;
                let badgeBg = F.bgSoft;
                let badgeColor = F.inkSoft;
                if (antwortGezeigt) {
                  if (i === fragen[aktuelle].richtig) { bg = F.greenLight; border = F.green; textColor = F.ink; badgeBg = F.green; badgeColor = F.white; }
                  else if (i === ausgewaehlt) { bg = F.redLight; border = F.red; textColor = F.ink; badgeBg = F.red; badgeColor = F.white; }
                  else { bg = F.white; border = F.border; textColor = F.inkMuted; }
                }
                return (
                  <button key={i} onClick={() => antwortWaehlen(i)} disabled={antwortGezeigt}
                    className={antwortGezeigt ? "answer locked" : "answer"}
                    style={{ background: bg, border: `1.5px solid ${border}`, borderRadius: "14px", padding: "16px 18px", cursor: antwortGezeigt ? "default" : "pointer", fontSize: "16px", fontWeight: 600, color: textColor, display: "flex", alignItems: "center", gap: "14px", textAlign: "left", fontFamily: SANS, width: "100%" }}>
                    <span style={{ background: badgeBg, color: badgeColor, borderRadius: "8px", padding: "4px 0", fontSize: "13px", fontWeight: 800, minWidth: "30px", textAlign: "center", flexShrink: 0 }}>
                      {["A", "B", "C", "D"][i]}
                    </span>
                    <span style={{ flex: 1, lineHeight: 1.4 }}>{antwort}</span>
                  </button>
                );
              })}
            </div>

            {antwortGezeigt && (
              <div className="fade-up">
                <div style={{ background: ausgewaehlt === fragen[aktuelle].richtig ? F.greenLight : F.redLight, border: `1.5px solid ${ausgewaehlt === fragen[aktuelle].richtig ? F.green : F.red}`, borderRadius: "14px", padding: "18px 20px", marginBottom: "16px", fontSize: "14.5px", fontWeight: 500, color: F.ink, lineHeight: 1.55 }}>
                  <p style={{ margin: 0, fontWeight: 800, fontSize: "14px", color: ausgewaehlt === fragen[aktuelle].richtig ? F.green : F.red, marginBottom: "6px" }}>
                    {ausgewaehlt === fragen[aktuelle].richtig ? "Richtig" : "Leider falsch"}
                  </p>
                  {fragen[aktuelle].erklaerung}
                </div>
                <button onClick={naechsteFrage} className="btn-primary">
                  {aktuelle + 1 >= fragen.length ? "Ergebnis ansehen" : "Nächste Frage"} <span style={{ fontSize: "18px" }}>→</span>
                </button>
              </div>
            )}
          </div>
        )}

        {schritt === "ergebnis" && (
          <div className="fade-up" style={{ textAlign: "center", paddingTop: "20px" }}>
            <span style={{ display: "inline-block", background: F.white, color: F.coral, padding: "7px 14px", borderRadius: "999px", fontSize: "12px", fontWeight: 700, marginBottom: "16px", boxShadow: "0 4px 14px rgba(23,105,255,0.18)" }}>
              Quiz beendet
            </span>
            <h2 style={{ fontSize: "42px", margin: "0 0 10px", letterSpacing: "-0.03em", lineHeight: 1.0, fontWeight: 800, color: F.ink }}>
              {prozent >= 80 ? "Stark!" : prozent >= 50 ? "Gut gemacht." : "Bleib dran."}
            </h2>
            <p style={{ fontSize: "16px", color: F.inkSoft, margin: "0 0 28px" }}>
              {prozent >= 80 ? "Das war richtig gut." : prozent >= 50 ? "Mit ein bisschen Übung wird die Eins sicher." : "Übung macht die Eins. Probier es nochmal."}
            </p>

            <div style={{ background: F.white, borderRadius: "24px", padding: "36px 28px 32px", marginBottom: "20px", boxShadow: "0 1px 2px rgba(15,23,42,0.04), 0 12px 32px rgba(15,23,42,0.06)", border: `1px solid ${F.border}` }}>
              <p style={{ fontSize: "72px", fontWeight: 900, color: F.ink, margin: "0", lineHeight: 1.0, letterSpacing: "-0.04em" }}>{punkte}<span style={{ color: F.inkMuted, fontSize: "44px", fontWeight: 800 }}>/{fragen.length}</span></p>
              <p style={{ fontSize: "16px", color: F.inkSoft, margin: "10px 0 0", fontWeight: 600 }}>{prozent}% richtig</p>
            </div>

            <div style={{ background: F.white, border: `1px solid ${F.border}`, borderRadius: "18px", padding: "22px 24px", marginBottom: "20px", textAlign: "left" }}>
              <p style={{ fontSize: "14.5px", fontWeight: 800, color: F.ink, margin: "0 0 6px" }}>Noch besser werden?</p>
              <p style={{ color: F.inkSoft, margin: "0 0 14px", fontSize: "14px", lineHeight: 1.55 }}>Im Shop findest du Lernpakete für dein Thema. Mit Erklärungen, Skizzen und Übungen.</p>
              <a href="/shop" style={{ background: F.ink, color: F.white, textDecoration: "none", padding: "10px 22px", borderRadius: "10px", fontWeight: 700, fontSize: "14px", display: "inline-flex", alignItems: "center", gap: "8px" }}>
                Zum Shop <span style={{ fontSize: "16px" }}>→</span>
              </a>
            </div>

            <button onClick={neuStarten} className="btn-primary">
              Nochmal spielen <span style={{ fontSize: "18px" }}>→</span>
            </button>
          </div>
        )}
      </div>
    </main>
  );
}