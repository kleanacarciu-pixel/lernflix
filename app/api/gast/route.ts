// =============================================================================
// POST /api/gast – Beitritt OHNE Login (Probestunde / Masterclass)
//
// Kleana erstellt im Kalender einen Video-Call und verschickt den Gast-Link
// /gast/<lessonId>?k=<schluessel> selbst (z. B. per WhatsApp oder E-Mail).
// Der Schlüssel ist ein HMAC über die Stunden-ID (siehe lib/stunden.ts) –
// ohne ihn verrät die API nichts, mit ihm darf der Gast im Zeitfenster rein.
//
// Aktionen: { action: "info" | "join", lessonId, k, name? }
// =============================================================================
import { NextResponse } from "next/server";
import { service } from "@/lib/kalender";
import {
  ensureDailyRoom, createMeetingToken, gastSchluessel,
  VORLAUF_MINUTEN, NACHLAUF_MINUTEN, type Lesson,
} from "@/lib/stunden";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function fehler(msg: string, code = 400) {
  return NextResponse.json({ ok: false, error: msg }, { status: code });
}
function ok(data: Record<string, unknown> = {}) {
  return NextResponse.json({ ok: true, ...data });
}

export async function POST(req: Request): Promise<Response> {
  try {
    let body: Record<string, unknown> = {};
    try { const r = await req.json(); if (r && typeof r === "object") body = r as Record<string, unknown>; } catch { /* {} */ }
    const action = String(body.action || "");
    const lessonId = String(body.lessonId || "");
    const k = String(body.k || "");

    if (!/^[0-9a-f-]{36}$/i.test(lessonId)) return fehler("Dieser Link ist ungültig.", 404);
    if (!k || k !== gastSchluessel(lessonId)) return fehler("Dieser Link ist ungültig oder abgelaufen.", 403);

    const sb = service();
    const { data: stunde } = await sb.from("lessons").select("*").eq("id", lessonId).maybeSingle();
    if (!stunde) return fehler("Diesen Video-Call gibt es nicht (mehr).", 404);
    const lesson = stunde as Lesson;

    const jetzt = Date.now();
    const beginn = new Date(lesson.starts_at).getTime();
    const ende = new Date(lesson.ends_at).getTime();
    const einlassAb = beginn - VORLAUF_MINUTEN * 60000;
    const gueltigBis = ende + NACHLAUF_MINUTEN * 60000;

    if (action === "info") {
      return ok({
        titel: lesson.title, startsAt: lesson.starts_at, endsAt: lesson.ends_at,
        offen: jetzt >= einlassAb && jetzt <= gueltigBis,
        vorbei: jetzt > gueltigBis,
      });
    }

    if (action === "join") {
      const name = String(body.name || "").trim().slice(0, 40);
      if (name.length < 2) return fehler("Bitte sag uns kurz deinen Namen.");
      if (jetzt < einlassAb) {
        const min = Math.ceil((einlassAb - jetzt) / 60000);
        const wann = min >= 60 ? `in ${Math.floor(min / 60)} Std. ${min % 60} Min.` : `in ${min} Min.`;
        return fehler(`Noch etwas Geduld! Der Call öffnet ${VORLAUF_MINUTEN} Minuten vor Beginn (${wann}).`, 403);
      }
      if (jetzt > gueltigBis) return fehler("Dieser Call ist schon vorbei.", 410);

      const expUnix = Math.floor(gueltigBis / 1000);
      let roomName = lesson.daily_room_name;
      let roomUrl = lesson.daily_room_url;
      if (!roomName || !roomUrl) {
        const raum = await ensureDailyRoom(lesson, expUnix);
        await sb.from("lessons")
          .update({ daily_room_name: raum.name, daily_room_url: raum.url })
          .eq("id", lesson.id).is("daily_room_name", null);
        roomName = raum.name;
        roomUrl = raum.url;
      }
      const meetingToken = await createMeetingToken(roomName, name, false, expUnix);
      return ok({ roomUrl, token: meetingToken, titel: lesson.title });
    }

    return fehler("Unbekannte Aktion.");
  } catch (e) {
    console.error("gast-Fehler:", e);
    return fehler("Der Video-Call konnte nicht vorbereitet werden. Bitte versuche es gleich noch einmal.", 500);
  }
}
