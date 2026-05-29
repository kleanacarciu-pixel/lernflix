"use client";
import { SHARED_STIL, Sektion, Formel, Beispiel, Joke, Hook } from "./_helfer";

export function InhaltBrueche() {
  return (
    <div className="mat">
      <style>{SHARED_STIL("#0071e3", "#f6f8fc", "#e6f0fe")}</style>

      <Hook><b>Brüche sind wie Pizza.</b> Du teilst etwas Ganzes in gleiche Stücke auf und nimmst dir ein paar davon. Mehr ist es nicht. Wenn du das einmal verstanden hast, ist der Rest reine Routine.</Hook>

      <Sektion nr={1} titel="Was ist überhaupt ein Bruch?">
        <p>Ein Bruch hat <b>oben</b> eine Zahl (den <b>Zähler</b>) und <b>unten</b> eine Zahl (den <b>Nenner</b>). Dazwischen ist ein Strich — der Bruchstrich.</p>
        <div className="gross">3 / 4 → Zähler oben, Nenner unten</div>
        <figure className="fig">
          <div>
            <svg width="140" height="140" viewBox="0 0 140 140">
              <circle cx="70" cy="70" r="64" fill="#92400e"/>
              <circle cx="70" cy="70" r="58" fill="#dc2626"/>
              <circle cx="48" cy="42" r="7" fill="#fde047"/>
              <circle cx="92" cy="48" r="7" fill="#fde047"/>
              <circle cx="38" cy="82" r="7" fill="#fde047"/>
              <circle cx="100" cy="92" r="7" fill="#fde047"/>
              <circle cx="64" cy="108" r="7" fill="#fde047"/>
              <circle cx="78" cy="68" r="5" fill="#7f1d1d"/>
              <circle cx="56" cy="60" r="5" fill="#7f1d1d"/>
              <circle cx="90" cy="78" r="4" fill="#7f1d1d"/>
              <line x1="70" y1="14" x2="70" y2="126" stroke="#fef3c7" strokeWidth="2.5"/>
              <line x1="14" y1="70" x2="126" y2="70" stroke="#fef3c7" strokeWidth="2.5"/>
              <path d="M70 70 L70 14 A56 56 0 0 1 126 70 Z" fill="#0071e3" opacity="0.5" stroke="#0071e3" strokeWidth="2"/>
            </svg>
            <figcaption>¼ — ein Stück von vier</figcaption>
          </div>
          <div>
            <svg width="140" height="140" viewBox="0 0 140 140">
              <circle cx="70" cy="70" r="64" fill="#92400e"/>
              <circle cx="70" cy="70" r="58" fill="#dc2626"/>
              <circle cx="48" cy="42" r="7" fill="#fde047"/>
              <circle cx="92" cy="48" r="7" fill="#fde047"/>
              <circle cx="38" cy="82" r="7" fill="#fde047"/>
              <circle cx="100" cy="92" r="7" fill="#fde047"/>
              <circle cx="64" cy="108" r="7" fill="#fde047"/>
              <circle cx="78" cy="68" r="5" fill="#7f1d1d"/>
              <circle cx="56" cy="60" r="5" fill="#7f1d1d"/>
              <circle cx="90" cy="78" r="4" fill="#7f1d1d"/>
              <line x1="70" y1="14" x2="70" y2="126" stroke="#fef3c7" strokeWidth="2.5"/>
              <path d="M70 70 L70 14 A56 56 0 0 0 70 126 Z" fill="#0071e3" opacity="0.5" stroke="#0071e3" strokeWidth="2"/>
            </svg>
            <figcaption>½ — die halbe Pizza</figcaption>
          </div>
          <div>
            <svg width="140" height="140" viewBox="0 0 140 140">
              <circle cx="70" cy="70" r="64" fill="#92400e"/>
              <circle cx="70" cy="70" r="58" fill="#dc2626"/>
              <circle cx="48" cy="42" r="7" fill="#fde047"/>
              <circle cx="92" cy="48" r="7" fill="#fde047"/>
              <circle cx="38" cy="82" r="7" fill="#fde047"/>
              <circle cx="100" cy="92" r="7" fill="#fde047"/>
              <circle cx="64" cy="108" r="7" fill="#fde047"/>
              <circle cx="78" cy="68" r="5" fill="#7f1d1d"/>
              <circle cx="56" cy="60" r="5" fill="#7f1d1d"/>
              <circle cx="90" cy="78" r="4" fill="#7f1d1d"/>
              <line x1="70" y1="14" x2="70" y2="126" stroke="#fef3c7" strokeWidth="2.5"/>
              <line x1="14" y1="70" x2="126" y2="70" stroke="#fef3c7" strokeWidth="2.5"/>
              <path d="M70 70 L70 14 A56 56 0 1 0 126 70 Z" fill="#0071e3" opacity="0.5" stroke="#0071e3" strokeWidth="2"/>
            </svg>
            <figcaption>¾ — drei Stücke von vier</figcaption>
          </div>
        </figure>
        <p>Stell dir eine Pizza vor, die in <b>4 gleiche Stücke</b> geschnitten ist. Wenn du <b>3 davon</b> isst, hast du ¾ der Pizza weggeputzt.</p>
        <Joke>Wenn jemand sagt „Ich nehme die Hälfte", meint er ½. Wenn er sagt „Ich nehme nur ein Stückchen", schau besser nach — meistens war's mehr.</Joke>
        <h3>Wichtige Wörter</h3>
        <div className="karten">
          <div className="karte"><h5>Zähler</h5><p>Die Zahl <b>oben</b>. Sagt, wie viele Stücke du hast.</p></div>
          <div className="karte"><h5>Nenner</h5><p>Die Zahl <b>unten</b>. Sagt, in wie viele Teile das Ganze geteilt wurde.</p></div>
          <div className="karte"><h5>Bruchstrich</h5><p>Der Strich dazwischen. Bedeutet eigentlich nichts anderes als „geteilt durch".</p></div>
          <div className="karte"><h5>Stammbruch</h5><p>Bruch mit Zähler 1: ½, ⅓, ¼, ⅕ usw.</p></div>
        </div>
        <div className="tipp"><b>Merkhilfe:</b> Der <b>Zähler zählt</b> (wie viele Stücke), der <b>Nenner nennt</b> (wie groß die Stücke sind). Klingt blöd, hilft aber.</div>
      </Sektion>

      <Sektion nr={2} titel="Kürzen und Erweitern">
        <p>Du kannst einen Bruch <b>kürzen</b> (kleiner aufschreiben) oder <b>erweitern</b> (größer aufschreiben), ohne dass sich sein Wert ändert. Hauptregel: was du oben tust, musst du auch unten tun.</p>
        <div className="formeln">
          <Formel name="Kürzen" ausdruck={<>(a · n) / (b · n) = a / b</>} hinweis="Zähler und Nenner durch dieselbe Zahl teilen" />
          <Formel name="Erweitern" ausdruck={<>a / b = (a · n) / (b · n)</>} hinweis="Zähler und Nenner mit derselben Zahl mal nehmen" />
        </div>
        <Beispiel aufgabe={<>Kürze 12/18.</>}
          schritte={[<>Beide durch 6 teilen (das ist der größte gemeinsame Teiler)</>, <>= <b>2/3</b></>]} />
        <Beispiel aufgabe={<>Erweitere ½ so, dass im Nenner 8 steht.</>}
          schritte={[<>Du musst 2 · 4 = 8 rechnen, also Faktor 4</>, <>= <b>4/8</b></>]} />
        <Joke>Ein Lehrer fragt: „Wer kann mir 4/8 kürzen?" Sagt der Schüler: „Klar — vier Schoki-Achtel sind eine halbe Tafel." Mathematisch richtig, der Lehrer war trotzdem nicht happy.</Joke>
      </Sektion>

      <Sektion nr={3} titel="Brüche addieren und subtrahieren">
        <p>Hier kommt die wichtigste Regel: <b>Brüche kannst du nur addieren oder subtrahieren, wenn der Nenner gleich ist!</b> Sind die Nenner verschieden, musst du sie erst auf einen <b>gemeinsamen Nenner</b> bringen.</p>
        <figure className="fig">
          <div>
            <svg width="360" height="130" viewBox="0 0 360 130">
              <rect x="10" y="30" width="80" height="60" fill="#fff" stroke="#0071e3" strokeWidth="2"/>
              <rect x="10" y="30" width="40" height="60" fill="#0071e3" opacity="0.6"/>
              <line x1="50" y1="30" x2="50" y2="90" stroke="#0071e3" strokeWidth="1"/>
              <text x="36" y="110" fontSize="15" fontWeight="700">½</text>
              <text x="105" y="68" fontSize="24" fontWeight="700" fill="#0071e3">+</text>
              <rect x="140" y="30" width="80" height="60" fill="#fff" stroke="#0071e3" strokeWidth="2"/>
              <rect x="140" y="30" width="20" height="60" fill="#0071e3" opacity="0.6"/>
              <line x1="160" y1="30" x2="160" y2="90" stroke="#0071e3" strokeWidth="1"/>
              <line x1="180" y1="30" x2="180" y2="90" stroke="#0071e3" strokeWidth="1"/>
              <line x1="200" y1="30" x2="200" y2="90" stroke="#0071e3" strokeWidth="1"/>
              <text x="170" y="110" fontSize="15" fontWeight="700">¼</text>
              <text x="235" y="68" fontSize="24" fontWeight="700" fill="#0071e3">=</text>
              <rect x="270" y="30" width="80" height="60" fill="#fff" stroke="#0071e3" strokeWidth="2"/>
              <rect x="270" y="30" width="60" height="60" fill="#0071e3" opacity="0.6"/>
              <line x1="290" y1="30" x2="290" y2="90" stroke="#0071e3" strokeWidth="1"/>
              <line x1="310" y1="30" x2="310" y2="90" stroke="#0071e3" strokeWidth="1"/>
              <line x1="330" y1="30" x2="330" y2="90" stroke="#0071e3" strokeWidth="1"/>
              <text x="296" y="110" fontSize="15" fontWeight="700">¾</text>
            </svg>
            <figcaption>½ + ¼ = ¾ · alles in Viertel umgerechnet</figcaption>
          </div>
        </figure>
        <div className="formeln">
          <Formel name="Gleicher Nenner" ausdruck={<>a/n + b/n = (a + b)/n</>} hinweis="Zähler addieren, Nenner gleich lassen" />
          <Formel name="Verschiedener Nenner" ausdruck={<>a/b + c/d = (a·d + c·b) / (b·d)</>} hinweis="Über Kreuz erweitern" />
        </div>
        <Beispiel aufgabe={<>Berechne 2/5 + 1/5.</>}
          schritte={[<>Nenner gleich (5), Zähler addieren: 2 + 1 = 3</>, <>= <b>3/5</b></>]} />
        <Beispiel aufgabe={<>Berechne 1/2 + 1/3.</>}
          schritte={[<>Gemeinsamer Nenner = 6 (kleinstes gemeinsames Vielfaches)</>, <>1/2 = 3/6 (mit 3 erweitern), 1/3 = 2/6 (mit 2 erweitern)</>, <>3/6 + 2/6 = <b>5/6</b></>]} />
        <Joke>Warum dürfen 1/2 + 1/3 nicht einfach „2/5" sein? Weil das wie die Anzahl von Pizzen + Anzahl von Pommes wäre — verschiedene Sachen. Erst auf gleiche Stücke bringen, dann zählen.</Joke>
      </Sektion>

      <Sektion nr={4} titel="Brüche multiplizieren">
        <p>Das hier ist <b>endlich mal easy</b>: Zähler mal Zähler, Nenner mal Nenner. Fertig.</p>
        <div className="formeln">
          <Formel name="Bruch · Bruch" ausdruck={<>a/b · c/d = (a · c) / (b · d)</>} hinweis="oben mit oben, unten mit unten" />
          <Formel name="Bruch · ganze Zahl" ausdruck={<>n · a/b = (n · a) / b</>} />
        </div>
        <Beispiel aufgabe={<>Berechne 2/3 · 4/5.</>}
          schritte={[<>= (2 · 4) / (3 · 5)</>, <>= <b>8/15</b></>]} />
        <Beispiel aufgabe={<>Berechne 3 · 2/7.</>}
          schritte={[<>= 6/7</>]} />
        <div className="tipp"><b>Tipp:</b> Vor dem Multiplizieren über Kreuz <b>kürzen</b>! Das spart richtig viel Arbeit. Beispiel: 4/9 · 3/8 = 4·3/(9·8) — du kannst die 4 mit der 8 zu 1/2 kürzen UND die 3 mit der 9 zu 1/3. Ergebnis: 1/6. Viel netter als 12/72.</div>
        <Joke>Mathe-Witz: ein halber Bruch und ein viertel Bruch treffen sich. Sagt der eine: „Du bist ja nur halb so groß wie ich." Antwortet der andere: „Du bist auch nicht mehr ganz."</Joke>
      </Sektion>

      <Sektion nr={5} titel="Brüche dividieren">
        <p>Klingt kompliziert, ist es aber nicht. <b>Du multiplizierst mit dem Kehrwert.</b> Was bedeutet das? Du <b>drehst</b> den zweiten Bruch um (Zähler und Nenner tauschen) und multiplizierst.</p>
        <div className="formeln">
          <Formel name="Bruch : Bruch" ausdruck={<>a/b : c/d = a/b · d/c</>} hinweis="Bruch umdrehen und multiplizieren" />
          <Formel name="Bruch : ganze Zahl" ausdruck={<>a/b : n = a / (b · n)</>} />
        </div>
        <Beispiel aufgabe={<>Berechne 3/4 : 2/5.</>}
          schritte={[<>Zweiten Bruch umdrehen: 2/5 → 5/2</>, <>3/4 · 5/2 = 15/8</>, <>= <b>15/8 = 1 7/8</b></>]} />
        <Beispiel aufgabe={<>Berechne 6/7 : 3.</>}
          schritte={[<>Zahl 3 = 3/1. Umdrehen: 1/3</>, <>6/7 · 1/3 = 6/21 = <b>2/7</b></>]} />
        <Joke>„Geteilt durch einen Bruch" klingt wie ein schlechter Detektivfilm. Tatsächlich machst du das Gegenteil: du <i>multiplizierst</i> mit der umgedrehten Version. Mathe trickst dich gerne aus.</Joke>
      </Sektion>

      <Sektion nr={6} titel="Gemischte Brüche und Bruchteile umrechnen">
        <p>Ein <b>gemischter Bruch</b> ist eine Mischung aus ganzer Zahl und Bruch, z.B. 2 ½ — das bedeutet „zwei ganze Pizzen plus eine halbe".</p>
        <h3>Gemischt → unecht (oben mehr als unten)</h3>
        <div className="formeln">
          <Formel name="Umrechnen" ausdruck={<>g a/b = (g · b + a) / b</>} hinweis="g = ganzer Anteil" />
        </div>
        <Beispiel aufgabe={<>2 3/4 als unechten Bruch.</>} schritte={[<>(2 · 4 + 3) / 4 = 11/4</>, <>= <b>11/4</b></>]} />
        <h3>Bruch → Dezimalzahl</h3>
        <p>Einfach <b>Zähler durch Nenner</b> teilen.</p>
        <Beispiel aufgabe={<>Wandle 3/8 in Dezimalzahl um.</>} schritte={[<>3 : 8 = <b>0,375</b></>]} />
        <h3>Dezimalzahl → Bruch</h3>
        <Beispiel aufgabe={<>0,75 als Bruch.</>} schritte={[<>= 75/100 = 3/4 (gekürzt)</>, <>= <b>3/4</b></>]} />
      </Sektion>

      <Sektion nr={7} titel="Übungen mit Lösungen">
        <Beispiel aufgabe={<>1/3 + 2/3</>} schritte={[<>= 3/3 = <b>1</b> (eine ganze!)</>]} />
        <Beispiel aufgabe={<>5/6 − 1/3</>} schritte={[<>1/3 = 2/6</>, <>5/6 − 2/6 = <b>3/6 = 1/2</b></>]} />
        <Beispiel aufgabe={<>3/4 · 2/9</>} schritte={[<>Vor mult. kürzen: 3 mit 9 zu 1/3</>, <>= 1/4 · 2/3 = <b>2/12 = 1/6</b></>]} />
        <Beispiel aufgabe={<>4/5 : 2/3</>} schritte={[<>4/5 · 3/2 = 12/10 = <b>6/5 = 1 1/5</b></>]} />
        <Beispiel aufgabe={<>2/7 + 3/14</>} schritte={[<>Gemeinsamer Nenner 14: 2/7 = 4/14</>, <>4/14 + 3/14 = <b>7/14 = 1/2</b></>]} />
      </Sektion>

      <Sektion nr={8} titel="Schnell-Übersicht">
        <table>
          <thead><tr><th>Operation</th><th>So geht's</th></tr></thead>
          <tbody>
            <tr><td>Gleiche Nenner addieren</td><td>Zähler addieren, Nenner gleich</td></tr>
            <tr><td>Verschiedene Nenner</td><td>auf gleichen Nenner bringen, dann addieren</td></tr>
            <tr><td>Multiplizieren</td><td>Zähler · Zähler, Nenner · Nenner</td></tr>
            <tr><td>Dividieren</td><td>mit Kehrwert multiplizieren</td></tr>
            <tr><td>Kürzen</td><td>oben + unten durch dieselbe Zahl</td></tr>
            <tr><td>Erweitern</td><td>oben + unten mal dieselbe Zahl</td></tr>
            <tr><td>Bruch → Dezimal</td><td>Zähler : Nenner</td></tr>
          </tbody>
        </table>
        <p style={{ textAlign: "center", marginTop: "30px", color: "#6e6e73", fontSize: "14px" }}>Du bist jetzt Brüche-Profi. Pizza schmeckt sowieso besser, wenn man die Bruchrechnung dazu beherrscht. — Anna</p>
      </Sektion>
    </div>
  );
}
