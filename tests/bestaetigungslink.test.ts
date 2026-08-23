// =============================================================================
// Der Bestätigungslink darf NUR an die Familie gehen
//
// Wer den Link hat, kann die AGB-Zustimmung auslösen. Ging die Angebots-Mail
// in Kopie an die Admin-Adresse, hätte Kleana selbst zustimmen können – im
// System stünde dann eine Zustimmung, die nicht von den Eltern stammt.
// Dieser Test hält fest, dass Link und Admin-Kopie getrennt bleiben.
// =============================================================================
import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const route = readFileSync("app/api/vertrag/route.ts", "utf8");

/** Der Rumpf von angebotSenden. */
function angebotSendenBlock(): string {
  const i = route.indexOf("async function angebotSenden");
  assert.ok(i > 0, "angebotSenden nicht gefunden");
  const ende = route.indexOf("\n}", i);
  return route.slice(i, ende);
}

describe("Angebots-Mail geht ohne Kopie raus", () => {
  const block = angebotSendenBlock();

  test("sie enthält den Bestätigungslink", () => {
    assert.match(block, /bestaetigungsLink\(/);
    assert.match(block, /href="\$\{link\}"/);
  });

  test("die Mail an die Familie hat KEINE Kopie an die Admin-Adresse", () => {
    // Zwischen dem Link und dem Ende der Familien-Mail darf kein kopieAn stehen.
    const linkStelle = block.indexOf("href=\"${link}\"");
    const familienMail = block.slice(0, block.indexOf("Getrennte Nachricht"));
    assert.ok(linkStelle > 0);
    assert.equal(/kopieAn/.test(familienMail), false,
      "Die Angebots-Mail mit dem Link darf nicht in Kopie an die Admin-Adresse gehen");
  });

  test("Kleana bekommt stattdessen eine eigene Nachricht", () => {
    assert.match(block, /Angebot verschickt: \$\{v\.schueler\.name\}/);
    assert.match(block, /ADMIN_EMAIL/);
  });

  test("in dieser Nachricht steht der Link NICHT", () => {
    const adminTeil = block.slice(block.indexOf("Getrennte Nachricht"));
    assert.equal(adminTeil.includes("${link}"), false,
      "Die Admin-Nachricht darf den Bestätigungslink nicht enthalten");
    assert.match(adminTeil, /steht bewusst nicht in dieser Nachricht/);
  });
});

describe("Die übrigen Admin-Kopien sind unbedenklich", () => {
  test("keine andere Mail mit kopieAn enthält einen Token-Link", () => {
    // bestaetigungsLink darf ausschliesslich in angebotSenden vorkommen.
    const treffer = [...route.matchAll(/bestaetigungsLink\(/g)];
    assert.equal(treffer.length, 1, "bestaetigungsLink wird an mehr als einer Stelle benutzt");
    const block = angebotSendenBlock();
    assert.ok(block.includes("bestaetigungsLink("),
      "bestaetigungsLink gehört in angebotSenden");
  });
});
