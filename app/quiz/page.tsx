"use client";
import { useState } from "react";

const THEMEN = [
  { id: "pythagoras", name: "📐 Pythagoras", klasse: "Klasse 8-9" },
  { id: "brueche", name: "➗ Brüche", klasse: "Klasse 6-7" },
  { id: "prozent", name: "📊 Prozentrechnung", klasse: "Klasse 7-8" },
  { id: "wahrscheinlichkeit", name: "🎲 Wahrscheinlichkeit", klasse: "Klasse 8-9" },
  { id: "gleichungen", name: "⚖️ Gleichungen", klasse: "Klasse 7-8" },
];

const SCHWIERIGKEITEN = [
  { id: "leicht", name: "😊 Leicht", farbe: "#4CAF50" },
  { id: "mittel", name: "😤 Mittel", farbe: "#FF9800" },
  { id: "schwer", name: "🔥 Schwer", farbe: "#f44336" },
];

const GIFS: Record<string, string> = {
  super: "https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif",
  gut: "https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif",
  weiter: "https://media.giphy.com/media/l4FGGafcOHmrlQxG0/giphy.gif",
};

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

  async function startQuiz() {
    setLaden(true);
    try {
      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ thema, schwierigkeit }),
      });
      const data = await res.json();
      setFragen(data.fragen);
      setSchritt("quiz");
      setAktuelle(0);
      setPunkte(0);
    } catch {
      alert("Fehler! Bitte nochmal versuchen!");
    }
    setLaden(false);
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
    setAktuelle(0);
    setPunkte(0);
    setAusgewaehlt(null);
    setAntwortGezeigt(false);
  }

  const prozent = fragen.length > 0 ? Math.round((punkte / fragen.length) * 100) : 0;
  const gifKey = prozent >= 80 ? "super" : prozent >= 50 ? "gut" : "weiter";

  return (
    <div style={{ minHeight: "100vh", background: "#f5f0e8", fontFamily: "Arial, sans-serif" }}>

      <div style={{ background: "#5b9bd5", padding: "20px", textAlign: "center" }}>
        <h1 style={{ color: "white", margin: 0, fontSize: "28px" }}>🎓 Lernflix Quiz</h1>
        <p style={{ color: "white", margin: "5px 0 0 0" }}>
          Teste dein Wissen — kostenlos und interaktiv!
        </p>
      </div>

      <div style={{ maxWidth: "700px", margin: "0 auto", padding: "30px 20px" }}>

        {schritt === "auswahl" && (
          <div>
            <h2 style={{ color: "#5b9bd5", textAlign: "center" }}>Wähle dein Thema! 📚</h2>
            <div style={{ display: "grid", gap: "12px", marginBottom: "30px" }}>
              {THEMEN.map((t) => (
                <div
                  key={t.id}
                  onClick={() => setThema(t.id)}
                  style={{
                    background: thema === t.id ? "#5b9bd5" : "white",
                    color: thema === t.id ? "white" : "#333",
                    padding: "18px 24px",
                    borderRadius: "12px",
                    cursor: "pointer",
                    border: `2px solid ${thema === t.id ? "#5b9bd5" : "#ddd"}`,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: "18px",
                  }}
                >
                  <span>{t.name}</span>
                  <span style={{ fontSize: "14px", opacity: 0.8 }}>{t.klasse}</span>
                </div>
              ))}
            </div>

            <h2 style={{ color: "#5b9bd5", textAlign: "center" }}>Schwierigkeit? 💪</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "30px" }}>
              {SCHWIERIGKEITEN.map((s) => (
                <div
                  key={s.id}
                  onClick={() => setSchwierigkeit(s.id)}
                  style={{
                    background: schwierigkeit === s.id ? s.farbe : "white",
                    color: schwierigkeit === s.id ? "white" : "#333",
                    padding: "18px",
                    borderRadius: "12px",
                    cursor: "pointer",
                    border: `2px solid ${schwierigkeit === s.id ? s.farbe : "#ddd"}`,
                    textAlign: "center",
                    fontSize: "16px",
                  }}
                >
                  {s.name}
                </div>
              ))}
            </div>

            <button
              onClick={startQuiz}
              disabled={!thema || !schwierigkeit || laden}
              style={{
                width: "100%",
                background: thema && schwierigkeit ? "#5b9bd5" : "#ccc",
                color: "white",
                border: "none",
                padding: "18px",
                borderRadius: "12px",
                fontSize: "20px",
                cursor: thema && schwierigkeit ? "pointer" : "not-allowed",
                fontWeight: "bold",
              }}
            >
              {laden ? "⏳ Fragen werden erstellt..." : "🚀 Quiz starten!"}
            </button>
          </div>
        )}

        {schritt === "quiz" && fragen.length > 0 && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
              <span style={{ color: "#5b9bd5", fontWeight: "bold" }}>
                Frage {aktuelle + 1} von {fragen.length}
              </span>
              <span style={{ color: "#5b9bd5", fontWeight: "bold" }}>
                ⭐ {punkte} Punkte
              </span>
            </div>

            <div style={{ background: "#ddd", borderRadius: "10px", height: "8px", marginBottom: "24px" }}>
              <div style={{
                background: "#5b9bd5",
                height: "8px",
                borderRadius: "10px",
                width: `${((aktuelle + 1) / fragen.length) * 100}%`,
              }} />
            </div>

            <div style={{
              background: "white",
              borderRadius: "16px",
              padding: "28px",
              marginBottom: "20px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
            }}>
              <h3 style={{ fontSize: "20px", color: "#333", marginTop: 0, lineHeight: 1.5 }}>
                {fragen[aktuelle].frage}
              </h3>
            </div>

            <div style={{ display: "grid", gap: "12px", marginBottom: "20px" }}>
              {fragen[aktuelle].antworten.map((antwort, i) => {
                let bg = "white";
                let border = "#ddd";
                if (antwortGezeigt) {
                  if (i === fragen[aktuelle].richtig) { bg = "#e8f5e9"; border = "#4CAF50"; }
                  else if (i === ausgewaehlt) { bg = "#ffebee"; border = "#f44336"; }
                }
                return (
                  <div
                    key={i}
                    onClick={() => antwortWaehlen(i)}
                    style={{
                      background: bg,
                      border: `2px solid ${border}`,
                      borderRadius: "12px",
                      padding: "16px 20px",
                      cursor: antwortGezeigt ? "default" : "pointer",
                      fontSize: "16px",
                    }}
                  >
                    <span style={{ fontWeight: "bold", marginRight: "10px", color: "#5b9bd5" }}>
                      {["A", "B", "C", "D"][i]}.
                    </span>
                    {antwort}
                  </div>
                );
              })}
            </div>

            {antwortGezeigt && (
              <div>
                <div style={{
                  background: ausgewaehlt === fragen[aktuelle].richtig ? "#e8f5e9" : "#ffebee",
                  border: `2px solid ${ausgewaehlt === fragen[aktuelle].richtig ? "#4CAF50" : "#f44336"}`,
                  borderRadius: "12px",
                  padding: "16px",
                  marginBottom: "16px",
                }}>
                  {ausgewaehlt === fragen[aktuelle].richtig ? "✅ Richtig! " : "❌ Falsch! "}
                  {fragen[aktuelle].erklaerung}
                </div>
                <button
                  onClick={naechsteFrage}
                  style={{
                    width: "100%",
                    background: "#5b9bd5",
                    color: "white",
                    border: "none",
                    padding: "16px",
                    borderRadius: "12px",
                    fontSize: "18px",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  {aktuelle + 1 >= fragen.length ? "🏁 Ergebnis sehen!" : "➡️ Nächste Frage"}
                </button>
              </div>
            )}
          </div>
        )}

        {schritt === "ergebnis" && (
          <div style={{ textAlign: "center" }}>
            <h2 style={{ color: "#5b9bd5", fontSize: "28px" }}>
              {prozent >= 80 ? "🏆 Fantastisch!" : prozent >= 50 ? "👍 Gut gemacht!" : "💪 Weiter üben!"}
            </h2>
            <div style={{
              background: "white",
              borderRadius: "16px",
              padding: "30px",
              marginBottom: "24px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
            }}>
              <p style={{ fontSize: "48px", fontWeight: "bold", color: "#5b9bd5", margin: "0 0 10px 0" }}>
                {punkte}/{fragen.length}
              </p>
              <p style={{ fontSize: "24px", color: "#666", margin: 0 }}>{prozent}% richtig</p>
              <img
                src={GIFS[gifKey]}
                alt="Ergebnis"
                style={{ width: "200px", borderRadius: "12px", marginTop: "20px" }}
              />
            </div>

            <div style={{
              background: "#fff3e0",
              border: "2px solid #FF9800",
              borderRadius: "16px",
              padding: "24px",
              marginBottom: "24px",
            }}>
              <p style={{ fontSize: "18px", fontWeight: "bold", color: "#e65100", margin: "0 0 12px 0" }}>
                📚 Noch mehr lernen?
              </p>
              <p style={{ color: "#666", margin: "0 0 16px 0" }}>
                Unsere Lernmaterialien helfen dir noch besser zu werden!
              </p>
              <button
                onClick={() => window.location.href = "/"}
                style={{
                  background: "#FF9800",
                  color: "white",
                  padding: "12px 24px",
                  borderRadius: "8px",
                  border: "none",
                  fontWeight: "bold",
                  fontSize: "16px",
                  cursor: "pointer",
                }}
              >
                🛒 Materialien ansehen
              </button>
            </div>

            <button
              onClick={neuStarten}
              style={{
                width: "100%",
                background: "#5b9bd5",
                color: "white",
                border: "none",
                padding: "16px",
                borderRadius: "12px",
                fontSize: "18px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              🔄 Nochmal spielen!
            </button>
          </div>
        )}

      </div>
    </div>
  );
}