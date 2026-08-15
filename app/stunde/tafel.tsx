"use client";
// =============================================================================
// Live-Tafel für die Stunde: Kleana schreibt (Apple Pencil, Finger oder Maus),
// alle Teilnehmer sehen jeden Strich sofort – synchronisiert über den
// Daten-Kanal des Video-Calls (sendAppMessage), ganz ohne Server-Speicher.
//
// Für Mathe & Physik:
//  - Stift kurz festhalten -> der Strich wird zur perfekten Form: gerade
//    Linie (rastet auf 15°-Winkel ein), Kreis, Dreieck oder Rechteck
//  - Textmarker: breite, durchscheinende Farben zum Markieren
//
// Die Tafel bleibt immer eingehängt (auch unsichtbar), damit Schüler keine
// Striche verpassen. Jeder Schüler hat ein dauerhaftes Tafel-Heft auf dem
// Server (wie ein GoodNotes-Notizblock): beim Start der Stunde wird es
// geladen, jede Änderung automatisch gespeichert – nächste Stunde geht es
// genau dort weiter.
// =============================================================================
import { useCallback, useEffect, useRef, useState } from "react";
import type { DailyCall } from "@daily-co/daily-js";

// Logische Zeichenfläche (4:3) – alle Punkte werden in diesem Raster
// gespeichert und auf jedem Gerät passend skaliert
const W = 1600;
const H = 1200;

type Strich = { id: string; farbe: string; dicke: number; punkte: number[]; m?: number };

const FARBEN = ["#1A1A1A", "#2456A6", "#C0392B", "#1E8449"];
const MARKER_FARBEN = ["#F7D64A", "#7BD37B", "#F79AC0", "#7BC8F0"];
const DICKEN = [3, 6, 12];
const MARKER_DICKE = 30;

// Nachrichten-Umschlag; klein halten (Daily-Limit ~4 KB pro Nachricht)
type Nachricht =
  | { lma: "tafel"; typ: "seg"; seite: number; id: string; farbe: string; dicke: number; m?: number; pts: number[] }
  | { lma: "tafel"; typ: "form"; seite: number; id: string; farbe: string; dicke: number; m?: number; pts: number[] }
  | { lma: "tafel"; typ: "undo"; seite: number; id: string }
  | { lma: "tafel"; typ: "leer"; seite: number }
  | { lma: "tafel"; typ: "seite"; seite: number; anzahl: number }
  | { lma: "tafel"; typ: "offen" }
  | { lma: "tafel"; typ: "zu" }
  | { lma: "tafel"; typ: "voll?" }
  | { lma: "tafel"; typ: "vstart" };

// ---- Form-Erkennung ("festhalten -> perfekte Form") -------------------------
const dist = (x1: number, y1: number, x2: number, y2: number) => Math.hypot(x2 - x1, y2 - y1);
function distPunktSegment(px: number, py: number, ax: number, ay: number, bx: number, by: number) {
  const l2 = (bx - ax) ** 2 + (by - ay) ** 2;
  if (!l2) return dist(px, py, ax, ay);
  const t = Math.max(0, Math.min(1, ((px - ax) * (bx - ax) + (py - ay) * (by - ay)) / l2));
  return dist(px, py, ax + t * (bx - ax), ay + t * (by - ay));
}
// Linienzug vereinfachen (Douglas-Peucker) -> Eckpunkte finden
function vereinfache(p: number[], eps: number): number[] {
  const n = p.length / 2;
  if (n < 3) return p.slice();
  let maxD = 0, idx = 0;
  for (let i = 1; i < n - 1; i++) {
    const d = distPunktSegment(p[2 * i], p[2 * i + 1], p[0], p[1], p[2 * n - 2], p[2 * n - 1]);
    if (d > maxD) { maxD = d; idx = i; }
  }
  if (maxD <= eps) return [p[0], p[1], p[2 * n - 2], p[2 * n - 1]];
  const links = vereinfache(p.slice(0, 2 * idx + 2), eps);
  const rechts = vereinfache(p.slice(2 * idx), eps);
  return links.slice(0, -2).concat(rechts);
}
// Liefert Ersatz-Punkte für die perfekte Form – oder null, wenn nichts passt
function erkenneForm(p: number[]): number[] | null {
  const n = p.length / 2;
  if (n < 6) return null;
  const sx = p[0], sy = p[1], ex = p[2 * n - 2], ey = p[2 * n - 1];
  let umfang = 0;
  for (let i = 1; i < n; i++) umfang += dist(p[2 * i - 2], p[2 * i - 1], p[2 * i], p[2 * i + 1]);
  if (umfang < 60) return null;

  // 1) Gerade Linie? (alle Punkte nah an der Start-Ende-Strecke)
  const direktLen = dist(sx, sy, ex, ey);
  if (direktLen > 50 && direktLen > umfang * 0.75) {
    let maxAbw = 0;
    for (let i = 0; i < n; i++) maxAbw = Math.max(maxAbw, distPunktSegment(p[2 * i], p[2 * i + 1], sx, sy, ex, ey));
    if (maxAbw < Math.max(16, direktLen * 0.06)) {
      // Auf schöne Winkel einrasten (alle 15°), wenn nur knapp daneben
      let winkel = Math.atan2(ey - sy, ex - sx);
      const schritt = Math.PI / 12;
      const gerastet = Math.round(winkel / schritt) * schritt;
      if (Math.abs(winkel - gerastet) < (5 * Math.PI) / 180) winkel = gerastet;
      return [sx, sy, Math.round(sx + direktLen * Math.cos(winkel)), Math.round(sy + direktLen * Math.sin(winkel))];
    }
  }

  // Geschlossene Form? (Ende wieder nahe am Anfang)
  if (dist(sx, sy, ex, ey) > Math.max(60, umfang * 0.2)) return null;

  // 2) Kreis? (alle Punkte etwa gleich weit vom Mittelpunkt)
  let cx = 0, cy = 0;
  for (let i = 0; i < n; i++) { cx += p[2 * i]; cy += p[2 * i + 1]; }
  cx /= n; cy /= n;
  let r = 0;
  for (let i = 0; i < n; i++) r += dist(p[2 * i], p[2 * i + 1], cx, cy);
  r /= n;
  let abw = 0;
  for (let i = 0; i < n; i++) abw += Math.abs(dist(p[2 * i], p[2 * i + 1], cx, cy) - r);
  abw /= n;
  if (r > 25 && abw < r * 0.18) {
    const kreis: number[] = [];
    for (let i = 0; i <= 72; i++) {
      const w = (i / 72) * Math.PI * 2;
      kreis.push(Math.round(cx + r * Math.cos(w)), Math.round(cy + r * Math.sin(w)));
    }
    return kreis;
  }

  // 3) Dreieck / Viereck? (Eckpunkte zählen)
  const ecken = vereinfache(p, Math.max(18, umfang * 0.03));
  const ek = ecken.length / 2 - 1; // letzter Punkt = Rückkehr zum Start
  if (ek === 3 || ek === 4) {
    const poly = ecken.slice(0, 2 * ek);
    if (ek === 4) {
      // Fast waagerecht/senkrecht? Dann sauberes Rechteck aus der Hüllbox
      let minX = 1e9, minY = 1e9, maxX = -1e9, maxY = -1e9, schraeg = false;
      for (let i = 0; i < 4; i++) {
        minX = Math.min(minX, poly[2 * i]); maxX = Math.max(maxX, poly[2 * i]);
        minY = Math.min(minY, poly[2 * i + 1]); maxY = Math.max(maxY, poly[2 * i + 1]);
      }
      for (let i = 0; i < 4; i++) {
        const x1 = poly[2 * i], y1 = poly[2 * i + 1], x2 = poly[(2 * i + 2) % 8], y2 = poly[(2 * i + 3) % 8];
        const w = Math.abs(Math.atan2(y2 - y1, x2 - x1)) % (Math.PI / 2);
        if (Math.min(w, Math.PI / 2 - w) > (14 * Math.PI) / 180) schraeg = true;
      }
      if (!schraeg) return [minX, minY, maxX, minY, maxX, maxY, minX, maxY, minX, minY];
    }
    return poly.concat(poly[0], poly[1]); // Form schließen
  }
  return null;
}

export default function Tafel({ frameRef, istLehrerin, api, offen, setOffen }: {
  frameRef: React.MutableRefObject<DailyCall | null>;
  istLehrerin: boolean;
  api: (a: string, p?: Record<string, unknown>) => Promise<Record<string, unknown>>;
  offen: boolean;
  setOffen: (o: boolean) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Seiten/Striche in Refs: Zeichnen läuft an React vorbei (Performance)
  const seitenRef = useRef<Strich[][]>([[]]);
  const [seite, setSeite] = useState(0);
  const [anzahl, setAnzahl] = useState(1);
  const [farbe, setFarbe] = useState(FARBEN[0]);
  const [dicke, setDicke] = useState(DICKEN[1]);
  const [werkzeug, setWerkzeug] = useState<"stift" | "marker" | "radierer">("stift");
  const seiteRef = useRef(0);
  const offenRef = useRef(offen);
  useEffect(() => { seiteRef.current = seite; }, [seite]);
  useEffect(() => { offenRef.current = offen; }, [offen]);

  // ---- Zeichnen aufs Canvas -------------------------------------------------
  const zeichneStrich = useCallback((ctx: CanvasRenderingContext2D, s: Strich, ab = 0) => {
    const p = s.punkte;
    ctx.save();
    if (s.m) { ctx.globalAlpha = 0.4; ctx.globalCompositeOperation = "multiply"; }
    if (p.length < 4) {
      if (p.length >= 2) { ctx.fillStyle = s.farbe; ctx.beginPath(); ctx.arc(p[0], p[1], s.dicke / 2, 0, Math.PI * 2); ctx.fill(); }
      ctx.restore();
      return;
    }
    ctx.strokeStyle = s.farbe; ctx.lineWidth = s.dicke; ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.beginPath();
    const start = Math.max(0, ab - 2);
    ctx.moveTo(p[start * 2], p[start * 2 + 1]);
    for (let i = start + 1; i * 2 + 1 < p.length; i++) ctx.lineTo(p[i * 2], p[i * 2 + 1]);
    ctx.stroke();
    ctx.restore();
  }, []);

  const allesZeichnen = useCallback(() => {
    const c = canvasRef.current; const ctx = c?.getContext("2d");
    if (!c || !ctx) return;
    ctx.fillStyle = "#FFFFFF"; ctx.fillRect(0, 0, W, H);
    // dezente Karo-Linien wie auf Schulpapier
    ctx.strokeStyle = "rgba(43,179,192,.10)"; ctx.lineWidth = 1;
    for (let x = 80; x < W; x += 80) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 80; y < H; y += 80) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
    for (const s of seitenRef.current[seiteRef.current] || []) zeichneStrich(ctx, s);
  }, [zeichneStrich]);

  useEffect(() => { if (offen) allesZeichnen(); }, [offen, seite, allesZeichnen]);

  // ---- Senden ---------------------------------------------------------------
  const senden = useCallback((n: Nachricht, an?: string) => {
    const f = frameRef.current;
    if (!f) return;
    try { f.sendAppMessage(n, an ?? "*"); } catch { }
    // frameRef ist ein stabiles Ref-Objekt
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Öffnet/schließt Kleana die Tafel, folgen die Schüler automatisch
  const ersterLauf = useRef(true);
  useEffect(() => {
    if (!istLehrerin) return;
    if (ersterLauf.current) { ersterLauf.current = false; if (!offen) return; }
    senden({ lma: "tafel", typ: offen ? "offen" : "zu" });
  }, [offen, istLehrerin, senden]);

  // Tafel-Heft auf dem Server: automatisch speichern (nur Kleana, gebündelt)
  const speicherTimer = useRef<number | null>(null);
  const speichern = useCallback(() => {
    if (!istLehrerin) return;
    if (speicherTimer.current) window.clearTimeout(speicherTimer.current);
    speicherTimer.current = window.setTimeout(() => {
      void api("tafelSpeichern", { daten: JSON.stringify(seitenRef.current) });
    }, 2000);
  }, [istLehrerin, api]);

  // Beim Start das Heft laden – Schüler sehen so auch ohne Kleana, was
  // letzte Stunde an der Tafel stand
  const liveEmpfangen = useRef(false); // Live-Stand schlägt gespeicherten Stand
  useEffect(() => {
    (async () => {
      const d = await api("tafelLaden");
      if (liveEmpfangen.current) return;
      if (d.ok && typeof d.daten === "string" && d.daten) {
        try {
          const alt = JSON.parse(d.daten) as Strich[][];
          if (Array.isArray(alt) && alt.length) {
            seitenRef.current = alt;
            setAnzahl(alt.length);
            if (offenRef.current) allesZeichnen();
          }
        } catch { }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Ganze Tafel an einen (neuen) Teilnehmer schicken – Strich für Strich in
  // kleinen Häppchen, damit keine Nachricht das Größen-Limit reißt
  const vollSenden = useCallback((an: string) => {
    senden({ lma: "tafel", typ: "vstart" }, an); // Empfänger: erst leeren (kein Doppeltes)
    seitenRef.current.forEach((striche, si) => {
      for (const s of striche) {
        for (let i = 0; i < s.punkte.length; i += 240) {
          senden({ lma: "tafel", typ: "seg", seite: si, id: s.id, farbe: s.farbe, dicke: s.dicke, ...(s.m ? { m: 1 } : {}), pts: s.punkte.slice(i, i + 240) }, an);
        }
      }
    });
    senden({ lma: "tafel", typ: "seite", seite: seiteRef.current, anzahl: seitenRef.current.length }, an);
    if (offenRef.current) senden({ lma: "tafel", typ: "offen" }, an);
  }, [senden]);

  // ---- Empfangen ------------------------------------------------------------
  useEffect(() => {
    let stop = false;
    let abmelden: (() => void) | null = null;
    const anmelden = () => {
      if (stop) return;
      const f = frameRef.current;
      if (!f) { window.setTimeout(anmelden, 500); return; } // Frame kommt gleich
      const handler = (ev?: { data?: unknown; fromId?: string }) => {
        const n = ev?.data as Nachricht | undefined;
        if (!n || n.lma !== "tafel") return;
        if (n.typ === "voll?") { if (istLehrerin) vollSenden(ev?.fromId || "*"); return; }
        if (istLehrerin) return; // Striche kommen nur von der Lehrerin
        liveEmpfangen.current = true; // ab jetzt zählt der Live-Stand
        if (n.typ === "vstart") { seitenRef.current = [[]]; setAnzahl(1); setSeite(0); allesZeichnen(); return; }
        const seiten = seitenRef.current;
        if (n.typ === "seg" || n.typ === "form") {
          while (seiten.length <= n.seite) seiten.push([]);
          let s = seiten[n.seite].find((x) => x.id === n.id);
          const neu = !s;
          if (!s) { s = { id: n.id, farbe: n.farbe, dicke: n.dicke, ...(n.m ? { m: 1 } : {}), punkte: [] }; seiten[n.seite].push(s); }
          if (n.typ === "form") { s.punkte = n.pts.slice(); }
          const ab = s.punkte.length / 2;
          if (n.typ === "seg") s.punkte.push(...n.pts);
          setAnzahl(seiten.length);
          if (n.seite === seiteRef.current) {
            if (n.typ === "form") { allesZeichnen(); }
            else {
              const ctx = canvasRef.current?.getContext("2d");
              if (ctx) { if (neu) zeichneStrich(ctx, s); else zeichneStrich(ctx, s, ab); }
            }
          }
        } else if (n.typ === "undo") {
          if (seiten[n.seite]) seiten[n.seite] = seiten[n.seite].filter((x) => x.id !== n.id);
          if (n.seite === seiteRef.current) allesZeichnen();
        } else if (n.typ === "leer") {
          if (seiten[n.seite]) seiten[n.seite] = [];
          if (n.seite === seiteRef.current) allesZeichnen();
        } else if (n.typ === "seite") {
          while (seitenRef.current.length < n.anzahl) seitenRef.current.push([]);
          setAnzahl(n.anzahl); setSeite(n.seite);
        } else if (n.typ === "offen") { setOffen(true); }
        else if (n.typ === "zu") { setOffen(false); }
      };
      f.on("app-message", handler);
      abmelden = () => { try { f.off("app-message", handler); } catch { } };
      // Neu dabei? Aktuellen Tafel-Stand bei der Lehrerin anfragen
      if (!istLehrerin) senden({ lma: "tafel", typ: "voll?" });
    };
    anmelden();
    return () => { stop = true; if (abmelden) abmelden(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [istLehrerin]);

  // ---- Stift, Marker & Radierer (nur Lehrerin) ------------------------------
  const aktiv = useRef<Strich | null>(null);
  const puffer = useRef<number[]>([]);
  const flushTimer = useRef<number | null>(null);
  const halteTimer = useRef<number | null>(null);
  const letzteBewegung = useRef(0);
  const eingerastet = useRef(false); // Form erkannt -> Strich ist "fertig"

  const formOffen = useRef(false); // eingerastete Linie wurde weitergezogen

  const flush = useCallback(() => {
    const s = aktiv.current;
    if (!s) return;
    if (eingerastet.current) {
      if (!formOffen.current) return;
      formOffen.current = false;
      senden({ lma: "tafel", typ: "form", seite: seiteRef.current, id: s.id, farbe: s.farbe, dicke: s.dicke, pts: s.punkte });
      return;
    }
    if (!puffer.current.length) return;
    senden({ lma: "tafel", typ: "seg", seite: seiteRef.current, id: s.id, farbe: s.farbe, dicke: s.dicke, ...(s.m ? { m: 1 } : {}), pts: puffer.current });
    puffer.current = [];
  }, [senden]);

  // Festhalten am Strich-Ende: Form erkennen und durch die perfekte ersetzen
  const halteCheck = useCallback(() => {
    const s = aktiv.current;
    if (!s || eingerastet.current || s.m) return; // Marker rastet nicht ein
    if (Date.now() - letzteBewegung.current < 480) return;
    const neu = erkenneForm(s.punkte);
    if (!neu) return;
    eingerastet.current = true;
    puffer.current = [];
    s.punkte = neu;
    senden({ lma: "tafel", typ: "form", seite: seiteRef.current, id: s.id, farbe: s.farbe, dicke: s.dicke, pts: neu });
    allesZeichnen();
  }, [senden, allesZeichnen]);

  const punktAus = (e: React.PointerEvent<HTMLCanvasElement>): [number, number] | null => {
    const c = canvasRef.current;
    if (!c) return null;
    const r = c.getBoundingClientRect();
    return [Math.round((e.clientX - r.left) / r.width * W), Math.round((e.clientY - r.top) / r.height * H)];
  };

  const radiereBei = useCallback((x: number, y: number) => {
    const striche = seitenRef.current[seiteRef.current] || [];
    for (const s of striche) {
      for (let i = 0; i * 2 + 1 < s.punkte.length; i++) {
        const dx = s.punkte[i * 2] - x, dy = s.punkte[i * 2 + 1] - y;
        if (dx * dx + dy * dy < 24 * 24) {
          seitenRef.current[seiteRef.current] = striche.filter((q) => q.id !== s.id);
          senden({ lma: "tafel", typ: "undo", seite: seiteRef.current, id: s.id });
          allesZeichnen(); speichern();
          return;
        }
      }
    }
  }, [senden, allesZeichnen, speichern]);

  const runter = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!istLehrerin) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const p = punktAus(e);
    if (!p) return;
    if (werkzeug === "radierer") { radiereBei(p[0], p[1]); return; }
    const marker = werkzeug === "marker";
    const s: Strich = {
      id: Math.random().toString(36).slice(2, 10),
      farbe, dicke: marker ? MARKER_DICKE : dicke,
      ...(marker ? { m: 1 } : {}), punkte: [p[0], p[1]],
    };
    aktiv.current = s;
    eingerastet.current = false;
    letzteBewegung.current = Date.now();
    (seitenRef.current[seiteRef.current] ||= []).push(s);
    puffer.current = [p[0], p[1]];
    flushTimer.current = window.setInterval(flush, 90);
    halteTimer.current = window.setInterval(halteCheck, 160);
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) zeichneStrich(ctx, s);
  };
  const bewegt = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!istLehrerin) return;
    const p = punktAus(e);
    if (!p) return;
    if (werkzeug === "radierer") { if (e.buttons) radiereBei(p[0], p[1]); return; }
    const s = aktiv.current;
    if (!s) return;
    const n = s.punkte.length;
    const dx = p[0] - s.punkte[n - 2], dy = p[1] - s.punkte[n - 1];
    if (dx * dx + dy * dy < 4) return; // Mini-Bewegungen (und Halten) überspringen
    letzteBewegung.current = Date.now();
    if (eingerastet.current) {
      // Nach dem Einrasten: gerade Linien lassen sich noch am Endpunkt ziehen
      // (gesendet wird gedrosselt über den flush-Takt)
      if (s.punkte.length === 4) {
        s.punkte[2] = p[0]; s.punkte[3] = p[1];
        formOffen.current = true;
        allesZeichnen();
      }
      return;
    }
    s.punkte.push(p[0], p[1]);
    puffer.current.push(p[0], p[1]);
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) zeichneStrich(ctx, s, n / 2);
  };
  const hoch = () => {
    if (!istLehrerin) return;
    if (flushTimer.current) { window.clearInterval(flushTimer.current); flushTimer.current = null; }
    if (halteTimer.current) { window.clearInterval(halteTimer.current); halteTimer.current = null; }
    flush(); // letzten Rest senden (Strich-Punkte oder gezogene Linie)
    aktiv.current = null;
    eingerastet.current = false;
    formOffen.current = false;
    speichern();
  };

  // ---- Werkzeuge ------------------------------------------------------------
  const rueckgaengig = () => {
    const striche = seitenRef.current[seiteRef.current] || [];
    const letzter = striche[striche.length - 1];
    if (!letzter) return;
    seitenRef.current[seiteRef.current] = striche.slice(0, -1);
    senden({ lma: "tafel", typ: "undo", seite: seiteRef.current, id: letzter.id });
    allesZeichnen(); speichern();
  };
  const seiteLeeren = () => {
    if (!window.confirm("Diese Tafel-Seite wirklich komplett leeren?")) return;
    seitenRef.current[seiteRef.current] = [];
    senden({ lma: "tafel", typ: "leer", seite: seiteRef.current });
    allesZeichnen(); speichern();
  };
  const seiteWechseln = (zu: number) => {
    const neuAnzahl = Math.max(anzahl, zu + 1);
    while (seitenRef.current.length < neuAnzahl) seitenRef.current.push([]);
    setAnzahl(neuAnzahl); setSeite(zu);
    if (istLehrerin) { senden({ lma: "tafel", typ: "seite", seite: zu, anzahl: neuAnzahl }); speichern(); }
  };

  const palette = werkzeug === "marker" ? MARKER_FARBEN : FARBEN;

  return (
    <div className="tafelwrap" style={{ display: offen ? "flex" : "none" }}>
      <div className="tafelbar">
        {istLehrerin ? (<>
          <button className={"twz" + (werkzeug === "stift" ? " on" : "")}
            onClick={() => { setWerkzeug("stift"); if (!FARBEN.includes(farbe)) setFarbe(FARBEN[0]); }}>✏️ Stift</button>
          <button className={"twz" + (werkzeug === "marker" ? " on" : "")}
            onClick={() => { setWerkzeug("marker"); if (!MARKER_FARBEN.includes(farbe)) setFarbe(MARKER_FARBEN[0]); }}>🖍️ Marker</button>
          <button className={"twz" + (werkzeug === "radierer" ? " on" : "")} onClick={() => setWerkzeug("radierer")}>🧽 Radierer</button>
          {palette.map((f) => (
            <button key={f} className={"tfarbe" + (werkzeug !== "radierer" && f === farbe ? " on" : "")}
              style={{ background: f }} aria-label="Farbe" onClick={() => setFarbe(f)} />
          ))}
          {werkzeug === "stift" && DICKEN.map((d) => (
            <button key={d} className={"tdicke" + (d === dicke ? " on" : "")} aria-label="Stiftdicke" onClick={() => setDicke(d)}>
              <span style={{ width: d + 3, height: d + 3 }} />
            </button>
          ))}
          <button className="twz" onClick={rueckgaengig}>↩️</button>
          <button className="twz" onClick={seiteLeeren}>🗑️</button>
        </>) : <span className="tinfo">🖊️ Kleanas Tafel – live</span>}
        <span className="tseiten">
          <button className="twz" disabled={seite === 0} onClick={() => seiteWechseln(seite - 1)}>‹</button>
          <b>{seite + 1}/{anzahl}</b>
          {istLehrerin
            ? <button className="twz" onClick={() => seiteWechseln(seite + 1)}>{seite + 1 >= anzahl ? "+ Seite" : "›"}</button>
            : <button className="twz" disabled={seite + 1 >= anzahl} onClick={() => seiteWechseln(seite + 1)}>›</button>}
        </span>
        <button className="twz tzu" onClick={() => setOffen(false)}>✕</button>
      </div>
      {istLehrerin && <div className="thinweis">Tipp: Strich am Ende kurz <b>festhalten</b> → wird zur geraden Linie, zum Kreis, Dreieck oder Rechteck.</div>}
      <div className="tafelflaeche">
        <canvas ref={canvasRef} width={W} height={H}
          style={{ touchAction: "none", cursor: istLehrerin ? "crosshair" : "default" }}
          onPointerDown={runter} onPointerMove={bewegt} onPointerUp={hoch} onPointerCancel={hoch} />
      </div>
    </div>
  );
}
