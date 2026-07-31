-- =============================================================================
-- Migration 2 für den Terminkalender
-- In Supabase → SQL Editor einfügen → Run (einmalig).
--
-- Neu: dauerhafte (wöchentlich wiederkehrende) Blockierungen durch Kleana,
--      z. B. "jeden Samstag 11:00 dauerhaft geblockt".
-- =============================================================================

create table if not exists public.weekly_blocks (
  id         uuid primary key default gen_random_uuid(),
  weekday    int not null check (weekday between 0 and 6),  -- 0=Mo .. 6=So
  hour       int not null check (hour between 8 and 19),
  created_at timestamptz not null default now(),
  unique (weekday, hour)
);

-- Nur über die sichere API (Service-Role) beschreibbar; RLS an, keine anon-Rechte.
alter table public.weekly_blocks enable row level security;
