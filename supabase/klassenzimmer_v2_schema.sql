-- =============================================================================
-- Lerne mit Anna – Klassenzimmer Version 2
-- Live-Übungen, Stundenzettel und Belohnungen
--
-- So führst du es aus:
--   Supabase-Dashboard → SQL Editor → dieses Skript komplett einfügen → "Run"
--   (Idempotent: mehrfaches Ausführen schadet nicht.)
--
-- Voraussetzung: klassenzimmer_schema.sql (Version 1) wurde bereits ausgeführt.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1) LESSON_EXERCISES  (Live-Übungen in einer Stunde)
--    kind:   'auswahl'  = Multiple Choice (options = Array von Antworten)
--            'freitext' = Schüler tippt die Antwort selbst
--    status: 'aktiv'    = läuft gerade, Schüler können antworten
--            'beendet'  = geschlossen, Ergebnis steht fest
-- ---------------------------------------------------------------------------
create table if not exists public.lesson_exercises (
  id             uuid primary key default gen_random_uuid(),
  lesson_id      uuid not null references public.lessons(id) on delete cascade,
  question       text not null,
  kind           text not null default 'freitext' check (kind in ('freitext','auswahl')),
  options        jsonb,          -- bei 'auswahl': Array der Antwortmöglichkeiten
  correct_answer text,           -- Lösung (bei 'auswahl': die richtige Option als Text)
  explanation    text,           -- optionale Erklärung (z. B. aus der Quiz-Bank)
  status         text not null default 'aktiv' check (status in ('aktiv','beendet')),
  created_at     timestamptz not null default now()
);
create index if not exists lesson_exercises_by_lesson on public.lesson_exercises (lesson_id, created_at);

-- ---------------------------------------------------------------------------
-- 2) LESSON_ANSWERS  (Antworten der Schüler, eine pro Übung und Schüler)
-- ---------------------------------------------------------------------------
create table if not exists public.lesson_answers (
  id          uuid primary key default gen_random_uuid(),
  exercise_id uuid not null references public.lesson_exercises(id) on delete cascade,
  user_id     uuid not null references public.profiles(user_id) on delete cascade,
  answer      text not null,
  is_correct  boolean,          -- automatisch geprüft, wenn eine Lösung hinterlegt ist
  answered_at timestamptz not null default now(),
  unique (exercise_id, user_id)
);
create index if not exists lesson_answers_by_exercise on public.lesson_answers (exercise_id);

-- ---------------------------------------------------------------------------
-- 3) LESSON_NOTES  (Stundenzettel: eine Zeile pro Stunde)
-- ---------------------------------------------------------------------------
create table if not exists public.lesson_notes (
  lesson_id  uuid primary key references public.lessons(id) on delete cascade,
  summary    text not null default '',   -- Was haben wir gemacht?
  homework   text not null default '',   -- Hausaufgaben bis zum nächsten Mal
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 4) STUDENT_REWARDS  (Punkte und Sticker für Schüler)
--    Punkte kommen automatisch für richtige Antworten oder von Kleana per Klick.
-- ---------------------------------------------------------------------------
create table if not exists public.student_rewards (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles(user_id) on delete cascade,
  lesson_id  uuid references public.lessons(id) on delete set null,
  points     int not null default 0,
  sticker    text,                        -- z. B. '🐙' '⭐' '🏆'
  reason     text,                        -- z. B. 'Übung richtig gelöst'
  created_at timestamptz not null default now()
);
create index if not exists student_rewards_by_user on public.student_rewards (user_id, created_at);

-- ---------------------------------------------------------------------------
-- 6) RLS  (wie in Version 1: App arbeitet über Service-Role-API-Routen;
--    RLS ist zusätzliche Absicherung gegen direkten Zugriff)
-- ---------------------------------------------------------------------------
alter table public.lesson_exercises enable row level security;
alter table public.lesson_answers   enable row level security;
alter table public.lesson_notes     enable row level security;
alter table public.student_rewards  enable row level security;

-- Hilfsfunktion: gehört der eingeloggte Nutzer zu dieser Stunde?
create or replace function public.is_lesson_member(p_lesson uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.lessons l
    where l.id = p_lesson and (
      l.teacher_id = auth.uid()
      or l.student_id = auth.uid()
      or exists (select 1 from public.lesson_participants lp where lp.lesson_id = l.id and lp.user_id = auth.uid())
    )
  ) or public.is_admin();
$$;

drop policy if exists ex_select on public.lesson_exercises;
create policy ex_select on public.lesson_exercises
  for select using (public.is_lesson_member(lesson_id));

drop policy if exists ans_select on public.lesson_answers;
create policy ans_select on public.lesson_answers
  for select using (
    user_id = auth.uid()
    or public.is_admin()
    or exists (select 1 from public.lesson_exercises e
               where e.id = lesson_answers.exercise_id and public.is_lesson_member(e.lesson_id))
  );

drop policy if exists notes_select on public.lesson_notes;
create policy notes_select on public.lesson_notes
  for select using (public.is_lesson_member(lesson_id));

drop policy if exists rewards_select on public.student_rewards;
create policy rewards_select on public.student_rewards
  for select using (user_id = auth.uid() or public.is_admin());

-- Schreiben ausschließlich über die Server-API (Service Role umgeht RLS) –
-- darum hier bewusst KEINE insert/update/delete-Policies für Browser-Rollen.
revoke insert, update, delete on public.lesson_exercises, public.lesson_answers,
  public.lesson_notes, public.student_rewards
  from anon, authenticated;
