"use client";
import { SHARED_STIL, Sektion, Formel, Beispiel, Joke, Hook } from "./_helfer";

export function InhaltFunktionen() {
  return (
    <div className="mat">
      <style>{SHARED_STIL("#5856d6", "#f3f0ff", "#e9e3ff")}</style>

      <Hook><b>Eine Funktion ist eine Maschine.</b> Du steckst eine Zahl rein (x), sie spuckt eine andere Zahl raus (y). Welche Zahl rauskommt, hängt davon ab, was für eine Maschine du gerade hast. Klingt easy? Ist es auch.</Hook>

      <Sektion nr={1} titel="Was ist eine Funktion?">
        <p>Eine Funktion ist eine Vorschrift, die jedem x-Wert <b>genau einen</b> y-Wert zuordnet. Geschrieben als <b>f(x)</b> oder <b>y = …</b>.</p>
        <div className="gross">y = f(x) → x rein, y raus</div>
        <p>Das Bild einer Funktion im Koordinatensystem heißt <b>Graph</b>.</p>
        <Joke>Funktionen sind wie Snack-Automaten: du wirfst was rein (eine Zahl + Geld), bekommst was raus (eine Zahl + Schokoriegel). Bei Mathe ohne Schoki — leider.</Joke>
      </Sektion>

      <Sektion nr={2} titel="Lineare Funktionen — die geraden Linien">
        <p>Eine <b>lineare Funktion</b> hat die Form <b>y = m·x + b</b>. Ihr Graph ist immer eine <b>gerade Linie</b>.</p>
        <figure className="fig">
          <div>
            <svg width="280" height="200" viewBox="0 0 280 200">
              <line x1="20" y1="160" x2="260" y2="160" stroke="#1d1d1f" strokeWidth="1.5"/>
              <polygon points="255,156 262,160 255,164" fill="#1d1d1f"/>
              <line x1="140" y1="20" x2="140" y2="180" stroke="#1d1d1f" strokeWidth="1.5"/>
              <polygon points="136,25 140,18 144,25" fill="#1d1d1f"/>
              {[-3, -2, -1, 1, 2, 3].map((x) => (<g key={`x${x}`}><line x1={140 + x * 20} y1="158" x2={140 + x * 20} y2="162" stroke="#1d1d1f" strokeWidth="1"/><text x={140 + x * 20 - 4} y="175" fontSize="10" fill="#6e6e73">{x}</text></g>))}
              {[1, 2, 3, 4, 5, 6].map((y) => (<g key={`y${y}`}><line x1="138" y1={160 - y * 20} x2="142" y2={160 - y * 20} stroke="#1d1d1f" strokeWidth="1"/><text x="124" y={163 - y * 20} fontSize="10" fill="#6e6e73">{y}</text></g>))}
              <text x="263" y="174" fontSize="11" fill="#6e6e73">x</text>
              <text x="146" y="20" fontSize="11" fill="#6e6e73">y</text>
              <line x1="60" y1="180" x2="240" y2="0" stroke="#5856d6" strokeWidth="3"/>
              <circle cx="140" cy="120" r="5" fill="#5856d6"/>
              <text x="148" y="118" fontSize="12" fontWeight="700" fill="#5856d6">b = 2</text>
              <text x="180" y="65" fontSize="13" fontWeight="700" fill="#5856d6">y = x + 2</text>
            </svg>
            <figcaption>Lineare Funktion y = x + 2: Steigung m = 1, y-Achsenabschnitt b = 2</figcaption>
          </div>
        </figure>
        <div className="formeln">
          <Formel name="Allgemeine Form" ausdruck={<>y = m · x + b</>} hinweis="m = Steigung, b = y-Achsenabschnitt" />
          <Formel name="Steigung" ausdruck={<>m = (y₂ − y₁) / (x₂ − x₁)</>} hinweis="aus 2 Punkten" />
          <Formel name="Nullstelle" ausdruck={<>x₀ = −b / m</>} hinweis="dort schneidet die Linie die x-Achse" />
        </div>
        <h3>Was bedeutet was?</h3>
        <div className="karten">
          <div className="karte"><h5>Steigung m</h5><p>Wie schräg die Linie ist. m &gt; 0: steigt. m &lt; 0: fällt. m = 0: waagerecht.</p></div>
          <div className="karte"><h5>y-Achsenabschnitt b</h5><p>Wo die Linie die y-Achse schneidet. Der „Startpunkt".</p></div>
          <div className="karte"><h5>Nullstelle</h5><p>Wo die Linie die x-Achse schneidet (y = 0).</p></div>
        </div>
        <Beispiel aufgabe={<>Gegeben f(x) = 2x − 4. Bestimme Steigung, y-Achsenabschnitt und Nullstelle.</>}
          schritte={[<>Steigung m = <b>2</b> (geht steil nach oben)</>, <>y-Achsenabschnitt b = <b>−4</b></>, <>Nullstelle: 0 = 2x − 4 → <b>x = 2</b></>]} />
        <Beispiel aufgabe={<>Gerade durch A(1|3) und B(5|11). Stelle die Funktion auf.</>}
          schritte={[<>m = (11 − 3)/(5 − 1) = 8/4 = 2</>, <>3 = 2·1 + b → b = 1</>, <>f(x) = <b>2x + 1</b></>]} />
        <div className="tipp"><b>Tipp:</b> Wenn die Linie sehr steil ist, ist m groß. Wenn sie flach ist, ist m klein. Negative m bedeutet: von links nach rechts gehst du bergab.</div>
      </Sektion>

      <Sektion nr={3} titel="Lagebeziehungen zweier Geraden">
        <div className="karten">
          <div className="karte"><h5>Parallel</h5><p>m₁ = m₂</p><p>Gleiche Steigung, kein Schnittpunkt</p></div>
          <div className="karte"><h5>Identisch</h5><p>m₁ = m₂ UND b₁ = b₂</p><p>Komplett dieselbe Linie</p></div>
          <div className="karte"><h5>Schneidend</h5><p>m₁ ≠ m₂</p><p>Genau ein Schnittpunkt</p></div>
          <div className="karte"><h5>Senkrecht</h5><p>m₁ · m₂ = −1</p><p>z.B. m₁ = 2, m₂ = −0,5</p></div>
        </div>
        <Beispiel aufgabe={<>Schnittpunkt von y = 2x + 1 und y = −x + 7?</>}
          schritte={[<>Gleichsetzen: 2x + 1 = −x + 7 → 3x = 6 → x = 2</>, <>y = 2·2 + 1 = 5</>, <>Schnittpunkt: <b>S(2 | 5)</b></>]} />
      </Sektion>

      <Sektion nr={4} titel="Quadratische Funktionen — die Parabeln">
        <p>Eine <b>quadratische Funktion</b> hat ein x², z.B. f(x) = x². Ihr Graph ist eine <b>Parabel</b> — sieht aus wie ein U.</p>
        <figure className="fig">
          <div>
            <svg width="280" height="200" viewBox="0 0 280 200">
              <line x1="20" y1="170" x2="260" y2="170" stroke="#1d1d1f" strokeWidth="1.5"/>
              <line x1="140" y1="20" x2="140" y2="185" stroke="#1d1d1f" strokeWidth="1.5"/>
              <polyline points="60,30 80,60 100,90 120,120 140,170 160,120 180,90 200,60 220,30" fill="none" stroke="#5856d6" strokeWidth="3"/>
              <circle cx="140" cy="170" r="5" fill="#ef4444"/>
              <text x="148" y="180" fontSize="12" fontWeight="700" fill="#ef4444">Scheitel</text>
              <text x="180" y="55" fontSize="13" fontWeight="700" fill="#5856d6">y = x²</text>
            </svg>
            <figcaption>y = x² · nach oben geöffnet (a &gt; 0)</figcaption>
          </div>
          <div>
            <svg width="280" height="200" viewBox="0 0 280 200">
              <line x1="20" y1="30" x2="260" y2="30" stroke="#1d1d1f" strokeWidth="1.5"/>
              <line x1="140" y1="15" x2="140" y2="180" stroke="#1d1d1f" strokeWidth="1.5"/>
              <polyline points="60,170 80,140 100,110 120,80 140,30 160,80 180,110 200,140 220,170" fill="none" stroke="#ef4444" strokeWidth="3"/>
              <circle cx="140" cy="30" r="5" fill="#5856d6"/>
              <text x="148" y="22" fontSize="12" fontWeight="700" fill="#5856d6">Scheitel</text>
              <text x="170" y="160" fontSize="13" fontWeight="700" fill="#ef4444">y = −x²</text>
            </svg>
            <figcaption>y = −x² · nach unten geöffnet (a &lt; 0)</figcaption>
          </div>
        </figure>
        <div className="formeln">
          <Formel name="Normalform" ausdruck={<>f(x) = ax² + bx + c</>} />
          <Formel name="Scheitelform" ausdruck={<>f(x) = a(x − d)² + e</>} hinweis="Scheitel bei S(d|e)" />
          <Formel name="Nullstellen (pq)" ausdruck={<>x = −p/2 ± √((p/2)² − q)</>} hinweis="aus x² + px + q = 0" />
          <Formel name="Scheitel berechnen" ausdruck={<>x<sub>S</sub> = −b / (2a)</>} hinweis="für ax² + bx + c" />
        </div>
        <h3>Was bedeutet a?</h3>
        <div className="karten">
          <div className="karte"><h5>a &gt; 0</h5><p>Parabel offen nach oben (U)</p></div>
          <div className="karte"><h5>a &lt; 0</h5><p>Parabel offen nach unten (umgedrehtes U)</p></div>
          <div className="karte"><h5>|a| &gt; 1</h5><p>schmaler/steiler</p></div>
          <div className="karte"><h5>|a| &lt; 1</h5><p>breiter/flacher</p></div>
        </div>
        <Beispiel aufgabe={<>Bestimme den Scheitel von f(x) = x² − 6x + 5.</>}
          schritte={[<>x<sub>S</sub> = −(−6) / (2·1) = 3</>, <>f(3) = 9 − 18 + 5 = −4</>, <>Scheitel: <b>S(3 | −4)</b></>]} />
        <Beispiel aufgabe={<>Nullstellen von f(x) = x² − 5x + 6.</>}
          schritte={[<>p = −5, q = 6</>, <>x = 2,5 ± √(6,25 − 6) = 2,5 ± 0,5</>, <>x₁ = <b>3</b>, x₂ = <b>2</b></>]} />
        <Joke>Eine Parabel sitzt im Park. Kommt jemand vorbei und fragt: „Bist du depressiv?" Sagt die Parabel: „Hängt davon ab — kommt drauf an, ob mein a positiv oder negativ ist."</Joke>
      </Sektion>

      <Sektion nr={5} titel="Spezielle Funktionen kurz vorgestellt">
        <h3>Exponentialfunktion</h3>
        <div className="formeln">
          <Formel name="Allgemein" ausdruck={<>f(x) = a · b<sup>x</sup></>} hinweis="b &gt; 0, ≠ 1" />
        </div>
        <p>Wachstum (b &gt; 1) oder Zerfall (b &lt; 1). Geht extrem schnell hoch (oder runter).</p>
        <h3>Wurzelfunktion</h3>
        <div className="formeln">
          <Formel name="Allgemein" ausdruck={<>f(x) = √x</>} hinweis="nur für x ≥ 0" />
        </div>
        <h3>Hyperbel</h3>
        <div className="formeln">
          <Formel name="Allgemein" ausdruck={<>f(x) = a / x</>} hinweis="x ≠ 0" />
        </div>
        <h3>Trigonometrische Funktionen</h3>
        <div className="formeln">
          <Formel name="Sinus" ausdruck={<>f(x) = sin(x)</>} hinweis="Welle, Wert zwischen −1 und 1" />
          <Formel name="Kosinus" ausdruck={<>f(x) = cos(x)</>} />
          <Formel name="Tangens" ausdruck={<>f(x) = tan(x)</>} hinweis="hat Sprungstellen!" />
        </div>
      </Sektion>

      <Sektion nr={6} titel="Funktionen — was du noch wissen musst">
        <h3>Symmetrie</h3>
        <div className="karten">
          <div className="karte"><h5>Achsensymmetrisch</h5><p>f(−x) = f(x). Z.B. x² (gespiegelt an y-Achse)</p></div>
          <div className="karte"><h5>Punktsymmetrisch</h5><p>f(−x) = −f(x). Z.B. x³ (gespiegelt am Ursprung)</p></div>
        </div>
        <h3>Monotonie</h3>
        <div className="karten">
          <div className="karte"><h5>steigend</h5><p>Werte werden größer</p></div>
          <div className="karte"><h5>fallend</h5><p>Werte werden kleiner</p></div>
          <div className="karte"><h5>konstant</h5><p>Werte ändern sich nicht</p></div>
        </div>
        <h3>Extremstellen</h3>
        <p>Höhepunkte (<b>Maxima</b>) und Tiefpunkte (<b>Minima</b>) einer Funktion. Findest du z.B. mit der Ableitung.</p>
      </Sektion>

      <Sektion nr={7} titel="Übungen mit Lösungen">
        <Beispiel aufgabe={<>Gerade durch (0|3) mit Steigung −2.</>} schritte={[<>= <b>y = −2x + 3</b></>]} />
        <Beispiel aufgabe={<>Nullstelle von y = 3x − 9.</>} schritte={[<>0 = 3x − 9 → <b>x = 3</b></>]} />
        <Beispiel aufgabe={<>Schnittpunkt von y = x + 2 und y = 2x − 1.</>}
          schritte={[<>x + 2 = 2x − 1 → x = 3</>, <>y = 5 → <b>S(3|5)</b></>]} />
        <Beispiel aufgabe={<>Scheitel von y = (x − 2)² + 5.</>} schritte={[<>Direkt aus Scheitelform: <b>S(2|5)</b></>]} />
        <Beispiel aufgabe={<>Nullstellen von y = x² − 4.</>} schritte={[<>x² = 4 → <b>x = ±2</b></>]} />
      </Sektion>

      <p style={{ textAlign: "center", marginTop: "30px", color: "#6e6e73", fontSize: "14px" }}>Du erkennst jetzt Geraden, Parabeln und Co. auf einen Blick. — Anna</p>
    </div>
  );
}
