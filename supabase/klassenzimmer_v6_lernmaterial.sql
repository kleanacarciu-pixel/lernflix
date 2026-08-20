-- ===========================================================================
-- KLASSENZIMMER V6: Lernmaterial-Bereich + Chat-Anhänge
--
-- 1) Lernmaterial: Kleana lädt EINMAL hoch (optional mit Beschreibung),
--    alle Schüler sehen es unter "Lernmaterial" - wie ein schwarzes Brett.
-- 2) Chat-Anhänge: Fotos/Dateien direkt im Chat verschicken - auch die
--    Schüler können hochladen (z. B. Foto der Hausaufgabe).
--
-- Ausführen: Supabase Studio -> SQL Editor -> einfügen -> Run.
-- Die Migration ist wiederholbar (idempotent).
-- ===========================================================================

alter table public.class_files add column if not exists beschreibung text;

alter table public.class_messages add column if not exists datei_pfad text;
alter table public.class_messages add column if not exists datei_name text;
