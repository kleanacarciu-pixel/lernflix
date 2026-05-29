import { NextResponse } from "next/server";

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

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY || "",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1500,
        messages: [
          {
            role: "user",
            content: `Erstelle 5 Multiple-Choice-Fragen zum Thema "${thema}" für ${fach} in ${klasse}. Schwierigkeit: ${schwierigkeitText}. Jede Frage hat 4 Antworten, nur eine ist richtig. Die Fragen müssen genau zur Klassenstufe passen — nicht zu schwer, nicht zu leicht. Verwende echte deutsche Umlaute (ä ö ü ß), niemals "ae oe ue ss". Erwähne niemals KI/AI/Sprachmodelle/Claude/Anthropic. Antworte NUR mit JSON ohne Markdown ohne Backticks: {"fragen":[{"frage":"?","antworten":["A","B","C","D"],"richtig":0,"erklaerung":"kurz"}]}`,
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
    return NextResponse.json(quizData);
  } catch (error) {
    console.error("Fehler:", error);
    return NextResponse.json({ error: "Fehler" }, { status: 500 });
  }
}