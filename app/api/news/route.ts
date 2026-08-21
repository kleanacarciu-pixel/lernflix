// Liefert die Schlagzeilen fuer lernemitanna.de/schlagzeilen als JSON.
// Quellen und Einlese-Logik stehen in lib/news.ts (auch von der
// Ueberwachung unter /api/cron/news-check genutzt).
import { NextResponse } from "next/server";
import { sammleNews, MAX_GESAMT } from "@/lib/news";

export const runtime = "nodejs";
// Muss eine feste Zahl sein - Next.js liest diese Angabe statisch aus
// und lehnt importierte Konstanten oder Ausdruecke ab (= 1 Stunde).
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

export async function OPTIONS(req: Request): Promise<Response> {
  return new Response(null, { status: 204, headers: cors(req.headers.get("origin")) });
}

export async function GET(req: Request): Promise<Response> {
  const h = cors(req.headers.get("origin"));
  const debug = new URL(req.url).searchParams.get("debug") === "1";

  const { eintraege, ergebnisse } = await sammleNews();

  const body: Record<string, unknown> = {
    ok: true,
    stand: new Date().toISOString(),
    anzahl: Math.min(eintraege.length, MAX_GESAMT),
    eintraege: eintraege.slice(0, MAX_GESAMT),
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
