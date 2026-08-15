"use client";
// =============================================================================
// Live-Stunde (Daily.co) als wiederverwendbarer Baustein:
//  - eigenständig unter /stunde/[lessonId] (Deep-Link aus dem Kalender)
//  - eingebettet im Klassenzimmer (/klassenzimmer), im Zoom-Stil im selben
//    Fenster – Prop `eingebettet` + `onSchliessen` zum Zurückkehren
// Links das Video, rechts die Werkzeuge: Live-Übungen, Tafel, Stundenzettel
// und Belohnungen. Am Handy: Video oben, Werkzeuge darunter.
// Login: nutzt dieselbe Sitzung wie der Terminkalender (localStorage).
// =============================================================================
import { useCallback, useEffect, useRef, useState } from "react";
import DailyIframe, { type DailyCall } from "@daily-co/daily-js";
import KlassenzimmerPanel from "./[lessonId]/panel";
import Tafel from "./tafel";

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
.stunde.eingebettet{min-height:0;flex:1 1 auto;min-width:0}
.stunde .kopf{display:flex;align-items:center;gap:12px;flex-wrap:wrap;padding:11px 16px;background:#fff;flex:0 0 auto}
.stunde .kopf .marke{font-family:'Playfair Display',Georgia,serif;font-weight:800;font-size:1.05rem}
.stunde .kopf .titel{color:${GEDAEMPFT};font-size:.92rem}
.stunde .kopf .rechts{margin-left:auto;display:flex;gap:10px;align-items:center}
.stunde .kopf a{color:${GEDAEMPFT};font-size:.85rem;text-decoration:none;font-weight:600}
.stunde .kopf .wz{background:${VERLAUF};color:#fff;border:0;border-radius:999px;padding:7px 14px;font:inherit;font-weight:600;cursor:pointer;font-size:.85rem}
.stunde .kopf .wz.aktiv{background:#B4491F}
.stunde .kopf .wz.rot{background:#B4491F}
.stunde .kopf .zurueck{background:none;border:0;color:${GEDAEMPFT};font:inherit;font-size:.85rem;font-weight:600;cursor:pointer;padding:0}
.stunde .gradlinie{height:3px;background:${VERLAUF};flex:0 0 auto}
.stunde .smain{flex:1 1 auto;display:flex;min-height:0}
.stunde .videowrap{flex:1 1 auto;min-height:0;min-width:0;display:flex;background:${VIDEO_BLAU};position:relative}
.stunde .tafelwrap{position:absolute;inset:0;z-index:5;flex-direction:column;background:#EDEFF2}
.stunde .tafelwrap.voll{position:fixed;z-index:60}
.stunde .tafelflaeche{position:relative;flex:1 1 auto;min-height:0;overflow:hidden}
.stunde .tpille{position:absolute;display:flex;align-items:center;gap:4px;background:rgba(255,255,255,.96);border:1px solid rgba(26,26,26,.08);border-radius:16px;box-shadow:0 4px 16px rgba(26,26,26,.14);padding:5px 8px;z-index:3;max-width:min(92%,860px)}
.stunde .t-obenlinks{top:10px;left:10px}
.stunde .t-mitte{top:10px;left:50%;transform:translateX(-50%);flex-wrap:wrap;justify-content:center}
.stunde .t-obenrechts{top:10px;right:10px}
.stunde .t-untenlinks{bottom:12px;left:10px}
.stunde .t-untenrechts{bottom:12px;right:10px}
@media(max-width:900px){
  .stunde .t-mitte{top:56px;left:8px;right:8px;transform:none;max-width:none}
  .stunde .t-obenlinks{top:10px}
}
.stunde .tkn{background:transparent;color:${INK};border:0;border-radius:11px;padding:6px 9px;font:inherit;font-size:.95rem;font-weight:600;cursor:pointer;white-space:nowrap;line-height:1}
.stunde .tkn:hover{background:#F0F2F4}
.stunde .tkn.on{background:#DFF3F5;box-shadow:inset 0 0 0 1.5px ${TEAL}}
.stunde .tkn:disabled{opacity:.35;cursor:default}
.stunde .ttrenn{width:1px;height:22px;background:${LINIE};margin:0 3px;flex:0 0 auto}
.stunde .tfarbe{width:24px;height:24px;border-radius:50%;border:2px solid rgba(26,26,26,.12);cursor:pointer;padding:0;flex:0 0 auto}
.stunde .tfarbe.on{border-color:${INK};transform:scale(1.18)}
.stunde .tdicke{display:flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:9px;border:1px solid transparent;background:transparent;cursor:pointer;padding:0}
.stunde .tdicke span{background:${INK};border-radius:50%;display:block}
.stunde .tdicke.on{border-color:${TEAL};background:#E9F7F8}
.stunde .tpapier{font:inherit;font-size:.82rem;font-weight:600;border:0;border-radius:9px;padding:6px 4px;background:transparent;color:${INK};cursor:pointer}
.stunde .tinfo{font-size:.86rem;font-weight:600;color:${GEDAEMPFT};padding:2px 6px}
.stunde .tseite{font-size:.86rem;padding:0 2px}
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
.stunde .knopf.g{background:#ECEFF0;color:${INK};box-shadow:none}
`;

export default function LiveStunde({ lessonId, eingebettet = false, onSchliessen }: {
  lessonId: string;
  eingebettet?: boolean;
  onSchliessen?: () => void;
}) {
  const [zustand, setZustand] = useState<Zustand>({ art: "laden" });
  const [istLehrerin, setIstLehrerin] = useState(false);
  const [panelOffen, setPanelOffen] = useState(true);
  const [teiltBildschirm, setTeiltBildschirm] = useState(false);
  const [tafelOffen, setTafelOffen] = useState(false);
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
      setTeiltBildschirm(false);
      setZustand({ art: "beendet", titel });
    });
    // Eigener "Bildschirm teilen"-Knopf in der Kopfzeile spiegelt den Zustand
    frame.on("local-screen-share-started", () => setTeiltBildschirm(true));
    frame.on("local-screen-share-stopped", () => setTeiltBildschirm(false));
    frame.on("local-screen-share-canceled", () => setTeiltBildschirm(false));
    frame.on("error", (ev) => {
      frameZerstoeren();
      const grund = ev?.errorMsg ? String(ev.errorMsg) : "Die Video-Verbindung wurde unterbrochen.";
      setZustand({ art: "fehler", meldung: grund });
    });

    try {
      await frame.join({ url: daten.roomUrl, token: daten.token });
      // Bildschirm-Teilen auf SCHÄRFE optimieren (statt flüssiger Bewegung):
      // Wichtig für geteilte Notizen/Aufgaben vom iPad – Text bleibt gestochen
      // scharf und wird nicht körnig/verpixelt.
      try { await frame.updateSendSettings({ screenVideo: "detail-optimized" }); } catch { }
    } catch {
      frameZerstoeren();
      setZustand({ art: "fehler", meldung: "Der Beitritt zum Videoraum hat nicht geklappt. Bitte versuche es noch einmal." });
    }
  }, [lessonId, frameZerstoeren]);

  // Call für ALLE beenden (nur Kleana): Server löscht den Daily-Raum,
  // alle Teilnehmer werden getrennt – nicht nur das eigene Fenster
  const fuerAlleBeenden = useCallback(async () => {
    if (!window.confirm("Den Call wirklich für ALLE beenden? Alle Teilnehmer werden getrennt.")) return;
    const d = await apiKz("endCall");
    if (!d.ok) { window.alert(String(d.error || "Beenden fehlgeschlagen. Bitte noch einmal versuchen.")); return; }
    frameZerstoeren();
    setTeiltBildschirm(false);
    setZustand((z) => ({ art: "beendet", titel: z.art === "video" || z.art === "beendet" ? z.titel : "Deine Stunde" }));
  }, [apiKz, frameZerstoeren]);

  // Bildschirm teilen starten/beenden – immer sichtbar in der Kopfzeile,
  // damit der Knopf nie im "…"-Menü der Videoleiste verschwindet
  const bildschirmTeilen = useCallback(() => {
    const f = frameRef.current;
    if (!f) return;
    if (teiltBildschirm) { f.stopScreenShare(); return; }
    const unterstuetzt = typeof navigator !== "undefined"
      && !!navigator.mediaDevices
      && "getDisplayMedia" in navigator.mediaDevices;
    if (!unterstuetzt) {
      window.alert("Dieses Gerät erlaubt das Bildschirm-Teilen im Browser leider nicht. Tipp: iPadOS/iOS aktualisieren oder vom Laptop/PC aus teilen.");
      return;
    }
    f.startScreenShare();
  }, [teiltBildschirm]);

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
    <div className={"stunde" + (eingebettet ? " eingebettet" : "")}>
      <link rel="stylesheet" href={FONTS} />
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* Kopfzeile: eigenständig mit Marke + Kalender-Link, eingebettet nur
          mit Titel + Knöpfen + "Schließen" zurück ins Klassenzimmer */}
      <header className="kopf">
        {!eingebettet && <span className="marke">🐙 Lerne mit Anna</span>}
        {titel && <span className="titel">{eingebettet ? titel : `· ${titel}`}</span>}
        <span className="rechts">
          {videoAktiv && (
            <button className={"wz" + (tafelOffen ? " aktiv" : "")} onClick={() => setTafelOffen(!tafelOffen)}>
              {tafelOffen ? "🖊️ Tafel schließen" : "🖊️ Tafel"}
            </button>
          )}
          {videoAktiv && (
            <button className={"wz" + (teiltBildschirm ? " aktiv" : "")} onClick={bildschirmTeilen}>
              {teiltBildschirm ? "🛑 Teilen beenden" : "🖥️ Bildschirm teilen"}
            </button>
          )}
          {(videoAktiv || zustand.art === "beendet") && (
            <button className="wz" onClick={() => setPanelOffen(!panelOffen)}>
              {panelOffen ? "🧰 Werkzeuge ausblenden" : "🧰 Werkzeuge"}
            </button>
          )}
          {videoAktiv && istLehrerin && (
            <button className="wz rot" onClick={() => void fuerAlleBeenden()}>☎️ Für alle beenden</button>
          )}
          {eingebettet
            ? <button className="zurueck" onClick={onSchliessen}>✕ Schließen</button>
            : <a href="/kalender">← Zum Kalender</a>}
        </span>
      </header>
      <div className="gradlinie" />

      {/* Video links, Werkzeuge rechts (am Handy untereinander) */}
      <main className="smain">
        <div className="videowrap">
          {/* Der Video-Container bleibt immer im DOM (nur unsichtbar), damit
              der Daily-Frame jederzeit andocken kann. */}
          <div ref={containerRef} style={{ flex: "1 1 auto", minHeight: 0, display: videoAktiv ? "block" : "none" }} />

          {/* Live-Tafel: bleibt eingehängt (auch geschlossen), damit kein
              Strich verloren geht; Video/Audio laufen dahinter weiter */}
          {videoAktiv && (
            <Tafel frameRef={frameRef} istLehrerin={istLehrerin} api={apiKz}
              offen={tafelOffen} setOffen={setTafelOffen} />
          )}

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
                {eingebettet && <button className="knopf g" onClick={onSchliessen}>← Zurück zum Klassenzimmer</button>}
              </>)}
              {zustand.art === "fehler" && (<>
                <h2 style={{ margin: 0 }}>Ups, das hat nicht geklappt</h2>
                <p>{(zustand as { meldung: string }).meldung}</p>
                <button className="knopf" onClick={() => void beitreten()}>Neu versuchen</button>
                {eingebettet && <button className="knopf g" onClick={onSchliessen}>← Zurück zum Klassenzimmer</button>}
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
