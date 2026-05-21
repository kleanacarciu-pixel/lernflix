"use client";
import { useState, useEffect } from "react";

const THEMEN = [
  { id: "pythagoras", name: "📐 Pythagoras", klasse: "Klasse 8-9", fach: "mathe" },
  { id: "brueche", name: "➗ Brüche", klasse: "Klasse 6-7", fach: "mathe" },
  { id: "prozent", name: "📊 Prozentrechnung", klasse: "Klasse 7-8", fach: "mathe" },
  { id: "wahrscheinlichkeit", name: "🎲 Wahrscheinlichkeit", klasse: "Klasse 8-9", fach: "mathe" },
  { id: "gleichungen", name: "⚖️ Gleichungen", klasse: "Klasse 7-8", fach: "mathe" },
  { id: "einheiten", name: "📏 Einheiten", klasse: "Klasse 3-6", fach: "mathe" },
  { id: "einheiten-umrechnen", name: "🔄 Einheiten umrechnen", klasse: "Klasse 4-6", fach: "mathe" },
  { id: "multiplikation", name: "✖️ Multiplikation", klasse: "Klasse 2-3", fach: "mathe" },
  { id: "division", name: "➗ Division", klasse: "Klasse 2-3", fach: "mathe" },
  { id: "lichtbrechung", name: "💡 Lichtbrechung", klasse: "Klasse 7-9", fach: "physik" },
  { id: "farben", name: "🌈 Farben & Licht", klasse: "Klasse 5-7", fach: "physik" },
  { id: "temperatur", name: "🌡️ Temperatur", klasse: "Klasse 5-8", fach: "physik" },
  { id: "strahlung", name: "☢️ Strahlung", klasse: "Klasse 8-10", fach: "physik" },
  { id: "mechanik", name: "⚙️ Mechanik", klasse: "Klasse 8-9", fach: "physik" },
];

const SCHWIERIGKEITEN = [
  { id: "leicht", name: "😊 Leicht", farbe: "#22c55e" },
  { id: "mittel", name: "😤 Mittel", farbe: "#f59e0b" },
  { id: "schwer", name: "🔥 Schwer", farbe: "#ef4444" },
];

const GIFS_SUPER = [
  "https://media.giphy.com/media/3ohhwytHcusSCXXOUg/giphy.gif",
  "https://media.giphy.com/media/artj92V8o75VPL7AeQ/giphy.gif",
  "https://media.giphy.com/media/l4FGGafcOHmrlQxG0/giphy.gif",
];
const GIFS_GUT = [
  "https://media.giphy.com/media/xT5LMzIlfQIBe1GzPi/giphy.gif",
  "https://media.giphy.com/media/26u4lOMA8JKSnL9Uk/giphy.gif",
];
const GIFS_WEITER = [
  "https://media.giphy.com/media/26BRzQS5HXcEWVnkk/giphy.gif",
  "https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif",
];

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
  const [vorgeladeneFragen, setVorgeladeneFragen] = useState<Frage[]>([]);
  const [aktuelle, setAktuelle] = useState(0);
  const [ausgewaehlt, setAusgewaehlt] = useState<number | null>(null);
  const [punkte, setPunkte] = useState(0);
  const [laden, setLaden] = useState(false);
  const [vorladen, setVorladen] = useState(false);
  const [antwortGezeigt, setAntwortGezeigt] = useState(false);
  const [zufallsGif, setZufallsGif] = useState("");
  const [aktiverTab, setAktiverTab] = useState<"mathe" | "physik">("mathe");

  useEffect(() => {
    if (thema && schwierigkeit) {
      setVorladen(true);
      setVorgeladeneFragen([]);
      fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ thema, schwierigkeit }),
      })
        .then(res => res.json())
        .then(data => {
          if (data && data.fragen && data.fragen.length > 0) {
            setVorgeladeneFragen(data.fragen);
          }
          setVorladen(false);
        })
        .catch(() => setVorladen(false));
    }
  }, [thema, schwierigkeit]);

  function startQuiz() {
    if (vorgeladeneFragen.length > 0) {
      setFragen(vorgeladeneFragen);
      setSchritt("quiz");
      setAktuelle(0);
      setPunkte(0);
    } else if (vorladen) {
      setLaden(true);
      const interval = setInterval(() => {
        if (vorgeladeneFragen.length > 0) {
          setFragen(vorgeladeneFragen);
          setSchritt("quiz");
          setAktuelle(0);
          setPunkte(0);
          setLaden(false);
          clearInterval(interval);
        }
      }, 500);
    }
  }

  function antwortWaehlen(index: number) {
    if (antwortGezeigt) return;
    setAusgewaehlt(index);
    setAntwortGezeigt(true);
    if (index === fragen[aktuelle].richtig) {
      setPunkte((p) => p + 1);
    }
  }

  function naechsteFrage() {
    if (aktuelle + 1 >= fragen.length) {
      const finalPunkte = punkte + (ausgewaehlt === fragen[aktuelle].richtig ? 1 : 0);
      const prozentFinal = Math.round((finalPunkte / fragen.length) * 100);
      let gifListe = GIFS_WEITER;
      if (prozentFinal >= 80) gifListe = GIFS_SUPER;
      else if (prozentFinal >= 50) gifListe = GIFS_GUT;
      setZufallsGif(gifListe[Math.floor(Math.random() * gifListe.length)]);
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
    setVorgeladeneFragen([]);
    setAktuelle(0);
    setPunkte(0);
    setAusgewaehlt(null);
    setAntwortGezeigt(false);
    setZufallsGif("");
  }

  const gesamtFragen = fragen && fragen.length > 0 ? fragen.length : 1;
  const prozent = Math.round((punkte / gesamtFragen) * 100);
  const mathThemen = THEMEN.filter(t => t.fach === "mathe");
  const physikThemen = THEMEN.filter(t => t.fach === "physik");

  return (
    <div style={{ minHeight: "100vh", background: "#f5f0e8", fontFamily: "Arial, sans-serif" }}>
      <div style={{ background: "linear-gradient(135deg, #5b9bd5, #2d6da8)", padding: "20px", textAlign: "center" }}>
        <h1 style={{ color: "white", margin: 0, fontSize: "32px", fontWeight: "900" }}>🎓 Lernflix Quiz</h1>
        <p style={{ color: "rgba(255,255,255,0.9)", margin: "6px 0 0 0", fontSize: "16px" }}>
          Teste dein Wissen — kostenlos & interaktiv!
        </p>
      </div>

      <div style={{ maxWidth: "750px", margin: "0 auto", padding: "30px 16px" }}>

        {schritt === "auswahl" && (
          <div>
            <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
              <button onClick={() => { setAktiverTab("mathe"); setThema(""); }}
                style={{ flex: 1, padding: "14px", borderRadius: "12px", border: "none", cursor: "pointer", fontSize: "18px", fontWeight: "700", background: aktiverTab === "mathe" ? "linear-gradient(135deg, #5b9bd5, #2d6da8)" : "white", color: aktiverTab === "mathe" ? "white" : "#5b9bd5" }}>
                📐 Mathe
              </button>
              <button onClick={() => { setAktiverTab("physik"); setThema(""); }}
                style={{ flex: 1, padding: "14px", borderRadius: "12px", border: "none", cursor: "pointer", fontSize: "18px", fontWeight: "700", background: aktiverTab === "physik" ? "linear-gradient(135deg, #5b9bd5, #2d6da8)" : "white", color: aktiverTab === "physik" ? "white" : "#5b9bd5" }}>
                ⚡ Physik
              </button>
            </div>

            <h2 style={{ color: "#1a1a2e", textAlign: "center", fontSize: "22px", marginBottom: "16px" }}>Wähle dein Thema!</h2>
            <div style={{ display: "grid", gap: "10px", marginBottom: "28px" }}>
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

            <button
              onClick={startQuiz}
              disabled={!thema || !schwierigkeit || laden}
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
              <p style={{ fontSize: "22px", color: "#555", margin: "0 0 20px 0" }}>{prozent}% richtig</p>
              {zufallsGif && <img src={zufallsGif} alt="Ergebnis" style={{ width: "200px", borderRadius: "16px", border: "4px solid #dbeafe" }} />}
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