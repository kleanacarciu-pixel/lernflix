"use client";
import { SHARED_STIL, Sektion, Formel, Beispiel, Joke, Hook } from "./_helfer";

export function InhaltGleichungen() {
  return (
    <div className="mat">
      <style>{SHARED_STIL("#ff9500", "#fff7ef", "#fff0db")}</style>

      <Hook><b>Gleichungen sind Rätsel mit Buchstaben.</b> Da steht ein x, und du sollst rausfinden, was es bedeutet. Die gute Nachricht: das x will immer dasselbe — allein sein. Dein Job ist, ihm dabei zu helfen.</Hook>

      <Sektion nr={1} titel="Terme — die Bausteine">
        <p>Ein <b>Term</b> ist ein mathematischer Ausdruck mit Zahlen, Buchstaben und Rechenzeichen — aber <b>ohne</b> Gleichheitszeichen. Z.B. 3x + 5 oder 2(a − b).</p>
        <p>Eine <b>Variable</b> (meistens x) ist ein Platzhalter für eine unbekannte Zahl.</p>
        <h3>Terme vereinfachen</h3>
        <div className="formeln">
          <Formel name="Gleichartige Terme" ausdruck={<>3x + 5x = 8x</>} hinweis="nur mit gleicher Variable" />
          <Formel name="Verschiedene" ausdruck={<>3x + 5y bleibt 3x + 5y</>} hinweis="kann man nicht zusammenfassen" />
          <Formel name="Klammern auflösen (+)" ausdruck={<>a + (b + c) = a + b + c</>} />
          <Formel name="Klammern auflösen (−)" ausdruck={<>a − (b + c) = a − b − c</>} hinweis="Vorzeichen wechseln!" />
          <Formel name="Mit Faktor" ausdruck={<>a · (b + c) = a·b + a·c</>} hinweis="Distributivgesetz" />
        </div>
        <Beispiel aufgabe={<>Vereinfache: 3x + 2 − (x − 5)</>}
          schritte={[<>Klammer öffnen, Vorzeichen wechseln: 3x + 2 − x + 5</>, <>= <b>2x + 7</b></>]} />
        <Joke>Wenn du gleichartige Terme zusammenfasst, ist das wie beim Kühlschrank aufräumen: Eier zu Eiern, Joghurt zu Joghurt. Das x bleibt mit dem x, das y mit dem y. Eier mit Joghurt mischen will keiner.</Joke>
      </Sektion>

      <Sektion nr={2} titel="Lineare Gleichungen — die einfachsten">
        <p>Eine <b>lineare Gleichung</b> sieht so aus: ax + b = c. Das x kommt nur einmal vor und nicht hochgehoben. Du musst nur das x „freistellen".</p>
        <h3>Die goldene Regel</h3>
        <div className="merke"><b>WICHTIG:</b> Was du auf der einen Seite machst, musst du auch auf der anderen Seite machen. Wie eine Waage: kommt links was weg, muss rechts auch was weg. Sonst kippt sie.</div>
        <figure className="fig">
          <div>
            <svg width="340" height="220" viewBox="0 0 340 220">
              <rect x="160" y="180" width="20" height="20" fill="#1d1d1f"/>
              <polygon points="140,180 200,180 170,150" fill="#1d1d1f"/>
              <line x1="170" y1="150" x2="170" y2="100" stroke="#1d1d1f" strokeWidth="3"/>
              <line x1="40" y1="100" x2="300" y2="100" stroke="#ff9500" strokeWidth="4"/>
              <line x1="60" y1="100" x2="60" y2="120" stroke="#1d1d1f" strokeWidth="1.5"/>
              <line x1="100" y1="100" x2="100" y2="120" stroke="#1d1d1f" strokeWidth="1.5"/>
              <line x1="60" y1="120" x2="100" y2="120" stroke="#1d1d1f" strokeWidth="1.5"/>
              <ellipse cx="80" cy="130" rx="32" ry="10" fill="#fef3c7" stroke="#ff9500" strokeWidth="2"/>
              <text x="62" y="135" fontSize="16" fontWeight="700" fill="#1d1d1f">3x+5</text>
              <line x1="240" y1="100" x2="240" y2="120" stroke="#1d1d1f" strokeWidth="1.5"/>
              <line x1="280" y1="100" x2="280" y2="120" stroke="#1d1d1f" strokeWidth="1.5"/>
              <line x1="240" y1="120" x2="280" y2="120" stroke="#1d1d1f" strokeWidth="1.5"/>
              <ellipse cx="260" cy="130" rx="32" ry="10" fill="#fef3c7" stroke="#ff9500" strokeWidth="2"/>
              <text x="252" y="135" fontSize="16" fontWeight="700" fill="#1d1d1f">20</text>
              <text x="155" y="40" fontSize="14" fontWeight="700" fill="#1d1d1f">=</text>
            </svg>
            <figcaption>Eine Gleichung ist wie eine Waage im Gleichgewicht</figcaption>
          </div>
        </figure>
        <h3>Vorgehen</h3>
        <ol style={{ marginLeft: "20px" }}>
          <li>Klammern auflösen</li>
          <li>Brüche wegmultiplizieren</li>
          <li>Gleichartige Terme zusammenfassen</li>
          <li>x auf eine Seite, Zahlen auf die andere</li>
          <li>Durch Faktor vor dem x teilen</li>
        </ol>
        <Beispiel aufgabe={<>Löse 3x + 5 = 20.</>}
          schritte={[<>5 abziehen: 3x = 15</>, <>Durch 3 teilen: <b>x = 5</b></>]} />
        <Beispiel aufgabe={<>Löse 2(x − 4) = x + 6.</>}
          schritte={[<>Klammer auflösen: 2x − 8 = x + 6</>, <>x von rechts abziehen: x − 8 = 6</>, <>+8: <b>x = 14</b></>]} />
        <Beispiel aufgabe={<>Löse x/4 + 3 = 7.</>}
          schritte={[<>−3: x/4 = 4</>, <>·4: <b>x = 16</b></>]} />
        <div className="tipp"><b>Probe machen!</b> Setze deine Lösung in die Ursprungsgleichung ein. Wenn beide Seiten gleich sind, ist x richtig.</div>
      </Sektion>

      <Sektion nr={3} titel="Bruchgleichungen">
        <p>Wenn das x im Nenner steht (oder ein anderer Bruch), <b>multiplizierst du zuerst alles mit dem Hauptnenner</b>.</p>
        <Beispiel aufgabe={<>Löse 6/x = 3.</>}
          schritte={[<>· x: 6 = 3x</>, <>: 3: <b>x = 2</b></>]} />
        <Beispiel aufgabe={<>Löse 1/(x+2) = 1/3.</>}
          schritte={[<>Über Kreuz: 3 = x + 2</>, <>−2: <b>x = 1</b></>]} />
        <div className="merke"><b>Achtung:</b> Werte, die den Nenner null machen, sind <b>nicht erlaubt</b>. Z.B. bei 1/(x−5) darf x nicht 5 sein.</div>
      </Sektion>

      <Sektion nr={4} titel="Gleichungssysteme — zwei Gleichungen, zwei Unbekannte">
        <p>Wenn du <b>zwei Variablen</b> (x und y) hast, brauchst du auch zwei Gleichungen. Es gibt drei Methoden:</p>
        <h3>1. Einsetzungsverfahren</h3>
        <p>Eine Gleichung nach x oder y umstellen und in die andere einsetzen.</p>
        <Beispiel aufgabe={<>I: x + y = 5 &nbsp;&nbsp;II: 2x − y = 4</>}
          schritte={[<>I nach y: y = 5 − x</>, <>In II: 2x − (5 − x) = 4 → 3x − 5 = 4 → x = 3</>, <>y = 5 − 3 = 2 → <b>x = 3, y = 2</b></>]} />
        <h3>2. Gleichsetzungsverfahren</h3>
        <p>Beide nach y umstellen, dann gleichsetzen.</p>
        <h3>3. Additionsverfahren</h3>
        <p>Eine Variable durch Addieren/Subtrahieren beider Gleichungen wegbekommen.</p>
        <Beispiel aufgabe={<>I: x + y = 10 &nbsp;&nbsp;II: x − y = 4</>}
          schritte={[<>Addieren: 2x = 14 → x = 7</>, <>y = 10 − 7 = 3 → <b>x = 7, y = 3</b></>]} />
        <Joke>Lehrer fragt: „Wie löst du Gleichungssysteme?" Schüler: „Mit Liebe und Geduld." Lehrer: „Und Mathematik?" Schüler: „Das auch."</Joke>
      </Sektion>

      <Sektion nr={5} titel="Quadratische Gleichungen">
        <p>Hier steht das x <b>hochgehoben mit 2</b>. Gleichungen der Form ax² + bx + c = 0.</p>
        <figure className="fig">
          <div>
            <svg width="280" height="200" viewBox="0 0 280 200">
              <line x1="20" y1="120" x2="260" y2="120" stroke="#1d1d1f" strokeWidth="1.5"/>
              <line x1="140" y1="20" x2="140" y2="185" stroke="#1d1d1f" strokeWidth="1.5"/>
              <text x="263" y="135" fontSize="11" fill="#6e6e73">x</text>
              <text x="146" y="20" fontSize="11" fill="#6e6e73">y</text>
              <polyline points="60,40 80,75 100,100 120,115 140,120 160,115 180,100 200,75 220,40" fill="none" stroke="#ff9500" strokeWidth="3"/>
              <circle cx="100" cy="120" r="6" fill="#ff9500"/>
              <circle cx="180" cy="120" r="6" fill="#ff9500"/>
              <text x="86" y="142" fontSize="13" fontWeight="700" fill="#ff9500">x₁</text>
              <text x="172" y="142" fontSize="13" fontWeight="700" fill="#ff9500">x₂</text>
            </svg>
            <figcaption>Nullstellen x₁ und x₂ sind dort, wo die Parabel die x-Achse kreuzt</figcaption>
          </div>
        </figure>
        <h3>Spezialfälle (ohne Formel)</h3>
        <div className="formeln">
          <Formel name="Reine quadratische" ausdruck={<>x² = a ⇒ x = ±√a</>} hinweis="zwei Lösungen!" />
          <Formel name="Ohne c" ausdruck={<>x² + bx = 0 ⇒ x(x+b) = 0</>} hinweis="x = 0 oder x = −b" />
        </div>
        <h3>Die pq-Formel (Normalform x² + px + q = 0)</h3>
        <div className="gross">x<sub>1,2</sub> = −p/2 ± √((p/2)² − q)</div>
        <Beispiel aufgabe={<>Löse x² + 4x + 3 = 0.</>}
          schritte={[<>p = 4, q = 3</>, <>x = −2 ± √(4 − 3) = −2 ± 1</>, <>x₁ = <b>−1</b>, x₂ = <b>−3</b></>]} />
        <h3>Die Mitternachtsformel (Allgemeinform ax² + bx + c = 0)</h3>
        <div className="gross">x<sub>1,2</sub> = (−b ± √(b² − 4ac)) / (2a)</div>
        <div className="formeln">
          <Formel name="Diskriminante" ausdruck={<>D = b² − 4ac</>} hinweis="entscheidet über Lösungen" />
        </div>
        <div className="karten">
          <div className="karte"><h5>D &gt; 0</h5><p>zwei Lösungen</p></div>
          <div className="karte"><h5>D = 0</h5><p>eine (Doppel-)Lösung</p></div>
          <div className="karte"><h5>D &lt; 0</h5><p>keine reelle Lösung</p></div>
        </div>
        <Beispiel aufgabe={<>Löse 2x² + 5x − 3 = 0.</>}
          schritte={[<>a=2, b=5, c=−3 → D = 25 + 24 = 49</>, <>x = (−5 ± 7) / 4</>, <>x₁ = <b>0,5</b>, x₂ = <b>−3</b></>]} />
        <div className="tipp"><b>Mitternachtsformel-Eselsbrücke:</b> heißt so, weil du sie auch um Mitternacht aus dem Tiefschlaf aufsagen können sollst.</div>
        <Joke>Bei der pq-Formel kommt das p von „Plus-Faktor" und das q von „Quergedacht". Klingt erfunden? Ist es auch — eigentlich kommen sie einfach aus der Gleichung x² + p·x + q = 0.</Joke>
      </Sektion>

      <Sektion nr={6} titel="Ungleichungen">
        <p>Wie Gleichungen, aber mit &lt;, &gt;, ≤ oder ≥. Die Regeln sind fast gleich — mit einer großen Ausnahme:</p>
        <div className="merke"><b>WICHTIG!</b> Wenn du mit einer <b>negativen Zahl</b> multiplizierst oder teilst, dreht sich das Ungleichheitszeichen um. Aus &lt; wird &gt; und umgekehrt.</div>
        <Beispiel aufgabe={<>Löse 2x + 4 &lt; 10.</>}
          schritte={[<>−4: 2x &lt; 6</>, <>:2: <b>x &lt; 3</b></>]} />
        <Beispiel aufgabe={<>Löse −3x ≥ 12.</>}
          schritte={[<>:(−3), Zeichen drehen: <b>x ≤ −4</b></>]} />
      </Sektion>

      <Sektion nr={7} titel="Übungen mit Lösungen">
        <Beispiel aufgabe={<>4x − 7 = 13</>} schritte={[<>4x = 20 → <b>x = 5</b></>]} />
        <Beispiel aufgabe={<>3(x + 2) = 18</>} schritte={[<>3x + 6 = 18 → 3x = 12 → <b>x = 4</b></>]} />
        <Beispiel aufgabe={<>x/3 − 2 = 4</>} schritte={[<>x/3 = 6 → <b>x = 18</b></>]} />
        <Beispiel aufgabe={<>x² − 9 = 0</>} schritte={[<>x² = 9 → <b>x = ±3</b></>]} />
        <Beispiel aufgabe={<>x² + 6x + 8 = 0 (pq)</>}
          schritte={[<>x = −3 ± √(9 − 8) = −3 ± 1</>, <>x₁ = <b>−2</b>, x₂ = <b>−4</b></>]} />
      </Sektion>

      <p style={{ textAlign: "center", marginTop: "30px", color: "#6e6e73", fontSize: "14px" }}>Du kannst jetzt das x finden — auch wenn es sich versteckt. — Anna</p>
    </div>
  );
}
