const F = {
  bg: '#fffdf8',
  bgWarm: '#fff8ee',
  ink: '#0F172A',
  inkSoft: '#475569',
  border: '#E2E8F0',
  white: '#ffffff',
  coral: '#ff5b4a',
};
const SANS = '"Inter", -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';

export default function Datenschutz() {
  return (
    <main style={{ minHeight: '100vh', background: F.bgWarm, fontFamily: SANS, color: F.ink, padding: '24px 22px 60px' }}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" />

      <header style={{ maxWidth: '780px', margin: '0 auto 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0' }}>
        <a href="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontSize: '24px', fontWeight: 800, color: F.ink, letterSpacing: '-0.025em' }}>
            Lern<span style={{ color: F.coral }}>flix</span>
          </span>
        </a>
        <a href="/" style={{ color: F.inkSoft, textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>← Zurück</a>
      </header>

      <article style={{ maxWidth: '780px', margin: '0 auto', background: F.white, borderRadius: '24px', padding: '48px 44px', border: `1px solid ${F.border}`, boxShadow: '0 4px 20px rgba(15,23,42,0.04)' }}>
        <h1 style={{ fontSize: '40px', fontWeight: 800, color: F.ink, margin: '0 0 32px', letterSpacing: '-0.03em', lineHeight: 1.05 }}>Datenschutzerklärung</h1>

        <Section titel="1. Datenschutz auf einen Blick">
          Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten
          passiert, wenn Sie diese Website besuchen. Verantwortlicher für die Datenverarbeitung ist Kleana Carciu,
          Kohlbrennerstraße 16, 81929 München.
        </Section>

        <Section titel="2. Welche Daten erfassen wir?">
          Wir erfassen nur die Daten die für den Kauf notwendig sind: Name, E-Mail-Adresse und Zahlungsdaten.
          Zahlungsdaten werden ausschließlich über den sicheren Zahlungsdienstleister Stripe verarbeitet.
          Wir speichern keine Kreditkartendaten.
        </Section>

        <Section titel="3. Wofür nutzen wir Ihre Daten?">
          Ihre Daten werden ausschließlich zur Abwicklung Ihrer Bestellung und zur Bereitstellung der
          gekauften Lernmaterialien verwendet. Wir geben Ihre Daten nicht an Dritte weiter.
        </Section>

        <Section titel="4. Ihre Rechte">
          Sie haben jederzeit das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung der
          Verarbeitung Ihrer gespeicherten Daten. Kontaktieren Sie uns unter: lernemitanna@outlook.com
        </Section>

        <Section titel="5. Cookies">
          Diese Website verwendet nur technisch notwendige Cookies. Es werden keine Tracking- oder
          Werbe-Cookies eingesetzt.
        </Section>

        <Section titel="6. Hosting">
          Diese Website wird bei Vercel Inc., 340 Pine Street, San Francisco, CA 94104, USA gehostet.
          Weitere Informationen finden Sie in der Datenschutzerklärung von Vercel:
          https://vercel.com/legal/privacy-policy
        </Section>
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
