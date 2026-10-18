'use client';
// =============================================================================
// Admin-Übersicht – Kleanas Startpunkt
//
// Statt sich alle Wege einzeln zu merken (Kalender, Verträge, Finanzheft, …)
// landet Kleana hier und wählt per Klick. Rein Navigation, keine eigene
// Logik – jede Kachel führt zu einer bestehenden Seite mit ihrer eigenen
// Anmeldung/Berechtigung.
// =============================================================================
import { useEffect, useState } from 'react';
import Anmeldehinweis from '@/components/Anmeldehinweis';
import { ladeSitzung } from '@/components/sitzung';

const F = {
  ink: '#0F172A', soft: '#475569', line: '#E2E8F0',
  blue: '#1769FF', bg: '#fffdf8', weiss: '#fff',
};

type Kachel = { href: string; icon: string; titel: string; text: string };

const KACHELN: Kachel[] = [
  { href: '/kalender', icon: '📅', titel: 'Kalender', text: 'Termine, Klassenzimmer, Schüler-Übersicht' },
  { href: '/finanzheft', icon: '💰', titel: 'Finanzheft', text: 'Privates Geld und Firmengeld getrennt' },
  { href: '/zahlungen', icon: '💶', titel: 'Zahlungen', text: 'Offene Raten und Mahnwesen' },
  { href: '/vertraege', icon: '📄', titel: 'Verträge', text: 'Verträge der Schüler verwalten' },
  { href: '/schuljahr', icon: '🏫', titel: 'Schuljahr & Ferien', text: 'Schuljahre und Ferienzeiten pflegen' },
  { href: '/einstellungen', icon: '⚙️', titel: 'Einstellungen', text: 'Unterschrift und weitere Grundeinstellungen' },
];

export default function AdminUebersicht() {
  const [rolle, setRolle] = useState<string | undefined>(undefined);
  const [geprueft, setGeprueft] = useState(false);

  useEffect(() => { setRolle(ladeSitzung()?.role); setGeprueft(true); }, []);

  if (geprueft && rolle !== 'admin') {
    return (
      <main style={huelle}>
        <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 20px' }}>
          <div style={karte}>
            <h1 style={h1}>Übersicht</h1>
            <Anmeldehinweis abgelaufen={false} />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main style={huelle}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 20px 60px' }}>
        <h1 style={h1}>Übersicht</h1>
        <p style={{ color: F.soft, marginTop: 0 }}>Wohin möchtest du?</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14, marginTop: 18 }}>
          {KACHELN.map((k) => (
            <a key={k.href} href={k.href} style={kachel}>
              <div style={{ fontSize: 32 }}>{k.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 17, marginTop: 8 }}>{k.titel}</div>
              <div style={{ color: F.soft, fontSize: 14, marginTop: 4 }}>{k.text}</div>
            </a>
          ))}
        </div>
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
const h1: React.CSSProperties = { fontSize: 28, fontWeight: 800, margin: '0 0 4px' };
const kachel: React.CSSProperties = {
  background: F.weiss, border: `1px solid ${F.line}`, borderRadius: 16,
  padding: '20px 18px', textDecoration: 'none', color: F.ink, display: 'block',
};
