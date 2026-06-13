import { NextResponse } from "next/server";

// Edge runtime: keine cold starts, viel schneller anlauf
export const runtime = "edge";
export const maxDuration = 25;

type Frage = {
  frage: string;
  antworten: string[];
  loesung?: string;
  richtig?: number;
  erklaerung?: string;
};

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-haiku-4-5-20251001";
const FRAGE_TIMEOUT_MS = 8000;

function bauPrompt(fach: string, klasse: string, thema: string, schwierigkeit: string, variation: string, index: number): string {
  const aspekte = [
    "Rechnen / Berechnung",
    "Anwendung im Alltag",
    "Konzept / Verstaendnis",
    "Sachaufgabe mit Kontext",
    "Schritt-fuer-Schritt",
  ];
  const aspekt = aspekte[index % aspekte.length];

  return `Erstelle GENAU EINE Multiple-Choice-Frage. Fach=${fach}, ${klasse}, Thema="${thema}", Schwierigkeit=${schwierigkeit}. Aspekt: ${aspekt}. Var: ${variation}-${index}.

PFLICHT:
- Echte Mathe/Physik-Aufgabe zum Thema "${thema}" - kein Allgemeinwissen
- Rechne selbst nach. Loesung MUSS nachweisbar korrekt sein.
- Frage komplett aus Text verstehbar - keine Verweise auf Bilder/Skizzen
- Bsp falsch: "Wie viele Finger zeigt die Hand?" (kein Kontext, eine Hand hat 5 Finger)
- Bsp richtig: "Anna hat 3 Aepfel, bekommt 4 dazu. Wie viele?"
- 4 Antworten, eine richtig, drei plausibel-falsch, Position variieren
- echte Umlaute (ä ö ü ß)
- erklaerung = 1 satz rechenweg
- loesung = WORTLAUT der richtigen antwort
- niemals KI/AI erwaehnen

NUR JSON:
{"frage":"...","antworten":["a","b","c","d"],"loesung":"<wortlaut>","erklaerung":"<rechenweg>"}`;
}

async function generiereEineFrage(fach: string, klasse: string, thema: string, schwierigkeit: string, variation: string, index: number): Promise<Frage | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FRAGE_TIMEOUT_MS);
  try {
    const res = await fetch(ANTHROPIC_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY || "",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 280,
        temperature: 0.85,
        messages: [{ role: "user", content: bauPrompt(fach, klasse, thema, schwierigkeit, variation, index) }],
      }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) return null;
    const data = await res.json();
    let text: string = data?.content?.[0]?.text?.trim() || "";
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start === -1 || end === -1) return null;
    const parsed = JSON.parse(text.substring(start, end + 1));

    const antworten: string[] = Array.isArray(parsed.antworten) ? parsed.antworten : [];
    if (antworten.length < 2 || !parsed.frage) return null;

    let richtig = 0;
    if (typeof parsed.loesung === "string") {
      const idx = antworten.findIndex((a: string) => a === parsed.loesung);
      if (idx !== -1) {
        richtig = idx;
      } else {
        const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, " ");
        const idx2 = antworten.findIndex((a: string) => norm(a) === norm(parsed.loesung));
        if (idx2 !== -1) richtig = idx2;
      }
    } else if (typeof parsed.richtig === "number" && parsed.richtig >= 0 && parsed.richtig < antworten.length) {
      richtig = parsed.richtig;
    }

    return {
      frage: parsed.frage,
      antworten,
      richtig,
      erklaerung: parsed.erklaerung,
    };
  } catch {
    clearTimeout(timeoutId);
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const thema = (body.thema || "Mathematik").toString().slice(0, 120);
    const schwierigkeit = body.schwierigkeit || "mittel";
    const klasse = body.klasse ? `Klasse ${body.klasse}` : "passende Klassenstufe";
    const fach = body.fach === "physik" ? "Physik" : "Mathematik";

    let schwierigkeitText = "einfach";
    if (schwierigkeit === "mittel") schwierigkeitText = "mittelschwer";
    if (schwierigkeit === "schwer") schwierigkeitText = "schwierig";

    const variationsId = Math.random().toString(36).slice(2, 8);

    // 5 parallele calls, jeder mit timeout. wenn was kommt, kommt's. wenn nicht, weggelassen.
    const promises = Array.from({ length: 5 }, (_, i) =>
      generiereEineFrage(fach, klasse, thema, schwierigkeitText, variationsId, i),
    );
    const results = await Promise.all(promises);
    const fragen = results.filter((f): f is Frage => f !== null);

    if (fragen.length === 0) {
      return NextResponse.json({ error: "Keine Fragen generiert" }, { status: 500 });
    }

    // Auch wenn nur 3 von 5 ankamen: zurueckgeben, damit der user starten kann
    return NextResponse.json({ fragen });
  } catch (error) {
    console.error("Fehler:", error);
    return NextResponse.json({ error: "Fehler" }, { status: 500 });
  }
}
