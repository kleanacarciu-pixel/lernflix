// =============================================================================
// "Gesehen"-Liste der Absagen-Übersicht: robust lesen, begrenzt schreiben
//
// Kleana blendet Einträge unter "Letzte Absagen" mit ✕ aus. Die Liste der
// ausgeblendeten ids liegt als JSON in den Admin-Einstellungen – der Wert
// kommt also aus der Datenbank und kann alles Mögliche sein (leer, kaputt,
// von Hand editiert). Nichts davon darf die Übersicht zum Absturz bringen.
// =============================================================================
import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { gesehenListe, mitGesehen, GESEHEN_MAX } from "../lib/gesehen-kern.ts";

describe("gesehenListe: gespeicherten Wert sicher lesen", () => {
  test("leer/fehlend ergibt eine leere Liste", () => {
    assert.deepEqual(gesehenListe(null), []);
    assert.deepEqual(gesehenListe(""), []);
  });
  test("eine normale Liste kommt unverändert zurück", () => {
    assert.deepEqual(gesehenListe('["a","b"]'), ["a", "b"]);
  });
  test("kaputtes JSON bringt nichts zum Absturz", () => {
    assert.deepEqual(gesehenListe("{kaputt"), []);
    assert.deepEqual(gesehenListe("null"), []);
    assert.deepEqual(gesehenListe('"nur-text"'), []);
    assert.deepEqual(gesehenListe('{"a":1}'), []);
  });
  test("fremde Werte in der Liste werden aussortiert", () => {
    assert.deepEqual(gesehenListe('["a",7,null,{"x":1},"b"]'), ["a", "b"]);
  });
});

describe("mitGesehen: id vormerken", () => {
  test("hängt die id hinten an", () => {
    assert.deepEqual(mitGesehen(["a"], "b"), ["a", "b"]);
    assert.deepEqual(mitGesehen([], "a"), ["a"]);
  });
  test("keine Doppelten – ein zweites ✕ ändert nichts an der Länge", () => {
    assert.deepEqual(mitGesehen(["a", "b"], "a"), ["b", "a"]);
  });
  test("die Liste bleibt begrenzt, die NEUESTEN bleiben erhalten", () => {
    const voll = Array.from({ length: GESEHEN_MAX }, (_, i) => `id${i}`);
    const danach = mitGesehen(voll, "neu");
    assert.equal(danach.length, GESEHEN_MAX);
    assert.equal(danach[danach.length - 1], "neu");
    assert.ok(!danach.includes("id0"), "der älteste Eintrag muss weichen");
    assert.ok(danach.includes("id1"));
  });
  test("Rundlauf: was gespeichert wird, liest gesehenListe wieder", () => {
    const liste = mitGesehen(mitGesehen([], "a"), "b");
    assert.deepEqual(gesehenListe(JSON.stringify(liste)), ["a", "b"]);
  });
});
