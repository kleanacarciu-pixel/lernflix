-- Quiz-Fragen-Bank: einmal in Supabase SQL Editor ausführen.
-- Dashboard: https://supabase.com/dashboard/project/<dein-projekt>/sql/new

CREATE TABLE IF NOT EXISTS quiz_fragen (
  id            BIGSERIAL PRIMARY KEY,
  fach          TEXT NOT NULL,             -- 'mathe' | 'physik'
  klasse        INT  NOT NULL,             -- 1..13
  thema         TEXT NOT NULL,             -- z.B. "Lineare Funktionen"
  schwierigkeit TEXT NOT NULL,             -- 'leicht' | 'mittel' | 'schwer'
  frage         TEXT NOT NULL,
  antworten     JSONB NOT NULL,            -- Array von 4 Strings
  richtig       INT  NOT NULL,             -- Index 0..3
  erklaerung    TEXT,
  aufgerufen    INT DEFAULT 0,             -- wie oft wurde diese frage gezeigt
  erstellt_am   TIMESTAMPTZ DEFAULT NOW()
);

-- Schneller Lookup nach (fach, klasse, thema, schwierigkeit)
CREATE INDEX IF NOT EXISTS quiz_fragen_lookup_idx
  ON quiz_fragen (fach, klasse, thema, schwierigkeit);

-- Random-Auswahl performant
CREATE INDEX IF NOT EXISTS quiz_fragen_random_idx
  ON quiz_fragen (fach, klasse, thema, schwierigkeit, id);

-- RLS deaktivieren (Service-Role Key umgeht RLS sowieso, aber sicher ist sicher)
ALTER TABLE quiz_fragen DISABLE ROW LEVEL SECURITY;
