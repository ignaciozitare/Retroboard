import { useState } from "react";
import { Avatar, RoleBadge, StatBox } from "./ui";
import { DEMO_TEAMS } from "./constants";

export function AdminPanel({ users, setUsers, teams }) {
  const [filterTeam, setFilterTeam] = useState("");

  const visible = filterTeam ? users.filter(u => u.teamId === filterTeam) : users;

  const changeRole = (targetId, newRole) => {
    setUsers(prev => {
      const target = prev.find(u => u.id === targetId);
      if (!target) return prev;
      return prev.map(u => {
        // The target user gets the new role
        if (u.id === targetId) return { ...u, role: newRole };
        // If we're promoting a new owner to a team, demote the current owner of that team
        if (newRole === "owner" && u.role === "owner" && u.teamId === target.teamId && u.id !== targetId) {
          return { ...u, role: "temporal" };
        }
        return u;
      });
    });
  };

  return (
    <div style={{ padding: "20px", overflowY: "auto", height: "100%" }}>
      <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: 17, color: "#e2e8f0", marginBottom: 6 }}>
        🔧 Panel de Administración
      </h2>
      <p style={{ fontSize: 13, color: "#475569", marginBottom: 20 }}>
        Gestión global de usuarios, roles y equipos.
      </p>

      {/* Summary stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 12, marginBottom: 20 }}>
        <StatBox label="Usuarios totales"  value={users.length}                             color="#818cf8" />
        <StatBox label="Admins"            value={users.filter(u=>u.role==="admin").length}    color="#f87171" />
        <StatBox label="Mod. Owners"       value={users.filter(u=>u.role==="owner").length}    color="#818cf8" />
        <StatBox label="Mod. Temporales"   value={users.filter(u=>u.role==="temporal").length} color="#fbbf24" />
      </div>

      {/* Filter */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <span style={{ fontSize: 12, color: "#64748b" }}>Filtrar por equipo:</span>
        <select
          value={filterTeam}
          onChange={e => setFilterTeam(e.target.value)}
          style={{ background: "#161923", border: "1px solid rgba(255,255,255,.1)", borderRadius: 7, padding: "5px 10px", color: "#e2e8f0", fontSize: 12 }}
        >
          <option value="">Todos los equipos</option>
          {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
        <span style={{ fontSize: 11, color: "#334155" }}>{visible.length} usuarios</span>
      </div>

      {/* Table */}
      <div style={{ background: "#161923", border: "1px solid rgba(255,255,255,.07)", borderRadius: 12, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
          <thead>
            <tr>
              {["","Nombre","Email","Equipo","Rol actual","Cambiar rol"].map(c => (
                <th key={c} style={{ textAlign: "left", fontSize: 11, color: "#475569", padding: "11px 14px", fontWeight: 600, borderBottom: "1px solid rgba(255,255,255,.06)" }}>{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 && (
              <tr><td colSpan={6} style={{ padding: "20px", textAlign: "center", color: "#334155", fontSize: 13 }}>No hay usuarios en este equipo</td></tr>
            )}
            {visible.map(u => {
              const team = teams.find(t => t.id === u.teamId);
              return (
                <tr key={u.id} style={{ borderBottom: "1px solid rgba(255,255,255,.04)" }}>
                  <td style={{ padding: "10px 14px" }}>
                    <Avatar initials={u.initials} color={u.color} size={30} />
                  </td>
                  <td style={{ padding: "10px 14px", fontSize: 13, color: "#e2e8f0", fontWeight: 500 }}>{u.name}</td>
                  <td style={{ padding: "10px 14px", fontSize: 12, color: "#64748b" }}>{u.email}</td>
                  <td style={{ padding: "10px 14px", fontSize: 12, color: team?.color || "#475569" }}>{team?.name || "—"}</td>
                  <td style={{ padding: "10px 14px" }}><RoleBadge role={u.role} /></td>
                  <td style={{ padding: "10px 14px" }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <select
                      value={u.role}
                      onChange={e => changeRole(u.id, e.target.value)}
                      style={{ background: "#0c0e14", border: "1px solid rgba(255,255,255,.1)", borderRadius: 7, padding: "5px 9px", color: "#e2e8f0", fontSize: 12, cursor: "pointer" }}
                    >
                      <option value="member">Participante</option>
                      <option value="temporal">Mod. Temporal</option>
                      <option value="owner">Mod. Owner</option>
                      <option value="admin">Admin</option>
                    </select>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        </div>
      </div>
      {/* Note about owner rule */}
      <p style={{ fontSize: 11, color: "#334155", marginTop: 12 }}>
        * Al promover un nuevo Mod. Owner en un equipo que ya tiene uno, el anterior pasa automáticamente a Mod. Temporal.
      </p>
    </div>
  );
}
