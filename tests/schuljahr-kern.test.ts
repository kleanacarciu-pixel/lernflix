// =============================================================================
// Tests der Termin-Engine (Abschnitt 2 des Schuljahresmodells)
// Ausführen:  npm test
// =============================================================================
import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  termineImZeitraum, relevanteFreieTage, wochentagVon, plusTage, istFrei, datumDe,
  type FreierZeitraum,
} from "../lib/schuljahr-kern.ts";

// Stammdaten Schuljahr 2026/27 – identisch zu supabase/schuljahr_v1_schema.sql
const ERSTER = "2026-09-15";
const LETZTER = "2027-07-30";

const f = (bez: string, von: string, bis: string, feiertag = false, schule: string | null = null): FreierZeitraum =>
  ({ bezeichnung: bez, datum_von: von, datum_bis: bis, ist_feiertag: feiertag, schule_id: schule });

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

const termine = (wochentag: number, frei = BAYERN, abDatum?: string) =>
  termineImZeitraum({ erster: ERSTER, letzter: LETZTER, wochentag, frei, abDatum });

describe("Datums-Helfer", () => {
  test("Wochentag: 0=Mo .. 6=So", () => {
    assert.equal(wochentagVon("2026-09-14"), 0); // Montag
    assert.equal(wochentagVon("2026-09-15"), 1); // Dienstag
    assert.equal(wochentagVon("2026-09-20"), 6); // Sonntag
  });

  test("plusTage rechnet über Monats- und Jahresgrenzen", () => {
    assert.equal(plusTage("2026-12-31", 1), "2027-01-01");
    assert.equal(plusTage("2027-03-01", -1), "2027-02-28");
    assert.equal(plusTage("2026-09-15", 7), "2026-09-22");
  });

  test("plusTage bleibt über die Sommerzeit-Umstellung korrekt", () => {
    // In Deutschland wird am 28.03.2027 auf Sommerzeit umgestellt.
    assert.equal(plusTage("2027-03-25", 7), "2027-04-01");
  });

  test("istFrei schließt beide Grenzen ein", () => {
    const z = [f("Ferien", "2026-11-02", "2026-11-06")];
    assert.equal(istFrei("2026-11-01", z), false);
    assert.equal(istFrei("2026-11-02", z), true);
    assert.equal(istFrei("2026-11-06", z), true);
    assert.equal(istFrei("2026-11-07", z), false);
  });

  test("datumDe formatiert deutsch", () => {
    assert.equal(datumDe("2026-09-15"), "15.09.2026");
  });
});

describe("Termin-Engine: Sollwerte 2026/27", () => {
  // Die im Auftrag festgeschriebenen Erwartungswerte
  const SOLL: Record<string, [number, number]> = {
    Montag: [0, 37], Dienstag: [1, 38], Mittwoch: [2, 37], Donnerstag: [3, 36], Freitag: [4, 37],
    // Samstag: die beiden gesetzlichen Feiertage am 03.10.2026 und 01.05.2027
    // fallen auf einen Samstag und ziehen von 41 auf 39 ab.
    Samstag: [5, 39],
  };
  for (const [name, [wd, anzahl]] of Object.entries(SOLL)) {
    test(`${name}: ${anzahl} Termine`, () => {
      assert.equal(termine(wd).length, anzahl);
    });
  }
});

describe("Termin-Engine: Grundverhalten", () => {
  test("liefert nur den gewünschten Wochentag", () => {
    for (const d of termine(2)) assert.equal(wochentagVon(d), 2);
  });

  test("Termine liegen im Schuljahr und sind aufsteigend", () => {
    const t = termine(1);
    assert.ok(t[0] >= ERSTER);
    assert.ok(t[t.length - 1] <= LETZTER);
    assert.deepEqual(t, [...t].sort());
  });

  test("kein Termin fällt in eine Ferienzeit", () => {
    for (let wd = 0; wd < 5; wd++) {
      for (const d of termine(wd)) assert.equal(istFrei(d, BAYERN), false, `${d} liegt in den Ferien`);
    }
  });

  test("erster Dienstag ist der erste Schultag selbst", () => {
    assert.equal(termine(1)[0], "2026-09-15");
  });

  test("Weihnachtsferien sind ausgespart", () => {
    const mi = termine(2);
    assert.ok(!mi.includes("2026-12-30"), "30.12. liegt in den Weihnachtsferien");
    assert.ok(mi.includes("2026-12-23"), "23.12. ist noch Unterricht");
    assert.ok(mi.includes("2027-01-13"), "13.01. ist wieder Unterricht");
  });

  test("Wochenenden funktionieren ebenfalls", () => {
    assert.ok(termine(5).length > 0); // Samstag
    for (const d of termine(6)) assert.equal(wochentagVon(d), 6);
  });

  test("ungültiger Wochentag liefert leere Liste", () => {
    assert.deepEqual(termine(7), []);
    assert.deepEqual(termine(-1), []);
  });
});

describe("Termin-Engine: Quereinstieg (abDatum)", () => {
  test("Quereinstieg 1. März, Mittwoch: 18 Termine", () => {
    // Sollwert aus Abschnitt 8 (Preislogik-Test)
    assert.equal(termine(2, BAYERN, "2027-03-01").length, 18);
  });

  test("abDatum vor Schuljahresbeginn ändert nichts", () => {
    assert.equal(termine(1, BAYERN, "2026-01-01").length, termine(1).length);
  });

  test("abDatum nach Schuljahresende liefert nichts", () => {
    assert.deepEqual(termine(1, BAYERN, "2027-08-01"), []);
  });

  test("abDatum genau auf einem Termin schließt diesen ein", () => {
    const t = termine(1, BAYERN, "2026-09-15");
    assert.equal(t[0], "2026-09-15");
  });
});

describe("Termin-Engine: Schulen mit eigenen Ferien", () => {
  const SCHULE = "schule-1";
  // Diese Schule hat im Herbst später frei und kennt keine Weihnachtsferien,
  // dafür gelten die gesetzlichen Feiertage aus dem bayerischen Kalender.
  const GEMISCHT: FreierZeitraum[] = [
    ...BAYERN,
    f("Herbstferien (intern.)", "2026-11-09", "2026-11-13", false, SCHULE),
  ];

  test("ohne Schule gilt der bayerische Kalender", () => {
    const frei = relevanteFreieTage(GEMISCHT, null);
    assert.equal(frei.length, BAYERN.length);
    assert.ok(frei.every((x) => x.schule_id === null));
  });

  test("mit Schule ersetzen deren Ferien die bayerischen Schulferien", () => {
    const frei = relevanteFreieTage(GEMISCHT, SCHULE);
    const bez = frei.map((x) => x.bezeichnung);
    assert.ok(bez.includes("Herbstferien (intern.)"), "eigene Ferien gelten");
    assert.ok(!bez.includes("Herbstferien"), "bayerische Herbstferien gelten nicht mehr");
    assert.ok(!bez.includes("Weihnachtsferien"), "bayerische Weihnachtsferien gelten nicht mehr");
  });

  test("gesetzliche Feiertage gelten immer zusätzlich", () => {
    const frei = relevanteFreieTage(GEMISCHT, SCHULE);
    const bez = frei.map((x) => x.bezeichnung);
    assert.ok(bez.includes("Christi Himmelfahrt"));
    assert.ok(bez.includes("Pfingstmontag"));
    // Christi Himmelfahrt 2027 ist ein Donnerstag -> darf kein Termin sein
    const do_ = termineImZeitraum({ erster: ERSTER, letzter: LETZTER, wochentag: 3, frei });
    assert.ok(!do_.includes("2027-05-06"));
  });

  test("eigene Ferien wirken sich auf die Terminzahl aus", () => {
    const frei = relevanteFreieTage(GEMISCHT, SCHULE);
    const mo = termineImZeitraum({ erster: ERSTER, letzter: LETZTER, wochentag: 0, frei });
    // Ohne die bayerischen Ferien hat diese Schule mehr Unterrichtstage
    assert.ok(mo.length > termine(0).length, "Schule mit weniger Ferien hat mehr Termine");
    assert.ok(!mo.includes("2026-11-09"), "eigene Herbstferien sind ausgespart");
    assert.ok(mo.includes("2026-11-02"), "bayerische Herbstferien gelten hier nicht");
  });

  test("unbekannte Schule: nur Feiertage bleiben übrig", () => {
    const frei = relevanteFreieTage(GEMISCHT, "gibt-es-nicht");
    assert.ok(frei.every((x) => x.ist_feiertag));
  });
});

describe("Gesetzliche Feiertage am Samstag", () => {
  const samstage = (frei: FreierZeitraum[]) => termine(5, frei).length;
  const ohne = BAYERN.filter((x) =>
    x.bezeichnung !== "Tag der Deutschen Einheit" && x.bezeichnung !== "Tag der Arbeit");

  test("beide Daten sind wirklich Samstage", () => {
    assert.equal(wochentagVon("2026-10-03"), 5);
    assert.equal(wochentagVon("2027-05-01"), 5);
  });

  test("sie ziehen genau zwei Samstage ab: 41 -> 39", () => {
    assert.equal(samstage(ohne), 41);
    assert.equal(samstage(BAYERN), 39);
  });

  test("die beiden Tage kommen nicht mehr als Termin vor", () => {
    const t = termine(5);
    assert.equal(t.includes("2026-10-03"), false);
    assert.equal(t.includes("2027-05-01"), false);
  });

  test("Montag bis Freitag bleiben davon unberührt", () => {
    for (const [wd, soll] of [[0, 37], [1, 38], [2, 37], [3, 36], [4, 37]] as const) {
      assert.equal(termine(wd, ohne).length, soll, `Wochentag ${wd} ohne die Feiertage`);
      assert.equal(termine(wd).length, soll, `Wochentag ${wd} mit den Feiertagen`);
    }
  });

  test("als Feiertag markiert – gilt also auch für Schulen mit eigenen Ferien", () => {
    const eigene = relevanteFreieTage(BAYERN, "schule-1");
    assert.ok(eigene.some((x) => x.bezeichnung === "Tag der Deutschen Einheit"));
    assert.ok(eigene.some((x) => x.bezeichnung === "Tag der Arbeit"));
    // Reine Schulferien Bayerns gelten für diese Schule dagegen nicht.
    assert.equal(eigene.some((x) => x.bezeichnung === "Herbstferien"), false);
  });
});
