// =============================================================================
// Terminkalender – API (alle Aktionen über {action, ...})
// Läuft serverseitig mit Service-Role-Key; Geschäftslogik nicht manipulierbar.
// =============================================================================
import { NextResponse, after } from "next/server";
import {
  service, signInFlexibel, refresh, userFromToken, getProfile, buildWeek, balanceDates, groupBalanceDates,
  weekdayOf, hoursUntil, prettyDate, fmtZeit, slotKonflikt, dauerOk, feinRasterOk, DAY_NAMES,
  sendMail, mailTemplates, ADMIN_EMAIL, NOTE_ANNA_CANCEL, type Profile,
} from "@/lib/kalender";
import { nextLessonFor, syncLessons, gastLink, teamsLinkFuer } from "@/lib/stunden";
import { buchungErlaubtGesamt as buchungErlaubt, vorlageSenden } from "@/lib/zahlung";
import {
  verrechne, macheRueckgaengig, bewerteAbsage, verrechnungsVorschau,
  absageVorschau, warntVorLimit, freieGutschriften, MAX_MINUS, WARNUNG_AB_MINUS,
} from "@/lib/stundenkonto-kern";

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

/**
 * Stundenkonto schreiben.
 *
 * Der Fehler wurde hier frueher verschluckt: Als die Obergrenze im Code auf
 * vier stieg, die Datenbank aber noch drei erlaubte, waere die vierte
 * Gutschrift still verloren gegangen – die Schuelerin haette trotzdem
 * "gutgeschrieben" gelesen. Deshalb wird jetzt gemeldet, ob es geklappt hat.
 */
async function setBalance(
  id: string,
  patch: Partial<Pick<Profile, "minus_hours" | "plus_hours" | "makeup_credits">>,
): Promise<boolean> {
  const { error } = await service().from("profiles").update(patch).eq("user_id", id);
  if (error) console.error("Stundenkonto konnte nicht geschrieben werden:", error.message, patch);
  return !error;
}
// Einzel-Buchung verrechnen (bei Bestätigung): makeup -> minus -> sonst plus
// Die Regel selbst steht in lib/stundenkonto-kern.ts und ist dort getestet;
// hier bleibt nur das Schreiben in die Datenbank.
async function applyEinzelCounting(p: Profile): Promise<"makeup" | "minus" | "plus"> {
  const { counted, aenderung } = verrechne(p);
  await setBalance(p.user_id, aenderung);
  return counted;
}
// Verrechnung rückgängig machen (bei Absage einer Einzel-Buchung)
async function revertCounting(p: Profile, counted: string | null) {
  const aenderung = macheRueckgaengig(p, counted);
  if (aenderung) await setBalance(p.user_id, aenderung);
}

export async function POST(req: Request): Promise<Response> {
  let body: Record<string, unknown> = {};
  try { const r = await req.json(); if (r && typeof r === "object") body = r as Record<string, unknown>; } catch { /* {} */ }
  const action = String(body.action || "");
  const token = typeof body.token === "string" ? body.token : "";
  const date = typeof body.date === "string" ? body.date : "";
  const hour = Number(body.hour); // Kommazahl möglich: 14.5 = 14:30
  const mode = body.mode === "online" || body.mode === "vor_ort" ? body.mode : null;
  const dauerMin = dauerOk(Number(body.dauerMin)) ? Number(body.dauerMin) : 60;

  try {
    // ----- ohne Login -----
    if (action === "login") {
      const eingabe = String(body.email || "").trim().toLowerCase();
      const password = String(body.password || "");
      if (!eingabe || !password) return bad("Name (oder E-Mail) und Passwort erforderlich.");
      const session = await signInFlexibel(eingabe, password);
      if (!session) return bad("Name/E-Mail oder Passwort falsch.", 401);
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
        // Abgelaufener Token darf NICHT still zur öffentlichen Sicht führen –
        // 401 lässt den Client die Sitzung automatisch verlängern und erneut laden
        if (!user) return bad("Bitte einloggen.", 401);
        prof = await getProfile(user.id);
        if (prof) { role = prof.role === "admin" ? "admin" : "student"; viewerId = user.id; }
      }
      // TEMPO: alles parallel laden; die Stunden-Synchronisation läuft NACH
      // der Antwort (after) und gedrosselt – sie darf das Laden nie bremsen
      const istSchueler = role === "student" && !!prof;
      const [days, nextLesson, dates, myfixRes, meinTeams] = await Promise.all([
        buildWeek(monday, role, viewerId),
        viewerId ? nextLessonFor(viewerId) : Promise.resolve(null),
        istSchueler ? balanceDates(prof!.user_id) : Promise.resolve(null),
        istSchueler
          ? service().from("fixed_slots").select("weekday,hour,mode,dauer_min").eq("student_id", prof!.user_id).eq("status", "aktiv")
          : Promise.resolve({ data: null }),
        // Schüler bekommen ihren Teams-Link als festen Knopf in der Kopfzeile
        istSchueler ? teamsLinkFuer(prof!.user_id) : Promise.resolve(null),
      ]);
      if (viewerId) after(() => syncLessons());
      const out: Record<string, unknown> = { days, viewer: { role, name: prof?.name || null } };
      // Versions-Kennung der laufenden Server-Version: der Client erkennt
      // daran ein Update und laedt sich einmal selbst neu (wichtig fuer die
      // installierte App, die sonst lange auf altem Stand bleiben kann)
      out.version = process.env.VERCEL_GIT_COMMIT_SHA || "dev";
      if (nextLesson) out.nextLesson = nextLesson;
      if (meinTeams) out.teamsLink = meinTeams;
      if (istSchueler && dates) {
        const fix = ((myfixRes.data || []) as { weekday: number; hour: number; mode: string | null; dauer_min: number }[])
          .map((f) => ({ weekday: f.weekday, hour: Number(f.hour), mode: f.mode, dauer: Number(f.dauer_min) || 60 }));
        out.balance = { minus: prof!.minus_hours, plus: prof!.plus_hours, nach: prof!.makeup_credits, dates, fix };
      }
      return ok(out);
    }
    if (action === "requestProbe") {
      const name = String(body.name || "").trim();
      const email = String(body.email || "").trim().toLowerCase();
      const pSchluss = date && /^\d{4}-\d{2}-\d{2}$/.test(date) ? (weekdayOf(date) < 5 ? 20 : 19) : 0;
      if (!pSchluss || !feinRasterOk(hour) || hour < 8 || hour + dauerMin / 60 > pSchluss) return bad("Ungültiger Slot.");
      if (!name || !email) return bad("Bitte Name und E-Mail angeben.");
      if (!mode) return bad("Bitte online oder vor Ort wählen.");
      if (hoursUntil(date, hour) <= 0) return bad("Dieser Termin liegt in der Vergangenheit.");
      if (await slotKonflikt(date, hour, dauerMin)) return bad("Dieser Zeitraum ist leider schon belegt.");
      { const { error } = await service().from("appointments").insert({ student_id: null, slot_date: date, hour, kind: "probe", status: "angefragt", mode, dauer_min: dauerMin, note: `${name}|${email}` }); if (error) return bad("Speichern fehlgeschlagen: " + error.message); }
      after(() => sendMail(ADMIN_EMAIL, "Neue Probestunden-Anfrage", `${name} (${email}) möchte eine Probestunde am ${prettyDate(date, hour)} (${dauerMin} Min., ${mode === "online" ? "online" : "vor Ort"}). Bitte im Kalender bestätigen.`));
      after(() => sendMail(email, "Probestunde angefragt", mailTemplates.probeReceived(name, prettyDate(date, hour))));
      return ok({ message: "Probestunde angefragt! Kleana meldet sich per E-Mail bei dir." });
    }

    // ----- ab hier Login nötig -----
    const user = token ? await userFromToken(token) : null;
    if (!user) return bad("Bitte einloggen.", 401);
    const prof = await getProfile(user.id);
    if (!prof) return bad("Kein Zugang.", 403);
    const isAdmin = prof.role === "admin";
    // 5-Minuten-Raster für ALLE (auch Schüler): Start ab 8:00 bis vor
    // Ladenschluss; ob das ENDE noch passt, prüfen die Buchungs-Aktionen
    const datumOk = !!date && /^\d{4}-\d{2}-\d{2}$/.test(date);
    const schluss = datumOk ? (weekdayOf(date) < 5 ? 20 : 19) : 0;
    const validSlot = datumOk && feinRasterOk(hour) && hour >= 8 && hour < schluss;

    // === SCHÜLER-AKTIONEN ===
    if (action === "requestFixed") {
      // Schuljahresmodell: ohne bestaetigte AGB keine Buchung (Abschnitt 4)
      { const g = await buchungErlaubt(user.id); if (!g.erlaubt) return bad(g.grund || "Buchung derzeit nicht moeglich.", 403); }
      if (!validSlot || hour + dauerMin / 60 > schluss) return bad("Ungültiger Slot.");
      if (!mode) return bad("Bitte online oder vor Ort wählen.");
      const s = await inspectSlot(date, hour);
      if (await slotKonflikt(date, hour, dauerMin)) return bad("Dieser Zeitraum ist belegt.");
      const { data: mine } = await service().from("fixed_slots").select("id").eq("student_id", user.id).eq("weekday", s.wd).eq("hour", hour).in("status", ["aktiv", "angefragt"]);
      if (mine && mine.length) return bad("Du hast diesen Slot schon angefragt.");
      {
        // ab_datum = der Tag, den die Eltern beim Buchen angeklickt haben.
        // Ab genau dann existiert der Termin; fruehere Wochen zeigen ihn nie.
        // Fehlt die V8-Migration noch, wird ohne das Feld gespeichert (alter
        // Stand), statt die Buchung platzen zu lassen.
        let r = await service().from("fixed_slots").insert({ student_id: user.id, weekday: s.wd, hour, status: "angefragt", mode, dauer_min: dauerMin, ab_datum: date });
        if (r.error) r = await service().from("fixed_slots").insert({ student_id: user.id, weekday: s.wd, hour, status: "angefragt", mode, dauer_min: dauerMin });
        if (r.error) return bad("Speichern fehlgeschlagen: " + r.error.message);
      }
      after(() => sendMail(ADMIN_EMAIL, "Neue Anfrage: fester Termin", `${prof.name} möchte einen festen wöchentlichen Termin: ${prettyDate(date, hour)} (${dauerMin} Min., ${mode === "online" ? "online" : "vor Ort"}). Bitte im Kalender bestätigen.`));
      return ok({ message: "Fester Termin angefragt. Kleana bestätigt ihn." });
    }
    if (action === "bookExtra") {
      // Schuljahresmodell: ohne bestaetigte AGB keine Buchung (Abschnitt 4)
      { const g = await buchungErlaubt(user.id); if (!g.erlaubt) return bad(g.grund || "Buchung derzeit nicht moeglich.", 403); }
      if (!validSlot || hour + dauerMin / 60 > schluss) return bad("Ungültiger Slot.");
      if (!mode) return bad("Bitte online oder vor Ort wählen.");
      if (hoursUntil(date, hour) <= 0) return bad("Dieser Termin liegt in der Vergangenheit.");
      if (await slotKonflikt(date, hour, dauerMin)) return bad("Dieser Zeitraum ist belegt.");
      { const { error } = await service().from("appointments").insert({ student_id: user.id, slot_date: date, hour, kind: "einzel", status: "angefragt", mode, dauer_min: dauerMin }); if (error) return bad("Speichern fehlgeschlagen: " + error.message); }
      after(() => sendMail(ADMIN_EMAIL, "Neue Terminanfrage", `${prof.name} möchte am ${prettyDate(date, hour)} eine Stunde (${dauerMin} Min., ${mode === "online" ? "online" : "vor Ort"}). Bitte im Kalender bestätigen.`));
      const preview = verrechnungsVorschau(prof);
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

        // Bei vollem Stundenkonto verfaellt die Stunde ersatzlos. Das darf
        // niemanden ueberraschen: ohne ausdrueckliche Bestaetigung wird die
        // Absage abgelehnt und der Grund zurueckgemeldet.
        const vorschau = absageVorschau(prof, hu);
        if (vorschau.grund === "kontoVoll" && body.verfallBestaetigt !== true) {
          return NextResponse.json(
            { ok: false, error: vorschau.text, bestaetigungNoetig: true, grund: vorschau.grund },
            { status: 409 },
          );
        }

        const { gutschrift: credit, note: cnote, aenderung, text: absageText } = bewerteAbsage(prof, hu);
        await service().from("appointments").insert({ student_id: user.id, slot_date: date, hour, kind: "absage", status: "abgesagt", credited: credit, note: cnote });
        const kontoOk = aenderung ? await setBalance(user.id, aenderung) : true;

        // Frühwarnung: mit dieser Gutschrift ist nur noch eine frei.
        const danach = { ...prof, ...(aenderung ?? {}) };
        if (credit && warntVorLimit(danach) && prof.email) {
          const frei = freieGutschriften(danach);
          after(() => vorlageSenden("minusWarnung", prof.email as string, {
            name: prof.name,
            offen: String(danach.minus_hours),
            frei: String(frei),
            grenze: String(MAX_MINUS),
          }));
        }

        after(() => sendMail(ADMIN_EMAIL, "Schüler-Absage", `${prof.name} hat den Termin ${prettyDate(date, hour)} abgesagt${credit ? " (>4 Std. → Minus-Stunde gutgeschrieben)" : " (<4 Std. → keine Gutschrift)"}.`));
        return ok({
          message: kontoOk ? absageText
            : absageText + " ACHTUNG: Die Gutschrift konnte nicht gespeichert werden – bitte melde dich kurz bei Anna.",
        });
      }
      return bad("Hier ist kein eigener Termin.");
    }

    if (action === "setMode") {
      // Eine KONKRETE Stunde auf online/vor Ort umstellen (jederzeit bis
      // Stundenbeginn). Der feste Wochentermin bleibt unverändert – nur
      // dieses eine Datum bekommt eine Umstellung. Kleana wird per E-Mail
      // und mit einem Hinweis im Klassenzimmer-Chat informiert.
      if (!validSlot) return bad("Ungültiger Slot.");
      if (!mode) return bad("Bitte online oder vor Ort wählen.");
      if (hoursUntil(date, hour) <= 0) return bad("Diese Stunde liegt in der Vergangenheit.");
      let sid = user.id;
      if (isAdmin && typeof body.studentId === "string" && body.studentId) sid = body.studentId;
      const s = await inspectSlot(date, hour);
      const eigene = (s.booking && s.booking.status !== "abgesagt" && s.booking.student_id === sid)
        || (s.fixedActive && s.fixedActive.student_id === sid && !s.absage);
      if (!eigene) return bad("Hier ist keine eigene Stunde.");
      { const { error } = await service().from("slot_mode_overrides")
          .upsert({ student_id: sid, slot_date: date, hour, mode }, { onConflict: "student_id,slot_date,hour" });
        if (error) return bad("Umstellen fehlgeschlagen: " + error.message); }
      if (s.booking && s.booking.student_id === sid) {
        await service().from("appointments").update({ mode }).eq("id", s.booking.id);
      }
      await syncLessons(true); // Stunde im Klassenzimmer sofort anlegen/nachziehen
      const wann = prettyDate(date, hour);
      const txt = mode === "online" ? "online" : "vor Ort";
      if (!isAdmin) {
        after(() => sendMail(ADMIN_EMAIL, `Stunde umgestellt: ${txt}`,
          `${prof.name} hat die Stunde am ${wann} auf <b>${txt}</b> umgestellt.`));
        after(async () => {
          try {
            await service().from("class_messages").insert({
              student_id: sid, sender_id: sid,
              body: mode === "online"
                ? `📢 Ich habe unsere Stunde am ${wann} auf ONLINE umgestellt – wir sehen uns im Klassenzimmer! 💻`
                : `📢 Ich habe unsere Stunde am ${wann} wieder auf VOR ORT umgestellt. 🏫`,
            });
          } catch { /* Klassenzimmer-Migration fehlt evtl. noch */ }
        });
      }
      return ok({ message: mode === "online"
        ? `Deine Stunde am ${wann} ist jetzt ONLINE 💻 – Kleana bekommt Bescheid. Du trittst über das Klassenzimmer bei.`
        : `Deine Stunde am ${wann} ist jetzt wieder VOR ORT 🏫 – Kleana bekommt Bescheid.` });
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

    if (action === "setTeamsLink") {
      // Teams statt eingebautem Video: Link pro Schüler – oder ohne
      // studentId als Kleanas Standard-Link für alle
      const link = String(body.link || "").trim();
      if (link && !/^https:\/\//i.test(link)) return bad("Bitte den vollständigen Teams-Link einfügen (beginnt mit https://).");
      const sid = String(body.studentId || "");
      const ziel = /^[0-9a-f-]{36}$/i.test(sid) ? sid : user.id;
      const { error } = await service().from("profiles").update({ teams_link: link || null }).eq("user_id", ziel);
      if (error) return bad(/teams_link/.test(error.message)
        ? "Bitte zuerst das SQL „kalender_v7“ in Supabase ausführen (steht im Chat)."
        : "Speichern fehlgeschlagen: " + error.message);
      return ok({ message: link ? "Teams-Link gespeichert ✓" : "Teams-Link entfernt." });
    }

    if (action === "deleteStudent") {
      // Bewusst KEIN endgültiges Löschen: Verträge, Zahlungen, Termine und
      // der Klassenzimmer-Verlauf hängen an diesem Konto (teils mit
      // "on delete cascade") und wären sonst unwiderruflich weg. Stattdessen
      // wird das Konto gesperrt (neues Zufalls-Passwort, kein Login mehr
      // möglich) und aus den Übersichten ausgeblendet – "restoreStudent"
      // macht das jederzeit rückgängig, alle Daten bleiben unangetastet.
      const sid = String(body.studentId || "");
      if (!sid) return bad("Kein Schüler angegeben.");
      const p = await getProfile(sid);
      if (!p || p.role === "admin") return bad("Nicht erlaubt.");
      await service().auth.admin.updateUserById(sid, { password: crypto.randomUUID() }).catch(() => null);
      const { error } = await service().from("profiles").update({ deleted_at: new Date().toISOString() }).eq("user_id", sid);
      if (error) return bad("Konnte nicht entfernt werden: " + error.message, 500);
      return ok({ message: `Schüler „${p.name}" entfernt. Verträge, Zahlungen und der Verlauf bleiben erhalten – bei Bedarf kann das Konto wiederhergestellt werden.` });
    }

    if (action === "restoreStudent") {
      const sid = String(body.studentId || "");
      if (!sid) return bad("Kein Schüler angegeben.");
      const { data: p } = await service().from("profiles").select("name").eq("user_id", sid).maybeSingle();
      if (!p) return bad("Nicht gefunden.");
      const neuesPw = crypto.randomUUID().slice(0, 12);
      await service().auth.admin.updateUserById(sid, { password: neuesPw }).catch(() => null);
      const { error } = await service().from("profiles").update({ deleted_at: null }).eq("user_id", sid);
      if (error) return bad("Konnte nicht wiederhergestellt werden: " + error.message, 500);
      return ok({ message: `Schüler „${p.name}" wiederhergestellt. Neues Passwort: ${neuesPw}`, password: neuesPw });
    }

    if (action === "adminBook") {
      // Kleana trägt selbst einen Termin für einen Schüler ein – Start im
      // 5-Minuten-Raster (z. B. 8:05), sofort bestätigt (keine Anfrage).
      if (!validSlot || hour + dauerMin / 60 > schluss) return bad("Ungültiger Slot.");
      if (!mode) return bad("Bitte online oder vor Ort wählen.");
      const sid = String(body.studentId || "");
      const sp = await getProfile(sid);
      if (!sp || sp.role === "admin") return bad("Bitte einen Schüler wählen.");
      if (await slotKonflikt(date, hour, dauerMin)) return bad("Dieser Zeitraum ist belegt.");
      if (body.fest === true) {
      // Schuljahresmodell: ohne bestaetigte AGB keine Buchung (Abschnitt 4)
      { const g = await buchungErlaubt(sid); if (!g.erlaubt) return bad(g.grund || "Buchung derzeit nicht moeglich.", 403); }
        // Der angeklickte Tag ist der erste Geltungstag des festen Termins.
        let r = await service().from("fixed_slots").insert({
          student_id: sid, weekday: weekdayOf(date), hour, status: "aktiv", mode, dauer_min: dauerMin, ab_datum: date,
        });
        if (r.error) r = await service().from("fixed_slots").insert({
          student_id: sid, weekday: weekdayOf(date), hour, status: "aktiv", mode, dauer_min: dauerMin,
        });
        if (r.error) return bad("Eintragen fehlgeschlagen: " + r.error.message);
        if (sp.email) { const em = sp.email, tl = await teamsLinkFuer(sid); after(() => sendMail(em, "Fester Termin eingetragen", mailTemplates.confirmed(`${DAY_NAMES[weekdayOf(date)]} ${fmtZeit(hour)} (wöchentlich)`, mode, tl))); }
        await syncLessons(true);
        return ok({ message: `Fester Termin für ${sp.name} eingetragen – ab jetzt jede Woche. Mail gesendet.` });
      }
      if (hoursUntil(date, hour) <= 0) return bad("Dieser Termin liegt in der Vergangenheit.");
      const counted = await applyEinzelCounting(sp);
      { const { error } = await service().from("appointments").insert({
          student_id: sid, slot_date: date, hour, kind: "einzel", status: "bestaetigt", mode, dauer_min: dauerMin, counted,
        });
        if (error) { await revertCounting(sp, counted); return bad("Eintragen fehlgeschlagen: " + error.message); } }
      if (sp.email) { const em = sp.email, tl = await teamsLinkFuer(sid); after(() => sendMail(em, "Termin eingetragen", mailTemplates.confirmed(prettyDate(date, hour), mode, tl))); }
      await syncLessons(true);
      return ok({ message: `Stunde für ${sp.name} eingetragen und bestätigt. Mail gesendet.` });
    }

    if (action === "createCall") {
      // Video-Call für Probestunde/Masterclass anlegen: Stunde (kind webinar)
      // ohne festen Schüler. Bewusst OHNE Zeitfenster: der Gast-Link
      // funktioniert sofort und dauerhaft (bis der Call gelöscht wird) –
      // egal ob die Stunde 10 Minuten länger dauert. Die Zeiten unten sind
      // nur nominell (Pflichtfelder der Tabelle).
      const titel = String(body.title || "").trim().slice(0, 80) || "Video-Call";
      const jetzt = Date.now();
      const { data: neu, error } = await service().from("lessons").insert({
        teacher_id: user.id, student_id: null, kind: "webinar", mode: "online",
        title: titel, starts_at: new Date(jetzt).toISOString(),
        ends_at: new Date(jetzt + 2 * 3600000).toISOString(),
      }).select("id").single();
      if (error || !neu) return bad("Konnte den Call nicht anlegen: " + (error?.message || "unbekannt"));
      const base = new URL(process.env.KALENDER_URL || "https://lernflix.lernemitanna.de/kalender").origin;
      return ok({
        message: "Video-Call angelegt. Verschicke jetzt den Gast-Link.",
        link: gastLink(neu.id, base), id: neu.id,
      });
    }
    if (action === "callList") {
      // Alle Calls samt Gast-Links (bleiben gelistet, bis sie gelöscht werden)
      const { data } = await service().from("lessons")
        .select("id,title,created_at")
        .eq("kind", "webinar")
        .order("created_at", { ascending: false }).limit(20);
      const base = new URL(process.env.KALENDER_URL || "https://lernflix.lernemitanna.de/kalender").origin;
      return ok({
        calls: ((data || []) as { id: string; title: string; created_at: string }[])
          .map((c) => ({ ...c, link: gastLink(c.id, base) })),
      });
    }
    if (action === "deleteCall") {
      const cid = String(body.callId || "");
      if (!/^[0-9a-f-]{36}$/i.test(cid)) return bad("Call nicht gefunden.");
      await service().from("lessons").delete().eq("id", cid).eq("kind", "webinar");
      return ok({ message: "Video-Call gelöscht – der Link funktioniert nicht mehr." });
    }

    if (action === "adminConfirm") {
      if (!validSlot) return bad("Ungültiger Slot.");
      const s = await inspectSlot(date, hour);
      if (s.booking && s.booking.status === "angefragt") {
        if (s.booking.kind === "probe") {
          await service().from("appointments").update({ status: "bestaetigt" }).eq("id", s.booking.id);
          const gname = (s.booking.note || "").split("|")[0] || "";
          const email = (s.booking.note || "").split("|")[1];
          if (email) { const tl = await teamsLinkFuer(null); after(() => sendMail(email, "Deine Probestunde ist bestätigt ✓", mailTemplates.probeConfirmed(gname, prettyDate(date, hour), s.booking!.mode, tl))); }
          return ok({ message: "Probestunde bestätigt. Bestätigungs-Mail gesendet." });
        }
        const sp = await getProfile(s.booking.student_id || "");
        let counted: string | null = null;
        if (sp) counted = await applyEinzelCounting(sp);
        await service().from("appointments").update({ status: "bestaetigt", counted }).eq("id", s.booking.id);
        if (sp?.email) { const em = sp.email, md = s.booking.mode, tl = await teamsLinkFuer(sp.user_id); after(() => sendMail(em, "Termin bestätigt", mailTemplates.confirmed(prettyDate(date, hour), md, tl))); }
        return ok({ message: "Bestätigt. Bestätigungs-Mail gesendet." });
      }
      if (s.fixedPending) {
        if (s.fixedActive) return bad("Slot ist schon fest vergeben.");
      // Schuljahresmodell: ohne bestaetigte AGB keine Buchung (Abschnitt 4)
      { const g = await buchungErlaubt(s.fixedPending.student_id); if (!g.erlaubt) return bad(g.grund || "Buchung derzeit nicht moeglich.", 403); }
        await service().from("fixed_slots").update({ status: "aktiv" }).eq("id", s.fixedPending.id);
        const sp = await getProfile(s.fixedPending.student_id);
        if (sp?.email) { const em = sp.email, md = s.fixedPending.mode, tl = await teamsLinkFuer(sp.user_id); after(() => sendMail(em, "Fester Termin bestätigt", mailTemplates.confirmed(`${DAY_NAMES[s.wd]} ${fmtZeit(hour)} (wöchentlich)`, md, tl))); }
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
        if (sp?.email) { const em = sp.email; after(() => sendMail(em, "Anfrage abgesagt", mailTemplates.rejected(`${DAY_NAMES[s.wd]} ${fmtZeit(hour)}`))); }
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
      // Blockieren minutengenau: Start im 5-Minuten-Raster, Dauer ab 5 Min.
      if (!validSlot || hour + dauerMin / 60 > schluss) return bad("Ungültiger Slot.");
      const s = await inspectSlot(date, hour);
      if (s.block || s.weeklyBlock) return ok({ message: "Bereits geblockt." });
      if (await slotKonflikt(date, hour, dauerMin)) return bad("Zeitraum ist belegt – kann nicht geblockt werden.");
      await service().from("appointments").insert({ student_id: null, slot_date: date, hour, kind: "block", status: "bestaetigt", dauer_min: dauerMin });
      const endeMin = Math.round(hour * 60 + dauerMin);
      const ende = `${String(Math.floor(endeMin / 60)).padStart(2, "0")}:${String(endeMin % 60).padStart(2, "0")}`;
      return ok({ message: `Geblockt: ${fmtZeit(hour)}–${ende} (nur dieses Datum).` });
    }
    if (action === "unblock") {
      if (!validSlot) return bad("Ungültiger Slot.");
      await service().from("appointments").delete().eq("slot_date", date).eq("hour", hour).eq("kind", "block");
      return ok({ message: "Slot wieder frei." });
    }
    if (action === "blockWeekly") {
      // Dauerhaft blockieren – minutengenau wie der Einmal-Block (z. B. 15 Min.)
      if (!validSlot || hour + dauerMin / 60 > schluss) return bad("Ungültiger Slot.");
      if (await slotKonflikt(date, hour, dauerMin)) return bad("Zeitraum ist belegt – kann nicht dauerhaft geblockt werden.");
      const wtag = weekdayOf(date);
      let { error } = await service().from("weekly_blocks").insert({ weekday: wtag, hour, dauer_min: dauerMin });
      if (error && /dauer_min|hour_check/i.test(error.message)) {
        // Die V6-Migration fehlt noch: ohne sie kennt die Tabelle keine Dauer
        // und nur volle/halbe Start-Stunden
        if (dauerMin === 60 && Number.isInteger(hour * 2)) {
          ({ error } = await service().from("weekly_blocks").insert({ weekday: wtag, hour }));
        } else {
          return bad("Dafür bitte zuerst das neue SQL „kalender_v6“ in Supabase ausführen (steht im Chat) – danach klappen freie Minuten auch bei Dauer-Blockierungen.");
        }
      }
      if (error && !/duplicate|unique/i.test(error.message)) return bad("Fehler: " + error.message);
      const endeMin = Math.round(hour * 60 + dauerMin);
      const ende = `${String(Math.floor(endeMin / 60)).padStart(2, "0")}:${String(endeMin % 60).padStart(2, "0")}`;
      return ok({ message: `Dauerhaft geblockt – jeden ${DAY_NAMES[wtag]} ${fmtZeit(hour)}–${ende}.` });
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
      let userId = created?.user?.id || "";
      if (error && /already|registered|exists|taken/i.test(error.message)) {
        // Geschwister-Kind: gleiche Eltern-E-Mail wie ein bestehendes Konto.
        // Der Login läuft intern über eine Ersatz-Adresse; eingeloggt wird
        // weiter mit der echten E-Mail – das Passwort entscheidet, welches
        // Kind gemeint ist. Alle Mails gehen an die echte Adresse.
        const ersatz = `kind-${crypto.randomUUID().slice(0, 12)}@login.lernemitanna.de`;
        const r2 = await service().auth.admin.createUser({ email: ersatz, password, email_confirm: true, user_metadata: { name, familien_email: email } });
        if (r2.error || !r2.data.user) return bad("Konnte Zugang nicht anlegen: " + (r2.error?.message || "unbekannt"));
        userId = r2.data.user.id;
      } else if (error || !userId) return bad("Konnte Zugang nicht anlegen: " + (error?.message || "unbekannt"));
      { const { error: pe } = await service().from("profiles").insert({ user_id: userId, name, email, role: "student" }); if (pe) return bad("Profil konnte nicht angelegt werden: " + pe.message); }
      const mail = await sendMail(email, "Dein Zugang zum Terminkalender", mailTemplates.invite(name, email, password));
      const info = mail.ok
        ? "Die Einladung mit dem Passwort wurde auch per Mail an den Schüler gesendet (ggf. Spam-Ordner prüfen)."
        : `Mail nicht gesendet – Grund: ${mail.error}. Bitte gib dem Schüler das Passwort oben selbst weiter.`;
      return ok({ message: `Schüler ${name} angelegt.\n\nAnmeldename: ${name}\nStart-Passwort: ${password}\nE-Mail (für Benachrichtigungen): ${email}\n\n${info}\nEingeloggt wird mit dem Namen und dem Passwort. Der Schüler kann das Passwort nach dem ersten Login selbst ändern.`, password });
    }
    if (action === "overview") {
      const sb = service();
      // "*" statt fester Spalten: teams_link kommt erst mit der V7-Migration.
      // deleted_at (Sicherheit V1) erst versucht zu filtern, sonst ohne Filter
      // weiter – so bricht nichts, solange die Migration noch nicht lief.
      let studsRes = await sb.from("profiles").select("*").eq("role", "student").is("deleted_at", null).order("name");
      if (studsRes.error) studsRes = await sb.from("profiles").select("*").eq("role", "student").order("name");
      const studs = studsRes.data;
      const { data: fx } = await sb.from("fixed_slots").select("student_id,weekday,hour,mode,dauer_min").eq("status", "aktiv");
      const { data: allAppts } = await sb.from("appointments").select("student_id,slot_date,hour,kind,credited,counted,note,status").order("slot_date", { ascending: false }).limit(2000);
      const apptsByStudent = new Map<string, { slot_date: string; hour: number; kind: string; credited: boolean; counted: string | null; note: string | null; status: string }[]>();
      (allAppts || []).forEach((a: { student_id: string | null; slot_date: string; hour: number; kind: string; credited: boolean; counted: string | null; note: string | null; status: string }) => {
        if (!a.student_id) return;
        const arr = apptsByStudent.get(a.student_id) || []; arr.push(a); apptsByStudent.set(a.student_id, arr);
      });
      const fixByStudent = new Map<string, string[]>();
      (fx || []).forEach((f: { student_id: string; weekday: number; hour: number; mode: string | null; dauer_min: number }) => {
        const arr = fixByStudent.get(f.student_id) || [];
        const m = f.mode === "online" ? " · online" : f.mode === "vor_ort" ? " · vor Ort" : "";
        const d = Number(f.dauer_min) || 60;
        arr.push(`${DAY_NAMES[f.weekday]} ${fmtZeit(Number(f.hour))}${d !== 60 ? ` (${d} Min.)` : ""}${m}`);
        fixByStudent.set(f.student_id, arr);
      });
      const rows = (studs || []).map((p: { user_id: string; name: string; minus_hours: number; plus_hours: number; makeup_credits: number; teams_link?: string | null }) => {
        const d = groupBalanceDates(apptsByStudent.get(p.user_id) || []);
        return {
          id: p.user_id, name: p.name, fix: (fixByStudent.get(p.user_id) || []).join(", ") || "—",
          minus: p.minus_hours, plus: p.plus_hours, nach: p.makeup_credits,
          minusD: d.minus, plusD: d.plus, nachD: d.nach,
          teams: p.teams_link || null,
        };
      });
      // Kleanas eigener Link = Standard für alle ohne eigenen Link
      const teamsDefault = (prof as Profile & { teams_link?: string | null }).teams_link || null;
      return ok({ students: rows, teamsDefault });
    }

    if (action === "exportKalenderCsv") {
      // Eigene Sicherheitskopie für Kleana: pro Vertrag/Schüler offene
      // Minus-Stunden, fester Wochentermin und alle Absagen/Nachholtermine –
      // dieselben Zahlen wie in der Übersicht oben, nur als CSV zum Behalten.
      const sb = service();
      let studsRes = await sb.from("profiles").select("*").eq("role", "student").is("deleted_at", null).order("name");
      if (studsRes.error) studsRes = await sb.from("profiles").select("*").eq("role", "student").order("name");
      const studs = studsRes.data || [];
      const [fxRes, allApptsRes] = await Promise.all([
        sb.from("fixed_slots").select("student_id,weekday,hour,mode,dauer_min").eq("status", "aktiv"),
        sb.from("appointments").select("student_id,slot_date,hour,kind,credited,counted,note,status").order("slot_date", { ascending: false }).limit(5000),
      ]);
      const apptsByStudent = new Map<string, { slot_date: string; hour: number; kind: string; credited: boolean; counted: string | null; note: string | null; status: string }[]>();
      (allApptsRes.data || []).forEach((a: { student_id: string | null; slot_date: string; hour: number; kind: string; credited: boolean; counted: string | null; note: string | null; status: string }) => {
        if (!a.student_id) return;
        const arr = apptsByStudent.get(a.student_id) || []; arr.push(a); apptsByStudent.set(a.student_id, arr);
      });
      const fixByStudent = new Map<string, string>();
      (fxRes.data || []).forEach((f: { student_id: string; weekday: number; hour: number; mode: string | null; dauer_min: number }) => {
        const m = f.mode === "online" ? " (online)" : f.mode === "vor_ort" ? " (vor Ort)" : "";
        const d = Number(f.dauer_min) || 60;
        fixByStudent.set(f.student_id, `${DAY_NAMES[f.weekday]} ${fmtZeit(Number(f.hour))}${d !== 60 ? ` ${d} Min.` : ""}${m}`);
      });
      const zelle = (v: string) => `"${v.replace(/"/g, '""')}"`;
      const zeilen = [["Schüler", "Fester Wochentermin", "Minus-Stunden offen", "Plus-Stunden", "Nachhol-Guthaben offen", "Minus-Termine (Absagen)", "Plus-Termine", "Nachhol-Termine (Kleana-Absagen)"].map(zelle).join(",")];
      (studs as { user_id: string; name: string; minus_hours: number; plus_hours: number; makeup_credits: number }[]).forEach((p) => {
        const d = groupBalanceDates(apptsByStudent.get(p.user_id) || []);
        zeilen.push([
          p.name, fixByStudent.get(p.user_id) || "kein fester Termin",
          String(p.minus_hours), String(p.plus_hours), String(p.makeup_credits),
          d.minus.join(" | "), d.plus.join(" | "), d.nach.join(" | "),
        ].map(zelle).join(","));
      });
      return ok({ csv: "﻿" + zeilen.join("\r\n"), dateiname: `kalenderstand-${new Date().toISOString().slice(0, 10)}.csv` });
    }

    if (action === "deletedStudents") {
      // Entfernte Schüler wieder anzeigbar machen – nichts ist endgültig weg.
      const r = await service().from("profiles").select("user_id,name,deleted_at")
        .eq("role", "student").not("deleted_at", "is", null).order("deleted_at", { ascending: false });
      if (r.error) return ok({ students: [] }); // Migration fehlt noch – einfach leer
      return ok({ students: (r.data || []).map((p: { user_id: string; name: string; deleted_at: string }) => ({ id: p.user_id, name: p.name, deletedAt: p.deleted_at })) });
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
      if (field === "minus" && nv > MAX_MINUS) nv = MAX_MINUS;
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
