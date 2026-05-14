export default function Success() {
  return (
    <main style={{minHeight: '100vh', backgroundColor: '#f5f0e8', fontFamily: 'sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{backgroundColor: 'white', borderRadius: '16px', padding: '48px', border: '1px solid #e0d8cc', textAlign: 'center', maxWidth: '500px'}}>
        <div style={{fontSize: '64px', marginBottom: '16px'}}>🎉</div>
        <h1 style={{fontSize: '28px', fontWeight: '700', color: '#4a4035', margin: '0 0 12px'}}>Vielen Dank!</h1>
        <p style={{fontSize: '16px', color: '#7a6e62', margin: '0 0 24px', lineHeight: '1.6'}}>
          Deine Zahlung war erfolgreich! Du erhältst gleich eine E-Mail mit deinem Download-Link.
        </p>
        <a href="/" style={{backgroundColor: '#5b9bd5', color: 'white', padding: '12px 28px', borderRadius: '8px', textDecoration: 'none', fontWeight: '600', fontSize: '15px'}}>
          Zurück zur Startseite
        </a>
      </div>
    </main>
  );
}