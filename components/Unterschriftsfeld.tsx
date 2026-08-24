'use client';
// =============================================================================
// Unterschrift aus dem Namen schreiben lassen
//
// Gezeichnet wird im Browser mit der Schrift Caveat, die im Projekt liegt
// (public/fonts) – nichts wird von fremden Servern geladen. Das Ergebnis ist
// ein PNG mit durchsichtigem Hintergrund und geht denselben Weg wie ein Foto.
//
// Liegt hier und nicht in einer Seite, weil es an zwei Stellen gebraucht wird:
// in den Einstellungen und direkt auf der Verträge-Seite, wenn dort auffällt,
// dass noch keine Unterschrift hinterlegt ist.
// =============================================================================
import { useCallback, useEffect, useRef, useState } from 'react';

const F = { ink: '#0F172A', soft: '#475569', line: '#E2E8F0', weiss: '#fff', blue: '#1769FF' };

export default function Unterschriftsfeld({ startName = 'Kleana C', knopfText = 'diese Unterschrift übernehmen', uebernehmen }: {
  startName?: string;
  knopfText?: string;
  uebernehmen: (datenUri: string) => void | Promise<void>;
}) {
  const [name, setName] = useState(startName);
  const [entwurf, setEntwurf] = useState<string | null>(null);
  const leinwand = useRef<HTMLCanvasElement>(null);

  const zeichnen = useCallback(async () => {
    const c = leinwand.current;
    if (!c || !name.trim()) { setEntwurf(null); return; }
    try { await document.fonts.load('600 96px Caveat'); await document.fonts.ready; } catch { /* Ersatzschrift */ }

    const ctx = c.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.font = '600 96px Caveat, "Segoe Script", cursive';
    ctx.fillStyle = '#1a2a4a';          // dunkles Tintenblau
    ctx.textBaseline = 'middle';

    // Leicht schräg stellen – das wirkt wie mit der Hand geschrieben.
    ctx.save();
    ctx.translate(24, c.height / 2 + 4);
    ctx.rotate(-0.045);
    ctx.fillText(name.trim(), 0, 0);
    ctx.restore();

    setEntwurf(c.toDataURL('image/png'));
  }, [name]);

  useEffect(() => { void zeichnen(); }, [zeichnen]);

  return (
    <>
      <label style={{ display: 'flex', flexDirection: 'column', gap: 5, fontSize: 13, fontWeight: 600, color: F.soft, maxWidth: 280 }}>
        Name für die Unterschrift
        <input value={name} onChange={(e) => setName(e.target.value)}
          style={{
            font: 'inherit', fontWeight: 400, color: F.ink, padding: '9px 11px',
            border: `1px solid ${F.line}`, borderRadius: 9, background: F.weiss,
          }} />
      </label>

      <div style={{
        border: `1px solid ${F.line}`, borderRadius: 12, padding: 14,
        background: F.weiss, marginTop: 14, display: 'inline-block',
      }}>
        <canvas ref={leinwand} width={520} height={150}
          style={{ width: 320, height: 92, display: 'block', maxWidth: '100%' }} />
      </div>

      <div style={{ marginTop: 14 }}>
        <button disabled={!entwurf} onClick={() => { if (entwurf) void uebernehmen(entwurf); }}
          style={{
            font: 'inherit', fontWeight: 600, padding: '9px 18px', border: 0, borderRadius: 9,
            background: entwurf ? F.blue : F.line, color: entwurf ? '#fff' : F.soft,
            cursor: entwurf ? 'pointer' : 'not-allowed',
          }}>
          {knopfText}
        </button>
      </div>
    </>
  );
}
