"use client";
import React, { useState } from "react";
import { MathText } from "./mathtext";
import {
  type Aufgabe,
  istRichtigInput,
  anzahlLuecken,
} from "@/lib/quiz/interaktiv/typen";

const F = {
  white: "#ffffff",
  ink: "#0F172A",
  inkSoft: "#475569",
  inkMuted: "#94A3B8",
  border: "#E2E8F0",
  coral: "#1769FF",
  coralDeep: "#1156DD",
  green: "#0EA36B",
  greenLight: "#E7F7EF",
  red: "#EF4444",
  redLight: "#FEE4E4",
  soft: "#F5F8FF",
  softBorder: "#CDD9F5",
};
const SANS = '"Inter", -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
const EMOJIS_SUPER = ["🎉", "🏆", "🌟"];
const EMOJIS_GUT = ["👍", "😊", "💪"];
const EMOJIS_WEITER = ["📚", "🌱", "🔁"];

function mischenStabil(arr: string[]): string[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  if (a.join("|") === arr.join("|")) a.reverse();
  return a;
}

export default function InteraktivQuiz({
  aufgaben,
  titel,
  onNeu,
}: {
  aufgaben: Aufgabe[];
  titel: string;
  onNeu: () => void;
}) {
  const [idx, setIdx] = useState(0);
  const [punkte, setPunkte] = useState(0);
  const [fertig, setFertig] = useState(false);
  const [emoji, setEmoji] = useState("");

  function weiter(richtig: boolean) {
    const neuePunkte = punkte + (richtig ? 1 : 0);
    if (idx + 1 >= aufgaben.length) {
      const prozent = Math.round((neuePunkte / aufgaben.length) * 100);
      const liste = prozent >= 80 ? EMOJIS_SUPER : prozent >= 50 ? EMOJIS_GUT : EMOJIS_WEITER;
      setEmoji(liste[Math.floor(Math.random() * liste.length)]);
      setPunkte(neuePunkte);
      setFertig(true);
    } else {
      setPunkte(neuePunkte);
      setIdx((i) => i + 1);
    }
  }

  if (fertig) {
    const prozent = Math.round((punkte / aufgaben.length) * 100);
    return (
      <div className="fade-up" style={{ textAlign: "center", paddingTop: "20px" }}>
        <span style={{ display: "inline-block", background: F.white, color: F.coral, padding: "7px 14px", borderRadius: "999px", fontSize: "12px", fontWeight: 700, marginBottom: "16px", boxShadow: "0 4px 14px rgba(23,105,255,0.18)" }}>
          Übung beendet {emoji}
        </span>
        <h2 style={{ fontSize: "42px", margin: "0 0 10px", letterSpacing: "-0.03em", lineHeight: 1.0, fontWeight: 800, color: F.ink }}>
          {prozent >= 80 ? "Stark!" : prozent >= 50 ? "Gut gemacht." : "Bleib dran."}
        </h2>
        <p style={{ fontSize: "16px", color: F.inkSoft, margin: "0 0 28px" }}>
          {prozent >= 80 ? "Du beherrschst das Thema richtig gut." : prozent >= 50 ? "Fast geschafft — noch ein bisschen Übung." : "Übung macht die Eins. Probier es gleich nochmal."}
        </p>
        <div style={{ background: F.white, borderRadius: "24px", padding: "36px 28px 32px", marginBottom: "20px", boxShadow: "0 1px 2px rgba(15,23,42,0.04), 0 12px 32px rgba(15,23,42,0.06)", border: `1px solid ${F.border}` }}>
          <p style={{ fontSize: "72px", fontWeight: 900, color: F.ink, margin: 0, lineHeight: 1.0, letterSpacing: "-0.04em" }}>{punkte}<span style={{ color: F.inkMuted, fontSize: "44px", fontWeight: 800 }}>/{aufgaben.length}</span></p>
          <p style={{ fontSize: "16px", color: F.inkSoft, margin: "10px 0 0", fontWeight: 600 }}>{prozent}% richtig</p>
        </div>
        <button onClick={onNeu} className="btn-primary">Neue Übung <span style={{ fontSize: "18px" }}>→</span></button>
      </div>
    );
  }

  const a = aufgaben[idx];
  return (
    <div className="fade-up">
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", alignItems: "center" }}>
        <span style={{ color: F.inkSoft, fontWeight: 700, fontSize: "13.5px" }}>{titel} · Aufgabe {idx + 1} von {aufgaben.length}</span>
        <span style={{ background: F.ink, color: F.white, padding: "5px 13px", borderRadius: "999px", fontWeight: 700, fontSize: "13px" }}>{punkte} richtig</span>
      </div>
      <div style={{ background: F.border, borderRadius: "999px", height: "6px", marginBottom: "22px", overflow: "hidden" }}>
        <div style={{ background: F.coral, height: "6px", borderRadius: "999px", width: `${((idx + 1) / aufgaben.length) * 100}%`, transition: "width 0.4s ease" }} />
      </div>
      <AufgabeView key={idx} aufgabe={a} onFertig={weiter} />
    </div>
  );
}

function typLabel(t: Aufgabe["typ"]): string {
  switch (t) {
    case "mc": return "Wähle die richtige Antwort";
    case "input": return "Tippe dein Ergebnis ein";
    case "luecke": return "Fülle die Lücken";
    case "zuordnen": return "Ordne einander zu";
    case "sortieren": return "Bring in die richtige Reihenfolge";
  }
}

function AufgabeView({ aufgabe, onFertig }: { aufgabe: Aufgabe; onFertig: (richtig: boolean) => void }) {
  const [gezeigt, setGezeigt] = useState(false);
  const [richtig, setRichtig] = useState(false);

  // Zustände für alle Typen (nur der passende wird genutzt).
  const [mcWahl, setMcWahl] = useState<number | null>(null);
  const [inputWert, setInputWert] = useState("");
  const [lueckeWerte, setLueckeWerte] = useState<string[]>(() =>
    aufgabe.typ === "luecke" ? Array(anzahlLuecken(aufgabe)).fill("") : [],
  );
  const [zuordnung, setZuordnung] = useState<Record<number, string>>({});
  const [rechtsOptionen] = useState<string[]>(() =>
    aufgabe.typ === "zuordnen" ? mischenStabil(aufgabe.paare.map((p) => p.rechts)) : [],
  );
  const [sortier, setSortier] = useState<string[]>(() =>
    aufgabe.typ === "sortieren" ? mischenStabil(aufgabe.richtig) : [],
  );

  function pruefe(): boolean {
    switch (aufgabe.typ) {
      case "mc": return mcWahl === aufgabe.richtig;
      case "input": return istRichtigInput(inputWert, aufgabe.loesung);
      case "luecke": {
        let bi = 0;
        for (const seg of aufgabe.segmente) {
          if (typeof seg !== "string") {
            if (!istRichtigInput(lueckeWerte[bi] ?? "", seg.luecke)) return false;
            bi++;
          }
        }
        return true;
      }
      case "zuordnen": return aufgabe.paare.every((p, i) => zuordnung[i] === p.rechts);
      case "sortieren": return sortier.join("|") === aufgabe.richtig.join("|");
    }
  }

  function bereit(): boolean {
    switch (aufgabe.typ) {
      case "mc": return mcWahl !== null;
      case "input": return inputWert.trim() !== "";
      case "luecke": return lueckeWerte.every((v) => v.trim() !== "") && lueckeWerte.length === anzahlLuecken(aufgabe);
      case "zuordnen": return aufgabe.paare.every((_, i) => zuordnung[i] != null);
      case "sortieren": return true;
    }
  }

  function absenden() {
    if (gezeigt) { onFertig(richtig); return; }
    if (!bereit()) return;
    setRichtig(pruefe());
    setGezeigt(true);
  }

  function verschiebe(i: number, richtung: -1 | 1) {
    if (gezeigt) return;
    const j = i + richtung;
    if (j < 0 || j >= sortier.length) return;
    const neu = [...sortier];
    [neu[i], neu[j]] = [neu[j], neu[i]];
    setSortier(neu);
  }

  const kartenStil: React.CSSProperties = { background: F.white, borderRadius: "20px", padding: "26px 26px 22px", marginBottom: "18px", boxShadow: "0 1px 2px rgba(15,23,42,0.04), 0 8px 24px rgba(15,23,42,0.06)", border: `1px solid ${F.border}` };

  return (
    <div>
      <div style={kartenStil}>
        <p style={{ fontSize: "11.5px", color: F.inkMuted, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 10px" }}>{typLabel(aufgabe.typ)}</p>
        <h2 style={{ fontSize: "21px", color: F.ink, margin: 0, lineHeight: 1.45, fontWeight: 700, letterSpacing: "-0.01em" }}><MathText text={aufgabe.frage} /></h2>

        {/* ---- Multiple Choice ---- */}
        {aufgabe.typ === "mc" && (
          <div style={{ display: "grid", gap: "10px", marginTop: "18px" }}>
            {aufgabe.antworten.map((ant, i) => {
              let bg = F.white, bd = F.border, tc = F.ink, badgeBg = F.soft, badgeC = F.inkSoft;
              if (gezeigt) {
                if (i === aufgabe.richtig) { bg = F.greenLight; bd = F.green; badgeBg = F.green; badgeC = "#fff"; }
                else if (i === mcWahl) { bg = F.redLight; bd = F.red; badgeBg = F.red; badgeC = "#fff"; }
                else tc = F.inkMuted;
              } else if (i === mcWahl) { bg = "#E8F0FF"; bd = F.coral; }
              return (
                <button key={i} disabled={gezeigt} onClick={() => setMcWahl(i)}
                  style={{ display: "flex", alignItems: "center", gap: "12px", background: bg, border: `1.5px solid ${bd}`, borderRadius: "13px", padding: "14px 16px", cursor: gezeigt ? "default" : "pointer", fontSize: "16px", fontWeight: 600, color: tc, textAlign: "left", fontFamily: SANS, width: "100%" }}>
                  <span style={{ background: badgeBg, color: badgeC, borderRadius: "8px", fontWeight: 800, fontSize: "13px", minWidth: "28px", textAlign: "center", padding: "4px 0", flexShrink: 0 }}>{["A", "B", "C", "D"][i]}</span>
                  <span style={{ flex: 1 }}><MathText text={ant} /></span>
                </button>
              );
            })}
          </div>
        )}

        {/* ---- Eingabe ---- */}
        {aufgabe.typ === "input" && (
          <div style={{ marginTop: "18px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <input value={inputWert} disabled={gezeigt} autoComplete="off"
                onChange={(e) => setInputWert(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") absenden(); }}
                placeholder={aufgabe.platzhalter ?? "Deine Antwort"}
                style={{ flex: 1, maxWidth: "260px", fontSize: "20px", fontWeight: 700, padding: "13px 16px", borderRadius: "13px", border: `2px solid ${gezeigt ? (richtig ? F.green : F.red) : F.softBorder}`, background: gezeigt ? (richtig ? F.greenLight : F.redLight) : F.soft, color: F.ink, fontFamily: SANS, outline: "none" }} />
              {aufgabe.einheit && <span style={{ fontSize: "18px", fontWeight: 700, color: F.inkSoft }}>{aufgabe.einheit}</span>}
            </div>
            {aufgabe.hinweis && !gezeigt && <p style={{ fontSize: "13px", color: F.inkMuted, margin: "10px 2px 0" }}>💡 {aufgabe.hinweis}</p>}
          </div>
        )}

        {/* ---- Lückentext ---- */}
        {aufgabe.typ === "luecke" && (() => {
          let bi = -1;
          return (
            <p style={{ marginTop: "18px", fontSize: "19px", fontWeight: 600, color: F.ink, lineHeight: 2.1 }}>
              {aufgabe.segmente.map((seg, si) => {
                if (typeof seg === "string") return <span key={si}><MathText text={seg} /></span>;
                bi++;
                const b = bi;
                const ok = gezeigt && istRichtigInput(lueckeWerte[b] ?? "", seg.luecke);
                return (
                  <input key={si} value={lueckeWerte[b] ?? ""} disabled={gezeigt} autoComplete="off"
                    onChange={(e) => { const n = [...lueckeWerte]; n[b] = e.target.value; setLueckeWerte(n); }}
                    style={{ width: `${seg.breite ?? 3}ch`, minWidth: "48px", textAlign: "center", fontSize: "19px", fontWeight: 800, padding: "6px 8px", margin: "0 4px", borderRadius: "9px", border: `2px solid ${gezeigt ? (ok ? F.green : F.red) : F.coral}`, background: gezeigt ? (ok ? F.greenLight : F.redLight) : F.soft, color: F.ink, fontFamily: SANS, outline: "none" }} />
                );
              })}
            </p>
          );
        })()}

        {/* ---- Zuordnen ---- */}
        {aufgabe.typ === "zuordnen" && (
          <div style={{ display: "grid", gap: "10px", marginTop: "18px" }}>
            {aufgabe.paare.map((p, i) => {
              const ok = gezeigt && zuordnung[i] === p.rechts;
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", padding: "10px 12px", borderRadius: "13px", border: `1.5px solid ${gezeigt ? (ok ? F.green : F.red) : F.border}`, background: gezeigt ? (ok ? F.greenLight : F.redLight) : F.white }}>
                  <span style={{ fontSize: "18px", fontWeight: 800, minWidth: "54px", color: F.ink }}><MathText text={p.links} /></span>
                  <span style={{ color: F.inkMuted, fontSize: "18px" }}>→</span>
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", flex: 1 }}>
                    {rechtsOptionen.map((opt) => {
                      const aktiv = zuordnung[i] === opt;
                      return (
                        <button key={opt} disabled={gezeigt} onClick={() => setZuordnung((z) => ({ ...z, [i]: opt }))}
                          style={{ padding: "7px 12px", borderRadius: "10px", border: `1.5px solid ${aktiv ? F.coral : F.softBorder}`, background: aktiv ? "#E8F0FF" : F.soft, color: F.ink, fontSize: "15px", fontWeight: 700, cursor: gezeigt ? "default" : "pointer", fontFamily: SANS }}>
                          <MathText text={opt} />
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ---- Sortieren ---- */}
        {aufgabe.typ === "sortieren" && (
          <div style={{ marginTop: "18px" }}>
            {aufgabe.hinweis && !gezeigt && <p style={{ fontSize: "13px", color: F.inkMuted, margin: "0 2px 12px" }}>💡 {aufgabe.hinweis}</p>}
            <div style={{ display: "grid", gap: "8px" }}>
              {sortier.map((it, i) => (
                <div key={it} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 14px", borderRadius: "13px", border: `1.5px solid ${gezeigt ? (sortier[i] === aufgabe.richtig[i] ? F.green : F.red) : F.softBorder}`, background: gezeigt ? (sortier[i] === aufgabe.richtig[i] ? F.greenLight : F.redLight) : F.soft }}>
                  <span style={{ color: F.inkMuted, fontWeight: 800, fontSize: "13px", minWidth: "20px" }}>{i + 1}.</span>
                  <span style={{ flex: 1, fontSize: "19px", fontWeight: 800, color: F.ink }}><MathText text={it} /></span>
                  {!gezeigt && (
                    <span style={{ display: "flex", gap: "4px" }}>
                      <button onClick={() => verschiebe(i, -1)} disabled={i === 0} style={{ width: "34px", height: "34px", borderRadius: "9px", border: `1.5px solid ${F.softBorder}`, background: F.white, color: i === 0 ? F.inkMuted : F.ink, fontSize: "16px", fontWeight: 800, cursor: i === 0 ? "default" : "pointer" }}>▲</button>
                      <button onClick={() => verschiebe(i, 1)} disabled={i === sortier.length - 1} style={{ width: "34px", height: "34px", borderRadius: "9px", border: `1.5px solid ${F.softBorder}`, background: F.white, color: i === sortier.length - 1 ? F.inkMuted : F.ink, fontSize: "16px", fontWeight: 800, cursor: i === sortier.length - 1 ? "default" : "pointer" }}>▼</button>
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Feedback */}
      {gezeigt && (
        <div className="fade-up" style={{ background: richtig ? F.greenLight : F.redLight, border: `1.5px solid ${richtig ? F.green : F.red}`, borderRadius: "14px", padding: "16px 18px", marginBottom: "16px", fontSize: "14.5px", color: F.ink, lineHeight: 1.55 }}>
          <p style={{ margin: "0 0 6px", fontWeight: 800, fontSize: "14px", color: richtig ? F.green : F.red }}>{richtig ? "Richtig!" : "Noch nicht ganz."}</p>
          {!richtig && (
            <p style={{ margin: "0 0 8px", fontWeight: 700 }}>Richtige Lösung: <LoesungAnzeige aufgabe={aufgabe} /></p>
          )}
          <span><MathText text={aufgabe.erklaerung} /></span>
        </div>
      )}

      <button onClick={absenden} disabled={!gezeigt && !bereit()} className="btn-primary">
        {gezeigt ? "Weiter" : "Prüfen"} <span style={{ fontSize: "18px" }}>→</span>
      </button>
    </div>
  );
}

function LoesungAnzeige({ aufgabe }: { aufgabe: Aufgabe }) {
  switch (aufgabe.typ) {
    case "mc": return <MathText text={aufgabe.antworten[aufgabe.richtig]} />;
    case "input": return <MathText text={aufgabe.loesung[0]} />;
    case "luecke": {
      const teile = aufgabe.segmente.filter((s): s is { luecke: string[]; breite?: number } => typeof s !== "string").map((s) => s.luecke[0]);
      return <>{teile.map((t, i) => <span key={i}>{i > 0 ? " · " : ""}<MathText text={t} /></span>)}</>;
    }
    case "zuordnen":
      return <>{aufgabe.paare.map((p, i) => <span key={i}>{i > 0 ? "  •  " : ""}<MathText text={p.links} /> → <MathText text={p.rechts} /></span>)}</>;
    case "sortieren":
      return <>{aufgabe.richtig.map((t, i) => <span key={i}>{i > 0 ? " < " : ""}<MathText text={t} /></span>)}</>;
  }
}
