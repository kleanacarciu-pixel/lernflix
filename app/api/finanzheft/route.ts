// =============================================================================
// Finanzheft – Trennung privat/Firma
//
//   laden       – alle Buchungen + Salden beider Konten
//   anlegen     – Einnahme/Ausgabe auf einem Konto buchen
//   transfer    – Geld gezielt von einem Konto aufs andere übertragen
//   loeschen    – eine Buchung (bzw. einen ganzen Transfer) entfernen
//
// Reine Innensicht: nur die Admin-Rolle kommt hier durch.
// =============================================================================
import { NextResponse } from "next/server";
import { service, userFromToken, getProfile } from "@/lib/kalender";
import {
  ladeBuchungen, salden, buchungAnlegen, transferAnlegen, buchungLoeschen,
  FIRMA_KATEGORIEN, PRIVAT_KATEGORIEN,
} from "@/lib/finanzheft";
import { euroZuCent } from "@/lib/vertrag-kern";

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
      const buchungen = await ladeBuchungen();
      return ok({ buchungen, salden: await salden(), firmaKategorien: FIRMA_KATEGORIEN, privatKategorien: PRIVAT_KATEGORIEN });
    }

    case "anlegen": {
      const konto = String(body.konto ?? "");
      const typ = String(body.typ ?? "");
      const betrag = Number(body.betrag);
      const kategorie = String(body.kategorie ?? "").trim().slice(0, 80);
      const beschreibung = String(body.beschreibung ?? "").trim().slice(0, 300);
      const datum = String(body.datum ?? "").trim();
      if (konto !== "privat" && konto !== "firma") return bad("Ungültiges Konto.");
      if (typ !== "einnahme" && typ !== "ausgabe") return bad("Ungültiger Typ.");
      if (!Number.isFinite(betrag) || betrag <= 0) return bad("Ungültiger Betrag.");

      const r = await buchungAnlegen({ konto, typ, betragCent: euroZuCent(betrag), kategorie, beschreibung, datum });
      return r.ok ? ok({ warnung: r.warnung }) : bad(r.error);
    }

    case "transfer": {
      const von = String(body.von ?? "");
      const nach = String(body.nach ?? "");
      const betrag = Number(body.betrag);
      const beschreibung = String(body.beschreibung ?? "").trim().slice(0, 300);
      const datum = String(body.datum ?? "").trim();
      if ((von !== "privat" && von !== "firma") || (nach !== "privat" && nach !== "firma")) return bad("Ungültiges Konto.");
      if (!Number.isFinite(betrag) || betrag <= 0) return bad("Ungültiger Betrag.");

      const r = await transferAnlegen({ von, nach, betragCent: euroZuCent(betrag), datum, beschreibung });
      return r.ok ? ok() : bad(r.error);
    }

    case "loeschen": {
      const id = Number(body.id);
      if (!Number.isInteger(id) || id <= 0) return bad("Ungültige Buchung.");
      const r = await buchungLoeschen(id);
      return r.ok ? ok() : bad("Löschen fehlgeschlagen.", 500);
    }

    default:
      return bad("Unbekannte Aktion.");
  }
}
