'use client';
import { useEffect, useState } from 'react';

const F = {
  bg: '#ffffff',
  bgSoft: '#fafaf9',
  ink: '#0a0a0c',
  inkSoft: '#52525b',
  inkMuted: '#94a3b8',
  border: '#e2e8f0',
  blue: '#1769FF',
  blueDeep: '#1156DD',
  navy: '#0B1F3A',
  green: '#10B981',
  white: '#ffffff',
};
const SANS = '"Inter", -apple-system, BlinkMacSystemFont, sans-serif';

// 3 Themen die nacheinander gezeichnet werden
const SKIZZEN = ['pythagoras', 'parabel', 'kraft'] as const;
type Skizze = typeof SKIZZEN[number];

export default function VorschlagSkizze() {
  const [breite, setBreite] = useState(1200);
  const [skizze, setSkizze] = useState<Skizze>('pythagoras');

  useEffect(() => {
    const onResize = () => setBreite(window.innerWidth);
    window.addEventListener('resize', onResize);
    onResize();
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // wechsle alle 8 sec
  useEffect(() => {
    const id = setInterval(() => {
      setSkizze((s) => {
        const i = SKIZZEN.indexOf(s);
        return SKIZZEN[(i + 1) % SKIZZEN.length];
      });
    }, 8000);
    return () => clearInterval(id);
  }, []);

  const mobil = breite < 768;

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #FFF9F0 0%, #FEF3E0 100%)', fontFamily: SANS, color: F.ink, overflowX: 'hidden', position: 'relative' }}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@500&display=swap" />

      {/* Dot-grid pattern + glow blobs */}
      <div style={{ position: 'fixed', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(23,105,255,0.10) 1px, transparent 1px)', backgroundSize: '32px 32px', opacity: 0.35, pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', top: '-100px', left: '-100px', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,180,90,0.22) 0%, transparent 65%)', pointerEvents: 'none', filter: 'blur(40px)', zIndex: 0 }} />
      <div style={{ position: 'fixed', top: '20%', right: '-150px', width: '550px', height: '550px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(23,105,255,0.16) 0%, transparent 70%)', pointerEvents: 'none', filter: 'blur(30px)', zIndex: 0 }} />

      <style>{`
        * { -webkit-font-smoothing: antialiased; }
        body { background: #FFF9F0; margin: 0; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes draw { from { stroke-dashoffset: 1200; } to { stroke-dashoffset: 0; } }
        @keyframes appear { 0%, 30% { opacity: 0; transform: translateY(4px); } 60%, 100% { opacity: 1; transform: translateY(0); } }
        @keyframes appearLate { 0%, 55% { opacity: 0; transform: translateY(6px); } 85%, 100% { opacity: 1; transform: translateY(0); } }
        @keyframes appearFinal { 0%, 70% { opacity: 0; transform: translateY(8px); } 95%, 100% { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .fade-up { animation: fadeUp 0.7s cubic-bezier(0.2,0.8,0.2,1) both; }
        .draw-path {
          stroke-dasharray: 1200;
          stroke-dashoffset: 1200;
          animation: draw 2.5s cubic-bezier(0.55, 0, 0.1, 1) forwards;
        }
        .appear-1 { animation: appear 3s ease-out both; }
        .appear-2 { animation: appearLate 4s ease-out both; }
        .appear-3 { animation: appearFinal 5s ease-out both; }
        .fade-in { animation: fadeIn 1s ease-out both; }
        .btn-primary {
          background: ${F.blue}; color: ${F.white};
          padding: 14px 28px; border-radius: 12px;
          font-size: 15px; font-weight: 600;
          text-decoration: none; display: inline-flex; align-items: center; gap: 8px;
          box-shadow: 0 8px 24px rgba(23,105,255,0.24);
          transition: all 0.2s ease;
        }
        .btn-primary:hover { background: ${F.blueDeep}; transform: translateY(-1px); }
        .btn-ghost {
          background: transparent; color: ${F.ink};
          padding: 14px 28px; border-radius: 12px;
          font-size: 15px; font-weight: 600;
          text-decoration: none; border: 1.5px solid ${F.border};
        }
      `}</style>

      {/* HEADER */}
      <header style={{ padding: mobil ? '18px 22px' : '22px 56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${F.border}` }}>
        <a href="/" style={{ textDecoration: 'none', fontSize: '24px', fontWeight: 800, color: F.ink, letterSpacing: '-0.025em' }}>
          Lern<span style={{ color: F.blue }}>flix</span>
        </a>
        <span style={{ background: F.bgSoft, border: `1px solid ${F.border}`, padding: '6px 14px', borderRadius: '999px', fontSize: '12px', fontWeight: 600, color: F.inkSoft, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          Vorschlag 3 · Mathe-Skizze
        </span>
        <a href="/vorschlag/klassen" style={{ color: F.blue, textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>
          ← Vorschlag 1
        </a>
      </header>

      {/* HERO */}
      <section className="fade-up" style={{ padding: mobil ? '50px 22px' : '90px 56px' }}>
        <div style={{ maxWidth: '1320px', margin: '0 auto', display: 'grid', gridTemplateColumns: mobil ? '1fr' : '1fr 1.05fr', gap: mobil ? '40px' : '70px', alignItems: 'center' }}>
          {/* Left: text */}
          <div>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: F.bgSoft, border: `1px solid ${F.border}`, color: F.inkSoft, padding: '7px 14px', borderRadius: '999px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.06em', marginBottom: '28px', fontFamily: '"JetBrains Mono", monospace' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: F.green }} />
              DIE LERN-PLATTFORM · KLASSE 1—13
            </span>
            <h1 style={{ fontFamily: SANS, fontSize: mobil ? '44px' : '76px', fontWeight: 800, lineHeight: 1.0, margin: '0 0 22px', color: F.ink, letterSpacing: '-0.035em' }}>
              Mathe und Physik,<br />
              <span style={{ color: F.blue }}>Schritt für Schritt</span>.
            </h1>
            <p style={{ fontSize: mobil ? '17px' : '19px', color: F.inkSoft, lineHeight: 1.55, margin: '0 0 32px', maxWidth: '480px', fontWeight: 400 }}>
              Klasse 1 bis 13. Verständlich erklärt, gemacht zum Üben.
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }}>
              <a href="/shop" className="btn-primary">
                Kostenlos ausprobieren <span style={{ fontSize: '16px' }}>→</span>
              </a>
              <a href="/lernheld" className="btn-ghost">
                Wie funktioniert&apos;s?
              </a>
            </div>
            <p style={{ fontSize: '13px', color: F.inkMuted, fontWeight: 500 }}>
              13 Lernpakete · 61 Quiz-Themen · Sofort verfügbar · Ab 0,99 €
            </p>
          </div>

          {/* Right: animated SVG sketch */}
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'relative', aspectRatio: '4 / 3', background: F.bgSoft, borderRadius: '20px', border: `1px solid ${F.border}`, overflow: 'hidden', boxShadow: '0 20px 50px rgba(15,23,42,0.06)' }}>
              {/* Skizze-Label oben */}
              <div style={{ position: 'absolute', top: '20px', left: '24px', display: 'flex', gap: '8px', zIndex: 2 }}>
                {SKIZZEN.map((s) => (
                  <button key={s} onClick={() => setSkizze(s)} style={{
                    background: skizze === s ? F.navy : F.bg,
                    color: skizze === s ? F.white : F.inkSoft,
                    border: `1px solid ${skizze === s ? F.navy : F.border}`,
                    padding: '6px 12px',
                    borderRadius: '999px',
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    fontFamily: '"JetBrains Mono", monospace',
                    transition: 'all 0.2s ease',
                  }}>
                    {s}
                  </button>
                ))}
              </div>

              {/* SVG-Skizze */}
              <svg key={skizze} viewBox="0 0 600 450" style={{ width: '100%', height: '100%', display: 'block' }}>
                {skizze === 'pythagoras' && <PythagorasSkizze />}
                {skizze === 'parabel' && <ParabelSkizze />}
                {skizze === 'kraft' && <KraftSkizze />}
              </svg>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function PythagorasSkizze() {
  const blue = '#1769FF';
  const ink = '#0a0a0c';
  return (
    <g>
      {/* Triangle paths */}
      <path d="M 120 360 L 480 360" stroke={ink} strokeWidth="3" fill="none" strokeLinecap="round" className="draw-path" />
      <path d="M 480 360 L 480 140" stroke={ink} strokeWidth="3" fill="none" strokeLinecap="round" className="draw-path" style={{ animationDelay: '0.6s' }} />
      <path d="M 480 140 L 120 360" stroke={blue} strokeWidth="3" fill="none" strokeLinecap="round" className="draw-path" style={{ animationDelay: '1.2s' }} />
      {/* Right angle marker */}
      <rect x="460" y="340" width="20" height="20" fill="none" stroke={ink} strokeWidth="2" className="fade-in" style={{ animationDelay: '1.8s' }} />
      {/* Labels */}
      <text x="295" y="395" textAnchor="middle" fill={ink} fontFamily='"JetBrains Mono", monospace' fontSize="22" fontWeight="600" className="appear-1">
        a
      </text>
      <text x="505" y="260" fill={ink} fontFamily='"JetBrains Mono", monospace' fontSize="22" fontWeight="600" className="appear-2">
        b
      </text>
      <text x="280" y="225" fill={blue} fontFamily='"JetBrains Mono", monospace' fontSize="22" fontWeight="700" className="appear-3">
        c
      </text>
      {/* Formula */}
      <text x="60" y="80" fill={ink} fontFamily="Inter, sans-serif" fontSize="32" fontWeight="800" letterSpacing="-0.02em" className="appear-3">
        a² + b² = <tspan fill={blue}>c²</tspan>
      </text>
      <text x="60" y="115" fill="#52525b" fontFamily='"JetBrains Mono", monospace' fontSize="13" fontWeight="500" letterSpacing="0.06em" className="appear-3">
        SATZ DES PYTHAGORAS
      </text>
    </g>
  );
}

function ParabelSkizze() {
  const blue = '#1769FF';
  const ink = '#0a0a0c';
  // Build a parabola path y = x² scaled to viewBox
  const points: string[] = [];
  for (let x = -3; x <= 3; x += 0.15) {
    const px = 300 + x * 60;
    const py = 360 - (x * x) * 30;
    points.push(`${px},${py}`);
  }
  const parabolaPath = `M ${points[0]} L ${points.slice(1).join(' L ')}`;
  return (
    <g>
      {/* Axes */}
      <path d="M 60 360 L 540 360" stroke="#cbd5e1" strokeWidth="2" fill="none" strokeLinecap="round" className="fade-in" />
      <path d="M 300 80 L 300 400" stroke="#cbd5e1" strokeWidth="2" fill="none" strokeLinecap="round" className="fade-in" />
      <text x="546" y="365" fill="#94a3b8" fontFamily='"JetBrains Mono", monospace' fontSize="14" className="fade-in">x</text>
      <text x="288" y="74" fill="#94a3b8" fontFamily='"JetBrains Mono", monospace' fontSize="14" className="fade-in">y</text>
      {/* Parabola */}
      <path d={parabolaPath} stroke={blue} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" className="draw-path" style={{ animationDelay: '0.4s', animationDuration: '2.8s' }} />
      {/* Vertex point */}
      <circle cx="300" cy="360" r="5" fill={blue} className="appear-2" />
      <text x="312" y="380" fill={ink} fontFamily='"JetBrains Mono", monospace' fontSize="13" fontWeight="600" className="appear-2">
        Scheitel (0|0)
      </text>
      {/* Formula */}
      <text x="60" y="80" fill={ink} fontFamily="Inter, sans-serif" fontSize="32" fontWeight="800" letterSpacing="-0.02em" className="appear-3">
        y = <tspan fill={blue}>x²</tspan>
      </text>
      <text x="60" y="115" fill="#52525b" fontFamily='"JetBrains Mono", monospace' fontSize="13" fontWeight="500" letterSpacing="0.06em" className="appear-3">
        QUADRATISCHE FUNKTION
      </text>
    </g>
  );
}

function KraftSkizze() {
  const blue = '#1769FF';
  const ink = '#0a0a0c';
  return (
    <g>
      {/* Ground line */}
      <path d="M 80 320 L 520 320" stroke="#cbd5e1" strokeWidth="2" fill="none" strokeLinecap="round" className="fade-in" />
      {/* Hatches under ground */}
      {Array.from({ length: 14 }).map((_, i) => (
        <line key={i} x1={80 + i * 32} y1="320" x2={68 + i * 32} y2="340" stroke="#cbd5e1" strokeWidth="2" className="fade-in" />
      ))}
      {/* Box */}
      <rect x="220" y="240" width="80" height="80" stroke={ink} strokeWidth="3" fill={F.bgSoft} className="draw-path" style={{ strokeDasharray: 360, strokeDashoffset: 360, animationDelay: '0.3s' }} />
      <text x="260" y="288" textAnchor="middle" fill={ink} fontFamily='"JetBrains Mono", monospace' fontSize="14" fontWeight="700" className="appear-1">m</text>
      {/* Force arrow */}
      <path d="M 300 280 L 440 280" stroke={blue} strokeWidth="4" fill="none" strokeLinecap="round" className="draw-path" style={{ animationDelay: '1.0s', strokeDasharray: 160 }} />
      <path d="M 425 268 L 445 280 L 425 292" stroke={blue} strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" className="appear-2" />
      <text x="455" y="285" fill={blue} fontFamily='"JetBrains Mono", monospace' fontSize="22" fontWeight="700" className="appear-2">F</text>
      {/* Acceleration arrow (smaller) */}
      <path d="M 300 240 L 380 240" stroke={ink} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeDasharray="6 4" className="appear-2" />
      <path d="M 369 232 L 384 240 L 369 248" stroke={ink} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" className="appear-2" />
      <text x="392" y="245" fill={ink} fontFamily='"JetBrains Mono", monospace' fontSize="16" fontWeight="600" className="appear-2">a</text>
      {/* Formula */}
      <text x="60" y="80" fill={ink} fontFamily="Inter, sans-serif" fontSize="32" fontWeight="800" letterSpacing="-0.02em" className="appear-3">
        <tspan fill={blue}>F</tspan> = m · a
      </text>
      <text x="60" y="115" fill="#52525b" fontFamily='"JetBrains Mono", monospace' fontSize="13" fontWeight="500" letterSpacing="0.06em" className="appear-3">
        ZWEITES NEWTON-GESETZ
      </text>
    </g>
  );
}
