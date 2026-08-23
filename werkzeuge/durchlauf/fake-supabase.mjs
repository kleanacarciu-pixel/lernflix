// =============================================================================
// Kleiner Ersatz für Supabase + Resend, damit der echte Server ohne echte
// Datenbank laufen kann. Er spricht so viel PostgREST, wie das System nutzt:
// select mit eq/in/is/not, single/maybeSingle, insert, upsert, patch.
//
// Nur für den Testlauf – nichts davon geht ins Projekt.
// =============================================================================
import { createServer } from 'node:http';

export function starteFake({ port, daten, benutzer }) {
  const tabellen = daten;            // { tabelle: [zeilen] }
  const mails = [];
  let idZaehler = 1000;

  const passt = (zeile, [spalte, ausdruck]) => {
    const [op, ...rest] = ausdruck.split('.');
    const wert = rest.join('.');
    const v = zeile[spalte];
    switch (op) {
      case 'eq': return String(v) === wert;
      case 'neq': return String(v) !== wert;
      case 'is': return wert === 'null' ? (v === null || v === undefined) : String(v) === wert;
      case 'not': {
        // not.is.null
        const [op2, wert2] = rest;
        if (op2 === 'is' && wert2 === 'null') return !(v === null || v === undefined);
        return true;
      }
      case 'in': {
        const liste = wert.replace(/^\(|\)$/g, '').split(',').map((x) => x.replace(/^"|"$/g, ''));
        return liste.includes(String(v));
      }
      case 'gte': return String(v) >= wert;
      case 'lte': return String(v) <= wert;
      default: return true;
    }
  };

  const server = createServer(async (req, res) => {
    const url = new URL(req.url, 'http://x');
    let body = '';
    for await (const c of req) body += c;

    const antwort = (code, daten) => {
      res.writeHead(code, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(daten));
    };

    // --- Resend ---
    if (url.pathname === '/emails') {
      const m = JSON.parse(body || '{}');
      mails.push(m);
      return antwort(200, { id: 'mail_' + mails.length });
    }

    // --- Auth ---
    if (url.pathname === '/auth/v1/user') {
      const token = (req.headers.authorization || '').replace('Bearer ', '');
      const u = benutzer[token];
      if (!u) return antwort(401, { error: 'invalid token' });
      return antwort(200, { id: u.id, aud: 'authenticated', email: u.email, app_metadata: {}, user_metadata: {} });
    }

    // --- PostgREST ---
    if (url.pathname.startsWith('/rest/v1/')) {
      const tabelle = url.pathname.slice('/rest/v1/'.length);
      tabellen[tabelle] ||= [];
      const filter = [...url.searchParams.entries()].filter(([k]) => !['select', 'order', 'limit', 'on_conflict', 'columns'].includes(k));
      const treffer = () => tabellen[tabelle].filter((z) => filter.every((f) => passt(z, f)));
      const einzel = (req.headers.accept || '').includes('vnd.pgrst.object');

      if (req.method === 'GET') {
        let rows = treffer();
        const ordnung = url.searchParams.get('order');
        if (ordnung) {
          const [spalte, richtung] = ordnung.split('.');
          rows = [...rows].sort((a, b) => String(a[spalte]).localeCompare(String(b[spalte])) * (richtung === 'desc' ? -1 : 1));
        }
        if (einzel) {
          if (!rows.length) return antwort(406, { message: 'no rows', code: 'PGRST116' });
          return antwort(200, rows[0]);
        }
        return antwort(200, rows);
      }

      if (req.method === 'POST') {
        const eingang = JSON.parse(body || '[]');
        const zeilen = Array.isArray(eingang) ? eingang : [eingang];
        const konflikt = (url.searchParams.get('on_conflict') || '').split(',').filter(Boolean);
        const neu = [];
        for (const z of zeilen) {
          const vorhanden = konflikt.length
            ? tabellen[tabelle].find((x) => konflikt.every((k) => String(x[k]) === String(z[k])))
            : null;
          if (vorhanden) { Object.assign(vorhanden, z); neu.push(vorhanden); continue; }
          const zeile = { id: `id_${++idZaehler}`, erstellt_am: new Date().toISOString(), ...z };
          tabellen[tabelle].push(zeile);
          neu.push(zeile);
        }
        return antwort(201, einzel ? neu[0] : neu);
      }

      if (req.method === 'PATCH') {
        const aenderung = JSON.parse(body || '{}');
        const rows = treffer();
        rows.forEach((z) => Object.assign(z, aenderung));
        return antwort(200, einzel ? (rows[0] ?? null) : rows);
      }

      if (req.method === 'DELETE') {
        const rows = treffer();
        tabellen[tabelle] = tabellen[tabelle].filter((z) => !rows.includes(z));
        return antwort(200, rows);
      }
    }

    antwort(404, { message: 'unbekannt: ' + req.method + ' ' + url.pathname });
  });

  return new Promise((fertig) => server.listen(port, '127.0.0.1', () => fertig({ server, tabellen, mails })));
}
