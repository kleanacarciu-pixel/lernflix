"use client";
import { type ReactNode } from "react";

const STIL = `
  .mat { font-size:16px; line-height:1.7; color:#1d1d1f; }
  .mat h2 { font-family:Georgia,serif; font-size:26px; font-weight:800; color:#ef4444; margin:38px 0 14px; display:flex; align-items:center; gap:12px; }
  .mat h2 .num { background:#ef4444; color:#fff; width:36px; height:36px; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; font-size:18px; }
  .mat h3 { font-size:19px; font-weight:700; margin:22px 0 10px; }
  .mat p { margin:8px 0; }
  .mat .erkl { color:#3a3a3c; }
  .mat .fig { background:#fff5f5; border-radius:14px; padding:18px; margin:14px 0; display:flex; justify-content:center; }
  .mat .fig figcaption { font-size:13px; color:#6e6e73; text-align:center; margin-top:8px; }
  .mat .formeln { display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:10px; margin:14px 0; }
  .mat .formel { background:#fff1f1; border:1.5px solid #fbcaca; border-radius:12px; padding:14px 16px; }
  .mat .formel .name { font-size:12px; color:#b91c1c; font-weight:700; text-transform:uppercase; letter-spacing:0.06em; margin-bottom:6px; }
  .mat .formel .ausdruck { font-family:Georgia,serif; font-size:18px; font-weight:700; }
  .mat .formel .hinweis { font-size:13px; color:#6e6e73; margin-top:6px; }
  .mat .beispiel { background:#eef6ff; border-left:4px solid #ef4444; border-radius:10px; padding:14px 18px; margin:14px 0; }
  .mat .beispiel .lbl { font-size:12px; font-weight:700; color:#ef4444; text-transform:uppercase; letter-spacing:0.06em; margin-bottom:6px; }
  .mat .beispiel ol { padding-left:22px; margin:8px 0 0; }
  .mat .beispiel li { margin:6px 0; }
  .mat .merke { background:#fff8e6; border-left:4px solid #f59e0b; border-radius:10px; padding:12px 16px; margin:14px 0; font-size:15px; }
  .mat .merke b { color:#a37300; }
  .mat .tipp { background:#e7f7ec; border-left:4px solid #34c759; border-radius:10px; padding:12px 16px; margin:14px 0; font-size:15px; }
  .mat .tipp b { color:#1f7f3a; }
  .mat .einheit { background:#fff; border:1px solid #ececec; border-radius:10px; padding:10px 14px; margin:8px 0; }
  .mat table { width:100%; border-collapse:collapse; margin:14px 0; }
  .mat th { background:#ef4444; color:#fff; padding:10px 12px; text-align:left; font-size:14px; }
  .mat td { padding:10px 12px; border-bottom:1px solid #ececec; font-size:15px; }
  .mat tr:nth-child(even) td { background:#fff8f8; }
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

export function InhaltMechanik() {
  return (
    <div className="mat">
      <style>{STIL}</style>

      <p className="erkl">In diesem Heft lernst du alle wichtigen Themen der Mechanik: Geschwindigkeit, Beschleunigung, Kraft, Energie, Hebel und Reibung. Mit Skizzen aus dem Alltag und durchgerechneten Beispielen.</p>

      <Sektion nr={1} titel="Geschwindigkeit (v)">
        <p className="erkl">Geschwindigkeit ist <b>Strecke geteilt durch Zeit</b>. Wenn ein Auto in 2 Stunden 100 km fährt, ist es 50 km/h schnell.</p>
        <figure className="fig">
          <div>
            <svg width="320" height="120" viewBox="0 0 320 120">
              <line x1="20" y1="80" x2="300" y2="80" stroke="#1d1d1f" strokeWidth="2" />
              <rect x="40" y="55" width="50" height="25" rx="4" fill="#ef4444" />
              <circle cx="52" cy="85" r="6" fill="#1d1d1f" /><circle cx="78" cy="85" r="6" fill="#1d1d1f" />
              <text x="50" y="48" fontSize="13" fill="#6e6e73">Start</text>
              <line x1="270" y1="65" x2="290" y2="65" stroke="#1d1d1f" strokeWidth="2" /><polygon points="290,60 300,65 290,70" fill="#1d1d1f" />
              <text x="240" y="55" fontSize="13" fill="#ef4444" fontWeight="700">v</text>
              <text x="160" y="105" fontSize="13" fill="#6e6e73">Strecke s = 100 km in Zeit t = 2 h</text>
            </svg>
            <figcaption>Geschwindigkeit = wie viel Strecke pro Zeit?</figcaption>
          </div>
        </figure>
        <div className="formeln">
          <Formel name="Geschwindigkeit" ausdruck={<>v = s : t</>} hinweis="Strecke geteilt durch Zeit" />
          <Formel name="Strecke berechnen" ausdruck={<>s = v · t</>} />
          <Formel name="Zeit berechnen" ausdruck={<>t = s : v</>} />
        </div>
        <div className="einheit"><b>Einheiten:</b> v in m/s oder km/h. Umrechnung: 1 m/s = 3,6 km/h. Also: 10 m/s = 36 km/h.</div>
        <Beispiel aufgabe={<>Ein Radfahrer fährt 30 km in 2 Stunden. Wie schnell ist er?</>}
          schritte={[<>Formel: v = s : t</>, <>v = 30 km : 2 h</>, <>v = <b>15 km/h</b></>]} />
      </Sektion>

      <Sektion nr={2} titel="Beschleunigung (a)">
        <p className="erkl">Beschleunigung sagt, wie schnell sich die Geschwindigkeit ändert. Wenn ein Auto in 5 Sekunden von 0 auf 50 m/s kommt, ist die Beschleunigung 10 m/s².</p>
        <div className="formeln">
          <Formel name="Beschleunigung" ausdruck={<>a = Δv : t</>} hinweis="Δv = Geschwindigkeitsänderung" />
          <Formel name="Endgeschwindigkeit" ausdruck={<>v = a · t</>} hinweis="(aus dem Stand)" />
          <Formel name="Strecke beim Beschleunigen" ausdruck={<>s = ½ · a · t²</>} />
        </div>
        <div className="einheit"><b>Einheit:</b> m/s² (Meter pro Sekunde-Quadrat). Die <b>Erdbeschleunigung</b> ist g ≈ 9,81 m/s².</div>
        <Beispiel aufgabe={<>Ein Auto beschleunigt aus dem Stand mit 4 m/s² über 3 Sekunden. Wie schnell ist es dann?</>}
          schritte={[<>Formel: v = a · t</>, <>v = 4 · 3 = <b>12 m/s</b> (das sind 43,2 km/h)</>]} />
      </Sektion>

      <Sektion nr={3} titel="Kraft (F) — die Newton'schen Gesetze">
        <p className="erkl">Eine <b>Kraft</b> wirkt auf Gegenstände — sie verändert die Bewegung oder verformt etwas. Die Einheit ist <b>Newton (N)</b>.</p>
        <figure className="fig">
          <div>
            <svg width="320" height="140" viewBox="0 0 320 140">
              <rect x="120" y="60" width="80" height="50" rx="4" fill="#ef4444" />
              <text x="148" y="92" fontSize="14" fontWeight="700" fill="#fff">m</text>
              <line x1="200" y1="85" x2="280" y2="85" stroke="#0071e3" strokeWidth="3" />
              <polygon points="278,78 295,85 278,92" fill="#0071e3" />
              <text x="240" y="75" fontSize="14" fontWeight="700" fill="#0071e3">F</text>
              <line x1="100" y1="120" x2="220" y2="120" stroke="#1d1d1f" strokeWidth="2" />
              <text x="240" y="125" fontSize="13" fill="#34c759">a →</text>
            </svg>
            <figcaption>Kraft F wirkt auf Masse m und verursacht Beschleunigung a</figcaption>
          </div>
        </figure>
        <div className="formeln">
          <Formel name="Newton's 2. Gesetz" ausdruck={<>F = m · a</>} hinweis="Kraft = Masse · Beschleunigung" />
          <Formel name="Gewichtskraft" ausdruck={<>F<sub>G</sub> = m · g</>} hinweis="g ≈ 9,81 m/s² (Erde)" />
        </div>
        <div className="einheit"><b>1 Newton (N)</b> = die Kraft, die eine Masse von 1 kg um 1 m/s² beschleunigt.</div>
        <Beispiel aufgabe={<>Eine Masse von 5 kg wird mit 2 m/s² beschleunigt. Wie groß ist die Kraft?</>}
          schritte={[<>F = m · a = 5 · 2 = <b>10 N</b></>]} />
        <Beispiel aufgabe={<>Welche Gewichtskraft hat eine Schultasche von 8 kg?</>}
          schritte={[<>F<sub>G</sub> = m · g = 8 · 9,81</>, <>= <b>78,48 N</b> (etwa 78 Newton)</>]} />
        <div className="tipp"><b>Merke die 3 Newton-Gesetze:</b><br />1. Ohne Kraft bleibt ein Körper in Ruhe (oder gleichförmiger Bewegung).<br />2. F = m · a — Kraft verursacht Beschleunigung.<br />3. Aktion = Reaktion — jede Kraft hat eine gleich große Gegenkraft.</div>
      </Sektion>

      <Sektion nr={4} titel="Energie und Arbeit">
        <p className="erkl">Wenn du etwas hochhebst oder beschleunigst, leistest du <b>Arbeit</b>. Diese Arbeit wird in <b>Energie</b> umgewandelt — sie kann nicht verloren gehen, nur umgewandelt werden.</p>
        <div className="formeln">
          <Formel name="Arbeit" ausdruck={<>W = F · s</>} hinweis="Kraft · Weg" />
          <Formel name="Bewegungs­energie" ausdruck={<>E<sub>kin</sub> = ½ · m · v²</>} hinweis="kinetische Energie" />
          <Formel name="Lageenergie" ausdruck={<>E<sub>pot</sub> = m · g · h</>} hinweis="potentielle Energie (Höhe h)" />
          <Formel name="Leistung" ausdruck={<>P = W : t</>} hinweis="Arbeit pro Zeit" />
        </div>
        <div className="einheit"><b>Einheiten:</b> Arbeit und Energie in <b>Joule (J)</b>. Leistung in <b>Watt (W)</b>. 1 W = 1 J pro Sekunde.</div>
        <Beispiel aufgabe={<>Du hebst einen 2-kg-Karton 1,5 m hoch. Welche Lageenergie hat er dann?</>}
          schritte={[<>E<sub>pot</sub> = m · g · h = 2 · 9,81 · 1,5</>, <>≈ <b>29,4 J</b></>]} />
        <Beispiel aufgabe={<>Ein 10 kg schwerer Ball rollt mit 4 m/s. Welche kinetische Energie hat er?</>}
          schritte={[<>E<sub>kin</sub> = ½ · m · v² = ½ · 10 · 4²</>, <>= 0,5 · 10 · 16 = <b>80 J</b></>]} />
        <div className="merke"><b>Achtung:</b> bei E<sub>kin</sub> wird das v <i>quadriert</i> — doppelte Geschwindigkeit = <i>viermal</i> so viel Energie. Deshalb sind Crashs bei hohem Tempo so gefährlich.</div>
      </Sektion>

      <Sektion nr={5} titel="Hebel und Drehmoment">
        <p className="erkl">Ein Hebel hilft dir, mit wenig Kraft viel zu bewegen — wie bei einer Wippe oder beim Brecheisen. Es gilt: <b>Kraft · Kraftarm = Last · Lastarm.</b></p>
        <figure className="fig">
          <div>
            <svg width="340" height="170" viewBox="0 0 340 170">
              <polygon points="160,110 150,140 170,140" fill="#1d1d1f" />
              <line x1="40" y1="110" x2="300" y2="110" stroke="#1d1d1f" strokeWidth="4" />
              <rect x="40" y="80" width="40" height="30" fill="#ef4444" />
              <text x="50" y="100" fontSize="14" fontWeight="700" fill="#fff">L</text>
              <line x1="280" y1="60" x2="280" y2="100" stroke="#0071e3" strokeWidth="3" />
              <polygon points="275,98 280,110 285,98" fill="#0071e3" />
              <text x="270" y="55" fontSize="14" fontWeight="700" fill="#0071e3">F</text>
              <line x1="60" y1="130" x2="160" y2="130" stroke="#34c759" strokeWidth="1.5" />
              <text x="95" y="150" fontSize="12" fill="#34c759">Lastarm</text>
              <line x1="160" y1="130" x2="280" y2="130" stroke="#5856d6" strokeWidth="1.5" />
              <text x="195" y="150" fontSize="12" fill="#5856d6">Kraftarm</text>
            </svg>
            <figcaption>Hebelgesetz: Last (L) · Lastarm = Kraft (F) · Kraftarm</figcaption>
          </div>
        </figure>
        <div className="formeln">
          <Formel name="Hebelgesetz" ausdruck={<>F<sub>1</sub> · l<sub>1</sub> = F<sub>2</sub> · l<sub>2</sub></>} />
          <Formel name="Drehmoment" ausdruck={<>M = F · l</>} hinweis="(Einheit: Newtonmeter, Nm)" />
        </div>
        <Beispiel aufgabe={<>Ein Kind (300 N) sitzt 2 m vom Drehpunkt einer Wippe. Wie weit muss ein Erwachsener (600 N) auf der anderen Seite sitzen, damit es im Gleichgewicht ist?</>}
          schritte={[<>F<sub>1</sub> · l<sub>1</sub> = F<sub>2</sub> · l<sub>2</sub></>, <>300 · 2 = 600 · l<sub>2</sub> &nbsp;⇒&nbsp; 600 = 600 · l<sub>2</sub></>, <>l<sub>2</sub> = <b>1 m</b></>]} />
        <div className="tipp"><b>Goldene Regel der Mechanik:</b> Was man an Kraft spart, muss man an Weg zahlen (und umgekehrt).</div>
      </Sektion>

      <Sektion nr={6} titel="Reibung und Wirkungsgrad">
        <p className="erkl">Reibung wirkt immer der Bewegung entgegen. Es gibt drei Arten: Haftreibung, Gleitreibung und Rollreibung.</p>
        <table>
          <thead><tr><th>Art</th><th>Wann</th><th>Stärke</th></tr></thead>
          <tbody>
            <tr><td>Haftreibung</td><td>Solange noch nichts bewegt wird</td><td>am größten</td></tr>
            <tr><td>Gleitreibung</td><td>Wenn etwas gleitet (Schuhe auf Boden)</td><td>mittel</td></tr>
            <tr><td>Rollreibung</td><td>Bei rollenden Rädern</td><td>am kleinsten</td></tr>
          </tbody>
        </table>
        <div className="formeln">
          <Formel name="Reibungskraft" ausdruck={<>F<sub>R</sub> = μ · F<sub>N</sub></>} hinweis="μ = Reibungszahl, F_N = Normalkraft" />
          <Formel name="Wirkungsgrad" ausdruck={<>η = E<sub>nutz</sub> : E<sub>auf</sub></>} hinweis="meist in Prozent" />
        </div>
        <Beispiel aufgabe={<>Eine Kiste (Gewichtskraft 200 N) wird über den Boden gezogen. Reibungszahl μ = 0,3. Wie groß ist die Reibungskraft?</>}
          schritte={[<>F<sub>R</sub> = μ · F<sub>N</sub> = 0,3 · 200</>, <>= <b>60 N</b></>]} />
        <div className="merke"><b>Achtung:</b> Reibung ist nicht immer schlecht! Ohne Haftreibung könntest du nicht gehen, und Auto-Bremsen würden nicht funktionieren.</div>
      </Sektion>

      <Sektion nr={7} titel="Schnell-Übersicht aller Formeln">
        <table>
          <thead><tr><th>Größe</th><th>Formel</th><th>Einheit</th></tr></thead>
          <tbody>
            <tr><td>Geschwindigkeit</td><td>v = s : t</td><td>m/s · km/h</td></tr>
            <tr><td>Beschleunigung</td><td>a = Δv : t</td><td>m/s²</td></tr>
            <tr><td>Kraft</td><td>F = m · a</td><td>N (Newton)</td></tr>
            <tr><td>Gewichtskraft</td><td>F<sub>G</sub> = m · g</td><td>N</td></tr>
            <tr><td>Arbeit</td><td>W = F · s</td><td>J (Joule)</td></tr>
            <tr><td>Lageenergie</td><td>E<sub>pot</sub> = m · g · h</td><td>J</td></tr>
            <tr><td>Bewegungsenergie</td><td>E<sub>kin</sub> = ½ · m · v²</td><td>J</td></tr>
            <tr><td>Leistung</td><td>P = W : t</td><td>W (Watt)</td></tr>
            <tr><td>Hebel</td><td>F<sub>1</sub>·l<sub>1</sub> = F<sub>2</sub>·l<sub>2</sub></td><td>—</td></tr>
            <tr><td>Reibungskraft</td><td>F<sub>R</sub> = μ · F<sub>N</sub></td><td>N</td></tr>
          </tbody>
        </table>
      </Sektion>

      <p style={{ textAlign: "center", marginTop: "40px", color: "#6e6e73", fontSize: "14px" }}>Viel Erfolg in Physik! — Anna</p>
    </div>
  );
}
