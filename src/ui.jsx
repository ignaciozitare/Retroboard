import { useState } from "react";
import { ROLE_META, HEADER_H } from "./constants";

export const fmt = s => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;
export const dateStr = d => new Date(d).toLocaleDateString("es-ES",{day:"numeric",month:"short",year:"numeric"});
export const genPass = () => {
  const c = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#";
  return Array.from({length:10},()=>c[Math.floor(Math.random()*c.length)]).join("");
};

export function Avatar({ name, initials, color, size=30 }) {
  return (
    <div title={name} style={{ width:size,height:size,borderRadius:"50%",background:color||"#6366f1",display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*.34,fontWeight:700,color:"#fff",flexShrink:0 }}>
      {initials||(name||"?").slice(0,2).toUpperCase()}
    </div>
  );
}

export function RoleBadge({ role }) {
  const m = ROLE_META[role]||ROLE_META.member;
  return <span style={{ background:m.bg,color:m.color,borderRadius:20,padding:"2px 9px",fontSize:11,fontWeight:600,whiteSpace:"nowrap" }}>{m.label}</span>;
}

const BV = {
  primary: { background:"#6366f1",color:"#fff" },
  ghost:   { background:"var(--surf2)",color:"var(--tx2)",border:"1px solid var(--border)" },
  success: { background:"var(--greenD)",color:"var(--green)",border:"1px solid var(--green)40" },
  warn:    { background:"var(--yellowD)",color:"var(--yellow)",border:"1px solid var(--yellow)40" },
  danger:  { background:"var(--redD)",color:"var(--red)",border:"1px solid var(--red)40" },
};

export function Btn({ children, onClick, v="primary", sm, full, disabled, sx={} }) {
  return (
    <button onClick={disabled?undefined:onClick}
      style={{ display:"inline-flex",alignItems:"center",gap:5,padding:sm?"4px 11px":"8px 16px",borderRadius:8,border:"none",cursor:disabled?"not-allowed":"pointer",fontWeight:600,fontSize:sm?11:13,opacity:disabled?.4:1,transition:"all .15s",width:full?"100%":undefined,justifyContent:full?"center":undefined,fontFamily:"inherit",...BV[v],...sx }}>
      {children}
    </button>
  );
}

export function StatBox({ label, value, color, icon }) {
  return (
    <div style={{ background:"var(--surf)",border:"1px solid var(--border)",borderRadius:12,padding:"14px",textAlign:"center" }}>
      {icon&&<div style={{ fontSize:18,marginBottom:6 }}>{icon}</div>}
      <div style={{ fontSize:26,fontWeight:700,fontFamily:"'Sora',sans-serif",color }}>{value}</div>
      <div style={{ fontSize:11,color:"var(--tx3)",marginTop:3 }}>{label}</div>
    </div>
  );
}

export function TimerBar({ timer,setTimer,running,setRunning,isMod,phaseMins,setPhaseMins,onNext,nextLabel,extraContent }) {
  const [editing,setEditing] = useState(false);
  const [editVal,setEditVal] = useState("");
  const totalSecs = phaseMins*60;
  const pct = totalSecs>0?Math.min(100,(timer/totalSecs)*100):0;
  const tc = timer>60?"var(--green)":timer>20?"var(--yellow)":"var(--red)";
  const commitEdit = () => {
    const n=parseInt(editVal,10);
    if(n>0&&n<=120){setPhaseMins(n);setTimer(n*60);}
    setEditing(false);
  };
  return (
    <div style={{ position:"sticky",top:HEADER_H,zIndex:15,background:"var(--surf)",backdropFilter:"blur(10px)",borderBottom:"1px solid var(--border)",padding:"10px 20px" }}>
      <div style={{ display:"flex",alignItems:"center",gap:14,maxWidth:1200,margin:"0 auto" }}>
        <div style={{ fontSize:24,fontFamily:"'Sora',sans-serif",fontWeight:700,color:tc,minWidth:64,letterSpacing:.5 }}>{fmt(timer)}</div>
        <div style={{ flex:1 }}>
          <div style={{ background:"var(--surf2)",borderRadius:4,height:5,overflow:"hidden",marginBottom:5 }}>
            <div style={{ width:`${pct}%`,height:"100%",background:tc,borderRadius:4,transition:"width 1s linear,background .4s" }} />
          </div>
          <div style={{ display:"flex",alignItems:"center",gap:10 }}>
            {extraContent}
            {isMod&&(
              <div style={{ display:"flex",alignItems:"center",gap:5,marginLeft:"auto" }}>
                <span style={{ fontSize:11,color:"var(--dim)" }}>Duración:</span>
                {editing
                  ?<input autoFocus value={editVal} onChange={e=>setEditVal(e.target.value)} onBlur={commitEdit} onKeyDown={e=>{if(e.key==="Enter")commitEdit();if(e.key==="Escape")setEditing(false);}} style={{ width:40,background:"var(--bg)",border:"1px solid #6366f1",borderRadius:5,padding:"2px 5px",color:"var(--tx)",fontSize:11,textAlign:"center",outline:"none",fontFamily:"inherit" }} />
                  :<button onClick={()=>{setEditVal(String(phaseMins));setEditing(true);}} style={{ background:"var(--surf2)",border:"1px solid var(--border)",borderRadius:5,padding:"2px 7px",color:"var(--tx3)",fontSize:11,cursor:"pointer",fontFamily:"inherit" }}>{phaseMins} min ✎</button>
                }
              </div>
            )}
          </div>
        </div>
        {isMod&&(
          <div style={{ display:"flex",gap:6,flexShrink:0 }}>
            <Btn sm v={running?"warn":"success"} onClick={()=>setRunning(r=>!r)}>{running?"⏸ Pausar":"▶ Iniciar"}</Btn>
            {onNext&&<Btn sm v="ghost" onClick={onNext}>{nextLabel||"Siguiente →"}</Btn>}
          </div>
        )}
      </div>
    </div>
  );
}

export const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');
  `}</style>
);
