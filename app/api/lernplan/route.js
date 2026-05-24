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
      {"zeit": "14:00", "titel": "Pause & Erholen", "beschreibung": "30 Min Pause...", "typ": "pause", "dauer": "30 Min"},
      {"zeit": "14:30", "titel": "Konzentration starten", "beschreibung": "1 Min tief atmen...", "typ": "konzentration", "dauer": "2 Min"},
      {"zeit": "14:32", "titel": "Hausaufgaben Mathe (3 Aufgaben)", "beschreibung": "Schritt 1: ...\\nSchritt 2: ...", "typ": "fokus", "fach": "Mathematik", "dauer": "38 Min"},
      {"zeit": "15:10", "titel": "Pause", "beschreibung": "10 Min strecken...", "typ": "pause", "dauer": "10 Min"},
      {"zeit": "15:20", "titel": "Französisch lernen (für morgen!)", "beschreibung": "Morgen hast du Französisch.\\nSchritt 1: ...\\nSchritt 2: ...", "typ": "fokus", "fach": "Französisch", "dauer": "25 Min"},
      {"zeit": "16:00", "titel": "Tennis", "beschreibung": "Dein Training – viel Spaß! Danach geht der Plan weiter.", "typ": "termin", "dauer": "17-19 Uhr"},
      {"zeit": "19:30", "titel": "Vokabeln beim Abendessen", "beschreibung": "Nach dem Training leicht: 10 Vokabeln mit Karteikarten.", "typ": "fokus", "fach": "Französisch", "dauer": "15 Min"}
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

WICHTIG: Alle 7 Tage. Jeder Tag bereitet den nächsten Schultag vor. Block-Typen: "pause", "konzentration", "fokus", "spiel", "test", "termin". Bei fokus/spiel/test immer "fach" angeben. Termine aus dem Stundenplan als "termin"-Block einbauen.`;

    const response = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 6000,
      temperature: 0.5,
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.content[0].text;
    const clean = text.replace(/```json|```/g, "").trim();

    let plan;
    try { plan = JSON.parse(clean); }
    catch { plan = buildFallback(name, hatADHS, schwacheFaecher, lieblingsfach); }
    if (!plan.tage || Object.keys(plan.tage).length < 5) {
      plan = buildFallback(name, hatADHS, schwacheFaecher, lieblingsfach);
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
  const konz = {zeit:"14:30",titel:"Konzentration starten",beschreibung:"1 Minute tief durchatmen. Augen schließen, bis 20 zählen. Jetzt ist dein Kopf bereit.",typ:"konzentration",dauer:"2 Min"};
  const pause = (z)=>({zeit:z,titel:"Pause",beschreibung:"10 Minuten: aufstehen, strecken, Wasser trinken.",typ:"pause",dauer:"10 Min"});
  const startPause = {zeit:"14:00",titel:"Pause & Erholen",beschreibung:"30 Minuten Pause: etwas essen, ausruhen, Kopf frei machen nach der Schule.",typ:"pause",dauer:"30 Min"};
  const haBlock = {zeit:"14:32",titel:"Hausaufgaben erledigen",beschreibung:"Schritt 1: Alle Hefte und Bücher rausholen (2 Min)\nSchritt 2: Aufschreiben welche Hausaufgaben es gibt (3 Min)\nSchritt 3: Erste Aufgabe lösen (12 Min)\nSchritt 4: Zweite Aufgabe lösen (12 Min)\nSchritt 5: Kontrollieren (3 Min)",typ:"fokus",fach:fach,dauer:"32 Min"};
  const lern = (z,f)=>({zeit:z,titel:`${f} lernen (für morgen)`,beschreibung:`Morgen hast du ${f}.\nSchritt 1: Heft und Buch aufschlagen (2 Min)\nSchritt 2: Den Stoff durchlesen (8 Min)\nSchritt 3: Das Wichtigste rausschreiben (10 Min)\nSchritt 4: Kurz selbst abfragen (5 Min)`,typ:"fokus",fach:f,dauer:"25 Min"});
  const spiel = (z)=>({zeit:z,titel:`${fach}-Spiel (Problemfach)`,beschreibung:`Wettbewerb gegen die Uhr! Stoppuhr stellen: Schaffst du 5 kleine Aufgaben in 15 Minuten?`,typ:"spiel",fach:fach,dauer:"15 Min"});
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
      Sa:[{zeit:"10:00",titel:"Pause & Start",beschreibung:"Gemütlich in den Tag starten.",typ:"pause",dauer:"frei"},konz,lern("10:30",fach),pause("10:55"),spiel("11:05")],
      So:[{zeit:"17:00",titel:"Woche vorbereiten",beschreibung:"Schritt 1: Schultasche packen (5 Min)\nSchritt 2: Stundenplan anschauen (5 Min)",typ:"fokus",fach:"Organisation",dauer:"10 Min"},lern("17:15",fach)]
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