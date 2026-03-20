import { useState, useEffect } from "react";
import { DEMO_USERS, DEMO_TEAMS, DEMO_HISTORY } from "./constants";
import { GlobalStyles } from "./ui";
import { Login }       from "./Login";
import { Sidebar }     from "./Sidebar";
import { Dashboard }   from "./Dashboard";
import { Historial }   from "./Historial";
import { Accionables } from "./Accionables";
import { Usuarios }    from "./Usuarios";
import { Equipos }     from "./Equipos";
import { AdminPanel }  from "./AdminPanel";
import { RetroFlow }   from "./RetroFlow";

function AppShell({ user, onLogout }) {
  const [view,  setView]  = useState("dashboard");
  const [users, setUsers] = useState(DEMO_USERS);
  const [teams, setTeams] = useState(DEMO_TEAMS);
  const [history, setHistory]   = useState(DEMO_HISTORY);
  const [inRetro, setInRetro]   = useState(false);
  const [theme,   setTheme]     = useState("dark");
  const [lang,    setLang]      = useState("es");

  // Kanban item overrides: array of { id, status, priority, due, assignee, order, ... }
  const [kanbanItems, setKanbanItems] = useState([]);

  // Selected team for retro (user may belong to multiple)
  const [selectedTeamId, setSelectedTeamId] = useState(
    (user.teamIds || [])[0] || null
  );

  useEffect(() => {
    const el = document.getElementById("root");
    if (el) el.className = theme === "light" ? "light" : "";
  }, [theme]);

  const canMod = ["admin","owner","temporal"].includes(user.role);

  const teamMembers = users.filter(u =>
    u.id !== user.id && (u.teamIds||[]).includes(selectedTeamId)
  );

  const handleSaveRetro = (retroData) => {
    setHistory(p => [...p, { id:"h"+Date.now(), ...retroData }]);
  };

  if (inRetro) return (
    <RetroFlow
      user={user}
      teamMembers={teamMembers}
      allUsers={users}
      allTeams={teams}
      selectedTeamId={selectedTeamId}
      setSelectedTeamId={setSelectedTeamId}
      onFinish={() => { setInRetro(false); setView("dashboard"); }}
      onSaveRetro={handleSaveRetro}
      onSetKanban={(items) => {
        setKanbanItems(prev => {
          const next = [...prev];
          items.forEach((item, i) => {
            const idx = next.findIndex(x => x.id === item.id);
            if (idx >= 0) next[idx] = { ...next[idx], status:"inprogress" };
            else next.push({ id: item.id || `new-${Date.now()}-${i}`, status:"inprogress", ...item });
          });
          return next;
        });
      }}
      lang={lang}
    />
  );

  const renderView = () => {
    switch (view) {
      case "dashboard":   return <Dashboard    user={user} setView={setView} history={history} lang={lang} />;
      case "history":     return <Historial    user={user} history={history} users={users} lang={lang} />;
      case "actionables": return <Accionables  user={user} items={kanbanItems} setItems={setKanbanItems} history={history} lang={lang} />;
      case "users":       return <Usuarios     user={user} users={users} setUsers={setUsers} teams={teams} lang={lang} />;
      case "teams":       return <Equipos      user={user} users={users} setUsers={setUsers} teams={teams} setTeams={setTeams} lang={lang} />;
      case "admin":       return <AdminPanel   users={users} setUsers={setUsers} teams={teams} lang={lang} />;
      default:            return <Dashboard    user={user} setView={setView} history={history} lang={lang} />;
    }
  };

  return (
    <div style={{ display:"flex", height:"100vh", overflow:"hidden" }}>
      <Sidebar
        user={user} view={view} setView={setView}
        onLogout={onLogout}
        onNuevaRetro={canMod ? () => setInRetro(true) : undefined}
        theme={theme} setTheme={setTheme}
        lang={lang}   setLang={setLang}
      />
      <main style={{ flex:1, overflow:"auto", background:"var(--bg)" }}>
        {renderView()}
      </main>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  return (
    <>
      <GlobalStyles />
      {user
        ? <AppShell user={user} onLogout={() => setUser(null)} />
        : <Login    onLogin={setUser} />
      }
    </>
  );
}
