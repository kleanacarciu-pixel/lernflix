-- =============================================================================
-- Lerne mit Anna – Schuljahresmodell, Teil 4: Unterschriften
--
-- Voraussetzung: schuljahr_v1_schema.sql bis schuljahr_v3_zahlungen.sql
-- In Supabase ausführen:  Dashboard → SQL Editor → einfügen → Run
--
-- Schritt 1 von „Vertragsabschluss im System": Kleanas eigene Unterschrift
-- wird einmalig hinterlegt und danach in jede Vertrags-PDF eingebettet.
--
-- Das Bild liegt als Daten-URI direkt in der Tabelle. Ein eigener
-- Speicher-Eimer mit Rechteverwaltung wäre für ein einzelnes Bild
-- unverhältnismäßig, und die PDF-Erzeugung braucht die Bytes ohnehin.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1) EINSTELLUNGEN  (Schlüssel/Wert, bewusst schlicht gehalten)
-- ---------------------------------------------------------------------------
create table if not exists public.admin_einstellungen (
  schluessel   text primary key,
  wert         text,
  geaendert_am timestamptz not null default now()
);

comment on table public.admin_einstellungen is
  'Innensicht: Einstellungen, die nur Kleana pflegt. Aktuell die eigene Unterschrift.';

-- Startzeile, damit die Oberfläche etwas zum Anzeigen hat.
insert into public.admin_einstellungen (schluessel, wert)
values ('unterschrift_anbieterin', null)
on conflict (schluessel) do nothing;

-- ---------------------------------------------------------------------------
-- 2) BERECHTIGUNGEN
--    Reine Innensicht – niemand außer Kleana sieht oder ändert das.
-- ---------------------------------------------------------------------------
alter table public.admin_einstellungen enable row level security;

drop policy if exists einstellungen_admin on public.admin_einstellungen;
create policy einstellungen_admin on public.admin_einstellungen
  for all using (public.is_admin()) with check (public.is_admin());
