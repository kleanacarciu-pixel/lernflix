// =============================================================================
// Erinnerung nach fünf Tagen – Regeln, Text und Versandweg
//
// Die Erinnerung ist die einzige Nachricht, die ohne Zutun rausgeht. Sie
// enthält den Unterschriftslink; deshalb wird hier auch festgehalten, dass
// sie NICHT in Kopie an Kleana geht und dass sie nur einmal kommt.
// =============================================================================
import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  erinnerungFaellig, tageSeit, ERINNERUNG_NACH_TAGEN,
} from "../lib/unterzeichnung-kern.ts";
import { fuelle, alsHtml } from "../lib/mail-text-kern.ts";

const eingeladen = (am: string) => ({ status: "angeboten", eingeladen_am: am });

describe("Wann ist eine Erinnerung fällig?", () => {
  test("nach genau fünf Tagen", () => {
    assert.equal(ERINNERUNG_NACH_TAGEN, 5);
    assert.equal(erinnerungFaellig(eingeladen("2026-08-18T09:00:00Z"), "2026-08-23"), true);
  });

  test("vorher nicht", () => {
    for (const heute of ["2026-08-18", "2026-08-20", "2026-08-22"]) {
      assert.equal(erinnerungFaellig(eingeladen("2026-08-18T09:00:00Z"), heute), false, heute);
    }
  });

  test("später auch noch – eine vergessene Erinnerung soll nachkommen", () => {
    assert.equal(erinnerungFaellig(eingeladen("2026-08-01T09:00:00Z"), "2026-08-23"), true);
  });

  test("wer nie eingeladen wurde, bekommt keine Erinnerung", () => {
    assert.equal(erinnerungFaellig({ status: "angeboten" }, "2026-08-23"), false);
  });

  test("wer unterschrieben hat, bekommt keine", () => {
    assert.equal(erinnerungFaellig({
      ...eingeladen("2026-08-01T09:00:00Z"), unterzeichnet_am: "2026-08-02T10:00:00Z",
    }, "2026-08-23"), false);
    assert.equal(erinnerungFaellig({
      ...eingeladen("2026-08-01T09:00:00Z"), manuell_aktiviert_am: "2026-08-02T10:00:00Z",
    }, "2026-08-23"), false);
  });

  test("es bleibt bei EINER Erinnerung", () => {
    assert.equal(erinnerungFaellig({
      ...eingeladen("2026-08-01T09:00:00Z"), erinnert_am: "2026-08-06T06:07:00Z",
    }, "2026-08-23"), false);
  });

  test("beendete und gekündigte Verträge werden nicht erinnert", () => {
    for (const status of ["beendet", "gekuendigt"]) {
      assert.equal(erinnerungFaellig({ ...eingeladen("2026-08-01T09:00:00Z"), status }, "2026-08-23"), false, status);
    }
  });
});

describe("Tage werden gezählt wie im Kalender", () => {
  test("die Uhrzeit spielt keine Rolle", () => {
    // Eine Einladung um 23:50 Uhr ist am nächsten Tag einen Tag alt.
    assert.equal(tageSeit("2026-08-17T23:50:00Z", "2026-08-18"), 1);
    assert.equal(tageSeit("2026-08-17T00:10:00Z", "2026-08-18"), 1);
  });

  test("vom 17. bis zum 23. sind es sechs Tage", () => {
    assert.equal(tageSeit("2026-08-17T09:30:00Z", "2026-08-23"), 6);
  });

  test("Unfug ergibt null statt einer falschen Zahl", () => {
    assert.equal(tageSeit(null, "2026-08-23"), null);
    assert.equal(tageSeit("2026-08-17T09:30:00Z", ""), null);
    assert.equal(tageSeit("kein Datum", "2026-08-23"), null);
  });
});

describe("Der Text der Vorlagen", () => {
  test("Platzhalter werden ersetzt", () => {
    assert.equal(fuelle("Hallo {name}, {tage} Tage", { name: "Lea", tage: "5" }), "Hallo Lea, 5 Tage");
  });

  test("ein unbekannter Platzhalter bleibt sichtbar stehen", () => {
    // Sichtbar peinlich ist besser als unsichtbar falsch.
    assert.equal(fuelle("Hallo {vorname}", { name: "Lea" }), "Hallo {vorname}");
  });

  test("der Link wird anklickbar", () => {
    const html = alsHtml("Hier entlang:\nhttps://lernflix.lernemitanna.de/vertrag/abc.123.def");
    assert.match(html, /<a href="https:\/\/lernflix\.lernemitanna\.de\/vertrag\/abc\.123\.def"/);
  });

  test("spitze Klammern im Text werden entschärft", () => {
    const html = alsHtml("<script>alert(1)</script>");
    assert.equal(html.includes("<script>"), false);
    assert.match(html, /&lt;script&gt;/);
  });

  test("Absätze und Zeilenumbrüche bleiben erhalten", () => {
    const html = alsHtml("Hallo,\n\nzwei Zeilen:\nfertig");
    assert.equal((html.match(/<p>/g) || []).length, 2);
    assert.match(html, /zwei Zeilen:<br>fertig/);
  });
});

describe("Der Erinnerungslauf", () => {
  const quelle = readFileSync("lib/unterzeichnung.ts", "utf8");

  test("verschickt ohne Kopie an Kleana – die Nachricht enthält den Link", () => {
    assert.match(quelle, /vorlageSenden\("vertragErinnerung"/);
    assert.match(quelle, /kopieAnAdmin: false/);
  });

  test("merkt sich den Versand, damit es bei einer Erinnerung bleibt", () => {
    assert.match(quelle, /erinnert_am: new Date\(\)\.toISOString\(\)/);
  });

  test("vermerkt wird erst NACH erfolgreichem Versand", () => {
    const versand = quelle.indexOf("vorlageSenden(");
    const vermerk = quelle.indexOf("erinnert_am: new Date()");
    const abbruch = quelle.indexOf("if (!r.ok)");
    assert.ok(versand < abbruch && abbruch < vermerk,
      "Ein fehlgeschlagener Versand darf nicht als erledigt vermerkt werden");
  });

  test("ein Probelauf verschickt nichts und speichert nichts", () => {
    assert.match(quelle, /if \(opt\.probelauf\) \{ ergebnis\.verschickt\+\+; continue; \}/);
  });

  test("fehlende E-Mail-Adressen fallen auf, statt still zu verschwinden", () => {
    assert.match(quelle, /probleme\.push\(\{ name, grund: "keine E-Mail-Adresse hinterlegt" \}\)/);
  });

  test("Kleana wird benachrichtigt, wenn eine Erinnerung nicht rausging", () => {
    const cron = readFileSync("app/api/cron/mahnlauf/route.ts", "utf8");
    assert.match(cron, /unterschriften\.probleme\.length/);
    assert.match(cron, /Erinnerung an offene Verträge nicht möglich/);
  });

  test("ein Text ohne {link} lässt sich gar nicht erst speichern", () => {
    // Sonst bekämen die Eltern eine freundliche Nachricht ohne Weg zum
    // Vertrag – und niemandem fiele es auf.
    const q = readFileSync("app/api/zahlungen/route.ts", "utf8");
    const start = q.indexOf('case "vorlageSpeichern"');
    const block = q.slice(start, q.indexOf("case \"plusstunden\"", start));
    assert.match(block, /vertragEinladung", "vertragErinnerung"\]\.includes\(schluessel\) && !inhalt\.includes\("\{link\}"\)/);
    assert.match(block, /return bad\(/);
  });

  test("der Lauf hängt am täglichen Job – kein zweiter Zeitplan nötig", () => {
    const cron = readFileSync("app/api/cron/mahnlauf/route.ts", "utf8");
    assert.match(cron, /erinnerungslauf\(/);
    const plan = JSON.parse(readFileSync("vercel.json", "utf8")) as { crons: { path: string }[] };
    assert.ok(plan.crons.some((c) => c.path === "/api/cron/mahnlauf"), "Der tägliche Job fehlt im Zeitplan");
  });
});
