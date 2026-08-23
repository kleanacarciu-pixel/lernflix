'use client';
// =============================================================================
// Anmeldehinweis für die Admin-Seiten
//
// Wird von /schuljahr, /vertraege und /zahlungen benutzt. Alle drei nutzen
// dieselbe Anmeldung wie der Kalender.
//
// Warum es zwei Texte gibt: Wenn die Sitzung ABGELAUFEN ist, sah man vorher
// die leeren Formulare und den Satz „Noch kein Schuljahr angelegt". Das liest
// sich, als wären die eigenen Daten verschwunden. Deshalb steht in diesem Fall
// ausdrücklich da, dass nichts verloren ist.
// =============================================================================

const BLAU = '#1769FF';
const GRAU = '#475569';

export default function Anmeldehinweis({ abgelaufen }: { abgelaufen?: boolean }) {
  return (
    <>
      <p style={{ color: GRAU, margin: '6px 0 0' }}>
        {abgelaufen
          ? 'Deine Anmeldung ist abgelaufen. Es ist nichts verloren gegangen – nach dem erneuten Einloggen ist alles wieder da.'
          : 'Diese Seite nutzt dieselbe Anmeldung wie der Kalender.'}
      </p>
      <p style={{ margin: '16px 0 0' }}>
        <a
          href="/kalender"
          style={{
            font: 'inherit', fontWeight: 600, padding: '10px 20px', textDecoration: 'none',
            borderRadius: 9, background: BLAU, color: '#fff', display: 'inline-block',
          }}
        >
          Zum Kalender und einloggen
        </a>
      </p>
    </>
  );
}
