// =============================================================================
// Unterzeichnung – der Teil mit Datenbank
//
// Hier steckt nur der Erinnerungslauf: Wer nach fünf Tagen noch nicht
// unterschrieben hat, bekommt einmal eine freundliche Nachricht mit einem
// frischen Link. Die Regeln dazu stehen in lib/unterzeichnung-kern.ts.
// =============================================================================
import { service } from "@/lib/kalender";
import { vertragToken } from "@/lib/vertrag-token";
import { vorlageSenden, heuteIso } from "@/lib/zahlung";
import { erinnerungFaellig, tageSeit, ERINNERUNG_NACH_TAGEN } from "@/lib/unterzeichnung-kern";
import type { Vertrag } from "@/lib/vertrag";

export type Erinnerungsergebnis = {
  geprueft: number;
  verschickt: number;
  /** Verträge, bei denen nichts rausging – mit Grund, damit es auffällt. */
  probleme: { name: string; grund: string }[];
};

/**
 * Einmal täglich: Erinnerungen an offene Verträge verschicken.
 *
 * Mit probelauf = true wird nur gezählt, nichts verschickt und nichts
 * gespeichert – so lässt sich vorher nachsehen, was passieren würde.
 */
export async function erinnerungslauf(opt: {
  heute?: string; basisUrl: string; probelauf?: boolean;
} ): Promise<Erinnerungsergebnis> {
  const heute = opt.heute || heuteIso();
  const sb = service();

  const vRes = await sb.from("vertraege").select("*")
    .in("status", ["angeboten", "aktiv"])
    .not("eingeladen_am", "is", null)
    .is("unterzeichnet_am", null)
    .is("manuell_aktiviert_am", null)
    .is("erinnert_am", null);
  const kandidaten = ((vRes.data || []) as Vertrag[]).filter((v) => erinnerungFaellig(v, heute));

  const ergebnis: Erinnerungsergebnis = { geprueft: kandidaten.length, verschickt: 0, probleme: [] };
  if (!kandidaten.length) return ergebnis;

  const [pRes, sjRes] = await Promise.all([
    sb.from("profiles").select("user_id,name,email").in("user_id", kandidaten.map((v) => v.schueler_id)),
    sb.from("schuljahre").select("id,name").in("id", kandidaten.map((v) => v.schuljahr_id)),
  ]);
  const profile = (pRes.data || []) as { user_id: string; name: string; email: string | null }[];
  const jahre = (sjRes.data || []) as { id: string; name: string }[];

  for (const v of kandidaten) {
    const p = profile.find((x) => x.user_id === v.schueler_id);
    const name = p?.name || "dein Kind";
    if (!p?.email) {
      ergebnis.probleme.push({ name, grund: "keine E-Mail-Adresse hinterlegt" });
      continue;
    }
    if (opt.probelauf) { ergebnis.verschickt++; continue; }

    // Frischer Link: der aus der Einladung wäre zwar noch gültig, aber ein
    // neuer hält wieder volle 14 Tage.
    const link = `${opt.basisUrl.replace(/\/$/, "")}/vertrag/${vertragToken(v.id)}`;
    const r = await vorlageSenden("vertragErinnerung", p.email, {
      name,
      schuljahr: jahre.find((j) => j.id === v.schuljahr_id)?.name || "",
      tage: String(tageSeit(v.eingeladen_am, heute) ?? ERINNERUNG_NACH_TAGEN),
      link,
      // Die Nachricht enthält den Unterschriftslink – deshalb ausdrücklich
      // OHNE Kopie an Kleana.
    }, undefined, { kopieAnAdmin: false });

    if (!r.ok) {
      ergebnis.probleme.push({ name, grund: r.error || "unbekannter Fehler" });
      continue;
    }
    const up = await sb.from("vertraege")
      .update({ erinnert_am: new Date().toISOString() }).eq("id", v.id);
    if (up.error) ergebnis.probleme.push({ name, grund: `Erinnerung verschickt, aber nicht vermerkt: ${up.error.message}` });
    ergebnis.verschickt++;
  }

  return ergebnis;
}
