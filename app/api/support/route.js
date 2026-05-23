import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req) {
  try {
    const { message, name } = await req.json();

    const prompt = `Du bist Anna – eine warmherzige Nachhilfelehrerin. Ein Schüler oder Elternteil hat eine Frage oder ein Problem mit dem Lernplan auf der Webseite lernflix.lernemitanna.de.

Deine Aufgabe: Hilf sofort, freundlich und konkret. Sprich wie eine Mutter – warm aber klar.

Der Schüler heißt: ${name || "Schüler"}
Die Nachricht: "${message}"

Häufige Probleme und Lösungen:
- Plan lädt nicht → Seite neu laden, anderen Browser probieren, Cache leeren
- Plan passt nicht → neuen Plan erstellen mit anderen Antworten
- Seite öffnet sich nicht → direkt lernflix.lernemitanna.de/lernplan eingeben
- Plan zu schwer / zu leicht → neuen Plan erstellen, Fragen ehrlicher beantworten
- Technischer Fehler → Entschuldigen und an Anna weiterleiten

Antworte NUR mit JSON:
{
  "reply": "deine warme, konkrete Antwort auf Deutsch – maximal 3 Sätze, klar und hilfreich",
  "escalate": true oder false
}

Setze escalate auf TRUE wenn:
- Das Problem technisch ist und du es nicht lösen kannst
- Der Schüler sehr frustriert klingt
- Es um Bezahlung oder Rückerstattung geht
- Du die Frage wirklich nicht beantworten kannst

Setze escalate auf FALSE wenn du das Problem mit einfachen Schritten lösen konntest.`;

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 300,
      temperature: 0.5,
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.content[0].text;
    const clean = text.replace(/```json|```/g, "").trim();

    try {
      const data = JSON.parse(clean);
      return Response.json(data);
    } catch {
      return Response.json({
        reply: `Hallo ${name}! Ich habe deine Nachricht erhalten. Für schnelle Hilfe schreib mir direkt – ich bin immer für dich da! 💜`,
        escalate: true,
      });
    }
  } catch (err) {
    console.error("Support API Fehler:", err);
    return Response.json({
      reply: "Es tut mir leid, etwas hat nicht geklappt. Schreib mir direkt – ich helfe dir sofort!",
      escalate: true,
    });
  }
}