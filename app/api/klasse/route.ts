// =============================================================================
// POST /api/klasse – die Klassenzimmer-Zentrale (Version 3)
//
// Dauerhafter Chat, Datei-Ablage, Aufgaben-Übersicht und Stunden-Historie.
// Pro Schüler gibt es einen "Raum": Schüler sehen nur ihren eigenen,
// Kleana (admin) wählt aus, wessen Raum sie gerade betreut.
//
// Aufrufe wie bei /api/kalender über {action, token, ...}; Datei-Uploads
// kommen als multipart/form-data. Läuft komplett serverseitig mit dem
// Service-Role-Key; der Storage-Bucket "klassenzimmer" ist privat und wird
// nur über kurzlebige signierte Links gelesen.
// =============================================================================
import { NextResponse } from "next/server";
import { service, userFromToken, getProfile } from "@/lib/kalender";
import { nextLessonFor } from "@/lib/stunden";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BUCKET = "klassenzimmer";
const MAX_DATEI_BYTES = 25 * 1024 * 1024; // 25 MB pro Datei

function fehler(msg: string, code = 400) {
  return NextResponse.json({ ok: false, error: msg }, { status: code });
}
function ok(data: Record<string, unknown> = {}) {
  return NextResponse.json({ ok: true, ...data });
}
const istUuid = (s: unknown): s is string => typeof s === "string" && /^[0-9a-f-]{36}$/i.test(s);

export async function POST(req: Request): Promise<Response> {
  try {
    const contentType = req.headers.get("content-type") || "";

    // ---- Eingaben lesen (JSON oder Datei-Upload) ---------------------------
    let action = "";
    let token = "";
    let body: Record<string, unknown> = {};
    let uploadDatei: File | null = null;
    if (contentType.includes("multipart/form-data")) {
      const form = await req.formData();
      action = String(form.get("action") || "");
      token = String(form.get("token") || "");
      body = { studentId: form.get("studentId") };
      const f = form.get("file");
      if (f instanceof File) uploadDatei = f;
    } else {
      try { const r = await req.json(); if (r && typeof r === "object") body = r as Record<string, unknown>; } catch { /* {} */ }
      action = String(body.action || "");
      token = typeof body.token === "string" ? body.token : "";
    }

    // ---- Login -------------------------------------------------------------
    const user = token ? await userFromToken(token) : null;
    if (!user) return fehler("Bitte melde dich zuerst an.", 401);
    const profil = await getProfile(user.id);
    if (!profil) return fehler("Kein Zugang – bitte Kleana kontaktieren.", 403);
    const istLehrerin = profil.role === "admin";
    const sb = service();

    // Wessen Klassenzimmer? Schüler: immer das eigene. Kleana: wählt per studentId.
    let zielSchueler = user.id;
    if (istLehrerin) {
      if (istUuid(body.studentId)) zielSchueler = body.studentId;
      else zielSchueler = ""; // Kleana ohne Auswahl: erst "bootstrap" liefert die Liste
    }

    // ======================= EINSTIEG =======================================
    if (action === "bootstrap") {
      const out: Record<string, unknown> = { isTeacher: istLehrerin, myName: profil.name };
      if (istLehrerin) {
        const { data } = await sb.from("profiles").select("user_id,name")
          .eq("role", "student").order("name");
        out.students = ((data || []) as { user_id: string; name: string }[])
          .map((p) => ({ id: p.user_id, name: p.name }));
      }
      if (zielSchueler) out.nextLesson = await nextLessonFor(zielSchueler);
      return ok(out);
    }

    if (!zielSchueler) return fehler("Bitte zuerst einen Schüler wählen.");

    // ======================= CHAT ===========================================
    if (action === "messages") {
      const { data: msgs } = await sb.from("class_messages")
        .select("id,sender_id,body,created_at")
        .eq("student_id", zielSchueler)
        .order("created_at", { ascending: false }).limit(100);
      const liste = ((msgs || []) as { id: string; sender_id: string; body: string; created_at: string }[]).reverse();
      const ids = Array.from(new Set(liste.map((m) => m.sender_id)));
      const namen = new Map<string, string>();
      if (ids.length) {
        const { data: profs } = await sb.from("profiles").select("user_id,name").in("user_id", ids);
        ((profs || []) as { user_id: string; name: string }[]).forEach((p) => namen.set(p.user_id, p.name));
      }
      return ok({
        messages: liste.map((m) => ({
          id: m.id, body: m.body, created_at: m.created_at,
          sender: namen.get(m.sender_id) || "Unbekannt", mine: m.sender_id === user.id,
        })),
        nextLesson: await nextLessonFor(zielSchueler), // für die Kopfzeile gleich mitliefern
      });
    }

    if (action === "sendMessage") {
      const text = String(body.body || "").trim().slice(0, 2000);
      if (!text) return fehler("Bitte eine Nachricht eingeben.");
      const { error } = await sb.from("class_messages")
        .insert({ student_id: zielSchueler, sender_id: user.id, body: text });
      if (error) return fehler("Senden fehlgeschlagen: " + error.message);
      return ok();
    }

    // ======================= DATEIEN ========================================
    if (action === "files") {
      const { data } = await sb.from("class_files")
        .select("id,student_id,uploader_id,name,size_bytes,created_at")
        .or(`student_id.eq.${zielSchueler},student_id.is.null`)
        .order("created_at", { ascending: false }).limit(200);
      return ok({
        files: ((data || []) as { id: string; student_id: string | null; name: string; size_bytes: number; created_at: string }[])
          .map((f) => ({ id: f.id, name: f.name, size: f.size_bytes, created_at: f.created_at, fuerAlle: f.student_id === null })),
      });
    }

    if (action === "upload") {
      if (!istLehrerin) return fehler("Nur Kleana kann Dateien hochladen.", 403);
      if (!uploadDatei) return fehler("Keine Datei erhalten.");
      if (uploadDatei.size > MAX_DATEI_BYTES) return fehler("Die Datei ist größer als 25 MB.");
      // 'alle' = Datei für alle Schüler sichtbar
      const fuerAlle = body.studentId === "alle";
      if (!fuerAlle && !istUuid(body.studentId)) return fehler("Bitte zuerst einen Schüler wählen.");
      const sauberName = uploadDatei.name.replace(/[^\wäöüÄÖÜß.\- ]+/g, "_").slice(0, 120) || "datei";
      const pfad = `${fuerAlle ? "alle" : body.studentId}/${crypto.randomUUID()}-${sauberName}`;
      const bytes = Buffer.from(await uploadDatei.arrayBuffer());
      const { error: upErr } = await sb.storage.from(BUCKET)
        .upload(pfad, bytes, { contentType: uploadDatei.type || "application/octet-stream" });
      if (upErr) return fehler("Hochladen fehlgeschlagen: " + upErr.message);
      const { error } = await sb.from("class_files").insert({
        student_id: fuerAlle ? null : body.studentId, uploader_id: user.id,
        name: sauberName, storage_path: pfad, size_bytes: uploadDatei.size,
      });
      if (error) return fehler("Speichern fehlgeschlagen: " + error.message);
      return ok({ message: "Datei hochgeladen ✓" });
    }

    if (action === "fileUrl") {
      if (!istUuid(body.fileId)) return fehler("Datei nicht gefunden.", 404);
      const { data: f } = await sb.from("class_files")
        .select("student_id,storage_path,name").eq("id", body.fileId).maybeSingle();
      if (!f) return fehler("Datei nicht gefunden.", 404);
      const file = f as { student_id: string | null; storage_path: string; name: string };
      if (!istLehrerin && file.student_id !== null && file.student_id !== user.id) {
        return fehler("Kein Zugriff auf diese Datei.", 403);
      }
      const { data: signed, error } = await sb.storage.from(BUCKET)
        .createSignedUrl(file.storage_path, 3600, { download: file.name });
      if (error || !signed?.signedUrl) return fehler("Link konnte nicht erstellt werden.");
      return ok({ url: signed.signedUrl });
    }

    if (action === "deleteFile") {
      if (!istLehrerin) return fehler("Nur Kleana kann Dateien löschen.", 403);
      if (!istUuid(body.fileId)) return fehler("Datei nicht gefunden.", 404);
      const { data: f } = await sb.from("class_files")
        .select("storage_path").eq("id", body.fileId).maybeSingle();
      if (!f) return fehler("Datei nicht gefunden.", 404);
      await sb.storage.from(BUCKET).remove([(f as { storage_path: string }).storage_path]);
      await sb.from("class_files").delete().eq("id", body.fileId);
      return ok({ message: "Datei gelöscht." });
    }

    // ======================= STUNDEN ========================================
    if (action === "lessons") {
      const grenze = new Date(Date.now() - 30 * 60000).toISOString();
      const [{ data: kommend }, { data: vergangen }] = await Promise.all([
        sb.from("lessons").select("id,title,subject,starts_at,ends_at")
          .eq("student_id", zielSchueler).gt("ends_at", grenze)
          .order("starts_at", { ascending: true }).limit(5),
        sb.from("lessons").select("id,title,subject,starts_at,ends_at")
          .eq("student_id", zielSchueler).lte("ends_at", grenze)
          .order("starts_at", { ascending: false }).limit(10),
      ]);
      type L = { id: string; title: string; subject: string | null; starts_at: string; ends_at: string };
      const alle = ([...(kommend || []), ...(vergangen || [])] as L[]);
      const notizen = new Map<string, { summary: string; homework: string }>();
      if (alle.length) {
        const { data: ns } = await sb.from("lesson_notes")
          .select("lesson_id,summary,homework").in("lesson_id", alle.map((l) => l.id));
        ((ns || []) as { lesson_id: string; summary: string; homework: string }[])
          .forEach((n) => notizen.set(n.lesson_id, { summary: n.summary, homework: n.homework }));
      }
      const mitNotizen = (l: L) => ({ ...l, notes: notizen.get(l.id) || null });
      return ok({
        upcoming: ((kommend || []) as L[]).map(mitNotizen),
        past: ((vergangen || []) as L[]).map(mitNotizen),
      });
    }

    // ======================= AUFGABEN / PUNKTE ==============================
    if (action === "exercises") {
      const [{ data: rws }, { data: ans }] = await Promise.all([
        sb.from("student_rewards").select("points,sticker")
          .eq("user_id", zielSchueler).order("created_at", { ascending: false }).limit(200),
        sb.from("lesson_answers")
          .select("answer,is_correct,answered_at,lesson_exercises(question)")
          .eq("user_id", zielSchueler).order("answered_at", { ascending: false }).limit(10),
      ]);
      const belohnungen = (rws || []) as { points: number; sticker: string | null }[];
      return ok({
        points: belohnungen.reduce((s, r) => s + r.points, 0),
        stickers: belohnungen.filter((r) => r.sticker).map((r) => r.sticker).slice(0, 24),
        recent: ((ans || []) as unknown as { answer: string; is_correct: boolean | null; answered_at: string; lesson_exercises: { question: string } | null }[])
          .map((a) => ({ question: a.lesson_exercises?.question || "Aufgabe", answer: a.answer, is_correct: a.is_correct, answered_at: a.answered_at })),
      });
    }

    return fehler("Unbekannte Aktion.");
  } catch (e) {
    console.error("klasse-Fehler:", e);
    return fehler("Klassenzimmer nicht erreichbar. Wurde die Migration klassenzimmer_v3_schema.sql in Supabase ausgeführt?", 500);
  }
}
