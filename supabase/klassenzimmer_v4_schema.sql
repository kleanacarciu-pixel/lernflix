-- ===========================================================================
-- KLASSENZIMMER V4: Kalender <-> Klassenzimmer perfekt synchron
--
-- Was diese Migration kann:
--  1) Stunden (lessons) bekommen einen Modus: 'online' oder 'vor_ort'
--  2) Automatisch erzeugte Stunden werden eindeutig (kein Doppel pro
--     Schüler + Startzeit) – dafür vorher evtl. vorhandene Doppel aufräumen
--  3) Neue Tabelle slot_mode_overrides: ein Schüler stellt EINE konkrete
--     Stunde auf online (oder zurück auf vor Ort), ohne den festen
--     Wochentermin zu ändern
--
-- Ausführen: Supabase Studio -> SQL Editor -> einfügen -> Run.
-- Die Migration ist wiederholbar (idempotent).
-- ===========================================================================

-- 1) Modus pro Stunde --------------------------------------------------------
alter table public.lessons
  add column if not exists mode text not null default 'online'
  check (mode in ('online','vor_ort'));

-- 2) Doppelte automatisch erzeugbare Stunden aufräumen, dann eindeutig machen
delete from public.lessons a
using public.lessons b
where a.student_id is not null
  and a.student_id = b.student_id
  and a.starts_at = b.starts_at
  and a.created_at > b.created_at;

do $$ begin
  alter table public.lessons
    add constraint lessons_student_start_key unique (student_id, starts_at);
exception when duplicate_table or duplicate_object then null; end $$;

-- 3) Pro-Datum-Umstellung online / vor Ort -----------------------------------
create table if not exists public.slot_mode_overrides (
  id         uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(user_id) on delete cascade,
  slot_date  date not null,
  hour       int  not null,
  mode       text not null check (mode in ('online','vor_ort')),
  created_at timestamptz not null default now(),
  unique (student_id, slot_date, hour)
);

-- Zugriff ausschließlich über die Server-API (Service Role) – wie bei den
-- übrigen Kalender-Tabellen bleibt RLS an und es gibt keine offenen Policies.
alter table public.slot_mode_overrides enable row level security;
