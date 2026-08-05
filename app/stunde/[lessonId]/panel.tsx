"use client";
// =============================================================================
// Klassenzimmer-Panel: Live-Übungen, Tafel (Whiteboard), Stundenzettel
// und Belohnungen – der Seitenbereich neben dem Video.
// Holt sich den Zustand alle 2,5 Sekunden vom Server (Polling).
// =============================================================================
import { useCallback, useEffect, useRef, useState } from "react";

// Markenfarben ("Lerne mit Anna": hell mit Türkis-Blau-Verlauf)
const TEAL = "#2BB3C0";
const BLAU = "#3E7BB6";
const VERLAUF = `linear-gradient(135deg,${TEAL},${BLAU})`;

type ApiFn = (action: string, params?: Record<string, unknown>) => Promise<Record<string, unknown>>;

type Exercise = {
  id: string; question: string; kind: "freitext" | "auswahl";
  options: string[] | null; status: "aktiv" | "beendet";
  correct: string | null; explanation: string | null;
};
type ResultRow = { name: string; answer: string; is_correct: boolean | null; mine?: boolean };
type StudentRow = { id: string; name: string; points: number };

type PanelState = {
  isTeacher: boolean;
  exercise: Exercise | null;
  myAnswer: { answer: string; is_correct: boolean | null } | null;
  answeredCount?: number;
  results?: ResultRow[];
  students?: StudentRow[];
  rewards?: { points: number; stickers: string[] };
  notes: { summary: string; homework: string };
};

const CSS = `
.kzp{display:flex;flex-direction:column;height:100%;min-height:0;background:#F4F6F7;color:#1A1A1A;font-size:.92rem}
.kzp *{box-sizing:border-box}
.kzp .tabs{display:flex;border-bottom:1px solid rgba(26,26,26,.12);background:#fff;flex:0 0 auto}
.kzp .tabs button{flex:1;background:none;border:0;color:#5F574F;font:inherit;font-weight:600;padding:11px 4px;cursor:pointer;border-bottom:3px solid transparent}
.kzp .tabs button.on{color:#1A1A1A;border-bottom-color:${TEAL}}
.kzp .body{flex:1 1 auto;overflow-y:auto;padding:14px;min-height:0}
.kzp h4{margin:0 0 8px;font-size:.98rem}
.kzp .muted{color:#5F574F}
.kzp .card{background:#fff;border:1px solid rgba(26,26,26,.12);border-radius:14px;padding:13px;margin-bottom:12px}
.kzp textarea,.kzp input[type=text],.kzp select{width:100%;background:#fff;border:1px solid rgba(26,26,26,.18);border-radius:10px;color:#1A1A1A;font:inherit;padding:9px 10px;margin-bottom:8px}
.kzp textarea{resize:vertical;min-height:64px}
.kzp .btn{background:${VERLAUF};color:#fff;border:0;border-radius:10px;padding:9px 14px;font:inherit;font-weight:600;cursor:pointer}
.kzp .btn.g{background:#ECEFF0;color:#1A1A1A}
.kzp .btn.sm{padding:6px 10px;font-size:.85rem}
.kzp .btn[disabled]{opacity:.55;cursor:default}
.kzp .row{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:8px}
.kzp .opt{display:block;width:100%;text-align:left;background:#fff;border:1px solid rgba(26,26,26,.15);border-radius:10px;color:#1A1A1A;font:inherit;padding:10px 12px;margin-bottom:7px;cursor:pointer}
.kzp .opt.sel{border-color:${TEAL};background:rgba(43,179,192,.10);font-weight:600}
.kzp .ok{color:#127A5C;font-weight:700}
.kzp .bad{color:#B4491F;font-weight:700}
.kzp .restable{width:100%;border-collapse:collapse;font-size:.87rem}
.kzp .restable td{padding:5px 6px;border-bottom:1px solid rgba(26,26,26,.10);vertical-align:top}
.kzp .points{font-size:1.5rem;font-weight:800;background:${VERLAUF};-webkit-background-clip:text;background-clip:text;color:transparent;text-align:center}
.kzp .stickers{font-size:1.25rem;letter-spacing:3px;line-height:1.7;word-break:break-all;text-align:center}
.kzp .toast{position:sticky;bottom:0;background:#DCF3EC;color:#127A5C;border:1px solid rgba(18,122,92,.3);border-radius:10px;padding:8px 12px;font-weight:700;text-align:center}
`;

export default function KlassenzimmerPanel({ api, istLehrerin }: {
  api: ApiFn; istLehrerin: boolean;
}) {
  const [tab, setTab] = useState<"uebungen" | "zettel">("uebungen");
  const [zustand, setZustand] = useState<PanelState | null>(null);
  const [hinweis, setHinweis] = useState<string | null>(null);

  // ---- Werkzeuge: kurzer Hinweis unten im Panel ----------------------------
  const zeige = useCallback((msg: string) => {
    setHinweis(msg);
    window.setTimeout(() => setHinweis(null), 2600);
  }, []);

  // ---- Polling: alle 2,5 s den Zustand holen -------------------------------
  const lade = useCallback(async () => {
    const d = await api("state");
    if (!d.ok) return;
    setZustand(d as unknown as PanelState);
  }, [api]);

  useEffect(() => {
    // lade ist async – setState passiert erst nach dem await (kein synchroner Kaskaden-Render)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void lade();
    const t = window.setInterval(() => { void lade(); }, 2500);
    return () => window.clearInterval(t);
  }, [lade]);

  // ---- Übungen: Formular (Kleana) ------------------------------------------
  const [frage, setFrage] = useState("");
  const [art, setArt] = useState<"freitext" | "auswahl">("freitext");
  const [optionen, setOptionen] = useState<string[]>(["", "", "", ""]);
  const [richtigIdx, setRichtigIdx] = useState<number>(-1);
  const [loesung, setLoesung] = useState("");
  const [erklaerung, setErklaerung] = useState("");
  const [quizFach, setQuizFach] = useState("mathe");
  const [quizKlasse, setQuizKlasse] = useState("");
  const [quizThema, setQuizThema] = useState("");
  const [themen, setThemen] = useState<string[]>([]);
  const [beschaeftigt, setBeschaeftigt] = useState(false);

  const themenLaden = useCallback(async (fach: string, klasse: string) => {
    const d = await api("quizThemes", { fach, klasse: Number(klasse) || 0 });
    setThemen(d.ok && Array.isArray(d.themes) ? (d.themes as string[]) : []);
  }, [api]);
  useEffect(() => {
    // themenLaden ist async – setState passiert erst nach dem await
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (istLehrerin) void themenLaden(quizFach, quizKlasse);
  }, [istLehrerin, quizFach, quizKlasse, themenLaden]);

  async function frageZiehen() {
    setBeschaeftigt(true);
    const d = await api("exerciseFromQuiz", { fach: quizFach, klasse: Number(quizKlasse) || 0, thema: quizThema });
    setBeschaeftigt(false);
    if (!d.ok) { zeige(String(d.error || "Keine Frage gefunden.")); return; }
    const t = d.draft as { question: string; options: string[]; correct: string; explanation: string };
    setFrage(t.question); setArt("auswahl");
    setOptionen([...t.options, "", "", "", ""].slice(0, Math.max(4, t.options.length)));
    setRichtigIdx(t.options.indexOf(t.correct));
    setErklaerung(t.explanation || "");
  }

  async function uebungStarten() {
    setBeschaeftigt(true);
    const opts = optionen.map((o) => o.trim()).filter(Boolean);
    const d = await api("exerciseStart", {
      question: frage, kind: art,
      options: art === "auswahl" ? opts : undefined,
      correct: art === "auswahl" ? (richtigIdx >= 0 ? optionen[richtigIdx]?.trim() : "") : loesung,
      explanation: erklaerung,
    });
    setBeschaeftigt(false);
    if (d.ok) { zeige("Übung gestartet! 🚀"); setFrage(""); setLoesung(""); setErklaerung(""); setRichtigIdx(-1); setOptionen(["", "", "", ""]); void lade(); }
    else zeige(String(d.error || "Fehler."));
  }

  async function uebungBeenden() {
    setBeschaeftigt(true);
    const d = await api("exerciseEnd");
    setBeschaeftigt(false);
    if (d.ok) { zeige("Übung beendet – Punkte verteilt!"); void lade(); }
    else zeige(String(d.error || "Fehler."));
  }

  // ---- Übungen: Antworten (Schüler) ----------------------------------------
  const [antwort, setAntwort] = useState("");
  async function antwortSenden(text: string) {
    setBeschaeftigt(true);
    const d = await api("answer", { answer: text });
    setBeschaeftigt(false);
    if (d.ok) { zeige("Antwort gespeichert ✓"); void lade(); }
    else zeige(String(d.error || "Fehler."));
  }

  // ---- Stundenzettel -------------------------------------------------------
  const [zSummary, setZSummary] = useState("");
  const [zHomework, setZHomework] = useState("");
  const zettelAngefasst = useRef(false);
  useEffect(() => {
    // Server-Stand übernehmen, solange Kleana nicht gerade selbst tippt
    if (zustand && !zettelAngefasst.current) {
      setZSummary(zustand.notes?.summary || "");
      setZHomework(zustand.notes?.homework || "");
    }
  }, [zustand]);
  async function zettelSpeichern() {
    setBeschaeftigt(true);
    const d = await api("notesSave", { summary: zSummary, homework: zHomework });
    setBeschaeftigt(false);
    zettelAngefasst.current = false;
    zeige(d.ok ? "Stundenzettel gespeichert ✓" : String(d.error || "Fehler."));
  }

  // ---- Belohnung -----------------------------------------------------------
  async function belohnen(studentId: string, sticker: string, points: number) {
    const d = await api("award", { studentId, sticker, points });
    zeige(d.ok ? `${sticker} vergeben!` : String(d.error || "Fehler."));
    void lade();
  }

  const uebung = zustand?.exercise || null;
  const meine = zustand?.myAnswer || null;

  return (
    <div className="kzp">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="tabs">
        <button className={tab === "uebungen" ? "on" : ""} onClick={() => setTab("uebungen")}>🧮 Übungen</button>
        <button className={tab === "zettel" ? "on" : ""} onClick={() => setTab("zettel")}>📝 Zettel</button>
      </div>

      <div className="body">
        {/* ============================ ÜBUNGEN ============================ */}
        {tab === "uebungen" && (
          <>
            {/* Punkte-Anzeige für Schüler */}
            {!istLehrerin && zustand?.rewards && (
              <div className="card" style={{ textAlign: "center" }}>
                <div className="points">🐙 {zustand.rewards.points} Punkte</div>
                {zustand.rewards.stickers.length > 0 && (
                  <div className="stickers">{zustand.rewards.stickers.join(" ")}</div>
                )}
              </div>
            )}

            {/* Aktive/letzte Übung */}
            {uebung ? (
              <div className="card">
                <h4>{uebung.status === "aktiv" ? "🔔 Aufgabe" : "Letzte Aufgabe"}</h4>
                <p style={{ whiteSpace: "pre-wrap", margin: "0 0 10px" }}>{uebung.question}</p>

                {/* Schüler: antworten */}
                {!istLehrerin && uebung.status === "aktiv" && (
                  uebung.kind === "auswahl" && uebung.options ? (
                    <div>
                      {uebung.options.map((o, i) => (
                        <button key={i} disabled={beschaeftigt}
                          className={"opt" + (meine?.answer === o ? " sel" : "")}
                          onClick={() => void antwortSenden(o)}>{o}</button>
                      ))}
                      {meine && <p className="muted" style={{ margin: "4px 0 0" }}>Deine Antwort ist gespeichert – du kannst sie noch ändern.</p>}
                    </div>
                  ) : (
                    <div>
                      <input type="text" placeholder="Deine Antwort …" value={antwort}
                        onChange={(e) => setAntwort(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter" && antwort.trim()) void antwortSenden(antwort); }} />
                      <button className="btn" disabled={beschaeftigt || !antwort.trim()} onClick={() => void antwortSenden(antwort)}>
                        {meine ? "Antwort ändern" : "Antwort absenden"}
                      </button>
                      {meine && <p className="muted" style={{ margin: "6px 0 0" }}>Gespeichert: „{meine.answer}“</p>}
                    </div>
                  )
                )}

                {/* Schüler: Auflösung nach dem Beenden */}
                {!istLehrerin && uebung.status === "beendet" && (
                  <div>
                    {meine ? (
                      meine.is_correct === true
                        ? <p className="ok">Richtig! 🎉 +10 Punkte</p>
                        : meine.is_correct === false
                          ? <p className="bad">Leider nicht richtig – beim nächsten Mal! 💪</p>
                          : <p className="muted">Kleana schaut sich deine Antwort an.</p>
                    ) : <p className="muted">Du hattest nicht geantwortet.</p>}
                    {uebung.correct && <p>Lösung: <b>{uebung.correct}</b></p>}
                    {uebung.explanation && <p className="muted" style={{ whiteSpace: "pre-wrap" }}>{uebung.explanation}</p>}
                  </div>
                )}

                {/* Anzahl Antworten während die Übung läuft */}
                {uebung.status === "aktiv" && (
                  <p className="muted" style={{ margin: "8px 0 0" }}>
                    {zustand?.answeredCount ?? 0} Antwort(en) bisher
                  </p>
                )}

                {/* Kleana: Live-Ergebnisse + Beenden */}
                {istLehrerin && (
                  <div style={{ marginTop: 10 }}>
                    {zustand?.results && zustand.results.length > 0 && (
                      <table className="restable"><tbody>
                        {zustand.results.map((r, i) => (
                          <tr key={i}>
                            <td><b>{r.name}</b></td>
                            <td>{r.answer}</td>
                            <td>{r.is_correct === true ? <span className="ok">✓</span> : r.is_correct === false ? <span className="bad">✗</span> : <span className="muted">?</span>}</td>
                          </tr>
                        ))}
                      </tbody></table>
                    )}
                    {uebung.status === "aktiv" && (
                      <button className="btn" style={{ marginTop: 10 }} disabled={beschaeftigt} onClick={() => void uebungBeenden()}>
                        Übung beenden &amp; Punkte verteilen
                      </button>
                    )}
                  </div>
                )}
              </div>
            ) : (
              !istLehrerin && <p className="muted">Noch keine Übung – Kleana startet gleich eine. 😊</p>
            )}

            {/* Kleana: neue Übung erstellen */}
            {istLehrerin && (
              <div className="card">
                <h4>Neue Übung</h4>
                <div className="row">
                  <select value={quizFach} onChange={(e) => setQuizFach(e.target.value)} style={{ flex: 1, marginBottom: 0 }}>
                    <option value="mathe">Mathe</option><option value="physik">Physik</option>
                  </select>
                  <select value={quizKlasse} onChange={(e) => setQuizKlasse(e.target.value)} style={{ flex: 1, marginBottom: 0 }}>
                    <option value="">Klasse (alle)</option>
                    {[5, 6, 7, 8, 9, 10, 11, 12, 13].map((k) => <option key={k} value={k}>Klasse {k}</option>)}
                  </select>
                </div>
                <div className="row">
                  <select value={quizThema} onChange={(e) => setQuizThema(e.target.value)} style={{ flex: 1, marginBottom: 0 }}>
                    <option value="">Thema (alle)</option>
                    {themen.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <button className="btn g sm" disabled={beschaeftigt} onClick={() => void frageZiehen()}>🎲 Aus Quiz-Bank</button>
                </div>

                <textarea placeholder="Frage / Aufgabe …" value={frage} onChange={(e) => setFrage(e.target.value)} />
                <div className="row">
                  <button className={"btn sm " + (art === "freitext" ? "" : "g")} onClick={() => setArt("freitext")}>Freitext</button>
                  <button className={"btn sm " + (art === "auswahl" ? "" : "g")} onClick={() => setArt("auswahl")}>Auswahl</button>
                </div>
                {art === "auswahl" ? (
                  <div>
                    <p className="muted" style={{ margin: "0 0 6px" }}>Antwortmöglichkeiten – die richtige ankreuzen:</p>
                    {optionen.map((o, i) => (
                      <div className="row" key={i}>
                        <input type="radio" name="richtig" checked={richtigIdx === i} onChange={() => setRichtigIdx(i)} />
                        <input type="text" style={{ flex: 1, marginBottom: 0 }} placeholder={`Antwort ${i + 1}`}
                          value={o} onChange={(e) => setOptionen(optionen.map((x, j) => j === i ? e.target.value : x))} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <input type="text" placeholder="Richtige Lösung (optional – für automatische Auswertung)"
                    value={loesung} onChange={(e) => setLoesung(e.target.value)} />
                )}
                <textarea placeholder="Erklärung (optional, wird nach dem Beenden gezeigt)" value={erklaerung}
                  onChange={(e) => setErklaerung(e.target.value)} style={{ minHeight: 44 }} />
                <button className="btn" disabled={beschaeftigt || !frage.trim()} onClick={() => void uebungStarten()}>
                  ▶ Übung starten
                </button>
              </div>
            )}

            {/* Kleana: Belohnungen vergeben */}
            {istLehrerin && zustand?.students && zustand.students.length > 0 && (
              <div className="card">
                <h4>Belohnen</h4>
                {zustand.students.map((s) => (
                  <div className="row" key={s.id}>
                    <span style={{ flex: 1 }}><b>{s.name}</b> <span className="muted">· {s.points} P.</span></span>
                    <button className="btn g sm" onClick={() => void belohnen(s.id, "🐙", 5)}>🐙 +5</button>
                    <button className="btn g sm" onClick={() => void belohnen(s.id, "⭐", 10)}>⭐ +10</button>
                    <button className="btn g sm" onClick={() => void belohnen(s.id, "🏆", 20)}>🏆 +20</button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ============================ ZETTEL ============================= */}
        {tab === "zettel" && (
          istLehrerin ? (
            <div className="card">
              <h4>📝 Stundenzettel</h4>
              <p className="muted" style={{ margin: "0 0 6px" }}>Was haben wir heute gemacht?</p>
              <textarea value={zSummary} onChange={(e) => { zettelAngefasst.current = true; setZSummary(e.target.value); }} />
              <p className="muted" style={{ margin: "0 0 6px" }}>Hausaufgaben bis zum nächsten Mal:</p>
              <textarea value={zHomework} onChange={(e) => { zettelAngefasst.current = true; setZHomework(e.target.value); }} />
              <button className="btn" disabled={beschaeftigt} onClick={() => void zettelSpeichern()}>Speichern</button>
            </div>
          ) : (
            <div className="card">
              <h4>📝 Stundenzettel</h4>
              {zustand?.notes?.summary || zustand?.notes?.homework ? (
                <>
                  {zustand.notes.summary && (<><p className="muted" style={{ margin: "0 0 4px" }}>Das haben wir gemacht:</p>
                    <p style={{ whiteSpace: "pre-wrap", marginTop: 0 }}>{zustand.notes.summary}</p></>)}
                  {zustand.notes.homework && (<><p className="muted" style={{ margin: "10px 0 4px" }}>Hausaufgaben:</p>
                    <p style={{ whiteSpace: "pre-wrap", marginTop: 0 }}>{zustand.notes.homework}</p></>)}
                </>
              ) : <p className="muted">Kleana füllt den Zettel während der Stunde aus – schau später noch mal rein.</p>}
            </div>
          )
        )}

        {hinweis && <div className="toast">{hinweis}</div>}
      </div>
    </div>
  );
}
