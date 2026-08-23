'use client';
// =============================================================================
// Bestätigungsseite für das Vertragsangebot
//
// Eltern öffnen sie über den Link aus der E-Mail – ohne Konto und ohne
// Anmeldung. Der Token im Pfad ist signiert und 14 Tage gültig.
// =============================================================================
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { PFLICHT_HAKEN } from '@/lib/vertrag-texte';

const WOCHENTAGE = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];

const F = {
  ink: '#0F172A', soft: '#475569', muted: '#94A3B8', line: '#E2E8F0',
  teal: '#2BB3C0', bg: '#fffdf8', weiss: '#fff', warn: '#a12a2a', gut: '#127a5c',
};

type Posten = { wochentag: number; anzahl: number; satzCent: number; summeCent: number; voll: boolean };
type Rate = { monat: string; betragCent: number };
type Daten = {
  schuelerName: string; schuljahr: string; zeitText: string;
  termine: string[]; posten: Posten[]; jahresbetragCent: number;
  raten: Rate[]; einmalCent: number;
  bereitsBestaetigt: boolean;
  bank: { inhaber: string; iban: string; bank: string };
};

const eur = (c: number) => (c / 100).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
const datumDe = (iso: string) => { const [j, m, t] = iso.split('-'); return `${t}.${m}.${j}`; };
const monatName = (iso: string) => {
  const [j, m] = iso.split('-');
  return `${['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'][Number(m) - 1]} ${j}`;
};

export default function VertragBestaetigen() {
  const params = useParams<{ token: string }>();
  const token = String(params?.token || '');

  const [daten, setDaten] = useState<Daten | null>(null);
  const [fehler, setFehler] = useState('');
  const [laden, setLaden] = useState(true);
  const [fertig, setFertig] = useState(false);
  const [sendet, setSendet] = useState(false);

  const [zahlweise, setZahlweise] = useState<'raten' | 'einmal'>('raten');
  const [haken, setHaken] = useState<Record<string, boolean>>({});
  const [alleTermine, setAlleTermine] = useState(false);

  const api = useCallback(async (action: string, extra: Record<string, unknown> = {}) => {
    const res = await fetch('/api/vertrag', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, vertragToken: token, ...extra }),
    });
    const d = (await res.json().catch(() => ({}))) as Record<string, unknown>;
    if (!res.ok || !d.ok) throw new Error(String(d.error || 'Das hat nicht geklappt.'));
    return d;
  }, [token]);

  useEffect(() => {
    (async () => {
      try {
        const d = (await api('laden')) as unknown as Daten;
        setDaten(d);
        if (d.bereitsBestaetigt) setFertig(true);
      } catch (e) {
        setFehler(e instanceof Error ? e.message : 'Fehler beim Laden.');
      } finally { setLaden(false); }
    })();
  }, [api]);

  const alleGehakt = PFLICHT_HAKEN.every((h) => haken[h.id]);

  async function bestaetigen() {
    if (!alleGehakt || sendet) return;
    setSendet(true); setFehler('');
    try {
      await api('bestaetigen', { zahlweise, agb: true, widerruf: true, beginn: true });
      setFertig(true);
    } catch (e) {
      setFehler(e instanceof Error ? e.message : 'Fehler.');
    } finally { setSendet(false); }
  }

  if (laden) return <Huelle><p style={{ color: F.muted }}>Wird geladen …</p></Huelle>;

  if (fehler && !daten) return (
    <Huelle>
      <h1 style={h1}>Vertragsangebot</h1>
      <div style={{ ...box, borderColor: '#f5b5b5', background: '#ffeaea', color: F.warn }}>{fehler}</div>
      <p style={{ color: F.soft }}>Melde dich einfach kurz bei Anna, dann bekommst du einen neuen Link.</p>
    </Huelle>
  );

  if (!daten) return null;

  if (fertig) return (
    <Huelle>
      <div style={{ textAlign: 'center', padding: '20px 0' }}>
        <div style={{ fontSize: 44 }}>✓</div>
        <h1 style={{ ...h1, marginTop: 8 }}>Vertrag bestätigt</h1>
        <p style={{ color: F.soft, maxWidth: 480, margin: '0 auto 22px' }}>
          Danke! Du bekommst gleich eine E-Mail mit den AGB, der Terminliste für das ganze
          Schuljahr und der Vertragsbestätigung mit den Überweisungsdaten.
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a style={knopfHell} href={`/api/vertrag?pdf=${token}&art=terminliste`} target="_blank" rel="noopener">Terminliste (PDF)</a>
          <a style={knopfHell} href={`/api/vertrag?pdf=${token}&art=bestaetigung`} target="_blank" rel="noopener">Vertragsbestätigung (PDF)</a>
        </div>
      </div>
    </Huelle>
  );

  const sichtbareTermine = alleTermine ? daten.termine : daten.termine.slice(0, 12);

  return (
    <Huelle>
      <p style={{ color: F.teal, fontWeight: 700, fontSize: 13, letterSpacing: '.04em', margin: 0 }}>LERNE MIT ANNA</p>
      <h1 style={h1}>Vertragsangebot Schuljahr {daten.schuljahr}</h1>
      <p style={{ color: F.soft, marginTop: 0 }}>für {daten.schuelerName}</p>

      {fehler && <div style={{ ...box, borderColor: '#f5b5b5', background: '#ffeaea', color: F.warn }}>{fehler}</div>}

      {/* Termin und Betrag */}
      <section style={karte}>
        <h2 style={h2}>Dein fester Termin</h2>
        <p style={{ fontSize: 18, fontWeight: 700, margin: '0 0 4px' }}>{daten.zeitText}</p>
        <p style={{ color: F.soft, margin: 0 }}>{daten.termine.length} Termine im Schuljahr</p>

        <div style={{ marginTop: 18, paddingTop: 16, borderTop: `1px solid ${F.line}` }}>
          {daten.posten.map((p) => (
            <Zeile key={p.wochentag}
              links={`${WOCHENTAGE[p.wochentag]}: ${p.anzahl} × ${eur(p.satzCent)}`}
              rechts={eur(p.summeCent)} />
          ))}
          <Zeile links="Jahresbetrag" rechts={eur(daten.jahresbetragCent)} fett />
        </div>
      </section>

      {/* Zahlweise */}
      <section style={karte}>
        <h2 style={h2}>Zahlweise wählen</h2>
        <Wahl
          gewaehlt={zahlweise === 'raten'} onWahl={() => setZahlweise('raten')}
          titel={`${daten.raten.length} Monatsraten à ${eur(daten.raten[0]?.betragCent ?? 0)}`}
          text="Jeweils vom 1. bis 10. des Monats, letztmalig im Juli. Der August ist zahlungsfrei." />
        <Wahl
          gewaehlt={zahlweise === 'einmal'} onWahl={() => setZahlweise('einmal')}
          titel={`Einmalzahlung ${eur(daten.einmalCent)}`}
          text="50,00 € Nachlass. Fällig innerhalb von 14 Tagen nach der Bestätigung." />

        {zahlweise === 'raten' && (
          <details style={{ marginTop: 12 }}>
            <summary style={{ cursor: 'pointer', color: F.teal, fontWeight: 600, fontSize: 14 }}>
              Alle Raten anzeigen
            </summary>
            <div style={{ marginTop: 10 }}>
              {daten.raten.map((r) => <Zeile key={r.monat} links={monatName(r.monat)} rechts={eur(r.betragCent)} />)}
            </div>
          </details>
        )}
      </section>

      {/* Terminliste */}
      <section style={karte}>
        <h2 style={h2}>Alle Termine</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(110px,1fr))', gap: 6 }}>
          {sichtbareTermine.map((t) => (
            <span key={t} style={{ fontSize: 14, color: F.soft }}>{datumDe(t)}</span>
          ))}
        </div>
        {daten.termine.length > 12 && (
          <button style={{ ...knopfHell, marginTop: 12 }} onClick={() => setAlleTermine(!alleTermine)}>
            {alleTermine ? 'weniger anzeigen' : `alle ${daten.termine.length} Termine anzeigen`}
          </button>
        )}
        <p style={{ marginTop: 12 }}>
          <a href={`/api/vertrag?pdf=${token}&art=terminliste`} target="_blank" rel="noopener"
            style={{ color: F.teal, fontWeight: 600, fontSize: 14 }}>Terminliste als PDF öffnen</a>
        </p>
      </section>

      {/* Pflicht-Häkchen */}
      <section style={karte}>
        <h2 style={h2}>Bestätigung</h2>
        {PFLICHT_HAKEN.map((h) => (
          <label key={h.id} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 14, cursor: 'pointer' }}>
            <input type="checkbox" checked={!!haken[h.id]} style={{ marginTop: 4, width: 18, height: 18, flexShrink: 0 }}
              onChange={(e) => setHaken((s) => ({ ...s, [h.id]: e.target.checked }))} />
            <span style={{ fontSize: 14.5, lineHeight: 1.6, color: F.ink }}>
              {h.text}{' '}
              {'link' in h && h.link && (
                <a href={h.link} target="_blank" rel="noopener" style={{ color: F.teal, fontWeight: 600 }}>
                  ({h.linkText})
                </a>
              )}
            </span>
          </label>
        ))}

        <button onClick={bestaetigen} disabled={!alleGehakt || sendet}
          style={{ ...knopf, width: '100%', opacity: alleGehakt && !sendet ? 1 : 0.45, cursor: alleGehakt && !sendet ? 'pointer' : 'not-allowed' }}>
          {sendet ? 'Wird gesendet …' : 'Vertrag verbindlich bestätigen'}
        </button>
        {!alleGehakt && (
          <p style={{ color: F.muted, fontSize: 13, textAlign: 'center', marginTop: 10 }}>
            Bitte bestätige alle drei Punkte.
          </p>
        )}
      </section>

      <p style={{ color: F.muted, fontSize: 13, textAlign: 'center' }}>
        Fragen? Schreib einfach an <a href="mailto:lernemitanna@outlook.com" style={{ color: F.teal }}>lernemitanna@outlook.com</a>
      </p>
    </Huelle>
  );
}

// --- Bausteine --------------------------------------------------------------

function Huelle({ children }: { children: React.ReactNode }) {
  return (
    <main style={{
      minHeight: '100vh', background: F.bg, color: F.ink, padding: '32px 18px 60px',
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
    }}>
      <div style={{ maxWidth: 620, margin: '0 auto' }}>{children}</div>
    </main>
  );
}

function Zeile({ links, rechts, fett }: { links: string; rechts: string; fett?: boolean }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', gap: 12, padding: '6px 0',
      fontWeight: fett ? 700 : 400, fontSize: fett ? 16 : 15,
      borderTop: fett ? `1px solid ${F.line}` : undefined, marginTop: fett ? 8 : 0, paddingTop: fett ? 12 : 6,
    }}>
      <span style={{ color: fett ? F.ink : F.soft }}>{links}</span>
      <span>{rechts}</span>
    </div>
  );
}

function Wahl({ gewaehlt, onWahl, titel, text }: { gewaehlt: boolean; onWahl: () => void; titel: string; text: string }) {
  return (
    <label style={{
      display: 'flex', gap: 12, alignItems: 'flex-start', padding: '14px 16px', marginBottom: 10,
      border: `2px solid ${gewaehlt ? F.teal : F.line}`, borderRadius: 12, cursor: 'pointer',
      background: gewaehlt ? 'rgba(43,179,192,.06)' : F.weiss,
    }}>
      <input type="radio" checked={gewaehlt} onChange={onWahl} style={{ marginTop: 3, width: 18, height: 18 }} />
      <span>
        <span style={{ fontWeight: 700, display: 'block' }}>{titel}</span>
        <span style={{ color: F.soft, fontSize: 14 }}>{text}</span>
      </span>
    </label>
  );
}

const h1: React.CSSProperties = { fontSize: 27, fontWeight: 800, margin: '4px 0 2px', letterSpacing: '-0.02em' };
const h2: React.CSSProperties = { fontSize: 17, fontWeight: 700, margin: '0 0 12px' };
const karte: React.CSSProperties = {
  background: F.weiss, border: `1px solid ${F.line}`, borderRadius: 16, padding: '20px 22px', margin: '16px 0',
};
const box: React.CSSProperties = { border: '1px solid', borderRadius: 10, padding: '12px 14px', margin: '12px 0' };
const knopf: React.CSSProperties = {
  font: 'inherit', fontWeight: 700, fontSize: 16, padding: '14px 22px', border: 0,
  borderRadius: 12, background: F.teal, color: '#fff',
};
const knopfHell: React.CSSProperties = {
  font: 'inherit', fontSize: 14, fontWeight: 600, padding: '9px 16px', textDecoration: 'none',
  border: `1px solid ${F.line}`, borderRadius: 9, background: F.weiss, color: F.teal, cursor: 'pointer',
  display: 'inline-block',
};
