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
  bg: '#0c0c10',
  bgSoft: '#13131a',
  bgDeep: '#08080d',
  card: 'rgba(255,255,255,0.04)',
  cardHover: 'rgba(255,255,255,0.08)',
  ink: '#ffffff',
  inkSoft: 'rgba(255,255,255,0.78)',
  inkMuted: 'rgba(255,255,255,0.52)',
  white: '#ffffff',
  border: 'rgba(255,255,255,0.10)',
  borderSoft: 'rgba(255,255,255,0.06)',
  accent: '#e6354f',
  accentDeep: '#c4263e',
  accentSoft: 'rgba(230, 53, 79, 0.12)',
  glow: 'rgba(230, 53, 79, 0.4)',
};

const SERIF = '"Cormorant Garamond", Georgia, serif';
const SANS = '"Inter", -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif';

const THEMA: Record<string, { bg: string; bgEnd?: string; render: () => React.ReactElement }> = {
  geometrie: { bg: '#1e4a82', bgEnd: '#2c6bb8', render: () => (<svg viewBox="0 0 140 90" width="100%" height="100%"><polygon points="20,75 120,75 70,15" fill="rgba(255,255,255,0.95)"/><rect x="55" y="63" width="12" height="12" fill="none" stroke="#1d1d1f" strokeWidth="1.5"/></svg>) },
  brueche: { bg: '#c4395f', bgEnd: '#e85278', render: () => (<svg viewBox="0 0 140 90" width="100%" height="100%"><text x="70" y="50" fontSize="42" fontWeight="700" fill="#ffffff" textAnchor="middle" fontFamily="Cormorant Garamond, Georgia, serif">¾</text><line x1="36" y1="58" x2="104" y2="58" stroke="#ffffff" strokeWidth="2.5"/></svg>) },
  prozent: { bg: '#1f7a52', bgEnd: '#38a273', render: () => (<svg viewBox="0 0 140 90" width="100%" height="100%"><text x="70" y="62" fontSize="54" fontWeight="700" fill="#ffffff" textAnchor="middle">%</text></svg>) },
  gleichungen: { bg: '#c47b1f', bgEnd: '#e8a83b', render: () => (<svg viewBox="0 0 140 90" width="100%" height="100%"><text x="70" y="58" fontSize="36" fontWeight="700" fill="#ffffff" textAnchor="middle" fontFamily="Cormorant Garamond, Georgia, serif"><tspan fontStyle="italic">x</tspan> = ?</text></svg>) },
  funktionen: { bg: '#5a2d7c', bgEnd: '#7a4d92', render: () => (<svg viewBox="0 0 140 90" width="100%" height="100%"><line x1="20" y1="45" x2="120" y2="45" stroke="rgba(255,255,255,0.4)" strokeWidth="1"/><line x1="70" y1="10" x2="70" y2="80" stroke="rgba(255,255,255,0.4)" strokeWidth="1"/><path d="M 25 75 Q 70 -12 115 75" fill="none" stroke="#ffffff" strokeWidth="3.5"/></svg>) },
  stochastik: { bg: '#1f5a8a', bgEnd: '#3a7bb8', render: () => (<svg viewBox="0 0 140 90" width="100%" height="100%"><rect x="50" y="22" width="44" height="44" rx="7" fill="#ffffff"/><circle cx="62" cy="34" r="3.5" fill="#1d1d1f"/><circle cx="82" cy="34" r="3.5" fill="#1d1d1f"/><circle cx="62" cy="54" r="3.5" fill="#1d1d1f"/><circle cx="82" cy="54" r="3.5" fill="#1d1d1f"/></svg>) },
  trigonometrie: { bg: '#1f7a52', bgEnd: '#4a9a72', render: () => (<svg viewBox="0 0 140 90" width="100%" height="100%"><polygon points="20,75 120,75 120,22" fill="rgba(255,255,255,0.95)"/><rect x="106" y="61" width="14" height="14" fill="none" stroke="#1d1d1f" strokeWidth="1.5"/><text x="40" y="68" fontSize="16" fontStyle="italic" fontWeight="700" fill="#1d1d1f">α</text></svg>) },
  potenzen: { bg: '#5a2d7c', bgEnd: '#7a4d92', render: () => (<svg viewBox="0 0 140 90" width="100%" height="100%"><text x="60" y="62" fontSize="44" fontWeight="700" fill="#ffffff" textAnchor="middle" fontFamily="Cormorant Garamond, Georgia, serif" fontStyle="italic">x</text><text x="92" y="38" fontSize="26" fontWeight="700" fill="#ffffff" fontFamily="Cormorant Garamond, Georgia, serif">2</text></svg>) },
  mechanik: { bg: '#c47b1f', bgEnd: '#e8a83b', render: () => (<svg viewBox="0 0 140 90" width="100%" height="100%"><circle cx="48" cy="55" r="16" fill="#ffffff"/><line x1="64" y1="55" x2="108" y2="55" stroke="#ffffff" strokeWidth="5"/><polygon points="104,48 118,55 104,62" fill="#ffffff"/></svg>) },
  elektrizitaet: { bg: '#c47b1f', bgEnd: '#e8a83b', render: () => (<svg viewBox="0 0 140 90" width="100%" height="100%"><polygon points="64,14 42,52 64,52 52,80 96,34 72,34 84,14" fill="#1d1d1f"/></svg>) },
  optik: { bg: '#5a2d7c', bgEnd: '#7a4d92', render: () => (<svg viewBox="0 0 140 90" width="100%" height="100%"><circle cx="70" cy="45" r="24" fill="#e8a83b"/><line x1="70" y1="8" x2="70" y2="14" stroke="#ffffff" strokeWidth="2.5"/><line x1="70" y1="76" x2="70" y2="82" stroke="#ffffff" strokeWidth="2.5"/><line x1="32" y1="45" x2="38" y2="45" stroke="#ffffff" strokeWidth="2.5"/><line x1="102" y1="45" x2="108" y2="45" stroke="#ffffff" strokeWidth="2.5"/></svg>) },
  waerme: { bg: '#c4395f', bgEnd: '#e85278', render: () => (<svg viewBox="0 0 140 90" width="100%" height="100%"><rect x="65" y="14" width="10" height="44" rx="5" fill="#ffffff" stroke="#1d1d1f" strokeWidth="1.5"/><rect x="65" y="34" width="10" height="24" fill="#1d1d1f"/><circle cx="70" cy="66" r="12" fill="#1d1d1f"/></svg>) },
  atomphysik: { bg: '#1f7a52', bgEnd: '#4a9a72', render: () => (<svg viewBox="0 0 140 90" width="100%" height="100%"><circle cx="70" cy="45" r="7" fill="#ffffff"/><ellipse cx="70" cy="45" rx="34" ry="11" fill="none" stroke="#ffffff" strokeWidth="2.5"/><ellipse cx="70" cy="45" rx="34" ry="11" fill="none" stroke="#ffffff" strokeWidth="2.5" transform="rotate(60 70 45)"/><ellipse cx="70" cy="45" rx="34" ry="11" fill="none" stroke="#ffffff" strokeWidth="2.5" transform="rotate(-60 70 45)"/></svg>) },
};

export default function Home() {
  const [ausgewaehlt, setAusgewaehlt] = useState<Produkt | null>(null);
  const [breite, setBreite] = useState(1200);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onResize = () => setBreite(window.innerWidth);
    const onScroll = () => setScrolled(window.scrollY > 30);
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
  const top = [produkte[0], produkte[1], produkte[8], produkte[9], produkte[3], produkte[12]];

  return (
    <main style={{ minHeight: '100vh', background: F.bg, fontFamily: SANS, color: F.ink, overflowX: 'hidden' }}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@400;500;600;700;800&display=swap" />

      <style>{`
        * { -webkit-font-smoothing: antialiased; }
        body { background: ${F.bg}; }
        ::selection { background: ${F.accent}; color: ${F.white}; }

        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes glowPulse { 0%, 100% { box-shadow: 0 0 0 rgba(230,53,79,0.4); } 50% { box-shadow: 0 0 24px rgba(230,53,79,0.5); } }
        @keyframes bgShift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        .fade-up { animation: fadeUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) both; }

        .scroll-row { display: flex; gap: 18px; overflow-x: auto; padding-bottom: 12px; scroll-behavior: smooth; scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch; }
        .scroll-row::-webkit-scrollbar { height: 6px; }
        .scroll-row::-webkit-scrollbar-track { background: ${F.borderSoft}; border-radius: 3px; }
        .scroll-row::-webkit-scrollbar-thumb { background: ${F.border}; border-radius: 3px; }
        .scroll-row::-webkit-scrollbar-thumb:hover { background: ${F.accent}; }
        .scroll-row > * { scroll-snap-align: start; flex-shrink: 0; }

        .poster { transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.4s ease; cursor: pointer; }
        .poster:hover { transform: translateY(-8px) scale(1.03); z-index: 10; box-shadow: 0 30px 60px rgba(0,0,0,0.5), 0 0 0 1px ${F.accent}; }
        .poster:hover .poster-arrow { transform: translateX(6px); color: ${F.accent}; }

        .kat-tile { transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.4s ease; }
        .kat-tile:hover { transform: translateY(-6px) scale(1.02); box-shadow: 0 28px 60px rgba(0,0,0,0.45); }

        .btn-primary { transition: all 0.25s ease; }
        .btn-primary:hover { background: ${F.accentDeep}; transform: translateY(-2px); box-shadow: 0 14px 40px ${F.glow}; }
        .btn-ghost { transition: all 0.25s ease; }
        .btn-ghost:hover { background: rgba(255,255,255,0.14); }

        .pulse-dot { animation: glowPulse 2.5s ease-in-out infinite; }
      `}</style>

      {/* MODAL */}
      {ausgewaehlt && (
        <div onClick={() => setAusgewaehlt(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(14px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: F.bgSoft, border: `1px solid ${F.border}`, borderRadius: '24px', maxWidth: '600px', width: '100%', maxHeight: '92vh', overflowY: 'auto', boxShadow: '0 40px 80px rgba(0,0,0,0.6)' }}>
            <div style={{ height: '180px', position: 'relative', overflow: 'hidden', borderRadius: '24px 24px 0 0' }}>
              {(() => { const t = ausgewaehlt.slug && THEMA[ausgewaehlt.slug]; return t ? (<div style={{ background: t.bgEnd ? `linear-gradient(135deg, ${t.bg}, ${t.bgEnd})` : t.bg, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>{t.render()}</div>) : null; })()}
              <button onClick={() => setAusgewaehlt(null)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(0,0,0,0.5)', border: 'none', width: '36px', height: '36px', borderRadius: '50%', fontSize: '16px', cursor: 'pointer', color: F.white, backdropFilter: 'blur(10px)' }}>✕</button>
            </div>
            <div style={{ padding: mobil ? '28px 24px' : '36px 40px' }}>
              <span style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: F.accent, fontWeight: 700 }}>{ausgewaehlt.typ}</span>
              <h2 style={{ fontFamily: SERIF, fontSize: mobil ? '30px' : '38px', fontWeight: 600, margin: '8px 0 12px', color: F.white, lineHeight: 1.05, letterSpacing: '-0.02em' }}>{ausgewaehlt.titel}</h2>
              <p style={{ fontSize: '15.5px', color: F.inkSoft, lineHeight: 1.65, margin: '0 0 24px' }}>{ausgewaehlt.beschreibung}</p>
              <div style={{ background: F.card, border: `1px solid ${F.border}`, borderRadius: '16px', padding: '22px 24px', marginBottom: '28px' }}>
                <p style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: F.accent, fontWeight: 700, margin: '0 0 14px' }}>Inhalt</p>
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
                  <p style={{ margin: '4px 0 0', fontFamily: SERIF, fontSize: '40px', fontWeight: 600, color: F.white, letterSpacing: '-0.02em' }}>{ausgewaehlt.preis.toFixed(2).replace('.', ',')} €</p>
                </div>
                <button onClick={() => kaufen(ausgewaehlt)} className="btn-primary" style={{ background: F.accent, color: F.white, border: 'none', borderRadius: '999px', padding: '15px 30px', fontSize: '15px', fontWeight: 700, cursor: 'pointer', fontFamily: SANS, display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  ▶ {ausgewaehlt.slug ? 'Freischalten' : 'Kaufen'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: scrolled ? 'linear-gradient(180deg, rgba(12,12,16,0.98) 0%, rgba(12,12,16,0.85) 100%)' : 'linear-gradient(180deg, rgba(12,12,16,0.7) 0%, transparent 100%)', backdropFilter: scrolled ? 'blur(20px)' : 'none', padding: mobil ? '14px 22px' : '18px 60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all 0.3s ease' }}>
        <a href="#" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ fontFamily: SERIF, fontSize: mobil ? '28px' : '34px', fontWeight: 700, color: F.white, letterSpacing: '-0.025em' }}>
            Lern<span style={{ color: F.accent }}>flix</span>
          </span>
        </a>
        <nav style={{ display: 'flex', gap: mobil ? '14px' : '32px', alignItems: 'center' }}>
          {!mobil && (
            <>
              <a href="#mathe" style={{ color: F.inkSoft, textDecoration: 'none', fontSize: '14.5px', fontWeight: 500 }}>Mathematik</a>
              <a href="#physik" style={{ color: F.inkSoft, textDecoration: 'none', fontSize: '14.5px', fontWeight: 500 }}>Physik</a>
              <a href="/quiz" style={{ color: F.inkSoft, textDecoration: 'none', fontSize: '14.5px', fontWeight: 500 }}>Quiz</a>
              <a href="#pakete" style={{ color: F.inkSoft, textDecoration: 'none', fontSize: '14.5px', fontWeight: 500 }}>Pakete</a>
            </>
          )}
          <a href="/lernheld" className="btn-primary" style={{ background: F.accent, color: F.white, textDecoration: 'none', fontSize: '13.5px', fontWeight: 700, padding: '10px 20px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            ▶ Lernheld
          </a>
        </nav>
      </header>

      {/* HERO — Netflix-Style Banner */}
      <section className="fade-up" style={{ position: 'relative', minHeight: mobil ? '90vh' : '92vh', display: 'flex', alignItems: 'center', overflow: 'hidden', padding: mobil ? '100px 22px 60px' : '100px 60px 80px' }}>
        {/* Gradient Banner Background */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #1a0f1c 0%, #0c0c10 40%, #0c0c10 60%, #1c0f15 100%)', zIndex: 0 }} />
        {/* Subtle Glow */}
        <div style={{ position: 'absolute', top: '20%', left: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(230,53,79,0.20) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(120,69,180,0.18) 0%, transparent 60%)', pointerEvents: 'none' }} />
        {/* Math symbols floating */}
        {!mobil && (
          <>
            <div style={{ position: 'absolute', top: '18%', right: '8%', fontFamily: SERIF, fontSize: '160px', color: 'rgba(255,255,255,0.04)', fontStyle: 'italic', pointerEvents: 'none' }}>π</div>
            <div style={{ position: 'absolute', bottom: '15%', left: '6%', fontFamily: SERIF, fontSize: '140px', color: 'rgba(230,53,79,0.06)', fontStyle: 'italic', pointerEvents: 'none' }}>∫</div>
            <div style={{ position: 'absolute', top: '60%', right: '20%', fontFamily: SERIF, fontSize: '90px', color: 'rgba(255,255,255,0.04)', fontStyle: 'italic', pointerEvents: 'none' }}>√x</div>
          </>
        )}

        <div style={{ position: 'relative', maxWidth: '1240px', margin: '0 auto', width: '100%', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: F.accentSoft, color: F.accent, padding: '8px 18px', borderRadius: '999px', fontSize: '12.5px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '28px', border: `1px solid rgba(230,53,79,0.3)` }}>
            <span className="pulse-dot" style={{ width: '7px', height: '7px', borderRadius: '50%', background: F.accent }} />
            Neu · 13 Lernpakete verfügbar
          </div>
          <h1 style={{ fontFamily: SERIF, fontSize: mobil ? '54px' : '116px', fontWeight: 600, lineHeight: 0.96, margin: '0 0 28px', color: F.white, letterSpacing: '-0.045em', maxWidth: '1000px' }}>
            Mathe und Physik,<br />
            <span style={{ fontStyle: 'italic', background: `linear-gradient(135deg, ${F.accent} 0%, #ff8aa9 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>endlich verstanden</span>.
          </h1>
          <p style={{ fontSize: mobil ? '17px' : '22px', color: F.inkSoft, lineHeight: 1.5, margin: '0 0 42px', maxWidth: '620px', fontWeight: 400 }}>
            Deine Lern-Bibliothek mit hochwertigen Paketen, persönlichen Plänen und Quizzes für jede Klassenstufe. Streamen statt pauken.
          </p>
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <a href="/lernheld" className="btn-primary" style={{ background: F.accent, color: F.white, textDecoration: 'none', padding: '17px 36px', borderRadius: '8px', fontSize: '16px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '10px', boxShadow: `0 16px 40px ${F.glow}` }}>
              ▶ Lernheld-Plan starten
            </a>
            <a href="#mathe" className="btn-ghost" style={{ background: 'rgba(255,255,255,0.10)', color: F.white, textDecoration: 'none', padding: '17px 36px', borderRadius: '8px', fontSize: '16px', fontWeight: 700, border: '1px solid rgba(255,255,255,0.18)', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
              ⓘ Pakete entdecken
            </a>
          </div>
        </div>
      </section>

      {/* KATEGORIEN */}
      <section style={{ padding: mobil ? '40px 22px 30px' : '60px 60px 40px' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: SERIF, fontSize: mobil ? '28px' : '32px', fontWeight: 600, color: F.white, margin: '0 0 24px', letterSpacing: '-0.02em' }}>Was möchtest du heute lernen?</h2>
          <div style={{ display: 'grid', gridTemplateColumns: mobil ? '1fr 1fr' : 'repeat(4, 1fr)', gap: mobil ? '12px' : '18px' }}>
            <KatTile href="#mathe" titel="Mathematik" desc="Formeln, Aufgaben, Erklärungen" gradient="linear-gradient(135deg, #1e4a82 0%, #2c6bb8 100%)" icon={(<svg width="36" height="36" viewBox="0 0 40 40"><rect x="4" y="4" width="14" height="14" rx="3" fill="white" fillOpacity="0.9"/><rect x="22" y="4" width="14" height="14" rx="3" fill="white" fillOpacity="0.6"/><rect x="4" y="22" width="14" height="14" rx="3" fill="white" fillOpacity="0.6"/><path d="M25 25h8M29 21v8" stroke="white" strokeWidth="2.5" strokeLinecap="round"/></svg>)} />
            <KatTile href="#physik" titel="Physik" desc="Gesetze, Formeln, Experimente" gradient="linear-gradient(135deg, #5a2d7c 0%, #7a4d92 100%)" icon={(<svg width="36" height="36" viewBox="0 0 40 40"><circle cx="20" cy="20" r="5" fill="white"/><ellipse cx="20" cy="20" rx="16" ry="7" stroke="white" strokeWidth="2" fill="none" strokeOpacity="0.7"/><ellipse cx="20" cy="20" rx="16" ry="7" stroke="white" strokeWidth="2" fill="none" strokeOpacity="0.7" transform="rotate(60 20 20)"/><ellipse cx="20" cy="20" rx="16" ry="7" stroke="white" strokeWidth="2" fill="none" strokeOpacity="0.7" transform="rotate(-60 20 20)"/></svg>)} />
            <KatTile href="/lernheld" titel="Lernheld" badge="Premium" desc="Dein eigener Lernplan" gradient="linear-gradient(135deg, #c4263e 0%, #e6354f 100%)" icon={(<svg width="36" height="36" viewBox="0 0 40 40"><path d="M20 4 L32 9 V20 C32 27 26 33 20 35 C14 33 8 27 8 20 V9 Z" fill="white" fillOpacity="0.2" stroke="white" strokeWidth="2" strokeLinejoin="round"/><path d="M20 14 L21.5 17.5 L25 17.5 L22.2 19.8 L23.3 23.5 L20 21.2 L16.7 23.5 L17.8 19.8 L15 17.5 L18.5 17.5 Z" fill="white"/></svg>)} />
            <KatTile href="/quiz" titel="Quiz" desc="Kostenlos · 61 Themen" gradient="linear-gradient(135deg, #c47b1f 0%, #e8a83b 100%)" icon={(<svg width="36" height="36" viewBox="0 0 40 40"><circle cx="20" cy="20" r="14" stroke="white" strokeWidth="2" fill="none"/><path d="M16 16.5C16 14 17.5 12 20 12c2.5 0 4 1.8 4 3.5 0 3-4 4-4 7" stroke="white" strokeWidth="2.5" strokeLinecap="round"/><circle cx="20" cy="27" r="1.5" fill="white"/></svg>)} />
          </div>
        </div>
      </section>

      {/* TOP HEUTE */}
      <section style={{ padding: mobil ? '40px 0 30px 22px' : '60px 0 40px 60px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '20px', paddingRight: mobil ? '22px' : '60px' }}>
          <h2 style={{ fontFamily: SERIF, fontSize: mobil ? '28px' : '36px', fontWeight: 600, color: F.white, margin: 0, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ background: F.accent, color: F.white, padding: '2px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 800, letterSpacing: '0.1em' }}>TOP</span>
            Beliebt diese Woche
          </h2>
          <span style={{ fontSize: '13px', color: F.inkMuted }}>← scrollen →</span>
        </div>
        <div className="scroll-row" style={{ paddingRight: mobil ? '22px' : '60px' }}>
          {top.map((p, i) => (<PosterBig key={p.id} p={p} rang={i + 1} onClick={() => setAusgewaehlt(p)} mobil={mobil} />))}
        </div>
      </section>

      {/* MATHEMATIK */}
      <section id="mathe" style={{ padding: mobil ? '40px 0 30px 22px' : '60px 0 40px 60px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '20px', paddingRight: mobil ? '22px' : '60px' }}>
          <div>
            <p style={{ fontSize: '12px', letterSpacing: '0.2em', textTransform: 'uppercase', color: F.accent, fontWeight: 700, margin: '0 0 6px' }}>Kategorie</p>
            <h2 style={{ fontFamily: SERIF, fontSize: mobil ? '32px' : '44px', fontWeight: 600, color: F.white, margin: 0, letterSpacing: '-0.02em' }}>Mathematik</h2>
          </div>
          <span style={{ fontSize: '13px', color: F.inkMuted }}>{mathe.length} Pakete</span>
        </div>
        <div className="scroll-row" style={{ paddingRight: mobil ? '22px' : '60px' }}>
          {mathe.map((p) => (<Poster key={p.id} p={p} onClick={() => setAusgewaehlt(p)} mobil={mobil} />))}
        </div>
      </section>

      {/* PHYSIK */}
      <section id="physik" style={{ padding: mobil ? '40px 0 30px 22px' : '60px 0 40px 60px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '20px', paddingRight: mobil ? '22px' : '60px' }}>
          <div>
            <p style={{ fontSize: '12px', letterSpacing: '0.2em', textTransform: 'uppercase', color: F.accent, fontWeight: 700, margin: '0 0 6px' }}>Kategorie</p>
            <h2 style={{ fontFamily: SERIF, fontSize: mobil ? '32px' : '44px', fontWeight: 600, color: F.white, margin: 0, letterSpacing: '-0.02em' }}>Physik</h2>
          </div>
          <span style={{ fontSize: '13px', color: F.inkMuted }}>{physik.length} Pakete</span>
        </div>
        <div className="scroll-row" style={{ paddingRight: mobil ? '22px' : '60px' }}>
          {physik.map((p) => (<Poster key={p.id} p={p} onClick={() => setAusgewaehlt(p)} mobil={mobil} />))}
        </div>
      </section>

      {/* LERNHELD FEATURE BANNER */}
      <section style={{ padding: mobil ? '60px 22px' : '100px 60px' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', background: 'linear-gradient(135deg, #1a0f1c 0%, #2a0f1d 50%, #1a0a14 100%)', borderRadius: '24px', padding: mobil ? '40px 28px' : '70px 80px', position: 'relative', overflow: 'hidden', border: `1px solid ${F.border}` }}>
          <div style={{ position: 'absolute', top: '-30%', right: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(230,53,79,0.25) 0%, transparent 60%)' }} />
          <div style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: mobil ? '1fr' : '1.4fr 1fr', gap: '40px', alignItems: 'center' }}>
            <div>
              <span style={{ display: 'inline-block', background: F.accentSoft, color: F.accent, padding: '6px 14px', borderRadius: '999px', fontSize: '11.5px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: '20px', border: '1px solid rgba(230,53,79,0.3)' }}>
                Premium · 1,99 €
              </span>
              <h2 style={{ fontFamily: SERIF, fontSize: mobil ? '40px' : '60px', fontWeight: 600, color: F.white, margin: '0 0 20px', lineHeight: 1.0, letterSpacing: '-0.03em' }}>
                Dein eigener<br /><span style={{ fontStyle: 'italic', color: F.accent }}>Lernheld</span>-Plan.
              </h2>
              <p style={{ fontSize: mobil ? '15.5px' : '17px', color: F.inkSoft, lineHeight: 1.6, margin: '0 0 32px', maxWidth: '460px' }}>
                Foto vom Stoff hochladen, Klasse wählen, fertig. Dein persönlicher Lernplan zur Schulaufgabe — mit allen Themen, Erklärungen, Übungen und Lösungen.
              </p>
              <a href="/lernheld" className="btn-primary" style={{ background: F.accent, color: F.white, textDecoration: 'none', padding: '15px 32px', borderRadius: '8px', fontSize: '15px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
                ▶ Plan jetzt erstellen
              </a>
            </div>
            <div>
              {[
                { n: '01', t: 'Fotos hochladen', d: 'Stoffliste, Buchseiten, Übungen' },
                { n: '02', t: 'Klasse & Datum wählen', d: 'Wann ist die Schulaufgabe?' },
                { n: '03', t: 'Dein Plan ist fertig', d: 'Komplette Erklärungen + Lösungen' },
              ].map((s) => (
                <div key={s.n} style={{ display: 'flex', gap: '16px', padding: '16px 0', borderBottom: `1px solid ${F.border}` }}>
                  <span style={{ fontFamily: SERIF, fontSize: '28px', fontStyle: 'italic', color: F.accent, fontWeight: 600, minWidth: '40px' }}>{s.n}</span>
                  <div>
                    <p style={{ fontFamily: SERIF, fontSize: '20px', fontWeight: 600, color: F.white, margin: '0 0 2px' }}>{s.t}</p>
                    <p style={{ fontSize: '13.5px', color: F.inkMuted, margin: 0 }}>{s.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* QUIZ + LERNPAKETE - 2 Spalten */}
      <section id="pakete" style={{ padding: mobil ? '20px 22px 70px' : '40px 60px 100px' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'grid', gridTemplateColumns: mobil ? '1fr' : '1fr 1fr', gap: mobil ? '18px' : '24px' }}>
          {/* QUIZ */}
          <div style={{ background: 'linear-gradient(135deg, #1e4a82 0%, #2c6bb8 100%)', borderRadius: '20px', padding: mobil ? '32px 28px' : '48px 44px', position: 'relative', overflow: 'hidden' }}>
            <span style={{ display: 'inline-block', background: 'rgba(255,255,255,0.18)', color: F.white, padding: '6px 14px', borderRadius: '999px', fontSize: '11.5px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: '18px' }}>
              Kostenlos
            </span>
            <h3 style={{ fontFamily: SERIF, fontSize: mobil ? '32px' : '40px', fontWeight: 600, color: F.white, margin: '0 0 14px', lineHeight: 1.0, letterSpacing: '-0.02em' }}>
              Teste dein <span style={{ fontStyle: 'italic' }}>Wissen</span>.
            </h3>
            <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.85)', lineHeight: 1.6, margin: '0 0 28px' }}>
              61 Themen, Klasse 1 bis 13. Wähle Fach und Klasse — jede Runde neue Fragen.
            </p>
            <a href="/quiz" className="btn-ghost" style={{ background: F.white, color: '#1e4a82', textDecoration: 'none', padding: '13px 26px', borderRadius: '999px', fontSize: '14.5px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              ▶ Quiz starten
            </a>
          </div>
          {/* LERNPAKETE COMING SOON */}
          <div style={{ background: 'linear-gradient(135deg, #1f7a52 0%, #4a9a72 100%)', borderRadius: '20px', padding: mobil ? '32px 28px' : '48px 44px', position: 'relative', overflow: 'hidden' }}>
            <span style={{ display: 'inline-block', background: 'rgba(255,255,255,0.18)', color: F.white, padding: '6px 14px', borderRadius: '999px', fontSize: '11.5px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: '18px' }}>
              Bald
            </span>
            <h3 style={{ fontFamily: SERIF, fontSize: mobil ? '32px' : '40px', fontWeight: 600, color: F.white, margin: '0 0 14px', lineHeight: 1.0, letterSpacing: '-0.02em' }}>
              Komplett-<span style={{ fontStyle: 'italic' }}>Pakete</span>.
            </h3>
            <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.85)', lineHeight: 1.6, margin: '0 0 28px' }}>
              Abi-Vorbereitung, Sommer-Programme, Klassenarbeitstraining. Coming soon.
            </p>
            <span style={{ color: F.white, padding: '13px 26px', borderRadius: '999px', fontSize: '14.5px', fontWeight: 700, border: '1.5px solid rgba(255,255,255,0.4)', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              Benachrichtigung folgt
            </span>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: F.bgDeep, color: F.white, padding: mobil ? '60px 22px 30px' : '80px 60px 40px', borderTop: `1px solid ${F.border}` }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: mobil ? '1fr' : '2fr 1fr 1fr 1fr', gap: '40px', marginBottom: '50px' }}>
            <div>
              <span style={{ fontFamily: SERIF, fontSize: '34px', fontWeight: 700, color: F.white, letterSpacing: '-0.025em', display: 'block', marginBottom: '14px' }}>
                Lern<span style={{ color: F.accent }}>flix</span>
              </span>
              <p style={{ fontSize: '14px', color: F.inkMuted, lineHeight: 1.6, margin: 0, maxWidth: '320px' }}>
                Deine Lern-Bibliothek für Mathematik und Physik. Klasse 1 bis 13.
              </p>
            </div>
            <div>
              <p style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: F.accent, fontWeight: 700, margin: '0 0 18px' }}>Lernen</p>
              <a href="#mathe" style={{ display: 'block', color: F.inkSoft, textDecoration: 'none', fontSize: '14px', marginBottom: '12px' }}>Mathematik</a>
              <a href="#physik" style={{ display: 'block', color: F.inkSoft, textDecoration: 'none', fontSize: '14px', marginBottom: '12px' }}>Physik</a>
              <a href="/lernheld" style={{ display: 'block', color: F.inkSoft, textDecoration: 'none', fontSize: '14px', marginBottom: '12px' }}>Lernheld</a>
              <a href="/quiz" style={{ display: 'block', color: F.inkSoft, textDecoration: 'none', fontSize: '14px', marginBottom: '12px' }}>Quiz</a>
            </div>
            <div>
              <p style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: F.accent, fontWeight: 700, margin: '0 0 18px' }}>Rechtliches</p>
              <a href="/impressum" style={{ display: 'block', color: F.inkSoft, textDecoration: 'none', fontSize: '14px', marginBottom: '12px' }}>Impressum</a>
              <a href="/datenschutz" style={{ display: 'block', color: F.inkSoft, textDecoration: 'none', fontSize: '14px', marginBottom: '12px' }}>Datenschutz</a>
              <a href="/agb" style={{ display: 'block', color: F.inkSoft, textDecoration: 'none', fontSize: '14px', marginBottom: '12px' }}>AGB</a>
            </div>
            <div>
              <p style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: F.accent, fontWeight: 700, margin: '0 0 18px' }}>Kontakt</p>
              <a href="https://wa.me/4917624700519" style={{ display: 'block', color: F.inkSoft, textDecoration: 'none', fontSize: '14px', marginBottom: '12px' }}>WhatsApp</a>
            </div>
          </div>
          <div style={{ borderTop: `1px solid ${F.border}`, paddingTop: '24px', textAlign: 'center', fontSize: '13px', color: F.inkMuted }}>
            © {new Date().getFullYear()} Lernflix · lernflix.lernemitanna.de
          </div>
        </div>
      </footer>
    </main>
  );
}

function KatTile({ href, titel, desc, gradient, icon, badge }: { href: string; titel: string; desc: string; gradient: string; icon: React.ReactNode; badge?: string }) {
  return (
    <a href={href} className="kat-tile" style={{ background: gradient, borderRadius: '16px', padding: '24px 22px', textDecoration: 'none', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden', minHeight: '160px', justifyContent: 'space-between', boxShadow: '0 8px 24px rgba(0,0,0,0.25)' }}>
      {badge && <span style={{ position: 'absolute', top: '14px', right: '14px', background: 'rgba(0,0,0,0.3)', color: 'white', fontSize: '10px', fontWeight: 800, padding: '3px 10px', borderRadius: '6px', letterSpacing: '0.1em' }}>{badge}</span>}
      <div>{icon}</div>
      <div>
        <h3 style={{ fontFamily: SERIF, fontSize: '22px', fontWeight: 700, color: 'white', margin: '0 0 4px', letterSpacing: '-0.01em' }}>{titel}</h3>
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.82)', margin: 0, lineHeight: 1.4 }}>{desc}</p>
      </div>
    </a>
  );
}

function PosterBig({ p, rang, onClick, mobil }: { p: Produkt; rang: number; onClick: () => void; mobil: boolean }) {
  const t = (p.slug && THEMA[p.slug]) || { bg: '#3a7bb8', bgEnd: '#5a9bd8', render: () => null };
  const breite = mobil ? 220 : 280;
  return (
    <div className="poster" onClick={onClick} style={{ width: breite, position: 'relative', display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 12px 30px rgba(0,0,0,0.45)' }}>
        <div style={{ background: t.bgEnd ? `linear-gradient(135deg, ${t.bg}, ${t.bgEnd})` : t.bg, height: mobil ? 280 : 340, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '30px' }}>
          {t.render()}
        </div>
        <div style={{ position: 'absolute', top: '14px', left: '14px', background: F.accent, color: F.white, padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 800, letterSpacing: '0.1em' }}>#{rang}</div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 18px', background: 'linear-gradient(0deg, rgba(0,0,0,0.85) 0%, transparent 100%)' }}>
          <p style={{ fontSize: '10.5px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.75)', fontWeight: 700, margin: '0 0 4px' }}>{p.kategorie === 'mathe' ? 'Mathematik' : 'Physik'}</p>
          <h3 style={{ fontFamily: SERIF, fontSize: '20px', fontWeight: 700, color: F.white, margin: 0, lineHeight: 1.15, letterSpacing: '-0.01em' }}>{p.titel}</h3>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px' }}>
        <span style={{ fontFamily: SERIF, fontSize: '20px', fontWeight: 700, color: F.white }}>{p.preis.toFixed(2).replace('.', ',')} €</span>
        <span className="poster-arrow" style={{ fontSize: '13px', color: F.inkSoft, fontWeight: 600, transition: 'all 0.25s ease' }}>Ansehen →</span>
      </div>
    </div>
  );
}

function Poster({ p, onClick, mobil }: { p: Produkt; onClick: () => void; mobil: boolean }) {
  const t = (p.slug && THEMA[p.slug]) || { bg: '#3a7bb8', bgEnd: '#5a9bd8', render: () => null };
  const breite = mobil ? 190 : 230;
  return (
    <div className="poster" onClick={onClick} style={{ width: breite, position: 'relative', display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'relative', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 8px 22px rgba(0,0,0,0.35)' }}>
        <div style={{ background: t.bgEnd ? `linear-gradient(135deg, ${t.bg}, ${t.bgEnd})` : t.bg, height: mobil ? 240 : 290, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          {t.render()}
        </div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px 16px', background: 'linear-gradient(0deg, rgba(0,0,0,0.82) 0%, transparent 100%)' }}>
          <h3 style={{ fontFamily: SERIF, fontSize: '17px', fontWeight: 700, color: F.white, margin: 0, lineHeight: 1.15, letterSpacing: '-0.01em' }}>{p.titel}</h3>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px' }}>
        <span style={{ fontFamily: SERIF, fontSize: '17px', fontWeight: 700, color: F.white }}>{p.preis.toFixed(2).replace('.', ',')} €</span>
        <span className="poster-arrow" style={{ fontSize: '12.5px', color: F.inkSoft, fontWeight: 600, transition: 'all 0.25s ease' }}>Ansehen →</span>
      </div>
    </div>
  );
}
