import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req) {
  try {
    const form = await req.json();
    const {
      name, alter, klasse, schultyp,
      stundenplan,
      schwacheFaecher, lieblingsfach, einfachesFach,
      lernprobleme, lerntyp, adhs, ziel,
      previousNotes
    } = form;

    const istJung = parseInt(alter) <= 12;
    const istTeenager = parseInt(alter) >= 13 && parseInt(alter) <= 15;
    const hatADHS = adhs?.includes("Ja") || adhs?.includes("offiziell");
    const maxBlock = hatADHS ? "15-20" : "25-30";

    const sprache = istJung
      ? "Sehr einfache, kindgerechte Sprache. Kurze klare Sätze. Freundliche Emojis. So wie du mit einem 10-jährigen Kind sprichst."
      : istTeenager
      ? "Jugendgerechte Sprache. Freundlich, direkt, motivierend. Nicht zu kindisch, nicht zu streng."
      : "Klar, respektvoll, auf Augenhöhe. Motivierend und konkret.";

    const stundenplanText = stundenplan?.map(d =>
      `${d.tag}: Schule ${d.schule||"(nicht angegeben)"} | Fächer: ${d.faecher||"(nicht angegeben)"} | Nachmittag: ${d.nachmittag||"frei"} | Hausaufgaben: ${d.hausaufgaben||"keine angegeben"}`
    ).join("\n") || "Kein Stundenplan angegeben";

    const prompt = `Du bist Anna – eine professionelle Nachhilfelehrerin mit jahrelanger Erfahrung. Du erstellst einen SEHR DETAILLIERTEN, individuellen Wochenplan, der ein Kind durch jeden Tag begleitet wie eine echte Lehrerin an seiner Seite.

═══ SCHÜLER-PROFIL ═══
Name: ${name} | Alter: ${alter} Jahre | ${klasse} | ${schultyp||"Schule nicht angegeben"}
ADHS/Konzentration: ${adhs||"Nein"}
Lernprobleme: ${lernprobleme?.join(", ")||"keine angegeben"}
Lerntyp: ${lerntyp||"nicht angegeben"}
Schwache Fächer: ${schwacheFaecher?.join(", ")||"nicht angegeben"}
Einfachstes Fach: ${einfachesFach||"nicht angegeben"}
Lieblingsfach: ${lieblingsfach||"nicht angegeben"}
Ziel: ${ziel||"nicht angegeben"}
${previousNotes ? `\n═══ NOTIZEN AUS LETZTER WOCHE (sehr wichtig – Plan daran anpassen!) ═══\n${previousNotes}\nBerücksichtige diese Notizen: Wenn etwas zu schwer war, plane mehr Zeit. Wenn etwas gut lief, baue darauf auf.` : ""}

═══ STUNDENPLAN DES SCHÜLERS ═══
${stundenplanText}

═══ ANNAS METHODE – IMMER GENAU SO PLANEN ═══

1. NACH SCHULE: Immer 30-45 Min Pause zuerst (Snack, ausruhen, Kopf frei).

2. LERNREIHENFOLGE wenn Hausaufgaben da sind:
   Hausaufgaben ZUERST → einfachstes Fach (Aufwärmen) → schwerstes Fach (Mitte, volle Energie) → Lieblingsfach (Belohnung am Ende)
   Wenn keine Hausaufgaben: einfachstes → schwerstes → Lieblingsfach

3. SCHWACHE FÄCHER: An FAST JEDEM Tag 15-20 Min – auch an vollen Tagen – damit der Schüler im Kontakt mit dem Fach bleibt.

4. NIEMALS einen komplett freien Lern-Nachmittag. Auch an Trainingstagen IMMER mindestens: Hausaufgaben + 15 Min Wiederholung oder Vokabeln. An vollen Tagen die versteckten Lernzeiten nutzen.

5. VOLLE TAGE (Schule lang + Training): Kein langer Block. Stattdessen: Vokabeln/Fremdsprachen beim Abendessen mit Karteikarten + 15-20 Min Wiederholung vor dem Schlafen + versteckte Lernzeiten (Bus/Bahn, Schulpausen).

6. ${hatADHS ? `ADHS-MODUS: Maximal ${maxBlock} Min pro Block, IMMER Bewegungspause danach. Aufgaben in winzige Schritte zerlegen.` : `Lernblöcke ${maxBlock} Min, dann 5-10 Min Pause.`}

7. JEDER LERNBLOCK MUSS DETAILLIERT SEIN – nicht "Mathe lernen", sondern konkrete Mini-Schritte. Beispiel für einen Mathe-Block:
   Schritt 1: Heft aufschlagen, letzte Aufgabe anschauen (2 Min)
   Schritt 2: Die Formel/Methode oben abschreiben (3 Min)
   Schritt 3: Beispielaufgabe gemeinsam mit dem Buch durchgehen (5 Min)
   Schritt 4: Aufgabe 4a und 4b selbst lösen (12 Min)
   Schritt 5: Lösungen vergleichen, Haken setzen (3 Min)

8. FACH-LERNMETHODEN (immer in den Block-Beschreibungen anwenden):
   - Mathe: erst Methode/Lösungsweg verstehen, DANN Aufgaben. Nie umgekehrt.
   - Physik: erst ALLE Formeln + Regeln aufschreiben, dann Aufgaben damit lösen.
   - Chemie: Reaktionsgleichungen + Logik dahinter.
   - Fremdsprachen/Latein: Vokabeln mit Karteikarten, abends beim Essen + vor dem Schlafen wiederholen.
   - Geschichte: Zeitstrahl, Zusammenhänge statt auswendig.
   - Biologie: Skizzen und Diagramme zeichnen.
   - Deutsch: laut lesen, Aufsätze immer erst strukturieren.

9. ABSOLUTES VERBOT: Niemals "Schatz", "Liebling", "Maus", "Kleines" oder andere Kosenamen.

10. SPRACHE: ${sprache}

11. Plan MUSS realistisch zum echten Stundenplan passen. Bei Training bis 19 Uhr keinen Block um 18 Uhr.

═══ AUSGABE ═══
Antworte NUR mit diesem JSON (kein Markdown, kein Text davor/danach). Jeder Lernblock-"beschreibung" MUSS die konkreten Mini-Schritte enthalten (mit \\n getrennt):

{
  "titel": "${name}s persönlicher Lernplan",
  "untertitel": "warmer, motivierender Satz für ${name} – ohne Kosenamen",
  "wusstest_du": "interessanter Lernfakt passend zu einem schwachen Fach",
  "prioritaeten": ["konkrete Priorität 1", "Priorität 2", "Priorität 3"],
  "fach_tipps": [
    {"fach": "Name des schwachen Fachs", "tipp": "konkrete Lernmethode speziell für dieses Fach und diesen Schüler"}
  ],
  "tage": {
    "Mo": [
      {
        "zeit": "14:00",
        "titel": "Pause & Erholen",
        "beschreibung": "30 Minuten für dich: etwas essen, kurz hinlegen oder Musik hören. Dein Kopf braucht die Pause nach der Schule!",
        "typ": "pause",
        "dauer": "30 Min"
      },
      {
        "zeit": "14:30",
        "titel": "Hausaufgaben Mathe",
        "beschreibung": "Schritt 1: Heft und Buch aufschlagen, Aufgabenstellung lesen (2 Min)\\nSchritt 2: Die passende Formel oben auf die Seite schreiben (3 Min)\\nSchritt 3: Das Beispiel im Buch anschauen und verstehen (5 Min)\\nSchritt 4: Aufgabe 1-3 rechnen (12 Min)\\nSchritt 5: Mit Lösungen vergleichen, Haken machen (3 Min)",
        "typ": "fokus",
        "dauer": "25 Min"
      }
    ],
    "Di": [],
    "Mi": [],
    "Do": [],
    "Fr": [],
    "Sa": [],
    "So": []
  },
  "tipps": [
    {"label": "Für ${name}", "text": "persönlicher Tipp basierend auf Lerntyp ${lerntyp} und den Problemen"},
    {"label": "Deine Lernbubble", "text": "konkreter Tipp für die perfekte Lernumgebung dieses Schülers"},
    {"label": "${hatADHS ? 'ADHS & Konzentration' : 'Konzentration'}", "text": "spezifischer Tipp gegen die genannten Lernprobleme"},
    {"label": "Wenn gar nichts geht", "text": "ganz konkreter erster Mini-Schritt"}
  ],
  "regeln": [
    "kurze motivierende Regel direkt an ${name}",
    "Regel 2",
    "Regel 3",
    "Regel 4"
  ]
}

WICHTIG: Plane ALLE 7 Tage. Jeder Tag mehrere detaillierte Blöcke. Jeder Fokus-Block mit konkreten Mini-Schritten in der Beschreibung.`;

    const response = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 4000,
      temperature: 0.6,
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.content[0].text;
    const clean = text.replace(/```json|```/g, "").trim();

    let plan;
    try {
      plan = JSON.parse(clean);
    } catch {
      plan = buildFallback(name, hatADHS, schwacheFaecher);
    }
    if (!plan.tage || Object.keys(plan.tage).length < 5) {
      plan = buildFallback(name, hatADHS, schwacheFaecher);
    }
    return Response.json(plan);
  } catch (err) {
    console.error("Lernplan API Fehler:", err);
    return Response.json({ error: "Fehler beim Erstellen" }, { status: 500 });
  }
}

function buildFallback(name, hatADHS, faecher) {
  const fach = faecher?.[0] || "dein schweres Fach";
  const block = hatADHS ? "20 Min" : "25 Min";
  const haBlock = {
    zeit:"14:30", titel:"Hausaufgaben erledigen",
    beschreibung:`Schritt 1: Alle Hefte und Bücher rausholen (2 Min)\nSchritt 2: Aufschreiben welche Hausaufgaben es gibt (2 Min)\nSchritt 3: Mit der einfachsten Aufgabe anfangen (10 Min)\nSchritt 4: Schwierigere Aufgaben (10 Min)\nSchritt 5: Alles durchschauen, Haken machen (1 Min)`,
    typ:"fokus", dauer:block
  };
  return {
    titel: `${name}s persönlicher Lernplan`,
    untertitel: `Dein Plan begleitet dich durch jeden Tag – Schritt für Schritt!`,
    wusstest_du: "Wusstest du dass dein Gehirn im Schlaf das Gelernte abspeichert? Deshalb hilft Wiederholen direkt vor dem Schlafen so gut!",
    prioritaeten: [`${fach} jeden Tag üben`, "Hausaufgaben immer zuerst", "Pausen einhalten"],
    fach_tipps: [
      {fach:"Mathematik", tipp:"Erst die Methode und den Lösungsweg verstehen – dann erst Aufgaben rechnen. Nie umgekehrt!"},
      {fach:"Fremdsprachen", tipp:"Vokabeln auf Karteikarten schreiben und abends beim Essen lernen – das geht ganz nebenbei."}
    ],
    tage: {
      Mo:[{zeit:"14:00",titel:"Pause & Erholen",beschreibung:"30 Minuten Pause: etwas essen, ausruhen, Kopf frei machen nach der Schule.",typ:"pause",dauer:"30 Min"},haBlock,{zeit:"15:00",titel:`${fach} üben`,beschreibung:`Schritt 1: Heft aufschlagen (1 Min)\nSchritt 2: Letzte Übung anschauen (4 Min)\nSchritt 3: Eine neue Aufgabe lösen (12 Min)\nSchritt 4: Kontrollieren (3 Min)`,typ:"fokus",dauer:block}],
      Di:[{zeit:"14:00",titel:"Pause",beschreibung:"30 Min erholen nach der Schule.",typ:"pause",dauer:"30 Min"},haBlock,{zeit:"15:10",titel:`${fach} kurz üben`,beschreibung:`15 Minuten ${fach}: eine kleine Aufgabe – damit du im Kontakt mit dem Fach bleibst.`,typ:"fokus",dauer:"15 Min"}],
      Mi:[{zeit:"14:00",titel:"Pause",beschreibung:"30 Min Pause.",typ:"pause",dauer:"30 Min"},haBlock,{zeit:"20:00",titel:"Wiederholung vor dem Schlafen",beschreibung:"20 Minuten: das Wichtigste vom Tag nochmal durchgehen – so bleibt es im Kopf.",typ:"fokus",dauer:"20 Min"}],
      Do:[{zeit:"14:00",titel:"Pause",beschreibung:"30 Min erholen.",typ:"pause",dauer:"30 Min"},haBlock,{zeit:"15:00",titel:`${fach} üben`,beschreibung:`Schritt 1: Aufgabe vom Montag wiederholen (5 Min)\nSchritt 2: Neue Aufgabe lösen (12 Min)\nSchritt 3: Kontrollieren (3 Min)`,typ:"fokus",dauer:block}],
      Fr:[{zeit:"14:00",titel:"Pause",beschreibung:"30 Min Pause.",typ:"pause",dauer:"30 Min"},{zeit:"14:30",titel:"Wochenrückblick",beschreibung:`Schritt 1: Was lief diese Woche gut? Aufschreiben (5 Min)\nSchritt 2: Was war schwer? (5 Min)\nSchritt 3: Hausaufgaben fürs Wochenende anschauen (5 Min)`,typ:"fokus",dauer:"15 Min"}],
      Sa:[{zeit:"10:00",titel:"Wochenend-Übung",beschreibung:`20 Minuten ${fach}: in Ruhe eine Aufgabe – ohne Stress.`,typ:"fokus",dauer:"20 Min"}],
      So:[{zeit:"18:00",titel:"Woche vorbereiten",beschreibung:`Schritt 1: Schultasche für Montag packen (5 Min)\nSchritt 2: Was kommt diese Woche? Anschauen (5 Min)`,typ:"fokus",dauer:"10 Min"},{zeit:"20:00",titel:"Wiederholung",beschreibung:"20 Min: das Schwierigste der Woche nochmal anschauen.",typ:"fokus",dauer:"20 Min"}]
    },
    tipps: [
      {label:`Für ${name}`,text:"Fang immer mit der kleinsten Aufgabe an. Nicht das ganze Kapitel – nur eine Aufgabe. Der Anfang ist das Schwerste."},
      {label:"Deine Lernbubble",text:"Handy in ein anderes Zimmer. Wasser bereitstellen. Schreibtisch aufräumen. Jetzt gehört die Zeit nur dir."},
      {label:"Konzentration",text:"Timer auf 25 Minuten stellen. Nur diese 25 Minuten zählen. Danach gibt es eine echte Pause."},
      {label:"Wenn gar nichts geht",text:"Zähl bis 3 und öffne einfach das Heft. Nur aufschlagen – mehr musst du nicht. Der Rest kommt von alleine."}
    ],
    regeln: [
      `${name}, du musst nicht perfekt sein – du musst nur anfangen!`,
      "Jeder kleine Schritt zählt. Auch 15 Minuten sind ein Erfolg.",
      "Pausen sind kein Versagen – sie machen dich stärker.",
      "Du schaffst mehr als du denkst!"
    ]
  };
}