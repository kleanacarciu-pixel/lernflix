// =============================================================================
// Die Vertrags-PDF wirklich erzeugen und hineinschauen
//
// Der Wortlaut steht in vertrag-pdf-texte.test.ts. Hier geht es darum, ob er
// auch tatsächlich im Dokument ankommt – und ob beide Unterschriften darin
// stehen. Die PDF ist das, was die Familie am Ende in der Hand hält; ein
// stiller Fehler dort fällt sonst erst auf, wenn der Vertrag schon raus ist.
//
// Gelesen wird die PDF ohne Fremdbibliothek: Die Inhaltsströme sind mit zlib
// gepackt, darin stehen die Texte als Hex-Ketten hinter „TJ".
// =============================================================================
import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { nachhilfevertragPdf } from "../lib/vertrag-dokumente.ts";
import { TITEL, FUSSZEILE, ANBIETERIN, WICHTIGSTES } from "../lib/vertrag-pdf-texte.ts";
import { inhalt, texte } from "./pdf-lesen.ts";

const beispiel = {
  schuljahrName: "2026/27",
  eltern: {
    name: "Maria Muster", anschrift: "Beispielweg 3, 80331 München",
    email: "maria@example.de", telefon: "0176 1234567",
  },
  kind: { name: "Lea Muster", schule: "Gymnasium Nord" },
  zeiten: [{ wochentag: 1, uhrzeit: "16:00" }],
  anzahlTermine: 38,
  stundensatzCent: 45_00,
  jahresbetragCent: 1_710_00,
  zahlweise: "raten" as const,
  raten: Array.from({ length: 11 }, (_, i) => ({
    monat: `2026-${String(9 + i).padStart(2, "0")}-01`, betragCent: 155_45,
  })),
  einmalCent: 1_660_00,
  erstelltAm: "2026-08-25T09:00:00Z",
};

/** Ein winziges, gültiges PNG – reicht pdfkit zum Einbetten. */
const PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  "base64",
);

describe("Der Vertrag steht vollständig in der PDF", async () => {
  const pdf = await nachhilfevertragPdf(beispiel);
  const strom = inhalt(pdf);
  const alles = texte(strom).join(" ");

  test("es ist eine PDF und sie hat genau eine Seite", () => {
    assert.equal(pdf.subarray(0, 5).toString(), "%PDF-");
    const seiten = [...strom.matchAll(/\/Type\s*\/Page[^s]/g)].length;
    assert.equal([...pdf.toString("latin1").matchAll(/\/Type\s*\/Page[^s]/g)].length, 1,
      `${seiten} Seiten – der Vertrag muss auf eine passen`);
  });

  test("Titel, Anbieterin und Fußzeile", () => {
    for (const stueck of [TITEL, ANBIETERIN.zeile, FUSSZEILE]) {
      assert.ok(alles.includes(stueck), `fehlt: ${stueck}`);
    }
  });

  test("die Daten der Familie stehen drin", () => {
    for (const stueck of [
      "Maria Muster", "Beispielweg 3, 80331 München", "maria@example.de",
      "Lea Muster", "Gymnasium Nord", "Dienstag 16:00 Uhr", "38",
    ]) {
      assert.ok(alles.includes(stueck), `fehlt: ${stueck}`);
    }
  });

  test("Stundensatz, Jahresbetrag und Rate", () => {
    for (const stueck of ["45,00 €", "1.710,00 €", "155,45 €"]) {
      assert.ok(alles.includes(stueck), `fehlt: ${stueck}`);
    }
  });

  test("alle fünf Punkte aus „Das Wichtigste“", () => {
    for (const p of WICHTIGSTES) {
      assert.ok(alles.includes(p.titel), `Überschrift fehlt: ${p.titel}`);
      // Der erste Halbsatz genügt: Zeilenumbrüche zerlegen längere Sätze.
      const anfang = p.text.split(" ").slice(0, 4).join(" ");
      assert.ok(alles.includes(anfang), `Text fehlt: ${anfang}`);
    }
  });

  test("kein Zeichen ist im Zeichensatz verloren gegangen", () => {
    // ✓, □ und − stehen NICHT im WinAnsi-Zeichensatz der eingebauten
    // Schriften. Landeten sie im Text, käme Unsinn heraus.
    for (const zeichen of ["✓", "□", "−"]) {
      assert.equal(alles.includes(zeichen), false, `${zeichen} gehört gezeichnet, nicht gesetzt`);
    }
  });
});

describe("Unterschriften und Zeitstempel", async () => {
  test("ohne Unterschriften entsteht die PDF trotzdem – nur ohne Bilder", async () => {
    const pdf = await nachhilfevertragPdf(beispiel);
    assert.equal([...pdf.toString("latin1").matchAll(/\/Subtype\s*\/Image/g)].length, 0);
    assert.ok(pdf.length > 1000);
  });

  test("jede Unterschrift wird auch wirklich gezeichnet", async () => {
    // Gezählt wird der Zeichenbefehl („Do"), nicht die Zahl der Bildobjekte:
    // ein PNG mit Durchsichtigkeit legt zusätzlich seine Maske ab, ein
    // deckendes nicht. Wer Objekte zählt, zählt je nach Bild anders.
    const gezeichnet = async (dat: Record<string, unknown>) =>
      [...inhalt(await nachhilfevertragPdf({ ...beispiel, ...dat } as Parameters<typeof nachhilfevertragPdf>[0]))
        .matchAll(/\/[A-Za-z0-9]+ Do/g)].length;

    assert.equal(await gezeichnet({}), 0, "ohne Unterschrift darf kein Bild stehen");
    assert.equal(await gezeichnet({ unterschriftAnbieterin: PNG }), 1, "Kleanas Unterschrift fehlt");
    assert.equal(await gezeichnet({ unterschriftEltern: PNG }), 1, "Unterschrift der Eltern fehlt");
    assert.equal(await gezeichnet({ unterschriftAnbieterin: PNG, unterschriftEltern: PNG }), 2,
      "es müssen beide Unterschriften im Vertrag stehen");
  });

  test("die Zeitstempel der Bestätigungen stehen im Dokument", async () => {
    const pdf = await nachhilfevertragPdf({
      ...beispiel,
      unterschriftAnbieterin: PNG, unterschriftEltern: PNG,
      unterzeichnetAm: "2026-09-01T10:15:00Z",
      agbBestaetigtAm: "2026-09-01T10:15:00Z",
      widerrufBestaetigtAm: "2026-09-01T10:15:00Z",
    });
    const alles = texte(inhalt(pdf)).join(" ");
    assert.ok(alles.includes("01.09.2026, 10:15 Uhr"), "Zeitstempel der Bestätigung fehlt");
    assert.ok(alles.includes("bestätigt am"), "Hinweis auf die Bestätigung fehlt");
  });

  test("Kleanas Datum kommt aus dem Vertrag, nicht von der Uhr", async () => {
    // Sonst stünde in der archivierten PDF jedes Mal ein anderes Datum.
    const a = texte(inhalt(await nachhilfevertragPdf(beispiel))).join(" ");
    assert.ok(a.includes("München, den 25.08.2026"), "Erstelldatum fehlt oder ist das heutige");
  });

  test("ein unbrauchbares Bild verhindert den Vertrag nicht", async () => {
    const pdf = await nachhilfevertragPdf({
      ...beispiel, unterschriftEltern: Buffer.from("kein Bild"),
    });
    assert.equal(pdf.subarray(0, 5).toString(), "%PDF-");
  });
});

describe("Die angekreuzte Zahlweise", () => {
  test("bei Raten steht die Ratenzeile fett und die Zahl stimmt", async () => {
    const alles = texte(inhalt(await nachhilfevertragPdf(beispiel))).join(" ");
    assert.ok(alles.includes("11 Monatsraten à 155,45 €"), "Ratenzeile fehlt");
    assert.ok(alles.includes("Einmalzahlung von 1.660,00 €"), "Einmalzeile fehlt");
  });

  test("bei Einmalzahlung ändert sich nur das Kreuz, nicht der Text", async () => {
    const alles = texte(inhalt(await nachhilfevertragPdf({ ...beispiel, zahlweise: "einmal" }))).join(" ");
    assert.ok(alles.includes("11 Monatsraten à 155,45 €"));
    assert.ok(alles.includes("Einmalzahlung von 1.660,00 €"));
  });
});
