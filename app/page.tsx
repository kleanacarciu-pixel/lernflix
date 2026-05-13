export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">

      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-purple-600">Lernflix</h1>
        <p className="text-sm text-gray-500">von Lerne mit Anna</p>
      </header>

      {/* Hero */}
      <section className="bg-purple-600 text-white text-center py-16 px-6">
        <h2 className="text-4xl font-bold mb-4">Mathe & Physik leicht gemacht</h2>
        <p className="text-lg mb-6">Lernmaterialien von Anna — sofort herunterladen</p>
        <button className="bg-white text-purple-600 font-bold px-8 py-3 rounded-full hover:bg-purple-50">
          Materialien ansehen
        </button>
      </section>

      {/* Produkte */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <h3 className="text-2xl font-bold text-gray-800 mb-8">Beliebte Materialien</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="bg-purple-100 rounded-lg p-4 mb-4 text-center text-4xl">📐</div>
            <h4 className="font-bold text-gray-800 mb-1">Mathe Arbeitsblatt Klasse 8</h4>
            <p className="text-sm text-gray-500 mb-4">Gleichungen lösen — 10 Übungsaufgaben</p>
            <div className="flex items-center justify-between">
              <span className="text-purple-600 font-bold text-lg">3,99 €</span>
              <button className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700">
                Kaufen
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="bg-blue-100 rounded-lg p-4 mb-4 text-center text-4xl">⚡</div>
            <h4 className="font-bold text-gray-800 mb-1">Physik Formelsammlung</h4>
            <p className="text-sm text-gray-500 mb-4">Alle wichtigen Formeln auf 5 Seiten</p>
            <div className="flex items-center justify-between">
              <span className="text-purple-600 font-bold text-lg">2,99 €</span>
              <button className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700">
                Kaufen
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="bg-green-100 rounded-lg p-4 mb-4 text-center text-4xl">🔢</div>
            <h4 className="font-bold text-gray-800 mb-1">Mathe Quiz Klasse 6</h4>
            <p className="text-sm text-gray-500 mb-4">20 Fragen mit Lösungen</p>
            <div className="flex items-center justify-between">
              <span className="text-purple-600 font-bold text-lg">1,99 €</span>
              <button className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700">
                Kaufen
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-gray-400 text-sm py-8">
        © 2025 Lerne mit Anna · Alle Rechte vorbehalten
      </footer>

    </main>
  );
}