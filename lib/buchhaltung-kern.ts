// =============================================================================
// Buchhaltung – doppelte Buchführung (ohne Datenbank)
//
// Jede Buchung besteht aus mindestens zwei Zeilen (Soll/Haben), deren Summen
// exakt übereinstimmen müssen – das ist die Kontrolle, die eine einfache
// Einnahme/Ausgabe-Liste nicht hat. Kontostand-Richtung hängt vom Kontotyp ab:
//   Aktiv/Aufwand  wächst mit SOLL   (Bank, Kasse, Vorsteuer, Ausgabenkonten)
//   Passiv/Ertrag  wächst mit HABEN  (Umsatzsteuer-Schuld, Einnahmenkonten)
//
// Gerechnet wird durchgehend in CENT als ganze Zahlen (siehe vertrag-kern.ts).
// Bewusst frei von Abhängigkeiten: dadurch schnell und ohne Supabase testbar.
// Der Datenbank-Teil liegt in lib/buchhaltung.ts.
// =============================================================================

export type Kontotyp = "aktiv" | "passiv" | "ertrag" | "aufwand";

export type Konto = {
  id: number;
  typ: Kontotyp;
};

export type Buchungszeile = {
  kontoId: number;
  sollCent: number;
  habenCent: number;
};

export const UST_SAETZE = [0, 7, 19] as const;

/** Bruttobetrag in Netto + Umsatzsteuer aufteilen (kaufmännisch gerundet). */
export function nettoAusBrutto(bruttoCent: number, satzProzent: number): { nettoCent: number; steuerCent: number } {
  if (satzProzent <= 0) return { nettoCent: bruttoCent, steuerCent: 0 };
  const nettoCent = Math.round(bruttoCent / (1 + satzProzent / 100));
  return { nettoCent, steuerCent: bruttoCent - nettoCent };
}

/** Saldo EINES Kontos aus allen seinen Zeilen – die Richtung folgt dem Kontotyp. */
export function kontoSaldoCent(zeilen: readonly Buchungszeile[], kontoId: number, typ: Kontotyp): number {
  let soll = 0, haben = 0;
  for (const z of zeilen) {
    if (z.kontoId !== kontoId) continue;
    soll += z.sollCent;
    haben += z.habenCent;
  }
  return typ === "aktiv" || typ === "aufwand" ? soll - haben : haben - soll;
}

/** Eine Buchung ist nur gültig, wenn Soll- und Haben-Summe exakt übereinstimmen (und > 0 ist). */
export function buchungAusgeglichen(zeilen: readonly Buchungszeile[]): boolean {
  const soll = zeilen.reduce((s, z) => s + z.sollCent, 0);
  const haben = zeilen.reduce((s, z) => s + z.habenCent, 0);
  return soll === haben && soll > 0;
}

/** Gewinn/Verlust: Summe aller Ertragskonten minus Summe aller Aufwandskonten. */
export function guvCent(ertragSalden: readonly number[], aufwandSalden: readonly number[]): number {
  const ertrag = ertragSalden.reduce((s, x) => s + x, 0);
  const aufwand = aufwandSalden.reduce((s, x) => s + x, 0);
  return ertrag - aufwand;
}

/** Zahllast ans Finanzamt: erhaltene Umsatzsteuer minus gezahlte Vorsteuer (negativ = Erstattung). */
export function ustZahllastCent(umsatzsteuerSaldoCent: number, vorsteuerSaldoCent: number): number {
  return umsatzsteuerSaldoCent - vorsteuerSaldoCent;
}

// --- Buchungsvorlagen: bauen fertige Soll/Haben-Zeilen, rühren die DB nie an ---

/**
 * Geld kommt auf ein Konto (Bank/Kasse) rein: Soll dort in voller (Brutto-)
 * Höhe, Haben auf dem Ertragskonto (netto) und – falls USt anfällt – zusätzlich
 * auf dem Umsatzsteuer-Konto.
 */
export function einnahmeZeilen(
  aktivKontoId: number, ertragKontoId: number, umsatzsteuerKontoId: number,
  bruttoCent: number, ustSatz: number,
): Buchungszeile[] {
  if (bruttoCent <= 0) throw new Error("Der Betrag muss größer als 0 sein.");
  const { nettoCent, steuerCent } = nettoAusBrutto(bruttoCent, ustSatz);
  const zeilen: Buchungszeile[] = [
    { kontoId: aktivKontoId, sollCent: bruttoCent, habenCent: 0 },
    { kontoId: ertragKontoId, sollCent: 0, habenCent: nettoCent },
  ];
  if (steuerCent > 0) zeilen.push({ kontoId: umsatzsteuerKontoId, sollCent: 0, habenCent: steuerCent });
  return zeilen;
}

/**
 * Geld geht von einem Konto (Bank/Kasse) raus: Soll auf dem Aufwandskonto
 * (netto) und – falls USt anfällt – zusätzlich auf dem Vorsteuer-Konto,
 * Haben auf dem Bank-/Kassenkonto in voller (Brutto-)Höhe.
 */
export function ausgabeZeilen(
  aktivKontoId: number, aufwandKontoId: number, vorsteuerKontoId: number,
  bruttoCent: number, ustSatz: number,
): Buchungszeile[] {
  if (bruttoCent <= 0) throw new Error("Der Betrag muss größer als 0 sein.");
  const { nettoCent, steuerCent } = nettoAusBrutto(bruttoCent, ustSatz);
  const zeilen: Buchungszeile[] = [
    { kontoId: aufwandKontoId, sollCent: nettoCent, habenCent: 0 },
    { kontoId: aktivKontoId, sollCent: 0, habenCent: bruttoCent },
  ];
  if (steuerCent > 0) zeilen.push({ kontoId: vorsteuerKontoId, sollCent: steuerCent, habenCent: 0 });
  return zeilen;
}

/** Geld von einem Aktivkonto (z. B. Bank Firma) auf ein anderes (z. B. Bank Privat) übertragen. */
export function transferZeilen(vonKontoId: number, nachKontoId: number, betragCent: number): Buchungszeile[] {
  if (vonKontoId === nachKontoId) throw new Error("Von- und Nach-Konto müssen unterschiedlich sein.");
  if (betragCent <= 0) throw new Error("Der Betrag muss größer als 0 sein.");
  return [
    { kontoId: nachKontoId, sollCent: betragCent, habenCent: 0 },
    { kontoId: vonKontoId, sollCent: 0, habenCent: betragCent },
  ];
}
