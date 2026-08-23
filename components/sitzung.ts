'use client';
// =============================================================================
// Gemeinsame Anmeldung für die Admin-Seiten
//
// Der Kalender verlängert die Anmeldung im Hintergrund selbst: Läuft der
// Zugangs-Token ab (bei Supabase nach etwa einer Stunde), holt er mit dem
// Refresh-Token einen neuen und wiederholt die Anfrage. Die Seiten
// /schuljahr, /vertraege und /zahlungen taten das anfangs NICHT – dadurch
// wurde man dort ausgesperrt, obwohl der Kalender im Nachbartab lief.
//
// Dieses Modul macht es genauso wie der Kalender, inklusive der Rücksicht auf
// mehrere Tabs: Verlängert ein anderer Tab die Sitzung, wird dessen neuer
// Token übernommen, statt mit dem alten zu verlängern – sonst würde Supabase
// beide Seiten ausloggen.
// =============================================================================

export const LS_KEY = 'lma_kal_session';

export type Sitzung = { token: string; refresh: string; role?: string; name?: string };

export function ladeSitzung(): Sitzung | null {
  try {
    const roh = localStorage.getItem(LS_KEY);
    return roh ? (JSON.parse(roh) as Sitzung) : null;
  } catch { return null; }
}

export function speichereSitzung(s: Sitzung | null): void {
  try {
    if (s) localStorage.setItem(LS_KEY, JSON.stringify(s));
    else localStorage.removeItem(LS_KEY);
  } catch { /* Speicher nicht verfügbar */ }
}

type Antwort = { status: number; data: Record<string, unknown> };

async function anfrage(pfad: string, koerper: Record<string, unknown>): Promise<Antwort> {
  const res = await fetch(pfad, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(koerper),
  });
  return { status: res.status, data: (await res.json().catch(() => ({}))) as Record<string, unknown> };
}

/**
 * API-Aufruf mit Anmeldung – bei 401 wird die Sitzung einmal verlängert und
 * die Anfrage wiederholt.
 *
 * Wirft bei einem Fehler eine Error mit der Meldung des Servers.
 * `beiAbmeldung` wird nur gerufen, wenn die Anmeldung wirklich weg ist –
 * nicht bei einem vorübergehenden Netzwerkproblem.
 */
export async function rufeApi(
  pfad: string,
  action: string,
  params: Record<string, unknown> = {},
  beiAbmeldung?: () => void,
): Promise<Record<string, unknown>> {
  const sitzung = ladeSitzung();
  if (!sitzung?.token) { beiAbmeldung?.(); throw new Error('Bitte einloggen.'); }

  let r = await anfrage(pfad, { action, token: sitzung.token, ...params });

  if (r.status === 401 && sitzung.refresh) {
    // Hat ein anderer Tab schon verlängert? Dann dessen Token nehmen.
    const aktuell = ladeSitzung() ?? sitzung;
    if (aktuell.token && aktuell.token !== sitzung.token) {
      r = await anfrage(pfad, { action, token: aktuell.token, ...params });
    }

    if (r.status === 401) {
      let rstatus = 0;
      let rd: Record<string, unknown> = {};
      try {
        const rf = await anfrage('/api/kalender', { action: 'refresh', refresh: aktuell.refresh });
        rstatus = rf.status; rd = rf.data;
      } catch { /* Netzwerkfehler – Sitzung NICHT verwerfen */ }

      if (rd.ok && rd.token) {
        speichereSitzung({ ...aktuell, token: String(rd.token), refresh: String(rd.refresh) });
        r = await anfrage(pfad, { action, token: String(rd.token), ...params });
      } else if (rstatus === 401) {
        // Nur ein echtes Ablaufen führt zum Ausloggen.
        speichereSitzung(null);
        beiAbmeldung?.();
        throw new Error('Bitte einloggen.');
      }
    }
  }

  if (r.status === 401) { beiAbmeldung?.(); throw new Error('Bitte einloggen.'); }
  if (r.status >= 400 || !r.data.ok) {
    throw new Error(String(r.data.error || 'Das hat nicht geklappt.'));
  }
  return r.data;
}

/** Aktueller Zugangs-Token – für Links auf PDF-Downloads. */
export function aktuellerToken(): string {
  return ladeSitzung()?.token || '';
}
