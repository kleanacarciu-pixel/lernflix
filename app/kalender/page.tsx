"use client";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

// ------- Typen -------
type Slot = { hour: number; state: string; name?: string; mine?: boolean; fixed?: boolean; mode?: string | null; weekly?: boolean; dauer?: number; cont?: boolean; anchor?: number };
type Absage = { start: number; dauer: number; name: string };
type Day = { date: string; weekday: number; slots: Slot[]; absagen?: Absage[] };
type Balance = { minus: number; plus: number; nach: number; dates: { minus: string[]; plus: string[]; nach: string[] }; fix?: { weekday: number; hour: number; mode: string | null; dauer?: number }[] };
type Session = { token: string; refresh: string; role: "student" | "admin"; name: string };
type OverviewRow = { id: string; name: string; fix: string; minus: number; plus: number; nach: number; minusD?: string[]; plusD?: string[]; nachD?: string[]; teams?: string | null };
type ReqRow = { date?: string; weekday?: number; hour: number; who: string; kind: string; mode?: string | null };
type CancRow = { date: string; hour: number; who: string; credited: boolean; byAnna: boolean };
type Inbox = { requests: ReqRow[]; cancellations: CancRow[] };
type NextLesson = { id: string; title: string; starts_at: string; ends_at: string; kind: string; mode?: string | null; teamsLink?: string | null };

const DAYS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
// Halbstunden-Raster wie auf dem Server: 8, 8.5 (=8:30), … 19.5 (=19:30)
const HOURS: number[] = [];
for (let h = 8; h <= 19.5; h += 0.5) HOURS.push(h);
// minutengenau: 14:00 / 14:30 / 16:15 …
const fmtZeit = (hour: number) => { const m = Math.round(hour * 60); return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`; };
// Höhe einer Stunde in der Outlook-Wochenansicht (Pixel)
const STUNDE_PX = 56;
const MONTHS = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
const pad = (n: number) => String(n).padStart(2, "0");
const SWATCH_CLS: Record<string, string> = { "sw-free": "free", "sw-mine": "mine", "sw-req": "req", "sw-busy": "busy", "sw-block": "blk", "sw-closed": "closed", "sw-abges": "abges" };
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
.fixpill{background:rgba(43,179,192,.14);border:1px solid rgba(43,179,192,.45);color:#0f6f79;cursor:pointer;font-weight:700}
.fixpill:hover{background:rgba(43,179,192,.22)}
.overview{background:#fff;border:1px solid var(--line);border-radius:14px;padding:16px 18px;margin-bottom:16px}
.ovh{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:10px;flex-wrap:wrap}
.overview h3{font-size:1.1rem}
.minibtn{border:0;background:var(--grad);color:#fff;border-radius:999px;padding:8px 14px;font:inherit;font-weight:600;cursor:pointer;font-size:.85rem}
.otbl{width:100%;border-collapse:collapse;font-size:.9rem}
.otbl th,.otbl td{text-align:left;padding:8px 10px;border-bottom:1px solid var(--line)}
.otbl th{color:var(--muted);font-weight:600}
.tag{display:inline-block;min-width:24px;text-align:center;border-radius:8px;padding:2px 8px;font-weight:700;font-size:.82rem}
.tag.m{background:#fbe3d8;color:#b4491f}.tag.p{background:#dcf3ec;color:#127a5c}.tag.z{background:#eee;color:#999}
.rmv{border:0;background:#f4f4f4;color:#b4491f;width:26px;height:26px;border-radius:8px;cursor:pointer;font-size:.8rem;font-weight:700}
.rmv:hover{background:#f7dcd4}
.namebtn{border:0;background:none;font:inherit;font-weight:700;color:var(--ink);cursor:pointer;text-decoration:underline;text-decoration-color:var(--line);text-underline-offset:3px;padding:0}
.namebtn:hover{color:var(--teal)}
.stp{display:inline-flex;align-items:center;gap:5px}
.stpb{border:1px solid var(--line);background:#fff;width:22px;height:22px;border-radius:6px;cursor:pointer;font-size:.95rem;line-height:1;color:var(--muted);padding:0}
.stpb:hover{background:#f4f6f7;color:var(--ink)}
.histmodal{max-width:520px;max-height:82vh;overflow-y:auto}
.histsec{margin:12px 0;font-size:.9rem}
.histsec>b{display:block;margin-bottom:3px}
.histsec>div{color:var(--muted);line-height:1.6}
.histsec>b.p{color:#127a5c}.histsec>b.m{color:#c0562b}.histsec>b.n{color:#3E7BB6}.histsec>b.w{color:#a1701a}
.histsec.sub{font-size:.78rem;color:#b3b3b3;border-top:1px solid var(--line);padding-top:8px}
.layout{display:flex;gap:18px;align-items:flex-start}
@media(max-width:760px){.layout{flex-direction:column}.side{width:100%;flex-basis:auto}}
.side{flex:0 0 230px;background:#fff;border:1px solid var(--line);border-radius:14px;padding:14px;height:max-content}
.mnav{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}
.mnav b{font-family:'Playfair Display',Georgia,serif;font-size:1.05rem}
.mnav button{border:1px solid var(--line);background:#fff;width:30px;height:30px;border-radius:8px;cursor:pointer;font-size:1rem}
.wk{display:block;width:100%;text-align:left;border:1px solid var(--line);background:#fff;border-radius:10px;padding:9px 12px;margin-bottom:7px;cursor:pointer;font:inherit;font-size:.86rem}
.wk small{color:var(--muted)}
.wk.on{background:rgba(43,179,192,.12);border-color:var(--teal);color:#127a5c;font-weight:600}
.calwrap{flex:1 1 auto;min-width:0;width:100%;background:#fff;border:1px solid var(--line);border-radius:14px;overflow:hidden}
.deskgrid{overflow-x:auto}
.otblwrap{overflow-x:auto}
.kloading{display:flex;align-items:center;justify-content:center;gap:12px;padding:70px 20px;color:var(--muted);font-weight:600}
.kspin{width:22px;height:22px;border:3px solid rgba(43,179,192,.25);border-top-color:var(--teal);border-radius:50%;display:inline-block;animation:kspin .8s linear infinite}
@keyframes kspin{to{transform:rotate(360deg)}}
@media(min-width:761px){.otblwrap{overflow:visible}}
.htip{position:relative;cursor:default}
.htip .tt{display:none;position:absolute;bottom:135%;left:50%;transform:translateX(-50%);z-index:10;background:#1f2937;color:#fff;padding:9px 12px;border-radius:10px;font-weight:500;font-size:.82rem;white-space:nowrap;box-shadow:0 10px 24px rgba(0,0,0,.25);text-align:left}
.htip .tt b{color:#8fe3d8;font-weight:600}
.htip:hover .tt{display:block}
.dayview{display:none;padding:12px 14px 16px}
.daychips{display:flex;gap:6px;overflow-x:auto;padding-bottom:8px}
.daychip{flex:0 0 auto;border:1px solid var(--line);background:#fff;border-radius:10px;padding:8px 10px;text-align:center;cursor:pointer;font:inherit;font-size:.8rem;font-weight:700;min-width:54px;color:var(--ink)}
.daychip small{display:block;color:var(--muted);font-weight:500;font-size:.72rem;margin-top:2px}
.daychip.on{background:rgba(43,179,192,.14);border-color:var(--teal);color:#127a5c}
.daychip.td small{color:var(--teal)}
.daylist{display:flex;flex-direction:column;gap:7px;margin-top:12px}
.dayrow{display:flex;align-items:center;gap:12px;border:1px solid var(--line);border-radius:11px;padding:14px 14px;cursor:pointer;font:inherit;text-align:left;background:#fff;font-size:.95rem}
.dayrow .dh{font-weight:700;width:58px;flex:none}.dayrow .dl{flex:1}
.dayrow.free{background:#eafaf7;color:#127a5c}.dayrow.busy{background:#eef1f3;color:#3a4145}
.dayrow.mine{background:var(--grad);color:#fff}.dayrow.req{background:#fff3d6;color:#8a6d1a}
.dayrow.blk{background:repeating-linear-gradient(45deg,#e7ebee,#e7ebee 6px,#dee3e7 6px,#dee3e7 12px);color:#5f6b73}
.dayrow.past{opacity:.5}
.inbxlist{display:flex;flex-direction:column;gap:7px;margin-top:8px}
.inbxrow{display:flex;flex-wrap:wrap;align-items:center;gap:4px 10px;border:1px solid var(--line);border-radius:10px;padding:11px 13px;background:#fff;font:inherit;text-align:left;cursor:pointer;width:100%}
.inbxrow.ca{cursor:default;background:#fbf7f4}
.inbxrow .ibw{font-weight:700}.inbxrow .ibd{color:var(--muted);font-size:.86rem;flex:1}
.inbxrow .ibgo{color:var(--teal);font-weight:600;font-size:.85rem}
@media(max-width:700px){
  .deskgrid{display:none}.dayview{display:block}
  .wrap{padding:8px}.hdr h1{font-size:1.25rem}
  .hdr .sp{gap:6px}.hdr .sp .btn{padding:7px 10px;font-size:.8rem}
  .modal{padding:18px;border-radius:14px}
  .legend{padding:8px 10px;font-size:.76rem;gap:4px 6px}
  .daychip{padding:7px 10px;font-size:.84rem}
  .oblock .obtitel{font-size:.82rem}
  .oblock .obzeit{font-size:.72rem}
  .otagwrap{margin-top:6px}
}
.wkhead{display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-bottom:1px solid var(--line)}
.wkhead b{font-family:'Playfair Display',Georgia,serif;font-size:1.05rem}
.wkhead button{border:1px solid var(--line);background:#fff;padding:6px 12px;border-radius:8px;cursor:pointer;font:inherit}
.legend{display:flex;flex-wrap:wrap;gap:6px 8px;padding:10px 14px;border-bottom:1px solid var(--line);font-size:.82rem;color:var(--muted);align-items:center}
.legitem{display:inline-flex;align-items:center;gap:6px;border:1px solid transparent;background:none;cursor:pointer;font:inherit;font-size:.82rem;color:var(--muted);padding:4px 8px;border-radius:8px}
.legitem:hover{background:#f4f6f7}
.legitem.on{border-color:var(--teal);background:rgba(43,179,192,.12);color:#127a5c;font-weight:700}
.legclear{border:0;background:#f7dcd4;color:#b4491f;cursor:pointer;font:inherit;font-size:.8rem;font-weight:600;padding:4px 10px;border-radius:8px}
.legend i{width:16px;height:16px;border-radius:5px;border:1px solid var(--line);flex:none}
.cell.dim{opacity:.13}.dayrow.dim{opacity:.32}
.sw-free{background:#eafaf7}.sw-busy{background:#d9eafb;border-color:#5b9bd5}.sw-mine{background:var(--grad);border-color:transparent}
.sw-req{background:#fff3d6;border-color:#e3b84d}.sw-closed{background:#f4f4f4}
.sw-block{background:#e7ebee;border-color:#aeb8c0}
.sw-abges{background:#fde6e4;border-color:#d9655a}
table.kgrid{border-collapse:collapse;width:100%;min-width:760px;table-layout:fixed}
.kgrid th,.kgrid td{border:1px solid var(--line);text-align:center;padding:0}
.kgrid thead th:first-child,.kgrid tbody th{width:64px}
.kgrid thead th{background:#fafafa;padding:9px 4px;font-size:.86rem;line-height:1.25;font-weight:700}
.kgrid thead th small{display:block;color:var(--muted);font-weight:500;font-size:.76rem;margin-top:2px}
.kgrid thead th.today{color:var(--teal);background:rgba(43,179,192,.10)}
.kgrid thead th .now{display:block;font-size:.62rem;font-weight:700;color:#fff;background:var(--teal);border-radius:6px;margin:3px auto 0;padding:1px 0;max-width:46px}
.kgrid tbody th{background:#fafafa;font-size:.82rem;color:var(--muted);font-weight:600}
.cell{height:34px;font-size:.78rem;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0 4px;text-align:center;overflow:hidden;line-height:1.15}
.cell.free{background:#eafaf7;color:#127a5c}.cell.busy{background:#cfd6da;color:#3a4145}
.cell.mine{background:var(--grad);color:#fff;font-weight:600}.cell.req{background:#fff3d6;color:#8a6d1a}
.cell.blk{background:repeating-linear-gradient(45deg,#e7ebee,#e7ebee 6px,#dee3e7 6px,#dee3e7 12px);color:#5f6b73;font-weight:600}
.cell.closed{background:#f4f4f4;cursor:default;color:#ccc}.cell.past{opacity:.45;cursor:default}
.cell.free:hover,.cell.mine:hover,.cell.req:hover,.cell.busy:hover,.cell.blk:hover{outline:2px solid var(--teal);outline-offset:-2px}
.ov{position:fixed;inset:0;background:rgba(0,0,0,.45);display:flex;align-items:center;justify-content:center;padding:20px;z-index:20}
.modal{background:#fff;border-radius:16px;max-width:430px;width:100%;padding:26px;box-shadow:0 24px 60px rgba(0,0,0,.25);max-height:88dvh;overflow-y:auto}
.modal h2{font-size:1.25rem;margin-bottom:8px}.modal p{color:var(--muted);margin:0 0 8px}
.modal label{display:block;font-weight:600;font-size:.85rem;margin:12px 0 4px;color:var(--ink)}
.modal input{width:100%;border:1px solid var(--line);border-radius:10px;padding:11px 12px;font:inherit}
.pwrow{display:flex;gap:8px;align-items:center}.pwrow input{flex:1}
.eye{border:1px solid var(--line);background:#fff;border-radius:10px;padding:9px 12px;cursor:pointer;font-size:1rem}
.warn{background:#ffeaea;border:1px solid #f5b5b5;color:#a12a2a;padding:12px 14px;border-radius:10px;font-weight:500}
.okbox{background:rgba(43,179,192,.12);border:1px solid rgba(43,179,192,.4);color:#127a5c;padding:12px 14px;border-radius:10px;font-weight:500}
.acts{display:flex;gap:10px;margin-top:18px}
.col{display:flex;flex-direction:column;gap:10px;margin-top:16px}
.acts .btn,.col .btn{flex:1}
.err{color:#b4491f;font-weight:600;font-size:.9rem;margin-top:8px}
.saving{position:fixed;top:14px;left:50%;transform:translateX(-50%);background:#1f2937;color:#fff;padding:7px 15px;border-radius:999px;font-size:.82rem;font-weight:600;z-index:40;box-shadow:0 8px 22px rgba(0,0,0,.22)}
.toast{position:fixed;left:50%;bottom:24px;transform:translateX(-50%);background:#127a5c;color:#fff;padding:12px 18px;border-radius:12px;font-weight:600;font-size:.9rem;box-shadow:0 12px 32px rgba(0,0,0,.28);z-index:40;max-width:90vw;text-align:center}
@keyframes kalpop{from{opacity:0;transform:translate(-50%,8px)}to{opacity:1;transform:translate(-50%,0)}}
.toast{animation:kalpop .18s ease-out}
.lessonbar{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.lessonbar .btn{margin-left:auto;text-decoration:none;display:inline-block}
.lessonbar .btn[disabled]{cursor:default;opacity:.75}
.lessonbar .lbweg{background:none;border:0;color:#8b959d;font:inherit;font-size:.95rem;cursor:pointer;padding:3px 6px;border-radius:7px;flex:0 0 auto}
.lessonbar .lbweg:hover{background:rgba(0,0,0,.06);color:#4a545c}
/* Läuft die Seite schon als installierte App, braucht niemand die Anleitung */
@media (display-mode: standalone){.kal .applink{display:none}}
.kal .kzlink{text-decoration:none;font-size:.95rem;margin-left:2px}
/* ---- Outlook-Wochenansicht: Zeitraster + schwebende Termin-Blöcke ---- */
.owoche{border:1px solid var(--line);border-radius:12px;overflow:hidden;background:#fff}
.okopf{display:grid;grid-template-columns:56px repeat(7,1fr);background:#fafafa;border-bottom:1px solid var(--line)}
.otagkopf{padding:9px 4px;text-align:center;font-size:.86rem;font-weight:700;line-height:1.25;border-left:1px solid var(--line)}
.otagkopf small{display:block;color:var(--muted);font-weight:500;font-size:.76rem;margin-top:2px}
.otagkopf.today{color:var(--teal);background:rgba(43,179,192,.10)}
.otagkopf .now{display:block;font-size:.62rem;font-weight:700;color:#fff;background:var(--teal);border-radius:6px;margin:3px auto 0;padding:1px 0;max-width:46px}
.okoerper{display:grid;grid-template-columns:56px repeat(7,1fr)}
.ostunde{height:56px;font-size:.76rem;color:var(--muted);font-weight:600;text-align:right;padding:2px 6px 0 0;border-top:1px solid var(--line);background:#fafafa}
.otag{position:relative;border-left:1px solid var(--line)}
.ozelle{height:28px;border-top:1px solid #f3f5f7}
.ozelle:nth-child(odd){border-top:1px solid #e6eaee}
.ozelle.frei{cursor:pointer}
.ozelle.frei:hover{background:#f0fbf8}
.ozelle.zu{background:#f6f7f8}
.ozelle.vorbei{background:#fbfbfc}
/* Termin-Blöcke im Outlook-Stil: zarte Fläche + kräftige Kante links */
.oblock{position:absolute;left:3px;right:4px;border-radius:6px;border:0;border-left:4px solid transparent;font:inherit;cursor:pointer;text-align:left;
  padding:2px 7px;overflow:hidden;box-shadow:0 1px 2px rgba(16,35,60,.14);display:flex;flex-direction:column;z-index:2}
.oblock .obtitel{font-size:.78rem;font-weight:700;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.oblock .obzeit{font-size:.68rem;opacity:.8;line-height:1.15}
.oblock.busy{background:#d9eafb;color:#174e85;border-left-color:#5b9bd5}       /* gebucht: blau + Name */
.oblock.mine{background:var(--grad);color:#fff;border-left-color:rgba(255,255,255,.65)} /* deine eigene Stunde (Schüler) */
.oblock.req{background:#fff3d6;color:#8a6d1a;border-left-color:#e3b84d}        /* Anfrage: gelb */
.oblock.blk{background:#e7ebee;color:#5f6b73;border-left-color:#aeb8c0}        /* geblockt: grau */
.oblock.abges{background:#fde6e4;color:#a33228;border-left-color:#d9655a;z-index:1} /* abgesagt: rot (nur Kleana) */
.oblock.dim{opacity:.13}
.oblock:hover{outline:2px solid var(--teal);outline-offset:-1px}
/* Handy: Outlook-Tagesansicht (Zeitleiste + eine Tagesspalte) */
.otagwrap{display:grid;grid-template-columns:46px 1fr;border:1px solid var(--line);border-radius:12px;overflow:hidden;background:#fff;margin-top:8px}
.otagwrap .ostunde{height:56px}
.otagwrap .otag{border-left:1px solid var(--line)}
/* Mini-Monatskalender (Outlook-Stil) */
.minikal{margin-top:4px}
.mk-wd{display:grid;grid-template-columns:repeat(7,1fr);font-size:.68rem;color:var(--muted);text-align:center;margin:8px 0 3px;font-weight:700}
.mk-woche{display:grid;grid-template-columns:repeat(7,1fr);border-radius:9px;cursor:pointer}
.mk-woche.on{background:rgba(43,179,192,.16);outline:1.5px solid rgba(43,179,192,.55)}
.mk-tag{background:none;border:0;font:inherit;font-size:.8rem;padding:6px 0;cursor:pointer;border-radius:8px;color:#333}
.mk-tag:hover{background:#e8f2f4}
.mk-tag.aus{color:#bdc4ca}
.mk-tag.heute{color:#fff;background:var(--teal);font-weight:700}
/* Kopfleiste wie Outlook: Heute + Pfeile + Zeitraum (Titel = Aufklapper) */
.wkhead{display:flex;align-items:center;gap:8px;justify-content:flex-start}
.wkhead .titelbtn{background:none;border:0;font:inherit;cursor:pointer;display:flex;align-items:center;gap:5px;padding:3px 7px;border-radius:8px}
.wkhead .titelbtn:hover{background:#eef2f4}
.wkhead .titelbtn .caret{font-size:.72rem;color:var(--muted)}
.mkdrop{background:#fff;border:1px solid var(--line);border-radius:12px;padding:8px 12px 10px;margin:8px 0;max-width:340px;box-shadow:0 10px 30px rgba(0,0,0,.10)}
.wkhead .heutebtn{background:#fff;border:1px solid var(--line);border-radius:9px;padding:7px 13px;font:inherit;font-weight:700;font-size:.85rem;cursor:pointer}
.wkhead .heutebtn:hover{background:#f2f6f7}
.wkhead .pfeil{background:none;border:0;font:inherit;font-size:1.15rem;font-weight:700;cursor:pointer;color:#444;padding:4px 9px;border-radius:8px}
.wkhead .pfeil:hover{background:#eef2f4}
.wkhead b{font-size:1.02rem;margin-left:4px}
@media(max-width:700px){
  /* Handy: aufgeräumt wie eine App – Monatskalender per Tipp auf den Titel */
  .side{display:none}
  .wkhead{flex-wrap:wrap;gap:4px}
  .wkhead b{font-size:.92rem}
  .wkhead .heutebtn{padding:6px 10px;font-size:.8rem}
  .mkdrop{max-width:none}
  .hdr{gap:6px}
  .hdr h1{width:100%}
  .hdr .sp{width:100%;overflow-x:auto;flex-wrap:nowrap;justify-content:flex-start;padding-bottom:3px}
  .hdr .sp .btn,.hdr .sp a{white-space:nowrap;flex:0 0 auto}
  .hdr .sp .who{display:none}
  .who{display:none}
  .hint{font-size:.82rem;padding:9px 11px}
  .balance{overflow-x:auto;flex-wrap:nowrap;padding-bottom:3px}
  .balance .pill{white-space:nowrap;flex:0 0 auto}
  .legend{flex-wrap:nowrap;overflow-x:auto;padding:8px 10px}
  .legitem{white-space:nowrap;flex:0 0 auto}
  .daychips{gap:4px}
  .daychip{flex:1 1 0;min-width:0;padding:6px 2px;font-size:.82rem;text-align:center}
  .daychip small{font-size:.66rem}
  .otagwrap{grid-template-columns:40px 1fr;border-radius:10px}
  .ostunde{font-size:.7rem;padding-right:4px}
  .oblock{left:2px;right:2px;padding:2px 5px}
}
`;

const FONTS = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@700;800&display=swap";
const LS_KEY = "lma_kal_session";

export default function KalenderPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [weekStart, setWeekStart] = useState<Date>(() => mondayOf(new Date()));
  const [viewMonth, setViewMonth] = useState<Date>(() => { const n = new Date(); return new Date(n.getFullYear(), n.getMonth(), 1); });
  // Monatskalender als Aufklapper (v. a. am Handy: auf den Titel oben tippen)
  const [mkOffen, setMkOffen] = useState(false);
  // Weggeklickte "Nächste Stunde"-Leiste (✕): gemerkte Stunden-ID; taucht
  // erst wieder auf, wenn eine ANDERE Stunde die nächste ist
  const [stundeWeg, setStundeWeg] = useState<string>(() => {
    try { return typeof window !== "undefined" ? localStorage.getItem("lma_stunde_weg") || "" : ""; } catch { return ""; }
  });
  const [days, setDays] = useState<Day[]>([]);
  const [balance, setBalance] = useState<Balance | null>(null);
  const [nextLesson, setNextLesson] = useState<NextLesson | null>(null);
  const [overview, setOverview] = useState<OverviewRow[] | null>(null);
  const [teamsDefault, setTeamsDefault] = useState<string | null>(null);
  const [meinTeams, setMeinTeams] = useState<string | null>(null); // Schüler: eigener Teams-Knopf
  const [inbox, setInbox] = useState<Inbox | null>(null);
  const [selDay, setSelDay] = useState<string>("");
  const [filterCls, setFilterCls] = useState<string | null>(null);
  const [modal, setModal] = useState<ReactNode | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const today = iso(new Date());

  const saveSession = useCallback((s: Session | null) => {
    setSession(s);
    try { if (s) localStorage.setItem(LS_KEY, JSON.stringify(s)); else localStorage.removeItem(LS_KEY); } catch { }
  }, []);

  // Session aus localStorage laden (einmalig beim Mounten) und danach mit
  // anderen Tabs/Fenstern synchron halten: Verlängert ein anderer Tab die
  // Sitzung, übernehmen wir hier die neuen Token statt mit veralteten zu
  // arbeiten (sonst loggt Supabase beide Seiten aus).
  useEffect(() => {
    let s: Session | null = null;
    try { const raw = localStorage.getItem(LS_KEY); if (raw) s = JSON.parse(raw); } catch { }
    /* eslint-disable react-hooks/set-state-in-effect */
    if (s) setSession(s);
    setReady(true);
    /* eslint-enable react-hooks/set-state-in-effect */
    const sync = (e: StorageEvent) => {
      if (e.key !== LS_KEY) return;
      try { setSession(e.newValue ? (JSON.parse(e.newValue) as Session) : null); } catch { }
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
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
      // Immer den frischesten Stand aus dem Speicher nehmen: Ein anderer
      // Tab (oder die installierte App) kann die Sitzung schon verlängert
      // haben – Verlängern mit dem alten Token würde BEIDE ausloggen.
      let aktuell = session;
      try { const raw = localStorage.getItem(LS_KEY); if (raw) aktuell = JSON.parse(raw) as Session; } catch { }
      if (aktuell.token !== session.token) {
        r = await call(aktuell.token);
        if (r.status !== 401) { setSession(aktuell); return r.data; }
      }
      let rstatus = 0;
      let rd: Record<string, unknown> = {};
      try {
        const rf = await fetch("/api/kalender", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "refresh", refresh: aktuell.refresh }) });
        rstatus = rf.status;
        rd = (await rf.json().catch(() => ({}))) as Record<string, unknown>;
      } catch { /* Netzwerkfehler – Sitzung NICHT verwerfen */ }
      if (rd.ok && rd.token) { saveSession({ ...aktuell, token: String(rd.token), refresh: String(rd.refresh) }); r = await call(String(rd.token)); }
      else if (rstatus === 401) { saveSession(null); } // nur echtes Ablaufen -> ausloggen
      // sonst: Sitzung behalten (nur vorübergehendes Problem)
    }
    return r.data;
  }, [session, saveSession]);

  // Erkennt Server-Updates: ändert sich die Version, lädt die App sich einmal
  // selbst neu – so hängt die installierte App nie mehr auf altem Stand
  const versionRef = useRef<string>("");

  // Schutz vor überholten Antworten: Läuft eine ältere Hintergrund-
  // Auffrischung noch, während z. B. gerade ein Block freigegeben wurde,
  // darf ihre (veraltete) Antwort die frischen Daten nicht überschreiben.
  const ladeNr = useRef(0);

  const loadWeek = useCallback(async () => {
    const nr = ++ladeNr.current;
    const isAdmin = session?.role === "admin";
    const [d, o, ib] = await Promise.all([
      api("week", { monday: iso(weekStart) }),
      isAdmin ? api("overview") : Promise.resolve(null),
      isAdmin ? api("adminInbox") : Promise.resolve(null),
    ]);
    if (nr !== ladeNr.current) return; // inzwischen gibt es eine neuere Anfrage
    if (d.ok && typeof d.version === "string") {
      if (versionRef.current && versionRef.current !== d.version) { window.location.reload(); return; }
      versionRef.current = d.version;
    }
    if (d.ok) { setDays((d.days as Day[]) || []); setBalance((d.balance as Balance) || null); setNextLesson((d.nextLesson as NextLesson) || null); setMeinTeams((d.teamsLink as string) || null); }
    if (isAdmin && o && o.ok) { setOverview((o.students as OverviewRow[]) || []); setTeamsDefault((o.teamsDefault as string) || null); }
    if (isAdmin && ib && ib.ok) setInbox(ib.inbox as Inbox);
    if (!isAdmin) { setOverview(null); setInbox(null); }
  }, [api, weekStart, session]);

  useEffect(() => {
    // loadWeek ist async – setState passiert erst nach dem await (kein synchroner Kaskaden-Render)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (ready) loadWeek();
  }, [ready, loadWeek]);

  // Immer aktuell, ohne manuelles Neuladen – auch als installierte App:
  // Das System friert die App im Hintergrund ein, und beim Aufwachen kommt
  // teils KEIN visibility-Ereignis ("steht wie ein Foto"). Deshalb ein
  // kurzer Takt mit Wachhund: erkennt er einen Zeitsprung (App war
  // eingefroren), lädt er sofort neu – zusätzlich zu visibility/focus/
  // pageshow/online.
  useEffect(() => {
    if (!ready) return;
    let letzterLauf = Date.now();
    let letzterTick = Date.now();
    const lauf = () => { letzterLauf = Date.now(); void loadWeek().catch(() => { }); };
    const t = window.setInterval(() => {
      const nun = Date.now();
      const warEingefroren = nun - letzterTick > 20000; // Takt stand still
      letzterTick = nun;
      if (document.visibilityState !== "visible") return;
      if (warEingefroren || nun - letzterLauf >= 30000) lauf();
    }, 5000);
    const sicht = () => { if (document.visibilityState === "visible") lauf(); };
    document.addEventListener("visibilitychange", sicht);
    window.addEventListener("focus", sicht);
    window.addEventListener("pageshow", sicht);
    window.addEventListener("online", sicht);
    return () => {
      window.clearInterval(t);
      document.removeEventListener("visibilitychange", sicht);
      window.removeEventListener("focus", sicht);
      window.removeEventListener("pageshow", sicht);
      window.removeEventListener("online", sicht);
    };
  }, [ready, loadWeek]);

  // ---- Aktionen ----
  async function act(action: string, params: Record<string, unknown>) {
    if (busy) return;
    setBusy(true);
    setModal(null); // Fenster sofort schließen -> fühlt sich direkt an
    const d = await api(action, params);
    setBusy(false);
    if (d.ok) { showToast(String(d.message || "Erledigt ✓")); void loadWeek(); }
    else info("Hinweis", "", String(d.error || "Fehler."));
  }
  function showToast(msg: string) { setToast(msg); window.setTimeout(() => setToast(null), 2800); }
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
    if (busy) return;
    // Fortsetzungs-Zelle eines längeren Termins? Zum Start-Slot umleiten,
    // damit alle Aktionen (Absagen, Bestätigen, …) am Anker landen.
    if (s.cont && s.anchor != null) {
      const tag = days.find((d) => d.date === date);
      const anker = tag?.slots.find((x) => x.hour === s.anchor);
      if (anker) { onSlot(date, anker); return; }
      // Feiner Anker (z. B. 16:15) ohne eigene Rasterzelle: Anker-Zeit übernehmen
      s = { ...s, hour: s.anchor, cont: false };
    }
    const role = session?.role || "public";
    const zeit = s.dauer ? `${fmtZeit(s.hour)}–${fmtZeit(s.hour + s.dauer / 60)}` : `${fmtZeit(s.hour)}`;
    const when = `${DAYS[(parseIso(date).getDay() + 6) % 7]} ${dm(parseIso(date))} um ${zeit}`;
    if (s.state === "closed" || s.state === "past") return;

    if (role === "public") {
      if (s.state === "free") openProbe(date, s.hour, when);
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
      if (s.mine && s.state === "busy") {
        const hu = hoursUntil(date, s.hour);
        const istOnline = s.mode === "online";
        setModal(<div className="modal"><h2>Dein Termin</h2><p>{when}{s.mode ? " · " + modeText(s.mode) : ""}</p>
          {hu >= 4 ? <div className="okbox">Absagen: mehr als 4 Std. vorher → wird als <b>Minus-Stunde</b> gutgeschrieben (max. 3).</div>
            : <div className="warn">Absagen: weniger als 4 Std. vorher → zählt <b>nicht</b> als Minus-Stunde.</div>}
          <div className="col">
            <button className="btn p" onClick={() => act("setMode", { date, hour: s.hour, mode: istOnline ? "vor_ort" : "online" })}>
              {istOnline ? "🏫 Diese Stunde vor Ort machen" : "💻 Diese Stunde online machen"}
            </button>
            <button className="btn p" onClick={() => act("cancelMine", { date, hour: s.hour })}>{hu >= 4 ? "Diesen Termin absagen" : "Trotzdem absagen"}</button>
            {s.fixed ? <button className="btn r" onClick={() => act("endFixed", { date, hour: s.hour })}>Festen Termin dauerhaft beenden</button> : null}
            <button className="btn g" onClick={() => setModal(null)}>Zurück</button>
          </div></div>);
        return;
      }
      return;
    }
    // admin
    if (s.state === "free") {
      const wd = (parseIso(date).getDay() + 6) % 7;
      const schlussMin = (wd < 5 ? 20 : 19) * 60;
      setModal(<div className="modal"><h2>Freier Slot: {when}</h2>
        <div className="col">
          <button className="btn p" onClick={() => { const startZelle = s.hour; setModal(<AdminBuchen students={(overview || []).map((r) => ({ id: r.id, name: r.name }))}
            startHour={startZelle} schlussMin={schlussMin} api={api} onClose={() => setModal(null)}
            onSubmit={(sid, m, vonMin, d, fest) => act("adminBook", { date, hour: vonMin / 60, studentId: sid, mode: m, dauerMin: d, fest })} />); }}>
            📅 Termin für Schüler eintragen
          </button>
          <button className="btn p" onClick={() => { const startZelle = s.hour; setModal(<BlockWahl when={when} startHour={startZelle} schlussMin={schlussMin}
            onClose={() => setModal(null)} onSubmit={(vonMin, d) => act("block", { date, hour: vonMin / 60, dauerMin: d })} />); }}>
            ⛔ Blockieren (nur dieses Datum)
          </button>
          <button className="btn p" onClick={() => { const startZelle = s.hour; setModal(<BlockWahl when={when} startHour={startZelle} schlussMin={schlussMin} wochentag={DAYS[wd]}
            onClose={() => setModal(null)} onSubmit={(vonMin, d) => act("blockWeekly", { date, hour: vonMin / 60, dauerMin: d })} />); }}>
            ⛔ Jeden {DAYS[wd]} dauerhaft blockieren
          </button>
          <button className="btn g" onClick={() => setModal(null)}>Abbrechen</button>
        </div></div>);
      return;
    }
    if (s.state === "block") {
      const wd = (parseIso(date).getDay() + 6) % 7;
      setModal(<div className="modal"><h2>Geblockter Slot</h2><p>{when}</p>
        <p>{s.weekly ? `Dauerhaft geblockt – jeden ${DAYS[wd]}.` : "Nur an diesem Datum geblockt."}</p>
        <div className="acts"><button className="btn g" onClick={() => setModal(null)}>Abbrechen</button>
          <button className="btn p" onClick={() => act(s.weekly ? "unblockWeekly" : "unblock", { date, hour: s.hour })}>{s.weekly ? "Dauerhaft freigeben" : "Freigeben"}</button></div></div>);
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
      setModal(<div className="modal"><h2>Termin von {s.name}</h2><p><b>{s.name}</b> · {when}{s.mode ? " · " + modeText(s.mode) : ""}</p>
        <div className="okbox">„Absagen“ gibt {s.name} Nachhol-Guthaben (kein Minus) + Mail.</div>
        <div className="col">
          <button className="btn p" onClick={() => act("adminCancel", { date, hour: s.hour })}>Diese Stunde absagen</button>
          {s.fixed ? <button className="btn r" onClick={() => act("endFixed", { date, hour: s.hour })}>Festen Termin dauerhaft beenden</button> : null}
          <button className="btn g" onClick={() => setModal(null)}>Zurück</button>
        </div></div>);
    }
  }

  function openProbe(date: string, hour: number, when: string) {
    const wd = (parseIso(date).getDay() + 6) % 7;
    const schlussMin = (wd < 5 ? 20 : 19) * 60;
    setModal(<ProbeForm when={when} startHour={hour} schlussMin={schlussMin} onClose={() => setModal(null)} onSubmit={async (name, email, m, vonMin, dauerMin) => {
      const d = await api("requestProbe", { date, hour: vonMin / 60, mode: m, name, email, dauerMin });
      if (d.ok) { setModal(null); showToast(String(d.message || "Probestunde angefragt ✓")); return ""; }
      return String(d.error || "Fehler.");
    }} />);
  }
  function openPassword() {
    setModal(<ChangePassword onClose={() => setModal(null)} onSave={async (pw) => {
      const d = await api("changePassword", { password: pw });
      if (d.ok) { setModal(null); showToast("Passwort geändert ✓"); return ""; }
      return String(d.error || "Fehler.");
    }} />);
  }
  // Teams-Link setzen: pro Schüler oder (ohne studentId) als Standard für alle
  function teamsBearbeiten(studentId: string | null, name: string, aktuell?: string | null) {
    const eingabe = window.prompt(
      studentId
        ? `Teams-Link für ${name}\n(leer lassen = Standard-Link verwenden):`
        : "Dein Standard-Teams-Link (gilt für alle Schüler ohne eigenen Link).\nIn Teams: Besprechung erstellen → Link kopieren → hier einfügen.\nLeer lassen = entfernen:",
      aktuell || "");
    if (eingabe === null) return;
    void act("setTeamsLink", { studentId, link: eingabe.trim() });
  }
  function confirmRemove(r: OverviewRow) {
    setModal(<div className="modal"><h2>Schüler entfernen</h2><p>Möchtest du <b>{r.name}</b> wirklich löschen? Zugang und alle Termine werden entfernt. Das kann nicht rückgängig gemacht werden.</p>
      <div className="acts"><button className="btn g" onClick={() => setModal(null)}>Abbrechen</button>
        <button className="btn r" onClick={() => act("deleteStudent", { studentId: r.id })}>Endgültig entfernen</button></div></div>);
  }

  function openRequest(r: ReqRow) {
    const date = r.date || nextWeekdayDate(r.weekday ?? 0);
    const hour = r.hour;
    const dt = parseIso(date);
    const when = `${DAYS[(dt.getDay() + 6) % 7]} ${dm(dt)} um ${fmtZeit(hour)}`;
    const kindLbl = r.kind === "fix" ? "Fester wöchentlicher Termin" : r.kind === "probe" ? "Probestunde" : "Extra-/Nachholstunde";
    jumpTo(date);
    setModal(<div className="modal"><h2>Anfrage bestätigen</h2><p><b>{r.who}</b> · {when}</p><p style={{ margin: "0 0 8px" }}>{kindLbl}{r.mode ? " · " + modeText(r.mode) : ""}</p>
      {r.kind === "fix" ? <div className="okbox">Wird ab jetzt <b>jede Woche</b> als fester Termin eingetragen.</div> : null}
      <div className="col">
        <button className="btn p" onClick={() => act("adminConfirm", { date, hour })}>Bestätigen &amp; Mail</button>
        <button className="btn r" onClick={() => act("adminReject", { date, hour })}>Absagen &amp; Mail</button>
        <button className="btn g" onClick={() => setModal(null)}>Abbrechen (Fenster schließen)</button>
      </div></div>);
  }

  async function openHistory(id: string, name: string) {
    const d = await api("studentHistory", { studentId: id });
    if (!d.ok) { info("Hinweis", "", String(d.error || "Fehler.")); return; }
    const h = d.history as { plus: string[]; minus: string[]; late: string[]; overmax: string[]; gutschrift: string[] };
    setModal(<div className="modal histmodal"><h2>Verlauf – {name}</h2>
      <div className="histsec"><b className="p">✅ Plus-Stunden ({h.plus.length})</b><div>{h.plus.length ? h.plus.join(" · ") : "keine"}</div></div>
      <div className="histsec"><b className="m">➖ Minus-Stunden ({h.minus.length})</b><div>{h.minus.length ? h.minus.join(" · ") : "keine"}</div></div>
      <div className="histsec"><b className="n">🎁 Gutschrift von Kleana ({h.gutschrift.length})</b><div>{h.gutschrift.length ? h.gutschrift.join(" · ") : "keine"}</div></div>
      <div className="histsec"><b className="w">⚠️ Absage unter 4 Std. – keine Gutschrift ({h.late.length})</b><div>{h.late.length ? h.late.join(" · ") : "keine"}</div></div>
      {h.overmax.length > 0 && <div className="histsec sub">Über Minus-Maximum abgesagt (nicht gezählt): {h.overmax.join(" · ")}</div>}
      <div className="acts"><button className="btn p" onClick={() => setModal(null)}>Schließen</button></div></div>);
  }

  function chooseMode(action: string, date: string, hour: number, title: string) {
    // Spätestes Ende: Ladenschluss (Mo–Fr 20:00, Sa/So 19:00)
    const wd = (parseIso(date).getDay() + 6) % 7;
    const schlussMin = (wd < 5 ? 20 : 19) * 60;
    setModal(<BuchungsWahl title={title} startHour={hour} schlussMin={schlussMin}
      onClose={() => setModal(null)}
      onSubmit={(m, vonMin, d) => act(action, { date, hour: vonMin / 60, mode: m, dauerMin: d })} />);
  }

  function openAddStudent() {
    setModal(<AddStudent onClose={() => setModal(null)} onCreate={async (name, email) => {
      const d = await api("createStudent", { name, email });
      if (d.ok) { await loadWeek(); setModal(null); info("Schüler angelegt ✓", String(d.message || "")); return ""; }
      return String(d.error || "Fehler.");
    }} />);
  }

  // Mini-Monatskalender wie in Outlook (Seitenleiste am PC, Aufklapper am
  // Handy). Tag anklicken springt zur Woche; onPick schließt den Aufklapper.
  function miniKalender(onPick?: () => void) {
    return (<>
      <div className="mnav"><button onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1))}>‹</button>
        <b>{MONTHS[viewMonth.getMonth()]} {viewMonth.getFullYear()}</b>
        <button onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1))}>›</button></div>
      <div className="minikal">
        <div className="mk-wd">{["M", "D", "M", "D", "F", "S", "S"].map((w, i) => <span key={i}>{w}</span>)}</div>
        {monthWeeks.map((w) => (
          <div key={w.key} className={"mk-woche" + (w.on ? " on" : "")}>
            {w.tage.map((t) => (
              <button key={t.iso} className={"mk-tag" + (t.aussen ? " aus" : "") + (t.iso === today ? " heute" : "")}
                onClick={() => { jumpTo(t.iso); onPick?.(); }}>{t.nr}</button>
            ))}
          </div>
        ))}
      </div>
    </>);
  }

  // Eine Tagesspalte der Outlook-Ansicht (Woche am PC, Einzeltag am Handy):
  // Hintergrund-Zellen (frei klickbar) + schwebende Termin-Blöcke; Absagen
  // erscheinen für Kleana als rote Info-Blöcke, der Zeitraum bleibt buchbar.
  function tagSpalte(d: Day) {
    const events: { start: number; dauer: number; s: Slot }[] = [];
    const seen = new Set<number>();
    d.slots.forEach((sl) => {
      if (sl.state !== "busy" && sl.state !== "req" && sl.state !== "block") return;
      const start = sl.cont && sl.anchor != null ? sl.anchor : sl.hour;
      if (seen.has(start)) return;
      seen.add(start);
      events.push({ start, dauer: sl.dauer || 30, s: { ...sl, hour: start, cont: false, anchor: undefined } });
    });
    return (
      <div key={d.date} className="otag">
        {HOURS.map((h) => {
          const sl = d.slots.find((x) => x.hour === h) || { hour: h, state: "closed" };
          const frei = sl.state === "free";
          const cls = sl.state === "closed" ? " zu" : sl.state === "past" ? " vorbei" : frei ? " frei" : "";
          return <div key={h} className={"ozelle" + cls} onClick={frei ? () => onSlot(d.date, sl) : undefined} />;
        })}
        {(d.absagen || []).map((ab, i) => {
          const dim = filterCls && filterCls !== "abges" ? " dim" : "";
          return (
            <button key={"ab" + i} className={"oblock abges" + dim}
              style={{ top: (ab.start - 8) * STUNDE_PX, height: Math.max(18, (ab.dauer / 60) * STUNDE_PX - 2) }}
              title="Abgesagt – der Zeitraum ist wieder frei"
              onClick={() => { const zelle = d.slots.find((x) => x.hour === Math.floor(ab.start * 2) / 2); if (zelle) onSlot(d.date, zelle); }}>
              <span className="obtitel">✗ {ab.name}</span>
              {ab.dauer >= 30 && <span className="obzeit">{fmtZeit(ab.start)}–{minZuZeit(Math.round(ab.start * 60) + ab.dauer)} · abgesagt</span>}
            </button>
          );
        })}
        {events.map((ev) => {
          const v = cellView(ev.s, role);
          const dim = filterCls && v.cls !== filterCls ? " dim" : "";
          return (
            <button key={ev.start} className={"oblock " + v.cls + dim}
              style={{ top: (ev.start - 8) * STUNDE_PX, height: Math.max(18, (ev.dauer / 60) * STUNDE_PX - 2) }}
              onClick={() => onSlot(d.date, ev.s)}>
              <span className="obtitel">{v.label || "Belegt"}</span>
              {ev.dauer >= 30 && <span className="obzeit">{fmtZeit(ev.start)}–{minZuZeit(Math.round(ev.start * 60) + ev.dauer)}</span>}
            </button>
          );
        })}
      </div>
    );
  }

  // ---- Sidebar-Wochenliste des Monats ----
  const monthWeeks: { key: string; on: boolean; tage: { iso: string; nr: number; aussen: boolean }[] }[] = [];
  {
    const last = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 0);
    let m = mondayOf(viewMonth);
    while (m <= last) {
      const tage = Array.from({ length: 7 }, (_, i) => {
        const t = addDays(m, i);
        return { iso: iso(t), nr: t.getDate(), aussen: t.getMonth() !== viewMonth.getMonth() };
      });
      monthWeeks.push({ key: iso(m), on: iso(m) === iso(weekStart), tage });
      m = addDays(m, 7);
    }
  }
  const role = session?.role || "public";
  const legend = buildLegend(role);
  const wEnd = addDays(weekStart, 6);
  const effSel = days.find((d) => d.date === selDay) ? selDay : (days.find((d) => d.date === today)?.date || days[0]?.date || "");
  function jumpTo(dateStr: string) { const d = parseIso(dateStr); setWeekStart(mondayOf(d)); setViewMonth(new Date(d.getFullYear(), d.getMonth(), 1)); setSelDay(dateStr); }
  function nextWeekdayDate(wd: number) { const t = new Date(); t.setHours(0, 0, 0, 0); for (let i = 0; i < 14; i++) { const x = addDays(t, i); if ((x.getDay() + 6) % 7 === wd) return iso(x); } return iso(t); }

  return (
    <div className="kal">
      <link rel="stylesheet" href={FONTS} />
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="wrap">
        <div className="hdr">
          <h1>📅 Terminkalender</h1>
          <div className="sp">
            <a className="back" href="https://lernemitanna.de">← lernemitanna.de</a>
            <a className="btn g sm applink" style={{ textDecoration: "none" }} href="/app-installieren">📱 Als App</a>
            {session
              ? <>{meinTeams && session.role !== "admin" && <a className="btn p sm" style={{ textDecoration: "none" }} href={meinTeams} target="_blank" rel="noreferrer" title="Deine Video-Stunde in Microsoft Teams öffnen">📹 Teams</a>}<a className="btn p sm" style={{ textDecoration: "none" }} href="/klassenzimmer">🏫 Klassenzimmer</a><span className="who">{session.name} · {session.role === "admin" ? "Kleana" : "Schüler"}</span><button className="btn g sm" onClick={openPassword}>Passwort</button><button className="btn g sm" onClick={() => { saveSession(null); setBalance(null); setOverview(null); }}>Abmelden</button></>
              : <button className="btn p sm" onClick={openLogin}>Einloggen</button>}
          </div>
        </div>

        {!session && <div className="hint"><b>Neu hier?</b> Klick auf einen freien Slot, um eine <b>Probestunde</b> anzufragen (ohne Anmeldung).</div>}

        {session && nextLesson && nextLesson.id !== stundeWeg && (
          <StundenLeiste lesson={nextLesson} istLehrerin={session.role === "admin"}
            onWeg={() => { setStundeWeg(nextLesson.id); try { localStorage.setItem("lma_stunde_weg", nextLesson.id); } catch { } }} />
        )}

        {balance && (
          <div className="balance">
            {balance.fix && balance.fix.length > 0 && balance.fix.map((f, i) => (
              <button key={i} className="pill fixpill" title="Zum Termin springen" onClick={() => { const d = nextWeekdayDate(f.weekday); jumpTo(d); }}>
                Fester Termin: {DAYS[f.weekday]} {fmtZeit(f.hour)}{f.dauer && f.dauer !== 60 ? ` (${f.dauer} Min.)` : ""}{f.mode ? " " + modeEmoji(f.mode) : ""}
              </button>
            ))}
            <span className="lbl">Deine Stunden:</span>
            <span className="pill"><span className="m">Minus {balance.minus}/3</span><span className="tip"><b>Minus-Stunden:</b><br />{balance.dates.minus.length ? balance.dates.minus.join(", ") : "keine"}</span></span>
            <span className="pill"><span className="p">Plus {balance.plus}</span><span className="tip"><b>Plus-Stunden:</b><br />{balance.dates.plus.length ? balance.dates.plus.join(", ") : "keine"}</span></span>
            <span className="pill"><span className="n">Gutschrift (Kleana) {balance.nach}</span><span className="tip"><b>Gutschrift von Kleana (kostenlos nachholbar):</b><br />{balance.dates.nach.length ? balance.dates.nach.join(", ") : "keine"}</span></span>
          </div>
        )}

        {role === "admin" && overview && (
          <div className="overview">
            <div className="ovh"><h3>Übersicht: Plus- &amp; Minus-Stunden</h3><span style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{teamsDefault && <a className="minibtn" style={{ textDecoration: "none" }} href={teamsDefault} target="_blank" rel="noreferrer" title="Deinen Teams-Raum jetzt öffnen">▶ Teams öffnen</a>}<button className="minibtn" onClick={() => teamsBearbeiten(null, "Standard", teamsDefault)} title={teamsDefault ? `Standard: ${teamsDefault}` : "Noch kein Standard-Teams-Link hinterlegt"}>{teamsDefault ? "🎦 Teams-Link ✓" : "🎦 Teams-Link"}</button><button className="minibtn" onClick={openAddStudent}>+ Neuen Schüler anlegen</button></span></div>
            <div className="otblwrap"><table className="otbl"><thead><tr><th>Schüler</th><th>Fester Termin</th><th>Minus</th><th>Plus</th><th>Nachhol</th><th></th></tr></thead>
              <tbody>{overview.map((r) => (<tr key={r.id}><td><button className="namebtn" title="Verlauf ansehen" onClick={() => openHistory(r.id, r.name)}>{r.name}</button> <a className="kzlink" title={`Klassenzimmer von ${r.name} öffnen`} href={`/klassenzimmer?schueler=${r.id}`}>🏫</a> <button className="kzlink" style={{ border: 0, background: "none", cursor: "pointer", opacity: r.teams ? 1 : 0.45 }} title={r.teams ? `Eigener Teams-Link: ${r.teams}` : "Eigenen Teams-Link für diesen Schüler setzen (sonst gilt der Standard)"} onClick={() => teamsBearbeiten(r.id, r.name, r.teams)}>🎦</button></td><td>{r.fix}</td>
                <td><span className="stp"><button className="stpb" onClick={() => act("adjustBalance", { studentId: r.id, field: "minus", delta: -1 })}>−</button><span className={"tag htip " + (r.minus ? "m" : "z")}>{r.minus}<span className="tt"><b>Minus:</b><br />{r.minusD && r.minusD.length ? r.minusD.join(", ") : "keine"}</span></span><button className="stpb" onClick={() => act("adjustBalance", { studentId: r.id, field: "minus", delta: 1 })}>+</button></span></td>
                <td><span className="stp"><button className="stpb" onClick={() => act("adjustBalance", { studentId: r.id, field: "plus", delta: -1 })}>−</button><span className={"tag htip " + (r.plus ? "p" : "z")}>{r.plus}<span className="tt"><b>Plus:</b><br />{r.plusD && r.plusD.length ? r.plusD.join(", ") : "keine"}</span></span><button className="stpb" onClick={() => act("adjustBalance", { studentId: r.id, field: "plus", delta: 1 })}>+</button></span></td>
                <td><span className="stp"><button className="stpb" onClick={() => act("adjustBalance", { studentId: r.id, field: "makeup", delta: -1 })}>−</button><span className={"tag htip " + (r.nach ? "p" : "z")}>{r.nach}<span className="tt"><b>Gutschrift:</b><br />{r.nachD && r.nachD.length ? r.nachD.join(", ") : "keine"}</span></span><button className="stpb" onClick={() => act("adjustBalance", { studentId: r.id, field: "makeup", delta: 1 })}>+</button></span></td>
                <td><button className="rmv" title="Schüler entfernen" onClick={() => confirmRemove(r)}>✕</button></td></tr>))}
                {overview.length === 0 && <tr><td colSpan={6} style={{ color: "#999" }}>Noch keine Schüler. Lege oben rechts den ersten an.</td></tr>}
              </tbody></table></div>
          </div>
        )}

        {role === "admin" && inbox && (inbox.requests.length > 0 || inbox.cancellations.length > 0) && (
          <div className="overview">
            <h3>Offene Anfragen (alle Daten)</h3>
            {inbox.requests.length === 0 ? <p style={{ color: "#999", margin: "6px 0 0" }}>Keine offenen Anfragen.</p> :
              <div className="inbxlist">{inbox.requests.map((r, i) => {
                const when = r.date ? `${DAYS[(parseIso(r.date).getDay() + 6) % 7]} ${dm(parseIso(r.date))} ${fmtZeit(r.hour)}` : `jeden ${DAYS[r.weekday ?? 0]} ${fmtZeit(r.hour)}`;
                const kindLbl = r.kind === "fix" ? "fester Termin" : r.kind === "probe" ? "Probestunde" : "Extra-Stunde";
                return <button key={i} className="inbxrow" onClick={() => openRequest(r)}>
                  <span className="ibw">{r.who}</span><span className="ibd">{when} · {kindLbl}{r.mode ? " · " + modeText(r.mode) : ""}</span><span className="ibgo">bestätigen ›</span></button>;
              })}</div>}
            {inbox.cancellations.length > 0 && <>
              <h3 style={{ marginTop: 16 }}>Letzte Absagen</h3>
              <div className="inbxlist">{inbox.cancellations.map((c, i) => (
                <button key={i} className="inbxrow" onClick={() => jumpTo(c.date)}><span className="ibw">{c.who}</span><span className="ibd">{DAYS[(parseIso(c.date).getDay() + 6) % 7]} {dm(parseIso(c.date))} {fmtZeit(c.hour)} · {c.byAnna ? "von dir abgesagt" : c.credited ? "Absage (Minus +1)" : "Absage (keine Gutschrift)"}</span><span className="ibgo">ansehen ›</span></button>
              ))}</div>
            </>}
          </div>
        )}

        <div className="layout">
          <div className="side">
            {miniKalender()}
          </div>

          <div className="calwrap">
            {/* Kopfleiste wie in Outlook: Heute + Pfeile + Zeitraum */}
            <div className="wkhead">
              <button className="heutebtn" onClick={() => { const jetzt = new Date(); const n = mondayOf(jetzt); setWeekStart(n); setViewMonth(new Date(jetzt.getFullYear(), jetzt.getMonth(), 1)); setSelDay(iso(jetzt)); }}>→ Heute</button>
              <button className="pfeil" aria-label="Vorherige Woche" onClick={() => { const n = addDays(weekStart, -7); setWeekStart(n); setViewMonth(new Date(n.getFullYear(), n.getMonth(), 1)); }}>‹</button>
              <button className="pfeil" aria-label="Nächste Woche" onClick={() => { const n = addDays(weekStart, 7); setWeekStart(n); setViewMonth(new Date(n.getFullYear(), n.getMonth(), 1)); }}>›</button>
              {/* Titel antippen = Monatskalender aufklappen (wie in Outlook) */}
              <button className="titelbtn" onClick={() => setMkOffen(!mkOffen)}>
                <b>{weekStart.getMonth() === wEnd.getMonth()
                  ? `${weekStart.getDate()}. – ${wEnd.getDate()}. ${MONTHS[wEnd.getMonth()]} ${wEnd.getFullYear()}`
                  : `${weekStart.getDate()}. ${MONTHS[weekStart.getMonth()]} – ${wEnd.getDate()}. ${MONTHS[wEnd.getMonth()]} ${wEnd.getFullYear()}`}</b>
                <span className="caret">{mkOffen ? "▴" : "▾"}</span>
              </button>
            </div>
            {mkOffen && <div className="mkdrop">{miniKalender(() => setMkOffen(false))}</div>}
            <div className="legend">{legend.map((l, i) => { const cls = SWATCH_CLS[l.c]; const on = filterCls === cls; return (
              <button key={i} className={"legitem" + (on ? " on" : "")} onClick={() => setFilterCls(on ? null : cls)}><i className={l.c} />{l.t}</button>
            ); })}{filterCls && <button className="legclear" onClick={() => setFilterCls(null)}>Filter aufheben ✕</button>}</div>
            {days.length === 0 ? <div className="kloading"><span className="kspin" /> Kalender wird geladen…</div> : <>
            <div className="deskgrid"><div className="owoche">
              <div className="okopf">
                <div />
                {days.map((d) => {
                  const dt = parseIso(d.date); const isToday = d.date === today;
                  return <div key={d.date} className={"otagkopf" + (isToday ? " today" : "")}>{DAYS[d.weekday]}<small>{dm(dt)}</small>{isToday ? <span className="now">heute</span> : null}</div>;
                })}
              </div>
              <div className="okoerper">
                <div>
                  {HOURS.filter((h) => h % 1 === 0).map((h) => <div key={h} className="ostunde">{fmtZeit(h)}</div>)}
                </div>
                {days.map((d) => tagSpalte(d))}
              </div>
            </div></div>
            <div className="dayview">
              <div className="daychips">{days.map((d) => (
                <button key={d.date} className={"daychip" + (d.date === effSel ? " on" : "") + (d.date === today ? " td" : "")} onClick={() => setSelDay(d.date)}>{DAYS[d.weekday]}<small>{dm(parseIso(d.date))}</small></button>
              ))}</div>
              {/* Handy: gleiche Outlook-Ansicht, nur ein Tag */}
              <div className="otagwrap">
                <div>
                  {HOURS.filter((h) => h % 1 === 0).map((h) => <div key={h} className="ostunde">{fmtZeit(h)}</div>)}
                </div>
                {(() => { const d = days.find((x) => x.date === effSel); return d ? tagSpalte(d) : null; })()}
              </div>
            </div>
            </>}
          </div>
        </div>
      </div>
      {modal && <div className="ov">{modal}</div>}
      {busy && <div className="saving">Speichern…</div>}
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

// ------- kleine Komponenten -------
function modeEmoji(m?: string | null) { return m === "online" ? "💻" : m === "vor_ort" ? "📍" : ""; }
function modeText(m?: string | null) { return m === "online" ? "💻 Online" : m === "vor_ort" ? "📍 Vor Ort" : ""; }
function cellView(s: Slot, role: string): { cls: string; label: string } {
  if (s.state === "closed") return { cls: "closed", label: "" };
  if (s.state === "past" && !s.cont) return { cls: "past", label: "" };
  if (s.state === "free") return { cls: "free", label: "frei" };
  // Fortsetzungs-Zelle eines längeren Termins: gleiche Farbe, dezentes Zeichen
  if (s.cont) {
    const cls = s.state === "block" ? "blk" : s.mine ? "mine" : s.state === "req" ? (role === "admin" || s.mine ? "req" : "busy") : "busy";
    return { cls, label: "⋯" };
  }
  if (s.state === "block") return { cls: "blk", label: role === "admin" ? "Geblockt" : "Belegt" };
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
  else items.push({ c: "sw-busy", t: "gebucht" }, { c: "sw-req", t: "Anfrage" }, { c: "sw-abges", t: "abgesagt" }, { c: "sw-block", t: "geblockt (du)" });
  items.push({ c: "sw-closed", t: "geschlossen" });
  return items;
}

// Virtuelles Klassenzimmer: Leiste mit "Zur Stunde"-Button für die nächste
// anstehende Stunde. Schüler dürfen ab 15 Min vor Beginn rein (vorher zeigt
// der Button einen Countdown), Kleana jederzeit.
function StundenLeiste({ lesson, istLehrerin, onWeg }: { lesson: NextLesson; istLehrerin: boolean; onWeg: () => void }) {
  // Aktuelle Zeit als State, jede halbe Minute aktualisiert -> Countdown bleibt frisch
  const [jetzt, setJetzt] = useState<number | null>(null);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setJetzt(Date.now());
    const t = window.setInterval(() => setJetzt(Date.now()), 30000);
    return () => window.clearInterval(t);
  }, []);
  if (jetzt === null) return null; // erster Render (vor Mount): noch nichts anzeigen
  const start = new Date(lesson.starts_at);
  const einlassAb = start.getTime() - 15 * 60000;
  // Teams hat einen eigenen Wartebereich -> keine 15-Minuten-Sperre nötig
  const offen = istLehrerin || !!lesson.teamsLink || jetzt >= einlassAb;
  const wann = `${DAYS[(start.getDay() + 6) % 7]} ${dm(start)} um ${pad(start.getHours())}:${pad(start.getMinutes())}`;
  // Vor-Ort-Stunden brauchen keinen Video-Beitritt – nur freundlich erinnern
  if (lesson.mode === "vor_ort") {
    return (
      <div className="hint lessonbar">
        <span>🏫 <b>Nächste Stunde:</b> {lesson.title} – {wann} · vor Ort</span>
        <button className="lbweg" style={{ marginLeft: "auto" }} title="Hinweis ausblenden" onClick={onWeg}>✕</button>
      </div>
    );
  }
  const restMin = Math.max(1, Math.ceil((einlassAb - jetzt) / 60000));
  const rest = restMin >= 60
    ? (restMin >= 1440 ? `${Math.floor(restMin / 1440)} Tag(en)` : `${Math.floor(restMin / 60)} Std. ${restMin % 60} Min.`)
    : `${restMin} Min.`;
  return (
    <div className="hint lessonbar">
      <span>🎥 <b>Nächste Stunde:</b> {lesson.title} – {wann}</span>
      {offen
        ? (lesson.teamsLink
          ? <a className="btn p sm" href={lesson.teamsLink} target="_blank" rel="noreferrer">Zur Stunde (Teams)</a>
          : <a className="btn p sm" href={`/stunde/${lesson.id}`}>Zur Stunde</a>)
        : <button className="btn g sm" disabled title="Der Raum öffnet 15 Minuten vor Beginn">Beitritt in {rest}</button>}
      <button className="lbweg" title="Hinweis ausblenden" onClick={onWeg}>✕</button>
    </div>
  );
}

function Info({ title, msg, err, onClose }: { title: string; msg: string; err?: string; onClose: () => void }) {
  return <div className="modal"><h2>{title}</h2>{msg ? <p style={{ whiteSpace: "pre-line" }}>{msg}</p> : null}{err ? <div className="err">{err}</div> : null}
    <div className="acts"><button className="btn p" onClick={onClose}>OK</button></div></div>;
}
function Login({ onLogin, onClose }: { onLogin: (e: string, p: string) => Promise<string>; onClose: () => void }) {
  const [email, setEmail] = useState(""); const [pw, setPw] = useState(""); const [show, setShow] = useState(false); const [err, setErr] = useState(""); const [load, setLoad] = useState(false);
  async function go() { setLoad(true); setErr(await onLogin(email.trim(), pw)); setLoad(false); }
  return <div className="modal"><h2>Einloggen</h2><p>Mit deinem Namen und deinem Passwort. (E-Mail geht auch.)</p>
    <label>Name</label><input type="text" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => e.key === "Enter" && go()} placeholder="z. B. Nora" autoComplete="username" />
    <label>Passwort</label>
    <div className="pwrow"><input type={show ? "text" : "password"} value={pw} onChange={(e) => setPw(e.target.value)} onKeyDown={(e) => e.key === "Enter" && go()} />
      <button type="button" className="eye" onClick={() => setShow(!show)} title={show ? "verbergen" : "anzeigen"}>{show ? "🙈" : "👁"}</button></div>
    {err ? <div className="err">{err}</div> : null}
    <div className="acts"><button className="btn g" onClick={onClose}>Abbrechen</button><button className="btn p" onClick={go} disabled={load}>{load ? "…" : "Einloggen"}</button></div></div>;
}
// Start- und Endzeit wie in Outlook: Start = angeklickter Slot (fest),
// Ende per Auswahlliste (15-Minuten-Schritte bis Ladenschluss).
const minZuZeit = (min: number) => `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;
const zeitZuMin = (z: string) => { const [h, m] = z.split(":").map(Number); return Number.isFinite(h) && Number.isFinite(m) ? h * 60 + m : NaN; };
// Von–Bis frei eintippbar, JEDE Minute möglich (auch 16:33) – einfach wie in
// Outlook: zwei Uhrzeit-Felder, tippen oder über die Uhr wählen.
function ZeitVonBis({ von, bis, setVon, setBis }: {
  von: string; bis: string; setVon: (z: string) => void; setBis: (z: string) => void;
}) {
  return (
    <div className="acts" style={{ marginTop: 6, alignItems: "center", flexWrap: "wrap" }}>
      <span style={{ fontWeight: 600 }}>Von</span>
      <input type="time" value={von} onChange={(e) => setVon(e.target.value)} aria-label="Startzeit" style={{ width: 110 }} />
      <span style={{ fontWeight: 600 }}>bis</span>
      <input type="time" value={bis} onChange={(e) => setBis(e.target.value)} aria-label="Endzeit" style={{ width: 110 }} />
    </div>
  );
}
// Prüfung der Von–Bis-Zeiten; leerer Text = alles gut
function zeitFehler(von: string, bis: string, schlussMin: number): string {
  const v = zeitZuMin(von), b = zeitZuMin(bis);
  if (!Number.isFinite(v) || !Number.isFinite(b)) return "Bitte Von- und Bis-Zeit angeben.";
  if (v < 480) return "Frühester Beginn: 08:00 Uhr.";
  if (b > schlussMin) return `Spätestes Ende: ${minZuZeit(schlussMin)} Uhr.`;
  if (b - v < 5) return "Die Stunde muss mindestens 5 Minuten dauern.";
  if (b - v > 300) return "Maximal 5 Stunden am Stück.";
  return "";
}
// Kleana trägt selbst einen Termin für einen Schüler ein – Startzeit
// minutengenau wählbar (z. B. 8:05), sofort bestätigt. Die Schülerliste
// lädt sich zur Sicherheit selbst nach, falls sie noch nicht da ist.
function AdminBuchen({ students, startHour, schlussMin, api, onSubmit, onClose }: {
  students: { id: string; name: string }[]; startHour: number; schlussMin: number;
  api: (a: string, p?: Record<string, unknown>) => Promise<Record<string, unknown>>;
  onSubmit: (studentId: string, mode: string, vonMin: number, dauerMin: number, fest: boolean) => void; onClose: () => void;
}) {
  const startMin = Math.round(startHour * 60);
  const [liste, setListe] = useState(students);
  const [sid, setSid] = useState(students[0]?.id || "");
  const [von, setVon] = useState(minZuZeit(startMin));
  const [bis, setBis] = useState(minZuZeit(Math.min(startMin + 60, schlussMin)));
  const [fest, setFest] = useState(false);
  useEffect(() => {
    if (liste.length > 0) return;
    (async () => {
      const d = await api("overview");
      const rows = ((d.students as { id: string; name: string }[]) || []).map((r) => ({ id: r.id, name: r.name }));
      setListe(rows);
      if (rows.length && !sid) setSid(rows[0].id);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const fehler = zeitFehler(von, bis, schlussMin);
  return <div className="modal"><h2>📅 Termin eintragen</h2>
    <label>Für welchen Schüler?</label>
    <select value={sid} onChange={(e) => setSid(e.target.value)} style={{ width: "100%" }}>
      {liste.map((st) => <option key={st.id} value={st.id}>{st.name}</option>)}
      {liste.length === 0 && <option value="">Lade Schüler …</option>}
    </select>
    <label>Von wann bis wann? (frei eintippbar, z. B. 16:33)</label>
    <ZeitVonBis von={von} bis={bis} setVon={setVon} setBis={setBis} />
    <label>Einmalig oder jede Woche?</label>
    <div className="acts" style={{ marginTop: 6 }}>
      <button type="button" className={"btn " + (!fest ? "p" : "g")} onClick={() => setFest(false)}>Nur dieses Datum</button>
      <button type="button" className={"btn " + (fest ? "p" : "g")} onClick={() => setFest(true)}>Jede Woche fest</button>
    </div>
    {fehler ? <div className="err">{fehler}</div>
      : <p style={{ margin: "10px 0 4px" }}>Also <b>{von}–{bis}</b>{fest ? " (wöchentlich)" : ""}. Und: online oder vor Ort?</p>}
    <div className="col">
      <button className="btn p" disabled={!sid || !!fehler} onClick={() => onSubmit(sid, "online", zeitZuMin(von), zeitZuMin(bis) - zeitZuMin(von), fest)}>💻 Online</button>
      <button className="btn p" disabled={!sid || !!fehler} onClick={() => onSubmit(sid, "vor_ort", zeitZuMin(von), zeitZuMin(bis) - zeitZuMin(von), fest)}>📍 Vor Ort</button>
      <button className="btn g" onClick={onClose}>Zurück</button>
    </div></div>;
}
// Blockieren minutengenau (z. B. 16:15–16:20 für eigene Arbeit sperren);
// mit wochentag = dauerhaft jede Woche, sonst nur dieses Datum
function BlockWahl({ when, startHour, schlussMin, wochentag, onSubmit, onClose }: {
  when: string; startHour: number; schlussMin: number; wochentag?: string;
  onSubmit: (vonMin: number, dauerMin: number) => void; onClose: () => void;
}) {
  const startMin = Math.round(startHour * 60);
  const [von, setVon] = useState(minZuZeit(startMin));
  const [bis, setBis] = useState(minZuZeit(Math.min(startMin + 60, schlussMin)));
  const fehler = zeitFehler(von, bis, schlussMin);
  return <div className="modal"><h2>{wochentag ? `⛔ Jeden ${wochentag} blockieren` : "⛔ Blockieren"}</h2><p>{when}</p>
    <div className="okbox">{wochentag
      ? `Gilt ab jetzt jede Woche am ${wochentag} – Schüler sehen den Zeitraum als „belegt“ und können nicht buchen.`
      : "Für eigene Arbeit sperren – Schüler sehen den Zeitraum als „belegt“ und können nicht buchen."}</div>
    <ZeitVonBis von={von} bis={bis} setVon={setVon} setBis={setBis} />
    {fehler && <div className="err">{fehler}</div>}
    <div className="acts"><button className="btn g" onClick={onClose}>Zurück</button>
      <button className="btn p" disabled={!!fehler} onClick={() => onSubmit(zeitZuMin(von), zeitZuMin(bis) - zeitZuMin(von))}>{wochentag ? "Dauerhaft blockieren" : "Blockieren"}</button></div></div>;
}
function BuchungsWahl({ title, startHour, schlussMin, onSubmit, onClose }: {
  title: string; startHour: number; schlussMin: number;
  onSubmit: (mode: string, vonMin: number, dauerMin: number) => void; onClose: () => void;
}) {
  const startMin = Math.round(startHour * 60);
  const [von, setVon] = useState(minZuZeit(startMin));
  const [bis, setBis] = useState(minZuZeit(Math.min(startMin + 60, schlussMin)));
  const fehler = zeitFehler(von, bis, schlussMin);
  return <div className="modal"><h2>{title}</h2>
    <p>Von wann bis wann soll die Stunde gehen? (frei eintippbar, z. B. 16:33)</p>
    <ZeitVonBis von={von} bis={bis} setVon={setVon} setBis={setBis} />
    {fehler ? <div className="err">{fehler}</div>
      : <p style={{ margin: "10px 0 4px" }}>Also <b>{von}–{bis}</b>. Und: online oder vor Ort?</p>}
    <div className="col">
      <button className="btn p" disabled={!!fehler} onClick={() => onSubmit("online", zeitZuMin(von), zeitZuMin(bis) - zeitZuMin(von))}>💻 Online</button>
      <button className="btn p" disabled={!!fehler} onClick={() => onSubmit("vor_ort", zeitZuMin(von), zeitZuMin(bis) - zeitZuMin(von))}>📍 Vor Ort</button>
      <button className="btn g" onClick={onClose}>Zurück</button>
    </div></div>;
}
function ProbeForm({ when, startHour, schlussMin, onSubmit, onClose }: { when: string; startHour: number; schlussMin: number; onSubmit: (name: string, email: string, mode: string, vonMin: number, dauerMin: number) => Promise<string>; onClose: () => void }) {
  const startMin = Math.round(startHour * 60);
  const [name, setName] = useState(""); const [email, setEmail] = useState(""); const [mode, setMode] = useState("");
  const [von, setVon] = useState(minZuZeit(startMin)); const [bis, setBis] = useState(minZuZeit(Math.min(startMin + 60, schlussMin)));
  const [err, setErr] = useState(""); const [load, setLoad] = useState(false);
  async function go() {
    if (!name.trim() || !email.trim()) { setErr("Bitte Name und E-Mail angeben."); return; }
    if (!mode) { setErr("Bitte online oder vor Ort wählen."); return; }
    const zf = zeitFehler(von, bis, schlussMin);
    if (zf) { setErr(zf); return; }
    setLoad(true); setErr(await onSubmit(name.trim(), email.trim(), mode, zeitZuMin(von), zeitZuMin(bis) - zeitZuMin(von))); setLoad(false);
  }
  return <div className="modal"><h2>Probestunde anfragen</h2><p>{when}</p>
    <label>Dein Name</label><input value={name} onChange={(e) => setName(e.target.value)} placeholder="Vor- und Nachname" />
    <label>Deine E-Mail</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="du@example.com" />
    <label>Von wann bis wann?</label>
    <ZeitVonBis von={von} bis={bis} setVon={setVon} setBis={setBis} />
    <label>Online oder vor Ort?</label>
    <div className="acts" style={{ marginTop: 6 }}>
      <button type="button" className={"btn " + (mode === "online" ? "p" : "g")} onClick={() => setMode("online")}>💻 Online</button>
      <button type="button" className={"btn " + (mode === "vor_ort" ? "p" : "g")} onClick={() => setMode("vor_ort")}>📍 Vor Ort</button>
    </div>
    {err ? <div className="err">{err}</div> : null}
    <div className="acts"><button className="btn g" onClick={onClose}>Abbrechen</button><button className="btn p" onClick={go} disabled={load}>{load ? "…" : "Anfragen"}</button></div></div>;
}
function ChangePassword({ onSave, onClose }: { onSave: (pw: string) => Promise<string>; onClose: () => void }) {
  const [pw, setPw] = useState(""); const [pw2, setPw2] = useState(""); const [err, setErr] = useState(""); const [load, setLoad] = useState(false);
  async function go() {
    if (pw.length < 6) { setErr("Mindestens 6 Zeichen."); return; }
    if (pw !== pw2) { setErr("Die Passwörter stimmen nicht überein."); return; }
    setLoad(true); setErr(await onSave(pw)); setLoad(false);
  }
  return <div className="modal"><h2>Passwort ändern</h2><p>Wähle ein neues Passwort für deinen Zugang.</p>
    <label>Neues Passwort</label><input type="password" value={pw} onChange={(e) => setPw(e.target.value)} />
    <label>Nochmal wiederholen</label><input type="password" value={pw2} onChange={(e) => setPw2(e.target.value)} onKeyDown={(e) => e.key === "Enter" && go()} />
    {err ? <div className="err">{err}</div> : null}
    <div className="acts"><button className="btn g" onClick={onClose}>Abbrechen</button><button className="btn p" onClick={go} disabled={load}>{load ? "…" : "Speichern"}</button></div></div>;
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
