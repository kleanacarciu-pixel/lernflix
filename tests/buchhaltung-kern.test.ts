// =============================================================================
// Tests der Buchhaltungs-Regeln: Saldo, Ausgleich, GuV, USt, Buchungsvorlagen
// =============================================================================
import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  nettoAusBrutto, kontoSaldoCent, buchungAusgeglichen, guvCent, ustZahllastCent,
  einnahmeZeilen, ausgabeZeilen, transferZeilen,
  type Buchungszeile,
} from "../lib/buchhaltung-kern.ts";

describe("nettoAusBrutto", () => {
  test("0 % USt: netto = brutto", () => {
    assert.deepEqual(nettoAusBrutto(10000, 0), { nettoCent: 10000, steuerCent: 0 });
  });
  test("19 % USt: 119 € brutto -> 100 € netto + 19 € Steuer", () => {
    assert.deepEqual(nettoAusBrutto(11900, 19), { nettoCent: 10000, steuerCent: 1900 });
  });
  test("7 % USt mit Rundung", () => {
    const r = nettoAusBrutto(107, 7);
    assert.equal(r.nettoCent + r.steuerCent, 107);
  });
});

describe("kontoSaldoCent", () => {
  const zeilen: Buchungszeile[] = [
    { kontoId: 1, sollCent: 10000, habenCent: 0 },   // Bank Firma (aktiv): Einnahme rein
    { kontoId: 2, sollCent: 0, habenCent: 10000 },   // Erlöse (ertrag)
    { kontoId: 1, sollCent: 0, habenCent: 3000 },    // Bank Firma: Ausgabe raus
    { kontoId: 3, sollCent: 3000, habenCent: 0 },    // Aufwand
  ];
  test("Aktivkonto wächst mit Soll, schrumpft mit Haben", () => {
    assert.equal(kontoSaldoCent(zeilen, 1, "aktiv"), 7000);
  });
  test("Ertragskonto wächst mit Haben", () => {
    assert.equal(kontoSaldoCent(zeilen, 2, "ertrag"), 10000);
  });
  test("Aufwandskonto wächst mit Soll", () => {
    assert.equal(kontoSaldoCent(zeilen, 3, "aufwand"), 3000);
  });
  test("Konto ohne Zeilen hat Saldo 0", () => {
    assert.equal(kontoSaldoCent(zeilen, 99, "aktiv"), 0);
  });
});

describe("buchungAusgeglichen", () => {
  test("Soll = Haben ist ausgeglichen", () => {
    assert.equal(buchungAusgeglichen([{ kontoId: 1, sollCent: 500, habenCent: 0 }, { kontoId: 2, sollCent: 0, habenCent: 500 }]), true);
  });
  test("Soll ≠ Haben ist NICHT ausgeglichen", () => {
    assert.equal(buchungAusgeglichen([{ kontoId: 1, sollCent: 500, habenCent: 0 }, { kontoId: 2, sollCent: 0, habenCent: 400 }]), false);
  });
  test("leere/Null-Buchung ist nicht gültig", () => {
    assert.equal(buchungAusgeglichen([]), false);
  });
});

describe("guvCent / ustZahllastCent", () => {
  test("Gewinn = Erträge minus Aufwendungen", () => {
    assert.equal(guvCent([10000, 2000], [3000]), 9000);
  });
  test("Verlust ist negativ", () => {
    assert.equal(guvCent([1000], [5000]), -4000);
  });
  test("USt-Zahllast: erhaltene USt minus Vorsteuer", () => {
    assert.equal(ustZahllastCent(1900, 700), 1200);
  });
  test("negative Zahllast heißt Erstattung", () => {
    assert.equal(ustZahllastCent(500, 1900), -1400);
  });
});

describe("einnahmeZeilen", () => {
  test("ohne USt: zwei Zeilen, ausgeglichen", () => {
    const z = einnahmeZeilen(1, 2, 9, 10000, 0);
    assert.deepEqual(z, [
      { kontoId: 1, sollCent: 10000, habenCent: 0 },
      { kontoId: 2, sollCent: 0, habenCent: 10000 },
    ]);
    assert.equal(buchungAusgeglichen(z), true);
  });
  test("mit 19 % USt: drei Zeilen, ausgeglichen, Konto wächst um den vollen Bruttobetrag", () => {
    const z = einnahmeZeilen(1, 2, 9, 11900, 19);
    assert.equal(z.length, 3);
    assert.equal(buchungAusgeglichen(z), true);
    assert.equal(kontoSaldoCent(z, 1, "aktiv"), 11900);
    assert.equal(kontoSaldoCent(z, 2, "ertrag"), 10000);
    assert.equal(kontoSaldoCent(z, 9, "passiv"), 1900);
  });
  test("Betrag muss größer als 0 sein", () => {
    assert.throws(() => einnahmeZeilen(1, 2, 9, 0, 0));
  });
});

describe("ausgabeZeilen", () => {
  test("mit 19 % USt: Aufwand netto, Vorsteuer separat, Konto sinkt um brutto", () => {
    const z = ausgabeZeilen(1, 3, 10, 11900, 19);
    assert.equal(buchungAusgeglichen(z), true);
    assert.equal(kontoSaldoCent(z, 1, "aktiv"), -11900);
    assert.equal(kontoSaldoCent(z, 3, "aufwand"), 10000);
    assert.equal(kontoSaldoCent(z, 10, "aktiv"), 1900);
  });
});

describe("transferZeilen", () => {
  test("verschiebt den Betrag von einem Konto zum anderen, ausgeglichen", () => {
    const z = transferZeilen(1, 2, 5000);
    assert.equal(buchungAusgeglichen(z), true);
    assert.equal(kontoSaldoCent(z, 1, "aktiv"), -5000);
    assert.equal(kontoSaldoCent(z, 2, "aktiv"), 5000);
  });
  test("gleiches Konto auf beiden Seiten ist unzulässig", () => {
    assert.throws(() => transferZeilen(1, 1, 100));
  });
  test("Betrag muss größer als 0 sein", () => {
    assert.throws(() => transferZeilen(1, 2, 0));
  });
});
