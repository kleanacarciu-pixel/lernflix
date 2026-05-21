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
  const [breite, setBreite] = useState(1200);

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
    const handleResize = () => setBreite(window.innerWidth);
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const mobil = breite < 768;

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
      <div style={{background: 'linear-gradient(135deg, #e8f0fe 0%, #dde8ff 100%)', height: '160px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px'}}>
        <span style={{fontSize: '52px'}}>{p.kategorie === 'mathe' ? '📐' : '⚡'}</span>
        <span style={{fontSize: '11px', fontWeight: '700', color: '#0071e3', textTransform: 'uppercase', letterSpacing: '0.1em', backgroundColor: 'rgba(0,113,227,0.1)', padding: '3px 10px', borderRadius: '20px'}}>{p.typ}</span>
      </div>
      <div style={{padding: '18px 20px'}}>
        <h4 style={{margin: '0 0 8px', fontSize: '17px', fontWeight: '700', color: '#1d1d1f'}}>{p.titel}</h4>
        <p style={{margin: '0 0 14px', fontSize: '14px', color: '#6e6e73', lineHeight: '1.5'}}>{p.beschreibung}</p>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f0f0f5', paddingTop: '12px'}}>
          <span style={{fontSize: '22px', fontWeight: '700', color: '#0071e3'}}>{p.preis.toFixed(2).replace('.', ',')} €</span>
          <span style={{fontSize: '13px', color: '#0071e3', fontWeight: '600', backgroundColor: '#e8f0fe', padding: '6px 14px', borderRadius: '20px'}}>Details →</span>
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
        @keyframes formelSchweben1 { 0%,100%{transform:translateY(0) rotate(-5deg);opacity:0.1}50%{transform:translateY(-20px) rotate(5deg);opacity:0.2} }
        @keyframes formelSchweben2 { 0%,100%{transform:translateY(0) rotate(3deg);opacity:0.08}50%{transform:translateY(-15px) rotate(-3deg);opacity:0.16} }
        @keyframes formelSchweben3 { 0%,100%{transform:translateY(0);opacity:0.06}50%{transform:translateY(-25px);opacity:0.14} }
        @keyframes gradientMove { 0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%} }
      `}</style>

      {ausgewaehlt && (
        <div onClick={() => setAusgewaehlt(null)} style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', backdropFilter: 'blur(20px)'}}>
          <div onClick={e => e.stopPropagation()} style={{backgroundColor: 'white', borderRadius: '24px', maxWidth: '680px', width: '100%', overflow: 'hidden', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 32px 100px rgba(0,0,0,0.3)'}}>
            <div style={{position: 'relative', height: mobil ? '200px' : '280px', background: 'linear-gradient(135deg, #e8f0fe 0%, #dde8ff 100%)'}}>
              <img src={ausgewaehlt.vorschau} alt={ausgewaehlt.titel} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
              <button onClick={() => setAusgewaehlt(null)} style={{position: 'absolute', top: '16px', right: '16px', backgroundColor: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', fontSize: '16px', cursor: 'pointer', color: 'white'}}>✕</button>
              <div style={{position: 'absolute', top: '16px', left: '16px', backgroundColor: '#0071e3', color: 'white', fontSize: '11px', fontWeight: '700', padding: '4px 12px', borderRadius: '20px', textTransform: 'uppercase'}}>{ausgewaehlt.typ}</div>
            </div>
            <div style={{padding: mobil ? '20px' : '32px'}}>
              <h2 style={{margin: '0 0 8px', fontSize: mobil ? '20px' : '24px', fontWeight: '700', color: '#1d1d1f'}}>{ausgewaehlt.titel}</h2>
              <p style={{margin: '0 0 20px', fontSize: '15px', color: '#6e6e73', lineHeight: '1.6'}}>{ausgewaehlt.beschreibung}</p>
              <div style={{backgroundColor: '#f5f5f7', borderRadius: '12px', padding: '18px', marginBottom: '20px'}}>
                <p style={{margin: '0 0 10px', fontSize: '14px', fontWeight: '700', color: '#1d1d1f'}}>Was ist drin:</p>
                {ausgewaehlt.details.map((d, i) => (
                  <div key={i} style={{display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '8px'}}>
                    <span style={{color: '#0071e3', fontWeight: '700', fontSize: '14px', flexShrink: 0}}>✓</span>
                    <span style={{fontSize: '14px', color: '#1d1d1f'}}>{d}</span>
                  </div>
                ))}
              </div>
              <div style={{display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap'}}>
                {['📄 ' + ausgewaehlt.seiten, '⬇️ Sofort-Download', '🔒 Sicher via Stripe'].map((t, i) => (
                  <span key={i} style={{fontSize: '12px', color: '#6e6e73', backgroundColor: '#f5f5f7', padding: '6px 12px', borderRadius: '20px'}}>{t}</span>
                ))}
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e5e5ea', paddingTop: '20px'}}>
                <div>
                  <p style={{margin: '0', fontSize: '13px', color: '#6e6e73'}}>Preis</p>
                  <p style={{margin: '0', fontSize: '30px', fontWeight: '800', color: '#1d1d1f'}}>{ausgewaehlt.preis.toFixed(2).replace('.', ',')} €</p>
                </div>
                <button onClick={() => kaufen(ausgewaehlt.titel, ausgewaehlt.preis)} style={{background: 'linear-gradient(135deg, #0071e3 0%, #0051a0 100%)', color: 'white', border: 'none', borderRadius: '14px', padding: '14px 28px', fontSize: '16px', fontWeight: '700', cursor: 'pointer'}}>
                  Jetzt kaufen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <header style={{position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, backgroundColor: scrolled ? 'rgba(255,255,255,0.92)' : 'transparent', backdropFilter: scrolled ? 'blur(20px)' : 'none', borderBottom: scrolled ? '1px solid rgba(0,0,0,0.08)' : 'none', padding: mobil ? '12px 16px' : '14px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all 0.3s ease'}}>
        <img src="/logo.jpg?v=1" alt="Lerne mit Anna" style={{height: mobil ? '40px' : '48px', borderRadius: '10px'}} />
        <nav style={{display: 'flex', gap: mobil ? '10px' : '28px', alignItems: 'center'}}>
          {!mobil && <>
            <a href="#mathe" style={{color: '#1d1d1f', textDecoration: 'none', fontSize: '15px', fontWeight: '500'}}>Mathe</a>
            <a href="#physik" style={{color: '#1d1d1f', textDecoration: 'none', fontSize: '15px', fontWeight: '500'}}>Physik</a>
            <a href="#pakete" style={{color: '#1d1d1f', textDecoration: 'none', fontSize: '15px', fontWeight: '500'}}>Lernpakete</a>
          </>}
          <a href="/quiz" style={{backgroundColor: '#0071e3', color: 'white', textDecoration: 'none', fontSize: '14px', fontWeight: '600', padding: '8px 18px', borderRadius: '980px', whiteSpace: 'nowrap'}}>Quiz starten</a>
        </nav>
      </header>

      <section style={{minHeight: '100vh', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: mobil ? '90px 16px 40px' : '100px 24px 60px', overflow: 'hidden'}}>
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #e8f0ff 0%, #ffffff 25%, #f0e8ff 50%, #e8f8ff 75%, #fff0e8 100%)', backgroundSize: '400% 400%', animation: 'gradientMove 10s ease infinite', zIndex: 0}}></div>
        <div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: mobil ? '300px' : '600px', height: mobil ? '300px' : '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,113,227,0.08) 0%, transparent 70%)', zIndex: 1, pointerEvents: 'none'}}></div>

        {!mobil && (
          <div style={{position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', overflow: 'hidden'}}>
            {[
              {text: 'x²', top: '12%', left: '7%', size: '42px', anim: 'formelSchweben1 4s ease-in-out infinite'},
              {text: 'E=mc²', top: '18%', right: '8%', size: '30px', anim: 'formelSchweben2 5s ease-in-out infinite 1s'},
              {text: 'π', top: '68%', left: '5%', size: '48px', anim: 'formelSchweben3 4.5s ease-in-out infinite 0.5s'},
              {text: 'a²+b²=c²', top: '10%', left: '28%', size: '24px', anim: 'formelSchweben1 6s ease-in-out infinite 2s'},
              {text: 'F=ma', top: '72%', right: '7%', size: '28px', anim: 'formelSchweben2 5.5s ease-in-out infinite 1.5s'},
              {text: '∫', top: '40%', right: '4%', size: '40px', anim: 'formelSchweben2 4.8s ease-in-out infinite 0.8s'},
            ].map((f, i) => (
              <div key={i} style={{position: 'absolute', top: f.top, left: (f as {left?: string}).left, right: (f as {right?: string}).right, fontSize: f.size, fontWeight: '700', color: '#0071e3', fontFamily: 'Georgia, serif', animation: f.anim}}>
                {f.text}
              </div>
            ))}
          </div>
        )}

        <div style={{position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'center', alignItems: 'flex-end', minHeight: mobil ? '200px' : '280px', marginBottom: mobil ? '32px' : '48px', width: '100%'}}>
          <div style={{transform: phase === 'weglaufen' ? `translateX(${mobil ? '300px' : '700px'})` : 'translateX(0px)', opacity: phase === 'weglaufen' ? 0 : 1, transition: phase === 'weglaufen' ? 'transform 1.5s ease-in, opacity 0.8s ease-in 0.7s' : 'transform 1.2s ease-out', position: 'relative'}}>

            {phase === 'kratzen' && (<>
              <div style={{position: 'absolute', top: mobil ? '-55px' : '-75px', left: '50%', transform: 'translateX(-50%)', fontSize: mobil ? '36px' : '52px', fontWeight: '900', color: '#0071e3', animation: 'frage1 1.2s ease-in-out infinite'}}>?</div>
              <div style={{position: 'absolute', top: mobil ? '-42px' : '-58px', left: mobil ? '-25px' : '-38px', fontSize: mobil ? '24px' : '34px', fontWeight: '900', color: '#0071e3', opacity: 0.6, animation: 'frage2 1.5s ease-in-out infinite 0.3s'}}>?</div>
              <div style={{position: 'absolute', top: mobil ? '-42px' : '-58px', right: mobil ? '-25px' : '-38px', fontSize: mobil ? '24px' : '34px', fontWeight: '900', color: '#0071e3', opacity: 0.4, animation: 'frage3 1.8s ease-in-out infinite 0.6s'}}>?</div>
            </>)}

            <div style={{width: mobil ? '110px' : '150px', height: mobil ? '135px' : '185px', background: 'linear-gradient(135deg, #0071e3 0%, #0051a0 100%)', borderRadius: mobil ? '10px 16px 16px 10px' : '14px 22px 22px 14px', position: 'relative', boxShadow: '0 24px 70px rgba(0,113,227,0.4)', animation: phase === 'kratzen' ? 'schweben 2.5s ease-in-out infinite' : 'none'}}>
              <div style={{position: 'absolute', left: '5px', top: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', height: mobil ? '111px' : '155px'}}>
                {[0,1,2,3,4,5,6,7].map(i => (
                  <div key={i} style={{width: mobil ? '10px' : '13px', height: mobil ? '10px' : '13px', borderRadius: '50%', backgroundColor: '#1d1d1f', border: '2px solid rgba(255,255,255,0.85)'}}></div>
                ))}
              </div>
              <div style={{position: 'absolute', top: mobil ? '24px' : '34px', left: mobil ? '28px' : '38px', display: 'flex', gap: mobil ? '16px' : '24px'}}>
                <div style={{width: mobil ? '18px' : '24px', height: mobil ? '18px' : '24px', backgroundColor: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'blinzeln 4s ease-in-out infinite'}}>
                  <div style={{width: mobil ? '9px' : '12px', height: mobil ? '9px' : '12px', backgroundColor: '#1d1d1f', borderRadius: '50%'}}></div>
                </div>
                <div style={{width: mobil ? '18px' : '24px', height: mobil ? '18px' : '24px', backgroundColor: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'blinzeln 4s ease-in-out infinite 0.2s'}}>
                  <div style={{width: mobil ? '9px' : '12px', height: mobil ? '9px' : '12px', backgroundColor: '#1d1d1f', borderRadius: '50%'}}></div>
                </div>
              </div>
              <div style={{position: 'absolute', top: mobil ? '52px' : '74px', left: mobil ? '22px' : '30px', width: mobil ? '66px' : '90px', height: mobil ? '28px' : '38px', borderBottom: '5px solid white', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderRadius: '0 0 50px 50px'}}></div>
              <div style={{position: 'absolute', top: mobil ? '48px' : '68px', left: mobil ? '18px' : '24px', width: mobil ? '14px' : '20px', height: mobil ? '8px' : '11px', backgroundColor: '#ffaaaa', borderRadius: '50%', opacity: 0.9}}></div>
              <div style={{position: 'absolute', top: mobil ? '48px' : '68px', right: mobil ? '12px' : '17px', width: mobil ? '14px' : '20px', height: mobil ? '8px' : '11px', backgroundColor: '#ffaaaa', borderRadius: '50%', opacity: 0.9}}></div>
              <div style={{position: 'absolute', bottom: mobil ? '22px' : '32px', left: mobil ? '22px' : '30px', right: mobil ? '10px' : '14px', height: '3px', backgroundColor: 'rgba(255,255,255,0.35)', borderRadius: '2px'}}></div>
              <div style={{position: 'absolute', bottom: mobil ? '34px' : '50px', left: mobil ? '22px' : '30px', right: mobil ? '10px' : '14px', height: '3px', backgroundColor: 'rgba(255,255,255,0.35)', borderRadius: '2px'}}></div>
            </div>

            <div style={{display: 'flex', justifyContent: 'center', gap: mobil ? '22px' : '30px', marginTop: '5px'}}>
              <div style={{width: mobil ? '11px' : '15px', height: mobil ? '36px' : '50px', backgroundColor: '#1d1d1f', borderRadius: '6px', transformOrigin: 'top center', animation: phase !== 'schild' ? 'beinLinks 0.35s ease-in-out infinite' : 'none'}}></div>
              <div style={{width: mobil ? '11px' : '15px', height: mobil ? '36px' : '50px', backgroundColor: '#1d1d1f', borderRadius: '6px', transformOrigin: 'top center', animation: phase !== 'schild' ? 'beinRechts 0.35s ease-in-out infinite' : 'none'}}></div>
            </div>
          </div>

          {phase === 'schild' && (
            <div style={{position: 'absolute', right: mobil ? 'calc(50% - 155px)' : 'calc(50% - 250px)', bottom: mobil ? '40px' : '55px', animation: 'schildRein 0.7s ease-out forwards'}}>
              <div style={{animation: 'schildSchaukeln 2s ease-in-out infinite'}}>
                <div style={{background: 'linear-gradient(135deg, #1d1d1f 0%, #2d2d2f 100%)', color: 'white', padding: mobil ? '14px 22px' : '20px 44px', borderRadius: '18px', fontSize: mobil ? '26px' : '40px', fontWeight: '900', letterSpacing: '-1px', boxShadow: '0 16px 50px rgba(0,0,0,0.3)'}}>
                  LERNFLIX
                </div>
                <div style={{width: '8px', height: mobil ? '36px' : '55px', backgroundColor: '#1d1d1f', margin: '0 auto', borderRadius: '4px'}}></div>
              </div>
            </div>
          )}
        </div>

        <div style={{position: 'relative', zIndex: 2, opacity: phase === 'schild' ? 1 : 0, transition: 'opacity 0.8s ease', marginBottom: '20px', minHeight: '32px'}}>
          <p style={{fontSize: mobil ? '17px' : '22px', color: '#6e6e73', fontWeight: '400', margin: 0}}>Dein Lernstream. Deine Regeln.</p>
        </div>

        <div style={{position: 'relative', zIndex: 2, display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap'}}>
          <a href="#mathe" style={{background: 'linear-gradient(135deg, #0071e3 0%, #0051a0 100%)', color: 'white', fontWeight: '700', padding: mobil ? '13px 24px' : '16px 40px', borderRadius: '980px', textDecoration: 'none', fontSize: mobil ? '15px' : '17px', boxShadow: '0 8px 24px rgba(0,113,227,0.4)'}}>
            Materialien ansehen
          </a>
          <a href="/quiz" style={{background: 'linear-gradient(135deg, #5856d6 0%, #3634a3 100%)', color: 'white', fontWeight: '700', padding: mobil ? '13px 24px' : '16px 40px', borderRadius: '980px', textDecoration: 'none', fontSize: mobil ? '15px' : '17px', boxShadow: '0 8px 24px rgba(88,86,214,0.4)'}}>
            Kostenlose Quizze
          </a>
        </div>
      </section>

      {/* Kategorien — MIT SVG Icons */}
      <section style={{backgroundColor: '#f5f5f7', padding: mobil ? '48px 16px' : '80px 24px'}}>
        <div style={{maxWidth: '1100px', margin: '0 auto'}}>
          <h2 style={{fontSize: mobil ? '28px' : '36px', fontWeight: '700', color: '#1d1d1f', marginBottom: '8px', textAlign: 'center'}}>Alle Kategorien</h2>
          <p style={{fontSize: '16px', color: '#6e6e73', textAlign: 'center', marginBottom: '36px'}}>Wähle dein Fach und starte durch</p>
          <div style={{display: 'grid', gridTemplateColumns: mobil ? '1fr 1fr' : 'repeat(4, 1fr)', gap: '14px'}}>
            {kategorien.map((k) => (
              <a key={k.titel} href={k.href} style={{textDecoration: 'none'}}>
                <div
                  style={{background: k.gradient, borderRadius: '20px', padding: mobil ? '20px 16px' : '32px 28px', transition: 'all 0.3s ease', boxShadow: '0 4px 20px rgba(0,0,0,0.12)', position: 'relative', overflow: 'hidden'}}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-6px) scale(1.02)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 16px 40px rgba(0,0,0,0.22)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0) scale(1)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 20px rgba(0,0,0,0.12)'; }}
                >
                  <div style={{marginBottom: mobil ? '12px' : '20px'}}>{k.icon}</div>
                  <h4 style={{margin: '0 0 6px', fontSize: mobil ? '15px' : '20px', fontWeight: '700', color: 'white'}}>{k.titel}</h4>
                  <p style={{margin: 0, fontSize: mobil ? '11px' : '14px', color: 'rgba(255,255,255,0.8)', lineHeight: '1.4'}}>{k.desc}</p>
                  <div style={{position: 'absolute', bottom: '16px', right: '16px', fontSize: '16px', color: 'rgba(255,255,255,0.5)'}}>→</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Mathe */}
      <section id="mathe" style={{backgroundColor: '#ffffff', padding: mobil ? '48px 16px' : '80px 24px'}}>
        <div style={{maxWidth: '1100px', margin: '0 auto'}}>
          <h2 style={{fontSize: mobil ? '28px' : '36px', fontWeight: '700', color: '#1d1d1f', marginBottom: '8px'}}>Mathematik</h2>
          <p style={{fontSize: '16px', color: '#6e6e73', marginBottom: '32px'}}>Formeln, Übungen und Erklärungen für die Schule</p>
          <div style={{display: 'grid', gridTemplateColumns: mobil ? '1fr' : 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px'}}>
            {mathe.map(p => <ProduktKarte key={p.id} p={p} />)}
          </div>
        </div>
      </section>

      {/* Physik */}
      <section id="physik" style={{backgroundColor: '#f5f5f7', padding: mobil ? '48px 16px' : '80px 24px'}}>
        <div style={{maxWidth: '1100px', margin: '0 auto'}}>
          <h2 style={{fontSize: mobil ? '28px' : '36px', fontWeight: '700', color: '#1d1d1f', marginBottom: '8px'}}>Physik</h2>
          <p style={{fontSize: '16px', color: '#6e6e73', marginBottom: '32px'}}>Gesetze, Formeln und Experimente verständlich erklärt</p>
          <div style={{display: 'grid', gridTemplateColumns: mobil ? '1fr' : 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px'}}>
            {physik.map(p => <ProduktKarte key={p.id} p={p} />)}
          </div>
        </div>
      </section>

      {/* Lernpakete */}
      <section id="pakete" style={{backgroundColor: '#ffffff', padding: mobil ? '48px 16px' : '80px 24px'}}>
        <div style={{maxWidth: '1100px', margin: '0 auto'}}>
          <h2 style={{fontSize: mobil ? '28px' : '36px', fontWeight: '700', color: '#1d1d1f', marginBottom: '8px'}}>Lernpakete</h2>
          <p style={{fontSize: '16px', color: '#6e6e73', marginBottom: '32px'}}>Spezielle Pakete für besondere Lernsituationen</p>
          <div style={{background: 'linear-gradient(135deg, #34c759 0%, #248a3d 100%)', borderRadius: '20px', padding: mobil ? '40px 24px' : '60px', textAlign: 'center', boxShadow: '0 8px 32px rgba(52,199,89,0.25)'}}>
            <div style={{fontSize: '56px', marginBottom: '16px'}}>🚀</div>
            <h4 style={{margin: '0 0 8px', fontSize: mobil ? '20px' : '24px', fontWeight: '700', color: 'white'}}>Bald verfügbar!</h4>
            <p style={{margin: 0, fontSize: '15px', color: 'rgba(255,255,255,0.85)'}}>Spezielle Lernpakete für Abitur, Sommer und mehr kommen bald!</p>
          </div>
        </div>
      </section>

      {/* Quiz */}
      <section id="quiz" style={{backgroundColor: '#f5f5f7', padding: mobil ? '48px 16px' : '80px 24px'}}>
        <div style={{maxWidth: '1100px', margin: '0 auto'}}>
          <h2 style={{fontSize: mobil ? '28px' : '36px', fontWeight: '700', color: '#1d1d1f', marginBottom: '8px'}}>Kostenlose Quizze</h2>
          <p style={{fontSize: '16px', color: '#6e6e73', marginBottom: '32px'}}>Teste dein Wissen — direkt hier in der App!</p>
          <div style={{background: 'linear-gradient(135deg, #0071e3 0%, #5856d6 100%)', borderRadius: '20px', padding: mobil ? '36px 24px' : '56px', boxShadow: '0 8px 32px rgba(0,113,227,0.25)'}}>
            <div style={{display: 'grid', gridTemplateColumns: mobil ? '1fr' : '1fr 1fr', gap: '40px', alignItems: 'center'}}>
              <div>
                <h3 style={{margin: '0 0 12px', fontSize: mobil ? '22px' : '28px', fontWeight: '800', color: 'white'}}>Lerne mit Spaß!</h3>
                <p style={{margin: '0 0 20px', fontSize: '15px', color: 'rgba(255,255,255,0.85)', lineHeight: '1.7'}}>Teste dein Wissen mit interaktiven Quizzen. Jedes Mal neue Fragen — kostenlos und ohne Anmeldung!</p>
                <div style={{display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px'}}>
                  {['Über 10 verschiedene Themen', 'Leicht, Mittel & Schwer', 'Sofortige Erklärungen', 'Kostenlos & ohne Anmeldung'].map((f, i) => (
                    <div key={i} style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                      <div style={{width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                      <span style={{fontSize: '15px', color: 'rgba(255,255,255,0.9)', fontWeight: '500'}}>{f}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => window.location.href = '/quiz'} style={{backgroundColor: 'white', color: '#0071e3', border: 'none', borderRadius: '980px', padding: '14px 32px', fontSize: '16px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 16px rgba(0,0,0,0.15)'}}>
                  Jetzt Quiz starten
                </button>
              </div>
              {!mobil && (
                <div style={{background: 'rgba(255,255,255,0.1)', borderRadius: '20px', padding: '32px', backdropFilter: 'blur(10px)'}}>
                  <div style={{fontSize: '72px', textAlign: 'center', marginBottom: '20px'}}>🧠</div>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px'}}>
                    {[{n: '10+', t: 'Themen'}, {n: '3', t: 'Stufen'}, {n: '∞', t: 'Fragen'}, {n: '0€', t: 'Kostenlos'}].map((s, i) => (
                      <div key={i} style={{backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '12px', padding: '16px', textAlign: 'center'}}>
                        <div style={{fontSize: '24px', fontWeight: '800', color: 'white', marginBottom: '4px'}}>{s.n}</div>
                        <div style={{fontSize: '12px', color: 'rgba(255,255,255,0.75)', fontWeight: '500'}}>{s.t}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <footer style={{textAlign: 'center', padding: '32px 16px', backgroundColor: '#ffffff', borderTop: '1px solid #e5e5ea', color: '#6e6e73', fontSize: '13px'}}>
        © 2025 Lerne mit Anna ·
        <a href="/impressum" style={{color: '#6e6e73', textDecoration: 'none', margin: '0 6px'}}>Impressum</a> ·
        <a href="/datenschutz" style={{color: '#6e6e73', textDecoration: 'none', margin: '0 6px'}}>Datenschutz</a> ·
        <a href="/agb" style={{color: '#6e6e73', textDecoration: 'none', margin: '0 6px'}}>AGB</a>
      </footer>

    </main>
  );
}