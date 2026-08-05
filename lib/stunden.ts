// =============================================================================
// Virtuelles Klassenzimmer – gemeinsame Server-Logik (Daily.co + Supabase)
// Wird von app/api/lessons/[lessonId]/join/route.ts und app/api/kalender
// genutzt. NUR serverseitig! (DAILY_API_KEY darf nie im Browser landen.)
// =============================================================================
import { service } from "@/lib/kalender";

// Zeitfenster-Regeln (Version 1)
export const VORLAUF_MINUTEN = 15;  // Schüler dürfen 15 Min. vor Beginn rein
export const NACHLAUF_MINUTEN = 30; // Raum gilt bis 30 Min. nach Ende

// --- Typen ------------------------------------------------------------------
export type Lesson = {
  id: string;
  teacher_id: string;
  student_id: string | null;
  starts_at: string;
  ends_at: string;
  title: string;
  subject: string | null;
  kind: "einzel" | "gruppe" | "webinar";
  daily_room_name: string | null;
  daily_room_url: string | null;
};

export type NextLesson = Pick<Lesson, "id" | "title" | "starts_at" | "ends_at" | "kind">;

// --- Nächste anstehende Stunde eines Nutzers (für den Kalender-Button) ------
export async function nextLessonFor(userId: string): Promise<NextLesson | null> {
  try {
    const sb = service();
    // Teilnahmen an Gruppenstunden/Webinaren einsammeln
    const { data: lp } = await sb.from("lesson_participants").select("lesson_id").eq("user_id", userId);
    const teilnahmen = ((lp || []) as { lesson_id: string }[]).map((r) => r.lesson_id);

    // "anstehend" = Ende + Nachlauf liegt noch in der Zukunft
    const grenze = new Date(Date.now() - NACHLAUF_MINUTEN * 60000).toISOString();
    const oder = [`student_id.eq.${userId}`, `teacher_id.eq.${userId}`];
    if (teilnahmen.length) oder.push(`id.in.(${teilnahmen.join(",")})`);

    const { data } = await sb
      .from("lessons")
      .select("id,title,starts_at,ends_at,kind")
      .gt("ends_at", grenze)
      .or(oder.join(","))
      .order("starts_at", { ascending: true })
      .limit(1);
    return ((data || []) as NextLesson[])[0] || null;
  } catch {
    // Tabelle existiert evtl. noch nicht (Migration nicht ausgeführt) – Kalender soll trotzdem funktionieren
    return null;
  }
}

// --- Zugehörigkeit: gehört ein Nutzer zu einer Stunde? ----------------------
export async function istStundenMitglied(lesson: Lesson, userId: string): Promise<boolean> {
  if (lesson.teacher_id === userId || lesson.student_id === userId) return true;
  const { data } = await service()
    .from("lesson_participants").select("user_id")
    .eq("lesson_id", lesson.id).eq("user_id", userId).maybeSingle();
  return !!data;
}

// --- Daily.co REST API ------------------------------------------------------
const DAILY_API = "https://api.daily.co/v1";

async function dailyFetch(pfad: string, init?: RequestInit): Promise<{ status: number; data: Record<string, unknown> }> {
  const key = process.env.DAILY_API_KEY;
  if (!key) throw new Error("DAILY_API_KEY fehlt in den Umgebungsvariablen");
  const res = await fetch(`${DAILY_API}${pfad}`, {
    ...init,
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
  });
  const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  return { status: res.status, data };
}

// Privaten Raum für eine Stunde anlegen (oder holen, falls er schon existiert).
// Raumname = "stunde-<uuid>" – UUIDs sind nicht erratbar, und der Raum ist
// zusätzlich privat (Beitritt nur mit persönlichem Meeting-Token).
export async function ensureDailyRoom(lesson: Lesson, expUnix: number): Promise<{ name: string; url: string }> {
  const name = `stunde-${lesson.id}`;
  const erstellt = await dailyFetch("/rooms", {
    method: "POST",
    body: JSON.stringify({
      name,
      privacy: "private",
      properties: {
        exp: expUnix,                       // Raum läuft automatisch ab
        enable_screenshare: true,           // Bildschirm teilen
        enable_chat: true,                  // Text-Chat
        enable_prejoin_ui: true,            // Geräte-Check vor dem Beitritt
        enable_network_ui: true,            // Netzwerk-Qualität anzeigen
        enable_noise_cancellation_ui: true, // Hintergrundgeräusche filtern
        lang: "de",
        max_participants: lesson.kind === "einzel" ? 2 : 25,
        geo: "eu-central-1",                // Medienserver: Frankfurt
      },
    }),
  });
  if (erstellt.status === 200 && typeof erstellt.data.url === "string") {
    return { name, url: erstellt.data.url };
  }
  // Raum existiert schon (z. B. zwei Beitritte gleichzeitig) -> Daten holen
  const vorhanden = await dailyFetch(`/rooms/${name}`);
  if (vorhanden.status === 200 && typeof vorhanden.data.url === "string") {
    return { name, url: vorhanden.data.url };
  }
  throw new Error(`Daily-Raum konnte nicht erstellt werden (HTTP ${erstellt.status}): ${JSON.stringify(erstellt.data).slice(0, 200)}`);
}

// Persönliches Meeting-Token für einen Teilnehmer ausstellen
export async function createMeetingToken(roomName: string, userName: string, isOwner: boolean, expUnix: number): Promise<string> {
  const res = await dailyFetch("/meeting-tokens", {
    method: "POST",
    body: JSON.stringify({
      properties: {
        room_name: roomName,
        user_name: userName,
        is_owner: isOwner, // true nur für Kleana (Moderations-Rechte)
        exp: expUnix,
      },
    }),
  });
  if (res.status === 200 && typeof res.data.token === "string") return res.data.token;
  throw new Error(`Meeting-Token konnte nicht erstellt werden (HTTP ${res.status}): ${JSON.stringify(res.data).slice(0, 200)}`);
}
