// =============================================================================
// Signierte Links für die Vertragsbestätigung
//
// Eltern bestätigen den Vertrag über einen Link aus der E-Mail – ohne Konto
// und ohne Anmeldung. Der Link trägt eine Signatur und ein Ablaufdatum; er
// lässt sich weder erraten noch nachträglich verlängern.
//
// Als Geheimnis dient der Service-Role-Key, wie schon bei den Gast-Links in
// lib/stunden.ts. So braucht es keine neue Umgebungsvariable.
// =============================================================================
import { createHmac, timingSafeEqual } from "node:crypto";

export const GUELTIG_TAGE = 14;

function signatur(vertragId: string, ablauf: number): string {
  const geheim = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  // Ohne Geheimnis NIE signieren: Mit leerem Schlüssel könnte jeder gültige
  // Links errechnen. Lieber laut scheitern (pruefeVertragToken fängt das ab
  // und meldet „ungültig") als leise unsicher weiterlaufen.
  if (!geheim) throw new Error("SUPABASE_SERVICE_ROLE_KEY fehlt – Vertragslinks sind ohne Geheimnis nicht möglich.");
  return createHmac("sha256", geheim).update(`vertrag:${vertragId}:${ablauf}`).digest("hex").slice(0, 32);
}

/** Token für einen Vertrag erzeugen (Standard: 14 Tage gültig). */
export function vertragToken(vertragId: string, tage = GUELTIG_TAGE, jetzt = Date.now()): string {
  const ablauf = jetzt + tage * 86_400_000;
  return `${vertragId}.${ablauf}.${signatur(vertragId, ablauf)}`;
}

export type TokenPruefung =
  | { ok: true; vertragId: string; ablauf: number }
  | { ok: false; grund: "ungueltig" | "abgelaufen" };

/** Token prüfen: Aufbau, Signatur und Ablaufdatum. */
export function pruefeVertragToken(token: string, jetzt = Date.now()): TokenPruefung {
  const teile = String(token || "").split(".");
  if (teile.length !== 3) return { ok: false, grund: "ungueltig" };
  const [vertragId, ablaufText, sig] = teile;
  const ablauf = Number(ablaufText);
  if (!vertragId || !Number.isFinite(ablauf)) return { ok: false, grund: "ungueltig" };

  // Signatur zuerst prüfen – erst danach über den Ablauf reden, damit ein
  // gefälschter Token nicht als „nur abgelaufen" durchgeht.
  let soll: Buffer;
  try { soll = Buffer.from(signatur(vertragId, ablauf)); }
  catch { return { ok: false, grund: "ungueltig" }; }   // fehlendes Geheimnis: fail closed
  const ist = Buffer.from(sig);
  if (soll.length !== ist.length || !timingSafeEqual(soll, ist)) return { ok: false, grund: "ungueltig" };

  if (jetzt > ablauf) return { ok: false, grund: "abgelaufen" };
  return { ok: true, vertragId, ablauf };
}

/** Vollständiger Link zur Bestätigungsseite. */
export function bestaetigungsLink(vertragId: string, baseUrl: string): string {
  return `${baseUrl.replace(/\/$/, "")}/vertrag/${vertragToken(vertragId)}`;
}
