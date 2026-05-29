"use client";
import { type ReactNode } from "react";

const STIL = `
  .mat { font-size:16px; line-height:1.7; color:#1d1d1f; }
  .mat h2 { font-family:Georgia,serif; font-size:26px; font-weight:800; color:#5856d6; margin:38px 0 14px; display:flex; align-items:center; gap:12px; }
  .mat h2 .num { background:#5856d6; color:#fff; min-width:36px; height:36px; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; font-size:18px; padding:0 6px; }
  .mat h3 { font-size:19px; font-weight:700; margin:22px 0 10px; }
  .mat h4 { font-size:16px; font-weight:700; margin:14px 0 6px; color:#5856d6; }
  .mat p { margin:8px 0; }
  .mat .erkl { color:#3a3a3c; }
  .mat .formeln { display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:10px; margin:14px 0; }
  .mat .formel { background:#f0eefc; border:1.5px solid #cdc4f5; border-radius:12px; padding:14px 16px; }
  .mat .formel .name { font-size:12px; color:#5856d6; font-weight:700; text-transform:uppercase; letter-spacing:0.06em; margin-bottom:6px; }
  .mat .formel .ausdruck { font-family:Georgia,serif; font-size:18px; font-weight:700; }
  .mat .formel .hinweis { font-size:13px; color:#6e6e73; margin-top:6px; }
  .mat .gross { text-align:center; font-family:Georgia,serif; font-size:30px; font-weight:800; padding:22px 0; background:linear-gradient(135deg,#f3f0ff,#e9e3ff); border-radius:14px; margin:12px 0; }
  .mat .beispiel { background:#eef6ff; border-left:4px solid #5856d6; border-radius:10px; padding:14px 18px; margin:14px 0; }
  .mat .beispiel .lbl { font-size:12px; font-weight:700; color:#5856d6; text-transform:uppercase; letter-spacing:0.06em; margin-bottom:6px; }
  .mat .beispiel ol { padding-left:22px; margin:8px 0 0; }
  .mat .beispiel li { margin:6px 0; }
  .mat .merke { background:#fdecea; border-left:4px solid #ef4444; border-radius:10px; padding:12px 16px; margin:14px 0; font-size:15px; }
  .mat .merke b { color:#b91c1c; }
  .mat .tipp { background:#e7f7ec; border-left:4px solid #34c759; border-radius:10px; padding:12px 16px; margin:14px 0; font-size:15px; }
  .mat .tipp b { color:#1f7f3a; }
  .mat table { width:100%; border-collapse:collapse; margin:14px 0; }
  .mat th { background:#5856d6; color:#fff; padding:10px 12px; text-align:left; font-size:14px; }
  .mat td { padding:9px 12px; border-bottom:1px solid #ececec; font-size:15px; }
  .mat tr:nth-child(even) td { background:#fafafe; }
  .mat .karten { display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:12px; margin:14px 0; }
  .mat .karte { background:#fff; border:1px solid #ececec; border-radius:14px; padding:14px 16px; }
  .mat .karte h5 { font-size:15px; font-weight:700; margin:0 0 6px; color:#5856d6; }
`;

function Sektion({ nr, titel, children }: { nr: number | string; titel: string; children: ReactNode }) {
  return <section><h2><span className="num">{nr}</span>{titel}</h2>{children}</section>;
}

function Formel({ name, ausdruck, hinweis }: { name: string; ausdruck: ReactNode; hinweis?: string }) {
  return (
    <div className="formel">
      <div className="name">{name}</div>
      <div className="ausdruck">{ausdruck}</div>
      {hinweis && <div className="hinweis">{hinweis}</div>}
    </div>
  );
}

function Beispiel({ aufgabe, schritte }: { aufgabe: ReactNode; schritte: ReactNode[] }) {
  return (
    <div className="beispiel">
      <div className="lbl">Beispiel</div>
      <p>{aufgabe}</p>
      <ol>{schritte.map((s, i) => <li key={i}>{s}</li>)}</ol>
    </div>
  );
}

export function InhaltPotenzen() {
  return (
    <div className="mat">
      <style>{STIL}</style>

      <p className="erkl">Potenzen sind eine Abkürzung fürs Multiplizieren. Statt 2 · 2 · 2 · 2 · 2 schreibst du einfach <b>2⁵</b>. In diesem Heft findest du <b>alle</b> Regeln, Sonderfälle und Formeln rund um Potenzen und Wurzeln — mit Tabellen, Beispielen und Übungen.</p>

      <Sektion nr={1} titel="Was ist eine Potenz?">
        <p className="erkl">Eine Potenz hat zwei Teile:</p>
        <div className="gross">a<sup style={{ color: "#5856d6" }}>n</sup> &nbsp;=&nbsp; a · a · a · … · a &nbsp;<span style={{ fontSize: "16px", color: "#6e6e73" }}>(n-mal)</span></div>
        <ul style={{ marginLeft: "20px" }}>
          <li><b>Basis a</b> — die Zahl, die multipliziert wird</li>
          <li><b>Exponent n</b> — wie oft sie multipliziert wird (auch „Hochzahl")</li>
          <li><b>Potenzwert</b> — das Ergebnis</li>
        </ul>
        <h3>Sprechweise</h3>
        <table>
          <thead><tr><th>Schreibweise</th><th>So sagt man</th><th>Ergebnis</th></tr></thead>
          <tbody>
            <tr><td>3²</td><td>3 zum Quadrat / 3 hoch 2</td><td>9</td></tr>
            <tr><td>2³</td><td>2 hoch 3 / 2 zur dritten</td><td>8</td></tr>
            <tr><td>5⁴</td><td>5 hoch 4</td><td>625</td></tr>
            <tr><td>10⁶</td><td>10 hoch 6</td><td>1 000 000</td></tr>
          </tbody>
        </table>
        <h3>Tabelle wichtiger Potenzen</h3>
        <table>
          <thead><tr><th>n</th><th>2ⁿ</th><th>3ⁿ</th><th>5ⁿ</th><th>10ⁿ</th></tr></thead>
          <tbody>
            <tr><td>1</td><td>2</td><td>3</td><td>5</td><td>10</td></tr>
            <tr><td>2</td><td>4</td><td>9</td><td>25</td><td>100</td></tr>
            <tr><td>3</td><td>8</td><td>27</td><td>125</td><td>1 000</td></tr>
            <tr><td>4</td><td>16</td><td>81</td><td>625</td><td>10 000</td></tr>
            <tr><td>5</td><td>32</td><td>243</td><td>3 125</td><td>100 000</td></tr>
            <tr><td>6</td><td>64</td><td>729</td><td>15 625</td><td>1 000 000</td></tr>
            <tr><td>7</td><td>128</td><td>2 187</td><td>78 125</td><td>10 000 000</td></tr>
            <tr><td>8</td><td>256</td><td>6 561</td><td>390 625</td><td>10⁸</td></tr>
            <tr><td>9</td><td>512</td><td>19 683</td><td>—</td><td>10⁹</td></tr>
            <tr><td>10</td><td>1 024</td><td>59 049</td><td>—</td><td>10¹⁰</td></tr>
          </tbody>
        </table>
        <div className="tipp"><b>Auswendig lernen:</b> 2¹⁰ = 1024 (≈ 1000) — das ist „Kilo" in der Informatik.</div>
      </Sektion>

      <Sektion nr={2} titel="Die fünf Potenzgesetze">
        <h3>Regel 1 — Gleiche Basis, multiplizieren</h3>
        <div className="formeln"><Formel name="Multiplikation" ausdruck={<>a<sup>m</sup> · a<sup>n</sup> = a<sup>m + n</sup></>} hinweis="Exponenten ADDIEREN" /></div>
        <Beispiel aufgabe={<>Vereinfache 2³ · 2⁴</>} schritte={[<>Basis gleich (2), Exponenten addieren: 3 + 4 = 7</>, <>Ergebnis: <b>2⁷ = 128</b></>]} />
        <Beispiel aufgabe={<>Vereinfache a⁵ · a² · a</>} schritte={[<>a hat den Exponenten 1, also: 5 + 2 + 1 = 8</>, <>= <b>a⁸</b></>]} />

        <h3>Regel 2 — Gleiche Basis, dividieren</h3>
        <div className="formeln"><Formel name="Division" ausdruck={<>a<sup>m</sup> : a<sup>n</sup> = a<sup>m − n</sup></>} hinweis="Exponenten SUBTRAHIEREN" /></div>
        <Beispiel aufgabe={<>Vereinfache 5⁷ : 5³</>} schritte={[<>Exponenten subtrahieren: 7 − 3 = 4</>, <>= <b>5⁴ = 625</b></>]} />
        <Beispiel aufgabe={<>Vereinfache x⁵ : x⁸</>} schritte={[<>5 − 8 = −3</>, <>= x<sup>−3</sup> = <b>1 / x³</b></>]} />

        <h3>Regel 3 — Potenz potenzieren</h3>
        <div className="formeln"><Formel name="Potenz von Potenz" ausdruck={<>(a<sup>m</sup>)<sup>n</sup> = a<sup>m · n</sup></>} hinweis="Exponenten MULTIPLIZIEREN" /></div>
        <Beispiel aufgabe={<>Vereinfache (2³)²</>} schritte={[<>3 · 2 = 6</>, <>= <b>2⁶ = 64</b></>]} />
        <Beispiel aufgabe={<>Vereinfache ((x²)³)⁴</>} schritte={[<>2 · 3 · 4 = 24</>, <>= <b>x²⁴</b></>]} />

        <h3>Regel 4 — Gleicher Exponent, Basen multiplizieren</h3>
        <div className="formeln"><Formel name="Produkt potenzieren" ausdruck={<>(a · b)<sup>n</sup> = a<sup>n</sup> · b<sup>n</sup></>} /></div>
        <Beispiel aufgabe={<>Berechne (2 · 5)³</>} schritte={[<>Variante A: 10³ = <b>1000</b></>, <>Variante B: 2³ · 5³ = 8 · 125 = <b>1000</b></>]} />

        <h3>Regel 5 — Gleicher Exponent, Basen dividieren</h3>
        <div className="formeln"><Formel name="Quotient potenzieren" ausdruck={<>(a : b)<sup>n</sup> = a<sup>n</sup> : b<sup>n</sup></>} /></div>
        <Beispiel aufgabe={<>Berechne (6 : 2)³</>} schritte={[<>= 3³ = <b>27</b></>]} />

        <div className="tipp"><b>Eselsbrücke:</b> Bei <i>gleicher Basis</i> rechnest du mit den <i>Exponenten</i>. Bei <i>gleichem Exponenten</i> rechnest du mit den <i>Basen</i>.</div>
      </Sektion>

      <Sektion nr={3} titel="Sonderfälle: hoch 0, hoch 1 und Eins">
        <div className="formeln">
          <Formel name="Hoch 1" ausdruck={<>a¹ = a</>} hinweis="bleibt unverändert" />
          <Formel name="Hoch 0" ausdruck={<>a⁰ = 1</>} hinweis="(für a ≠ 0)" />
          <Formel name="Eins hoch n" ausdruck={<>1ⁿ = 1</>} />
          <Formel name="Null hoch n" ausdruck={<>0ⁿ = 0</>} hinweis="(für n &gt; 0)" />
        </div>
        <Beispiel aufgabe={<>Berechne 7⁰</>} schritte={[<>Jede Zahl außer 0 hoch 0 = <b>1</b></>]} />
        <Beispiel aufgabe={<>Berechne 1¹⁰⁰</>} schritte={[<>Eins bleibt Eins, egal wie oft multipliziert: <b>1</b></>]} />
        <div className="merke"><b>Achtung:</b> 0⁰ ist mathematisch nicht eindeutig definiert — vermeide das in Aufgaben.</div>
      </Sektion>

      <Sektion nr={4} titel="Negative Exponenten">
        <div className="formeln">
          <Formel name="Definition" ausdruck={<>a<sup>−n</sup> = 1 / a<sup>n</sup></>} />
          <Formel name="Umkehr" ausdruck={<>1 / a<sup>−n</sup> = a<sup>n</sup></>} />
          <Formel name="Bruch potenzieren" ausdruck={<>(a/b)<sup>−n</sup> = (b/a)<sup>n</sup></>} hinweis="Bruch wird gekippt" />
        </div>
        <Beispiel aufgabe={<>Berechne 2⁻³</>} schritte={[<>= 1 / 2³ = 1 / 8</>, <>= <b>0,125</b></>]} />
        <Beispiel aufgabe={<>Berechne (3/4)⁻²</>} schritte={[<>Bruch kippen: (4/3)²</>, <>= 16/9 ≈ <b>1,78</b></>]} />
        <div className="tipp"><b>Trick:</b> negative Exponenten erzeugen Brüche kleiner als 1. Positive Exponenten erzeugen Zahlen größer als 1 (wenn Basis &gt; 1).</div>
      </Sektion>

      <Sektion nr={5} titel="Negative Basen — Vorsicht!">
        <p className="erkl">Bei negativen Basen wechselt das Vorzeichen, je nachdem ob der Exponent <b>gerade</b> oder <b>ungerade</b> ist.</p>
        <div className="karten">
          <div className="karte"><h5>Gerader Exponent</h5><p>(−2)² = 4 (positiv)</p><p>(−3)⁴ = 81 (positiv)</p></div>
          <div className="karte"><h5>Ungerader Exponent</h5><p>(−2)³ = −8 (negativ)</p><p>(−3)⁵ = −243</p></div>
        </div>
        <div className="merke"><b>Riesen-Falle!</b> Beachte den Unterschied:<br />(−3)² = (−3) · (−3) = <b>+9</b><br />−3² = −(3 · 3) = <b>−9</b><br />Die Klammer macht den Unterschied!</div>
      </Sektion>

      <Sektion nr={6} titel="Wurzeln als Umkehrung von Potenzen">
        <p className="erkl">Eine Wurzel ist die Umkehrung der Potenz. <b>√a</b> ist die Zahl, die mit sich selbst multipliziert a ergibt.</p>
        <div className="formeln">
          <Formel name="Quadratwurzel" ausdruck={<>√a · √a = a</>} hinweis="für a ≥ 0" />
          <Formel name="n-te Wurzel" ausdruck={<><sup>n</sup>√a = b ⇔ bⁿ = a</>} />
          <Formel name="Wurzel als Potenz" ausdruck={<><sup>n</sup>√a = a<sup>1/n</sup></>} />
          <Formel name="m-te Potenz, n-te Wurzel" ausdruck={<><sup>n</sup>√(a<sup>m</sup>) = a<sup>m/n</sup></>} />
        </div>
        <h3>Quadratzahlen-Tabelle</h3>
        <table>
          <thead><tr><th>n</th><th>n²</th><th>n</th><th>n²</th><th>n</th><th>n²</th></tr></thead>
          <tbody>
            <tr><td>1</td><td>1</td><td>6</td><td>36</td><td>11</td><td>121</td></tr>
            <tr><td>2</td><td>4</td><td>7</td><td>49</td><td>12</td><td>144</td></tr>
            <tr><td>3</td><td>9</td><td>8</td><td>64</td><td>13</td><td>169</td></tr>
            <tr><td>4</td><td>16</td><td>9</td><td>81</td><td>14</td><td>196</td></tr>
            <tr><td>5</td><td>25</td><td>10</td><td>100</td><td>15</td><td>225</td></tr>
          </tbody>
        </table>
        <div className="tipp"><b>Lerntipp:</b> Lerne die Quadratzahlen bis 15² = 225 auswendig — dann erkennst du Wurzeln blitzschnell.</div>
      </Sektion>

      <Sektion nr={7} titel="Wurzelgesetze">
        <div className="formeln">
          <Formel name="Wurzel eines Produkts" ausdruck={<>√(a · b) = √a · √b</>} hinweis="a, b ≥ 0" />
          <Formel name="Wurzel eines Quotienten" ausdruck={<>√(a/b) = √a / √b</>} />
          <Formel name="Wurzel einer Potenz" ausdruck={<>√(a²) = |a|</>} hinweis="immer Betrag!" />
          <Formel name="Potenz einer Wurzel" ausdruck={<>(√a)² = a</>} hinweis="für a ≥ 0" />
          <Formel name="Wurzel-Multiplikation" ausdruck={<><sup>m</sup>√(<sup>n</sup>√a) = <sup>m·n</sup>√a</>} />
          <Formel name="Teilweise wurzelziehen" ausdruck={<>√(k² · a) = k · √a</>} />
        </div>
        <Beispiel aufgabe={<>Vereinfache √72</>} schritte={[<>72 = 36 · 2</>, <>√72 = √36 · √2 = <b>6 · √2</b></>]} />
        <Beispiel aufgabe={<>Berechne √(9 · 16)</>} schritte={[<>Direkt: √144 = <b>12</b></>, <>Mit Regel: √9 · √16 = 3 · 4 = <b>12</b></>]} />
        <Beispiel aufgabe={<>Vereinfache (√5)²</>} schritte={[<>(√5)² = <b>5</b></>]} />
      </Sektion>

      <Sektion nr={8} titel="Gebrochene Exponenten">
        <p className="erkl">Brüche als Exponenten verbinden Wurzeln und Potenzen.</p>
        <div className="formeln">
          <Formel name="Bruch-Exponent" ausdruck={<>a<sup>1/n</sup> = <sup>n</sup>√a</>} />
          <Formel name="Allgemein" ausdruck={<>a<sup>m/n</sup> = <sup>n</sup>√(a<sup>m</sup>)</>} />
          <Formel name="Auch" ausdruck={<>a<sup>m/n</sup> = (<sup>n</sup>√a)<sup>m</sup></>} />
        </div>
        <Beispiel aufgabe={<>Berechne 8<sup>2/3</sup></>} schritte={[<>= (³√8)² = 2² = <b>4</b></>]} />
        <Beispiel aufgabe={<>Berechne 16<sup>0,5</sup></>} schritte={[<>0,5 = 1/2, also 16<sup>1/2</sup> = √16 = <b>4</b></>]} />
      </Sektion>

      <Sektion nr={9} titel="Zehnerpotenzen und wissenschaftliche Schreibweise">
        <p className="erkl">Damit man riesige und winzige Zahlen schreiben kann, ohne ewig Nullen zu zählen.</p>
        <h3>Tabelle</h3>
        <table>
          <thead><tr><th>Zahl</th><th>Zehnerpotenz</th><th>Name</th></tr></thead>
          <tbody>
            <tr><td>1 000 000 000</td><td>10⁹</td><td>Milliarde</td></tr>
            <tr><td>1 000 000</td><td>10⁶</td><td>Million</td></tr>
            <tr><td>1 000</td><td>10³</td><td>Tausend</td></tr>
            <tr><td>100</td><td>10²</td><td>Hundert</td></tr>
            <tr><td>10</td><td>10¹</td><td>Zehn</td></tr>
            <tr><td>1</td><td>10⁰</td><td>Eins</td></tr>
            <tr><td>0,1</td><td>10⁻¹</td><td>Zehntel</td></tr>
            <tr><td>0,01</td><td>10⁻²</td><td>Hundertstel</td></tr>
            <tr><td>0,001</td><td>10⁻³</td><td>Tausendstel · Milli</td></tr>
            <tr><td>0,000 001</td><td>10⁻⁶</td><td>Millionstel · Mikro</td></tr>
          </tbody>
        </table>
        <h3>Wissenschaftliche Schreibweise</h3>
        <p className="erkl">Form: <b>a · 10ⁿ</b> wobei 1 ≤ a &lt; 10.</p>
        <table>
          <thead><tr><th>Zahl</th><th>Wissenschaftlich</th></tr></thead>
          <tbody>
            <tr><td>3 000</td><td>3 · 10³</td></tr>
            <tr><td>45 000</td><td>4,5 · 10⁴</td></tr>
            <tr><td>720 000</td><td>7,2 · 10⁵</td></tr>
            <tr><td>0,002</td><td>2 · 10⁻³</td></tr>
            <tr><td>0,000 045</td><td>4,5 · 10⁻⁵</td></tr>
          </tbody>
        </table>
        <Beispiel aufgabe={<>Schreibe 0,000 003 als Zehnerpotenz</>} schritte={[<>Komma um 6 Stellen nach rechts</>, <>= <b>3 · 10⁻⁶</b></>]} />
        <Beispiel aufgabe={<>Berechne (2 · 10³) · (4 · 10⁵)</>} schritte={[<>Zahlen multiplizieren: 2 · 4 = 8</>, <>Potenzen multiplizieren: 10³ · 10⁵ = 10⁸</>, <>= <b>8 · 10⁸</b></>]} />
      </Sektion>

      <Sektion nr={10} titel="Wachstum und Zerfall (exponentiell)">
        <p className="erkl">Wenn etwas mit konstantem Faktor wächst oder schrumpft, ist es eine <b>Exponentialfunktion</b>.</p>
        <div className="formeln">
          <Formel name="Allgemein" ausdruck={<>N(t) = N₀ · a<sup>t</sup></>} hinweis="N₀ Startwert, a Wachstumsfaktor, t Zeit" />
          <Formel name="Wachstum (a &gt; 1)" ausdruck={<>N(t) = N₀ · (1 + p)<sup>t</sup></>} hinweis="p = Wachstumsrate (z.B. 0,05 für 5%)" />
          <Formel name="Zerfall (a &lt; 1)" ausdruck={<>N(t) = N₀ · (1 − p)<sup>t</sup></>} hinweis="p = Verlust pro Schritt" />
          <Formel name="Zinseszins" ausdruck={<>K(n) = K₀ · (1 + p)<sup>n</sup></>} hinweis="K Kapital, p Zinssatz" />
          <Formel name="Halbwertszeit" ausdruck={<>N(t) = N₀ · (1/2)<sup>t/T</sup></>} hinweis="T = Halbwertszeit" />
        </div>
        <Beispiel aufgabe={<>100 € werden 3 Jahre lang mit 5 % verzinst. Wie viel sind es nachher?</>}
          schritte={[<>K = 100 · 1,05³</>, <>1,05³ = 1,157625</>, <>K ≈ <b>115,76 €</b></>]} />
      </Sektion>

      <Sektion nr={11} titel="Logarithmen — die Umkehrung der Potenz">
        <p className="erkl">Der <b>Logarithmus</b> ist die Hochzahl, die du auf die Basis legen musst, um eine bestimmte Zahl zu bekommen.</p>
        <div className="gross">log<sub>a</sub>(b) = n &nbsp;⇔&nbsp; a<sup>n</sup> = b</div>
        <div className="formeln">
          <Formel name="Definition" ausdruck={<>log<sub>a</sub>(b) = n ⇔ a<sup>n</sup> = b</>} />
          <Formel name="Produktregel" ausdruck={<>log(a·b) = log(a) + log(b)</>} />
          <Formel name="Quotientenregel" ausdruck={<>log(a/b) = log(a) − log(b)</>} />
          <Formel name="Potenzregel" ausdruck={<>log(a<sup>n</sup>) = n · log(a)</>} />
          <Formel name="Basiswechsel" ausdruck={<>log<sub>a</sub>(b) = log(b) / log(a)</>} />
        </div>
        <Beispiel aufgabe={<>Berechne log₂(8)</>} schritte={[<>2 hoch wie viel = 8? 2³ = 8</>, <>log₂(8) = <b>3</b></>]} />
        <div className="tipp"><b>Gut zu wissen:</b> log₁₀(x) heißt „dekadischer Logarithmus", ln(x) ist der „natürliche Logarithmus" mit Basis e ≈ 2,718.</div>
      </Sektion>

      <Sektion nr={12} titel="Übungen mit Lösungen">
        <Beispiel aufgabe={<>Vereinfache: 3² · 3⁴</>} schritte={[<>= 3⁶ = <b>729</b></>]} />
        <Beispiel aufgabe={<>Vereinfache: (2 · 5)³</>} schritte={[<>= 10³ = <b>1000</b></>]} />
        <Beispiel aufgabe={<>Vereinfache: 4⁷ : 4⁵</>} schritte={[<>= 4² = <b>16</b></>]} />
        <Beispiel aufgabe={<>Berechne: (2³)²</>} schritte={[<>= 2⁶ = <b>64</b></>]} />
        <Beispiel aufgabe={<>Berechne: 10⁻²</>} schritte={[<>= 1/100 = <b>0,01</b></>]} />
        <Beispiel aufgabe={<>Vereinfache: a⁵ · a³ : a²</>} schritte={[<>5 + 3 − 2 = 6</>, <>= <b>a⁶</b></>]} />
        <Beispiel aufgabe={<>Berechne: (−3)⁴ und −3⁴</>} schritte={[<>(−3)⁴ = (−3)·(−3)·(−3)·(−3) = +<b>81</b></>, <>−3⁴ = −(3⁴) = <b>−81</b></>]} />
        <Beispiel aufgabe={<>Vereinfache: √50</>} schritte={[<>50 = 25 · 2</>, <>= <b>5 · √2</b></>]} />
        <Beispiel aufgabe={<>Berechne: 27<sup>2/3</sup></>} schritte={[<>= (³√27)² = 3² = <b>9</b></>]} />
        <Beispiel aufgabe={<>Schreibe 0,0007 wissenschaftlich</>} schritte={[<>= <b>7 · 10⁻⁴</b></>]} />
      </Sektion>

      <Sektion nr={13} titel="Schnell-Übersicht aller Formeln">
        <table>
          <thead><tr><th>Regel</th><th>Formel</th></tr></thead>
          <tbody>
            <tr><td>Gleiche Basis · multipl.</td><td>a<sup>m</sup>·a<sup>n</sup> = a<sup>m+n</sup></td></tr>
            <tr><td>Gleiche Basis · dividieren</td><td>a<sup>m</sup>:a<sup>n</sup> = a<sup>m−n</sup></td></tr>
            <tr><td>Potenz potenzieren</td><td>(a<sup>m</sup>)<sup>n</sup> = a<sup>m·n</sup></td></tr>
            <tr><td>Produkt potenzieren</td><td>(a·b)<sup>n</sup> = a<sup>n</sup>·b<sup>n</sup></td></tr>
            <tr><td>Quotient potenzieren</td><td>(a/b)<sup>n</sup> = a<sup>n</sup>/b<sup>n</sup></td></tr>
            <tr><td>Hoch 0</td><td>a⁰ = 1</td></tr>
            <tr><td>Hoch 1</td><td>a¹ = a</td></tr>
            <tr><td>Negativer Exponent</td><td>a<sup>−n</sup> = 1/a<sup>n</sup></td></tr>
            <tr><td>Wurzel als Potenz</td><td><sup>n</sup>√a = a<sup>1/n</sup></td></tr>
            <tr><td>Bruch-Exponent</td><td>a<sup>m/n</sup> = <sup>n</sup>√(a<sup>m</sup>)</td></tr>
            <tr><td>Wurzelprodukt</td><td>√(a·b) = √a · √b</td></tr>
            <tr><td>Wurzelquotient</td><td>√(a/b) = √a / √b</td></tr>
            <tr><td>Logarithmus</td><td>log<sub>a</sub>(b) = n ⇔ a<sup>n</sup> = b</td></tr>
          </tbody>
        </table>
      </Sektion>

      <p style={{ textAlign: "center", marginTop: "40px", color: "#6e6e73", fontSize: "14px" }}>Du hast die Potenzen jetzt komplett im Griff! — Anna</p>
    </div>
  );
}
