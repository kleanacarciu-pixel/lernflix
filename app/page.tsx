'use client';
import { useEffect, useState } from 'react';

// Vibrant colors fuer schueler — nicht pastell, nicht buero
const F = {
  bg: '#ffffff',
  bgWarm: '#fff7ed',
  ink: '#1a1a1f',
  inkSoft: '#52525b',
  inkMuted: '#9a9aa3',
  border: '#e8e8ec',
  white: '#ffffff',
  // Bright brand colors
  coral: '#ff4757',
  coralDeep: '#e02a3c',
  turquoise: '#00cfb3',
  turquoiseDeep: '#00a994',
  yellow: '#ffce3a',
  yellowDeep: '#e6b520',
  purple: '#7158e2',
  purpleDeep: '#5340c2',
  mint: '#51cf66',
  mintDeep: '#37a14b',
  hotPink: '#ff6ec7',
  hotPinkDeep: '#e54ba8',
  dark: '#1a1a1f',
};

// Nunito - freundliche runde sans, von Duolingo & vielen schueler-apps verwendet
const SANS = '"Nunito", "Inter", -apple-system, BlinkMacSystemFont, sans-serif';
const HAND = '"Caveat", cursive';

const FOTO = {
  hero: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1400&auto=format&fit=crop&q=85',
  shop: 'https://images.unsplash.com/photo-1532153975070-2e9ab71f1b14?w=1000&auto=format&fit=crop&q=85',
  lernplan: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=1000&auto=format&fit=crop&q=85',
  lernheld: 'https://images.unsplash.com/photo-1488998427799-e3362cec87c3?w=1400&auto=format&fit=crop&q=85',
  quiz: 'https://images.unsplash.com/photo-1626387346567-68d0c4fbd2cf?w=1000&auto=format&fit=crop&q=85',
};

export default function Home() {
  const [breite, setBreite] = useState(1200);
  const [scrolled, setScrolled] = useState(false);

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

  return (
    <main style={{ minHeight: '100vh', background: F.bg, fontFamily: SANS, color: F.ink, overflowX: 'hidden' }}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=Nunito:wght@500;600;700;800;900&display=swap" />

      <style>{`
        * { -webkit-font-smoothing: antialiased; }
        body { background: ${F.bg}; margin: 0; font-family: ${SANS}; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes wiggle { 0%, 100% { transform: rotate(-6deg); } 50% { transform: rotate(-3deg); } }
        @keyframes bob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        .fade-up { animation: fadeUp 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) both; }
        .sticker { animation: wiggle 4s ease-in-out infinite; }
        .bob { animation: bob 3s ease-in-out infinite; }

        /* Duolingo-style chunky button mit shadow-depth */
        .btn-chunky {
          position: relative; display: inline-flex; align-items: center; justify-content: center; gap: 10px;
          padding: 18px 30px; border-radius: 16px; font-size: 16px; font-weight: 800;
          text-decoration: none; cursor: pointer; border: none; font-family: ${SANS};
          letter-spacing: 0.02em; text-transform: uppercase;
          transition: transform 0.1s ease;
        }
        .btn-chunky:active { transform: translateY(3px); }
        .btn-chunky:hover { transform: translateY(-1px); }
        .btn-coral { background: ${F.coral}; color: white; box-shadow: 0 5px 0 ${F.coralDeep}; }
        .btn-coral:hover { box-shadow: 0 6px 0 ${F.coralDeep}; }
        .btn-coral:active { box-shadow: 0 2px 0 ${F.coralDeep}; }
        .btn-dark { background: ${F.ink}; color: white; box-shadow: 0 5px 0 #000; }
        .btn-dark:hover { box-shadow: 0 6px 0 #000; }
        .btn-dark:active { box-shadow: 0 2px 0 #000; }
        .btn-white { background: white; color: ${F.ink}; box-shadow: 0 5px 0 ${F.ink}; border: 2px solid ${F.ink}; }
        .btn-white:hover { box-shadow: 0 6px 0 ${F.ink}; }
        .btn-white:active { box-shadow: 0 2px 0 ${F.ink}; }

        /* Bereich-Card chunky */
        .bcard {
          position: relative; display: block; text-decoration: none;
          border-radius: 28px; padding: 28px; overflow: hidden;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          color: ${F.ink}; border: 3px solid ${F.ink};
        }
        .bcard:hover { transform: translateY(-6px); }
        .bcard-shadow { box-shadow: 0 8px 0 ${F.ink}; }
        .bcard-shadow:hover { box-shadow: 0 14px 0 ${F.ink}; }
        .bcard-shadow:active { box-shadow: 0 2px 0 ${F.ink}; transform: translateY(6px); }
      `}</style>

      {/* HEADER */}
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: scrolled ? 'rgba(255,255,255,0.96)' : 'transparent', backdropFilter: scrolled ? 'saturate(180%) blur(20px)' : 'none', borderBottom: scrolled ? `1px solid ${F.border}` : '1px solid transparent', padding: mobil ? '14px 22px' : '16px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all 0.3s ease' }}>
        <a href="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontFamily: SANS, fontSize: mobil ? '28px' : '30px', fontWeight: 900, color: F.ink, letterSpacing: '-0.02em' }}>
            Lern<span style={{ color: F.coral }}>flix</span>
          </span>
        </a>
        <nav style={{ display: 'flex', gap: mobil ? '14px' : '28px', alignItems: 'center' }}>
          {!mobil && (
            <>
              <a href="/shop" style={{ color: F.ink, textDecoration: 'none', fontSize: '15px', fontWeight: 700 }}>Shop</a>
              <a href="/lernplan" style={{ color: F.ink, textDecoration: 'none', fontSize: '15px', fontWeight: 700 }}>Lernplan</a>
              <a href="/quiz" style={{ color: F.ink, textDecoration: 'none', fontSize: '15px', fontWeight: 700 }}>Quiz</a>
            </>
          )}
          <a href="/lernheld" className="btn-chunky btn-coral" style={{ padding: '11px 20px', fontSize: '13px' }}>
            Lernheld
          </a>
        </nav>
      </header>

      {/* HERO - chunky, bunt, schueler-style */}
      <section className="fade-up" style={{ background: F.bgWarm, paddingTop: mobil ? '110px' : '130px', paddingBottom: mobil ? '60px' : '90px', paddingLeft: mobil ? '22px' : '60px', paddingRight: mobil ? '22px' : '60px', position: 'relative', overflow: 'hidden' }}>
        {/* Schwebende deko */}
        {!mobil && (
          <>
            <div style={{ position: 'absolute', top: '160px', right: '4%', width: '140px', height: '140px', borderRadius: '50%', background: F.turquoise, opacity: 0.35 }} />
            <div style={{ position: 'absolute', bottom: '40px', left: '3%', width: '90px', height: '90px', borderRadius: '50%', background: F.yellow, opacity: 0.4 }} />
            <div className="bob" style={{ position: 'absolute', top: '24%', right: '32%', width: '24px', height: '24px', borderRadius: '50%', background: F.purple }} />
            <div className="bob" style={{ position: 'absolute', top: '60%', right: '12%', width: '16px', height: '16px', borderRadius: '50%', background: F.coral, animationDelay: '1s' }} />
          </>
        )}
        <div style={{ maxWidth: '1240px', margin: '0 auto', position: 'relative', display: 'grid', gridTemplateColumns: mobil ? '1fr' : '1.15fr 1fr', gap: mobil ? '40px' : '60px', alignItems: 'center' }}>
          {/* Links: text */}
          <div>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: F.ink, color: F.white, padding: '9px 18px', borderRadius: '999px', fontSize: '12px', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '28px' }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: F.turquoise, boxShadow: `0 0 10px ${F.turquoise}` }} /> Die Lern-Plattform
            </span>
            <h1 style={{ fontFamily: SANS, fontSize: mobil ? '50px' : '78px', fontWeight: 900, lineHeight: 0.98, margin: '0 0 24px', color: F.ink, letterSpacing: '-0.03em' }}>
              Lernen war noch nie so <span style={{ color: F.coral, position: 'relative', display: 'inline-block' }}>easy
                <svg style={{ position: 'absolute', left: '-4px', right: '-4px', bottom: '-12px', width: 'calc(100% + 8px)' }} viewBox="0 0 200 16" preserveAspectRatio="none">
                  <path d="M2 10 Q 50 2, 100 8 T 198 10" stroke={F.yellow} strokeWidth="6" fill="none" strokeLinecap="round" />
                </svg>
              </span>.
            </h1>
            <p style={{ fontSize: mobil ? '17px' : '19px', color: F.inkSoft, lineHeight: 1.55, margin: '0 0 32px', maxWidth: '500px', fontWeight: 500 }}>
              Lernmaterial, dein eigener Plan, Quiz und die Schulaufgaben-Hilfe — alles für Mathe & Physik, Klasse 1 bis 13.
            </p>
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <a href="#lernheld" className="btn-chunky btn-coral">
                Jetzt starten
              </a>
              <a href="/shop" className="btn-chunky btn-white">
                Zum Shop
              </a>
            </div>
          </div>
          {/* Rechts: foto mit stickers */}
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'relative', borderRadius: '32px', overflow: 'hidden', aspectRatio: '4 / 5', border: `4px solid ${F.ink}`, boxShadow: `12px 12px 0 ${F.ink}` }}>
              <img src={FOTO.hero} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            {/* Sticker: kostenlos */}
            <div className="sticker" style={{ position: 'absolute', top: '-12px', left: mobil ? '-12px' : '-30px', background: F.mint, color: F.ink, padding: '14px 22px', borderRadius: '999px', fontFamily: HAND, fontSize: mobil ? '24px' : '32px', fontWeight: 700, boxShadow: `0 6px 0 ${F.mintDeep}`, border: `3px solid ${F.ink}` }}>
              kostenlos!
            </div>
            {/* Sticker: 1 sehr gut */}
            <div style={{ position: 'absolute', bottom: '40px', right: mobil ? '-14px' : '-32px', background: F.yellow, color: F.ink, padding: '18px 18px 14px', borderRadius: '20px', fontFamily: HAND, fontSize: mobil ? '38px' : '48px', fontWeight: 700, lineHeight: 1, transform: 'rotate(8deg)', boxShadow: `0 6px 0 ${F.yellowDeep}`, border: `3px solid ${F.ink}`, textAlign: 'center' }}>
              1
              <div style={{ fontSize: mobil ? '12px' : '14px', fontFamily: SANS, fontWeight: 800, marginTop: '2px', letterSpacing: '0.05em' }}>sehr gut!</div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST STRIP - feature pills */}
      <section style={{ background: F.bg, padding: mobil ? '30px 22px' : '50px 60px 30px' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'flex', gap: mobil ? '10px' : '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            { ic: '📚', t: '13 Lernpakete' },
            { ic: '🧠', t: 'Mathe + Physik' },
            { ic: '✏️', t: 'Klasse 1 – 13' },
            { ic: '⚡', t: 'Sofort verfügbar' },
            { ic: '💯', t: 'Ab 0,99 €' },
          ].map((f, i) => (
            <div key={i} style={{ background: F.bg, color: F.ink, padding: '12px 20px', borderRadius: '999px', fontSize: '14px', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '8px', border: `2px solid ${F.ink}` }}>
              <span style={{ fontSize: '18px' }}>{f.ic}</span>{f.t}
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED CARD - Lernheld gross */}
      <section id="lernheld" style={{ background: F.bg, padding: mobil ? '40px 22px 30px' : '70px 60px 40px' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <a href="/lernheld" className="bcard bcard-shadow" style={{ background: F.coral, color: F.white, padding: 0, display: 'block' }}>
            <div style={{ display: 'grid', gridTemplateColumns: mobil ? '1fr' : '1fr 1fr', gap: 0, alignItems: 'stretch' }}>
              <div style={{ padding: mobil ? '32px 24px' : '50px 50px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', alignSelf: 'flex-start', gap: '8px', background: F.white, color: F.coral, padding: '8px 16px', borderRadius: '999px', fontSize: '11.5px', fontWeight: 900, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '20px', border: `2px solid ${F.ink}` }}>
                  ⭐ Premium · 1,99 €
                </span>
                <h2 style={{ fontFamily: SANS, fontSize: mobil ? '44px' : '64px', fontWeight: 900, color: F.white, margin: '0 0 14px', lineHeight: 0.96, letterSpacing: '-0.03em' }}>
                  Lernheld
                </h2>
                <p style={{ fontSize: mobil ? '17px' : '19px', color: 'rgba(255,255,255,0.95)', margin: '0 0 24px', lineHeight: 1.5, fontWeight: 600, maxWidth: '440px' }}>
                  Foto vom Stoff hochladen, Klasse wählen — fertig. Dein persönlicher Plan für die nächste Schulaufgabe.
                </p>
                <span className="btn-chunky btn-white" style={{ alignSelf: 'flex-start' }}>
                  Plan erstellen →
                </span>
              </div>
              <div style={{ position: 'relative', minHeight: mobil ? '280px' : '420px', overflow: 'hidden' }}>
                <img src={FOTO.lernheld} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', top: '24px', right: '24px', color: '#dc2626', fontFamily: HAND, fontWeight: 700, fontSize: mobil ? '90px' : '128px', lineHeight: 0.9, transform: 'rotate(-9deg)', textShadow: '0 2px 6px rgba(255,255,255,0.7)' }}>
                  1
                  <div style={{ fontSize: mobil ? '20px' : '28px', fontWeight: 700, marginTop: '2px' }}>sehr gut!</div>
                </div>
              </div>
            </div>
          </a>
        </div>
      </section>

      {/* 3 KARTEN ROW: Shop / Lernplan / Quiz */}
      <section style={{ background: F.bg, padding: mobil ? '20px 22px 60px' : '30px 60px 110px' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'grid', gridTemplateColumns: mobil ? '1fr' : 'repeat(3, 1fr)', gap: mobil ? '20px' : '24px' }}>
          <BCard
            href="/shop"
            bg={F.turquoise}
            emoji="📚"
            label="Shop"
            titel="Lern&shy;materialien"
            sub="13 Pakete, ab 0,99 €"
            foto={FOTO.shop}
            mobil={mobil}
          />
          <BCard
            href="/lernplan"
            bg={F.yellow}
            emoji="📅"
            label="Kostenlos"
            titel="Mein Lernplan"
            sub="Wochenplan + Hausaufgaben"
            foto={FOTO.lernplan}
            mobil={mobil}
          />
          <BCard
            href="/quiz"
            bg={F.purple}
            emoji="🧠"
            label="Kostenlos"
            titel="Quiz"
            sub="61 Themen, Klasse 1 – 13"
            foto={FOTO.quiz}
            mobil={mobil}
            textWhite
          />
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: F.dark, color: F.white, padding: mobil ? '60px 22px 30px' : '80px 60px 40px' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: mobil ? '1fr' : '2fr 1fr 1fr 1fr', gap: '40px', marginBottom: '50px' }}>
            <div>
              <span style={{ fontFamily: SANS, fontSize: '32px', fontWeight: 900, color: F.white, letterSpacing: '-0.02em', display: 'block', marginBottom: '14px' }}>
                Lern<span style={{ color: F.coral }}>flix</span>
              </span>
              <p style={{ fontSize: '14.5px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, margin: 0, maxWidth: '320px', fontWeight: 500 }}>
                Deine Lern-Plattform für Mathematik und Physik. Klasse 1 bis 13.
              </p>
            </div>
            <div>
              <p style={{ fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', color: F.coral, fontWeight: 900, margin: '0 0 18px' }}>Lernen</p>
              <a href="/shop" style={{ display: 'block', color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: '14.5px', marginBottom: '10px', fontWeight: 600 }}>Lernmaterialien</a>
              <a href="/lernplan" style={{ display: 'block', color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: '14.5px', marginBottom: '10px', fontWeight: 600 }}>Lernplan</a>
              <a href="/lernheld" style={{ display: 'block', color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: '14.5px', marginBottom: '10px', fontWeight: 600 }}>Lernheld</a>
              <a href="/quiz" style={{ display: 'block', color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: '14.5px', marginBottom: '10px', fontWeight: 600 }}>Quiz</a>
            </div>
            <div>
              <p style={{ fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', color: F.coral, fontWeight: 900, margin: '0 0 18px' }}>Rechtliches</p>
              <a href="/impressum" style={{ display: 'block', color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: '14.5px', marginBottom: '10px', fontWeight: 600 }}>Impressum</a>
              <a href="/datenschutz" style={{ display: 'block', color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: '14.5px', marginBottom: '10px', fontWeight: 600 }}>Datenschutz</a>
              <a href="/agb" style={{ display: 'block', color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: '14.5px', marginBottom: '10px', fontWeight: 600 }}>AGB</a>
            </div>
            <div>
              <p style={{ fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', color: F.coral, fontWeight: 900, margin: '0 0 18px' }}>Kontakt</p>
              <a href="https://wa.me/4917624700519" style={{ display: 'block', color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: '14.5px', marginBottom: '10px', fontWeight: 600 }}>WhatsApp</a>
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.12)', paddingTop: '24px', textAlign: 'center', fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
            © {new Date().getFullYear()} Lernflix · lernflix.lernemitanna.de
          </div>
        </div>
      </footer>
    </main>
  );
}

function BCard({ href, bg, emoji, label, titel, sub, foto, mobil, textWhite }: { href: string; bg: string; emoji: string; label: string; titel: string; sub: string; foto: string; mobil: boolean; textWhite?: boolean }) {
  const txt = textWhite ? F.white : F.ink;
  return (
    <a href={href} className="bcard bcard-shadow" style={{ background: bg, color: txt }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
        <span style={{ background: textWhite ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.12)', color: txt, padding: '6px 14px', borderRadius: '999px', fontSize: '11px', fontWeight: 900, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
          {label}
        </span>
        <span style={{ fontSize: '32px', lineHeight: 1 }}>{emoji}</span>
      </div>
      <div style={{ position: 'relative', borderRadius: '18px', overflow: 'hidden', aspectRatio: '5 / 4', marginBottom: '20px', border: `2px solid ${F.ink}` }}>
        <img src={foto} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <h3 style={{ fontFamily: SANS, fontSize: mobil ? '26px' : '30px', fontWeight: 900, margin: '0 0 6px', letterSpacing: '-0.02em', lineHeight: 1.0, color: txt }} dangerouslySetInnerHTML={{ __html: titel }} />
      <p style={{ fontSize: '14.5px', margin: '0 0 18px', color: textWhite ? 'rgba(255,255,255,0.85)' : 'rgba(26,26,31,0.7)', fontWeight: 600 }}>{sub}</p>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '14.5px', fontWeight: 900, color: txt, letterSpacing: '0.02em' }}>
        Öffnen <span style={{ fontSize: '18px' }}>→</span>
      </span>
    </a>
  );
}
