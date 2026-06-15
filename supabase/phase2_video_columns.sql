-- Content-Engine (Phase 2): Video-Spalten ergaenzen.
-- Einmal im Supabase SQL-Editor ausfuehren.

alter table content_log add column if not exists video_url text;
alter table content_log add column if not exists video_status text default 'none';
-- video_status: none | rendering | ready | failed
