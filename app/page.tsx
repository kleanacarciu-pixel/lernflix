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
  bgCream: '#fdf8f0',
  bgMint: '#f0f9f4',
  bgSky: '#eff6fb',
  bgPeach: '#fdf2ed',
  ink: '#2d3436',
  inkSoft: '#566066',
  inkMuted: '#8d9498',
  border: '#ececec',
  borderSoft: '#f5f5f5',
  white: '#ffffff',
  coral: '#ff6b6b',
  coralDeep: '#e55454',
  mint: '#4ecdc4',
  mintDeep: '#3aada4',
  sun: '#ffd166',
  sunDeep: '#e8b94e',
  sky: '#5cabd6',
  skyDeep: '#4691bc',
  lavender: '#a18ee0',
  lavenderDeep: '#876fc4',
  dark: '#2d3436',
};

const SERIF = '"Cormorant Garamond", Georgia, serif';
const SANS = '"Inter", -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif';

const THEMA: Record<string, { bg: string; render: () => React.ReactElement }> = {
  geometrie: { bg: F.sky, render: () => (<svg viewBox="0 0 120 80" width="100%" height="100%"><polygon points="20,65 100,65 60,15" fill="#ffffff" opacity="0.95"/><rect x="48" y="55" width="10" height="10" fill="none" stroke="#2d3436" strokeWidth="1.5"/></svg>) },
  brueche: { bg: F.coral, render: () => (<svg viewBox="0 0 120 80" width="100%" height="100%"><text x="60" y="40" fontSize="32" fontWeight="700" fill="#ffffff" textAnchor="middle" fontFamily="Cormorant Garamond, Georgia, serif">¾</text><line x1="35" y1="48" x2="85" y2="48" stroke="#ffffff" strokeWidth="2"/></svg>) },
  prozent: { bg: F.mint, render: () => (<svg viewBox="0 0 120 80" width="100%" height="100%"><text x="60" y="55" fontSize="44" fontWeight="700" fill="#ffffff" textAnchor="middle">%</text></svg>) },
  gleichungen: { bg: F.sun, render: () => (<svg viewBox="0 0 120 80" width="100%" height="100%"><text x="60" y="52" fontSize="30" fontWeight="700" fill="#2d3436" textAnchor="middle" fontFamily="Cormorant Garamond, Georgia, serif"><tspan fontStyle="italic">x</tspan> = ?</text></svg>) },
  funktionen: { bg: F.lavender, render: () => (<svg viewBox="0 0 120 80" width="100%" height="100%"><line x1="15" y1="40" x2="105" y2="40" stroke="#ffffff" strokeWidth="1" opacity="0.4"/><line x1="60" y1="10" x2="60" y2="70" stroke="#ffffff" strokeWidth="1" opacity="0.4"/><path d="M 20 65 Q 60 -10 100 65" fill="none" stroke="#ffffff" strokeWidth="3"/></svg>) },
  stochastik: { bg: F.sky, render: () => (<svg viewBox="0 0 120 80" width="100%" height="100%"><rect x="40" y="20" width="40" height="40" rx="6" fill="#ffffff"/><circle cx="52" cy="32" r="3" fill="#2d3436"/><circle cx="68" cy="32" r="3" fill="#2d3436"/><circle cx="52" cy="48" r="3" fill="#2d3436"/><circle cx="68" cy="48" r="3" fill="#2d3436"/></svg>) },
  trigonometrie: { bg: F.mint, render: () => (<svg viewBox="0 0 120 80" width="100%" height="100%"><polygon points="20,65 100,65 100,20" fill="#ffffff" opacity="0.95"/><rect x="88" y="53" width="12" height="12" fill="none" stroke="#2d3436" strokeWidth="1.5"/><text x="35" y="60" fontSize="14" fontStyle="italic" fontWeight="700" fill="#2d3436">α</text></svg>) },
  potenzen: { bg: F.lavender, render: () => (<svg viewBox="0 0 120 80" width="100%" height="100%"><text x="50" y="55" fontSize="40" fontWeight="700" fill="#ffffff" textAnchor="middle" fontFamily="Cormorant Garamond, Georgia, serif"><tspan fontStyle="italic">x</tspan></text><text x="78" y="32" fontSize="22" fontWeight="700" fill="#ffffff" fontFamily="Cormorant Garamond, Georgia, serif">2</text></svg>) },
  mechanik: { bg: F.sun, render: () => (<svg viewBox="0 0 120 80" width="100%" height="100%"><circle cx="42" cy="50" r="14" fill="#ffffff"/><line x1="56" y1="50" x2="92" y2="50" stroke="#ffffff" strokeWidth="4"/><polygon points="88,44 100,50 88,56" fill="#ffffff"/></svg>) },
  elektrizitaet: { bg: F.sun, render: () => (<svg viewBox="0 0 120 80" width="100%" height="100%"><polygon points="55,12 35,45 55,45 45,68 80,30 60,30 70,12" fill="#2d3436"/></svg>) },
  optik: { bg: F.lavender, render: () => (<svg viewBox="0 0 120 80" width="100%" height="100%"><circle cx="60" cy="40" r="22" fill="#ffd166"/><line x1="60" y1="8" x2="60" y2="14" stroke="#ffffff" strokeWidth="2"/><line x1="60" y1="66" x2="60" y2="72" stroke="#ffffff" strokeWidth="2"/><line x1="28" y1="40" x2="34" y2="40" stroke="#ffffff" strokeWidth="2"/><line x1="86" y1="40" x2="92" y2="40" stroke="#ffffff" strokeWidth="2"/></svg>) },
  waerme: { bg: F.coral, render: () => (<svg viewBox="0 0 120 80" width="100%" height="100%"><rect x="55" y="12" width="10" height="40" rx="5" fill="#ffffff" stroke="#2d3436" strokeWidth="1.5"/><rect x="55" y="32" width="10" height="20" fill="#2d3436"/><circle cx="60" cy="60" r="11" fill="#2d3436"/></svg>) },
  atomphysik: { bg: F.mint, render: () => (<svg viewBox="0 0 120 80" width="100%" height="100%"><circle cx="60" cy="40" r="6" fill="#ffffff"/><ellipse cx="60" cy="40" rx="30" ry="10" fill="none" stroke="#ffffff" strokeWidth="2"/><ellipse cx="60" cy="40" rx="30" ry="10" fill="none" stroke="#ffffff" strokeWidth="2" transform="rotate(60 60 40)"/><ellipse cx="60" cy="40" rx="30" ry="10" fill="none" stroke="#ffffff" strokeWidth="2" transform="rotate(-60 60 40)"/></svg>) },
};

export default function Home() {
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
    { id: 1, slug: 'geometrie', kategorie: 'mathe', typ: 'Lernpaket', titel: 'Geometrie', beschreibung: 'Alle Geometrie-Themen — Dreiecke, Vierecke, Kreis, Körper.', details: ['13 Sektionen mit SVG-Skizzen', 'Pythagoras + Höhensatz + Kathetensatz', 'Komplette Trigonometrie', 'Alle Vierecke & Körper', 'Strahlensätze & Ähnlichkeit', 'Schnellübersicht am Ende'], seiten: 'HTML', preis: 1.99, vorschau: '' },
    { id: 2, slug: 'brueche', kategorie: 'mathe', typ: 'Lernpaket', titel: 'Brüche', beschreibung: 'Brüche endlich verstehen — kürzen, erweitern, addieren, multiplizieren.', details: ['Was ist ein Bruch?', 'Kürzen & Erweitern', 'Plus, Minus, Mal, Geteilt', 'Gemischte Brüche, Dezimalzahlen', 'Eselsbrücken', 'Übungen mit Lösungen'], seiten: 'HTML', preis: 1.99, vorschau: '' },
    { id: 3, slug: 'prozent', kategorie: 'mathe', typ: 'Lernpaket', titel: 'Prozent & Zinsen', beschreibung: 'Rabatte, MwSt, Zinsen und Zinseszins — mit einfachen Tricks.', details: ['Die Grundformel der Prozentrechnung', '3 klassische Aufgabentypen', 'Aufschlag & Rabatt', 'Zinsrechnung & Zinseszins', 'Promille und ppm', 'Übungen mit Lösungen'], seiten: 'HTML', preis: 0.99, vorschau: '' },
    { id: 4, slug: 'gleichungen', kategorie: 'mathe', typ: 'Lernpaket', titel: 'Gleichungen', beschreibung: 'Vom einfachen x = 5 bis zur pq-Formel — Schritt für Schritt.', details: ['Terme vereinfachen', 'Lineare Gleichungen', 'Gleichungssysteme', 'Quadratische Gleichungen', 'pq-Formel & Mitternachtsformel', 'Ungleichungen'], seiten: 'HTML', preis: 1.99, vorschau: '' },
    { id: 5, slug: 'funktionen', kategorie: 'mathe', typ: 'Lernpaket', titel: 'Funktionen', beschreibung: 'Geraden, Parabeln und Co — alle Funktionstypen mit Skizzen.', details: ['Lineare Funktionen', 'Quadratische Funktionen', 'pq-Formel anwenden', 'Schnittpunkte, Steigung, Scheitel', 'Spezielle Funktionen', 'Symmetrie und Monotonie'], seiten: 'HTML', preis: 1.99, vorschau: '' },
    { id: 6, slug: 'stochastik', kategorie: 'mathe', typ: 'Lernpaket', titel: 'Wahrscheinlichkeit', beschreibung: 'Würfel, Münze, Mittelwert — mit Baumdiagrammen.', details: ['Grundlagen der Wahrscheinlichkeit', 'Mehrstufige Versuche & Baumdiagramme', 'Mit und ohne Zurücklegen', 'Kombinatorik & Anordnungen', 'Statistik: Mittelwert, Median', 'Binomialverteilung'], seiten: 'HTML', preis: 0.99, vorschau: '' },
    { id: 7, slug: 'trigonometrie', kategorie: 'mathe', typ: 'Lernpaket', titel: 'Trigonometrie', beschreibung: 'sin, cos, tan kein Geheimnis mehr — mit Eselsbrücken.', details: ['Sinus, Kosinus, Tangens', 'Eselsbrücke GAGA HUDI', 'Sinussatz & Kosinussatz', 'Wertetabelle wichtiger Winkel', 'Trigonometrische Funktionen', 'Bogenmaß und Grad'], seiten: 'HTML', preis: 0.99, vorschau: '' },
    { id: 8, slug: 'potenzen', kategorie: 'mathe', typ: 'Lernpaket', titel: 'Potenzen', beschreibung: 'Die fünf Potenzgesetze einfach erklärt — mit Übungen.', details: ['Alle 5 Potenzgesetze', 'Negative & gebrochene Exponenten', 'Wurzeln und Wurzelgesetze', 'Wissenschaftliche Schreibweise', 'Wachstum und Zerfall', 'Logarithmen'], seiten: 'HTML', preis: 0.99, vorschau: '' },
    { id: 9, slug: 'mechanik', kategorie: 'physik', typ: 'Lernpaket', titel: 'Mechanik', beschreibung: 'Geschwindigkeit, Kraft, Energie, Hebel — mit Skizzen.', details: ['Bewegung & freier Fall', 'Newton-Gesetze', 'Schiefe Ebene', 'Energie, Arbeit, Leistung', 'Hebel & Flaschenzug', 'Dichte, Druck, Auftrieb'], seiten: 'HTML', preis: 0.99, vorschau: '' },
    { id: 10, slug: 'elektrizitaet', kategorie: 'physik', typ: 'Lernpaket', titel: 'Elektrizität', beschreibung: 'Ohm, Spannung, Stromstärke — und die Stromrechnung verstehen.', details: ['Ohm´sches Gesetz', 'Reihen- und Parallelschaltung', 'Elektrische Arbeit & Leistung', 'Spezifischer Widerstand', 'Gefahren des Stroms', 'Übungen mit Lösungen'], seiten: 'HTML', preis: 1.99, vorschau: '' },
    { id: 11, slug: 'optik', kategorie: 'physik', typ: 'Lernpaket', titel: 'Optik & Wellen', beschreibung: 'Licht, Spiegel, Linsen, Regenbogen — Sehen und Brechen.', details: ['Lichtausbreitung & Schatten', 'Reflexion am Spiegel', 'Lichtbrechung & Snellius', 'Linsen und Linsenformel', 'Spektrum und Farben', 'Wellen und Welleneigenschaften'], seiten: 'HTML', preis: 0.99, vorschau: '' },
    { id: 12, slug: 'waerme', kategorie: 'physik', typ: 'Lernpaket', titel: 'Wärmelehre', beschreibung: 'Temperatur, Wärme, Aggregatzustände — das Zappeln der Atome.', details: ['Temperatur und Skalen', 'Wärmekapazität', 'Aggregatzustände & Phasenübergänge', 'Wärmeübertragung', 'Längenausdehnung', 'Gasgesetze'], seiten: 'HTML', preis: 0.99, vorschau: '' },
    { id: 13, slug: 'atomphysik', kategorie: 'physik', typ: 'Lernpaket', titel: 'Atomphysik', beschreibung: 'Atome, Isotope, Radioaktivität — die Bausteine der Welt.', details: ['Atomaufbau & Isotope', 'Periodensystem', 'α-, β-, γ-Strahlung', 'Halbwertszeit', 'Kernspaltung & Kernfusion', 'Quantenphysik im Überblick'], seiten: 'HTML', preis: 0.99, vorschau: '' },
  ];

  const mathe = produkte.filter((p) => p.kategorie === 'mathe');
  const physik = produkte.filter((p) => p.kategorie === 'physik');
  const angezeigt = filter === 'alle' ? produkte : produkte.filter((p) => p.kategorie === filter);

  return (
    <main style={{ minHeight: '100vh', background: F.bg, fontFamily: SANS, color: F.ink, overflowX: 'hidden' }}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap" />

      <style>{`
        * { -webkit-font-smoothing: antialiased; }
        body { background: ${F.bg}; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) both; }
        .karte { transition: transform 0.3s ease, box-shadow 0.3s ease; cursor: pointer; }
        .karte:hover { transform: translateY(-6px); box-shadow: 0 20px 40px rgba(45,52,54,0.10); }
        .btn-primary { transition: all 0.25s ease; }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 14px 30px rgba(255,107,107,0.32); }
        .btn-ghost { transition: all 0.25s ease; }
        .btn-ghost:hover { background: ${F.ink}; color: ${F.white}; }
        .kat:hover { transform: translateY(-4px); box-shadow: 0 24px 50px rgba(45,52,54,0.12); }
        .kat { transition: transform 0.3s ease, box-shadow 0.3s ease; }
      `}</style>

      {/* MODAL */}
      {ausgewaehlt && (
        <div onClick={() => setAusgewaehlt(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(45,52,54,0.55)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: F.white, borderRadius: '24px', maxWidth: '560px', width: '100%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 30px 80px rgba(0,0,0,0.25)' }}>
            <div style={{ height: '180px', position: 'relative', overflow: 'hidden', borderRadius: '24px 24px 0 0' }}>
              {(() => { const t = ausgewaehlt.slug && THEMA[ausgewaehlt.slug]; return t ? (<div style={{ background: t.bg, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>{t.render()}</div>) : null; })()}
              <button onClick={() => setAusgewaehlt(null)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.92)', border: 'none', width: '36px', height: '36px', borderRadius: '50%', fontSize: '16px', cursor: 'pointer', color: F.ink }}>✕</button>
            </div>
            <div style={{ padding: mobil ? '28px 24px' : '36px 40px' }}>
              <span style={{ fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: F.coral, fontWeight: 700 }}>{ausgewaehlt.kategorie === 'mathe' ? 'Mathematik' : 'Physik'}</span>
              <h2 style={{ fontFamily: SERIF, fontSize: mobil ? '30px' : '38px', fontWeight: 600, margin: '8px 0 14px', color: F.ink, lineHeight: 1.05, letterSpacing: '-0.02em' }}>{ausgewaehlt.titel}</h2>
              <p style={{ fontSize: '15.5px', color: F.inkSoft, lineHeight: 1.65, margin: '0 0 24px' }}>{ausgewaehlt.beschreibung}</p>
              <div style={{ background: F.bgCream, borderRadius: '16px', padding: '22px 24px', marginBottom: '28px' }}>
                <p style={{ fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: F.coral, fontWeight: 700, margin: '0 0 14px' }}>Was drin ist</p>
                {ausgewaehlt.details.map((d, i) => (
                  <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <span style={{ color: F.coral, fontWeight: 700, fontSize: '14px', flexShrink: 0, marginTop: '2px' }}>✓</span>
                    <span style={{ fontSize: '14.5px', color: F.ink, lineHeight: 1.5 }}>{d}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '24px', borderTop: `1px solid ${F.border}` }}>
                <div>
                  <p style={{ margin: 0, fontSize: '11.5px', color: F.inkMuted, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Einmalig</p>
                  <p style={{ margin: '4px 0 0', fontFamily: SERIF, fontSize: '40px', fontWeight: 600, color: F.ink, letterSpacing: '-0.02em' }}>{ausgewaehlt.preis.toFixed(2).replace('.', ',')} €</p>
                </div>
                <button onClick={() => kaufen(ausgewaehlt)} className="btn-primary" style={{ background: F.coral, color: F.white, border: 'none', borderRadius: '999px', padding: '15px 30px', fontSize: '15px', fontWeight: 700, cursor: 'pointer', fontFamily: SANS }}>
                  {ausgewaehlt.slug ? 'Jetzt freischalten' : 'Jetzt kaufen'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: scrolled ? 'rgba(255,255,255,0.92)' : 'transparent', backdropFilter: scrolled ? 'saturate(180%) blur(20px)' : 'none', borderBottom: scrolled ? `1px solid ${F.border}` : '1px solid transparent', padding: mobil ? '14px 22px' : '18px 60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all 0.3s ease' }}>
        <a href="#" style={{ textDecoration: 'none' }}>
          <span style={{ fontFamily: SERIF, fontSize: mobil ? '28px' : '32px', fontWeight: 700, color: F.ink, letterSpacing: '-0.02em' }}>
            Lern<span style={{ color: F.coral }}>flix</span>
          </span>
        </a>
        <nav style={{ display: 'flex', gap: mobil ? '14px' : '32px', alignItems: 'center' }}>
          {!mobil && (
            <>
              <a href="#mathe" style={{ color: F.ink, textDecoration: 'none', fontSize: '14.5px', fontWeight: 500 }}>Mathematik</a>
              <a href="#physik" style={{ color: F.ink, textDecoration: 'none', fontSize: '14.5px', fontWeight: 500 }}>Physik</a>
              <a href="/quiz" style={{ color: F.ink, textDecoration: 'none', fontSize: '14.5px', fontWeight: 500 }}>Quiz</a>
            </>
          )}
          <a href="/lernheld" style={{ background: F.coral, color: F.white, textDecoration: 'none', fontSize: '14px', fontWeight: 600, padding: '11px 22px', borderRadius: '999px' }}>Lernheld</a>
        </nav>
      </header>

      {/* ====== SECTION 1: HERO ====== */}
      <section className="fade-up" style={{ background: F.bgCream, paddingTop: mobil ? '110px' : '140px', paddingBottom: mobil ? '60px' : '100px', paddingLeft: mobil ? '22px' : '60px', paddingRight: mobil ? '22px' : '60px' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'grid', gridTemplateColumns: mobil ? '1fr' : '1.05fr 1fr', gap: mobil ? '40px' : '60px', alignItems: 'center' }}>
          <div>
            <span style={{ display: 'inline-block', background: F.white, color: F.coral, padding: '8px 18px', borderRadius: '999px', fontSize: '12.5px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '24px', boxShadow: '0 4px 14px rgba(255,107,107,0.12)' }}>
              ✦ Deine Lern-Bibliothek
            </span>
            <h1 style={{ fontFamily: SERIF, fontSize: mobil ? '50px' : '80px', fontWeight: 600, lineHeight: 1.0, margin: '0 0 22px', color: F.ink, letterSpacing: '-0.03em' }}>
              Mathe und Physik,<br /><span style={{ fontStyle: 'italic', color: F.coral }}>endlich entspannt</span>.
            </h1>
            <p style={{ fontSize: mobil ? '16.5px' : '19px', color: F.inkSoft, lineHeight: 1.55, margin: '0 0 34px', maxWidth: '500px' }}>
              13 schöne Lernpakete, dein eigener Lernplan und ein kostenloses Quiz — für jede Klasse von 1 bis 13.
            </p>
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <a href="/lernheld" className="btn-primary" style={{ background: F.coral, color: F.white, textDecoration: 'none', padding: '16px 32px', borderRadius: '999px', fontSize: '15.5px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                Lernheld starten →
              </a>
              <a href="#bibliothek" className="btn-ghost" style={{ background: 'transparent', color: F.ink, textDecoration: 'none', padding: '16px 32px', borderRadius: '999px', fontSize: '15.5px', fontWeight: 700, border: `1.5px solid ${F.ink}` }}>
                Pakete ansehen
              </a>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <BuchstapelBild size={mobil ? 280 : 420} />
          </div>
        </div>
      </section>

      {/* ====== SECTION 2: KATEGORIEN ====== */}
      <section style={{ background: F.bg, padding: mobil ? '70px 22px' : '110px 60px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: mobil ? '36px' : '52px' }}>
            <span style={{ display: 'inline-block', fontSize: '12.5px', color: F.coral, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: '12px' }}>1. Was suchst du?</span>
            <h2 style={{ fontFamily: SERIF, fontSize: mobil ? '36px' : '50px', fontWeight: 600, color: F.ink, margin: 0, letterSpacing: '-0.02em' }}>
              Vier einfache Wege zu deinem Ziel.
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: mobil ? '1fr 1fr' : 'repeat(4, 1fr)', gap: mobil ? '14px' : '20px' }}>
            <KatTile href="#bibliothek" farbe={F.sky} titel="Lernpakete" sub={`${produkte.length} Themen verfügbar`} icon={(<svg width="32" height="32" viewBox="0 0 40 40"><rect x="6" y="14" width="28" height="20" rx="3" fill="white" fillOpacity="0.2" stroke="white" strokeWidth="2"/><path d="M14 14V10a6 6 0 0 1 12 0v4" stroke="white" strokeWidth="2" strokeLinecap="round"/><path d="M20 22v4M16 24h8" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>)} />
            <KatTile href="/lernheld" farbe={F.coral} titel="Lernheld" sub="Premium · 1,99 €" icon={(<svg width="32" height="32" viewBox="0 0 40 40"><path d="M20 4 L32 9 V20 C32 27 26 33 20 35 C14 33 8 27 8 20 V9 Z" fill="white" fillOpacity="0.2" stroke="white" strokeWidth="2" strokeLinejoin="round"/><path d="M20 14 L21.5 17.5 L25 17.5 L22.2 19.8 L23.3 23.5 L20 21.2 L16.7 23.5 L17.8 19.8 L15 17.5 L18.5 17.5 Z" fill="white"/></svg>)} />
            <KatTile href="/quiz" farbe={F.sun} titelDark titel="Quiz" sub="Kostenlos · 61 Themen" icon={(<svg width="32" height="32" viewBox="0 0 40 40"><circle cx="20" cy="20" r="14" stroke="#2d3436" strokeWidth="2" fill="none"/><path d="M16 16.5C16 14 17.5 12 20 12c2.5 0 4 1.8 4 3.5 0 3-4 4-4 7" stroke="#2d3436" strokeWidth="2.5" strokeLinecap="round"/><circle cx="20" cy="27" r="1.5" fill="#2d3436"/></svg>)} />
            <KatTile href="https://wa.me/4917624700519" farbe={F.mint} titel="Hilfe" sub="Schreib direkt Anna" icon={(<svg width="32" height="32" viewBox="0 0 40 40"><circle cx="20" cy="20" r="14" stroke="white" strokeWidth="2" fill="none"/><path d="M14 18c2 2 4 4 8 4M14 14h12M14 22h8" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>)} />
          </div>
        </div>
      </section>

      {/* ====== SECTION 3: BIBLIOTHEK (Mathe + Physik kombiniert mit Filter) ====== */}
      <section id="bibliothek" style={{ background: F.bgSky, padding: mobil ? '70px 22px' : '110px 60px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: mobil ? '28px' : '40px' }}>
            <span style={{ display: 'inline-block', fontSize: '12.5px', color: F.skyDeep, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: '12px' }}>2. Die Bibliothek</span>
            <h2 style={{ fontFamily: SERIF, fontSize: mobil ? '36px' : '50px', fontWeight: 600, color: F.ink, margin: '0 0 12px', letterSpacing: '-0.02em' }}>
              Alle Lernpakete an einem Ort.
            </h2>
            <p style={{ fontSize: '15px', color: F.inkSoft, margin: 0 }}>{produkte.length} Pakete · ab 0,99 € · sofort verfügbar</p>
          </div>

          {/* FILTER TABS */}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: mobil ? '28px' : '40px', flexWrap: 'wrap' }}>
            {([
              { id: 'alle' as const, t: 'Alle', n: produkte.length },
              { id: 'mathe' as const, t: 'Mathematik', n: mathe.length },
              { id: 'physik' as const, t: 'Physik', n: physik.length },
            ]).map((tab) => (
              <button key={tab.id} onClick={() => setFilter(tab.id)} style={{ background: filter === tab.id ? F.ink : F.white, color: filter === tab.id ? F.white : F.ink, border: `1.5px solid ${filter === tab.id ? F.ink : F.border}`, padding: '12px 22px', borderRadius: '999px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: SANS, display: 'inline-flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s ease' }}>
                {tab.t}
                <span style={{ background: filter === tab.id ? 'rgba(255,255,255,0.18)' : F.bgCream, color: filter === tab.id ? F.white : F.inkMuted, fontSize: '12px', fontWeight: 700, padding: '2px 8px', borderRadius: '999px' }}>{tab.n}</span>
              </button>
            ))}
          </div>

          {/* GRID */}
          <div style={{ display: 'grid', gridTemplateColumns: mobil ? '1fr 1fr' : 'repeat(auto-fill, minmax(220px, 1fr))', gap: mobil ? '14px' : '22px' }}>
            {angezeigt.map((p) => (<ProduktKarte key={p.id} p={p} onClick={() => setAusgewaehlt(p)} mobil={mobil} />))}
          </div>
        </div>
      </section>

      {/* ====== SECTION 5: LERNHELD ====== */}
      <section style={{ background: F.bgPeach, padding: mobil ? '70px 22px' : '120px 60px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: mobil ? '1fr' : '1.1fr 1fr', gap: mobil ? '40px' : '70px', alignItems: 'center' }}>
            <div>
              <span style={{ display: 'inline-block', fontSize: '12.5px', color: F.coral, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: '14px' }}>3. Premium · 1,99 €</span>
              <h2 style={{ fontFamily: SERIF, fontSize: mobil ? '40px' : '64px', fontWeight: 600, color: F.ink, margin: '0 0 22px', lineHeight: 1.0, letterSpacing: '-0.02em' }}>
                Dein eigener<br /><span style={{ fontStyle: 'italic', color: F.coral }}>Lernheld</span>-Plan.
              </h2>
              <p style={{ fontSize: mobil ? '16px' : '18px', color: F.inkSoft, lineHeight: 1.6, margin: '0 0 32px', maxWidth: '480px' }}>
                Foto vom Stoff hochladen, Klasse wählen, fertig. Du bekommst einen kompletten Lernplan für die nächste Schulaufgabe — mit Erklärungen, Übungen und Lösungen.
              </p>
              <a href="/lernheld" className="btn-primary" style={{ background: F.coral, color: F.white, textDecoration: 'none', padding: '16px 32px', borderRadius: '999px', fontSize: '15px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
                Plan jetzt erstellen →
              </a>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { n: '01', farbe: F.sun, t: 'Fotos hochladen', d: 'Stoffliste, Buchseiten, Übungen' },
                { n: '02', farbe: F.mint, t: 'Klasse & Datum wählen', d: 'Wann ist die Schulaufgabe?' },
                { n: '03', farbe: F.coral, t: 'Dein Plan ist fertig', d: 'Erklärungen + Übungen + Lösungen' },
              ].map((s) => (
                <div key={s.n} style={{ background: F.white, borderRadius: '16px', padding: '20px 22px', display: 'flex', gap: '18px', alignItems: 'center', boxShadow: '0 6px 20px rgba(45,52,54,0.05)' }}>
                  <div style={{ background: s.farbe, color: s.farbe === F.sun ? F.ink : F.white, width: '50px', height: '50px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SERIF, fontSize: '22px', fontWeight: 700, fontStyle: 'italic', flexShrink: 0 }}>{s.n}</div>
                  <div>
                    <p style={{ fontFamily: SERIF, fontSize: '20px', fontWeight: 600, color: F.ink, margin: '0 0 2px', letterSpacing: '-0.01em' }}>{s.t}</p>
                    <p style={{ fontSize: '13.5px', color: F.inkMuted, margin: 0 }}>{s.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ====== SECTION 6: QUIZ ====== */}
      <section style={{ background: F.bg, padding: mobil ? '70px 22px' : '120px 60px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ background: F.bgMint, borderRadius: '28px', padding: mobil ? '40px 28px' : '70px 60px', textAlign: 'center' }}>
            <span style={{ display: 'inline-block', background: F.white, color: F.mintDeep, padding: '8px 18px', borderRadius: '999px', fontSize: '12.5px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '20px' }}>
              4. Kostenlos
            </span>
            <h2 style={{ fontFamily: SERIF, fontSize: mobil ? '40px' : '56px', fontWeight: 600, color: F.ink, margin: '0 0 18px', lineHeight: 1.0, letterSpacing: '-0.02em' }}>
              Teste dein <span style={{ fontStyle: 'italic', color: F.mintDeep }}>Wissen</span>.
            </h2>
            <p style={{ fontSize: mobil ? '16px' : '18px', color: F.inkSoft, lineHeight: 1.55, margin: '0 auto 32px', maxWidth: '520px' }}>
              61 Themen für Klasse 1 bis 13. Wähle Fach und Klasse — jede Runde neue Fragen.
            </p>
            <a href="/quiz" style={{ background: F.ink, color: F.white, textDecoration: 'none', padding: '16px 34px', borderRadius: '999px', fontSize: '15px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
              Zum Quiz →
            </a>
          </div>
        </div>
      </section>

      {/* ====== FOOTER ====== */}
      <footer style={{ background: F.dark, color: F.white, padding: mobil ? '60px 22px 30px' : '80px 60px 40px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: mobil ? '1fr' : '2fr 1fr 1fr 1fr', gap: '40px', marginBottom: '50px' }}>
            <div>
              <span style={{ fontFamily: SERIF, fontSize: '34px', fontWeight: 700, color: F.white, letterSpacing: '-0.02em', display: 'block', marginBottom: '14px' }}>
                Lern<span style={{ color: F.coral }}>flix</span>
              </span>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.6, margin: 0, maxWidth: '320px' }}>
                Deine Lern-Bibliothek für Mathematik und Physik. Klasse 1 bis 13.
              </p>
            </div>
            <div>
              <p style={{ fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: F.coral, fontWeight: 700, margin: '0 0 18px' }}>Lernen</p>
              <a href="#mathe" style={{ display: 'block', color: 'rgba(255,255,255,0.80)', textDecoration: 'none', fontSize: '14px', marginBottom: '10px' }}>Mathematik</a>
              <a href="#physik" style={{ display: 'block', color: 'rgba(255,255,255,0.80)', textDecoration: 'none', fontSize: '14px', marginBottom: '10px' }}>Physik</a>
              <a href="/lernheld" style={{ display: 'block', color: 'rgba(255,255,255,0.80)', textDecoration: 'none', fontSize: '14px', marginBottom: '10px' }}>Lernheld</a>
              <a href="/quiz" style={{ display: 'block', color: 'rgba(255,255,255,0.80)', textDecoration: 'none', fontSize: '14px', marginBottom: '10px' }}>Quiz</a>
            </div>
            <div>
              <p style={{ fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: F.coral, fontWeight: 700, margin: '0 0 18px' }}>Rechtliches</p>
              <a href="/impressum" style={{ display: 'block', color: 'rgba(255,255,255,0.80)', textDecoration: 'none', fontSize: '14px', marginBottom: '10px' }}>Impressum</a>
              <a href="/datenschutz" style={{ display: 'block', color: 'rgba(255,255,255,0.80)', textDecoration: 'none', fontSize: '14px', marginBottom: '10px' }}>Datenschutz</a>
              <a href="/agb" style={{ display: 'block', color: 'rgba(255,255,255,0.80)', textDecoration: 'none', fontSize: '14px', marginBottom: '10px' }}>AGB</a>
            </div>
            <div>
              <p style={{ fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: F.coral, fontWeight: 700, margin: '0 0 18px' }}>Kontakt</p>
              <a href="https://wa.me/4917624700519" style={{ display: 'block', color: 'rgba(255,255,255,0.80)', textDecoration: 'none', fontSize: '14px', marginBottom: '10px' }}>WhatsApp</a>
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

function BuchstapelBild({ size }: { size: number }) {
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 440 440" style={{ overflow: 'visible' }}>
        <defs>
          <radialGradient id="bgGlow" cx="50%" cy="55%" r="50%">
            <stop offset="0%" stopColor="#ffe8d6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#ffe8d6" stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* Soft background */}
        <circle cx="220" cy="240" r="200" fill="url(#bgGlow)" />

        {/* Floating math symbols */}
        <text x="60" y="110" fontFamily="Cormorant Garamond, Georgia, serif" fontSize="46" fill="#ff6b6b" opacity="0.4" fontStyle="italic">π</text>
        <text x="350" y="130" fontFamily="Cormorant Garamond, Georgia, serif" fontSize="40" fill="#4ecdc4" opacity="0.45" fontStyle="italic">√</text>
        <text x="370" y="320" fontFamily="Cormorant Garamond, Georgia, serif" fontSize="44" fill="#a18ee0" opacity="0.4" fontStyle="italic">x²</text>
        <text x="40" y="340" fontFamily="Cormorant Garamond, Georgia, serif" fontSize="42" fill="#ffd166" opacity="0.55" fontStyle="italic">∑</text>

        {/* Tisch-Schatten */}
        <ellipse cx="220" cy="408" rx="160" ry="14" fill="#2d3436" opacity="0.10" />

        {/* Buchstapel — von unten nach oben */}
        {/* Buch 1 (unten, sky-blue) */}
        <g transform="translate(70, 330)">
          <rect x="0" y="0" width="300" height="46" rx="4" fill="#5cabd6" />
          <rect x="0" y="0" width="300" height="6" rx="4" fill="#4691bc" />
          <rect x="6" y="14" width="60" height="4" rx="2" fill="rgba(255,255,255,0.5)" />
          <rect x="6" y="24" width="100" height="4" rx="2" fill="rgba(255,255,255,0.5)" />
          <text x="240" y="32" fontFamily="Cormorant Garamond, Georgia, serif" fontSize="22" fontStyle="italic" fontWeight="700" fill="rgba(255,255,255,0.85)">M</text>
        </g>
        {/* Buch 2 (lavender) */}
        <g transform="translate(60, 282) rotate(-2)">
          <rect x="0" y="0" width="290" height="50" rx="4" fill="#a18ee0" />
          <rect x="0" y="0" width="290" height="6" rx="4" fill="#876fc4" />
          <rect x="8" y="16" width="80" height="4" rx="2" fill="rgba(255,255,255,0.6)" />
          <rect x="8" y="28" width="110" height="4" rx="2" fill="rgba(255,255,255,0.5)" />
          <text x="225" y="34" fontFamily="Cormorant Garamond, Georgia, serif" fontSize="22" fontStyle="italic" fontWeight="700" fill="rgba(255,255,255,0.85)">P</text>
        </g>
        {/* Buch 3 (coral) */}
        <g transform="translate(80, 232) rotate(2)">
          <rect x="0" y="0" width="280" height="48" rx="4" fill="#ff6b6b" />
          <rect x="0" y="0" width="280" height="6" rx="4" fill="#e55454" />
          <rect x="8" y="16" width="70" height="4" rx="2" fill="rgba(255,255,255,0.65)" />
          <rect x="8" y="26" width="100" height="4" rx="2" fill="rgba(255,255,255,0.5)" />
          <text x="220" y="32" fontFamily="Cormorant Garamond, Georgia, serif" fontSize="20" fontStyle="italic" fontWeight="700" fill="rgba(255,255,255,0.92)">¾</text>
        </g>
        {/* Buch 4 (mint) — vertikal stehend */}
        <g transform="translate(110, 80)">
          <rect x="0" y="0" width="130" height="160" rx="6" fill="#4ecdc4" />
          <rect x="0" y="0" width="14" height="160" fill="#3aada4" />
          <text x="72" y="50" fontFamily="Cormorant Garamond, Georgia, serif" fontSize="22" fontWeight="700" fill="#ffffff" textAnchor="middle">Mathe</text>
          <text x="72" y="74" fontFamily="Cormorant Garamond, Georgia, serif" fontSize="14" fill="rgba(255,255,255,0.75)" textAnchor="middle">Klasse 6–9</text>
          {/* Dreieck-icon */}
          <polygon points="50,100 94,100 72,120" fill="rgba(255,255,255,0.92)" />
          <rect x="6" y="146" width="118" height="8" rx="2" fill="rgba(255,255,255,0.25)" />
        </g>
        {/* Buch 5 (sun yellow) — lehnt sich an */}
        <g transform="translate(252, 85) rotate(6)">
          <rect x="0" y="0" width="120" height="150" rx="6" fill="#ffd166" />
          <rect x="0" y="0" width="120" height="14" fill="#e8b94e" />
          <text x="60" y="50" fontFamily="Cormorant Garamond, Georgia, serif" fontSize="20" fontWeight="700" fill="#2d3436" textAnchor="middle">Physik</text>
          <text x="60" y="72" fontFamily="Cormorant Garamond, Georgia, serif" fontSize="13" fill="#5a5045" textAnchor="middle">Klasse 8–10</text>
          {/* Atom-icon */}
          <circle cx="60" cy="102" r="5" fill="#2d3436" />
          <ellipse cx="60" cy="102" rx="22" ry="8" fill="none" stroke="#2d3436" strokeWidth="1.5" />
          <ellipse cx="60" cy="102" rx="22" ry="8" fill="none" stroke="#2d3436" strokeWidth="1.5" transform="rotate(60 60 102)" />
          <ellipse cx="60" cy="102" rx="22" ry="8" fill="none" stroke="#2d3436" strokeWidth="1.5" transform="rotate(-60 60 102)" />
          <rect x="6" y="134" width="108" height="8" rx="2" fill="rgba(45,52,54,0.2)" />
        </g>

        {/* Lesezeichen auf dem mint Buch */}
        <rect x="220" y="80" width="14" height="44" fill="#ff6b6b" />
        <polygon points="220,124 234,124 227,134" fill="#ff6b6b" />

        {/* Apfel als Akzent oben drauf */}
        <g transform="translate(180, 50)">
          <circle cx="20" cy="20" r="18" fill="#ff6b6b" />
          <ellipse cx="14" cy="14" rx="5" ry="4" fill="rgba(255,255,255,0.5)" />
          <rect x="19" y="0" width="2" height="6" fill="#2d3436" />
          <ellipse cx="24" cy="3" rx="6" ry="3" fill="#4ecdc4" transform="rotate(20 24 3)" />
        </g>
      </svg>
    </div>
  );
}

function KatTile({ href, farbe, titel, sub, icon, titelDark }: { href: string; farbe: string; titel: string; sub: string; icon: React.ReactNode; titelDark?: boolean }) {
  return (
    <a href={href} className="kat" style={{ background: farbe, color: titelDark ? F.ink : F.white, borderRadius: '20px', padding: '28px 24px', textDecoration: 'none', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '170px', boxShadow: '0 8px 24px rgba(45,52,54,0.10)' }}>
      <div style={{ marginBottom: '20px' }}>{icon}</div>
      <div>
        <h3 style={{ fontFamily: SERIF, fontSize: '24px', fontWeight: 700, margin: '0 0 6px', letterSpacing: '-0.01em' }}>{titel}</h3>
        <p style={{ fontSize: '13.5px', margin: 0, opacity: titelDark ? 0.65 : 0.88 }}>{sub}</p>
      </div>
    </a>
  );
}

function ProduktKarte({ p, onClick, mobil }: { p: Produkt; onClick: () => void; mobil: boolean }) {
  const t = (p.slug && THEMA[p.slug]) || { bg: F.sky, render: () => null };
  return (
    <div onClick={onClick} className="karte" style={{ background: F.white, borderRadius: '20px', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 4px 14px rgba(45,52,54,0.06)' }}>
      <div style={{ background: t.bg, height: mobil ? '100px' : '130px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        {t.render()}
      </div>
      <div style={{ padding: mobil ? '16px 18px 18px' : '20px 22px 22px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h3 style={{ fontFamily: SERIF, fontSize: mobil ? '19px' : '22px', fontWeight: 700, margin: '0 0 14px', color: F.ink, letterSpacing: '-0.01em', lineHeight: 1.15 }}>{p.titel}</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '12px', borderTop: `1px solid ${F.border}` }}>
          <span style={{ fontFamily: SERIF, fontSize: '20px', fontWeight: 700, color: F.ink, letterSpacing: '-0.01em' }}>{p.preis.toFixed(2).replace('.', ',')} €</span>
          <span style={{ fontSize: '13px', color: F.coral, fontWeight: 700 }}>Ansehen →</span>
        </div>
      </div>
    </div>
  );
}
