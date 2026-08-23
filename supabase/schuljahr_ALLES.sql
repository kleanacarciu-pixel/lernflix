-- =============================================================================
-- Lerne mit Anna – Schuljahresmodell: ALLES IN EINER DATEI
--
-- So gehst du vor:
--   1. supabase.com öffnen und einloggen
--   2. Links im Menü auf "SQL Editor" klicken
--   3. Diese ganze Datei hier hineinkopieren (Strg+A, Strg+C, Strg+V)
--   4. Unten rechts auf "Run" klicken
--
-- Das war's. Es dauert ein paar Sekunden. Am Ende muss "Success" stehen.
--
-- Keine Sorge: Du kannst diese Datei auch zweimal laufen lassen, ohne
-- dass etwas kaputtgeht. Bestehende Daten werden nicht angefasst.
--
-- HINWEIS: Diese Datei wird aus den drei Einzeldateien zusammengesetzt.
-- Nicht von Hand bearbeiten – tests/sql-sammeldatei.test.ts prüft, dass
-- sie zum Inhalt der Einzeldateien passt.
-- =============================================================================



-- #############################################################################
-- ### TEIL AUS: schuljahr_v1_schema.sql
-- #############################################################################

-- =============================================================================
-- Lerne mit Anna – Schuljahresmodell, Teil 1: Schuljahr- und Ferienkalender
--
-- In Supabase ausführen:  Dashboard → SQL Editor → dieses Skript einfügen → Run
--
-- Grundlage für die Termin-Engine: Aus Schuljahr-Zeitraum minus unterrichts-
-- freie Tage ergeben sich die konkreten Termine eines Wochentags.
--
-- Zwei Arten von freien Tagen:
--   * Schulferien      – gelten für den bayerischen Standardkalender
--                        (schule_id IS NULL) oder für genau eine Schule
--                        (schule_id gesetzt, z. B. internationale Schulen).
--   * Gesetzliche      – ist_feiertag = true. Gelten IMMER für alle Schüler,
--     Feiertage          unabhängig von der Schule, und haben deshalb nie
--                        eine schule_id.
--
-- Bestehende Tabellen (profiles, fixed_slots, appointments, weekly_blocks)
-- bleiben unverändert – dieses Skript legt nur neue Tabellen an.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1) SCHULJAHRE
-- ---------------------------------------------------------------------------
create table if not exists public.schuljahre (
  id               uuid primary key default gen_random_uuid(),
  name             text not null unique,          -- z. B. "2026/27"
  erster_schultag  date not null,
  letzter_schultag date not null,
  aktiv            boolean not null default false,
  created_at       timestamptz not null default now(),
  constraint schuljahr_zeitraum check (letzter_schultag > erster_schultag)
);

-- Höchstens ein aktives Schuljahr gleichzeitig.
create unique index if not exists schuljahre_nur_ein_aktives
  on public.schuljahre (aktiv) where aktiv;

-- ---------------------------------------------------------------------------
-- 2) SCHULEN  (nur für Schulen mit abweichenden Ferienzeiten nötig)
-- ---------------------------------------------------------------------------
create table if not exists public.schulen (
  id         uuid primary key default gen_random_uuid(),
  name       text not null unique,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 3) UNTERRICHTSFREIE TAGE
-- ---------------------------------------------------------------------------
create table if not exists public.unterrichtsfreie_tage (
  id           uuid primary key default gen_random_uuid(),
  schuljahr_id uuid not null references public.schuljahre(id) on delete cascade,
  schule_id    uuid references public.schulen(id) on delete cascade,  -- NULL = bayerischer Standardkalender
  bezeichnung  text not null,
  datum_von    date not null,
  datum_bis    date not null,
  ist_feiertag boolean not null default false,
  created_at   timestamptz not null default now(),
  constraint freie_tage_zeitraum check (datum_bis >= datum_von),
  -- Ein gesetzlicher Feiertag gilt für alle und gehört daher zu keiner Schule.
  constraint feiertag_ohne_schule check (not (ist_feiertag and schule_id is not null))
);

create index if not exists unterrichtsfreie_tage_schuljahr_idx
  on public.unterrichtsfreie_tage (schuljahr_id, schule_id);
create index if not exists unterrichtsfreie_tage_zeitraum_idx
  on public.unterrichtsfreie_tage (schuljahr_id, datum_von, datum_bis);

-- ---------------------------------------------------------------------------
-- 4) BERECHTIGUNGEN
--    Lesen: alle angemeldeten Nutzer (Portal zeigt Terminlisten an).
--    Ändern: nur Kleana (Admin) – public.is_admin() stammt aus kalender_schema.sql
-- ---------------------------------------------------------------------------
alter table public.schuljahre            enable row level security;
alter table public.schulen               enable row level security;
alter table public.unterrichtsfreie_tage enable row level security;

drop policy if exists schuljahre_lesen on public.schuljahre;
create policy schuljahre_lesen on public.schuljahre
  for select using (auth.uid() is not null);
drop policy if exists schuljahre_admin on public.schuljahre;
create policy schuljahre_admin on public.schuljahre
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists schulen_lesen on public.schulen;
create policy schulen_lesen on public.schulen
  for select using (auth.uid() is not null);
drop policy if exists schulen_admin on public.schulen;
create policy schulen_admin on public.schulen
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists freie_tage_lesen on public.unterrichtsfreie_tage;
create policy freie_tage_lesen on public.unterrichtsfreie_tage
  for select using (auth.uid() is not null);
drop policy if exists freie_tage_admin on public.unterrichtsfreie_tage;
create policy freie_tage_admin on public.unterrichtsfreie_tage
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- 5) STAMMDATEN SCHULJAHR 2026/27 (bayerischer Kalender)
--    Mehrfaches Ausführen ist unschädlich.
--
--    Geprüft: Mit genau diesen Zeiträumen ergeben sich ab dem ersten Schultag
--    Mo 37, Di 38, Mi 37, Do 36, Fr 37 Termine – die Sollwerte der Termin-Engine.
-- ---------------------------------------------------------------------------
insert into public.schuljahre (name, erster_schultag, letzter_schultag, aktiv)
values ('2026/27', date '2026-09-15', date '2027-07-30', true)
on conflict (name) do update
  set erster_schultag  = excluded.erster_schultag,
      letzter_schultag = excluded.letzter_schultag;

with sj as (select id from public.schuljahre where name = '2026/27'),
     daten (bezeichnung, datum_von, datum_bis, ist_feiertag) as (
       values
         -- Gesetzliche Feiertage gelten für ALLE Schüler, auch für Schulen mit
         -- eigenem Ferienkalender (ist_feiertag = true). Die beiden folgenden
         -- fallen 2026/27 auf einen Samstag – für Samstagstermine zählen sie.
         ('Tag der Deutschen Einheit', date '2026-10-03', date '2026-10-03', true),
         ('Herbstferien',        date '2026-11-02', date '2026-11-06', false),
         ('Buß- und Bettag',     date '2026-11-18', date '2026-11-18', false),
         ('Weihnachtsferien',    date '2026-12-24', date '2027-01-08', false),
         ('Frühjahrsferien',     date '2027-02-08', date '2027-02-12', false),
         ('Osterferien',         date '2027-03-22', date '2027-04-02', false),
         ('Tag der Arbeit',      date '2027-05-01', date '2027-05-01', true),
         ('Christi Himmelfahrt', date '2027-05-06', date '2027-05-06', true),
         ('Pfingstmontag',       date '2027-05-17', date '2027-05-17', true),
         ('Pfingstferien',       date '2027-05-18', date '2027-05-28', false)
     )
insert into public.unterrichtsfreie_tage
       (schuljahr_id, schule_id, bezeichnung, datum_von, datum_bis, ist_feiertag)
select sj.id, null, d.bezeichnung, d.datum_von, d.datum_bis, d.ist_feiertag
from sj cross join daten d
where not exists (
  select 1 from public.unterrichtsfreie_tage u
  where u.schuljahr_id = sj.id
    and u.schule_id is null
    and u.bezeichnung = d.bezeichnung
);


-- #############################################################################
-- ### TEIL AUS: schuljahr_v2_vertraege.sql
-- #############################################################################

-- =============================================================================
-- Lerne mit Anna – Schuljahresmodell, Teil 2: Verträge
--
-- Voraussetzung: schuljahr_v1_schema.sql wurde bereits ausgeführt.
-- In Supabase ausführen:  Dashboard → SQL Editor → dieses Skript einfügen → Run
--
-- Ein Vertrag verbindet einen Schüler (profiles) mit einem Schuljahr und
-- legt Wochentermin(e), Stundensatz und Zahlweise fest. Der Jahresbetrag
-- ergibt sich aus der Termin-Engine (lib/schuljahr.ts) und der Preislogik
-- (lib/vertrag-kern.ts) und wird hier gespeichert, damit Rechnungen und
-- Terminlisten stabil bleiben, auch wenn sich Stammdaten später ändern.
--
-- Beträge stehen als numeric(10,2) in EURO. Gerechnet wird in der Anwendung
-- in Cent; beim Speichern wird auf zwei Nachkommastellen zurückgerechnet.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1) VERTRÄGE
-- ---------------------------------------------------------------------------
create table if not exists public.vertraege (
  id                     uuid primary key default gen_random_uuid(),
  schueler_id            uuid not null references public.profiles(user_id) on delete cascade,
  schuljahr_id           uuid not null references public.schuljahre(id) on delete restrict,
  schule_id              uuid references public.schulen(id) on delete set null,

  stundensatz            numeric(10,2) not null check (stundensatz >= 0),
  stundensatz_zweittermin numeric(10,2) not null check (stundensatz_zweittermin >= 0),
  zweites_kind           boolean not null default false,

  vertragsbeginn         date not null,
  zahlweise              text not null default 'raten' check (zahlweise in ('raten','einmal')),
  jahresbetrag           numeric(10,2) not null default 0 check (jahresbetrag >= 0),

  agb_akzeptiert_am      timestamptz,
  status                 text not null default 'angeboten'
                           check (status in ('angeboten','aktiv','gekuendigt','beendet')),
  kuendigung_zum         date,

  erstellt_am            timestamptz not null default now(),
  geaendert_am           timestamptz not null default now(),

  -- Vertragsbeginn ist immer ein Monatserster (Grundlage der Ratenrechnung).
  constraint vertrag_beginn_monatserster check (extract(day from vertragsbeginn) = 1)
);

-- Je Schüler und Schuljahr höchstens ein laufender Vertrag.
create unique index if not exists vertraege_ein_laufender
  on public.vertraege (schueler_id, schuljahr_id)
  where status in ('angeboten','aktiv');

create index if not exists vertraege_schueler_idx on public.vertraege (schueler_id);
create index if not exists vertraege_schuljahr_idx on public.vertraege (schuljahr_id, status);

-- ---------------------------------------------------------------------------
-- 2) WOCHENTERMINE DES VERTRAGS
--    Ein Vertrag kann einen oder zwei Wochentermine haben.
--    ab_datum / bis_datum bilden den Wochentagswechsel ab (Abschnitt 5):
--    der alte Wochentag bekommt ein bis_datum, der neue ein ab_datum.
--    NULL heißt „ab Schuljahresbeginn" bzw. „bis Schuljahresende".
--    wochentag: 0=Mo .. 6=So (wie in fixed_slots)
-- ---------------------------------------------------------------------------
create table if not exists public.vertrag_zeiten (
  id         uuid primary key default gen_random_uuid(),
  vertrag_id uuid not null references public.vertraege(id) on delete cascade,
  wochentag  smallint not null check (wochentag between 0 and 6),
  uhrzeit    time not null,
  ab_datum   date,
  bis_datum  date,
  erstellt_am timestamptz not null default now(),
  constraint vertrag_zeit_zeitraum check (bis_datum is null or ab_datum is null or bis_datum >= ab_datum)
);

create index if not exists vertrag_zeiten_vertrag_idx on public.vertrag_zeiten (vertrag_id);

-- ---------------------------------------------------------------------------
-- 3) „geaendert_am" automatisch pflegen
-- ---------------------------------------------------------------------------
create or replace function public.vertrag_geaendert() returns trigger
language plpgsql as $$
begin
  new.geaendert_am := now();
  return new;
end;
$$;

drop trigger if exists vertraege_geaendert on public.vertraege;
create trigger vertraege_geaendert before update on public.vertraege
  for each row execute function public.vertrag_geaendert();

-- ---------------------------------------------------------------------------
-- 4) BERECHTIGUNGEN
--    Schüler sehen nur ihren eigenen Vertrag, Kleana alles.
-- ---------------------------------------------------------------------------
alter table public.vertraege      enable row level security;
alter table public.vertrag_zeiten enable row level security;

drop policy if exists vertrag_eigener on public.vertraege;
create policy vertrag_eigener on public.vertraege
  for select using (schueler_id = auth.uid() or public.is_admin());
drop policy if exists vertrag_admin on public.vertraege;
create policy vertrag_admin on public.vertraege
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists vertrag_zeiten_eigene on public.vertrag_zeiten;
create policy vertrag_zeiten_eigene on public.vertrag_zeiten
  for select using (
    public.is_admin() or exists (
      select 1 from public.vertraege v
      where v.id = vertrag_zeiten.vertrag_id and v.schueler_id = auth.uid()
    )
  );
drop policy if exists vertrag_zeiten_admin on public.vertrag_zeiten;
create policy vertrag_zeiten_admin on public.vertrag_zeiten
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- 5) HARTE SPERRE OHNE AGB-BESTÄTIGUNG (Abschnitt 4)
--    Hilfsfunktion für die Buchungslogik: Darf für diesen Schüler gebucht
--    werden? Ohne laufenden Vertrag greift die Sperre NICHT – Probestunden
--    und Schüler ohne Schuljahresvertrag bleiben wie bisher möglich.
-- ---------------------------------------------------------------------------
create or replace function public.buchung_erlaubt(p_schueler uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select not exists (
    select 1 from public.vertraege v
    where v.schueler_id = p_schueler
      and v.status in ('angeboten','aktiv')
      and v.agb_akzeptiert_am is null
  );
$$;


-- #############################################################################
-- ### TEIL AUS: schuljahr_v3_zahlungen.sql
-- #############################################################################

-- =============================================================================
-- Lerne mit Anna – Schuljahresmodell, Teil 3: Zahlungen, Mahnwesen, Plusstunden
--
-- Voraussetzung: schuljahr_v1_schema.sql und schuljahr_v2_vertraege.sql
-- In Supabase ausführen:  Dashboard → SQL Editor → dieses Skript einfügen → Run
--
-- UMKEHRLOGIK beim Mahnwesen: Standardannahme ist „bezahlt". Kleana hakt
-- nicht monatlich alle Zahler ab, sondern markiert nur die Verträge, deren
-- Rate FEHLT (offen_seit setzen). Wird die Markierung entfernt, gilt die
-- Rate als eingegangen und der Vertrag wird sofort wieder entsperrt.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1) ZAHLUNGEN  (Ratenplan eines Vertrags; bei Einmalzahlung eine Zeile)
-- ---------------------------------------------------------------------------
create table if not exists public.zahlungen (
  id            uuid primary key default gen_random_uuid(),
  vertrag_id    uuid not null references public.vertraege(id) on delete cascade,
  monat         date not null,                        -- immer Monatserster
  soll_betrag   numeric(10,2) not null check (soll_betrag >= 0),

  bezahlt_am    date,          -- ausdrücklich als bezahlt vermerkt
  offen_seit    date,          -- von Kleana als fehlend markiert (Umkehrlogik)
  offen_bis     date,          -- Markierung an diesem Tag entfernt (Verlauf)
  erinnerung_am date,          -- „letzter Tag"-E-Mail verschickt
  pausiert_am   date,          -- Vertrag deswegen pausiert

  erstellt_am   timestamptz not null default now(),
  constraint zahlung_monatserster check (extract(day from monat) = 1),
  unique (vertrag_id, monat)
);

create index if not exists zahlungen_vertrag_idx on public.zahlungen (vertrag_id, monat);
-- Für den Mahnlauf: nur die markierten Zeilen sind interessant.
create index if not exists zahlungen_offen_idx on public.zahlungen (offen_seit)
  where offen_seit is not null and bezahlt_am is null;

-- ---------------------------------------------------------------------------
-- 2) MAHN-AUTOMATIK je Vertrag aussetzen (mit Notiz)
-- ---------------------------------------------------------------------------
alter table public.vertraege
  add column if not exists mahn_automatik_pausiert boolean not null default false;
alter table public.vertraege
  add column if not exists mahn_notiz text;

-- ---------------------------------------------------------------------------
-- 3) E-MAIL-VORLAGEN  (im Admin-Bereich editierbar, Du-Form)
-- ---------------------------------------------------------------------------
create table if not exists public.mahn_vorlagen (
  schluessel   text primary key,        -- 'erinnerung' | 'pausierung' | 'dank' | 'adminCheck'
  betreff      text not null,
  text         text not null,
  geaendert_am timestamptz not null default now()
);

-- Startvorlagen. Platzhalter in geschweiften Klammern werden ersetzt:
-- {name} {betrag} {monat} {iban} {inhaber} {verwendungszweck}
-- Bei 'terminEnde' zusaetzlich:
--   {alterTag} {bleibtTag} {endeAm} {abMonat} {satz} {jahresbetrag} {rate}
insert into public.mahn_vorlagen (schluessel, betreff, text) values
  ('adminCheck',
   'Kurzer Bank-Check',
   E'Hallo Kleana,\n\nmorgen ist der letzte Zahltag. Schau kurz auf dem Konto nach und markiere die fehlenden Raten in der Zahlungsübersicht als offen.\n\nDanach läuft alles Weitere automatisch.'),
  ('erinnerung',
   'Kurze Erinnerung: Rate für {monat}',
   E'Hallo,\n\nheute ist der letzte Tag für die Rate {monat} für {name}.\n\nBetrag: {betrag}\nEmpfänger: {inhaber}\nIBAN: {iban}\nVerwendungszweck: {verwendungszweck}\n\nFalls sich deine Überweisung mit dieser Nachricht überschneidet, ignorier sie einfach.\n\nLiebe Grüße\nAnna'),
  ('pausierung',
   'Unterricht vorübergehend pausiert',
   E'Hallo,\n\nfür die Rate {monat} ({betrag}) ist bei mir leider noch nichts eingegangen. Deshalb pausiere ich den Unterricht für {name} vorerst – der feste Wochentermin ruht und es lassen sich keine Stunden buchen.\n\nSobald die Zahlung da ist, geht es sofort normal weiter. Termine in den nächsten zwei Tagen finden noch statt.\n\nEmpfänger: {inhaber}\nIBAN: {iban}\nVerwendungszweck: {verwendungszweck}\n\nMeld dich gern, wenn etwas dazwischengekommen ist – wir finden eine Lösung.\n\nLiebe Grüße\nAnna'),
  ('terminEnde',
   'Änderung: {name} hat ab jetzt einen Wochentermin',
   E'Hallo,\n\nder Termin am {alterTag} für {name} endet zum {endeAm}. Ab {abMonat} bleibt der Termin am {bleibtTag}.\n\nDamit entfällt der Familienpreis: Für einen einzelnen Wochentermin gilt wieder der reguläre Stundensatz von {satz} (AGB § 6 Abs. 2). Die bereits gezahlten Raten bleiben unverändert.\n\nNeuer Jahresbetrag: {jahresbetrag}\nRestliche Raten: {rate}\n\nDie aktualisierte Terminliste findest du im Anhang.\n\nMeld dich gern, wenn etwas unklar ist.\n\nLiebe Grüße\nAnna'),
  ('dank',
   'Zahlung angekommen – es geht weiter',
   E'Hallo,\n\ndie Rate {monat} für {name} ist angekommen, vielen Dank! Alles ist wieder freigeschaltet und der feste Termin läuft wie gewohnt.\n\nLiebe Grüße\nAnna')
on conflict (schluessel) do nothing;

-- ---------------------------------------------------------------------------
-- 4) PLUSSTUNDEN-ABRECHNUNGEN
--    Plusstunden selbst stehen weiterhin in appointments (counted = 'plus') –
--    die bestehende Verrechnung Nachhol → Minus → Plus bleibt unverändert.
--    Hier kommt nur die Abrechnung dazu.
-- ---------------------------------------------------------------------------
create table if not exists public.plusstunden_abrechnungen (
  id           uuid primary key default gen_random_uuid(),
  schueler_id  uuid not null references public.profiles(user_id) on delete cascade,
  vertrag_id   uuid references public.vertraege(id) on delete set null,
  anzahl       int not null check (anzahl > 0),
  stundensatz  numeric(10,2) not null check (stundensatz >= 0),
  summe        numeric(10,2) not null check (summe >= 0),
  faellig_am   date not null,
  bezahlt_am   date,
  erstellt_am  timestamptz not null default now()
);

create index if not exists plusabrechnung_schueler_idx
  on public.plusstunden_abrechnungen (schueler_id, bezahlt_am);

-- Verknüpfung: welche Stunde gehört zu welcher Abrechnung?
-- Nullable und rein additiv – bestehende Buchungen bleiben unverändert.
alter table public.appointments
  add column if not exists abrechnung_id uuid references public.plusstunden_abrechnungen(id) on delete set null;

create index if not exists appointments_plus_offen_idx
  on public.appointments (student_id)
  where counted = 'plus' and abrechnung_id is null;

-- ---------------------------------------------------------------------------
-- 5) BERECHTIGUNGEN
-- ---------------------------------------------------------------------------
alter table public.zahlungen                enable row level security;
alter table public.mahn_vorlagen            enable row level security;
alter table public.plusstunden_abrechnungen enable row level security;

drop policy if exists zahlungen_eigene on public.zahlungen;
create policy zahlungen_eigene on public.zahlungen
  for select using (
    public.is_admin() or exists (
      select 1 from public.vertraege v
      where v.id = zahlungen.vertrag_id and v.schueler_id = auth.uid()
    )
  );
drop policy if exists zahlungen_admin on public.zahlungen;
create policy zahlungen_admin on public.zahlungen
  for all using (public.is_admin()) with check (public.is_admin());

-- Vorlagen sind reine Innensicht.
drop policy if exists vorlagen_admin on public.mahn_vorlagen;
create policy vorlagen_admin on public.mahn_vorlagen
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists plusabrechnung_eigene on public.plusstunden_abrechnungen;
create policy plusabrechnung_eigene on public.plusstunden_abrechnungen
  for select using (schueler_id = auth.uid() or public.is_admin());
drop policy if exists plusabrechnung_admin on public.plusstunden_abrechnungen;
create policy plusabrechnung_admin on public.plusstunden_abrechnungen
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- 6) SPERRE BEI OFFENER ZAHLUNG
--    Ergänzt buchung_erlaubt() aus Teil 2: Neben der fehlenden AGB-Bestätigung
--    sperrt jetzt auch eine überfällige Rate (ab dem 11. des Monats).
-- ---------------------------------------------------------------------------
create or replace function public.buchung_erlaubt(p_schueler uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select
    -- kein laufender Vertrag ohne AGB-Bestätigung ...
    not exists (
      select 1 from public.vertraege v
      where v.schueler_id = p_schueler
        and v.status in ('angeboten','aktiv')
        and v.agb_akzeptiert_am is null
    )
    -- ... und keine überfällige Rate
    and not exists (
      select 1
      from public.zahlungen z
      join public.vertraege v on v.id = z.vertrag_id
      where v.schueler_id = p_schueler
        and z.bezahlt_am is null
        and z.offen_seit is not null
        and current_date > (date_trunc('month', z.monat) + interval '10 days')::date
    );
$$;

