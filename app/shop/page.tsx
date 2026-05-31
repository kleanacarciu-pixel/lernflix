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
  bg: '#ffffff',
  bgSoft: '#fafaf7',
  ink: '#1c1c1e',
  inkSoft: '#5a5a5e',
  inkMuted: '#9a9a9e',
  border: '#ececec',
  white: '#ffffff',
  coral: '#e85a4f',
  coralDeep: '#cf4a40',
  mathe: '#3a6ea5',
  physik: '#c8782e',
  dark: '#1c1c1e',
};

const SERIF = '"Cormorant Garamond", Georgia, serif';
const SANS = '"Inter", -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif';

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
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap" />

      <style>{`
        * { -webkit-font-smoothing: antialiased; }
        body { background: ${F.bg}; }
        .karte { transition: transform 0.25s ease, box-shadow 0.25s ease; cursor: pointer; }
        .karte:hover { transform: translateY(-4px); box-shadow: 0 18px 36px rgba(28,28,30,0.08); }
        .btn-primary { transition: all 0.25s ease; }
        .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 12px 24px rgba(232,90,79,0.28); }
        .tab { transition: all 0.2s ease; }
      `}</style>

      {/* MODAL */}
      {ausgewaehlt && (
        <div onClick={() => setAusgewaehlt(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(28,28,30,0.55)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: F.white, borderRadius: '20px', maxWidth: '540px', width: '100%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 30px 70px rgba(0,0,0,0.22)' }}>
            <div style={{ padding: mobil ? '32px 24px 28px' : '40px 44px 36px', position: 'relative' }}>
              <button onClick={() => setAusgewaehlt(null)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', width: '32px', height: '32px', fontSize: '20px', cursor: 'pointer', color: F.inkMuted, lineHeight: 1 }}>✕</button>
              <span style={{ fontSize: '10.5px', letterSpacing: '0.22em', textTransform: 'uppercase', color: ausgewaehlt.kategorie === 'mathe' ? F.mathe : F.physik, fontWeight: 700 }}>{ausgewaehlt.kategorie === 'mathe' ? 'Mathematik' : 'Physik'}</span>
              <h2 style={{ fontFamily: SERIF, fontSize: mobil ? '32px' : '42px', fontWeight: 600, margin: '8px 0 14px', color: F.ink, lineHeight: 1.05, letterSpacing: '-0.02em' }}>{ausgewaehlt.titel}</h2>
              <p style={{ fontSize: '15.5px', color: F.inkSoft, lineHeight: 1.6, margin: '0 0 28px' }}>{ausgewaehlt.beschreibung}</p>
              <div style={{ borderTop: `1px solid ${F.border}`, borderBottom: `1px solid ${F.border}`, padding: '22px 0', marginBottom: '28px' }}>
                <p style={{ fontSize: '10.5px', letterSpacing: '0.22em', textTransform: 'uppercase', color: F.inkMuted, fontWeight: 700, margin: '0 0 14px' }}>Inhalt</p>
                {ausgewaehlt.details.map((d, i) => (
                  <div key={i} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <span style={{ color: F.coral, fontSize: '14px', flexShrink: 0, marginTop: '2px', fontWeight: 700 }}>—</span>
                    <span style={{ fontSize: '14.5px', color: F.ink, lineHeight: 1.5 }}>{d}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ margin: 0, fontSize: '10.5px', color: F.inkMuted, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Einmalig</p>
                  <p style={{ margin: '4px 0 0', fontFamily: SERIF, fontSize: '38px', fontWeight: 600, color: F.ink, letterSpacing: '-0.02em' }}>{ausgewaehlt.preis.toFixed(2).replace('.', ',')} €</p>
                </div>
                <button onClick={() => kaufen(ausgewaehlt)} className="btn-primary" style={{ background: F.coral, color: F.white, border: 'none', borderRadius: '999px', padding: '15px 30px', fontSize: '14.5px', fontWeight: 600, cursor: 'pointer', fontFamily: SANS, letterSpacing: '0.01em' }}>
                  Jetzt freischalten
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: scrolled ? 'rgba(255,255,255,0.94)' : 'transparent', backdropFilter: scrolled ? 'saturate(180%) blur(20px)' : 'none', borderBottom: scrolled ? `1px solid ${F.border}` : '1px solid transparent', padding: mobil ? '14px 22px' : '18px 60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all 0.3s ease' }}>
        <a href="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontFamily: SERIF, fontSize: mobil ? '26px' : '30px', fontWeight: 700, color: F.ink, letterSpacing: '-0.02em' }}>
            Lern<span style={{ color: F.coral }}>flix</span>
          </span>
        </a>
        <nav style={{ display: 'flex', gap: mobil ? '14px' : '32px', alignItems: 'center' }}>
          {!mobil && (
            <>
              <a href="/shop" style={{ color: F.ink, textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>Shop</a>
              <a href="/lernplan" style={{ color: F.ink, textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>Lernplan</a>
              <a href="/quiz" style={{ color: F.ink, textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>Quiz</a>
            </>
          )}
          <a href="/lernheld" style={{ background: F.coral, color: F.white, textDecoration: 'none', fontSize: '13.5px', fontWeight: 600, padding: '10px 20px', borderRadius: '999px' }}>Lernheld</a>
        </nav>
      </header>

      {/* HERO mit Foto */}
      <section style={{ position: 'relative', height: mobil ? '52vh' : '60vh', minHeight: mobil ? '380px' : '480px', overflow: 'hidden' }}>
        <img src="https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1600&auto=format&fit=crop&q=85" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(28,28,30,0.25) 0%, rgba(28,28,30,0.65) 100%)' }} />
        <div style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'flex-end', padding: mobil ? '0 22px 50px' : '0 60px 80px' }}>
          <div style={{ maxWidth: '900px' }}>
            <span style={{ display: 'inline-block', background: 'rgba(255,255,255,0.16)', backdropFilter: 'blur(10px)', color: F.white, padding: '7px 16px', borderRadius: '999px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.20em', textTransform: 'uppercase', marginBottom: '22px', border: '1px solid rgba(255,255,255,0.25)' }}>
              Shop · 13 Pakete
            </span>
            <h1 style={{ fontFamily: SERIF, fontSize: mobil ? '52px' : '92px', fontWeight: 600, lineHeight: 0.96, margin: '0 0 18px', color: F.white, letterSpacing: '-0.035em' }}>
              Lernmaterialien.
            </h1>
            <p style={{ fontSize: mobil ? '15.5px' : '18px', color: 'rgba(255,255,255,0.85)', lineHeight: 1.55, margin: 0, maxWidth: '580px' }}>
              Lernpakete für Mathematik und Physik. Mit Erklärungen, Skizzen und Übungen. Sofort verfügbar — ab 0,99 €.
            </p>
          </div>
        </div>
      </section>

      {/* FILTER + GRID */}
      <section style={{ background: F.bg, padding: mobil ? '40px 22px 80px' : '60px 60px 120px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Filter */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: mobil ? '28px' : '40px', flexWrap: 'wrap' }}>
            {([
              { id: 'alle' as const, t: 'Alle', n: produkte.length },
              { id: 'mathe' as const, t: 'Mathematik', n: mathe.length },
              { id: 'physik' as const, t: 'Physik', n: physik.length },
            ]).map((tab) => (
              <button key={tab.id} onClick={() => setFilter(tab.id)} className="tab" style={{ background: filter === tab.id ? F.ink : 'transparent', color: filter === tab.id ? F.white : F.ink, border: `1px solid ${filter === tab.id ? F.ink : F.border}`, padding: '11px 22px', borderRadius: '999px', fontSize: '13.5px', fontWeight: 600, cursor: 'pointer', fontFamily: SANS, display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                {tab.t}
                <span style={{ fontSize: '12px', fontWeight: 600, opacity: 0.65 }}>{tab.n}</span>
              </button>
            ))}
          </div>

          {/* Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: mobil ? '1fr 1fr' : 'repeat(auto-fill, minmax(240px, 1fr))', gap: mobil ? '14px' : '22px' }}>
            {angezeigt.map((p) => (<ProduktKarte key={p.id} p={p} onClick={() => setAusgewaehlt(p)} mobil={mobil} />))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: F.dark, color: F.white, padding: mobil ? '50px 22px 28px' : '70px 60px 36px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '24px', marginBottom: '40px' }}>
            <span style={{ fontFamily: SERIF, fontSize: '28px', fontWeight: 700, color: F.white, letterSpacing: '-0.02em' }}>
              Lern<span style={{ color: F.coral }}>flix</span>
            </span>
            <div style={{ display: 'flex', gap: mobil ? '18px' : '32px', flexWrap: 'wrap' }}>
              <a href="/" style={{ color: 'rgba(255,255,255,0.75)', textDecoration: 'none', fontSize: '13.5px' }}>Startseite</a>
              <a href="/lernplan" style={{ color: 'rgba(255,255,255,0.75)', textDecoration: 'none', fontSize: '13.5px' }}>Lernplan</a>
              <a href="/lernheld" style={{ color: 'rgba(255,255,255,0.75)', textDecoration: 'none', fontSize: '13.5px' }}>Lernheld</a>
              <a href="/quiz" style={{ color: 'rgba(255,255,255,0.75)', textDecoration: 'none', fontSize: '13.5px' }}>Quiz</a>
              <a href="/impressum" style={{ color: 'rgba(255,255,255,0.75)', textDecoration: 'none', fontSize: '13.5px' }}>Impressum</a>
              <a href="/datenschutz" style={{ color: 'rgba(255,255,255,0.75)', textDecoration: 'none', fontSize: '13.5px' }}>Datenschutz</a>
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.12)', paddingTop: '22px', fontSize: '12.5px', color: 'rgba(255,255,255,0.5)' }}>
            © {new Date().getFullYear()} Lernflix · lernflix.lernemitanna.de
          </div>
        </div>
      </footer>
    </main>
  );
}

function ProduktKarte({ p, onClick, mobil }: { p: Produkt; onClick: () => void; mobil: boolean }) {
  const F2 = {
    bg: '#ffffff', ink: '#1c1c1e', inkSoft: '#5a5a5e', inkMuted: '#9a9a9e', border: '#ececec', coral: '#e85a4f',
    mathe: '#3a6ea5', physik: '#c8782e',
  };
  const akzent = p.kategorie === 'mathe' ? F2.mathe : F2.physik;
  return (
    <div onClick={onClick} className="karte" style={{ background: F2.bg, borderRadius: '14px', overflow: 'hidden', display: 'flex', flexDirection: 'column', border: `1px solid ${F2.border}`, padding: mobil ? '20px 18px' : '24px 22px' }}>
      <span style={{ fontSize: '10.5px', letterSpacing: '0.22em', textTransform: 'uppercase', color: akzent, fontWeight: 700, marginBottom: '10px' }}>{p.kategorie === 'mathe' ? 'Mathematik' : 'Physik'}</span>
      <h3 style={{ fontFamily: SERIF, fontSize: mobil ? '22px' : '26px', fontWeight: 700, margin: '0 0 14px', color: F2.ink, letterSpacing: '-0.01em', lineHeight: 1.1 }}>{p.titel}</h3>
      <p style={{ fontSize: '13.5px', color: F2.inkSoft, lineHeight: 1.5, margin: '0 0 18px', flex: 1 }}>{p.beschreibung}</p>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '14px', borderTop: `1px solid ${F2.border}` }}>
        <span style={{ fontFamily: SERIF, fontSize: '20px', fontWeight: 700, color: F2.ink, letterSpacing: '-0.01em' }}>{p.preis.toFixed(2).replace('.', ',')} €</span>
        <span style={{ fontSize: '12.5px', color: F2.coral, fontWeight: 700, letterSpacing: '0.04em' }}>Ansehen →</span>
      </div>
    </div>
  );
}
