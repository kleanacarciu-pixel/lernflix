"use client";
// =============================================================================
// Live-Tafel für die Stunde – Version 2 (nach Kleanas Praxis-Test):
//  - Handballen-Schutz: Apple Pencil/Maus schreibt, Finger verschiebt/zoomt
//    (optional per ☝️-Knopf auch Fingerzeichnen)
//  - Zoom & Verschieben: 2-Finger-Kneifen, Mausrad, −/+/Vollbild-Knöpfe
//  - Papier: kariert, gepunktet, liniert, blanko
//  - Werkzeuge: Stift (9 Farben, 3 Dicken), Marker (6 Farben), Linie/Kreis/
//    Rechteck/Dreieck zum Aufziehen, Laserpointer, Auswahl-und-Verschieben,
//    flüssiger Radierer, Rückgängig, Seiten
//  - Alles live bei den Schülern (Daily-Datenkanal) + Tafel-Heft pro Schüler
//    auf dem Server (nächste Stunde geht es genau dort weiter)
// =============================================================================
import { useCallback, useEffect, useRef, useState } from "react";
import type { DailyCall } from "@daily-co/daily-js";

// Logische Zeichenfläche (4:3) – Punkte immer in diesem Raster, jedes Gerät
// skaliert selbst passend
const W = 1600;
const H = 1200;

type Strich = { id: string; farbe: string; dicke: number; punkte: number[]; m?: number };
type Papier = "kariert" | "punkte" | "liniert" | "blanko";
type Werkzeug = "stift" | "marker" | "radierer" | "laser" | "auswahl" | "linie" | "kreis" | "rechteck" | "dreieck";

const FARBEN = ["#1A1A1A", "#7A7A7A", "#2456A6", "#3BA7C4", "#1E8449", "#C0392B", "#E67E22", "#8E44AD", "#D81B60"];
const MARKER_FARBEN = ["#F7D64A", "#FFB74D", "#7BD37B", "#F79AC0", "#7BC8F0", "#CE93D8"];
const DICKEN = [3, 6, 12];
const MARKER_DICKE = 30;

type Nachricht =
  | { lma: "tafel"; typ: "seg"; seite: number; id: string; farbe: string; dicke: number; m?: number; pts: number[] }
  | { lma: "tafel"; typ: "form"; seite: number; id: string; farbe: string; dicke: number; m?: number; pts: number[] }
  | { lma: "tafel"; typ: "move"; seite: number; ids: string[]; dx: number; dy: number }
  | { lma: "tafel"; typ: "undo"; seite: number; id: string }
  | { lma: "tafel"; typ: "leer"; seite: number }
  | { lma: "tafel"; typ: "seite"; seite: number; anzahl: number }
  | { lma: "tafel"; typ: "papier"; papier: Papier }
  | { lma: "tafel"; typ: "laser"; x: number; y: number }
  | { lma: "tafel"; typ: "offen" }
  | { lma: "tafel"; typ: "zu" }
  | { lma: "tafel"; typ: "voll?" }
  | { lma: "tafel"; typ: "vstart" };

const dist = (x1: number, y1: number, x2: number, y2: number) => Math.hypot(x2 - x1, y2 - y1);
// Linien-Winkel auf 15°-Schritte einrasten (Lineal-Gefühl)
function rasteLinie(x1: number, y1: number, x2: number, y2: number): number[] {
  const len = dist(x1, y1, x2, y2);
  let w = Math.atan2(y2 - y1, x2 - x1);
  const schritt = Math.PI / 12;
  const gerastet = Math.round(w / schritt) * schritt;
  if (Math.abs(w - gerastet) < (4 * Math.PI) / 180) w = gerastet;
  return [x1, y1, Math.round(x1 + len * Math.cos(w)), Math.round(y1 + len * Math.sin(w))];
}
function kreisPunkte(cx: number, cy: number, r: number): number[] {
  const p: number[] = [];
  for (let i = 0; i <= 72; i++) {
    const w = (i / 72) * Math.PI * 2;
    p.push(Math.round(cx + r * Math.cos(w)), Math.round(cy + r * Math.sin(w)));
  }
  return p;
}
function formPunkte(art: Werkzeug, x1: number, y1: number, x2: number, y2: number): number[] {
  if (art === "linie") return rasteLinie(x1, y1, x2, y2);
  if (art === "kreis") return kreisPunkte(x1, y1, dist(x1, y1, x2, y2));
  const minX = Math.min(x1, x2), maxX = Math.max(x1, x2), minY = Math.min(y1, y2), maxY = Math.max(y1, y2);
  if (art === "rechteck") return [minX, minY, maxX, minY, maxX, maxY, minX, maxY, minX, minY];
  // Dreieck: Spitze oben-mitte, Basis unten
  const mx = Math.round((minX + maxX) / 2);
  return [mx, minY, maxX, maxY, minX, maxY, mx, minY];
}

export default function Tafel({ frameRef, istLehrerin, api, offen, setOffen }: {
  frameRef: React.MutableRefObject<DailyCall | null>;
  istLehrerin: boolean;
  api: (a: string, p?: Record<string, unknown>) => Promise<Record<string, unknown>>;
  offen: boolean;
  setOffen: (o: boolean) => void;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const flaecheRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const seitenRef = useRef<Strich[][]>([[]]);
  const [seite, setSeite] = useState(0);
  const [anzahl, setAnzahl] = useState(1);
  const [farbe, setFarbe] = useState(FARBEN[0]);
  const [dicke, setDicke] = useState(DICKEN[1]);
  const [werkzeug, setWerkzeug] = useState<Werkzeug>("stift");
  const [papier, setPapier] = useState<Papier>("kariert");
  const [fingerZeichnen, setFingerZeichnen] = useState(false);
  const [vollbild, setVollbild] = useState(false);
  const [zoomAnzeige, setZoomAnzeige] = useState(100);
  const seiteRef = useRef(0);
  const offenRef = useRef(offen);
  const papierRef = useRef<Papier>("kariert");
  useEffect(() => { seiteRef.current = seite; }, [seite]);
  useEffect(() => { offenRef.current = offen; }, [offen]);
  useEffect(() => { papierRef.current = papier; }, [papier]);

  // ---- Ansicht (Zoom + Verschieben) -----------------------------------------
  // k = Skalierung logisch->Canvas-Pixel, P = Verschiebung in Canvas-Pixeln
  const ansicht = useRef({ k: 1, px: 0, py: 0, zoom: 1 });

  function klemmAnsicht() {
    const c = canvasRef.current;
    if (!c) return;
    const a = ansicht.current;
    const bw = W * a.k, bh = H * a.k;
    // Kleiner als der Platz? Dann mittig. Größer? Ränder nie weiter als 60px weg.
    if (bw <= c.width) a.px = (c.width - bw) / 2;
    else a.px = Math.min(60, Math.max(c.width - bw - 60, a.px));
    if (bh <= c.height) a.py = (c.height - bh) / 2;
    else a.py = Math.min(60, Math.max(c.height - bh - 60, a.py));
  }

  const passeAn = useCallback(() => {
    const el = flaecheRef.current, c = canvasRef.current;
    if (!el || !c) return;
    const dpr = window.devicePixelRatio || 1;
    const cw = Math.max(50, el.clientWidth) * dpr, ch = Math.max(50, el.clientHeight) * dpr;
    if (c.width !== Math.round(cw) || c.height !== Math.round(ch)) { c.width = Math.round(cw); c.height = Math.round(ch); }
    const a = ansicht.current;
    const basis = Math.min(cw / W, ch / H);
    a.k = basis * a.zoom;
    klemmAnsicht();
     
  }, []);

  const punktAus = (e: { clientX: number; clientY: number }): [number, number] | null => {
    const c = canvasRef.current;
    if (!c) return null;
    const r = c.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const a = ansicht.current;
    return [
      Math.round(((e.clientX - r.left) * dpr - a.px) / a.k),
      Math.round(((e.clientY - r.top) * dpr - a.py) / a.k),
    ];
  };

  // ---- Zeichnen -------------------------------------------------------------
  const mitSeite = (ctx: CanvasRenderingContext2D) => {
    const a = ansicht.current;
    ctx.setTransform(a.k, 0, 0, a.k, a.px, a.py);
    ctx.beginPath(); ctx.rect(0, 0, W, H); ctx.clip();
  };

  const zeichneStrich = useCallback((ctx: CanvasRenderingContext2D, s: Strich, ab = 0) => {
    const p = s.punkte;
    ctx.save();
    mitSeite(ctx);
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

  const vorschau = useRef<Strich | null>(null);      // Form-Werkzeuge beim Aufziehen
  const auswahl = useRef<{ ids: Set<string>; box: [number, number, number, number] } | null>(null);
  const gummiband = useRef<[number, number, number, number] | null>(null);
  const laserSpur = useRef<{ x: number; y: number; t: number }[]>([]);

  const allesZeichnen = useCallback(() => {
    const c = canvasRef.current; const ctx = c?.getContext("2d");
    if (!c || !ctx) return;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = "#E6EAEC"; ctx.fillRect(0, 0, c.width, c.height);
    ctx.save();
    mitSeite(ctx);
    // Papier
    ctx.fillStyle = "#FFFFFF"; ctx.fillRect(0, 0, W, H);
    const art = papierRef.current;
    ctx.strokeStyle = "rgba(43,179,192,.14)"; ctx.fillStyle = "rgba(43,179,192,.28)"; ctx.lineWidth = 1.2;
    if (art === "kariert") {
      for (let x = 80; x < W; x += 80) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
      for (let y = 80; y < H; y += 80) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
    } else if (art === "liniert") {
      for (let y = 80; y < H; y += 80) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
    } else if (art === "punkte") {
      for (let x = 80; x < W; x += 80) for (let y = 80; y < H; y += 80) { ctx.beginPath(); ctx.arc(x, y, 2.2, 0, Math.PI * 2); ctx.fill(); }
    }
    ctx.restore();
    for (const s of seitenRef.current[seiteRef.current] || []) zeichneStrich(ctx, s);
    if (vorschau.current) zeichneStrich(ctx, vorschau.current);
    // Auswahl-Rahmen / Gummiband
    const rahmen = (b: [number, number, number, number], fest: boolean) => {
      ctx.save(); mitSeite(ctx);
      ctx.strokeStyle = "#2BB3C0"; ctx.lineWidth = 2.5 / ansicht.current.zoom; ctx.setLineDash([10, 8]);
      if (fest) { ctx.fillStyle = "rgba(43,179,192,.06)"; ctx.fillRect(b[0], b[1], b[2] - b[0], b[3] - b[1]); }
      ctx.strokeRect(b[0], b[1], b[2] - b[0], b[3] - b[1]);
      ctx.restore();
    };
    if (gummiband.current) rahmen(gummiband.current, false);
    if (auswahl.current) rahmen(auswahl.current.box, true);
    // Laser-Spur (rot leuchtend, verblasst von selbst)
    const jetzt = Date.now();
    laserSpur.current = laserSpur.current.filter((l) => jetzt - l.t < 700);
    if (laserSpur.current.length) {
      ctx.save(); mitSeite(ctx);
      for (const l of laserSpur.current) {
        const alter = (jetzt - l.t) / 700;
        ctx.globalAlpha = 0.85 * (1 - alter);
        ctx.fillStyle = "#FF2D2D";
        ctx.shadowColor = "#FF2D2D"; ctx.shadowBlur = 18;
        ctx.beginPath(); ctx.arc(l.x, l.y, 7 + 6 * (1 - alter), 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();
    }
  }, [zeichneStrich]);

  const zoomen = useCallback((faktor: number, mx?: number, my?: number) => {
    const c = canvasRef.current;
    if (!c) return;
    const a = ansicht.current;
    const neu = Math.min(8, Math.max(1, a.zoom * faktor));
    const px = mx ?? c.width / 2, py = my ?? c.height / 2;
    const lx = (px - a.px) / a.k, ly = (py - a.py) / a.k;
    a.zoom = neu;
    const basis = Math.min(c.width / W, c.height / H);
    a.k = basis * a.zoom;
    a.px = px - lx * a.k;
    a.py = py - ly * a.k;
    klemmAnsicht();
    setZoomAnzeige(Math.round(neu * 100));
    allesZeichnen();
     
  }, [allesZeichnen]);

  // Laser verblasst animiert
  const laserLoop = useRef(false);
  const starteLaserLoop = useCallback(() => {
    if (laserLoop.current) return;
    laserLoop.current = true;
    const tick = () => {
      if (!laserSpur.current.length) { laserLoop.current = false; allesZeichnen(); return; }
      allesZeichnen();
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [allesZeichnen]);

  useEffect(() => { if (offen) { passeAn(); allesZeichnen(); } }, [offen, seite, papier, vollbild, allesZeichnen, passeAn]);
  useEffect(() => {
    const ro = new ResizeObserver(() => { passeAn(); allesZeichnen(); });
    if (flaecheRef.current) ro.observe(flaecheRef.current);
    return () => ro.disconnect();
  }, [passeAn, allesZeichnen]);

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

  // ---- Tafel-Heft speichern/laden -------------------------------------------
  const speicherTimer = useRef<number | null>(null);
  const speichern = useCallback(() => {
    if (!istLehrerin) return;
    if (speicherTimer.current) window.clearTimeout(speicherTimer.current);
    speicherTimer.current = window.setTimeout(() => {
      void api("tafelSpeichern", { daten: JSON.stringify({ papier: papierRef.current, seiten: seitenRef.current }) });
    }, 2000);
  }, [istLehrerin, api]);

  const liveEmpfangen = useRef(false);
  useEffect(() => {
    (async () => {
      const d = await api("tafelLaden");
      if (liveEmpfangen.current) return;
      if (d.ok && typeof d.daten === "string" && d.daten) {
        try {
          const roh = JSON.parse(d.daten) as Strich[][] | { papier?: Papier; seiten?: Strich[][] };
          const alt = Array.isArray(roh) ? roh : roh.seiten;
          if (!Array.isArray(roh) && roh.papier) setPapier(roh.papier);
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

  const vollSenden = useCallback((an: string) => {
    senden({ lma: "tafel", typ: "vstart" }, an);
    senden({ lma: "tafel", typ: "papier", papier: papierRef.current }, an);
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
      if (!f) { window.setTimeout(anmelden, 500); return; }
      const handler = (ev?: { data?: unknown; fromId?: string }) => {
        const n = ev?.data as Nachricht | undefined;
        if (!n || n.lma !== "tafel") return;
        if (n.typ === "voll?") { if (istLehrerin) vollSenden(ev?.fromId || "*"); return; }
        if (istLehrerin) return; // Inhalte kommen nur von der Lehrerin
        liveEmpfangen.current = true;
        if (n.typ === "vstart") { seitenRef.current = [[]]; setAnzahl(1); setSeite(0); allesZeichnen(); return; }
        const seiten = seitenRef.current;
        if (n.typ === "seg" || n.typ === "form") {
          while (seiten.length <= n.seite) seiten.push([]);
          let s = seiten[n.seite].find((x) => x.id === n.id);
          const neu = !s;
          if (!s) { s = { id: n.id, farbe: n.farbe, dicke: n.dicke, ...(n.m ? { m: 1 } : {}), punkte: [] }; seiten[n.seite].push(s); }
          if (n.typ === "form") s.punkte = n.pts.slice();
          const ab = s.punkte.length / 2;
          if (n.typ === "seg") s.punkte.push(...n.pts);
          setAnzahl(seiten.length);
          if (n.seite === seiteRef.current) {
            if (n.typ === "form") allesZeichnen();
            else {
              const ctx = canvasRef.current?.getContext("2d");
              if (ctx) { if (neu) zeichneStrich(ctx, s); else zeichneStrich(ctx, s, ab); }
            }
          }
        } else if (n.typ === "move") {
          const set = new Set(n.ids);
          (seiten[n.seite] || []).forEach((s) => {
            if (!set.has(s.id)) return;
            for (let i = 0; i < s.punkte.length; i += 2) { s.punkte[i] += n.dx; s.punkte[i + 1] += n.dy; }
          });
          if (n.seite === seiteRef.current) allesZeichnen();
        } else if (n.typ === "undo") {
          if (seiten[n.seite]) seiten[n.seite] = seiten[n.seite].filter((x) => x.id !== n.id);
          if (n.seite === seiteRef.current) allesZeichnen();
        } else if (n.typ === "leer") {
          if (seiten[n.seite]) seiten[n.seite] = [];
          if (n.seite === seiteRef.current) allesZeichnen();
        } else if (n.typ === "seite") {
          while (seitenRef.current.length < n.anzahl) seitenRef.current.push([]);
          setAnzahl(n.anzahl); setSeite(n.seite);
        } else if (n.typ === "papier") { setPapier(n.papier); }
        else if (n.typ === "laser") { laserSpur.current.push({ x: n.x, y: n.y, t: Date.now() }); starteLaserLoop(); }
        else if (n.typ === "offen") { setOffen(true); }
        else if (n.typ === "zu") { setOffen(false); }
      };
      f.on("app-message", handler);
      abmelden = () => { try { f.off("app-message", handler); } catch { } };
      if (!istLehrerin) senden({ lma: "tafel", typ: "voll?" });
    };
    anmelden();
    return () => { stop = true; if (abmelden) abmelden(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [istLehrerin]);

  // ---- Zeigerlogik ----------------------------------------------------------
  const aktiv = useRef<Strich | null>(null);
  const puffer = useRef<number[]>([]);
  const flushTimer = useRef<number | null>(null);
  const formStart = useRef<[number, number] | null>(null);
  const moveSumme = useRef<[number, number]>([0, 0]);
  const moveModus = useRef(false);
  const laserLetzte = useRef(0);
  // Finger: verschieben/zoomen (Handballen-Schutz)
  const beruehrungen = useRef(new Map<number, { x: number; y: number }>());
  const kneifStart = useRef<{ d: number; zoom: number } | null>(null);
  const stiftAktivBis = useRef(0); // solange der Stift schreibt, Finger ignorieren

  const flush = useCallback(() => {
    const s = aktiv.current;
    if (!s || !puffer.current.length) return;
    senden({ lma: "tafel", typ: "seg", seite: seiteRef.current, id: s.id, farbe: s.farbe, dicke: s.dicke, ...(s.m ? { m: 1 } : {}), pts: puffer.current });
    puffer.current = [];
  }, [senden]);

  const radiereBei = useCallback((x: number, y: number) => {
    const radius = Math.max(14, 26 / ansicht.current.zoom);
    const striche = seitenRef.current[seiteRef.current] || [];
    const weg = new Set<string>();
    for (const s of striche) {
      for (let i = 0; i * 2 + 1 < s.punkte.length; i++) {
        const dx = s.punkte[i * 2] - x, dy = s.punkte[i * 2 + 1] - y;
        if (dx * dx + dy * dy < radius * radius) { weg.add(s.id); break; }
      }
    }
    if (!weg.size) return;
    seitenRef.current[seiteRef.current] = striche.filter((q) => !weg.has(q.id));
    weg.forEach((id) => senden({ lma: "tafel", typ: "undo", seite: seiteRef.current, id }));
    allesZeichnen(); speichern();
  }, [senden, allesZeichnen, speichern]);

  const zeichnet = (typ: string) => typ === "pen" || typ === "mouse" || (typ === "touch" && (fingerZeichnen || !istLehrerin));

  const runter = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const p = punktAus(e);
    if (!p) return;

    // Finger (bei Lehrerin ohne Fingerzeichnen) und alle Schüler-Zeiger:
    // verschieben/zoomen statt zeichnen
    const darfZeichnen = istLehrerin && zeichnet(e.pointerType);
    if (!darfZeichnen) {
      if (e.pointerType === "touch" && Date.now() < stiftAktivBis.current) return; // Handballen
      beruehrungen.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (beruehrungen.current.size === 2) {
        const [a, b] = Array.from(beruehrungen.current.values());
        kneifStart.current = { d: Math.max(20, dist(a.x, a.y, b.x, b.y)), zoom: ansicht.current.zoom };
      }
      return;
    }
    stiftAktivBis.current = Date.now() + 800;

    if (werkzeug === "radierer") { radiereBei(p[0], p[1]); return; }
    if (werkzeug === "laser") {
      laserSpur.current.push({ x: p[0], y: p[1], t: Date.now() });
      senden({ lma: "tafel", typ: "laser", x: p[0], y: p[1] });
      starteLaserLoop();
      return;
    }
    if (werkzeug === "auswahl") {
      const aw = auswahl.current;
      if (aw && p[0] >= aw.box[0] && p[0] <= aw.box[2] && p[1] >= aw.box[1] && p[1] <= aw.box[3]) {
        moveModus.current = true; moveSumme.current = [0, 0];
        formStart.current = [p[0], p[1]];
        flushTimer.current = window.setInterval(() => {
          const [dx, dy] = moveSumme.current;
          if (!dx && !dy || !auswahl.current) return;
          moveSumme.current = [0, 0];
          senden({ lma: "tafel", typ: "move", seite: seiteRef.current, ids: Array.from(auswahl.current.ids), dx, dy });
        }, 90);
      } else {
        auswahl.current = null;
        gummiband.current = [p[0], p[1], p[0], p[1]];
        formStart.current = [p[0], p[1]];
        allesZeichnen();
      }
      return;
    }
    if (werkzeug === "linie" || werkzeug === "kreis" || werkzeug === "rechteck" || werkzeug === "dreieck") {
      formStart.current = [p[0], p[1]];
      vorschau.current = { id: Math.random().toString(36).slice(2, 10), farbe, dicke, punkte: [p[0], p[1]] };
      return;
    }
    // Stift / Marker
    const marker = werkzeug === "marker";
    const s: Strich = {
      id: Math.random().toString(36).slice(2, 10),
      farbe, dicke: marker ? MARKER_DICKE : dicke,
      ...(marker ? { m: 1 } : {}), punkte: [p[0], p[1]],
    };
    aktiv.current = s;
    (seitenRef.current[seiteRef.current] ||= []).push(s);
    puffer.current = [p[0], p[1]];
    flushTimer.current = window.setInterval(flush, 90);
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) zeichneStrich(ctx, s);
  };

  const bewegt = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const darfZeichnen = istLehrerin && zeichnet(e.pointerType);
    if (!darfZeichnen) {
      const alt = beruehrungen.current.get(e.pointerId);
      if (!alt) return;
      beruehrungen.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
      const a = ansicht.current;
      const dpr = window.devicePixelRatio || 1;
      if (beruehrungen.current.size >= 2 && kneifStart.current) {
        const [p1, p2] = Array.from(beruehrungen.current.values());
        const d = Math.max(20, dist(p1.x, p1.y, p2.x, p2.y));
        const ziel = kneifStart.current.zoom * (d / kneifStart.current.d);
        zoomen(ziel / a.zoom);
      } else if (beruehrungen.current.size === 1) {
        a.px += (e.clientX - alt.x) * dpr;
        a.py += (e.clientY - alt.y) * dpr;
        klemmAnsicht();
        allesZeichnen();
      }
      return;
    }
    const p = punktAus(e);
    if (!p) return;
    stiftAktivBis.current = Date.now() + 800;

    if (werkzeug === "radierer") { if (e.buttons) radiereBei(p[0], p[1]); return; }
    if (werkzeug === "laser") {
      if (!e.buttons) return;
      laserSpur.current.push({ x: p[0], y: p[1], t: Date.now() });
      if (Date.now() - laserLetzte.current > 60) {
        laserLetzte.current = Date.now();
        senden({ lma: "tafel", typ: "laser", x: p[0], y: p[1] });
      }
      starteLaserLoop();
      return;
    }
    if (werkzeug === "auswahl") {
      if (!formStart.current || !e.buttons) return;
      if (moveModus.current && auswahl.current) {
        const dx = p[0] - formStart.current[0], dy = p[1] - formStart.current[1];
        formStart.current = [p[0], p[1]];
        moveSumme.current = [moveSumme.current[0] + dx, moveSumme.current[1] + dy];
        const set = auswahl.current.ids;
        (seitenRef.current[seiteRef.current] || []).forEach((s) => {
          if (!set.has(s.id)) return;
          for (let i = 0; i < s.punkte.length; i += 2) { s.punkte[i] += dx; s.punkte[i + 1] += dy; }
        });
        const b = auswahl.current.box;
        auswahl.current.box = [b[0] + dx, b[1] + dy, b[2] + dx, b[3] + dy];
        allesZeichnen();
      } else if (gummiband.current) {
        gummiband.current = [
          Math.min(formStart.current[0], p[0]), Math.min(formStart.current[1], p[1]),
          Math.max(formStart.current[0], p[0]), Math.max(formStart.current[1], p[1]),
        ];
        allesZeichnen();
      }
      return;
    }
    if (formStart.current && vorschau.current) {
      vorschau.current.punkte = formPunkte(werkzeug, formStart.current[0], formStart.current[1], p[0], p[1]);
      allesZeichnen();
      return;
    }
    const s = aktiv.current;
    if (!s) return;
    const n = s.punkte.length;
    const dx = p[0] - s.punkte[n - 2], dy = p[1] - s.punkte[n - 1];
    if (dx * dx + dy * dy < 4) return;
    s.punkte.push(p[0], p[1]);
    puffer.current.push(p[0], p[1]);
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) zeichneStrich(ctx, s, n / 2);
  };

  const hoch = (e: React.PointerEvent<HTMLCanvasElement>) => {
    beruehrungen.current.delete(e.pointerId);
    if (beruehrungen.current.size < 2) kneifStart.current = null;
    if (!istLehrerin) return;
    if (flushTimer.current) { window.clearInterval(flushTimer.current); flushTimer.current = null; }

    if (werkzeug === "auswahl") {
      if (moveModus.current && auswahl.current) {
        const [dx, dy] = moveSumme.current;
        if (dx || dy) senden({ lma: "tafel", typ: "move", seite: seiteRef.current, ids: Array.from(auswahl.current.ids), dx, dy });
        moveSumme.current = [0, 0];
        speichern();
      } else if (gummiband.current) {
        const b = gummiband.current;
        gummiband.current = null;
        if (b[2] - b[0] > 12 || b[3] - b[1] > 12) {
          const ids = new Set<string>();
          for (const s of seitenRef.current[seiteRef.current] || []) {
            for (let i = 0; i * 2 + 1 < s.punkte.length; i++) {
              const x = s.punkte[i * 2], y = s.punkte[i * 2 + 1];
              if (x >= b[0] && x <= b[2] && y >= b[1] && y <= b[3]) { ids.add(s.id); break; }
            }
          }
          auswahl.current = ids.size ? { ids, box: b } : null;
        } else auswahl.current = null;
        allesZeichnen();
      }
      moveModus.current = false;
      formStart.current = null;
      return;
    }
    if (vorschau.current && formStart.current) {
      const fertig = vorschau.current;
      vorschau.current = null;
      formStart.current = null;
      if (fertig.punkte.length >= 4) {
        (seitenRef.current[seiteRef.current] ||= []).push(fertig);
        senden({ lma: "tafel", typ: "form", seite: seiteRef.current, id: fertig.id, farbe: fertig.farbe, dicke: fertig.dicke, pts: fertig.punkte });
        speichern();
      }
      allesZeichnen();
      return;
    }
    if (aktiv.current) { flush(); aktiv.current = null; speichern(); }
  };

  const rad = (e: React.WheelEvent<HTMLCanvasElement>) => {
    const c = canvasRef.current;
    if (!c) return;
    const dpr = window.devicePixelRatio || 1;
    const r = c.getBoundingClientRect();
    if (e.ctrlKey || e.metaKey) {
      zoomen(e.deltaY < 0 ? 1.12 : 0.9, (e.clientX - r.left) * dpr, (e.clientY - r.top) * dpr);
    } else {
      const a = ansicht.current;
      a.px -= e.deltaX * dpr; a.py -= e.deltaY * dpr;
      klemmAnsicht();
      allesZeichnen();
    }
  };

  // ---- Werkzeug-Aktionen ----------------------------------------------------
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
    auswahl.current = null;
    senden({ lma: "tafel", typ: "leer", seite: seiteRef.current });
    allesZeichnen(); speichern();
  };
  const seiteWechseln = (zu: number) => {
    const neuAnzahl = Math.max(anzahl, zu + 1);
    while (seitenRef.current.length < neuAnzahl) seitenRef.current.push([]);
    auswahl.current = null;
    setAnzahl(neuAnzahl); setSeite(zu);
    if (istLehrerin) { senden({ lma: "tafel", typ: "seite", seite: zu, anzahl: neuAnzahl }); speichern(); }
  };
  const papierWechseln = (zu: Papier) => {
    setPapier(zu);
    senden({ lma: "tafel", typ: "papier", papier: zu });
    speichern();
  };
  const wähle = (w: Werkzeug) => { setWerkzeug(w); auswahl.current = null; allesZeichnen(); };

  const palette = werkzeug === "marker" ? MARKER_FARBEN : FARBEN;

  return (
    <div ref={wrapRef} className={"tafelwrap" + (vollbild ? " voll" : "")} style={{ display: offen ? "flex" : "none" }}>
      <div className="tafelbar">
        {istLehrerin ? (<>
          <button className={"twz" + (werkzeug === "stift" ? " on" : "")} title="Stift"
            onClick={() => { wähle("stift"); if (!FARBEN.includes(farbe)) setFarbe(FARBEN[0]); }}>✏️</button>
          <button className={"twz" + (werkzeug === "marker" ? " on" : "")} title="Textmarker"
            onClick={() => { wähle("marker"); if (!MARKER_FARBEN.includes(farbe)) setFarbe(MARKER_FARBEN[0]); }}>🖍️</button>
          <button className={"twz" + (werkzeug === "linie" ? " on" : "")} title="Gerade Linie (Lineal)" onClick={() => wähle("linie")}>📏</button>
          <button className={"twz" + (werkzeug === "kreis" ? " on" : "")} title="Kreis aufziehen" onClick={() => wähle("kreis")}>⭕</button>
          <button className={"twz" + (werkzeug === "rechteck" ? " on" : "")} title="Rechteck aufziehen" onClick={() => wähle("rechteck")}>⬜</button>
          <button className={"twz" + (werkzeug === "dreieck" ? " on" : "")} title="Dreieck aufziehen" onClick={() => wähle("dreieck")}>🔺</button>
          <button className={"twz" + (werkzeug === "auswahl" ? " on" : "")} title="Einrahmen und verschieben" onClick={() => wähle("auswahl")}>✂️</button>
          <button className={"twz" + (werkzeug === "laser" ? " on" : "")} title="Laserpointer" onClick={() => wähle("laser")}>🔴</button>
          <button className={"twz" + (werkzeug === "radierer" ? " on" : "")} title="Radierer" onClick={() => wähle("radierer")}>🧽</button>
          <span className="ttrenn" />
          {palette.map((f) => (
            <button key={f} className={"tfarbe" + (werkzeug !== "radierer" && werkzeug !== "laser" && f === farbe ? " on" : "")}
              style={{ background: f }} aria-label="Farbe" onClick={() => setFarbe(f)} />
          ))}
          {(werkzeug === "stift" || werkzeug === "linie" || werkzeug === "kreis" || werkzeug === "rechteck" || werkzeug === "dreieck") && DICKEN.map((d) => (
            <button key={d} className={"tdicke" + (d === dicke ? " on" : "")} aria-label="Stiftdicke" onClick={() => setDicke(d)}>
              <span style={{ width: d + 3, height: d + 3 }} />
            </button>
          ))}
          <span className="ttrenn" />
          <button className="twz" title="Rückgängig" onClick={rueckgaengig}>↩️</button>
          <button className="twz" title="Seite leeren" onClick={seiteLeeren}>🗑️</button>
          <select className="tpapier" value={papier} onChange={(e) => papierWechseln(e.target.value as Papier)} title="Papier">
            <option value="kariert">Kariert</option>
            <option value="punkte">Gepunktet</option>
            <option value="liniert">Liniert</option>
            <option value="blanko">Blanko</option>
          </select>
          <button className={"twz" + (fingerZeichnen ? " on" : "")} title="Auch mit dem Finger zeichnen (sonst verschiebt der Finger nur)"
            onClick={() => setFingerZeichnen(!fingerZeichnen)}>☝️</button>
        </>) : <span className="tinfo">🖊️ Kleanas Tafel – live</span>}
        <span className="tseiten">
          <button className="twz" title="Kleiner" onClick={() => zoomen(0.8)}>−</button>
          <button className="twz" title="Zoom zurücksetzen" onClick={() => { const a = ansicht.current; a.zoom = 1; passeAn(); setZoomAnzeige(100); allesZeichnen(); }}>{zoomAnzeige}%</button>
          <button className="twz" title="Größer" onClick={() => zoomen(1.25)}>＋</button>
          <button className="twz" title="Vollbild" onClick={() => setVollbild(!vollbild)}>{vollbild ? "🡼" : "⛶"}</button>
          <span className="ttrenn" />
          <button className="twz" disabled={seite === 0} onClick={() => seiteWechseln(seite - 1)}>‹</button>
          <b>{seite + 1}/{anzahl}</b>
          {istLehrerin
            ? <button className="twz" onClick={() => seiteWechseln(seite + 1)}>{seite + 1 >= anzahl ? "＋ Seite" : "›"}</button>
            : <button className="twz" disabled={seite + 1 >= anzahl} onClick={() => seiteWechseln(seite + 1)}>›</button>}
          <button className="twz tzu" onClick={() => { setVollbild(false); setOffen(false); }}>✕</button>
        </span>
      </div>
      <div ref={flaecheRef} className="tafelflaeche">
        <canvas ref={canvasRef}
          style={{ touchAction: "none", cursor: istLehrerin ? "crosshair" : "grab", width: "100%", height: "100%", display: "block" }}
          onPointerDown={runter} onPointerMove={bewegt} onPointerUp={hoch} onPointerCancel={hoch} onWheel={rad} />
      </div>
    </div>
  );
}
