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
import { service, userFromToken, getProfile, sendMail, mailZustellenOderMelden, ADMIN_EMAIL, type MailAnhang } from "@/lib/kalender";
import { aktivesSchuljahr, type Schuljahr } from "@/lib/schuljahr";
import { rechneVertrag, ladeVertrag, laufenderVertrag, standardZweitsatzCent, type Vertrag } from "@/lib/vertrag";
import {
  euroZuCent, centFormat, wochentagWechseln, teileRatenmonate, ratenMonate,
  ratenNeuVerteilen, monatsErster,
} from "@/lib/vertrag-kern";
import { WOCHENTAGE, datumDe } from "@/lib/schuljahr-kern";
import { pruefeVertragToken, bestaetigungsLink, vertragToken } from "@/lib/vertrag-token";
import {
  terminlistePdf, vertragsbestaetigungPdf, bescheinigungPdf, bankverbindung,
  nachhilfevertragPdf, agbPdf, markdownPdf,
} from "@/lib/vertrag-dokumente";
import {
  pruefeUnterzeichnung, istUnterzeichnet, PFLICHT_BESTAETIGUNGEN,
  vertragsstand, pruefeExterneUnterschrift, externerTyp,
} from "@/lib/unterzeichnung-kern";
import { unterschriftBytes, unterschriftAnbieterin } from "@/lib/einstellungen";
import { ANBIETERIN } from "@/lib/vertrag-pdf-texte";
import { AGB_MARKDOWN, AGB_STAND } from "@/lib/agb-text";
import { anlage } from "@/lib/agb-kern";
import {
  schreibeZahlungsplan, aktualisiereRestraten, bescheinigungDaten, heuteIso,
  vorlageSenden, monatName,
} from "@/lib/zahlung";
import {
  abrechnungsbild, abrechnungsText, kuendigen, kuendigungZuruecknehmen,
  alsBeendetMarkieren, monatsEnde, pruefeKuendigung,
} from "@/lib/kuendigung";

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
  const [schuelerRes, sjRes, schuleRes] = await Promise.all([
    sb.from("profiles").select("user_id,name,email").eq("user_id", vertrag.schueler_id).single(),
    sb.from("schuljahre").select("id,name,erster_schultag,letzter_schultag,aktiv").eq("id", vertrag.schuljahr_id).single(),
    vertrag.schule_id
      ? sb.from("schulen").select("name").eq("id", vertrag.schule_id).maybeSingle()
      : Promise.resolve({ data: null }),
  ]);
  if (sjRes.error || !sjRes.data) return null;
  const schuljahr = sjRes.data as Schuljahr;
  const schueler = (schuelerRes.data || { name: "Schüler/in", email: null }) as { name: string; email: string | null };
  const schule = ((schuleRes.data as { name: string } | null) ?? null)?.name ?? null;

  const rechnung = await rechneVertrag({
    schuljahr,
    zeiten: zeiten.map((z) => ({ wochentag: z.wochentag, uhrzeit: z.uhrzeit, ab_datum: z.ab_datum, bis_datum: z.bis_datum })),
    stundensatzCent: euroZuCent(Number(vertrag.stundensatz)),
    stundensatzZweitCent: euroZuCent(Number(vertrag.stundensatz_zweittermin)),
    zweitesKind: vertrag.zweites_kind,
    vertragsbeginn: vertrag.vertragsbeginn,
    schuleId: vertrag.schule_id,
  });

  return { vertrag, zeiten, schueler, schuljahr, rechnung, schule };
}

type Vollbild = NonNullable<Awaited<ReturnType<typeof vollbild>>>;

/**
 * Alles, was die Vertragsseite im Portal anzeigt.
 *
 * Bewusst dieselbe Zusammenstellung für den Link aus der E-Mail und für die
 * angemeldete Familie – so sehen beide Wege denselben Vertrag.
 */
async function vertragsansicht(v: Vollbild) {
  return {
    schuelerName: v.schueler.name,
    schuljahr: v.schuljahr.name,
    zeiten: v.zeiten.filter((z) => !z.bis_datum).map((z) => ({ wochentag: z.wochentag, uhrzeit: z.uhrzeit })),
    zeitText: zeitText(v.zeiten.filter((z) => !z.bis_datum)),
    termine: v.rechnung.alleTermine,
    posten: v.rechnung.posten,
    stundensatzCent: euroZuCent(Number(v.vertrag.stundensatz)),
    jahresbetragCent: v.rechnung.jahresbetragCent,
    raten: v.rechnung.raten,
    einmalCent: v.rechnung.einmalCent,
    zahlweise: v.vertrag.zahlweise,
    status: v.vertrag.status,
    unterzeichnetAm: v.vertrag.unterzeichnet_am ?? null,
    schonUnterschrieben: istUnterzeichnet(v.vertrag),
    anbieter: ANBIETERIN.zeile,
    // Ehrlich statt fest verdrahtet: ohne hinterlegtes Bild bleibt die Zeile
    // im Vertrag leer, und das soll die Seite auch sagen.
    anbieterinHatUnterschrieben: !!(await unterschriftAnbieterin()),
    eltern: {
      name: v.vertrag.eltern_name ?? "", anschrift: v.vertrag.eltern_anschrift ?? "",
      email: v.vertrag.eltern_email ?? "", telefon: v.vertrag.eltern_telefon ?? "",
    },
    kind: { name: v.schueler.name, schule: v.schule },
    bestaetigungen: PFLICHT_BESTAETIGUNGEN,
    bank: bankverbindung(),
  };
}

/** Rohe Bytes aus einem Daten-URI – so braucht pdfkit das Bild. */
function bildBytes(datenUri: string | null | undefined): Buffer | null {
  if (!datenUri) return null;
  const komma = datenUri.indexOf(",");
  if (komma < 0) return null;
  try { return Buffer.from(datenUri.slice(komma + 1), "base64"); } catch { return null; }
}

/**
 * Der eigentliche Nachhilfevertrag als PDF.
 *
 * Alles, was darin steht, kommt aus der Datenbank – auch die Zeitstempel der
 * Unterschrift. Dieselben Daten ergeben deshalb immer dieselbe Datei: das
 * Archiv ist der Vertrag selbst, es braucht keine zusätzlich abgelegte Kopie.
 */
async function vertragPdf(v: Vollbild): Promise<Buffer> {
  const { vertrag, zeiten, schueler, schuljahr, rechnung } = v;
  const offen = zeiten.filter((z) => !z.bis_datum);
  return nachhilfevertragPdf({
    schuljahrName: schuljahr.name,
    eltern: {
      name: vertrag.eltern_name, anschrift: vertrag.eltern_anschrift,
      email: vertrag.eltern_email, telefon: vertrag.eltern_telefon,
    },
    kind: { name: schueler.name, schule: v.schule },
    zeiten: (offen.length ? offen : zeiten).map((z) => ({ wochentag: z.wochentag, uhrzeit: z.uhrzeit })),
    anzahlTermine: rechnung.alleTermine.length,
    // Immer der erste tatsächliche Termin – bei einem Quereinstieg ist er
    // die wichtigste Angabe des Vertrags, sonst schadet er nicht.
    abDatum: rechnung.alleTermine[0] ?? null,
    stundensatzCent: euroZuCent(Number(vertrag.stundensatz)),
    jahresbetragCent: rechnung.jahresbetragCent,
    zahlweise: vertrag.zahlweise,
    raten: rechnung.raten,
    einmalCent: rechnung.einmalCent,
    agbBestaetigtAm: vertrag.agb_bestaetigt_am ?? vertrag.agb_akzeptiert_am ?? null,
    widerrufBestaetigtAm: vertrag.widerruf_bestaetigt_am ?? null,
    unterschriftAnbieterin: await unterschriftBytes(),
    unterschriftEltern: bildBytes(vertrag.eltern_unterschrift),
    unterzeichnetAm: vertrag.unterzeichnet_am ?? null,
    erstelltAm: vertrag.erstellt_am ?? null,
  });
}

/** Die drei PDF-Anhänge der Bestätigungs-E-Mail. */
async function anhaenge(v: NonNullable<Awaited<ReturnType<typeof vollbild>>>): Promise<MailAnhang[]> {
  const { vertrag, zeiten, schueler, schuljahr, rechnung } = v;
  const [agb, liste, bestaetigung] = await Promise.all([
    agbPdf(),
    terminlistePdf({
      schuelerName: schueler.name, schuljahrName: schuljahr.name,
      zeiten: zeiten.map((z) => ({ wochentag: z.wochentag, uhrzeit: z.uhrzeit })),
      termine: rechnung.alleTermine,
    }),
    unterschriftBytes().then((sig: Buffer | null) => vertragsbestaetigungPdf({
      unterschriftAnbieterin: sig,
      schuelerName: schueler.name, schuljahrName: schuljahr.name,
      zeiten: zeiten.map((z) => ({ wochentag: z.wochentag, uhrzeit: z.uhrzeit })),
      posten: rechnung.posten, jahresbetragCent: rechnung.jahresbetragCent,
      zahlweise: vertrag.zahlweise, raten: rechnung.raten, einmalCent: rechnung.einmalCent,
      bestaetigtAm: vertrag.agb_akzeptiert_am || new Date().toISOString(),
    })),
  ]);
  const jahr = schuljahr.name.replace("/", "-");
  return [
    { filename: `AGB-${jahr}.pdf`, content: agb },
    { filename: `Terminliste-${jahr}.pdf`, content: liste },
    { filename: `Vertragsbestaetigung-${jahr}.pdf`, content: bestaetigung },
  ];
}

/**
 * Die drei Anhänge nach der Unterzeichnung: der unterschriebene Vertrag,
 * die Terminliste und die AGB. Die Bankverbindung steht im Text der E-Mail,
 * damit die Eltern zum Überweisen keinen Anhang öffnen müssen.
 */
async function unterschriftAnhaenge(v: Vollbild): Promise<MailAnhang[]> {
  const { zeiten, schueler, schuljahr, rechnung } = v;
  const [vertragDatei, liste, agb] = await Promise.all([
    vertragPdf(v),
    terminlistePdf({
      schuelerName: schueler.name, schuljahrName: schuljahr.name,
      zeiten: zeiten.map((z) => ({ wochentag: z.wochentag, uhrzeit: z.uhrzeit })),
      termine: rechnung.alleTermine,
    }),
    agbPdf(),
  ]);
  const jahr = schuljahr.name.replace("/", "-");
  return [
    { filename: `Nachhilfevertrag-${jahr}.pdf`, content: vertragDatei },
    { filename: `Terminliste-${jahr}.pdf`, content: liste },
    { filename: `AGB-${jahr}.pdf`, content: agb },
  ];
}

export async function POST(req: Request): Promise<Response> {
  let body: Record<string, unknown> = {};
  try { const r = await req.json(); if (r && typeof r === "object") body = r as Record<string, unknown>; } catch { /* {} */ }
  const action = text(body.action, 40);
  const sb = service();

  // ---------------------------------------------------------------- öffentlich
  if (action === "laden" || action === "unterzeichnen") {
    const pruef = pruefeVertragToken(text(body.vertragToken, 500));
    if (!pruef.ok) {
      return bad(pruef.grund === "abgelaufen"
        ? "Dieser Link ist abgelaufen. Bitte melde dich kurz, dann schicke ich dir einen neuen."
        : "Dieser Link ist nicht gültig.", 403);
    }
    const v = await vollbild(pruef.vertragId);
    if (!v) return bad("Vertrag nicht gefunden.", 404);

    if (action === "laden") return ok(await vertragsansicht(v));

    // --- unterzeichnen ---
    if (istUnterzeichnet(v.vertrag)) return ok({ schonUnterschrieben: true });

    const zahlweise = text(body.zahlweise, 10) === "einmal" ? "einmal" : "raten";
    // Beide Häkchen und ein echtes Unterschriftsbild sind Pflicht – geprüft
    // wird das hier auf dem Server, nicht nur im Formular.
    const pruefung = pruefeUnterzeichnung({
      agb: body.agb, widerruf: body.widerruf, unterschrift: body.unterschrift,
      eltern: body.eltern,
    });
    if (!pruefung.ok) return bad(pruefung.grund);

    const jetzt = new Date().toISOString();
    const up = await sb.from("vertraege").update({
      // Die Eltern tragen ihre Angaben selbst ein – sie stehen anschließend
      // so im Vertrag, wie sie sie geschrieben haben.
      eltern_name: pruefung.eltern.name,
      eltern_anschrift: pruefung.eltern.anschrift,
      eltern_email: pruefung.eltern.email || null,
      eltern_telefon: pruefung.eltern.telefon || null,
      eltern_unterschrift: pruefung.datenUri,
      unterzeichnet_am: jetzt,
      agb_bestaetigt_am: jetzt,
      widerruf_bestaetigt_am: jetzt,
      // Bleibt gesetzt, weil Bescheinigung und Zahlungsteil damit rechnen.
      agb_akzeptiert_am: jetzt,
      zahlweise,
      status: "aktiv",
      jahresbetrag: (v.rechnung.jahresbetragCent / 100).toFixed(2),
    }).eq("id", v.vertrag.id).is("unterzeichnet_am", null).select().single();
    if (up.error || !up.data) return bad("Die Unterschrift ließ sich nicht speichern.", 500);

    // Zahlungsplan anlegen – ab jetzt taucht der Vertrag in der Zahlungsübersicht auf.
    await schreibeZahlungsplan(v.vertrag.id);

    // Frisch laden, damit Unterschrift, Zahlweise und Zeitstempel in der PDF stehen
    const neu = await vollbild(v.vertrag.id);
    if (neu && v.schueler.email) {
      const bank = bankverbindung();
      await vorlageSenden("vertragUnterschrieben", v.schueler.email, {
        name: v.schueler.name,
        schuljahr: v.schuljahr.name,
        termin: zeitText(v.zeiten),
        anzahl: String(neu.rechnung.alleTermine.length),
        jahresbetrag: centFormat(neu.rechnung.jahresbetragCent),
        zahlweise: zahlweise === "einmal"
          ? `Einmalzahlung von ${centFormat(neu.rechnung.einmalCent)}, fällig innerhalb von 14 Tagen`
          : `${neu.rechnung.raten.length} Monatsraten à ${centFormat(neu.rechnung.raten[0]?.betragCent ?? 0)}, jeweils 1.–10. des Monats`,
        inhaber: bank.inhaber,
        iban: bank.iban,
        verwendungszweck: `Nachhilfe ${v.schueler.name} ${v.schuljahr.name}`,
      }, await unterschriftAnhaenge(neu));
    }
    return ok({ unterschrieben: true });
  }

  // ------------------------------------------- eigener Vertrag (angemeldet)
  if (action === "meinVertrag") {
    const t = text(body.token, 4000);
    const user = t ? await userFromToken(t) : null;
    if (!user) return bad("Bitte einloggen.", 401);
    const eigener = await laufenderVertrag(user.id);
    if (!eigener) return ok({ vertrag: null });
    const v = await vollbild(eigener.id);
    if (!v) return ok({ vertrag: null });
    return ok({
      vertrag: {
        schuelerName: v.schueler.name, schuljahr: v.schuljahr.name,
        zeitText: zeitText(v.zeiten), termine: v.rechnung.alleTermine,
        jahresbetragCent: v.rechnung.jahresbetragCent,
        zahlweise: v.vertrag.zahlweise, raten: v.rechnung.raten,
        einmalCent: v.rechnung.einmalCent,
        bestaetigt: istUnterzeichnet(v.vertrag),
        unterzeichnetAm: v.vertrag.unterzeichnet_am ?? null,
        // Der Weg zur Unterschrift, auch ohne die E-Mail: Wer angemeldet ist,
        // bekommt hier einen frischen Link zur eigenen Vertragsseite.
        vertragLink: istUnterzeichnet(v.vertrag) ? null : `/vertrag/${vertragToken(v.vertrag.id)}`,
      },
    });
  }

  // ------------------------------------------------------------------- Admin
  const token = text(body.token, 4000);
  if (!token) return bad("Bitte einloggen.", 401);
  const user = await userFromToken(token);
  if (!user) return bad("Bitte einloggen.", 401);
  const prof = await getProfile(user.id);
  if (!prof || prof.role !== "admin") return bad("Nur Kleana darf das.", 403);

  switch (action) {
    // Alle Verträge samt Schülernamen – Grundlage der Admin-Seite
    case "liste": {
      const [vRes, pRes, sjRes, schulenRes] = await Promise.all([
        sb.from("vertraege").select("*").order("erstellt_am", { ascending: false }),
        sb.from("profiles").select("user_id,name,email").eq("role", "student").order("name"),
        sb.from("schuljahre").select("id,name,aktiv"),
        // Schulen mit eigenen Ferien (z. B. internationale Schulen oder ein
        // Abschlussjahrgang mit früherem Schulende) – fürs Auswahlfeld im
        // Formular „Neuer Vertrag". Die Wahl bestimmt die Terminliste.
        sb.from("schulen").select("id,name").order("name"),
      ]);
      const vertraege = (vRes.data || []) as Vertrag[];
      const profile = (pRes.data || []) as { user_id: string; name: string; email: string | null }[];
      const jahre = (sjRes.data || []) as { id: string; name: string; aktiv: boolean }[];

      const zRes = vertraege.length
        ? await sb.from("vertrag_zeiten").select("*").in("vertrag_id", vertraege.map((v) => v.id)).order("wochentag")
        : { data: [] };
      const alleZeiten = (zRes.data || []) as { vertrag_id: string; wochentag: number; uhrzeit: string; bis_datum: string | null }[];

      return ok({
        schueler: profile,
        schuljahre: jahre,
        schulen: (schulenRes.data || []) as { id: string; name: string }[],
        // Ohne hinterlegte Unterschrift entsteht jede Vertrags-PDF ohne die
        // Unterschrift der Anbieterin. Das muss auf der Seite auffallen,
        // bevor der nächste Vertrag rausgeht.
        eigeneUnterschrift: !!(await unterschriftAnbieterin()),
        vertraege: vertraege.map((v) => {
          // Nur die aktuell gültigen Zeiten anzeigen (beendete Zeilen weglassen)
          const zeiten = alleZeiten.filter((z) => z.vertrag_id === v.id && !z.bis_datum);
          return {
            id: v.id,
            schuelerId: v.schueler_id,
            name: profile.find((p) => p.user_id === v.schueler_id)?.name || "Schüler/in",
            schuljahr: jahre.find((j) => j.id === v.schuljahr_id)?.name || "",
            zeiten: zeiten.map((z) => ({ wochentag: z.wochentag, uhrzeit: z.uhrzeit })),
            zeitText: zeitText(zeiten),
            stundensatz: Number(v.stundensatz),
            jahresbetragCent: euroZuCent(Number(v.jahresbetrag)),
            zahlweise: v.zahlweise,
            status: v.status,
            bestaetigt: istUnterzeichnet(v),
            kuendigungZum: v.kuendigung_zum,
            // Stand der Unterzeichnung – erstellt → eingeladen → unterschrieben
            ...(() => {
              const s = vertragsstand(v);
              return { stand: s.stand, standSeit: s.seit };
            })(),
            eingeladenAm: v.eingeladen_am ?? null,
            unterzeichnetAm: v.unterzeichnet_am ?? null,
            manuellAktiviertAm: v.manuell_aktiviert_am ?? null,
            erinnertAm: v.erinnert_am ?? null,
            // Nur ob eine Datei da ist – das Dokument selbst wäre hier zu groß.
            hatExterneFassung: !!v.externe_unterschrift,
            eltern: {
              name: v.eltern_name ?? "", anschrift: v.eltern_anschrift ?? "",
              email: v.eltern_email ?? "", telefon: v.eltern_telefon ?? "",
            },
          };
        }),
        heute: heuteIso(),
        monatsEndeHeute: monatsEnde(heuteIso()),
      });
    }

    // Daten der Erziehungsberechtigten nachtragen oder ändern
    case "elternSpeichern": {
      const id = text(body.vertrag_id, 40);
      if (!id) return bad("Kein Vertrag gewählt.");
      const r = await sb.from("vertraege").update({
        eltern_name: text(body.eltern_name, 120) || null,
        eltern_anschrift: text(body.eltern_anschrift, 200) || null,
        eltern_email: text(body.eltern_email, 160) || null,
        eltern_telefon: text(body.eltern_telefon, 60) || null,
        geaendert_am: new Date().toISOString(),
      }).eq("id", id);
      return r.error ? bad(r.error.message, 500) : ok();
    }

    /**
     * Rückfall: außerhalb des Portals unterschrieben.
     *
     * Manche Eltern drucken lieber aus und unterschreiben auf Papier. Kleana
     * lädt die Fassung hier hoch und schaltet den Vertrag von Hand frei –
     * danach gilt er wie ein im Portal unterschriebener: Zahlungsplan läuft,
     * Buchen ist frei.
     */
    case "externAktivieren": {
      const id = text(body.vertrag_id, 40);
      if (!id) return bad("Kein Vertrag gewählt.");
      const datei = pruefeExterneUnterschrift(body.datei);
      if (!datei.ok) return bad(datei.grund);

      const v = await vollbild(id);
      if (!v) return bad("Vertrag nicht gefunden.", 404);
      if (istUnterzeichnet(v.vertrag)) return bad("Dieser Vertrag ist bereits unterschrieben.");

      const zahlweise = text(body.zahlweise, 10) === "einmal" ? "einmal" : "raten";
      const jetzt = new Date().toISOString();
      const up = await sb.from("vertraege").update({
        externe_unterschrift: datei.datenUri,
        manuell_aktiviert_am: jetzt,
        // Die Unterschrift auf Papier IST die Zustimmung – ohne diesen
        // Zeitstempel stünde der Vertrag in Bescheinigung und Zahlungsteil
        // weiterhin als offen.
        agb_akzeptiert_am: v.vertrag.agb_akzeptiert_am || jetzt,
        zahlweise,
        status: "aktiv",
        jahresbetrag: (v.rechnung.jahresbetragCent / 100).toFixed(2),
      }).eq("id", id).is("manuell_aktiviert_am", null).select().single();
      if (up.error || !up.data) return bad("Das ließ sich nicht speichern.", 500);

      await schreibeZahlungsplan(id);
      return ok({ art: datei.art, kb: Math.round(datei.bytes / 1024) });
    }

    // Endabrechnung durchrechnen, ohne etwas zu speichern
    case "kuendigungVorschau": {
      const id = text(body.vertrag_id, 40);
      const zum = text(body.zum, 10);
      if (!id) return bad("Kein Vertrag gewählt.");
      if (!/^\d{4}-\d{2}-\d{2}$/.test(zum)) return bad("Bitte ein gültiges Enddatum angeben.");
      const bild = await abrechnungsbild(id, zum);
      if (!bild) return bad("Vertrag nicht gefunden.", 404);
      return ok({ abrechnung: bild, text: abrechnungsText(bild) });
    }

    case "kuendigen": {
      const id = text(body.vertrag_id, 40);
      const zum = text(body.zum, 10);
      if (!id) return bad("Kein Vertrag gewählt.");
      if (!/^\d{4}-\d{2}-\d{2}$/.test(zum)) return bad("Bitte ein gültiges Enddatum angeben.");
      const r = await kuendigen(id, zum);
      if (!r.ok) return bad(r.error || "Die Kündigung ließ sich nicht speichern.", 500);
      const bild = await abrechnungsbild(id, zum);
      return ok({
        frist: r.frist,
        abrechnung: bild,
        text: bild ? abrechnungsText(bild) : "",
      });
    }

    case "kuendigungZurueck": {
      const id = text(body.vertrag_id, 40);
      if (!id) return bad("Kein Vertrag gewählt.");
      const r = await kuendigungZuruecknehmen(id);
      return r.ok ? ok() : bad(r.error || "Das ließ sich nicht speichern.", 500);
    }

    case "beenden": {
      const id = text(body.vertrag_id, 40);
      if (!id) return bad("Kein Vertrag gewählt.");
      const r = await alsBeendetMarkieren(id);
      return r.ok ? ok() : bad(r.error || "Das ließ sich nicht speichern.", 500);
    }

    // Frist zu einem Wunschdatum prüfen, ohne zu rechnen
    case "fristPruefen": {
      const zum = text(body.zum, 10);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(zum)) return bad("Bitte ein gültiges Datum angeben.");
      return ok({ frist: pruefeKuendigung(heuteIso(), zum) });
    }

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
      // Die erste Stunde darf an jedem Tag liegen; die Raten laufen ab dem
      // Monat, in dem sie liegt.
      const start = text(body.unterrichtsbeginn, 10) || text(body.vertragsbeginn, 10)
        || sj.erster_schultag.slice(0, 10);
      const beginn = monatsErster(start);

      const r = await rechneVertrag({
        schuljahr: sj,
        zeiten: zeiten.map((z) => ({ ...z, ab_datum: start })),
        stundensatzCent: satzCent, stundensatzZweitCent: zweitCent,
        zweitesKind: body.zweites_kind === true, vertragsbeginn: beginn,
        schuleId: text(body.schule_id, 40) || null,
      });
      return ok({
        schuljahr: sj.name, posten: r.posten, jahresbetragCent: r.jahresbetragCent,
        raten: r.raten, einmalCent: r.einmalCent, anzahlTermine: r.alleTermine.length,
        unterrichtsbeginn: start, vertragsbeginn: beginn,
        ersterTermin: r.alleTermine[0] ?? null,
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
      // Die erste Stunde darf an jedem Tag des Monats liegen – ein Schüler,
      // der am 17. anfängt, ist der Normalfall. Abgerechnet wird trotzdem in
      // Monatsraten, deshalb wird der Monatserste daraus abgeleitet.
      const start = text(body.unterrichtsbeginn, 10) || text(body.vertragsbeginn, 10);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(start)) return bad("Bitte ein gültiges Datum für die erste Stunde angeben.");
      const beginn = monatsErster(start);

      const r = await rechneVertrag({
        schuljahr: sj,
        zeiten: zeiten.map((z) => ({ ...z, ab_datum: start })),
        stundensatzCent: satzCent, stundensatzZweitCent: zweitCent,
        zweitesKind: body.zweites_kind === true, vertragsbeginn: beginn,
        schuleId: text(body.schule_id, 40) || null,
      });
      if (!r.alleTermine.length) {
        return bad("Ab diesem Datum gibt es in dem Wochentermin keine Stunden mehr. Bitte Datum oder Wochentag prüfen.");
      }

      const vRes = await sb.from("vertraege").insert({
        schueler_id: schuelerId, schuljahr_id: sj.id, schule_id: text(body.schule_id, 40) || null,
        // Erziehungsberechtigte – stehen so im Vertrag. Alle optional.
        eltern_name: text(body.eltern_name, 120) || null,
        eltern_anschrift: text(body.eltern_anschrift, 200) || null,
        eltern_email: text(body.eltern_email, 160) || null,
        eltern_telefon: text(body.eltern_telefon, 60) || null,
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
        zeiten.map((z) => ({
          vertrag_id: vertrag.id, wochentag: z.wochentag, uhrzeit: z.uhrzeit || "15:00",
          // Nur setzen, wenn der Unterricht nicht am Monatsersten beginnt.
          ab_datum: start === beginn ? null : start,
        })),
      );
      if (zRes.error) return bad(zRes.error.message, 500);

      // Ehrlich zurueckmelden, ob das Angebot wirklich rausging: ohne
      // hinterlegte E-Mail-Adresse wird der Vertrag zwar angelegt, die
      // Eltern bekommen aber nichts zu sehen.
      const mail = await angebotSenden(vertrag.id, basisUrl(req));
      return ok({ vertragId: vertrag.id, mailVerschickt: mail.ok, mailFehler: mail.error ?? null });
    }

    case "erneutSenden": {
      const id = text(body.vertrag_id, 40);
      if (!id) return bad("Kein Vertrag gewählt.");
      const res = await angebotSenden(id, basisUrl(req));
      return res.ok ? ok() : bad(res.error || "Die E-Mail ließ sich nicht senden.", 500);
    }

    // Wochentag wechseln (Abschnitt 5)
    case "wochentagWechseln": {
      const id = text(body.vertrag_id, 40);
      const alterWochentag = Number(body.alter_wochentag);
      const neuerWochentag = Number(body.neuer_wochentag);
      const wechseldatum = text(body.wechseldatum, 10);
      const neueUhrzeit = text(body.neue_uhrzeit, 8) || undefined;

      if (!id) return bad("Kein Vertrag gewählt.");
      if (!Number.isInteger(neuerWochentag) || neuerWochentag < 0 || neuerWochentag > 6) return bad("Bitte einen gültigen Wochentag wählen.");
      if (!/^\d{4}-\d{2}-\d{2}$/.test(wechseldatum)) return bad("Bitte ein gültiges Wechseldatum angeben.");

      const vorher = await vollbild(id);
      if (!vorher) return bad("Vertrag nicht gefunden.", 404);
      if (!vorher.zeiten.some((z) => z.wochentag === alterWochentag)) {
        return bad("Dieser Wochentag gehört nicht zu dem Vertrag.");
      }

      const neueZeiten = wochentagWechseln(
        vorher.zeiten.map((z) => ({ wochentag: z.wochentag, uhrzeit: z.uhrzeit, ab_datum: z.ab_datum, bis_datum: z.bis_datum })),
        { alterWochentag, neuerWochentag, neueUhrzeit, wechseldatum },
      );

      // Alte Zeile(n) beenden
      const ende = neueZeiten.find((z) => z.wochentag === alterWochentag && z.bis_datum)?.bis_datum;
      if (ende) {
        const zuBeenden = vorher.zeiten.filter((z) => z.wochentag === alterWochentag && (!z.bis_datum || z.bis_datum > ende));
        for (const z of zuBeenden) {
          const r = await sb.from("vertrag_zeiten").update({ bis_datum: ende }).eq("id", z.id);
          if (r.error) return bad(r.error.message, 500);
        }
      }
      // Neue Zeile anlegen
      const neuZeile = neueZeiten[neueZeiten.length - 1];
      const ins = await sb.from("vertrag_zeiten").insert({
        vertrag_id: id, wochentag: neuZeile.wochentag,
        uhrzeit: neuZeile.uhrzeit || "15:00", ab_datum: wechseldatum,
      });
      if (ins.error) return bad(ins.error.message, 500);

      // Neu durchrechnen
      const nachher = await vollbild(id);
      if (!nachher) return bad("Neuberechnung fehlgeschlagen.", 500);
      await sb.from("vertraege")
        .update({ jahresbetrag: (nachher.rechnung.jahresbetragCent / 100).toFixed(2) })
        .eq("id", id);

      // Restraten: bereits fällige Raten bleiben, der Rest wird neu verteilt
      const monate = ratenMonate(nachher.vertrag.vertragsbeginn, nachher.schuljahr.letzter_schultag);
      const { faellig, verbleibend } = teileRatenmonate(monate, wechseldatum);
      const alteRateCent = monate.length ? Math.round(euroZuCent(Number(vorher.vertrag.jahresbetrag)) / monate.length) : 0;
      const bereitsFaelligCent = alteRateCent * faellig.length;
      const restplan = verbleibend.length
        ? ratenNeuVerteilen({
            neuerJahresbetragCent: nachher.rechnung.jahresbetragCent,
            bereitsFaelligCent, verbleibendeMonate: verbleibend,
          })
        : [];

      // Nur die noch offenen Monate anpassen; gezahlte Raten bleiben stehen.
      if (restplan.length) await aktualisiereRestraten(id, restplan);

      // Eltern informieren – mit neuer Terminliste im Anhang
      if (nachher.schueler.email) {
        const dateien = await anhaenge(nachher);
        const neueRate = restplan[0]?.betragCent ?? 0;
        const betragText = nachher.vertrag.zahlweise === "einmal"
          ? `Neuer Gesamtbetrag: <b>${centFormat(nachher.rechnung.einmalCent)}</b> (Einmalzahlung)`
          : restplan.length
            ? `Die restlichen ${restplan.length} Raten betragen jetzt je <b>${centFormat(neueRate)}</b>.`
            : "Es sind keine weiteren Raten offen.";
        await mailZustellenOderMelden(
          "Termin geändert",
          nachher.schueler.email,
          `Termin geändert – Schuljahr ${nachher.schuljahr.name}`,
          `<p>Hallo,</p>
           <p>der feste Termin für <b>${nachher.schueler.name}</b> wurde geändert.</p>
           <p><b>Ab ${datumDe(wechseldatum)}:</b> ${WOCHENTAGE[neuerWochentag]}${neuZeile.uhrzeit ? ` ${String(neuZeile.uhrzeit).slice(0, 5)} Uhr` : ""}<br>
              <b>Termine insgesamt:</b> ${nachher.rechnung.alleTermine.length}<br>
              <b>Neuer Jahresbetrag:</b> ${centFormat(nachher.rechnung.jahresbetragCent)}</p>
           <p>${betragText}<br>
              Bereits gezahlte Raten bleiben unverändert.</p>
           <p>Die neue Terminliste findest du im Anhang.</p>
           <p>Liebe Grüße<br>Anna</p>`,
          { anhaenge: dateien, kopieAn: ADMIN_EMAIL },
        );
      }

      return ok({
        jahresbetragCent: nachher.rechnung.jahresbetragCent,
        anzahlTermine: nachher.rechnung.alleTermine.length,
        bereitsFaelligCent, restraten: restplan,
      });
    }

    // Einen Wochentermin beenden (Familientermin endet, AGB § 6 Abs. 2)
    case "terminBeenden": {
      const id = text(body.vertrag_id, 40);
      const wochentag = Number(body.wochentag);
      const zum = text(body.zum, 10);
      if (!id) return bad("Kein Vertrag gewählt.");
      if (!Number.isInteger(wochentag) || wochentag < 0 || wochentag > 6) return bad("Bitte einen gültigen Wochentag wählen.");
      if (!/^\d{4}-\d{2}-\d{2}$/.test(zum)) return bad("Bitte ein gültiges Enddatum angeben.");

      const vorher = await vollbild(id);
      if (!vorher) return bad("Vertrag nicht gefunden.", 404);
      const offene = vorher.zeiten.filter((z) => !z.bis_datum || z.bis_datum > zum);
      if (offene.length < 2) {
        return bad("Dieser Vertrag hat nur noch einen Wochentermin. Zum Beenden des ganzen Vertrags bitte kündigen.");
      }
      if (!offene.some((z) => z.wochentag === wochentag)) {
        return bad("Dieser Wochentag gehört nicht zu dem Vertrag.");
      }

      for (const z of offene.filter((z) => z.wochentag === wochentag)) {
        const r = await sb.from("vertrag_zeiten").update({ bis_datum: zum }).eq("id", z.id);
        if (r.error) return bad(r.error.message, 500);
      }

      const nachher = await vollbild(id);
      if (!nachher) return bad("Neuberechnung fehlgeschlagen.", 500);
      await sb.from("vertraege")
        .update({ jahresbetrag: (nachher.rechnung.jahresbetragCent / 100).toFixed(2) })
        .eq("id", id);

      // Restraten neu verteilen – bereits fällige bleiben unverändert.
      const monate = ratenMonate(nachher.vertrag.vertragsbeginn, nachher.schuljahr.letzter_schultag);
      const { faellig, verbleibend } = teileRatenmonate(monate, zum);
      const alteRateCent = monate.length
        ? Math.round(euroZuCent(Number(vorher.vertrag.jahresbetrag)) / monate.length) : 0;
      const bereitsFaelligCent = alteRateCent * faellig.length;
      const restplan = verbleibend.length
        ? ratenNeuVerteilen({
            neuerJahresbetragCent: nachher.rechnung.jahresbetragCent,
            bereitsFaelligCent, verbleibendeMonate: verbleibend,
          })
        : [];
      if (restplan.length) await aktualisiereRestraten(id, restplan);

      // Eltern informieren – Text kommt aus der editierbaren Vorlage.
      if (nachher.schueler.email) {
        const bleibt = nachher.zeiten.find((z) => z.wochentag !== wochentag && (!z.bis_datum || z.bis_datum > zum));
        const regulaer = nachher.rechnung.posten.find((p) => !p.ermaessigt);
        await vorlageSenden("terminEnde", nachher.schueler.email, {
          name: nachher.schueler.name,
          alterTag: WOCHENTAGE[wochentag],
          bleibtTag: bleibt ? WOCHENTAGE[bleibt.wochentag] : "—",
          endeAm: datumDe(zum),
          abMonat: monatName(monatsErster(zum)),
          satz: centFormat(regulaer?.satzCent ?? euroZuCent(Number(nachher.vertrag.stundensatz))),
          jahresbetrag: centFormat(nachher.rechnung.jahresbetragCent),
          rate: restplan.length ? centFormat(restplan[0].betragCent) : "keine weiteren Raten",
        }, await anhaenge(nachher));
      }

      return ok({
        jahresbetragCent: nachher.rechnung.jahresbetragCent,
        posten: nachher.rechnung.posten,
        familienMonate: nachher.rechnung.familienMonate,
        bereitsFaelligCent, restraten: restplan,
      });
    }

    // Terminliste eines Vertrags fürs Portal (Admin-Sicht)
    case "terminliste": {
      const id = text(body.vertrag_id, 40);
      const v = id ? await vollbild(id) : null;
      if (!v) return bad("Vertrag nicht gefunden.", 404);
      return ok({
        schuelerName: v.schueler.name, schuljahr: v.schuljahr.name,
        zeitText: zeitText(v.zeiten), termine: v.rechnung.alleTermine,
        jahresbetragCent: v.rechnung.jahresbetragCent,
      });
    }

    default:
      return bad("Unbekannte Aktion.");
  }
}

/**
 * Angebots-E-Mail mit frischem Bestätigungslink verschicken.
 *
 * WICHTIG: Diese E-Mail geht AUSSCHLIESSLICH an die Familie – keine Kopie an
 * die Admin-Adresse. Sie enthält den Bestätigungslink, und wer den hat, kann
 * die AGB-Zustimmung auslösen. Läge er auch in Kleanas Postfach, stünde im
 * System womöglich eine Zustimmung, die gar nicht von den Eltern stammt.
 *
 * Damit Kleana trotzdem weiß, dass das Angebot raus ist, geht ihr eine
 * getrennte Nachricht zu – mit allen Daten, aber OHNE den Link.
 */
async function angebotSenden(vertragId: string, baseUrl: string): Promise<{ ok: boolean; error?: string }> {
  const v = await vollbild(vertragId);
  if (!v) return { ok: false, error: "Vertrag nicht gefunden." };
  if (!v.schueler.email) return { ok: false, error: "Für diesen Schüler ist keine E-Mail-Adresse hinterlegt." };

  const link = bestaetigungsLink(vertragId, baseUrl);
  const rate = v.rechnung.raten[0]?.betragCent ?? 0;

  // Der fertige Vertrag liegt gleich bei – mit Kleanas Unterschrift, den
  // Terminen und den AGB. Die Eltern haben damit sofort alles in der Hand,
  // was sie zum Lesen brauchen; unterschrieben wird danach über den Link.
  const jahr = v.schuljahr.name.replace("/", "-");
  const dabei: MailAnhang[] = [
    { filename: `Nachhilfevertrag-${jahr}.pdf`, content: await vertragPdf(v) },
    {
      filename: `Terminliste-${jahr}.pdf`,
      content: await terminlistePdf({
        schuelerName: v.schueler.name, schuljahrName: v.schuljahr.name,
        zeiten: v.zeiten.map((z) => ({ wochentag: z.wochentag, uhrzeit: z.uhrzeit })),
        termine: v.rechnung.alleTermine,
      }),
    },
    { filename: `AGB-${jahr}.pdf`, content: await agbPdf() },
  ];

  // Text und Betreff kommen aus der Vorlage – änderbar unter
  // „Zahlungen → E-Mail-Vorlagen", ohne dass jemand Programmcode anfasst.
  // Ausdrücklich OHNE Kopie an die Admin-Adresse: siehe der Hinweis oben.
  const ergebnis = await vorlageSenden("vertragEinladung", v.schueler.email, {
    name: v.schueler.name,
    schuljahr: v.schuljahr.name,
    termin: zeitText(v.zeiten),
    anzahl: String(v.rechnung.alleTermine.length),
    jahresbetrag: centFormat(v.rechnung.jahresbetragCent),
    raten: String(v.rechnung.raten.length),
    rate: centFormat(rate),
    einmal: centFormat(v.rechnung.einmalCent),
    link,
  }, dabei, { kopieAnAdmin: false });

  // Getrennte Nachricht an Kleana – bewusst OHNE Bestätigungslink.
  if (ergebnis.ok) {
    // Zeitpunkt der Einladung festhalten: daran hängt später die Erinnerung
    // und die Übersicht „eingeladen am".
    await service().from("vertraege")
      .update({ eingeladen_am: new Date().toISOString() }).eq("id", vertragId);
    await sendMail(
      ADMIN_EMAIL,
      `Vertrag verschickt: ${v.schueler.name}`,
      `<p>Der Vertrag für <b>${v.schueler.name}</b> ist zur Unterschrift raus.</p>
       <p><b>An:</b> ${v.schueler.email}<br>
          <b>Termin:</b> ${zeitText(v.zeiten)}<br>
          <b>Termine im Schuljahr:</b> ${v.rechnung.alleTermine.length}<br>
          <b>Jahresbetrag:</b> ${centFormat(v.rechnung.jahresbetragCent)}<br>
          <b>Raten:</b> ${v.rechnung.raten.length} × ${centFormat(rate)}</p>
       <p style="color:#5f574f;font-size:14px">
         Der Unterschriftslink steht bewusst nicht in dieser Nachricht – die
         Eltern sollen selbst unterschreiben. Unter
         <a href="${baseUrl}/vertraege">Verträge</a> siehst du, sobald das
         passiert ist; dort kannst du den Vertrag auch erneut verschicken.
       </p>`,
    );
  }

  return ergebnis;
}

/**
 * Fehler im PDF-Weg landen direkt in einem Browser-Tab. Rohes JSON wirkt dort
 * wie ein Absturz – stattdessen gibt es eine kleine Seite mit Erklärung und
 * dem Weg zurück. Die Meldungen sind eigene Texte, kein Nutzereingang.
 */
function fehlerSeite(meldung: string, code: number): Response {
  const html = `<!doctype html><html lang="de"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Lerne mit Anna</title></head>
<body style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#fffdf8;color:#0f172a;display:flex;min-height:100vh;align-items:center;justify-content:center;padding:24px">
<div style="max-width:440px;text-align:center">
<div style="font-size:40px">📄</div>
<h1 style="font-size:20px;margin:10px 0 8px">Die Datei ließ sich nicht öffnen</h1>
<p style="color:#475569;font-size:15px;line-height:1.5;margin:0 0 18px">${meldung}</p>
<a href="/kalender" style="display:inline-block;background:#2bb3c0;color:#fff;text-decoration:none;font-weight:700;padding:11px 20px;border-radius:10px">Zurück zum Kalender</a>
</div></body></html>`;
  return new Response(html, {
    status: code,
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" },
  });
}

// Terminliste als PDF herunterladen (Portal): /api/vertrag?pdf=<token>
export async function GET(req: Request): Promise<Response> {
  const url = new URL(req.url);

  // Zwei Wege: Token aus der E-Mail (?pdf=) oder normale Anmeldung (?sitzung=)
  let vertragId = "";
  const pdfToken = url.searchParams.get("pdf");
  if (pdfToken) {
    const pruef = pruefeVertragToken(pdfToken);
    if (!pruef.ok) return fehlerSeite("Dieser Link ist nicht mehr gültig. Bitte öffne die Seite neu und tippe den Knopf noch einmal an – oder frag Anna nach einem frischen Link.", 403);
    vertragId = pruef.vertragId;
  } else {
    const sitzung = url.searchParams.get("sitzung") || "";
    const user = sitzung ? await userFromToken(sitzung) : null;
    if (!user) return fehlerSeite("Die Anmeldung ist inzwischen abgelaufen. Bitte geh zurück zum Kalender, melde dich an und tippe den PDF-Knopf noch einmal an.", 401);
    const prof = await getProfile(user.id);
    if (!prof) return fehlerSeite("Für diesen Zugang ist kein Profil hinterlegt.", 403);
    // Kleana darf jeden Vertrag oeffnen, Schueler nur den eigenen
    const gewuenscht = url.searchParams.get("vertrag") || "";
    if (prof.role === "admin" && gewuenscht) {
      vertragId = gewuenscht;
    } else {
      const eigener = await laufenderVertrag(user.id);
      if (!eigener) return fehlerSeite("Für dich ist noch kein Vertrag hinterlegt. Sobald Anna einen anlegt, findest du die Unterlagen hier.", 404);
      vertragId = eigener.id;
    }
  }

  const v = await vollbild(vertragId);
  if (!v) return fehlerSeite("Dieser Vertrag wurde nicht gefunden.", 404);

  const art = url.searchParams.get("art") || "terminliste";

  // Die hochgeladene, auf Papier unterschriebene Fassung. Sie kann eine PDF
  // oder ein Foto sein und wird deshalb mit ihrem eigenen Typ ausgeliefert.
  if (art === "extern") {
    const typ = externerTyp(v.vertrag.externe_unterschrift);
    if (!typ) return fehlerSeite("Für diesen Vertrag ist keine unterschriebene Fassung hinterlegt.", 404);
    const roh = v.vertrag.externe_unterschrift as string;
    const bytes = Buffer.from(roh.slice(roh.indexOf(",") + 1), "base64");
    return new Response(new Uint8Array(bytes), {
      headers: {
        "Content-Type": typ.mime,
        "Content-Disposition": `inline; filename="Vertrag-unterschrieben.${typ.endung}"`,
        "Cache-Control": "no-store",
      },
    });
  }

  let datei: Buffer, name: string;
  if (art === "vertrag") {
    datei = await vertragPdf(v);
    name = `Nachhilfevertrag-${v.schuljahr.name.replace("/", "-")}.pdf`;
  } else if (art === "agb") {
    datei = await agbPdf();
    name = "AGB.pdf";
  } else if (art === "widerruf") {
    datei = await markdownPdf(
      "Widerrufsbelehrung",
      `Anlage zu den AGB · Stand ${AGB_STAND}`,
      [anlage(AGB_MARKDOWN, "Anlage 1"), anlage(AGB_MARKDOWN, "Anlage 2")].join("\n\n---\n\n"),
    );
    name = "Widerrufsbelehrung.pdf";
  } else if (art === "bestaetigung") {
    datei = await vertragsbestaetigungPdf({
      unterschriftAnbieterin: await unterschriftBytes(),
      schuelerName: v.schueler.name, schuljahrName: v.schuljahr.name,
      zeiten: v.zeiten.map((z) => ({ wochentag: z.wochentag, uhrzeit: z.uhrzeit })),
      posten: v.rechnung.posten, jahresbetragCent: v.rechnung.jahresbetragCent,
      zahlweise: v.vertrag.zahlweise, raten: v.rechnung.raten, einmalCent: v.rechnung.einmalCent,
      bestaetigtAm: v.vertrag.agb_akzeptiert_am || new Date().toISOString(),
    });
    name = "Vertragsbestaetigung.pdf";
  } else if (art === "bescheinigung") {
    const dat = await bescheinigungDaten(vertragId);
    if (!dat) return fehlerSeite("Für diesen Vertrag gibt es noch keine Zahlungsbescheinigung.", 404);
    datei = await bescheinigungPdf({ ...dat, erstelltAm: new Date().toISOString() });
    name = `Zahlungsbescheinigung-${v.schuljahr.name.replace("/", "-")}.pdf`;
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
