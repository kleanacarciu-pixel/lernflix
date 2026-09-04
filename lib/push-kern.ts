// =============================================================================
// Web-Push – die Hälfte OHNE Server-Geheimnisse.
//
// Der ÖFFENTLICHE VAPID-Schlüssel identifiziert die App gegenüber den
// Push-Diensten der Browser (Apple/Google/Mozilla). Er darf im Code stehen
// und wird vom Kalender (Client) beim Anmelden der Benachrichtigungen
// gebraucht; der PRIVATE Gegenpart liegt ausschließlich in Vercel
// (Umgebungsvariable VAPID_PRIVATE_KEY) und gehört NIE in den Code.
// =============================================================================
export const VAPID_PUBLIC_KEY = "BGwCU-mZzx0N-2qrLdErrpWpNzNExy0eEznoFCX7ggF5hmRidz-OzJU5-fdfUmFBY5WMwZsjhvRM4UNkP3utT8o";

/** Base64-URL → Uint8Array, wie pushManager.subscribe es erwartet. */
export function vapidAlsBytes(schluessel: string): Uint8Array<ArrayBuffer> {
  const auffuellung = "=".repeat((4 - (schluessel.length % 4)) % 4);
  const b64 = (schluessel + auffuellung).replace(/-/g, "+").replace(/_/g, "/");
  const roh = atob(b64);
  // Ausdrücklich über einen ArrayBuffer, damit der Typ zu dem passt, was
  // pushManager.subscribe erwartet (kein SharedArrayBuffer).
  const bytes = new Uint8Array(new ArrayBuffer(roh.length));
  for (let i = 0; i < roh.length; i++) bytes[i] = roh.charCodeAt(i);
  return bytes;
}
