// =============================================================================
// E-Mail-Vorlagen: Platzhalter füllen und Text in HTML wandeln
//
// Getrennt vom Rest, weil hier zwei Dinge passieren, die still schiefgehen
// können: ein nicht ersetzter Platzhalter und ein Link, der beim Empfänger
// als nackter Text ankommt. Beides fällt erst auf, wenn die E-Mail schon
// draußen ist – deshalb steht es hier ohne Datenbank und ist geprüft.
// =============================================================================

/** Platzhalter in geschweiften Klammern ersetzen. */
export function fuelle(text: string, werte: Record<string, string>): string {
  // Unbekannte Platzhalter bleiben sichtbar stehen. Das ist Absicht: Ein
  // „{name}" in der E-Mail ist peinlich, aber eine leere Stelle wäre
  // schlimmer – sie fiele niemandem auf.
  return text.replace(/\{(\w+)\}/g, (_, k: string) => werte[k] ?? `{${k}}`);
}

/**
 * Reintext in schlichtes HTML wandeln (Absätze bleiben erhalten).
 *
 * Links werden anklickbar. Das ist kein Schmuck: Die Einladung zum
 * Unterschreiben besteht im Kern aus ihrem Link – als nackter Text müssten
 * die Eltern ihn abtippen.
 */
export function alsHtml(text: string): string {
  const sicher = text.replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c] || c));
  const verlinkt = sicher.replace(
    /https?:\/\/[^\s<]+/g,
    (u) => `<a href="${u}" style="color:#2BB3C0">${u}</a>`,
  );
  return verlinkt.split(/\n{2,}/).map((p) => `<p>${p.replace(/\n/g, "<br>")}</p>`).join("");
}
