import { useState } from "react";
import { Avatar, RoleBadge, StatBox, Btn } from "./ui";

export function AdminPanel({ users, setUsers, teams }) {
  const [filterTeam, setFilterTeam] = useState("");

  const visible = filterTeam ? users.filter(u => u.teamId === filterTeam) : users;
  const adminCount = users.filter(u => u.role === "admin").length;

  const changeRole = (targetId, newRole) => {
    // Protect last admin
    const target = users.find(u => u.id === targetId);
    if (!target) return;
    if (target.role === "admin" && newRole !== "admin" && adminCount <= 1) {
      alert("No se puede quitar el rol de Admin al único administrador del sistema.");
      return;
    }
    setUsers(prev => prev.map(u => {
      if (u.id === targetId) return { ...u, role: newRole };
      // Auto-demote current owner when promoting new one to same team
      if (newRole === "owner" && u.role === "owner" && u.teamId === target.teamId && u.id !== targetId) {
        return { ...u, role: "temporal" };
      }
      return u;
    }));
  };

  const deleteUser = (targetId) => {
    const target = users.find(u => u.id === targetId);
    if (target?.role === "admin" && adminCount <= 1) {
      alert("No se puede eliminar al único administrador del sistema.");
      return;
    }
    setUsers(p => p.filter(u => u.id !== targetId));
  };

  return (
    <div style={{ padding:"20px", overflowY:"auto", height:"100%" }}>
      <h2 style={{ fontFamily:"'Sora',sans-serif", fontSize:17, color:"#e2e8f0", marginBottom:6 }}>🔧 Panel de Administración</h2>
      <p style={{ fontSize:13, color:"#475569", marginBottom:20 }}>Gestión global de usuarios, roles y equipos.</p>

      {/* Summary */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(130px,1fr))", gap:12, marginBottom:20 }}>
        <StatBox label="Usuarios totales"  value={users.length}                                color="#818cf8" />
        <StatBox label="Admins"            value={adminCount}                                  color="#f87171" />
        <StatBox label="Mod. Owners"       value={users.filter(u=>u.role==="owner").length}    color="#818cf8" />
        <StatBox label="Mod. Temporales"   value={users.filter(u=>u.role==="temporal").length} color="#fbbf24" />
        <StatBox label="Participantes"     value={users.filter(u=>u.role==="member").length}   color="#94a3b8" />
      </div>

      {/* Filter */}
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14, flexWrap:"wrap" }}>
        <span style={{ fontSize:12, color:"#64748b" }}>Filtrar por equipo:</span>
        <select value={filterTeam} onChange={e => setFilterTeam(e.target.value)}
          style={{ background:"#161923", border:"1px solid rgba(255,255,255,.1)", borderRadius:7, padding:"5px 10px", color:"#e2e8f0", fontSize:12, fontFamily:"inherit" }}>
          <option value="">Todos los equipos</option>
          {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
        <span style={{ fontSize:11, color:"#334155" }}>{visible.length} usuarios</span>
        {filterTeam && <Btn sm v="ghost" onClick={() => setFilterTeam("")}>Limpiar filtro ✕</Btn>}
      </div>

      {/* Table */}
      <div style={{ background:"#161923", border:"1px solid rgba(255,255,255,.07)", borderRadius:12, overflow:"hidden" }}>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", minWidth:620 }}>
            <thead>
              <tr>
                {["","Nombre","Email","Equipo","Rol actual","Cambiar rol",""].map((c,i) => (
                  <th key={i} style={{ textAlign:"left", fontSize:11, color:"#475569", padding:"11px 12px", fontWeight:600, borderBottom:"1px solid rgba(255,255,255,.06)" }}>{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.length === 0 && (
                <tr><td colSpan={7} style={{ padding:"20px", textAlign:"center", color:"#334155", fontSize:13 }}>No hay usuarios en este equipo</td></tr>
              )}
              {visible.map(u => {
                const team = teams.find(t => t.id === u.teamId);
                const isLastAdmin = u.role === "admin" && adminCount <= 1;
                return (
                  <tr key={u.id} style={{ borderBottom:"1px solid rgba(255,255,255,.04)" }}>
                    <td style={{ padding:"10px 12px" }}><Avatar initials={u.initials} color={u.color} size={28} /></td>
                    <td style={{ padding:"10px 12px", fontSize:13, color:"#e2e8f0", fontWeight:500 }}>{u.name}</td>
                    <td style={{ padding:"10px 12px", fontSize:12, color:"#64748b" }}>{u.email}</td>
                    <td style={{ padding:"10px 12px", fontSize:12, color:team?.color||"#475569" }}>{team?.name||"—"}</td>
                    <td style={{ padding:"10px 12px" }}><RoleBadge role={u.role} /></td>
                    <td style={{ padding:"10px 12px" }}>
                      <select value={u.role} onChange={e => changeRole(u.id, e.target.value)}
                        disabled={isLastAdmin}
                        title={isLastAdmin ? "No se puede cambiar: único admin" : ""}
                        style={{ background:"#0c0e14", border:`1px solid ${isLastAdmin?"rgba(248,113,113,.3)":"rgba(255,255,255,.1)"}`, borderRadius:7, padding:"5px 9px", color: isLastAdmin?"#f87171":"#e2e8f0", fontSize:12, cursor:isLastAdmin?"not-allowed":"pointer", fontFamily:"inherit", opacity:isLastAdmin?0.6:1 }}>
                        <option value="member">Participante</option>
                        <option value="temporal">Mod. Temporal</option>
                        <option value="owner">Mod. Owner</option>
                        <option value="admin">Admin</option>
                      </select>
                      {isLastAdmin && <span style={{ fontSize:10, color:"#f87171", display:"block", marginTop:3 }}>Único admin</span>}
                    </td>
                    <td style={{ padding:"10px 12px" }}>
                      <Btn sm v="danger" onClick={() => deleteUser(u.id)} disabled={isLastAdmin}>Eliminar</Btn>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <p style={{ fontSize:11, color:"#334155", marginTop:12 }}>
        * Al promover un Mod. Owner, el anterior del mismo equipo pasa a Mod. Temporal automáticamente. No se puede quitar el rol Admin al último administrador.
      </p>
    </div>
  );
}
