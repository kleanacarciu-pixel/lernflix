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
  // hero: schueler/teen am tablet (statt buero-mann)
  hero: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1400&auto=format&fit=crop&q=90',
  // shop: bunte schulbuecher mit apfel (klassiker, statt vintage-pages)
  shop: 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=1000&auto=format&fit=crop&q=90',
  lernplan: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=1000&auto=format&fit=crop&q=90',
  lernheld: 'https://images.unsplash.com/photo-1488998427799-e3362cec87c3?w=1400&auto=format&fit=crop&q=90',
  // quiz: kind mit tablet (statt leerer broken-link)
  quiz: 'https://images.unsplash.com/photo-1610484826917-0f101a7a8e69?w=1000&auto=format&fit=crop&q=90',
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
          {/* Foto + Peeking UI Element */}
          <div className="fade-up-2" style={{ position: 'relative' }}>
            <div style={{ position: 'relative', borderRadius: '20px', overflow: 'hidden', aspectRatio: mobil ? '4 / 5' : '4 / 5', boxShadow: '0 30px 80px rgba(0,0,0,0.45), 0 8px 24px rgba(0,0,0,0.30)' }}>
              <img src={FOTO.hero} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(170deg, rgba(11,31,58,0.10) 0%, rgba(11,31,58,0.50) 100%)' }} />
            </div>
            {/* Peeking Formel-Card (Brilliant-Style) */}
            <div className="float-y" style={{ position: 'absolute', bottom: mobil ? '-20px' : '-30px', left: mobil ? '-12px' : '-40px', background: F.white, color: F.ink, borderRadius: '14px', padding: mobil ? '14px 18px' : '18px 22px', boxShadow: '0 20px 50px rgba(0,0,0,0.20), 0 4px 12px rgba(0,0,0,0.10)', minWidth: mobil ? '180px' : '230px' }}>
              <p style={{ fontSize: '10.5px', fontWeight: 700, color: F.blue, letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 8px', fontFamily: '"JetBrains Mono", monospace' }}>Pythagoras</p>
              <p style={{ fontSize: mobil ? '20px' : '24px', fontWeight: 700, margin: '0 0 6px', fontFamily: '"JetBrains Mono", monospace', letterSpacing: '-0.01em' }}>
                a<sup style={{ fontSize: '14px' }}>2</sup> + b<sup style={{ fontSize: '14px' }}>2</sup> = c<sup style={{ fontSize: '14px' }}>2</sup>
              </p>
              <p style={{ fontSize: '12.5px', color: F.inkSoft, margin: 0, fontWeight: 500 }}>Rechtwinkliges Dreieck</p>
            </div>
            {/* Peeking Note-Card */}
            <div style={{ position: 'absolute', top: mobil ? '-16px' : '-22px', right: mobil ? '-10px' : '-26px', background: F.white, color: F.ink, borderRadius: '14px', padding: '14px 18px', boxShadow: '0 20px 50px rgba(0,0,0,0.20), 0 4px 12px rgba(0,0,0,0.10)', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: F.blueLight, color: F.blue, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 800 }}>
                1
              </div>
              <div>
                <p style={{ fontSize: '11px', color: F.inkSoft, margin: '0 0 2px', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Klassenarbeit</p>
                <p style={{ fontSize: '13.5px', color: F.ink, margin: 0, fontWeight: 700, letterSpacing: '-0.01em' }}>Sehr gut bestanden</p>
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

      {/* FEATURED: LERNHELD */}
      <section style={{ background: F.bg, padding: mobil ? '70px 22px 50px' : '120px 56px 60px' }}>
        <div style={{ maxWidth: '1320px', margin: '0 auto' }}>
          <div style={{ marginBottom: mobil ? '36px' : '52px', maxWidth: '720px' }}>
            <span style={{ display: 'inline-block', fontSize: '12px', color: F.blue, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '14px', fontFamily: '"JetBrains Mono", monospace' }}>
              ⎯ Featured
            </span>
            <h2 style={{ fontFamily: SANS, fontSize: mobil ? '38px' : '56px', fontWeight: 800, color: F.ink, margin: '0 0 14px', letterSpacing: '-0.03em', lineHeight: 1.02 }}>
              Auf die Eins lernen.
            </h2>
            <p style={{ fontSize: mobil ? '16px' : '18px', color: F.inkSoft, margin: 0, lineHeight: 1.55, fontWeight: 400 }}>
              Mit dem Lernheld bekommst du in 3 Minuten einen persönlichen Plan für deine nächste Schulaufgabe.
            </p>
          </div>
          <a href="/lernheld" className="feature-card" style={{ display: 'block', textDecoration: 'none', borderRadius: '28px', overflow: 'hidden', background: F.navy, color: F.white, boxShadow: '0 12px 40px rgba(11,31,58,0.16)' }}>
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
                {/* Note-overlay */}
                <div style={{ position: 'absolute', top: mobil ? '24px' : '40px', right: mobil ? '24px' : '40px', background: F.white, color: F.ink, borderRadius: '14px', padding: '14px 20px', boxShadow: '0 20px 50px rgba(0,0,0,0.25)', display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: F.blueLight, color: F.blue, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 800 }}>
                    1
                  </div>
                  <div>
                    <p style={{ fontSize: '10.5px', color: F.inkSoft, margin: '0 0 2px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Klassenarbeit</p>
                    <p style={{ fontSize: '14px', color: F.ink, margin: 0, fontWeight: 700, letterSpacing: '-0.01em' }}>Sehr gut</p>
                  </div>
                </div>
              </div>
            </div>
          </a>
        </div>
      </section>

      {/* 3 BEREICHE - clean cards */}
      <section id="bereiche" style={{ background: F.bg, padding: mobil ? '50px 22px 80px' : '60px 56px 140px' }}>
        <div style={{ maxWidth: '1320px', margin: '0 auto' }}>
          <div style={{ marginBottom: mobil ? '32px' : '50px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <span style={{ display: 'inline-block', fontSize: '12px', color: F.blue, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '14px', fontFamily: '"JetBrains Mono", monospace' }}>
                ⎯ Drei weitere Bereiche
              </span>
              <h2 style={{ fontFamily: SANS, fontSize: mobil ? '34px' : '50px', fontWeight: 800, color: F.ink, margin: 0, letterSpacing: '-0.03em', lineHeight: 1.0 }}>
                Was du sonst noch hast.
              </h2>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: mobil ? '1fr' : 'repeat(3, 1fr)', gap: mobil ? '20px' : '24px' }}>
            <Karte
              href="/shop"
              label="Shop"
              titel="Lernmaterialien"
              sub="13 Lernpakete für Mathematik und Physik. Mit Erklärungen, Skizzen und Übungen."
              foto={FOTO.shop}
              preis="ab 0,99 €"
              mobil={mobil}
            />
            <Karte
              href="/lernplan"
              label="Kostenlos"
              titel="Mein Lernplan"
              sub="Stundenplan, Hausaufgaben und Lernblöcke. Übersichtlich aufs Handy."
              foto={FOTO.lernplan}
              preis="gratis"
              mobil={mobil}
            />
            <Karte
              href="/quiz"
              label="Kostenlos"
              titel="Quiz"
              sub="61 Themen für Klasse 1 bis 13. Jede Runde gibt es neue Fragen."
              foto={FOTO.quiz}
              preis="gratis"
              mobil={mobil}
            />
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
