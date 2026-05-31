'use client';
import { useEffect, useState } from 'react';

const F = {
  bg: '#fffdf9',
  bgWarm: '#fef4e6',
  ink: '#0f0f10',
  inkSoft: '#5a5a5e',
  inkMuted: '#9a9a9e',
  border: '#f0ece3',
  white: '#ffffff',
  coral: '#ff5b4a',
  coralDeep: '#e53e2d',
  mint: '#c5ead6',
  mintDeep: '#2e8a5c',
  peach: '#fdd0bb',
  peachDeep: '#cf6a3e',
  sky: '#c8dff0',
  skyDeep: '#2e6e9c',
  lavender: '#dccff0',
  lavenderDeep: '#6c4aa3',
  sun: '#ffd86b',
  sunDeep: '#c98a1e',
  dark: '#0f0f10',
};

const SERIF = '"Cormorant Garamond", Georgia, serif';
const SANS = '"Inter", -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif';
const HAND = '"Caveat", cursive';

const FOTO = {
  shop: 'https://images.unsplash.com/photo-1535905557558-afc4877a26fc?w=1200&auto=format&fit=crop&q=85',
  lernplan: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=1200&auto=format&fit=crop&q=85',
  lernheld: 'https://images.unsplash.com/photo-1488998427799-e3362cec87c3?w=1200&auto=format&fit=crop&q=85',
  quiz: 'https://images.unsplash.com/photo-1626387346567-68d0c4fbd2cf?w=1200&auto=format&fit=crop&q=85',
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
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@400;500;600;700;800;900&display=swap" />

      <style>{`
        * { -webkit-font-smoothing: antialiased; }
        body { background: ${F.bg}; margin: 0; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes wiggle { 0%, 100% { transform: rotate(-6deg); } 50% { transform: rotate(-3deg); } }
        .fade-up { animation: fadeUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) both; }
        .marquee-track { animation: marquee 30s linear infinite; }
        .sticker { animation: wiggle 4s ease-in-out infinite; }
        .btn-primary { transition: all 0.25s ease; }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 14px 30px rgba(255,91,74,0.32); }
        .btn-ghost { transition: all 0.25s ease; }
        .btn-ghost:hover { background: ${F.ink}; color: ${F.white}; }
        .editorial-btn { transition: all 0.25s ease; }
        .editorial-btn:hover { transform: translateX(6px); }
        .glied-section .foto-wrap { transition: transform 0.6s cubic-bezier(0.2,0.8,0.2,1); }
        .glied-section:hover .foto-wrap { transform: scale(1.02) rotate(-1deg); }
        .grain {
          position: absolute; inset: 0; pointer-events: none; opacity: 0.06;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }
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

      {/* HERO mit grossen Stickern */}
      <section className="fade-up" style={{ background: F.bgWarm, paddingTop: mobil ? '120px' : '150px', paddingBottom: mobil ? '50px' : '80px', paddingLeft: mobil ? '22px' : '60px', paddingRight: mobil ? '22px' : '60px', position: 'relative', overflow: 'hidden' }}>
        <div className="grain" />
        {!mobil && (
          <>
            {/* Schwebende sticker */}
            <div className="sticker" style={{ position: 'absolute', top: '180px', right: '8%', background: F.mint, color: F.mintDeep, padding: '12px 22px', borderRadius: '999px', fontFamily: HAND, fontSize: '28px', fontWeight: 700, transform: 'rotate(-6deg)', boxShadow: '0 8px 24px rgba(46,138,92,0.25)', border: `2px solid ${F.white}` }}>
              kostenlos!
            </div>
            <div style={{ position: 'absolute', bottom: '60px', right: '14%', background: F.sun, color: F.ink, padding: '10px 18px', borderRadius: '12px', fontFamily: SANS, fontSize: '13px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', transform: 'rotate(4deg)', boxShadow: '0 6px 20px rgba(201,138,30,0.25)', border: `2px solid ${F.white}` }}>
              Klasse 1—13
            </div>
            <div style={{ position: 'absolute', top: '38%', right: '4%', background: F.coral, color: F.white, padding: '14px 20px', borderRadius: '50%', fontFamily: HAND, fontSize: '22px', fontWeight: 700, transform: 'rotate(8deg)', boxShadow: '0 6px 20px rgba(255,91,74,0.32)', width: '90px', height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', lineHeight: 1.05 }}>
              neu da
            </div>
          </>
        )}
        <div style={{ maxWidth: '1240px', margin: '0 auto', position: 'relative' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: F.ink, color: F.white, padding: '8px 18px', borderRadius: '999px', fontSize: '11.5px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '32px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: F.coral, boxShadow: `0 0 12px ${F.coral}` }} /> Die Lern-Plattform
          </span>
          <h1 style={{ fontFamily: SERIF, fontSize: mobil ? '60px' : '152px', fontWeight: 600, lineHeight: 0.9, margin: '0 0 32px', color: F.ink, letterSpacing: '-0.045em', maxWidth: '1140px' }}>
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

      {/* NETFLIX-STYLE MARQUEE - schwarzer streifen mit scrolling text */}
      <div style={{ background: F.ink, color: F.white, padding: '22px 0', overflow: 'hidden', borderTop: `2px solid ${F.coral}`, borderBottom: `2px solid ${F.coral}` }}>
        <div className="marquee-track" style={{ display: 'inline-flex', whiteSpace: 'nowrap', willChange: 'transform' }}>
          {[...Array(2)].map((_, j) => (
            <div key={j} style={{ display: 'inline-flex', alignItems: 'center' }}>
              {['13 LERNPAKETE', 'MATHE & PHYSIK', 'KLASSE 1 BIS 13', 'AB 0,99 €', 'QUIZ KOSTENLOS', 'LERNHELD PREMIUM', 'LERNPLAN GRATIS', 'SCHNELLE HILFE'].map((t, i) => (
                <span key={`${j}-${i}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '36px', paddingRight: '36px', fontFamily: SERIF, fontSize: '34px', fontWeight: 600, letterSpacing: '-0.01em', fontStyle: i % 2 === 1 ? 'italic' : 'normal', color: i % 3 === 0 ? F.coral : F.white }}>
                  {t}
                  <span style={{ color: F.coral, fontSize: '20px' }}>✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* 4 EDITORIAL SECTIONS - alternierend */}
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
        sticker={{ text: '13 Pakete', farbe: F.sun, hand: false }}
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
        sticker={{ text: 'gratis!', farbe: F.coral, hand: true }}
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
        sticker={{ text: '61 Themen', farbe: F.sun, hand: false }}
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

function GliedSection({ id, href, bg, akzent, nummer, label, titel, kicker, text, cta, foto, fotoLinks, note1, sticker, mobil }: { id?: string; href: string; bg: string; akzent: string; nummer: string; label: string; titel: string; kicker: string; text: string; cta: string; foto: string; fotoLinks: boolean; note1?: boolean; sticker?: { text: string; farbe: string; hand: boolean }; mobil: boolean }) {
  return (
    <section id={id} className="glied-section" style={{ background: bg, padding: mobil ? '70px 22px' : '120px 60px', position: 'relative', overflow: 'hidden' }}>
      <div className="grain" />
      <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'grid', gridTemplateColumns: mobil ? '1fr' : '1.1fr 1fr', gap: mobil ? '40px' : '80px', alignItems: 'center', direction: !mobil && fotoLinks ? 'rtl' : 'ltr', position: 'relative' }}>
        <div style={{ direction: 'ltr' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '20px', marginBottom: '24px' }}>
            <span style={{ fontFamily: SERIF, fontSize: mobil ? '64px' : '108px', fontStyle: 'italic', fontWeight: 600, color: akzent, opacity: 0.35, lineHeight: 0.9, letterSpacing: '-0.04em' }}>{nummer}</span>
            <span style={{ display: 'inline-block', background: '#0f0f10', color: '#ffffff', padding: '8px 18px', borderRadius: '999px', fontSize: '11.5px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
              {label}
            </span>
          </div>
          <h2 style={{ fontFamily: SERIF, fontSize: mobil ? '52px' : '104px', fontWeight: 600, color: '#0f0f10', margin: '0 0 12px', lineHeight: 0.9, letterSpacing: '-0.04em' }} dangerouslySetInnerHTML={{ __html: titel }} />
          <p style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: mobil ? '22px' : '30px', color: akzent, margin: '0 0 24px', fontWeight: 500, letterSpacing: '-0.01em' }}>{kicker}</p>
          <p style={{ fontSize: mobil ? '15.5px' : '17px', color: 'rgba(15,15,16,0.72)', lineHeight: 1.6, margin: '0 0 32px', maxWidth: '480px' }}>{text}</p>
          <a href={href} className="editorial-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: '#0f0f10', color: '#ffffff', textDecoration: 'none', padding: '15px 28px', borderRadius: '999px', fontSize: '14.5px', fontWeight: 600 }}>
            {cta} <span style={{ fontSize: '18px', lineHeight: 1 }}>→</span>
          </a>
        </div>
        <div style={{ direction: 'ltr', position: 'relative' }}>
          <div className="foto-wrap" style={{ position: 'relative', borderRadius: '6px', overflow: 'hidden', aspectRatio: '4 / 3', boxShadow: '0 30px 70px rgba(15,15,16,0.22), 0 0 0 6px #ffffff, 0 0 0 8px rgba(15,15,16,0.12)' }}>
            <img src={foto} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
            {note1 && (
              <div style={{ position: 'absolute', top: '24px', right: '32px', transform: 'rotate(-9deg)', color: '#dc2626', fontFamily: HAND, fontWeight: 700, fontSize: mobil ? '96px' : '140px', lineHeight: 0.9, letterSpacing: '-0.02em', textShadow: '0 2px 8px rgba(255,255,255,0.7)' }}>
                1
                <div style={{ fontSize: mobil ? '22px' : '30px', fontWeight: 700, marginTop: '2px', textShadow: '0 1px 4px rgba(255,255,255,0.7)' }}>sehr gut!</div>
              </div>
            )}
          </div>
          {sticker && (
            <div style={{ position: 'absolute', bottom: '-18px', left: fotoLinks ? 'auto' : '-22px', right: fotoLinks ? '-22px' : 'auto', transform: `rotate(${fotoLinks ? '6' : '-6'}deg)`, background: sticker.farbe, color: '#0f0f10', padding: sticker.hand ? '14px 24px' : '12px 22px', borderRadius: sticker.hand ? '999px' : '14px', fontFamily: sticker.hand ? HAND : SANS, fontSize: sticker.hand ? '32px' : '14px', fontWeight: 700, letterSpacing: sticker.hand ? '0' : '0.12em', textTransform: sticker.hand ? 'none' : 'uppercase', boxShadow: '0 10px 24px rgba(15,15,16,0.18)', border: `3px solid ${F.white}` }}>
              {sticker.text}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
