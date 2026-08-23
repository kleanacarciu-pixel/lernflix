'use client';
// =============================================================================
// Schuljahr & Ferien – Admin-Seite (nur Kleana)
// Pflegt Schuljahre, Schulen mit abweichenden Ferien und unterrichtsfreie Tage.
// Nutzt dieselbe Anmeldung wie der Kalender (Sitzung aus dem Browserspeicher).
// =============================================================================
import { useCallback, useEffect, useState } from 'react';

const LS_KEY = 'lma_kal_session';

type Schuljahr = { id: string; name: string; erster_schultag: string; letzter_schultag: string; aktiv: boolean };
type Schule = { id: string; name: string };
type FreierTag = {
  id: string; schuljahr_id: string; schule_id: string | null;
  bezeichnung: string; datum_von: string; datum_bis: string; ist_feiertag: boolean;
};

const F = {
  ink: '#0F172A', soft: '#475569', muted: '#94A3B8', line: '#E2E8F0',
  blue: '#1769FF', bg: '#fffdf8', weiss: '#fff', warn: '#a12a2a', gut: '#127a5c',
};

function datumDe(iso: string): string {
  const [j, m, t] = iso.split('-');
  return t && m && j ? `${t}.${m}.${j}` : iso;
}

export default function SchuljahrSeite() {
  const [token, setToken] = useState<string>('');
  const [laden, setLaden] = useState(true);
  const [fehler, setFehler] = useState('');
  const [hinweis, setHinweis] = useState('');

  const [schuljahre, setSchuljahre] = useState<Schuljahr[]>([]);
  const [schulen, setSchulen] = useState<Schule[]>([]);
  const [freieTage, setFreieTage] = useState<FreierTag[]>([]);
  const [gewaehlt, setGewaehlt] = useState<string>('');

  // Formulare
  const [sjName, setSjName] = useState('');
  const [sjVon, setSjVon] = useState('');
  const [sjBis, setSjBis] = useState('');
  const [schuleName, setSchuleName] = useState('');
  const [ftBez, setFtBez] = useState('');
  const [ftVon, setFtVon] = useState('');
  const [ftBis, setFtBis] = useState('');
  const [ftFeiertag, setFtFeiertag] = useState(false);
  const [ftSchule, setFtSchule] = useState('');

  useEffect(() => {
    try {
      const roh = localStorage.getItem(LS_KEY);
      if (roh) setToken((JSON.parse(roh) as { token?: string }).token || '');
    } catch { /* keine Sitzung */ }
  }, []);

  const api = useCallback(async (action: string, params: Record<string, unknown> = {}) => {
    const res = await fetch('/api/schuljahr', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, token, ...params }),
    });
    const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
    if (!res.ok || !data.ok) throw new Error(String(data.error || 'Das hat nicht geklappt.'));
    return data;
  }, [token]);

  const neuLaden = useCallback(async () => {
    if (!token) { setLaden(false); return; }
    setLaden(true); setFehler('');
    try {
      const d = await api('laden');
      const sj = (d.schuljahre || []) as Schuljahr[];
      setSchuljahre(sj);
      setSchulen((d.schulen || []) as Schule[]);
      setFreieTage((d.freieTage || []) as FreierTag[]);
      setGewaehlt((g) => g || sj.find((s) => s.aktiv)?.id || sj[0]?.id || '');
    } catch (e) {
      setFehler(e instanceof Error ? e.message : 'Fehler beim Laden.');
    } finally { setLaden(false); }
  }, [api, token]);

  useEffect(() => { void neuLaden(); }, [neuLaden]);

  async function tun(fn: () => Promise<unknown>, erfolg: string) {
    setFehler(''); setHinweis('');
    try { await fn(); setHinweis(erfolg); await neuLaden(); }
    catch (e) { setFehler(e instanceof Error ? e.message : 'Fehler.'); }
  }

  if (!token) {
    return (
      <main style={huelle}>
        <div style={karte}>
          <h1 style={h1}>Schuljahr &amp; Ferien</h1>
          <p style={{ color: F.soft }}>
            Bitte zuerst im <a href="/kalender" style={{ color: F.blue }}>Kalender</a> anmelden –
            diese Seite nutzt dieselbe Anmeldung.
          </p>
        </div>
      </main>
    );
  }

  const jahr = schuljahre.find((s) => s.id === gewaehlt);
  const tageDesJahres = freieTage.filter((f) => f.schuljahr_id === gewaehlt);
  const schulName = (id: string | null) => (id ? schulen.find((s) => s.id === id)?.name || '—' : 'Bayern (Standard)');

  return (
    <main style={huelle}>
      <div style={{ maxWidth: 980, margin: '0 auto', padding: '0 20px 60px' }}>
        <h1 style={h1}>Schuljahr &amp; Ferien</h1>
        <p style={{ color: F.soft, marginTop: 0 }}>
          Grundlage für die Terminberechnung. <a href="/kalender" style={{ color: F.blue }}>Zurück zum Kalender</a>
        </p>

        {fehler && <div style={{ ...box, borderColor: '#f5b5b5', background: '#ffeaea', color: F.warn }}>{fehler}</div>}
        {hinweis && <div style={{ ...box, borderColor: 'rgba(18,122,92,.4)', background: 'rgba(18,122,92,.1)', color: F.gut }}>{hinweis}</div>}
        {laden && <p style={{ color: F.muted }}>Wird geladen …</p>}

        {/* ------------------------------------------------------ Schuljahre */}
        <section style={karte}>
          <h2 style={h2}>Schuljahre</h2>
          {schuljahre.length === 0 && !laden && <p style={{ color: F.muted }}>Noch kein Schuljahr angelegt.</p>}
          {schuljahre.map((s) => (
            <div key={s.id} style={zeile}>
              <div>
                <b>{s.name}</b>{s.aktiv && <span style={pille}>aktiv</span>}
                <div style={{ color: F.soft, fontSize: 14 }}>
                  {datumDe(s.erster_schultag)} – {datumDe(s.letzter_schultag)}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {!s.aktiv && (
                  <button style={knopfKlein} onClick={() => tun(() => api('schuljahrAktivieren', { id: s.id }), 'Schuljahr aktiviert.')}>
                    aktiv setzen
                  </button>
                )}
                <button style={{ ...knopfKlein, color: F.warn }}
                  onClick={() => { if (confirm(`Schuljahr „${s.name}" mit allen Ferienzeiten löschen?`)) void tun(() => api('schuljahrLoeschen', { id: s.id }), 'Schuljahr gelöscht.'); }}>
                  löschen
                </button>
              </div>
            </div>
          ))}
          <div style={formZeile}>
            <input style={feld} placeholder="Name, z. B. 2027/28" value={sjName} onChange={(e) => setSjName(e.target.value)} />
            <input style={feld} type="date" value={sjVon} onChange={(e) => setSjVon(e.target.value)} aria-label="Erster Schultag" />
            <input style={feld} type="date" value={sjBis} onChange={(e) => setSjBis(e.target.value)} aria-label="Letzter Schultag" />
            <button style={knopf} onClick={() => tun(async () => {
              await api('schuljahrSpeichern', { name: sjName, erster_schultag: sjVon, letzter_schultag: sjBis });
              setSjName(''); setSjVon(''); setSjBis('');
            }, 'Schuljahr angelegt.')}>Anlegen</button>
          </div>
        </section>

        {/* ---------------------------------------------------------- Schulen */}
        <section style={karte}>
          <h2 style={h2}>Schulen mit eigenen Ferien</h2>
          <p style={{ color: F.soft, marginTop: 0, fontSize: 14 }}>
            Nur nötig für Schulen, die andere Ferien haben als Bayern (z. B. internationale Schulen).
          </p>
          {schulen.map((s) => (
            <div key={s.id} style={zeile}>
              <b>{s.name}</b>
              <button style={{ ...knopfKlein, color: F.warn }}
                onClick={() => { if (confirm(`Schule „${s.name}" löschen? Ihre Ferienzeiten werden mitgelöscht.`)) void tun(() => api('schuleLoeschen', { id: s.id }), 'Schule gelöscht.'); }}>
                löschen
              </button>
            </div>
          ))}
          <div style={formZeile}>
            <input style={{ ...feld, flex: 2 }} placeholder="Name der Schule" value={schuleName} onChange={(e) => setSchuleName(e.target.value)} />
            <button style={knopf} onClick={() => tun(async () => {
              await api('schuleSpeichern', { name: schuleName }); setSchuleName('');
            }, 'Schule angelegt.')}>Anlegen</button>
          </div>
        </section>

        {/* --------------------------------------------- Unterrichtsfreie Tage */}
        <section style={karte}>
          <h2 style={h2}>Ferien &amp; freie Tage</h2>
          <div style={{ marginBottom: 14 }}>
            <label style={{ color: F.soft, fontSize: 14, marginRight: 8 }}>Schuljahr:</label>
            <select style={feld} value={gewaehlt} onChange={(e) => setGewaehlt(e.target.value)}>
              {schuljahre.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>

          {!jahr && <p style={{ color: F.muted }}>Bitte zuerst ein Schuljahr anlegen.</p>}

          {jahr && tageDesJahres.length === 0 && <p style={{ color: F.muted }}>Noch keine freien Tage eingetragen.</p>}
          {jahr && tageDesJahres.map((f) => (
            <div key={f.id} style={zeile}>
              <div>
                <b>{f.bezeichnung}</b>
                {f.ist_feiertag && <span style={{ ...pille, background: '#eef2f6', color: F.soft }}>gesetzlicher Feiertag</span>}
                <div style={{ color: F.soft, fontSize: 14 }}>
                  {datumDe(f.datum_von)}{f.datum_bis !== f.datum_von && ` – ${datumDe(f.datum_bis)}`}
                  {' · '}{schulName(f.schule_id)}
                </div>
              </div>
              <button style={{ ...knopfKlein, color: F.warn }}
                onClick={() => { if (confirm(`„${f.bezeichnung}" löschen?`)) void tun(() => api('freiLoeschen', { id: f.id }), 'Eintrag gelöscht.'); }}>
                löschen
              </button>
            </div>
          ))}

          {jahr && (
            <div style={{ ...formZeile, flexWrap: 'wrap' }}>
              <input style={feld} placeholder="Bezeichnung" value={ftBez} onChange={(e) => setFtBez(e.target.value)} />
              <input style={feld} type="date" value={ftVon} onChange={(e) => setFtVon(e.target.value)} aria-label="Von" />
              <input style={feld} type="date" value={ftBis} onChange={(e) => setFtBis(e.target.value)} aria-label="Bis" />
              <select style={feld} value={ftSchule} disabled={ftFeiertag}
                onChange={(e) => setFtSchule(e.target.value)}>
                <option value="">Bayern (Standard)</option>
                {schulen.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, color: F.soft, fontSize: 14 }}>
                <input type="checkbox" checked={ftFeiertag}
                  onChange={(e) => { setFtFeiertag(e.target.checked); if (e.target.checked) setFtSchule(''); }} />
                gesetzlicher Feiertag
              </label>
              <button style={knopf} onClick={() => tun(async () => {
                await api('freiSpeichern', {
                  schuljahr_id: gewaehlt, bezeichnung: ftBez,
                  datum_von: ftVon, datum_bis: ftBis || ftVon,
                  ist_feiertag: ftFeiertag, schule_id: ftSchule || null,
                });
                setFtBez(''); setFtVon(''); setFtBis(''); setFtFeiertag(false); setFtSchule('');
              }, 'Eintrag gespeichert.')}>Hinzufügen</button>
            </div>
          )}
          <p style={{ color: F.muted, fontSize: 13, marginTop: 12 }}>
            Ein gesetzlicher Feiertag gilt immer für alle Schüler. Ferien einer bestimmten Schule
            ersetzen für deren Schüler die bayerischen Ferien.
          </p>
        </section>
      </div>
    </main>
  );
}

// --- Stile ------------------------------------------------------------------
const huelle: React.CSSProperties = {
  minHeight: '100vh', background: F.bg, color: F.ink,
  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif', padding: '28px 0',
};
const karte: React.CSSProperties = {
  background: F.weiss, border: `1px solid ${F.line}`, borderRadius: 16,
  padding: '20px 22px', margin: '18px 0', maxWidth: 980,
};
const box: React.CSSProperties = { border: '1px solid', borderRadius: 10, padding: '12px 14px', margin: '12px 0' };
const h1: React.CSSProperties = { fontSize: 28, fontWeight: 800, margin: '0 0 4px' };
const h2: React.CSSProperties = { fontSize: 19, fontWeight: 700, margin: '0 0 12px' };
const zeile: React.CSSProperties = {
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  gap: 12, padding: '10px 0', borderTop: `1px solid ${F.line}`,
};
const formZeile: React.CSSProperties = {
  display: 'flex', gap: 8, alignItems: 'center', marginTop: 16,
  paddingTop: 16, borderTop: `1px solid ${F.line}`,
};
const feld: React.CSSProperties = {
  font: 'inherit', padding: '9px 11px', border: `1px solid ${F.line}`,
  borderRadius: 9, background: F.weiss, color: F.ink, flex: 1, minWidth: 130,
};
const knopf: React.CSSProperties = {
  font: 'inherit', fontWeight: 600, padding: '9px 18px', border: 0,
  borderRadius: 9, background: F.blue, color: '#fff', cursor: 'pointer',
};
const knopfKlein: React.CSSProperties = {
  font: 'inherit', fontSize: 14, fontWeight: 600, padding: '6px 12px',
  border: `1px solid ${F.line}`, borderRadius: 8, background: F.weiss,
  color: F.blue, cursor: 'pointer',
};
const pille: React.CSSProperties = {
  marginLeft: 8, fontSize: 12, fontWeight: 700, padding: '2px 9px',
  borderRadius: 20, background: 'rgba(23,105,255,.12)', color: F.blue,
};
