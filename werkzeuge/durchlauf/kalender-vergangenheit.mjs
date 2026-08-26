// =============================================================================
// Kleanas Test: Wochentermin Dienstag, HEUTE gebucht.
// Im Kalender darf nur der nächste Dienstag ab heute erscheinen –
// nichts aus Juli/August. Und in der Datenbank darf nichts Vergangenes
// entstehen, auch nicht durch die Stunden-Synchronisation.
// =============================================================================
import { starteFake } from './fake-supabase.mjs';

const APP = 'http://127.0.0.1:3917';
const heute = new Date().toLocaleDateString('en-CA', { timeZone: 'Europe/Berlin' });

const { tabellen } = await starteFake({
  port: 3910,
  daten: {
    profiles: [
      { user_id: 'u_admin', name: 'Kleana Carciu', email: 'lernemitanna@outlook.com', role: 'admin', minus_hours: 0, plus_hours: 0, makeup_credits: 0 },
      { user_id: 'u_lea', name: 'Lea Muster', email: 'eltern@example.de', role: 'student', minus_hours: 0, plus_hours: 0, makeup_credits: 0 },
    ],
    // Der feste Dienstags-Termin, HEUTE gebucht und bestätigt.
    fixed_slots: [{ id: 'fx1', student_id: 'u_lea', weekday: 1, hour: 16, status: 'aktiv', mode: 'online', dauer_min: 60, created_at: new Date().toISOString() }],
    appointments: [], weekly_blocks: [], slot_mode_overrides: [], lessons: [],
    lesson_participants: [], vertraege: [], vertrag_zeiten: [], zahlungen: [], schuljahre: [], unterrichtsfreie_tage: [],
  },
  benutzer: { 'lea-token': { id: 'u_lea', email: 'eltern@example.de' } },
});

let ok = 0, weg = 0;
const pruef = (n, b, z = '') => { if (b) { ok++; console.log('  ok   ', n, z); } else { weg++; console.log('  FEHLT', n, z); } };
const woche = async (monday) => {
  const r = await fetch(APP + '/api/kalender', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'week', monday, token: 'lea-token' }),
  });
  return r.json();
};
const belegte = (d) => d.days.flatMap((t) => t.slots.filter((s) => s.state !== 'free' && s.state !== 'past' && s.state !== 'closed' && !s.cont)
  .map((s) => `${t.date} ${s.hour}h ${s.state}`));

// 1) Vergangene Wochen (Juli / Anfang August): dort darf NICHTS stehen
for (const montag of ['2026-07-13', '2026-07-27', '2026-08-10']) {
  const d = await woche(montag);
  pruef(`Woche ab ${montag} ist leer`, belegte(d).length === 0, belegte(d).join(', '));
}

// 2) Aktuelle Woche: nur der Dienstag ab heute
const aktuell = await woche(heute); // heute ist Montag, 24.08.
const b = belegte(aktuell);
pruef('aktuelle Woche zeigt genau einen Termin', b.length === 1, b.join(', '));
pruef('und zwar den Dienstag 16 Uhr', b[0]?.includes('16h') && new Date(b[0].split(' ')[0]).getDay() === 2, b[0]);
pruef('als eigener Termin markiert', JSON.stringify(aktuell.days).includes('"mine":true'));

// 3) Zukünftige Woche: Dienstag weiterhin da
const zukunft = await woche('2026-09-14');
pruef('künftige Woche zeigt den Dienstag', belegte(zukunft).some((x) => x.includes('2026-09-15')));

// 4) Datenbank: die Synchronisation (lief nach den Abrufen) hat NICHTS
//    Vergangenes angelegt
await new Promise((r) => setTimeout(r, 2500));   // syncLessons läuft nach der Antwort
const lessons = tabellen.lessons || [];
const vergangene = lessons.filter((l) => String(l.starts_at) < new Date().toISOString());
pruef(`lessons: ${lessons.length} angelegt, alle in der Zukunft`, lessons.length > 0 && vergangene.length === 0,
  vergangene.map((l) => l.starts_at).join(', '));
pruef('appointments: weiterhin leer (nichts erfunden)', (tabellen.appointments || []).length === 0);

console.log(`\n  ${ok} von ${ok + weg} Prüfungen bestanden`);
process.exit(weg ? 1 : 0);
