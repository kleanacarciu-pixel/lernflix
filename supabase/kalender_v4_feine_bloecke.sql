-- ===========================================================================
-- KALENDER V4: Minutengenaue Zeiten für Kleana (5-Minuten-Raster)
--
-- Kleana kann jetzt minutengenau arbeiten, z. B. 16:15–16:20 blockieren
-- oder einen Termin um 8:05 statt 8:00 eintragen:
--  1) Start-Zeiten dürfen im 5-Minuten-Raster liegen (Schüler-Buchungen
--     bleiben in der App bei :00/:30 – nur Kleana nutzt das feine Raster)
--  2) Die Dauer darf ab 5 Minuten beginnen (vorher 15)
--
-- Ausführen: Supabase Studio -> SQL Editor -> einfügen -> Run.
-- Die Migration ist wiederholbar (idempotent).
-- ===========================================================================

-- 1) 5-Minuten-Raster (mit Toleranz für Kommazahl-Rundung) -------------------
alter table public.appointments drop constraint if exists appointments_hour_check;
alter table public.appointments add constraint appointments_hour_check
  check (abs(hour * 12 - round(hour * 12)) < 0.001);
alter table public.fixed_slots drop constraint if exists fixed_slots_hour_check;
alter table public.fixed_slots add constraint fixed_slots_hour_check
  check (abs(hour * 12 - round(hour * 12)) < 0.001);

-- 2) Öffnungszeiten als Bereich (Ende prüft die App) -------------------------
alter table public.appointments drop constraint if exists appt_within_hours;
alter table public.appointments add constraint appt_within_hours check (
  (extract(dow from slot_date) between 1 and 5 and hour >= 8 and hour < 20) or
  (extract(dow from slot_date) in (0,6)          and hour >= 8 and hour < 19)
);
alter table public.fixed_slots drop constraint if exists fixed_within_hours;
alter table public.fixed_slots add constraint fixed_within_hours check (
  (weekday between 0 and 4 and hour >= 8 and hour < 20) or
  (weekday between 5 and 6 and hour >= 8 and hour < 19)
);

-- 3) Dauer ab 5 Minuten ------------------------------------------------------
alter table public.fixed_slots  drop constraint if exists fixed_slots_dauer_min_check;
alter table public.appointments drop constraint if exists appointments_dauer_min_check;
alter table public.fixed_slots  add constraint fixed_slots_dauer_min_check
  check (dauer_min between 5 and 240 and dauer_min % 5 = 0);
alter table public.appointments add constraint appointments_dauer_min_check
  check (dauer_min between 5 and 240 and dauer_min % 5 = 0);
