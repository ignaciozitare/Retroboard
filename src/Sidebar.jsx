import { DEMO_TEAMS } from "./constants";
import { Avatar, RoleBadge } from "./ui";

const NAV_ITEMS = [
  { id: "dashboard", icon: "🏠", label: "Dashboard",  roles: ["admin","owner","temporal","member"] },
  { id: "nueva",     icon: "🚀", label: "Nueva Retro", roles: ["owner","temporal"]                 },
  { id: "history",   icon: "📚", label: "Historial",   roles: ["admin","owner","temporal","member"] },
  { id: "users",     icon: "👥", label: "Usuarios",    roles: ["admin","owner"]                    },
  { id: "teams",     icon: "🏷️",  label: "Equipos",    roles: ["admin","owner"]                    },
  { id: "admin",     icon: "🔧", label: "Admin",       roles: ["admin"]                            },
];

export function Sidebar({ user, view, setView, onLogout, onNuevaRetro }) {
  const teamName = DEMO_TEAMS.find(t => t.id === user.teamId)?.name || "—";
  const items = NAV_ITEMS.filter(i => i.roles.includes(user.role));

  return (
    <aside style={{
      width: 210, flexShrink: 0,
      background: "#111318",
      borderRight: "1px solid rgba(255,255,255,.06)",
      display: "flex", flexDirection: "column",
      height: "100%", overflow: "hidden",
    }}>
      {/* Logo */}
      <div style={{ padding: "18px 16px 14px", borderBottom: "1px solid rgba(255,255,255,.06)", display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 18 }}>🔁</span>
        <span style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 15, color: "#e2e8f0" }}>RetroBoard</span>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "10px 8px", display: "flex", flexDirection: "column", gap: 2, overflowY: "auto" }}>
        {items.map(item => {
          const active = view === item.id;
          return (
            <button
              key={item.id}
              onClick={() => item.id === "nueva" ? onNuevaRetro?.() : setView(item.id)}
              style={{
                display: "flex", alignItems: "center", gap: 9,
                padding: "8px 10px", borderRadius: 8, border: "none",
                background: active ? "rgba(99,102,241,.2)" : "transparent",
                color: active ? "#818cf8" : "#64748b",
                cursor: "pointer", fontSize: 13,
                fontWeight: active ? 600 : 400,
                transition: "all .14s", textAlign: "left",
              }}
            >
              <span style={{ fontSize: 15 }}>{item.icon}</span>
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* User footer */}
      <div style={{ padding: "12px", borderTop: "1px solid rgba(255,255,255,.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <Avatar initials={user.initials} color={user.color} size={30} />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 12, color: "#e2e8f0", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {user.name}
            </div>
            <div style={{ fontSize: 11, color: "#475569", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {teamName}
            </div>
          </div>
        </div>
        <RoleBadge role={user.role} />
        <button
          onClick={onLogout}
          style={{ display: "block", marginTop: 8, width: "100%", background: "transparent", border: "1px solid rgba(255,255,255,.07)", borderRadius: 7, padding: "5px", color: "#475569", cursor: "pointer", fontSize: 11 }}
        >
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
