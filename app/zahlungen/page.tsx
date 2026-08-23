'use client';
// =============================================================================
// Zahlungsübersicht – Admin-Seite (nur Kleana)
//
// UMKEHRLOGIK: Standardannahme ist „bezahlt". Kleana hakt nicht jeden Monat
// alle Zahler ab, sondern klickt nur die Raten an, die FEHLEN. Ein zweiter
// Klick nimmt die Markierung zurück – dann ist der Vertrag sofort wieder frei.
//
// Nutzt dieselbe Anmeldung wie der Kalender (Sitzung aus dem Browserspeicher).
// =============================================================================
import { useCallback, useEffect, useState } from 'react';

const LS_KEY = 'lma_kal_session';

type Status = 'bezahlt' | 'offen' | 'ueberfaellig' | 'pausiert';
type Zelle = {
  id: string; monat: string; betragCent: number;
  status: Status; statusText: string;
  erinnerungAm: string | null; pausiertAm: string | null;
};
type Zeile = {
  vertragId: string; schuelerId: string; name: string; email: string | null;
  zahlweise: 'raten' | 'einmal';
  automatikPausiert: boolean; notiz: string; zellen: Zelle[];
};
type Vorlage = { schluessel: string; betreff: string; text: string };
type Plus = {
  schuelerId: string; name: string; anzahl: number;
  stundensatzCent: number; summeCent: number; termine: string[]; warnung: boolean;
};

const F = {
  ink: '#0F172A', soft: '#475569', muted: '#94A3B8', line: '#E2E8F0',
  blue: '#1769FF', bg: '#fffdf8', weiss: '#fff', warn: '#a12a2a', gut: '#127a5c',
};

const AMPEL: Record<Status, { farbe: string; grund: string }> = {
  bezahlt:     { farbe: '#127a5c', grund: 'rgba(18,122,92,.10)' },
  offen:       { farbe: '#8a6a20', grund: 'rgba(217,154,54,.18)' },
  ueberfaellig:{ farbe: '#c2410c', grund: 'rgba(194,65,12,.14)' },
  pausiert:    { farbe: '#a12a2a', grund: 'rgba(161,42,42,.16)' },
};

const eur = (c: number) => (c / 100).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
const kurzMonat = (iso: string) => {
  const [j, m] = iso.split('-');
  return `${['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'][Number(m) - 1]} ${j.slice(2)}`;
};

const VORLAGEN_NAMEN: Record<string, string> = {
  adminCheck: 'Bank-Check an dich (Tag 9)',
  erinnerung: 'Letzter Zahltag – an die Eltern (Tag 10)',
  pausierung: 'Unterricht pausiert (Tag 15)',
  dank: 'Zahlung angekommen',
};

export default function ZahlungenSeite() {
  const [token, setToken] = useState('');
  const [laden, setLaden] = useState(true);
  const [fehler, setFehler] = useState('');
  const [hinweis, setHinweis] = useState('');

  const [monate, setMonate] = useState<string[]>([]);
  const [zeilen, setZeilen] = useState<Zeile[]>([]);
  const [plus, setPlus] = useState<Plus[]>([]);
  const [vorlagen, setVorlagen] = useState<Vorlage[]>([]);
  const [offenVorlagen, setOffenVorlagen] = useState(false);
  const [notizFuer, setNotizFuer] = useState<string>('');
  const [notizText, setNotizText] = useState('');

  useEffect(() => {
    try {
      const roh = localStorage.getItem(LS_KEY);
      if (roh) setToken((JSON.parse(roh) as { token?: string }).token || '');
    } catch { /* keine Sitzung */ }
  }, []);

  const api = useCallback(async (action: string, params: Record<string, unknown> = {}) => {
    const res = await fetch('/api/zahlungen', {
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
      const [u, p] = await Promise.all([api('uebersicht'), api('plusstunden')]);
      setMonate((u.monate || []) as string[]);
      setZeilen((u.zeilen || []) as Zeile[]);
      setPlus((p.schueler || []) as Plus[]);
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

  async function umschalten(z: Zeile, c: Zelle) {
    if (c.status === 'bezahlt') {
      if (!confirm(`Rate ${kurzMonat(c.monat)} von ${z.name} als FEHLEND markieren?\n\n`
        + 'Ab dem 11. sind Buchungen gesperrt, ab dem 15. ruht auch der feste Termin.')) return;
      const d = await api('offen', { zahlung_id: c.id }).catch((e: Error) => { setFehler(e.message); return null; });
      if (d) { setHinweis((d as { erinnerung?: boolean }).erinnerung
        ? 'Markiert – die Erinnerung ist sofort rausgegangen.'
        : 'Markiert. Die Erinnerung geht am 10. automatisch raus.'); await neuLaden(); }
    } else {
      await tun(() => api('bezahlt', { zahlung_id: c.id }),
        'Als bezahlt vermerkt – alles wieder freigeschaltet, die Eltern haben eine kurze Nachricht bekommen.');
    }
  }

  async function vorlagenOeffnen() {
    setOffenVorlagen(true);
    if (!vorlagen.length) {
      try { setVorlagen(((await api('vorlagen')).vorlagen || []) as Vorlage[]); }
      catch (e) { setFehler(e instanceof Error ? e.message : 'Fehler.'); }
    }
  }

  if (!token) {
    return (
      <main style={huelle}>
        <div style={{ maxWidth: 980, margin: '0 auto', padding: '0 20px' }}>
          <div style={karte}>
            <h1 style={h1}>Zahlungen</h1>
            <p style={{ color: F.soft }}>
              Bitte zuerst im <a href="/kalender" style={{ color: F.blue }}>Kalender</a> anmelden –
              diese Seite nutzt dieselbe Anmeldung.
            </p>
          </div>
        </div>
      </main>
    );
  }

  const offeneAnzahl = zeilen.reduce(
    (s, z) => s + z.zellen.filter((c) => c.status !== 'bezahlt').length, 0);

  return (
    <main style={huelle}>
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 20px 60px' }}>
        <h1 style={h1}>Zahlungen</h1>
        <p style={{ color: F.soft, marginTop: 0 }}>
          Es zählt nur, was <b>fehlt</b>. Alles Nicht-Markierte gilt als bezahlt.{' '}
          <a href="/kalender" style={{ color: F.blue }}>Zurück zum Kalender</a>
        </p>

        {fehler && <div style={{ ...box, borderColor: '#f5b5b5', background: '#ffeaea', color: F.warn }}>{fehler}</div>}
        {hinweis && <div style={{ ...box, borderColor: 'rgba(18,122,92,.4)', background: 'rgba(18,122,92,.1)', color: F.gut }}>{hinweis}</div>}
        {laden && <p style={{ color: F.muted }}>Wird geladen …</p>}

        {/* --------------------------------------------------------- Anleitung */}
        <section style={{ ...karte, maxWidth: 1140, background: 'rgba(23,105,255,.05)', borderColor: 'rgba(23,105,255,.2)' }}>
          <b>So läuft es jeden Monat</b>
          <ol style={{ margin: '8px 0 0', paddingLeft: 20, color: F.soft, lineHeight: 1.7 }}>
            <li>Am <b>9.</b> bekommst du eine Mail: kurz aufs Konto schauen.</li>
            <li>Fehlt eine Rate, hier <b>anklicken</b> – sie wird gelb.</li>
            <li>Am <b>10.</b> geht automatisch die Erinnerung an die Eltern.</li>
            <li>Ab dem <b>11.</b> sind Zusatzbuchungen gesperrt (orange).</li>
            <li>Ab dem <b>15.</b> pausiert der Vertrag, der feste Termin ruht (rot). Termine in den nächsten zwei Tagen finden noch statt.</li>
            <li>Kommt das Geld, <b>nochmal anklicken</b> – alles ist sofort wieder frei.</li>
          </ol>
        </section>

        {/* ------------------------------------------------------------ Matrix */}
        <section style={{ ...karte, maxWidth: 1140 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <h2 style={{ ...h2, margin: 0 }}>Übersicht {offeneAnzahl > 0 && <span style={{ ...pille, background: 'rgba(161,42,42,.12)', color: F.warn }}>{offeneAnzahl} offen</span>}</h2>
            <button style={knopfKlein} onClick={() => void vorlagenOeffnen()}>E-Mail-Texte ändern</button>
          </div>

          {!zeilen.length && !laden && (
            <p style={{ color: F.muted, marginTop: 14 }}>
              Es gibt noch keine bestätigten Schuljahresverträge. Sobald ein Vertrag bestätigt ist,
              erscheinen hier alle Raten.
            </p>
          )}

          {!!zeilen.length && (
            <div style={{ overflowX: 'auto', marginTop: 14 }}>
              <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 14 }}>
                <thead>
                  <tr>
                    <th style={{ ...th, textAlign: 'left', position: 'sticky', left: 0, background: F.weiss }}>Schüler/in</th>
                    {monate.map((m) => <th key={m} style={th}>{kurzMonat(m)}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {zeilen.map((z) => (
                    <tr key={z.vertragId}>
                      <td style={{ ...td, textAlign: 'left', position: 'sticky', left: 0, background: F.weiss, minWidth: 170 }}>
                        <b>{z.name}</b>
                        {z.zahlweise === 'einmal' && <span style={pille}>Einmalzahlung</span>}
                        {z.automatikPausiert && (
                          <span style={{ ...pille, background: 'rgba(161,42,42,.12)', color: F.warn }} title={z.notiz}>
                            Automatik aus
                          </span>
                        )}
                        <div>
                          <button style={mini} onClick={() => { setNotizFuer(z.vertragId); setNotizText(z.notiz); }}>
                            {z.automatikPausiert ? 'Automatik wieder an' : 'Automatik aussetzen'}
                          </button>
                          <a style={{ ...mini, textDecoration: 'none' }}
                            href={`/api/vertrag?sitzung=${encodeURIComponent(token)}&vertrag=${z.vertragId}&art=bescheinigung`}
                            target="_blank" rel="noopener">Bescheinigung</a>
                        </div>
                        {z.notiz && <div style={{ color: F.muted, fontSize: 12, marginTop: 2 }}>{z.notiz}</div>}
                      </td>
                      {monate.map((m) => {
                        const c = z.zellen.find((x) => x.monat === m);
                        if (!c) return <td key={m} style={{ ...td, color: F.muted }}>–</td>;
                        const a = AMPEL[c.status];
                        return (
                          <td key={m} style={td}>
                            <button
                              onClick={() => void umschalten(z, c)}
                              title={`${eur(c.betragCent)} · ${c.statusText}`
                                + (c.erinnerungAm ? `\nErinnerung: ${c.erinnerungAm}` : '')
                                + (c.pausiertAm ? `\nPausiert seit: ${c.pausiertAm}` : '')}
                              style={{
                                font: 'inherit', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                                width: '100%', minWidth: 84, padding: '7px 4px',
                                border: `1px solid ${a.farbe}33`, borderRadius: 8,
                                background: a.grund, color: a.farbe,
                              }}>
                              {eur(c.betragCent)}
                              <div style={{ fontWeight: 400, fontSize: 11 }}>{c.statusText}</div>
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* ------------------------------------------------------- Plusstunden */}
        <section style={{ ...karte, maxWidth: 1140 }}>
          <h2 style={h2}>Zusatzstunden</h2>
          <p style={{ color: F.soft, marginTop: 0, fontSize: 14 }}>
            Stunden über dem festen Wochentermin. Nachhol- und Minusstunden sind bereits
            verrechnet – hier steht nur, was wirklich zusätzlich anfällt.
          </p>
          {!plus.length && <p style={{ color: F.muted }}>Zurzeit sind keine Zusatzstunden offen.</p>}
          {plus.map((p) => (
            <div key={p.schuelerId} style={zeile}>
              <div>
                <b>{p.name}</b>
                {p.warnung && <span style={{ ...pille, background: 'rgba(217,154,54,.18)', color: '#8a6a20' }}>Zwischenabrechnung sinnvoll</span>}
                <div style={{ color: F.soft, fontSize: 14 }}>
                  {p.anzahl} Stunden × {eur(p.stundensatzCent)} = <b>{eur(p.summeCent)}</b>
                </div>
                <div style={{ color: F.muted, fontSize: 12 }}>{p.termine.join(' · ')}</div>
              </div>
              <button style={knopf}
                disabled={!p.stundensatzCent}
                onClick={() => { if (confirm(`${p.anzahl} Zusatzstunden für ${p.name} über ${eur(p.summeCent)} abrechnen und die Aufstellung per Mail schicken?`)) void tun(() => api('plusstundenAbrechnen', { schueler_id: p.schuelerId }), 'Abrechnung angelegt und verschickt.'); }}>
                abrechnen
              </button>
            </div>
          ))}
        </section>

        {/* ------------------------------------------------- Notiz / Automatik */}
        {notizFuer && (
          <div style={overlay} onClick={() => setNotizFuer('')}>
            <div style={{ ...karte, maxWidth: 520, margin: 0 }} onClick={(e) => e.stopPropagation()}>
              <h2 style={h2}>Mahn-Automatik</h2>
              <p style={{ color: F.soft, fontSize: 14, marginTop: 0 }}>
                Wenn du dich mit einer Familie anders geeinigt hast, kannst du die automatischen
                Mails und die Pausierung für diesen Vertrag aussetzen. Die Ampel bleibt sichtbar.
              </p>
              <textarea value={notizText} onChange={(e) => setNotizText(e.target.value)}
                placeholder="Notiz, z. B. „zahlt in zwei Teilen, abgesprochen am 3.3."
                style={{ ...feld, width: '100%', minHeight: 80 }} />
              <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
                {(() => {
                  const z = zeilen.find((x) => x.vertragId === notizFuer);
                  const anAus = !(z?.automatikPausiert);
                  return (
                    <button style={knopf} onClick={() => { const id = notizFuer; setNotizFuer('');
                      void tun(() => api('automatik', { vertrag_id: id, pausiert: anAus, notiz: notizText }),
                        anAus ? 'Automatik ausgesetzt.' : 'Automatik wieder aktiv.'); }}>
                      {anAus ? 'Automatik aussetzen' : 'Automatik wieder einschalten'}
                    </button>
                  );
                })()}
                <button style={knopfKlein} onClick={() => setNotizFuer('')}>abbrechen</button>
              </div>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------------- Vorlagen */}
        {offenVorlagen && (
          <div style={overlay} onClick={() => setOffenVorlagen(false)}>
            <div style={{ ...karte, maxWidth: 680, margin: 0, maxHeight: '86vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
              <h2 style={h2}>E-Mail-Texte</h2>
              <p style={{ color: F.soft, fontSize: 14, marginTop: 0 }}>
                Platzhalter in geschweiften Klammern werden beim Versand ersetzt:{' '}
                <code>{'{name} {betrag} {monat} {iban} {inhaber} {verwendungszweck}'}</code>
              </p>
              {vorlagen.map((v, i) => (
                <div key={v.schluessel} style={{ borderTop: `1px solid ${F.line}`, paddingTop: 14, marginTop: 14 }}>
                  <b>{VORLAGEN_NAMEN[v.schluessel] || v.schluessel}</b>
                  <input value={v.betreff} style={{ ...feld, width: '100%', marginTop: 8 }}
                    onChange={(e) => setVorlagen(vorlagen.map((x, j) => j === i ? { ...x, betreff: e.target.value } : x))} />
                  <textarea value={v.text} style={{ ...feld, width: '100%', minHeight: 150, marginTop: 8, fontFamily: 'inherit' }}
                    onChange={(e) => setVorlagen(vorlagen.map((x, j) => j === i ? { ...x, text: e.target.value } : x))} />
                  <button style={{ ...knopfKlein, marginTop: 8 }}
                    onClick={() => void tun(() => api('vorlageSpeichern', { schluessel: v.schluessel, betreff: v.betreff, text: v.text }), 'Text gespeichert.')}>
                    speichern
                  </button>
                </div>
              ))}
              <button style={{ ...knopfKlein, marginTop: 16 }} onClick={() => setOffenVorlagen(false)}>schließen</button>
            </div>
          </div>
        )}
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
  padding: '20px 22px', margin: '18px 0', maxWidth: 980,
};
const box: React.CSSProperties = { border: '1px solid', borderRadius: 10, padding: '12px 14px', margin: '12px 0' };
const h1: React.CSSProperties = { fontSize: 28, fontWeight: 800, margin: '0 0 4px' };
const h2: React.CSSProperties = { fontSize: 19, fontWeight: 700, margin: '0 0 12px' };
const zeile: React.CSSProperties = {
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  gap: 12, padding: '12px 0', borderTop: `1px solid ${F.line}`,
};
const th: React.CSSProperties = {
  textAlign: 'center', padding: '6px 5px', fontSize: 12, fontWeight: 700,
  color: F.soft, borderBottom: `1px solid ${F.line}`, whiteSpace: 'nowrap',
};
const td: React.CSSProperties = {
  textAlign: 'center', padding: '5px 4px', borderBottom: `1px solid ${F.line}`, verticalAlign: 'top',
};
const feld: React.CSSProperties = {
  font: 'inherit', padding: '9px 11px', border: `1px solid ${F.line}`,
  borderRadius: 9, background: F.weiss, color: F.ink, boxSizing: 'border-box',
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
const mini: React.CSSProperties = {
  font: 'inherit', fontSize: 12, fontWeight: 600, padding: '2px 7px', marginRight: 6,
  border: `1px solid ${F.line}`, borderRadius: 6, background: F.weiss,
  color: F.soft, cursor: 'pointer', display: 'inline-block',
};
const pille: React.CSSProperties = {
  marginLeft: 8, fontSize: 12, fontWeight: 700, padding: '2px 9px',
  borderRadius: 20, background: 'rgba(23,105,255,.12)', color: F.blue,
};
const overlay: React.CSSProperties = {
  position: 'fixed', inset: 0, background: 'rgba(15,23,42,.45)', zIndex: 50,
  display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 18,
};
