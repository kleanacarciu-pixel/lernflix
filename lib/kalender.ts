// =============================================================================
// Terminkalender – gemeinsame Server-Logik (Supabase, Auth, E-Mail, Regeln)
// Wird von app/api/kalender/route.ts genutzt. NUR serverseitig!
// =============================================================================
import { createClient, type SupabaseClient, type User } from "@supabase/supabase-js";

// --- Konstanten -------------------------------------------------------------
export const ADMIN_EMAIL = (process.env.KALENDER_ADMIN_EMAIL || "lernemitanna@outlook.com").toLowerCase();
export const HOURS = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
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
export function isOpen(weekday: number, hour: number): boolean {
  return weekday < 5 ? hour >= 13 && hour <= 19 : hour >= 9 && hour <= 18;
}
// UTC-Instant der Berliner Wandzeit dateStr+hour
function berlinInstant(dateStr: string, hour: number): number {
  const [y, m, d] = dateStr.split("-").map(Number);
  const guess = Date.UTC(y, m - 1, d, hour, 0, 0);
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
  return `${DAY_NAMES[weekdayOf(dateStr)]} ${pad(d)}.${pad(m)}. um ${pad(hour)}:00`;
}

// --- E-Mail (Resend, best-effort) ------------------------------------------
export async function sendMail(to: string, subject: string, html: string): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  if (!key || !to) return false;
  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: MAIL_FROM, to, subject, html }),
    });
    return r.ok;
  } catch {
    return false;
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
export const mailTemplates = {
  confirmed: (when: string) => wrapMail("Termin bestätigt ✓", `<p>Dein Termin am <b>${when}</b> ist bestätigt. Wir sehen uns!</p>`),
  rejected: (when: string) => wrapMail("Termin abgesagt", `<p>Leider konnte dein angefragter Termin am <b>${when}</b> nicht bestätigt werden. Der Slot ist wieder frei – du kannst gern einen anderen wählen.</p>`),
  annaCancel: (when: string) => wrapMail("Termin verschoben", `<p>Dein Termin am <b>${when}</b> muss leider ausfallen. Du bekommst dafür eine <b>Nachhol-Stunde gutgeschrieben</b> (kein Minus) – buche einfach einen freien Slot.</p>`),
  invite: (name: string, email: string, password: string) => wrapMail(`Willkommen, ${name}!`,
    `<p>Kleana hat dir einen Zugang zum Terminkalender angelegt. Damit siehst du deine Stunden und kannst Termine buchen oder absagen.</p>
     <p style="background:#f4f6f7;border-radius:10px;padding:14px"><b>E-Mail:</b> ${email}<br><b>Passwort:</b> ${password}</p>
     <p style="font-size:13px;color:#666">Bitte ändere dein Passwort nach dem ersten Login.</p>`),
};

// --- Wochen-Daten berechnen -------------------------------------------------
export type ApptRow = {
  id: string; student_id: string | null; slot_date: string; hour: number;
  kind: "einzel" | "probe" | "absage" | "block"; status: "angefragt" | "bestaetigt" | "abgesagt";
  note?: string | null;
};
export const NOTE_ANNA_CANCEL = "anna_cancel"; // absage-Zeile, die Nachhol-Guthaben erzeugt hat
export type SlotState = "free" | "busy" | "req" | "block" | "closed" | "past";
export type SlotOut = { hour: number; state: SlotState; name?: string; mine?: boolean; fixed?: boolean };
export type DayOut = { date: string; weekday: number; slots: SlotOut[] };

// Rohzustand eines Slots (ohne Rollen-Sicht)
type Raw =
  | { t: "free" }
  | { t: "block" }
  | { t: "busy" | "req"; sid: string; name: string; fixed: boolean };

export function computeRaw(
  dateStr: string, hour: number,
  fixedMap: Map<string, { sid: string; name: string; status: string }>,
  apptMap: Map<string, ApptRow[]>,
): Raw {
  const list = apptMap.get(`${dateStr}-${hour}`) || [];
  if (list.some((a) => a.kind === "block" && a.status !== "abgesagt")) return { t: "block" };
  const booking = list.find((a) => (a.kind === "einzel" || a.kind === "probe") && a.status !== "abgesagt");
  const absage = list.some((a) => a.kind === "absage");
  if (booking) {
    const name = booking.student_id ? nameCache.get(booking.student_id) || "Schüler" : "Neu";
    return { t: booking.status === "angefragt" ? "req" : "busy", sid: booking.student_id || "", name, fixed: false };
  }
  const fx = fixedMap.get(`${weekdayOf(dateStr)}-${hour}`);
  if (fx && !absage) {
    return { t: fx.status === "angefragt" ? "req" : "busy", sid: fx.sid, name: fx.name, fixed: true };
  }
  return { t: "free" };
}

// Namens-Cache pro Request (student_id -> name), wird von buildWeek gefüllt
const nameCache = new Map<string, string>();

export async function buildWeek(monday: string, role: "public" | "student" | "admin", viewerId: string | null): Promise<DayOut[]> {
  const sb = service();
  const days: string[] = Array.from({ length: 7 }, (_, i) => addDaysStr(monday, i));
  const from = days[0], to = days[6];

  // feste Slots (aktiv + angefragt) mit Namen
  const { data: fixedRows } = await sb.from("fixed_slots").select("student_id,weekday,hour,status").in("status", ["aktiv", "angefragt"]);
  const { data: profs } = await sb.from("profiles").select("user_id,name");
  nameCache.clear();
  (profs || []).forEach((p: { user_id: string; name: string }) => nameCache.set(p.user_id, p.name));
  const fixedMap = new Map<string, { sid: string; name: string; status: string }>();
  (fixedRows || []).forEach((r: { student_id: string; weekday: number; hour: number; status: string }) => {
    const key = `${r.weekday}-${r.hour}`;
    // aktiv gewinnt über angefragt
    const cur = fixedMap.get(key);
    if (!cur || r.status === "aktiv") fixedMap.set(key, { sid: r.student_id, name: nameCache.get(r.student_id) || "Schüler", status: r.status });
  });

  // Ereignisse der Woche
  const { data: appts } = await sb.from("appointments").select("id,student_id,slot_date,hour,kind,status").gte("slot_date", from).lte("slot_date", to);
  const apptMap = new Map<string, ApptRow[]>();
  (appts as ApptRow[] | null)?.forEach((a) => {
    const k = `${a.slot_date}-${a.hour}`;
    const arr = apptMap.get(k) || [];
    arr.push(a); apptMap.set(k, arr);
  });

  return days.map((date) => {
    const wd = weekdayOf(date);
    const slots: SlotOut[] = HOURS.map((hour) => {
      if (!isOpen(wd, hour)) return { hour, state: "closed" };
      const raw = computeRaw(date, hour, fixedMap, apptMap);
      const past = hoursUntil(date, hour) <= 0;
      // Rollen-Sicht
      if (raw.t === "free") return { hour, state: past ? "past" : "free" };
      if (raw.t === "block") {
        if (role === "admin") return { hour, state: "block" };
        return { hour, state: "busy" }; // Schüler/öffentlich sehen "belegt"
      }
      // busy / req durch Schüler
      const mine = role === "student" && raw.sid === viewerId;
      if (role === "admin") return { hour, state: raw.t, name: raw.name, fixed: raw.fixed };
      if (mine) return { hour, state: raw.t, mine: true, fixed: raw.fixed };
      return { hour, state: "busy" }; // andere Schüler / öffentlich: nur "belegt", KEIN Name
    });
    return { date, weekday: wd, slots };
  });
}

// Datums-Listen für die Tooltips (Minus/Plus/Nachhol) eines Schülers
export async function balanceDates(studentId: string) {
  const sb = service();
  const { data } = await sb.from("appointments").select("slot_date,hour,kind,credited,counted,note")
    .eq("student_id", studentId).order("slot_date", { ascending: false }).limit(80);
  const minus: string[] = [], plus: string[] = [], nach: string[] = [];
  (data || []).forEach((a: { slot_date: string; hour: number; kind: string; credited: boolean; counted: string | null; note: string | null }) => {
    const label = prettyDate(a.slot_date, a.hour).replace(" um ", ", ");
    if (a.kind === "absage" && a.credited) minus.push(label);
    else if (a.kind === "absage" && a.note === NOTE_ANNA_CANCEL) nach.push(label);
    if (a.counted === "plus") plus.push(label);
  });
  return { minus, plus, nach };
}
