// =============================================================================
// Admin-Einstellungen – aktuell Kleanas Unterschrift
//
//   laden          – aktuelle Unterschrift (Daten-URI) für die Vorschau
//   speichern      – neue Unterschrift hinterlegen
//   loeschen       – Unterschrift entfernen
//
// Reine Innensicht: nur die Admin-Rolle kommt hier durch.
// =============================================================================
import { NextResponse } from "next/server";
import { service, userFromToken, getProfile } from "@/lib/kalender";
import { unterschriftAnbieterin, setzeUnterschrift } from "@/lib/einstellungen";
import { pruefeUnterschrift, MAX_BYTES, UNTERSCHRIFT_HINWEIS } from "@/lib/unterschrift-kern";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

function bad(msg: string, code = 400) { return NextResponse.json({ ok: false, error: msg }, { status: code }); }
function ok(data: Record<string, unknown> = {}) { return NextResponse.json({ ok: true, ...data }); }

export async function POST(req: Request): Promise<Response> {
  let body: Record<string, unknown> = {};
  try { const r = await req.json(); if (r && typeof r === "object") body = r as Record<string, unknown>; } catch { /* {} */ }
  const action = String(body.action ?? "").trim().slice(0, 40);

  const token = String(body.token ?? "").trim().slice(0, 4000);
  if (!token) return bad("Bitte einloggen.", 401);
  const user = await userFromToken(token);
  if (!user) return bad("Bitte einloggen.", 401);
  const prof = await getProfile(user.id);
  if (!prof || prof.role !== "admin") return bad("Nur Kleana darf das.", 403);
  void service();   // Verbindung früh prüfen, damit Fehler hier auffallen

  switch (action) {
    case "laden": {
      const u = await unterschriftAnbieterin();
      return ok({
        unterschrift: u,
        maxKb: MAX_BYTES / 1024,
        hinweis: UNTERSCHRIFT_HINWEIS,
      });
    }

    case "speichern": {
      const roh = body.unterschrift;
      const p = pruefeUnterschrift(roh);
      if (!p.ok) return bad(p.grund);
      const r = await setzeUnterschrift(p.datenUri);
      return r.ok ? ok({ art: p.art, kb: Math.round(p.bytes / 1024) }) : bad(r.error || "Fehler.", 500);
    }

    case "loeschen": {
      const r = await setzeUnterschrift(null);
      return r.ok ? ok() : bad(r.error || "Fehler.", 500);
    }

    default:
      return bad("Unbekannte Aktion.");
  }
}
