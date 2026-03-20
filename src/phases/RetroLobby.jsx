import { TIMED_PHASES, PHASE_META, MAX_TITLE } from "../constants";
import { Avatar, Btn } from "../ui";

function TimeControl({ ph, value, onDec, onInc }) {
  return (
    <div style={{ background: "rgba(255,255,255,.03)", borderRadius: 8, padding: "9px 12px" }}>
      <label style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#64748b", marginBottom: 7 }}>
        {PHASE_META[ph].icon} {PHASE_META[ph].label}
      </label>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <button onClick={onDec} style={{ width: 24, height: 24, borderRadius: 5, border: "1px solid rgba(255,255,255,.1)", background: "transparent", color: "#94a3b8", cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit" }}>−</button>
        <span style={{ fontSize: 18, fontWeight: 700, color: "#e2e8f0", fontFamily: "'Sora',sans-serif", minWidth: 24, textAlign: "center" }}>{value}</span>
        <button onClick={onInc} style={{ width: 24, height: 24, borderRadius: 5, border: "1px solid rgba(255,255,255,.1)", background: "transparent", color: "#94a3b8", cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit" }}>+</button>
      </div>
    </div>
  );
}

export function RetroLobby({
  user, teamMembers,
  retroName, setRetroName,
  phaseTimes, setPhaseTimes,
  votesPerUser, setVotesPerUser,
  onStart,
}) {
  const remaining = MAX_TITLE - retroName.length;
  const upd = (ph, v) => setPhaseTimes(p => ({ ...p, [ph]: Math.max(1, v) }));

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "24px 18px 60px" }}>

      {/* Title */}
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'Sora',sans-serif", fontSize: 20, color: "#e2e8f0", marginBottom: 4 }}>⚙️ Configuración</h1>
        <p style={{ fontSize: 13, color: "#475569" }}>Configura la sesión antes de que el equipo entre</p>
      </div>

      {/* Retro name */}
      <div style={{ background: "#161923", border: "1px solid rgba(255,255,255,.08)", borderRadius: 12, padding: "16px 20px", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 7 }}>
          <label style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>Nombre de la retrospectiva</label>
          <span style={{ fontSize: 11, color: remaining <= 10 ? "#f87171" : remaining <= 20 ? "#fbbf24" : "#475569", fontWeight: 600 }}>
            {remaining} restantes
          </span>
        </div>
        <input
          value={retroName}
          onChange={e => setRetroName(e.target.value.slice(0, MAX_TITLE))}
          placeholder="Ej: Retro Sprint 42 — Equipo Atlas"
          style={{ width: "100%", background: "#0c0e14", border: "1px solid rgba(255,255,255,.12)", borderRadius: 8, padding: "10px 13px", color: "#e2e8f0", fontSize: 15, fontFamily: "'Sora',sans-serif", fontWeight: 600, outline: "none" }}
        />
      </div>

      {/* Room code */}
      <div style={{ background: "#161923", border: "1px solid rgba(255,255,255,.08)", borderRadius: 12, padding: "14px 20px", marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <p style={{ fontSize: 11, color: "#475569", marginBottom: 5 }}>Código de sala — comparte con el equipo</p>
          <div style={{ fontSize: 22, fontFamily: "'Sora',sans-serif", fontWeight: 700, letterSpacing: 5, color: "#818cf8" }}>RETRO-4829</div>
        </div>
        {/* Participants */}
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          {teamMembers.slice(0, 5).map(m => (
            <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <Avatar initials={m.initials} color={m.color} size={22} />
              <span style={{ fontSize: 12, color: "#94a3b8" }}>{m.name}</span>
              <span style={{ fontSize: 10, color: "#4ade80" }}>✓</span>
            </div>
          ))}
          {teamMembers.length > 5 && (
            <span style={{ fontSize: 11, color: "#475569" }}>+{teamMembers.length - 5} más</span>
          )}
        </div>
      </div>

      {/* Phase times */}
      <div style={{ background: "#161923", border: "1px solid rgba(255,255,255,.08)", borderRadius: 12, padding: "14px 20px", marginBottom: 12 }}>
        <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: 12, color: "#e2e8f0", margin: "0 0 12px" }}>⏱ Tiempo por fase (minutos)</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {TIMED_PHASES.map(ph => (
            <TimeControl
              key={ph} ph={ph} value={phaseTimes[ph]}
              onDec={() => upd(ph, phaseTimes[ph] - 1)}
              onInc={() => upd(ph, phaseTimes[ph] + 1)}
            />
          ))}
        </div>
      </div>

      {/* Votes */}
      <div style={{ background: "#161923", border: "1px solid rgba(255,255,255,.08)", borderRadius: 12, padding: "12px 20px", marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <p style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>🗳 Votos por participante</p>
          <p style={{ fontSize: 11, color: "#334155", marginTop: 1 }}>Acumulables en una sola tarjeta</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={() => setVotesPerUser(v => Math.max(1, v - 1))} style={{ width: 28, height: 28, borderRadius: 7, border: "1px solid rgba(255,255,255,.1)", background: "transparent", color: "#94a3b8", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit" }}>−</button>
          <span style={{ fontSize: 22, fontWeight: 700, color: "#e2e8f0", fontFamily: "'Sora',sans-serif", minWidth: 28, textAlign: "center" }}>{votesPerUser}</span>
          <button onClick={() => setVotesPerUser(v => Math.min(20, v + 1))} style={{ width: 28, height: 28, borderRadius: 7, border: "1px solid rgba(255,255,255,.1)", background: "transparent", color: "#94a3b8", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit" }}>+</button>
        </div>
      </div>

      <Btn full onClick={onStart} sx={{ padding: "13px", fontSize: 15 }}>🚀 Comenzar Retrospectiva</Btn>
    </div>
  );
}
