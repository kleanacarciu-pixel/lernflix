// =============================================================================
// Finanzheft / Buchhaltung – doppelte Buchführung für privat + Firma
//
//   laden        – Konten, Kontosalden, Auswertung (Monat/Jahr), Buchungen
//   einnahme     – Geld kommt auf ein Konto rein (mit optionaler USt)
//   ausgabe      – Geld geht von einem Konto raus (mit optionaler Vorsteuer)
//   transfer     – Geld von einem Konto aufs andere übertragen
//   kontoAnlegen – neue Kategorie (Konto) anlegen
//   loeschen     – eine Buchung (alle ihre Zeilen) entfernen
//
// Reine Innensicht: nur die Admin-Rolle kommt hier durch.
// =============================================================================
import { NextResponse } from "next/server";
import { service, userFromToken, getProfile } from "@/lib/kalender";
import {
  ladeKonten, uebersicht, einnahmeAnlegen, ausgabeAnlegen, transferAnlegen,
  buchungLoeschen, kontoAnlegen, UST_SAETZE,
} from "@/lib/buchhaltung";
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
      const [konten, u] = await Promise.all([ladeKonten(), uebersicht()]);
      return ok({ konten, ustSaetze: UST_SAETZE, ...u });
    }

    case "einnahme": {
      const aktivKontoId = Number(body.aktivKontoId);
      const ertragKontoId = Number(body.ertragKontoId);
      const betrag = Number(body.betrag);
      const ustSatz = Number(body.ustSatz ?? 0);
      const datum = String(body.datum ?? "").trim();
      const beschreibung = String(body.beschreibung ?? "").trim().slice(0, 300);
      if (!Number.isInteger(aktivKontoId) || !Number.isInteger(ertragKontoId)) return bad("Bitte beide Konten wählen.");
      if (!Number.isFinite(betrag) || betrag <= 0) return bad("Ungültiger Betrag.");
      const r = await einnahmeAnlegen({ aktivKontoId, ertragKontoId, bruttoCent: euroZuCent(betrag), ustSatz, datum, beschreibung });
      return r.ok ? ok() : bad(r.error);
    }

    case "ausgabe": {
      const aktivKontoId = Number(body.aktivKontoId);
      const aufwandKontoId = Number(body.aufwandKontoId);
      const betrag = Number(body.betrag);
      const ustSatz = Number(body.ustSatz ?? 0);
      const datum = String(body.datum ?? "").trim();
      const beschreibung = String(body.beschreibung ?? "").trim().slice(0, 300);
      if (!Number.isInteger(aktivKontoId) || !Number.isInteger(aufwandKontoId)) return bad("Bitte beide Konten wählen.");
      if (!Number.isFinite(betrag) || betrag <= 0) return bad("Ungültiger Betrag.");
      const r = await ausgabeAnlegen({ aktivKontoId, aufwandKontoId, bruttoCent: euroZuCent(betrag), ustSatz, datum, beschreibung });
      return r.ok ? ok() : bad(r.error);
    }

    case "transfer": {
      const vonKontoId = Number(body.vonKontoId);
      const nachKontoId = Number(body.nachKontoId);
      const betrag = Number(body.betrag);
      const datum = String(body.datum ?? "").trim();
      const beschreibung = String(body.beschreibung ?? "").trim().slice(0, 300);
      if (!Number.isInteger(vonKontoId) || !Number.isInteger(nachKontoId)) return bad("Bitte beide Konten wählen.");
      if (!Number.isFinite(betrag) || betrag <= 0) return bad("Ungültiger Betrag.");
      const r = await transferAnlegen({ vonKontoId, nachKontoId, betragCent: euroZuCent(betrag), datum, beschreibung });
      return r.ok ? ok() : bad(r.error);
    }

    case "kontoAnlegen": {
      const name = String(body.name ?? "");
      const typ = String(body.typ ?? "");
      if (typ !== "aktiv" && typ !== "ertrag" && typ !== "aufwand") return bad("Ungültiger Kontotyp.");
      const r = await kontoAnlegen(name, typ);
      return r.ok ? ok({ id: r.id }) : bad(r.error);
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
