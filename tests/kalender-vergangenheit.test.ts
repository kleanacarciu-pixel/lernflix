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

describe("Es war nur die Anzeige – gespeichert wird nichts Vergangenes", () => {
  test("syncLessons legt grundsätzlich nichts Vergangenes an", () => {
    // Die Wache steht im Code: Kandidaten mit Start in der Vergangenheit
    // werden vor dem Anlegen verworfen. Fällt sie weg, entstehen beim
    // nächsten Lauf rückwirkende Klassenzimmer-Stunden.
    const q = readFileSync("lib/stunden.ts", "utf8");
    assert.match(q, /if \(start < Date\.now\(\) - 60 \* 60000\) return; \/\/ Vergangenes nicht mehr anlegen/);
  });

  test("beide Slot-Abfragen der Anzeige laden created_at mit", () => {
    // Ohne die Spalte griffe die Grenze still nicht mehr (alles optional).
    const q = readFileSync("lib/kalender.ts", "utf8");
    const treffer = [...q.matchAll(/from\("fixed_slots"\)\.select\("([^"]+)"\)/g)].map((m) => m[1]);
    const mitIntervallen = treffer.filter((t) => t.includes("status,mode,dauer_min"));
    assert.ok(mitIntervallen.length >= 2, "Wochenansicht und Kollisionsprüfung erwartet");
    for (const t of mitIntervallen) {
      assert.ok(t.includes("created_at"), `created_at fehlt in select("${t}")`);
    }
  });
});
