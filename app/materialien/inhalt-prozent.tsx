"use client";
import { SHARED_STIL, Sektion, Formel, Beispiel, Joke, Hook } from "./_helfer";

export function InhaltProzent() {
  return (
    <div className="mat">
      <style>{SHARED_STIL("#34c759", "#f1faf2", "#e7f7ec")}</style>

      <Hook><b>Prozent klingt furchtbar.</b> Ist es aber nicht. Prozent heißt einfach „von 100". Mehr nicht. Wenn du mit Brüchen umgehen kannst, kannst du auch Prozent — versprochen.</Hook>

      <Sektion nr={1} titel="Was ist Prozent?">
        <p><b>1 Prozent (%) = 1 Hundertstel</b>. Genau wie 1 Cent ein Hundertstel von einem Euro ist.</p>
        <div className="gross">1% = 1/100 = 0,01</div>
        <figure className="fig">
          <div>
            <svg width="220" height="220" viewBox="0 0 220 220">
              {Array.from({ length: 10 }).map((_, i) =>
                Array.from({ length: 10 }).map((_, j) => {
                  const idx = i * 10 + j;
                  const filled = idx < 25;
                  return <rect key={`${i}-${j}`} x={10 + j * 20} y={10 + i * 20} width="18" height="18" fill={filled ? "#34c759" : "#fff"} stroke="#34c759" strokeWidth="1" />;
                })
              )}
            </svg>
            <figcaption>25 % = 25 von 100 Kästchen ausgefüllt</figcaption>
          </div>
        </figure>
        <p>Wenn du <b>50 % von etwas hast</b>, hast du die Hälfte. Wenn du <b>25 % hast</b>, hast du ein Viertel. Wenn du <b>100 % hast</b>, hast du alles. Wenn du <b>200 % gibst</b>, lügst du — mehr als 100 % geht nicht (außer beim Sport-Trainer).</p>
        <h3>Wichtige Begriffe</h3>
        <div className="karten">
          <div className="karte"><h5>Grundwert G</h5><p>Das Ganze, von dem du Prozente nimmst (z.B. 200 €).</p></div>
          <div className="karte"><h5>Prozentsatz p%</h5><p>Wie viel Prozent (z.B. 20 %).</p></div>
          <div className="karte"><h5>Prozentwert W</h5><p>Das Ergebnis (z.B. 40 €).</p></div>
        </div>
        <Joke>Warum verkaufen Geschäfte „bis zu 70 % Rabatt"? Weil sie auch 0 % Rabatt geben dürfen. „Bis zu" ist die Lieblingsfalle der Werbeprofis.</Joke>
      </Sektion>

      <Sektion nr={2} titel="Die Grundformel der Prozentrechnung">
        <p>Eine Formel reicht — daraus leitest du alles ab:</p>
        <div className="gross">W = G · p / 100</div>
        <div className="formeln">
          <Formel name="Prozentwert" ausdruck={<>W = G · p / 100</>} hinweis="wie viel sind p% von G?" />
          <Formel name="Grundwert" ausdruck={<>G = W · 100 / p</>} hinweis="100% rückrechnen" />
          <Formel name="Prozentsatz" ausdruck={<>p = W · 100 / G</>} hinweis="wie viel Prozent ist W von G?" />
        </div>
        <div className="tipp"><b>Eselsbrücke (Pro-G-Wand):</b> Stell dir ein Dreieck vor: oben W, unten links G, unten rechts p/100. Was du suchst, deckst du ab, der Rest bleibt als Formel.</div>
      </Sektion>

      <Sektion nr={3} titel="Die drei klassischen Aufgabentypen">
        <h3>Typ 1: Wie viel sind p % von G?</h3>
        <Beispiel aufgabe={<>20 % von 200 €.</>}
          schritte={[<>W = 200 · 20 / 100</>, <>= <b>40 €</b></>]} />
        <h3>Typ 2: Wie viel ist 100 %?</h3>
        <Beispiel aufgabe={<>30 € sind 15 %. Wie viel sind 100 %?</>}
          schritte={[<>G = 30 · 100 / 15</>, <>= <b>200 €</b></>]} />
        <h3>Typ 3: Wie viel Prozent sind das?</h3>
        <Beispiel aufgabe={<>45 € von 180 €. Wie viel Prozent?</>}
          schritte={[<>p = 45 · 100 / 180</>, <>= <b>25 %</b></>]} />
        <Joke>Mathematiker werden im Restaurant gefragt: „Trinkgeld?" Antworten sie: „Ja, ich nehme 16,42 % vom Bruttobetrag, gerundet auf 2 Nachkommastellen." Kellner: „Aha, also wieder gar nichts."</Joke>
      </Sektion>

      <Sektion nr={4} titel="Prozent dazu, Prozent weg — die Profi-Tricks">
        <p>Hier kommt was, was viele falsch machen: <b>Aufschlag und Rabatt</b>.</p>
        <div className="formeln">
          <Formel name="Aufschlag (z.B. MwSt)" ausdruck={<>neu = G · (1 + p/100)</>} hinweis="alles in einer Rechnung" />
          <Formel name="Rabatt (z.B. Sale)" ausdruck={<>neu = G · (1 − p/100)</>} />
        </div>
        <Beispiel aufgabe={<>Hose 80 €. 25 % Rabatt. Was zahlst du?</>}
          schritte={[<>neu = 80 · (1 − 25/100) = 80 · 0,75</>, <>= <b>60 €</b></>]} />
        <Beispiel aufgabe={<>Nettopreis 200 € + 19 % MwSt.</>}
          schritte={[<>brutto = 200 · 1,19 = <b>238 €</b></>]} />
        <div className="merke"><b>Falle!</b> Zuerst 20 % drauf und dann 20 % runter ergibt NICHT denselben Preis. Beispiel: 100 → 120 (+20%) → 96 (−20%). Du hast also 4 € verloren. Prozent sind tückisch.</div>
      </Sektion>

      <Sektion nr={5} titel="Zinsrechnung — Mathe mit Geld">
        <p>Zinsen sind nichts anderes als Prozente, die du <b>für ein Jahr</b> bekommst (oder zahlst).</p>
        <figure className="fig">
          <div>
            <svg width="340" height="200" viewBox="0 0 340 200">
              <line x1="30" y1="170" x2="330" y2="170" stroke="#1d1d1f" strokeWidth="1.5"/>
              <line x1="30" y1="20" x2="30" y2="170" stroke="#1d1d1f" strokeWidth="1.5"/>
              <polygon points="325,166 332,170 325,174" fill="#1d1d1f"/>
              <text x="322" y="190" fontSize="11" fill="#6e6e73">Jahre</text>
              <text x="6" y="24" fontSize="11" fill="#6e6e73">€</text>
              <polyline fill="none" stroke="#34c759" strokeWidth="3" points={Array.from({ length: 11 }).map((_, i) => { const x = 30 + i * 30; const wachstum = Math.pow(1.05, i); const y = 170 - (wachstum - 1) * 200; return `${x},${y.toFixed(1)}`; }).join(" ")}/>
              {Array.from({ length: 11 }).map((_, i) => (
                <circle key={i} cx={30 + i * 30} cy={170 - (Math.pow(1.05, i) - 1) * 200} r="3" fill="#34c759"/>
              ))}
              {[0, 2, 4, 6, 8, 10].map((i) => (
                <g key={i}>
                  <line x1={30 + i * 30} y1="170" x2={30 + i * 30} y2="174" stroke="#1d1d1f" strokeWidth="1"/>
                  <text x={30 + i * 30 - 4} y="186" fontSize="10" fill="#6e6e73">{i}</text>
                </g>
              ))}
              <text x="100" y="40" fontSize="13" fontWeight="700" fill="#34c759">100 € · 5 % Zinseszins</text>
            </svg>
            <figcaption>Aus 100 € werden mit 5 % Zinseszins nach 10 Jahren ca. 163 €</figcaption>
          </div>
        </figure>
        <div className="formeln">
          <Formel name="Jahres-Zinsen" ausdruck={<>Z = K · p / 100</>} hinweis="K = Kapital, p = Zinssatz" />
          <Formel name="Monats-Zinsen" ausdruck={<>Z = K · p · m / (100 · 12)</>} hinweis="m = Monate" />
          <Formel name="Tages-Zinsen" ausdruck={<>Z = K · p · t / (100 · 360)</>} hinweis="t = Tage (Bank-Jahr 360 Tage!)" />
          <Formel name="Zinseszins" ausdruck={<>K<sub>n</sub> = K · (1 + p/100)<sup>n</sup></>} hinweis="n = Anzahl Jahre" />
        </div>
        <Beispiel aufgabe={<>1000 € auf der Bank zu 3 % für 1 Jahr.</>}
          schritte={[<>Z = 1000 · 3 / 100 = <b>30 €</b></>]} />
        <Beispiel aufgabe={<>500 € zu 2 % für 6 Monate.</>}
          schritte={[<>Z = 500 · 2 · 6 / (100 · 12)</>, <>= 60 / 12 = <b>5 €</b></>]} />
        <Beispiel aufgabe={<>1000 € auf 5 Jahre mit 4 % Zinseszins.</>}
          schritte={[<>K = 1000 · 1,04⁵</>, <>1,04⁵ ≈ 1,2167</>, <>≈ <b>1216,65 €</b></>]} />
        <Joke>Einstein soll gesagt haben: „Der Zinseszins ist das achte Weltwunder. Wer ihn versteht, verdient daran — wer ihn nicht versteht, zahlt ihn." Bisschen unheimlich, aber stimmt.</Joke>
      </Sektion>

      <Sektion nr={6} titel="Promille und ppm">
        <p>Manchmal sind Prozente zu grob. Dann gibt es:</p>
        <div className="karten">
          <div className="karte"><h5>Promille (‰)</h5><p>1 Tausendstel = 0,1 %</p><p>z.B. bei Alkohol im Blut</p></div>
          <div className="karte"><h5>ppm</h5><p>parts per million = 1 Millionstel</p><p>z.B. bei Schadstoffen</p></div>
        </div>
        <Beispiel aufgabe={<>1,3 ‰ Alkohol — wie viel Prozent?</>}
          schritte={[<>1,3 ‰ = 0,13 %</>]} />
      </Sektion>

      <Sektion nr={7} titel="Übungen mit Lösungen">
        <Beispiel aufgabe={<>20 % von 150.</>} schritte={[<>= 150 · 0,2 = <b>30</b></>]} />
        <Beispiel aufgabe={<>Pulli 60 €, jetzt 30 % runter. Neuer Preis?</>} schritte={[<>= 60 · 0,7 = <b>42 €</b></>]} />
        <Beispiel aufgabe={<>50 € sind 20 %. Was sind 100 %?</>} schritte={[<>= 50 · 5 = <b>250 €</b></>]} />
        <Beispiel aufgabe={<>800 € auf 2 Jahre mit 5 % Zinseszins.</>}
          schritte={[<>= 800 · 1,05² = 800 · 1,1025</>, <>= <b>882 €</b></>]} />
        <Beispiel aufgabe={<>Nettopreis 100 €, mit 19 % MwSt = brutto?</>}
          schritte={[<>= 100 · 1,19 = <b>119 €</b></>]} />
      </Sektion>

      <p style={{ textAlign: "center", marginTop: "30px", color: "#6e6e73", fontSize: "14px" }}>Du verstehst jetzt Prozente — beim nächsten Sale weißt du, was wirklich günstig ist! — Anna</p>
    </div>
  );
}
