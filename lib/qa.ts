// lib/qa.ts — fachliche Pruefung eines Short-Pakets.
// Eigener Anthropic-Aufruf, konservativ: im Zweifel ok=false.
// Nur serverseitig nutzen (verwendet ANTHROPIC_API_KEY).

import { callAnthropic, parseJsonLoose, type ChatMessage } from "@/lib/anthropic";
import type { Paket } from "@/lib/brain";

export type QaErgebnis = {
  ok: boolean;
  problems: string[];
};

const SYSTEM_PROMPT = `Du bist ein strenger Fachgutachter fuer Schul-Mathematik und -Physik.
Deine Aufgabe: Pruefe das vorgelegte Lernvideo-Skript auf FACHLICHE Korrektheit.
Du achtest auf: Rechenfehler, falsche oder unsauber notierte Formeln, falsche Definitionen,
irrefuehrende oder missverstaendliche Aussagen, fehlende Voraussetzungen.
Du bist konservativ: Wenn du dir nicht sicher bist oder etwas missverstaendlich ist, markierst du es als Problem.
Du bewertest NICHT Stil, Tonfall, Laenge oder Marketing — nur die fachliche Richtigkeit.`;

function buildUserPrompt(paket: Paket): string {
  const onScreen = paket.onScreen.map((s, i) => `  ${i + 1}. ${s}`).join("\n");
  return `Pruefe das folgende Material fachlich.

THEMA: ${paket.thema}

SKRIPT (Voiceover):
${paket.skript}

ON-SCREEN-TEXTE:
${onScreen}

Rechne relevante Schritte selbst nach. Antworte AUSSCHLIESSLICH mit JSON in GENAU dieser Form:
{
  "ok": true oder false,
  "problems": ["string", "..."]
}

- "ok": true NUR wenn alles fachlich korrekt und nicht irrefuehrend ist.
- "ok": false sobald mindestens ein fachliches Problem vorliegt — oder im Zweifel.
- "problems": konkrete, kurze Beschreibungen der gefundenen Probleme. Bei ok=true ein leeres Array.`;
}

function normalisiere(roh: unknown): QaErgebnis {
  if (!roh || typeof roh !== "object") {
    // Antwort unbrauchbar -> konservativ als Problem werten.
    return { ok: false, problems: ["QA-Antwort konnte nicht ausgewertet werden."] };
  }
  const r = roh as Record<string, unknown>;

  const problems = Array.isArray(r.problems)
    ? r.problems.map((p) => String(p).trim()).filter((p) => p.length > 0)
    : [];

  // ok nur, wenn das Modell explizit true sagt UND keine Probleme nennt.
  const ok = r.ok === true && problems.length === 0;

  return { ok, problems };
}

/**
 * Prueft skript + onScreen eines Pakets auf fachliche Korrektheit.
 * Faengt Fehler ab und gibt im Fehlerfall konservativ ok=false zurueck.
 */
export async function checkMathe(paket: Paket): Promise<QaErgebnis> {
  const messages: ChatMessage[] = [
    { role: "user", content: buildUserPrompt(paket) },
    // Prefill fuer sauberes JSON.
    { role: "assistant", content: "{" },
  ];

  try {
    const antwort = await callAnthropic({
      system: SYSTEM_PROMPT,
      messages,
      maxTokens: 800,
      temperature: 0, // deterministische, strenge Pruefung
    });

    const json = antwort.trim().startsWith("{") ? antwort : `{${antwort}`;
    const roh = parseJsonLoose(json);
    return normalisiere(roh);
  } catch (e) {
    return { ok: false, problems: [`QA-Aufruf fehlgeschlagen: ${String(e)}`] };
  }
}
