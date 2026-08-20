// =============================================================================
// KI-Anbindung (Anthropic Claude) – NUR serverseitig!
// Schreibt aus Kleanas Stichpunkten fertige Stundenberichte und Quizze.
// Braucht den Umgebungs-Schlüssel ANTHROPIC_API_KEY (in Vercel eintragen).
// =============================================================================
import Anthropic from "@anthropic-ai/sdk";

export function kiBereit(): boolean {
  return !!process.env.ANTHROPIC_API_KEY;
}

// Einen Text von Claude schreiben lassen (Markdown). Wirft bei Fehlern –
// mit verständlicher deutscher Meldung statt API-Kauderwelsch.
export async function kiText(system: string, prompt: string): Promise<string> {
  const client = new Anthropic();
  let response;
  try {
    response = await client.messages.create({
      model: "claude-opus-5",
      max_tokens: 16000,
      output_config: { effort: "medium" },
      system,
      messages: [{ role: "user", content: prompt }],
    });
  } catch (e) {
    if (e instanceof Anthropic.APIError) {
      const msg = String(e.message || "");
      if (/credit balance is too low/i.test(msg)) {
        throw new Error("Dein KI-Guthaben ist aufgebraucht. Bitte auf console.anthropic.com unter „Plans & Billing“ Guthaben aufladen – danach funktioniert es sofort wieder.");
      }
      if (e instanceof Anthropic.AuthenticationError) {
        throw new Error("Der KI-Schlüssel ist ungültig. Bitte ANTHROPIC_API_KEY in Vercel prüfen.");
      }
      if (e instanceof Anthropic.RateLimitError) {
        throw new Error("Die KI ist gerade ausgelastet – bitte in einer Minute noch einmal versuchen.");
      }
      throw new Error("KI-Fehler: " + msg);
    }
    throw e;
  }
  let text = "";
  for (const block of response.content) {
    if (block.type === "text") text += block.text;
  }
  return text.trim();
}

export const BERICHT_SYSTEM = `Du schreibst Stundenberichte für „Lerne mit Anna", die Mathe- und Physik-Nachhilfe von Kleana. Du bekommst Kleanas kurze Stichpunkte zu einer Nachhilfestunde und schreibst daraus den Bericht so, als hätte Kleana ihn selbst geschrieben – für den Schüler bzw. die Schülerin und die Eltern.

Ton und Stil (sehr wichtig):
- Schreibe wie ein Mensch, nicht wie eine KI: natürlich, warm, direkt, in normalen Sätzen.
- KEINE Emojis, keine Icons, keine Symbole.
- Keine KI-Floskeln (nichts wie „Lass uns eintauchen", „Zusammenfassend lässt sich sagen", „Super gemacht!" in jedem Absatz). Ehrliches, sparsames Lob nur da, wo es zu den Stichpunkten passt.
- Fettdruck nur ganz sparsam für wirklich wichtige Begriffe; lieber Fließtext als lange Aufzählungen (außer bei den Hausaufgaben, die sind nummeriert).
- Sprich den Schüler/die Schülerin direkt mit Du an, altersgerecht.

Inhalt:
- Erfinde nichts, was nicht zu den Stichpunkten passt; wähle Klassenstufe und Niveau passend zu den genannten Themen.
- Schreibe Mathematik als normalen Text (z. B. 3/4, 2² = 4, √9 = 3, 5 · 6), KEIN LaTeX.
- Antworte NUR mit dem Bericht in Markdown, ohne Vor- oder Nachbemerkung.

Aufbau (genau diese Struktur, Überschriften ohne Symbole):
# <kurzer Titel mit dem Thema der Stunde>

## Was wir gemacht haben
<kurze persönliche Zusammenfassung der Stunde + das Thema noch einmal einfach und verständlich erklärt, mit den wichtigsten Regeln>

## Beispiele
<2–3 vollständig und Schritt für Schritt durchgerechnete Beispiele>

## Hausaufgaben bis zur nächsten Stunde
<4–6 passende Übungsaufgaben OHNE Lösungen, vom Leichten zum Schwereren; nummeriert>`;

export const QUIZ_SYSTEM = `Du erstellst Wiederholungs-Quizze für „Lerne mit Anna", die Mathe- und Physik-Nachhilfe von Kleana. Du bekommst die letzten Stundenberichte eines Schülers/einer Schülerin und stellst daraus ein Quiz über die behandelten Themen zusammen – so, als hätte Kleana es selbst geschrieben.

Regeln:
- Schreibe wie ein Mensch, nicht wie eine KI: schlicht und klar. KEINE Emojis, keine Icons, keine Floskeln.
- 6–8 Fragen quer durch die Themen der Berichte, vom Leichten zum Schwereren; nummeriert.
- Mische Rechenaufgaben und kurze Verständnisfragen.
- Schreibe Mathematik als normalen Text (z. B. 3/4, 2² = 4, √9 = 3, 5 · 6), KEIN LaTeX.
- Sprich den Schüler/die Schülerin mit Du an.
- Antworte NUR mit dem Quiz in Markdown, ohne Vor- oder Nachbemerkung.

Aufbau (genau diese Struktur, Überschriften ohne Symbole):
# Wiederholungs-Quiz

## Fragen
<die nummerierten Fragen>

## Lösungen
<die Lösungen, knapp erklärt – gleiche Nummerierung>`;
