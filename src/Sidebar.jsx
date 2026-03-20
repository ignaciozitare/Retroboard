import { DEMO_TEAMS } from "./constants";
import { Avatar, RoleBadge } from "./ui";
import { useT } from "./i18n";

const NAV = [
  { id:"dashboard",    icon:"🏠", key:"dashboard",   roles:["admin","owner","temporal","member"] },
  { id:"nueva",        icon:"🚀", key:"newRetro",     roles:["admin","owner","temporal"]          },
  { id:"history",      icon:"📚", key:"history",      roles:["admin","owner","temporal","member"] },
  { id:"actionables",  icon:"🎯", key:"actionables",  roles:["admin","owner","temporal","member"] },
  { id:"users",        icon:"👥", key:"users",        roles:["admin","owner"]                    },
  { id:"teams",        icon:"🏷️",  key:"teams",        roles:["admin","owner"]                    },
  { id:"admin",        icon:"🔧", key:"admin",        roles:["admin"]                            },
];

export function Sidebar({ user, view, setView, onLogout, onNuevaRetro, theme, setTheme, lang, setLang }) {
  const t = useT(lang);
  const teamName = DEMO_TEAMS.filter(te => (user.teamIds||[]).includes(te.id)).map(t=>t.name).join(", ") || "Global";
  const items = NAV.filter(i => i.roles.includes(user.role));

  return (
    <aside style={{ width:210, flexShrink:0, background:"var(--surf)", borderRight:"1px solid var(--border)", display:"flex", flexDirection:"column", height:"100%", overflow:"hidden" }}>
      {/* Logo + controls */}
      <div style={{ padding:"14px 12px 10px", borderBottom:"1px solid var(--border)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
          <span style={{ fontSize:18 }}>🔁</span>
          <span style={{ fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:15, color:"var(--tx)" }}>RetroBoard</span>
        </div>
        {/* Theme + Lang toggles */}
        <div style={{ display:"flex", gap:6 }}>
          <button onClick={() => setTheme(t => t === "dark" ? "light" : "dark")}
            title={theme === "dark" ? "Modo claro" : "Modo oscuro"}
            style={{ flex:1, background:"var(--surf2)", border:"1px solid var(--border)", borderRadius:7, padding:"4px 0", cursor:"pointer", fontSize:14, color:"var(--tx2)" }}>
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
          <button onClick={() => setLang(l => l === "es" ? "en" : "es")}
            style={{ flex:1, background:"var(--surf2)", border:"1px solid var(--border)", borderRadius:7, padding:"4px 6px", cursor:"pointer", fontSize:11, fontWeight:700, color:"var(--tx2)", fontFamily:"inherit" }}>
            {lang === "es" ? "EN" : "ES"}
          </button>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex:1, padding:"8px 6px", display:"flex", flexDirection:"column", gap:2, overflowY:"auto" }}>
        {items.map(item => {
          const active = view === item.id && item.id !== "nueva";
          const isNew  = item.id === "nueva";
          return (
            <button key={item.id}
              onClick={() => isNew ? (onNuevaRetro && onNuevaRetro()) : setView(item.id)}
              style={{ display:"flex", alignItems:"center", gap:9, padding:"8px 10px", borderRadius:8, border:"none",
                background: active ? "var(--accentD)" : isNew ? "var(--accentD)" : "transparent",
                color: active || isNew ? "var(--accent)" : "var(--tx3)",
                cursor:"pointer", fontSize:13, fontWeight: active||isNew ? 600 : 400, transition:"all .14s", textAlign:"left" }}>
              <span style={{ fontSize:15 }}>{item.icon}</span>{t[item.key]}
            </button>
          );
        })}
      </nav>

      {/* User */}
      <div style={{ padding:"10px 12px", borderTop:"1px solid var(--border)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
          <Avatar initials={user.initials} color={user.color} size={30} />
          <div style={{ minWidth:0 }}>
            <div style={{ fontSize:12, color:"var(--tx)", fontWeight:600, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{user.name}</div>
            <div style={{ fontSize:11, color:"var(--tx3)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{teamName}</div>
          </div>
        </div>
        <RoleBadge role={user.role} />
        <button onClick={onLogout}
          style={{ display:"block", marginTop:8, width:"100%", background:"transparent", border:"1px solid var(--border)", borderRadius:7, padding:"5px", color:"var(--tx3)", cursor:"pointer", fontSize:11, fontFamily:"inherit" }}>
          {t.logout}
        </button>
      </div>
    </aside>
  );
}
