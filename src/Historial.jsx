import { useState } from "react";
import { DEMO_HISTORY, DEMO_TEAMS, DEMO_USERS, CATS_MAP } from "./constants";
import { Avatar, Btn, StatBox, dateStr } from "./ui";

function ActionableRow({ a, i, total }) {
  return (
    <div style={{
      padding: "12px 18px",
      borderBottom: i < total - 1 ? "1px solid rgba(255,255,255,.05)" : "none",
      display: "flex", gap: 12, alignItems: "center",
    }}>
      <span style={{ fontSize: 16 }}>{a.status === "done" ? "✅" : "⭕"}</span>
      <div style={{ flex: 1 }}>
        <p style={{
          fontSize: 13, fontWeight: 500, margin: "0 0 3px",
          color: a.status === "done" ? "#475569" : "#e2e8f0",
          textDecoration: a.status === "done" ? "line-through" : "none",
        }}>
          {a.text}
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          <span style={{ fontSize: 11, color: "#64748b" }}>👤 {a.assignee}</span>
          <span style={{ fontSize: 11, color: "#64748b" }}>📅 {a.due}</span>
        </div>
      </div>
      <span style={{
        fontSize: 11, padding: "2px 9px", borderRadius: 20, fontWeight: 600,
        background: a.status === "done" ? "rgba(74,222,128,.1)" : "rgba(248,113,113,.1)",
        color: a.status === "done" ? "#4ade80" : "#f87171",
      }}>
        {a.status === "done" ? "Cerrado" : "Abierto"}
      </span>
    </div>
  );
}

function RetroDetail({ retro }) {
  const team = DEMO_TEAMS.find(t => t.id === retro.teamId);

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 10 }}>
          <div>
            <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: 18, color: "#e2e8f0", marginBottom: 6 }}>{retro.name}</h2>
            <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
              <span style={{ fontSize: 12, color: "#475569" }}>📅 {dateStr(retro.date)}</span>
              {team && <span style={{ fontSize: 12, color: team.color, fontWeight: 600 }}>{team.name}</span>}
              <div style={{ display: "flex" }}>
                {retro.participants.map((uid, i) => {
                  const u = ((usersProp||DEMO_USERS).find(x => x.id === uid));
                  if (!u) return null;
                  return <div key={uid} style={{ marginLeft: i > 0 ? -6 : 0 }}><Avatar initials={u.initials} color={u.color} size={24} name={u.name} /></div>;
                })}
              </div>
              <span style={{ fontSize: 12, color: "#475569" }}>{retro.participants.length} participantes</span>
            </div>
          </div>
          <Btn sm v="ghost">📄 Exportar</Btn>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
          <StatBox label="Tarjetas"       value={retro.stats.cards}                              color="#818cf8" />
          <StatBox label="Con accionable" value={retro.stats.withAction}                         color="#4ade80" />
          <StatBox label="Sin accionable" value={retro.stats.cards - retro.stats.withAction}     color="#f87171" />
          <StatBox label="Votos"          value={retro.stats.votes}                              color="#fbbf24" />
        </div>
      </div>

      {/* Actionables */}
      <div style={{ background: "#161923", border: "1px solid rgba(255,255,255,.07)", borderRadius: 12, overflow: "hidden", marginBottom: 16 }}>
        <div style={{ padding: "12px 18px", borderBottom: "1px solid rgba(255,255,255,.07)", display: "flex", alignItems: "center", gap: 8 }}>
          <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: 13, color: "#e2e8f0", margin: 0 }}>🎯 Accionables</h3>
          <span style={{ background: "rgba(74,222,128,.1)", color: "#4ade80", borderRadius: 20, padding: "2px 8px", fontSize: 11, fontWeight: 700 }}>
            {retro.actionables.length}
          </span>
          <span style={{ marginLeft: "auto", fontSize: 11, color: "#f87171" }}>
            {retro.actionables.filter(a => a.status === "open").length} abiertos
          </span>
        </div>
        {retro.actionables.map((a, i) => (
          <ActionableRow key={i} a={a} i={i} total={retro.actionables.length} />
        ))}
      </div>

      {/* Cards by category */}
      <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: 13, color: "#94a3b8", margin: "0 0 12px" }}>
        Tarjetas por categoría
      </h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {Object.entries(CATS_MAP).map(([id, cat]) => {
          const catCards = retro.cards.filter(c => c.cat === id);
          if (!catCards.length) return null;
          return (
            <div key={id} style={{
              background: "#161923",
              border: `1px solid ${cat.color}25`,
              borderTop: `3px solid ${cat.color}`,
              borderRadius: 10, padding: "12px 14px",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                <span>{cat.emoji}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: cat.color }}>{cat.label}</span>
                <span style={{ marginLeft: "auto", fontSize: 11, color: cat.color, fontWeight: 700 }}>{catCards.length}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                {catCards.map((c, i) => (
                  <p key={i} style={{ fontSize: 12, color: "#94a3b8", margin: 0, paddingLeft: 8, borderLeft: `2px solid ${cat.color}40` }}>
                    {c.text}
                  </p>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function Historial({ user, history: historyProp, users: usersProp }) {
  const myHistory = (historyProp || DEMO_HISTORY).filter(r =>
    user.role === "admin" || r.teamId === user.teamId
  );
  const [selId, setSelId] = useState(myHistory[myHistory.length - 1]?.id || null);
  const retro = myHistory.find(r => r.id === selId);

  return (
    <div style={{ display: "flex", height: "100%", overflow: "hidden" }}>
      {/* Sidebar list */}
      <div style={{ width: "clamp(160px, 30%, 250px)", flexShrink: 0, borderRight: "1px solid rgba(255,255,255,.06)", overflowY: "auto", padding: "12px 8px" }}>
        <p style={{ fontSize: 11, color: "#475569", fontWeight: 600, marginBottom: 10, padding: "0 8px" }}>
          RETROSPECTIVAS ({myHistory.length})
        </p>
        {[...myHistory].reverse().map(r => {
          const team = DEMO_TEAMS.find(t => t.id === r.teamId);
          const active = selId === r.id;
          return (
            <button
              key={r.id}
              onClick={() => setSelId(r.id)}
              style={{
                width: "100%",
                background: active ? "rgba(99,102,241,.15)" : "transparent",
                border: `1px solid ${active ? "rgba(99,102,241,.4)" : "transparent"}`,
                borderRadius: 9, padding: "10px 12px",
                cursor: "pointer", textAlign: "left", marginBottom: 4,
                transition: "all .12s",
              }}
            >
              <div style={{ fontSize: 12, color: active ? "#e2e8f0" : "#94a3b8", fontWeight: active ? 600 : 400, marginBottom: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {r.name}
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ fontSize: 11, color: "#475569" }}>{dateStr(r.date)}</span>
                {team && <span style={{ fontSize: 11, color: team.color }}>{team.name}</span>}
              </div>
              <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                <span style={{ fontSize: 10, color: "#4ade80" }}>🎯 {r.stats.withAction}</span>
                <span style={{ fontSize: 10, color: "#818cf8" }}>🗳 {r.stats.votes}</span>
                <span style={{ fontSize: 10, color: r.actionables.filter(a=>a.status==="open").length>0?"#f87171":"#4ade80" }}>
                  {r.actionables.filter(a=>a.status==="open").length} abiertos
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Detail */}
      {retro
        ? <RetroDetail retro={retro} />
        : <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <p style={{ color: "#334155", fontSize: 14 }}>Selecciona una retrospectiva</p>
          </div>
      }
    </div>
  );
}
