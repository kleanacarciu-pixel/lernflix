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
  vorschau: string;
};

const F = {
  bg: '#ffffff',
  bgSoft: '#f7f7f7',
  bgDeep: '#f0f0f0',
  ink: '#1d1d1f',
  inkSoft: '#424245',
  inkMuted: '#86868b',
  border: '#e8e8ed',
  white: '#ffffff',
  accent: '#e6354f',
  accentDeep: '#c4263e',
  dark: '#1d1d1f',
};

const SERIF = '"Cormorant Garamond", "Playfair Display", Georgia, serif';
const SANS = '"Inter", -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif';

const THEMA: Record<string, { bg: string; render: () => React.ReactElement }> = {
  geometrie: { bg: '#2c5b9e', render: () => (<svg viewBox="0 0 120 80" width="100%" height="100%"><polygon points="20,65 100,65 60,15" fill="#ffffff" opacity="0.95"/><rect x="48" y="55" width="10" height="10" fill="none" stroke="#1d1d1f" strokeWidth="1.5"/></svg>) },
  brueche: { bg: '#d95c4f', render: () => (<svg viewBox="0 0 120 80" width="100%" height="100%"><text x="60" y="40" fontSize="32" fontWeight="700" fill="#ffffff" textAnchor="middle" fontFamily="Cormorant Garamond, Georgia, serif">¾</text><line x1="35" y1="48" x2="85" y2="48" stroke="#ffffff" strokeWidth="2"/></svg>) },
  prozent: { bg: '#4a9a72', render: () => (<svg viewBox="0 0 120 80" width="100%" height="100%"><text x="60" y="55" fontSize="44" fontWeight="700" fill="#ffffff" textAnchor="middle">%</text></svg>) },
  gleichungen: { bg: '#e8a83b', render: () => (<svg viewBox="0 0 120 80" width="100%" height="100%"><text x="60" y="52" fontSize="30" fontWeight="700" fill="#1d1d1f" textAnchor="middle" fontFamily="Cormorant Garamond, Georgia, serif"><tspan fontStyle="italic">x</tspan> = ?</text></svg>) },
  funktionen: { bg: '#7a4d92', render: () => (<svg viewBox="0 0 120 80" width="100%" height="100%"><line x1="15" y1="40" x2="105" y2="40" stroke="#ffffff" strokeWidth="1" opacity="0.4"/><line x1="60" y1="10" x2="60" y2="70" stroke="#ffffff" strokeWidth="1" opacity="0.4"/><path d="M 20 65 Q 60 -10 100 65" fill="none" stroke="#ffffff" strokeWidth="3"/></svg>) },
  stochastik: { bg: '#3a7bb8', render: () => (<svg viewBox="0 0 120 80" width="100%" height="100%"><rect x="40" y="20" width="40" height="40" rx="6" fill="#ffffff"/><circle cx="52" cy="32" r="3" fill="#1d1d1f"/><circle cx="68" cy="32" r="3" fill="#1d1d1f"/><circle cx="52" cy="48" r="3" fill="#1d1d1f"/><circle cx="68" cy="48" r="3" fill="#1d1d1f"/></svg>) },
  trigonometrie: { bg: '#4a9a72', render: () => (<svg viewBox="0 0 120 80" width="100%" height="100%"><polygon points="20,65 100,65 100,20" fill="#ffffff" opacity="0.95"/><rect x="88" y="53" width="12" height="12" fill="none" stroke="#1d1d1f" strokeWidth="1.5"/><text x="35" y="60" fontSize="14" fontStyle="italic" fontWeight="700" fill="#1d1d1f">α</text></svg>) },
  potenzen: { bg: '#7a4d92', render: () => (<svg viewBox="0 0 120 80" width="100%" height="100%"><text x="50" y="55" fontSize="40" fontWeight="700" fill="#ffffff" textAnchor="middle" fontFamily="Cormorant Garamond, Georgia, serif"><tspan fontStyle="italic">x</tspan></text><text x="78" y="32" fontSize="22" fontWeight="700" fill="#ffffff" fontFamily="Cormorant Garamond, Georgia, serif">2</text></svg>) },
  mechanik: { bg: '#e8a83b', render: () => (<svg viewBox="0 0 120 80" width="100%" height="100%"><circle cx="42" cy="50" r="14" fill="#ffffff"/><line x1="56" y1="50" x2="92" y2="50" stroke="#ffffff" strokeWidth="4"/><polygon points="88,44 100,50 88,56" fill="#ffffff"/></svg>) },
  elektrizitaet: { bg: '#e8a83b', render: () => (<svg viewBox="0 0 120 80" width="100%" height="100%"><polygon points="55,12 35,45 55,45 45,68 80,30 60,30 70,12" fill="#1d1d1f"/></svg>) },
  optik: { bg: '#7a4d92', render: () => (<svg viewBox="0 0 120 80" width="100%" height="100%"><circle cx="60" cy="40" r="22" fill="#e8a83b"/><line x1="60" y1="8" x2="60" y2="14" stroke="#ffffff" strokeWidth="2"/><line x1="60" y1="66" x2="60" y2="72" stroke="#ffffff" strokeWidth="2"/><line x1="28" y1="40" x2="34" y2="40" stroke="#ffffff" strokeWidth="2"/><line x1="86" y1="40" x2="92" y2="40" stroke="#ffffff" strokeWidth="2"/></svg>) },
  waerme: { bg: '#d95c4f', render: () => (<svg viewBox="0 0 120 80" width="100%" height="100%"><rect x="55" y="12" width="10" height="40" rx="5" fill="#ffffff" stroke="#1d1d1f" strokeWidth="1.5"/><rect x="55" y="32" width="10" height="20" fill="#1d1d1f"/><circle cx="60" cy="60" r="11" fill="#1d1d1f"/></svg>) },
  atomphysik: { bg: '#4a9a72', render: () => (<svg viewBox="0 0 120 80" width="100%" height="100%"><circle cx="60" cy="40" r="6" fill="#ffffff"/><ellipse cx="60" cy="40" rx="30" ry="10" fill="none" stroke="#ffffff" strokeWidth="2"/><ellipse cx="60" cy="40" rx="30" ry="10" fill="none" stroke="#ffffff" strokeWidth="2" transform="rotate(60 60 40)"/><ellipse cx="60" cy="40" rx="30" ry="10" fill="none" stroke="#ffffff" strokeWidth="2" transform="rotate(-60 60 40)"/></svg>) },
};

export default function Home() {
  const [ausgewaehlt, setAusgewaehlt] = useState<Produkt | null>(null);
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

  const kaufen = async (produkt: Produkt) => {
    if (produkt.slug) {
      window.location.href = `/materialien/${produkt.slug}`;
      return;
    }
    const r = await fetch('/api/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ productName: produkt.titel, price: produkt.preis }) });
    const d = await r.json();
    if (d.url) window.location.href = d.url;
  };

  const produkte: Produkt[] = [
    { id: 1, slug: 'geometrie', kategorie: 'mathe', typ: 'Lernpaket', titel: 'Geometrie Klasse 6–9', beschreibung: 'Alle Geometrie-Themen — Dreiecke, Vierecke, Kreis, Körper. Mit beschrifteten Figuren und durchgerechneten Beispielen.', details: ['13 Sektionen mit SVG-Skizzen', 'Pythagoras + Höhensatz + Kathetensatz', 'Komplette Trigonometrie', 'Alle Vierecke & Körper', 'Strahlensätze & Ähnlichkeit', 'Schnellübersicht am Ende'], seiten: 'HTML', preis: 1.99, vorschau: '' },
    { id: 2, slug: 'brueche', kategorie: 'mathe', typ: 'Lernpaket', titel: 'Brüche & Bruchrechnung', beschreibung: 'Brüche endlich verstehen — kürzen, erweitern, addieren, multiplizieren. Mit Beispielen aus dem Alltag.', details: ['Was ist ein Bruch?', 'Kürzen & Erweitern', 'Plus, Minus, Mal, Geteilt', 'Gemischte Brüche, Dezimalzahlen', 'Eselsbrücken', 'Übungen mit Lösungen'], seiten: 'HTML', preis: 1.99, vorschau: '' },
    { id: 3, slug: 'prozent', kategorie: 'mathe', typ: 'Lernpaket', titel: 'Prozent & Zinsen', beschreibung: 'Rabatte verstehen, Mehrwertsteuer rechnen, Zinsen und Zinseszins — alles mit einfachen Tricks.', details: ['Die Grundformel der Prozentrechnung', '3 klassische Aufgabentypen', 'Aufschlag & Rabatt', 'Zinsrechnung & Zinseszins', 'Promille und ppm', 'Übungen mit Lösungen'], seiten: 'HTML', preis: 0.99, vorschau: '' },
    { id: 4, slug: 'gleichungen', kategorie: 'mathe', typ: 'Lernpaket', titel: 'Gleichungen & Terme', beschreibung: 'Vom einfachen x = 5 bis zur pq-Formel — Gleichungen lösen Schritt für Schritt.', details: ['Terme vereinfachen', 'Lineare Gleichungen', 'Gleichungssysteme', 'Quadratische Gleichungen', 'pq-Formel & Mitternachtsformel', 'Ungleichungen'], seiten: 'HTML', preis: 1.99, vorschau: '' },
    { id: 5, slug: 'funktionen', kategorie: 'mathe', typ: 'Lernpaket', titel: 'Funktionen', beschreibung: 'Geraden, Parabeln, Hyperbeln, Wurzeln — alle Funktionstypen mit Skizzen und Beispielen.', details: ['Lineare Funktionen', 'Quadratische Funktionen', 'pq-Formel anwenden', 'Schnittpunkte, Steigung, Scheitel', 'Spezielle Funktionen', 'Symmetrie und Monotonie'], seiten: 'HTML', preis: 1.99, vorschau: '' },
    { id: 6, slug: 'stochastik', kategorie: 'mathe', typ: 'Lernpaket', titel: 'Wahrscheinlichkeit & Statistik', beschreibung: 'Würfel, Münze, Karten und Mittelwert — Wahrscheinlichkeit mit Baumdiagrammen.', details: ['Grundlagen der Wahrscheinlichkeit', 'Mehrstufige Versuche & Baumdiagramme', 'Mit und ohne Zurücklegen', 'Kombinatorik & Anordnungen', 'Statistik: Mittelwert, Median', 'Binomialverteilung'], seiten: 'HTML', preis: 0.99, vorschau: '' },
    { id: 7, slug: 'trigonometrie', kategorie: 'mathe', typ: 'Lernpaket', titel: 'Trigonometrie', beschreibung: 'sin, cos, tan kein Geheimnis mehr — mit Eselsbrücken und durchgerechneten Beispielen.', details: ['Sinus, Kosinus, Tangens', 'Eselsbrücke GAGA HUDI', 'Sinussatz & Kosinussatz', 'Wertetabelle wichtiger Winkel', 'Trigonometrische Funktionen', 'Bogenmaß und Grad'], seiten: 'HTML', preis: 0.99, vorschau: '' },
    { id: 8, slug: 'potenzen', kategorie: 'mathe', typ: 'Lernpaket', titel: 'Potenzen', beschreibung: 'Die fünf Potenzgesetze leicht erklärt — mit Beispielen, Übungen und Tipps.', details: ['Alle 5 Potenzgesetze', 'Negative & gebrochene Exponenten', 'Wurzeln und Wurzelgesetze', 'Wissenschaftliche Schreibweise', 'Wachstum und Zerfall', 'Logarithmen'], seiten: 'HTML', preis: 0.99, vorschau: '' },
    { id: 9, slug: 'mechanik', kategorie: 'physik', typ: 'Lernpaket', titel: 'Mechanik', beschreibung: 'Alle Mechanik-Themen — Geschwindigkeit, Kraft, Energie, Hebel, Reibung mit Skizzen.', details: ['Bewegung & freier Fall', 'Newton-Gesetze', 'Schiefe Ebene', 'Energie, Arbeit, Leistung', 'Hebel & Flaschenzug', 'Dichte, Druck, Auftrieb'], seiten: 'HTML', preis: 0.99, vorschau: '' },
    { id: 10, slug: 'elektrizitaet', kategorie: 'physik', typ: 'Lernpaket', titel: 'Elektrizität & Stromkreise', beschreibung: 'Ohm, Spannung, Stromstärke — Elektrizität kapieren und die Stromrechnung verstehen.', details: ['Ohm´sches Gesetz', 'Reihen- und Parallelschaltung', 'Elektrische Arbeit & Leistung', 'Spezifischer Widerstand', 'Gefahren des Stroms', 'Übungen mit Lösungen'], seiten: 'HTML', preis: 1.99, vorschau: '' },
    { id: 11, slug: 'optik', kategorie: 'physik', typ: 'Lernpaket', titel: 'Optik & Wellen', beschreibung: 'Licht, Spiegel, Linsen, Regenbogen — alles zum Thema Sehen, Brechen und Strahlen.', details: ['Lichtausbreitung & Schatten', 'Reflexion am Spiegel', 'Lichtbrechung & Snellius', 'Linsen und Linsenformel', 'Spektrum und Farben', 'Wellen und Welleneigenschaften'], seiten: 'HTML', preis: 0.99, vorschau: '' },
    { id: 12, slug: 'waerme', kategorie: 'physik', typ: 'Lernpaket', titel: 'Wärmelehre', beschreibung: 'Temperatur, Wärme, Aggregatzustände, Gase — alles über das Zappeln der Atome.', details: ['Temperatur und Skalen', 'Wärmekapazität', 'Aggregatzustände & Phasenübergänge', 'Wärmeübertragung', 'Längenausdehnung', 'Gasgesetze'], seiten: 'HTML', preis: 0.99, vorschau: '' },
    { id: 13, slug: 'atomphysik', kategorie: 'physik', typ: 'Lernpaket', titel: 'Atomphysik & Strahlung', beschreibung: 'Atome, Isotope, Radioaktivität, Kernspaltung — die kleinen Bausteine der Welt einfach erklärt.', details: ['Atomaufbau & Isotope', 'Periodensystem', 'α-, β-, γ-Strahlung', 'Halbwertszeit', 'Kernspaltung & Kernfusion', 'Quantenphysik im Überblick'], seiten: 'HTML', preis: 0.99, vorschau: '' },
  ];

  const mathe = produkte.filter((p) => p.kategorie === 'mathe');
  const physik = produkte.filter((p) => p.kategorie === 'physik');
  const featured = [produkte[0], produkte[1], produkte[8]];

  return (
    <main style={{ minHeight: '100vh', background: F.bg, fontFamily: SANS, color: F.ink, overflowX: 'hidden' }}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@400;500;600;700;800&display=swap" />

      <style>{`
        * { -webkit-font-smoothing: antialiased; }
        body { background: ${F.bg}; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) both; }
        .karte { transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.4s ease; }
        .karte:hover { transform: translateY(-4px); box-shadow: 0 24px 60px rgba(0,0,0,0.10); }
        .btn-primary { transition: all 0.25s ease; }
        .btn-primary:hover { background: ${F.accentDeep}; box-shadow: 0 12px 28px rgba(230, 53, 79, 0.30); }
        .btn-ghost { transition: all 0.25s ease; }
        .btn-ghost:hover { background: ${F.ink}; color: ${F.white}; }
        .link-pfeil { transition: transform 0.25s ease; display: inline-block; }
        .karte:hover .link-pfeil { transform: translateX(4px); }
      `}</style>

      {/* MODAL */}
      {ausgewaehlt && (
        <div onClick={() => setAusgewaehlt(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(10px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: F.white, borderRadius: '24px', maxWidth: '560px', width: '100%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 40px 80px rgba(0,0,0,0.30)' }}>
            <div style={{ padding: mobil ? '28px 24px' : '40px 44px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div>
                  <span style={{ fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: F.accent, fontWeight: 700 }}>{ausgewaehlt.typ}</span>
                  <h2 style={{ fontFamily: SERIF, fontSize: mobil ? '30px' : '38px', fontWeight: 600, margin: '8px 0 4px', color: F.ink, lineHeight: 1.05, letterSpacing: '-0.02em' }}>{ausgewaehlt.titel}</h2>
                </div>
                <button onClick={() => setAusgewaehlt(null)} style={{ background: F.bgSoft, border: 'none', width: '36px', height: '36px', borderRadius: '50%', fontSize: '16px', cursor: 'pointer', color: F.ink, flexShrink: 0 }}>✕</button>
              </div>
              <p style={{ fontSize: '15.5px', color: F.inkSoft, lineHeight: 1.65, margin: '0 0 24px' }}>{ausgewaehlt.beschreibung}</p>
              <div style={{ background: F.bgSoft, borderRadius: '16px', padding: '22px 24px', marginBottom: '28px' }}>
                <p style={{ fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: F.accent, fontWeight: 700, margin: '0 0 14px' }}>Was drin ist</p>
                {ausgewaehlt.details.map((d, i) => (
                  <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <span style={{ color: F.accent, fontWeight: 700, fontSize: '14px', flexShrink: 0, marginTop: '2px' }}>✓</span>
                    <span style={{ fontSize: '14.5px', color: F.ink, lineHeight: 1.5 }}>{d}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '24px', borderTop: `1px solid ${F.border}` }}>
                <div>
                  <p style={{ margin: 0, fontSize: '11.5px', color: F.inkMuted, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Einmalig</p>
                  <p style={{ margin: '4px 0 0', fontFamily: SERIF, fontSize: '40px', fontWeight: 600, color: F.ink, letterSpacing: '-0.02em' }}>{ausgewaehlt.preis.toFixed(2).replace('.', ',')} €</p>
                </div>
                <button onClick={() => kaufen(ausgewaehlt)} className="btn-primary" style={{ background: F.accent, color: F.white, border: 'none', borderRadius: '999px', padding: '15px 30px', fontSize: '15px', fontWeight: 600, cursor: 'pointer', fontFamily: SANS }}>
                  {ausgewaehlt.slug ? 'Jetzt freischalten' : 'Jetzt kaufen'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: scrolled ? 'rgba(255,255,255,0.85)' : 'transparent', backdropFilter: scrolled ? 'saturate(180%) blur(20px)' : 'none', borderBottom: scrolled ? `1px solid ${F.border}` : '1px solid transparent', padding: mobil ? '14px 22px' : '18px 60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all 0.3s ease' }}>
        <a href="#" style={{ textDecoration: 'none' }}>
          <span style={{ fontFamily: SERIF, fontSize: mobil ? '26px' : '30px', fontWeight: 700, color: F.ink, letterSpacing: '-0.02em' }}>
            Lern<span style={{ color: F.accent }}>flix</span>
          </span>
        </a>
        <nav style={{ display: 'flex', gap: mobil ? '16px' : '36px', alignItems: 'center' }}>
          {!mobil && (
            <>
              <a href="#mathematik" style={{ color: F.ink, textDecoration: 'none', fontSize: '14.5px', fontWeight: 500 }}>Mathematik</a>
              <a href="#physik" style={{ color: F.ink, textDecoration: 'none', fontSize: '14.5px', fontWeight: 500 }}>Physik</a>
              <a href="/quiz" style={{ color: F.ink, textDecoration: 'none', fontSize: '14.5px', fontWeight: 500 }}>Quiz</a>
              <a href="/lernheld" style={{ color: F.ink, textDecoration: 'none', fontSize: '14.5px', fontWeight: 500 }}>Lernheld</a>
            </>
          )}
          <a href="/lernheld" style={{ background: F.ink, color: F.white, textDecoration: 'none', fontSize: '13.5px', fontWeight: 600, padding: '10px 20px', borderRadius: '999px' }}>Jetzt starten</a>
        </nav>
      </header>

      {/* HERO — Apple-style minimal */}
      <section className="fade-up" style={{ paddingTop: mobil ? '120px' : '170px', paddingBottom: mobil ? '60px' : '90px', paddingLeft: mobil ? '22px' : '60px', paddingRight: mobil ? '22px' : '60px', textAlign: 'center' }}>
        <div style={{ maxWidth: '880px', margin: '0 auto' }}>
          <span style={{ display: 'inline-block', fontSize: '12.5px', color: F.accent, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '24px' }}>
            Deine Lern-Bibliothek
          </span>
          <h1 style={{ fontFamily: SERIF, fontSize: mobil ? '56px' : '108px', fontWeight: 600, lineHeight: 0.98, margin: '0 0 26px', color: F.ink, letterSpacing: '-0.04em' }}>
            Lernen,<br />das du <span style={{ fontStyle: 'italic', color: F.accent }}>liebst</span>.
          </h1>
          <p style={{ fontSize: mobil ? '17px' : '21px', color: F.inkSoft, lineHeight: 1.5, margin: '0 auto 40px', maxWidth: '620px', fontWeight: 400 }}>
            Mathe- und Physik-Pakete, die dir die Themen so erklären, wie sie eine gute Lehrerin erklären würde. Persönliche Lernpläne, Quizzes und jede Klassenstufe an einem Ort.
          </p>
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/lernheld" className="btn-primary" style={{ background: F.accent, color: F.white, textDecoration: 'none', padding: '16px 32px', borderRadius: '999px', fontSize: '15.5px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              Lernheld-Plan starten
              <span style={{ fontSize: '16px' }}>→</span>
            </a>
            <a href="#mathematik" className="btn-ghost" style={{ background: 'transparent', color: F.ink, textDecoration: 'none', padding: '16px 32px', borderRadius: '999px', fontSize: '15.5px', fontWeight: 600, border: `1.5px solid ${F.ink}` }}>
              Pakete ansehen
            </a>
          </div>
        </div>

        {/* HERO Vorschau-Karten Reihe */}
        <div style={{ maxWidth: '1100px', margin: mobil ? '60px auto 0' : '90px auto 0', display: 'grid', gridTemplateColumns: mobil ? '1fr' : 'repeat(3, 1fr)', gap: '20px' }}>
          {featured.map((p) => (<HeroTile key={p.id} p={p} onClick={() => setAusgewaehlt(p)} />))}
        </div>
      </section>

      {/* TRENNER */}
      <div style={{ borderTop: `1px solid ${F.border}`, margin: mobil ? '40px 22px' : '60px 60px' }} />

      {/* MATHEMATIK */}
      <section id="mathematik" style={{ padding: mobil ? '40px 22px 70px' : '60px 60px 110px' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: mobil ? '32px' : '50px', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <span style={{ display: 'block', fontSize: '12.5px', color: F.accent, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '10px' }}>
                Mathematik
              </span>
              <h2 style={{ fontFamily: SERIF, fontSize: mobil ? '40px' : '60px', fontWeight: 600, color: F.ink, margin: 0, lineHeight: 1.0, letterSpacing: '-0.02em' }}>
                Alles, was du brauchst.
              </h2>
            </div>
            <p style={{ fontSize: '14.5px', color: F.inkMuted, margin: 0 }}>{mathe.length} Pakete · ab 0,99 €</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: mobil ? '1fr 1fr' : 'repeat(auto-fill, minmax(260px, 1fr))', gap: mobil ? '14px' : '22px' }}>
            {mathe.map((p) => (<ProduktKarte key={p.id} p={p} onClick={() => setAusgewaehlt(p)} mobil={mobil} />))}
          </div>
        </div>
      </section>

      {/* PHYSIK */}
      <section id="physik" style={{ padding: mobil ? '0 22px 70px' : '0 60px 110px' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: mobil ? '32px' : '50px', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <span style={{ display: 'block', fontSize: '12.5px', color: F.accent, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '10px' }}>
                Physik
              </span>
              <h2 style={{ fontFamily: SERIF, fontSize: mobil ? '40px' : '60px', fontWeight: 600, color: F.ink, margin: 0, lineHeight: 1.0, letterSpacing: '-0.02em' }}>
                Von Kraft bis Quanten.
              </h2>
            </div>
            <p style={{ fontSize: '14.5px', color: F.inkMuted, margin: 0 }}>{physik.length} Pakete · ab 0,99 €</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: mobil ? '1fr 1fr' : 'repeat(auto-fill, minmax(260px, 1fr))', gap: mobil ? '14px' : '22px' }}>
            {physik.map((p) => (<ProduktKarte key={p.id} p={p} onClick={() => setAusgewaehlt(p)} mobil={mobil} />))}
          </div>
        </div>
      </section>

      {/* LERNHELD CTA */}
      <section style={{ background: F.dark, color: F.white, padding: mobil ? '70px 22px' : '120px 60px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
          <span style={{ display: 'inline-block', fontSize: '12.5px', color: F.accent, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '20px' }}>
            Premium · 1,99 €
          </span>
          <h2 style={{ fontFamily: SERIF, fontSize: mobil ? '44px' : '72px', fontWeight: 600, color: F.white, margin: '0 0 22px', lineHeight: 1.0, letterSpacing: '-0.03em' }}>
            Dein eigener<br /><span style={{ fontStyle: 'italic', color: F.accent }}>Lernheld</span>-Plan.
          </h2>
          <p style={{ fontSize: mobil ? '17px' : '19px', color: 'rgba(255,255,255,0.72)', lineHeight: 1.55, margin: '0 auto 40px', maxWidth: '560px' }}>
            Foto vom Schulbuch hochladen, Klasse und Datum wählen, fertig. Du bekommst einen vollständigen Lernplan für deine nächste Schulaufgabe — mit allen Themen, Erklärungen, Übungen und Lösungen.
          </p>
          <a href="/lernheld" className="btn-primary" style={{ background: F.accent, color: F.white, textDecoration: 'none', padding: '17px 36px', borderRadius: '999px', fontSize: '15.5px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
            Plan erstellen
            <span style={{ fontSize: '16px' }}>→</span>
          </a>
          <div style={{ display: 'flex', gap: mobil ? '24px' : '48px', justifyContent: 'center', marginTop: '60px', flexWrap: 'wrap' }}>
            {[
              { n: '01', t: 'Fotos hochladen' },
              { n: '02', t: 'Daten wählen' },
              { n: '03', t: 'Plan ist fertig' },
            ].map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <span style={{ fontFamily: SERIF, fontSize: '24px', fontStyle: 'italic', color: F.accent, fontWeight: 600 }}>{s.n}</span>
                <span style={{ fontSize: '15px', color: 'rgba(255,255,255,0.88)', fontWeight: 500 }}>{s.t}</span>
                {i < 2 && !mobil && <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '20px' }}>→</span>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QUIZ CTA */}
      <section style={{ padding: mobil ? '70px 22px' : '120px 60px', background: F.bgSoft, textAlign: 'center' }}>
        <div style={{ maxWidth: '880px', margin: '0 auto' }}>
          <span style={{ display: 'inline-block', fontSize: '12.5px', color: F.accent, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '20px' }}>
            Kostenlos
          </span>
          <h2 style={{ fontFamily: SERIF, fontSize: mobil ? '44px' : '64px', fontWeight: 600, color: F.ink, margin: '0 0 20px', lineHeight: 1.0, letterSpacing: '-0.03em' }}>
            Teste dein <span style={{ fontStyle: 'italic', color: F.accent }}>Wissen</span>.
          </h2>
          <p style={{ fontSize: mobil ? '17px' : '19px', color: F.inkSoft, lineHeight: 1.55, margin: '0 auto 36px', maxWidth: '540px' }}>
            61 Themen für Klasse 1 bis 13. Wähle dein Fach und deine Klasse — jede Runde bekommst du neue Fragen.
          </p>
          <a href="/quiz" className="btn-ghost" style={{ background: F.ink, color: F.white, textDecoration: 'none', padding: '17px 36px', borderRadius: '999px', fontSize: '15.5px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
            Zum Quiz <span style={{ fontSize: '16px' }}>→</span>
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: F.dark, color: F.white, padding: mobil ? '60px 22px 30px' : '80px 60px 40px' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: mobil ? '1fr' : '2fr 1fr 1fr 1fr', gap: '40px', marginBottom: '60px' }}>
            <div>
              <span style={{ fontFamily: SERIF, fontSize: '32px', fontWeight: 700, color: F.white, letterSpacing: '-0.02em', display: 'block', marginBottom: '14px' }}>
                Lern<span style={{ color: F.accent }}>flix</span>
              </span>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, margin: 0, maxWidth: '320px' }}>
                Deine Lern-Bibliothek für Mathematik und Physik. Klassenstufe 1 bis 13.
              </p>
            </div>
            <div>
              <p style={{ fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: F.accent, fontWeight: 700, margin: '0 0 18px' }}>Lernen</p>
              <a href="#mathematik" style={{ display: 'block', color: 'rgba(255,255,255,0.78)', textDecoration: 'none', fontSize: '14px', marginBottom: '10px' }}>Mathematik</a>
              <a href="#physik" style={{ display: 'block', color: 'rgba(255,255,255,0.78)', textDecoration: 'none', fontSize: '14px', marginBottom: '10px' }}>Physik</a>
              <a href="/lernheld" style={{ display: 'block', color: 'rgba(255,255,255,0.78)', textDecoration: 'none', fontSize: '14px', marginBottom: '10px' }}>Lernheld</a>
              <a href="/quiz" style={{ display: 'block', color: 'rgba(255,255,255,0.78)', textDecoration: 'none', fontSize: '14px', marginBottom: '10px' }}>Quiz</a>
            </div>
            <div>
              <p style={{ fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: F.accent, fontWeight: 700, margin: '0 0 18px' }}>Rechtliches</p>
              <a href="/impressum" style={{ display: 'block', color: 'rgba(255,255,255,0.78)', textDecoration: 'none', fontSize: '14px', marginBottom: '10px' }}>Impressum</a>
              <a href="/datenschutz" style={{ display: 'block', color: 'rgba(255,255,255,0.78)', textDecoration: 'none', fontSize: '14px', marginBottom: '10px' }}>Datenschutz</a>
              <a href="/agb" style={{ display: 'block', color: 'rgba(255,255,255,0.78)', textDecoration: 'none', fontSize: '14px', marginBottom: '10px' }}>AGB</a>
            </div>
            <div>
              <p style={{ fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: F.accent, fontWeight: 700, margin: '0 0 18px' }}>Kontakt</p>
              <a href="https://wa.me/4917624700519" style={{ display: 'block', color: 'rgba(255,255,255,0.78)', textDecoration: 'none', fontSize: '14px', marginBottom: '10px' }}>WhatsApp</a>
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

function HeroTile({ p, onClick }: { p: Produkt; onClick: () => void }) {
  const svg = (p.slug && THEMA[p.slug]) || { bg: '#3a7bb8', render: () => null };
  return (
    <div onClick={onClick} className="karte" style={{ background: F.white, borderRadius: '24px', cursor: 'pointer', boxShadow: '0 8px 30px rgba(0,0,0,0.06)', border: `1px solid ${F.border}`, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: svg.bg, height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '28px' }}>
        {svg.render()}
      </div>
      <div style={{ padding: '24px 26px' }}>
        <p style={{ fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: F.inkMuted, fontWeight: 700, margin: '0 0 8px' }}>{p.kategorie === 'mathe' ? 'Mathematik' : 'Physik'}</p>
        <h3 style={{ fontFamily: SERIF, fontSize: '24px', fontWeight: 600, margin: '0 0 4px', color: F.ink, letterSpacing: '-0.01em', lineHeight: 1.15 }}>{p.titel}</h3>
        <p style={{ fontSize: '14px', color: F.inkMuted, margin: 0 }}>ab {p.preis.toFixed(2).replace('.', ',')} €</p>
      </div>
    </div>
  );
}

function ProduktKarte({ p, onClick, mobil }: { p: Produkt; onClick: () => void; mobil: boolean }) {
  const svg = (p.slug && THEMA[p.slug]) || { bg: '#3a7bb8', render: () => null };
  return (
    <div onClick={onClick} className="karte" style={{ background: F.white, borderRadius: '20px', cursor: 'pointer', boxShadow: '0 4px 16px rgba(0,0,0,0.04)', border: `1px solid ${F.border}`, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: svg.bg, height: mobil ? '110px' : '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '22px' }}>
        {svg.render()}
      </div>
      <div style={{ padding: mobil ? '16px 18px 18px' : '20px 22px 22px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <p style={{ fontSize: '10.5px', letterSpacing: '0.18em', textTransform: 'uppercase', color: F.inkMuted, fontWeight: 700, margin: '0 0 8px' }}>{p.kategorie === 'mathe' ? 'Mathematik' : 'Physik'}</p>
        <h3 style={{ fontFamily: SERIF, fontSize: mobil ? '18px' : '21px', fontWeight: 600, margin: '0 0 16px', color: F.ink, letterSpacing: '-0.01em', lineHeight: 1.18 }}>{p.titel}</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '14px', borderTop: `1px solid ${F.border}` }}>
          <span style={{ fontFamily: SERIF, fontSize: '20px', fontWeight: 600, color: F.ink, letterSpacing: '-0.01em' }}>{p.preis.toFixed(2).replace('.', ',')} €</span>
          <span style={{ fontSize: '13px', color: F.accent, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            Ansehen <span className="link-pfeil">→</span>
          </span>
        </div>
      </div>
    </div>
  );
}
