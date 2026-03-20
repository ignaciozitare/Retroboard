import { useState, useEffect, useRef } from "react";
import { PHASES, PHASE_META, TIMED_PHASES, DEMO_CARDS, MAX_TITLE, HEADER_H } from "./constants";
import { Btn } from "./ui";
import { RetroLobby }      from "./phases/RetroLobby";
import { RetroCreating }   from "./phases/RetroCreating";
import { RetroGrouping }   from "./phases/RetroGrouping";
import { RetroVoting }     from "./phases/RetroVoting";
import { RetroDiscussion } from "./phases/RetroDiscussion";
import { RetroSummary }    from "./phases/RetroSummary";
import { useT } from "./i18n";

function RetroHeader({ retroName, phase, isMod, goTo, onExit, lang }) {
  const t = useT(lang);
  const pi = PHASES.indexOf(phase);
  const truncName = retroName.length>24 ? retroName.slice(0,24)+"…" : retroName;
  return (
    <header style={{ position:"sticky",top:0,zIndex:20,height:HEADER_H,background:"var(--surf)",backdropFilter:"blur(14px)",borderBottom:"1px solid var(--border)",display:"flex",alignItems:"center",padding:"0 16px",gap:10,overflow:"hidden" }}>
      <div style={{ display:"flex",alignItems:"center",gap:6,flexShrink:0 }}>
        <span style={{ fontSize:16 }}>🔁</span>
        <span style={{ fontFamily:"'Sora',sans-serif",fontWeight:700,fontSize:13,color:"var(--tx)" }}>RetroBoard</span>
      </div>
      {retroName&&(
        <div style={{ display:"flex",alignItems:"center",gap:4,flexShrink:0,maxWidth:180,overflow:"hidden" }}>
          <span style={{ color:"var(--dim)",fontSize:11 }}>·</span>
          <span style={{ fontSize:11,color:"var(--tx3)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{truncName}</span>
        </div>
      )}
      {/* Stepper */}
      <nav style={{ flex:1,display:"flex",justifyContent:"center",alignItems:"center",gap:1,overflow:"hidden",minWidth:0 }}>
        {PHASES.map((p,i)=>{
          const isAct=p===phase; const isDone=i<pi; const m=PM(p);
          return (
            <div key={p} style={{ display:"flex",alignItems:"center",flexShrink:1 }}>
              <button onClick={isMod?()=>goTo(p):undefined}
                style={{ display:"flex",alignItems:"center",gap:3,padding:"3px 7px",borderRadius:20,background:isAct?`${m.c}22`:"transparent",border:`1px solid ${isAct?m.c:"transparent"}`,cursor:isMod?"pointer":"default",outline:"none",fontFamily:"inherit" }}>
                <span style={{ fontSize:10 }}>{m.ic}</span>
                <span style={{ fontSize:10,color:isAct?m.c:isDone?"var(--green)":"var(--dim)",fontWeight:isAct?700:400,whiteSpace:"nowrap" }}>{m.l}</span>
              </button>
              {i<PHASES.length-1&&<span style={{ color:"var(--dim2)",fontSize:10,padding:"0 1px" }}>›</span>}
            </div>
          );
        })}
      </nav>
      {/* EXIT — prominent */}
      <button onClick={onExit}
        style={{ flexShrink:0,background:"var(--redD)",border:"1px solid var(--red)40",borderRadius:8,padding:"5px 12px",color:"var(--red)",cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"inherit",display:"flex",alignItems:"center",gap:5 }}>
        ← {lang==="en"?"Exit":"Salir"}
      </button>
    </header>
  );
}

const PM = (p) => ({ ic:PHASE_META[p].icon, l:PHASE_META[p].label, c:PHASE_META[p].color });

export function RetroFlow({ user, teamMembers, allUsers, allTeams, selectedTeamId, setSelectedTeamId, onFinish, onSaveRetro, onSetKanban, lang }) {
  const t = useT(lang);
  const isMod = ["admin","owner","temporal"].includes(user.role);

  const [retroName,setRetroName]     = useState("");
  const [votesPerUser,setVotesPerUser] = useState(5);
  const [phaseTimes,setPhaseTimes]   = useState({creating:5,grouping:5,voting:3,discussion:3});
  const [timers,setTimers]           = useState({creating:300,grouping:300,voting:180,discussion:180});
  const [running,setRunning]         = useState({creating:false,grouping:false,voting:false,discussion:false});
  const [phase,setPhase]             = useState("lobby");
  const [myCards,setMyCards]         = useState([]);
  const [boardCards,setBoardCards]   = useState([]);
  const [allCards,setAllCards]       = useState([]);
  const [myVotes,setMyVotes]         = useState({});
  const [sortedCards,setSortedCards] = useState([]);
  const [discussIdx,setDiscussIdx]   = useState(0);

  useEffect(()=>{
    const id=setInterval(()=>{ TIMED_PHASES.forEach(ph=>{ if(running[ph]) setTimers(p=>({...p,[ph]:Math.max(0,p[ph]-1)})); }); },1000);
    return()=>clearInterval(id);
  },[running]);

  const setPhMins=(ph,v)=>{ setPhaseTimes(p=>({...p,[ph]:v})); if(!running[ph]) setTimers(p=>({...p,[ph]:v*60})); };
  const setR=(ph,v)=>setRunning(p=>({...p,[ph]:v}));
  const tp=(ph)=>({ timer:timers[ph],setTimer:v=>setTimers(p=>({...p,[ph]:v})),running:running[ph],setRunning:v=>setR(ph,v),phaseMins:phaseTimes[ph],setPhaseMins:v=>setPhMins(ph,v),isMod });

  const goTo=(p)=>{
    if(!isMod&&p!==phase) return;
    if(p==="creating"){ setTimers(prev=>({...prev,creating:phaseTimes.creating*60})); setRunning(prev=>({...prev,creating:false})); }
    if(p==="grouping"){ if(!boardCards.length) setBoardCards([...DEMO_CARDS,...myCards]); setTimers(prev=>({...prev,grouping:phaseTimes.grouping*60})); setRunning(prev=>({...prev,grouping:false})); }
    if(p==="voting")  { const bc=boardCards.length?boardCards:[...DEMO_CARDS,...myCards]; setAllCards(bc.map(c=>({...c,votes:0}))); setMyVotes({}); setTimers(prev=>({...prev,voting:phaseTimes.voting*60})); setRunning(prev=>({...prev,voting:false})); }
    if(p==="discussion"){ const base=allCards.length?allCards:[...DEMO_CARDS,...myCards]; setSortedCards([...base].sort((a,b)=>b.votes-a.votes)); setDiscussIdx(0); setTimers(prev=>({...prev,discussion:phaseTimes.discussion*60})); setRunning(prev=>({...prev,discussion:false})); }
    setPhase(p);
  };

  const vote=(id)=>{ const u=Object.values(myVotes).reduce((a,b)=>a+b,0); if(u>=votesPerUser)return; setMyVotes(p=>({...p,[id]:(p[id]||0)+1})); setAllCards(p=>p.map(c=>c.id===id?{...c,votes:c.votes+1}:c)); };
  const removeVote=(id)=>{ if(!myVotes[id])return; setMyVotes(p=>({...p,[id]:p[id]-1})); setAllCards(p=>p.map(c=>c.id===id?{...c,votes:c.votes-1}:c)); };

  const handleFinish=()=>{
    onSaveRetro?.({ name:retroName||"Retrospectiva", date:new Date().toISOString().slice(0,10), teamId:user.teamId, participants:teamMembers.map(u=>u.id), stats:{ cards:sortedCards.length, withAction:sortedCards.filter(c=>c.actionable).length, votes:sortedCards.reduce((a,c)=>a+c.votes,0) }, actionables:sortedCards.filter(c=>c.actionable).map(c=>({ text:c.actionable, assignee:c.assignee||"", due:c.dueDate||"—", status:"open" })), cards:sortedCards.map(c=>({ text:c.text, cat:c.category })) });
    goTo("summary");
  };

  const renderPhase=()=>{
    switch(phase){
      case "lobby":      return <RetroLobby user={user} teamMembers={teamMembers} allUsers={allUsers} allTeams={allTeams} retroName={retroName} setRetroName={setRetroName} selectedTeamId={selectedTeamId} setSelectedTeamId={setSelectedTeamId} phaseTimes={phaseTimes} setPhaseTimes={setPhaseTimes} votesPerUser={votesPerUser} setVotesPerUser={setVotesPerUser} onStart={()=>goTo("creating")} lang={lang} />;
      case "creating":   return <RetroCreating isMod={isMod} myCards={myCards} setMyCards={setMyCards} {...tp("creating")} onFinish={()=>goTo("grouping")} lang={lang} />;
      case "grouping":   return <RetroGrouping isMod={isMod} cards={boardCards} setCards={setBoardCards} {...tp("grouping")} onFinish={()=>goTo("voting")} lang={lang} />;
      case "voting":     return <RetroVoting isMod={isMod} allCards={allCards} myVotes={myVotes} onVote={vote} onRemoveVote={removeVote} votesPerUser={votesPerUser} {...tp("voting")} onFinish={()=>goTo("discussion")} lang={lang} />;
      case "discussion": return <RetroDiscussion isMod={isMod} sortedCards={sortedCards} setSortedCards={setSortedCards} discussIdx={discussIdx} setDiscussIdx={setDiscussIdx} teamMembers={teamMembers} {...tp("discussion")} onFinish={handleFinish} lang={lang} />;
      case "summary":    return <RetroSummary sortedCards={sortedCards} retroName={retroName} onExit={onFinish} onSetKanban={onSetKanban} lang={lang} />;
      default: return null;
    }
  };

  return (
    <div style={{ height:"100%",display:"flex",flexDirection:"column",overflow:"hidden",background:"var(--bg)" }}>
      <RetroHeader retroName={retroName} phase={phase} isMod={isMod} goTo={goTo} onExit={onFinish} lang={lang} />
      <div style={{ flex:1,overflowY:"auto" }}>
        {phase!=="lobby"&&phase!=="summary"&&(
          <div style={{ textAlign:"center",padding:"14px 16px 8px" }}>
            <h1 style={{ fontFamily:"'Sora',sans-serif",fontSize:17,fontWeight:700,color:"var(--tx)",margin:0 }}>
              {PHASE_META[phase].icon} {PHASE_META[phase].label}
            </h1>
          </div>
        )}
        {renderPhase()}
      </div>
    </div>
  );
}
