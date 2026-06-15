// Gemeinsamer Anthropic-Client (nur serverseitig nutzen!).
// Wir sprechen die REST-API direkt via fetch an — gleiche Konvention wie
// app/api/quiz/route.ts. So bleibt der ANTHROPIC_API_KEY garantiert im Server.

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";

// Modell fuer die Content-Engine (Phase 1).
export const MODEL = "claude-sonnet-4-6";

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type AnthropicResponse = {
  content?: Array<{ text?: string }>;
};

export type CallOptions = {
  system?: string;
  messages: ChatMessage[];
  maxTokens?: number;
  temperature?: number;
  timeoutMs?: number;
};

/**
 * Ruft die Anthropic Messages-API auf und gibt den reinen Text der Antwort
 * zurueck. Wirft bei fehlendem Key oder API-Fehler — der Aufrufer entscheidet,
 * wie er damit umgeht.
 */
export async function callAnthropic(opts: CallOptions): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY fehlt (nur serverseitig setzen).");
  }

  const { system, messages, maxTokens = 1500, temperature = 0.7, timeoutMs = 45_000 } = opts;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(ANTHROPIC_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: maxTokens,
        temperature,
        ...(system ? { system } : {}),
        messages,
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      const errTxt = await res.text().catch(() => "");
      throw new Error(`Anthropic ${res.status}: ${errTxt.slice(0, 400)}`);
    }

    const data = (await res.json()) as AnthropicResponse;
    const text = data?.content?.map((c) => c.text ?? "").join("").trim();
    if (!text) {
      throw new Error("Anthropic-Antwort ohne Text.");
    }
    return text;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Robustes JSON-Parsing fuer LLM-Antworten. Entfernt Markdown-Fences,
 * schneidet auf das erste { ... letzte } zu und versucht ein paar gaengige
 * Reparaturen (trailing commas), bevor es aufgibt.
 */
export function parseJsonLoose<T = unknown>(raw: string): T {
  let t = raw.trim();

  // Markdown-Codefences entfernen.
  t = t.replace(/```json/gi, "").replace(/```/g, "").trim();

  // Auf das aeusserste JSON-Objekt zuschneiden.
  const start = t.indexOf("{");
  const end = t.lastIndexOf("}");
  if (start !== -1 && end !== -1 && end > start) {
    t = t.slice(start, end + 1);
  }

  const versuche = [
    t,
    // trailing commas vor } oder ] entfernen
    t.replace(/,(\s*[}\]])/g, "$1"),
  ];

  let letzterFehler: unknown = null;
  for (const kandidat of versuche) {
    try {
      return JSON.parse(kandidat) as T;
    } catch (e) {
      letzterFehler = e;
    }
  }
  throw new Error(`JSON-Parsing fehlgeschlagen: ${String(letzterFehler)}`);
}
