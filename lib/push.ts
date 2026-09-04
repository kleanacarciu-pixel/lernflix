// =============================================================================
// Web-Push an Kleana (serverseitig).
//
// Die Geräte-Anmeldungen (Abos) liegen in admin_einstellungen unter
// „push_abos" – eine kleine JSON-Liste, ein Eintrag je Gerät (Handy,
// Laptop …). Es gibt nur EINE Empfängerin: Kleana. Schüler bekommen
// grundsätzlich keine Push-Nachrichten.
//
// Verschickt wird mit dem web-push-Paket (VAPID). Der private Schlüssel
// kommt aus der Vercel-Umgebungsvariable VAPID_PRIVATE_KEY; fehlt er,
// scheitert der Versand mit einer klaren Meldung statt still.
// =============================================================================
import webpush from "web-push";
import { ladeEinstellung, speichereEinstellung } from "@/lib/einstellungen";
import { VAPID_PUBLIC_KEY } from "@/lib/push-kern";

export const SCHLUESSEL_PUSH_ABOS = "push_abos";

export type PushAbo = { endpoint: string; keys: { p256dh: string; auth: string } };

export function pushKonfiguriert(): boolean {
  return !!process.env.VAPID_PRIVATE_KEY;
}

function einrichten(): void {
  webpush.setVapidDetails(
    "mailto:kleana.carciu@gmail.com",
    VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY as string,
  );
}

export async function ladeAbos(): Promise<PushAbo[]> {
  const roh = await ladeEinstellung(SCHLUESSEL_PUSH_ABOS);
  if (!roh) return [];
  try {
    const liste = JSON.parse(roh) as unknown;
    if (!Array.isArray(liste)) return [];
    return liste.filter((a): a is PushAbo =>
      !!a && typeof (a as PushAbo).endpoint === "string"
      && typeof (a as PushAbo).keys?.p256dh === "string"
      && typeof (a as PushAbo).keys?.auth === "string");
  } catch { return []; }
}

async function speichereAbos(abos: PushAbo[]): Promise<boolean> {
  return speichereEinstellung(SCHLUESSEL_PUSH_ABOS, JSON.stringify(abos));
}

/** Gerät anmelden (ersetzt einen alten Eintrag mit demselben Endpunkt). */
export async function aboSpeichern(abo: PushAbo): Promise<boolean> {
  const abos = (await ladeAbos()).filter((a) => a.endpoint !== abo.endpoint);
  abos.push(abo);
  return speichereAbos(abos.slice(-10)); // mehr als zehn Geräte hat niemand
}

/** Gerät abmelden. */
export async function aboEntfernen(endpoint: string): Promise<boolean> {
  const abos = await ladeAbos();
  return speichereAbos(abos.filter((a) => a.endpoint !== endpoint));
}

/**
 * Nachricht an ALLE angemeldeten Geräte Kleanas.
 * Tote Abos (Gerät gelöscht, Erlaubnis entzogen → 404/410) werden dabei
 * gleich aufgeräumt, damit die Liste nicht zuwuchert.
 */
export async function pushAnKleana(titel: string, text: string, tag?: string): Promise<{
  gesendet: number; fehler?: string;
}> {
  if (!pushKonfiguriert()) {
    return { gesendet: 0, fehler: "VAPID_PRIVATE_KEY ist in Vercel nicht gesetzt." };
  }
  const abos = await ladeAbos();
  if (!abos.length) return { gesendet: 0, fehler: "Noch kein Gerät für Erinnerungen angemeldet." };

  einrichten();
  const nutzlast = JSON.stringify({ titel, text, tag, url: "/kalender" });
  let gesendet = 0;
  const tot: string[] = [];
  for (const abo of abos) {
    try {
      await webpush.sendNotification(abo, nutzlast);
      gesendet++;
    } catch (e) {
      const status = (e as { statusCode?: number }).statusCode;
      if (status === 404 || status === 410) tot.push(abo.endpoint);
      else console.error("[push] Versand fehlgeschlagen:", status, (e as Error).message);
    }
  }
  if (tot.length) await speichereAbos(abos.filter((a) => !tot.includes(a.endpoint)));
  return gesendet
    ? { gesendet }
    : { gesendet: 0, fehler: "Kein Gerät war erreichbar – bitte Erinnerungen einmal aus- und wieder einschalten." };
}
