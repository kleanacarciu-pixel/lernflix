// Gemeinsames Layout für die Rechtstext-Seiten (AGB, Widerrufsbelehrung).
import type { Abschnitt } from '@/lib/vertrag-texte';

const F = { ink: '#0F172A', soft: '#475569', border: '#E2E8F0', bg: '#fffdf8', weiss: '#fff', teal: '#2BB3C0' };

export function Rechtstext({ titel, unterzeile, abschnitte }: {
  titel: string; unterzeile: string; abschnitte: readonly Abschnitt[];
}) {
  return (
    <main style={{
      minHeight: '100vh', background: F.bg, color: F.ink, padding: '32px 20px 60px',
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
    }}>
      <div style={{ maxWidth: 780, margin: '0 auto' }}>
        <a href="/kalender" style={{ color: F.soft, textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>
          ← Zurück
        </a>
        <article style={{
          background: F.weiss, border: `1px solid ${F.border}`, borderRadius: 20,
          padding: '40px 38px', marginTop: 16,
        }}>
          <div style={{ color: F.teal, fontWeight: 700, fontSize: 13, letterSpacing: '.04em' }}>
            LERNE MIT ANNA
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 800, margin: '6px 0 4px', letterSpacing: '-0.02em' }}>{titel}</h1>
          <p style={{ color: F.soft, margin: '0 0 28px' }}>{unterzeile}</p>

          {abschnitte.map((a) => (
            <section key={a.titel} style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 17, fontWeight: 700, margin: '0 0 8px' }}>{a.titel}</h2>
              <p style={{ color: F.soft, lineHeight: 1.75, margin: 0, fontSize: 15 }}>{a.text}</p>
            </section>
          ))}
        </article>
      </div>
    </main>
  );
}
