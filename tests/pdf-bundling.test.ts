// =============================================================================
// pdfkit darf nicht mitgebündelt werden
//
// pdfkit bildet den Pfad zu seinen Schriftmaßen (*.afm) aus __dirname. Steckt
// das Paket im Bündel, zeigt __dirname ins Bündel und jedes PDF scheitert auf
// Vercel mit ENOENT auf /ROOT/node_modules/pdfkit/js/data/Helvetica.afm.
// Lokal fällt das NICHT auf – deshalb dieser Test.
// =============================================================================
import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";

const config = readFileSync("next.config.ts", "utf8");

/** Alle Routen, die PDFs erzeugen. */
function pdfRouten(): string[] {
  const treffer: string[] = [];
  const suche = (ordner: string) => {
    for (const e of readdirSync(ordner, { withFileTypes: true })) {
      const pfad = `${ordner}/${e.name}`;
      if (e.isDirectory()) suche(pfad);
      else if (e.name === "route.ts" && readFileSync(pfad, "utf8").includes("vertrag-dokumente")) {
        treffer.push(pfad.replace(/^app/, "").replace(/\/route\.ts$/, ""));
      }
    }
  };
  suche("app/api");
  return treffer;
}

describe("pdfkit bleibt ungebündelt", () => {
  test("steht in serverExternalPackages", () => {
    assert.match(config, /serverExternalPackages/,
      "next.config.ts muss serverExternalPackages setzen");
    assert.match(config, /serverExternalPackages:\s*\[[^\]]*"pdfkit"/,
      "pdfkit fehlt in serverExternalPackages – PDFs scheitern dann auf Vercel");
  });

  test("jede PDF-Route nimmt die Schriftdateien mit", () => {
    const routen = pdfRouten();
    assert.ok(routen.length > 0, "Keine PDF-Route gefunden – prüft der Test noch das Richtige?");
    for (const r of routen) {
      assert.ok(config.includes(`"${r}"`),
        `Route ${r} erzeugt PDFs, fehlt aber in outputFileTracingIncludes`);
    }
    assert.match(config, /pdfkit\/js\/data/);
  });

  test("der Grund steht als Kommentar dabei", () => {
    assert.match(config, /ENOENT/,
      "Ohne Erklärung entfernt das irgendwann jemand wieder");
  });
});
