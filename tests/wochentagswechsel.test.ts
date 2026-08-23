// =============================================================================
// Tests des Wochentagswechsels und der Raten-Neuverteilung (Abschnitt 5)
// =============================================================================
import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  wochentagWechseln, teileRatenmonate, monatsErster, tagDavor,
  ratenNeuVerteilen, ratenMonate, berechneJahresbetrag, euroZuCent, centFormat,
} from "../lib/vertrag-kern.ts";
import { termineImZeitraum, type FreierZeitraum } from "../lib/schuljahr-kern.ts";

const ERSTER = "2026-09-15";
const LETZTER = "2027-07-30";
const f = (von: string, bis: string, ft = false): FreierZeitraum =>
  ({ datum_von: von, datum_bis: bis, ist_feiertag: ft, schule_id: null });
const BAYERN: FreierZeitraum[] = [
  f("2026-11-02", "2026-11-06"), f("2026-11-18", "2026-11-18"),
  f("2026-12-24", "2027-01-08"), f("2027-02-08", "2027-02-12"),
  f("2027-03-22", "2027-04-02"), f("2027-05-06", "2027-05-06", true),
  f("2027-05-17", "2027-05-17", true), f("2027-05-18", "2027-05-28"),
];

/** Terminliste aus Zeit-Zeilen zusammensetzen – wie rechneVertrag es tut. */
function terminlisteAus(zeiten: { wochentag: number; ab_datum?: string | null; bis_datum?: string | null }[]): string[] {
  const alle: string[] = [];
  for (const z of zeiten) {
    let t = termineImZeitraum({
      erster: ERSTER, letzter: LETZTER, wochentag: z.wochentag,
      frei: BAYERN, abDatum: z.ab_datum ?? undefined,
    });
    if (z.bis_datum) t = t.filter((d) => d <= z.bis_datum!);
    alle.push(...t);
  }
  return alle.sort();
}

describe("Datums-Helfer für den Wechsel", () => {
  test("monatsErster", () => {
    assert.equal(monatsErster("2027-03-17"), "2027-03-01");
    assert.equal(monatsErster("2027-01-01"), "2027-01-01");
  });
  test("tagDavor rechnet über Monats- und Jahresgrenzen", () => {
    assert.equal(tagDavor("2027-03-01"), "2027-02-28");
    assert.equal(tagDavor("2027-01-01"), "2026-12-31");
    assert.equal(tagDavor("2027-03-29"), "2027-03-28"); // Tag nach der Zeitumstellung
  });
});

describe("Ratenmonate am Stichtag teilen", () => {
  const monate = ratenMonate("2026-09-01", LETZTER); // Sep .. Jul = 11

  test("Wechsel am 5. Januar: Januar-Rate ist noch offen", () => {
    const { faellig, verbleibend } = teileRatenmonate(monate, "2027-01-05");
    assert.deepEqual(faellig, ["2026-09-01", "2026-10-01", "2026-11-01", "2026-12-01"]);
    assert.equal(verbleibend[0], "2027-01-01");
    assert.equal(faellig.length + verbleibend.length, monate.length);
  });

  test("Wechsel am 20. Januar: Januar-Rate war schon fällig", () => {
    const { faellig, verbleibend } = teileRatenmonate(monate, "2027-01-20");
    assert.ok(faellig.includes("2027-01-01"));
    assert.equal(verbleibend[0], "2027-02-01");
  });

  test("Grenzfall 10. des Monats zählt noch als offen", () => {
    const { verbleibend } = teileRatenmonate(monate, "2027-01-10");
    assert.equal(verbleibend[0], "2027-01-01");
  });

  test("Wechsel vor Vertragsbeginn: nichts ist fällig", () => {
    const { faellig, verbleibend } = teileRatenmonate(monate, "2026-08-01");
    assert.deepEqual(faellig, []);
    assert.equal(verbleibend.length, monate.length);
  });
});

describe("Wochentag wechseln", () => {
  const zeiten = [{ wochentag: 1, uhrzeit: "16:00" }]; // Dienstag

  test("alter Tag endet am Vortag, neuer beginnt am Wechseldatum", () => {
    const neu = wochentagWechseln(zeiten, {
      alterWochentag: 1, neuerWochentag: 3, wechseldatum: "2027-01-11",
    });
    assert.equal(neu.length, 2);
    assert.equal(neu[0].bis_datum, "2027-01-10");
    assert.equal(neu[1].wochentag, 3);
    assert.equal(neu[1].ab_datum, "2027-01-11");
  });

  test("Uhrzeit wird übernommen, wenn keine neue angegeben ist", () => {
    const neu = wochentagWechseln(zeiten, { alterWochentag: 1, neuerWochentag: 3, wechseldatum: "2027-01-11" });
    assert.equal(neu[1].uhrzeit, "16:00");
  });

  test("neue Uhrzeit wird gesetzt, wenn angegeben", () => {
    const neu = wochentagWechseln(zeiten, {
      alterWochentag: 1, neuerWochentag: 3, neueUhrzeit: "17:30", wechseldatum: "2027-01-11",
    });
    assert.equal(neu[1].uhrzeit, "17:30");
  });

  test("ein zweiter Wochentermin bleibt unberührt", () => {
    const zwei = [{ wochentag: 1, uhrzeit: "16:00" }, { wochentag: 4, uhrzeit: "14:00" }];
    const neu = wochentagWechseln(zwei, { alterWochentag: 1, neuerWochentag: 3, wechseldatum: "2027-01-11" });
    const freitag = neu.find((z) => z.wochentag === 4);
    assert.equal(freitag?.bis_datum, undefined, "Freitag darf kein Enddatum bekommen");
    assert.equal(neu.length, 3);
  });
});

describe("Terminliste nach dem Wechsel", () => {
  test("setzt sich aus altem Tag davor und neuem Tag danach zusammen", () => {
    const vorher = terminlisteAus([{ wochentag: 1 }]);           // Dienstag, 38
    const nachher = terminlisteAus(wochentagWechseln([{ wochentag: 1 }], {
      alterWochentag: 1, neuerWochentag: 3, wechseldatum: "2027-01-11",
    }));

    // Vor dem Wechsel nur Dienstage, danach nur Donnerstage
    for (const d of nachher) {
      const wt = new Date(`${d}T00:00:00Z`).getUTCDay(); // 0=So
      const istDi = wt === 2, istDo = wt === 4;
      if (d < "2027-01-11") assert.ok(istDi, `${d} vor dem Wechsel muss ein Dienstag sein`);
      else assert.ok(istDo, `${d} nach dem Wechsel muss ein Donnerstag sein`);
    }
    assert.notEqual(nachher.length, 0);
    assert.notDeepEqual(nachher, vorher);
  });

  test("keine Lücke und keine Dopplung am Wechseltag", () => {
    const liste = terminlisteAus(wochentagWechseln([{ wochentag: 1 }], {
      alterWochentag: 1, neuerWochentag: 3, wechseldatum: "2027-01-11",
    }));
    assert.equal(new Set(liste).size, liste.length, "keine doppelten Termine");
    assert.deepEqual(liste, [...liste].sort(), "aufsteigend sortiert");
  });

  test("Wechsel auf denselben Wochentag ändert die Terminzahl nicht", () => {
    const vorher = terminlisteAus([{ wochentag: 1 }]);
    const nachher = terminlisteAus(wochentagWechseln([{ wochentag: 1 }], {
      alterWochentag: 1, neuerWochentag: 1, wechseldatum: "2027-01-11",
    }));
    assert.equal(nachher.length, vorher.length);
  });
});

describe("Beträge nach dem Wechsel (durchgerechnetes Beispiel)", () => {
  test("neuer Jahresbetrag und angepasste Restraten gehen exakt auf", () => {
    const SATZ = euroZuCent(45);
    const monate = ratenMonate("2026-09-01", LETZTER);

    // Vorher: Dienstag das ganze Schuljahr
    const vorherTermine = terminlisteAus([{ wochentag: 1 }]);
    const vorher = berechneJahresbetrag({
      tage: [{ wochentag: 1, anzahl: vorherTermine.length }],
      stundensatzCent: SATZ, stundensatzZweitCent: SATZ,
    });

    // Wechsel am 11.01.2027 auf Donnerstag
    const zeitenNeu = wochentagWechseln([{ wochentag: 1 }], {
      alterWochentag: 1, neuerWochentag: 3, wechseldatum: "2027-01-11",
    });
    const nachherTermine = terminlisteAus(zeitenNeu);
    const nachher = berechneJahresbetrag({
      tage: zeitenNeu.map((z) => ({
        wochentag: z.wochentag,
        anzahl: terminlisteAus([z]).length,
      })),
      stundensatzCent: SATZ, stundensatzZweitCent: SATZ,
    });

    // Jahresbetrag = Gesamtzahl der Termine × Stundensatz
    assert.equal(nachher.jahresbetragCent, nachherTermine.length * SATZ);

    // Restraten: (neuer Jahresbetrag − bereits fällige Raten) auf die offenen Monate
    const { faellig, verbleibend } = teileRatenmonate(monate, "2027-01-11");
    const alteRate = Math.round(vorher.jahresbetragCent / monate.length);
    const bereitsFaellig = alteRate * faellig.length;

    const plan = ratenNeuVerteilen({
      neuerJahresbetragCent: nachher.jahresbetragCent,
      bereitsFaelligCent: bereitsFaellig,
      verbleibendeMonate: verbleibend,
    });

    // Entscheidend: alles zusammen ergibt exakt den neuen Jahresbetrag
    const summe = bereitsFaellig + plan.reduce((s, r) => s + r.betragCent, 0);
    assert.equal(summe, nachher.jahresbetragCent,
      `bereits fällig ${centFormat(bereitsFaellig)} + Restraten müssen ${centFormat(nachher.jahresbetragCent)} ergeben`);
    assert.equal(plan.length, verbleibend.length);
  });

  test("wird der Vertrag teurer, steigen nur die Restraten", () => {
    const plan = ratenNeuVerteilen({
      neuerJahresbetragCent: euroZuCent(2000),
      bereitsFaelligCent: euroZuCent(500),
      verbleibendeMonate: ["2027-03-01", "2027-04-01", "2027-05-01"],
    });
    assert.equal(plan.reduce((s, r) => s + r.betragCent, 0), euroZuCent(1500));
    assert.equal(plan[0].betragCent, euroZuCent(500));
  });

  test("wird er günstiger, sinken die Restraten entsprechend", () => {
    const plan = ratenNeuVerteilen({
      neuerJahresbetragCent: euroZuCent(1000),
      bereitsFaelligCent: euroZuCent(700),
      verbleibendeMonate: ["2027-06-01", "2027-07-01"],
    });
    assert.equal(plan.reduce((s, r) => s + r.betragCent, 0), euroZuCent(300));
  });
});
