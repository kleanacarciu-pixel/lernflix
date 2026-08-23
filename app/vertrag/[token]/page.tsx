'use client';
// =============================================================================
// Vertragsseite im Portal – hier unterschreiben die Eltern
//
// Geöffnet wird sie über den Link aus der E-Mail (14 Tage gültig) oder über
// die Terminliste, wenn die Familie ohnehin angemeldet ist. Beide Wege führen
// auf denselben Token.
//
// Unterschrieben wird auf einer Zeichenfläche – mit dem Finger am Handy oder
// mit der Maus am Rechner. Erst wenn beide Häkchen gesetzt sind UND etwas
// gezeichnet wurde, lässt sich der Vertrag abschicken.
// =============================================================================
import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';

const WOCHENTAGE = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];

const F = {
  ink: '#0F172A', soft: '#475569', muted: '#94A3B8', line: '#E2E8F0',
  teal: '#2BB3C0', gold: '#C9A96A', bg: '#fffdf8', weiss: '#fff',
  warn: '#a12a2a', gut: '#127a5c',
};

type Posten = {
  wochentag: number; anzahl: number; satzCent: number; summeCent: number;
  ermaessigt: boolean; von: string; bis: string;
};
type Rate = { monat: string; betragCent: number };
type Bestaetigung = { id: string; text: string; link?: string; linkText?: string };
type Daten = {
  schuelerName: string; schuljahr: string; zeitText: string;
  termine: string[]; posten: Posten[];
  stundensatzCent: number; jahresbetragCent: number;
  raten: Rate[]; einmalCent: number;
  schonUnterschrieben: boolean; unterzeichnetAm: string | null;
  anbieter: string; anbieterinHatUnterschrieben: boolean;
  eltern: { name: string; anschrift: string; email: string; telefon: string };
  kind: { name: string; schule: string | null };
  bestaetigungen: Bestaetigung[];
  bank: { inhaber: string; iban: string; bank: string };
};

const eur = (c: number) => (c / 100).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
const datumDe = (iso: string) => { const [j, m, t] = iso.split('-'); return `${t}.${m}.${j}`; };
const monatName = (iso: string) => {
  const [j, m] = iso.split('-');
  return `${['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'][Number(m) - 1]} ${j}`;
};

export default function VertragUnterschreiben() {
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
  const [gezeichnet, setGezeichnet] = useState(false);

  const leinwand = useRef<HTMLCanvasElement>(null);
  const zeichnet = useRef(false);

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
        if (d.schonUnterschrieben) setFertig(true);
      } catch (e) {
        setFehler(e instanceof Error ? e.message : 'Fehler beim Laden.');
      } finally { setLaden(false); }
    })();
  }, [api]);

  // --- Zeichenfläche ---------------------------------------------------------
  //
  // Die Fläche wird in Gerätepunkten aufgezogen, damit die Unterschrift auf
  // dem Handy nicht verwaschen aussieht. Gezeichnet wird mit Pointer-Events:
  // Finger, Stift und Maus laufen damit über denselben Weg.
  const flaecheVorbereiten = useCallback(() => {
    const c = leinwand.current;
    if (!c) return;
    const breite = c.clientWidth || 520;
    const hoehe = c.clientHeight || 170;
    const skala = Math.min(window.devicePixelRatio || 1, 3);
    if (c.width === Math.round(breite * skala) && c.height === Math.round(hoehe * skala)) return;
    c.width = Math.round(breite * skala);
    c.height = Math.round(hoehe * skala);
    const ctx = c.getContext('2d');
    if (!ctx) return;
    ctx.scale(skala, skala);
    ctx.lineWidth = 2.4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#1a2a4a';   // dunkles Tintenblau
    // Beim Ändern der Größe leert der Browser die Fläche. Dann darf auch der
    // Knopf nicht mehr freigegeben sein – sonst ginge eine leere Datei raus.
    setGezeichnet(false);
  }, []);

  useEffect(() => {
    if (!daten || fertig) return;
    flaecheVorbereiten();
    window.addEventListener('resize', flaecheVorbereiten);
    return () => window.removeEventListener('resize', flaecheVorbereiten);
  }, [daten, fertig, flaecheVorbereiten]);

  function punkt(e: React.PointerEvent<HTMLCanvasElement>) {
    const c = leinwand.current!;
    const r = c.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  function beginnen(e: React.PointerEvent<HTMLCanvasElement>) {
    const ctx = leinwand.current?.getContext('2d');
    if (!ctx) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    zeichnet.current = true;
    const p = punkt(e);
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    // Ein einzelner Tipp soll auch schon einen Punkt hinterlassen.
    ctx.lineTo(p.x + 0.1, p.y);
    ctx.stroke();
    setGezeichnet(true);
  }

  function ziehen(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!zeichnet.current) return;
    const ctx = leinwand.current?.getContext('2d');
    if (!ctx) return;
    const p = punkt(e);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
  }

  function beenden() { zeichnet.current = false; }

  function leeren() {
    const c = leinwand.current;
    const ctx = c?.getContext('2d');
    if (!c || !ctx) return;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.restore();
    setGezeichnet(false);
  }

  const alleGehakt = !!daten && daten.bestaetigungen.every((b) => haken[b.id]);
  const bereit = alleGehakt && gezeichnet && !sendet;

  async function unterschreiben() {
    if (!bereit) return;
    const c = leinwand.current;
    if (!c) return;
    setSendet(true); setFehler('');
    try {
      await api('unterzeichnen', {
        zahlweise, agb: true, widerruf: true,
        unterschrift: c.toDataURL('image/png'),
      });
      setFertig(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      setFehler(e instanceof Error ? e.message : 'Fehler.');
    } finally { setSendet(false); }
  }

  // --- Anzeige ---------------------------------------------------------------

  if (laden) return <Huelle><p style={{ color: F.muted }}>Wird geladen …</p></Huelle>;

  if (fehler && !daten) return (
    <Huelle>
      <h1 style={h1}>Nachhilfevertrag</h1>
      <div style={{ ...box, borderColor: '#f5b5b5', background: '#ffeaea', color: F.warn }}>{fehler}</div>
      <p style={{ color: F.soft }}>Melde dich einfach kurz bei Anna, dann bekommst du einen neuen Link.</p>
    </Huelle>
  );

  if (!daten) return null;

  if (fertig) return (
    <Huelle>
      <div style={{ textAlign: 'center', padding: '20px 0' }}>
        <div style={{ fontSize: 44 }}>✓</div>
        <h1 style={{ ...h1, marginTop: 8 }}>Vertrag unterschrieben</h1>
        <p style={{ color: F.soft, maxWidth: 480, margin: '0 auto 22px' }}>
          Danke! Der Vertrag ist geschlossen und der Unterricht freigeschaltet.
          Du bekommst gleich eine E-Mail mit dem unterschriebenen Vertrag, der
          Terminliste für das ganze Schuljahr und den AGB.
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a style={knopfHell} href={`/api/vertrag?pdf=${token}&art=vertrag`} target="_blank" rel="noopener">Vertrag (PDF)</a>
          <a style={knopfHell} href={`/api/vertrag?pdf=${token}&art=terminliste`} target="_blank" rel="noopener">Terminliste (PDF)</a>
          <a style={knopfHell} href={`/api/vertrag?pdf=${token}&art=agb`} target="_blank" rel="noopener">AGB (PDF)</a>
        </div>
        {daten.unterzeichnetAm && (
          <p style={{ color: F.muted, fontSize: 13, marginTop: 18 }}>
            Unterschrieben am {datumDe(daten.unterzeichnetAm.slice(0, 10))}.
          </p>
        )}
        <p style={{ marginTop: 22 }}>
          <a href="/kalender" style={{ color: F.teal, fontWeight: 600 }}>Zum Kalender →</a>
        </p>
      </div>
    </Huelle>
  );

  const sichtbareTermine = alleTermine ? daten.termine : daten.termine.slice(0, 12);

  return (
    <Huelle>
      <p style={{ color: F.teal, fontWeight: 700, fontSize: 13, letterSpacing: '.04em', margin: 0 }}>LERNE MIT ANNA</p>
      <h1 style={h1}>Nachhilfevertrag {daten.schuljahr}</h1>
      <p style={{ color: F.soft, marginTop: 0 }}>für {daten.schuelerName}</p>

      {fehler && <div style={{ ...box, borderColor: '#f5b5b5', background: '#ffeaea', color: F.warn }}>{fehler}</div>}

      {/* Vertragsparteien */}
      <section style={karte}>
        <h2 style={h2}>Vertragspartner</h2>
        <Feld titel="Anbieterin" wert={daten.anbieter} />
        <Feld titel="Erziehungsberechtigte(r)" wert={daten.eltern.name || '— noch nicht hinterlegt —'} />
        {daten.eltern.anschrift && <Feld titel="Anschrift" wert={daten.eltern.anschrift} />}
        {(daten.eltern.email || daten.eltern.telefon) && (
          <Feld titel="E-Mail / Telefon" wert={[daten.eltern.email, daten.eltern.telefon].filter(Boolean).join(' · ')} />
        )}
        <Feld titel="Kind / Schule" wert={[daten.kind.name, daten.kind.schule].filter(Boolean).join(' · ')} />
        <p style={{ color: F.muted, fontSize: 13, margin: '10px 0 0' }}>
          Stimmt etwas nicht? Schreib kurz an{' '}
          <a href="mailto:lernemitanna@outlook.com" style={{ color: F.teal }}>lernemitanna@outlook.com</a>,
          dann ändere ich es vor der Unterschrift.
        </p>
      </section>

      {/* Termin und Betrag */}
      <section style={karte}>
        <h2 style={h2}>Unterricht</h2>
        <p style={{ fontSize: 18, fontWeight: 700, margin: '0 0 4px' }}>{daten.zeitText}</p>
        <p style={{ color: F.soft, margin: 0 }}>
          {daten.termine.length} Termine im Schuljahr · 60 Minuten je Termin
        </p>
        <p style={{ color: F.muted, fontSize: 13, marginTop: 8 }}>
          Ferien und gesetzliche Feiertage sind unterrichtsfrei und weder in der
          Terminzahl noch im Betrag enthalten.
        </p>

        <div style={{ marginTop: 18, paddingTop: 16, borderTop: `1px solid ${F.line}` }}>
          {daten.posten.map((p) => (
            <Zeile key={`${p.wochentag}-${p.von}`}
              links={`${WOCHENTAGE[p.wochentag]}: ${p.anzahl} × ${eur(p.satzCent)}${p.ermaessigt ? ' (Familienpreis)' : ''}`}
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
          text="50,00 € Nachlass. Fällig innerhalb von 14 Tagen nach der Unterschrift." />

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
        <p style={{ color: F.muted, fontSize: 13, marginTop: 12 }}>
          Überweisung an {daten.bank.inhaber} · {daten.bank.iban}<br />
          Verwendungszweck: Nachhilfe {daten.schuelerName} {daten.schuljahr}
        </p>
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
      </section>

      {/* Unterlagen */}
      <section style={karte}>
        <h2 style={h2}>Unterlagen</h2>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <a style={knopfHell} href={`/api/vertrag?pdf=${token}&art=vertrag`} target="_blank" rel="noopener">Vertrag lesen (PDF)</a>
          <a style={knopfHell} href={`/api/vertrag?pdf=${token}&art=agb`} target="_blank" rel="noopener">AGB (PDF)</a>
          <a style={knopfHell} href={`/api/vertrag?pdf=${token}&art=widerruf`} target="_blank" rel="noopener">Widerrufsbelehrung (PDF)</a>
          <a style={knopfHell} href={`/api/vertrag?pdf=${token}&art=terminliste`} target="_blank" rel="noopener">Terminliste (PDF)</a>
        </div>
      </section>

      {/* Pflicht-Häkchen */}
      <section style={karte}>
        <h2 style={h2}>Bestätigung</h2>
        {daten.bestaetigungen.map((b) => (
          <label key={b.id} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 14, cursor: 'pointer' }}>
            <input type="checkbox" checked={!!haken[b.id]} style={{ marginTop: 4, width: 18, height: 18, flexShrink: 0 }}
              onChange={(e) => setHaken((s) => ({ ...s, [b.id]: e.target.checked }))} />
            <span style={{ fontSize: 14.5, lineHeight: 1.6, color: F.ink }}>
              {b.text}{' '}
              {b.link && (
                <a href={b.link} target="_blank" rel="noopener" style={{ color: F.teal, fontWeight: 600 }}>
                  ({b.linkText})
                </a>
              )}
            </span>
          </label>
        ))}
      </section>

      {/* Unterschrift */}
      <section style={karte}>
        <h2 style={h2}>Deine Unterschrift</h2>
        <p style={{ color: F.soft, marginTop: 0, fontSize: 14.5 }}>
          Unterschreibe im Feld – am Handy mit dem Finger, am Rechner mit der Maus.
        </p>

        <div style={{
          border: `2px dashed ${gezeichnet ? F.teal : F.line}`, borderRadius: 12,
          background: F.weiss, position: 'relative', marginTop: 6,
        }}>
          <canvas
            ref={leinwand}
            onPointerDown={beginnen} onPointerMove={ziehen}
            onPointerUp={beenden} onPointerLeave={beenden} onPointerCancel={beenden}
            style={{ width: '100%', height: 170, display: 'block', touchAction: 'none', cursor: 'crosshair' }} />
          {!gezeichnet && (
            <span style={{
              position: 'absolute', left: 0, right: 0, top: '50%', transform: 'translateY(-50%)',
              textAlign: 'center', color: F.muted, fontSize: 14, pointerEvents: 'none',
            }}>
              hier unterschreiben
            </span>
          )}
          <div style={{
            position: 'absolute', left: 16, right: 16, bottom: 26,
            borderBottom: `1px solid ${F.line}`, pointerEvents: 'none',
          }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, gap: 10, flexWrap: 'wrap' }}>
          <button style={knopfHell} onClick={leeren}>noch einmal</button>
          <span style={{ color: F.muted, fontSize: 13 }}>
            {daten.anbieterinHatUnterschrieben
              ? 'Anna hat bereits unterschrieben.'
              : 'Annas Unterschrift wird ergänzt.'}
          </span>
        </div>

        <button onClick={unterschreiben} disabled={!bereit}
          style={{
            ...knopf, width: '100%', marginTop: 18,
            opacity: bereit ? 1 : 0.45, cursor: bereit ? 'pointer' : 'not-allowed',
          }}>
          {sendet ? 'Wird gesendet …' : 'Vertrag verbindlich unterschreiben'}
        </button>
        {!bereit && !sendet && (
          <p style={{ color: F.muted, fontSize: 13, textAlign: 'center', marginTop: 10 }}>
            {!alleGehakt ? 'Bitte bestätige beide Punkte.' : 'Bitte unterschreibe im Feld.'}
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

function Feld({ titel, wert }: { titel: string; wert: string }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ color: F.teal, fontSize: 12.5, fontWeight: 600 }}>{titel}</div>
      <div style={{ fontSize: 15 }}>{wert}</div>
    </div>
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
