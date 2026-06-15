-- Content-Engine (Phase 2b): Spalten fuer die Manim-Animation.
-- Einmal im Supabase SQL-Editor ausfuehren.

alter table content_log add column if not exists animation_url text;
alter table content_log add column if not exists animation_status text default 'none';
-- animation_status: none | rendering | ready | failed
alter table content_log add column if not exists manim_code text;
-- manim_code: zuletzt erfolgreich gerenderter Manim-Code (zur Nachvollziehbarkeit)

-- Ausserdem im Dashboard noetig (Storage):
--   Storage -> New bucket -> Name "shorts" -> Public bucket aktivieren.
-- Dorthin laedt der Renderer die fertigen MP4s (oeffentlich abspielbar).
