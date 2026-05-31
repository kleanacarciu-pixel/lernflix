'use client';
import { useEffect, useState } from 'react';

const F = {
  bg: '#ffffff',
  bgSoft: '#fafaf7',
  ink: '#1c1c1e',
  inkSoft: '#5a5a5e',
  inkMuted: '#9a9a9e',
  border: '#ececec',
  white: '#ffffff',
  coral: '#e85a4f',
  dark: '#1c1c1e',
};

const SERIF = '"Cormorant Garamond", Georgia, serif';
const SANS = '"Inter", -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif';

// Echte Fotos von Unsplash (kostenlos & kommerziell nutzbar) - kindgerecht, Schul-Look
const FOTO = {
  hero: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1600&auto=format&fit=crop&q=85',
  shop: 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=1200&auto=format&fit=crop&q=85',
  lernplan: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&auto=format&fit=crop&q=85',
  lernheld: 'https://images.unsplash.com/photo-1488998427799-e3362cec87c3?w=1200&auto=format&fit=crop&q=85',
  quiz: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=1200&auto=format&fit=crop&q=85',
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
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap" />

      <style>{`
        * { -webkit-font-smoothing: antialiased; }
        body { background: ${F.bg}; margin: 0; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) both; }
        .glied { transition: transform 0.4s cubic-bezier(0.2,0.8,0.2,1); cursor: pointer; }
        .glied:hover { transform: translateY(-6px); }
        .glied:hover .glied-foto { transform: scale(1.06); }
        .glied-foto { transition: transform 0.6s cubic-bezier(0.2,0.8,0.2,1); }
        .btn-primary { transition: all 0.25s ease; }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 14px 30px rgba(232,90,79,0.32); }
        .btn-ghost { transition: all 0.25s ease; }
        .btn-ghost:hover { background: ${F.ink}; color: ${F.white}; }
      `}</style>

      {/* HEADER */}
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: scrolled ? 'rgba(255,255,255,0.94)' : 'transparent', backdropFilter: scrolled ? 'saturate(180%) blur(20px)' : 'none', borderBottom: scrolled ? `1px solid ${F.border}` : '1px solid transparent', padding: mobil ? '14px 22px' : '18px 60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all 0.3s ease' }}>
        <a href="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontFamily: SERIF, fontSize: mobil ? '28px' : '32px', fontWeight: 700, color: scrolled ? F.ink : F.white, letterSpacing: '-0.02em', textShadow: scrolled ? 'none' : '0 2px 12px rgba(0,0,0,0.3)' }}>
            Lern<span style={{ color: F.coral }}>flix</span>
          </span>
        </a>
        <nav style={{ display: 'flex', gap: mobil ? '14px' : '30px', alignItems: 'center' }}>
          {!mobil && (
            <>
              <a href="/shop" style={{ color: scrolled ? F.ink : F.white, textDecoration: 'none', fontSize: '14.5px', fontWeight: 500, textShadow: scrolled ? 'none' : '0 1px 8px rgba(0,0,0,0.3)' }}>Shop</a>
              <a href="/lernplan" style={{ color: scrolled ? F.ink : F.white, textDecoration: 'none', fontSize: '14.5px', fontWeight: 500, textShadow: scrolled ? 'none' : '0 1px 8px rgba(0,0,0,0.3)' }}>Lernplan</a>
              <a href="/quiz" style={{ color: scrolled ? F.ink : F.white, textDecoration: 'none', fontSize: '14.5px', fontWeight: 500, textShadow: scrolled ? 'none' : '0 1px 8px rgba(0,0,0,0.3)' }}>Quiz</a>
            </>
          )}
          <a href="/lernheld" style={{ background: F.coral, color: F.white, textDecoration: 'none', fontSize: '14px', fontWeight: 600, padding: '11px 22px', borderRadius: '999px' }}>Lernheld</a>
        </nav>
      </header>

      {/* HERO mit echtem Foto */}
      <section className="fade-up" style={{ position: 'relative', height: mobil ? '85vh' : '100vh', minHeight: mobil ? '600px' : '720px', overflow: 'hidden' }}>
        <img src={FOTO.hero} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(28,28,30,0.25) 0%, rgba(28,28,30,0.55) 60%, rgba(28,28,30,0.80) 100%)' }} />
        <div style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'flex-end', padding: mobil ? '0 22px 60px' : '0 60px 100px' }}>
          <div style={{ maxWidth: '880px' }}>
            <span style={{ display: 'inline-block', background: 'rgba(255,255,255,0.16)', backdropFilter: 'blur(10px)', color: F.white, padding: '8px 18px', borderRadius: '999px', fontSize: '11.5px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '26px', border: '1px solid rgba(255,255,255,0.25)' }}>
              Die Lern-Plattform
            </span>
            <h1 style={{ fontFamily: SERIF, fontSize: mobil ? '54px' : '108px', fontWeight: 600, lineHeight: 0.96, margin: '0 0 22px', color: F.white, letterSpacing: '-0.035em' }}>
              Alles fürs Lernen,<br /><span style={{ fontStyle: 'italic', fontWeight: 500 }}>an einem Ort</span>.
            </h1>
            <p style={{ fontSize: mobil ? '16px' : '20px', color: 'rgba(255,255,255,0.85)', lineHeight: 1.55, margin: '0 0 36px', maxWidth: '600px' }}>
              Lernmaterialien zum Kaufen, dein eigener Lernplan, der Lernheld für Schulaufgaben und ein kostenloses Quiz.
            </p>
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <a href="#bereiche" className="btn-primary" style={{ background: F.coral, color: F.white, textDecoration: 'none', padding: '16px 32px', borderRadius: '999px', fontSize: '15px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                Loslegen →
              </a>
              <a href="/shop" className="btn-ghost" style={{ background: 'transparent', color: F.white, textDecoration: 'none', padding: '16px 32px', borderRadius: '999px', fontSize: '15px', fontWeight: 600, border: `1.5px solid rgba(255,255,255,0.7)` }}>
                Zum Shop
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 4 BEREICHE */}
      <section id="bereiche" style={{ background: F.bg, padding: mobil ? '70px 22px' : '120px 60px' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ marginBottom: mobil ? '36px' : '56px', maxWidth: '760px' }}>
            <p style={{ fontSize: '11px', letterSpacing: '0.24em', textTransform: 'uppercase', color: F.coral, fontWeight: 700, margin: '0 0 14px' }}>Die Plattform</p>
            <h2 style={{ fontFamily: SERIF, fontSize: mobil ? '42px' : '60px', fontWeight: 600, color: F.ink, margin: '0 0 16px', letterSpacing: '-0.03em', lineHeight: 1.0 }}>
              Vier Bereiche, ein Ziel.
            </h2>
            <p style={{ fontSize: mobil ? '16px' : '18px', color: F.inkSoft, margin: 0, lineHeight: 1.55 }}>
              Jeder Bereich hat seine eigene Seite — wähle, was du gerade brauchst.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: mobil ? '1fr' : 'repeat(2, 1fr)', gap: mobil ? '18px' : '24px' }}>
            <Glied href="/shop" foto={FOTO.shop} nummer="01" label="Shop" titel="Lernmaterialien" sub="13 Pakete · ab 0,99 €" />
            <Glied href="/lernplan" foto={FOTO.lernplan} nummer="02" label="Kostenlos" titel="Mein Lernplan" sub="Wöchentlicher Plan" />
            <Glied href="/lernheld" foto={FOTO.lernheld} nummer="03" label="Premium · 1,99 €" titel="Lernheld" sub="Plan für die Schulaufgabe" />
            <Glied href="/quiz" foto={FOTO.quiz} nummer="04" label="Kostenlos" titel="Quiz" sub="61 Themen · Klasse 1–13" />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: F.dark, color: F.white, padding: mobil ? '60px 22px 30px' : '80px 60px 40px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: mobil ? '1fr' : '2fr 1fr 1fr 1fr', gap: '40px', marginBottom: '50px' }}>
            <div>
              <span style={{ fontFamily: SERIF, fontSize: '34px', fontWeight: 700, color: F.white, letterSpacing: '-0.02em', display: 'block', marginBottom: '14px' }}>
                Lern<span style={{ color: F.coral }}>flix</span>
              </span>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.6, margin: 0, maxWidth: '320px' }}>
                Deine Lern-Plattform für Mathematik und Physik. Klasse 1 bis 13.
              </p>
            </div>
            <div>
              <p style={{ fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: F.coral, fontWeight: 700, margin: '0 0 18px' }}>Lernen</p>
              <a href="/shop" style={{ display: 'block', color: 'rgba(255,255,255,0.80)', textDecoration: 'none', fontSize: '14px', marginBottom: '10px' }}>Lernmaterialien</a>
              <a href="/lernplan" style={{ display: 'block', color: 'rgba(255,255,255,0.80)', textDecoration: 'none', fontSize: '14px', marginBottom: '10px' }}>Lernplan</a>
              <a href="/lernheld" style={{ display: 'block', color: 'rgba(255,255,255,0.80)', textDecoration: 'none', fontSize: '14px', marginBottom: '10px' }}>Lernheld</a>
              <a href="/quiz" style={{ display: 'block', color: 'rgba(255,255,255,0.80)', textDecoration: 'none', fontSize: '14px', marginBottom: '10px' }}>Quiz</a>
            </div>
            <div>
              <p style={{ fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: F.coral, fontWeight: 700, margin: '0 0 18px' }}>Rechtliches</p>
              <a href="/impressum" style={{ display: 'block', color: 'rgba(255,255,255,0.80)', textDecoration: 'none', fontSize: '14px', marginBottom: '10px' }}>Impressum</a>
              <a href="/datenschutz" style={{ display: 'block', color: 'rgba(255,255,255,0.80)', textDecoration: 'none', fontSize: '14px', marginBottom: '10px' }}>Datenschutz</a>
              <a href="/agb" style={{ display: 'block', color: 'rgba(255,255,255,0.80)', textDecoration: 'none', fontSize: '14px', marginBottom: '10px' }}>AGB</a>
            </div>
            <div>
              <p style={{ fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: F.coral, fontWeight: 700, margin: '0 0 18px' }}>Kontakt</p>
              <a href="https://wa.me/4917624700519" style={{ display: 'block', color: 'rgba(255,255,255,0.80)', textDecoration: 'none', fontSize: '14px', marginBottom: '10px' }}>WhatsApp</a>
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

function Glied({ href, foto, nummer, label, titel, sub }: { href: string; foto: string; nummer: string; label: string; titel: string; sub: string }) {
  return (
    <a href={href} className="glied" style={{ position: 'relative', display: 'block', textDecoration: 'none', borderRadius: '20px', overflow: 'hidden', aspectRatio: '4 / 3', boxShadow: '0 10px 30px rgba(28,28,30,0.10)' }}>
      <img src={foto} alt="" className="glied-foto" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(28,28,30,0.10) 0%, rgba(28,28,30,0.30) 50%, rgba(28,28,30,0.85) 100%)' }} />
      <div style={{ position: 'absolute', top: '22px', right: '24px', fontFamily: SERIF, fontSize: '52px', fontStyle: 'italic', fontWeight: 600, color: 'rgba(255,255,255,0.55)', letterSpacing: '-0.02em', lineHeight: 1 }}>{nummer}</div>
      <div style={{ position: 'absolute', bottom: '28px', left: '28px', right: '28px', color: F.white }}>
        <span style={{ display: 'inline-block', background: 'rgba(255,255,255,0.16)', backdropFilter: 'blur(10px)', color: F.white, padding: '5px 12px', borderRadius: '999px', fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '14px', border: '1px solid rgba(255,255,255,0.22)' }}>
          {label}
        </span>
        <h3 style={{ fontFamily: SERIF, fontSize: '34px', fontWeight: 600, margin: '0 0 6px', letterSpacing: '-0.02em', lineHeight: 1.0 }}>{titel}</h3>
        <p style={{ fontSize: '14px', margin: 0, color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>{sub}</p>
      </div>
    </a>
  );
}
