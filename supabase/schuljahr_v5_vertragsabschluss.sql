-- =============================================================================
-- Lerne mit Anna – Schuljahresmodell, Teil 5: Vertragsabschluss im System
--
-- Voraussetzung: schuljahr_v1 bis schuljahr_v4
-- In Supabase ausführen:  Dashboard → SQL Editor → einfügen → Run
--
-- Drei Dinge:
--   1) WICHTIGE KORREKTUR an profiles.minus_hours (siehe unten)
--   2) Daten der Erziehungsberechtigten am Vertrag – für die Vertrags-PDF
--   3) Felder für die Unterzeichnung im Portal
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1) KORREKTUR: Obergrenze der Minus-Stunden von 3 auf 4
--
-- Die Regel im Code erlaubt seit der Umstellung VIER offene Minus-Stunden,
-- die Datenbank ließ aber weiterhin nur DREI zu. Die vierte Gutschrift wäre
-- abgewiesen worden – und weil die Schreibung ihren Fehler bisher verschluckt
-- hat, wäre die Stunde still verloren gegangen, obwohl der Schülerin eine
-- Gutschrift angezeigt wurde.
-- ---------------------------------------------------------------------------
alter table public.profiles
  drop constraint if exists profiles_minus_hours_check;
alter table public.profiles
  add constraint profiles_minus_hours_check
  check (minus_hours >= 0 and minus_hours <= 4);

-- ---------------------------------------------------------------------------
-- 2) ERZIEHUNGSBERECHTIGTE  (für die Vertrags-PDF)
--    Alle optional: ein Vertrag soll auch dann anlegbar sein, wenn noch
--    nicht jedes Feld bekannt ist. Die PDF lässt Unbekanntes einfach weg.
-- ---------------------------------------------------------------------------
alter table public.vertraege add column if not exists eltern_name      text;
alter table public.vertraege add column if not exists eltern_anschrift text;
alter table public.vertraege add column if not exists eltern_email     text;
alter table public.vertraege add column if not exists eltern_telefon   text;

comment on column public.vertraege.eltern_email is
  'Abweichende Vertragsadresse. Ist sie leer, gilt die E-Mail aus profiles.';

-- ---------------------------------------------------------------------------
-- 3) UNTERZEICHNUNG IM PORTAL
--    Die Unterschrift der Eltern entsteht auf einer Zeichenfläche und wird
--    als Daten-URI abgelegt – wie Kleanas Unterschrift in Teil 4.
-- ---------------------------------------------------------------------------
alter table public.vertraege add column if not exists eltern_unterschrift   text;
alter table public.vertraege add column if not exists unterzeichnet_am      timestamptz;
alter table public.vertraege add column if not exists agb_bestaetigt_am     timestamptz;
alter table public.vertraege add column if not exists widerruf_bestaetigt_am timestamptz;
-- Zeitpunkt der Einladung – Grundlage für die Erinnerung nach fünf Tagen.
alter table public.vertraege add column if not exists eingeladen_am         timestamptz;
alter table public.vertraege add column if not exists erinnert_am           timestamptz;
-- Fallback: extern unterschriebene PDF (z. B. Foto aus WhatsApp).
alter table public.vertraege add column if not exists externe_unterschrift  text;
alter table public.vertraege add column if not exists manuell_aktiviert_am  timestamptz;

comment on column public.vertraege.externe_unterschrift is
  'Von Kleana hochgeladene, außerhalb des Portals unterschriebene Fassung.';
