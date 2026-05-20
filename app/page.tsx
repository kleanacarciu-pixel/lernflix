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

  useEffect(() => {
    const timings = [
      { phase: 'weglaufen' as const, delay: 3000 },
      { phase: 'zurueck' as const, delay: 5500 },
      { phase: 'schild' as const, delay: 7000 },
      { phase: 'kratzen' as const, delay: 11000 },
    ];
    const timeouts = timings.map(({ phase, delay }) =>
      setTimeout(() => setPhase(phase), delay)
    );
    const loop = setInterval(() => {
      setPhase('kratzen');
      timings.forEach(({ phase, delay }) =>
        setTimeout(() => setPhase(phase), delay)
      );
    }, 12000);
    return () => {
      timeouts.forEach(clearTimeout);
      clearInterval(loop);
    };
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
      id: 1,
      kategorie: 'mathe',
      typ: 'Formelsammlung',
      titel: 'Geometrie Klasse 6–9',
      beschreibung: 'Alle Geometrie-Formeln von Klasse 6 bis 9 — mit Figuren, Beispielen und Erklärungen.',
      details: [
        '8 vollständige Kapitel',
        'Alle Formeln für Vierecke, Dreiecke, Kreis',
        'Alle 3D-Körper: Würfel, Zylinder, Kegel, Kugel',
        'Satz des Pythagoras mit Erklärung',
        'Ähnlichkeit und Strahlensätze',
        'Übersichtstabelle am Ende',
        'Mit Witzen und Tipps — kinderfreundlich!',
      ],
      seiten: '12 Seiten',
      preis: 1.99,
      vorschau: '/geometrie-vorschau.jpeg',
      emoji: '📐',
      farbe: '#5b9bd5',
      hellfarbe: '#ddeeff',
    },
    {
      id: 2,
      kategorie: 'mathe',
      typ: 'Arbeitsblatt',
      titel: 'Potenzen',
      beschreibung: 'Alles über Potenzen — Regeln, Beispiele und Übungen. Perfekt für Klasse 7–9.',
      details: [
        'Potenzregeln vollständig erklärt',
        'Negative Exponenten',
        'Potenzieren mit Brüchen',
        'Übungsaufgaben mit Lösungen',
        'Einfache und verständliche Sprache',
      ],
      seiten: 'PDF',
      preis: 0.99,
      vorschau: '/potenzen-vorschau.jpeg',
      emoji: '🔢',
      farbe: '#8a6a20',
      hellfarbe: '#f5ead0',
    },
    {
      id: 3,
      kategorie: 'physik',
      typ: 'Formelsammlung',
      titel: 'Mechanik',
      beschreibung: 'Alle wichtigen Mechanik-Formeln — Kraft, Geschwindigkeit, Energie und mehr.',
      details: [
        'Kraft, Masse, Beschleunigung',
        'Geschwindigkeit und Bewegung',
        'Energie und Arbeit',
        'Hebel und Drehmoment',
        'Mit Beispielen und Erklärungen',
      ],
      seiten: 'PDF',
      preis: 0.99,
      vorschau: '/mechanik-vorschau.jpeg',
      emoji: '⚡',
      farbe: '#2d6da8',
      hellfarbe: '#ddeeff',
    },
  ];

  const mathe = produkte.filter(p => p.kategorie === 'mathe');
  const physik = produkte.filter(p => p.kategorie === 'physik');

  const ProduktKarte = ({ p }: { p: Produkt }) => (
    <div
      onClick={() => setAusgewaehlt(p)}
      style={{backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e0d8cc', overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.15s, box-shadow 0.15s'}}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; }}
    >
      <div style={{backgroundColor: p.hellfarbe, height: '160px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', borderBottom: `2px solid ${p.farbe}20`}}>
        <span style={{fontSize: '64px'}}>{p.emoji}</span>
        <span style={{fontSize: '11px', fontWeight: '700', color: p.farbe, textTransform: 'uppercase', letterSpacing: '0.08em'}}>{p.typ}</span>
      </div>
      <div style={{padding: '18px'}}>
        <h4 style={{margin: '0 0 8px', fontSize: '16px', fontWeight: '700', color: '#4a4035'}}>{p.titel}</h4>
        <p style={{margin: '0 0 16px', fontSize: '13px', color: '#7a6e62', lineHeight: '1.5'}}>{p.beschreibung}</p>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <span style={{fontSize: '22px', fontWeight: '700', color: p.farbe}}>{p.preis.toFixed(2).replace('.', ',')} €</span>
          <span style={{fontSize: '13px', color: p.farbe, fontWeight: '600', backgroundColor: p.hellfarbe, padding: '6px 14px', borderRadius: '20px'}}>Details →</span>
        </div>
      </div>
    </div>
  );

  const heftX = phase === 'weglaufen' ? 300 : phase === 'zurueck' || phase === 'schild' ? 0 : 0;
  const heftOpacity = phase === 'weglaufen' ? 0 : 1;

  return (
    <main style={{minHeight: '100vh', backgroundColor: '#f5f0e8', fontFamily: 'sans-serif'}}>

      <style>{`
        @keyframes beinLinks {
          0%, 100% { transform: rotate(-25deg); }
          50% { transform: rotate(25deg); }
        }
        @keyframes beinRechts {
          0%, 100% { transform: rotate(25deg); }
          50% { transform: rotate(-25deg); }
        }
        @keyframes armKratzen {
          0%, 100% { transform: rotate(-30deg); }
          50% { transform: rotate(-70deg) translateY(-8px); }
        }
        @keyframes fragezeichen {
          0%, 100% { transform: translateY(0) scale(1); opacity: 1; }
          50% { transform: translateY(-12px) scale(1.3); opacity: 0.6; }
        }
        @keyframes schildDrehen {
          0% { transform: rotateY(90deg) scale(0.5); opacity: 0; }
          100% { transform: rotateY(0deg) scale(1); opacity: 1; }
        }
        @keyframes schweben1 {
          0%, 100% { transform: translateY(0px) rotate(-10deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }
        @keyframes schweben2 {
          0%, 100% { transform: translateY(0px) rotate(5deg); }
          50% { transform: translateY(-15px) rotate(-5deg); }
        }
        @keyframes schweben3 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-25px); }
        }
        @keyframes blinzeln {
          0%, 88%, 100% { transform: scaleY(1); }
          94% { transform: scaleY(0.08); }
        }
        @keyframes wackeln {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-5deg); }
          75% { transform: rotate(5deg); }
        }
      `}</style>

      {ausgewaehlt && (
        <div onClick={() => setAusgewaehlt(null)} style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'}}>
          <div onClick={e => e.stopPropagation()} style={{backgroundColor: 'white', borderRadius: '16px', maxWidth: '700px', width: '100%', overflow: 'hidden', maxHeight: '90vh', overflowY: 'auto'}}>
            <div style={{position: 'relative', height: '300px', backgroundColor: '#f0f0f0'}}>
              <img src={ausgewaehlt.vorschau} alt={ausgewaehlt.titel} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
              <button onClick={() => setAusgewaehlt(null)} style={{position: 'absolute', top: '12px', right: '12px', backgroundColor: 'white', border: 'none', borderRadius: '50%', width: '36px', height: '36px', fontSize: '18px', cursor: 'pointer', fontWeight: '700', color: '#4a4035', boxShadow: '0 2px 8px rgba(0,0,0,0.2)'}}>✕</button>
              <div style={{position: 'absolute', top: '12px', left: '12px', backgroundColor: ausgewaehlt.farbe, color: 'white', fontSize: '11px', fontWeight: '700', padding: '4px 12px', borderRadius: '20px', textTransform: 'uppercase'}}>{ausgewaehlt.typ}</div>
            </div>
            <div style={{padding: '28px'}}>
              <h2 style={{margin: '0 0 8px', fontSize: '22px', fontWeight: '700', color: '#4a4035'}}>{ausgewaehlt.emoji} {ausgewaehlt.titel}</h2>
              <p style={{margin: '0 0 20px', fontSize: '14px', color: '#7a6e62', lineHeight: '1.6'}}>{ausgewaehlt.beschreibung}</p>
              <div style={{backgroundColor: '#f5f0e8', borderRadius: '10px', padding: '16px', marginBottom: '20px'}}>
                <p style={{margin: '0 0 10px', fontSize: '14px', fontWeight: '700', color: '#4a4035'}}>Was ist drin:</p>
                {ausgewaehlt.details.map((d, i) => (
                  <div key={i} style={{display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '6px'}}>
                    <span style={{color: ausgewaehlt.farbe, fontWeight: '700', fontSize: '14px', flexShrink: 0}}>✓</span>
                    <span style={{fontSize: '13px', color: '#4a4035'}}>{d}</span>
                  </div>
                ))}
              </div>
              <div style={{display: 'flex', gap: '10px', marginBottom: '24px', flexWrap: 'wrap'}}>
                <span style={{fontSize: '12px', color: '#7a6e62', backgroundColor: '#f5f0e8', padding: '5px 12px', borderRadius: '20px'}}>📄 {ausgewaehlt.seiten}</span>
                <span style={{fontSize: '12px', color: '#7a6e62', backgroundColor: '#f5f0e8', padding: '5px 12px', borderRadius: '20px'}}>Sofort-Download nach Kauf</span>
                <span style={{fontSize: '12px', color: '#7a6e62', backgroundColor: '#f5f0e8', padding: '5px 12px', borderRadius: '20px'}}>Sicherer Kauf via Stripe</span>
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e0d8cc', paddingTop: '20px'}}>
                <div>
                  <p style={{margin: '0', fontSize: '12px', color: '#a0947e'}}>Preis</p>
                  <p style={{margin: '0', fontSize: '28px', fontWeight: '700', color: ausgewaehlt.farbe}}>{ausgewaehlt.preis.toFixed(2).replace('.', ',')} €</p>
                </div>
                <button onClick={() => kaufen(ausgewaehlt.titel, ausgewaehlt.preis)} style={{backgroundColor: ausgewaehlt.farbe, color: 'white', border: 'none', borderRadius: '10px', padding: '14px 32px', fontSize: '16px', fontWeight: '700', cursor: 'pointer'}}>Jetzt kaufen →</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <header style={{backgroundColor: '#ffffff', borderBottom: '1px solid #e0d8cc', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <img src="/logo.jpg?v=1" alt="Lerne mit Anna" style={{height: '60px'}} />
        <nav style={{display: 'flex', gap: '24px'}}>
          <a href="#mathe" style={{color: '#5b9bd5', textDecoration: 'none', fontSize: '14px', fontWeight: '500'}}>Mathe</a>
          <a href="#physik" style={{color: '#5b9bd5', textDecoration: 'none', fontSize: '14px', fontWeight: '500'}}>Physik</a>
          <a href="#pakete" style={{color: '#5b9bd5', textDecoration: 'none', fontSize: '14px', fontWeight: '500'}}>Lernpakete</a>
          <a href="/quiz" style={{color: '#5b9bd5', textDecoration: 'none', fontSize: '14px', fontWeight: '500'}}>Quiz</a>
        </nav>
      </header>

      <section style={{backgroundColor: '#ffffff', textAlign: 'center', padding: '60px 24px 50px', position: 'relative', overflow: 'hidden', borderBottom: '1px solid #e0d8cc'}}>

        <div style={{position: 'absolute', top: '20px', left: '8%', fontSize: '24px', fontWeight: '700', color: '#5b9bd5', animation: 'schweben1 3s ease-in-out infinite'}}>x²</div>
        <div style={{position: 'absolute', top: '40px', right: '10%', fontSize: '20px', fontWeight: '700', color: '#2d6da8', animation: 'schweben2 4s ease-in-out infinite'}}>E=mc²</div>
        <div style={{position: 'absolute', bottom: '80px', left: '5%', fontSize: '22px', fontWeight: '700', color: '#8a6a20', animation: 'schweben3 3.5s ease-in-out infinite'}}>π</div>
        <div style={{position: 'absolute', top: '30px', left: '28%', fontSize: '18px', fontWeight: '700', color: '#5b9bd5', animation: 'schweben2 2.8s ease-in-out infinite'}}>a²+b²=c²</div>
        <div style={{position: 'absolute', bottom: '60px', right: '8%', fontSize: '20px', fontWeight: '700', color: '#2d6da8', animation: 'schweben1 3.2s ease-in-out infinite'}}>F=ma</div>

        <h1 style={{fontSize: '80px', fontWeight: '900', margin: '0 0 8px', letterSpacing: '-3px', color: '#1a1a2e', textTransform: 'uppercase', lineHeight: 1}}>LERNFLIX</h1>
        <p style={{fontSize: '18px', margin: '0 0 40px', color: '#666666', letterSpacing: '2px', fontWeight: '500'}}>Dein Lernstream. Deine Regeln.</p>

        {/* Animation Container */}
        <div style={{display: 'flex', justifyContent: 'center', marginBottom: '40px', minHeight: '220px', alignItems: 'flex-end', position: 'relative'}}>

          {/* Heft Maskottchen */}
          <div style={{
            transform: `translateX(${heftX}px)`,
            opacity: heftOpacity,
            transition: phase === 'weglaufen' ? 'transform 1.5s ease-in, opacity 0.5s ease-in 1s' : phase === 'zurueck' ? 'transform 1.5s ease-out, opacity 0.3s ease-out' : 'none',
            position: 'relative',
          }}>

            {/* Fragezeichen — nur bei kratzen Phase */}
            {phase === 'kratzen' && (
              <div style={{position: 'absolute', top: '-50px', right: '-5px', fontSize: '32px', fontWeight: '900', color: '#5b9bd5', animation: 'fragezeichen 1s ease-in-out infinite'}}>?</div>
            )}

            {/* Arm kratzen — nur bei kratzen Phase */}
            {phase === 'kratzen' && (
              <div style={{position: 'absolute', top: '10px', right: '-22px', width: '9px', height: '38px', backgroundColor: '#5b9bd5', borderRadius: '5px', transformOrigin: 'top center', animation: 'armKratzen 0.4s ease-in-out infinite'}}></div>
            )}

            {/* Heft Körper */}
            <div style={{
              width: '100px',
              height: '120px',
              backgroundColor: '#5b9bd5',
              borderRadius: '10px 16px 16px 10px',
              position: 'relative',
              boxShadow: '6px 6px 20px rgba(91,155,213,0.4)',
              animation: phase === 'schild' ? 'wackeln 0.5s ease-in-out 3' : 'none',
            }}>
              {/* Spirale */}
              <div style={{position: 'absolute', left: '5px', top: '12px', width: '10px', height: '96px', display: 'flex', flexDirection: 'column', justifyContent: 'space-around'}}>
                {[0,1,2,3,4,5,6].map(i => (
                  <div key={i} style={{width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#1a1a2e', border: '2px solid white'}}></div>
                ))}
              </div>

              {/* Augen */}
              <div style={{position: 'absolute', top: '24px', left: '28px', display: 'flex', gap: '16px'}}>
                <div style={{width: '16px', height: '16px', backgroundColor: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'blinzeln 3s ease-in-out infinite'}}>
                  <div style={{width: '8px', height: '8px', backgroundColor: '#1a1a2e', borderRadius: '50%'}}></div>
                </div>
                <div style={{width: '16px', height: '16px', backgroundColor: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'blinzeln 3s ease-in-out infinite 0.15s'}}>
                  <div style={{width: '8px', height: '8px', backgroundColor: '#1a1a2e', borderRadius: '50%'}}></div>
                </div>
              </div>

              {/* Lächeln gross */}
              <div style={{position: 'absolute', top: '52px', left: '24px', width: '52px', height: '24px', borderBottom: '5px solid white', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderRadius: '0 0 40px 40px'}}></div>

              {/* Wangen */}
              <div style={{position: 'absolute', top: '46px', left: '20px', width: '12px', height: '7px', backgroundColor: '#ffaaaa', borderRadius: '50%', opacity: 0.8}}></div>
              <div style={{position: 'absolute', top: '46px', right: '14px', width: '12px', height: '7px', backgroundColor: '#ffaaaa', borderRadius: '50%', opacity: 0.8}}></div>

              {/* Linien */}
              <div style={{position: 'absolute', bottom: '22px', left: '22px', right: '10px', height: '2px', backgroundColor: 'rgba(255,255,255,0.4)'}}></div>
              <div style={{position: 'absolute', bottom: '32px', left: '22px', right: '10px', height: '2px', backgroundColor: 'rgba(255,255,255,0.4)'}}></div>
            </div>

            {/* Beine */}
            <div style={{display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '4px'}}>
              <div style={{width: '12px', height: '35px', backgroundColor: '#1a1a2e', borderRadius: '6px', transformOrigin: 'top center', animation: phase !== 'schild' ? 'beinLinks 0.35s ease-in-out infinite' : 'none'}}></div>
              <div style={{width: '12px', height: '35px', backgroundColor: '#1a1a2e', borderRadius: '6px', transformOrigin: 'top center', animation: phase !== 'schild' ? 'beinRechts 0.35s ease-in-out infinite' : 'none'}}></div>
            </div>
          </div>

          {/* Schild — nur bei schild Phase */}
          {phase === 'schild' && (
            <div style={{
              position: 'absolute',
              right: 'calc(50% - 180px)',
              bottom: '40px',
              animation: 'schildDrehen 0.8s ease-out forwards',
            }}>
              <div style={{
                backgroundColor: '#1a1a2e',
                color: 'white',
                padding: '16px 28px',
                borderRadius: '12px',
                fontSize: '28px',
                fontWeight: '900',
                letterSpacing: '-1px',
                boxShadow: '4px 4px 16px rgba(0,0,0,0.3)',
                border: '4px solid #5b9bd5',
              }}>
                LERNFLIX
              </div>
              {/* Schild Stange */}
              <div style={{width: '6px', height: '40px', backgroundColor: '#1a1a2e', margin: '0 auto'}}></div>
            </div>
          )}
        </div>

        <div style={{display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap'}}>
          <a href="#mathe" style={{backgroundColor: '#5b9bd5', color: 'white', fontWeight: '700', padding: '14px 32px', borderRadius: '50px', textDecoration: 'none', fontSize: '16px', boxShadow: '0 4px 15px rgba(91,155,213,0.4)'}}>Materialien ansehen</a>
          <a href="/quiz" style={{backgroundColor: 'white', color: '#5b9bd5', fontWeight: '700', padding: '14px 32px', borderRadius: '50px', textDecoration: 'none', fontSize: '16px', border: '2px solid #5b9bd5'}}>Kostenlose Quizze</a>
        </div>
      </section>

      <section style={{maxWidth: '1100px', margin: '0 auto', padding: '48px 24px'}}>
        <h3 style={{fontSize: '22px', fontWeight: '700', color: '#4a4035', marginBottom: '24px'}}>Kategorien</h3>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px'}}>
          <a href="#mathe" style={{textDecoration: 'none'}}>
            <div style={{backgroundColor: '#ddeeff', borderRadius: '16px', padding: '32px 24px', textAlign: 'center', border: '1px solid #b8d4f0'}}>
              <div style={{fontSize: '48px', marginBottom: '12px'}}>📐</div>
              <h4 style={{margin: '0 0 6px', fontSize: '20px', fontWeight: '700', color: '#2d6da8'}}>Mathe</h4>
              <p style={{margin: 0, fontSize: '13px', color: '#5580a0'}}>Übungen, Arbeitsblätter & Erklärungen</p>
            </div>
          </a>
          <a href="#physik" style={{textDecoration: 'none'}}>
            <div style={{backgroundColor: '#ddeeff', borderRadius: '16px', padding: '32px 24px', textAlign: 'center', border: '1px solid #b8d4f0'}}>
              <div style={{fontSize: '48px', marginBottom: '12px'}}>⚡</div>
              <h4 style={{margin: '0 0 6px', fontSize: '20px', fontWeight: '700', color: '#2d6da8'}}>Physik</h4>
              <p style={{margin: 0, fontSize: '13px', color: '#5580a0'}}>Formeln, Aufgaben & Erklärungen</p>
            </div>
          </a>
          <a href="#pakete" style={{textDecoration: 'none'}}>
            <div style={{backgroundColor: '#f5ead0', borderRadius: '16px', padding: '32px 24px', textAlign: 'center', border: '1px solid #e0cc99'}}>
              <div style={{fontSize: '48px', marginBottom: '12px'}}>🎒</div>
              <h4 style={{margin: '0 0 6px', fontSize: '20px', fontWeight: '700', color: '#8a6a20'}}>Lernpakete</h4>
              <p style={{margin: 0, fontSize: '13px', color: '#9a8040'}}>Abitur, Sommer & Spezialthemen</p>
            </div>
          </a>
          <a href="/quiz" style={{textDecoration: 'none'}}>
            <div style={{backgroundColor: '#f5ead0', borderRadius: '16px', padding: '32px 24px', textAlign: 'center', border: '1px solid #e0cc99'}}>
              <div style={{fontSize: '48px', marginBottom: '12px'}}>🧠</div>
              <h4 style={{margin: '0 0 6px', fontSize: '20px', fontWeight: '700', color: '#8a6a20'}}>Quiz</h4>
              <p style={{margin: 0, fontSize: '13px', color: '#9a8040'}}>Kostenlose Quizze direkt in der App</p>
            </div>
          </a>
        </div>
      </section>

      <section id="mathe" style={{backgroundColor: '#ffffff', padding: '48px 24px'}}>
        <div style={{maxWidth: '1100px', margin: '0 auto'}}>
          <h3 style={{fontSize: '22px', fontWeight: '700', color: '#2d6da8', marginBottom: '24px'}}>📐 Mathe</h3>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px'}}>
            {mathe.map(p => <ProduktKarte key={p.id} p={p} />)}
          </div>
        </div>
      </section>

      <section id="physik" style={{backgroundColor: '#f5f0e8', padding: '48px 24px'}}>
        <div style={{maxWidth: '1100px', margin: '0 auto'}}>
          <h3 style={{fontSize: '22px', fontWeight: '700', color: '#2d6da8', marginBottom: '24px'}}>⚡ Physik</h3>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px'}}>
            {physik.map(p => <ProduktKarte key={p.id} p={p} />)}
          </div>
        </div>
      </section>

      <section id="pakete" style={{backgroundColor: '#ffffff', padding: '48px 24px'}}>
        <div style={{maxWidth: '1100px', margin: '0 auto'}}>
          <h3 style={{fontSize: '22px', fontWeight: '700', color: '#8a6a20', marginBottom: '24px'}}>🎒 Lernpakete</h3>
          <div style={{backgroundColor: '#f5ead0', borderRadius: '12px', padding: '32px', border: '1px solid #e0cc99', textAlign: 'center'}}>
            <div style={{fontSize: '48px', marginBottom: '12px'}}>🚀</div>
            <h4 style={{margin: '0 0 8px', fontSize: '18px', fontWeight: '700', color: '#4a4035'}}>Bald verfügbar!</h4>
            <p style={{margin: 0, fontSize: '14px', color: '#7a6e62'}}>Spezielle Lernpakete für Abitur, Sommer und mehr kommen bald!</p>
          </div>
        </div>
      </section>

      <section id="quiz" style={{backgroundColor: '#f5f0e8', padding: '48px 24px'}}>
        <div style={{maxWidth: '1100px', margin: '0 auto'}}>
          <h3 style={{fontSize: '22px', fontWeight: '700', color: '#8a6a20', marginBottom: '8px'}}>🧠 Quiz</h3>
          <p style={{fontSize: '14px', color: '#7a6e62', marginBottom: '24px'}}>Kostenlos — direkt hier in der App!</p>
          <div style={{backgroundColor: '#ffffff', borderRadius: '12px', padding: '32px', border: '1px solid #e0d8cc', textAlign: 'center'}}>
            <div style={{fontSize: '48px', marginBottom: '12px'}}>🧠</div>
            <h4 style={{margin: '0 0 8px', fontSize: '18px', fontWeight: '700', color: '#4a4035'}}>Kostenlose Quizze!</h4>
            <p style={{margin: '0 0 20px', fontSize: '14px', color: '#7a6e62'}}>Teste dein Wissen in Mathe und Physik — kostenlos und interaktiv!</p>
            <button onClick={() => window.location.href = '/quiz'} style={{backgroundColor: '#5b9bd5', color: 'white', border: 'none', borderRadius: '10px', padding: '14px 32px', fontSize: '16px', fontWeight: '700', cursor: 'pointer'}}>Quiz starten</button>
          </div>
        </div>
      </section>

      <footer style={{textAlign: 'center', padding: '32px', backgroundColor: '#ffffff', borderTop: '1px solid #e0d8cc', color: '#a0947e', fontSize: '13px'}}>
        © 2025 Lerne mit Anna · <a href="/impressum" style={{color: '#a0947e', textDecoration: 'none'}}>Impressum</a> · <a href="/datenschutz" style={{color: '#a0947e', textDecoration: 'none'}}>Datenschutz</a> · <a href="/agb" style={{color: '#a0947e', textDecoration: 'none'}}>AGB</a>
      </footer>

    </main>
  );
}