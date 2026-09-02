// =============================================================================
// Schuljahresmodell – Kündigung und Endabrechnung (serverseitig)
//
// Die Regeln stehen in lib/kuendigung-kern.ts (ohne Datenbank, dadurch
// testbar); hier kommen Laden, Speichern und der fertige E-Mail-Text dazu.
//
// Es entsteht keine neue Tabelle: `vertraege.kuendigung_zum` und der Status
// 'gekuendigt' sind seit Abschnitt 3 vorhanden.
// =============================================================================
import { service, NOTE_ANNA_CANCEL } from "@/lib/kalender";
import { ladeVertrag, rechneVertrag } from "@/lib/vertrag";
import { euroZuCent, centFormat } from "@/lib/vertrag-kern";
import { datumDe } from "@/lib/schuljahr-kern";
import type { Schuljahr } from "@/lib/schuljahr";
import { giltAlsBezahlt } from "@/lib/zahlung-kern";
import { ladeZahlungen, heuteIso, type Zahlung } from "@/lib/zahlung";
import {
  endabrechnung, pruefeKuendigung, monatsEnde, abrechnungsText as textBauen,
  type Endabrechnung, type Absage, type Vertragstermin, type Fristpruefung,
} from "@/lib/kuendigung-kern";
import { bankverbindung } from "@/lib/vertrag-dokumente";

/** Warum ein Vertragstermin nicht stattgefunden hat – für die Anzeige. */
const GRUND_TEXT: Record<string, string> = {
  anna_cancel: "von Anna abgesagt",
  gutschrift: "rechtzeitig abgesagt",
  late: "weniger als 4 Std. vorher abgesagt",
  overmax: "abgesagt, Minus-Konto war voll",
};

export type Abrechnungsbild = Endabrechnung & {
  schuelerName: string;
  schuelerEmail: string | null;
  schuljahrName: string;
  zahlweise: "raten" | "einmal";
  jahresbetragCent: number;
  /** Termine des Vertrags nach dem Vertragsende – entfallen ersatzlos. */
  entfallenNachEnde: number;
  /** Erläuterung je abgesagtem Termin, Datum -> Text. */
  gruende: Record<string, string>;
  frist: Fristpruefung;
};

/**
 * Endabrechnung eines Vertrags zu einem gewünschten Enddatum.
 * Rechnet nur – gespeichert wird nichts. Dadurch taugt dieselbe Funktion
 * für die Vorschau vor der Kündigung und für die Abrechnung danach.
 */
export async function abrechnungsbild(
  vertragId: string,
  bisDatum: string,
  heute = heuteIso(),
): Promise<Abrechnungsbild | null> {
  const sb = service();
  const geladen = await ladeVertrag(vertragId);
  if (!geladen) return null;
  const { vertrag, zeiten } = geladen;

  const sjRes = await sb.from("schuljahre")
    .select("id,name,erster_schultag,letzter_schultag,aktiv").eq("id", vertrag.schuljahr_id).single();
  if (sjRes.error || !sjRes.data) return null;
  const schuljahr = sjRes.data as Schuljahr;

  const satzCent = euroZuCent(Number(vertrag.stundensatz));
  const r = await rechneVertrag({
    schuljahr,
    zeiten: zeiten.map((z) => ({ wochentag: z.wochentag, uhrzeit: z.uhrzeit, ab_datum: z.ab_datum, bis_datum: z.bis_datum })),
    stundensatzCent: satzCent,
    stundensatzZweitCent: euroZuCent(Number(vertrag.stundensatz_zweittermin)),
    zweitesKind: vertrag.zweites_kind,
    vertragsbeginn: vertrag.vertragsbeginn,
    schuleId: vertrag.schule_id,
  });

  // Jeden Termin mit dem Satz seines Wochentags UND Zeitraums versehen: ein
  // Wochentag kann ZWEI Posten haben (ermäßigt, solange der Familienpreis
  // galt, danach regulär). Eine Map nur je Wochentag verlor den ermäßigten
  // Satz – die Endabrechnung bewertete Familienpreis-Stunden dann zu teuer.
  const satzFuer = (wochentag: number, datum: string): number => {
    const p = r.posten.find((x) => x.wochentag === wochentag && datum >= x.von && datum <= x.bis);
    return p?.satzCent ?? satzCent;
  };
  const termine: Vertragstermin[] = r.tage.flatMap((t) =>
    t.termine.map((d) => ({ datum: d, satzCent: satzFuer(t.wochentag, d) })),
  ).sort((a, b) => a.datum.localeCompare(b.datum));

  // Absagen und noch nicht abgerechnete Zusatzstunden dieses Schülers
  const [absRes, plusRes, pRes] = await Promise.all([
    sb.from("appointments").select("slot_date,credited,note")
      .eq("student_id", vertrag.schueler_id).eq("kind", "absage"),
    sb.from("appointments").select("slot_date")
      .eq("student_id", vertrag.schueler_id).eq("counted", "plus")
      .eq("status", "bestaetigt").is("abrechnung_id", null),
    sb.from("profiles").select("name,email").eq("user_id", vertrag.schueler_id).single(),
  ]);

  const gruende: Record<string, string> = {};
  const absagen: Absage[] = ((absRes.data || []) as { slot_date: string; credited: boolean; note: string | null }[])
    .map((a) => {
      const annaAbsage = a.note === NOTE_ANNA_CANCEL;
      // Gutgeschrieben oder von Anna abgesagt: die Stunde ist nicht verbraucht.
      // Kurzfristig abgesagt (oder Minus-Konto voll): sie zählt wie gehalten.
      const art: Absage["art"] = annaAbsage || a.credited ? "gutschrift" : "kurzfristig";
      gruende[a.slot_date] = GRUND_TEXT[annaAbsage ? "anna_cancel" : a.credited ? "gutschrift" : (a.note || "late")]
        ?? GRUND_TEXT.late;
      return { datum: a.slot_date, art };
    });

  const zusatzstunden: Vertragstermin[] = ((plusRes.data || []) as { slot_date: string }[])
    .map((p) => ({ datum: p.slot_date, satzCent }))
    .sort((a, b) => a.datum.localeCompare(b.datum));

  // Eingegangene Zahlungen nach der Umkehrlogik aus Abschnitt 6
  const zahlungen = await ladeZahlungen(vertragId);
  const gezahltCent = zahlungen
    .filter((z: Zahlung) => giltAlsBezahlt(z, heute))
    .reduce((s: number, z: Zahlung) => s + euroZuCent(Number(z.soll_betrag)), 0);

  const kern = endabrechnung({
    termine, absagen, zusatzstunden, bisDatum: bisDatum,
    gezahltCent, einmalzahlung: vertrag.zahlweise === "einmal",
  });

  const prof = pRes.data as { name: string; email: string | null } | null;
  return {
    ...kern,
    schuelerName: prof?.name || "Schüler/in",
    schuelerEmail: prof?.email ?? null,
    schuljahrName: schuljahr.name,
    zahlweise: vertrag.zahlweise,
    jahresbetragCent: r.jahresbetragCent,
    entfallenNachEnde: termine.filter((t) => t.datum > bisDatum).length,
    gruende,
    frist: pruefeKuendigung(heute, bisDatum),
  };
}

/**
 * Vertrag kündigen. Die Frist wird geprüft, aber nicht erzwungen – Kleana
 * darf sich bewusst anders entscheiden. Die Hinweise kommen mit zurück.
 */
export async function kuendigen(vertragId: string, zum: string, heute = heuteIso()): Promise<{
  ok: boolean; frist?: Fristpruefung; error?: string;
}> {
  const sb = service();
  const frist = pruefeKuendigung(heute, zum);
  const up = await sb.from("vertraege")
    .update({ status: "gekuendigt", kuendigung_zum: zum, geaendert_am: new Date().toISOString() })
    .eq("id", vertragId).select().single();
  if (up.error || !up.data) return { ok: false, error: up.error?.message || "Die Kündigung ließ sich nicht speichern." };
  return { ok: true, frist };
}

/** Kündigung zurücknehmen – der Vertrag läuft wieder normal. */
export async function kuendigungZuruecknehmen(vertragId: string): Promise<{ ok: boolean; error?: string }> {
  const res = await service().from("vertraege")
    .update({ status: "aktiv", kuendigung_zum: null, geaendert_am: new Date().toISOString() })
    .eq("id", vertragId);
  return res.error ? { ok: false, error: res.error.message } : { ok: true };
}

/** Vertrag endgültig auf 'beendet' setzen, wenn die Endabrechnung erledigt ist. */
export async function alsBeendetMarkieren(vertragId: string): Promise<{ ok: boolean; error?: string }> {
  const res = await service().from("vertraege")
    .update({ status: "beendet", geaendert_am: new Date().toISOString() })
    .eq("id", vertragId);
  return res.error ? { ok: false, error: res.error.message } : { ok: true };
}

// --- Text für die E-Mail ----------------------------------------------------

/** Fertiger Text zum Kopieren – die Formulierung steht in kuendigung-kern.ts. */
export function abrechnungsText(a: Abrechnungsbild): string {
  return textBauen(a, {
    schuelerName: a.schuelerName,
    schuljahrName: a.schuljahrName,
    bank: bankverbindung(),
  });
}

export { monatsEnde, pruefeKuendigung, centFormat, datumDe };
export type { Endabrechnung, Fristpruefung };
