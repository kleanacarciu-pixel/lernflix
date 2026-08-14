-- ===========================================================================
-- KALENDER V2: Halbstunden-Raster + wählbare Stundenlänge (wie Outlook)
--
-- Was diese Migration kann:
--  1) Startzeiten auch zur halben Stunde (14:30) – die Spalte hour wird
--     zur Kommazahl (14.5 = 14:30); bestehende Einträge bleiben unverändert
--  2) Jede Buchung bekommt eine Dauer (30/45/60/90 Minuten, Standard 60) –
--     bestehende Einträge gelten automatisch als 60 Minuten
--
-- Ausführen: Supabase Studio -> SQL Editor -> einfügen -> Run.
-- Die Migration ist wiederholbar (idempotent).
-- ===========================================================================

-- 1) Alte Prüfungen lösen (werden unten neu gesetzt) -------------------------
alter table public.fixed_slots   drop constraint if exists fixed_slots_hour_check;
alter table public.fixed_slots   drop constraint if exists fixed_within_hours;
alter table public.appointments  drop constraint if exists appointments_hour_check;
alter table public.appointments  drop constraint if exists appt_within_hours;
alter table public.weekly_blocks drop constraint if exists weekly_blocks_hour_check;

-- 2) hour wird zur Kommazahl (14.5 = 14:30) ----------------------------------
alter table public.fixed_slots   alter column hour type double precision using hour::double precision;
alter table public.appointments  alter column hour type double precision using hour::double precision;
alter table public.weekly_blocks alter column hour type double precision using hour::double precision;
alter table public.slot_mode_overrides alter column hour type double precision using hour::double precision;

-- 3) Neue Prüfungen: nur :00/:30, innerhalb der Öffnungszeiten ---------------
alter table public.fixed_slots add constraint fixed_slots_hour_check
  check (hour * 2 = floor(hour * 2));
alter table public.fixed_slots add constraint fixed_within_hours check (
  (weekday between 0 and 4 and hour between 8 and 19.5) or
  (weekday between 5 and 6 and hour between 8 and 18.5)
);
alter table public.appointments add constraint appointments_hour_check
  check (hour * 2 = floor(hour * 2));
alter table public.appointments add constraint appt_within_hours check (
  (extract(dow from slot_date) between 1 and 5 and hour between 8 and 19.5) or
  (extract(dow from slot_date) in (0,6)          and hour between 8 and 18.5)
);
alter table public.weekly_blocks add constraint weekly_blocks_hour_check
  check (hour * 2 = floor(hour * 2) and hour between 8 and 19.5);

-- 4) Dauer pro Buchung (Minuten) ---------------------------------------------
alter table public.fixed_slots  add column if not exists dauer_min int not null default 60
  check (dauer_min in (30,45,60,90));
alter table public.appointments add column if not exists dauer_min int not null default 60
  check (dauer_min in (30,45,60,90));
