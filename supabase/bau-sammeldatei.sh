{
cat <<'KOPF'
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
-- HINWEIS: Diese Datei wird aus den sieben Einzeldateien zusammengesetzt.
-- Nicht von Hand bearbeiten – tests/sql-sammeldatei.test.ts prüft, dass
-- sie zum Inhalt der Einzeldateien passt.
-- =============================================================================


KOPF
for f in supabase/schuljahr_v1_schema.sql supabase/schuljahr_v2_vertraege.sql supabase/schuljahr_v3_zahlungen.sql supabase/schuljahr_v4_unterschrift.sql supabase/schuljahr_v5_vertragsabschluss.sql supabase/schuljahr_v6_unterzeichnung.sql supabase/schuljahr_v7_vorlagen.sql; do
  echo ""; echo "-- #############################################################################"
  echo "-- ### TEIL AUS: $(basename $f)"
  echo "-- #############################################################################"; echo ""
  cat "$f"; echo ""
done
} > supabase/schuljahr_ALLES.sql
