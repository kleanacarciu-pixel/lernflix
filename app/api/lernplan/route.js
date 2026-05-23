import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req) {
  try {
    const form = await req.json();
    const { name, alter, klasse, faecher, probleme, lerntyp, blockade,
            ziel, zuhause, naechstePruefung, schlaf, wasFunktioniert,
            zeit, adhs, stunden } = form;

    const istJung     = parseInt(alter) <= 12;
    const istTeenager = parseInt(alter) >= 13 && parseInt(alter) <= 15;
    const hatADHS     = adhs?.includes("Ja");
    const pruefungBald = naechstePruefung?.includes("Woche") || naechstePruefung?.includes("2 Wochen");
    const maxBlock    = hatADHS ? "20 Minuten" : "25–30 Minuten";

    const sprache = istJung
      ? "Sehr einfaches Deutsch, kurze Sätze, warm und spielerisch. Gerne Emojis. Keine komplizierten Wörter."
      : istTeenager
      ? "Normales Deutsch, freundlich und auf Augenhöhe. Gelegentlich 'okay' oder 'cool' ist fine. Nicht zu kindisch."
      : "Klares, erwachsenes Deutsch. Respektvoll, motivierend, auf Augenhöhe.";

    const adhsTipps = hatADHS
      ? `ADHS-MODUS AKTIV – Diese Regeln sind PFLICHT:
- Lernblöcke maximal 20 Minuten – danach IMMER aktive Pause
- Aktive Pausen = Bewegung: aufstehen, strecken, Fenster auf, 10 Sprünge, Wasser holen
- NIEMALS zwei Fokus-Blöcke hintereinander
- Aufgaben extrem konkret formulieren: nicht "Mathe lernen" sondern "Seite 47, nur Aufgabe 3"
- Lernbubble schaffen: Handy in anderen Raum, Kopfhörer mit leiser Musik, Lieblingsgetränk bereit
- Jeden Block mit einem konkreten Startsatz beginnen`
      : `Konzentrations-Tipps:
- Lernblöcke 25–30 Minuten, dann 5 Min Pause
- Lernbubble: ruhiger Platz, Handy stumm, Wasser bereit`;

    const zeitTipp = zeit?.includes("Morgens") ? "Blöcke morgens oder vor der Schule"
      : zeit?.includes("Mittags") ? "Blöcke direkt nach der Schule wenn Stoff frisch ist"
      : zeit?.includes("Nachmittags") ? "Blöcke zwischen 15 und 18 Uhr – goldene Stunde für diesen Schüler"
      : zeit?.includes("Abends") ? "Blöcke abends aber nicht nach 21 Uhr – Schlaf schützen"
      : "Flexible Zeiten";

    const zuhauseTipp = (zuhause?.includes("laut") || zuhause?.includes("Geschwister"))
      ? "Situation zuhause schwierig – Bibliothek empfehlen oder Kopfhörer-Strategie"
      : zuhause?.includes("kein festen Platz")
      ? "Festen Lernplatz empfehlen – auch Küchentisch wenn aufgeräumt"
      : "Lernumgebung okay – Lernbubble weiter optimieren";

    const pruefungsTipp = pruefungBald
      ? "PRÜFUNG BALD! Plan intensiv, nur Prüfungsstoff, täglich wiederholen, extra Motivation!"
      : "Aufbauender nachhaltiger Plan ohne Druck.";

    const prompt = `Du bist Anna – eine warmherzige, erfahrene Nachhilfelehrerin die seit Jahren Schüler begleitet. Du hast eine besondere Gabe: Du machst komplizierte Dinge einfach, erklärst alles mit Alltagsbeispielen, baust interessante Fakten und kleine Bewegungen ein, und schaffst eine "Lernbubble" – einen sicheren Raum wo Lernen möglich wird. Deine Persönlichkeit: strukturiert aber liebevoll, wie eine Mutter die ihr Kind wirklich versteht. Du glaubst an jeden Schüler.

SPRACHE: ${sprache}

SCHÜLER:
Name: ${name} | Alter: ${alter} Jahre | ${klasse}
Schwere Fächer: ${faecher?.join(", ") || "nicht angegeben"}
Probleme: ${probleme?.join(", ") || "keine"}
Lerntyp: ${lerntyp || "nicht angegeben"}
Blockade: ${blockade || "nicht angegeben"}
Ziel: ${ziel || "nicht angegeben"}
Zuhause: ${zuhause || "nicht angegeben"} → ${zuhauseTipp}
Nächste Prüfung: ${naechstePruefung || "nicht angegeben"} → ${pruefungsTipp}
Schlaf: ${schlaf || "nicht angegeben"}
Was funktioniert: ${wasFunktioniert || "nicht angegeben"}
Beste Lernzeit: ${zeit || "nicht angegeben"} → ${zeitTipp}
ADHS: ${adhs || "nicht angegeben"}
Verfügbare Zeit: ${stunden || "nicht angegeben"}

${adhsTipps}

QUALITÄTSREGELN:
1. Nenn ${name} beim Namen – im Titel und mindestens einer Regel
2. Baue einen "Wusstest du dass..."-Fakt ein passend zu einem schwachen Fach
3. Jede Pause hat eine KONKRETE Aktivität (nicht einfach "Pause machen")
4. Regeln klingen wie Ratschläge einer liebevollen Mutter – warm und klar
5. Maximal ${maxBlock} pro Lernblock
6. Maximal 4 Blöcke pro Tag – realistisch bleiben
7. Schwache Fächer priorisieren
8. Niemals generisch – immer auf ${name} bezogen

Antworte NUR mit diesem JSON (kein Markdown, keine Erklärung):
{
  "titel": "${name}s persönlicher Lernplan",
  "untertitel": "ein warmer, persönlicher Satz speziell für ${name} – klingt wie von einer Mutter",
  "prioritaeten": ["Priorität 1 kurz", "Priorität 2", "Priorität 3"],
  "wusstest_du": "Wusstest du dass [interessanter Fakt passend zu einem schwachen Fach von ${name}]? [kurze Motivation]",
  "tage": {
    "Mo": [{"zeit":"15:00","titel":"konkreter Name","beschreibung":"Was genau + kleiner Motivationssatz","typ":"fokus","dauer":"25 Min"}],
    "Di": [...],
    "Mi": [...],
    "Do": [...],
    "Fr": [...]
  },
  "tipps": [
    {"label":"Annas Tipp für ${name}","text":"persönlicher Tipp basierend auf Lerntyp ${lerntyp}"},
    {"label":"Deine Lernbubble","text":"konkret wie ${name} seinen perfekten Lernraum schafft"},
    {"label":"${hatADHS ? "ADHS & Fokus" : "Konzentration"}","text":"spezifischer Tipp"},
    {"label":"Wenn du blockiert bist","text":"erster konkreter Schritt wenn gar nichts geht – sehr einfach"}
  ],
  "regeln": [
    "warme, klare Regel 1 – klingt wie Mutter-Rat",
    "motivierende Regel 2",
    "realistische Regel 3",
    "${name} direkt ansprechen in Regel 4"
  ]
}`;

    const response = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 1800,
      temperature: 0.7,
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.content[0].text;
    const clean = text.replace(/```json|```/g, "").trim();

    let plan;
    try {
      plan = JSON.parse(clean);
    } catch {
      // Fallback wenn JSON kaputt
      plan = buildFallback(name, alter, hatADHS, faecher);
    }

    // Qualitätsprüfung
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
  const block = hatADHS ? "20 Min" : "25 Min";
  const fach = faecher?.[0] || "dein schwerstes Fach";
  return {
    titel: `${name}s Lernplan`,
    untertitel: `Du schaffst das, ${name}! Schritt für Schritt zum Ziel – ich bin bei dir. 💜`,
    prioritaeten: [`${fach} meistern`, "Jeden Tag ein bisschen", "Auf dich achten"],
    wusstest_du: `Wusstest du dass dein Gehirn beim Lernen neue Verbindungen baut – wie Muskeln beim Sport? Je öfter du übst, desto stärker wirst du!`,
    tage: {
      Mo: [
        {zeit:"15:00",titel:`${fach} – eine Aufgabe`,beschreibung:`Nur eine Aufgabe aufschlagen und starten. Du musst nicht alles – nur anfangen. Das reicht!`,typ:"fokus",dauer:block},
        {zeit:`15:${hatADHS?"20":"30"}`,titel:"Aktive Pause",beschreibung:"Aufstehen, strecken, Fenster auf. Frische Luft für dein Gehirn!",typ:"pause",dauer:"10 Min"},
        {zeit:`15:${hatADHS?"30":"45"}`,titel:"Wiederholen",beschreibung:"Was hast du gelernt? Einmal kurz erklären – laut oder im Kopf.",typ:"fokus",dauer:block},
      ],
      Di: [{zeit:"15:00",titel:"Aufgaben erledigen",beschreibung:"Hausaufgaben zuerst – dann ist der Kopf frei.",typ:"fokus",dauer:block},{zeit:"16:00",titel:"Kurze Pause",beschreibung:"Bewegung, Snack, Wasser.",typ:"pause",dauer:"10 Min"}],
      Mi: [{zeit:"15:00",titel:"Freier Nachmittag",beschreibung:`Heute erholen, ${name}! Du hast es verdient.`,typ:"aktiv",dauer:"frei"}],
      Do: [{zeit:"15:00",titel:`${fach} wiederholen`,beschreibung:"Vom Montag nochmal anschauen – so bleibt es im Kopf!",typ:"fokus",dauer:block},{zeit:"16:00",titel:"Pause + Bewegung",beschreibung:"10 Minuten rausgehen oder strecken.",typ:"pause",dauer:"10 Min"}],
      Fr: [{zeit:"15:00",titel:"Wochenrückblick",beschreibung:`Was hat diese Woche gut geklappt, ${name}? Stolz sein ist erlaubt! 🌟`,typ:"aktiv",dauer:"15 Min"}],
    },
    tipps: [
      {label:"Annas wichtigster Tipp",text:"Fang mit der kleinsten möglichen Aufgabe an. Nicht das ganze Kapitel – nur eine Aufgabe. Der Start ist das Schwerste."},
      {label:"Deine Lernbubble",text:"Handy in ein anderes Zimmer. Lieblingsgetränk bereit. Kopfhörer auf. Jetzt gehört die Zeit nur dir."},
      {label:"Konzentration",text:"Timer auf 25 Minuten stellen. Nur diese 25 Minuten. Dann Pause. Das schaffst du!"},
      {label:"Wenn du blockiert bist",text:"Zähl bis 3 und öffne einfach das Heft. Nur aufschlagen – mehr nicht. Der Rest kommt von alleine."},
    ],
    regeln: [
      `${name}, du brauchst nicht perfekt sein – du musst nur anfangen. 💜`,
      "Jeder kleine Schritt zählt. Auch 15 Minuten sind ein Erfolg.",
      "Pausen sind kein Versagen – sie machen dich stärker.",
      `Ich glaube an dich, ${name}. Du schaffst mehr als du denkst.`,
    ],
  };
}