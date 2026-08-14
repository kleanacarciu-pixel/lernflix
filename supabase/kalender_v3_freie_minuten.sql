-- ===========================================================================
-- KALENDER V3: Frei wählbare Minuten (wie Outlook)
--
-- Die Dauer ist nicht mehr auf 30/45/60/90 beschränkt: erlaubt ist jetzt
-- alles von 15 bis 240 Minuten in 5-Minuten-Schritten (z. B. auch 50 oder 75).
--
-- Ausführen: Supabase Studio -> SQL Editor -> einfügen -> Run.
-- Die Migration ist wiederholbar (idempotent).
-- ===========================================================================

alter table public.fixed_slots  drop constraint if exists fixed_slots_dauer_min_check;
alter table public.appointments drop constraint if exists appointments_dauer_min_check;

alter table public.fixed_slots  add constraint fixed_slots_dauer_min_check
  check (dauer_min between 15 and 240 and dauer_min % 5 = 0);
alter table public.appointments add constraint appointments_dauer_min_check
  check (dauer_min between 15 and 240 and dauer_min % 5 = 0);
