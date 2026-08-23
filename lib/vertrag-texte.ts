// =============================================================================
// Rechtstexte für den Schuljahresvertrag
//
// Eine gemeinsame Quelle für PDF-Anhang und Webseite, damit beide nie
// auseinanderlaufen.
//
// WICHTIG: Diese Texte bilden das neue Schuljahresmodell ab (Jahresvertrag,
// Ratenzahlung, Pausierung bei Zahlungsverzug). Sie wurden nach bestem
// Wissen formuliert, sind aber KEINE Rechtsberatung. Vor dem produktiven
// Einsatz sollten sie einmal anwaltlich oder über einen Dienst wie
// e-recht24 geprüft werden – es geht um wiederkehrende Zahlungen und um
// Verträge zugunsten Minderjähriger.
// =============================================================================

export type Abschnitt = { titel: string; text: string };

/** Paragraf, auf den die Pausierungs-Regel verweist (Abschnitt 6). */
export const AGB_PARAGRAF_ABSAGE = "§ 7";

export const AGB_STAND = "August 2026";

export const AGB_VERTRAG: Abschnitt[] = [
  {
    titel: "§ 1 Geltungsbereich",
    text: "Diese Bedingungen gelten für Nachhilfe- und Kursleistungen von Lerne mit Anna (Kleana Carciu, Kohlbrennerstraße 16, 81929 München) im Rahmen eines Schuljahresvertrags. Vertragspartner ist der bzw. die Erziehungsberechtigte.",
  },
  {
    titel: "§ 2 Zustandekommen des Vertrags",
    text: "Der Vertrag kommt zustande, wenn der oder die Erziehungsberechtigte das übersandte Vertragsangebot über den persönlichen Bestätigungslink annimmt. Mit der Bestätigung werden diese Bedingungen anerkannt.",
  },
  {
    titel: "§ 3 Leistungsumfang und Terminliste",
    text: "Der Unterricht findet zu dem im Vertrag genannten festen Wochentermin statt. Die Anzahl der Termine ergibt sich aus dem Schuljahr abzüglich der bayerischen Schulferien und der gesetzlichen Feiertage; für Schulen mit abweichenden Ferienzeiten gilt deren Ferienkalender. Die konkreten Termine sind in der Terminliste aufgeführt, die dem Vertrag beiliegt.",
  },
  {
    titel: "§ 4 Preise und Zahlung",
    text: "Der Jahresbetrag errechnet sich aus der Anzahl der Termine multipliziert mit dem vereinbarten Stundensatz. Bei zwei Wochenterminen oder einem zweiten Kind gilt für den zweiten Termin bzw. das Geschwisterkind der ermäßigte Satz. Der Jahresbetrag ist wahlweise in monatlichen Raten oder als Einmalzahlung zu entrichten; bei Einmalzahlung wird ein Nachlass von 50,00 € gewährt. Monatsraten sind jeweils vom 1. bis 10. des Monats fällig, letztmalig im Juli. Der Monat August ist zahlungsfrei. Als Kleinunternehmerin im Sinne von § 19 UStG wird keine Umsatzsteuer ausgewiesen.",
  },
  {
    titel: "§ 5 Absage und Nachholen einzelner Stunden",
    text: "Sagt der Schüler mindestens vier Stunden vor Unterrichtsbeginn ab, kann die Stunde kostenlos nachgeholt werden; sie wird als Minus-Stunde vermerkt. Bei einer Absage weniger als vier Stunden vorher verfällt die Stunde. Sagt Lerne mit Anna ab, erhält der Schüler eine kostenlose Nachhol-Stunde. Zusätzlich gebuchte Stunden über den festen Wochentermin hinaus werden gesondert zum vereinbarten Stundensatz abgerechnet.",
  },
  {
    titel: "§ 6 Durchführung des Unterrichts",
    text: "Der Unterricht findet nach Vereinbarung online oder vor Ort (Kohlbrennerstraße 16, 81929 München) statt. Bei Online-Unterricht wird der Zugangslink rechtzeitig bereitgestellt.",
  },
  {
    titel: "§ 7 Zahlungsverzug und Pausierung",
    text: "(1) Die Monatsrate ist vom 1. bis 10. des Monats fällig. (2) Geht die Zahlung bis zum 10. nicht ein, erfolgt eine Erinnerung per E-Mail. (3) Bleibt die Zahlung weitere fünf Tage aus, wird der Vertrag pausiert: Buchungsfunktionen werden gesperrt und der feste Wochentermin ausgesetzt. Eine Pausierung wird per E-Mail mitgeteilt. (4) Termine, die weniger als zwei Tage nach Beginn der Pausierung liegen, finden noch statt; danach entfallen die Termine und gelten als abgesagt. Ein Anspruch auf Nachholen dieser Termine besteht nicht. (5) Nach Zahlungseingang wird der Vertrag unverzüglich fortgesetzt.",
  },
  {
    titel: "§ 8 Laufzeit und Kündigung",
    text: "Der Vertrag läuft bis zum Ende des vereinbarten Schuljahres. Er kann von beiden Seiten mit einer Frist von vier Wochen zum Monatsende gekündigt werden. Bei vorzeitiger Beendigung werden die tatsächlich gehaltenen Einheiten zum vollen Stundensatz abgerechnet; ein bei Einmalzahlung gewährter Nachlass entfällt. Ein sich daraus ergebender Differenzbetrag wird erstattet oder nachgefordert.",
  },
  {
    titel: "§ 9 Haftung",
    text: "Für einen bestimmten Lernerfolg oder bestimmte Noten wird keine Garantie übernommen. Die Haftung ist auf Vorsatz und grobe Fahrlässigkeit beschränkt, soweit gesetzlich zulässig.",
  },
  {
    titel: "§ 10 Schlussbestimmungen",
    text: "Es gilt deutsches Recht. Sollte eine Bestimmung unwirksam sein, bleibt der übrige Vertrag wirksam.",
  },
];

export const WIDERRUF: Abschnitt[] = [
  {
    titel: "Widerrufsrecht",
    text: "Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen. Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag des Vertragsschlusses.",
  },
  {
    titel: "Ausübung des Widerrufsrechts",
    text: "Um Ihr Widerrufsrecht auszuüben, müssen Sie uns (Kleana Carciu, Lerne mit Anna, Kohlbrennerstraße 16, 81929 München, lernemitanna@outlook.com, Telefon +49 176 24700519) mittels einer eindeutigen Erklärung (z. B. per E-Mail oder Brief) über Ihren Entschluss informieren, diesen Vertrag zu widerrufen. Zur Wahrung der Widerrufsfrist reicht es aus, dass Sie die Mitteilung vor Ablauf der Frist absenden.",
  },
  {
    titel: "Folgen des Widerrufs",
    text: "Wenn Sie diesen Vertrag widerrufen, erstatten wir Ihnen alle Zahlungen, die wir von Ihnen erhalten haben, unverzüglich und spätestens binnen vierzehn Tagen ab dem Tag, an dem die Mitteilung über Ihren Widerruf bei uns eingegangen ist. Für diese Rückzahlung verwenden wir dasselbe Zahlungsmittel, das Sie bei der ursprünglichen Zahlung eingesetzt haben, sofern nichts anderes vereinbart wurde; Entgelte werden Ihnen wegen dieser Rückzahlung nicht berechnet.",
  },
  {
    titel: "Vorzeitiger Beginn des Unterrichts",
    text: "Haben Sie verlangt, dass der Unterricht bereits während der Widerrufsfrist beginnt, so haben Sie uns einen angemessenen Betrag zu zahlen, der dem Anteil der bis zum Widerruf bereits erbrachten Unterrichtsstunden im Vergleich zum Gesamtumfang des Vertrags entspricht. Das Widerrufsrecht erlischt bei einer Dienstleistung, wenn der Vertrag von beiden Seiten vollständig erfüllt ist.",
  },
];

/** Die drei Pflicht-Bestätigungen der Bestätigungsseite. */
export const PFLICHT_HAKEN = [
  { id: "agb", text: "Ich habe die AGB gelesen und akzeptiere sie.", link: "/agb-vertrag", linkText: "AGB lesen" },
  { id: "widerruf", text: "Ich habe die Widerrufsbelehrung zur Kenntnis genommen.", link: "/widerruf", linkText: "Widerrufsbelehrung lesen" },
  {
    id: "beginn",
    text: "Ich verlange ausdrücklich, dass der Unterricht bereits vor Ablauf der Widerrufsfrist beginnt. Mir ist bekannt, dass ich bei vollständiger Vertragserfüllung mein Widerrufsrecht verliere und bei einem Widerruf während der laufenden Dienstleistung anteiligen Wertersatz für bereits erbrachte Stunden schulde.",
  },
] as const;
