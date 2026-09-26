// =============================================================================
// Buchhaltung – Datenbank-Teil (Konten, Buchungen, Auswertungen)
//
// Die Regeln stehen in lib/buchhaltung-kern.ts (ohne Datenbank, dadurch
// testbar); hier kommen Laden, Speichern und die Perioden-Auswertung dazu.
// =============================================================================
import { service } from "@/lib/kalender";
import { euroZuCent, centFormat } from "@/lib/vertrag-kern";
import {
  kontoSaldoCent, buchungAusgeglichen, guvCent, ustZahllastCent,
  einnahmeZeilen, ausgabeZeilen, transferZeilen,
  UST_SAETZE, type Kontotyp, type Buchungszeile,
} from "@/lib/buchhaltung-kern";

export type Konto = { id: number; name: string; typ: Kontotyp };
export type KontoSaldo = Konto & { saldoCent: number };
export type Kategorie = { id: number; name: string; typ: "ertrag" | "aufwand"; saldoCent: number };
export type PeriodenAuswertung = {
  von: string; bis: string;
  ertragCent: number; aufwandCent: number; gewinnCent: number;
  umsatzsteuerCent: number; vorsteuerCent: number; zahllastCent: number;
  kategorien: Kategorie[];
};
export type BuchungsZeile = { kontoId: number; kontoName: string; sollCent: number; habenCent: number };
export type Buchung = { id: number; datum: string; beschreibung: string; zeilen: BuchungsZeile[] };

const heuteIso = () => new Date().toISOString().slice(0, 10);
const monatsanfang = (d: string) => d.slice(0, 7) + "-01";
const jahresanfang = (d: string) => d.slice(0, 4) + "-01-01";

export async function ladeKonten(): Promise<Konto[]> {
  const res = await service().from("buchhaltung_konten").select("id,name,typ")
    .eq("aktiv", true).order("typ").order("name");
  return (res.data || []) as Konto[];
}

async function systemKonto(rolle: "umsatzsteuer" | "vorsteuer"): Promise<number> {
  const res = await service().from("buchhaltung_konten").select("id").eq("rolle", rolle).maybeSingle();
  if (!res.data) throw new Error(`Systemkonto (${rolle}) fehlt – bitte die SQL-Migration ausführen.`);
  return (res.data as { id: number }).id;
}

type ZeileMitDatum = Buchungszeile & { datum: string };

async function ladeRohdaten(): Promise<{
  buchungen: { id: number; datum: string; beschreibung: string }[];
  zeilen: { buchung_id: number; konto_id: number; soll: string; haben: string }[];
}> {
  const sb = service();
  const [bRes, zRes] = await Promise.all([
    sb.from("buchhaltung_buchungen").select("id,datum,beschreibung").order("datum", { ascending: false }).order("id", { ascending: false }),
    sb.from("buchhaltung_buchungszeilen").select("buchung_id,konto_id,soll,haben"),
  ]);
  return {
    buchungen: (bRes.data || []) as { id: number; datum: string; beschreibung: string }[],
    zeilen: (zRes.data || []) as { buchung_id: number; konto_id: number; soll: string; haben: string }[],
  };
}

function periodenAuswertung(zeilen: readonly ZeileMitDatum[], konten: readonly Konto[], von: string, bis: string): PeriodenAuswertung {
  const gefiltert = zeilen.filter((z) => z.datum >= von && z.datum <= bis);
  let ertragCent = 0, aufwandCent = 0, umsatzsteuerCent = 0, vorsteuerCent = 0;
  const kategorien: Kategorie[] = [];
  for (const k of konten) {
    const saldo = kontoSaldoCent(gefiltert, k.id, k.typ);
    if (k.typ === "ertrag") { ertragCent += saldo; if (k.name !== "Erlöse" || saldo !== 0) kategorien.push({ id: k.id, name: k.name, typ: "ertrag", saldoCent: saldo }); }
    if (k.typ === "aufwand" && saldo !== 0) { aufwandCent += saldo; kategorien.push({ id: k.id, name: k.name, typ: "aufwand", saldoCent: saldo }); }
    if (k.name === "Umsatzsteuer") umsatzsteuerCent = saldo;
    if (k.name === "Vorsteuer") vorsteuerCent = saldo;
  }
  return {
    von, bis, ertragCent, aufwandCent, gewinnCent: guvCent([ertragCent], [aufwandCent]),
    umsatzsteuerCent, vorsteuerCent, zahllastCent: ustZahllastCent(umsatzsteuerCent, vorsteuerCent),
    kategorien: kategorien.sort((a, b) => b.saldoCent - a.saldoCent),
  };
}

export async function uebersicht(): Promise<{
  kontoSalden: KontoSaldo[]; monat: PeriodenAuswertung; jahr: PeriodenAuswertung; buchungen: Buchung[];
}> {
  const [konten, { buchungen: bRows, zeilen: zRows }] = await Promise.all([ladeKonten(), ladeRohdaten()]);
  const datumJeBuchung = new Map(bRows.map((b) => [b.id, b.datum]));
  const kontoName = new Map(konten.map((k) => [k.id, k.name]));

  const zeilenMitDatum: ZeileMitDatum[] = zRows.map((z) => ({
    kontoId: z.konto_id, sollCent: euroZuCent(Number(z.soll)), habenCent: euroZuCent(Number(z.haben)),
    datum: datumJeBuchung.get(z.buchung_id) || "",
  }));

  const kontoSalden = konten.map((k) => ({ ...k, saldoCent: kontoSaldoCent(zeilenMitDatum, k.id, k.typ) }));

  const heute = heuteIso();
  const monat = periodenAuswertung(zeilenMitDatum, konten, monatsanfang(heute), heute);
  const jahr = periodenAuswertung(zeilenMitDatum, konten, jahresanfang(heute), heute);

  const zeilenJeBuchung = new Map<number, BuchungsZeile[]>();
  for (const z of zRows) {
    const arr = zeilenJeBuchung.get(z.buchung_id) || [];
    arr.push({ kontoId: z.konto_id, kontoName: kontoName.get(z.konto_id) || "?", sollCent: euroZuCent(Number(z.soll)), habenCent: euroZuCent(Number(z.haben)) });
    zeilenJeBuchung.set(z.buchung_id, arr);
  }
  const buchungen = bRows.map((b) => ({ id: b.id, datum: b.datum, beschreibung: b.beschreibung, zeilen: zeilenJeBuchung.get(b.id) || [] }));

  return { kontoSalden, monat, jahr, buchungen };
}

async function buchungSpeichern(datum: string, beschreibung: string, zeilen: Buchungszeile[]): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(datum)) return { ok: false, error: "Ungültiges Datum." };
  if (!buchungAusgeglichen(zeilen)) return { ok: false, error: "Die Buchung ist nicht ausgeglichen (Soll ≠ Haben)." };

  const sb = service();
  const bRes = await sb.from("buchhaltung_buchungen").insert({ datum, beschreibung: beschreibung.trim().slice(0, 300) }).select().single();
  if (bRes.error || !bRes.data) return { ok: false, error: bRes.error?.message || "Fehler." };
  const buchungId = (bRes.data as { id: number }).id;

  const rows = zeilen.map((z) => ({
    buchung_id: buchungId, konto_id: z.kontoId,
    soll: (z.sollCent / 100).toFixed(2), haben: (z.habenCent / 100).toFixed(2),
  }));
  const zRes = await sb.from("buchhaltung_buchungszeilen").insert(rows);
  if (zRes.error) {
    await sb.from("buchhaltung_buchungen").delete().eq("id", buchungId);
    return { ok: false, error: zRes.error.message };
  }
  return { ok: true };
}

export async function einnahmeAnlegen(input: {
  aktivKontoId: number; ertragKontoId: number; bruttoCent: number; ustSatz: number; datum: string; beschreibung: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!UST_SAETZE.includes(input.ustSatz as typeof UST_SAETZE[number])) return { ok: false, error: "Ungültiger USt-Satz." };
  const umsatzsteuerKontoId = await systemKonto("umsatzsteuer");
  try {
    const zeilen = einnahmeZeilen(input.aktivKontoId, input.ertragKontoId, umsatzsteuerKontoId, input.bruttoCent, input.ustSatz);
    return await buchungSpeichern(input.datum, input.beschreibung, zeilen);
  } catch (e) { return { ok: false, error: e instanceof Error ? e.message : "Fehler." }; }
}

export async function ausgabeAnlegen(input: {
  aktivKontoId: number; aufwandKontoId: number; bruttoCent: number; ustSatz: number; datum: string; beschreibung: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!UST_SAETZE.includes(input.ustSatz as typeof UST_SAETZE[number])) return { ok: false, error: "Ungültiger USt-Satz." };
  const vorsteuerKontoId = await systemKonto("vorsteuer");
  try {
    const zeilen = ausgabeZeilen(input.aktivKontoId, input.aufwandKontoId, vorsteuerKontoId, input.bruttoCent, input.ustSatz);
    return await buchungSpeichern(input.datum, input.beschreibung, zeilen);
  } catch (e) { return { ok: false, error: e instanceof Error ? e.message : "Fehler." }; }
}

export async function transferAnlegen(input: {
  vonKontoId: number; nachKontoId: number; betragCent: number; datum: string; beschreibung: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const zeilen = transferZeilen(input.vonKontoId, input.nachKontoId, input.betragCent);
    return await buchungSpeichern(input.datum, input.beschreibung, zeilen);
  } catch (e) { return { ok: false, error: e instanceof Error ? e.message : "Fehler." }; }
}

export async function buchungLoeschen(id: number): Promise<{ ok: boolean }> {
  const up = await service().from("buchhaltung_buchungen").delete().eq("id", id);
  return { ok: !up.error };
}

export async function kontoAnlegen(name: string, typ: "aktiv" | "ertrag" | "aufwand"): Promise<{ ok: true; id: number } | { ok: false; error: string }> {
  const n = name.trim().slice(0, 80);
  if (!n) return { ok: false, error: "Bitte einen Namen angeben." };
  const res = await service().from("buchhaltung_konten").insert({ name: n, typ, system: false }).select().single();
  if (res.error || !res.data) return { ok: false, error: res.error?.message || "Ein Konto mit diesem Namen gibt es schon." };
  return { ok: true, id: (res.data as { id: number }).id };
}

export { UST_SAETZE, centFormat };
export type { Kontotyp };
