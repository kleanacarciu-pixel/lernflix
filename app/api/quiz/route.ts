import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "edge";

// === KONSTANTEN ===
const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-sonnet-4-6";
const ZIEL_FRAGEN = 5;
const TIMEOUT_PRO_FRAGE_MS = 15_000;
const MAX_PARALLEL = 7; // 5 + 2 buffer fuer den fall dass welche fehlschlagen
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

// === SUPABASE ===
const supabase = (() => {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.warn("Supabase env vars fehlen - cache deaktiviert");
    return null;
  }
  return createClient(url, key);
})();

// === ANTHROPIC CALL ===
async function callClaude(prompt: string, maxTokens: number, timeoutMs: number): Promise<string | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("ANTHROPIC_API_KEY fehlt");
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
    if (!res.ok) {
      const errTxt = await res.text().catch(() => "");
      console.error(`Anthropic ${res.status}: ${errTxt.slice(0, 200)}`);
      return null;
    }
    const data = (await res.json()) as AnthropicResponse;
    return data.content?.[0]?.text?.trim() ?? null;
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      console.warn("Anthropic timeout");
    } else {
      console.error("Anthropic fetch fehler", err);
    }
    return null;
  } finally {
    clearTimeout(timer);
  }
}

// === PROMPT ===
function bauPrompt(fach: string, klasse: string, thema: string, schwierigkeit: string, variation: string, index: number): string {
  const aspekte = [
    "direkte Rechenaufgabe",
    "kurze Sachaufgabe aus dem Alltag",
    "Konzept-Verstaendnis",
    "Schritt-fuer-Schritt Aufgabe",
    "Anwendung in einem Kontext",
  ];
  const aspekt = aspekte[index % aspekte.length];

  return `Du bist ein erfahrener ${fach}-Lehrer fuer ${klasse}. Erstelle GENAU EINE Multiple-Choice-Frage zum Thema "${thema}", Schwierigkeit "${schwierigkeit}", Aspekt: ${aspekt}. Variation: ${variation}-${index}.

VORGEHEN (in deinem Kopf):
1. Formuliere die Aufgabe inhaltlich
2. Rechne die Loesung Schritt fuer Schritt durch - sei genau!
3. Erstelle 3 plausible-aber-falsche Antworten (typische Schuelerfehler wie Rechenfehler, falsches Vorzeichen, falsche Formel)
4. Position der richtigen Antwort: zufaellig A, B, C oder D
5. Gib NUR den finalen JSON aus - kein "Hier ist die Frage" davor

REGELN:
- Frage muss komplett aus Text loesbar sein (keine Verweise auf Bilder/Skizzen)
- Alle Werte/Zahlen in der Frage stehen
- BSP FALSCH: "Wie viele Aepfel sind es?" (kein Kontext)
- BSP RICHTIG: "Anna hat 3 Aepfel, kauft 4 dazu. Wie viele hat sie?"
- BSP FALSCH: "Wie viele Finger zeigt die Hand?" (Allgemeinwissen, eine Hand hat 5)
- BSP RICHTIG: "Berechne 7+8" oder Sachaufgabe mit Zahlen
- Loesung muss mathematisch/physikalisch korrekt sein - PRUEFE deine rechnung
- Antworten alle plausibel (keine Quatsch-Optionen wie "Bratwurst")
- echte deutsche Umlaute (ä ö ü ß)
- "erklaerung" = 1 Satz mit Rechenweg
- "richtig" = INDEX (0-3) der korrekten Antwort
- niemals KI/AI/Anthropic/Claude erwaehnen

OUTPUT FORMAT - exakt diese 4 Felder, nichts anderes:
{"frage":"...","antworten":["A","B","C","D"],"richtig":0,"erklaerung":"..."}`;
}

// === JSON EXTRAKTION ===
// Robust gegen markdown-blocks und text-praeambel
function extrahiereJson(text: string): unknown | null {
  let t = text.replace(/```json/gi, "").replace(/```/g, "").trim();
  const start = t.indexOf("{");
  const end = t.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;
  t = t.substring(start, end + 1);
  try {
    return JSON.parse(t);
  } catch {
    return null;
  }
}

function validiereUndNormalisiere(roh: unknown): Frage | null {
  if (!roh || typeof roh !== "object") return null;
  const r = roh as { frage?: unknown; antworten?: unknown; richtig?: unknown; loesung?: unknown; erklaerung?: unknown };

  if (typeof r.frage !== "string" || r.frage.trim().length < 5) return null;
  if (!Array.isArray(r.antworten) || r.antworten.length !== 4) return null;
  if (!r.antworten.every((a) => typeof a === "string" && a.trim().length > 0)) return null;

  const antworten = r.antworten as string[];
  // Doppelte antworten = fehler
  if (new Set(antworten).size !== 4) return null;

  let richtig: number;
  if (typeof r.richtig === "number" && r.richtig >= 0 && r.richtig <= 3) {
    richtig = Math.floor(r.richtig);
  } else if (typeof r.loesung === "string") {
    // Fallback: loesung-text -> index
    const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, " ");
    const idx = antworten.findIndex((a) => norm(a) === norm(r.loesung as string));
    if (idx === -1) return null;
    richtig = idx;
  } else {
    return null;
  }

  const erklaerung = typeof r.erklaerung === "string" ? r.erklaerung.trim() : "";

  return {
    frage: r.frage.trim(),
    antworten,
    richtig,
    erklaerung,
  };
}

// === EINE FRAGE GENERIEREN ===
async function generiereFrage(fach: string, klasse: string, thema: string, schwierigkeit: string, variation: string, index: number): Promise<Frage | null> {
  const prompt = bauPrompt(fach, klasse, thema, schwierigkeit, variation, index);
  const text = await callClaude(prompt, 500, TIMEOUT_PRO_FRAGE_MS);
  if (!text) return null;
  const json = extrahiereJson(text);
  return validiereUndNormalisiere(json);
}

// === CACHE LESEN ===
async function holeAusCache(fach: string, klasse: number, thema: string, schwierigkeit: string): Promise<Frage[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("quiz_fragen")
    .select("frage,antworten,richtig,erklaerung")
    .eq("fach", fach)
    .eq("klasse", klasse)
    .eq("thema", thema)
    .eq("schwierigkeit", schwierigkeit)
    .limit(CACHE_POOL_GROESSE);
  if (error) {
    console.error("Supabase select fehler", error.message);
    return [];
  }
  if (!data) return [];
  // Random pick aus dem pool
  const gemischt = [...data].sort(() => Math.random() - 0.5).slice(0, ZIEL_FRAGEN);
  return gemischt.map((d) => ({
    frage: d.frage as string,
    antworten: d.antworten as string[],
    richtig: d.richtig as number,
    erklaerung: (d.erklaerung as string) ?? "",
  }));
}

// === CACHE SCHREIBEN ===
async function speichereInCache(fach: string, klasse: number, thema: string, schwierigkeit: string, fragen: Frage[]): Promise<void> {
  if (!supabase || fragen.length === 0) return;
  const rows = fragen.map((f) => ({
    fach,
    klasse,
    thema,
    schwierigkeit,
    frage: f.frage,
    antworten: f.antworten,
    richtig: f.richtig,
    erklaerung: f.erklaerung,
  }));
  const { error } = await supabase.from("quiz_fragen").insert(rows);
  if (error) console.error("Supabase insert fehler", error.message);
}

// === HAUPT-HANDLER ===
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));

    const thema = String(body.thema ?? "Mathematik").slice(0, 120).trim();
    const schwierigkeit = String(body.schwierigkeit ?? "mittel");
    const klasseNum = Math.max(1, Math.min(13, parseInt(String(body.klasse ?? "5"), 10) || 5));
    const fach = body.fach === "physik" ? "physik" : "mathe";

    const fachText = fach === "physik" ? "Physik" : "Mathematik";
    const klasseText = `Klasse ${klasseNum}`;
    const schwierigkeitText =
      schwierigkeit === "leicht" ? "einfach" :
      schwierigkeit === "schwer" ? "schwierig" :
      "mittelschwer";

    // 1. CACHE FIRST
    const cached = await holeAusCache(fach, klasseNum, thema, schwierigkeit);
    if (cached.length >= ZIEL_FRAGEN) {
      return NextResponse.json({ fragen: cached, quelle: "cache" });
    }

    // 2. GENERIEREN: 7 parallele calls (5 ziel + 2 buffer)
    const variation = Math.random().toString(36).slice(2, 8);
    const fehlend = ZIEL_FRAGEN - cached.length;
    const generierZahl = Math.min(MAX_PARALLEL, fehlend + 2);

    const promises = Array.from({ length: generierZahl }, (_, i) =>
      generiereFrage(fachText, klasseText, thema, schwierigkeitText, variation, i),
    );
    const ergebnisse = await Promise.all(promises);
    const neueFragen = ergebnisse.filter((f): f is Frage => f !== null);

    // 3. CACHE FILL (fire-and-forget - blockiert nicht die antwort)
    if (neueFragen.length > 0) {
      const waitUntil = (request as unknown as { waitUntil?: (p: Promise<unknown>) => void }).waitUntil;
      const speicherPromise = speichereInCache(fach, klasseNum, thema, schwierigkeit, neueFragen).catch(() => {});
      if (typeof waitUntil === "function") {
        waitUntil(speicherPromise);
      } else {
        // Im notfall: nicht warten, lass es im hintergrund laufen
        void speicherPromise;
      }
    }

    // 4. RETURN: cache + neue, bis zu 5
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
      cache_count: cached.length,
      neu_count: neueFragen.length,
    });
  } catch (error) {
    console.error("Quiz API fatal error:", error);
    return NextResponse.json({ error: "Server-Fehler" }, { status: 500 });
  }
}
