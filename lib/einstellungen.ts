// =============================================================================
// Admin-Einstellungen (serverseitig)
//
// Aktuell nur Kleanas Unterschrift. Bewusst als Schlüssel/Wert angelegt,
// damit später etwas dazukommen kann, ohne jedes Mal eine Migration.
// =============================================================================
import { service } from "@/lib/kalender";
import { pruefeUnterschrift, hatUnterschrift } from "@/lib/unterschrift-kern";

export const SCHLUESSEL_UNTERSCHRIFT = "unterschrift_anbieterin";

export async function ladeEinstellung(schluessel: string): Promise<string | null> {
  const res = await service()
    .from("admin_einstellungen").select("wert").eq("schluessel", schluessel).maybeSingle();
  if (res.error || !res.data) return null;
  return (res.data as { wert: string | null }).wert;
}

export async function speichereEinstellung(schluessel: string, wert: string | null): Promise<boolean> {
  const res = await service().from("admin_einstellungen").upsert(
    { schluessel, wert, geaendert_am: new Date().toISOString() },
    { onConflict: "schluessel" },
  );
  return !res.error;
}

/** Kleanas Unterschrift als Daten-URI, oder null wenn keine hinterlegt ist. */
export async function unterschriftAnbieterin(): Promise<string | null> {
  const wert = await ladeEinstellung(SCHLUESSEL_UNTERSCHRIFT);
  return hatUnterschrift(wert) ? wert : null;
}

/**
 * Unterschrift als Bytes – so braucht sie pdfkit zum Einbetten.
 * Gibt null zurück, wenn keine hinterlegt oder das Bild unbrauchbar ist;
 * die PDF entsteht dann ohne Bild statt gar nicht.
 */
export async function unterschriftBytes(): Promise<Buffer | null> {
  const uri = await unterschriftAnbieterin();
  if (!uri) return null;
  const base64 = uri.slice(uri.indexOf(",") + 1);
  try { return Buffer.from(base64, "base64"); } catch { return null; }
}

/** Unterschrift setzen oder entfernen. */
export async function setzeUnterschrift(datenUri: string | null): Promise<{ ok: boolean; error?: string }> {
  if (datenUri === null) {
    return (await speichereEinstellung(SCHLUESSEL_UNTERSCHRIFT, null))
      ? { ok: true } : { ok: false, error: "Das ließ sich nicht speichern." };
  }
  const p = pruefeUnterschrift(datenUri);
  if (!p.ok) return { ok: false, error: p.grund };
  return (await speichereEinstellung(SCHLUESSEL_UNTERSCHRIFT, p.datenUri))
    ? { ok: true } : { ok: false, error: "Das ließ sich nicht speichern." };
}
