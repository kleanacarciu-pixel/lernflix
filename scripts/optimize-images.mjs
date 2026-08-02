// scripts/optimize-images.mjs
//
// Verkleinert & komprimiert grosse Bilder in /public.
// Pro Bild ueber SCHWELLE:
//   1. auf max. MAX_BREITE px Breite verkleinern (kleinere NICHT hochskalieren)
//   2. eine .webp-Variante (quality 85) daneben legen
//   3. das originale PNG/JPG verlustbehaftet komprimiert ERSETZEN
//      (damit bestehende Referenzen weiter funktionieren)
//   4. Transparenz bleibt erhalten
//
// Aufruf:  node scripts/optimize-images.mjs
//          node scripts/optimize-images.mjs --all   (alle Bilder, nicht nur >300KB)

import { readdir, stat, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const PUBLIC_DIR = "public";
const SCHWELLE = 300 * 1024; // 300 KB
const MAX_BREITE = 1200;
const WEBP_QUALITY = 85;
const JPEG_QUALITY = 80;
const PNG_QUALITY = 85; // bei palette:true = verlustbehaftete Quantisierung
const alleBilder = process.argv.includes("--all");

const kb = (bytes) => (bytes / 1024).toFixed(1).padStart(8) + " KB";

// /public rekursiv nach png/jpg/jpeg durchsuchen
async function findeBilder(dir) {
  const treffer = [];
  for (const eintrag of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, eintrag.name);
    if (eintrag.isDirectory()) {
      treffer.push(...(await findeBilder(p)));
    } else if (/\.(png|jpe?g)$/i.test(eintrag.name)) {
      treffer.push(p);
    }
  }
  return treffer;
}

async function optimiere(datei) {
  const vorher = (await stat(datei)).size;
  if (!alleBilder && vorher < SCHWELLE) return null;

  const input = await readFile(datei); // erst einlesen -> sicheres Ueberschreiben
  const meta = await sharp(input).metadata();
  const istPng = /\.png$/i.test(datei);

  // Nur verkleinern, wenn breiter als MAX_BREITE (kleinere nicht hochskalieren)
  const resize = { width: MAX_BREITE, withoutEnlargement: true };

  // 1) WebP-Variante daneben legen
  const webpPfad = datei.replace(/\.(png|jpe?g)$/i, ".webp");
  const webpBuf = await sharp(input).resize(resize).webp({ quality: WEBP_QUALITY }).toBuffer();
  await writeFile(webpPfad, webpBuf);

  // 2) Original komprimiert ersetzen (Transparenz bleibt erhalten)
  const origBuf = istPng
    ? await sharp(input).resize(resize).png({ quality: PNG_QUALITY, palette: true, compressionLevel: 9 }).toBuffer()
    : await sharp(input).resize(resize).jpeg({ quality: JPEG_QUALITY, mozjpeg: true }).toBuffer();

  // Nur ersetzen, wenn es dadurch wirklich kleiner wird
  const origErsetzt = origBuf.length < vorher;
  if (origErsetzt) await writeFile(datei, origBuf);

  return {
    datei,
    breiteVorher: meta.width,
    breiteNachher: Math.min(meta.width ?? MAX_BREITE, MAX_BREITE),
    origVorher: vorher,
    origNachher: origErsetzt ? origBuf.length : vorher,
    webpPfad,
    webpGroesse: webpBuf.length,
  };
}

const bilder = await findeBilder(PUBLIC_DIR);
const ergebnisse = (await Promise.all(bilder.map(optimiere))).filter(Boolean);

if (ergebnisse.length === 0) {
  console.log(`Keine Bilder ueber ${(SCHWELLE / 1024) | 0} KB gefunden. (Mit --all alle bearbeiten.)`);
} else {
  console.log(`\nOptimiert (${ergebnisse.length} Bild(er)):\n`);
  for (const r of ergebnisse) {
    const spar = (100 * (1 - r.origNachher / r.origVorher)).toFixed(0);
    console.log(`  ${r.datei}`);
    console.log(`    Breite : ${r.breiteVorher}px -> ${r.breiteNachher}px`);
    console.log(`    Original: ${kb(r.origVorher)} -> ${kb(r.origNachher)}  (-${spar}%)`);
    console.log(`    WebP neu: ${kb(r.webpGroesse)}   (${path.basename(r.webpPfad)})\n`);
  }
}
