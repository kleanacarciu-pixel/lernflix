'use client';
// =============================================================================
// Terminliste im Portal
//
// Zeigt angemeldeten Schülern und Eltern alle Termine des Schuljahres,
// die Beträge und die Dokumente zum Herunterladen.
// Nutzt dieselbe Anmeldung wie der Kalender.
// =============================================================================
import { useCallback, useEffect, useState } from 'react';
import { rufeApi, ladeSitzung, oeffneMitSitzung } from '@/components/sitzung';

const F = {
  ink: '#0F172A', soft: '#475569', muted: '#94A3B8', line: '#E2E8F0',
  teal: '#2BB3C0', bg: '#fffdf8', weiss: '#fff',
};

type Rate = { monat: string; betragCent: number };
type ZahlStatus = 'bezahlt' | 'offen' | 'ueberfaellig' | 'pausiert';
type Zahlstand = { monat: string; monatName: string; betragCent: number; status: ZahlStatus };
type Sperre = { grund?: string; regelterminAusgesetzt: boolean; termineEntfallenAb: string | null };
type Bank = { inhaber: string; iban: string; bank: string };
type Vertragsdaten = {
  schuelerName: string; schuljahr: string; zeitText: string;
  termine: string[]; jahresbetragCent: number;
  zahlweise: 'raten' | 'einmal'; raten: Rate[]; einmalCent: number;
  bestaetigt: boolean;
  unterzeichnetAm: string | null;
  /** Weg zur Unterschrift, solange der Vertrag noch offen ist. */
  vertragLink: string | null;
};

const eur = (c: number) => (c / 100).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
const datumDe = (iso: string) => { const [j, m, t] = iso.split('-'); return `${t}.${m}.${j}`; };
const monatName = (iso: string) => {
  const [j, m] = iso.split('-');
  return `${['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'][Number(m) - 1]} ${j}`;
};
const heute = () => new Date().toISOString().slice(0, 10);

const ZAHL_FARBE: Record<ZahlStatus, string> = {
  bezahlt: '#127a5c', offen: '#8a6a20', ueberfaellig: '#c2410c', pausiert: '#a12a2a',
};
const ZAHL_TEXT: Record<ZahlStatus, string> = {
  bezahlt: 'bezahlt', offen: 'offen', ueberfaellig: 'überfällig', pausiert: 'pausiert',
};

export default function TerminlisteSeite() {
  const [token, setToken] = useState('');
  const [daten, setDaten] = useState<Vertragsdaten | null>(null);
  const [laden, setLaden] = useState(true);
  const [fehler, setFehler] = useState('');
  const [alle, setAlle] = useState(false);
  const [zahlstand, setZahlstand] = useState<Zahlstand[]>([]);
  const [sperre, setSperre] = useState<Sperre | null>(null);
  const [bank, setBank] = useState<Bank | null>(null);

  useEffect(() => {
    const s = ladeSitzung();
    setToken(s?.token || '');
    if (!s?.token) setLaden(false);
  }, []);

  // rufeApi verlängert eine abgelaufene Anmeldung im Hintergrund selbst –
  // vorher lief der Abruf hier ohne diese Verlängerung, und wer die Seite
  // nach einer Stunde öffnete, sah nur „Bitte einloggen".
  const holen = useCallback(async () => {
    if (!token) return;
    try {
      const d = await rufeApi('/api/vertrag', 'meinVertrag', {}, () => setToken(''));
      setDaten((d.vertrag as Vertragsdaten) ?? null);

      // Zahlungsstand ist nur ein Zusatz – schlägt er fehl, bleibt die Seite nutzbar.
      try {
        const z = await rufeApi('/api/zahlungen', 'meineZahlungen', {});
        setZahlstand((z.zahlungen || []) as Zahlstand[]);
        setSperre((z.sperre as Sperre | null) ?? null);
        setBank((z.bank as Bank | null) ?? null);
      } catch { /* Seite bleibt ohne Zahlungsstand nutzbar */ }
    } catch (e) {
      const m = e instanceof Error ? e.message : 'Fehler beim Laden.';
      // Nach echter Abmeldung zeigt die Seite den Anmelde-Hinweis, keinen Fehler.
      if (m !== 'Bitte einloggen.') setFehler(m);
    } finally { setLaden(false); }
  }, [token]);

  useEffect(() => { void holen(); }, [holen]);

  const pdfOeffnen = (art: string) => {
    // Klappt auch das Verlängern nicht mehr, zeigt die Seite den Anmelde-Hinweis.
    void oeffneMitSitzung(`/api/vertrag?art=${art}`).catch(() => setToken(''));
  };

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

      {!daten.bestaetigt && daten.vertragLink && (
        <div style={{
          border: `1px solid ${F.teal}`, background: 'rgba(43,179,192,.08)',
          borderRadius: 12, padding: '14px 16px', margin: '14px 0',
        }}>
          <b>Der Vertrag ist noch nicht unterschrieben</b>
          <p style={{ margin: '6px 0 10px', fontSize: 14, color: F.soft }}>
            Solange er offen ist, lassen sich keine Stunden buchen. Das dauert nur
            eine Minute – unterschrieben wird direkt auf der Seite.
          </p>
          <a href={daten.vertragLink} style={{
            display: 'inline-block', background: F.teal, color: '#fff', textDecoration: 'none',
            fontWeight: 700, padding: '10px 18px', borderRadius: 10, fontSize: 15,
          }}>
            Vertrag ansehen und unterschreiben
          </a>
        </div>
      )}

      {sperre && (
        <div style={{
          border: '1px solid rgba(161,42,42,.35)', background: 'rgba(161,42,42,.08)',
          color: '#a12a2a', borderRadius: 12, padding: '14px 16px', margin: '14px 0',
        }}>
          <b>{sperre.regelterminAusgesetzt ? 'Der Unterricht ist pausiert' : 'Buchungen sind gerade gesperrt'}</b>
          <p style={{ margin: '6px 0 0', fontSize: 14 }}>
            Bei uns ist eine Rate noch nicht angekommen.{' '}
            {sperre.regelterminAusgesetzt
              ? 'Der feste Wochentermin ruht deshalb vorerst.'
              : 'Zusätzliche Stunden lassen sich deshalb gerade nicht buchen; der feste Wochentermin läuft weiter.'}
            {sperre.termineEntfallenAb && ` Termine vor dem ${datumDe(sperre.termineEntfallenAb)} finden noch statt.`}
            {' '}Sobald die Zahlung da ist, ist sofort alles wieder frei.
          </p>
          {bank && (
            <p style={{ margin: '8px 0 0', fontSize: 14 }}>
              {bank.inhaber} · IBAN {bank.iban}
            </p>
          )}
          <p style={{ margin: '8px 0 0', fontSize: 14 }}>
            Hat sich das mit deiner Überweisung überschnitten oder ist etwas dazwischengekommen?
            Schreib Anna kurz – wir finden eine Lösung.
          </p>
        </div>
      )}

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

      {!!zahlstand.length && (
        <section style={karte}>
          <h2 style={h2}>Zahlungsstand</h2>
          <p style={{ color: F.soft, fontSize: 14, marginTop: 0 }}>
            Jede Rate ist vom 1. bis 10. des Monats fällig. Was hier nicht als offen steht,
            ist bei Anna angekommen.
          </p>
          {zahlstand.map((z) => (
            <div key={z.monat} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              gap: 12, padding: '7px 0', borderTop: `1px solid ${F.line}`, fontSize: 15,
            }}>
              <span style={{ color: F.soft }}>{z.monatName}</span>
              <span style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                {eur(z.betragCent)}
                <span style={{
                  fontSize: 12, fontWeight: 700, padding: '2px 9px', borderRadius: 20,
                  background: `${ZAHL_FARBE[z.status]}1a`, color: ZAHL_FARBE[z.status],
                }}>{ZAHL_TEXT[z.status]}</span>
              </span>
            </div>
          ))}
        </section>
      )}

      <section style={karte}>
        <h2 style={h2}>Dokumente</h2>
        {/* Der Token kommt erst beim Klick (und wird bei Bedarf verlängert) –
            fest im Link wäre er nach etwa einer Stunde abgelaufen. */}
        <div style={{ display: 'flex', gap: 9, flexWrap: 'wrap' }}>
          {daten.bestaetigt && (
            <button style={knopfHell} onClick={() => pdfOeffnen('vertrag')}>Vertrag (PDF)</button>
          )}
          <button style={knopfHell} onClick={() => pdfOeffnen('terminliste')}>Terminliste (PDF)</button>
          {daten.bestaetigt && (
            <button style={knopfHell} onClick={() => pdfOeffnen('bestaetigung')}>Vertragsbestätigung (PDF)</button>
          )}
          {daten.bestaetigt && (
            <button style={knopfHell} onClick={() => pdfOeffnen('bescheinigung')}>Zahlungsbescheinigung (PDF)</button>
          )}
          <button style={knopfHell} onClick={() => pdfOeffnen('agb')}>AGB (PDF)</button>
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
