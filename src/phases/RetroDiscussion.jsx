import { CATS } from "../constants";
import { TimerBar, Btn } from "../ui";

export function RetroDiscussion({
  isMod, sortedCards, setSortedCards, discussIdx, setDiscussIdx,
  teamMembers,
  timer, setTimer, running, setRunning, phaseMins, setPhaseMins,
  onFinish,
}) {
  const card = sortedCards[discussIdx];
  if (!card) return null;

  const cat     = CATS.find(c => c.id === card.category);
  const people  = ["Yo", ...(teamMembers || []).map(m => m.name)];
  const withAct = sortedCards.filter(c => c.actionable).length;
  const upd     = (f, v) => setSortedCards(p => p.map((c, i) => i === discussIdx ? { ...c, [f]: v } : c));

  return (
    <div>
      <TimerBar
        timer={timer} setTimer={setTimer} running={running} setRunning={setRunning}
        isMod={isMod} phaseMins={phaseMins} setPhaseMins={setPhaseMins}
        onNext={onFinish} nextLabel="Ver Resumen →"
      />

      <div style={{ maxWidth: 980, margin: "0 auto", padding: "16px 18px 50px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>

          {/* Main panel */}
          <div>
            {/* Progress bar */}
            <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 12 }}>
              <span style={{ fontSize: 11, color: "#334155" }}>Tarjeta {discussIdx + 1} / {sortedCards.length}</span>
              <div style={{ flex: 1, background: "rgba(255,255,255,.06)", borderRadius: 4, height: 4 }}>
                <div style={{ width: `${((discussIdx + 1) / sortedCards.length) * 100}%`, height: "100%", background: "#6366f1", borderRadius: 4, transition: "width .3s" }} />
              </div>
              <span style={{ fontSize: 11, color: "#4ade80" }}>{withAct}/{sortedCards.length} ✓</span>
            </div>

            {/* Spotlight card */}
            <div style={{ background: "#161923", border: `1px solid ${cat.border}`, borderLeft: `4px solid ${cat.color}`, borderRadius: 13, padding: "18px 22px", marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
                <span style={{ fontSize: 12 }}>{cat.emoji}</span>
                <span style={{ fontSize: 11, color: cat.color, fontWeight: 700 }}>{cat.label}</span>
                <div style={{ marginLeft: "auto", display: "flex", gap: 3, alignItems: "center" }}>
                  {Array.from({ length: Math.min(card.votes, 10) }).map((_, i) => (
                    <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: "#6366f1" }} />
                  ))}
                  <span style={{ fontSize: 11, color: "#818cf8", marginLeft: 4 }}>{card.votes} votos</span>
                </div>
              </div>
              <p style={{ fontSize: 16, lineHeight: 1.65, color: "#e2e8f0", margin: "0 0 8px" }}>{card.text}</p>
              {card.merged?.length > 0 && (
                <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 4 }}>
                  {card.merged.map(m => (
                    <p key={m.id} style={{ fontSize: 12, color: "#475569", margin: 0, paddingLeft: 8, borderLeft: "2px solid rgba(255,255,255,.07)" }}>↳ {m.text}</p>
                  ))}
                </div>
              )}
              <span style={{ fontSize: 11, color: "#334155", marginTop: 8, display: "block" }}>por {card.author}</span>
            </div>

            {/* Actionable panel */}
            <div style={{ background: "#161923", border: "1px solid rgba(255,255,255,.07)", borderRadius: 11, padding: "15px 18px" }}>
              <h4 style={{ fontFamily: "'Sora',sans-serif", fontSize: 12, color: "#e2e8f0", margin: "0 0 9px" }}>🎯 Accionable</h4>
              <textarea
                value={card.actionable}
                onChange={e => upd("actionable", e.target.value)}
                placeholder="¿Qué vamos a hacer? Siguiente paso concreto…"
                rows={3}
                style={{ width: "100%", background: "#0c0e14", border: "1px solid rgba(255,255,255,.12)", borderRadius: 8, padding: "8px 10px", color: "#e2e8f0", fontSize: 12, resize: "none", fontFamily: "inherit", outline: "none", marginBottom: 9 }}
              />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9 }}>
                <div>
                  <label style={{ display: "block", fontSize: 10, color: "#475569", marginBottom: 4 }}>Responsable</label>
                  <select value={card.assignee} onChange={e => upd("assignee", e.target.value)} style={{ width: "100%", background: "#0c0e14", border: "1px solid rgba(255,255,255,.12)", borderRadius: 7, padding: "7px 10px", color: card.assignee ? "#e2e8f0" : "#334155", fontFamily: "inherit", fontSize: 12 }}>
                    <option value="">Sin asignar</option>
                    {people.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 10, color: "#475569", marginBottom: 4 }}>Fecha límite</label>
                  <input type="date" value={card.dueDate || ""} onChange={e => upd("dueDate", e.target.value)} style={{ width: "100%", background: "#0c0e14", border: "1px solid rgba(255,255,255,.12)", borderRadius: 7, padding: "7px 10px", color: card.dueDate ? "#e2e8f0" : "#334155", fontFamily: "inherit", fontSize: 12 }} />
                </div>
              </div>
              {card.actionable && (
                <div style={{ marginTop: 9, padding: "6px 10px", background: "rgba(74,222,128,.07)", border: "1px solid rgba(74,222,128,.2)", borderRadius: 7, fontSize: 11, color: "#4ade80" }}>
                  ✓ Accionable registrado
                </div>
              )}
            </div>

            {/* Navigation */}
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <Btn v="ghost" onClick={() => setDiscussIdx(i => Math.max(0, i - 1))} disabled={discussIdx === 0}>← Anterior</Btn>
              <div style={{ flex: 1 }} />
              {discussIdx < sortedCards.length - 1
                ? <Btn onClick={() => setDiscussIdx(i => i + 1)}>Siguiente →</Btn>
                : <Btn v="success" onClick={onFinish}>🏁 Ver resumen</Btn>
              }
            </div>
          </div>

          {/* Sidebar: all cards */}
          <div>
            <div style={{ fontSize: 11, color: "#334155", marginBottom: 8, fontWeight: 600 }}>Todas las tarjetas</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 5, maxHeight: 540, overflowY: "auto" }}>
              {sortedCards.map((c, i) => {
                const cc   = CATS.find(x => x.id === c.category);
                const isAct = i === discussIdx;
                return (
                  <button
                    key={c.id}
                    onClick={() => setDiscussIdx(i)}
                    style={{ background: isAct ? "rgba(99,102,241,.13)" : "rgba(255,255,255,.02)", border: `1px solid ${isAct ? "rgba(99,102,241,.4)" : "rgba(255,255,255,.05)"}`, borderRadius: 8, padding: "7px 9px", cursor: "pointer", textAlign: "left", display: "flex", gap: 6, alignItems: "flex-start", transition: "all .1s", fontFamily: "inherit" }}
                  >
                    <span style={{ fontSize: 11, flexShrink: 0 }}>{cc.emoji}</span>
                    <span style={{ fontSize: 11, color: isAct ? "#e2e8f0" : "#475569", flex: 1, lineHeight: 1.35 }}>
                      {c.text.slice(0, 44)}{c.text.length > 44 ? "…" : ""}
                    </span>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2, flexShrink: 0 }}>
                      <span style={{ fontSize: 10, color: "#818cf8" }}>🗳 {c.votes}</span>
                      {c.actionable && <span style={{ fontSize: 10, color: "#4ade80" }}>✓</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
