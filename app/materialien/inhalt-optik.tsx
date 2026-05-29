"use client";
import { SHARED_STIL, Sektion, Formel, Beispiel, Joke, Hook } from "./_helfer";

export function InhaltOptik() {
  return (
    <div className="mat">
      <style>{SHARED_STIL("#8b5cf6", "#f5f3ff", "#ede9fe")}</style>

      <Hook><b>Licht ist verrückt.</b> Es ist gleichzeitig Welle und Teilchen, raast mit 300 000 km/s, biegt sich, spaltet sich in Farben und macht Regenbögen. Hier erfährst du, wie das alles funktioniert.</Hook>

      <Sektion nr={1} titel="Lichtausbreitung und Schatten">
        <p>Licht breitet sich in <b>geraden Linien</b> aus — solange es nichts unterbricht. Wo Licht fehlt, gibt es Schatten.</p>
        <div className="karten">
          <div className="karte"><h5>Kernschatten</h5><p>Der dunkle Bereich, wo gar kein Licht hinkommt</p></div>
          <div className="karte"><h5>Halbschatten</h5><p>Teilweise erhellt — z.B. bei zwei Lampen</p></div>
        </div>
        <div className="einheit"><b>Lichtgeschwindigkeit:</b> c ≈ 300 000 km/s = 3 · 10⁸ m/s im Vakuum. Schneller geht's nicht — Einstein hat gefragt.</div>
        <Joke>Warum überholt nichts das Licht? Weil es schon längst da war, bevor du losgerannt bist.</Joke>
      </Sektion>

      <Sektion nr={2} titel="Reflexion am Spiegel">
        <div className="gross">Einfallswinkel = Reflexionswinkel</div>
        <p>Wenn Licht auf einen Spiegel trifft, prallt es im <b>gleichen Winkel</b> zurück, wie es ankam. Beide Winkel werden zum <b>Lot</b> (senkrecht zum Spiegel) gemessen.</p>
        <div className="karten">
          <div className="karte"><h5>Ebener Spiegel</h5><p>Aufrecht, gleich groß wie das Objekt, virtuell, seitenverkehrt</p></div>
          <div className="karte"><h5>Hohlspiegel (konkav)</h5><p>Bündelt Licht in einem Brennpunkt</p></div>
          <div className="karte"><h5>Wölbspiegel (konvex)</h5><p>Streut Licht (Außenspiegel beim Auto)</p></div>
        </div>
      </Sektion>

      <Sektion nr={3} titel="Lichtbrechung und Snellius">
        <p>Licht wird <b>gebrochen</b>, wenn es in ein anderes Medium übergeht (z.B. Luft → Wasser).</p>
        <div className="formeln">
          <Formel name="Snellius-Gesetz" ausdruck={<>sin(α)/sin(β) = n</>} hinweis="n = Brechungsindex" />
          <Formel name="Brechungs­index" ausdruck={<>n = c<sub>0</sub> / c<sub>Medium</sub></>} />
        </div>
        <table>
          <thead><tr><th>Medium</th><th>Brechungsindex n</th></tr></thead>
          <tbody>
            <tr><td>Vakuum</td><td>1</td></tr>
            <tr><td>Luft</td><td>1,0003</td></tr>
            <tr><td>Wasser</td><td>1,33</td></tr>
            <tr><td>Glas</td><td>1,5</td></tr>
            <tr><td>Diamant</td><td>2,42</td></tr>
          </tbody>
        </table>
        <Joke>Deswegen sieht dein Bein im Schwimmbecken so abgeknickt aus — kein medizinisches Problem, nur Brechung. Erleichterung, oder?</Joke>
        <h3>Totalreflexion</h3>
        <p>Beim Übergang vom optisch dichteren in dünneres Medium kann Licht <b>ganz reflektiert</b> werden — das ist das Prinzip der Glasfaserkabel.</p>
        <div className="formeln">
          <Formel name="Grenzwinkel" ausdruck={<>sin(α<sub>g</sub>) = n₂/n₁</>} hinweis="ab da Totalreflexion" />
        </div>
      </Sektion>

      <Sektion nr={4} titel="Linsen">
        <div className="karten">
          <div className="karte"><h5>Sammellinse (konvex)</h5><p>Bündelt Licht. Verwendet in Brillen für Weitsichtige, Lupen, Kameras.</p></div>
          <div className="karte"><h5>Zerstreuungslinse (konkav)</h5><p>Streut Licht. Brillen für Kurzsichtige.</p></div>
        </div>
        <div className="formeln">
          <Formel name="Linsenformel" ausdruck={<>1/f = 1/g + 1/b</>} hinweis="f = Brennweite, g = Gegenstandsweite, b = Bildweite" />
          <Formel name="Abbildungs­maßstab" ausdruck={<>B/G = b/g</>} hinweis="B = Bildgröße, G = Gegenstandsgröße" />
          <Formel name="Brechkraft" ausdruck={<>D = 1/f</>} hinweis="Einheit: Dioptrien (dpt = 1/m)" />
        </div>
        <Beispiel aufgabe={<>Brille mit −2 dpt. Welche Brennweite?</>}
          schritte={[<>f = 1/(−2) = −0,5 m = <b>−50 cm</b></>, <>Minus = Zerstreuungslinse → kurzsichtig</>]} />
        <Beispiel aufgabe={<>Gegenstand 10 cm vor Linse, Brennweite 5 cm. Bildweite?</>}
          schritte={[<>1/5 = 1/10 + 1/b</>, <>1/b = 1/10 → b = <b>10 cm</b></>]} />
      </Sektion>

      <Sektion nr={5} titel="Spektrum und Farben">
        <p>Weißes Licht ist eine <b>Mischung aus allen Farben</b>. Ein Prisma zerlegt es in den Regenbogen.</p>
        <table>
          <thead><tr><th>Farbe</th><th>Wellenlänge (nm)</th></tr></thead>
          <tbody>
            <tr><td>Rot</td><td>700</td></tr>
            <tr><td>Orange</td><td>620</td></tr>
            <tr><td>Gelb</td><td>580</td></tr>
            <tr><td>Grün</td><td>520</td></tr>
            <tr><td>Blau</td><td>470</td></tr>
            <tr><td>Violett</td><td>400</td></tr>
          </tbody>
        </table>
        <p>Außerhalb des sichtbaren Bereichs: <b>Infrarot</b> (Wärme) ist röter als rot, <b>UV-Licht</b> ist „lila-er als violett" (und macht Sonnenbrand).</p>
        <div className="formeln">
          <Formel name="Welle" ausdruck={<>c = λ · f</>} hinweis="λ Wellenlänge, f Frequenz" />
        </div>
      </Sektion>

      <Sektion nr={6} titel="Wellen — Schwingungen ausgebreitet">
        <div className="formeln">
          <Formel name="Frequenz" ausdruck={<>f = 1/T</>} hinweis="T = Periodendauer" />
          <Formel name="Wellengleichung" ausdruck={<>c = λ · f</>} />
          <Formel name="Schallgeschwindigkeit" ausdruck={<>≈ 343 m/s</>} hinweis="in Luft bei 20 °C" />
        </div>
        <h3>Wellenarten</h3>
        <div className="karten">
          <div className="karte"><h5>Längswellen</h5><p>Schwingen in Ausbreitungs­richtung (Schall in Luft)</p></div>
          <div className="karte"><h5>Querwellen</h5><p>Schwingen senkrecht zur Ausbreitung (Wasser, Licht)</p></div>
        </div>
        <h3>Welleneigenschaften</h3>
        <ul style={{ marginLeft: "20px" }}>
          <li><b>Reflexion</b> — abprallen</li>
          <li><b>Brechung</b> — abknicken im neuen Medium</li>
          <li><b>Interferenz</b> — überlagern (sich verstärken oder auslöschen)</li>
          <li><b>Beugung</b> — um Hindernisse herum biegen</li>
        </ul>
        <Joke>Schall fliegt mit ~340 m/s. Licht mit 300 000 000 m/s. Deswegen siehst du Blitz zuerst und hörst Donner danach — das Licht hatte schon eine Tasse Kaffee, während der Schall noch geschnürt hat.</Joke>
      </Sektion>

      <Sektion nr={7} titel="Übungen mit Lösungen">
        <Beispiel aufgabe={<>Brennweite eines Spiegels für 4-dpt-Linse?</>}
          schritte={[<>f = 1/4 = 0,25 m = <b>25 cm</b></>]} />
        <Beispiel aufgabe={<>Welche Geschwindigkeit hat Licht in Glas (n = 1,5)?</>}
          schritte={[<>c<sub>Glas</sub> = 3·10⁸ / 1,5 = <b>2·10⁸ m/s</b></>]} />
        <Beispiel aufgabe={<>Linsenformel: g = 20 cm, f = 10 cm. b = ?</>}
          schritte={[<>1/10 = 1/20 + 1/b → 1/b = 1/20 → b = <b>20 cm</b></>]} />
      </Sektion>

      <p style={{ textAlign: "center", marginTop: "30px", color: "#6e6e73", fontSize: "14px" }}>Du verstehst jetzt, wie Licht tickt — und warum dein Bein im Wasser komisch aussieht. — Anna</p>
    </div>
  );
}
