// ============================================================================
// QUIZ-STORE (nur Server) — liefert die geprüften Aufgaben aus.
// Keine Live-KI, kein Supabase, keine Umgebungsvariablen nötig.
//
// Prototyp-Phase: Das Quiz stellt interaktive Aufgaben (Anton-Stil) — Eintippen,
// Lückentext, Zuordnen, Sortieren, Multiple Choice. Zuerst ist EIN Thema fertig
// (Bruchrechnen, Gymnasium Klasse 6); alle anderen erscheinen "Bald verfügbar".
// ============================================================================

import { themaKey } from "@/lib/quiz/catalog";
import type { Fach, SchulartId } from "@/lib/quiz/catalog";
import type { Aufgabe } from "@/lib/quiz/interaktiv/typen";

import bruchrechnenGym6 from "@/lib/quiz/interaktiv/bruchrechnen-gym6";
import dezimalbruecheGym6 from "@/lib/quiz/interaktiv/dezimalbrueche-gym6";
import prozentGym6 from "@/lib/quiz/interaktiv/prozent-gym6";
import teilbarkeitGym6 from "@/lib/quiz/interaktiv/teilbarkeit-gym6";
import ganzeZahlenGym6 from "@/lib/quiz/interaktiv/ganze-zahlen-gym6";

// Interaktive Aufgabensätze. Schlüssel = fach|schulart|klasse|thema(ohne Emoji).
// Gymnasium Klasse 6 ist die erste komplett ausgebaute Klasse.
const INTERAKTIV: Record<string, Aufgabe[]> = {
  [themaKey("mathe", "gymnasium", 6, "Bruchrechnen")]: bruchrechnenGym6,
  [themaKey("mathe", "gymnasium", 6, "Dezimalbrüche")]: dezimalbruecheGym6,
  [themaKey("mathe", "gymnasium", 6, "Prozent — Grundlagen")]: prozentGym6,
  [themaKey("mathe", "gymnasium", 6, "Teilbarkeit & Primfaktoren")]: teilbarkeitGym6,
  [themaKey("mathe", "gymnasium", 6, "Ganze Zahlen (negativ)")]: ganzeZahlenGym6,
};

/** Interaktive Aufgaben für eine Auswahl (null, wenn noch nichts hinterlegt). */
export function getAufgaben(
  fach: Fach,
  schulart: SchulartId,
  klasse: number,
  thema: string,
): Aufgabe[] | null {
  const key = themaKey(fach, schulart, klasse, thema);
  return INTERAKTIV[key] ?? null;
}

/**
 * Liste aller Auswahl-Schlüssel (fach|schulart|klasse|thema), die spielbar sind.
 * Damit blendet die Oberfläche „Bald verfügbar" korrekt ein.
 */
export function verfuegbareKeys(): string[] {
  return Object.keys(INTERAKTIV).filter((k) => INTERAKTIV[k].length > 0);
}

/** Kleine Statistik (nur für Logging/Übersicht). */
export function bestand(): { themen: number; aufgaben: number } {
  let themen = 0;
  let aufgaben = 0;
  for (const liste of Object.values(INTERAKTIV)) {
    if (liste.length > 0) {
      themen += 1;
      aufgaben += liste.length;
    }
  }
  return { themen, aufgaben };
}
