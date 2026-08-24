// =============================================================================
// Lillys Fall gegen den echten Server:
// Sie bucht HEUTE (24.08.) den festen Donnerstags-Termin, angeklickt ist die
// Zelle "Do 03.09., 17 Uhr". Danach darf der 27.08. sie NICHT zeigen, der
// 03.09. schon – und eine früher fälschlich erzeugte Klassenzimmer-Stunde
// am 27.08. muss die Synchronisation von selbst wieder abräumen.
// =============================================================================
import { starteFake } from './fake-supabase.mjs';

const APP = 'http://127.0.0.1:3918';

// Eine falsche, VOR dem Startdatum liegende Klassenzimmer-Stunde ist schon da
// (so wie bei Lilly in echt): Do 27.08., 17 Uhr Berlin = 15:00 UTC.
const falscheStunde = {
  id: 'l_falsch', teacher_id: 'u_admin', student_id: 'u_lilly',
  starts_at: '2026-08-27T15:00:00.000Z', ends_at: '2026-08-27T16:00:00.000Z',
  title: 'Nachhilfe', subject: null, kind: 'einzel', mode: 'vor_ort',
  daily_room_name: null, daily_room_url: null,
};

const { tabellen } = await starteFake({
  port: 3910,
  daten: {
    profiles: [
      { user_id: 'u_admin', name: 'Kleana Carciu', email: 'lernemitanna@outlook.com', role: 'admin', minus_hours: 0, plus_hours: 0, makeup_credits: 0 },
      { user_id: 'u_lilly', name: 'Lilly Metz', email: 'lilly@example.de', role: 'student', minus_hours: 0, plus_hours: 0, makeup_credits: 0 },
    ],
    fixed_slots: [], appointments: [], weekly_blocks: [], slot_mode_overrides: [],
    lessons: [falscheStunde], lesson_participants: [], vertraege: [], vertrag_zeiten: [], zahlungen: [],
  },
  benutzer: {
    'lilly-token': { id: 'u_lilly', email: 'lilly@example.de' },
    'admin-token': { id: 'u_admin', email: 'lernemitanna@outlook.com' },
  },
});

let ok = 0, weg = 0;
const pruef = (n, b, z = '') => { if (b) { ok++; console.log('  ok   ', n, z); } else { weg++; console.log('  FEHLT', n, z); } };
const api = async (body) => {
  const r = await fetch(APP + '/api/kalender', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  });
  return { status: r.status, ...(await r.json().catch(() => ({}))) };
};
const belegte = (d) => d.days.flatMap((t) => t.slots
  .filter((s) => s.state !== 'free' && s.state !== 'past' && s.state !== 'closed' && !s.cont)
  .map((s) => `${t.date} ${s.hour}h`));

// 1) Lilly bucht ihren festen Termin – angeklickte Zelle: Do 03.09., 17 Uhr
const buchung = await api({ action: 'requestFixed', token: 'lilly-token', date: '2026-09-03', hour: 17, dauerMin: 60, mode: 'vor_ort' });
pruef('Buchung angenommen', buchung.ok === true, buchung.error || buchung.message);
const slot = tabellen.fixed_slots[0];
pruef('der angeklickte Tag ist als Startdatum gespeichert', slot?.ab_datum === '2026-09-03',
  `ab_datum=${slot?.ab_datum}`);

// Kleana bestätigt (aktiv setzen wie approveFixed)
slot.status = 'aktiv';

// 2) Woche vom 24.08.: der 27.08. darf Lilly NICHT zeigen
const wocheJetzt = await api({ action: 'week', monday: '2026-08-24', token: 'lilly-token' });
pruef('27.08. bleibt frei', !belegte(wocheJetzt).some((x) => x.startsWith('2026-08-27')),
  belegte(wocheJetzt).join(', ') || 'nichts belegt');

// 3) Woche vom 31.08.: der 03.09. zeigt ihren Termin
const wocheStart = await api({ action: 'week', monday: '2026-08-31', token: 'lilly-token' });
pruef('03.09. zeigt den Termin', belegte(wocheStart).some((x) => x === '2026-09-03 17h'),
  belegte(wocheStart).join(', '));

// 4) Die falsche Stunde am 27.08. wurde von der Synchronisation abgeräumt
//    (sie lief nach den Woche-Abrufen)
await new Promise((r) => setTimeout(r, 2500));
const nochDa = (tabellen.lessons || []).some((l) => l.id === 'l_falsch');
pruef('falsche Klassenzimmer-Stunde am 27.08. automatisch entfernt', !nochDa);
const vorStart = (tabellen.lessons || []).filter((l) => l.starts_at < '2026-09-03');
pruef('keine Stunde vor dem 03.09. übrig', vorStart.length === 0,
  vorStart.map((l) => l.starts_at).join(', '));
const abStart = (tabellen.lessons || []).filter((l) => l.starts_at >= '2026-09-03');
pruef('ab dem 03.09. entstehen die Stunden normal', abStart.length >= 1,
  abStart.map((l) => l.starts_at.slice(0, 10)).join(', '));

// 5) Der 27.08., 17 Uhr ist wieder frei buchbar (z. B. für eine Zusatzstunde)
const extra = await api({ action: 'bookExtra', token: 'lilly-token', date: '2026-08-27', hour: 17, dauerMin: 60, mode: 'vor_ort' });
pruef('Zelle 27.08. 17 Uhr ist frei buchbar', extra.ok === true, extra.error || (extra.message || '').slice(0, 60));

console.log(`\n  ${ok} von ${ok + weg} Prüfungen bestanden`);
process.exit(weg ? 1 : 0);
