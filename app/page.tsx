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

const FARBEN = {
  cream: '#0a0a14',
  creamDeep: '#13131f',
  ink: '#ffffff',
  inkSoft: 'rgba(255,255,255,0.78)',
  inkMuted: 'rgba(255,255,255,0.55)',
  white: '#ffffff',
  border: 'rgba(255,255,255,0.10)',
  forest: '#1a1a2e',
  forestDeep: '#0d0d18',
  gold: '#ff3d77',
  goldDeep: '#cc2e5f',
  blush: 'rgba(255, 61, 119, 0.15)',
  sky: '#3da9ff',
  coral: '#ff3d77',
  mint: '#3ad29f',
  sun: '#ffc94c',
  glassBg: 'rgba(255,255,255,0.05)',
  glassBorder: 'rgba(255,255,255,0.12)',
  glow: 'rgba(255, 61, 119, 0.35)',
};

const SERIF = '"Cormorant Garamond", "Playfair Display", Georgia, "Times New Roman", serif';
const SANS = '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
const SCRIPT = '"Caveat", "Comic Sans MS", cursive';

export default function Home() {
  const [ausgewaehlt, setAusgewaehlt] = useState<Produkt | null>(null);
  const [breite, setBreite] = useState(1200);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleResize = () => setBreite(window.innerWidth);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);
    handleResize();
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const mobil = breite < 768;

  const kaufen = async (produkt: Produkt) => {
    if (produkt.slug) {
      window.location.href = `/materialien/${produkt.slug}`;
      return;
    }
    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productName: produkt.titel, price: produkt.preis }),
    });
    const data = await response.json();
    if (data.url) window.location.href = data.url;
  };

  const produkte: Produkt[] = [
    { id: 1, slug: 'geometrie', kategorie: 'mathe', typ: 'Lernpaket', titel: 'Geometrie Klasse 6–9', beschreibung: 'Alle Geometrie-Themen — Dreiecke, Vierecke, Kreis, Körper. Mit beschrifteten Figuren und durchgerechneten Beispielen.', details: ['13 Sektionen mit SVG-Skizzen', 'Pythagoras + Höhensatz + Kathetensatz', 'Komplette Trigonometrie', 'Alle Vierecke & Körper', 'Strahlensätze & Ähnlichkeit', 'Schnellübersicht am Ende'], seiten: 'HTML', preis: 1.99, vorschau: '/geometrie-vorschau.jpeg' },
    { id: 2, slug: 'brueche', kategorie: 'mathe', typ: 'Lernpaket', titel: 'Brüche & Bruchrechnung', beschreibung: 'Brüche endlich verstehen — kürzen, erweitern, addieren, multiplizieren. Mit Beispielen aus dem Alltag.', details: ['Was ist ein Bruch?', 'Kürzen & Erweitern', 'Plus, Minus, Mal, Geteilt', 'Gemischte Brüche, Dezimalzahlen', 'Eselsbrücken', 'Übungen mit Lösungen'], seiten: 'HTML', preis: 1.99, vorschau: '/geometrie-vorschau.jpeg' },
    { id: 3, slug: 'prozent', kategorie: 'mathe', typ: 'Lernpaket', titel: 'Prozent & Zinsen', beschreibung: 'Rabatte verstehen, Mehrwertsteuer rechnen, Zinsen und Zinseszins — alles mit einfachen Tricks erklärt.', details: ['Die Grundformel der Prozentrechnung', '3 klassische Aufgabentypen', 'Aufschlag & Rabatt', 'Zinsrechnung & Zinseszins', 'Promille und ppm', 'Übungen mit Lösungen'], seiten: 'HTML', preis: 0.99, vorschau: '/geometrie-vorschau.jpeg' },
    { id: 4, slug: 'gleichungen', kategorie: 'mathe', typ: 'Lernpaket', titel: 'Gleichungen & Terme', beschreibung: 'Vom einfachen x = 5 bis zur pq-Formel — Gleichungen lösen Schritt für Schritt.', details: ['Terme vereinfachen', 'Lineare Gleichungen', 'Gleichungssysteme (3 Methoden)', 'Quadratische Gleichungen', 'pq-Formel & Mitternachtsformel', 'Ungleichungen'], seiten: 'HTML', preis: 1.99, vorschau: '/geometrie-vorschau.jpeg' },
    { id: 5, slug: 'funktionen', kategorie: 'mathe', typ: 'Lernpaket', titel: 'Funktionen', beschreibung: 'Geraden, Parabeln, Hyperbeln, Wurzeln — alle Funktionstypen mit Skizzen und Beispielen.', details: ['Lineare Funktionen', 'Quadratische Funktionen', 'pq-Formel anwenden', 'Schnittpunkte, Steigung, Scheitel', 'Spezielle Funktionen', 'Symmetrie und Monotonie'], seiten: 'HTML', preis: 1.99, vorschau: '/geometrie-vorschau.jpeg' },
    { id: 6, slug: 'stochastik', kategorie: 'mathe', typ: 'Lernpaket', titel: 'Wahrscheinlichkeit & Statistik', beschreibung: 'Würfel, Münze, Karten und Mittelwert — Wahrscheinlichkeit verstehen mit Baumdiagrammen.', details: ['Grundlagen der Wahrscheinlichkeit', 'Mehrstufige Versuche & Baumdiagramme', 'Mit und ohne Zurücklegen', 'Kombinatorik & Anordnungen', 'Statistik: Mittelwert, Median', 'Binomialverteilung'], seiten: 'HTML', preis: 0.99, vorschau: '/geometrie-vorschau.jpeg' },
    { id: 7, slug: 'trigonometrie', kategorie: 'mathe', typ: 'Lernpaket', titel: 'Trigonometrie', beschreibung: 'sin, cos, tan kein Geheimnis mehr — mit Eselsbrücken und durchgerechneten Beispielen.', details: ['Sinus, Kosinus, Tangens', 'Eselsbrücke GAGA HUDI', 'Sinussatz & Kosinussatz', 'Wertetabelle wichtiger Winkel', 'Trigonometrische Funktionen', 'Bogenmaß und Grad'], seiten: 'HTML', preis: 0.99, vorschau: '/geometrie-vorschau.jpeg' },
    { id: 8, slug: 'potenzen', kategorie: 'mathe', typ: 'Lernpaket', titel: 'Potenzen', beschreibung: 'Die fünf Potenzgesetze leicht erklärt — mit Beispielen, Übungen und Tipps.', details: ['Alle 5 Potenzgesetze', 'Negative & gebrochene Exponenten', 'Wurzeln und Wurzelgesetze', 'Wissenschaftliche Schreibweise', 'Wachstum und Zerfall', 'Logarithmen'], seiten: 'HTML', preis: 0.99, vorschau: '/potenzen-vorschau.jpeg' },
    { id: 9, slug: 'mechanik', kategorie: 'physik', typ: 'Lernpaket', titel: 'Mechanik', beschreibung: 'Alle Mechanik-Themen — Geschwindigkeit, Kraft, Energie, Hebel, Reibung mit Skizzen.', details: ['Bewegung & freier Fall', 'Newton-Gesetze', 'Schiefe Ebene', 'Energie, Arbeit, Leistung', 'Hebel & Flaschenzug', 'Dichte, Druck, Auftrieb'], seiten: 'HTML', preis: 0.99, vorschau: '/mechanik-vorschau.jpeg' },
    { id: 10, slug: 'elektrizitaet', kategorie: 'physik', typ: 'Lernpaket', titel: 'Elektrizität & Stromkreise', beschreibung: 'Ohm, Spannung, Stromstärke — Elektrizität kapieren und die Stromrechnung verstehen.', details: ['Ohm´sches Gesetz', 'Reihen- und Parallelschaltung', 'Elektrische Arbeit & Leistung', 'Spezifischer Widerstand', 'Gefahren des Stroms', 'Übungen mit Lösungen'], seiten: 'HTML', preis: 1.99, vorschau: '/mechanik-vorschau.jpeg' },
    { id: 11, slug: 'optik', kategorie: 'physik', typ: 'Lernpaket', titel: 'Optik & Wellen', beschreibung: 'Licht, Spiegel, Linsen, Regenbogen — alles zum Thema Sehen, Brechen und Strahlen.', details: ['Lichtausbreitung & Schatten', 'Reflexion am Spiegel', 'Lichtbrechung & Snellius', 'Linsen und Linsenformel', 'Spektrum und Farben', 'Wellen und Welleneigenschaften'], seiten: 'HTML', preis: 0.99, vorschau: '/mechanik-vorschau.jpeg' },
    { id: 12, slug: 'waerme', kategorie: 'physik', typ: 'Lernpaket', titel: 'Wärmelehre', beschreibung: 'Temperatur, Wärme, Aggregatzustände, Gase — alles über das Zappeln der Atome.', details: ['Temperatur und Skalen', 'Wärmekapazität', 'Aggregatzustände & Phasenübergänge', 'Wärmeübertragung', 'Längenausdehnung', 'Gasgesetze'], seiten: 'HTML', preis: 0.99, vorschau: '/mechanik-vorschau.jpeg' },
    { id: 13, slug: 'atomphysik', kategorie: 'physik', typ: 'Lernpaket', titel: 'Atomphysik & Strahlung', beschreibung: 'Atome, Isotope, Radioaktivität, Kernspaltung — die kleinen Bausteine der Welt einfach erklärt.', details: ['Atomaufbau & Isotope', 'Periodensystem', 'α-, β-, γ-Strahlung', 'Halbwertszeit', 'Kernspaltung & Kernfusion', 'Quantenphysik im Überblick'], seiten: 'HTML', preis: 0.99, vorschau: '/mechanik-vorschau.jpeg' },
  ];

  const mathe = produkte.filter((p) => p.kategorie === 'mathe');
  const physik = produkte.filter((p) => p.kategorie === 'physik');

  return (
    <main style={{ minHeight: '100vh', background: FARBEN.cream, fontFamily: SANS, color: FARBEN.ink, overflowX: 'hidden' }}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=Caveat:wght@500;700&display=swap" />

      <style>{`
        @keyframes schweben { 0%,100% { transform: translateY(0) rotate(-2deg); } 50% { transform: translateY(-10px) rotate(2deg); } }
        @keyframes wackeln { 0%,100% { transform: rotate(-3deg); } 50% { transform: rotate(3deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .anim-fadein { animation: fadeIn 0.8s ease-out forwards; }
        .karte-hover { transition: all 0.35s cubic-bezier(0.2, 0.8, 0.2, 1); }
        .karte-hover:hover { transform: translateY(-6px); box-shadow: 0 24px 60px rgba(31, 28, 25, 0.12); }
        .pfeil-hover { transition: transform 0.3s ease; }
        .karte-hover:hover .pfeil-hover { transform: translateX(6px); }
        .btn-haupt { transition: all 0.25s ease; }
        .btn-haupt:hover { transform: translateY(-2px); box-shadow: 0 14px 30px rgba(45, 95, 93, 0.35); }
        .btn-rand { transition: all 0.25s ease; }
        .btn-rand:hover { background: ${FARBEN.ink}; color: ${FARBEN.cream}; }
      `}</style>

      {ausgewaehlt && (
        <div onClick={() => setAusgewaehlt(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: '#13131f', border: '1px solid rgba(255,255,255,0.10)', borderRadius: '20px', maxWidth: '560px', width: '100%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 30px 80px rgba(0,0,0,0.5)' }}>
            <div style={{ padding: mobil ? '28px 24px' : '40px 44px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px' }}>
                <div>
                  <span style={{ fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: FARBEN.coral, fontWeight: 700 }}>{ausgewaehlt.typ}</span>
                  <h2 style={{ fontFamily: SERIF, fontSize: mobil ? '28px' : '34px', fontWeight: 600, margin: '8px 0 4px', color: '#ffffff', lineHeight: 1.1 }}>{ausgewaehlt.titel}</h2>
                </div>
                <button onClick={() => setAusgewaehlt(null)} style={{ background: 'rgba(255,255,255,0.06)', border: 'none', width: '36px', height: '36px', borderRadius: '50%', fontSize: '18px', cursor: 'pointer', color: '#ffffff', flexShrink: 0 }}>✕</button>
              </div>
              <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, margin: '0 0 24px' }}>{ausgewaehlt.beschreibung}</p>
              <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '20px 22px', marginBottom: '28px' }}>
                <p style={{ fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', color: FARBEN.coral, fontWeight: 700, margin: '0 0 14px' }}>Was drin ist</p>
                {ausgewaehlt.details.map((d, i) => (
                  <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <span style={{ color: FARBEN.coral, fontWeight: 700, fontSize: '15px', flexShrink: 0, marginTop: '1px' }}>✓</span>
                    <span style={{ fontSize: '14.5px', color: 'rgba(255,255,255,0.85)', lineHeight: 1.5 }}>{d}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.10)' }}>
                <div>
                  <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255,255,255,0.55)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Einmalig</p>
                  <p style={{ margin: '2px 0 0', fontFamily: SERIF, fontSize: '36px', fontWeight: 600, color: '#ffffff' }}>{ausgewaehlt.preis.toFixed(2).replace('.', ',')} €</p>
                </div>
                <button onClick={() => kaufen(ausgewaehlt)} className="btn-haupt" style={{ background: FARBEN.coral, color: '#ffffff', border: 'none', borderRadius: '999px', padding: '14px 30px', fontSize: '15px', fontWeight: 600, cursor: 'pointer', fontFamily: SANS, boxShadow: `0 14px 30px ${FARBEN.glow}` }}>
                  {ausgewaehlt.slug ? 'Jetzt freischalten' : 'Jetzt kaufen'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: scrolled ? 'rgba(10,10,20,0.85)' : 'transparent', backdropFilter: scrolled ? 'blur(20px)' : 'none', borderBottom: scrolled ? `1px solid ${FARBEN.border}` : 'none', padding: mobil ? '16px 22px' : '22px 60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all 0.3s ease' }}>
        <a href="#" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <span style={{ fontFamily: SERIF, fontSize: mobil ? '26px' : '32px', fontWeight: 700, color: FARBEN.white, letterSpacing: '-0.02em' }}>
            Lern<span style={{ color: FARBEN.coral }}>flix</span>
          </span>
        </a>
        <nav style={{ display: 'flex', gap: mobil ? '14px' : '34px', alignItems: 'center' }}>
          {!mobil && (
            <>
              <a href="#materialien" style={{ color: FARBEN.white, textDecoration: 'none', fontSize: '15px', fontWeight: 500, opacity: 0.85 }}>Materialien</a>
              <a href="/quiz" style={{ color: FARBEN.white, textDecoration: 'none', fontSize: '15px', fontWeight: 500, opacity: 0.85 }}>Quiz</a>
              <a href="#warum" style={{ color: FARBEN.white, textDecoration: 'none', fontSize: '15px', fontWeight: 500, opacity: 0.85 }}>Warum Lernflix</a>
            </>
          )}
          <a href="/lernheld" style={{ background: FARBEN.coral, color: FARBEN.white, textDecoration: 'none', fontSize: '14px', fontWeight: 600, padding: '11px 22px', borderRadius: '999px', boxShadow: `0 8px 30px ${FARBEN.glow}` }}>Lernheld starten</a>
        </nav>
      </header>

      {/* HERO — Dark Premium mit Schüler-Charakter */}
      <section style={{ paddingTop: mobil ? '120px' : '150px', paddingBottom: mobil ? '70px' : '110px', paddingLeft: mobil ? '24px' : '60px', paddingRight: mobil ? '24px' : '60px', position: 'relative', overflow: 'hidden' }}>
        {/* Glow Effekte im Hintergrund */}
        <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '60%', height: '80%', background: 'radial-gradient(circle, rgba(255,61,119,0.18) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '20%', right: '-15%', width: '60%', height: '80%', background: 'radial-gradient(circle, rgba(61,169,255,0.12) 0%, transparent 60%)', pointerEvents: 'none' }} />

        <div className="anim-fadein" style={{ maxWidth: '1240px', margin: '0 auto', display: 'grid', gridTemplateColumns: mobil ? '1fr' : '1.05fr 1fr', gap: mobil ? '40px' : '60px', alignItems: 'center', position: 'relative' }}>
          <div>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,61,119,0.12)', color: FARBEN.coral, padding: '8px 18px', borderRadius: '999px', fontSize: '12px', fontWeight: 700, letterSpacing: '0.14em', marginBottom: '28px', border: '1px solid rgba(255,61,119,0.25)' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: FARBEN.coral, boxShadow: `0 0 12px ${FARBEN.coral}` }} />
              DEINE LERN-BIBLIOTHEK
            </span>
            <h1 style={{ fontFamily: SERIF, fontSize: mobil ? '52px' : '90px', fontWeight: 600, lineHeight: 1.0, margin: '0 0 24px', color: FARBEN.white, letterSpacing: '-0.035em' }}>
              Lernen wie<br />
              <span style={{ fontStyle: 'italic', background: `linear-gradient(135deg, ${FARBEN.coral} 0%, #ff8aa9 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>streamen.</span>
            </h1>
            <p style={{ fontSize: mobil ? '17px' : '19px', color: FARBEN.inkSoft, lineHeight: 1.6, margin: '0 0 38px', maxWidth: '480px' }}>
              Mathe und Physik in einer Bibliothek, die du gerne öffnest. Schöne Lernpakete, persönliche Pläne und Quizzes für jede Klasse.
            </p>
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <a href="/lernheld" className="btn-haupt" style={{ background: FARBEN.coral, color: FARBEN.white, textDecoration: 'none', padding: '17px 32px', borderRadius: '999px', fontSize: '16px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '10px', boxShadow: `0 14px 40px ${FARBEN.glow}` }}>
                Lernheld starten <span style={{ fontSize: '18px' }}>→</span>
              </a>
              <a href="#materialien" className="btn-rand" style={{ background: 'rgba(255,255,255,0.06)', color: FARBEN.white, textDecoration: 'none', padding: '17px 32px', borderRadius: '999px', fontSize: '16px', fontWeight: 700, border: '1px solid rgba(255,255,255,0.18)', backdropFilter: 'blur(10px)' }}>
                Bibliothek ansehen
              </a>
            </div>
            <div style={{ display: 'flex', gap: '32px', marginTop: '50px', flexWrap: 'wrap' }}>
              <div>
                <p style={{ fontFamily: SERIF, fontSize: '34px', fontWeight: 700, color: FARBEN.white, margin: 0, lineHeight: 1 }}>13</p>
                <p style={{ fontSize: '12px', color: FARBEN.inkMuted, margin: '4px 0 0' }}>Lernpakete</p>
              </div>
              <div style={{ width: '1px', background: FARBEN.border }} />
              <div>
                <p style={{ fontFamily: SERIF, fontSize: '34px', fontWeight: 700, color: FARBEN.white, margin: 0, lineHeight: 1 }}>61</p>
                <p style={{ fontSize: '12px', color: FARBEN.inkMuted, margin: '4px 0 0' }}>Quiz-Themen</p>
              </div>
              <div style={{ width: '1px', background: FARBEN.border }} />
              <div>
                <p style={{ fontFamily: SERIF, fontSize: '34px', fontWeight: 700, color: FARBEN.white, margin: 0, lineHeight: 1 }}>1–13</p>
                <p style={{ fontSize: '12px', color: FARBEN.inkMuted, margin: '4px 0 0' }}>Klassen</p>
              </div>
            </div>
          </div>

          {/* HERO-CHARAKTER */}
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            <SchuelerCharakter size={mobil ? 320 : 460} />
          </div>
        </div>
      </section>

      {/* ANGEBOT (3 Säulen) */}
      <section style={{ padding: mobil ? '60px 20px' : '100px 60px', background: FARBEN.creamDeep }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <p style={{ fontSize: '12px', letterSpacing: '0.22em', textTransform: 'uppercase', color: FARBEN.forest, fontWeight: 700, margin: '0 0 12px' }}>So lerne ich mit dir</p>
            <h2 style={{ fontFamily: SERIF, fontSize: mobil ? '38px' : '54px', fontWeight: 500, color: FARBEN.ink, margin: 0, lineHeight: 1.05, letterSpacing: '-0.01em' }}>
              Drei Wege, <span style={{ fontStyle: 'italic', color: FARBEN.forest }}>besser zu werden.</span>
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: mobil ? '1fr' : 'repeat(3, 1fr)', gap: '24px' }}>
            <SaeuleKarte
              nummer="01"
              titel="Lernpakete"
              text="Schöne HTML-Hefte zu allen Schulthemen — mit Skizzen, Beispielen und kleinen Witzen."
              link="#materialien"
              linkText="Alle 13 Pakete ansehen"
            />
            <SaeuleKarte
              nummer="02"
              titel="Lernheld"
              text="Lade Fotos deines Stoffs hoch und bekomme deinen eigenen Lernplan zur Schulaufgabe."
              link="/lernheld"
              linkText="Lernheld starten"
              hervorgehoben
            />
            <SaeuleKarte
              nummer="03"
              titel="Quiz"
              text="Teste dein Wissen mit interaktiven Fragen zu deiner Klassenstufe — kostenlos und immer neu."
              link="/quiz"
              linkText="Zum Quiz"
            />
          </div>
        </div>
      </section>

      {/* MATERIALIEN */}
      <section id="materialien" style={{ padding: mobil ? '70px 20px' : '120px 60px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '50px', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <p style={{ fontSize: '12px', letterSpacing: '0.22em', textTransform: 'uppercase', color: FARBEN.forest, fontWeight: 700, margin: '0 0 12px' }}>Mathematik</p>
              <h2 style={{ fontFamily: SERIF, fontSize: mobil ? '38px' : '50px', fontWeight: 500, color: FARBEN.ink, margin: 0, lineHeight: 1.05, letterSpacing: '-0.01em' }}>
                Mathe-Lernpakete
              </h2>
            </div>
            <p style={{ fontSize: '14px', color: FARBEN.inkMuted, margin: 0 }}>{mathe.length} Themen · ab 0,99 €</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: mobil ? '1fr' : 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {mathe.map((p) => (<ProduktKarteEdel key={p.id} p={p} onClick={() => setAusgewaehlt(p)} />))}
          </div>
        </div>
      </section>

      <section style={{ padding: mobil ? '60px 20px 90px' : '60px 60px 130px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '50px', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <p style={{ fontSize: '12px', letterSpacing: '0.22em', textTransform: 'uppercase', color: FARBEN.forest, fontWeight: 700, margin: '0 0 12px' }}>Physik</p>
              <h2 style={{ fontFamily: SERIF, fontSize: mobil ? '38px' : '50px', fontWeight: 500, color: FARBEN.ink, margin: 0, lineHeight: 1.05, letterSpacing: '-0.01em' }}>
                Physik-Lernpakete
              </h2>
            </div>
            <p style={{ fontSize: '14px', color: FARBEN.inkMuted, margin: 0 }}>{physik.length} Themen · ab 0,99 €</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: mobil ? '1fr' : 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {physik.map((p) => (<ProduktKarteEdel key={p.id} p={p} onClick={() => setAusgewaehlt(p)} />))}
          </div>
        </div>
      </section>

      {/* LERNHELD FEATURE */}
      <section style={{ padding: mobil ? '70px 20px' : '120px 60px', background: FARBEN.forest, color: FARBEN.cream, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '500px', height: '500px', borderRadius: '50%', background: 'rgba(201, 168, 92, 0.15)', filter: 'blur(80px)' }} />
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: mobil ? '1fr' : '1fr 1fr', gap: mobil ? '40px' : '80px', alignItems: 'center', position: 'relative' }}>
          <div>
            <p style={{ fontSize: '12px', letterSpacing: '0.22em', textTransform: 'uppercase', color: FARBEN.gold, fontWeight: 700, margin: '0 0 16px' }}>Premium · 1,99 €</p>
            <h2 style={{ fontFamily: SERIF, fontSize: mobil ? '42px' : '60px', fontWeight: 500, margin: '0 0 20px', lineHeight: 1.05, letterSpacing: '-0.01em' }}>
              Dein eigener <span style={{ fontStyle: 'italic', color: FARBEN.gold }}>Lernheld</span>-Plan.
            </h2>
            <p style={{ fontSize: '16px', lineHeight: 1.7, margin: '0 0 30px', opacity: 0.9, maxWidth: '480px' }}>
              Foto vom Schulbuch hochladen — Schritt für Schritt bekommst du einen vollständigen Lernplan zur Schulaufgabe. Mit Erklärungen, Formeln, Beispielen und Übungen. Plus persönlicher Hilfe per Chat, wenn du nicht weiterkommst.
            </p>
            <a href="/lernheld" className="btn-haupt" style={{ background: FARBEN.cream, color: FARBEN.forest, textDecoration: 'none', padding: '16px 32px', borderRadius: '999px', fontSize: '15px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
              Jetzt Plan erstellen
              <span style={{ fontSize: '18px' }}>→</span>
            </a>
          </div>
          <LernheldIllustration />
        </div>
      </section>

      {/* WARUM LERNFLIX — 3 Bulletpoints */}
      <section id="warum" style={{ padding: mobil ? '60px 20px' : '90px 60px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: SERIF, fontSize: mobil ? '36px' : '50px', fontWeight: 600, color: FARBEN.ink, margin: '0 0 50px', textAlign: 'center', letterSpacing: '-0.02em' }}>
            Warum <span style={{ fontStyle: 'italic', color: FARBEN.coral }}>Lernflix</span>?
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: mobil ? '1fr' : 'repeat(3, 1fr)', gap: '20px' }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <span style={{ background: FARBEN.sun, color: FARBEN.ink, width: '42px', height: '42px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 800, flexShrink: 0 }}>✦</span>
              <div>
                <h3 style={{ fontFamily: SERIF, fontSize: '20px', fontWeight: 700, margin: '6px 0 6px', color: FARBEN.ink }}>Bibliothek statt Buch</h3>
                <p style={{ fontSize: '15px', color: FARBEN.inkSoft, margin: 0, lineHeight: 1.55 }}>Alle Themen schön gegliedert — du wählst, was du brauchst.</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <span style={{ background: FARBEN.coral, color: FARBEN.white, width: '42px', height: '42px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 800, flexShrink: 0 }}>♥</span>
              <div>
                <h3 style={{ fontFamily: SERIF, fontSize: '20px', fontWeight: 700, margin: '6px 0 6px', color: FARBEN.ink }}>Für deine Klasse</h3>
                <p style={{ fontSize: '15px', color: FARBEN.inkSoft, margin: 0, lineHeight: 1.55 }}>Quiz und Pläne passend zu deiner Klassenstufe — nicht zu schwer, nicht zu leicht.</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <span style={{ background: FARBEN.mint, color: FARBEN.ink, width: '42px', height: '42px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 800, flexShrink: 0 }}>★</span>
              <div>
                <h3 style={{ fontFamily: SERIF, fontSize: '20px', fontWeight: 700, margin: '6px 0 6px', color: FARBEN.ink }}>Ohne Stress</h3>
                <p style={{ fontSize: '15px', color: FARBEN.inkSoft, margin: 0, lineHeight: 1.55 }}>Mit Witzen, Beispielen und Eselsbrücken — Lernen darf Spaß machen.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: FARBEN.ink, color: FARBEN.white, padding: mobil ? '60px 20px 30px' : '80px 60px 40px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: mobil ? '1fr' : '2fr 1fr 1fr 1fr', gap: '40px', marginBottom: '50px' }}>
            <div>
              <p style={{ fontFamily: SERIF, fontSize: '32px', fontWeight: 700, color: FARBEN.white, margin: '0 0 14px', letterSpacing: '-0.02em' }}>
                Lern<span style={{ color: FARBEN.coral }}>flix</span>
              </p>
              <p style={{ fontSize: '14px', color: FARBEN.white, opacity: 0.7, lineHeight: 1.6, margin: 0, maxWidth: '320px' }}>
                Deine Lern-Bibliothek für Mathe und Physik. Klar, warm und ohne Stress.
              </p>
            </div>
            <div>
              <p style={{ fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', color: FARBEN.gold, fontWeight: 700, margin: '0 0 16px' }}>Lernen</p>
              <a href="#materialien" style={{ display: 'block', color: FARBEN.cream, opacity: 0.85, textDecoration: 'none', fontSize: '14px', marginBottom: '10px' }}>Materialien</a>
              <a href="/lernheld" style={{ display: 'block', color: FARBEN.cream, opacity: 0.85, textDecoration: 'none', fontSize: '14px', marginBottom: '10px' }}>Lernheld</a>
              <a href="/quiz" style={{ display: 'block', color: FARBEN.cream, opacity: 0.85, textDecoration: 'none', fontSize: '14px', marginBottom: '10px' }}>Quiz</a>
            </div>
            <div>
              <p style={{ fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', color: FARBEN.gold, fontWeight: 700, margin: '0 0 16px' }}>Rechtliches</p>
              <a href="/impressum" style={{ display: 'block', color: FARBEN.cream, opacity: 0.85, textDecoration: 'none', fontSize: '14px', marginBottom: '10px' }}>Impressum</a>
              <a href="/datenschutz" style={{ display: 'block', color: FARBEN.cream, opacity: 0.85, textDecoration: 'none', fontSize: '14px', marginBottom: '10px' }}>Datenschutz</a>
              <a href="/agb" style={{ display: 'block', color: FARBEN.cream, opacity: 0.85, textDecoration: 'none', fontSize: '14px', marginBottom: '10px' }}>AGB</a>
            </div>
            <div>
              <p style={{ fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', color: FARBEN.gold, fontWeight: 700, margin: '0 0 16px' }}>Kontakt</p>
              <a href="https://wa.me/4917624700519" style={{ display: 'block', color: FARBEN.cream, opacity: 0.85, textDecoration: 'none', fontSize: '14px', marginBottom: '10px' }}>WhatsApp</a>
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(250, 245, 239, 0.15)', paddingTop: '24px', textAlign: 'center', fontSize: '13px', color: FARBEN.creamDeep, opacity: 0.6 }}>
            © {new Date().getFullYear()} Lerne mit Anna — lernflix.lernemitanna.de
          </div>
        </div>
      </footer>
    </main>
  );
}

function SaeuleKarte({ nummer, titel, text, link, linkText, hervorgehoben }: { nummer: string; titel: string; text: string; link: string; linkText: string; hervorgehoben?: boolean }) {
  return (
    <a href={link} className="karte-hover" style={{ background: hervorgehoben ? FARBEN.ink : FARBEN.white, color: hervorgehoben ? FARBEN.cream : FARBEN.ink, padding: '36px 32px', borderRadius: '20px', textDecoration: 'none', display: 'block', boxShadow: '0 10px 30px rgba(31, 28, 25, 0.05)', border: hervorgehoben ? 'none' : `1px solid ${FARBEN.border}` }}>
      <p style={{ fontFamily: SERIF, fontSize: '40px', fontWeight: 400, color: hervorgehoben ? FARBEN.gold : FARBEN.forest, margin: '0 0 20px', fontStyle: 'italic', letterSpacing: '-0.02em' }}>{nummer}</p>
      <h3 style={{ fontFamily: SERIF, fontSize: '28px', fontWeight: 600, margin: '0 0 14px', letterSpacing: '-0.01em', color: hervorgehoben ? FARBEN.cream : FARBEN.ink }}>{titel}</h3>
      <p style={{ fontSize: '14.5px', lineHeight: 1.6, margin: '0 0 24px', opacity: hervorgehoben ? 0.85 : 1, color: hervorgehoben ? FARBEN.cream : FARBEN.inkSoft }}>{text}</p>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 600, color: hervorgehoben ? FARBEN.gold : FARBEN.forest }}>
        {linkText}
        <span className="pfeil-hover">→</span>
      </span>
    </a>
  );
}

const THEMA_SVGS: Record<string, { bg: string; render: () => React.ReactElement }> = {
  geometrie: { bg: '#5b9bd5', render: () => (<svg viewBox="0 0 120 80" width="100%" height="100%"><polygon points="20,65 100,65 60,15" fill="#ffffff" opacity="0.9"/><rect x="48" y="55" width="10" height="10" fill="none" stroke="#1c1a17" strokeWidth="1.5"/></svg>) },
  brueche: { bg: '#e89580', render: () => (<svg viewBox="0 0 120 80" width="100%" height="100%"><text x="60" y="40" fontSize="32" fontWeight="800" fill="#fff" textAnchor="middle" fontFamily="Georgia, serif">¾</text><line x1="35" y1="48" x2="85" y2="48" stroke="#fff" strokeWidth="2"/></svg>) },
  prozent: { bg: '#7fc4a4', render: () => (<svg viewBox="0 0 120 80" width="100%" height="100%"><text x="60" y="55" fontSize="48" fontWeight="800" fill="#fff" textAnchor="middle">%</text></svg>) },
  gleichungen: { bg: '#f5c45c', render: () => (<svg viewBox="0 0 120 80" width="100%" height="100%"><text x="60" y="52" fontSize="34" fontWeight="800" fill="#1c1a17" textAnchor="middle" fontFamily="Georgia, serif"><tspan fontStyle="italic">x</tspan> = ?</text></svg>) },
  funktionen: { bg: '#c47ab8', render: () => (<svg viewBox="0 0 120 80" width="100%" height="100%"><line x1="15" y1="40" x2="105" y2="40" stroke="#fff" strokeWidth="1.5" opacity="0.5"/><line x1="60" y1="10" x2="60" y2="70" stroke="#fff" strokeWidth="1.5" opacity="0.5"/><path d="M 20 65 Q 60 -10 100 65" fill="none" stroke="#fff" strokeWidth="3"/></svg>) },
  stochastik: { bg: '#5b9bd5', render: () => (<svg viewBox="0 0 120 80" width="100%" height="100%"><rect x="40" y="20" width="40" height="40" rx="6" fill="#fff"/><circle cx="52" cy="32" r="3" fill="#1c1a17"/><circle cx="68" cy="32" r="3" fill="#1c1a17"/><circle cx="52" cy="48" r="3" fill="#1c1a17"/><circle cx="68" cy="48" r="3" fill="#1c1a17"/></svg>) },
  trigonometrie: { bg: '#7fc4a4', render: () => (<svg viewBox="0 0 120 80" width="100%" height="100%"><polygon points="20,65 100,65 100,20" fill="#fff" opacity="0.9"/><rect x="88" y="53" width="12" height="12" fill="none" stroke="#1c1a17" strokeWidth="1.5"/><text x="35" y="60" fontSize="14" fontStyle="italic" fontWeight="700" fill="#1c1a17">α</text></svg>) },
  potenzen: { bg: '#c47ab8', render: () => (<svg viewBox="0 0 120 80" width="100%" height="100%"><text x="50" y="55" fontSize="42" fontWeight="800" fill="#fff" textAnchor="middle" fontFamily="Georgia, serif"><tspan fontStyle="italic">x</tspan></text><text x="78" y="32" fontSize="22" fontWeight="800" fill="#fff" fontFamily="Georgia, serif">2</text></svg>) },
  mechanik: { bg: '#e8b94e', render: () => (<svg viewBox="0 0 120 80" width="100%" height="100%"><circle cx="42" cy="50" r="14" fill="#fff"/><line x1="56" y1="50" x2="92" y2="50" stroke="#fff" strokeWidth="4"/><polygon points="88,44 100,50 88,56" fill="#fff"/></svg>) },
  elektrizitaet: { bg: '#f5c45c', render: () => (<svg viewBox="0 0 120 80" width="100%" height="100%"><polygon points="55,12 35,45 55,45 45,68 80,30 60,30 70,12" fill="#1c1a17"/></svg>) },
  optik: { bg: '#c47ab8', render: () => (<svg viewBox="0 0 120 80" width="100%" height="100%"><circle cx="60" cy="40" r="22" fill="#f5c45c"/><line x1="60" y1="8" x2="60" y2="14" stroke="#fff" strokeWidth="2"/><line x1="60" y1="66" x2="60" y2="72" stroke="#fff" strokeWidth="2"/><line x1="28" y1="40" x2="34" y2="40" stroke="#fff" strokeWidth="2"/><line x1="86" y1="40" x2="92" y2="40" stroke="#fff" strokeWidth="2"/><line x1="36" y1="16" x2="40" y2="20" stroke="#fff" strokeWidth="2"/><line x1="80" y1="60" x2="84" y2="64" stroke="#fff" strokeWidth="2"/></svg>) },
  waerme: { bg: '#e89580', render: () => (<svg viewBox="0 0 120 80" width="100%" height="100%"><rect x="55" y="12" width="10" height="40" rx="5" fill="#fff" stroke="#1c1a17" strokeWidth="1.5"/><rect x="55" y="32" width="10" height="20" fill="#1c1a17"/><circle cx="60" cy="60" r="11" fill="#1c1a17"/></svg>) },
  atomphysik: { bg: '#7fc4a4', render: () => (<svg viewBox="0 0 120 80" width="100%" height="100%"><circle cx="60" cy="40" r="6" fill="#fff"/><ellipse cx="60" cy="40" rx="30" ry="10" fill="none" stroke="#fff" strokeWidth="2"/><ellipse cx="60" cy="40" rx="30" ry="10" fill="none" stroke="#fff" strokeWidth="2" transform="rotate(60 60 40)"/><ellipse cx="60" cy="40" rx="30" ry="10" fill="none" stroke="#fff" strokeWidth="2" transform="rotate(-60 60 40)"/></svg>) },
};

function ProduktKarteEdel({ p, onClick }: { p: Produkt; onClick: () => void }) {
  const svg = (p.slug && THEMA_SVGS[p.slug]) || { bg: '#3da9ff', render: () => (<svg viewBox="0 0 120 80" width="100%" height="100%"><text x="60" y="50" fontSize="32" fontWeight="800" fill="#fff" textAnchor="middle" fontFamily="Georgia, serif">π</text></svg>) };
  return (
    <div onClick={onClick} className="karte-hover" style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '20px', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.10)', display: 'flex', flexDirection: 'column', overflow: 'hidden', backdropFilter: 'blur(10px)' }}>
      <div style={{ background: svg.bg, height: '130px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        {svg.render()}
      </div>
      <div style={{ padding: '20px 22px 22px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <p style={{ fontSize: '10.5px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', fontWeight: 700, margin: '0 0 8px' }}>{p.kategorie === 'mathe' ? 'Mathematik' : 'Physik'}</p>
        <h3 style={{ fontFamily: SERIF, fontSize: '20px', fontWeight: 700, margin: '0 0 16px', color: '#ffffff', letterSpacing: '-0.01em', lineHeight: 1.2 }}>{p.titel}</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.10)' }}>
          <span style={{ fontFamily: SERIF, fontSize: '20px', fontWeight: 700, color: '#ffffff' }}>{p.preis.toFixed(2).replace('.', ',')} €</span>
          <span style={{ fontSize: '13px', color: '#ff3d77', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            Ansehen <span className="pfeil-hover">→</span>
          </span>
        </div>
      </div>
    </div>
  );
}

function SchuelerCharakter({ size }: { size: number }) {
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 460 460" style={{ overflow: 'visible' }}>
        <defs>
          <radialGradient id="glow1" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff3d77" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#ff3d77" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="hoodieGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3da9ff" />
            <stop offset="100%" stopColor="#1f6fc4" />
          </linearGradient>
          <linearGradient id="phoneGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1a1a2e" />
            <stop offset="100%" stopColor="#0a0a14" />
          </linearGradient>
        </defs>

        {/* Glow Hintergrund */}
        <circle cx="230" cy="230" r="220" fill="url(#glow1)" />

        {/* Floating Math-Symbole */}
        <g opacity="0.7">
          <text x="40" y="80" fontFamily="Georgia, serif" fontSize="38" fill="#ff3d77" fontStyle="italic">π</text>
          <text x="380" y="100" fontFamily="Georgia, serif" fontSize="32" fill="#3da9ff" fontStyle="italic">√</text>
          <text x="400" y="340" fontFamily="Georgia, serif" fontSize="34" fill="#ffc94c" fontStyle="italic">x²</text>
          <text x="30" y="370" fontFamily="Georgia, serif" fontSize="36" fill="#3ad29f" fontStyle="italic">∑</text>
        </g>

        {/* Floating Karten (subtle) */}
        <g transform="translate(40, 200) rotate(-12)">
          <rect x="0" y="0" width="70" height="90" rx="10" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.15)" />
          <rect x="10" y="14" width="40" height="8" rx="2" fill="rgba(255,61,119,0.6)" />
          <rect x="10" y="28" width="50" height="4" rx="2" fill="rgba(255,255,255,0.25)" />
          <rect x="10" y="38" width="44" height="4" rx="2" fill="rgba(255,255,255,0.25)" />
          <rect x="10" y="48" width="48" height="4" rx="2" fill="rgba(255,255,255,0.25)" />
        </g>
        <g transform="translate(360, 240) rotate(10)">
          <rect x="0" y="0" width="70" height="90" rx="10" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.15)" />
          <rect x="10" y="14" width="40" height="8" rx="2" fill="rgba(61,169,255,0.7)" />
          <rect x="10" y="28" width="50" height="4" rx="2" fill="rgba(255,255,255,0.25)" />
          <rect x="10" y="38" width="44" height="4" rx="2" fill="rgba(255,255,255,0.25)" />
          <rect x="10" y="48" width="48" height="4" rx="2" fill="rgba(255,255,255,0.25)" />
        </g>

        {/* Charakter */}
        <g transform="translate(230, 240)">
          {/* Hoodie */}
          <path d="M -90 130 Q -90 70 -50 60 L 50 60 Q 90 70 90 130 L 90 200 L -90 200 Z" fill="url(#hoodieGrad)" />
          {/* Hoodie-Kapuze */}
          <path d="M -70 80 Q -70 40 0 35 Q 70 40 70 80 L 60 90 Q 60 60 0 55 Q -60 60 -60 90 Z" fill="#1f6fc4" />
          {/* Hoodie String */}
          <line x1="-12" y1="80" x2="-12" y2="115" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="12" y1="80" x2="12" y2="115" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="-12" cy="118" r="3" fill="#ffffff" />
          <circle cx="12" cy="118" r="3" fill="#ffffff" />

          {/* Hals */}
          <rect x="-12" y="40" width="24" height="22" fill="#f4d4b8" />

          {/* Kopf */}
          <ellipse cx="0" cy="0" rx="48" ry="55" fill="#f4d4b8" />

          {/* Haare — modern bob */}
          <path d="M -52 -10 Q -52 -50 0 -55 Q 52 -50 52 -10 L 52 25 Q 50 20 46 18 L 46 -5 Q 46 -28 0 -32 Q -46 -28 -46 -5 L -46 18 Q -50 20 -52 25 Z" fill="#2a1f2e" />

          {/* Headphones */}
          <path d="M -52 -10 Q -52 -45 0 -50 Q 52 -45 52 -10" fill="none" stroke="#ff3d77" strokeWidth="6" strokeLinecap="round" />
          <ellipse cx="-50" cy="0" rx="14" ry="20" fill="#ff3d77" />
          <ellipse cx="-50" cy="0" rx="10" ry="16" fill="#161616" />
          <ellipse cx="50" cy="0" rx="14" ry="20" fill="#ff3d77" />
          <ellipse cx="50" cy="0" rx="10" ry="16" fill="#161616" />

          {/* Brille */}
          <circle cx="-18" cy="0" r="14" fill="none" stroke="#0a0a14" strokeWidth="2.5" />
          <circle cx="18" cy="0" r="14" fill="none" stroke="#0a0a14" strokeWidth="2.5" />
          <line x1="-4" y1="0" x2="4" y2="0" stroke="#0a0a14" strokeWidth="2.5" />

          {/* Augen (geschlossen lächelnd) */}
          <path d="M -22 1 Q -18 -3 -14 1" fill="none" stroke="#0a0a14" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 14 1 Q 18 -3 22 1" fill="none" stroke="#0a0a14" strokeWidth="2.5" strokeLinecap="round" />

          {/* Wangen */}
          <ellipse cx="-30" cy="14" rx="8" ry="4" fill="#ff8aa9" opacity="0.6" />
          <ellipse cx="30" cy="14" rx="8" ry="4" fill="#ff8aa9" opacity="0.6" />

          {/* Lächeln */}
          <path d="M -10 20 Q 0 30 10 20" fill="none" stroke="#0a0a14" strokeWidth="2.5" strokeLinecap="round" />

          {/* Phone in Hand */}
          <g transform="translate(60, 150) rotate(-8)">
            <rect x="-22" y="-40" width="44" height="80" rx="8" fill="url(#phoneGrad)" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
            <rect x="-18" y="-32" width="36" height="60" rx="3" fill="#1a1a2e" />
            <text x="0" y="-14" fontFamily="Cormorant Garamond, Georgia, serif" fontSize="11" fontWeight="700" fill="#ff3d77" textAnchor="middle">▶ lernflix</text>
            <rect x="-14" y="-6" width="28" height="6" rx="2" fill="#ff3d77" />
            <rect x="-14" y="4" width="20" height="3" rx="1" fill="#ffffff" opacity="0.4" />
            <rect x="-14" y="10" width="24" height="3" rx="1" fill="#ffffff" opacity="0.4" />
            <rect x="-14" y="16" width="18" height="3" rx="1" fill="#ffffff" opacity="0.4" />
            <circle cx="0" cy="34" r="2" fill="#ffffff" opacity="0.6" />
          </g>

          {/* Hand */}
          <ellipse cx="60" cy="155" rx="14" ry="11" fill="#f4d4b8" />
        </g>
      </svg>
    </div>
  );
}

function BibliothekIllustration({ size }: { size: number }) {
  const cards = [
    { x: 0, y: 30, w: 150, h: 200, bg: '#ff6b5a', titel: 'Brüche', sub: 'Mathe · Klasse 5–7', icon: '¾', iconColor: '#fff' },
    { x: 165, y: 0, w: 150, h: 230, bg: '#4a90e2', titel: 'Geometrie', sub: 'Mathe · Klasse 6–9', svgIcon: 'triangle', iconColor: '#fff' },
    { x: 0, y: 250, w: 150, h: 200, bg: '#52b788', titel: 'Optik', sub: 'Physik · Klasse 8–10', svgIcon: 'sun', iconColor: '#fff' },
    { x: 165, y: 250, w: 150, h: 200, bg: '#ffd166', titel: 'Funktionen', sub: 'Mathe · Klasse 8–10', svgIcon: 'parabola', iconColor: '#161616' },
  ];
  return (
    <div style={{ position: 'relative', width: size, height: size, maxWidth: '100%' }}>
      <svg width={size} height={size} viewBox="0 0 360 480" style={{ overflow: 'visible' }}>
        {cards.map((c, i) => (
          <g key={i} transform={`translate(${c.x}, ${c.y}) rotate(${i % 2 === 0 ? -2 : 2} ${c.w / 2} ${c.h / 2})`}>
            <rect x="0" y="0" width={c.w} height={c.h} rx="20" fill={c.bg} style={{ filter: 'drop-shadow(0 18px 40px rgba(0,0,0,0.18))' }} />
            <text x="20" y="36" fontFamily="Inter, sans-serif" fontSize="11" fontWeight="700" fill={c.iconColor} opacity="0.85" letterSpacing="1.5">{c.sub.toUpperCase()}</text>
            <text x="20" y={c.h - 24} fontFamily="Cormorant Garamond, Georgia, serif" fontSize="28" fontWeight="700" fill={c.iconColor}>{c.titel}</text>
            <g transform={`translate(${c.w / 2 - 30}, ${c.h / 2 - 30})`}>
              {c.icon && <text x="30" y="44" fontSize="56" fontWeight="800" fill={c.iconColor} textAnchor="middle" fontFamily="Cormorant Garamond, Georgia, serif">{c.icon}</text>}
              {c.svgIcon === 'triangle' && <polygon points="6,52 56,52 31,8" fill={c.iconColor} opacity="0.9" />}
              {c.svgIcon === 'sun' && <g><circle cx="30" cy="30" r="14" fill={c.iconColor} /><g stroke={c.iconColor} strokeWidth="2.5" strokeLinecap="round"><line x1="30" y1="6" x2="30" y2="12" /><line x1="30" y1="48" x2="30" y2="54" /><line x1="6" y1="30" x2="12" y2="30" /><line x1="48" y1="30" x2="54" y2="30" /><line x1="13" y1="13" x2="17" y2="17" /><line x1="43" y1="43" x2="47" y2="47" /><line x1="13" y1="47" x2="17" y2="43" /><line x1="43" y1="17" x2="47" y2="13" /></g></g>}
              {c.svgIcon === 'parabola' && <path d="M 6 52 Q 30 -10 54 52" fill="none" stroke={c.iconColor} strokeWidth="4" strokeLinecap="round" />}
            </g>
          </g>
        ))}
      </svg>
    </div>
  );
}

function LernheldIllustration() {
  return (
    <div style={{ width: '100%', maxWidth: '460px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {[
        { n: 1, farbe: '#fdc94c', titel: 'Fotos hochladen', text: 'Vom Schulbuch, der Stoffliste, den Übungen.' },
        { n: 2, farbe: '#ff7a5c', titel: 'Klasse & Datum wählen', text: 'Wann ist die Schulaufgabe? Was fällt dir schwer?' },
        { n: 3, farbe: '#6cc99c', titel: 'Plan ist fertig', text: 'Mit Themen, Übungen, Lösungen und Wochenplan.' },
      ].map((s) => (
        <div key={s.n} style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '18px', padding: '22px 24px', display: 'flex', alignItems: 'center', gap: '20px', border: '1px solid rgba(255,255,255,0.14)' }}>
          <div style={{ width: '54px', height: '54px', borderRadius: '14px', background: s.farbe, color: '#1c1a17', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 800, flexShrink: 0 }}>{s.n}</div>
          <div>
            <p style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '22px', fontWeight: 700, color: '#fefcf7', margin: '0 0 4px' }}>{s.titel}</p>
            <p style={{ fontSize: '14px', color: 'rgba(254,252,247,0.75)', margin: 0, lineHeight: 1.5 }}>{s.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
