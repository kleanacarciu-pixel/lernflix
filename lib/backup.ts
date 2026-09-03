// =============================================================================
// Tägliche Datensicherung – dumpt alle Tabellen als JSON in den privaten
// Storage-Ordner "backups". Genutzt von app/api/cron/backup (automatisch)
// und den Export-Aktionen für Kleana (Kalender-CSV, Verträge/Zahlungen-JSON).
// =============================================================================
import { service } from "@/lib/kalender";

// Alle Tabellen der App – bewusst vollständig, auch selten genutzte, damit
// bei einer Wiederherstellung nichts fehlt.
export const BACKUP_TABLEN = [
  "profiles", "fixed_slots", "appointments", "weekly_blocks", "slot_mode_overrides",
  "lessons", "lesson_notes", "lesson_participants", "lesson_exercises", "lesson_answers",
  "lesson_reports", "class_messages", "class_files", "student_rewards",
  "schuljahre", "schulen", "unterrichtsfreie_tage",
  "vertraege", "vertrag_zeiten", "zahlungen", "mahn_vorlagen", "plusstunden_abrechnungen",
  "admin_einstellungen",
  // Content-Engine (Quiz-Themen und erzeugte Pakete)
  "topics", "content_log",
] as const;

// Sortierspalte je Tabelle: Die Seiten-Abfragen (range) brauchen eine feste
// Reihenfolge – ohne ORDER BY darf die Datenbank jede Seite anders sortieren,
// und bei Tabellen über 1000 Zeilen fehlten dann still Zeilen oder kamen
// doppelt. Standard ist "id"; abweichende Schlüssel stehen hier.
const SORTIERSPALTE: Record<string, string> = {
  profiles: "user_id",
  mahn_vorlagen: "schluessel",
  admin_einstellungen: "schluessel",
};

const SEITE = 1000;

// Eine Tabelle vollständig laden (paginiert – Supabase liefert sonst nur
// die ersten 1000 Zeilen).
async function ladeTabelle(name: string): Promise<unknown[]> {
  const sb = service();
  const alle: unknown[] = [];
  const sortierung = SORTIERSPALTE[name] || "id";
  let von = 0;
  for (;;) {
    const { data, error } = await sb.from(name).select("*")
      .order(sortierung, { ascending: true })
      .range(von, von + SEITE - 1);
    if (error) {
      // NUR eine fehlende Tabelle ist harmlos (Migration noch nicht
      // ausgeführt) – jede andere Störung muss die Sicherung laut scheitern
      // lassen. Vorher wurde JEDER Fehler verschluckt: Das Backup meldete
      // „ok", enthielt die Tabelle aber leer oder halb.
      if (error.code === "42P01" || /does not exist/i.test(error.message)) return alle;
      throw new Error(`Tabelle „${name}" ließ sich nicht sichern: ${error.message}`);
    }
    alle.push(...(data || []));
    if (!data || data.length < SEITE) break;
    von += SEITE;
  }
  return alle;
}

export type Sicherung = { erstellt_am: string; tabellen: Record<string, unknown[]> };

export async function ladeAlleTabellen(): Promise<Sicherung> {
  const tabellen: Record<string, unknown[]> = {};
  for (const name of BACKUP_TABLEN) {
    tabellen[name] = await ladeTabelle(name);
  }
  return { erstellt_am: new Date().toISOString(), tabellen };
}
