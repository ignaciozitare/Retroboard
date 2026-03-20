import { useState } from "react";
import { Avatar, RoleBadge, Btn } from "./ui";
import { DEMO_USERS } from "./constants";

const TEAM_COLORS = ["#818cf8","#a78bfa","#f472b6","#34d399","#60a5fa","#fb923c"];

export function Equipos({ user, users, setUsers, teams, setTeams }) {
  const [newTeamName, setNewTeamName] = useState("");
  const [addMemberEmail, setAddMemberEmail] = useState({});
  const [expanded, setExpanded] = useState({});

  const myTeams = user.role === "admin" ? teams : teams.filter(t => t.id === user.teamId);
  const canManage = (teamId) => user.role === "admin" || (user.role === "owner" && user.teamId === teamId);

  const createTeam = () => {
    if (!newTeamName.trim()) return;
    setTeams(p => [...p, {
      id: "t" + Date.now(),
      name: newTeamName.trim(),
      color: TEAM_COLORS[p.length % TEAM_COLORS.length],
      ownerId: user.id,
    }]);
    setNewTeamName("");
  };

  const removeMember = (userId, teamId) => {
    setUsers(p => p.map(u => u.id === userId && u.teamId === teamId ? { ...u, teamId: null } : u));
  };

  const addMember = (teamId) => {
    const email = (addMemberEmail[teamId] || "").trim().toLowerCase();
    if (!email) return;
    const u = users.find(x => x.email.toLowerCase() === email);
    if (!u) { alert("Usuario no encontrado: " + email); return; }
    if (u.teamId && u.teamId !== teamId) { alert(`${u.name} ya pertenece a otro equipo.`); return; }
    setUsers(p => p.map(x => x.id === u.id ? { ...x, teamId } : x));
    setAddMemberEmail(prev => ({ ...prev, [teamId]: "" }));
  };

  return (
    <div style={{ padding:"20px", overflowY:"auto", height:"100%" }}>
      <h2 style={{ fontFamily:"'Sora',sans-serif", fontSize:17, color:"#e2e8f0", marginBottom:20 }}>🏷️ Equipos</h2>

      {/* Create team (admin only) */}
      {user.role === "admin" && (
        <div style={{ background:"#161923", border:"1px solid rgba(255,255,255,.08)", borderRadius:12, padding:"16px 20px", marginBottom:20, display:"flex", gap:10, alignItems:"flex-end" }}>
          <div style={{ flex:1 }}>
            <label style={{ display:"block", fontSize:11, color:"#64748b", marginBottom:5 }}>Nombre del nuevo equipo</label>
            <input value={newTeamName} onChange={e=>setNewTeamName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&createTeam()} placeholder="Ej: Equipo Orion"
              style={{ width:"100%", background:"#0c0e14", border:"1px solid rgba(255,255,255,.12)", borderRadius:7, padding:"8px 11px", color:"#e2e8f0", fontSize:13, outline:"none", fontFamily:"inherit" }} />
          </div>
          <Btn onClick={createTeam} disabled={!newTeamName.trim()}>+ Crear equipo</Btn>
        </div>
      )}

      {/* Team cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(300px,1fr))", gap:16 }}>
        {myTeams.map(team => {
          const members  = users.filter(u => u.teamId === team.id);
          const owner    = users.find(u => u.id === team.ownerId);
          const temps    = members.filter(u => u.role === "temporal");
          const parts    = members.filter(u => u.role === "member");
          const isOpen   = expanded[team.id];
          const manage   = canManage(team.id);

          return (
            <div key={team.id} style={{ background:"#161923", border:`1px solid ${team.color}30`, borderTop:`3px solid ${team.color}`, borderRadius:12, overflow:"hidden" }}>
              {/* Header */}
              <div style={{ padding:"14px 16px", display:"flex", alignItems:"center", gap:10 }}>
                <h3 style={{ fontFamily:"'Sora',sans-serif", fontSize:14, color:team.color, flex:1 }}>{team.name}</h3>
                <span style={{ fontSize:11, color:"#475569" }}>{members.length} miembros</span>
                {manage && (
                  <button onClick={() => setExpanded(p => ({...p,[team.id]:!p[team.id]}))}
                    style={{ background:"rgba(255,255,255,.05)", border:"1px solid rgba(255,255,255,.1)", borderRadius:6, padding:"4px 10px", color:"#94a3b8", cursor:"pointer", fontSize:12, fontFamily:"inherit" }}>
                    {isOpen ? "▲ Cerrar" : "✎ Gestionar"}
                  </button>
                )}
              </div>

              {/* Members */}
              <div style={{ padding:"0 16px 14px" }}>
                {owner && (
                  <div style={{ marginBottom:10 }}>
                    <p style={{ fontSize:10, color:"#475569", marginBottom:5, fontWeight:600 }}>MODERADOR OWNER</p>
                    <div style={{ display:"flex", alignItems:"center", gap:8, padding:"7px 10px", background:"rgba(129,140,248,.08)", borderRadius:8 }}>
                      <Avatar initials={owner.initials} color={owner.color} size={26} />
                      <span style={{ fontSize:12, color:"#e2e8f0", fontWeight:500, flex:1 }}>{owner.name}</span>
                      <RoleBadge role="owner" />
                    </div>
                  </div>
                )}
                {temps.length > 0 && (
                  <div style={{ marginBottom:10 }}>
                    <p style={{ fontSize:10, color:"#475569", marginBottom:5, fontWeight:600 }}>MOD. TEMPORALES</p>
                    <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                      {temps.map(u => (
                        <div key={u.id} style={{ display:"flex", alignItems:"center", gap:8, padding:"6px 10px", background:"rgba(251,191,36,.06)", borderRadius:8 }}>
                          <Avatar initials={u.initials} color={u.color} size={24} />
                          <span style={{ fontSize:12, color:"#e2e8f0", flex:1 }}>{u.name}</span>
                          <RoleBadge role="temporal" />
                          {manage && isOpen && (
                            <button onClick={() => removeMember(u.id, team.id)}
                              style={{ background:"rgba(248,113,113,.13)", border:"1px solid rgba(248,113,113,.3)", borderRadius:6, padding:"2px 8px", color:"#f87171", cursor:"pointer", fontSize:11, fontFamily:"inherit" }}>✕</button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {parts.length > 0 && (
                  <div>
                    <p style={{ fontSize:10, color:"#475569", marginBottom:5, fontWeight:600 }}>PARTICIPANTES ({parts.length})</p>
                    <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
                      {parts.map(u => (
                        <div key={u.id} style={{ display:"flex", alignItems:"center", gap:4, background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.06)", borderRadius:20, padding:"3px 8px 3px 4px" }}>
                          <Avatar initials={u.initials} color={u.color} size={20} />
                          <span style={{ fontSize:11, color:"#64748b" }}>{u.name.split(" ")[0]}</span>
                          {manage && isOpen && (
                            <button onClick={() => removeMember(u.id, team.id)}
                              style={{ background:"none", border:"none", color:"#475569", cursor:"pointer", fontSize:12, padding:"0 2px", lineHeight:1, fontFamily:"inherit" }}>✕</button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {members.length === 0 && <p style={{ fontSize:12, color:"#334155", textAlign:"center", padding:"12px 0" }}>Sin miembros asignados</p>}
              </div>

              {/* Add member panel */}
              {manage && isOpen && (
                <div style={{ borderTop:"1px solid rgba(255,255,255,.06)", padding:"12px 16px", background:"rgba(255,255,255,.02)" }}>
                  <p style={{ fontSize:11, color:"#64748b", marginBottom:8, fontWeight:600 }}>Añadir miembro por email</p>
                  <div style={{ display:"flex", gap:8 }}>
                    <input
                      value={addMemberEmail[team.id]||""}
                      onChange={e => setAddMemberEmail(p=>({...p,[team.id]:e.target.value}))}
                      onKeyDown={e => e.key==="Enter"&&addMember(team.id)}
                      placeholder="usuario@empresa.io"
                      style={{ flex:1, background:"#0c0e14", border:"1px solid rgba(255,255,255,.12)", borderRadius:7, padding:"7px 10px", color:"#e2e8f0", fontSize:12, outline:"none", fontFamily:"inherit" }}
                    />
                    <Btn sm onClick={() => addMember(team.id)}>Añadir</Btn>
                  </div>
                  <p style={{ fontSize:10, color:"#334155", marginTop:5 }}>El usuario debe existir en el sistema. Usa el email exacto.</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
