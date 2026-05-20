import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const thema = body.thema || "Mathematik";
    const schwierigkeit = body.schwierigkeit || "mittel";

    let schwierigkeitText = "mittelschwer";
    if (schwierigkeit === "leicht") schwierigkeitText = "einfach fuer Anfaenger";
    if (schwierigkeit === "mittel") schwierigkeitText = "mittelschwer";
    if (schwierigkeit === "schwer") schwierigkeitText = "schwierig fuer Fortgeschrittene";

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: `Du bist ein witziger deutscher Mathe-Lehrer. Erstelle genau 5 Multiple-Choice-Fragen zum Thema ${thema} fuer deutsche Schueler. Schwierigkeit: ${schwierigkeitText}. Regeln: Fragen muessen witzig und interessant sein mit Alltagsbeispielen. Jede Frage hat genau 4 Antwortmoeglichkeiten. Nur eine Antwort ist richtig. Benutze Emojis. Alles auf Deutsch. Antworte NUR mit diesem JSON ohne Markdown: {"fragen":[{"frage":"Fragetext?","antworten":["A","B","C","D"],"richtig":0,"erklaerung":"Erklaerung"}]}`,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== "text") {
      throw new Error("Keine Textantwort");
    }

    const text = content.text.trim();
    const quizData = JSON.parse(text);
    return NextResponse.json(quizData);
  } catch (error) {
    console.error("Fehler:", error);
    return NextResponse.json(
      { error: "Fehler beim Erstellen" },
      { status: 500 }
    );
  }
}