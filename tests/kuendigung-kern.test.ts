// =============================================================================
// Tests der Kündigungsfrist und der Endabrechnung (Abschnitt 7)
// =============================================================================
import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  monatsEnde, fruehesteKuendigung, pruefeKuendigung, endabrechnung, plusTage,
  abrechnungsText,
  type Vertragstermin, type Absage,
} from "../lib/kuendigung-kern.ts";

const t = (datum: string, satzCent = 4500): Vertragstermin => ({ datum, satzCent });

describe("Monatsende", () => {
  test("normale Monate", () => {
    assert.equal(monatsEnde("2027-03-05"), "2027-03-31");
    assert.equal(monatsEnde("2027-04-30"), "2027-04-30");
    assert.equal(monatsEnde("2027-11-01"), "2027-11-30");
  });
  test("Februar, auch im Schaltjahr", () => {
    assert.equal(monatsEnde("2027-02-10"), "2027-02-28");
    assert.equal(monatsEnde("2028-02-10"), "2028-02-29");
  });
  test("Dezember rollt ins Folgejahr", () => {
    assert.equal(monatsEnde("2026-12-24"), "2026-12-31");
    assert.equal(plusTage("2026-12-31", 1), "2027-01-01");
  });
});

describe("Vier-Wochen-Frist", () => {
  test("früh im Monat gekündigt: dieser Monat reicht noch", () => {
    // 1.3. + 28 Tage = 29.3., liegt vor dem 31.3.
    assert.equal(fruehesteKuendigung("2027-03-01"), "2027-03-31");
  });

  test("später im Monat: es wird der Folgemonat", () => {
    // 5.3. + 28 Tage = 2.4., der 31.3. reicht nicht mehr
    assert.equal(fruehesteKuendigung("2027-03-05"), "2027-04-30");
  });

  test("Jahreswechsel", () => {
    assert.equal(fruehesteKuendigung("2026-12-20"), "2027-01-31");
  });

  test("kurzer Februar: die Frist passt nie in den Monat selbst", () => {
    // 1.2. + 28 Tage = 1.3. – schon einen Tag zu spät für den 28.2.
    assert.equal(fruehesteKuendigung("2027-02-01"), "2027-03-31");
    assert.equal(fruehesteKuendigung("2027-02-20"), "2027-03-31");
    // Im Schaltjahr reicht es am Monatsersten gerade so
    assert.equal(fruehesteKuendigung("2028-02-01"), "2028-02-29");
  });
});

describe("Prüfung des gewünschten Termins", () => {
  test("passender Termin: keine Hinweise", () => {
    const p = pruefeKuendigung("2027-03-05", "2027-04-30");
    assert.equal(p.ok, true);
    assert.deepEqual(p.hinweise, []);
  });

  test("zu kurzfristig: Hinweis, aber keine Blockade", () => {
    const p = pruefeKuendigung("2027-03-05", "2027-03-31");
    assert.equal(p.ok, false);
    assert.equal(p.fruehestens, "2027-04-30");
    assert.equal(p.hinweise.length, 1);
    assert.match(p.hinweise[0], /Vier-Wochen-Frist/);
  });

  test("mitten im Monat: Hinweis auf das Monatsende", () => {
    const p = pruefeKuendigung("2027-03-05", "2027-05-15");
    assert.equal(p.ok, false);
    assert.match(p.hinweise[0], /Monatsende/);
  });

  test("Datum in der Vergangenheit wird erkannt", () => {
    const p = pruefeKuendigung("2027-03-05", "2027-01-31");
    assert.equal(p.ok, false);
    assert.equal(p.hinweise.length, 2);   // Frist verfehlt + Vergangenheit
  });
});

describe("Endabrechnung", () => {
  // Vertrag: 10 Termine à 45 €, gekündigt zum 31. März
  const termine = [
    t("2027-03-03"), t("2027-03-10"), t("2027-03-17"), t("2027-03-24"), t("2027-03-31"),
    t("2027-04-07"), t("2027-04-14"), t("2027-04-21"), t("2027-04-28"), t("2027-05-05"),
  ];

  test("nur Termine bis zum Vertragsende zählen", () => {
    const e = endabrechnung({
      termine, absagen: [], zusatzstunden: [], bisDatum: "2027-03-31", gezahltCent: 0,
    });
    assert.equal(e.gehalten.length, 5);
    assert.equal(e.vertragSollCent, 5 * 4500);
    assert.equal(e.sollCent, 22_500);
  });

  test("rechtzeitige Absage fällt raus", () => {
    const absagen: Absage[] = [{ datum: "2027-03-10", art: "gutschrift" }];
    const e = endabrechnung({ termine, absagen, zusatzstunden: [], bisDatum: "2027-03-31", gezahltCent: 0 });
    assert.equal(e.gehalten.length, 4);
    assert.deepEqual(e.entfallen, ["2027-03-10"]);
    assert.equal(e.sollCent, 4 * 4500);
  });

  test("kurzfristige Absage zählt wie gehalten (Vier-Stunden-Regel)", () => {
    const absagen: Absage[] = [{ datum: "2027-03-10", art: "kurzfristig" }];
    const e = endabrechnung({ termine, absagen, zusatzstunden: [], bisDatum: "2027-03-31", gezahltCent: 0 });
    assert.equal(e.gehalten.length, 5);
    assert.deepEqual(e.kurzfristig, ["2027-03-10"]);
    assert.equal(e.sollCent, 5 * 4500);
  });

  test("bei zwei Einträgen am selben Tag gewinnt die Gutschrift", () => {
    const absagen: Absage[] = [
      { datum: "2027-03-10", art: "kurzfristig" },
      { datum: "2027-03-10", art: "gutschrift" },
    ];
    const e = endabrechnung({ termine, absagen, zusatzstunden: [], bisDatum: "2027-03-31", gezahltCent: 0 });
    assert.deepEqual(e.entfallen, ["2027-03-10"]);
    assert.equal(e.gehalten.length, 4);
  });

  test("Absagen nach dem Vertragsende ändern nichts", () => {
    const absagen: Absage[] = [{ datum: "2027-04-07", art: "gutschrift" }];
    const e = endabrechnung({ termine, absagen, zusatzstunden: [], bisDatum: "2027-03-31", gezahltCent: 0 });
    assert.equal(e.gehalten.length, 5);
    assert.deepEqual(e.entfallen, []);
  });

  test("Zusatzstunden kommen oben drauf, aber nur bis zum Vertragsende", () => {
    const e = endabrechnung({
      termine, absagen: [],
      zusatzstunden: [t("2027-03-12"), t("2027-04-02")],
      bisDatum: "2027-03-31", gezahltCent: 0,
    });
    assert.equal(e.zusatz.length, 1);
    assert.equal(e.zusatzSollCent, 4500);
    assert.equal(e.sollCent, 6 * 4500);
  });

  test("zwei Wochentage mit verschiedenen Sätzen", () => {
    const gemischt = [t("2027-03-02", 4500), t("2027-03-04", 4000), t("2027-03-09", 4500)];
    const e = endabrechnung({
      termine: gemischt, absagen: [], zusatzstunden: [], bisDatum: "2027-03-31", gezahltCent: 0,
    });
    assert.equal(e.vertragSollCent, 4500 + 4000 + 4500);
  });
});

describe("Erstattung oder Nachzahlung", () => {
  const termine = [t("2027-03-03"), t("2027-03-10"), t("2027-03-17")];

  test("zu viel gezahlt: Erstattung", () => {
    const e = endabrechnung({ termine, absagen: [], zusatzstunden: [], bisDatum: "2027-03-31", gezahltCent: 20_000 });
    assert.equal(e.sollCent, 13_500);
    assert.equal(e.differenzCent, 6_500);
    assert.equal(e.art, "erstattung");
  });

  test("zu wenig gezahlt: Nachzahlung", () => {
    const e = endabrechnung({ termine, absagen: [], zusatzstunden: [], bisDatum: "2027-03-31", gezahltCent: 9_000 });
    assert.equal(e.differenzCent, -4_500);
    assert.equal(e.art, "nachzahlung");
  });

  test("punktgenau: ausgeglichen", () => {
    const e = endabrechnung({ termine, absagen: [], zusatzstunden: [], bisDatum: "2027-03-31", gezahltCent: 13_500 });
    assert.equal(e.differenzCent, 0);
    assert.equal(e.art, "ausgeglichen");
  });

  test("Einmalzahlung: der Nachlass wird nicht angesetzt und ausgewiesen", () => {
    // Jahresbetrag 3.150 €, einmal gezahlt also 3.100 €; gehalten nur 3 Stunden.
    const e = endabrechnung({
      termine, absagen: [], zusatzstunden: [],
      bisDatum: "2027-03-31", gezahltCent: 310_000, einmalzahlung: true,
    });
    assert.equal(e.nachlassEntfaellt, true);
    assert.equal(e.sollCent, 13_500);
    // Erstattet wird genau das Gezahlte minus die gehaltenen Stunden –
    // der Nachlass von 50 € bleibt dadurch bei Anna.
    assert.equal(e.differenzCent, 310_000 - 13_500);
  });

  test("ohne Einmalzahlung ist der Nachlass kein Thema", () => {
    const e = endabrechnung({ termine, absagen: [], zusatzstunden: [], bisDatum: "2027-03-31", gezahltCent: 0 });
    assert.equal(e.nachlassEntfaellt, false);
  });
});

describe("Text für die E-Mail", () => {
  const bank = { inhaber: "Kleana Carciu", iban: "DE00 1234 5678 9012 3456 78" };
  const opt = { schuelerName: "Lea", schuljahrName: "2026/27", bank };
  const termine = [t("2027-03-03"), t("2027-03-10"), t("2027-03-17")];

  test("Erstattung: Betrag und Bitte um die IBAN", () => {
    const e = endabrechnung({ termine, absagen: [], zusatzstunden: [], bisDatum: "2027-03-31", gezahltCent: 20_000 });
    const s = abrechnungsText(e, opt);
    assert.match(s, /Lea, Schuljahr 2026\/27/);
    assert.match(s, /Der Vertrag endet zum 31\.03\.2027\./);
    assert.match(s, /Stunden bis zum Vertragsende: 3/);
    assert.match(s, /Bereits gezahlt: 200,00 €/);
    assert.match(s, /Du bekommst 65,00 € zurück/);
    assert.match(s, /schick mir bitte kurz deine IBAN/i);
    // Bei einer Erstattung braucht niemand Annas Kontonummer
    assert.equal(s.includes(bank.iban), false);
  });

  test("Nachzahlung: Bankverbindung steht drin", () => {
    const e = endabrechnung({ termine, absagen: [], zusatzstunden: [], bisDatum: "2027-03-31", gezahltCent: 9_000 });
    const s = abrechnungsText(e, opt);
    assert.match(s, /Offen bleiben 45,00 €/);
    assert.match(s, /IBAN: DE00 1234 5678 9012 3456 78/);
    assert.match(s, /Verwendungszweck: Endabrechnung Lea/);
  });

  test("ausgeglichen: keine Zahlungsaufforderung", () => {
    const e = endabrechnung({ termine, absagen: [], zusatzstunden: [], bisDatum: "2027-03-31", gezahltCent: 13_500 });
    const s = abrechnungsText(e, opt);
    assert.match(s, /alles ausgeglichen/);
    assert.equal(/Offen bleiben|zurück/.test(s), false);
  });

  test("abgesagte Stunden werden benannt", () => {
    const absagen: Absage[] = [
      { datum: "2027-03-03", art: "kurzfristig" },
      { datum: "2027-03-10", art: "gutschrift" },
    ];
    const s = abrechnungsText(
      endabrechnung({ termine, absagen, zusatzstunden: [], bisDatum: "2027-03-31", gezahltCent: 0 }), opt);
    assert.match(s, /davon kurzfristig abgesagt und deshalb berechnet: 1/);
    assert.match(s, /Nicht berechnet \(rechtzeitig oder von mir abgesagt\): 1/);
  });

  test("Hinweis auf den entfallenen Nachlass nur bei Einmalzahlung", () => {
    const mit = abrechnungsText(endabrechnung({
      termine, absagen: [], zusatzstunden: [], bisDatum: "2027-03-31",
      gezahltCent: 310_000, einmalzahlung: true,
    }), opt);
    assert.match(mit, /Nachlass von 50 €/);

    const ohne = abrechnungsText(endabrechnung({
      termine, absagen: [], zusatzstunden: [], bisDatum: "2027-03-31", gezahltCent: 310_000,
    }), opt);
    assert.equal(ohne.includes("Nachlass"), false);
  });

  test("Zusatzstunden erscheinen als eigene Zeile", () => {
    const s = abrechnungsText(endabrechnung({
      termine, absagen: [], zusatzstunden: [t("2027-03-05"), t("2027-03-19")],
      bisDatum: "2027-03-31", gezahltCent: 0,
    }), opt);
    assert.match(s, /Zusatzstunden über dem festen Termin: 2 = 90,00 €/);
    assert.match(s, /Summe: 225,00 €/);
  });
});
