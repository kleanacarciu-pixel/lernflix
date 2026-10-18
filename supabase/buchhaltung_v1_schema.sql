-- Buchhaltung v1: doppelte Buchfuehrung (Soll/Haben) fuer privat + Firma.
-- Ersetzt das einfache Finanzheft (finanzheft_buchungen) aus Phase 1.
-- Einmal im Supabase SQL-Editor ausfuehren.

drop table if exists finanzheft_buchungen;

create table if not exists buchhaltung_konten (
  id bigint generated always as identity primary key,
  name text not null unique,
  typ text not null check (typ in ('aktiv', 'passiv', 'ertrag', 'aufwand')),
  -- Kennzeichnet die zwei Sonderkonten, die die Buchungsvorlagen automatisch
  -- ansprechen (Umsatzsteuer/Vorsteuer bei Einnahme/Ausgabe mit USt-Satz > 0).
  rolle text check (rolle in ('umsatzsteuer', 'vorsteuer')),
  -- Fest angelegte Konten (Bank, Kasse, USt) lassen sich nicht loeschen;
  -- selbst angelegte Kategorien schon.
  system boolean not null default false,
  aktiv boolean not null default true,
  erstellt_am timestamptz not null default now()
);
create unique index if not exists buchhaltung_konten_rolle_idx on buchhaltung_konten (rolle) where rolle is not null;

create table if not exists buchhaltung_buchungen (
  id bigint generated always as identity primary key,
  datum date not null,
  beschreibung text not null default '',
  erstellt_am timestamptz not null default now()
);

create table if not exists buchhaltung_buchungszeilen (
  id bigint generated always as identity primary key,
  buchung_id bigint not null references buchhaltung_buchungen(id) on delete cascade,
  konto_id bigint not null references buchhaltung_konten(id),
  soll numeric(10, 2) not null default 0 check (soll >= 0),
  haben numeric(10, 2) not null default 0 check (haben >= 0),
  check ((soll > 0 and haben = 0) or (soll = 0 and haben > 0))
);

create index if not exists buchhaltung_buchungszeilen_buchung_idx on buchhaltung_buchungszeilen (buchung_id);
create index if not exists buchhaltung_buchungszeilen_konto_idx on buchhaltung_buchungszeilen (konto_id);

alter table buchhaltung_konten disable row level security;
alter table buchhaltung_buchungen disable row level security;
alter table buchhaltung_buchungszeilen disable row level security;

-- Startkonten: Bank/Kasse fuer beide Bereiche, USt/Vorsteuer als
-- Systemkonten, ein paar uebliche Kategorien zum Loslegen.
insert into buchhaltung_konten (name, typ, rolle, system) values
  ('Bank Privat', 'aktiv', null, true),
  ('Bank Firma', 'aktiv', null, true),
  ('Kasse', 'aktiv', null, true),
  ('Vorsteuer', 'aktiv', 'vorsteuer', true),
  ('Umsatzsteuer', 'passiv', 'umsatzsteuer', true),
  ('Erlöse', 'ertrag', null, true),
  ('Software/Tools', 'aufwand', null, false),
  ('Werbung', 'aufwand', null, false),
  ('Bürobedarf', 'aufwand', null, false),
  ('Miete', 'aufwand', null, false),
  ('Versicherung', 'aufwand', null, false),
  ('Sonstige Ausgabe', 'aufwand', null, false)
on conflict (name) do nothing;
