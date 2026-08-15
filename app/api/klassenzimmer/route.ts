// =============================================================================
// POST /api/klassenzimmer  – alle Aktionen des Klassenzimmers (Version 2)
//
// Live-Übungen, Whiteboard (Tafel), Stundenzettel und Belohnungen.
// Arbeitet wie /api/kalender über {action, token, lessonId, ...} und läuft
// komplett serverseitig mit dem Service-Role-Key. Die Clients fragen den
// Zustand alle paar Sekunden ab ("Polling") – robust auf jedem Gerät, ohne
// zusätzliche Browser-Schlüssel.
// =============================================================================
import { NextResponse } from "next/server";
import { service, userFromToken, getProfile } from "@/lib/kalender";
import { istStundenMitglied, deleteDailyRoom, type Lesson } from "@/lib/stunden";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function fehler(msg: string, code = 400) {
  return NextResponse.json({ ok: false, error: msg }, { status: code });
}
function ok(data: Record<string, unknown> = {}) {
  return NextResponse.json({ ok: true, ...data });
}

// Antworten fürs automatische Prüfen vereinheitlichen ("3,5 " -> "3.5")
function normalisiere(s: string): string {
  return s.trim().toLowerCase().replace(",", ".").replace(/\s+/g, " ");
}

const PUNKTE_RICHTIG = 10; // Punkte für eine richtig gelöste Übung

type ExerciseRow = {
  id: string; lesson_id: string; question: string; kind: "freitext" | "auswahl";
  options: string[] | null; correct_answer: string | null; explanation: string | null;
  status: "aktiv" | "beendet"; created_at: string;
};
type AnswerRow = { exercise_id: string; user_id: string; answer: string; is_correct: boolean | null; answered_at: string };

export async function POST(req: Request): Promise<Response> {
  let body: Record<string, unknown> = {};
  try { const r = await req.json(); if (r && typeof r === "object") body = r as Record<string, unknown>; } catch { /* {} */ }
  const action = String(body.action || "");
  const token = typeof body.token === "string" ? body.token : "";
  const lessonId = typeof body.lessonId === "string" ? body.lessonId : "";

  try {
    // ---- Login + Stunde + Zugehörigkeit (für alle Aktionen gleich) ---------
    const user = token ? await userFromToken(token) : null;
    if (!user) return fehler("Bitte melde dich zuerst an.", 401);
    const profil = await getProfile(user.id);
    if (!profil) return fehler("Kein Zugang – bitte Kleana kontaktieren.", 403);

    if (!/^[0-9a-f-]{36}$/i.test(lessonId)) return fehler("Stunde nicht gefunden.", 404);
    const sb = service();
    const { data: stunde } = await sb.from("lessons").select("*").eq("id", lessonId).maybeSingle();
    if (!stunde) return fehler("Diese Stunde gibt es nicht (mehr).", 404);
    const lesson = stunde as Lesson;

    const istLehrerin = lesson.teacher_id === user.id || profil.role === "admin";
    if (!istLehrerin && !(await istStundenMitglied(lesson, user.id))) {
      return fehler("Du gehörst nicht zu dieser Stunde.", 403);
    }

    // ======================= CALL FÜR ALLE BEENDEN ==========================
    // Nur Kleana: löscht den Daily-Raum – alle Teilnehmer werden getrennt.
    // Die Stunde/der Call selbst bleibt bestehen; beim nächsten Beitritt
    // wird bei Bedarf ein frischer Raum erstellt.
    if (action === "endCall") {
      if (!istLehrerin) return fehler("Nur Kleana kann den Call für alle beenden.", 403);
      if (lesson.daily_room_name) {
        try { await deleteDailyRoom(lesson.daily_room_name); }
        catch { return fehler("Der Call konnte nicht beendet werden. Bitte versuche es gleich noch einmal."); }
      }
      await sb.from("lessons").update({ daily_room_name: null, daily_room_url: null }).eq("id", lessonId);
      return ok({ message: "Call für alle beendet." });
    }

    // ======================= ZUSTAND ABFRAGEN (Polling) =====================
    if (action === "state") {
      // Neueste Übung der Stunde
      const { data: exs } = await sb.from("lesson_exercises").select("*")
        .eq("lesson_id", lessonId).order("created_at", { ascending: false }).limit(1);
      const uebung = ((exs || []) as ExerciseRow[])[0] || null;

      // Antworten zur Übung
      let antworten: AnswerRow[] = [];
      if (uebung) {
        const { data: ans } = await sb.from("lesson_answers").select("*").eq("exercise_id", uebung.id);
        antworten = (ans || []) as AnswerRow[];
      }
      const meine = uebung ? antworten.find((a) => a.user_id === user.id) || null : null;

      // Stundenzettel
      const { data: zettel } = await sb.from("lesson_notes")
        .select("summary,homework,updated_at").eq("lesson_id", lessonId).maybeSingle();

      const out: Record<string, unknown> = {
        notes: zettel || { summary: "", homework: "" },
      };

      if (uebung) {
        const beendet = uebung.status === "beendet";
        out.exercise = {
          id: uebung.id, question: uebung.question, kind: uebung.kind,
          options: uebung.options, status: uebung.status,
          // Lösung + Erklärung sehen Schüler erst nach dem Beenden
          correct: istLehrerin || beendet ? uebung.correct_answer : null,
          explanation: istLehrerin || beendet ? uebung.explanation : null,
        };
        out.answeredCount = antworten.length;
        out.myAnswer = meine ? { answer: meine.answer, is_correct: meine.is_correct } : null;
        if (istLehrerin || beendet) {
          // Namen für die Ergebnisliste
          const { data: profs } = await sb.from("profiles").select("user_id,name");
          const namen = new Map<string, string>();
          ((profs || []) as { user_id: string; name: string }[]).forEach((p) => namen.set(p.user_id, p.name));
          out.results = antworten
            .sort((a, b) => a.answered_at.localeCompare(b.answered_at))
            .map((a) => ({ name: namen.get(a.user_id) || "Schüler", answer: a.answer, is_correct: a.is_correct, mine: a.user_id === user.id }));
        }
      } else {
        out.exercise = null;
      }

      // Belohnungen
      if (istLehrerin) {
        // Teilnehmer-Liste + Punktestand für die Belohnungs-Knöpfe
        const ids = new Set<string>();
        if (lesson.student_id) ids.add(lesson.student_id);
        const { data: lps } = await sb.from("lesson_participants").select("user_id").eq("lesson_id", lessonId);
        ((lps || []) as { user_id: string }[]).forEach((r) => ids.add(r.user_id));
        const idList = Array.from(ids);
        const studenten: { id: string; name: string; points: number }[] = [];
        if (idList.length) {
          const [{ data: profs }, { data: rws }] = await Promise.all([
            sb.from("profiles").select("user_id,name").in("user_id", idList),
            sb.from("student_rewards").select("user_id,points").in("user_id", idList),
          ]);
          const punkte = new Map<string, number>();
          ((rws || []) as { user_id: string; points: number }[]).forEach((r) =>
            punkte.set(r.user_id, (punkte.get(r.user_id) || 0) + r.points));
          ((profs || []) as { user_id: string; name: string }[]).forEach((p) =>
            studenten.push({ id: p.user_id, name: p.name, points: punkte.get(p.user_id) || 0 }));
        }
        out.students = studenten;
      } else {
        const { data: rws } = await sb.from("student_rewards")
          .select("points,sticker,reason,created_at").eq("user_id", user.id)
          .order("created_at", { ascending: false }).limit(60);
        const liste = (rws || []) as { points: number; sticker: string | null }[];
        out.rewards = {
          points: liste.reduce((s, r) => s + r.points, 0),
          stickers: liste.filter((r) => r.sticker).map((r) => r.sticker).slice(0, 24),
        };
      }
      return ok({ isTeacher: istLehrerin, ...out });
    }

    // ======================= ÜBUNGEN =======================================
    if (action === "exerciseStart") {
      if (!istLehrerin) return fehler("Nur Kleana kann Übungen starten.", 403);
      const question = String(body.question || "").trim().slice(0, 2000);
      if (!question) return fehler("Bitte eine Frage eingeben.");
      const kind = body.kind === "auswahl" ? "auswahl" : "freitext";
      let options: string[] | null = null;
      if (kind === "auswahl") {
        options = Array.isArray(body.options)
          ? (body.options as unknown[]).map((o) => String(o).slice(0, 300)).filter(Boolean).slice(0, 6)
          : null;
        if (!options || options.length < 2) return fehler("Bitte mindestens 2 Antwortmöglichkeiten angeben.");
      }
      const correct = typeof body.correct === "string" && body.correct.trim() ? String(body.correct).slice(0, 300) : null;
      const explanation = typeof body.explanation === "string" && body.explanation.trim() ? String(body.explanation).slice(0, 2000) : null;
      // Laufende Übung automatisch beenden (ohne Punkte – Kleana hat sie übersprungen)
      await sb.from("lesson_exercises").update({ status: "beendet" }).eq("lesson_id", lessonId).eq("status", "aktiv");
      const { error } = await sb.from("lesson_exercises")
        .insert({ lesson_id: lessonId, question, kind, options, correct_answer: correct, explanation });
      if (error) return fehler("Übung konnte nicht gestartet werden: " + error.message);
      return ok({ message: "Übung gestartet!" });
    }

    if (action === "exerciseEnd") {
      if (!istLehrerin) return fehler("Nur Kleana kann Übungen beenden.", 403);
      const { data: exs } = await sb.from("lesson_exercises").select("*")
        .eq("lesson_id", lessonId).eq("status", "aktiv").limit(1);
      const uebung = ((exs || []) as ExerciseRow[])[0];
      if (!uebung) return fehler("Es läuft gerade keine Übung.");
      await sb.from("lesson_exercises").update({ status: "beendet" }).eq("id", uebung.id);
      // Punkte für richtige Antworten gutschreiben (einmalig beim Beenden)
      const { data: ans } = await sb.from("lesson_answers").select("user_id,is_correct").eq("exercise_id", uebung.id);
      const richtige = ((ans || []) as { user_id: string; is_correct: boolean | null }[]).filter((a) => a.is_correct === true);
      if (richtige.length) {
        await sb.from("student_rewards").insert(richtige.map((a) => ({
          user_id: a.user_id, lesson_id: lessonId, points: PUNKTE_RICHTIG,
          sticker: "🐙", reason: "Übung richtig gelöst",
        })));
      }
      return ok({ message: "Übung beendet." });
    }

    if (action === "answer") {
      const { data: exs } = await sb.from("lesson_exercises").select("*")
        .eq("lesson_id", lessonId).eq("status", "aktiv").limit(1);
      const uebung = ((exs || []) as ExerciseRow[])[0];
      if (!uebung) return fehler("Diese Übung ist schon beendet.");
      const answer = String(body.answer || "").trim().slice(0, 1000);
      if (!answer) return fehler("Bitte eine Antwort eingeben.");
      const is_correct = uebung.correct_answer ? normalisiere(answer) === normalisiere(uebung.correct_answer) : null;
      const { error } = await sb.from("lesson_answers")
        .upsert({ exercise_id: uebung.id, user_id: user.id, answer, is_correct, answered_at: new Date().toISOString() },
          { onConflict: "exercise_id,user_id" });
      if (error) return fehler("Antwort konnte nicht gespeichert werden: " + error.message);
      return ok({ message: "Antwort gespeichert ✓" });
    }

    // Zufällige Frage aus der Lernflix-Quiz-Bank als Vorlage holen
    if (action === "exerciseFromQuiz") {
      if (!istLehrerin) return fehler("Nur Kleana kann Fragen ziehen.", 403);
      let q = sb.from("quiz_fragen").select("frage,antworten,richtig,erklaerung");
      const fach = body.fach === "physik" ? "physik" : body.fach === "mathe" ? "mathe" : null;
      if (fach) q = q.eq("fach", fach);
      const klasse = Number(body.klasse);
      if (klasse >= 1 && klasse <= 13) q = q.eq("klasse", klasse);
      if (typeof body.thema === "string" && body.thema.trim()) q = q.eq("thema", body.thema.trim());
      const { data: fragen } = await q.limit(50);
      const liste = (fragen || []) as { frage: string; antworten: string[]; richtig: number; erklaerung: string | null }[];
      if (!liste.length) return fehler("Keine passende Frage in der Quiz-Bank gefunden. Probiere andere Filter.");
      const f = liste[Math.floor(Math.random() * liste.length)];
      return ok({ draft: { question: f.frage, kind: "auswahl", options: f.antworten, correct: f.antworten[f.richtig] ?? "", explanation: f.erklaerung || "" } });
    }

    if (action === "quizThemes") {
      if (!istLehrerin) return fehler("Nur für Kleana.", 403);
      let q = sb.from("quiz_fragen").select("thema");
      const fach = body.fach === "physik" ? "physik" : body.fach === "mathe" ? "mathe" : null;
      if (fach) q = q.eq("fach", fach);
      const klasse = Number(body.klasse);
      if (klasse >= 1 && klasse <= 13) q = q.eq("klasse", klasse);
      const { data } = await q.limit(1000);
      const themen = Array.from(new Set(((data || []) as { thema: string }[]).map((r) => r.thema))).sort();
      return ok({ themes: themen });
    }

    // ======================= STUNDENZETTEL =================================
    if (action === "notesSave") {
      if (!istLehrerin) return fehler("Nur Kleana kann den Stundenzettel bearbeiten.", 403);
      const summary = String(body.summary ?? "").slice(0, 4000);
      const homework = String(body.homework ?? "").slice(0, 4000);
      const { error } = await sb.from("lesson_notes")
        .upsert({ lesson_id: lessonId, summary, homework, updated_at: new Date().toISOString() }, { onConflict: "lesson_id" });
      if (error) return fehler("Speichern fehlgeschlagen: " + error.message);
      return ok({ message: "Stundenzettel gespeichert ✓" });
    }

    // ======================= BELOHNUNG =====================================
    if (action === "award") {
      if (!istLehrerin) return fehler("Nur Kleana kann Belohnungen vergeben.", 403);
      const studentId = String(body.studentId || "");
      if (!/^[0-9a-f-]{36}$/i.test(studentId)) return fehler("Ungültiger Schüler.");
      const sticker = typeof body.sticker === "string" ? body.sticker.slice(0, 8) : "⭐";
      const points = Math.max(0, Math.min(100, Number(body.points) || 5));
      const { error } = await sb.from("student_rewards")
        .insert({ user_id: studentId, lesson_id: lessonId, points, sticker, reason: "Von Kleana vergeben" });
      if (error) return fehler("Belohnung fehlgeschlagen: " + error.message);
      return ok({ message: `${sticker} vergeben!` });
    }

    return fehler("Unbekannte Aktion.");
  } catch (e) {
    // Häufigste Ursache: Migration klassenzimmer_v2_schema.sql wurde noch nicht ausgeführt
    console.error("klassenzimmer-Fehler:", e);
    return fehler("Klassenzimmer-Daten nicht erreichbar. Wurde die Migration klassenzimmer_v2_schema.sql in Supabase ausgeführt?", 500);
  }
}
