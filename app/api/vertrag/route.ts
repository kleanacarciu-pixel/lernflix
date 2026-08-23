// =============================================================================
// Schuljahresmodell – Vertragsangebot und Bestätigung
//
// Öffentliche Aktionen (nur mit gültigem Token aus der E-Mail):
//   laden        – Vertragsdaten für die Bestätigungsseite
//   bestaetigen  – AGB annehmen, Zahlweise wählen, Vertrag aktivieren
//
// Admin-Aktionen (Anmeldung als Kleana):
//   vorschau     – Beträge durchrechnen, bevor der Vertrag angelegt wird
//   anlegen      – Vertrag als 'angeboten' speichern und Angebot verschicken
//   erneutSenden – Angebots-E-Mail mit frischem Link erneut verschicken
// =============================================================================
import { NextResponse } from "next/server";
import { service, userFromToken, getProfile, sendMail, ADMIN_EMAIL, type MailAnhang } from "@/lib/kalender";
import { aktivesSchuljahr, type Schuljahr } from "@/lib/schuljahr";
import { rechneVertrag, ladeVertrag, standardZweitsatzCent, type Vertrag } from "@/lib/vertrag";
import { euroZuCent, centFormat } from "@/lib/vertrag-kern";
import { WOCHENTAGE, datumDe } from "@/lib/schuljahr-kern";
import { pruefeVertragToken, bestaetigungsLink } from "@/lib/vertrag-token";
import { terminlistePdf, vertragsbestaetigungPdf, textPdf, bankverbindung } from "@/lib/vertrag-dokumente";
import { AGB_VERTRAG, AGB_STAND, WIDERRUF } from "@/lib/vertrag-texte";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

function bad(msg: string, code = 400) { return NextResponse.json({ ok: false, error: msg }, { status: code }); }
function ok(data: Record<string, unknown> = {}) { return NextResponse.json({ ok: true, ...data }); }

const text = (v: unknown, max = 200) => String(v ?? "").trim().slice(0, max);

function basisUrl(req: Request): string {
  const env = process.env.KALENDER_URL;
  if (env) return env;
  const h = req.headers.get("host") || "lernflix.lernemitanna.de";
  return `https://${h}`;
}

function zeitText(zeiten: { wochentag: number; uhrzeit?: string | null }[]): string {
  return zeiten
    .map((z) => `${WOCHENTAGE[z.wochentag]}${z.uhrzeit ? ` ${String(z.uhrzeit).slice(0, 5)} Uhr` : ""}`)
    .join(" und ");
}

/** Vertrag + Schüler + Schuljahr + Rechnung an einem Stück. */
async function vollbild(vertragId: string) {
  const geladen = await ladeVertrag(vertragId);
  if (!geladen) return null;
  const { vertrag, zeiten } = geladen;

  const sb = service();
  const [schuelerRes, sjRes] = await Promise.all([
    sb.from("profiles").select("user_id,name,email").eq("user_id", vertrag.schueler_id).single(),
    sb.from("schuljahre").select("id,name,erster_schultag,letzter_schultag,aktiv").eq("id", vertrag.schuljahr_id).single(),
  ]);
  if (sjRes.error || !sjRes.data) return null;
  const schuljahr = sjRes.data as Schuljahr;
  const schueler = (schuelerRes.data || { name: "Schüler/in", email: null }) as { name: string; email: string | null };

  const rechnung = await rechneVertrag({
    schuljahr,
    zeiten: zeiten.map((z) => ({ wochentag: z.wochentag, uhrzeit: z.uhrzeit, ab_datum: z.ab_datum, bis_datum: z.bis_datum })),
    stundensatzCent: euroZuCent(Number(vertrag.stundensatz)),
    stundensatzZweitCent: euroZuCent(Number(vertrag.stundensatz_zweittermin)),
    zweitesKind: vertrag.zweites_kind,
    vertragsbeginn: vertrag.vertragsbeginn,
    schuleId: vertrag.schule_id,
  });

  return { vertrag, zeiten, schueler, schuljahr, rechnung };
}

/** Die drei PDF-Anhänge der Bestätigungs-E-Mail. */
async function anhaenge(v: NonNullable<Awaited<ReturnType<typeof vollbild>>>): Promise<MailAnhang[]> {
  const { vertrag, zeiten, schueler, schuljahr, rechnung } = v;
  const [agb, liste, bestaetigung] = await Promise.all([
    textPdf("Allgemeine Geschäftsbedingungen", `Schuljahresvertrag · Stand ${AGB_STAND}`, AGB_VERTRAG),
    terminlistePdf({
      schuelerName: schueler.name, schuljahrName: schuljahr.name,
      zeiten: zeiten.map((z) => ({ wochentag: z.wochentag, uhrzeit: z.uhrzeit })),
      termine: rechnung.alleTermine,
    }),
    vertragsbestaetigungPdf({
      schuelerName: schueler.name, schuljahrName: schuljahr.name,
      zeiten: zeiten.map((z) => ({ wochentag: z.wochentag, uhrzeit: z.uhrzeit })),
      posten: rechnung.posten, jahresbetragCent: rechnung.jahresbetragCent,
      zahlweise: vertrag.zahlweise, raten: rechnung.raten, einmalCent: rechnung.einmalCent,
      bestaetigtAm: vertrag.agb_akzeptiert_am || new Date().toISOString(),
    }),
  ]);
  const jahr = schuljahr.name.replace("/", "-");
  return [
    { filename: `AGB-${jahr}.pdf`, content: agb },
    { filename: `Terminliste-${jahr}.pdf`, content: liste },
    { filename: `Vertragsbestaetigung-${jahr}.pdf`, content: bestaetigung },
  ];
}

export async function POST(req: Request): Promise<Response> {
  let body: Record<string, unknown> = {};
  try { const r = await req.json(); if (r && typeof r === "object") body = r as Record<string, unknown>; } catch { /* {} */ }
  const action = text(body.action, 40);
  const sb = service();

  // ---------------------------------------------------------------- öffentlich
  if (action === "laden" || action === "bestaetigen") {
    const pruef = pruefeVertragToken(text(body.vertragToken, 500));
    if (!pruef.ok) {
      return bad(pruef.grund === "abgelaufen"
        ? "Dieser Link ist abgelaufen. Bitte melde dich kurz, dann schicke ich dir einen neuen."
        : "Dieser Link ist nicht gültig.", 403);
    }
    const v = await vollbild(pruef.vertragId);
    if (!v) return bad("Vertrag nicht gefunden.", 404);

    if (action === "laden") {
      return ok({
        schuelerName: v.schueler.name,
        schuljahr: v.schuljahr.name,
        zeiten: v.zeiten.map((z) => ({ wochentag: z.wochentag, uhrzeit: z.uhrzeit })),
        zeitText: zeitText(v.zeiten),
        termine: v.rechnung.alleTermine,
        posten: v.rechnung.posten,
        jahresbetragCent: v.rechnung.jahresbetragCent,
        raten: v.rechnung.raten,
        einmalCent: v.rechnung.einmalCent,
        status: v.vertrag.status,
        bereitsBestaetigt: !!v.vertrag.agb_akzeptiert_am,
        bank: bankverbindung(),
      });
    }

    // --- bestaetigen ---
    if (v.vertrag.agb_akzeptiert_am) return ok({ schonBestaetigt: true });

    const zahlweise = text(body.zahlweise, 10) === "einmal" ? "einmal" : "raten";
    // Alle drei Bestätigungen sind Pflicht – serverseitig geprüft, nicht nur im Formular.
    if (body.agb !== true || body.widerruf !== true || body.beginn !== true) {
      return bad("Bitte bestätige alle drei Punkte.");
    }

    const jetzt = new Date().toISOString();
    const up = await sb.from("vertraege").update({
      agb_akzeptiert_am: jetzt,
      zahlweise,
      status: "aktiv",
      jahresbetrag: (v.rechnung.jahresbetragCent / 100).toFixed(2),
    }).eq("id", v.vertrag.id).is("agb_akzeptiert_am", null).select().single();
    if (up.error || !up.data) return bad("Die Bestätigung ließ sich nicht speichern.", 500);

    // Frisch laden, damit Zahlweise und Zeitstempel in den PDFs stehen
    const neu = await vollbild(v.vertrag.id);
    if (neu && v.schueler.email) {
      const dateien = await anhaenge(neu);
      const betrag = zahlweise === "einmal"
        ? `Einmalzahlung: <b>${centFormat(neu.rechnung.einmalCent)}</b>`
        : `${neu.rechnung.raten.length} Monatsraten à <b>${centFormat(neu.rechnung.raten[0]?.betragCent ?? 0)}</b>`;
      await sendMail(
        v.schueler.email,
        `Vertrag bestätigt – Schuljahr ${v.schuljahr.name}`,
        `<p>Hallo,</p>
         <p>danke – der Vertrag für <b>${v.schueler.name}</b> ist bestätigt.</p>
         <p><b>Termin:</b> ${zeitText(v.zeiten)}<br>
            <b>Jahresbetrag:</b> ${centFormat(neu.rechnung.jahresbetragCent)}<br>
            ${betrag}</p>
         <p>Im Anhang findest du die AGB, die Terminliste für das ganze Schuljahr und die
            Vertragsbestätigung mit den Überweisungsdaten. Die Vertragsbestätigung kannst du
            als Jahresbeleg aufbewahren.</p>
         <p>Liebe Grüße<br>Anna</p>`,
        undefined,
        { anhaenge: dateien, kopieAn: ADMIN_EMAIL },
      );
    }
    return ok({ bestaetigt: true });
  }

  // ------------------------------------------------------------------- Admin
  const token = text(body.token, 4000);
  if (!token) return bad("Bitte einloggen.", 401);
  const user = await userFromToken(token);
  if (!user) return bad("Bitte einloggen.", 401);
  const prof = await getProfile(user.id);
  if (!prof || prof.role !== "admin") return bad("Nur Kleana darf das.", 403);

  switch (action) {
    // Beträge durchrechnen, ohne etwas zu speichern
    case "vorschau": {
      const sj = await aktivesSchuljahr();
      if (!sj) return bad("Es ist kein Schuljahr aktiv. Bitte zuerst unter /schuljahr eines aktiv setzen.");
      const zeiten = (Array.isArray(body.zeiten) ? body.zeiten : []) as { wochentag: number; uhrzeit?: string }[];
      if (!zeiten.length) return bad("Bitte mindestens einen Wochentermin angeben.");
      const satzCent = euroZuCent(Number(body.stundensatz) || 0);
      const zweitCent = body.stundensatz_zweittermin != null
        ? euroZuCent(Number(body.stundensatz_zweittermin))
        : standardZweitsatzCent(satzCent);
      const beginn = text(body.vertragsbeginn, 10) || sj.erster_schultag.slice(0, 8) + "01";

      const r = await rechneVertrag({
        schuljahr: sj, zeiten, stundensatzCent: satzCent, stundensatzZweitCent: zweitCent,
        zweitesKind: body.zweites_kind === true, vertragsbeginn: beginn,
        schuleId: text(body.schule_id, 40) || null,
      });
      return ok({
        schuljahr: sj.name, posten: r.posten, jahresbetragCent: r.jahresbetragCent,
        raten: r.raten, einmalCent: r.einmalCent, anzahlTermine: r.alleTermine.length,
      });
    }

    // Vertrag anlegen und Angebot verschicken
    case "anlegen": {
      const sj = await aktivesSchuljahr();
      if (!sj) return bad("Es ist kein Schuljahr aktiv.");
      const schuelerId = text(body.schueler_id, 40);
      const zeiten = (Array.isArray(body.zeiten) ? body.zeiten : []) as { wochentag: number; uhrzeit?: string }[];
      if (!schuelerId) return bad("Bitte eine Schülerin bzw. einen Schüler wählen.");
      if (!zeiten.length) return bad("Bitte mindestens einen Wochentermin angeben.");

      const satzCent = euroZuCent(Number(body.stundensatz) || 0);
      if (satzCent <= 0) return bad("Bitte einen Stundensatz angeben.");
      const zweitCent = body.stundensatz_zweittermin != null
        ? euroZuCent(Number(body.stundensatz_zweittermin))
        : standardZweitsatzCent(satzCent);
      const beginn = text(body.vertragsbeginn, 10);
      if (!/^\d{4}-\d{2}-01$/.test(beginn)) return bad("Der Vertragsbeginn muss ein Monatserster sein.");

      const r = await rechneVertrag({
        schuljahr: sj, zeiten, stundensatzCent: satzCent, stundensatzZweitCent: zweitCent,
        zweitesKind: body.zweites_kind === true, vertragsbeginn: beginn,
        schuleId: text(body.schule_id, 40) || null,
      });

      const vRes = await sb.from("vertraege").insert({
        schueler_id: schuelerId, schuljahr_id: sj.id, schule_id: text(body.schule_id, 40) || null,
        stundensatz: (satzCent / 100).toFixed(2),
        stundensatz_zweittermin: (zweitCent / 100).toFixed(2),
        zweites_kind: body.zweites_kind === true,
        vertragsbeginn: beginn,
        zahlweise: "raten",
        jahresbetrag: (r.jahresbetragCent / 100).toFixed(2),
        status: "angeboten",
      }).select().single();
      if (vRes.error || !vRes.data) {
        const m = vRes.error?.message || "";
        return bad(m.includes("vertraege_ein_laufender")
          ? "Für diesen Schüler gibt es in diesem Schuljahr bereits einen laufenden Vertrag."
          : m || "Der Vertrag ließ sich nicht anlegen.", 500);
      }
      const vertrag = vRes.data as Vertrag;

      const zRes = await sb.from("vertrag_zeiten").insert(
        zeiten.map((z) => ({ vertrag_id: vertrag.id, wochentag: z.wochentag, uhrzeit: z.uhrzeit || "15:00" })),
      );
      if (zRes.error) return bad(zRes.error.message, 500);

      await angebotSenden(vertrag.id, basisUrl(req));
      return ok({ vertragId: vertrag.id });
    }

    case "erneutSenden": {
      const id = text(body.vertrag_id, 40);
      if (!id) return bad("Kein Vertrag gewählt.");
      const res = await angebotSenden(id, basisUrl(req));
      return res.ok ? ok() : bad(res.error || "Die E-Mail ließ sich nicht senden.", 500);
    }

    default:
      return bad("Unbekannte Aktion.");
  }
}

/** Angebots-E-Mail mit frischem Bestätigungslink verschicken. */
async function angebotSenden(vertragId: string, baseUrl: string): Promise<{ ok: boolean; error?: string }> {
  const v = await vollbild(vertragId);
  if (!v) return { ok: false, error: "Vertrag nicht gefunden." };
  if (!v.schueler.email) return { ok: false, error: "Für diesen Schüler ist keine E-Mail-Adresse hinterlegt." };

  const link = bestaetigungsLink(vertragId, baseUrl);
  const rate = v.rechnung.raten[0]?.betragCent ?? 0;

  return sendMail(
    v.schueler.email,
    `Dein Vertragsangebot für das Schuljahr ${v.schuljahr.name}`,
    `<p>Hallo,</p>
     <p>hier ist das Angebot für <b>${v.schueler.name}</b> im Schuljahr ${v.schuljahr.name}.</p>
     <p><b>Fester Termin:</b> ${zeitText(v.zeiten)}<br>
        <b>Termine im Schuljahr:</b> ${v.rechnung.alleTermine.length}<br>
        <b>Jahresbetrag:</b> ${centFormat(v.rechnung.jahresbetragCent)}</p>
     <p>Du kannst wählen:<br>
        • <b>${v.rechnung.raten.length} Monatsraten</b> à ${centFormat(rate)} (jeweils 1.–10. des Monats)<br>
        • <b>Einmalzahlung ${centFormat(v.rechnung.einmalCent)}</b> (50,00 € Nachlass)</p>
     <p style="margin:22px 0">
       <a href="${link}" style="background:#2BB3C0;color:#fff;text-decoration:none;padding:12px 22px;border-radius:8px;font-weight:600">
         Vertrag ansehen und bestätigen
       </a>
     </p>
     <p style="color:#5f574f;font-size:14px">Der Link ist 14 Tage gültig. Dort siehst du auch alle
        Termine des Schuljahres im Überblick.</p>
     <p>Liebe Grüße<br>Anna</p>`,
    undefined,
    { kopieAn: ADMIN_EMAIL },
  );
}

// Terminliste als PDF herunterladen (Portal): /api/vertrag?pdf=<token>
export async function GET(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const pruef = pruefeVertragToken(url.searchParams.get("pdf") || "");
  if (!pruef.ok) return bad("Dieser Link ist nicht gültig.", 403);
  const v = await vollbild(pruef.vertragId);
  if (!v) return bad("Vertrag nicht gefunden.", 404);

  const art = url.searchParams.get("art") || "terminliste";
  let datei: Buffer, name: string;
  if (art === "agb") {
    datei = await textPdf("Allgemeine Geschäftsbedingungen", `Schuljahresvertrag · Stand ${AGB_STAND}`, AGB_VERTRAG);
    name = "AGB.pdf";
  } else if (art === "widerruf") {
    datei = await textPdf("Widerrufsbelehrung", "Schuljahresvertrag", WIDERRUF);
    name = "Widerrufsbelehrung.pdf";
  } else if (art === "bestaetigung") {
    datei = await vertragsbestaetigungPdf({
      schuelerName: v.schueler.name, schuljahrName: v.schuljahr.name,
      zeiten: v.zeiten.map((z) => ({ wochentag: z.wochentag, uhrzeit: z.uhrzeit })),
      posten: v.rechnung.posten, jahresbetragCent: v.rechnung.jahresbetragCent,
      zahlweise: v.vertrag.zahlweise, raten: v.rechnung.raten, einmalCent: v.rechnung.einmalCent,
      bestaetigtAm: v.vertrag.agb_akzeptiert_am || new Date().toISOString(),
    });
    name = "Vertragsbestaetigung.pdf";
  } else {
    datei = await terminlistePdf({
      schuelerName: v.schueler.name, schuljahrName: v.schuljahr.name,
      zeiten: v.zeiten.map((z) => ({ wochentag: z.wochentag, uhrzeit: z.uhrzeit })),
      termine: v.rechnung.alleTermine,
    });
    name = `Terminliste-${v.schuljahr.name.replace("/", "-")}.pdf`;
  }

  return new Response(new Uint8Array(datei), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${name}"`,
      "Cache-Control": "no-store",
    },
  });
}

export { datumDe };
