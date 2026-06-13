'use client';
import { useEffect, useState } from 'react';

const F = {
  bg: '#fffdf8',
  bgSoft: '#fef6e8',
  bgWarm: '#fff8ee',
  bgCream: '#fef3dd',
  bgMint: '#E8F0FF',
  bgPeach: '#F0F5FF',
  bgSky: '#DBE7FF',
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
  coral: '#1769FF',
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
  { t: 'Brüche', sym: '¾', bg: '#dceffb', akzent: '#1769FF', fach: 'Mathe', klasse: 'Klasse 5 bis 7', preis: 'ab 0,99 €' },
  { t: 'Pythagoras', sym: 'c²', bg: '#fde4d4', akzent: '#cf4a40', fach: 'Mathe', klasse: 'Klasse 8 bis 10', preis: 'ab 1,99 €' },
  { t: 'Funktionen', sym: 'ƒ(x)', bg: '#e7f5ec', akzent: '#2e8a5c', fach: 'Mathe', klasse: 'Klasse 9 bis 11', preis: 'ab 1,99 €' },
  { t: 'Mechanik', sym: 'F=ma', bg: '#fef3dd', akzent: '#d99a36', fach: 'Physik', klasse: 'Klasse 7 bis 10', preis: 'ab 0,99 €' },
  { t: 'Optik', sym: '◐', bg: '#e7defb', akzent: '#7656b0', fach: 'Physik', klasse: 'Klasse 8 bis 10', preis: 'ab 0,99 €' },
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
        @keyframes formelDrift1 {
          0%, 100% { opacity: 0; transform: translate(-15px, 10px); }
          25%, 75% { opacity: 1; transform: translate(0, 0); }
        }
        @keyframes formelDrift2 {
          0%, 100% { opacity: 0; transform: translate(15px, -10px) scale(0.9); }
          30%, 70% { opacity: 1; transform: translate(0, 0) scale(1); }
        }
        @keyframes formelFloat {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(8px, -10px); }
          50% { transform: translate(-5px, -15px); }
          75% { transform: translate(-10px, 5px); }
        }
        .formel-a { animation: formelDrift1 12s ease-in-out infinite; transform-origin: center; }
        .formel-b { animation: formelDrift2 14s ease-in-out infinite; transform-origin: center; }
        .formel-c { animation: formelFloat 16s ease-in-out infinite; transform-origin: center; }
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
          box-shadow: 0 1px 2px rgba(23,105,255,0.10), 0 10px 28px rgba(23,105,255,0.30);
          font-family: ${SANS};
        }
        .btn-coral:hover { background: #1156DD; box-shadow: 0 1px 2px rgba(23,105,255,0.12), 0 16px 38px rgba(23,105,255,0.38); transform: translateY(-1px); }

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

      {/* HEADER - alle 4 bereiche sichtbar (auch mobil), quiz als haupt-cta */}
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: scrolled ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.85)', backdropFilter: 'saturate(180%) blur(20px)', borderBottom: scrolled ? `1px solid ${F.border}` : '1px solid transparent', padding: mobil ? '12px 16px' : '16px 56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all 0.3s ease', gap: '12px' }}>
        <a href="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
          <span style={{ fontSize: mobil ? '20px' : '26px', fontWeight: 800, color: F.ink, letterSpacing: '-0.025em' }}>
            Lern<span style={{ color: F.blue }}>flix</span>
          </span>
        </a>
        <nav style={{ display: 'flex', gap: mobil ? '4px' : '20px', alignItems: 'center', flexWrap: 'nowrap' }}>
          <a href="/shop" style={{ color: F.ink, textDecoration: 'none', fontSize: mobil ? '12px' : '14.5px', fontWeight: 600, padding: mobil ? '6px 6px' : '8px 12px', borderRadius: '8px' }}>{mobil ? 'Material' : 'Lernmaterialien'}</a>
          <a href="/lernplan" style={{ color: F.ink, textDecoration: 'none', fontSize: mobil ? '12px' : '14.5px', fontWeight: 600, padding: mobil ? '6px 6px' : '8px 12px', borderRadius: '8px' }}>{mobil ? 'Plan' : 'Lernplan'}</a>
          <a href="/lernheld" style={{ color: F.ink, textDecoration: 'none', fontSize: mobil ? '12px' : '14.5px', fontWeight: 600, padding: mobil ? '6px 6px' : '8px 12px', borderRadius: '8px' }}>{mobil ? 'Held' : 'Lernheld'}</a>
          <a href="/quiz" style={{ background: F.blue, color: F.white, textDecoration: 'none', fontSize: mobil ? '12.5px' : '14px', fontWeight: 700, padding: mobil ? '8px 14px' : '11px 22px', borderRadius: '10px', marginLeft: mobil ? '4px' : '8px', boxShadow: '0 6px 16px rgba(23,105,255,0.24)' }}>
            Quiz
          </a>
        </nav>
      </header>

      {/* HERO - fast weiss, kaum blau */}
      <section className="fade-up" style={{ background: '#ffffff', color: F.ink, paddingTop: mobil ? '110px' : '150px', paddingBottom: mobil ? '60px' : '110px', paddingLeft: mobil ? '20px' : '56px', paddingRight: mobil ? '20px' : '56px', position: 'relative', overflow: 'hidden' }}>
        {/* Math-grid pattern wie kariertes papier - sehr dezent */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(23,105,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(23,105,255,0.07) 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />
        {/* Gradient-blobs - viel dezenter */}
        {!mobil && (
          <>
            <div style={{ position: 'absolute', top: '15%', right: '5%', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(23,105,255,0.10) 0%, rgba(167,139,250,0.05) 35%, transparent 70%)', pointerEvents: 'none', filter: 'blur(40px)' }} />
            <div style={{ position: 'absolute', bottom: '-150px', left: '20%', width: '550px', height: '550px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(167,139,250,0.10) 0%, transparent 70%)', pointerEvents: 'none', filter: 'blur(60px)' }} />
          </>
        )}
        {/* Mid-size formel-pattern - links schwach (text bereich), rechts mehr (um die buecher rum, NICHT drauf) */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', opacity: mobil ? 0.06 : 0.10 }} preserveAspectRatio="xMidYMid slice" viewBox="0 0 1600 900">
          {/* LINKS - dezent, hinter text */}
          <g opacity="0.45">
            <text className="formel-a" style={{animationDelay: '-0.0s'}} x="20" y="240" fontFamily="Inter, sans-serif" fontSize="32" fontWeight="800" fontStyle="italic" fill="#1769FF">a² + b²</text>
            <text className="formel-c" style={{animationDelay: '-2.1s'}} x="15" y="400" fontFamily="Inter, sans-serif" fontSize="30" fontWeight="800" fontStyle="italic" fill="#7656b0">v = s / t</text>
            <text className="formel-b" style={{animationDelay: '-4.2s'}} x="25" y="560" fontFamily="Inter, sans-serif" fontSize="28" fontWeight="800" fontStyle="italic" fill="#1769FF">P · I</text>
            <text className="formel-a" style={{animationDelay: '-6.3s'}} x="30" y="720" fontFamily="Inter, sans-serif" fontSize="32" fontWeight="800" fontStyle="italic" fill="#1769FF">15% von 80</text>
            <text className="formel-c" style={{animationDelay: '-8.4s'}} x="40" y="860" fontFamily="Inter, sans-serif" fontSize="32" fontWeight="800" fontStyle="italic" fill="#7656b0">log₂ 8</text>
            <text className="formel-b" style={{animationDelay: '-1.4s'}} x="280" y="800" fontFamily="Inter, sans-serif" fontSize="28" fontWeight="800" fontStyle="italic" fill="#1769FF">√25 = 5</text>
            <text className="formel-a" style={{animationDelay: '-3.5s'}} x="480" y="860" fontFamily="Inter, sans-serif" fontSize="30" fontWeight="800" fontStyle="italic" fill="#1769FF">π · r²</text>
            <text className="formel-c" style={{animationDelay: '-5.6s'}} x="680" y="820" fontFamily="Inter, sans-serif" fontSize="28" fontWeight="800" fontStyle="italic" fill="#7656b0">3/4 + 1/2</text>
          </g>
          {/* RECHTS - mehr formeln um die buecher rum (NICHT drauf) */}
          <g opacity="1">
            {/* OBEN ueber den buechern */}
            <text className="formel-c" style={{animationDelay: '-0.5s'}} x="900" y="160" fontFamily="Inter, sans-serif" fontSize="34" fontWeight="800" fontStyle="italic" fill="#1769FF">∫ x dx</text>
            <text className="formel-a" style={{animationDelay: '-1.9s'}} x="1080" y="135" fontFamily="Inter, sans-serif" fontSize="30" fontWeight="800" fontStyle="italic" fill="#7656b0">π · r²</text>
            <text className="formel-b" style={{animationDelay: '-3.2s'}} x="1240" y="165" fontFamily="Inter, sans-serif" fontSize="32" fontWeight="800" fontStyle="italic" fill="#1769FF">sin α</text>
            <text className="formel-c" style={{animationDelay: '-4.6s'}} x="1410" y="140" fontFamily="Inter, sans-serif" fontSize="28" fontWeight="800" fontStyle="italic" fill="#1769FF">√25</text>
            <text className="formel-a" style={{animationDelay: '-6.0s'}} x="1530" y="200" fontFamily="Inter, sans-serif" fontSize="26" fontWeight="800" fontStyle="italic" fill="#7656b0">f(x)</text>
            {/* RECHTS NEBEN den buechern */}
            <text className="formel-b" style={{animationDelay: '-7.4s'}} x="1505" y="290" fontFamily="Inter, sans-serif" fontSize="32" fontWeight="800" fontStyle="italic" fill="#1769FF">cos β</text>
            <text className="formel-c" style={{animationDelay: '-8.8s'}} x="1515" y="380" fontFamily="Inter, sans-serif" fontSize="30" fontWeight="800" fontStyle="italic" fill="#7656b0">tan γ</text>
            <text className="formel-a" style={{animationDelay: '-10.2s'}} x="1500" y="470" fontFamily="Inter, sans-serif" fontSize="34" fontWeight="800" fontStyle="italic" fill="#1769FF">e^x</text>
            <text className="formel-b" style={{animationDelay: '-11.6s'}} x="1510" y="560" fontFamily="Inter, sans-serif" fontSize="32" fontWeight="800" fontStyle="italic" fill="#1769FF">∑ aᵢ</text>
            <text className="formel-c" style={{animationDelay: '-1.0s'}} x="1505" y="650" fontFamily="Inter, sans-serif" fontSize="30" fontWeight="800" fontStyle="italic" fill="#7656b0">log x</text>
            {/* UNTEN unter den buechern */}
            <text className="formel-a" style={{animationDelay: '-2.4s'}} x="900" y="800" fontFamily="Inter, sans-serif" fontSize="36" fontWeight="800" fontStyle="italic" fill="#1769FF">F = m · a</text>
            <text className="formel-b" style={{animationDelay: '-3.8s'}} x="1110" y="830" fontFamily="Inter, sans-serif" fontSize="32" fontWeight="800" fontStyle="italic" fill="#1769FF">E = mc²</text>
            <text className="formel-c" style={{animationDelay: '-5.2s'}} x="1290" y="800" fontFamily="Inter, sans-serif" fontSize="30" fontWeight="800" fontStyle="italic" fill="#7656b0">2π · f</text>
            <text className="formel-a" style={{animationDelay: '-6.6s'}} x="1450" y="830" fontFamily="Inter, sans-serif" fontSize="28" fontWeight="800" fontStyle="italic" fill="#1769FF">v = λ · f</text>
            <text className="formel-b" style={{animationDelay: '-8.0s'}} x="930" y="870" fontFamily="Inter, sans-serif" fontSize="28" fontWeight="800" fontStyle="italic" fill="#1769FF">U = R · I</text>
            <text className="formel-c" style={{animationDelay: '-9.4s'}} x="1230" y="875" fontFamily="Inter, sans-serif" fontSize="32" fontWeight="800" fontStyle="italic" fill="#7656b0">Δx · Δp</text>
          </g>
        </svg>

        <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', display: 'grid', gridTemplateColumns: mobil ? '1fr' : '1fr 1.1fr', gap: mobil ? '24px' : '40px', alignItems: 'center', padding: mobil ? '8px 0 0' : '20px 0' }}>
          {/* Links/oben: text */}
          <div style={{ textAlign: mobil ? 'center' : 'left' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: F.white, color: F.blue, padding: '10px 20px', borderRadius: '999px', fontSize: mobil ? '13px' : '14px', fontWeight: 800, marginBottom: mobil ? '20px' : '28px', boxShadow: '0 12px 30px rgba(23,105,255,0.18), 0 4px 10px rgba(23,105,255,0.08)', border: `2px solid ${F.blueLight}` }}>
              <span className="pulse-dot" style={{ width: '9px', height: '9px', borderRadius: '50%', background: F.blue, boxShadow: '0 0 12px rgba(23,105,255,0.8)' }} />
              Klasse 1 bis 13 · Mathe + Physik
            </span>
            <h1 style={{ fontFamily: SANS, fontSize: mobil ? '38px' : '64px', fontWeight: 800, lineHeight: mobil ? 1.1 : 1.05, margin: '0 0 18px', color: F.ink, letterSpacing: '-0.025em', position: 'relative', display: 'inline-block' }}>
              Die Lernplattform<br />für <span style={{ color: F.blue, whiteSpace: 'nowrap', position: 'relative' }}>
                Mathe und Physik
                <svg style={{ position: 'absolute', left: 0, right: 0, bottom: '-8px', width: '100%', height: '14px' }} viewBox="0 0 400 14" preserveAspectRatio="none">
                  <path d="M 5 8 Q 100 2, 200 7 T 395 8" stroke="rgba(255,180,90,0.85)" strokeWidth="5" fill="none" strokeLinecap="round" />
                </svg>
              </span>.
            </h1>
            <p style={{ fontSize: mobil ? '16px' : '20px', color: F.inkSoft, lineHeight: 1.55, margin: mobil ? '0 auto 24px' : '0 0 32px', maxWidth: '520px', fontWeight: 400 }}>
              Lernpakete im Shop, dein Lernplan, ein kostenloses Quiz und der Lernheld für die nächste Schulaufgabe.
            </p>
            <div style={{ display: 'flex', gap: mobil ? '10px' : '12px', flexWrap: 'wrap', marginBottom: mobil ? '18px' : '24px', justifyContent: mobil ? 'center' : 'flex-start' }}>
              <a href="/shop" style={{ background: F.blue, color: F.white, textDecoration: 'none', padding: mobil ? '15px 28px' : '17px 38px', borderRadius: '12px', fontSize: mobil ? '15px' : '16px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '8px', boxShadow: '0 10px 28px rgba(23,105,255,0.28)', flex: mobil ? '1 1 auto' : '0 0 auto', justifyContent: 'center', minWidth: mobil ? '140px' : 'auto' }}>
                Loslegen <span style={{ fontSize: '18px' }}>→</span>
              </a>
              <a href="/quiz" style={{ background: F.white, color: F.ink, textDecoration: 'none', padding: mobil ? '15px 28px' : '17px 38px', borderRadius: '12px', fontSize: mobil ? '15px' : '16px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '8px', border: `1.5px solid ${F.border}`, flex: mobil ? '1 1 auto' : '0 0 auto', justifyContent: 'center', minWidth: mobil ? '140px' : 'auto' }}>
                Quiz starten
              </a>
            </div>
            <div style={{ display: 'flex', gap: mobil ? '10px' : '24px', flexWrap: 'wrap', fontSize: mobil ? '12.5px' : '13.5px', color: F.inkSoft, fontWeight: 500, justifyContent: mobil ? 'center' : 'flex-start' }}>
              <span><strong style={{ color: F.ink, fontWeight: 800 }}>13</strong> Lernpakete</span>
              <span style={{ color: F.inkMuted }}>·</span>
              <span><strong style={{ color: F.ink, fontWeight: 800 }}>61</strong> Quiz-Themen</span>
              <span style={{ color: F.inkMuted }}>·</span>
              <span><strong style={{ color: F.ink, fontWeight: 800 }}>ab 0,99 €</strong></span>
            </div>
          </div>

          {/* Foto - mathe + physik buecher (1145x1028 hochaufloesend) */}
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: mobil ? 'auto' : '500px', marginTop: mobil ? '8px' : 0 }}>
            <img
              src="/20260613_173033176_iOS.png"
              alt="Lachende Mathe- und Physik-Buecher umarmen sich"
              style={{
                width: '100%',
                maxWidth: mobil ? '380px' : '620px',
                height: 'auto',
                objectFit: 'contain',
              }}
            />
          </div>
        </div>
      </section>

      {/* TRUST STRIP - premium card mit schatten + trennlinien */}
      <section style={{ background: F.white, padding: mobil ? '24px 22px 40px' : '20px 56px 70px', position: 'relative' }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto', background: F.white, borderRadius: '20px', boxShadow: '0 20px 50px rgba(15,23,42,0.08), 0 4px 16px rgba(15,23,42,0.04)', border: `1px solid ${F.borderSoft}`, padding: mobil ? '28px 24px' : '32px 48px', display: 'grid', gridTemplateColumns: mobil ? '1fr' : 'repeat(3, 1fr)', gap: 0 }}>
          {[
            { num: '13', t: 'Lernpakete', sub: 'Mathe + Physik · ab 0,99 €' },
            { num: '61', t: 'Quiz-Themen', sub: 'Kostenlos · jede Runde neu' },
            { num: '1 bis 13', t: 'Klassenstufen', sub: 'Von Grundschule bis Abitur' },
          ].map((t, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '18px', padding: mobil ? '14px 0' : '6px 24px', borderRight: !mobil && i < 2 ? `1px solid ${F.borderSoft}` : 'none', borderBottom: mobil && i < 2 ? `1px solid ${F.borderSoft}` : 'none', justifyContent: mobil ? 'flex-start' : 'center' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: F.bgSky, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <path d="M6 11L9.5 14.5L16 8" stroke={F.blue} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <p style={{ fontSize: '20px', color: F.ink, fontWeight: 800, margin: '0 0 3px', letterSpacing: '-0.015em', lineHeight: 1.1 }}>
                  <span style={{ color: F.blue }}>{t.num}</span> {t.t}
                </p>
                <p style={{ fontSize: '13.5px', color: F.inkSoft, margin: 0, fontWeight: 500 }}>{t.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* SHOP - FEATURED (gross, wichtigster bereich) */}
      <section id="bereiche" style={{ background: '#ffffff', padding: mobil ? '70px 22px 40px' : '120px 56px 50px', position: 'relative' }}>
        {/* Karierte papier textur - sehr dezent */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(23,105,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(23,105,255,0.07) 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />
        <div style={{ maxWidth: '1320px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ marginBottom: mobil ? '36px' : '52px', maxWidth: '720px' }}>
            <span style={{ display: 'inline-block', fontSize: '13px', color: F.coral, fontWeight: 700, marginBottom: '14px' }}>
              13 Lernpakete · ab 0,99 €
            </span>
            <h2 style={{ fontFamily: SANS, fontSize: mobil ? '38px' : '56px', fontWeight: 800, color: F.ink, margin: '0 0 14px', letterSpacing: '-0.03em', lineHeight: 1.02 }}>
              Lernmaterialien.
            </h2>
            <p style={{ fontSize: mobil ? '16px' : '18px', color: F.inkSoft, margin: 0, lineHeight: 1.55, fontWeight: 400 }}>
              Lernpakete für Mathe und Physik. Mit Erklärungen, Skizzen und Übungen.
            </p>
          </div>
          <a href="/shop" className="feature" style={{ display: 'block', textDecoration: 'none', borderRadius: '32px', overflow: 'hidden', background: F.white, color: F.ink, boxShadow: '0 16px 50px rgba(15,23,42,0.08)', border: `1px solid ${F.border}`, padding: mobil ? '40px 28px' : '64px 72px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: mobil ? '1fr' : '1.2fr 1fr', gap: mobil ? '32px' : '60px', alignItems: 'center' }}>
              <div>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: F.bgSky, color: F.coral, padding: '7px 14px', borderRadius: '999px', fontSize: '12px', fontWeight: 700, marginBottom: '24px' }}>
                  Shop
                </span>
                <h3 style={{ fontFamily: SANS, fontSize: mobil ? '40px' : '64px', fontWeight: 800, color: F.ink, margin: '0 0 18px', lineHeight: 0.98, letterSpacing: '-0.035em' }}>
                  13 Lernpakete.
                </h3>
                <p style={{ fontSize: mobil ? '16px' : '18px', color: F.inkSoft, margin: '0 0 28px', lineHeight: 1.55, maxWidth: '520px' }}>
                  Komplette Lernpakete für Mathe und Physik. Jedes mit Erklärungen, Skizzen und Übungen mit Lösungen. Direkt am Handy lesbar oder als PDF ausdrucken.
                </p>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: F.coral, color: F.white, padding: '15px 28px', borderRadius: '14px', fontSize: '15px', fontWeight: 700, boxShadow: '0 8px 24px rgba(23,105,255,0.30)' }}>
                  Pakete ansehen
                  <span style={{ fontSize: '16px' }}>→</span>
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {['Mathematik: 8 Pakete (Brüche, Geometrie, Funktionen)', 'Physik: 5 Pakete (Mechanik, Optik, Elektrizität)', 'Sofort verfügbar ab 0,99 €'].map((t, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', padding: '14px 18px', background: F.bgSky, borderRadius: '14px' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: F.coral, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M3 7L6 10L11 4" stroke={F.white} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <span style={{ fontSize: '14.5px', color: F.ink, fontWeight: 600, lineHeight: 1.5 }}>{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </a>
        </div>
      </section>

      {/* 3 GLIEDER: Lernheld / Lernplan / Quiz - gleich gross */}
      <section style={{ background: '#ffffff', padding: mobil ? '40px 22px 80px' : '50px 56px 130px', position: 'relative' }}>
        {/* Karierte papier textur - sehr dezent */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(23,105,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(23,105,255,0.07) 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />
        <div style={{ maxWidth: '1320px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ marginBottom: mobil ? '32px' : '50px', maxWidth: '720px' }}>
            <span style={{ display: 'inline-block', fontSize: '13px', color: F.blue, fontWeight: 700, marginBottom: '14px' }}>
              Auch dabei
            </span>
            <h2 style={{ fontFamily: SANS, fontSize: mobil ? '34px' : '50px', fontWeight: 800, color: F.ink, margin: 0, letterSpacing: '-0.03em', lineHeight: 1.0 }}>
              Lernheld, Lernplan und Quiz.
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: mobil ? '1fr' : 'repeat(3, 1fr)', gap: mobil ? '20px' : '28px' }}>
            <Glied
              href="/lernheld"
              foto={FOTO.lernheld}
              label="Premium · 1,99 €"
              titel="Lernheld"
              sub="Foto vom Stoff hochladen, Klasse wählen, fertig. Dein Plan für die Schulaufgabe in 3 Minuten."
              farbe={F.bgPeach}
              mobil={mobil}
            />
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
              farbe={F.bgSky}
              mobil={mobil}
            />
          </div>
        </div>
      </section>

      {/* CTA Banner - fast weiss, dezent */}
      <section style={{ background: '#ffffff', color: F.ink, padding: mobil ? '60px 22px' : '100px 56px', position: 'relative', overflow: 'hidden' }}>
        {/* Karierte papier textur - sehr dezent */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(23,105,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(23,105,255,0.07) 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />
        {!mobil && (
          <>
            <div style={{ position: 'absolute', top: '20px', right: '5%', width: '260px', height: '260px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(23,105,255,0.07) 0%, transparent 70%)', pointerEvents: 'none', filter: 'blur(40px)' }} />
            <div style={{ position: 'absolute', bottom: '20px', left: '5%', width: '240px', height: '240px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(167,139,250,0.08) 0%, transparent 70%)', pointerEvents: 'none', filter: 'blur(40px)' }} />
          </>
        )}
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
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
                Die Lernplattform für Mathematik und Physik. Klasse 1 bis 13.
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

function Glied({ href, label, titel, sub, farbe, gross, mobil }: { href: string; foto?: string; label: string; titel: string; sub: string; farbe: string; gross?: boolean; mobil: boolean }) {
  const F2 = { ink: '#0F172A', inkSoft: '#475569', border: 'rgba(15,23,42,0.08)', blue: '#1769FF', white: '#fff' };
  // Icon je nach titel auswaehlen
  const icon = (() => {
    if (titel.toLowerCase().includes('lernheld')) return (
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
        <path d="M22 6 L36 11 V22 C36 30 30 36 22 39 C14 36 8 30 8 22 V11 Z" stroke={F2.ink} strokeWidth="2.5" strokeLinejoin="round" fill="none" />
        <path d="M22 16 L24.5 21 L30 21.5 L26 25 L27 30 L22 27.5 L17 30 L18 25 L14 21.5 L19.5 21 Z" fill={F2.ink} />
      </svg>
    );
    if (titel.toLowerCase().includes('lernplan')) return (
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
        <rect x="7" y="9" width="30" height="28" rx="3" stroke={F2.ink} strokeWidth="2.5" fill="none" />
        <path d="M7 17 L37 17" stroke={F2.ink} strokeWidth="2.5" />
        <path d="M14 5 V13 M30 5 V13" stroke={F2.ink} strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="15" cy="24" r="1.6" fill={F2.ink} />
        <circle cx="22" cy="24" r="1.6" fill={F2.ink} />
        <circle cx="29" cy="24" r="1.6" fill={F2.ink} />
        <circle cx="15" cy="30" r="1.6" fill={F2.ink} />
        <circle cx="22" cy="30" r="1.6" fill={F2.ink} />
      </svg>
    );
    if (titel.toLowerCase().includes('quiz')) return (
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
        <circle cx="22" cy="22" r="16" stroke={F2.ink} strokeWidth="2.5" fill="none" />
        <path d="M17 17C17 14 19 12 22 12C25 12 27 14 27 17C27 20 23 21 23 25" stroke={F2.ink} strokeWidth="2.8" strokeLinecap="round" fill="none" />
        <circle cx="23" cy="31" r="1.8" fill={F2.ink} />
      </svg>
    );
    // shop default
    return (
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
        <rect x="8" y="8" width="11" height="28" rx="2" stroke={F2.ink} strokeWidth="2.5" fill="none" />
        <rect x="22" y="8" width="11" height="28" rx="2" stroke={F2.ink} strokeWidth="2.5" fill="none" />
      </svg>
    );
  })();

  return (
    <a href={href} className="glied-card" style={{ display: 'flex', flexDirection: 'column', background: farbe, border: `1px solid ${F2.border}`, borderRadius: '24px', overflow: 'hidden', textDecoration: 'none', color: F2.ink, height: '100%', padding: mobil ? '28px 24px' : '32px 28px', minHeight: gross ? 'auto' : (mobil ? '220px' : '280px') }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: mobil ? '18px' : '24px' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: F2.white, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 16px rgba(15,23,42,0.08)' }}>
          {icon}
        </div>
        <span style={{ background: F2.white, color: F2.ink, padding: '6px 12px', borderRadius: '999px', fontSize: '11.5px', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          {label}
        </span>
      </div>
      <h3 style={{ fontFamily: SANS, fontSize: mobil ? '26px' : '30px', fontWeight: 800, margin: '0 0 8px', letterSpacing: '-0.025em', lineHeight: 1.05, color: F2.ink }}>{titel}</h3>
      <p style={{ fontSize: '14.5px', color: F2.inkSoft, lineHeight: 1.55, margin: '0 0 20px', flex: 1 }}>{sub}</p>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '14.5px', fontWeight: 800, color: F2.ink, marginTop: 'auto' }}>
        Öffnen <span className="glied-arrow" style={{ fontSize: '17px' }}>→</span>
      </span>
    </a>
  );
}
