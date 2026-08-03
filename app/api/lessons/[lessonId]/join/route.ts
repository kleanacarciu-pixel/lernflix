// =============================================================================
// POST /api/lessons/[lessonId]/join
// Beitritt zu einer Unterrichtsstunde im virtuellen Klassenzimmer.
//
// Ablauf:
//   1. Eingeloggten Nutzer über das Supabase-JWT prüfen
//   2. Prüfen, ob er zu dieser Stunde gehört (Lehrerin, Schüler oder Teilnehmer)
//   3. Zeitfenster prüfen (Schüler: 15 Min vorher bis 30 Min nach Ende;
//      Kleana darf immer rein)
//   4. Beim ersten Beitritt einen privaten Daily.co-Raum erstellen und in der
//      Stunde speichern (alle Teilnehmer bekommen denselben Raum)
//   5. Persönliches Meeting-Token ausstellen (is_owner nur für Kleana)
//   6. roomUrl + token + Infos zurückgeben
//
// Sicherheit: DAILY_API_KEY und SUPABASE_SERVICE_ROLE_KEY existieren nur
// serverseitig – sie erreichen niemals den Browser.
// =============================================================================
import { NextResponse } from "next/server";
import { service, userFromToken, getProfile } from "@/lib/kalender";
import {
  ensureDailyRoom, createMeetingToken, VORLAUF_MINUTEN, NACHLAUF_MINUTEN, type Lesson,
} from "@/lib/stunden";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function fehler(msg: string, code = 400) {
  return NextResponse.json({ ok: false, error: msg }, { status: code });
}

// Wartezeit hübsch formatieren ("in 2 Std. 5 Min." / "in 3 Min.")
function nochWie(ms: number): string {
  const min = Math.ceil(ms / 60000);
  if (min >= 60) return `in ${Math.floor(min / 60)} Std. ${min % 60} Min.`;
  return `in ${min} Min.`;
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ lessonId: string }> }
): Promise<Response> {
  try {
    const { lessonId } = await params;
    if (!/^[0-9a-f-]{36}$/i.test(lessonId)) return fehler("Stunde nicht gefunden.", 404);

    // ---- 1) Login prüfen (Token aus Authorization-Header oder Body) --------
    let token = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
    if (!token) {
      const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
      if (typeof body.token === "string") token = body.token;
    }
    const user = token ? await userFromToken(token) : null;
    if (!user) return fehler("Bitte melde dich zuerst an.", 401);
    const profil = await getProfile(user.id);
    if (!profil) return fehler("Kein Zugang – bitte Kleana kontaktieren.", 403);

    // ---- 2) Stunde laden und Zugehörigkeit prüfen --------------------------
    const sb = service();
    const { data: stunde } = await sb.from("lessons").select("*").eq("id", lessonId).maybeSingle();
    if (!stunde) return fehler("Diese Stunde gibt es nicht (mehr).", 404);
    const lesson = stunde as Lesson;

    const istLehrerin = lesson.teacher_id === user.id || profil.role === "admin";
    let gehoertDazu = istLehrerin || lesson.student_id === user.id;
    if (!gehoertDazu) {
      const { data: teilnahme } = await sb
        .from("lesson_participants").select("user_id")
        .eq("lesson_id", lesson.id).eq("user_id", user.id).maybeSingle();
      gehoertDazu = !!teilnahme;
    }
    if (!gehoertDazu) return fehler("Du gehörst nicht zu dieser Stunde. Bitte prüfe den Link oder melde dich bei Kleana.", 403);

    // ---- 3) Zeitfenster prüfen (nur für Schüler – Kleana darf immer) -------
    const jetzt = Date.now();
    const beginn = new Date(lesson.starts_at).getTime();
    const ende = new Date(lesson.ends_at).getTime();
    const einlassAb = beginn - VORLAUF_MINUTEN * 60000;
    const gueltigBis = ende + NACHLAUF_MINUTEN * 60000;
    if (!istLehrerin) {
      if (jetzt < einlassAb) {
        return fehler(`Noch etwas Geduld! Du kannst dem Klassenzimmer frühestens ${VORLAUF_MINUTEN} Minuten vor Beginn beitreten (${nochWie(einlassAb - jetzt)}).`, 403);
      }
      if (jetzt > gueltigBis) {
        return fehler("Diese Stunde ist schon vorbei. Deine nächste Stunde findest du im Terminkalender.", 410);
      }
    }

    // Ablaufzeit für Raum + Token: Ende + 30 Min. Falls Kleana nach Ablauf
    // beitritt (sie darf immer), bekommt der Raum mindestens 1 Std. ab jetzt.
    const expUnix = Math.floor(Math.max(gueltigBis, jetzt + 60 * 60000) / 1000);

    // ---- 4) Raum holen oder beim ersten Beitritt erstellen -----------------
    let roomName = lesson.daily_room_name;
    let roomUrl = lesson.daily_room_url;
    if (!roomName || !roomUrl) {
      const raum = await ensureDailyRoom(lesson, expUnix);
      // Nur speichern, wenn noch kein Raum eingetragen ist (Schutz gegen
      // gleichzeitige Beitritte). Der Raumname ist pro Stunde eindeutig,
      // daher bekommen trotzdem alle denselben Raum.
      await sb.from("lessons")
        .update({ daily_room_name: raum.name, daily_room_url: raum.url })
        .eq("id", lesson.id).is("daily_room_name", null);
      roomName = raum.name;
      roomUrl = raum.url;
    }

    // ---- 5) Persönliches Meeting-Token ausstellen --------------------------
    const anzeigename = profil.name || user.email || "Gast";
    const meetingToken = await createMeetingToken(roomName, anzeigename, istLehrerin, expUnix);

    // ---- 6) Antwort --------------------------------------------------------
    return NextResponse.json({
      ok: true,
      roomUrl,
      token: meetingToken,
      isTeacher: istLehrerin,
      lessonTitle: lesson.title,
      startsAt: lesson.starts_at,
      endsAt: lesson.ends_at,
    });
  } catch (e) {
    console.error("join-Fehler:", e);
    return fehler("Das Klassenzimmer konnte nicht vorbereitet werden. Bitte versuche es gleich noch einmal.", 500);
  }
}
