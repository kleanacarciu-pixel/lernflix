// lib/brain.ts — erzeugt aus (Thema, Klassenstufe) ein fertiges Short-Paket.
// Nur serverseitig nutzen (verwendet ANTHROPIC_API_KEY).

import { callAnthropic, parseJsonLoose, type ChatMessage } from "@/lib/anthropic";

export type Paket = {
  thema: string;
  hook: string;
  skript: string;
  onScreen: string[];
  caption: string;
  hashtags: string[];
  cta: string;
};

const SYSTEM_PROMPT = `Du bist "Anna", eine Mathe- und Physik-Tutorin mit eigener Lernmarke.
Du schreibst Skripte fuer ein deutsches, faceless Short-Video (Hochformat 9:16, 30-45 Sekunden).
Zielgruppe: Schuelerinnen/Schueler UND deren Eltern.
Ton: freundlich, klar, selbstbewusst, auf Augenhoehe — kein Kinderkram, keine Anbiederung.
Du sprichst echtes Deutsch mit Umlauten (ä ö ü ß). Du erwaehnst nie KI/AI.

FACHLICHE SORGFALT (oberste Prioritaet — ein strenger Fachgutachter prueft jedes Paket hinterher):
- Rechne jeden Schritt zuerst selbst vollstaendig durch und verifiziere das Ergebnis, bevor du etwas aufschreibst.
- Definiere jede Variable in einer Formel eindeutig (z. B. "p ist die reine Prozentzahl, also 40 — ohne %-Zeichen").
- Notation und Einheiten muessen ueberall widerspruchsfrei sein: Wenn eine Formel eine Groesse als reine Zahl ohne Einheit braucht, schreibe sie auch im Text und in onScreen ohne Einheit. Vermische nie "p = 40 %" und "p = 40" in derselben Rechnung.
- Einheiten konsequent fuehren: gib sie an, wo sie hingehoeren (Ergebnisse), und lasse sie weg, wo die Formel dimensionslose Werte erwartet.
- Deutsche Schreibweise: Dezimalkomma (0,85 statt 0.85), korrekte Symbole (× ÷ statt * /), saubere Bruchschreibweise.
- skript und onScreen muessen exakt dieselben Zahlen, Formeln und Zwischenschritte zeigen — kein Widerspruch zwischen Voiceover und Einblendung.
- Keine irrefuehrenden Vereinfachungen, keine fehlenden Voraussetzungen.`;

// Genaue Zielstruktur als Beispiel im Prompt, damit das Modell das Schema trifft.
const SCHEMA_HINWEIS = `Antworte AUSSCHLIESSLICH mit einem JSON-Objekt in GENAU dieser Form (keine Erklaerung davor oder danach):
{
  "thema": "string",
  "hook": "string (0-3 Sek., max 1 Satz, macht neugierig)",
  "skript": "string (Voiceover-Text, fuer 30-45 Sek. Sprechzeit, in ganzen Saetzen)",
  "onScreen": ["string", "string"],
  "caption": "string (kurzer Post-Text)",
  "hashtags": ["#mathe", "#klasse9"],
  "cta": "string mit lernflix.lernemitanna.de"
}

Regeln:
- "onScreen": 3-6 kurze Textbausteine, die nacheinander im Video eingeblendet werden (Formeln, Zwischenschritte, Merksatz).
- "skript" und "onScreen" muessen fachlich uebereinstimmen und EXAKT dieselben Zahlen, Formeln und Einheiten-Konventionen nutzen (siehe Sorgfalts-Regeln).
- Pruefe vor der Ausgabe noch einmal: Stimmt jede Rechnung? Ist die Notation in Formel, Text und onScreen widerspruchsfrei? Sind Einheiten konsistent?
- "hashtags": 4-8 relevante deutsche Hashtags, jeweils mit fuehrendem #.
- "cta": enthaelt den Link lernflix.lernemitanna.de.`;

function buildUserPrompt(thema: string, klassenstufe: string): string {
  return `Erstelle ein Short-Paket.
Thema: "${thema}"
Klassenstufe: "${klassenstufe}"

${SCHEMA_HINWEIS}`;
}

function normalisiere(roh: unknown, thema: string): Paket {
  if (!roh || typeof roh !== "object") {
    throw new Error("brain: Antwort ist kein Objekt.");
  }
  const r = roh as Record<string, unknown>;

  const str = (v: unknown, fallback = ""): string =>
    typeof v === "string" ? v.trim() : fallback;

  const strArr = (v: unknown): string[] =>
    Array.isArray(v) ? v.map((x) => String(x).trim()).filter((x) => x.length > 0) : [];

  const paket: Paket = {
    thema: str(r.thema, thema) || thema,
    hook: str(r.hook),
    skript: str(r.skript),
    onScreen: strArr(r.onScreen),
    caption: str(r.caption),
    hashtags: strArr(r.hashtags).map((h) => (h.startsWith("#") ? h : `#${h}`)),
    cta: str(r.cta),
  };

  // Minimale Plausibilitaet — sonst lohnt sich die QA gar nicht.
  if (!paket.hook || !paket.skript || paket.onScreen.length === 0) {
    throw new Error("brain: Pflichtfelder (hook/skript/onScreen) fehlen.");
  }

  return paket;
}

/**
 * Erzeugt ein Short-Paket fuer das gegebene Thema/Klassenstufe.
 * Das Modell wird per Prompt strikt auf reines JSON festgelegt; das Parsing
 * ist robust (Markdown-Fences/Prosa drumherum werden toleriert).
 */
export async function generatePaket(thema: string, klassenstufe: string): Promise<Paket> {
  const messages: ChatMessage[] = [
    { role: "user", content: buildUserPrompt(thema, klassenstufe) },
  ];

  const antwort = await callAnthropic({
    system: SYSTEM_PROMPT,
    messages,
    maxTokens: 1500,
    temperature: 0.7,
  });

  const roh = parseJsonLoose(antwort);
  return normalisiere(roh, thema);
}
