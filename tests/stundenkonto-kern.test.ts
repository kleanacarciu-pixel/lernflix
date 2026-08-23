// =============================================================================
// Regressionstests des BESTEHENDEN Stundenkontos (Abschnitt 8)
//
// Diese Regeln gab es vor dem Schuljahresmodell und sie dürfen sich durch
// das Schuljahresmodell NICHT ändern. Die Tests schreiben das Verhalten fest,
// wie es vorher in app/api/kalender/route.ts stand – einschließlich der
// Rückmeldungen an den Schüler, damit auch die Formulierungen gleich bleiben.
// =============================================================================
import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  verrechne, macheRueckgaengig, bewerteAbsage, verrechnungsVorschau,
  MAX_MINUS, ABSAGE_FRIST_STUNDEN,
  type Konto,
} from "../lib/stundenkonto-kern.ts";

const k = (a: Partial<Konto> = {}): Konto =>
  ({ minus_hours: 0, plus_hours: 0, makeup_credits: 0, ...a });

describe("Grenzwerte unverändert", () => {
  test("höchstens drei Minus-Stunden, Frist vier Stunden", () => {
    assert.equal(MAX_MINUS, 3);
    assert.equal(ABSAGE_FRIST_STUNDEN, 4);
  });
});

describe("Verrechnung einer Einzelstunde: Nachhol → Minus → Plus", () => {
  test("Nachhol-Guthaben zuerst", () => {
    const r = verrechne(k({ makeup_credits: 2, minus_hours: 1, plus_hours: 0 }));
    assert.equal(r.counted, "makeup");
    assert.deepEqual(r.aenderung, { makeup_credits: 1 });
  });

  test("ohne Nachhol-Guthaben zählt eine Minus-Stunde", () => {
    const r = verrechne(k({ makeup_credits: 0, minus_hours: 2 }));
    assert.equal(r.counted, "minus");
    assert.deepEqual(r.aenderung, { minus_hours: 1 });
  });

  test("ohne beides wird es eine Plus-Stunde", () => {
    const r = verrechne(k({ plus_hours: 3 }));
    assert.equal(r.counted, "plus");
    assert.deepEqual(r.aenderung, { plus_hours: 4 });
  });

  test("es wird immer nur ein Feld angefasst", () => {
    for (const konto of [k({ makeup_credits: 1 }), k({ minus_hours: 1 }), k()]) {
      assert.equal(Object.keys(verrechne(konto).aenderung).length, 1);
    }
  });

  test("die Vorschau sagt dasselbe wie die Verrechnung", () => {
    assert.match(verrechnungsVorschau(k({ makeup_credits: 1 })), /Nachhol-Guthaben/);
    assert.match(verrechnungsVorschau(k({ minus_hours: 1 })), /Minus-Stunde/);
    assert.match(verrechnungsVorschau(k()), /Extra-Stunde \(Plus\)/);
  });
});

describe("Verrechnung zurückdrehen", () => {
  test("Plus zurück, aber nie unter null", () => {
    assert.deepEqual(macheRueckgaengig(k({ plus_hours: 2 }), "plus"), { plus_hours: 1 });
    assert.deepEqual(macheRueckgaengig(k({ plus_hours: 0 }), "plus"), { plus_hours: 0 });
  });

  test("Minus zurück, aber nie über die Obergrenze", () => {
    assert.deepEqual(macheRueckgaengig(k({ minus_hours: 1 }), "minus"), { minus_hours: 2 });
    assert.deepEqual(macheRueckgaengig(k({ minus_hours: 3 }), "minus"), { minus_hours: 3 });
  });

  test("Nachhol-Guthaben zurück, ohne Obergrenze", () => {
    assert.deepEqual(macheRueckgaengig(k({ makeup_credits: 7 }), "makeup"), { makeup_credits: 8 });
  });

  test("ohne Verrechnung passiert nichts", () => {
    assert.equal(macheRueckgaengig(k(), null), null);
    assert.equal(macheRueckgaengig(k(), "irgendwas"), null);
  });

  test("verrechnen und zurückdrehen ergibt wieder den Ausgangsstand", () => {
    for (const start of [k({ makeup_credits: 2 }), k({ minus_hours: 2 }), k({ plus_hours: 2 })]) {
      const { counted, aenderung } = verrechne(start);
      const zwischen = { ...start, ...aenderung };
      assert.deepEqual({ ...zwischen, ...macheRueckgaengig(zwischen, counted) }, start);
    }
  });
});

describe("Vier-Stunden-Regel bei der Absage", () => {
  test("rechtzeitig abgesagt: Minus-Stunde gutgeschrieben", () => {
    const r = bewerteAbsage(k({ minus_hours: 0 }), 4);
    assert.equal(r.gutschrift, true);
    assert.equal(r.note, null);
    assert.deepEqual(r.aenderung, { minus_hours: 1 });
    assert.match(r.text, /\+1 Minus-Stunde gutgeschrieben/);
  });

  test("genau an der Grenze zählt noch als rechtzeitig", () => {
    assert.equal(bewerteAbsage(k(), 4).gutschrift, true);
    assert.equal(bewerteAbsage(k(), 3.9).gutschrift, false);
  });

  test("zu spät abgesagt: keine Gutschrift, Vermerk „late“", () => {
    const r = bewerteAbsage(k(), 2);
    assert.equal(r.gutschrift, false);
    assert.equal(r.note, "late");
    assert.equal(r.aenderung, null);
    assert.match(r.text, /Weniger als 4 Std\. vorher/);
  });

  test("Termin schon vorbei: ebenfalls keine Gutschrift", () => {
    assert.equal(bewerteAbsage(k(), -1).gutschrift, false);
    assert.equal(bewerteAbsage(k(), -1).note, "late");
  });
});

describe("4er-Sperre: höchstens drei offene Minus-Stunden", () => {
  test("bei zwei offenen Minus-Stunden gibt es noch eine dazu", () => {
    const r = bewerteAbsage(k({ minus_hours: 2 }), 24);
    assert.equal(r.gutschrift, true);
    assert.deepEqual(r.aenderung, { minus_hours: 3 });
  });

  test("die vierte Absage bringt nichts mehr", () => {
    const r = bewerteAbsage(k({ minus_hours: 3 }), 24);
    assert.equal(r.gutschrift, false);
    assert.equal(r.note, "overmax");
    assert.equal(r.aenderung, null);
    assert.match(r.text, /Minus-Konto bereits voll: 3\/3/);
  });

  test("„overmax“ nur bei rechtzeitiger Absage – sonst bleibt es „late“", () => {
    assert.equal(bewerteAbsage(k({ minus_hours: 3 }), 24).note, "overmax");
    assert.equal(bewerteAbsage(k({ minus_hours: 3 }), 1).note, "late");
  });

  test("das Konto läuft nie über drei hinaus", () => {
    let konto = k();
    for (let i = 0; i < 10; i++) {
      const r = bewerteAbsage(konto, 24);
      if (r.aenderung) konto = { ...konto, ...r.aenderung };
    }
    assert.equal(konto.minus_hours, MAX_MINUS);
  });

  test("nach dem Nachholen ist wieder Platz", () => {
    let konto = k({ minus_hours: 3 });
    assert.equal(bewerteAbsage(konto, 24).gutschrift, false);
    // Der Schüler holt eine Stunde nach ...
    konto = { ...konto, ...verrechne(konto).aenderung };
    assert.equal(konto.minus_hours, 2);
    // ... und darf danach wieder rechtzeitig absagen.
    assert.equal(bewerteAbsage(konto, 24).gutschrift, true);
  });
});

describe("Zusammenspiel über mehrere Schritte", () => {
  test("absagen, nachholen, extra buchen", () => {
    let konto = k();

    // Zwei feste Termine rechtzeitig abgesagt -> 2 Minus-Stunden
    for (let i = 0; i < 2; i++) konto = { ...konto, ...bewerteAbsage(konto, 48).aenderung };
    assert.deepEqual(konto, k({ minus_hours: 2 }));

    // Anna sagt einmal ab -> Nachhol-Guthaben (das setzt die Route direkt)
    konto = { ...konto, makeup_credits: konto.makeup_credits + 1 };

    // Erste Zusatzbuchung löst das Nachhol-Guthaben ein
    let r = verrechne(konto); konto = { ...konto, ...r.aenderung };
    assert.equal(r.counted, "makeup");
    assert.deepEqual(konto, k({ minus_hours: 2 }));

    // Die nächsten beiden arbeiten die Minus-Stunden ab
    for (let i = 0; i < 2; i++) { r = verrechne(konto); konto = { ...konto, ...r.aenderung }; }
    assert.deepEqual(konto, k());

    // Erst danach entstehen Plus-Stunden – die werden extra abgerechnet
    r = verrechne(konto); konto = { ...konto, ...r.aenderung };
    assert.equal(r.counted, "plus");
    assert.deepEqual(konto, k({ plus_hours: 1 }));
  });
});
