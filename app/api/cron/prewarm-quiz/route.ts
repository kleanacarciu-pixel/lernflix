import { NextResponse } from "next/server";

export const runtime = "edge";

// Top-themen die pre-warmed werden (volumen-mässig die wichtigsten).
// Bei bedarf erweitern - jede zeile = eine API-anfrage (~6-8 sek).
const PREWARM_LISTE: Array<{ fach: "mathe" | "physik"; klasse: number; thema: string; schwierigkeit: "leicht" | "mittel" | "schwer" }> = [
  // Klasse 5-7: brueche + grundrechnen (hot)
  { fach: "mathe", klasse: 5, thema: "Brüche", schwierigkeit: "leicht" },
  { fach: "mathe", klasse: 5, thema: "Brüche", schwierigkeit: "mittel" },
  { fach: "mathe", klasse: 6, thema: "Brüche addieren & subtrahieren", schwierigkeit: "mittel" },
  { fach: "mathe", klasse: 6, thema: "Dezimalzahlen", schwierigkeit: "leicht" },
  { fach: "mathe", klasse: 7, thema: "Prozentrechnung", schwierigkeit: "mittel" },
  { fach: "mathe", klasse: 7, thema: "Gleichungen lösen", schwierigkeit: "mittel" },

  // Klasse 8-10: zentrale themen
  { fach: "mathe", klasse: 8, thema: "Satz des Pythagoras", schwierigkeit: "mittel" },
  { fach: "mathe", klasse: 8, thema: "Lineare Funktionen", schwierigkeit: "mittel" },
  { fach: "mathe", klasse: 9, thema: "Quadratische Funktionen", schwierigkeit: "mittel" },
  { fach: "mathe", klasse: 9, thema: "pq-Formel", schwierigkeit: "mittel" },
  { fach: "mathe", klasse: 10, thema: "Exponentialfunktionen", schwierigkeit: "mittel" },

  // Klasse 11-13 Abi
  { fach: "mathe", klasse: 11, thema: "Ableitungen — Grundlagen", schwierigkeit: "mittel" },
  { fach: "mathe", klasse: 12, thema: "Integralrechnung vertieft", schwierigkeit: "mittel" },

  // Physik populär
  { fach: "physik", klasse: 7, thema: "Bewegung", schwierigkeit: "mittel" },
  { fach: "physik", klasse: 8, thema: "Mechanik", schwierigkeit: "mittel" },
  { fach: "physik", klasse: 9, thema: "Elektrizität", schwierigkeit: "mittel" },
];

// Vercel Cron darf die route ohne Auth aufrufen via x-vercel-cron header
// Manuelle aufrufe brauchen den geheim-token
function authorisiert(req: Request): boolean {
  const cronHeader = req.headers.get("x-vercel-cron");
  if (cronHeader) return true;
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const auth = req.headers.get("authorization") || "";
  return auth === `Bearer ${secret}`;
}

async function eineKombiPreWarmen(item: typeof PREWARM_LISTE[number]): Promise<{ ok: boolean; thema: string; status?: number }> {
  try {
    const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://lernflix.lernemitanna.de";
    const res = await fetch(`${baseUrl}/api/quiz`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fach: item.fach,
        klasse: String(item.klasse),
        thema: item.thema,
        schwierigkeit: item.schwierigkeit,
      }),
    });
    return { ok: res.ok, thema: `${item.fach}/${item.klasse}/${item.thema}/${item.schwierigkeit}`, status: res.status };
  } catch (e) {
    return { ok: false, thema: `${item.fach}/${item.klasse}/${item.thema}/${item.schwierigkeit}`, status: 0 };
  }
}

export async function GET(request: Request): Promise<Response> {
  if (!authorisiert(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  console.log(`[prewarm] Starte fuer ${PREWARM_LISTE.length} kombis`);
  const start = Date.now();

  // Sequenziell um Anthropic-Rate-Limit nicht zu sprengen
  const results: Array<{ ok: boolean; thema: string; status?: number }> = [];
  for (const item of PREWARM_LISTE) {
    const r = await eineKombiPreWarmen(item);
    results.push(r);
    console.log(`[prewarm] ${r.ok ? "OK" : "FAIL"} ${r.thema} (${r.status})`);
  }

  const dauer = Date.now() - start;
  const erfolg = results.filter((r) => r.ok).length;

  return NextResponse.json({
    summary: `${erfolg}/${PREWARM_LISTE.length} erfolgreich in ${Math.round(dauer / 1000)}s`,
    results,
  });
}
