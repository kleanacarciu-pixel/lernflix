import { NextResponse } from "next/server";

export const maxDuration = 60;

type Bild = { media_type: string; data: string };

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const fach = body.fach === "physik" ? "Physik" : "Mathematik";
    const klasse = (body.klasse || "").toString().slice(0, 20);
    const schwierigkeiten = (body.schwierigkeiten || "").toString().slice(0, 500);
    const bilder: Bild[] = Array.isArray(body.bilder) ? body.bilder.slice(0, 10) : [];

    if (bilder.length === 0) {
      return NextResponse.json({ error: "Keine Fotos erhalten" }, { status: 400 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      console.error("ANTHROPIC_API_KEY fehlt");
      return NextResponse.json({ error: "Der Server ist nicht richtig eingerichtet." }, { status: 500 });
    }

    const fokusHinweis = schwierigkeiten
      ? `\n\nDIE SCHÜLERIN HAT SCHWIERIGKEITEN ODER WÜNSCHE:\n"${schwierigkeiten}"\nBerücksichtige das. Bei den Themen, die sie als schwer empfindet, mach die Erklärung besonders einfach und die Beispiele konkreter. Wenn sie ein Thema als wichtig markiert, das in den Fotos vorkommt, gib ihm Priorität.`
      : "";

    const textPrompt = `Du bist eine deutsche ${fach}-Lehrerin. Schau dir alle Fotos sehr genau an (Stofflisten, Buchseiten, Übungen einer Klasse-${klasse}-Schülerin).

DEINE AUFGABE:
Liste ALLE Themen und Unterthemen auf, die in den Fotos vorkommen. Sei vollständig — kein Thema auslassen.${fokusHinweis}

Pro Thema gib mir kompakt aber konkret:
- name: kurzer Themen-Name
- erklaerung: 2–3 Sätze in einfacher kindgerechter Sprache, mit Alltagsbeispiel ("Stell dir vor...")
- formeln: Liste der relevanten Formeln (echte Symbole: ², ³, √, ·, π, °)
- regel: die wichtigste Regel oder das Gesetz in 1 Satz
- beispiel_aufgabe: konkrete kleine Beispielaufgabe mit Zahlen
- beispiel_loesung: Schritt-für-Schritt-Lösung (3–4 kurze Schritte)
- uebung_aufgabe: eine Übungsaufgabe für den Schüler
- uebung_loesung: ausführliche Lösung der Übungsaufgabe

WICHTIG:
- Verwende echte deutsche Umlaute: ä ö ü ß. Niemals "ae oe ue ss".
- Erwähne niemals KI, AI, Sprachmodelle, Anthropic, Claude.
- Antworte AUSSCHLIESSLICH mit gültigem JSON in dieser Form, keine Vorrede, kein Markdown, keine Backticks:

{"themen":[{"name":"...","erklaerung":"...","formeln":["...","..."],"regel":"...","beispiel_aufgabe":"...","beispiel_loesung":"...","uebung_aufgabe":"...","uebung_loesung":"..."}]}`;

    const content: unknown[] = bilder.map((b) => ({
      type: "image",
      source: { type: "base64", media_type: b.media_type, data: b.data },
    }));
    content.push({ type: "text", text: textPrompt });

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 6000,
        messages: [
          { role: "user", content },
          { role: "assistant", content: "{" },
        ],
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error("Anthropic API Fehler (Themen):", response.status, JSON.stringify(data).slice(0, 800));
      const detail = data?.error?.message || `Statuscode ${response.status}`;
      return NextResponse.json({ error: `Beim Auswerten der Fotos: ${detail}` }, { status: 500 });
    }

    let raw = data.content[0].text || "";
    raw = "{" + raw;
    raw = raw.replace(/```json/gi, "").replace(/```/g, "").trim();

    const ersterKlammerauf = raw.indexOf("{");
    const letzterKlammerzu = raw.lastIndexOf("}");
    if (ersterKlammerauf >= 0 && letzterKlammerzu > ersterKlammerauf) {
      raw = raw.slice(ersterKlammerauf, letzterKlammerzu + 1);
    }

    let parsed: { themen?: unknown[] } = {};
    try {
      parsed = JSON.parse(raw);
    } catch {
      try {
        let repariert = raw;
        const offCurly = (repariert.match(/{/g) || []).length - (repariert.match(/}/g) || []).length;
        const offSquare = (repariert.match(/\[/g) || []).length - (repariert.match(/\]/g) || []).length;
        for (let i = 0; i < offSquare; i++) repariert += "]";
        for (let i = 0; i < offCurly; i++) repariert += "}";
        parsed = JSON.parse(repariert);
      } catch (e) {
        console.error("Themen-JSON konnte nicht geparst werden:", e, "Anfang:", raw.slice(0, 300));
        return NextResponse.json({ error: "Die Themen konnten nicht ausgelesen werden. Bitte versuche es nochmal." }, { status: 500 });
      }
    }

    const themen = Array.isArray(parsed.themen) ? parsed.themen : [];
    if (themen.length === 0) {
      return NextResponse.json({ error: "Es konnten keine Themen aus den Fotos erkannt werden." }, { status: 500 });
    }

    return NextResponse.json({ themen });
  } catch (error) {
    console.error("Themen API Fehler:", error);
    const meldung = error instanceof Error ? error.message : "unbekannter Fehler";
    return NextResponse.json({ error: `Fehler beim Auswerten: ${meldung}` }, { status: 500 });
  }
}
