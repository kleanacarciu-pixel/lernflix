export default function Home() {
  return (
    <main style={{minHeight: '100vh', backgroundColor: '#f5f0e8', fontFamily: 'sans-serif'}}>

      {/* Header */}
      <header style={{backgroundColor: '#ffffff', borderBottom: '1px solid #e0d8cc', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <div>
         <img src="/logo.jpg?v=1" alt="Lerne mit Anna" style={{height: '60px'}} />
        </div>
        <nav style={{display: 'flex', gap: '24px'}}>
          <a href="#mathe" style={{color: '#5b9bd5', textDecoration: 'none', fontSize: '14px', fontWeight: '500'}}>Mathe</a>
          <a href="#physik" style={{color: '#5b9bd5', textDecoration: 'none', fontSize: '14px', fontWeight: '500'}}>Physik</a>
          <a href="#pakete" style={{color: '#5b9bd5', textDecoration: 'none', fontSize: '14px', fontWeight: '500'}}>Lernpakete</a>
          <a href="#quiz" style={{color: '#5b9bd5', textDecoration: 'none', fontSize: '14px', fontWeight: '500'}}>Quiz</a>
        </nav>
      </header>

      {/* Hero */}
      <section style={{backgroundColor: '#5b9bd5', color: 'white', textAlign: 'center', padding: '64px 24px'}}>
        <h2 style={{fontSize: '40px', fontWeight: '700', margin: '0 0 12px'}}>Mathe & Physik leicht gemacht</h2>
        <p style={{fontSize: '18px', margin: '0 0 32px', opacity: 0.9}}>Lernmaterialien von Anna </p>
        <div style={{display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap'}}>
          <a href="#mathe" style={{backgroundColor: 'white', color: '#5b9bd5', fontWeight: '700', padding: '12px 28px', borderRadius: '50px', textDecoration: 'none', fontSize: '15px'}}>Materialien ansehen</a>
          <a href="#quiz" style={{backgroundColor: 'transparent', color: 'white', fontWeight: '700', padding: '12px 28px', borderRadius: '50px', textDecoration: 'none', fontSize: '15px', border: '2px solid white'}}>Kostenlose Quizze</a>
        </div>
      </section>

      {/* Kategorien */}
      <section style={{maxWidth: '1100px', margin: '0 auto', padding: '48px 24px'}}>
        <h3 style={{fontSize: '22px', fontWeight: '700', color: '#4a4035', marginBottom: '24px'}}>Kategorien</h3>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px'}}>

          <a href="#mathe" style={{textDecoration: 'none'}}>
            <div style={{backgroundColor: '#ddeeff', borderRadius: '16px', padding: '32px 24px', textAlign: 'center', border: '1px solid #b8d4f0', cursor: 'pointer'}}>
              <div style={{fontSize: '48px', marginBottom: '12px'}}>📐</div>
              <h4 style={{margin: '0 0 6px', fontSize: '20px', fontWeight: '700', color: '#2d6da8'}}>Mathe</h4>
              <p style={{margin: 0, fontSize: '13px', color: '#5580a0'}}>Übungen, Arbeitsblätter & Erklärungen</p>
            </div>
          </a>

          <a href="#physik" style={{textDecoration: 'none'}}>
            <div style={{backgroundColor: '#ddeeff', borderRadius: '16px', padding: '32px 24px', textAlign: 'center', border: '1px solid #b8d4f0', cursor: 'pointer'}}>
              <div style={{fontSize: '48px', marginBottom: '12px'}}>⚡</div>
              <h4 style={{margin: '0 0 6px', fontSize: '20px', fontWeight: '700', color: '#2d6da8'}}>Physik</h4>
              <p style={{margin: 0, fontSize: '13px', color: '#5580a0'}}>Formeln, Aufgaben & Erklärungen</p>
            </div>
          </a>

          <a href="#pakete" style={{textDecoration: 'none'}}>
            <div style={{backgroundColor: '#f5ead0', borderRadius: '16px', padding: '32px 24px', textAlign: 'center', border: '1px solid #e0cc99', cursor: 'pointer'}}>
              <div style={{fontSize: '48px', marginBottom: '12px'}}>🎒</div>
              <h4 style={{margin: '0 0 6px', fontSize: '20px', fontWeight: '700', color: '#8a6a20'}}>Lernpakete</h4>
              <p style={{margin: 0, fontSize: '13px', color: '#9a8040'}}>Abitur, Sommer & Spezialthemen</p>
            </div>
          </a>

          <a href="#quiz" style={{textDecoration: 'none'}}>
            <div style={{backgroundColor: '#f5ead0', borderRadius: '16px', padding: '32px 24px', textAlign: 'center', border: '1px solid #e0cc99', cursor: 'pointer'}}>
              <div style={{fontSize: '48px', marginBottom: '12px'}}>🧠</div>
              <h4 style={{margin: '0 0 6px', fontSize: '20px', fontWeight: '700', color: '#8a6a20'}}>Quiz</h4>
              <p style={{margin: 0, fontSize: '13px', color: '#9a8040'}}>Kostenlose Quizze direkt in der App</p>
            </div>
          </a>

        </div>
      </section>

      {/* Mathe */}
      <section id="mathe" style={{backgroundColor: '#ffffff', padding: '48px 24px'}}>
        <div style={{maxWidth: '1100px', margin: '0 auto'}}>
          <h3 style={{fontSize: '22px', fontWeight: '700', color: '#2d6da8', marginBottom: '24px'}}>📐 Mathe</h3>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px'}}>

            <div style={{backgroundColor: '#f5f0e8', borderRadius: '12px', padding: '24px', border: '1px solid #e0d8cc'}}>
              <p style={{margin: '0 0 4px', fontSize: '11px', color: '#5b9bd5', fontWeight: '600', textTransform: 'uppercase'}}>Arbeitsblatt</p>
              <h4 style={{margin: '0 0 6px', fontSize: '16px', fontWeight: '700', color: '#4a4035'}}>Gleichungen Klasse 8</h4>
              <p style={{margin: '0 0 16px', fontSize: '13px', color: '#7a6e62'}}>10 Übungsaufgaben mit Lösungen</p>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <span style={{fontSize: '18px', fontWeight: '700', color: '#5b9bd5'}}>3,99 €</span>
                <button style={{backgroundColor: '#5b9bd5', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 18px', fontSize: '13px', fontWeight: '600', cursor: 'pointer'}}>Kaufen</button>
              </div>
            </div>

            <div style={{backgroundColor: '#f5f0e8', borderRadius: '12px', padding: '24px', border: '1px solid #e0d8cc'}}>
              <p style={{margin: '0 0 4px', fontSize: '11px', color: '#5b9bd5', fontWeight: '600', textTransform: 'uppercase'}}>Erklärung</p>
              <h4 style={{margin: '0 0 6px', fontSize: '16px', fontWeight: '700', color: '#4a4035'}}>Bruchrechnung einfach erklärt</h4>
              <p style={{margin: '0 0 16px', fontSize: '13px', color: '#7a6e62'}}>Schritt für Schritt Erklärung</p>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <span style={{fontSize: '18px', fontWeight: '700', color: '#5b9bd5'}}>2,99 €</span>
                <button style={{backgroundColor: '#5b9bd5', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 18px', fontSize: '13px', fontWeight: '600', cursor: 'pointer'}}>Kaufen</button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Physik */}
      <section id="physik" style={{backgroundColor: '#f5f0e8', padding: '48px 24px'}}>
        <div style={{maxWidth: '1100px', margin: '0 auto'}}>
          <h3 style={{fontSize: '22px', fontWeight: '700', color: '#2d6da8', marginBottom: '24px'}}>⚡ Physik</h3>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px'}}>

            <div style={{backgroundColor: '#ffffff', borderRadius: '12px', padding: '24px', border: '1px solid #e0d8cc'}}>
              <p style={{margin: '0 0 4px', fontSize: '11px', color: '#5b9bd5', fontWeight: '600', textTransform: 'uppercase'}}>Formelsammlung</p>
              <h4 style={{margin: '0 0 6px', fontSize: '16px', fontWeight: '700', color: '#4a4035'}}>Physik Formeln Klasse 9</h4>
              <p style={{margin: '0 0 16px', fontSize: '13px', color: '#7a6e62'}}>Alle wichtigen Formeln auf 5 Seiten</p>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <span style={{fontSize: '18px', fontWeight: '700', color: '#5b9bd5'}}>2,99 €</span>
                <button style={{backgroundColor: '#5b9bd5', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 18px', fontSize: '13px', fontWeight: '600', cursor: 'pointer'}}>Kaufen</button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Lernpakete */}
      <section id="pakete" style={{backgroundColor: '#ffffff', padding: '48px 24px'}}>
        <div style={{maxWidth: '1100px', margin: '0 auto'}}>
          <h3 style={{fontSize: '22px', fontWeight: '700', color: '#8a6a20', marginBottom: '24px'}}>🎒 Lernpakete</h3>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px'}}>

            <div style={{backgroundColor: '#f5ead0', borderRadius: '12px', padding: '24px', border: '1px solid #e0cc99'}}>
              <p style={{margin: '0 0 4px', fontSize: '11px', color: '#c8960c', fontWeight: '600', textTransform: 'uppercase'}}>Sommerpaket</p>
              <h4 style={{margin: '0 0 6px', fontSize: '16px', fontWeight: '700', color: '#4a4035'}}>Mathe Sommer Klasse 8→9</h4>
              <p style={{margin: '0 0 16px', fontSize: '13px', color: '#7a6e62'}}>Alles wiederholen für den Neustart</p>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <span style={{fontSize: '18px', fontWeight: '700', color: '#c8960c'}}>9,99 €</span>
                <button style={{backgroundColor: '#c8960c', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 18px', fontSize: '13px', fontWeight: '600', cursor: 'pointer'}}>Kaufen</button>
              </div>
            </div>

            <div style={{backgroundColor: '#f5ead0', borderRadius: '12px', padding: '24px', border: '1px solid #e0cc99'}}>
              <p style={{margin: '0 0 4px', fontSize: '11px', color: '#c8960c', fontWeight: '600', textTransform: 'uppercase'}}>Abitur</p>
              <h4 style={{margin: '0 0 6px', fontSize: '16px', fontWeight: '700', color: '#4a4035'}}>Abitur Vorbereitung Mathe</h4>
              <p style={{margin: '0 0 16px', fontSize: '13px', color: '#7a6e62'}}>Komplettes Paket für die Prüfung</p>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <span style={{fontSize: '18px', fontWeight: '700', color: '#c8960c'}}>14,99 €</span>
                <button style={{backgroundColor: '#c8960c', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 18px', fontSize: '13px', fontWeight: '600', cursor: 'pointer'}}>Kaufen</button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Quiz */}
      <section id="quiz" style={{backgroundColor: '#f5f0e8', padding: '48px 24px'}}>
        <div style={{maxWidth: '1100px', margin: '0 auto'}}>
          <h3 style={{fontSize: '22px', fontWeight: '700', color: '#8a6a20', marginBottom: '8px'}}>🧠 Quiz</h3>
          <p style={{fontSize: '14px', color: '#7a6e62', marginBottom: '24px'}}>Kostenlos — direkt hier in der App!</p>
          <div style={{backgroundColor: '#ffffff', borderRadius: '12px', padding: '32px', border: '1px solid #e0d8cc', textAlign: 'center'}}>
            <div style={{fontSize: '48px', marginBottom: '12px'}}>🚀</div>
            <h4 style={{margin: '0 0 8px', fontSize: '18px', fontWeight: '700', color: '#4a4035'}}>Bald verfügbar!</h4>
            <p style={{margin: 0, fontSize: '14px', color: '#7a6e62'}}>Wir arbeiten daran — kostenlose Quizze kommen bald!</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{textAlign: 'center', padding: '32px', backgroundColor: '#ffffff', borderTop: '1px solid #e0d8cc', color: '#a0947e', fontSize: '13px'}}>
       © 2025 Lerne mit Anna · <a href="/impressum" style={{color: '#a0947e', textDecoration: 'none'}}>Impressum</a> · <a href="/datenschutz" style={{color: '#a0947e', textDecoration: 'none'}}>Datenschutz</a> · <a href="/agb" style={{color: '#a0947e', textDecoration: 'none'}}>AGB</a>
      </footer>

    </main>
  );
}