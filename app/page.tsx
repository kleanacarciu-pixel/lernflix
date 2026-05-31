'use client';
import { useEffect, useState } from 'react';

const F = {
  bg: '#ffffff',
  bgSubtle: '#fafaf9',
  ink: '#0a0a0c',
  inkSoft: '#52525b',
  inkMuted: '#a1a1aa',
  border: '#e5e5e7',
  borderSoft: '#f0f0f2',
  white: '#ffffff',
  coral: '#e63946',
  coralDeep: '#c8202d',
  dark: '#0a0a0c',
};

const SANS = '"Inter", -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif';

const FOTO = {
  hero: 'https://images.unsplash.com/photo-1532153975070-2e9ab71f1b14?w=1400&auto=format&fit=crop&q=90',
  shop: 'https://images.unsplash.com/photo-1535905557558-afc4877a26fc?w=900&auto=format&fit=crop&q=90',
  lernplan: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=900&auto=format&fit=crop&q=90',
  lernheld: 'https://images.unsplash.com/photo-1488998427799-e3362cec87c3?w=1400&auto=format&fit=crop&q=90',
  quiz: 'https://images.unsplash.com/photo-1626387346567-68d0c4fbd2cf?w=900&auto=format&fit=crop&q=90',
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
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" />

      <style>{`
        * { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
        body { background: ${F.bg}; margin: 0; font-family: ${SANS}; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) both; }
        .btn-primary { transition: background 0.2s ease, transform 0.15s ease; }
        .btn-primary:hover { background: ${F.coralDeep}; }
        .btn-primary:active { transform: scale(0.98); }
        .btn-ghost { transition: all 0.2s ease; }
        .btn-ghost:hover { background: ${F.ink}; color: ${F.white}; border-color: ${F.ink}; }
        .card { transition: transform 0.3s cubic-bezier(0.2,0.8,0.2,1), box-shadow 0.3s ease; }
        .card:hover { transform: translateY(-4px); box-shadow: 0 20px 40px rgba(10,10,12,0.08); }
        .card:hover .card-arrow { transform: translateX(6px); }
        .card-arrow { transition: transform 0.3s ease; display: inline-block; }
        .card:hover .card-foto { transform: scale(1.04); }
        .card-foto { transition: transform 0.6s cubic-bezier(0.2,0.8,0.2,1); }
        .feature:hover .feature-foto { transform: scale(1.03); }
        .feature-foto { transition: transform 0.7s cubic-bezier(0.2,0.8,0.2,1); }
      `}</style>

      {/* HEADER */}
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: scrolled ? 'rgba(255,255,255,0.96)' : 'transparent', backdropFilter: scrolled ? 'saturate(180%) blur(20px)' : 'none', borderBottom: scrolled ? `1px solid ${F.border}` : '1px solid transparent', padding: mobil ? '14px 22px' : '18px 56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all 0.3s ease' }}>
        <a href="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontFamily: SANS, fontSize: mobil ? '24px' : '26px', fontWeight: 800, color: F.ink, letterSpacing: '-0.025em' }}>
            Lern<span style={{ color: F.coral }}>flix</span>
          </span>
        </a>
        <nav style={{ display: 'flex', gap: mobil ? '14px' : '36px', alignItems: 'center' }}>
          {!mobil && (
            <>
              <a href="/shop" style={{ color: F.ink, textDecoration: 'none', fontSize: '14.5px', fontWeight: 500 }}>Shop</a>
              <a href="/lernplan" style={{ color: F.ink, textDecoration: 'none', fontSize: '14.5px', fontWeight: 500 }}>Lernplan</a>
              <a href="/quiz" style={{ color: F.ink, textDecoration: 'none', fontSize: '14.5px', fontWeight: 500 }}>Quiz</a>
            </>
          )}
          <a href="/lernheld" className="btn-primary" style={{ background: F.coral, color: F.white, textDecoration: 'none', fontSize: '13.5px', fontWeight: 600, padding: '10px 18px', borderRadius: '8px', letterSpacing: '-0.005em' }}>
            Lernheld
          </a>
        </nav>
      </header>

      {/* HERO - white, premium, confident */}
      <section className="fade-up" style={{ paddingTop: mobil ? '120px' : '170px', paddingBottom: mobil ? '60px' : '110px', paddingLeft: mobil ? '22px' : '56px', paddingRight: mobil ? '22px' : '56px', background: F.bg }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: mobil ? '1fr' : '1.15fr 1fr', gap: mobil ? '50px' : '80px', alignItems: 'center' }}>
          {/* Text */}
          <div>
            <span style={{ display: 'inline-block', background: F.bgSubtle, border: `1px solid ${F.border}`, color: F.inkSoft, padding: '7px 14px', borderRadius: '999px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '28px' }}>
              Die Lern-Plattform
            </span>
            <h1 style={{ fontFamily: SANS, fontSize: mobil ? '52px' : '92px', fontWeight: 800, lineHeight: 0.96, margin: '0 0 26px', color: F.ink, letterSpacing: '-0.04em' }}>
              Alles fürs Lernen,<br /><span style={{ color: F.coral }}>an einem Ort</span>.
            </h1>
            <p style={{ fontSize: mobil ? '17px' : '20px', color: F.inkSoft, lineHeight: 1.5, margin: '0 0 38px', maxWidth: '520px', fontWeight: 400 }}>
              Lernmaterialien, dein eigener Lernplan, der Lernheld für Schulaufgaben und ein kostenloses Quiz. Mathematik und Physik, Klasse 1 bis 13.
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <a href="#lernheld" className="btn-primary" style={{ background: F.coral, color: F.white, textDecoration: 'none', padding: '15px 30px', borderRadius: '10px', fontSize: '15px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                Jetzt starten
                <span style={{ fontSize: '16px' }}>→</span>
              </a>
              <a href="/shop" className="btn-ghost" style={{ background: 'transparent', color: F.ink, textDecoration: 'none', padding: '15px 30px', borderRadius: '10px', fontSize: '15px', fontWeight: 600, border: `1.5px solid ${F.border}` }}>
                Zum Shop
              </a>
            </div>
          </div>
          {/* Foto */}
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'relative', borderRadius: '20px', overflow: 'hidden', aspectRatio: '4 / 5', background: F.bgSubtle, boxShadow: '0 30px 60px rgba(10,10,12,0.10), 0 8px 24px rgba(10,10,12,0.06)' }}>
              <img src={FOTO.hero} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </div>
        </div>
      </section>

      {/* TRUST STRIP - clean, professional */}
      <section style={{ background: F.bg, padding: mobil ? '0 22px 50px' : '0 56px 70px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: mobil ? '14px' : '28px', justifyContent: 'center', alignItems: 'center', paddingTop: mobil ? '30px' : '40px', borderTop: `1px solid ${F.border}` }}>
          {['13 Lernpakete', 'Mathematik + Physik', 'Klasse 1 — 13', 'Sofort verfügbar', 'Ab 0,99 €'].map((t, i) => (
            <span key={i} style={{ fontSize: mobil ? '13px' : '14px', fontWeight: 600, color: F.inkSoft, letterSpacing: '-0.005em', display: 'inline-flex', alignItems: 'center', gap: mobil ? '14px' : '28px' }}>
              {t}
              {i < 4 && <span style={{ color: F.inkMuted, fontSize: '10px' }}>•</span>}
            </span>
          ))}
        </div>
      </section>

      {/* FEATURED: LERNHELD - bold, color, professional */}
      <section id="lernheld" style={{ background: F.bg, padding: mobil ? '40px 22px' : '60px 56px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <a href="/lernheld" className="feature" style={{ display: 'block', textDecoration: 'none', background: F.coral, color: F.white, borderRadius: '24px', overflow: 'hidden', position: 'relative' }}>
            <div style={{ display: 'grid', gridTemplateColumns: mobil ? '1fr' : '1fr 1fr', gap: 0, alignItems: 'stretch' }}>
              <div style={{ padding: mobil ? '36px 28px' : '60px 60px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <span style={{ display: 'inline-block', alignSelf: 'flex-start', background: 'rgba(255,255,255,0.16)', backdropFilter: 'blur(8px)', color: F.white, padding: '7px 14px', borderRadius: '999px', fontSize: '11.5px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '24px', border: '1px solid rgba(255,255,255,0.28)' }}>
                  Premium · 1,99 €
                </span>
                <h2 style={{ fontFamily: SANS, fontSize: mobil ? '44px' : '72px', fontWeight: 800, color: F.white, margin: '0 0 18px', lineHeight: 0.96, letterSpacing: '-0.035em' }}>
                  Lernheld
                </h2>
                <p style={{ fontSize: mobil ? '17px' : '19px', color: 'rgba(255,255,255,0.92)', margin: '0 0 32px', lineHeight: 1.5, maxWidth: '440px', fontWeight: 400 }}>
                  Foto vom Stoff hochladen, Klasse wählen — fertig. Dein persönlicher Plan für die nächste Schulaufgabe, mit Erklärungen, Übungen und Lösungen.
                </p>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', alignSelf: 'flex-start', background: F.white, color: F.ink, padding: '14px 26px', borderRadius: '10px', fontSize: '14.5px', fontWeight: 600 }}>
                  Plan erstellen
                  <span style={{ fontSize: '16px' }}>→</span>
                </span>
              </div>
              <div style={{ position: 'relative', minHeight: mobil ? '320px' : '480px', overflow: 'hidden' }}>
                <img src={FOTO.lernheld} alt="" className="feature-foto" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </div>
          </a>
        </div>
      </section>

      {/* 3 BEREICHE - clean cards */}
      <section style={{ background: F.bg, padding: mobil ? '40px 22px 70px' : '60px 56px 130px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ marginBottom: mobil ? '32px' : '50px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <span style={{ display: 'inline-block', fontSize: '12px', color: F.coral, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '10px' }}>
                Mehr entdecken
              </span>
              <h2 style={{ fontFamily: SANS, fontSize: mobil ? '36px' : '50px', fontWeight: 800, color: F.ink, margin: 0, letterSpacing: '-0.03em', lineHeight: 1.0 }}>
                Drei weitere Bereiche.
              </h2>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: mobil ? '1fr' : 'repeat(3, 1fr)', gap: mobil ? '20px' : '24px' }}>
            <Karte
              href="/shop"
              label="Shop"
              titel="Lern&shy;materialien"
              sub="13 Lernpakete für Mathematik und Physik."
              foto={FOTO.shop}
              mobil={mobil}
            />
            <Karte
              href="/lernplan"
              label="Kostenlos"
              titel="Mein Lernplan"
              sub="Stundenplan, Hausaufgaben und Lernblöcke."
              foto={FOTO.lernplan}
              mobil={mobil}
            />
            <Karte
              href="/quiz"
              label="Kostenlos"
              titel="Quiz"
              sub="61 Themen, Klasse 1 bis 13."
              foto={FOTO.quiz}
              mobil={mobil}
            />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: F.dark, color: F.white, padding: mobil ? '60px 22px 30px' : '90px 56px 40px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: mobil ? '1fr' : '2fr 1fr 1fr 1fr', gap: '40px', marginBottom: '60px' }}>
            <div>
              <span style={{ fontFamily: SANS, fontSize: '28px', fontWeight: 800, color: F.white, letterSpacing: '-0.025em', display: 'block', marginBottom: '14px' }}>
                Lern<span style={{ color: F.coral }}>flix</span>
              </span>
              <p style={{ fontSize: '14.5px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.6, margin: 0, maxWidth: '320px' }}>
                Die Lern-Plattform für Mathematik und Physik. Klasse 1 bis 13.
              </p>
            </div>
            <div>
              <p style={{ fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', fontWeight: 700, margin: '0 0 18px' }}>Lernen</p>
              <a href="/shop" style={{ display: 'block', color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: '14px', marginBottom: '10px' }}>Lernmaterialien</a>
              <a href="/lernplan" style={{ display: 'block', color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: '14px', marginBottom: '10px' }}>Lernplan</a>
              <a href="/lernheld" style={{ display: 'block', color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: '14px', marginBottom: '10px' }}>Lernheld</a>
              <a href="/quiz" style={{ display: 'block', color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: '14px', marginBottom: '10px' }}>Quiz</a>
            </div>
            <div>
              <p style={{ fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', fontWeight: 700, margin: '0 0 18px' }}>Rechtliches</p>
              <a href="/impressum" style={{ display: 'block', color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: '14px', marginBottom: '10px' }}>Impressum</a>
              <a href="/datenschutz" style={{ display: 'block', color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: '14px', marginBottom: '10px' }}>Datenschutz</a>
              <a href="/agb" style={{ display: 'block', color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: '14px', marginBottom: '10px' }}>AGB</a>
            </div>
            <div>
              <p style={{ fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', fontWeight: 700, margin: '0 0 18px' }}>Kontakt</p>
              <a href="https://wa.me/4917624700519" style={{ display: 'block', color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: '14px', marginBottom: '10px' }}>WhatsApp</a>
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

function Karte({ href, label, titel, sub, foto, mobil }: { href: string; label: string; titel: string; sub: string; foto: string; mobil: boolean }) {
  const F2 = { bg: '#ffffff', ink: '#0a0a0c', inkSoft: '#52525b', inkMuted: '#a1a1aa', border: '#e5e5e7', coral: '#e63946' };
  return (
    <a href={href} className="card" style={{ background: F2.bg, border: `1px solid ${F2.border}`, borderRadius: '20px', overflow: 'hidden', textDecoration: 'none', color: F2.ink, display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'relative', aspectRatio: '5 / 4', overflow: 'hidden', background: '#f4f4f5' }}>
        <img src={foto} alt="" className="card-foto" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <div style={{ padding: mobil ? '22px 22px 24px' : '26px 28px 28px' }}>
        <span style={{ display: 'inline-block', fontSize: '11px', color: F2.coral, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '10px' }}>
          {label}
        </span>
        <h3 style={{ fontFamily: SANS, fontSize: mobil ? '24px' : '28px', fontWeight: 800, margin: '0 0 8px', letterSpacing: '-0.025em', lineHeight: 1.05, color: F2.ink }} dangerouslySetInnerHTML={{ __html: titel }} />
        <p style={{ fontSize: '14.5px', color: F2.inkSoft, lineHeight: 1.5, margin: '0 0 20px' }}>{sub}</p>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 600, color: F2.ink }}>
          Öffnen <span className="card-arrow" style={{ fontSize: '16px' }}>→</span>
        </span>
      </div>
    </a>
  );
}
