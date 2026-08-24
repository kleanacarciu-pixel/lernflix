// =============================================================================
// Standardtexte der Vertrags-E-Mails
//
// Diese drei Nachrichten gehören zum Vertragsabschluss und stehen deshalb im
// Programm – nicht nur in der Datenbank. Sonst hinge eine verschickte E-Mail
// daran, ob jemand vorher eine SQL-Datei ausgeführt hat; vergisst man sie,
// bekämen die Eltern gar nichts und niemandem fiele es auf.
//
// Steht in der Datenbank ein eigener Text, gilt der. Die Texte hier sind nur
// der Anfangszustand und der Rückfall.
//
// Bewusst ohne Importe, damit sie ohne Datenbank prüfbar bleiben.
// =============================================================================

export type StandardVorlage = { schluessel: string; betreff: string; text: string };

/** Diese Nachrichten enthalten den Unterschriftslink und dürfen NIE in Kopie an die Admin-Adresse gehen. */
export const MIT_LINK = ["vertragEinladung", "vertragErinnerung"];

export const STANDARD_VORLAGEN: StandardVorlage[] = [
  {
    schluessel: "vertragEinladung",
    betreff: "Der Vertrag für {name} – bitte unterschreiben",
    text: [
      "Hallo,",
      "",
      "hier ist der Vertrag für {name} im Schuljahr {schuljahr}. Er liegt fertig im "
      + "Anhang – von mir bereits unterschrieben, zusammen mit der Terminliste fürs "
      + "ganze Schuljahr und den AGB. Jetzt fehlt nur noch deine Unterschrift.",
      "",
      "Fester Termin: {termin}",
      "Termine im Schuljahr: {anzahl}",
      "Jahresbetrag: {jahresbetrag}",
      "",
      "Du kannst wählen:",
      "• {raten} Monatsraten à {rate} (jeweils 1.–10. des Monats)",
      "• Einmalzahlung {einmal} (50,00 € Nachlass)",
      "",
      "Hier geht es zum Vertrag:",
      "{link}",
      "",
      "Unterschrieben wird direkt auf der Seite – am Handy mit dem Finger, am Rechner mit "
      + "der Maus. Danach bekommst du den von euch beiden unterschriebenen Vertrag als PDF, "
      + "zusammen mit der Terminliste und den AGB. Der Link ist 14 Tage gültig.",
      "",
      "Erst nach der Unterschrift lassen sich Stunden buchen und absagen – am besten also "
      + "gleich erledigen, es dauert eine Minute.",
      "",
      "Liebe Grüße",
      "Anna",
    ].join("\n"),
  },
  {
    schluessel: "vertragErinnerung",
    betreff: "Kurze Erinnerung: der Vertrag für {name}",
    text: [
      "Hallo,",
      "",
      "vor {tage} Tagen habe ich dir den Vertrag für {name} geschickt – unterschrieben ist "
      + "er noch nicht. Vielleicht ist er im Alltag untergegangen, das kenne ich gut.",
      "",
      "Hier ist ein frischer Link:",
      "{link}",
      "",
      "Es dauert wirklich nur eine Minute: zwei Häkchen setzen, mit dem Finger "
      + "unterschreiben, fertig. Danach ist alles freigeschaltet und ihr könnt Stunden "
      + "buchen und absagen.",
      "",
      "Wenn etwas unklar ist oder du lieber auf Papier unterschreiben möchtest, meld dich "
      + "einfach – wir finden eine Lösung.",
      "",
      "Liebe Grüße",
      "Anna",
    ].join("\n"),
  },
  {
    schluessel: "vertragUnterschrieben",
    betreff: "Vertrag unterschrieben – Schuljahr {schuljahr}",
    text: [
      "Hallo,",
      "",
      "vielen Dank – der Vertrag für {name} ist unterschrieben und der Unterricht ist "
      + "freigeschaltet.",
      "",
      "Fester Termin: {termin}",
      "Termine im Schuljahr: {anzahl}",
      "Jahresbetrag: {jahresbetrag}",
      "Zahlweise: {zahlweise}",
      "",
      "Überweisung an:",
      "{inhaber}",
      "IBAN: {iban}",
      "Verwendungszweck: {verwendungszweck}",
      "",
      "Im Anhang findest du den unterschriebenen Vertrag, die Terminliste für das ganze "
      + "Schuljahr und die AGB. Bitte gut aufbewahren.",
      "",
      "Im Kalender könnt ihr ab sofort Termine absagen, Nachholstunden buchen und die "
      + "Terminliste jederzeit ansehen.",
      "",
      "Liebe Grüße",
      "Anna",
    ].join("\n"),
  },
];

/** Standardtext zu einem Schlüssel, oder null. */
export function standardVorlage(schluessel: string): StandardVorlage | null {
  return STANDARD_VORLAGEN.find((v) => v.schluessel === schluessel) ?? null;
}
