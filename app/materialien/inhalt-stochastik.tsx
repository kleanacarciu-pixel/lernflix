"use client";
import { SHARED_STIL, Sektion, Formel, Beispiel, Joke, Hook } from "./_helfer";

export function InhaltStochastik() {
  return (
    <div className="mat">
      <style>{SHARED_STIL("#ec4899", "#fdf2f7", "#fce7f0")}</style>

      <Hook><b>Wahrscheinlichkeit ist Mathe mit Zufall.</b> Wie oft fällt eine Sechs? Wie oft regnet es im Juli? Wie oft ziehst du beim Mensch-ärgere-dich-nicht eine Sechs zum Rauskommen? Hier lernst du alles dazu.</Hook>

      <Sektion nr={1} titel="Was ist Wahrscheinlichkeit?">
        <p>Die <b>Wahrscheinlichkeit (P)</b> sagt, wie wahrscheinlich ein Ereignis ist. Sie liegt zwischen 0 (unmöglich) und 1 (sicher).</p>
        <div className="gross">P(A) = Anzahl günstige / Anzahl möglich</div>
        <figure className="fig">
          {[
            { n: 1, dots: [[50, 50]] },
            { n: 2, dots: [[30, 30], [70, 70]] },
            { n: 3, dots: [[30, 30], [50, 50], [70, 70]] },
            { n: 4, dots: [[30, 30], [70, 30], [30, 70], [70, 70]] },
            { n: 5, dots: [[30, 30], [70, 30], [50, 50], [30, 70], [70, 70]] },
            { n: 6, dots: [[30, 30], [70, 30], [30, 50], [70, 50], [30, 70], [70, 70]] },
          ].map((w) => (
            <div key={w.n}>
              <svg width="90" height="90" viewBox="0 0 100 100">
                <rect x="10" y="10" width="80" height="80" rx="14" fill={w.n === 4 ? "#ec4899" : "#fff"} opacity={w.n === 4 ? 0.25 : 1} stroke="#ec4899" strokeWidth="2.5"/>
                {w.dots.map(([x, y], i) => (<circle key={i} cx={x} cy={y} r="6" fill="#ec4899"/>))}
              </svg>
              <figcaption>{w.n === 4 ? "Die 4 = günstig" : ""}</figcaption>
            </div>
          ))}
        </figure>
        <p style={{ textAlign: "center", marginTop: "-6px", fontSize: "14px", color: "#6e6e73" }}>P(„Würfel zeigt 4") = 1 günstig / 6 möglich = <b>1/6 ≈ 16,7 %</b></p>
        <div className="karten">
          <div className="karte"><h5>P = 0</h5><p>unmöglich (z.B. „Würfel zeigt 7")</p></div>
          <div className="karte"><h5>P = 0,5</h5><p>50/50 (z.B. „Münze Kopf")</p></div>
          <div className="karte"><h5>P = 1</h5><p>sicher (z.B. „die Sonne geht morgen auf")</p></div>
        </div>
        <Beispiel aufgabe={<>P(„Würfel zeigt 6")?</>}
          schritte={[<>1 günstig (die 6), 6 mögliche Zahlen</>, <>= 1/6 ≈ <b>16,7 %</b></>]} />
        <Joke>„Es ist zu 50 % wahrscheinlich, dass ich morgen einen Drachen treffe." Mathematisch falsch — aber als Satz klingt es lustig.</Joke>
      </Sektion>

      <Sektion nr={2} titel="Mehrstufige Zufallsversuche">
        <p>Wenn du <b>nacheinander</b> mehrere Sachen machst (z.B. 2× würfeln), nutzt du ein <b>Baumdiagramm</b>.</p>
        <figure className="fig">
          <div>
            <svg width="320" height="200" viewBox="0 0 320 200">
              <circle cx="160" cy="30" r="12" fill="#ec4899" opacity="0.3" stroke="#ec4899" strokeWidth="2"/>
              <text x="155" y="35" fontSize="11" fontWeight="700">S</text>
              <line x1="160" y1="42" x2="80" y2="80" stroke="#ec4899" strokeWidth="2"/>
              <line x1="160" y1="42" x2="240" y2="80" stroke="#ec4899" strokeWidth="2"/>
              <text x="105" y="65" fontSize="11" fill="#6e6e73">½ K</text>
              <text x="195" y="65" fontSize="11" fill="#6e6e73">½ Z</text>
              <circle cx="80" cy="90" r="10" fill="#ec4899" opacity="0.3" stroke="#ec4899" strokeWidth="2"/>
              <text x="76" y="94" fontSize="10" fontWeight="700">K</text>
              <circle cx="240" cy="90" r="10" fill="#ec4899" opacity="0.3" stroke="#ec4899" strokeWidth="2"/>
              <text x="237" y="94" fontSize="10" fontWeight="700">Z</text>
              <line x1="80" y1="100" x2="40" y2="150" stroke="#ec4899" strokeWidth="2"/>
              <line x1="80" y1="100" x2="120" y2="150" stroke="#ec4899" strokeWidth="2"/>
              <line x1="240" y1="100" x2="200" y2="150" stroke="#ec4899" strokeWidth="2"/>
              <line x1="240" y1="100" x2="280" y2="150" stroke="#ec4899" strokeWidth="2"/>
              <text x="20" y="170" fontSize="12" fontWeight="700">KK</text>
              <text x="105" y="170" fontSize="12" fontWeight="700">KZ</text>
              <text x="185" y="170" fontSize="12" fontWeight="700">ZK</text>
              <text x="270" y="170" fontSize="12" fontWeight="700">ZZ</text>
              <text x="20" y="190" fontSize="11" fill="#6e6e73">¼</text>
              <text x="105" y="190" fontSize="11" fill="#6e6e73">¼</text>
              <text x="185" y="190" fontSize="11" fill="#6e6e73">¼</text>
              <text x="270" y="190" fontSize="11" fill="#6e6e73">¼</text>
            </svg>
            <figcaption>Baumdiagramm: 2 Mal Münze werfen</figcaption>
          </div>
        </figure>
        <div className="formeln">
          <Formel name="Pfad-Multiplikation" ausdruck={<>P(Pfad) = P₁ · P₂ · …</>} hinweis="auf einem Pfad alles multiplizieren" />
          <Formel name="Pfad-Addition" ausdruck={<>P(A) = Summe der Pfade</>} hinweis="bei mehreren günstigen Pfaden" />
        </div>
        <Beispiel aufgabe={<>Münze 2× werfen. P(2× Kopf)?</>}
          schritte={[<>P(K) = 1/2 für jeden Wurf</>, <>P(KK) = 1/2 · 1/2 = <b>1/4</b></>]} />
        <Beispiel aufgabe={<>Würfel 2× werfen. P(mindestens 1× Sechs)?</>}
          schritte={[<>Gegenwahrscheinlichkeit: P(keine 6) = 5/6 · 5/6 = 25/36</>, <>P(mindestens 1× 6) = 1 − 25/36 = <b>11/36 ≈ 30,6 %</b></>]} />
        <div className="tipp"><b>Gegenwahrscheinlichkeit:</b> P(A) = 1 − P(nicht A). Oft viel einfacher zu rechnen!</div>
      </Sektion>

      <Sektion nr={3} titel="Mit oder ohne Zurücklegen">
        <p>Ziehen aus einer Urne mit Kugeln: <b>mit Zurücklegen</b> bleibt die Wahrscheinlichkeit gleich, <b>ohne Zurücklegen</b> ändert sie sich nach jedem Zug.</p>
        <Beispiel aufgabe={<>Urne: 3 rote, 2 blaue Kugeln. Ziehe 2 mit Zurücklegen. P(beide rot)?</>}
          schritte={[<>P(rot) = 3/5 (bleibt gleich)</>, <>= 3/5 · 3/5 = <b>9/25</b></>]} />
        <Beispiel aufgabe={<>Gleiche Urne, ohne Zurücklegen. P(beide rot)?</>}
          schritte={[<>1. Zug: 3/5. 2. Zug: nur noch 2 rote von 4 → 2/4</>, <>= 3/5 · 2/4 = <b>6/20 = 3/10</b></>]} />
      </Sektion>

      <Sektion nr={4} titel="Kombinatorik — wie viele Möglichkeiten?">
        <div className="formeln">
          <Formel name="Permutation (alle anordnen)" ausdruck={<>n!</>} hinweis="n-Fakultät" />
          <Formel name="Variation (k aus n, mit Reihenfolge)" ausdruck={<>n! / (n−k)!</>} />
          <Formel name="Kombination (k aus n, ohne Reihenfolge)" ausdruck={<>n! / (k! · (n−k)!)</>} hinweis="Binomialkoeffizient" />
          <Formel name="Mit Wdh. erlaubt" ausdruck={<>n<sup>k</sup></>} />
        </div>
        <Beispiel aufgabe={<>Wie viele Möglichkeiten gibt es, 5 Bücher in eine Reihe zu stellen?</>}
          schritte={[<>5! = 5 · 4 · 3 · 2 · 1 = <b>120</b></>]} />
        <Beispiel aufgabe={<>In einer Eisdiele gibt es 10 Sorten. Du wählst 3 verschiedene. Wie viele Möglichkeiten?</>}
          schritte={[<>10! / (3! · 7!) = 120</>, <>= <b>120 Möglichkeiten</b></>]} />
        <Joke>Bei den meisten Glücksspielen ist die Wahrscheinlichkeit zu gewinnen winzig klein. Mit guter Mathematik kannst du das ausrechnen — und merkst dann, dass Sparen meist die bessere Wahl ist.</Joke>
      </Sektion>

      <Sektion nr={5} titel="Statistik — was bedeuten die Zahlen?">
        <h3>Lagemaße</h3>
        <div className="formeln">
          <Formel name="Arithm. Mittel (Durchschnitt)" ausdruck={<>x̄ = (x₁ + x₂ + … + xₙ) / n</>} />
          <Formel name="Median" ausdruck={<>mittlerer Wert</>} hinweis="der Wert in der Mitte, wenn alles sortiert ist" />
          <Formel name="Modus" ausdruck={<>häufigster Wert</>} />
        </div>
        <h3>Streumaße</h3>
        <div className="formeln">
          <Formel name="Spannweite" ausdruck={<>R = x<sub>max</sub> − x<sub>min</sub></>} />
          <Formel name="Varianz" ausdruck={<>σ² = (1/n) · Σ(x<sub>i</sub> − x̄)²</>} />
          <Formel name="Standardabweichung" ausdruck={<>σ = √(Varianz)</>} />
        </div>
        <Beispiel aufgabe={<>Mathe-Noten der Klasse: 2, 3, 3, 4, 5. Durchschnitt? Median?</>}
          schritte={[<>x̄ = (2+3+3+4+5)/5 = 17/5 = <b>3,4</b></>, <>Sortiert ist's schon. Mitte: <b>Median = 3</b></>, <>Häufigster Wert: <b>Modus = 3</b></>]} />
      </Sektion>

      <Sektion nr={6} titel="Binomialverteilung — wenn dasselbe oft wiederholt wird">
        <p>Wenn du etwas <b>n-mal</b> wiederholst und immer dieselbe Erfolgswahrscheinlichkeit p hast, ist die Anzahl der Erfolge <b>binomialverteilt</b>.</p>
        <div className="formeln">
          <Formel name="Wahrscheinlichkeit für k Erfolge" ausdruck={<>P(X = k) = C(n,k) · p<sup>k</sup> · (1−p)<sup>n−k</sup></>} hinweis="C(n,k) = Binomialkoeffizient" />
          <Formel name="Erwartungswert" ausdruck={<>E(X) = n · p</>} />
          <Formel name="Standardabweichung" ausdruck={<>σ = √(n · p · (1−p))</>} />
        </div>
        <Beispiel aufgabe={<>10 mal Münze werfen. Erwartungswert für Kopf?</>}
          schritte={[<>E = 10 · 0,5 = <b>5 mal</b></>]} />
      </Sektion>

      <Sektion nr={7} titel="Übungen mit Lösungen">
        <Beispiel aufgabe={<>P(Würfel zeigt gerade)?</>} schritte={[<>3 gerade Zahlen (2, 4, 6) von 6 → <b>1/2</b></>]} />
        <Beispiel aufgabe={<>P(2× hintereinander Sechs)?</>} schritte={[<>1/6 · 1/6 = <b>1/36</b></>]} />
        <Beispiel aufgabe={<>Durchschnitt von 4, 7, 5, 8, 6?</>} schritte={[<>30/5 = <b>6</b></>]} />
        <Beispiel aufgabe={<>Wie viele Anordnungen aus 4 Buchstaben?</>} schritte={[<>4! = <b>24</b></>]} />
        <Beispiel aufgabe={<>P(mindestens 1× Kopf bei 3 Würfen)?</>}
          schritte={[<>P(0× Kopf) = (1/2)³ = 1/8</>, <>P(mind. 1×) = 1 − 1/8 = <b>7/8</b></>]} />
      </Sektion>

      <p style={{ textAlign: "center", marginTop: "30px", color: "#6e6e73", fontSize: "14px" }}>Wahrscheinlichkeit ist deine Superkraft — auch im Alltag! — Anna</p>
    </div>
  );
}
