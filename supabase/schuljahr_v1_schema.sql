-- =============================================================================
-- Lerne mit Anna – Schuljahresmodell, Teil 1: Schuljahr- und Ferienkalender
--
-- In Supabase ausführen:  Dashboard → SQL Editor → dieses Skript einfügen → Run
--
-- Grundlage für die Termin-Engine: Aus Schuljahr-Zeitraum minus unterrichts-
-- freie Tage ergeben sich die konkreten Termine eines Wochentags.
--
-- Zwei Arten von freien Tagen:
--   * Schulferien      – gelten für den bayerischen Standardkalender
--                        (schule_id IS NULL) oder für genau eine Schule
--                        (schule_id gesetzt, z. B. internationale Schulen).
--   * Gesetzliche      – ist_feiertag = true. Gelten IMMER für alle Schüler,
--     Feiertage          unabhängig von der Schule, und haben deshalb nie
--                        eine schule_id.
--
-- Bestehende Tabellen (profiles, fixed_slots, appointments, weekly_blocks)
-- bleiben unverändert – dieses Skript legt nur neue Tabellen an.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1) SCHULJAHRE
-- ---------------------------------------------------------------------------
create table if not exists public.schuljahre (
  id               uuid primary key default gen_random_uuid(),
  name             text not null unique,          -- z. B. "2026/27"
  erster_schultag  date not null,
  letzter_schultag date not null,
  aktiv            boolean not null default false,
  created_at       timestamptz not null default now(),
  constraint schuljahr_zeitraum check (letzter_schultag > erster_schultag)
);

-- Höchstens ein aktives Schuljahr gleichzeitig.
create unique index if not exists schuljahre_nur_ein_aktives
  on public.schuljahre (aktiv) where aktiv;

-- ---------------------------------------------------------------------------
-- 2) SCHULEN  (nur für Schulen mit abweichenden Ferienzeiten nötig)
-- ---------------------------------------------------------------------------
create table if not exists public.schulen (
  id         uuid primary key default gen_random_uuid(),
  name       text not null unique,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 3) UNTERRICHTSFREIE TAGE
-- ---------------------------------------------------------------------------
create table if not exists public.unterrichtsfreie_tage (
  id           uuid primary key default gen_random_uuid(),
  schuljahr_id uuid not null references public.schuljahre(id) on delete cascade,
  schule_id    uuid references public.schulen(id) on delete cascade,  -- NULL = bayerischer Standardkalender
  bezeichnung  text not null,
  datum_von    date not null,
  datum_bis    date not null,
  ist_feiertag boolean not null default false,
  created_at   timestamptz not null default now(),
  constraint freie_tage_zeitraum check (datum_bis >= datum_von),
  -- Ein gesetzlicher Feiertag gilt für alle und gehört daher zu keiner Schule.
  constraint feiertag_ohne_schule check (not (ist_feiertag and schule_id is not null))
);

create index if not exists unterrichtsfreie_tage_schuljahr_idx
  on public.unterrichtsfreie_tage (schuljahr_id, schule_id);
create index if not exists unterrichtsfreie_tage_zeitraum_idx
  on public.unterrichtsfreie_tage (schuljahr_id, datum_von, datum_bis);

-- ---------------------------------------------------------------------------
-- 4) BERECHTIGUNGEN
--    Lesen: alle angemeldeten Nutzer (Portal zeigt Terminlisten an).
--    Ändern: nur Kleana (Admin) – public.is_admin() stammt aus kalender_schema.sql
-- ---------------------------------------------------------------------------
alter table public.schuljahre            enable row level security;
alter table public.schulen               enable row level security;
alter table public.unterrichtsfreie_tage enable row level security;

drop policy if exists schuljahre_lesen on public.schuljahre;
create policy schuljahre_lesen on public.schuljahre
  for select using (auth.uid() is not null);
drop policy if exists schuljahre_admin on public.schuljahre;
create policy schuljahre_admin on public.schuljahre
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists schulen_lesen on public.schulen;
create policy schulen_lesen on public.schulen
  for select using (auth.uid() is not null);
drop policy if exists schulen_admin on public.schulen;
create policy schulen_admin on public.schulen
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists freie_tage_lesen on public.unterrichtsfreie_tage;
create policy freie_tage_lesen on public.unterrichtsfreie_tage
  for select using (auth.uid() is not null);
drop policy if exists freie_tage_admin on public.unterrichtsfreie_tage;
create policy freie_tage_admin on public.unterrichtsfreie_tage
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- 5) STAMMDATEN SCHULJAHR 2026/27 (bayerischer Kalender)
--    Mehrfaches Ausführen ist unschädlich.
--
--    Geprüft: Mit genau diesen Zeiträumen ergeben sich ab dem ersten Schultag
--    Mo 37, Di 38, Mi 37, Do 36, Fr 37 Termine – die Sollwerte der Termin-Engine.
-- ---------------------------------------------------------------------------
insert into public.schuljahre (name, erster_schultag, letzter_schultag, aktiv)
values ('2026/27', date '2026-09-15', date '2027-07-30', true)
on conflict (name) do update
  set erster_schultag  = excluded.erster_schultag,
      letzter_schultag = excluded.letzter_schultag;

with sj as (select id from public.schuljahre where name = '2026/27'),
     daten (bezeichnung, datum_von, datum_bis, ist_feiertag) as (
       values
         -- Gesetzliche Feiertage gelten für ALLE Schüler, auch für Schulen mit
         -- eigenem Ferienkalender (ist_feiertag = true). Die beiden folgenden
         -- fallen 2026/27 auf einen Samstag – für Samstagstermine zählen sie.
         ('Tag der Deutschen Einheit', date '2026-10-03', date '2026-10-03', true),
         ('Herbstferien',        date '2026-11-02', date '2026-11-06', false),
         ('Buß- und Bettag',     date '2026-11-18', date '2026-11-18', false),
         ('Weihnachtsferien',    date '2026-12-24', date '2027-01-08', false),
         ('Frühjahrsferien',     date '2027-02-08', date '2027-02-12', false),
         ('Osterferien',         date '2027-03-22', date '2027-04-02', false),
         ('Tag der Arbeit',      date '2027-05-01', date '2027-05-01', true),
         ('Christi Himmelfahrt', date '2027-05-06', date '2027-05-06', true),
         ('Pfingstmontag',       date '2027-05-17', date '2027-05-17', true),
         ('Pfingstferien',       date '2027-05-18', date '2027-05-28', false)
     )
insert into public.unterrichtsfreie_tage
       (schuljahr_id, schule_id, bezeichnung, datum_von, datum_bis, ist_feiertag)
select sj.id, null, d.bezeichnung, d.datum_von, d.datum_bis, d.ist_feiertag
from sj cross join daten d
where not exists (
  select 1 from public.unterrichtsfreie_tage u
  where u.schuljahr_id = sj.id
    and u.schule_id is null
    and u.bezeichnung = d.bezeichnung
);
