# Orga-System „Lerne mit Anna" – Konzept (Schritt 1 von 4)

Stand: 02.11.2026 · Status: **Entwurf zur Abstimmung mit Kleana** · Noch kein Code.

Dieses Dokument ist Schritt 1 aus dem Briefing: Recherche + Konzept (Rollen, Datenmodell, Screens).
Kapitel 8 enthält die **Rückfragen an Kleana** (Schritt 2), Kapitel 9 den **MVP-Plan in Etappen** (Schritt 3).
Code entsteht erst, wenn Kleana die Rückfragen beantwortet und den Plan freigegeben hat.

---

## 0. Kurzfassung

- **Eigenständiges System**: eigenes Supabase-Projekt, eigenes Vercel-Projekt, keine Verbindung zum Terminportal (lernflix). Keine gemeinsamen Tabellen, keine gemeinsamen Logins.
- **Ein Login pro Person**, Rechte kommen ausschließlich über **Rollen**, die Kleana selbst anlegt und zusammenstellt.
- **Rollen = Bündel fester Berechtigungen.** Die Berechtigungen selbst (z. B. „eigene Stunden sehen", „Anrufliste bearbeiten") sind im Code festgelegt; Kleana kombiniert sie zu Rollen wie „Lehrkraft", „Büro-Praktikant", „Finanzen". So bleibt es flexibel, aber nie unsicher.
- **Datenschutz wird in der Datenbank erzwungen** (Supabase Row Level Security), nicht nur in der Oberfläche. Elternkontaktdaten liegen in einer eigenen Tabelle, die **nur die Admin-Rolle** lesen kann. Lehrkräfte sehen nur ihre eigenen Schüler mit minimalen Angaben.
- **MVP in 4 Etappen**: (1) Fundament: Login, Rollen, Personen. (2) Stundenplan + Stundenberichte. (3) Benachrichtigungen + Termine (Teamrunde, Hospitation) + Eltern-Feedback-Erinnerung. (4) Praktikanten-Aufgaben + Firmen-CRM-light. Danach Erweiterungen (Firmenprojekte, Geburtstage, Kids-Club, Materialboxen).

---

## 1. Recherche: Wie bauen große Firmen ihr Mitarbeiter-System auf? (Fokus BMW)

### 1.1 Vorbemerkung zur Quellenlage

BMW veröffentlicht den Aufbau seines Intranets nicht. Was folgt, stützt sich auf **öffentlich belegbare Bausteine** (App-Store-Einträge, Presse- und Karriereseiten, Fachpresse) und ist in 1.2 mit Quellen belegt. In 1.3 ergänze ich, was in Konzernen dieser Größe **übliche Praxis** ist. Das ist dort ausdrücklich als allgemeine Praxis gekennzeichnet und nicht als BMW-Fakt.
Einige Primärquellen (bmwgroup.jobs, press.bmwgroup.com) konnten in dieser Arbeitsumgebung nicht direkt abgerufen werden. Die Angaben beruhen dort auf Suchergebnis-Auszügen.

### 1.2 Was über BMW öffentlich belegt ist

| Baustein | Was BMW macht | Quelle |
|---|---|---|
| **Eine digitale Identität pro Person** | Jede Person hat eine persönliche Kennung („Q-Nummer"/Q-Account). Damit meldet sie sich im Intranet, in Partnerportalen und im Fernzugang an. Für den Zugriff von außen gilt Zwei-Faktor-Anmeldung (Push-App oder PIN der Mitarbeiter-App). | [BMW HomeNetwork – Anleitung](https://homenetwork.bmwgroup.net/documents/10181/0/OTP_Anleitung_Reg.pdf/179cc5d0-d9cb-911b-a602-3be574a9fb8a), [FAQ](https://homenetwork.bmwgroup.net/faqnew), [B2B-Portal Registrierung](https://b2b.bmw.com/web/b2b/registration) |
| **Rollenmodell mit Genehmigungsprozessen** | BMW hat sein Berechtigungsmanagement zentralisiert: über 200.000 IT-Nutzer, mehrere tausend modellierte Rollen, 15 Genehmigungsprozesse. Ziel war, Berechtigungen schneller und nachvollziehbar zu vergeben. *(Projekt ca. 2007–2009, also älter, das Prinzip gilt aber unverändert.)* | [CIO.de – BMW vereinheitlicht IT-Sicherheitsmanagement](https://www.cio.de/article/3662920/bmw-vereinheitlicht-it-sicherheit-management.html) |
| **Lebenszyklus von Konten** | Identitäten werden über den ganzen Weg verwaltet: Eintritt, Wechsel, Austritt („onboarding, transfers and terminations"). | [Stellenanzeige IAM Analyst, BMW Financial Services](https://www.connecticum.de/jobboerse/identity-access-management-analyst-stellenangebot-1736356.html) |
| **Mitarbeiter-App für Kommunikation** | „WE@BMWGROUP" (basiert auf der Plattform Staffbase) bündelt News, Pressemitteilungen, Karriere, einen Veranstaltungskalender und Umfragen. **Zusätzliche Funktionen nur für berechtigte Nutzer**, also rollenabhängige Inhalte. | [Google Play](https://play.google.com/store/apps/details?id=com.staffbase.bmwgrouplive&hl=en_US), [App Store](https://apps.apple.com/de/app/we-bmwgroup/id1476406735?l=en-GB) |
| **Strukturiertes Onboarding** | „Drive": 12-monatiges Onboarding-Programm. Module wählt man in Absprache mit der Abteilung flexibel, Einblicke in andere Bereiche (z. B. Produktion) sind freiwillig. Die BMW M GmbH ergänzt das mit der spielerischen Onboarding-App „Welcome @ Planet M". | [BMW Karriere – Drive](https://www.bmwgroup.jobs/de/de/ueber-uns/benefits/drive-programm.html), [fifty1 – Gamifiziertes Onboarding für BMW](https://fifty1.com/blog/2022/10/19/gamification/entwicklung-eines-gamifizierten-onboarding-programms-fuer-bmw/), [eLearning Journal](https://www.elearning-journal.com/2023/01/kategorie-automotive-2/) |
| **Self-Service statt Ticket** | Interne Teams beantragen Cloud-Ressourcen selbst über ein „Cloud Self Service Portal". Über 50.000 Anfragen wurden so automatisiert. | [AWS Blog](https://aws.amazon.com/blogs/industries/cloud-driven-enterprise-transformation-at-the-bmw-group/), [Nordcloud Case Study](https://nordcloud.com/case-studies/bmw-group/) |
| **Einheitlicher digitaler Arbeitsplatz** | Microsoft 365 E5 weltweit für über 150.000 Beschäftigte, damit alle unabhängig vom Standort dieselben Arbeitsbedingungen haben. | [Microsoft News DE](https://news.microsoft.com/de-de/mehr-produktivitaet-und-sicherheit-fuer-die-bmw-group-mit-microsoft-365-e5/) |
| **Team entscheidet über Arbeitsweise** | „ConnectedWorks" (ca. 70.000 Beschäftigte): Jedes Team legt selbst fest, wie es Präsenz und digitale Zusammenarbeit kombiniert. | [BMW Group Presse](https://www.press.bmwgroup.com/global/article/detail/T0348672EN/imagining-the-cooperation-of-the-future:-bmw-group-creates-flexible-working-environments-with-connectedworks) |
| **Support-Zentrale** | Ein zentrales Anwender-Service-Center hilft Beschäftigten, Händlern und Lieferanten. | [CIO.de – Gut aufgehoben](https://www.cio.de/article/3657159/gut-aufgehoben.html) |

### 1.3 Übliche Konzern-Praxis (allgemein, nicht BMW-spezifisch belegt)

- **Mitbestimmung**: In Deutschland unterliegen IT-Systeme, die Leistung oder Verhalten von Beschäftigten überwachen *können*, der Mitbestimmung (§ 87 Abs. 1 Nr. 6 BetrVG). Konzerne regeln deshalb in IT-Betriebsvereinbarungen Zweck, Protokolldaten und das **Verbot der Leistungskontrolle über Logdaten** ([betriebsrat.de](https://www.betriebsrat.de/fachartikel/digitaler-wandel/informations-und-mitbestimmungsrechte-des-betriebsrats-rund-um-it-systeme-3133653), [CMS](https://cms.law/de/deu/legal-updates/it-mitbestimmung-datenschutz-nicht-mitbestimmt), [Kliemt](https://kliemt.blog/2020/09/16/it-rahmenbetriebsvereinbarung-die-antwort-auf-antiquiertes-betriebs-verfassungsrecht/)). *Für uns relevant:* Stundenberichte und „Bericht überfällig"-Hinweise sind fachliche Dokumentation. Sie sollen ausdrücklich **nicht** zur Leistungsbewertung dienen, und das schreiben wir auch so in die Datenschutzinfo.
- **Joiner-Mover-Leaver**: Konten werden beim Eintritt *aus einer Vorlage* (Rolle) erzeugt, beim Wechsel umgehängt und beim Austritt sofort gesperrt. Rechte hängen nie an der Person direkt, sondern immer an der Rolle.
- **Least Privilege + Rezertifizierung**: Jeder bekommt nur das Nötigste. In festen Abständen prüft eine verantwortliche Person, ob die Rechte noch stimmen.
- **Persönliche Startseite**: Ein stabiler gemeinsamer Kern (News, Termine, Handbuch) plus wenige rollenspezifische Kacheln. Forschung zu Intranets zeigt: Stark personalisierte Portale sind teuer und werden oft kaum genutzt. Entscheidend ist, dass Vorlagen, Checklisten und Regeln **auffindbar** sind ([Perficient zu Nielsen-Studie](https://blogs.perficient.com/2011/07/19/jakob-nielsons-take-on-intranet-portals), [CMSWire](https://www.cmswire.com/cms/web-content/intranet-personalization-does-it-work-001678.php), [Knowledge Architecture/NN/g](https://knowledge-architecture.com/events/intranet-navigation-best-practices-research-findings-from-nielsen-norman-group-and-knowledge-architecture)).
- **Aufgaben vor Organigramm**: Die Navigation folgt dem, was man tun will („Bericht schreiben"), nicht der Abteilungsstruktur.
- **Benachrichtigungen mit Kanal-Hierarchie**: dringend → Push, normal → In-App, Sammelmail einmal täglich. Wer zu viel benachrichtigt, wird ignoriert.
- **Onboarding als Checkliste mit Paten** (Buddy), verteilt auf Vor dem ersten Tag / Tag 1 / Woche 1 / 30-60-90 Tage ([Haufe – Pate/Buddy](https://www.haufe.de/id/beitrag/onboarding-neue-mitarbeiter-einfuehren-und-nachhaltig-in-461-der-patebuddy-als-starthelfer-HI16572964.html)).
- **Audit-Log**: Wer hat wann welche sensiblen Daten angesehen oder geändert.

### 1.4 Was ein Betrieb mit 5–20 Leuten davon übernimmt

| Konzern-Prinzip | Übernehmen? | So setzen wir es um |
|---|---|---|
| Eine Identität pro Person, 2FA | ✅ Ja | Supabase-Login per E-Mail (Magic Link oder Passwort). 2FA (TOTP) **Pflicht für Admin und Finanzen**, für alle anderen optional. |
| Rechte nur über Rollen | ✅ Ja | Kleana legt Rollen an und hakt Berechtigungen an. Eine Person kann mehrere Rollen haben (z. B. Lehrkraft + Kids-Club). |
| Tausende Rollen, 15 Genehmigungsprozesse | ❌ Nein | Eine einzige Freigabestelle: Kleana. Kein Workflow-Engine-Overhead. |
| Joiner-Mover-Leaver | ✅ Ja, vereinfacht | „Person einladen" → Rolle wählen → Einladungsmail. „Person deaktivieren" sperrt sofort, Daten bleiben für Aufbewahrungsfristen erhalten. |
| Rezertifizierung | ✅ Ja, leichtgewichtig | Alle 6 Monate eine Aufgabe für Kleana: „Bitte Rollen prüfen", mit Liste aller Personen und Rollen. |
| Mitarbeiter-App (News, Kalender, Umfragen) | ⚠️ Teilweise | Startseite mit Ankündigungen und Terminen, als **installierbare Web-App (PWA)** mit Push. Keine eigene native App. Umfragen später. |
| 12-Monats-Onboarding „Drive" | ✅ Als Mini-Version | Onboarding-Checkliste pro Rolle (z. B. Praktikant: „Datenschutz-Belehrung gelesen", „Erste Hospitation", „Erste Teamrunde"). Kleana pflegt die Vorlagen. |
| Gamification (Planet M) | ❌ Nein | Lohnt sich bei Tausenden Neuen, nicht bei 5–20. |
| Self-Service | ✅ Ja | Eigene Daten ändern, Verfügbarkeit eintragen, Berichte nachsehen, Termine zusagen. Ziel: weniger WhatsApp-Rückfragen an Kleana. |
| Wissens-/Handbuchbereich | ✅ Ja (Etappe 3+) | Einfache Seiten: „So läuft eine Stunde", Vorlagen, Notfallnummern. Zuerst Link-Sammlung, später ausbauen. |
| IT-Betriebsvereinbarung / Zweckbindung | ✅ Als Prinzip | Kein Betriebsrat nötig, aber dieselbe Haltung: Zweck jeder Datenart dokumentieren, Protokolle nicht zur Leistungskontrolle nutzen. Wird Teil des Verarbeitungsverzeichnisses. |
| Audit-Log | ✅ Ja | Nur für sensible Aktionen: Elterndaten angesehen/geändert, Rollen geändert, Person deaktiviert. |
| Zentrales Support-Center | ❌ Nein | Ein „Problem melden"-Knopf, der eine Aufgabe für Kleana erzeugt. |

---

## 2. Grundprinzipien

1. **Getrennt vom Terminportal.** Eigenes Supabase-Projekt, eigene Domain (z. B. `team.lernemitanna.de`). Schülerstammdaten werden im Orga-System separat und minimal gepflegt.
2. **Datenschutz in der Datenbank.** Jede Tabelle hat RLS-Regeln. Die Oberfläche blendet nur aus, was die Datenbank ohnehin nie herausgibt.
3. **Elternkommunikation nur über Kleana.** Elternkontakte stehen in einer getrennten Tabelle (`guardian_contacts`) mit RLS nur für die Berechtigung `parents.contact.read`. Diese Berechtigung lässt sich **keiner anderen Rolle als Admin zuweisen**, das ist im Code gesperrt.
4. **Datenminimierung bei Schülern.** Lehrkräfte sehen: Vorname, Anfangsbuchstabe Nachname, Klassenstufe, Fach/Förderbereich, pädagogische Notizen, die für den Unterricht nötig sind. Keine Adresse, kein Geburtsdatum, keine Elterndaten, keine Abrechnungsdaten.
5. **Rollen sind Daten, Berechtigungen sind Code.** Kleana kann beliebig viele Rollen und Abteilungen anlegen, aber nur aus einem festen Katalog von Berechtigungen wählen. Neue Funktionen bringen neue Berechtigungen mit.
6. **Erweiterbar über „Einsatz-Typen".** Stunden, Geburtstage, Kids-Club und Firmenprojekte sind alles „Einsätze" mit Ort, Zeit, Personal und optional Teilnehmenden. So kommen spätere Bereiche ohne Umbau dazu.
7. **Mobile first.** Lehrkräfte schreiben Berichte meist direkt nach der Stunde am Handy.

---

## 3. Rollen, Abteilungen, Berechtigungen

### 3.1 Begriffe

- **Abteilung** (`department`): organisatorische Gruppe, z. B. „Pädagogik", „Büro", „Finanzen", „Marketing", „Programme". Sie dient zum Filtern, für Ankündigungen („an alle in Programme") und Teamrunden. **Abteilungen vergeben keine Rechte.**
- **Rolle** (`role`): Bündel von Berechtigungen, z. B. „Lehrkraft", „Pädagogische:r Praktikant:in", „Büro-Praktikant:in", „Finanzen", „Marketing", „Programm-Team Kids-Club", „Admin".
- **Berechtigung** (`permission`): feste Fähigkeit im System (Katalog unten).
- **Umfang** (`scope`): bei vielen Berechtigungen `own` (nur eigene Datensätze) oder `all`.

### 3.2 Berechtigungskatalog (MVP)

| Schlüssel | Bedeutung |
|---|---|
| `lessons.read.own` | eigene Stunden sehen |
| `lessons.read.all` | alle Stunden sehen |
| `lessons.manage` | Stunden anlegen, ändern, Lehrkräften zuweisen |
| `students.read.assigned` | eigene (zugewiesene) Schüler minimal sehen |
| `students.manage` | Schüler anlegen und bearbeiten (ohne Elterndaten) |
| `parents.contact.read` | Elternkontaktdaten sehen. **Nur Admin, gesperrt** |
| `reports.write.own` | Stundenberichte zu eigenen Stunden schreiben |
| `reports.read.all` | alle Berichte lesen |
| `reports.template.manage` | Berichtsformular bearbeiten |
| `events.manage` | Teamrunden und Hospitationen anlegen |
| `tasks.read.own` / `tasks.manage` | eigene Aufgaben / Aufgaben verteilen |
| `calllists.work` | Anruflisten abarbeiten, Gespräche protokollieren |
| `crm.read` / `crm.manage` | Firmen-CRM lesen / bearbeiten |
| `people.manage` | Personen einladen, deaktivieren, Rollen zuweisen |
| `roles.manage` | Rollen und Abteilungen anlegen |
| `announcements.publish` | Ankündigungen veröffentlichen |
| `audit.read` | Audit-Log einsehen |

### 3.3 Vorschlag Startrollen (Kleana kann alles ändern)

| Rolle | Berechtigungen |
|---|---|
| **Admin (Kleana)** | alle |
| **Lehrkraft** | `lessons.read.own`, `students.read.assigned`, `reports.write.own`, `tasks.read.own` |
| **Pädagogische:r Praktikant:in** | `lessons.read.own` (nur Stunden, bei denen sie/er als Hospitierende:r eingetragen ist), `students.read.assigned` (nur diese Stunden), `tasks.read.own`. **Schreibt keine offiziellen Stundenberichte**, sondern optional einen Hospitationsbericht. → *Rückfrage 4* |
| **Büro-Praktikant:in** | `tasks.read.own`, `calllists.work`, `crm.read`. Kein Zugriff auf Schüler. |
| **Finanzen** (später) | `lessons.read.all` (für Abrechnungsabgleich), `reports.read.all`? → *Rückfrage 11*. Kein Zugriff auf pädagogische Notizen. |
| **Marketing** (später) | `crm.read`, `crm.manage`, `announcements.publish` |
| **Programme** (später) | Einsätze Kids-Club/Geburtstage sehen und verwalten |

---

## 4. Datenmodell (Supabase / Postgres)

Alle Tabellen haben `id uuid`, `created_at` und `updated_at`. RLS ist überall aktiv. Die Rechteprüfung läuft über eine SQL-Funktion `has_permission(perm text)`, die die Rollen der angemeldeten Person auswertet.

### 4.1 Personen & Rechte

```
profiles            (id = auth.users.id, display_name, phone_internal?, status[active|inactive],
                     onboarding_started_at, deactivated_at)
departments         (name, description)
profile_departments (profile_id, department_id)
roles               (name, description, is_system bool)      -- Admin ist is_system
role_permissions    (role_id, permission_key)                 -- permission_key aus festem Katalog (CHECK/Enum)
profile_roles       (profile_id, role_id, valid_from, valid_until?)   -- befristet für Praktika
```

### 4.2 Schüler & Eltern (streng getrennt)

```
students            (first_name, last_initial, grade_level, subjects text[], support_focus,
                     pedagogical_notes, status[active|paused|ended], start_date)
                     -- RLS: students.manage ODER zugewiesen über teacher_assignments
guardian_contacts   (student_id, name, email, phone, preferred_channel, notes)
                     -- RLS: NUR has_permission('parents.contact.read'); jeder Lesezugriff → audit_log
teacher_assignments (student_id, profile_id, subject, valid_from, valid_until)
```

Lehrkräfte lesen Schüler über eine **View `my_students`**, die nur die freigegebenen Spalten enthält.

### 4.3 Einsätze, Stunden, Termine

```
engagement_types    (key: lesson|birthday|kids_club|company_project|..., label)   -- erweiterbar
engagements         (type_key, title, starts_at, ends_at, location_kind[online|vor_ort|zuhause],
                     location_text, recurrence_rule?, series_id?, status[planned|done|cancelled])
engagement_staff    (engagement_id, profile_id, role_in_engagement[lead|assist|observer])
engagement_students (engagement_id, student_id)
events              (kind[teamrunde|hospitation|schulung|sonstiges], title, starts_at, ends_at,
                     location, related_engagement_id?)      -- Hospitation verweist auf die Stunde
event_participants  (event_id, profile_id, rsvp[open|yes|no])
availability        (profile_id, weekday, from_time, to_time)    -- Self-Service, Etappe 3+
```

### 4.4 Stundenberichte

```
report_templates    (name, version, schema jsonb, active bool)
                     -- Felder als JSON-Schema, nachgebaut nach Kleanas bisherigem Format
lesson_reports      (engagement_id, student_id, author_id, template_id, template_version,
                     answers jsonb, status[draft|submitted], submitted_at, due_at)
                     -- RLS: Autor:in schreibt eigene; reports.read.all liest alle
```

Das Berichtsformular wird also **aus einer Vorlage erzeugt**. Ändert Kleana das Format, entsteht eine neue Version, und alte Berichte bleiben lesbar.

### 4.5 Benachrichtigungen & Aufgaben

```
notifications       (recipient_id, kind, title, body, link, read_at, push_sent_at, email_sent_at)
notification_prefs  (profile_id, kind, channel_push bool, channel_email bool)
push_subscriptions  (profile_id, endpoint, keys jsonb)
tasks               (kind[general|parent_feedback|call|onboarding|review_roles|problem_report],
                     title, description, assignee_id, created_by, due_at, status[open|done|skipped],
                     related_student_id?, related_company_id?, recurrence?)
onboarding_templates(role_id, items jsonb)        -- Checkliste je Rolle
```

**Eltern-Feedback nach 3 Monaten**: Beim Anlegen eines Schülers (`start_date`) erzeugt das System eine Aufgabe `parent_feedback` für Kleana, fällig 3 Monate später. Ist sie erledigt, folgt optional die nächste (alle 3 Monate? → *Rückfrage 6*).

### 4.6 Büro: Anruflisten & Firmen-CRM-light

```
companies           (name, industry, city, website, status[lead|kontaktiert|interessiert|kunde|kein_interesse],
                     owner_id?, next_step, next_step_at)
company_contacts    (company_id, name, role, email, phone)     -- Firmenkontakte, KEINE Eltern
call_lists          (name, description, created_by)
call_list_items     (call_list_id, company_id, assignee_id, status[offen|erreicht|nicht_erreicht|rückruf|erledigt],
                     callback_at?)
interactions        (company_id, profile_id, kind[anruf|mail|treffen|notiz], summary, happened_at)
```

### 4.7 Protokoll

```
audit_log           (actor_id, action, entity, entity_id, at, meta jsonb)
                     -- nur sensible Aktionen; nicht für Leistungskontrolle (siehe 1.3)
announcements       (title, body, audience_department_ids uuid[]?, published_at, author_id)
```

### 4.8 Spätere Erweiterungen (nur vorgesehen, nicht im MVP)

- **Firmenprojekte**: `projects` (company_id, title, period) → `project_groups` → `project_participants` (Name/Kürzel, minimal) → Einsätze vom Typ `company_project`.
- **Geburtstage / Kids-Club**: Einsätze mit eigenem `engagement_type`, Personal über `engagement_staff`, Materialbedarf über Materialboxen.
- **Materialboxen**: `material_boxes` (name, location, contents jsonb) + `material_checkouts` (box_id, engagement_id, profile_id, out_at, back_at).

---

## 5. Screens

### 5.1 Für alle

- **Login / Einladung annehmen / Passwort / 2FA einrichten**
- **Startseite „Heute"**: nächste Termine, offene Aufgaben, fällige Berichte, Ankündigungen. Die Kacheln hängen von den Berechtigungen ab.
- **Benachrichtigungen** (Glocke + Liste) und **Einstellungen** (Push/E-Mail je Art)
- **Mein Profil** (Self-Service: Name, interne Telefonnummer, Verfügbarkeit)
- **Handbuch** (Etappe 3+)

### 5.2 Lehrkraft

- **Mein Stundenplan** (Woche/Liste, mobil optimiert)
- **Stunde – Detail**: Zeit, Ort, Schüler:in (minimal), letzte Berichte zu diesem Schüler, Knopf „Bericht schreiben"
- **Bericht schreiben** (Formular aus Vorlage, Entwurf speichern, absenden)
- **Meine Schüler** (Liste, minimal) → Schüler-Detail mit Berichtsverlauf
- **Meine Termine** (Teamrunden, Hospitationen; zusagen/absagen)

### 5.3 Pädagogische:r Praktikant:in

- Stundenplan der Hospitationen, Hospitationsbericht (optional), Aufgaben, Onboarding-Checkliste

### 5.4 Büro-Praktikant:in

- **Meine Aufgaben**
- **Anrufliste** (Eintrag für Eintrag: Firma, Ansprechpartner, Ergebnis, Notiz, Rückruftermin)
- **Firmen** (Liste mit Status-Filter) → **Firma – Detail** (Kontakte, Verlauf, nächster Schritt)

### 5.5 Admin (Kleana)

- **Cockpit**: überfällige Berichte, anstehende Eltern-Feedbacks, Stunden ohne Lehrkraft, Rollenprüfung fällig
- **Personen** (einladen, Rollen zuweisen, befristen, deaktivieren)
- **Rollen & Abteilungen** (Rollen anlegen, Berechtigungen anhaken; Hinweis bei sensiblen Rechten)
- **Schüler** (inkl. Elternkontakte, nur hier sichtbar), **Zuweisungen** Lehrkraft ↔ Schüler
- **Stundenplanung** (Einsätze anlegen, wiederkehrend, Lehrkraft zuweisen, absagen)
- **Termine** (Teamrunde, Hospitation)
- **Berichte** (alle, filterbar; Vorlagen-Editor)
- **Aufgaben** (verteilen), **Anruflisten** anlegen, **Ankündigungen**
- **Audit-Log**

---

## 6. Benachrichtigungen

| Anlass | Empfänger | Zeitpunkt | Kanal (Vorschlag) |
|---|---|---|---|
| Neue Stunde zugewiesen / geändert / abgesagt | Lehrkraft (+ Hospitierende) | sofort | Push + In-App |
| Bericht fällig | Lehrkraft | direkt nach Stundenende | In-App |
| Bericht überfällig | Lehrkraft; Kleana im Cockpit | X Stunden nach Ende (→ *Rückfrage 3*) | Push |
| Teamrunde | Teilnehmende | bei Anlage + 1 Tag vorher | Push + E-Mail |
| Hospitation | Hospitierende + Lehrkraft der Stunde | bei Anlage + 1 Tag vorher | Push |
| Eltern-Feedback fällig | Kleana | am Fälligkeitstag | In-App + E-Mail |
| Neue Aufgabe | Zugewiesene Person | sofort | In-App (Push optional) |
| Tageszusammenfassung | alle, abschaltbar | morgens | E-Mail |

Technisch: Datenbank-Trigger bzw. Server-Actions erzeugen `notifications`. Ein Zeitplan-Job (Vercel Cron oder Supabase `pg_cron`) verschickt fällige Erinnerungen, Web-Push und die E-Mail-Zusammenfassung. Web-Push funktioniert auf iPhones nur, wenn die Web-App zum Home-Bildschirm hinzugefügt wurde. Das kommt deshalb in die Onboarding-Checkliste.

---

## 7. Datenschutz (DSGVO)

- **Rechtsgrundlagen**: Beschäftigtendaten: Art. 6 Abs. 1 b DSGVO / § 26 BDSG. Schülerdaten: Vertrag mit den Eltern (Art. 6 Abs. 1 b). Pädagogische Notizen streng auf den Förderzweck begrenzt, **keine Gesundheitsdaten** (z. B. Diagnosen) im Freitext. Falls doch nötig: eigenes Feld, nur Admin, gesondert absichern (→ *Rückfrage 9*).
- **Datenminimierung**: siehe Kapitel 2, Grundprinzip 4. Lehrkräfte sehen nie Elternkontakte, Adressen oder Zahlungsdaten.
- **Technisch erzwungen**: RLS je Tabelle, `guardian_contacts` nur Admin, View `my_students` für Lehrkräfte, Service-Role-Key nur serverseitig, 2FA für Admin.
- **Auftragsverarbeitung**: AV-Verträge mit Supabase und Vercel. Supabase-Region **EU (Frankfurt)**. Ins bestehende Verarbeitungsverzeichnis (`docs/Verarbeitungsverzeichnis_LerneMitAnna.docx`) kommt ein neuer Eintrag „Orga-System".
- **Löschkonzept** (Vorschlag): Schülerdaten 12 Monate nach Ende der Förderung anonymisieren, Berichte entsprechend. Konten von Praktikant:innen mit Ablauf des Praktikums automatisch deaktivieren, nach 6 Monaten löschen. Rechtliche Aufbewahrungsfristen für Abrechnungsrelevantes beachten (→ *Rückfrage 10*).
- **Zweckbindung**: Berichte und Fälligkeiten dienen der pädagogischen Qualität und Organisation, nicht der Leistungsbewertung von Lehrkräften. Das steht in der Mitarbeiter-Datenschutzinfo.
- **Rechte der Betroffenen**: Admin-Export „alle Daten zu Person X" (Auskunft) und Löschfunktion.

---

## 8. Rückfragen an Kleana (Schritt 2)

**Organisation & Rollen**
1. Wie viele Personen nutzen das System zum Start ungefähr, aufgeteilt nach Rollen? Wer außer dir soll Admin-Rechte bekommen (z. B. eine Vertretung)?
2. Soll eine Person mehrere Rollen gleichzeitig haben dürfen (z. B. Lehrkraft + Kids-Club)? *Vorschlag: ja.*
3. **Berichtsformat**: Bitte schick das bestehende Format (Vorlage, Beispielbericht ohne echte Namen, Screenshot). Bis wann muss ein Bericht nach der Stunde abgegeben sein (gleicher Tag, 24 h, 48 h)? Bekommen Eltern Berichte (über dich), oder sind sie rein intern?
4. Was dürfen **pädagogische Praktikant:innen**: nur hospitieren oder auch selbst Stunden geben? Sollen sie Hospitationsberichte schreiben, und wer liest die?
5. Was genau sollen **Büro-Praktikant:innen** anrufen: Firmen (für Firmenprojekte), Schulen, Kooperationspartner? Welche Felder brauchst du je Firma?

**Stunden & Termine**
6. Eltern-Feedback: nur einmal nach 3 Monaten oder danach regelmäßig (alle 3 Monate)? Soll im System festgehalten werden, *dass* und *wie* das Feedback lief (kurze Notiz)?
7. Woher kommen die Stunden? Du hast gesagt, es gibt keine Anbindung an das Terminportal. Heißt das, du trägst Stunden im Orga-System **von Hand** ein (Vorlage: wiederkehrend jede Woche)? Oder ist ein späterer, einseitiger Import gewünscht?
8. Teamrunden: fester Rhythmus (z. B. jeden 1. Montag) oder einzeln? Gibt es Protokolle, die ins System sollen?

**Datenschutz**
9. Welche Schülerinfos braucht eine Lehrkraft wirklich? Mein Vorschlag: Vorname, Anfangsbuchstabe Nachname, Klasse, Fach, Förderschwerpunkt, Unterrichtsort (online/vor Ort). Werden Infos wie LRS/Dyskalkulie/ADHS gebraucht? Das wären Gesundheitsdaten und braucht eine gesonderte Absicherung.
10. Wie lange sollen Berichte und Schülerdaten nach Ende der Förderung aufbewahrt werden?
11. Finanzen (später): Sollen sie Stunden/Berichte sehen oder nur Zahlen (Anzahl Stunden pro Lehrkraft/Monat)?

**Technik & Design**
12. Wo soll das System leben: eigene Subdomain (z. B. `team.lernemitanna.de`)? Eigenes GitHub-Repository (*Empfehlung*) oder Unterordner in diesem Repo?
13. Login: Magic Link per E-Mail (kein Passwort merken) oder klassisch mit Passwort? *Vorschlag: Magic Link + 2FA für Admin.*
14. Design: gleiche Farben/Schrift wie die Lerne-mit-Anna-Website (`lernemitanna-theme`)?
15. Welche Kanäle nutzt das Team heute (WhatsApp, E-Mail)? Soll das System WhatsApp-Gruppen *ersetzen* oder ergänzen?

---

## 9. MVP-Plan in Etappen (Schritt 3)

Jede Etappe ist für sich nutzbar und wird vor der nächsten mit Kleana getestet.

### Etappe 1 – Fundament (Login, Personen, Rollen)
- Neues Supabase-Projekt (EU), neues Vercel-Projekt, Next.js-Grundgerüst, Lerne-mit-Anna-Design
- Login (Einladung per Mail), 2FA für Admin
- Personen, Abteilungen, Rollen, Berechtigungskatalog, `has_permission`-Funktion, RLS-Grundlage
- Admin-Screens: Personen einladen/deaktivieren, Rollen bauen
- Startseite „Heute" (noch leer bis auf Ankündigungen)
- **Tests**: automatisierte RLS-Tests („Lehrkraft A kann Schüler von B nicht lesen", „niemand außer Admin liest Elternkontakte")
- *Fertig, wenn:* Kleana kann 3 Testpersonen mit verschiedenen Rollen einladen, und jede sieht nur, was sie soll.

### Etappe 2 – Stundenplan & Stundenberichte
- Schüler (minimal) + Elternkontakte (Admin-only) + Zuweisungen
- Einsätze vom Typ „Stunde", wiederkehrend, Lehrkraft zuweisen, absagen
- Lehrkraft: Mein Stundenplan, Meine Schüler, Stunden-Detail
- Berichtsvorlage nach Kleanas Format + Berichtsformular + Berichtsübersicht für Kleana
- *Fertig, wenn:* Eine Lehrkraft schreibt am Handy einen Bericht zu ihrer Stunde, und Kleana sieht ihn.

### Etappe 3 – Benachrichtigungen, Termine, Eltern-Feedback
- In-App-Benachrichtigungen, Web-Push (PWA), E-Mail-Zusammenfassung, Einstellungen
- Erinnerungen: Bericht fällig/überfällig, neue/geänderte Stunde
- Teamrunden & Hospitationen inkl. Zusage
- Aufgaben-Grundmodul + automatische Eltern-Feedback-Aufgabe nach 3 Monaten
- Admin-Cockpit, Audit-Log, Onboarding-Checklisten
- *Fertig, wenn:* Niemand muss mehr per WhatsApp an fällige Berichte oder Teamrunden erinnert werden.

### Etappe 4 – Büro: Aufgaben, Anruflisten, Firmen-CRM-light
- Aufgaben verteilen, Anruflisten, Firmen + Kontakte + Gesprächsverlauf + nächster Schritt
- *Fertig, wenn:* Ein:e Büro-Praktikant:in arbeitet eine Anrufliste komplett im System ab.

### Danach (Erweiterungen, Reihenfolge nach Bedarf)
- Firmenprojekte (Gruppen, Teilnehmerlisten) → Geburtstags-Einsätze → Kids-Club-Einsätze → Materialboxen
- Handbuch/Wissensseiten, Umfragen, Verfügbarkeiten & Vertretungsplanung, Finanzen-Ansicht, Rollen-Rezertifizierung

### Schritt 4 – Code
Startet erst nach Antworten auf Kapitel 8 und Freigabe dieses Plans durch Kleana.
