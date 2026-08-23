-- =============================================================================
-- Lerne mit Anna – Schuljahresmodell, Teil 2: Verträge
--
-- Voraussetzung: schuljahr_v1_schema.sql wurde bereits ausgeführt.
-- In Supabase ausführen:  Dashboard → SQL Editor → dieses Skript einfügen → Run
--
-- Ein Vertrag verbindet einen Schüler (profiles) mit einem Schuljahr und
-- legt Wochentermin(e), Stundensatz und Zahlweise fest. Der Jahresbetrag
-- ergibt sich aus der Termin-Engine (lib/schuljahr.ts) und der Preislogik
-- (lib/vertrag-kern.ts) und wird hier gespeichert, damit Rechnungen und
-- Terminlisten stabil bleiben, auch wenn sich Stammdaten später ändern.
--
-- Beträge stehen als numeric(10,2) in EURO. Gerechnet wird in der Anwendung
-- in Cent; beim Speichern wird auf zwei Nachkommastellen zurückgerechnet.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1) VERTRÄGE
-- ---------------------------------------------------------------------------
create table if not exists public.vertraege (
  id                     uuid primary key default gen_random_uuid(),
  schueler_id            uuid not null references public.profiles(user_id) on delete cascade,
  schuljahr_id           uuid not null references public.schuljahre(id) on delete restrict,
  schule_id              uuid references public.schulen(id) on delete set null,

  stundensatz            numeric(10,2) not null check (stundensatz >= 0),
  stundensatz_zweittermin numeric(10,2) not null check (stundensatz_zweittermin >= 0),
  zweites_kind           boolean not null default false,

  vertragsbeginn         date not null,
  zahlweise              text not null default 'raten' check (zahlweise in ('raten','einmal')),
  jahresbetrag           numeric(10,2) not null default 0 check (jahresbetrag >= 0),

  agb_akzeptiert_am      timestamptz,
  status                 text not null default 'angeboten'
                           check (status in ('angeboten','aktiv','gekuendigt','beendet')),
  kuendigung_zum         date,

  erstellt_am            timestamptz not null default now(),
  geaendert_am           timestamptz not null default now(),

  -- Vertragsbeginn ist immer ein Monatserster (Grundlage der Ratenrechnung).
  constraint vertrag_beginn_monatserster check (extract(day from vertragsbeginn) = 1)
);

-- Je Schüler und Schuljahr höchstens ein laufender Vertrag.
create unique index if not exists vertraege_ein_laufender
  on public.vertraege (schueler_id, schuljahr_id)
  where status in ('angeboten','aktiv');

create index if not exists vertraege_schueler_idx on public.vertraege (schueler_id);
create index if not exists vertraege_schuljahr_idx on public.vertraege (schuljahr_id, status);

-- ---------------------------------------------------------------------------
-- 2) WOCHENTERMINE DES VERTRAGS
--    Ein Vertrag kann einen oder zwei Wochentermine haben.
--    ab_datum / bis_datum bilden den Wochentagswechsel ab (Abschnitt 5):
--    der alte Wochentag bekommt ein bis_datum, der neue ein ab_datum.
--    NULL heißt „ab Schuljahresbeginn" bzw. „bis Schuljahresende".
--    wochentag: 0=Mo .. 6=So (wie in fixed_slots)
-- ---------------------------------------------------------------------------
create table if not exists public.vertrag_zeiten (
  id         uuid primary key default gen_random_uuid(),
  vertrag_id uuid not null references public.vertraege(id) on delete cascade,
  wochentag  smallint not null check (wochentag between 0 and 6),
  uhrzeit    time not null,
  ab_datum   date,
  bis_datum  date,
  erstellt_am timestamptz not null default now(),
  constraint vertrag_zeit_zeitraum check (bis_datum is null or ab_datum is null or bis_datum >= ab_datum)
);

create index if not exists vertrag_zeiten_vertrag_idx on public.vertrag_zeiten (vertrag_id);

-- ---------------------------------------------------------------------------
-- 3) „geaendert_am" automatisch pflegen
-- ---------------------------------------------------------------------------
create or replace function public.vertrag_geaendert() returns trigger
language plpgsql as $$
begin
  new.geaendert_am := now();
  return new;
end;
$$;

drop trigger if exists vertraege_geaendert on public.vertraege;
create trigger vertraege_geaendert before update on public.vertraege
  for each row execute function public.vertrag_geaendert();

-- ---------------------------------------------------------------------------
-- 4) BERECHTIGUNGEN
--    Schüler sehen nur ihren eigenen Vertrag, Kleana alles.
-- ---------------------------------------------------------------------------
alter table public.vertraege      enable row level security;
alter table public.vertrag_zeiten enable row level security;

drop policy if exists vertrag_eigener on public.vertraege;
create policy vertrag_eigener on public.vertraege
  for select using (schueler_id = auth.uid() or public.is_admin());
drop policy if exists vertrag_admin on public.vertraege;
create policy vertrag_admin on public.vertraege
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists vertrag_zeiten_eigene on public.vertrag_zeiten;
create policy vertrag_zeiten_eigene on public.vertrag_zeiten
  for select using (
    public.is_admin() or exists (
      select 1 from public.vertraege v
      where v.id = vertrag_zeiten.vertrag_id and v.schueler_id = auth.uid()
    )
  );
drop policy if exists vertrag_zeiten_admin on public.vertrag_zeiten;
create policy vertrag_zeiten_admin on public.vertrag_zeiten
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- 5) HARTE SPERRE OHNE AGB-BESTÄTIGUNG (Abschnitt 4)
--    Hilfsfunktion für die Buchungslogik: Darf für diesen Schüler gebucht
--    werden? Ohne laufenden Vertrag greift die Sperre NICHT – Probestunden
--    und Schüler ohne Schuljahresvertrag bleiben wie bisher möglich.
-- ---------------------------------------------------------------------------
create or replace function public.buchung_erlaubt(p_schueler uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select not exists (
    select 1 from public.vertraege v
    where v.schueler_id = p_schueler
      and v.status in ('angeboten','aktiv')
      and v.agb_akzeptiert_am is null
  );
$$;
