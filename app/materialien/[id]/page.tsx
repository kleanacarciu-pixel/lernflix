"use client";
import { useEffect, useState, type ReactNode } from "react";
import { useParams } from "next/navigation";
import { InhaltGeometrie } from "../inhalt-geometrie";
import { InhaltPotenzen } from "../inhalt-potenzen";
import { InhaltMechanik } from "../inhalt-mechanik";
import { InhaltBrueche } from "../inhalt-brueche";
import { InhaltProzent } from "../inhalt-prozent";
import { InhaltGleichungen } from "../inhalt-gleichungen";
import { InhaltFunktionen } from "../inhalt-funktionen";
import { InhaltStochastik } from "../inhalt-stochastik";
import { InhaltTrigonometrie } from "../inhalt-trigonometrie";
import { InhaltElektrizitaet } from "../inhalt-elektrizitaet";
import { InhaltOptik } from "../inhalt-optik";
import { InhaltWaerme } from "../inhalt-waerme";
import { InhaltAtomphysik } from "../inhalt-atomphysik";

type Material = { id: string; titel: string; untertitel: string; preis: number; farbe: string; render: () => ReactNode };

const MATERIALIEN: Record<string, Material> = {
  geometrie: { id: "geometrie", titel: "Geometrie — Komplette Formelsammlung", untertitel: "Klasse 6 bis 9 · mit Figuren, Formeln und Beispielen", preis: 199, farbe: "#0071e3", render: () => <InhaltGeometrie /> },
  potenzen: { id: "potenzen", titel: "Potenzen — Komplettes Lernpaket", untertitel: "Klasse 7 bis 9 · alle Regeln, Tricks und Übungen", preis: 99, farbe: "#5856d6", render: () => <InhaltPotenzen /> },
  mechanik: { id: "mechanik", titel: "Mechanik — Komplettes Lernpaket", untertitel: "Klasse 8 bis 10 · Kraft, Energie, Bewegung mit Skizzen", preis: 99, farbe: "#ef4444", render: () => <InhaltMechanik /> },
  brueche: { id: "brueche", titel: "Brüche & Bruchrechnung", untertitel: "Klasse 5 bis 7 · einfach erklärt mit Beispielen", preis: 199, farbe: "#0071e3", render: () => <InhaltBrueche /> },
  prozent: { id: "prozent", titel: "Prozent- & Zinsrechnung", untertitel: "Klasse 7 bis 9 · vom Rabatt bis zum Zinseszins", preis: 99, farbe: "#34c759", render: () => <InhaltProzent /> },
  gleichungen: { id: "gleichungen", titel: "Gleichungen & Terme", untertitel: "Klasse 7 bis 10 · von linear bis pq-Formel", preis: 199, farbe: "#ff9500", render: () => <InhaltGleichungen /> },
  funktionen: { id: "funktionen", titel: "Funktionen — linear & quadratisch", untertitel: "Klasse 8 bis 10 · Geraden, Parabeln und mehr", preis: 199, farbe: "#5856d6", render: () => <InhaltFunktionen /> },
  stochastik: { id: "stochastik", titel: "Wahrscheinlichkeit & Statistik", untertitel: "Klasse 8 bis 10 · Würfel, Zufall und Mittelwert", preis: 99, farbe: "#ec4899", render: () => <InhaltStochastik /> },
  trigonometrie: { id: "trigonometrie", titel: "Trigonometrie — sin, cos, tan", untertitel: "Klasse 9 bis 10 · vom Dreieck bis zur Welle", preis: 99, farbe: "#06b6d4", render: () => <InhaltTrigonometrie /> },
  elektrizitaet: { id: "elektrizitaet", titel: "Elektrizität & Stromkreise", untertitel: "Klasse 8 bis 10 · Ohm, Schaltungen und Strompreise", preis: 199, farbe: "#f59e0b", render: () => <InhaltElektrizitaet /> },
  optik: { id: "optik", titel: "Optik & Wellen", untertitel: "Klasse 8 bis 10 · Linsen, Spiegel und Regenbögen", preis: 99, farbe: "#8b5cf6", render: () => <InhaltOptik /> },
  waerme: { id: "waerme", titel: "Wärmelehre", untertitel: "Klasse 8 bis 10 · Temperatur, Wärme und Gasgesetze", preis: 99, farbe: "#dc2626", render: () => <InhaltWaerme /> },
  atomphysik: { id: "atomphysik", titel: "Atomphysik & Strahlung", untertitel: "Klasse 9 bis 10 · Atome, Zerfall und Quantenwelt", preis: 99, farbe: "#10b981", render: () => <InhaltAtomphysik /> },
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

    const host = window.location.hostname;
    const istVorschau = host.endsWith(".vercel.app") || host === "localhost";
    const wuenscht = new URLSearchParams(window.location.search).get("test") === "ja";
    if (istVorschau && wuenscht) { setEntsperrt(true); return; }

    try {
      const local = localStorage.getItem(`material_${id}_entsperrt`);
      if (local === "ja") { setEntsperrt(true); return; }
    } catch {}

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

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(135deg, #FFF9F0 0%, #FEF3E0 100%)", fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif", color: "#0F172A", position: "relative", overflow: "hidden" }}>
      {/* Dot-grid pattern + glow blobs */}
      <div style={{ position: "fixed", inset: 0, backgroundImage: "radial-gradient(circle, rgba(23,105,255,0.10) 1px, transparent 1px)", backgroundSize: "32px 32px", opacity: 0.35, pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", top: "-100px", left: "-100px", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(255,180,90,0.22) 0%, transparent 65%)", pointerEvents: "none", filter: "blur(40px)", zIndex: 0 }} />
      <div style={{ position: "fixed", top: "30%", right: "-150px", width: "550px", height: "550px", borderRadius: "50%", background: "radial-gradient(circle, rgba(23,105,255,0.16) 0%, transparent 70%)", pointerEvents: "none", filter: "blur(30px)", zIndex: 0 }} />
      <div style={{ maxWidth: "560px", margin: "0 auto", padding: "60px 20px", position: "relative", zIndex: 1 }}>
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
            <li>Schritt-für-Schritt-Erklärungen in einfacher Sprache</li>
            <li>Durchgerechnete Beispiele mit kompletter Lösung</li>
            <li>Übungsaufgaben zum Selbstrechnen mit Lösung</li>
            <li>Witze und Eselsbrücken, damit du dir alles merkst</li>
            <li>Einmal bezahlt, kannst du es immer wieder öffnen</li>
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
