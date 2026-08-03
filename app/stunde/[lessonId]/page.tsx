"use client";
// =============================================================================
// Virtuelles Klassenzimmer – /stunde/[lessonId]
// Bettet den Daily.co-Videoraum im "Lerne mit Anna"-Design ein.
// Login: nutzt dieselbe Sitzung wie der Terminkalender (localStorage).
// =============================================================================
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import DailyIframe, { type DailyCall } from "@daily-co/daily-js";

// --- Markenfarben -----------------------------------------------------------
const GELB = "#FFC53D";
const TINTE = "#171D42";
const TINTE_HELL = "#232B5D";
const TEXT_GEDAEMPFT = "#AEB4D8";

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

type Zustand =
  | { art: "laden" }
  | { art: "login" }                       // nicht eingeloggt
  | { art: "video"; titel: string }        // Daily-Frame läuft
  | { art: "beendet"; titel: string }      // Stunde verlassen
  | { art: "fehler"; meldung: string };

export default function StundePage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const [zustand, setZustand] = useState<Zustand>({ art: "laden" });
  const containerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<DailyCall | null>(null);
  // Verhindert doppelte Initialisierung (React Strict Mode ruft Effekte 2x auf)
  const laeuftRef = useRef(false);

  const frameZerstoeren = useCallback(() => {
    const f = frameRef.current;
    frameRef.current = null;
    if (f) { try { void f.destroy(); } catch { } }
  }, []);

  // Beitritt: API fragen, dann Daily-Frame aufbauen
  const beitreten = useCallback(async () => {
    setZustand({ art: "laden" });
    frameZerstoeren();

    const session = ladeSession();
    if (!session?.token) { setZustand({ art: "login" }); return; }

    // Join-Daten vom Server holen (mit einmaligem Token-Refresh bei 401)
    const anfrage = async (tok: string) =>
      fetch(`/api/lessons/${lessonId}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${tok}` },
      });
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
    if (!res) { setZustand({ art: "fehler", meldung: "Keine Verbindung zum Server. Bitte prüfe dein Internet." }); return; }
    if (res.status === 401) { setZustand({ art: "login" }); return; }

    const daten = (await res.json().catch(() => ({}))) as Record<string, unknown>;
    if (!daten.ok || typeof daten.roomUrl !== "string" || typeof daten.token !== "string") {
      setZustand({ art: "fehler", meldung: String(daten.error || "Beitritt fehlgeschlagen.") });
      return;
    }
    const titel = String(daten.lessonTitle || "Deine Stunde");

    // Container muss im DOM sein, bevor der Frame hinein kann
    setZustand({ art: "video", titel });
    // Einen Render-Tick warten, bis containerRef gesetzt ist
    await new Promise((r) => setTimeout(r, 0));
    const el = containerRef.current;
    if (!el || frameRef.current) return;

    const frame = DailyIframe.createFrame(el, {
      showLeaveButton: true,
      showFullscreenButton: true,
      iframeStyle: { width: "100%", height: "100%", border: "0", display: "block" },
      // Daily-Oberfläche in den "Lerne mit Anna"-Markenfarben
      theme: {
        colors: {
          accent: GELB,
          accentText: TINTE,
          background: TINTE,
          backgroundAccent: TINTE_HELL,
          baseText: "#FFFFFF",
          border: TINTE_HELL,
          mainAreaBg: TINTE,
          mainAreaBgAccent: TINTE_HELL,
          mainAreaText: "#FFFFFF",
          supportiveText: TEXT_GEDAEMPFT,
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

  return (
    <div style={{
      minHeight: "100dvh", display: "flex", flexDirection: "column",
      background: TINTE, color: "#fff",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    }}>
      {/* Kopfzeile */}
      <header style={{
        display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap",
        padding: "12px 18px", background: TINTE_HELL, borderBottom: `2px solid ${GELB}`,
      }}>
        <span style={{ fontWeight: 800, fontSize: "1.05rem" }}>🐙 Lerne mit Anna</span>
        {titel && <span style={{ color: TEXT_GEDAEMPFT, fontSize: ".95rem" }}>· {titel}</span>}
        <a href="/kalender" style={{ marginLeft: "auto", color: TEXT_GEDAEMPFT, fontSize: ".85rem", textDecoration: "none" }}>
          ← Zum Kalender
        </a>
      </header>

      {/* Video-Bereich füllt den restlichen Platz */}
      <main style={{ flex: "1 1 auto", display: "flex", minHeight: 0 }}>
        {zustand.art === "video" && (
          <div ref={containerRef} style={{ flex: "1 1 auto", minHeight: 0 }} />
        )}

        {zustand.art !== "video" && (
          <div style={{
            flex: "1 1 auto", display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", gap: 16, padding: 24, textAlign: "center",
          }}>
            {zustand.art === "laden" && (
              <>
                <div style={{ fontSize: "2rem" }}>🐙</div>
                <p style={{ color: TEXT_GEDAEMPFT }}>Dein Klassenzimmer wird vorbereitet …</p>
              </>
            )}

            {zustand.art === "login" && (
              <>
                <h2 style={{ margin: 0 }}>Bitte zuerst einloggen</h2>
                <p style={{ color: TEXT_GEDAEMPFT, maxWidth: 420 }}>
                  Melde dich im Terminkalender mit deinen Zugangsdaten an und öffne diesen Link danach noch einmal.
                </p>
                <a href="/kalender" style={knopfStil}>Zum Login</a>
              </>
            )}

            {zustand.art === "beendet" && (
              <>
                <h2 style={{ margin: 0 }}>Du hast die Stunde verlassen</h2>
                <p style={{ color: TEXT_GEDAEMPFT }}>Bis zum nächsten Mal! 👋</p>
                <button style={knopfStil} onClick={() => void beitreten()}>Wieder beitreten</button>
              </>
            )}

            {zustand.art === "fehler" && (
              <>
                <h2 style={{ margin: 0 }}>Ups, das hat nicht geklappt</h2>
                <p style={{ color: TEXT_GEDAEMPFT, maxWidth: 420 }}>{zustand.meldung}</p>
                <button style={knopfStil} onClick={() => void beitreten()}>Neu versuchen</button>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

// Gelber Marken-Knopf (für Links und Buttons gleich)
const knopfStil: React.CSSProperties = {
  background: GELB, color: TINTE, border: 0, borderRadius: 12,
  padding: "12px 22px", fontWeight: 700, fontSize: "1rem",
  cursor: "pointer", textDecoration: "none", display: "inline-block",
};
