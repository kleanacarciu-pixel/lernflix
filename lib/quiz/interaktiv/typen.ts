// ============================================================================
// Interaktive Aufgaben-Engine (Anton-/sofatutor-Stil)
// ----------------------------------------------------------------------------
// Verschiedene Aufgaben-Typen statt nur Multiple Choice. Framework-neutral
// (kein React), damit die Typen und die Prüf-Logik auch serverseitig nutzbar
// sind. Die eigentliche Darstellung passiert in app/quiz/interaktiv.tsx.
// ============================================================================

// --- Ein Lückentext besteht aus festen Text-Teilen und Lücken zum Eintippen.
export type LueckeSegment = string | { luecke: string[]; breite?: number };

export type MCAufgabe = {
  typ: "mc";
  frage: string;
  antworten: string[];
  richtig: number; // Index der richtigen Antwort
  erklaerung: string;
};

export type InputAufgabe = {
  typ: "input";
  frage: string;
  loesung: string[]; // akzeptierte Schreibweisen (z. B. ["1 1/2", "3/2"])
  einheit?: string; // wird hinter dem Eingabefeld angezeigt (z. B. "min", "€")
  platzhalter?: string;
  hinweis?: string; // optionaler Tipp
  erklaerung: string;
};

export type LueckeAufgabe = {
  typ: "luecke";
  frage: string;
  segmente: LueckeSegment[];
  erklaerung: string;
};

export type ZuordnenPaar = { links: string; rechts: string };
export type ZuordnenAufgabe = {
  typ: "zuordnen";
  frage: string;
  paare: ZuordnenPaar[];
  erklaerung: string;
};

export type SortierenAufgabe = {
  typ: "sortieren";
  frage: string;
  hinweis?: string;
  richtig: string[]; // korrekte Reihenfolge (wird zur Anzeige gemischt)
  erklaerung: string;
};

export type Aufgabe =
  | MCAufgabe
  | InputAufgabe
  | LueckeAufgabe
  | ZuordnenAufgabe
  | SortierenAufgabe;

// --- Antwort-Prüfung -------------------------------------------------------

/** Vereinheitlicht eine Eingabe: Leerzeichen, Schrägstriche, Komma/Punkt. */
export function normAntwort(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/[−–—]/g, "-") // Minus/Gedankenstrich -> normales "-"
    .replace(/\s+/g, " ")
    .replace(/\s*\/\s*/g, "/") // "3 / 4" -> "3/4"
    .replace(/(\d),(\d)/g, "$1.$2"); // Dezimalkomma -> Punkt (0,75 -> 0.75)
}

/** True, wenn die Eingabe einer der akzeptierten Schreibweisen entspricht. */
export function istRichtigInput(eingabe: string, akzeptiert: string[]): boolean {
  const u = normAntwort(eingabe);
  if (u === "") return false;
  return akzeptiert.some((a) => normAntwort(a) === u);
}

/** Anzahl der Lücken in einer Lückentext-Aufgabe. */
export function anzahlLuecken(a: LueckeAufgabe): number {
  return a.segmente.filter((s) => typeof s !== "string").length;
}
