// =============================================================================
// Schuljahresmodell – Zahlungsübersicht, Mahnwesen, Plusstunden (Abschnitt 6)
//
// Admin-Aktionen (Anmeldung als Kleana):
//   uebersicht           – Matrix Schüler × Monate mit Ampelstatus
//   offen / bezahlt      – Rate als fehlend markieren bzw. Markierung entfernen
//   automatik            – Mahn-Automatik je Vertrag aussetzen (mit Notiz)
//   vorlagen             – E-Mail-Vorlagen laden
//   vorlageSpeichern     – Vorlage ändern
//   plusstunden          – offene Zusatzstunden je Schüler
//   plusstundenAbrechnen – Abrechnung anlegen und als PDF verschicken
//
// Schüler-/Elternsicht:
//   meineZahlungen       – eigener Zahlungsstand fürs Portal
//
// Zahlungen laufen per Überweisung; hier wird nichts eingezogen.
// =============================================================================
import { NextResponse } from "next/server";
import { service, userFromToken, getProfile, sendMail, ADMIN_EMAIL } from "@/lib/kalender";
import { laufenderVertrag, type Vertrag } from "@/lib/vertrag";
import { euroZuCent, centFormat } from "@/lib/vertrag-kern";
import { plusstundenPdf, bankverbindung } from "@/lib/vertrag-dokumente";
import {
  ladeZahlungen, markiereOffen, markiereBezahlt, ladeVorlagen, offenePlusstunden,
  plusstundenAbrechnen, zahlungsSperreFuer, monatName, heuteIso, status,
  type Zahlung,
} from "@/lib/zahlung";
import { STATUS_TEXT, termineEntfallenAb } from "@/lib/zahlung-kern";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

function bad(msg: string, code = 400) { return NextResponse.json({ ok: false, error: msg }, { status: code }); }
function ok(data: Record<string, unknown> = {}) { return NextResponse.json({ ok: true, ...data }); }

const text = (v: unknown, max = 200) => String(v ?? "").trim().slice(0, max);

export async function POST(req: Request): Promise<Response> {
  let body: Record<string, unknown> = {};
  try { const r = await req.json(); if (r && typeof r === "object") body = r as Record<string, unknown>; } catch { /* {} */ }
  const action = text(body.action, 40);
  const sb = service();

  const token = text(body.token, 4000);
  if (!token) return bad("Bitte einloggen.", 401);
  const user = await userFromToken(token);
  if (!user) return bad("Bitte einloggen.", 401);
  const prof = await getProfile(user.id);
  if (!prof) return bad("Kein Zugang.", 403);

  // ------------------------------------------------ eigene Sicht (Portal)
  if (action === "meineZahlungen") {
    const eigener = await laufenderVertrag(user.id);
    if (!eigener) return ok({ zahlungen: [], sperre: null });
    const zahlungen = await ladeZahlungen(eigener.id);
    const sperre = await zahlungsSperreFuer(user.id);
    const heute = heuteIso();
    return ok({
      zahlungen: zahlungen.map((z) => ({
        monat: z.monat, monatName: monatName(z.monat),
        betragCent: euroZuCent(Number(z.soll_betrag)),
        status: status(z, heute),
      })),
      sperre: sperre.gesperrt
        ? {
            grund: sperre.grund,
            regelterminAusgesetzt: sperre.regelterminAusgesetzt,
            termineEntfallenAb: sperre.pausiertAm ? termineEntfallenAb(sperre.pausiertAm) : null,
          }
        : null,
      bank: bankverbindung(),
    });
  }

  // ------------------------------------------------------------------ Admin
  if (prof.role !== "admin") return bad("Nur Kleana darf das.", 403);
  const heute = heuteIso();

  switch (action) {
    // Matrix: alle laufenden Verträge mit ihren Monatsraten
    case "uebersicht": {
      const vRes = await sb.from("vertraege").select("*").in("status", ["angeboten", "aktiv"]);
      const vertraege = (vRes.data || []) as Vertrag[];
      if (!vertraege.length) return ok({ monate: [], zeilen: [] });

      const [zRes, pRes] = await Promise.all([
        sb.from("zahlungen").select("*").in("vertrag_id", vertraege.map((v) => v.id)).order("monat"),
        sb.from("profiles").select("user_id,name,email").in("user_id", vertraege.map((v) => v.schueler_id)),
      ]);
      const zahlungen = (zRes.data || []) as Zahlung[];
      const profile = (pRes.data || []) as { user_id: string; name: string; email: string | null }[];

      const monate = [...new Set(zahlungen.map((z) => z.monat))].sort();
      const zeilen = vertraege.map((v) => {
        const p = profile.find((x) => x.user_id === v.schueler_id);
        const eigene = zahlungen.filter((z) => z.vertrag_id === v.id);
        return {
          vertragId: v.id,
          schuelerId: v.schueler_id,
          name: p?.name || "Schüler/in",
          email: p?.email ?? null,
          zahlweise: v.zahlweise,
          automatikPausiert: v.mahn_automatik_pausiert === true,
          notiz: v.mahn_notiz ?? "",
          zellen: eigene.map((z) => ({
            id: z.id, monat: z.monat,
            betragCent: euroZuCent(Number(z.soll_betrag)),
            status: status(z, heute),
            statusText: STATUS_TEXT[status(z, heute)],
            erinnerungAm: z.erinnerung_am, pausiertAm: z.pausiert_am,
          })),
        };
      }).sort((a, b) => a.name.localeCompare(b.name, "de"));

      return ok({ monate, monatNamen: monate.map(monatName), zeilen });
    }

    case "offen": {
      const id = text(body.zahlung_id, 40);
      if (!id) return bad("Keine Rate gewählt.");
      const r = await markiereOffen(id, heute);
      return r.ok ? ok({ erinnerung: r.erinnerung }) : bad("Das ließ sich nicht speichern.", 500);
    }

    case "bezahlt": {
      const id = text(body.zahlung_id, 40);
      if (!id) return bad("Keine Rate gewählt.");
      const r = await markiereBezahlt(id, heute);
      return r.ok ? ok() : bad("Das ließ sich nicht speichern.", 500);
    }

    // Mahn-Automatik für einen Vertrag aussetzen bzw. wieder einschalten
    case "automatik": {
      const id = text(body.vertrag_id, 40);
      if (!id) return bad("Kein Vertrag gewählt.");
      const r = await sb.from("vertraege").update({
        mahn_automatik_pausiert: body.pausiert === true,
        mahn_notiz: text(body.notiz, 500) || null,
      }).eq("id", id);
      return r.error ? bad(r.error.message, 500) : ok();
    }

    case "vorlagen":
      return ok({ vorlagen: await ladeVorlagen() });

    case "vorlageSpeichern": {
      const schluessel = text(body.schluessel, 40);
      const betreff = text(body.betreff, 200);
      const inhalt = String(body.text ?? "").slice(0, 5000);
      if (!schluessel || !betreff || !inhalt) return bad("Betreff und Text dürfen nicht leer sein.");
      // Ohne {link} wäre die Einladung nutzlos: Die Eltern bekämen eine
      // freundliche Nachricht, aber keinen Weg zum Unterschreiben – und es
      // würde niemandem auffallen. Deshalb hier abfangen.
      if (["vertragEinladung", "vertragErinnerung"].includes(schluessel) && !inhalt.includes("{link}")) {
        return bad("In diesem Text muss {link} vorkommen – sonst kommen die Eltern nicht zum Vertrag.");
      }
      // Anlegen statt nur ändern: Steht der Text bisher nur im Programm
      // (Standardvorlage), gäbe es sonst nichts zu ändern und das Speichern
      // liefe ins Leere.
      const r = await sb.from("mahn_vorlagen").upsert(
        { schluessel, betreff, text: inhalt, geaendert_am: new Date().toISOString() },
        { onConflict: "schluessel" },
      );
      return r.error ? bad(r.error.message, 500) : ok();
    }

    case "plusstunden":
      return ok({ schueler: await offenePlusstunden() });

    case "plusstundenAbrechnen": {
      const schuelerId = text(body.schueler_id, 40);
      if (!schuelerId) return bad("Kein Schüler gewählt.");
      const r = await plusstundenAbrechnen(schuelerId, heute);
      if (!r.ok) return bad(r.error || "Die Abrechnung ließ sich nicht anlegen.", 400);

      // Abrechnung als PDF verschicken
      const pRes = await sb.from("profiles").select("name,email").eq("user_id", schuelerId).single();
      const p = pRes.data as { name: string; email: string | null } | null;
      const faellig = new Date(Date.UTC(
        Number(heute.slice(0, 4)), Number(heute.slice(5, 7)) - 1, Number(heute.slice(8, 10)) + 14,
      )).toISOString().slice(0, 10);

      let verschickt = false;
      if (p?.email) {
        const pdf = await plusstundenPdf({
          schuelerName: p.name,
          termine: r.termine || [],
          stundensatzCent: r.anzahl ? Math.round((r.summeCent || 0) / r.anzahl) : 0,
          summeCent: r.summeCent || 0,
          faelligAm: faellig,
          erstelltAm: heute,
        });
        const res = await sendMail(
          p.email,
          "Abrechnung der Zusatzstunden",
          `<p>Hallo,</p>
           <p>hier ist die Abrechnung für <b>${r.anzahl}</b> Zusatzstunden von <b>${p.name}</b>.
              Das sind Stunden über dem festen Wochentermin – Nachhol- und Minusstunden sind
              bereits verrechnet.</p>
           <p><b>Summe:</b> ${centFormat(r.summeCent || 0)}<br>
              <b>Fällig bis:</b> ${faellig.slice(8, 10)}.${faellig.slice(5, 7)}.${faellig.slice(0, 4)}</p>
           <p>Die Aufstellung mit allen Terminen und den Überweisungsdaten findest du im Anhang.</p>
           <p>Liebe Grüße<br>Anna</p>`,
          undefined,
          { anhaenge: [{ filename: "Zusatzstunden.pdf", content: pdf }], kopieAn: ADMIN_EMAIL },
        );
        verschickt = res.ok;
      }
      return ok({ anzahl: r.anzahl, summeCent: r.summeCent, verschickt });
    }

    // Eigene Sicherheitskopie für Kleana: alle Verträge samt Ratenplan als
    // lesbare JSON-Datei zum Herunterladen und selbst Aufbewahren.
    case "exportAlleDaten": {
      const [vRes, zRes, pAbRes] = await Promise.all([
        sb.from("vertraege").select("*").order("erstellt_am", { ascending: false }),
        sb.from("zahlungen").select("*").order("monat"),
        sb.from("plusstunden_abrechnungen").select("*").order("erstellt_am", { ascending: false }),
      ]);
      const vertraege = (vRes.data || []) as Vertrag[];
      const zahlungen = (zRes.data || []) as Zahlung[];
      const pRes = await sb.from("profiles").select("user_id,name,email")
        .in("user_id", vertraege.map((v) => v.schueler_id).concat(
          ((pAbRes.data || []) as { schueler_id: string }[]).map((a) => a.schueler_id),
        ));
      const profile = (pRes.data || []) as { user_id: string; name: string; email: string | null }[];
      const nameOf = (id: string) => profile.find((p) => p.user_id === id)?.name || "unbekannt";
      const emailOf = (id: string) => profile.find((p) => p.user_id === id)?.email || null;

      const vertraegeExport = vertraege.map((v) => ({
        ...v,
        schuelerName: nameOf(v.schueler_id),
        schuelerEmail: emailOf(v.schueler_id),
        zahlungen: zahlungen.filter((z) => z.vertrag_id === v.id).map((z) => ({
          monat: z.monat, sollBetrag: z.soll_betrag, bezahltAm: z.bezahlt_am,
          offenSeit: z.offen_seit, offenBis: z.offen_bis, erinnerungAm: z.erinnerung_am,
          pausiertAm: z.pausiert_am, status: status(z, heute),
        })),
      }));
      const abrechnungenExport = ((pAbRes.data || []) as { schueler_id: string; anzahl: number; summe: number; faellig_am: string; bezahlt_am: string | null; erstellt_am: string }[])
        .map((a) => ({ ...a, schuelerName: nameOf(a.schueler_id) }));

      return ok({
        erstellt_am: new Date().toISOString(),
        dateiname: `vertraege-zahlungen-${heute}.json`,
        verträge: vertraegeExport,
        plusstunden_abrechnungen: abrechnungenExport,
      });
    }

    default:
      return bad("Unbekannte Aktion.");
  }
}
