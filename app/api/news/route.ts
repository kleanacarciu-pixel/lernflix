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

type Quelle = { id: string; name: string; url: string; kategorie: string };

// Quellen-Liste. Faellt eine Quelle aus oder aendert ihre URL, wird sie still
// uebersprungen - die Seite bleibt funktionsfaehig. Debug: /api/news?debug=1
const QUELLEN: Quelle[] = [
  { id: "wdp",      name: "Welt der Physik",   url: "https://www.weltderphysik.de/rss/news.xml",                        kategorie: "Physik" },
  { id: "spektrum", name: "Spektrum.de",       url: "https://www.spektrum.de/alias/rss/spektrum-de-rss-feed/996406",    kategorie: "Wissenschaft" },
  { id: "wissen",   name: "wissenschaft.de",   url: "https://www.wissenschaft.de/feed/",                                kategorie: "Wissenschaft" },
  { id: "mpg",      name: "Max-Planck-Gesellschaft", url: "https://www.mpg.de/rss/institute",                           kategorie: "Wissenschaft" },
  { id: "dlfbild",  name: "Deutschlandfunk",   url: "https://www.deutschlandfunk.de/campus-und-karriere-102.xml",       kategorie: "Schule" },
  { id: "bmbf",     name: "Bildungsministerium", url: "https://www.bmbf.de/SiteGlobals/Functions/RSSFeed/DE/RSSNewsfeed/RSSNewsfeed.xml", kategorie: "Schule" },
  { id: "kmbayern", name: "Kultusministerium Bayern", url: "https://www.km.bayern.de/allgemein/meldung.rss",            kategorie: "Schule Bayern" },
  { id: "bronline", name: "BR24 Bayern",       url: "https://feeds.br.de/br24/bayern/feed.xml",                         kategorie: "Schule Bayern" },
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
  for (const b of bloecke.slice(0, MAX_PRO_QUELLE)) {
    const titel = clean(tag(b, "title"));
    const link = linkAus(b);
    if (!titel || !/^https?:\/\//.test(link)) continue;
    const text = clean(tag(b, "description") || tag(b, "summary") || tag(b, "content")).slice(0, 220);
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

async function holeFeed(q: Quelle): Promise<{ q: Quelle; eintraege: Eintrag[]; fehler?: string }> {
  try {
    const res = await fetch(q.url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; LerneMitAnna-News/1.0; +https://lernemitanna.de)",
        Accept: "application/rss+xml, application/atom+xml, application/xml, text/xml;q=0.9, */*;q=0.8",
      },
      signal: AbortSignal.timeout(8000),
      next: { revalidate },
    });
    if (!res.ok) return { q, eintraege: [], fehler: `HTTP ${res.status}` };
    const xml = await res.text();
    const eintraege = parse(xml, q);
    return { q, eintraege, fehler: eintraege.length ? undefined : "keine Eintraege gefunden" };
  } catch (e) {
    return { q, eintraege: [], fehler: e instanceof Error ? e.message.slice(0, 120) : "Fehler" };
  }
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
      id: r.q.id, name: r.q.name, url: r.q.url,
      treffer: r.eintraege.length, fehler: r.fehler ?? null,
    }));
  }

  return NextResponse.json(body, {
    headers: { ...h, "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
  });
}
