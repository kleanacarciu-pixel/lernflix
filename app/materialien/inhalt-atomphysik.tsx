"use client";
import { SHARED_STIL, Sektion, Formel, Beispiel, Joke, Hook } from "./_helfer";

export function InhaltAtomphysik() {
  return (
    <div className="mat">
      <style>{SHARED_STIL("#10b981", "#ecfdf5", "#d1fae5")}</style>

      <Hook><b>Atome sind winzig kleine Universen.</b> In der Mitte ein Kern mit Protonen und Neutronen, drum herum sausen Elektronen. Wenn du diesem Mikro-System auf den Grund gehst, landest du irgendwann bei Strahlung, Atomkraft und Quantenphysik. Klingt wild — ist es auch.</Hook>

      <Sektion nr={1} titel="Der Aufbau der Atome">
        <div className="karten">
          <div className="karte"><h5>Proton (p⁺)</h5><p>Positive Ladung. Im Kern.</p></div>
          <div className="karte"><h5>Neutron (n)</h5><p>Keine Ladung. Im Kern.</p></div>
          <div className="karte"><h5>Elektron (e⁻)</h5><p>Negative Ladung. In der Hülle.</p></div>
        </div>
        <div className="formeln">
          <Formel name="Ordnungszahl Z" ausdruck={<>= Anzahl Protonen</>} hinweis="= Anzahl Elektronen (im neutralen Atom)" />
          <Formel name="Massenzahl A" ausdruck={<>= Protonen + Neutronen</>} />
          <Formel name="Neutronenzahl" ausdruck={<>N = A − Z</>} />
        </div>
        <Joke>Atome sind zu 99,99 % leerer Raum. Wenn du also alles Leere aus dir rausholst, bleibt nur ein winziges Pünktchen übrig. Wenig erfreulich, aber wissenschaftlich korrekt.</Joke>
      </Sektion>

      <Sektion nr={2} titel="Isotope und das Periodensystem">
        <p>Atome desselben Elements können verschiedene Neutronenzahlen haben. Das sind <b>Isotope</b>.</p>
        <p>Schreibweise: <sup>A</sup><sub>Z</sub>X — z.B. ¹⁴₆C (Kohlenstoff-14).</p>
        <table>
          <thead><tr><th>Element</th><th>Z</th><th>Stabile Isotope</th></tr></thead>
          <tbody>
            <tr><td>Wasserstoff (H)</td><td>1</td><td>¹H, ²H (Deuterium), ³H (Tritium)</td></tr>
            <tr><td>Kohlenstoff (C)</td><td>6</td><td>¹²C, ¹³C, ¹⁴C (radioaktiv)</td></tr>
            <tr><td>Sauerstoff (O)</td><td>8</td><td>¹⁶O, ¹⁷O, ¹⁸O</td></tr>
            <tr><td>Uran (U)</td><td>92</td><td>²³⁵U, ²³⁸U</td></tr>
          </tbody>
        </table>
      </Sektion>

      <Sektion nr={3} titel="Radioaktivität — drei Strahlungsarten">
        <div className="karten">
          <div className="karte"><h5>α-Strahlung (Alpha)</h5><p>Heliumkerne (2p + 2n). Reichweite: wenige cm in Luft. Hält schon ein Blatt Papier auf.</p></div>
          <div className="karte"><h5>β-Strahlung (Beta)</h5><p>Schnelle Elektronen. Reichweite: einige Meter in Luft. Hält eine dünne Aluplatte.</p></div>
          <div className="karte"><h5>γ-Strahlung (Gamma)</h5><p>Elektromagnetische Welle. Reichweite: sehr weit. Braucht dicken Beton oder Blei zum Stoppen.</p></div>
        </div>
        <div className="formeln">
          <Formel name="α-Zerfall" ausdruck={<><sup>A</sup>X → <sup>A−4</sup>Y + α</>} hinweis="Z sinkt um 2, A um 4" />
          <Formel name="β⁻-Zerfall" ausdruck={<><sup>A</sup>X → <sup>A</sup>Y + e<sup>−</sup></>} hinweis="Z steigt um 1, A bleibt" />
        </div>
        <div className="merke"><b>WICHTIG:</b> Radioaktive Strahlung ist gesundheitsschädlich. Sie kann Erbgut schädigen und Krebs auslösen. Strahlenschutz: <b>Abstand, Abschirmung, kurze Aufenthaltsdauer.</b></div>
      </Sektion>

      <Sektion nr={4} titel="Halbwertszeit">
        <p>Nach einer <b>Halbwertszeit T</b> ist die Hälfte der radioaktiven Atome zerfallen. Nach zwei Halbwertszeiten ist nur noch ein Viertel da, nach drei ein Achtel usw.</p>
        <div className="formeln">
          <Formel name="Zerfallsgesetz" ausdruck={<>N(t) = N₀ · (1/2)<sup>t/T</sup></>} hinweis="N = Anzahl, T = Halbwertszeit" />
          <Formel name="Aktivität" ausdruck={<>A = λ · N</>} hinweis="Einheit: Becquerel (Bq) = 1 Zerfall/s" />
        </div>
        <table>
          <thead><tr><th>Isotop</th><th>Halbwertszeit</th></tr></thead>
          <tbody>
            <tr><td>¹⁴C</td><td>5 730 Jahre</td></tr>
            <tr><td>¹³¹I (Jod)</td><td>8 Tage</td></tr>
            <tr><td>²³⁵U</td><td>704 Millionen Jahre</td></tr>
            <tr><td>²³⁸U</td><td>4,5 Milliarden Jahre</td></tr>
          </tbody>
        </table>
        <Beispiel aufgabe={<>Nach 3 Halbwertszeiten sind wie viel % noch übrig?</>}
          schritte={[<>1/2 · 1/2 · 1/2 = 1/8 = <b>12,5 %</b></>]} />
        <Joke>Die Halbwertszeit von Uran-238 ist 4,5 Milliarden Jahre. Das ist älter als die Erde. Wenn dir jemand sagt „nach 5 Sekunden ist die Aufmerksamkeitsspanne weg", denk an Uran — Geduld ist relativ.</Joke>
      </Sektion>

      <Sektion nr={5} titel="Kernspaltung und Kernfusion">
        <h3>Kernspaltung</h3>
        <p>Ein schwerer Atomkern wird zerbrochen — z.B. Uran-235. Dabei wird viel Energie frei.</p>
        <div className="formeln">
          <Formel name="Einstein" ausdruck={<>E = m · c²</>} hinweis="Masse verschwindet, wird zu Energie" />
        </div>
        <p><b>Anwendung:</b> Kernkraftwerke, Atombombe.</p>
        <h3>Kernfusion</h3>
        <p>Zwei leichte Kerne verschmelzen — z.B. Wasserstoff zu Helium. Noch mehr Energie als Spaltung.</p>
        <p><b>Anwendung:</b> Sonne und Sterne, Wasserstoffbombe, zukünftig Fusionsreaktoren.</p>
        <Beispiel aufgabe={<>Wenn 1 g Masse in Energie umgewandelt wird, wie viel Energie ist das?</>}
          schritte={[<>E = 0,001 · (3·10⁸)² = 0,001 · 9·10¹⁶</>, <>= <b>9·10¹³ J ≈ 25 GWh</b> (Strom für ca. 7000 Haushalte ein Jahr lang!)</>]} />
        <div className="tipp"><b>Wahnsinn:</b> Aus 1 Gramm Materie könntest du theoretisch eine ganze Kleinstadt für ein Jahr mit Strom versorgen. Das ist die Power, die in jedem Atom steckt.</div>
      </Sektion>

      <Sektion nr={6} titel="Atommodelle im Wandel">
        <table>
          <thead><tr><th>Jahr</th><th>Modell</th><th>Idee</th></tr></thead>
          <tbody>
            <tr><td>400 v.Chr.</td><td>Demokrit</td><td>Atome sind unteilbar</td></tr>
            <tr><td>1803</td><td>Dalton</td><td>Atome sind kleine Kügelchen</td></tr>
            <tr><td>1903</td><td>Thomson</td><td>„Rosinenkuchen": positive Masse mit Elektronen</td></tr>
            <tr><td>1911</td><td>Rutherford</td><td>Atom hat winzigen positiven Kern</td></tr>
            <tr><td>1913</td><td>Bohr</td><td>Elektronen auf festen Bahnen</td></tr>
            <tr><td>seit 1926</td><td>Quantenmechanik</td><td>Elektronen als „Wolken" (Orbitale)</td></tr>
          </tbody>
        </table>
        <Joke>Demokrit hatte schon 400 v.Chr. die Idee — aber kein Mikroskop, um sie zu beweisen. So weit ihrer Zeit voraus, dass es 2300 Jahre dauerte, bis ihm jemand glaubte. Patience-Olympiade Gold.</Joke>
      </Sektion>

      <Sektion nr={7} titel="Quantenphysik — die Welt der ganz Kleinen">
        <p>In der Welt der Atome wird's komisch. Hier ein paar verrückte Fakten:</p>
        <div className="karten">
          <div className="karte"><h5>Welle-Teilchen-Dualismus</h5><p>Licht ist Welle UND Teilchen. Elektronen auch. Frage „was denn nun?" — Antwort: beides.</p></div>
          <div className="karte"><h5>Heisenberg-Unschärfe</h5><p>Ort und Impuls kannst du nie gleichzeitig genau wissen. Δx · Δp ≥ ℏ/2</p></div>
          <div className="karte"><h5>Photoeffekt</h5><p>Licht schlägt Elektronen aus Metall (Solarzelle!). E = h·f</p></div>
          <div className="karte"><h5>Quantelung</h5><p>Energie gibt's nur in Päckchen, nicht stufenlos. E<sub>n</sub> = n·h·f</p></div>
        </div>
        <div className="formeln">
          <Formel name="Photonenenergie" ausdruck={<>E = h · f</>} hinweis="h = Plancksches Wirkungsquantum" />
          <Formel name="De-Broglie-Wellenlänge" ausdruck={<>λ = h / p</>} hinweis="auch Teilchen sind Wellen" />
        </div>
        <Joke>Schrödingers Katze ist gleichzeitig tot und lebendig — bis du nachschaust. Erfreut mich nicht so sehr, als „darüber nicht nachdenken" — was natürlich nicht hilft.</Joke>
      </Sektion>

      <Sektion nr={8} titel="Übungen mit Lösungen">
        <Beispiel aufgabe={<>²³⁸U zerfällt mit α-Strahlung. Was bleibt?</>}
          schritte={[<>A: 238 − 4 = 234, Z: 92 − 2 = 90</>, <>= <b>²³⁴Th (Thorium)</b></>]} />
        <Beispiel aufgabe={<>Nach 4 Halbwertszeiten: wie viel % der Atome sind noch da?</>}
          schritte={[<>(1/2)⁴ = 1/16 = <b>6,25 %</b></>]} />
        <Beispiel aufgabe={<>Wie viel Protonen und Neutronen hat ¹²⁷₅₃I?</>}
          schritte={[<>Z = 53 → <b>53 Protonen</b></>, <>N = 127 − 53 = <b>74 Neutronen</b></>]} />
      </Sektion>

      <p style={{ textAlign: "center", marginTop: "30px", color: "#6e6e73", fontSize: "14px" }}>Du verstehst jetzt Atome — und warum Physiker nachts manchmal schlecht schlafen. — Anna</p>
    </div>
  );
}
