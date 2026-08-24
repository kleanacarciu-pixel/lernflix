// =============================================================================
// Die AGB-Seite von lernemitanna.de muss zum Wortlaut passen
//
// Die Website ist statisch und kann den Wortlaut nicht selbst laden – die
// Seite wird deshalb aus lib/agb-text.ts erzeugt. Genau da kann sie still
// veralten: Wortlaut geändert, Seite vergessen. Dieser Test merkt es.
//
// Neu bauen mit:
//   node --experimental-strip-types scripts/agb-seite-bauen.mjs
// =============================================================================
import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { seiteMitInhalt } from "../scripts/agb-seite-bauen.mjs";

const DATEI = "lernemitanna-theme/preview/agb.html";
const seite = readFileSync(DATEI, "utf8");

describe("Die Seite lernemitanna.de/agb", () => {
  test("ist aktuell – sie entspricht dem zentralen Wortlaut", () => {
    assert.equal(seite, seiteMitInhalt(seite),
      "Die AGB-Seite ist veraltet. Neu bauen: node --experimental-strip-types scripts/agb-seite-bauen.mjs");
  });

  test("enthält alle dreizehn Paragrafen", () => {
    for (let i = 1; i <= 13; i++) {
      assert.ok(seite.includes(`§ ${i} `), `§ ${i} fehlt auf der Website`);
    }
  });

  test("enthält Anlage 1 und Anlage 2 vollständig", () => {
    assert.ok(seite.includes("Anlage 1: Widerrufsbelehrung"));
    assert.ok(seite.includes("Folgen des Widerrufs"));
    assert.ok(seite.includes("Anlage 2: Muster-Widerrufsformular"));
    assert.ok(seite.includes("Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*)"));
    assert.ok(seite.includes("Anlage 3: Terminliste"));
  });

  test("die alte Fassung ist weg – auch die falsche Zahl darin", () => {
    // Dort stand „max. 3 offene Stunden"; im System und in den neuen AGB
    // sind es vier. Genau solche Widersprüche liest ein Elternteil zuerst.
    assert.equal(seite.includes("max. 3 offene Stunden"), false);
    assert.equal(seite.includes("Die Stunde verfällt und kann nicht nachgeholt werden"), false);
    assert.ok(seite.includes("höchstens vier (4) Minusstunden gleichzeitig offen"));
  });

  test("Kopf, Fußzeile und mobiles Menü sind unangetastet", () => {
    assert.ok(seite.includes('<a class="logo" href="/">Lerne mit <span>Anna</span></a>'));
    assert.ok(seite.includes('<a href="/impressum">Impressum</a>'));
    assert.ok(seite.includes('id="mnavPanel"'), "Das mobile Menü fehlt");
  });

  test("spitze Klammern im Wortlaut wären entschärft", () => {
    // Der Wortlaut enthält keine, aber die Erzeugung muss es aushalten.
    assert.equal(seite.includes("<script>alert"), false);
  });
});
