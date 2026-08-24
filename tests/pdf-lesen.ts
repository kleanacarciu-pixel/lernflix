// =============================================================================
// Eine fertige PDF wieder auslesen – Hilfsmittel für die Tests
//
// Die Inhaltsströme sind mit zlib gepackt; darin stehen die Texte als
// Hex-Ketten hinter „TJ". So lässt sich prüfen, was wirklich im Dokument
// steht, statt nur, was hineingegeben wurde.
// =============================================================================
import { inflateSync } from "node:zlib";

/** WinAnsi ist fast Latin-1 – nur 0x80 bis 0x9F sind anders belegt. */
const WINANSI: Record<number, string> = {
  0x80: "€", 0x82: "‚", 0x84: "„", 0x85: "…", 0x91: "‘", 0x92: "’",
  0x93: "“", 0x94: "”", 0x96: "–", 0x97: "—",
};

function ausWinAnsi(hex: string): string {
  let s = "";
  for (const b of Buffer.from(hex, "hex")) s += WINANSI[b] ?? Buffer.from([b]).toString("latin1");
  return s;
}

/** Alle Inhaltsströme entpacken und aneinanderhängen. */
export function inhalt(pdf: Buffer): string {
  let out = "";
  let i = 0;
  while ((i = pdf.indexOf("stream", i)) >= 0) {
    let start = i + 6;
    if (pdf[start] === 0x0d) start++;
    if (pdf[start] === 0x0a) start++;
    const ende = pdf.indexOf("endstream", start);
    if (ende < 0) break;
    try { out += inflateSync(pdf.subarray(start, ende)).toString("latin1") + "\n"; } catch { /* Bild o. Ä. */ }
    i = ende + 9;
  }
  return out;
}

/**
 * Sichtbarer Text aus einem Inhaltsstrom.
 *
 * pdfkit setzt Text als [<hex> zahl <hex>] TJ – die Zahlen dazwischen sind
 * Feinabstände und gehören NICHT in den Text.
 */
export function texte(strom: string): string[] {
  const zeilen: string[] = [];
  for (const m of strom.matchAll(/\[([\s\S]*?)\]\s*TJ/g)) {
    let s = "";
    for (const h of m[1].matchAll(/<([0-9A-Fa-f]*)>/g)) s += ausWinAnsi(h[1]);
    if (s.trim()) zeilen.push(s);
  }
  return zeilen;
}

/** Der ganze sichtbare Text einer PDF, mit Leerzeichen verbunden. */
export function pdfText(pdf: Buffer): string {
  return texte(inhalt(pdf)).join(" ");
}

/** Zahl der Seiten. */
export function seiten(pdf: Buffer): number {
  return [...pdf.toString("latin1").matchAll(/\/Type\s*\/Page[^s]/g)].length;
}
