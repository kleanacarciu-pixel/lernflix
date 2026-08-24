// =============================================================================
// Schritt 6: der komplette Durchlauf mit der Testfamilie
//
// Läuft gegen den ECHTEN Server (next start) mit einem Ersatz für Supabase
// und Resend. Alles dazwischen – Route, Regeln, PDF-Erzeugung, E-Mail-Versand
// mit Anhängen – ist der Code, der auch im Betrieb läuft.
// =============================================================================
import { writeFileSync } from 'node:fs';
import { chromium } from 'playwright';
import { starteFake } from './fake-supabase.mjs';

const D = new URL('.', import.meta.url).pathname;
const FAKE = 3910;
const APP = 'http://127.0.0.1:3911';

const BAYERN = [
  ['Tag der Deutschen Einheit', '2026-10-03', '2026-10-03', true],
  ['Herbstferien', '2026-11-02', '2026-11-06', false],
  ['Buß- und Bettag', '2026-11-18', '2026-11-18', true],
  ['Weihnachtsferien', '2026-12-24', '2027-01-08', false],
  ['Frühjahrsferien', '2027-02-08', '2027-02-12', false],
  ['Osterferien', '2027-03-22', '2027-04-02', false],
  ['Tag der Arbeit', '2027-05-01', '2027-05-01', true],
  ['Christi Himmelfahrt', '2027-05-06', '2027-05-06', true],
  ['Pfingstmontag', '2027-05-17', '2027-05-17', true],
  ['Pfingstferien', '2027-05-18', '2027-05-28', false],
].map(([bezeichnung, datum_von, datum_bis, ist_feiertag], i) => ({
  id: `frei_${i}`, schuljahr_id: 'sj1', schule_id: null, bezeichnung, datum_von, datum_bis, ist_feiertag,
}));

// Ein Ersatz fuer Kleanas hinterlegte Unterschrift – ein winziges,
// deckendes PNG. Es geht hier nur darum, DASS ein Bild eingebettet wird.
const unterschriftKleana = 'data:image/png;base64,'
  + 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';

const daten = {
  profiles: [
    { user_id: 'u_admin', name: 'Kleana Carciu', email: 'lernemitanna@outlook.com', role: 'admin', minus_hours: 0, plus_hours: 0, makeup_credits: 0 },
    { user_id: 'u_lea', name: 'Lea Muster', email: 'eltern@example.de', role: 'student', minus_hours: 0, plus_hours: 0, makeup_credits: 0 },
    { user_id: 'u_tim', name: 'Tim Papier', email: 'papier@example.de', role: 'student', minus_hours: 0, plus_hours: 0, makeup_credits: 0 },
  ],
  schuljahre: [{ id: 'sj1', name: '2026/27', erster_schultag: '2026-09-15', letzter_schultag: '2027-07-30', aktiv: true }],
  unterrichtsfreie_tage: BAYERN,
  schulen: [{ id: 'sch1', name: 'Gymnasium Nord' }],
  admin_einstellungen: [{ schluessel: 'unterschrift_anbieterin', wert: unterschriftKleana }],
  mahn_vorlagen: [
    { schluessel: 'vertragEinladung', betreff: 'Der Vertrag für {name} – bitte unterschreiben',
      text: 'Hallo,\n\nhier ist der Vertrag für {name} im Schuljahr {schuljahr}.\n\nFester Termin: {termin}\nTermine im Schuljahr: {anzahl}\nJahresbetrag: {jahresbetrag}\n\n• {raten} Monatsraten à {rate}\n• Einmalzahlung {einmal}\n\nHier geht es zum Vertrag:\n{link}\n\nLiebe Grüße\nAnna' },
    { schluessel: 'vertragErinnerung', betreff: 'Kurze Erinnerung: der Vertrag für {name}',
      text: 'Hallo,\n\nvor {tage} Tagen habe ich dir den Vertrag für {name} geschickt.\n\n{link}\n\nLiebe Grüße\nAnna' },
    { schluessel: 'vertragUnterschrieben', betreff: 'Vertrag unterschrieben – Schuljahr {schuljahr}',
      text: 'Hallo,\n\nvielen Dank – der Vertrag für {name} ist unterschrieben.\n\nFester Termin: {termin}\nJahresbetrag: {jahresbetrag}\nZahlweise: {zahlweise}\n\n{inhaber}\nIBAN: {iban}\nVerwendungszweck: {verwendungszweck}\n\nLiebe Grüße\nAnna' },
  ],
  vertraege: [], vertrag_zeiten: [], zahlungen: [], appointments: [], fixed_slots: [],
};

// Mit OHNE_VORLAGEN=1 startet die Datenbank ganz ohne E-Mail-Texte. Dann muss
// alles trotzdem laufen – die Texte stehen als Standard im Programm.
if (process.env.OHNE_VORLAGEN === '1') {
  daten.mahn_vorlagen = [];
  console.log('  (Datenbank ohne E-Mail-Vorlagen – es gelten die Standardtexte)');
}

const benutzer = {
  'admin-token': { id: 'u_admin', email: 'lernemitanna@outlook.com' },
  'lea-token': { id: 'u_lea', email: 'eltern@example.de' },
  'tim-token': { id: 'u_tim', email: 'papier@example.de' },
};

const { mails, tabellen } = await starteFake({ port: FAKE, daten, benutzer });

// --- kleine Helfer ---------------------------------------------------------
let punkte = 0, fehler = 0;
const pruef = (name, bedingung, zusatz = '') => {
  if (bedingung) { punkte++; console.log(`  ok    ${name}${zusatz ? ' – ' + zusatz : ''}`); }
  else { fehler++; console.log(`  FEHLT ${name}${zusatz ? ' – ' + zusatz : ''}`); }
};
const api = async (pfad, body) => {
  const r = await fetch(APP + pfad, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  });
  return { status: r.status, ...(await r.json().catch(() => ({}))) };
};

// PDF-Text lesen (wie in tests/vertrag-pdf.test.ts)
import { inflateSync } from 'node:zlib';
const WINANSI = { 0x80: '€', 0x84: '„', 0x91: '‘', 0x92: '’', 0x93: '“', 0x94: '”', 0x96: '–', 0x97: '—' };
function pdfStrom(buf) {
  let strom = '', i = 0;
  while ((i = buf.indexOf('stream', i)) >= 0) {
    let s = i + 6; if (buf[s] === 13) s++; if (buf[s] === 10) s++;
    const e = buf.indexOf('endstream', s); if (e < 0) break;
    try { strom += inflateSync(buf.subarray(s, e)).toString('latin1') + '\n'; } catch { /* Bild */ }
    i = e + 9;
  }
  return strom;
}

function pdfText(buf) {
  const strom = pdfStrom(buf);
  let out = '';
  for (const m of strom.matchAll(/\[([\s\S]*?)\]\s*TJ/g)) {
    for (const h of m[1].matchAll(/<([0-9A-Fa-f]*)>/g)) {
      for (const b of Buffer.from(h[1], 'hex')) out += WINANSI[b] ?? Buffer.from([b]).toString('latin1');
    }
    out += ' ';
  }
  return out;
}

const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const ctx = await b.newContext({ viewport: { width: 420, height: 900 }, hasTouch: true });
await ctx.addInitScript(() => localStorage.setItem('lma_kal_session',
  JSON.stringify({ token: 'admin-token', refresh: 'r', role: 'admin', name: 'Kleana' })));

// =============================================================================
console.log('\nTEST 5 – Durchlauf mit der Testfamilie (Dienstag, 45 €)');
// =============================================================================
const p = await ctx.newPage();
p.on('pageerror', (e) => console.log('  [pageerror]', String(e).slice(0, 200)));
// Die Seite fragt vor dem Anlegen sicherheitshalber nach – hier bestätigen.
p.on('dialog', (d) => d.accept());
await p.goto(APP + '/vertraege', { waitUntil: 'networkidle' });
await p.waitForTimeout(600);

await p.selectOption('select >> nth=0', 'u_lea');
await p.fill('input[type="date"]', '2026-09-15');
await p.fill('input[type="time"]', '16:00');
await p.waitForTimeout(1500);
const vorschauText = await p.locator('body').innerText();
pruef('Vorschau: 38 Termine', /38\s*Termine|Termine\s*38/.test(vorschauText.replace(/\n/g, ' ')),
  (vorschauText.match(/(\d+) Termine/) || [])[0]);
pruef('Vorschau: Jahresbetrag 1.710,00 €', vorschauText.includes('1.710,00'));
pruef('Vorschau: Rate 155,45 €', vorschauText.includes('155,45'));

await p.locator('button:has-text("Vertrag anlegen")').click();
await p.waitForTimeout(1800);
const nachAnlegen = await p.locator('body').innerText();
pruef('Vertrag angelegt und verschickt', tabellen.vertraege.length === 1,
  (nachAnlegen.split('\n').find((z) => /verschickt|angelegt/i.test(z)) || '').slice(0, 80));

const einladung = mails.find((m) => /bitte unterschreiben/i.test(m.subject || ''));
pruef('Einladungs-E-Mail ging an die Familie', !!einladung && einladung.to === 'eltern@example.de');
pruef('Einladung OHNE Kopie an Kleana', !!einladung && !einladung.bcc);
const link = (einladung?.html || '').match(/href="([^"]*\/vertrag\/[^"]+)"/)?.[1];
pruef('Einladung enthält einen anklickbaren Link', !!link, link ? link.slice(0, 52) + '…' : '');
const einladungsAnhaenge = (einladung?.attachments || []).map((a) => a.filename);
pruef('Einladung bringt den fertigen Vertrag gleich mit', einladungsAnhaenge.length === 3,
  einladungsAnhaenge.join(', '));
pruef('darunter Vertrag, Terminliste und AGB',
  ['Nachhilfevertrag', 'Terminliste', 'AGB'].every((n) => einladungsAnhaenge.some((d) => d.includes(n))));
pruef('die AGB im Anhang enthalten Anlage 1 und 2', (() => {
  const agb = (einladung?.attachments || []).find((a) => a.filename.includes('AGB'));
  if (!agb) return false;
  const t = pdfText(Buffer.from(agb.content, 'base64'));
  return t.includes('Anlage 1: Widerrufsbelehrung') && t.includes('Hiermit widerrufe(n) ich/wir');
})());
const adminInfo = mails.find((m) => /Vertrag verschickt:/.test(m.subject || ''));
pruef('Kleana bekommt eine eigene Nachricht ohne Link',
  !!adminInfo && !(adminInfo.html || '').includes('/vertrag/'));

// =============================================================================
console.log('\nTEST 2a – vor der Unterschrift kann das Elternkonto nichts buchen');
// =============================================================================
const vorher = await api('/api/kalender', {
  action: 'bookExtra', token: 'lea-token', date: '2026-09-22', hour: 16, dauerMin: 60, mode: 'online',
});
pruef('Buchung wird abgewiesen', vorher.status === 403, `HTTP ${vorher.status}: ${vorher.error}`);
pruef('Die Meldung nennt die Unterschrift', /unterschreib/i.test(vorher.error || ''));

// =============================================================================
console.log('\nTEST 1 – ohne beide Häkchen ist keine Unterzeichnung möglich');
// =============================================================================
const seite = await ctx.newPage();
seite.on('pageerror', (e) => console.log('  [pageerror]', String(e).slice(0, 200)));
await seite.goto(link, { waitUntil: 'networkidle' });
await seite.waitForTimeout(700);
const knopf = seite.locator('button:has-text("verbindlich unterschreiben")');
pruef('Knopf ist ohne Häkchen gesperrt', await knopf.isDisabled());
await seite.locator('input[type=checkbox]').nth(0).check();
pruef('mit nur einem Häkchen weiterhin gesperrt', await knopf.isDisabled());

// Am Server vorbei probieren – das Formular ist nicht die Sicherung
const ohneHaken = await api('/api/vertrag', {
  action: 'unterzeichnen', vertragToken: link.split('/vertrag/')[1],
  agb: true, widerruf: false, zahlweise: 'raten',
  unterschrift: 'data:image/png;base64,' + 'A'.repeat(2000),
});
pruef('auch direkt am Server abgewiesen', ohneHaken.status === 400, ohneHaken.error);

await seite.locator('input[type=checkbox]').nth(1).check();
pruef('mit beiden Häkchen, aber ohne Angaben gesperrt', await knopf.isDisabled());

// --- die Eltern tragen ihre Angaben selbst ein ---
const felder = seite.locator('section input[type=text], section input[type=email], section input[type=tel]');
await felder.nth(0).fill('Maria Muster');
await felder.nth(1).fill('Beispielweg 3, 80331 München');
await felder.nth(2).fill('maria@example.de');
await felder.nth(3).fill('0176 1234567');
await seite.waitForTimeout(300);
pruef('ohne Unterschrift weiterhin gesperrt', await knopf.isDisabled());

// =============================================================================
console.log('\nTEST 5 (Fortsetzung) – Unterschrift auf der Zeichenfläche');
// =============================================================================
const c = seite.locator('canvas');
// Erst ins Bild rollen: die Zeichenflaeche liegt weit unten, und die
// Mauskoordinaten gelten relativ zum sichtbaren Ausschnitt.
await c.scrollIntoViewIfNeeded();
await seite.waitForTimeout(200);
const box = await c.boundingBox();
await seite.mouse.move(box.x + 40, box.y + 110);
await seite.mouse.down();
for (let i = 0; i < 60; i++) {
  await seite.mouse.move(box.x + 40 + i * 4.5, box.y + 110 - Math.sin(i / 3) * 42 - (i % 7) * 2);
}
await seite.mouse.up();
await seite.waitForTimeout(300);
pruef('nach dem Unterschreiben ist der Knopf frei', !(await knopf.isDisabled()));
await knopf.click();
await seite.waitForTimeout(2500);
const danach = await seite.locator('body').innerText();
pruef('Dankeseite erscheint', /Vertrag unterschrieben/.test(danach));

const vertrag = tabellen.vertraege[0];
pruef('Vertrag steht auf aktiv', vertrag.status === 'aktiv', `status=${vertrag.status}`);
pruef('Unterschrift und Zeitstempel gespeichert',
  !!vertrag.unterzeichnet_am && !!vertrag.eltern_unterschrift && !!vertrag.agb_bestaetigt_am && !!vertrag.widerruf_bestaetigt_am);
pruef('Zahlungsplan angelegt', tabellen.zahlungen.length === 11, `${tabellen.zahlungen.length} Raten`);

// =============================================================================
console.log('\nTEST 4 – die Bestätigungs-E-Mail hat alle drei Anhänge');
// =============================================================================
const bestaetigung = mails.find((m) => /unterschrieben – Schuljahr/.test(m.subject || ''));
pruef('Bestätigungs-E-Mail verschickt', !!bestaetigung, bestaetigung?.subject);
const namen = (bestaetigung?.attachments || []).map((a) => a.filename);
pruef('drei Anhänge', namen.length === 3, namen.join(', '));
pruef('Vertrag, Terminliste und AGB dabei',
  namen.some((n) => /Nachhilfevertrag/.test(n)) && namen.some((n) => /Terminliste/.test(n)) && namen.some((n) => /AGB/.test(n)));
pruef('alle drei sind echte PDF-Dateien',
  (bestaetigung?.attachments || []).every((a) => Buffer.from(a.content, 'base64').subarray(0, 5).toString() === '%PDF-'));
pruef('Kleana bekommt die Bestätigung in Kopie', bestaetigung?.bcc === 'lernemitanna@outlook.com');

// =============================================================================
console.log('\nTEST 3 – die finale PDF');
// =============================================================================
const pdfAntwort = await fetch(`${APP}/api/vertrag?pdf=${link.split('/vertrag/')[1]}&art=vertrag`);
const pdf = Buffer.from(await pdfAntwort.arrayBuffer());
writeFileSync(D + 'durchlauf-vertrag.pdf', pdf);
const txt = pdfText(pdf);
const seiten = [...pdf.toString('latin1').matchAll(/\/Type\s*\/Page[^s]/g)].length;
pruef('genau eine Seite', seiten === 1, `${seiten} Seite(n)`);
for (const [was, stueck] of [
  ['Name der Eltern', 'Maria Muster'],
  ['Anschrift der Eltern', 'Beispielweg 3, 80331 München'],
  ['E-Mail/Telefon der Eltern', 'maria@example.de'],
  ['Kind', 'Lea Muster'], ['Wochentermin', 'Dienstag 16:00 Uhr'], ['Terminzahl', '38'],
  ['Stundensatz', '45,00 €'], ['Jahresbetrag', '1.710,00 €'], ['Rate', '155,45 €'],
  ['Titel', 'Nachhilfevertrag'], ['Fußzeile', 'lernemitanna.de'],
]) pruef(`PDF enthält ${was}`, txt.includes(stueck), stueck);
pruef('gewählte Zahlweise hervorgehoben (Raten)', /11 Monatsraten à 155,45 €/.test(txt));
pruef('beide Bestätigungen mit Zeitstempel', (txt.match(/bestätigt am/g) || []).length === 2);
// Gezählt wird, wie oft ein Bild GEZEICHNET wird ("Do"). Die Zahl der
// Bildobjekte taugt nicht: ein PNG mit Durchsichtigkeit bringt zusätzlich
// seine Maske mit, ein deckendes nicht.
const gezeichnet = [...pdfStrom(pdf).matchAll(/\/[A-Za-z0-9]+ Do/g)].length;
pruef('beide Unterschriften im Dokument gezeichnet', gezeichnet === 2, `${gezeichnet} Bilder gezeichnet`);

// =============================================================================
console.log('\nTEST 2b – nach der Unterschrift ist Buchen möglich');
// =============================================================================
const nachher = await api('/api/kalender', {
  action: 'bookExtra', token: 'lea-token', date: '2026-09-22', hour: 16, dauerMin: 60, mode: 'online',
});
pruef('Buchung wird angenommen', nachher.status === 200 && nachher.ok === true,
  nachher.error || nachher.message);

// =============================================================================
console.log('\nTEST 6 – Rückfall: extern unterschriebene Fassung');
// =============================================================================
await p.reload({ waitUntil: 'networkidle' });
await p.waitForTimeout(800);
await p.selectOption('select >> nth=0', 'u_tim');
await p.fill('input[type="date"]', '2026-09-15');
await p.waitForTimeout(1500);
await p.locator('button:has-text("Vertrag anlegen")').click();
await p.waitForTimeout(1800);

const tim = tabellen.vertraege.find((v) => v.schueler_id === 'u_tim');
pruef('zweiter Vertrag angelegt', !!tim);
await p.reload({ waitUntil: 'networkidle' });
await p.waitForTimeout(900);
const listeVorher = await p.locator('body').innerText();
pruef('Übersicht zeigt „wartet auf Unterschrift"', /wartet auf Unterschrift/.test(listeVorher));
pruef('Übersicht zeigt „unterschrieben" für Lea', /im Portal unterschrieben am/.test(listeVorher));

await p.locator('button:has-text("auf Papier unterschrieben")').first().click();
await p.waitForTimeout(400);
await p.setInputFiles('#externe-datei', {
  name: 'unterschrieben.pdf', mimeType: 'application/pdf',
  buffer: Buffer.from('%PDF-1.4\n% Testfassung mit Unterschrift\n'),
});
await p.waitForTimeout(1800);
const timDanach = tabellen.vertraege.find((v) => v.schueler_id === 'u_tim');
pruef('Vertrag von Hand freigeschaltet', !!timDanach.manuell_aktiviert_am && timDanach.status === 'aktiv');
pruef('hochgeladene Fassung gespeichert', String(timDanach.externe_unterschrift || '').startsWith('data:application/pdf'));
const listeNachher = await p.locator('body').innerText();
pruef('Übersicht zeigt „auf Papier unterschrieben"', /auf Papier unterschrieben, von dir freigeschaltet/.test(listeNachher));
await p.screenshot({ path: D + 'durchlauf-uebersicht.png', fullPage: false });

const externAntwort = await fetch(`${APP}/api/vertrag?sitzung=admin-token&vertrag=${timDanach.id}&art=extern`);
pruef('hochgeladene Fassung wieder abrufbar',
  externAntwort.status === 200 && externAntwort.headers.get('content-type') === 'application/pdf');

const nachherTim = await api('/api/kalender', {
  action: 'bookExtra', token: 'tim-token', date: '2026-09-29', hour: 17, dauerMin: 60, mode: 'online',
});
pruef('auch dieses Konto darf jetzt buchen', nachherTim.status === 200, nachherTim.error || '');

// =============================================================================
console.log('\nZUSATZ – die Erinnerung nach fünf Tagen');
// =============================================================================
tabellen.vertraege.find((v) => v.schueler_id === 'u_tim').manuell_aktiviert_am = null;
tabellen.vertraege.find((v) => v.schueler_id === 'u_tim').status = 'angeboten';
tabellen.vertraege.find((v) => v.schueler_id === 'u_tim').eingeladen_am = '2026-08-18T09:00:00Z';
const vorLauf = mails.length;
const lauf = await fetch(`${APP}/api/cron/mahnlauf?datum=2026-08-23`, {
  headers: { authorization: `Bearer ${process.env.CRON_SECRET || 'test-secret'}` },
});
const lauferg = await lauf.json().catch(() => ({}));
pruef('täglicher Lauf antwortet', lauf.status === 200, JSON.stringify(lauferg.unterschriften || {}));
const erinnerung = mails.slice(vorLauf).find((m) => /Kurze Erinnerung/.test(m.subject || ''));
pruef('Erinnerung verschickt', !!erinnerung, erinnerung?.subject);
pruef('Erinnerung OHNE Kopie an Kleana', !!erinnerung && !erinnerung.bcc);
pruef('Erinnerung enthält einen Link', /href="[^"]*\/vertrag\//.test(erinnerung?.html || ''));
pruef('Erinnerung wird vermerkt', !!tabellen.vertraege.find((v) => v.schueler_id === 'u_tim').erinnert_am);

const vorZweitem = mails.length;
await fetch(`${APP}/api/cron/mahnlauf?datum=2026-08-24`, {
  headers: { authorization: `Bearer ${process.env.CRON_SECRET || 'test-secret'}` },
});
pruef('am nächsten Tag kommt KEINE zweite Erinnerung',
  !mails.slice(vorZweitem).some((m) => /Kurze Erinnerung/.test(m.subject || '')));

console.log(`\n=====  ${punkte} von ${punkte + fehler} Prüfungen bestanden  =====\n`);
await b.close();
process.exit(fehler ? 1 : 0);
