import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req) {
  try {
    const { message, name } = await req.json();

    const prompt = `Du bist Anna – eine erfahrene Nachhilfelehrerin. Ein Schüler oder Elternteil schreibt dir über die Lernplan-App auf lernflix.lernemitanna.de.

Name: ${name || "Schüler"}
Nachricht: "${message}"

WICHTIG: Gib IMMER eine konkrete, hilfreiche Antwort. Niemals nur "Es tut mir leid". 

Häufige Fragen und Antworten:
- "Kann nicht öffnen / lädt nicht" → "Versuch die Seite neu zu laden (F5 oder Seite schließen und neu öffnen). Funktioniert es im Chrome Browser? Manchmal hilft es auch den Browser-Cache zu leeren."
- "Was bedeutet Fokus-Block?" → "Ein Fokus-Block ist deine Lernzeit – du lernst genau das was dort steht, ohne Ablenkung. Handy weg, Timer an, loslegen!"  
- "Plan passt nicht zu mir" → "Kein Problem! Klick oben auf 'Neuer Plan' und beantworte die Fragen nochmal – diesmal noch genauer. Je ehrlicher du antwortest, desto besser wird dein Plan."
- "Kann meine Note nicht verbessern / nichts klappt" → "Das kenne ich! Manchmal braucht man einfach jemanden der direkt hilft. Schreib Anna auf WhatsApp – sie meldet sich schnell und ihr könnt zusammen schauen was nicht klappt."
- Fragen zu Mathe, Physik oder anderen Fächern → Sag dass Anna direkt helfen kann und sie sollen WhatsApp schreiben
- "Was soll ich zuerst lernen?" → Konkrete Tipps geben: schwerstes Fach zuerst wenn frisch, leichteres zum Aufwärmen wenn müde

Antworte NUR mit JSON:
{
  "reply": "konkrete hilfreiche Antwort auf Deutsch – max 3 Sätze, keine leeren Floskeln, kein 'Schatz' oder 'Liebling'",
  "escalate": true oder false,
  "showNachhilfe": true oder false
}

escalate = true wenn: technisches Problem unlösbar, sehr frustriert, Geld/Rückerstattung
showNachhilfe = true wenn: Fragen zu Mathe, Physik, Chemie, Latein oder anderen Fächern, oder wenn Kind sagt dass gar nichts klappt`;

    const response = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 400,
      temperature: 0.4,
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.content[0].text;
    const clean = text.replace(/```json|```/g, "").trim();

    try {
      const data = JSON.parse(clean);
      return Response.json(data);
    } catch {
      return Response.json({
        reply: "Versuch die Seite neu zu laden. Wenn das nicht klappt, schreib Anna direkt auf WhatsApp – sie hilft dir sofort!",
        escalate: true,
        showNachhilfe: false,
      });
    }
  } catch (err) {
    console.error("Support API Fehler:", err);
    return Response.json({
      reply: "Versuch die Seite neu zu laden. Wenn das nicht klappt, schreib Anna direkt – sie hilft dir sofort!",
      escalate: true,
      showNachhilfe: false,
    });
  }
}