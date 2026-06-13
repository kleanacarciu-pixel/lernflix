"use client";
import { useState, useEffect } from "react";

const KLASSEN = ["5", "6", "7", "8", "9", "10", "11", "12", "13"];
const WHATSAPP_NUMMER = "4917624700519";

// Drei Design-Themes wie auf /lernplan
type ThemeKey = "rosa" | "navy" | "gold";
const THEMES: Record<ThemeKey, {
  name: string; emoji: string;
  dark: string; darkSoft: string; accent: string;
  bg: string; card: string; line: string; ink: string; soft: string;
  swatches: string[];
}> = {
  rosa: {
    name: "Rosa & Türkis", emoji: "🌸",
    dark: "#2f8f86", darkSoft: "#3da199", accent: "#c97a96",
    bg: "#fdfaf6", card: "#ffffff", line: "#efe6dd", ink: "#33312e", soft: "#7d756c",
    swatches: ["#2f8f86", "#c97a96", "#f0e3d6", "#f7eef0"],
  },
  navy: {
    name: "Navy & Grün", emoji: "⚡",
    dark: "#1769FF", darkSoft: "#2b76ff", accent: "#3a8a4f",
    bg: "#FFF9F0", card: "#ffffff", line: "#ece1cd", ink: "#0F172A", soft: "#475569",
    swatches: ["#1769FF", "#3a8a4f", "#dbe6f0", "#e3f0e6"],
  },
  gold: {
    name: "Gold & Beige", emoji: "✨",
    dark: "#8a6d3b", darkSoft: "#a07f45", accent: "#b89150",
    bg: "#fbf7ef", card: "#ffffff", line: "#ece1cd", ink: "#3a342a", soft: "#857a66",
    swatches: ["#6f5829", "#b89150", "#f0e6d2", "#f7f1e4"],
  },
};

type Foto = { name: string; preview: string; media_type: string; data: string };
type ChatNachricht = { role: "user" | "assistant"; content: string };

export default function LernheldPage() {
  const [theme, setTheme] = useState<ThemeKey>("navy");
  const [name, setName] = useState("");
  const [klasse, setKlasse] = useState("");
  const [fach, setFach] = useState<"mathe" | "physik">("mathe");
  const [datum, setDatum] = useState("");
  const [fotos, setFotos] = useState<Foto[]>([]);
  const [schwierigkeiten, setSchwierigkeiten] = useState("");
  const [laden, setLaden] = useState(false);
  const [plan, setPlan] = useState("");
  const [fehler, setFehler] = useState("");

  const [supportOffen, setSupportOffen] = useState(false);
  const [chat, setChat] = useState<ChatNachricht[]>([]);
  const [frage, setFrage] = useState("");
  const [botLaedt, setBotLaedt] = useState(false);
  const [ladeText, setLadeText] = useState("Dein Plan entsteht");
  const [ladeSub, setLadeSub] = useState("Einen Moment — deine Unterlagen werden durchgesehen.");
  const [testModus, setTestModus] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const host = window.location.hostname;
    const istVorschau = host.endsWith(".vercel.app") || host === "localhost";
    const wuenscht = new URLSearchParams(window.location.search).get("test") === "ja";
    if (istVorschau && wuenscht) setTestModus(true);
  }, []);

  const t = THEMES[theme];
  const bereit = name && klasse && datum && fotos.length > 0;

  async function bildVerkleinern(file: File): Promise<{ media_type: string; data: string }> {
    const bitmap = await createImageBitmap(file);
    const maxKante = 700;
    const skala = Math.min(1, maxKante / Math.max(bitmap.width, bitmap.height));
    const w = Math.round(bitmap.width * skala);
    const h = Math.round(bitmap.height * skala);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas nicht verfuegbar");
    ctx.drawImage(bitmap, 0, 0, w, h);
    bitmap.close?.();
    const dataUrl: string = await new Promise((res, rej) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) return rej(new Error("blob leer"));
          const r = new FileReader();
          r.onload = () => res(r.result as string);
          r.onerror = () => rej(new Error("lesen fehlgeschlagen"));
          r.readAsDataURL(blob);
        },
        "image/jpeg",
        0.7,
      );
    });
    const base64 = dataUrl.split(",")[1];
    return { media_type: "image/jpeg", data: base64 };
  }

  async function fotosHinzufuegen(files: FileList | null) {
    if (!files) return;
    const neue: Foto[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith("image/")) continue;
      try {
        const klein = await bildVerkleinern(file);
        neue.push({
          name: file.name,
          preview: URL.createObjectURL(file),
          media_type: klein.media_type,
          data: klein.data,
        });
      } catch {
        // Bild ueberspringen, wenn es nicht verarbeitet werden kann
      }
    }
    setFotos((alt) => [...alt, ...neue].slice(0, 10));
  }

  function fotoEntfernen(index: number) {
    setFotos((alt) => alt.filter((_, i) => i !== index));
  }

  type Daten = {
    name: string; klasse: string; fach: "mathe" | "physik"; datum: string;
    theme: ThemeKey; schwierigkeiten: string;
    bilder: { media_type: string; data: string }[];
  };

  async function planErzeugen(d: Daten) {
    setLadeText("Schritt 1 von 2 — Themen erkennen");
    setLadeSub("Deine Fotos werden durchgesehen, jedes Thema wird erkannt.");
    try {
      const resThemen = await fetch("/api/lernheld-themen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fach: d.fach, klasse: d.klasse, schwierigkeiten: d.schwierigkeiten, bilder: d.bilder }),
      });
      if (resThemen.status === 413) {
        setFehler("Deine Fotos sind zusammen zu gross. Probiere es mit weniger oder kleineren Bildern.");
        return;
      }
      const themenData = await resThemen.json().catch(() => null);
      if (!themenData || !Array.isArray(themenData.themen) || themenData.themen.length === 0) {
        setFehler(themenData?.error || "Die Themen konnten nicht erkannt werden. Bitte versuche es nochmal.");
        return;
      }

      setLadeText("Schritt 2 von 2 — Dein Plan wird geschrieben");
      setLadeSub(`${themenData.themen.length} Themen erkannt. Jetzt wird alles zu deinem Plan zusammengestellt.`);

      const resPlan = await fetch("/api/lernheld", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: d.name, klasse: d.klasse, fach: d.fach, datum: d.datum, theme: d.theme,
          schwierigkeiten: d.schwierigkeiten, themen: themenData.themen,
        }),
      });
      const planData = await resPlan.json().catch(() => null);
      if (planData && planData.html) {
        setPlan(planData.html);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else if (planData && planData.error) {
        setFehler(planData.error);
      } else {
        setFehler("Es hat leider nicht geklappt. Bitte versuche es nochmal.");
      }
    } catch {
      setFehler("Es hat leider nicht geklappt. Bitte versuche es nochmal.");
    }
  }

  async function zahlungStarten() {
    if (!bereit) return;
    setFehler("");
    const daten: Daten = {
      name, klasse, fach, datum, theme, schwierigkeiten,
      bilder: fotos.map((f) => ({ media_type: f.media_type, data: f.data })),
    };
    try {
      sessionStorage.setItem("lernheld_pending", JSON.stringify(daten));
    } catch {
      setFehler("Deine Fotos sind zu gross fuer deinen Browser. Bitte nimm weniger.");
      return;
    }
    setLaden(true);
    setLadeText("Du wirst zur Bezahlung weitergeleitet");
    setLadeSub("Einen Moment bitte — sicher bezahlen mit Karte ueber Stripe.");
    try {
      const res = await fetch("/api/checkout-lernheld", { method: "POST" });
      const data = await res.json().catch(() => null);
      if (data && data.url) {
        window.location.href = data.url;
      } else {
        setFehler(data?.error || "Die Bezahlung konnte nicht gestartet werden.");
        setLaden(false);
      }
    } catch {
      setFehler("Die Bezahlung konnte nicht gestartet werden.");
      setLaden(false);
    }
  }

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const sid = params.get("session_id");
    if (!sid) return;

    (async () => {
      setLaden(true);
      setFehler("");
      setLadeText("Bezahlung wird geprueft");
      setLadeSub("Einen Moment bitte...");
      try {
        const verifyRes = await fetch("/api/verify-lernheld", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_id: sid }),
        });
        const verifyData = await verifyRes.json().catch(() => null);
        if (!verifyData || !verifyData.ok) {
          setFehler("Die Bezahlung konnte nicht bestaetigt werden. Falls du gerade bezahlt hast, lade die Seite kurz neu.");
          setLaden(false);
          return;
        }

        const stored = sessionStorage.getItem("lernheld_pending");
        sessionStorage.removeItem("lernheld_pending");
        window.history.replaceState({}, "", "/lernheld");

        if (!stored) {
          setFehler("Deine Daten wurden in deinem Browser nicht gefunden. Bitte fuelle das Formular noch einmal aus.");
          setLaden(false);
          return;
        }

        let d: Daten | null = null;
        try { d = JSON.parse(stored) as Daten; } catch { d = null; }
        if (!d || !d.bilder?.length) {
          setFehler("Deine Daten konnten nicht gelesen werden. Bitte fuelle das Formular neu aus.");
          setLaden(false);
          return;
        }

        setName(d.name); setKlasse(d.klasse); setFach(d.fach); setDatum(d.datum);
        setTheme(d.theme); setSchwierigkeiten(d.schwierigkeiten || "");

        await planErzeugen(d);
      } catch {
        setFehler("Etwas ist schiefgegangen. Bitte fuelle das Formular neu aus.");
      }
      setLaden(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function herunterladen() {
    const blob = new Blob([plan], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Lernheld-Plan.html";
    a.click();
    URL.revokeObjectURL(url);
  }

  function neu() {
    setPlan("");
    setFehler("");
  }

  async function frageSenden() {
    const text = frage.trim();
    if (!text || botLaedt) return;
    const neuerChat: ChatNachricht[] = [...chat, { role: "user", content: text }];
    setChat(neuerChat);
    setFrage("");
    setBotLaedt(true);
    try {
      const res = await fetch("/api/lernheld-support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verlauf: neuerChat }),
      });
      const data = await res.json();
      if (data && data.antwort) {
        setChat([...neuerChat, { role: "assistant", content: data.antwort }]);
      } else {
        setChat([...neuerChat, { role: "assistant", content: "Das konnte ich gerade nicht beantworten. Schreib Anna gern direkt über den WhatsApp-Button." }]);
      }
    } catch {
      setChat([...neuerChat, { role: "assistant", content: "Das konnte ich gerade nicht beantworten. Schreib Anna gern direkt über den WhatsApp-Button." }]);
    }
    setBotLaedt(false);
  }

  const whatsappLink = `https://wa.me/${WHATSAPP_NUMMER}?text=${encodeURIComponent("Hallo Anna, ich habe eine Frage zu meinem Lernplan:")}`;
  const serif = 'Georgia, "Times New Roman", serif';
  const sans = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

  const supportWidget = (
    <>
      {!supportOffen && (
        <button onClick={() => setSupportOffen(true)}
          style={{ position: "fixed", bottom: "24px", right: "24px", zIndex: 2000, background: t.dark, color: "#fff", border: "none", borderRadius: "999px", padding: "13px 24px", fontSize: "15px", fontWeight: 700, cursor: "pointer", boxShadow: "0 8px 26px rgba(0,0,0,0.22)", fontFamily: sans }}>
          💬 Hilfe
        </button>
      )}
      {supportOffen && (
        <div style={{ position: "fixed", bottom: "24px", right: "24px", left: "24px", maxWidth: "400px", marginLeft: "auto", zIndex: 2000, background: t.card, borderRadius: "20px", boxShadow: "0 16px 50px rgba(0,0,0,0.22)", display: "flex", flexDirection: "column", overflow: "hidden", maxHeight: "76vh", border: `1px solid ${t.line}`, fontFamily: sans }}>
          <div style={{ padding: "18px 22px", display: "flex", justifyContent: "space-between", alignItems: "center", background: t.dark }}>
            <div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: "17px" }}>Dein Lernhelfer</div>
              <div style={{ color: "rgba(255,255,255,0.85)", fontSize: "13px", marginTop: "2px" }}>Fragen zu Mathe & Physik</div>
            </div>
            <button onClick={() => setSupportOffen(false)} style={{ background: "rgba(255,255,255,0.18)", color: "#fff", border: "none", borderRadius: "50%", width: "30px", height: "30px", fontSize: "15px", cursor: "pointer" }}>✕</button>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "18px", background: t.bg, minHeight: "220px" }}>
            {chat.length === 0 && (
              <div style={{ color: t.soft, fontSize: "14.5px", textAlign: "center", padding: "26px 14px", lineHeight: 1.65 }}>
                Schreib deine Frage oder eine Aufgabe — du bekommst eine Erklärung Schritt für Schritt.
              </div>
            )}
            {chat.map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", marginBottom: "12px" }}>
                <div style={{ maxWidth: "85%", background: m.role === "user" ? t.dark : t.card, color: m.role === "user" ? "#fff" : t.ink, padding: "11px 15px", borderRadius: "16px", fontSize: "14.5px", lineHeight: 1.55, whiteSpace: "pre-wrap", border: m.role === "user" ? "none" : `1px solid ${t.line}` }}>
                  {m.content}
                </div>
              </div>
            ))}
            {botLaedt && <div style={{ color: t.soft, fontSize: "14px", padding: "4px" }}>schreibt…</div>}
          </div>
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer" style={{ display: "block", color: t.dark, textAlign: "center", padding: "13px", fontSize: "13.5px", fontWeight: 700, textDecoration: "none", borderTop: `1px solid ${t.line}`, background: t.card }}>
            Frage offen? Schreib Anna direkt
          </a>
          <div style={{ display: "flex", gap: "8px", padding: "14px", borderTop: `1px solid ${t.line}`, background: t.card }}>
            <input value={frage} onChange={(e) => setFrage(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") frageSenden(); }} placeholder="Deine Frage…"
              style={{ flex: 1, padding: "12px 14px", borderRadius: "12px", border: `1px solid ${t.line}`, fontSize: "15px", outline: "none", fontFamily: sans, color: t.ink, background: t.bg }} />
            <button onClick={frageSenden} disabled={botLaedt || !frage.trim()} style={{ background: frage.trim() ? t.dark : t.line, color: "#fff", border: "none", borderRadius: "12px", padding: "0 18px", fontSize: "15px", fontWeight: 700, cursor: frage.trim() ? "pointer" : "default", fontFamily: sans }}>
              Senden
            </button>
          </div>
        </div>
      )}
    </>
  );

  const seitenStil: React.CSSProperties = {
    minHeight: "100vh", background: "linear-gradient(135deg, #FFF9F0 0%, #FEF3E0 100%)", color: t.ink, fontFamily: sans, WebkitFontSmoothing: "antialiased", position: "relative", overflow: "hidden",
  };

  const dekoSchicht = (
    <>
      {/* Dot-grid pattern + glow blobs (matched mit homepage) */}
      <div style={{ position: "fixed", inset: 0, backgroundImage: "radial-gradient(circle, rgba(23,105,255,0.10) 1px, transparent 1px)", backgroundSize: "32px 32px", opacity: 0.35, pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", top: "-100px", left: "-100px", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(255,180,90,0.22) 0%, transparent 65%)", pointerEvents: "none", filter: "blur(40px)", zIndex: 0 }} />
      <div style={{ position: "fixed", top: "30%", right: "-150px", width: "550px", height: "550px", borderRadius: "50%", background: "radial-gradient(circle, rgba(23,105,255,0.16) 0%, transparent 70%)", pointerEvents: "none", filter: "blur(30px)", zIndex: 0 }} />
    </>
  );

  // ===== FERTIGER PLAN =====
  if (plan) {
    return (
      <div style={seitenStil}>
        {dekoSchicht}
        <div style={{ padding: "14px 22px", display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap", position: "sticky", top: 0, zIndex: 10, background: t.dark }}>
          <button onClick={herunterladen} style={{ background: "#fff", color: t.dark, border: "none", borderRadius: "999px", padding: "11px 22px", fontSize: "15px", fontWeight: 700, cursor: "pointer" }}>Plan herunterladen</button>
          <button onClick={() => window.print()} style={{ background: "rgba(255,255,255,0.18)", color: "#fff", border: "1px solid rgba(255,255,255,0.5)", borderRadius: "999px", padding: "11px 22px", fontSize: "15px", fontWeight: 700, cursor: "pointer" }}>Drucken / PDF</button>
          <button onClick={neu} style={{ background: "rgba(255,255,255,0.18)", color: "#fff", border: "1px solid rgba(255,255,255,0.5)", borderRadius: "999px", padding: "11px 22px", fontSize: "15px", fontWeight: 700, cursor: "pointer" }}>Neuer Plan</button>
        </div>
        <iframe title="Lernplan" srcDoc={plan} style={{ width: "100%", height: "calc(100vh - 60px)", border: "none", background: t.bg }} />
        {supportWidget}
      </div>
    );
  }

  // ===== EINGABE =====
  return (
    <div style={seitenStil}>
      {dekoSchicht}
      {/* Farbiger Kopf-Banner */}
      <div style={{ background: t.dark, padding: "34px 22px 30px", textAlign: "center", position: "relative", zIndex: 1 }}>
        <div style={{ width: "62px", height: "62px", margin: "0 auto 14px", background: t.darkSoft, borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontFamily: serif, fontSize: "34px", fontWeight: 700, color: "#fff" }}>A</span>
        </div>
        <h1 style={{ color: "#fff", fontFamily: serif, fontSize: "28px", fontWeight: 700, margin: "0 0 6px" }}>Dein Lernheld-Plan</h1>
        <p style={{ color: "rgba(255,255,255,0.88)", fontSize: "15px", margin: 0 }}>Lade deine Unterlagen hoch — den Rest übernehmen wir.</p>
      </div>

      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "26px 18px 70px", position: "relative", zIndex: 1 }}>
        {laden ? (
          <div style={{ textAlign: "center", padding: "90px 20px" }}>
            <h2 style={{ fontFamily: serif, fontSize: "26px", fontWeight: 700, margin: "0 0 14px", color: t.ink }}>{ladeText}</h2>
            <p style={{ color: t.soft, fontSize: "16px", lineHeight: 1.6, maxWidth: "440px", margin: "0 auto" }}>
              {ladeSub}
            </p>
            <div style={{ marginTop: "40px", width: "46px", height: "46px", border: `3px solid ${t.line}`, borderTopColor: t.dark, borderRadius: "50%", margin: "40px auto 0", animation: "spin 0.9s linear infinite" }} />
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        ) : (
          <div>
            {/* Design-Auswahl */}
            <div style={{ textAlign: "center", marginBottom: "10px" }}>
              <h2 style={{ fontFamily: serif, fontSize: "24px", fontWeight: 700, margin: "0 0 4px", color: t.ink }}>Wähle dein Design</h2>
              <p style={{ color: t.soft, fontSize: "14px", margin: "0 0 18px" }}>Du kannst es jederzeit ändern</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "32px" }}>
              {(Object.keys(THEMES) as ThemeKey[]).map((key) => {
                const th = THEMES[key];
                const aktiv = key === theme;
                return (
                  <button key={key} onClick={() => setTheme(key)}
                    style={{ display: "flex", alignItems: "center", gap: "14px", padding: "14px 16px", borderRadius: "16px", border: aktiv ? `2px solid ${th.dark}` : `1px solid ${t.line}`, background: aktiv ? t.card : t.card, cursor: "pointer", textAlign: "left", boxShadow: aktiv ? "0 4px 16px rgba(0,0,0,0.06)" : "none" }}>
                    <div style={{ width: "46px", height: "46px", borderRadius: "12px", background: th.dark, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ fontFamily: serif, fontSize: "24px", fontWeight: 700, color: "#fff" }}>A</span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "16px", fontWeight: 700, color: t.ink, marginBottom: "6px" }}>{th.emoji} {th.name}</div>
                      <div style={{ display: "flex", gap: "6px" }}>
                        {th.swatches.map((c, i) => (
                          <span key={i} style={{ width: "16px", height: "16px", borderRadius: "50%", background: c, border: "1px solid rgba(0,0,0,0.06)" }} />
                        ))}
                      </div>
                    </div>
                    {aktiv && <span style={{ color: t.dark, fontSize: "20px", fontWeight: 700 }}>✓</span>}
                  </button>
                );
              })}
            </div>

            {/* Formular-Karte */}
            <div style={{ background: t.card, border: `1px solid ${t.line}`, borderRadius: "20px", padding: "28px 24px", boxShadow: "0 6px 24px rgba(0,0,0,0.04)" }}>
              <label style={labelStil(t.ink)}>Fach</label>
              <div style={{ display: "flex", gap: "10px", marginBottom: "22px" }}>
                <button onClick={() => setFach("mathe")} style={segStil(fach === "mathe", t)}>Mathematik</button>
                <button onClick={() => setFach("physik")} style={segStil(fach === "physik", t)}>Physik</button>
              </div>

              <label style={labelStil(t.ink)}>Dein Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="z. B. Lena" style={inputStil(t)} />

              <label style={labelStil(t.ink)}>Klasse</label>
              <select value={klasse} onChange={(e) => setKlasse(e.target.value)} style={inputStil(t)}>
                <option value="">Bitte wählen</option>
                {KLASSEN.map((k) => <option key={k} value={k}>Klasse {k}</option>)}
              </select>

              <label style={labelStil(t.ink)}>Datum der Schulaufgabe</label>
              <input type="date" value={datum} onChange={(e) => setDatum(e.target.value)} style={inputStil(t)} />

              <label style={labelStil(t.ink)}>Deine Unterlagen</label>
              <p style={{ color: t.soft, fontSize: "14px", margin: "-6px 0 12px", lineHeight: 1.5 }}>Fotografiere deine Stoffliste, Buchseiten oder Übungen.</p>
              <label htmlFor="foto-input"
                style={{ display: "block", border: `1.5px dashed ${t.dark}`, borderRadius: "16px", background: t.bg, padding: "34px 20px", textAlign: "center", cursor: "pointer", marginBottom: fotos.length ? "18px" : "24px" }}>
                <div style={{ fontWeight: 700, color: t.dark, fontSize: "17px" }}>Unterlagen hinzufügen</div>
                <div style={{ color: t.soft, fontSize: "13px", marginTop: "5px" }}>Bis zu 10 Bilder</div>
                <input id="foto-input" type="file" accept="image/*" multiple onChange={(e) => fotosHinzufuegen(e.target.files)} style={{ display: "none" }} />
              </label>

              {fotos.length > 0 && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(82px, 1fr))", gap: "10px", marginBottom: "24px" }}>
                  {fotos.map((f, i) => (
                    <div key={i} style={{ position: "relative", borderRadius: "12px", overflow: "hidden", border: `1px solid ${t.line}`, aspectRatio: "1" }}>
                      <img src={f.preview} alt={f.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      <button onClick={() => fotoEntfernen(i)} style={{ position: "absolute", top: "5px", right: "5px", background: "rgba(0,0,0,0.55)", color: "#fff", border: "none", borderRadius: "50%", width: "22px", height: "22px", fontSize: "12px", cursor: "pointer", lineHeight: 1 }}>✕</button>
                    </div>
                  ))}
                </div>
              )}

              <label style={labelStil(t.ink)}>Womit hast du besonders Schwierigkeiten? <span style={{ color: t.soft, fontWeight: 400 }}>(optional)</span></label>
              <p style={{ color: t.soft, fontSize: "14px", margin: "-6px 0 12px", lineHeight: 1.5 }}>Schreib hier auf, welche Themen dir besonders schwer fallen oder welche dir besonders wichtig sind — dann bekommst du dafür einen extra Fokus-Block in deinem Plan.</p>
              <textarea value={schwierigkeiten} onChange={(e) => setSchwierigkeiten(e.target.value.slice(0, 500))} placeholder="z. B. Bei Bruchrechnen blicke ich nicht durch, und Textaufgaben sind schwer für mich."
                rows={3}
                style={{ width: "100%", padding: "14px 16px", borderRadius: "12px", border: `1px solid ${t.line}`, fontSize: "15px", fontFamily: "inherit", color: t.ink, background: t.bg, marginBottom: "22px", outline: "none", resize: "vertical" }} />


              {fehler && (
                <div style={{ background: "#fdecea", border: "1px solid #f0bdb6", borderRadius: "12px", padding: "14px", marginBottom: "16px", color: "#b3392c", textAlign: "center", fontSize: "14px" }}>
                  {fehler}
                </div>
              )}

              <button
                onClick={() => {
                  if (testModus) {
                    const daten: Daten = {
                      name, klasse, fach, datum, theme, schwierigkeiten,
                      bilder: fotos.map((f) => ({ media_type: f.media_type, data: f.data })),
                    };
                    setLaden(true); setFehler("");
                    planErzeugen(daten).finally(() => setLaden(false));
                  } else {
                    zahlungStarten();
                  }
                }}
                disabled={!bereit}
                style={{ width: "100%", background: bereit ? t.dark : t.line, color: "#fff", border: "none", padding: "16px", borderRadius: "14px", fontSize: "17px", cursor: bereit ? "pointer" : "default", fontWeight: 700, fontFamily: sans }}>
                {testModus ? "Plan erstellen (Test ohne Bezahlung) →" : "Plan erstellen für 1,99 € →"}
              </button>
              <p style={{ textAlign: "center", color: t.soft, fontSize: "13px", marginTop: "10px", lineHeight: 1.5 }}>
                {testModus ? "Test-Modus aktiv. Auf der Live-Seite wird normal bezahlt." : "Einmalige Zahlung. Sichere Bezahlung über Stripe."}
              </p>
            </div>
          </div>
        )}
      </div>
      {supportWidget}
    </div>
  );
}

function labelStil(ink: string): React.CSSProperties {
  return { display: "block", fontSize: "15px", fontWeight: 700, color: ink, margin: "0 0 10px" };
}

function inputStil(t: { line: string; ink: string; bg: string }): React.CSSProperties {
  return {
    width: "100%", padding: "14px 16px", borderRadius: "12px", border: `1px solid ${t.line}`,
    fontSize: "16px", fontFamily: "inherit", color: t.ink, background: t.bg, marginBottom: "22px", outline: "none",
  };
}

function segStil(aktiv: boolean, t: { dark: string; line: string; ink: string; bg: string }): React.CSSProperties {
  return {
    flex: 1, padding: "13px", borderRadius: "12px", border: aktiv ? `2px solid ${t.dark}` : `1px solid ${t.line}`,
    cursor: "pointer", fontSize: "16px", fontWeight: 700, background: aktiv ? t.dark : t.bg, color: aktiv ? "#fff" : t.ink,
  };
}