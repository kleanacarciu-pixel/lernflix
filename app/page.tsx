'use client';
import { useEffect, useState } from 'react';

// Farben nach Research: Deep Navy + Electric Blue + clean White (Brilliant/Codecademy-Niveau)
const F = {
  navy: '#0B1F3A',
  navyDark: '#08182C',
  navySoft: '#152B4D',
  blue: '#1769FF',
  blueDeep: '#1156DD',
  blueLight: '#E8F0FF',
  bg: '#ffffff',
  bgSoft: '#F5F7FA',
  ink: '#0F172A',
  inkSoft: '#475569',
  inkMuted: '#94A3B8',
  border: '#E2E8F0',
  borderSoft: '#EEF2F6',
  white: '#ffffff',
  green: '#10B981',
  dark: '#0B1F3A',
};

const SANS = '"Inter", -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif';

const FOTO = {
  // hero: gruppe mit laptops um tisch (von dir gewuenscht, pfkknbsGuIc)
  // ACHTUNG: foto zeigt TradeStation-logo auf laptop — siehe chat-warnung
  hero: 'https://unsplash.com/photos/pfkknbsGuIc/download?w=1400&fm=jpg&q=85',
  // shop: bunte notizbloecke (ETRPjvb0KM0)
  shop: 'https://unsplash.com/photos/ETRPjvb0KM0/download?w=1000&fm=jpg&q=85',
  // lernplan: smiley mit doktorhut (iMfG5py52LA)
  lernplan: 'https://unsplash.com/photos/iMfG5py52LA/download?w=1000&fm=jpg&q=85',
  // lernheld: person schreibt auf weissem papier (zNFT3o8HWks)
  lernheld: 'https://unsplash.com/photos/zNFT3o8HWks/download?w=1400&fm=jpg&q=85',
  // quiz: kind blickt auf 3 fragezeichen-bloecke (9Ul7x0bk3qE)
  quiz: 'https://unsplash.com/photos/9Ul7x0bk3qE/download?w=1000&fm=jpg&q=85',
};

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
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@500&display=swap" />

      <style>{`
        * { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
        body { background: ${F.bg}; margin: 0; font-family: ${SANS}; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes floatY { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes pulseDot { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.6; transform: scale(1.15); } }
        .fade-up { animation: fadeUp 0.9s cubic-bezier(0.2, 0.8, 0.2, 1) both; }
        .fade-up-2 { animation: fadeUp 0.9s 0.15s cubic-bezier(0.2, 0.8, 0.2, 1) both; }
        .float-y { animation: floatY 5s ease-in-out infinite; }
        .pulse-dot { animation: pulseDot 2s ease-in-out infinite; }

        .btn-primary {
          background: ${F.blue}; color: ${F.white};
          padding: 14px 28px; border-radius: 12px;
          font-size: 15px; font-weight: 600; letter-spacing: -0.005em;
          display: inline-flex; align-items: center; gap: 8px;
          text-decoration: none; border: none; cursor: pointer;
          transition: background 0.2s ease, box-shadow 0.2s ease, transform 0.15s ease;
          box-shadow: 0 1px 2px rgba(23,105,255,0.08), 0 8px 24px rgba(23,105,255,0.20);
          font-family: ${SANS};
        }
        .btn-primary:hover { background: ${F.blueDeep}; box-shadow: 0 1px 2px rgba(23,105,255,0.10), 0 14px 32px rgba(23,105,255,0.28); transform: translateY(-1px); }
        .btn-primary:active { transform: translateY(0); }

        .btn-ghost-dark {
          background: rgba(255,255,255,0.04); color: ${F.white};
          padding: 14px 28px; border-radius: 12px;
          font-size: 15px; font-weight: 600; letter-spacing: -0.005em;
          display: inline-flex; align-items: center; gap: 8px;
          text-decoration: none; border: 1px solid rgba(255,255,255,0.18);
          transition: all 0.2s ease;
        }
        .btn-ghost-dark:hover { background: rgba(255,255,255,0.10); border-color: rgba(255,255,255,0.30); }

        .btn-ghost-light {
          background: ${F.bg}; color: ${F.ink};
          padding: 14px 28px; border-radius: 12px;
          font-size: 15px; font-weight: 600; letter-spacing: -0.005em;
          display: inline-flex; align-items: center; gap: 8px;
          text-decoration: none; border: 1px solid ${F.border};
          transition: all 0.2s ease;
        }
        .btn-ghost-light:hover { border-color: ${F.ink}; }

        .card {
          background: ${F.white}; border: 1px solid ${F.border};
          border-radius: 18px; overflow: hidden; text-decoration: none;
          display: flex; flex-direction: column; color: ${F.ink};
          transition: transform 0.4s cubic-bezier(0.2,0.8,0.2,1), box-shadow 0.4s ease, border-color 0.3s ease;
          box-shadow: 0 1px 2px rgba(15,23,42,0.04);
        }
        .card:hover {
          transform: translateY(-4px);
          box-shadow: 0 24px 48px rgba(23,105,255,0.12), 0 4px 16px rgba(15,23,42,0.06);
          border-color: ${F.blueLight};
        }
        .card:hover .card-arrow { transform: translateX(6px); color: ${F.blue}; }
        .card:hover .card-foto { transform: scale(1.05); }
        .card-arrow { transition: transform 0.3s ease, color 0.3s ease; display: inline-block; }
        .card-foto { transition: transform 0.7s cubic-bezier(0.2,0.8,0.2,1); }

        .feature-card { transition: transform 0.4s cubic-bezier(0.2,0.8,0.2,1), box-shadow 0.4s ease; }
        .feature-card:hover { transform: translateY(-4px); box-shadow: 0 28px 56px rgba(11,31,58,0.25); }
        .feature-card:hover .feature-foto { transform: scale(1.04); }
        .feature-foto { transition: transform 0.7s cubic-bezier(0.2,0.8,0.2,1); }

        /* Subtle radial spotlight im hero */
        .hero-glow {
          background:
            radial-gradient(800px 400px at 90% 30%, rgba(23,105,255,0.12), transparent 60%),
            radial-gradient(700px 500px at 10% 80%, rgba(23,105,255,0.06), transparent 60%);
          position: absolute; inset: 0; pointer-events: none;
        }
      `}</style>

      {/* HEADER */}
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: scrolled ? 'rgba(255,255,255,0.94)' : 'transparent', backdropFilter: scrolled ? 'saturate(180%) blur(20px)' : 'none', borderBottom: scrolled ? `1px solid ${F.border}` : '1px solid transparent', padding: mobil ? '14px 22px' : '18px 56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all 0.3s ease' }}>
        <a href="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontFamily: SANS, fontSize: mobil ? '24px' : '26px', fontWeight: 800, color: scrolled ? F.ink : F.white, letterSpacing: '-0.025em' }}>
            Lern<span style={{ color: F.blue }}>flix</span>
          </span>
        </a>
        <nav style={{ display: 'flex', gap: mobil ? '14px' : '32px', alignItems: 'center' }}>
          {!mobil && (
            <>
              <a href="/shop" style={{ color: scrolled ? F.inkSoft : 'rgba(255,255,255,0.82)', textDecoration: 'none', fontSize: '14.5px', fontWeight: 500, transition: 'color 0.2s' }}>Shop</a>
              <a href="/lernplan" style={{ color: scrolled ? F.inkSoft : 'rgba(255,255,255,0.82)', textDecoration: 'none', fontSize: '14.5px', fontWeight: 500 }}>Lernplan</a>
              <a href="/quiz" style={{ color: scrolled ? F.inkSoft : 'rgba(255,255,255,0.82)', textDecoration: 'none', fontSize: '14.5px', fontWeight: 500 }}>Quiz</a>
            </>
          )}
          <a href="/lernheld" className="btn-primary" style={{ padding: '10px 18px', fontSize: '13.5px' }}>
            Lernheld starten
          </a>
        </nav>
      </header>

      {/* HERO - Navy, Premium Tech Look (Brilliant/Codecademy-Style) */}
      <section className="fade-up" style={{ background: F.navy, color: F.white, paddingTop: mobil ? '110px' : '140px', paddingBottom: mobil ? '70px' : '120px', paddingLeft: mobil ? '22px' : '56px', paddingRight: mobil ? '22px' : '56px', position: 'relative', overflow: 'hidden' }}>
        <div className="hero-glow" />
        <div style={{ maxWidth: '1320px', margin: '0 auto', display: 'grid', gridTemplateColumns: mobil ? '1fr' : '1.05fr 1fr', gap: mobil ? '50px' : '70px', alignItems: 'center', position: 'relative' }}>
          {/* Text */}
          <div>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.14)', color: 'rgba(255,255,255,0.92)', padding: '7px 14px', borderRadius: '999px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.04em', marginBottom: '28px', fontFamily: '"JetBrains Mono", monospace' }}>
              <span className="pulse-dot" style={{ width: '6px', height: '6px', borderRadius: '50%', background: F.green, boxShadow: `0 0 12px ${F.green}` }} />
              DIE LERN-PLATTFORM · KLASSE 1—13
            </span>
            <h1 style={{ fontFamily: SANS, fontSize: mobil ? '46px' : '76px', fontWeight: 800, lineHeight: 1.02, margin: '0 0 24px', color: F.white, letterSpacing: '-0.035em' }}>
              Verstehen, statt<br />auswendig <span style={{ color: F.blue }}>lernen</span>.
            </h1>
            <p style={{ fontSize: mobil ? '17px' : '19px', color: 'rgba(255,255,255,0.72)', lineHeight: 1.55, margin: '0 0 38px', maxWidth: '500px', fontWeight: 400 }}>
              Lernmaterialien, dein eigener Lernplan, Hilfe für die Schulaufgabe und ein kostenloses Quiz. Mathematik und Physik, Klasse 1 bis 13.
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: mobil ? '36px' : '52px' }}>
              <a href="#bereiche" className="btn-primary">
                Loslegen
                <span style={{ fontSize: '17px', lineHeight: 1 }}>→</span>
              </a>
              <a href="/shop" className="btn-ghost-dark">
                Zum Shop
              </a>
            </div>
            {/* Trust line */}
            <div style={{ display: 'flex', gap: mobil ? '20px' : '36px', flexWrap: 'wrap', fontSize: '13px', color: 'rgba(255,255,255,0.5)', fontWeight: 500, letterSpacing: '-0.005em' }}>
              <span><strong style={{ color: F.white, fontWeight: 700 }}>13</strong> Lernpakete</span>
              <span><strong style={{ color: F.white, fontWeight: 700 }}>61</strong> Quiz-Themen</span>
              <span>Mathe + Physik</span>
              <span>Ab 0,99 €</span>
            </div>
          </div>
          {/* Hero: Foto mit Laptop-Mockup drueber (TradeStation-Style) */}
          <div className="fade-up-2" style={{ position: 'relative' }}>
            <div style={{ position: 'relative', borderRadius: '18px', overflow: 'hidden', aspectRatio: '4 / 3', boxShadow: '0 30px 80px rgba(0,0,0,0.45), 0 8px 24px rgba(0,0,0,0.30)' }}>
              {/* Foto-Hintergrund (gedimmt) */}
              <img src={FOTO.hero} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(11,31,58,0.30) 0%, rgba(11,31,58,0.55) 100%)' }} />

              {/* Laptop-Mockup ueber dem Foto */}
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: mobil ? '12px' : '24px' }}>
                <div style={{ perspective: '1800px', width: '100%' }}>
                  <div style={{ transformStyle: 'preserve-3d', transform: mobil ? 'rotateY(-8deg) rotateX(3deg)' : 'rotateY(-12deg) rotateX(4deg)', transformOrigin: 'center center' }}>
                    {/* Laptop Bezel + Screen */}
                    <div style={{ background: '#0a0a0a', borderRadius: '10px 10px 3px 3px', padding: mobil ? '7px 7px 0' : '10px 10px 0', boxShadow: '0 30px 60px rgba(0,0,0,0.55), inset 0 0 0 1px rgba(255,255,255,0.04)' }}>
                      {/* Camera notch */}
                      <div style={{ height: mobil ? '8px' : '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: mobil ? '3px' : '4px' }}>
                        <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#1c1c1c' }} />
                      </div>
                      {/* Screen content */}
                      <div style={{ background: F.navy, aspectRatio: '16 / 10', borderRadius: '1px', overflow: 'hidden', position: 'relative' }}>
                        {/* Browser bar */}
                        <div style={{ background: '#ececec', padding: mobil ? '4px 6px' : '6px 10px', display: 'flex', alignItems: 'center', gap: mobil ? '3px' : '5px', borderBottom: '1px solid #d8d8d8' }}>
                          <div style={{ display: 'flex', gap: '3px' }}>
                            <div style={{ width: mobil ? '5px' : '7px', height: mobil ? '5px' : '7px', borderRadius: '50%', background: '#ff5f57' }} />
                            <div style={{ width: mobil ? '5px' : '7px', height: mobil ? '5px' : '7px', borderRadius: '50%', background: '#febc2e' }} />
                            <div style={{ width: mobil ? '5px' : '7px', height: mobil ? '5px' : '7px', borderRadius: '50%', background: '#28c840' }} />
                          </div>
                          <div style={{ marginLeft: mobil ? '4px' : '8px', flex: 1, background: '#ffffff', padding: mobil ? '2px 6px' : '3px 8px', borderRadius: '3px', fontSize: mobil ? '6px' : '8px', color: '#74747c', fontWeight: 500 }}>
                            lernflix.lernemitanna.de
                          </div>
                        </div>
                        {/* Mini Lernflix-Inhalt */}
                        <div style={{ background: F.navy, color: F.white, padding: mobil ? '10px 12px' : '18px 22px', height: 'calc(100% - 18px)', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
                          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(300px 160px at 90% 10%, rgba(23,105,255,0.20), transparent 60%)', pointerEvents: 'none' }} />
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
                            <span style={{ fontSize: mobil ? '9px' : '12px', fontWeight: 800, letterSpacing: '-0.025em' }}>
                              Lern<span style={{ color: F.blue }}>flix</span>
                            </span>
                            <div style={{ display: 'flex', gap: mobil ? '6px' : '10px', alignItems: 'center', fontSize: mobil ? '5.5px' : '7.5px', fontWeight: 500 }}>
                              <span style={{ opacity: 0.7 }}>Shop</span>
                              <span style={{ opacity: 0.7 }}>Lernplan</span>
                              <span style={{ opacity: 0.7 }}>Quiz</span>
                              <span style={{ background: F.blue, color: F.white, padding: mobil ? '2px 6px' : '3px 8px', borderRadius: '3px', fontWeight: 700 }}>Lernheld</span>
                            </div>
                          </div>
                          <div style={{ marginTop: mobil ? '8px' : '14px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative' }}>
                            <span style={{ fontSize: mobil ? '5px' : '7px', color: 'rgba(255,255,255,0.7)', fontWeight: 600, letterSpacing: '0.16em', fontFamily: '"JetBrains Mono", monospace', display: 'inline-flex', alignItems: 'center', gap: '4px', marginBottom: mobil ? '4px' : '6px' }}>
                              <span style={{ width: '3px', height: '3px', borderRadius: '50%', background: F.green }} />
                              DIE LERN-PLATTFORM · KLASSE 1—13
                            </span>
                            <h3 style={{ fontFamily: SANS, fontSize: mobil ? '14px' : '24px', fontWeight: 800, lineHeight: 0.96, margin: '0 0 6px', letterSpacing: '-0.035em', color: F.white }}>
                              Verstehen, statt<br />auswendig <span style={{ color: F.blue }}>lernen</span>.
                            </h3>
                            <p style={{ fontSize: mobil ? '5.5px' : '8px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.4, margin: mobil ? '0 0 6px' : '0 0 10px', maxWidth: '75%' }}>
                              Mathe und Physik, Klasse 1 bis 13. Sofort verfügbar.
                            </p>
                            <div style={{ display: 'flex', gap: mobil ? '4px' : '6px' }}>
                              <span style={{ background: F.blue, color: F.white, padding: mobil ? '3px 7px' : '4px 10px', borderRadius: mobil ? '3px' : '4px', fontSize: mobil ? '5.5px' : '8px', fontWeight: 600 }}>
                                Loslegen →
                              </span>
                              <span style={{ background: 'transparent', color: F.white, padding: mobil ? '3px 7px' : '4px 10px', borderRadius: mobil ? '3px' : '4px', fontSize: mobil ? '5.5px' : '8px', fontWeight: 600, border: '1px solid rgba(255,255,255,0.22)' }}>
                                Zum Shop
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Laptop Base (hinge + bottom) */}
                    <div style={{ width: '107%', marginLeft: '-3.5%', height: mobil ? '8px' : '11px', background: 'linear-gradient(to bottom, #d4d4d4 0%, #9a9a9a 30%, #5a5a5a 80%, #2a2a2a 100%)', borderRadius: '0 0 11px 11px', boxShadow: '0 6px 14px rgba(0,0,0,0.25), inset 0 -1px 0 rgba(0,0,0,0.4)', position: 'relative' }}>
                      <div style={{ position: 'absolute', bottom: '-1px', left: '50%', transform: 'translateX(-50%)', width: '14%', height: '3px', background: '#1a1a1a', borderRadius: '0 0 5px 5px' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST STRIP - dezent, professionell */}
      <section style={{ background: F.bgSoft, padding: mobil ? '24px 22px' : '28px 56px', borderBottom: `1px solid ${F.border}` }}>
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

      {/* BENTO-GRID: Lernheld gross, dann Lernplan, Quiz, Shop in unterschiedlichen groessen */}
      <section id="bereiche" style={{ background: F.bg, padding: mobil ? '70px 22px 80px' : '120px 56px 140px' }}>
        <div style={{ maxWidth: '1320px', margin: '0 auto' }}>
          <div style={{ marginBottom: mobil ? '36px' : '60px', maxWidth: '720px' }}>
            <span style={{ display: 'inline-block', fontSize: '12px', color: F.blue, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '14px', fontFamily: '"JetBrains Mono", monospace' }}>
              ⎯ Was du bei Lernflix bekommst
            </span>
            <h2 style={{ fontFamily: SANS, fontSize: mobil ? '40px' : '64px', fontWeight: 800, color: F.ink, margin: '0 0 14px', letterSpacing: '-0.035em', lineHeight: 1.0 }}>
              Vier Bereiche. <span style={{ color: F.blue }}>Ein Ziel.</span>
            </h2>
            <p style={{ fontSize: mobil ? '16px' : '18px', color: F.inkSoft, margin: 0, lineHeight: 1.55, fontWeight: 400 }}>
              Lernmaterialien, Lernplan, Lernheld und Quiz — alles im selben Account, sofort verfügbar.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: mobil ? '1fr' : 'repeat(3, 1fr)',
            gridTemplateAreas: mobil
              ? `"lernheld" "lernplan" "quiz" "shop"`
              : `"lernheld lernheld lernplan" "lernheld lernheld quiz" "shop shop shop"`,
            gridAutoRows: mobil ? 'auto' : 'minmax(230px, auto)',
            gap: mobil ? '16px' : '20px',
          }}>
            {/* LERNHELD - gross 2x2, navy */}
            <a href="/lernheld" className="bento" style={{ gridArea: 'lernheld', background: F.navy, color: F.white, borderRadius: '24px', overflow: 'hidden', textDecoration: 'none', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: mobil ? '420px' : 'auto' }}>
              {/* Foto im hintergrund */}
              <img src={FOTO.lernheld} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.22 }} />
              <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, ${F.navy} 0%, rgba(11,31,58,0.7) 50%, rgba(11,31,58,0.4) 100%)` }} />
              <div className="hero-glow" />
              {/* Top: badge + 1 sehr gut */}
              <div style={{ position: 'relative', padding: mobil ? '28px 28px 0' : '40px 44px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '14px' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.10)', color: F.white, padding: '7px 14px', borderRadius: '999px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', border: '1px solid rgba(255,255,255,0.20)', backdropFilter: 'blur(8px)' }}>
                  Premium · 1,99 €
                </span>
                <div style={{ background: F.white, color: F.ink, borderRadius: '12px', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 10px 24px rgba(0,0,0,0.20)' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: F.blueLight, color: F.blue, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 800 }}>
                    1
                  </div>
                  <div>
                    <p style={{ fontSize: '9px', color: F.inkSoft, margin: 0, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' }}>Note</p>
                    <p style={{ fontSize: '12px', color: F.ink, margin: 0, fontWeight: 800, letterSpacing: '-0.01em' }}>Sehr gut</p>
                  </div>
                </div>
              </div>
              {/* Bottom: text */}
              <div style={{ position: 'relative', padding: mobil ? '24px 28px 32px' : '0 44px 44px' }}>
                <h3 style={{ fontFamily: SANS, fontSize: mobil ? '42px' : '64px', fontWeight: 800, color: F.white, margin: '0 0 14px', lineHeight: 0.96, letterSpacing: '-0.035em' }}>
                  Lernheld
                </h3>
                <p style={{ fontSize: mobil ? '15px' : '16.5px', color: 'rgba(255,255,255,0.78)', margin: '0 0 26px', lineHeight: 1.55, maxWidth: '440px' }}>
                  Foto vom Stoff hochladen, Klasse wählen — fertig. Dein Plan für die nächste Schulaufgabe in 3 Minuten.
                </p>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: F.blue, color: F.white, padding: '13px 24px', borderRadius: '12px', fontSize: '14.5px', fontWeight: 600, boxShadow: '0 8px 24px rgba(23,105,255,0.32)' }}>
                  Plan erstellen
                  <span style={{ fontSize: '15px' }}>→</span>
                </span>
              </div>
            </a>

            {/* LERNPLAN - klein 1x1, helles cream */}
            <a href="/lernplan" className="bento" style={{ gridArea: 'lernplan', background: '#fff4dc', color: F.ink, borderRadius: '24px', overflow: 'hidden', textDecoration: 'none', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: mobil ? '24px' : '28px', minHeight: mobil ? '240px' : 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '10.5px', color: '#8a6a1a', fontWeight: 800, letterSpacing: '0.16em', textTransform: 'uppercase', fontFamily: '"JetBrains Mono", monospace' }}>
                  02 · Kostenlos
                </span>
                {/* Mini calendar widget */}
                <div style={{ background: F.white, borderRadius: '10px', padding: '8px 10px', fontSize: '9px', boxShadow: '0 8px 20px rgba(122,89,18,0.15)', textAlign: 'center', transform: 'rotate(3deg)' }}>
                  <p style={{ margin: 0, fontSize: '8px', color: F.inkSoft, fontWeight: 700, letterSpacing: '0.08em' }}>MO 14</p>
                  <p style={{ margin: '2px 0 0', fontSize: '14px', fontWeight: 800, color: F.ink, lineHeight: 1, letterSpacing: '-0.02em' }}>Mathe</p>
                  <p style={{ margin: '2px 0 0', fontSize: '8px', color: '#10B981', fontWeight: 700 }}>● 16:00</p>
                </div>
              </div>
              <div>
                <h3 style={{ fontFamily: SANS, fontSize: mobil ? '26px' : '32px', fontWeight: 800, color: F.ink, margin: '0 0 8px', lineHeight: 1.0, letterSpacing: '-0.025em' }}>
                  Mein Lernplan
                </h3>
                <p style={{ fontSize: '13.5px', color: 'rgba(15,23,42,0.65)', lineHeight: 1.5, margin: '0 0 16px' }}>
                  Stundenplan, Hausaufgaben und Lernblöcke. Alles übersichtlich.
                </p>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, color: F.ink }}>
                  Plan erstellen <span style={{ fontSize: '15px' }}>→</span>
                </span>
              </div>
            </a>

            {/* QUIZ - klein 1x1, helles mint */}
            <a href="/quiz" className="bento" style={{ gridArea: 'quiz', background: '#e3f5ec', color: F.ink, borderRadius: '24px', overflow: 'hidden', textDecoration: 'none', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: mobil ? '24px' : '28px', minHeight: mobil ? '240px' : 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '10.5px', color: '#1e6f4b', fontWeight: 800, letterSpacing: '0.16em', textTransform: 'uppercase', fontFamily: '"JetBrains Mono", monospace' }}>
                  03 · Kostenlos
                </span>
                {/* Mini quiz tiles */}
                <div style={{ display: 'flex', gap: '4px', transform: 'rotate(-3deg)' }}>
                  {['?', '?', '?'].map((q, i) => (
                    <div key={i} style={{ background: F.white, borderRadius: '8px', width: '28px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 800, color: i === 1 ? F.blue : F.inkMuted, boxShadow: '0 4px 12px rgba(30,111,75,0.18)', fontFamily: SANS }}>
                      {q}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 style={{ fontFamily: SANS, fontSize: mobil ? '26px' : '32px', fontWeight: 800, color: F.ink, margin: '0 0 8px', lineHeight: 1.0, letterSpacing: '-0.025em' }}>
                  Quiz
                </h3>
                <p style={{ fontSize: '13.5px', color: 'rgba(15,23,42,0.65)', lineHeight: 1.5, margin: '0 0 16px' }}>
                  61 Themen für Klasse 1 bis 13. Jede Runde neue Fragen.
                </p>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, color: F.ink }}>
                  Quiz starten <span style={{ fontSize: '15px' }}>→</span>
                </span>
              </div>
            </a>

            {/* SHOP - wide bottom, 3 spalten breit */}
            <a href="/shop" className="bento" style={{ gridArea: 'shop', background: F.white, border: `1px solid ${F.border}`, color: F.ink, borderRadius: '24px', overflow: 'hidden', textDecoration: 'none', position: 'relative', display: 'grid', gridTemplateColumns: mobil ? '1fr' : '1fr 1.4fr', alignItems: 'stretch', minHeight: mobil ? 'auto' : '260px' }}>
              <div style={{ padding: mobil ? '28px' : '40px 44px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <span style={{ fontSize: '10.5px', color: F.blue, fontWeight: 800, letterSpacing: '0.16em', textTransform: 'uppercase', fontFamily: '"JetBrains Mono", monospace', marginBottom: '14px' }}>
                  01 · Shop · ab 0,99 €
                </span>
                <h3 style={{ fontFamily: SANS, fontSize: mobil ? '32px' : '44px', fontWeight: 800, color: F.ink, margin: '0 0 10px', lineHeight: 0.98, letterSpacing: '-0.03em' }}>
                  Lernmaterialien
                </h3>
                <p style={{ fontSize: mobil ? '14.5px' : '16px', color: F.inkSoft, lineHeight: 1.55, margin: '0 0 22px', maxWidth: '440px' }}>
                  13 Lernpakete für Mathe und Physik. Mit Erklärungen, Skizzen und Übungen. Sofort verfügbar.
                </p>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', alignSelf: 'flex-start', background: F.ink, color: F.white, padding: '13px 24px', borderRadius: '12px', fontSize: '14px', fontWeight: 600 }}>
                  Zum Shop
                  <span style={{ fontSize: '15px' }}>→</span>
                </span>
              </div>
              {/* Mini-buecher reihe */}
              <div style={{ position: 'relative', background: F.bgSoft, padding: mobil ? '24px' : '28px 32px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                <div style={{ display: 'flex', gap: mobil ? '8px' : '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
                  {[
                    { t: 'Brüche', c: '#ff4757', a: -4 },
                    { t: 'Geometrie', c: '#1769FF', a: 3 },
                    { t: 'Funktionen', c: '#7158e2', a: -2 },
                    { t: 'Trigo', c: '#10B981', a: 5 },
                    { t: 'Mechanik', c: '#f59e0b', a: -3 },
                    { t: 'Optik', c: '#06b6d4', a: 2 },
                    { t: 'Atomphysik', c: '#0F172A', a: -4 },
                  ].map((p, i) => (
                    <div key={i} style={{ background: F.white, border: `1px solid ${F.border}`, borderRadius: '10px', padding: '10px 12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', transform: `rotate(${p.a}deg)`, minWidth: mobil ? '78px' : '100px' }}>
                      <div style={{ width: '100%', height: '4px', background: p.c, borderRadius: '2px', marginBottom: '8px' }} />
                      <p style={{ margin: 0, fontSize: mobil ? '11px' : '12.5px', fontWeight: 800, letterSpacing: '-0.01em', color: F.ink, lineHeight: 1.1 }}>{p.t}</p>
                      <p style={{ margin: '4px 0 0', fontSize: '10px', color: F.inkMuted, fontWeight: 600 }}>ab 0,99 €</p>
                    </div>
                  ))}
                </div>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{ background: F.navy, color: F.white, padding: mobil ? '60px 22px' : '100px 56px', position: 'relative', overflow: 'hidden' }}>
        <div className="hero-glow" />
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <h2 style={{ fontFamily: SANS, fontSize: mobil ? '38px' : '60px', fontWeight: 800, color: F.white, margin: '0 0 20px', letterSpacing: '-0.035em', lineHeight: 1.02 }}>
            Bereit für deine<br />nächste <span style={{ color: F.blue }}>Eins</span>?
          </h2>
          <p style={{ fontSize: mobil ? '17px' : '19px', color: 'rgba(255,255,255,0.72)', margin: '0 auto 36px', lineHeight: 1.55, maxWidth: '540px' }}>
            Erstelle deinen Lernplan oder schau dir die Lernmaterialien an. Sofort verfügbar.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/lernheld" className="btn-primary">
              Lernheld starten
              <span style={{ fontSize: '17px', lineHeight: 1 }}>→</span>
            </a>
            <a href="/shop" className="btn-ghost-dark">
              Zum Shop
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: F.navyDark, color: F.white, padding: mobil ? '60px 22px 30px' : '90px 56px 40px' }}>
        <div style={{ maxWidth: '1320px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: mobil ? '1fr' : '2fr 1fr 1fr 1fr', gap: '40px', marginBottom: '60px' }}>
            <div>
              <span style={{ fontFamily: SANS, fontSize: '28px', fontWeight: 800, color: F.white, letterSpacing: '-0.025em', display: 'block', marginBottom: '14px' }}>
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
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.10)', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>
            <span>© {new Date().getFullYear()} Lernflix · lernflix.lernemitanna.de</span>
          </div>
        </div>
      </footer>
    </main>
  );
}

function Karte({ href, label, titel, sub, foto, preis, mobil }: { href: string; label: string; titel: string; sub: string; foto: string; preis: string; mobil: boolean }) {
  const F2 = { bg: '#ffffff', ink: '#0F172A', inkSoft: '#475569', inkMuted: '#94A3B8', border: '#E2E8F0', blue: '#1769FF', blueLight: '#E8F0FF' };
  return (
    <a href={href} className="card">
      <div style={{ position: 'relative', aspectRatio: '5 / 4', overflow: 'hidden', background: '#f4f4f5' }}>
        <img src={foto} alt="" className="card-foto" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        <span style={{ position: 'absolute', top: '14px', left: '14px', background: 'rgba(255,255,255,0.96)', backdropFilter: 'blur(10px)', color: F2.ink, padding: '6px 12px', borderRadius: '999px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', fontFamily: '"JetBrains Mono", monospace' }}>
          {label}
        </span>
      </div>
      <div style={{ padding: mobil ? '22px 22px 24px' : '26px 28px 28px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h3 style={{ fontFamily: SANS, fontSize: mobil ? '24px' : '28px', fontWeight: 800, margin: '0 0 8px', letterSpacing: '-0.025em', lineHeight: 1.05, color: F2.ink }}>{titel}</h3>
        <p style={{ fontSize: '14.5px', color: F2.inkSoft, lineHeight: 1.55, margin: '0 0 20px', flex: 1 }}>{sub}</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: `1px solid ${F2.border}` }}>
          <span style={{ fontSize: '13.5px', color: F2.inkSoft, fontWeight: 600 }}>{preis}</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 700, color: F2.ink }}>
            Öffnen <span className="card-arrow" style={{ fontSize: '16px' }}>→</span>
          </span>
        </div>
      </div>
    </a>
  );
}
