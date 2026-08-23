// =============================================================================
// Quereinstieg mitten im Monat
//
// Ein Schüler fängt am 17. an – nicht am Monatsersten. Gerechnet wird ab der
// ersten Stunde; die Monatsraten laufen ab dem Monat, in dem sie liegt.
// =============================================================================
import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { monatsErster, berechneJahresbetrag, ratenplan, euroZuCent } from "../lib/vertrag-kern.ts";
import { termineImZeitraum, type FreierZeitraum } from "../lib/schuljahr-kern.ts";

// Schuljahr 2026/27 mit den bayerischen Ferien
const f = (von: string, bis: string, feiertag = false): FreierZeitraum =>
  ({ bezeichnung: "", datum_von: von, datum_bis: bis, ist_feiertag: feiertag, schule_id: null });

const FREI: FreierZeitraum[] = [
  f("2026-10-03", "2026-10-03", true),   // Tag der Deutschen Einheit (Samstag)
  f("2026-11-02", "2026-11-06"),
  f("2026-11-18", "2026-11-18"),
  f("2026-12-24", "2027-01-08"),
  f("2027-02-08", "2027-02-12"),
  f("2027-03-22", "2027-04-02"),
  f("2027-05-01", "2027-05-01", true),   // Tag der Arbeit (Samstag)
  f("2027-05-06", "2027-05-06"),
  f("2027-05-17", "2027-05-17"),
  f("2027-05-18", "2027-05-28"),
];
const START_SJ = "2026-09-15";
const ENDE = "2027-07-30";

/** Termine eines Wochentags ab einem Starttag – wie die Engine sie rechnet. */
const termineAb = (wochentag: number, abDatum: string) =>
  termineImZeitraum({ erster: START_SJ, letzter: ENDE, wochentag, frei: FREI, abDatum });

describe("Ratenmonat wird aus dem Starttag abgeleitet", () => {
  test("der 17. gehört zum selben Monat", () => {
    assert.equal(monatsErster("2027-03-17"), "2027-03-01");
    assert.equal(monatsErster("2026-09-30"), "2026-09-01");
    assert.equal(monatsErster("2027-01-01"), "2027-01-01");
  });
});

describe("Schüler startet am 17. März, mittwochs, 50 €", () => {
  // Ab 17.03. – der 17.3.2027 ist ein Mittwoch.
  const termine = termineAb(2, "2027-03-17");

  test("die erste Stunde liegt nicht vor dem Starttag", () => {
    assert.ok(termine.length > 0, "es muss Termine geben");
    assert.ok(termine[0] >= "2027-03-17", `erste Stunde ${termine[0]} liegt zu früh`);
  });

  test("Osterferien direkt danach werden übersprungen", () => {
    // 22.03.–02.04. ist frei, der 24.3. und 31.3. fallen also weg.
    assert.equal(termine.includes("2027-03-24"), false);
    assert.equal(termine.includes("2027-03-31"), false);
    assert.equal(termine[0], "2027-03-17");
    assert.equal(termine[1], "2027-04-07");
  });

  test("Jahresbetrag zählt nur die tatsächlichen Stunden", () => {
    const p = berechneJahresbetrag({
      tage: [{ wochentag: 2, termine, ab: "2027-03-17", bis: ENDE }],
      stundensatzCent: 5000, stundensatzZweitCent: 4500,
    });
    assert.equal(p.jahresbetragCent, termine.length * 5000);
  });

  test("Raten laufen ab März, nicht ab April", () => {
    const p = berechneJahresbetrag({
      tage: [{ wochentag: 2, termine, ab: "2027-03-17", bis: ENDE }],
      stundensatzCent: 5000, stundensatzZweitCent: 4500,
    });
    const plan = ratenplan({
      jahresbetragCent: p.jahresbetragCent,
      vertragsbeginn: monatsErster("2027-03-17"),
      letzterSchultag: ENDE,
    });
    assert.equal(plan[0].monat, "2027-03-01");
    assert.equal(plan.length, 5);                       // Maerz bis Juli
    assert.equal(plan.reduce((s, r) => s + r.betragCent, 0), p.jahresbetragCent);
  });
});

describe("Vergleich: gleicher Monat, aber ab dem Ersten", () => {
  test("wer frueher anfaengt, hat mehr Stunden und zahlt mehr", () => {
    const ab1  = termineAb(2, "2027-03-01");
    const ab17 = termineAb(2, "2027-03-17");
    assert.ok(ab1.length > ab17.length, "ab dem 1. muessen es mehr Termine sein");
    // Beide zahlen in fuenf Raten, aber unterschiedlich hohe.
    const raten = (n: number) => ratenplan({
      jahresbetragCent: n * 5000, vertragsbeginn: "2027-03-01", letzterSchultag: ENDE,
    });
    assert.equal(raten(ab1.length).length, 5);
    assert.equal(raten(ab17.length).length, 5);
    assert.ok(raten(ab1.length)[0].betragCent > raten(ab17.length)[0].betragCent);
  });
});

describe("Randfaelle", () => {
  test("Start nach dem letzten Schultag ergibt keine Termine", () => {
    assert.equal(termineAb(2, "2027-08-15").length, 0);
  });

  test("Start mitten in den Ferien: erste Stunde erst danach", () => {
    const t = termineAb(2, "2027-03-25");   // in den Osterferien
    assert.equal(t[0], "2027-04-07");
  });

  test("Betrag in Euro stimmt fuer einen einfachen Fall", () => {
    const p = berechneJahresbetrag({
      tage: [{ wochentag: 2, termine: termineAb(2, "2027-05-01").slice(0, 10), ab: "2027-05-01", bis: ENDE }],
      stundensatzCent: euroZuCent(50), stundensatzZweitCent: 0,
    });
    assert.equal(p.jahresbetragCent, euroZuCent(500));
  });
});
