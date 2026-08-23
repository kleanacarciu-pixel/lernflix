// =============================================================================
// Verifizierung: Punkte, die bisher keinen eigenen Test hatten
//
// Deckt die in der Prüfliste genannten Punkte 6, 11, 17, 22–28 und 35 ab,
// soweit sie ohne Datenbank prüfbar sind. Was eine laufende Datenbank
// braucht (echtes Anlegen zweier Konten), ist am Ende als Struktur-Prüfung
// der Quelltexte abgesichert – das fängt wenigstens Regressionen.
// =============================================================================
import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { termineImZeitraum, type FreierZeitraum } from "../lib/schuljahr-kern.ts";
import { berechneJahresbetrag, ratenMonate, darfBuchen, centFormat } from "../lib/vertrag-kern.ts";
import {
  status, faelligeAktionen, istBankCheckTag, zahlungsSperre, terminFindetStatt,
  BANK_CHECK_TAG, type Zahlung,
} from "../lib/zahlung-kern.ts";

const f = (bez: string, von: string, bis: string, feiertag = false): FreierZeitraum =>
  ({ bezeichnung: bez, datum_von: von, datum_bis: bis, ist_feiertag: feiertag, schule_id: null });

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

// --- 6) Alle sechs Wochentage auf einmal ------------------------------------

describe("6) Sollwerte aller sechs Wochentage", () => {
  const SOLL: [string, number, number][] = [
    ["Montag", 0, 37], ["Dienstag", 1, 38], ["Mittwoch", 2, 37],
    ["Donnerstag", 3, 36], ["Freitag", 4, 37], ["Samstag", 5, 39],
  ];
  test("alle sechs Zahlen stimmen exakt", () => {
    const ist = SOLL.map(([name, wd, soll]) => {
      const n = termineImZeitraum({
        erster: "2026-09-15", letzter: "2027-07-30", wochentag: wd, frei: BAYERN,
      }).length;
      return { name, soll, ist: n };
    });
    for (const r of ist) assert.equal(r.ist, r.soll, `${r.name}: ${r.ist} statt ${r.soll}`);
  });
});

// --- 11) Familienpreis ------------------------------------------------------

describe("11) Familienpreis: ermäßigt auf ALLE Termine", () => {
  const SJ = { ab: "2026-09-15", bis: "2027-07-30" };
  const t = (wochentag: number, n: number, ab = SJ.ab, bis = SJ.bis) => ({
    wochentag, ab, bis,
    termine: Array.from({ length: n }, (_, i) =>
      `${ab.slice(0, 7)}-${String((i % 28) + 1).padStart(2, "0")}`),
  });

  test("zwei Wochentermine: JEDER Termin zum ermäßigten Satz", () => {
    const p = berechneJahresbetrag({
      tage: [t(1, 38), t(3, 36)],
      stundensatzCent: 4500, stundensatzZweitCent: 4000,
    });
    assert.equal(p.posten.length, 2);
    for (const x of p.posten) assert.equal(x.ermaessigt, true);
    assert.equal(p.jahresbetragCent, (38 + 36) * 4000);
    assert.equal(centFormat(p.jahresbetragCent), "2.960,00 €");
  });

  test("die alte Logik ist weg: kein voller Satz mehr bei zwei Terminen", () => {
    const p = berechneJahresbetrag({
      tage: [t(1, 38), t(3, 36)],
      stundensatzCent: 4500, stundensatzZweitCent: 4000,
    });
    assert.equal(p.posten.some((x) => x.satzCent === 4500), false,
      "Es darf kein Posten mehr zum vollen Satz laufen");
  });

  test("ein Wochentermin allein: voller Satz", () => {
    const p = berechneJahresbetrag({
      tage: [t(1, 38)], stundensatzCent: 4500, stundensatzZweitCent: 4000,
    });
    assert.equal(p.posten[0].ermaessigt, false);
    assert.equal(p.jahresbetragCent, 38 * 4500);
  });

  test("Geschwisterkind mit nur einem Termin: alles ermäßigt", () => {
    const p = berechneJahresbetrag({
      tage: [t(2, 37)], stundensatzCent: 4500, stundensatzZweitCent: 4000, zweitesKind: true,
    });
    assert.equal(p.posten[0].ermaessigt, true);
    assert.equal(p.jahresbetragCent, 37 * 4000);
  });
});

// --- 13) Raten ---------------------------------------------------------------

describe("13) Raten Sep–Jul, August frei", () => {
  test("volles Schuljahr ab September ergibt 11 Raten", () => {
    const m = ratenMonate("2026-09-01", "2027-07-30");
    assert.equal(m.length, 11);
    assert.equal(m[0], "2026-09-01");
    assert.equal(m[10], "2027-07-01");
  });
  test("August ist nie dabei", () => {
    for (const beginn of ["2026-09-01", "2027-01-01", "2027-06-01"]) {
      const m = ratenMonate(beginn, "2027-07-30");
      assert.equal(m.some((x) => x.slice(5, 7) === "08"), false, `August bei Beginn ${beginn}`);
    }
  });
});

// --- 17) Harte Sperre bis zur Unterschrift -----------------------------------

describe("17) Ohne unterschriebenen Vertrag ist keine Buchung möglich", () => {
  test("laufender Vertrag ohne Unterschrift sperrt", () => {
    for (const s of ["angeboten", "aktiv"]) {
      const r = darfBuchen({ status: s, agb_akzeptiert_am: null });
      assert.equal(r.erlaubt, false, `Status ${s} müsste sperren`);
      assert.match(r.grund || "", /unterschreib/i);
    }
  });

  test("nach der Unterschrift ist Buchen wieder möglich", () => {
    assert.equal(darfBuchen({
      status: "aktiv", agb_akzeptiert_am: "2026-09-01T10:00:00Z",
      unterzeichnet_am: "2026-09-01T10:00:00Z",
    }).erlaubt, true);
  });

  test("ohne Schuljahresvertrag greift die Sperre nicht (Probestunden)", () => {
    assert.equal(darfBuchen(null).erlaubt, true);
  });

  test("die Sperre hängt an ALLEN vier Buchungswegen im Kalender", () => {
    const quelle = readFileSync("app/api/kalender/route.ts", "utf8");
    const stellen = [...quelle.matchAll(/const g = await buchungErlaubt\(/g)];
    assert.equal(stellen.length, 4, `nur ${stellen.length} Wächter gefunden, erwartet 4`);
    // Jeder Wächter muss bei Ablehnung auch wirklich abbrechen.
    for (const m of stellen) {
      const zeile = quelle.slice(m.index, m.index + 200);
      assert.match(zeile, /if \(!g\.erlaubt\) return bad\(/);
    }
  });
});

// --- 22–28) Mahn-Automatik ---------------------------------------------------

const z = (a: Partial<Zahlung> = {}): Zahlung => ({
  monat: "2027-03-01", bezahlt_am: null, offen_seit: null,
  erinnerung_am: null, pausiert_am: null, ...a,
});

describe("22) Ausnahme-Logik: Standard ist bezahlt", () => {
  test("eine nie angefasste Rate gilt als bezahlt – auch im Folgemonat", () => {
    assert.equal(status(z(), "2027-03-31"), "bezahlt");
    assert.equal(status(z(), "2027-05-01"), "bezahlt");
  });
  test("kein monatliches Abhaken nötig: ohne Markierung passiert nichts", () => {
    const a = faelligeAktionen(z(), "2027-03-10");
    assert.equal(a.erinnerung, false);
    assert.equal(a.pausieren, false);
  });
});

describe("23) Tag 9: Bank-Check an die Admin-Adresse", () => {
  test("nur am 9. des Monats", () => {
    assert.equal(BANK_CHECK_TAG, 9);
    assert.equal(istBankCheckTag("2027-03-09"), true);
    assert.equal(istBankCheckTag("2027-03-08"), false);
    assert.equal(istBankCheckTag("2027-03-10"), false);
  });
  test("gilt in jedem Monat", () => {
    for (const m of ["01", "02", "07", "12"]) assert.equal(istBankCheckTag(`2027-${m}-09`), true);
  });
});

describe("24) Tag 10: letzter Zahltag an die Eltern", () => {
  test("die Erinnerung geht genau am 10. raus", () => {
    const m = z({ offen_seit: "2027-03-02" });
    assert.equal(faelligeAktionen(m, "2027-03-09").erinnerung, false);
    assert.equal(faelligeAktionen(m, "2027-03-10").erinnerung, true);
  });
  test("die Vorlage enthält Betrag, IBAN, Verwendungszweck und den Überschneidungs-Satz", () => {
    const sql = readFileSync("supabase/schuljahr_v3_zahlungen.sql", "utf8");
    const start = sql.indexOf("('erinnerung',");
    const block = sql.slice(start, sql.indexOf("('pausierung',"));
    for (const teil of ["{betrag}", "{iban}", "{inhaber}", "{verwendungszweck}", "{monat}", "{name}"]) {
      assert.ok(block.includes(teil), `Platzhalter ${teil} fehlt in der Erinnerungs-Vorlage`);
    }
    assert.match(block, /überschneid/i, "Der Überschneidungs-Satz fehlt");
  });
});

describe("25) Markierung nach dem 10.", () => {
  test("die Erinnerung geht sofort raus", () => {
    assert.equal(faelligeAktionen(z({ offen_seit: "2027-03-18" }), "2027-03-18").erinnerung, true);
  });
  test("pausiert wird erst fünf Tage nach der Markierung", () => {
    const m = z({ offen_seit: "2027-03-18", erinnerung_am: "2027-03-18" });
    assert.equal(faelligeAktionen(m, "2027-03-22").pausieren, false);
    assert.equal(faelligeAktionen(m, "2027-03-23").pausieren, true);
  });
});

describe("26) Tag 15: pausiert", () => {
  const m = z({ offen_seit: "2027-03-02", erinnerung_am: "2027-03-10" });
  test("Status wechselt am 15. auf pausiert", () => {
    assert.equal(status(m, "2027-03-14"), "ueberfaellig");
    assert.equal(status(m, "2027-03-15"), "pausiert");
  });
  test("Buchungen gesperrt UND fester Termin ausgesetzt", () => {
    const s = zahlungsSperre([m], "2027-03-15");
    assert.equal(s.gesperrt, true);
    assert.equal(s.regelterminAusgesetzt, true);
  });
  test("vorher: gesperrt, aber der feste Termin läuft weiter", () => {
    const s = zahlungsSperre([m], "2027-03-12");
    assert.equal(s.gesperrt, true);
    assert.equal(s.regelterminAusgesetzt, false);
  });
});

describe("27) Zwei-Tage-Vorwarnung", () => {
  test("Termine in den ersten zwei Tagen finden noch statt", () => {
    assert.equal(terminFindetStatt("2027-03-15", "2027-03-15"), true);
    assert.equal(terminFindetStatt("2027-03-16", "2027-03-15"), true);
    assert.equal(terminFindetStatt("2027-03-17", "2027-03-15"), false);
  });
});

describe("28) Markierung entfernen", () => {
  test("Status sofort wieder bezahlt, Sperre weg", () => {
    const markiert = z({ offen_seit: "2027-03-02" });
    assert.equal(zahlungsSperre([markiert], "2027-03-20").gesperrt, true);
    const frei = { ...markiert, offen_seit: null, bezahlt_am: "2027-03-20" };
    assert.equal(status(frei, "2027-03-20"), "bezahlt");
    assert.equal(zahlungsSperre([frei], "2027-03-20").gesperrt, false);
  });
  test("die Automatik löst danach nichts mehr aus", () => {
    const bezahlt = z({ offen_seit: null, bezahlt_am: "2027-03-20" });
    const a = faelligeAktionen(bezahlt, "2027-03-31");
    assert.equal(a.erinnerung, false);
    assert.equal(a.pausieren, false);
  });
});

describe("29) Automatische E-Mails gehen in Kopie an die Admin-Adresse", () => {
  test("vorlageSenden setzt kopieAn", () => {
    const q = readFileSync("lib/zahlung.ts", "utf8");
    const start = q.indexOf("async function vorlageSenden");
    const block = q.slice(start, start + 600);
    assert.match(block, /kopieAn:/);
    assert.match(block, /ADMIN_EMAIL/);
  });
});

// --- 32) Der feste Slot bleibt reserviert ------------------------------------

describe("32) Pausierung gibt den festen Termin NICHT frei", () => {
  test("die Wochenansicht liest fixed_slots ohne Rücksicht auf Zahlungen", () => {
    const q = readFileSync("lib/kalender.ts", "utf8");
    // buildWeek/slotKonflikt lesen fixed_slots nur nach status – kein Bezug
    // auf zahlungen, vertraege oder pausiert. Der Slot bleibt also belegt.
    const stellen = [...q.matchAll(/from\("fixed_slots"\)[^;]*/g)].map((m) => m[0]);
    assert.ok(stellen.length >= 2, "fixed_slots wird in kalender.ts gelesen");
    for (const s of stellen) {
      assert.equal(/zahlung|pausiert|vertrag/i.test(s), false,
        `Diese Abfrage macht den Slot von der Zahlung abhängig: ${s}`);
    }
  });

  test("die Pausierung wirkt nur beim Anlegen der Stunden, nicht auf den Slot", () => {
    const q = readFileSync("lib/stunden.ts", "utf8");
    assert.match(q, /pausierteSchueler/);
    // Es wird nur das Anlegen uebersprungen – der Slot selbst bleibt unberuehrt.
    assert.match(q, /if \(!terminFindetStatt\(date, pausiert\.get\(f\.student_id\) \?\? null\)\) return;/);
    // Jede Berührung von fixed_slots muss ein reines Lesen sein.
    const zugriffe = [...q.matchAll(/from\("fixed_slots"\)\s*\.\w+/g)].map((m) => m[0]);
    assert.ok(zugriffe.length > 0, "fixed_slots wird in stunden.ts gebraucht");
    for (const zug of zugriffe) {
      assert.match(zug, /\.select$/, `stunden.ts verändert fixed_slots: ${zug}`);
    }
  });

  test("die Mahn-Automatik verändert keine festen Termine", () => {
    const q = readFileSync("lib/zahlung.ts", "utf8");
    assert.equal(q.includes("fixed_slots"), false,
      "Die Zahlungslogik darf fixed_slots nicht anfassen");
  });
});

// --- 35) Elternkonto sieht nur die eigene Familie -----------------------------

describe("35) Trennung der Konten", () => {
  test("eigene Vertragsdaten kommen immer über die angemeldete Nutzer-ID", () => {
    const q = readFileSync("app/api/vertrag/route.ts", "utf8");
    const start = q.indexOf('if (action === "meinVertrag")');
    const block = q.slice(start, q.indexOf("// -----", start + 10));
    assert.match(block, /laufenderVertrag\(user\.id\)/);
    // Es darf keine Vertrags-ID aus dem Anfragekoerper uebernommen werden.
    assert.equal(/body\.vertrag_id/.test(block), false);
  });

  test("eigener Zahlungsstand ebenso", () => {
    const q = readFileSync("app/api/zahlungen/route.ts", "utf8");
    const start = q.indexOf('if (action === "meineZahlungen")');
    const block = q.slice(start, q.indexOf("// -----", start + 10));
    assert.match(block, /laufenderVertrag\(user\.id\)/);
    assert.match(block, /zahlungsSperreFuer\(user\.id\)/);
    assert.equal(/body\.schueler_id|body\.vertrag_id/.test(block), false);
  });

  test("alle Admin-Aktionen liegen hinter einer Rollenprüfung", () => {
    for (const datei of ["app/api/vertrag/route.ts", "app/api/zahlungen/route.ts", "app/api/schuljahr/route.ts"]) {
      const q = readFileSync(datei, "utf8");
      assert.match(q, /prof\.role !== "admin"/, `${datei} prüft die Admin-Rolle nicht`);
    }
  });

  test("PDF-Download: Schüler bekommen nur den eigenen Vertrag", () => {
    const q = readFileSync("app/api/vertrag/route.ts", "utf8");
    const start = q.indexOf("const gewuenscht = url.searchParams.get");
    const block = q.slice(start, start + 400);
    // Eine fremde Vertrags-ID zieht nur, wenn die Rolle admin ist.
    assert.match(block, /prof\.role === "admin" && gewuenscht/);
    assert.match(block, /laufenderVertrag\(user\.id\)/);
  });

  test("Datenbankseitig gilt zusätzlich RLS auf die eigene Zeile", () => {
    const sql = readFileSync("supabase/schuljahr_v3_zahlungen.sql", "utf8");
    const start = sql.indexOf("create policy zahlungen_eigene");
    const block = sql.slice(start, sql.indexOf(";", start));
    assert.match(block, /auth\.uid\(\)/);
    assert.match(block, /is_admin\(\)/);
  });
});

// --- Ergänzungen: Frühwarnung und Verfall-Bestätigung -------------------------

describe("Absage bei vollem Konto wird serverseitig abgelehnt", () => {
  const route = readFileSync("app/api/kalender/route.ts", "utf8");

  test("ohne ausdrückliche Bestätigung bricht die Absage ab", () => {
    const i = route.indexOf('const vorschau = absageVorschau(prof, hu);');
    assert.ok(i > 0, "Die Vorschau muss vor der Absage stehen");
    const block = route.slice(i, i + 500);
    assert.match(block, /vorschau\.grund === "kontoVoll"/);
    assert.match(block, /body\.verfallBestaetigt !== true/);
    assert.match(block, /ok: false/);
    assert.match(block, /status: 409/);
  });

  test("die Prüfung steht VOR dem Schreiben in die Datenbank", () => {
    const pruefung = route.indexOf('body.verfallBestaetigt !== true');
    const insert = route.indexOf('kind: "absage"');
    assert.ok(pruefung > 0 && insert > 0);
    assert.ok(pruefung < insert,
      "Die Bestätigungsprüfung muss vor dem Anlegen der Absage-Zeile liegen");
  });

  test("die Frühwarnung geht nur bei erteilter Gutschrift raus", () => {
    const i = route.indexOf('if (credit && warntVorLimit(danach)');
    assert.ok(i > 0, "Die Frühwarnung fehlt");
    const block = route.slice(i, i + 400);
    assert.match(block, /vorlageSenden\("minusWarnung"/);
  });
});

describe("Die Oberfläche warnt vor dem Verfall", () => {
  const seite = readFileSync("app/kalender/page.tsx", "utf8");

  test("der Absage-Knopf schickt die Bestätigung mit", () => {
    assert.match(seite, /verfallBestaetigt: !v\.gutschrift/);
  });

  test("die feste 3 in der Anzeige ist durch die Konstante ersetzt", () => {
    assert.equal(/Minus \{balance\.minus\}\/3</.test(seite), false);
    assert.match(seite, /Minus \{balance\.minus\}\/\{MAX_MINUS\}/);
  });

  test("das Frühwarn-Banner hängt an der Warnschwelle", () => {
    assert.match(seite, /balance\.minus >= WARNUNG_AB_MINUS/);
  });
});

describe("Beide neuen E-Mail-Vorlagen sind angelegt", () => {
  const sql = readFileSync("supabase/schuljahr_v3_zahlungen.sql", "utf8");

  test("minusWarnung mit allen Platzhaltern", () => {
    const i = sql.indexOf("('minusWarnung',");
    assert.ok(i > 0, "Vorlage minusWarnung fehlt");
    const block = sql.slice(i, sql.indexOf("('terminEnde',"));
    for (const teil of ["{name}", "{offen}", "{frei}", "{grenze}"]) {
      assert.ok(block.includes(teil), `Platzhalter ${teil} fehlt`);
    }
    assert.match(block, /verfällt/);
  });

  test("terminEnde mit allen Platzhaltern", () => {
    const i = sql.indexOf("('terminEnde',");
    const block = sql.slice(i, sql.indexOf("('dank',"));
    for (const teil of ["{alterTag}", "{bleibtTag}", "{endeAm}", "{abMonat}", "{satz}", "{jahresbetrag}", "{rate}"]) {
      assert.ok(block.includes(teil), `Platzhalter ${teil} fehlt`);
    }
  });
});
