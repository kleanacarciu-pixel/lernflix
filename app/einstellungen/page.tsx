'use client';
// =============================================================================
// Einstellungen – Admin-Seite (nur Kleana)
//
// Schritt 1 des Vertragsabschlusses: die eigene Unterschrift hinterlegen.
// Sie wird danach automatisch in jede Vertrags-PDF eingebettet.
//
// Nutzt dieselbe Anmeldung wie der Kalender.
// =============================================================================
import { useCallback, useEffect, useRef, useState } from 'react';
import Anmeldehinweis from '@/components/Anmeldehinweis';
import { rufeApi, ladeSitzung } from '@/components/sitzung';
import { pruefeUnterschrift } from '@/lib/unterschrift-kern';

const F = {
  ink: '#0F172A', soft: '#475569', muted: '#94A3B8', line: '#E2E8F0',
  blue: '#1769FF', bg: '#fffdf8', weiss: '#fff', warn: '#a12a2a', gut: '#127a5c',
};

export default function EinstellungenSeite() {
  const [token, setToken] = useState('');
  const [laden, setLaden] = useState(true);
  const [fehler, setFehler] = useState('');
  const [hinweis, setHinweis] = useState('');
  const [abgemeldet, setAbgemeldet] = useState(false);

  const [unterschrift, setUnterschrift] = useState<string | null>(null);
  const [maxKb, setMaxKb] = useState(500);
  const [tipp, setTipp] = useState('');
  const dateiFeld = useRef<HTMLInputElement>(null);

  useEffect(() => { setToken(ladeSitzung()?.token || ''); }, []);

  const api = useCallback(async (action: string, params: Record<string, unknown> = {}) =>
    rufeApi('/api/einstellungen', action, params, () => setAbgemeldet(true)), []);

  const neuLaden = useCallback(async () => {
    if (!token) { setLaden(false); return; }
    setLaden(true);
    try {
      const d = await api('laden');
      setUnterschrift((d.unterschrift as string | null) ?? null);
      setMaxKb(Number(d.maxKb) || 500);
      setTipp(String(d.hinweis || ''));
    } catch (e) {
      setFehler(e instanceof Error ? e.message : 'Fehler beim Laden.');
    } finally { setLaden(false); }
  }, [api, token]);

  useEffect(() => { void neuLaden(); }, [neuLaden]);

  async function dateiGewaehlt(datei: File) {
    setFehler(''); setHinweis('');
    const uri = await new Promise<string>((fertig, schief) => {
      const leser = new FileReader();
      leser.onload = () => fertig(String(leser.result || ''));
      leser.onerror = () => schief(new Error('Die Datei ließ sich nicht lesen.'));
      leser.readAsDataURL(datei);
    }).catch((e: Error) => { setFehler(e.message); return ''; });
    if (!uri) return;

    // Schon im Browser prüfen – dann kommt der Hinweis sofort statt erst
    // nach dem Hochladen.
    const p = pruefeUnterschrift(uri);
    if (!p.ok) { setFehler(p.grund); return; }

    try {
      const d = await api('speichern', { unterschrift: p.datenUri });
      setUnterschrift(p.datenUri);
      setHinweis(`Unterschrift gespeichert (${d.art}, ${d.kb} KB). Sie erscheint ab jetzt in jedem Vertrag.`);
    } catch (e) { setFehler(e instanceof Error ? e.message : 'Fehler.'); }
  }

  if (!token || abgemeldet) {
    return (
      <main style={huelle}>
        <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 20px' }}>
          <div style={karte}>
            <h1 style={h1}>Einstellungen</h1>
            <Anmeldehinweis abgelaufen={abgemeldet} />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main style={huelle}>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 20px 60px' }}>
        <h1 style={h1}>Einstellungen</h1>
        <p style={{ color: F.soft, marginTop: 0 }}>
          <a href="/vertraege" style={{ color: F.blue }}>Verträge</a> ·{' '}
          <a href="/zahlungen" style={{ color: F.blue }}>Zahlungen</a> ·{' '}
          <a href="/schuljahr" style={{ color: F.blue }}>Schuljahr &amp; Ferien</a> ·{' '}
          <a href="/kalender" style={{ color: F.blue }}>Kalender</a>
        </p>

        {fehler && <div style={{ ...box, borderColor: '#f5b5b5', background: '#ffeaea', color: F.warn }}>{fehler}</div>}
        {hinweis && <div style={{ ...box, borderColor: 'rgba(18,122,92,.4)', background: 'rgba(18,122,92,.1)', color: F.gut }}>{hinweis}</div>}
        {laden && <p style={{ color: F.muted }}>Wird geladen …</p>}

        <section style={karte}>
          <h2 style={h2}>Deine Unterschrift</h2>
          <p style={{ color: F.soft, marginTop: 0, fontSize: 15 }}>
            Einmal hinterlegen – danach steht sie automatisch in jedem Vertrag, den
            das System erzeugt. Die Eltern unterschreiben später im Portal.
          </p>

          {unterschrift ? (
            <>
              <div style={{
                border: `1px solid ${F.line}`, borderRadius: 12, padding: 18,
                background: '#fff', display: 'inline-block', marginTop: 6,
              }}>
                {/* Bewusst ein einfaches img: die Unterschrift ist ein Daten-URI
                    aus der eigenen Datenbank, keine externe Bildquelle. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={unterschrift} alt="Hinterlegte Unterschrift"
                  style={{ maxWidth: 320, maxHeight: 120, display: 'block' }} />
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
                <button style={knopfKlein} onClick={() => dateiFeld.current?.click()}>
                  andere Unterschrift hochladen
                </button>
                <button style={{ ...knopfKlein, color: F.warn }}
                  onClick={() => {
                    if (!confirm('Unterschrift entfernen? Neue Verträge entstehen dann ohne deine Unterschrift.')) return;
                    setFehler(''); setHinweis('');
                    void api('loeschen')
                      .then(() => { setUnterschrift(null); setHinweis('Unterschrift entfernt.'); })
                      .catch((e: Error) => setFehler(e.message));
                  }}>
                  entfernen
                </button>
              </div>
            </>
          ) : (
            <>
              <div style={{
                border: `2px dashed ${F.line}`, borderRadius: 12, padding: '28px 18px',
                textAlign: 'center', color: F.muted, marginTop: 6,
              }}>
                Noch keine Unterschrift hinterlegt.
              </div>
              <button style={{ ...knopf, marginTop: 14 }} onClick={() => dateiFeld.current?.click()}>
                Unterschrift hochladen
              </button>
            </>
          )}

          <input ref={dateiFeld} type="file" accept="image/png,image/jpeg" style={{ display: 'none' }}
            onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ''; if (f) void dateiGewaehlt(f); }} />

          <p style={{ color: F.muted, fontSize: 13, marginTop: 16, lineHeight: 1.6 }}>
            {tipp || 'PNG oder JPG.'}<br />
            Höchstens {maxKb} KB.
          </p>
        </section>
      </div>
    </main>
  );
}

const huelle: React.CSSProperties = {
  minHeight: '100vh', background: F.bg, color: F.ink,
  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif', padding: '28px 0',
};
const karte: React.CSSProperties = {
  background: F.weiss, border: `1px solid ${F.line}`, borderRadius: 16,
  padding: '20px 22px', margin: '18px 0',
};
const box: React.CSSProperties = { border: '1px solid', borderRadius: 10, padding: '12px 14px', margin: '12px 0' };
const h1: React.CSSProperties = { fontSize: 28, fontWeight: 800, margin: '0 0 4px' };
const h2: React.CSSProperties = { fontSize: 19, fontWeight: 700, margin: '0 0 12px' };
const knopf: React.CSSProperties = {
  font: 'inherit', fontWeight: 600, padding: '9px 18px', border: 0,
  borderRadius: 9, background: F.blue, color: '#fff', cursor: 'pointer',
};
const knopfKlein: React.CSSProperties = {
  font: 'inherit', fontSize: 14, fontWeight: 600, padding: '6px 12px',
  border: `1px solid ${F.line}`, borderRadius: 8, background: F.weiss,
  color: F.blue, cursor: 'pointer',
};
