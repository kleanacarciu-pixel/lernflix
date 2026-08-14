-- ===========================================================================
-- KALENDER V5: Völlig freie Zeiten (jede Minute, z. B. 16:33)
--
-- Start-Zeiten dürfen auf jeder Minute liegen, die Dauer ist frei
-- (5 Minuten bis 5 Stunden). Damit können Schüler und Kleana die Zeiten
-- einfach eintippen – ohne Raster-Zwang.
--
-- Ausführen: Supabase Studio -> SQL Editor -> einfügen -> Run.
-- Die Migration ist wiederholbar (idempotent).
-- ===========================================================================

alter table public.appointments drop constraint if exists appointments_hour_check;
alter table public.appointments add constraint appointments_hour_check
  check (abs(hour * 60 - round(hour * 60)) < 0.01); -- jede volle Minute

alter table public.fixed_slots drop constraint if exists fixed_slots_hour_check;
alter table public.fixed_slots add constraint fixed_slots_hour_check
  check (abs(hour * 60 - round(hour * 60)) < 0.01);

alter table public.fixed_slots  drop constraint if exists fixed_slots_dauer_min_check;
alter table public.appointments drop constraint if exists appointments_dauer_min_check;
alter table public.fixed_slots  add constraint fixed_slots_dauer_min_check
  check (dauer_min between 5 and 300);
alter table public.appointments add constraint appointments_dauer_min_check
  check (dauer_min between 5 and 300);
