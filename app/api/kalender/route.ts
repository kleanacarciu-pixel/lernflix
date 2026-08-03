// =============================================================================
// Terminkalender – API (alle Aktionen über {action, ...})
// Läuft serverseitig mit Service-Role-Key; Geschäftslogik nicht manipulierbar.
// =============================================================================
import { NextResponse, after } from "next/server";
import {
  service, signIn, refresh, userFromToken, getProfile, buildWeek, balanceDates, groupBalanceDates,
  weekdayOf, isOpen, hoursUntil, prettyDate, HOURS, DAY_NAMES,
  sendMail, mailTemplates, ADMIN_EMAIL, NOTE_ANNA_CANCEL, type Profile,
} from "@/lib/kalender";
import { nextLessonFor } from "@/lib/stunden";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function bad(msg: string, code = 400) { return NextResponse.json({ ok: false, error: msg }, { status: code }); }
function ok(data: Record<string, unknown> = {}) { return NextResponse.json({ ok: true, ...data }); }

// Slot-Zustand für eine konkrete Aktion prüfen
async function inspectSlot(date: string, hour: number) {
  const sb = service();
  const wd = weekdayOf(date);
  const [fxRes, apRes, wbRes] = await Promise.all([
    sb.from("fixed_slots").select("id,student_id,status,mode").eq("weekday", wd).eq("hour", hour).in("status", ["aktiv", "angefragt"]),
    sb.from("appointments").select("id,student_id,kind,status,counted,note,mode").eq("slot_date", date).eq("hour", hour),
    sb.from("weekly_blocks").select("id").eq("weekday", wd).eq("hour", hour),
  ]);
  const appts = (apRes.data || []) as { id: string; student_id: string | null; kind: string; status: string; counted: string | null; note: string | null; mode: string | null }[];
  const fxa = (fxRes.data || []) as { id: string; student_id: string; status: string; mode: string | null }[];
  return {
    wd,
    block: appts.find((a) => a.kind === "block" && a.status !== "abgesagt") || null,
    booking: appts.find((a) => (a.kind === "einzel" || a.kind === "probe") && a.status !== "abgesagt") || null,
    absage: appts.find((a) => a.kind === "absage") || null,
    fixedActive: fxa.find((f) => f.status === "aktiv") || null,
    fixedPending: fxa.find((f) => f.status === "angefragt") || null,
    weeklyBlock: (wbRes.data || []).length > 0,
  };
}

async function setBalance(id: string, patch: Partial<Pick<Profile, "minus_hours" | "plus_hours" | "makeup_credits">>) {
  await service().from("profiles").update(patch).eq("user_id", id);
}
// Einzel-Buchung verrechnen (bei Bestätigung): makeup -> minus -> sonst plus
async function applyEinzelCounting(p: Profile): Promise<"makeup" | "minus" | "plus"> {
  if (p.makeup_credits > 0) { await setBalance(p.user_id, { makeup_credits: p.makeup_credits - 1 }); return "makeup"; }
  if (p.minus_hours > 0) { await setBalance(p.user_id, { minus_hours: p.minus_hours - 1 }); return "minus"; }
  await setBalance(p.user_id, { plus_hours: p.plus_hours + 1 }); return "plus";
}
// Verrechnung rückgängig machen (bei Absage einer Einzel-Buchung)
async function revertCounting(p: Profile, counted: string | null) {
  if (counted === "plus") await setBalance(p.user_id, { plus_hours: Math.max(0, p.plus_hours - 1) });
  else if (counted === "minus") await setBalance(p.user_id, { minus_hours: Math.min(3, p.minus_hours + 1) });
  else if (counted === "makeup") await setBalance(p.user_id, { makeup_credits: p.makeup_credits + 1 });
}

export async function POST(req: Request): Promise<Response> {
  let body: Record<string, unknown> = {};
  try { const r = await req.json(); if (r && typeof r === "object") body = r as Record<string, unknown>; } catch { /* {} */ }
  const action = String(body.action || "");
  const token = typeof body.token === "string" ? body.token : "";
  const date = typeof body.date === "string" ? body.date : "";
  const hour = Number(body.hour);
  const mode = body.mode === "online" || body.mode === "vor_ort" ? body.mode : null;

  try {
    // ----- ohne Login -----
    if (action === "login") {
      const email = String(body.email || "").trim().toLowerCase();
      const password = String(body.password || "");
      if (!email || !password) return bad("E-Mail und Passwort erforderlich.");
      const session = await signIn(email, password);
      if (!session) return bad("E-Mail oder Passwort falsch.", 401);
      const prof = await getProfile(session.user.id);
      if (!prof) return bad("Kein Zugang – bitte Kleana kontaktieren.", 403);
      return ok({ token: session.access_token, refresh: session.refresh_token, role: prof.role, name: prof.name });
    }
    if (action === "refresh") {
      const session = await refresh(String(body.refresh || ""));
      if (!session) return bad("Sitzung abgelaufen.", 401);
      return ok({ token: session.access_token, refresh: session.refresh_token });
    }
    if (action === "week") {
      const monday = String(body.monday || "");
      if (!/^\d{4}-\d{2}-\d{2}$/.test(monday)) return bad("Ungültiges Datum.");
      let role: "public" | "student" | "admin" = "public";
      let viewerId: string | null = null;
      let prof: Profile | null = null;
      if (token) {
        const user = await userFromToken(token);
        if (user) { prof = await getProfile(user.id); if (prof) { role = prof.role === "admin" ? "admin" : "student"; viewerId = user.id; } }
      }
      const days = await buildWeek(monday, role, viewerId);
      const out: Record<string, unknown> = { days, viewer: { role, name: prof?.name || null } };
      // Virtuelles Klassenzimmer: nächste anstehende Stunde für den "Zur Stunde"-Button
      if (viewerId) out.nextLesson = await nextLessonFor(viewerId);
      if (role === "student" && prof) {
        const dates = await balanceDates(prof.user_id);
        const { data: myfix } = await service().from("fixed_slots").select("weekday,hour,mode").eq("student_id", prof.user_id).eq("status", "aktiv");
        const fix = (myfix || []).map((f: { weekday: number; hour: number; mode: string | null }) => ({ weekday: f.weekday, hour: f.hour, mode: f.mode }));
        out.balance = { minus: prof.minus_hours, plus: prof.plus_hours, nach: prof.makeup_credits, dates, fix };
      }
      return ok(out);
    }
    if (action === "requestProbe") {
      const name = String(body.name || "").trim();
      const email = String(body.email || "").trim().toLowerCase();
      if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date) || !HOURS.includes(hour) || !isOpen(weekdayOf(date), hour)) return bad("Ungültiger Slot.");
      if (!name || !email) return bad("Bitte Name und E-Mail angeben.");
      if (!mode) return bad("Bitte online oder vor Ort wählen.");
      if (hoursUntil(date, hour) <= 0) return bad("Dieser Termin liegt in der Vergangenheit.");
      const s = await inspectSlot(date, hour);
      if (s.block || s.weeklyBlock || s.booking || (s.fixedActive && !s.absage)) return bad("Dieser Slot ist leider schon belegt.");
      { const { error } = await service().from("appointments").insert({ student_id: null, slot_date: date, hour, kind: "probe", status: "angefragt", mode, note: `${name}|${email}` }); if (error) return bad("Speichern fehlgeschlagen: " + error.message); }
      after(() => sendMail(ADMIN_EMAIL, "Neue Probestunden-Anfrage", `${name} (${email}) möchte eine Probestunde am ${prettyDate(date, hour)} (${mode === "online" ? "online" : "vor Ort"}). Bitte im Kalender bestätigen.`));
      after(() => sendMail(email, "Probestunde angefragt", mailTemplates.probeReceived(name, prettyDate(date, hour))));
      return ok({ message: "Probestunde angefragt! Kleana meldet sich per E-Mail bei dir." });
    }

    // ----- ab hier Login nötig -----
    const user = token ? await userFromToken(token) : null;
    if (!user) return bad("Bitte einloggen.", 401);
    const prof = await getProfile(user.id);
    if (!prof) return bad("Kein Zugang.", 403);
    const isAdmin = prof.role === "admin";
    const validSlot = date && /^\d{4}-\d{2}-\d{2}$/.test(date) && HOURS.includes(hour) && isOpen(weekdayOf(date), hour);

    // === SCHÜLER-AKTIONEN ===
    if (action === "requestFixed") {
      if (!validSlot) return bad("Ungültiger Slot.");
      if (!mode) return bad("Bitte online oder vor Ort wählen.");
      const s = await inspectSlot(date, hour);
      if (s.block || s.weeklyBlock || s.booking || s.fixedActive) return bad("Dieser Slot ist belegt.");
      const { data: mine } = await service().from("fixed_slots").select("id").eq("student_id", user.id).eq("weekday", s.wd).eq("hour", hour).in("status", ["aktiv", "angefragt"]);
      if (mine && mine.length) return bad("Du hast diesen Slot schon angefragt.");
      { const { error } = await service().from("fixed_slots").insert({ student_id: user.id, weekday: s.wd, hour, status: "angefragt", mode }); if (error) return bad("Speichern fehlgeschlagen: " + error.message); }
      after(() => sendMail(ADMIN_EMAIL, "Neue Anfrage: fester Termin", `${prof.name} möchte einen festen wöchentlichen Termin: ${prettyDate(date, hour)} (${mode === "online" ? "online" : "vor Ort"}). Bitte im Kalender bestätigen.`));
      return ok({ message: "Fester Termin angefragt. Kleana bestätigt ihn." });
    }
    if (action === "bookExtra") {
      if (!validSlot) return bad("Ungültiger Slot.");
      if (!mode) return bad("Bitte online oder vor Ort wählen.");
      if (hoursUntil(date, hour) <= 0) return bad("Dieser Termin liegt in der Vergangenheit.");
      const s = await inspectSlot(date, hour);
      if (s.block || s.weeklyBlock || s.booking || (s.fixedActive && !s.absage)) return bad("Dieser Slot ist belegt.");
      { const { error } = await service().from("appointments").insert({ student_id: user.id, slot_date: date, hour, kind: "einzel", status: "angefragt", mode }); if (error) return bad("Speichern fehlgeschlagen: " + error.message); }
      after(() => sendMail(ADMIN_EMAIL, "Neue Terminanfrage", `${prof.name} möchte am ${prettyDate(date, hour)} eine Stunde (${mode === "online" ? "online" : "vor Ort"}). Bitte im Kalender bestätigen.`));
      const preview = prof.makeup_credits > 0 ? "Nachhol-Guthaben wird eingelöst." : prof.minus_hours > 0 ? "Minus-Stunde wird nachgeholt." : "Zählt als Extra-Stunde (Plus).";
      return ok({ message: "Stunde angefragt. Kleana bestätigt sie. " + preview });
    }
    if (action === "cancelMine") {
      if (!validSlot) return bad("Ungültiger Slot.");
      const s = await inspectSlot(date, hour);
      if (s.booking && s.booking.student_id === user.id) {
        await service().from("appointments").update({ status: "abgesagt", counted: null }).eq("id", s.booking.id);
        await revertCounting(prof, s.booking.counted);
        return ok({ message: "Deine gebuchte Stunde wurde abgesagt." });
      }
      if (s.fixedActive && s.fixedActive.student_id === user.id && !s.absage) {
        const hu = hoursUntil(date, hour);
        const credit = hu >= 4 && prof.minus_hours < 3;
        const cnote = credit ? null : (hu < 4 ? "late" : "overmax");
        await service().from("appointments").insert({ student_id: user.id, slot_date: date, hour, kind: "absage", status: "abgesagt", credited: credit, note: cnote });
        if (credit) await setBalance(user.id, { minus_hours: prof.minus_hours + 1 });
        after(() => sendMail(ADMIN_EMAIL, "Schüler-Absage", `${prof.name} hat den Termin ${prettyDate(date, hour)} abgesagt${credit ? " (>4 Std. → Minus-Stunde gutgeschrieben)" : " (<4 Std. → keine Gutschrift)"}.`));
        return ok({ message: hu >= 4 ? (credit ? "Abgesagt. +1 Minus-Stunde gutgeschrieben." : "Abgesagt. (Minus-Konto bereits voll: 3/3.)") : "Abgesagt. Weniger als 4 Std. vorher – keine Gutschrift." });
      }
      return bad("Hier ist kein eigener Termin.");
    }

    if (action === "changePassword") {
      const pw = String(body.password || "");
      if (pw.length < 6) return bad("Passwort muss mindestens 6 Zeichen haben.");
      const { error } = await service().auth.admin.updateUserById(user.id, { password: pw });
      if (error) return bad("Konnte Passwort nicht ändern: " + error.message);
      return ok({ message: "Passwort geändert." });
    }
    if (action === "endFixed") {
      if (!validSlot) return bad("Ungültiger Slot.");
      const s = await inspectSlot(date, hour);
      if (!s.fixedActive) return bad("Hier ist kein fester Termin.");
      if (!isAdmin && s.fixedActive.student_id !== user.id) return bad("Nur dein eigener fester Termin.");
      await service().from("fixed_slots").update({ status: "beendet" }).eq("id", s.fixedActive.id);
      return ok({ message: "Fester Termin beendet. Du kannst jetzt einen neuen freien Slot anfragen." });
    }

    // === ADMIN-AKTIONEN (nur Kleana) ===
    if (!isAdmin) return bad("Nur Kleana darf das.", 403);

    if (action === "deleteStudent") {
      const sid = String(body.studentId || "");
      if (!sid) return bad("Kein Schüler angegeben.");
      const p = await getProfile(sid);
      if (!p || p.role === "admin") return bad("Nicht erlaubt.");
      const { error } = await service().auth.admin.deleteUser(sid);
      if (error) await service().from("profiles").delete().eq("user_id", sid);
      return ok({ message: `Schüler „${p.name}" entfernt.` });
    }

    if (action === "adminConfirm") {
      if (!validSlot) return bad("Ungültiger Slot.");
      const s = await inspectSlot(date, hour);
      if (s.booking && s.booking.status === "angefragt") {
        if (s.booking.kind === "probe") {
          await service().from("appointments").update({ status: "bestaetigt" }).eq("id", s.booking.id);
          const gname = (s.booking.note || "").split("|")[0] || "";
          const email = (s.booking.note || "").split("|")[1];
          if (email) after(() => sendMail(email, "Deine Probestunde ist bestätigt ✓", mailTemplates.probeConfirmed(gname, prettyDate(date, hour), s.booking!.mode)));
          return ok({ message: "Probestunde bestätigt. Bestätigungs-Mail gesendet." });
        }
        const sp = await getProfile(s.booking.student_id || "");
        let counted: string | null = null;
        if (sp) counted = await applyEinzelCounting(sp);
        await service().from("appointments").update({ status: "bestaetigt", counted }).eq("id", s.booking.id);
        if (sp?.email) { const em = sp.email, md = s.booking.mode; after(() => sendMail(em, "Termin bestätigt", mailTemplates.confirmed(prettyDate(date, hour), md))); }
        return ok({ message: "Bestätigt. Bestätigungs-Mail gesendet." });
      }
      if (s.fixedPending) {
        if (s.fixedActive) return bad("Slot ist schon fest vergeben.");
        await service().from("fixed_slots").update({ status: "aktiv" }).eq("id", s.fixedPending.id);
        const sp = await getProfile(s.fixedPending.student_id);
        if (sp?.email) { const em = sp.email, md = s.fixedPending.mode; after(() => sendMail(em, "Fester Termin bestätigt", mailTemplates.confirmed(`${DAY_NAMES[s.wd]} ${String(hour).padStart(2, "0")}:00 (wöchentlich)`, md))); }
        return ok({ message: "Fester Termin bestätigt – ab jetzt jede Woche. Mail gesendet." });
      }
      return bad("Keine Anfrage in diesem Slot.");
    }
    if (action === "adminReject") {
      if (!validSlot) return bad("Ungültiger Slot.");
      const s = await inspectSlot(date, hour);
      if (s.booking && s.booking.status === "angefragt") {
        await service().from("appointments").update({ status: "abgesagt" }).eq("id", s.booking.id);
        const email = s.booking.student_id ? (await getProfile(s.booking.student_id))?.email : (s.booking.note || "").split("|")[1];
        if (email) { const em = email; after(() => sendMail(em, "Termin abgesagt", mailTemplates.rejected(prettyDate(date, hour)))); }
        return ok({ message: "Anfrage abgesagt. Absage-Mail gesendet." });
      }
      if (s.fixedPending) {
        await service().from("fixed_slots").update({ status: "beendet" }).eq("id", s.fixedPending.id);
        const sp = await getProfile(s.fixedPending.student_id);
        if (sp?.email) { const em = sp.email; after(() => sendMail(em, "Anfrage abgesagt", mailTemplates.rejected(`${DAY_NAMES[s.wd]} ${String(hour).padStart(2, "0")}:00`))); }
        return ok({ message: "Anfrage abgesagt. Absage-Mail gesendet." });
      }
      return bad("Keine Anfrage in diesem Slot.");
    }
    if (action === "adminCancel") {
      if (!validSlot) return bad("Ungültiger Slot.");
      const s = await inspectSlot(date, hour);
      if (s.booking) {
        const sp = await getProfile(s.booking.student_id || "");
        await service().from("appointments").update({ status: "abgesagt", counted: null }).eq("id", s.booking.id);
        if (sp) { await revertCounting(sp, s.booking.counted); await setBalance(sp.user_id, { makeup_credits: (await getProfile(sp.user_id))!.makeup_credits + 1 }); }
        if (sp?.email) { const em = sp.email; after(() => sendMail(em, "Termin verschoben", mailTemplates.annaCancel(prettyDate(date, hour)))); }
        return ok({ message: "Abgesagt. Schüler bekommt Nachhol-Guthaben + Mail." });
      }
      if (s.fixedActive && !s.absage) {
        const sp = await getProfile(s.fixedActive.student_id);
        await service().from("appointments").insert({ student_id: s.fixedActive.student_id, slot_date: date, hour, kind: "absage", status: "abgesagt", credited: false, note: NOTE_ANNA_CANCEL });
        if (sp) await setBalance(sp.user_id, { makeup_credits: sp.makeup_credits + 1 });
        if (sp?.email) { const em = sp.email; after(() => sendMail(em, "Termin verschoben", mailTemplates.annaCancel(prettyDate(date, hour)))); }
        return ok({ message: "Abgesagt. Schüler bekommt Nachhol-Guthaben (kein Minus) + Mail." });
      }
      return bad("Hier ist kein Termin zum Absagen.");
    }
    if (action === "block") {
      if (!validSlot) return bad("Ungültiger Slot.");
      const s = await inspectSlot(date, hour);
      if (s.block || s.weeklyBlock) return ok({ message: "Bereits geblockt." });
      if (s.booking || (s.fixedActive && !s.absage)) return bad("Slot ist belegt – kann nicht geblockt werden.");
      await service().from("appointments").insert({ student_id: null, slot_date: date, hour, kind: "block", status: "bestaetigt" });
      return ok({ message: "Slot geblockt (nur dieses Datum)." });
    }
    if (action === "unblock") {
      if (!validSlot) return bad("Ungültiger Slot.");
      await service().from("appointments").delete().eq("slot_date", date).eq("hour", hour).eq("kind", "block");
      return ok({ message: "Slot wieder frei." });
    }
    if (action === "blockWeekly") {
      if (!validSlot) return bad("Ungültiger Slot.");
      const s = await inspectSlot(date, hour);
      if (s.booking || (s.fixedActive && !s.absage)) return bad("Slot ist belegt – kann nicht dauerhaft geblockt werden.");
      const { error } = await service().from("weekly_blocks").insert({ weekday: weekdayOf(date), hour });
      if (error && !/duplicate|unique/i.test(error.message)) return bad("Fehler: " + error.message);
      return ok({ message: `Dauerhaft geblockt – jeden ${DAY_NAMES[weekdayOf(date)]} um ${String(hour).padStart(2, "0")}:00.` });
    }
    if (action === "unblockWeekly") {
      if (!validSlot) return bad("Ungültiger Slot.");
      await service().from("weekly_blocks").delete().eq("weekday", weekdayOf(date)).eq("hour", hour);
      return ok({ message: "Dauer-Blockierung aufgehoben." });
    }
    if (action === "createStudent") {
      const name = String(body.name || "").trim();
      const email = String(body.email || "").trim().toLowerCase();
      if (!name || !email) return bad("Name und E-Mail erforderlich.");
      const password = "LMA-" + crypto.randomUUID().slice(0, 8) + "!7";
      const { data: created, error } = await service().auth.admin.createUser({ email, password, email_confirm: true, user_metadata: { name } });
      if (error || !created.user) return bad("Konnte Zugang nicht anlegen: " + (error?.message || "unbekannt"));
      { const { error: pe } = await service().from("profiles").insert({ user_id: created.user.id, name, email, role: "student" }); if (pe) return bad("Profil konnte nicht angelegt werden: " + pe.message); }
      const mail = await sendMail(email, "Dein Zugang zum Terminkalender", mailTemplates.invite(name, email, password));
      const info = mail.ok
        ? "Die Einladung mit dem Passwort wurde auch per Mail an den Schüler gesendet (ggf. Spam-Ordner prüfen)."
        : `Mail nicht gesendet – Grund: ${mail.error}. Bitte gib dem Schüler das Passwort oben selbst weiter.`;
      return ok({ message: `Schüler ${name} angelegt.\n\nStart-Passwort: ${password}\nE-Mail: ${email}\n\n${info}\nDer Schüler kann das Passwort nach dem ersten Login selbst ändern.`, password });
    }
    if (action === "overview") {
      const sb = service();
      const { data: studs } = await sb.from("profiles").select("user_id,name,minus_hours,plus_hours,makeup_credits").eq("role", "student").order("name");
      const { data: fx } = await sb.from("fixed_slots").select("student_id,weekday,hour,mode").eq("status", "aktiv");
      const { data: allAppts } = await sb.from("appointments").select("student_id,slot_date,hour,kind,credited,counted,note,status").order("slot_date", { ascending: false }).limit(2000);
      const apptsByStudent = new Map<string, { slot_date: string; hour: number; kind: string; credited: boolean; counted: string | null; note: string | null; status: string }[]>();
      (allAppts || []).forEach((a: { student_id: string | null; slot_date: string; hour: number; kind: string; credited: boolean; counted: string | null; note: string | null; status: string }) => {
        if (!a.student_id) return;
        const arr = apptsByStudent.get(a.student_id) || []; arr.push(a); apptsByStudent.set(a.student_id, arr);
      });
      const fixByStudent = new Map<string, string[]>();
      (fx || []).forEach((f: { student_id: string; weekday: number; hour: number; mode: string | null }) => {
        const arr = fixByStudent.get(f.student_id) || [];
        const m = f.mode === "online" ? " · online" : f.mode === "vor_ort" ? " · vor Ort" : "";
        arr.push(`${DAY_NAMES[f.weekday]} ${String(f.hour).padStart(2, "0")}:00${m}`);
        fixByStudent.set(f.student_id, arr);
      });
      const rows = (studs || []).map((p: { user_id: string; name: string; minus_hours: number; plus_hours: number; makeup_credits: number }) => {
        const d = groupBalanceDates(apptsByStudent.get(p.user_id) || []);
        return {
          id: p.user_id, name: p.name, fix: (fixByStudent.get(p.user_id) || []).join(", ") || "—",
          minus: p.minus_hours, plus: p.plus_hours, nach: p.makeup_credits,
          minusD: d.minus, plusD: d.plus, nachD: d.nach,
        };
      });
      return ok({ students: rows });
    }

    if (action === "adjustBalance") {
      const sid = String(body.studentId || "");
      const field = String(body.field || "");
      const delta = Number(body.delta);
      if (!["makeup", "plus", "minus"].includes(field) || (delta !== 1 && delta !== -1)) return bad("Ungültig.");
      const p = await getProfile(sid);
      if (!p || p.role === "admin") return bad("Nicht gefunden.");
      const col = field === "makeup" ? "makeup_credits" : field === "plus" ? "plus_hours" : "minus_hours";
      const cur = field === "makeup" ? p.makeup_credits : field === "plus" ? p.plus_hours : p.minus_hours;
      let nv = cur + delta;
      if (nv < 0) nv = 0;
      if (field === "minus" && nv > 3) nv = 3;
      await service().from("profiles").update({ [col]: nv }).eq("user_id", sid);
      return ok({ message: "Aktualisiert." });
    }
    if (action === "studentHistory") {
      const sid = String(body.studentId || "");
      const p = await getProfile(sid);
      if (!p || p.role === "admin") return bad("Nicht gefunden.");
      const { data } = await service().from("appointments").select("slot_date,hour,kind,credited,counted,note,status").eq("student_id", sid).order("slot_date", { ascending: false }).limit(500);
      const plus: string[] = [], minus: string[] = [], late: string[] = [], overmax: string[] = [], gutschrift: string[] = [];
      ((data || []) as { slot_date: string; hour: number; kind: string; credited: boolean; counted: string | null; note: string | null; status: string }[]).forEach((a) => {
        const label = prettyDate(a.slot_date, a.hour).replace(" um ", ", ");
        if (a.counted === "plus" && a.status !== "abgesagt") plus.push(label);
        if (a.kind === "absage" && a.credited) minus.push(label);
        else if (a.kind === "absage" && a.note === NOTE_ANNA_CANCEL) gutschrift.push(label);
        else if (a.kind === "absage" && a.note === "late") late.push(label);
        else if (a.kind === "absage" && a.note === "overmax") overmax.push(label);
      });
      return ok({ name: p.name, history: { plus, minus, late, overmax, gutschrift } });
    }
    if (action === "adminInbox") {
      const sb = service();
      const [pendRes, pfixRes, cancRes, profRes] = await Promise.all([
        sb.from("appointments").select("student_id,slot_date,hour,kind,mode,note").eq("status", "angefragt").order("slot_date"),
        sb.from("fixed_slots").select("student_id,weekday,hour,mode").eq("status", "angefragt"),
        sb.from("appointments").select("student_id,slot_date,hour,credited,note").eq("kind", "absage").order("slot_date", { ascending: false }).limit(15),
        sb.from("profiles").select("user_id,name"),
      ]);
      const profs = (profRes.data || []) as { user_id: string; name: string }[];
      const nameOf = (id: string | null) => (id ? profs.find((p) => p.user_id === id)?.name : null) || "—";
      const pend = (pendRes.data || []) as { student_id: string | null; slot_date: string; hour: number; kind: string; mode: string | null; note: string | null }[];
      const pfix = (pfixRes.data || []) as { student_id: string; weekday: number; hour: number; mode: string | null }[];
      const canc = (cancRes.data || []) as { student_id: string | null; slot_date: string; hour: number; credited: boolean; note: string | null }[];
      const requests = [
        ...pend.map((p) => ({ date: p.slot_date, hour: p.hour, who: p.student_id ? nameOf(p.student_id) : ((p.note || "").split("|")[0] + " (Probe)"), kind: p.kind, mode: p.mode })),
        ...pfix.map((f) => ({ weekday: f.weekday, hour: f.hour, who: nameOf(f.student_id), kind: "fix", mode: f.mode })),
      ];
      const cancellations = canc.map((c) => ({ date: c.slot_date, hour: c.hour, who: nameOf(c.student_id), credited: c.credited, byAnna: c.note === NOTE_ANNA_CANCEL }));
      return ok({ inbox: { requests, cancellations } });
    }

    return bad("Unbekannte Aktion.");
  } catch (e) {
    console.error("[kalender] error:", e instanceof Error ? e.stack : String(e));
    return bad("Server-Fehler. Bitte erneut versuchen.", 500);
  }
}
