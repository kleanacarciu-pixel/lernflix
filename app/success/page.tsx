'use client';
import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

const F = {
  bgWarm: '#fff8ee',
  bg: '#ffffff',
  ink: '#0F172A',
  inkSoft: '#475569',
  border: '#E2E8F0',
  coral: '#ff5b4a',
  coralDeep: '#e44b3c',
  blue: '#1769FF',
  green: '#10B981',
};
const SANS = '"Inter", -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';

const downloads: Record<string, string> = {
  'Geometrie Formelsammlung Klasse 6-9': 'https://xxptbgzjjdifcyrtxbkj.supabase.co/storage/v1/object/sign/materialien/Geometrie_Formelsammlung%20(1).pdf?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wN2U1ODRkYy1kNGQwLTQ1NzMtYjQzMi03NjY0ZTRmNTQzZTkiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtYXRlcmlhbGllbi9HZW9tZXRyaWVfRm9ybWVsc2FtbWx1bmcgKDEpLnBkZiIsImlhdCI6MTc3ODc1NTk1MCwiZXhwIjoxODEwMjkxOTUwfQ.PgFV_bdF147s4XXlbRIMS6lpfoYuI8jHWkzk3wle41s',
  'Potenzen': 'https://xxptbgzjjdifcyrtxbkj.supabase.co/storage/v1/object/sign/materialien/Potenzen.pdf?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wN2U1ODRkYy1kNGQwLTQ1NzMtYjQzMi03NjY0ZTRmNTQzZTkiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtYXRlcmlhbGllbi9Qb3Rlbnplbi5wZGYiLCJpYXQiOjE3Nzg3NTU5OTksImV4cCI6MTgxMDI5MTk5OX0.Vc_3IxP7MvbapLCtAMQwpsEapSLGAYNtZrJe7Ca-3pM',
  'Mechanik': 'https://xxptbgzjjdifcyrtxbkj.supabase.co/storage/v1/object/sign/materialien/Mechanik.pdf?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wN2U1ODRkYy1kNGQwLTQ1NzMtYjQzMi03NjY0ZTRmNTQzZTkiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtYXRlcmlhbGllbi9NZWNoYW5pay5wZGYiLCJpYXQiOjE3Nzg3NTU5ODIsImV4cCI6MTgxMDI5MTk4Mn0.WFIqQEkUxkN3zb4-FaE0jiQ8BXiJ3YM08UwJlEMgeW8',
};

const Sterne = () => (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
    <circle cx="32" cy="32" r="30" fill="#E8F7EE" />
    <path d="M22 32 L29 39 L43 25" stroke="#10B981" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

function SuccessContent() {
  const searchParams = useSearchParams();
  const produkt = searchParams.get('produkt');
  const url = produkt ? downloads[produkt] : null;

  useEffect(() => {
    if (url) {
      setTimeout(() => {
        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';
        link.click();
      }, 1000);
    }
  }, [url]);

  return (
    <main style={{ minHeight: '100vh', background: F.bgWarm, fontFamily: SANS, color: F.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" />

      <div style={{ background: F.bg, borderRadius: '28px', padding: '52px 44px 44px', border: `1px solid ${F.border}`, textAlign: 'center', maxWidth: '500px', width: '100%', boxShadow: '0 16px 50px rgba(15,23,42,0.10)' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <Sterne />
        </div>
        <h1 style={{ fontSize: '32px', fontWeight: 800, color: F.ink, margin: '0 0 10px', letterSpacing: '-0.025em', lineHeight: 1.1 }}>Vielen Dank!</h1>
        <p style={{ fontSize: '16px', color: F.inkSoft, margin: '0 0 6px', fontWeight: 500 }}>Deine Zahlung war erfolgreich.</p>
        {url && (
          <p style={{ fontSize: '14px', color: F.green, fontWeight: 700, margin: '0 0 28px', letterSpacing: '0.04em' }}>
            Dein Download startet automatisch ...
          </p>
        )}
        {!url && (
          <p style={{ height: '20px', margin: '0 0 28px' }} />
        )}
        {url && (
          <a href={url} target="_blank" rel="noreferrer" style={{ display: 'inline-block', background: F.coral, color: '#fff', padding: '14px 28px', borderRadius: '14px', textDecoration: 'none', fontWeight: 700, fontSize: '15px', marginBottom: '20px', boxShadow: '0 8px 24px rgba(255,91,74,0.30)' }}>
            Hier klicken zum Herunterladen
          </a>
        )}
        <div>
          <a href="/" style={{ color: F.inkSoft, fontSize: '14px', textDecoration: 'none', fontWeight: 600 }}>← Zurück zur Startseite</a>
        </div>
      </div>
    </main>
  );
}

export default function Success() {
  return (
    <Suspense fallback={
      <main style={{ minHeight: '100vh', background: F.bgWarm, fontFamily: SANS, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: F.inkSoft, fontSize: '15px', fontWeight: 600 }}>Laden ...</p>
      </main>
    }>
      <SuccessContent />
    </Suspense>
  );
}
