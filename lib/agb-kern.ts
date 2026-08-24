// =============================================================================
// Den AGB-Wortlaut in Bausteine zerlegen (ohne Datenbank)
//
// Der Text steht genau einmal im Projekt (lib/agb-text.ts). Damit ihn Webseite
// UND PDF aus derselben Quelle darstellen können, wird er hier in Bausteine
// zerlegt. So gibt es keine zweite, abweichende Fassung – und ein Test kann
// festhalten, dass nichts verloren geht.
//
// Bewusst ohne Importe, damit das Zerlegen ohne Datenbank prüfbar bleibt.
// =============================================================================

/** Ein Stück Text mit oder ohne Hervorhebung. */
export type Lauf = { text: string; fett?: boolean; kursiv?: boolean };

export type Baustein =
  | { art: "ueberschrift"; text: string }        // # Anlage 1: …
  | { art: "paragraf"; text: string }            // ## § 1 …
  | { art: "unterueberschrift"; text: string }   // ### Widerrufsrecht
  | { art: "absatz"; laeufe: Lauf[] }
  | { art: "zitat"; laeufe: Lauf[] }             // > „Ich verlange …“
  | { art: "linie" };

/**
 * Fett (**…**) und kursiv (*…*) aus einem Absatz herauslösen.
 *
 * Bewusst schlicht: Der Wortlaut nutzt nur diese beiden Auszeichnungen, und
 * eine vollständige Markdown-Umsetzung würde mehr Fehlerquellen mitbringen,
 * als sie hier löst.
 */
export function laeufeAus(zeile: string): Lauf[] {
  const out: Lauf[] = [];
  const muster = /\*\*([^*]+)\*\*|\*([^*]+)\*/g;
  let zuletzt = 0;
  for (const m of zeile.matchAll(muster)) {
    const start = m.index ?? 0;
    if (start > zuletzt) out.push({ text: zeile.slice(zuletzt, start) });
    if (m[1] !== undefined) out.push({ text: m[1], fett: true });
    else out.push({ text: m[2], kursiv: true });
    zuletzt = start + m[0].length;
  }
  if (zuletzt < zeile.length) out.push({ text: zeile.slice(zuletzt) });
  return out.length ? out : [{ text: zeile }];
}

/** Den ganzen Wortlaut in Bausteine zerlegen. */
export function bausteine(markdown: string): Baustein[] {
  const out: Baustein[] = [];
  // Absätze sind durch Leerzeilen getrennt; innerhalb eines Absatzes bleiben
  // Zeilenumbrüche erhalten (Anschriften, Formularzeilen).
  for (const roh of markdown.split(/\n{2,}/)) {
    const stueck = roh.trim();
    if (!stueck) continue;
    if (/^-{3,}$/.test(stueck)) { out.push({ art: "linie" }); continue; }
    if (stueck.startsWith("### ")) { out.push({ art: "unterueberschrift", text: stueck.slice(4).trim() }); continue; }
    if (stueck.startsWith("## ")) { out.push({ art: "paragraf", text: stueck.slice(3).trim() }); continue; }
    if (stueck.startsWith("# ")) { out.push({ art: "ueberschrift", text: stueck.slice(2).trim() }); continue; }
    if (stueck.startsWith("> ")) {
      out.push({ art: "zitat", laeufe: laeufeAus(stueck.replace(/^>\s?/gm, "").trim()) });
      continue;
    }
    out.push({ art: "absatz", laeufe: laeufeAus(stueck) });
  }
  return out;
}

/** Der reine Text eines Bausteins – für Prüfungen und die Suche. */
export function nurText(b: Baustein): string {
  switch (b.art) {
    case "linie": return "";
    case "absatz": case "zitat": return b.laeufe.map((l) => l.text).join("");
    default: return b.text;
  }
}

/** Der ganze Wortlaut als schlichter Text, ohne Auszeichnungen. */
export function alsText(markdown: string): string {
  return bausteine(markdown).map(nurText).filter(Boolean).join("\n\n");
}

/**
 * Einen Anlagen-Abschnitt aus dem Wortlaut herausschneiden.
 *
 * Gebraucht für die Widerrufsbelehrung: Sie steht als Anlage 1 in den AGB und
 * wird zusätzlich einzeln gezeigt – aber aus derselben Quelle, damit es keine
 * zweite Fassung gibt.
 */
export function anlage(markdown: string, beginntMit: string): string {
  const zeilen = markdown.split("\n");
  const start = zeilen.findIndex((z) => z.startsWith("# ") && z.slice(2).trim().startsWith(beginntMit));
  if (start < 0) return "";
  let ende = zeilen.length;
  for (let i = start + 1; i < zeilen.length; i++) {
    if (zeilen[i].startsWith("# ")) { ende = i; break; }
  }
  // Die Trennlinie vor der nächsten Anlage gehört nicht mehr dazu.
  while (ende > start && /^\s*(-{3,})?\s*$/.test(zeilen[ende - 1])) ende--;
  return zeilen.slice(start, ende).join("\n").trim();
}
