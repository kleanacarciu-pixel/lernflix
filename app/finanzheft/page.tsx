'use client';
// =============================================================================
// Finanzheft – Admin-Seite (nur Kleana)
//
// Kleine eigene Buchhaltung mit doppelter Buchführung (Soll/Haben): jedes
// Konto (Bank Privat, Bank Firma, Kasse, …) hat einen eigenen, exakten Saldo,
// jede Buchung ist automatisch ausgeglichen. Damit bleibt privates Geld und
// Geld der (noch nicht gegründeten) Firma strukturell getrennt – sie liegen
// schlicht auf verschiedenen Konten. Geld wandert zwischen Konten nur über
// den Transfer, nie automatisch.
//
// Nutzt dieselbe Anmeldung wie der Kalender.
// =============================================================================
import { useCallback, useEffect, useState } from 'react';
import Anmeldehinweis from '@/components/Anmeldehinweis';
import { rufeApi, ladeSitzung } from '@/components/sitzung';

const F = {
  ink: '#0F172A', soft: '#475569', muted: '#94A3B8', line: '#E2E8F0',
  blue: '#1769FF', bg: '#fffdf8', weiss: '#fff', warn: '#a12a2a', gut: '#127a5c',
};

type Kontotyp = 'aktiv' | 'passiv' | 'ertrag' | 'aufwand';
type Konto = { id: number; name: string; typ: Kontotyp };
type Kategorie = { id: number; name: string; typ: 'ertrag' | 'aufwand'; saldoCent: number };
type Periode = {
  ertragCent: number; aufwandCent: number; gewinnCent: number;
  umsatzsteuerCent: number; vorsteuerCent: number; zahllastCent: number;
  kategorien: Kategorie[];
};
type BuchungsZeile = { kontoId: number; kontoName: string; sollCent: number; habenCent: number };
type Buchung = { id: number; datum: string; beschreibung: string; zeilen: BuchungsZeile[] };

const euro = (cent: number) => (cent / 100).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
const heute = () => new Date().toISOString().slice(0, 10);
const TYP_NAME: Record<Kontotyp, string> = { aktiv: 'Konto', passiv: 'Verbindlichkeit', ertrag: 'Einnahmen-Kategorie', aufwand: 'Ausgaben-Kategorie' };
const NEU = '__neu__';

export default function FinanzheftSeite() {
  const [token, setToken] = useState('');
  const [laden, setLaden] = useState(true);
  const [fehler, setFehler] = useState('');
  const [hinweis, setHinweis] = useState('');
  const [abgemeldet, setAbgemeldet] = useState(false);

  const [konten, setKonten] = useState<Konto[]>([]);
  const [kontoSalden, setKontoSalden] = useState<(Konto & { saldoCent: number })[]>([]);
  const [monat, setMonat] = useState<Periode | null>(null);
  const [jahr, setJahr] = useState<Periode | null>(null);
  const [buchungen, setBuchungen] = useState<Buchung[]>([]);

  const aktivKonten = konten.filter((k) => k.typ === 'aktiv');
  const ertragKonten = konten.filter((k) => k.typ === 'ertrag');
  const aufwandKonten = konten.filter((k) => k.typ === 'aufwand');

  useEffect(() => { setToken(ladeSitzung()?.token || ''); }, []);

  const api = useCallback(async (action: string, params: Record<string, unknown> = {}) =>
    rufeApi('/api/finanzheft', action, params, () => setAbgemeldet(true)), []);

  const neuLaden = useCallback(async () => {
    if (!token) { setLaden(false); return; }
    setLaden(true);
    try {
      const d = await api('laden');
      setKonten((d.konten as Konto[]) || []);
      setKontoSalden((d.kontoSalden as (Konto & { saldoCent: number })[]) || []);
      setMonat((d.monat as Periode) || null);
      setJahr((d.jahr as Periode) || null);
      setBuchungen((d.buchungen as Buchung[]) || []);
    } catch (e) {
      setFehler(e instanceof Error ? e.message : 'Fehler beim Laden.');
    } finally { setLaden(false); }
  }, [api, token]);

  useEffect(() => { void neuLaden(); }, [neuLaden]);

  /** Für "+ Neue Kategorie": legt sie bei Bedarf an und gibt ihre id zurück. */
  async function kategorieIdFuer(gewaehlt: string, neuerName: string, typ: 'ertrag' | 'aufwand'): Promise<number | null> {
    if (gewaehlt !== NEU) return Number(gewaehlt) || null;
    if (!neuerName.trim()) { setFehler('Bitte einen Namen für die neue Kategorie angeben.'); return null; }
    const d = await api('kontoAnlegen', { name: neuerName, typ });
    return Number(d.id);
  }

  // --- Einnahme ---
  const [eKonto, setEKonto] = useState('');
  const [eKategorie, setEKategorie] = useState('');
  const [eNeu, setENeu] = useState('');
  const [eBetrag, setEBetrag] = useState('');
  const [eUst, setEUst] = useState(0);
  const [eDatum, setEDatum] = useState(heute());
  const [eText, setEText] = useState('');

  async function einnahmeBuchen() {
    setFehler(''); setHinweis('');
    try {
      const ertragKontoId = await kategorieIdFuer(eKategorie, eNeu, 'ertrag');
      if (!eKonto || !ertragKontoId) return;
      await api('einnahme', { aktivKontoId: Number(eKonto), ertragKontoId, betrag: eBetrag.replace(',', '.'), ustSatz: eUst, datum: eDatum, beschreibung: eText });
      setEBetrag(''); setEText(''); setENeu(''); setEKategorie('');
      setHinweis('Einnahme gebucht.');
      await neuLaden();
    } catch (e) { setFehler(e instanceof Error ? e.message : 'Fehler.'); }
  }

  // --- Ausgabe ---
  const [aKonto, setAKonto] = useState('');
  const [aKategorie, setAKategorie] = useState('');
  const [aNeu, setANeu] = useState('');
  const [aBetrag, setABetrag] = useState('');
  const [aUst, setAUst] = useState(0);
  const [aDatum, setADatum] = useState(heute());
  const [aText, setAText] = useState('');

  async function ausgabeBuchen() {
    setFehler(''); setHinweis('');
    try {
      const aufwandKontoId = await kategorieIdFuer(aKategorie, aNeu, 'aufwand');
      if (!aKonto || !aufwandKontoId) return;
      await api('ausgabe', { aktivKontoId: Number(aKonto), aufwandKontoId, betrag: aBetrag.replace(',', '.'), ustSatz: aUst, datum: aDatum, beschreibung: aText });
      setABetrag(''); setAText(''); setANeu(''); setAKategorie('');
      setHinweis('Ausgabe gebucht.');
      await neuLaden();
    } catch (e) { setFehler(e instanceof Error ? e.message : 'Fehler.'); }
  }

  // --- Transfer ---
  const [tVon, setTVon] = useState('');
  const [tNach, setTNach] = useState('');
  const [tBetrag, setTBetrag] = useState('');
  const [tText, setTText] = useState('');

  async function transferBuchen() {
    setFehler(''); setHinweis('');
    if (tVon && tVon === tNach) { setFehler('Von- und Nach-Konto müssen unterschiedlich sein.'); return; }
    try {
      await api('transfer', { vonKontoId: Number(tVon), nachKontoId: Number(tNach), betrag: tBetrag.replace(',', '.'), datum: heute(), beschreibung: tText });
      setTBetrag(''); setTText('');
      setHinweis('Transfer gebucht.');
      await neuLaden();
    } catch (e) { setFehler(e instanceof Error ? e.message : 'Fehler.'); }
  }

  async function buchungLoeschen(id: number) {
    if (!confirm('Diese Buchung wirklich löschen?')) return;
    setFehler('');
    try { await api('loeschen', { id }); await neuLaden(); }
    catch (e) { setFehler(e instanceof Error ? e.message : 'Fehler.'); }
  }

  if (!token || abgemeldet) {
    return (
      <main style={huelle}>
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 20px' }}>
          <div style={karte}>
            <h1 style={h1}>Finanzheft</h1>
            <Anmeldehinweis abgelaufen={abgemeldet} />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main style={huelle}>
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 20px 60px' }}>
        <h1 style={h1}>Finanzheft</h1>
        <p style={{ color: F.soft, marginTop: 0 }}>
          <a href="/admin" style={{ color: F.blue }}>Übersicht</a> ·{' '}
          <a href="/einstellungen" style={{ color: F.blue }}>Einstellungen</a>
        </p>
        <p style={{ color: F.soft, marginTop: 0, fontSize: 15 }}>
          Doppelte Buchführung: jede Buchung landet auf zwei Konten (Soll/Haben) und ist automatisch ausgeglichen.
          Geld wandert zwischen Konten nur über den Transfer weiter unten – nie automatisch.
        </p>

        {fehler && <div style={{ ...box, borderColor: '#f5b5b5', background: '#ffeaea', color: F.warn }}>{fehler}</div>}
        {hinweis && <div style={{ ...box, borderColor: 'rgba(18,122,92,.4)', background: 'rgba(18,122,92,.1)', color: F.gut }}>{hinweis}</div>}
        {laden && <p style={{ color: F.muted }}>Wird geladen …</p>}

        <section style={karte}>
          <h2 style={h2}>Konten</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <tbody>
              {kontoSalden.filter((k) => k.typ === 'aktiv' || k.typ === 'passiv').map((k) => (
                <tr key={k.id} style={{ borderBottom: `1px solid ${F.line}` }}>
                  <td style={td}>{k.name}</td>
                  <td style={{ ...td, color: F.muted }}>{TYP_NAME[k.typ]}</td>
                  <td style={{ ...td, textAlign: 'right', fontWeight: 700 }}>{euro(k.saldoCent)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <PeriodenKarte titel="Diesen Monat" p={monat} />
          <PeriodenKarte titel="Dieses Jahr" p={jahr} />
        </div>

        <section style={karte}>
          <h2 style={h2}>Einnahme buchen</h2>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <select style={feld} value={eKonto} onChange={(e) => setEKonto(e.target.value)}>
              <option value="">Konto …</option>
              {aktivKonten.map((k) => <option key={k.id} value={k.id}>{k.name}</option>)}
            </select>
            <select style={feld} value={eKategorie} onChange={(e) => setEKategorie(e.target.value)}>
              <option value="">Kategorie …</option>
              {ertragKonten.map((k) => <option key={k.id} value={k.id}>{k.name}</option>)}
              <option value={NEU}>+ Neue Kategorie …</option>
            </select>
            {eKategorie === NEU && <input style={feld} placeholder="Name der Kategorie" value={eNeu} onChange={(e) => setENeu(e.target.value)} />}
            <input style={{ ...feld, width: 110 }} placeholder="Betrag € (brutto)" value={eBetrag} onChange={(e) => setEBetrag(e.target.value)} />
            <select style={feld} value={eUst} onChange={(e) => setEUst(Number(e.target.value))} title="Umsatzsteuersatz">
              <option value={0}>0 % USt</option>
              <option value={7}>7 % USt</option>
              <option value={19}>19 % USt</option>
            </select>
            <input style={{ ...feld, flex: 1, minWidth: 140 }} placeholder="Beschreibung" value={eText} onChange={(e) => setEText(e.target.value)} />
            <input style={feld} type="date" value={eDatum} onChange={(e) => setEDatum(e.target.value)} />
          </div>
          <button style={{ ...knopf, marginTop: 12 }} disabled={!eKonto || !eKategorie || !eBetrag} onClick={() => void einnahmeBuchen()}>Buchen</button>
        </section>

        <section style={karte}>
          <h2 style={h2}>Ausgabe buchen</h2>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <select style={feld} value={aKonto} onChange={(e) => setAKonto(e.target.value)}>
              <option value="">Konto …</option>
              {aktivKonten.map((k) => <option key={k.id} value={k.id}>{k.name}</option>)}
            </select>
            <select style={feld} value={aKategorie} onChange={(e) => setAKategorie(e.target.value)}>
              <option value="">Kategorie …</option>
              {aufwandKonten.map((k) => <option key={k.id} value={k.id}>{k.name}</option>)}
              <option value={NEU}>+ Neue Kategorie …</option>
            </select>
            {aKategorie === NEU && <input style={feld} placeholder="Name der Kategorie" value={aNeu} onChange={(e) => setANeu(e.target.value)} />}
            <input style={{ ...feld, width: 110 }} placeholder="Betrag € (brutto)" value={aBetrag} onChange={(e) => setABetrag(e.target.value)} />
            <select style={feld} value={aUst} onChange={(e) => setAUst(Number(e.target.value))} title="Umsatzsteuersatz">
              <option value={0}>0 % USt</option>
              <option value={7}>7 % USt</option>
              <option value={19}>19 % USt</option>
            </select>
            <input style={{ ...feld, flex: 1, minWidth: 140 }} placeholder="Beschreibung" value={aText} onChange={(e) => setAText(e.target.value)} />
            <input style={feld} type="date" value={aDatum} onChange={(e) => setADatum(e.target.value)} />
          </div>
          <button style={{ ...knopf, marginTop: 12 }} disabled={!aKonto || !aKategorie || !aBetrag} onClick={() => void ausgabeBuchen()}>Buchen</button>
        </section>

        <section style={karte}>
          <h2 style={h2}>Transfer zwischen Konten</h2>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <select style={feld} value={tVon} onChange={(e) => setTVon(e.target.value)}>
              <option value="">Von …</option>
              {aktivKonten.map((k) => <option key={k.id} value={k.id}>{k.name}</option>)}
            </select>
            <span style={{ color: F.soft }}>→</span>
            <select style={feld} value={tNach} onChange={(e) => setTNach(e.target.value)}>
              <option value="">Nach …</option>
              {aktivKonten.map((k) => <option key={k.id} value={k.id}>{k.name}</option>)}
            </select>
            <input style={{ ...feld, width: 110 }} placeholder="Betrag €" value={tBetrag} onChange={(e) => setTBetrag(e.target.value)} />
            <input style={{ ...feld, flex: 1, minWidth: 140 }} placeholder="Beschreibung (optional)" value={tText} onChange={(e) => setTText(e.target.value)} />
          </div>
          <button style={{ ...knopf, marginTop: 12 }} disabled={!tVon || !tNach || !tBetrag} onClick={() => void transferBuchen()}>Übertragen</button>
        </section>

        <section style={karte}>
          <h2 style={h2}>Buchungen</h2>
          {!buchungen.length && !laden && <p style={{ color: F.muted }}>Noch keine Buchungen.</p>}
          {!!buchungen.length && (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ textAlign: 'left', color: F.soft, borderBottom: `1px solid ${F.line}` }}>
                  <th style={th}>Datum</th><th style={th}>Beschreibung</th><th style={th}>Buchungssätze</th><th style={th} />
                </tr>
              </thead>
              <tbody>
                {buchungen.map((b) => (
                  <tr key={b.id} style={{ borderBottom: `1px solid ${F.line}` }}>
                    <td style={td}>{b.datum}</td>
                    <td style={td}>{b.beschreibung}</td>
                    <td style={td}>
                      {b.zeilen.map((z, i) => (
                        <div key={i}>{z.kontoName}: {z.sollCent ? `Soll ${euro(z.sollCent)}` : `Haben ${euro(z.habenCent)}`}</div>
                      ))}
                    </td>
                    <td style={td}><button style={knopfKlein} onClick={() => void buchungLoeschen(b.id)}>löschen</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </main>
  );
}

function PeriodenKarte({ titel, p }: { titel: string; p: Periode | null }) {
  return (
    <div style={{ ...karte, margin: '18px 0' }}>
      <h2 style={h2}>{titel}</h2>
      {!p ? <p style={{ color: F.muted }}>–</p> : (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, margin: '6px 0' }}><span>Einnahmen</span><b style={{ color: F.gut }}>{euro(p.ertragCent)}</b></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, margin: '6px 0' }}><span>Ausgaben</span><b style={{ color: F.warn }}>{euro(p.aufwandCent)}</b></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, margin: '10px 0', paddingTop: 8, borderTop: `1px solid ${F.line}` }}>
            <span><b>{p.gewinnCent >= 0 ? 'Gewinn' : 'Verlust'}</b></span><b>{euro(Math.abs(p.gewinnCent))}</b>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: F.soft, margin: '4px 0' }}>
            <span>USt-Zahllast (USt − Vorsteuer)</span><span>{euro(p.zahllastCent)}</span>
          </div>
          {!!p.kategorien.length && (
            <div style={{ marginTop: 12, borderTop: `1px solid ${F.line}`, paddingTop: 8 }}>
              {p.kategorien.map((k) => (
                <div key={k.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: F.soft, margin: '3px 0' }}>
                  <span>{k.name}</span><span>{euro(k.saldoCent)}</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
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
const feld: React.CSSProperties = {
  font: 'inherit', fontSize: 14, padding: '8px 10px', border: `1px solid ${F.line}`, borderRadius: 8,
};
const th: React.CSSProperties = { padding: '8px 6px', fontWeight: 600 };
const td: React.CSSProperties = { padding: '8px 6px', verticalAlign: 'top' };
const knopf: React.CSSProperties = {
  font: 'inherit', fontWeight: 600, padding: '9px 18px', border: 0,
  borderRadius: 9, background: F.blue, color: '#fff', cursor: 'pointer',
};
const knopfKlein: React.CSSProperties = {
  font: 'inherit', fontSize: 13, fontWeight: 600, padding: '4px 10px',
  border: `1px solid ${F.line}`, borderRadius: 8, background: F.weiss,
  color: F.warn, cursor: 'pointer',
};
