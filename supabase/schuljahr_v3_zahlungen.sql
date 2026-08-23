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
