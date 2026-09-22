-- Finanzheft v1: Buchungen fuer die Trennung privat/Firma.
-- Einmal im Supabase SQL-Editor ausfuehren.

create table if not exists finanzheft_buchungen (
  id bigint generated always as identity primary key,
  konto text not null check (konto in ('privat', 'firma')),
  typ text not null check (typ in ('einnahme', 'ausgabe')),
  betrag numeric(10, 2) not null check (betrag > 0),
  kategorie text not null,
  beschreibung text not null default '',
  datum date not null,
  -- Beide Zeilen eines Transfers teilen sich dieselbe transfer_id, damit sie
  -- gemeinsam geloescht/angezeigt werden koennen. Normale Buchungen: null.
  transfer_id uuid,
  erstellt_am timestamptz not null default now()
);

create index if not exists finanzheft_buchungen_konto_idx on finanzheft_buchungen (konto, datum desc);
create index if not exists finanzheft_buchungen_transfer_idx on finanzheft_buchungen (transfer_id);

-- Service-Role-Key (serverseitig) umgeht RLS ohnehin; wie bei den anderen
-- rein internen Admin-Tabellen bewusst aus, statt eine Policy zu faelschen,
-- die nie durch einen Nutzer-Token angesprochen wird.
alter table finanzheft_buchungen disable row level security;
