// =============================================================================
// Die Sammeldatei muss zu den Einzeldateien passen
//
// supabase/schuljahr_ALLES.sql ist nur eine Zusammenstellung der sechs
// Einzeldateien, damit beim Einrichten einmal statt siebenmal kopiert werden
// muss. Sie kann still veralten, wenn jemand eine Einzeldatei ändert und
// das Zusammensetzen vergisst – genau das ist schon passiert. Dieser Test
// merkt es sofort. Neu bauen mit: bash supabase/bau-sammeldatei.sh
// =============================================================================
import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const TEILE = [
  "supabase/schuljahr_v1_schema.sql",
  "supabase/schuljahr_v2_vertraege.sql",
  "supabase/schuljahr_v3_zahlungen.sql",
  "supabase/schuljahr_v4_unterschrift.sql",
  "supabase/schuljahr_v5_vertragsabschluss.sql",
  "supabase/schuljahr_v6_unterzeichnung.sql",
  "supabase/schuljahr_v7_vorlagen.sql",
];
const alles = readFileSync("supabase/schuljahr_ALLES.sql", "utf8");

describe("Sammeldatei enthält alle Einzeldateien vollständig", () => {
  for (const datei of TEILE) {
    test(`${datei.split("/").pop()} steckt unverändert drin`, () => {
      const inhalt = readFileSync(datei, "utf8");
      assert.ok(alles.includes(inhalt.trimEnd()),
        `Die Sammeldatei ist veraltet. Neu bauen: bash supabase/bau-sammeldatei.sh`);
    });
  }

  test("die Reihenfolge stimmt: v1 vor v2 vor v3 …", () => {
    const stellen = TEILE.map((d) => alles.indexOf(d.split("/").pop() as string));
    assert.ok(stellen.every((x) => x >= 0), "Alle drei Teile müssen benannt sein");
    assert.deepEqual(stellen, [...stellen].sort((a, b) => a - b));
  });

  test("keine der Vorlagen fehlt", () => {
    for (const schluessel of [
      "adminCheck", "erinnerung", "pausierung", "dank", "terminEnde", "minusWarnung",
      "vertragUnterschrieben", "vertragEinladung", "vertragErinnerung",
    ]) {
      assert.ok(alles.includes(`'${schluessel}'`), `Vorlage ${schluessel} fehlt in der Sammeldatei`);
    }
  });
});
