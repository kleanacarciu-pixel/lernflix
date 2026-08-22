"use client";
import { useState, useEffect, useRef } from "react";
import {
  SCHULARTEN,
  klassenFuer,
  themenFuer,
  themaKey,
  themaOhneEmoji,
  type Fach,
  type SchulartId,
} from "@/lib/quiz/catalog";
import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";
import InteraktivQuiz from "./interaktiv";

const F = {
  white: "#ffffff",
  ink: "#0F172A",
  inkSoft: "#475569",
  inkMuted: "#94A3B8",
  border: "#E2E8F0",
  coral: "#1769FF",
  coralDeep: "#1156DD",
  blue: "#1769FF",
  green: "#10B981",
  bgSoft: "#fef6e8",
};
const SANS = '"Inter", -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';

export default function QuizPage() {
  const [schritt, setSchritt] = useState<"auswahl" | "spiel">("auswahl");
  const [fach, setFach] = useState<Fach>("mathe");
  const [schulart, setSchulart] = useState<SchulartId | null>(null);
  const [klasse, setKlasse] = useState<number | null>(null);
  const [thema, setThema] = useState<string>(""); // inkl. Emoji, wie im Katalog

  const [aufgaben, setAufgaben] = useState<Aufgabe[]>([]);
  const [titel, setTitel] = useState("");
  const [laden, setLaden] = useState(false);
  const [hinweis, setHinweis] = useState<string>("");

  const [verfuegbar, setVerfuegbar] = useState<Set<string>>(new Set());
  const geladen = useRef(false);

  useEffect(() => {
    if (geladen.current) return;
    geladen.current = true;
    fetch("/api/quiz/katalog")
      .then((r) => r.json())
      .then((d) => { if (d && Array.isArray(d.verfuegbar)) setVerfuegbar(new Set<string>(d.verfuegbar)); })
      .catch(() => {});
  }, []);

  const klassen = schulart ? klassenFuer(fach, schulart) : [];
  const themen = schulart && klasse !== null ? themenFuer(fach, schulart, klasse) : [];

  function istVerfuegbar(t: string): boolean {
    if (!schulart || klasse === null) return false;
    return verfuegbar.has(themaKey(fach, schulart, klasse, t));
  }
  const themaVerfuegbar = thema !== "" && istVerfuegbar(thema);

  function waehleFach(f: Fach) { setFach(f); setSchulart(null); setKlasse(null); setThema(""); setHinweis(""); }
  function waehleSchulart(s: SchulartId) { setSchulart(s); setKlasse(null); setThema(""); setHinweis(""); }
  function waehleKlasse(k: number) { setKlasse(k); setThema(""); setHinweis(""); }

  async function starten() {
    if (!schulart || klasse === null || !thema || !themaVerfuegbar) return;
    setLaden(true);
    setHinweis("");
    try {
      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fach, schulart, klasse, thema: themaOhneEmoji(thema) }),
      });
      const data = await res.json();
      if (data && data.status === "ok" && Array.isArray(data.aufgaben) && data.aufgaben.length > 0) {
        setAufgaben(data.aufgaben);
        setTitel(themaOhneEmoji(thema));
        setSchritt("spiel");
      } else if (data && data.status === "bald") {
        setHinweis("Für dieses Thema sind gerade noch keine Aufgaben fertig. Wir bauen es Thema für Thema aus – schau bald wieder vorbei!");
      } else {
        setHinweis("Die Aufgaben konnten nicht geladen werden. Bitte versuch es noch einmal.");
      }
    } catch {
      setHinweis("Verbindungsfehler. Bitte versuch es noch einmal.");
    } finally {
      setLaden(false);
    }
  }

  function neu() {
    setSchritt("auswahl");
    setThema("");
    setAufgaben([]);
    setHinweis("");
  }

  return (
    <main style={{ minHeight: "100vh", background: "#ffffff", fontFamily: SANS, color: F.ink, position: "relative", overflow: "hidden" }}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" />

      <div style={{ position: "fixed", inset: 0, backgroundImage: "linear-gradient(rgba(23,105,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(23,105,255,0.07) 1px, transparent 1px)", backgroundSize: "40px 40px", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", top: "10%", right: "-150px", width: "550px", height: "550px", borderRadius: "50%", background: "radial-gradient(circle, rgba(23,105,255,0.08) 0%, transparent 70%)", pointerEvents: "none", filter: "blur(40px)", zIndex: 0 }} />

      <style>{`
        * { -webkit-font-smoothing: antialiased; }
        body { background: #ffffff; margin: 0; font-family: ${SANS}; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { opacity: 0.8; } 50% { opacity: 1; } }
        .fade-up { animation: fadeUp 0.5s cubic-bezier(0.2,0.8,0.2,1) both; }
        .pulse { animation: pulse 1.4s ease-in-out infinite; }
        .pill { transition: all 0.18s cubic-bezier(0.2,0.8,0.2,1); cursor: pointer; }
        .pill:hover:not(.disabled) { transform: translateY(-2px); }
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
        .btn-primary:hover:not(:disabled) { background: ${F.coralDeep}; transform: translateY(-1px); }
        .btn-primary:disabled { background: ${F.inkMuted}; cursor: not-allowed; box-shadow: none; opacity: 0.6; }
      `}</style>

      <header style={{ background: "rgba(255,255,255,0.85)", padding: "16px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${F.border}`, position: "sticky", top: 0, zIndex: 50, backdropFilter: "saturate(180%) blur(20px)" }}>
        <a href="/" style={{ textDecoration: "none" }}>
          <span style={{ fontSize: "24px", fontWeight: 800, color: F.ink, letterSpacing: "-0.025em" }}>Lern<span style={{ color: F.blue }}>flix</span></span>
        </a>
        {schritt === "spiel"
          ? <button onClick={neu} style={{ background: "none", border: "none", color: F.inkSoft, fontSize: "14px", fontWeight: 600, cursor: "pointer", fontFamily: SANS }}>← Abbrechen</button>
          : <a href="/" style={{ color: F.inkSoft, textDecoration: "none", fontSize: "14px", fontWeight: 600 }}>← Zurück</a>}
      </header>

      <div style={{ maxWidth: "780px", margin: "0 auto", padding: "32px 22px 80px", position: "relative", zIndex: 1 }}>

        {schritt === "spiel" && aufgaben.length > 0 && (
          <InteraktivQuiz aufgaben={aufgaben} titel={titel} onNeu={neu} />
        )}

        {schritt === "auswahl" && (
          <div className="fade-up">
            <div style={{ textAlign: "center", marginBottom: "32px" }}>
              <img src="/20260613_173033176_iOS.webp" alt="Mathe und Physik Bücher" style={{ width: "150px", height: "auto", marginBottom: "12px", display: "inline-block" }} />
              <div>
                <span style={{ display: "inline-block", background: F.white, color: F.coral, padding: "7px 14px", borderRadius: "999px", fontSize: "12px", fontWeight: 700, marginBottom: "16px", boxShadow: "0 4px 14px rgba(23,105,255,0.18)", border: `1px solid ${F.border}` }}>
                  Kostenlos üben · geprüfte Aufgaben
                </span>
              </div>
              <h1 style={{ fontSize: "44px", fontWeight: 800, margin: "0 0 10px", letterSpacing: "-0.03em", lineHeight: 1.0, color: F.ink }}>
                Übe, bis du es <span style={{ color: F.coral }}>kannst</span>.
              </h1>
              <p style={{ fontSize: "16px", color: F.inkSoft, margin: 0, lineHeight: 1.55 }}>
                Wähle Fach, Schulart, Klasse und Thema.
              </p>
            </div>

            <Section nr="1" label="Fach">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                {(["mathe", "physik"] as const).map((f) => (
                  <button key={f} className="pill" onClick={() => waehleFach(f)} style={pillStyle(fach === f)}>
                    {f === "mathe" ? "Mathematik" : "Physik"}
                  </button>
                ))}
              </div>
            </Section>

            <Section nr="2" label="Schulart">
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "10px" }}>
                {SCHULARTEN.map((s) => {
                  const aktiv = schulart === s.id;
                  const hatThemen = klassenFuer(fach, s.id).length > 0;
                  return (
                    <button key={s.id} className={"pill" + (hatThemen ? "" : " disabled")} disabled={!hatThemen}
                      onClick={() => hatThemen && waehleSchulart(s.id)}
                      style={{ ...pillStyle(aktiv), opacity: hatThemen ? 1 : 0.45, cursor: hatThemen ? "pointer" : "not-allowed", padding: "14px 10px" }}>
                      {s.name}
                    </button>
                  );
                })}
              </div>
              {schulart && klassen.length === 0 && (
                <p style={{ fontSize: "13px", color: F.inkMuted, margin: "10px 2px 0" }}>Für dieses Fach gibt es in dieser Schulart (noch) keine Themen.</p>
              )}
            </Section>

            {schulart && klassen.length > 0 && (
              <Section nr="3" label="Klasse">
                <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "8px" }}>
                  {klassen.map((k) => (
                    <button key={k} className="pill" onClick={() => waehleKlasse(k)}
                      style={{ aspectRatio: "1 / 1", borderRadius: "14px", border: `2px solid ${klasse === k ? F.coral : "#CDD9F5"}`, background: klasse === k ? F.coral : "#F5F8FF", color: klasse === k ? F.white : F.ink, fontSize: "18px", fontWeight: 800, fontFamily: SANS, padding: 0, boxShadow: klasse === k ? "0 8px 20px rgba(23,105,255,0.25)" : "0 2px 6px rgba(15,23,42,0.04)" }}>
                      {k}
                    </button>
                  ))}
                </div>
              </Section>
            )}

            {schulart && klasse !== null && themen.length > 0 && (
              <Section nr="4" label="Thema">
                <div style={{ display: "grid", gap: "10px" }}>
                  {themen.map((t) => {
                    const emojiMatch = t.match(/^([^a-zA-ZÄÖÜäöüß0-9]+)/);
                    const emoji = emojiMatch ? emojiMatch[1].trim() : "📘";
                    const clean = themaOhneEmoji(t);
                    const aktiv = thema === t;
                    const frei = istVerfuegbar(t);
                    return (
                      <button key={t} className={"pill" + (frei ? "" : " disabled")} disabled={!frei}
                        onClick={() => frei && setThema(t)}
                        style={{ textAlign: "left", padding: "16px 18px", borderRadius: "14px", border: `2px solid ${aktiv ? F.coral : "#CDD9F5"}`, background: aktiv ? "#E8F0FF" : "#F5F8FF", color: F.ink, fontSize: "16px", fontWeight: 700, fontFamily: SANS, display: "flex", alignItems: "center", gap: "14px", boxShadow: aktiv ? "0 8px 20px rgba(23,105,255,0.18)" : "0 2px 6px rgba(15,23,42,0.04)", opacity: frei ? 1 : 0.6, cursor: frei ? "pointer" : "not-allowed" }}>
                        <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "38px", height: "38px", borderRadius: "10px", background: aktiv ? F.coral : F.white, border: `1.5px solid ${aktiv ? F.coral : "#CDD9F5"}`, fontSize: "20px", flexShrink: 0 }}>
                          {aktiv ? (
                            <svg width="18" height="18" viewBox="0 0 12 12" fill="none"><path d="M3 6L5 8L9 4" stroke="#ffffff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                          ) : emoji}
                        </span>
                        <span style={{ flex: 1 }}>{clean}</span>
                        {!frei && (
                          <span style={{ background: F.bgSoft, color: F.inkMuted, fontSize: "11px", fontWeight: 700, padding: "4px 9px", borderRadius: "999px", flexShrink: 0 }}>Bald verfügbar</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </Section>
            )}

            {hinweis && (
              <div style={{ background: F.bgSoft, border: `1px solid ${F.border}`, borderRadius: "14px", padding: "14px 16px", marginBottom: "16px", color: F.inkSoft, fontSize: "14px", lineHeight: 1.5 }}>{hinweis}</div>
            )}

            <button onClick={starten} disabled={!themaVerfuegbar || laden} className="btn-primary">
              {laden ? (
                <span className="pulse" style={{ display: "inline-flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: F.white }} />
                  Aufgaben werden geladen ...
                </span>
              ) : (<>Übung starten <span style={{ fontSize: "18px" }}>→</span></>)}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

function Section({ nr, label, children }: { nr: string; label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "28px" }} className="fade-up">
      <p style={{ fontSize: "11.5px", color: F.inkMuted, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", margin: "0 0 10px" }}>Schritt {nr} · {label}</p>
      {children}
    </div>
  );
}

function pillStyle(aktiv: boolean): React.CSSProperties {
  return {
    padding: "16px 18px", borderRadius: "14px",
    border: `1.5px solid ${aktiv ? F.ink : F.border}`,
    background: aktiv ? F.ink : F.white, color: aktiv ? F.white : F.ink,
    fontSize: "16px", fontWeight: 700, fontFamily: SANS,
  };
}
