'use client';
import { useEffect, useState } from 'react';

const F = {
  bg: '#ffffff',
  bgSoft: '#fafaf9',
  ink: '#0a0a0c',
  inkSoft: '#52525b',
  inkMuted: '#94a3b8',
  border: '#e2e8f0',
  blue: '#1769FF',
  blueDeep: '#1156DD',
  blueLight: '#E8F0FF',
  navy: '#0B1F3A',
  green: '#10B981',
  white: '#ffffff',
};
const SANS = '"Inter", -apple-system, BlinkMacSystemFont, sans-serif';

const THEMEN: Record<number, { mathe: string[]; physik: string[] }> = {
  1: { mathe: ['Zahlen bis 20', 'Plus & Minus', 'Formen'], physik: [] },
  2: { mathe: ['Bis 100', 'Mal & Geteilt', 'Geld'], physik: [] },
  3: { mathe: ['Bis 1000', 'Schriftlich rechnen', 'Längen'], physik: [] },
  4: { mathe: ['Bis 1.000.000', 'Brüche-Start', 'Geometrie'], physik: [] },
  5: { mathe: ['Brüche', 'Dezimalzahlen', 'Flächen'], physik: ['Licht & Schatten', 'Schall'] },
  6: { mathe: ['Brüche-Rechnen', 'Prozent', 'Winkel'], physik: ['Magnete', 'Stromkreise'] },
  7: { mathe: ['Terme', 'Gleichungen', 'Geometrie'], physik: ['Bewegung', 'Kraft'] },
  8: { mathe: ['Lineare Funktionen', 'Pythagoras', 'Wahrscheinlichkeit'], physik: ['Mechanik', 'Optik'] },
  9: { mathe: ['Quadratische Gleichungen', 'Trigonometrie', 'Funktionen'], physik: ['Elektrizität', 'Energie'] },
  10: { mathe: ['Funktionen vertieft', 'Stochastik', 'Körper'], physik: ['Atomphysik', 'Wellen'] },
  11: { mathe: ['Analysis-Start', 'Ableitungen', 'Vektoren'], physik: ['Mechanik vertieft'] },
  12: { mathe: ['Integralrechnung', 'Stochastik', 'Geometrie'], physik: ['E-Lehre', 'Quanten'] },
  13: { mathe: ['Abi-Vorbereitung', 'Alle Themen', 'Übungs-Klausuren'], physik: ['Abi-Vorbereitung'] },
};

export default function VorschlagKlassen() {
  const [breite, setBreite] = useState(1200);
  const [aktive, setAktive] = useState<number | null>(7);

  useEffect(() => {
    const onResize = () => setBreite(window.innerWidth);
    window.addEventListener('resize', onResize);
    onResize();
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const mobil = breite < 768;
  const klassen = Array.from({ length: 13 }, (_, i) => i + 1);
  const t = aktive !== null ? THEMEN[aktive] : null;

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #FFF9F0 0%, #FEF3E0 100%)', fontFamily: SANS, color: F.ink, overflowX: 'hidden', position: 'relative' }}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@500&display=swap" />

      {/* Dot-grid pattern + glow blobs */}
      <div style={{ position: 'fixed', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(23,105,255,0.10) 1px, transparent 1px)', backgroundSize: '32px 32px', opacity: 0.35, pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', top: '-100px', left: '-100px', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,180,90,0.22) 0%, transparent 65%)', pointerEvents: 'none', filter: 'blur(40px)', zIndex: 0 }} />
      <div style={{ position: 'fixed', top: '20%', right: '-150px', width: '550px', height: '550px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(23,105,255,0.16) 0%, transparent 70%)', pointerEvents: 'none', filter: 'blur(30px)', zIndex: 0 }} />

      <style>{`
        * { -webkit-font-smoothing: antialiased; }
        body { background: #FFF9F0; margin: 0; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.7s cubic-bezier(0.2,0.8,0.2,1) both; }
        .klasse-btn {
          transition: all 0.2s cubic-bezier(0.2,0.8,0.2,1);
          cursor: pointer;
        }
        .klasse-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 28px rgba(23,105,255,0.20);
        }
        .btn-primary {
          background: ${F.blue}; color: ${F.white};
          padding: 14px 28px; border-radius: 12px;
          font-size: 15px; font-weight: 600;
          text-decoration: none; border: none; cursor: pointer;
          display: inline-flex; align-items: center; gap: 8px;
          box-shadow: 0 8px 24px rgba(23,105,255,0.24);
          transition: all 0.2s ease;
        }
        .btn-primary:hover { background: ${F.blueDeep}; transform: translateY(-1px); }
        .btn-ghost {
          background: transparent; color: ${F.ink};
          padding: 14px 28px; border-radius: 12px;
          font-size: 15px; font-weight: 600;
          text-decoration: none; border: 1.5px solid ${F.border};
        }
      `}</style>

      {/* HEADER */}
      <header style={{ padding: mobil ? '18px 22px' : '22px 56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${F.border}` }}>
        <a href="/" style={{ textDecoration: 'none', fontSize: '24px', fontWeight: 800, color: F.ink, letterSpacing: '-0.025em' }}>
          Lern<span style={{ color: F.blue }}>flix</span>
        </a>
        <span style={{ background: F.bgSoft, border: `1px solid ${F.border}`, padding: '6px 14px', borderRadius: '999px', fontSize: '12px', fontWeight: 600, color: F.inkSoft, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          Vorschlag 1 · Klassen-Wand
        </span>
        <a href="/vorschlag/skizze" style={{ color: F.blue, textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>
          Vorschlag 3 →
        </a>
      </header>

      {/* HERO */}
      <section className="fade-up" style={{ padding: mobil ? '50px 22px' : '90px 56px' }}>
        <div style={{ maxWidth: '1320px', margin: '0 auto', display: 'grid', gridTemplateColumns: mobil ? '1fr' : '1fr 1.1fr', gap: mobil ? '40px' : '70px', alignItems: 'center' }}>
          {/* Left: text */}
          <div>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: F.bgSoft, border: `1px solid ${F.border}`, color: F.inkSoft, padding: '7px 14px', borderRadius: '999px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.06em', marginBottom: '28px', fontFamily: '"JetBrains Mono", monospace' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: F.green }} />
              DIE LERN-PLATTFORM · MATHE + PHYSIK
            </span>
            <h1 style={{ fontFamily: SANS, fontSize: mobil ? '44px' : '72px', fontWeight: 800, lineHeight: 1.0, margin: '0 0 22px', color: F.ink, letterSpacing: '-0.035em' }}>
              Mathe &amp; Physik,<br />
              von <span style={{ color: F.blue }}>Klasse 1</span> bis <span style={{ color: F.blue }}>13</span>.
            </h1>
            <p style={{ fontSize: mobil ? '17px' : '19px', color: F.inkSoft, lineHeight: 1.55, margin: '0 0 32px', maxWidth: '480px', fontWeight: 400 }}>
              Such dir deine Klasse — und du siehst sofort, was es für dich gibt.
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }}>
              <a href="/shop" className="btn-primary">
                Kostenlos starten <span style={{ fontSize: '16px' }}>→</span>
              </a>
              <a href="/lernheld" className="btn-ghost">
                Wie funktioniert&apos;s?
              </a>
            </div>
            <p style={{ fontSize: '13px', color: F.inkMuted, fontWeight: 500 }}>
              13 Lernpakete · 61 Quiz-Themen · Sofort verfügbar · Ab 0,99 €
            </p>
          </div>

          {/* Right: 13 Klassen-Buttons */}
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: mobil ? 'repeat(4, 1fr)' : 'repeat(5, 1fr)', gap: mobil ? '8px' : '12px' }}>
              {klassen.map((n) => (
                <button
                  key={n}
                  className="klasse-btn"
                  onMouseEnter={() => setAktive(n)}
                  onClick={() => setAktive(n)}
                  style={{
                    aspectRatio: '1 / 1',
                    background: aktive === n ? F.navy : F.bg,
                    color: aktive === n ? F.white : F.ink,
                    border: `1.5px solid ${aktive === n ? F.navy : F.border}`,
                    borderRadius: mobil ? '14px' : '18px',
                    fontFamily: SANS,
                    fontSize: mobil ? '28px' : '36px',
                    fontWeight: 800,
                    letterSpacing: '-0.03em',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '2px',
                    padding: '0',
                  }}
                >
                  <span style={{ fontSize: mobil ? '9px' : '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', opacity: aktive === n ? 0.75 : 0.55, fontFamily: '"JetBrains Mono", monospace' }}>
                    Klasse
                  </span>
                  {n}
                </button>
              ))}
              {/* Filler tiles for grid alignment desktop (5-col = 15, 13 numbers + 2 fillers) */}
              {!mobil && Array.from({ length: 2 }).map((_, i) => (
                <div key={`f-${i}`} style={{ aspectRatio: '1/1', borderRadius: '18px', border: `1.5px dashed ${F.border}`, background: F.bgSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: F.inkMuted, fontWeight: 600 }}>
                  Abi
                </div>
              ))}
              {mobil && Array.from({ length: 3 }).map((_, i) => (
                <div key={`fm-${i}`} style={{ aspectRatio: '1/1', borderRadius: '14px', border: `1.5px dashed ${F.border}`, background: F.bgSoft }} />
              ))}
            </div>

            {/* Preview unter den Buttons */}
            {t && (
              <div style={{ marginTop: '24px', padding: mobil ? '20px' : '24px 28px', background: F.bgSoft, border: `1px solid ${F.border}`, borderRadius: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{ fontSize: '11px', color: F.blue, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', fontFamily: '"JetBrains Mono", monospace' }}>
                    Klasse {aktive} — Themen
                  </span>
                  <a href="/shop" style={{ fontSize: '13px', fontWeight: 700, color: F.ink, textDecoration: 'none' }}>
                    Pakete ansehen →
                  </a>
                </div>
                <div style={{ display: 'flex', gap: mobil ? '20px' : '32px', flexWrap: 'wrap' }}>
                  {t.mathe.length > 0 && (
                    <div>
                      <p style={{ fontSize: '11px', color: F.inkMuted, fontWeight: 700, margin: '0 0 8px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Mathematik</p>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {t.mathe.map((th, i) => (
                          <span key={i} style={{ background: F.white, border: `1px solid ${F.border}`, padding: '6px 12px', borderRadius: '999px', fontSize: '12.5px', fontWeight: 600, color: F.ink }}>
                            {th}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {t.physik.length > 0 && (
                    <div>
                      <p style={{ fontSize: '11px', color: F.inkMuted, fontWeight: 700, margin: '0 0 8px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Physik</p>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {t.physik.map((th, i) => (
                          <span key={i} style={{ background: F.white, border: `1px solid ${F.border}`, padding: '6px 12px', borderRadius: '999px', fontSize: '12.5px', fontWeight: 600, color: F.ink }}>
                            {th}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
