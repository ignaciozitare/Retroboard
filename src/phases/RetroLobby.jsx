import { useState } from "react";
import { TIMED_PHASES, PHASE_META, MAX_TITLE, DEMO_HISTORY, DEMO_TEAMS, DEMO_USERS } from "../constants";
import { Avatar, Btn, dateStr } from "../ui";
import { Modal } from "../Modal";
import { useT } from "../i18n";

function TimeControl({ ph, value, onDec, onInc }) {
  const m = PHASE_META[ph];
  return (
    <div style={{ background:"var(--surf2)", borderRadius:8, padding:"9px 12px" }}>
      <label style={{ display:"flex", alignItems:"center", gap:4, fontSize:11, color:"var(--tx3)", marginBottom:7 }}>
        {m.icon} {m.label}
      </label>
      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
        <button onClick={onDec} style={{ width:24,height:24,borderRadius:5,border:"1px solid var(--border)",background:"transparent",color:"var(--tx2)",cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"inherit" }}>−</button>
        <span style={{ fontSize:18,fontWeight:700,color:"var(--tx)",fontFamily:"'Sora',sans-serif",minWidth:24,textAlign:"center" }}>{value}</span>
        <button onClick={onInc} style={{ width:24,height:24,borderRadius:5,border:"1px solid var(--border)",background:"transparent",color:"var(--tx2)",cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"inherit" }}>+</button>
      </div>
    </div>
  );
}

function PreRetroModal({ mode, teamId, onClose, t }) {
  const teamHistory = DEMO_HISTORY.filter(r => r.teamId === teamId);
  const lastRetro   = teamHistory[teamHistory.length - 1];
  const team        = DEMO_TEAMS.find(te => te.id === teamId);
  const title       = mode === "history"
    ? `${t.teamHistory} — ${team?.name || ""}`
    : `${t.pendingActions} — ${team?.name || ""}`;

  return (
    <Modal title={title} onClose={onClose} width={600}>
      {mode === "history" && (
        teamHistory.length === 0
          ? <p style={{ color:"var(--dim)", fontSize:13 }}>No hay retros anteriores para este equipo</p>
          : [...teamHistory].reverse().map(r => (
              <div key={r.id} style={{ background:"var(--surf2)", border:"1px solid var(--border)",
                borderRadius:10, padding:"12px 14px", marginBottom:10 }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:6 }}>
                  <span style={{ fontSize:13, color:"var(--tx)", fontWeight:600 }}>{r.name}</span>
                  <span style={{ fontSize:11, color:"var(--tx3)" }}>{dateStr(r.date)}</span>
                </div>
                <div style={{ display:"flex", gap:10, marginBottom:6 }}>
                  <span style={{ fontSize:11, color:"#818cf8" }}>🗂 {r.stats.cards} tarjetas</span>
                  <span style={{ fontSize:11, color:"var(--green)" }}>🎯 {r.stats.withAction} accionables</span>
                  <span style={{ fontSize:11, color:"var(--yellow)" }}>🗳 {r.stats.votes} votos</span>
                </div>
                {r.actionables.filter(a=>a.status==="open").length > 0 && (
                  <div style={{ background:"var(--redD)", border:"1px solid var(--red)30", borderRadius:7, padding:"5px 10px" }}>
                    <span style={{ fontSize:11, color:"var(--red)", fontWeight:600 }}>
                      {r.actionables.filter(a=>a.status==="open").length} accionables abiertos
                    </span>
                  </div>
                )}
              </div>
            ))
      )}
      {mode === "actions" && (
        !lastRetro
          ? <p style={{ color:"var(--dim)", fontSize:13 }}>No hay retros anteriores</p>
          : (
            <div>
              <p style={{ fontSize:12, color:"var(--tx3)", marginBottom:12 }}>
                De la retro: <strong style={{ color:"var(--tx)" }}>{lastRetro.name}</strong> ({dateStr(lastRetro.date)})
              </p>
              {lastRetro.actionables.filter(a=>a.status==="open").length === 0
                ? <div style={{ background:"var(--greenD)", border:"1px solid var(--green)30", borderRadius:10, padding:"16px", textAlign:"center" }}>
                    <span style={{ fontSize:13, color:"var(--green)" }}>✅ ¡Todos los accionables están cerrados!</span>
                  </div>
                : lastRetro.actionables.filter(a=>a.status==="open").map((a,i) => (
                    <div key={i} style={{ display:"flex", gap:10, padding:"10px 12px",
                      background:"var(--redD)", border:"1px solid var(--red)25",
                      borderRadius:8, marginBottom:8 }}>
                      <span style={{ fontSize:14, flexShrink:0 }}>⭕</span>
                      <div>
                        <p style={{ fontSize:13, color:"var(--tx)", margin:"0 0 3px", fontWeight:500 }}>{a.text}</p>
                        <div style={{ display:"flex", gap:8 }}>
                          <span style={{ fontSize:11, color:"var(--tx3)" }}>👤 {a.assignee}</span>
                          <span style={{ fontSize:11, color:"var(--tx3)" }}>📅 {a.due}</span>
                        </div>
                      </div>
                    </div>
                  ))
              }
            </div>
          )
      )}
    </Modal>
  );
}

export function RetroLobby({
  user, teamMembers, allUsers, allTeams,
  retroName, setRetroName,
  selectedTeamId, setSelectedTeamId,
  phaseTimes, setPhaseTimes,
  votesPerUser, setVotesPerUser,
  onStart, lang,
}) {
  const t = useT(lang);
  const remaining = MAX_TITLE - retroName.length;
  const upd = (ph, v) => setPhaseTimes(p => ({ ...p, [ph]: Math.max(1, v) }));
  const [prePanel, setPrePanel] = useState(null);

  // User's teams (multi-team)
  const myTeams = (allTeams || DEMO_TEAMS).filter(te =>
    user.role === "admin" || (user.teamIds || []).includes(te.id)
  );

  // Team members for selected team
  const selectedTeamMembers = (allUsers || DEMO_USERS).filter(u =>
    u.id !== user.id && (u.teamIds || []).includes(selectedTeamId)
  );

  return (
    <div style={{ maxWidth:700, margin:"0 auto", padding:"20px 18px 60px" }}>
      {prePanel && (
        <PreRetroModal mode={prePanel} teamId={selectedTeamId} onClose={() => setPrePanel(null)} t={t} />
      )}

      <div style={{ textAlign:"center", marginBottom:22 }}>
        <h1 style={{ fontFamily:"'Sora',sans-serif", fontSize:20, color:"var(--tx)", marginBottom:4 }}>
          ⚙️ {t.configTitle}
        </h1>
        <p style={{ fontSize:13, color:"var(--tx3)" }}>{t.configSub}</p>
      </div>

      {/* Team selector */}
      {myTeams.length > 1 && (
        <div style={{ background:"var(--surf)", border:"1px solid var(--border)", borderRadius:12, padding:"14px 18px", marginBottom:12 }}>
          <label style={{ display:"block", fontSize:12, color:"var(--tx2)", fontWeight:600, marginBottom:8 }}>
            🏷️ Equipo para esta retro
          </label>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            {myTeams.map(te => (
              <button key={te.id} onClick={() => setSelectedTeamId(te.id)}
                style={{ padding:"7px 16px", borderRadius:20,
                  border:`1px solid ${selectedTeamId===te.id ? te.color : "var(--border)"}`,
                  background: selectedTeamId===te.id ? `${te.color}18` : "transparent",
                  color: selectedTeamId===te.id ? te.color : "var(--tx3)",
                  cursor:"pointer", fontSize:13, fontWeight:600, fontFamily:"inherit",
                  outline: selectedTeamId===te.id ? `2px solid ${te.color}40` : "none" }}>
                {te.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Pre-retro quick access */}
      {selectedTeamId && (
        <div style={{ display:"flex", gap:10, marginBottom:14 }}>
          <button onClick={() => setPrePanel("history")}
            style={{ flex:1, background:"var(--accentD)", border:"1px solid rgba(129,140,248,.25)",
              borderRadius:10, padding:"10px 14px", cursor:"pointer", textAlign:"left", fontFamily:"inherit" }}>
            <div style={{ fontSize:13, color:"var(--accent)", fontWeight:600, marginBottom:2 }}>{t.teamHistory}</div>
            <div style={{ fontSize:11, color:"var(--tx3)" }}>{t.viewPrevRetros}</div>
          </button>
          <button onClick={() => setPrePanel("actions")}
            style={{ flex:1, background:"var(--redD)", border:"1px solid rgba(248,113,113,.2)",
              borderRadius:10, padding:"10px 14px", cursor:"pointer", textAlign:"left", fontFamily:"inherit" }}>
            <div style={{ fontSize:13, color:"var(--red)", fontWeight:600, marginBottom:2 }}>{t.pendingActions}</div>
            <div style={{ fontSize:11, color:"var(--tx3)" }}>{t.reviewPrev}</div>
          </button>
        </div>
      )}

      {/* Retro name */}
      <div style={{ background:"var(--surf)", border:"1px solid var(--border)", borderRadius:12, padding:"14px 18px", marginBottom:12 }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:7 }}>
          <label style={{ fontSize:12, color:"var(--tx2)", fontWeight:600 }}>{t.retroName}</label>
          <span style={{ fontSize:11, color:remaining<=10?"var(--red)":remaining<=20?"var(--yellow)":"var(--tx3)", fontWeight:600 }}>
            {remaining} restantes
          </span>
        </div>
        <input value={retroName} onChange={e=>setRetroName(e.target.value.slice(0,MAX_TITLE))}
          placeholder="Ej: Retro Sprint 42"
          style={{ width:"100%", background:"var(--bg)", border:"1px solid var(--border2)",
            borderRadius:8, padding:"10px 13px", color:"var(--tx)", fontSize:15,
            fontFamily:"'Sora',sans-serif", fontWeight:600, outline:"none" }} />
      </div>

      {/* Room code + participants */}
      <div style={{ background:"var(--surf)", border:"1px solid var(--border)", borderRadius:12, padding:"12px 18px", marginBottom:12, display:"flex", alignItems:"center", gap:16 }}>
        <div>
          <p style={{ fontSize:11, color:"var(--tx3)", marginBottom:5 }}>Código de sala</p>
          <div style={{ fontSize:20, fontFamily:"'Sora',sans-serif", fontWeight:700, letterSpacing:5, color:"var(--accent)" }}>RETRO-4829</div>
        </div>
        <div style={{ flex:1 }}>
          <p style={{ fontSize:11, color:"var(--tx3)", marginBottom:6 }}>
            {selectedTeamMembers.length} participantes
          </p>
          <div style={{ display:"flex", gap:-4 }}>
            {selectedTeamMembers.slice(0,8).map((m,i) => (
              <div key={m.id} style={{ marginLeft: i>0?-6:0 }}>
                <Avatar initials={m.initials} color={m.color} size={26} name={m.name} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Phase times */}
      <div style={{ background:"var(--surf)", border:"1px solid var(--border)", borderRadius:12, padding:"12px 18px", marginBottom:12 }}>
        <h3 style={{ fontFamily:"'Sora',sans-serif", fontSize:12, color:"var(--tx)", margin:"0 0 12px" }}>{t.phaseTime}</h3>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
          {TIMED_PHASES.map(ph => (
            <TimeControl key={ph} ph={ph} value={phaseTimes[ph]}
              onDec={() => upd(ph, phaseTimes[ph]-1)} onInc={() => upd(ph, phaseTimes[ph]+1)} />
          ))}
        </div>
      </div>

      {/* Votes */}
      <div style={{ background:"var(--surf)", border:"1px solid var(--border)", borderRadius:12, padding:"12px 18px", marginBottom:20, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <p style={{ fontSize:12, color:"var(--tx2)", fontWeight:600 }}>🗳 {t.votesPerUser}</p>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <button onClick={()=>setVotesPerUser(v=>Math.max(1,v-1))} style={{ width:28,height:28,borderRadius:7,border:"1px solid var(--border)",background:"transparent",color:"var(--tx2)",cursor:"pointer",fontSize:15,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"inherit" }}>−</button>
          <span style={{ fontSize:22,fontWeight:700,color:"var(--tx)",fontFamily:"'Sora',sans-serif",minWidth:28,textAlign:"center" }}>{votesPerUser}</span>
          <button onClick={()=>setVotesPerUser(v=>Math.min(20,v+1))} style={{ width:28,height:28,borderRadius:7,border:"1px solid var(--border)",background:"transparent",color:"var(--tx2)",cursor:"pointer",fontSize:15,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"inherit" }}>+</button>
        </div>
      </div>

      <Btn full onClick={onStart} sx={{ padding:"13px", fontSize:15 }}>{t.startRetro}</Btn>
    </div>
  );
}
