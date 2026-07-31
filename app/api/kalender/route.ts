// =============================================================================
// Terminkalender – API (alle Aktionen über {action, ...})
// Läuft serverseitig mit Service-Role-Key; Geschäftslogik nicht manipulierbar.
// =============================================================================
import { NextResponse } from "next/server";
import {
  service, signIn, refresh, userFromToken, getProfile, buildWeek, balanceDates,
  weekdayOf, isOpen, hoursUntil, prettyDate, HOURS, DAY_NAMES,
  sendMail, mailTemplates, ADMIN_EMAIL, NOTE_ANNA_CANCEL, type Profile,
} from "@/lib/kalender";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function bad(msg: string, code = 400) { return NextResponse.json({ ok: false, error: msg }, { status: code }); }
function ok(data: Record<string, unknown> = {}) { return NextResponse.json({ ok: true, ...data }); }

// Slot-Zustand für eine konkrete Aktion prüfen
async function inspectSlot(date: string, hour: number) {
  const sb = service();
  const wd = weekdayOf(date);
  const { data: fx } = await sb.from("fixed_slots").select("id,student_id,status").eq("weekday", wd).eq("hour", hour).in("status", ["aktiv", "angefragt"]);
  const { data: ap } = await sb.from("appointments").select("id,student_id,kind,status,counted").eq("slot_date", date).eq("hour", hour);
  const appts = (ap || []) as { id: string; student_id: string | null; kind: string; status: string; counted: string | null }[];
  return {
    wd,
    block: appts.find((a) => a.kind === "block" && a.status !== "abgesagt") || null,
    booking: appts.find((a) => (a.kind === "einzel" || a.kind === "probe") && a.status !== "abgesagt") || null,
    absage: appts.find((a) => a.kind === "absage") || null,
    fixedActive: (fx || []).find((f) => f.status === "aktiv") || null,
    fixedPending: (fx || []).find((f) => f.status === "angefragt") || null,
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
      if (role === "student" && prof) {
        const dates = await balanceDates(prof.user_id);
        out.balance = { minus: prof.minus_hours, plus: prof.plus_hours, nach: prof.makeup_credits, dates };
      }
      return ok(out);
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
      const s = await inspectSlot(date, hour);
      if (s.block || s.booking || s.fixedActive) return bad("Dieser Slot ist belegt.");
      const { data: mine } = await service().from("fixed_slots").select("id").eq("student_id", user.id).eq("weekday", s.wd).eq("hour", hour).in("status", ["aktiv", "angefragt"]);
      if (mine && mine.length) return bad("Du hast diesen Slot schon angefragt.");
      await service().from("fixed_slots").insert({ student_id: user.id, weekday: s.wd, hour, status: "angefragt" });
      return ok({ message: "Fester Termin angefragt. Kleana bestätigt ihn." });
    }
    if (action === "bookExtra") {
      if (!validSlot) return bad("Ungültiger Slot.");
      if (hoursUntil(date, hour) <= 0) return bad("Dieser Termin liegt in der Vergangenheit.");
      const s = await inspectSlot(date, hour);
      if (s.block || s.booking || (s.fixedActive && !s.absage)) return bad("Dieser Slot ist belegt.");
      await service().from("appointments").insert({ student_id: user.id, slot_date: date, hour, kind: "einzel", status: "angefragt" });
      const preview = prof.makeup_credits > 0 ? "Nachhol-Guthaben wird eingelöst." : prof.minus_hours > 0 ? "Minus-Stunde wird nachgeholt." : "Zählt als Extra-Stunde (Plus).";
      return ok({ message: "Stunde angefragt. Kleana bestätigt sie. " + preview });
    }
    if (action === "cancelMine") {
      if (!validSlot) return bad("Ungültiger Slot.");
      const s = await inspectSlot(date, hour);
      if (s.booking && s.booking.student_id === user.id) {
        await service().from("appointments").update({ status: "abgesagt" }).eq("id", s.booking.id);
        await revertCounting(prof, s.booking.counted);
        return ok({ message: "Deine gebuchte Stunde wurde abgesagt." });
      }
      if (s.fixedActive && s.fixedActive.student_id === user.id && !s.absage) {
        const hu = hoursUntil(date, hour);
        const credit = hu >= 4 && prof.minus_hours < 3;
        await service().from("appointments").insert({ student_id: user.id, slot_date: date, hour, kind: "absage", status: "abgesagt", credited: credit });
        if (credit) await setBalance(user.id, { minus_hours: prof.minus_hours + 1 });
        await sendMail(ADMIN_EMAIL, "Schüler-Absage", `${prof.name} hat den Termin ${prettyDate(date, hour)} abgesagt${credit ? " (>4 Std. → Minus-Stunde gutgeschrieben)" : " (<4 Std. → keine Gutschrift)"}.`);
        return ok({ message: hu >= 4 ? (credit ? "Abgesagt. +1 Minus-Stunde gutgeschrieben." : "Abgesagt. (Minus-Konto bereits voll: 3/3.)") : "Abgesagt. Weniger als 4 Std. vorher – keine Gutschrift." });
      }
      return bad("Hier ist kein eigener Termin.");
    }

    // === ADMIN-AKTIONEN (nur Kleana) ===
    if (!isAdmin) return bad("Nur Kleana darf das.", 403);

    if (action === "adminConfirm") {
      if (!validSlot) return bad("Ungültiger Slot.");
      const s = await inspectSlot(date, hour);
      if (s.booking && s.booking.status === "angefragt") {
        const sp = await getProfile(s.booking.student_id || "");
        let counted: string | null = null;
        if (sp) counted = await applyEinzelCounting(sp);
        await service().from("appointments").update({ status: "bestaetigt", counted }).eq("id", s.booking.id);
        if (sp?.email) await sendMail(sp.email, "Termin bestätigt", mailTemplates.confirmed(prettyDate(date, hour)));
        return ok({ message: "Bestätigt. Bestätigungs-Mail gesendet." });
      }
      if (s.fixedPending) {
        if (s.fixedActive) return bad("Slot ist schon fest vergeben.");
        await service().from("fixed_slots").update({ status: "aktiv" }).eq("id", s.fixedPending.id);
        const sp = await getProfile(s.fixedPending.student_id);
        if (sp?.email) await sendMail(sp.email, "Fester Termin bestätigt", mailTemplates.confirmed(`${DAY_NAMES[s.wd]} ${String(hour).padStart(2, "0")}:00 (wöchentlich)`));
        return ok({ message: "Fester Termin bestätigt – ab jetzt jede Woche. Mail gesendet." });
      }
      return bad("Keine Anfrage in diesem Slot.");
    }
    if (action === "adminReject") {
      if (!validSlot) return bad("Ungültiger Slot.");
      const s = await inspectSlot(date, hour);
      if (s.booking && s.booking.status === "angefragt") {
        await service().from("appointments").update({ status: "abgesagt" }).eq("id", s.booking.id);
        const sp = await getProfile(s.booking.student_id || "");
        if (sp?.email) await sendMail(sp.email, "Termin abgesagt", mailTemplates.rejected(prettyDate(date, hour)));
        return ok({ message: "Anfrage abgesagt. Absage-Mail gesendet." });
      }
      if (s.fixedPending) {
        await service().from("fixed_slots").update({ status: "beendet" }).eq("id", s.fixedPending.id);
        const sp = await getProfile(s.fixedPending.student_id);
        if (sp?.email) await sendMail(sp.email, "Anfrage abgesagt", mailTemplates.rejected(`${DAY_NAMES[s.wd]} ${String(hour).padStart(2, "0")}:00`));
        return ok({ message: "Anfrage abgesagt. Absage-Mail gesendet." });
      }
      return bad("Keine Anfrage in diesem Slot.");
    }
    if (action === "adminCancel") {
      if (!validSlot) return bad("Ungültiger Slot.");
      const s = await inspectSlot(date, hour);
      if (s.booking) {
        const sp = await getProfile(s.booking.student_id || "");
        await service().from("appointments").update({ status: "abgesagt" }).eq("id", s.booking.id);
        if (sp) { await revertCounting(sp, s.booking.counted); await setBalance(sp.user_id, { makeup_credits: (await getProfile(sp.user_id))!.makeup_credits + 1 }); }
        if (sp?.email) await sendMail(sp.email, "Termin verschoben", mailTemplates.annaCancel(prettyDate(date, hour)));
        return ok({ message: "Abgesagt. Schüler bekommt Nachhol-Guthaben + Mail." });
      }
      if (s.fixedActive && !s.absage) {
        const sp = await getProfile(s.fixedActive.student_id);
        await service().from("appointments").insert({ student_id: s.fixedActive.student_id, slot_date: date, hour, kind: "absage", status: "abgesagt", credited: false, note: NOTE_ANNA_CANCEL });
        if (sp) await setBalance(sp.user_id, { makeup_credits: sp.makeup_credits + 1 });
        if (sp?.email) await sendMail(sp.email, "Termin verschoben", mailTemplates.annaCancel(prettyDate(date, hour)));
        return ok({ message: "Abgesagt. Schüler bekommt Nachhol-Guthaben (kein Minus) + Mail." });
      }
      return bad("Hier ist kein Termin zum Absagen.");
    }
    if (action === "block") {
      if (!validSlot) return bad("Ungültiger Slot.");
      const s = await inspectSlot(date, hour);
      if (s.block) return ok({ message: "Bereits geblockt." });
      if (s.booking || (s.fixedActive && !s.absage)) return bad("Slot ist belegt – kann nicht geblockt werden.");
      await service().from("appointments").insert({ student_id: null, slot_date: date, hour, kind: "block", status: "bestaetigt" });
      return ok({ message: "Slot geblockt." });
    }
    if (action === "unblock") {
      if (!validSlot) return bad("Ungültiger Slot.");
      await service().from("appointments").delete().eq("slot_date", date).eq("hour", hour).eq("kind", "block");
      return ok({ message: "Slot wieder frei." });
    }
    if (action === "createStudent") {
      const name = String(body.name || "").trim();
      const email = String(body.email || "").trim().toLowerCase();
      if (!name || !email) return bad("Name und E-Mail erforderlich.");
      const password = "LMA-" + crypto.randomUUID().slice(0, 8) + "!7";
      const { data: created, error } = await service().auth.admin.createUser({ email, password, email_confirm: true, user_metadata: { name } });
      if (error || !created.user) return bad("Konnte Zugang nicht anlegen: " + (error?.message || "unbekannt"));
      await service().from("profiles").insert({ user_id: created.user.id, name, email, role: "student" });
      const sent = await sendMail(email, "Dein Zugang zum Terminkalender", mailTemplates.invite(name, email, password));
      return ok({ message: `Schüler „${name}" angelegt.` + (sent ? " Einladung per Mail gesendet." : " (E-Mail konnte nicht gesendet werden – Passwort: " + password + ")") });
    }
    if (action === "overview") {
      const sb = service();
      const { data: studs } = await sb.from("profiles").select("user_id,name,minus_hours,plus_hours,makeup_credits").eq("role", "student").order("name");
      const { data: fx } = await sb.from("fixed_slots").select("student_id,weekday,hour").eq("status", "aktiv");
      const fixByStudent = new Map<string, string[]>();
      (fx || []).forEach((f: { student_id: string; weekday: number; hour: number }) => {
        const arr = fixByStudent.get(f.student_id) || [];
        arr.push(`${DAY_NAMES[f.weekday]} ${String(f.hour).padStart(2, "0")}:00`);
        fixByStudent.set(f.student_id, arr);
      });
      const rows = (studs || []).map((p: { user_id: string; name: string; minus_hours: number; plus_hours: number; makeup_credits: number }) => ({
        name: p.name, fix: (fixByStudent.get(p.user_id) || []).join(", ") || "—",
        minus: p.minus_hours, plus: p.plus_hours, nach: p.makeup_credits,
      }));
      return ok({ students: rows });
    }

    return bad("Unbekannte Aktion.");
  } catch (e) {
    console.error("[kalender] error:", e instanceof Error ? e.stack : String(e));
    return bad("Server-Fehler. Bitte erneut versuchen.", 500);
  }
}
