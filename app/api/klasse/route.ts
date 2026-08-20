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
import { nextLessonFor, syncLessons } from "@/lib/stunden";
import { kiBereit, kiText, BERICHT_SYSTEM, QUIZ_SYSTEM } from "@/lib/ki";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60; // KI-Berichte dürfen bis zu einer Minute schreiben

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
      body = { studentId: form.get("studentId"), category: form.get("category"), beschreibung: form.get("beschreibung") };
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
      await syncLessons(); // Kalender -> Klassenzimmer synchron halten (gedrosselt, meist sofort fertig)
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

    // ======================= LERNMATERIAL (für alle) ========================
    // Wie ein schwarzes Brett: Kleana lädt EINMAL hoch, alle Schüler sehen es
    // in ihrem Klassenzimmer – unabhängig davon, welcher Schüler gewählt ist.
    if (action === "material") {
      const { data } = await sb.from("class_files").select("*")
        .is("student_id", null)
        .order("created_at", { ascending: false }).limit(200);
      return ok({
        files: ((data || []) as { id: string; name: string; size_bytes: number; created_at: string; beschreibung?: string | null }[])
          .map((f) => ({ id: f.id, name: f.name, size: f.size_bytes, created_at: f.created_at, beschreibung: f.beschreibung || null })),
      });
    }

    if (!zielSchueler) return fehler("Bitte zuerst einen Schüler wählen.");

    // ======================= CHAT ===========================================
    if (action === "messages") {
      // "*" statt fester Spalten: datei_name kommt erst mit der V6-Migration
      const { data: msgs } = await sb.from("class_messages")
        .select("*")
        .eq("student_id", zielSchueler)
        .order("created_at", { ascending: false }).limit(100);
      const liste = ((msgs || []) as { id: string; sender_id: string; body: string; created_at: string; datei_name?: string | null }[]).reverse();
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
          datei: m.datei_name || null,
        })),
        nextLesson: await nextLessonFor(zielSchueler), // für die Kopfzeile gleich mitliefern
      });
    }

    // Foto/Datei im Chat verschicken – dürfen BEIDE (auch Schüler, z. B.
    // ein Foto der Hausaufgabe). Landet als Nachricht mit Anhang.
    if (action === "chatUpload") {
      if (!uploadDatei) return fehler("Keine Datei erhalten.");
      if (uploadDatei.size > MAX_DATEI_BYTES) return fehler("Die Datei ist größer als 25 MB.");
      const sauberName = uploadDatei.name.replace(/[^\wäöüÄÖÜß.\- ]+/g, "_").slice(0, 120) || "datei";
      const pfad = `chat/${zielSchueler}/${crypto.randomUUID()}-${sauberName}`;
      const bytes = Buffer.from(await uploadDatei.arrayBuffer());
      const { error: upErr } = await sb.storage.from(BUCKET)
        .upload(pfad, bytes, { contentType: uploadDatei.type || "application/octet-stream" });
      if (upErr) return fehler("Hochladen fehlgeschlagen: " + upErr.message);
      const { error } = await sb.from("class_messages")
        .insert({ student_id: zielSchueler, sender_id: user.id, body: "", datei_pfad: pfad, datei_name: sauberName });
      if (error) return fehler(/datei_/.test(error.message)
        ? "Bitte zuerst das SQL „klassenzimmer_v6“ in Supabase ausführen (steht im Chat mit Claude)."
        : "Senden fehlgeschlagen: " + error.message);
      return ok({ message: "Gesendet ✓" });
    }

    // Signierter Link zum Öffnen eines Chat-Anhangs
    if (action === "chatFileUrl") {
      if (!istUuid(body.messageId)) return fehler("Nicht gefunden.", 404);
      const { data: m } = await sb.from("class_messages")
        .select("student_id,datei_pfad,datei_name").eq("id", body.messageId).maybeSingle();
      const msg = m as { student_id: string; datei_pfad: string | null; datei_name: string | null } | null;
      if (!msg?.datei_pfad) return fehler("Nicht gefunden.", 404);
      if (!istLehrerin && msg.student_id !== user.id) return fehler("Kein Zugriff.", 403);
      const { data: signed, error } = await sb.storage.from(BUCKET)
        .createSignedUrl(msg.datei_pfad, 3600, { download: msg.datei_name || undefined });
      if (error || !signed?.signedUrl) return fehler("Link konnte nicht erstellt werden.");
      return ok({ url: signed.signedUrl });
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
      // "*" statt fester Spalten: category kommt erst mit der V5-Migration.
      // Nur die persönlichen Dateien des Schülers – Material für alle liegt
      // im eigenen Bereich "Lernmaterial".
      const { data } = await sb.from("class_files")
        .select("*")
        .eq("student_id", zielSchueler)
        .order("created_at", { ascending: false }).limit(200);
      return ok({
        files: ((data || []) as { id: string; student_id: string | null; name: string; size_bytes: number; created_at: string; category?: string | null }[])
          .map((f) => ({ id: f.id, name: f.name, size: f.size_bytes, created_at: f.created_at, fuerAlle: false, category: f.category || "sonstiges" })),
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
      const kategorie = ["arbeitsblatt", "hausaufgabe", "sonstiges", "lernmaterial"].includes(String(body.category)) ? String(body.category) : "sonstiges";
      const beschreibung = typeof body.beschreibung === "string" && body.beschreibung.trim() ? body.beschreibung.trim().slice(0, 500) : null;
      let { error } = await sb.from("class_files").insert({
        student_id: fuerAlle ? null : body.studentId, uploader_id: user.id,
        name: sauberName, storage_path: pfad, size_bytes: uploadDatei.size, category: kategorie, beschreibung,
      });
      // Ohne V5/V6-Migration fehlen die Spalten category/beschreibung noch
      if (error && /category|beschreibung/.test(error.message)) {
        ({ error } = await sb.from("class_files").insert({
          student_id: fuerAlle ? null : body.studentId, uploader_id: user.id,
          name: sauberName, storage_path: pfad, size_bytes: uploadDatei.size,
        }));
      }
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

    // ======================= KI-STUNDENBERICHTE =============================
    // Kleana tippt kurz, was in der Stunde gemacht wurde – die KI schreibt
    // daraus einen Bericht (Erklärung, Beispiele, Hausaufgaben) und legt ihn
    // im Klassenzimmer des Schülers ab. Dazu: Wiederholungs-Quiz aus den
    // letzten Berichten.
    if (action === "berichte") {
      const { data } = await sb.from("lesson_reports")
        .select("id,titel,art,inhalt,created_at" + (istLehrerin ? ",eingabe" : ""))
        .eq("student_id", zielSchueler)
        .order("created_at", { ascending: false }).limit(100);
      return ok({ reports: data || [] });
    }

    if (action === "berichtErstellen") {
      if (!istLehrerin) return fehler("Nur Kleana kann Berichte erstellen.", 403);
      if (!kiBereit()) return fehler("Der KI-Schlüssel fehlt noch: Bitte ANTHROPIC_API_KEY in Vercel eintragen (Anleitung im Chat mit Claude).");
      const eingabe = String(body.eingabe || "").trim().slice(0, 4000);
      if (eingabe.length < 10) return fehler("Bitte kurz beschreiben, was ihr in der Stunde gemacht habt (ein paar Stichpunkte reichen).");
      const profSchueler = await getProfile(zielSchueler);
      let inhalt = "";
      try {
        inhalt = await kiText(BERICHT_SYSTEM,
          `Schüler/in: ${profSchueler?.name || "unbekannt"}\nDatum der Stunde: ${new Date().toLocaleDateString("de-DE", { timeZone: "Europe/Berlin" })}\n\nKleanas Stichpunkte zur Stunde:\n${eingabe}`);
      } catch (e) { return fehler(e instanceof Error ? e.message : "KI-Fehler – bitte noch einmal versuchen."); }
      if (!inhalt) return fehler("Die KI hat keinen Bericht geliefert – bitte noch einmal versuchen.");
      const titel = (inhalt.match(/^#\s+(.+)$/m)?.[1] || "Stundenbericht").slice(0, 160);
      const { data, error } = await sb.from("lesson_reports")
        .insert({ student_id: zielSchueler, titel, art: "bericht", eingabe, inhalt })
        .select("id,titel,art,inhalt,created_at,eingabe").single();
      if (error) return fehler(/lesson_reports/.test(error.message)
        ? "Bitte zuerst das SQL „klassenzimmer_v5_berichte“ in Supabase ausführen (steht im Chat)."
        : "Speichern fehlgeschlagen: " + error.message);
      return ok({ message: "Bericht erstellt und hochgeladen ✓", report: data });
    }

    if (action === "quizErstellen") {
      if (!istLehrerin) return fehler("Nur Kleana kann Quizze erstellen.", 403);
      if (!kiBereit()) return fehler("Der KI-Schlüssel fehlt noch: Bitte ANTHROPIC_API_KEY in Vercel eintragen (Anleitung im Chat mit Claude).");
      const { data: alte } = await sb.from("lesson_reports")
        .select("titel,inhalt,created_at").eq("student_id", zielSchueler).eq("art", "bericht")
        .order("created_at", { ascending: false }).limit(6);
      const berichte = (alte || []) as { titel: string; inhalt: string; created_at: string }[];
      if (!berichte.length) return fehler("Noch keine Stundenberichte vorhanden – erstelle zuerst einen Bericht.");
      const stoff = berichte.map((b) => `--- Bericht vom ${new Date(b.created_at).toLocaleDateString("de-DE")} ---\n${b.inhalt}`).join("\n\n").slice(0, 60000);
      const profSchueler = await getProfile(zielSchueler);
      let inhalt = "";
      try {
        inhalt = await kiText(QUIZ_SYSTEM, `Schüler/in: ${profSchueler?.name || "unbekannt"}\n\nDie letzten Stundenberichte:\n\n${stoff}`);
      } catch (e) { return fehler(e instanceof Error ? e.message : "KI-Fehler – bitte noch einmal versuchen."); }
      if (!inhalt) return fehler("Die KI hat kein Quiz geliefert – bitte noch einmal versuchen.");
      const titel = (inhalt.match(/^#\s+(.+)$/m)?.[1] || "Wiederholungs-Quiz").slice(0, 160);
      const { data, error } = await sb.from("lesson_reports")
        .insert({ student_id: zielSchueler, titel, art: "quiz", inhalt })
        .select("id,titel,art,inhalt,created_at").single();
      if (error) return fehler("Speichern fehlgeschlagen: " + error.message);
      return ok({ message: "Quiz erstellt ✓", report: data });
    }

    if (action === "berichtLoeschen") {
      if (!istLehrerin) return fehler("Nur Kleana kann Berichte löschen.", 403);
      if (!istUuid(body.reportId)) return fehler("Bericht nicht gefunden.", 404);
      await sb.from("lesson_reports").delete().eq("id", body.reportId).eq("student_id", zielSchueler);
      return ok({ message: "Gelöscht." });
    }

    // ======================= STUNDEN ========================================
    if (action === "lessons") {
      await syncLessons(); // gedrosselt - bremst das Laden nicht mehr
      const grenze = new Date(Date.now() - 30 * 60000).toISOString();
      const [{ data: kommend }, { data: vergangen }] = await Promise.all([
        sb.from("lessons").select("id,title,subject,starts_at,ends_at,mode")
          .eq("student_id", zielSchueler).gt("ends_at", grenze)
          .order("starts_at", { ascending: true }).limit(5),
        sb.from("lessons").select("id,title,subject,starts_at,ends_at,mode")
          .eq("student_id", zielSchueler).lte("ends_at", grenze)
          .order("starts_at", { ascending: false }).limit(10),
      ]);
      type L = { id: string; title: string; subject: string | null; starts_at: string; ends_at: string; mode?: string | null };
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
