import { NextResponse } from "next/server";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { generatePaket } from "@/lib/brain";
import { checkMathe } from "@/lib/qa";

// Sequenzielle Anthropic-Aufrufe (generate + QA) brauchen Zeit -> Node-Runtime
// mit erhoehtem Limit. Kein Caching, jeder Aufruf arbeitet ein Topic ab.
export const runtime = "nodejs";
export const maxDuration = 120;

type TopicRow = {
  id: number;
  thema: string;
  klassenstufe: string;
  status: string;
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

  // 1. Naechstes pending Topic holen (aelteste id zuerst).
  const { data: topics, error: selectError } = await supabase
    .from("topics")
    .select("id, thema, klassenstufe, status")
    .eq("status", "pending")
    .order("id", { ascending: true })
    .limit(1);

  if (selectError) {
    return NextResponse.json({ error: `Supabase select: ${selectError.message}` }, { status: 500 });
  }

  const topic = (topics?.[0] as TopicRow | undefined) ?? null;
  if (!topic) {
    return NextResponse.json({ done: true });
  }

  // 2. + 3. Paket erzeugen und fachlich pruefen.
  try {
    const paket = await generatePaket(topic.thema, topic.klassenstufe);
    const qa = await checkMathe(paket);

    // 4. Ergebnis protokollieren.
    const { error: logError } = await supabase.from("content_log").insert({
      topic_id: topic.id,
      paket,
      qa_ok: qa.ok,
      qa_problems: qa.problems,
    });
    if (logError) {
      console.error("[generate] content_log insert fehler:", logError.message);
    }

    // 5. Topic-Status setzen.
    const neuerStatus = qa.ok ? "done" : "failed";
    const { error: updateError } = await supabase
      .from("topics")
      .update({ status: neuerStatus })
      .eq("id", topic.id);
    if (updateError) {
      console.error("[generate] topics update fehler:", updateError.message);
    }

    // 6. Antwort.
    return NextResponse.json({ thema: topic.thema, paket, qa });
  } catch (e) {
    // Generierung/QA fehlgeschlagen -> Topic auf failed, Fehler protokollieren.
    const meldung = e instanceof Error ? e.message : String(e);

    await supabase.from("content_log").insert({
      topic_id: topic.id,
      paket: { fehler: meldung },
      qa_ok: false,
      qa_problems: [meldung],
    });
    await supabase.from("topics").update({ status: "failed" }).eq("id", topic.id);

    return NextResponse.json(
      { thema: topic.thema, error: meldung, qa: { ok: false, problems: [meldung] } },
      { status: 500 },
    );
  }
}
