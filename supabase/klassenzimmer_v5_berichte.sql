-- ===========================================================================
-- KLASSENZIMMER V5: KI-Stundenberichte + Datei-Kategorien
--
-- 1) lesson_reports: Kleana tippt kurz, was in der Stunde gemacht wurde,
--    die KI schreibt daraus einen Bericht (Erklärung, Beispiele,
--    Hausaufgaben) - gespeichert pro Schüler, als Zeitleiste sichtbar.
--    Auch Wiederholungs-Quizze landen hier (art = 'quiz').
-- 2) class_files.category: Dateien bekommen Ecken (Arbeitsblätter,
--    Hausaufgaben, Sonstiges).
--
-- Ausführen: Supabase Studio -> SQL Editor -> einfügen -> Run.
-- Die Migration ist wiederholbar (idempotent).
-- ===========================================================================

create table if not exists public.lesson_reports (
  id         uuid primary key default gen_random_uuid(),
  student_id uuid not null,
  titel      text not null,
  art        text not null default 'bericht' check (art in ('bericht','quiz')),
  eingabe    text,           -- Kleanas Stichpunkte (nur für sie sichtbar)
  inhalt     text not null,  -- der fertige Bericht (Markdown)
  created_at timestamptz not null default now()
);
create index if not exists lesson_reports_student_idx
  on public.lesson_reports (student_id, created_at desc);

-- Nur über die sichere API (Service-Role) lesbar/schreibbar
alter table public.lesson_reports enable row level security;

alter table public.class_files add column if not exists category text not null default 'sonstiges';
