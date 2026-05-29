"use client";
import { SHARED_STIL, Sektion, Formel, Beispiel, Joke, Hook } from "./_helfer";

export function InhaltTrigonometrie() {
  return (
    <div className="mat">
      <style>{SHARED_STIL("#06b6d4", "#ecfeff", "#cffafe")}</style>

      <Hook><b>Trigonometrie klingt schwierig, ist aber gar nicht so wild.</b> Du musst dir nur drei Wörter merken: Sinus, Kosinus, Tangens. Der Rest sind kleine Tricks. Mit denen kannst du sogar Bäume vermessen, ohne hochzuklettern. Wirklich.</Hook>

      <Sektion nr={1} titel="Sinus, Kosinus, Tangens — die Stars">
        <p>Im <b>rechtwinkligen Dreieck</b> verbindet Trigonometrie Seiten und Winkel. Bezogen auf einen Winkel α:</p>
        <figure className="fig">
          <div>
            <svg width="280" height="200" viewBox="0 0 280 200">
              <polygon points="40,170 240,170 240,40" fill="#cffafe" stroke="#06b6d4" strokeWidth="2.5"/>
              <rect x="226" y="156" width="14" height="14" fill="none" stroke="#06b6d4" strokeWidth="2"/>
              <path d="M 80 170 A 40 40 0 0 0 70 141" stroke="#ef4444" strokeWidth="2" fill="none"/>
              <text x="72" y="158" fontSize="14" fontWeight="700" fill="#ef4444">α</text>
              <text x="125" y="190" fontSize="13" fontWeight="700">Ankathete</text>
              <text x="248" y="115" fontSize="13" fontWeight="700">Gegen­kathete</text>
              <text x="110" y="100" fontSize="13" fontWeight="700" fill="#ef4444">Hypotenuse</text>
            </svg>
            <figcaption>Bezeichnungen im rechtwinkligen Dreieck, bezogen auf α</figcaption>
          </div>
        </figure>
        <div className="karten">
          <div className="karte"><h5>Hypotenuse</h5><p>Die längste Seite, gegenüber dem rechten Winkel</p></div>
          <div className="karte"><h5>Gegenkathete</h5><p>Die Seite gegenüber von α</p></div>
          <div className="karte"><h5>Ankathete</h5><p>Die Seite, die an α anliegt (aber nicht die Hypotenuse)</p></div>
        </div>
        <div className="formeln">
          <Formel name="Sinus" ausdruck={<>sin(α) = Gegenkathete / Hypotenuse</>} />
          <Formel name="Kosinus" ausdruck={<>cos(α) = Ankathete / Hypotenuse</>} />
          <Formel name="Tangens" ausdruck={<>tan(α) = Gegenkathete / Ankathete</>} />
        </div>
        <div className="tipp"><b>Eselsbrücke (GAGA HUDI):</b><br />sin = <b>G</b>egenkathete / <b>H</b>ypotenuse → „GH"<br />cos = <b>A</b>nkathete / <b>H</b>ypotenuse → „AH"<br />tan = <b>G</b>egenkathete / <b>A</b>nkathete → „GA"<br />Oder: <b>GAGA HUDI</b> — GegenAnkathete ÜberHypotenuseUndDieAnkatheteIstUnten. Klingt blöd, sitzt für immer.</div>
        <Joke>Tangens ohne Ankathete ist wie ein Burger ohne Brötchen — kannst du machen, ergibt aber Chaos (Sprung gegen Unendlich bei 90°).</Joke>
      </Sektion>

      <Sektion nr={2} titel="Wichtige Werte auswendig">
        <table>
          <thead><tr><th>Winkel</th><th>sin</th><th>cos</th><th>tan</th></tr></thead>
          <tbody>
            <tr><td>0°</td><td>0</td><td>1</td><td>0</td></tr>
            <tr><td>30°</td><td>0,5</td><td>√3/2 ≈ 0,87</td><td>√3/3 ≈ 0,58</td></tr>
            <tr><td>45°</td><td>√2/2 ≈ 0,71</td><td>√2/2 ≈ 0,71</td><td>1</td></tr>
            <tr><td>60°</td><td>√3/2 ≈ 0,87</td><td>0,5</td><td>√3 ≈ 1,73</td></tr>
            <tr><td>90°</td><td>1</td><td>0</td><td>nicht definiert</td></tr>
          </tbody>
        </table>
        <div className="tipp"><b>Merkhilfe für sin:</b> 0°, 30°, 45°, 60°, 90° → √0/2, √1/2, √2/2, √3/2, √4/2. Genial einfach! Und cos läuft genauso, nur rückwärts.</div>
      </Sektion>

      <Sektion nr={3} titel="Trigonometrische Identitäten">
        <div className="formeln">
          <Formel name="Pythagoras" ausdruck={<>sin²(α) + cos²(α) = 1</>} hinweis="immer wahr" />
          <Formel name="Tangens" ausdruck={<>tan(α) = sin(α) / cos(α)</>} />
          <Formel name="Symmetrien" ausdruck={<>sin(−α) = −sin(α)</>} />
          <Formel name="Symmetrien" ausdruck={<>cos(−α) = cos(α)</>} />
          <Formel name="Komplementär" ausdruck={<>sin(90°−α) = cos(α)</>} />
          <Formel name="Komplementär" ausdruck={<>cos(90°−α) = sin(α)</>} />
        </div>
      </Sektion>

      <Sektion nr={4} titel="Im allgemeinen Dreieck: Sinussatz und Kosinussatz">
        <p>Funktionieren auch in Dreiecken <b>ohne rechten Winkel</b>.</p>
        <div className="formeln">
          <Formel name="Sinussatz" ausdruck={<>a/sin(α) = b/sin(β) = c/sin(γ)</>} hinweis="Seite/Sinus = überall gleich" />
          <Formel name="Kosinussatz für a" ausdruck={<>a² = b² + c² − 2bc·cos(α)</>} hinweis="erweiterter Pythagoras" />
          <Formel name="Kosinussatz allg." ausdruck={<>c² = a² + b² − 2ab·cos(γ)</>} />
        </div>
        <Beispiel aufgabe={<>Dreieck: a = 5, b = 7, γ = 50°. Berechne c.</>}
          schritte={[<>c² = 25 + 49 − 2·5·7·cos(50°)</>, <>cos(50°) ≈ 0,643</>, <>c² = 74 − 45 ≈ 29</>, <>c ≈ <b>5,4</b></>]} />
      </Sektion>

      <Sektion nr={5} titel="Trigonometrische Funktionen — die Wellen">
        <p>Wenn du sin(x) und cos(x) als <b>Graphen</b> zeichnest, bekommst du Wellen. Hin und her und hin und her.</p>
        <figure className="fig">
          <div>
            <svg width="380" height="180" viewBox="0 0 380 180">
              <line x1="20" y1="90" x2="370" y2="90" stroke="#1d1d1f" strokeWidth="1.5"/>
              <line x1="20" y1="20" x2="20" y2="170" stroke="#1d1d1f" strokeWidth="1.5"/>
              <polygon points="365,86 372,90 365,94" fill="#1d1d1f"/>
              <text x="362" y="108" fontSize="11" fill="#6e6e73">x</text>
              <text x="6" y="24" fontSize="11" fill="#6e6e73">y</text>
              <line x1="18" y1="40" x2="22" y2="40" stroke="#1d1d1f" strokeWidth="1"/>
              <text x="2" y="44" fontSize="10" fill="#6e6e73">1</text>
              <line x1="18" y1="140" x2="22" y2="140" stroke="#1d1d1f" strokeWidth="1"/>
              <text x="-2" y="144" fontSize="10" fill="#6e6e73">−1</text>
              <polyline fill="none" stroke="#06b6d4" strokeWidth="3" points={Array.from({ length: 71 }).map((_, i) => { const x = 20 + i * 5; const a = (i * 5) * (Math.PI * 2 / 160); const y = 90 - 50 * Math.sin(a); return `${x},${y.toFixed(1)}`; }).join(" ")}/>
              <polyline fill="none" stroke="#8b5cf6" strokeWidth="3" strokeDasharray="6,4" points={Array.from({ length: 71 }).map((_, i) => { const x = 20 + i * 5; const a = (i * 5) * (Math.PI * 2 / 160); const y = 90 - 50 * Math.cos(a); return `${x},${y.toFixed(1)}`; }).join(" ")}/>
              <text x="300" y="40" fontSize="13" fontWeight="700" fill="#06b6d4">sin(x)</text>
              <text x="300" y="60" fontSize="13" fontWeight="700" fill="#8b5cf6">cos(x)</text>
            </svg>
            <figcaption>Sinus (durchgezogen) und Kosinus (gestrichelt) — gleiche Welle, nur verschoben</figcaption>
          </div>
        </figure>
        <div className="formeln">
          <Formel name="Sinus-Welle" ausdruck={<>f(x) = a · sin(b·x + c) + d</>} />
          <Formel name="Amplitude" ausdruck={<>= |a|</>} hinweis="Höhe der Welle" />
          <Formel name="Periode" ausdruck={<>T = 2π / |b|</>} hinweis="wie lang ist eine ganze Welle" />
          <Formel name="Phasen­verschiebung" ausdruck={<>= −c / b</>} hinweis="wie weit nach rechts" />
          <Formel name="Mittellinie" ausdruck={<>y = d</>} hinweis="vertikal verschoben" />
        </div>
        <div className="karten">
          <div className="karte"><h5>sin(x)</h5><p>startet bei 0, geht hoch bis 1, runter bis −1. Periode: 2π</p></div>
          <div className="karte"><h5>cos(x)</h5><p>startet bei 1, sin nach links verschoben um 90°</p></div>
          <div className="karte"><h5>tan(x)</h5><p>geht in Sprüngen, hat Definitionslücken bei 90°, 270°...</p></div>
        </div>
      </Sektion>

      <Sektion nr={6} titel="Bogenmaß — der zweite Weg, Winkel zu messen">
        <p>Statt Grad benutzt man manchmal <b>Radiant (rad)</b>. Vorteil: viele Formeln werden schöner.</p>
        <div className="formeln">
          <Formel name="Umrechnung" ausdruck={<>180° = π rad</>} />
          <Formel name="Grad → Rad" ausdruck={<>x rad = α · π / 180°</>} />
          <Formel name="Rad → Grad" ausdruck={<>α = x · 180° / π</>} />
        </div>
        <table>
          <thead><tr><th>Grad</th><th>Bogenmaß</th></tr></thead>
          <tbody>
            <tr><td>0°</td><td>0</td></tr>
            <tr><td>30°</td><td>π/6</td></tr>
            <tr><td>45°</td><td>π/4</td></tr>
            <tr><td>60°</td><td>π/3</td></tr>
            <tr><td>90°</td><td>π/2</td></tr>
            <tr><td>180°</td><td>π</td></tr>
            <tr><td>360°</td><td>2π</td></tr>
          </tbody>
        </table>
      </Sektion>

      <Sektion nr={7} titel="Übungen mit Lösungen">
        <Beispiel aufgabe={<>Im rechtwinkl. Dreieck: c = 10, α = 30°. Wie lang ist die Gegenkathete a?</>}
          schritte={[<>sin(30°) = a/10</>, <>a = 10 · 0,5 = <b>5</b></>]} />
        <Beispiel aufgabe={<>Ankathete b = 8, Gegenkathete a = 6. Wie groß ist α?</>}
          schritte={[<>tan(α) = 6/8 = 0,75</>, <>α = arctan(0,75) ≈ <b>36,87°</b></>]} />
        <Beispiel aufgabe={<>Im Dreieck: a = 7, b = 9, γ = 60°. Berechne c (Kosinussatz).</>}
          schritte={[<>c² = 49 + 81 − 2·7·9·0,5 = 130 − 63 = 67</>, <>c ≈ <b>8,19</b></>]} />
        <Beispiel aufgabe={<>Rechne 120° in Bogenmaß um.</>}
          schritte={[<>120 · π / 180 = <b>2π/3</b></>]} />
      </Sektion>

      <p style={{ textAlign: "center", marginTop: "30px", color: "#6e6e73", fontSize: "14px" }}>Du beherrschst jetzt SinKosTan — auch ohne Taschenrechner-Magie! — Anna</p>
    </div>
  );
}
