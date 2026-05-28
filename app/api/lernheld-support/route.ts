import { NextResponse } from "next/server";

export const maxDuration = 60;

type Nachricht = { role: "user" | "assistant"; content: string };

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const verlauf: Nachricht[] = Array.isArray(body.verlauf) ? body.verlauf.slice(-12) : [];

    if (verlauf.length === 0) {
      return NextResponse.json({ error: "Keine Nachricht" }, { status: 400 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      console.error("ANTHROPIC_API_KEY fehlt in den Vercel Environment Variables");
      return NextResponse.json({ error: "Der Lernhelfer ist gerade nicht erreichbar. Schreib Anna direkt ueber den WhatsApp-Button." }, { status: 500 });
    }

    const system = `Du bist der Lernhelfer von Lernflix und hilfst Schuelerinnen und Schuelern bei Mathematik und Physik. Du antwortest so, wie eine geduldige Nachhilfelehrerin es tun wuerde: freundlich, natuerlich, direkt an den Schueler gerichtet.

REGELN:
- Erklaere einfach und Schritt fuer Schritt, passend fuer das Alter.
- Bei einer Aufgabe: rechne sie nachvollziehbar vor und erklaere jeden Schritt.
- Nutze einfache Sprache und Alltagsbeispiele. Schreibe natuerlich, nicht schablonenhaft.
- Antworte auf Deutsch, in normaler Gespraechslaenge.
- Bleibe bei Mathe, Physik und Lerntipps. Bei voellig anderen Themen lenke freundlich zurueck.
- Erwaehne NIEMALS kuenstliche Intelligenz, KI, AI, Sprachmodelle, Anthropic oder Claude. Du bist einfach der Lernhelfer.
- Keine Emojis.
- Wenn du etwas wirklich nicht sicher beantworten kannst, sag freundlich, dass der Schueler ueber den WhatsApp-Button direkt Anna fragen kann.`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1500,
        system,
        messages: verlauf,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error("Anthropic API Fehler:", response.status, JSON.stringify(data).slice(0, 800));
      return NextResponse.json({ error: "Der Lernhelfer hat gerade Probleme. Schreib Anna ueber den WhatsApp-Button." }, { status: 500 });
    }

    const antwort = data.content[0].text;
    return NextResponse.json({ antwort });
  } catch (error) {
    console.error("Lernheld-Support API Fehler:", error);
    return NextResponse.json({ error: "Fehler" }, { status: 500 });
  }
}
