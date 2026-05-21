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
      seiten: '12 Seiten', preis: 1.99, vorschau: '/geometrie-vorschau.jpeg',
    },
    {
      id: 2, kategorie: 'mathe', typ: 'Arbeitsblatt', titel: 'Potenzen',
      beschreibung: 'Alles über Potenzen — Regeln, Beispiele und Übungen. Perfekt für Klasse 7–9.',
      details: ['Potenzregeln vollständig erklärt', 'Negative Exponenten', 'Potenzieren mit Brüchen', 'Übungsaufgaben mit Lösungen', 'Einfache und verständliche Sprache'],
      seiten: 'PDF', preis: 0.99, vorschau: '/potenzen-vorschau.jpeg',
    },
    {
      id: 3, kategorie: 'physik', typ: 'Formelsammlung', titel: 'Mechanik',
      beschreibung: 'Alle wichtigen Mechanik-Formeln — Kraft, Geschwindigkeit, Energie und mehr.',
      details: ['Kraft, Masse, Beschleunigung', 'Geschwindigkeit und Bewegung', 'Energie und Arbeit', 'Hebel und Drehmoment', 'Mit Beispielen und Erklärungen'],
      seiten: 'PDF', preis: 0.99, vorschau: '/mechanik-vorschau.jpeg',
    },
  ];

  const mathe = produkte.filter(p => p.kategorie === 'mathe');
  const physik = produkte.filter(p => p.kategorie === 'physik');

  const ProduktKarte = ({ p }: { p: Produkt }) => (
    <div
      onClick={() => setAusgewaehlt(p)}
      style={{backgroundColor: '#ffffff', borderRadius: '20px', border: '1px solid #e5e5ea', overflow: 'hidden', cursor: 'pointer', transition: 'all 0.3s ease', boxShadow: '0 2px 12px rgba(0,0,0,0.06)'}}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-6px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 16px 40px rgba(0,113,227,0.15)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)'; }}
    >
      {/* Vorschau Foto */}
      <div style={{position: 'relative', height: '200px', overflow: 'hidden'}}>
        <img src={p.vorschau} alt={p.titel} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
        <div style={{position: 'absolute', top: '12px', left: '12px', backgroundColor: '#0071e3', color: 'white', fontSize: '11px', fontWeight: '700', padding: '4px 12px', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.05em'}}>{p.typ}</div>
      </div>
      {/* Content */}
      <div style={{padding: '20px 22px'}}>
        <h4 style={{margin: '0 0 8px', fontSize: '17px', fontWeight: '700', color: '#1d1d1f'}}>{p.titel}</h4>
        <p style={{margin: '0 0 16px', fontSize: '14px', color: '#6e6e73', lineHeight: '1.5'}}>{p.beschreibung}</p>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f0f0f5', paddingTop: '14px'}}>
          <span style={{fontSize: '24px', fontWeight: '700', color: '#1d1d1f'}}>{p.preis.toFixed(2).replace('.', ',')} €</span>
          <span style={{fontSize: '14px', color: '#0071e3', fontWeight: '600', backgroundColor: '#e8f0fe', padding: '8px 18px', borderRadius: '20px'}}>Details ansehen →</span>
        </div>
      </div>
    </div>
  );

  const kategorien = [
    {
      href: '#mathe', titel: 'Mathematik', desc: 'Formeln, Übungen & Erklärungen',
      gradient: 'linear-gradient(135deg, #0071e3 0%, #0051a0 100%)',
      icon: (<svg width="40" height="40" viewBox="0 0 40 40" fill="none"><rect x="4" y="4" width="14" height="14" rx="3" fill="white" fillOpacity="0.9"/><rect x="22" y="4" width="14" height="14" rx="3" fill="white" fillOpacity="0.6"/><rect x="4" y="22" width="14" height="14" rx="3" fill="white" fillOpacity="0.6"/><path d="M25 25h8M29 21v8" stroke="white" strokeWidth="2.5" strokeLinecap="round"/></svg>),
    },
    {
      href: '#physik', titel: 'Physik', desc: 'Gesetze, Formeln & Experimente',
      gradient: 'linear-gradient(135deg, #5856d6 0%, #3634a3 100%)',
      icon: (<svg width="40" height="40" viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="5" fill="white"/><ellipse cx="20" cy="20" rx="16" ry="7" stroke="white" strokeWidth="2" fill="none" strokeOpacity="0.7"/><ellipse cx="20" cy="20" rx="16" ry="7" stroke="white" strokeWidth="2" fill="none" strokeOpacity="0.7" transform="rotate(60 20 20)"/><ellipse cx="20" cy="20" rx="16" ry="7" stroke="white" strokeWidth="2" fill="none" strokeOpacity="0.7" transform="rotate(-60 20 20)"/></svg>),
    },
    {
      href: '#pakete', titel: 'Lernpakete', desc: 'Abitur, Sommer & Spezialthemen',
      gradient: 'linear-gradient(135deg, #34c759 0%, #248a3d 100%)',
      icon: (<svg width="40" height="40" viewBox="0 0 40 40" fill="none"><rect x="6" y="14" width="28" height="20" rx="3" fill="white" fillOpacity="0.2" stroke="white" strokeWidth="2"/><path d="M14 14V10a6 6 0 0 1 12 0v4" stroke="white" strokeWidth="2" strokeLinecap="round"/><path d="M20 22v4M16 24h8" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>),
    },
    {
      href: '/quiz', titel: 'Quizze', desc: 'Kostenlos Wissen testen',
      gradient: 'linear-gradient(135deg, #ff9500 0%, #cc7700 100%)',
      icon: (<svg width="40" height="40" viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="14" stroke="white" strokeWidth="2" fill="none"/><path d="M16 16.5C16 14 17.5 12 20 12c2.5 0 4 1.8 4 3.5 0 3-4 4-4 7" stroke="white" strokeWidth="2.5" strokeLinecap="round"/><circle cx="20" cy="27" r="1.5" fill="white"/></svg>),
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
        <div onClick={() => setAusgewaehlt(null)} style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(20px)'}}>
          <div onClick={e => e.stopPropagation()} style={{backgroundColor: 'white', borderRadius: '24px', maxWidth: '700px', width: '100%', overflow: 'hidden', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 32px 100px rgba(0,0,0,0.3)'}}>
            <div style={{position: 'relative', height: '300px'}}>
              <img src={ausgewaehlt.vorschau} alt={ausgewaehlt.titel} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
              <button onClick={() => setAusgewaehlt(null)} style={{position: 'absolute', top: '16px', right: '16px', backgroundColor: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', fontSize: '16px', cursor: 'pointer', color: 'white'}}>✕</button>
              <div style={{position: 'absolute', top: '16px', left: '16px', backgroundColor: '#0071e3', color: 'white', fontSize: '11px', fontWeight: '700', padding: '4px 12px', borderRadius: '20px', textTransform: 'uppercase'}}>{ausgewaehlt.typ}</div>
            </div>
            <div style={{padding: '32px'}}>
              <h2 style={{margin: '0 0 8px', fontSize: '24px', fontWeight: '700', color: '#1d1d1f'}}>{ausgewaehlt.titel}</h2>
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
                <button onClick={() => kaufen(ausgewaehlt.titel, ausgewaehlt.preis)} style={{background: 'linear-gradient(135deg, #0071e3 0%, #0051a0 100%)', color: 'white', border: 'none', borderRadius: '12px', padding: '14px 32px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 4px 16px rgba(0,113,227,0.3)'}}>
                  Jetzt kaufen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <header style={{position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, backgroundColor: scrolled ? 'rgba(255,255,255,0.85)' : 'transparent', backdropFilter: scrolled ? 'blur(20px)' : 'none', borderBottom: scrolled ? '1px solid rgba(0,0,0,0.08)' : 'none', padding: '14px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all 0.3s ease'}}>
        <img src="/logo.jpg?v=1" alt="Lerne mit Anna" style={{height: '52px', borderRadius: '12px'}} />
        <nav style={{display: 'flex', gap: '32px', alignItems: 'center'}}>
          <a href="#mathe" style={{color: '#1d1d1f', textDecoration: 'none', fontSize: '15px', fontWeight: '500'}}>Mathe</a>
          <a href="#physik" style={{color: '#1d1d1f', textDecoration: 'none', fontSize: '15px', fontWeight: '500'}}>Physik</a>
          <a href="#pakete" style={{color: '#1d1d1f', textDecoration: 'none', fontSize: '15px', fontWeight: '500'}}>Lernpakete</a>
          <a href="/quiz" style={{backgroundColor: '#0071e3', color: 'white', textDecoration: 'none', fontSize: '14px', fontWeight: '600', padding: '8px 20px', borderRadius: '980px'}}>Quiz starten</a>
        </nav>
      </header>

      {/* HERO */}
      <section style={{minHeight: '100vh', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '100px 24px 60px', overflow: 'hidden'}}>
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #e8f0ff 0%, #ffffff 25%, #f0e8ff 50%, #e8f8ff 75%, #fff0e8 100%)', backgroundSize: '400% 400%', animation: 'gradientMove 10s ease infinite', zIndex: 0}}></div>
        <div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,113,227,0.08) 0%, transparent 70%)', zIndex: 1, pointerEvents: 'none'}}></div>

        <div style={{position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', overflow: 'hidden'}}>
          {[
            {text: 'x²', top: '12%', left: '7%', size: '42px', anim: 'formelSchweben1 4s ease-in-out infinite'},
            {text: 'E=mc²', top: '18%', right: '8%', size: '30px', anim: 'formelSchweben2 5s ease-in-out infinite 1s'},
            {text: 'π', top: '68%', left: '5%', size: '48px', anim: 'formelSchweben3 4.5s ease-in-out infinite 0.5s'},
            {text: 'a²+b²=c²', top: '10%', left: '28%', size: '24px', anim: 'formelSchweben1 6s ease-in-out infinite 2s'},
            {text: 'F=ma', top: '72%', right: '7%', size: '28px', anim: 'formelSchweben2 5.5s ease-in-out infinite 1.5s'},
            {text: '∑', top: '25%', right: '22%', size: '36px', anim: 'formelSchweben3 7s ease-in-out infinite 3s'},
            {text: 'v=λf', top: '62%', left: '18%', size: '26px', anim: 'formelSchweben1 5s ease-in-out infinite 2.5s'},
            {text: '∫', top: '40%', right: '4%', size: '40px', anim: 'formelSchweben2 4.8s ease-in-out infinite 0.8s'},
          ].map((f, i) => (
            <div key={i} style={{position: 'absolute', top: f.top, left: (f as {left?: string}).left, right: (f as {right?: string}).right, fontSize: f.size, fontWeight: '700', color: '#0071e3', fontFamily: 'Georgia, serif', animation: f.anim}}>
              {f.text}
            </div>
          ))}
        </div>

        <div style={{position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'center', alignItems: 'flex-end', minHeight: '300px', marginBottom: '48px', width: '100%', maxWidth: '700px'}}>
          <div style={{transform: phase === 'weglaufen' ? 'translateX(700px)' : 'translateX(0px)', opacity: phase === 'weglaufen' ? 0 : 1, transition: phase === 'weglaufen' ? 'transform 1.5s ease-in, opacity 0.8s ease-in 0.7s' : 'transform 1.2s ease-out', position: 'relative'}}>
            {phase === 'kratzen' && (<>
              <div style={{position: 'absolute', top: '-75px', left: '50%', transform: 'translateX(-50%)', fontSize: '52px', fontWeight: '900', color: '#0071e3', animation: 'frage1 1.2s ease-in-out infinite'}}>?</div>
              <div style={{position: 'absolute', top: '-58px', left: '-38px', fontSize: '34px', fontWeight: '900', color: '#0071e3', opacity: 0.6, animation: 'frage2 1.5s ease-in-out infinite 0.3s'}}>?</div>
              <div style={{position: 'absolute', top: '-58px', right: '-38px', fontSize: '34px', fontWeight: '900', color: '#0071e3', opacity: 0.4, animation: 'frage3 1.8s ease-in-out infinite 0.6s'}}>?</div>
            </>)}
            <div style={{width: '150px', height: '185px', background: 'linear-gradient(135deg, #0071e3 0%, #0051a0 100%)', borderRadius: '14px 22px 22px 14px', position: 'relative', boxShadow: '0 24px 70px rgba(0,113,227,0.4)', animation: phase === 'kratzen' ? 'schweben 2.5s ease-in-out infinite' : 'none'}}>
              <div style={{position: 'absolute', left: '7px', top: '15px', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', height: '155px'}}>
                {[0,1,2,3,4,5,6,7,8,9].map(i => (
                  <div key={i} style={{width: '13px', height: '13px', borderRadius: '50%', backgroundColor: '#1d1d1f', border: '2.5px solid rgba(255,255,255,0.85)'}}></div>
                ))}
              </div>
              <div style={{position: 'absolute', top: '34px', left: '38px', display: 'flex', gap: '24px'}}>
                <div style={{width: '24px', height: '24px', backgroundColor: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'blinzeln 4s ease-in-out infinite'}}>
                  <div style={{width: '12px', height: '12px', backgroundColor: '#1d1d1f', borderRadius: '50%'}}></div>
                </div>
                <div style={{width: '24px', height: '24px', backgroundColor: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'blinzeln 4s ease-in-out infinite 0.2s'}}>
                  <div style={{width: '12px', height: '12px', backgroundColor: '#1d1d1f', borderRadius: '50%'}}></div>
                </div>
              </div>
              <div style={{position: 'absolute', top: '74px', left: '30px', width: '90px', height: '38px', borderBottom: '6px solid white', borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderRadius: '0 0 65px 65px'}}></div>
              <div style={{position: 'absolute', top: '68px', left: '24px', width: '20px', height: '11px', backgroundColor: '#ffaaaa', borderRadius: '50%', opacity: 0.9}}></div>
              <div style={{position: 'absolute', top: '68px', right: '17px', width: '20px', height: '11px', backgroundColor: '#ffaaaa', borderRadius: '50%', opacity: 0.9}}></div>
              <div style={{position: 'absolute', bottom: '32px', left: '30px', right: '14px', height: '3px', backgroundColor: 'rgba(255,255,255,0.35)', borderRadius: '2px'}}></div>
              <div style={{position: 'absolute', bottom: '50px', left: '30px', right: '14px', height: '3px', backgroundColor: 'rgba(255,255,255,0.35)', borderRadius: '2px'}}></div>
            </div>
            <div style={{display: 'flex', justifyContent: 'center', gap: '30px', marginTop: '6px'}}>
              <div style={{width: '15px', height: '50px', backgroundColor: '#1d1d1f', borderRadius: '8px', transformOrigin: 'top center', animation: phase !== 'schild' ? 'beinLinks 0.35s ease-in-out infinite' : 'none'}}></div>
              <div style={{width: '15px', height: '50px', backgroundColor: '#1d1d1f', borderRadius: '8px', transformOrigin: 'top center', animation: phase !== 'schild' ? 'beinRechts 0.35s ease-in-out infinite' : 'none'}}></div>
            </div>
          </div>

          {phase === 'schild' && (
            <div style={{position: 'absolute', right: 'calc(50% - 250px)', bottom: '55px', animation: 'schildRein 0.7s ease-out forwards'}}>
              <div style={{animation: 'schildSchaukeln 2s ease-in-out infinite'}}>
                <div style={{background: 'linear-gradient(135deg, #1d1d1f 0%, #2d2d2f 100%)', color: 'white', padding: '20px 44px', borderRadius: '18px', fontSize: '40px', fontWeight: '900', letterSpacing: '-1.5px', boxShadow: '0 16px 50px rgba(0,0,0,0.3)'}}>
                  LERNFLIX
                </div>
                <div style={{width: '8px', height: '55px', backgroundColor: '#1d1d1f', margin: '0 auto', borderRadius: '4px'}}></div>
              </div>
            </div>
          )}
        </div>

        <div style={{position: 'relative', zIndex: 2, opacity: phase === 'schild' ? 1 : 0, transition: 'opacity 0.8s ease', marginBottom: '24px', minHeight: '36px'}}>
          <p style={{fontSize: '22px', color: '#6e6e73', letterSpacing: '0.5px', fontWeight: '400', margin: 0}}>Dein Lernstream. Deine Regeln.</p>
        </div>

        <div style={{position: 'relative', zIndex: 2, display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap'}}>
          <a href="#mathe" style={{background: 'linear-gradient(135deg, #0071e3 0%, #0051a0 100%)', color: 'white', fontWeight: '700', padding: '16px 40px', borderRadius: '980px', textDecoration: 'none', fontSize: '17px', boxShadow: '0 8px 30px rgba(0,113,227,0.45)', transition: 'all 0.3s ease'}}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1.05)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1)'; }}>
            Materialien ansehen
          </a>
          <a href="/quiz" style={{background: 'linear-gradient(135deg, #5856d6 0%, #3634a3 100%)', color: 'white', fontWeight: '700', padding: '16px 40px', borderRadius: '980px', textDecoration: 'none', fontSize: '17px', boxShadow: '0 8px 30px rgba(88,86,214,0.45)', transition: 'all 0.3s ease'}}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1.05)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1)'; }}>
            Kostenlose Quizze
          </a>
        </div>
      </section>

      {/* Kategorien */}
      <section style={{backgroundColor: '#f5f5f7', padding: '80px 24px'}}>
        <div style={{maxWidth: '1100px', margin: '0 auto'}}>
          <h2 style={{fontSize: '36px', fontWeight: '700', color: '#1d1d1f', marginBottom: '12px', textAlign: 'center'}}>Alle Kategorien</h2>
          <p style={{fontSize: '17px', color: '#6e6e73', textAlign: 'center', marginBottom: '48px'}}>Wähle dein Fach und starte durch</p>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px'}}>
            {kategorien.map((k) => (
              <a key={k.titel} href={k.href} style={{textDecoration: 'none'}}>
                <div style={{background: k.gradient, borderRadius: '20px', padding: '32px 28px', transition: 'all 0.3s ease', boxShadow: '0 4px 20px rgba(0,0,0,0.12)', position: 'relative', overflow: 'hidden'}}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-6px) scale(1.02)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 16px 40px rgba(0,0,0,0.22)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0) scale(1)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 20px rgba(0,0,0,0.12)'; }}>
                  <div style={{marginBottom: '20px'}}>{k.icon}</div>
                  <h4 style={{margin: '0 0 8px', fontSize: '20px', fontWeight: '700', color: 'white'}}>{k.titel}</h4>
                  <p style={{margin: 0, fontSize: '14px', color: 'rgba(255,255,255,0.8)', lineHeight: '1.5'}}>{k.desc}</p>
                  <div style={{position: 'absolute', bottom: '20px', right: '20px', fontSize: '18px', color: 'rgba(255,255,255,0.6)'}}>→</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Mathe */}
      <section id="mathe" style={{backgroundColor: '#ffffff', padding: '80px 24px'}}>
        <div style={{maxWidth: '1100px', margin: '0 auto'}}>
          <h2 style={{fontSize: '36px', fontWeight: '700', color: '#1d1d1f', marginBottom: '12px'}}>Mathematik</h2>
          <p style={{fontSize: '17px', color: '#6e6e73', marginBottom: '48px'}}>Formeln, Übungen und Erklärungen für die Schule</p>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px'}}>
            {mathe.map(p => <ProduktKarte key={p.id} p={p} />)}
          </div>
        </div>
      </section>

      {/* Physik */}
      <section id="physik" style={{backgroundColor: '#f5f5f7', padding: '80px 24px'}}>
        <div style={{maxWidth: '1100px', margin: '0 auto'}}>
          <h2 style={{fontSize: '36px', fontWeight: '700', color: '#1d1d1f', marginBottom: '12px'}}>Physik</h2>
          <p style={{fontSize: '17px', color: '#6e6e73', marginBottom: '48px'}}>Gesetze, Formeln und Experimente verständlich erklärt</p>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px'}}>
            {physik.map(p => <ProduktKarte key={p.id} p={p} />)}
          </div>
        </div>
      </section>

      {/* Lernpakete */}
      <section id="pakete" style={{backgroundColor: '#ffffff', padding: '80px 24px'}}>
        <div style={{maxWidth: '1100px', margin: '0 auto'}}>
          <h2 style={{fontSize: '36px', fontWeight: '700', color: '#1d1d1f', marginBottom: '12px'}}>Lernpakete</h2>
          <p style={{fontSize: '17px', color: '#6e6e73', marginBottom: '48px'}}>Spezielle Pakete für besondere Lernsituationen</p>
          <div style={{backgroundColor: '#f5f5f7', borderRadius: '20px', padding: '60px', textAlign: 'center', border: '1px solid #e5e5ea'}}>
            <div style={{width: '72px', height: '72px', background: 'linear-gradient(135deg, #34c759 0%, #248a3d 100%)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '36px'}}>🚀</div>
            <h4 style={{margin: '0 0 8px', fontSize: '24px', fontWeight: '700', color: '#1d1d1f'}}>Bald verfügbar!</h4>
            <p style={{margin: 0, fontSize: '16px', color: '#6e6e73'}}>Spezielle Lernpakete für Abitur, Sommer und mehr kommen bald!</p>
          </div>
        </div>
      </section>

      {/* Quiz */}
      <section id="quiz" style={{backgroundColor: '#f5f5f7', padding: '80px 24px'}}>
        <div style={{maxWidth: '1100px', margin: '0 auto'}}>
          <h2 style={{fontSize: '36px', fontWeight: '700', color: '#1d1d1f', marginBottom: '12px'}}>Kostenlose Quizze</h2>
          <p style={{fontSize: '17px', color: '#6e6e73', marginBottom: '48px'}}>Teste dein Wissen — direkt hier in der App!</p>
          <div style={{backgroundColor: '#ffffff', borderRadius: '20px', padding: '60px', border: '1px solid #e5e5ea', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center'}}>
            <div>
              <h3 style={{margin: '0 0 16px', fontSize: '28px', fontWeight: '700', color: '#1d1d1f'}}>Lerne mit Spaß</h3>
              <p style={{margin: '0 0 24px', fontSize: '16px', color: '#6e6e73', lineHeight: '1.7'}}>Teste dein Wissen mit unseren interaktiven Quizzen. Jedes Mal neue Fragen in Mathe und Physik — kostenlos und ohne Anmeldung!</p>
              <div style={{display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px'}}>
                {['Über 10 verschiedene Themen', 'Leicht, Mittel & Schwer', 'Sofortige Erklärungen', 'Kostenlos & ohne Anmeldung'].map((f, i) => (
                  <div key={i} style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                    <div style={{width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#0071e3', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                    <span style={{fontSize: '15px', color: '#1d1d1f', fontWeight: '500'}}>{f}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => window.location.href = '/quiz'} style={{background: 'linear-gradient(135deg, #0071e3 0%, #0051a0 100%)', color: 'white', border: 'none', borderRadius: '980px', padding: '16px 36px', fontSize: '16px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 8px 24px rgba(0,113,227,0.35)', transition: 'all 0.3s ease'}}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.05)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}>
                Jetzt Quiz starten
              </button>
            </div>
            <div style={{background: 'linear-gradient(135deg, #e8f0fe 0%, #f0e8ff 100%)', borderRadius: '20px', padding: '40px', textAlign: 'center'}}>
              <div style={{fontSize: '80px', marginBottom: '16px'}}>🧠</div>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px'}}>
                {[{n: '10+', t: 'Themen'}, {n: '3', t: 'Schwierigkeiten'}, {n: '∞', t: 'Fragen'}, {n: '100%', t: 'Kostenlos'}].map((s, i) => (
                  <div key={i} style={{backgroundColor: 'white', borderRadius: '12px', padding: '16px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)'}}>
                    <div style={{fontSize: '24px', fontWeight: '800', color: '#0071e3', marginBottom: '4px'}}>{s.n}</div>
                    <div style={{fontSize: '12px', color: '#6e6e73', fontWeight: '500'}}>{s.t}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer style={{textAlign: 'center', padding: '40px', backgroundColor: '#ffffff', borderTop: '1px solid #e5e5ea', color: '#6e6e73', fontSize: '13px'}}>
        © 2025 Lerne mit Anna ·
        <a href="/impressum" style={{color: '#6e6e73', textDecoration: 'none', margin: '0 8px'}}>Impressum</a> ·
        <a href="/datenschutz" style={{color: '#6e6e73', textDecoration: 'none', margin: '0 8px'}}>Datenschutz</a> ·
        <a href="/agb" style={{color: '#6e6e73', textDecoration: 'none', margin: '0 8px'}}>AGB</a>
      </footer>

    </main>
  );
}