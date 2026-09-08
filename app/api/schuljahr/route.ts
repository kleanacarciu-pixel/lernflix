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

    // ------------------------------------------- St.-George's-Paket (1 Klick)
    // Legt die Schule „St. George's" samt ihrer Ferien 2026/27 in einem Rutsch
    // an – die Zeiten stammen aus dem offiziellen Academic Calendar 2026-27
    // der Schule (mit Kleana am 08.09.2026 Tag für Tag abgeglichen).
    // Mehrfach klickbar: Vorhandenes wird erkannt und nicht doppelt angelegt.
    case "stGeorgesPaket": {
      const FERIEN = [
        { bezeichnung: "Herbstferien St. George's", von: "2026-10-26", bis: "2026-11-01" },
        { bezeichnung: "Weihnachtsferien St. George's", von: "2026-12-19", bis: "2027-01-10" },
        { bezeichnung: "Faschingsferien St. George's", von: "2027-02-08", bis: "2027-02-12" },
        { bezeichnung: "Osterferien St. George's", von: "2027-03-22", bis: "2027-04-02" },
        { bezeichnung: "Pfingstferien St. George's", von: "2027-05-24", bis: "2027-05-28" },
        { bezeichnung: "Sommerferien St. George's", von: "2027-07-17", bis: "2027-08-31" },
      ];
      // Das passende Schuljahr über die Daten finden (nicht über den Namen,
      // damit die Schreibweise „2026/27" vs. „2026/2027" keine Rolle spielt).
      const sjRes = await sb.from("schuljahre").select("id,name,erster_schultag,letzter_schultag");
      if (sjRes.error) return bad(sjRes.error.message, 500);
      const sjListe = (sjRes.data || []) as { id: string; name: string; erster_schultag: string; letzter_schultag: string }[];
      const sj = sjListe.find((s) => s.erster_schultag <= "2026-10-26" && s.letzter_schultag >= "2026-10-26");
      if (!sj) return bad("Bitte zuerst das Schuljahr 2026/27 anlegen – die Ferien gehören dort hinein.");

      // Schule holen oder anlegen – erkannt wird sie am Namensteil „george",
      // falls Kleana sie schon (anders geschrieben) angelegt hat.
      const scRes = await sb.from("schulen").select("id,name");
      if (scRes.error) return bad(scRes.error.message, 500);
      let schuleId = ((scRes.data || []) as { id: string; name: string }[])
        .find((s) => s.name.toLowerCase().includes("george"))?.id || "";
      if (!schuleId) {
        const neu = await sb.from("schulen").insert({ name: "St. George's" }).select("id").single();
        if (neu.error) return bad(neu.error.message, 500);
        schuleId = (neu.data as { id: string }).id;
      }

      const daRes = await sb.from("unterrichtsfreie_tage").select("bezeichnung")
        .eq("schuljahr_id", sj.id).eq("schule_id", schuleId);
      if (daRes.error) return bad(daRes.error.message, 500);
      const schon = new Set(((daRes.data || []) as { bezeichnung: string }[]).map((f) => f.bezeichnung));
      let neu = 0;
      for (const f of FERIEN) {
        if (schon.has(f.bezeichnung)) continue;
        const ins = await sb.from("unterrichtsfreie_tage").insert({
          schuljahr_id: sj.id, schule_id: schuleId, bezeichnung: f.bezeichnung,
          datum_von: f.von, datum_bis: f.bis, ist_feiertag: false,
        });
        if (ins.error) return bad(ins.error.message, 500);
        neu++;
      }
      return ok({ message: neu
        ? `St. George's eingerichtet: ${neu} Ferienzeit(en) für ${sj.name} eingetragen${schon.size ? `, ${schon.size} waren schon da` : ""}.`
        : `Alles schon da – St. George's hat bereits ${schon.size} Ferienzeiten für ${sj.name}.` });
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
