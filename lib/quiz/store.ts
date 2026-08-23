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
import groessenGym6 from "@/lib/quiz/interaktiv/groessen-gym6";
import flaecheGym6 from "@/lib/quiz/interaktiv/flaeche-gym6";
import volumenGym6 from "@/lib/quiz/interaktiv/volumen-gym6";
import winkelGym6 from "@/lib/quiz/interaktiv/winkel-gym6";
import symmetrieGym6 from "@/lib/quiz/interaktiv/symmetrie-gym6";
import datenGym6 from "@/lib/quiz/interaktiv/daten-gym6";

import natZahlenGym5 from "@/lib/quiz/interaktiv/nat-zahlen-gym5";
import rechnenGym5 from "@/lib/quiz/interaktiv/rechnen-gym5";
import malnehmenGym5 from "@/lib/quiz/interaktiv/malnehmen-gym5";
import teilbarkeitGym5 from "@/lib/quiz/interaktiv/teilbarkeit-gym5";
import groessenGym5 from "@/lib/quiz/interaktiv/groessen-gym5";
import flaecheGym5 from "@/lib/quiz/interaktiv/flaeche-gym5";
import geometrieGym5 from "@/lib/quiz/interaktiv/geometrie-gym5";
import symmetrieGym5 from "@/lib/quiz/interaktiv/symmetrie-gym5";

import prozentZinsGym7 from "@/lib/quiz/interaktiv/prozent-zins-gym7";
import dreisatzGym7 from "@/lib/quiz/interaktiv/dreisatz-gym7";
import termeGym7 from "@/lib/quiz/interaktiv/terme-gym7";
import gleichungenGym7 from "@/lib/quiz/interaktiv/gleichungen-gym7";
import winkelDreieckeGym7 from "@/lib/quiz/interaktiv/winkel-dreiecke-gym7";
import wahrscheinlichkeitGym7 from "@/lib/quiz/interaktiv/wahrscheinlichkeit-gym7";

import lineareFunktionenGym8 from "@/lib/quiz/interaktiv/lineare-funktionen-gym8";
import lgsGym8 from "@/lib/quiz/interaktiv/lgs-gym8";
import binomeGym8 from "@/lib/quiz/interaktiv/binome-gym8";
import wurzelnGym8 from "@/lib/quiz/interaktiv/wurzeln-gym8";
import kreisGym8 from "@/lib/quiz/interaktiv/kreis-gym8";
import wahrscheinlichkeit2Gym8 from "@/lib/quiz/interaktiv/wahrscheinlichkeit2-gym8";

// Interaktive Aufgabensätze. Schlüssel = fach|schulart|klasse|thema(ohne Emoji).
// Gymnasium Klasse 6 (alle Themen) und Klasse 5 (alle Themen) sind fertig.
const INTERAKTIV: Record<string, Aufgabe[]> = {
  [themaKey("mathe", "gymnasium", 5, "Natürliche Zahlen & Stellenwert")]: natZahlenGym5,
  [themaKey("mathe", "gymnasium", 5, "Rechnen mit natürlichen Zahlen")]: rechnenGym5,
  [themaKey("mathe", "gymnasium", 5, "Multiplizieren & Dividieren")]: malnehmenGym5,
  [themaKey("mathe", "gymnasium", 5, "Teilbarkeit & Primzahlen")]: teilbarkeitGym5,
  [themaKey("mathe", "gymnasium", 5, "Größen & Einheiten")]: groessenGym5,
  [themaKey("mathe", "gymnasium", 5, "Umfang & Flächeninhalt")]: flaecheGym5,
  [themaKey("mathe", "gymnasium", 5, "Geometrie & Koordinaten")]: geometrieGym5,
  [themaKey("mathe", "gymnasium", 5, "Achsensymmetrie")]: symmetrieGym5,

  [themaKey("mathe", "gymnasium", 7, "Prozent- & Zinsrechnung")]: prozentZinsGym7,
  [themaKey("mathe", "gymnasium", 7, "Proportionalität & Dreisatz")]: dreisatzGym7,
  [themaKey("mathe", "gymnasium", 7, "Terme & Termumformung")]: termeGym7,
  [themaKey("mathe", "gymnasium", 7, "Lineare Gleichungen")]: gleichungenGym7,
  [themaKey("mathe", "gymnasium", 7, "Winkel & Dreiecke")]: winkelDreieckeGym7,
  [themaKey("mathe", "gymnasium", 7, "Wahrscheinlichkeit")]: wahrscheinlichkeitGym7,

  [themaKey("mathe", "gymnasium", 8, "Lineare Funktionen")]: lineareFunktionenGym8,
  [themaKey("mathe", "gymnasium", 8, "Lineare Gleichungssysteme")]: lgsGym8,
  [themaKey("mathe", "gymnasium", 8, "Binomische Formeln")]: binomeGym8,
  [themaKey("mathe", "gymnasium", 8, "Wurzeln & reelle Zahlen")]: wurzelnGym8,
  [themaKey("mathe", "gymnasium", 8, "Kreis: Umfang & Fläche")]: kreisGym8,
  [themaKey("mathe", "gymnasium", 8, "Wahrscheinlichkeit (mehrstufig)")]: wahrscheinlichkeit2Gym8,
  [themaKey("mathe", "gymnasium", 6, "Bruchrechnen")]: bruchrechnenGym6,
  [themaKey("mathe", "gymnasium", 6, "Dezimalbrüche")]: dezimalbruecheGym6,
  [themaKey("mathe", "gymnasium", 6, "Ganze Zahlen (negativ)")]: ganzeZahlenGym6,
  [themaKey("mathe", "gymnasium", 6, "Prozent — Grundlagen")]: prozentGym6,
  [themaKey("mathe", "gymnasium", 6, "Teilbarkeit & Primfaktoren")]: teilbarkeitGym6,
  [themaKey("mathe", "gymnasium", 6, "Rechnen mit Größen")]: groessenGym6,
  [themaKey("mathe", "gymnasium", 6, "Flächeninhalt & Umfang")]: flaecheGym6,
  [themaKey("mathe", "gymnasium", 6, "Volumen & Oberfläche")]: volumenGym6,
  [themaKey("mathe", "gymnasium", 6, "Winkel")]: winkelGym6,
  [themaKey("mathe", "gymnasium", 6, "Symmetrie")]: symmetrieGym6,
  [themaKey("mathe", "gymnasium", 6, "Daten & Diagramme")]: datenGym6,
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
