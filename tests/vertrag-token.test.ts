// =============================================================================
// Tests der signierten Bestätigungs-Links (Abschnitt 4)
// =============================================================================
import { test, describe, before } from "node:test";
import assert from "node:assert/strict";

// Muss vor dem Import gesetzt sein – das Modul liest das Geheimnis beim Signieren.
process.env.SUPABASE_SERVICE_ROLE_KEY = "test-geheimnis-nur-fuer-tests";

const { vertragToken, pruefeVertragToken, bestaetigungsLink, GUELTIG_TAGE } =
  await import("../lib/vertrag-token.ts");

const ID = "11111111-2222-3333-4444-555555555555";
const TAG = 86_400_000;

describe("Bestätigungs-Token", () => {
  test("frischer Token ist gültig und liefert die Vertrags-ID", () => {
    const p = pruefeVertragToken(vertragToken(ID));
    assert.equal(p.ok, true);
    if (p.ok) assert.equal(p.vertragId, ID);
  });

  test("gilt 14 Tage", () => {
    assert.equal(GUELTIG_TAGE, 14);
    const jetzt = Date.UTC(2026, 8, 1);
    const t = vertragToken(ID, GUELTIG_TAGE, jetzt);
    // kurz vor Ablauf noch gültig
    assert.equal(pruefeVertragToken(t, jetzt + 14 * TAG - 1000).ok, true);
    // eine Minute nach Ablauf nicht mehr
    const spaet = pruefeVertragToken(t, jetzt + 14 * TAG + 60_000);
    assert.equal(spaet.ok, false);
    if (!spaet.ok) assert.equal(spaet.grund, "abgelaufen");
  });

  test("veränderte Vertrags-ID wird erkannt", () => {
    const t = vertragToken(ID);
    const gefaelscht = t.replace(ID, "99999999-2222-3333-4444-555555555555");
    const p = pruefeVertragToken(gefaelscht);
    assert.equal(p.ok, false);
    if (!p.ok) assert.equal(p.grund, "ungueltig");
  });

  test("verlängertes Ablaufdatum wird erkannt (Signatur deckt es mit ab)", () => {
    const jetzt = Date.UTC(2026, 8, 1);
    const t = vertragToken(ID, 14, jetzt);
    const [id, ablauf, sig] = t.split(".");
    const verlaengert = `${id}.${Number(ablauf) + 365 * TAG}.${sig}`;
    const p = pruefeVertragToken(verlaengert, jetzt);
    assert.equal(p.ok, false);
    // Muss „ungueltig" sein, nicht „abgelaufen" – sonst wäre die Fälschung erfolgreich
    if (!p.ok) assert.equal(p.grund, "ungueltig");
  });

  test("veränderte Signatur wird erkannt", () => {
    const [id, ablauf] = vertragToken(ID).split(".");
    const p = pruefeVertragToken(`${id}.${ablauf}.${"a".repeat(32)}`);
    assert.equal(p.ok, false);
    if (!p.ok) assert.equal(p.grund, "ungueltig");
  });

  test("Unsinn wird abgewiesen, ohne zu stürzen", () => {
    for (const t of ["", "abc", "a.b", "a.b.c.d", "....", "null"]) {
      const p = pruefeVertragToken(t);
      assert.equal(p.ok, false, `„${t}" darf nicht gültig sein`);
    }
  });

  test("Token verschiedener Verträge sind verschieden", () => {
    const a = vertragToken(ID, 14, 1000);
    const b = vertragToken("99999999-2222-3333-4444-555555555555", 14, 1000);
    assert.notEqual(a, b);
  });

  test("Link enthält den Token und die Bestätigungsseite", () => {
    const link = bestaetigungsLink(ID, "https://lernflix.lernemitanna.de/");
    assert.ok(link.startsWith("https://lernflix.lernemitanna.de/vertrag/"));
    const token = link.split("/vertrag/")[1];
    assert.equal(pruefeVertragToken(token).ok, true);
  });
});
