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
  const [view,setView]       = useState("dashboard");
  const [users,setUsers]     = useState(DEMO_USERS);
  const [teams,setTeams]     = useState(DEMO_TEAMS);
  const [history,setHistory] = useState(DEMO_HISTORY);
  const [inRetro,setInRetro] = useState(false);
  const [theme,setTheme]     = useState("dark");
  const [lang,setLang]       = useState("es");

  // Actionable kanban statuses: { "retroId-idx": "todo"|"inprogress"|"done"|"cancelled" }
  const [actionableStatuses,setActionableStatuses] = useState({});

  // Apply theme class to root
  useEffect(()=>{
    const el = document.getElementById("root");
    if(el){ el.className = theme === "light" ? "light" : ""; }
  },[theme]);

  const canMod = ["admin","owner","temporal"].includes(user.role);
  const teamMembers = users.filter(u => u.teamId===user.teamId && u.id!==user.id);

  const handleSaveRetro = (retroData) => {
    setHistory(p => [...p, { id:"h"+Date.now(), ...retroData }]);
  };

  // When retro ends, move selected actionables to "inprogress" in kanban
  const handleSetKanban = (newRetroId, items) => {
    const retroId = "h"+Date.now(); // approximate — in real app use the actual id
    setActionableStatuses(p => {
      const next = { ...p };
      items.forEach((item, i) => { next[`${retroId}-${i}`] = "inprogress"; });
      return next;
    });
  };

  if(inRetro) return (
    <RetroFlow
      user={user} teamMembers={teamMembers}
      onFinish={()=>{ setInRetro(false); setView("dashboard"); }}
      onSaveRetro={handleSaveRetro}
      onSetKanban={(items) => {
        // Find the latest history entry after save
        const newId = "h" + (Date.now()-1);
        setActionableStatuses(p => {
          const next = { ...p };
          items.forEach((item, i) => { next[`${newId}-${i}`] = "inprogress"; });
          return next;
        });
      }}
      lang={lang}
    />
  );

  const renderView = () => {
    switch(view){
      case "dashboard":   return <Dashboard    user={user} setView={setView} history={history} lang={lang} />;
      case "history":     return <Historial    user={user} history={history} users={users} lang={lang} />;
      case "actionables": return <Accionables  user={user} actionableStatuses={actionableStatuses} setActionableStatuses={setActionableStatuses} history={history} lang={lang} />;
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
        onNuevaRetro={canMod ? ()=>setInRetro(true) : undefined}
        theme={theme} setTheme={setTheme}
        lang={lang} setLang={setLang}
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
