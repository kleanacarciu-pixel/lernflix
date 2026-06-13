const F = {
  bg: '#fffdf8',
  bgWarm: '#fff8ee',
  ink: '#0F172A',
  inkSoft: '#475569',
  border: '#E2E8F0',
  white: '#ffffff',
  coral: '#ff5b4a',
  navy: '#0B1F3A',
};
const SANS = '"Inter", -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';

export default function Impressum() {
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
        <h1 style={{ fontSize: '40px', fontWeight: 800, color: F.ink, margin: '0 0 32px', letterSpacing: '-0.03em', lineHeight: 1.05 }}>Impressum</h1>

        <Section titel="Angaben gemäß § 5 TMG">
          Kleana Carciu<br />
          Kohlbrennerstraße 16<br />
          81929 München<br />
          Deutschland
        </Section>

        <Section titel="Kontakt">
          Telefon: +49 (0) 176 24700519<br />
          E-Mail: lernemitanna@outlook.com
        </Section>

        <Section titel="Verantwortlich für den Inhalt">
          Kleana Carciu<br />
          Kohlbrennerstraße 16<br />
          81929 München
        </Section>

        <Section titel="Streitschlichtung">
          Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:
          https://ec.europa.eu/consumers/odr. Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren
          vor einer Verbraucherschlichtungsstelle teilzunehmen.
        </Section>

        <Section titel="Haftung für Inhalte">
          Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den
          allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht
          verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen.
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
