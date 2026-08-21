// News-Aggregator fuer lernemitanna.de/aktuelles
// Holt echte Schlagzeilen aus oeffentlichen RSS-/Atom-Feeds (Mathe, Physik,
// Wissenschaft, Schule/Bildung) und liefert sie als JSON an die Website.
// Es werden KEINE Inhalte erfunden - nur Titel + Link zur Originalquelle.
import { NextResponse } from "next/server";

export const runtime = "nodejs";
// Ergebnis wird eine Stunde zwischengespeichert (schnell + schont die Quellen).
export const revalidate = 3600;

const ALLOWED = new Set(["https://lernemitanna.de", "https://www.lernemitanna.de"]);
function cors(origin: string | null): Record<string, string> {
  const allowed = !!origin && (ALLOWED.has(origin) || origin.endsWith(".vercel.app"));
  const o = allowed && origin ? origin : "https://lernemitanna.de";
  return {
    "Access-Control-Allow-Origin": o,
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    Vary: "Origin",
  };
}

type Quelle = { id: string; name: string; urls: string[]; kategorie: string;
  // Nur fuer breite Quellen: Eintrag muss eines dieser Woerter enthalten,
  // sonst wird er verworfen (haelt themenfremde Meldungen draussen).
  nurMit?: RegExp };

// Quellen-Liste. Faellt eine Quelle aus oder aendert ihre URL, wird sie still
// uebersprungen - die Seite bleibt funktionsfaehig. Debug: /api/news?debug=1
const SCHUL_THEMEN =
  /(schul|schüler|schueler|abitur|abi\b|unterricht|lehrer|lehrkraft|lehrkräfte|gymnasium|realschule|grundschule|mittelschule|bildung|klassenzimmer|noten|pisa|ferien|hausaufgab|nachhilfe|kultusminister|mathe|physik)/i;

const QUELLEN: Quelle[] = [
  { id: "wdp", name: "Welt der Physik", kategorie: "Physik", urls: [
    "https://www.weltderphysik.de/RSS-Forschung",
    "https://www.weltderphysik.de/RSS-alles",
  ] },
  { id: "spektrum", name: "Spektrum.de", kategorie: "Wissenschaft", urls: [
    "https://www.spektrum.de/alias/rss/spektrum-de-rss-feed/996406",
  ] },
  { id: "wissen", name: "wissenschaft.de", kategorie: "Wissenschaft", urls: [
    "https://www.wissenschaft.de/feed/",
  ] },
  { id: "scinexx", name: "scinexx", kategorie: "Wissenschaft", urls: [
    "https://www.scinexx.de/feed/",
  ] },
  { id: "n4t", name: "News4teachers", kategorie: "Schule", urls: [
    "https://www.news4teachers.de/feed/",
  ] },
  // Breiter Regional-Feed: nur Schul-/Bildungsthemen durchlassen.
  { id: "sz", name: "Süddeutsche Bayern", kategorie: "Schule Bayern", urls: [
    "https://rss.sueddeutsche.de/rss/Bayern",
  ], nurMit: SCHUL_THEMEN },
];

const MAX_PRO_QUELLE = 6;
const MAX_GESAMT = 30;

// --- kleine HTML-/XML-Helfer (bewusst ohne Zusatz-Abhaengigkeit) ------------
function entities(s: string): string {
  return s
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&#0?39;/g, "'")
    .replace(/&nbsp;/g, " ").replace(/&#8211;/g, "–").replace(/&#8212;/g, "—")
    .replace(/&#8217;/g, "'").replace(/&#8222;/g, "„").replace(/&#8220;/g, "“")
    .replace(/&#(\d+);/g, (_, d) => { try { return String.fromCodePoint(Number(d)); } catch { return ""; } })
    .replace(/&amp;/g, "&");
}
function clean(s: string): string {
  return entities(
    s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").replace(/<[^>]*>/g, " ")
  ).replace(/\s+/g, " ").trim();
}
function tag(block: string, name: string): string {
  const m = block.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, "i"));
  return m ? m[1] : "";
}
function attr(block: string, re: RegExp): string {
  const m = block.match(re);
  return m ? m[1] : "";
}

function linkAus(block: string): string {
  // Atom: <link href="..."/> (rel="alternate" bevorzugt) - RSS: <link>...</link>
  const alt = attr(block, /<link[^>]+rel=["']alternate["'][^>]*href=["']([^"']+)["']/i);
  if (alt) return alt;
  const href = attr(block, /<link[^>]+href=["']([^"']+)["']/i);
  if (href) return href;
  const t = clean(tag(block, "link"));
  return t;
}

function bildAus(block: string): string {
  const kandidaten = [
    attr(block, /<enclosure[^>]+url=["']([^"']+)["'][^>]*type=["']image\//i),
    attr(block, /<media:content[^>]+url=["']([^"']+)["']/i),
    attr(block, /<media:thumbnail[^>]+url=["']([^"']+)["']/i),
    attr(block, /<itunes:image[^>]+href=["']([^"']+)["']/i),
    attr(block, /<img[^>]+src=["']([^"']+)["']/i),
    attr(block, /&lt;img[^&]+src=["']([^"']+)["']/i),
  ];
  const b = kandidaten.find((x) => x && /^https?:\/\//.test(x)) || "";
  return b.replace(/&amp;/g, "&");
}

function datumAus(block: string): string {
  const roh = clean(tag(block, "pubDate")) || clean(tag(block, "updated")) ||
              clean(tag(block, "published")) || clean(tag(block, "dc:date"));
  if (!roh) return "";
  const d = new Date(roh);
  return isNaN(d.getTime()) ? "" : d.toISOString();
}

type Eintrag = {
  titel: string; link: string; quelle: string; kategorie: string;
  datum: string; text: string; bild: string;
};

function parse(xml: string, q: Quelle): Eintrag[] {
  const bloecke = xml.match(/<item(?:\s[^>]*)?>[\s\S]*?<\/item>/gi)
                 || xml.match(/<entry(?:\s[^>]*)?>[\s\S]*?<\/entry>/gi)
                 || [];
  const out: Eintrag[] = [];
  // Erst filtern, dann begrenzen - sonst faellt bei gefilterten Quellen
  // fast alles weg, weil nur die ersten Eintraege geprueft wuerden.
  for (const b of bloecke) {
    if (out.length >= MAX_PRO_QUELLE) break;
    const titel = clean(tag(b, "title"));
    const link = linkAus(b);
    if (!titel || !/^https?:\/\//.test(link)) continue;
    const text = clean(tag(b, "description") || tag(b, "summary") || tag(b, "content")).slice(0, 220);
    if (q.nurMit && !q.nurMit.test(titel + " " + text)) continue;
    out.push({
      titel: titel.slice(0, 200),
      link,
      quelle: q.name,
      kategorie: q.kategorie,
      datum: datumAus(b),
      text,
      bild: bildAus(b),
    });
  }
  return out;
}

async function holeEine(url: string, q: Quelle): Promise<{ eintraege: Eintrag[]; fehler?: string }> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; LerneMitAnna-News/1.0; +https://lernemitanna.de)",
        Accept: "application/rss+xml, application/atom+xml, application/xml, text/xml;q=0.9, */*;q=0.8",
      },
      signal: AbortSignal.timeout(8000),
      next: { revalidate },
    });
    if (!res.ok) return { eintraege: [], fehler: `HTTP ${res.status}` };
    const eintraege = parse(await res.text(), q);
    return { eintraege, fehler: eintraege.length ? undefined : "keine Eintraege" };
  } catch (e) {
    return { eintraege: [], fehler: e instanceof Error ? e.message.slice(0, 90) : "Fehler" };
  }
}

// Probiert die Kandidaten-URLs der Quelle der Reihe nach - die erste, die
// Eintraege liefert, gewinnt. So ueberlebt der Feed einen URL-Wechsel.
async function holeFeed(q: Quelle): Promise<{ q: Quelle; eintraege: Eintrag[]; url?: string; fehler?: string }> {
  const fehler: string[] = [];
  for (const url of q.urls) {
    const r = await holeEine(url, q);
    if (r.eintraege.length) return { q, eintraege: r.eintraege, url };
    fehler.push(`${url} -> ${r.fehler}`);
  }
  return { q, eintraege: [], fehler: fehler.join(" | ").slice(0, 300) };
}

export async function OPTIONS(req: Request): Promise<Response> {
  return new Response(null, { status: 204, headers: cors(req.headers.get("origin")) });
}

export async function GET(req: Request): Promise<Response> {
  const h = cors(req.headers.get("origin"));
  const debug = new URL(req.url).searchParams.get("debug") === "1";

  const ergebnisse = await Promise.all(QUELLEN.map(holeFeed));

  // Zusammenfuehren, Duplikate raus, neueste zuerst
  const gesehen = new Set<string>();
  const alle: Eintrag[] = [];
  for (const r of ergebnisse) {
    for (const e of r.eintraege) {
      const key = e.titel.toLowerCase().replace(/[^a-z0-9äöüß]/g, "").slice(0, 60);
      if (gesehen.has(key)) continue;
      gesehen.add(key);
      alle.push(e);
    }
  }
  alle.sort((a, b) => (b.datum || "").localeCompare(a.datum || ""));

  const body: Record<string, unknown> = {
    ok: true,
    stand: new Date().toISOString(),
    anzahl: Math.min(alle.length, MAX_GESAMT),
    eintraege: alle.slice(0, MAX_GESAMT),
  };
  if (debug) {
    body.quellen = ergebnisse.map((r) => ({
      id: r.q.id, name: r.q.name, url: r.url ?? null,
      treffer: r.eintraege.length, fehler: r.fehler ?? null,
    }));
  }

  return NextResponse.json(body, {
    headers: { ...h, "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
  });
}
