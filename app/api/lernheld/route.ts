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

type Thema = {
  name?: string;
  erklaerung?: string;
  formeln?: string[];
  regel?: string;
  beispiel_aufgabe?: string;
  beispiel_loesung?: string;
  uebung_aufgabe?: string;
  uebung_loesung?: string;
};

function esc(s: unknown): string {
  if (typeof s !== "string") return "";
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function baueThemenBlock(t: Thema, index: number): string {
  const formeln = Array.isArray(t.formeln) ? t.formeln : [];
  const formelnHtml = formeln.length
    ? `<div class="label-row">Die wichtigsten Formeln</div><div class="fx-block">${formeln.map((f) => `<span class="fx">${esc(f)}</span>`).join("")}</div>`
    : "";
  const regelHtml = t.regel ? `<div class="label-row">Merke dir</div><p>${esc(t.regel)}</p>` : "";
  const beispiel = t.beispiel_aufgabe
    ? `<div class="label-row">Beispiel Schritt für Schritt</div><div class="example"><div class="lbl">Aufgabe</div><p>${esc(t.beispiel_aufgabe)}</p>${t.beispiel_loesung ? `<p style="margin-top:8px"><b>Lösung:</b> ${esc(t.beispiel_loesung)}</p>` : ""}</div>`
    : "";
  const uebung = t.uebung_aufgabe
    ? `<div class="uebung"><div class="lbl">Jetzt du — Übung</div><p>${esc(t.uebung_aufgabe)}</p>${t.uebung_loesung ? `<div class="loesung"><b>Lösung:</b> ${esc(t.uebung_loesung)}</div>` : ""}</div>`
    : "";
  return `<div class="block"><div class="block-top"><h4><span class="circle"></span>${esc(t.name || "Thema")}</h4><span class="badge b-lernen">Thema ${index + 1}</span></div><div class="erkl">${esc(t.erklaerung || "")}</div>${formelnHtml}${regelHtml}${beispiel}${uebung}</div>`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = (body.name || "").toString().slice(0, 60);
    const klasse = (body.klasse || "").toString().slice(0, 20);
    const fach = body.fach === "physik" ? "Physik" : "Mathematik";
    const datum = (body.datum || "").toString().slice(0, 40);
    const themeKey: ThemeKey = (["rosa", "navy", "gold"] as ThemeKey[]).includes(body.theme) ? body.theme : "navy";
    const themen: Thema[] = Array.isArray(body.themen) ? body.themen.slice(0, 20) : [];

    if (themen.length === 0) {
      return NextResponse.json({ error: "Keine Themen zum Verarbeiten" }, { status: 400 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      console.error("ANTHROPIC_API_KEY fehlt");
      return NextResponse.json({ error: "Der Server ist nicht richtig eingerichtet." }, { status: 500 });
    }

    const themenBloecke = themen.map((t, i) => baueThemenBlock(t, i)).join("\n");
    const heute = new Date().toLocaleDateString("de-DE", { day: "numeric", month: "long", year: "numeric" });

    const themenAlsText = themen
      .map((t, i) => `${i + 1}. ${t.name || "Thema"} — ${t.erklaerung || ""}${t.formeln?.length ? " | Formeln: " + t.formeln.join(", ") : ""}${t.regel ? " | Regel: " + t.regel : ""}`)
      .join("\n");

    const textPrompt = `Du bist eine erfahrene deutsche ${fach}-Lehrerin. Du erstellst für eine Klasse-${klasse}-Schülerin ${name ? `namens ${name}` : ""} ergänzende Inhalte zu einem Lernplan: Formelsammlung, Regeln, Wochenplan und Tipps.

Die Themen (mit Erklärungen, Formeln, Beispielen) sind bereits fertig vorbereitet — du musst sie NICHT mehr neu schreiben. Hier eine Übersicht der Themen:

${themenAlsText}

SCHREIBREGELN:
- Verwende echte deutsche Umlaute: ä ö ü ß. Niemals "ae oe ue ss".
- Kindgerechte, warme Sprache. Du-Form. "Stell dir vor...", "Das ist wie...", ermutigend.
- Erwähne niemals KI, AI, Sprachmodelle, Anthropic, Claude.
- Keine Emojis.
- Mathematische Symbole: ², ³, √, ·, ÷, π, °, ±, ∠.

ERSTELLE FOLGENDE 4 ABSCHNITTE ALS REINES HTML:

(A) KOMPLETTE FORMELSAMMLUNG (1 Karte pro Thema, sortiert):
<div class="sec-title">Die komplette Formelsammlung</div>
<p class="sec-sub">Druck dir das aus — dein Spickzettel fürs Lernen.</p>
<div class="formel-grid">
  <div class="fcard">
    <h5>Themen-Name</h5>
    <p class="formel">Formel(n)</p>
    <p>Kurz: wann benutzen?</p>
  </div>
  ... pro Thema 1 Karte ...
</div>

(B) WICHTIGE REGELN (mindestens 1 Regel pro Thema, manchmal mehrere):
<div class="sec-title">Die wichtigsten Regeln</div>
<div class="rules-grid">
  <div class="rule"><p><b>Regel-Titel:</b> Regel in 1–2 Sätzen klar formuliert.</p></div>
  ... mehrere Regeln ...
</div>

(C) WOCHENPLAN (knapp). Heute ist ${heute}, Schulaufgabe am ${datum}. Berechne die Wochen dazwischen und plane realistisch. Pro Woche 2–3 Blöcke:
<div class="sec-title">Dein Wochenplan</div>
<p class="sec-sub">So teilst du dir die Themen ein bis zur Schulaufgabe.</p>
<div class="days"><span class="day-tab on">Mo</span><span class="day-tab">Di</span><span class="day-tab">Mi</span><span class="day-tab">Do</span><span class="day-tab">Fr</span><span class="day-tab">Sa</span><span class="day-tab">So</span></div>
<div class="block"><div class="block-top"><span class="time">Woche 1 · Mo</span><span class="badge b-lernen">Lernen</span></div><h4><span class="circle"></span>Thema-Name verstehen</h4><p>Lies die Erklärung oben durch, mach die Übung.</p></div>
... insgesamt 10–15 kurze Blöcke, am Ende eine Generalprobe ...

(D) ANNAS TIPPS (4 Tipps, je 1–2 Sätze, ermutigend):
<div class="sec-title">Annas Tipps für dich</div>
<div class="tips-grid"><div class="tip"><div class="lbl">Kurztitel</div><p>Tipp.</p></div> ... 4 Tipps ...</div>

ABSOLUT WICHTIG:
- Antworte AUSSCHLIESSLICH mit dem reinen HTML der 4 Abschnitte (A, B, C, D nacheinander).
- KEIN <html>, <head>, <body>. KEIN Markdown, KEINE Backticks, KEINE Vorrede.
- Beginne direkt mit <div class="sec-title">Die komplette Formelsammlung</div>.`;

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
        messages: [{ role: "user", content: textPrompt }],
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error("Anthropic API Fehler (Plan):", response.status, JSON.stringify(data).slice(0, 800));
      const detail = data?.error?.message || `Statuscode ${response.status}`;
      return NextResponse.json({ error: `Der Lernplan-Dienst meldet: ${detail}` }, { status: 500 });
    }

    let zusatz = (data.content[0]?.text || "").trim();
    zusatz = zusatz.replace(/```html/gi, "").replace(/```/g, "").trim();

    const banner = `<div class="banner"><div class="kick">Dein persönlicher Lernplan</div><h1>Lernplan für ${esc(name) || "deine Schulaufgabe"}</h1><p>${fach} · Klasse ${esc(klasse)} · Schulaufgabe am ${esc(datum)}. Alles erklärt — du brauchst nichts anderes mehr.</p></div>`;
    const themenIntro = `<div class="sec-title">Alles was du können musst</div><p class="sec-sub">Hier ist jedes Thema verständlich erklärt — Schritt für Schritt, mit Beispielen die du nachmachen kannst.</p>`;
    const foot = `<div class="foot">Viel Erfolg, ${esc(name) || "du schaffst das"}! Du hast jetzt alles in der Hand.</div></div>`;

    const inhalt = `${banner}<div class="wrap">${themenIntro}${themenBloecke}${zusatz}${foot}`;
    const html = buildHead(THEME_CSS[themeKey]) + inhalt + FOOT;

    return NextResponse.json({ html });
  } catch (error) {
    console.error("Lernheld Plan API Fehler:", error);
    const meldung = error instanceof Error ? error.message : "unbekannter Fehler";
    return NextResponse.json({ error: `Fehler beim Erstellen: ${meldung}` }, { status: 500 });
  }
}
