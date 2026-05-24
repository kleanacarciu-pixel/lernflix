"use client";
import { useState, useEffect } from "react";

const THEMES = {
  rose: { name:"Rosa & Türkis", emoji:"🌸", bg:"#FDF9F5", surface:"#FFFFFF", primary:"#2A7A78", primaryLight:"#E8F5F4", accent:"#C4919C", accentLight:"#F9EEF0", beige:"#F5EDE0", beigeText:"#8B6F47", text:"#2C2422", text2:"#7A6A64", text3:"#AFA098", border:"#EAE0D6", gold:"#C8A96E", headerBg:"#2A7A78", tip:["#E8F5F4","#F9EEF0","#F5EDE0","#F0EDF8"], rule:[["#E8F5F4","#2A7A78"],["#F9EEF0","#C4919C"],["#F5EDE0","#8B6F47"],["#F0EDF8","#7A6AAA"]] },
  navy: { name:"Navy & Grün", emoji:"⚡", bg:"#F4F7FA", surface:"#FFFFFF", primary:"#1C3A6E", primaryLight:"#E8EFF8", accent:"#2D7A4F", accentLight:"#E8F4EE", beige:"#E8EFF8", beigeText:"#2D5A9E", text:"#1C2A3A", text2:"#5A6A7A", text3:"#8A9AAA", border:"#D8E4F0", gold:"#4A9AAE", headerBg:"#1C3A6E", tip:["#E8EFF8","#E8F4EE","#EEF3F8","#E8F0F8"], rule:[["#E8EFF8","#1C3A6E"],["#E8F4EE","#2D7A4F"],["#EEF3F8","#2D5A9E"],["#E8F0F8","#1C3A6E"]] },
  gold: { name:"Gold & Beige", emoji:"✨", bg:"#FAF7F2", surface:"#FFFFFF", primary:"#8B6F47", primaryLight:"#FDF0E0", accent:"#C8A96E", accentLight:"#FDF5E8", beige:"#FDF0E0", beigeText:"#6B4F2A", text:"#2C2010", text2:"#7A6040", text3:"#AFA080", border:"#E8D8C0", gold:"#C8A96E", headerBg:"#8B6F47", tip:["#FDF0E0","#FDF5E8","#FAF7F2","#F5EDE0"], rule:[["#FDF0E0","#8B6F47"],["#FDF5E8","#C8A96E"],["#FAF7F2","#6B4F2A"],["#F5EDE0","#8B6F47"]] }
};

const SCHULTYPEN = ["Grundschule","Hauptschule","Realschule","Gymnasium","Privatschule","Weiß ich nicht"];
const DAYS_SHORT = ["Mo","Di","Mi","Do","Fr","Sa","So"];
const DAYS_LONG = ["Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag","Sonntag"];
const SCHWACHE_FAECHER = ["Mathematik","Deutsch","Englisch","Biologie","Chemie","Physik","Geschichte","Französisch","Latein","Informatik"];
const LERNPROBLEME = ["Ich kann mich nicht konzentrieren","Ich weiß nicht wo ich anfangen soll","Ich vergesse alles wieder","Ich schiebe es immer auf","Handy lenkt mich ab","Ich verstehe den Stoff nicht","Ich habe keine Zeit","Weiß ich nicht"];
const LERNTYPEN = ["Ich lese nochmal durch","Ich mache Karteikarten","Ich schreibe alles ab","Ich erkläre es laut","Ich schaue YouTube Videos","Ich brauche jemanden der es mir erklärt","Weiß ich nicht"];
const ZIELE = ["Versetzung schaffen","Meine Note verbessern","Abitur bestehen","Weniger Stress","Weiß ich nicht"];
const LOADING_MSGS = ["Schaue mir deinen Stundenplan an...","Analysiere deinen Alltag...","Erstelle deinen persönlichen Plan nach Annas Methode...","Fast fertig..."];
const PILLLABEL = {fokus:"Lernen 📖", pause:"Pause 🌿", aktiv:"Aktiv ⚡", schule:"Schule 🎒"};

const emptyStundenplan = () => DAYS_LONG.map(tag => ({ tag, schule:"", faecher:"", nachmittag:"", hausaufgaben:"" }));


// ===== SUPPORT WIDGET (ausgelagert - verhindert dass das Textfeld den Fokus verliert) =====
function SupportWidget({ t, open, setOpen, msg, setMsg, reply, setReply, loading, escalated, setEscalated, showNachhilfe, setShowNachhilfe, onSend }) {
  const inp = { width:"100%", padding:"14px 16px", border:`2px solid ${t.border}`, borderRadius:"16px", fontSize:"16px", color:t.text, background:t.surface, outline:"none", fontFamily:"system-ui,sans-serif" };
  const bigBtn = { width:"100%", padding:"15px", background:t.primary, color:"#fff", border:"none", borderRadius:"16px", fontSize:"16px", fontWeight:"700", cursor:"pointer", marginTop:"10px" };
  const secBtn = { width:"100%", padding:"13px", background:"transparent", color:t.text2, border:`2px solid ${t.border}`, borderRadius:"16px", fontSize:"15px", cursor:"pointer", marginTop:"8px" };
  const reset = () => { setOpen(false); setMsg(""); setReply(""); setEscalated(false); setShowNachhilfe(false); };
  return (
    <div style={{position:"fixed", bottom:"20px", right:"16px", zIndex:100, display:"flex", flexDirection:"column", alignItems:"flex-end", gap:"10px"}}>
      {open && (
        <div style={{background:t.surface, border:`1.5px solid ${t.border}`, borderRadius:"20px", padding:"1.25rem", width:"300px", maxWidth:"calc(100vw - 32px)", boxShadow:"0 8px 40px rgba(0,0,0,.15)"}}>
          <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1rem"}}>
            <span style={{fontSize:"18px", fontWeight:"700", color:t.text}}>💬 Hilfe</span>
            <button style={{background:"none", border:"none", color:t.text3, cursor:"pointer", fontSize:"22px", lineHeight:1}} onClick={reset}>✕</button>
          </div>
          {!reply ? (
            <div>
              <p style={{fontSize:"15px", color:t.text2, lineHeight:"1.6", marginBottom:"1rem"}}>Was ist dein Problem oder deine Frage? Ich helfe dir sofort!</p>
              <textarea
                style={{...inp, resize:"none", fontSize:"15px", minHeight:"90px", lineHeight:"1.5"}}
                placeholder="z.B. Mein Plan lädt nicht... Was bedeutet Fokus-Block?... Hilfe bei Mathe Aufgabe..."
                value={msg}
                onChange={e => setMsg(e.target.value)}
                rows={3}
              />
              <button style={bigBtn} disabled={!msg.trim() || loading} onClick={onSend}>
                {loading ? "Einen Moment..." : "Absenden ✓"}
              </button>
              <div style={{marginTop:"14px", paddingTop:"14px", borderTop:`1px solid ${t.border}`}}>
                <p style={{fontSize:"13px", color:t.text3, marginBottom:"8px", fontWeight:"700"}}>SCHWERE AUFGABE ODER NACHHILFE?</p>
                <a href="https://wa.me/4917624700519?text=Hallo%20Anna%2C%20ich%20brauche%20Hilfe." style={{display:"block", padding:"12px", background:"#25D366", color:"#fff", borderRadius:"14px", textAlign:"center", textDecoration:"none", fontSize:"15px", fontWeight:"700"}} target="_blank" rel="noopener noreferrer">💬 Anna direkt auf WhatsApp</a>
              </div>
            </div>
          ) : (
            <div>
              <div style={{background:t.primaryLight, borderRadius:"14px", padding:"1rem", marginBottom:"1rem", fontSize:"15px", color:t.primary, lineHeight:"1.7"}}>{reply}</div>
              {(escalated || showNachhilfe) && (
                <div style={{display:"flex", flexDirection:"column", gap:"8px", marginBottom:"1rem"}}>
                  <a href="https://wa.me/4917624700519?text=Hallo%20Anna%2C%20ich%20brauche%20Hilfe%20mit%20meinem%20Lernplan." style={{display:"block", padding:"13px", background:"#25D366", color:"#fff", borderRadius:"14px", textAlign:"center", textDecoration:"none", fontSize:"15px", fontWeight:"700"}} target="_blank" rel="noopener noreferrer">💬 WhatsApp – Anna meldet sich schnell!</a>
                  {escalated && <a href="mailto:lernemitanna@outlook.com?subject=Hilfe%20Lernplan" style={{display:"block", padding:"13px", background:t.primary, color:"#fff", borderRadius:"14px", textAlign:"center", textDecoration:"none", fontSize:"15px", fontWeight:"700"}} target="_blank" rel="noopener noreferrer">📧 E-Mail schreiben</a>}
                </div>
              )}
              <button style={secBtn} onClick={() => { setMsg(""); setReply(""); setEscalated(false); setShowNachhilfe(false); }}>Neue Frage stellen</button>
            </div>
          )}
        </div>
      )}
      <button style={{background:t.primary, color:"#fff", border:"none", borderRadius:"50px", padding:"14px 22px", fontSize:"16px", fontWeight:"700", cursor:"pointer", boxShadow:`0 4px 20px ${t.primary}55`}} onClick={() => setOpen(o => !o)}>
        {open ? "✕ Schließen" : "💬 Hilfe"}
      </button>
    </div>
  );
}

export default function LernplanPage() {
  const [themeKey, setThemeKey] = useState(null);
  const [screen, setScreen] = useState("theme");
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name:"", alter:"", klasse:"", schultyp:"",
    stundenplan: emptyStundenplan(),
    schwacheFaecher:[], lieblingsfach:"", einfachesFach:"",
    lernprobleme:[], lerntyp:"", adhs:"", ziel:""
  });
  const [plan, setPlan] = useState(null);
  const [loadingMsg, setLoadingMsg] = useState(0);
  const [error, setError] = useState("");
  const [activeDay, setActiveDay] = useState(0);
  const [checked, setChecked] = useState({});
  const [notes, setNotes] = useState({});
  const [noteOpen, setNoteOpen] = useState(null);
  const [noteText, setNoteText] = useState("");
  const [supportOpen, setSupportOpen] = useState(false);
  const [supportMsg, setSupportMsg] = useState("");
  const [supportReply, setSupportReply] = useState("");
  const [supportLoading, setSupportLoading] = useState(false);
  const [supportEscalated, setSupportEscalated] = useState(false);
  const [showNachhilfe, setShowNachhilfe] = useState(false);
  const [weekProgress, setWeekProgress] = useState(0);

  const t = themeKey ? THEMES[themeKey] : THEMES.rose;

  useEffect(() => {
    try {
      const sk = localStorage.getItem("anna_theme");
      const sp = localStorage.getItem("anna_lernplan");
      const sc = localStorage.getItem("anna_checked");
      const sn = localStorage.getItem("anna_notes");
      if (sk) setThemeKey(sk);
      if (sp) { setPlan(JSON.parse(sp)); setScreen(sk ? "plan" : "theme"); }
      if (sc) setChecked(JSON.parse(sc));
      if (sn) setNotes(JSON.parse(sn));
    } catch {}
  }, []);

  useEffect(() => {
    if (!plan) return;
    const total = Object.values(plan.tage || {}).flat().filter(b => b.typ === "fokus").length;
    const done = Object.values(checked).filter(Boolean).length;
    setWeekProgress(total > 0 ? Math.round((done / total) * 100) : 0);
  }, [checked, plan]);

  const saveChecked = (v) => { setChecked(v); try { localStorage.setItem("anna_checked", JSON.stringify(v)); } catch {} };
  const saveNote = (k, v) => { const n = {...notes, [k]:v}; setNotes(n); try { localStorage.setItem("anna_notes", JSON.stringify(n)); } catch {} };
  const pickTheme = (key) => { setThemeKey(key); try { localStorage.setItem("anna_theme", key); } catch {} };
  const toggleMulti = (key, val) => setForm(f => ({...f, [key]: f[key].includes(val) ? f[key].filter(x => x !== val) : [...f[key], val]}));
  const setSingle = (key, val) => setForm(f => ({...f, [key]: val}));
  const setStundenplan = (i, field, val) => setForm(f => { const sp = [...f.stundenplan]; sp[i] = {...sp[i], [field]: val}; return {...f, stundenplan: sp}; });

  const generate = async () => {
    setScreen("loading"); setError(""); setLoadingMsg(0);
    const iv = setInterval(() => setLoadingMsg(m => (m + 1) % LOADING_MSGS.length), 2500);
    try {
      const prevNotes = Object.entries(notes).map(([k,v]) => `${k}: ${v}`).join(" | ");
      const res = await fetch("/api/lernplan", {
        method: "POST", headers: {"Content-Type":"application/json"},
        body: JSON.stringify({...form, previousNotes: prevNotes})
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      clearInterval(iv); setPlan(data); setChecked({}); setScreen("plan");
      try { localStorage.setItem("anna_lernplan", JSON.stringify(data)); localStorage.setItem("anna_checked", "{}"); } catch {}
    } catch {
      clearInterval(iv); setError("Etwas hat nicht geklappt. Bitte nochmal versuchen."); setScreen("form");
    }
  };

  const sendSupport = async () => {
    if (!supportMsg.trim()) return;
    setSupportLoading(true);
    try {
      const res = await fetch("/api/support", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({message:supportMsg, name:form.name||"Schüler"}) });
      const data = await res.json();
      setSupportReply(data.reply); setSupportEscalated(data.escalate||false); setShowNachhilfe(data.showNachhilfe||false);
    } catch { setSupportReply("Versuch die Seite neu zu laden. Wenn das nicht klappt, schreib Anna direkt auf WhatsApp!"); setSupportEscalated(true); }
    setSupportLoading(false);
  };

  const tageKeys = plan ? Object.keys(plan.tage || {}) : [];
  const todayBlocks = plan ? (plan.tage[tageKeys[activeDay]] || []) : [];

  const base = { fontFamily:"system-ui,sans-serif", background:t.bg, minHeight:"100vh", color:t.text };
  const bigBtn = { width:"100%", padding:"18px", background:t.primary, color:"#fff", border:"none", borderRadius:"20px", fontSize:"18px", fontWeight:"700", cursor:"pointer", marginTop:"12px" };
  const secBtn = { width:"100%", padding:"15px", background:"transparent", color:t.text2, border:`2px solid ${t.border}`, borderRadius:"20px", fontSize:"16px", cursor:"pointer", marginTop:"8px" };
  const inp = { width:"100%", padding:"14px 16px", border:`2px solid ${t.border}`, borderRadius:"16px", fontSize:"16px", color:t.text, background:t.surface, outline:"none", fontFamily:"system-ui,sans-serif" };
  const chipBase = { padding:"11px 18px", borderRadius:"50px", border:`2px solid ${t.border}`, background:t.surface, fontSize:"15px", color:t.text2, cursor:"pointer", display:"inline-block", margin:"5px", fontWeight:"400" };
  const chipAct = { ...chipBase, background:t.primary, borderColor:t.primary, color:"#fff", fontWeight:"700", boxShadow:`0 4px 12px ${t.primary}33` };

  const Chip = ({label, active, onClick}) => (
    <div onClick={onClick} style={active ? chipAct : chipBase}>{label}</div>
  );

  // SupportBox + SupportFloat sind ausgelagert (verhindert Tastatur-Bug)

  // THEME
  if (screen === "theme") return (
    <div style={{...base, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"2rem 1.25rem", minHeight:"100vh"}}>
      <div style={{textAlign:"center", marginBottom:"2rem"}}>
        <div style={{width:"72px", height:"72px", background:t.primary, borderRadius:"18px", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"Georgia,serif", fontSize:"32px", color:"#fff", margin:"0 auto 1.25rem", boxShadow:`0 8px 24px ${t.primary}44`}}>A</div>
        <h1 style={{fontSize:"28px", fontWeight:"700", color:t.text, marginBottom:".5rem"}}>Wähle dein Design! 🎨</h1>
        <p style={{fontSize:"16px", color:t.text2}}>Du kannst es jederzeit ändern</p>
      </div>
      {Object.entries(THEMES).map(([key, th]) => (
        <div key={key} onClick={() => pickTheme(key)} style={{background:th.bg, border:`3px solid ${themeKey===key?th.primary:th.border}`, borderRadius:"20px", padding:"1.1rem 1.25rem", marginBottom:"12px", cursor:"pointer", width:"100%", maxWidth:"400px", display:"flex", alignItems:"center", gap:"14px", boxShadow:themeKey===key?`0 4px 20px ${th.primary}33`:"none", transition:"all .15s"}}>
          <div style={{width:"52px", height:"52px", background:th.headerBg, borderRadius:"13px", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"Georgia,serif", fontSize:"24px", color:"#fff", flexShrink:0}}>A</div>
          <div style={{flex:1}}>
            <div style={{fontSize:"18px", fontWeight:"700", color:th.text, marginBottom:"6px"}}>{th.emoji} {th.name}</div>
            <div style={{display:"flex", gap:"6px"}}>{[th.primary,th.accent,th.beige,th.accentLight].map((c,i)=><div key={i} style={{width:"20px", height:"20px", borderRadius:"50%", background:c, border:`1px solid ${th.border}`}}/>)}</div>
          </div>
          {themeKey===key && <span style={{fontSize:"26px"}}>✓</span>}
        </div>
      ))}
      <button style={{...bigBtn, maxWidth:"400px"}} disabled={!themeKey} onClick={() => plan ? setScreen("plan") : setScreen("home")}>
        {plan ? "Zum Plan →" : "Los geht's! →"}
      </button>
      <SupportWidget t={t} open={supportOpen} setOpen={setSupportOpen} msg={supportMsg} setMsg={setSupportMsg} reply={supportReply} setReply={setSupportReply} loading={supportLoading} escalated={supportEscalated} setEscalated={setSupportEscalated} showNachhilfe={showNachhilfe} setShowNachhilfe={setShowNachhilfe} onSend={sendSupport} />
    </div>
  );

  // HOME
  if (screen === "home") return (
    <div style={{...base, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"2rem 1.5rem", textAlign:"center", position:"relative", overflow:"hidden", minHeight:"100vh"}}>
      <div style={{position:"absolute", top:0, left:0, right:0, height:"300px", background:`linear-gradient(180deg,${t.accentLight} 0%,transparent 100%)`, opacity:.8}}/>
      <div style={{position:"relative", zIndex:1, maxWidth:"400px", width:"100%"}}>
        <div style={{width:"80px", height:"80px", background:t.primary, borderRadius:"22px", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"Georgia,serif", fontSize:"36px", color:"#fff", margin:"0 auto 1.5rem", boxShadow:`0 10px 30px ${t.primary}44`}}>A</div>
        <p style={{fontSize:"14px", color:t.accent, textTransform:"uppercase", letterSpacing:".14em", marginBottom:".75rem", fontWeight:"700"}}>Lerne mit Anna</p>
        <h1 style={{fontSize:"34px", fontWeight:"700", color:t.text, fontFamily:"Georgia,serif", lineHeight:"1.2", marginBottom:"1rem"}}>Dein persönlicher<br/>Lernplan</h1>
        <p style={{fontSize:"17px", color:t.text2, lineHeight:"1.75", marginBottom:"2.5rem"}}>Entwickelt aus echter Erfahrung – realistisch, strukturiert und genau auf deinen Alltag zugeschnitten.</p>
        <button style={bigBtn} onClick={() => setScreen("form")}>Meinen Plan erstellen ✦</button>
        <button style={{...secBtn, border:"none", color:t.text3, fontSize:"14px"}} onClick={() => setScreen("theme")}>Design ändern</button>
        <p style={{fontSize:"13px", color:t.text3, marginTop:".75rem"}}>Kostenlos · Für dich · In 5 Minuten fertig</p>
      </div>
      <SupportWidget t={t} open={supportOpen} setOpen={setSupportOpen} msg={supportMsg} setMsg={setSupportMsg} reply={supportReply} setReply={setSupportReply} loading={supportLoading} escalated={supportEscalated} setEscalated={setSupportEscalated} showNachhilfe={showNachhilfe} setShowNachhilfe={setShowNachhilfe} onSend={sendSupport} />
    </div>
  );

  // LOADING
  if (screen === "loading") return (
    <div style={{minHeight:"100vh", background:t.headerBg, display:"flex", alignItems:"center", justifyContent:"center"}}>
      <div style={{textAlign:"center", padding:"2rem"}}>
        <div style={{width:"64px", height:"64px", background:"rgba(255,255,255,.18)", borderRadius:"16px", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"Georgia,serif", fontSize:"28px", color:"#fff", margin:"0 auto 2rem"}}>A</div>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}@keyframes pulse{0%,100%{opacity:.3}50%{opacity:1}}`}</style>
        <div style={{width:"44px", height:"44px", border:"4px solid rgba(255,255,255,.2)", borderTopColor:"#fff", borderRadius:"50%", animation:"spin .8s linear infinite", margin:"0 auto 1.5rem"}}/>
        <p style={{fontSize:"20px", fontWeight:"700", color:"#fff", marginBottom:".75rem"}}>Dein Plan wird erstellt...</p>
        <p style={{fontSize:"16px", color:"rgba(255,255,255,.6)"}}>{LOADING_MSGS[loadingMsg]}</p>
        <div style={{display:"flex", gap:"8px", justifyContent:"center", marginTop:"1.5rem"}}>
          {[0,1,2].map(i => <div key={i} style={{width:"10px", height:"10px", borderRadius:"50%", background:"#fff", animation:`pulse 1.2s ${i*.2}s ease-in-out infinite`}}/>)}
        </div>
      </div>
    </div>
  );

  // FORM
  if (screen === "form") {
    const steps = [
      // STEP 0 – Wer bist du
      <div key={0}>
        <div style={{fontSize:"52px", textAlign:"center", marginBottom:"1rem"}}>👋</div>
        <h2 style={{fontSize:"28px", fontWeight:"700", color:t.text, textAlign:"center", marginBottom:".5rem"}}>Wer bist du?</h2>
        <p style={{fontSize:"17px", color:t.text2, textAlign:"center", marginBottom:"2rem"}}>Damit dein Plan wirklich zu dir passt!</p>
        <div style={{marginBottom:"1.5rem"}}>
          <label style={{display:"block", fontSize:"18px", color:t.text, marginBottom:"10px", fontWeight:"700"}}>Wie heißt du? 😊</label>
          <input style={{...inp, fontSize:"18px"}} placeholder="Dein Vorname..." value={form.name} onChange={e => setSingle("name", e.target.value)}/>
        </div>
        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px", marginBottom:"1.5rem"}}>
          <div>
            <label style={{display:"block", fontSize:"18px", color:t.text, marginBottom:"10px", fontWeight:"700"}}>Alter</label>
            <select style={{...inp, fontSize:"17px"}} value={form.alter} onChange={e => setSingle("alter", e.target.value)}>
              <option value="">Alter...</option>
              {[8,9,10,11,12,13,14,15,16,17,18,19].map(a => <option key={a}>{a}</option>)}
            </select>
          </div>
          <div>
            <label style={{display:"block", fontSize:"18px", color:t.text, marginBottom:"10px", fontWeight:"700"}}>Klasse</label>
            <select style={{...inp, fontSize:"17px"}} value={form.klasse} onChange={e => setSingle("klasse", e.target.value)}>
              <option value="">Klasse...</option>
              {["3.","4.","5.","6.","7.","8.","9.","10.","11.","12."].map(k => <option key={k}>{k} Klasse</option>)}
            </select>
          </div>
        </div>
        <div style={{marginBottom:"1.5rem"}}>
          <label style={{display:"block", fontSize:"18px", color:t.text, marginBottom:"10px", fontWeight:"700"}}>Welche Schule? 🏫</label>
          <div style={{display:"flex", flexWrap:"wrap"}}>{SCHULTYPEN.map(s => <Chip key={s} label={s} active={form.schultyp===s} onClick={() => setSingle("schultyp", s)}/>)}</div>
        </div>
        <button style={bigBtn} disabled={!form.name || !form.alter || !form.klasse} onClick={() => setStep(1)}>Weiter →</button>
      </div>,

      // STEP 1 – Stundenplan Tabelle
      <div key={1}>
        <div style={{fontSize:"52px", textAlign:"center", marginBottom:"1rem"}}>📅</div>
        <h2 style={{fontSize:"28px", fontWeight:"700", color:t.text, textAlign:"center", marginBottom:".5rem"}}>Dein Wochenplan</h2>
        <p style={{fontSize:"17px", color:t.text2, textAlign:"center", marginBottom:".75rem"}}>Füll aus was du weißt – lass frei was du nicht weißt!</p>
        <div style={{background:t.beige, borderRadius:"14px", padding:"1rem", marginBottom:"1.5rem", fontSize:"15px", color:t.beigeText, lineHeight:"1.65"}}>
          💡 <strong>Tipp:</strong> Schreib z.B. "Schule: 8-13 Uhr" · "Fächer: Mathe, Bio" · "Nachmittag: Fußball 16-18 Uhr" · "Hausaufgaben: Mathe S.47"
        </div>
        <div style={{overflowX:"auto", borderRadius:"16px", border:`2px solid ${t.border}`, marginBottom:"1.5rem"}}>
          <table style={{width:"100%", borderCollapse:"collapse", minWidth:"500px"}}>
            <thead>
              <tr style={{background:t.bg}}>
                {["Tag","Schule (von–bis)","Fächer heute","Nachmittag","Hausaufgaben"].map((h,i) => (
                  <th key={i} style={{padding:"12px 10px", fontSize:"14px", fontWeight:"700", color:t.text2, textAlign:i===0?"left":"center", borderBottom:`2px solid ${t.border}`, whiteSpace:"nowrap"}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {form.stundenplan.map((day, i) => (
                <tr key={i} style={{borderBottom:i<6?`1px solid ${t.border}`:"none"}}>
                  <td style={{padding:"10px", fontSize:"15px", fontWeight:"700", color:t.text, whiteSpace:"nowrap"}}>{["Mo 📚","Di 📚","Mi 📚","Do 📚","Fr 📚","Sa 🌤️","So 🌤️"][i]}</td>
                  {["schule","faecher","nachmittag","hausaufgaben"].map(field => (
                    <td key={field} style={{padding:"6px 8px"}}>
                      <textarea
                        value={day[field]}
                        onChange={e => setStundenplan(i, field, e.target.value)}
                        placeholder={field==="schule"?"8:00–13:30":field==="faecher"?"Mathe, Bio":field==="nachmittag"?"Fußball 16–18":"Mathe S.47"}
                        style={{width:"100%", padding:"8px 10px", border:`1.5px solid ${t.border}`, borderRadius:"10px", fontSize:"14px", color:t.text, background:t.surface, outline:"none", resize:"none", fontFamily:"system-ui,sans-serif", lineHeight:"1.4"}}
                        rows={2}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button style={bigBtn} onClick={() => setStep(2)}>Weiter →</button>
        <button style={secBtn} onClick={() => setStep(0)}>← Zurück</button>
      </div>,

      // STEP 2 – Fächer & Lernen
      <div key={2}>
        <div style={{fontSize:"52px", textAlign:"center", marginBottom:"1rem"}}>📚</div>
        <h2 style={{fontSize:"28px", fontWeight:"700", color:t.text, textAlign:"center", marginBottom:".5rem"}}>Fächer & Lernen</h2>
        <p style={{fontSize:"17px", color:t.text2, textAlign:"center", marginBottom:"2rem"}}>Je ehrlicher du bist, desto besser wird dein Plan!</p>
        <div style={{marginBottom:"1.5rem"}}>
          <label style={{display:"block", fontSize:"18px", color:t.text, marginBottom:"10px", fontWeight:"700"}}>In welchen Fächern brauchst du Hilfe? 😰 <span style={{fontSize:"14px", color:t.text3, fontWeight:"400"}}>(mehrere möglich)</span></label>
          <div style={{display:"flex", flexWrap:"wrap"}}>{SCHWACHE_FAECHER.map(f => <Chip key={f} label={f} active={form.schwacheFaecher.includes(f)} onClick={() => toggleMulti("schwacheFaecher", f)}/>)}</div>
        </div>
        <div style={{marginBottom:"1.5rem"}}>
          <label style={{display:"block", fontSize:"18px", color:t.text, marginBottom:"10px", fontWeight:"700"}}>Was ist dein einfachstes Fach? 😊</label>
          <div style={{display:"flex", flexWrap:"wrap"}}>{[...SCHWACHE_FAECHER, "Weiß ich nicht"].map(f => <Chip key={f} label={f} active={form.einfachesFach===f} onClick={() => setSingle("einfachesFach", f)}/>)}</div>
        </div>
        <div style={{marginBottom:"1.5rem"}}>
          <label style={{display:"block", fontSize:"18px", color:t.text, marginBottom:"10px", fontWeight:"700"}}>Was ist dein Lieblingsfach? ❤️</label>
          <div style={{display:"flex", flexWrap:"wrap"}}>{[...SCHWACHE_FAECHER, "Weiß ich nicht"].map(f => <Chip key={f} label={f} active={form.lieblingsfach===f} onClick={() => setSingle("lieblingsfach", f)}/>)}</div>
        </div>
        <div style={{marginBottom:"1.5rem"}}>
          <label style={{display:"block", fontSize:"18px", color:t.text, marginBottom:"10px", fontWeight:"700"}}>Was macht das Lernen schwer? 😤 <span style={{fontSize:"14px", color:t.text3, fontWeight:"400"}}>(mehrere möglich)</span></label>
          <div style={{display:"flex", flexWrap:"wrap"}}>{LERNPROBLEME.map(p => <Chip key={p} label={p} active={form.lernprobleme.includes(p)} onClick={() => toggleMulti("lernprobleme", p)}/>)}</div>
        </div>
        <div style={{marginBottom:"1.5rem"}}>
          <label style={{display:"block", fontSize:"18px", color:t.text, marginBottom:"10px", fontWeight:"700"}}>Wie lernst du am besten? 🧠</label>
          <div style={{display:"flex", flexWrap:"wrap"}}>{LERNTYPEN.map(l => <Chip key={l} label={l} active={form.lerntyp===l} onClick={() => setSingle("lerntyp", l)}/>)}</div>
        </div>
        <button style={bigBtn} onClick={() => setStep(3)}>Weiter →</button>
        <button style={secBtn} onClick={() => setStep(1)}>← Zurück</button>
      </div>,

      // STEP 3 – Ziel & ADHS
      <div key={3}>
        <div style={{fontSize:"52px", textAlign:"center", marginBottom:"1rem"}}>🎯</div>
        <h2 style={{fontSize:"28px", fontWeight:"700", color:t.text, textAlign:"center", marginBottom:".5rem"}}>Dein Ziel</h2>
        <p style={{fontSize:"17px", color:t.text2, textAlign:"center", marginBottom:"2rem"}}>Was möchtest du erreichen?</p>
        <div style={{marginBottom:"1.5rem"}}>
          <label style={{display:"block", fontSize:"18px", color:t.text, marginBottom:"10px", fontWeight:"700"}}>Was ist dein Ziel? ⭐</label>
          <div style={{display:"flex", flexWrap:"wrap"}}>{ZIELE.map(z => <Chip key={z} label={z} active={form.ziel===z} onClick={() => setSingle("ziel", z)}/>)}</div>
        </div>
        <div style={{marginBottom:"1.5rem"}}>
          <label style={{display:"block", fontSize:"18px", color:t.text, marginBottom:"10px", fontWeight:"700"}}>Hast du ADHS oder Konzentrationsprobleme? 🧩</label>
          <div style={{display:"flex", flexWrap:"wrap"}}>{["Ja, offiziell diagnostiziert","Ja, aber nicht offiziell","Manchmal bin ich schnell abgelenkt","Nein","Weiß ich nicht"].map(a => <Chip key={a} label={a} active={form.adhs===a} onClick={() => setSingle("adhs", a)}/>)}</div>
        </div>
        <button style={{...bigBtn, fontSize:"20px", padding:"22px"}} disabled={!form.ziel || !form.adhs} onClick={generate}>
          Meinen Plan erstellen ✦
        </button>
        <button style={secBtn} onClick={() => setStep(2)}>← Zurück</button>
      </div>
    ];

    return (
      <div style={base}>
        <div style={{background:t.surface, padding:"1rem 1.25rem", borderBottom:`2px solid ${t.border}`, display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:10}}>
          <button style={{background:"none", border:"none", fontSize:"17px", color:t.text2, cursor:"pointer", padding:"4px 8px"}} onClick={() => step === 0 ? setScreen("home") : setStep(s => s-1)}>← Zurück</button>
          <span style={{fontSize:"17px", fontWeight:"700", color:t.text}}>Lerne mit Anna</span>
          <span style={{fontSize:"16px", color:t.text3, fontWeight:"600"}}>{step+1} / 4</span>
        </div>
        <div style={{height:"6px", background:t.border}}>
          <div style={{height:"100%", width:`${((step+1)/4)*100}%`, background:t.primary, transition:"width .4s", borderRadius:"0 3px 3px 0"}}/>
        </div>
        <div style={{padding:"1.5rem 1.25rem 5rem", maxWidth:"600px", margin:"0 auto"}}>
          {error && <div style={{background:t.accentLight, color:t.accent, borderRadius:"14px", padding:"1rem 1.25rem", marginBottom:"1rem", fontSize:"16px", display:"flex", justifyContent:"space-between", alignItems:"center"}}>{error}<button style={{padding:"8px 14px", background:t.accent, color:"#fff", border:"none", borderRadius:"10px", fontSize:"14px", cursor:"pointer", fontWeight:"700"}} onClick={generate}>Nochmal</button></div>}
          {steps[step]}
        </div>
        <SupportWidget t={t} open={supportOpen} setOpen={setSupportOpen} msg={supportMsg} setMsg={setSupportMsg} reply={supportReply} setReply={setSupportReply} loading={supportLoading} escalated={supportEscalated} setEscalated={setSupportEscalated} showNachhilfe={showNachhilfe} setShowNachhilfe={setShowNachhilfe} onSend={sendSupport} />
      </div>
    );
  }

  // PLAN SCREEN
  return (
    <div style={base}>
      <div style={{background:t.headerBg, padding:"1.5rem 1.25rem 2rem"}}>
        <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"1.5rem"}}>
          <div style={{width:"42px", height:"42px", background:"rgba(255,255,255,.2)", borderRadius:"11px", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"Georgia,serif", fontSize:"19px", color:"#fff"}}>A</div>
          <div style={{display:"flex", gap:"8px"}}>
            <button style={{padding:"8px 15px", background:"rgba(255,255,255,.15)", color:"rgba(255,255,255,.9)", border:"1px solid rgba(255,255,255,.25)", borderRadius:"20px", fontSize:"14px", cursor:"pointer", fontWeight:"600"}} onClick={() => setScreen("theme")}>Design</button>
            <button style={{padding:"8px 15px", background:"rgba(255,255,255,.15)", color:"rgba(255,255,255,.9)", border:"1px solid rgba(255,255,255,.25)", borderRadius:"20px", fontSize:"14px", cursor:"pointer", fontWeight:"600"}} onClick={() => { setScreen("form"); setStep(0); }}>Neuer Plan</button>
          </div>
        </div>
        <p style={{fontSize:"13px", color:"rgba(255,255,255,.65)", textTransform:"uppercase", letterSpacing:".1em", marginBottom:".5rem", fontWeight:"600"}}>Dein persönlicher Plan</p>
        <h1 style={{fontSize:"28px", fontWeight:"700", color:"#fff", fontFamily:"Georgia,serif", marginBottom:".5rem"}}>{plan?.titel}</h1>
        <p style={{fontSize:"16px", color:"rgba(255,255,255,.75)", lineHeight:"1.65", marginBottom:"1.5rem"}}>{plan?.untertitel}</p>
        <div style={{display:"flex", justifyContent:"space-between", fontSize:"14px", color:"rgba(255,255,255,.6)", marginBottom:"8px", fontWeight:"600"}}><span>Wochenfortschritt</span><span style={{color:"#fff", fontWeight:"700"}}>{weekProgress}%</span></div>
        <div style={{height:"8px", background:"rgba(255,255,255,.18)", borderRadius:"4px", overflow:"hidden"}}><div style={{height:"100%", width:`${weekProgress}%`, background:"#fff", borderRadius:"4px", transition:"width .6s"}}/></div>
      </div>

      <div style={{padding:"0 1rem 2rem"}}>
        {plan?.wusstest_du && (
          <div style={{background:t.beige, border:`1.5px solid ${t.gold}55`, borderRadius:"18px", padding:"1rem 1.1rem", margin:"1rem 0 0", display:"flex", gap:"12px", alignItems:"flex-start"}}>
            <span style={{fontSize:"24px"}}>💡</span>
            <p style={{fontSize:"16px", color:t.beigeText, lineHeight:"1.7", fontWeight:"500"}}>{plan.wusstest_du}</p>
          </div>
        )}

        {plan?.prioritaeten && (
          <div style={{display:"flex", gap:"8px", padding:"1rem 0", flexWrap:"wrap"}}>
            {plan.prioritaeten.map((p,i) => (
              <div key={i} style={{display:"flex", alignItems:"center", gap:"6px", padding:"8px 15px", background:t.surface, border:`1.5px solid ${t.border}`, borderRadius:"20px", fontSize:"15px", color:t.text2, fontWeight:"500"}}>
                <span style={{width:"22px", height:"22px", background:t.primary, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"12px", color:"#fff", fontWeight:"700"}}>{i+1}</span>{p}
              </div>
            ))}
          </div>
        )}

        {plan?.fach_tipps && plan.fach_tipps.length > 0 && (
          <div style={{background:t.primaryLight, borderRadius:"18px", padding:"1rem 1.1rem", margin:"0 0 .5rem"}}>
            <p style={{fontSize:"15px", fontWeight:"700", color:t.primary, marginBottom:".75rem"}}>📖 So lernst du deine Fächer richtig:</p>
            {plan.fach_tipps.map((ft,i) => (
              <div key={i} style={{display:"flex", gap:"10px", marginBottom:".5rem", fontSize:"15px", color:t.primary}}>
                <span style={{fontWeight:"700", minWidth:"80px"}}>{ft.fach}:</span>
                <span style={{lineHeight:"1.55"}}>{ft.tipp}</span>
              </div>
            ))}
          </div>
        )}

        <h2 style={{fontSize:"22px", fontWeight:"700", color:t.text, margin:"1.25rem 0 1rem"}}>📅 Dein Wochenplan</h2>
        <div style={{display:"flex", gap:"7px", marginBottom:"1rem", overflowX:"auto", paddingBottom:"4px"}}>
          {tageKeys.map((tag,i) => (
            <button key={tag} onClick={() => setActiveDay(i)} style={{padding:"10px 18px", borderRadius:"20px", border:`2px solid ${activeDay===i?t.primary:t.border}`, background:activeDay===i?t.primary:t.surface, color:activeDay===i?"#fff":t.text2, fontSize:"16px", fontWeight:activeDay===i?"700":"400", cursor:"pointer", whiteSpace:"nowrap", flexShrink:0, transition:"all .15s"}}>{tag}</button>
          ))}
        </div>

        {todayBlocks.map((block,i) => {
          const bk = `${tageKeys[activeDay]}-${i}`;
          const isDone = checked[bk];
          const isFokus = block.typ === "fokus";
          const pillBg = block.typ==="fokus"?t.primaryLight:block.typ==="pause"?t.accentLight:t.beige;
          const pillCol = block.typ==="fokus"?t.primary:block.typ==="pause"?t.accent:t.beigeText;
          return (
            <div key={i} style={{background:isDone?t.bg:t.surface, border:`1.5px solid ${t.border}`, borderRadius:"20px", padding:"1.1rem", marginBottom:"10px", boxShadow:isDone?"none":`0 2px 14px rgba(0,0,0,.06)`, opacity:isDone?.75:1}}>
              <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:".6rem"}}>
                <span style={{fontSize:"15px", color:t.text3, fontWeight:"600"}}>{block.zeit}{block.dauer&&<span style={{color:t.gold, marginLeft:"5px"}}>· {block.dauer}</span>}</span>
                <span style={{fontSize:"13px", padding:"5px 13px", borderRadius:"20px", fontWeight:"700", background:pillBg, color:pillCol}}>{PILLLABEL[block.typ]||block.typ}</span>
              </div>
              <div style={{display:"flex", gap:"12px", alignItems:"flex-start", marginBottom:isFokus?".75rem":"0"}}>
                {isFokus && (
                  <div onClick={() => saveChecked({...checked, [bk]:!isDone})} style={{width:"30px", height:"30px", borderRadius:"50%", border:`2.5px solid ${isDone?t.primary:t.border}`, background:isDone?t.primary:"transparent", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", flexShrink:0, marginTop:"2px", color:"#fff", fontSize:"16px", fontWeight:"700", transition:"all .15s"}}>{isDone?"✓":""}</div>
                )}
                <div style={{flex:1}}>
                  <div style={{fontSize:"18px", fontWeight:"700", color:isDone?t.text3:t.text, textDecoration:isDone?"line-through":"none", marginBottom:"5px"}}>{block.titel}</div>
                  <div style={{fontSize:"15px", color:t.text2, lineHeight:"1.7"}}>
                    {String(block.beschreibung||"").split("\n").map((line,li) => (
                      <div key={li} style={{marginBottom: line.trim()?"4px":"0"}}>{line}</div>
                    ))}
                  </div>
                </div>
              </div>
              {isFokus && (
                <div style={{borderTop:`1px solid ${t.border}`, paddingTop:".75rem"}}>
                  {noteOpen===bk ? (
                    <div>
                      <textarea style={{...inp, resize:"none", marginBottom:"8px", fontSize:"15px"}} placeholder="Wie war es? Was hat geklappt? Was war schwer?" value={noteText} onChange={e => setNoteText(e.target.value)} rows={2} autoFocus/>
                      <div style={{display:"flex", gap:"8px"}}>
                        <button style={{padding:"9px 18px", background:t.primary, color:"#fff", border:"none", borderRadius:"12px", fontSize:"15px", cursor:"pointer", fontWeight:"700"}} onClick={() => { saveNote(bk, noteText); setNoteOpen(null); setNoteText(""); }}>Speichern ✓</button>
                        <button style={{padding:"9px 18px", background:"none", border:`1.5px solid ${t.border}`, color:t.text2, borderRadius:"12px", fontSize:"15px", cursor:"pointer"}} onClick={() => { setNoteOpen(null); setNoteText(""); }}>Abbrechen</button>
                      </div>
                    </div>
                  ) : (
                    <button onClick={() => { setNoteOpen(bk); setNoteText(notes[bk]||""); }} style={{background:"none", border:"none", fontSize:"15px", color:t.text3, cursor:"pointer", padding:"4px 0", textAlign:"left", width:"100%", fontWeight:"500"}}>
                      {notes[bk] ? `📝 "${notes[bk].slice(0,50)}${notes[bk].length>50?"...":""}"` : "✏️ Notiz hinzufügen"}
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}

        <h2 style={{fontSize:"22px", fontWeight:"700", color:t.text, margin:"1.5rem 0 1rem"}}>✨ Annas Tipps für dich</h2>
        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px", marginBottom:"1.5rem"}}>
          {plan?.tipps?.map((tip,i) => (
            <div key={i} style={{background:t.tip[i%4], borderRadius:"18px", padding:"1rem"}}>
              <div style={{fontSize:"12px", color:t.text3, textTransform:"uppercase", letterSpacing:".04em", marginBottom:"7px", fontWeight:"700"}}>{tip.label}</div>
              <div style={{fontSize:"15px", color:t.text, lineHeight:"1.65"}}>{tip.text}</div>
            </div>
          ))}
        </div>

        <h2 style={{fontSize:"22px", fontWeight:"700", color:t.text, marginBottom:"1rem"}}>🌟 Deine Erfolgs-Regeln</h2>
        {plan?.regeln?.map((r,i) => {
          const [bg,tc] = t.rule[i%4];
          return (
            <div key={i} style={{background:bg, borderRadius:"16px", padding:"1rem 1.1rem", marginBottom:"8px", display:"flex", alignItems:"flex-start", gap:"12px", fontSize:"16px", color:tc, lineHeight:"1.65", fontWeight:"500"}}>
              <span style={{width:"26px", height:"26px", background:tc, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"13px", color:"#fff", fontWeight:"700", flexShrink:0}}>{i+1}</span>{r}
            </div>
          );
        })}

        <div style={{textAlign:"center", padding:"2rem 0", borderTop:`1.5px solid ${t.border}`, marginTop:"1.5rem"}}>
          <div style={{width:"46px", height:"46px", background:t.primary, borderRadius:"12px", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"Georgia,serif", fontSize:"22px", color:"#fff", margin:"0 auto .75rem"}}>A</div>
          <p style={{fontSize:"15px", color:t.text3, marginBottom:"1rem"}}>Lerne mit Anna · <a href="https://lernemitanna.de" style={{color:t.primary, textDecoration:"none", fontWeight:"700"}} target="_blank" rel="noopener noreferrer">lernemitanna.de</a></p>
          <button style={{...secBtn, maxWidth:"260px", margin:"0 auto"}} onClick={() => { setScreen("form"); setStep(0); }}>Neuen Plan erstellen</button>
        </div>
      </div>
      <SupportWidget t={t} open={supportOpen} setOpen={setSupportOpen} msg={supportMsg} setMsg={setSupportMsg} reply={supportReply} setReply={setSupportReply} loading={supportLoading} escalated={supportEscalated} setEscalated={setSupportEscalated} showNachhilfe={showNachhilfe} setShowNachhilfe={setShowNachhilfe} onSend={sendSupport} />
    </div>
  );
}