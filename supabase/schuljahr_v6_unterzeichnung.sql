-- =============================================================================
-- Lerne mit Anna – Schuljahresmodell, Teil 6: Unterzeichnung im Portal
--
-- Voraussetzung: schuljahr_v1 bis schuljahr_v5
-- In Supabase ausführen:  Dashboard → SQL Editor → einfügen → Run
--
-- Zwei Dinge – beide gefahrlos mehrfach ausführbar:
--   1) Bestehende Verträge nachziehen, damit die neue Buchungssperre sie
--      nicht plötzlich aussperrt
--   2) Die Vorlage für die Bestätigungs-E-Mail nach der Unterschrift
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1) BESTEHENDE VERTRÄGE NACHZIEHEN
--
-- Bis jetzt genügte die AGB-Zustimmung, um buchen zu dürfen. Ab sofort zählt
-- die Unterschrift. Verträge, die vorher auf dem alten Weg bestätigt wurden,
-- bekommen deshalb den Zeitpunkt der Zustimmung als Unterschriftsdatum –
-- sonst könnten diese Familien von einem Tag auf den anderen nichts mehr
-- buchen, ohne etwas falsch gemacht zu haben.
--
-- Neue Verträge sind davon nicht betroffen: dort entstehen Zustimmung und
-- Unterschrift ohnehin im selben Augenblick.
-- ---------------------------------------------------------------------------
update public.vertraege
   set unterzeichnet_am = agb_akzeptiert_am
 where agb_akzeptiert_am is not null
   and unterzeichnet_am is null;

-- ---------------------------------------------------------------------------
-- 2) E-MAIL-VORLAGE: VERTRAG UNTERSCHRIEBEN
--
-- Geht an die Eltern, sobald im Portal unterschrieben wurde – mit dem
-- fertigen Vertrag, der Terminliste und den AGB im Anhang. Eine Kopie geht
-- automatisch an Kleana. Der Text ist unter „Zahlungen → E-Mail-Vorlagen"
-- jederzeit änderbar.
--
-- Platzhalter in geschweiften Klammern:
--   {name} {schuljahr} {termin} {anzahl} {jahresbetrag} {zahlweise}
--   {inhaber} {iban} {verwendungszweck}
-- ---------------------------------------------------------------------------
insert into public.mahn_vorlagen (schluessel, betreff, text) values
  ('vertragUnterschrieben',
   'Vertrag unterschrieben – Schuljahr {schuljahr}',
   E'Hallo,\n\nvielen Dank – der Vertrag für {name} ist unterschrieben und der Unterricht ist freigeschaltet.\n\nFester Termin: {termin}\nTermine im Schuljahr: {anzahl}\nJahresbetrag: {jahresbetrag}\nZahlweise: {zahlweise}\n\nÜberweisung an:\n{inhaber}\nIBAN: {iban}\nVerwendungszweck: {verwendungszweck}\n\nIm Anhang findest du den unterschriebenen Vertrag, die Terminliste für das ganze Schuljahr und die AGB. Bitte gut aufbewahren.\n\nIm Kalender könnt ihr ab sofort Termine absagen, Nachholstunden buchen und die Terminliste jederzeit ansehen.\n\nLiebe Grüße\nAnna')
on conflict (schluessel) do nothing;
