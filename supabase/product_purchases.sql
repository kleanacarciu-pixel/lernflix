-- Heft-Verkauf (PDF-Produkt): einmal im Supabase SQL-Editor ausfuehren.

create table if not exists product_purchases (
  id                bigint generated always as identity primary key,
  stripe_session_id text unique not null,        -- Idempotenz: keine Doppel-Eintraege
  email             text,
  product_id        text not null,               -- hier "heft-mathe-6"
  created_at        timestamptz default now(),
  download_count    int not null default 0
);

-- Service-Role-Key umgeht RLS ohnehin; hier bewusst aus (kein Public-Zugriff).
alter table product_purchases disable row level security;

-- Atomarer Download-Zaehler (wird von lib/heft.ts via rpc aufgerufen).
create or replace function increment_heft_download(sid text)
returns void
language sql
as $$
  update product_purchases
     set download_count = download_count + 1
   where stripe_session_id = sid;
$$;

-- ============================================================================
-- Ausserdem im Supabase-Dashboard noetig (NICHT SQL):
--   Storage -> New bucket -> Name exakt: products -> Public bucket AUS (privat!)
--   Dann die Datei "Masterclass-Heft-Klasse6-Mathe.pdf" in diesen Bucket laden.
-- Die App liefert das PDF nur ueber kurzlebige, signierte URLs aus -
-- niemals ueber eine oeffentliche URL.
-- ============================================================================
