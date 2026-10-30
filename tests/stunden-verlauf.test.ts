// =============================================================================
// Stundenverlauf: Die Zähler zeigen nur OFFENE Stunden – aber Familien
// sollen den kompletten Verlauf sehen (Kleanas Wunsch, Okt. 2026): Was
// wurde wann abgesagt, nachgeholt, verrechnet oder ist verfallen? Vorher
// verschwanden ausgeglichene Stunden einfach aus den Listen.
// =============================================================================
import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { kontoVerlauf } from "../lib/stundenkonto-kern.ts";

const zeile = (teil: Partial<Parameters<typeof kontoVerlauf>[0][0]>) => ({
  slot_date: "2026-10-12", hour: 16, kind: "absage", credited: false,
  counted: null as string | null, note: null as string | null, status: "abgesagt",
  ...teil,
});

describe("Jede Konto-Bewegung bekommt einen lesbaren Eintrag", () => {
  test("Absage mit Gutschrift = Minusstunde", () => {
    const [e] = kontoVerlauf([zeile({ credited: true })]);
    assert.equal(e.art, "minus");
    assert.match(e.text, /\+1 Minus/);
  });
  test("Nachholstunde gleicht die Minusstunde aus – beide bleiben sichtbar", () => {
    const es = kontoVerlauf([
      zeile({ credited: true }),
      zeile({ slot_date: "2026-10-19", kind: "einzel", status: "bestaetigt", counted: "minus" }),
    ]);
    assert.equal(es.length, 2);
    assert.equal(es[1].art, "minusAusgleich");
    assert.match(es[1].text, /−1 Minus/);
  });
  test("Anna-Absage und eingelöstes Guthaben", () => {
    const es = kontoVerlauf([
      zeile({ note: "anna_cancel" }),
      zeile({ kind: "einzel", status: "bestaetigt", counted: "makeup" }),
    ]);
    assert.equal(es[0].art, "nach");
    assert.equal(es[1].art, "nachEingeloest");
  });
  test("Zusatzstunde (Plus) und Plus-Verrechnung einer Absage", () => {
    const es = kontoVerlauf([
      zeile({ kind: "einzel", status: "bestaetigt", counted: "plus" }),
      zeile({ note: "plusverrechnet" }),
    ]);
    assert.equal(es[0].art, "plus");
    assert.equal(es[1].art, "plusVerrechnet");
  });
  test("verfallene Absagen nennen den Grund", () => {
    const es = kontoVerlauf([zeile({ note: "overmax" }), zeile({ note: "late" }), zeile({})]);
    assert.ok(es.every((e) => e.art === "verfallen"));
    assert.match(es[0].text, /voll/);
    assert.match(es[1].text, /weniger als 4 Stunden/i);
  });
  test("verschobene Stunden zeigen das Zieldatum", () => {
    const [e] = kontoVerlauf([zeile({ note: "verschoben:2026-11-18" })]);
    assert.equal(e.art, "verschoben");
    assert.match(e.text, /18\.11\.2026/);
  });
});

describe("Was das Konto nicht bewegt, steht nicht im Verlauf", () => {
  test("stornierte Buchungen, Probestunden, Blöcke und unverrechnete Termine", () => {
    const es = kontoVerlauf([
      zeile({ kind: "einzel", status: "abgesagt", counted: "minus" }), // storniert -> zurückgerechnet
      zeile({ kind: "probe", status: "bestaetigt" }),
      zeile({ kind: "block", status: "bestaetigt" }),
      zeile({ kind: "einzel", status: "bestaetigt", counted: null }),
    ]);
    assert.equal(es.length, 0);
  });
  test("die Reihenfolge der Zeilen bleibt erhalten (neueste zuerst kommt vom Aufrufer)", () => {
    const es = kontoVerlauf([
      zeile({ slot_date: "2026-10-20", credited: true }),
      zeile({ slot_date: "2026-10-01", credited: true }),
    ]);
    assert.deepEqual(es.map((e) => e.datum), ["2026-10-20", "2026-10-01"]);
  });
});

describe("Wächter: der Verlauf hängt am Kalender", () => {
  test("die Kalender-API bietet stundenVerlauf für Schüler an", () => {
    const route = readFileSync("app/api/kalender/route.ts", "utf8");
    assert.match(route, /action === "stundenVerlauf"/);
    assert.match(route, /kontoVerlauf\(/);
  });
  test("die Kalender-Seite hat den Verlauf-Knopf", () => {
    const seite = readFileSync("app/kalender/page.tsx", "utf8");
    assert.match(seite, /stundenVerlauf/);
    assert.match(seite, /Stundenverlauf/);
  });
});
