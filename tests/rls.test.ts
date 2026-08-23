// =============================================================================
// Regressionstests der Zugriffsrechte (Abschnitt 8)
//
// Die Rechte selbst setzt Postgres durch – ohne Datenbank lässt sich das hier
// nicht ausführen. Prüfbar ist aber die Struktur der Migrationen, und genau
// dort passieren die gefährlichen Fehler: eine neue Tabelle ohne Row Level
// Security steht sonst für jeden angemeldeten Nutzer offen, und ein
// „create or replace" kann versehentlich eine Bedingung verlieren.
// =============================================================================
import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const DATEIEN = [
  "supabase/schuljahr_v1_schema.sql",
  "supabase/schuljahr_v2_vertraege.sql",
  "supabase/schuljahr_v3_zahlungen.sql",
];

const sql = DATEIEN.map((f) => ({ name: f, text: readFileSync(f, "utf8") }));
const alles = sql.map((s) => s.text).join("\n");

/** Alle Tabellen, die die Migrationen anlegen. */
function neueTabellen(text: string): string[] {
  return [...text.matchAll(/create table if not exists public\.(\w+)/g)].map((m) => m[1]);
}

const TABELLEN = sql.flatMap((s) => neueTabellen(s.text));

describe("Jede neue Tabelle ist geschützt", () => {
  test("es wurden überhaupt Tabellen gefunden", () => {
    assert.ok(TABELLEN.length >= 6, `nur ${TABELLEN.length} Tabellen gefunden`);
  });

  for (const t of TABELLEN) {
    test(`${t}: Row Level Security ist eingeschaltet`, () => {
      assert.match(alles, new RegExp(`alter table public\\.${t}\\s+enable row level security`),
        `Für public.${t} fehlt „enable row level security".`);
    });

    test(`${t}: es gibt mindestens eine Richtlinie`, () => {
      assert.match(alles, new RegExp(`create policy \\w+ on public\\.${t}`),
        `Für public.${t} ist keine Policy angelegt – die Tabelle wäre für niemanden lesbar.`);
    });
  }
});

describe("Keine offenen Scheunentore", () => {
  test("keine Richtlinie erlaubt pauschal alles", () => {
    // `using (true)` ohne weitere Bedingung würde die Tabelle freigeben.
    const treffer = [...alles.matchAll(/using\s*\(\s*true\s*\)/g)];
    assert.equal(treffer.length, 0, "Es gibt eine Policy mit `using (true)`.");
  });

  test("keine Migration schaltet Row Level Security wieder ab", () => {
    assert.equal(/disable row level security/i.test(alles), false);
  });

  test("jede Richtlinie prüft entweder die Admin-Rolle oder den eigenen Nutzer", () => {
    // Policy-Blöcke enden am nächsten Semikolon.
    const bloecke = alles.split(/create policy /).slice(1).map((b) => b.split(";")[0]);
    assert.ok(bloecke.length > 0);
    for (const b of bloecke) {
      const name = b.split(/\s/)[0];
      assert.ok(/is_admin\(\)/.test(b) || /auth\.uid\(\)/.test(b),
        `Policy ${name} prüft weder is_admin() noch auth.uid().`);
    }
  });
});

describe("Die Buchungssperre verliert ihre Bedingungen nicht", () => {
  // buchung_erlaubt() wird in Teil 2 angelegt und in Teil 3 per
  // „create or replace" erweitert. Dabei darf die erste Bedingung nicht
  // verloren gehen – sonst könnte ohne AGB-Bestätigung gebucht werden.
  const letzteFassung = sql[2].text
    .split("create or replace function public.buchung_erlaubt")[1] ?? "";

  test("die letzte Fassung existiert", () => {
    assert.ok(letzteFassung.length > 0, "In Teil 3 fehlt buchung_erlaubt().");
  });

  test("die AGB-Bedingung ist noch da", () => {
    assert.match(letzteFassung, /agb_akzeptiert_am is null/);
    assert.match(letzteFassung, /status in \('angeboten','aktiv'\)/);
  });

  test("die Zahlungs-Bedingung ist dazugekommen", () => {
    assert.match(letzteFassung, /public\.zahlungen/);
    assert.match(letzteFassung, /offen_seit is not null/);
    assert.match(letzteFassung, /bezahlt_am is null/);
  });

  test("beide Bedingungen sind mit UND verknüpft, nicht mit ODER", () => {
    const koerper = letzteFassung.split("$$")[1] ?? "";
    assert.match(koerper, /\band not exists\b/);
    assert.equal(/\bor not exists\b/.test(koerper), false);
  });

  test("die Funktion läuft mit festem search_path", () => {
    // security definer ohne festen search_path wäre angreifbar.
    assert.match(letzteFassung, /security definer set search_path = public/);
  });
});

describe("Bestehende Tabellen werden nur ergänzt", () => {
  test("an appointments und profiles wird nichts entfernt oder umgebaut", () => {
    let geprueft = 0;
    for (const s of sql) {
      // Anweisungsweise prüfen – „alter table" steht oft auf einer eigenen Zeile.
      const anweisungen = s.text.split(";")
        .map((a) => a.replace(/--[^\n]*/g, "").trim())
        .filter((a) => /^alter table public\.(appointments|profiles)\b/.test(a));
      for (const a of anweisungen) {
        geprueft++;
        assert.match(a.replace(/\s+/g, " "), /add column if not exists/,
          `${s.name}: „${a.replace(/\s+/g, " ")}" verändert eine bestehende Tabelle anders als durch Hinzufügen.`);
      }
    }
    // Sicherstellen, dass der Test nicht ins Leere greift: Teil 3 hängt
    // abrechnung_id an appointments – mindestens diese eine muss auftauchen.
    assert.ok(geprueft > 0, "Keine Änderung an appointments/profiles gefunden – prüft der Test noch das Richtige?");
  });

  test("keine bestehende Tabelle wird gelöscht", () => {
    assert.equal(/drop table/i.test(alles), false);
  });

  test("neue Spalten an bestehenden Tabellen sind optional", () => {
    // Eine Pflichtspalte ohne Vorgabewert würde vorhandene Zeilen sprengen.
    const zeilen = [...alles.matchAll(/add column if not exists ([^;]+);/g)].map((m) => m[1]);
    for (const z of zeilen) {
      if (/not null/i.test(z)) {
        assert.match(z, /default/i, `Spalte „${z.trim()}" ist NOT NULL ohne Standardwert.`);
      }
    }
  });
});
