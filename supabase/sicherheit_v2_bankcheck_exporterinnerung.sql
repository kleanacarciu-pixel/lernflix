-- ===========================================================================
-- SICHERHEIT V2: Export-Erinnerung in der monatlichen Bank-Check-Mail
--
-- Die "Kurzer Bank-Check"-Mail (Tag 9, an Kleana selbst) bekommt zwei
-- zusätzliche Sätze: Erinnerung, die beiden Selbst-Exporte herunterzuladen
-- und in ihrem eigenen Backup-Ordner zu sichern.
--
-- Ausführen: Supabase Studio -> SQL Editor -> einfügen -> Run.
-- Die Migration ist wiederholbar (idempotent) und hängt den Text nur an,
-- falls er noch nicht drinsteht - eigene Anpassungen an der Vorlage bleiben
-- dabei erhalten.
-- ===========================================================================

update public.mahn_vorlagen
set text = text || E'\n\nDenk auch daran, die beiden Exporte zu sichern: Kalenderstand als CSV (im Kalender) und Alle Daten (bei Zahlungen). Beide herunterladen und in deinem eigenen Backup-Ordner speichern.',
    geaendert_am = now()
where schluessel = 'adminCheck'
  and text not like '%Kalenderstand als CSV%';
