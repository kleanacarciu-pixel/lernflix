import { NextResponse } from "next/server";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export const runtime = "edge";

// === KONSTANTEN ===
const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-haiku-4-5-20251001";
const ZIEL_FRAGEN = 5;
const TIMEOUT_PRO_FRAGE_MS = 14_000;
const MAX_PARALLEL = 7;
const CACHE_POOL_GROESSE = 30;

// === TYPES ===
type Frage = {
  frage: string;
  antworten: string[];
  richtig: number;
  erklaerung: string;
};

type AnthropicResponse = {
  content?: Array<{ text?: string }>;
};

// === SUPABASE (lazy init, weil edge runtime sensitiv ist) ===
let supabaseSingleton: SupabaseClient | null = null;
let supabaseGeprueft = false;

function getSupabase(): SupabaseClient | null {
  if (supabaseGeprueft) return supabaseSingleton;
  supabaseGeprueft = true;
  try {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) {
      console.log("[quiz] Supabase env vars fehlen - cache deaktiviert");
      return null;
    }
    supabaseSingleton = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    console.log("[quiz] Supabase client initialisiert");
    return supabaseSingleton;
  } catch (e) {
    console.error("[quiz] Supabase init fehler:", String(e));
    return null;
  }
}

// === ANTHROPIC CALL ===
async function callClaude(prompt: string, maxTokens: number, timeoutMs: number): Promise<string | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("[quiz] ANTHROPIC_API_KEY fehlt!");
    return null;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(ANTHROPIC_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: maxTokens,
        temperature: 0.6,
        messages: [{ role: "user", content: prompt }],
      }),
      signal: controller.signal,
    });

    clearTimeout(timer);

    if (!res.ok) {
      const errTxt = await res.text().catch(() => "");
      console.error(`[quiz] Anthropic ${res.status}: ${errTxt.slice(0, 300)}`);
      return null;
    }

    const data = (await res.json()) as AnthropicResponse;
    const text = data?.content?.[0]?.text?.trim();
    if (!text) {
      console.warn("[quiz] Anthropic response ohne text");
      return null;
    }
    return text;
  } catch (err) {
    clearTimeout(timer);
    if (err instanceof Error && err.name === "AbortError") {
      console.warn("[quiz] Anthropic timeout nach " + timeoutMs + "ms");
    } else {
      console.error("[quiz] Anthropic fetch fehler:", String(err));
    }
    return null;
  }
}

// === PROMPT ===
function bauPrompt(fach: string, klasse: string, thema: string, schwierigkeit: string, variation: string, index: number): string {
  const aspekte = [
    "direkte Rechenaufgabe",
    "kurze Sachaufgabe aus dem Alltag",
    "Konzept-Verstaendnis",
    "Schritt-fuer-Schritt Aufgabe",
    "Anwendung mit Kontext",
  ];
  const aspekt = aspekte[index % aspekte.length];

  return `Du bist ein erfahrener ${fach}-Lehrer fuer ${klasse}. Erstelle GENAU EINE Multiple-Choice-Frage zum Thema "${thema}", Schwierigkeit "${schwierigkeit}", Aspekt: ${aspekt}. Variation: ${variation}-${index}.

WICHTIG: Rechne die Loesung selbst Schritt fuer Schritt durch, sei dir 100% sicher. Falsche Antworten sind typische Schuelerfehler.

REGELN:
- Frage muss aus reinem Text loesbar sein (keine Bilder/Skizzen)
- Alle Werte/Zahlen in der Frage stehen
- BSP FALSCH: "Wie viele Aepfel sind es?" / "Wie viele Finger zeigt die Hand?"
- BSP RICHTIG: "Berechne 7+8" / "Anna hat 3 Aepfel, kauft 4 dazu. Wie viele?"
- Position der richtigen Antwort zufaellig variieren
- echte deutsche Umlaute (ä ö ü ß)
- "richtig" = INDEX (0-3) der korrekten Antwort
- nie KI/AI erwaehnen

Antwort NUR als reines JSON, KEIN markdown, KEIN praeambel:
{"frage":"...","antworten":["A","B","C","D"],"richtig":0,"erklaerung":"kurzer rechenweg"}`;
}

// === JSON EXTRAKTION (robust) ===
function extrahiereJson(text: string): unknown | null {
  try {
    let t = text.replace(/```json/gi, "").replace(/```/g, "").trim();
    const start = t.indexOf("{");
    const end = t.lastIndexOf("}");
    if (start === -1 || end === -1 || end <= start) return null;
    t = t.substring(start, end + 1);
    return JSON.parse(t);
  } catch {
    return null;
  }
}

// === VALIDIERUNG ===
function validiere(roh: unknown): Frage | null {
  try {
    if (!roh || typeof roh !== "object") return null;
    const r = roh as { frage?: unknown; antworten?: unknown; richtig?: unknown; loesung?: unknown; erklaerung?: unknown };

    if (typeof r.frage !== "string" || r.frage.trim().length < 5) return null;
    if (!Array.isArray(r.antworten) || r.antworten.length !== 4) return null;
    if (!r.antworten.every((a) => typeof a === "string" && a.trim().length > 0)) return null;

    const antworten = (r.antworten as string[]).map((a) => a.trim());
    if (new Set(antworten).size !== 4) return null;

    let richtig: number;
    if (typeof r.richtig === "number" && r.richtig >= 0 && r.richtig <= 3 && Number.isFinite(r.richtig)) {
      richtig = Math.floor(r.richtig);
    } else if (typeof r.loesung === "string") {
      const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, " ");
      const idx = antworten.findIndex((a) => norm(a) === norm(r.loesung as string));
      if (idx === -1) return null;
      richtig = idx;
    } else {
      return null;
    }

    const erklaerung = typeof r.erklaerung === "string" ? r.erklaerung.trim() : "";

    return { frage: r.frage.trim(), antworten, richtig, erklaerung };
  } catch {
    return null;
  }
}

// === EINE FRAGE ===
async function generiereFrage(fach: string, klasse: string, thema: string, schwierigkeit: string, variation: string, index: number): Promise<Frage | null> {
  const prompt = bauPrompt(fach, klasse, thema, schwierigkeit, variation, index);
  const text = await callClaude(prompt, 500, TIMEOUT_PRO_FRAGE_MS);
  if (!text) return null;
  const json = extrahiereJson(text);
  return validiere(json);
}

// === CACHE LESEN ===
async function holeAusCache(fach: string, klasse: number, thema: string, schwierigkeit: string): Promise<Frage[]> {
  const sb = getSupabase();
  if (!sb) return [];
  try {
    const { data, error } = await sb
      .from("quiz_fragen")
      .select("frage,antworten,richtig,erklaerung")
      .eq("fach", fach)
      .eq("klasse", klasse)
      .eq("thema", thema)
      .eq("schwierigkeit", schwierigkeit)
      .limit(CACHE_POOL_GROESSE);
    if (error) {
      console.error("[quiz] Supabase select fehler:", error.message);
      return [];
    }
    if (!data || data.length === 0) return [];
    const gemischt = [...data].sort(() => Math.random() - 0.5).slice(0, ZIEL_FRAGEN);
    return gemischt.map((d) => ({
      frage: String(d.frage),
      antworten: d.antworten as string[],
      richtig: Number(d.richtig),
      erklaerung: String(d.erklaerung ?? ""),
    }));
  } catch (e) {
    console.error("[quiz] Cache lesen exception:", String(e));
    return [];
  }
}

// === CACHE SCHREIBEN ===
async function speichereInCache(fach: string, klasse: number, thema: string, schwierigkeit: string, fragen: Frage[]): Promise<void> {
  const sb = getSupabase();
  if (!sb || fragen.length === 0) return;
  try {
    const rows = fragen.map((f) => ({
      fach, klasse, thema, schwierigkeit,
      frage: f.frage,
      antworten: f.antworten,
      richtig: f.richtig,
      erklaerung: f.erklaerung,
    }));
    const { error } = await sb.from("quiz_fragen").insert(rows);
    if (error) console.error("[quiz] Supabase insert fehler:", error.message);
    else console.log(`[quiz] ${fragen.length} fragen in cache gespeichert`);
  } catch (e) {
    console.error("[quiz] Cache schreiben exception:", String(e));
  }
}

// === HAUPT-HANDLER ===
export async function POST(request: Request): Promise<Response> {
  try {
    let body: Record<string, unknown> = {};
    try {
      const raw = await request.json();
      if (raw && typeof raw === "object") {
        body = raw as Record<string, unknown>;
      }
    } catch {
      // body bleibt {}
    }

    const thema = String(body.thema ?? "Mathematik").slice(0, 120).trim() || "Mathematik";
    const schwierigkeit = String(body.schwierigkeit ?? "mittel");
    const klasseRaw = parseInt(String(body.klasse ?? "5"), 10);
    const klasseNum = Number.isFinite(klasseRaw) ? Math.max(1, Math.min(13, klasseRaw)) : 5;
    const fach = body.fach === "physik" ? "physik" : "mathe";

    const fachText = fach === "physik" ? "Physik" : "Mathematik";
    const klasseText = `Klasse ${klasseNum}`;
    const schwierigkeitText =
      schwierigkeit === "leicht" ? "einfach" :
      schwierigkeit === "schwer" ? "schwierig" :
      "mittelschwer";

    console.log(`[quiz] Anfrage: ${fach}/${klasseNum}/"${thema}"/${schwierigkeit}`);

    // 1. CACHE FIRST
    const cached = await holeAusCache(fach, klasseNum, thema, schwierigkeit);
    if (cached.length >= ZIEL_FRAGEN) {
      console.log(`[quiz] Cache-hit: ${cached.length} fragen`);
      return NextResponse.json({ fragen: cached, quelle: "cache" });
    }
    console.log(`[quiz] Cache-miss: ${cached.length}/${ZIEL_FRAGEN} vorhanden, generiere rest`);

    // 2. GENERIEREN
    const variation = Math.random().toString(36).slice(2, 8);
    const fehlend = ZIEL_FRAGEN - cached.length;
    const generierZahl = Math.min(MAX_PARALLEL, fehlend + 2);

    const ergebnisse = await Promise.all(
      Array.from({ length: generierZahl }, (_, i) =>
        generiereFrage(fachText, klasseText, thema, schwierigkeitText, variation, i),
      ),
    );
    const neueFragen = ergebnisse.filter((f): f is Frage => f !== null);
    console.log(`[quiz] Generiert: ${neueFragen.length}/${generierZahl} erfolgreich`);

    // 3. CACHE FILL (fire-and-forget - kein await damit nicht blockiert)
    if (neueFragen.length > 0) {
      speichereInCache(fach, klasseNum, thema, schwierigkeit, neueFragen).catch((e) => {
        console.error("[quiz] Cache-fill catch:", String(e));
      });
    }

    const fragen = [...cached, ...neueFragen].slice(0, ZIEL_FRAGEN);

    if (fragen.length === 0) {
      return NextResponse.json(
        { error: "Konnte keine Fragen generieren. Bitte erneut versuchen." },
        { status: 503 },
      );
    }

    return NextResponse.json({
      fragen,
      quelle: cached.length > 0 ? "gemischt" : "neu",
    });
  } catch (error) {
    console.error("[quiz] Fatal handler error:", error instanceof Error ? error.stack || error.message : String(error));
    return NextResponse.json(
      { error: "Server-Fehler. Bitte erneut versuchen." },
      { status: 500 },
    );
  }
}
