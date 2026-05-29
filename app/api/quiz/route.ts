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

    // Variations-Stichworte sorgen dafuer, dass die Fragen jedes Mal anders sind.
    const stilArten = [
      "konkrete Zahlenaufgaben", "Textaufgaben aus dem Alltag", "Begriffe und Definitionen abfragen",
      "Fehler in Rechnungen erkennen", "Vergleichs- und Reihenfolge-Aufgaben", "Anwendungsbeispiele aus der Praxis",
      "Aufgaben mit kleinen Zahlen", "Aufgaben mit groesseren Zahlen", "Schaetzaufgaben",
      "Visuelle Beschreibungen", "Lueckentext-Style", "Was-passiert-wenn-Fragen",
    ];
    const stil1 = stilArten[Math.floor(Math.random() * stilArten.length)];
    const stil2 = stilArten[Math.floor(Math.random() * stilArten.length)];
    const variationsId = Math.random().toString(36).slice(2, 10);

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
        temperature: 1.0,
        messages: [
          {
            role: "user",
            content: `Erstelle 5 Multiple-Choice-Fragen zum Thema "${thema}" für ${fach} in ${klasse}. Schwierigkeit: ${schwierigkeitText}.

WICHTIG — diese Fragen muessen ABWECHSLUNGSREICH sein:
- Variations-ID dieses Aufrufs: ${variationsId} (nutze andere Zahlen und Beispiele als bei anderen IDs).
- Mische diese Aufgabentypen: ${stil1} und ${stil2}.
- Verwende NEUE Zahlen, neue Kontexte und neue Formulierungen — KEINE Standard-Lehrbuch-Aufgaben.
- Mische einfachere und kniffligere Fragen innerhalb der gewuenschten Schwierigkeit.
- Bei richtiger Antwort: variiere die Position (mal A, mal B, mal C, mal D — nicht immer dieselbe).

Jede Frage hat 4 Antworten, nur eine ist richtig. Die Fragen muessen genau zur Klassenstufe passen — nicht zu schwer, nicht zu leicht. Verwende echte deutsche Umlaute (ä ö ü ß), niemals "ae oe ue ss". Erwaehne niemals KI/AI/Sprachmodelle/Claude/Anthropic.

Antworte NUR mit JSON ohne Markdown ohne Backticks: {"fragen":[{"frage":"?","antworten":["A","B","C","D"],"richtig":0,"erklaerung":"kurz"}]}`,
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