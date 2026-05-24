import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req) {
  try {
    const form = await req.json();
    const {
      name, alter, klasse, schultyp,
      stundenplan,        // [{tag, schulVon, schulBis, faecher:[], sonstiges, nachmittag, hausaufgaben:[{fach, anzahl}]}]
      schwacheFaecher, lieblingsfach, einfachesFach,
      lernprobleme, lerntyp, adhs, ziel,
      tests,              // [{fach, datum}]
      previousNotes
    } = form;

    const istJung = parseInt(alter) <= 12;
    const istTeenager = parseInt(alter) >= 13 && parseInt(alter) <= 15;
    const hatADHS = adhs?.includes("Ja") || adhs?.includes("offiziell");
    const maxBlock = hatADHS ? "15-20" : "25-30";

    const sprache = istJung
      ? "Sehr einfache, kindgerechte Sprache für ein Kind. Kurze Sätze. Freundliche Emojis."
      : istTeenager
      ? "Jugendgerechte Sprache. Freundlich, direkt, motivierend."
      : "Klar, respektvoll, auf Augenhöhe. Motivierend.";

    const stundenplanText = stundenplan?.map(d => {
      const ha = (d.hausaufgaben||[]).filter(h=>h.anzahl>0).map(h=>`${h.fach} (${h.anzahl} Aufgaben)`).join(", ") || "keine";
      const faecher = [...(d.faecher||[]), d.sonstiges].filter(Boolean).join(", ") || "?";
      return `${d.tag}: Schule ${d.schulVon||"?"}-${d.schulBis||"?"} | Fächer heute: ${faecher} | Nachmittag: ${d.nachmittag||"frei"} | Hausaufgaben: ${ha}`;
    }).join("\n") || "Kein Stundenplan angegeben";

    const testText = tests?.filter(t=>t.fach).map(t=>`${t.fach} am ${t.datum||"bald"}`).join(", ") || "keine";

    const prompt = `Du bist Anna – eine professionelle Nachhilfelehrerin mit jahrelanger Erfahrung. Du erstellst einen SEHR DETAILLIERTEN, realistischen Wochenplan, der ein Kind durch jeden einzelnen Tag begleitet.

═══ SCHÜLER ═══
Name: ${name} | Alter: ${alter} | ${klasse} | ${schultyp||"?"}
ADHS/Konzentration: ${adhs||"Nein"}
Lernprobleme: ${lernprobleme?.join(", ")||"keine"}
Lerntyp: ${lerntyp||"?"}
Schwache Fächer: ${schwacheFaecher?.join(", ")||"?"}
Einfachstes Fach: ${einfachesFach||"?"} | Lieblingsfach: ${lieblingsfach||"?"}
Ziel: ${ziel||"?"}
Anstehende Tests/Kurzarbeiten: ${testText}
${previousNotes ? `\nNotizen letzte Woche (Plan daran anpassen!): ${previousNotes}` : ""}

═══ STUNDENPLAN ═══
${stundenplanText}

═══ ANNAS METHODE – GENAU SO PLANEN ═══

1. HEIMKOMMEN → 30 Min Pause (essen, ausruhen). Bei sehr vollem Tag mit direktem Termin: Pause kürzer oder nach dem Termin.

2. HAUSAUFGABEN REALISTISCH RECHNEN:
   - Eine Hausaufgabe/Aufgabe dauert 10-13 Minuten – je nach Schwierigkeit.
   - Bei 3 Mathe-Aufgaben → ca. 35-40 Min Block, nicht 25 Min!
   - Wenn ein Termin dazwischen kommt: Hausaufgaben aufteilen – Teil 1 vor dem Termin, Teil 2 danach.

3. JEDES FACH bekommt einen echten Fokus-Block – nicht nur Hausaufgaben, auch LERNEN/WIEDERHOLEN. Auch Fächer ohne Hausaufgaben: Stoff wiederholen, üben, vorbereiten.

4. PROBLEMFÄCHER: zusätzlich JEDEN Tag 15-20 Min als Spiel/Wettbewerb (z.B. "Schaffst du 10 Vokabeln in 5 Minuten?", "Quiz gegen die Uhr"). Macht Spaß, hält den Kontakt zum Fach.

5. REIHENFOLGE: Hausaufgaben zuerst → einfachstes Fach (Aufwärmen) → schwerstes Fach (volle Energie) → Lieblingsfach (Belohnung). Problemfach-Spiel kann zwischendrin.

6. PAUSEN fest einplanen: nach jedem Lernblock 5-10 Min. Konkrete Pause: "aufstehen, strecken, Wasser holen".

7. KONZENTRATIONSÜBUNGEN einbauen als eigene kurze Blöcke (typ "konzentration"): z.B. "1 Minute tief atmen", "Augen schließen und bis 20 zählen", "5 Dinge im Raum benennen". Besonders bei ADHS vor schweren Blöcken.

8. TESTS/KURZARBEITEN: Wenn ein Test ansteht, in den Tagen davor EXTRA Vorbereitungs-Blöcke einplanen (typ "test"). Je näher der Test, desto mehr Zeit.

9. ${hatADHS ? `ADHS: max ${maxBlock} Min pro Block, IMMER Konzentrationsübung oder Bewegungspause davor/danach.` : `Blöcke ${maxBlock} Min.`}

10. JEDER BLOCK DETAILLIERT: konkrete Mini-Schritte mit \\n getrennt. Beispiel Mathe:
    "Schritt 1: Heft + Buch aufschlagen, Aufgabe lesen (2 Min)\\nSchritt 2: Formel oben notieren (3 Min)\\nSchritt 3: Beispiel im Buch durchgehen (5 Min)\\nSchritt 4: Aufgabe 1 lösen (12 Min)\\nSchritt 5: Aufgabe 2 lösen (12 Min)\\nSchritt 6: Kontrollieren, Haken machen (3 Min)"

11. FACH-METHODEN: Mathe = erst Methode verstehen dann rechnen. Physik = erst Formeln aufschreiben. Sprachen = Karteikarten. Geschichte = Zeitstrahl. Bio = Skizzen. Deutsch = laut lesen, Struktur zuerst.

12. NIEMALS Kosenamen ("Schatz", "Liebling" etc.).

13. SPRACHE: ${sprache}

14. NIEMALS ein komplett freier Lern-Nachmittag. Immer mindestens Hausaufgaben + kurze Wiederholung.

═══ AUSGABE – NUR JSON ═══
{
  "titel": "${name}s persönlicher Lernplan",
  "untertitel": "warmer motivierender Satz, ohne Kosenamen",
  "wusstest_du": "interessanter Lernfakt zu einem schwachen Fach",
  "prioritaeten": ["Priorität 1", "Priorität 2", "Priorität 3"],
  "fach_tipps": [{"fach": "Fachname", "tipp": "konkrete Lernmethode für dieses Fach"}],
  "tage": {
    "Mo": [
      {"zeit": "14:00", "titel": "Pause & Erholen", "beschreibung": "30 Minuten Pause: etwas essen, kurz ausruhen, Kopf frei machen.", "typ": "pause", "dauer": "30 Min"},
      {"zeit": "14:30", "titel": "Konzentration starten", "beschreibung": "1 Minute tief durchatmen. Augen zu, bis 20 zählen. Jetzt ist dein Kopf bereit.", "typ": "konzentration", "dauer": "2 Min"},
      {"zeit": "14:32", "titel": "Hausaufgaben Mathe (3 Aufgaben)", "beschreibung": "Schritt 1: ...\\nSchritt 2: ...", "typ": "fokus", "fach": "Mathematik", "dauer": "38 Min"},
      {"zeit": "15:10", "titel": "Pause", "beschreibung": "10 Min: aufstehen, strecken, Wasser trinken.", "typ": "pause", "dauer": "10 Min"},
      {"zeit": "15:20", "titel": "Englisch lernen", "beschreibung": "Schritt 1: ...\\nSchritt 2: ...", "typ": "fokus", "fach": "Englisch", "dauer": "25 Min"},
      {"zeit": "15:45", "titel": "Mathe-Spiel (Problemfach)", "beschreibung": "Wettbewerb: Schaffst du 5 Aufgaben in 15 Minuten? Stoppuhr an!", "typ": "spiel", "fach": "Mathematik", "dauer": "15 Min"}
    ],
    "Di": [], "Mi": [], "Do": [], "Fr": [], "Sa": [], "So": []
  },
  "tipps": [
    {"label": "Für ${name}", "text": "persönlicher Tipp"},
    {"label": "Deine Lernbubble", "text": "Tipp zur Lernumgebung"},
    {"label": "${hatADHS ? 'ADHS & Konzentration' : 'Konzentration'}", "text": "Tipp"},
    {"label": "Wenn gar nichts geht", "text": "erster Mini-Schritt"}
  ],
  "regeln": ["Regel 1 an ${name}", "Regel 2", "Regel 3", "Regel 4"]
}

WICHTIG: Alle 7 Tage planen. Jeder Tag: Pause + Konzentration + mehrere Fokus-Blöcke (jedes Fach) + Problemfach-Spiel + Pausen dazwischen. Block-Typen: "pause", "konzentration", "fokus", "spiel", "test". Bei "fokus", "spiel", "test" immer "fach" angeben. Jeder fokus/test-Block mit detaillierten Mini-Schritten.`;

    const response = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 5500,
      temperature: 0.6,
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
  const fach2 = faecher?.[1] || "Englisch";
  const lieb = lieblingsfach || "dein Lieblingsfach";
  const konz = {zeit:"14:30",titel:"Konzentration starten",beschreibung:"1 Minute tief durchatmen. Augen schließen, bis 20 zählen. Jetzt ist dein Kopf bereit zum Lernen.",typ:"konzentration",dauer:"2 Min"};
  const pause = (z)=>({zeit:z,titel:"Pause",beschreibung:"10 Minuten: aufstehen, strecken, Wasser trinken, ans Fenster.",typ:"pause",dauer:"10 Min"});
  const startPause = {zeit:"14:00",titel:"Pause & Erholen",beschreibung:"30 Minuten Pause: etwas essen, ausruhen, Kopf frei machen nach der Schule. Das hast du dir verdient.",typ:"pause",dauer:"30 Min"};
  const haBlock = {zeit:"14:32",titel:"Hausaufgaben erledigen",beschreibung:"Schritt 1: Alle Hefte und Bücher rausholen (2 Min)\nSchritt 2: Aufschreiben welche Hausaufgaben es gibt (3 Min)\nSchritt 3: Erste Aufgabe lösen (12 Min)\nSchritt 4: Zweite Aufgabe lösen (12 Min)\nSchritt 5: Alles kontrollieren, Haken machen (3 Min)",typ:"fokus",fach:fach,dauer:"32 Min"};
  const lernBlock = (z,f)=>({zeit:z,titel:`${f} lernen`,beschreibung:`Schritt 1: Heft und Buch aufschlagen (2 Min)\nSchritt 2: Den heutigen Stoff durchlesen (8 Min)\nSchritt 3: Das Wichtigste rausschreiben (10 Min)\nSchritt 4: Kurz selbst abfragen (5 Min)`,typ:"fokus",fach:f,dauer:"25 Min"});
  const spielBlock = (z)=>({zeit:z,titel:`${fach}-Spiel (Problemfach)`,beschreibung:`Wettbewerb gegen die Uhr! Stoppuhr stellen: Schaffst du 5 kleine Aufgaben in 15 Minuten? Jeden Tag versuchen den Rekord zu schlagen.`,typ:"spiel",fach:fach,dauer:"15 Min"});
  const liebBlock = (z)=>({zeit:z,titel:`${lieb} – als Belohnung`,beschreibung:`Zum Schluss dein Lieblingsfach: 20 Minuten in Ruhe damit beschäftigen. Das ist deine Belohnung für die ganze Arbeit heute!`,typ:"fokus",fach:lieb,dauer:"20 Min"});
  const standardTag = (extra)=>[startPause,konz,haBlock,pause("15:04"),lernBlock("15:14",fach2),pause("15:39"),spielBlock("15:49"),liebBlock("16:04"),...(extra||[])];
  return {
    titel:`${name}s persönlicher Lernplan`,
    untertitel:`Dein Plan begleitet dich durch jeden Tag – Schritt für Schritt!`,
    wusstest_du:"Wusstest du dass dein Gehirn im Schlaf das Gelernte abspeichert? Deshalb hilft Wiederholen direkt vor dem Schlafen so gut!",
    prioritaeten:[`${fach} jeden Tag üben`,"Hausaufgaben immer zuerst","Pausen einhalten"],
    fach_tipps:[
      {fach:"Mathematik",tipp:"Erst die Methode und den Lösungsweg verstehen – dann erst Aufgaben rechnen."},
      {fach:"Fremdsprachen",tipp:"Vokabeln auf Karteikarten schreiben und abends beim Essen lernen."}
    ],
    tage:{
      Mo:standardTag(),Di:standardTag(),Mi:standardTag(),Do:standardTag(),Fr:standardTag(),
      Sa:[{zeit:"10:00",titel:"Pause & Start",beschreibung:"Gemütlich in den Tag starten.",typ:"pause",dauer:"frei"},konz,lernBlock("10:30",fach),pause("10:55"),spielBlock("11:05")],
      So:[{zeit:"17:00",titel:"Woche vorbereiten",beschreibung:"Schritt 1: Schultasche für Montag packen (5 Min)\nSchritt 2: Stundenplan anschauen (5 Min)",typ:"fokus",fach:"Organisation",dauer:"10 Min"},lernBlock("17:15",fach),{zeit:"20:00",titel:"Wiederholung vor dem Schlafen",beschreibung:"20 Min: das Schwierigste der Woche nochmal anschauen.",typ:"fokus",fach:fach,dauer:"20 Min"}]
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