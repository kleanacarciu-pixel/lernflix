"use client";
import { SHARED_STIL, Sektion, Formel, Beispiel, Joke, Hook } from "./_helfer";

export function InhaltWaerme() {
  return (
    <div className="mat">
      <style>{SHARED_STIL("#dc2626", "#fef2f2", "#fee2e2")}</style>

      <Hook><b>Wärme ist nicht dasselbe wie Temperatur.</b> Wärme ist eine Energieform — wie viel zappelnde Atome du in einem Körper hast. Temperatur ist nur ein Maß dafür. Wenn du das mal kapiert hast, hast du Wärmelehre schon halb gewonnen.</Hook>

      <Sektion nr={1} titel="Temperatur und Skalen">
        <p>Temperatur misst, wie schnell Atome <b>herumzappeln</b>. Je heißer, desto schneller die Bewegung.</p>
        <div className="formeln">
          <Formel name="Celsius → Kelvin" ausdruck={<>T(K) = T(°C) + 273,15</>} />
          <Formel name="Kelvin → Celsius" ausdruck={<>T(°C) = T(K) − 273,15</>} />
          <Formel name="Celsius → Fahrenheit" ausdruck={<>T(°F) = T(°C) · 1,8 + 32</>} />
        </div>
        <table>
          <thead><tr><th>Punkt</th><th>°C</th><th>K</th></tr></thead>
          <tbody>
            <tr><td>Absoluter Nullpunkt</td><td>−273,15</td><td>0</td></tr>
            <tr><td>Gefrierpunkt Wasser</td><td>0</td><td>273,15</td></tr>
            <tr><td>Zimmertemperatur</td><td>20</td><td>293,15</td></tr>
            <tr><td>Körpertemperatur</td><td>37</td><td>310,15</td></tr>
            <tr><td>Siedepunkt Wasser</td><td>100</td><td>373,15</td></tr>
          </tbody>
        </table>
        <Joke>Bei 0 Kelvin (−273,15 °C) stehen alle Atome komplett still. Niemand hat das je erreicht, aber Physiker sind nah dran. Wenn du auch mal still sein willst: ab in den Kühlschrank!</Joke>
      </Sektion>

      <Sektion nr={2} titel="Wärmemenge und spezifische Wärmekapazität">
        <p>Um etwas zu erwärmen, brauchst du <b>Energie</b>. Wie viel? Hängt von der Masse, dem Stoff und der Temperaturänderung ab.</p>
        <div className="formeln">
          <Formel name="Wärmemenge" ausdruck={<>Q = c · m · ΔT</>} hinweis="c = spez. Wärmekapazität, m = Masse, ΔT = Temperatur­änderung" />
        </div>
        <table>
          <thead><tr><th>Stoff</th><th>c (J / kg·K)</th></tr></thead>
          <tbody>
            <tr><td>Wasser</td><td>4 186</td></tr>
            <tr><td>Eis</td><td>2 060</td></tr>
            <tr><td>Aluminium</td><td>900</td></tr>
            <tr><td>Eisen</td><td>450</td></tr>
            <tr><td>Kupfer</td><td>385</td></tr>
            <tr><td>Luft</td><td>1 005</td></tr>
          </tbody>
        </table>
        <Beispiel aufgabe={<>1 kg Wasser von 20 °C auf 100 °C erwärmen. Wie viel Energie?</>}
          schritte={[<>Q = 4186 · 1 · 80 = <b>334 880 J</b> (≈ 335 kJ)</>]} />
        <div className="tipp"><b>Krasses Fact:</b> Wasser hat den höchsten c-Wert aller Stoffe — deshalb wird es im Sommer langsam warm und im Winter langsam kalt. Deshalb dauert auch das Kochen ewig.</div>
      </Sektion>

      <Sektion nr={3} titel="Aggregatzustände und Phasenübergänge">
        <p>Stoffe können <b>fest, flüssig oder gasförmig</b> sein. Beim Wechsel braucht's Energie, ohne dass sich die Temperatur ändert.</p>
        <div className="formeln">
          <Formel name="Schmelzwärme" ausdruck={<>Q = q<sub>s</sub> · m</>} hinweis="q_s = spez. Schmelzwärme" />
          <Formel name="Verdampfungs­wärme" ausdruck={<>Q = q<sub>v</sub> · m</>} />
        </div>
        <table>
          <thead><tr><th>Stoff</th><th>Schmelzpunkt</th><th>Siedepunkt</th></tr></thead>
          <tbody>
            <tr><td>Wasser</td><td>0 °C</td><td>100 °C</td></tr>
            <tr><td>Eisen</td><td>1 538 °C</td><td>2 862 °C</td></tr>
            <tr><td>Sauerstoff</td><td>−218 °C</td><td>−183 °C</td></tr>
          </tbody>
        </table>
        <div className="karten">
          <div className="karte"><h5>Schmelzen</h5><p>fest → flüssig</p></div>
          <div className="karte"><h5>Erstarren</h5><p>flüssig → fest</p></div>
          <div className="karte"><h5>Verdampfen</h5><p>flüssig → gas</p></div>
          <div className="karte"><h5>Kondensieren</h5><p>gas → flüssig</p></div>
          <div className="karte"><h5>Sublimieren</h5><p>fest → gas (z.B. Trockeneis)</p></div>
          <div className="karte"><h5>Resublimieren</h5><p>gas → fest (Raureif)</p></div>
        </div>
      </Sektion>

      <Sektion nr={4} titel="Wärmeübertragung — drei Wege">
        <div className="karten">
          <div className="karte"><h5>Wärmeleitung</h5><p>Wärme wandert durch festen Kontakt (Pfanne, Heizung)</p></div>
          <div className="karte"><h5>Konvektion</h5><p>Strömungen tragen die Wärme weiter (heiße Luft steigt auf)</p></div>
          <div className="karte"><h5>Wärmestrahlung</h5><p>Wärme als Infrarotstrahlung (Sonne, Lagerfeuer)</p></div>
        </div>
        <Joke>Warum wird der Mond nachts so kalt? Weil keine Atmosphäre da ist, die die Wärme behält. Auf der Erde sind wir lucky — wir haben eine wärmende Decke namens „Atmosphäre".</Joke>
      </Sektion>

      <Sektion nr={5} titel="Längen- und Volumenausdehnung">
        <p>Beim Erwärmen dehnen sich Stoffe aus. Brücken haben deshalb Dehnungsfugen.</p>
        <div className="formeln">
          <Formel name="Längenausdehnung" ausdruck={<>Δl = α · l<sub>0</sub> · ΔT</>} hinweis="α = Längenausdehnungs­koeffizient" />
          <Formel name="Volumenausdehnung" ausdruck={<>ΔV = γ · V<sub>0</sub> · ΔT</>} hinweis="γ ≈ 3 · α" />
        </div>
        <Beispiel aufgabe={<>Brücke 100 m, α = 12·10⁻⁶ /K. Wie viel länger bei 30 K Erwärmung?</>}
          schritte={[<>Δl = 12·10⁻⁶ · 100 · 30 = <b>0,036 m = 3,6 cm</b></>]} />
      </Sektion>

      <Sektion nr={6} titel="Gasgesetze">
        <div className="formeln">
          <Formel name="Boyle-Mariotte" ausdruck={<>p · V = const.</>} hinweis="bei konstantem T" />
          <Formel name="Gay-Lussac" ausdruck={<>V/T = const.</>} hinweis="bei konstantem p" />
          <Formel name="Amontons" ausdruck={<>p/T = const.</>} hinweis="bei konstantem V" />
          <Formel name="Allgemeine Gasgleichung" ausdruck={<>p · V / T = const.</>} />
        </div>
        <Beispiel aufgabe={<>Gasballon bei 0 °C hat Volumen 1 L. Bei 100 °C?</>}
          schritte={[<>V₁/T₁ = V₂/T₂ → 1/273 = V₂/373</>, <>V₂ ≈ <b>1,37 L</b></>]} />
      </Sektion>

      <Sektion nr={7} titel="Energieerhaltung und Hauptsätze">
        <div className="merke"><b>1. Hauptsatz der Wärmelehre:</b> Energie geht nie verloren, sie wird nur umgewandelt. Du kannst keine Maschine bauen, die mehr Energie ausspuckt, als sie reinkriegt.</div>
        <div className="merke"><b>2. Hauptsatz:</b> Wärme fließt freiwillig immer von WARM nach KALT — nie umgekehrt. Deshalb braucht der Kühlschrank Strom.</div>
        <Joke>Niemand hat je ein Perpetuum Mobile gebaut. Wenn doch jemand eines verkauft, ist es Betrug — verbreite das gerne weiter.</Joke>
      </Sektion>

      <Sektion nr={8} titel="Übungen mit Lösungen">
        <Beispiel aufgabe={<>500 g Kupfer von 20°C auf 70°C erwärmen?</>}
          schritte={[<>Q = 385 · 0,5 · 50 = <b>9 625 J</b></>]} />
        <Beispiel aufgabe={<>Rechne 25 °C in Kelvin um.</>} schritte={[<>= 25 + 273,15 = <b>298,15 K</b></>]} />
        <Beispiel aufgabe={<>Bei 273 K → wie viel °C?</>} schritte={[<>= 273 − 273,15 ≈ <b>0 °C</b></>]} />
      </Sektion>

      <p style={{ textAlign: "center", marginTop: "30px", color: "#6e6e73", fontSize: "14px" }}>Du verstehst jetzt Wärme — und warum die Heizung manchmal mehr kostet als der Urlaub. — Anna</p>
    </div>
  );
}
