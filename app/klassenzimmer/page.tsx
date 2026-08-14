"use client";
// =============================================================================
// Klassenzimmer-Zentrale – /klassenzimmer
// Das dauerhafte Zuhause jeder Klasse (wie ein Teams-Kanal): Chat mit Verlauf,
// Datei-Ablage, Aufgaben/Punkte und Stunden-Historie. Von hier geht es mit
// einem Klick in die Live-Stunde (/stunde/[id]).
// Login: dieselbe Sitzung wie Terminkalender und Stunde (localStorage).
// =============================================================================
import { useCallback, useEffect, useRef, useState } from "react";
import LiveStunde from "../stunde/live-stunde";

// --- Markenfarben (hell, Türkis-Blau-Verlauf) --------------------------------
const TEAL = "#2BB3C0";
const BLAU = "#3E7BB6";
const VERLAUF = `linear-gradient(135deg,${TEAL},${BLAU})`;
const FONTS = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap";

// Dieselbe Sitzung wie der Terminkalender
const LS_KEY = "lma_kal_session";
type Session = { token: string; refresh: string; role: "student" | "admin"; name: string };
function ladeSession(): Session | null {
  try { const raw = localStorage.getItem(LS_KEY); if (raw) return JSON.parse(raw) as Session; } catch { }
  return null;
}
function speichereSession(s: Session) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(s)); } catch { }
}

type NextLesson = { id: string; title: string; starts_at: string; ends_at: string; mode?: string | null };
type Nachricht = { id: string; body: string; created_at: string; sender: string; mine: boolean };
type Datei = { id: string; name: string; size: number; created_at: string; fuerAlle: boolean };
type Stunde = { id: string; title: string; subject: string | null; starts_at: string; ends_at: string; mode?: string | null; notes: { summary: string; homework: string } | null };
type Antwort = { question: string; answer: string; is_correct: boolean | null; answered_at: string };

const CSS = `
.kz{min-height:100dvh;display:flex;flex-direction:column;background:#F7F9FB;color:#17222E;
  font-family:'Inter',system-ui,-apple-system,'Segoe UI',sans-serif;-webkit-font-smoothing:antialiased}
.kz *{box-sizing:border-box}
.kz svg{display:block}
.kz .topbar{display:flex;align-items:center;gap:12px;padding:10px 18px;background:#fff;
  border-bottom:1px solid #E2E7ED;font-size:.88rem;flex-wrap:wrap}
.kz .logo{display:flex;align-items:center;gap:9px;font-weight:800}
.kz .logo .punkt{width:26px;height:26px;border-radius:9px;background:${VERLAUF};
  display:flex;align-items:center;justify-content:center;font-size:.85rem}
.kz .fach{color:#68737F;font-weight:500}
.kz .rechtsgrp{margin-left:auto;display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.kz .chip{display:inline-flex;align-items:center;gap:6px;background:#F2F5F8;border:1px solid #E2E7ED;
  border-radius:999px;padding:4px 11px;font-size:.78rem;font-weight:600;color:#68737F}
.kz .chip.gruen{color:#127A5C;background:#E8F6F0;border-color:#CFEADF}
.kz a{color:#68737F;text-decoration:none;font-weight:600;font-size:.82rem}
.kz .haupt{flex:1;display:flex;min-height:0}
.kz .nav{flex:0 0 225px;background:#fff;border-right:1px solid #E2E7ED;padding:12px 8px;
  display:flex;flex-direction:column;gap:2px}
.kz .nav .klasse{padding:8px 12px;font-weight:800;font-size:.9rem}
.kz .schueler{display:flex;flex-direction:column;gap:2px;max-height:38dvh;overflow-y:auto}
.kz .avatar{width:24px;height:24px;border-radius:50%;background:${VERLAUF};color:#fff;flex:0 0 auto;
  display:flex;align-items:center;justify-content:center;font-size:.72rem;font-weight:800}
.kz .trenn{height:1px;background:#E2E7ED;margin:8px 6px 6px}
.kz .navk{display:flex;align-items:center;gap:10px;background:none;border:0;color:#454F5B;
  font:inherit;font-size:.87rem;font-weight:600;cursor:pointer;padding:9px 12px;border-radius:10px;
  text-align:left;width:100%;transition:background .12s ease}
.kz .navk:hover{background:#F0F3F6}
.kz .navk.on{background:#E6F5F7;color:#0F6F79}
.kz .navk svg{width:19px;height:19px;flex:0 0 auto}
.kz .zurstunde{margin-top:auto;padding:8px}
.kz .inhalt{flex:1;min-width:0;overflow-y:auto;padding:18px}
.kz .inhalt-innen{max-width:760px;margin:0 auto}
@media(max-width:760px){
  .kz .haupt{flex-direction:column}
  .kz .nav{flex:0 0 auto;flex-direction:row;align-items:center;border-right:0;border-bottom:1px solid #E2E7ED;
    overflow-x:auto;padding:8px}
  .kz .nav .klasse{display:none}
  .kz .schueler{flex-direction:row;max-height:none;overflow-x:auto}
  .kz .trenn{display:none}
  .kz .navk{width:auto}
  .kz .zurstunde{margin-top:0;margin-left:auto;padding:0 4px}
}
.kz .card{background:#fff;border:1px solid #E2E7ED;border-radius:13px;padding:14px;margin-bottom:11px;
  box-shadow:0 1px 2px rgba(23,34,46,.04)}
.kz .card h4{margin:0 0 9px;font-size:.95rem;font-weight:700}
.kz .muted{color:#68737F}
.kz .btnA{background:${VERLAUF};color:#fff;border:0;border-radius:10px;padding:9px 15px;
  font:inherit;font-weight:700;font-size:.86rem;cursor:pointer;box-shadow:0 3px 10px rgba(43,179,192,.28)}
.kz .btnA[disabled]{opacity:.55;cursor:default;box-shadow:none}
.kz .btnG{background:#F0F3F6;color:#17222E;border:0;border-radius:9px;padding:7px 11px;
  font:inherit;font-weight:600;font-size:.82rem;cursor:pointer}
.kz .btnG:hover{background:#E5EAEF}
.kz .feld{width:100%;background:#fff;border:1.5px solid #E2E7ED;border-radius:10px;color:#17222E;
  font:inherit;font-size:.9rem;padding:10px 12px}
.kz .feld:focus{outline:none;border-color:${TEAL}}
.kz .chatliste{display:flex;flex-direction:column;gap:10px;margin-bottom:12px}
.kz .msg{max-width:78%}
.kz .msg .wer{font-size:.76rem;font-weight:700;margin-bottom:3px}
.kz .msg .wann{color:#9AA3AD;font-weight:500}
.kz .blase{background:#fff;border:1px solid #E2E7ED;border-radius:3px 13px 13px 13px;
  padding:9px 13px;box-shadow:0 1px 2px rgba(23,34,46,.05);white-space:pre-wrap;word-break:break-word;font-size:.9rem}
.kz .msg.mein{align-self:flex-end}
.kz .msg.mein .blase{background:#E6F5F7;border-color:#C7E8EC;border-radius:13px 3px 13px 13px}
.kz .msg.mein .wer{text-align:right}
.kz .sendezeile{display:flex;gap:8px}
.kz .dateizeile{display:flex;align-items:center;gap:11px}
.kz .dateizeile .info{flex:1;min-width:0}
.kz .dateizeile .info b{word-break:break-word}
.kz .tagOk{background:#E8F6F0;color:#127A5C;border-radius:7px;padding:2px 9px;font-weight:700;font-size:.78rem}
.kz .tagNo{background:#FDEEEC;color:#C03A31;border-radius:7px;padding:2px 9px;font-weight:700;font-size:.78rem}
.kz .points{font-size:1.5rem;font-weight:800;text-align:center;letter-spacing:-.02em;
  background:${VERLAUF};-webkit-background-clip:text;background-clip:text;color:transparent}
.kz .stickers{font-size:1.2rem;letter-spacing:4px;text-align:center;margin-top:3px}
.kz .leer{text-align:center;color:#68737F;padding:30px 10px}
.kz .status{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;padding:30px;text-align:center}
`;

// --- Feine Linien-Icons (wie im Mockup) --------------------------------------
function Icon({ art }: { art: "chat" | "datei" | "aufgabe" | "kamera" }) {
  const s = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      {art === "chat" && (<><path {...s} d="M4 7a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H9.6L5 19.6V16A3 3 0 0 1 4 13z" /><path {...s} d="M8.5 8.7h7M8.5 11.7h4.6" /></>)}
      {art === "datei" && (<><path {...s} d="M6.2 3.4h8.2l3.4 3.4v13.8H6.2z" /><path {...s} d="M9 10h6M9 13.2h6M9 16.4h3.6" /></>)}
      {art === "aufgabe" && (<><rect {...s} x="4" y="3.6" width="16" height="16.8" rx="2.6" /><path {...s} d="m8 12.4 2.7 2.7 5.3-5.6" /></>)}
      {art === "kamera" && (<><rect {...s} x="2.6" y="6" width="12.6" height="12" rx="2.6" /><path {...s} d="M15.2 10.6 21 7.4v9.2l-5.8-3.2" /></>)}
    </svg>
  );
}

const pad = (n: number) => String(n).padStart(2, "0");
function wannText(iso: string): string {
  const d = new Date(iso);
  const tage = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
  return `${tage[d.getDay()]} ${pad(d.getDate())}.${pad(d.getMonth() + 1)}. ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function groesseText(bytes: number): string {
  if (bytes >= 1048576) return (bytes / 1048576).toFixed(1).replace(".", ",") + " MB";
  return Math.max(1, Math.round(bytes / 1024)) + " KB";
}

type Tab = "chat" | "dateien" | "aufgaben" | "stunden";

export default function KlassenzimmerPage() {
  const [bereit, setBereit] = useState(false);
  const [eingeloggt, setEingeloggt] = useState(false);
  const [istLehrerin, setIstLehrerin] = useState(false);
  const [studenten, setStudenten] = useState<{ id: string; name: string }[]>([]);
  const [schuelerId, setSchuelerId] = useState<string>("");
  const [tab, setTab] = useState<Tab>("chat");
  const [nextLesson, setNextLesson] = useState<NextLesson | null>(null);
  const [nachrichten, setNachrichten] = useState<Nachricht[]>([]);
  const [dateien, setDateien] = useState<Datei[]>([]);
  const [stunden, setStunden] = useState<{ upcoming: Stunde[]; past: Stunde[] }>({ upcoming: [], past: [] });
  const [punkte, setPunkte] = useState<{ points: number; stickers: string[]; recent: Antwort[] }>({ points: 0, stickers: [], recent: [] });
  const [entwurf, setEntwurf] = useState("");
  const [beschaeftigt, setBeschaeftigt] = useState(false);
  // Live-Stunde direkt im Klassenzimmer (Zoom-Stil): gesetzte ID = Video läuft
  const [liveId, setLiveId] = useState<string | null>(null);
  const [hinweis, setHinweis] = useState<string | null>(null);
  const chatEndeRef = useRef<HTMLDivElement>(null);
  const dateiInputRef = useRef<HTMLInputElement>(null);
  const [uploadZiel, setUploadZiel] = useState<"schueler" | "alle">("schueler");

  const zeige = useCallback((msg: string) => {
    setHinweis(msg);
    window.setTimeout(() => setHinweis(null), 2800);
  }, []);

  // ---- API (JSON) mit einmaligem Token-Refresh -----------------------------
  const api = useCallback(async (action: string, params: Record<string, unknown> = {}): Promise<Record<string, unknown>> => {
    const session = ladeSession();
    if (!session?.token) return { ok: false, error: "nicht eingeloggt", status: 401 };
    const ruf = async (tok: string) => fetch("/api/klasse", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, token: tok, ...params }),
    });
    let res = await ruf(session.token).catch(() => null);
    if (res && res.status === 401 && session.refresh) {
      const rf = await fetch("/api/kalender", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "refresh", refresh: session.refresh }),
      }).catch(() => null);
      const rd = (await rf?.json().catch(() => ({}))) as Record<string, unknown> | undefined;
      if (rd?.ok && typeof rd.token === "string") {
        speichereSession({ ...session, token: rd.token, refresh: String(rd.refresh) });
        res = await ruf(rd.token).catch(() => null);
      }
    }
    if (!res) return { ok: false, error: "Keine Verbindung." };
    const daten = (await res.json().catch(() => ({ ok: false, error: "Serverfehler." }))) as Record<string, unknown>;
    return { ...daten, status: res.status };
  }, []);

  // ---- Einstieg: wer bin ich, welche Schüler gibt es? ----------------------
  useEffect(() => {
    (async () => {
      const s = ladeSession();
      if (!s?.token) { setBereit(true); return; }
      const d = await api("bootstrap");
      if (d.status === 401) { setBereit(true); return; }
      if (d.ok) {
        setEingeloggt(true);
        setIstLehrerin(d.isTeacher === true);
        if (d.isTeacher === true) {
          const liste = (d.students as { id: string; name: string }[]) || [];
          setStudenten(liste);
          // Direktlink aus dem Kalender: /klassenzimmer?schueler=<id>
          const wunsch = new URLSearchParams(window.location.search).get("schueler");
          if (wunsch && liste.some((x) => x.id === wunsch)) setSchuelerId(wunsch);
          else if (liste.length) setSchuelerId(liste[0].id);
        } else {
          setSchuelerId("selbst"); // Schüler: eigener Raum (Server nutzt eigene ID)
          setNextLesson((d.nextLesson as NextLesson) || null);
        }
      }
      setBereit(true);
    })();
    // api ist stabil (useCallback ohne Abhängigkeiten)
  }, [api]);

  // Parameter für den Server: Kleana schickt die Schüler-Auswahl mit
  const zielParam = useCallback((): Record<string, unknown> =>
    istLehrerin && schuelerId && schuelerId !== "selbst" ? { studentId: schuelerId } : {}, [istLehrerin, schuelerId]);

  // ---- Tab-Daten laden -----------------------------------------------------
  const lade = useCallback(async (welcherTab: Tab) => {
    if (!schuelerId) return;
    if (welcherTab === "chat") {
      const d = await api("messages", zielParam());
      if (d.ok) {
        setNachrichten((d.messages as Nachricht[]) || []);
        setNextLesson((d.nextLesson as NextLesson) || null);
      }
    }
    if (welcherTab === "dateien") {
      const d = await api("files", zielParam());
      if (d.ok) setDateien((d.files as Datei[]) || []);
    }
    if (welcherTab === "stunden") {
      const d = await api("lessons", zielParam());
      if (d.ok) setStunden({ upcoming: (d.upcoming as Stunde[]) || [], past: (d.past as Stunde[]) || [] });
    }
    if (welcherTab === "aufgaben") {
      const d = await api("exercises", zielParam());
      if (d.ok) setPunkte({ points: Number(d.points) || 0, stickers: (d.stickers as string[]) || [], recent: (d.recent as Antwort[]) || [] });
    }
  }, [api, schuelerId, zielParam]);

  // Beim Tab- oder Schülerwechsel laden; Chat zusätzlich alle 5 s auffrischen.
  // Während der Live-Stunde pausieren (die Tabs sind dann ausgeblendet).
  useEffect(() => {
    if (!eingeloggt || !schuelerId || liveId) return;
    // lade ist async – setState passiert erst nach dem await
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void lade(tab);
    if (tab !== "chat") return;
    const t = window.setInterval(() => { void lade("chat"); }, 5000);
    return () => window.clearInterval(t);
  }, [eingeloggt, schuelerId, tab, lade, liveId]);

  // Chat: ans Ende springen, wenn neue Nachrichten da sind
  useEffect(() => {
    chatEndeRef.current?.scrollIntoView({ block: "end" });
  }, [nachrichten.length]);

  // ---- Aktionen ------------------------------------------------------------
  async function senden() {
    const text = entwurf.trim();
    if (!text || beschaeftigt) return;
    setBeschaeftigt(true);
    const d = await api("sendMessage", { ...zielParam(), body: text });
    setBeschaeftigt(false);
    if (d.ok) { setEntwurf(""); void lade("chat"); }
    else zeige(String(d.error || "Senden fehlgeschlagen."));
  }

  async function dateiOeffnen(id: string) {
    const d = await api("fileUrl", { ...zielParam(), fileId: id });
    if (d.ok && typeof d.url === "string") window.open(d.url, "_blank");
    else zeige(String(d.error || "Datei konnte nicht geöffnet werden."));
  }

  async function dateiLoeschen(id: string, name: string) {
    if (!window.confirm(`„${name}“ wirklich löschen?`)) return;
    const d = await api("deleteFile", { fileId: id });
    zeige(d.ok ? "Datei gelöscht." : String(d.error || "Löschen fehlgeschlagen."));
    void lade("dateien");
  }

  async function hochladen(datei: File) {
    const session = ladeSession();
    if (!session?.token) return;
    setBeschaeftigt(true);
    const form = new FormData();
    form.append("action", "upload");
    form.append("token", session.token);
    form.append("studentId", uploadZiel === "alle" ? "alle" : schuelerId);
    form.append("file", datei);
    const res = await fetch("/api/klasse", { method: "POST", body: form }).catch(() => null);
    const d = (await res?.json().catch(() => ({}))) as Record<string, unknown> | undefined;
    setBeschaeftigt(false);
    zeige(d?.ok ? "Datei hochgeladen ✓" : String(d?.error || "Hochladen fehlgeschlagen."));
    void lade("dateien");
  }

  const schuelerName = istLehrerin
    ? (studenten.find((s) => s.id === schuelerId)?.name || "–")
    : (ladeSession()?.name || "Deine Klasse");

  // ---- Anzeige -------------------------------------------------------------
  if (!bereit) {
    return (<div className="kz"><style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="status"><div style={{ fontSize: "2rem" }}>🐙</div><p className="muted">Dein Klassenzimmer wird geöffnet …</p></div></div>);
  }
  if (!eingeloggt) {
    return (<div className="kz"><link rel="stylesheet" href={FONTS} /><style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="status">
        <div style={{ fontSize: "2rem" }}>🐙</div>
        <h2 style={{ margin: 0 }}>Bitte zuerst einloggen</h2>
        <p className="muted" style={{ maxWidth: 420 }}>Melde dich im Terminkalender mit deinen Zugangsdaten an und öffne diese Seite danach noch einmal.</p>
        <a className="btnA" style={{ textDecoration: "none" }} href="/kalender">Zum Login</a>
      </div></div>);
  }

  return (
    <div className="kz">
      <link rel="stylesheet" href={FONTS} />
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="topbar">
        <span className="logo"><span className="punkt">🐙</span>Lerne mit Anna</span>
        <span className="fach">Klassenzimmer · {schuelerName}</span>
        <span className="rechtsgrp">
          {nextLesson && <span className="chip gruen">Nächste Stunde: {wannText(nextLesson.starts_at)}</span>}
          <a href="/kalender">← Zum Kalender</a>
        </span>
      </div>

      {/* Live-Stunde eingebettet (Zoom-Stil): füllt den Bereich unter der
          Kopfzeile komplett; „✕ Schließen" führt zurück zu den Tabs */}
      {liveId && (
        <div className="haupt">
          <LiveStunde lessonId={liveId} eingebettet onSchliessen={() => setLiveId(null)} />
        </div>
      )}

      {!liveId && <div className="haupt">
        <nav className="nav">
          <div className="klasse">{schuelerName}</div>
          {istLehrerin && (
            <div className="schueler" role="list" aria-label="Schüler wählen">
              {studenten.map((s) => (
                <button key={s.id} className={"navk" + (s.id === schuelerId ? " on" : "")} onClick={() => setSchuelerId(s.id)}>
                  <span className="avatar" aria-hidden>{s.name.trim().charAt(0).toUpperCase()}</span>{s.name}
                </button>
              ))}
              {studenten.length === 0 && <p className="muted" style={{ margin: "4px 12px", fontSize: ".84rem" }}>Noch keine Schüler</p>}
              <div className="trenn" />
            </div>
          )}
          <button className={"navk" + (tab === "chat" ? " on" : "")} onClick={() => setTab("chat")}><Icon art="chat" />Chat</button>
          <button className={"navk" + (tab === "dateien" ? " on" : "")} onClick={() => setTab("dateien")}><Icon art="datei" />Dateien</button>
          <button className={"navk" + (tab === "aufgaben" ? " on" : "")} onClick={() => setTab("aufgaben")}><Icon art="aufgabe" />Aufgaben</button>
          <button className={"navk" + (tab === "stunden" ? " on" : "")} onClick={() => setTab("stunden")}><Icon art="kamera" />Stunden</button>
          {nextLesson && nextLesson.mode !== "vor_ort" && (
            <div className="zurstunde">
              <button className="btnA" style={{ display: "block", width: "100%", textAlign: "center" }} onClick={() => setLiveId(nextLesson.id)}>
                📹 Zur Stunde
              </button>
            </div>
          )}
          {nextLesson && nextLesson.mode === "vor_ort" && (
            <div className="zurstunde">
              <span className="chip" style={{ display: "flex", justifyContent: "center" }}>🏫 Nächste Stunde: vor Ort</span>
            </div>
          )}
        </nav>

        <main className="inhalt"><div className="inhalt-innen">
          {/* ============================ CHAT ============================ */}
          {tab === "chat" && (<>
            <div className="chatliste">
              {nachrichten.length === 0 && <div className="leer">Noch keine Nachrichten – schreib die erste! 😊</div>}
              {nachrichten.map((m) => (
                <div key={m.id} className={"msg" + (m.mine ? " mein" : "")}>
                  <div className="wer">{m.mine ? "Du" : m.sender} <span className="wann">· {wannText(m.created_at)}</span></div>
                  <div className="blase">{m.body}</div>
                </div>
              ))}
              <div ref={chatEndeRef} />
            </div>
            <div className="sendezeile">
              <input className="feld" placeholder="Nachricht schreiben …" value={entwurf}
                onChange={(e) => setEntwurf(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") void senden(); }} />
              <button className="btnA" disabled={beschaeftigt || !entwurf.trim()} onClick={() => void senden()}>Senden</button>
            </div>
            <p className="muted" style={{ fontSize: ".8rem", marginTop: 8 }}>Der Verlauf bleibt erhalten – auch nach der Stunde.</p>
          </>)}

          {/* ============================ DATEIEN ========================= */}
          {tab === "dateien" && (<>
            {istLehrerin && (
              <div className="card" style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                <button className="btnA" disabled={beschaeftigt} onClick={() => dateiInputRef.current?.click()}>⬆️ Datei hochladen</button>
                <select className="feld" style={{ width: "auto" }} value={uploadZiel}
                  onChange={(e) => setUploadZiel(e.target.value as "schueler" | "alle")}>
                  <option value="schueler">nur für {schuelerName}</option>
                  <option value="alle">für alle Schüler</option>
                </select>
                <input ref={dateiInputRef} type="file" style={{ display: "none" }}
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) void hochladen(f); e.target.value = ""; }} />
                <span className="muted" style={{ fontSize: ".8rem" }}>max. 25 MB</span>
              </div>
            )}
            {dateien.length === 0 && <div className="leer">Noch keine Dateien. {istLehrerin ? "Lade das erste Arbeitsblatt hoch!" : "Kleana lädt hier Arbeitsblätter für dich hoch."}</div>}
            {dateien.map((f) => (
              <div key={f.id} className="card dateizeile">
                <span style={{ fontSize: "1.3rem" }}>📄</span>
                <span className="info"><b>{f.name}</b><br />
                  <span className="muted" style={{ fontSize: ".8rem" }}>
                    {wannText(f.created_at)} · {groesseText(f.size)}{f.fuerAlle ? " · für alle" : ""}
                  </span></span>
                <button className="btnG" onClick={() => void dateiOeffnen(f.id)}>Öffnen</button>
                {istLehrerin && <button className="btnG" onClick={() => void dateiLoeschen(f.id, f.name)} aria-label="Löschen">🗑️</button>}
              </div>
            ))}
          </>)}

          {/* ============================ AUFGABEN ======================== */}
          {tab === "aufgaben" && (<>
            <div className="card">
              <div className="points">🐙 {punkte.points} Punkte</div>
              {punkte.stickers.length > 0 && <div className="stickers">{punkte.stickers.join(" ")}</div>}
            </div>
            <div className="card">
              <h4>Zuletzt geübt</h4>
              {punkte.recent.length === 0 && <p className="muted" style={{ margin: 0 }}>Noch keine Übungen – die erste kommt in der nächsten Stunde!</p>}
              {punkte.recent.map((a, i) => (
                <p key={i} style={{ margin: "0 0 8px" }}>
                  {a.question}<br />
                  <span className="muted" style={{ fontSize: ".84rem" }}>Antwort: {a.answer} </span>
                  {a.is_correct === true ? <span className="tagOk">✓ richtig</span>
                    : a.is_correct === false ? <span className="tagNo">✗ üben wir nochmal</span>
                      : <span className="muted" style={{ fontSize: ".8rem" }}>· von Kleana angeschaut</span>}
                </p>
              ))}
            </div>
          </>)}

          {/* ============================ STUNDEN ========================= */}
          {tab === "stunden" && (<>
            {stunden.upcoming.map((l) => (
              <div key={l.id} className="card" style={{ borderColor: TEAL }}>
                <h4>Nächste Stunde: {wannText(l.starts_at)}</h4>
                {l.mode === "vor_ort" ? (<>
                  <p className="muted" style={{ margin: "0 0 10px" }}>{l.title}{l.subject ? ` · ${l.subject}` : ""} · 🏫 vor Ort</p>
                  <span className="chip">🏫 Wir sehen uns vor Ort!</span>
                </>) : (<>
                  <p className="muted" style={{ margin: "0 0 10px" }}>{l.title}{l.subject ? ` · ${l.subject}` : ""} · 💻 online · Beitritt ab 15 Min. vorher</p>
                  <button className="btnA" onClick={() => setLiveId(l.id)}>Zur Stunde</button>
                </>)}
              </div>
            ))}
            {stunden.past.map((l) => (
              <div key={l.id} className="card">
                <h4>{wannText(l.starts_at)} – {l.title}{l.subject ? ` (${l.subject})` : ""}</h4>
                {l.notes?.summary && (<><p className="muted" style={{ margin: "0 0 4px" }}>Stundenzettel:</p>
                  <p style={{ margin: "0 0 8px", whiteSpace: "pre-wrap" }}>{l.notes.summary}</p></>)}
                {l.notes?.homework && (<><p className="muted" style={{ margin: "0 0 4px" }}>Hausaufgaben:</p>
                  <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>{l.notes.homework}</p></>)}
                {!l.notes?.summary && !l.notes?.homework && <p className="muted" style={{ margin: 0 }}>Kein Stundenzettel zu dieser Stunde.</p>}
              </div>
            ))}
            {stunden.upcoming.length === 0 && stunden.past.length === 0 &&
              <div className="leer">Noch keine Stunden geplant.</div>}
          </>)}

          {hinweis && <div className="card" style={{ background: "#E8F6F0", borderColor: "#CFEADF", color: "#127A5C", fontWeight: 700, textAlign: "center" }}>{hinweis}</div>}
        </div></main>
      </div>}
    </div>
  );
}
