# Virtuelles Klassenzimmer – Einrichtung & Test

Das Klassenzimmer ist ein Video-Unterrichtsraum unter deiner eigenen Domain
(`/stunde/<stunden-id>`), mit [Daily.co](https://www.daily.co) als
Video-Technik (Server in Frankfurt). Schüler loggen sich mit ihren
bestehenden Terminkalender-Zugangsdaten ein.

## 1. Einmalige Einrichtung (das musst du manuell tun)

### a) Daily-Konto anlegen
1. Konto auf https://dashboard.daily.co erstellen (kostenloser Start möglich).
2. Unter **Developers** den **API Key** kopieren.
3. Wichtig für Datenschutz: In den Daily-Einstellungen prüfen, dass als
   Region **Frankfurt (eu-central-1)** genutzt wird – der Code fordert das
   beim Raum-Erstellen zusätzlich explizit an (`geo: eu-central-1`).
4. **AV-Vertrag (DPA)** bei Daily anfragen/abschließen: siehe
   https://www.daily.co/legal/dpa – für DSGVO-konformen Unterricht nötig.

### b) Umgebungsvariablen
In `.env.local` (lokal) **und** in Vercel (Project → Settings →
Environment Variables) eintragen:

| Variable | Wert | Schon vorhanden? |
|---|---|---|
| `DAILY_API_KEY` | API-Key von dashboard.daily.co → Developers | **NEU – eintragen** |
| `SUPABASE_URL` | deine Supabase-Projekt-URL | ja (Terminkalender) |
| `SUPABASE_ANON_KEY` | Supabase anon key | ja (Terminkalender) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service_role key | ja (Terminkalender) |

⚠️ Diese Schlüssel niemals mit `NEXT_PUBLIC_`-Präfix anlegen – sie sind
geheim und bleiben nur auf dem Server.

Nach dem Eintragen in Vercel: neu deployen (erst wenn du das möchtest!).

### c) Datenbank-Migration ausführen
1. Supabase-Dashboard → **SQL Editor** öffnen.
2. Den kompletten Inhalt von `supabase/klassenzimmer_schema.sql` einfügen.
3. **Run** klicken. (Mehrfaches Ausführen schadet nicht.)

Das legt die Tabellen `lessons` (Stunden) und `lesson_participants`
(Teilnehmer bei Gruppen/Webinaren) an – inkl. Sicherheitsregeln:
Schüler sehen nur ihre eigenen Stunden, und die Video-Raum-Spalten
kann nur der Server schreiben.

## 2. Test-Stunde anlegen und ausprobieren

1. Im Supabase **SQL Editor** eine Test-Stunde anlegen (E-Mail des
   Test-Schülers anpassen – der Schüler muss im Terminkalender existieren):

   ```sql
   insert into public.lessons (teacher_id, student_id, starts_at, ends_at, title, subject, kind)
   select
     (select user_id from public.profiles where role = 'admin' limit 1),
     (select user_id from public.profiles where email = 'schueler@example.com'),
     now() + interval '5 minutes',
     now() + interval '65 minutes',
     'Test-Stunde', 'Mathe', 'einzel';
   ```

2. **Browser 1 (du):** `…/kalender` öffnen, als Kleana einloggen.
   Oben erscheint die Leiste „🎥 Nächste Stunde: Test-Stunde“ mit dem Button
   **„Zur Stunde“** (bei dir immer aktiv). Klicken → Geräte-Check → beitreten.
3. **Browser 2 (z. B. privates Fenster oder Handy):** `…/kalender` öffnen,
   als Test-Schüler einloggen. Der Button wird ab 15 Minuten vor Beginn
   aktiv (vorher Countdown). Beitreten → ihr solltet euch sehen und hören.
4. Testen: Kamera/Mikro an/aus, Bildschirm teilen, Chat, auf dem Handy
   öffnen (läuft im Browser, ohne App).

Direkt-Link zur Stunde: `…/stunde/<id>` (die id steht in der Tabelle
`lessons`). Der Link funktioniert nur für eingeloggte, berechtigte Personen.

## 3. Regeln, die eingebaut sind

* Schüler kommen frühestens **15 Minuten vor Beginn** rein und bis
  **30 Minuten nach Ende**. Danach läuft der Video-Raum automatisch ab.
* Du (Admin/Lehrerin) darfst **immer** rein und bist im Raum „Owner“
  (Moderations-Rechte).
* Räume sind **privat**: Beitritt nur mit persönlichem Meeting-Token, das
  der Server nach Login-Prüfung ausstellt. Keine ratbaren Links.
* Einzelstunde: max. 2 Teilnehmer; Gruppe/Webinar: max. 25.
* **Keine Aufzeichnung** (bewusst nicht eingebaut).

## 3b. Version 2: Übungen, Tafel, Stundenzettel, Belohnungen

Für die Klassenzimmer-Werkzeuge einmalig die zweite Migration ausführen:
Supabase → **SQL Editor** → Inhalt von `supabase/klassenzimmer_v2_schema.sql`
einfügen → **Run**.

Danach erscheint im Klassenzimmer rechts neben dem Video das Werkzeug-Panel:

* **🧮 Übungen**: Du stellst eine Aufgabe (selbst getippt oder per 🎲 aus der
  Lernflix-Quiz-Bank). Alle Schüler antworten gleichzeitig auf ihrem Gerät,
  du siehst live, wer was geantwortet hat. „Übung beenden" zeigt allen die
  Lösung und verteilt automatisch 10 Punkte pro richtiger Antwort.
* **✏️ Tafel**: Gemeinsames Whiteboard – beide können gleichzeitig schreiben
  und zeichnen (Striche erscheinen beim anderen nach 2–3 Sekunden). Nur du
  kannst die Tafel wischen.
* **📝 Zettel**: Stundenzettel („Was haben wir gemacht?" + Hausaufgaben).
  Du schreibst, Schüler lesen mit – auch nach der Stunde noch aufrufbar.
* **🐙 Belohnungen**: Punkte und Sticker (🐙 ⭐ 🏆) per Klick vergeben;
  Schüler sehen ihren Punktestand oben im Übungen-Tab.

## 4. Für Gruppenstunden/Webinare

Stunde mit `kind = 'gruppe'` (oder `'webinar'`) und `student_id = null`
anlegen, dann Teilnehmer eintragen:

```sql
insert into public.lesson_participants (lesson_id, user_id)
select '<lesson-id>', user_id from public.profiles where email in ('a@x.de', 'b@y.de');
```
