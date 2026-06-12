'use client';
import { useEffect, useState } from 'react';

const F = {
  bg: '#fffdf8',
  bgSoft: '#fef6e8',
  bgWarm: '#fff8ee',
  bgCream: '#fef3dd',
  bgMint: '#e7f5ec',
  bgPeach: '#fde4d4',
  bgSky: '#dceffb',
  ink: '#0F172A',
  inkSoft: '#475569',
  inkMuted: '#94A3B8',
  border: '#E2E8F0',
  borderSoft: '#EEF2F6',
  blue: '#1769FF',
  blueDeep: '#1156DD',
  blueLight: '#E8F0FF',
  navy: '#0B1F3A',
  navyDark: '#08182C',
  navySoft: '#152B4D',
  green: '#10B981',
  coral: '#ff5b4a',
  yellow: '#FFCB45',
  lavender: '#a78bfa',
  white: '#ffffff',
};
const SANS = '"Inter", -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';

const FOTO = {
  hero: 'https://unsplash.com/photos/pfkknbsGuIc/download?w=1400&fm=jpg&q=85',
  shop: 'https://unsplash.com/photos/ETRPjvb0KM0/download?w=1000&fm=jpg&q=85',
  lernplan: 'https://unsplash.com/photos/iMfG5py52LA/download?w=1000&fm=jpg&q=85',
  lernheld: 'https://unsplash.com/photos/zNFT3o8HWks/download?w=1400&fm=jpg&q=85',
  quiz: 'https://unsplash.com/photos/9Ul7x0bk3qE/download?w=1000&fm=jpg&q=85',
};

// Karten fuer den schwebenden card-stack im hero (bunte lernpaket-cover)
const KARTEN = [
  { t: 'Brüche', sym: '¾', bg: '#dceffb', akzent: '#1769FF', fach: 'Mathe', klasse: 'Klasse 5—7', preis: 'ab 0,99 €' },
  { t: 'Pythagoras', sym: 'c²', bg: '#fde4d4', akzent: '#cf4a40', fach: 'Mathe', klasse: 'Klasse 8—10', preis: 'ab 1,99 €' },
  { t: 'Funktionen', sym: 'ƒ(x)', bg: '#e7f5ec', akzent: '#2e8a5c', fach: 'Mathe', klasse: 'Klasse 9—11', preis: 'ab 1,99 €' },
  { t: 'Mechanik', sym: 'F=ma', bg: '#fef3dd', akzent: '#d99a36', fach: 'Physik', klasse: 'Klasse 7—10', preis: 'ab 0,99 €' },
  { t: 'Optik', sym: '◐', bg: '#e7defb', akzent: '#7656b0', fach: 'Physik', klasse: 'Klasse 8—10', preis: 'ab 0,99 €' },
];

export default function Home() {
  const [breite, setBreite] = useState(1200);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onResize = () => setBreite(window.innerWidth);
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onScroll);
    onResize();
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const mobil = breite < 768;

  return (
    <main style={{ minHeight: '100vh', background: F.bg, fontFamily: SANS, color: F.ink, overflowX: 'hidden' }}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@500&display=swap" />

      <style>{`
        * { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
        body { background: ${F.bg}; margin: 0; font-family: ${SANS}; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulseDot { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.6; transform: scale(1.15); } }
        @keyframes floatA { 0%, 100% { transform: translateY(0px) rotate(-4deg); } 50% { transform: translateY(-12px) rotate(2deg); } }
        @keyframes floatB { 0%, 100% { transform: translateY(0px) rotate(3deg); } 50% { transform: translateY(-10px) rotate(-3deg); } }
        @keyframes karteIn { from { opacity: 0; transform: rotate(0deg) translateY(80px); } }

        .lernkarte { animation: karteIn 1s cubic-bezier(0.2,0.8,0.2,1) both; transition: transform 0.4s cubic-bezier(0.2,0.8,0.2,1); }
        .lernkarte:hover { z-index: 10; transform: translateY(-16px) rotate(0deg) scale(1.04) !important; }
        .fade-up { animation: fadeUp 0.9s cubic-bezier(0.2, 0.8, 0.2, 1) both; }
        .fade-up-2 { animation: fadeUp 0.9s 0.15s cubic-bezier(0.2, 0.8, 0.2, 1) both; }
        .pulse-dot { animation: pulseDot 2s ease-in-out infinite; }

        .btn-primary {
          background: ${F.blue}; color: ${F.white};
          padding: 14px 28px; border-radius: 14px;
          font-size: 15px; font-weight: 700; letter-spacing: -0.005em;
          display: inline-flex; align-items: center; gap: 8px;
          text-decoration: none; border: none; cursor: pointer;
          transition: background 0.2s ease, box-shadow 0.2s ease, transform 0.15s ease;
          box-shadow: 0 1px 2px rgba(23,105,255,0.08), 0 8px 24px rgba(23,105,255,0.20);
          font-family: ${SANS};
        }
        .btn-primary:hover { background: ${F.blueDeep}; box-shadow: 0 1px 2px rgba(23,105,255,0.10), 0 14px 32px rgba(23,105,255,0.28); transform: translateY(-1px); }

        .btn-coral {
          background: ${F.coral}; color: ${F.white};
          padding: 14px 28px; border-radius: 14px;
          font-size: 15px; font-weight: 700; letter-spacing: -0.005em;
          display: inline-flex; align-items: center; gap: 8px;
          text-decoration: none; border: none; cursor: pointer;
          transition: background 0.2s ease, box-shadow 0.2s ease, transform 0.15s ease;
          box-shadow: 0 1px 2px rgba(255,91,74,0.10), 0 10px 28px rgba(255,91,74,0.30);
          font-family: ${SANS};
        }
        .btn-coral:hover { background: #e44b3c; box-shadow: 0 1px 2px rgba(255,91,74,0.12), 0 16px 38px rgba(255,91,74,0.38); transform: translateY(-1px); }

        .btn-ghost-dark {
          background: rgba(255,255,255,0.04); color: ${F.white};
          padding: 14px 28px; border-radius: 14px;
          font-size: 15px; font-weight: 700;
          display: inline-flex; align-items: center; gap: 8px;
          text-decoration: none; border: 1px solid rgba(255,255,255,0.18);
          transition: all 0.2s ease;
        }
        .btn-ghost-dark:hover { background: rgba(255,255,255,0.10); border-color: rgba(255,255,255,0.30); }

        .btn-ghost-warm {
          background: ${F.white}; color: ${F.ink};
          padding: 14px 28px; border-radius: 14px;
          font-size: 15px; font-weight: 700;
          display: inline-flex; align-items: center; gap: 8px;
          text-decoration: none; border: 1.5px solid ${F.ink};
          transition: all 0.2s ease;
        }
        .btn-ghost-warm:hover { background: ${F.ink}; color: ${F.white}; }

        .nav-link {
          color: rgba(255,255,255,0.82); text-decoration: none;
          font-size: 14.5px; font-weight: 500;
          padding: 8px 14px; border-radius: 8px;
          transition: all 0.15s ease;
        }
        .nav-link:hover { background: rgba(255,255,255,0.08); color: ${F.white}; }
        .nav-link-light { color: ${F.inkSoft}; }
        .nav-link-light:hover { background: ${F.bgSoft}; color: ${F.ink}; }

        .glied-card {
          transition: transform 0.3s cubic-bezier(0.2,0.8,0.2,1), box-shadow 0.3s ease, border-color 0.3s ease;
        }
        .glied-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 24px 48px rgba(23,105,255,0.10), 0 4px 16px rgba(15,23,42,0.06);
        }
        .glied-card:hover .glied-arrow { transform: translateX(6px); color: ${F.blue}; }
        .glied-card:hover .glied-foto { transform: scale(1.05); }
        .glied-arrow { transition: transform 0.3s ease, color 0.3s ease; display: inline-block; }
        .glied-foto { transition: transform 0.7s cubic-bezier(0.2,0.8,0.2,1); }

        .feature:hover .feature-foto { transform: scale(1.03); }
        .feature-foto { transition: transform 0.7s cubic-bezier(0.2,0.8,0.2,1); }

        .hero-glow {
          background:
            radial-gradient(800px 400px at 90% 30%, rgba(23,105,255,0.12), transparent 60%),
            radial-gradient(700px 500px at 10% 80%, rgba(23,105,255,0.06), transparent 60%);
          position: absolute; inset: 0; pointer-events: none;
        }
      `}</style>

      {/* HEADER - hell, freundlich */}
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: scrolled ? 'rgba(255,253,248,0.94)' : 'transparent', backdropFilter: scrolled ? 'saturate(180%) blur(20px)' : 'none', borderBottom: scrolled ? `1px solid ${F.border}` : '1px solid transparent', padding: mobil ? '14px 22px' : '18px 56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all 0.3s ease' }}>
        <a href="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontSize: mobil ? '24px' : '26px', fontWeight: 800, color: F.ink, letterSpacing: '-0.025em' }}>
            Lern<span style={{ color: F.coral }}>flix</span>
          </span>
        </a>
        <nav style={{ display: 'flex', gap: mobil ? '8px' : '28px', alignItems: 'center' }}>
          {!mobil && (
            <>
              <a href="/shop" className="nav-link-light">Lernmaterialien</a>
              <a href="/lernplan" className="nav-link-light">Lernplan</a>
              <a href="/quiz" className="nav-link-light">Quiz</a>
            </>
          )}
          <a href="/lernheld" className="btn-coral" style={{ padding: '11px 22px', fontSize: '14px', marginLeft: mobil ? '0' : '12px' }}>
            Lernheld
          </a>
        </nav>
      </header>

      {/* HERO - hell, warm, kinderfreundlich */}
      <section className="fade-up" style={{ background: F.bgWarm, color: F.ink, paddingTop: mobil ? '110px' : '140px', paddingBottom: mobil ? '70px' : '120px', paddingLeft: mobil ? '22px' : '56px', paddingRight: mobil ? '22px' : '56px', position: 'relative', overflow: 'hidden' }}>
        {!mobil && (
          <>
            <div style={{ position: 'absolute', top: '120px', right: '6%', width: '160px', height: '160px', borderRadius: '50%', background: F.bgPeach, opacity: 0.7, pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '60px', left: '4%', width: '120px', height: '120px', borderRadius: '50%', background: F.bgMint, opacity: 0.7, pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', top: '42%', right: '38%', width: '70px', height: '70px', borderRadius: '50%', background: F.bgSky, opacity: 0.6, pointerEvents: 'none' }} />
          </>
        )}
        <div style={{ maxWidth: '1320px', margin: '0 auto', display: 'grid', gridTemplateColumns: mobil ? '1fr' : '1.05fr 1fr', gap: mobil ? '50px' : '70px', alignItems: 'center', position: 'relative' }}>
          {/* Text */}
          <div>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: F.white, color: F.coral, padding: '8px 16px', borderRadius: '999px', fontSize: '13px', fontWeight: 700, marginBottom: '28px', boxShadow: '0 4px 14px rgba(255,91,74,0.16)' }}>
              <span className="pulse-dot" style={{ width: '7px', height: '7px', borderRadius: '50%', background: F.coral, boxShadow: `0 0 10px ${F.coral}` }} />
              Für Klasse 1 bis 13
            </span>
            <h1 style={{ fontFamily: SANS, fontSize: mobil ? '46px' : '82px', fontWeight: 800, lineHeight: 1.02, margin: '0 0 24px', color: F.ink, letterSpacing: '-0.035em' }}>
              Mathe und Physik <span style={{ color: F.coral }}>verstehen</span>.
            </h1>
            <p style={{ fontSize: mobil ? '17px' : '19px', color: F.inkSoft, lineHeight: 1.55, margin: '0 0 38px', maxWidth: '500px', fontWeight: 400 }}>
              Lernmaterialien, Lernplan, ein Quiz und Hilfe für die nächste Schulaufgabe. Alles auf einer Seite.
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: mobil ? '36px' : '52px' }}>
              <a href="#bereiche" className="btn-coral">
                Loslegen
                <span style={{ fontSize: '17px', lineHeight: 1 }}>→</span>
              </a>
              <a href="/shop" className="btn-ghost-warm">Zum Shop</a>
            </div>
            <div style={{ display: 'flex', gap: mobil ? '20px' : '36px', flexWrap: 'wrap', fontSize: '13px', color: F.inkSoft, fontWeight: 500 }}>
              <span><strong style={{ color: F.ink, fontWeight: 700 }}>13</strong> Lernpakete</span>
              <span><strong style={{ color: F.ink, fontWeight: 700 }}>61</strong> Quiz-Themen</span>
              <span>Mathe + Physik</span>
              <span>Ab 0,99 €</span>
            </div>
          </div>
          {/* Hero-Visual: floating Lernpaket-card-stack mit schwebenden mathe-symbolen */}
          <div className="fade-up-2" style={{ position: 'relative', height: mobil ? '500px' : '640px' }}>
            {/* Schwebende mathe-symbole als deko */}
            <span style={{ position: 'absolute', top: '3%', left: '6%', fontSize: mobil ? '42px' : '64px', fontWeight: 800, color: F.coral, opacity: 0.28, fontFamily: SANS, fontStyle: 'italic', animation: 'floatA 6s ease-in-out infinite' }}>π</span>
            <span style={{ position: 'absolute', top: '8%', right: '8%', fontSize: mobil ? '36px' : '54px', fontWeight: 800, color: F.blue, opacity: 0.28, fontFamily: SANS, fontStyle: 'italic', animation: 'floatB 7s ease-in-out infinite' }}>x²</span>
            <span style={{ position: 'absolute', bottom: '15%', left: '2%', fontSize: mobil ? '40px' : '60px', fontWeight: 800, color: '#a78bfa', opacity: 0.32, fontFamily: SANS, fontStyle: 'italic', animation: 'floatA 8s ease-in-out infinite 1s' }}>√</span>
            <span style={{ position: 'absolute', bottom: '4%', right: '4%', fontSize: mobil ? '38px' : '56px', fontWeight: 800, color: '#2e8a5c', opacity: 0.28, fontFamily: SANS, fontStyle: 'italic', animation: 'floatB 6.5s ease-in-out infinite 0.5s' }}>Σ</span>

            {/* Card-Stack zentral, sanft gefaechert */}
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ position: 'relative', width: mobil ? '320px' : '460px', height: mobil ? '440px' : '580px' }}>
                {KARTEN.map((k, i) => {
                  const totalAng = mobil ? 12 : 16;
                  const ang = (i - (KARTEN.length - 1) / 2) * (totalAng / (KARTEN.length - 1));
                  const offsetY = Math.abs(i - (KARTEN.length - 1) / 2) * (mobil ? 4 : 6);
                  const offsetX = (i - (KARTEN.length - 1) / 2) * (mobil ? 14 : 22);
                  return (
                    <div key={k.t} className="lernkarte" style={{ position: 'absolute', inset: 0, transform: `translateX(${offsetX}px) translateY(${offsetY}px) rotate(${ang}deg)`, transformOrigin: 'center bottom', animationDelay: `${i * 0.15}s` }}>
                      <div style={{ background: k.bg, borderRadius: '26px', padding: mobil ? '26px 22px' : '34px 30px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 22px 48px rgba(15,23,42,0.18), 0 6px 16px rgba(15,23,42,0.10)', border: '1.5px solid rgba(255,255,255,0.7)' }}>
                        <div>
                          <span style={{ display: 'inline-block', background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(6px)', color: k.akzent, padding: '6px 13px', borderRadius: '999px', fontSize: '12px', fontWeight: 800, marginBottom: mobil ? '18px' : '24px' }}>
                            {k.fach}
                          </span>
                          <div style={{ fontSize: mobil ? '54px' : '80px', fontWeight: 900, color: k.akzent, fontFamily: SANS, fontStyle: 'italic', letterSpacing: '-0.04em', lineHeight: 1, opacity: 0.95 }}>
                            {k.sym}
                          </div>
                        </div>
                        <div>
                          <h3 style={{ fontSize: mobil ? '28px' : '38px', fontWeight: 800, color: F.ink, margin: '0 0 6px', letterSpacing: '-0.025em', lineHeight: 1.0, fontFamily: SANS }}>
                            {k.t}
                          </h3>
                          <p style={{ fontSize: '14px', color: F.inkSoft, margin: '0 0 16px', fontWeight: 600 }}>
                            {k.klasse}
                          </p>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '14px', borderTop: '1.5px solid rgba(15,23,42,0.10)' }}>
                            <span style={{ fontSize: '18px', fontWeight: 800, color: F.ink, fontFamily: SANS, letterSpacing: '-0.01em' }}>{k.preis}</span>
                            <span style={{ fontSize: '13px', fontWeight: 700, color: k.akzent }}>Lernpaket →</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST STRIP - warm cream */}
      <section style={{ background: F.bgCream, padding: mobil ? '24px 22px' : '28px 56px' }}>
        <div style={{ maxWidth: '1320px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: mobil ? '20px' : '48px', justifyContent: 'center', alignItems: 'center' }}>
          {['Sofort verfügbar', 'PDF zum Ausdrucken', 'Sichere Bezahlung', 'Mit Rechnung', '14 Tage Widerruf'].map((t, i) => (
            <span key={i} style={{ fontSize: '13px', fontWeight: 600, color: F.inkSoft, letterSpacing: '-0.005em', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 7L6 10L11 4" stroke={F.green} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {t}
            </span>
          ))}
        </div>
      </section>

      {/* GLIED 3: LERNHELD - FEATURED (gross, premium) */}
      <section id="bereiche" style={{ background: F.bgWarm, padding: mobil ? '70px 22px 40px' : '120px 56px 50px' }}>
        <div style={{ maxWidth: '1320px', margin: '0 auto' }}>
          <div style={{ marginBottom: mobil ? '36px' : '52px', maxWidth: '720px' }}>
            <span style={{ display: 'inline-block', fontSize: '13px', color: F.blue, fontWeight: 700, marginBottom: '14px' }}>
              Premium · 1,99 €
            </span>
            <h2 style={{ fontFamily: SANS, fontSize: mobil ? '38px' : '56px', fontWeight: 800, color: F.ink, margin: '0 0 14px', letterSpacing: '-0.03em', lineHeight: 1.02 }}>
              Plan für die Schulaufgabe.
            </h2>
            <p style={{ fontSize: mobil ? '16px' : '18px', color: F.inkSoft, margin: 0, lineHeight: 1.55, fontWeight: 400 }}>
              Foto hochladen, Klasse wählen, fertig. Dein persönlicher Plan steht in 3 Minuten.
            </p>
          </div>
          <a href="/lernheld" className="feature" style={{ display: 'block', textDecoration: 'none', borderRadius: '32px', overflow: 'hidden', background: F.navy, color: F.white, boxShadow: '0 16px 50px rgba(11,31,58,0.20)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: mobil ? '1fr' : '1.05fr 1fr', gap: 0, alignItems: 'stretch' }}>
              <div style={{ padding: mobil ? '40px 28px' : '64px 64px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <span style={{ display: 'inline-flex', alignSelf: 'flex-start', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.08)', color: F.white, padding: '7px 14px', borderRadius: '999px', fontSize: '11.5px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '24px', border: '1px solid rgba(255,255,255,0.16)' }}>
                  Premium · 1,99 €
                </span>
                <h3 style={{ fontFamily: SANS, fontSize: mobil ? '40px' : '60px', fontWeight: 800, color: F.white, margin: '0 0 18px', lineHeight: 0.98, letterSpacing: '-0.035em' }}>
                  Lernheld
                </h3>
                <p style={{ fontSize: mobil ? '16px' : '18px', color: 'rgba(255,255,255,0.78)', margin: '0 0 32px', lineHeight: 1.55, maxWidth: '440px' }}>
                  Foto vom Stoff hochladen, Klasse wählen — fertig. Du bekommst einen persönlichen Plan mit Erklärungen, Übungen und Lösungen für deine Schulaufgabe.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '34px' }}>
                  {['Foto vom Stoff hochladen', 'Klasse und Datum wählen', 'Plan in 3 Min auf dem Handy'].map((t, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'rgba(23,105,255,0.16)', color: F.blue, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800, flexShrink: 0, fontFamily: '"JetBrains Mono", monospace' }}>
                        {i + 1}
                      </div>
                      <span style={{ fontSize: '15px', color: 'rgba(255,255,255,0.92)', fontWeight: 500 }}>{t}</span>
                    </div>
                  ))}
                </div>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', alignSelf: 'flex-start', background: F.blue, color: F.white, padding: '14px 26px', borderRadius: '12px', fontSize: '15px', fontWeight: 600, boxShadow: '0 8px 24px rgba(23,105,255,0.32)' }}>
                  Plan erstellen
                  <span style={{ fontSize: '16px' }}>→</span>
                </span>
              </div>
              <div style={{ position: 'relative', minHeight: mobil ? '320px' : '560px', overflow: 'hidden' }}>
                <img src={FOTO.lernheld} alt="" className="feature-foto" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(11,31,58,0.55) 0%, rgba(11,31,58,0.15) 30%, rgba(11,31,58,0) 60%)' }} />
              </div>
            </div>
          </a>
        </div>
      </section>

      {/* 3 GLIEDER: Shop / Lernplan / Quiz - mit visueller varianz, nicht symmetrisch */}
      <section style={{ background: F.bgWarm, padding: mobil ? '40px 22px 80px' : '50px 56px 130px' }}>
        <div style={{ maxWidth: '1320px', margin: '0 auto' }}>
          <div style={{ marginBottom: mobil ? '32px' : '50px', maxWidth: '720px' }}>
            <span style={{ display: 'inline-block', fontSize: '13px', color: F.blue, fontWeight: 700, marginBottom: '14px' }}>
              Auch dabei
            </span>
            <h2 style={{ fontFamily: SANS, fontSize: mobil ? '34px' : '50px', fontWeight: 800, color: F.ink, margin: 0, letterSpacing: '-0.03em', lineHeight: 1.0 }}>
              Shop, Lernplan und Quiz.
            </h2>
          </div>

          {/* asymmetrisches layout: shop gross links, lernplan + quiz gestapelt rechts */}
          <div style={{ display: 'grid', gridTemplateColumns: mobil ? '1fr' : '1.4fr 1fr', gap: mobil ? '20px' : '24px' }}>
            {/* Shop - gross, sky-blau */}
            <Glied
              href="/shop"
              foto={FOTO.shop}
              label="Lernmaterialien · ab 0,99 €"
              titel="Shop"
              sub="13 Lernpakete für Mathematik und Physik. Mit Erklärungen, Skizzen und Übungen. Sofort verfügbar."
              farbe={F.bgSky}
              gross
              mobil={mobil}
            />
            {/* Rechts: 2 gestapelt */}
            <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: mobil ? '20px' : '24px' }}>
              <Glied
                href="/lernplan"
                foto={FOTO.lernplan}
                label="Kostenlos"
                titel="Mein Lernplan"
                sub="Wöchentlicher Stundenplan mit Hausaufgaben und Lernblöcken."
                farbe={F.bgMint}
                mobil={mobil}
              />
              <Glied
                href="/quiz"
                foto={FOTO.quiz}
                label="Kostenlos"
                titel="Quiz"
                sub="61 Themen für Klasse 1 bis 13. Jede Runde neue Fragen."
                farbe={F.bgPeach}
                mobil={mobil}
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner - hell und warm */}
      <section style={{ background: F.bgCream, color: F.ink, padding: mobil ? '60px 22px' : '100px 56px', position: 'relative', overflow: 'hidden' }}>
        {!mobil && (
          <>
            <div style={{ position: 'absolute', top: '40px', right: '8%', width: '120px', height: '120px', borderRadius: '50%', background: F.bgPeach, opacity: 0.7, pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '40px', left: '6%', width: '90px', height: '90px', borderRadius: '50%', background: F.bgMint, opacity: 0.6, pointerEvents: 'none' }} />
          </>
        )}
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <h2 style={{ fontFamily: SANS, fontSize: mobil ? '38px' : '60px', fontWeight: 800, color: F.ink, margin: '0 0 20px', letterSpacing: '-0.035em', lineHeight: 1.02 }}>
            Jetzt <span style={{ color: F.coral }}>loslegen</span>.
          </h2>
          <p style={{ fontSize: mobil ? '17px' : '19px', color: F.inkSoft, margin: '0 auto 36px', lineHeight: 1.55, maxWidth: '540px' }}>
            Plan für die Schulaufgabe oder direkt durch die Lernmaterialien stöbern.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/lernheld" className="btn-coral">
              Lernheld starten
              <span style={{ fontSize: '17px', lineHeight: 1 }}>→</span>
            </a>
            <a href="/shop" className="btn-ghost-warm">Zum Shop</a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: F.navyDark, color: F.white, padding: mobil ? '60px 22px 30px' : '90px 56px 40px' }}>
        <div style={{ maxWidth: '1320px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: mobil ? '1fr' : '2fr 1fr 1fr 1fr', gap: '40px', marginBottom: '60px' }}>
            <div>
              <span style={{ fontSize: '28px', fontWeight: 800, color: F.white, letterSpacing: '-0.025em', display: 'block', marginBottom: '14px' }}>
                Lern<span style={{ color: F.blue }}>flix</span>
              </span>
              <p style={{ fontSize: '14.5px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, margin: 0, maxWidth: '320px' }}>
                Die Lern-Plattform für Mathematik und Physik. Klasse 1 bis 13.
              </p>
            </div>
            <div>
              <p style={{ fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', fontWeight: 700, margin: '0 0 18px' }}>Lernen</p>
              <a href="/shop" style={{ display: 'block', color: 'rgba(255,255,255,0.82)', textDecoration: 'none', fontSize: '14px', marginBottom: '10px' }}>Lernmaterialien</a>
              <a href="/lernplan" style={{ display: 'block', color: 'rgba(255,255,255,0.82)', textDecoration: 'none', fontSize: '14px', marginBottom: '10px' }}>Lernplan</a>
              <a href="/lernheld" style={{ display: 'block', color: 'rgba(255,255,255,0.82)', textDecoration: 'none', fontSize: '14px', marginBottom: '10px' }}>Lernheld</a>
              <a href="/quiz" style={{ display: 'block', color: 'rgba(255,255,255,0.82)', textDecoration: 'none', fontSize: '14px', marginBottom: '10px' }}>Quiz</a>
            </div>
            <div>
              <p style={{ fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', fontWeight: 700, margin: '0 0 18px' }}>Rechtliches</p>
              <a href="/impressum" style={{ display: 'block', color: 'rgba(255,255,255,0.82)', textDecoration: 'none', fontSize: '14px', marginBottom: '10px' }}>Impressum</a>
              <a href="/datenschutz" style={{ display: 'block', color: 'rgba(255,255,255,0.82)', textDecoration: 'none', fontSize: '14px', marginBottom: '10px' }}>Datenschutz</a>
              <a href="/agb" style={{ display: 'block', color: 'rgba(255,255,255,0.82)', textDecoration: 'none', fontSize: '14px', marginBottom: '10px' }}>AGB</a>
            </div>
            <div>
              <p style={{ fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', fontWeight: 700, margin: '0 0 18px' }}>Kontakt</p>
              <a href="https://wa.me/4917624700519" style={{ display: 'block', color: 'rgba(255,255,255,0.82)', textDecoration: 'none', fontSize: '14px', marginBottom: '10px' }}>WhatsApp</a>
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.10)', paddingTop: '24px', fontSize: '13px', color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>
            © {new Date().getFullYear()} Lernflix · lernflix.lernemitanna.de
          </div>
        </div>
      </footer>
    </main>
  );
}

function Glied({ href, foto, label, titel, sub, farbe, gross, mobil }: { href: string; foto: string; label: string; titel: string; sub: string; farbe: string; gross?: boolean; mobil: boolean }) {
  const F2 = { ink: '#0F172A', inkSoft: '#475569', border: 'rgba(15,23,42,0.08)', blue: '#1769FF' };
  return (
    <a href={href} className="glied-card" style={{ display: 'flex', flexDirection: 'column', background: farbe, border: `1px solid ${F2.border}`, borderRadius: '28px', overflow: 'hidden', textDecoration: 'none', color: F2.ink, height: '100%' }}>
      <div style={{ position: 'relative', aspectRatio: gross ? '16 / 9' : '16 / 7', overflow: 'hidden', background: '#f4f4f5', borderBottom: `1px solid ${F2.border}` }}>
        <img src={foto} alt="" className="glied-foto" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        <span style={{ position: 'absolute', top: '14px', left: '14px', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', color: F2.ink, padding: '6px 12px', borderRadius: '999px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', fontFamily: '"JetBrains Mono", monospace' }}>
          {label}
        </span>
      </div>
      <div style={{ padding: mobil ? '22px 22px 24px' : (gross ? '32px 36px 32px' : '24px 26px 24px'), display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h3 style={{ fontFamily: SANS, fontSize: mobil ? '24px' : (gross ? '38px' : '24px'), fontWeight: 800, margin: '0 0 8px', letterSpacing: '-0.025em', lineHeight: 1.05, color: F2.ink }}>{titel}</h3>
        <p style={{ fontSize: gross ? '15px' : '13.5px', color: F2.inkSoft, lineHeight: 1.55, margin: '0 0 16px', flex: 1 }}>{sub}</p>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 700, color: F2.ink, marginTop: 'auto' }}>
          Öffnen <span className="glied-arrow" style={{ fontSize: '16px' }}>→</span>
        </span>
      </div>
    </a>
  );
}
