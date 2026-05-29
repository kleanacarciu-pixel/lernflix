"use client";
import { SHARED_STIL, Sektion, Formel, Beispiel, Joke, Hook } from "./_helfer";

export function InhaltElektrizitaet() {
  return (
    <div className="mat">
      <style>{SHARED_STIL("#f59e0b", "#fef9ec", "#fef3c7")}</style>

      <Hook><b>Strom ist eigentlich nur „Elektronen, die rennen".</b> Stell dir Wasser im Schlauch vor: Spannung = Druck, Stromstärke = wie viel Wasser fließt, Widerstand = wie eng der Schlauch ist. Und Ohm hat dafür eine Formel geschrieben — Cooler Typ.</Hook>

      <Sektion nr={1} titel="Die Grundbegriffe">
        <div className="karten">
          <div className="karte"><h5>Spannung U</h5><p>Wie stark der Strom „drückt". Einheit: Volt (V)</p></div>
          <div className="karte"><h5>Stromstärke I</h5><p>Wie viel Strom pro Sekunde fließt. Einheit: Ampere (A)</p></div>
          <div className="karte"><h5>Widerstand R</h5><p>Wie sehr der Strom gebremst wird. Einheit: Ohm (Ω)</p></div>
          <div className="karte"><h5>Ladung Q</h5><p>Wie viele Elektronen geflossen sind. Einheit: Coulomb (C)</p></div>
        </div>
        <div className="formeln">
          <Formel name="Ladung" ausdruck={<>Q = I · t</>} hinweis="Stromstärke · Zeit" />
        </div>
      </Sektion>

      <Sektion nr={2} titel="Das Ohm'sche Gesetz — die wichtigste Formel">
        <div className="gross">U = R · I</div>
        <div className="formeln">
          <Formel name="Spannung" ausdruck={<>U = R · I</>} />
          <Formel name="Stromstärke" ausdruck={<>I = U / R</>} />
          <Formel name="Widerstand" ausdruck={<>R = U / I</>} />
        </div>
        <div className="tipp"><b>Eselsbrücke „URI":</b> Stell dir das Dreieck vor: oben U, unten links R, unten rechts I. Was du suchst, deckst du ab. Der Rest ergibt die Formel.</div>
        <Beispiel aufgabe={<>An einem Widerstand von 20 Ω liegt 12 V. Welche Stromstärke fließt?</>}
          schritte={[<>I = U / R = 12 / 20</>, <>= <b>0,6 A</b></>]} />
        <Joke>Sagt der Elektron zum Widerstand: „Lass mich durch!" Sagt der Widerstand: „Nur, wenn du Energie da lässt." Deshalb wird ein Widerstand warm — er kassiert ab.</Joke>
      </Sektion>

      <Sektion nr={3} titel="Reihenschaltung und Parallelschaltung">
        <figure className="fig">
          <div>
            <svg width="280" height="160" viewBox="0 0 280 160">
              <line x1="20" y1="80" x2="60" y2="80" stroke="#1d1d1f" strokeWidth="2"/>
              <rect x="60" y="70" width="40" height="20" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2"/>
              <line x1="100" y1="80" x2="140" y2="80" stroke="#1d1d1f" strokeWidth="2"/>
              <rect x="140" y="70" width="40" height="20" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2"/>
              <line x1="180" y1="80" x2="240" y2="80" stroke="#1d1d1f" strokeWidth="2"/>
              <line x1="20" y1="80" x2="20" y2="120" stroke="#1d1d1f" strokeWidth="2"/>
              <line x1="240" y1="80" x2="240" y2="120" stroke="#1d1d1f" strokeWidth="2"/>
              <line x1="20" y1="120" x2="100" y2="120" stroke="#1d1d1f" strokeWidth="2"/>
              <line x1="120" y1="120" x2="240" y2="120" stroke="#1d1d1f" strokeWidth="2"/>
              <line x1="100" y1="110" x2="100" y2="130" stroke="#1d1d1f" strokeWidth="3"/>
              <line x1="120" y1="115" x2="120" y2="125" stroke="#1d1d1f" strokeWidth="2"/>
              <text x="68" y="65" fontSize="11" fontWeight="700">R₁</text>
              <text x="148" y="65" fontSize="11" fontWeight="700">R₂</text>
              <text x="100" y="148" fontSize="11" fontWeight="700">U</text>
            </svg>
            <figcaption>Reihenschaltung: R₁ und R₂ hintereinander</figcaption>
          </div>
          <div>
            <svg width="280" height="160" viewBox="0 0 280 160">
              <line x1="20" y1="60" x2="80" y2="60" stroke="#1d1d1f" strokeWidth="2"/>
              <line x1="80" y1="40" x2="80" y2="100" stroke="#1d1d1f" strokeWidth="2"/>
              <line x1="80" y1="40" x2="140" y2="40" stroke="#1d1d1f" strokeWidth="2"/>
              <line x1="80" y1="100" x2="140" y2="100" stroke="#1d1d1f" strokeWidth="2"/>
              <rect x="140" y="30" width="40" height="20" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2"/>
              <rect x="140" y="90" width="40" height="20" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2"/>
              <line x1="180" y1="40" x2="200" y2="40" stroke="#1d1d1f" strokeWidth="2"/>
              <line x1="180" y1="100" x2="200" y2="100" stroke="#1d1d1f" strokeWidth="2"/>
              <line x1="200" y1="40" x2="200" y2="100" stroke="#1d1d1f" strokeWidth="2"/>
              <line x1="200" y1="60" x2="260" y2="60" stroke="#1d1d1f" strokeWidth="2"/>
              <line x1="20" y1="60" x2="20" y2="130" stroke="#1d1d1f" strokeWidth="2"/>
              <line x1="260" y1="60" x2="260" y2="130" stroke="#1d1d1f" strokeWidth="2"/>
              <line x1="20" y1="130" x2="130" y2="130" stroke="#1d1d1f" strokeWidth="2"/>
              <line x1="150" y1="130" x2="260" y2="130" stroke="#1d1d1f" strokeWidth="2"/>
              <line x1="130" y1="120" x2="130" y2="140" stroke="#1d1d1f" strokeWidth="3"/>
              <line x1="150" y1="125" x2="150" y2="135" stroke="#1d1d1f" strokeWidth="2"/>
              <text x="148" y="25" fontSize="11" fontWeight="700">R₁</text>
              <text x="148" y="125" fontSize="11" fontWeight="700">R₂</text>
            </svg>
            <figcaption>Parallelschaltung: R₁ und R₂ nebeneinander</figcaption>
          </div>
        </figure>
        <h3>Reihenschaltung (hintereinander)</h3>
        <div className="formeln">
          <Formel name="Stromstärke" ausdruck={<>I = I₁ = I₂ = …</>} hinweis="überall gleich" />
          <Formel name="Spannung" ausdruck={<>U<sub>ges</sub> = U₁ + U₂ + …</>} />
          <Formel name="Widerstand" ausdruck={<>R<sub>ges</sub> = R₁ + R₂ + …</>} />
        </div>
        <p className="erkl"><b>Falle:</b> Wenn eine Lampe in Reihe kaputt geht, gehen alle aus — wie bei alten Christbaumlichtern.</p>
        <h3>Parallelschaltung (nebeneinander)</h3>
        <div className="formeln">
          <Formel name="Spannung" ausdruck={<>U = U₁ = U₂ = …</>} hinweis="überall gleich" />
          <Formel name="Stromstärke" ausdruck={<>I<sub>ges</sub> = I₁ + I₂ + …</>} />
          <Formel name="Widerstand (2 Stück)" ausdruck={<>R<sub>ges</sub> = (R₁ · R₂) / (R₁ + R₂)</>} />
          <Formel name="Widerstand (allgemein)" ausdruck={<>1/R<sub>ges</sub> = 1/R₁ + 1/R₂ + …</>} />
        </div>
        <p className="erkl"><b>Vorteil:</b> Wenn eine Lampe parallel geht, leuchten die anderen weiter. Deshalb sind Steckdosen zuhause parallel.</p>
        <Beispiel aufgabe={<>Zwei Widerstände 6 Ω und 12 Ω parallel. Gesamtwiderstand?</>}
          schritte={[<>R = 6·12 / (6+12) = 72/18</>, <>= <b>4 Ω</b></>]} />
      </Sektion>

      <Sektion nr={4} titel="Elektrische Arbeit und Leistung">
        <div className="formeln">
          <Formel name="Leistung" ausdruck={<>P = U · I</>} hinweis="Watt (W)" />
          <Formel name="Leistung mit R" ausdruck={<>P = U² / R = I² · R</>} />
          <Formel name="Arbeit / Energie" ausdruck={<>W = P · t</>} hinweis="Joule oder kWh" />
          <Formel name="Arbeit" ausdruck={<>W = U · I · t</>} />
        </div>
        <div className="einheit"><b>1 kWh</b> (Kilowattstunde) = 1000 W · 3600 s = 3,6 Millionen Joule. Das, was du auf der Stromrechnung zahlst!</div>
        <Beispiel aufgabe={<>Eine Lampe 60 W brennt 5 Stunden. Strom kostet 30 ct/kWh.</>}
          schritte={[<>Energie = 60 W · 5 h = 300 Wh = 0,3 kWh</>, <>Kosten: 0,3 · 0,30 € = <b>9 Cent</b></>]} />
        <Beispiel aufgabe={<>Was kostet ein Föhn (2000 W), der 10 Minuten läuft? (30 ct/kWh)</>}
          schritte={[<>E = 2000 W · (10/60) h = 333 Wh ≈ 0,33 kWh</>, <>Kosten ≈ <b>10 ct</b></>]} />
      </Sektion>

      <Sektion nr={5} titel="Spezifischer Widerstand und Drähte">
        <div className="formeln">
          <Formel name="Drahtwiderstand" ausdruck={<>R = ρ · l / A</>} hinweis="ρ = spez. Widerstand, l = Länge, A = Querschnitt" />
        </div>
        <p>Längerer Draht = mehr Widerstand. Dickerer Draht = weniger Widerstand. Anderes Material = anderer ρ-Wert.</p>
        <table>
          <thead><tr><th>Material</th><th>ρ (Ω·mm²/m)</th></tr></thead>
          <tbody>
            <tr><td>Silber</td><td>0,016</td></tr>
            <tr><td>Kupfer</td><td>0,017</td></tr>
            <tr><td>Aluminium</td><td>0,028</td></tr>
            <tr><td>Eisen</td><td>0,1</td></tr>
            <tr><td>Konstantan</td><td>0,5</td></tr>
          </tbody>
        </table>
      </Sektion>

      <Sektion nr={6} titel="Gefahren des elektrischen Stroms">
        <div className="merke"><b>Sehr wichtig:</b> Elektrischer Strom kann den Körper ernsthaft verletzen. Schon ab ca. <b>50 mA</b> wird es richtig gefährlich. Deshalb: <b>niemals</b> mit nassen Händen an Steckdosen, kein Kabel öffnen ohne Erwachsene, kein Werkzeug in Steckdosen stecken.</div>
        <table>
          <thead><tr><th>Stromstärke</th><th>Wirkung</th></tr></thead>
          <tbody>
            <tr><td>unter 1 mA</td><td>kaum spürbar</td></tr>
            <tr><td>1–10 mA</td><td>Kribbeln, leichte Muskelreaktion</td></tr>
            <tr><td>10–50 mA</td><td>schmerzhafte Muskelverkrampfung</td></tr>
            <tr><td>über 50 mA</td><td>kann das Herz aus dem Takt bringen</td></tr>
          </tbody>
        </table>
        <div className="tipp"><b>Goldene Regel:</b> Wenn du dir nicht 100 % sicher bist, frag immer einen Erwachsenen. Strom sieht man nicht — deshalb ist Vorsicht so wichtig.</div>
      </Sektion>

      <Sektion nr={7} titel="Übungen mit Lösungen">
        <Beispiel aufgabe={<>U = 230 V, R = 100 Ω. I = ?</>} schritte={[<>I = 230/100 = <b>2,3 A</b></>]} />
        <Beispiel aufgabe={<>Lampe mit 60 W an 230 V. Stromstärke?</>}
          schritte={[<>I = P/U = 60/230 ≈ <b>0,26 A</b></>]} />
        <Beispiel aufgabe={<>3 gleiche 6-Ω-Widerstände parallel.</>}
          schritte={[<>1/R = 3 · 1/6 = 1/2</>, <>R = <b>2 Ω</b></>]} />
        <Beispiel aufgabe={<>Energie für TV 100 W, der 2 h läuft?</>}
          schritte={[<>E = 100 · 2 = 200 Wh = <b>0,2 kWh</b></>]} />
      </Sektion>

      <p style={{ textAlign: "center", marginTop: "30px", color: "#6e6e73", fontSize: "14px" }}>Du verstehst jetzt Strom — und die Stromrechnung! — Anna</p>
    </div>
  );
}
