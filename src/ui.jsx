import { useState } from "react";
import { ROLE_META, HEADER_H } from "./constants";

// ─── UTILS ────────────────────────────────────────────────────────────────────
export const fmt = (s) =>
  `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

export const dateStr = (d) =>
  new Date(d).toLocaleDateString("es-ES", { day:"numeric", month:"short", year:"numeric" });

export const genPass = () => {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#";
  return Array.from({ length: 10 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
};

// ─── AVATAR ───────────────────────────────────────────────────────────────────
export function Avatar({ name, initials, color, size = 30 }) {
  return (
    <div
      title={name}
      style={{
        width: size, height: size, borderRadius: "50%",
        background: color || "#6366f1",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: size * 0.34, fontWeight: 700, color: "#fff", flexShrink: 0,
      }}
    >
      {initials || (name || "?").slice(0, 2).toUpperCase()}
    </div>
  );
}

// ─── ROLE BADGE ───────────────────────────────────────────────────────────────
export function RoleBadge({ role }) {
  const m = ROLE_META[role] || ROLE_META.member;
  return (
    <span style={{
      background: m.bg, color: m.color,
      borderRadius: 20, padding: "2px 9px",
      fontSize: 11, fontWeight: 600, whiteSpace: "nowrap",
    }}>
      {m.label}
    </span>
  );
}

// ─── BUTTON ───────────────────────────────────────────────────────────────────
const BTN_VARIANTS = {
  primary: { background: "#6366f1", color: "#fff" },
  ghost:   { background: "rgba(255,255,255,.05)", color: "#94a3b8", border: "1px solid rgba(255,255,255,.1)" },
  success: { background: "rgba(74,222,128,.14)",  color: "#4ade80", border: "1px solid rgba(74,222,128,.3)" },
  warn:    { background: "rgba(251,191,36,.13)",  color: "#fbbf24", border: "1px solid rgba(251,191,36,.3)" },
  danger:  { background: "rgba(248,113,113,.13)", color: "#f87171", border: "1px solid rgba(248,113,113,.3)" },
};

export function Btn({ children, onClick, v = "primary", sm, full, disabled, sx = {} }) {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      style={{
        display: "inline-flex", alignItems: "center", gap: 5,
        padding: sm ? "4px 11px" : "8px 16px",
        borderRadius: 8, border: "none",
        cursor: disabled ? "not-allowed" : "pointer",
        fontWeight: 600, fontSize: sm ? 11 : 13,
        opacity: disabled ? 0.4 : 1,
        transition: "all .15s",
        width: full ? "100%" : undefined,
        justifyContent: full ? "center" : undefined,
        fontFamily: "inherit",
        ...BTN_VARIANTS[v],
        ...sx,
      }}
    >
      {children}
    </button>
  );
}

// ─── SECTION CARD ─────────────────────────────────────────────────────────────
export function Card({ children, sx = {} }) {
  return (
    <div style={{
      background: "#161923",
      border: "1px solid rgba(255,255,255,.08)",
      borderRadius: 12,
      padding: "16px 20px",
      ...sx,
    }}>
      {children}
    </div>
  );
}

// ─── STAT BOX ─────────────────────────────────────────────────────────────────
export function StatBox({ label, value, color, icon }) {
  return (
    <div style={{
      background: "#161923", border: "1px solid rgba(255,255,255,.07)",
      borderRadius: 12, padding: "14px", textAlign: "center",
    }}>
      {icon && <div style={{ fontSize: 18, marginBottom: 6 }}>{icon}</div>}
      <div style={{ fontSize: 26, fontWeight: 700, fontFamily: "'Sora',sans-serif", color }}>{value}</div>
      <div style={{ fontSize: 11, color: "#475569", marginTop: 3 }}>{label}</div>
    </div>
  );
}

// ─── STICKY TIMER BAR ─────────────────────────────────────────────────────────
export function TimerBar({
  timer, setTimer, running, setRunning,
  isMod, phaseMins, setPhaseMins,
  onNext, nextLabel, extraContent,
}) {
  const [editing, setEditing] = useState(false);
  const [editVal, setEditVal] = useState("");

  const totalSecs = phaseMins * 60;
  const pct = totalSecs > 0 ? Math.min(100, (timer / totalSecs) * 100) : 0;
  const tc = timer > 60 ? "#4ade80" : timer > 20 ? "#fbbf24" : "#f87171";

  const commitEdit = () => {
    const n = parseInt(editVal, 10);
    if (n > 0 && n <= 120) { setPhaseMins(n); setTimer(n * 60); }
    setEditing(false);
  };

  return (
    <div style={{
      position: "sticky", top: HEADER_H, zIndex: 15,
      background: "rgba(12,14,20,0.97)", backdropFilter: "blur(10px)",
      borderBottom: "1px solid rgba(255,255,255,.06)",
      padding: "10px 20px",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, maxWidth: 1200, margin: "0 auto" }}>
        {/* Clock */}
        <div style={{ fontSize: 24, fontFamily: "'Sora',sans-serif", fontWeight: 700, color: tc, minWidth: 64, letterSpacing: 0.5 }}>
          {fmt(timer)}
        </div>

        {/* Progress + label */}
        <div style={{ flex: 1 }}>
          <div style={{ background: "rgba(255,255,255,.06)", borderRadius: 4, height: 5, overflow: "hidden", marginBottom: 5 }}>
            <div style={{ width: `${pct}%`, height: "100%", background: tc, borderRadius: 4, transition: "width 1s linear, background .4s" }} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {extraContent}
            {isMod && (
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginLeft: "auto" }}>
                <span style={{ fontSize: 11, color: "#334155" }}>Duración:</span>
                {editing
                  ? <input
                      autoFocus value={editVal}
                      onChange={e => setEditVal(e.target.value)}
                      onBlur={commitEdit}
                      onKeyDown={e => { if (e.key === "Enter") commitEdit(); if (e.key === "Escape") setEditing(false); }}
                      style={{ width: 40, background: "#0c0e14", border: "1px solid rgba(99,102,241,.5)", borderRadius: 5, padding: "2px 5px", color: "#e2e8f0", fontSize: 11, textAlign: "center", outline: "none", fontFamily: "inherit" }}
                    />
                  : <button
                      onClick={() => { setEditVal(String(phaseMins)); setEditing(true); }}
                      style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 5, padding: "2px 7px", color: "#64748b", fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}
                    >
                      {phaseMins} min ✎
                    </button>
                }
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        {isMod && (
          <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
            <Btn sm v={running ? "warn" : "success"} onClick={() => setRunning(r => !r)}>
              {running ? "⏸ Pausar" : "▶ Iniciar"}
            </Btn>
            {onNext && <Btn sm v="ghost" onClick={onNext}>{nextLabel || "Siguiente →"}</Btn>}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── GLOBAL STYLES (inject once) ─────────────────────────────────────────────
export const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { height: 100%; font-family: 'DM Sans', system-ui, sans-serif; background: #0C0E14; color: #E2E6F0; }
    button, input, select, textarea { font-family: inherit; }
    ::-webkit-scrollbar { width: 5px; height: 5px; }
    ::-webkit-scrollbar-track { background: #161923; }
    ::-webkit-scrollbar-thumb { background: #2a2f45; border-radius: 3px; }
    select option { background: #161923; }
    @keyframes pulse { from { box-shadow: 0 0 0 0 rgba(99,102,241,.5); } to { box-shadow: 0 0 0 6px rgba(99,102,241,0); } }
  `}</style>
);
