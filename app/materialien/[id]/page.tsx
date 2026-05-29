"use client";
import { useEffect, useState, type ReactNode } from "react";
import { useParams } from "next/navigation";
import { InhaltGeometrie } from "../inhalt-geometrie";
import { InhaltPotenzen } from "../inhalt-potenzen";
import { InhaltMechanik } from "../inhalt-mechanik";

type Material = { id: string; titel: string; untertitel: string; preis: number; farbe: string; render: () => ReactNode };

const MATERIALIEN: Record<string, Material> = {
  geometrie: {
    id: "geometrie",
    titel: "Geometrie — Komplette Formelsammlung",
    untertitel: "Klasse 6 bis 9 · mit Figuren, Formeln und Beispielen",
    preis: 199,
    farbe: "#0071e3",
    render: () => <InhaltGeometrie />,
  },
  potenzen: {
    id: "potenzen",
    titel: "Potenzen — Komplettes Lernpaket",
    untertitel: "Klasse 7 bis 9 · alle Regeln, Tricks und Übungen",
    preis: 99,
    farbe: "#5856d6",
    render: () => <InhaltPotenzen />,
  },
  mechanik: {
    id: "mechanik",
    titel: "Mechanik — Komplettes Lernpaket",
    untertitel: "Klasse 8 bis 10 · Kraft, Energie, Bewegung mit Skizzen",
    preis: 99,
    farbe: "#ef4444",
    render: () => <InhaltMechanik />,
  },
};

export default function MaterialPage() {
  const params = useParams<{ id: string }>();
  const id = (params?.id || "").toString();
  const material = MATERIALIEN[id];

  const [entsperrt, setEntsperrt] = useState(false);
  const [pruefend, setPruefend] = useState(false);
  const [zahlungLaeuft, setZahlungLaeuft] = useState(false);
  const [fehler, setFehler] = useState("");

  useEffect(() => {
    if (typeof window === "undefined" || !material) return;

    // Test-Bypass nur auf der Preview-Domain
    const host = window.location.hostname;
    const istVorschau = host.endsWith(".vercel.app") || host === "localhost";
    const wuenscht = new URLSearchParams(window.location.search).get("test") === "ja";
    if (istVorschau && wuenscht) {
      setEntsperrt(true);
      return;
    }

    // Lokale Freischaltung (gleicher Browser, ein Mal bezahlt)
    try {
      const local = localStorage.getItem(`material_${id}_entsperrt`);
      if (local === "ja") {
        setEntsperrt(true);
        return;
      }
    } catch {}

    // Nach Stripe-Rueckkehr verifizieren
    const sid = new URLSearchParams(window.location.search).get("session_id");
    if (!sid) return;

    (async () => {
      setPruefend(true);
      try {
        const res = await fetch("/api/verify-lernheld", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_id: sid }),
        });
        const data = await res.json().catch(() => null);
        if (data && data.ok) {
          setEntsperrt(true);
          try { localStorage.setItem(`material_${id}_entsperrt`, "ja"); } catch {}
          window.history.replaceState({}, "", `/materialien/${id}`);
        } else {
          setFehler("Die Bezahlung konnte nicht bestätigt werden. Lade die Seite kurz neu.");
        }
      } catch {
        setFehler("Etwas ist schiefgegangen. Bitte versuche es nochmal.");
      }
      setPruefend(false);
    })();
  }, [id, material]);

  if (!material) {
    return (
      <main style={{ minHeight: "100vh", padding: "80px 20px", textAlign: "center", fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif" }}>
        <h1 style={{ fontSize: "28px", marginBottom: "12px" }}>Material nicht gefunden</h1>
        <a href="/" style={{ color: "#0071e3" }}>Zur Startseite</a>
      </main>
    );
  }

  async function zahlungStarten() {
    setZahlungLaeuft(true);
    setFehler("");
    try {
      const res = await fetch("/api/checkout-material", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json().catch(() => null);
      if (data && data.url) {
        window.location.href = data.url;
      } else {
        setFehler(data?.error || "Die Bezahlung konnte nicht gestartet werden.");
        setZahlungLaeuft(false);
      }
    } catch {
      setFehler("Die Bezahlung konnte nicht gestartet werden.");
      setZahlungLaeuft(false);
    }
  }

  const preisText = (material.preis / 100).toFixed(2).replace(".", ",") + " €";

  if (entsperrt) {
    return (
      <main style={{ minHeight: "100vh", background: "#fafafa", fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif", color: "#1d1d1f" }}>
        <div style={{ background: material.farbe, color: "#fff", padding: "32px 24px", textAlign: "center" }}>
          <a href="/" style={{ color: "rgba(255,255,255,0.85)", fontSize: "13px", textDecoration: "none", display: "block", marginBottom: "10px" }}>← Zurück zur Startseite</a>
          <h1 style={{ fontSize: "28px", fontWeight: 800, margin: "0 0 6px", fontFamily: "Georgia, serif" }}>{material.titel}</h1>
          <p style={{ fontSize: "15px", opacity: 0.9, margin: 0 }}>{material.untertitel}</p>
          <div style={{ marginTop: "18px", display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => window.print()} style={{ background: "rgba(255,255,255,0.18)", color: "#fff", border: "1px solid rgba(255,255,255,0.5)", borderRadius: "999px", padding: "8px 16px", fontSize: "13px", fontWeight: 700, cursor: "pointer" }}>Drucken / PDF</button>
          </div>
        </div>
        <div style={{ maxWidth: "820px", margin: "0 auto", padding: "32px 18px 80px" }}>
          {material.render()}
        </div>
      </main>
    );
  }

  // Paywall
  return (
    <main style={{ minHeight: "100vh", background: "#fafafa", fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif", color: "#1d1d1f" }}>
      <div style={{ maxWidth: "560px", margin: "0 auto", padding: "60px 20px" }}>
        <a href="/" style={{ color: "#6e6e73", fontSize: "13px", textDecoration: "none" }}>← Zurück zur Startseite</a>
        <div style={{ background: "#fff", borderRadius: "20px", padding: "36px 28px", marginTop: "20px", border: "1px solid #ececec", boxShadow: "0 6px 24px rgba(0,0,0,0.04)" }}>
          <div style={{ background: material.farbe, color: "#fff", borderRadius: "14px", padding: "20px 22px", marginBottom: "22px" }}>
            <div style={{ fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase", opacity: 0.85, fontWeight: 700, marginBottom: "6px" }}>Premium-Material</div>
            <h1 style={{ fontFamily: "Georgia, serif", fontSize: "26px", fontWeight: 800, margin: "0 0 6px" }}>{material.titel}</h1>
            <p style={{ fontSize: "14.5px", opacity: 0.92, margin: 0 }}>{material.untertitel}</p>
          </div>

          <h2 style={{ fontSize: "17px", fontWeight: 700, margin: "8px 0 12px" }}>Was du bekommst</h2>
          <ul style={{ paddingLeft: "20px", margin: "0 0 22px", color: "#3d3d40", fontSize: "15px", lineHeight: 1.7 }}>
            <li>Alle Themen mit beschrifteten Skizzen und Figuren</li>
            <li>Schritt-für-Schritt-Erklärungen wie eine Lehrerin am Tisch</li>
            <li>Durchgerechnete Beispiele mit kompletter Lösung</li>
            <li>Übungsaufgaben zum Selbstrechnen mit Lösung</li>
            <li>Schöne HTML-Seite — auf Handy, Tablet, PC druckbar</li>
            <li>Einmal bezahlt, kannst du sie immer wieder öffnen</li>
          </ul>

          {fehler && (
            <div style={{ background: "#fdecea", border: "1px solid #f0bdb6", borderRadius: "12px", padding: "12px", marginBottom: "14px", color: "#b3392c", textAlign: "center", fontSize: "14px" }}>
              {fehler}
            </div>
          )}

          {pruefend ? (
            <button disabled style={{ width: "100%", background: "#e5e5ea", color: "#fff", border: "none", padding: "16px", borderRadius: "14px", fontSize: "17px", fontWeight: 700 }}>
              Bezahlung wird geprüft …
            </button>
          ) : (
            <button onClick={zahlungStarten} disabled={zahlungLaeuft} style={{ width: "100%", background: material.farbe, color: "#fff", border: "none", padding: "16px", borderRadius: "14px", fontSize: "17px", fontWeight: 800, cursor: zahlungLaeuft ? "default" : "pointer" }}>
              {zahlungLaeuft ? "Einen Moment …" : `Für ${preisText} jetzt freischalten →`}
            </button>
          )}
          <p style={{ textAlign: "center", color: "#86868b", fontSize: "12.5px", marginTop: "12px", lineHeight: 1.5 }}>
            Einmalige Zahlung. Sichere Bezahlung über Stripe.
          </p>
        </div>
      </div>
    </main>
  );
}
