// =============================================================================
// Tests der Finanzheft-Regeln: Saldo, Vermischungswarnung, Transfer
// =============================================================================
import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  saldoCent, saldenBeide, pruefeBuchung, pruefeVermischung, transferBuchungen,
  TRANSFER_KATEGORIE,
  type Buchung,
} from "../lib/finanzheft-kern.ts";

const b = (a: Partial<Buchung> = {}): Buchung => ({
  konto: "privat", typ: "ausgabe", betragCent: 1000, kategorie: "Sonstiges", datum: "2027-03-01", ...a,
});

describe("Saldo je Konto", () => {
  test("Einnahmen zählen positiv, Ausgaben negativ", () => {
    const buchungen = [
      b({ konto: "privat", typ: "einnahme", betragCent: 5000 }),
      b({ konto: "privat", typ: "ausgabe", betragCent: 2000 }),
      b({ konto: "firma", typ: "einnahme", betragCent: 9000 }),
    ];
    assert.equal(saldoCent(buchungen, "privat"), 3000);
    assert.equal(saldoCent(buchungen, "firma"), 9000);
  });

  test("saldenBeide liefert beide Konten getrennt", () => {
    const buchungen = [b({ konto: "privat", typ: "einnahme", betragCent: 100 }), b({ konto: "firma", typ: "ausgabe", betragCent: 40 })];
    assert.deepEqual(saldenBeide(buchungen), { privatCent: 100, firmaCent: -40 });
  });

  test("leere Liste ergibt Saldo 0", () => {
    assert.equal(saldoCent([], "privat"), 0);
  });
});

describe("pruefeBuchung", () => {
  test("Betrag muss größer als 0 sein", () => {
    const r = pruefeBuchung({ betragCent: 0, kategorie: "x", datum: "2027-03-01" });
    assert.equal(r.ok, false);
  });
  test("Datum muss ISO-Format haben", () => {
    const r = pruefeBuchung({ betragCent: 100, kategorie: "x", datum: "01.03.2027" });
    assert.equal(r.ok, false);
  });
  test("leere Kategorie wird abgelehnt", () => {
    const r = pruefeBuchung({ betragCent: 100, kategorie: "  ", datum: "2027-03-01" });
    assert.equal(r.ok, false);
  });
  test("gültige Buchung geht durch", () => {
    assert.deepEqual(pruefeBuchung({ betragCent: 100, kategorie: "x", datum: "2027-03-01" }), { ok: true });
  });
});

describe("Vermischungswarnung", () => {
  test("Firmenkategorie auf dem privaten Konto warnt", () => {
    const r = pruefeVermischung("privat", "Werbung");
    assert.equal(r.warnung, true);
  });
  test("private Kategorie auf dem Firmenkonto warnt", () => {
    const r = pruefeVermischung("firma", "Miete");
    assert.equal(r.warnung, true);
  });
  test("passende Kategorie warnt nicht", () => {
    assert.equal(pruefeVermischung("privat", "Miete").warnung, false);
    assert.equal(pruefeVermischung("firma", "Werbung").warnung, false);
  });
  test("Transfer-Kategorie warnt nie", () => {
    assert.equal(pruefeVermischung("privat", TRANSFER_KATEGORIE).warnung, false);
  });
});

describe("transferBuchungen", () => {
  test("erzeugt eine Ausgabe- und eine Einnahme-Zeile mit gleichem Betrag", () => {
    const { ausgabe, einnahme } = transferBuchungen("firma", "privat", 5000, "2027-03-01");
    assert.deepEqual(ausgabe, { konto: "firma", typ: "ausgabe", betragCent: 5000, kategorie: TRANSFER_KATEGORIE, datum: "2027-03-01" });
    assert.deepEqual(einnahme, { konto: "privat", typ: "einnahme", betragCent: 5000, kategorie: TRANSFER_KATEGORIE, datum: "2027-03-01" });
  });
  test("gleiches Konto auf beiden Seiten ist unzulässig", () => {
    assert.throws(() => transferBuchungen("privat", "privat", 100, "2027-03-01"));
  });
  test("Betrag muss größer als 0 sein", () => {
    assert.throws(() => transferBuchungen("privat", "firma", 0, "2027-03-01"));
  });
});
