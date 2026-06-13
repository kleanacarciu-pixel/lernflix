import { NextResponse } from "next/server";

export const maxDuration = 30;

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

    // Speed-optimierter prompt: kuerzer + niedrigere max_tokens
    // Klare anleitung -> weniger nachdenken -> schnellere antwort
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY || "",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 750,
        temperature: 0.9,
        messages: [
          {
            role: "user",
            content: `5 MC-Fragen ${fach} ${klasse} "${thema}" ${schwierigkeitText}. ID:${variationsId}
Regeln: 4 Antworten/Frage, eine richtig, variiere Position, neue Zahlen, deutsche Umlaute, kurze Erklaerung, "loesung"=Wortlaut (nicht Index), nie KI/AI erwaehnen.
JSON only:{"fragen":[{"frage":"...","antworten":["a","b","c","d"],"loesung":"...","erklaerung":"..."}]}`,
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: "Fehler" }, { status: 500 });
    }

    let text = data.content[0].text.trim();
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start !== -1 && end !== -1) {
      text = text.substring(start, end + 1);
    }

    const quizData = JSON.parse(text);

    // Konvertiere "loesung" (text der richtigen antwort) -> "richtig" (index)
    if (quizData && Array.isArray(quizData.fragen)) {
      quizData.fragen = quizData.fragen.map((f: { frage?: string; antworten?: string[]; loesung?: string; richtig?: number; erklaerung?: string }) => {
        const antworten = Array.isArray(f.antworten) ? f.antworten : [];
        let richtig = 0;
        if (typeof f.loesung === "string" && antworten.length > 0) {
          const idx = antworten.findIndex((a) => a === f.loesung);
          if (idx !== -1) {
            richtig = idx;
          } else {
            const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, " ");
            const idx2 = antworten.findIndex((a) => norm(a) === norm(f.loesung!));
            if (idx2 !== -1) richtig = idx2;
          }
        } else if (typeof f.richtig === "number" && f.richtig >= 0 && f.richtig < antworten.length) {
          richtig = f.richtig;
        }
        return { frage: f.frage, antworten, richtig, erklaerung: f.erklaerung };
      });
    }

    return NextResponse.json(quizData);
  } catch (error) {
    console.error("Fehler:", error);
    return NextResponse.json({ error: "Fehler" }, { status: 500 });
  }
}
