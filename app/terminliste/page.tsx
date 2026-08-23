'use client';
// =============================================================================
// Terminliste im Portal
//
// Zeigt angemeldeten Schülern und Eltern alle Termine des Schuljahres,
// die Beträge und die Dokumente zum Herunterladen.
// Nutzt dieselbe Anmeldung wie der Kalender.
// =============================================================================
import { useCallback, useEffect, useState } from 'react';

const LS_KEY = 'lma_kal_session';

const F = {
  ink: '#0F172A', soft: '#475569', muted: '#94A3B8', line: '#E2E8F0',
  teal: '#2BB3C0', bg: '#fffdf8', weiss: '#fff',
};

type Rate = { monat: string; betragCent: number };
type Vertragsdaten = {
  schuelerName: string; schuljahr: string; zeitText: string;
  termine: string[]; jahresbetragCent: number;
  zahlweise: 'raten' | 'einmal'; raten: Rate[]; einmalCent: number;
  bestaetigt: boolean;
};

const eur = (c: number) => (c / 100).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
const datumDe = (iso: string) => { const [j, m, t] = iso.split('-'); return `${t}.${m}.${j}`; };
const monatName = (iso: string) => {
  const [j, m] = iso.split('-');
  return `${['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'][Number(m) - 1]} ${j}`;
};
const heute = () => new Date().toISOString().slice(0, 10);

export default function TerminlisteSeite() {
  const [token, setToken] = useState('');
  const [daten, setDaten] = useState<Vertragsdaten | null>(null);
  const [laden, setLaden] = useState(true);
  const [fehler, setFehler] = useState('');
  const [alle, setAlle] = useState(false);

  useEffect(() => {
    try {
      const roh = localStorage.getItem(LS_KEY);
      if (roh) setToken((JSON.parse(roh) as { token?: string }).token || '');
      else setLaden(false);
    } catch { setLaden(false); }
  }, []);

  const holen = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/vertrag', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'meinVertrag', token }),
      });
      const d = (await res.json().catch(() => ({}))) as Record<string, unknown>;
      if (!res.ok || !d.ok) throw new Error(String(d.error || 'Das hat nicht geklappt.'));
      setDaten((d.vertrag as Vertragsdaten) ?? null);
    } catch (e) {
      setFehler(e instanceof Error ? e.message : 'Fehler beim Laden.');
    } finally { setLaden(false); }
  }, [token]);

  useEffect(() => { void holen(); }, [holen]);

  if (!token && !laden) return (
    <Huelle>
      <h1 style={h1}>Terminliste</h1>
      <p style={{ color: F.soft }}>
        Bitte zuerst im <a href="/kalender" style={{ color: F.teal }}>Kalender</a> anmelden.
      </p>
    </Huelle>
  );

  if (laden) return <Huelle><p style={{ color: F.muted }}>Wird geladen …</p></Huelle>;

  if (fehler) return (
    <Huelle>
      <h1 style={h1}>Terminliste</h1>
      <div style={{ border: '1px solid #f5b5b5', background: '#ffeaea', color: '#a12a2a', borderRadius: 10, padding: '12px 14px' }}>{fehler}</div>
    </Huelle>
  );

  if (!daten) return (
    <Huelle>
      <h1 style={h1}>Terminliste</h1>
      <p style={{ color: F.soft }}>
        Für dich ist noch kein Schuljahresvertrag hinterlegt. Sobald Anna einen anlegt,
        findest du hier alle Termine des Schuljahres.
      </p>
      <p><a href="/kalender" style={{ color: F.teal, fontWeight: 600 }}>← Zum Kalender</a></p>
    </Huelle>
  );

  const kommende = daten.termine.filter((t) => t >= heute());
  const naechster = kommende[0];
  const sichtbar = alle ? daten.termine : kommende.slice(0, 15);

  return (
    <Huelle>
      <a href="/kalender" style={{ color: F.soft, textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>← Zum Kalender</a>
      <h1 style={h1}>Terminliste {daten.schuljahr}</h1>
      <p style={{ color: F.soft, marginTop: 0 }}>{daten.schuelerName} · {daten.zeitText}</p>

      <section style={karte}>
        <div style={{ display: 'flex', gap: 26, flexWrap: 'wrap' }}>
          <Kennzahl wert={String(daten.termine.length)} text="Termine im Schuljahr" />
          <Kennzahl wert={String(kommende.length)} text="noch offen" />
          {naechster && <Kennzahl wert={datumDe(naechster)} text="nächster Termin" />}
        </div>
      </section>

      <section style={karte}>
        <h2 style={h2}>{alle ? 'Alle Termine' : 'Nächste Termine'}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(112px,1fr))', gap: 7 }}>
          {sichtbar.map((t) => (
            <span key={t} style={{
              fontSize: 14, padding: '5px 9px', borderRadius: 7,
              background: t < heute() ? '#f4f4f4' : 'rgba(43,179,192,.09)',
              color: t < heute() ? F.muted : F.ink,
              textDecoration: t < heute() ? 'line-through' : 'none',
            }}>{datumDe(t)}</span>
          ))}
        </div>
        <button style={{ ...knopfHell, marginTop: 14 }} onClick={() => setAlle(!alle)}>
          {alle ? 'nur die nächsten anzeigen' : `alle ${daten.termine.length} Termine anzeigen`}
        </button>
      </section>

      <section style={karte}>
        <h2 style={h2}>Beträge</h2>
        <Zeile links="Jahresbetrag" rechts={eur(daten.jahresbetragCent)} fett />
        {daten.zahlweise === 'einmal' ? (
          <Zeile links="Einmalzahlung" rechts={eur(daten.einmalCent)} />
        ) : (
          <details style={{ marginTop: 10 }}>
            <summary style={{ cursor: 'pointer', color: F.teal, fontWeight: 600, fontSize: 14 }}>
              {daten.raten.length} Monatsraten anzeigen
            </summary>
            <div style={{ marginTop: 8 }}>
              {daten.raten.map((r) => <Zeile key={r.monat} links={monatName(r.monat)} rechts={eur(r.betragCent)} />)}
            </div>
          </details>
        )}
      </section>

      <section style={karte}>
        <h2 style={h2}>Dokumente</h2>
        <div style={{ display: 'flex', gap: 9, flexWrap: 'wrap' }}>
          <a style={knopfHell} href={`/api/vertrag?sitzung=${encodeURIComponent(token)}&art=terminliste`} target="_blank" rel="noopener">Terminliste (PDF)</a>
          {daten.bestaetigt && (
            <a style={knopfHell} href={`/api/vertrag?sitzung=${encodeURIComponent(token)}&art=bestaetigung`} target="_blank" rel="noopener">Vertragsbestätigung (PDF)</a>
          )}
          <a style={knopfHell} href={`/api/vertrag?sitzung=${encodeURIComponent(token)}&art=agb`} target="_blank" rel="noopener">AGB (PDF)</a>
        </div>
      </section>
    </Huelle>
  );
}

function Huelle({ children }: { children: React.ReactNode }) {
  return (
    <main style={{
      minHeight: '100vh', background: F.bg, color: F.ink, padding: '30px 18px 60px',
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
    }}>
      <div style={{ maxWidth: 680, margin: '0 auto' }}>{children}</div>
    </main>
  );
}

function Kennzahl({ wert, text }: { wert: string; text: string }) {
  return (
    <div>
      <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.02em' }}>{wert}</div>
      <div style={{ color: F.soft, fontSize: 13 }}>{text}</div>
    </div>
  );
}

function Zeile({ links, rechts, fett }: { links: string; rechts: string; fett?: boolean }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', gap: 12, padding: '6px 0',
      fontWeight: fett ? 700 : 400, fontSize: fett ? 16 : 15,
    }}>
      <span style={{ color: fett ? F.ink : F.soft }}>{links}</span>
      <span>{rechts}</span>
    </div>
  );
}

const h1: React.CSSProperties = { fontSize: 27, fontWeight: 800, margin: '10px 0 2px', letterSpacing: '-0.02em' };
const h2: React.CSSProperties = { fontSize: 17, fontWeight: 700, margin: '0 0 12px' };
const karte: React.CSSProperties = {
  background: F.weiss, border: `1px solid ${F.line}`, borderRadius: 16, padding: '20px 22px', margin: '16px 0',
};
const knopfHell: React.CSSProperties = {
  font: 'inherit', fontSize: 14, fontWeight: 600, padding: '9px 16px', textDecoration: 'none',
  border: `1px solid ${F.line}`, borderRadius: 9, background: F.weiss, color: F.teal,
  cursor: 'pointer', display: 'inline-block',
};
