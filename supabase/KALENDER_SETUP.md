# Terminkalender – Einrichtung (`/kalender`)

Kurzanleitung, um den Kalender online zu schalten. 3 Schritte.

## 1. Datenbank (Supabase)
Supabase-Dashboard → **SQL Editor** → Inhalt von `supabase/kalender_schema.sql` einfügen → **Run**.
Das legt die Tabellen `profiles`, `fixed_slots`, `appointments` an.

## 2. Umgebungsvariablen (Vercel → Project → Settings → Environment Variables)
Bereits vorhanden (aus dem Quiz): `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`.

Neu hinzufügen:

| Variable | Wert / Quelle |
|---|---|
| `SUPABASE_ANON_KEY` | Supabase → Settings → API → **anon public** key |
| `RESEND_API_KEY` | resend.com → API Keys (für Bestätigungs-/Absage-Mails) |
| `KALENDER_FROM` | *(optional)* Absender, z. B. `Lerne mit Anna <kalender@lernemitanna.de>` |
| `KALENDER_ADMIN_EMAIL` | *(optional, Standard `lernemitanna@outlook.com`)* |

**Resend-Domain:** In Resend die Domain `lernemitanna.de` verifizieren (DNS-Einträge),
damit Mails vom eigenen Absender verschickt werden. Ohne verifizierte Domain
kann Resend nur an die eigene Konto-Adresse senden.

## 3. Admin-Konto (Kleana)
1. Login-Zugang für `lernemitanna@outlook.com` anlegen: Supabase → **Authentication → Add user**
   (E-Mail + Passwort, „Auto Confirm“ an).
2. Danach im SQL Editor ausführen:

```sql
insert into public.profiles (user_id, name, email, role)
select id, 'Kleana', email, 'admin' from auth.users
where email = 'lernemitanna@outlook.com'
on conflict (user_id) do update set role = 'admin';
```

Fertig. Auf `https://lernflix.lernemitanna.de/kalender` einloggen → du siehst die
Admin-Ansicht und kannst über **„+ Neuen Schüler anlegen“** die ersten Schüler
einladen (sie bekommen Passwort per Mail).

## Rollen
- **Öffentlich (ohne Login):** nur frei/belegt, keine Namen.
- **Schüler (Login):** eigene Termine, Bilanz (Plus/Minus/Nachholen), buchen & absagen.
- **Kleana (Admin):** alles – bestätigen/absagen, Slots blockieren, Schüler anlegen, Übersicht.
