"use client";
import { type ReactNode } from "react";

const STIL = `
  .mat { font-size:16px; line-height:1.7; color:#1d1d1f; }
  .mat h2 { font-family:Georgia,serif; font-size:26px; font-weight:800; color:#0071e3; margin:38px 0 14px; display:flex; align-items:center; gap:12px; }
  .mat h2 .num { background:#0071e3; color:#fff; min-width:36px; height:36px; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; font-size:18px; padding:0 6px; }
  .mat h3 { font-size:19px; font-weight:700; margin:22px 0 10px; color:#1d1d1f; }
  .mat h4 { font-size:16px; font-weight:700; margin:14px 0 6px; color:#0071e3; }
  .mat p { margin:8px 0; }
  .mat .erkl { font-size:16px; color:#3a3a3c; }
  .mat .fig { background:#f8f8fb; border-radius:14px; padding:18px; margin:14px 0; display:flex; justify-content:center; flex-wrap:wrap; gap:18px; }
  .mat .fig figcaption { font-size:13px; color:#6e6e73; text-align:center; margin-top:8px; }
  .mat .formeln { display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:10px; margin:14px 0; }
  .mat .formel { background:#fff8e6; border:1.5px solid #f5d76e; border-radius:12px; padding:12px 16px; }
  .mat .formel .name { font-size:12px; color:#a37300; font-weight:700; text-transform:uppercase; letter-spacing:0.06em; margin-bottom:4px; }
  .mat .formel .ausdruck { font-family:Georgia,serif; font-size:17px; font-weight:700; color:#1d1d1f; }
  .mat .formel .hinweis { font-size:13px; color:#6e6e73; margin-top:4px; }
  .mat .beispiel { background:#e6f0fe; border-left:4px solid #0071e3; border-radius:10px; padding:14px 18px; margin:14px 0; }
  .mat .beispiel .lbl { font-size:12px; font-weight:700; color:#0071e3; text-transform:uppercase; letter-spacing:0.06em; margin-bottom:6px; }
  .mat .beispiel ol { padding-left:22px; margin:8px 0 0; }
  .mat .beispiel li { margin:6px 0; }
  .mat .tipp { background:#e7f7ec; border-left:4px solid #34c759; border-radius:10px; padding:12px 16px; margin:14px 0; font-size:15px; }
  .mat .tipp b { color:#1f7f3a; }
  .mat .merke { background:#fdecea; border-left:4px solid #ef4444; border-radius:10px; padding:12px 16px; margin:14px 0; font-size:15px; }
  .mat .merke b { color:#b91c1c; }
  .mat .karten { display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:12px; margin:14px 0; }
  .mat .karte { background:#fff; border:1px solid #ececec; border-radius:14px; padding:14px 16px; }
  .mat .karte h5 { font-size:15px; font-weight:700; margin:0 0 6px; color:#0071e3; }
  .mat table { width:100%; border-collapse:collapse; margin:14px 0; font-size:14.5px; }
  .mat th { background:#0071e3; color:#fff; padding:9px 12px; text-align:left; font-size:13px; }
  .mat td { padding:8px 12px; border-bottom:1px solid #ececec; }
  .mat tr:nth-child(even) td { background:#f6f8fc; }
  @media print { .mat .fig, .mat .beispiel, .mat .karte { break-inside:avoid; } }
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

export function InhaltGeometrie() {
  return (
    <div className="mat">
      <style>{STIL}</style>

      <p className="erkl">In diesem Heft findest du <b>alle</b> Formeln und Sätze der Schulgeometrie — von Klasse 6 bis 10 — mit beschrifteten Skizzen, Erklärungen und durchgerechneten Beispielen. Du brauchst kein Schulbuch mehr daneben. Druck es aus oder lass es auf dem Tablet offen, während du übst.</p>

      <Sektion nr={1} titel="Winkel und Winkelsätze">
        <p className="erkl">Ein <b>Winkel</b> entsteht, wenn zwei Halbgeraden in einem Punkt (dem Scheitelpunkt S) zusammentreffen. Winkel misst man in <b>Grad (°)</b>. Ein voller Kreis hat 360°.</p>
        <figure className="fig">
          <div>
            <svg width="280" height="160" viewBox="0 0 280 160">
              <line x1="30" y1="130" x2="270" y2="130" stroke="#1d1d1f" strokeWidth="2.5" />
              <line x1="30" y1="130" x2="230" y2="20" stroke="#1d1d1f" strokeWidth="2.5" />
              <path d="M 80 130 A 50 50 0 0 0 56 105" stroke="#0071e3" strokeWidth="2.5" fill="none" />
              <text x="68" y="116" fill="#0071e3" fontSize="14" fontWeight="700">α</text>
              <circle cx="30" cy="130" r="4" fill="#1d1d1f" />
              <text x="14" y="148" fontSize="13" fill="#6e6e73">S</text>
            </svg>
            <figcaption>Winkel α am Scheitel S</figcaption>
          </div>
        </figure>
        <h3>Arten von Winkeln</h3>
        <div className="karten">
          <div className="karte"><h5>Spitzer Winkel</h5><p>0° &lt; α &lt; 90°</p></div>
          <div className="karte"><h5>Rechter Winkel</h5><p>α = 90°</p></div>
          <div className="karte"><h5>Stumpfer Winkel</h5><p>90° &lt; α &lt; 180°</p></div>
          <div className="karte"><h5>Gestreckter Winkel</h5><p>α = 180°</p></div>
          <div className="karte"><h5>Überstumpfer Winkel</h5><p>180° &lt; α &lt; 360°</p></div>
          <div className="karte"><h5>Vollwinkel</h5><p>α = 360°</p></div>
        </div>
        <h3>Wichtige Winkelsätze</h3>
        <div className="formeln">
          <Formel name="Nebenwinkel" ausdruck={<>α + β = 180°</>} hinweis="ergänzen sich zu 180°" />
          <Formel name="Scheitelwinkel" ausdruck={<>α = β</>} hinweis="gleich groß" />
          <Formel name="Stufenwinkel" ausdruck={<>α = β</>} hinweis="bei parallelen Linien" />
          <Formel name="Wechselwinkel" ausdruck={<>α = β</>} hinweis="bei parallelen Linien" />
          <Formel name="Winkelsumme Dreieck" ausdruck={<>α + β + γ = 180°</>} />
          <Formel name="Winkelsumme Viereck" ausdruck={<>= 360°</>} />
          <Formel name="Winkelsumme n-Eck" ausdruck={<>(n − 2) · 180°</>} />
          <Formel name="Außenwinkel Dreieck" ausdruck={<>γ' = α + β</>} hinweis="Summe der nicht anliegenden Winkel" />
        </div>
        <Beispiel aufgabe={<>Im Dreieck ist α = 50°, β = 70°. Wie groß ist γ?</>} schritte={[<>γ = 180° − α − β = 180° − 50° − 70°</>, <>γ = <b>60°</b></>]} />
      </Sektion>

      <Sektion nr={2} titel="Dreiecke — Grundlagen">
        <p className="erkl">Ein Dreieck hat 3 Ecken (A, B, C), 3 Seiten (a, b, c) und 3 Winkel (α, β, γ). Die Seite a liegt der Ecke A gegenüber.</p>
        <figure className="fig">
          <div>
            <svg width="280" height="200" viewBox="0 0 280 200">
              <polygon points="40,170 240,170 130,30" fill="#e6f0fe" stroke="#0071e3" strokeWidth="2.5" />
              <text x="20" y="185" fontSize="14" fontWeight="700">A</text>
              <text x="245" y="185" fontSize="14" fontWeight="700">B</text>
              <text x="125" y="22" fontSize="14" fontWeight="700">C</text>
              <text x="135" y="190" fontSize="14" fontWeight="700" fill="#0071e3">c</text>
              <text x="60" y="100" fontSize="14" fontWeight="700" fill="#0071e3">b</text>
              <text x="195" y="100" fontSize="14" fontWeight="700" fill="#0071e3">a</text>
            </svg>
            <figcaption>Bezeichnungen im Dreieck</figcaption>
          </div>
        </figure>
        <h3>Arten von Dreiecken</h3>
        <div className="karten">
          <div className="karte"><h5>Gleichseitig</h5><p>Alle Seiten gleich, alle Winkel 60°</p></div>
          <div className="karte"><h5>Gleichschenklig</h5><p>2 gleiche Seiten, 2 gleiche Basiswinkel</p></div>
          <div className="karte"><h5>Rechtwinklig</h5><p>Ein Winkel = 90°</p></div>
          <div className="karte"><h5>Spitzwinklig</h5><p>Alle Winkel &lt; 90°</p></div>
          <div className="karte"><h5>Stumpfwinklig</h5><p>Ein Winkel &gt; 90°</p></div>
        </div>
        <h3>Flächenformeln</h3>
        <div className="formeln">
          <Formel name="Allgemein" ausdruck={<>A = ½ · g · h</>} hinweis="g = Grundseite, h = zugehörige Höhe" />
          <Formel name="Heron-Formel" ausdruck={<>A = √(s·(s−a)·(s−b)·(s−c))</>} hinweis="s = (a+b+c)/2 (halber Umfang)" />
          <Formel name="Mit Sinus" ausdruck={<>A = ½ · a · b · sin(γ)</>} hinweis="für jeden Winkel zwischen 2 Seiten" />
          <Formel name="Gleichseitig" ausdruck={<>A = (a²·√3)/4</>} hinweis="bei Seitenlänge a" />
        </div>
        <h3>Umfang</h3>
        <div className="formeln">
          <Formel name="Umfang" ausdruck={<>U = a + b + c</>} />
          <Formel name="Gleichseitig" ausdruck={<>U = 3 · a</>} />
        </div>
        <h3>Besondere Punkte</h3>
        <table>
          <thead><tr><th>Punkt</th><th>Schnittpunkt von</th></tr></thead>
          <tbody>
            <tr><td>Schwerpunkt S</td><td>den drei Seitenhalbierenden</td></tr>
            <tr><td>Umkreismittelpunkt U</td><td>den drei Mittelsenkrechten</td></tr>
            <tr><td>Inkreismittelpunkt I</td><td>den drei Winkelhalbierenden</td></tr>
            <tr><td>Höhenschnittpunkt H</td><td>den drei Höhen</td></tr>
          </tbody>
        </table>
        <div className="formeln">
          <Formel name="Umkreisradius" ausdruck={<>R = (a·b·c) / (4·A)</>} />
          <Formel name="Inkreisradius" ausdruck={<>r = A / s</>} hinweis="s = halber Umfang" />
        </div>
      </Sektion>

      <Sektion nr={3} titel="Rechtwinkliges Dreieck — Pythagoras, Höhensatz, Kathetensatz">
        <p className="erkl">Im rechtwinkligen Dreieck mit dem rechten Winkel bei C heißt c die <b>Hypotenuse</b> (gegenüber dem 90°-Winkel). a und b sind die <b>Katheten</b>. Die Höhe vom rechten Winkel zur Hypotenuse heißt h. p und q sind die <b>Hypotenusenabschnitte</b>.</p>
        <figure className="fig">
          <div>
            <svg width="320" height="220" viewBox="0 0 320 220">
              <polygon points="40,180 280,180 40,40" fill="#e6f0fe" stroke="#0071e3" strokeWidth="2.5" />
              <rect x="40" y="164" width="14" height="14" fill="none" stroke="#0071e3" strokeWidth="2" />
              <text x="160" y="200" fontSize="14" fontWeight="700" fill="#0071e3">a</text>
              <text x="20" y="110" fontSize="14" fontWeight="700" fill="#0071e3">b</text>
              <text x="165" y="105" fontSize="14" fontWeight="700" fill="#ef4444">c</text>
              <line x1="40" y1="40" x2="143" y2="123" stroke="#34c759" strokeWidth="2" strokeDasharray="3,2" />
              <text x="80" y="80" fontSize="13" fontWeight="700" fill="#34c759">h</text>
              <text x="285" y="180" fontSize="12" fill="#6e6e73">B</text>
              <text x="22" y="40" fontSize="12" fill="#6e6e73">C</text>
              <text x="22" y="200" fontSize="12" fill="#6e6e73">A</text>
              <text x="80" y="200" fontSize="12" fill="#a37300">q</text>
              <text x="210" y="200" fontSize="12" fill="#a37300">p</text>
            </svg>
            <figcaption>Rechtwinkliges Dreieck mit Höhe h und Hypotenusenabschnitten p, q</figcaption>
          </div>
        </figure>
        <h3>Die drei wichtigsten Sätze</h3>
        <div className="formeln">
          <Formel name="Satz des Pythagoras" ausdruck={<>a² + b² = c²</>} hinweis="nur im rechtwinkligen Dreieck" />
          <Formel name="Kathetensatz (a)" ausdruck={<>a² = p · c</>} hinweis="p = Abschnitt unter a" />
          <Formel name="Kathetensatz (b)" ausdruck={<>b² = q · c</>} hinweis="q = Abschnitt unter b" />
          <Formel name="Höhensatz" ausdruck={<>h² = p · q</>} />
        </div>
        <h3>Pythagoras umstellen</h3>
        <div className="formeln">
          <Formel name="Hypotenuse" ausdruck={<>c = √(a² + b²)</>} />
          <Formel name="Kathete a" ausdruck={<>a = √(c² − b²)</>} />
          <Formel name="Kathete b" ausdruck={<>b = √(c² − a²)</>} />
          <Formel name="Fläche" ausdruck={<>A = ½ · a · b</>} hinweis="im rechtwinkligen Dreieck" />
        </div>
        <Beispiel aufgabe={<>a = 6, b = 8. Berechne c, h, p und q.</>}
          schritte={[
            <>c = √(36 + 64) = √100 = <b>10</b></>,
            <>Höhensatz nicht direkt. Stattdessen: A = ½·6·8 = 24. Zugleich A = ½·c·h, also h = 2A/c = 48/10 = <b>4,8</b></>,
            <>Kathetensatz: a² = p·c ⇒ 36 = p·10 ⇒ p = <b>3,6</b></>,
            <>Kathetensatz: b² = q·c ⇒ 64 = q·10 ⇒ q = <b>6,4</b></>,
          ]} />
        <div className="tipp"><b>Tipp:</b> Berühmte „pythagoreische Tripel" sind 3-4-5, 5-12-13, 8-15-17 und 7-24-25 — alle ohne Wurzel.</div>
      </Sektion>

      <Sektion nr={4} titel="Trigonometrie im Dreieck">
        <p className="erkl">Mit <b>Sinus, Kosinus, Tangens</b> kannst du Seiten und Winkel im rechtwinkligen Dreieck verbinden. Außerhalb des rechtwinkligen Dreiecks gelten Sinussatz und Kosinussatz.</p>
        <figure className="fig">
          <div>
            <svg width="280" height="180" viewBox="0 0 280 180">
              <polygon points="40,150 240,150 240,30" fill="#e6f0fe" stroke="#0071e3" strokeWidth="2.5" />
              <rect x="226" y="136" width="14" height="14" fill="none" stroke="#0071e3" strokeWidth="2" />
              <path d="M 80 150 A 40 40 0 0 0 70 121" stroke="#ef4444" strokeWidth="2" fill="none" />
              <text x="72" y="138" fontSize="13" fontWeight="700" fill="#ef4444">α</text>
              <text x="140" y="170" fontSize="13" fontWeight="700">Ankathete</text>
              <text x="250" y="100" fontSize="13" fontWeight="700">Gegenkathete</text>
              <text x="100" y="80" fontSize="13" fontWeight="700" fill="#ef4444">Hypotenuse</text>
            </svg>
            <figcaption>Bezogen auf den Winkel α</figcaption>
          </div>
        </figure>
        <h3>Im rechtwinkligen Dreieck</h3>
        <div className="formeln">
          <Formel name="Sinus" ausdruck={<>sin(α) = Gegenkathete / Hypotenuse</>} />
          <Formel name="Kosinus" ausdruck={<>cos(α) = Ankathete / Hypotenuse</>} />
          <Formel name="Tangens" ausdruck={<>tan(α) = Gegenkathete / Ankathete</>} />
          <Formel name="Verbindung" ausdruck={<>tan(α) = sin(α) / cos(α)</>} />
          <Formel name="Trig-Identität" ausdruck={<>sin²(α) + cos²(α) = 1</>} />
        </div>
        <h3>Sinussatz und Kosinussatz</h3>
        <div className="formeln">
          <Formel name="Sinussatz" ausdruck={<>a/sin(α) = b/sin(β) = c/sin(γ)</>} hinweis="in jedem Dreieck" />
          <Formel name="Kosinussatz" ausdruck={<>a² = b² + c² − 2·b·c·cos(α)</>} hinweis="verallgemeinerter Pythagoras" />
          <Formel name="Kosinussatz für β" ausdruck={<>b² = a² + c² − 2·a·c·cos(β)</>} />
          <Formel name="Kosinussatz für γ" ausdruck={<>c² = a² + b² − 2·a·b·cos(γ)</>} />
        </div>
        <h3>Wichtige Werte</h3>
        <table>
          <thead><tr><th>Winkel</th><th>sin</th><th>cos</th><th>tan</th></tr></thead>
          <tbody>
            <tr><td>0°</td><td>0</td><td>1</td><td>0</td></tr>
            <tr><td>30°</td><td>0,5</td><td>√3/2</td><td>√3/3</td></tr>
            <tr><td>45°</td><td>√2/2</td><td>√2/2</td><td>1</td></tr>
            <tr><td>60°</td><td>√3/2</td><td>0,5</td><td>√3</td></tr>
            <tr><td>90°</td><td>1</td><td>0</td><td>—</td></tr>
          </tbody>
        </table>
        <Beispiel aufgabe={<>Rechtwinkliges Dreieck: Hypotenuse c = 10, Winkel α = 30°. Wie lang ist die Gegenkathete a?</>}
          schritte={[<>sin(30°) = a / c</>, <>a = c · sin(30°) = 10 · 0,5</>, <>a = <b>5</b></>]} />
      </Sektion>

      <Sektion nr={5} titel="Vierecke — alle Arten">
        <p className="erkl">Vierecke haben 4 Ecken, 4 Seiten, 4 Winkel. Die Winkelsumme ist 360°.</p>
        <div className="karten">
          <div className="karte">
            <h5>Quadrat</h5>
            <svg width="120" height="100" viewBox="0 0 120 100"><rect x="25" y="15" width="70" height="70" fill="#e6f0fe" stroke="#0071e3" strokeWidth="2" /><text x="55" y="55" fontSize="13" fontWeight="700" fill="#0071e3">a</text></svg>
            <p><b>U</b> = 4 · a</p>
            <p><b>A</b> = a²</p>
            <p><b>Diagonale d</b> = a · √2</p>
          </div>
          <div className="karte">
            <h5>Rechteck</h5>
            <svg width="140" height="100" viewBox="0 0 140 100"><rect x="15" y="20" width="110" height="60" fill="#e6f0fe" stroke="#0071e3" strokeWidth="2" /></svg>
            <p><b>U</b> = 2 · (a + b)</p>
            <p><b>A</b> = a · b</p>
            <p><b>Diagonale</b> = √(a² + b²)</p>
          </div>
          <div className="karte">
            <h5>Parallelogramm</h5>
            <svg width="140" height="100" viewBox="0 0 140 100"><polygon points="30,20 130,20 110,80 10,80" fill="#e6f0fe" stroke="#0071e3" strokeWidth="2" /><line x1="70" y1="20" x2="65" y2="80" stroke="#ef4444" strokeWidth="2" strokeDasharray="3,2" /></svg>
            <p><b>U</b> = 2 · (a + b)</p>
            <p><b>A</b> = a · h<sub>a</sub></p>
            <p><b>A</b> = a · b · sin(α)</p>
          </div>
          <div className="karte">
            <h5>Trapez</h5>
            <svg width="140" height="100" viewBox="0 0 140 100"><polygon points="30,20 110,20 130,80 10,80" fill="#e6f0fe" stroke="#0071e3" strokeWidth="2" /><line x1="60" y1="20" x2="60" y2="80" stroke="#ef4444" strokeWidth="2" strokeDasharray="3,2" /></svg>
            <p><b>A</b> = ½ · (a + c) · h</p>
            <p><b>Mittellinie m</b> = (a + c) / 2</p>
          </div>
          <div className="karte">
            <h5>Raute</h5>
            <svg width="120" height="100" viewBox="0 0 120 100"><polygon points="60,10 110,50 60,90 10,50" fill="#e6f0fe" stroke="#0071e3" strokeWidth="2" /><line x1="60" y1="10" x2="60" y2="90" stroke="#ef4444" strokeWidth="2" strokeDasharray="3,2" /><line x1="10" y1="50" x2="110" y2="50" stroke="#ef4444" strokeWidth="2" strokeDasharray="3,2" /></svg>
            <p><b>U</b> = 4 · a</p>
            <p><b>A</b> = a · h</p>
            <p><b>A</b> = ½ · e · f</p>
            <p><i>(e, f Diagonalen)</i></p>
          </div>
          <div className="karte">
            <h5>Drachen</h5>
            <svg width="120" height="120" viewBox="0 0 120 120"><polygon points="60,5 105,55 60,115 15,55" fill="#e6f0fe" stroke="#0071e3" strokeWidth="2" /><line x1="60" y1="5" x2="60" y2="115" stroke="#ef4444" strokeWidth="2" strokeDasharray="3,2" /><line x1="15" y1="55" x2="105" y2="55" stroke="#ef4444" strokeWidth="2" strokeDasharray="3,2" /></svg>
            <p><b>A</b> = ½ · e · f</p>
          </div>
        </div>
        <Beispiel aufgabe={<>Trapez mit a = 12, c = 8, h = 5. Berechne die Fläche und die Mittellinie.</>}
          schritte={[<>A = ½ · (12 + 8) · 5 = ½ · 20 · 5 = <b>50</b></>, <>m = (12 + 8) / 2 = <b>10</b></>]} />
      </Sektion>

      <Sektion nr={6} titel="Der Kreis — alle Formeln">
        <p className="erkl">Der <b>Mittelpunkt M</b>, der <b>Radius r</b> (vom Mittelpunkt zum Rand) und der <b>Durchmesser d = 2r</b> sind die Grundgrößen am Kreis.</p>
        <figure className="fig">
          <div>
            <svg width="240" height="220" viewBox="0 0 240 220">
              <circle cx="120" cy="110" r="85" fill="#e6f0fe" stroke="#0071e3" strokeWidth="2.5" />
              <line x1="120" y1="110" x2="205" y2="110" stroke="#ef4444" strokeWidth="2.5" />
              <line x1="35" y1="110" x2="205" y2="110" stroke="#34c759" strokeWidth="2" strokeDasharray="4,3" />
              <circle cx="120" cy="110" r="3" fill="#1d1d1f" />
              <text x="125" y="100" fontSize="13" fill="#6e6e73">M</text>
              <text x="160" y="103" fontSize="14" fontWeight="700" fill="#ef4444">r</text>
              <text x="110" y="135" fontSize="14" fontWeight="700" fill="#34c759">d</text>
            </svg>
          </div>
        </figure>
        <h3>Grundformeln</h3>
        <div className="formeln">
          <Formel name="Umfang aus r" ausdruck={<>U = 2 · π · r</>} hinweis="π ≈ 3,14159" />
          <Formel name="Umfang aus d" ausdruck={<>U = π · d</>} />
          <Formel name="Flächeninhalt" ausdruck={<>A = π · r²</>} />
          <Formel name="Fläche aus d" ausdruck={<>A = π · d² / 4</>} />
          <Formel name="Durchmesser" ausdruck={<>d = 2 · r</>} />
        </div>
        <h3>Kreisbogen und Kreissektor</h3>
        <p className="erkl">Ein <b>Kreissektor</b> ist ein „Tortenstück", ein <b>Bogen</b> ist nur der gekrümmte Teil des Randes. Der zugehörige Winkel heißt <b>Mittelpunktswinkel α</b>.</p>
        <div className="formeln">
          <Formel name="Bogenlänge" ausdruck={<>b = (α/360°) · 2π · r</>} />
          <Formel name="Bogenlänge im Bogenmaß" ausdruck={<>b = r · φ</>} hinweis="φ in Radiant" />
          <Formel name="Sektorfläche" ausdruck={<>A = (α/360°) · π · r²</>} />
          <Formel name="Sektorfläche kompakt" ausdruck={<>A = ½ · r · b</>} />
        </div>
        <h3>Kreisring</h3>
        <p className="erkl">Ein <b>Kreisring</b> hat einen Innenradius r₁ und einen Außenradius r₂.</p>
        <div className="formeln">
          <Formel name="Kreisring-Fläche" ausdruck={<>A = π · (r₂² − r₁²)</>} />
        </div>
        <h3>Sätze am Kreis</h3>
        <div className="formeln">
          <Formel name="Satz des Thales" ausdruck={<>γ = 90°</>} hinweis="Dreieck mit Hypotenuse als Durchmesser" />
          <Formel name="Peripheriewinkel" ausdruck={<>α = 2 · β</>} hinweis="Mittelpunktswinkel = doppelter Umfangswinkel" />
        </div>
        <Beispiel aufgabe={<>Kreis: r = 5 cm. Berechne U und A (π ≈ 3,14).</>}
          schritte={[<>U = 2 · 3,14 · 5 = <b>31,4 cm</b></>, <>A = 3,14 · 25 = <b>78,5 cm²</b></>]} />
        <Beispiel aufgabe={<>Sektor: r = 6 cm, α = 60°. Berechne Bogen und Sektorfläche.</>}
          schritte={[<>b = (60/360) · 2 · 3,14 · 6 = (1/6) · 37,68 = <b>6,28 cm</b></>, <>A = (60/360) · 3,14 · 36 = (1/6) · 113,04 = <b>18,84 cm²</b></>]} />
      </Sektion>

      <Sektion nr={7} titel="Strahlensätze und Ähnlichkeit">
        <p className="erkl">Zwei sich schneidende Geraden, geschnitten von parallelen Linien, erzeugen <b>ähnliche Dreiecke</b>. Es gelten die Strahlensätze.</p>
        <div className="formeln">
          <Formel name="1. Strahlensatz" ausdruck={<>a/b = a'/b'</>} hinweis="Verhältnisse auf einer Geraden" />
          <Formel name="2. Strahlensatz" ausdruck={<>p/q = a/b</>} hinweis="Verhältnis Parallel-Strecken = Verhältnis Strahl-Strecken" />
          <Formel name="Ähnlichkeit Dreiecke" ausdruck={<>a/a' = b/b' = c/c' = k</>} hinweis="k = Streckfaktor" />
          <Formel name="Flächenverhältnis" ausdruck={<>A/A' = k²</>} />
          <Formel name="Volumenverhältnis" ausdruck={<>V/V' = k³</>} />
        </div>
        <div className="tipp"><b>Ähnliche Dreiecke</b> haben die gleichen Winkel. Sie sind also gleich „geformt", nur unterschiedlich groß.</div>
      </Sektion>

      <Sektion nr={8} titel="Würfel und Quader">
        <figure className="fig">
          <div>
            <svg width="140" height="140" viewBox="0 0 140 140">
              <polygon points="20,40 100,40 100,120 20,120" fill="#e6f0fe" stroke="#0071e3" strokeWidth="2" />
              <polygon points="20,40 50,15 130,15 100,40" fill="#cce0f9" stroke="#0071e3" strokeWidth="2" />
              <polygon points="100,40 130,15 130,95 100,120" fill="#b0d4f5" stroke="#0071e3" strokeWidth="2" />
              <text x="55" y="135" fontSize="13" fontWeight="700" fill="#0071e3">a</text>
            </svg>
          </div>
          <div>
            <svg width="180" height="140" viewBox="0 0 180 140">
              <polygon points="20,50 120,50 120,120 20,120" fill="#e6f0fe" stroke="#0071e3" strokeWidth="2" />
              <polygon points="20,50 50,20 150,20 120,50" fill="#cce0f9" stroke="#0071e3" strokeWidth="2" />
              <polygon points="120,50 150,20 150,90 120,120" fill="#b0d4f5" stroke="#0071e3" strokeWidth="2" />
              <text x="65" y="135" fontSize="13" fontWeight="700" fill="#0071e3">a</text>
              <text x="155" y="65" fontSize="13" fontWeight="700" fill="#0071e3">c</text>
              <text x="80" y="38" fontSize="13" fontWeight="700" fill="#0071e3">b</text>
            </svg>
          </div>
        </figure>
        <h3>Würfel (a × a × a)</h3>
        <div className="formeln">
          <Formel name="Volumen" ausdruck={<>V = a³</>} />
          <Formel name="Oberfläche" ausdruck={<>O = 6 · a²</>} />
          <Formel name="Flächendiagonale" ausdruck={<>d<sub>f</sub> = a · √2</>} />
          <Formel name="Raumdiagonale" ausdruck={<>d<sub>r</sub> = a · √3</>} />
          <Formel name="Kantensumme" ausdruck={<>k = 12 · a</>} />
        </div>
        <h3>Quader (a × b × c)</h3>
        <div className="formeln">
          <Formel name="Volumen" ausdruck={<>V = a · b · c</>} />
          <Formel name="Oberfläche" ausdruck={<>O = 2 · (a·b + a·c + b·c)</>} />
          <Formel name="Raumdiagonale" ausdruck={<>d = √(a² + b² + c²)</>} />
          <Formel name="Kantensumme" ausdruck={<>k = 4 · (a + b + c)</>} />
        </div>
        <Beispiel aufgabe={<>Quader 10 × 4 × 3 cm. Berechne V, O und Raumdiagonale.</>}
          schritte={[<>V = 10 · 4 · 3 = <b>120 cm³</b></>, <>O = 2·(40 + 30 + 12) = 2·82 = <b>164 cm²</b></>, <>d = √(100 + 16 + 9) = √125 ≈ <b>11,18 cm</b></>]} />
      </Sektion>

      <Sektion nr={9} titel="Prisma und Zylinder">
        <p className="erkl">Ein <b>Prisma</b> hat zwei gleiche Grundflächen oben und unten — verbunden durch gerade Seitenflächen. Ein <b>Zylinder</b> ist ein Prisma mit Kreis als Grundfläche.</p>
        <h3>Allgemeines Prisma</h3>
        <div className="formeln">
          <Formel name="Volumen" ausdruck={<>V = G · h</>} hinweis="G = Grundfläche" />
          <Formel name="Mantelfläche" ausdruck={<>M = U · h</>} hinweis="U = Umfang der Grundfläche" />
          <Formel name="Oberfläche" ausdruck={<>O = 2 · G + M</>} />
        </div>
        <h3>Zylinder (mit Kreis als Grundfläche)</h3>
        <div className="formeln">
          <Formel name="Volumen" ausdruck={<>V = π · r² · h</>} />
          <Formel name="Mantelfläche" ausdruck={<>M = 2 · π · r · h</>} />
          <Formel name="Oberfläche" ausdruck={<>O = 2 · π · r² + 2 · π · r · h</>} />
          <Formel name="kompakt" ausdruck={<>O = 2 · π · r · (r + h)</>} />
        </div>
        <h3>Hohlzylinder</h3>
        <div className="formeln">
          <Formel name="Volumen" ausdruck={<>V = π · (R² − r²) · h</>} hinweis="R = außen, r = innen" />
        </div>
        <Beispiel aufgabe={<>Zylinder r = 3 cm, h = 10 cm.</>}
          schritte={[<>V = 3,14 · 9 · 10 = <b>282,6 cm³</b></>, <>M = 2 · 3,14 · 3 · 10 = <b>188,4 cm²</b></>, <>O = 2 · 3,14 · 9 + 188,4 = <b>244,92 cm²</b></>]} />
      </Sektion>

      <Sektion nr={10} titel="Pyramide und Kegel">
        <figure className="fig">
          <div>
            <svg width="160" height="180" viewBox="0 0 160 180">
              <polygon points="20,140 140,140 110,155 50,155" fill="#cce0f9" stroke="#0071e3" strokeWidth="2" />
              <polygon points="20,140 140,140 80,20" fill="#e6f0fe" stroke="#0071e3" strokeWidth="2" />
              <line x1="80" y1="148" x2="80" y2="20" stroke="#ef4444" strokeWidth="2" strokeDasharray="3,2" />
              <text x="85" y="90" fontSize="13" fontWeight="700" fill="#ef4444">h</text>
            </svg>
          </div>
          <div>
            <svg width="160" height="180" viewBox="0 0 160 180">
              <ellipse cx="80" cy="150" rx="60" ry="14" fill="#cce0f9" stroke="#0071e3" strokeWidth="2" />
              <line x1="20" y1="150" x2="80" y2="20" stroke="#0071e3" strokeWidth="2" />
              <line x1="140" y1="150" x2="80" y2="20" stroke="#0071e3" strokeWidth="2" />
              <line x1="80" y1="150" x2="80" y2="20" stroke="#ef4444" strokeWidth="2" strokeDasharray="3,2" />
              <line x1="80" y1="150" x2="140" y2="150" stroke="#34c759" strokeWidth="2" />
              <text x="85" y="90" fontSize="13" fontWeight="700" fill="#ef4444">h</text>
              <text x="105" y="148" fontSize="12" fontWeight="700" fill="#34c759">r</text>
              <text x="115" y="100" fontSize="12" fontWeight="700" fill="#0071e3">s</text>
            </svg>
          </div>
        </figure>
        <h3>Pyramide (allgemein)</h3>
        <div className="formeln">
          <Formel name="Volumen" ausdruck={<>V = ⅓ · G · h</>} />
          <Formel name="Mantelfläche" ausdruck={<>M = ½ · u · h<sub>s</sub></>} hinweis="u = Umfang Grundfläche, h_s = Seitenhöhe" />
          <Formel name="Oberfläche" ausdruck={<>O = G + M</>} />
        </div>
        <h3>Kegel</h3>
        <div className="formeln">
          <Formel name="Volumen" ausdruck={<>V = ⅓ · π · r² · h</>} />
          <Formel name="Mantellinie" ausdruck={<>s = √(r² + h²)</>} hinweis="Pythagoras im Querschnitt" />
          <Formel name="Mantelfläche" ausdruck={<>M = π · r · s</>} />
          <Formel name="Oberfläche" ausdruck={<>O = π · r² + π · r · s</>} />
          <Formel name="Öffnungswinkel" ausdruck={<>sin(α/2) = r / s</>} />
        </div>
        <h3>Pyramiden-/Kegelstumpf</h3>
        <div className="formeln">
          <Formel name="Stumpf-Volumen" ausdruck={<>V = ⅓ · h · (G₁ + G₂ + √(G₁·G₂))</>} hinweis="G₁ unten, G₂ oben" />
        </div>
        <div className="tipp"><b>Merkhilfe:</b> Pyramide und Kegel haben immer das <i>Drittel</i> in der Volumenformel — sonst rechnest du 3× zu viel!</div>
      </Sektion>

      <Sektion nr={11} titel="Kugel">
        <figure className="fig">
          <div>
            <svg width="180" height="180" viewBox="0 0 180 180">
              <circle cx="90" cy="90" r="70" fill="#e6f0fe" stroke="#0071e3" strokeWidth="2.5" />
              <ellipse cx="90" cy="90" rx="70" ry="20" fill="none" stroke="#0071e3" strokeWidth="1.5" strokeDasharray="3,2" />
              <line x1="90" y1="90" x2="160" y2="90" stroke="#ef4444" strokeWidth="2.5" />
              <text x="120" y="84" fontSize="14" fontWeight="700" fill="#ef4444">r</text>
            </svg>
          </div>
        </figure>
        <div className="formeln">
          <Formel name="Volumen" ausdruck={<>V = (4/3) · π · r³</>} />
          <Formel name="Oberfläche" ausdruck={<>O = 4 · π · r²</>} />
          <Formel name="Kugelschicht" ausdruck={<>V = (π · h / 6) · (3·a² + 3·b² + h²)</>} hinweis="a, b Randradien, h Höhe" />
          <Formel name="Kugelkappe Volumen" ausdruck={<>V = (π · h² / 3) · (3·r − h)</>} />
          <Formel name="Kugelkappe Oberfläche" ausdruck={<>O = 2 · π · r · h</>} />
        </div>
        <Beispiel aufgabe={<>Ball mit r = 6 cm.</>}
          schritte={[<>V = (4/3) · 3,14 · 216 ≈ <b>904,3 cm³</b></>, <>O = 4 · 3,14 · 36 ≈ <b>452,16 cm²</b></>]} />
      </Sektion>

      <Sektion nr={12} titel="Koordinatengeometrie">
        <p className="erkl">Mit Punkten A(x₁ | y₁) und B(x₂ | y₂) im Koordinatensystem.</p>
        <div className="formeln">
          <Formel name="Abstand zweier Punkte" ausdruck={<>d = √((x₂−x₁)² + (y₂−y₁)²)</>} />
          <Formel name="Mittelpunkt" ausdruck={<>M = ((x₁+x₂)/2 | (y₁+y₂)/2)</>} />
          <Formel name="Steigung" ausdruck={<>m = (y₂−y₁) / (x₂−x₁)</>} />
          <Formel name="Geradengleichung" ausdruck={<>y = m · x + b</>} />
          <Formel name="Kreisgleichung" ausdruck={<>(x − m₁)² + (y − m₂)² = r²</>} hinweis="Mittelpunkt (m₁ | m₂)" />
        </div>
      </Sektion>

      <Sektion nr={13} titel="Schnell-Übersicht aller Formeln">
        <h3>Flächen</h3>
        <table>
          <thead><tr><th>Figur</th><th>Fläche</th><th>Umfang</th></tr></thead>
          <tbody>
            <tr><td>Quadrat</td><td>a²</td><td>4a</td></tr>
            <tr><td>Rechteck</td><td>a·b</td><td>2(a+b)</td></tr>
            <tr><td>Dreieck</td><td>½·g·h</td><td>a+b+c</td></tr>
            <tr><td>Parallelogramm</td><td>a·h</td><td>2(a+b)</td></tr>
            <tr><td>Trapez</td><td>½·(a+c)·h</td><td>a+b+c+d</td></tr>
            <tr><td>Raute</td><td>½·e·f</td><td>4a</td></tr>
            <tr><td>Kreis</td><td>π·r²</td><td>2·π·r</td></tr>
          </tbody>
        </table>
        <h3>Körper</h3>
        <table>
          <thead><tr><th>Körper</th><th>Volumen</th><th>Oberfläche</th></tr></thead>
          <tbody>
            <tr><td>Würfel</td><td>a³</td><td>6·a²</td></tr>
            <tr><td>Quader</td><td>a·b·c</td><td>2(ab+ac+bc)</td></tr>
            <tr><td>Prisma</td><td>G·h</td><td>2G + U·h</td></tr>
            <tr><td>Zylinder</td><td>π·r²·h</td><td>2π·r(r+h)</td></tr>
            <tr><td>Pyramide</td><td>⅓·G·h</td><td>G + M</td></tr>
            <tr><td>Kegel</td><td>⅓·π·r²·h</td><td>π·r·(r+s)</td></tr>
            <tr><td>Kugel</td><td>(4/3)·π·r³</td><td>4·π·r²</td></tr>
          </tbody>
        </table>
      </Sektion>

      <p style={{ textAlign: "center", marginTop: "40px", color: "#6e6e73", fontSize: "14px" }}>Viel Erfolg in deiner Schulaufgabe — du hast jetzt alles, was du brauchst! — Anna</p>
    </div>
  );
}
