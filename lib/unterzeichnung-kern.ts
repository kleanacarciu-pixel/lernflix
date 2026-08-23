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

// --- Rückfall: außerhalb des Portals unterschrieben -------------------------

/**
 * Wer lieber auf Papier unterschreibt, schickt ein Foto oder eine PDF. Die
 * darf größer sein als eine Unterschrift – es ist ein ganzes Dokument.
 */
export const MAX_EXTERN_BYTES = 4 * 1024 * 1024;

const EXTERN_KOEPFE: Record<string, string> = {
  "data:application/pdf;base64,": "pdf",
  "data:image/png;base64,": "png",
  "data:image/jpeg;base64,": "jpeg",
  "data:image/jpg;base64,": "jpeg",
};

export type ExternePruefung =
  | { ok: true; art: string; bytes: number; datenUri: string }
  | { ok: false; grund: string };

/** Prüft die hochgeladene, außerhalb des Portals unterschriebene Fassung. */
export function pruefeExterneUnterschrift(eingabe: unknown): ExternePruefung {
  if (typeof eingabe !== "string" || !eingabe.trim()) {
    return { ok: false, grund: "Es wurde keine Datei übergeben." };
  }
  const wert = eingabe.trim();
  const kopf = Object.keys(EXTERN_KOEPFE).find((k) => wert.startsWith(k));
  if (!kopf) return { ok: false, grund: "Bitte eine PDF, ein PNG oder ein JPG hochladen." };

  const base64 = wert.slice(kopf.length).replace(/\s/g, "");
  if (!base64) return { ok: false, grund: "Die Datei ist leer." };
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(base64)) {
    return { ok: false, grund: "Die Datei ließ sich nicht lesen." };
  }
  const polster = base64.endsWith("==") ? 2 : base64.endsWith("=") ? 1 : 0;
  const bytes = Math.floor((base64.length * 3) / 4) - polster;
  if (bytes <= 0) return { ok: false, grund: "Die Datei ist leer." };
  if (bytes > MAX_EXTERN_BYTES) {
    return {
      ok: false,
      grund: `Die Datei ist zu groß (${Math.round(bytes / 1024 / 1024 * 10) / 10} MB). `
        + `Erlaubt sind ${MAX_EXTERN_BYTES / 1024 / 1024} MB.`,
    };
  }
  return { ok: true, art: EXTERN_KOEPFE[kopf], bytes, datenUri: `${kopf}${base64}` };
}

/** Der Datei-Typ einer abgelegten Fassung – zum Ausliefern gebraucht. */
export function externerTyp(datenUri: string | null | undefined): { mime: string; endung: string } | null {
  if (!datenUri) return null;
  const kopf = Object.keys(EXTERN_KOEPFE).find((k) => datenUri.startsWith(k));
  if (!kopf) return null;
  const art = EXTERN_KOEPFE[kopf];
  return art === "pdf"
    ? { mime: "application/pdf", endung: "pdf" }
    : { mime: `image/${art}`, endung: art === "jpeg" ? "jpg" : art };
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
