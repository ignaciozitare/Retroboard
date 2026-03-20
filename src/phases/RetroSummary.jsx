import { useState } from "react";
import { CATS } from "../constants";
import { Btn } from "../ui";
import { useT } from "../i18n";

function CopyActionsBar({ sortedCards, onSetKanban, lang }) {
  const t = useT(lang);
  const [copied,setCopied] = useState(false);
  const [selected,setSelected] = useState({});
  const withAct = sortedCards.filter(c => c.actionable);

  const doCopy = () => {
    const text = withAct.map(c=>`• ${c.actionable}\n  ${c.assignee||"Sin asignar"} · ${c.dueDate||"—"}`).join("\n\n");
    navigator.clipboard?.writeText(text).catch(()=>{});
    setCopied(true); setTimeout(()=>setCopied(false),2000);
  };

  const exportCSV = () => {
    const rows = [["Tarjeta","Accionable","Responsable","Fecha"],
      ...withAct.map(c=>[c.text,c.actionable,c.assignee||"",c.dueDate||""])];
    const csv = rows.map(r=>r.map(x=>`"${x}"`).join(",")).join("\n");
    const blob = new Blob([csv],{type:"text/csv;charset=utf-8;"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href=url; a.download="accionables.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const toggle = (idx) => setSelected(p => ({ ...p, [idx]: !p[idx] }));
  const anySelected = Object.values(selected).some(Boolean);

  return (
    <div style={{ marginBottom:16 }}>
      <div style={{ display:"flex",gap:8,marginBottom:12 }}>
        <Btn v={copied?"success":"ghost"} full onClick={doCopy}>{copied?"✓ Copiado":t.copyActions}</Btn>
        <Btn v="ghost" full onClick={exportCSV}>{t.exportCSV}</Btn>
      </div>
      {withAct.length > 0 && (
        <div style={{ background:"var(--surf2)",border:"1px solid rgba(129,140,248,.25)",borderRadius:10,padding:"12px 14px" }}>
          <p style={{ fontSize:12,color:"#818cf8",fontWeight:600,marginBottom:10 }}>🎯 {t.selectForKanban}</p>
          <div style={{ display:"flex",flexDirection:"column",gap:6 }}>
            {withAct.map((card,i)=>(
              <label key={i} style={{ display:"flex",alignItems:"flex-start",gap:10,cursor:"pointer",padding:"7px 10px",borderRadius:8,background:selected[i]?"rgba(99,102,241,.12)":"transparent",border:`1px solid ${selected[i]?"rgba(99,102,241,.4)":"var(--border)"}`,transition:"all .15s" }}>
                <input type="checkbox" checked={!!selected[i]} onChange={()=>toggle(i)} style={{ marginTop:2,accentColor:"#6366f1" }} />
                <div>
                  <p style={{ fontSize:12,color:"var(--tx)",margin:"0 0 2px",fontWeight:500 }}>{card.actionable}</p>
                  <span style={{ fontSize:11,color:"var(--tx3)" }}>{card.assignee||"Sin asignar"} · {card.dueDate||"—"}</span>
                </div>
              </label>
            ))}
          </div>
          {anySelected && (
            <Btn full sx={{ marginTop:10 }} onClick={() => {
              const items = withAct.filter((_,i)=>selected[i]);
              onSetKanban && onSetKanban(items);
            }}>
              ✓ Mover seleccionados a "En progreso"
            </Btn>
          )}
        </div>
      )}
    </div>
  );
}

export function RetroSummary({ sortedCards, retroName, onExit, onSetKanban, lang }) {
  const t = useT(lang);
  const withAct = sortedCards.filter(c => c.actionable);
  const without  = sortedCards.filter(c => !c.actionable);

  return (
    <div style={{ maxWidth:720, margin:"0 auto", padding:"16px 18px 60px" }}>
      <div style={{ textAlign:"center", marginBottom:22 }}>
        <div style={{ fontSize:36, marginBottom:8 }}>🏁</div>
        <p style={{ fontSize:11, color:"var(--green)", fontWeight:600, marginBottom:4 }}>{t.retroComplete}</p>
        <h2 style={{ fontFamily:"'Sora',sans-serif", fontSize:20, color:"var(--tx)", margin:0 }}>{retroName||"Retrospectiva"}</h2>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))", gap:10, marginBottom:22 }}>
        {[{l:t.cards,v:sortedCards.length,c:"#818cf8"},{l:t.withAction,v:withAct.length,c:"var(--green)"},{l:t.noAction,v:without.length,c:"var(--red)"},{l:t.totalVotes,v:sortedCards.reduce((a,c)=>a+c.votes,0),c:"var(--yellow)"}]
          .map(s=>(
            <div key={s.l} style={{ background:"var(--surf)",border:"1px solid var(--border)",borderRadius:11,padding:"11px",textAlign:"center" }}>
              <div style={{ fontSize:20,fontWeight:700,fontFamily:"'Sora',sans-serif",color:s.c }}>{s.v}</div>
              <div style={{ fontSize:10,color:"var(--tx3)",marginTop:2 }}>{s.l}</div>
            </div>
          ))}
      </div>

      <CopyActionsBar sortedCards={sortedCards} onSetKanban={onSetKanban} lang={lang} />

      {/* Actionables */}
      <div style={{ background:"var(--surf)",border:"1px solid var(--border)",borderRadius:13,overflow:"hidden",marginBottom:14 }}>
        <div style={{ padding:"12px 20px",borderBottom:"1px solid var(--border)",display:"flex",alignItems:"center",gap:8 }}>
          <h3 style={{ fontFamily:"'Sora',sans-serif",fontSize:13,color:"var(--tx)",margin:0 }}>🎯 Accionables</h3>
          <span style={{ background:"var(--greenD)",color:"var(--green)",borderRadius:20,padding:"2px 8px",fontSize:11,fontWeight:700 }}>{withAct.length}</span>
        </div>
        {withAct.length===0
          ?<p style={{ padding:18,color:"var(--dim)",textAlign:"center",fontSize:13 }}>No se definieron accionables</p>
          :withAct.map((card,i)=>{
            const cat=CATS.find(c=>c.id===card.category);
            return (
              <div key={i} style={{ padding:"12px 20px",borderBottom:i<withAct.length-1?"1px solid rgba(255,255,255,.04)":"none",display:"flex",gap:11 }}>
                <div style={{ width:3,borderRadius:2,background:cat.color,flexShrink:0 }} />
                <div style={{ flex:1 }}>
                  <p style={{ fontSize:11,color:"var(--tx3)",margin:"0 0 3px" }}>{cat.emoji} {card.text}</p>
                  <p style={{ fontSize:13,color:"var(--tx)",margin:"0 0 6px",fontWeight:600 }}>→ {card.actionable}</p>
                  <div style={{ display:"flex",gap:6,flexWrap:"wrap" }}>
                    {card.assignee&&<span style={{ background:"var(--surf2)",color:"var(--tx3)",borderRadius:20,padding:"2px 8px",fontSize:11 }}>👤 {card.assignee}</span>}
                    {card.dueDate &&<span style={{ background:"var(--surf2)",color:"var(--tx3)",borderRadius:20,padding:"2px 8px",fontSize:11 }}>📅 {card.dueDate}</span>}
                    <span style={{ background:"var(--accentD)",color:"#818cf8",borderRadius:20,padding:"2px 8px",fontSize:11 }}>🗳 {card.votes}</span>
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      {without.length>0&&(
        <div style={{ background:"var(--surf)",border:"1px solid var(--border)",borderRadius:11,overflow:"hidden",marginBottom:18 }}>
          <div style={{ padding:"9px 18px",borderBottom:"1px solid var(--border)" }}>
            <span style={{ fontSize:11,color:"var(--tx3)" }}>Sin accionable ({without.length})</span>
          </div>
          {without.map((c,i)=>{const cat=CATS.find(x=>x.id===c.category);return(
            <div key={i} style={{ padding:"8px 18px",borderBottom:i<without.length-1?"1px solid rgba(0,0,0,.05)":"none",display:"flex",gap:8,alignItems:"center" }}>
              <span>{cat.emoji}</span>
              <p style={{ fontSize:11,color:"var(--tx3)",margin:0,flex:1 }}>{c.text}</p>
              <span style={{ fontSize:10,color:"var(--dim)" }}>🗳 {c.votes}</span>
            </div>
          );})}
        </div>
      )}

      <div style={{ textAlign:"center" }}>
        <Btn v="ghost" onClick={onExit}>{t.backDashboard}</Btn>
      </div>
    </div>
  );
}
