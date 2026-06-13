import { NextResponse } from "next/server";

export const maxDuration = 45;

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

    const variationsId = Math.random().toString(36).slice(2, 8);

    // Speed-optimierter prompt: kuerzer + niedrigere max_tokens
    // Klare anleitung -> weniger nachdenken -> schnellere antwort
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY || "",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1200,
        temperature: 0.7,
        messages: [
          {
            role: "user",
            content: `Erstelle 5 ${fach}-Multiple-Choice-Fragen fuer ${klasse} zum Thema "${thema}" (${schwierigkeitText}). Variation: ${variationsId}.

== ABSOLUTE REGELN ==

1. FACHLICH KORREKT
- Jede Frage ist eine ECHTE Mathe-/Physik-Aufgabe zum Thema "${thema}" - kein Allgemeinwissen, keine Trick-Fragen
- BEISPIEL FALSCH: "Wie viele Finger zeigt die Hand?" (eine Hand hat 5 Finger, nicht 10!)
- BEISPIEL FALSCH: "Wie viele Aepfel sind es?" (kein Kontext)
- BEISPIEL RICHTIG (Klasse 1, Addition): "Anna hat 3 Aepfel und bekommt 4 dazu. Wie viele Aepfel hat sie?"
- BEISPIEL RICHTIG (Klasse 8, Pythagoras): "Ein rechtwinkliges Dreieck hat die Katheten 3 cm und 4 cm. Wie lang ist die Hypotenuse?"

2. RECHNE NACH
- Bevor du die Loesung notierst: rechne die Aufgabe SELBST durch
- Die "loesung" ist NUR der mathematisch/physikalisch nachweisbar korrekte Wert
- Die "erklaerung" muss die richtige Rechnung zeigen (1-2 Saetze), nicht raten

3. SELBSTSTAENDIG VERSTAENDLICH
- Frage muss aus REINEM TEXT vollstaendig loesbar sein
- KEINE Verweise auf Bilder/Skizzen/Diagramme/Tabellen
- Alle Werte/Zahlen direkt in der Frage

4. ANTWORTEN
- Genau 4 Antworten, eine richtig, drei plausibel-aber-falsch
- Variiere die Position der richtigen Antwort (nicht immer A oder B)
- "loesung" = WORTLAUT der richtigen Antwort (Text, nicht Index)
- Echte deutsche Umlaute (ae->ä, oe->ö, ue->ü, ß)

5. NIE: KI/AI/Anthropic/Claude erwaehnen.

Antwort NUR als JSON ohne Markdown:
{"fragen":[{"frage":"...","antworten":["a","b","c","d"],"loesung":"<wortlaut>","erklaerung":"<rechenweg in 1-2 saetzen>"}]}`,
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

    // Konvertiere "loesung" (text der richtigen antwort) -> "richtig" (index)
    if (quizData && Array.isArray(quizData.fragen)) {
      quizData.fragen = quizData.fragen.map((f: { frage?: string; antworten?: string[]; loesung?: string; richtig?: number; erklaerung?: string }) => {
        const antworten = Array.isArray(f.antworten) ? f.antworten : [];
        let richtig = 0;
        if (typeof f.loesung === "string" && antworten.length > 0) {
          const idx = antworten.findIndex((a) => a === f.loesung);
          if (idx !== -1) {
            richtig = idx;
          } else {
            const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, " ");
            const idx2 = antworten.findIndex((a) => norm(a) === norm(f.loesung!));
            if (idx2 !== -1) richtig = idx2;
          }
        } else if (typeof f.richtig === "number" && f.richtig >= 0 && f.richtig < antworten.length) {
          richtig = f.richtig;
        }
        return { frage: f.frage, antworten, richtig, erklaerung: f.erklaerung };
      });
    }

    return NextResponse.json(quizData);
  } catch (error) {
    console.error("Fehler:", error);
    return NextResponse.json({ error: "Fehler" }, { status: 500 });
  }
}
