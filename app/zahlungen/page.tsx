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
import Anmeldehinweis from '@/components/Anmeldehinweis';
import { rufeApi, ladeSitzung, aktuellerToken, oeffneMitSitzung } from '@/components/sitzung';


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
/** Gehaltene Stunde vor dem ersten Vertragstermin – zum Übernehmen als Plus. */
type VorvertragStunde = {
  schuelerId: string; name: string; datum: string; minuten: number;
  mode: string | null; dauerMin: number;
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
  minusWarnung: 'Frühwarnung: Minus-Stunden fast voll',
  terminEnde: 'Ein Wochentermin endet (Familienpreis entfällt)',
  vertragEinladung: 'Vertrag verschickt – Einladung zum Unterschreiben',
  vertragErinnerung: 'Erinnerung nach 5 Tagen ohne Unterschrift',
  vertragUnterschrieben: 'Vertrag unterschrieben – Bestätigung an die Eltern',
};

// Welche Platzhalter es in welchem Text gibt. Ohne diese Liste müsste Kleana
// raten – und ein falsch geschriebener Platzhalter fällt erst auf, wenn die
// E-Mail beim Empfänger als „{name}" ankommt.
const VORLAGEN_PLATZHALTER: Record<string, string> = {
  standard: '{name} {betrag} {monat} {iban} {inhaber} {verwendungszweck}',
  adminCheck: '— keine —',
  minusWarnung: '{name} {offen} {frei} {grenze}',
  terminEnde: '{name} {alterTag} {bleibtTag} {endeAm} {abMonat} {satz} {jahresbetrag} {rate}',
  vertragEinladung: '{name} {schuljahr} {termin} {anzahl} {jahresbetrag} {raten} {rate} {einmal} {link}',
  vertragErinnerung: '{name} {schuljahr} {tage} {link}',
  vertragUnterschrieben: '{name} {schuljahr} {termin} {anzahl} {jahresbetrag} {zahlweise} {inhaber} {iban} {verwendungszweck}',
};

export default function ZahlungenSeite() {
  const [token, setToken] = useState('');
  const [laden, setLaden] = useState(true);
  const [fehler, setFehler] = useState('');
  const [hinweis, setHinweis] = useState('');
  // Abgelaufene Sitzung: Anmeldehinweis statt leerer Matrix zeigen.
  const [abgemeldet, setAbgemeldet] = useState(false);

  const [monate, setMonate] = useState<string[]>([]);
  const [zeilen, setZeilen] = useState<Zeile[]>([]);
  const [plus, setPlus] = useState<Plus[]>([]);
  const [vorvertrag, setVorvertrag] = useState<VorvertragStunde[]>([]);
  const [vorlagen, setVorlagen] = useState<Vorlage[]>([]);
  const [offenVorlagen, setOffenVorlagen] = useState(false);
  // Nachtragen einer bereits gehaltenen Stunde (z. B. vor Vertragsbeginn):
  // Schülerliste kommt aus dem Kalender, das Formular steht bei Zusatzstunden.
  const [alleSchueler, setAlleSchueler] = useState<{ id: string; name: string }[]>([]);
  const [ntSid, setNtSid] = useState('');
  const [ntDatum, setNtDatum] = useState('');
  const [ntZeit, setNtZeit] = useState('17:00');
  const [ntDauer, setNtDauer] = useState(60);
  const [ntMode, setNtMode] = useState<'vor_ort' | 'online'>('vor_ort');
  const [ntLaeuft, setNtLaeuft] = useState(false);
  const [notizFuer, setNotizFuer] = useState<string>('');
  const [notizText, setNotizText] = useState('');
  const [exportLaeuft, setExportLaeuft] = useState(false);

  useEffect(() => {
    setToken(ladeSitzung()?.token || '');
  }, []);

  // Erfolgsmeldungen nach ein paar Sekunden ausblenden – sie schweben als
  // Kärtchen am unteren Rand und sollen nicht dauerhaft dort kleben.
  // Fehler bleiben stehen, bis die nächste Aktion sie ersetzt.
  useEffect(() => {
    if (!hinweis) return;
    const t = setTimeout(() => setHinweis(''), 8000);
    return () => clearTimeout(t);
  }, [hinweis]);

  // Laeuft der Zugangs-Token ab, verlaengert rufeApi ihn selbst – genau wie
  // der Kalender. Ausgeloggt wird nur, wenn die Anmeldung wirklich weg ist.
  const api = useCallback(async (action: string, params: Record<string, unknown> = {}) => {
    const d = await rufeApi('/api/zahlungen', action, params, () => setAbgemeldet(true));
    setToken(aktuellerToken());   // ggf. erneuerter Token fuer die PDF-Links
    return d;
  }, []);

  const neuLaden = useCallback(async () => {
    if (!token) { setLaden(false); return; }
    setLaden(true); setFehler('');
    try {
      const [u, p, k] = await Promise.all([
        api('uebersicht'), api('plusstunden'),
        // Schülerliste fürs Nachtragen – dieselbe Übersicht wie im Kalender.
        rufeApi('/api/kalender', 'overview', {}, () => setAbgemeldet(true)),
      ]);
      setMonate((u.monate || []) as string[]);
      setZeilen((u.zeilen || []) as Zeile[]);
      setPlus((p.schueler || []) as Plus[]);
      setVorvertrag((p.vorvertrag || []) as VorvertragStunde[]);
      setAlleSchueler(((k.students || []) as { id: string; name: string }[])
        .map((s) => ({ id: s.id, name: s.name })));
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

  async function stundeNachtragen() {
    if (!ntSid || !ntDatum) { setFehler('Bitte Schüler/in und Datum wählen.'); return; }
    const [h, m] = ntZeit.split(':').map(Number);
    setNtLaeuft(true); setFehler(''); setHinweis('');
    try {
      const d = await rufeApi('/api/kalender', 'adminBook', {
        studentId: ntSid, date: ntDatum, hour: (h || 0) + (m || 0) / 60,
        mode: ntMode, dauerMin: ntDauer, nachtrag: true,
      }, () => setAbgemeldet(true));
      setHinweis(String(d.message || 'Stunde nachgetragen.'));
      setNtDatum('');
      await neuLaden();
    } catch (e) { setFehler(e instanceof Error ? e.message : 'Fehler.'); }
    finally { setNtLaeuft(false); }
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

  // Eigene Sicherheitskopie für Kleana: alle Verträge samt Ratenplan als
  // JSON-Datei zum Herunterladen und selbst Aufbewahren.
  async function alleDatenExportieren() {
    if (exportLaeuft) return;
    setExportLaeuft(true);
    try {
      const d = await api('exportAlleDaten');
      const blob = new Blob([JSON.stringify(d, null, 2)], { type: 'application/json;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = String(d.dateiname || 'vertraege-zahlungen.json');
      document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
      setHinweis('Heruntergeladen ✓');
    } catch (e) { setFehler(e instanceof Error ? e.message : 'Export fehlgeschlagen.'); }
    finally { setExportLaeuft(false); }
  }

  async function vorlagenOeffnen() {
    setOffenVorlagen(true);
    if (!vorlagen.length) {
      try { setVorlagen(((await api('vorlagen')).vorlagen || []) as Vorlage[]); }
      catch (e) { setFehler(e instanceof Error ? e.message : 'Fehler.'); }
    }
  }

  if (!token || abgemeldet) {
    return (
      <main style={huelle}>
        <div style={{ maxWidth: 980, margin: '0 auto', padding: '0 20px' }}>
          <div style={karte}>
            <h1 style={h1}>Zahlungen</h1>
            <Anmeldehinweis abgelaufen={abgemeldet} />
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
          <a href="/vertraege" style={{ color: F.blue }}>Verträge</a> ·{' '}
          <a href="/schuljahr" style={{ color: F.blue }}>Schuljahr &amp; Ferien</a> ·{' '}
          <a href="/einstellungen" style={{ color: F.blue }}>Einstellungen</a> ·{' '}
          <a href="/kalender" style={{ color: F.blue }}>Kalender</a>
        </p>

        {fehler && <div style={{ ...box, borderColor: '#f5b5b5', background: '#ffeaea', color: F.warn }}>{fehler}</div>}
        {hinweis && <div style={{ ...box, borderColor: 'rgba(18,122,92,.4)', background: 'rgba(18,122,92,.1)', color: F.gut }}>{hinweis}</div>}
        {/* Dieselbe Meldung schwebt zusätzlich am unteren Rand: Die Knöpfe für
            Zusatzstunden und Nachtragen stehen weit unten – eine Antwort, die
            nur ganz oben erscheint, sieht dort aus wie „nichts passiert". */}
        {(fehler || hinweis) && (
          <div role="status" style={{
            position: 'fixed', left: '50%', transform: 'translateX(-50%)',
            bottom: 'calc(16px + env(safe-area-inset-bottom))', zIndex: 60,
            maxWidth: 'min(92vw, 560px)', padding: '11px 16px', borderRadius: 12,
            boxShadow: '0 10px 28px rgba(15,23,42,.22)', fontWeight: 600, fontSize: 14,
            background: fehler ? '#ffeaea' : '#127a5c',
            color: fehler ? F.warn : '#fff',
            border: fehler ? '1px solid #f5b5b5' : 0,
          }}>
            {fehler || hinweis}
          </div>
        )}
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
            <span style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button style={knopfKlein} disabled={exportLaeuft} onClick={() => void alleDatenExportieren()} title="Eigene Sicherheitskopie: alle Verträge und Zahlungen als JSON-Datei herunterladen">{exportLaeuft ? '… lädt' : '📥 Alle Daten (Verträge & Zahlungen)'}</button>
              <button style={knopfKlein} onClick={() => void vorlagenOeffnen()}>E-Mail-Texte ändern</button>
            </span>
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
                          {/* Token erst beim Klick holen – fest im Link wäre er
                              nach einer Stunde abgelaufen („Bitte einloggen"). */}
                          <button style={mini}
                            onClick={() => void oeffneMitSitzung(`/api/vertrag?vertrag=${z.vertragId}&art=bescheinigung`)
                              .catch((e) => setFehler(e instanceof Error ? e.message : 'Fehler.'))}>
                            Bescheinigung
                          </button>
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
          <details style={{ border: `1px solid ${F.line}`, borderRadius: 10, padding: '10px 14px', marginBottom: 14 }}>
            <summary style={{ cursor: 'pointer', fontWeight: 600, color: F.blue }}>➕ Gehaltene Stunde nachtragen</summary>
            <p style={{ color: F.soft, fontSize: 13, margin: '8px 0 10px' }}>
              Für Stunden, die schon stattgefunden haben, aber nie im Kalender standen
              (z. B. vor dem Vertragsbeginn). Sie wird wie üblich verrechnet – ohne
              offenes Guthaben oder Minus zählt sie als Plusstunde und steht danach
              hier zum Abrechnen. Die Familie bekommt dabei <b>keine</b> E-Mail.
            </p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              <select value={ntSid} onChange={(e) => setNtSid(e.target.value)} style={feld}>
                <option value="">Schüler/in wählen …</option>
                {alleSchueler.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <input type="date" value={ntDatum} max={new Date().toLocaleDateString('en-CA')}
                onChange={(e) => setNtDatum(e.target.value)} style={feld} />
              <input type="time" value={ntZeit} step={300}
                onChange={(e) => setNtZeit(e.target.value)} style={feld} />
              <select value={ntDauer} onChange={(e) => setNtDauer(Number(e.target.value))} style={feld}>
                {[30, 45, 60, 90, 120].map((d) => <option key={d} value={d}>{d} Min.</option>)}
              </select>
              <select value={ntMode} onChange={(e) => setNtMode(e.target.value as 'vor_ort' | 'online')} style={feld}>
                <option value="vor_ort">vor Ort</option>
                <option value="online">online</option>
              </select>
              <button style={{ ...knopf, ...(ntLaeuft ? { opacity: .6, cursor: 'wait' } : {}) }}
                disabled={ntLaeuft} onClick={() => void stundeNachtragen()}>
                {ntLaeuft ? '… trägt ein' : 'nachtragen'}
              </button>
            </div>
          </details>
          {vorvertrag.length > 0 && (
            <div style={{
              border: '1px solid rgba(217,154,54,.5)', background: 'rgba(217,154,54,.08)',
              borderRadius: 10, padding: '12px 14px', marginBottom: 14,
            }}>
              <b style={{ fontSize: 15 }}>Gehaltene Stunden vor Vertragsbeginn</b>
              <p style={{ color: F.soft, fontSize: 13, margin: '4px 0 8px' }}>
                Diese festen Termine fanden statt, bevor der Vertrag begann – sie stehen
                nicht in der Terminliste und würden sonst nie berechnet. Übernimm die
                Stunden, die wirklich stattgefunden haben, als Plusstunde; Termine ohne
                Unterricht lässt du einfach stehen.
              </p>
              {vorvertrag.map((t) => (
                <div key={`${t.schuelerId}-${t.datum}-${t.minuten}`}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, padding: '5px 0' }}>
                  <span style={{ fontSize: 14 }}>
                    <b>{t.name}</b> · {t.datum.slice(8, 10)}.{t.datum.slice(5, 7)}.{t.datum.slice(0, 4)},{' '}
                    {String(Math.floor(t.minuten / 60)).padStart(2, '0')}:{String(t.minuten % 60).padStart(2, '0')} Uhr
                  </span>
                  <button style={knopfKlein}
                    onClick={() => void tun(() => api('vorvertragAlsPlus', {
                      schueler_id: t.schuelerId, datum: t.datum, minuten: t.minuten,
                    }), 'Als Plusstunde übernommen.')}>
                    als Plusstunde übernehmen
                  </button>
                </div>
              ))}
            </div>
          )}
          {!plus.length && <p style={{ color: F.muted }}>Zurzeit sind keine Zusatzstunden offen.</p>}
          {plus.map((p) => (
            <div key={p.schuelerId} style={zeile}>
              <div>
                <b>{p.name}</b>
                {p.warnung && <span style={{ ...pille, background: 'rgba(217,154,54,.18)', color: '#8a6a20' }}>Zwischenabrechnung sinnvoll</span>}
                {p.stundensatzCent ? (
                  <div style={{ color: F.soft, fontSize: 14 }}>
                    {p.anzahl} Stunden × {eur(p.stundensatzCent)} = <b>{eur(p.summeCent)}</b>
                  </div>
                ) : (
                  // Ohne laufenden Vertrag kennt das System keinen Stundensatz –
                  // eine 0-€-Abrechnung an die Eltern wäre falsch, also klar
                  // sagen, was fehlt, statt eines einladenden blauen Knopfs.
                  <div style={{ color: '#8a6a20', fontSize: 14 }}>
                    {p.anzahl} {p.anzahl === 1 ? 'Stunde' : 'Stunden'} offen – <b>kein Stundensatz hinterlegt</b> (kein
                    laufender Vertrag). Zum Abrechnen zuerst einen Vertrag anlegen.
                  </div>
                )}
                <div style={{ color: F.muted, fontSize: 12 }}>
                  {p.termine.map((t) => `${t.slice(8, 10)}.${t.slice(5, 7)}.${t.slice(0, 4)}`).join(' · ')}
                </div>
              </div>
              <button style={{ ...knopf, ...(p.stundensatzCent ? {} : { background: F.line, color: F.muted, cursor: 'not-allowed' }) }}
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
                Platzhalter in geschweiften Klammern werden beim Versand ersetzt.
                Bei jedem Text steht darunter, welche es dort gibt – was nicht
                aufgeführt ist, bleibt als <code>{'{…}'}</code> in der E-Mail stehen.
              </p>
              {vorlagen.map((v, i) => (
                <div key={v.schluessel} style={{ borderTop: `1px solid ${F.line}`, paddingTop: 14, marginTop: 14 }}>
                  <b>{VORLAGEN_NAMEN[v.schluessel] || v.schluessel}</b>
                  <div style={{ color: F.muted, fontSize: 12.5, marginTop: 4 }}>
                    <code>{VORLAGEN_PLATZHALTER[v.schluessel] || VORLAGEN_PLATZHALTER.standard}</code>
                    {(v.schluessel === 'vertragEinladung' || v.schluessel === 'vertragErinnerung') && (
                      <span style={{ color: '#8a6a20' }}>
                        {' '}· <b>{'{link}'}</b> muss stehen bleiben – ohne ihn kommen die Eltern nicht zum Vertrag.
                      </span>
                    )}
                  </div>
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
