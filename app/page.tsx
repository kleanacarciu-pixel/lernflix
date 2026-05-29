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
  cream: '#faf5ef',
  creamDeep: '#f3ead9',
  ink: '#1f1c19',
  inkSoft: '#5a5045',
  inkMuted: '#8c8377',
  white: '#ffffff',
  border: '#e8dfd0',
  forest: '#2d5f5d',
  forestDeep: '#1f4544',
  gold: '#c9a85c',
  goldDeep: '#a3823f',
  blush: '#d49b8a',
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
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: scrolled ? 'rgba(250, 245, 239, 0.92)' : 'transparent', backdropFilter: scrolled ? 'blur(14px)' : 'none', borderBottom: scrolled ? `1px solid ${FARBEN.border}` : 'none', padding: mobil ? '14px 20px' : '20px 60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all 0.3s ease' }}>
        <a href="#" style={{ fontFamily: SERIF, fontSize: mobil ? '22px' : '26px', fontWeight: 600, color: FARBEN.ink, textDecoration: 'none', letterSpacing: '-0.01em' }}>
          Lerne mit <span style={{ fontStyle: 'italic', color: FARBEN.forest }}>Anna</span>
        </a>
        <nav style={{ display: 'flex', gap: mobil ? '14px' : '32px', alignItems: 'center' }}>
          {!mobil && (
            <>
              <a href="#materialien" style={{ color: FARBEN.ink, textDecoration: 'none', fontSize: '14.5px', fontWeight: 500 }}>Materialien</a>
              <a href="/quiz" style={{ color: FARBEN.ink, textDecoration: 'none', fontSize: '14.5px', fontWeight: 500 }}>Quiz</a>
              <a href="#ueber" style={{ color: FARBEN.ink, textDecoration: 'none', fontSize: '14.5px', fontWeight: 500 }}>Über mich</a>
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
            <p style={{ fontFamily: SCRIPT, fontSize: '26px', color: FARBEN.forest, margin: '0 0 6px', letterSpacing: '0.02em' }}>Wissen, das hängen bleibt.</p>
            <h1 style={{ fontFamily: SERIF, fontSize: mobil ? '46px' : '74px', fontWeight: 500, lineHeight: 1.02, margin: '0 0 22px', color: FARBEN.ink, letterSpacing: '-0.02em' }}>
              Lernen — so <span style={{ fontStyle: 'italic', color: FARBEN.forest }}>einfach</span> wie streamen.
            </h1>
            <p style={{ fontSize: mobil ? '16px' : '18px', color: FARBEN.inkSoft, lineHeight: 1.7, margin: '0 0 36px', maxWidth: '520px' }}>
              Lernflix bringt deinen Schulstoff in die gleiche Bibliothek wie deine Lieblingsserien — nur dass du am Ende etwas mitnimmst, das dir in der nächsten Schulaufgabe hilft. Mathe, Physik, Quizzes und persönliche Lernpläne — alles an einem Ort.
            </p>
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <a href="/lernheld" className="btn-haupt" style={{ background: FARBEN.forest, color: FARBEN.cream, textDecoration: 'none', padding: '16px 32px', borderRadius: '999px', fontSize: '15px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '10px', letterSpacing: '0.02em' }}>
                Lernheld-Plan starten
                <span style={{ fontSize: '18px' }}>→</span>
              </a>
              <a href="#materialien" className="btn-rand" style={{ background: 'transparent', color: FARBEN.ink, textDecoration: 'none', padding: '16px 32px', borderRadius: '999px', fontSize: '15px', fontWeight: 600, border: `1.5px solid ${FARBEN.ink}`, letterSpacing: '0.02em' }}>
                Bibliothek ansehen
              </a>
            </div>
            <div style={{ display: 'flex', gap: '32px', marginTop: '50px', flexWrap: 'wrap' }}>
              <div>
                <p style={{ fontFamily: SERIF, fontSize: '34px', fontWeight: 600, color: FARBEN.ink, margin: 0, lineHeight: 1 }}>13</p>
                <p style={{ fontSize: '13px', color: FARBEN.inkMuted, margin: '4px 0 0', letterSpacing: '0.04em' }}>Lernpakete</p>
              </div>
              <div style={{ width: '1px', background: FARBEN.border }} />
              <div>
                <p style={{ fontFamily: SERIF, fontSize: '34px', fontWeight: 600, color: FARBEN.ink, margin: 0, lineHeight: 1 }}>61</p>
                <p style={{ fontSize: '13px', color: FARBEN.inkMuted, margin: '4px 0 0', letterSpacing: '0.04em' }}>Quiz-Themen</p>
              </div>
              <div style={{ width: '1px', background: FARBEN.border }} />
              <div>
                <p style={{ fontFamily: SERIF, fontSize: '34px', fontWeight: 600, color: FARBEN.ink, margin: 0, lineHeight: 1 }}>1–13</p>
                <p style={{ fontSize: '13px', color: FARBEN.inkMuted, margin: '4px 0 0', letterSpacing: '0.04em' }}>Klassenstufen</p>
              </div>
            </div>
          </div>

          {/* HERO-ILLUSTRATION: Bibliothek von Lerninhalten im Netflix-Stil */}
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            <div style={{ position: 'absolute', top: '6%', left: '4%', background: FARBEN.white, padding: '10px 16px', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', transform: 'rotate(-6deg)', animation: 'schweben 6s ease-in-out infinite', zIndex: 5 }}>
              <span style={{ fontFamily: SERIF, fontSize: '20px', fontStyle: 'italic', color: FARBEN.forest }}>a² + b² = c²</span>
            </div>
            <div style={{ position: 'absolute', bottom: '8%', right: '4%', background: FARBEN.gold, color: FARBEN.white, padding: '8px 14px', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', transform: 'rotate(5deg)', animation: 'schweben 7s ease-in-out infinite 0.5s', fontFamily: SCRIPT, fontSize: '20px', zIndex: 5 }}>
              ▶ jetzt lernen
            </div>
            <BibliothekIllustration size={mobil ? 300 : 420} />
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

      {/* ÜBER LERNFLIX */}
      <section id="ueber" style={{ padding: mobil ? '70px 20px' : '120px 60px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontFamily: SCRIPT, fontSize: '28px', color: FARBEN.forest, margin: '0 0 14px' }}>Die Idee dahinter.</p>
          <h2 style={{ fontFamily: SERIF, fontSize: mobil ? '40px' : '58px', fontWeight: 500, color: FARBEN.ink, margin: '0 0 30px', lineHeight: 1.05, letterSpacing: '-0.01em' }}>
            Lernen + Netflix = <span style={{ fontStyle: 'italic', color: FARBEN.forest }}>Lernflix</span>
          </h2>
          <p style={{ fontSize: mobil ? '17px' : '19px', color: FARBEN.inkSoft, lineHeight: 1.7, margin: '0 0 36px' }}>
            Schulbuch zu schwer, YouTube zu unstrukturiert, Nachhilfe zu teuer. Wir haben Lernflix gebaut, damit du Lernen genauso entspannt erlebst wie eine gute Serie. Übersichtliche Themen statt Wand aus Text. Schöne Erklärungen statt trockener Definitionen. Persönliche Lernpläne statt 12 verschiedener Apps. Alles an einem Ort, in deinem Tempo.
          </p>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <span style={{ background: FARBEN.creamDeep, padding: '10px 22px', borderRadius: '999px', fontSize: '13.5px', color: FARBEN.ink, fontWeight: 500 }}>Klar strukturiert</span>
            <span style={{ background: FARBEN.creamDeep, padding: '10px 22px', borderRadius: '999px', fontSize: '13.5px', color: FARBEN.ink, fontWeight: 500 }}>Mit Beispielen</span>
            <span style={{ background: FARBEN.creamDeep, padding: '10px 22px', borderRadius: '999px', fontSize: '13.5px', color: FARBEN.ink, fontWeight: 500 }}>Kindgerecht</span>
            <span style={{ background: FARBEN.creamDeep, padding: '10px 22px', borderRadius: '999px', fontSize: '13.5px', color: FARBEN.ink, fontWeight: 500 }}>Ohne Stress</span>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: FARBEN.ink, color: FARBEN.creamDeep, padding: mobil ? '60px 20px 30px' : '80px 60px 40px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: mobil ? '1fr' : '2fr 1fr 1fr 1fr', gap: '40px', marginBottom: '50px' }}>
            <div>
              <p style={{ fontFamily: SERIF, fontSize: '26px', fontWeight: 600, color: FARBEN.cream, margin: '0 0 14px', letterSpacing: '-0.01em' }}>
                Lerne mit <span style={{ fontStyle: 'italic', color: FARBEN.gold }}>Anna</span>
              </p>
              <p style={{ fontSize: '14px', color: FARBEN.creamDeep, opacity: 0.7, lineHeight: 1.6, margin: 0, maxWidth: '320px' }}>
                Lernpakete und persönliche Lernpläne für Mathematik und Physik. Verständlich, warm und ohne Stress.
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

function ProduktKarteEdel({ p, onClick }: { p: Produkt; onClick: () => void }) {
  return (
    <div onClick={onClick} className="karte-hover" style={{ background: FARBEN.white, borderRadius: '18px', padding: '28px 26px', cursor: 'pointer', boxShadow: '0 6px 20px rgba(31, 28, 25, 0.04)', border: `1px solid ${FARBEN.border}`, display: 'flex', flexDirection: 'column', minHeight: '240px' }}>
      <p style={{ fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: FARBEN.forest, fontWeight: 700, margin: '0 0 12px' }}>{p.typ}</p>
      <h3 style={{ fontFamily: SERIF, fontSize: '22px', fontWeight: 600, margin: '0 0 12px', color: FARBEN.ink, letterSpacing: '-0.01em', lineHeight: 1.2 }}>{p.titel}</h3>
      <p style={{ fontSize: '14px', color: FARBEN.inkSoft, lineHeight: 1.6, margin: '0 0 20px', flex: 1 }}>{p.beschreibung.length > 110 ? p.beschreibung.slice(0, 110) + '…' : p.beschreibung}</p>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: `1px solid ${FARBEN.border}`, paddingTop: '16px' }}>
        <span style={{ fontFamily: SERIF, fontSize: '22px', fontWeight: 600, color: FARBEN.ink }}>{p.preis.toFixed(2).replace('.', ',')} €</span>
        <span style={{ fontSize: '13px', color: FARBEN.forest, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          Ansehen <span className="pfeil-hover">→</span>
        </span>
      </div>
    </div>
  );
}

function BibliothekIllustration({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 400 400" style={{ filter: 'drop-shadow(0 24px 50px rgba(31, 28, 25, 0.16))' }}>
      <defs>
        <linearGradient id="bgKreis" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fdf8ee" />
          <stop offset="100%" stopColor="#f3ead9" />
        </linearGradient>
      </defs>
      <circle cx="200" cy="200" r="180" fill="url(#bgKreis)" />

      {/* TV / Tablet im Hintergrund — Lernflix Browse-Screen */}
      <g transform="translate(60, 90)">
        <rect x="0" y="0" width="280" height="200" rx="14" fill="#1f1c19" />
        <rect x="0" y="0" width="280" height="28" rx="14" fill="#1f1c19" />
        <circle cx="14" cy="14" r="3" fill="#ef4444" />
        <circle cx="26" cy="14" r="3" fill="#f59e0b" />
        <circle cx="38" cy="14" r="3" fill="#34c759" />
        <text x="220" y="18" fontFamily="Georgia, serif" fontSize="11" fontWeight="700" fill="#c9a85c">lernflix</text>
        {/* Bibliothek-Zeilen */}
        <text x="14" y="50" fontFamily="Inter, sans-serif" fontSize="10" fontWeight="700" fill="#faf5ef" opacity="0.7">FÜR DICH AUSGEWÄHLT</text>
        <rect x="14" y="58" width="56" height="70" rx="5" fill="#2d5f5d" />
        <text x="20" y="78" fontFamily="Georgia, serif" fontSize="9" fontWeight="700" fill="#c9a85c">Mathe</text>
        <text x="20" y="92" fontFamily="Georgia, serif" fontSize="13" fontWeight="700" fill="#faf5ef">Brüche</text>
        <rect x="20" y="108" width="30" height="12" rx="6" fill="#c9a85c" />
        <text x="26" y="117" fontFamily="Inter, sans-serif" fontSize="7" fontWeight="700" fill="#1f1c19">▶ Start</text>

        <rect x="76" y="58" width="56" height="70" rx="5" fill="#c97a96" />
        <text x="82" y="78" fontFamily="Georgia, serif" fontSize="9" fontWeight="700" fill="#faf5ef">Mathe</text>
        <text x="82" y="92" fontFamily="Georgia, serif" fontSize="13" fontWeight="700" fill="#faf5ef">Geo­metrie</text>
        <rect x="82" y="108" width="36" height="12" rx="6" fill="#faf5ef" />
        <text x="89" y="117" fontFamily="Inter, sans-serif" fontSize="7" fontWeight="700" fill="#1f1c19">▶ Start</text>

        <rect x="138" y="58" width="56" height="70" rx="5" fill="#c9a85c" />
        <text x="144" y="78" fontFamily="Georgia, serif" fontSize="9" fontWeight="700" fill="#1f1c19">Physik</text>
        <text x="144" y="92" fontFamily="Georgia, serif" fontSize="13" fontWeight="700" fill="#1f1c19">Mecha­nik</text>
        <rect x="144" y="108" width="36" height="12" rx="6" fill="#1f1c19" />
        <text x="151" y="117" fontFamily="Inter, sans-serif" fontSize="7" fontWeight="700" fill="#faf5ef">▶ Start</text>

        <rect x="200" y="58" width="56" height="70" rx="5" fill="#5a8264" />
        <text x="206" y="78" fontFamily="Georgia, serif" fontSize="9" fontWeight="700" fill="#faf5ef">Physik</text>
        <text x="206" y="92" fontFamily="Georgia, serif" fontSize="13" fontWeight="700" fill="#faf5ef">Optik</text>
        <rect x="206" y="108" width="36" height="12" rx="6" fill="#faf5ef" />
        <text x="213" y="117" fontFamily="Inter, sans-serif" fontSize="7" fontWeight="700" fill="#1f1c19">▶ Start</text>

        {/* Zweite Zeile */}
        <text x="14" y="148" fontFamily="Inter, sans-serif" fontSize="10" fontWeight="700" fill="#faf5ef" opacity="0.7">QUIZ</text>
        <rect x="14" y="156" width="240" height="34" rx="5" fill="#faf5ef" opacity="0.1" />
        <rect x="22" y="164" width="42" height="18" rx="4" fill="#c9a85c" />
        <text x="35" y="177" fontFamily="Inter, sans-serif" fontSize="9" fontWeight="700" fill="#1f1c19">Klasse 7</text>
        <rect x="70" y="164" width="42" height="18" rx="4" fill="#2d5f5d" />
        <text x="83" y="177" fontFamily="Inter, sans-serif" fontSize="9" fontWeight="700" fill="#faf5ef">Klasse 8</text>
        <rect x="118" y="164" width="42" height="18" rx="4" fill="#c97a96" />
        <text x="131" y="177" fontFamily="Inter, sans-serif" fontSize="9" fontWeight="700" fill="#faf5ef">Klasse 9</text>
        <rect x="166" y="164" width="42" height="18" rx="4" fill="#5a8264" />
        <text x="179" y="177" fontFamily="Inter, sans-serif" fontSize="9" fontWeight="700" fill="#faf5ef">Klasse 10</text>
      </g>

      {/* TV-Standfuß */}
      <rect x="180" y="290" width="40" height="14" rx="3" fill="#1f1c19" />
      <rect x="140" y="304" width="120" height="6" rx="3" fill="#1f1c19" />

      {/* Pflanze daneben */}
      <g transform="translate(345, 240)">
        <rect x="-10" y="50" width="20" height="18" rx="3" fill="#8b6f47" />
        <ellipse cx="-4" cy="38" rx="12" ry="20" fill="#5a8264" transform="rotate(-20)" />
        <ellipse cx="6" cy="32" rx="11" ry="18" fill="#6b9477" transform="rotate(15)" />
      </g>
    </svg>
  );
}

function LernheldIllustration() {
  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '420px', margin: '0 auto', aspectRatio: '1' }}>
      <svg viewBox="0 0 400 400" width="100%" height="100%">
        {/* Hintere Karte */}
        <g transform="translate(60, 80) rotate(-6 130 140)">
          <rect x="0" y="0" width="260" height="280" rx="14" fill="#faf5ef" />
          <rect x="0" y="0" width="260" height="40" fill="#1f4544" />
          <text x="20" y="26" fontFamily="Georgia, serif" fontSize="14" fill="#c9a85c" fontWeight="700">DEIN LERNHELD-PLAN</text>
          <text x="20" y="70" fontFamily="Georgia, serif" fontSize="22" fontWeight="700" fill="#1f1c19">Mathe · Klasse 9</text>
          <line x1="20" y1="86" x2="240" y2="86" stroke="#e8dfd0" strokeWidth="1" />
          <rect x="20" y="100" width="80" height="10" rx="3" fill="#2d5f5d" />
          <rect x="20" y="120" width="180" height="6" rx="2" fill="#e8dfd0" />
          <rect x="20" y="134" width="200" height="6" rx="2" fill="#e8dfd0" />
          <rect x="20" y="148" width="140" height="6" rx="2" fill="#e8dfd0" />
          <rect x="20" y="170" width="80" height="10" rx="3" fill="#c9a85c" />
          <rect x="20" y="190" width="190" height="6" rx="2" fill="#e8dfd0" />
          <rect x="20" y="204" width="160" height="6" rx="2" fill="#e8dfd0" />
          <rect x="20" y="218" width="200" height="6" rx="2" fill="#e8dfd0" />
          <rect x="20" y="240" width="100" height="22" rx="11" fill="#2d5f5d" />
          <text x="44" y="255" fontFamily="Inter, sans-serif" fontSize="11" fill="#faf5ef" fontWeight="600">Lernen</text>
        </g>
        {/* Vordere Karte */}
        <g transform="translate(130, 130) rotate(4 130 140)">
          <rect x="0" y="0" width="240" height="240" rx="14" fill="#ffffff" />
          <rect x="0" y="0" width="240" height="36" fill="#c9a85c" />
          <text x="18" y="24" fontFamily="Georgia, serif" fontSize="13" fill="#faf5ef" fontWeight="700">WOCHE 1 · MONTAG</text>
          <text x="18" y="62" fontFamily="Georgia, serif" fontSize="18" fontWeight="700" fill="#1f1c19">Satz des Pythagoras</text>
          {/* Mini Dreieck */}
          <polygon points="30,90 30,160 130,160" fill="#e6f0fe" stroke="#2d5f5d" strokeWidth="2" />
          <text x="20" y="130" fontFamily="Georgia, serif" fontSize="12" fontWeight="700" fill="#2d5f5d">a</text>
          <text x="75" y="175" fontFamily="Georgia, serif" fontSize="12" fontWeight="700" fill="#2d5f5d">b</text>
          <text x="80" y="120" fontFamily="Georgia, serif" fontSize="12" fontWeight="700" fill="#c97a96">c</text>
          {/* Formel */}
          <rect x="145" y="95" width="80" height="34" rx="6" fill="#faf5ef" stroke="#e8dfd0" strokeWidth="1" />
          <text x="156" y="118" fontFamily="Georgia, serif" fontSize="15" fontWeight="700" fill="#1f1c19">a² + b² = c²</text>
          <rect x="145" y="138" width="80" height="20" rx="4" fill="#2d5f5d" />
          <text x="159" y="152" fontFamily="Inter, sans-serif" fontSize="10" fill="#faf5ef" fontWeight="600">Beispiel ✓</text>
          <line x1="18" y1="190" x2="222" y2="190" stroke="#e8dfd0" strokeWidth="1" />
          <circle cx="32" cy="208" r="6" fill="none" stroke="#2d5f5d" strokeWidth="2" />
          <text x="48" y="212" fontFamily="Inter, sans-serif" fontSize="11" fill="#5a5045">Verstehen</text>
          <circle cx="120" cy="208" r="6" fill="#2d5f5d" />
          <text x="136" y="212" fontFamily="Inter, sans-serif" fontSize="11" fill="#5a5045">Üben</text>
        </g>
      </svg>
    </div>
  );
}
