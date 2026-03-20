import { DEMO_HISTORY, DEMO_TEAMS } from "./constants";
import { Btn, StatBox, dateStr } from "./ui";

export function Dashboard({ user, setView, history: historyProp, lang }) {
  const myHistory = (historyProp || DEMO_HISTORY).filter(r =>
    user.role === "admin" || (user.teamIds||[]).includes(r.teamId)
  );
  const lastRetro  = myHistory[myHistory.length - 1];
  const openItems  = myHistory.flatMap(r => r.actionables).filter(a => a.status === "open").length;
  const teamCount  = user.role === "admin" ? DEMO_TEAMS.length : 1;

  return (
    <div style={{ padding: "24px", maxWidth: 900 }}>
      <h1 style={{ fontFamily: "'Sora',sans-serif", fontSize: 20, color: "#e2e8f0", marginBottom: 4 }}>
        Bienvenido, {user.name.split(" ")[0]} 👋
      </h1>
      <p style={{ fontSize: 13, color: "#475569", marginBottom: 24 }}>Panel de RetroBoard</p>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 14, marginBottom: 24 }}>
        <StatBox label="Retros realizadas"     value={myHistory.length} color="#818cf8" icon="🔁" />
        <StatBox label="Accionables abiertos"  value={openItems}        color="#f87171" icon="🎯" />
        <StatBox label="Equipos activos"        value={teamCount}        color="#4ade80" icon="🏷️" />
      </div>

      {/* Last retro */}
      {lastRetro && (
        <div style={{ background: "#161923", border: "1px solid rgba(255,255,255,.07)", borderRadius: 12, padding: "18px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: 14, color: "#e2e8f0" }}>Última retrospectiva</h3>
            <Btn sm v="ghost" onClick={() => setView("history")}>Ver historial →</Btn>
          </div>
          <p style={{ fontSize: 14, color: "#e2e8f0", fontWeight: 600, marginBottom: 4 }}>{lastRetro.name}</p>
          <p style={{ fontSize: 12, color: "#475569", marginBottom: 12 }}>
            📅 {dateStr(lastRetro.date)} · {lastRetro.stats.cards} tarjetas · {lastRetro.stats.withAction} accionables
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {lastRetro.actionables.map((a, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 10px", background: "rgba(255,255,255,.02)", borderRadius: 8 }}>
                <span style={{ fontSize: 13, color: a.status === "done" ? "#4ade80" : "#f87171" }}>
                  {a.status === "done" ? "✓" : "○"}
                </span>
                <span style={{ fontSize: 12, color: a.status === "done" ? "#475569" : "#e2e8f0", flex: 1, textDecoration: a.status === "done" ? "line-through" : "none" }}>
                  {a.text}
                </span>
                <span style={{ fontSize: 11, color: "#475569" }}>{a.assignee}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA for moderators */}
      {(user.role === "owner" || user.role === "temporal") && (
        <div style={{ marginTop: 20, padding: "18px 20px", background: "rgba(99,102,241,.08)", border: "1px solid rgba(99,102,241,.25)", borderRadius: 12, display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontSize: 28 }}>🚀</span>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 14, color: "#e2e8f0", fontWeight: 600, marginBottom: 2 }}>¿Listo para la próxima retro?</p>
            <p style={{ fontSize: 12, color: "#64748b" }}>Crea una nueva sesión y configura el flujo en segundos</p>
          </div>
          <Btn onClick={() => setView("nueva")}>Nueva Retro →</Btn>
        </div>
      )}
    </div>
  );
}
