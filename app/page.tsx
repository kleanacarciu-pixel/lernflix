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
  mint: '#d8efe3',
  mintDeep: '#3f9b73',
  peach: '#fde0d0',
  peachDeep: '#d97a4f',
  sky: '#dbeaf3',
  skyDeep: '#3c80a8',
  lavender: '#e6dcf3',
  lavenderDeep: '#7656b0',
  sun: '#ffe4a3',
  sunDeep: '#d99a36',
  dark: '#1c1c1e',
};

const SERIF = '"Cormorant Garamond", Georgia, serif';
const SANS = '"Inter", -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif';

const FOTO = {
  shop: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1200&auto=format&fit=crop&q=85',
  lernplan: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=1200&auto=format&fit=crop&q=85',
  lernheld: 'https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=1200&auto=format&fit=crop&q=85',
  quiz: 'https://images.unsplash.com/photo-1607706189992-eae578626c86?w=1200&auto=format&fit=crop&q=85',
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
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) both; }
        .btn-primary { transition: all 0.25s ease; }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 14px 30px rgba(255,122,107,0.32); }
        .btn-ghost { transition: all 0.25s ease; }
        .btn-ghost:hover { background: ${F.ink}; color: ${F.white}; }
        .editorial-btn { transition: all 0.25s ease; }
        .editorial-btn:hover { transform: translateX(6px); }
        .foto-wrap { transition: transform 0.5s cubic-bezier(0.2,0.8,0.2,1); }
        .glied-section:hover .foto-wrap { transform: scale(1.02); }
        .glied-section { transition: background 0.3s ease; }
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

      {/* HERO - editorial, asymmetrisch, gross */}
      <section className="fade-up" style={{ background: F.bgWarm, paddingTop: mobil ? '120px' : '150px', paddingBottom: mobil ? '70px' : '120px', paddingLeft: mobil ? '22px' : '60px', paddingRight: mobil ? '22px' : '60px', position: 'relative', overflow: 'hidden' }}>
        {!mobil && (
          <>
            <div style={{ position: 'absolute', top: '160px', right: '6%', width: '180px', height: '180px', borderRadius: '50%', background: F.mint, opacity: 0.35 }} />
            <div style={{ position: 'absolute', bottom: '40px', left: '4%', width: '120px', height: '120px', borderRadius: '50%', background: F.sky, opacity: 0.4 }} />
            <div style={{ position: 'absolute', top: '45%', right: '38%', width: '80px', height: '80px', borderRadius: '50%', background: F.lavender, opacity: 0.5 }} />
          </>
        )}
        <div style={{ maxWidth: '1240px', margin: '0 auto', position: 'relative' }}>
          <span style={{ display: 'inline-block', background: F.white, color: F.coral, padding: '8px 20px', borderRadius: '999px', fontSize: '11.5px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '32px', boxShadow: '0 4px 14px rgba(255,122,107,0.18)' }}>
            ✦ Die Lern-Plattform
          </span>
          <h1 style={{ fontFamily: SERIF, fontSize: mobil ? '58px' : '140px', fontWeight: 600, lineHeight: 0.92, margin: '0 0 32px', color: F.ink, letterSpacing: '-0.04em', maxWidth: '1100px' }}>
            Alles fürs Lernen,<br /><span style={{ fontStyle: 'italic', color: F.coral }}>an einem Ort</span>.
          </h1>
          <div style={{ display: 'flex', gap: mobil ? '14px' : '60px', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <p style={{ fontSize: mobil ? '17px' : '20px', color: F.inkSoft, lineHeight: 1.55, margin: 0, maxWidth: '480px' }}>
              Lernmaterialien zum Kaufen, dein eigener Lernplan, der Lernheld für Schulaufgaben und ein kostenloses Quiz.
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <a href="#bereich-01" className="btn-primary" style={{ background: F.coral, color: F.white, textDecoration: 'none', padding: '17px 34px', borderRadius: '999px', fontSize: '15px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                Loslegen →
              </a>
              <a href="/shop" className="btn-ghost" style={{ background: 'transparent', color: F.ink, textDecoration: 'none', padding: '17px 34px', borderRadius: '999px', fontSize: '15px', fontWeight: 600, border: `1.5px solid ${F.ink}` }}>
                Zum Shop
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 4 EDITORIAL SECTIONS - alternierend, asymmetrisch */}
      <GliedSection
        id="bereich-01"
        href="/shop"
        bg={F.sky}
        akzent={F.skyDeep}
        nummer="01"
        label="Shop"
        titel="Lern&shy;materialien"
        kicker="Dein Bücherregal."
        text="13 schöne Lernpakete für Mathematik und Physik. Mit Erklärungen, Skizzen und Übungen. Sofort verfügbar — ab 0,99 €."
        cta="Zum Shop"
        foto={FOTO.shop}
        fotoLinks={false}
        mobil={mobil}
      />

      <GliedSection
        href="/lernplan"
        bg={F.mint}
        akzent={F.mintDeep}
        nummer="02"
        label="Kostenlos"
        titel="Mein Lernplan"
        kicker="Deine Woche, geplant."
        text="Stundenplan, Hausaufgaben, Lernblöcke und Pausen — übersichtlich aufs Handy oder zum Ausdrucken."
        cta="Plan erstellen"
        foto={FOTO.lernplan}
        fotoLinks={true}
        mobil={mobil}
      />

      <GliedSection
        href="/lernheld"
        bg={F.peach}
        akzent={F.peachDeep}
        nummer="03"
        label="Premium · 1,99 €"
        titel="Lernheld"
        kicker="Auf die Eins lernen."
        text="Foto vom Stoff hochladen, Klasse wählen, fertig. Dein persönlicher Plan für die nächste Schulaufgabe — mit Erklärungen, Übungen und Lösungen."
        cta="Plan jetzt erstellen"
        foto={FOTO.lernheld}
        fotoLinks={false}
        note1
        mobil={mobil}
      />

      <GliedSection
        href="/quiz"
        bg={F.lavender}
        akzent={F.lavenderDeep}
        nummer="04"
        label="Kostenlos"
        titel="Quiz"
        kicker="Teste dein Wissen."
        text="61 Themen für Klasse 1 bis 13. Wähle Fach und Klassenstufe — jede Runde gibt es neue Fragen."
        cta="Zum Quiz"
        foto={FOTO.quiz}
        fotoLinks={true}
        mobil={mobil}
      />

      {/* FOOTER */}
      <footer style={{ background: F.dark, color: F.white, padding: mobil ? '60px 22px 30px' : '90px 60px 40px' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
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

function GliedSection({ id, href, bg, akzent, nummer, label, titel, kicker, text, cta, foto, fotoLinks, note1, mobil }: { id?: string; href: string; bg: string; akzent: string; nummer: string; label: string; titel: string; kicker: string; text: string; cta: string; foto: string; fotoLinks: boolean; note1?: boolean; mobil: boolean }) {
  return (
    <section id={id} className="glied-section" style={{ background: bg, padding: mobil ? '70px 22px' : '120px 60px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'grid', gridTemplateColumns: mobil ? '1fr' : '1.1fr 1fr', gap: mobil ? '40px' : '80px', alignItems: 'center', direction: !mobil && fotoLinks ? 'rtl' : 'ltr' }}>
        <div style={{ direction: 'ltr' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '20px', marginBottom: '24px' }}>
            <span style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: mobil ? '60px' : '96px', fontStyle: 'italic', fontWeight: 600, color: akzent, opacity: 0.4, lineHeight: 0.9, letterSpacing: '-0.03em' }}>{nummer}</span>
            <span style={{ display: 'inline-block', background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(6px)', color: akzent, padding: '7px 16px', borderRadius: '999px', fontSize: '11.5px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
              {label}
            </span>
          </div>
          <h2 style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: mobil ? '48px' : '88px', fontWeight: 600, color: '#1c1c1e', margin: '0 0 12px', lineHeight: 0.94, letterSpacing: '-0.035em' }} dangerouslySetInnerHTML={{ __html: titel }} />
          <p style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontStyle: 'italic', fontSize: mobil ? '20px' : '26px', color: akzent, margin: '0 0 22px', fontWeight: 500, letterSpacing: '-0.01em' }}>{kicker}</p>
          <p style={{ fontSize: mobil ? '15.5px' : '17px', color: 'rgba(28,28,30,0.72)', lineHeight: 1.6, margin: '0 0 32px', maxWidth: '480px' }}>{text}</p>
          <a href={href} className="editorial-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: '#1c1c1e', color: '#ffffff', textDecoration: 'none', padding: '15px 28px', borderRadius: '999px', fontSize: '14.5px', fontWeight: 600 }}>
            {cta} <span style={{ fontSize: '18px', lineHeight: 1 }}>→</span>
          </a>
        </div>
        <div style={{ direction: 'ltr', position: 'relative' }}>
          <div className="foto-wrap" style={{ position: 'relative', borderRadius: '20px', overflow: 'hidden', aspectRatio: '4 / 3', boxShadow: '0 30px 60px rgba(28,28,30,0.18)' }}>
            <img src={foto} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
            {note1 && (
              <div style={{ position: 'absolute', top: '24px', right: '32px', transform: 'rotate(-9deg)', color: '#dc2626', fontFamily: '"Caveat", cursive', fontWeight: 700, fontSize: mobil ? '90px' : '128px', lineHeight: 0.9, letterSpacing: '-0.02em', textShadow: '0 2px 8px rgba(255,255,255,0.7)' }}>
                1
                <div style={{ fontSize: mobil ? '20px' : '26px', fontWeight: 700, marginTop: '2px', textShadow: '0 1px 4px rgba(255,255,255,0.7)' }}>sehr gut!</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
