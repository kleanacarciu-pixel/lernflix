// =============================================================================
// Schuljahresmodell – Verwaltung von Schuljahren, Schulen und freien Tagen
// Nur für Kleana (Admin). Läuft serverseitig mit Service-Role-Key.
// =============================================================================
import { NextResponse } from "next/server";
import { service, userFromToken, getProfile } from "@/lib/kalender";
import { cacheLeeren } from "@/lib/schuljahr";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function bad(msg: string, code = 400) { return NextResponse.json({ ok: false, error: msg }, { status: code }); }
function ok(data: Record<string, unknown> = {}) { return NextResponse.json({ ok: true, ...data }); }

const istDatum = (s: unknown): s is string => typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s);
const text = (v: unknown, max = 120) => String(v ?? "").trim().slice(0, max);

export async function POST(req: Request): Promise<Response> {
  let body: Record<string, unknown> = {};
  try { const r = await req.json(); if (r && typeof r === "object") body = r as Record<string, unknown>; } catch { /* {} */ }

  const action = text(body.action, 40);
  const token = text(body.token, 4000);
  if (!token) return bad("Bitte einloggen.", 401);

  const user = await userFromToken(token);
  if (!user) return bad("Bitte einloggen.", 401);
  const prof = await getProfile(user.id);
  if (!prof || prof.role !== "admin") return bad("Nur Kleana darf das.", 403);

  const sb = service();

  // Jede Änderung an Schuljahren/Schulen/freien Tagen leert den
  // Stammdaten-Cache der Termin-Engine – sonst rechnete eine direkt danach
  // geöffnete Vertrags-Vorschau bis zu 60 s mit dem alten Stand. (Auf einer
  // ANDEREN Server-Instanz begrenzt weiterhin die 60-s-Lebensdauer des
  // Caches die mögliche Verzögerung.)
  if (action !== "laden") cacheLeeren();

  switch (action) {
    // ---------------------------------------------------------------- laden
    case "laden": {
      const [sj, sc, ft] = await Promise.all([
        sb.from("schuljahre").select("*").order("erster_schultag", { ascending: false }),
        sb.from("schulen").select("*").order("name"),
        sb.from("unterrichtsfreie_tage").select("*").order("datum_von"),
      ]);
      if (sj.error) return bad(sj.error.message, 500);
      return ok({ schuljahre: sj.data || [], schulen: sc.data || [], freieTage: ft.data || [] });
    }

    // ------------------------------------------------------- Schuljahr CRUD
    case "schuljahrSpeichern": {
      const name = text(body.name, 40);
      const von = body.erster_schultag, bis = body.letzter_schultag;
      if (!name) return bad("Bitte einen Namen angeben, z. B. 2027/28.");
      if (!istDatum(von) || !istDatum(bis)) return bad("Bitte gültige Daten angeben.");
      if (bis <= von) return bad("Der letzte Schultag muss nach dem ersten liegen.");
      const satz = { name, erster_schultag: von, letzter_schultag: bis };
      const id = text(body.id, 40);
      const res = id
        ? await sb.from("schuljahre").update(satz).eq("id", id).select().single()
        : await sb.from("schuljahre").insert(satz).select().single();
      if (res.error) return bad(res.error.message, 500);
      return ok({ schuljahr: res.data });
    }

    case "schuljahrAktivieren": {
      const id = text(body.id, 40);
      if (!id) return bad("Kein Schuljahr gewählt.");
      // Erst alle deaktivieren – der Teil-Index lässt nur ein aktives zu.
      const aus = await sb.from("schuljahre").update({ aktiv: false }).eq("aktiv", true);
      if (aus.error) return bad(aus.error.message, 500);
      const an = await sb.from("schuljahre").update({ aktiv: true }).eq("id", id);
      if (an.error) return bad(an.error.message, 500);
      return ok();
    }

    case "schuljahrLoeschen": {
      const id = text(body.id, 40);
      if (!id) return bad("Kein Schuljahr gewählt.");
      const res = await sb.from("schuljahre").delete().eq("id", id);
      if (res.error) return bad(res.error.message, 500);
      return ok();
    }

    // ---------------------------------------------------------- Schule CRUD
    case "schuleSpeichern": {
      const name = text(body.name, 120);
      if (!name) return bad("Bitte einen Schulnamen angeben.");
      const id = text(body.id, 40);
      const res = id
        ? await sb.from("schulen").update({ name }).eq("id", id).select().single()
        : await sb.from("schulen").insert({ name }).select().single();
      if (res.error) return bad(res.error.message, 500);
      return ok({ schule: res.data });
    }

    case "schuleLoeschen": {
      const id = text(body.id, 40);
      if (!id) return bad("Keine Schule gewählt.");
      const res = await sb.from("schulen").delete().eq("id", id);
      if (res.error) return bad(res.error.message, 500);
      return ok();
    }

    // ------------------------------------------------- Unterrichtsfreie Tage
    case "freiSpeichern": {
      const schuljahrId = text(body.schuljahr_id, 40);
      const bezeichnung = text(body.bezeichnung, 120);
      const von = body.datum_von, bis = body.datum_bis;
      const istFeiertag = body.ist_feiertag === true;
      const schuleId = text(body.schule_id, 40) || null;

      if (!schuljahrId) return bad("Bitte ein Schuljahr wählen.");
      if (!bezeichnung) return bad("Bitte eine Bezeichnung angeben.");
      if (!istDatum(von) || !istDatum(bis)) return bad("Bitte gültige Daten angeben.");
      if (bis < von) return bad("Das Enddatum darf nicht vor dem Startdatum liegen.");
      // Gesetzliche Feiertage gelten für alle Schüler und gehören zu keiner Schule.
      if (istFeiertag && schuleId) return bad("Ein gesetzlicher Feiertag gilt für alle Schulen – bitte keine Schule wählen.");

      const satz = {
        schuljahr_id: schuljahrId, schule_id: schuleId, bezeichnung,
        datum_von: von, datum_bis: bis, ist_feiertag: istFeiertag,
      };
      const id = text(body.id, 40);
      const res = id
        ? await sb.from("unterrichtsfreie_tage").update(satz).eq("id", id).select().single()
        : await sb.from("unterrichtsfreie_tage").insert(satz).select().single();
      if (res.error) return bad(res.error.message, 500);
      return ok({ eintrag: res.data });
    }

    case "freiLoeschen": {
      const id = text(body.id, 40);
      if (!id) return bad("Kein Eintrag gewählt.");
      const res = await sb.from("unterrichtsfreie_tage").delete().eq("id", id);
      if (res.error) return bad(res.error.message, 500);
      return ok();
    }

    default:
      return bad("Unbekannte Aktion.");
  }
}
