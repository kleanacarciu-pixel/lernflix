"use client";
import { type ReactNode } from "react";

const STIL = `
  .mat { font-size:16px; line-height:1.7; color:#1d1d1f; }
  .mat h2 { font-family:Georgia,serif; font-size:26px; font-weight:800; color:#ef4444; margin:38px 0 14px; display:flex; align-items:center; gap:12px; }
  .mat h2 .num { background:#ef4444; color:#fff; min-width:36px; height:36px; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; font-size:18px; padding:0 6px; }
  .mat h3 { font-size:19px; font-weight:700; margin:22px 0 10px; }
  .mat h4 { font-size:16px; font-weight:700; margin:14px 0 6px; color:#ef4444; }
  .mat p { margin:8px 0; }
  .mat .erkl { color:#3a3a3c; }
  .mat .fig { background:#fff5f5; border-radius:14px; padding:18px; margin:14px 0; display:flex; justify-content:center; flex-wrap:wrap; gap:18px; }
  .mat .fig figcaption { font-size:13px; color:#6e6e73; text-align:center; margin-top:8px; }
  .mat .formeln { display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:10px; margin:14px 0; }
  .mat .formel { background:#fff1f1; border:1.5px solid #fbcaca; border-radius:12px; padding:14px 16px; }
  .mat .formel .name { font-size:12px; color:#b91c1c; font-weight:700; text-transform:uppercase; letter-spacing:0.06em; margin-bottom:6px; }
  .mat .formel .ausdruck { font-family:Georgia,serif; font-size:17px; font-weight:700; }
  .mat .formel .hinweis { font-size:13px; color:#6e6e73; margin-top:6px; }
  .mat .beispiel { background:#eef6ff; border-left:4px solid #ef4444; border-radius:10px; padding:14px 18px; margin:14px 0; }
  .mat .beispiel .lbl { font-size:12px; font-weight:700; color:#ef4444; text-transform:uppercase; letter-spacing:0.06em; margin-bottom:6px; }
  .mat .beispiel ol { padding-left:22px; margin:8px 0 0; }
  .mat .beispiel li { margin:6px 0; }
  .mat .merke { background:#fff8e6; border-left:4px solid #f59e0b; border-radius:10px; padding:12px 16px; margin:14px 0; font-size:15px; }
  .mat .merke b { color:#a37300; }
  .mat .tipp { background:#e7f7ec; border-left:4px solid #34c759; border-radius:10px; padding:12px 16px; margin:14px 0; font-size:15px; }
  .mat .tipp b { color:#1f7f3a; }
  .mat .einheit { background:#fff; border:1px solid #ececec; border-radius:10px; padding:10px 14px; margin:8px 0; font-size:15px; }
  .mat table { width:100%; border-collapse:collapse; margin:14px 0; font-size:14.5px; }
  .mat th { background:#ef4444; color:#fff; padding:9px 12px; text-align:left; font-size:13px; }
  .mat td { padding:8px 12px; border-bottom:1px solid #ececec; }
  .mat tr:nth-child(even) td { background:#fff8f8; }
  .mat .karten { display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:12px; margin:14px 0; }
  .mat .karte { background:#fff; border:1px solid #ececec; border-radius:14px; padding:14px 16px; }
  .mat .karte h5 { font-size:15px; font-weight:700; margin:0 0 6px; color:#ef4444; }
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

export function InhaltMechanik() {
  return (
    <div className="mat">
      <style>{STIL}</style>

      <p className="erkl">Mechanik ist der Teil der Physik, in dem es um Bewegungen, Kräfte und Energie geht. In diesem Heft findest du <b>alle</b> Formeln aus der Mechanik der Schule — von der Geschwindigkeit bis zur Kreisbewegung. Mit Skizzen aus dem Alltag, durchgerechneten Beispielen und Tipps.</p>

      <Sektion nr={1} titel="Geschwindigkeit (v)">
        <p className="erkl">Geschwindigkeit = wie viel Strecke pro Zeit. Eine der wichtigsten Formeln der Physik.</p>
        <div className="formeln">
          <Formel name="Geschwindigkeit" ausdruck={<>v = s / t</>} hinweis="Strecke / Zeit" />
          <Formel name="Strecke" ausdruck={<>s = v · t</>} />
          <Formel name="Zeit" ausdruck={<>t = s / v</>} />
          <Formel name="Durchschnitts­geschwindigkeit" ausdruck={<>v̄ = s<sub>ges</sub> / t<sub>ges</sub></>} hinweis="gesamte Strecke / gesamte Zeit" />
        </div>
        <h3>Einheiten und Umrechnung</h3>
        <div className="einheit"><b>1 m/s = 3,6 km/h</b> &nbsp;·&nbsp; <b>1 km/h = 1/3,6 m/s</b></div>
        <table>
          <thead><tr><th>m/s</th><th>km/h</th><th>Beispiel</th></tr></thead>
          <tbody>
            <tr><td>1</td><td>3,6</td><td>schneller Spaziergang</td></tr>
            <tr><td>5</td><td>18</td><td>Joggen</td></tr>
            <tr><td>10</td><td>36</td><td>schnelles Fahrrad</td></tr>
            <tr><td>30</td><td>108</td><td>Auto auf Landstraße</td></tr>
            <tr><td>300 000 000</td><td>~10⁹</td><td>Lichtgeschwindigkeit c</td></tr>
          </tbody>
        </table>
        <Beispiel aufgabe={<>Ein Radfahrer fährt 30 km in 2 h. Wie schnell ist er (in m/s)?</>}
          schritte={[<>v = 30 km : 2 h = <b>15 km/h</b></>, <>In m/s: 15 / 3,6 ≈ <b>4,17 m/s</b></>]} />
        <Beispiel aufgabe={<>Wie lange braucht ein Auto bei 90 km/h für 360 km?</>}
          schritte={[<>t = s / v = 360 / 90</>, <>= <b>4 Stunden</b></>]} />
      </Sektion>

      <Sektion nr={2} titel="Beschleunigung und beschleunigte Bewegung">
        <p className="erkl">Beschleunigung a = wie schnell sich die Geschwindigkeit ändert. Einheit: m/s².</p>
        <h3>Grundformeln</h3>
        <div className="formeln">
          <Formel name="Beschleunigung" ausdruck={<>a = Δv / t</>} hinweis="Geschwindigkeits­änderung pro Zeit" />
          <Formel name="Geschwindigkeit aus Stand" ausdruck={<>v = a · t</>} />
          <Formel name="Mit Anfangs-v" ausdruck={<>v = v₀ + a · t</>} />
          <Formel name="Strecke aus Stand" ausdruck={<>s = ½ · a · t²</>} />
          <Formel name="Strecke allgemein" ausdruck={<>s = v₀ · t + ½ · a · t²</>} />
          <Formel name="v² aus s" ausdruck={<>v² = v₀² + 2 · a · s</>} hinweis="ohne Zeit, sehr praktisch" />
        </div>
        <Beispiel aufgabe={<>Auto: Anfangsgeschwindigkeit 0, Beschleunigung 4 m/s² über 5 Sekunden. Berechne v und s.</>}
          schritte={[<>v = a · t = 4 · 5 = <b>20 m/s</b> (72 km/h)</>, <>s = ½ · a · t² = ½ · 4 · 25 = <b>50 m</b></>]} />
        <Beispiel aufgabe={<>Auto bremst von 30 m/s in 6 s zum Stillstand. Wie groß ist die Bremsverzögerung?</>}
          schritte={[<>a = Δv / t = −30 / 6 = <b>−5 m/s²</b></>]} />
      </Sektion>

      <Sektion nr={3} titel="Freier Fall und Wurfbewegungen">
        <p className="erkl">Im freien Fall wirkt nur die <b>Erdbeschleunigung g ≈ 9,81 m/s²</b>.</p>
        <h3>Freier Fall (aus dem Stand)</h3>
        <div className="formeln">
          <Formel name="Geschwindigkeit" ausdruck={<>v = g · t</>} />
          <Formel name="Fallstrecke" ausdruck={<>s = ½ · g · t²</>} />
          <Formel name="Fallzeit" ausdruck={<>t = √(2s / g)</>} />
          <Formel name="Aufprall­geschwindigkeit" ausdruck={<>v = √(2 · g · h)</>} />
        </div>
        <h3>Senkrechter Wurf nach oben</h3>
        <div className="formeln">
          <Formel name="Geschwindigkeit" ausdruck={<>v = v₀ − g · t</>} />
          <Formel name="Höhe" ausdruck={<>h = v₀ · t − ½ · g · t²</>} />
          <Formel name="Steigzeit" ausdruck={<>t<sub>S</sub> = v₀ / g</>} />
          <Formel name="Steighöhe" ausdruck={<>h<sub>max</sub> = v₀² / (2g)</>} />
        </div>
        <h3>Waagerechter Wurf</h3>
        <div className="formeln">
          <Formel name="Waagerecht (x)" ausdruck={<>x = v₀ · t</>} />
          <Formel name="Senkrecht (y)" ausdruck={<>y = ½ · g · t²</>} />
          <Formel name="Flugbahn" ausdruck={<>y = (g / 2v₀²) · x²</>} hinweis="Parabel" />
        </div>
        <Beispiel aufgabe={<>Stein fällt 80 m tief. Wie schnell schlägt er auf (g = 9,81)?</>}
          schritte={[<>v = √(2 · 9,81 · 80) = √1569,6 ≈ <b>39,6 m/s</b></>]} />
      </Sektion>

      <Sektion nr={4} titel="Newton'sche Gesetze und Kräfte">
        <p className="erkl">Drei Grundgesetze beschreiben das Verhalten aller Körper unter Krafteinwirkung.</p>
        <h3>Die drei Newton'schen Gesetze</h3>
        <div className="karten">
          <div className="karte"><h5>1. Trägheitsgesetz</h5><p>Ohne Kraft bleibt ein Körper in Ruhe oder bewegt sich gleichförmig geradlinig weiter.</p></div>
          <div className="karte"><h5>2. Grundgesetz</h5><p>F = m · a — Kraft = Masse · Beschleunigung</p></div>
          <div className="karte"><h5>3. Wechselwirkung</h5><p>Aktion = Reaktion: Jede Kraft hat eine gleich große Gegenkraft.</p></div>
        </div>
        <h3>Wichtige Kraftformeln</h3>
        <div className="formeln">
          <Formel name="Allgemeine Kraft" ausdruck={<>F = m · a</>} hinweis="N = kg · m/s²" />
          <Formel name="Gewichtskraft" ausdruck={<>F<sub>G</sub> = m · g</>} hinweis="g ≈ 9,81 m/s² (Erde)" />
          <Formel name="Normalkraft" ausdruck={<>F<sub>N</sub> = m · g · cos(α)</>} hinweis="auf schiefer Ebene" />
          <Formel name="Hangabtriebskraft" ausdruck={<>F<sub>H</sub> = m · g · sin(α)</>} hinweis="auf schiefer Ebene" />
          <Formel name="Reibungskraft" ausdruck={<>F<sub>R</sub> = μ · F<sub>N</sub></>} />
          <Formel name="Federkraft (Hooke)" ausdruck={<>F = D · s</>} hinweis="D = Federkonstante, s = Auslenkung" />
          <Formel name="Auftriebskraft" ausdruck={<>F<sub>A</sub> = ρ · g · V</>} hinweis="(Archimedes)" />
          <Formel name="Zentripetalkraft" ausdruck={<>F<sub>Z</sub> = m · v² / r</>} hinweis="bei Kreisbewegung" />
        </div>
        <div className="einheit"><b>1 Newton (N)</b> = die Kraft, die 1 kg um 1 m/s² beschleunigt.</div>
        <Beispiel aufgabe={<>Welche Kraft beschleunigt eine 5-kg-Masse mit 2 m/s²?</>}
          schritte={[<>F = m · a = 5 · 2 = <b>10 N</b></>]} />
        <Beispiel aufgabe={<>Welche Gewichtskraft hat eine 8-kg-Tasche?</>}
          schritte={[<>F<sub>G</sub> = 8 · 9,81 ≈ <b>78,5 N</b></>]} />
      </Sektion>

      <Sektion nr={5} titel="Schiefe Ebene und Kräftezerlegung">
        <p className="erkl">Auf einer Rampe (schiefe Ebene) zerlegt sich die Gewichtskraft in zwei Komponenten: parallel zur Ebene (Hangabtriebskraft) und senkrecht zur Ebene (Normalkraft).</p>
        <div className="formeln">
          <Formel name="Hangabtriebskraft" ausdruck={<>F<sub>H</sub> = m · g · sin(α)</>} hinweis="zieht den Körper bergab" />
          <Formel name="Normalkraft" ausdruck={<>F<sub>N</sub> = m · g · cos(α)</>} hinweis="drückt in die Ebene" />
          <Formel name="Reibung auf Ebene" ausdruck={<>F<sub>R</sub> = μ · m · g · cos(α)</>} />
          <Formel name="Beschleunigung" ausdruck={<>a = g · (sin(α) − μ · cos(α))</>} />
        </div>
        <Beispiel aufgabe={<>Kiste (10 kg) auf Rampe mit 30°. Wie groß ist die Hangabtriebskraft?</>}
          schritte={[<>F<sub>H</sub> = 10 · 9,81 · sin(30°) = 10 · 9,81 · 0,5</>, <>≈ <b>49 N</b></>]} />
      </Sektion>

      <Sektion nr={6} titel="Arbeit, Energie und Leistung">
        <p className="erkl">Wenn du Energie auf einen Körper überträgst (z.B. ihn anhebst), <b>verrichtest du Arbeit</b>. Energie kann nicht verloren gehen — nur umgewandelt werden.</p>
        <h3>Arbeit</h3>
        <div className="formeln">
          <Formel name="Allgemein" ausdruck={<>W = F · s</>} hinweis="N · m = Joule (J)" />
          <Formel name="Mit Winkel" ausdruck={<>W = F · s · cos(α)</>} hinweis="α zwischen Kraft und Weg" />
          <Formel name="Hubarbeit" ausdruck={<>W = m · g · h</>} />
          <Formel name="Beschleunigungsarbeit" ausdruck={<>W = ½ · m · v²</>} />
          <Formel name="Reibungsarbeit" ausdruck={<>W = F<sub>R</sub> · s</>} />
          <Formel name="Spannarbeit (Feder)" ausdruck={<>W = ½ · D · s²</>} />
        </div>
        <h3>Energieformen</h3>
        <div className="formeln">
          <Formel name="Lageenergie (potentiell)" ausdruck={<>E<sub>pot</sub> = m · g · h</>} />
          <Formel name="Bewegungsenergie (kinetisch)" ausdruck={<>E<sub>kin</sub> = ½ · m · v²</>} />
          <Formel name="Spannenergie (Feder)" ausdruck={<>E<sub>Sp</sub> = ½ · D · s²</>} />
          <Formel name="Energieerhaltung" ausdruck={<>E<sub>ges</sub> = E<sub>kin</sub> + E<sub>pot</sub> = const.</>} />
        </div>
        <h3>Leistung</h3>
        <div className="formeln">
          <Formel name="Leistung" ausdruck={<>P = W / t</>} hinweis="Watt (W) = J/s" />
          <Formel name="Mit Geschwindigkeit" ausdruck={<>P = F · v</>} />
          <Formel name="Wirkungsgrad" ausdruck={<>η = E<sub>nutz</sub> / E<sub>auf</sub></>} hinweis="meist in Prozent" />
          <Formel name="Wirkungsgrad mit P" ausdruck={<>η = P<sub>nutz</sub> / P<sub>auf</sub></>} />
        </div>
        <Beispiel aufgabe={<>Du hebst 10 kg um 1,5 m hoch. Welche Arbeit verrichtest du?</>}
          schritte={[<>W = m · g · h = 10 · 9,81 · 1,5</>, <>≈ <b>147 J</b></>]} />
        <Beispiel aufgabe={<>Ball (0,5 kg) hat Geschwindigkeit 8 m/s. Welche Bewegungsenergie?</>}
          schritte={[<>E<sub>kin</sub> = ½ · 0,5 · 8² = 0,25 · 64 = <b>16 J</b></>]} />
        <div className="merke"><b>Achtung:</b> bei E<sub>kin</sub> wird das v <i>quadriert</i> — doppelte Geschwindigkeit = <i>viermal</i> so viel Energie. Deshalb sind Unfälle bei hoher Geschwindigkeit so gefährlich.</div>
      </Sektion>

      <Sektion nr={7} titel="Hebel und Drehmoment">
        <p className="erkl">Ein Hebel hilft dir, mit wenig Kraft viel zu bewegen — wie bei einer Wippe oder einem Brecheisen.</p>
        <figure className="fig">
          <div>
            <svg width="360" height="170" viewBox="0 0 360 170">
              <polygon points="170,110 160,140 180,140" fill="#1d1d1f" />
              <line x1="40" y1="110" x2="320" y2="110" stroke="#1d1d1f" strokeWidth="4" />
              <rect x="40" y="80" width="40" height="30" fill="#ef4444" />
              <text x="50" y="100" fontSize="14" fontWeight="700" fill="#fff">L</text>
              <line x1="290" y1="60" x2="290" y2="100" stroke="#0071e3" strokeWidth="3" />
              <polygon points="285,98 290,110 295,98" fill="#0071e3" />
              <text x="280" y="55" fontSize="14" fontWeight="700" fill="#0071e3">F</text>
              <line x1="60" y1="130" x2="170" y2="130" stroke="#34c759" strokeWidth="1.5" />
              <text x="95" y="150" fontSize="12" fill="#34c759">l₁ Lastarm</text>
              <line x1="170" y1="130" x2="290" y2="130" stroke="#5856d6" strokeWidth="1.5" />
              <text x="200" y="150" fontSize="12" fill="#5856d6">l₂ Kraftarm</text>
            </svg>
          </div>
        </figure>
        <h3>Zweiseitiger Hebel (Wippe)</h3>
        <div className="formeln">
          <Formel name="Hebelgesetz" ausdruck={<>F₁ · l₁ = F₂ · l₂</>} hinweis="Last·Lastarm = Kraft·Kraftarm" />
          <Formel name="Drehmoment" ausdruck={<>M = F · l</>} hinweis="Einheit: Newtonmeter (Nm)" />
        </div>
        <h3>Einseitiger Hebel (z.B. Schubkarre)</h3>
        <p className="erkl">Last und Kraft auf der gleichen Seite des Drehpunkts.</p>
        <Beispiel aufgabe={<>Kind 300 N sitzt 2 m vom Drehpunkt. Erwachsener 600 N — wie weit muss er sitzen für Gleichgewicht?</>}
          schritte={[<>300 · 2 = 600 · l₂</>, <>l₂ = 600 / 600 = <b>1 m</b></>]} />
        <div className="tipp"><b>Goldene Regel der Mechanik:</b> Was man an Kraft spart, muss man an Weg „bezahlen". Bei der Schubkarre brauchst du weniger Kraft als das Gewicht, musst aber den Griff weiter heben.</div>
      </Sektion>

      <Sektion nr={8} titel="Rollen und Flaschenzug">
        <p className="erkl">Rollen und Flaschenzüge sind Maschinen, die Kräfte umlenken oder verteilen.</p>
        <div className="karten">
          <div className="karte"><h5>Feste Rolle</h5><p>Lenkt die Kraft nur um.</p><p>F = F<sub>L</sub></p><p>Spart KEINE Kraft.</p></div>
          <div className="karte"><h5>Lose Rolle</h5><p>Halbiert die nötige Kraft.</p><p>F = F<sub>L</sub> / 2</p><p>Weg verdoppelt sich.</p></div>
          <div className="karte"><h5>Flaschenzug (n tragende Seile)</h5><p>F = F<sub>L</sub> / n</p><p>Weg = n · Lastweg</p></div>
        </div>
        <Beispiel aufgabe={<>Last 600 N am Flaschenzug mit 3 tragenden Seilen.</>}
          schritte={[<>F = 600 / 3 = <b>200 N</b></>, <>Lastweg 1 m → Zugweg <b>3 m</b></>]} />
      </Sektion>

      <Sektion nr={9} titel="Impuls und Impulserhaltung">
        <p className="erkl">Der Impuls ist „die Wucht einer Bewegung" — abhängig von Masse und Geschwindigkeit.</p>
        <div className="formeln">
          <Formel name="Impuls" ausdruck={<>p = m · v</>} hinweis="Einheit: kg·m/s" />
          <Formel name="Impulsänderung" ausdruck={<>Δp = F · Δt</>} hinweis="F = Kraft, Δt = Zeit" />
          <Formel name="Impulserhaltung" ausdruck={<>m₁·v₁ + m₂·v₂ = m₁·v₁' + m₂·v₂'</>} hinweis="vor = nach (bei Stoß)" />
        </div>
        <h3>Stoßarten</h3>
        <div className="karten">
          <div className="karte"><h5>Elastischer Stoß</h5><p>Impuls und Energie bleiben erhalten. Bälle prallen wie neu ab.</p></div>
          <div className="karte"><h5>Unelastischer Stoß</h5><p>Nur Impuls bleibt erhalten, Energie geht teilweise in Wärme/Verformung.</p></div>
        </div>
        <Beispiel aufgabe={<>Ein 1500-kg-Auto fährt mit 20 m/s. Wie groß ist sein Impuls?</>}
          schritte={[<>p = 1500 · 20 = <b>30 000 kg·m/s</b></>]} />
      </Sektion>

      <Sektion nr={10} titel="Kreisbewegung">
        <p className="erkl">Bei einer Kreisbewegung wirkt eine Kraft zur Mitte (Zentripetalkraft).</p>
        <div className="formeln">
          <Formel name="Bahngeschwindigkeit" ausdruck={<>v = 2·π·r / T</>} hinweis="T = Umlaufdauer" />
          <Formel name="Winkelgeschwindigkeit" ausdruck={<>ω = 2·π / T</>} hinweis="rad/s" />
          <Formel name="Frequenz" ausdruck={<>f = 1 / T</>} hinweis="Hertz (Hz)" />
          <Formel name="Verbindung" ausdruck={<>v = ω · r</>} />
          <Formel name="Zentripetal­beschleunigung" ausdruck={<>a<sub>z</sub> = v² / r</>} />
          <Formel name="Zentripetalkraft" ausdruck={<>F<sub>Z</sub> = m · v² / r</>} />
          <Formel name="Mit ω" ausdruck={<>F<sub>Z</sub> = m · ω² · r</>} />
        </div>
        <Beispiel aufgabe={<>Karussell, r = 5 m, eine Umdrehung in 4 s. v = ?</>}
          schritte={[<>v = 2 · 3,14 · 5 / 4 = 31,4 / 4 ≈ <b>7,85 m/s</b></>]} />
      </Sektion>

      <Sektion nr={11} titel="Hookesches Gesetz und Federkraft">
        <p className="erkl">Eine Feder dehnt sich proportional zur Kraft — solange sie nicht überdehnt wird.</p>
        <div className="formeln">
          <Formel name="Federkraft" ausdruck={<>F = D · s</>} hinweis="D = Federkonstante (N/m)" />
          <Formel name="Federkonstante" ausdruck={<>D = F / s</>} />
          <Formel name="Spannenergie" ausdruck={<>E = ½ · D · s²</>} />
        </div>
        <Beispiel aufgabe={<>Feder mit D = 50 N/m wird um 0,2 m gedehnt. Welche Kraft?</>}
          schritte={[<>F = 50 · 0,2 = <b>10 N</b></>]} />
      </Sektion>

      <Sektion nr={12} titel="Reibung">
        <p className="erkl">Reibung wirkt immer der Bewegung entgegen. Drei Arten:</p>
        <table>
          <thead><tr><th>Art</th><th>Wann</th><th>Größe</th></tr></thead>
          <tbody>
            <tr><td>Haftreibung</td><td>solange noch nichts bewegt wird</td><td>am größten</td></tr>
            <tr><td>Gleitreibung</td><td>wenn etwas gleitet</td><td>mittel</td></tr>
            <tr><td>Rollreibung</td><td>bei rollenden Rädern</td><td>am kleinsten</td></tr>
          </tbody>
        </table>
        <div className="formeln">
          <Formel name="Reibungskraft" ausdruck={<>F<sub>R</sub> = μ · F<sub>N</sub></>} hinweis="μ = Reibungszahl" />
          <Formel name="Reibungsarbeit" ausdruck={<>W<sub>R</sub> = F<sub>R</sub> · s</>} />
        </div>
        <h3>Beispiel-Reibungszahlen μ</h3>
        <table>
          <thead><tr><th>Materialpaar</th><th>μ Haft</th><th>μ Gleit</th></tr></thead>
          <tbody>
            <tr><td>Holz auf Holz</td><td>0,5</td><td>0,3</td></tr>
            <tr><td>Reifen auf trockener Straße</td><td>0,8</td><td>0,7</td></tr>
            <tr><td>Reifen auf nasser Straße</td><td>0,5</td><td>0,4</td></tr>
            <tr><td>Stahl auf Eis</td><td>0,03</td><td>0,01</td></tr>
          </tbody>
        </table>
        <Beispiel aufgabe={<>Kiste mit F<sub>G</sub> = 200 N, μ = 0,3 — wie groß ist die Reibungskraft?</>}
          schritte={[<>F<sub>R</sub> = 0,3 · 200 = <b>60 N</b></>]} />
      </Sektion>

      <Sektion nr={13} titel="Dichte und Druck">
        <p className="erkl">Die <b>Dichte ρ</b> sagt, wie schwer ein Stoff pro Volumen ist. Der <b>Druck p</b> ist Kraft pro Fläche.</p>
        <h3>Dichte</h3>
        <div className="formeln">
          <Formel name="Dichte" ausdruck={<>ρ = m / V</>} hinweis="kg/m³ oder g/cm³" />
          <Formel name="Masse" ausdruck={<>m = ρ · V</>} />
          <Formel name="Volumen" ausdruck={<>V = m / ρ</>} />
        </div>
        <table>
          <thead><tr><th>Stoff</th><th>ρ (g/cm³)</th></tr></thead>
          <tbody>
            <tr><td>Wasser</td><td>1,0</td></tr>
            <tr><td>Eis</td><td>0,92</td></tr>
            <tr><td>Holz (Fichte)</td><td>0,5</td></tr>
            <tr><td>Aluminium</td><td>2,7</td></tr>
            <tr><td>Eisen</td><td>7,87</td></tr>
            <tr><td>Gold</td><td>19,3</td></tr>
          </tbody>
        </table>
        <h3>Druck</h3>
        <div className="formeln">
          <Formel name="Druck" ausdruck={<>p = F / A</>} hinweis="N/m² = Pascal (Pa)" />
          <Formel name="Kraft" ausdruck={<>F = p · A</>} />
          <Formel name="Schweredruck (Flüssigkeit)" ausdruck={<>p = ρ · g · h</>} hinweis="h = Tiefe" />
          <Formel name="Luftdruck Normal" ausdruck={<>p<sub>0</sub> ≈ 1013 hPa</>} hinweis="= 1 bar" />
          <Formel name="Auftrieb (Archimedes)" ausdruck={<>F<sub>A</sub> = ρ<sub>Fl</sub> · g · V</>} />
        </div>
        <Beispiel aufgabe={<>Schwimmer am Beckenboden in 3 m Tiefe. Welcher Wasserdruck?</>}
          schritte={[<>p = 1000 · 9,81 · 3 = <b>29 430 Pa</b> (≈ 0,3 bar)</>]} />
      </Sektion>

      <Sektion nr={14} titel="Schnell-Übersicht aller Formeln">
        <table>
          <thead><tr><th>Größe</th><th>Formel</th><th>Einheit</th></tr></thead>
          <tbody>
            <tr><td>Geschwindigkeit</td><td>v = s/t</td><td>m/s, km/h</td></tr>
            <tr><td>Beschleunigung</td><td>a = Δv/t</td><td>m/s²</td></tr>
            <tr><td>Bewegung mit v₀</td><td>v = v₀+a·t · s = v₀·t+½·a·t²</td><td></td></tr>
            <tr><td>Freier Fall</td><td>v = √(2gh)</td><td></td></tr>
            <tr><td>Kraft</td><td>F = m·a</td><td>N</td></tr>
            <tr><td>Gewichtskraft</td><td>F<sub>G</sub> = m·g</td><td>N</td></tr>
            <tr><td>Reibungskraft</td><td>F<sub>R</sub> = μ·F<sub>N</sub></td><td>N</td></tr>
            <tr><td>Federkraft</td><td>F = D·s</td><td>N</td></tr>
            <tr><td>Arbeit</td><td>W = F·s</td><td>J</td></tr>
            <tr><td>Hubarbeit</td><td>W = m·g·h</td><td>J</td></tr>
            <tr><td>Bewegungsenergie</td><td>E<sub>kin</sub> = ½·m·v²</td><td>J</td></tr>
            <tr><td>Lageenergie</td><td>E<sub>pot</sub> = m·g·h</td><td>J</td></tr>
            <tr><td>Spannenergie</td><td>E = ½·D·s²</td><td>J</td></tr>
            <tr><td>Leistung</td><td>P = W/t · P = F·v</td><td>W</td></tr>
            <tr><td>Wirkungsgrad</td><td>η = E<sub>nutz</sub>/E<sub>auf</sub></td><td>—</td></tr>
            <tr><td>Hebel</td><td>F₁·l₁ = F₂·l₂</td><td>—</td></tr>
            <tr><td>Drehmoment</td><td>M = F·l</td><td>Nm</td></tr>
            <tr><td>Flaschenzug</td><td>F = F<sub>L</sub>/n</td><td>N</td></tr>
            <tr><td>Impuls</td><td>p = m·v</td><td>kg·m/s</td></tr>
            <tr><td>Zentripetalkraft</td><td>F<sub>Z</sub> = m·v²/r</td><td>N</td></tr>
            <tr><td>Winkelgeschwindigkeit</td><td>ω = 2π/T</td><td>rad/s</td></tr>
            <tr><td>Dichte</td><td>ρ = m/V</td><td>kg/m³</td></tr>
            <tr><td>Druck</td><td>p = F/A</td><td>Pa</td></tr>
            <tr><td>Schweredruck</td><td>p = ρ·g·h</td><td>Pa</td></tr>
            <tr><td>Auftrieb</td><td>F<sub>A</sub> = ρ·g·V</td><td>N</td></tr>
          </tbody>
        </table>
      </Sektion>

      <p style={{ textAlign: "center", marginTop: "40px", color: "#6e6e73", fontSize: "14px" }}>Viel Erfolg in der nächsten Physikarbeit! — Anna</p>
    </div>
  );
}
