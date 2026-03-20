import { useState } from "react";
import { DEMO_USERS, DEMO_TEAMS, DEMO_HISTORY } from "./constants";
import { GlobalStyles } from "./ui";
import { Login }      from "./Login";
import { Sidebar }    from "./Sidebar";
import { Dashboard }  from "./Dashboard";
import { Historial }  from "./Historial";
import { Usuarios }   from "./Usuarios";
import { Equipos }    from "./Equipos";
import { AdminPanel } from "./AdminPanel";
import { RetroFlow }  from "./RetroFlow";

// ─── APP SHELL ───────────────────────────────────────────────────────────────
function AppShell({ user, onLogout }) {
  const [view, setView]       = useState("dashboard");
  const [users, setUsers]     = useState(DEMO_USERS);
  const [teams, setTeams]     = useState(DEMO_TEAMS);
  const [history, setHistory] = useState(DEMO_HISTORY);
  const [inRetro, setInRetro] = useState(false);

  // Team members of the current user (for retro participants)
  const teamMembers = users.filter(u =>
    u.teamId === user.teamId && u.id !== user.id
  );

  const handleSaveRetro = (retroData) => {
    const newId = "h" + Date.now();
    setHistory(p => [...p, { id: newId, ...retroData }]);
  };

  // Full-screen retro mode (replaces sidebar layout)
  if (inRetro) {
    return (
      <RetroFlow
        user={user}
        teamMembers={teamMembers}
        onFinish={() => { setInRetro(false); setView("dashboard"); }}
        onSaveRetro={handleSaveRetro}
      />
    );
  }

  const renderView = () => {
    switch (view) {
      case "dashboard": return <Dashboard  user={user} setView={setView} history={history} />;
      case "history":   return <Historial  user={user} history={history} users={users} />;
      case "users":     return <Usuarios   user={user} users={users} setUsers={setUsers} teams={teams} />;
      case "teams":     return <Equipos    user={user} users={users} teams={teams} setTeams={setTeams} />;
      case "admin":     return <AdminPanel users={users} setUsers={setUsers} teams={teams} />;
      default:          return <Dashboard  user={user} setView={setView} history={history} />;
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <Sidebar
        user={user} view={view} setView={setView}
        onLogout={onLogout}
        onNuevaRetro={() => setInRetro(true)}
      />
      <main style={{ flex: 1, overflow: "auto", background: "#0C0E14" }}>
        {renderView()}
      </main>
    </div>
  );
}

// ─── ROOT ────────────────────────────────────────────────────────────────────
function App() {
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

export default App;

