-- =============================================================================
-- Lerne mit Anna – Klassenzimmer Version 3: die Klassenzimmer-Zentrale
-- Dauerhafter Chat, Datei-Ablage (Uploads), pro Schüler ein "Raum"
--
-- So führst du es aus:
--   Supabase-Dashboard → SQL Editor → dieses Skript komplett einfügen → "Run"
--   (Idempotent: mehrfaches Ausführen schadet nicht.)
--
-- Voraussetzung: klassenzimmer_schema.sql und klassenzimmer_v2_schema.sql
-- wurden bereits ausgeführt.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1) CLASS_MESSAGES  (dauerhafter Chat: eine Zeile = eine Nachricht)
--    student_id bestimmt, zu wessen Klassenzimmer die Nachricht gehört.
-- ---------------------------------------------------------------------------
create table if not exists public.class_messages (
  id         uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(user_id) on delete cascade,
  sender_id  uuid not null references public.profiles(user_id) on delete cascade,
  body       text not null,
  created_at timestamptz not null default now()
);
create index if not exists class_messages_by_student on public.class_messages (student_id, created_at);

-- ---------------------------------------------------------------------------
-- 2) CLASS_FILES  (Datei-Ablage: Metadaten; die Datei selbst liegt im
--    Supabase-Storage-Bucket "klassenzimmer")
--    student_id NULL = Datei ist für ALLE Schüler sichtbar (z. B. Formelsammlung)
-- ---------------------------------------------------------------------------
create table if not exists public.class_files (
  id           uuid primary key default gen_random_uuid(),
  student_id   uuid references public.profiles(user_id) on delete cascade,
  uploader_id  uuid not null references public.profiles(user_id) on delete cascade,
  name         text not null,
  storage_path text not null unique,
  size_bytes   bigint not null default 0,
  created_at   timestamptz not null default now()
);
create index if not exists class_files_by_student on public.class_files (student_id, created_at);

-- ---------------------------------------------------------------------------
-- 3) STORAGE-BUCKET  (privat – Zugriff nur über signierte Links vom Server)
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('klassenzimmer', 'klassenzimmer', false)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- 4) RLS  (wie gehabt: App arbeitet über Service-Role-API-Routen)
-- ---------------------------------------------------------------------------
alter table public.class_messages enable row level security;
alter table public.class_files    enable row level security;

drop policy if exists cm_select on public.class_messages;
create policy cm_select on public.class_messages
  for select using (student_id = auth.uid() or public.is_admin());

drop policy if exists cf_select on public.class_files;
create policy cf_select on public.class_files
  for select using (student_id = auth.uid() or student_id is null or public.is_admin());

-- Schreiben nur über die Server-API (Service Role umgeht RLS)
revoke insert, update, delete on public.class_messages, public.class_files
  from anon, authenticated;
