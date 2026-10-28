// =============================================================================
// Schulfrei (Ferien/Feiertage) im Kalender
//
// Kleanas Fund (Nov. 2026): Schüler mit Ferien am 4. November haben laut
// Vertrag keinen Unterricht (unterrichtsfreie Tage sind herausgerechnet und
// nicht bezahlt) – der Kalender malte den festen Termin aber trotzdem hin,
// und eine Absage dort erzeugte fälschlich eine Minusstunde.
//
// Seitdem gilt: An schulfreien Tagen (je Schule des Kindes) erscheint der
// feste Wochentermin gar nicht erst, es entsteht keine Klassenzimmer-Stunde
// (keine Erinnerung), und Absagen werden mit klarer Meldung abgelehnt.
// Einzel- und Nachholtermine bleiben buchbar – Ferien-Nachhilfe ist laut
// AGB ausdrücklich möglich.
// =============================================================================
import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { tagIntervalle, schulfreiGrund, type FreiKontext } from "../lib/kalender.ts";
import { relevanteFreieTage } from "../lib/schuljahr-kern.ts";

const slot = [{
  student_id: "s1", weekday: 2, hour: 16, status: "aktiv",
  mode: "online" as string | null, dauer_min: 60, created_at: null as string | null,
}];
const male = (frei: Set<string> | undefined) =>
  tagIntervalle("2026-11-04", 2, slot, [], [], () => "Kind", frei);

describe("Kalender-Anzeige an schulfreien Tagen", () => {
  test("ohne Schulfrei-Wissen wird der Termin wie bisher gemalt", () => {
    assert.equal(male(undefined).length, 1);
    assert.equal(male(new Set()).length, 1);
  });
  test("steht der Schüler auf der Schulfrei-Liste, verschwindet sein Termin", () => {
    assert.equal(male(new Set(["s1"])).length, 0);
  });
  test("andere Schüler bleiben unberührt", () => {
    assert.equal(male(new Set(["jemand-anderes"])).length, 1);
  });
});

describe("schulfreiGrund: wer hat wann frei?", () => {
  const herbstBayern = { datum_von: "2026-11-02", datum_bis: "2026-11-06", ist_feiertag: false, schule_id: null, bezeichnung: "Herbstferien" };
  const feiertag = { datum_von: "2026-11-01", datum_bis: "2026-11-01", ist_feiertag: true, schule_id: null, bezeichnung: "Allerheiligen" };
  const intSchule = { datum_von: "2026-11-04", datum_bis: "2026-11-04", ist_feiertag: false, schule_id: "schule-int", bezeichnung: "Schulfeiertag" };
  const ctx: FreiKontext = {
    frei: [herbstBayern, feiertag, intSchule],
    schuleVon: new Map([["kind-int", "schule-int"]]),
  };

  test("ohne eigene Schule gelten die bayerischen Ferien", () => {
    assert.equal(schulfreiGrund(ctx, "kind-bayern", "2026-11-04"), "Herbstferien");
    assert.equal(schulfreiGrund(ctx, "kind-bayern", "2026-11-09"), null);
  });
  test("eigene Schule ERSETZT die bayerischen Ferien, Feiertage gelten trotzdem", () => {
    // 2.11. ist bayerische Ferienzeit, aber die internationale Schule hat Unterricht
    assert.equal(schulfreiGrund(ctx, "kind-int", "2026-11-02"), null);
    assert.equal(schulfreiGrund(ctx, "kind-int", "2026-11-04"), "Schulfeiertag");
    assert.equal(schulfreiGrund(ctx, "kind-int", "2026-11-01"), "Allerheiligen");
  });
  test("ohne Ferien-Daten gibt es nie ein falsches Ausblenden", () => {
    assert.equal(schulfreiGrund({ frei: [], schuleVon: new Map() }, "egal", "2026-11-04"), null);
  });
  test("die Schul-Auswahl entspricht der Vertragsrechnung (relevanteFreieTage)", () => {
    // Dieselbe Regel, die die Terminliste der Verträge nutzt – der Kalender
    // darf nie etwas anderes ausblenden, als der Vertrag herausrechnet.
    const fuerInt = relevanteFreieTage(ctx.frei, "schule-int");
    assert.deepEqual(fuerInt.map((f) => f.bezeichnung), ["Allerheiligen", "Schulfeiertag"]);
  });
});

describe("Wächter: die Schulfrei-Regel darf nie still wegfallen", () => {
  test("Schüler- und Admin-Absage lehnen schulfreie Tage ab", () => {
    const route = readFileSync("app/api/kalender/route.ts", "utf8");
    assert.ok([...route.matchAll(/schulfreiGrund\(await ladeFreiKontext\(\)/g)].length >= 2,
      "cancelMine UND adminCancel müssen den Schulfrei-Wächter haben");
  });
  test("die Stunden-Synchronisation legt an schulfreien Tagen nichts an", () => {
    const stn = readFileSync("lib/stunden.ts", "utf8");
    assert.match(stn, /if \(schulfreiGrund\(freiCtx, f\.student_id, date\)\) return;/);
  });
  test("die Wochenansicht blendet feste Termine an schulfreien Tagen aus", () => {
    const kal = readFileSync("lib/kalender.ts", "utf8");
    assert.match(kal, /if \(schulfreiSids\?\.has\(f\.student_id\)\) return;/);
  });
});
