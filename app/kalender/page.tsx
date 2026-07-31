"use client";
import { useCallback, useEffect, useState, type ReactNode } from "react";

// ------- Typen -------
type Slot = { hour: number; state: string; name?: string; mine?: boolean; fixed?: boolean; mode?: string | null };
type Day = { date: string; weekday: number; slots: Slot[] };
type Balance = { minus: number; plus: number; nach: number; dates: { minus: string[]; plus: string[]; nach: string[] } };
type Session = { token: string; refresh: string; role: "student" | "admin"; name: string };
type OverviewRow = { name: string; fix: string; minus: number; plus: number; nach: number };

const DAYS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
const HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
const MONTHS = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
const pad = (n: number) => String(n).padStart(2, "0");
function mondayOf(d: Date) { const x = new Date(d); const k = (x.getDay() + 6) % 7; x.setDate(x.getDate() - k); x.setHours(0, 0, 0, 0); return x; }
function addDays(d: Date, n: number) { const x = new Date(d); x.setDate(x.getDate() + n); return x; }
function dm(d: Date) { return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.`; }
function iso(d: Date) { return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; }
function parseIso(s: string) { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); }
function hoursUntil(dateStr: string, hour: number) { const d = parseIso(dateStr); d.setHours(hour, 0, 0, 0); return (d.getTime() - Date.now()) / 3600000; }

const CSS = `
.kal *{box-sizing:border-box}
.kal{--ink:#1A1A1A;--muted:#5f574f;--teal:#2BB3C0;--blue:#3E7BB6;--grad:linear-gradient(135deg,#2BB3C0,#3E7BB6);--line:rgba(26,26,26,.12);font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif;color:var(--ink);background:#f4f6f7;min-height:100vh;line-height:1.5}
.kal h1,.kal h2,.kal h3{font-family:'Playfair Display',Georgia,serif;margin:0}
.wrap{max-width:1120px;margin:0 auto;padding:24px}
.hdr{display:flex;align-items:center;gap:14px;margin-bottom:14px;flex-wrap:wrap}
.hdr h1{font-size:1.55rem}
.hdr .sp{margin-left:auto;display:flex;gap:10px;align-items:center}
.hdr a.back{color:var(--muted);text-decoration:none;font-weight:600;font-size:.9rem}
.hdr .who{color:var(--muted);font-size:.9rem}
.btn{border:0;border-radius:10px;padding:11px 14px;font:inherit;font-weight:600;cursor:pointer}
.btn.p{background:var(--grad);color:#fff}.btn.g{background:#eee;color:#333}.btn.r{background:#f7dcd4;color:#b4491f}
.btn.sm{padding:8px 13px;font-size:.88rem;border-radius:999px}
.hint{background:#fff;border:1px solid var(--line);border-radius:12px;padding:12px 16px;color:var(--muted);font-size:.9rem;margin-bottom:16px}
.balance{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:14px}
.balance .lbl{color:var(--muted);font-weight:500}
.pill{position:relative;background:#fff;border:1px solid var(--line);border-radius:999px;padding:8px 14px;font-weight:600;font-size:.9rem;cursor:default}
.pill .m{color:#c0562b}.pill .p{color:#127a5c}.pill .n{color:#3E7BB6}
.pill .tip{display:none;position:absolute;top:120%;left:0;z-index:5;background:#1f2937;color:#fff;padding:9px 12px;border-radius:10px;font-weight:500;font-size:.82rem;white-space:nowrap;box-shadow:0 10px 24px rgba(0,0,0,.25)}
.pill .tip b{color:#8fe3d8;font-weight:600}
.pill:hover .tip{display:block}
.overview{background:#fff;border:1px solid var(--line);border-radius:14px;padding:16px 18px;margin-bottom:16px}
.ovh{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:10px;flex-wrap:wrap}
.overview h3{font-size:1.1rem}
.minibtn{border:0;background:var(--grad);color:#fff;border-radius:999px;padding:8px 14px;font:inherit;font-weight:600;cursor:pointer;font-size:.85rem}
.otbl{width:100%;border-collapse:collapse;font-size:.9rem}
.otbl th,.otbl td{text-align:left;padding:8px 10px;border-bottom:1px solid var(--line)}
.otbl th{color:var(--muted);font-weight:600}
.tag{display:inline-block;min-width:24px;text-align:center;border-radius:8px;padding:2px 8px;font-weight:700;font-size:.82rem}
.tag.m{background:#fbe3d8;color:#b4491f}.tag.p{background:#dcf3ec;color:#127a5c}.tag.z{background:#eee;color:#999}
.layout{display:grid;grid-template-columns:230px 1fr;gap:18px}
@media(max-width:760px){.layout{grid-template-columns:1fr}}
.side{background:#fff;border:1px solid var(--line);border-radius:14px;padding:14px;height:max-content}
.mnav{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}
.mnav b{font-family:'Playfair Display',Georgia,serif;font-size:1.05rem}
.mnav button{border:1px solid var(--line);background:#fff;width:30px;height:30px;border-radius:8px;cursor:pointer;font-size:1rem}
.wk{display:block;width:100%;text-align:left;border:1px solid var(--line);background:#fff;border-radius:10px;padding:9px 12px;margin-bottom:7px;cursor:pointer;font:inherit;font-size:.86rem}
.wk small{color:var(--muted)}
.wk.on{background:rgba(43,179,192,.12);border-color:var(--teal);color:#127a5c;font-weight:600}
.calwrap{background:#fff;border:1px solid var(--line);border-radius:14px;overflow:auto}
.wkhead{display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-bottom:1px solid var(--line)}
.wkhead b{font-family:'Playfair Display',Georgia,serif;font-size:1.05rem}
.wkhead button{border:1px solid var(--line);background:#fff;padding:6px 12px;border-radius:8px;cursor:pointer;font:inherit}
.legend{display:flex;flex-wrap:wrap;gap:8px 16px;padding:10px 16px;border-bottom:1px solid var(--line);font-size:.82rem;color:var(--muted)}
.legend span{display:inline-flex;align-items:center;gap:6px}
.legend i{width:16px;height:16px;border-radius:5px;border:1px solid var(--line);flex:none}
.sw-free{background:#eafaf7}.sw-busy{background:#cfd6da}.sw-mine{background:var(--grad);border-color:transparent}
.sw-req{background:#fff3d6}.sw-closed{background:#f4f4f4}
.sw-block{background:repeating-linear-gradient(45deg,#e7ebee,#e7ebee 4px,#dee3e7 4px,#dee3e7 8px)}
table.grid{border-collapse:collapse;width:100%;min-width:760px;table-layout:fixed}
.grid th,.grid td{border:1px solid var(--line);text-align:center;padding:0}
.grid thead th:first-child,.grid tbody th{width:64px}
.grid thead th{background:#fafafa;padding:9px 4px;font-size:.86rem;line-height:1.25;font-weight:700}
.grid thead th small{display:block;color:var(--muted);font-weight:500;font-size:.76rem;margin-top:2px}
.grid thead th.today{color:var(--teal);background:rgba(43,179,192,.10)}
.grid thead th .now{display:block;font-size:.62rem;font-weight:700;color:#fff;background:var(--teal);border-radius:6px;margin:3px auto 0;padding:1px 0;max-width:46px}
.grid tbody th{background:#fafafa;font-size:.82rem;color:var(--muted);font-weight:600}
.cell{height:52px;font-size:.8rem;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0 4px;text-align:center;overflow:hidden;line-height:1.15}
.cell.free{background:#eafaf7;color:#127a5c}.cell.busy{background:#cfd6da;color:#3a4145}
.cell.mine{background:var(--grad);color:#fff;font-weight:600}.cell.req{background:#fff3d6;color:#8a6d1a}
.cell.block{background:repeating-linear-gradient(45deg,#e7ebee,#e7ebee 6px,#dee3e7 6px,#dee3e7 12px);color:#5f6b73;font-weight:600}
.cell.closed{background:#f4f4f4;cursor:default;color:#ccc}.cell.past{opacity:.45;cursor:default}
.cell.free:hover,.cell.mine:hover,.cell.req:hover,.cell.busy:hover,.cell.block:hover{outline:2px solid var(--teal);outline-offset:-2px}
.ov{position:fixed;inset:0;background:rgba(0,0,0,.45);display:flex;align-items:center;justify-content:center;padding:20px;z-index:20}
.modal{background:#fff;border-radius:16px;max-width:430px;width:100%;padding:26px;box-shadow:0 24px 60px rgba(0,0,0,.25)}
.modal h2{font-size:1.25rem;margin-bottom:8px}.modal p{color:var(--muted);margin:0 0 8px}
.modal label{display:block;font-weight:600;font-size:.85rem;margin:12px 0 4px;color:var(--ink)}
.modal input{width:100%;border:1px solid var(--line);border-radius:10px;padding:11px 12px;font:inherit}
.warn{background:#ffeaea;border:1px solid #f5b5b5;color:#a12a2a;padding:12px 14px;border-radius:10px;font-weight:500}
.okbox{background:rgba(43,179,192,.12);border:1px solid rgba(43,179,192,.4);color:#127a5c;padding:12px 14px;border-radius:10px;font-weight:500}
.acts{display:flex;gap:10px;margin-top:18px}
.col{display:flex;flex-direction:column;gap:10px;margin-top:16px}
.acts .btn,.col .btn{flex:1}
.err{color:#b4491f;font-weight:600;font-size:.9rem;margin-top:8px}
`;

const FONTS = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@700;800&display=swap";
const LS_KEY = "lma_kal_session";

export default function KalenderPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [weekStart, setWeekStart] = useState<Date>(() => mondayOf(new Date()));
  const [viewMonth, setViewMonth] = useState<Date>(() => { const n = new Date(); return new Date(n.getFullYear(), n.getMonth(), 1); });
  const [days, setDays] = useState<Day[]>([]);
  const [balance, setBalance] = useState<Balance | null>(null);
  const [overview, setOverview] = useState<OverviewRow[] | null>(null);
  const [modal, setModal] = useState<ReactNode | null>(null);
  const [busy, setBusy] = useState(false);
  const today = iso(new Date());

  const saveSession = useCallback((s: Session | null) => {
    setSession(s);
    try { if (s) localStorage.setItem(LS_KEY, JSON.stringify(s)); else localStorage.removeItem(LS_KEY); } catch { }
  }, []);

  // Session aus localStorage laden (einmalig beim Mounten)
  useEffect(() => {
    let s: Session | null = null;
    try { const raw = localStorage.getItem(LS_KEY); if (raw) s = JSON.parse(raw); } catch { }
    /* eslint-disable react-hooks/set-state-in-effect */
    if (s) setSession(s);
    setReady(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  // API-Aufruf (mit einmaligem Refresh bei 401)
  const api = useCallback(async (action: string, params: Record<string, unknown> = {}): Promise<Record<string, unknown>> => {
    const call = async (tok?: string) => {
      const res = await fetch("/api/kalender", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, token: tok, ...params }),
      });
      return { status: res.status, data: (await res.json().catch(() => ({}))) as Record<string, unknown> };
    };
    let r = await call(session?.token);
    if (r.status === 401 && session?.refresh && action !== "refresh" && action !== "login") {
      const rf = await fetch("/api/kalender", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "refresh", refresh: session.refresh }) });
      const rd = (await rf.json().catch(() => ({}))) as Record<string, unknown>;
      if (rd.ok && rd.token) { saveSession({ ...session, token: String(rd.token), refresh: String(rd.refresh) }); r = await call(String(rd.token)); }
      else saveSession(null);
    }
    return r.data;
  }, [session, saveSession]);

  const loadWeek = useCallback(async () => {
    const d = await api("week", { monday: iso(weekStart) });
    if (d.ok) { setDays((d.days as Day[]) || []); setBalance((d.balance as Balance) || null); }
    if (session?.role === "admin") { const o = await api("overview"); if (o.ok) setOverview((o.students as OverviewRow[]) || []); }
    else setOverview(null);
  }, [api, weekStart, session]);

  useEffect(() => {
    // loadWeek ist async – setState passiert erst nach dem await (kein synchroner Kaskaden-Render)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (ready) loadWeek();
  }, [ready, loadWeek]);

  // ---- Aktionen ----
  async function act(action: string, params: Record<string, unknown>, successTitle = "Erledigt ✓") {
    if (busy) return; setBusy(true);
    const d = await api(action, params);
    setBusy(false);
    if (d.ok) { await loadWeek(); info(successTitle, String(d.message || "")); }
    else info("Hinweis", "", String(d.error || "Fehler."));
  }
  function info(title: string, msg: string, err = "") {
    setModal(<Info title={title} msg={msg} err={err} onClose={() => setModal(null)} />);
  }

  // ---- Login ----
  function openLogin() {
    setModal(<Login onClose={() => setModal(null)} onLogin={async (email, password) => {
      const d = await api("login", { email, password });
      if (d.ok) { saveSession({ token: String(d.token), refresh: String(d.refresh), role: d.role as "student" | "admin", name: String(d.name) }); setModal(null); return ""; }
      return String(d.error || "Login fehlgeschlagen.");
    }} />);
  }

  // ---- Slot-Klick ----
  function onSlot(date: string, s: Slot) {
    const role = session?.role || "public";
    const when = `${DAYS[(parseIso(date).getDay() + 6) % 7]} ${dm(parseIso(date))} um ${pad(s.hour)}:00`;
    if (s.state === "closed" || s.state === "past") return;

    if (role === "public") {
      if (s.state === "free") return info("Einloggen", "Zum Buchen bitte einloggen. Neu hier? Melde dich bei Kleana für eine Probestunde.");
      return;
    }
    if (role === "student") {
      if (s.state === "free") {
        setModal(<div className="modal"><h2>Termin: {when}</h2><p>Wie möchtest du diesen Slot nutzen?</p>
          <div className="col">
            <button className="btn p" onClick={() => chooseMode("requestFixed", date, s.hour, "Fester wöchentlicher Termin")}>Fester wöchentlicher Termin</button>
            <button className="btn p" onClick={() => chooseMode("bookExtra", date, s.hour, "Einmalige Extra-/Nachholstunde")}>Einmalige Extra-/Nachholstunde</button>
            <button className="btn g" onClick={() => setModal(null)}>Abbrechen</button>
          </div></div>);
        return;
      }
      if (s.mine && s.state === "req") return info("Angefragt", `${when} wartet auf Kleanas Bestätigung.`);
      if (s.mine && s.state === "mine") {
        const hu = hoursUntil(date, s.hour);
        setModal(<div className="modal"><h2>Termin absagen</h2><p>{when}</p>
          {hu >= 4 ? <div className="okbox">Mehr als 4 Std. vorher → wird als <b>Minus-Stunde</b> gutgeschrieben (max. 3).</div>
            : <div className="warn">Weniger als 4 Std. vorher: zählt <b>nicht</b> als Minus-Stunde.</div>}
          <div className="acts"><button className="btn g" onClick={() => setModal(null)}>Zurück</button>
            <button className="btn p" onClick={() => act("cancelMine", { date, hour: s.hour })}>{hu >= 4 ? "Absagen" : "Trotzdem absagen"}</button></div></div>);
        return;
      }
      return;
    }
    // admin
    if (s.state === "free") {
      setModal(<div className="modal"><h2>Slot blockieren</h2><p>{when}</p>
        <div className="okbox">Für eigene Arbeit sperren – Schüler können diesen Slot dann nicht buchen (erscheint als „belegt“).</div>
        <div className="acts"><button className="btn g" onClick={() => setModal(null)}>Abbrechen</button>
          <button className="btn p" onClick={() => act("block", { date, hour: s.hour })}>Blockieren</button></div></div>);
      return;
    }
    if (s.state === "block") {
      setModal(<div className="modal"><h2>Geblockter Slot</h2><p>{when}</p><p>Von dir für eigene Arbeit gesperrt.</p>
        <div className="acts"><button className="btn g" onClick={() => setModal(null)}>Abbrechen</button>
          <button className="btn p" onClick={() => act("unblock", { date, hour: s.hour })}>Freigeben</button></div></div>);
      return;
    }
    if (s.state === "req") {
      setModal(<div className="modal"><h2>Anfrage bestätigen</h2><p><b>{s.name}</b> · {when}{s.mode ? " · " + modeText(s.mode) : ""}</p>
        {s.fixed ? <div className="okbox">Wird ab jetzt <b>jede Woche</b> als fester Termin eingetragen.</div> : null}
        <div className="col">
          <button className="btn p" onClick={() => act("adminConfirm", { date, hour: s.hour })}>Bestätigen &amp; Mail</button>
          <button className="btn r" onClick={() => act("adminReject", { date, hour: s.hour })}>Absagen &amp; Mail</button>
          <button className="btn g" onClick={() => setModal(null)}>Abbrechen (Fenster schließen)</button>
        </div></div>);
      return;
    }
    if (s.state === "busy") {
      setModal(<div className="modal"><h2>Stunde absagen</h2><p><b>{s.name}</b> · {when}{s.mode ? " · " + modeText(s.mode) : ""}</p>
        <div className="okbox">{s.name} bekommt Nachhol-Guthaben (kein Minus) und eine Mail.</div>
        <div className="acts"><button className="btn g" onClick={() => setModal(null)}>Zurück</button>
          <button className="btn p" onClick={() => act("adminCancel", { date, hour: s.hour })}>Absagen</button></div></div>);
    }
  }

  function chooseMode(action: string, date: string, hour: number, title: string) {
    setModal(<div className="modal"><h2>{title}</h2><p>Findet die Stunde online oder vor Ort statt?</p>
      <div className="col">
        <button className="btn p" onClick={() => act(action, { date, hour, mode: "online" })}>💻 Online</button>
        <button className="btn p" onClick={() => act(action, { date, hour, mode: "vor_ort" })}>📍 Vor Ort</button>
        <button className="btn g" onClick={() => setModal(null)}>Zurück</button>
      </div></div>);
  }

  function openAddStudent() {
    setModal(<AddStudent onClose={() => setModal(null)} onCreate={async (name, email) => {
      const d = await api("createStudent", { name, email });
      if (d.ok) { await loadWeek(); setModal(null); info("Schüler angelegt ✓", String(d.message || "")); return ""; }
      return String(d.error || "Fehler.");
    }} />);
  }

  // ---- Sidebar-Wochenliste des Monats ----
  const monthWeeks: { key: string; label: string; on: boolean }[] = [];
  {
    const last = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 0);
    let m = mondayOf(viewMonth);
    while (m <= last) { const end = addDays(m, 6); monthWeeks.push({ key: iso(m), label: `${dm(m)}–${dm(end)}`, on: iso(m) === iso(weekStart) }); m = addDays(m, 7); }
  }
  const role = session?.role || "public";
  const legend = buildLegend(role);
  const wEnd = addDays(weekStart, 6);

  return (
    <div className="kal">
      <link rel="stylesheet" href={FONTS} />
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="wrap">
        <div className="hdr">
          <h1>📅 Terminkalender</h1>
          <div className="sp">
            <a className="back" href="https://lernemitanna.de">← lernemitanna.de</a>
            {session
              ? <><span className="who">{session.name} · {session.role === "admin" ? "Kleana" : "Schüler"}</span><button className="btn g sm" onClick={() => { saveSession(null); setBalance(null); setOverview(null); }}>Abmelden</button></>
              : <button className="btn p sm" onClick={openLogin}>Einloggen</button>}
          </div>
        </div>

        {!session && <div className="hint">Öffentliche Ansicht: du siehst nur <b>frei/belegt</b> (ohne Namen). Schüler und Kleana sehen nach dem Login ihre Termine. Fahre mit der Maus über die Stunden-Anzeige, um Datumsangaben zu sehen.</div>}

        {balance && (
          <div className="balance">
            <span className="lbl">Deine Stunden:</span>
            <span className="pill"><span className="m">Minus {balance.minus}/3</span><span className="tip"><b>Minus-Stunden:</b><br />{balance.dates.minus.length ? balance.dates.minus.join(", ") : "keine"}</span></span>
            <span className="pill"><span className="p">Plus {balance.plus}</span><span className="tip"><b>Plus-Stunden:</b><br />{balance.dates.plus.length ? balance.dates.plus.join(", ") : "keine"}</span></span>
            <span className="pill"><span className="n">Nachholen (Kleana) {balance.nach}</span><span className="tip"><b>Nachhol-Guthaben:</b><br />{balance.dates.nach.length ? balance.dates.nach.join(", ") : "keine"}</span></span>
          </div>
        )}

        {role === "admin" && overview && (
          <div className="overview">
            <div className="ovh"><h3>Übersicht: Plus- &amp; Minus-Stunden</h3><button className="minibtn" onClick={openAddStudent}>+ Neuen Schüler anlegen</button></div>
            <table className="otbl"><thead><tr><th>Schüler</th><th>Fester Termin</th><th>Minus</th><th>Plus</th><th>Nachhol</th></tr></thead>
              <tbody>{overview.map((r, i) => (<tr key={i}><td><b>{r.name}</b></td><td>{r.fix}</td>
                <td><span className={"tag " + (r.minus ? "m" : "z")}>{r.minus}</span></td>
                <td><span className={"tag " + (r.plus ? "p" : "z")}>{r.plus}</span></td>
                <td><span className={"tag " + (r.nach ? "p" : "z")}>{r.nach}</span></td></tr>))}
                {overview.length === 0 && <tr><td colSpan={5} style={{ color: "#999" }}>Noch keine Schüler. Lege oben rechts den ersten an.</td></tr>}
              </tbody></table>
          </div>
        )}

        <div className="layout">
          <div className="side">
            <div className="mnav"><button onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1))}>‹</button>
              <b>{MONTHS[viewMonth.getMonth()]} {viewMonth.getFullYear()}</b>
              <button onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1))}>›</button></div>
            <div>{monthWeeks.map((w) => (
              <button key={w.key} className={"wk" + (w.on ? " on" : "")} onClick={() => setWeekStart(parseIso(w.key))}>Woche <small>{w.label}</small></button>
            ))}</div>
          </div>

          <div className="calwrap">
            <div className="wkhead">
              <button onClick={() => { const n = addDays(weekStart, -7); setWeekStart(n); setViewMonth(new Date(n.getFullYear(), n.getMonth(), 1)); }}>‹ Woche</button>
              <b>{dm(weekStart)} – {dm(wEnd)} {wEnd.getFullYear()}</b>
              <button onClick={() => { const n = addDays(weekStart, 7); setWeekStart(n); setViewMonth(new Date(n.getFullYear(), n.getMonth(), 1)); }}>Woche ›</button>
            </div>
            <div className="legend">{legend.map((l, i) => (<span key={i}><i className={l.c} />{l.t}</span>))}</div>
            <table className="grid">
              <thead><tr><th></th>{days.map((d) => {
                const dt = parseIso(d.date); const isToday = d.date === today;
                return <th key={d.date} className={isToday ? "today" : ""}>{DAYS[d.weekday]}<small>{dm(dt)}</small>{isToday ? <span className="now">heute</span> : null}</th>;
              })}</tr></thead>
              <tbody>{HOURS.map((h) => (
                <tr key={h}><th>{h}:00</th>{days.map((d) => {
                  const s = d.slots.find((x) => x.hour === h) || { hour: h, state: "closed" };
                  const v = cellView(s, role);
                  return <td key={d.date + h}><div className={"cell " + v.cls} onClick={() => onSlot(d.date, s)}>{v.label}</div></td>;
                })}</tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      </div>
      {modal && <div className="ov" onClick={(e) => { if (e.target === e.currentTarget) setModal(null); }}>{modal}</div>}
    </div>
  );
}

// ------- kleine Komponenten -------
function modeEmoji(m?: string | null) { return m === "online" ? "💻" : m === "vor_ort" ? "📍" : ""; }
function modeText(m?: string | null) { return m === "online" ? "💻 Online" : m === "vor_ort" ? "📍 Vor Ort" : ""; }
function cellView(s: Slot, role: string): { cls: string; label: string } {
  if (s.state === "closed") return { cls: "closed", label: "" };
  if (s.state === "past") return { cls: "past", label: "" };
  if (s.state === "free") return { cls: "free", label: "frei" };
  if (s.state === "block") return { cls: "block", label: role === "admin" ? "Geblockt" : "Belegt" };
  const e = modeEmoji(s.mode);
  if (s.state === "req") {
    if (role === "admin") return { cls: "req", label: `${e ? e + " " : ""}${s.name || ""} (Anfrage)` };
    if (s.mine) return { cls: "req", label: `${e ? e + " " : ""}Angefragt` };
    return { cls: "busy", label: "Belegt" };
  }
  // busy / mine
  if (s.mine) return { cls: "mine", label: `${e ? e + " " : ""}Du` };
  if (role === "admin") return { cls: "busy", label: `${e ? e + " " : ""}${s.name || "Belegt"}` };
  return { cls: "busy", label: "Belegt" };
}
function buildLegend(role: string) {
  const items = [{ c: "sw-free", t: "frei / buchbar" }];
  if (role === "public") items.push({ c: "sw-busy", t: "belegt" });
  else if (role === "student") items.push({ c: "sw-mine", t: "deine Stunde" }, { c: "sw-req", t: "angefragt" }, { c: "sw-busy", t: "belegt (andere)" });
  else items.push({ c: "sw-mine", t: "gebucht" }, { c: "sw-req", t: "Anfrage" }, { c: "sw-busy", t: "belegt" }, { c: "sw-block", t: "geblockt (du)" });
  items.push({ c: "sw-closed", t: "geschlossen" });
  return items;
}

function Info({ title, msg, err, onClose }: { title: string; msg: string; err?: string; onClose: () => void }) {
  return <div className="modal"><h2>{title}</h2>{msg ? <p>{msg}</p> : null}{err ? <div className="err">{err}</div> : null}
    <div className="acts"><button className="btn p" onClick={onClose}>OK</button></div></div>;
}
function Login({ onLogin, onClose }: { onLogin: (e: string, p: string) => Promise<string>; onClose: () => void }) {
  const [email, setEmail] = useState(""); const [pw, setPw] = useState(""); const [err, setErr] = useState(""); const [load, setLoad] = useState(false);
  async function go() { setLoad(true); setErr(await onLogin(email.trim(), pw)); setLoad(false); }
  return <div className="modal"><h2>Einloggen</h2><p>Mit deiner E-Mail und deinem Passwort.</p>
    <label>E-Mail</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => e.key === "Enter" && go()} />
    <label>Passwort</label><input type="password" value={pw} onChange={(e) => setPw(e.target.value)} onKeyDown={(e) => e.key === "Enter" && go()} />
    {err ? <div className="err">{err}</div> : null}
    <div className="acts"><button className="btn g" onClick={onClose}>Abbrechen</button><button className="btn p" onClick={go} disabled={load}>{load ? "…" : "Einloggen"}</button></div></div>;
}
function AddStudent({ onCreate, onClose }: { onCreate: (n: string, e: string) => Promise<string>; onClose: () => void }) {
  const [name, setName] = useState(""); const [email, setEmail] = useState(""); const [err, setErr] = useState(""); const [load, setLoad] = useState(false);
  async function go() { if (!name.trim() || !email.trim()) { setErr("Name und E-Mail nötig."); return; } setLoad(true); setErr(await onCreate(name.trim(), email.trim())); setLoad(false); }
  return <div className="modal"><h2>Neuen Schüler anlegen</h2><p>Der Schüler bekommt eine Einladung per Mail mit eigenem Passwort.</p>
    <label>Name</label><input value={name} onChange={(e) => setName(e.target.value)} placeholder="z. B. Nora" />
    <label>E-Mail</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nora@example.com" />
    {err ? <div className="err">{err}</div> : null}
    <div className="acts"><button className="btn g" onClick={onClose}>Abbrechen</button><button className="btn p" onClick={go} disabled={load}>{load ? "…" : "Einladung senden"}</button></div></div>;
}
