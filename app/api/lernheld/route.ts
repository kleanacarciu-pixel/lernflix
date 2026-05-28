import { NextResponse } from "next/server";

export const maxDuration = 60;

type ThemeKey = "rosa" | "navy" | "gold";
const THEME_CSS: Record<ThemeKey, string> = {
  rosa: "--dark:#2f8f86;--dark2:#3da199;--accent:#c97a96;--bg:#fdfaf6;--card:#ffffff;--line:#efe6dd;--ink:#33312e;--soft:#7d756c;--badge1:#f7eef0;--badge1t:#b3617d;--badge2:#e7f3f1;--badge2t:#2f8f86;--badge3:#fbf1e6;--badge3t:#b5803f;",
  navy: "--dark:#1e3a5f;--dark2:#2b507e;--accent:#3a8a4f;--bg:#f6f8fa;--card:#ffffff;--line:#e2e8ee;--ink:#23272e;--soft:#6b7689;--badge1:#fdeef0;--badge1t:#c0556b;--badge2:#e6f0fa;--badge2t:#2b507e;--badge3:#e6f3ea;--badge3t:#3a8a4f;",
  gold: "--dark:#8a6d3b;--dark2:#a07f45;--accent:#b89150;--bg:#fbf7ef;--card:#ffffff;--line:#ece1cd;--ink:#3a342a;--soft:#857a66;--badge1:#f9efe0;--badge1t:#a07f45;--badge2:#f2ecdd;--badge2t:#7a6336;--badge3:#f7f1e4;--badge3t:#9a7c3f;",
};

function buildHead(themeCss: string) {
  return `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Lernplan</title>
<style>
  :root{${themeCss}}
  *{box-sizing:border-box;margin:0;}
  html{-webkit-font-smoothing:antialiased;}
  body{background:var(--bg);color:var(--ink);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;line-height:1.65;font-size:16px;}
  .serif{font-family:Georgia,"Times New Roman",serif;}

  .banner{background:var(--dark);color:#fff;padding:30px 24px 26px;}
  .banner .kick{font-size:12px;letter-spacing:.16em;text-transform:uppercase;opacity:.8;font-weight:700;margin-bottom:8px;}
  .banner h1{font-family:Georgia,serif;font-size:30px;font-weight:700;margin-bottom:8px;}
  .banner p{opacity:.9;font-size:15px;max-width:640px;}

  .wrap{max-width:780px;margin:0 auto;padding:24px 18px 70px;}

  .sec-title{display:flex;align-items:center;gap:10px;font-size:22px;font-weight:700;margin:36px 0 16px;}
  .sec-sub{color:var(--soft);font-size:14.5px;margin:-10px 0 18px;}

  .block{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:22px 24px;margin:14px 0;box-shadow:0 2px 10px rgba(0,0,0,0.03);}
  .block-top{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin-bottom:10px;flex-wrap:wrap;}
  .block .time{font-size:13px;color:var(--soft);font-weight:600;}
  .block h4{font-size:19px;margin:2px 0 10px;display:flex;align-items:center;gap:10px;font-weight:700;}
  .block .circle{width:22px;height:22px;border:2px solid var(--line);border-radius:50%;flex-shrink:0;cursor:pointer;display:inline-block;}
  .block.done .circle{background:var(--dark);border-color:var(--dark);}
  .block p{font-size:15.5px;color:var(--ink);margin:8px 0;line-height:1.65;}
  .block p.soft{color:var(--soft);}
  .block b{color:var(--dark);}
  .block .erkl{font-size:16px;color:var(--ink);margin-bottom:14px;line-height:1.7;}

  .badge{font-size:12px;font-weight:700;padding:5px 12px;border-radius:99px;white-space:nowrap;}
  .b-lernen{background:var(--badge2);color:var(--badge2t);}
  .b-formel{background:var(--badge3);color:var(--badge3t);}
  .b-uebung{background:var(--badge1);color:var(--badge1t);}

  ol.nums{list-style:none;counter-reset:n;margin-top:8px;padding:0;}
  ol.nums li{counter-increment:n;position:relative;padding-left:36px;font-size:15.5px;margin:10px 0;line-height:1.65;}
  ol.nums li::before{content:counter(n);position:absolute;left:0;top:1px;background:var(--badge2);color:var(--badge2t);width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;}

  .fx{font-family:Georgia,serif;background:var(--badge3);border-radius:8px;padding:6px 14px;display:inline-block;margin:5px 6px 5px 0;font-size:17px;color:var(--ink);font-weight:600;}
  .fx-block{margin:10px 0 14px;}
  .label-row{font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:var(--dark);font-weight:700;margin:16px 0 6px;}

  .example{background:var(--bg);border-left:3px solid var(--dark);border-radius:8px;padding:14px 18px;margin:10px 0;}
  .example .lbl{font-size:13px;letter-spacing:.06em;text-transform:uppercase;color:var(--dark);font-weight:700;margin-bottom:6px;}
  .uebung{background:var(--badge1);border-radius:10px;padding:14px 18px;margin:10px 0;}
  .uebung .lbl{font-size:13px;letter-spacing:.06em;text-transform:uppercase;color:var(--badge1t);font-weight:700;margin-bottom:6px;}
  .uebung .loesung{margin-top:8px;padding-top:8px;border-top:1px dashed rgba(0,0,0,0.12);}
  .uebung .loesung b{color:var(--badge1t);}

  .formel-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:12px;}
  .fcard{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:16px 18px;}
  .fcard h5{font-size:15px;color:var(--dark);margin-bottom:10px;font-weight:700;}
  .fcard p{font-size:14.5px;color:var(--ink);margin:5px 0;line-height:1.6;}
  .fcard .formel{font-family:Georgia,serif;font-weight:600;font-size:16px;color:var(--ink);}

  .rules-grid{display:grid;grid-template-columns:1fr;gap:10px;}
  .rule{background:var(--card);border:1px solid var(--line);border-left:4px solid var(--accent);border-radius:10px;padding:14px 18px;}
  .rule b{color:var(--accent);}
  .rule p{font-size:15px;color:var(--ink);margin:0;line-height:1.6;}

  .days{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px;}
  .day-tab{padding:9px 16px;border-radius:99px;font-size:14px;font-weight:600;background:var(--card);border:1px solid var(--line);color:var(--soft);}
  .day-tab.on{background:var(--dark);color:#fff;border-color:var(--dark);}

  .tips-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:12px;}
  .tip{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:16px 18px;}
  .tip .lbl{font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--dark);font-weight:700;margin-bottom:6px;}
  .tip p{font-size:14.5px;color:var(--ink);}

  .foot{text-align:center;margin-top:50px;padding-top:20px;border-top:1px solid var(--line);color:var(--soft);font-size:14px;}
  @media print{body{background:#fff;}.block,.fcard,.tip,.rule,.example,.uebung{break-inside:avoid;}}
</style>
</head>
<body>
`;
}

const FOOT = `
<script>
  document.querySelectorAll('.block .circle').forEach(function(c){
    c.addEventListener('click', function(){ c.closest('.block').classList.toggle('done'); });
  });
</script>
</body>
</html>`;

type Bild = { media_type: string; data: string };

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = (body.name || "").toString().slice(0, 60);
    const klasse = (body.klasse || "").toString().slice(0, 20);
    const fach = body.fach === "physik" ? "Physik" : "Mathematik";
    const datum = (body.datum || "").toString().slice(0, 40);
    const themeKey: ThemeKey = (["rosa", "navy", "gold"] as ThemeKey[]).includes(body.theme) ? body.theme : "navy";
    const bilder: Bild[] = Array.isArray(body.bilder) ? body.bilder.slice(0, 10) : [];

    if (bilder.length === 0) {
      return NextResponse.json({ error: "Keine Fotos erhalten" }, { status: 400 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      console.error("ANTHROPIC_API_KEY fehlt in den Vercel Environment Variables");
      return NextResponse.json({ error: "Der Server ist gerade nicht richtig eingerichtet. Bitte melde dich bei Anna." }, { status: 500 });
    }

    const heute = new Date().toLocaleDateString("de-DE", { day: "numeric", month: "long", year: "numeric" });

    const textPrompt = `Du bist eine erfahrene deutsche ${fach}-Lehrerin mit jahrelanger Nachhilfe-Praxis. Du erstellst für eine konkrete Schülerin oder einen Schüler einen vollständigen, hochwertigen Lernplan zur Vorbereitung auf eine Schulaufgabe.

DEIN QUALITÄTSANSPRUCH:
Dieser Plan kostet Geld und ersetzt ein ganzes Schulbuch und mehrere Nachhilfestunden. Der Schüler braucht danach KEIN weiteres Material mehr. Jede Erklärung muss so klar und gründlich sein, dass selbst ein Schüler, der das Thema noch nie gehört hat, es danach versteht. Du schreibst persönlich, warm und direkt an den Schüler gerichtet — wie eine echte Lehrerin im Einzelunterricht.

SCHREIBREGELN:
- Verwende IMMER korrekte deutsche Umlaute: ä, ö, ü, ß. NIEMALS "ae", "oe", "ue", "ss". Schreibe "für" nicht "fuer", "Schüler" nicht "Schueler", "übersicht" nicht "uebersicht", "groß" nicht "gross", "Lösung" nicht "Loesung".
- Schreibe natürlich und persönlich wie eine echte Lehrerin im Gespräch: "Pass auf, hier kommt der Trick:", "Stell dir vor, du hast...", "Wenn du das einmal verstanden hast, geht der Rest von alleine.", "Achtung, hier passieren oft Fehler:"
- Variiere die Sprache, schreibe nicht schablonenhaft.
- Verwende mathematische Symbole: ², ³, √, ·, ÷, ≠, ≤, ≥, ±, ∠, π, °, ∞.
- Erwähne NIEMALS künstliche Intelligenz, KI, AI, Sprachmodelle, automatische Erstellung, Anthropic oder Claude.
- Keine Emojis.

DATEN ZUM SCHÜLER:
- Name: ${name || "Schüler"}
- Klasse: ${klasse}
- Fach: ${fach}
- Schulaufgabe am: ${datum || "in einigen Wochen"}
- Heute ist: ${heute}

DEINE AUFGABE:
Schau dir ALLE Fotos sehr genau an. Erkenne JEDES Thema und JEDES Unterthema, das drankommen kann. Erstelle dann den Lernplan in der folgenden Reihenfolge — mit klarem Schwerpunkt auf den Themen-Erklärungen (mindestens 60% des Plans).

STRUKTUR — verwende GENAU diese HTML-Klassen:

(1) BANNER:
<div class="banner"><div class="kick">Dein persönlicher Lernplan</div><h1>Lernplan für ${name || "deine Schulaufgabe"}</h1><p>${fach} · Klasse ${klasse} · Schulaufgabe am ${datum}. Schritt für Schritt durchgearbeitet, mit allem was du brauchst.</p></div>
<div class="wrap">

(2) THEMEN — DAS HERZSTÜCK. Pro Thema einen ausführlichen Block. Mindestens 4–8 Themen je nach Stoff. Jeder Block enthält:

<div class="sec-title">Alles was du können musst</div>
<p class="sec-sub">Hier ist jedes Thema verständlich erklärt — lies in Ruhe durch, dann mach die Übungen.</p>

<div class="block">
  <div class="block-top">
    <h4><span class="circle"></span>Thema-Name (z.B. Satz des Pythagoras)</h4>
    <span class="badge b-lernen">Thema 1</span>
  </div>

  <div class="erkl">Hier eine wirklich gründliche Erklärung in einfacher Sprache. Was ist das Thema? Wo kommt es im Alltag vor? Wie funktioniert das Prinzip dahinter? Mindestens 4–7 Sätze. Mit einem konkreten Alltagsbeispiel ("Stell dir vor, du hast eine Leiter, die an einer Wand lehnt...").</div>

  <div class="label-row">Die wichtigsten Formeln</div>
  <div class="fx-block">
    <span class="fx">a² + b² = c²</span>
    <span class="fx">c = √(a² + b²)</span>
    <span class="fx">a = √(c² − b²)</span>
  </div>

  <div class="label-row">Wichtige Regel</div>
  <p>Hier die zentrale Regel oder das Gesetz dieses Themas in 1–2 Sätzen klar formuliert.</p>

  <div class="label-row">Beispiel 1 — Schritt für Schritt</div>
  <div class="example">
    <div class="lbl">Aufgabe</div>
    <p>Konkrete Aufgabe mit Zahlen. (z.B. "Ein rechtwinkliges Dreieck hat die Katheten a = 3 cm und b = 4 cm. Wie lang ist die Hypotenuse?")</p>
    <ol class="nums">
      <li>Was ist gegeben, was gesucht? — gegeben: a = 3, b = 4. gesucht: c.</li>
      <li>Welche Formel passt? — c = √(a² + b²).</li>
      <li>Einsetzen: c = √(3² + 4²) = √(9 + 16) = √25.</li>
      <li>Ausrechnen: c = 5 cm.</li>
    </ol>
  </div>

  <div class="label-row">Beispiel 2 — Schritt für Schritt</div>
  <div class="example">
    <div class="lbl">Aufgabe</div>
    <p>Eine zweite Aufgabe mit anderen Zahlen oder leicht anderem Aufbau.</p>
    <ol class="nums"><li>Schritt</li><li>Schritt</li><li>Schritt</li></ol>
  </div>

  <div class="label-row">Jetzt du — Übungsaufgaben</div>
  <div class="uebung">
    <div class="lbl">Übung 1</div>
    <p>Konkrete Übungsaufgabe.</p>
    <div class="loesung"><b>Lösung:</b> ausführliche Lösung in 2–4 Schritten mit Rechnung.</div>
  </div>
  <div class="uebung">
    <div class="lbl">Übung 2</div>
    <p>Zweite Übungsaufgabe, etwas anders.</p>
    <div class="loesung"><b>Lösung:</b> ausführliche Lösung.</div>
  </div>
</div>

(3) KOMPLETTE FORMELSAMMLUNG — ALLE Formeln aus den Fotos sauber sortiert:
<div class="sec-title">Die komplette Formelsammlung</div>
<p class="sec-sub">Druck dir diese Seite aus — das ist dein Spickzettel für die letzten Minuten vor der Schulaufgabe.</p>
<div class="formel-grid">
  <div class="fcard">
    <h5>Pythagoras</h5>
    <p class="formel">a² + b² = c²</p>
    <p>Wenn c gesucht: c = √(a² + b²)</p>
    <p>Wenn a gesucht: a = √(c² − b²)</p>
    <p>Nur in rechtwinkligen Dreiecken!</p>
  </div>
  ... mindestens 8–14 Karten je nach Stoff, jede mit Formel UND kurzer Erklärung wann sie anzuwenden ist ...
</div>

(4) REGELN UND GESETZE — als klare Übersicht:
<div class="sec-title">Die wichtigsten Regeln</div>
<div class="rules-grid">
  <div class="rule"><p><b>Punkt-vor-Strich:</b> Mal und Geteilt werden immer zuerst gerechnet, dann erst Plus und Minus.</p></div>
  <div class="rule"><p><b>Pythagoras-Regel:</b> Gilt nur in rechtwinkligen Dreiecken. Die Hypotenuse ist immer die längste Seite, gegenüber dem rechten Winkel.</p></div>
  ... mindestens 5–10 Regeln je nach Stoff ...
</div>

(5) WOCHENPLAN (kurz am Ende):
<div class="sec-title">Dein Wochenplan</div>
<p class="sec-sub">So teilst du dir die Themen über die Wochen ein bis zur Schulaufgabe.</p>
<div class="days"><span class="day-tab on">Mo</span><span class="day-tab">Di</span><span class="day-tab">Mi</span><span class="day-tab">Do</span><span class="day-tab">Fr</span><span class="day-tab">Sa</span><span class="day-tab">So</span></div>
Berechne realistisch die Wochen zwischen heute (${heute}) und dem Termin (${datum}). Pro Woche 3–5 kurze Blöcke wie:
<div class="block"><div class="block-top"><span class="time">Woche 1 · Montag</span><span class="badge b-lernen">Lernen</span></div><h4><span class="circle"></span>Thema 1 verstehen</h4><p>Lies die Erklärung oben in Ruhe durch, schau dir die Beispiele an, dann mach Übung 1.</p></div>
... 12–20 solche kurzen Blöcke insgesamt, am Ende eine Generalprobe-Woche ...

(6) ANNAS TIPPS:
<div class="sec-title">Annas Tipps für dich</div>
<div class="tips-grid"><div class="tip"><div class="lbl">Kurztitel</div><p>Konkreter Tipp in 1–2 Sätzen.</p></div> ... 4–6 Tipps ...</div>

<div class="foot">Viel Erfolg, ${name || "du schaffst das"}! Du hast jetzt alles in der Hand was du brauchst.</div>
</div>

ABSOLUT WICHTIG:
- Antworte AUSSCHLIESSLICH mit reinem HTML, beginnend mit <div class="banner">. KEIN <html>, <head>, <body>. KEIN Markdown, KEINE Backticks, KEINE Vorrede, KEIN Abschluss.
- Themen-Abschnitt ist das Herzstück — sei dort sehr ausführlich. Jedes Thema mit Erklärung, Formeln, Regel, 2 Beispielen Schritt-für-Schritt, 2 Übungen mit Lösungen.
- Formelsammlung muss umfangreich sein, mit Erklärung pro Formel wann man sie verwendet.
- Verwende echte Umlaute: ä ö ü ß. Niemals "ae oe ue ss".`;

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
        max_tokens: 10000,
        messages: [{ role: "user", content }],
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error("Anthropic API Fehler:", response.status, JSON.stringify(data).slice(0, 800));
      const detail = data?.error?.message || `Statuscode ${response.status}`;
      return NextResponse.json({ error: `Der Lernplan-Dienst meldet: ${detail}` }, { status: 500 });
    }

    let inhalt = data.content[0].text.trim();
    inhalt = inhalt.replace(/```html/gi, "").replace(/```/g, "").trim();

    const html = buildHead(THEME_CSS[themeKey]) + inhalt + FOOT;
    return NextResponse.json({ html });
  } catch (error) {
    console.error("Lernheld API Fehler:", error);
    const meldung = error instanceof Error ? error.message : "unbekannter Fehler";
    return NextResponse.json({ error: `Fehler beim Erstellen: ${meldung}` }, { status: 500 });
  }
}
