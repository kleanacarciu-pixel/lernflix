// Kontakt-/Probestunden-Formular der Website lernemitanna.de -> E-Mail an Kleana
import { NextResponse } from "next/server";
import { sendMail, ADMIN_EMAIL } from "@/lib/kalender";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED = new Set(["https://lernemitanna.de", "https://www.lernemitanna.de"]);
function cors(origin: string | null): Record<string, string> {
  const allowed = !!origin && (ALLOWED.has(origin) || origin.endsWith(".vercel.app"));
  const o = allowed && origin ? origin : "https://lernemitanna.de";
  return {
    "Access-Control-Allow-Origin": o,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    Vary: "Origin",
  };
}
const esc = (s: string) => s.replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c] || c));

export async function OPTIONS(req: Request): Promise<Response> {
  return new Response(null, { status: 204, headers: cors(req.headers.get("origin")) });
}

export async function POST(req: Request): Promise<Response> {
  const h = cors(req.headers.get("origin"));
  let b: Record<string, unknown> = {};
  try { const r = await req.json(); if (r && typeof r === "object") b = r as Record<string, unknown>; } catch { /* {} */ }

  const name = String(b.name || "").trim().slice(0, 120);
  const email = String(b.email || "").trim().slice(0, 160);
  const phone = String(b.phone || "").trim().slice(0, 60);
  const fach = String(b.fach || "").trim().slice(0, 60);
  const klasse = String(b.klasse || "").trim().slice(0, 60);
  const msg = String(b.msg || "").trim().slice(0, 3000);

  if (!name || !email || !/.+@.+\..+/.test(email)) {
    return NextResponse.json({ ok: false, error: "Bitte Name und gültige E-Mail angeben." }, { status: 400, headers: h });
  }

  const html = `<div style="font-family:Inter,Arial,sans-serif;color:#1a1a1a;max-width:560px">
    <h2 style="font-family:Georgia,serif">Neue Anfrage über lernemitanna.de</h2>
    <p><b>Name:</b> ${esc(name)}<br>
    <b>E-Mail:</b> ${esc(email)}<br>
    ${phone ? `<b>Telefon:</b> ${esc(phone)}<br>` : ""}
    ${fach ? `<b>Fach:</b> ${esc(fach)}<br>` : ""}
    ${klasse ? `<b>Klasse:</b> ${esc(klasse)}<br>` : ""}</p>
    ${msg ? `<p style="background:#f4f6f7;border-radius:10px;padding:14px"><b>Nachricht:</b><br>${esc(msg).replace(/\n/g, "<br>")}</p>` : ""}
    <p style="color:#888;font-size:13px">Tipp: Einfach auf diese Mail antworten – die Antwort geht direkt an ${esc(email)}.</p>
  </div>`;

  const mail = await sendMail(ADMIN_EMAIL, `Website-Anfrage von ${name}`, html, email);
  if (!mail.ok) {
    return NextResponse.json({ ok: false, error: "Konnte gerade nicht senden. Bitte per E-Mail oder Telefon melden." }, { status: 502, headers: h });
  }
  return NextResponse.json({ ok: true }, { headers: h });
}
