'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

const F = {
  bg: '#FAFCFF', white: '#ffffff', ink: '#0F172A', inkSoft: '#475569', inkMuted: '#94A3B8',
  border: '#E2E8F0', blue: '#1769FF', blueDeep: '#1156DD', green: '#10B981', red: '#DC2626',
};
const SANS = '"Inter", -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';

// Verifiziert die Session serverseitig und holt eine frische 24h-Download-URL.
export default function DownloadBox({ heading, sub }: { heading: string; sub: string }) {
  const params = useSearchParams();
  const sessionId = params.get('session_id');
  const [status, setStatus] = useState<'laden' | 'bereit' | 'fehler'>('laden');
  const [url, setUrl] = useState<string | null>(null);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (!sessionId) { setStatus('fehler'); setMsg('Kein gültiger Link (die session_id fehlt).'); return; }
    let aktiv = true;
    (async () => {
      try {
        const res = await fetch('/api/heft-download', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ session_id: sessionId }),
        });
        const data = await res.json().catch(() => null);
        if (!aktiv) return;
        if (data && data.ok && data.url) { setUrl(data.url); setStatus('bereit'); }
        else { setStatus('fehler'); setMsg(data?.error || 'Der Download konnte nicht erzeugt werden.'); }
      } catch {
        if (aktiv) { setStatus('fehler'); setMsg('Es gab ein Problem. Bitte lade die Seite neu.'); }
      }
    })();
    return () => { aktiv = false; };
  }, [sessionId]);

  return (
    <main style={{ background: F.bg, minHeight: '100vh', fontFamily: SANS, color: F.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ background: F.white, border: `1px solid ${F.border}`, borderRadius: '24px', padding: '40px 34px', maxWidth: '520px', width: '100%', textAlign: 'center', boxShadow: '0 20px 50px rgba(15,23,42,0.07)' }}>
        <div style={{ fontSize: '44px', marginBottom: '8px' }}>{status === 'fehler' ? '⚠️' : '📘'}</div>
        <h1 style={{ fontSize: '24px', margin: '0 0 10px' }}>{heading}</h1>
        <p style={{ fontSize: '15px', color: F.inkSoft, lineHeight: 1.6, margin: '0 0 24px' }}>{sub}</p>

        {status === 'laden' && <p style={{ color: F.inkMuted, fontSize: '15px' }}>Download wird vorbereitet …</p>}

        {status === 'bereit' && url && (
          <>
            <a href={url} style={{ display: 'inline-block', background: F.blue, color: F.white, textDecoration: 'none', padding: '16px 34px', borderRadius: '14px', fontSize: '16px', fontWeight: 700, boxShadow: '0 10px 28px rgba(23,105,255,0.32)' }}>
              📘 Heft herunterladen (PDF)
            </a>
            <p style={{ fontSize: '12.5px', color: F.inkMuted, margin: '18px 0 0' }}>
              Der Link ist 24&nbsp;Stunden gültig. Du hast zusätzlich eine E-Mail mit einem dauerhaften Download-Link bekommen.
            </p>
          </>
        )}

        {status === 'fehler' && (
          <p style={{ color: F.red, fontSize: '14.5px', fontWeight: 600, lineHeight: 1.6 }}>{msg}</p>
        )}
      </div>
    </main>
  );
}
