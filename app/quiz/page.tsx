"use client";
import { useState, useEffect, useRef } from "react";

const THEMEN = [
  // === MATHEMATIK ===
  // Grundschule
  { id: "multiplikation", name: "✖️ Einmaleins / Multiplikation", klasse: "Klasse 2-3", fach: "mathe" },
  { id: "division", name: "➗ Division", klasse: "Klasse 2-3", fach: "mathe" },
  { id: "schriftliche-rechenverfahren", name: "📝 Schriftlich rechnen", klasse: "Klasse 3-4", fach: "mathe" },
  { id: "einheiten", name: "📏 Einheiten (Länge, Masse, Zeit)", klasse: "Klasse 3-6", fach: "mathe" },
  { id: "einheiten-umrechnen", name: "🔄 Einheiten umrechnen", klasse: "Klasse 4-6", fach: "mathe" },
  { id: "geometrie-grundformen", name: "🔷 Geometrie Grundformen", klasse: "Klasse 4-6", fach: "mathe" },
  // Unter-/Mittelstufe
  { id: "brueche", name: "➗ Brüche — Grundlagen", klasse: "Klasse 5-6", fach: "mathe" },
  { id: "brueche-addieren-subtrahieren", name: "➕ Brüche addieren & subtrahieren", klasse: "Klasse 5-6", fach: "mathe" },
  { id: "brueche-multiplizieren-dividieren", name: "✖️ Brüche multiplizieren & dividieren", klasse: "Klasse 6", fach: "mathe" },
  { id: "dezimalzahlen", name: "🔢 Dezimalzahlen", klasse: "Klasse 5-6", fach: "mathe" },
  { id: "dezimalzahlen-rechnen", name: "🧮 Dezimalzahlen rechnen (× ÷)", klasse: "Klasse 6", fach: "mathe" },
  { id: "negative-zahlen", name: "➖ Negative / rationale Zahlen", klasse: "Klasse 6-7", fach: "mathe" },
  { id: "zehnerpotenzen", name: "🔟 Zehnerpotenzen", klasse: "Klasse 6-7", fach: "mathe" },
  { id: "rechenvorteile", name: "⚡ Rechenvorteile & Klammerregeln", klasse: "Klasse 6-7", fach: "mathe" },
  { id: "prozent", name: "📊 Prozentrechnung", klasse: "Klasse 7-8", fach: "mathe" },
  { id: "zinsrechnung", name: "💰 Zinsrechnung", klasse: "Klasse 7-8", fach: "mathe" },
  { id: "terme-klammern", name: "🔣 Terme & Klammern", klasse: "Klasse 7-8", fach: "mathe" },
  { id: "gleichungen", name: "⚖️ Gleichungen", klasse: "Klasse 7-8", fach: "mathe" },
  { id: "ungleichungen", name: "≠ Ungleichungen", klasse: "Klasse 8", fach: "mathe" },
  { id: "binomische-formeln", name: "📐 Binomische Formeln", klasse: "Klasse 8", fach: "mathe" },
  { id: "lineare-funktionen", name: "📈 Lineare Funktionen", klasse: "Klasse 8", fach: "mathe" },
  { id: "lineare-gleichungssysteme", name: "🧩 Lineare Gleichungssysteme", klasse: "Klasse 8-9", fach: "mathe" },
  { id: "pythagoras", name: "📐 Satz des Pythagoras", klasse: "Klasse 8-9", fach: "mathe" },
  { id: "wurzeln", name: "√ Wurzeln & Potenzen", klasse: "Klasse 8-9", fach: "mathe" },
  { id: "quadratische-funktionen", name: "📉 Quadratische Funktionen", klasse: "Klasse 9-10", fach: "mathe" },
  { id: "pq-formel", name: "📊 pq-Formel & Mitternachtsformel", klasse: "Klasse 9-10", fach: "mathe" },
  { id: "strahlensaetze", name: "📏 Strahlensätze", klasse: "Klasse 9-10", fach: "mathe" },
  { id: "kreis", name: "⭕ Kreis (Umfang & Fläche)", klasse: "Klasse 8-9", fach: "mathe" },
  { id: "volumen-oberflaeche", name: "📦 Volumen & Oberfläche", klasse: "Klasse 9-10", fach: "mathe" },
  { id: "wahrscheinlichkeit", name: "🎲 Wahrscheinlichkeit", klasse: "Klasse 8-9", fach: "mathe" },
  { id: "statistik", name: "📊 Statistik & Mittelwert", klasse: "Klasse 8-9", fach: "mathe" },
  // Oberstufe
  { id: "trigonometrie", name: "📐 Trigonometrie (Sin, Cos, Tan)", klasse: "Klasse 10", fach: "mathe" },
  { id: "exponentialfunktionen", name: "📈 Exponentialfunktionen", klasse: "Klasse 10-11", fach: "mathe" },
  { id: "logarithmen", name: "📉 Logarithmen", klasse: "Klasse 10-11", fach: "mathe" },
  { id: "ableitungen", name: "📊 Ableitungen", klasse: "Klasse 11-12", fach: "mathe" },
  { id: "integralrechnung", name: "∫ Integralrechnung", klasse: "Klasse 11-12", fach: "mathe" },
  { id: "vektoren", name: "➡️ Vektoren", klasse: "Klasse 11-12", fach: "mathe" },
  { id: "kurvendiskussion", name: "📈 Kurvendiskussion", klasse: "Klasse 11-12", fach: "mathe" },

  // === PHYSIK ===
  { id: "temperatur", name: "🌡️ Temperatur & Wärme", klasse: "Klasse 5-7", fach: "physik" },
  { id: "farben", name: "🌈 Farben & Licht", klasse: "Klasse 5-7", fach: "physik" },
  { id: "geschwindigkeit", name: "🏃 Geschwindigkeit & Bewegung", klasse: "Klasse 7-8", fach: "physik" },
  { id: "kraefte", name: "💪 Kräfte", klasse: "Klasse 7-8", fach: "physik" },
  { id: "hebel-maschinen", name: "⚙️ Hebel & einfache Maschinen", klasse: "Klasse 7-8", fach: "physik" },
  { id: "dichte", name: "🪨 Dichte", klasse: "Klasse 7-8", fach: "physik" },
  { id: "druck", name: "💨 Druck", klasse: "Klasse 7-8", fach: "physik" },
  { id: "stromkreise", name: "🔌 Stromkreise", klasse: "Klasse 7-8", fach: "physik" },
  { id: "magnetismus", name: "🧲 Magnetismus", klasse: "Klasse 7-8", fach: "physik" },
  { id: "lichtbrechung", name: "💡 Lichtbrechung", klasse: "Klasse 7-9", fach: "physik" },
  { id: "optik", name: "🔍 Optik & Spiegel", klasse: "Klasse 7-9", fach: "physik" },
  { id: "mechanik", name: "⚙️ Mechanik", klasse: "Klasse 8-9", fach: "physik" },
  { id: "energie-arbeit", name: "⚡ Energie & Arbeit", klasse: "Klasse 8-9", fach: "physik" },
  { id: "waermelehre", name: "🔥 Wärmelehre", klasse: "Klasse 8-9", fach: "physik" },
  { id: "elektrizitaet", name: "⚡ Elektrizität (U, I, R)", klasse: "Klasse 8-9", fach: "physik" },
  { id: "schall-wellen", name: "🔊 Schall & Wellen", klasse: "Klasse 8-9", fach: "physik" },
  { id: "strahlung", name: "☢️ Strahlung & Radioaktivität", klasse: "Klasse 8-10", fach: "physik" },
  { id: "atomphysik", name: "⚛️ Atomphysik", klasse: "Klasse 10-11", fach: "physik" },
  { id: "schwingungen", name: "🌊 Schwingungen", klasse: "Klasse 10-11", fach: "physik" },
  { id: "quantenphysik", name: "🌌 Quantenphysik", klasse: "Klasse 11-12", fach: "physik" },
  { id: "relativitaetstheorie", name: "🌠 Relativitätstheorie", klasse: "Klasse 11-12", fach: "physik" },
];

const SCHWIERIGKEITEN = [
  { id: "leicht", name: "😊 Leicht", farbe: "#22c55e" },
  { id: "mittel", name: "😤 Mittel", farbe: "#f59e0b" },
  { id: "schwer", name: "🔥 Schwer", farbe: "#ef4444" },
];

const EMOJIS_SUPER = ["🏆🎉🥳", "⭐⭐⭐", "🎊🏅✨"];
const EMOJIS_GUT = ["👍😊💪", "🌟😄✨", "💪🎯👏"];
const EMOJIS_WEITER = ["📚💡🔥", "⚡📖💪", "🎯📚✏️"];

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
      fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ thema, schwierigkeit }),
      })
        .then(res => res.json())
        .then(data => {
          if (data && data.fragen && data.fragen.length > 0) {
            vorgeladeneRef.current = data.fragen;
          }
        })
        .catch(() => {});
    }
  }, [thema, schwierigkeit]);

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
      }, 300);
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

  function passtZuKlasse(themaKlasse: string, gewaehlteKlasse: number | null): boolean {
    if (gewaehlteKlasse === null) return true;
    const match = themaKlasse.match(/(\d+)(?:\s*-\s*(\d+))?/);
    if (!match) return false;
    const start = parseInt(match[1]);
    const ende = match[2] ? parseInt(match[2]) : start;
    return gewaehlteKlasse >= start && gewaehlteKlasse <= ende;
  }

  const aktiveThemen = THEMEN.filter((t) => t.fach === aktiverTab && passtZuKlasse(t.klasse, klassenFilter));
  const mathThemen = aktiveThemen;
  const physikThemen = aktiveThemen;
  const verfuegbareKlassen = Array.from({ length: 11 }, (_, i) => i + 2); // 2..12

  return (
    <div style={{ minHeight: "100vh", background: "#f5f0e8", fontFamily: "Arial, sans-serif" }}>
      <div style={{ background: "linear-gradient(135deg, #5b9bd5, #2d6da8)", padding: "20px", textAlign: "center" }}>
        <h1 style={{ color: "white", margin: 0, fontSize: "32px", fontWeight: "900" }}>🎓 Lernflix Quiz</h1>
        <p style={{ color: "rgba(255,255,255,0.9)", margin: "6px 0 0 0", fontSize: "16px" }}>Teste dein Wissen — kostenlos & interaktiv!</p>
      </div>

      <div style={{ maxWidth: "750px", margin: "0 auto", padding: "30px 16px" }}>

        {schritt === "auswahl" && (
          <div>
            <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
              <button onClick={() => { setAktiverTab("mathe"); setThema(""); setKlassenFilter(null); }}
                style={{ flex: 1, padding: "14px", borderRadius: "12px", border: "none", cursor: "pointer", fontSize: "18px", fontWeight: "700", background: aktiverTab === "mathe" ? "linear-gradient(135deg, #5b9bd5, #2d6da8)" : "white", color: aktiverTab === "mathe" ? "white" : "#5b9bd5" }}>
                📐 Mathe
              </button>
              <button onClick={() => { setAktiverTab("physik"); setThema(""); setKlassenFilter(null); }}
                style={{ flex: 1, padding: "14px", borderRadius: "12px", border: "none", cursor: "pointer", fontSize: "18px", fontWeight: "700", background: aktiverTab === "physik" ? "linear-gradient(135deg, #5b9bd5, #2d6da8)" : "white", color: aktiverTab === "physik" ? "white" : "#5b9bd5" }}>
                ⚡ Physik
              </button>
            </div>

            <h2 style={{ color: "#1a1a2e", textAlign: "center", fontSize: "20px", marginBottom: "12px" }}>Welche Klasse bist du?</h2>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "10px", justifyContent: "center" }}>
              <button onClick={() => { setKlassenFilter(null); setThema(""); }}
                style={{ padding: "10px 16px", borderRadius: "10px", border: `2px solid ${klassenFilter === null ? "#2d6da8" : "#e0d8cc"}`, background: klassenFilter === null ? "linear-gradient(135deg, #5b9bd5, #2d6da8)" : "white", color: klassenFilter === null ? "white" : "#1a1a2e", cursor: "pointer", fontWeight: 700, fontSize: "14px" }}>
                Alle
              </button>
              {verfuegbareKlassen.map((k) => (
                <button key={k} onClick={() => { setKlassenFilter(k); setThema(""); }}
                  style={{ padding: "10px 14px", borderRadius: "10px", border: `2px solid ${klassenFilter === k ? "#2d6da8" : "#e0d8cc"}`, background: klassenFilter === k ? "linear-gradient(135deg, #5b9bd5, #2d6da8)" : "white", color: klassenFilter === k ? "white" : "#1a1a2e", cursor: "pointer", fontWeight: 700, fontSize: "14px", minWidth: "44px" }}>
                  {k}
                </button>
              ))}
            </div>
            <p style={{ color: "#6e6e73", fontSize: "13px", textAlign: "center", margin: "0 0 24px" }}>
              {klassenFilter === null ? "Klick auf deine Klasse, dann siehst du nur passende Themen." : `Themen für Klasse ${klassenFilter}`}
            </p>

            <h2 style={{ color: "#1a1a2e", textAlign: "center", fontSize: "22px", marginBottom: "16px" }}>Wähle dein Thema!</h2>
            <div style={{ display: "grid", gap: "10px", marginBottom: "28px" }}>
              {(aktiverTab === "mathe" ? mathThemen : physikThemen).length === 0 && (
                <div style={{ background: "white", padding: "20px", borderRadius: "12px", textAlign: "center", color: "#6e6e73", border: "2px dashed #e0d8cc" }}>
                  Für Klasse {klassenFilter} gibt es in {aktiverTab === "mathe" ? "Mathe" : "Physik"} noch keine Themen. Probier eine andere Klasse oder klick auf &quot;Alle&quot;.
                </div>
              )}
              {(aktiverTab === "mathe" ? mathThemen : physikThemen).map((t) => (
                <div key={t.id} onClick={() => setThema(t.id)}
                  style={{ background: thema === t.id ? "linear-gradient(135deg, #5b9bd5, #2d6da8)" : "white", color: thema === t.id ? "white" : "#1a1a2e", padding: "16px 20px", borderRadius: "12px", cursor: "pointer", border: `2px solid ${thema === t.id ? "#2d6da8" : "#e0d8cc"}`, display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "17px", fontWeight: "600", transition: "all 0.2s" }}>
                  <span>{t.name}</span>
                  <span style={{ fontSize: "13px", opacity: 0.8 }}>{t.klasse}</span>
                </div>
              ))}
            </div>

            <h2 style={{ color: "#1a1a2e", textAlign: "center", fontSize: "22px", marginBottom: "16px" }}>Schwierigkeit?</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "28px" }}>
              {SCHWIERIGKEITEN.map((s) => (
                <div key={s.id} onClick={() => setSchwierigkeit(s.id)}
                  style={{ background: schwierigkeit === s.id ? s.farbe : "white", color: schwierigkeit === s.id ? "white" : "#1a1a2e", padding: "16px", borderRadius: "12px", cursor: "pointer", border: `2px solid ${schwierigkeit === s.id ? s.farbe : "#e0d8cc"}`, textAlign: "center", fontSize: "16px", fontWeight: "700", transition: "all 0.2s" }}>
                  {s.name}
                </div>
              ))}
            </div>

            <button onClick={startQuiz} disabled={!thema || !schwierigkeit || laden}
              style={{ width: "100%", background: thema && schwierigkeit ? "linear-gradient(135deg, #5b9bd5, #2d6da8)" : "#ccc", color: "white", border: "none", padding: "18px", borderRadius: "14px", fontSize: "20px", cursor: thema && schwierigkeit ? "pointer" : "not-allowed", fontWeight: "800" }}>
              {laden ? "⏳ Einen Moment..." : "🚀 Quiz starten!"}
            </button>
          </div>
        )}

        {schritt === "quiz" && fragen && fragen.length > 0 && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px", alignItems: "center" }}>
              <span style={{ color: "#2d6da8", fontWeight: "800", fontSize: "16px" }}>Frage {aktuelle + 1} von {fragen.length}</span>
              <span style={{ background: "linear-gradient(135deg, #5b9bd5, #2d6da8)", color: "white", padding: "6px 16px", borderRadius: "20px", fontWeight: "800", fontSize: "16px" }}>⭐ {punkte} Punkte</span>
            </div>

            <div style={{ background: "#dbeafe", borderRadius: "10px", height: "10px", marginBottom: "24px", overflow: "hidden" }}>
              <div style={{ background: "linear-gradient(90deg, #5b9bd5, #2d6da8)", height: "10px", borderRadius: "10px", width: `${((aktuelle + 1) / fragen.length) * 100}%`, transition: "width 0.4s ease" }} />
            </div>

            <div style={{ background: "white", borderRadius: "16px", padding: "24px", marginBottom: "20px", boxShadow: "0 4px 16px rgba(0,0,0,0.08)", border: "2px solid #dbeafe" }}>
              <h3 style={{ fontSize: "20px", color: "#1a1a2e", marginTop: 0, lineHeight: 1.6, fontWeight: "700" }}>{fragen[aktuelle].frage}</h3>
            </div>

            <div style={{ display: "grid", gap: "12px", marginBottom: "20px" }}>
              {fragen[aktuelle].antworten.map((antwort, i) => {
                let bg = "white";
                let border = "#2d6da8";
                let textColor = "#1a1a2e";
                if (antwortGezeigt) {
                  if (i === fragen[aktuelle].richtig) { bg = "#dcfce7"; border = "#16a34a"; textColor = "#166534"; }
                  else if (i === ausgewaehlt) { bg = "#fee2e2"; border = "#dc2626"; textColor = "#991b1b"; }
                  else { bg = "#f9fafb"; border = "#d1d5db"; textColor = "#9ca3af"; }
                }
                return (
                  <div key={i} onClick={() => antwortWaehlen(i)}
                    style={{ background: bg, border: `2.5px solid ${border}`, borderRadius: "12px", padding: "16px 20px", cursor: antwortGezeigt ? "default" : "pointer", fontSize: "17px", fontWeight: "700", color: textColor, transition: "all 0.2s", display: "flex", alignItems: "center", gap: "14px" }}>
                    <span style={{ background: antwortGezeigt ? "transparent" : "linear-gradient(135deg, #5b9bd5, #2d6da8)", color: antwortGezeigt ? textColor : "white", borderRadius: "8px", padding: "4px 12px", fontSize: "15px", fontWeight: "900", border: antwortGezeigt ? `2px solid ${border}` : "none", minWidth: "32px", textAlign: "center" }}>
                      {["A", "B", "C", "D"][i]}
                    </span>
                    {antwort}
                  </div>
                );
              })}
            </div>

            {antwortGezeigt && (
              <div>
                <div style={{ background: ausgewaehlt === fragen[aktuelle].richtig ? "#dcfce7" : "#fee2e2", border: `2px solid ${ausgewaehlt === fragen[aktuelle].richtig ? "#16a34a" : "#dc2626"}`, borderRadius: "12px", padding: "16px", marginBottom: "16px", fontSize: "16px", fontWeight: "600", color: ausgewaehlt === fragen[aktuelle].richtig ? "#166534" : "#991b1b" }}>
                  {ausgewaehlt === fragen[aktuelle].richtig ? "✅ Richtig! " : "❌ Falsch! "}
                  {fragen[aktuelle].erklaerung}
                </div>
                <button onClick={naechsteFrage}
                  style={{ width: "100%", background: "linear-gradient(135deg, #5b9bd5, #2d6da8)", color: "white", border: "none", padding: "16px", borderRadius: "12px", fontSize: "18px", cursor: "pointer", fontWeight: "800" }}>
                  {aktuelle + 1 >= fragen.length ? "🏁 Ergebnis sehen!" : "➡️ Nächste Frage"}
                </button>
              </div>
            )}
          </div>
        )}

        {schritt === "ergebnis" && (
          <div style={{ textAlign: "center" }}>
            <h2 style={{ color: "#1a1a2e", fontSize: "28px", fontWeight: "900" }}>
              {prozent >= 80 ? "🏆 Fantastisch!" : prozent >= 50 ? "👍 Gut gemacht!" : "💪 Weiter üben!"}
            </h2>
            <div style={{ background: "white", borderRadius: "20px", padding: "30px", marginBottom: "24px", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
              <p style={{ fontSize: "56px", fontWeight: "900", color: "#2d6da8", margin: "0 0 8px 0" }}>{punkte}/{fragen.length}</p>
              <p style={{ fontSize: "22px", color: "#555", margin: "0 0 16px 0" }}>{prozent}% richtig</p>
              {zufallsEmoji && (
                <div style={{ fontSize: "80px", margin: "16px 0" }}>{zufallsEmoji}</div>
              )}
            </div>

            <div style={{ background: "#dbeafe", border: "2px solid #5b9bd5", borderRadius: "16px", padding: "24px", marginBottom: "24px" }}>
              <p style={{ fontSize: "18px", fontWeight: "800", color: "#1e40af", margin: "0 0 10px 0" }}>📚 Noch mehr lernen?</p>
              <p style={{ color: "#3b4f7a", margin: "0 0 16px 0", fontSize: "15px" }}>Unsere Lernmaterialien helfen dir noch besser zu werden!</p>
              <button onClick={() => window.location.href = "/"} style={{ background: "linear-gradient(135deg, #5b9bd5, #2d6da8)", color: "white", border: "none", padding: "12px 28px", borderRadius: "10px", fontWeight: "800", fontSize: "16px", cursor: "pointer" }}>
                Materialien ansehen
              </button>
            </div>

            <button onClick={neuStarten} style={{ width: "100%", background: "linear-gradient(135deg, #5b9bd5, #2d6da8)", color: "white", border: "none", padding: "16px", borderRadius: "12px", fontSize: "18px", cursor: "pointer", fontWeight: "800" }}>
              🔄 Nochmal spielen!
            </button>
          </div>
        )}
      </div>
    </div>
  );
}