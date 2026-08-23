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
  ZWEIT_ABSCHLAG_CENT, type Ratenplan, type Zahlweise, type TerminTag,
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
  tage: (TerminTag & { uhrzeit?: string; termine: string[] })[];
  jahresbetragCent: number;
  posten: { wochentag: number; anzahl: number; satzCent: number; summeCent: number; voll: boolean }[];
  raten: Ratenplan;
  einmalCent: number;
  /** Alle Termine des Vertrags, aufsteigend – Grundlage der Terminliste. */
  alleTermine: string[];
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
    tage.push({ wochentag: z.wochentag, uhrzeit: z.uhrzeit, anzahl: termine.length, termine });
  }

  const preis = berechneJahresbetrag({
    tage: tage.map((t) => ({ wochentag: t.wochentag, anzahl: t.anzahl })),
    stundensatzCent, stundensatzZweitCent, zweitesKind,
  });

  return {
    tage,
    jahresbetragCent: preis.jahresbetragCent,
    posten: preis.posten,
    raten: ratenplan({
      jahresbetragCent: preis.jahresbetragCent,
      vertragsbeginn,
      letzterSchultag: schuljahr.letzter_schultag,
    }),
    einmalCent: einmalbetragCent(preis.jahresbetragCent),
    alleTermine: tage.flatMap((t) => t.termine).sort(),
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
  const v = await laufenderVertrag(schuelerId);
  if (!v) return { erlaubt: true };
  if (!v.agb_akzeptiert_am) {
    return { erlaubt: false, grund: "Bitte bestätige zuerst den Vertrag und die AGB." };
  }
  return { erlaubt: true };
}

export { euroZuCent, centFormat };
