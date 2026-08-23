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
    // Der Text steht in einer Vorlage; der Link geht als Platzhalter hinein.
    assert.match(block, /vorlageSenden\("vertragEinladung"/);
    assert.match(block, /\blink,/);
  });

  test("die Mail an die Familie hat KEINE Kopie an die Admin-Adresse", () => {
    const familienMail = block.slice(0, block.indexOf("Getrennte Nachricht"));
    assert.match(familienMail, /kopieAnAdmin: false/,
      "Die Einladung mit dem Link muss die Admin-Kopie ausdrücklich abschalten");
    assert.equal(/kopieAn:/.test(familienMail), false,
      "Die Einladung mit dem Link darf nicht in Kopie an die Admin-Adresse gehen");
  });

  test("Kleana bekommt stattdessen eine eigene Nachricht", () => {
    assert.match(block, /Vertrag verschickt: \$\{v\.schueler\.name\}/);
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

  test("der frische Link für Angemeldete entsteht nur in 'meinVertrag'", () => {
    // Seit der Unterzeichnung im Portal gibt es einen zweiten Weg zum
    // Vertrag: Wer angemeldet ist, bekommt einen frischen Token. Der darf
    // ausschliesslich in der Antwort an genau diese Person landen – niemals
    // in einer E-Mail, sonst wäre die Trennung von oben wieder aufgehoben.
    const treffer = [...route.matchAll(/\bvertragToken\(/g)];
    assert.equal(treffer.length, 1, "vertragToken wird an mehr als einer Stelle benutzt");
    const start = route.indexOf('if (action === "meinVertrag")');
    const ende = route.indexOf("// ------------------------------------------------------------------- Admin");
    assert.ok(start > 0 && ende > start, "Der Block 'meinVertrag' wurde nicht gefunden");
    const stelle = treffer[0].index as number;
    assert.ok(stelle > start && stelle < ende,
      "vertragToken steht ausserhalb von 'meinVertrag'");
  });
});
