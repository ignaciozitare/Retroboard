import { CATS, PRIORITIES } from "../constants";
import { TimerBar, Btn } from "../ui";
import { useT } from "../i18n";

const PEOPLE = ["Yo","Ana G.","Carlos L.","Marta R.","Pepe T.","Laura S.","David K."];

export function RetroDiscussion({
  isMod, sortedCards, setSortedCards, discussIdx, setDiscussIdx,
  teamMembers, timer, setTimer, running, setRunning, phaseMins, setPhaseMins,
  onFinish, lang,
}) {
  const t = useT(lang);
  const card = sortedCards[discussIdx];
  if (!card) return null;

  const cat     = CATS.find(c => c.id === card.category);
  const withAct = sortedCards.filter(c => c.actionable).length;
  const upd     = (f, v) => setSortedCards(p => p.map((c, i) => i === discussIdx ? { ...c, [f]: v } : c));

  const people = teamMembers?.length
    ? ["Yo", ...teamMembers.map(m => m.name)]
    : PEOPLE;

  return (
    <div>
      <TimerBar
        timer={timer} setTimer={setTimer} running={running} setRunning={setRunning}
        isMod={isMod} phaseMins={phaseMins} setPhaseMins={setPhaseMins}
        onNext={onFinish} nextLabel="Ver Resumen →"
      />

      <div style={{ maxWidth:980, margin:"0 auto", padding:"14px 18px 50px" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 240px", gap:16 }}>

          {/* Main panel */}
          <div>
            {/* Progress */}
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
              <span style={{ fontSize:11, color:"var(--dim)" }}>{discussIdx+1} / {sortedCards.length}</span>
              <div style={{ flex:1, background:"var(--surf2)", borderRadius:4, height:4 }}>
                <div style={{ width:`${((discussIdx+1)/sortedCards.length)*100}%`, height:"100%", background:"var(--accent)", borderRadius:4, transition:"width .3s" }} />
              </div>
              <span style={{ fontSize:11, color:"var(--green)" }}>{withAct}/{sortedCards.length} ✓</span>
            </div>

            {/* Spotlight card */}
            <div style={{ background:"var(--surf)", border:`1px solid ${cat.border}`, borderLeft:`4px solid ${cat.color}`, borderRadius:13, padding:"16px 20px", marginBottom:14 }}>
              <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:9 }}>
                <span>{cat.emoji}</span>
                <span style={{ fontSize:11, color:cat.color, fontWeight:700 }}>{cat.label}</span>
                <div style={{ marginLeft:"auto", display:"flex", gap:3, alignItems:"center" }}>
                  {Array.from({length:Math.min(card.votes,8)}).map((_,i)=>(
                    <div key={i} style={{ width:8,height:8,borderRadius:"50%",background:"var(--accent)" }} />
                  ))}
                  <span style={{ fontSize:11, color:"#818cf8", marginLeft:4 }}>{card.votes} votos</span>
                </div>
              </div>
              <p style={{ fontSize:16, lineHeight:1.65, color:"var(--tx)", margin:"0 0 6px" }}>{card.text}</p>
              {card.merged?.length > 0 && (
                <div style={{ marginTop:6, display:"flex", flexDirection:"column", gap:3 }}>
                  {card.merged.map(m => (
                    <p key={m.id} style={{ fontSize:12, color:"var(--tx3)", margin:0, paddingLeft:8, borderLeft:"2px solid var(--border)" }}>
                      ↳ {m.text}
                    </p>
                  ))}
                </div>
              )}
              <span style={{ fontSize:11, color:"var(--dim)", display:"block", marginTop:6 }}>por {card.author}</span>
            </div>

            {/* Actionable form */}
            <div style={{ background:"var(--surf)", border:"1px solid var(--border)", borderRadius:12, padding:"14px 16px" }}>
              <h4 style={{ fontFamily:"'Sora',sans-serif", fontSize:12, color:"var(--tx)", margin:"0 0 10px" }}>🎯 Accionable</h4>

              <textarea value={card.actionable} onChange={e=>upd("actionable",e.target.value)}
                placeholder="¿Qué vamos a hacer? Siguiente paso concreto…" rows={3}
                style={{ width:"100%", background:"var(--bg)", border:"1px solid var(--border2)",
                  borderRadius:8, padding:"8px 10px", color:"var(--tx)", fontSize:12, resize:"none",
                  outline:"none", fontFamily:"inherit", marginBottom:10 }} />

              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:10 }}>
                <div>
                  <label style={{ display:"block", fontSize:10, color:"var(--tx3)", marginBottom:4 }}>Responsable</label>
                  <select value={card.assignee} onChange={e=>upd("assignee",e.target.value)}
                    style={{ width:"100%", background:"var(--bg)", border:"1px solid var(--border2)",
                      borderRadius:7, padding:"7px 10px", color:card.assignee?"var(--tx)":"var(--dim)", fontSize:12, fontFamily:"inherit" }}>
                    <option value="">Sin asignar</option>
                    {people.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display:"block", fontSize:10, color:"var(--tx3)", marginBottom:4 }}>Fecha límite</label>
                  <input type="date" value={card.dueDate||""} onChange={e=>upd("dueDate",e.target.value)}
                    style={{ width:"100%", background:"var(--bg)", border:"1px solid var(--border2)",
                      borderRadius:7, padding:"7px 10px", color:card.dueDate?"var(--tx)":"var(--dim)", fontSize:12, fontFamily:"inherit" }} />
                </div>
              </div>

              {/* Priority */}
              <div>
                <label style={{ display:"block", fontSize:10, color:"var(--tx3)", marginBottom:6 }}>Prioridad</label>
                <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
                  {PRIORITIES.map(p => (
                    <button key={p.id} onClick={()=>upd("priority",p.id)}
                      style={{ padding:"3px 10px", borderRadius:20,
                        border:`1px solid ${(card.priority||"medium")===p.id ? p.color : "var(--border)"}`,
                        background:(card.priority||"medium")===p.id ? p.bg : "transparent",
                        color:(card.priority||"medium")===p.id ? p.color : "var(--tx3)",
                        cursor:"pointer", fontSize:11, fontWeight:700, fontFamily:"inherit" }}>
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {card.actionable && (
                <div style={{ marginTop:10, padding:"5px 10px", background:"var(--greenD)",
                  border:"1px solid var(--green)30", borderRadius:7, fontSize:11, color:"var(--green)" }}>
                  ✓ Accionable registrado — prioridad: {PRIORITIES.find(p=>p.id===(card.priority||"medium"))?.label}
                </div>
              )}
            </div>

            {/* Nav */}
            <div style={{ display:"flex", gap:8, marginTop:12 }}>
              <Btn v="ghost" onClick={()=>setDiscussIdx(i=>Math.max(0,i-1))} disabled={discussIdx===0}>← Anterior</Btn>
              <div style={{ flex:1 }} />
              {discussIdx < sortedCards.length-1
                ? <Btn onClick={()=>setDiscussIdx(i=>i+1)}>Siguiente →</Btn>
                : <Btn v="success" onClick={onFinish}>🏁 Ver resumen</Btn>
              }
            </div>
          </div>

          {/* Sidebar all cards */}
          <div>
            <div style={{ fontSize:11, color:"var(--dim)", marginBottom:8, fontWeight:600 }}>Todas las tarjetas</div>
            <div style={{ display:"flex", flexDirection:"column", gap:4, maxHeight:520, overflowY:"auto" }}>
              {sortedCards.map((c, i) => {
                const cc = CATS.find(x => x.id === c.category);
                const isAct = i === discussIdx;
                return (
                  <button key={c.id} onClick={()=>setDiscussIdx(i)}
                    style={{ background:isAct?"var(--accentD)":"var(--surf2)",
                      border:`1px solid ${isAct?"rgba(99,102,241,.4)":"var(--border)"}`,
                      borderRadius:8, padding:"7px 9px", cursor:"pointer", textAlign:"left",
                      display:"flex", gap:5, alignItems:"flex-start", fontFamily:"inherit", transition:"all .1s" }}>
                    <span style={{ fontSize:11 }}>{cc.emoji}</span>
                    <span style={{ fontSize:11, color:isAct?"var(--tx)":"var(--tx3)", flex:1, lineHeight:1.35 }}>
                      {c.text.slice(0,44)}{c.text.length>44?"…":""}
                    </span>
                    <div style={{ flexShrink:0 }}>
                      <span style={{ fontSize:9, color:"#818cf8", display:"block" }}>🗳 {c.votes}</span>
                      {c.actionable && <span style={{ fontSize:9, color:"var(--green)", display:"block" }}>✓</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
