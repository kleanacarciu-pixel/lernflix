// =============================================================================
// DIE AGB – EINZIGE QUELLE
//
// Dieser Wortlaut wurde sorgfältig erarbeitet und ist wortgleich zu übernehmen.
// Er wird an JEDER Stelle benutzt, an der das System AGB zeigt oder anhängt:
// die AGB-Seite im Portal, der Download beim Unterzeichnen und der PDF-Anhang
// der Bestätigungs-E-Mail.
//
// Änderungen passieren AUSSCHLIESSLICH hier. Wer den Text an einer anderen
// Stelle noch einmal hinschreibt, sorgt dafür, dass zwei Fassungen im Umlauf
// sind – und die falsche landet irgendwann in einem Vertrag.
//
// Aufbau: schlichtes Markdown, das lib/agb-kern.ts liest.
//   #  große Überschrift (Anlagen)      ##  Paragraf
//   ### Unterüberschrift                 >   eingerückter Wortlaut
//   ---  Trennlinie                      *kursiv*   **fett**
//
// Bewusst ohne Importe – der Wortlaut bleibt so ohne Datenbank prüfbar.
// =============================================================================

/** Stand laut Dokument – steht auf der Seite und in der PDF. */
export const AGB_STAND = "21. August 2026";

export const AGB_TITEL = "Allgemeine Geschäftsbedingungen (AGB)";

export const AGB_UNTERZEILE = "für Nachhilfeleistungen von „Lerne mit Anna“";

export const AGB_MARKDOWN = String.raw`
Anbieterin:
Kleana Carciu – Lerne mit Anna
Kohlbrennerstraße 16
81929 München
Telefon: +49 (0)176 24700519
E-Mail: lernemitanna@outlook.com
Es wird keine Umsatzsteuer ausgewiesen (Kleinunternehmerregelung gemäß § 19 UStG).

Stand: 21. August 2026

---

## § 1 Geltungsbereich und Vertragspartner

(1) Diese AGB gelten für alle Verträge über Nachhilfeleistungen zwischen der Anbieterin und dem Auftraggeber.

(2) Auftraggeber ist ausschließlich der oder die gesetzliche(n) Vertreter des teilnehmenden Kindes (nachfolgend „Eltern“). Ein Vertragsschluss mit minderjährigen Schülerinnen und Schülern kommt nicht zustande.

(3) Abweichende Bedingungen des Auftraggebers werden nicht Vertragsbestandteil, es sei denn, die Anbieterin stimmt ihrer Geltung ausdrücklich in Textform zu.

## § 2 Vertragsschluss

(1) Die Darstellung der Leistungen auf der Website und im Buchungssystem stellt kein bindendes Angebot dar.

(2) Nach der Probestunde (§ 4) und der Festlegung des festen Wochentermins übermittelt die Anbieterin dem Auftraggeber die Vertragsunterlagen: den ausgefüllten Nachhilfevertrag, diese AGB einschließlich Widerrufsbelehrung sowie die Terminliste (§ 5 Abs. 2).

(3) Der Vertrag kommt durch Zugang des vom Auftraggeber unterzeichneten Nachhilfevertrags bei der Anbieterin zustande. Die Übermittlung einer digital unterzeichneten Fassung oder einer Fotografie bzw. eines Scans des unterzeichneten Vertrags (z. B. per E-Mail oder Messenger) genügt. Gleichgestellt ist die elektronische Unterzeichnung im Buchungssystem der Anbieterin: Der Vertrag kommt in diesem Fall mit Abschluss des dortigen Unterzeichnungsvorgangs zustande; der Auftraggeber erhält die unterzeichnete Vertragsfassung im Anschluss in Textform.

(4) Der Auftraggeber erhält den Vertragsinhalt einschließlich dieser AGB und der Terminliste dauerhaft in Textform. Das Nutzerkonto wird erst nach Vertragsschluss zur Buchung von Terminen freigeschaltet.

## § 3 Leistungsumfang

(1) Die Anbieterin erbringt Nachhilfeunterricht in den Fächern Mathematik und Physik als Einzelunterricht oder als Gruppenunterricht (ab zwei Schülern). Die Unterrichtsform ergibt sich aus dem Nachhilfevertrag. Eine Unterrichtseinheit dauert 60 Minuten und findet online oder in den Räumen der Anbieterin statt.

(2) Das Unterrichtsformat (online oder vor Ort) kann von beiden Seiten flexibel gewechselt werden – auch für einzelne Termine. Der Wechsel ist der jeweils anderen Seite rechtzeitig, spätestens jedoch vier (4) Stunden vor Terminbeginn, in Textform oder über das Buchungssystem mitzuteilen. Ohne Mitteilung gilt das zuletzt praktizierte Format.

(3) Dem Schüler wird mindestens ein fester wöchentlicher Termin zugewiesen. Dieser wird für die Dauer des Vertragsverhältnisses freigehalten und nicht anderweitig vergeben.

(4) Die Anbieterin schuldet eine fachlich sorgfältige Unterrichtsleistung, jedoch keinen bestimmten Lernerfolg, keine bestimmte Note und kein Bestehen einer Prüfung.

(5) Unterrichtsfrei sind die Ferienzeiten der Schule, die der Schüler besucht, sowie die gesetzlichen Feiertage in Bayern. Für Schüler bayerischer Schulen sind dies die bayerischen Schulferien einschließlich des Buß- und Bettags; für Schüler von Schulen mit abweichenden Ferienzeiten (insbesondere internationale Schulen) gelten die veröffentlichten Ferienzeiten der jeweiligen Schule. Die maßgeblichen unterrichtsfreien Zeiten sind in der Terminliste (§ 5 Abs. 2) berücksichtigt und im Schuljahresbetrag (§ 6) nicht enthalten.

(6) Sagt die Anbieterin einzelne Termine wegen eigener Abwesenheit ab, gilt § 5 Abs. 9.

(7) Auf Wunsch der Eltern kann in den Ferien nach Verfügbarkeit der Anbieterin Online-Unterricht stattfinden, insbesondere zur Prüfungsvorbereitung. Ein Anspruch hierauf besteht nicht. Solche Termine werden, sofern nichts anderes vereinbart wird, als Nachholtermine für offene Minusstunden (§ 5 Abs. 5) durchgeführt.

## § 4 Probestunde

(1) Vor Vertragsschluss kann eine einmalige Probestunde in Anspruch genommen werden.

(2) Die Probestunde ist kostenfrei und begründet keine Verpflichtung zur Fortsetzung der Nachhilfe.

## § 5 Vertragslaufzeit, Terminliste, Absagen und Stundenkonto

(1) Der Vertrag wird für das jeweilige Schuljahr geschlossen. Das Vertragsjahr für das Schuljahr 2026/27 läuft vom 1. September 2026 bis zum 31. Juli 2027. Bei Vertragsbeginn während des laufenden Schuljahres beginnt der Vertrag zum Monatsersten und endet ebenfalls zum 31. Juli.

(2) **Terminliste:** Dem Vertrag wird eine Terminliste beigefügt, die sämtliche Unterrichtstermine des gewählten Wochentags im Vertragszeitraum ausweist (unter Ausschluss der Zeiten nach § 3 Abs. 5). Diese Terminliste ist verbindliche Grundlage für den Schuljahresbetrag nach § 6.

(3) **Absage oder Verschiebung mindestens vier (4) Stunden vor Terminbeginn:** Die Unterrichtseinheit gilt nicht als in Anspruch genommen. Sie wird dem Stundenkonto als Minusstunde gutgeschrieben und kann nachgeholt werden.

(4) **Absage weniger als vier (4) Stunden vor Terminbeginn sowie Nichterscheinen:** Die Unterrichtseinheit gilt als erbracht. Der Vergütungsanspruch bleibt gemäß § 615 BGB bestehen, da die Anbieterin die vereinbarte Zeit vorgehalten hat und kurzfristig nicht anderweitig vergeben kann. Ein Anspruch auf Nachholung besteht nicht.

(5) **Nachholtermine:** Offene Minusstunden können durch Buchung eines freien Termins im Buchungssystem nachgeholt werden. Ein Anspruch auf einen bestimmten Termin besteht nicht; maßgeblich ist die freigegebene Verfügbarkeit.

(6) **Plusstunden:** Über die Terminliste hinaus können zusätzliche Termine gebucht werden, soweit freie Verfügbarkeit besteht; eine zahlenmäßige Begrenzung besteht nicht. Buchungen freier Termine werden zunächst mit offenen Minusstunden verrechnet; darüber hinausgehende Termine gelten als Plusstunden und werden gemäß § 7 Abs. 3 zusätzlich vergütet.

(7) Minusstunden verfallen während der Vertragslaufzeit nicht. Eine Auszahlung oder Verrechnung von Minusstunden in Geld erfolgt nicht; der Ausgleich erfolgt ausschließlich durch Nachholtermine. Bei Vertragsende nicht nachgeholte Minusstunden werden im Rahmen der Endabrechnung nach § 8 Abs. 3 berücksichtigt.

(8) **Obergrenze:** Es können höchstens vier (4) Minusstunden gleichzeitig offen sein. Ist diese Obergrenze erreicht, führt eine weitere Absage – auch bei Absage mehr als vier Stunden vor Terminbeginn – nicht zu einer weiteren Gutschrift; die Unterrichtseinheit gilt in diesem Fall als erbracht (Absatz 4 gilt entsprechend). Die Buchung von Nachholterminen zum Abbau offener Minusstunden bleibt jederzeit möglich. Der feste Wochentermin bleibt unberührt.

(9) **Ausfall auf Seiten der Anbieterin:** Sagt die Anbieterin einen Termin ab, wird die Einheit dem Stundenkonto gutgeschrieben und kann uneingeschränkt nachgeholt werden; sie gilt für die Endabrechnung nach § 8 Abs. 3 nicht als gehalten, solange sie nicht nachgeholt wurde.

(10) **Wechsel des Wochentermins** ist jederzeit möglich, sofern der gewünschte neue Termin verfügbar ist. Der Schuljahresbetrag wird ab dem Wechsel neu berechnet: bereits stattgefundene Termine des bisherigen Wochentags zuzüglich der verbleibenden Termine des neuen Wochentags, jeweils zum vereinbarten Stundensatz. Die Anbieterin teilt den angepassten Schuljahresbetrag und die angepassten verbleibenden Monatsraten vor dem Wechsel in Textform mit.

## § 6 Vergütung

(1) Der Schuljahresbetrag berechnet sich aus der Anzahl der Unterrichtstermine gemäß Terminliste (§ 5 Abs. 2), multipliziert mit dem vereinbarten Stundensatz. Der Stundensatz ergibt sich aus dem Nachhilfevertrag.

(2) **Familienpreis:** Bestehen für dieselbe Familie zwei oder mehr feste Wochentermine – sei es durch einen zweiten Termin desselben Schülers oder durch Termine weiterer Kinder –, gilt für sämtliche Termine der Familie ein um 5 € reduzierter Stundensatz. Endet einer der Termine, sodass nur noch ein Wochentermin verbleibt, gilt ab dem Folgemonat wieder der reguläre Stundensatz; die Anbieterin teilt den angepassten Betrag zuvor in Textform mit.

(3) Beim Gruppenunterricht gilt der vereinbarte Stundensatz je teilnehmendem Schüler. Sinkt die Gruppengröße dauerhaft unter zwei Schüler, wird der Unterricht ab dem Folgemonat als Einzelunterricht zum Einzelunterrichts-Stundensatz laut aktueller Preisübersicht fortgeführt; die Anbieterin teilt den angepassten Betrag zuvor in Textform mit. Dem verbleibenden Auftraggeber steht in diesem Fall ein Sonderkündigungsrecht mit einer Frist von zwei Wochen zum Monatsende zu.

(4) Bei Vertragsbeginn während des laufenden Schuljahres umfasst die Terminliste nur die verbleibenden Termine bis zum 31. Juli; der Schuljahresbetrag reduziert sich entsprechend.

(5) Es wird keine Umsatzsteuer ausgewiesen (Kleinunternehmerregelung gemäß § 19 UStG).

## § 7 Zahlung

(1) Der Schuljahresbetrag ist nach Wahl der Eltern zu zahlen:

a) **in elf gleichen Monatsraten** (Schuljahresbetrag geteilt durch elf), fällig jeweils vom 1. bis zum 10. des Monats, von September bis Juli. Im August ist keine Rate zu zahlen. Bei Vertragsbeginn während des Schuljahres verteilt sich der reduzierte Betrag auf die verbleibenden Monate bis Juli; oder

b) **als Einmalzahlung** des gesamten Schuljahresbetrags abzüglich eines Nachlasses von 50 €, fällig binnen 14 Tagen nach Vertragsschluss.

(2) Die Zahlung erfolgt per Überweisung auf das in der Bestätigungs-E-Mail genannte Konto. Zur Vereinfachung wird die Einrichtung eines Dauerauftrags empfohlen.

(3) **Plusstunden** (§ 5 Abs. 6) werden mit dem vereinbarten Stundensatz vergütet und am Ende des Schuljahres gesammelt abgerechnet; der Rechnungsbetrag ist binnen 14 Tagen fällig. Ab fünf offenen Plusstunden ist die Anbieterin berechtigt, eine Zwischenabrechnung zu stellen. Bei vorzeitiger Vertragsbeendigung werden offene Plusstunden in der Endabrechnung nach § 8 Abs. 3 berücksichtigt.

(4) Befindet sich der Auftraggeber mit einer Rate ganz oder teilweise in Verzug, ist die Anbieterin berechtigt, die Buchungsfunktionen des Nutzerkontos bis zum Zahlungseingang auszusetzen. Termine des festen Wochentermins, die während des Verzugs nicht wahrgenommen werden, gelten als abgesagt im Sinne von § 5 Abs. 4. Das Recht zur außerordentlichen Kündigung nach § 8 Abs. 4 bleibt unberührt.

## § 8 Kündigung und Endabrechnung

(1) Beide Parteien können den Vertrag mit einer Frist von vier (4) Wochen zum Monatsende kündigen. Die Kündigung bedarf der Textform (E-Mail genügt). Kunden können den Vertrag zudem über die Kündigungsschaltfläche unter termine.lernemitanna.de kündigen.

(2) Ohne Kündigung endet der Vertrag mit Ablauf des 31. Juli. Eine Fortsetzung für das folgende Schuljahr bedarf einer neuen Vereinbarung nach § 2; die Anbieterin unterbreitet Bestandskunden hierzu rechtzeitig ein Angebot.

(3) **Endabrechnung bei vorzeitiger Beendigung:** Es wird abgerechnet, welche Unterrichtseinheiten bis zum Vertragsende tatsächlich gehalten wurden oder nach § 5 Abs. 4 als gehalten gelten – einschließlich gehaltener Plusstunden (§ 5 Abs. 6). Diese werden mit dem vereinbarten vollen Stundensatz (ohne den Nachlass nach § 7 Abs. 1 b), der nur bei vollständiger Vertragsdurchführung gewährt wird) multipliziert. Ein darüber hinaus gezahlter Betrag wird binnen 14 Tagen erstattet; ein etwaiger Fehlbetrag ist binnen 14 Tagen nachzuzahlen. Die Anbieterin bietet vor Vertragsende im Rahmen ihrer Verfügbarkeit Nachholtermine für offene Minusstunden an.

(4) Das Recht zur außerordentlichen Kündigung aus wichtigem Grund bleibt für beide Seiten unberührt. Ein wichtiger Grund liegt für die Anbieterin insbesondere vor bei Zahlungsverzug von mehr als 14 Tagen trotz Mahnung oder bei einem Verhalten, das die Durchführung des Unterrichts nachhaltig unmöglich macht.

## § 9 Widerrufsrecht

Verbrauchern steht ein gesetzliches Widerrufsrecht zu. Die vollständige Widerrufsbelehrung und das Muster-Widerrufsformular sind diesen AGB als Anlage beigefügt und werden zusätzlich in der Bestätigungs-E-Mail übermittelt.

## § 10 Haftung

(1) Die Anbieterin haftet unbeschränkt für Schäden aus der Verletzung des Lebens, des Körpers oder der Gesundheit sowie für Vorsatz und grobe Fahrlässigkeit.

(2) Bei einfacher Fahrlässigkeit haftet die Anbieterin nur bei Verletzung einer wesentlichen Vertragspflicht, deren Erfüllung die ordnungsgemäße Durchführung des Vertrages überhaupt erst ermöglicht und auf deren Einhaltung der Auftraggeber regelmäßig vertrauen darf; in diesem Fall ist die Haftung auf den vertragstypischen, vorhersehbaren Schaden begrenzt.

(3) Eine weitergehende Haftung ist ausgeschlossen.

(4) Bei Präsenzunterricht beginnt und endet die Aufsichtspflicht der Anbieterin mit der Unterrichtseinheit. Für den Hin- und Rückweg tragen die Eltern die Verantwortung.

## § 11 Datenschutz

Die Verarbeitung personenbezogener Daten erfolgt ausschließlich zur Vertragsdurchführung. Einzelheiten regelt die Datenschutzerklärung unter lernemitanna.de/datenschutz.

## § 12 Änderungen dieser AGB

Änderungen dieser AGB werden dem Auftraggeber mindestens sechs (6) Wochen vor ihrem Inkrafttreten in Textform mitgeteilt. Widerspricht der Auftraggeber nicht bis zum Inkrafttreten, gelten die Änderungen als angenommen; auf diese Folge wird in der Mitteilung gesondert hingewiesen. Im Falle des Widerspruchs steht beiden Parteien ein Sonderkündigungsrecht zum Zeitpunkt des Inkrafttretens zu.

## § 13 Schlussbestimmungen

(1) Es gilt deutsches Recht.

(2) Die Anbieterin ist zur Teilnahme an einem Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle weder bereit noch verpflichtet.

---

# Anlage 1: Widerrufsbelehrung

### Widerrufsrecht

Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen. Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag des Vertragsabschlusses.

Um Ihr Widerrufsrecht auszuüben, müssen Sie uns

Kleana Carciu, Kohlbrennerstraße 16, 81929 München, lernemitanna@outlook.com

mittels einer eindeutigen Erklärung (z. B. ein mit der Post versandter Brief oder eine E-Mail) über Ihren Entschluss, diesen Vertrag zu widerrufen, informieren. Sie können dafür das beigefügte Muster-Widerrufsformular verwenden, das jedoch nicht vorgeschrieben ist.

Zur Wahrung der Widerrufsfrist reicht es aus, dass Sie die Mitteilung über die Ausübung des Widerrufsrechts vor Ablauf der Widerrufsfrist absenden.

### Folgen des Widerrufs

Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen erhalten haben, unverzüglich und spätestens binnen vierzehn Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung über Ihren Widerruf dieses Vertrags bei uns eingegangen ist. Für diese Rückzahlung verwenden wir dasselbe Zahlungsmittel, das Sie bei der ursprünglichen Transaktion eingesetzt haben, es sei denn, mit Ihnen wurde ausdrücklich etwas anderes vereinbart; in keinem Fall werden Ihnen wegen dieser Rückzahlung Entgelte berechnet.

Haben Sie verlangt, dass die Dienstleistung während der Widerrufsfrist beginnen soll, so haben Sie uns einen angemessenen Betrag zu zahlen, der dem Anteil der bis zu dem Zeitpunkt, zu dem Sie uns von der Ausübung des Widerrufsrechts hinsichtlich dieses Vertrags unterrichten, bereits erbrachten Dienstleistungen im Vergleich zum Gesamtumfang der im Vertrag vorgesehenen Dienstleistungen entspricht.

### Vorzeitiger Beginn der Dienstleistung

Soll der Unterricht bereits vor Ablauf der Widerrufsfrist beginnen, ist hierfür Ihr ausdrückliches Verlangen erforderlich. Dieses erklären Sie im Nachhilfevertrag durch Ankreuzen des entsprechenden Feldes:

> „Ich verlange ausdrücklich, dass der Unterricht bereits vor Ablauf der Widerrufsfrist beginnt. Mir ist bekannt, dass ich bei vollständiger Vertragserfüllung durch die Anbieterin mein Widerrufsrecht verliere und bei einem Widerruf während der laufenden Dienstleistung anteiligen Wertersatz für die bereits erbrachten Stunden schulde.“

---

# Anlage 2: Muster-Widerrufsformular

*(Wenn Sie den Vertrag widerrufen wollen, füllen Sie bitte dieses Formular aus und senden Sie es zurück.)*

An Kleana Carciu, Kohlbrennerstraße 16, 81929 München, lernemitanna@outlook.com:

Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag über die Erbringung der folgenden Dienstleistung:

_______________________________________________

Bestellt am / Vertragsschluss am: _____________

Name des/der Verbraucher(s): _________________

Anschrift des/der Verbraucher(s): _____________

Unterschrift (nur bei Mitteilung auf Papier): _____________

Datum: _____________

(*) Unzutreffendes streichen.

---

# Anlage 3: Terminliste

*(Wird je Vertrag individuell beigefügt: alle Unterrichtstermine des gewählten Wochentags im Vertragszeitraum.)*
`.trim();
