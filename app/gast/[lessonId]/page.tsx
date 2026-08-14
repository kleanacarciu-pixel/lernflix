"use client";
// =============================================================================
// Gast-Beitritt – /gast/[lessonId]?k=<schluessel>
// Für Probestunden und Masterclasses: Kleana verschickt den Link, der Gast
// tippt nur seinen Namen ein und ist drin – ganz ohne Konto oder Login.
// Optik wie die Live-Stunde (hell, Türkis-Blau-Verlauf).
// =============================================================================
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import DailyIframe, { type DailyCall } from "@daily-co/daily-js";

const TEAL = "#2BB3C0";
const BLAU = "#3E7BB6";
const VERLAUF = `linear-gradient(135deg,${TEAL},${BLAU})`;
const HELL = "#F4F6F7";
const INK = "#1A1A1A";
const GEDAEMPFT = "#5F574F";
const VIDEO_BLAU = "#22365C";
const FONTS = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@700;800&display=swap";

const CSS = `
.gast{min-height:100dvh;display:flex;flex-direction:column;background:${HELL};color:${INK};font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif}
.gast .kopf{display:flex;align-items:center;gap:12px;padding:11px 16px;background:#fff;flex:0 0 auto}
.gast .kopf .marke{font-family:'Playfair Display',Georgia,serif;font-weight:800;font-size:1.05rem}
.gast .kopf .titel{color:${GEDAEMPFT};font-size:.92rem}
.gast .gradlinie{height:3px;background:${VERLAUF};flex:0 0 auto}
.gast .videowrap{flex:1 1 auto;min-height:0;display:flex;background:${VIDEO_BLAU}}
.gast .status{flex:1 1 auto;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;padding:24px;text-align:center;background:${HELL}}
.gast .status h2{font-family:'Playfair Display',Georgia,serif;margin:0}
.gast .status p{color:${GEDAEMPFT};max-width:420px;line-height:1.55;margin:0}
.gast .feld{width:100%;max-width:320px;background:#fff;border:1.5px solid rgba(26,26,26,.18);border-radius:12px;color:${INK};font:inherit;font-size:1rem;padding:12px 14px;text-align:center}
.gast .feld:focus{outline:none;border-color:${TEAL}}
.gast .knopf{background:${VERLAUF};color:#fff;border:0;border-radius:12px;padding:12px 24px;font-weight:600;font-size:1rem;cursor:pointer;font-family:inherit}
.gast .knopf[disabled]{opacity:.55;cursor:default}
.gast .fehlerbox{background:#FDEEEC;color:#C03A31;border:1px solid rgba(192,58,49,.3);border-radius:11px;padding:10px 14px;font-size:.9rem;max-width:420px}
`;

type Zustand =
  | { art: "laden" }
  | { art: "name"; titel: string; wann: string; offen: boolean; vorbei: boolean; zeitlos: boolean }
  | { art: "video"; titel: string }
  | { art: "beendet"; titel: string }
  | { art: "fehler"; meldung: string };

const pad = (n: number) => String(n).padStart(2, "0");
function wannText(iso: string): string {
  const d = new Date(iso);
  const tage = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
  return `${tage[d.getDay()]} ${pad(d.getDate())}.${pad(d.getMonth() + 1)}. um ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function GastInhalt() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const suchParams = useSearchParams();
  const k = suchParams.get("k") || "";
  const [zustand, setZustand] = useState<Zustand>({ art: "laden" });
  const [name, setName] = useState("");
  const [fehlerText, setFehlerText] = useState("");
  const [beschaeftigt, setBeschaeftigt] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<DailyCall | null>(null);
  const geladenRef = useRef(false);

  const api = useCallback(async (action: string, params: Record<string, unknown> = {}): Promise<Record<string, unknown>> => {
    const res = await fetch("/api/gast", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, lessonId, k, ...params }),
    }).catch(() => null);
    if (!res) return { ok: false, error: "Keine Verbindung. Bitte prüfe dein Internet." };
    return (await res.json().catch(() => ({ ok: false, error: "Serverfehler." }))) as Record<string, unknown>;
  }, [lessonId, k]);

  const frameZerstoeren = useCallback(() => {
    const f = frameRef.current;
    frameRef.current = null;
    if (f) { try { void f.destroy(); } catch { } }
  }, []);

  // Beim Öffnen: Infos zum Call holen (Titel, Zeit, offen?)
  useEffect(() => {
    if (geladenRef.current) return;
    geladenRef.current = true;
    (async () => {
      const d = await api("info");
      if (d.ok) {
        setZustand({
          art: "name", titel: String(d.titel || "Video-Call"),
          wann: wannText(String(d.startsAt)), offen: d.offen === true, vorbei: d.vorbei === true,
          zeitlos: d.zeitlos === true,
        });
      } else {
        setZustand({ art: "fehler", meldung: String(d.error || "Dieser Link ist ungültig.") });
      }
    })();
    return () => { geladenRef.current = false; frameZerstoeren(); };
  }, [api, frameZerstoeren]);

  async function beitreten() {
    const n = name.trim();
    if (n.length < 2 || beschaeftigt) return;
    setBeschaeftigt(true);
    setFehlerText("");
    const d = await api("join", { name: n });
    setBeschaeftigt(false);
    if (!d.ok || typeof d.roomUrl !== "string" || typeof d.token !== "string") {
      setFehlerText(String(d.error || "Beitritt fehlgeschlagen. Bitte versuche es noch einmal."));
      return;
    }
    const titel = String(d.titel || "Video-Call");
    const el = containerRef.current;
    if (!el) { setFehlerText("Die Seite konnte nicht aufgebaut werden. Bitte lade sie neu."); return; }
    if (frameRef.current) return;
    setZustand({ art: "video", titel });

    const frame = DailyIframe.createFrame(el, {
      showLeaveButton: true,
      showFullscreenButton: true,
      iframeStyle: { width: "100%", height: "100%", border: "0", display: "block" },
      theme: {
        colors: {
          accent: TEAL, accentText: "#FFFFFF", background: "#FFFFFF", backgroundAccent: HELL,
          baseText: INK, border: "#E3E6EA", mainAreaBg: VIDEO_BLAU, mainAreaBgAccent: BLAU,
          mainAreaText: "#FFFFFF", supportiveText: GEDAEMPFT,
        },
      },
    });
    frameRef.current = frame;
    frame.on("left-meeting", () => { frameZerstoeren(); setZustand({ art: "beendet", titel }); });
    frame.on("error", () => { frameZerstoeren(); setZustand({ art: "fehler", meldung: "Die Video-Verbindung wurde unterbrochen. Bitte lade die Seite neu." }); });
    try {
      await frame.join({ url: d.roomUrl, token: d.token });
    } catch {
      frameZerstoeren();
      setZustand({ art: "fehler", meldung: "Der Beitritt hat nicht geklappt. Bitte lade die Seite neu und versuche es noch einmal." });
    }
  }

  const videoAktiv = zustand.art === "video";
  const titel = zustand.art === "video" || zustand.art === "beendet" || zustand.art === "name" ? zustand.titel : "";

  return (
    <div className="gast">
      <link rel="stylesheet" href={FONTS} />
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <header className="kopf">
        <span className="marke">🐙 Lerne mit Anna</span>
        {titel && <span className="titel">· {titel}</span>}
      </header>
      <div className="gradlinie" />
      <div className="videowrap">
        <div ref={containerRef} style={{ flex: "1 1 auto", minHeight: 0, display: videoAktiv ? "block" : "none" }} />
        {!videoAktiv && (
          <div className="status">
            {zustand.art === "laden" && (<><div style={{ fontSize: "2rem" }}>🐙</div><p>Dein Video-Call wird vorbereitet …</p></>)}
            {zustand.art === "name" && (<>
              <div style={{ fontSize: "2rem" }}>🎥</div>
              <h2>{zustand.titel}</h2>
              {!zustand.zeitlos && <p>{zustand.wann}</p>}
              {zustand.vorbei ? <p><b>Dieser Call ist schon vorbei.</b></p> : (<>
                <p>Sag uns kurz deinen Namen, dann kann es losgehen:</p>
                <input className="feld" placeholder="Dein Name" value={name} maxLength={40}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") void beitreten(); }} />
                <button className="knopf" disabled={beschaeftigt || name.trim().length < 2} onClick={() => void beitreten()}>
                  {beschaeftigt ? "Einen Moment …" : "Jetzt beitreten"}
                </button>
                {!zustand.offen && <p style={{ fontSize: ".85rem" }}>Der Call öffnet 15 Minuten vor Beginn – du kannst es dann hier direkt versuchen.</p>}
              </>)}
              {fehlerText && <div className="fehlerbox">{fehlerText}</div>}
            </>)}
            {zustand.art === "beendet" && (<>
              <h2>Danke fürs Dabeisein! 👋</h2>
              <p>Du kannst dieses Fenster jetzt schließen.</p>
              <button className="knopf" onClick={() => window.location.reload()}>Wieder beitreten</button>
            </>)}
            {zustand.art === "fehler" && (<>
              <h2>Ups, das hat nicht geklappt</h2>
              <p>{(zustand as { meldung: string }).meldung}</p>
              <button className="knopf" onClick={() => window.location.reload()}>Neu laden</button>
            </>)}
          </div>
        )}
      </div>
    </div>
  );
}

export default function GastPage() {
  // useSearchParams braucht in Next eine Suspense-Grenze
  return (
    <Suspense fallback={<div style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F4F6F7" }}>🐙</div>}>
      <GastInhalt />
    </Suspense>
  );
}
