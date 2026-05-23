"use client";
import { useState } from "react";
import styles from "./lernplan.module.css";

const FAECHER = ["Mathematik","Deutsch","Englisch","Biologie","Chemie","Physik","Geschichte","Französisch","Latein","Informatik"];
const PROBLEME = ["Ich kann nicht konzentriert bleiben","Ich weiß nicht wo ich anfangen soll","Ich vergesse alles schnell","Ich lerne alles auf den letzten Drücker","Handy lenkt mich ab","Ich verliere den Überblick"];
const LERNTYPEN = ["Ich lese den Stoff nochmal durch","Ich mache Karteikarten","Ich schreibe alles ab","Ich erkläre es jemandem","Ich schaue YouTube-Videos","Ich weiß es nicht"];
const BLOCKADEN = ["Ich scrolle auf dem Handy","Ich sitze da und tue nichts","Ich fange an aber höre nach 5 Min auf","Ich werde gestresst","Ich vergesse es komplett"];
const ZIELE = ["Versetzung schaffen","Eine Note verbessern","Abitur bestehen","Weniger Stress","Eltern stolz machen"];
const ZUHAUSE = ["Ich habe ein ruhiges Zimmer","Es ist oft laut bei uns","Geschwister stören mich","Ich habe keinen festen Platz","Ich lerne lieber außerhalb"];
const PRUEFUNG = ["Diese Woche","In 2 Wochen","In einem Monat","Später","Keine bald"];
const SCHLAF = ["Weniger als 6 Stunden","6–7 Stunden","7–8 Stunden","Mehr als 8 Stunden","Sehr unregelmäßig"];
const FUNKTIONIERT = ["Wenn jemand mir erklärt","Wenn ich Pausen mache","Wenn ich Musik höre","Wenn ich unter Druck bin","Noch nie wirklich"];
const ZEITEN = ["Morgens (vor der Schule)","Mittags (direkt nach Schule)","Nachmittags (15–18 Uhr)","Abends (nach 18 Uhr)"];

const LOADING_MSGS = [
  "Analysiere deine Lerngewohnheiten...",
  "Erstelle deinen persönlichen Plan...",
  "Passe den Plan auf dich an...",
  "Fast fertig..."
];

export default function LernplanPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name:"", alter:"", klasse:"",
    faecher:[], probleme:[],
    lerntyp:"", blockade:"", ziel:"",
    zuhause:"", naechstePruefung:"", schlaf:"",
    wasFunktioniert:"", zeit:"", adhs:"", stunden:""
  });
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState(0);
  const [error, setError] = useState("");
  const [activeDay, setActiveDay] = useState(0);
  const [supportOpen, setSupportOpen] = useState(false);
  const [supportMsg, setSupportMsg] = useState("");
  const [supportReply, setSupportReply] = useState("");
  const [supportLoading, setSupportLoading] = useState(false);
  const [supportEscalated, setSupportEscalated] = useState(false);

  const toggleMulti = (key, val) => {
    setForm(f => ({
      ...f,
      [key]: f[key].includes(val) ? f[key].filter(x => x !== val) : [...f[key], val]
    }));
  };
  const setSingle = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const generate = async () => {
    setLoading(true);
    setError("");
    setLoadingMsg(0);
    const iv = setInterval(() => setLoadingMsg(m => (m + 1) % LOADING_MSGS.length), 2000);
    try {
      const res = await fetch("/api/lernplan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      clearInterval(iv);
      setPlan(data);
      setStep(5);
      setActiveDay(0);
    } catch {
      clearInterval(iv);
      setError("Etwas hat nicht geklappt. Bitte nochmal versuchen.");
      setLoading(false);
    }
    setLoading(false);
  };

  const sendSupport = async () => {
    if (!supportMsg.trim()) return;
    setSupportLoading(true);
    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: supportMsg, name: form.name || "Schüler" }),
      });
      const data = await res.json();
      setSupportReply(data.reply);
      setSupportEscalated(data.escalate);
    } catch {
      setSupportReply("Es tut mir leid, etwas hat nicht geklappt. Schreib uns direkt!");
      setSupportEscalated(true);
    }
    setSupportLoading(false);
  };

  const PILL = { fokus: styles.pillFokus, pause: styles.pillPause, aktiv: styles.pillAktiv, schule: styles.pillSchule };
  const PILL_LABEL = { fokus:"Fokus", pause:"Pause", aktiv:"Aktiv", schule:"Schule" };
  const RULES_COLOR = [styles.rulePurple, styles.ruleTeal, styles.ruleAmber, styles.ruleCoral];
  const tageKeys = plan ? Object.keys(plan.tage || {}) : [];

  return (
    <div className={styles.app}>

      {/* HEADER */}
      <div className={styles.header}>
        <div className={styles.logo}>L</div>
        <div>
          <h1 className={styles.headerTitle}>Lernflix Lernplan</h1>
          <p className={styles.headerSub}>Dein persönlicher Plan – entwickelt von Anna</p>
        </div>
      </div>

      {/* STEP DOTS */}
      {step < 5 && !loading && (
        <div className={styles.steps}>
          {[0,1,2,3,4].map(i => (
            <div key={i} className={`${styles.stepDot} ${i < step ? styles.stepDone : i === step ? styles.stepActive : ""}`} />
          ))}
        </div>
      )}

      {/* SCHRITT 0 – Wer bist du */}
      {step === 0 && (
        <div>
          <div className={styles.card}>
            <div className={styles.stepLabel}>Schritt 1 von 4</div>
            <h2 className={styles.cardTitle}>Wer bist du? 👋</h2>
            <div className={styles.field}>
              <label className={styles.label}>Dein Vorname</label>
              <input className={styles.input} placeholder="z.B. Max" value={form.name} onChange={e => setSingle("name", e.target.value)} />
            </div>
            <div className={styles.row2}>
              <div className={styles.field}>
                <label className={styles.label}>Alter</label>
                <select className={styles.input} value={form.alter} onChange={e => setSingle("alter", e.target.value)}>
                  <option value="">Alter...</option>
                  {[10,11,12,13,14,15,16,17,18].map(a => <option key={a}>{a}</option>)}
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Klasse</label>
                <select className={styles.input} value={form.klasse} onChange={e => setSingle("klasse", e.target.value)}>
                  <option value="">Klasse...</option>
                  {["4.","5.","6.","7.","8.","9.","10.","11.","12."].map(k => <option key={k}>{k} Klasse</option>)}
                </select>
              </div>
            </div>
          </div>
          <button className={styles.btnPrimary} disabled={!form.name || !form.alter || !form.klasse} onClick={() => setStep(1)}>
            Weiter →
          </button>
        </div>
      )}

      {/* SCHRITT 1 – Fächer & Probleme */}
      {step === 1 && (
        <div>
          <div className={styles.card}>
            <div className={styles.stepLabel}>Schritt 2 von 4</div>
            <h2 className={styles.cardTitle}>Deine Fächer & Probleme 📚</h2>
            <div className={styles.field}>
              <label className={styles.label}>Welche Fächer sind am schwersten? (mehrere möglich)</label>
              <div className={styles.chips}>
                {FAECHER.map(f => <div key={f} className={`${styles.chip} ${form.faecher.includes(f) ? styles.chipActive : ""}`} onClick={() => toggleMulti("faecher", f)}>{f}</div>)}
              </div>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Was ist dein größtes Lernproblem? (mehrere möglich)</label>
              <div className={styles.chips}>
                {PROBLEME.map(p => <div key={p} className={`${styles.chip} ${form.probleme.includes(p) ? styles.chipActive : ""}`} onClick={() => toggleMulti("probleme", p)}>{p}</div>)}
              </div>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Wie lernst du normalerweise?</label>
              <div className={styles.chips}>
                {LERNTYPEN.map(l => <div key={l} className={`${styles.chip} ${form.lerntyp === l ? styles.chipActive : ""}`} onClick={() => setSingle("lerntyp", l)}>{l}</div>)}
              </div>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Was passiert wenn du lernen sollst aber nicht kannst?</label>
              <div className={styles.chips}>
                {BLOCKADEN.map(b => <div key={b} className={`${styles.chip} ${form.blockade === b ? styles.chipActive : ""}`} onClick={() => setSingle("blockade", b)}>{b}</div>)}
              </div>
            </div>
          </div>
          <button className={styles.btnPrimary} onClick={() => setStep(2)}>Weiter →</button>
          <button className={styles.btnSecondary} onClick={() => setStep(0)}>Zurück</button>
        </div>
      )}

      {/* SCHRITT 2 – Ziele & Situation */}
      {step === 2 && (
        <div>
          <div className={styles.card}>
            <div className={styles.stepLabel}>Schritt 3 von 4</div>
            <h2 className={styles.cardTitle}>Dein Ziel & deine Situation 🎯</h2>
            <div className={styles.field}>
              <label className={styles.label}>Was ist dein Ziel bis Ende des Schuljahres?</label>
              <div className={styles.chips}>
                {ZIELE.map(z => <div key={z} className={`${styles.chip} ${form.ziel === z ? styles.chipActive : ""}`} onClick={() => setSingle("ziel", z)}>{z}</div>)}
              </div>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Wie ist deine Lernsituation zuhause?</label>
              <div className={styles.chips}>
                {ZUHAUSE.map(z => <div key={z} className={`${styles.chip} ${form.zuhause === z ? styles.chipActive : ""}`} onClick={() => setSingle("zuhause", z)}>{z}</div>)}
              </div>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Wann ist deine nächste wichtige Prüfung?</label>
              <div className={styles.chips}>
                {PRUEFUNG.map(p => <div key={p} className={`${styles.chip} ${form.naechstePruefung === p ? styles.chipActive : ""}`} onClick={() => setSingle("naechstePruefung", p)}>{p}</div>)}
              </div>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Was hat beim Lernen bisher am besten funktioniert?</label>
              <div className={styles.chips}>
                {FUNKTIONIERT.map(f => <div key={f} className={`${styles.chip} ${form.wasFunktioniert === f ? styles.chipActive : ""}`} onClick={() => setSingle("wasFunktioniert", f)}>{f}</div>)}
              </div>
            </div>
          </div>
          <button className={styles.btnPrimary} onClick={() => setStep(3)}>Weiter →</button>
          <button className={styles.btnSecondary} onClick={() => setStep(1)}>Zurück</button>
        </div>
      )}

      {/* SCHRITT 3 – Alltag */}
      {step === 3 && (
        <div>
          <div className={styles.card}>
            <div className={styles.stepLabel}>Schritt 4 von 4</div>
            <h2 className={styles.cardTitle}>Dein Alltag ⏰</h2>
            <div className={styles.field}>
              <label className={styles.label}>Wann bist du am konzentriertesten?</label>
              <div className={styles.chips}>
                {ZEITEN.map(z => <div key={z} className={`${styles.chip} ${form.zeit === z ? styles.chipActive : ""}`} onClick={() => setSingle("zeit", z)}>{z}</div>)}
              </div>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Hast du ADHS oder Konzentrationsprobleme?</label>
              <div className={styles.chips}>
                {["Ja, diagnostiziert","Ja, aber nicht offiziell","Nein, aber oft unruhig","Nein"].map(a => <div key={a} className={`${styles.chip} ${form.adhs === a ? styles.chipActive : ""}`} onClick={() => setSingle("adhs", a)}>{a}</div>)}
              </div>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Wie viel Zeit hast du täglich zum Lernen?</label>
              <div className={styles.chips}>
                {["30–60 Min.","1–2 Stunden","2–3 Stunden","3+ Stunden"].map(s => <div key={s} className={`${styles.chip} ${form.stunden === s ? styles.chipActive : ""}`} onClick={() => setSingle("stunden", s)}>{s}</div>)}
              </div>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Wie viel schläfst du normalerweise?</label>
              <div className={styles.chips}>
                {SCHLAF.map(s => <div key={s} className={`${styles.chip} ${form.schlaf === s ? styles.chipActive : ""}`} onClick={() => setSingle("schlaf", s)}>{s}</div>)}
              </div>
            </div>
          </div>
          <button className={styles.btnPrimary} disabled={!form.zeit || !form.adhs || !form.stunden} onClick={generate}>
            Meinen Plan erstellen ✦
          </button>
          <button className={styles.btnSecondary} onClick={() => setStep(2)}>Zurück</button>
        </div>
      )}

      {/* LOADING */}
      {loading && (
        <div className={styles.card} style={{ textAlign:"center", padding:"2.5rem 1rem" }}>
          <div className={styles.spinner} />
          <p className={styles.loadingTitle}>Dein persönlicher Plan wird erstellt...</p>
          <p className={styles.loadingSub}>{LOADING_MSGS[loadingMsg]}</p>
        </div>
      )}

      {/* ERROR */}
      {error && <div className={styles.errorBox}>{error} <button className={styles.retryBtn} onClick={generate}>Nochmal versuchen</button></div>}

      {/* PLAN ANZEIGE */}
      {step === 5 && plan && !loading && (
        <div>
          <div className={styles.planHeader}>
            <div className={styles.planEyebrow}>Dein persönlicher Plan</div>
            <h2 className={styles.planTitle}>{plan.titel}</h2>
            <p className={styles.planSub}>{plan.untertitel}</p>
          </div>

          {plan.wusstest_du && (
            <div className={styles.wusstestDu}>
              <span className={styles.wusstestIcon}>💡</span>
              <p>{plan.wusstest_du}</p>
            </div>
          )}

          {plan.prioritaeten && (
            <div className={styles.prioritiesBar}>
              <span className={styles.prioritiesLabel}>Deine Prioritäten · </span>
              {plan.prioritaeten.map((p, i) => <span key={i} className={styles.priority}>{i+1} {p}  </span>)}
            </div>
          )}

          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Dein Wochenplan</h2>
            <div className={styles.dayTabs}>
              {tageKeys.map((tag, i) => (
                <div key={tag} className={`${styles.dayTab} ${activeDay === i ? styles.dayTabActive : ""}`} onClick={() => setActiveDay(i)}>{tag}</div>
              ))}
            </div>
            {(plan.tage[tageKeys[activeDay]] || []).map((block, i) => (
              <div key={i} className={styles.timeBlock}>
                <div className={styles.timeCol}>
                  <div className={styles.timeLabel}>{block.zeit}</div>
                  {block.dauer && <div className={styles.durLabel}>{block.dauer}</div>}
                </div>
                <div className={styles.blockContent}>
                  <div className={styles.blockHeader}>
                    <span className={styles.blockTitle}>{block.titel}</span>
                    <span className={`${styles.pill} ${PILL[block.typ] || styles.pillFokus}`}>{PILL_LABEL[block.typ] || block.typ}</span>
                  </div>
                  <p className={styles.blockDesc}>{block.beschreibung}</p>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Annas Tipps für dich</h2>
            <div className={styles.tipsGrid}>
              {plan.tipps?.map((t, i) => (
                <div key={i} className={styles.tipCard}>
                  <div className={styles.tipLabel}>{t.label}</div>
                  <div className={styles.tipText}>{t.text}</div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Deine Erfolgs-Regeln</h2>
            {plan.regeln?.map((r, i) => (
              <div key={i} className={`${styles.ruleCard} ${RULES_COLOR[i % 4]}`}>{r}</div>
            ))}
          </div>

          <button className={styles.btnSecondary} style={{marginTop:"0.5rem"}} onClick={() => { setStep(0); setPlan(null); setForm({ name:"",alter:"",klasse:"",faecher:[],probleme:[],lerntyp:"",blockade:"",ziel:"",zuhause:"",naechstePruefung:"",schlaf:"",wasFunktioniert:"",zeit:"",adhs:"",stunden:"" }); }}>
            Neuen Plan erstellen
          </button>
        </div>
      )}

      {/* SUPPORT BUTTON – immer sichtbar */}
      <div className={styles.supportWrapper}>
        {supportOpen && (
          <div className={styles.supportBox}>
            <div className={styles.supportHeader}>
              <span>💬 Hilfe & Support</span>
              <button className={styles.supportClose} onClick={() => { setSupportOpen(false); setSupportMsg(""); setSupportReply(""); setSupportEscalated(false); }}>✕</button>
            </div>

            {!supportReply ? (
              <div>
                <p className={styles.supportIntro}>Hast du ein Problem mit deinem Lernplan? Schreib uns – wir helfen sofort!</p>
                <textarea
                  className={styles.supportInput}
                  placeholder="z.B. Mein Plan hat nicht geladen... oder Der Plan passt nicht zu mir..."
                  value={supportMsg}
                  onChange={e => setSupportMsg(e.target.value)}
                  rows={3}
                />
                <button className={styles.btnPrimary} disabled={!supportMsg.trim() || supportLoading} onClick={sendSupport}>
                  {supportLoading ? "Wird bearbeitet..." : "Absenden"}
                </button>
              </div>
            ) : (
              <div>
                <div className={styles.supportReply}>
                  <span className={styles.supportReplyIcon}>💜</span>
                  <p>{supportReply}</p>
                </div>
                {supportEscalated && (
                  <div className={styles.supportEscalate}>
                    <p className={styles.supportEscalateTitle}>Direkt mit Anna sprechen:</p>
                    <a href="https://wa.me/4917624700519?text=Hallo%20Anna%2C%20ich%20brauche%20Hilfe%20mit%20meinem%20Lernplan." className={styles.waBtn} target="_blank" rel="noopener noreferrer">
                      💬 WhatsApp schreiben
                    </a>
                    <a href="mailto:lernemitanna@outlook.com?subject=Hilfe%20mit%20meinem%20Lernplan" className={styles.mailBtn} target="_blank" rel="noopener noreferrer">
                      📧 E-Mail schreiben
                    </a>
                  </div>
                )}
                <button className={styles.btnSecondary} style={{marginTop:"0.75rem"}} onClick={() => { setSupportMsg(""); setSupportReply(""); setSupportEscalated(false); }}>
                  Neue Frage stellen
                </button>
              </div>
            )}
          </div>
        )}
        <button className={styles.supportBtn} onClick={() => setSupportOpen(o => !o)}>
          {supportOpen ? "✕" : "💬 Hilfe"}
        </button>
      </div>

    </div>
  );
}