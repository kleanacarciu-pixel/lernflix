// =============================================================================
// Virtuelles Klassenzimmer – gemeinsame Server-Logik (Daily.co + Supabase)
// Wird von app/api/lessons/[lessonId]/join/route.ts und app/api/kalender
// genutzt. NUR serverseitig! (DAILY_API_KEY darf nie im Browser landen.)
// =============================================================================
import { createHmac } from "node:crypto";
import { service, berlinInstant, addDaysStr, weekdayOf } from "@/lib/kalender";

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
  mode?: "online" | "vor_ort";
  daily_room_name: string | null;
  daily_room_url: string | null;
};

export type NextLesson = Pick<Lesson, "id" | "title" | "starts_at" | "ends_at" | "kind"> & { mode?: string | null };

// --- Nächste anstehende Stunde eines Nutzers (für den Kalender-Button) ------
export async function nextLessonFor(userId: string): Promise<NextLesson | null> {
  try {
    const sb = service();
    // Teilnahmen an Gruppenstunden/Webinaren einsammeln
    const { data: lp } = await sb.from("lesson_participants").select("lesson_id").eq("user_id", userId);
    const teilnahmen = ((lp || []) as { lesson_id: string }[]).map((r) => r.lesson_id);

    // "anstehend" = Ende liegt noch in der Zukunft. (Der Videoraum bleibt
    // trotzdem 30 Min. nach Ende offen – nur die Anzeige verschwindet pünktlich,
    // damit keine vergangene Stunde als "Nächste Stunde" hängen bleibt.)
    const grenze = new Date().toISOString();
    const oder = [`student_id.eq.${userId}`, `teacher_id.eq.${userId}`];
    if (teilnahmen.length) oder.push(`id.in.(${teilnahmen.join(",")})`);

    const { data } = await sb
      .from("lessons")
      .select("id,title,starts_at,ends_at,kind,mode")
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

// --- Kalender -> Klassenzimmer: Stunden automatisch anlegen -----------------
// Erzeugt für die nächsten SYNC_TAGE Tage aus aktiven festen Terminen und
// bestätigten Einzel-Buchungen die passenden lessons-Zeilen – inklusive Modus
// (online/vor Ort, Pro-Datum-Umstellungen gewinnen). Absagen räumen die
// zugehörige Stunde wieder ab. Dank Unique-Constraint (student_id, starts_at)
// entstehen nie Doppel; von Hand angelegte Stunden werden nicht angefasst
// (Insert mit "do nothing", gelöscht wird nur bei vorliegender Absage).
// Fehlt die V4-Migration, passiert still gar nichts.
export const SYNC_TAGE = 14;

function heuteBerlin(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Europe/Berlin" });
}

// Drossel: der Sync kostet mehrere Datenbank-Runden – innerhalb einer
// Minute reicht ein Lauf pro Server-Instanz. force=true (z. B. direkt nach
// einer Buchung/Umstellung) überspringt die Drossel.
let letzterSyncMs = 0;

export async function syncLessons(force = false): Promise<void> {
  if (!force && Date.now() - letzterSyncMs < 60_000) return;
  letzterSyncMs = Date.now();
  try {
    const sb = service();
    const von = heuteBerlin();
    const bis = addDaysStr(von, SYNC_TAGE);

    const [{ data: adminRow }, fxRes, apRes, ovRes] = await Promise.all([
      sb.from("profiles").select("user_id").eq("role", "admin").limit(1).maybeSingle(),
      sb.from("fixed_slots").select("student_id,weekday,hour,mode,dauer_min").eq("status", "aktiv"),
      sb.from("appointments").select("student_id,slot_date,hour,kind,status,mode,dauer_min")
        .gte("slot_date", von).lte("slot_date", bis),
      sb.from("slot_mode_overrides").select("student_id,slot_date,hour,mode")
        .gte("slot_date", von).lte("slot_date", bis),
    ]);
    const teacherId = (adminRow as { user_id: string } | null)?.user_id;
    if (!teacherId) return;

    const overrides = new Map<string, string>();
    ((ovRes.data || []) as { student_id: string; slot_date: string; hour: number; mode: string }[])
      .forEach((o) => overrides.set(`${o.student_id}|${o.slot_date}-${Number(o.hour)}`, o.mode));
    const appts = (apRes.data || []) as { student_id: string | null; slot_date: string; hour: number; kind: string; status: string; mode: string | null; dauer_min: number | null }[];
    // Absagen = eigene Absage-Zeilen UND abgesagte Einzel-Buchungen; eine
    // spätere Neu-Buchung desselben Slots (bestätigt) hebt die Absage auf
    const absagen = new Set(appts
      .filter((a) => a.kind === "absage" || (a.kind === "einzel" && a.status === "abgesagt"))
      .map((a) => `${a.student_id}|${a.slot_date}-${Number(a.hour)}`));
    appts.filter((a) => a.kind === "einzel" && a.status === "bestaetigt" && a.student_id)
      .forEach((a) => absagen.delete(`${a.student_id}|${a.slot_date}-${Number(a.hour)}`));

    // Kandidaten einsammeln: feste Termine pro Tag + bestätigte Einzel-Buchungen
    type Kandidat = { studentId: string; startsAt: string; endsAt: string; mode: string };
    const kandidaten = new Map<string, Kandidat>();
    const merken = (studentId: string, date: string, hour: number, grundModus: string | null, dauerMin: number) => {
      const key = `${studentId}|${date}-${Number(hour)}`;
      if (absagen.has(key)) return;
      const start = berlinInstant(date, Number(hour));
      if (start < Date.now() - 60 * 60000) return; // Vergangenes nicht mehr anlegen
      kandidaten.set(key, {
        studentId,
        startsAt: new Date(start).toISOString(),
        endsAt: new Date(start + dauerMin * 60000).toISOString(),
        mode: overrides.get(key) ?? grundModus ?? "online",
      });
    };
    const fixe = (fxRes.data || []) as { student_id: string; weekday: number; hour: number; mode: string | null; dauer_min: number | null }[];
    for (let i = 0; i <= SYNC_TAGE; i++) {
      const date = addDaysStr(von, i);
      const wd = weekdayOf(date);
      fixe.forEach((f) => { if (f.weekday === wd) merken(f.student_id, date, f.hour, f.mode, Number(f.dauer_min) || 60); });
    }
    appts.filter((a) => a.kind === "einzel" && a.status === "bestaetigt" && a.student_id)
      .forEach((a) => merken(a.student_id!, a.slot_date, a.hour, a.mode, Number(a.dauer_min) || 60));

    // Abgleichen mit dem, was schon existiert
    const vonIso = new Date(berlinInstant(von, 0)).toISOString();
    const { data: existRows } = await sb.from("lessons")
      .select("id,student_id,starts_at,mode")
      .gte("starts_at", vonIso).not("student_id", "is", null);
    const existing = new Map<string, { id: string; mode: string }>();
    ((existRows || []) as { id: string; student_id: string; starts_at: string; mode: string }[])
      .forEach((l) => existing.set(`${l.student_id}|${new Date(l.starts_at).toISOString()}`, { id: l.id, mode: l.mode }));

    const neu: Record<string, unknown>[] = [];
    for (const k of kandidaten.values()) {
      const vorhanden = existing.get(`${k.studentId}|${k.startsAt}`);
      if (!vorhanden) {
        neu.push({ teacher_id: teacherId, student_id: k.studentId, starts_at: k.startsAt, ends_at: k.endsAt, mode: k.mode });
      } else if (vorhanden.mode !== k.mode) {
        await sb.from("lessons").update({ mode: k.mode }).eq("id", vorhanden.id);
      }
    }
    if (neu.length) {
      await sb.from("lessons").upsert(neu, { onConflict: "student_id,starts_at", ignoreDuplicates: true });
    }

    // Abgesagte Stunden wieder abräumen (nur exakt passende, künftige Termine)
    for (const key of absagen) {
      const [sid, rest] = key.split("|");
      const dash = rest.lastIndexOf("-");
      const date = rest.slice(0, dash); const hour = Number(rest.slice(dash + 1));
      if (!sid || sid === "null" || !date || Number.isNaN(hour)) continue;
      const startIso = new Date(berlinInstant(date, hour)).toISOString();
      const vorhanden = existing.get(`${sid}|${startIso}`);
      if (vorhanden) await sb.from("lessons").delete().eq("id", vorhanden.id);
    }
  } catch {
    // V4-Migration fehlt noch oder DB kurz nicht erreichbar – nichts kaputt machen
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

// --- Gast-Links (Probestunde / Masterclass) ---------------------------------
// Gäste ohne Konto treten über /gast/<lessonId>?k=<schluessel> bei. Der
// Schlüssel ist ein HMAC über die Stunden-ID mit dem Service-Role-Key als
// Geheimnis – nicht erratbar, ohne neue Umgebungsvariable und ohne Migration.
export function gastSchluessel(lessonId: string): string {
  const geheim = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  return createHmac("sha256", geheim).update(`gast:${lessonId}`).digest("hex").slice(0, 32);
}
export function gastLink(lessonId: string, baseUrl: string): string {
  return `${baseUrl.replace(/\/$/, "")}/gast/${lessonId}?k=${gastSchluessel(lessonId)}`;
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
        // Einzel: 2 Plätze. Gruppe/Webinar (Masterclass): keine eigene
        // Grenze setzen – es gilt das Maximum des Daily-Tarifs
        ...(lesson.kind === "einzel" ? { max_participants: 2 } : {}),
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

// Raum löschen = Call für ALLE beenden (alle Teilnehmer fliegen raus).
// Beim nächsten Beitritt wird bei Bedarf einfach ein neuer Raum erstellt.
export async function deleteDailyRoom(roomName: string): Promise<void> {
  const res = await dailyFetch(`/rooms/${roomName}`, { method: "DELETE" });
  // 404 = Raum existiert nicht mehr – das ist für uns genauso "beendet"
  if (res.status !== 200 && res.status !== 404) {
    throw new Error(`Daily-Raum konnte nicht beendet werden (HTTP ${res.status})`);
  }
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
