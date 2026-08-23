// =============================================================================
// Schuljahresmodell – Zahlungen, Mahnwesen und Plusstunden (serverseitig)
//
// Die Regeln stehen in lib/zahlung-kern.ts (ohne Datenbank, dadurch testbar);
// hier kommen Laden, Speichern und der E-Mail-Versand dazu.
// =============================================================================
import { service, sendMail, ADMIN_EMAIL } from "@/lib/kalender";
import { ladeVertrag, rechneVertrag, buchungErlaubt, type Vertrag } from "@/lib/vertrag";
import { euroZuCent, centFormat } from "@/lib/vertrag-kern";
import { datumDe } from "@/lib/schuljahr-kern";
import type { Schuljahr } from "@/lib/schuljahr";
import {
  status, faelligeAktionen, zahlungsSperre, terminFindetStatt, pausierungAb,
  type Zahlung as ZahlungKern, type Status,
} from "@/lib/zahlung-kern";
import { bankverbindung } from "@/lib/vertrag-dokumente";

export type Zahlung = ZahlungKern & {
  id: string;
  vertrag_id: string;
  soll_betrag: number;
  offen_bis: string | null;
};

export const heuteIso = () => new Date().toISOString().slice(0, 10);

// --- Zahlungsplan -----------------------------------------------------------

/**
 * Zahlungsplan eines Vertrags anlegen bzw. auffrischen.
 * Bestehende Zeilen bleiben erhalten (mit ihrem Bezahlt-Stand); nur Beträge
 * werden angeglichen und fehlende Monate ergänzt. Bei Einmalzahlung entsteht
 * genau eine Zeile im Monat des Vertragsbeginns.
 */
export async function schreibeZahlungsplan(vertragId: string): Promise<{ ok: boolean; anzahl: number }> {
  const sb = service();
  const geladen = await ladeVertrag(vertragId);
  if (!geladen) return { ok: false, anzahl: 0 };
  const { vertrag, zeiten } = geladen;

  const sjRes = await sb.from("schuljahre")
    .select("id,name,erster_schultag,letzter_schultag,aktiv").eq("id", vertrag.schuljahr_id).single();
  if (sjRes.error || !sjRes.data) return { ok: false, anzahl: 0 };

  const r = await rechneVertrag({
    schuljahr: sjRes.data as Schuljahr,
    zeiten: zeiten.map((z) => ({ wochentag: z.wochentag, uhrzeit: z.uhrzeit, ab_datum: z.ab_datum, bis_datum: z.bis_datum })),
    stundensatzCent: euroZuCent(Number(vertrag.stundensatz)),
    stundensatzZweitCent: euroZuCent(Number(vertrag.stundensatz_zweittermin)),
    zweitesKind: vertrag.zweites_kind,
    vertragsbeginn: vertrag.vertragsbeginn,
    schuleId: vertrag.schule_id,
  });

  const zeilen = vertrag.zahlweise === "einmal"
    ? [{ monat: vertrag.vertragsbeginn, betragCent: r.einmalCent }]
    : r.raten.map((x) => ({ monat: x.monat, betragCent: x.betragCent }));

  for (const z of zeilen) {
    await sb.from("zahlungen").upsert(
      { vertrag_id: vertragId, monat: z.monat, soll_betrag: (z.betragCent / 100).toFixed(2) },
      { onConflict: "vertrag_id,monat" },
    );
  }
  return { ok: true, anzahl: zeilen.length };
}

/**
 * Nach einem Wochentagswechsel (Abschnitt 5): nur die noch nicht fälligen
 * Raten anpassen. Bereits gezahlte Monate bleiben unangetastet.
 */
export async function aktualisiereRestraten(
  vertragId: string,
  restplan: { monat: string; betragCent: number }[],
): Promise<void> {
  const sb = service();
  for (const r of restplan) {
    await sb.from("zahlungen").upsert(
      { vertrag_id: vertragId, monat: r.monat, soll_betrag: (r.betragCent / 100).toFixed(2) },
      { onConflict: "vertrag_id,monat" },
    );
  }
}

export async function ladeZahlungen(vertragId: string): Promise<Zahlung[]> {
  const res = await service().from("zahlungen").select("*").eq("vertrag_id", vertragId).order("monat");
  return (res.data || []) as Zahlung[];
}

// --- Sperre für die Buchung -------------------------------------------------

/** Sperrt eine überfällige Rate die Buchung dieses Schülers? */
export async function zahlungsSperreFuer(schuelerId: string): Promise<{
  gesperrt: boolean; grund?: string; regelterminAusgesetzt: boolean; pausiertAm: string | null;
}> {
  const sb = service();
  const vRes = await sb.from("vertraege").select("id")
    .eq("schueler_id", schuelerId).in("status", ["angeboten", "aktiv"]).maybeSingle();
  if (vRes.error || !vRes.data) return { gesperrt: false, regelterminAusgesetzt: false, pausiertAm: null };

  const zahlungen = await ladeZahlungen((vRes.data as { id: string }).id);
  const s = zahlungsSperre(zahlungen, heuteIso());
  const pausiert = zahlungen.map((z) => z.pausiert_am).filter(Boolean).sort().pop() || null;
  return { ...s, pausiertAm: s.regelterminAusgesetzt ? pausiert : null };
}

/**
 * Gesamter Buchungs-Wächter: AGB-Bestätigung (Abschnitt 4) UND offene Rate.
 * Bewusst hier und nicht in lib/vertrag.ts, damit die Importe in eine
 * Richtung laufen (zahlung -> vertrag) und kein Kreis entsteht.
 */
export async function buchungErlaubtGesamt(schuelerId: string): Promise<{ erlaubt: boolean; grund?: string }> {
  const agb = await buchungErlaubt(schuelerId);
  if (!agb.erlaubt) return agb;
  const zahlung = await zahlungsSperreFuer(schuelerId);
  if (zahlung.gesperrt) return { erlaubt: false, grund: zahlung.grund };
  return { erlaubt: true };
}

/**
 * Alle Schüler, deren Vertrag wegen einer offenen Rate pausiert ist, mit dem
 * Tag der Pausierung. Wird beim Anlegen der Stunden gebraucht, damit der feste
 * Wochentermin ruht. Ein Eintrag verschwindet in dem Moment wieder, in dem
 * Kleana die Markierung entfernt.
 */
export async function pausierteSchueler(heute = heuteIso()): Promise<Map<string, string>> {
  const sb = service();
  const zRes = await sb.from("zahlungen").select("*")
    .not("offen_seit", "is", null).is("bezahlt_am", null);
  const zahlungen = (zRes.data || []) as Zahlung[];
  const pausiert = zahlungen.filter((z) => status(z, heute) === "pausiert");
  if (!pausiert.length) return new Map();

  const vRes = await sb.from("vertraege").select("id,schueler_id")
    .in("id", [...new Set(pausiert.map((z) => z.vertrag_id))]);
  const vertraege = (vRes.data || []) as { id: string; schueler_id: string }[];

  const out = new Map<string, string>();
  for (const z of pausiert) {
    const v = vertraege.find((x) => x.id === z.vertrag_id);
    if (!v) continue;
    // Der früheste Pausierungstag zählt – daran hängt die Zwei-Tage-Vorwarnung.
    const tag = (z.pausiert_am || tagAusPausierung(z)).slice(0, 10);
    const bisher = out.get(v.schueler_id);
    if (!bisher || tag < bisher) out.set(v.schueler_id, tag);
  }
  return out;
}

/** Fällt die Pausierung rechnerisch an, ist sie aber noch nicht eingetragen. */
function tagAusPausierung(z: Zahlung): string {
  return pausierungAb(z) || z.monat;
}

/** Findet ein Regeltermin trotz Pausierung noch statt? (Ausfall-Vorwarnung) */
export async function terminTrotzPause(schuelerId: string, datum: string): Promise<boolean> {
  const s = await zahlungsSperreFuer(schuelerId);
  if (!s.regelterminAusgesetzt) return true;
  return terminFindetStatt(datum, s.pausiertAm);
}

// --- E-Mail-Vorlagen --------------------------------------------------------

export type Vorlage = { schluessel: string; betreff: string; text: string };

export async function ladeVorlagen(): Promise<Vorlage[]> {
  const res = await service().from("mahn_vorlagen").select("*").order("schluessel");
  return (res.data || []) as Vorlage[];
}

/** Platzhalter in geschweiften Klammern ersetzen. */
export function fuelle(text: string, werte: Record<string, string>): string {
  return text.replace(/\{(\w+)\}/g, (_, k: string) => werte[k] ?? `{${k}}`);
}

const MONATSNAMEN = ["Januar", "Februar", "März", "April", "Mai", "Juni",
  "Juli", "August", "September", "Oktober", "November", "Dezember"];
export function monatName(iso: string): string {
  const [j, m] = iso.split("-");
  return `${MONATSNAMEN[Number(m) - 1]} ${j}`;
}

/** Reintext in schlichtes HTML wandeln (Absätze bleiben erhalten). */
function alsHtml(text: string): string {
  const sicher = text.replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c] || c));
  return sicher.split(/\n{2,}/).map((p) => `<p>${p.replace(/\n/g, "<br>")}</p>`).join("");
}

async function vorlageSenden(schluessel: string, an: string, werte: Record<string, string>): Promise<void> {
  const res = await service().from("mahn_vorlagen").select("*").eq("schluessel", schluessel).maybeSingle();
  const v = res.data as Vorlage | null;
  if (!v) return;
  // Jede automatische E-Mail geht in Kopie an die Admin-Adresse.
  await sendMail(an, fuelle(v.betreff, werte), alsHtml(fuelle(v.text, werte)), undefined,
    { kopieAn: an === ADMIN_EMAIL ? undefined : ADMIN_EMAIL });
}

// --- Mahnlauf ---------------------------------------------------------------

type Betroffen = {
  zahlung: Zahlung;
  vertrag: Vertrag;
  schuelerName: string;
  schuelerEmail: string | null;
};

async function offeneZahlungen(): Promise<Betroffen[]> {
  const sb = service();
  const zRes = await sb.from("zahlungen").select("*")
    .not("offen_seit", "is", null).is("bezahlt_am", null);
  const zahlungen = (zRes.data || []) as Zahlung[];
  if (!zahlungen.length) return [];

  const ids = [...new Set(zahlungen.map((z) => z.vertrag_id))];
  const vRes = await sb.from("vertraege").select("*").in("id", ids);
  const vertraege = (vRes.data || []) as Vertrag[];
  const pRes = await sb.from("profiles").select("user_id,name,email")
    .in("user_id", vertraege.map((v) => v.schueler_id));
  const profile = (pRes.data || []) as { user_id: string; name: string; email: string | null }[];

  const out: Betroffen[] = [];
  for (const z of zahlungen) {
    const v = vertraege.find((x) => x.id === z.vertrag_id);
    if (!v || v.mahn_automatik_pausiert) continue;   // Automatik für diesen Vertrag ausgesetzt
    const p = profile.find((x) => x.user_id === v.schueler_id);
    out.push({ zahlung: z, vertrag: v, schuelerName: p?.name || "Schüler/in", schuelerEmail: p?.email ?? null });
  }
  return out;
}

function platzhalter(b: Betroffen): Record<string, string> {
  const bank = bankverbindung();
  return {
    name: b.schuelerName,
    monat: monatName(b.zahlung.monat),
    betrag: centFormat(euroZuCent(Number(b.zahlung.soll_betrag))),
    iban: bank.iban,
    inhaber: bank.inhaber,
    verwendungszweck: `Nachhilfe ${b.schuelerName} ${monatName(b.zahlung.monat)}`,
  };
}

/**
 * Täglicher Mahnlauf.
 *
 *  * Tag 9: Erinnerung an Kleana, kurz aufs Konto zu schauen.
 *  * Tag 10 (oder sofort bei späterer Markierung): „letzter Tag"-E-Mail.
 *  * Tag 15 (oder 5 Tage nach Markierung): Vertrag pausieren.
 */
export async function mahnlauf(heute = heuteIso()): Promise<{
  adminHinweis: boolean; erinnerungen: number; pausierungen: number;
}> {
  const sb = service();
  const tag = Number(heute.slice(8, 10));
  let erinnerungen = 0, pausierungen = 0;

  // Tag 9: Bank-Check-Erinnerung an Kleana – nur wenn es überhaupt Verträge gibt
  let adminHinweis = false;
  if (tag === 9) {
    const anz = await sb.from("vertraege").select("id", { count: "exact", head: true }).eq("status", "aktiv");
    if ((anz.count ?? 0) > 0) {
      await vorlageSenden("adminCheck", ADMIN_EMAIL, {});
      adminHinweis = true;
    }
  }

  for (const b of await offeneZahlungen()) {
    const aktion = faelligeAktionen(b.zahlung, heute);

    if (aktion.erinnerung && b.schuelerEmail) {
      await vorlageSenden("erinnerung", b.schuelerEmail, platzhalter(b));
      await sb.from("zahlungen").update({ erinnerung_am: heute }).eq("id", b.zahlung.id);
      erinnerungen++;
    }

    if (aktion.pausieren) {
      await sb.from("zahlungen").update({ pausiert_am: heute }).eq("id", b.zahlung.id);
      if (b.schuelerEmail) await vorlageSenden("pausierung", b.schuelerEmail, platzhalter(b));
      pausierungen++;
    }
  }

  return { adminHinweis, erinnerungen, pausierungen };
}

/** Rate als fehlend markieren – löst bei später Markierung sofort die E-Mail aus. */
export async function markiereOffen(zahlungId: string, heute = heuteIso()): Promise<{ ok: boolean; erinnerung: boolean }> {
  const sb = service();
  const up = await sb.from("zahlungen")
    .update({ offen_seit: heute, offen_bis: null, bezahlt_am: null })
    .eq("id", zahlungId).select().single();
  if (up.error || !up.data) return { ok: false, erinnerung: false };

  // Nach dem 10. markiert? Dann geht die Erinnerung sofort raus.
  const alle = await offeneZahlungen();
  const b = alle.find((x) => x.zahlung.id === zahlungId);
  if (!b) return { ok: true, erinnerung: false };
  const aktion = faelligeAktionen(b.zahlung, heute);
  if (aktion.erinnerung && b.schuelerEmail) {
    await vorlageSenden("erinnerung", b.schuelerEmail, platzhalter(b));
    await sb.from("zahlungen").update({ erinnerung_am: heute }).eq("id", zahlungId);
    return { ok: true, erinnerung: true };
  }
  return { ok: true, erinnerung: false };
}

/**
 * Markierung entfernen = Zahlung eingegangen.
 * Die Automatik stoppt sofort, der Vertrag wird entsperrt, die Eltern
 * bekommen eine kurze Dank-Nachricht.
 */
export async function markiereBezahlt(zahlungId: string, heute = heuteIso()): Promise<{ ok: boolean }> {
  const sb = service();
  const vorher = await sb.from("zahlungen").select("*").eq("id", zahlungId).single();
  const warOffen = !!(vorher.data as Zahlung | null)?.offen_seit;

  const up = await sb.from("zahlungen").update({
    bezahlt_am: heute, offen_seit: null, offen_bis: heute, pausiert_am: null,
  }).eq("id", zahlungId).select().single();
  if (up.error || !up.data) return { ok: false };

  if (warOffen) {
    const z = up.data as Zahlung;
    const v = await sb.from("vertraege").select("*").eq("id", z.vertrag_id).single();
    const vertrag = v.data as Vertrag | null;
    if (vertrag) {
      const p = await sb.from("profiles").select("name,email").eq("user_id", vertrag.schueler_id).single();
      const prof = p.data as { name: string; email: string | null } | null;
      if (prof?.email) {
        await vorlageSenden("dank", prof.email, {
          name: prof.name, monat: monatName(z.monat),
          betrag: centFormat(euroZuCent(Number(z.soll_betrag))),
          iban: "", inhaber: "", verwendungszweck: "",
        });
      }
    }
  }
  return { ok: true };
}

// --- Plusstunden ------------------------------------------------------------

export type OffenePlusstunden = {
  schuelerId: string; name: string; anzahl: number;
  stundensatzCent: number; summeCent: number; termine: string[];
  vertragId: string | null; warnung: boolean;
};

/** Offene (noch nicht abgerechnete) Plusstunden je Schüler. */
export async function offenePlusstunden(): Promise<OffenePlusstunden[]> {
  const sb = service();
  const aRes = await sb.from("appointments")
    .select("id,student_id,slot_date")
    .eq("counted", "plus").eq("status", "bestaetigt").is("abrechnung_id", null)
    .order("slot_date");
  const termine = (aRes.data || []) as { id: string; student_id: string; slot_date: string }[];
  if (!termine.length) return [];

  const ids = [...new Set(termine.map((t) => t.student_id))];
  const [pRes, vRes] = await Promise.all([
    sb.from("profiles").select("user_id,name").in("user_id", ids),
    sb.from("vertraege").select("id,schueler_id,stundensatz").in("schueler_id", ids).in("status", ["aktiv", "angeboten"]),
  ]);
  const profile = (pRes.data || []) as { user_id: string; name: string }[];
  const vertraege = (vRes.data || []) as { id: string; schueler_id: string; stundensatz: number }[];

  return ids.map((id) => {
    const eigene = termine.filter((t) => t.student_id === id);
    const v = vertraege.find((x) => x.schueler_id === id);
    const satz = v ? euroZuCent(Number(v.stundensatz)) : 0;
    return {
      schuelerId: id,
      name: profile.find((p) => p.user_id === id)?.name || "Schüler/in",
      anzahl: eigene.length,
      stundensatzCent: satz,
      summeCent: satz * eigene.length,
      termine: eigene.map((t) => t.slot_date),
      vertragId: v?.id ?? null,
      warnung: eigene.length >= 5,   // ab fünf offenen Stunden: Zwischenabrechnung möglich
    };
  }).sort((a, b) => b.anzahl - a.anzahl);
}

/** Offene Plusstunden eines Schülers abrechnen: Abrechnung anlegen und zuordnen. */
export async function plusstundenAbrechnen(schuelerId: string, heute = heuteIso()): Promise<{
  ok: boolean; abrechnungId?: string; anzahl?: number; summeCent?: number; termine?: string[]; error?: string;
}> {
  const sb = service();
  const alle = await offenePlusstunden();
  const eintrag = alle.find((x) => x.schuelerId === schuelerId);
  if (!eintrag || !eintrag.anzahl) return { ok: false, error: "Keine offenen Plusstunden." };
  if (!eintrag.stundensatzCent) return { ok: false, error: "Für diesen Schüler ist kein Stundensatz hinterlegt." };

  const faellig = new Date(Date.UTC(
    Number(heute.slice(0, 4)), Number(heute.slice(5, 7)) - 1, Number(heute.slice(8, 10)) + 14,
  )).toISOString().slice(0, 10);

  const aRes = await sb.from("plusstunden_abrechnungen").insert({
    schueler_id: schuelerId, vertrag_id: eintrag.vertragId,
    anzahl: eintrag.anzahl,
    stundensatz: (eintrag.stundensatzCent / 100).toFixed(2),
    summe: (eintrag.summeCent / 100).toFixed(2),
    faellig_am: faellig,
  }).select().single();
  if (aRes.error || !aRes.data) return { ok: false, error: aRes.error?.message };

  const abrechnungId = (aRes.data as { id: string }).id;
  const zu = await sb.from("appointments").update({ abrechnung_id: abrechnungId })
    .eq("student_id", schuelerId).eq("counted", "plus").eq("status", "bestaetigt").is("abrechnung_id", null);
  if (zu.error) return { ok: false, error: zu.error.message };

  return { ok: true, abrechnungId, anzahl: eintrag.anzahl, summeCent: eintrag.summeCent, termine: eintrag.termine };
}

// --- Jahresbescheinigung ----------------------------------------------------

export type BescheinigungDaten = {
  schuelerName: string; schuljahrName: string;
  posten: { datum: string; betragCent: number }[];
  summeCent: number;
};

/** Alle als bezahlt vermerkten Zahlungen eines Vertrags zusammenstellen. */
export async function bescheinigungDaten(vertragId: string): Promise<BescheinigungDaten | null> {
  const sb = service();
  const geladen = await ladeVertrag(vertragId);
  if (!geladen) return null;

  const [zRes, pRes, sjRes] = await Promise.all([
    sb.from("zahlungen").select("*").eq("vertrag_id", vertragId).not("bezahlt_am", "is", null).order("bezahlt_am"),
    sb.from("profiles").select("name").eq("user_id", geladen.vertrag.schueler_id).single(),
    sb.from("schuljahre").select("name").eq("id", geladen.vertrag.schuljahr_id).single(),
  ]);

  const zahlungen = (zRes.data || []) as Zahlung[];
  const posten = zahlungen.map((z) => ({
    datum: z.bezahlt_am as string,
    betragCent: euroZuCent(Number(z.soll_betrag)),
  }));
  return {
    schuelerName: (pRes.data as { name: string } | null)?.name || "Schüler/in",
    schuljahrName: (sjRes.data as { name: string } | null)?.name || "",
    posten,
    summeCent: posten.reduce((s, p) => s + p.betragCent, 0),
  };
}

export { status, datumDe, centFormat };
export type { Status };
