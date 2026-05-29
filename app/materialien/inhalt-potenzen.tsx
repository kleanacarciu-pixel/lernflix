"use client";
import { type ReactNode } from "react";

const STIL = `
  .mat { font-size:16px; line-height:1.7; color:#1d1d1f; }
  .mat h2 { font-family:Georgia,serif; font-size:26px; font-weight:800; color:#5856d6; margin:38px 0 14px; display:flex; align-items:center; gap:12px; }
  .mat h2 .num { background:#5856d6; color:#fff; width:36px; height:36px; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; font-size:18px; }
  .mat h3 { font-size:19px; font-weight:700; margin:22px 0 10px; }
  .mat p { margin:8px 0; }
  .mat .erkl { color:#3a3a3c; }
  .mat .formeln { display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:10px; margin:14px 0; }
  .mat .formel { background:#f0eefc; border:1.5px solid #cdc4f5; border-radius:12px; padding:14px 16px; }
  .mat .formel .name { font-size:12px; color:#5856d6; font-weight:700; text-transform:uppercase; letter-spacing:0.06em; margin-bottom:6px; }
  .mat .formel .ausdruck { font-family:Georgia,serif; font-size:18px; font-weight:700; }
  .mat .formel .hinweis { font-size:13px; color:#6e6e73; margin-top:6px; }
  .mat .gross { text-align:center; font-family:Georgia,serif; font-size:32px; font-weight:800; padding:22px 0; background:linear-gradient(135deg,#f3f0ff,#e9e3ff); border-radius:14px; margin:12px 0; }
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
  .mat td { padding:10px 12px; border-bottom:1px solid #ececec; font-size:15px; }
  .mat tr:nth-child(even) td { background:#fafafe; }
  .mat .pyr { display:flex; gap:6px; justify-content:center; align-items:flex-end; margin:12px 0; }
  .mat .pyr div { background:#5856d6; color:#fff; padding:6px 10px; border-radius:6px; font-weight:700; font-family:Georgia,serif; }
`;

function Sektion({ nr, titel, children }: { nr: number; titel: string; children: ReactNode }) {
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

      <p className="erkl">Potenzen sind eine Abkürzung fürs Multiplizieren. Statt 2 · 2 · 2 · 2 · 2 schreibst du einfach <b>2⁵</b>. In diesem Heft lernst du alle Regeln Schritt für Schritt — mit Beispielen, die du sofort verstehst.</p>

      <Sektion nr={1} titel="Was ist eine Potenz?">
        <p className="erkl">Eine Potenz hat zwei Teile: die <b>Basis</b> (was multipliziert wird) und den <b>Exponenten</b> (wie oft multipliziert wird).</p>
        <div className="gross">
          a<sup style={{ color: "#5856d6" }}>n</sup> &nbsp;=&nbsp; a · a · a · … · a &nbsp;<span style={{ fontSize: "16px", color: "#6e6e73" }}>(n-mal)</span>
        </div>
        <p>Beispiele: 2³ = 2 · 2 · 2 = 8. Oder 5² = 5 · 5 = 25. Oder 10⁴ = 10·10·10·10 = 10 000.</p>
        <div className="tipp"><b>Sprechweise:</b> „2 hoch 3 ist 8." Oder „5 zum Quadrat ist 25" (² nennt man Quadrat, ³ nennt man Kubik).</div>
        <table>
          <thead><tr><th>Schreibweise</th><th>So sagt man</th><th>Ergebnis</th></tr></thead>
          <tbody>
            <tr><td>3²</td><td>3 zum Quadrat</td><td>9</td></tr>
            <tr><td>2³</td><td>2 hoch 3</td><td>8</td></tr>
            <tr><td>2⁵</td><td>2 hoch 5</td><td>32</td></tr>
            <tr><td>10³</td><td>10 hoch 3</td><td>1 000</td></tr>
            <tr><td>10⁶</td><td>10 hoch 6</td><td>1 000 000</td></tr>
          </tbody>
        </table>
      </Sektion>

      <Sektion nr={2} titel="Die fünf Potenzgesetze">
        <p className="erkl">Diese fünf Regeln musst du auswendig kennen — danach kannst du fast alle Potenzaufgaben lösen.</p>

        <h3>Regel 1 — Gleiche Basis, multiplizieren</h3>
        <div className="formeln"><Formel name="Multiplikation gleicher Basis" ausdruck={<>a<sup>m</sup> · a<sup>n</sup> = a<sup>m + n</sup></>} hinweis="Exponenten addieren" /></div>
        <Beispiel aufgabe={<>2³ · 2⁴ = ?</>} schritte={[<>Basis gleich (2), Exponenten addieren: 3 + 4 = 7</>, <>Ergebnis: <b>2⁷ = 128</b></>]} />

        <h3>Regel 2 — Gleiche Basis, dividieren</h3>
        <div className="formeln"><Formel name="Division gleicher Basis" ausdruck={<>a<sup>m</sup> : a<sup>n</sup> = a<sup>m − n</sup></>} hinweis="Exponenten subtrahieren" /></div>
        <Beispiel aufgabe={<>5⁷ : 5³ = ?</>} schritte={[<>Basis gleich (5), Exponenten subtrahieren: 7 − 3 = 4</>, <>Ergebnis: <b>5⁴ = 625</b></>]} />

        <h3>Regel 3 — Potenz potenzieren</h3>
        <div className="formeln"><Formel name="Potenz von Potenz" ausdruck={<>(a<sup>m</sup>)<sup>n</sup> = a<sup>m · n</sup></>} hinweis="Exponenten multiplizieren" /></div>
        <Beispiel aufgabe={<>(2³)² = ?</>} schritte={[<>Exponenten multiplizieren: 3 · 2 = 6</>, <>Ergebnis: <b>2⁶ = 64</b></>]} />

        <h3>Regel 4 — Gleicher Exponent, Basen multiplizieren</h3>
        <div className="formeln"><Formel name="Produkt potenzieren" ausdruck={<>(a · b)<sup>n</sup> = a<sup>n</sup> · b<sup>n</sup></>} /></div>
        <Beispiel aufgabe={<>(2 · 3)² = ?</>} schritte={[<>Variante A: (2 · 3)² = 6² = <b>36</b></>, <>Variante B: 2² · 3² = 4 · 9 = <b>36</b></>]} />

        <h3>Regel 5 — Gleicher Exponent, Basen dividieren</h3>
        <div className="formeln"><Formel name="Quotient potenzieren" ausdruck={<>(a : b)<sup>n</sup> = a<sup>n</sup> : b<sup>n</sup></>} /></div>
        <Beispiel aufgabe={<>(6 : 2)³ = ?</>} schritte={[<>(6 : 2)³ = 3³ = <b>27</b></>]} />

        <div className="tipp"><b>Eselsbrücke:</b> Bei <i>gleicher Basis</i> rechnest du mit den <i>Exponenten</i> (addieren oder subtrahieren). Bei <i>gleichem Exponenten</i> rechnest du mit den <i>Basen</i>.</div>
      </Sektion>

      <Sektion nr={3} titel="Sonderfälle: hoch 0, hoch 1 und negative Exponenten">
        <div className="formeln">
          <Formel name="Hoch 1" ausdruck={<>a<sup>1</sup> = a</>} />
          <Formel name="Hoch 0" ausdruck={<>a<sup>0</sup> = 1</>} hinweis="(für a ≠ 0)" />
          <Formel name="Negativer Exponent" ausdruck={<>a<sup>−n</sup> = 1 : a<sup>n</sup></>} />
        </div>
        <Beispiel aufgabe={<>Berechne 2⁻³</>} schritte={[<>2⁻³ = 1 : 2³ = 1 : 8</>, <>= <b>0,125</b> (oder als Bruch: ein Achtel)</>]} />
        <Beispiel aufgabe={<>Berechne 5⁰</>} schritte={[<>Jede Zahl (außer 0) hoch 0 ist <b>1</b></>]} />
        <div className="merke"><b>Achtung:</b> 0⁰ ist nicht definiert. Vermeide das. Aber jede andere Zahl hoch 0 = 1.</div>
      </Sektion>

      <Sektion nr={4} titel="Wurzeln und gebrochene Exponenten">
        <p className="erkl">Wurzeln sind die Umkehrung von Potenzen. Wenn du 5² = 25 hast, dann ist √25 = 5.</p>
        <div className="formeln">
          <Formel name="Quadratwurzel" ausdruck={<>√a · √a = a</>} />
          <Formel name="n-te Wurzel als Potenz" ausdruck={<><sup>n</sup>√a = a<sup>1/n</sup></>} />
          <Formel name="Wurzel von Produkt" ausdruck={<>√(a · b) = √a · √b</>} />
          <Formel name="Wurzel von Quotient" ausdruck={<>√(a : b) = √a : √b</>} />
        </div>
        <Beispiel aufgabe={<>Berechne √(9 · 16) auf zwei Wegen.</>} schritte={[<>Direkt: √144 = <b>12</b></>, <>Mit Regel: √9 · √16 = 3 · 4 = <b>12</b></>]} />
        <div className="tipp"><b>Lerntipp:</b> Lerne die Quadratzahlen auswendig: 1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144. Dann erkennst du Wurzeln sofort.</div>
      </Sektion>

      <Sektion nr={5} titel="Zehnerpotenzen und wissenschaftliche Schreibweise">
        <p className="erkl">Zehnerpotenzen helfen bei sehr großen und sehr kleinen Zahlen.</p>
        <div className="pyr">
          <div>10⁰ = 1</div><div>10¹ = 10</div><div>10² = 100</div><div>10³ = 1 000</div><div>10⁶ = 1 Mio</div>
        </div>
        <table>
          <thead><tr><th>Zahl</th><th>Schreibweise</th></tr></thead>
          <tbody>
            <tr><td>3 000</td><td>3 · 10³</td></tr>
            <tr><td>45 000</td><td>4,5 · 10⁴</td></tr>
            <tr><td>720 000</td><td>7,2 · 10⁵</td></tr>
            <tr><td>0,001</td><td>1 · 10⁻³</td></tr>
            <tr><td>0,000 045</td><td>4,5 · 10⁻⁵</td></tr>
          </tbody>
        </table>
        <Beispiel aufgabe={<>Schreibe 0,002 als Zehnerpotenz.</>} schritte={[<>0,002 = 2 : 1 000 = 2 : 10³</>, <>= <b>2 · 10⁻³</b></>]} />
      </Sektion>

      <Sektion nr={6} titel="Üben und prüfen — Aufgaben mit Lösungen">
        <Beispiel aufgabe={<>Vereinfache: 3² · 3⁴</>} schritte={[<>3² · 3⁴ = 3<sup>2+4</sup> = <b>3⁶ = 729</b></>]} />
        <Beispiel aufgabe={<>Vereinfache: (2 · 5)³</>} schritte={[<>= 2³ · 5³ = 8 · 125 = <b>1000</b></>]} />
        <Beispiel aufgabe={<>Vereinfache: 4⁷ : 4⁵</>} schritte={[<>= 4<sup>7−5</sup> = <b>4² = 16</b></>]} />
        <Beispiel aufgabe={<>Berechne (2³)²</>} schritte={[<>= 2<sup>3·2</sup> = <b>2⁶ = 64</b></>]} />
        <Beispiel aufgabe={<>Berechne 10⁻²</>} schritte={[<>= 1 : 10² = 1 : 100 = <b>0,01</b></>]} />
        <Beispiel aufgabe={<>Vereinfache: a⁵ · a³ : a² (alles gleiche Basis a)</>} schritte={[<>= a<sup>5+3−2</sup> = <b>a⁶</b></>]} />
      </Sektion>

      <p style={{ textAlign: "center", marginTop: "40px", color: "#6e6e73", fontSize: "14px" }}>Du hast die Potenzen jetzt im Griff! — Anna</p>
    </div>
  );
}
