-- =============================================================================
-- Terminkalender V8: Startdatum für feste Wochentermine
--
-- In Supabase ausführen:  Dashboard → SQL Editor → einfügen → Run
-- Gefahrlos mehrfach ausführbar.
--
-- Hintergrund (Kleanas Fund): Beim Buchen eines festen Wochentermins klicken
-- die Eltern eine konkrete Zelle an – z. B. „Donnerstag 03.09., 17 Uhr".
-- Gespeichert wurde bisher aber nur „Donnerstag, 17 Uhr"; das Datum ging
-- verloren. Der Kalender malte den Termin deshalb auch in Wochen VOR dem
-- gewünschten Beginn (Lilly: 27.08., obwohl ab 03.09. gebucht).
--
-- Ab jetzt wird der angeklickte Tag als ab_datum gespeichert; Kalender und
-- Klassenzimmer-Stunden beginnen erst an diesem Tag. NULL = alter Stand
-- (gilt ab Buchungstag) – nichts Bestehendes ändert sich von allein.
-- =============================================================================
alter table public.fixed_slots add column if not exists ab_datum date;

comment on column public.fixed_slots.ab_datum is
  'Erster Geltungstag des festen Wochentermins - der Tag, den die Eltern beim Buchen angeklickt haben. NULL = ab Buchung (alter Stand).';
