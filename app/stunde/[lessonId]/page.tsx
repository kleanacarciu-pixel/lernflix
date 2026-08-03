"use client";
// =============================================================================
// Virtuelles Klassenzimmer – /stunde/[lessonId]
// Links das Video (Daily.co), rechts die Werkzeuge: Live-Übungen, Tafel,
// Stundenzettel und Belohnungen. Am Handy: Video oben, Werkzeuge darunter.
// Login: nutzt dieselbe Sitzung wie der Terminkalender (localStorage).
// =============================================================================
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import DailyIframe, { type DailyCall } from "@daily-co/daily-js";
import KlassenzimmerPanel from "./panel";

// --- Markenfarben ("Lerne mit Anna": hell mit Türkis-Blau-Verlauf, wie der
// Terminkalender und die Website) --------------------------------------------
const TEAL = "#2BB3C0";
const BLAU = "#3E7BB6";
const VERLAUF = `linear-gradient(135deg,${TEAL},${BLAU})`;
const HELL = "#F4F6F7";       // Seitenhintergrund
const INK = "#1A1A1A";        // Text
const GEDAEMPFT = "#5F574F";  // gedämpfter Text
const LINIE = "rgba(26,26,26,.12)";
const VIDEO_BLAU = "#22365C"; // dunkler Hintergrund nur im Video-Bereich
const FONTS = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@700;800&display=swap";

// Dieselbe Sitzung wie der Terminkalender (app/kalender/page.tsx)
const LS_KEY = "lma_kal_session";
type Session = { token: string; refresh: string; role: "student" | "admin"; name: string };

function ladeSession(): Session | null {
  try { const raw = localStorage.getItem(LS_KEY); if (raw) return JSON.parse(raw) as Session; } catch { }
  return null;
}
function speichereSession(s: Session) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(s)); } catch { }
}

// Token abgelaufen? Einmal auffrischen und erneut versuchen.
async function mitRefresh(anfrage: (tok: string) => Promise<Response>): Promise<Response | null> {
  const session = ladeSession();
  if (!session?.token) return null;
  let res = await anfrage(session.token).catch(() => null);
  if (res && res.status === 401 && session.refresh) {
    const rf = await fetch("/api/kalender", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "refresh", refresh: session.refresh }),
    }).catch(() => null);
    const rd = (await rf?.json().catch(() => ({}))) as Record<string, unknown> | undefined;
    if (rd?.ok && typeof rd.token === "string") {
      speichereSession({ ...session, token: rd.token, refresh: String(rd.refresh) });
      res = await anfrage(rd.token).catch(() => null);
    }
  }
  return res;
}

type Zustand =
  | { art: "laden" }
  | { art: "login" }                       // nicht eingeloggt
  | { art: "video"; titel: string }        // Daily-Frame läuft
  | { art: "beendet"; titel: string }      // Stunde verlassen
  | { art: "fehler"; meldung: string };

const CSS = `
.stunde{min-height:100dvh;display:flex;flex-direction:column;background:${HELL};color:${INK};font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif}
.stunde .kopf{display:flex;align-items:center;gap:12px;flex-wrap:wrap;padding:11px 16px;background:#fff;flex:0 0 auto}
.stunde .kopf .marke{font-family:'Playfair Display',Georgia,serif;font-weight:800;font-size:1.05rem}
.stunde .kopf .titel{color:${GEDAEMPFT};font-size:.92rem}
.stunde .kopf .rechts{margin-left:auto;display:flex;gap:10px;align-items:center}
.stunde .kopf a{color:${GEDAEMPFT};font-size:.85rem;text-decoration:none;font-weight:600}
.stunde .kopf .wz{background:${VERLAUF};color:#fff;border:0;border-radius:999px;padding:7px 14px;font:inherit;font-weight:600;cursor:pointer;font-size:.85rem}
.stunde .gradlinie{height:3px;background:${VERLAUF};flex:0 0 auto}
.stunde .smain{flex:1 1 auto;display:flex;min-height:0}
.stunde .videowrap{flex:1 1 auto;min-height:0;min-width:0;display:flex;background:${VIDEO_BLAU}}
.stunde .panelwrap{flex:0 0 390px;min-height:0;display:flex;flex-direction:column;background:#fff;border-left:1px solid ${LINIE}}
@media(max-width:900px){
  .stunde .smain{flex-direction:column}
  .stunde .videowrap{flex:1 1 55%}
  .stunde .panelwrap{flex:1 1 45%;border-left:0;border-top:1px solid ${LINIE}}
}
.stunde .status{flex:1 1 auto;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;padding:24px;text-align:center;background:${HELL}}
.stunde .status h2{font-family:'Playfair Display',Georgia,serif;margin:0}
.stunde .status p{color:${GEDAEMPFT};max-width:420px;line-height:1.55}
.stunde .knopf{background:${VERLAUF};color:#fff;border:0;border-radius:12px;padding:12px 22px;font-weight:600;font-size:1rem;cursor:pointer;text-decoration:none;display:inline-block;font-family:inherit}
`;

export default function StundePage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const [zustand, setZustand] = useState<Zustand>({ art: "laden" });
  const [istLehrerin, setIstLehrerin] = useState(false);
  const [panelOffen, setPanelOffen] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<DailyCall | null>(null);
  // Verhindert doppelte Initialisierung (React Strict Mode ruft Effekte 2x auf)
  const laeuftRef = useRef(false);

  const frameZerstoeren = useCallback(() => {
    const f = frameRef.current;
    frameRef.current = null;
    if (f) { try { void f.destroy(); } catch { } }
  }, []);

  // API-Helfer fürs Klassenzimmer-Panel (Übungen/Tafel/Zettel/Belohnung)
  const apiKz = useCallback(async (action: string, params: Record<string, unknown> = {}): Promise<Record<string, unknown>> => {
    const res = await mitRefresh((tok) => fetch("/api/klassenzimmer", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, lessonId, token: tok, ...params }),
    }));
    if (!res) return { ok: false, error: "Keine Verbindung." };
    return (await res.json().catch(() => ({ ok: false, error: "Serverfehler." }))) as Record<string, unknown>;
  }, [lessonId]);

  // Beitritt: API fragen, dann Daily-Frame aufbauen
  const beitreten = useCallback(async () => {
    setZustand({ art: "laden" });
    frameZerstoeren();

    if (!ladeSession()?.token) { setZustand({ art: "login" }); return; }
    const res = await mitRefresh((tok) => fetch(`/api/lessons/${lessonId}/join`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${tok}` },
    }));
    if (!res) { setZustand({ art: "fehler", meldung: "Keine Verbindung zum Server. Bitte prüfe dein Internet." }); return; }
    if (res.status === 401) { setZustand({ art: "login" }); return; }

    const daten = (await res.json().catch(() => ({}))) as Record<string, unknown>;
    if (!daten.ok || typeof daten.roomUrl !== "string" || typeof daten.token !== "string") {
      setZustand({ art: "fehler", meldung: String(daten.error || "Beitritt fehlgeschlagen.") });
      return;
    }
    const titel = String(daten.lessonTitle || "Deine Stunde");
    setIstLehrerin(daten.isTeacher === true);

    // Der Container ist immer im DOM (nur unsichtbar geschaltet), daher ist
    // die Referenz hier garantiert vorhanden – kein Warten auf einen Render.
    const el = containerRef.current;
    if (!el) { setZustand({ art: "fehler", meldung: "Die Seite konnte nicht aufgebaut werden. Bitte lade sie neu." }); return; }
    if (frameRef.current) return;
    setZustand({ art: "video", titel });

    const frame = DailyIframe.createFrame(el, {
      showLeaveButton: true,
      showFullscreenButton: true,
      iframeStyle: { width: "100%", height: "100%", border: "0", display: "block" },
      // Daily-Oberfläche im hellen "Lerne mit Anna"-Design; nur die Video-
      // Fläche selbst bleibt dunkelblau (Kamerabilder wirken so am besten)
      theme: {
        colors: {
          accent: TEAL,
          accentText: "#FFFFFF",
          background: "#FFFFFF",
          backgroundAccent: HELL,
          baseText: INK,
          border: "#E3E6EA",
          mainAreaBg: VIDEO_BLAU,
          mainAreaBgAccent: BLAU,
          mainAreaText: "#FFFFFF",
          supportiveText: GEDAEMPFT,
        },
      },
    });
    frameRef.current = frame;

    frame.on("left-meeting", () => {
      frameZerstoeren();
      setZustand({ art: "beendet", titel });
    });
    frame.on("error", (ev) => {
      frameZerstoeren();
      const grund = ev?.errorMsg ? String(ev.errorMsg) : "Die Video-Verbindung wurde unterbrochen.";
      setZustand({ art: "fehler", meldung: grund });
    });

    try {
      await frame.join({ url: daten.roomUrl, token: daten.token });
    } catch {
      frameZerstoeren();
      setZustand({ art: "fehler", meldung: "Der Beitritt zum Videoraum hat nicht geklappt. Bitte versuche es noch einmal." });
    }
  }, [lessonId, frameZerstoeren]);

  useEffect(() => {
    if (laeuftRef.current) return; // Strict-Mode-Doppellauf abfangen
    laeuftRef.current = true;
    void beitreten();
    return () => {
      laeuftRef.current = false;
      frameZerstoeren(); // Frame beim Verlassen der Seite aufräumen
    };
  }, [beitreten, frameZerstoeren]);

  const titel = zustand.art === "video" || zustand.art === "beendet" ? zustand.titel : "";
  const videoAktiv = zustand.art === "video";

  return (
    <div className="stunde">
      <link rel="stylesheet" href={FONTS} />
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* Kopfzeile */}
      <header className="kopf">
        <span className="marke">🐙 Lerne mit Anna</span>
        {titel && <span className="titel">· {titel}</span>}
        <span className="rechts">
          {(videoAktiv || zustand.art === "beendet") && (
            <button className="wz" onClick={() => setPanelOffen(!panelOffen)}>
              {panelOffen ? "🧰 Werkzeuge ausblenden" : "🧰 Werkzeuge"}
            </button>
          )}
          <a href="/kalender">← Zum Kalender</a>
        </span>
      </header>
      <div className="gradlinie" />

      {/* Video links, Werkzeuge rechts (am Handy untereinander) */}
      <main className="smain">
        <div className="videowrap">
          {/* Der Video-Container bleibt immer im DOM (nur unsichtbar), damit
              der Daily-Frame jederzeit andocken kann. */}
          <div ref={containerRef} style={{ flex: "1 1 auto", minHeight: 0, display: videoAktiv ? "block" : "none" }} />

          {!videoAktiv && (
            <div className="status">
              {zustand.art === "laden" && (<>
                <div style={{ fontSize: "2rem" }}>🐙</div>
                <p>Dein Klassenzimmer wird vorbereitet …</p>
              </>)}
              {zustand.art === "login" && (<>
                <h2 style={{ margin: 0 }}>Bitte zuerst einloggen</h2>
                <p>Melde dich im Terminkalender mit deinen Zugangsdaten an und öffne diesen Link danach noch einmal.</p>
                <a href="/kalender" className="knopf">Zum Login</a>
              </>)}
              {zustand.art === "beendet" && (<>
                <h2 style={{ margin: 0 }}>Du hast die Stunde verlassen</h2>
                <p>Bis zum nächsten Mal! 👋</p>
                <button className="knopf" onClick={() => void beitreten()}>Wieder beitreten</button>
              </>)}
              {zustand.art === "fehler" && (<>
                <h2 style={{ margin: 0 }}>Ups, das hat nicht geklappt</h2>
                <p>{(zustand as { meldung: string }).meldung}</p>
                <button className="knopf" onClick={() => void beitreten()}>Neu versuchen</button>
              </>)}
            </div>
          )}
        </div>

        {/* Panel auch nach dem Verlassen zeigen: Stundenzettel und Punkte
            bleiben so für Schüler lesbar */}
        {(videoAktiv || zustand.art === "beendet") && panelOffen && (
          <aside className="panelwrap">
            <KlassenzimmerPanel api={apiKz} istLehrerin={istLehrerin} />
          </aside>
        )}
      </main>
    </div>
  );
}
