'use client';
import { useState } from 'react';

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
      {/* Farbiges oberes Feld mit Emoji */}
      <div style={{backgroundColor: p.hellfarbe, height: '160px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', borderBottom: `2px solid ${p.farbe}20`}}>
        <span style={{fontSize: '64px'}}>{p.emoji}</span>
        <span style={{fontSize: '11px', fontWeight: '700', color: p.farbe, textTransform: 'uppercase', letterSpacing: '0.08em'}}>{p.typ}</span>
      </div>

      {/* Inhalt */}
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

      {/* POPUP */}
      {ausgewaehlt && (
        <div
          onClick={() => setAusgewaehlt(null)}
          style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'}}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{backgroundColor: 'white', borderRadius: '16px', maxWidth: '700px', width: '100%', overflow: 'hidden', maxHeight: '90vh', overflowY: 'auto'}}
          >
            {/* Popup Bild */}
            <div style={{position: 'relative', height: '300px', backgroundColor: '#f0f0f0'}}>
              <img src={ausgewaehlt.vorschau} alt={ausgewaehlt.titel} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
              <button
                onClick={() => setAusgewaehlt(null)}
                style={{position: 'absolute', top: '12px', right: '12px', backgroundColor: 'white', border: 'none', borderRadius: '50%', width: '36px', height: '36px', fontSize: '18px', cursor: 'pointer', fontWeight: '700', color: '#4a4035', boxShadow: '0 2px 8px rgba(0,0,0,0.2)'}}
              >✕</button>
              <div style={{position: 'absolute', top: '12px', left: '12px', backgroundColor: ausgewaehlt.farbe, color: 'white', fontSize: '11px', fontWeight: '700', padding: '4px 12px', borderRadius: '20px', textTransform: 'uppercase'}}>
                {ausgewaehlt.typ}
              </div>
            </div>

            {/* Popup Inhalt */}
            <div style={{padding: '28px'}}>
              <h2 style={{margin: '0 0 8px', fontSize: '22px', fontWeight: '700', color: '#4a4035'}}>{ausgewaehlt.emoji} {ausgewaehlt.titel}</h2>
              <p style={{margin: '0 0 20px', fontSize: '14px', color: '#7a6e62', lineHeight: '1.6'}}>{ausgewaehlt.beschreibung}</p>

              {/* Was ist drin */}
              <div style={{backgroundColor: '#f5f0e8', borderRadius: '10px', padding: '16px', marginBottom: '20px'}}>
                <p style={{margin: '0 0 10px', fontSize: '14px', fontWeight: '700', color: '#4a4035'}}>📋 Was ist drin:</p>
                {ausgewaehlt.details.map((d, i) => (
                  <div key={i} style={{display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '6px'}}>
                    <span style={{color: ausgewaehlt.farbe, fontWeight: '700', fontSize: '14px', flexShrink: 0}}>✓</span>
                    <span style={{fontSize: '13px', color: '#4a4035'}}>{d}</span>
                  </div>
                ))}
              </div>

              {/* Infos */}
              <div style={{display: 'flex', gap: '10px', marginBottom: '24px', flexWrap: 'wrap'}}>
                <span style={{fontSize: '12px', color: '#7a6e62', backgroundColor: '#f5f0e8', padding: '5px 12px', borderRadius: '20px'}}>📄 {ausgewaehlt.seiten}</span>
                <span style={{fontSize: '12px', color: '#7a6e62', backgroundColor: '#f5f0e8', padding: '5px 12px', borderRadius: '20px'}}>⬇️ Sofort-Download nach Kauf</span>
                <span style={{fontSize: '12px', color: '#7a6e62', backgroundColor: '#f5f0e8', padding: '5px 12px', borderRadius: '20px'}}>🔒 Sicherer Kauf via Stripe</span>
              </div>

              {/* Preis & Kaufen */}
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e0d8cc', paddingTop: '20px'}}>
                <div>
                  <p style={{margin: '0', fontSize: '12px', color: '#a0947e'}}>Preis</p>
                  <p style={{margin: '0', fontSize: '28px', fontWeight: '700', color: ausgewaehlt.farbe}}>{ausgewaehlt.preis.toFixed(2).replace('.', ',')} €</p>
                </div>
                <button
                  onClick={() => kaufen(ausgewaehlt.titel, ausgewaehlt.preis)}
                  style={{backgroundColor: ausgewaehlt.farbe, color: 'white', border: 'none', borderRadius: '10px', padding: '14px 32px', fontSize: '16px', fontWeight: '700', cursor: 'pointer'}}
                >
                  Jetzt kaufen →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header style={{backgroundColor: '#ffffff', borderBottom: '1px solid #e0d8cc', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <img src="/logo.jpg?v=1" alt="Lerne mit Anna" style={{height: '60px'}} />
        <nav style={{display: 'flex', gap: '24px'}}>
          <a href="#mathe" style={{color: '#5b9bd5', textDecoration: 'none', fontSize: '14px', fontWeight: '500'}}>Mathe</a>
          <a href="#physik" style={{color: '#5b9bd5', textDecoration: 'none', fontSize: '14px', fontWeight: '500'}}>Physik</a>
          <a href="#pakete" style={{color: '#5b9bd5', textDecoration: 'none', fontSize: '14px', fontWeight: '500'}}>Lernpakete</a>
          <a href="#quiz" style={{color: '#5b9bd5', textDecoration: 'none', fontSize: '14px', fontWeight: '500'}}>Quiz</a>
        </nav>
      </header>

      {/* Hero */}
      <section style={{backgroundColor: '#5b9bd5', color: 'white', textAlign: 'center', padding: '64px 24px'}}>
        <h2 style={{fontSize: '40px', fontWeight: '700', margin: '0 0 12px'}}>Mathe & Physik leicht gemacht</h2>
        <p style={{fontSize: '18px', margin: '0 0 32px', opacity: 0.9}}>Lernmaterialien von Anna — sofort herunterladen</p>
        <div style={{display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap'}}>
          <a href="#mathe" style={{backgroundColor: 'white', color: '#5b9bd5', fontWeight: '700', padding: '12px 28px', borderRadius: '50px', textDecoration: 'none', fontSize: '15px'}}>Materialien ansehen</a>
          <a href="#quiz" style={{backgroundColor: 'transparent', color: 'white', fontWeight: '700', padding: '12px 28px', borderRadius: '50px', textDecoration: 'none', fontSize: '15px', border: '2px solid white'}}>Kostenlose Quizze</a>
        </div>
      </section>

      {/* Kategorien */}
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
          <a href="#quiz" style={{textDecoration: 'none'}}>
            <div style={{backgroundColor: '#f5ead0', borderRadius: '16px', padding: '32px 24px', textAlign: 'center', border: '1px solid #e0cc99'}}>
              <div style={{fontSize: '48px', marginBottom: '12px'}}>🧠</div>
              <h4 style={{margin: '0 0 6px', fontSize: '20px', fontWeight: '700', color: '#8a6a20'}}>Quiz</h4>
              <p style={{margin: 0, fontSize: '13px', color: '#9a8040'}}>Kostenlose Quizze direkt in der App</p>
            </div>
          </a>
        </div>
      </section>

      {/* Mathe */}
      <section id="mathe" style={{backgroundColor: '#ffffff', padding: '48px 24px'}}>
        <div style={{maxWidth: '1100px', margin: '0 auto'}}>
          <h3 style={{fontSize: '22px', fontWeight: '700', color: '#2d6da8', marginBottom: '24px'}}>📐 Mathe</h3>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px'}}>
            {mathe.map(p => <ProduktKarte key={p.id} p={p} />)}
          </div>
        </div>
      </section>

      {/* Physik */}
      <section id="physik" style={{backgroundColor: '#f5f0e8', padding: '48px 24px'}}>
        <div style={{maxWidth: '1100px', margin: '0 auto'}}>
          <h3 style={{fontSize: '22px', fontWeight: '700', color: '#2d6da8', marginBottom: '24px'}}>⚡ Physik</h3>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px'}}>
            {physik.map(p => <ProduktKarte key={p.id} p={p} />)}
          </div>
        </div>
      </section>

      {/* Lernpakete */}
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

      {/* Quiz */}
      <section id="quiz" style={{backgroundColor: '#f5f0e8', padding: '48px 24px'}}>
        <div style={{maxWidth: '1100px', margin: '0 auto'}}>
          <h3 style={{fontSize: '22px', fontWeight: '700', color: '#8a6a20', marginBottom: '8px'}}>🧠 Quiz</h3>
          <p style={{fontSize: '14px', color: '#7a6e62', marginBottom: '24px'}}>Kostenlos — direkt hier in der App!</p>
          <div style={{backgroundColor: '#ffffff', borderRadius: '12px', padding: '32px', border: '1px solid #e0d8cc', textAlign: 'center'}}>
            <div style={{fontSize: '48px', marginBottom: '12px'}}>🚀</div>
            <h4 style={{margin: '0 0 8px', fontSize: '18px', fontWeight: '700', color: '#4a4035'}}>Bald verfügbar!</h4>
            <p style={{margin: 0, fontSize: '14px', color: '#7a6e62'}}>Kostenlose Quizze kommen bald!</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{textAlign: 'center', padding: '32px', backgroundColor: '#ffffff', borderTop: '1px solid #e0d8cc', color: '#a0947e', fontSize: '13px'}}>
        © 2025 Lerne mit Anna · <a href="/impressum" style={{color: '#a0947e', textDecoration: 'none'}}>Impressum</a> · <a href="/datenschutz" style={{color: '#a0947e', textDecoration: 'none'}}>Datenschutz</a> · <a href="/agb" style={{color: '#a0947e', textDecoration: 'none'}}>AGB</a>
      </footer>

    </main>
  );
}