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

export default function AGB() {
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
        <h1 style={{ fontSize: '40px', fontWeight: 800, color: F.ink, margin: '0 0 32px', letterSpacing: '-0.03em', lineHeight: 1.05 }}>Allgemeine Geschäftsbedingungen</h1>

        <Section titel="1. Geltungsbereich">
          Diese AGB gelten für alle Käufe auf Lernflix, betrieben von Kleana Carciu, Kohlbrennerstraße 16, 81929 München.
        </Section>

        <Section titel="2. Vertragsschluss">
          Mit dem Klick auf Kaufen und Abschluss der Zahlung kommt ein verbindlicher Kaufvertrag zustande.
          Sie erhalten eine Bestätigungs-E-Mail mit dem Download-Link.
        </Section>

        <Section titel="3. Preise und Zahlung">
          Alle Preise sind in Euro angegeben. Gemäß § 19 UStG wird keine Umsatzsteuer berechnet.
          Die Zahlung erfolgt über den sicheren Zahlungsdienstleister Stripe.
        </Section>

        <Section titel="4. Widerrufsrecht">
          Bei digitalen Inhalten erlischt das Widerrufsrecht sobald der Download begonnen hat
          und Sie ausdrücklich zugestimmt haben dass der Download sofort beginnt.
        </Section>

        <Section titel="5. Urheberrecht">
          Alle Lernmaterialien sind urheberrechtlich geschützt. Der Kauf berechtigt ausschließlich zur
          privaten Nutzung. Eine Weitergabe oder kommerzielle Nutzung ist nicht erlaubt.
        </Section>

        <Section titel="6. Haftung">
          Die Lernmaterialien wurden sorgfältig erstellt. Eine Garantie für den Lernerfolg
          kann jedoch nicht übernommen werden.
        </Section>

        <Section titel="7. Kontakt">
          Bei Fragen: lernemitanna@outlook.com
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
