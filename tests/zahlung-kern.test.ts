// =============================================================================
// Tests des Zahlungsstatus und der Mahn-Automatik (Abschnitt 6)
// =============================================================================
import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  status, faelligeAktionen, pausierungAb, zahlungsSperre,
  terminFindetStatt, termineEntfallenAb, tagImMonat, plusTage,
  giltAlsBezahlt, bezahltAm,
  type Zahlung,
} from "../lib/zahlung-kern.ts";

const z = (a: Partial<Zahlung> = {}): Zahlung => ({
  monat: "2027-03-01", bezahlt_am: null, offen_seit: null,
  erinnerung_am: null, pausiert_am: null, ...a,
});

describe("Datums-Helfer", () => {
  test("tagImMonat", () => {
    assert.equal(tagImMonat("2027-03-01", 10), "2027-03-10");
    assert.equal(tagImMonat("2027-03-01", 15), "2027-03-15");
  });
  test("plusTage über Monatsgrenzen", () => {
    assert.equal(plusTage("2027-03-28", 5), "2027-04-02");
    assert.equal(plusTage("2026-12-30", 5), "2027-01-04");
  });
});

describe("Umkehrlogik: nicht markiert = bezahlt", () => {
  test("ohne Markierung gilt die Zahlung als bezahlt – auch nach dem 10.", () => {
    assert.equal(status(z(), "2027-03-25"), "bezahlt");
    assert.equal(status(z(), "2027-06-01"), "bezahlt");
  });

  test("ausdrücklich als bezahlt vermerkt bleibt bezahlt", () => {
    assert.equal(status(z({ bezahlt_am: "2027-03-04", offen_seit: "2027-03-02" }), "2027-03-30"), "bezahlt");
  });

  test("Markierung entfernen heißt: wieder bezahlt", () => {
    const markiert = z({ offen_seit: "2027-03-02" });
    assert.equal(status(markiert, "2027-03-12"), "ueberfaellig");
    // Kleana entfernt die Markierung -> offen_seit wieder null
    assert.equal(status({ ...markiert, offen_seit: null }, "2027-03-12"), "bezahlt");
  });
});

describe("Ist das Geld da? (Bescheinigung und Endabrechnung)", () => {
  test("nicht markiert und Fälligkeit vorbei: gilt als bezahlt", () => {
    assert.equal(giltAlsBezahlt(z(), "2027-03-11"), true);
    assert.equal(giltAlsBezahlt(z(), "2027-08-01"), true);
  });

  test("nicht markiert, aber noch im Zahlungsfenster: noch nicht bezahlt", () => {
    assert.equal(giltAlsBezahlt(z(), "2027-03-05"), false);
    assert.equal(giltAlsBezahlt(z(), "2027-03-10"), false);
  });

  test("künftiger Monat zählt nicht mit", () => {
    assert.equal(giltAlsBezahlt(z({ monat: "2027-06-01" }), "2027-03-20"), false);
  });

  test("als offen markiert: nicht bezahlt, egal wann", () => {
    assert.equal(giltAlsBezahlt(z({ offen_seit: "2027-03-02" }), "2027-06-01"), false);
  });

  test("ausdrücklich abgehakt zählt sofort", () => {
    assert.equal(giltAlsBezahlt(z({ bezahlt_am: "2027-03-04" }), "2027-03-04"), true);
  });

  test("Datum für die Bescheinigung", () => {
    assert.equal(bezahltAm(z({ bezahlt_am: "2027-03-04" })), "2027-03-04");
    assert.equal(bezahltAm(z()), "2027-03-10");   // sonst der letzte Fälligkeitstag
  });
});

describe("Status im Zeitverlauf", () => {
  const markiert = z({ offen_seit: "2027-03-02" });

  test("bis zum 10. nur offen", () => {
    assert.equal(status(markiert, "2027-03-05"), "offen");
    assert.equal(status(markiert, "2027-03-10"), "offen");
  });

  test("ab dem 11. überfällig", () => {
    assert.equal(status(markiert, "2027-03-11"), "ueberfaellig");
    assert.equal(status(markiert, "2027-03-14"), "ueberfaellig");
  });

  test("ab dem 15. pausiert", () => {
    assert.equal(status(markiert, "2027-03-15"), "pausiert");
    assert.equal(status(markiert, "2027-03-20"), "pausiert");
  });
});

describe("Späte Markierung: fünf Tage Frist ab Markierung", () => {
  test("am 20. markiert -> Pausierung erst am 25.", () => {
    const spaet = z({ offen_seit: "2027-03-20" });
    assert.equal(pausierungAb(spaet), "2027-03-25");
    assert.equal(status(spaet, "2027-03-24"), "ueberfaellig");
    assert.equal(status(spaet, "2027-03-25"), "pausiert");
  });

  test("früh markiert -> es bleibt beim 15.", () => {
    assert.equal(pausierungAb(z({ offen_seit: "2027-03-02" })), "2027-03-15");
  });

  test("am 12. markiert: der 15. liegt weniger als 5 Tage später, es zählt der 17.", () => {
    const m = z({ offen_seit: "2027-03-12" });
    assert.equal(pausierungAb(m), "2027-03-17");
    assert.equal(status(m, "2027-03-16"), "ueberfaellig");
  });
});

describe("Mahnlauf: welche Aktion ist heute fällig?", () => {
  test("früh markiert: Erinnerung genau am 10.", () => {
    const m = z({ offen_seit: "2027-03-02" });
    assert.equal(faelligeAktionen(m, "2027-03-09").erinnerung, false);
    assert.equal(faelligeAktionen(m, "2027-03-10").erinnerung, true);
  });

  test("nach dem 10. markiert: Erinnerung sofort", () => {
    const m = z({ offen_seit: "2027-03-18" });
    assert.equal(faelligeAktionen(m, "2027-03-18").erinnerung, true);
  });

  test("Erinnerung wird nicht zweimal verschickt", () => {
    const m = z({ offen_seit: "2027-03-02", erinnerung_am: "2027-03-10" });
    assert.equal(faelligeAktionen(m, "2027-03-11").erinnerung, false);
  });

  test("Pausierung wird genau einmal ausgelöst", () => {
    const m = z({ offen_seit: "2027-03-02", erinnerung_am: "2027-03-10" });
    assert.equal(faelligeAktionen(m, "2027-03-15").pausieren, true);
    const schon = { ...m, pausiert_am: "2027-03-15" };
    assert.equal(faelligeAktionen(schon, "2027-03-20").pausieren, false);
  });

  test("bezahlte Zahlung löst nichts mehr aus", () => {
    const m = z({ offen_seit: "2027-03-02", bezahlt_am: "2027-03-12" });
    const a = faelligeAktionen(m, "2027-03-20");
    assert.equal(a.erinnerung, false);
    assert.equal(a.pausieren, false);
  });

  test("nicht markierte Zahlung löst nie etwas aus", () => {
    const a = faelligeAktionen(z(), "2027-03-31");
    assert.equal(a.erinnerung, false);
    assert.equal(a.pausieren, false);
  });
});

describe("Ausfall-Vorwarnung nach der Pausierung", () => {
  test("Termine in den ersten zwei Tagen finden noch statt", () => {
    const pausiert = "2027-03-15";
    assert.equal(termineEntfallenAb(pausiert), "2027-03-17");
    assert.equal(terminFindetStatt("2027-03-15", pausiert), true);
    assert.equal(terminFindetStatt("2027-03-16", pausiert), true);
    assert.equal(terminFindetStatt("2027-03-17", pausiert), false, "ab dem dritten Tag entfällt der Termin");
    assert.equal(terminFindetStatt("2027-03-22", pausiert), false);
  });

  test("ohne Pausierung findet jeder Termin statt", () => {
    assert.equal(terminFindetStatt("2027-03-22", null), true);
  });
});

describe("Sperre der Buchung", () => {
  test("alles bezahlt: keine Sperre", () => {
    const s = zahlungsSperre([z(), z({ monat: "2027-04-01" })], "2027-04-20");
    assert.equal(s.gesperrt, false);
    assert.equal(s.regelterminAusgesetzt, false);
  });

  test("offen, aber noch vor dem 11.: keine Sperre", () => {
    const s = zahlungsSperre([z({ offen_seit: "2027-03-02" })], "2027-03-08");
    assert.equal(s.gesperrt, false);
  });

  test("überfällig: Buchung gesperrt, Regeltermin bleibt", () => {
    const s = zahlungsSperre([z({ offen_seit: "2027-03-02" })], "2027-03-12");
    assert.equal(s.gesperrt, true);
    assert.equal(s.regelterminAusgesetzt, false);
    assert.match(s.grund || "", /offene Zahlung/);
  });

  test("pausiert: zusätzlich ruht der Regeltermin", () => {
    const s = zahlungsSperre([z({ offen_seit: "2027-03-02" })], "2027-03-16");
    assert.equal(s.gesperrt, true);
    assert.equal(s.regelterminAusgesetzt, true);
  });

  test("eine pausierte Zahlung genügt, auch wenn andere bezahlt sind", () => {
    const s = zahlungsSperre(
      [z({ monat: "2027-02-01" }), z({ monat: "2027-03-01", offen_seit: "2027-03-02" })],
      "2027-03-16",
    );
    assert.equal(s.gesperrt, true);
    assert.equal(s.regelterminAusgesetzt, true);
  });

  test("nach Zahlungseingang entsperrt es sofort wieder", () => {
    const offen = [z({ offen_seit: "2027-03-02" })];
    assert.equal(zahlungsSperre(offen, "2027-03-16").gesperrt, true);
    const bezahlt = [z({ offen_seit: null })];   // Markierung entfernt
    assert.equal(zahlungsSperre(bezahlt, "2027-03-16").gesperrt, false);
  });
});
