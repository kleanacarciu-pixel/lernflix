// =============================================================================
// Familienpreis (AGB § 6 Abs. 2)
//
// Ab dem zweiten festen Wochentermin gilt der reduzierte Satz für JEDEN
// Termin der Familie. Endet einer der beiden Termine, gilt für den
// verbleibenden ab dem FOLGEMONAT wieder der reguläre Satz.
// =============================================================================
import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { termineImZeitraum, type FreierZeitraum } from "../lib/schuljahr-kern.ts";
import {
  berechneJahresbetrag, familienMonateVon, ratenplan, euroZuCent, centFormat,
} from "../lib/vertrag-kern.ts";

const ERSTER = "2026-09-15", LETZTER = "2027-07-30";
const f = (bez: string, von: string, bis: string, ft = false): FreierZeitraum =>
  ({ bezeichnung: bez, datum_von: von, datum_bis: bis, ist_feiertag: ft, schule_id: null });
const BAYERN: FreierZeitraum[] = [
  f("Tag der Deutschen Einheit", "2026-10-03", "2026-10-03", true),
  f("Herbstferien", "2026-11-02", "2026-11-06"),
  f("Buß- und Bettag", "2026-11-18", "2026-11-18"),
  f("Weihnachtsferien", "2026-12-24", "2027-01-08"),
  f("Frühjahrsferien", "2027-02-08", "2027-02-12"),
  f("Osterferien", "2027-03-22", "2027-04-02"),
  f("Tag der Arbeit", "2027-05-01", "2027-05-01", true),
  f("Christi Himmelfahrt", "2027-05-06", "2027-05-06", true),
  f("Pfingstmontag", "2027-05-17", "2027-05-17", true),
  f("Pfingstferien", "2027-05-18", "2027-05-28"),
];

const termine = (wochentag: number, ab = ERSTER, bis = LETZTER) =>
  termineImZeitraum({ erster: ERSTER, letzter: LETZTER, wochentag, frei: BAYERN, abDatum: ab })
    .filter((d) => d <= bis);
const tag = (wochentag: number, ab = ERSTER, bis = LETZTER) =>
  ({ wochentag, termine: termine(wochentag, ab, bis), ab, bis });

const SATZ = euroZuCent(45);
const ERM  = euroZuCent(40);

describe("Familie mit Di + Do: alles zum ermäßigten Satz", () => {
  const p = berechneJahresbetrag({
    tage: [tag(1), tag(3)], stundensatzCent: SATZ, stundensatzZweitCent: ERM,
  });

  test("74 Termine × 40 € = 2.960 €", () => {
    const gesamt = termine(1).length + termine(3).length;
    assert.equal(gesamt, 74);
    assert.equal(p.jahresbetragCent, euroZuCent(2960));
    assert.equal(centFormat(p.jahresbetragCent), "2.960,00 €");
  });

  test("kein einziger Posten läuft zum vollen Satz", () => {
    for (const x of p.posten) {
      assert.equal(x.ermaessigt, true);
      assert.equal(x.satzCent, ERM);
    }
  });

  test("Rate 269,09 € bei 11 Raten", () => {
    const plan = ratenplan({
      jahresbetragCent: p.jahresbetragCent,
      vertragsbeginn: "2026-09-01", letzterSchultag: LETZTER,
    });
    assert.equal(plan.length, 11);
    assert.equal(centFormat(plan[0].betragCent), "269,09 €");
    assert.equal(plan.reduce((s, r) => s + r.betragCent, 0), p.jahresbetragCent);
  });
});

describe("Donnerstag endet zum 31.01. – ab Februar wieder voller Satz", () => {
  const diTag = tag(1);
  const doTag = tag(3, ERSTER, "2027-01-31");
  const p = berechneJahresbetrag({
    tage: [diTag, doTag], stundensatzCent: SATZ, stundensatzZweitCent: ERM,
  });

  test("Familienmonate sind September bis Januar", () => {
    assert.deepEqual(p.familienMonate,
      ["2026-09", "2026-10", "2026-11", "2026-12", "2027-01"]);
  });

  test("Dienstag hat zwei Posten: ermäßigt bis Januar, voll ab Februar", () => {
    const di = p.posten.filter((x) => x.wochentag === 1);
    assert.equal(di.length, 2);
    assert.equal(di[0].ermaessigt, true);
    assert.equal(di[0].satzCent, ERM);
    assert.ok(di[0].bis <= "2027-01-31", `ermäßigt endet ${di[0].bis}`);
    assert.equal(di[1].ermaessigt, false);
    assert.equal(di[1].satzCent, SATZ);
    assert.ok(di[1].von >= "2027-02-01", `voller Satz beginnt ${di[1].von}`);
  });

  test("Donnerstag läuft komplett ermäßigt und endet im Januar", () => {
    const do_ = p.posten.filter((x) => x.wochentag === 3);
    assert.equal(do_.length, 1);
    assert.equal(do_[0].ermaessigt, true);
    assert.ok(do_[0].bis <= "2027-01-31");
  });

  test("Jahresbetrag stimmt mit der Handrechnung überein", () => {
    const diErm  = termine(1, ERSTER, "2027-01-31").length;
    const diVoll = termine(1, "2027-02-01").length;
    const doErm  = termine(3, ERSTER, "2027-01-31").length;
    assert.equal(p.jahresbetragCent, (diErm + doErm) * ERM + diVoll * SATZ);
  });
});

describe("Der Wochentagswechsel löst KEINEN Familienpreis aus", () => {
  test("zwei aneinander anschließende Zeiten sind ein Termin, der umzieht", () => {
    const alt = tag(1, ERSTER, "2027-01-10");
    const neu = tag(3, "2027-01-11", LETZTER);
    assert.deepEqual(familienMonateVon([alt, neu]), []);

    const p = berechneJahresbetrag({
      tage: [alt, neu], stundensatzCent: SATZ, stundensatzZweitCent: ERM,
    });
    for (const x of p.posten) assert.equal(x.ermaessigt, false, "kein Nachlass beim Umzug");
    assert.equal(p.jahresbetragCent, (alt.termine.length + neu.termine.length) * SATZ);
  });

  test("überschneiden sie sich dagegen, ist es eine Familie", () => {
    const a = tag(1, ERSTER, "2027-01-31");
    const b = tag(3, "2027-01-01", LETZTER);
    assert.ok(familienMonateVon([a, b]).includes("2027-01"));
  });
});
