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
      pruefungen,
      previousNotes
    } = form;

    const istJung = parseInt(alter) <= 12;
    const istTeenager = parseInt(alter) >= 13 && parseInt(alter) <= 15;
    const hatADHS = adhs?.includes("Ja") || adhs?.includes("offiziell");
    const maxBlock = hatADHS ? "15-20" : "25-30";

    const sprache = istJung
      ? "Sehr einfache, kindgerechte Sprache. Kurze Sätze. Freundliche Emojis."
      : istTeenager
      ? "Jugendgerechte Sprache. Freundlich, direkt, motivierend."
      : "Klar, respektvoll, auf Augenhöhe. Motivierend.";

    const sp = stundenplan || [];
    const stundenplanText = sp.map((d,idx) => {
      const ha = (d.hausaufgaben||[]).filter(h=>h.anzahl>0).map(h=>`${h.fach}: ${h.anzahl} Aufgaben`).join(", ") || "keine";
      const faecher = [...(d.faecher||[]), d.sonstiges].filter(Boolean).join(", ") || "keine";
      const naechster = sp[idx+1];
      const faecherMorgen = naechster ? [...(naechster.faecher||[]), naechster.sonstiges].filter(Boolean).join(", ") : "(nächste Woche)";
      return `${d.tag}: Schule ${d.schulzeit||"frei"} | Fächer heute: ${faecher} | Nachmittag-Termin: ${d.nachmittag||"frei"} | Hausaufgaben auf: ${ha} | >>> MORGEN (${naechster?naechster.tag:"Mo"}) Fächer: ${faecherMorgen}`;
    }).join("\n") || "Kein Stundenplan angegeben";

    const pruefText = (pruefungen||[]).filter(p=>p.fach).map(p=>`${p.art||"Test"} in ${p.fach} am ${p.datum||"bald"}`).join("\n") || "keine";

    const prompt = `Du bist Anna – eine professionelle Nachhilfelehrerin mit jahrelanger Erfahrung. Du erstellst einen SEHR DETAILLIERTEN, realistischen Wochenplan.

═══ SCHÜLER ═══
Name: ${name} | Alter: ${alter} | ${klasse} | ${schultyp||"?"}
ADHS/Konzentration: ${adhs||"Nein"}
Lernprobleme: ${lernprobleme?.join(", ")||"keine"}
Lerntyp: ${lerntyp||"?"}
Schwache Fächer (Problemfächer): ${schwacheFaecher?.join(", ")||"?"}
Einfachstes Fach: ${einfachesFach||"?"} | Lieblingsfach: ${lieblingsfach||"?"}
Ziel: ${ziel||"?"}
${previousNotes ? `\nNotizen letzte Woche (Plan daran anpassen!): ${previousNotes}` : ""}

═══ STUNDENPLAN (mit Fächern von HEUTE und MORGEN) ═══
${stundenplanText}

═══ TESTS / KURZARBEITEN / SCHULAUFGABEN / REFERATE / PROJEKTE ═══
${pruefText}

═══ DIE WICHTIGSTE REGEL – SO PLANST DU JEDEN TAG ═══

⚠️ KRITISCH: Du MUSST den echten Stundenplan oben verwenden! Schau für jeden Tag was hinter ">>> MORGEN" steht – GENAU diese Fächer werden gelernt. NIEMALS einfach nur "Mathematik" für alles. Wenn morgen Französisch, Geschichte und Biologie ist, dann plane HEUTE Blöcke für Französisch, Geschichte UND Biologie – jedes Fach einzeln!

Der Lern-Nachmittag bereitet IMMER den NÄCHSTEN Schultag vor! NICHT zufällige Fächer.

Für jeden Tag plane in dieser Reihenfolge:
1. PAUSE nach der Schule (30 Min) – außer der Schüler hat direkt einen Termin, dann Pause nach dem Termin oder kürzer.
2. HAUSAUFGABEN die HEUTE aufgegeben wurden – realistisch: 1 Aufgabe = 10-13 Minuten. Bei 3 Aufgaben = ca. 35-40 Min Block.
3. LERNEN/VORBEREITEN für die Fächer die MORGEN drankommen (steht oben hinter ">>> MORGEN"). Nur diese Fächer! Wenn morgen Französisch und Geschichte ist, dann wird HEUTE Französisch und Geschichte gelernt – NICHT Physik.
4. TESTS/KURZARBEITEN/SCHULAUFGABEN: In den Tagen DAVOR extra Vorbereitungs-Blöcke (typ "test"). Je näher der Termin, desto mehr Zeit.
5. REFERATE/PROJEKTE: Über mehrere Tage verteilt vorbereiten (typ "test", aber im Titel "Referat" nennen). Z.B. Tag 1: Thema sammeln, Tag 2: Stichpunkte, Tag 3: üben.
6. PROBLEMFÄCHER (${schwacheFaecher?.join(", ")||"schwache Fächer"}): JEDEN Tag zusätzlich 15-20 Min als Spiel/Wettbewerb (typ "spiel") – auch wenn das Fach morgen nicht drankommt.
7. PAUSEN zwischen allen Lernblöcken (5-10 Min).
8. KONZENTRATIONSÜBUNG am Anfang und vor schweren Blöcken (typ "konzentration").

═══ TERMINE (Tennis, Nachhilfe, Training) ═══
Wenn im Stundenplan ein Nachmittag-Termin steht (z.B. "Tennis 17-19"):
- Zeige den Termin als eigenen Block (typ "termin") zur richtigen Uhrzeit.
- Plane das Lernen DRUMHERUM: was geht vor dem Termin, was danach.
- Nach Training abends: nur noch leichtes Wiederholen oder Vokabeln, kein schwerer Block.

═══ WEITERE REGELN ═══
- ${hatADHS ? `ADHS: max ${maxBlock} Min pro Block, Konzentrationsübung/Bewegungspause davor.` : `Blöcke ${maxBlock} Min.`}
- JEDER fokus/test/spiel-Block: konkrete Mini-Schritte mit \\n getrennt (Schritt 1: ... Schritt 2: ...).
- Hausaufgaben realistisch rechnen: 1 Aufgabe = 10-13 Min.
- NIEMALS Kosenamen ("Schatz", "Liebling").
- SPRACHE: ${sprache}
- NIEMALS ein komplett freier Lern-Nachmittag.
- Fach-Methoden: Mathe = erst Methode verstehen. Physik = erst Formeln aufschreiben. Sprachen = Karteikarten. Geschichte = Zeitstrahl. Bio = Skizzen. Deutsch = laut lesen.

═══ AUSGABE – NUR JSON ═══
{
  "titel": "${name}s persönlicher Lernplan",
  "untertitel": "warmer motivierender Satz, ohne Kosenamen",
  "wusstest_du": "interessanter Lernfakt zu einem schwachen Fach",
  "prioritaeten": ["Priorität 1", "Priorität 2", "Priorität 3"],
  "fach_tipps": [{"fach": "Fach", "tipp": "konkrete Lernmethode"}],
  "tage": {
    "Mo": [
      {"zeit": "14:00", "titel": "Pause & Erholen", "beschreibung": "30 Min Pause: etwas essen, ausruhen, Kopf frei machen.", "schritte": [], "typ": "pause", "dauer": "30 Min"},
      {"zeit": "14:30", "titel": "Konzentration starten", "beschreibung": "Mach deinen Kopf bereit zum Lernen.", "schritte": ["1 Minute tief durchatmen", "Augen schliessen und bis 20 zaehlen"], "typ": "konzentration", "dauer": "2 Min"},
      {"zeit": "14:32", "titel": "Hausaufgaben Mathe", "beschreibung": "Du hast 3 Mathe-Aufgaben auf.", "schritte": ["Heft und Buch aufschlagen", "Formel oben notieren", "Aufgabe 1 loesen", "Aufgabe 2 loesen", "Aufgabe 3 loesen", "Kontrollieren und Haken machen"], "typ": "fokus", "fach": "Mathematik", "dauer": "38 Min"},
      {"zeit": "15:10", "titel": "Pause", "beschreibung": "10 Minuten: aufstehen, strecken, Wasser trinken.", "schritte": [], "typ": "pause", "dauer": "10 Min"},
      {"zeit": "15:20", "titel": "Franzoesisch lernen", "beschreibung": "Morgen hast du Franzoesisch - bereite dich vor.", "schritte": ["Heft aufschlagen", "Den Stoff durchlesen", "Wichtigste rausschreiben", "Vokabeln mit Karteikarten ueben"], "typ": "fokus", "fach": "Franzoesisch", "dauer": "25 Min"},
      {"zeit": "16:00", "titel": "Tennis", "beschreibung": "Dein Training - viel Spass! Danach geht der Plan weiter.", "schritte": [], "typ": "termin", "dauer": "17-19 Uhr"},
      {"zeit": "19:30", "titel": "Vokabeln beim Abendessen", "beschreibung": "Nach dem Training leicht: Vokabeln mit Karteikarten.", "schritte": ["10 neue Vokabeln anschauen", "Mit Karteikarten abfragen"], "typ": "fokus", "fach": "Franzoesisch", "dauer": "15 Min"}
    ],
    "Di": [], "Mi": [], "Do": [], "Fr": [], "Sa": [], "So": []
  },
  "tipps": [
    {"label": "Für ${name}", "text": "Tipp"},
    {"label": "Deine Lernbubble", "text": "Tipp"},
    {"label": "${hatADHS ? 'ADHS & Konzentration' : 'Konzentration'}", "text": "Tipp"},
    {"label": "Wenn gar nichts geht", "text": "Tipp"}
  ],
  "regeln": ["Regel 1 an ${name}", "Regel 2", "Regel 3", "Regel 4"]
}

KRITISCH FÜR GÜLTIGES JSON:
- Antworte AUSSCHLIESSLICH mit dem JSON-Objekt. KEIN Text davor, KEIN Text danach, KEINE Erklärung, KEINE Markdown-Backticks.
- Verwende KEINE Zeilenumbrüche innerhalb von Text-Werten. Jeder Text steht in einer Zeile.
- Schritte gehören IMMER ins "schritte"-Array (Liste von kurzen Strings), niemals in den beschreibung-Text.
- Verwende normale gerade Anführungszeichen für JSON. Innerhalb von Texten KEINE doppelten Anführungszeichen verwenden.
- Plane alle 7 Tage (Mo, Di, Mi, Do, Fr, Sa, So) mit jeweils mehreren Blöcken.
- Block-Typen: "pause", "konzentration", "fokus", "spiel", "test", "termin". Bei fokus/spiel/test immer "fach" angeben.
- Halte die Schritte und Texte kurz und konkret, damit die Antwort nicht zu lang wird.`;

    const response = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 16000,
      temperature: 0.4,
      messages: [
        { role: "user", content: prompt },
        { role: "assistant", content: "{" }
      ],
    });

    // Text aus allen Text-Bloecken zusammensetzen (falls mehrere)
    let rawText = "";
    for (const block of (response.content || [])) {
      if (block && block.type === "text" && block.text) rawText += block.text;
    }
    // Prefill "{" wieder voranstellen
    let fullText = "{" + rawText;
    console.log("KI-Antwort Laenge:", fullText.length, "| Stop-Grund:", response.stop_reason);

    // JSON sauber rausschneiden: vom ERSTEN { bis zum LETZTEN }
    let jsonStr = fullText;
    const firstBrace = fullText.indexOf("{");
    const lastBrace = fullText.lastIndexOf("}");
    if (firstBrace >= 0 && lastBrace > firstBrace) {
      jsonStr = fullText.slice(firstBrace, lastBrace + 1);
    }

    let plan = null;
    try {
      plan = JSON.parse(jsonStr);
    } catch (e1) {
      // Reparatur: fehlende Klammern ergaenzen falls abgeschnitten
      try {
        let repaired = jsonStr;
        const openCurly = (repaired.match(/{/g) || []).length;
        const closeCurly = (repaired.match(/}/g) || []).length;
        const openSquare = (repaired.match(/\[/g) || []).length;
        const closeSquare = (repaired.match(/\]/g) || []).length;
        let addSquare = openSquare - closeSquare;
        let addCurly = openCurly - closeCurly;
        while (addSquare-- > 0) repaired += "]";
        while (addCurly-- > 0) repaired += "}";
        plan = JSON.parse(repaired);
        console.log("JSON repariert und erfolgreich geparst");
      } catch (e2) {
        console.error("JSON Parse FEHLER:", e1.message);
        console.error("Antwort-Anfang:", fullText.slice(0, 200));
        console.error("Antwort-Ende:", fullText.slice(-200));
        plan = null;
      }
    }

    if (!plan || !plan.tage || Object.keys(plan.tage).length < 3) {
      console.error("Plan ungueltig -> Fallback. plan vorhanden:", !!plan, "| tage:", plan ? Object.keys(plan.tage || {}).length : "keine");
      plan = buildFallback(name, hatADHS, schwacheFaecher, lieblingsfach);
    } else {
      console.log("ECHTER KI-PLAN erfolgreich erstellt mit", Object.keys(plan.tage).length, "Tagen");
    }
    return Response.json(plan);
  } catch (err) {
    console.error("Lernplan API Fehler:", err);
    return Response.json({ error: "Fehler beim Erstellen" }, { status: 500 });
  }
}

function buildFallback(name, hatADHS, faecher, lieblingsfach) {
  const fach = faecher?.[0] || "Mathematik";
  const block = hatADHS ? "20 Min" : "25 Min";
  const konz = {zeit:"14:30",titel:"Konzentration starten",beschreibung:"Mach deinen Kopf bereit zum Lernen.",schritte:["1 Minute tief durchatmen","Augen schliessen und bis 20 zaehlen"],typ:"konzentration",dauer:"2 Min"};
  const pause = (z)=>({zeit:z,titel:"Pause",beschreibung:"10 Minuten: aufstehen, strecken, Wasser trinken.",schritte:[],typ:"pause",dauer:"10 Min"});
  const startPause = {zeit:"14:00",titel:"Pause & Erholen",beschreibung:"30 Minuten Pause: etwas essen, ausruhen, Kopf frei machen nach der Schule.",schritte:[],typ:"pause",dauer:"30 Min"};
  const haBlock = {zeit:"14:32",titel:"Hausaufgaben erledigen",beschreibung:"Mach deine Hausaufgaben Schritt fuer Schritt.",schritte:["Alle Hefte und Buecher rausholen","Aufschreiben welche Hausaufgaben es gibt","Mit der einfachsten Aufgabe anfangen","Schwierigere Aufgaben loesen","Alles kontrollieren und Haken machen"],typ:"fokus",fach:fach,dauer:"32 Min"};
  const lern = (z,f)=>({zeit:z,titel:`${f} lernen (fuer morgen)`,beschreibung:`Morgen hast du ${f} - bereite dich vor.`,schritte:["Heft und Buch aufschlagen","Den heutigen Stoff durchlesen","Das Wichtigste rausschreiben","Kurz selbst abfragen"],typ:"fokus",fach:f,dauer:"25 Min"});
  const spiel = (z)=>({zeit:z,titel:`${fach}-Spiel (Problemfach)`,beschreibung:"Wettbewerb gegen die Uhr - mach es zu einem Spiel!",schritte:["Stoppuhr auf 15 Minuten stellen","5 kleine Aufgaben so schnell wie moeglich loesen","Jeden Tag versuchen den Rekord zu schlagen"],typ:"spiel",fach:fach,dauer:"15 Min"});
  const tag = ()=>[startPause,konz,haBlock,pause("15:04"),lern("15:14",fach),pause("15:39"),spiel("15:49")];
  return {
    titel:`${name}s persönlicher Lernplan`,
    untertitel:`Dein Plan begleitet dich durch jeden Tag – Schritt für Schritt!`,
    wusstest_du:"Wusstest du dass dein Gehirn im Schlaf das Gelernte abspeichert? Deshalb hilft Wiederholen direkt vor dem Schlafen so gut!",
    prioritaeten:[`${fach} jeden Tag üben`,"Hausaufgaben immer zuerst","Pausen einhalten"],
    fach_tipps:[
      {fach:"Mathematik",tipp:"Erst die Methode und den Lösungsweg verstehen – dann erst Aufgaben rechnen."},
      {fach:"Fremdsprachen",tipp:"Vokabeln auf Karteikarten schreiben und abends beim Essen lernen."}
    ],
    tage:{Mo:tag(),Di:tag(),Mi:tag(),Do:tag(),Fr:tag(),
      Sa:[{zeit:"10:00",titel:"Pause & Start",beschreibung:"Gemuetlich in den Tag starten.",schritte:[],typ:"pause",dauer:"frei"},konz,lern("10:30",fach),pause("10:55"),spiel("11:05")],
      So:[{zeit:"17:00",titel:"Woche vorbereiten",beschreibung:"Bereite dich auf die neue Woche vor.",schritte:["Schultasche fuer Montag packen","Stundenplan anschauen","Hausaufgaben checken"],typ:"fokus",fach:"Organisation",dauer:"10 Min"},lern("17:15",fach)]
    },
    tipps:[
      {label:`Für ${name}`,text:"Fang immer mit der kleinsten Aufgabe an. Nicht das ganze Kapitel – nur eine Aufgabe."},
      {label:"Deine Lernbubble",text:"Handy in ein anderes Zimmer. Wasser bereitstellen. Schreibtisch aufräumen."},
      {label:hatADHS?"ADHS & Konzentration":"Konzentration",text:"Timer auf 25 Minuten. Nur diese 25 Minuten zählen. Danach echte Pause."},
      {label:"Wenn gar nichts geht",text:"Zähl bis 3 und öffne einfach das Heft. Nur aufschlagen – der Rest kommt von alleine."}
    ],
    regeln:[
      `${name}, du musst nicht perfekt sein – du musst nur anfangen!`,
      "Jeder kleine Schritt zählt. Auch 15 Minuten sind ein Erfolg.",
      "Pausen sind kein Versagen – sie machen dich stärker.",
      "Du schaffst mehr als du denkst!"
    ]
  };
}