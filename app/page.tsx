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
  cream: '#ffffff',
  creamDeep: '#fbf8f1',
  ink: '#161616',
  inkSoft: '#4a4a4a',
  inkMuted: '#8a8a8a',
  white: '#ffffff',
  border: '#ececec',
  forest: '#0a3d2e',
  forestDeep: '#062318',
  gold: '#f5a623',
  goldDeep: '#d4881c',
  blush: '#ffb6a3',
  sky: '#4a90e2',
  coral: '#ff6b5a',
  mint: '#52b788',
  sun: '#ffd166',
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
        <div onClick={() => setAusgewaehlt(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(31, 28, 25, 0.55)', backdropFilter: 'blur(10px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: FARBEN.white, borderRadius: '20px', maxWidth: '560px', width: '100%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 30px 80px rgba(0,0,0,0.3)' }}>
            <div style={{ padding: mobil ? '28px 24px' : '40px 44px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px' }}>
                <div>
                  <span style={{ fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: FARBEN.forest, fontWeight: 700 }}>{ausgewaehlt.typ}</span>
                  <h2 style={{ fontFamily: SERIF, fontSize: mobil ? '28px' : '34px', fontWeight: 600, margin: '8px 0 4px', color: FARBEN.ink, lineHeight: 1.1 }}>{ausgewaehlt.titel}</h2>
                </div>
                <button onClick={() => setAusgewaehlt(null)} style={{ background: FARBEN.creamDeep, border: 'none', width: '36px', height: '36px', borderRadius: '50%', fontSize: '18px', cursor: 'pointer', color: FARBEN.ink, flexShrink: 0 }}>✕</button>
              </div>
              <p style={{ fontSize: '15px', color: FARBEN.inkSoft, lineHeight: 1.7, margin: '0 0 24px' }}>{ausgewaehlt.beschreibung}</p>
              <div style={{ background: FARBEN.cream, borderRadius: '14px', padding: '20px 22px', marginBottom: '28px' }}>
                <p style={{ fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', color: FARBEN.forest, fontWeight: 700, margin: '0 0 14px' }}>Was drin ist</p>
                {ausgewaehlt.details.map((d, i) => (
                  <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <span style={{ color: FARBEN.gold, fontWeight: 700, fontSize: '15px', flexShrink: 0, marginTop: '1px' }}>✓</span>
                    <span style={{ fontSize: '14.5px', color: FARBEN.ink, lineHeight: 1.5 }}>{d}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '24px', borderTop: `1px solid ${FARBEN.border}` }}>
                <div>
                  <p style={{ margin: 0, fontSize: '12px', color: FARBEN.inkMuted, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Einmalig</p>
                  <p style={{ margin: '2px 0 0', fontFamily: SERIF, fontSize: '36px', fontWeight: 600, color: FARBEN.ink }}>{ausgewaehlt.preis.toFixed(2).replace('.', ',')} €</p>
                </div>
                <button onClick={() => kaufen(ausgewaehlt)} className="btn-haupt" style={{ background: FARBEN.ink, color: FARBEN.cream, border: 'none', borderRadius: '999px', padding: '14px 30px', fontSize: '15px', fontWeight: 600, cursor: 'pointer', fontFamily: SANS, letterSpacing: '0.02em' }}>
                  {ausgewaehlt.slug ? 'Jetzt freischalten' : 'Jetzt kaufen'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: scrolled ? 'rgba(253, 248, 236, 0.92)' : 'transparent', backdropFilter: scrolled ? 'blur(14px)' : 'none', borderBottom: scrolled ? `1px solid ${FARBEN.border}` : 'none', padding: mobil ? '14px 20px' : '20px 60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all 0.3s ease' }}>
        <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <span style={{ width: '32px', height: '32px', borderRadius: '8px', background: FARBEN.ink, color: FARBEN.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 800 }}>▶</span>
          <span style={{ fontFamily: SERIF, fontSize: mobil ? '24px' : '28px', fontWeight: 700, color: FARBEN.ink, letterSpacing: '-0.01em' }}>Lernflix</span>
        </a>
        <nav style={{ display: 'flex', gap: mobil ? '14px' : '32px', alignItems: 'center' }}>
          {!mobil && (
            <>
              <a href="#materialien" style={{ color: FARBEN.ink, textDecoration: 'none', fontSize: '14.5px', fontWeight: 500 }}>Materialien</a>
              <a href="/quiz" style={{ color: FARBEN.ink, textDecoration: 'none', fontSize: '14.5px', fontWeight: 500 }}>Quiz</a>
              <a href="#warum" style={{ color: FARBEN.ink, textDecoration: 'none', fontSize: '14.5px', fontWeight: 500 }}>Warum Lernflix</a>
            </>
          )}
          <a href="/lernheld" style={{ background: FARBEN.ink, color: FARBEN.cream, textDecoration: 'none', fontSize: '14px', fontWeight: 600, padding: '10px 22px', borderRadius: '999px', letterSpacing: '0.01em' }}>Lernheld starten</a>
        </nav>
      </header>

      {/* HERO */}
      <section style={{ paddingTop: mobil ? '110px' : '140px', paddingBottom: mobil ? '70px' : '120px', paddingLeft: mobil ? '20px' : '60px', paddingRight: mobil ? '20px' : '60px', position: 'relative' }}>
        {!mobil && (
          <>
            <div style={{ position: 'absolute', top: '14%', left: '6%', fontFamily: SERIF, fontSize: '60px', color: FARBEN.gold, opacity: 0.15, fontStyle: 'italic', pointerEvents: 'none' }}>π</div>
            <div style={{ position: 'absolute', top: '60%', left: '3%', fontFamily: SERIF, fontSize: '48px', color: FARBEN.forest, opacity: 0.13, fontStyle: 'italic', pointerEvents: 'none' }}>√</div>
            <div style={{ position: 'absolute', top: '20%', right: '4%', fontFamily: SERIF, fontSize: '52px', color: FARBEN.blush, opacity: 0.18, fontStyle: 'italic', pointerEvents: 'none' }}>x²</div>
            <div style={{ position: 'absolute', top: '70%', right: '7%', fontFamily: SERIF, fontSize: '46px', color: FARBEN.gold, opacity: 0.15, fontStyle: 'italic', pointerEvents: 'none' }}>∫</div>
          </>
        )}
        <div className="anim-fadein" style={{ maxWidth: '1240px', margin: '0 auto', display: 'grid', gridTemplateColumns: mobil ? '1fr' : '1.05fr 1fr', gap: mobil ? '40px' : '60px', alignItems: 'center' }}>
          <div>
            <span style={{ display: 'inline-block', background: FARBEN.ink, color: FARBEN.sun, padding: '6px 14px', borderRadius: '999px', fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '20px' }}>▶ DEINE LERN-BIBLIOTHEK</span>
            <h1 style={{ fontFamily: SERIF, fontSize: mobil ? '48px' : '82px', fontWeight: 600, lineHeight: 1.0, margin: '0 0 22px', color: FARBEN.ink, letterSpacing: '-0.025em' }}>
              Lernen wie <span style={{ fontStyle: 'italic', color: FARBEN.coral }}>streamen</span>.
            </h1>
            <p style={{ fontSize: mobil ? '17px' : '19px', color: FARBEN.inkSoft, lineHeight: 1.6, margin: '0 0 30px', maxWidth: '460px' }}>
              Mathe und Physik in der Bibliothek, die Spaß macht. Schöne Lernpakete, persönliche Pläne und ein Quiz für deine Klasse.
            </p>
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <a href="/lernheld" className="btn-haupt" style={{ background: FARBEN.ink, color: FARBEN.cream, textDecoration: 'none', padding: '16px 30px', borderRadius: '999px', fontSize: '15px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
                Lernheld starten <span style={{ fontSize: '18px' }}>→</span>
              </a>
              <a href="#materialien" className="btn-rand" style={{ background: 'transparent', color: FARBEN.ink, textDecoration: 'none', padding: '16px 30px', borderRadius: '999px', fontSize: '15px', fontWeight: 700, border: `1.5px solid ${FARBEN.ink}` }}>
                Bibliothek ansehen
              </a>
            </div>
            <div style={{ display: 'flex', gap: '32px', marginTop: '46px', flexWrap: 'wrap' }}>
              <div>
                <p style={{ fontFamily: SERIF, fontSize: '36px', fontWeight: 700, color: FARBEN.ink, margin: 0, lineHeight: 1 }}>13</p>
                <p style={{ fontSize: '13px', color: FARBEN.inkMuted, margin: '4px 0 0' }}>Lernpakete</p>
              </div>
              <div style={{ width: '1px', background: FARBEN.border }} />
              <div>
                <p style={{ fontFamily: SERIF, fontSize: '36px', fontWeight: 700, color: FARBEN.ink, margin: 0, lineHeight: 1 }}>61</p>
                <p style={{ fontSize: '13px', color: FARBEN.inkMuted, margin: '4px 0 0' }}>Quiz-Themen</p>
              </div>
              <div style={{ width: '1px', background: FARBEN.border }} />
              <div>
                <p style={{ fontFamily: SERIF, fontSize: '36px', fontWeight: 700, color: FARBEN.ink, margin: 0, lineHeight: 1 }}>1–13</p>
                <p style={{ fontSize: '13px', color: FARBEN.inkMuted, margin: '4px 0 0' }}>Klassen</p>
              </div>
            </div>
          </div>

          {/* HERO-ILLUSTRATION */}
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            <BibliothekIllustration size={mobil ? 320 : 440} />
            <div style={{ position: 'absolute', top: '-2%', left: '0%', background: FARBEN.sun, color: FARBEN.ink, padding: '8px 14px', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.12)', transform: 'rotate(-8deg)', animation: 'schweben 6s ease-in-out infinite', zIndex: 5, fontFamily: SCRIPT, fontSize: '22px', fontWeight: 700 }}>
              Episode 1
            </div>
            <div style={{ position: 'absolute', bottom: '4%', right: '-2%', background: FARBEN.coral, color: FARBEN.white, padding: '8px 14px', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.12)', transform: 'rotate(6deg)', animation: 'schweben 7s ease-in-out infinite 0.5s', zIndex: 5, fontFamily: SCRIPT, fontSize: '22px', fontWeight: 700 }}>
              ▶ jetzt!
            </div>
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
      <footer style={{ background: FARBEN.ink, color: FARBEN.creamDeep, padding: mobil ? '60px 20px 30px' : '80px 60px 40px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: mobil ? '1fr' : '2fr 1fr 1fr 1fr', gap: '40px', marginBottom: '50px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <span style={{ width: '32px', height: '32px', borderRadius: '8px', background: FARBEN.gold, color: FARBEN.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 800 }}>▶</span>
                <p style={{ fontFamily: SERIF, fontSize: '26px', fontWeight: 700, color: FARBEN.cream, margin: 0 }}>Lernflix</p>
              </div>
              <p style={{ fontSize: '14px', color: FARBEN.creamDeep, opacity: 0.7, lineHeight: 1.6, margin: 0, maxWidth: '320px' }}>
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
  const svg = (p.slug && THEMA_SVGS[p.slug]) || { bg: FARBEN.forest, render: () => (<svg viewBox="0 0 120 80" width="100%" height="100%"><text x="60" y="50" fontSize="32" fontWeight="800" fill="#fff" textAnchor="middle" fontFamily="Georgia, serif">π</text></svg>) };
  return (
    <div onClick={onClick} className="karte-hover" style={{ background: FARBEN.white, borderRadius: '18px', cursor: 'pointer', boxShadow: '0 6px 20px rgba(31, 28, 25, 0.04)', border: `1px solid ${FARBEN.border}`, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ background: svg.bg, height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        {svg.render()}
      </div>
      <div style={{ padding: '20px 22px 22px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <p style={{ fontSize: '10.5px', letterSpacing: '0.18em', textTransform: 'uppercase', color: FARBEN.inkMuted, fontWeight: 700, margin: '0 0 8px' }}>{p.kategorie === 'mathe' ? 'Mathematik' : 'Physik'}</p>
        <h3 style={{ fontFamily: SERIF, fontSize: '20px', fontWeight: 700, margin: '0 0 16px', color: FARBEN.ink, letterSpacing: '-0.01em', lineHeight: 1.2 }}>{p.titel}</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '12px', borderTop: `1px solid ${FARBEN.border}` }}>
          <span style={{ fontFamily: SERIF, fontSize: '20px', fontWeight: 700, color: FARBEN.ink }}>{p.preis.toFixed(2).replace('.', ',')} €</span>
          <span style={{ fontSize: '13px', color: FARBEN.ink, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            Ansehen <span className="pfeil-hover">→</span>
          </span>
        </div>
      </div>
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
