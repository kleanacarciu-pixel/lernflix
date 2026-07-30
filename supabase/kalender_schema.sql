-- =============================================================================
-- Lerne mit Anna – Terminkalender / Buchungssystem
-- Datenbank-Schema für Supabase (Postgres)
--
-- Regeln (aus Annas Vorgaben):
--  * Öffnungszeiten: Mo–Fr 13:00–20:00, Sa+So 09:00–19:00
--  * Feste, wöchentliche Termine je Schüler (z. B. Max: Dienstag 14:00)
--  * Absage >= 4 Std. vorher  -> zählt als Minus-Stunde (Gutschrift), max. 4
--  * Absage <  4 Std. vorher  -> KEINE Gutschrift (Stunde ist weg)
--  * Nachholstunde: Schüler bucht freien Slot -> Anna bestätigt -> Mail
--  * Öffentlich sichtbar: nur frei/belegt (keine Namen). Anna sieht Namen.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1) PROFILE  (erweitert Supabase auth.users um Rolle, Name, Minus-Konto)
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  user_id     uuid primary key references auth.users(id) on delete cascade,
  name        text not null,
  role        text not null default 'student' check (role in ('student','admin')),
  minus_hours int  not null default 0 check (minus_hours >= 0 and minus_hours <= 3), -- max. 3 Minus
  plus_hours  int  not null default 0 check (plus_hours >= 0),                        -- Extra-Stunden (abzurechnen)
  created_at  timestamptz not null default now()
);
-- Konto-Regeln (serverseitig umgesetzt):
--   * Absage >= 4 Std. vorher -> minus_hours + 1 (nur solange minus_hours < 3, sonst zählt sie nicht)
--   * Absage <  4 Std. vorher -> keine Gutschrift
--   * Extra-Stunde gebucht     -> falls minus_hours > 0: minus_hours - 1 (Nachholen); sonst plus_hours + 1

-- ---------------------------------------------------------------------------
-- 2) FESTE SLOTS  (wiederkehrender Wochentermin je Schüler)
--    weekday: 0=Mo, 1=Di, 2=Mi, 3=Do, 4=Fr, 5=Sa, 6=So
-- ---------------------------------------------------------------------------
create table if not exists public.fixed_slots (
  id         uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(user_id) on delete cascade,
  weekday    int  not null check (weekday between 0 and 6),
  hour       int  not null check (hour between 9 and 19),
  active     boolean not null default true,
  created_at timestamptz not null default now(),
  -- Öffnungszeiten erzwingen (Mo–Fr 13–19 Start, Sa/So 9–18 Start)
  constraint slot_within_hours check (
    (weekday between 0 and 4 and hour between 13 and 19) or
    (weekday between 5 and 6 and hour between 9  and 18)
  )
);
-- Ein Wochen-Slot kann nur an einen aktiven Schüler vergeben sein (1:1-Unterricht)
create unique index if not exists fixed_slots_unique_active
  on public.fixed_slots (weekday, hour) where active;

-- ---------------------------------------------------------------------------
-- 3) TERMINE  (konkrete Sitzung an einem Datum – aus festem Slot ODER Nachhol)
--    status:
--      'geplant'    = fester/gebuchter Termin, findet statt
--      'angefragt'  = Nachhol/Probe angefragt, wartet auf Annas Bestätigung
--      'bestaetigt' = von Anna bestätigt
--      'abgesagt'   = abgesagt (credited zeigt, ob als Minus gutgeschrieben)
-- ---------------------------------------------------------------------------
create table if not exists public.appointments (
  id           uuid primary key default gen_random_uuid(),
  student_id   uuid not null references public.profiles(user_id) on delete cascade,
  slot_date    date not null,
  hour         int  not null check (hour between 9 and 19),
  kind         text not null default 'fix'   check (kind in ('fix','nachhol','probe')),
  status       text not null default 'geplant' check (status in ('geplant','angefragt','bestaetigt','abgesagt')),
  credited     boolean not null default false,   -- true, wenn Absage als Minus-Stunde zählt
  cancelled_at timestamptz,
  created_at   timestamptz not null default now(),
  constraint appt_within_hours check (
    (extract(dow from slot_date) between 1 and 5 and hour between 13 and 19) or -- Mo–Fr
    (extract(dow from slot_date) in (0,6)          and hour between 9  and 18)   -- So/Sa
  )
);
-- Pro Datum+Uhrzeit nur ein aktiver Termin (belegt = existiert nicht-abgesagter Termin)
create unique index if not exists appointments_unique_active
  on public.appointments (slot_date, hour) where status <> 'abgesagt';

create index if not exists appointments_by_date on public.appointments (slot_date);
create index if not exists appointments_by_student on public.appointments (student_id);

-- ---------------------------------------------------------------------------
-- 4) RLS  (Row Level Security) – wer darf was sehen
--    Öffentlich (anon): nur frei/belegt, KEINE Namen  -> über eine sichere View / API
--    Schüler: sieht eigene Termine + eigenes Profil
--    Admin (Anna): sieht alles
-- ---------------------------------------------------------------------------
alter table public.profiles     enable row level security;
alter table public.fixed_slots  enable row level security;
alter table public.appointments enable row level security;

-- Helfer: ist der aktuelle User Admin?
create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.role = 'admin');
$$;

-- Profile
drop policy if exists profiles_self on public.profiles;
create policy profiles_self on public.profiles
  for select using (auth.uid() = user_id or public.is_admin());
drop policy if exists profiles_admin_all on public.profiles;
create policy profiles_admin_all on public.profiles
  for all using (public.is_admin()) with check (public.is_admin());

-- Termine: Schüler sehen/ändern eigene; Admin alles
drop policy if exists appt_own on public.appointments;
create policy appt_own on public.appointments
  for select using (student_id = auth.uid() or public.is_admin());
drop policy if exists appt_student_write on public.appointments;
create policy appt_student_write on public.appointments
  for insert with check (student_id = auth.uid());
drop policy if exists appt_admin_all on public.appointments;
create policy appt_admin_all on public.appointments
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- 5) ÖFFENTLICHE BELEGUNG  (frei/belegt ohne Namen – für die anon-Ansicht)
--    Diese View gibt NUR Datum + Uhrzeit belegter Slots zurück, keine Namen.
-- ---------------------------------------------------------------------------
create or replace view public.belegte_slots as
  select slot_date, hour
  from public.appointments
  where status <> 'abgesagt';
-- View ist gefahrlos öffentlich lesbar (enthält keine personenbezogenen Daten).
grant select on public.belegte_slots to anon, authenticated;

-- =============================================================================
-- HINWEIS: Die Geschäftslogik (4-Stunden-Regel, Minus-Konto +/- , Bestätigung,
-- Bestätigungs-Mail) wird serverseitig in den Next.js-API-Routen umgesetzt,
-- damit sie nicht manipulierbar ist. Dieses Schema ist die Grundlage dafür.
-- =============================================================================
