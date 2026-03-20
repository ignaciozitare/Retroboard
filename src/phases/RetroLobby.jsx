import { useState } from "react";
import { TIMED_PHASES, PHASE_META, MAX_TITLE, DEMO_HISTORY, DEMO_TEAMS } from "../constants";
import { Avatar, Btn, dateStr } from "../ui";
import { useT } from "../i18n";

function TimeControl({ ph, value, onDec, onInc }) {
  return (
    <div style={{ background:"rgba(255,255,255,.03)", borderRadius:8, padding:"9px 12px" }}>
      <label style={{ display:"flex", alignItems:"center", gap:4, fontSize:11, color:"#64748b", marginBottom:7 }}>
        {PHASE_META[ph].icon} {PHASE_META[ph].label}
      </label>
      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
        <button onClick={onDec} style={{ width:24,height:24,borderRadius:5,border:"1px solid rgba(255,255,255,.1)",background:"transparent",color:"#94a3b8",cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"inherit" }}>−</button>
        <span style={{ fontSize:18,fontWeight:700,color:"#e2e8f0",fontFamily:"'Sora',sans-serif",minWidth:24,textAlign:"center" }}>{value}</span>
        <button onClick={onInc} style={{ width:24,height:24,borderRadius:5,border:"1px solid rgba(255,255,255,.1)",background:"transparent",color:"#94a3b8",cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"inherit" }}>+</button>
      </div>
    </div>
  );
}

// Pre-retro panel: last retro history or pending actionables
function PreRetroPanel({ mode, teamId, onClose }) {
  const teamHistory = DEMO_HISTORY.filter(r => r.teamId === teamId);
  const lastRetro = teamHistory[teamHistory.length - 1];
  const team = DEMO_TEAMS.find(t => t.id === teamId);

  return (
    <div style={{ position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,.6)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",padding:20 }}>
      <div style={{ background:"#161923",border:"1px solid rgba(255,255,255,.1)",borderRadius:16,width:"100%",maxWidth:640,maxHeight:"80vh",overflow:"hidden",display:"flex",flexDirection:"column" }}>
        {/* Header */}
        <div style={{ padding:"16px 20px",borderBottom:"1px solid rgba(255,255,255,.07)",display:"flex",alignItems:"center",gap:10 }}>
          <h3 style={{ fontFamily:"'Sora',sans-serif",fontSize:15,color:"#e2e8f0",margin:0,flex:1 }}>
            {mode==="history" ? "📚 Historial del equipo" : "🎯 Accionables pendientes"}
            {team && <span style={{ marginLeft:8,fontSize:12,color:team.color }}>{team.name}</span>}
          </h3>
          <button onClick={onClose} style={{ background:"transparent",border:"none",color:"#475569",cursor:"pointer",fontSize:18,fontFamily:"inherit" }}>✕</button>
        </div>

        <div style={{ overflowY:"auto",flex:1,padding:"16px 20px" }}>
          {mode === "history" && (
            teamHistory.length === 0
              ? <p style={{ color:"#334155",fontSize:13 }}>No hay retros anteriores para este equipo</p>
              : [...teamHistory].reverse().map(r => (
                  <div key={r.id} style={{ background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.06)",borderRadius:10,padding:"12px 14px",marginBottom:10 }}>
                    <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6 }}>
                      <span style={{ fontSize:13,color:"#e2e8f0",fontWeight:600 }}>{r.name}</span>
                      <span style={{ fontSize:11,color:"#475569" }}>{dateStr(r.date)}</span>
                    </div>
                    <div style={{ display:"flex",gap:10,marginBottom:8 }}>
                      <span style={{ fontSize:11,color:"#818cf8" }}>🗂 {r.stats.cards} tarjetas</span>
                      <span style={{ fontSize:11,color:"#4ade80" }}>🎯 {r.stats.withAction} accionables</span>
                      <span style={{ fontSize:11,color:"#fbbf24" }}>🗳 {r.stats.votes} votos</span>
                    </div>
                    {r.actionables.filter(a=>a.status==="open").length > 0 && (
                      <div style={{ background:"rgba(248,113,113,.08)",border:"1px solid rgba(248,113,113,.2)",borderRadius:7,padding:"6px 10px" }}>
                        <span style={{ fontSize:11,color:"#f87171",fontWeight:600 }}>{r.actionables.filter(a=>a.status==="open").length} accionables abiertos</span>
                      </div>
                    )}
                  </div>
                ))
          )}

          {mode === "actions" && (
            !lastRetro
              ? <p style={{ color:"#334155",fontSize:13 }}>No hay retros anteriores</p>
              : (
                <div>
                  <p style={{ fontSize:12,color:"#475569",marginBottom:12 }}>De la retro: <strong style={{ color:"#e2e8f0" }}>{lastRetro.name}</strong> ({dateStr(lastRetro.date)})</p>
                  {lastRetro.actionables.filter(a=>a.status==="open").length === 0
                    ? <div style={{ background:"rgba(74,222,128,.08)",border:"1px solid rgba(74,222,128,.2)",borderRadius:10,padding:"14px",textAlign:"center" }}>
                        <span style={{ fontSize:13,color:"#4ade80" }}>✅ ¡Todos los accionables están cerrados!</span>
                      </div>
                    : lastRetro.actionables.filter(a=>a.status==="open").map((a,i) => (
                        <div key={i} style={{ display:"flex",gap:10,padding:"10px 12px",background:"rgba(248,113,113,.06)",border:"1px solid rgba(248,113,113,.2)",borderRadius:8,marginBottom:8 }}>
                          <span style={{ fontSize:14,flexShrink:0 }}>⭕</span>
                          <div>
                            <p style={{ fontSize:13,color:"#e2e8f0",margin:"0 0 3px",fontWeight:500 }}>{a.text}</p>
                            <div style={{ display:"flex",gap:8 }}>
                              <span style={{ fontSize:11,color:"#64748b" }}>👤 {a.assignee}</span>
                              <span style={{ fontSize:11,color:"#64748b" }}>📅 {a.due}</span>
                            </div>
                          </div>
                        </div>
                      ))
                  }
                </div>
              )
          )}
        </div>
      </div>
    </div>
  );
}

export function RetroLobby({
  user, teamMembers,
  retroName, setRetroName,
  phaseTimes, setPhaseTimes,
  votesPerUser, setVotesPerUser,
  onStart,
}) {
  const remaining = MAX_TITLE - retroName.length;
  const upd = (ph, v) => setPhaseTimes(p => ({ ...p, [ph]: Math.max(1, v) }));
  const [prePanel, setPrePanel] = useState(null); // "history" | "actions" | null

  return (
    <div style={{ maxWidth:680, margin:"0 auto", padding:"24px 18px 60px" }}>
      {prePanel && <PreRetroPanel mode={prePanel} teamId={user.teamId} onClose={() => setPrePanel(null)} />}

      <div style={{ textAlign:"center", marginBottom:24 }}>
        <h1 style={{ fontFamily:"'Sora',sans-serif", fontSize:20, color:"#e2e8f0", marginBottom:4 }}>⚙️ Configuración</h1>
        <p style={{ fontSize:13, color:"#475569" }}>Configura la sesión antes de que el equipo entre</p>
      </div>

      {/* Pre-retro quick access */}
      {user.teamId && (
        <div style={{ display:"flex", gap:10, marginBottom:16 }}>
          <button onClick={() => setPrePanel("history")}
            style={{ flex:1, background:"rgba(129,140,248,.08)", border:"1px solid rgba(129,140,248,.25)", borderRadius:10, padding:"10px 14px", cursor:"pointer", textAlign:"left", fontFamily:"inherit" }}>
            <div style={{ fontSize:13, color:"#818cf8", fontWeight:600, marginBottom:2 }}>📚 Historial del equipo</div>
            <div style={{ fontSize:11, color:"#475569" }}>Ver retros anteriores</div>
          </button>
          <button onClick={() => setPrePanel("actions")}
            style={{ flex:1, background:"rgba(248,113,113,.06)", border:"1px solid rgba(248,113,113,.2)", borderRadius:10, padding:"10px 14px", cursor:"pointer", textAlign:"left", fontFamily:"inherit" }}>
            <div style={{ fontSize:13, color:"#f87171", fontWeight:600, marginBottom:2 }}>🎯 Accionables pendientes</div>
            <div style={{ fontSize:11, color:"#475569" }}>Revisar compromisos anteriores</div>
          </button>
        </div>
      )}

      {/* Retro name */}
      <div style={{ background:"#161923", border:"1px solid rgba(255,255,255,.08)", borderRadius:12, padding:"16px 20px", marginBottom:12 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:7 }}>
          <label style={{ fontSize:12, color:"#94a3b8", fontWeight:600 }}>Nombre de la retrospectiva</label>
          <span style={{ fontSize:11, color:remaining<=10?"#f87171":remaining<=20?"#fbbf24":"#475569", fontWeight:600 }}>{remaining} restantes</span>
        </div>
        <input value={retroName} onChange={e=>setRetroName(e.target.value.slice(0,MAX_TITLE))} placeholder="Ej: Retro Sprint 42 — Equipo Atlas"
          style={{ width:"100%", background:"#0c0e14", border:"1px solid rgba(255,255,255,.12)", borderRadius:8, padding:"10px 13px", color:"#e2e8f0", fontSize:15, fontFamily:"'Sora',sans-serif", fontWeight:600, outline:"none" }} />
      </div>

      {/* Room code */}
      <div style={{ background:"#161923", border:"1px solid rgba(255,255,255,.08)", borderRadius:12, padding:"14px 20px", marginBottom:12, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div>
          <p style={{ fontSize:11, color:"#475569", marginBottom:5 }}>Código de sala — comparte con el equipo</p>
          <div style={{ fontSize:22, fontFamily:"'Sora',sans-serif", fontWeight:700, letterSpacing:5, color:"#818cf8" }}>RETRO-4829</div>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
          {(teamMembers||[]).slice(0,5).map(m => (
            <div key={m.id} style={{ display:"flex", alignItems:"center", gap:7 }}>
              <Avatar initials={m.initials} color={m.color} size={22} />
              <span style={{ fontSize:12, color:"#94a3b8" }}>{m.name}</span>
              <span style={{ fontSize:10, color:"#4ade80" }}>✓</span>
            </div>
          ))}
        </div>
      </div>

      {/* Phase times */}
      <div style={{ background:"#161923", border:"1px solid rgba(255,255,255,.08)", borderRadius:12, padding:"14px 20px", marginBottom:12 }}>
        <h3 style={{ fontFamily:"'Sora',sans-serif", fontSize:12, color:"#e2e8f0", margin:"0 0 12px" }}>⏱ Tiempo por fase (minutos)</h3>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
          {TIMED_PHASES.map(ph => (
            <TimeControl key={ph} ph={ph} value={phaseTimes[ph]}
              onDec={() => upd(ph, phaseTimes[ph]-1)} onInc={() => upd(ph, phaseTimes[ph]+1)} />
          ))}
        </div>
      </div>

      {/* Votes */}
      <div style={{ background:"#161923", border:"1px solid rgba(255,255,255,.08)", borderRadius:12, padding:"12px 20px", marginBottom:20, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div>
          <p style={{ fontSize:12, color:"#94a3b8", fontWeight:600 }}>🗳 Votos por participante</p>
          <p style={{ fontSize:11, color:"#334155", marginTop:1 }}>Acumulables en una sola tarjeta</p>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <button onClick={() => setVotesPerUser(v=>Math.max(1,v-1))} style={{ width:28,height:28,borderRadius:7,border:"1px solid rgba(255,255,255,.1)",background:"transparent",color:"#94a3b8",cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"inherit" }}>−</button>
          <span style={{ fontSize:22,fontWeight:700,color:"#e2e8f0",fontFamily:"'Sora',sans-serif",minWidth:28,textAlign:"center" }}>{votesPerUser}</span>
          <button onClick={() => setVotesPerUser(v=>Math.min(20,v+1))} style={{ width:28,height:28,borderRadius:7,border:"1px solid rgba(255,255,255,.1)",background:"transparent",color:"#94a3b8",cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"inherit" }}>+</button>
        </div>
      </div>

      <Btn full onClick={onStart} sx={{ padding:"13px", fontSize:15 }}>🚀 Comenzar Retrospectiva</Btn>
    </div>
  );
}
