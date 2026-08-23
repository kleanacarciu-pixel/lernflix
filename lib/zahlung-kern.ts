// =============================================================================
// Schuljahresmodell – Zahlungsstatus und Mahn-Automatik (ohne Datenbank)
//
// UMKEHRLOGIK: Standardannahme ist „bezahlt". Kleana hakt nicht jeden Monat
// alle Zahler ab, sondern markiert nur die Verträge, deren Rate FEHLT. Eine
// Zahlung gilt daher als offen, sobald `offen_seit` gesetzt ist – und wieder
// als bezahlt, sobald die Markierung entfernt wird.
//
// Bewusst ohne Importe, damit die Regeln ohne Datenbank testbar bleiben.
// =============================================================================

/** Ablauf: Rate fällig 1.–10., überfällig ab dem 11., Pausierung ab dem 15. */
export const FAELLIG_BIS_TAG = 10;
export const PAUSE_AB_TAG = 15;
/** Wird erst nach dem 10. markiert, bleiben ab Markierung 5 Tage. */
export const PAUSE_NACH_MARKIERUNG_TAGE = 5;
/** Termine kurz nach der Pausierung finden noch statt. */
export const VORWARNUNG_TAGE = 2;

export type Zahlung = {
  monat: string;                 // Monatserster, z. B. "2027-03-01"
  bezahlt_am: string | null;     // gesetzt = ausdrücklich als bezahlt vermerkt
  offen_seit: string | null;     // gesetzt = von Kleana als fehlend markiert
  erinnerung_am: string | null;  // Tag-10-E-Mail verschickt
  pausiert_am: string | null;    // Vertrag deswegen pausiert
};

export type Status = "bezahlt" | "offen" | "ueberfaellig" | "pausiert";

// --- kleine Datums-Helfer (bewusst lokal, siehe Kopf) -----------------------

const p2 = (n: number) => String(n).padStart(2, "0");

/** Bestimmten Tag eines Monats bilden: ("2027-03-01", 10) -> "2027-03-10" */
export function tagImMonat(monat: string, tag: number): string {
  return `${monat.slice(0, 7)}-${p2(tag)}`;
}

/** ISO-Datum um n Tage verschieben (UTC, damit die Sommerzeit nichts verschiebt). */
export function plusTage(iso: string, n: number): string {
  const [j, m, t] = iso.split("-").map(Number);
  const d = new Date(Date.UTC(j, m - 1, t) + n * 86_400_000);
  return `${d.getUTCFullYear()}-${p2(d.getUTCMonth() + 1)}-${p2(d.getUTCDate())}`;
}

const spaeter = (a: string, b: string) => (a > b ? a : b);

/**
 * Ab wann wird pausiert? Der 15. des Monats – oder, wenn erst später
 * markiert wurde, fünf Tage nach der Markierung.
 */
export function pausierungAb(z: Zahlung): string | null {
  if (!z.offen_seit) return null;
  const markiert = z.offen_seit.slice(0, 10);
  return spaeter(tagImMonat(z.monat, PAUSE_AB_TAG), plusTage(markiert, PAUSE_NACH_MARKIERUNG_TAGE));
}

/** Aktueller Status einer Zahlung. */
export function status(z: Zahlung, heute: string): Status {
  if (z.bezahlt_am) return "bezahlt";
  if (!z.offen_seit) return "bezahlt";          // Umkehrlogik: nicht markiert = bezahlt
  const ab = pausierungAb(z);
  if (ab && heute >= ab) return "pausiert";
  if (heute > tagImMonat(z.monat, FAELLIG_BIS_TAG)) return "ueberfaellig";
  return "offen";
}

/**
 * Ist das Geld für diese Rate da?
 *
 * Auch das folgt der Umkehrlogik: nicht markiert heißt eingegangen – aber
 * erst, wenn das Zahlungsfenster (1.–10.) vorbei ist. Ein künftiger Monat
 * ist schlicht noch nicht fällig und zählt deshalb nicht als bezahlt.
 * Grundlage für Jahresbescheinigung und Endabrechnung.
 */
export function giltAlsBezahlt(z: Zahlung, heute: string): boolean {
  if (z.bezahlt_am) return true;
  if (z.offen_seit) return false;
  return heute > tagImMonat(z.monat, FAELLIG_BIS_TAG);
}

/**
 * Welches Datum steht auf der Bescheinigung? Der tatsächlich vermerkte Tag,
 * sonst der letzte Fälligkeitstag des Monats.
 */
export function bezahltAm(z: Zahlung): string {
  return z.bezahlt_am ? z.bezahlt_am.slice(0, 10) : tagImMonat(z.monat, FAELLIG_BIS_TAG);
}

/**
 * Was muss der Mahnlauf für diese Zahlung heute tun?
 *
 *  * erinnerung – die „letzter Tag"-E-Mail an die Eltern. Sie geht am 10.
 *    raus; wurde erst später markiert, sofort bei der Markierung.
 *  * pausieren – Vertrag pausieren und Eltern informieren.
 */
export function faelligeAktionen(z: Zahlung, heute: string): { erinnerung: boolean; pausieren: boolean } {
  if (z.bezahlt_am || !z.offen_seit) return { erinnerung: false, pausieren: false };

  const erinnerungAb = spaeter(tagImMonat(z.monat, FAELLIG_BIS_TAG), z.offen_seit.slice(0, 10));
  const erinnerung = !z.erinnerung_am && heute >= erinnerungAb;

  const ab = pausierungAb(z);
  const pausieren = !z.pausiert_am && !!ab && heute >= ab;

  return { erinnerung, pausieren };
}

/**
 * Ab wann entfallen Termine nach einer Pausierung?
 * Termine, die weniger als zwei Tage danach liegen, finden noch statt.
 */
export function termineEntfallenAb(pausiertAm: string): string {
  return plusTage(pausiertAm.slice(0, 10), VORWARNUNG_TAGE);
}

/** Findet dieser Termin trotz Pausierung noch statt? */
export function terminFindetStatt(terminDatum: string, pausiertAm: string | null): boolean {
  if (!pausiertAm) return true;
  return terminDatum < termineEntfallenAb(pausiertAm);
}

// --- Auswirkung auf die Buchung ---------------------------------------------

export type Sperre = { gesperrt: boolean; grund?: string; regelterminAusgesetzt: boolean };

/**
 * Sperrt eine offene Zahlung die Buchung?
 *
 *  * überfällig (ab dem 11.): Buchungsfunktionen gesperrt, der feste
 *    Wochentermin bleibt bestehen.
 *  * pausiert (ab dem 15.): zusätzlich ruht der feste Wochentermin.
 */
export function zahlungsSperre(zahlungen: Zahlung[], heute: string): Sperre {
  let gesperrt = false, ausgesetzt = false;
  for (const z of zahlungen) {
    const s = status(z, heute);
    if (s === "pausiert") { gesperrt = true; ausgesetzt = true; }
    else if (s === "ueberfaellig") gesperrt = true;
  }
  if (!gesperrt) return { gesperrt: false, regelterminAusgesetzt: false };
  return {
    gesperrt: true,
    grund: "Buchung derzeit nicht möglich – bitte offene Zahlung begleichen.",
    regelterminAusgesetzt: ausgesetzt,
  };
}

// --- Anzeige ----------------------------------------------------------------

export const STATUS_FARBE: Record<Status, string> = {
  bezahlt: "#127a5c",
  offen: "#d99a36",
  ueberfaellig: "#c2410c",
  pausiert: "#a12a2a",
};

export const STATUS_TEXT: Record<Status, string> = {
  bezahlt: "bezahlt",
  offen: "offen",
  ueberfaellig: "überfällig",
  pausiert: "pausiert",
};
