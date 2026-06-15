-- Content-Engine (Phase 1): einmal im Supabase SQL-Editor ausfuehren.
-- Dashboard: https://supabase.com/dashboard/project/<dein-projekt>/sql/new

-- === TABELLEN ===
create table if not exists topics (
  id bigint generated always as identity primary key,
  thema text not null,
  klassenstufe text not null,
  status text not null default 'pending',  -- pending | done | failed
  created_at timestamptz default now()
);

create table if not exists content_log (
  id bigint generated always as identity primary key,
  topic_id bigint references topics(id),
  paket jsonb not null,
  qa_ok boolean not null,
  qa_problems jsonb,
  created_at timestamptz default now()
);

-- Schneller Zugriff auf das naechste pending-Topic.
create index if not exists topics_status_idx on topics (status, id);

-- RLS aus (Service-Role-Key umgeht RLS ohnehin, aber sicher ist sicher).
alter table topics disable row level security;
alter table content_log disable row level security;

-- === SEED: Themen als pending einfuegen (Klasse 9) ===
insert into topics (thema, klassenstufe, status) values
  ('Steigung linearer Funktionen', 'Klasse 9', 'pending'),
  ('pq-Formel',                     'Klasse 9', 'pending'),
  ('Satz des Pythagoras',           'Klasse 9', 'pending'),
  ('Prozent-Grundwert',             'Klasse 9', 'pending'),
  ('Brüche kürzen',                 'Klasse 9', 'pending'),
  ('binomische Formeln',            'Klasse 9', 'pending'),
  ('lineare Gleichungssysteme',     'Klasse 9', 'pending'),
  ('Strahlensätze',                 'Klasse 9', 'pending');
