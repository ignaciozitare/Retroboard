import { useState } from "react";
import { Avatar, RoleBadge, Btn } from "./ui";

const TEAM_COLORS = ["#818cf8","#a78bfa","#f472b6","#34d399","#60a5fa","#fb923c"];

export function Equipos({ user, users, teams, setTeams }) {
  const [newTeamName, setNewTeamName] = useState("");

  const myTeams = user.role === "admin" ? teams : teams.filter(t => t.id === user.teamId);

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

  return (
    <div style={{ padding: "20px", overflowY: "auto", height: "100%" }}>
      <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: 17, color: "#e2e8f0", marginBottom: 20 }}>
        🏷️ Equipos
      </h2>

      {/* Create team (admin only) */}
      {user.role === "admin" && (
        <div style={{ background: "#161923", border: "1px solid rgba(255,255,255,.08)", borderRadius: 12, padding: "16px 20px", marginBottom: 20, display: "flex", gap: 10, alignItems: "flex-end" }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", fontSize: 11, color: "#64748b", marginBottom: 5 }}>Nombre del equipo</label>
            <input
              value={newTeamName}
              onChange={e => setNewTeamName(e.target.value)}
              onKeyDown={e => e.key === "Enter" && createTeam()}
              placeholder="Ej: Equipo Orion"
              style={{ width: "100%", background: "#0c0e14", border: "1px solid rgba(255,255,255,.12)", borderRadius: 7, padding: "8px 11px", color: "#e2e8f0", fontSize: 13, outline: "none" }}
            />
          </div>
          <Btn onClick={createTeam} disabled={!newTeamName.trim()}>+ Crear equipo</Btn>
        </div>
      )}

      {/* Team cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
        {myTeams.map(team => {
          const members  = users.filter(u => u.teamId === team.id);
          const owner    = users.find(u => u.id === team.ownerId);
          const temps    = members.filter(u => u.role === "temporal");
          const parts    = members.filter(u => u.role === "member");

          return (
            <div key={team.id} style={{
              background: "#161923",
              border: `1px solid ${team.color}30`,
              borderTop: `3px solid ${team.color}`,
              borderRadius: 12, padding: "16px 18px",
            }}>
              {/* Team header */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: 14, color: team.color, flex: 1 }}>{team.name}</h3>
                <span style={{ fontSize: 11, color: "#475569" }}>{members.length} miembros</span>
              </div>

              {/* Owner */}
              {owner && (
                <div style={{ marginBottom: 12 }}>
                  <p style={{ fontSize: 11, color: "#475569", marginBottom: 6, fontWeight: 600 }}>MODERADOR OWNER</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", background: "rgba(129,140,248,.08)", borderRadius: 8 }}>
                    <Avatar initials={owner.initials} color={owner.color} size={28} />
                    <span style={{ fontSize: 12, color: "#e2e8f0", fontWeight: 500, flex: 1 }}>{owner.name}</span>
                    <RoleBadge role="owner" />
                  </div>
                </div>
              )}

              {/* Temporals */}
              {temps.length > 0 && (
                <div style={{ marginBottom: 12 }}>
                  <p style={{ fontSize: 11, color: "#475569", marginBottom: 6, fontWeight: 600 }}>MOD. TEMPORALES</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    {temps.map(u => (
                      <div key={u.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", background: "rgba(251,191,36,.06)", borderRadius: 8 }}>
                        <Avatar initials={u.initials} color={u.color} size={24} />
                        <span style={{ fontSize: 12, color: "#e2e8f0", flex: 1 }}>{u.name}</span>
                        <RoleBadge role="temporal" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Participants */}
              {parts.length > 0 && (
                <div>
                  <p style={{ fontSize: 11, color: "#475569", marginBottom: 6, fontWeight: 600 }}>
                    PARTICIPANTES ({parts.length})
                  </p>
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                    {parts.map(u => (
                      <div key={u.id} style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(255,255,255,.03)", borderRadius: 20, padding: "3px 8px 3px 3px" }}>
                        <Avatar initials={u.initials} color={u.color} size={20} />
                        <span style={{ fontSize: 11, color: "#64748b" }}>{u.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {members.length === 0 && (
                <p style={{ fontSize: 12, color: "#334155", textAlign: "center", padding: "12px 0" }}>Sin miembros asignados</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
