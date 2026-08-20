-- ===========================================================================
-- KLASSENZIMMER V6: Lernmaterial-Bereich (schwarzes Brett für alle)
--
-- Kleana lädt Lernmaterial EINMAL hoch (optional mit kurzer Beschreibung),
-- und alle Schüler sehen es in ihrem Klassenzimmer unter "Lernmaterial" -
-- wie ein Blog. Dafür bekommt class_files eine Beschreibungs-Spalte.
--
-- Ausführen: Supabase Studio -> SQL Editor -> einfügen -> Run.
-- Die Migration ist wiederholbar (idempotent).
-- ===========================================================================

alter table public.class_files add column if not exists beschreibung text;
