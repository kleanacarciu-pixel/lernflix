// =============================================================================
// Die AGB-Seite von lernemitanna.de aus dem zentralen Wortlaut bauen
//
// Die Website ist eine statische Seite und kann lib/agb-text.ts nicht selbst
// lesen. Damit trotzdem nur EINE Quelle existiert, wird der Inhaltsteil der
// Seite hier erzeugt und in die bestehende Datei eingesetzt – Kopf, Fußzeile
// und mobiles Menü bleiben unangetastet.
//
// Ausführen:  node --experimental-strip-types scripts/agb-seite-bauen.mjs
// Geprüft:    tests/agb-website.test.ts schlägt an, wenn die Seite nicht mehr
//             zum Wortlaut passt.
// =============================================================================
import { readFileSync, writeFileSync } from "node:fs";
import { AGB_MARKDOWN, AGB_TITEL, AGB_UNTERZEILE } from "../lib/agb-text.ts";
import { bausteine } from "../lib/agb-kern.ts";

const ZIEL = "lernemitanna-theme/preview/agb.html";

const escape = (s) => s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));

function laeufe(ls) {
  return ls.map((l) => {
    const t = escape(l.text).replace(/\n/g, "<br>");
    return l.fett ? `<b>${t}</b>` : l.kursiv ? `<em>${t}</em>` : t;
  }).join("");
}

/** Der Inhaltsteil der Seite – genau das, was zwischen <main> und </main> steht. */
export function inhaltHtml() {
  const zeilen = [
    `  <h1>${escape(AGB_TITEL)}</h1>`,
    `  <p class="lead">${escape(AGB_UNTERZEILE)}</p>`,
    "",
  ];
  for (const b of bausteine(AGB_MARKDOWN)) {
    switch (b.art) {
      case "linie": zeilen.push("  <hr>"); break;
      case "ueberschrift": zeilen.push(`  <h2 class="anlage">${escape(b.text)}</h2>`); break;
      case "paragraf": zeilen.push(`  <h2>${escape(b.text)}</h2>`); break;
      case "unterueberschrift": zeilen.push(`  <h3>${escape(b.text)}</h3>`); break;
      case "zitat": zeilen.push(`  <blockquote>${laeufe(b.laeufe)}</blockquote>`); break;
      default: zeilen.push(`  <p>${laeufe(b.laeufe)}</p>`); break;
    }
  }
  return zeilen.join("\n");
}

/** Die fertige Seite: bestehende Hülle, neuer Inhalt. */
export function seiteMitInhalt(vorhanden) {
  const start = vorhanden.indexOf('<main class="wrap">');
  const ende = vorhanden.indexOf("</main>");
  if (start < 0 || ende < 0) throw new Error("In agb.html fehlt der <main>-Bereich");
  const kopf = vorhanden.slice(0, start);
  const fuss = vorhanden.slice(ende);

  // Ein paar Regeln für die zusätzlichen Bausteine (Anlagen, Zitat, Linie).
  const zusatz = `<style>
h3{font-family:'Inter',sans-serif;font-size:1rem;font-weight:700;margin:20px 0 6px}
h2.anlage{font-size:1.5rem;margin:34px 0 10px}
hr{border:0;border-top:2px solid #C9A96A;margin:30px 0}
blockquote{margin:14px 0;padding:12px 16px;border-left:3px solid #C9A96A;background:rgba(201,169,106,.09)}
</style>
`;
  const mitStil = kopf.includes("h2.anlage") ? kopf : kopf.replace("</head>", `${zusatz}</head>`);
  return `${mitStil}<main class="wrap">\n${inhaltHtml()}\n${fuss}`;
}

if (process.argv[1] && process.argv[1].endsWith("agb-seite-bauen.mjs")) {
  const alt = readFileSync(ZIEL, "utf8");
  const neu = seiteMitInhalt(alt);
  writeFileSync(ZIEL, neu);
  console.log(`${ZIEL} neu gebaut – ${neu.length} Zeichen.`);
}
