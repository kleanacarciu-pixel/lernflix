// =============================================================================
// Der feste Wortlaut der Vertrags-PDF (Schritt 2)
//
// Diese Sätze stehen so im Vertrag und wurden wortgleich aus dem Auftrag
// übernommen. Ändert jemand hier ein Wort, ändert sich ein Vertragstext –
// deshalb hält dieser Test den Wortlaut fest.
// =============================================================================
import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  TITEL, ANBIETERIN, FUSSZEILE, unterzeile, HINWEIS_FERIEN, zahlungshinweis,
  WICHTIGSTES, BESTAETIGUNG_AGB, BESTAETIGUNG_WIDERRUF, FARBEN,
} from "../lib/vertrag-pdf-texte.ts";

describe("Kopf und Parteien", () => {
  test("Titel und Unterzeile", () => {
    assert.equal(TITEL, "Nachhilfevertrag");
    assert.equal(unterzeile("2026/27"),
      "LERNE MIT ANNA · MATHE UND PHYSIK · SCHULJAHR 2026/27");
  });

  test("Anbieterin mit vollständiger Anschrift", () => {
    assert.equal(ANBIETERIN.zeile,
      "Kleana Carciu · Lerne mit Anna · Kohlbrennerstraße 16 · 81929 München");
    assert.match(ANBIETERIN.rolle, /Anbieterin/);
  });

  test("Fußzeile mit Telefon, E-Mail und Adresse", () => {
    assert.equal(FUSSZEILE,
      "Lerne mit Anna · Tel: +49 (0)176 24700519 · lernemitanna@outlook.com · lernemitanna.de");
  });
});

describe("Hinweise", () => {
  test("Ferien und Feiertage sind unterrichtsfrei", () => {
    assert.match(HINWEIS_FERIEN, /unterrichtsfrei/);
    assert.match(HINWEIS_FERIEN, /Terminanzahl und Betrag nicht enthalten/);
  });

  test("Verwendungszweck nennt Vorname und Schuljahr", () => {
    const h = zahlungshinweis("Lea", "2026/27");
    assert.match(h, /Überweisung/);
    assert.match(h, /„Nachhilfe Lea 2026\/27“/);
    assert.match(h, /August ist beitragsfrei/);
  });
});

describe("„Das Wichtigste auf einen Blick“ – wortgleich", () => {
  const punkt = (t: string) => WICHTIGSTES.find((p) => p.titel === t);

  test("alle fünf Punkte in der richtigen Reihenfolge", () => {
    assert.deepEqual(WICHTIGSTES.map((p) => p.titel), [
      "Laufzeit & Kündigung", "Absagen", "Plusstunden", "Vorzeitiges Ende", "Grundlagen",
    ]);
  });

  test("Laufzeit: bis 31. Juli 2027, vier Wochen zum Monatsende, Textform", () => {
    const p = punkt("Laufzeit & Kündigung")!;
    assert.match(p.text, /bis 31\. Juli 2027/);
    assert.match(p.text, /Frist von 4 Wochen zum Monatsende/);
    assert.match(p.text, /Textform/);
  });

  test("Absagen: Vier-Stunden-Regel, verfällt nie, höchstens vier offen", () => {
    const p = punkt("Absagen")!;
    assert.match(p.text, /Bis 4 Stunden vor dem Termin/);
    assert.match(p.text, /verfällt nie/);
    assert.match(p.text, /höchstens 4 gleichzeitig offen/);
    assert.match(p.text, /Fällt eine Stunde durch die Anbieterin aus, wird sie gutgeschrieben/);
  });

  test("die Zahl im Text passt zur Obergrenze im Code", async () => {
    const { MAX_MINUS } = await import("../lib/stundenkonto-kern.ts");
    assert.match(punkt("Absagen")!.text,
      new RegExp(`höchstens ${MAX_MINUS} gleichzeitig offen`),
      "Vertragstext und Programmregel dürfen nicht auseinanderlaufen");
  });

  test("Vorzeitiges Ende: nur gehaltene Stunden, 14 Tage, Nachlass entfällt", () => {
    const p = punkt("Vorzeitiges Ende")!;
    assert.match(p.text, /nur die tatsächlich gehaltenen Stunden zum vollen Stundensatz/);
    assert.match(p.text, /binnen 14 Tagen erstattet/);
    assert.match(p.text, /Nachlass von 50 € entfällt/);
  });

  test("Grundlagen: AGB-Stand, Widerrufsbelehrung, Terminliste als Anlagen", () => {
    const p = punkt("Grundlagen")!;
    assert.match(p.text, /AGB \(Stand 21\.08\.2026\)/);
    assert.match(p.text, /Widerrufsbelehrung/);
    assert.match(p.text, /Terminliste als Anlagen und Bestandteil/);
  });
});

describe("Die beiden Pflicht-Bestätigungen", () => {
  test("AGB-Satz wortgleich", () => {
    assert.equal(BESTAETIGUNG_AGB, "Ich habe die AGB gelesen und akzeptiere sie.");
  });

  test("Widerruf und vorzeitiger Beginn in EINEM Satz", () => {
    assert.match(BESTAETIGUNG_WIDERRUF, /Widerrufsbelehrung zur Kenntnis genommen/);
    assert.match(BESTAETIGUNG_WIDERRUF, /verlange ausdrücklich/);
    assert.match(BESTAETIGUNG_WIDERRUF, /vor Ablauf der Widerrufsfrist beginnt/);
  });
});

describe("Farben dieses Dokuments", () => {
  test("Teal und Gold wie vorgegeben", () => {
    assert.equal(FARBEN.teal, "#2E7D74");
    assert.equal(FARBEN.gold, "#C9A96A");
  });
});
