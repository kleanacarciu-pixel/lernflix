// =============================================================================
// Unterzeichnung im Portal – Regeln (ohne Datenbank)
//
// Schritt 3 des Vertragsabschlusses: Die Eltern öffnen den Vertrag, setzen
// zwei Pflicht-Häkchen und unterschreiben auf einer Zeichenfläche. Erst danach
// gilt der Vertrag als geschlossen – und erst danach lässt sich buchen.
//
// Hier steht ausschließlich, WANN das gilt. Das Speichern, die PDF und die
// E-Mail liegen woanders. Die beiden Importe kommen selbst ohne Datenbank aus
// – so bleibt auch diese Datei ohne Datenbank testbar. Sie stehen bewusst mit
// relativem Pfad da, damit der Test sie ohne Bündelung laden kann.
// =============================================================================
import { pruefeUnterschrift } from "./unterschrift-kern.ts";
import { BESTAETIGUNG_AGB, BESTAETIGUNG_WIDERRUF } from "./vertrag-pdf-texte.ts";

/**
 * Die beiden Pflicht-Bestätigungen. Beide müssen gesetzt sein, sonst gibt es
 * keine Unterschrift – geprüft wird das auf dem Server, nicht nur im Formular.
 */
export const PFLICHT_BESTAETIGUNGEN = [
  { id: "agb", text: BESTAETIGUNG_AGB, link: "/agb-vertrag", linkText: "AGB lesen" },
  { id: "widerruf", text: BESTAETIGUNG_WIDERRUF, link: "/widerruf", linkText: "Widerrufsbelehrung lesen" },
] as const;

/**
 * Kleinste Größe einer Unterschrift aus der Zeichenfläche.
 *
 * Eine unberührte Zeichenfläche ergibt trotzdem ein gültiges PNG – nur eben
 * ein sehr kleines, weil eine einfarbige Fläche fast nichts zu speichern hat.
 * Die Grenze fängt genau diesen Fall ab; sie ist bewusst niedrig, damit auch
 * ein kurzes Namenskürzel noch durchkommt.
 */
export const MIN_UNTERSCHRIFT_BYTES = 600;

export type Unterzeichnungseingabe = {
  agb?: unknown;
  widerruf?: unknown;
  unterschrift?: unknown;
};

export type Unterzeichnungspruefung =
  | { ok: true; datenUri: string }
  | { ok: false; grund: string };

/** Prüft, ob unterschrieben werden darf – Häkchen und Bild zusammen. */
export function pruefeUnterzeichnung(e: Unterzeichnungseingabe): Unterzeichnungspruefung {
  if (e.agb !== true || e.widerruf !== true) {
    return { ok: false, grund: "Bitte bestätige beide Punkte." };
  }
  const bild = pruefeUnterschrift(e.unterschrift);
  if (!bild.ok) return { ok: false, grund: bild.grund };
  if (bild.bytes < MIN_UNTERSCHRIFT_BYTES) {
    return { ok: false, grund: "Das Unterschriftsfeld ist noch leer. Bitte unterschreibe mit dem Finger oder der Maus." };
  }
  return { ok: true, datenUri: bild.datenUri };
}

// --- Stand eines Vertrags ---------------------------------------------------

export type Vertragsstand = "erstellt" | "eingeladen" | "unterschrieben" | "beendet";

/** Nur die Felder, auf die es hier ankommt – so bleibt die Prüfung testbar. */
export type StandVertrag = {
  status?: string | null;
  eingeladen_am?: string | null;
  unterzeichnet_am?: string | null;
  manuell_aktiviert_am?: string | null;
};

/**
 * Gilt der Vertrag als unterschrieben?
 *
 * Zwei Wege führen dahin: die Unterschrift im Portal und – als Rückfall für
 * den Fall, dass jemand lieber auf Papier unterschreibt – die von Kleana
 * hochgeladene Fassung samt Freischaltung von Hand (Schritt 4).
 */
export function istUnterzeichnet(v: StandVertrag | null | undefined): boolean {
  return !!v && (!!v.unterzeichnet_am || !!v.manuell_aktiviert_am);
}

/** Stand für die Übersicht: erstellt → eingeladen → unterschrieben. */
export function vertragsstand(v: StandVertrag): { stand: Vertragsstand; seit: string | null } {
  if (v.status === "beendet" || v.status === "gekuendigt") {
    return { stand: "beendet", seit: null };
  }
  if (istUnterzeichnet(v)) {
    return { stand: "unterschrieben", seit: v.unterzeichnet_am || v.manuell_aktiviert_am || null };
  }
  if (v.eingeladen_am) return { stand: "eingeladen", seit: v.eingeladen_am };
  return { stand: "erstellt", seit: null };
}

export const STAND_TEXT: Record<Vertragsstand, string> = {
  erstellt: "erstellt – noch nicht eingeladen",
  eingeladen: "eingeladen – wartet auf Unterschrift",
  unterschrieben: "unterschrieben und aktiv",
  beendet: "beendet",
};
