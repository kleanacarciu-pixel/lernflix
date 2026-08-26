// =============================================================================
// "Gesehen"-Liste für die Absagen-Übersicht (reine Logik, testbar)
//
// Kleana kann Einträge unter "Letzte Absagen" mit ✕ ausblenden, wenn sie sie
// gesehen hat. Gespeichert wird das als JSON-Liste von appointment-ids in den
// Admin-Einstellungen (Schlüssel/Wert) – so gilt es auf jedem Gerät und
// braucht keine Migration. Die Absage selbst bleibt unangetastet.
// =============================================================================

// Mehr als die Übersicht je zeigt; alte Einträge fallen vorne raus.
export const GESEHEN_MAX = 200;

/** Gespeicherten Einstellungs-Wert sicher in eine id-Liste übersetzen. */
export function gesehenListe(wert: string | null): string[] {
  if (!wert) return [];
  try {
    const v: unknown = JSON.parse(wert);
    return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

/** Eine id als gesehen vormerken – ohne Doppelte, auf GESEHEN_MAX begrenzt. */
export function mitGesehen(bisher: string[], id: string, max = GESEHEN_MAX): string[] {
  const ohne = bisher.filter((x) => x !== id);
  ohne.push(id);
  return ohne.slice(-max);
}
