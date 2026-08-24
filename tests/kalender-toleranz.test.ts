// =============================================================================
// Uhrzeiten-Toleranz: Kommazahl-Stunden dürfen nie am exakten
// Gleitkomma-Vergleich scheitern
//
// Der Fehler, den Kleana gefunden hat: Eine Blockierung Donnerstag
// 09:05–10:35 (Start = 9.0833… Stunden) ließ sich nicht mehr freigeben –
// das Löschen suchte die Zeile mit der EXAKT gleichen Kommazahl, und schon
// eine winzige Abweichung auf dem Weg Datenbank → Anzeige → Klick ließ es
// ins Leere laufen. Gemeldet wurde trotzdem "Slot wieder frei".
//
// Deshalb vergleicht das System Uhrzeiten jetzt überall mit einer halben
// Minute Toleranz (gleicheStunde), findet den gemeinten Block über
// blockTreffer und löscht über die id.
// =============================================================================
import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { gleicheStunde, minutenSchluessel, blockTreffer, tagIntervalle, weekdayOf } from "../lib/kalender.ts";

// Zwei Darstellungen derselben Uhrzeit 09:05, wie sie durch Rundung beim
// Speichern/Lesen wirklich entstehen können (unterschiedliche letzte Stellen)
const NEUN_FUENF_A = 545 / 60;             // 9.083333333333334 (so rechnet der Browser)
const NEUN_FUENF_B = 9.08333333333333;     // gekürzte Darstellung aus einer Datenbank

describe("gleicheStunde: halbe Minute Toleranz", () => {
  test("dieselbe Uhrzeit in zwei Darstellungen zählt als gleich", () => {
    assert.notEqual(NEUN_FUENF_A, NEUN_FUENF_B); // exakt verglichen NICHT gleich …
    assert.ok(gleicheStunde(NEUN_FUENF_A, NEUN_FUENF_B)); // … mit Toleranz schon
    assert.ok(gleicheStunde(17, 17));
  });
  test("echte Nachbar-Minuten bleiben verschieden", () => {
    assert.ok(!gleicheStunde(9 + 5 / 60, 9 + 6 / 60)); // 09:05 vs. 09:06
    assert.ok(!gleicheStunde(9, 9.5));
    assert.ok(!gleicheStunde(17, 17.5));
  });
});

describe("minutenSchluessel: Uhrzeit als ganze Minute", () => {
  test("beide Darstellungen von 09:05 ergeben denselben Schlüssel", () => {
    assert.equal(minutenSchluessel(NEUN_FUENF_A), 545);
    assert.equal(minutenSchluessel(NEUN_FUENF_B), 545);
    assert.equal(minutenSchluessel("9.083333333333334"), 545); // Datenbank liefert je nach Spalte auch Text
    assert.equal(minutenSchluessel(16.5), 990);
  });
  test("Nachbar-Minuten bekommen verschiedene Schlüssel", () => {
    assert.notEqual(minutenSchluessel(9 + 5 / 60), minutenSchluessel(9 + 6 / 60));
  });
});

describe("blockTreffer: welchen Block meint der Klick auf Freigeben?", () => {
  const block = { id: "b1", hour: NEUN_FUENF_B, dauer_min: 90 }; // 09:05–10:35 wie gespeichert

  test("Klick auf den Start trifft – auch bei abweichender letzter Stelle", () => {
    assert.deepEqual(blockTreffer([block], NEUN_FUENF_A), [block]);
  });
  test("Klick mitten in den Zeitraum trifft (überdeckte Rasterzelle)", () => {
    assert.deepEqual(blockTreffer([block], 9.5), [block]);
    assert.deepEqual(blockTreffer([block], 10.5), [block]);
  });
  test("außerhalb des Zeitraums trifft nichts", () => {
    assert.deepEqual(blockTreffer([block], 8.5), []);
    assert.deepEqual(blockTreffer([block], 10 + 35 / 60), []); // 10:35 = Ende, nicht mehr drin
    assert.deepEqual(blockTreffer([block], 11), []);
  });
  test("ohne dauer_min (vor der V6-Migration) gilt eine Stunde", () => {
    const alt = { id: "w1", hour: 9 };
    assert.deepEqual(blockTreffer([alt], 9.5), [alt]);
    assert.deepEqual(blockTreffer([alt], 10.5), []);
  });
  test("bei mehreren Blöcken am Tag wird nur der gemeinte getroffen", () => {
    const anderer = { id: "b2", hour: 14, dauer_min: 60 };
    assert.deepEqual(blockTreffer([block, anderer], 14), [anderer]);
    assert.deepEqual(blockTreffer([block, anderer], NEUN_FUENF_A), [block]);
  });
  test("Uhrzeit als Text aus der Datenbank funktioniert genauso", () => {
    const textig = { id: "b3", hour: "9.08333333333333", dauer_min: 90 };
    assert.deepEqual(blockTreffer([textig], NEUN_FUENF_A), [textig]);
  });
});

describe("tagIntervalle: Absagen greifen auch bei Kommazahl-Uhrzeiten", () => {
  // Fester Donnerstags-Termin um 09:05 – und eine Absage genau dafür,
  // deren Uhrzeit aus der Datenbank mit anderer letzter Stelle zurückkommt.
  const datum = "2026-09-03"; // ein Donnerstag
  const fixe = [{
    student_id: "s1", weekday: weekdayOf(datum), hour: NEUN_FUENF_A, status: "aktiv",
    mode: "online" as string | null, dauer_min: 60, created_at: null,
  }];
  const absage = {
    id: "a1", student_id: "s1", slot_date: datum, hour: NEUN_FUENF_B,
    kind: "absage" as const, status: "abgesagt" as const, mode: null, note: null,
  };

  test("die Absage versteckt den festen Termin trotz abweichender Darstellung", () => {
    const ivs = tagIntervalle(datum, weekdayOf(datum), fixe, [absage], [], () => "Lilly");
    assert.equal(ivs.length, 0, "der abgesagte Termin darf nicht gemalt werden");
  });
  test("ohne Absage wird der Termin normal gemalt", () => {
    const ivs = tagIntervalle(datum, weekdayOf(datum), fixe, [], [], () => "Lilly");
    assert.equal(ivs.length, 1);
  });
  test("die Absage eines ANDEREN Schülers versteckt nichts", () => {
    const fremd = { ...absage, student_id: "s2" };
    const ivs = tagIntervalle(datum, weekdayOf(datum), fixe, [fremd], [], () => "Lilly");
    assert.equal(ivs.length, 1);
  });
});
