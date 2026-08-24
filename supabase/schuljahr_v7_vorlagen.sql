-- =============================================================================
-- Lerne mit Anna – Schuljahresmodell, Teil 7: E-Mail-Vorlagen zur Unterschrift
--
-- Voraussetzung: schuljahr_v1 bis schuljahr_v6
-- In Supabase ausführen:  Dashboard → SQL Editor → einfügen → Run
--
-- Zwei Vorlagen, beide danach unter „Zahlungen → E-Mail-Vorlagen" änderbar:
--   * vertragEinladung   – geht raus, wenn ein Vertrag verschickt wird
--   * vertragErinnerung  – geht raus, wenn nach fünf Tagen nichts passiert ist
--
-- WICHTIG: Beide enthalten den persönlichen Unterschriftslink {link}. Sie
-- gehen deshalb AUSSCHLIESSLICH an die Familie – ohne Kopie an Kleana. Wer
-- den Link hat, kann unterschreiben; läge er auch im Postfach der Anbieterin,
-- stünde im System womöglich eine Unterschrift, die nicht von den Eltern
-- stammt. Das ist im Programm so festgelegt und durch einen Test abgesichert.
--
-- Gefahrlos mehrfach ausführbar.
-- =============================================================================

-- Platzhalter der Einladung:
--   {name} {schuljahr} {termin} {anzahl} {jahresbetrag} {raten} {rate}
--   {einmal} {link}
-- Platzhalter der Erinnerung:
--   {name} {schuljahr} {tage} {link}
insert into public.mahn_vorlagen (schluessel, betreff, text) values
  ('vertragEinladung',
   'Der Vertrag für {name} – bitte unterschreiben',
   E'Hallo,\n\nhier ist der Vertrag für {name} im Schuljahr {schuljahr}. Er liegt fertig im Anhang – von mir bereits unterschrieben, zusammen mit der Terminliste fürs ganze Schuljahr und den AGB. Jetzt fehlt nur noch deine Unterschrift.\n\nFester Termin: {termin}\nTermine im Schuljahr: {anzahl}\nJahresbetrag: {jahresbetrag}\n\nDu kannst wählen:\n• {raten} Monatsraten à {rate} (jeweils 1.–10. des Monats)\n• Einmalzahlung {einmal} (50,00 € Nachlass)\n\nHier geht es zum Vertrag:\n{link}\n\nUnterschrieben wird direkt auf der Seite – am Handy mit dem Finger, am Rechner mit der Maus. Danach bekommst du den von euch beiden unterschriebenen Vertrag als PDF, zusammen mit der Terminliste und den AGB. Der Link ist 14 Tage gültig.\n\nErst nach der Unterschrift lassen sich Stunden buchen und absagen – am besten also gleich erledigen, es dauert eine Minute.\n\nLiebe Grüße\nAnna'),
  ('vertragErinnerung',
   'Kurze Erinnerung: der Vertrag für {name}',
   E'Hallo,\n\nvor {tage} Tagen habe ich dir den Vertrag für {name} geschickt – unterschrieben ist er noch nicht. Vielleicht ist er im Alltag untergegangen, das kenne ich gut.\n\nHier ist ein frischer Link:\n{link}\n\nEs dauert wirklich nur eine Minute: zwei Häkchen setzen, mit dem Finger unterschreiben, fertig. Danach ist alles freigeschaltet und ihr könnt Stunden buchen und absagen.\n\nWenn etwas unklar ist oder du lieber auf Papier unterschreiben möchtest, meld dich einfach – wir finden eine Lösung.\n\nLiebe Grüße\nAnna')
on conflict (schluessel) do nothing;
