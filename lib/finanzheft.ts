// =============================================================================
// Finanzheft – Datenbank-Teil (Buchungen laden/anlegen/löschen)
//
// Die Regeln stehen in lib/finanzheft-kern.ts (ohne Datenbank, dadurch
// testbar); hier kommen Laden, Speichern und die Salden-Abfrage dazu.
// =============================================================================
import { randomUUID } from "crypto";
import { service } from "@/lib/kalender";
import { euroZuCent, centFormat } from "@/lib/vertrag-kern";
import {
  pruefeBuchung, pruefeVermischung, saldenBeide, transferBuchungen,
  FIRMA_KATEGORIEN, PRIVAT_KATEGORIEN, TRANSFER_KATEGORIE,
  type Konto, type BuchungsTyp,
} from "@/lib/finanzheft-kern";

export type Buchung = {
  id: number;
  konto: Konto;
  typ: BuchungsTyp;
  betragCent: number;
  kategorie: string;
  beschreibung: string;
  datum: string;
  transferId: string | null;
};

type Zeile = {
  id: number; konto: Konto; typ: BuchungsTyp; betrag: string;
  kategorie: string; beschreibung: string; datum: string; transfer_id: string | null;
};

function ausZeile(z: Zeile): Buchung {
  return {
    id: z.id, konto: z.konto, typ: z.typ, betragCent: euroZuCent(Number(z.betrag)),
    kategorie: z.kategorie, beschreibung: z.beschreibung, datum: z.datum, transferId: z.transfer_id,
  };
}

export async function ladeBuchungen(): Promise<Buchung[]> {
  const res = await service().from("finanzheft_buchungen").select("*")
    .order("datum", { ascending: false }).order("id", { ascending: false });
  return ((res.data || []) as Zeile[]).map(ausZeile);
}

export async function salden(): Promise<{ privatCent: number; firmaCent: number }> {
  return saldenBeide(await ladeBuchungen());
}

/** Einzelne Einnahme/Ausgabe anlegen. Die Vermischungs-Warnung blockiert nichts, sie kommt nur mit zurück. */
export async function buchungAnlegen(eingabe: {
  konto: Konto; typ: BuchungsTyp; betragCent: number; kategorie: string; beschreibung: string; datum: string;
}): Promise<{ ok: true; warnung?: string } | { ok: false; error: string }> {
  const p = pruefeBuchung(eingabe);
  if (!p.ok) return { ok: false, error: p.grund };

  const up = await service().from("finanzheft_buchungen").insert({
    konto: eingabe.konto, typ: eingabe.typ, betrag: (eingabe.betragCent / 100).toFixed(2),
    kategorie: eingabe.kategorie, beschreibung: eingabe.beschreibung, datum: eingabe.datum,
  });
  if (up.error) return { ok: false, error: up.error.message };

  const v = pruefeVermischung(eingabe.konto, eingabe.kategorie);
  return v.warnung ? { ok: true, warnung: v.grund } : { ok: true };
}

/** Geld gezielt von einem Konto aufs andere übertragen – zwei verknüpfte Zeilen statt einer stillen Umbuchung. */
export async function transferAnlegen(eingabe: {
  von: Konto; nach: Konto; betragCent: number; datum: string; beschreibung: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  let paar: ReturnType<typeof transferBuchungen>;
  try {
    paar = transferBuchungen(eingabe.von, eingabe.nach, eingabe.betragCent, eingabe.datum);
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Ungültiger Transfer." };
  }

  const transferId = randomUUID();
  const zeile = (b: typeof paar.ausgabe) => ({
    konto: b.konto, typ: b.typ, betrag: (b.betragCent / 100).toFixed(2),
    kategorie: b.kategorie, beschreibung: eingabe.beschreibung, datum: b.datum, transfer_id: transferId,
  });

  const up = await service().from("finanzheft_buchungen").insert([zeile(paar.ausgabe), zeile(paar.einnahme)]);
  return up.error ? { ok: false, error: up.error.message } : { ok: true };
}

/** Eine Buchung löschen – bei einem Transfer wird die verknüpfte Gegenzeile gleich mitgelöscht. */
export async function buchungLoeschen(id: number): Promise<{ ok: boolean }> {
  const sb = service();
  const geladen = await sb.from("finanzheft_buchungen").select("transfer_id").eq("id", id).maybeSingle();
  const transferId = (geladen.data as { transfer_id: string | null } | null)?.transfer_id;

  const up = transferId
    ? await sb.from("finanzheft_buchungen").delete().eq("transfer_id", transferId)
    : await sb.from("finanzheft_buchungen").delete().eq("id", id);
  return { ok: !up.error };
}

export { FIRMA_KATEGORIEN, PRIVAT_KATEGORIEN, TRANSFER_KATEGORIE, centFormat };
export type { Konto, BuchungsTyp };
