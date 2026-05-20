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
  const [heftPos, setHeftPos] = useState(0);
  const [heftRichtung, setHeftRichtung] = useState(1);
  const [kratzen, setKratzen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeftPos(prev => {
        const next = prev + heftRichtung * 1.5;
        if (next >= 60) setHeftRichtung(-1);
        if (next <= 0) setHeftRichtung(1);
        return next;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [heftRichtung]);

  useEffect(() => {
    const interval = setInterval(() => {
      setKratzen(prev => !prev);
    }, 1500);
    return () => clearInterval(interval);
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
          0%, 100% { transform: rotate(-30deg) translateY(-5px); }
          50% { transform: rotate(-60deg) translateY(-15px); }
        }
        @keyframes fragezeichen {
          0%, 100% { transform: translateY(0px) scale(1); opacity: 1; }
          50% { transform: translateY(-10px) scale(1.2); opacity: 0.7; }
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
          0%, 90%, 100% { transform: scaleY(1); }
          95% { transform: scaleY(0.1); }
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

        {/* Schwebende Formeln */}
        <div style={{position: 'absolute', top: '20px', left: '8%', fontSize: '24px', fontWeight: '700', color: '#5b9bd5', animation: 'schweben1 3s ease-in-out infinite'}}>x²</div>
        <div style={{position: 'absolute', top: '40px', right: '10%', fontSize: '20px', fontWeight: '700', color: '#2d6da8', animation: 'schweben2 4s ease-in-out infinite'}}>E=mc²</div>
        <div style={{position: 'absolute', bottom: '80px', left: '5%', fontSize: '22px', fontWeight: '700', color: '#8a6a20', animation: 'schweben3 3.5s ease-in-out infinite'}}>π</div>
        <div style={{position: 'absolute', top: '30px', left: '28%', fontSize: '18px', fontWeight: '700', color: '#5b9bd5', animation: 'schweben2 2.8s ease-in-out infinite'}}>a²+b²=c²</div>
        <div style={{position: 'absolute', bottom: '60px', right: '8%', fontSize: '20px', fontWeight: '700', color: '#2d6da8', animation: 'schweben1 3.2s ease-in-out infinite'}}>F=ma</div>
        <div style={{position: 'absolute', top: '50px', right: '28%', fontSize: '16px', fontWeight: '700', color: '#8a6a20', animation: 'schweben3 4.5s ease-in-out infinite'}}>∑</div>

        {/* Titel */}
        <h1 style={{fontSize: '80px', fontWeight: '900', margin: '0 0 8px', letterSpacing: '-3px', color: '#1a1a2e', textTransform: 'uppercase', lineHeight: 1}}>LERNFLIX</h1>
        <p style={{fontSize: '18px', margin: '0 0 40px', color: '#666666', letterSpacing: '2px', fontWeight: '500'}}>Dein Lernstream. Deine Regeln.</p>

        {/* Animiertes Heft Maskottchen */}
        <div style={{display: 'flex', justifyContent: 'center', marginBottom: '40px', minHeight: '180px', alignItems: 'flex-end'}}>
          <div style={{position: 'relative', transform: `translateX(${heftPos - 30}px)`}}>

            {/* Fragezeichen über Kopf */}
            <div style={{position: 'absolute', top: '-40px', right: '-10px', fontSize: '28px', fontWeight: '900', color: '#5b9bd5', animation: 'fragezeichen 1.5s ease-in-out infinite'}}>?</div>

            {/* Arm kratzen */}
            <div style={{
              position: 'absolute',
              top: '15px',
              right: '-20px',
              width: '8px',
              height: '35px',
              backgroundColor: '#5b9bd5',
              borderRadius: '4px',
              transformOrigin: 'top center',
              animation: kratzen ? 'armKratzen 0.3s ease-in-out infinite' : 'none',
              transform: 'rotate(-40deg)',
            }}></div>

            {/* Heft Körper */}
            <div style={{width: '90px', height: '110px', backgroundColor: '#5b9bd5', borderRadius: '8px 14px 14px 8px', position: 'relative', boxShadow: '6px 6px 20px rgba(91,155,213,0.35)'}}>

              {/* Spirale */}
              <div style={{position: 'absolute', left: '5px', top: '12px', width: '8px', height: '86px', display: 'flex', flexDirection: 'column', justifyContent: 'space-around'}}>
                {[0,1,2,3,4,5].map(i => (
                  <div key={i} style={{width: '9px', height: '9px', borderRadius: '50%', backgroundColor: '#1a1a2e', border: '2px solid white'}}></div>
                ))}
              </div>

              {/* Augen */}
              <div style={{position: 'absolute', top: '22px', left: '24px', display: 'flex', gap: '14px'}}>
                <div style={{width: '14px', height: '14px', backgroundColor: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'blinzeln 3s ease-in-out infinite'}}>
                  <div style={{width: '7px', height: '7px', backgroundColor: '#1a1a2e', borderRadius: '50%'}}></div>
                </div>
                <div style={{width: '14px', height: '14px', backgroundColor: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'blinzeln 3s ease-in-out infinite 0.1s'}}>
                  <div style={{width: '7px', height: '7px', backgroundColor: '#1a1a2e', borderRadius: '50%'}}></div>
                </div>
              </div>

              {/* Lächeln */}
              <div style={{position: 'absolute', top: '48px', left: '22px', width: '46px', height: '22px', borderBottom: '4px solid white', borderLeft: '4px solid transparent', borderRight: '4px solid transparent', borderRadius: '0 0 30px 30px'}}></div>

              {/* Wangen */}
              <div style={{position: 'absolute', top: '42px', left: '18px', width: '10px', height: '6px', backgroundColor: '#ff9999', borderRadius: '50%', opacity: 0.7}}></div>
              <div style={{position: 'absolute', top: '42px', right: '12px', width: '10px', height: '6px', backgroundColor: '#ff9999', borderRadius: '50%', opacity: 0.7}}></div>

              {/* Linien auf Heft */}
              <div style={{position: 'absolute', bottom: '20px', left: '20px', right: '8px', height: '2px', backgroundColor: 'rgba(255,255,255,0.4)'}}></div>
              <div style={{position: 'absolute', bottom: '30px', left: '20px', right: '8px', height: '2px', backgroundColor: 'rgba(255,255,255,0.4)'}}></div>
            </div>

            {/* Beine */}
            <div style={{display: 'flex', justifyContent: 'center', gap: '18px', marginTop: '4px'}}>
              <div style={{width: '11px', height: '32px', backgroundColor: '#1a1a2e', borderRadius: '6px', transformOrigin: 'top center', animation: 'beinLinks 0.4s ease-in-out infinite'}}></div>
              <div style={{width: '11px', height: '32px', backgroundColor: '#1a1a2e', borderRadius: '6px', transformOrigin: 'top center', animation: 'beinRechts 0.4s ease-in-out infinite'}}></div>
            </div>

          </div>
        </div>

        {/* Buttons */}
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