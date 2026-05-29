"use client";
import { type ReactNode } from "react";

const STIL = `
  .mat { font-size:16px; line-height:1.7; color:#1d1d1f; }
  .mat h2 { font-family:Georgia,serif; font-size:26px; font-weight:800; color:#0071e3; margin:38px 0 14px; display:flex; align-items:center; gap:12px; }
  .mat h2 .num { background:#0071e3; color:#fff; width:36px; height:36px; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; font-size:18px; }
  .mat h3 { font-size:19px; font-weight:700; margin:22px 0 10px; color:#1d1d1f; }
  .mat p { margin:8px 0; }
  .mat .erkl { font-size:16px; color:#3a3a3c; }
  .mat .fig { background:#f8f8fb; border-radius:14px; padding:18px; margin:14px 0; display:flex; justify-content:center; }
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
  .mat .karten { display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:12px; margin:14px 0; }
  .mat .karte { background:#fff; border:1px solid #ececec; border-radius:14px; padding:14px 16px; }
  .mat .karte h4 { font-size:16px; font-weight:700; margin:0 0 8px; color:#0071e3; }
  @media print { .mat .fig { break-inside:avoid; } .mat .beispiel { break-inside:avoid; } }
`;

function Sektion({ nr, titel, children }: { nr: number; titel: string; children: ReactNode }) {
  return (
    <section>
      <h2><span className="num">{nr}</span>{titel}</h2>
      {children}
    </section>
  );
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

      <p className="erkl">In diesem Heft lernst du alles, was du in Geometrie für die Schule brauchst — von einfachen Winkeln bis zu allen Körpern. Mit Skizzen, Formeln und durchgerechneten Beispielen. Drucke es dir aus oder lass es auf dem Tablet offen, während du übst.</p>

      <Sektion nr={1} titel="Winkel">
        <p className="erkl">Ein <b>Winkel</b> entsteht, wenn sich zwei Halbgeraden in einem Punkt (dem Scheitelpunkt) treffen. Winkel misst man in <b>Grad (°)</b>.</p>
        <figure className="fig">
          <div>
            <svg width="320" height="180" viewBox="0 0 320 180">
              <line x1="40" y1="150" x2="290" y2="150" stroke="#1d1d1f" strokeWidth="2.5" />
              <line x1="40" y1="150" x2="240" y2="30" stroke="#1d1d1f" strokeWidth="2.5" />
              <path d="M 100 150 A 60 60 0 0 0 76 121" stroke="#0071e3" strokeWidth="2.5" fill="none" />
              <text x="92" y="135" fill="#0071e3" fontSize="14" fontWeight="700">α</text>
              <circle cx="40" cy="150" r="4" fill="#1d1d1f" />
              <text x="20" y="168" fontSize="13" fill="#6e6e73">S</text>
            </svg>
            <figcaption>Winkel α am Scheitelpunkt S</figcaption>
          </div>
        </figure>
        <div className="karten">
          <div className="karte"><h4>Spitz</h4><p>0° &lt; α &lt; 90°</p></div>
          <div className="karte"><h4>Rechter Winkel</h4><p>α = 90° (Quadrat-Symbol)</p></div>
          <div className="karte"><h4>Stumpf</h4><p>90° &lt; α &lt; 180°</p></div>
          <div className="karte"><h4>Gestreckt</h4><p>α = 180° (gerade Linie)</p></div>
        </div>
        <div className="tipp"><b>Tipp:</b> Im Dreieck ergeben alle drei Winkel zusammen immer 180°. Im Viereck sind es 360°.</div>
      </Sektion>

      <Sektion nr={2} titel="Dreiecke und der Satz des Pythagoras">
        <p className="erkl">Im <b>rechtwinkligen Dreieck</b> nennt man die beiden kurzen Seiten <b>Katheten</b> (a, b) und die längste Seite, die dem rechten Winkel gegenüber liegt, <b>Hypotenuse</b> (c).</p>
        <figure className="fig">
          <div>
            <svg width="300" height="220" viewBox="0 0 300 220">
              <polygon points="50,180 250,180 50,40" fill="#e6f0fe" stroke="#0071e3" strokeWidth="2.5" />
              <rect x="50" y="166" width="14" height="14" fill="none" stroke="#0071e3" strokeWidth="2" />
              <text x="145" y="200" fontSize="16" fontWeight="700" fill="#0071e3">a</text>
              <text x="20" y="115" fontSize="16" fontWeight="700" fill="#0071e3">b</text>
              <text x="160" y="100" fontSize="16" fontWeight="700" fill="#ef4444">c</text>
              <text x="30" y="35" fontSize="13" fill="#6e6e73">C</text>
              <text x="30" y="200" fontSize="13" fill="#6e6e73">A</text>
              <text x="260" y="200" fontSize="13" fill="#6e6e73">B</text>
            </svg>
            <figcaption>Rechtwinkliges Dreieck — Katheten a, b und Hypotenuse c</figcaption>
          </div>
        </figure>
        <div className="formeln">
          <Formel name="Satz des Pythagoras" ausdruck={<>a² + b² = c²</>} hinweis="Nur in rechtwinkligen Dreiecken!" />
          <Formel name="Hypotenuse berechnen" ausdruck={<>c = √(a² + b²)</>} />
          <Formel name="Kathete berechnen" ausdruck={<>a = √(c² − b²)</>} />
          <Formel name="Flächeninhalt" ausdruck={<>A = ½ · a · b</>} hinweis="Grundseite mal Höhe geteilt durch 2" />
        </div>
        <Beispiel
          aufgabe={<>Ein rechtwinkliges Dreieck hat die Katheten a = 3 cm und b = 4 cm. Wie lang ist die Hypotenuse?</>}
          schritte={[
            <>Formel notieren: c = √(a² + b²)</>,
            <>Einsetzen: c = √(3² + 4²) = √(9 + 16) = √25</>,
            <>Ergebnis: <b>c = 5 cm</b></>,
          ]}
        />
        <div className="merke"><b>Merke:</b> Die Hypotenuse ist <i>immer</i> die längste Seite und liegt dem rechten Winkel gegenüber.</div>
      </Sektion>

      <Sektion nr={3} titel="Vierecke">
        <p className="erkl">Vierecke haben 4 Ecken und 4 Seiten. Die Winkel ergeben zusammen 360°.</p>
        <div className="karten">
          <div className="karte">
            <h4>Quadrat</h4>
            <svg width="100" height="100" viewBox="0 0 100 100"><rect x="15" y="15" width="70" height="70" fill="#e6f0fe" stroke="#0071e3" strokeWidth="2" /><text x="48" y="55" fontSize="13" fontWeight="700" fill="#0071e3">a</text></svg>
            <p style={{ marginTop: 0 }}><b>U</b> = 4 · a<br /><b>A</b> = a · a = a²</p>
          </div>
          <div className="karte">
            <h4>Rechteck</h4>
            <svg width="120" height="80" viewBox="0 0 120 80"><rect x="10" y="15" width="100" height="50" fill="#e6f0fe" stroke="#0071e3" strokeWidth="2" /><text x="55" y="45" fontSize="13" fontWeight="700" fill="#0071e3">a</text><text x="115" y="42" fontSize="13" fontWeight="700" fill="#0071e3">b</text></svg>
            <p style={{ marginTop: 0 }}><b>U</b> = 2 · (a + b)<br /><b>A</b> = a · b</p>
          </div>
          <div className="karte">
            <h4>Parallelogramm</h4>
            <svg width="120" height="80" viewBox="0 0 120 80"><polygon points="25,15 110,15 95,65 10,65" fill="#e6f0fe" stroke="#0071e3" strokeWidth="2" /><line x1="60" y1="15" x2="55" y2="65" stroke="#ef4444" strokeWidth="2" strokeDasharray="3,2" /><text x="60" y="50" fontSize="13" fontWeight="700" fill="#ef4444">h</text></svg>
            <p style={{ marginTop: 0 }}><b>A</b> = a · h<br /><i>(a = Grundseite, h = Höhe)</i></p>
          </div>
          <div className="karte">
            <h4>Trapez</h4>
            <svg width="120" height="80" viewBox="0 0 120 80"><polygon points="25,15 90,15 110,65 10,65" fill="#e6f0fe" stroke="#0071e3" strokeWidth="2" /><line x1="55" y1="15" x2="60" y2="65" stroke="#ef4444" strokeWidth="2" strokeDasharray="3,2" /></svg>
            <p style={{ marginTop: 0 }}><b>A</b> = ½ · (a + c) · h</p>
          </div>
          <div className="karte">
            <h4>Raute</h4>
            <svg width="100" height="100" viewBox="0 0 100 100"><polygon points="50,10 90,50 50,90 10,50" fill="#e6f0fe" stroke="#0071e3" strokeWidth="2" /><line x1="50" y1="10" x2="50" y2="90" stroke="#ef4444" strokeWidth="2" strokeDasharray="3,2" /><line x1="10" y1="50" x2="90" y2="50" stroke="#ef4444" strokeWidth="2" strokeDasharray="3,2" /><text x="38" y="48" fontSize="11" fontWeight="700" fill="#ef4444">e</text><text x="55" y="44" fontSize="11" fontWeight="700" fill="#ef4444">f</text></svg>
            <p style={{ marginTop: 0 }}><b>A</b> = ½ · e · f<br /><i>(e, f = Diagonalen)</i></p>
          </div>
        </div>
        <Beispiel
          aufgabe={<>Ein Rechteck ist 8 cm lang und 5 cm breit. Wie groß sind Umfang und Fläche?</>}
          schritte={[
            <>U = 2 · (8 + 5) = 2 · 13 = <b>26 cm</b></>,
            <>A = 8 · 5 = <b>40 cm²</b></>,
          ]}
        />
      </Sektion>

      <Sektion nr={4} titel="Der Kreis">
        <p className="erkl">Der <b>Radius (r)</b> geht vom Mittelpunkt zum Rand. Der <b>Durchmesser (d)</b> geht durch den Mittelpunkt von einer Seite zur anderen. Es gilt: d = 2 · r.</p>
        <figure className="fig">
          <div>
            <svg width="220" height="200" viewBox="0 0 220 200">
              <circle cx="110" cy="100" r="78" fill="#e6f0fe" stroke="#0071e3" strokeWidth="2.5" />
              <line x1="110" y1="100" x2="188" y2="100" stroke="#ef4444" strokeWidth="2.5" />
              <line x1="32" y1="100" x2="188" y2="100" stroke="#34c759" strokeWidth="2" strokeDasharray="4,3" />
              <circle cx="110" cy="100" r="3" fill="#1d1d1f" />
              <text x="115" y="92" fontSize="13" fill="#6e6e73">M</text>
              <text x="142" y="93" fontSize="14" fontWeight="700" fill="#ef4444">r</text>
              <text x="100" y="125" fontSize="14" fontWeight="700" fill="#34c759">d</text>
            </svg>
            <figcaption>Kreis mit Radius r und Durchmesser d</figcaption>
          </div>
        </figure>
        <div className="formeln">
          <Formel name="Umfang" ausdruck={<>U = 2 · π · r</>} hinweis="π ≈ 3,14159" />
          <Formel name="Umfang aus d" ausdruck={<>U = π · d</>} />
          <Formel name="Flächeninhalt" ausdruck={<>A = π · r²</>} />
        </div>
        <Beispiel
          aufgabe={<>Ein Kreis hat Radius r = 5 cm. Berechne Umfang und Fläche (mit π ≈ 3,14).</>}
          schritte={[
            <>U = 2 · 3,14 · 5 = <b>31,4 cm</b></>,
            <>A = 3,14 · 5² = 3,14 · 25 = <b>78,5 cm²</b></>,
          ]}
        />
      </Sektion>

      <Sektion nr={5} titel="Würfel und Quader">
        <p className="erkl">Der <b>Würfel</b> hat 6 gleich große quadratische Seiten. Der <b>Quader</b> hat 3 verschiedene Kantenlängen (a, b, c).</p>
        <figure className="fig">
          <div style={{ display: "flex", gap: "30px", alignItems: "center" }}>
            <svg width="140" height="140" viewBox="0 0 140 140">
              <polygon points="20,40 100,40 100,120 20,120" fill="#e6f0fe" stroke="#0071e3" strokeWidth="2" />
              <polygon points="20,40 50,15 130,15 100,40" fill="#cce0f9" stroke="#0071e3" strokeWidth="2" />
              <polygon points="100,40 130,15 130,95 100,120" fill="#b0d4f5" stroke="#0071e3" strokeWidth="2" />
              <text x="55" y="135" fontSize="13" fontWeight="700" fill="#0071e3">a</text>
            </svg>
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
        <div className="formeln">
          <Formel name="Würfel · Volumen" ausdruck={<>V = a³</>} />
          <Formel name="Würfel · Oberfläche" ausdruck={<>O = 6 · a²</>} />
          <Formel name="Quader · Volumen" ausdruck={<>V = a · b · c</>} />
          <Formel name="Quader · Oberfläche" ausdruck={<>O = 2 · (a·b + a·c + b·c)</>} />
        </div>
        <Beispiel
          aufgabe={<>Ein Quader ist 10 cm lang, 4 cm breit, 3 cm hoch. Berechne Volumen.</>}
          schritte={[<>V = 10 · 4 · 3 = <b>120 cm³</b></>]}
        />
      </Sektion>

      <Sektion nr={6} titel="Prisma und Zylinder">
        <p className="erkl">Ein <b>Prisma</b> hat zwei gleiche Grundflächen oben und unten — verbunden durch gerade Seitenflächen. Ein <b>Zylinder</b> ist ein Prisma mit Kreis als Grundfläche.</p>
        <figure className="fig">
          <div style={{ display: "flex", gap: "30px", alignItems: "center" }}>
            <svg width="120" height="160" viewBox="0 0 120 160">
              <polygon points="20,40 80,40 95,30 35,30" fill="#cce0f9" stroke="#0071e3" strokeWidth="2" />
              <polygon points="20,40 80,40 80,130 20,130" fill="#e6f0fe" stroke="#0071e3" strokeWidth="2" />
              <polygon points="80,40 95,30 95,120 80,130" fill="#b0d4f5" stroke="#0071e3" strokeWidth="2" />
              <text x="100" y="80" fontSize="12" fontWeight="700" fill="#0071e3">h</text>
            </svg>
            <svg width="140" height="160" viewBox="0 0 140 160">
              <ellipse cx="70" cy="30" rx="40" ry="14" fill="#cce0f9" stroke="#0071e3" strokeWidth="2" />
              <line x1="30" y1="30" x2="30" y2="120" stroke="#0071e3" strokeWidth="2" />
              <line x1="110" y1="30" x2="110" y2="120" stroke="#0071e3" strokeWidth="2" />
              <path d="M 30 120 A 40 14 0 0 0 110 120" fill="#e6f0fe" stroke="#0071e3" strokeWidth="2" />
              <text x="115" y="80" fontSize="13" fontWeight="700" fill="#0071e3">h</text>
              <text x="68" y="34" fontSize="11" fontWeight="700" fill="#0071e3">r</text>
            </svg>
          </div>
        </figure>
        <div className="formeln">
          <Formel name="Prisma · Volumen" ausdruck={<>V = G · h</>} hinweis="G = Grundfläche" />
          <Formel name="Zylinder · Volumen" ausdruck={<>V = π · r² · h</>} />
          <Formel name="Zylinder · Oberfläche" ausdruck={<>O = 2 · π · r² + 2 · π · r · h</>} hinweis="Boden + Deckel + Mantel" />
          <Formel name="Zylinder · Mantel" ausdruck={<>M = 2 · π · r · h</>} />
        </div>
        <Beispiel
          aufgabe={<>Zylinder: r = 3 cm, h = 10 cm. Berechne Volumen (π ≈ 3,14).</>}
          schritte={[
            <>V = 3,14 · 3² · 10 = 3,14 · 9 · 10</>,
            <>V = <b>282,6 cm³</b></>,
          ]}
        />
      </Sektion>

      <Sektion nr={7} titel="Pyramide und Kegel">
        <p className="erkl">Eine <b>Pyramide</b> hat eine vieleckige Grundfläche und läuft zur Spitze zusammen. Ein <b>Kegel</b> ist eine Pyramide mit Kreis als Grundfläche.</p>
        <figure className="fig">
          <div style={{ display: "flex", gap: "30px", alignItems: "center" }}>
            <svg width="140" height="160" viewBox="0 0 140 160">
              <polygon points="20,130 120,130 95,140 45,140" fill="#cce0f9" stroke="#0071e3" strokeWidth="2" />
              <polygon points="20,130 120,130 70,20" fill="#e6f0fe" stroke="#0071e3" strokeWidth="2" />
              <line x1="70" y1="135" x2="70" y2="20" stroke="#ef4444" strokeWidth="2" strokeDasharray="3,2" />
              <text x="75" y="80" fontSize="13" fontWeight="700" fill="#ef4444">h</text>
            </svg>
            <svg width="140" height="160" viewBox="0 0 140 160">
              <ellipse cx="70" cy="135" rx="50" ry="14" fill="#cce0f9" stroke="#0071e3" strokeWidth="2" />
              <line x1="20" y1="135" x2="70" y2="20" stroke="#0071e3" strokeWidth="2" />
              <line x1="120" y1="135" x2="70" y2="20" stroke="#0071e3" strokeWidth="2" />
              <line x1="70" y1="135" x2="70" y2="20" stroke="#ef4444" strokeWidth="2" strokeDasharray="3,2" />
              <text x="75" y="80" fontSize="13" fontWeight="700" fill="#ef4444">h</text>
              <text x="90" y="132" fontSize="11" fontWeight="700" fill="#0071e3">r</text>
            </svg>
          </div>
        </figure>
        <div className="formeln">
          <Formel name="Pyramide · Volumen" ausdruck={<>V = ⅓ · G · h</>} />
          <Formel name="Kegel · Volumen" ausdruck={<>V = ⅓ · π · r² · h</>} />
          <Formel name="Kegel · Mantelfläche" ausdruck={<>M = π · r · s</>} hinweis="s = Mantellinie" />
          <Formel name="Kegel · Oberfläche" ausdruck={<>O = π · r² + π · r · s</>} />
        </div>
        <div className="tipp"><b>Merkhilfe:</b> Pyramide und Kegel haben immer ein „⅓“ in der Volumenformel — drittel ist wichtig, sonst rechnest du dreimal zu viel!</div>
      </Sektion>

      <Sektion nr={8} titel="Kugel">
        <p className="erkl">Eine <b>Kugel</b> ist überall gleich weit vom Mittelpunkt entfernt — wie ein Ball.</p>
        <figure className="fig">
          <div>
            <svg width="160" height="160" viewBox="0 0 160 160">
              <circle cx="80" cy="80" r="60" fill="#e6f0fe" stroke="#0071e3" strokeWidth="2.5" />
              <ellipse cx="80" cy="80" rx="60" ry="18" fill="none" stroke="#0071e3" strokeWidth="1.5" strokeDasharray="3,2" />
              <line x1="80" y1="80" x2="140" y2="80" stroke="#ef4444" strokeWidth="2.5" />
              <circle cx="80" cy="80" r="3" fill="#1d1d1f" />
              <text x="105" y="74" fontSize="14" fontWeight="700" fill="#ef4444">r</text>
            </svg>
            <figcaption>Kugel mit Radius r</figcaption>
          </div>
        </figure>
        <div className="formeln">
          <Formel name="Volumen" ausdruck={<>V = (4/3) · π · r³</>} />
          <Formel name="Oberfläche" ausdruck={<>O = 4 · π · r²</>} />
        </div>
        <Beispiel
          aufgabe={<>Ein Ball hat einen Radius von 6 cm. Wie groß ist sein Volumen (π ≈ 3,14)?</>}
          schritte={[
            <>V = (4/3) · 3,14 · 6³</>,
            <>V = (4/3) · 3,14 · 216 = 1,333… · 678,24</>,
            <>V ≈ <b>904,3 cm³</b></>,
          ]}
        />
        <div className="merke"><b>Achtung:</b> bei der Kugel-Oberfläche ist „4 · π · r²“ — das ist <i>genau viermal</i> die Fläche eines Kreises mit demselben Radius. Coole Eselsbrücke!</div>
      </Sektion>

      <Sektion nr={9} titel="Schnell-Übersicht aller Formeln">
        <div className="karten">
          <div className="karte"><h4>Dreieck</h4><p>A = ½ · g · h</p><p>Pythagoras: a² + b² = c²</p></div>
          <div className="karte"><h4>Quadrat</h4><p>U = 4a · A = a²</p></div>
          <div className="karte"><h4>Rechteck</h4><p>U = 2(a+b) · A = a·b</p></div>
          <div className="karte"><h4>Kreis</h4><p>U = 2πr · A = πr²</p></div>
          <div className="karte"><h4>Würfel</h4><p>V = a³ · O = 6a²</p></div>
          <div className="karte"><h4>Quader</h4><p>V = a·b·c</p></div>
          <div className="karte"><h4>Zylinder</h4><p>V = πr²·h</p></div>
          <div className="karte"><h4>Pyramide</h4><p>V = ⅓ · G · h</p></div>
          <div className="karte"><h4>Kegel</h4><p>V = ⅓ · π · r² · h</p></div>
          <div className="karte"><h4>Kugel</h4><p>V = (4/3)πr³ · O = 4πr²</p></div>
        </div>
      </Sektion>

      <p style={{ textAlign: "center", marginTop: "40px", color: "#6e6e73", fontSize: "14px" }}>Viel Erfolg in der nächsten Schulaufgabe! — Anna</p>
    </div>
  );
}
