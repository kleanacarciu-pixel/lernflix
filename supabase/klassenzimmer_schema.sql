-- =============================================================================
-- Lerne mit Anna – Virtuelles Klassenzimmer (Video-Unterricht mit Daily.co)
-- Datenbank-Schema für Supabase (Postgres)
--
-- So führst du es aus:
--   Supabase-Dashboard → SQL Editor → dieses Skript komplett einfügen → "Run"
--   (Das Skript ist idempotent: mehrfaches Ausführen schadet nicht.)
--
-- Hintergrund: Das Terminportal (fixed_slots/appointments) speichert nur
-- Wochenmuster und Ausnahmen – keine konkreten Stunden mit Start/Ende.
-- Darum gibt es hier eine eigene "lessons"-Tabelle: eine Zeile = eine
-- konkrete Unterrichtsstunde mit Datum, Uhrzeit und Video-Raum.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1) LESSONS  (eine konkrete Unterrichtsstunde)
--    kind: 'einzel' (1 Schüler), 'gruppe' oder 'webinar' (Teilnehmer-Liste)
--    daily_room_name / daily_room_url: werden NUR serverseitig gesetzt,
--    sobald der erste Teilnehmer beitritt (siehe API-Route /api/lessons/...)
-- ---------------------------------------------------------------------------
create table if not exists public.lessons (
  id              uuid primary key default gen_random_uuid(),
  teacher_id      uuid not null references public.profiles(user_id) on delete cascade,
  student_id      uuid references public.profiles(user_id) on delete set null, -- NULL bei Gruppe/Webinar
  starts_at       timestamptz not null,
  ends_at         timestamptz not null,
  title           text not null default 'Nachhilfestunde',
  subject         text,                                   -- z. B. 'Mathe', 'Physik'
  kind            text not null default 'einzel' check (kind in ('einzel','gruppe','webinar')),
  daily_room_name text unique,                            -- vom Server gesetzt (Daily.co)
  daily_room_url  text,                                   -- vom Server gesetzt (Daily.co)
  created_at      timestamptz not null default now(),
  constraint lessons_zeitfenster check (ends_at > starts_at)
);

create index if not exists lessons_by_student on public.lessons (student_id, starts_at);
create index if not exists lessons_by_teacher on public.lessons (teacher_id, starts_at);

-- ---------------------------------------------------------------------------
-- 2) LESSON_PARTICIPANTS  (Teilnehmer bei Gruppenstunden/Webinaren)
-- ---------------------------------------------------------------------------
create table if not exists public.lesson_participants (
  lesson_id  uuid not null references public.lessons(id) on delete cascade,
  user_id    uuid not null references public.profiles(user_id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (lesson_id, user_id)
);

create index if not exists lesson_participants_by_user on public.lesson_participants (user_id);

-- ---------------------------------------------------------------------------
-- 3) RLS  (Row Level Security)
--    Wie beim Terminportal: Die App arbeitet über sichere Next.js-API-Routen
--    mit dem Service-Role-Key (der RLS umgeht). RLS ist trotzdem aktiv, damit
--    über den anon-/authenticated-Zugang nichts Unerlaubtes möglich ist:
--      * Kleana (admin) sieht und verwaltet ihre eigenen Stunden
--      * Schüler sehen nur Stunden, in denen sie student_id oder Teilnehmer sind
-- ---------------------------------------------------------------------------
alter table public.lessons enable row level security;
alter table public.lesson_participants enable row level security;

-- Lesen: Lehrerin, der eingetragene Schüler oder ein Teilnehmer
drop policy if exists lessons_select on public.lessons;
create policy lessons_select on public.lessons
  for select using (
    teacher_id = auth.uid()
    or student_id = auth.uid()
    or exists (
      select 1 from public.lesson_participants lp
      where lp.lesson_id = lessons.id and lp.user_id = auth.uid()
    )
    or public.is_admin()
  );

-- Verwalten (anlegen/ändern/löschen): nur die Lehrerin (admin) für eigene Stunden
drop policy if exists lessons_admin_insert on public.lessons;
create policy lessons_admin_insert on public.lessons
  for insert with check (public.is_admin() and teacher_id = auth.uid());
drop policy if exists lessons_admin_update on public.lessons;
create policy lessons_admin_update on public.lessons
  for update using (public.is_admin() and teacher_id = auth.uid())
  with check (public.is_admin() and teacher_id = auth.uid());
drop policy if exists lessons_admin_delete on public.lessons;
create policy lessons_admin_delete on public.lessons
  for delete using (public.is_admin() and teacher_id = auth.uid());

-- Teilnehmer-Liste: lesen dürfen Lehrerin + der Teilnehmer selbst,
-- verwalten nur die Lehrerin (admin)
drop policy if exists lp_select on public.lesson_participants;
create policy lp_select on public.lesson_participants
  for select using (
    user_id = auth.uid()
    or public.is_admin()
    or exists (
      select 1 from public.lessons l
      where l.id = lesson_participants.lesson_id and l.teacher_id = auth.uid()
    )
  );
drop policy if exists lp_admin_all on public.lesson_participants;
create policy lp_admin_all on public.lesson_participants
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- 4) SPALTEN-SCHUTZ für daily_room_name / daily_room_url
--    Diese beiden Spalten darf NUR der Server (Service Role) schreiben –
--    selbst die Lehrerin nicht über den normalen Login. Dafür entziehen wir
--    den Browser-Rollen (anon/authenticated) die Schreibrechte auf alle
--    Spalten und geben sie nur für die erlaubten Spalten zurück.
--    (Die Service Role behält immer Vollzugriff.)
-- ---------------------------------------------------------------------------
revoke insert, update on public.lessons from anon, authenticated;
grant insert (teacher_id, student_id, starts_at, ends_at, title, subject, kind)
  on public.lessons to authenticated;
grant update (teacher_id, student_id, starts_at, ends_at, title, subject, kind)
  on public.lessons to authenticated;

-- =============================================================================
-- 5) TEST-STUNDE ANLEGEN (Beispiel – bei Bedarf anpassen und ausführen)
--    Ersetze die E-Mail des Schülers und die Uhrzeit. "now() + …" bedeutet:
--    die Stunde beginnt in 5 Minuten und dauert 60 Minuten.
--
--    insert into public.lessons (teacher_id, student_id, starts_at, ends_at, title, subject, kind)
--    select
--      (select user_id from public.profiles where role = 'admin' limit 1),
--      (select user_id from public.profiles where email = 'schueler@example.com'),
--      now() + interval '5 minutes',
--      now() + interval '65 minutes',
--      'Test-Stunde', 'Mathe', 'einzel';
-- =============================================================================
