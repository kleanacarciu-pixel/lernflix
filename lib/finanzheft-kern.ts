// =============================================================================
// Finanzheft – Trennung privat/Firma (ohne Datenbank)
//
// Zweck: Kleanas privates Geld darf nie mit dem Geld der (noch nicht
// gegründeten) Firma vermischt werden – geht die Firma später pleite, soll
// das private Geld unangetastet bleiben. Dafür gibt es zwei getrennte
// „Konten" (privat/firma); Geld wandert zwischen ihnen NUR über einen
// ausdrücklichen Transfer, nie automatisch.
//
// Gerechnet wird durchgehend in CENT als ganze Zahlen (siehe vertrag-kern.ts).
// Bewusst frei von Abhängigkeiten: dadurch schnell und ohne Supabase testbar.
// Der Datenbank-Teil liegt in lib/finanzheft.ts.
// =============================================================================

export type Konto = "privat" | "firma";
export type BuchungsTyp = "einnahme" | "ausgabe";

export type Buchung = {
  konto: Konto;
  typ: BuchungsTyp;
  betragCent: number;
  kategorie: string;
  datum: string; // ISO, z. B. "2027-03-01"
};

/** Kategorie, unter der beide Seiten eines Transfers gebucht werden. */
export const TRANSFER_KATEGORIE = "Transfer zwischen den Konten";

export const FIRMA_KATEGORIEN = [
  "Nachhilfe-Einnahmen",
  "Software/Tools",
  "Werbung",
  "Steuerberater",
  "Büromaterial",
  "Sonstige Firmenausgabe",
] as const;

export const PRIVAT_KATEGORIEN = [
  "Gehalt/Entnahme",
  "Miete",
  "Lebensmittel",
  "Versicherung",
  "Freizeit",
  "Sonstige private Ausgabe",
] as const;

/** Saldo eines einzelnen Kontos aus einer Liste von Buchungen. */
export function saldoCent(buchungen: readonly Pick<Buchung, "konto" | "typ" | "betragCent">[], konto: Konto): number {
  return buchungen
    .filter((b) => b.konto === konto)
    .reduce((summe, b) => summe + (b.typ === "einnahme" ? b.betragCent : -b.betragCent), 0);
}

/** Beide Salden auf einen Blick – die Basis der Übersicht im Finanzheft. */
export function saldenBeide(buchungen: readonly Pick<Buchung, "konto" | "typ" | "betragCent">[]): {
  privatCent: number;
  firmaCent: number;
} {
  return { privatCent: saldoCent(buchungen, "privat"), firmaCent: saldoCent(buchungen, "firma") };
}

/**
 * Prüft eine einzelne Buchung, bevor sie gespeichert wird.
 * Rein formal (Betrag, Datum, Kategorie) – die inhaltliche Vermischungs-
 * Warnung kommt separat aus `pruefeVermischung`, denn die soll speichern
 * nicht verhindern, nur aufmerksam machen.
 */
export function pruefeBuchung(eingabe: {
  betragCent: number;
  kategorie: string;
  datum: string;
}): { ok: true } | { ok: false; grund: string } {
  if (!Number.isFinite(eingabe.betragCent) || eingabe.betragCent <= 0) {
    return { ok: false, grund: "Der Betrag muss größer als 0 sein." };
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(eingabe.datum)) {
    return { ok: false, grund: "Ungültiges Datum." };
  }
  if (!eingabe.kategorie.trim()) {
    return { ok: false, grund: "Bitte eine Kategorie angeben." };
  }
  return { ok: true };
}

/**
 * Warnt, wenn eine Buchung eher zum ANDEREN Konto passen würde – z. B. eine
 * „Miete"-Ausgabe auf dem Firmenkonto. Blockiert nichts, denn Ausnahmen gibt
 * es immer; sie soll nur zum Nachdenken bringen, BEVOR sich beide Töpfe
 * durch viele kleine Buchungen unbemerkt vermischen.
 */
export function pruefeVermischung(konto: Konto, kategorie: string): { warnung: boolean; grund?: string } {
  if (kategorie === TRANSFER_KATEGORIE) return { warnung: false };
  const fremdeListe: readonly string[] = konto === "privat" ? FIRMA_KATEGORIEN : PRIVAT_KATEGORIEN;
  if (!fremdeListe.includes(kategorie)) return { warnung: false };
  return {
    warnung: true,
    grund:
      konto === "privat"
        ? `„${kategorie}" klingt nach einer Firmenausgabe – gehört das wirklich aufs private Konto?`
        : `„${kategorie}" klingt nach einer privaten Ausgabe – gehört das wirklich aufs Firmenkonto?`,
  };
}

/**
 * Baut die zwei Buchungszeilen eines Transfers (Ausgabe auf dem Quellkonto,
 * Einnahme auf dem Zielkonto). So bleibt jeder Übertrag nachvollziehbar und
 * die Salden beider Konten stimmen weiter exakt – nichts verschwindet oder
 * entsteht aus dem Nichts.
 */
export function transferBuchungen(
  von: Konto,
  nach: Konto,
  betragCent: number,
  datum: string,
): { ausgabe: Buchung; einnahme: Buchung } {
  if (von === nach) throw new Error("Von- und Nach-Konto müssen unterschiedlich sein.");
  const p = pruefeBuchung({ betragCent, kategorie: TRANSFER_KATEGORIE, datum });
  if (!p.ok) throw new Error(p.grund);
  return {
    ausgabe: { konto: von, typ: "ausgabe", betragCent, kategorie: TRANSFER_KATEGORIE, datum },
    einnahme: { konto: nach, typ: "einnahme", betragCent, kategorie: TRANSFER_KATEGORIE, datum },
  };
}
