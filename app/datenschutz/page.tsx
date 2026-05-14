export default function Datenschutz() {
  return (
    <main style={{minHeight: '100vh', backgroundColor: '#f5f0e8', fontFamily: 'sans-serif', padding: '48px 24px'}}>
      <div style={{maxWidth: '800px', margin: '0 auto', backgroundColor: 'white', borderRadius: '16px', padding: '48px', border: '1px solid #e0d8cc'}}>
        
        <a href="/" style={{color: '#5b9bd5', fontSize: '14px', textDecoration: 'none'}}>← Zurück zur Startseite</a>
        
        <h1 style={{fontSize: '32px', fontWeight: '700', color: '#4a4035', margin: '24px 0 32px'}}>Datenschutzerklärung</h1>

        <h2 style={{fontSize: '18px', fontWeight: '600', color: '#4a4035', marginBottom: '8px'}}>1. Datenschutz auf einen Blick</h2>
        <p style={{color: '#7a6e62', lineHeight: '1.8', margin: '0 0 24px'}}>
          Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten 
          passiert, wenn Sie diese Website besuchen. Verantwortlicher für die Datenverarbeitung ist Kleana Carciu, 
          Kohlbrennerstraße 16, 81929 München.
        </p>

        <h2 style={{fontSize: '18px', fontWeight: '600', color: '#4a4035', marginBottom: '8px'}}>2. Welche Daten erfassen wir?</h2>
        <p style={{color: '#7a6e62', lineHeight: '1.8', margin: '0 0 24px'}}>
          Wir erfassen nur die Daten die für den Kauf notwendig sind: Name, E-Mail-Adresse und Zahlungsdaten. 
          Zahlungsdaten werden ausschließlich über den sicheren Zahlungsdienstleister Stripe verarbeitet. 
          Wir speichern keine Kreditkartendaten.
        </p>

        <h2 style={{fontSize: '18px', fontWeight: '600', color: '#4a4035', marginBottom: '8px'}}>3. Wofür nutzen wir Ihre Daten?</h2>
        <p style={{color: '#7a6e62', lineHeight: '1.8', margin: '0 0 24px'}}>
          Ihre Daten werden ausschließlich zur Abwicklung Ihrer Bestellung und zur Bereitstellung der 
          gekauften Lernmaterialien verwendet. Wir geben Ihre Daten nicht an Dritte weiter.
        </p>

        <h2 style={{fontSize: '18px', fontWeight: '600', color: '#4a4035', marginBottom: '8px'}}>4. Ihre Rechte</h2>
        <p style={{color: '#7a6e62', lineHeight: '1.8', margin: '0 0 24px'}}>
          Sie haben jederzeit das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung der 
          Verarbeitung Ihrer gespeicherten Daten. Kontaktieren Sie uns unter: lernemitanna@outlook.com
        </p>

        <h2 style={{fontSize: '18px', fontWeight: '600', color: '#4a4035', marginBottom: '8px'}}>5. Cookies</h2>
        <p style={{color: '#7a6e62', lineHeight: '1.8', margin: '0 0 24px'}}>
          Diese Website verwendet nur technisch notwendige Cookies. Es werden keine Tracking- oder 
          Werbe-Cookies eingesetzt.
        </p>

        <h2 style={{fontSize: '18px', fontWeight: '600', color: '#4a4035', marginBottom: '8px'}}>6. Hosting</h2>
        <p style={{color: '#7a6e62', lineHeight: '1.8', margin: '0 0 24px'}}>
          Diese Website wird bei Vercel Inc., 340 Pine Street, San Francisco, CA 94104, USA gehostet. 
          Weitere Informationen finden Sie in der Datenschutzerklärung von Vercel: https://vercel.com/legal/privacy-policy
        </p>

      </div>
    </main>
  );
}