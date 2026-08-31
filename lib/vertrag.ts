// =============================================================================
// Schuljahresmodell – Verträge (serverseitig)
//
// Verbindet die Termin-Engine (lib/schuljahr.ts) mit der Preisberechnung
// (lib/vertrag-kern.ts): aus Wochentermin(en) und Stundensatz entstehen
// Jahresbetrag, Ratenplan und Einmalbetrag.
// =============================================================================
import { service } from "@/lib/kalender";
import { berechneTermine, type Schuljahr } from "@/lib/schuljahr";
import {
  berechneJahresbetrag, ratenplan, einmalbetragCent, euroZuCent, centFormat,
  ZWEIT_ABSCHLAG_CENT, darfBuchen, type Ratenplan, type Zahlweise, type TerminTag, type Posten,
} from "@/lib/vertrag-kern";

export type VertragStatus = "angeboten" | "aktiv" | "gekuendigt" | "beendet";

export type Vertrag = {
  id: string;
  schueler_id: string;
  schuljahr_id: string;
  schule_id: string | null;
  stundensatz: number;              // Euro
  stundensatz_zweittermin: number;  // Euro
  zweites_kind: boolean;
  vertragsbeginn: string;
  zahlweise: Zahlweise;
  jahresbetrag: number;             // Euro
  agb_akzeptiert_am: string | null;
  status: VertragStatus;
  kuendigung_zum: string | null;
  /** Mahn-Automatik für diesen Vertrag ausgesetzt (Abschnitt 6). */
  mahn_automatik_pausiert?: boolean;
  mahn_notiz?: string | null;
  /** Erziehungsberechtigte – stehen so im Vertrag (alle optional). */
  eltern_name?: string | null;
  eltern_anschrift?: string | null;
  eltern_email?: string | null;
  eltern_telefon?: string | null;
  /** Unterzeichnung im Portal (Abschnitt „Vertragsabschluss“). */
  eltern_unterschrift?: string | null;
  unterzeichnet_am?: string | null;
  agb_bestaetigt_am?: string | null;
  widerruf_bestaetigt_am?: string | null;
  eingeladen_am?: string | null;
  erinnert_am?: string | null;
  externe_unterschrift?: string | null;
  manuell_aktiviert_am?: string | null;
  erstellt_am?: string | null;
};

export type VertragZeit = {
  id: string;
  vertrag_id: string;
  wochentag: number;
  uhrzeit: string;
  ab_datum: string | null;
  bis_datum: string | null;
};

/** Vorschlag für den Zweitsatz, wenn nichts anderes angegeben ist. */
export function standardZweitsatzCent(stundensatzCent: number): number {
  return Math.max(0, stundensatzCent - ZWEIT_ABSCHLAG_CENT);
}

export type Vertragsrechnung = {
  tage: (TerminTag & { uhrzeit?: string })[];
  jahresbetragCent: number;
  posten: Posten[];
  raten: Ratenplan;
  einmalCent: number;
  /** Alle Termine des Vertrags, aufsteigend – Grundlage der Terminliste. */
  alleTermine: string[];
  /** Monate mit Familienpreis ("YYYY-MM") – für die Anzeige. */
  familienMonate: string[];
};

/**
 * Rechnet einen Vertrag durch: Termine je Wochentag, Jahresbetrag, Raten.
 *
 * Zeiten mit ab_datum/bis_datum werden berücksichtigt, damit ein
 * Wochentagswechsel (Abschnitt 5) korrekt zusammengesetzt wird.
 */
export async function rechneVertrag(opt: {
  schuljahr: Schuljahr;
  zeiten: { wochentag: number; uhrzeit?: string; ab_datum?: string | null; bis_datum?: string | null }[];
  stundensatzCent: number;
  stundensatzZweitCent: number;
  zweitesKind?: boolean;
  vertragsbeginn: string;
  schuleId?: string | null;
}): Promise<Vertragsrechnung> {
  const { schuljahr, zeiten, stundensatzCent, stundensatzZweitCent, zweitesKind, vertragsbeginn, schuleId } = opt;

  const tage: Vertragsrechnung["tage"] = [];
  for (const z of zeiten) {
    // Beginn: der späteste von Vertragsbeginn und ab_datum dieser Zeile
    const ab = [vertragsbeginn, z.ab_datum].filter(Boolean).sort().pop() as string;
    let termine = await berechneTermine(schuljahr.id, z.wochentag, ab, schuleId);
    if (z.bis_datum) termine = termine.filter((d) => d <= (z.bis_datum as string));
    // Geltungszeitraum des Wochentermins – daran haengt der Familienpreis.
    tage.push({
      wochentag: z.wochentag, uhrzeit: z.uhrzeit, termine,
      ab, bis: z.bis_datum || schuljahr.letzter_schultag,
    });
  }

  const preis = berechneJahresbetrag({
    tage: tage.map((t) => ({ wochentag: t.wochentag, termine: t.termine, ab: t.ab, bis: t.bis })),
    stundensatzCent, stundensatzZweitCent, zweitesKind,
  });

  // Enden ALLE Wochentermine früher (Vertrag mit festem Enddatum, z. B. ein
  // Abiturient), laufen auch die Raten nur bis zu diesem Monat – die Familie
  // soll nicht bis Juli zahlen, wenn der Unterricht im April endet. Solange
  // auch nur eine Zeile bis zum Schuljahresende läuft, bleibt alles wie gehabt.
  const spaetestesEnde = tage.map((t) => t.bis).sort().pop() || schuljahr.letzter_schultag;
  const ratenEnde = spaetestesEnde < schuljahr.letzter_schultag ? spaetestesEnde : schuljahr.letzter_schultag;

  return {
    tage,
    jahresbetragCent: preis.jahresbetragCent,
    posten: preis.posten,
    raten: ratenplan({
      jahresbetragCent: preis.jahresbetragCent,
      vertragsbeginn,
      letzterSchultag: ratenEnde,
    }),
    einmalCent: einmalbetragCent(preis.jahresbetragCent),
    alleTermine: tage.flatMap((t) => t.termine).sort(),
    familienMonate: preis.familienMonate,
  };
}

/** Vertrag samt Zeiten laden. */
export async function ladeVertrag(vertragId: string): Promise<{ vertrag: Vertrag; zeiten: VertragZeit[] } | null> {
  const sb = service();
  const [vRes, zRes] = await Promise.all([
    sb.from("vertraege").select("*").eq("id", vertragId).single(),
    sb.from("vertrag_zeiten").select("*").eq("vertrag_id", vertragId).order("wochentag"),
  ]);
  if (vRes.error || !vRes.data) return null;
  return { vertrag: vRes.data as Vertrag, zeiten: (zRes.data || []) as VertragZeit[] };
}

/** Laufender Vertrag eines Schülers (angeboten oder aktiv), sonst null. */
export async function laufenderVertrag(schuelerId: string): Promise<Vertrag | null> {
  const sb = service();
  const res = await sb
    .from("vertraege").select("*")
    .eq("schueler_id", schuelerId)
    .in("status", ["angeboten", "aktiv"])
    .maybeSingle();
  return res.error ? null : ((res.data as Vertrag | null) ?? null);
}

/**
 * Harte Sperre aus Abschnitt 4: Ohne bestätigte AGB darf für diesen Schüler
 * nicht gebucht werden. Ohne laufenden Vertrag greift die Sperre nicht –
 * Probestunden und Schüler ohne Schuljahresvertrag bleiben wie bisher möglich.
 */
export async function buchungErlaubt(schuelerId: string): Promise<{ erlaubt: boolean; grund?: string }> {
  return darfBuchen(await laufenderVertrag(schuelerId));
}

export { euroZuCent, centFormat };
