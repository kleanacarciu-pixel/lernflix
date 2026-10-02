// =============================================================================
// „Weniger Raten" (Okt. 2026): Eine Familie unterschreibt erst im Oktober
// und zahlt 10 Raten ab Oktober statt 11 ab September – derselbe
// Jahresbetrag, nur anders verteilt. Die Wahl liegt je Vertrag im
// Schlüssel/Wert-Speicher (keine neue Datenbank-Spalte).
//
// Die Rechenregel selbst steckt in ratenMonate/berechneRaten (eigene Tests);
// hier wird per Quelltext-Blick festgehalten, dass die Option überall
// ankommt, wo der Ratenplan entsteht – und nie einen LEEREN Plan erzeugt.
// =============================================================================
import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { ratenplan, euroZuCent } from "../lib/vertrag-kern.ts";

describe("Weniger Raten: die Verteilung stimmt", () => {
  test("900 € ab Oktober bis Juli = 10 Raten à 90 €", () => {
    const plan = ratenplan({ jahresbetragCent: euroZuCent(900), vertragsbeginn: "2026-10-01", letzterSchultag: "2027-07-30" });
    assert.equal(plan.length, 10);
    assert.equal(plan[0].monat, "2026-10-01");
    for (const r of plan) assert.equal(r.betragCent, euroZuCent(90));
  });
});

describe("Die Option kommt überall an", () => {
  const vertrag = readFileSync("lib/vertrag.ts", "utf8");

  test("rechneVertrag beachtet den gewählten ersten Ratenmonat", () => {
    assert.match(vertrag, /ratenAbFuer\(opt\.vertragId\)/);
    // Ein Start NACH dem letzten Ratenmonat darf nie zu einem leeren Plan
    // führen – sonst zahlte niemand mehr eine einzige Rate.
    assert.match(vertrag, /if \(!raten\.length\) \{/);
  });

  test("Zahlungsplan und Endabrechnung rechnen mit demselben Vertrag", () => {
    assert.match(readFileSync("lib/zahlung.ts", "utf8"), /vertragId,/);
    assert.match(readFileSync("lib/kuendigung.ts", "utf8"), /vertragId,/);
  });

  test("auch die Restraten nach einer Vertragsänderung beachten die Wahl", () => {
    const route = readFileSync("app/api/vertrag/route.ts", "utf8");
    assert.match(route, /const ratenAb = await ratenAbFuer\(v\.vertrag\.id\);/);
    assert.match(route, /if \(!monate\.length\) monate = ratenMonate\(v\.vertrag\.vertragsbeginn, planEnde\);/);
  });

  test("der gewählte Monat wird gegen die echten Ratenmonate geprüft", () => {
    const route = readFileSync("app/api/vertrag/route.ts", "utf8");
    // Das Jahr ergibt sich aus dem Plan selbst – kein Rätselraten, ob
    // „Februar" ins alte oder neue Kalenderjahr gehört.
    assert.match(route, /moeglich\.find\(\(m\) => Number\(m\.slice\(5, 7\)\) === monatNr\)/);
    assert.match(route, /August ist nie ein Ratenmonat/);
  });
});
