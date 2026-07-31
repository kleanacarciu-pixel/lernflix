-- =============================================================================
-- Migration 1 für den Terminkalender
-- In Supabase → SQL Editor einfügen → Run (einmalig auf der bestehenden DB).
--
-- Ändert:
--  1) Öffnungszeiten ab 8:00 Uhr an allen Tagen
--     (Mo–Fr 8–20 Uhr, Sa/So 8–19 Uhr → Startzeiten Mo–Fr 8–19, Sa/So 8–18)
--  2) Neues Feld "mode" (online / vor Ort) für Termine und feste Slots
-- =============================================================================

-- 1) Stunden ab 8:00 erlauben ------------------------------------------------
alter table public.fixed_slots  drop constraint if exists fixed_slots_hour_check;
alter table public.fixed_slots  add  constraint fixed_slots_hour_check check (hour between 8 and 19);
alter table public.appointments drop constraint if exists appointments_hour_check;
alter table public.appointments add  constraint appointments_hour_check check (hour between 8 and 19);

alter table public.fixed_slots  drop constraint if exists fixed_within_hours;
alter table public.fixed_slots  add  constraint fixed_within_hours check (
  (weekday between 0 and 4 and hour between 8 and 19) or
  (weekday between 5 and 6 and hour between 8 and 18)
);

alter table public.appointments drop constraint if exists appt_within_hours;
alter table public.appointments add  constraint appt_within_hours check (
  (extract(dow from slot_date) between 1 and 5 and hour between 8 and 19) or
  (extract(dow from slot_date) in (0,6)          and hour between 8 and 18)
);

-- 2) Modus: online / vor Ort -------------------------------------------------
alter table public.fixed_slots  add column if not exists mode text check (mode in ('online','vor_ort'));
alter table public.appointments add column if not exists mode text check (mode in ('online','vor_ort'));
