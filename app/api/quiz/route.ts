import { NextResponse } from "next/server";

export const maxDuration = 30;

type Frage = {
  frage: string;
  antworten: string[];
  loesung?: string;
  richtig?: number;
  erklaerung?: string;
};

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-haiku-4-5-20251001";

function bauPrompt(fach: string, klasse: string, thema: string, schwierigkeit: string, variation: string, index: number): string {
  const aspekte = [
    "Rechnen / Berechnung",
    "Anwendung im Alltag",
    "Konzept / Verstaendnis",
    "Sachaufgabe mit Kontext",
    "Schritt-fuer-Schritt-Aufgabe",
  ];
  const aspekt = aspekte[index % aspekte.length];

  return `Erstelle GENAU EINE Multiple-Choice-Frage fuer ${fach}, ${klasse}, Thema "${thema}", Schwierigkeit ${schwierigkeit}.
Aspekt diese Frage: ${aspekt}. Variation: ${variation}-${index}.

PFLICHT:
1. Echte Mathe/Physik-Aufgabe zum Thema "${thema}" - kein Allgemeinwissen, keine Trickfrage.
2. Rechne die Aufgabe SELBST durch bevor du die Loesung notierst. Loesung MUSS nachweisbar korrekt sein.
3. Frage steht alleine: keine Verweise auf Bilder/Skizzen/Diagramme. Alle Werte/Infos im Fragetext.
4. Beispiel FALSCH (Klasse 1, Addition): "Wie viele Finger zeigt die Hand?" - kein Kontext, eine Hand hat 5 Finger.
5. Beispiel RICHTIG (Klasse 1, Addition): "Anna hat 3 Aepfel und bekommt 4 dazu. Wie viele Aepfel hat sie?"
6. Genau 4 Antwortmoeglichkeiten, eine richtig, drei plausibel-falsch (haeufige Schuelerfehler).
7. Position der richtigen Antwort variieren (nicht immer A).
8. Echte deutsche Umlaute (ä ö ü ß).
9. erklaerung = kurzer Rechenweg in 1 Satz, passend zur richtigen Loesung.
10. loesung = WORTLAUT der richtigen Antwort (Text, kein Index).
11. NIE KI/AI/Anthropic erwaehnen.

Antwort NUR als JSON:
{"frage":"...","antworten":["a","b","c","d"],"loesung":"<wortlaut>","erklaerung":"<rechenweg>"}`;
}

async function generiereEineFrage(fach: string, klasse: string, thema: string, schwierigkeit: string, variation: string, index: number): Promise<Frage | null> {
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
        max_tokens: 300,
        temperature: 0.85,
        messages: [{ role: "user", content: bauPrompt(fach, klasse, thema, schwierigkeit, variation, index) }],
      }),
    });

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

    // Konvertiere loesung-text -> richtig-index
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

    // FUENF PARALLELE CALLS - jede generiert nur 1 frage, viel schneller
    const promises = Array.from({ length: 5 }, (_, i) =>
      generiereEineFrage(fach, klasse, thema, schwierigkeitText, variationsId, i),
    );
    const results = await Promise.all(promises);
    const fragen = results.filter((f): f is Frage => f !== null);

    if (fragen.length === 0) {
      return NextResponse.json({ error: "Fehler" }, { status: 500 });
    }

    return NextResponse.json({ fragen });
  } catch (error) {
    console.error("Fehler:", error);
    return NextResponse.json({ error: "Fehler" }, { status: 500 });
  }
}
