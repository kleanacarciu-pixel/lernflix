"use client";
import { useState, useEffect } from "react";

const THEMES = {
  rose: { name:"Rosa & Türkis", emoji:"🌸", bg:"#FDF9F5", surface:"#FFFFFF", primary:"#2A7A78", primaryLight:"#E8F5F4", accent:"#C4919C", accentLight:"#F9EEF0", beige:"#F5EDE0", beigeText:"#8B6F47", text:"#2C2422", text2:"#7A6A64", text3:"#AFA098", border:"#EAE0D6", gold:"#C8A96E", headerBg:"#2A7A78", tip:["#E8F5F4","#F9EEF0","#F5EDE0","#F0EDF8"], rule:[["#E8F5F4","#2A7A78"],["#F9EEF0","#C4919C"],["#F5EDE0","#8B6F47"],["#F0EDF8","#7A6AAA"]] },
  navy: { name:"Navy & Grün", emoji:"⚡", bg:"#F4F7FA", surface:"#FFFFFF", primary:"#1C3A6E", primaryLight:"#E8EFF8", accent:"#2D7A4F", accentLight:"#E8F4EE", beige:"#E8EFF8", beigeText:"#2D5A9E", text:"#1C2A3A", text2:"#5A6A7A", text3:"#8A9AAA", border:"#D8E4F0", gold:"#4A9AAE", headerBg:"#1C3A6E", tip:["#E8EFF8","#E8F4EE","#EEF3F8","#E8F0F8"], rule:[["#E8EFF8","#1C3A6E"],["#E8F4EE","#2D7A4F"],["#EEF3F8","#2D5A9E"],["#E8F0F8","#1C3A6E"]] },
  gold: { name:"Gold & Beige", emoji:"✨", bg:"#FAF7F2", surface:"#FFFFFF", primary:"#8B6F47", primaryLight:"#FDF0E0", accent:"#C8A96E", accentLight:"#FDF5E8", beige:"#FDF0E0", beigeText:"#6B4F2A", text:"#2C2010", text2:"#7A6040", text3:"#AFA080", border:"#E8D8C0", gold:"#C8A96E", headerBg:"#8B6F47", tip:["#FDF0E0","#FDF5E8","#FAF7F2","#F5EDE0"], rule:[["#FDF0E0","#8B6F47"],["#FDF5E8","#C8A96E"],["#FAF7F2","#6B4F2A"],["#F5EDE0","#8B6F47"]] }
};

const FAECHER=["Mathematik","Deutsch","Englisch","Biologie","Chemie","Physik","Geschichte","Französisch","Latein","Informatik"];
const PROBLEME=["Ich kann nicht konzentriert bleiben","Ich weiß nicht wo ich anfangen soll","Ich vergesse alles schnell","Ich lerne alles auf den letzten Drücker","Handy lenkt mich ab","Ich verliere den Überblick"];
const LERNTYPEN=["Ich lese den Stoff nochmal durch","Ich mache Karteikarten","Ich schreibe alles ab","Ich erkläre es jemandem","Ich schaue YouTube-Videos","Ich weiß es nicht"];
const BLOCKADEN=["Ich scrolle auf dem Handy","Ich sitze da und tue nichts","Ich fange an aber höre nach 5 Min auf","Ich werde gestresst","Ich vergesse es komplett"];
const ZIELE=["Versetzung schaffen","Eine Note verbessern","Abitur bestehen","Weniger Stress","Eltern stolz machen"];
const ZUHAUSE=["Ich habe ein ruhiges Zimmer","Es ist oft laut bei uns","Geschwister stören mich","Ich habe keinen festen Platz","Ich lerne lieber außerhalb"];
const PRUEFUNG=["Diese Woche","In 2 Wochen","In einem Monat","Später","Keine bald"];
const SCHLAF=["Weniger als 6 Stunden","6–7 Stunden","7–8 Stunden","Mehr als 8 Stunden","Sehr unregelmäßig"];
const FUNKTIONIERT=["Wenn jemand mir erklärt","Wenn ich Pausen mache","Wenn ich Musik höre","Wenn ich unter Druck bin","Noch nie wirklich"];
const ZEITEN=["Morgens (vor der Schule)","Mittags (direkt nach Schule)","Nachmittags (15–18 Uhr)","Abends (nach 18 Uhr)"];
const LOADING_MSGS=["Analysiere deine Lerngewohnheiten...","Erstelle deinen persönlichen Plan...","Passe den Plan auf dich an...","Fast fertig..."];

export default function LernplanPage() {
  const [themeKey,setThemeKey]=useState(null);
  const [screen,setScreen]=useState("theme");
  const [step,setStep]=useState(0);
  const [form,setForm]=useState({name:"",alter:"",klasse:"",faecher:[],probleme:[],lerntyp:"",blockade:"",ziel:"",zuhause:"",naechstePruefung:"",schlaf:"",wasFunktioniert:"",zeit:"",adhs:"",stunden:""});
  const [plan,setPlan]=useState(null);
  const [loadingMsg,setLoadingMsg]=useState(0);
  const [error,setError]=useState("");
  const [activeDay,setActiveDay]=useState(0);
  const [checked,setChecked]=useState({});
  const [notes,setNotes]=useState({});
  const [noteOpen,setNoteOpen]=useState(null);
  const [supportOpen,setSupportOpen]=useState(false);
  const [supportMsg,setSupportMsg]=useState("");
  const [supportReply,setSupportReply]=useState("");
  const [supportLoading,setSupportLoading]=useState(false);
  const [supportEscalated,setSupportEscalated]=useState(false);
  const [weekProgress,setWeekProgress]=useState(0);

  const t=themeKey?THEMES[themeKey]:THEMES.rose;

  useEffect(()=>{
    try{
      const sk=localStorage.getItem("anna_theme");
      const sp=localStorage.getItem("anna_lernplan");
      const sc=localStorage.getItem("anna_checked");
      const sn=localStorage.getItem("anna_notes");
      if(sk){setThemeKey(sk);}
      if(sp){setPlan(JSON.parse(sp));setScreen(sk?"plan":"theme");}
      if(sc)setChecked(JSON.parse(sc));
      if(sn)setNotes(JSON.parse(sn));
    }catch{}
  },[]);

  useEffect(()=>{
    if(!plan)return;
    const total=Object.values(plan.tage||{}).flat().filter(b=>b.typ==="fokus").length;
    const done=Object.values(checked).filter(Boolean).length;
    setWeekProgress(total>0?Math.round((done/total)*100):0);
  },[checked,plan]);

  const saveChecked=(v)=>{setChecked(v);try{localStorage.setItem("anna_checked",JSON.stringify(v));}catch{}};
  const saveNote=(k,v)=>{const n={...notes,[k]:v};setNotes(n);try{localStorage.setItem("anna_notes",JSON.stringify(n));}catch{}};
  const pickTheme=(key)=>{setThemeKey(key);try{localStorage.setItem("anna_theme",key);}catch{}};
  const toggleMulti=(key,val)=>setForm(f=>({...f,[key]:f[key].includes(val)?f[key].filter(x=>x!==val):[...f[key],val]}));
  const setSingle=(key,val)=>setForm(f=>({...f,[key]:val}));

  const generate=async()=>{
    setScreen("loading");setError("");setLoadingMsg(0);
    const iv=setInterval(()=>setLoadingMsg(m=>(m+1)%LOADING_MSGS.length),2500);
    try{
      const prevNotes=Object.entries(notes).map(([k,v])=>`${k}: ${v}`).join(" | ");
      const res=await fetch("/api/lernplan",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...form,previousNotes:prevNotes})});
      const data=await res.json();
      if(data.error)throw new Error(data.error);
      clearInterval(iv);setPlan(data);setChecked({});setScreen("plan");
      try{localStorage.setItem("anna_lernplan",JSON.stringify(data));localStorage.setItem("anna_checked","{}");}catch{}
    }catch{clearInterval(iv);setError("Etwas hat nicht geklappt. Bitte nochmal versuchen.");setScreen("form");}
  };

  const sendSupport=async()=>{
    if(!supportMsg.trim())return;setSupportLoading(true);
    try{const res=await fetch("/api/support",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:supportMsg,name:form.name||"Schüler"})});const data=await res.json();setSupportReply(data.reply);setSupportEscalated(data.escalate);}
    catch{setSupportReply("Es tut mir leid! Schreib uns direkt.");setSupportEscalated(true);}
    setSupportLoading(false);
  };

  const tageKeys=plan?Object.keys(plan.tage||[]):[];
  const todayBlocks=plan?(plan.tage[tageKeys[activeDay]]||[]):[];
  const pillLabel={fokus:"Fokus ✦",pause:"Pause 🌿",aktiv:"Aktiv ⚡",schule:"Schule 📚"};
  const base={fontFamily:"system-ui,sans-serif",background:t.bg,minHeight:"100vh",color:t.text};
  const card={background:t.surface,border:`1px solid ${t.border}`,borderRadius:"14px",padding:"1rem",marginBottom:".75rem"};
  const btn={width:"100%",padding:"13px",background:t.primary,color:"#fff",border:"none",borderRadius:"12px",fontSize:"15px",fontWeight:"600",cursor:"pointer",marginTop:".5rem"};
  const btnSec={width:"100%",padding:"11px",background:"transparent",color:t.text2,border:`1.5px solid ${t.border}`,borderRadius:"12px",fontSize:"14px",cursor:"pointer",marginTop:"6px"};
  const inp={width:"100%",padding:"10px 13px",border:`1.5px solid ${t.border}`,borderRadius:"9px",fontSize:"14px",color:t.text,background:t.surface,outline:"none",fontFamily:"system-ui,sans-serif"};
  const chipBase={padding:"6px 13px",borderRadius:"20px",border:`1.5px solid ${t.border}`,background:t.surface,fontSize:"13px",color:t.text2,cursor:"pointer",display:"inline-block",margin:"3px"};
  const chipAct={...chipBase,background:t.primary,borderColor:t.primary,color:"#fff"};

  const SupportBox=()=>(
    <div style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:"14px",padding:"1rem",width:"280px",boxShadow:"0 8px 32px rgba(0,0,0,.12)",marginBottom:"10px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:".75rem",fontSize:"14px",fontWeight:"600",color:t.text}}>
        <span>💬 Hilfe</span>
        <button style={{background:"none",border:"none",color:t.text3,cursor:"pointer",fontSize:"16px"}} onClick={()=>{setSupportOpen(false);setSupportMsg("");setSupportReply("");setSupportEscalated(false);}}>✕</button>
      </div>
      {!supportReply?(<div>
        <p style={{fontSize:"13px",color:t.text2,lineHeight:"1.6",marginBottom:".75rem"}}>Hast du ein Problem? Schreib mir!</p>
        <textarea style={{...inp,resize:"none",marginBottom:"8px"}} placeholder="Was ist dein Problem?" value={supportMsg} onChange={e=>setSupportMsg(e.target.value)} rows={3}/>
        <button style={btn} disabled={!supportMsg.trim()||supportLoading} onClick={sendSupport}>{supportLoading?"Einen Moment...":"Absenden"}</button>
      </div>):(<div>
        <div style={{background:t.primaryLight,borderRadius:"10px",padding:".85rem",marginBottom:".75rem",fontSize:"13px",color:t.primary,lineHeight:"1.65"}}>💜 {supportReply}</div>
        {supportEscalated&&<div style={{display:"flex",flexDirection:"column",gap:"6px",marginBottom:".5rem"}}>
          <a href="https://wa.me/4917624700519?text=Hallo%20Anna%2C%20ich%20brauche%20Hilfe." style={{display:"block",padding:"9px",background:"#25D366",color:"#fff",borderRadius:"9px",textAlign:"center",textDecoration:"none",fontSize:"13px",fontWeight:"600"}} target="_blank" rel="noopener noreferrer">💬 WhatsApp</a>
          <a href="mailto:lernemitanna@outlook.com?subject=Hilfe%20Lernplan" style={{display:"block",padding:"9px",background:t.primary,color:"#fff",borderRadius:"9px",textAlign:"center",textDecoration:"none",fontSize:"13px",fontWeight:"600"}} target="_blank" rel="noopener noreferrer">📧 E-Mail</a>
        </div>}
        <button style={btnSec} onClick={()=>{setSupportMsg("");setSupportReply("");setSupportEscalated(false);}}>Neue Frage</button>
      </div>)}
    </div>
  );

  const SupportFloat=()=>(
    <div style={{position:"fixed",bottom:"20px",right:"16px",zIndex:100,display:"flex",flexDirection:"column",alignItems:"flex-end",gap:"10px"}}>
      {supportOpen&&<SupportBox/>}
      <button style={{background:t.primary,color:"#fff",border:"none",borderRadius:"50px",padding:"11px 16px",fontSize:"13px",fontWeight:"600",cursor:"pointer",boxShadow:`0 4px 16px ${t.primary}44`}} onClick={()=>setSupportOpen(o=>!o)}>{supportOpen?"✕":"💬 Hilfe"}</button>
    </div>
  );

  if(screen==="theme")return(
    <div style={{...base,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"2rem 1.25rem",minHeight:"100vh"}}>
      <div style={{textAlign:"center",marginBottom:"2rem"}}>
        <div style={{width:"56px",height:"56px",background:t.primary,borderRadius:"14px",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"Georgia,serif",fontSize:"24px",color:"#fff",margin:"0 auto 1rem"}}>A</div>
        <h1 style={{fontSize:"24px",fontWeight:"600",color:t.text,fontFamily:"Georgia,serif",marginBottom:".4rem"}}>Wähle dein Design</h1>
        <p style={{fontSize:"13px",color:t.text2}}>Du kannst es jederzeit ändern</p>
      </div>
      {Object.entries(THEMES).map(([key,th])=>(
        <div key={key} onClick={()=>pickTheme(key)} style={{background:th.bg,border:`2px solid ${themeKey===key?th.primary:th.border}`,borderRadius:"14px",padding:"1rem",marginBottom:"10px",cursor:"pointer",width:"100%",maxWidth:"380px",display:"flex",alignItems:"center",gap:"14px"}}>
          <div style={{width:"44px",height:"44px",background:th.headerBg,borderRadius:"11px",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"Georgia,serif",fontSize:"20px",color:"#fff",flexShrink:0}}>A</div>
          <div style={{flex:1}}>
            <div style={{fontSize:"15px",fontWeight:"600",color:th.text,marginBottom:"4px"}}>{th.emoji} {th.name}</div>
            <div style={{display:"flex",gap:"5px"}}>{[th.primary,th.accent,th.beige,th.surface].map((c,i)=><div key={i} style={{width:"16px",height:"16px",borderRadius:"50%",background:c,border:`1px solid ${th.border}`}}/>)}</div>
          </div>
          {themeKey===key&&<span style={{fontSize:"18px",color:th.primary}}>✓</span>}
        </div>
      ))}
      <button style={{...btn,maxWidth:"380px",marginTop:"1rem"}} disabled={!themeKey} onClick={()=>plan?setScreen("plan"):setScreen("home")}>{plan?"Zum Plan →":"Weiter →"}</button>
      <SupportFloat/>
    </div>
  );

  if(screen==="home")return(
    <div style={{...base,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"2rem 1.5rem",textAlign:"center",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",top:0,left:0,right:0,height:"260px",background:`linear-gradient(180deg,${t.accentLight} 0%,transparent 100%)`,opacity:.7}}/>
      <div style={{position:"relative",zIndex:1,maxWidth:"380px",width:"100%"}}>
        <div style={{width:"72px",height:"72px",background:t.primary,borderRadius:"18px",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"Georgia,serif",fontSize:"32px",color:"#fff",margin:"0 auto 1.5rem",boxShadow:`0 8px 24px ${t.primary}44`}}>A</div>
        <p style={{fontSize:"11px",color:t.accent,textTransform:"uppercase",letterSpacing:".12em",marginBottom:".75rem"}}>Lerne mit Anna</p>
        <h1 style={{fontSize:"30px",fontWeight:"600",color:t.text,fontFamily:"Georgia,serif",lineHeight:"1.2",marginBottom:"1rem"}}>Dein persönlicher<br/>Lernplan</h1>
        <p style={{fontSize:"14px",color:t.text2,lineHeight:"1.75",marginBottom:"2rem"}}>Entwickelt aus jahrelanger Erfahrung – strukturiert, liebevoll und genau auf dich zugeschnitten.</p>
        <button style={btn} onClick={()=>setScreen("form")}>Meinen Plan erstellen ✦</button>
        <button style={{...btnSec,border:"none",color:t.text3,fontSize:"12px"}} onClick={()=>setScreen("theme")}>Design ändern</button>
        <p style={{fontSize:"11px",color:t.text3,marginTop:".5rem"}}>Kostenlos · Nur für dich · In 3 Minuten fertig</p>
      </div>
      <SupportFloat/>
    </div>
  );

  if(screen==="loading")return(
    <div style={{minHeight:"100vh",background:t.headerBg,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{textAlign:"center",padding:"2rem"}}>
        <div style={{width:"56px",height:"56px",background:"rgba(255,255,255,.15)",borderRadius:"14px",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"Georgia,serif",fontSize:"24px",color:"#fff",margin:"0 auto 2rem"}}>A</div>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <div style={{width:"36px",height:"36px",border:"3px solid rgba(255,255,255,.2)",borderTopColor:"#fff",borderRadius:"50%",animation:"spin .8s linear infinite",margin:"0 auto 1.5rem"}}/>
        <p style={{fontSize:"16px",fontWeight:"600",color:"#fff",marginBottom:".5rem"}}>Dein Plan wird erstellt...</p>
        <p style={{fontSize:"13px",color:"rgba(255,255,255,.5)"}}>{LOADING_MSGS[loadingMsg]}</p>
      </div>
    </div>
  );

  if(screen==="form")return(
    <div style={base}>
      <div style={{background:t.surface,padding:"1rem 1.25rem",borderBottom:`1px solid ${t.border}`,display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:10}}>
        <button style={{background:"none",border:"none",fontSize:"14px",color:t.text2,cursor:"pointer"}} onClick={()=>step===0?setScreen("home"):setStep(s=>s-1)}>← Zurück</button>
        <span style={{fontSize:"14px",fontWeight:"600",color:t.text}}>Lerne mit Anna</span>
        <span style={{fontSize:"12px",color:t.text3}}>{step+1} / 4</span>
      </div>
      <div style={{height:"3px",background:t.border}}><div style={{height:"100%",width:`${((step+1)/4)*100}%`,background:t.primary,transition:"width .4s"}}/></div>
      <div style={{padding:"1.5rem 1.25rem 5rem",maxWidth:"560px",margin:"0 auto"}}>
        {error&&<div style={{background:t.accentLight,color:t.accent,borderRadius:"10px",padding:".85rem",marginBottom:"1rem",fontSize:"13px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>{error}<button style={{padding:"5px 10px",background:t.accent,color:"#fff",border:"none",borderRadius:"7px",fontSize:"12px",cursor:"pointer"}} onClick={generate}>Nochmal</button></div>}
        {step===0&&<><div style={{fontSize:"32px",marginBottom:".75rem"}}>👋</div><h2 style={{fontSize:"22px",fontWeight:"600",color:t.text,fontFamily:"Georgia,serif",marginBottom:".35rem"}}>Wer bist du?</h2><p style={{fontSize:"13px",color:t.text2,marginBottom:"1.5rem"}}>Damit dein Plan wirklich zu dir passt</p><div style={{marginBottom:"1rem"}}><label style={{display:"block",fontSize:"13px",color:t.text2,marginBottom:"6px",fontWeight:"500"}}>Dein Vorname</label><input style={inp} placeholder="z.B. Max oder Sophie" value={form.name} onChange={e=>setSingle("name",e.target.value)}/></div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px",marginBottom:"1rem"}}><div><label style={{display:"block",fontSize:"13px",color:t.text2,marginBottom:"6px",fontWeight:"500"}}>Alter</label><select style={inp} value={form.alter} onChange={e=>setSingle("alter",e.target.value)}><option value="">Alter...</option>{[10,11,12,13,14,15,16,17,18].map(a=><option key={a}>{a}</option>)}</select></div><div><label style={{display:"block",fontSize:"13px",color:t.text2,marginBottom:"6px",fontWeight:"500"}}>Klasse</label><select style={inp} value={form.klasse} onChange={e=>setSingle("klasse",e.target.value)}><option value="">Klasse...</option>{["4.","5.","6.","7.","8.","9.","10.","11.","12."].map(k=><option key={k}>{k} Klasse</option>)}</select></div></div><button style={btn} disabled={!form.name||!form.alter||!form.klasse} onClick={()=>setStep(1)}>Weiter →</button></>}
        {step===1&&<><div style={{fontSize:"32px",marginBottom:".75rem"}}>📚</div><h2 style={{fontSize:"22px",fontWeight:"600",color:t.text,fontFamily:"Georgia,serif",marginBottom:".35rem"}}>Fächer & Probleme</h2><p style={{fontSize:"13px",color:t.text2,marginBottom:"1.5rem"}}>Je ehrlicher, desto besser dein Plan</p>{[["Welche Fächer sind am schwersten?","faecher",FAECHER,true],["Was ist dein größtes Problem?","probleme",PROBLEME,true],["Wie lernst du normalerweise?","lerntyp",LERNTYPEN,false],["Was passiert wenn du nicht lernen kannst?","blockade",BLOCKADEN,false]].map(([label,key,opts,multi])=><div key={key} style={{marginBottom:"1rem"}}><label style={{display:"block",fontSize:"13px",color:t.text2,marginBottom:"7px",fontWeight:"500"}}>{label}</label><div style={{display:"flex",flexWrap:"wrap"}}>{opts.map(o=>{const active=multi?form[key].includes(o):form[key]===o;return<div key={o} style={active?chipAct:chipBase} onClick={()=>multi?toggleMulti(key,o):setSingle(key,o)}>{o}</div>;})}</div></div>)}<button style={btn} onClick={()=>setStep(2)}>Weiter →</button></>}
        {step===2&&<><div style={{fontSize:"32px",marginBottom:".75rem"}}>🎯</div><h2 style={{fontSize:"22px",fontWeight:"600",color:t.text,fontFamily:"Georgia,serif",marginBottom:".35rem"}}>Dein Ziel & Situation</h2><p style={{fontSize:"13px",color:t.text2,marginBottom:"1.5rem"}}>Damit der Plan realistisch bleibt</p>{[["Was ist dein Ziel?","ziel",ZIELE],["Wie ist es zuhause?","zuhause",ZUHAUSE],["Nächste wichtige Prüfung?","naechstePruefung",PRUEFUNG],["Was hat bisher funktioniert?","wasFunktioniert",FUNKTIONIERT]].map(([label,key,opts])=><div key={key} style={{marginBottom:"1rem"}}><label style={{display:"block",fontSize:"13px",color:t.text2,marginBottom:"7px",fontWeight:"500"}}>{label}</label><div style={{display:"flex",flexWrap:"wrap"}}>{opts.map(o=><div key={o} style={form[key]===o?chipAct:chipBase} onClick={()=>setSingle(key,o)}>{o}</div>)}</div></div>)}<button style={btn} onClick={()=>setStep(3)}>Weiter →</button></>}
        {step===3&&<><div style={{fontSize:"32px",marginBottom:".75rem"}}>⏰</div><h2 style={{fontSize:"22px",fontWeight:"600",color:t.text,fontFamily:"Georgia,serif",marginBottom:".35rem"}}>Dein Alltag</h2><p style={{fontSize:"13px",color:t.text2,marginBottom:"1.5rem"}}>Der letzte Schritt – fast fertig!</p>{[["Wann bist du am konzentriertesten?","zeit",ZEITEN],["ADHS oder Konzentrationsprobleme?","adhs",["Ja, diagnostiziert","Ja, aber nicht offiziell","Nein, aber oft unruhig","Nein"]],["Wie viel Zeit täglich?","stunden",["30–60 Min.","1–2 Stunden","2–3 Stunden","3+ Stunden"]],["Wie viel schläfst du?","schlaf",SCHLAF]].map(([label,key,opts])=><div key={key} style={{marginBottom:"1rem"}}><label style={{display:"block",fontSize:"13px",color:t.text2,marginBottom:"7px",fontWeight:"500"}}>{label}</label><div style={{display:"flex",flexWrap:"wrap"}}>{opts.map(o=><div key={o} style={form[key]===o?chipAct:chipBase} onClick={()=>setSingle(key,o)}>{o}</div>)}</div></div>)}<button style={btn} disabled={!form.zeit||!form.adhs||!form.stunden} onClick={generate}>Meinen Plan erstellen ✦</button></>}
      </div>
      <SupportFloat/>
    </div>
  );

  return(
    <div style={base}>
      <div style={{background:t.headerBg,padding:"1.25rem 1.25rem 1.75rem"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"1.25rem"}}>
          <div style={{width:"36px",height:"36px",background:"rgba(255,255,255,.18)",borderRadius:"9px",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"Georgia,serif",fontSize:"16px",color:"#fff"}}>A</div>
          <div style={{display:"flex",gap:"8px"}}>
            <button style={{padding:"5px 12px",background:"rgba(255,255,255,.12)",color:"rgba(255,255,255,.8)",border:"1px solid rgba(255,255,255,.2)",borderRadius:"20px",fontSize:"11px",cursor:"pointer"}} onClick={()=>setScreen("theme")}>Design</button>
            <button style={{padding:"5px 12px",background:"rgba(255,255,255,.12)",color:"rgba(255,255,255,.8)",border:"1px solid rgba(255,255,255,.2)",borderRadius:"20px",fontSize:"11px",cursor:"pointer"}} onClick={()=>{setScreen("form");setStep(0);}}>Neuer Plan</button>
          </div>
        </div>
        <p style={{fontSize:"11px",color:"rgba(255,255,255,.6)",textTransform:"uppercase",letterSpacing:".1em",marginBottom:".4rem"}}>Dein persönlicher Plan</p>
        <h1 style={{fontSize:"24px",fontWeight:"600",color:"#fff",fontFamily:"Georgia,serif",marginBottom:".4rem"}}>{plan?.titel}</h1>
        <p style={{fontSize:"12px",color:"rgba(255,255,255,.65)",lineHeight:"1.65",marginBottom:"1.25rem"}}>{plan?.untertitel}</p>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:"11px",color:"rgba(255,255,255,.5)",marginBottom:"6px"}}><span>Wochenfortschritt</span><span style={{color:"#fff",fontWeight:"600"}}>{weekProgress}%</span></div>
        <div style={{height:"5px",background:"rgba(255,255,255,.15)",borderRadius:"3px"}}><div style={{height:"100%",width:`${weekProgress}%`,background:"#fff",borderRadius:"3px",transition:"width .6s"}}/></div>
      </div>

      <div style={{padding:"0 1rem"}}>
        {plan?.wusstest_du&&<div style={{background:t.beige,border:`1px solid ${t.gold}44`,borderRadius:"12px",padding:".85rem 1rem",margin:"1rem 0 0",display:"flex",gap:"10px",alignItems:"flex-start"}}><span style={{fontSize:"18px"}}>💡</span><p style={{fontSize:"12px",color:t.beigeText,lineHeight:"1.65"}}>{plan.wusstest_du}</p></div>}
        {plan?.prioritaeten&&<div style={{display:"flex",gap:"6px",padding:".85rem 0",flexWrap:"wrap"}}>{plan.prioritaeten.map((p,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:"5px",padding:"5px 10px",background:t.surface,border:`1px solid ${t.border}`,borderRadius:"20px",fontSize:"11px",color:t.text2}}><span style={{width:"16px",height:"16px",background:t.primary,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"9px",color:"#fff",fontWeight:"700"}}>{i+1}</span>{p}</div>)}</div>}

        <h2 style={{fontSize:"16px",fontWeight:"600",color:t.text,fontFamily:"Georgia,serif",marginBottom:".85rem"}}>📅 Tagesplan nach Wochentag</h2>
        <div style={{display:"flex",gap:"5px",marginBottom:".85rem",overflowX:"auto",paddingBottom:"2px"}}>
          {tageKeys.map((tag,i)=><button key={tag} onClick={()=>setActiveDay(i)} style={{padding:"6px 14px",borderRadius:"20px",border:`1.5px solid ${activeDay===i?t.primary:t.border}`,background:activeDay===i?t.primary:t.surface,color:activeDay===i?"#fff":t.text2,fontSize:"13px",fontWeight:activeDay===i?"600":"400",cursor:"pointer",whiteSpace:"nowrap",flexShrink:0}}>{tag}</button>)}
        </div>

        {todayBlocks.map((block,i)=>{
          const bk=`${tageKeys[activeDay]}-${i}`;const isDone=checked[bk];const isFokus=block.typ==="fokus";
          const pillBg=block.typ==="fokus"?t.primaryLight:block.typ==="pause"?t.accentLight:t.beige;
          const pillCol=block.typ==="fokus"?t.primary:block.typ==="pause"?t.accent:t.beigeText;
          return<div key={i} style={{...card,opacity:isDone?.8:1}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:".5rem"}}>
              <span style={{fontSize:"11px",color:t.text3}}>{block.zeit}{block.dauer&&<span style={{color:t.gold}}> · {block.dauer}</span>}</span>
              <span style={{fontSize:"10px",padding:"2px 8px",borderRadius:"8px",fontWeight:"600",background:pillBg,color:pillCol,whiteSpace:"nowrap"}}>{pillLabel[block.typ]||block.typ}</span>
            </div>
            <div style={{display:"flex",gap:"10px",alignItems:"flex-start",marginBottom:isFokus?".5rem":"0"}}>
              {isFokus&&<div onClick={()=>saveChecked({...checked,[bk]:!isDone})} style={{width:"22px",height:"22px",borderRadius:"50%",border:`2px solid ${isDone?t.primary:t.border}`,background:isDone?t.primary:"transparent",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0,marginTop:"2px",color:"#fff",fontSize:"11px"}}>{isDone?"✓":""}</div>}
              <div style={{flex:1}}><div style={{fontSize:"14px",fontWeight:"600",color:isDone?t.text3:t.text,textDecoration:isDone?"line-through":"none",marginBottom:"3px"}}>{block.titel}</div><div style={{fontSize:"12px",color:t.text2,lineHeight:"1.55"}}>{block.beschreibung}</div></div>
            </div>
            {isFokus&&<div style={{borderTop:`1px solid ${t.border}`,paddingTop:".5rem"}}>
              {noteOpen===bk?<div><textarea style={{...inp,resize:"none",marginBottom:"5px",fontSize:"12px"}} placeholder="Wie war es? Was hat geklappt?" value={notes[bk]||""} onChange={e=>saveNote(bk,e.target.value)} rows={2}/><button style={{padding:"5px 12px",background:t.primary,color:"#fff",border:"none",borderRadius:"7px",fontSize:"12px",cursor:"pointer"}} onClick={()=>setNoteOpen(null)}>Speichern ✓</button></div>:<button onClick={()=>setNoteOpen(bk)} style={{background:"none",border:"none",fontSize:"11px",color:t.text3,cursor:"pointer",padding:"4px 0",textAlign:"left",width:"100%"}}>{notes[bk]?`📝 "${notes[bk].slice(0,45)}${notes[bk].length>45?"...":""}"` : "✏️ Notiz hinzufügen"}</button>}
            </div>}
          </div>;
        })}

        <h2 style={{fontSize:"16px",fontWeight:"600",color:t.text,fontFamily:"Georgia,serif",margin:"1.25rem 0 .85rem"}}>✨ Annas Tipps für dich</h2>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px",marginBottom:"1.25rem"}}>
          {plan?.tipps?.map((tip,i)=><div key={i} style={{background:t.tip[i%4],borderRadius:"12px",padding:".85rem"}}><div style={{fontSize:"10px",color:t.text3,textTransform:"uppercase",letterSpacing:".04em",marginBottom:"4px",fontWeight:"600"}}>{tip.label}</div><div style={{fontSize:"12px",color:t.text,lineHeight:"1.6"}}>{tip.text}</div></div>)}
        </div>

        <h2 style={{fontSize:"16px",fontWeight:"600",color:t.text,fontFamily:"Georgia,serif",marginBottom:".85rem"}}>🌟 Deine Erfolgs-Regeln</h2>
        {plan?.regeln?.map((r,i)=>{const[bg,tc]=t.rule[i%4];return<div key={i} style={{background:bg,borderRadius:"10px",padding:".75rem 1rem",marginBottom:".5rem",display:"flex",alignItems:"flex-start",gap:"10px",fontSize:"13px",color:tc,lineHeight:"1.6"}}><span style={{width:"20px",height:"20px",background:tc,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"10px",color:"#fff",fontWeight:"700",flexShrink:0}}>{i+1}</span>{r}</div>;})}

        <div style={{textAlign:"center",padding:"2rem 0",borderTop:`1px solid ${t.border}`,marginTop:"1rem"}}>
          <div style={{width:"36px",height:"36px",background:t.primary,borderRadius:"9px",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"Georgia,serif",fontSize:"16px",color:"#fff",margin:"0 auto .5rem"}}>A</div>
          <p style={{fontSize:"11px",color:t.text3}}>Lerne mit Anna · <a href="https://lernemitanna.de" style={{color:t.primary,textDecoration:"none"}} target="_blank" rel="noopener noreferrer">lernemitanna.de</a></p>
          <button style={{...btnSec,maxWidth:"200px",margin:".75rem auto 0"}} onClick={()=>{setScreen("form");setStep(0);}}>Neuen Plan erstellen</button>
        </div>
      </div>
      <SupportFloat/>
    </div>
  );
}