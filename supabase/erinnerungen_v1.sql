-- =============================================================================
-- erinnerungen_v1 – Zeitgeber für Kleanas Termin-Erinnerungen (Web Push)
--
-- Vercels eigener Zeitplan kann im Hobby-Tarif nur EINMAL TÄGLICH laufen –
-- für „15 Minuten vorher" viel zu selten. Deshalb stößt die Supabase-
-- Datenbank die Erinnerungs-Route alle 5 Minuten selbst an (pg_cron ruft
-- über pg_net die Route auf; die prüft dann, ob in den nächsten Minuten
-- ein Termin beginnt, und schickt nur dann eine Nachricht).
--
-- Einfach komplett in den Supabase-SQL-Editor einfügen und ausführen.
-- Nochmaliges Ausführen ist unschädlich (der Job wird dann nur erneuert).
-- =============================================================================
create extension if not exists pg_cron;
create extension if not exists pg_net;

select cron.schedule(
  'lernflix-erinnerungen',        -- Name des Jobs (beim erneuten Ausführen: Update)
  '*/5 * * * *',                  -- alle 5 Minuten
  $$
  select net.http_get(
    url     := 'https://lernflix.lernemitanna.de/api/cron/erinnerungen',
    headers := '{"Authorization": "Bearer LMA-cron-9f3kX7wQpT2mZv8rN4bH6sJd"}'::jsonb
  )
  $$
);
