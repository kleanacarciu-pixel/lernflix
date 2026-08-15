-- ===========================================================================
-- KALENDER V6: Dauer-Blockierungen minutengenau
--
-- Bisher konnte "jeden Di dauerhaft blockieren" nur volle Stunden
-- (fest 60 Minuten, Start nur :00/:30). Jetzt bekommt die Tabelle
-- weekly_blocks eine frei wählbare Dauer (5-300 Min.) und Start-Zeiten
-- auf jede Minute genau - wie bei allen anderen Terminen.
--
-- Ausführen: Supabase Studio -> SQL Editor -> einfügen -> Run.
-- Die Migration ist wiederholbar (idempotent).
-- ===========================================================================

alter table public.weekly_blocks drop constraint if exists weekly_blocks_hour_check;
alter table public.weekly_blocks add constraint weekly_blocks_hour_check
  check (abs(hour * 60 - round(hour * 60)) < 0.01 and hour >= 8 and hour < 20);

alter table public.weekly_blocks add column if not exists dauer_min int not null default 60;
alter table public.weekly_blocks drop constraint if exists weekly_blocks_dauer_min_check;
alter table public.weekly_blocks add constraint weekly_blocks_dauer_min_check
  check (dauer_min between 5 and 300);
