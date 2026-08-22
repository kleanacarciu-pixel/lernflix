// ============================================================================
// QUIZ-STORE (nur Server) — liefert die geprüften Fragen aus lib/quiz/daten/*.
// Keine Live-KI, kein Supabase, keine Umgebungsvariablen nötig.
// ============================================================================

import type { Fach, SchulartId, Frage, KlassenFragen } from "@/lib/quiz/catalog";
import { themaOhneEmoji, themaKey } from "@/lib/quiz/catalog";

import gymnasiumMathe from "@/lib/quiz/daten/mathe-gymnasium";
import realschuleMathe from "@/lib/quiz/daten/mathe-realschule";
import mittelschuleMathe from "@/lib/quiz/daten/mathe-mittelschule";

// Registrierte Fragensammlungen. Schlüssel: "fach|schulart".
// Weitere Schularten/Fächer werden ergänzt, sobald geprüfte Fragen vorliegen.
const REGISTRY: Record<string, KlassenFragen> = {
  "mathe|gymnasium": gymnasiumMathe,
  "mathe|realschule": realschuleMathe,
  "mathe|mittelschule": mittelschuleMathe,
};

function regKey(fach: string, schulart: string): string {
  return `${fach}|${schulart}`;
}

/** Alle geprüften Fragen für eine konkrete Auswahl (leer, wenn noch keine da). */
export function getFragen(fach: Fach, schulart: SchulartId, klasse: number, thema: string): Frage[] {
  const baum = REGISTRY[regKey(fach, schulart)];
  if (!baum) return [];
  const proKlasse = baum[klasse];
  if (!proKlasse) return [];
  const liste = proKlasse[themaOhneEmoji(thema)];
  return Array.isArray(liste) ? liste : [];
}

/** True, wenn für diese Auswahl mindestens eine geprüfte Frage existiert. */
export function hatFragen(fach: Fach, schulart: SchulartId, klasse: number, thema: string): boolean {
  return getFragen(fach, schulart, klasse, thema).length > 0;
}

/**
 * Liste aller Auswahl-Schlüssel (fach|schulart|klasse|thema), für die Fragen
 * hinterlegt sind. Damit blendet die Oberfläche „Bald verfügbar" korrekt ein.
 */
export function verfuegbareKeys(): string[] {
  const keys: string[] = [];
  for (const [rk, baum] of Object.entries(REGISTRY)) {
    const [fach, schulart] = rk.split("|");
    for (const klasseStr of Object.keys(baum)) {
      const klasse = parseInt(klasseStr, 10);
      const proKlasse = baum[klasse];
      for (const thema of Object.keys(proKlasse)) {
        if (proKlasse[thema]?.length > 0) {
          keys.push(themaKey(fach, schulart, klasse, thema));
        }
      }
    }
  }
  return keys;
}

/** Kleine Statistik (nur für Logging/Übersicht). */
export function bestand(): { kombinationen: number; fragen: number } {
  let kombinationen = 0;
  let fragen = 0;
  for (const baum of Object.values(REGISTRY)) {
    for (const proKlasse of Object.values(baum)) {
      for (const liste of Object.values(proKlasse)) {
        if (liste.length > 0) {
          kombinationen += 1;
          fragen += liste.length;
        }
      }
    }
  }
  return { kombinationen, fragen };
}
