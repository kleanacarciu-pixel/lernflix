// Gemeinsames Layout für die Rechtstext-Seiten (AGB, Widerrufsbelehrung).
//
// Bekommt den Wortlaut als Markdown aus lib/agb-text.ts und stellt ihn dar –
// dieselbe Quelle, aus der auch die PDF entsteht.
import { bausteine, type Lauf } from '@/lib/agb-kern';

const F = {
  ink: '#0F172A', soft: '#475569', border: '#E2E8F0', bg: '#fffdf8', weiss: '#fff',
  teal: '#2E7D74', gold: '#C9A96A',
};

function Text({ laeufe }: { laeufe: Lauf[] }) {
  return (
    <>
      {laeufe.map((l, i) => (
        l.fett ? <strong key={i} style={{ color: F.ink }}>{l.text}</strong>
          : l.kursiv ? <em key={i}>{l.text}</em>
          : <span key={i}>{l.text}</span>
      ))}
    </>
  );
}

export function Rechtstext({ titel, unterzeile, markdown }: {
  titel: string; unterzeile: string; markdown: string;
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

          {bausteine(markdown).map((b, i) => {
            switch (b.art) {
              case 'linie':
                return <hr key={i} style={{ border: 0, borderTop: `2px solid ${F.gold}`, margin: '30px 0' }} />;
              case 'ueberschrift':
                return (
                  <h2 key={i} style={{ fontSize: 24, fontWeight: 800, margin: '28px 0 12px' }}>{b.text}</h2>
                );
              case 'paragraf':
                return (
                  <h2 key={i} style={{
                    fontSize: 18, fontWeight: 700, margin: '30px 0 10px', color: F.teal,
                    fontFamily: '"Playfair Display", Georgia, serif',
                  }}>{b.text}</h2>
                );
              case 'unterueberschrift':
                return <h3 key={i} style={{ fontSize: 16, fontWeight: 700, margin: '22px 0 8px' }}>{b.text}</h3>;
              case 'zitat':
                return (
                  <blockquote key={i} style={{
                    margin: '14px 0', padding: '12px 16px', borderLeft: `3px solid ${F.gold}`,
                    background: 'rgba(201,169,106,.09)', color: F.ink, fontSize: 15, lineHeight: 1.7,
                  }}><Text laeufe={b.laeufe} /></blockquote>
                );
              default:
                return (
                  <p key={i} style={{
                    color: F.soft, lineHeight: 1.75, margin: '0 0 12px', fontSize: 15,
                    whiteSpace: 'pre-line',
                  }}><Text laeufe={b.laeufe} /></p>
                );
            }
          })}
        </article>
      </div>
    </main>
  );
}
