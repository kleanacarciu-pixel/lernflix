// =============================================================================
// Feste Wochentermine dürfen nicht in die Vergangenheit gemalt werden
//
// Der Fehler, den Kleana gefunden hat: Ein Elternteil bucht JETZT einen
// festen Wochentermin – und beim Zurückblättern zeigte der Kalender den
// Termin auch in längst vergangenen Wochen (Juli/August), als hätte dort
// Unterricht stattgefunden. Die Wochenansicht malte jeden aktiven Slot in
// jede Woche mit passendem Wochentag, ohne untere Grenze.
//
// Wichtig: Das war REIN die Anzeige. Gespeichert wurde nichts –
// Klassenzimmer-Stunden entstehen nur ab heute (syncLessons überspringt
// Vergangenes ausdrücklich), und appointments entstehen nur durch echte
// Buchungen und Absagen. Ein eigener Test unten hält das fest.
// =============================================================================
import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { tagIntervalle, berlinDatum, weekdayOf } from "../lib/kalender.ts";

// Ein fester Dienstags-Termin, gebucht am 20.08.2026
const slot = (created_at: string | null) => [{
  student_id: "s1", weekday: 1, hour: 16, status: "aktiv",
  mode: "online" as string | null, dauer_min: 60, created_at,
}];
const male = (datum: string, fixe: ReturnType<typeof slot>) =>
  tagIntervalle(datum, weekdayOf(datum), fixe, [], [], () => "Lea");

describe("Untere Grenze: der Tag der Buchung", () => {
  const gebucht = slot("2026-08-20T18:00:00Z");

  test("Wochen VOR der Buchung bleiben leer", () => {
    for (const dienstag of ["2026-07-14", "2026-07-21", "2026-08-18"]) {
      assert.equal(male(dienstag, gebucht).length, 0, `am ${dienstag} gemalt`);
    }
  });

  test("ab der Buchung wird der Termin gezeigt", () => {
    for (const dienstag of ["2026-08-25", "2026-09-15", "2027-06-01"]) {
      const ivs = male(dienstag, gebucht);
      assert.equal(ivs.length, 1, `am ${dienstag} fehlt der Termin`);
      assert.equal(ivs[0].sid, "s1");
    }
  });

  test("der Buchungstag selbst zählt schon dazu", () => {
    // 25.08.2026 ist ein Dienstag; Buchung am selben Tag um 10 Uhr.
    assert.equal(male("2026-08-25", slot("2026-08-25T08:00:00Z")).length, 1);
  });

  test("die Grenze rechnet in Berliner Zeit, nicht in UTC", () => {
    // 22:30 UTC am 17.08. ist in Berlin schon der 18.08., 00:30 Uhr.
    assert.equal(berlinDatum("2026-08-17T22:30:00Z"), "2026-08-18");
    const nachts = slot("2026-08-17T22:30:00Z");
    assert.equal(male("2026-08-18", nachts).length, 1, "Buchungstag (Berlin) muss zählen");
    assert.equal(male("2026-08-11", nachts).length, 0);
  });

  test("Zeilen ohne created_at verhalten sich wie bisher", () => {
    // Rückwärts-Verträglichkeit: fehlt die Spalte, wird nichts versteckt.
    assert.equal(male("2026-07-14", slot(null)).length, 1);
  });
});

describe("Startdatum (ab_datum): der beim Buchen angeklickte Tag", () => {
  // Lillys Fall: am 24.08. gebucht, angeklickt war "Donnerstag 03.09., 17 Uhr".
  const lilly = [{
    student_id: "s2", weekday: 3, hour: 17, status: "aktiv",
    mode: "vor_ort" as string | null, dauer_min: 60,
    created_at: "2026-08-24T10:00:00Z", ab_datum: "2026-09-03",
  }];
  const maleL = (datum: string) => tagIntervalle(datum, weekdayOf(datum), lilly, [], [], () => "Lilly");

  test("vor dem angeklickten Tag erscheint der Termin nicht", () => {
    // 27.08. liegt NACH der Buchung, aber VOR dem gewünschten Beginn.
    assert.equal(maleL("2026-08-27").length, 0, "27.08. dürfte Lilly nicht zeigen");
  });

  test("ab dem angeklickten Tag erscheint er", () => {
    for (const donnerstag of ["2026-09-03", "2026-09-10", "2027-05-27"]) {
      assert.equal(maleL(donnerstag).length, 1, donnerstag);
    }
  });

  test("ab_datum gilt zusätzlich zur Buchungsgrenze, nicht statt ihr", () => {
    // Auch mit ab_datum darf nichts VOR der Buchung erscheinen.
    assert.equal(maleL("2026-08-20").length, 0);
  });

  test("ohne ab_datum gilt weiter der Buchungstag (alter Stand)", () => {
    const alt = [{ ...lilly[0], ab_datum: null as string | null }];
    assert.equal(tagIntervalle("2026-08-27", 3, alt, [], [], () => "Lilly").length, 1);
  });
});

describe("Es war nur die Anzeige – gespeichert wird nichts Vergangenes", () => {
  test("syncLessons legt grundsätzlich nichts Vergangenes an", () => {
    // Die Wache steht im Code: Kandidaten mit Start in der Vergangenheit
    // werden vor dem Anlegen verworfen. Fällt sie weg, entstehen beim
    // nächsten Lauf rückwirkende Klassenzimmer-Stunden.
    const q = readFileSync("lib/stunden.ts", "utf8");
    assert.match(q, /if \(start < Date\.now\(\) - 60 \* 60000\) return; \/\/ Vergangenes nicht mehr anlegen/);
  });

  test("die Slot-Abfragen laden ALLE Spalten – die Grenzen können nie still wegfallen", () => {
    // created_at und ab_datum sind in tagIntervalle optional. Lüde eine
    // Abfrage sie nicht mit, griffen beide Grenzen still nicht mehr.
    // select("*") macht das unmöglich (und übersteht fehlende Migrationen).
    const kal = readFileSync("lib/kalender.ts", "utf8");
    assert.ok([...kal.matchAll(/from\("fixed_slots"\)\.select\("\*"\)/g)].length >= 2,
      "Wochenansicht und Kollisionsprüfung müssen select(\"*\") nutzen");
    const stn = readFileSync("lib/stunden.ts", "utf8");
    assert.ok(/from\("fixed_slots"\)\.select\("\*"\)/.test(stn),
      "auch die Stunden-Synchronisation muss select(\"*\") nutzen");
  });

  test("die Stunden-Synchronisation beachtet ab_datum in beide Richtungen", () => {
    const q = readFileSync("lib/stunden.ts", "utf8");
    // Nichts anlegen vor dem Geltungstag …
    assert.match(q, /if \(f\.ab_datum && date < f\.ab_datum\) return;/);
    // … und frueher erzeugte kuenftige Stunden vor dem Geltungstag abraeumen.
    assert.match(q, /if \(date >= f\.ab_datum \|\| weekdayOf\(date\) !== f\.weekday\) continue;/);
  });

  test("beide Buchungswege speichern den angeklickten Tag als ab_datum", () => {
    const route = readFileSync("app/api/kalender/route.ts", "utf8");
    assert.equal([...route.matchAll(/ab_datum: date/g)].length, 2,
      "requestFixed und adminBook(fest) müssen ab_datum mitschreiben");
  });
});
