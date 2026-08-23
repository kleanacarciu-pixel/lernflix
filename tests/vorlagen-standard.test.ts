// =============================================================================
// Die Vertrags-E-Mails müssen auch ohne SQL funktionieren
//
// Vorher hing der Versand daran, dass jemand eine SQL-Datei ausgeführt hat.
// Wird sie vergessen, bekämen die Eltern gar nichts – und der Vertrag läge
// still herum. Deshalb stehen die Texte jetzt im Programm; die Datenbank darf
// sie überschreiben, muss aber nicht.
// =============================================================================
import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { STANDARD_VORLAGEN, standardVorlage, MIT_LINK } from "../lib/vorlagen-standard.ts";
import { fuelle } from "../lib/mail-text-kern.ts";

describe("Die drei Texte sind vollständig hinterlegt", () => {
  test("Einladung, Erinnerung und Bestätigung", () => {
    assert.deepEqual(STANDARD_VORLAGEN.map((v) => v.schluessel).sort(),
      ["vertragEinladung", "vertragErinnerung", "vertragUnterschrieben"]);
  });

  test("jeder hat Betreff und Text", () => {
    for (const v of STANDARD_VORLAGEN) {
      assert.ok(v.betreff.length > 10, v.schluessel);
      assert.ok(v.text.length > 200, v.schluessel);
      assert.match(v.text, /Liebe Grüße\nAnna$/, `${v.schluessel} endet nicht mit dem Gruß`);
    }
  });

  test("die Nachrichten mit Link enthalten auch einen", () => {
    for (const schluessel of MIT_LINK) {
      const v = standardVorlage(schluessel);
      assert.ok(v, schluessel);
      assert.ok(v.text.includes("{link}"), `${schluessel} ohne {link}`);
    }
  });

  test("in der Bestätigung steht die Bankverbindung", () => {
    const v = standardVorlage("vertragUnterschrieben");
    assert.ok(v, "Die Bestätigung fehlt");
    for (const platzhalter of ["{inhaber}", "{iban}", "{verwendungszweck}"]) {
      assert.ok(v.text.includes(platzhalter), platzhalter);
    }
  });

  test("alle Platzhalter lassen sich füllen – es bleibt keiner stehen", () => {
    const werte = {
      name: "Lea", schuljahr: "2026/27", termin: "Dienstag 16:00 Uhr", anzahl: "38",
      jahresbetrag: "1.710,00 €", raten: "11", rate: "155,45 €", einmal: "1.660,00 €",
      link: "https://beispiel/vertrag/x", tage: "5", zahlweise: "Monatsraten",
      inhaber: "Kleana Carciu", iban: "DE00", verwendungszweck: "Nachhilfe Lea",
    };
    for (const v of STANDARD_VORLAGEN) {
      const fertig = fuelle(v.betreff, werte) + "\n" + fuelle(v.text, werte);
      assert.equal(/\{\w+\}/.test(fertig), false,
        `${v.schluessel}: ${(fertig.match(/\{\w+\}/g) || []).join(", ")} wurde nicht ersetzt`);
    }
  });

  test("unbekannter Schlüssel gibt null", () => {
    assert.equal(standardVorlage("gibtEsNicht"), null);
  });
});

describe("Der Standardtext greift, wenn die Datenbank nichts hat", () => {
  const quelle = readFileSync("lib/zahlung.ts", "utf8");

  test("vorlageSenden fällt auf den Standard zurück", () => {
    const start = quelle.indexOf("export async function vorlageSenden");
    const block = quelle.slice(start, quelle.indexOf("\n}", start));
    assert.match(block, /\?\? standardVorlage\(schluessel\)/);
  });

  test("erst ohne Standard meldet es einen Fehler", () => {
    const start = quelle.indexOf("export async function vorlageSenden");
    const block = quelle.slice(start, quelle.indexOf("\n}", start));
    assert.match(block, /if \(!v\) return \{ ok: false/);
  });

  test("die Liste im Admin-Bereich zeigt fehlende Texte mit an", () => {
    const start = quelle.indexOf("export async function ladeVorlagen");
    const block = quelle.slice(start, quelle.indexOf("\n}", start));
    assert.match(block, /STANDARD_VORLAGEN\.filter/);
  });

  test("beim Ändern wird die Zeile angelegt, nicht nur geändert", () => {
    // Sonst liefe das Speichern eines Standardtextes ins Leere.
    const route = readFileSync("app/api/zahlungen/route.ts", "utf8");
    const start = route.indexOf('case "vorlageSpeichern"');
    const block = route.slice(start, route.indexOf('case "plusstunden"', start));
    assert.match(block, /\.upsert\(/);
    assert.match(block, /onConflict: "schluessel"/);
  });
});

describe("Programm und SQL-Datei sagen dasselbe", () => {
  test("die Schlüssel stehen auch in der SQL-Datei", () => {
    // Die Datei bleibt für frische Datenbanken; sie darf nicht auseinanderlaufen.
    const sql = readFileSync("supabase/schuljahr_v7_vorlagen.sql", "utf8")
      + readFileSync("supabase/schuljahr_v6_unterzeichnung.sql", "utf8");
    for (const v of STANDARD_VORLAGEN) {
      assert.ok(sql.includes(`'${v.schluessel}'`), `${v.schluessel} fehlt in der SQL-Datei`);
    }
  });
});
