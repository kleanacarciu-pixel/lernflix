// =============================================================================
// Die AGB – ein Wortlaut, überall derselbe
//
// Der Text ist juristisch erarbeitet und wird wortgleich übernommen. Diese
// Tests halten fest, dass nichts fehlt, nichts gekürzt ist und dass Seite,
// Download und E-Mail-Anhang aus derselben Datei kommen.
// =============================================================================
import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { AGB_MARKDOWN, AGB_STAND, AGB_TITEL, AGB_UNTERZEILE } from "../lib/agb-text.ts";
import { bausteine, laeufeAus, alsText, anlage, nurText } from "../lib/agb-kern.ts";
import { agbPdf } from "../lib/vertrag-dokumente.ts";
import { pdfText, seiten } from "./pdf-lesen.ts";

const teile = bausteine(AGB_MARKDOWN);
const text = alsText(AGB_MARKDOWN);

describe("Vollständigkeit: §§ 1 bis 13 und drei Anlagen", () => {
  test("alle dreizehn Paragrafen stehen drin, in der richtigen Reihenfolge", () => {
    const paragrafen = teile.filter((b) => b.art === "paragraf").map((b) => nurText(b));
    assert.equal(paragrafen.length, 13, `nur ${paragrafen.length} Paragrafen gefunden`);
    paragrafen.forEach((p, i) => assert.ok(p.startsWith(`§ ${i + 1} `), `an Stelle ${i + 1} steht: ${p}`));
  });

  test("die Überschriften der Paragrafen sind vollständig", () => {
    for (const erwartet of [
      "§ 1 Geltungsbereich und Vertragspartner",
      "§ 2 Vertragsschluss",
      "§ 3 Leistungsumfang",
      "§ 4 Probestunde",
      "§ 5 Vertragslaufzeit, Terminliste, Absagen und Stundenkonto",
      "§ 6 Vergütung",
      "§ 7 Zahlung",
      "§ 8 Kündigung und Endabrechnung",
      "§ 9 Widerrufsrecht",
      "§ 10 Haftung",
      "§ 11 Datenschutz",
      "§ 12 Änderungen dieser AGB",
      "§ 13 Schlussbestimmungen",
    ]) {
      assert.ok(teile.some((b) => b.art === "paragraf" && b.text === erwartet), `fehlt: ${erwartet}`);
    }
  });

  test("Anlage 1, 2 und 3 sind enthalten", () => {
    const anlagen = teile.filter((b) => b.art === "ueberschrift").map((b) => nurText(b));
    assert.deepEqual(anlagen, [
      "Anlage 1: Widerrufsbelehrung",
      "Anlage 2: Muster-Widerrufsformular",
      "Anlage 3: Terminliste",
    ]);
  });

  test("die Widerrufsbelehrung enthält ihre drei Teile", () => {
    for (const stueck of ["Widerrufsrecht", "Folgen des Widerrufs", "Vorzeitiger Beginn der Dienstleistung"]) {
      assert.ok(teile.some((b) => b.art === "unterueberschrift" && b.text === stueck), `fehlt: ${stueck}`);
    }
    assert.ok(text.includes("binnen vierzehn Tagen ohne Angabe von Gründen"));
    assert.ok(text.includes("Für diese Rückzahlung verwenden wir dasselbe Zahlungsmittel"));
  });

  test("das Muster-Widerrufsformular ist ausfüllbar abgedruckt", () => {
    assert.ok(text.includes("Hiermit widerrufe(n) ich/wir"));
    assert.ok(text.includes("Bestellt am / Vertragsschluss am:"));
    assert.ok(text.includes("Unzutreffendes streichen"));
  });

  test("die eingerückte Erklärung zum vorzeitigen Beginn steht als Zitat drin", () => {
    const zitate = teile.filter((b) => b.art === "zitat").map(nurText);
    assert.equal(zitate.length, 1);
    assert.match(zitate[0], /Ich verlange ausdrücklich, dass der Unterricht bereits vor Ablauf/);
    assert.match(zitate[0], /anteiligen Wertersatz/);
  });
});

describe("Einzelne Sätze, auf die es ankommt", () => {
  test("Kopf und Stand", () => {
    assert.equal(AGB_STAND, "21. August 2026");
    assert.equal(AGB_TITEL, "Allgemeine Geschäftsbedingungen (AGB)");
    assert.match(AGB_UNTERZEILE, /Lerne mit Anna/);
    assert.ok(text.includes("Kohlbrennerstraße 16"));
    assert.ok(text.includes("Telefon: +49 (0)176 24700519"));
    assert.ok(text.includes("Kleinunternehmerregelung gemäß § 19 UStG"));
  });

  test("die Regeln, die das Programm umsetzt, stehen wortgleich drin", () => {
    assert.ok(text.includes("höchstens vier (4) Minusstunden gleichzeitig offen"));
    assert.ok(text.includes("mindestens vier (4) Stunden vor Terminbeginn"));
    assert.ok(text.includes("um 5 € reduzierter Stundensatz"));
    assert.ok(text.includes("abzüglich eines Nachlasses von 50 €"));
    assert.ok(text.includes("in elf gleichen Monatsraten"));
    assert.ok(text.includes("Frist von vier (4) Wochen zum Monatsende"));
  });

  test("die elektronische Unterschrift im Portal ist ausdrücklich geregelt", () => {
    assert.ok(text.includes("Gleichgestellt ist die elektronische Unterzeichnung im Buchungssystem"));
    assert.ok(text.includes("Das Nutzerkonto wird erst nach Vertragsschluss zur Buchung von Terminen freigeschaltet"));
  });

  test("nichts ist gekürzt worden", () => {
    // Grobe Wache gegen versehentliches Zusammenstreichen.
    assert.ok(text.length > 12000, `nur ${text.length} Zeichen`);
    assert.ok(teile.filter((b) => b.art === "absatz").length > 50);
  });
});

describe("Auszeichnungen werden erkannt", () => {
  test("fett", () => {
    assert.deepEqual(laeufeAus("Ein **wichtiger** Punkt"),
      [{ text: "Ein " }, { text: "wichtiger", fett: true }, { text: " Punkt" }]);
  });

  test("kursiv", () => {
    assert.deepEqual(laeufeAus("*(Hinweis)*"), [{ text: "(Hinweis)", kursiv: true }]);
  });

  test("Text ohne Auszeichnung bleibt ein Stück", () => {
    assert.deepEqual(laeufeAus("Nur Text"), [{ text: "Nur Text" }]);
  });

  test("Sternchen im Formular werden nicht als Auszeichnung missverstanden", () => {
    // „(*) Unzutreffendes streichen" darf nicht kursiv werden.
    const zeile = alsText(AGB_MARKDOWN).split("\n").find((z) => z.startsWith("(*)")) || "";
    assert.equal(zeile, "(*) Unzutreffendes streichen.");
  });

  test("Anlagen lassen sich einzeln herausschneiden", () => {
    const a1 = anlage(AGB_MARKDOWN, "Anlage 1");
    assert.match(a1, /^# Anlage 1: Widerrufsbelehrung/);
    assert.ok(a1.includes("Folgen des Widerrufs"));
    // „Muster-Widerrufsformular" wird in Anlage 1 erwähnt – abgedruckt ist es
    // erst in Anlage 2. Geprüft wird deshalb der Abdruck, nicht das Wort.
    assert.equal(a1.includes("Hiermit widerrufe(n)"), false, "Anlage 2 gehört nicht dazu");
    assert.equal(a1.includes("# Anlage 2"), false);

    const a2 = anlage(AGB_MARKDOWN, "Anlage 2");
    assert.ok(a2.includes("Hiermit widerrufe(n) ich/wir"));
    assert.equal(anlage(AGB_MARKDOWN, "Anlage 9"), "");
  });
});

describe("Eine Quelle, keine zweite Fassung", () => {
  test("die alte Kurzfassung ist überall gelöscht", () => {
    // lib/vertrag-texte.ts enthielt eine selbst formulierte Kurzfassung.
    assert.throws(() => readFileSync("lib/vertrag-texte.ts", "utf8"),
      "Die alte Kurzfassung liegt noch im Projekt");
  });

  test("Seite, Download und E-Mail-Anhang nutzen dieselbe Datei", () => {
    const seite = readFileSync("app/agb-vertrag/page.tsx", "utf8");
    const widerruf = readFileSync("app/widerruf/page.tsx", "utf8");
    const route = readFileSync("app/api/vertrag/route.ts", "utf8");
    const pdf = readFileSync("lib/vertrag-dokumente.ts", "utf8");
    for (const [wo, inhalt] of [["AGB-Seite", seite], ["Widerrufsseite", widerruf], ["PDF", pdf]] as const) {
      assert.match(inhalt, /agb-text/, `${wo} liest den Wortlaut nicht aus der zentralen Datei`);
    }
    // Vier Stellen: Anhang der Einladung, Anhang der Bestätigung, der ältere
    // Anhang der Änderungs-Mails und der Download im Portal.
    assert.equal([...route.matchAll(/agbPdf\(\)/g)].length, 4,
      "AGB-PDF fehlt an einer der vier Stellen");
  });

  test("der Wortlaut steht nur in agb-text.ts", () => {
    // Ein markanter Satz darf im Projekt genau einmal vorkommen.
    const satz = "Gleichgestellt ist die elektronische Unterzeichnung";
    for (const datei of [
      "app/agb-vertrag/page.tsx", "app/widerruf/page.tsx",
      "app/api/vertrag/route.ts", "lib/vertrag-dokumente.ts",
    ]) {
      assert.equal(readFileSync(datei, "utf8").includes(satz), false,
        `${datei} enthält eine eigene Kopie des Wortlauts`);
    }
    assert.ok(AGB_MARKDOWN.includes(satz));
  });
});

describe("Die AGB-PDF enthält den ganzen Wortlaut", async () => {
  const pdf = await agbPdf();
  const gedruckt = pdfText(pdf);

  test("es ist eine PDF mit mehreren Seiten", () => {
    assert.equal(pdf.subarray(0, 5).toString(), "%PDF-");
    assert.ok(seiten(pdf) >= 5, `nur ${seiten(pdf)} Seiten – da fehlt etwas`);
  });

  test("alle dreizehn Paragrafen sind gedruckt", () => {
    for (let i = 1; i <= 13; i++) {
      assert.ok(gedruckt.includes(`§ ${i} `), `§ ${i} fehlt in der PDF`);
    }
  });

  test("Anlage 1 – die Widerrufsbelehrung – ist enthalten", () => {
    assert.ok(gedruckt.includes("Anlage 1: Widerrufsbelehrung"));
    assert.ok(gedruckt.includes("binnen vierzehn Tagen ohne Angabe von Gründen"));
    assert.ok(gedruckt.includes("Folgen des Widerrufs"));
    assert.ok(gedruckt.includes("Vorzeitiger Beginn der Dienstleistung"));
  });

  test("Anlage 2 – das Muster-Widerrufsformular – ist enthalten", () => {
    assert.ok(gedruckt.includes("Anlage 2: Muster-Widerrufsformular"));
    assert.ok(gedruckt.includes("Hiermit widerrufe(n) ich/wir"));
    assert.ok(gedruckt.includes("Unzutreffendes streichen"));
  });

  test("Anlage 3 wird als Terminliste angekündigt", () => {
    assert.ok(gedruckt.includes("Anlage 3: Terminliste"));
  });

  test("Kopf, Stand und Anschrift stehen darin", () => {
    assert.ok(gedruckt.includes(AGB_TITEL));
    assert.ok(gedruckt.includes("Stand: 21. August 2026"));
    assert.ok(gedruckt.includes("Kohlbrennerstraße 16"));
  });

  test("der Stand steht nur einmal – nicht doppelt im Kopf", () => {
    assert.equal((gedruckt.match(/Stand: 21\. August 2026/g) || []).length, 1);
  });

  test("kein Zeichen ist im Zeichensatz verloren gegangen", () => {
    for (const zeichen of ["✓", "□", "−"]) {
      assert.equal(gedruckt.includes(zeichen), false, `${zeichen} gehört nicht in den Text`);
    }
  });
});
