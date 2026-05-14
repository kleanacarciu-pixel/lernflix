'use client';
import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

const downloads: Record<string, string> = {
  'Geometrie Formelsammlung Klasse 6-9': 'https://xxptbgzjjdifcyrtxbkj.supabase.co/storage/v1/object/sign/materialien/Geometrie_Formelsammlung%20(1).pdf?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wN2U1ODRkYy1kNGQwLTQ1NzMtYjQzMi03NjY0ZTRmNTQzZTkiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtYXRlcmlhbGllbi9HZW9tZXRyaWVfRm9ybWVsc2FtbWx1bmcgKDEpLnBkZiIsImlhdCI6MTc3ODc1NTk1MCwiZXhwIjoxODEwMjkxOTUwfQ.PgFV_bdF147s4XXlbRIMS6lpfoYuI8jHWkzk3wle41s',
  'Potenzen': 'https://xxptbgzjjdifcyrtxbkj.supabase.co/storage/v1/object/sign/materialien/Potenzen.pdf?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wN2U1ODRkYy1kNGQwLTQ1NzMtYjQzMi03NjY0ZTRmNTQzZTkiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtYXRlcmlhbGllbi9Qb3Rlbnplbi5wZGYiLCJpYXQiOjE3Nzg3NTU5OTksImV4cCI6MTgxMDI5MTk5OX0.Vc_3IxP7MvbapLCtAMQwpsEapSLGAYNtZrJe7Ca-3pM',
  'Mechanik': 'https://xxptbgzjjdifcyrtxbkj.supabase.co/storage/v1/object/sign/materialien/Mechanik.pdf?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wN2U1ODRkYy1kNGQwLTQ1NzMtYjQzMi03NjY0ZTRmNTQzZTkiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtYXRlcmlhbGllbi9NZWNoYW5pay5wZGYiLCJpYXQiOjE3Nzg3NTU5ODIsImV4cCI6MTgxMDI5MTk4Mn0.WFIqQEkUxkN3zb4-FaE0jiQ8BXiJ3YM08UwJlEMgeW8',
};

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

  if (url) {
    return (
      <main style={{minHeight: '100vh', backgroundColor: '#f5f0e8', fontFamily: 'sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'}}>
        <div style={{backgroundColor: 'white', borderRadius: '16px', padding: '48px', border: '1px solid #e0d8cc', textAlign: 'center', maxWidth: '500px', width: '100%'}}>
          <div style={{fontSize: '64px', marginBottom: '16px'}}>🎉</div>
          <h1 style={{fontSize: '28px', fontWeight: '700', color: '#4a4035', margin: '0 0 12px'}}>Vielen Dank!</h1>
          <p style={{fontSize: '16px', color: '#7a6e62', margin: '0 0 16px'}}>Deine Zahlung war erfolgreich!</p>
          <p style={{fontSize: '15px', color: '#5b9bd5', fontWeight: '600', margin: '0 0 24px'}}>Dein Download startet automatisch...</p>
          <a href={url} target="_blank" style={{display: 'inline-block', backgroundColor: '#5b9bd5', color: 'white', padding: '14px 32px', borderRadius: '10px', textDecoration: 'none', fontWeight: '700', fontSize: '16px', marginBottom: '24px'}}>
            Hier klicken zum Herunterladen
          </a>
          <br/>
          <a href="/" style={{color: '#5b9bd5', fontSize: '14px', textDecoration: 'none'}}>Zurueck zur Startseite</a>
        </div>
      </main>
    );
  }

  return (
    <main style={{minHeight: '100vh', backgroundColor: '#f5f0e8', fontFamily: 'sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'}}>
      <div style={{backgroundColor: 'white', borderRadius: '16px', padding: '48px', border: '1px solid #e0d8cc', textAlign: 'center', maxWidth: '500px', width: '100%'}}>
        <div style={{fontSize: '64px', marginBottom: '16px'}}>🎉</div>
        <h1 style={{fontSize: '28px', fontWeight: '700', color: '#4a4035', margin: '0 0 12px'}}>Vielen Dank!</h1>
        <p style={{fontSize: '16px', color: '#7a6e62', margin: '0 0 24px'}}>Deine Zahlung war erfolgreich!</p>
        <a href="/" style={{color: '#5b9bd5', fontSize: '14px', textDecoration: 'none'}}>Zurueck zur Startseite</a>
      </div>
    </main>
  );
}

export default function Success() {
  return (
    <Suspense fallback={
      <main style={{minHeight: '100vh', backgroundColor: '#f5f0e8', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <p style={{color: '#5b9bd5', fontSize: '18px'}}>Laden...</p>
      </main>
    }>
      <SuccessContent />
    </Suspense>
  );
}