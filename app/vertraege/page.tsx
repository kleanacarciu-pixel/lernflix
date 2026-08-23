'use client';
// =============================================================================
// Verträge – Admin-Seite (nur Kleana)
//
// Hier entsteht ein Schuljahresvertrag: Termin und Stundensatz wählen, Beträge
// vorher ansehen, Angebot verschicken. Dazu Wochentagswechsel, Kündigung und
// die Endabrechnung mit fertigem Text zum Kopieren.
//
// Nutzt dieselbe Anmeldung wie der Kalender (Sitzung aus dem Browserspeicher).
// =============================================================================
import { useCallback, useEffect, useState } from 'react';
import Anmeldehinweis from '@/components/Anmeldehinweis';
import { rufeApi, ladeSitzung, aktuellerToken } from '@/components/sitzung';

const WOCHENTAGE = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];

type Schueler = { user_id: string; name: string; email: string | null };
type Schuljahr = { id: string; name: string; aktiv: boolean };
type Zeit = { wochentag: number; uhrzeit: string };
type VertragZeile = {
  id: string; schuelerId: string; name: string; schuljahr: string;
  zeiten: Zeit[]; zeitText: string; stundensatz: number;
  jahresbetragCent: number; zahlweise: 'raten' | 'einmal';
  status: 'angeboten' | 'aktiv' | 'gekuendigt' | 'beendet';
  bestaetigt: boolean; kuendigungZum: string | null;
};
type Posten = { wochentag: number; anzahl: number; satzCent: number; summeCent: number; voll: boolean };
type Rate = { monat: string; betragCent: number };
type Vorschau = {
  schuljahr: string; posten: Posten[]; jahresbetragCent: number;
  raten: Rate[]; einmalCent: number; anzahlTermine: number;
};
type Termin = { datum: string; satzCent: number };
type Abrechnung = {
  bisDatum: string; schuelerName: string; schuljahrName: string;
  gehalten: Termin[]; kurzfristig: string[]; entfallen: string[]; zusatz: Termin[];
  vertragSollCent: number; zusatzSollCent: number; sollCent: number;
  gezahltCent: number; differenzCent: number;
  art: 'erstattung' | 'nachzahlung' | 'ausgeglichen';
  nachlassEntfaellt: boolean; entfallenNachEnde: number;
  gruende: Record<string, string>;
  frist: { ok: boolean; fruehestens: string; hinweise: string[] };
};

const F = {
  ink: '#0F172A', soft: '#475569', muted: '#94A3B8', line: '#E2E8F0',
  blue: '#1769FF', bg: '#fffdf8', weiss: '#fff', warn: '#a12a2a', gut: '#127a5c',
};

const eur = (c: number) => (c / 100).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
const datumDe = (iso: string) => { const [j, m, t] = iso.split('-'); return t ? `${t}.${m}.${j}` : iso; };
const monatName = (iso: string) => {
  const [j, m] = iso.split('-');
  return `${['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'][Number(m) - 1]} ${j}`;
};

const STATUS_TEXT: Record<VertragZeile['status'], string> = {
  angeboten: 'Angebot verschickt', aktiv: 'aktiv', gekuendigt: 'gekündigt', beendet: 'beendet',
};
const STATUS_FARBE: Record<VertragZeile['status'], string> = {
  angeboten: '#8a6a20', aktiv: '#127a5c', gekuendigt: '#c2410c', beendet: '#64748b',
};

export default function VertraegeSeite() {
  const [token, setToken] = useState('');
  const [laden, setLaden] = useState(true);
  const [fehler, setFehler] = useState('');
  const [hinweis, setHinweis] = useState('');
  // Abgelaufene Sitzung: Anmeldehinweis statt leerer Vertragsliste zeigen.
  const [abgemeldet, setAbgemeldet] = useState(false);

  const [schueler, setSchueler] = useState<Schueler[]>([]);
  const [vertraege, setVertraege] = useState<VertragZeile[]>([]);
  const [heute, setHeute] = useState('');
  const [zeigeBeendete, setZeigeBeendete] = useState(false);

  // Formular „neuer Vertrag"
  const [nSchueler, setNSchueler] = useState('');
  const [nSatz, setNSatz] = useState('45');
  const [nZweitSatz, setNZweitSatz] = useState('');
  const [nZweitesKind, setNZweitesKind] = useState(false);
  const [nBeginn, setNBeginn] = useState('');
  const [nZeiten, setNZeiten] = useState<Zeit[]>([{ wochentag: 1, uhrzeit: '15:00' }]);
  const [vorschau, setVorschau] = useState<Vorschau | null>(null);

  // Wechsel und Kündigung
  const [wechselFuer, setWechselFuer] = useState<VertragZeile | null>(null);
  const [wAlt, setWAlt] = useState(0);
  const [wNeu, setWNeu] = useState(0);
  const [wZeit, setWZeit] = useState('15:00');
  const [wDatum, setWDatum] = useState('');
  const [kuendFuer, setKuendFuer] = useState<VertragZeile | null>(null);
  const [kZum, setKZum] = useState('');
  const [abrechnung, setAbrechnung] = useState<Abrechnung | null>(null);
  const [abText, setAbText] = useState('');
  const [gekuendigt, setGekuendigt] = useState(false);

  useEffect(() => {
    setToken(ladeSitzung()?.token || '');
  }, []);

  // Laeuft der Zugangs-Token ab, verlaengert rufeApi ihn selbst – genau wie
  // der Kalender. Ausgeloggt wird nur, wenn die Anmeldung wirklich weg ist.
  const api = useCallback(async (action: string, params: Record<string, unknown> = {}) => {
    const d = await rufeApi('/api/vertrag', action, params, () => setAbgemeldet(true));
    setToken(aktuellerToken());   // ggf. erneuerter Token fuer die PDF-Links
    return d;
  }, []);

  const neuLaden = useCallback(async () => {
    if (!token) { setLaden(false); return; }
    setLaden(true); setFehler('');
    try {
      const d = await api('liste');
      setSchueler((d.schueler || []) as Schueler[]);
      setVertraege((d.vertraege || []) as VertragZeile[]);
      setHeute(String(d.heute || ''));
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

  const felder = () => ({
    schueler_id: nSchueler,
    zeiten: nZeiten,
    stundensatz: Number(nSatz.replace(',', '.')) || 0,
    stundensatz_zweittermin: nZweitSatz ? Number(nZweitSatz.replace(',', '.')) : undefined,
    zweites_kind: nZweitesKind,
    vertragsbeginn: nBeginn,
  });

  async function vorschauHolen() {
    setFehler(''); setHinweis('');
    try { setVorschau((await api('vorschau', felder())) as unknown as Vorschau); }
    catch (e) { setFehler(e instanceof Error ? e.message : 'Fehler.'); setVorschau(null); }
  }

  async function kuendigungRechnen(v: VertragZeile, zum: string) {
    setFehler('');
    try {
      const d = await api('kuendigungVorschau', { vertrag_id: v.id, zum });
      setAbrechnung(d.abrechnung as Abrechnung);
      setAbText(String(d.text || ''));
    } catch (e) { setFehler(e instanceof Error ? e.message : 'Fehler.'); }
  }

  function kuendigungOeffnen(v: VertragZeile) {
    setKuendFuer(v); setGekuendigt(!!v.kuendigungZum); setAbrechnung(null); setAbText('');
    const zum = v.kuendigungZum || monatsEndeVon(heute);
    setKZum(zum);
    void kuendigungRechnen(v, zum);
  }

  if (!token || abgemeldet) {
    return (
      <main style={huelle}>
        <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 20px' }}>
          <div style={karte}>
            <h1 style={h1}>Verträge</h1>
            <Anmeldehinweis abgelaufen={abgemeldet} />
          </div>
        </div>
      </main>
    );
  }

  const sichtbar = zeigeBeendete ? vertraege : vertraege.filter((v) => v.status !== 'beendet');

  return (
    <main style={huelle}>
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 20px 60px' }}>
        <h1 style={h1}>Verträge</h1>
        <p style={{ color: F.soft, marginTop: 0 }}>
          Schuljahresverträge anlegen, Termine wechseln, kündigen und abrechnen.{' '}
          <a href="/zahlungen" style={{ color: F.blue }}>Zahlungen</a> ·{' '}
          <a href="/schuljahr" style={{ color: F.blue }}>Schuljahr &amp; Ferien</a> ·{' '}
          <a href="/kalender" style={{ color: F.blue }}>Kalender</a>
        </p>

        {fehler && <div style={{ ...box, borderColor: '#f5b5b5', background: '#ffeaea', color: F.warn }}>{fehler}</div>}
        {hinweis && <div style={{ ...box, borderColor: 'rgba(18,122,92,.4)', background: 'rgba(18,122,92,.1)', color: F.gut }}>{hinweis}</div>}
        {laden && <p style={{ color: F.muted }}>Wird geladen …</p>}

        {/* -------------------------------------------------- Bestehende Verträge */}
        <section style={karte}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <h2 style={{ ...h2, margin: 0 }}>Laufende Verträge</h2>
            <label style={{ color: F.soft, fontSize: 14, display: 'flex', gap: 6, alignItems: 'center' }}>
              <input type="checkbox" checked={zeigeBeendete} onChange={(e) => setZeigeBeendete(e.target.checked)} />
              beendete anzeigen
            </label>
          </div>

          {!sichtbar.length && !laden && (
            <p style={{ color: F.muted, marginTop: 14 }}>Noch kein Vertrag angelegt.</p>
          )}

          {sichtbar.map((v) => (
            <div key={v.id} style={zeile}>
              <div>
                <b>{v.name}</b>
                <span style={{ ...pille, background: `${STATUS_FARBE[v.status]}1a`, color: STATUS_FARBE[v.status] }}>
                  {STATUS_TEXT[v.status]}
                </span>
                {v.status === 'angeboten' && !v.bestaetigt && (
                  <span style={{ ...pille, background: 'rgba(148,163,184,.16)', color: F.soft }}>noch nicht bestätigt</span>
                )}
                <div style={{ color: F.soft, fontSize: 14, marginTop: 2 }}>
                  {v.schuljahr} · {v.zeitText || '—'} · {eur(v.jahresbetragCent)}
                  {v.zahlweise === 'einmal' ? ' (Einmalzahlung)' : ''}
                </div>
                {v.kuendigungZum && (
                  <div style={{ color: '#c2410c', fontSize: 14 }}>endet zum {datumDe(v.kuendigungZum)}</div>
                )}
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                {v.status === 'angeboten' && (
                  <button style={knopfKlein}
                    onClick={() => void tun(() => api('erneutSenden', { vertrag_id: v.id }), 'Angebot erneut verschickt.')}>
                    Angebot erneut senden
                  </button>
                )}
                {(v.status === 'aktiv' || v.status === 'angeboten') && (
                  <button style={knopfKlein} onClick={() => {
                    setWechselFuer(v);
                    setWAlt(v.zeiten[0]?.wochentag ?? 0);
                    setWNeu(v.zeiten[0]?.wochentag ?? 0);
                    setWZeit(v.zeiten[0]?.uhrzeit?.slice(0, 5) || '15:00');
                    setWDatum('');
                  }}>Termin wechseln</button>
                )}
                <a style={{ ...knopfKlein, textDecoration: 'none' }}
                  href={`/api/vertrag?sitzung=${encodeURIComponent(token)}&vertrag=${v.id}&art=terminliste`}
                  target="_blank" rel="noopener">Terminliste</a>
                {v.status !== 'beendet' && (
                  <button style={{ ...knopfKlein, color: F.warn }} onClick={() => kuendigungOeffnen(v)}>
                    {v.kuendigungZum ? 'Abrechnung' : 'kündigen'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </section>

        {/* ------------------------------------------------------- Neuer Vertrag */}
        <section style={karte}>
          <h2 style={h2}>Neuer Vertrag</h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(190px,1fr))', gap: 10 }}>
            <label style={etikett}>Schüler/in
              <select style={feld} value={nSchueler} onChange={(e) => { setNSchueler(e.target.value); setVorschau(null); }}>
                <option value="">bitte wählen …</option>
                {schueler.map((s) => <option key={s.user_id} value={s.user_id}>{s.name}{s.email ? '' : ' (keine E-Mail!)'}</option>)}
              </select>
            </label>
            <label style={etikett}>Stundensatz (€)
              <input style={feld} value={nSatz} inputMode="decimal"
                onChange={(e) => { setNSatz(e.target.value); setVorschau(null); }} />
            </label>
            <label style={etikett}>Vertragsbeginn (Monatserster)
              <input style={feld} type="date" value={nBeginn}
                onChange={(e) => { setNBeginn(e.target.value); setVorschau(null); }} />
            </label>
          </div>

          <div style={{ marginTop: 14 }}>
            <b style={{ fontSize: 15 }}>Wochentermine</b>
            {nZeiten.map((z, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                <select style={{ ...feld, flex: '0 1 170px' }} value={z.wochentag}
                  onChange={(e) => { const n = [...nZeiten]; n[i] = { ...z, wochentag: Number(e.target.value) }; setNZeiten(n); setVorschau(null); }}>
                  {WOCHENTAGE.map((w, wi) => <option key={wi} value={wi}>{w}</option>)}
                </select>
                <input style={{ ...feld, flex: '0 1 120px' }} type="time" value={z.uhrzeit}
                  onChange={(e) => { const n = [...nZeiten]; n[i] = { ...z, uhrzeit: e.target.value }; setNZeiten(n); setVorschau(null); }} />
                {nZeiten.length > 1 && (
                  <button style={{ ...knopfKlein, color: F.warn }}
                    onClick={() => { setNZeiten(nZeiten.filter((_, j) => j !== i)); setVorschau(null); }}>entfernen</button>
                )}
              </div>
            ))}
            {nZeiten.length < 2 && (
              <button style={{ ...knopfKlein, marginTop: 8 }}
                onClick={() => { setNZeiten([...nZeiten, { wochentag: 3, uhrzeit: '15:00' }]); setVorschau(null); }}>
                zweiten Wochentermin hinzufügen
              </button>
            )}
          </div>

          <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${F.line}` }}>
            <label style={{ color: F.soft, fontSize: 14, display: 'flex', gap: 7, alignItems: 'center' }}>
              <input type="checkbox" checked={nZweitesKind}
                onChange={(e) => { setNZweitesKind(e.target.checked); setVorschau(null); }} />
              Geschwisterkind – ermäßigter Satz
            </label>
            {(nZweitesKind || nZeiten.length > 1) && (
              <label style={{ ...etikett, maxWidth: 240, marginTop: 10 }}>Ermäßigter Satz (€)
                <input style={feld} value={nZweitSatz} inputMode="decimal"
                  placeholder={`Standard: ${(Number(nSatz.replace(',', '.')) || 0) - 5}`}
                  onChange={(e) => { setNZweitSatz(e.target.value); setVorschau(null); }} />
              </label>
            )}
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
            <button style={knopfKlein} onClick={() => void vorschauHolen()}>Beträge ansehen</button>
            <button style={knopf} disabled={!vorschau}
              onClick={() => { if (confirm('Vertrag anlegen und das Angebot per E-Mail verschicken?')) void tun(async () => { await api('anlegen', felder()); setVorschau(null); }, 'Vertrag angelegt, Angebot verschickt.'); }}>
              Vertrag anlegen und Angebot senden
            </button>
          </div>

          {vorschau && (
            <div style={{ ...box, borderColor: F.line, background: '#fbfbfa', marginTop: 16 }}>
              <b>Schuljahr {vorschau.schuljahr} · {vorschau.anzahlTermine} Termine</b>
              <div style={{ marginTop: 10 }}>
                {vorschau.posten.map((p) => (
                  <Zeile key={p.wochentag}
                    links={`${WOCHENTAGE[p.wochentag]}: ${p.anzahl} × ${eur(p.satzCent)}${p.voll ? '' : ' (ermäßigt)'}`}
                    rechts={eur(p.summeCent)} />
                ))}
                <Zeile links="Jahresbetrag" rechts={eur(vorschau.jahresbetragCent)} fett />
                <Zeile links={`${vorschau.raten.length} Monatsraten ab ${vorschau.raten[0] ? monatName(vorschau.raten[0].monat) : '—'}`}
                  rechts={`je ${eur(vorschau.raten[0]?.betragCent ?? 0)}`} />
                <Zeile links="Einmalzahlung (50,00 € Nachlass)" rechts={eur(vorschau.einmalCent)} />
              </div>
              <p style={{ color: F.muted, fontSize: 13, margin: '10px 0 0' }}>
                Die Zahlweise wählen die Eltern selbst auf der Bestätigungsseite.
              </p>
            </div>
          )}
        </section>

        {/* ---------------------------------------------------- Termin wechseln */}
        {wechselFuer && (
          <div style={overlay} onClick={() => setWechselFuer(null)}>
            <div style={{ ...karte, maxWidth: 520, margin: 0 }} onClick={(e) => e.stopPropagation()}>
              <h2 style={h2}>Termin wechseln – {wechselFuer.name}</h2>
              <p style={{ color: F.soft, fontSize: 14, marginTop: 0 }}>
                Termine vor dem Wechseldatum bleiben auf dem alten Wochentag, ab dem
                Wechseldatum gilt der neue. Bereits fällige Raten bleiben unverändert;
                nur die restlichen Monate werden neu verteilt.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 10 }}>
                <label style={etikett}>bisher
                  <select style={feld} value={wAlt} onChange={(e) => setWAlt(Number(e.target.value))}>
                    {wechselFuer.zeiten.map((z) => (
                      <option key={z.wochentag} value={z.wochentag}>{WOCHENTAGE[z.wochentag]}</option>
                    ))}
                  </select>
                </label>
                <label style={etikett}>neu
                  <select style={feld} value={wNeu} onChange={(e) => setWNeu(Number(e.target.value))}>
                    {WOCHENTAGE.map((w, i) => <option key={i} value={i}>{w}</option>)}
                  </select>
                </label>
                <label style={etikett}>Uhrzeit
                  <input style={feld} type="time" value={wZeit} onChange={(e) => setWZeit(e.target.value)} />
                </label>
                <label style={etikett}>ab wann
                  <input style={feld} type="date" value={wDatum} onChange={(e) => setWDatum(e.target.value)} />
                </label>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
                <button style={knopf} disabled={!wDatum}
                  onClick={() => { const v = wechselFuer; setWechselFuer(null);
                    void tun(() => api('wochentagWechseln', {
                      vertrag_id: v.id, alter_wochentag: wAlt, neuer_wochentag: wNeu,
                      neue_uhrzeit: wZeit, wechseldatum: wDatum,
                    }), 'Termin gewechselt – die Eltern haben die neue Terminliste bekommen.'); }}>
                  wechseln und Eltern informieren
                </button>
                <button style={knopfKlein} onClick={() => setWechselFuer(null)}>abbrechen</button>
              </div>
            </div>
          </div>
        )}

        {/* --------------------------------------------- Kündigung / Abrechnung */}
        {kuendFuer && (
          <div style={overlay} onClick={() => setKuendFuer(null)}>
            <div style={{ ...karte, maxWidth: 640, margin: 0, maxHeight: '88vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
              <h2 style={h2}>{gekuendigt ? 'Endabrechnung' : 'Vertrag kündigen'} – {kuendFuer.name}</h2>

              <label style={{ ...etikett, maxWidth: 260 }}>Vertrag endet zum
                <input style={feld} type="date" value={kZum}
                  onChange={(e) => { setKZum(e.target.value); if (e.target.value.length === 10) void kuendigungRechnen(kuendFuer, e.target.value); }} />
              </label>

              {abrechnung?.frist && !abrechnung.frist.ok && (
                <div style={{ ...box, borderColor: 'rgba(217,154,54,.5)', background: 'rgba(217,154,54,.12)', color: '#8a6a20' }}>
                  {abrechnung.frist.hinweise.map((h, i) => <div key={i}>{h}</div>)}
                  <div style={{ marginTop: 6, fontSize: 14 }}>
                    Du darfst trotzdem so kündigen – es ist nur ein Hinweis.{' '}
                    <button style={{ ...mini, marginLeft: 4 }}
                      onClick={() => { setKZum(abrechnung.frist.fruehestens); void kuendigungRechnen(kuendFuer, abrechnung.frist.fruehestens); }}>
                      auf {datumDe(abrechnung.frist.fruehestens)} setzen
                    </button>
                  </div>
                </div>
              )}

              {abrechnung && (
                <>
                  <div style={{ marginTop: 14 }}>
                    <Zeile links={`Gehaltene Stunden bis ${datumDe(abrechnung.bisDatum)}`} rechts={String(abrechnung.gehalten.length)} />
                    {!!abrechnung.kurzfristig.length && (
                      <Zeile links="  davon kurzfristig abgesagt (zählt trotzdem)" rechts={String(abrechnung.kurzfristig.length)} />
                    )}
                    {!!abrechnung.entfallen.length && (
                      <Zeile links="  nicht berechnet (rechtzeitig / von Anna abgesagt)" rechts={String(abrechnung.entfallen.length)} />
                    )}
                    <Zeile links="Vertragsstunden" rechts={eur(abrechnung.vertragSollCent)} />
                    {!!abrechnung.zusatz.length && (
                      <Zeile links={`Zusatzstunden (${abrechnung.zusatz.length})`} rechts={eur(abrechnung.zusatzSollCent)} />
                    )}
                    <Zeile links="Summe" rechts={eur(abrechnung.sollCent)} fett />
                    <Zeile links="Bereits gezahlt" rechts={eur(abrechnung.gezahltCent)} />
                    <div style={{
                      display: 'flex', justifyContent: 'space-between', gap: 12, marginTop: 10,
                      paddingTop: 10, borderTop: `2px solid ${F.line}`, fontWeight: 800, fontSize: 17,
                      color: abrechnung.art === 'nachzahlung' ? F.warn : abrechnung.art === 'erstattung' ? F.gut : F.ink,
                    }}>
                      <span>{abrechnung.art === 'erstattung' ? 'Erstattung an die Familie'
                        : abrechnung.art === 'nachzahlung' ? 'Nachzahlung offen' : 'Ausgeglichen'}</span>
                      <span>{eur(Math.abs(abrechnung.differenzCent))}</span>
                    </div>
                    {abrechnung.entfallenNachEnde > 0 && (
                      <p style={{ color: F.muted, fontSize: 13, marginBottom: 0 }}>
                        {abrechnung.entfallenNachEnde} Termine nach dem Vertragsende entfallen ersatzlos.
                      </p>
                    )}
                    {abrechnung.nachlassEntfaellt && (
                      <p style={{ color: F.muted, fontSize: 13, marginBottom: 0 }}>
                        Einmalzahlung: Der 50-€-Nachlass gilt nur fürs volle Schuljahr und ist hier
                        nicht angesetzt.
                      </p>
                    )}
                  </div>

                  {!!abrechnung.entfallen.length && (
                    <details style={{ marginTop: 12 }}>
                      <summary style={{ cursor: 'pointer', color: F.blue, fontWeight: 600, fontSize: 14 }}>
                        abgesagte Termine ansehen
                      </summary>
                      <div style={{ marginTop: 8, fontSize: 14, color: F.soft }}>
                        {[...abrechnung.entfallen, ...abrechnung.kurzfristig].sort().map((d) => (
                          <div key={d}>{datumDe(d)} — {abrechnung.gruende[d] || 'abgesagt'}</div>
                        ))}
                      </div>
                    </details>
                  )}

                  <div style={{ marginTop: 16 }}>
                    <b style={{ fontSize: 15 }}>Text für die E-Mail</b>
                    <textarea readOnly value={abText}
                      style={{ ...feld, width: '100%', minHeight: 240, marginTop: 8, fontFamily: 'inherit', fontSize: 13 }} />
                    <button style={{ ...knopfKlein, marginTop: 8 }}
                      onClick={() => { void navigator.clipboard?.writeText(abText); setHinweis('Text kopiert.'); }}>
                      Text kopieren
                    </button>
                  </div>
                </>
              )}

              <div style={{ display: 'flex', gap: 8, marginTop: 18, flexWrap: 'wrap', borderTop: `1px solid ${F.line}`, paddingTop: 14 }}>
                {!gekuendigt && (
                  <button style={knopf} disabled={!kZum}
                    onClick={() => { const v = kuendFuer;
                      if (!confirm(`Vertrag von ${v.name} zum ${datumDe(kZum)} kündigen?`)) return;
                      void tun(async () => {
                        const d = await api('kuendigen', { vertrag_id: v.id, zum: kZum });
                        setAbrechnung(d.abrechnung as Abrechnung); setAbText(String(d.text || '')); setGekuendigt(true);
                      }, 'Vertrag gekündigt. Den Text unten kannst du den Eltern schicken.'); }}>
                    Vertrag kündigen
                  </button>
                )}
                {gekuendigt && (
                  <>
                    <button style={knopfKlein}
                      onClick={() => { const v = kuendFuer; setKuendFuer(null);
                        void tun(() => api('kuendigungZurueck', { vertrag_id: v.id }), 'Kündigung zurückgenommen.'); }}>
                      Kündigung zurücknehmen
                    </button>
                    <button style={{ ...knopfKlein, color: F.warn }}
                      onClick={() => { const v = kuendFuer;
                        if (!confirm('Vertrag als endgültig beendet markieren? Er verschwindet dann aus der Liste.')) return;
                        setKuendFuer(null);
                        void tun(() => api('beenden', { vertrag_id: v.id }), 'Vertrag beendet.'); }}>
                      als beendet markieren
                    </button>
                  </>
                )}
                <button style={knopfKlein} onClick={() => setKuendFuer(null)}>schließen</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

/** Letzter Tag des Monats – nur für den Startwert im Formular. */
function monatsEndeVon(iso: string): string {
  if (!iso) return '';
  const [j, m] = iso.split('-').map(Number);
  const d = new Date(Date.UTC(j, m, 0));
  return d.toISOString().slice(0, 10);
}

function Zeile({ links, rechts, fett }: { links: string; rechts: string; fett?: boolean }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', gap: 12, padding: '4px 0',
      fontWeight: fett ? 700 : 400, fontSize: fett ? 16 : 15,
    }}>
      <span style={{ color: fett ? F.ink : F.soft, whiteSpace: 'pre' }}>{links}</span>
      <span>{rechts}</span>
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
const zeile: React.CSSProperties = {
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  gap: 12, padding: '12px 0', borderTop: `1px solid ${F.line}`, flexWrap: 'wrap',
};
const etikett: React.CSSProperties = {
  display: 'flex', flexDirection: 'column', gap: 5, fontSize: 13, fontWeight: 600, color: F.soft,
};
const feld: React.CSSProperties = {
  font: 'inherit', fontWeight: 400, color: F.ink, padding: '9px 11px',
  border: `1px solid ${F.line}`, borderRadius: 9, background: F.weiss, boxSizing: 'border-box',
};
const knopf: React.CSSProperties = {
  font: 'inherit', fontWeight: 600, padding: '9px 18px', border: 0,
  borderRadius: 9, background: F.blue, color: '#fff', cursor: 'pointer',
};
const knopfKlein: React.CSSProperties = {
  font: 'inherit', fontSize: 14, fontWeight: 600, padding: '6px 12px',
  border: `1px solid ${F.line}`, borderRadius: 8, background: F.weiss,
  color: F.blue, cursor: 'pointer', display: 'inline-block',
};
const mini: React.CSSProperties = {
  font: 'inherit', fontSize: 13, fontWeight: 600, padding: '3px 9px',
  border: `1px solid ${F.line}`, borderRadius: 6, background: F.weiss,
  color: F.blue, cursor: 'pointer',
};
const pille: React.CSSProperties = {
  marginLeft: 8, fontSize: 12, fontWeight: 700, padding: '2px 9px',
  borderRadius: 20, background: 'rgba(23,105,255,.12)', color: F.blue,
};
const overlay: React.CSSProperties = {
  position: 'fixed', inset: 0, background: 'rgba(15,23,42,.45)', zIndex: 50,
  display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 18,
};
