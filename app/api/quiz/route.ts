import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const thema = body.thema || "Mathematik";
    const schwierigkeit = body.schwierigkeit || "mittel";

    let schwierigkeitText = "mittelschwer";
    if (schwierigkeit === "leicht") schwierigkeitText = "einfach";
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
        max_tokens: 600,
        messages: [
          {
            role: "user",
            content: `5 Multiple-Choice-Fragen zu ${thema} auf Deutsch, ${schwierigkeitText}. Nur JSON: {"fragen":[{"frage":"?","antworten":["A","B","C","D"],"richtig":0,"erklaerung":"kurz"}]}`,
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
    const quizData = JSON.parse(text);
    return NextResponse.json(quizData);
  } catch (error) {
    console.error("Fehler:", error);
    return NextResponse.json({ error: "Fehler" }, { status: 500 });
  }
}