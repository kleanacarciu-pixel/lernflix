// =============================================================================
// Prüfung hochgeladener Unterschriftsbilder (Schritt 1)
// =============================================================================
import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  pruefeUnterschrift, hatUnterschrift, MAX_BYTES,
} from "../lib/unterschrift-kern.ts";

/** Ein Daten-URI mit n Bytes Nutzlast. */
const uri = (typ: string, bytes: number) =>
  `data:image/${typ};base64,` + Buffer.alloc(bytes, 7).toString("base64");

describe("Erlaubte Formate", () => {
  test("PNG wird angenommen", () => {
    const p = pruefeUnterschrift(uri("png", 1000));
    assert.equal(p.ok, true);
    if (p.ok) assert.equal(p.art, "png");
  });

  test("JPEG wird angenommen – auch als image/jpg", () => {
    for (const typ of ["jpeg", "jpg"]) {
      const p = pruefeUnterschrift(uri(typ, 1000));
      assert.equal(p.ok, true, `${typ} müsste durchgehen`);
      if (p.ok) assert.equal(p.art, "jpeg");
    }
  });

  test("andere Formate werden abgewiesen", () => {
    for (const typ of ["gif", "webp", "svg+xml"]) {
      const p = pruefeUnterschrift(uri(typ, 1000));
      assert.equal(p.ok, false, `${typ} dürfte nicht durchgehen`);
      if (!p.ok) assert.match(p.grund, /PNG oder JPG/);
    }
  });

  test("PDF oder roher Text gehen nicht durch", () => {
    assert.equal(pruefeUnterschrift("data:application/pdf;base64,AAAA").ok, false);
    assert.equal(pruefeUnterschrift("nur text").ok, false);
  });
});

describe("Größe", () => {
  test("knapp unter der Grenze geht", () => {
    assert.equal(pruefeUnterschrift(uri("png", MAX_BYTES - 100)).ok, true);
  });

  test("darüber wird abgewiesen, mit Angabe der Größe", () => {
    const p = pruefeUnterschrift(uri("png", MAX_BYTES + 5000));
    assert.equal(p.ok, false);
    if (!p.ok) {
      assert.match(p.grund, /zu groß/);
      assert.match(p.grund, /KB/);
    }
  });

  test("die gemeldete Größe stimmt ungefähr", () => {
    const p = pruefeUnterschrift(uri("png", 10_000));
    assert.equal(p.ok, true);
    if (p.ok) assert.ok(Math.abs(p.bytes - 10_000) <= 2, `gemeldet ${p.bytes}`);
  });
});

describe("Fehlende oder kaputte Eingaben", () => {
  test("leer, null, Zahl", () => {
    for (const x of ["", null, undefined, 42, {}]) {
      assert.equal(pruefeUnterschrift(x).ok, false);
    }
  });

  test("Kopf ohne Inhalt", () => {
    const p = pruefeUnterschrift("data:image/png;base64,");
    assert.equal(p.ok, false);
    if (!p.ok) assert.match(p.grund, /leer/);
  });

  test("unlesbarer Base64-Teil", () => {
    const p = pruefeUnterschrift("data:image/png;base64,!!!nicht base64!!!");
    assert.equal(p.ok, false);
    if (!p.ok) assert.match(p.grund, /lesen/);
  });
});

describe("Normalisierung", () => {
  test("Leerzeichen und Zeilenumbrüche werden entfernt", () => {
    const roh = "data:image/png;base64,AAAA\n  BBBB\tCCCC";
    const p = pruefeUnterschrift(roh);
    assert.equal(p.ok, true);
    if (p.ok) {
      assert.equal(/\s/.test(p.datenUri.split(",")[1]), false);
      assert.equal(p.datenUri, "data:image/png;base64,AAAABBBBCCCC");
    }
  });

  test("umgebende Leerzeichen stören nicht", () => {
    assert.equal(pruefeUnterschrift(`  ${uri("png", 100)}  `).ok, true);
  });
});

describe("hatUnterschrift", () => {
  test("erkennt hinterlegt und nicht hinterlegt", () => {
    assert.equal(hatUnterschrift(uri("png", 500)), true);
    assert.equal(hatUnterschrift(null), false);
    assert.equal(hatUnterschrift(""), false);
    assert.equal(hatUnterschrift("kaputt"), false);
  });
});
