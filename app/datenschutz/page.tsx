const F = {
  bg: '#fffdf8',
  bgWarm: '#fff8ee',
  ink: '#0F172A',
  inkSoft: '#475569',
  border: '#E2E8F0',
  white: '#ffffff',
  coral: '#1769FF',
  blue: '#1769FF',
};
const SANS = '"Inter", -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';

export default function Datenschutz() {
  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #FFF9F0 0%, #FEF3E0 100%)', fontFamily: SANS, color: F.ink, padding: '24px 22px 60px', position: 'relative', overflow: 'hidden' }}>
      {/* Dot-grid pattern + glow blobs (matched mit homepage) */}
      <div style={{ position: 'fixed', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(23,105,255,0.10) 1px, transparent 1px)', backgroundSize: '32px 32px', opacity: 0.35, pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', top: '-100px', left: '-100px', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,180,90,0.22) 0%, transparent 65%)', pointerEvents: 'none', filter: 'blur(40px)', zIndex: 0 }} />
      <div style={{ position: 'fixed', top: '30%', right: '-150px', width: '550px', height: '550px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(23,105,255,0.16) 0%, transparent 70%)', pointerEvents: 'none', filter: 'blur(30px)', zIndex: 0 }} />

      <header style={{ maxWidth: '780px', margin: '0 auto 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', position: 'relative', zIndex: 1 }}>
        <a href="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontSize: '24px', fontWeight: 800, color: F.ink, letterSpacing: '-0.025em' }}>
            Lern<span style={{ color: F.coral }}>flix</span>
          </span>
        </a>
        <a href="/" style={{ color: F.inkSoft, textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>← Zurück</a>
      </header>

      <article style={{ maxWidth: '780px', margin: '0 auto', background: F.white, borderRadius: '24px', padding: '48px 44px', border: `1px solid ${F.border}`, boxShadow: '0 4px 20px rgba(15,23,42,0.04)', position: 'relative', zIndex: 1 }}>
        <h1 style={{ fontSize: '40px', fontWeight: 800, color: F.ink, margin: '0 0 12px', letterSpacing: '-0.03em', lineHeight: 1.05 }}>Datenschutzerklärung</h1>
        <p style={{ color: F.inkSoft, lineHeight: 1.75, margin: '0 0 32px', fontSize: '15px' }}>
          Der Schutz deiner Daten – und besonders der Daten unserer Schülerinnen und Schüler – ist uns wichtig.
          Hier erklären wir verständlich und vollständig, was auf dieser Seite (Shop, Terminkalender und
          Klassenzimmer von „Lerne mit Anna“) mit personenbezogenen Daten passiert.
        </p>

        <Section titel="1. Verantwortliche">
          Kleana Carciu (Lerne mit Anna), Kohlbrennerstraße 16, 81929 München, Deutschland.
          E-Mail: lernemitanna@outlook.com, Telefon: +49 176 24700519. Bei allen Fragen zum Datenschutz
          kannst du dich jederzeit direkt an diese Adresse wenden.
        </Section>

        <Section titel="2. Hosting (Vercel)">
          Diese Seite wird bei der Vercel Inc. (340 S Lemon Ave #4133, Walnut, CA 91789, USA) gehostet.
          Beim Aufruf werden technisch notwendige Zugriffsdaten verarbeitet (z. B. IP-Adresse, Datum und Uhrzeit,
          aufgerufene Seite, Browsertyp), um die Seite sicher ausliefern zu können. Rechtsgrundlage ist
          Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an einem sicheren, funktionsfähigen Angebot).
          Mit Vercel besteht ein Auftragsverarbeitungsvertrag; eine Übermittlung in die USA erfolgt auf
          Grundlage der EU-Standardvertragsklauseln. Mehr dazu: https://vercel.com/legal/privacy-policy
        </Section>

        <Section titel="3. Schriftarten (lokal, ohne Google)">
          Alle Schriftarten dieser Seite sind lokal auf unserem Server eingebunden (Self-Hosting).
          Beim Laden wird keine Verbindung zu Google oder anderen Schriften-Anbietern aufgebaut und
          es werden keine Daten (insbesondere keine IP-Adresse) an diese übertragen.
        </Section>

        <Section titel="4. Shop und Bezahlung (Stripe)">
          Wenn du in unserem Shop Lernmaterialien kaufst, erfassen wir nur die dafür notwendigen Daten:
          Name, E-Mail-Adresse und Zahlungsdaten. Die Zahlung wird ausschließlich über den
          Zahlungsdienstleister Stripe (Stripe Payments Europe Ltd., Irland) abgewickelt – wir selbst
          speichern keine Kreditkartendaten. Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung).
        </Section>

        <Section titel="5. Terminkalender">
          Für die Organisation des Nachhilfe-Unterrichts betreiben wir einen Terminkalender. Dabei werden
          verarbeitet: bei einem Schüler-Konto Name, E-Mail-Adresse und Passwort (verschlüsselt gespeichert)
          sowie gebuchte, angefragte und abgesagte Termine und der Stunden-Kontostand (Plus-, Minus- und
          Nachholstunden); bei einer Probestunden-Anfrage ohne Konto Name, E-Mail-Adresse und Wunschtermin.
          Die Konten werden von uns nach Absprache mit den Eltern angelegt. Gespeichert werden die Daten bei
          unserem Auftragsverarbeiter Supabase (Supabase Inc., USA) in einem Rechenzentrum in der EU (Irland);
          mit Supabase besteht ein Auftragsverarbeitungsvertrag. Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO
          (Durchführung des Unterrichtsvertrags).
        </Section>

        <Section titel="6. Klassenzimmer (Chat, Dateien, Berichte)">
          Jede Schülerin und jeder Schüler hat ein eigenes digitales Klassenzimmer. Dort werden verarbeitet:
          Chat-Nachrichten zwischen Lehrerin und Schüler (einschließlich dort hochgeladener Fotos und Dateien,
          z. B. fotografierte Hausaufgaben), von der Lehrerin bereitgestellte Arbeitsblätter, Lernmaterialien
          und Dateien sowie Stundenberichte und Wiederholungs-Quizze zu den Nachhilfestunden. Diese Inhalte
          sind nur für den jeweiligen Schüler bzw. seine Eltern und die Lehrerin sichtbar; Inhalte im
          Bereich „Lernmaterial“ sind für alle Schüler mit Konto sichtbar. Gespeichert wird – wie beim
          Terminkalender – bei unserem Auftragsverarbeiter Supabase. Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO.
          Wird ein Schüler-Konto gelöscht, werden auch Chat-Verlauf, Dateien und Berichte gelöscht.
        </Section>

        <Section titel="7. KI-unterstützte Stundenberichte (Anthropic)">
          Für die Stundenberichte nutzt die Lehrerin eine KI-Unterstützung: Sie gibt kurze Stichpunkte zur
          Stunde ein (z. B. behandeltes Thema und Lernstand), und daraus wird automatisch ein ausformulierter
          Bericht mit Erklärung, Beispielen und Übungsaufgaben erstellt. Dazu werden die eingegebenen
          Stichpunkte an die Anthropic PBC (San Francisco, USA) übermittelt und dort verarbeitet.
          Wir geben dabei so wenig personenbezogene Daten wie möglich ein und keine besonders sensiblen
          Informationen (z. B. keine Gesundheitsdaten). Anthropic verwendet über die hier genutzte
          API-Schnittstelle übermittelte Inhalte nicht zum Training seiner KI-Modelle. Die Übermittlung in
          die USA erfolgt auf Grundlage der EU-Standardvertragsklauseln. Rechtsgrundlage: Art. 6 Abs. 1
          lit. b und f DSGVO (effiziente Unterrichtsnachbereitung). Mehr dazu: https://www.anthropic.com/legal/privacy
        </Section>

        <Section titel="8. Video-Unterricht (Microsoft Teams)">
          Online-Stunden finden über Microsoft Teams statt (Microsoft Ireland Operations Ltd., Irland).
          Über den Teams-Knopf im Kalender bzw. Klassenzimmer wird die Besprechung der Lehrerin geöffnet;
          eine Teilnahme ist als Gast ohne eigenes Microsoft-Konto möglich. Bei der Nutzung verarbeitet
          Microsoft u. a. Name (frei wählbar), IP-Adresse sowie Audio- und Videodaten während der Stunde.
          Für diese Verarbeitung gelten die Datenschutzhinweise von Microsoft:
          https://privacy.microsoft.com/de-de/privacystatement. Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO.
        </Section>

        <Section titel="9. E-Mail-Versand (Resend)">
          Bestätigungs- und Benachrichtigungs-E-Mails (z. B. „Termin bestätigt“, „Termin abgesagt“,
          Zugangsdaten) versenden wir über den Dienst Resend (Resend, Inc., USA). Dabei werden
          E-Mail-Adresse und Inhalt der Nachricht verarbeitet; die Übermittlung erfolgt auf Grundlage der
          EU-Standardvertragsklauseln. Rechtsgrundlage: Art. 6 Abs. 1 lit. b und f DSGVO.
        </Section>

        <Section titel="10. Cookies und Local Storage">
          Diese Seite setzt keine Tracking- oder Werbe-Cookies. Nach dem Login werden technisch notwendige
          Informationen (Anmelde-Sitzung) lokal in deinem Browser gespeichert (Local Storage), damit du
          angemeldet bleibst. Diese Informationen verlassen deinen Browser nicht und werden nicht an
          Dritte weitergegeben.
        </Section>

        <Section titel="11. Kinder und Einwilligung der Eltern">
          Unsere Nachhilfe richtet sich an Kinder und Jugendliche. Schüler-Konten werden ausschließlich
          von uns und nur nach Absprache mit einem Erziehungsberechtigten angelegt; die Zugangsdaten gehen
          an die von den Eltern angegebene E-Mail-Adresse. Eltern können jederzeit Auskunft über die
          gespeicherten Daten ihres Kindes verlangen oder die Löschung des Kontos beauftragen – dabei werden
          alle zugehörigen Daten (Termine, Chat, Dateien, Berichte) gelöscht.
        </Section>

        <Section titel="12. Deine Rechte">
          Du hast das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16), Löschung (Art. 17),
          Einschränkung der Verarbeitung (Art. 18), Datenübertragbarkeit (Art. 20) und Widerspruch (Art. 21)
          sowie das Recht auf Beschwerde bei einer Datenschutz-Aufsichtsbehörde (für Bayern: Bayerisches
          Landesamt für Datenschutzaufsicht). Wende dich dazu einfach an lernemitanna@outlook.com.
        </Section>

        <Section titel="13. Verschlüsselung">
          Alle Verbindungen zu dieser Seite sind mit SSL/TLS verschlüsselt (erkennbar am „https“ und dem
          Schloss-Symbol im Browser).
        </Section>

        <p style={{ color: F.inkSoft, fontSize: '13px', margin: '8px 0 0' }}>Stand: August 2026</p>
      </article>
    </main>
  );
}

function Section({ titel, children }: { titel: string; children: React.ReactNode }) {
  return (
    <>
      <h2 style={{ fontSize: '18px', fontWeight: 700, color: F.ink, margin: '0 0 10px', letterSpacing: '-0.01em' }}>{titel}</h2>
      <p style={{ color: F.inkSoft, lineHeight: 1.75, margin: '0 0 28px', fontSize: '15px' }}>{children}</p>
    </>
  );
}
