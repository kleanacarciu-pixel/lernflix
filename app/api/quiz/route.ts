import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "edge";
export const maxDuration = 60;

type Frage = {
  frage: string;
  antworten: string[];
  loesung?: string;
  richtig?: number;
  erklaerung?: string;
};

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const MODEL_GENERATE = "claude-sonnet-4-6";
const MODEL_VERIFY = "claude-sonnet-4-6";
const FRAGE_TIMEOUT_MS = 12000;
const ZIEL_FRAGEN = 5;

// Supabase setup. Wenn keys fehlen, faellt API zurueck auf reine KI-generation.
const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

function bauGenerationsPrompt(fach: string, klasse: string, thema: string, schwierigkeit: string, variation: string, index: number): string {
  const aspekte = ["Rechnen / Berechnung", "Anwendung im Alltag", "Konzept", "Sachaufgabe", "Schritt-fuer-Schritt"];
  const aspekt = aspekte[index % aspekte.length];
  return `Erstelle GENAU EINE Multiple-Choice-Frage. ${fach}, ${klasse}, Thema "${thema}", ${schwierigkeit}. Aspekt: ${aspekt}. Var: ${variation}-${index}.

PFLICHT:
- Echte ${fach}-Aufgabe zum Thema "${thema}" - kein Allgemeinwissen
- Rechne SELBST nach. Loesung MUSS nachweisbar korrekt sein.
- Frage komplett aus Text loesbar - keine Bilder/Skizzen-Verweise
- FALSCH: "Wie viele Finger zeigt die Hand?" (kein Kontext)
- RICHTIG: "Anna hat 3 Aepfel, bekommt 4 dazu. Wie viele?"
- 4 Antworten, eine korrekt, drei plausibel-falsch (typische Schuelerfehler)
- Position der richtigen Antwort zufaellig variieren
- echte Umlaute (ä ö ü ß)
- erklaerung = 1 satz mit rechenweg
- loesung = WORTLAUT (text, kein index)
- nie KI/AI erwaehnen

NUR JSON:
{"frage":"...","antworten":["a","b","c","d"],"loesung":"<wortlaut>","erklaerung":"<rechenweg>"}`;
}

function bauVerifikationsPrompt(frage: Frage): string {
  return `Pruefe diese Mathe/Physik-Frage. Antworte NUR mit JSON.

Frage: ${frage.frage}
Antworten: ${JSON.stringify(frage.antworten)}
Angeblich richtige Antwort: ${frage.antworten[frage.richtig ?? 0]}

Aufgaben:
1. Loese die Aufgabe selbst Schritt fuer Schritt.
2. Vergleiche deine Loesung mit der angeblich richtigen Antwort.
3. Pruefe: Ist die Frage selbsterklaerend (ohne Bild/Kontext loesbar)?
4. Pruefe: Sind die anderen 3 Antworten plausibel falsch (keine offensichtlichen Quatsch-Optionen)?

JSON-Antwort:
{"korrekt": true/false, "grund": "<kurze begruendung>"}

Beispiel falsch: {"korrekt": false, "grund": "Eine Hand hat 5 Finger, nicht 10"}
Beispiel richtig: {"korrekt": true, "grund": "3+4=7, stimmt"}`;
}

async function callAnthropic(prompt: string, maxTokens: number, timeoutMs: number, model: string): Promise<string | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(ANTHROPIC_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY || "",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model,
        max_tokens: maxTokens,
        temperature: 0.7,
        messages: [{ role: "user", content: prompt }],
      }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (!res.ok) return null;
    const data = await res.json();
    return data?.content?.[0]?.text?.trim() || null;
  } catch {
    clearTimeout(timeoutId);
    return null;
  }
}

function parseJsonAusText(text: string): unknown | null {
  let t = text.replace(/```json/g, "").replace(/```/g, "").trim();
  const start = t.indexOf("{");
  const end = t.lastIndexOf("}");
  if (start === -1 || end === -1) return null;
  t = t.substring(start, end + 1);
  try { return JSON.parse(t); } catch { return null; }
}

async function generiereUndVerifiziereFrage(fach: string, klasse: string, thema: string, schwierigkeit: string, variation: string, index: number): Promise<Frage | null> {
  const rohText = await callAnthropic(bauGenerationsPrompt(fach, klasse, thema, schwierigkeit, variation, index), 400, FRAGE_TIMEOUT_MS, MODEL_GENERATE);
  if (!rohText) return null;
  const parsed = parseJsonAusText(rohText) as { frage?: string; antworten?: string[]; loesung?: string; richtig?: number; erklaerung?: string } | null;
  if (!parsed || !parsed.frage || !Array.isArray(parsed.antworten) || parsed.antworten.length < 2) return null;

  let richtig = 0;
  if (typeof parsed.loesung === "string") {
    const idx = parsed.antworten.findIndex((a: string) => a === parsed.loesung);
    if (idx !== -1) richtig = idx;
    else {
      const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, " ");
      const idx2 = parsed.antworten.findIndex((a: string) => norm(a) === norm(parsed.loesung!));
      if (idx2 !== -1) richtig = idx2;
    }
  } else if (typeof parsed.richtig === "number" && parsed.richtig >= 0 && parsed.richtig < parsed.antworten.length) {
    richtig = parsed.richtig;
  }

  const frage: Frage = { frage: parsed.frage, antworten: parsed.antworten, richtig, erklaerung: parsed.erklaerung };

  // SELBST-CHECK: zweiter Sonnet-call prueft ob die loesung wirklich stimmt
  const checkText = await callAnthropic(bauVerifikationsPrompt(frage), 150, 8000, MODEL_VERIFY);
  if (!checkText) return null;
  const check = parseJsonAusText(checkText) as { korrekt?: boolean; grund?: string } | null;
  if (!check || check.korrekt !== true) {
    console.log(`Frage verworfen: ${check?.grund || "verify fail"}`);
    return null;
  }

  return frage;
}

async function speichereFragen(fach: string, klasse: number, thema: string, schwierigkeit: string, fragen: Frage[]): Promise<void> {
  if (!supabase || fragen.length === 0) return;
  const rows = fragen.map((f) => ({
    fach,
    klasse,
    thema,
    schwierigkeit,
    frage: f.frage,
    antworten: f.antworten,
    richtig: f.richtig ?? 0,
    erklaerung: f.erklaerung || "",
  }));
  await supabase.from("quiz_fragen").insert(rows);
}

async function holeAusCache(fach: string, klasse: number, thema: string, schwierigkeit: string, anzahl: number): Promise<Frage[]> {
  if (!supabase) return [];
  // Hole bis zu 30 fragen aus dem cache, dann zufaellig 5 davon
  const { data, error } = await supabase
    .from("quiz_fragen")
    .select("frage,antworten,richtig,erklaerung")
    .eq("fach", fach)
    .eq("klasse", klasse)
    .eq("thema", thema)
    .eq("schwierigkeit", schwierigkeit)
    .limit(30);
  if (error || !data) return [];
  // Random mix
  const gemischt = [...data].sort(() => Math.random() - 0.5).slice(0, anzahl);
  return gemischt.map((d) => ({
    frage: d.frage,
    antworten: d.antworten,
    richtig: d.richtig,
    erklaerung: d.erklaerung,
  }));
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const thema = (body.thema || "Mathematik").toString().slice(0, 120);
    const schwierigkeit = body.schwierigkeit || "mittel";
    const klasseNum = parseInt(body.klasse || "5", 10);
    const klasseText = `Klasse ${klasseNum}`;
    const fach = body.fach === "physik" ? "physik" : "mathe";
    const fachText = fach === "physik" ? "Physik" : "Mathematik";

    let schwierigkeitText = "einfach";
    if (schwierigkeit === "mittel") schwierigkeitText = "mittelschwer";
    if (schwierigkeit === "schwer") schwierigkeitText = "schwierig";

    // 1. CACHE ZUERST
    const cached = await holeAusCache(fach, klasseNum, thema, schwierigkeit, ZIEL_FRAGEN);
    if (cached.length >= ZIEL_FRAGEN) {
      return NextResponse.json({ fragen: cached });
    }

    // 2. ANSONSTEN GENERIEREN
    const variationsId = Math.random().toString(36).slice(2, 8);
    const fehlend = ZIEL_FRAGEN - cached.length;
    const promises = Array.from({ length: fehlend + 2 }, (_, i) => // +2 buffer falls welche verworfen
      generiereUndVerifiziereFrage(fachText, klasseText, thema, schwierigkeitText, variationsId, i),
    );
    const generated = (await Promise.all(promises)).filter((f): f is Frage => f !== null);

    // 3. NEUE FRAGEN IN CACHE SPEICHERN
    if (generated.length > 0) {
      // fire-and-forget speichern (nicht warten)
      speichereFragen(fach, klasseNum, thema, schwierigkeit, generated).catch(() => {});
    }

    const fragen = [...cached, ...generated].slice(0, ZIEL_FRAGEN);
    if (fragen.length === 0) {
      return NextResponse.json({ error: "Keine Fragen verfuegbar" }, { status: 500 });
    }
    return NextResponse.json({ fragen });
  } catch (error) {
    console.error("Fehler:", error);
    return NextResponse.json({ error: "Fehler" }, { status: 500 });
  }
}
