// =============================================================================
// Die Unterzeichnung muss auf dem SERVER gelten, nicht nur im Formular
//
// Die Seite kann jeder umgehen – Häkchen anklicken lässt sich auch ohne
// Browser. Entscheidend ist deshalb, was die Schnittstelle prüft, bevor sie
// den Vertrag aktiviert. Dieser Test liest dafür den Quelltext der Route.
// =============================================================================
import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const route = readFileSync("app/api/vertrag/route.ts", "utf8");

/** Der Block, der die Unterschrift entgegennimmt. */
function unterzeichnenBlock(): string {
  const start = route.indexOf("// --- unterzeichnen ---");
  assert.ok(start > 0, "Der Block 'unterzeichnen' wurde nicht gefunden");
  const ende = route.indexOf('if (action === "meinVertrag")', start);
  assert.ok(ende > start);
  return route.slice(start, ende);
}

describe("Ohne Unterschrift wird nichts aktiviert", () => {
  const block = unterzeichnenBlock();

  test("geprüft wird mit pruefeUnterzeichnung, und zwar VOR dem Speichern", () => {
    const pruefung = block.indexOf("pruefeUnterzeichnung(");
    const speichern = block.indexOf('.from("vertraege").update(');
    assert.ok(pruefung > 0, "Die Prüfung fehlt");
    assert.ok(speichern > pruefung, "Erst prüfen, dann speichern");
  });

  test("eine abgelehnte Prüfung bricht wirklich ab", () => {
    assert.match(block, /if \(!pruefung\.ok\) return bad\(pruefung\.grund\);/);
  });

  test("gespeichert werden Unterschrift, Zeitpunkt und beide Bestätigungen", () => {
    for (const feld of [
      "eltern_unterschrift", "unterzeichnet_am", "agb_bestaetigt_am", "widerruf_bestaetigt_am",
    ]) {
      assert.ok(block.includes(feld), `${feld} wird nicht gespeichert`);
    }
  });

  test("der Vertrag wird dabei aktiv und bekommt seinen Zahlungsplan", () => {
    assert.match(block, /status: "aktiv"/);
    assert.match(block, /schreibeZahlungsplan\(/);
  });

  test("zweimal unterschreiben geht nicht", () => {
    // Zwei Wege sichern das ab: die frühe Rückgabe und die Bedingung in der
    // Schreibung selbst – letztere hält auch zwei gleichzeitige Aufrufe aus.
    assert.match(block, /istUnterzeichnet\(v\.vertrag\)\) return ok\(\{ schonUnterschrieben: true \}\)/);
    assert.match(block, /\.is\("unterzeichnet_am", null\)/);
  });

  test("die Bestätigung ohne Unterschrift gibt es nicht mehr", () => {
    // Solange 'bestaetigen' existierte, liess sich ein Vertrag ohne
    // Unterschrift aktivieren – genau das soll die harte Sperre verhindern.
    assert.equal(/action === "bestaetigen"/.test(route), false,
      "Die alte Bestätigung ohne Unterschrift ist noch erreichbar");
  });
});

describe("Freischalten von Hand (Papier-Rückfall)", () => {
  const block = (() => {
    const start = route.indexOf('case "externAktivieren"');
    assert.ok(start > 0, "Die Aktion 'externAktivieren' wurde nicht gefunden");
    const ende = route.indexOf('case "kuendigungVorschau"', start);
    return route.slice(start, ende);
  })();

  test("nur Kleana kommt dort hin", () => {
    // Die Aktion steht hinter der Admin-Pruefung, nicht im oeffentlichen Teil.
    const adminAb = route.indexOf('if (!prof || prof.role !== "admin")');
    assert.ok(adminAb > 0);
    assert.ok(route.indexOf('case "externAktivieren"') > adminAb,
      "Das Freischalten von Hand darf nicht ohne Anmeldung erreichbar sein");
  });

  test("die Datei wird geprüft, bevor irgendetwas gespeichert wird", () => {
    const pruefung = block.indexOf("pruefeExterneUnterschrift(");
    const speichern = block.indexOf('.update(');
    assert.ok(pruefung > 0 && speichern > pruefung);
    assert.match(block, /if \(!datei\.ok\) return bad\(datei\.grund\);/);
  });

  test("ein bereits unterschriebener Vertrag wird nicht überschrieben", () => {
    assert.match(block, /istUnterzeichnet\(v\.vertrag\)\) return bad\(/);
    assert.match(block, /\.is\("manuell_aktiviert_am", null\)/);
  });

  test("der Vertrag wird aktiv und bekommt seinen Zahlungsplan", () => {
    assert.match(block, /manuell_aktiviert_am: jetzt/);
    assert.match(block, /status: "aktiv"/);
    assert.match(block, /schreibeZahlungsplan\(id\)/);
  });

  test("eine vorhandene AGB-Zustimmung wird nicht überschrieben", () => {
    // Sonst stünde bei einem Wechsel vom Portal aufs Papier ein falscher Tag.
    assert.match(block, /agb_akzeptiert_am: v\.vertrag\.agb_akzeptiert_am \|\| jetzt/);
  });
});

describe("Die Buchungssperre hängt an der Unterschrift", () => {
  test("darfBuchen fragt nach unterzeichnet_am", () => {
    const kern = readFileSync("lib/vertrag-kern.ts", "utf8");
    const start = kern.indexOf("export function darfBuchen");
    const block = kern.slice(start, kern.indexOf("\n}", start));
    assert.match(block, /!vertrag\.unterzeichnet_am/);
    assert.match(block, /!vertrag\.manuell_aktiviert_am/);
  });

  test("alle vier Buchungswege im Kalender fragen weiterhin nach", () => {
    const kalender = readFileSync("app/api/kalender/route.ts", "utf8");
    assert.equal([...kalender.matchAll(/const g = await buchungErlaubt\(/g)].length, 4);
  });
});
