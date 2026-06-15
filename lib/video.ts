// lib/video.ts — Phase 2: aus einem geprueften Paket ein 9:16-MP4 rendern.
// Nur serverseitig nutzen (verwendet JSON2VIDEO_API_KEY).
//
// JSON2Video v2-API:
//   POST https://api.json2video.com/v2/movies        (Header x-api-key) -> { project }
//   GET  https://api.json2video.com/v2/movies/?project=ID -> { movie: { status, url } }
// status: "done" -> fertig (movie.url ist das MP4), "error" -> fehlgeschlagen.

import type { Paket } from "@/lib/brain";

const J2V_BASE = "https://api.json2video.com/v2/movies";

// Deutsche, natuerlich klingende, weibliche Stimme (Azure) — passend zur Persona "Anna".
const VOICE = "de-DE-KatjaNeural";
const VOICE_MODEL = "azure";

// Markenfarben: heller, ruhiger Hintergrund + dunkler Text fuer Kontrast.
const BG = "#EAF3FF"; // Babyblau
const INK = "#15233A"; // dunkel, gut lesbar
const ACCENT = "#C77B96"; // Rosé (Untertitel-Highlight)

export type MovieSpec = Record<string, unknown>;

function round(n: number): number {
  return Math.round(n * 100) / 100;
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

// Grobe Schaetzung der Voiceover-Laenge, um die onScreen-Overlays zeitlich zu
// verteilen. Bewusst leicht knapp (Stimme bestimmt die echte Laenge).
function schaetzeSekunden(text: string): number {
  const woerter = text.trim().split(/\s+/).filter(Boolean).length;
  const sek = woerter / 2.6; // ~deutsche TTS-Sprechgeschwindigkeit
  return Math.max(12, Math.min(55, sek));
}

/**
 * Baut das JSON2Video-"Movie"-Objekt fuer ein Paket:
 * - 9:16, 1080x1920, heller Markenhintergrund
 * - deutsche weibliche Voiceover-Stimme spricht hook + skript
 * - hook als grosser Titel in den ersten ~3 Sekunden
 * - onScreen-Texte als Overlays, zeitlich verteilt
 * - automatische deutsche Untertitel (unten, gross)
 */
export function buildMovieSpec(paket: Paket): MovieSpec {
  const narration = `${paket.hook} ${paket.skript}`.trim();
  const gesamt = schaetzeSekunden(narration);
  const hookDauer = Math.min(3.5, gesamt * 0.25);

  // onScreen-Overlays nach dem Hook gleichmaessig ueber die Restzeit verteilen.
  const items = paket.onScreen;
  const ab = hookDauer;
  const spanne = Math.max(2, gesamt - ab);
  const slice = items.length > 0 ? spanne / items.length : spanne;

  const onScreenElemente = items.map((text, i) => ({
    type: "text",
    text,
    start: round(ab + i * slice),
    duration: round(slice),
    position: "center-center",
    width: 940,
    settings: {
      "font-family": "Montserrat",
      "font-size": 64,
      "font-weight": 700,
      "font-color": INK,
      "text-align": "center",
      "vertical-align": "center",
      "line-height": 1.25,
    },
  }));

  const hookElement = {
    type: "text",
    text: paket.hook,
    start: 0,
    duration: round(hookDauer),
    position: "center-center",
    width: 980,
    settings: {
      "font-family": "Montserrat",
      "font-size": 92,
      "font-weight": 800,
      "font-color": INK,
      "text-align": "center",
      "vertical-align": "center",
      "line-height": 1.2,
    },
  };

  // Voiceover im Scene-Level: dadurch richtet sich die Scene-Laenge (duration -1)
  // automatisch nach der Sprechdauer.
  const voiceElement = {
    type: "voice",
    text: narration,
    voice: VOICE,
    model: VOICE_MODEL,
    start: 0,
  };

  // Untertitel duerfen nur auf Movie-Ebene stehen und gelten fuer den ganzen Film.
  const subtitlesElement = {
    type: "subtitles",
    language: "de",
    settings: {
      style: "classic",
      "font-family": "Montserrat",
      "font-size": 64,
      "word-color": ACCENT,
      "line-color": INK,
      "outline-color": "#FFFFFF",
      "outline-width": 4,
      position: "bottom-center",
      "max-words-per-line": 6,
    },
  };

  return {
    resolution: "custom",
    width: 1080,
    height: 1920,
    quality: "high",
    scenes: [
      {
        "background-color": BG,
        duration: -1, // auto = Laenge der Narration
        elements: [voiceElement, hookElement, ...onScreenElemente],
      },
    ],
    elements: [subtitlesElement],
  };
}

type SubmitResponse = { success?: boolean; project?: string; movie?: { project?: string } };
type StatusResponse = { movie?: { status?: string; url?: string; message?: string } };

export type RenderStatus =
  | { status: "done"; url: string }
  | { status: "running" }
  | { status: "error"; message: string };

function apiKey(): string {
  const key = process.env.JSON2VIDEO_API_KEY;
  if (!key) throw new Error("JSON2VIDEO_API_KEY fehlt (nur serverseitig setzen).");
  return key;
}

/**
 * Startet einen Render-Job und gibt sofort die project-id zurueck (schnell,
 * Hobby-Plan-tauglich). Das eigentliche Rendern laeuft serverseitig bei
 * JSON2Video weiter; der Status wird spaeter via pollRender() abgefragt.
 */
export async function submitRender(spec: MovieSpec): Promise<string> {
  const submit = await fetch(J2V_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": apiKey() },
    body: JSON.stringify(spec),
  });
  if (!submit.ok) {
    const t = await submit.text().catch(() => "");
    throw new Error(`JSON2Video submit ${submit.status}: ${t.slice(0, 400)}`);
  }
  const data = (await submit.json()) as SubmitResponse;
  const project = data.project ?? data.movie?.project;
  if (!project) {
    throw new Error(`JSON2Video: keine project-id in Antwort: ${JSON.stringify(data).slice(0, 300)}`);
  }
  return project;
}

/** Fragt den Render-Status genau einmal ab (schnell). */
export async function pollRender(project: string): Promise<RenderStatus> {
  const res = await fetch(`${J2V_BASE}/?project=${encodeURIComponent(project)}`, {
    headers: { "x-api-key": apiKey() },
  });
  if (!res.ok) {
    // transienter Fehler -> als "laeuft noch" behandeln, naechster Aufruf prueft erneut
    return { status: "running" };
  }
  const data = (await res.json()) as StatusResponse;
  const status = data.movie?.status;
  if (status === "done" && data.movie?.url) {
    return { status: "done", url: data.movie.url };
  }
  if (status === "error") {
    return { status: "error", message: data.movie?.message ?? "unbekannt" };
  }
  return { status: "running" };
}

/**
 * Synchrone Variante (startet + pollt bis done). Praktisch fuer lokale Laeufe
 * ohne Zeitlimit. Auf dem Vercel-Hobby-Plan stattdessen submitRender +
 * pollRender ueber mehrere Aufrufe nutzen (siehe app/api/render/route.ts).
 */
export async function renderVideo(spec: MovieSpec): Promise<string> {
  const project = await submitRender(spec);

  const startZeit = Date.now();
  const timeoutMs = 290_000;
  const intervalMs = 4_000;

  while (Date.now() - startZeit < timeoutMs) {
    await sleep(intervalMs);
    const r = await pollRender(project);
    if (r.status === "done") return r.url;
    if (r.status === "error") throw new Error(`JSON2Video render error: ${r.message}`);
  }
  throw new Error("JSON2Video: Timeout beim Rendern (Status nicht 'done').");
}
