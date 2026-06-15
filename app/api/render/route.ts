import { NextResponse } from "next/server";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { buildMovieSpec, renderVideo } from "@/lib/video";
import type { Paket } from "@/lib/brain";

// Rendern + Polling dauert laenger -> Node-Runtime mit hohem Limit.
// Hinweis: auf dem Vercel-Hobby-Plan wird die Funktion bei 60s gekappt; fuer
// laengere Renders lokal (npm run dev, kein Limit) oder mit Pro-Plan ausfuehren.
export const runtime = "nodejs";
export const maxDuration = 300;

type Row = {
  id: number;
  paket: Paket;
  video_status: string | null;
};

function getSupabase(): SupabaseClient {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY fehlen (nur serverseitig setzen).");
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function GET(): Promise<Response> {
  let supabase: SupabaseClient;
  try {
    supabase = getSupabase();
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }

  // 1. Naechstes geprueftes, noch nicht gerendertes Paket holen.
  const { data: rows, error: selectError } = await supabase
    .from("content_log")
    .select("id, paket, video_status")
    .eq("qa_ok", true)
    .or("video_status.eq.none,video_status.is.null")
    .order("id", { ascending: true })
    .limit(1);

  if (selectError) {
    return NextResponse.json({ error: `Supabase select: ${selectError.message}` }, { status: 500 });
  }

  const row = (rows?.[0] as Row | undefined) ?? null;
  if (!row) {
    return NextResponse.json({ done: true });
  }

  // 2. Auf 'rendering' setzen (verhindert Doppel-Render bei parallelen Aufrufen).
  await supabase.from("content_log").update({ video_status: "rendering" }).eq("id", row.id);

  // 3. + 4. Spec bauen, rendern, Ergebnis speichern.
  try {
    const spec = buildMovieSpec(row.paket);
    const videoUrl = await renderVideo(spec);

    const { error: updateError } = await supabase
      .from("content_log")
      .update({ video_url: videoUrl, video_status: "ready" })
      .eq("id", row.id);
    if (updateError) {
      console.error("[render] update fehler:", updateError.message);
    }

    // 5. Antwort.
    return NextResponse.json({ id: row.id, video_url: videoUrl, video_status: "ready" });
  } catch (e) {
    const meldung = e instanceof Error ? e.message : String(e);
    console.error("[render] fehler:", meldung);

    await supabase.from("content_log").update({ video_status: "failed" }).eq("id", row.id);

    return NextResponse.json(
      { id: row.id, error: meldung, video_status: "failed" },
      { status: 500 },
    );
  }
}
