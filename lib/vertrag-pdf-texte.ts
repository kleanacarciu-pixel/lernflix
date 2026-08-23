// =============================================================================
// Fester Wortlaut der Vertrags-PDF
//
// Diese Texte stehen so im Vertrag und wurden wortgleich aus dem Auftrag
// übernommen. Sie liegen bewusst getrennt vom Layout: So lässt sich der
// Wortlaut prüfen und ändern, ohne die PDF-Erzeugung anzufassen – und ein
// Test kann festhalten, dass er unverändert im Dokument landet.
//
// Bewusst ohne Importe, damit der Wortlaut ohne Datenbank testbar bleibt.
// =============================================================================

export const TITEL = "Nachhilfevertrag";

export const ANBIETERIN = {
  zeile: "Kleana Carciu · Lerne mit Anna · Kohlbrennerstraße 16 · 81929 München",
  rolle: "nachfolgend „Anbieterin“",
  name: "Kleana Carciu",
  ort: "München",
};

export const FUSSZEILE =
  "Lerne mit Anna · Tel: +49 (0)176 24700519 · lernemitanna@outlook.com · lernemitanna.de";

/** Kopfzeile unter dem Titel, z. B. „… · SCHULJAHR 2026/27“. */
export function unterzeile(schuljahrName: string): string {
  return `LERNE MIT ANNA · MATHE UND PHYSIK · SCHULJAHR ${schuljahrName}`;
}

export const HINWEIS_FERIEN =
  "Die Ferien der Schule des Kindes sowie gesetzliche Feiertage sind unterrichtsfrei "
  + "und in Terminanzahl und Betrag nicht enthalten.";

/** Verwendungszweck im Abschnitt „Vergütung“. */
export function zahlungshinweis(vornameKind: string, schuljahrName: string): string {
  return `Zahlung per Überweisung; Verwendungszweck: „Nachhilfe ${vornameKind} ${schuljahrName}“. `
    + "Der August ist beitragsfrei.";
}

/** Abschnitt 3 – wortgleich zu übernehmen. */
export type Punkt = { titel: string; text: string };

export const WICHTIGSTES: Punkt[] = [
  {
    titel: "Laufzeit & Kündigung",
    text: "Vertrag bis 31. Juli 2027. Kündigung jederzeit mit einer Frist von 4 Wochen "
      + "zum Monatsende (Textform).",
  },
  {
    titel: "Absagen",
    text: "Bis 4 Stunden vor dem Termin abgesagt = Minusstunde: sie verfällt nie und wird "
      + "nachgeholt (höchstens 4 gleichzeitig offen). Spätere Absagen gelten als gehaltene "
      + "Stunde. Fällt eine Stunde durch die Anbieterin aus, wird sie gutgeschrieben.",
  },
  {
    titel: "Plusstunden",
    text: "Zusätzliche Stunden (z. B. vor Prüfungen) können jederzeit gebucht werden; "
      + "Abrechnung am Schuljahresende.",
  },
  {
    titel: "Vorzeitiges Ende",
    text: "Abgerechnet werden nur die tatsächlich gehaltenen Stunden zum vollen Stundensatz. "
      + "Zu viel Gezahltes — auch bei Einmalzahlung — wird binnen 14 Tagen erstattet; der "
      + "Einmalzahlungs-Nachlass von 50 € entfällt dabei.",
  },
  {
    titel: "Grundlagen",
    text: "Es gelten die AGB (Stand 21.08.2026) einschließlich Widerrufsbelehrung sowie die "
      + "Terminliste als Anlagen und Bestandteil dieses Vertrags.",
  },
];

/** Die beiden Pflicht-Bestätigungen aus dem Portal. */
export const BESTAETIGUNG_AGB =
  "Ich habe die AGB gelesen und akzeptiere sie.";

export const BESTAETIGUNG_WIDERRUF =
  "Ich habe die Widerrufsbelehrung zur Kenntnis genommen und verlange ausdrücklich, "
  + "dass der Unterricht bereits vor Ablauf der Widerrufsfrist beginnt.";

/** Farben dieses Dokuments – abweichend von den übrigen System-PDFs. */
export const FARBEN = {
  teal: "#2E7D74",
  gold: "#C9A96A",
  ink: "#1A1A1A",
  grau: "#5f574f",
};
