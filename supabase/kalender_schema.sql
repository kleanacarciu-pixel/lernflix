-- =============================================================================
-- Lerne mit Anna – Terminkalender / Buchungssystem
-- Datenbank-Schema für Supabase (Postgres)
--
-- In Supabase ausführen:  Dashboard → SQL Editor → dieses Skript einfügen → Run
--
-- Regeln (aus Kleanas Vorgaben):
--  * Öffnungszeiten: Mo–Fr 13:00–20:00, Sa+So 09:00–19:00
--    (Startzeiten: Mo–Fr 13–19 Uhr, Sa+So 9–18 Uhr; jede Stunde = 1 Termin)
--  * Feste, wöchentliche Termine je Schüler. Schüler fragt an → Kleana bestätigt.
--  * Absage durch Schüler >= 4 Std. vorher -> Minus-Stunde (Gutschrift), max. 3
--  * Absage durch Schüler <  4 Std. vorher -> KEINE Gutschrift (Stunde ist weg)
--  * Kleana sagt ab -> Schüler bekommt Nachhol-Guthaben (KEIN Minus) + Mail
--  * Extra-/Nachhol-Stunde: makeup_credits -> minus_hours -> sonst plus_hours+1
--  * Kleana kann freie Slots selbst blockieren (eigene Arbeit)
--  * Öffentlich sichtbar: nur frei/belegt (keine Namen). Kleana sieht alles.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1) PROFILE  (erweitert Supabase auth.users um Rolle, Name, Konten)
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  user_id     uuid primary key references auth.users(id) on delete cascade,
  name        text not null,
  email       text,
  role        text not null default 'student' check (role in ('student','admin')),
  minus_hours    int not null default 0 check (minus_hours >= 0 and minus_hours <= 3), -- max. 3 Minus
  plus_hours     int not null default 0 check (plus_hours >= 0),                        -- Extra-Stunden (abzurechnen!)
  makeup_credits int not null default 0 check (makeup_credits >= 0),                    -- Nachhol-Guthaben aus Kleana-Absagen
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 2) FESTE SLOTS  (wiederkehrender Wochentermin je Schüler)
--    weekday: 0=Mo, 1=Di, 2=Mi, 3=Do, 4=Fr, 5=Sa, 6=So
--    status:  'angefragt' = Schüler hat angefragt, wartet auf Kleana
--             'aktiv'     = von Kleana bestätigt, findet jede Woche statt
--             'beendet'   = nicht mehr aktiv
-- ---------------------------------------------------------------------------
create table if not exists public.fixed_slots (
  id         uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(user_id) on delete cascade,
  weekday    int  not null check (weekday between 0 and 6),
  hour       int  not null check (hour between 8 and 19),
  status     text not null default 'angefragt' check (status in ('angefragt','aktiv','beendet')),
  mode       text check (mode in ('online','vor_ort')),
  created_at timestamptz not null default now(),
  -- Öffnungszeiten erzwingen (Mo–Fr 8–19 Start, Sa/So 8–18 Start)
  constraint fixed_within_hours check (
    (weekday between 0 and 4 and hour between 8 and 19) or
    (weekday between 5 and 6 and hour between 8 and 18)
  )
);
-- Ein aktiver Wochen-Slot kann nur an einen Schüler vergeben sein (1:1-Unterricht)
create unique index if not exists fixed_slots_unique_active
  on public.fixed_slots (weekday, hour) where status = 'aktiv';

-- ---------------------------------------------------------------------------
-- 3) EREIGNISSE  (Abweichungen vom festen Raster an einem konkreten Datum)
--    kind:
--      'einzel' = einmalige Extra-/Nachhol-Stunde (Schüler bucht freien Slot)
--      'probe'  = Probestunde (Anfrage von öffentlich/neu)
--      'absage' = Absage eines festen Termins an diesem Datum
--      'block'  = von Kleana gesperrt (eigene Arbeit) – kein Schüler
--    status:
--      'angefragt'  = wartet auf Kleanas Bestätigung
--      'bestaetigt' = bestätigt / aktiv (auch für 'block')
--      'abgesagt'   = abgesagt (bei 'absage' immer)
--    credited: true, wenn eine Schüler-Absage als Minus-Stunde gezählt wurde
--    counted:  wie eine 'einzel'-Buchung verrechnet wurde
-- ---------------------------------------------------------------------------
create table if not exists public.appointments (
  id           uuid primary key default gen_random_uuid(),
  student_id   uuid references public.profiles(user_id) on delete cascade, -- NULL nur bei 'block'
  slot_date    date not null,
  hour         int  not null check (hour between 8 and 19),
  kind         text not null check (kind in ('einzel','probe','absage','block')),
  status       text not null default 'angefragt' check (status in ('angefragt','bestaetigt','abgesagt')),
  credited     boolean not null default false,
  counted      text check (counted in ('makeup','minus','plus')),
  mode         text check (mode in ('online','vor_ort')),
  note         text,
  created_at   timestamptz not null default now(),
  constraint appt_within_hours check (
    (extract(dow from slot_date) between 1 and 5 and hour between 8 and 19) or -- Mo–Fr
    (extract(dow from slot_date) in (0,6)          and hour between 8 and 18)   -- So/Sa
  )
);
-- Pro Datum+Uhrzeit nur EIN aktiver (nicht-abgesagter) Block/Buchung.
-- 'absage'-Zeilen sind ausgenommen (sie markieren nur einen entfallenen Fixtermin).
create unique index if not exists appointments_unique_active
  on public.appointments (slot_date, hour) where status <> 'abgesagt' and kind <> 'absage';

create index if not exists appointments_by_date    on public.appointments (slot_date);
create index if not exists appointments_by_student on public.appointments (student_id);

-- ---------------------------------------------------------------------------
-- 4) RLS  (Row Level Security)
--    Die App greift ausschließlich über sichere Next.js-API-Routen mit dem
--    Service-Role-Key zu (Geschäftslogik nicht manipulierbar). RLS ist zusätzlich
--    aktiviert, damit über anon/authenticated nichts unkontrolliert lesbar ist.
-- ---------------------------------------------------------------------------
alter table public.profiles     enable row level security;
alter table public.fixed_slots  enable row level security;
alter table public.appointments enable row level security;

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.role = 'admin');
$$;

drop policy if exists profiles_self on public.profiles;
create policy profiles_self on public.profiles
  for select using (auth.uid() = user_id or public.is_admin());
drop policy if exists profiles_admin_all on public.profiles;
create policy profiles_admin_all on public.profiles
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists fixed_own on public.fixed_slots;
create policy fixed_own on public.fixed_slots
  for select using (student_id = auth.uid() or public.is_admin());

drop policy if exists appt_own on public.appointments;
create policy appt_own on public.appointments
  for select using (student_id = auth.uid() or public.is_admin());

-- =============================================================================
-- 5) ADMIN-KONTO EINRICHTEN
--    Nachdem der User lernemitanna@outlook.com existiert (über die App per
--    "Neuen Schüler anlegen" ODER Supabase-Dashboard → Authentication → Add user),
--    dieses Statement ausführen, damit Kleana Admin-Rechte + Profil bekommt:
--
--    insert into public.profiles (user_id, name, email, role)
--    select id, 'Kleana', email, 'admin' from auth.users
--    where email = 'lernemitanna@outlook.com'
--    on conflict (user_id) do update set role = 'admin';
-- =============================================================================
