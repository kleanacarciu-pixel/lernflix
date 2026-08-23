// =============================================================================
// Schuljahresmodell – Termin-Engine (serverseitig)
//
// Liefert die konkreten Unterrichtstermine eines Wochentags im Schuljahr.
// Die eigentliche Rechnung steht in lib/schuljahr-kern.ts (ohne Datenbank,
// dadurch testbar); hier kommen nur das Laden der Stammdaten und ein kleiner
// Cache dazu.
// =============================================================================
import { service } from "@/lib/kalender";
import {
  termineImZeitraum, relevanteFreieTage, wochentagVon, datumDe, WOCHENTAGE,
  type FreierZeitraum,
} from "@/lib/schuljahr-kern";

export { wochentagVon, datumDe, WOCHENTAGE };
export type { FreierZeitraum };

export type Schuljahr = {
  id: string;
  name: string;
  erster_schultag: string;
  letzter_schultag: string;
  aktiv: boolean;
};

// Stammdaten ändern sich fast nie – kurz im Speicher halten, damit die
// Terminliste eines Vertrags nicht bei jedem Aufruf neu geladen wird.
const CACHE_MS = 60_000;
type Eintrag = { zeit: number; schuljahr: Schuljahr; frei: FreierZeitraum[] };
const cache = new Map<string, Eintrag>();

export function cacheLeeren(): void { cache.clear(); }

async function stammdaten(schuljahrId: string): Promise<Eintrag | null> {
  const alt = cache.get(schuljahrId);
  if (alt && Date.now() - alt.zeit < CACHE_MS) return alt;

  const sb = service();
  const [sjRes, ftRes] = await Promise.all([
    sb.from("schuljahre").select("id,name,erster_schultag,letzter_schultag,aktiv").eq("id", schuljahrId).single(),
    sb.from("unterrichtsfreie_tage").select("datum_von,datum_bis,ist_feiertag,schule_id,bezeichnung").eq("schuljahr_id", schuljahrId),
  ]);
  if (sjRes.error || !sjRes.data) return null;

  const eintrag: Eintrag = {
    zeit: Date.now(),
    schuljahr: sjRes.data as Schuljahr,
    frei: (ftRes.data || []) as FreierZeitraum[],
  };
  cache.set(schuljahrId, eintrag);
  return eintrag;
}

/** Das aktuell aktive Schuljahr (oder null, wenn keines gesetzt ist). */
export async function aktivesSchuljahr(): Promise<Schuljahr | null> {
  const sb = service();
  const res = await sb
    .from("schuljahre")
    .select("id,name,erster_schultag,letzter_schultag,aktiv")
    .eq("aktiv", true)
    .maybeSingle();
  return res.error ? null : ((res.data as Schuljahr | null) ?? null);
}

/**
 * Alle Unterrichtstermine eines Wochentags im Schuljahr.
 *
 * @param schuljahrId  Schuljahr aus der Tabelle `schuljahre`
 * @param wochentag    0=Mo .. 6=So (wie in fixed_slots)
 * @param abDatum      optionaler Quereinstieg; es gilt der spätere von
 *                     erstem Schultag und abDatum
 * @param schuleId     optionale Schule mit eigenen Ferien; deren Ferien
 *                     ersetzen die bayerischen, Feiertage gelten weiterhin
 * @returns            ISO-Daten, aufsteigend; leer bei unbekanntem Schuljahr
 */
export async function berechneTermine(
  schuljahrId: string,
  wochentag: number,
  abDatum?: string | null,
  schuleId?: string | null,
): Promise<string[]> {
  const daten = await stammdaten(schuljahrId);
  if (!daten) return [];
  return termineImZeitraum({
    erster: daten.schuljahr.erster_schultag,
    letzter: daten.schuljahr.letzter_schultag,
    wochentag,
    frei: relevanteFreieTage(daten.frei, schuleId),
    abDatum,
  });
}

/** Nur die Anzahl – für die Preisberechnung (Abschnitt 3). */
export async function anzahlTermine(
  schuljahrId: string,
  wochentag: number,
  abDatum?: string | null,
  schuleId?: string | null,
): Promise<number> {
  return (await berechneTermine(schuljahrId, wochentag, abDatum, schuleId)).length;
}
