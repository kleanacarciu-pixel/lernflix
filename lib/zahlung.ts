// =============================================================================
// Schuljahresmodell – Zahlungen, Mahnwesen und Plusstunden (serverseitig)
//
// Die Regeln stehen in lib/zahlung-kern.ts (ohne Datenbank, dadurch testbar);
// hier kommen Laden, Speichern und der E-Mail-Versand dazu.
// =============================================================================
import { fuelle, alsHtml } from "@/lib/mail-text-kern";
import { STANDARD_VORLAGEN, standardVorlage } from "@/lib/vorlagen-standard";
import { service, mailZustellenOderMelden, ADMIN_EMAIL, type MailAnhang } from "@/lib/kalender";
import { ladeVertrag, rechneVertrag, buchungErlaubt, laufenderVertrag, type Vertrag } from "@/lib/vertrag";
import { euroZuCent, centFormat } from "@/lib/vertrag-kern";
import { datumDe } from "@/lib/schuljahr-kern";
import type { Schuljahr } from "@/lib/schuljahr";
import {
  status, faelligeAktionen, zahlungsSperre, terminFindetStatt, pausierungAb,
  giltAlsBezahlt, bezahltAm, istBankCheckTag,
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
  // laufenderVertrag statt eigener maybeSingle-Abfrage: am Schuljahreswechsel
  // existieren kurz ZWEI laufende Verträge, und maybeSingle ließ die Sperre
  // dann still ins Leere laufen (fail open).
  const vertrag = await laufenderVertrag(schuelerId);
  if (!vertrag) return { gesperrt: false, regelterminAusgesetzt: false, pausiertAm: null };

  const zahlungen = await ladeZahlungen(vertrag.id);
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

// Weiterhin von hier aus nutzbar – die Umsetzung liegt in mail-text-kern.
export { fuelle };

/**
 * Alle Vorlagen – aus der Datenbank, ergänzt um die Standardtexte.
 *
 * So stehen die Vertrags-E-Mails auch dann zur Verfügung, wenn die passende
 * SQL-Datei nie ausgeführt wurde. Ein eigener Text in der Datenbank hat immer
 * Vorrang; gespeichert wird beim ersten Ändern.
 */
export async function ladeVorlagen(): Promise<Vorlage[]> {
  const res = await service().from("mahn_vorlagen").select("*").order("schluessel");
  const ausDb = (res.data || []) as Vorlage[];
  const fehlend = STANDARD_VORLAGEN.filter((s) => !ausDb.some((v) => v.schluessel === s.schluessel));
  return [...ausDb, ...fehlend].sort((a, b) => a.schluessel.localeCompare(b.schluessel));
}


const MONATSNAMEN = ["Januar", "Februar", "März", "April", "Mai", "Juni",
  "Juli", "August", "September", "Oktober", "November", "Dezember"];
export function monatName(iso: string): string {
  const [j, m] = iso.split("-");
  return `${MONATSNAMEN[Number(m) - 1]} ${j}`;
}


/**
 * Eine Vorlage verschicken. Öffentlich, damit auch der Vertragsteil sie
 * nutzen kann (z. B. das Ende eines Familientermins).
 *
 * Die Kopie an die Admin-Adresse ist der Normalfall, aber NICHT immer richtig:
 * Enthält eine Nachricht den Unterschriftslink, darf sie ausschließlich an die
 * Familie gehen – sonst könnte der Vertrag aus Kleanas Postfach heraus
 * unterschrieben werden. Solche Vorlagen setzen kopieAnAdmin auf false.
 */
export async function vorlageSenden(
  schluessel: string, an: string, werte: Record<string, string>,
  anhaenge?: MailAnhang[], opt?: { kopieAnAdmin?: boolean },
): Promise<{ ok: boolean; error?: string }> {
  const res = await service().from("mahn_vorlagen").select("*").eq("schluessel", schluessel).maybeSingle();
  // Steht in der Datenbank nichts, greift der Standardtext aus dem Programm.
  // Erst wenn es auch den nicht gibt, ging wirklich keine E-Mail raus – und
  // das muss der Aufrufer erfahren, sonst meldet die Oberfläche einen Versand,
  // den es nie gab.
  const v = (res.data as Vorlage | null) ?? standardVorlage(schluessel);
  if (!v) return { ok: false, error: `Für „${schluessel}" gibt es keinen E-Mail-Text.` };

  const kopie = opt?.kopieAnAdmin === false || an === ADMIN_EMAIL ? undefined : ADMIN_EMAIL;
  // Fehlschläge nie lautlos verschlucken: geht die Mail an eine Familie und
  // scheitert, bekommt Kleana automatisch eine Warnmail (zentral geregelt).
  return mailZustellenOderMelden(fuelle(v.betreff, werte), an,
    fuelle(v.betreff, werte), alsHtml(fuelle(v.text, werte)),
    { kopieAn: kopie, anhaenge });
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
  let erinnerungen = 0, pausierungen = 0;

  // Tag 9: Bank-Check-Erinnerung an Kleana – nur wenn es überhaupt Verträge gibt
  let adminHinweis = false;
  if (istBankCheckTag(heute)) {
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

// --- Stunden vor Vertragsbeginn ---------------------------------------------

export type VorvertragStunde = {
  schuelerId: string; name: string; datum: string;
  /** Startzeit in Minuten seit Mitternacht (Europe/Berlin). */
  minuten: number; mode: string | null; dauerMin: number;
};

/** Datum und Uhrzeit einer Stunde in Europe/Berlin zerlegen. */
function berlinTeile(iso: string): { datum: string; minuten: number } {
  const d = new Date(iso);
  const datum = d.toLocaleDateString("en-CA", { timeZone: "Europe/Berlin" });
  const [h, m] = new Intl.DateTimeFormat("de-DE", {
    timeZone: "Europe/Berlin", hour: "2-digit", minute: "2-digit", hour12: false,
  }).format(d).split(":").map(Number);
  return { datum, minuten: h * 60 + m };
}

/**
 * Gehaltene Stunden VOR dem ersten Vertragstermin.
 *
 * Beginnt ein Vertrag später im Monat (erste Stunde z. B. am 16.09.), läuft
 * der feste Wochentermin im Kalender oft schon vorher. Solche Stunden stehen
 * weder in der Vertrags-Terminliste noch zählen sie als Plus – sie würden
 * ohne diesen Sammler NIE abgerechnet. Kleana übernimmt sie per Klick als
 * Plusstunde; bewusst KEIN Automatismus, denn ein fester Termin, der vor
 * Vertragsbeginn gar nicht stattfand, darf nicht versehentlich in einer
 * Abrechnung landen.
 */
export async function vorvertraglicheStunden(): Promise<VorvertragStunde[]> {
  const sb = service();
  const vRes = await sb.from("vertraege")
    .select("id,schueler_id,vertragsbeginn")
    .in("status", ["aktiv", "angeboten"]);
  const vertraege = (vRes.data || []) as { id: string; schueler_id: string; vertragsbeginn: string }[];
  if (!vertraege.length) return [];
  const zRes = await sb.from("vertrag_zeiten")
    .select("vertrag_id,ab_datum").in("vertrag_id", vertraege.map((v) => v.id));
  const zeiten = (zRes.data || []) as { vertrag_id: string; ab_datum: string | null }[];

  // Fenster je Schüler: ab Vertragsbeginn (Monatserster) bis zum frühesten
  // Geltungstag der Wochentermine – erst ab dem deckt der Vertrag die
  // Stunden ab. ab_datum leer heißt: beginnt am Monatsersten, kein Fenster.
  const fenster = new Map<string, { von: string; bis: string }>();
  for (const v of vertraege) {
    const eigene = zeiten.filter((z) => z.vertrag_id === v.id).map((z) => z.ab_datum);
    if (!eigene.length || eigene.some((a) => !a)) continue;
    const bis = (eigene as string[]).sort()[0];
    if (bis <= v.vertragsbeginn) continue;
    fenster.set(v.schueler_id, { von: v.vertragsbeginn, bis });
  }
  if (!fenster.size) return [];

  const ids = [...fenster.keys()];
  const frueheste = [...fenster.values()].map((f) => f.von).sort()[0];
  const [lRes, aRes, pRes] = await Promise.all([
    // Gehaltene Stunden: bereits zu Ende, im Klassenzimmer materialisiert
    sb.from("lessons").select("student_id,starts_at,ends_at,mode,kind")
      .in("student_id", ids)
      .gte("starts_at", `${frueheste}T00:00:00Z`)
      .lte("ends_at", new Date().toISOString()),
    // Alles, was schon als Buchung/Absage erfasst ist, zählt nicht doppelt
    sb.from("appointments").select("student_id,slot_date,hour")
      .in("student_id", ids).gte("slot_date", frueheste),
    sb.from("profiles").select("user_id,name").in("user_id", ids),
  ]);
  const namen = new Map(((pRes.data || []) as { user_id: string; name: string }[])
    .map((p) => [p.user_id, p.name]));
  const erfasst = new Set(((aRes.data || []) as { student_id: string; slot_date: string; hour: number }[])
    .map((a) => `${a.student_id}|${a.slot_date}|${Math.round(Number(a.hour) * 60)}`));

  const offen: VorvertragStunde[] = [];
  for (const l of (lRes.data || []) as { student_id: string; starts_at: string; ends_at: string; mode: string | null; kind: string | null }[]) {
    if (l.kind === "webinar") continue;
    const f = fenster.get(l.student_id);
    if (!f) continue;
    const { datum, minuten } = berlinTeile(l.starts_at);
    if (datum < f.von || datum >= f.bis) continue;
    if (erfasst.has(`${l.student_id}|${datum}|${minuten}`)) continue;
    const dauerMin = Math.max(30, Math.round((Date.parse(l.ends_at) - Date.parse(l.starts_at)) / 60000));
    offen.push({
      schuelerId: l.student_id, name: namen.get(l.student_id) || "Schüler/in",
      datum, minuten, mode: l.mode, dauerMin,
    });
  }
  return offen.sort((a, b) => a.name.localeCompare(b.name) || a.datum.localeCompare(b.datum));
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
    sb.from("zahlungen").select("*").eq("vertrag_id", vertragId).order("monat"),
    sb.from("profiles").select("name").eq("user_id", geladen.vertrag.schueler_id).single(),
    sb.from("schuljahre").select("name").eq("id", geladen.vertrag.schuljahr_id).single(),
  ]);

  // Umkehrlogik: bescheinigt wird alles, was nicht als fehlend markiert ist
  // und dessen Zahlungsfenster vorbei ist – nicht nur die abgehakten Zeilen.
  const heute = heuteIso();
  const zahlungen = ((zRes.data || []) as Zahlung[]).filter((z) => giltAlsBezahlt(z, heute));
  const posten = zahlungen.map((z) => ({
    datum: bezahltAm(z),
    betragCent: euroZuCent(Number(z.soll_betrag)),
  })).sort((a, b) => a.datum.localeCompare(b.datum));
  return {
    schuelerName: (pRes.data as { name: string } | null)?.name || "Schüler/in",
    schuljahrName: (sjRes.data as { name: string } | null)?.name || "",
    posten,
    summeCent: posten.reduce((s, p) => s + p.betragCent, 0),
  };
}

export { status, datumDe, centFormat };
export type { Status };
