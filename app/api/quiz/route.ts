import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const thema = body.thema || "Mathematik";
    const schwierigkeit = body.schwierigkeit || "mittel";

    let schwierigkeitText = "mittelschwer";
    if (schwierigkeit === "leicht") schwierigkeitText = "einfach fuer Kinder";
    if (schwierigkeit === "schwer") schwierigkeitText = "schwierig fuer fortgeschrittene Schueler";

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY || "",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 800,
        messages: [
          {
            role: "user",
            content: `Erstelle 5 Multiple-Choice-Fragen zum Thema ${thema} auf Deutsch. Schwierigkeit: ${schwierigkeitText}. Fragen sollen witzig und mit Alltagsbeispielen sein. Antworte NUR mit reinem JSON ohne Markdown: {"fragen":[{"frage":"?","antworten":["A","B","C","D"],"richtig":0,"erklaerung":"kurz"}]}`,
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: "API Fehler" }, { status: 500 });
    }

    let text = data.content[0].text.trim();
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const quizData = JSON.parse(text);
    return NextResponse.json(quizData);
  } catch (error) {
    console.error("Fehler:", error);
    return NextResponse.json({ error: "Fehler" }, { status: 500 });
  }
}