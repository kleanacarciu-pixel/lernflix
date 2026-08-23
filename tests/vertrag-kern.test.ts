// =============================================================================
// Tests der Preisberechnung (Abschnitt 3, Sollwerte aus Abschnitt 8)
// Ausführen:  npm test
// =============================================================================
import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  berechneJahresbetrag, einmalbetragCent, ratenMonate, berechneRaten, ratenplan,
  ratenNeuVerteilen, euroZuCent, centFormat, kaufmaennisch, darfBuchen,
} from "../lib/vertrag-kern.ts";
import { termineImZeitraum, type FreierZeitraum } from "../lib/schuljahr-kern.ts";

// --- Stammdaten 2026/27 (wie in supabase/schuljahr_v1_schema.sql) -----------
const ERSTER = "2026-09-15";
const LETZTER = "2027-07-30";
const f = (von: string, bis: string, feiertag = false): FreierZeitraum =>
  ({ datum_von: von, datum_bis: bis, ist_feiertag: feiertag, schule_id: null });
const BAYERN: FreierZeitraum[] = [
  f("2026-11-02", "2026-11-06"), f("2026-11-18", "2026-11-18"),
  f("2026-12-24", "2027-01-08"), f("2027-02-08", "2027-02-12"),
  f("2027-03-22", "2027-04-02"), f("2027-05-06", "2027-05-06", true),
  f("2027-05-17", "2027-05-17", true), f("2027-05-18", "2027-05-28"),
];
const termine = (wochentag: number, abDatum?: string) =>
  termineImZeitraum({ erster: ERSTER, letzter: LETZTER, wochentag, frei: BAYERN, abDatum });
const anzahl = (wochentag: number, abDatum?: string) => termine(wochentag, abDatum).length;

describe("Geldbeträge", () => {
  test("euroZuCent rundet kaufmännisch", () => {
    assert.equal(euroZuCent(45), 4500);
    assert.equal(euroZuCent(45.5), 4550);
    assert.equal(euroZuCent(4.56), 456);   // ohne Rundung wären es 455
    assert.equal(euroZuCent(0.005), 1);
  });

  test("kaufmännisch rundet 0,5 vom Nullpunkt weg (kein Banker's Rounding)", () => {
    assert.equal(kaufmaennisch(2.5), 3);
    assert.equal(kaufmaennisch(3.5), 4);   // Banker's Rounding ergäbe 4 – hier auch
    assert.equal(kaufmaennisch(0.5), 1);   // Banker's Rounding ergäbe 0
    assert.equal(kaufmaennisch(1.5), 2);
    assert.equal(kaufmaennisch(-0.5), -1); // Math.round ergäbe -0
  });

  test("centFormat schreibt deutsch", () => {
    assert.equal(centFormat(315000), "3.150,00 €");
    assert.equal(centFormat(18000), "180,00 €");
  });
});

// Hilfsmittel: ein Wochentermin ueber das ganze Schuljahr
const tag = (wochentag: number, termine: string[], ab = ERSTER, bis = LETZTER) =>
  ({ wochentag, termine, ab, bis });
const alle = (wochentag: number) => tag(wochentag, termine(wochentag));

describe("Jahresbetrag: ein Wochentermin", () => {
  test("Mittwoch bei 50 € = 37 × 50 = 1.850 €", () => {
    const p = berechneJahresbetrag({
      tage: [alle(2)],
      stundensatzCent: euroZuCent(50), stundensatzZweitCent: euroZuCent(45),
    });
    assert.equal(anzahl(2), 37);
    assert.equal(p.jahresbetragCent, 37 * 5000);
    assert.equal(p.posten[0].ermaessigt, false);
    assert.deepEqual(p.familienMonate, []);
  });
});

describe("Familienpreis: zwei Wochentermine – ALLES ermäßigt", () => {
  test("Di + Do bei 45/40 = 74 × 40 = 2.960 €", () => {
    const di = anzahl(1), do_ = anzahl(3);
    assert.equal(di, 38);
    assert.equal(do_, 36);

    const p = berechneJahresbetrag({
      tage: [alle(1), alle(3)],
      stundensatzCent: euroZuCent(45), stundensatzZweitCent: euroZuCent(40),
    });
    assert.equal(p.jahresbetragCent, euroZuCent(2960));
    assert.equal(centFormat(p.jahresbetragCent), "2.960,00 €");
    assert.equal(di + do_, 74);

    // BEIDE Tage laufen zum ermäßigten Satz – kein voller Satz mehr.
    assert.equal(p.posten.length, 2);
    for (const x of p.posten) {
      assert.equal(x.ermaessigt, true, `Wochentag ${x.wochentag} müsste ermäßigt sein`);
      assert.equal(x.satzCent, euroZuCent(40));
    }
  });

  test("Reihenfolge der Eingabe ändert nichts", () => {
    const a = berechneJahresbetrag({
      tage: [alle(1), alle(3)], stundensatzCent: 4500, stundensatzZweitCent: 4000,
    });
    const b = berechneJahresbetrag({
      tage: [alle(3), alle(1)], stundensatzCent: 4500, stundensatzZweitCent: 4000,
    });
    assert.equal(a.jahresbetragCent, b.jahresbetragCent);
  });

  test("gleiche Terminzahl: trotzdem beide ermäßigt", () => {
    const p = berechneJahresbetrag({
      tage: [alle(4), alle(0)], stundensatzCent: 4500, stundensatzZweitCent: 4000,
    });
    assert.equal(p.posten.every((x) => x.ermaessigt), true);
    assert.equal(p.jahresbetragCent, (anzahl(4) + anzahl(0)) * 4000);
  });

  test("ein Ferienmonat ohne Termine kippt den Familienpreis nicht", () => {
    // August liegt ausserhalb; hier zaehlt der Geltungszeitraum, nicht ob
    // zufaellig ein Termin in den Monat faellt.
    const p = berechneJahresbetrag({
      tage: [alle(1), alle(3)], stundensatzCent: 4500, stundensatzZweitCent: 4000,
    });
    assert.equal(p.posten.every((x) => x.ermaessigt), true);
  });
});

describe("Familienpreis: zweites Kind", () => {
  test("ein Wochentermin als zweites Kind läuft zum reduzierten Satz", () => {
    const p = berechneJahresbetrag({
      tage: [alle(2)],
      stundensatzCent: euroZuCent(45), stundensatzZweitCent: euroZuCent(40),
      zweitesKind: true,
    });
    assert.equal(p.jahresbetragCent, 37 * 4000);
    assert.equal(p.posten[0].ermaessigt, true);
  });

  test("ohne das Flag gilt der volle Satz", () => {
    const p = berechneJahresbetrag({
      tage: [alle(2)],
      stundensatzCent: euroZuCent(45), stundensatzZweitCent: euroZuCent(40),
    });
    assert.equal(p.jahresbetragCent, 37 * 4500);
  });
});

describe("Ratenmonate", () => {
  test("Schuljahresbeginn September: 11 Monate bis Juli", () => {
    const m = ratenMonate("2026-09-01", LETZTER);
    assert.equal(m.length, 11);
    assert.equal(m[0], "2026-09-01");
    assert.equal(m[m.length - 1], "2027-07-01");
  });

  test("Quereinstieg 1. März: 5 Monate", () => {
    const m = ratenMonate("2027-03-01", LETZTER);
    assert.deepEqual(m, ["2027-03-01", "2027-04-01", "2027-05-01", "2027-06-01", "2027-07-01"]);
  });

  test("August ist nie ein Ratenmonat", () => {
    for (const m of ratenMonate("2026-08-01", LETZTER)) {
      assert.notEqual(m.slice(5, 7), "08", `${m} darf keine Rate sein`);
    }
  });

  test("Beginn im Juli: genau eine Rate", () => {
    assert.deepEqual(ratenMonate("2027-07-01", LETZTER), ["2027-07-01"]);
  });
});

describe("Raten (Sollwert aus Abschnitt 8)", () => {
  test("Quereinstieg 1. März, Mittwoch, 50 € = 900 € in 5 Raten à 180 €", () => {
    const n = anzahl(2, "2027-03-01");
    assert.equal(n, 18);

    const p = berechneJahresbetrag({
      tage: [tag(2, termine(2, "2027-03-01"), "2027-03-01")],
      stundensatzCent: euroZuCent(50), stundensatzZweitCent: euroZuCent(45),
    });
    assert.equal(p.jahresbetragCent, euroZuCent(900));

    const plan = ratenplan({ jahresbetragCent: p.jahresbetragCent, vertragsbeginn: "2027-03-01", letzterSchultag: LETZTER });
    assert.equal(plan.length, 5);
    for (const r of plan) assert.equal(r.betragCent, euroZuCent(180));
  });

  test("Summe aller Raten ergibt exakt den Jahresbetrag", () => {
    // Auch bei Beträgen, die sich nicht glatt teilen lassen
    for (const betrag of [315000, 185000, 90000, 100001, 99999, 123457, 1, 7]) {
      for (const n of [1, 2, 3, 5, 7, 11, 12]) {
        const raten = berechneRaten(betrag, n);
        assert.equal(raten.length, n);
        assert.equal(raten.reduce((s, r) => s + r, 0), betrag, `${betrag} auf ${n} Raten`);
      }
    }
  });

  test("nur die letzte Rate weicht ab, und zwar minimal", () => {
    const raten = berechneRaten(100001, 3); // 1000,01 € auf 3 Raten
    assert.equal(raten[0], raten[1]);
    assert.ok(Math.abs(raten[2] - raten[0]) <= 2, "Abweichung höchstens ein paar Cent");
    assert.equal(raten.reduce((s, r) => s + r, 0), 100001);
  });

  test("keine Raten bei Anzahl null", () => {
    assert.deepEqual(berechneRaten(1000, 0), []);
  });
});

describe("Einmalzahlung", () => {
  test("Jahresbetrag abzüglich 50 €", () => {
    assert.equal(einmalbetragCent(euroZuCent(3150)), euroZuCent(3100));
  });
  test("wird nie negativ", () => {
    assert.equal(einmalbetragCent(euroZuCent(20)), 0);
  });
});

describe("Raten nach Vertragsänderung (Vorbereitung Abschnitt 5)", () => {
  test("Rest verteilt sich auf die verbleibenden Monate", () => {
    // 3.150 € neu, 2 Raten à 300 € schon fällig -> 2.550 € auf 5 Monate
    const plan = ratenNeuVerteilen({
      neuerJahresbetragCent: euroZuCent(3150),
      bereitsFaelligCent: euroZuCent(600),
      verbleibendeMonate: ["2027-03-01", "2027-04-01", "2027-05-01", "2027-06-01", "2027-07-01"],
    });
    assert.equal(plan.length, 5);
    assert.equal(plan.reduce((s, r) => s + r.betragCent, 0), euroZuCent(2550));
    assert.equal(plan[0].betragCent, euroZuCent(510));
  });

  test("Summe bleibt exakt, auch wenn es nicht aufgeht", () => {
    const plan = ratenNeuVerteilen({
      neuerJahresbetragCent: 100000, bereitsFaelligCent: 33333,
      verbleibendeMonate: ["2027-05-01", "2027-06-01", "2027-07-01"],
    });
    assert.equal(plan.reduce((s, r) => s + r.betragCent, 0), 100000 - 33333);
  });
});

describe("Buchungssperre ohne AGB-Bestätigung (Abschnitt 4)", () => {
  test("ohne Vertrag darf gebucht werden (Probestunde bleibt möglich)", () => {
    assert.equal(darfBuchen(null).erlaubt, true);
  });

  test("angebotener Vertrag ohne Bestätigung sperrt die Buchung", () => {
    const r = darfBuchen({ status: "angeboten", agb_akzeptiert_am: null });
    assert.equal(r.erlaubt, false);
    assert.match(r.grund || "", /AGB/);
  });

  test("aktiver Vertrag ohne Bestätigung sperrt ebenfalls", () => {
    assert.equal(darfBuchen({ status: "aktiv", agb_akzeptiert_am: null }).erlaubt, false);
  });

  test("nach der Bestätigung ist die Buchung frei", () => {
    assert.equal(darfBuchen({ status: "aktiv", agb_akzeptiert_am: "2026-09-01T10:00:00Z" }).erlaubt, true);
  });

  test("beendeter oder gekündigter Vertrag sperrt nicht", () => {
    assert.equal(darfBuchen({ status: "beendet", agb_akzeptiert_am: null }).erlaubt, true);
    assert.equal(darfBuchen({ status: "gekuendigt", agb_akzeptiert_am: null }).erlaubt, true);
  });
});
