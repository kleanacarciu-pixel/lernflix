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
- Variiere welche Position die richtige Antwort hat (mal die erste, mal die zweite, mal die dritte, mal die vierte).

Jede Frage hat genau 4 Antworten. Genau eine ist richtig. Die Fragen muessen zur Klassenstufe passen. Verwende echte deutsche Umlaute (ä ö ü ß), niemals "ae oe ue ss". Erwaehne niemals KI/AI/Sprachmodelle/Claude/Anthropic.

KRITISCH FUER DIE RICHTIGE ANTWORT:
Statt einer Index-Zahl gib das Feld "loesung" mit dem WORTLAUT der richtigen Antwort genau wie er auch in der "antworten"-Liste steht (selbe Schreibweise, selbe Zeichen). Das ist die einzige Quelle der Wahrheit — die Reihenfolge der Antworten ist egal.

Antworte NUR mit JSON ohne Markdown ohne Backticks. Beispiel-Struktur:
{"fragen":[{"frage":"Was ist 2+3?","antworten":["4","5","6","7"],"loesung":"5","erklaerung":"2+3=5"}]}`,
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
    // Das ist robuster als wenn die KI selbst den index liefert
    // (sie hat oft 1-basiert statt 0-basiert verstanden -> falsche-antwort-bug)
    if (quizData && Array.isArray(quizData.fragen)) {
      quizData.fragen = quizData.fragen.map((f: { frage?: string; antworten?: string[]; loesung?: string; richtig?: number; erklaerung?: string }) => {
        const antworten = Array.isArray(f.antworten) ? f.antworten : [];
        let richtig = 0;
        if (typeof f.loesung === "string" && antworten.length > 0) {
          // exakter match zuerst, sonst normalisierter vergleich
          const idx = antworten.findIndex((a) => a === f.loesung);
          if (idx !== -1) {
            richtig = idx;
          } else {
            const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, " ");
            const idx2 = antworten.findIndex((a) => norm(a) === norm(f.loesung!));
            if (idx2 !== -1) richtig = idx2;
          }
        } else if (typeof f.richtig === "number" && f.richtig >= 0 && f.richtig < antworten.length) {
          // fallback fuer altes format
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