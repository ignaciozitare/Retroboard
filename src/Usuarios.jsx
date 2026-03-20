import { useState } from "react";
import { Avatar, RoleBadge, Btn, genPass } from "./ui";

const AVATAR_COLORS = ["#f472b6","#60a5fa","#34d399","#fb923c","#a78bfa","#38bdf8","#fbbf24"];

export function Usuarios({ user, users, setUsers, teams }) {
  const [name, setName]     = useState("");
  const [email, setEmail]   = useState("");
  const [teamId, setTeamId] = useState(user.role === "owner" ? user.teamId : "");
  const [role, setRole]     = useState("member");
  const [creds, setCreds]   = useState([]);
  const [copied, setCopied] = useState({});

  const myTeams = user.role === "admin" ? teams : teams.filter(t => t.id === user.teamId);
  const myUsers = user.role === "admin" ? users : users.filter(u => u.teamId === user.teamId);

  const create = () => {
    if (!name.trim() || !email.trim()) return;
    const pass  = genPass();
    const id    = "u" + Date.now();
    const color = AVATAR_COLORS[users.length % AVATAR_COLORS.length];
    const initials = name.trim().split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
    setUsers(p => [...p, { id, name: name.trim(), email: email.trim(), role, teamId: teamId || null, initials, color }]);
    setCreds(p => [...p, { id, name: name.trim(), email: email.trim(), password: pass }]);
    setName(""); setEmail("");
  };

  const copyOne = (id, text) => {
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopied(p => ({ ...p, [id]: true }));
    setTimeout(() => setCopied(p => ({ ...p, [id]: false })), 2000);
  };

  return (
    <div style={{ padding: "20px", overflowY: "auto", height: "100%" }}>
      <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: 17, color: "#e2e8f0", marginBottom: 20 }}>
        👥 Gestión de Usuarios
      </h2>

      {/* ── Create form ── */}
      <div style={{ background: "#161923", border: "1px solid rgba(255,255,255,.08)", borderRadius: 12, padding: "18px 20px", marginBottom: 18 }}>
        <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: 13, color: "#e2e8f0", marginBottom: 14 }}>Crear nuevo usuario</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 10, alignItems: "end" }}>
          {/* Name */}
          <div>
            <label style={{ display: "block", fontSize: 11, color: "#64748b", marginBottom: 5 }}>Nombre</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Ana García"
              style={{ width: "100%", background: "#0c0e14", border: "1px solid rgba(255,255,255,.12)", borderRadius: 7, padding: "8px 11px", color: "#e2e8f0", fontSize: 13, outline: "none" }} />
          </div>
          {/* Email */}
          <div>
            <label style={{ display: "block", fontSize: 11, color: "#64748b", marginBottom: 5 }}>Email</label>
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="ana@empresa.io" type="email"
              style={{ width: "100%", background: "#0c0e14", border: "1px solid rgba(255,255,255,.12)", borderRadius: 7, padding: "8px 11px", color: "#e2e8f0", fontSize: 13, outline: "none" }} />
          </div>
          {/* Team */}
          <div>
            <label style={{ display: "block", fontSize: 11, color: "#64748b", marginBottom: 5 }}>Equipo</label>
            <select value={teamId} onChange={e => setTeamId(e.target.value)}
              style={{ width: "100%", background: "#0c0e14", border: "1px solid rgba(255,255,255,.12)", borderRadius: 7, padding: "8px 10px", color: "#e2e8f0", fontSize: 12 }}>
              <option value="">Sin equipo</option>
              {myTeams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          {/* Role */}
          <div>
            <label style={{ display: "block", fontSize: 11, color: "#64748b", marginBottom: 5 }}>Rol</label>
            <select value={role} onChange={e => setRole(e.target.value)}
              style={{ width: "100%", background: "#0c0e14", border: "1px solid rgba(255,255,255,.12)", borderRadius: 7, padding: "8px 10px", color: "#e2e8f0", fontSize: 12 }}>
              <option value="member">Participante</option>
              <option value="temporal">Mod. Temporal</option>
              {user.role === "admin" && <option value="owner">Mod. Owner</option>}
              {user.role === "admin" && <option value="admin">Admin</option>}
            </select>
          </div>
          <Btn onClick={create} disabled={!name || !email} sx={{ whiteSpace: "nowrap" }}>+ Crear</Btn>
        </div>
      </div>

      {/* ── Generated credentials ── */}
      {creds.length > 0 && (
        <div style={{ background: "#161923", border: "1px solid rgba(251,191,36,.3)", borderRadius: 12, padding: "16px 18px", marginBottom: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: 13, color: "#fbbf24", margin: 0 }}>🔑 Credenciales generadas</h3>
            <span style={{ fontSize: 11, color: "#64748b" }}>Guárdalas ahora — no se volverán a mostrar</span>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Nombre","Email","Contraseña",""].map(c => (
                  <th key={c} style={{ textAlign: "left", fontSize: 11, color: "#475569", padding: "0 8px 8px", fontWeight: 600 }}>{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {creds.map(c => (
                <tr key={c.id} style={{ borderTop: "1px solid rgba(255,255,255,.05)" }}>
                  <td style={{ padding: "9px 8px", fontSize: 13, color: "#e2e8f0" }}>{c.name}</td>
                  <td style={{ padding: "9px 8px", fontSize: 12, color: "#64748b" }}>{c.email}</td>
                  <td style={{ padding: "9px 8px" }}>
                    <code style={{ background: "rgba(255,255,255,.06)", borderRadius: 6, padding: "3px 8px", fontSize: 13, color: "#fbbf24", letterSpacing: 0.5 }}>
                      {c.password}
                    </code>
                  </td>
                  <td style={{ padding: "9px 8px", textAlign: "right" }}>
                    <button
                      onClick={() => copyOne(c.id, `${c.email} / ${c.password}`)}
                      style={{ background: copied[c.id] ? "rgba(74,222,128,.15)" : "rgba(255,255,255,.05)", border: `1px solid ${copied[c.id] ? "rgba(74,222,128,.4)" : "rgba(255,255,255,.1)"}`, borderRadius: 6, padding: "3px 10px", fontSize: 11, color: copied[c.id] ? "#4ade80" : "#94a3b8", cursor: "pointer" }}
                    >
                      {copied[c.id] ? "✓ Copiado" : "Copiar"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: 10, display: "flex", justifyContent: "flex-end" }}>
            <Btn sm v="ghost" onClick={() => setCreds([])}>Limpiar tabla</Btn>
          </div>
        </div>
      )}

      {/* ── Users table ── */}
      <div style={{ background: "#161923", border: "1px solid rgba(255,255,255,.07)", borderRadius: 12, overflow: "hidden" }}>
        <div style={{ padding: "12px 18px", borderBottom: "1px solid rgba(255,255,255,.07)" }}>
          <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: 13, color: "#e2e8f0", margin: 0 }}>
            Usuarios — {user.role === "owner" ? teams.find(t => t.id === user.teamId)?.name : "todos los equipos"}
            <span style={{ marginLeft: 8, background: "rgba(255,255,255,.07)", color: "#64748b", borderRadius: 20, padding: "1px 9px", fontSize: 11 }}>{myUsers.length}</span>
          </h3>
        </div>
        <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 500 }}>
          <thead>
            <tr>
              {["","Nombre","Email","Equipo","Rol","Acción"].map(c => (
                <th key={c} style={{ textAlign: "left", fontSize: 11, color: "#475569", padding: "10px 14px", fontWeight: 600 }}>{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {myUsers.map(u => {
              const team = teams.find(t => t.id === u.teamId);
              return (
                <tr key={u.id} style={{ borderTop: "1px solid rgba(255,255,255,.05)" }}>
                  <td style={{ padding: "10px 14px" }}><Avatar initials={u.initials} color={u.color} size={28} /></td>
                  <td style={{ padding: "10px 14px", fontSize: 13, color: "#e2e8f0", fontWeight: 500 }}>{u.name}</td>
                  <td style={{ padding: "10px 14px", fontSize: 12, color: "#64748b" }}>{u.email}</td>
                  <td style={{ padding: "10px 14px", fontSize: 12, color: team?.color || "#475569" }}>{team?.name || "—"}</td>
                  <td style={{ padding: "10px 14px" }}><RoleBadge role={u.role} /></td>
                  <td style={{ padding: "10px 14px" }}>
                    {u.id !== user.id && (
                      <Btn sm v="danger" onClick={() => setUsers(p => p.filter(x => x.id !== u.id))}>Eliminar</Btn>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}
