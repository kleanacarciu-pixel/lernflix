-- ===========================================================================
-- SICHERHEIT V1: Automatisches Backup + "Schüler entfernen" rückgängig machbar
--
-- 1) Schüler-Konten werden ab jetzt beim Entfernen nur noch GESPERRT statt
--    endgültig gelöscht (deleted_at). Verträge, Zahlungen, Termine und der
--    Klassenzimmer-Verlauf bleiben dabei vollständig erhalten und lassen
--    sich bei Bedarf sofort wiederherstellen.
-- 2) Ein privater Speicher-Ordner ("backups") für die tägliche automatische
--    Datensicherung (siehe /api/cron/backup).
--
-- Ausführen: Supabase Studio -> SQL Editor -> einfügen -> Run.
-- Die Migration ist wiederholbar (idempotent).
-- ===========================================================================

alter table public.profiles add column if not exists deleted_at timestamptz;

insert into storage.buckets (id, name, public)
values ('backups', 'backups', false)
on conflict (id) do nothing;
