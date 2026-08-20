-- ===========================================================================
-- KALENDER V7: Microsoft-Teams-Link pro Schüler
--
-- Kleana macht die Video-Stunden über Teams. Jeder Schüler kann einen
-- eigenen Teams-Link bekommen; Kleanas eigener Link (Admin-Profil) gilt
-- als Standard für alle ohne eigenen Link. Alle "Zur Stunde"-Knöpfe und
-- Bestätigungs-Mails nutzen dann automatisch Teams.
--
-- Ausführen: Supabase Studio -> SQL Editor -> einfügen -> Run.
-- Die Migration ist wiederholbar (idempotent).
-- ===========================================================================

alter table public.profiles add column if not exists teams_link text;
