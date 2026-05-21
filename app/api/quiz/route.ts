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
        max_tokens: 1000,
        messages: [
          {
            role: "user",
            content: `Du bist ein witziger deutscher Mathe-Lehrer. Erstelle genau 5 Multiple-Choice-Fragen zum Thema ${thema} fuer deutsche Schueler. Schwierigkeit: ${schwierigkeitText}. Jede Frage hat genau 4 Antwortmoeglichkeiten. Nur eine Antwort ist richtig. Benutze Emojis. Alles auf Deutsch. Antworte NUR mit reinem JSON ohne Markdown ohne Backticks: {"fragen":[{"frage":"Fragetext?","antworten":["A","B","C","D"],"richtig":0,"erklaerung":"Erklaerung"}]}`,
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Anthropic Fehler:", JSON.stringify(data));
      return NextResponse.json({ error: "API Fehler" }, { status: 500 });
    }

    let text = data.content[0].text.trim();
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const quizData = JSON.parse(text);
    return NextResponse.json(quizData);
  } catch (error) {
    console.error("Fehler:", error);
    return NextResponse.json({ error: "Fehler beim Erstellen" }, { status: 500 });
  }
}