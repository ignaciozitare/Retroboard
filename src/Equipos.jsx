import { useState } from "react";
import { Avatar, RoleBadge, Btn } from "./ui";
import { Modal } from "./Modal";

const TEAM_COLORS = ["#818cf8","#a78bfa","#f472b6","#34d399","#60a5fa","#fb923c"];

export function Equipos({ user, users, setUsers, teams, setTeams, lang }) {
  const [newTeamName, setNewTeamName]   = useState("");
  const [addEmail, setAddEmail]         = useState({});
  const [managing, setManaging]         = useState(null); // teamId being managed

  const myTeams = user.role === "admin"
    ? teams
    : teams.filter(te => (user.teamIds||[]).includes(te.id));

  const canManage = (teamId) =>
    user.role === "admin" || (user.role === "owner" && (user.teamIds||[]).includes(teamId));

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

  // Multi-team: add user to team (push teamId to teamIds array)
  const addMember = (teamId) => {
    const email = (addEmail[teamId]||"").trim().toLowerCase();
    if (!email) return;
    const u = users.find(x => x.email.toLowerCase() === email);
    if (!u) {
      setAddEmailErr(p => ({ ...p, [teamId]: `Usuario no encontrado: ${email}` }));
      return;
    }
    if ((u.teamIds||[]).includes(teamId)) {
      setAddEmailErr(p => ({ ...p, [teamId]: `${u.name} ya pertenece a este equipo.` }));
      return;
    }
    setUsers(p => p.map(x => x.id === u.id ? { ...x, teamIds: [...(x.teamIds||[]), teamId] } : x));
    setAddEmail(p => ({ ...p, [teamId]: "" }));
    setAddEmailErr(p => ({ ...p, [teamId]: "" }));
  };

  const [addEmailErr, setAddEmailErr] = useState({});

  const removeMember = (userId, teamId) => {
    setUsers(p => p.map(u => u.id === userId
      ? { ...u, teamIds: (u.teamIds||[]).filter(tid => tid !== teamId) }
      : u
    ));
  };

  const managingTeam = teams.find(te => te.id === managing);
  const managingMembers = managing ? users.filter(u => (u.teamIds||[]).includes(managing)) : [];

  return (
    <div style={{ padding:"20px", overflowY:"auto", height:"100%" }}>
      <h2 style={{ fontFamily:"'Sora',sans-serif", fontSize:17, color:"var(--tx)", marginBottom:20 }}>🏷️ Equipos</h2>

      {/* Manage modal */}
      {managing && managingTeam && (
        <Modal title={`Gestionar — ${managingTeam.name}`} onClose={() => setManaging(null)} width={520}>
          <p style={{ fontSize:12, color:"var(--tx3)", marginBottom:14 }}>
            Los usuarios pueden pertenecer a múltiples equipos. Añade o elimina miembros.
          </p>

          {/* Members list */}
          <div style={{ marginBottom:16 }}>
            {managingMembers.length === 0
              ? <p style={{ color:"var(--dim)", fontSize:12 }}>Sin miembros</p>
              : managingMembers.map(u => (
                  <div key={u.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 10px",
                    background:"var(--surf2)", borderRadius:9, marginBottom:6 }}>
                    <Avatar initials={u.initials} color={u.color} size={28} />
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:12, color:"var(--tx)", fontWeight:600 }}>{u.name}</div>
                      <div style={{ fontSize:11, color:"var(--tx3)" }}>{u.email}</div>
                    </div>
                    <RoleBadge role={u.role} />
                    <button onClick={() => removeMember(u.id, managing)}
                      style={{ background:"var(--redD)", border:"1px solid var(--red)30", borderRadius:7,
                        padding:"3px 10px", color:"var(--red)", cursor:"pointer", fontSize:11, fontFamily:"inherit" }}>
                      Quitar
                    </button>
                  </div>
                ))
            }
          </div>

          {/* Add member */}
          <div style={{ borderTop:"1px solid var(--border)", paddingTop:14 }}>
            <p style={{ fontSize:11, color:"var(--tx3)", marginBottom:8, fontWeight:600 }}>Añadir miembro por email</p>
            <div style={{ display:"flex", gap:8 }}>
              <input value={addEmail[managing]||""} onChange={e => setAddEmail(p=>({...p,[managing]:e.target.value}))}
                onKeyDown={e => e.key==="Enter" && addMember(managing)}
                placeholder="usuario@empresa.io"
                style={{ flex:1, background:"var(--bg)", border:"1px solid var(--border2)",
                  borderRadius:7, padding:"8px 10px", color:"var(--tx)", fontSize:12, outline:"none", fontFamily:"inherit" }} />
              <Btn sm onClick={() => addMember(managing)}>Añadir</Btn>
            </div>
            {addEmailErr[managing] && (
              <p style={{ fontSize:12, color:"var(--red)", marginTop:6 }}>{addEmailErr[managing]}</p>
            )}
            <p style={{ fontSize:10, color:"var(--dim)", marginTop:6 }}>
              El usuario debe existir en el sistema. Puede estar en varios equipos.
            </p>
          </div>
        </Modal>
      )}

      {/* Create team */}
      {user.role === "admin" && (
        <div style={{ background:"var(--surf)", border:"1px solid var(--border)", borderRadius:12, padding:"14px 18px", marginBottom:20, display:"flex", gap:10, alignItems:"flex-end" }}>
          <div style={{ flex:1 }}>
            <label style={{ display:"block", fontSize:11, color:"var(--tx3)", marginBottom:5 }}>Nombre del nuevo equipo</label>
            <input value={newTeamName} onChange={e=>setNewTeamName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&createTeam()}
              placeholder="Ej: Equipo Orion"
              style={{ width:"100%", background:"var(--bg)", border:"1px solid var(--border2)",
                borderRadius:7, padding:"8px 11px", color:"var(--tx)", fontSize:13, outline:"none", fontFamily:"inherit" }} />
          </div>
          <Btn onClick={createTeam} disabled={!newTeamName.trim()}>+ Crear equipo</Btn>
        </div>
      )}

      {/* Team cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(280px,1fr))", gap:14 }}>
        {myTeams.map(team => {
          const members = users.filter(u => (u.teamIds||[]).includes(team.id));
          const owner   = users.find(u => u.id === team.ownerId);
          const temps   = members.filter(u => u.role==="temporal");
          const parts   = members.filter(u => u.role==="member");

          return (
            <div key={team.id} style={{ background:"var(--surf)", border:`1px solid ${team.color}30`,
              borderTop:`3px solid ${team.color}`, borderRadius:12, overflow:"hidden" }}>
              <div style={{ padding:"14px 16px", display:"flex", alignItems:"center", gap:10 }}>
                <h3 style={{ fontFamily:"'Sora',sans-serif", fontSize:14, color:team.color, flex:1 }}>{team.name}</h3>
                <span style={{ fontSize:11, color:"var(--tx3)" }}>{members.length} miembros</span>
                {canManage(team.id) && (
                  <Btn sm v="ghost" onClick={() => setManaging(team.id)}>✎ Gestionar</Btn>
                )}
              </div>
              <div style={{ padding:"0 16px 14px" }}>
                {owner && (
                  <div style={{ marginBottom:10 }}>
                    <p style={{ fontSize:10, color:"var(--tx3)", marginBottom:5, fontWeight:600 }}>MOD. OWNER</p>
                    <div style={{ display:"flex", alignItems:"center", gap:8, padding:"7px 10px",
                      background:"var(--accentD)", borderRadius:8 }}>
                      <Avatar initials={owner.initials} color={owner.color} size={26} />
                      <span style={{ fontSize:12, color:"var(--tx)", fontWeight:500, flex:1 }}>{owner.name}</span>
                      <RoleBadge role="owner" />
                    </div>
                  </div>
                )}
                {temps.length > 0 && (
                  <div style={{ marginBottom:10 }}>
                    <p style={{ fontSize:10, color:"var(--tx3)", marginBottom:5, fontWeight:600 }}>MOD. TEMPORALES</p>
                    {temps.map(u => (
                      <div key={u.id} style={{ display:"flex", alignItems:"center", gap:8, padding:"6px 10px",
                        background:"var(--yellowD)", borderRadius:8, marginBottom:4 }}>
                        <Avatar initials={u.initials} color={u.color} size={24} />
                        <span style={{ fontSize:12, color:"var(--tx)", flex:1 }}>{u.name}</span>
                        <RoleBadge role="temporal" />
                      </div>
                    ))}
                  </div>
                )}
                {parts.length > 0 && (
                  <div>
                    <p style={{ fontSize:10, color:"var(--tx3)", marginBottom:5, fontWeight:600 }}>PARTICIPANTES ({parts.length})</p>
                    <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
                      {parts.map(u => (
                        <div key={u.id} style={{ display:"flex", alignItems:"center", gap:4,
                          background:"var(--surf2)", border:"1px solid var(--border)", borderRadius:20,
                          padding:"3px 8px 3px 4px" }}>
                          <Avatar initials={u.initials} color={u.color} size={18} />
                          <span style={{ fontSize:10, color:"var(--tx3)" }}>{u.name.split(" ")[0]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {members.length === 0 && (
                  <p style={{ fontSize:12, color:"var(--dim)", textAlign:"center", padding:"10px 0" }}>Sin miembros</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
