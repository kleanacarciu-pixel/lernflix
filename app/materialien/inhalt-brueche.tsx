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
            <svg width="120" height="120" viewBox="0 0 120 120"><circle cx="60" cy="60" r="50" fill="#fff" stroke="#0071e3" strokeWidth="2"/><path d="M60 60 L60 10 A50 50 0 0 1 110 60 Z" fill="#0071e3" opacity="0.7"/></svg>
            <figcaption>¼ der Pizza</figcaption>
          </div>
          <div>
            <svg width="120" height="120" viewBox="0 0 120 120"><circle cx="60" cy="60" r="50" fill="#fff" stroke="#0071e3" strokeWidth="2"/><path d="M60 60 L60 10 A50 50 0 1 1 10 60 Z" fill="#0071e3" opacity="0.7"/></svg>
            <figcaption>½ der Pizza</figcaption>
          </div>
          <div>
            <svg width="120" height="120" viewBox="0 0 120 120"><circle cx="60" cy="60" r="50" fill="#fff" stroke="#0071e3" strokeWidth="2"/><path d="M60 60 L60 10 A50 50 0 1 1 10 60 Z" fill="#0071e3" opacity="0.7"/><path d="M60 60 L10 60 A50 50 0 0 1 26 25 Z" fill="#0071e3" opacity="0.7"/></svg>
            <figcaption>¾ der Pizza</figcaption>
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
            <svg width="320" height="120" viewBox="0 0 320 120">
              <rect x="10" y="40" width="80" height="50" fill="#fff" stroke="#0071e3" strokeWidth="2"/>
              <rect x="10" y="40" width="40" height="50" fill="#0071e3" opacity="0.7"/>
              <text x="36" y="110" fontSize="14" fontWeight="700">1/2</text>
              <text x="105" y="72" fontSize="22" fontWeight="700" fill="#0071e3">+</text>
              <rect x="130" y="40" width="80" height="50" fill="#fff" stroke="#0071e3" strokeWidth="2"/>
              <rect x="130" y="40" width="20" height="50" fill="#0071e3" opacity="0.7"/>
              <text x="160" y="110" fontSize="14" fontWeight="700">1/4</text>
              <text x="225" y="72" fontSize="22" fontWeight="700" fill="#0071e3">=</text>
              <rect x="250" y="40" width="60" height="50" fill="#fff" stroke="#0071e3" strokeWidth="2"/>
              <rect x="250" y="40" width="45" height="50" fill="#0071e3" opacity="0.7"/>
              <text x="265" y="110" fontSize="14" fontWeight="700">3/4</text>
            </svg>
            <figcaption>½ + ¼ = ¾ (auf gleichen Nenner gebracht)</figcaption>
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
