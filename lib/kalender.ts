// =============================================================================
// Terminkalender – gemeinsame Server-Logik (Supabase, Auth, E-Mail, Regeln)
// Wird von app/api/kalender/route.ts genutzt. NUR serverseitig!
// =============================================================================
import { createClient, type SupabaseClient, type User } from "@supabase/supabase-js";

// --- Konstanten -------------------------------------------------------------
export const ADMIN_EMAIL = (process.env.KALENDER_ADMIN_EMAIL || "lernemitanna@outlook.com").toLowerCase();
// Halbstunden-Raster: 8, 8.5 (=8:30), 9, … 19.5 (=19:30). Kommazahl = :30.
export const HOURS: number[] = [];
for (let h = 8; h <= 19.5; h += 0.5) HOURS.push(h);
// Schnellwahl-Vorschläge für die Stundenlänge; frei eintippbar ist alles
// von 15 bis 240 Minuten in 5-Minuten-Schritten (wie in Outlook)
export const DAUERN = [30, 45, 60, 90];
export function dauerOk(min: number): boolean {
  return Number.isInteger(min) && min >= 5 && min <= 300;
}
// Liegt eine (Komma-)Stunde auf einer vollen Minute? (16.55 = 16:33)
export function feinRasterOk(hour: number): boolean {
  return Number.isFinite(hour) && Math.abs(hour * 60 - Math.round(hour * 60)) < 0.01;
}
export const DAY_NAMES = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
const MAIL_FROM = process.env.KALENDER_FROM || "Lerne mit Anna <kalender@lernemitanna.de>";
const APP_URL = process.env.KALENDER_URL || "https://lernflix.lernemitanna.de/kalender";

// --- Supabase-Clients -------------------------------------------------------
let _service: SupabaseClient | null = null;
export function service(): SupabaseClient {
  if (_service) return _service;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY fehlen");
  _service = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  return _service;
}
let _auth: SupabaseClient | null = null;
function authClient(): SupabaseClient {
  if (_auth) return _auth;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("SUPABASE_URL / SUPABASE_ANON_KEY fehlen");
  _auth = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  return _auth;
}

// --- Auth -------------------------------------------------------------------
export type Profile = {
  user_id: string; name: string; email: string | null; role: "student" | "admin";
  minus_hours: number; plus_hours: number; makeup_credits: number;
};

export async function signIn(email: string, password: string) {
  const { data, error } = await authClient().auth.signInWithPassword({ email, password });
  if (error || !data.session) return null;
  return data.session; // access_token, refresh_token, expires_at
}
export async function refresh(refresh_token: string) {
  const { data, error } = await authClient().auth.refreshSession({ refresh_token });
  if (error || !data.session) return null;
  return data.session;
}
export async function userFromToken(token: string): Promise<User | null> {
  const { data, error } = await service().auth.getUser(token);
  if (error || !data.user) return null;
  return data.user;
}
export async function getProfile(userId: string): Promise<Profile | null> {
  const { data } = await service().from("profiles").select("*").eq("user_id", userId).maybeSingle();
  return (data as Profile) || null;
}

// --- Datum / Zeit (Europe/Berlin-bewusst, ohne externe Lib) -----------------
const pad = (n: number) => String(n).padStart(2, "0");
export function addDaysStr(dateStr: string, n: number): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const t = new Date(Date.UTC(y, m - 1, d) + n * 86400000);
  return `${t.getUTCFullYear()}-${pad(t.getUTCMonth() + 1)}-${pad(t.getUTCDate())}`;
}
// Wochentag 0=Mo .. 6=So
export function weekdayOf(dateStr: string): number {
  const [y, m, d] = dateStr.split("-").map(Number);
  return (new Date(Date.UTC(y, m - 1, d)).getUTCDay() + 6) % 7;
}
// Öffnungszeiten: Mo–Fr bis 20:00, Sa/So bis 19:00. Ein Termin passt, wenn
// Start UND Ende innerhalb liegen (dauerMin=30 prüft die einzelne Rasterzelle).
export function isOpen(weekday: number, hour: number, dauerMin = 30): boolean {
  const schluss = weekday < 5 ? 20 : 19;
  return hour >= 8 && hour * 2 === Math.floor(hour * 2) && hour + dauerMin / 60 <= schluss;
}
// "14:00" / "14:30" / "16:15" – minutengenau aus der Kommazahl-Stunde
export function fmtZeit(hour: number): string {
  const m = Math.round(hour * 60);
  return `${pad(Math.floor(m / 60))}:${pad(m % 60)}`;
}
// UTC-Instant der Berliner Wandzeit dateStr+hour (hour darf 14.5 = 14:30 sein)
export function berlinInstant(dateStr: string, hour: number): number {
  const [y, m, d] = dateStr.split("-").map(Number);
  const guess = Date.UTC(y, m - 1, d, 0, 0, 0) + hour * 3600000;
  const g = new Date(guess);
  const asUTC = new Date(g.toLocaleString("en-US", { timeZone: "UTC" })).getTime();
  const asBerlin = new Date(g.toLocaleString("en-US", { timeZone: "Europe/Berlin" })).getTime();
  return guess - (asBerlin - asUTC);
}
export function hoursUntil(dateStr: string, hour: number): number {
  return (berlinInstant(dateStr, hour) - Date.now()) / 3600000;
}
export function prettyDate(dateStr: string, hour: number): string {
  const [, m, d] = dateStr.split("-").map(Number);
  return `${DAY_NAMES[weekdayOf(dateStr)]} ${pad(d)}.${pad(m)}. um ${fmtZeit(hour)}`;
}

// --- E-Mail (Resend, best-effort) ------------------------------------------
export async function sendMail(to: string, subject: string, html: string, replyTo?: string): Promise<{ ok: boolean; error?: string }> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { ok: false, error: "RESEND_API_KEY fehlt in den Vercel-Umgebungsvariablen" };
  if (!to) return { ok: false, error: "keine Empfänger-Adresse" };
  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: MAIL_FROM, to, subject, html, ...(replyTo ? { reply_to: replyTo } : {}) }),
    });
    if (r.ok) return { ok: true };
    const txt = await r.text().catch(() => "");
    return { ok: false, error: `Resend ${r.status}: ${txt.slice(0, 220)}` };
  } catch (e) {
    return { ok: false, error: String(e).slice(0, 200) };
  }
}
function wrapMail(title: string, body: string): string {
  return `<div style="font-family:Inter,Arial,sans-serif;max-width:520px;margin:0 auto;color:#1a1a1a">
    <div style="background:linear-gradient(135deg,#2BB3C0,#3E7BB6);color:#fff;padding:22px 24px;border-radius:14px 14px 0 0">
      <div style="font-size:18px;font-weight:700">Lerne mit Anna</div></div>
    <div style="border:1px solid #eee;border-top:0;border-radius:0 0 14px 14px;padding:22px 24px">
      <h2 style="margin:0 0 12px;font-size:19px">${title}</h2>${body}
      <p style="margin:20px 0 0"><a href="${APP_URL}" style="display:inline-block;background:#2BB3C0;color:#fff;text-decoration:none;padding:11px 18px;border-radius:9px;font-weight:600">Zum Kalender</a></p>
    </div></div>`;
}
const ADDRESS_HTML = `<div style="background:#f4f6f7;border-radius:10px;padding:14px;margin:14px 0"><b>📍 Adresse (vor Ort):</b><br>Kohlbrennerstraße 16<br>81929 München<br>bei <b>Carciu/Sadikaj</b> bitte klingeln.</div>`;
const ONLINE_HTML = `<div style="background:#f4f6f7;border-radius:10px;padding:14px;margin:14px 0">💻 Der Termin findet <b>online</b> statt – du erhältst den Zugangslink rechtzeitig in einer separaten E-Mail.</div>`;
function contactBlock(mode?: string | null): string { return mode === "vor_ort" ? ADDRESS_HTML : mode === "online" ? ONLINE_HTML : ""; }

export const mailTemplates = {
  confirmed: (when: string, mode?: string | null) => wrapMail("Termin bestätigt ✓", `<p>Dein Termin am <b>${when}</b> ist bestätigt. Wir sehen uns!</p>` + contactBlock(mode)),
  probeConfirmed: (name: string, when: string, mode?: string | null) => wrapMail(`Danke, ${name}! 🎉`, `<p>Schön, dass du <b>Lerne mit Anna</b> kennenlernen möchtest! Deine <b>kostenlose Probestunde</b> am <b>${when}</b> ist bestätigt. Ich freue mich auf dich!</p>` + contactBlock(mode)),
  rejected: (when: string) => wrapMail("Termin abgesagt", `<p>Leider konnte dein angefragter Termin am <b>${when}</b> nicht bestätigt werden. Der Slot ist wieder frei – du kannst gern einen anderen wählen.</p>`),
  annaCancel: (when: string) => wrapMail("Termin verschoben", `<p>Dein Termin am <b>${when}</b> muss leider ausfallen. Du bekommst dafür eine <b>Nachhol-Stunde gutgeschrieben</b> (kein Minus) – buche einfach einen freien Slot.</p>`),
  probeReceived: (name: string, when: string) => wrapMail(`Danke, ${name}!`, `<p>Deine <b>Probestunde</b> am <b>${when}</b> ist angefragt. Kleana bestätigt sie in Kürze – du bekommst dann eine Bestätigung per E-Mail.</p>`),
  invite: (name: string, email: string, password: string) => wrapMail(`Willkommen, ${name}!`,
    `<p>Kleana hat dir einen Zugang zum Terminkalender angelegt. Damit siehst du deine Stunden und kannst Termine buchen oder absagen.</p>
     <p style="background:#f4f6f7;border-radius:10px;padding:14px"><b>E-Mail:</b> ${email}<br><b>Passwort:</b> ${password}</p>
     <p style="font-size:13px;color:#666">Bitte ändere dein Passwort nach dem ersten Login.</p>`),
};

// --- Wochen-Daten berechnen -------------------------------------------------
export type ApptRow = {
  id: string; student_id: string | null; slot_date: string; hour: number;
  kind: "einzel" | "probe" | "absage" | "block"; status: "angefragt" | "bestaetigt" | "abgesagt";
  mode?: string | null; note?: string | null; dauer_min?: number;
};
export const NOTE_ANNA_CANCEL = "anna_cancel"; // absage-Zeile, die Nachhol-Guthaben erzeugt hat
export type SlotState = "free" | "busy" | "req" | "block" | "closed" | "past";
// dauer = Terminlänge in Minuten (nur am Anker gesetzt); cont = Fortsetzungs-
// Zelle eines längeren Termins, anchor = Startzeit des zugehörigen Ankers
export type SlotOut = {
  hour: number; state: SlotState; name?: string; mine?: boolean; fixed?: boolean;
  mode?: string | null; weekly?: boolean; dauer?: number; cont?: boolean; anchor?: number;
};
// absagen (nur Admin-Sicht): abgesagte Stunden des Tages als rote Info-Blöcke –
// der Zeitraum bleibt trotzdem frei buchbar
export type AbsageOut = { start: number; dauer: number; name: string };
export type DayOut = { date: string; weekday: number; slots: SlotOut[]; absagen?: AbsageOut[] };

// Belegungs-Intervall eines Tages (Outlook-Stil: Termine sind Zeitblöcke)
type Intervall = {
  start: number; ende: number; t: "busy" | "req" | "block";
  sid: string; name: string; fixed: boolean; mode: string | null; dauer: number; weekly?: boolean;
};

// Alle Belegungen eines Tages als Intervalle (mit Namen für die Admin-Sicht).
// absagen = Anker (student|hour), die an diesem Datum abgesagt wurden.
export function tagIntervalle(
  date: string, wd: number,
  fixe: { student_id: string; weekday: number; hour: number; status: string; mode: string | null; dauer_min: number }[],
  dayAppts: ApptRow[],
  wblocks: { weekday: number; hour: number; dauer_min?: number }[],
  nameOf: (id: string) => string,
): Intervall[] {
  const ivs: Intervall[] = [];
  const absage = (sid: string, hour: number) =>
    dayAppts.some((a) => a.kind === "absage" && Number(a.hour) === hour && a.student_id === sid);
  // Blöcke: einzelnes Datum mit eigener Dauer; Dauer-Blöcke eine volle Stunde
  dayAppts.filter((a) => a.kind === "block" && a.status !== "abgesagt")
    .forEach((a) => {
      const dauer = Number(a.dauer_min) || 60;
      ivs.push({ start: Number(a.hour), ende: Number(a.hour) + dauer / 60, t: "block", sid: "", name: "", fixed: false, mode: null, dauer });
    });
  wblocks.filter((w) => w.weekday === wd)
    .forEach((w) => {
      const dauer = Number(w.dauer_min) || 60; // ohne V6-Migration: 60 Min.
      ivs.push({ start: Number(w.hour), ende: Number(w.hour) + dauer / 60, t: "block", sid: "", name: "", fixed: false, mode: null, dauer, weekly: true });
    });
  // Einzel-Buchungen und Probestunden
  dayAppts.filter((a) => (a.kind === "einzel" || a.kind === "probe") && a.status !== "abgesagt")
    .forEach((a) => {
      const name = a.student_id ? nameOf(a.student_id)
        : (a.kind === "probe" && a.note ? a.note.split("|")[0] + " (Probe)" : "Neu");
      const dauer = Number(a.dauer_min) || 60;
      ivs.push({ start: Number(a.hour), ende: Number(a.hour) + dauer / 60, t: a.status === "angefragt" ? "req" : "busy", sid: a.student_id || "", name, fixed: false, mode: a.mode ?? null, dauer });
    });
  // Feste Wochentermine (aktiv gewinnt über angefragt am selben Start;
  // eine Buchung am selben Start gewinnt, z. B. nach einer Absage)
  const sortiert = [...fixe.filter((f) => f.weekday === wd)].sort((a) => (a.status === "aktiv" ? -1 : 1));
  sortiert.forEach((f) => {
    const start = Number(f.hour);
    if (absage(f.student_id, start)) return;
    if (ivs.some((iv) => (iv.t === "busy" || iv.t === "req") && iv.start === start)) return;
    const dauer = Number(f.dauer_min) || 60;
    ivs.push({ start, ende: start + dauer / 60, t: f.status === "angefragt" ? "req" : "busy", sid: f.student_id, name: nameOf(f.student_id), fixed: true, mode: f.mode ?? null, dauer });
  });
  return ivs;
}

export async function buildWeek(monday: string, role: "public" | "student" | "admin", viewerId: string | null): Promise<DayOut[]> {
  const sb = service();
  const days: string[] = Array.from({ length: 7 }, (_, i) => addDaysStr(monday, i));
  const from = days[0], to = days[6];

  // feste Slots + Profile + Ereignisse + Dauer-Blocks parallel laden (schneller)
  const [fxRes, profRes, apptRes, wbRes, ovRes] = await Promise.all([
    sb.from("fixed_slots").select("student_id,weekday,hour,status,mode,dauer_min").in("status", ["aktiv", "angefragt"]),
    sb.from("profiles").select("user_id,name"),
    sb.from("appointments").select("id,student_id,slot_date,hour,kind,status,mode,note,dauer_min").gte("slot_date", from).lte("slot_date", to),
    // "*" statt fester Spalten: dauer_min kommt erst mit der V6-Migration,
    // vorher darf die Abfrage deswegen nicht fehlschlagen
    sb.from("weekly_blocks").select("*"),
    // Pro-Datum-Umstellungen (online/vor Ort) – Tabelle kommt mit der
    // V4-Migration; ohne sie liefert die Abfrage einfach einen Fehler und
    // wir zeigen den Grund-Modus des festen Termins
    sb.from("slot_mode_overrides").select("student_id,slot_date,hour,mode").gte("slot_date", from).lte("slot_date", to),
  ]);
  const overrides = new Map<string, string>();
  ((ovRes.data || []) as { student_id: string; slot_date: string; hour: number; mode: string }[])
    .forEach((o) => overrides.set(`${o.student_id}|${o.slot_date}-${Number(o.hour)}`, o.mode));
  const namen = new Map<string, string>();
  ((profRes.data || []) as { user_id: string; name: string }[]).forEach((p) => namen.set(p.user_id, p.name));
  const nameOf = (id: string) => namen.get(id) || "Schüler";
  const fixe = (fxRes.data || []) as { student_id: string; weekday: number; hour: number; status: string; mode: string | null; dauer_min: number }[];
  const wblocks = (wbRes.data || []) as { weekday: number; hour: number; dauer_min?: number }[];
  const appts = (apptRes.data || []) as ApptRow[];

  return days.map((date) => {
    const wd = weekdayOf(date);
    const dayAppts = appts.filter((a) => a.slot_date === date);
    const ivs = tagIntervalle(date, wd, fixe, dayAppts, wblocks, nameOf);
    const slots: SlotOut[] = HOURS.map((hour) => {
      if (!isOpen(wd, hour)) return { hour, state: "closed" };
      const past = hoursUntil(date, hour) <= 0;
      const anker = ivs.find((iv) => iv.start === hour);
      const deckt = anker || ivs.find((iv) => iv.start < hour && iv.ende > hour);
      if (!deckt) return { hour, state: past ? "past" : "free" };
      const iv = deckt;
      const basis: SlotOut = { hour, state: "busy", dauer: iv.dauer };
      if (!anker) { basis.cont = true; basis.anchor = iv.start; }
      // Rollen-Sicht
      if (iv.t === "block") {
        if (role === "admin") return { ...basis, state: "block", weekly: iv.weekly };
        return basis; // Schüler/öffentlich sehen "belegt"
      }
      // Pro-Datum-Umstellung gewinnt über den Grund-Modus des festen Termins
      const effMode = overrides.get(`${iv.sid}|${date}-${iv.start}`) ?? iv.mode;
      const mine = role === "student" && iv.sid === viewerId;
      if (role === "admin") return { ...basis, state: iv.t, name: iv.name, fixed: iv.fixed, mode: effMode };
      if (mine) return { ...basis, state: iv.t, mine: true, fixed: iv.fixed, mode: effMode };
      return basis; // andere Schüler / öffentlich: nur "belegt", KEIN Name
    });
    // Absagen als rote Info-Blöcke – nur für Kleana; Dauer aus dem festen
    // Termin bzw. der abgesagten Buchung (sonst 60 Min.)
    let absagen: AbsageOut[] | undefined;
    if (role === "admin") {
      absagen = dayAppts
        .filter((a) => a.kind === "absage" || ((a.kind === "einzel" || a.kind === "probe") && a.status === "abgesagt"))
        .map((a) => {
          const start = Number(a.hour);
          const fx = a.kind === "absage"
            ? fixe.find((f) => f.weekday === wd && Number(f.hour) === start && f.student_id === a.student_id)
            : undefined;
          const dauer = (a.kind !== "absage" && Number(a.dauer_min)) || (fx && Number(fx.dauer_min)) || 60;
          const name = a.student_id ? nameOf(a.student_id) : (a.note ? a.note.split("|")[0] : "Gast");
          return { start, dauer, name };
        });
      if (!absagen.length) absagen = undefined;
    }
    return { date, weekday: wd, slots, ...(absagen ? { absagen } : {}) };
  });
}

// Kollisions-Prüfung fürs Buchen: überschneidet [hour, hour+dauer) irgendeine
// bestehende Belegung des Tages? (Absagen geben den festen Termin frei.)
export async function slotKonflikt(date: string, hour: number, dauerMin: number): Promise<boolean> {
  const sb = service();
  const wd = weekdayOf(date);
  const [fxRes, apRes, wbRes] = await Promise.all([
    sb.from("fixed_slots").select("student_id,weekday,hour,status,mode,dauer_min").eq("weekday", wd).in("status", ["aktiv", "angefragt"]),
    sb.from("appointments").select("id,student_id,slot_date,hour,kind,status,mode,note,dauer_min").eq("slot_date", date),
    sb.from("weekly_blocks").select("*").eq("weekday", wd),
  ]);
  const ivs = tagIntervalle(
    date, wd,
    (fxRes.data || []) as { student_id: string; weekday: number; hour: number; status: string; mode: string | null; dauer_min: number }[],
    (apRes.data || []) as ApptRow[],
    (wbRes.data || []) as { weekday: number; hour: number; dauer_min?: number }[],
    () => "Schüler",
  );
  const ende = hour + dauerMin / 60;
  return ivs.some((iv) => iv.start < ende && iv.ende > hour);
}

// Datums-Listen für die Tooltips (Minus/Plus/Nachhol) eines Schülers
export async function balanceDates(studentId: string) {
  const sb = service();
  const { data } = await sb.from("appointments").select("slot_date,hour,kind,credited,counted,note,status")
    .eq("student_id", studentId).order("slot_date", { ascending: false }).limit(120);
  return groupBalanceDates((data || []) as BalRow[]);
}
type BalRow = { slot_date: string; hour: number; kind: string; credited: boolean; counted: string | null; note: string | null; status: string };
export function groupBalanceDates(rows: BalRow[]) {
  const minus: string[] = [], plus: string[] = [], nach: string[] = [];
  rows.forEach((a) => {
    const label = prettyDate(a.slot_date, a.hour).replace(" um ", ", ");
    if (a.kind === "absage" && a.credited) minus.push(label);
    else if (a.kind === "absage" && a.note === NOTE_ANNA_CANCEL) nach.push(label);
    // Plus nur für nicht-abgesagte Extra-Stunden (abgesagte wurden zurückgerechnet)
    if (a.counted === "plus" && a.status !== "abgesagt") plus.push(label);
  });
  return { minus, plus, nach };
}
