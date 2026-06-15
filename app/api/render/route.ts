import { NextResponse } from "next/server";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { buildMovieSpec, submitRender, pollRender } from "@/lib/video";
import type { Paket } from "@/lib/brain";

// Zwei-Phasen-Flow: jeder Aufruf ist schnell (starten ODER einmal Status pruefen),
// damit es auch auf dem Vercel-Hobby-Plan (60s-Limit) funktioniert.
// /api/render einfach wiederholt aufrufen, bis video_status = 'ready' kommt.
export const runtime = "nodejs";
export const maxDuration = 60;

type StartRow = { id: number; paket: Paket };
type PollRow = { id: number; video_project: string };

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

  // 0. Selbstheilung: verwaiste 'rendering'-Zeilen ohne project-id (z.B. von
  //    abgebrochenen Laeufen) auf 'none' zuruecksetzen, damit sie neu starten.
  await supabase
    .from("content_log")
    .update({ video_status: "none" })
    .eq("video_status", "rendering")
    .is("video_project", null);

  // 1. Laeuft schon ein Render? -> einmal Status pruefen.
  const { data: laufende } = await supabase
    .from("content_log")
    .select("id, video_project")
    .eq("video_status", "rendering")
    .not("video_project", "is", null)
    .order("id", { ascending: true })
    .limit(1);

  const inflight = (laufende?.[0] as PollRow | undefined) ?? null;
  if (inflight) {
    try {
      const r = await pollRender(inflight.video_project);
      if (r.status === "done") {
        await supabase
          .from("content_log")
          .update({ video_url: r.url, video_status: "ready" })
          .eq("id", inflight.id);
        return NextResponse.json({ id: inflight.id, video_url: r.url, video_status: "ready" });
      }
      if (r.status === "error") {
        await supabase.from("content_log").update({ video_status: "failed" }).eq("id", inflight.id);
        return NextResponse.json(
          { id: inflight.id, video_status: "failed", error: r.message },
          { status: 500 },
        );
      }
      // laeuft noch
      return NextResponse.json({
        id: inflight.id,
        video_status: "rendering",
        hinweis: "Render läuft noch — in ~20-30s /api/render erneut aufrufen.",
      });
    } catch (e) {
      const meldung = e instanceof Error ? e.message : String(e);
      await supabase.from("content_log").update({ video_status: "failed" }).eq("id", inflight.id);
      return NextResponse.json({ id: inflight.id, video_status: "failed", error: meldung }, { status: 500 });
    }
  }

  // 2. Sonst: naechstes geprueftes, noch nicht gerendertes Paket starten.
  const { data: offene, error: selectError } = await supabase
    .from("content_log")
    .select("id, paket")
    .eq("qa_ok", true)
    .or("video_status.eq.none,video_status.is.null")
    .order("id", { ascending: true })
    .limit(1);

  if (selectError) {
    return NextResponse.json({ error: `Supabase select: ${selectError.message}` }, { status: 500 });
  }

  const row = (offene?.[0] as StartRow | undefined) ?? null;
  if (!row) {
    return NextResponse.json({ done: true });
  }

  try {
    const project = await submitRender(buildMovieSpec(row.paket));
    await supabase
      .from("content_log")
      .update({ video_project: project, video_status: "rendering" })
      .eq("id", row.id);

    return NextResponse.json({
      id: row.id,
      video_status: "rendering",
      hinweis: "Render gestartet — in ~30s /api/render erneut aufrufen, um das fertige Video abzuholen.",
    });
  } catch (e) {
    const meldung = e instanceof Error ? e.message : String(e);
    console.error("[render] start-fehler:", meldung);
    await supabase.from("content_log").update({ video_status: "failed" }).eq("id", row.id);
    return NextResponse.json({ id: row.id, error: meldung, video_status: "failed" }, { status: 500 });
  }
}
