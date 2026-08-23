# Durchlauf: der ganze Vertragsabschluss am Stück

Dieses Werkzeug spielt den kompletten Weg durch – Vertrag anlegen,
Einladung, Unterschrift auf der Zeichenfläche, PDF, Bestätigungsmail,
Buchungssperre, Papier-Rückfall und die Erinnerung nach fünf Tagen.

Gearbeitet wird gegen den **echten** Server. Nur zwei Dinge sind ersetzt:
die Datenbank und der E-Mail-Versand. `fake-supabase.mjs` spricht so viel
PostgREST, wie das System benutzt, und sammelt die E-Mails samt Anhängen
ein, statt sie zu verschicken. Alles dazwischen ist der Code, der auch im
Betrieb läuft.

## Ausführen

Playwright und Chromium müssen vorhanden sein.

```bash
npm run build

SUPABASE_URL=http://127.0.0.1:3910 \
SUPABASE_SERVICE_ROLE_KEY=test-service-key \
SUPABASE_ANON_KEY=test-anon-key \
RESEND_API_KEY=test \
RESEND_URL=http://127.0.0.1:3910/emails \
KALENDER_URL=http://127.0.0.1:3911 \
KALENDER_ADMIN_EMAIL=lernemitanna@outlook.com \
BANK_INHABER="Kleana Carciu" BANK_IBAN="DE00 0000 0000 0000 0000 00" \
CRON_SECRET=test-secret \
npx next start -p 3911 &

CRON_SECRET=test-secret node werkzeuge/durchlauf/durchlauf.mjs
```

Am Ende steht, wie viele Prüfungen bestanden sind. Die erzeugte Vertrags-PDF
landet neben dem Skript als `durchlauf-vertrag.pdf`.

## Warum nicht unter tests/

`npm test` läuft ohne Browser und ohne Server. Dieser Durchlauf braucht
beides und dauert deshalb länger – er gehört in die Hand, nicht in jeden
Testlauf.
