import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req) {
  try {
    const form = await req.json();
    const {
      name, alter, klasse, schultyp, schulende, nachmittag,
      faecher, lernprobleme, lerntyp, ziel, wochenbeschreibung,
      adhs, previousNotes
    } = form;

    const istJung = parseInt(alter) <= 12;
    const istTeenager = parseInt(alter) >= 13 && parseInt(alter) <= 15;
    const hatADHS = adhs?.includes("Ja");
    const maxBlock = hatADHS ? "15-20 Minuten" : "25 Minuten";

    const sprache = istJung
      ? "Sehr einfache Sprache. Kurze Sätze. Viele Emojis. Wie du mit einem 10-jährigen Kind reden würdest."
      : istTeenager
      ? "Normale Jugendsprache. Freundlich und verständlich. Nicht zu kindisch, nicht zu formal."
      : "Klar und respektvoll. Auf Augenhöhe.";

    const prompt = `Du bist Anna, eine erfahrene Nachhilfelehrerin. Erstelle einen realistischen, detaillierten Wochenplan.

SCHÜLER:
Name: ${name} | Alter: ${alter} Jahre | ${klasse} | Schultyp: ${schultyp || "nicht angegeben"}
Schulende: ${schulende || "nicht angegeben"}
Nachmittags-Aktivitäten: ${nachmittag || "keine"}
Schwere Fächer: ${faecher?.join(", ") || "nicht angegeben"}
Lernprobleme: ${lernprobleme?.join(", ") || "keine"}
Lerntyp: ${lerntyp || "nicht angegeben"}
Ziel: ${ziel || "nicht angegeben"}
So sieht meine Woche aus: ${wochenbeschreibung || "nicht angegeben"}
ADHS: ${adhs || "Nein"}
${previousNotes ? `Notizen aus letzter Woche: ${previousNotes}` : ""}

SPRACHE: ${sprache}

WICHTIGE PLANUNGS-REGELN:
1. Berücksichtige die Schulzeiten – plane NACH dem Schulende
2. Berücksichtige Training, Nachhilfe und andere Nachmittags-Aktivitäten
3. Plane REALISTISCHE Zeiten – kein Kind lernt 3 Stunden am Stück
4. ${hatADHS ? "ADHS: maximal " + maxBlock + " pro Block, IMMER Bewegungspause danach" : "Lernblöcke: maximal 25 Minuten, dann 5-10 Min Pause"}
5. Hausaufgaben ZUERST – dann Lernblöcke für schwache Fächer
6. Mittwoch oder Freitag = leichterer Tag oder freier Nachmittag
7. Wochenende: kurze Wiederholung, kein Stress
8. Konkrete Aufgaben – nicht "Mathe lernen" sondern "Mathe Hausaufgaben + 1 Übungsaufgabe"
9. NIEMALS "Schatz" oder "Liebling" verwenden
10. Pausen mit konkreter Aktivität: "10 Min spazieren", "Snack holen", "Strecken"

Antworte NUR mit JSON (kein Markdown):
{
  "titel": "${name}s Lernplan",
  "untertitel": "motivierender Satz für ${name} – warm aber ohne Kosenamen",
  "prioritaeten": ["konkrete Priorität 1", "Priorität 2", "Priorität 3"],
  "wusstest_du": "Wusstest du dass [interessanter Fakt zu einem schwachen Fach]?",
  "tage": {
    "Mo": [
      {"zeit": "14:00", "titel": "Hausaufgaben Mathe", "beschreibung": "Seite 47 fertig machen – dann bist du frei!", "typ": "fokus", "dauer": "25 Min"},
      {"zeit": "14:30", "titel": "Bewegungspause", "beschreibung": "Kurz rausgehen oder strecken – Kopf frei machen!", "typ": "pause", "dauer": "10 Min"},
      {"zeit": "14:45", "titel": "Deutsch Vokabeln", "beschreibung": "10 Vokabeln mit Karteikarten – du schaffst das!", "typ": "fokus", "dauer": "20 Min"}
    ],
    "Di": [...],
    "Mi": [...],
    "Do": [...],
    "Fr": [...],
    "Sa": [...],
    "So": [...]
  },
  "tipps": [
    {"label": "Für ${name}", "text": "persönlicher Tipp basierend auf Lerntyp und Problemen"},
    {"label": "Lernbubble", "text": "konkreter Tipp für perfekte Lernumgebung"},
    {"label": "${hatADHS ? "Konzentration" : "Fokus"}", "text": "spezifischer Tipp"},
    {"label": "Wenn gar nichts geht", "text": "erster kleiner Schritt – sehr konkret"}
  ],
  "regeln": [
    "kurze motivierende Regel 1",
    "Regel 2",
    "Regel 3",
    "${name} direkt ansprechen in Regel 4"
  ]
}`;

    const response = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 2000,
      temperature: 0.7,
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.content[0].text;
    const clean = text.replace(/```json|```/g, "").trim();

    let plan;
    try {
      plan = JSON.parse(clean);
    } catch {
      plan = buildFallback(name, alter, hatADHS, faecher);
    }

    if (!plan.tage || Object.keys(plan.tage).length < 3) {
      plan = buildFallback(name, alter, hatADHS, faecher);
    }

    return Response.json(plan);
  } catch (err) {
    console.error("Lernplan API Fehler:", err);
    return Response.json({ error: "Fehler beim Erstellen" }, { status: 500 });
  }
}

function buildFallback(name, alter, hatADHS, faecher) {
  const fach = faecher?.[0] || "das schwere Fach";
  const block = hatADHS ? "15 Min" : "25 Min";
  return {
    titel: `${name}s Lernplan`,
    untertitel: `Dein persönlicher Plan – Schritt für Schritt zum Ziel!`,
    prioritaeten: [`${fach} meistern`, "Jeden Tag etwas tun", "Pausen nicht vergessen"],
    wusstest_du: "Wusstest du dass dein Gehirn beim Lernen neue Verbindungen baut – wie Muskeln beim Sport? Übung macht den Meister!",
    tage: {
      Mo: [
        {zeit:"14:30",titel:"Hausaufgaben erledigen",beschreibung:"Alle Aufgaben fertig machen – dann ist der Kopf frei!",typ:"fokus",dauer:block},
        {zeit:"15:00",titel:"Pause",beschreibung:"Kurz bewegen, Snack holen, frische Luft schnappen!",typ:"pause",dauer:"10 Min"},
        {zeit:"15:15",titel:`${fach} üben`,beschreibung:"Eine Aufgabe aufschlagen und loslegen – nur eine!",typ:"fokus",dauer:block},
      ],
      Di: [{zeit:"14:30",titel:"Hausaufgaben",beschreibung:"Zuerst erledigen, dann frei!",typ:"fokus",dauer:block},{zeit:"15:00",titel:"Pause",beschreibung:"10 Minuten erholen",typ:"pause",dauer:"10 Min"}],
      Mi: [{zeit:"15:00",titel:"Freier Nachmittag",beschreibung:"Heute Pause – du hast es dir verdient!",typ:"aktiv",dauer:"frei"}],
      Do: [{zeit:"14:30",titel:"Hausaufgaben",beschreibung:"Alles erledigen was noch offen ist",typ:"fokus",dauer:block},{zeit:"15:00",titel:`${fach} wiederholen`,beschreibung:"Vom Montag nochmal anschauen – so bleibt es im Gedächtnis!",typ:"fokus",dauer:block}],
      Fr: [{zeit:"14:30",titel:"Wochenabschluss",beschreibung:"Was war diese Woche gut? Was nächste Woche besser machen?",typ:"aktiv",dauer:"15 Min"}],
      Sa: [{zeit:"11:00",titel:"Kurze Wiederholung",beschreibung:"15 Minuten das Schwierigste nochmal anschauen – mehr nicht!",typ:"fokus",dauer:"15 Min"}],
      So: [{zeit:"19:00",titel:"Plan für Montag",beschreibung:"5 Minuten: Was kommt morgen? Was brauche ich?",typ:"aktiv",dauer:"5 Min"}],
    },
    tipps: [
      {label:"Wichtigster Tipp",text:"Fang mit der kleinsten Aufgabe an. Nicht das ganze Kapitel – nur eine Aufgabe. Der Anfang ist immer das Schwerste."},
      {label:"Deine Lernbubble",text:"Handy in ein anderes Zimmer. Lieblingsgetränk bereit. Kopfhörer auf. Jetzt gehört die Zeit dir."},
      {label:"Fokus",text:"Timer auf 25 Minuten stellen. Nur diese 25 Minuten zählen. Dann Pause – versprochen!"},
      {label:"Wenn gar nichts geht",text:"Zähl bis 3 und öffne einfach das Heft. Nur aufschlagen – mehr nicht. Der Rest kommt von alleine."},
    ],
    regeln: [
      "Du musst nicht perfekt sein – du musst nur anfangen!",
      "Jeder kleine Schritt zählt. Auch 15 Minuten sind ein Erfolg.",
      "Pausen sind kein Versagen – sie machen dich stärker.",
      `${name}, du schaffst mehr als du denkst!`,
    ],
  };
}