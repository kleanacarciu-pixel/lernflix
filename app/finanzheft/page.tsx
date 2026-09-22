'use client';
// =============================================================================
// Finanzheft – Admin-Seite (nur Kleana)
//
// Trennt privates Geld von Firmengeld: zwei Konten, jede Buchung landet
// bewusst auf genau einem davon. Geld wandert zwischen ihnen NUR über den
// Transfer-Knopf unten – nie automatisch –, damit im Ernstfall (Firma
// pleite, bevor sie überhaupt gegründet ist) klar bleibt, was privat war.
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

type Konto = 'privat' | 'firma';
type Buchung = {
  id: number; konto: Konto; typ: 'einnahme' | 'ausgabe';
  betragCent: number; kategorie: string; beschreibung: string; datum: string; transferId: string | null;
};

const euro = (cent: number) => (cent / 100).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
const heute = () => new Date().toISOString().slice(0, 10);
const KONTO_NAME: Record<Konto, string> = { privat: 'Privat', firma: 'Firma' };

export default function FinanzheftSeite() {
  const [token, setToken] = useState('');
  const [laden, setLaden] = useState(true);
  const [fehler, setFehler] = useState('');
  const [hinweis, setHinweis] = useState('');
  const [abgemeldet, setAbgemeldet] = useState(false);

  const [buchungen, setBuchungen] = useState<Buchung[]>([]);
  const [salden, setSalden] = useState({ privatCent: 0, firmaCent: 0 });
  const [firmaKategorien, setFirmaKategorien] = useState<string[]>([]);
  const [privatKategorien, setPrivatKategorien] = useState<string[]>([]);

  const [bKonto, setBKonto] = useState<Konto>('privat');
  const [bTyp, setBTyp] = useState<'einnahme' | 'ausgabe'>('ausgabe');
  const [bBetrag, setBBetrag] = useState('');
  const [bKategorie, setBKategorie] = useState('');
  const [bBeschreibung, setBBeschreibung] = useState('');
  const [bDatum, setBDatum] = useState(heute());

  const [tVon, setTVon] = useState<Konto>('firma');
  const [tBetrag, setTBetrag] = useState('');
  const [tBeschreibung, setTBeschreibung] = useState('');

  useEffect(() => { setToken(ladeSitzung()?.token || ''); }, []);

  const api = useCallback(async (action: string, params: Record<string, unknown> = {}) =>
    rufeApi('/api/finanzheft', action, params, () => setAbgemeldet(true)), []);

  const neuLaden = useCallback(async () => {
    if (!token) { setLaden(false); return; }
    setLaden(true);
    try {
      const d = await api('laden');
      setBuchungen((d.buchungen as Buchung[]) || []);
      setSalden((d.salden as { privatCent: number; firmaCent: number }) || { privatCent: 0, firmaCent: 0 });
      setFirmaKategorien((d.firmaKategorien as string[]) || []);
      setPrivatKategorien((d.privatKategorien as string[]) || []);
    } catch (e) {
      setFehler(e instanceof Error ? e.message : 'Fehler beim Laden.');
    } finally { setLaden(false); }
  }, [api, token]);

  useEffect(() => { void neuLaden(); }, [neuLaden]);

  async function buchungAnlegen() {
    setFehler(''); setHinweis('');
    try {
      const d = await api('anlegen', {
        konto: bKonto, typ: bTyp, betrag: bBetrag.replace(',', '.'),
        kategorie: bKategorie, beschreibung: bBeschreibung, datum: bDatum,
      });
      setBBetrag(''); setBKategorie(''); setBBeschreibung('');
      setHinweis((d.warnung as string) || 'Buchung gespeichert.');
      await neuLaden();
    } catch (e) { setFehler(e instanceof Error ? e.message : 'Fehler.'); }
  }

  async function transferAnlegen() {
    setFehler(''); setHinweis('');
    const nach: Konto = tVon === 'privat' ? 'firma' : 'privat';
    try {
      await api('transfer', { von: tVon, nach, betrag: tBetrag.replace(',', '.'), beschreibung: tBeschreibung, datum: heute() });
      setTBetrag(''); setTBeschreibung('');
      setHinweis(`${euro(Number(tBetrag.replace(',', '.')) * 100 || 0)} von ${KONTO_NAME[tVon]} nach ${KONTO_NAME[nach]} übertragen.`);
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
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 20px' }}>
          <div style={karte}>
            <h1 style={h1}>Finanzheft</h1>
            <Anmeldehinweis abgelaufen={abgemeldet} />
          </div>
        </div>
      </main>
    );
  }

  const kategorien = bKonto === 'firma' ? firmaKategorien : privatKategorien;

  return (
    <main style={huelle}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 20px 60px' }}>
        <h1 style={h1}>Finanzheft</h1>
        <p style={{ color: F.soft, marginTop: 0 }}>
          <a href="/einstellungen" style={{ color: F.blue }}>Einstellungen</a> ·{' '}
          <a href="/zahlungen" style={{ color: F.blue }}>Zahlungen</a>
        </p>
        <p style={{ color: F.soft, marginTop: 0, fontSize: 15 }}>
          Privates Geld und Geld der (noch nicht gegründeten) Firma bleiben strikt getrennt.
          Geld wandert von einem Konto zum anderen nur über den Transfer weiter unten – nie automatisch.
        </p>

        {fehler && <div style={{ ...box, borderColor: '#f5b5b5', background: '#ffeaea', color: F.warn }}>{fehler}</div>}
        {hinweis && <div style={{ ...box, borderColor: 'rgba(18,122,92,.4)', background: 'rgba(18,122,92,.1)', color: F.gut }}>{hinweis}</div>}
        {laden && <p style={{ color: F.muted }}>Wird geladen …</p>}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div style={{ ...karte, margin: '18px 0' }}>
            <div style={{ color: F.soft, fontSize: 14 }}>Privat</div>
            <div style={{ fontSize: 28, fontWeight: 800 }}>{euro(salden.privatCent)}</div>
          </div>
          <div style={{ ...karte, margin: '18px 0' }}>
            <div style={{ color: F.soft, fontSize: 14 }}>Firma</div>
            <div style={{ fontSize: 28, fontWeight: 800 }}>{euro(salden.firmaCent)}</div>
          </div>
        </div>

        <section style={karte}>
          <h2 style={h2}>Neue Buchung</h2>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <select style={feld} value={bKonto} onChange={(e) => { setBKonto(e.target.value as Konto); setBKategorie(''); }}>
              <option value="privat">Privat</option>
              <option value="firma">Firma</option>
            </select>
            <select style={feld} value={bTyp} onChange={(e) => setBTyp(e.target.value as 'einnahme' | 'ausgabe')}>
              <option value="ausgabe">Ausgabe</option>
              <option value="einnahme">Einnahme</option>
            </select>
            <input style={{ ...feld, width: 110 }} placeholder="Betrag €" value={bBetrag} onChange={(e) => setBBetrag(e.target.value)} />
            <input style={feld} list="finanzheft-kategorien" placeholder="Kategorie" value={bKategorie} onChange={(e) => setBKategorie(e.target.value)} />
            <datalist id="finanzheft-kategorien">
              {kategorien.map((k) => <option key={k} value={k} />)}
            </datalist>
            <input style={{ ...feld, flex: 1, minWidth: 160 }} placeholder="Beschreibung" value={bBeschreibung} onChange={(e) => setBBeschreibung(e.target.value)} />
            <input style={feld} type="date" value={bDatum} onChange={(e) => setBDatum(e.target.value)} />
          </div>
          <button style={{ ...knopf, marginTop: 12 }} disabled={!bBetrag || !bKategorie}
            onClick={() => void buchungAnlegen()}>
            Buchen
          </button>
        </section>

        <section style={karte}>
          <h2 style={h2}>Transfer zwischen den Konten</h2>
          <p style={{ color: F.soft, marginTop: 0, fontSize: 14 }}>
            Z. B. eine Entnahme: Firma zahlt an Privat. Beide Salden bleiben dabei exakt nachvollziehbar.
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <select style={feld} value={tVon} onChange={(e) => setTVon(e.target.value as Konto)}>
              <option value="firma">Firma</option>
              <option value="privat">Privat</option>
            </select>
            <span style={{ color: F.soft }}>→ {tVon === 'privat' ? 'Firma' : 'Privat'}</span>
            <input style={{ ...feld, width: 110 }} placeholder="Betrag €" value={tBetrag} onChange={(e) => setTBetrag(e.target.value)} />
            <input style={{ ...feld, flex: 1, minWidth: 160 }} placeholder="Beschreibung (optional)" value={tBeschreibung} onChange={(e) => setTBeschreibung(e.target.value)} />
          </div>
          <button style={{ ...knopf, marginTop: 12 }} disabled={!tBetrag} onClick={() => void transferAnlegen()}>
            Übertragen
          </button>
        </section>

        <section style={karte}>
          <h2 style={h2}>Buchungen</h2>
          {!buchungen.length && !laden && <p style={{ color: F.muted }}>Noch keine Buchungen.</p>}
          {!!buchungen.length && (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ textAlign: 'left', color: F.soft, borderBottom: `1px solid ${F.line}` }}>
                  <th style={th}>Datum</th><th style={th}>Konto</th><th style={th}>Kategorie</th>
                  <th style={th}>Beschreibung</th><th style={{ ...th, textAlign: 'right' }}>Betrag</th><th style={th} />
                </tr>
              </thead>
              <tbody>
                {buchungen.map((b) => (
                  <tr key={b.id} style={{ borderBottom: `1px solid ${F.line}` }}>
                    <td style={td}>{b.datum}</td>
                    <td style={td}>{KONTO_NAME[b.konto]}{b.transferId ? ' (Transfer)' : ''}</td>
                    <td style={td}>{b.kategorie}</td>
                    <td style={td}>{b.beschreibung}</td>
                    <td style={{ ...td, textAlign: 'right', color: b.typ === 'einnahme' ? F.gut : F.warn }}>
                      {b.typ === 'einnahme' ? '+' : '−'}{euro(b.betragCent)}
                    </td>
                    <td style={td}>
                      <button style={knopfKlein} onClick={() => void buchungLoeschen(b.id)}>löschen</button>
                    </td>
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
const td: React.CSSProperties = { padding: '8px 6px' };
const knopf: React.CSSProperties = {
  font: 'inherit', fontWeight: 600, padding: '9px 18px', border: 0,
  borderRadius: 9, background: F.blue, color: '#fff', cursor: 'pointer',
};
const knopfKlein: React.CSSProperties = {
  font: 'inherit', fontSize: 13, fontWeight: 600, padding: '4px 10px',
  border: `1px solid ${F.line}`, borderRadius: 8, background: F.weiss,
  color: F.warn, cursor: 'pointer',
};
