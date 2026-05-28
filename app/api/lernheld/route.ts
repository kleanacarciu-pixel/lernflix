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
  body{background:var(--bg);color:var(--ink);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;line-height:1.6;font-size:16px;}
  .serif{font-family:Georgia,"Times New Roman",serif;}

  .banner{background:var(--dark);color:#fff;padding:30px 24px 26px;}
  .banner .kick{font-size:12px;letter-spacing:.16em;text-transform:uppercase;opacity:.8;font-weight:700;margin-bottom:8px;}
  .banner h1{font-family:Georgia,serif;font-size:30px;font-weight:700;margin-bottom:8px;}
  .banner p{opacity:.9;font-size:15px;max-width:640px;}
  .bar{height:8px;border-radius:99px;background:rgba(255,255,255,0.25);margin-top:18px;overflow:hidden;}
  .bar>i{display:block;height:100%;width:0;background:#fff;border-radius:99px;}

  .wrap{max-width:780px;margin:0 auto;padding:24px 18px 70px;}

  .hint{background:var(--badge3);border-radius:14px;padding:15px 18px;margin:18px 0;font-size:15px;color:var(--ink);display:flex;gap:10px;}
  .steps{display:flex;flex-wrap:wrap;gap:10px;margin:18px 0;}
  .step-pill{display:flex;align-items:center;gap:8px;background:var(--card);border:1px solid var(--line);border-radius:99px;padding:8px 14px;font-size:14px;font-weight:600;}
  .step-pill b{background:var(--dark);color:#fff;width:22px;height:22px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;}

  .method{background:var(--badge2);border-radius:16px;padding:18px 20px;margin:18px 0;}
  .method h3{font-size:16px;margin-bottom:10px;display:flex;gap:8px;align-items:center;}
  .method p{font-size:15px;margin:6px 0;}
  .method b{color:var(--dark);}

  .sec-title{display:flex;align-items:center;gap:10px;font-size:20px;font-weight:700;margin:34px 0 16px;}

  .days{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px;}
  .day-tab{padding:9px 16px;border-radius:99px;font-size:14px;font-weight:600;background:var(--card);border:1px solid var(--line);color:var(--soft);}
  .day-tab.on{background:var(--dark);color:#fff;border-color:var(--dark);}

  .block{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:18px 20px;margin:12px 0;box-shadow:0 2px 10px rgba(0,0,0,0.03);}
  .block-top{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin-bottom:8px;}
  .block .time{font-size:13px;color:var(--soft);font-weight:600;}
  .block h4{font-size:17px;margin:2px 0 6px;display:flex;align-items:center;gap:8px;}
  .block .circle{width:22px;height:22px;border:2px solid var(--line);border-radius:50%;flex-shrink:0;cursor:pointer;display:inline-block;}
  .block.done .circle{background:var(--dark);border-color:var(--dark);}
  .block p{font-size:15px;color:var(--soft);margin-bottom:8px;}
  .badge{font-size:12px;font-weight:700;padding:5px 12px;border-radius:99px;white-space:nowrap;}
  .b-lernen{background:var(--badge2);color:var(--badge2t);}
  .b-formel{background:var(--badge3);color:var(--badge3t);}
  .b-uebung{background:var(--badge1);color:var(--badge1t);}
  ol.nums{list-style:none;counter-reset:n;margin-top:8px;}
  ol.nums li{counter-increment:n;position:relative;padding-left:32px;font-size:15px;margin:9px 0;line-height:1.55;}
  ol.nums li::before{content:counter(n);position:absolute;left:0;top:1px;background:var(--badge2);color:var(--badge2t);width:22px;height:22px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;}
  .fx{font-family:Georgia,serif;background:var(--badge3);border-radius:8px;padding:4px 12px;display:inline-block;margin:4px 5px 4px 0;font-size:16px;color:var(--ink);}

  .formel-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px;}
  .fcard{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:16px 18px;}
  .fcard h5{font-size:15px;color:var(--dark);margin-bottom:8px;}
  .fcard p{font-size:15px;color:var(--soft);margin:3px 0;}

  .tips-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:12px;}
  .tip{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:16px 18px;}
  .tip .lbl{font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--dark);font-weight:700;margin-bottom:6px;}
  .tip p{font-size:14.5px;color:var(--soft);}

  .foot{text-align:center;margin-top:50px;padding-top:20px;border-top:1px solid var(--line);color:var(--soft);font-size:14px;}
  @media print{body{background:#fff;}.block,.fcard,.tip,.method{break-inside:avoid;}}
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

    const textPrompt = `Du bist eine erfahrene deutsche ${fach}-Lehrerin und schreibst fuer eine konkrete Schuelerin oder einen Schueler einen vollstaendigen Lernplan zur Vorbereitung auf eine Schulaufgabe. Du schreibst persoenlich, warm und direkt an den Schueler gerichtet.

Der Schueler hat Fotos hochgeladen: Stofflisten, Buchseiten und/oder Uebungen. Schau dir ALLE Fotos genau an und erkenne, welche Themen drankommen.

DATEN:
- Name: ${name || "Schueler"}
- Klasse: ${klasse}
- Fach: ${fach}
- Schulaufgabe am: ${datum || "in einigen Wochen"}
- Heute: ${heute}

AUFGABE:
Schreibe den INNEREN HTML-Inhalt (nur was zwischen <body> kommt, OHNE den aeusseren Banner - der wird automatisch hinzugefuegt). Der Plan muss so ausfuehrlich sein, dass der Schueler KEIN Schulbuch mehr braucht. Fuer JEDES Thema aus den Fotos: eine verstaendliche Erklaerung in einfacher Sprache mit Alltagsbeispiel, alle Formeln, ein durchgerechnetes Beispiel, eine Uebung mit Loesung.

Beginne mit dem Banner-Block, dann der Wochenplan, dann die Themen, dann Formelsammlung, dann Tipps. Verwende GENAU diese Struktur und CSS-Klassen:

<div class="banner"><div class="kick">Dein persoenlicher Plan</div><h1>Lernplan fuer ${name || "deine Schulaufgabe"}</h1><p>${fach} · Klasse ${klasse} · Schulaufgabe am ${datum}. Schritt fuer Schritt, mit System.</p><div class="bar"><i style="width:0"></i></div></div>
<div class="wrap">

<div class="steps"><div class="step-pill"><b>1</b> Jeden Tag ein kleines Stueck</div><div class="step-pill"><b>2</b> Verstehen, dann ueben</div><div class="step-pill"><b>3</b> Vor der Schulaufgabe alles wiederholen</div></div>

<div class="method"><h3>So lernst du richtig</h3><p>...2-3 konkrete Lerntipps zu den Themen, jeweils mit <b>Stichwort:</b> davor...</p></div>

WOCHENPLAN:
<div class="sec-title">Dein Wochenplan</div>
<div class="days"><span class="day-tab on">Mo</span><span class="day-tab">Di</span><span class="day-tab">Mi</span><span class="day-tab">Do</span><span class="day-tab">Fr</span><span class="day-tab">Sa</span><span class="day-tab">So</span></div>
Dann pro Lern-Einheit ein Block (berechne die Wochen zwischen heute ${heute} und ${datum}, plane realistisch):
<div class="block"><div class="block-top"><span class="time">Woche 1 · Montag</span><span class="badge b-lernen">Lernen</span></div><h4><span class="circle"></span>Thema des Tages</h4><p>kurze Beschreibung</p><ol class="nums"><li>konkreter Schritt</li><li>noch ein Schritt</li></ol></div>
Nutze die Badges: <span class="badge b-lernen">Lernen</span> fuer Lerneinheiten, <span class="badge b-uebung">Ueben</span> fuer Uebungstage, <span class="badge b-formel">Wiederholen</span> fuer Wiederholung.

THEMEN (Herzstueck, sehr ausfuehrlich):
<div class="sec-title">Alles, was du koennen musst</div>
Pro Thema ein Block:
<div class="block"><div class="block-top"><h4><span class="circle"></span>Themenname</h4><span class="badge b-lernen">Thema 1</span></div><p class="erkl">ausfuehrliche, einfache Erklaerung mit Alltagsbeispiel</p><span class="fx">a&sup2; + b&sup2; = c&sup2;</span><ol class="nums"><li><b>Beispiel:</b> durchgerechnet</li><li><b>Uebung:</b> Aufgabe — <b>Loesung:</b> ...</li></ol></div>

FORMELSAMMLUNG:
<div class="sec-title">Formelsammlung</div>
<div class="formel-grid"><div class="fcard"><h5>Thema</h5><p>Formel</p></div> ...</div>

TIPPS:
<div class="sec-title">Annas Tipps fuer dich</div>
<div class="tips-grid"><div class="tip"><div class="lbl">Kurztitel</div><p>Tipp-Text</p></div> ...4-5 Tipps...</div>

<div class="foot">Viel Erfolg, ${name || "du schaffst das"}!</div>
</div>

WICHTIGE REGELN:
- Antworte AUSSCHLIESSLICH mit dem reinen HTML ab <div class="banner">. KEIN <html>, <head>, <body>, KEIN Markdown, KEINE Backticks, keine Vorrede.
- Schreibe natuerlich und persoenlich wie eine echte Lehrerin. Variiere die Saetze.
- Erwaehne NIEMALS kuenstliche Intelligenz, KI, AI, Sprachmodelle, automatische Erstellung, Anthropic oder Claude.
- Keine Emojis.
- Sei ausfuehrlich bei den Erklaerungen.`;

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
        max_tokens: 8000,
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
