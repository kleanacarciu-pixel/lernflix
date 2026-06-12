'use client';
import { useState, useEffect } from 'react';

type Produkt = {
  id: number;
  slug?: string;
  kategorie: string;
  typ: string;
  titel: string;
  beschreibung: string;
  details: string[];
  seiten: string;
  preis: number;
};

const F = {
  bg: '#fffdf8',
  bgWarm: '#fff8ee',
  bgCream: '#fef3dd',
  bgSoft: '#fef6e8',
  ink: '#0F172A',
  inkSoft: '#475569',
  inkMuted: '#94A3B8',
  border: '#E2E8F0',
  white: '#ffffff',
  coral: '#ff5b4a',
  coralDeep: '#e44b3c',
  blue: '#1769FF',
  navy: '#0B1F3A',
  navyDark: '#08182C',
  green: '#10B981',
  mathe: '#1769FF',
  physik: '#c8782e',
};
const SANS = '"Inter", -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';

export default function Shop() {
  const [ausgewaehlt, setAusgewaehlt] = useState<Produkt | null>(null);
  const [filter, setFilter] = useState<'alle' | 'mathe' | 'physik'>('alle');
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

  const kaufen = (produkt: Produkt) => {
    if (produkt.slug) window.location.href = `/materialien/${produkt.slug}`;
  };

  const produkte: Produkt[] = [
    { id: 1, slug: 'geometrie', kategorie: 'mathe', typ: 'Lernpaket', titel: 'Geometrie', beschreibung: 'Alle Geometrie-Themen — Dreiecke, Vierecke, Kreis, Körper.', details: ['13 Sektionen mit Skizzen', 'Pythagoras, Höhensatz, Kathetensatz', 'Trigonometrie komplett', 'Alle Vierecke & Körper', 'Strahlensätze & Ähnlichkeit', 'Schnellübersicht am Ende'], seiten: 'HTML', preis: 1.99 },
    { id: 2, slug: 'brueche', kategorie: 'mathe', typ: 'Lernpaket', titel: 'Brüche', beschreibung: 'Brüche endlich verstehen — kürzen, erweitern, addieren, multiplizieren.', details: ['Was ist ein Bruch?', 'Kürzen & Erweitern', 'Alle vier Grundrechenarten', 'Gemischte Brüche, Dezimalzahlen', 'Eselsbrücken', 'Übungen mit Lösungen'], seiten: 'HTML', preis: 1.99 },
    { id: 3, slug: 'prozent', kategorie: 'mathe', typ: 'Lernpaket', titel: 'Prozent & Zinsen', beschreibung: 'Rabatte, MwSt, Zinsen und Zinseszins — mit einfachen Tricks.', details: ['Die Grundformel', '3 klassische Aufgabentypen', 'Aufschlag & Rabatt', 'Zinsrechnung & Zinseszins', 'Promille und ppm', 'Übungen mit Lösungen'], seiten: 'HTML', preis: 0.99 },
    { id: 4, slug: 'gleichungen', kategorie: 'mathe', typ: 'Lernpaket', titel: 'Gleichungen', beschreibung: 'Vom einfachen x = 5 bis zur pq-Formel — Schritt für Schritt.', details: ['Terme vereinfachen', 'Lineare Gleichungen', 'Gleichungssysteme', 'Quadratische Gleichungen', 'pq-Formel & Mitternachtsformel', 'Ungleichungen'], seiten: 'HTML', preis: 1.99 },
    { id: 5, slug: 'funktionen', kategorie: 'mathe', typ: 'Lernpaket', titel: 'Funktionen', beschreibung: 'Geraden, Parabeln und Co — alle Funktionstypen mit Skizzen.', details: ['Lineare Funktionen', 'Quadratische Funktionen', 'pq-Formel anwenden', 'Schnittpunkte, Steigung, Scheitel', 'Spezielle Funktionen', 'Symmetrie und Monotonie'], seiten: 'HTML', preis: 1.99 },
    { id: 6, slug: 'stochastik', kategorie: 'mathe', typ: 'Lernpaket', titel: 'Wahrscheinlichkeit', beschreibung: 'Würfel, Münze, Mittelwert — mit Baumdiagrammen.', details: ['Grundlagen der Wahrscheinlichkeit', 'Mehrstufige Versuche', 'Mit und ohne Zurücklegen', 'Kombinatorik & Anordnungen', 'Mittelwert, Median', 'Binomialverteilung'], seiten: 'HTML', preis: 0.99 },
    { id: 7, slug: 'trigonometrie', kategorie: 'mathe', typ: 'Lernpaket', titel: 'Trigonometrie', beschreibung: 'sin, cos, tan kein Geheimnis mehr — mit Eselsbrücken.', details: ['Sinus, Kosinus, Tangens', 'Eselsbrücke GAGA HUDI', 'Sinussatz & Kosinussatz', 'Wertetabelle wichtiger Winkel', 'Trigonometrische Funktionen', 'Bogenmaß und Grad'], seiten: 'HTML', preis: 0.99 },
    { id: 8, slug: 'potenzen', kategorie: 'mathe', typ: 'Lernpaket', titel: 'Potenzen', beschreibung: 'Die fünf Potenzgesetze einfach erklärt — mit Übungen.', details: ['Alle 5 Potenzgesetze', 'Negative & gebrochene Exponenten', 'Wurzeln und Wurzelgesetze', 'Wissenschaftliche Schreibweise', 'Wachstum und Zerfall', 'Logarithmen'], seiten: 'HTML', preis: 0.99 },
    { id: 9, slug: 'mechanik', kategorie: 'physik', typ: 'Lernpaket', titel: 'Mechanik', beschreibung: 'Geschwindigkeit, Kraft, Energie, Hebel — mit Skizzen.', details: ['Bewegung & freier Fall', 'Newton-Gesetze', 'Schiefe Ebene', 'Energie, Arbeit, Leistung', 'Hebel & Flaschenzug', 'Dichte, Druck, Auftrieb'], seiten: 'HTML', preis: 0.99 },
    { id: 10, slug: 'elektrizitaet', kategorie: 'physik', typ: 'Lernpaket', titel: 'Elektrizität', beschreibung: 'Ohm, Spannung, Stromstärke — und die Stromrechnung verstehen.', details: ['Ohm´sches Gesetz', 'Reihen- und Parallelschaltung', 'Elektrische Arbeit & Leistung', 'Spezifischer Widerstand', 'Gefahren des Stroms', 'Übungen mit Lösungen'], seiten: 'HTML', preis: 1.99 },
    { id: 11, slug: 'optik', kategorie: 'physik', typ: 'Lernpaket', titel: 'Optik & Wellen', beschreibung: 'Licht, Spiegel, Linsen, Regenbogen — Sehen und Brechen.', details: ['Lichtausbreitung & Schatten', 'Reflexion am Spiegel', 'Lichtbrechung & Snellius', 'Linsen und Linsenformel', 'Spektrum und Farben', 'Wellen und Welleneigenschaften'], seiten: 'HTML', preis: 0.99 },
    { id: 12, slug: 'waerme', kategorie: 'physik', typ: 'Lernpaket', titel: 'Wärmelehre', beschreibung: 'Temperatur, Wärme, Aggregatzustände — das Zappeln der Atome.', details: ['Temperatur und Skalen', 'Wärmekapazität', 'Aggregatzustände & Phasenübergänge', 'Wärmeübertragung', 'Längenausdehnung', 'Gasgesetze'], seiten: 'HTML', preis: 0.99 },
    { id: 13, slug: 'atomphysik', kategorie: 'physik', typ: 'Lernpaket', titel: 'Atomphysik', beschreibung: 'Atome, Isotope, Radioaktivität — die Bausteine der Welt.', details: ['Atomaufbau & Isotope', 'Periodensystem', 'α-, β-, γ-Strahlung', 'Halbwertszeit', 'Kernspaltung & Kernfusion', 'Quantenphysik im Überblick'], seiten: 'HTML', preis: 0.99 },
  ];

  const mathe = produkte.filter((p) => p.kategorie === 'mathe');
  const physik = produkte.filter((p) => p.kategorie === 'physik');
  const angezeigt = filter === 'alle' ? produkte : produkte.filter((p) => p.kategorie === filter);

  return (
    <main style={{ minHeight: '100vh', background: F.bg, fontFamily: SANS, color: F.ink }}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" />

      <style>{`
        * { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
        body { background: ${F.bg}; margin: 0; font-family: ${SANS}; }
        .karte { transition: transform 0.3s cubic-bezier(0.2,0.8,0.2,1), box-shadow 0.3s ease, border-color 0.3s ease; cursor: pointer; }
        .karte:hover {
          transform: translateY(-4px);
          box-shadow: 0 24px 48px rgba(23,105,255,0.10), 0 4px 16px rgba(15,23,42,0.06);
          border-color: ${F.coral};
        }
        .karte:hover .karte-arrow { transform: translateX(6px); }
        .karte-arrow { transition: transform 0.3s ease; display: inline-block; }
        .btn-coral { transition: background 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease; }
        .btn-coral:hover { background: ${F.coralDeep}; transform: translateY(-1px); box-shadow: 0 14px 32px rgba(255,91,74,0.32); }
        .tab { transition: all 0.2s ease; }
        .nav-link { color: ${F.ink}; text-decoration: none; font-size: 14.5px; font-weight: 500; padding: 8px 14px; border-radius: 8px; transition: background 0.15s ease; }
        .nav-link:hover { background: ${F.bgSoft}; }
      `}</style>

      {/* MODAL */}
      {ausgewaehlt && (
        <div onClick={() => setAusgewaehlt(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: F.white, borderRadius: '24px', maxWidth: '560px', width: '100%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 30px 70px rgba(0,0,0,0.22)' }}>
            <div style={{ padding: mobil ? '32px 24px 28px' : '44px 44px 36px', position: 'relative' }}>
              <button onClick={() => setAusgewaehlt(null)} style={{ position: 'absolute', top: '20px', right: '20px', background: F.bgWarm, border: 'none', width: '36px', height: '36px', fontSize: '18px', cursor: 'pointer', color: F.inkSoft, lineHeight: 1, borderRadius: '50%' }}>✕</button>
              <span style={{ fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', color: ausgewaehlt.kategorie === 'mathe' ? F.mathe : F.physik, fontWeight: 800 }}>{ausgewaehlt.kategorie === 'mathe' ? 'Mathematik' : 'Physik'}</span>
              <h2 style={{ fontFamily: SANS, fontSize: mobil ? '32px' : '42px', fontWeight: 800, margin: '8px 0 14px', color: F.ink, lineHeight: 1.05, letterSpacing: '-0.025em' }}>{ausgewaehlt.titel}</h2>
              <p style={{ fontSize: '15.5px', color: F.inkSoft, lineHeight: 1.6, margin: '0 0 24px' }}>{ausgewaehlt.beschreibung}</p>
              <div style={{ background: F.bgWarm, borderRadius: '18px', padding: '22px 24px', marginBottom: '28px' }}>
                <p style={{ fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', color: F.coral, fontWeight: 800, margin: '0 0 14px' }}>Was drin ist</p>
                {ausgewaehlt.details.map((d, i) => (
                  <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, marginTop: '4px' }}>
                      <path d="M3 7L6 10L11 4" stroke={F.green} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span style={{ fontSize: '14.5px', color: F.ink, lineHeight: 1.5, fontWeight: 500 }}>{d}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '20px', borderTop: `1px solid ${F.border}` }}>
                <div>
                  <p style={{ margin: 0, fontSize: '11px', color: F.inkMuted, letterSpacing: '0.10em', textTransform: 'uppercase', fontWeight: 700 }}>Einmalig</p>
                  <p style={{ margin: '4px 0 0', fontSize: '36px', fontWeight: 800, color: F.ink, letterSpacing: '-0.025em' }}>{ausgewaehlt.preis.toFixed(2).replace('.', ',')} €</p>
                </div>
                <button onClick={() => kaufen(ausgewaehlt)} className="btn-coral" style={{ background: F.coral, color: F.white, border: 'none', borderRadius: '14px', padding: '15px 28px', fontSize: '15px', fontWeight: 700, cursor: 'pointer', fontFamily: SANS, boxShadow: '0 8px 24px rgba(255,91,74,0.30)' }}>
                  Jetzt freischalten →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: scrolled ? 'rgba(255,253,248,0.94)' : 'transparent', backdropFilter: scrolled ? 'saturate(180%) blur(20px)' : 'none', borderBottom: scrolled ? `1px solid ${F.border}` : '1px solid transparent', padding: mobil ? '14px 22px' : '18px 56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all 0.3s ease' }}>
        <a href="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontSize: mobil ? '24px' : '26px', fontWeight: 800, color: F.ink, letterSpacing: '-0.025em' }}>
            Lern<span style={{ color: F.coral }}>flix</span>
          </span>
        </a>
        <nav style={{ display: 'flex', gap: mobil ? '4px' : '8px', alignItems: 'center' }}>
          {!mobil && (
            <>
              <a href="/shop" className="nav-link">Lernmaterialien</a>
              <a href="/lernplan" className="nav-link">Lernplan</a>
              <a href="/quiz" className="nav-link">Quiz</a>
            </>
          )}
          <a href="/lernheld" className="btn-coral" style={{ background: F.coral, color: F.white, textDecoration: 'none', fontSize: '13.5px', fontWeight: 700, padding: '10px 18px', borderRadius: '14px', marginLeft: mobil ? '0' : '12px', boxShadow: '0 8px 22px rgba(255,91,74,0.26)', display: 'inline-flex', alignItems: 'center' }}>
            Lernheld
          </a>
        </nav>
      </header>

      {/* HERO - hell, warm */}
      <section style={{ background: F.bgWarm, paddingTop: mobil ? '110px' : '140px', paddingBottom: mobil ? '50px' : '70px', paddingLeft: mobil ? '22px' : '56px', paddingRight: mobil ? '22px' : '56px', position: 'relative', overflow: 'hidden' }}>
        {!mobil && (
          <>
            <div style={{ position: 'absolute', top: '120px', right: '6%', width: '160px', height: '160px', borderRadius: '50%', background: F.bgCream, opacity: 0.7, pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '40px', left: '4%', width: '120px', height: '120px', borderRadius: '50%', background: '#e7f5ec', opacity: 0.7, pointerEvents: 'none' }} />
          </>
        )}
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: F.white, color: F.coral, padding: '8px 16px', borderRadius: '999px', fontSize: '12px', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '24px', boxShadow: '0 4px 14px rgba(255,91,74,0.16)' }}>
            Shop · 13 Pakete
          </span>
          <h1 style={{ fontFamily: SANS, fontSize: mobil ? '46px' : '78px', fontWeight: 800, lineHeight: 1.0, margin: '0 0 18px', color: F.ink, letterSpacing: '-0.035em' }}>
            Lernmaterialien.
          </h1>
          <p style={{ fontSize: mobil ? '16px' : '19px', color: F.inkSoft, lineHeight: 1.55, margin: 0, maxWidth: '620px', fontWeight: 400 }}>
            Lernpakete für Mathematik und Physik. Mit Erklärungen, Skizzen und Übungen. Sofort verfügbar — ab 0,99 €.
          </p>
        </div>
      </section>

      {/* FILTER + GRID */}
      <section style={{ background: F.bg, padding: mobil ? '40px 22px 80px' : '60px 56px 130px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Filter */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: mobil ? '28px' : '40px', flexWrap: 'wrap' }}>
            {([
              { id: 'alle' as const, t: 'Alle', n: produkte.length },
              { id: 'mathe' as const, t: 'Mathematik', n: mathe.length },
              { id: 'physik' as const, t: 'Physik', n: physik.length },
            ]).map((tab) => (
              <button key={tab.id} onClick={() => setFilter(tab.id)} className="tab" style={{ background: filter === tab.id ? F.ink : F.white, color: filter === tab.id ? F.white : F.ink, border: `1.5px solid ${filter === tab.id ? F.ink : F.border}`, padding: '11px 22px', borderRadius: '999px', fontSize: '13.5px', fontWeight: 700, cursor: 'pointer', fontFamily: SANS, display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                {tab.t}
                <span style={{ fontSize: '12px', fontWeight: 700, opacity: 0.65 }}>{tab.n}</span>
              </button>
            ))}
          </div>

          {/* Grid - max 3 pro reihe, viel groessere abstaende */}
          <div style={{ display: 'grid', gridTemplateColumns: mobil ? '1fr' : breite < 1100 ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', gap: mobil ? '20px' : '32px' }}>
            {angezeigt.map((p) => (<ProduktKarte key={p.id} p={p} onClick={() => setAusgewaehlt(p)} mobil={mobil} />))}
          </div>
        </div>
      </section>

      {/* FOOTER - matched mit homepage */}
      <footer style={{ background: F.navyDark, color: F.white, padding: mobil ? '60px 22px 30px' : '80px 56px 36px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '24px', marginBottom: '40px' }}>
            <span style={{ fontSize: '28px', fontWeight: 800, color: F.white, letterSpacing: '-0.025em' }}>
              Lern<span style={{ color: F.coral }}>flix</span>
            </span>
            <div style={{ display: 'flex', gap: mobil ? '18px' : '32px', flexWrap: 'wrap' }}>
              <a href="/" style={{ color: 'rgba(255,255,255,0.82)', textDecoration: 'none', fontSize: '14px' }}>Startseite</a>
              <a href="/lernplan" style={{ color: 'rgba(255,255,255,0.82)', textDecoration: 'none', fontSize: '14px' }}>Lernplan</a>
              <a href="/lernheld" style={{ color: 'rgba(255,255,255,0.82)', textDecoration: 'none', fontSize: '14px' }}>Lernheld</a>
              <a href="/quiz" style={{ color: 'rgba(255,255,255,0.82)', textDecoration: 'none', fontSize: '14px' }}>Quiz</a>
              <a href="/impressum" style={{ color: 'rgba(255,255,255,0.82)', textDecoration: 'none', fontSize: '14px' }}>Impressum</a>
              <a href="/datenschutz" style={{ color: 'rgba(255,255,255,0.82)', textDecoration: 'none', fontSize: '14px' }}>Datenschutz</a>
              <a href="/agb" style={{ color: 'rgba(255,255,255,0.82)', textDecoration: 'none', fontSize: '14px' }}>AGB</a>
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.10)', paddingTop: '22px', fontSize: '13px', color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>
            © {new Date().getFullYear()} Lernflix · lernflix.lernemitanna.de
          </div>
        </div>
      </footer>
    </main>
  );
}

function ProduktKarte({ p, onClick, mobil }: { p: Produkt; onClick: () => void; mobil: boolean }) {
  const F2 = {
    bg: '#ffffff', ink: '#0F172A', inkSoft: '#475569', inkMuted: '#94A3B8', border: '#E2E8F0', coral: '#ff5b4a',
    mathe: '#1769FF', physik: '#c8782e',
    matheBg: '#E8F0FF', physikBg: '#FEF1E0',
  };
  const akzent = p.kategorie === 'mathe' ? F2.mathe : F2.physik;
  const akzentBg = p.kategorie === 'mathe' ? F2.matheBg : F2.physikBg;
  return (
    <div onClick={onClick} className="karte" style={{ background: F2.bg, borderRadius: '24px', overflow: 'hidden', display: 'flex', flexDirection: 'column', border: `1.5px solid ${F2.border}`, padding: mobil ? '28px 26px 26px' : '36px 32px 32px', boxShadow: '0 1px 2px rgba(15,23,42,0.04)', minHeight: mobil ? '260px' : '320px' }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <span style={{ background: akzentBg, color: akzent, padding: '7px 14px', borderRadius: '999px', fontSize: '12px', letterSpacing: '0.10em', textTransform: 'uppercase', fontWeight: 800 }}>
          {p.kategorie === 'mathe' ? 'Mathematik' : 'Physik'}
        </span>
      </div>
      <h3 style={{ fontFamily: SANS, fontSize: mobil ? '30px' : '34px', fontWeight: 800, margin: '0 0 14px', color: F2.ink, letterSpacing: '-0.025em', lineHeight: 1.05 }}>{p.titel}</h3>
      <p style={{ fontSize: mobil ? '15px' : '16px', color: F2.inkSoft, lineHeight: 1.55, margin: '0 0 28px', flex: 1, fontWeight: 400 }}>{p.beschreibung}</p>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '20px', borderTop: `1px solid ${F2.border}` }}>
        <span style={{ fontSize: mobil ? '22px' : '24px', fontWeight: 800, color: F2.ink, letterSpacing: '-0.02em' }}>{p.preis.toFixed(2).replace('.', ',')} €</span>
        <span style={{ fontSize: '14.5px', color: F2.coral, fontWeight: 800, letterSpacing: '0.02em', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          Ansehen <span className="karte-arrow" style={{ fontSize: '17px' }}>→</span>
        </span>
      </div>
    </div>
  );
}
