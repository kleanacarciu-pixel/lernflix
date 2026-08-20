// =============================================================================
// /app-installieren – Anleitung: Kalender + Klassenzimmer als App aufs
// Handy/iPad/Tablet holen ("Zum Home-Bildschirm hinzufügen").
// Reine Info-Seite ohne Login, im hellen "Lerne mit Anna"-Design.
// =============================================================================
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Als App installieren – Lerne mit Anna",
  description: "So holst du dir Kalender und Klassenzimmer als App aufs Handy, iPad oder Tablet – ohne App Store.",
  manifest: "/manifest-app.json",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "Anna" },
};
export const viewport: Viewport = { themeColor: "#FFFFFF" };

const TEAL = "#2BB3C0";
const BLAU = "#3E7BB6";

const CSS = `
.appinfo{min-height:100dvh;background:#F7F9FB;color:#17222E;font-family:'Inter',system-ui,-apple-system,'Segoe UI',sans-serif;-webkit-font-smoothing:antialiased;padding:26px 16px 60px}
.appinfo *{box-sizing:border-box}
.appinfo .innen{max-width:620px;margin:0 auto}
.appinfo h1{font-size:1.55rem;font-weight:800;margin:14px 0 6px;letter-spacing:-.02em}
.appinfo .sub{color:#68737F;margin:0 0 22px;line-height:1.55}
.appinfo .card{background:#fff;border:1px solid #E2E7ED;border-radius:14px;padding:18px;margin-bottom:14px;box-shadow:0 1px 2px rgba(23,34,46,.04)}
.appinfo .card h2{margin:0 0 12px;font-size:1.05rem;font-weight:700;display:flex;align-items:center;gap:9px}
.appinfo ol{margin:0;padding-left:22px;line-height:1.7}
.appinfo li{margin-bottom:6px}
.appinfo .tipp{background:#E6F5F7;border:1px solid #C7E8EC;border-radius:11px;padding:11px 14px;font-size:.9rem;color:#0F6F79;margin-top:10px}
.appinfo .knopf{display:inline-block;background:linear-gradient(135deg,${TEAL},${BLAU});color:#fff;border-radius:11px;padding:11px 20px;font-weight:700;text-decoration:none;box-shadow:0 3px 10px rgba(43,179,192,.28)}
.appinfo .zurueck{color:#68737F;text-decoration:none;font-weight:600;font-size:.85rem}
.appinfo b{font-weight:700}
`;

export default function AppInstallierenPage() {
  return (
    <div className="appinfo">
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="innen">
        <a className="zurueck" href="/kalender">← Zum Kalender</a>
        <h1>🐙 Hol dir „Lerne mit Anna“ als App</h1>
        <p className="sub">
          Terminkalender und Klassenzimmer als App-Symbol auf deinem Handy, iPad oder Tablet –
          ganz ohne App Store, in einer Minute erledigt. Danach öffnet sich alles im Vollbild wie eine echte App,
          und du bleibst eingeloggt.
        </p>

        <div className="card">
          <h2>📱 iPhone &amp; iPad (Safari)</h2>
          <ol>
            <li>Öffne <b>lernflix.lernemitanna.de/kalender</b> in <b>Safari</b></li>
            <li>Tippe unten auf das <b>Teilen-Symbol</b> (Viereck mit Pfeil nach oben)</li>
            <li>Wische nach unten und tippe auf <b>„Zum Home-Bildschirm“</b></li>
            <li>Oben rechts <b>„Hinzufügen“</b> – fertig! 🎉</li>
          </ol>
          <div className="tipp">💡 Wichtig: Das klappt nur in <b>Safari</b>, nicht in Chrome oder in der Google-App.</div>
        </div>

        <div className="card">
          <h2>🤖 Android-Handy &amp; -Tablet (Chrome)</h2>
          <ol>
            <li>Öffne <b>lernflix.lernemitanna.de/kalender</b> in <b>Chrome</b></li>
            <li>Tippe oben rechts auf die <b>drei Punkte ⋮</b></li>
            <li>Tippe auf <b>„App installieren“</b> (oder „Zum Startbildschirm hinzufügen“)</li>
            <li>Bestätige mit <b>„Installieren“</b> – fertig! 🎉</li>
          </ol>
        </div>

        <div className="card">
          <h2>✨ Das hast du davon</h2>
          <ol>
            <li>Eigenes <b>App-Symbol</b> „Anna“ auf dem Startbildschirm</li>
            <li><b>Vollbild</b> ohne Browserleiste – wie eine echte App</li>
            <li><b>Eingeloggt bleiben</b> – einmal anmelden reicht</li>
            <li>Kalender, Chat, Materialien und <b>Live-Stunden mit Video</b> – alles drin</li>
            <li>Updates kommen <b>automatisch</b>, du musst nie etwas neu installieren</li>
          </ol>
        </div>

        <p style={{ textAlign: "center", marginTop: 26 }}>
          <a className="knopf" href="/kalender">Zum Terminkalender</a>
        </p>
      </div>
    </div>
  );
}
