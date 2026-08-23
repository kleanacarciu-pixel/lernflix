// =============================================================================
// Schuljahresmodell – reine Terminberechnung (ohne Datenbank)
//
// Bewusst frei von Abhängigkeiten: dadurch schnell und ohne Supabase testbar.
// Der Datenbank-Teil liegt in lib/schuljahr.ts.
//
// Wochentage: 0=Mo, 1=Di, 2=Mi, 3=Do, 4=Fr, 5=Sa, 6=So – wie in fixed_slots.
// Alle Daten sind ISO-Strings ("2026-09-15"); gerechnet wird in UTC, damit
// Sommerzeit-Wechsel keine Termine verschieben können.
// =============================================================================

export type FreierZeitraum = {
  datum_von: string;
  datum_bis: string;
  ist_feiertag: boolean;
  schule_id: string | null;
  bezeichnung?: string;
};

const pad = (n: number) => String(n).padStart(2, "0");

/** Wochentag eines ISO-Datums: 0=Mo .. 6=So */
export function wochentagVon(iso: string): number {
  const [j, m, t] = iso.split("-").map(Number);
  return (new Date(Date.UTC(j, m - 1, t)).getUTCDay() + 6) % 7;
}

/** ISO-Datum um n Tage verschieben */
export function plusTage(iso: string, n: number): string {
  const [j, m, t] = iso.split("-").map(Number);
  const d = new Date(Date.UTC(j, m - 1, t) + n * 86400000);
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
}

/**
 * Welche freien Zeiträume gelten für diesen Schüler?
 *
 *  * Ohne Schule: bayerischer Standardkalender (schule_id = null) – dazu
 *    gehören auch die gesetzlichen Feiertage.
 *  * Mit Schule: die Ferien DIESER Schule ERSETZEN die bayerischen Schul-
 *    ferien. Gesetzliche Feiertage gelten trotzdem immer zusätzlich, denn
 *    an ihnen wird generell nicht unterrichtet.
 */
export function relevanteFreieTage<T extends FreierZeitraum>(alle: T[], schuleId?: string | null): T[] {
  if (!schuleId) return alle.filter((f) => f.schule_id === null);
  return alle.filter((f) => f.ist_feiertag || f.schule_id === schuleId);
}

/** Liegt das Datum in einem der Zeiträume? (beide Grenzen einschließlich) */
export function istFrei(iso: string, frei: FreierZeitraum[]): boolean {
  return frei.some((f) => iso >= f.datum_von && iso <= f.datum_bis);
}

/**
 * Alle Termine eines Wochentags im Schuljahr – ohne unterrichtsfreie Tage.
 * Beginn ist der spätere von erstem Schultag und abDatum.
 */
export function termineImZeitraum(opt: {
  erster: string;
  letzter: string;
  wochentag: number;
  frei: FreierZeitraum[];
  abDatum?: string | null;
}): string[] {
  const { erster, letzter, wochentag, frei, abDatum } = opt;
  if (wochentag < 0 || wochentag > 6) return [];

  const start = abDatum && abDatum > erster ? abDatum : erster;
  if (start > letzter) return [];

  // Auf den ersten passenden Wochentag ab Start vorrücken, dann in 7er-Schritten
  const versatz = (wochentag - wochentagVon(start) + 7) % 7;
  const termine: string[] = [];
  for (let d = plusTage(start, versatz); d <= letzter; d = plusTage(d, 7)) {
    if (!istFrei(d, frei)) termine.push(d);
  }
  return termine;
}

// --- Anzeige ----------------------------------------------------------------

export const WOCHENTAGE = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"] as const;

/** "2026-09-15" -> "15.09.2026" */
export function datumDe(iso: string): string {
  const [j, m, t] = iso.split("-");
  return t && m && j ? `${t}.${m}.${j}` : iso;
}
