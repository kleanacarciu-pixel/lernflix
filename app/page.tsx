'use client';
import { useEffect, useState } from 'react';

const F = {
  bg: '#fffdf9',
  bgWarm: '#fef6ed',
  ink: '#1c1c1e',
  inkSoft: '#5a5a5e',
  inkMuted: '#9a9a9e',
  border: '#f0ece3',
  white: '#ffffff',
  coral: '#ff7a6b',
  coralDeep: '#e56456',
  mint: '#c5ead6',
  mintDeep: '#5fb98c',
  peach: '#fcd7c4',
  peachDeep: '#e89878',
  sky: '#cfe6f5',
  skyDeep: '#5fa3cf',
  lavender: '#e0d4f5',
  lavenderDeep: '#9379c9',
  sun: '#ffe4a3',
  sunDeep: '#d99a36',
  dark: '#1c1c1e',
};

const SERIF = '"Cormorant Garamond", Georgia, serif';
const SANS = '"Inter", -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif';

// Echte Fotos von Unsplash - Objekte/Schulsachen, keine Stress-Kinder-Fotos
const FOTO = {
  shop: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=900&auto=format&fit=crop&q=85',
  lernplan: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=900&auto=format&fit=crop&q=85',
  lernheld: 'https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=900&auto=format&fit=crop&q=85',
  quiz: 'https://images.unsplash.com/photo-1607706189992-eae578626c86?w=900&auto=format&fit=crop&q=85',
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
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap" />

      <style>{`
        * { -webkit-font-smoothing: antialiased; }
        body { background: ${F.bg}; margin: 0; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) both; }
        .glied { transition: transform 0.3s cubic-bezier(0.2,0.8,0.2,1), box-shadow 0.3s ease; cursor: pointer; }
        .glied:hover { transform: translateY(-6px); box-shadow: 0 24px 50px rgba(28,28,30,0.12); }
        .glied:hover .arrow { transform: translateX(6px); }
        .arrow { transition: transform 0.3s ease; display: inline-block; }
        .btn-primary { transition: all 0.25s ease; }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 14px 30px rgba(255,122,107,0.32); }
        .btn-ghost { transition: all 0.25s ease; }
        .btn-ghost:hover { background: ${F.ink}; color: ${F.white}; }
      `}</style>

      {/* HEADER */}
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: scrolled ? 'rgba(255,253,249,0.94)' : 'transparent', backdropFilter: scrolled ? 'saturate(180%) blur(20px)' : 'none', borderBottom: scrolled ? `1px solid ${F.border}` : '1px solid transparent', padding: mobil ? '14px 22px' : '18px 60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all 0.3s ease' }}>
        <a href="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontFamily: SERIF, fontSize: mobil ? '28px' : '32px', fontWeight: 700, color: F.ink, letterSpacing: '-0.02em' }}>
            Lern<span style={{ color: F.coral }}>flix</span>
          </span>
        </a>
        <nav style={{ display: 'flex', gap: mobil ? '14px' : '30px', alignItems: 'center' }}>
          {!mobil && (
            <>
              <a href="/shop" style={{ color: F.ink, textDecoration: 'none', fontSize: '14.5px', fontWeight: 500 }}>Shop</a>
              <a href="/lernplan" style={{ color: F.ink, textDecoration: 'none', fontSize: '14.5px', fontWeight: 500 }}>Lernplan</a>
              <a href="/quiz" style={{ color: F.ink, textDecoration: 'none', fontSize: '14.5px', fontWeight: 500 }}>Quiz</a>
            </>
          )}
          <a href="/lernheld" style={{ background: F.coral, color: F.white, textDecoration: 'none', fontSize: '14px', fontWeight: 600, padding: '11px 22px', borderRadius: '999px' }}>Lernheld</a>
        </nav>
      </header>

      {/* HERO - hell, freundlich, pastell */}
      <section className="fade-up" style={{ background: F.bgWarm, paddingTop: mobil ? '110px' : '140px', paddingBottom: mobil ? '60px' : '110px', paddingLeft: mobil ? '22px' : '60px', paddingRight: mobil ? '22px' : '60px', position: 'relative', overflow: 'hidden' }}>
        {/* Schwebende deko-kreise */}
        {!mobil && (
          <>
            <div style={{ position: 'absolute', top: '120px', right: '8%', width: '120px', height: '120px', borderRadius: '50%', background: F.mint, opacity: 0.45 }} />
            <div style={{ position: 'absolute', bottom: '60px', left: '6%', width: '90px', height: '90px', borderRadius: '50%', background: F.sky, opacity: 0.5 }} />
            <div style={{ position: 'absolute', top: '40%', right: '4%', width: '60px', height: '60px', borderRadius: '50%', background: F.lavender, opacity: 0.55 }} />
          </>
        )}
        <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', textAlign: 'center' }}>
          <span style={{ display: 'inline-block', background: F.white, color: F.coral, padding: '8px 20px', borderRadius: '999px', fontSize: '12px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: '28px', boxShadow: '0 4px 14px rgba(255,122,107,0.18)' }}>
            ✦ Die Lern-Plattform
          </span>
          <h1 style={{ fontFamily: SERIF, fontSize: mobil ? '52px' : '102px', fontWeight: 600, lineHeight: 0.96, margin: '0 0 22px', color: F.ink, letterSpacing: '-0.035em' }}>
            Alles fürs Lernen,<br /><span style={{ fontStyle: 'italic', color: F.coral }}>an einem Ort</span>.
          </h1>
          <p style={{ fontSize: mobil ? '17px' : '20px', color: F.inkSoft, lineHeight: 1.55, margin: '0 auto 38px', maxWidth: '620px' }}>
            Lernmaterialien zum Kaufen, dein eigener Lernplan, der Lernheld für Schulaufgaben und ein kostenloses Quiz.
          </p>
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="#bereiche" className="btn-primary" style={{ background: F.coral, color: F.white, textDecoration: 'none', padding: '17px 34px', borderRadius: '999px', fontSize: '15px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              Loslegen →
            </a>
            <a href="/shop" className="btn-ghost" style={{ background: 'transparent', color: F.ink, textDecoration: 'none', padding: '17px 34px', borderRadius: '999px', fontSize: '15px', fontWeight: 600, border: `1.5px solid ${F.ink}` }}>
              Zum Shop
            </a>
          </div>
        </div>
      </section>

      {/* 4 BEREICHE - Duolingo-Style Pastell-Kacheln */}
      <section id="bereiche" style={{ background: F.bg, padding: mobil ? '70px 22px' : '120px 60px' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: mobil ? '40px' : '60px' }}>
            <p style={{ fontSize: '12px', letterSpacing: '0.2em', textTransform: 'uppercase', color: F.coral, fontWeight: 700, margin: '0 0 14px' }}>Die Plattform</p>
            <h2 style={{ fontFamily: SERIF, fontSize: mobil ? '40px' : '60px', fontWeight: 600, color: F.ink, margin: '0 0 14px', letterSpacing: '-0.03em', lineHeight: 1.0 }}>
              Vier Bereiche, ein Ziel.
            </h2>
            <p style={{ fontSize: mobil ? '16px' : '18px', color: F.inkSoft, margin: 0, lineHeight: 1.55 }}>
              Jeder Bereich hat seine eigene Seite.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: mobil ? '1fr' : 'repeat(2, 1fr)', gap: mobil ? '20px' : '28px' }}>
            <Glied
              href="/shop"
              bg={F.sky}
              bgDeep={F.skyDeep}
              nummer="01"
              label="Shop"
              titel="Lernmaterialien"
              sub="13 Pakete · ab 0,99 €"
              foto={FOTO.shop}
              mobil={mobil}
            />
            <Glied
              href="/lernplan"
              bg={F.mint}
              bgDeep={F.mintDeep}
              nummer="02"
              label="Kostenlos"
              titel="Mein Lernplan"
              sub="Wöchentlicher Plan"
              foto={FOTO.lernplan}
              mobil={mobil}
            />
            <Glied
              href="/lernheld"
              bg={F.peach}
              bgDeep={F.peachDeep}
              nummer="03"
              label="Premium · 1,99 €"
              titel="Lernheld"
              sub="Plan für die Schulaufgabe"
              foto={FOTO.lernheld}
              note1
              mobil={mobil}
            />
            <Glied
              href="/quiz"
              bg={F.lavender}
              bgDeep={F.lavenderDeep}
              nummer="04"
              label="Kostenlos"
              titel="Quiz"
              sub="61 Themen · Klasse 1–13"
              foto={FOTO.quiz}
              mobil={mobil}
            />
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

function Glied({ href, bg, bgDeep, nummer, label, titel, sub, foto, note1, mobil }: { href: string; bg: string; bgDeep: string; nummer: string; label: string; titel: string; sub: string; foto: string; note1?: boolean; mobil: boolean }) {
  return (
    <a href={href} className="glied" style={{ display: 'block', textDecoration: 'none', background: bg, borderRadius: '28px', padding: mobil ? '24px' : '32px', position: 'relative', overflow: 'hidden', boxShadow: '0 10px 28px rgba(28,28,30,0.06)', color: '#1c1c1e' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: mobil ? '18px' : '24px' }}>
        <span style={{ display: 'inline-block', background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(6px)', color: bgDeep, padding: '6px 14px', borderRadius: '999px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase' }}>
          {label}
        </span>
        <span style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: mobil ? '38px' : '48px', fontStyle: 'italic', fontWeight: 600, color: bgDeep, opacity: 0.55, lineHeight: 1, letterSpacing: '-0.02em' }}>{nummer}</span>
      </div>

      {/* Foto in weissem Rahmen wie ein Polaroid */}
      <div style={{ background: '#ffffff', padding: mobil ? '10px 10px 14px' : '12px 12px 16px', borderRadius: '14px', boxShadow: '0 6px 18px rgba(0,0,0,0.08)', marginBottom: mobil ? '20px' : '26px', position: 'relative', transform: 'rotate(-1deg)' }}>
        <div style={{ position: 'relative', aspectRatio: '4 / 3', borderRadius: '8px', overflow: 'hidden', background: '#f0f0f0' }}>
          <img src={foto} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          {note1 && (
            <div style={{ position: 'absolute', top: '12px', right: '14px', transform: 'rotate(-8deg)', color: '#dc2626', fontFamily: '"Caveat", cursive', fontWeight: 700, fontSize: mobil ? '64px' : '84px', lineHeight: 0.9, textShadow: '0 2px 6px rgba(255,255,255,0.6)', letterSpacing: '-0.02em' }}>
              1
              <div style={{ fontSize: mobil ? '14px' : '16px', fontWeight: 700, marginTop: '2px', textShadow: '0 1px 4px rgba(255,255,255,0.6)' }}>sehr gut!</div>
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '12px' }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: mobil ? '30px' : '38px', fontWeight: 700, margin: '0 0 4px', letterSpacing: '-0.02em', lineHeight: 1.0 }}>{titel}</h3>
          <p style={{ fontSize: '14.5px', margin: 0, color: 'rgba(28,28,30,0.65)', fontWeight: 500 }}>{sub}</p>
        </div>
        <span className="arrow" style={{ fontSize: '24px', color: bgDeep, fontWeight: 700, lineHeight: 1 }}>→</span>
      </div>
    </a>
  );
}
