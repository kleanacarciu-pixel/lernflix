'use client';
import { useState } from 'react';

// Farben wie im Shop (app/shop/page.tsx) — blau, konsistent.
const F = {
  bg: '#FAFCFF',
  white: '#ffffff',
  ink: '#0F172A',
  inkSoft: '#475569',
  inkMuted: '#94A3B8',
  border: '#E2E8F0',
  blue: '#1769FF',
  blueDeep: '#1156DD',
  blueSoft: '#E8F0FF',
  green: '#10B981',
};
const SANS = '"Inter", -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';

const KAPITEL = [
  'Natürliche Zahlen & Stellenwert', 'Rechnen mit großen Zahlen', 'Teilbarkeit & Primzahlen',
  'Brüche verstehen', 'Brüche addieren & subtrahieren', 'Brüche multiplizieren & dividieren',
  'Dezimalzahlen', 'Größen & Einheiten umrechnen', 'Flächen & Umfang',
  'Winkel & geometrische Grundformen', 'Diagramme & Daten', 'Sachaufgaben & Textverständnis',
];

const HIGHLIGHTS = [
  { icon: '📖', t: '12 Kapitel', s: 'Der komplette Stoff für Mathe Klasse 6 (Gymnasium Bayern), klar aufgebaut.' },
  { icon: '✏️', t: 'Über 150 Übungen', s: 'Mit ausführlichen Lösungen — vom Aufwärmen bis zum Schulaufgaben-Niveau.' },
  { icon: '📝', t: 'Prüfungssimulation', s: 'Eine komplette Probe-Schulaufgabe inkl. Notenschlüssel zum Selbstbewerten.' },
  { icon: '🗓️', t: '3-Wochen-Plan', s: 'Tag-für-Tag-Fahrplan für die Nachprüfung oder die nächste Schulaufgabe.' },
];

export default function HeftPage() {
  const [laeuft, setLaeuft] = useState(false);
  const [fehler, setFehler] = useState<string | null>(null);

  async function kaufen() {
    setLaeuft(true);
    setFehler(null);
    try {
      const res = await fetch('/api/checkout-heft', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
      const data = await res.json().catch(() => null);
      if (data && data.url) {
        window.location.href = data.url;
      } else {
        setFehler(data?.error || 'Die Bezahlung konnte nicht gestartet werden.');
        setLaeuft(false);
      }
    } catch {
      setFehler('Es gab ein Problem. Bitte versuche es gleich noch einmal.');
      setLaeuft(false);
    }
  }

  return (
    <main style={{ background: F.bg, minHeight: '100vh', fontFamily: SANS, color: F.ink }}>
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '28px 20px 80px' }}>
        <a href="/shop" style={{ color: F.inkSoft, textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>← Zurück zum Shop</a>

        {/* HERO */}
        <section style={{ marginTop: '22px', background: F.white, border: `1px solid ${F.border}`, borderRadius: '24px', padding: '38px 32px', boxShadow: '0 20px 50px rgba(15,23,42,0.06)' }}>
          <span style={{ display: 'inline-block', background: F.blueSoft, color: F.blueDeep, fontSize: '12.5px', fontWeight: 700, padding: '6px 12px', borderRadius: '999px', letterSpacing: '.02em' }}>PDF-Heft · Gymnasium Bayern</span>
          <h1 style={{ fontSize: 'clamp(26px, 5vw, 38px)', lineHeight: 1.15, margin: '16px 0 10px', letterSpacing: '-0.02em' }}>
            Das Masterclass-Heft<br />— Mathe Klasse 6
          </h1>
          <p style={{ fontSize: '17px', lineHeight: 1.6, color: F.inkSoft, margin: '0 0 24px', maxWidth: '620px' }}>
            Der komplette Stoff der 6. Klasse in einem Heft — mit über 150 Übungen samt Lösungen,
            einer Prüfungssimulation mit Notenschlüssel und einem 3-Wochen-Plan. Ideal für die
            <strong> Nachprüfung</strong> und die nächste <strong>Schulaufgabe</strong>.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{ fontSize: '40px', fontWeight: 800, letterSpacing: '-0.03em' }}>12,90&nbsp;€</div>
            <div style={{ fontSize: '13px', color: F.inkMuted, lineHeight: 1.4 }}>Einmalige Zahlung<br />Sofort-Download als PDF</div>
            <button onClick={kaufen} disabled={laeuft} style={{ marginLeft: 'auto', background: laeuft ? F.blueDeep : F.blue, color: F.white, border: 'none', borderRadius: '14px', padding: '16px 32px', fontSize: '16px', fontWeight: 700, cursor: laeuft ? 'default' : 'pointer', fontFamily: SANS, boxShadow: '0 10px 28px rgba(23,105,255,0.32)', opacity: laeuft ? 0.85 : 1 }}>
              {laeuft ? 'Weiterleitung …' : 'Jetzt kaufen'}
            </button>
          </div>
          {fehler && <p style={{ margin: '16px 0 0', color: '#DC2626', fontSize: '14px', fontWeight: 600 }}>{fehler}</p>}
        </section>

        {/* VORSCHAU (Platzhalter — durch echte Bilder ersetzen, s. unten) */}
        <section style={{ marginTop: '30px' }}>
          <h2 style={{ fontSize: '20px', margin: '0 0 14px' }}>Ein Blick ins Heft</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
            {[1, 2, 3].map((n) => (
              // TODO: durch echte Vorschau ersetzen, z.B.
              // <img src={`/heft-vorschau-${n}.png`} alt={`Vorschau Seite ${n}`} width={420} height={594} loading="lazy" style={{width:'100%',height:'auto',borderRadius:'12px',border:`1px solid ${F.border}`}} />
              <div key={n} style={{ aspectRatio: '210/297', background: `repeating-linear-gradient(135deg, ${F.white}, ${F.white} 12px, ${F.blueSoft} 12px, ${F.blueSoft} 24px)`, border: `1px solid ${F.border}`, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: F.inkMuted, fontSize: '13px', fontWeight: 600, textAlign: 'center', padding: '10px' }}>
                Vorschau<br />Seite {n}
              </div>
            ))}
          </div>
          <p style={{ fontSize: '12.5px', color: F.inkMuted, margin: '8px 0 0' }}>Vorschau der ersten 3 Seiten.</p>
        </section>

        {/* HIGHLIGHTS */}
        <section style={{ marginTop: '34px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '14px' }}>
          {HIGHLIGHTS.map((h) => (
            <div key={h.t} style={{ background: F.white, border: `1px solid ${F.border}`, borderRadius: '16px', padding: '20px 22px' }}>
              <div style={{ fontSize: '26px', marginBottom: '8px' }}>{h.icon}</div>
              <div style={{ fontSize: '16px', fontWeight: 700, marginBottom: '4px' }}>{h.t}</div>
              <div style={{ fontSize: '14px', color: F.inkSoft, lineHeight: 1.55 }}>{h.s}</div>
            </div>
          ))}
        </section>

        {/* KAPITEL */}
        <section style={{ marginTop: '34px', background: F.white, border: `1px solid ${F.border}`, borderRadius: '20px', padding: '28px 30px' }}>
          <h2 style={{ fontSize: '20px', margin: '0 0 16px' }}>Die 12 Kapitel</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px 22px' }}>
            {KAPITEL.map((k, i) => (
              <div key={k} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px', color: F.ink }}>
                <span style={{ flexShrink: 0, width: '26px', height: '26px', borderRadius: '8px', background: F.blueSoft, color: F.blueDeep, fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{i + 1}</span>
                {k}
              </div>
            ))}
          </div>
        </section>

        {/* CTA unten */}
        <section style={{ marginTop: '34px', textAlign: 'center', background: F.ink, borderRadius: '20px', padding: '38px 30px', color: F.white }}>
          <h2 style={{ fontSize: '22px', margin: '0 0 8px' }}>Bereit für die nächste Schulaufgabe?</h2>
          <p style={{ fontSize: '15px', color: '#CBD5E1', margin: '0 0 22px' }}>Sofort als PDF nach dem Kauf — die Bestätigung mit Download-Link kommt zusätzlich per E-Mail.</p>
          <button onClick={kaufen} disabled={laeuft} style={{ background: F.blue, color: F.white, border: 'none', borderRadius: '14px', padding: '16px 34px', fontSize: '16px', fontWeight: 700, cursor: laeuft ? 'default' : 'pointer', fontFamily: SANS, opacity: laeuft ? 0.85 : 1 }}>
            {laeuft ? 'Weiterleitung …' : 'Heft für 12,90 € kaufen'}
          </button>
        </section>
      </div>
    </main>
  );
}
