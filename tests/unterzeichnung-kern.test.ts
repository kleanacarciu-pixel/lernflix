// =============================================================================
// Unterzeichnung im Portal – Regeln
//
// Geprüft wird, was ohne Datenbank prüfbar ist: Wann darf unterschrieben
// werden, was zählt als Unterschrift, und in welchem Stand steht ein Vertrag.
// =============================================================================
import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  pruefeUnterzeichnung, istUnterzeichnet, vertragsstand, PFLICHT_BESTAETIGUNGEN,
  MIN_UNTERSCHRIFT_BYTES, STAND_TEXT,
  pruefeExterneUnterschrift, externerTyp, MAX_EXTERN_BYTES,
} from "../lib/unterzeichnung-kern.ts";
import { BESTAETIGUNG_AGB, BESTAETIGUNG_WIDERRUF } from "../lib/vertrag-pdf-texte.ts";

/** Ein Daten-URI mit ungefähr so vielen Bytes Inhalt. */
function bild(bytes: number): string {
  const zeichen = Math.ceil((bytes * 4) / 3);
  return `data:image/png;base64,${"A".repeat(zeichen)}`;
}

describe("Beide Häkchen sind Pflicht", () => {
  const gutesBild = bild(MIN_UNTERSCHRIFT_BYTES + 500);

  test("mit beiden Häkchen und Unterschrift geht es durch", () => {
    const r = pruefeUnterzeichnung({ agb: true, widerruf: true, unterschrift: gutesBild });
    assert.equal(r.ok, true);
  });

  test("ohne AGB-Häkchen nicht", () => {
    const r = pruefeUnterzeichnung({ agb: false, widerruf: true, unterschrift: gutesBild });
    assert.equal(r.ok, false);
    assert.match(r.ok ? "" : r.grund, /beide Punkte/);
  });

  test("ohne Widerrufs-Häkchen nicht", () => {
    assert.equal(pruefeUnterzeichnung({ agb: true, widerruf: false, unterschrift: gutesBild }).ok, false);
  });

  test("ein 'true' als Text zählt nicht als Häkchen", () => {
    // Sonst käme ein aus Versehen als Text gesendetes Formularfeld durch.
    assert.equal(pruefeUnterzeichnung({ agb: "true", widerruf: true, unterschrift: gutesBild }).ok, false);
  });

  test("die beiden Texte stehen wortgleich auch in der PDF", () => {
    assert.equal(PFLICHT_BESTAETIGUNGEN.length, 2);
    assert.equal(PFLICHT_BESTAETIGUNGEN[0].text, BESTAETIGUNG_AGB);
    assert.equal(PFLICHT_BESTAETIGUNGEN[1].text, BESTAETIGUNG_WIDERRUF);
  });
});

describe("Eine leere Zeichenfläche ist keine Unterschrift", () => {
  test("ohne Bild geht es nicht", () => {
    assert.equal(pruefeUnterzeichnung({ agb: true, widerruf: true }).ok, false);
  });

  test("ein winziges Bild gilt als leeres Feld", () => {
    // Eine unberührte Zeichenfläche ergibt ein gültiges, aber sehr kleines PNG.
    const r = pruefeUnterzeichnung({ agb: true, widerruf: true, unterschrift: bild(200) });
    assert.equal(r.ok, false);
    assert.match(r.ok ? "" : r.grund, /leer/);
  });

  test("knapp über der Grenze reicht", () => {
    assert.equal(pruefeUnterzeichnung({
      agb: true, widerruf: true, unterschrift: bild(MIN_UNTERSCHRIFT_BYTES + 10),
    }).ok, true);
  });

  test("ein PDF statt eines Bildes geht nicht", () => {
    assert.equal(pruefeUnterzeichnung({
      agb: true, widerruf: true, unterschrift: "data:application/pdf;base64,AAAA",
    }).ok, false);
  });
});

describe("Wann gilt ein Vertrag als unterschrieben?", () => {
  test("ohne Vertrag: nein", () => {
    assert.equal(istUnterzeichnet(null), false);
  });

  test("AGB-Zustimmung allein genügt nicht", () => {
    assert.equal(istUnterzeichnet({ status: "aktiv" }), false);
  });

  test("Unterschrift im Portal genügt", () => {
    assert.equal(istUnterzeichnet({ status: "aktiv", unterzeichnet_am: "2026-09-01T10:00:00Z" }), true);
  });

  test("Freischaltung von Hand genügt auch (Papier-Rückfall)", () => {
    assert.equal(istUnterzeichnet({ status: "aktiv", manuell_aktiviert_am: "2026-09-01T10:00:00Z" }), true);
  });
});

describe("Auf Papier unterschrieben – der Rückfall", () => {
  const inhalt = (bytes: number) => "A".repeat(Math.ceil((bytes * 4) / 3));

  test("eine PDF geht durch", () => {
    const r = pruefeExterneUnterschrift(`data:application/pdf;base64,${inhalt(5000)}`);
    assert.equal(r.ok, true);
    assert.equal(r.ok && r.art, "pdf");
  });

  test("ein Handyfoto geht auch", () => {
    for (const kopf of ["data:image/jpeg;base64,", "data:image/jpg;base64,", "data:image/png;base64,"]) {
      assert.equal(pruefeExterneUnterschrift(`${kopf}${inhalt(9000)}`).ok, true, kopf);
    }
  });

  test("ein Word-Dokument nicht", () => {
    const r = pruefeExterneUnterschrift(`data:application/msword;base64,${inhalt(500)}`);
    assert.equal(r.ok, false);
    assert.match(r.ok ? "" : r.grund, /PDF/);
  });

  test("nichts hochgeladen wird abgefangen", () => {
    for (const leer of [undefined, null, "", "   ", 42]) {
      assert.equal(pruefeExterneUnterschrift(leer).ok, false, String(leer));
    }
  });

  test("zu große Dateien werden abgewiesen, mit Größe im Text", () => {
    const r = pruefeExterneUnterschrift(`data:application/pdf;base64,${inhalt(MAX_EXTERN_BYTES + 5000)}`);
    assert.equal(r.ok, false);
    assert.match(r.ok ? "" : r.grund, /zu groß/);
    assert.match(r.ok ? "" : r.grund, /MB/);
  });

  test("eine Unterschrift darf hier größer sein als im Portal", () => {
    // Ein ganzes Dokument braucht mehr Platz als ein Namenszug.
    assert.ok(MAX_EXTERN_BYTES > MIN_UNTERSCHRIFT_BYTES * 100);
  });

  test("der Typ wird zum Ausliefern wiedererkannt", () => {
    assert.deepEqual(externerTyp("data:application/pdf;base64,AAAA"), { mime: "application/pdf", endung: "pdf" });
    assert.deepEqual(externerTyp("data:image/jpeg;base64,AAAA"), { mime: "image/jpeg", endung: "jpg" });
    assert.deepEqual(externerTyp("data:image/png;base64,AAAA"), { mime: "image/png", endung: "png" });
    assert.equal(externerTyp(null), null);
    assert.equal(externerTyp("irgendwas"), null);
  });
});

describe("Stand eines Vertrags", () => {
  test("frisch angelegt: erstellt", () => {
    assert.equal(vertragsstand({ status: "angeboten" }).stand, "erstellt");
  });

  test("verschickt: eingeladen, mit Datum", () => {
    const s = vertragsstand({ status: "angeboten", eingeladen_am: "2026-08-20T09:00:00Z" });
    assert.equal(s.stand, "eingeladen");
    assert.equal(s.seit, "2026-08-20T09:00:00Z");
  });

  test("unterschrieben schlägt eingeladen", () => {
    const s = vertragsstand({
      status: "aktiv", eingeladen_am: "2026-08-20T09:00:00Z",
      unterzeichnet_am: "2026-08-22T18:30:00Z",
    });
    assert.equal(s.stand, "unterschrieben");
    assert.equal(s.seit, "2026-08-22T18:30:00Z");
  });

  test("beendet und gekündigt zählen als beendet", () => {
    for (const status of ["beendet", "gekuendigt"]) {
      assert.equal(vertragsstand({ status, unterzeichnet_am: "2026-08-22T18:30:00Z" }).stand, "beendet");
    }
  });

  test("zu jedem Stand gibt es einen deutschen Text", () => {
    for (const stand of ["erstellt", "eingeladen", "unterschrieben", "beendet"] as const) {
      assert.ok(STAND_TEXT[stand].length > 3);
    }
  });
});
