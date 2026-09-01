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

type NextLesson = { id: string; title: string; starts_at: string; ends_at: string; mode?: string | null; teamsLink?: string | null };
type Nachricht = { id: string; body: string; created_at: string; sender: string; mine: boolean; datei?: string | null };
type Datei = { id: string; name: string; size: number; created_at: string; fuerAlle: boolean; category?: string; beschreibung?: string | null };
type Bericht = { id: string; titel: string; art: "bericht" | "quiz"; inhalt: string; created_at: string; eingabe?: string };
type DateiKat = "alle" | "arbeitsblatt" | "hausaufgabe" | "sonstiges";
const KAT_NAMEN: Record<string, string> = { arbeitsblatt: "Arbeitsblätter", hausaufgabe: "Hausaufgaben", sonstiges: "Sonstiges" };
type Stunde = { id: string; title: string; subject: string | null; starts_at: string; ends_at: string; mode?: string | null; notes: { summary: string; homework: string } | null };

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
.kz .tabs{display:contents}
.kz .zurstunde{margin-top:auto;padding:8px}
.kz .inhalt{flex:1;min-width:0;overflow-y:auto;padding:18px}
.kz .inhalt-innen{max-width:760px;margin:0 auto}
@media(max-width:760px){
  /* Handy: wie eine richtige App – Tab-Leiste UNTEN (große Knöpfe mit
     Beschriftung), Schüler-Auswahl als umbrechende Chips, nichts scrollt
     seitlich. */
  .kz .topbar{padding:8px 12px;gap:8px;font-size:.82rem}
  .kz .fach{display:none}
  .kz .haupt{flex-direction:column}
  .kz .nav{flex:0 0 auto;border-right:0;padding:0;gap:0}
  .kz .nav .klasse{display:none}
  .kz .trenn{display:none}
  .kz .schueler{flex-direction:row;flex-wrap:wrap;gap:6px;max-height:none;overflow:visible;
    padding:10px 12px;border-bottom:1px solid #E2E7ED;background:#fff}
  .kz .schueler .navk{width:auto;padding:7px 12px;border:1px solid #E2E7ED;border-radius:999px;font-size:.82rem;gap:7px}
  .kz .schueler .navk.on{border-color:#9AD6DC}
  .kz .zurstunde{margin:0;padding:10px 12px 0}
  .kz .tabs{position:fixed;left:0;right:0;bottom:0;z-index:30;display:flex;background:#fff;
    border-top:1px solid #E2E7ED;padding:6px 6px calc(6px + env(safe-area-inset-bottom));
    box-shadow:0 -2px 10px rgba(23,34,46,.06)}
  .kz .tabs .navk{flex:1 1 0;min-width:0;flex-direction:column;align-items:center;gap:3px;
    padding:6px 2px;font-size:.68rem;font-weight:700;border-radius:10px}
  .kz .tabs .navk svg{width:22px;height:22px}
  .kz .inhalt{padding:14px 12px calc(96px + env(safe-area-inset-bottom))}
  .kz .msg{max-width:88%}
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
.kz .anhang{display:block;margin-top:6px;background:#F0F3F6;border:1px solid #E2E7ED;border-radius:9px;
  padding:7px 11px;font:inherit;font-size:.84rem;font-weight:600;color:#0F6F79;cursor:pointer;text-align:left;
  max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.kz .dateizeile{display:flex;align-items:center;gap:11px}
.kz .dateizeile .info{flex:1;min-width:0}
.kz .dateizeile .info b{word-break:break-word}
.kz .tagOk{background:#E8F6F0;color:#127A5C;border-radius:7px;padding:2px 9px;font-weight:700;font-size:.78rem}
.kz .tagNo{background:#FDEEEC;color:#C03A31;border-radius:7px;padding:2px 9px;font-weight:700;font-size:.78rem}
.kz .points{font-size:1.5rem;font-weight:800;text-align:center;letter-spacing:-.02em;
  background:${VERLAUF};-webkit-background-clip:text;background-clip:text;color:transparent}
.kz .stickers{font-size:1.2rem;letter-spacing:4px;text-align:center;margin-top:3px}
.kz .leer{text-align:center;color:#68737F;padding:30px 10px}
.kz .berichtkopf{display:flex;align-items:center;gap:11px;width:100%;background:none;border:0;
  font:inherit;color:inherit;cursor:pointer;text-align:left;padding:0}
.kz .berichtkopf .info{flex:1;min-width:0}
.kz .bericht{margin-top:12px;border-top:1px solid #E2E7ED;padding-top:4px;font-size:.92rem;line-height:1.6}
.kz .bericht h3{font-size:1.08rem;margin:12px 0 6px}
.kz .bericht h4{font-size:.98rem;margin:14px 0 5px}
.kz .bericht h5{font-size:.92rem;margin:12px 0 4px}
.kz .bericht p{margin:0 0 8px}
.kz .bericht ul,.kz .bericht ol{margin:0 0 10px;padding-left:22px}
.kz .bericht li{margin:0 0 5px}
.kz .bericht code{background:#F0F3F6;border-radius:5px;padding:1px 5px}
.kz .katchip{background:#F2F5F8;border:1px solid #E2E7ED;border-radius:999px;padding:5px 13px;
  font:inherit;font-size:.8rem;font-weight:700;color:#68737F;cursor:pointer}
.kz .katchip.on{background:#E6F5F7;border-color:#9AD6DC;color:#0F6F79}
.kz .status{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;padding:30px;text-align:center}
.kz .rechtsfuss{text-align:center;padding:18px 0 4px;color:#9AA3AD;font-size:.76rem}
.kz .rechtsfuss a{color:#9AA3AD;text-decoration:underline;font-weight:500;font-size:.76rem}
`;

// --- Feine Linien-Icons (wie im Mockup) --------------------------------------
function Icon({ art }: { art: "chat" | "datei" | "aufgabe" | "kamera" | "bericht" | "material" }) {
  const s = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      {art === "chat" && (<><path {...s} d="M4 7a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H9.6L5 19.6V16A3 3 0 0 1 4 13z" /><path {...s} d="M8.5 8.7h7M8.5 11.7h4.6" /></>)}
      {art === "bericht" && (<><path {...s} d="M12 6.2C10.6 4.9 8.6 4.2 6 4.2v13.6c2.6 0 4.6.7 6 2 1.4-1.3 3.4-2 6-2V4.2c-2.6 0-4.6.7-6 2z" /><path {...s} d="M12 6.2v13.6" /></>)}
      {art === "material" && (<><rect {...s} x="3.4" y="4.4" width="17.2" height="12.4" rx="2.2" /><path {...s} d="M3.4 8.2h17.2M8.4 20h7.2" /></>)}
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

type Tab = "chat" | "berichte" | "material" | "dateien" | "stunden";

// Kleiner Markdown-Renderer für die KI-Berichte (Überschriften, Listen,
// fett/kursiv) – Eingabe wird zuerst entschärft, dann formatiert
function mdZuHtml(md: string): string {
  const esc = md.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const fett = (s: string) => s
    .replace(/\*\*(.+?)\*\*/g, "<b>$1</b>")
    .replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<i>$2</i>")
    .replace(/`([^`\n]+)`/g, "<code>$1</code>");
  let html = "", inUl = false, inOl = false;
  const listenZu = () => {
    if (inUl) { html += "</ul>"; inUl = false; }
    if (inOl) { html += "</ol>"; inOl = false; }
  };
  for (const roh of esc.split("\n")) {
    const z = roh.trimEnd();
    if (/^###\s+/.test(z)) { listenZu(); html += `<h5>${fett(z.replace(/^###\s+/, ""))}</h5>`; }
    else if (/^##\s+/.test(z)) { listenZu(); html += `<h4>${fett(z.replace(/^##\s+/, ""))}</h4>`; }
    else if (/^#\s+/.test(z)) { listenZu(); html += `<h3>${fett(z.replace(/^#\s+/, ""))}</h3>`; }
    else if (/^[-*]\s+/.test(z)) { if (!inUl) { listenZu(); html += "<ul>"; inUl = true; } html += `<li>${fett(z.replace(/^[-*]\s+/, ""))}</li>`; }
    else if (/^\d+[.)]\s+/.test(z)) { if (!inOl) { listenZu(); html += "<ol>"; inOl = true; } html += `<li>${fett(z.replace(/^\d+[.)]\s+/, ""))}</li>`; }
    else if (z === "" || z === "---") { listenZu(); }
    else { listenZu(); html += `<p>${fett(z)}</p>`; }
  }
  listenZu();
  return html;
}

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
  const [material, setMaterial] = useState<Datei[]>([]);
  const [materialText, setMaterialText] = useState("");
  const materialInputRef = useRef<HTMLInputElement>(null);
  const chatDateiRef = useRef<HTMLInputElement>(null);
  const [entwurf, setEntwurf] = useState("");
  const [beschaeftigt, setBeschaeftigt] = useState(false);
  // Live-Stunde direkt im Klassenzimmer (Zoom-Stil): gesetzte ID = Video läuft
  const [liveId, setLiveId] = useState<string | null>(null);
  const [hinweis, setHinweis] = useState<string | null>(null);
  const chatEndeRef = useRef<HTMLDivElement>(null);
  const dateiInputRef = useRef<HTMLInputElement>(null);
  const [uploadKat, setUploadKat] = useState<"arbeitsblatt" | "hausaufgabe" | "sonstiges">("arbeitsblatt");
  const [dateiKat, setDateiKat] = useState<DateiKat>("alle");
  const [berichte, setBerichte] = useState<Bericht[]>([]);
  const [berichtEntwurf, setBerichtEntwurf] = useState("");
  const [kiLaeuft, setKiLaeuft] = useState<string | null>(null); // Text des Lade-Hinweises
  const [offenerBericht, setOffenerBericht] = useState<string | null>(null);
  // Diktieren (Spracheingabe des Browsers) für den Stundenbericht
  const [diktiert, setDiktiert] = useState(false);
  const erkennungRef = useRef<{ stop: () => void } | null>(null);

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
    if (welcherTab === "berichte") {
      const d = await api("berichte", zielParam());
      if (d.ok) setBerichte((d.reports as Bericht[]) || []);
    }
    if (welcherTab === "stunden") {
      const d = await api("lessons", zielParam());
      if (d.ok) setStunden({ upcoming: (d.upcoming as Stunde[]) || [], past: (d.past as Stunde[]) || [] });
    }
    if (welcherTab === "material") {
      const d = await api("material");
      if (d.ok) setMaterial((d.files as Datei[]) || []);
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

  /**
   * Aufnahme sicher beenden.
   *
   * Der Zustand wird SOFORT auf „gestoppt" gesetzt und die Erkennung
   * losgelöst – nicht erst im onend des Browsers, denn das kommt auf manchen
   * Geräten verspätet oder gar nicht, und dann hing der Knopf auf
   * „Aufnahme stoppen" fest, während das Mikrofon weiterlief.
   */
  const diktatStoppen = useCallback(() => {
    const r = erkennungRef.current;
    erkennungRef.current = null;
    setDiktiert(false);
    try { r?.stop(); } catch { /* war schon beendet */ }
  }, []);

  // Beim Verlassen der Seite darf keine Aufnahme weiterlaufen.
  useEffect(() => diktatStoppen, [diktatStoppen]);

  // Diktieren starten/stoppen: nutzt die Spracherkennung des Browsers
  // (de-DE); der gesprochene Text landet live im Bericht-Feld
  function diktierenToggle() {
    if (diktiert) { diktatStoppen(); return; }
    type ErgebnisListe = { length: number; [i: number]: { 0: { transcript: string } } };
    type Erkennung = {
      lang: string; continuous: boolean; interimResults: boolean;
      onresult: ((e: { results: ErgebnisListe }) => void) | null;
      onend: (() => void) | null; onerror: (() => void) | null;
      start: () => void; stop: () => void;
    };
    const w = window as unknown as { SpeechRecognition?: new () => Erkennung; webkitSpeechRecognition?: new () => Erkennung };
    const SR = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!SR) { zeige("Diktieren wird hier nicht unterstützt – nutze das Mikrofon auf der Tastatur."); return; }
    const r = new SR();
    r.lang = "de-DE";
    r.continuous = true;
    r.interimResults = true;
    const basis = berichtEntwurf.trim();
    r.onresult = (e) => {
      // Eine losgelöste Erkennung (gestoppt, Seite gewechselt) darf nicht
      // weiter ins Feld schreiben – manche Browser liefern nach stop() noch
      // Ergebnisse nach.
      if (erkennungRef.current !== r) { try { r.stop(); } catch { /* egal */ } return; }
      let text = "";
      for (let i = 0; i < e.results.length; i++) text += e.results[i][0].transcript;
      setBerichtEntwurf((basis ? basis + " " : "") + text.trim());
    };
    r.onend = () => { if (erkennungRef.current === r) { erkennungRef.current = null; setDiktiert(false); } };
    r.onerror = () => { if (erkennungRef.current === r) { erkennungRef.current = null; setDiktiert(false); } };
    erkennungRef.current = r;
    setDiktiert(true);
    r.start();
  }

  // KI-Bericht/Quiz erstellen: dauert 10–40 Sekunden, deshalb mit Hinweis
  async function berichtErstellen() {
    // Läuft noch eine Aufnahme, erst beenden – sonst wäre der Stopp-Knopf
    // während der KI-Wartezeit gesperrt und das Mikrofon liefe weiter.
    if (diktiert) diktatStoppen();
    const eingabe = berichtEntwurf.trim();
    if (!eingabe || kiLaeuft) return;
    setKiLaeuft("Der Bericht wird geschrieben … das dauert etwa eine halbe Minute.");
    const d = await api("berichtErstellen", { ...zielParam(), eingabe });
    setKiLaeuft(null);
    if (d.ok) {
      setBerichtEntwurf("");
      const neu = d.report as Bericht;
      if (neu) { setBerichte((alt) => [neu, ...alt]); setOffenerBericht(neu.id); }
      zeige("Bericht erstellt und hochgeladen ✓");
    } else zeige(String(d.error || "Bericht konnte nicht erstellt werden."));
  }
  async function quizErstellen() {
    if (kiLaeuft) return;
    setKiLaeuft("Das Wiederholungs-Quiz wird zusammengestellt … einen Moment.");
    const d = await api("quizErstellen", zielParam());
    setKiLaeuft(null);
    if (d.ok) {
      const neu = d.report as Bericht;
      if (neu) { setBerichte((alt) => [neu, ...alt]); setOffenerBericht(neu.id); }
      zeige("Quiz erstellt ✓");
    } else zeige(String(d.error || "Quiz konnte nicht erstellt werden."));
  }
  async function berichtLoeschen(b: Bericht) {
    if (!window.confirm(`„${b.titel}“ wirklich löschen?`)) return;
    const d = await api("berichtLoeschen", { ...zielParam(), reportId: b.id });
    if (d.ok) setBerichte((alt) => alt.filter((x) => x.id !== b.id));
    else zeige(String(d.error || "Löschen fehlgeschlagen."));
  }

  // Foto/Datei im Chat verschicken (dürfen auch Schüler)
  async function chatHochladen(datei: File) {
    const session = ladeSession();
    if (!session?.token) return;
    setBeschaeftigt(true);
    const form = new FormData();
    form.append("action", "chatUpload");
    form.append("token", session.token);
    const zp = zielParam();
    if (typeof zp.studentId === "string") form.append("studentId", zp.studentId);
    form.append("file", datei);
    const res = await fetch("/api/klasse", { method: "POST", body: form }).catch(() => null);
    const d = (await res?.json().catch(() => ({}))) as Record<string, unknown> | undefined;
    setBeschaeftigt(false);
    if (d?.ok) void lade("chat");
    else zeige(String(d?.error || "Hochladen fehlgeschlagen."));
  }
  async function chatAnhangOeffnen(messageId: string) {
    const d = await api("chatFileUrl", { ...zielParam(), messageId });
    if (d.ok && typeof d.url === "string") window.open(d.url, "_blank");
    else zeige(String(d.error || "Datei konnte nicht geöffnet werden."));
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

  async function hochladen(datei: File, ziel: "schueler" | "material") {
    const session = ladeSession();
    if (!session?.token) return;
    setBeschaeftigt(true);
    const form = new FormData();
    form.append("action", "upload");
    form.append("token", session.token);
    form.append("studentId", ziel === "material" ? "alle" : schuelerId);
    form.append("category", ziel === "material" ? "lernmaterial" : uploadKat);
    if (ziel === "material" && materialText.trim()) form.append("beschreibung", materialText.trim());
    form.append("file", datei);
    const res = await fetch("/api/klasse", { method: "POST", body: form }).catch(() => null);
    const d = (await res?.json().catch(() => ({}))) as Record<string, unknown> | undefined;
    setBeschaeftigt(false);
    zeige(d?.ok ? (ziel === "material" ? "Hochgeladen – alle Schüler sehen es jetzt ✓" : "Datei hochgeladen ✓") : String(d?.error || "Hochladen fehlgeschlagen."));
    if (ziel === "material") { setMaterialText(""); void lade("material"); }
    else void lade("dateien");
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
    return (<div className="kz"><style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="status">
        <div style={{ fontSize: "2rem" }}>🐙</div>
        <h2 style={{ margin: 0 }}>Bitte zuerst einloggen</h2>
        <p className="muted" style={{ maxWidth: 420 }}>Melde dich im Terminkalender mit deinen Zugangsdaten an und öffne diese Seite danach noch einmal.</p>
        <a className="btnA" style={{ textDecoration: "none" }} href="/kalender">Zum Login</a>
        <div className="rechtsfuss"><a href="/datenschutz">Datenschutz</a> · <a href="/impressum">Impressum</a></div>
      </div></div>);
  }

  return (
    <div className="kz">
      
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
          <div className="klasse">{istLehrerin ? "Schüler" : schuelerName}</div>
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
          {/* Am PC: Liste in der Seitenleiste – am Handy: feste Tab-Leiste unten */}
          <div className="tabs">
            <button className={"navk" + (tab === "chat" ? " on" : "")} onClick={() => setTab("chat")}><Icon art="chat" />Chat</button>
            <button className={"navk" + (tab === "berichte" ? " on" : "")} onClick={() => setTab("berichte")}><Icon art="bericht" />Berichte</button>
            <button className={"navk" + (tab === "material" ? " on" : "")} onClick={() => setTab("material")}><Icon art="material" />Material</button>
            <button className={"navk" + (tab === "dateien" ? " on" : "")} onClick={() => setTab("dateien")}><Icon art="datei" />Dateien</button>
            <button className={"navk" + (tab === "stunden" ? " on" : "")} onClick={() => setTab("stunden")}><Icon art="kamera" />Stunden</button>
          </div>
          {nextLesson && nextLesson.mode !== "vor_ort" && (
            <div className="zurstunde">
              {nextLesson.teamsLink
                ? <a className="btnA" style={{ display: "block", width: "100%", textAlign: "center", textDecoration: "none", boxSizing: "border-box" }}
                  href={nextLesson.teamsLink} target="_blank" rel="noreferrer">📹 Zur Stunde (Teams)</a>
                : <button className="btnA" style={{ display: "block", width: "100%", textAlign: "center" }} onClick={() => setLiveId(nextLesson.id)}>
                  📹 Zur Stunde
                </button>}
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
                  <div className="blase">
                    {m.body}
                    {m.datei && <button className="anhang" onClick={() => void chatAnhangOeffnen(m.id)}>📎 {m.datei}</button>}
                  </div>
                </div>
              ))}
              <div ref={chatEndeRef} />
            </div>
            <div className="sendezeile">
              <button className="btnG" title="Foto oder Datei senden" disabled={beschaeftigt}
                onClick={() => chatDateiRef.current?.click()} style={{ flex: "0 0 auto" }}>📎</button>
              <input ref={chatDateiRef} type="file" style={{ display: "none" }}
                onChange={(e) => { const f = e.target.files?.[0]; if (f) void chatHochladen(f); e.target.value = ""; }} />
              <input className="feld" placeholder="Nachricht schreiben …" value={entwurf}
                onChange={(e) => setEntwurf(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") void senden(); }} />
              <button className="btnA" disabled={beschaeftigt || !entwurf.trim()} onClick={() => void senden()}>Senden</button>
            </div>
            <p className="muted" style={{ fontSize: ".8rem", marginTop: 8 }}>Der Verlauf bleibt erhalten – auch nach der Stunde.</p>
          </>)}

          {/* ============================ BERICHTE ======================== */}
          {tab === "berichte" && (<>
            {istLehrerin && (
              <div className="card">
                <h4>Neuer Stundenbericht</h4>
                <p className="muted" style={{ margin: "0 0 8px", fontSize: ".84rem" }}>
                  Schreib in ein paar Stichpunkten, was ihr in der Stunde gemacht habt — die KI macht daraus
                  einen schönen Bericht mit Erklärung, Beispielen und Hausaufgaben für {schuelerName}.
                </p>
                <textarea className="feld" rows={3} placeholder={`z. B. „Bruchrechnen: Kürzen und Erweitern geübt, klappt schon gut. Bei Textaufgaben noch unsicher. Klasse 6.“`}
                  value={berichtEntwurf} onChange={(e) => setBerichtEntwurf(e.target.value)} disabled={!!kiLaeuft} />
                <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                  <button className={"btnG"} style={diktiert ? { background: "#FDEEEC", color: "#C03A31" } : undefined}
                    disabled={!!kiLaeuft && !diktiert} onClick={diktierenToggle}>{diktiert ? "Aufnahme stoppen" : "Diktieren"}</button>
                  <button className="btnA" disabled={!!kiLaeuft || berichtEntwurf.trim().length < 10} onClick={() => void berichtErstellen()}>Bericht erstellen</button>
                  <button className="btnG" disabled={!!kiLaeuft || berichte.filter((b) => b.art === "bericht").length === 0}
                    title="Erstellt aus den letzten Berichten ein Wiederholungs-Quiz" onClick={() => void quizErstellen()}>Wiederholungs-Quiz</button>
                </div>
                {kiLaeuft && <p style={{ margin: "10px 0 0", fontWeight: 700 }}>{kiLaeuft}</p>}
              </div>
            )}
            {berichte.length === 0 && !kiLaeuft && (
              <div className="leer">{istLehrerin ? "Noch keine Berichte – erstelle oben den ersten!" : "Noch keine Berichte. Nach der nächsten Stunde findest du hier, was ihr gemacht habt – mit Erklärung, Beispielen und Hausaufgaben."}</div>
            )}
            {berichte.map((b) => (
              <div key={b.id} className="card">
                <button className="berichtkopf" onClick={() => setOffenerBericht(offenerBericht === b.id ? null : b.id)}>
                  <span className="info"><b>{b.titel}</b><br />
                    <span className="muted" style={{ fontSize: ".8rem" }}>{wannText(b.created_at)}{b.art === "quiz" ? " · Quiz" : ""}</span></span>
                  <span className="muted">{offenerBericht === b.id ? "▲" : "▼"}</span>
                </button>
                {offenerBericht === b.id && (<>
                  <div className="bericht" dangerouslySetInnerHTML={{ __html: mdZuHtml(b.inhalt) }} />
                  {istLehrerin && (
                    <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                      <button className="btnG" onClick={() => void berichtLoeschen(b)}>Löschen</button>
                    </div>
                  )}
                </>)}
              </div>
            ))}
          </>)}

          {/* ============================ LERNMATERIAL ==================== */}
          {tab === "material" && (<>
            {istLehrerin && (
              <div className="card">
                <h4>Lernmaterial für alle</h4>
                <p className="muted" style={{ margin: "0 0 8px", fontSize: ".84rem" }}>
                  Einmal hochladen – alle Schüler sehen es sofort in ihrem Klassenzimmer.
                </p>
                <input className="feld" placeholder="Kurze Beschreibung (optional), z. B. „Formelsammlung für die Klassenarbeit“"
                  value={materialText} onChange={(e) => setMaterialText(e.target.value)} maxLength={500} />
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 8, flexWrap: "wrap" }}>
                  <button className="btnA" disabled={beschaeftigt} onClick={() => materialInputRef.current?.click()}>Material hochladen</button>
                  <input ref={materialInputRef} type="file" style={{ display: "none" }}
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) void hochladen(f, "material"); e.target.value = ""; }} />
                  <span className="muted" style={{ fontSize: ".8rem" }}>max. 25 MB</span>
                </div>
              </div>
            )}
            {material.length === 0 && <div className="leer">{istLehrerin ? "Noch kein Lernmaterial – lade das erste hoch!" : "Hier findest du Lernmaterial von Kleana – für alle Schüler."}</div>}
            {material.map((f) => (
              <div key={f.id} className="card">
                <div className="dateizeile">
                  <span className="info"><b>{f.name}</b><br />
                    <span className="muted" style={{ fontSize: ".8rem" }}>{wannText(f.created_at)} · {groesseText(f.size)}</span></span>
                  <button className="btnG" onClick={() => void dateiOeffnen(f.id)}>Öffnen</button>
                  {istLehrerin && <button className="btnG" onClick={() => void dateiLoeschen(f.id, f.name)} aria-label="Löschen">🗑️</button>}
                </div>
                {f.beschreibung && <p style={{ margin: "8px 0 0" }}>{f.beschreibung}</p>}
              </div>
            ))}
          </>)}

          {/* ============================ DATEIEN ========================= */}
          {tab === "dateien" && (<>
            {istLehrerin && (
              <div className="card" style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                <button className="btnA" disabled={beschaeftigt} onClick={() => dateiInputRef.current?.click()}>⬆️ Datei hochladen</button>
                <select className="feld" style={{ width: "auto" }} value={uploadKat}
                  onChange={(e) => setUploadKat(e.target.value as "arbeitsblatt" | "hausaufgabe" | "sonstiges")}>
                  <option value="arbeitsblatt">Arbeitsblatt</option>
                  <option value="hausaufgabe">Hausaufgabe</option>
                  <option value="sonstiges">Sonstiges</option>
                </select>
                <span className="muted" style={{ fontSize: ".8rem" }}>nur für {schuelerName}</span>
                <input ref={dateiInputRef} type="file" style={{ display: "none" }}
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) void hochladen(f, "schueler"); e.target.value = ""; }} />
                <span className="muted" style={{ fontSize: ".8rem" }}>max. 25 MB</span>
              </div>
            )}
            <div style={{ display: "flex", gap: 6, marginBottom: 11, flexWrap: "wrap" }}>
              {(["alle", "arbeitsblatt", "hausaufgabe", "sonstiges"] as DateiKat[]).map((k) => (
                <button key={k} className={"katchip" + (dateiKat === k ? " on" : "")} onClick={() => setDateiKat(k)}>
                  {k === "alle" ? "Alle" : KAT_NAMEN[k]}
                </button>
              ))}
            </div>
            {dateien.filter((f) => dateiKat === "alle" || (f.category || "sonstiges") === dateiKat).length === 0 &&
              <div className="leer">{dateien.length === 0
                ? (istLehrerin ? "Noch keine Dateien. Lade das erste Arbeitsblatt hoch!" : "Kleana lädt hier Arbeitsblätter für dich hoch.")
                : "In dieser Ecke liegt noch nichts."}</div>}
            {dateien.filter((f) => dateiKat === "alle" || (f.category || "sonstiges") === dateiKat).map((f) => (
              <div key={f.id} className="card dateizeile">
                <span style={{ fontSize: "1.3rem" }}>📄</span>
                <span className="info"><b>{f.name}</b><br />
                  <span className="muted" style={{ fontSize: ".8rem" }}>
                    {wannText(f.created_at)} · {groesseText(f.size)} · {KAT_NAMEN[f.category || "sonstiges"]}
                  </span></span>
                <button className="btnG" onClick={() => void dateiOeffnen(f.id)}>Öffnen</button>
                {istLehrerin && <button className="btnG" onClick={() => void dateiLoeschen(f.id, f.name)} aria-label="Löschen">🗑️</button>}
              </div>
            ))}
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
          <div className="rechtsfuss"><a href="/datenschutz">Datenschutz</a> · <a href="/impressum">Impressum</a></div>
        </div></main>
      </div>}
    </div>
  );
}
