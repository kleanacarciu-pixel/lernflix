'use client';
import { useEffect, useState } from 'react';

const F = {
  bg: '#ffffff',
  bgSoft: '#f7f8fa',
  bgWarm: '#fff8ee',
  ink: '#0a0a0c',
  inkSoft: '#52525b',
  inkMuted: '#94a3b8',
  border: '#e2e8f0',
  borderSoft: '#eef2f6',
  blue: '#1769FF',
  blueDeep: '#1156DD',
  blueLight: '#E8F0FF',
  navy: '#0B1F3A',
  navyDark: '#08182C',
  green: '#10B981',
  coral: '#ff5b4a',
  white: '#ffffff',
  yellow: '#FFCB45',
};
const SANS = '"Inter", -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';

const THEMEN: Record<number, { mathe: string[]; physik: string[] }> = {
  1: { mathe: ['Zahlen bis 20', 'Plus & Minus', 'Formen'], physik: [] },
  2: { mathe: ['Bis 100', 'Mal & Geteilt', 'Geld'], physik: [] },
  3: { mathe: ['Bis 1000', 'Schriftlich rechnen', 'Längen'], physik: [] },
  4: { mathe: ['Bis 1.000.000', 'Brüche-Start', 'Geometrie'], physik: [] },
  5: { mathe: ['Brüche', 'Dezimalzahlen', 'Flächen'], physik: ['Licht & Schatten'] },
  6: { mathe: ['Brüche-Rechnen', 'Prozent', 'Winkel'], physik: ['Stromkreise'] },
  7: { mathe: ['Terme', 'Gleichungen', 'Geometrie'], physik: ['Bewegung', 'Kraft'] },
  8: { mathe: ['Lineare Funktionen', 'Pythagoras', 'Wahrscheinlichkeit'], physik: ['Mechanik', 'Optik'] },
  9: { mathe: ['Quadratische Gleichungen', 'Trigonometrie'], physik: ['Elektrizität', 'Energie'] },
  10: { mathe: ['Funktionen vertieft', 'Stochastik'], physik: ['Atomphysik', 'Wellen'] },
  11: { mathe: ['Analysis-Start', 'Ableitungen', 'Vektoren'], physik: ['Mechanik vertieft'] },
  12: { mathe: ['Integralrechnung', 'Stochastik'], physik: ['E-Lehre', 'Quanten'] },
  13: { mathe: ['Abi-Vorbereitung', 'Klausuren'], physik: ['Abi-Vorbereitung'] },
};

export default function Home() {
  const [breite, setBreite] = useState(1200);
  const [scrolled, setScrolled] = useState(false);
  const [klasse, setKlasse] = useState<number>(7);

  useEffect(() => {
    const onResize = () => setBreite(window.innerWidth);
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onScroll);
    onResize();
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const mobil = breite < 768;
  const klassen = Array.from({ length: 13 }, (_, i) => i + 1);
  const t = THEMEN[klasse];

  return (
    <main style={{ minHeight: '100vh', background: F.bg, fontFamily: SANS, color: F.ink, overflowX: 'hidden' }}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@500&display=swap" />

      <style>{`
        * { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
        body { background: ${F.bg}; margin: 0; font-family: ${SANS}; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) both; }

        .btn-primary {
          background: ${F.blue}; color: ${F.white};
          padding: 14px 28px; border-radius: 12px;
          font-size: 15px; font-weight: 600; letter-spacing: -0.005em;
          display: inline-flex; align-items: center; gap: 8px;
          text-decoration: none; border: none; cursor: pointer;
          transition: background 0.2s ease, transform 0.15s ease;
          box-shadow: 0 8px 24px rgba(23,105,255,0.20);
          font-family: ${SANS};
        }
        .btn-primary:hover { background: ${F.blueDeep}; transform: translateY(-1px); }

        .btn-ghost {
          background: ${F.bg}; color: ${F.ink};
          padding: 14px 28px; border-radius: 12px;
          font-size: 15px; font-weight: 600;
          display: inline-flex; align-items: center; gap: 8px;
          text-decoration: none; border: 1.5px solid ${F.border};
          transition: all 0.2s ease;
        }
        .btn-ghost:hover { border-color: ${F.ink}; }

        .nav-link {
          color: ${F.ink}; text-decoration: none;
          font-size: 14.5px; font-weight: 600;
          padding: 8px 14px; border-radius: 8px;
          transition: background 0.15s ease;
        }
        .nav-link:hover { background: ${F.bgSoft}; }

        .klasse-btn { transition: all 0.18s ease; cursor: pointer; }
        .klasse-btn:hover { transform: translateY(-2px); }
        .klasse-btn:active { transform: translateY(0); }

        .service-card { transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease; }
        .service-card:hover { transform: translateY(-3px); border-color: ${F.blue}; box-shadow: 0 16px 36px rgba(23,105,255,0.10); }
        .service-card:hover .svc-arrow { transform: translateX(5px); color: ${F.blue}; }
        .svc-arrow { transition: transform 0.25s ease, color 0.25s ease; display: inline-block; }
      `}</style>

      {/* HEADER - klar, navigation gross sichtbar */}
      <header style={{ position: 'sticky', top: 0, zIndex: 100, background: scrolled ? 'rgba(255,255,255,0.94)' : F.bg, backdropFilter: scrolled ? 'saturate(180%) blur(20px)' : 'none', borderBottom: `1px solid ${F.border}`, padding: mobil ? '14px 22px' : '16px 56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'background 0.2s ease' }}>
        <a href="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontSize: mobil ? '24px' : '26px', fontWeight: 800, color: F.ink, letterSpacing: '-0.025em' }}>
            Lern<span style={{ color: F.blue }}>flix</span>
          </span>
        </a>
        <nav style={{ display: 'flex', gap: mobil ? '4px' : '8px', alignItems: 'center' }}>
          {!mobil && (
            <>
              <a href="/shop" className="nav-link">Lernmaterialien</a>
              <a href="/lernplan" className="nav-link">Lernplan</a>
              <a href="/lernheld" className="nav-link">Lernheld</a>
              <a href="/quiz" className="nav-link">Quiz</a>
            </>
          )}
          <a href="/lernheld" className="btn-primary" style={{ padding: '10px 18px', fontSize: '13.5px', marginLeft: mobil ? '0' : '8px' }}>
            Loslegen
          </a>
        </nav>
      </header>

      {/* HERO - Sofatutor-style: headline + klassen-selektor zentral */}
      <section className="fade-up" style={{ padding: mobil ? '50px 22px 30px' : '80px 56px 50px', background: F.bgWarm }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto', textAlign: 'center' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: F.bg, border: `1px solid ${F.border}`, color: F.inkSoft, padding: '7px 14px', borderRadius: '999px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.04em', marginBottom: '24px', fontFamily: '"JetBrains Mono", monospace' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: F.green }} />
            DIE LERN-PLATTFORM
          </span>
          <h1 style={{ fontFamily: SANS, fontSize: mobil ? '40px' : '68px', fontWeight: 800, lineHeight: 1.0, margin: '0 0 18px', color: F.ink, letterSpacing: '-0.035em' }}>
            Mathe und Physik.<br />
            <span style={{ color: F.blue }}>Klasse 1 bis 13.</span>
          </h1>
          <p style={{ fontSize: mobil ? '16px' : '18px', color: F.inkSoft, lineHeight: 1.55, margin: '0 auto 36px', maxWidth: '560px', fontWeight: 400 }}>
            Lernmaterialien, Lernplan, Quiz und der Lernheld für die Schulaufgabe. Such dir deine Klasse aus.
          </p>

          {/* Klassen-Picker */}
          <div style={{ display: 'grid', gridTemplateColumns: mobil ? 'repeat(7, 1fr)' : 'repeat(13, 1fr)', gap: mobil ? '6px' : '8px', maxWidth: '900px', margin: '0 auto 24px' }}>
            {klassen.map((n) => (
              <button
                key={n}
                onClick={() => setKlasse(n)}
                className="klasse-btn"
                style={{
                  aspectRatio: '1 / 1',
                  background: klasse === n ? F.navy : F.bg,
                  color: klasse === n ? F.white : F.ink,
                  border: `1.5px solid ${klasse === n ? F.navy : F.border}`,
                  borderRadius: '12px',
                  fontFamily: SANS,
                  fontSize: mobil ? '15px' : '20px',
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  padding: 0,
                  boxShadow: klasse === n ? '0 8px 20px rgba(11,31,58,0.20)' : 'none',
                }}
              >
                {n}
              </button>
            ))}
          </div>
          <p style={{ fontSize: '13px', color: F.inkMuted, margin: '0 0 28px', fontWeight: 600, fontFamily: '"JetBrains Mono", monospace', letterSpacing: '0.06em' }}>
            ↑ KLASSE AUSWÄHLEN
          </p>

          {/* Themen-Anzeige für gewählte Klasse */}
          <div style={{ background: F.bg, border: `1px solid ${F.border}`, borderRadius: '20px', padding: mobil ? '22px 18px' : '28px 36px', maxWidth: '860px', margin: '0 auto', textAlign: 'left', boxShadow: '0 4px 16px rgba(15,23,42,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
              <span style={{ fontSize: '12px', color: F.blue, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: '"JetBrains Mono", monospace' }}>
                Klasse {klasse} · Themen
              </span>
              <a href="/shop" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13.5px', fontWeight: 700, color: F.ink, textDecoration: 'none' }}>
                Alle Lernpakete <span style={{ fontSize: '15px' }}>→</span>
              </a>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: mobil || t.physik.length === 0 ? '1fr' : '1fr 1fr', gap: mobil ? '18px' : '32px' }}>
              <div>
                <p style={{ fontSize: '11px', color: F.inkMuted, fontWeight: 700, margin: '0 0 10px', letterSpacing: '0.10em', textTransform: 'uppercase' }}>Mathematik</p>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {t.mathe.map((th, i) => (
                    <span key={i} style={{ background: F.bgSoft, padding: '7px 14px', borderRadius: '999px', fontSize: '13px', fontWeight: 600, color: F.ink }}>{th}</span>
                  ))}
                </div>
              </div>
              {t.physik.length > 0 && (
                <div>
                  <p style={{ fontSize: '11px', color: F.inkMuted, fontWeight: 700, margin: '0 0 10px', letterSpacing: '0.10em', textTransform: 'uppercase' }}>Physik</p>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {t.physik.map((th, i) => (
                      <span key={i} style={{ background: F.bgSoft, padding: '7px 14px', borderRadius: '999px', fontSize: '13px', fontWeight: 600, color: F.ink }}>{th}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 4 BEREICHE - Sofatutor-style kacheln, klar erkennbar */}
      <section style={{ background: F.bg, padding: mobil ? '50px 22px' : '90px 56px' }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: mobil ? '32px' : '52px' }}>
            <span style={{ display: 'inline-block', fontSize: '12px', color: F.blue, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '12px', fontFamily: '"JetBrains Mono", monospace' }}>
              Was du bekommst
            </span>
            <h2 style={{ fontFamily: SANS, fontSize: mobil ? '34px' : '48px', fontWeight: 800, color: F.ink, margin: 0, letterSpacing: '-0.03em', lineHeight: 1.05 }}>
              Vier Bereiche, alles dabei.
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: mobil ? '1fr 1fr' : 'repeat(4, 1fr)', gap: mobil ? '12px' : '20px' }}>
            <Service
              href="/shop"
              icon={(
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                  <rect x="5" y="6" width="9" height="24" rx="1.5" stroke={F.blue} strokeWidth="2" />
                  <rect x="16" y="6" width="9" height="24" rx="1.5" stroke={F.blue} strokeWidth="2" />
                  <rect x="27" y="10" width="5" height="20" rx="1.5" stroke={F.blue} strokeWidth="2" />
                </svg>
              )}
              titel="Lernmaterialien"
              sub="13 Pakete, ab 0,99 €"
              farbe={F.blueLight}
            />
            <Service
              href="/lernplan"
              icon={(
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                  <rect x="5" y="7" width="26" height="24" rx="3" stroke={F.green} strokeWidth="2" />
                  <path d="M5 13 L31 13" stroke={F.green} strokeWidth="2" />
                  <path d="M10 4 L10 10 M26 4 L26 10" stroke={F.green} strokeWidth="2" strokeLinecap="round" />
                  <circle cx="13" cy="19" r="2" fill={F.green} />
                  <circle cx="20" cy="19" r="2" fill={F.green} />
                  <circle cx="13" cy="25" r="2" fill={F.green} opacity="0.4" />
                </svg>
              )}
              titel="Lernplan"
              sub="Wöchentlicher Plan"
              farbe="#e8f7f0"
            />
            <Service
              href="/lernheld"
              icon={(
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                  <path d="M18 4 L29 8 V18 C29 24 24 29 18 31 C12 29 7 24 7 18 V8 Z" stroke={F.coral} strokeWidth="2" strokeLinejoin="round" />
                  <path d="M18 14 L20 18 L24 18 L21 21 L22 25 L18 23 L14 25 L15 21 L12 18 L16 18 Z" fill={F.coral} />
                </svg>
              )}
              titel="Lernheld"
              sub="Premium · 1,99 €"
              farbe="#ffefec"
              akzent
            />
            <Service
              href="/quiz"
              icon={(
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                  <circle cx="18" cy="18" r="13" stroke="#d99a36" strokeWidth="2" />
                  <path d="M14 14.5C14 12 16 10.5 18 10.5C20 10.5 22 12 22 14.5C22 16.5 19.5 17.5 19.5 19.5" stroke="#d99a36" strokeWidth="2.2" strokeLinecap="round" />
                  <circle cx="19.5" cy="24" r="1.4" fill="#d99a36" />
                </svg>
              )}
              titel="Quiz"
              sub="61 Themen, gratis"
              farbe="#fff5dc"
            />
          </div>
        </div>
      </section>

      {/* CTA + FOOTER zusammen, kompakt */}
      <footer style={{ background: F.navyDark, color: F.white, padding: mobil ? '50px 22px 30px' : '70px 56px 36px' }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: mobil ? '40px' : '56px' }}>
            <h2 style={{ fontFamily: SANS, fontSize: mobil ? '32px' : '48px', fontWeight: 800, color: F.white, margin: '0 0 14px', letterSpacing: '-0.03em', lineHeight: 1.05 }}>
              Bereit für deine <span style={{ color: F.blue }}>Eins</span>?
            </h2>
            <p style={{ fontSize: mobil ? '15.5px' : '17px', color: 'rgba(255,255,255,0.65)', margin: '0 auto 28px', maxWidth: '480px', fontWeight: 400, lineHeight: 1.5 }}>
              Schau dir die Lernmaterialien an oder lass dir einen Plan erstellen.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="/lernheld" className="btn-primary">Lernheld starten <span style={{ fontSize: '16px' }}>→</span></a>
              <a href="/shop" style={{ background: 'rgba(255,255,255,0.06)', color: F.white, textDecoration: 'none', padding: '14px 28px', borderRadius: '12px', fontSize: '15px', fontWeight: 600, border: '1px solid rgba(255,255,255,0.16)' }}>Zum Shop</a>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: mobil ? '1fr 1fr' : 'repeat(4, 1fr)', gap: '30px', padding: '36px 0', borderTop: '1px solid rgba(255,255,255,0.10)', borderBottom: '1px solid rgba(255,255,255,0.10)' }}>
            <div>
              <p style={{ fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', fontWeight: 700, margin: '0 0 14px' }}>Lernen</p>
              <a href="/shop" style={{ display: 'block', color: 'rgba(255,255,255,0.82)', textDecoration: 'none', fontSize: '14px', marginBottom: '8px' }}>Lernmaterialien</a>
              <a href="/lernplan" style={{ display: 'block', color: 'rgba(255,255,255,0.82)', textDecoration: 'none', fontSize: '14px', marginBottom: '8px' }}>Lernplan</a>
              <a href="/lernheld" style={{ display: 'block', color: 'rgba(255,255,255,0.82)', textDecoration: 'none', fontSize: '14px', marginBottom: '8px' }}>Lernheld</a>
              <a href="/quiz" style={{ display: 'block', color: 'rgba(255,255,255,0.82)', textDecoration: 'none', fontSize: '14px', marginBottom: '8px' }}>Quiz</a>
            </div>
            <div>
              <p style={{ fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', fontWeight: 700, margin: '0 0 14px' }}>Rechtliches</p>
              <a href="/impressum" style={{ display: 'block', color: 'rgba(255,255,255,0.82)', textDecoration: 'none', fontSize: '14px', marginBottom: '8px' }}>Impressum</a>
              <a href="/datenschutz" style={{ display: 'block', color: 'rgba(255,255,255,0.82)', textDecoration: 'none', fontSize: '14px', marginBottom: '8px' }}>Datenschutz</a>
              <a href="/agb" style={{ display: 'block', color: 'rgba(255,255,255,0.82)', textDecoration: 'none', fontSize: '14px', marginBottom: '8px' }}>AGB</a>
            </div>
            <div>
              <p style={{ fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', fontWeight: 700, margin: '0 0 14px' }}>Kontakt</p>
              <a href="https://wa.me/4917624700519" style={{ display: 'block', color: 'rgba(255,255,255,0.82)', textDecoration: 'none', fontSize: '14px', marginBottom: '8px' }}>WhatsApp</a>
            </div>
            <div>
              <p style={{ fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', fontWeight: 700, margin: '0 0 14px' }}>Über</p>
              <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.55, display: 'block' }}>
                Lernflix · Mathe + Physik · Klasse 1 bis 13
              </span>
            </div>
          </div>
          <div style={{ paddingTop: '22px', textAlign: 'center', fontSize: '12.5px', color: 'rgba(255,255,255,0.4)' }}>
            © {new Date().getFullYear()} Lernflix · lernflix.lernemitanna.de
          </div>
        </div>
      </footer>
    </main>
  );
}

function Service({ href, icon, titel, sub, farbe, akzent }: { href: string; icon: React.ReactNode; titel: string; sub: string; farbe: string; akzent?: boolean }) {
  const F2 = { ink: '#0a0a0c', inkSoft: '#52525b', border: '#e2e8f0', white: '#fff', blue: '#1769FF' };
  return (
    <a href={href} className="service-card" style={{ display: 'flex', flexDirection: 'column', padding: '22px 20px 20px', borderRadius: '18px', textDecoration: 'none', color: F2.ink, background: F2.white, border: `1.5px solid ${akzent ? F2.blue : F2.border}`, boxShadow: akzent ? '0 8px 24px rgba(23,105,255,0.10)' : '0 1px 2px rgba(15,23,42,0.04)', position: 'relative' }}>
      <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: farbe, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
        {icon}
      </div>
      <h3 style={{ fontFamily: SANS, fontSize: '19px', fontWeight: 800, margin: '0 0 4px', letterSpacing: '-0.02em', lineHeight: 1.1, color: F2.ink }}>{titel}</h3>
      <p style={{ fontSize: '13.5px', color: F2.inkSoft, margin: '0 0 14px', fontWeight: 500 }}>{sub}</p>
      <span style={{ marginTop: 'auto', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, color: F2.ink }}>
        Öffnen <span className="svc-arrow" style={{ fontSize: '15px' }}>→</span>
      </span>
    </a>
  );
}
