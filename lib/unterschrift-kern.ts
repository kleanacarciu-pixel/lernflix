// =============================================================================
// Unterschriftsbilder prüfen und normalisieren (ohne Datenbank)
//
// Zwei Quellen, ein Format:
//   * Kleanas Unterschrift wird einmalig als Datei hochgeladen (PNG/JPG).
//   * Die Unterschrift der Eltern entsteht später im Browser auf einer
//     Zeichenfläche und kommt als PNG.
//
// Beides landet als Daten-URI in der Datenbank. Das spart einen eigenen
// Speicher-Eimer samt Rechteverwaltung, und die PDF-Erzeugung braucht die
// Bytes ohnehin direkt zur Hand.
//
// Bewusst ohne Importe, damit die Prüfungen ohne Datenbank testbar bleiben.
// =============================================================================

/** Mehr braucht eine Unterschrift nicht – schützt die Datenbank vor Ausreißern. */
export const MAX_BYTES = 500 * 1024;

export type Bildart = "png" | "jpeg";

export type Pruefung =
  | { ok: true; art: Bildart; bytes: number; datenUri: string }
  | { ok: false; grund: string };

const KOPF: Record<string, Bildart> = {
  "data:image/png;base64,": "png",
  "data:image/jpeg;base64,": "jpeg",
  "data:image/jpg;base64,": "jpeg",
};

/** Rohe Bytes aus einem Daten-URI – ohne Buffer, damit die Datei rein bleibt. */
function laengeAusBase64(base64: string): number {
  const sauber = base64.replace(/[\s]/g, "");
  const polster = sauber.endsWith("==") ? 2 : sauber.endsWith("=") ? 1 : 0;
  return Math.floor((sauber.length * 3) / 4) - polster;
}

/**
 * Prüft einen Daten-URI und gibt ihn normalisiert zurück.
 *
 * Geprüft wird der Kopf (nur PNG und JPEG), die Größe und ob der Base64-Teil
 * überhaupt entzifferbar ist. Ein kaputtes Bild soll hier auffallen und nicht
 * erst, wenn die Vertrags-PDF erzeugt wird.
 */
export function pruefeUnterschrift(eingabe: unknown): Pruefung {
  if (typeof eingabe !== "string" || !eingabe) {
    return { ok: false, grund: "Es wurde kein Bild übergeben." };
  }
  const wert = eingabe.trim();

  const kopf = Object.keys(KOPF).find((k) => wert.startsWith(k));
  if (!kopf) {
    return { ok: false, grund: "Bitte ein Bild im Format PNG oder JPG hochladen." };
  }

  const base64 = wert.slice(kopf.length);
  if (!base64) return { ok: false, grund: "Die Bilddatei ist leer." };
  if (!/^[A-Za-z0-9+/\s]*={0,2}$/.test(base64)) {
    return { ok: false, grund: "Die Bilddatei ließ sich nicht lesen." };
  }

  const bytes = laengeAusBase64(base64);
  if (bytes <= 0) return { ok: false, grund: "Die Bilddatei ist leer." };
  if (bytes > MAX_BYTES) {
    return {
      ok: false,
      grund: `Das Bild ist zu groß (${Math.round(bytes / 1024)} KB). Erlaubt sind ${MAX_BYTES / 1024} KB.`,
    };
  }

  return { ok: true, art: KOPF[kopf], bytes, datenUri: `${kopf}${base64.replace(/\s/g, "")}` };
}

/** Ist an dieser Stelle eine brauchbare Unterschrift hinterlegt? */
export function hatUnterschrift(wert: string | null | undefined): boolean {
  return !!wert && pruefeUnterschrift(wert).ok;
}

/**
 * Hinweis für die Oberfläche: Wie sollte das Bild aussehen?
 * Eine weiße Fläche stört im PDF nicht, weil die Seite selbst weiß ist –
 * echtes Freistellen ist deshalb nicht nötig.
 */
export const UNTERSCHRIFT_HINWEIS =
  "Am besten auf weißem Papier mit dunklem Stift unterschreiben und abfotografieren. "
  + "PNG mit durchsichtigem Hintergrund geht auch. Weiß stört nicht – die PDF-Seite ist ebenfalls weiß.";
