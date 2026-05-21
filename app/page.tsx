'use client';
import { useState, useEffect } from 'react';

type Produkt = {
  id: number;
  kategorie: string;
  typ: string;
  titel: string;
  beschreibung: string;
  details: string[];
  seiten: string;
  preis: number;
  vorschau: string;
  emoji: string;
  farbe: string;
  hellfarbe: string;
};

export default function Home() {
  const [ausgewaehlt, setAusgewaehlt] = useState<Produkt | null>(null);
  const [phase, setPhase] = useState<'kratzen' | 'weglaufen' | 'zurueck' | 'schild'>('kratzen');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const run = () => {
      setPhase('kratzen');
      setTimeout(() => setPhase('weglaufen'), 3500);
      setTimeout(() => setPhase('zurueck'), 5500);
      setTimeout(() => setPhase('schild'), 7200);
    };
    run();
    const loop = setInterval(run, 12000);
    return () => clearInterval(loop);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const kaufen = async (productName: string, price: number) => {
    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productName, price }),
    });
    const data = await response.json();
    if (data.url) window.location.href = data.url;
  };

  const produkte: Produkt[] = [
    {
      id: 1, kategorie: 'mathe', typ: 'Formelsammlung', titel: 'Geometrie Klasse 6–9',
      beschreibung: 'Alle Geometrie-Formeln von Klasse 6 bis 9 — mit Figuren, Beispielen und Erklärungen.',
      details: ['8 vollständige Kapitel', 'Alle Formeln für Vierecke, Dreiecke, Kreis', 'Alle 3D-Körper: Würfel, Zylinder, Kegel, Kugel', 'Satz des Pythagoras mit Erklärung', 'Ähnlichkeit und Strahlensätze', 'Übersichtstabelle am Ende', 'Mit Witzen und Tipps — kinderfreundlich!'],
      seiten: '12 Seiten', preis: 1.99, vorschau: '/geometrie-vorschau.jpeg', emoji: '📐', farbe: '#0071e3', hellfarbe: '#e8f0fe',
    },
    {
      id: 2, kategorie: 'mathe', typ: 'Arbeitsblatt', titel: 'Potenzen',
      beschreibung: 'Alles über Potenzen — Regeln, Beispiele und Übungen. Perfekt für Klasse 7–9.',
      details: ['Potenzregeln vollständig erklärt', 'Negative Exponenten', 'Potenzieren mit Brüchen', 'Übungsaufgaben mit Lösungen', 'Einfache und verständliche Sprache'],
      seiten: 'PDF', preis: 0.99, vorschau: '/potenzen-vorschau.jpeg', emoji: '🔢', farbe: '#0071e3', hellfarbe: '#e8f0fe',
    },
    {
      id: 3, kategorie: 'physik', typ: 'Formelsammlung', titel: 'Mechanik',
      beschreibung: 'Alle wichtigen Mechanik-Formeln — Kraft, Geschwindigkeit, Energie und mehr.',
      details: ['Kraft, Masse, Beschleunigung', 'Geschwindigkeit und Bewegung', 'Energie und Arbeit', 'Hebel und Drehmoment', 'Mit Beispielen und Erklärungen'],
      seiten: 'PDF', preis: 0.99, vorschau: '/mechanik-vorschau.jpeg', emoji: '⚡', farbe: '#0071e3', hellfarbe: '#e8f0fe',
    },
  ];

  const mathe = produkte.filter(p => p.kategorie === 'mathe');
  const physik = produkte.filter(p => p.kategorie === 'physik');

  const ProduktKarte = ({ p }: { p: Produkt }) => (
    <div
      onClick={() => setAusgewaehlt(p)}
      style={{backgroundColor: '#ffffff', borderRadius: '18px', border: '1px solid #e5e5ea', overflow: 'hidden', cursor: 'pointer', transition: 'all 0.3s ease', boxShadow: '0 2px 12px rgba(0,0,0,0.06)'}}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-6px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 12px 32px rgba(0,0,0,0.12)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)'; }}
    >
      <div style={{backgroundColor: p.hellfarbe, height: '180px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px'}}>
        <span style={{fontSize: '64px'}}>{p.emoji}</span>
        <span style={{fontSize: '11px', fontWeight: '700', color: p.farbe, textTransform: 'uppercase', letterSpacing: '0.1em'}}>{p.typ}</span>
      </div>
      <div style={{padding: '20px'}}>
        <h4 style={{margin: '0 0 8px', fontSize: '17px', fontWeight: '700', color: '#1d1d1f'}}>{p.titel}</h4>
        <p style={{margin: '0 0 16px', fontSize: '14px', color: '#6e6e73', lineHeight: '1.5'}}>{p.beschreibung}</p>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <span style={{fontSize: '22px', fontWeight: '700', color: '#1d1d1f'}}>{p.preis.toFixed(2).replace('.', ',')} €</span>
          <span style={{fontSize: '14px', color: p.farbe, fontWeight: '600', backgroundColor: p.hellfarbe, padding: '6px 16px', borderRadius: '20px'}}>Details →</span>
        </div>
      </div>
    </div>
  );

  const kategorien = [
    {
      href: '#mathe',
      titel: 'Mathematik',
      desc: 'Formeln, Übungen & Erklärungen',
      farbe: '#0071e3',
      gradient: 'linear-gradient(135deg, #0071e3 0%, #0051a0 100%)',
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <rect x="4" y="4" width="14" height="14" rx="3" fill="white" fillOpacity="0.9"/>
          <rect x="22" y="4" width="14" height="14" rx="3" fill="white" fillOpacity="0.6"/>
          <rect x="4" y="22" width="14" height="14" rx="3" fill="white" fillOpacity="0.6"/>
          <path d="M25 25h8M29 21v8" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
      ),
    },
    {
      href: '#physik',
      titel: 'Physik',
      desc: 'Gesetze, Formeln & Experimente',
      farbe: '#5856d6',
      gradient: 'linear-gradient(135deg, #5856d6 0%, #3634a3 100%)',
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="5" fill="white"/>
          <ellipse cx="20" cy="20" rx="16" ry="7" stroke="white" strokeWidth="2" fill="none" strokeOpacity="0.7"/>
          <ellipse cx="20" cy="20" rx="16" ry="7" stroke="white" strokeWidth="2" fill="none" strokeOpacity="0.7" transform="rotate(60 20 20)"/>
          <ellipse cx="20" cy="20" rx="16" ry="7" stroke="white" strokeWidth="2" fill="none" strokeOpacity="0.7" transform="rotate(-60 20 20)"/>
        </svg>
      ),
    },
    {
      href: '#pakete',
      titel: 'Lernpakete',
      desc: 'Abitur, Sommer & Spezialthemen',
      farbe: '#34c759',
      gradient: 'linear-gradient(135deg, #34c759 0%, #248a3d 100%)',
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <rect x="6" y="14" width="28" height="20" rx="3" fill="white" fillOpacity="0.2" stroke="white" strokeWidth="2"/>
          <path d="M14 14V10a6 6 0 0 1 12 0v4" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          <path d="M20 22v4M16 24h8" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
    },
    {
      href: '/quiz',
      titel: 'Quizze',
      desc: 'Kostenlos Wissen testen',
      farbe: '#ff9500',
      gradient: 'linear-gradient(135deg, #ff9500 0%, #cc7700 100%)',
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="14" stroke="white" strokeWidth="2" fill="none"/>
          <path d="M16 16.5C16 14 17.5 12 20 12c2.5 0 4 1.8 4 3.5 0 3-4 4-4 7" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
          <circle cx="20" cy="27" r="1.5" fill="white"/>
        </svg>
      ),
    },
  ];

  return (
    <main style={{minHeight: '100vh', backgroundColor: '#ffffff', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif'}}>

      <style>{`
        @keyframes beinLinks { 0%,100%{transform:rotate(-28deg)}50%{transform:rotate(28deg)} }
        @keyframes beinRechts { 0%,100%{transform:rotate(28deg)}50%{transform:rotate(-28deg)} }
        @keyframes frage1 { 0%,100%{transform:translateY(0) scale(1);opacity:1}50%{transform:translateY(-18px) scale(1.2);opacity:0.4} }
        @keyframes frage2 { 0%,100%{transform:translateY(0) scale(1);opacity:0.8}50%{transform:translateY(-14px) scale(1.15);opacity:0.3} }
        @keyframes frage3 { 0%,100%{transform:translateY(0) scale(1);opacity:0.6}50%{transform:translateY(-10px) scale(1.1);opacity:0.2} }
        @keyframes schildRein { 0%{transform:scale(0) rotate(-20deg);opacity:0}100%{transform:scale(1) rotate(0deg);opacity:1} }
        @keyframes blinzeln { 0%,85%,100%{transform:scaleY(1)}92%{transform:scaleY(0.05)} }
        @keyframes schweben { 0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)} }
        @keyframes schildSchaukeln { 0%,100%{transform:rotate(-2deg)}50%{transform:rotate(2deg)} }
        @keyframes formelSchweben1 { 0%,100%{transform:translateY(0) rotate(-5deg);opacity:0.12}50%{transform:translateY(-20px) rotate(5deg);opacity:0.22} }
        @keyframes formelSchweben2 { 0%,100%{transform:translateY(0) rotate(3deg);opacity:0.1}50%{transform:translateY(-15px) rotate(-3deg);opacity:0.18} }
        @keyframes formelSchweben3 { 0%,100%{transform:translateY(0);opacity:0.08}50%{transform:translateY(-25px);opacity:0.16} }
        @keyframes gradientMove { 0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%} }
      `}</style>

      {ausgewaehlt && (
        <div onClick={() => setAusgewaehlt(null)} style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(10px)'}}>
          <div onClick={e => e.stopPropagation()} style={{backgroundColor: 'white', borderRadius: '24px', maxWidth: '700px', width: '100%', overflow: 'hidden', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 24px 80px rgba(0,0,0,0.2)'}}>
            <div style={{position: 'relative', height: '300px', backgroundColor: '#f5f5f7'}}>
              <img src={ausgewaehlt.vorschau} alt={ausgewaehlt.titel} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
              <button onClick={() => setAusgewaehlt(null)} style={{position: 'absolute', top: '16px', right: '16px', backgroundColor: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', fontSize: '16px', cursor: 'pointer', color: 'white'}}>✕</button>
            </div>
            <div style={{padding: '32px'}}>
              <h2 style={{margin: '0 0 8px', fontSize: '24px', fontWeight: '700', color: '#1d1d1f'}}>{ausgewaehlt.emoji} {ausgewaehlt.titel}</h2>
              <p style={{margin: '0 0 24px', fontSize: '15px', color: '#6e6e73', lineHeight: '1.6'}}>{ausgewaehlt.beschreibung}</p>
              <div style={{backgroundColor: '#f5f5f7', borderRadius: '12px', padding: '20px', marginBottom: '24px'}}>
                <p style={{margin: '0 0 12px', fontSize: '14px', fontWeight: '700', color: '#1d1d1f'}}>Was ist drin:</p>
                {ausgewaehlt.details.map((d, i) => (
                  <div key={i} style={{display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '8px'}}>
                    <span style={{color: '#0071e3', fontWeight: '700', fontSize: '14px', flexShrink: 0}}>✓</span>
                    <span style={{fontSize: '14px', color: '#1d1d1f'}}>{d}</span>
                  </div>
                ))}
              </div>
              <div style={{display: 'flex', gap: '10px', marginBottom: '28px', flexWrap: 'wrap'}}>
                <span style={{fontSize: '12px', color: '#6e6e73', backgroundColor: '#f5f5f7', padding: '6px 14px', borderRadius: '20px'}}>📄 {ausgewaehlt.seiten}</span>
                <span style={{fontSize: '12px', color: '#6e6e73', backgroundColor: '#f5f5f7', padding: '6px 14px', borderRadius: '20px'}}>⬇️ Sofort-Download</span>
                <span style={{fontSize: '12px', color: '#6e6e73', backgroundColor: '#f5f5f7', padding: '6px 14px', borderRadius: '20px'}}>🔒 Sicher via Stripe</span>
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e5e5ea', paddingTop: '24px'}}>
                <div>
                  <p style={{margin: '0', fontSize: '13px', color: '#6e6e73'}}>Preis</p>
                  <p style={{margin: '0', fontSize: '32px', fontWeight: '700', color: '#1d1d1f'}}>{ausgewaehlt.preis.toFixed(2).replace('.', ',')} €</p>
                </div>
                <button onClick={() => kaufen(ausgewaehlt.titel, ausgewaehlt.preis)} style={{backgroundColor: '#0071e3', color: 'white', border: 'none', borderRadius: '12px', padding: '14px 32px', fontSize: '16px', fontWeight: '600', cursor: 'pointer'}}>
                  Jetzt kaufen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header style={{position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, backgroundColor: scrolled ? 'rgba(255,255,255,0.85)' : 'transparent', backdropFilter: scrolled ? 'blur(20px)' : 'none', borderBottom: scrolled ? '1px solid rgba(0,0,0,0.1)' : 'none', padding: '16px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all 0.3s ease'}}>
        <img src="/logo.jpg?v=1" alt="Lerne mit Anna" style={{height: '44px'}} />
        <nav style={{display: 'flex', gap: '32px'}}>
          <a href="#mathe" style={{color: '#1d1d1f', textDecoration: 'none', fontSize: '14px', fontWeight: '500'}}>Mathe</a>
          <a href="#physik" style={{color: '#1d1d1f', textDecoration: 'none', fontSize: '14px', fontWeight: '500'}}>Physik</a>
          <a href="#pakete" style={{color: '#1d1d1f', textDecoration: 'none', fontSize: '14px', fontWeight: '500'}}>Lernpakete</a>
          <a href="/quiz" style={{color: '#0071e3', textDecoration: 'none', fontSize: '14px', fontWeight: '600'}}>Quiz</a>
        </nav>
      </header>

      {/* HERO */}
      <section style={{minHeight: '100vh', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '100px 24px 60px', overflow: 'hidden'}}>

        {/* Animierter Gradient Hintergrund */}
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #f0f4ff 0%, #ffffff 30%, #f5f0ff 60%, #f0f8ff 100%)', backgroundSize: '400% 400%', animation: 'gradientMove 8s ease infinite', zIndex: 0}}></div>

        {/* Schwebende Formeln */}
        <div style={{position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', overflow: 'hidden'}}>
          {[
            {text: 'x²', top: '15%', left: '8%', size: '36px', delay: '0s', anim: 'formelSchweben1 4s ease-in-out infinite'},
            {text: 'E=mc²', top: '20%', right: '10%', size: '28px', delay: '1s', anim: 'formelSchweben2 5s ease-in-out infinite 1s'},
            {text: 'π', top: '70%', left: '6%', size: '40px', delay: '0.5s', anim: 'formelSchweben3 4.5s ease-in-out infinite 0.5s'},
            {text: 'a²+b²=c²', top: '12%', left: '25%', size: '22px', delay: '2s', anim: 'formelSchweben1 6s ease-in-out infinite 2s'},
            {text: 'F=ma', top: '75%', right: '8%', size: '26px', delay: '1.5s', anim: 'formelSchweben2 5.5s ease-in-out infinite 1.5s'},
            {text: '∑', top: '30%', right: '20%', size: '32px', delay: '3s', anim: 'formelSchweben3 7s ease-in-out infinite 3s'},
            {text: 'v=λf', top: '60%', left: '20%', size: '24px', delay: '2.5s', anim: 'formelSchweben1 5s ease-in-out infinite 2.5s'},
            {text: '∫', top: '45%', right: '5%', size: '36px', delay: '0.8s', anim: 'formelSchweben2 4.8s ease-in-out infinite 0.8s'},
          ].map((f, i) => (
            <div key={i} style={{position: 'absolute', top: f.top, left: (f as {left?: string}).left, right: (f as {right?: string}).right, fontSize: f.size, fontWeight: '700', color: '#0071e3', fontFamily: 'Georgia, serif', animation: f.anim}}>
              {f.text}
            </div>
          ))}
        </div>

        {/* Heft Animation */}
        <div style={{position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'center', alignItems: 'flex-end', minHeight: '280px', marginBottom: '48px', width: '100%', maxWidth: '600px'}}>
          <div style={{transform: phase === 'weglaufen' ? 'translateX(600px)' : 'translateX(0px)', opacity: phase === 'weglaufen' ? 0 : 1, transition: phase === 'weglaufen' ? 'transform 1.5s ease-in, opacity 0.8s ease-in 0.7s' : 'transform 1.2s ease-out', position: 'relative'}}>

            {phase === 'kratzen' && (<>
              <div style={{position: 'absolute', top: '-70px', left: '50%', transform: 'translateX(-50%)', fontSize: '48px', fontWeight: '900', color: '#0071e3', animation: 'frage1 1.2s ease-in-out infinite'}}>?</div>
              <div style={{position: 'absolute', top: '-55px', left: '-35px', fontSize: '32px', fontWeight: '900', color: '#0071e3', opacity: 0.6, animation: 'frage2 1.5s ease-in-out infinite 0.3s'}}>?</div>
              <div style={{position: 'absolute', top: '-55px', right: '-35px', fontSize: '32px', fontWeight: '900', color: '#0071e3', opacity: 0.4, animation: 'frage3 1.8s ease-in-out infinite 0.6s'}}>?</div>
            </>)}

            <div style={{width: '140px', height: '170px', background: 'linear-gradient(135deg, #0071e3 0%, #0051a0 100%)', borderRadius: '12px 20px 20px 12px', position: 'relative', boxShadow: '0 20px 60px rgba(0,113,227,0.35)', animation: phase === 'kratzen' ? 'schweben 2.5s ease-in-out infinite' : 'none'}}>
              <div style={{position: 'absolute', left: '6px', top: '14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', height: '142px'}}>
                {[0,1,2,3,4,5,6,7,8].map(i => (
                  <div key={i} style={{width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#1d1d1f', border: '2.5px solid rgba(255,255,255,0.8)'}}></div>
                ))}
              </div>
              <div style={{position: 'absolute', top: '32px', left: '36px', display: 'flex', gap: '22px'}}>
                <div style={{width: '22px', height: '22px', backgroundColor: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'blinzeln 4s ease-in-out infinite'}}>
                  <div style={{width: '11px', height: '11px', backgroundColor: '#1d1d1f', borderRadius: '50%'}}></div>
                </div>
                <div style={{width: '22px', height: '22px', backgroundColor: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'blinzeln 4s ease-in-out infinite 0.2s'}}>
                  <div style={{width: '11px', height: '11px', backgroundColor: '#1d1d1f', borderRadius: '50%'}}></div>
                </div>
              </div>
              <div style={{position: 'absolute', top: '70px', left: '28px', width: '84px', height: '36px', borderBottom: '6px solid white', borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderRadius: '0 0 60px 60px'}}></div>
              <div style={{position: 'absolute', top: '64px', left: '22px', width: '18px', height: '10px', backgroundColor: '#ffaaaa', borderRadius: '50%', opacity: 0.85}}></div>
              <div style={{position: 'absolute', top: '64px', right: '16px', width: '18px', height: '10px', backgroundColor: '#ffaaaa', borderRadius: '50%', opacity: 0.85}}></div>
              <div style={{position: 'absolute', bottom: '30px', left: '28px', right: '12px', height: '3px', backgroundColor: 'rgba(255,255,255,0.35)', borderRadius: '2px'}}></div>
              <div style={{position: 'absolute', bottom: '46px', left: '28px', right: '12px', height: '3px', backgroundColor: 'rgba(255,255,255,0.35)', borderRadius: '2px'}}></div>
            </div>

            <div style={{display: 'flex', justifyContent: 'center', gap: '28px', marginTop: '6px'}}>
              <div style={{width: '14px', height: '46px', backgroundColor: '#1d1d1f', borderRadius: '7px', transformOrigin: 'top center', animation: phase !== 'schild' ? 'beinLinks 0.35s ease-in-out infinite' : 'none'}}></div>
              <div style={{width: '14px', height: '46px', backgroundColor: '#1d1d1f', borderRadius: '7px', transformOrigin: 'top center', animation: phase !== 'schild' ? 'beinRechts 0.35s ease-in-out infinite' : 'none'}}></div>
            </div>
          </div>

          {phase === 'schild' && (
            <div style={{position: 'absolute', right: 'calc(50% - 230px)', bottom: '50px', animation: 'schildRein 0.7s ease-out forwards'}}>
              <div style={{animation: 'schildSchaukeln 2s ease-in-out infinite'}}>
                <div style={{backgroundColor: '#1d1d1f', color: 'white', padding: '18px 36px', borderRadius: '16px', fontSize: '36px', fontWeight: '900', letterSpacing: '-1px', boxShadow: '0 12px 40px rgba(0,0,0,0.25)'}}>
                  LERNFLIX
                </div>
                <div style={{width: '8px', height: '50px', backgroundColor: '#1d1d1f', margin: '0 auto', borderRadius: '4px'}}></div>
              </div>
            </div>
          )}
        </div>

        {/* Slogan */}
        <div style={{position: 'relative', zIndex: 2, opacity: phase === 'schild' ? 1 : 0, transition: 'opacity 0.8s ease', marginBottom: '20px', minHeight: '32px'}}>
          <p style={{fontSize: '21px', color: '#6e6e73', letterSpacing: '0.5px', fontWeight: '400', margin: 0}}>Dein Lernstream. Deine Regeln.</p>
        </div>

        {/* Buttons */}
        <div style={{position: 'relative', zIndex: 2, display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap'}}>
          <a href="#mathe" style={{backgroundColor: '#0071e3', color: 'white', fontWeight: '600', padding: '14px 32px', borderRadius: '980px', textDecoration: 'none', fontSize: '16px', boxShadow: '0 4px 16px rgba(0,113,227,0.35)'}}>
            Materialien ansehen
          </a>
          <a href="/quiz" style={{backgroundColor: 'rgba(0,113,227,0.1)', color: '#0071e3', fontWeight: '600', padding: '14px 32px', borderRadius: '980px', textDecoration: 'none', fontSize: '16px'}}>
            Kostenlose Quizze
          </a>
        </div>
      </section>

      {/* Kategorien */}
      <section style={{backgroundColor: '#f5f5f7', padding: '80px 24px'}}>
        <div style={{maxWidth: '1100px', margin: '0 auto'}}>
          <h2 style={{fontSize: '32px', fontWeight: '700', color: '#1d1d1f', marginBottom: '12px', textAlign: 'center'}}>Alle Kategorien</h2>
          <p style={{fontSize: '17px', color: '#6e6e73', textAlign: 'center', marginBottom: '48px'}}>Wähle dein Fach und starte durch</p>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px'}}>
            {kategorien.map((k) => (
              <a key={k.titel} href={k.href} style={{textDecoration: 'none'}}>
                <div
                  style={{background: k.gradient, borderRadius: '20px', padding: '32px 28px', color: 'white', transition: 'all 0.3s ease', boxShadow: `0 4px 20px ${k.farbe}30`, position: 'relative', overflow: 'hidden'}}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-6px) scale(1.02)'; (e.currentTarget as HTMLDivElement).style.boxShadow = `0 16px 40px ${k.farbe}50`; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0) scale(1)'; (e.currentTarget as HTMLDivElement).style.boxShadow = `0 4px 20px ${k.farbe}30`; }}
                >
                  <div style={{marginBottom: '20px'}}>{k.icon}</div>
                  <h4 style={{margin: '0 0 8px', fontSize: '20px', fontWeight: '700', color: 'white'}}>{k.titel}</h4>
                  <p style={{margin: 0, fontSize: '14px', color: 'rgba(255,255,255,0.8)', lineHeight: '1.5'}}>{k.desc}</p>
                  <div style={{position: 'absolute', bottom: '20px', right: '20px', fontSize: '13px', fontWeight: '600', color: 'rgba(255,255,255,0.7)'}}>→</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Mathe */}
      <section id="mathe" style={{backgroundColor: '#ffffff', padding: '80px 24px'}}>
        <div style={{maxWidth: '1100px', margin: '0 auto'}}>
          <h2 style={{fontSize: '32px', fontWeight: '700', color: '#1d1d1f', marginBottom: '12px'}}>Mathematik</h2>
          <p style={{fontSize: '17px', color: '#6e6e73', marginBottom: '48px'}}>Formeln, Übungen und Erklärungen für die Schule</p>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px'}}>
            {mathe.map(p => <ProduktKarte key={p.id} p={p} />)}
          </div>
        </div>
      </section>

      {/* Physik */}
      <section id="physik" style={{backgroundColor: '#f5f5f7', padding: '80px 24px'}}>
        <div style={{maxWidth: '1100px', margin: '0 auto'}}>
          <h2 style={{fontSize: '32px', fontWeight: '700', color: '#1d1d1f', marginBottom: '12px'}}>Physik</h2>
          <p style={{fontSize: '17px', color: '#6e6e73', marginBottom: '48px'}}>Gesetze, Formeln und Experimente verständlich erklärt</p>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px'}}>
            {physik.map(p => <ProduktKarte key={p.id} p={p} />)}
          </div>
        </div>
      </section>

      {/* Lernpakete */}
      <section id="pakete" style={{backgroundColor: '#ffffff', padding: '80px 24px'}}>
        <div style={{maxWidth: '1100px', margin: '0 auto'}}>
          <h2 style={{fontSize: '32px', fontWeight: '700', color: '#1d1d1f', marginBottom: '12px'}}>Lernpakete</h2>
          <p style={{fontSize: '17px', color: '#6e6e73', marginBottom: '48px'}}>Spezielle Pakete für besondere Lernsituationen</p>
          <div style={{background: 'linear-gradient(135deg, #f5f5f7 0%, #ffffff 100%)', borderRadius: '20px', padding: '60px', textAlign: 'center', border: '1px solid #e5e5ea'}}>
            <div style={{width: '64px', height: '64px', background: 'linear-gradient(135deg, #34c759 0%, #248a3d 100%)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '32px'}}>🚀</div>
            <h4 style={{margin: '0 0 8px', fontSize: '22px', fontWeight: '700', color: '#1d1d1f'}}>Bald verfügbar!</h4>
            <p style={{margin: 0, fontSize: '15px', color: '#6e6e73'}}>Spezielle Lernpakete für Abitur, Sommer und mehr kommen bald!</p>
          </div>
        </div>
      </section>

      {/* Quiz */}
      <section id="quiz" style={{backgroundColor: '#f5f5f7', padding: '80px 24px'}}>
        <div style={{maxWidth: '1100px', margin: '0 auto'}}>
          <h2 style={{fontSize: '32px', fontWeight: '700', color: '#1d1d1f', marginBottom: '12px'}}>Kostenlose Quizze</h2>
          <p style={{fontSize: '17px', color: '#6e6e73', marginBottom: '48px'}}>Teste dein Wissen — direkt hier in der App!</p>
          <div style={{background: 'linear-gradient(135deg, #0071e3 0%, #0051a0 100%)', borderRadius: '20px', padding: '60px', textAlign: 'center', boxShadow: '0 8px 40px rgba(0,113,227,0.25)'}}>
            <div style={{fontSize: '64px', marginBottom: '20px'}}>🧠</div>
            <h4 style={{margin: '0 0 12px', fontSize: '24px', fontWeight: '700', color: 'white'}}>Quiz starten!</h4>
            <p style={{margin: '0 0 32px', fontSize: '16px', color: 'rgba(255,255,255,0.8)'}}>KI-generierte Fragen in Mathe und Physik — kostenlos und interaktiv!</p>
            <button onClick={() => window.location.href = '/quiz'} style={{backgroundColor: 'white', color: '#0071e3', border: 'none', borderRadius: '980px', padding: '14px 36px', fontSize: '16px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 16px rgba(0,0,0,0.15)'}}>
              Jetzt Quiz starten
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{textAlign: 'center', padding: '40px', backgroundColor: '#ffffff', borderTop: '1px solid #e5e5ea', color: '#6e6e73', fontSize: '13px'}}>
        © 2025 Lerne mit Anna ·
        <a href="/impressum" style={{color: '#6e6e73', textDecoration: 'none', margin: '0 8px'}}>Impressum</a> ·
        <a href="/datenschutz" style={{color: '#6e6e73', textDecoration: 'none', margin: '0 8px'}}>Datenschutz</a> ·
        <a href="/agb" style={{color: '#6e6e73', textDecoration: 'none', margin: '0 8px'}}>AGB</a>
      </footer>

    </main>
  );
}