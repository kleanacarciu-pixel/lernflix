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
] as const;

const SEITE = 1000;

// Eine Tabelle vollständig laden (paginiert – Supabase liefert sonst nur
// die ersten 1000 Zeilen).
async function ladeTabelle(name: string): Promise<unknown[]> {
  const sb = service();
  const alle: unknown[] = [];
  let von = 0;
  for (;;) {
    const { data, error } = await sb.from(name).select("*").range(von, von + SEITE - 1);
    if (error) {
      // Tabelle gibt es (noch) nicht auf diesem Stand – kein Abbruch, nur
      // ohne diese Tabelle weitermachen.
      return alle;
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
