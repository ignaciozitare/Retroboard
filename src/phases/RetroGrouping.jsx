import { useState, useRef } from "react";
import { CATS } from "../constants";
import { TimerBar } from "../ui";

export function RetroGrouping({
  isMod, cards, setCards,
  timer, setTimer, running, setRunning, phaseMins, setPhaseMins,
  onFinish,
}) {
  const [dragId, setDragId]     = useState(null);
  const [overCol, setOverCol]   = useState(null);
  const [expanded, setExpanded] = useState({});
  const dRef     = useRef(null);
  const merged   = useRef(false); // flag: drop was handled by stack button

  const moveToCol = (id, nc) => setCards(p => p.map(c => c.id === id ? { ...c, category: nc } : c));

  const mergeInto = (sId, tId) => {
    if (sId === tId) return;
    setCards(prev => {
      const s = prev.find(c => c.id === sId); if (!s) return prev;
      return prev.filter(c => c.id !== sId).map(c => c.id === tId ? { ...c, merged: [...c.merged, { ...s }] } : c);
    });
  };

  const unmerge = (pId, cId) => {
    setCards(prev => {
      const par = prev.find(c => c.id === pId); if (!par) return prev;
      const ch  = par.merged.find(c => c.id === cId); if (!ch) return prev;
      return [...prev.filter(c => c.id !== pId), { ...par, merged: par.merged.filter(c => c.id !== cId) }, { ...ch, category: par.category }];
    });
  };

  const mergedCount = cards.reduce((a, c) => a + c.merged.length, 0);

  return (
    <div>
      <TimerBar
        timer={timer} setTimer={setTimer} running={running} setRunning={setRunning}
        isMod={isMod} phaseMins={phaseMins} setPhaseMins={setPhaseMins}
        onNext={onFinish} nextLabel="→ Votación"
        extraContent={
          <span style={{ fontSize: 11, color: "#334155" }}>
            {cards.length} tarjetas · {mergedCount} apiladas — arrastra a columna para mover · botón 📎 para apilar
          </span>
        }
      />

      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "16px 18px 50px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12, alignItems: "start" }}>
          {CATS.map(cat => {
            const col  = cards.filter(c => c.category === cat.id);
            const isO  = overCol === cat.id;

            return (
              <div
                key={cat.id}
                onDragOver={e => { e.preventDefault(); setOverCol(cat.id); }}
                onDrop={e => {
                  e.preventDefault();
                  if (merged.current) { merged.current = false; return; }
                  if (dRef.current) moveToCol(dRef.current, cat.id);
                  setOverCol(null); setDragId(null); dRef.current = null;
                }}
                style={{
                  background: isO ? cat.dim : "rgba(255,255,255,.015)",
                  border: `1px solid ${isO ? cat.color : "rgba(255,255,255,.07)"}`,
                  borderTop: `3px solid ${cat.color}`,
                  borderRadius: 11, padding: "11px 9px", minHeight: 240,
                  transition: "all .14s", position: "relative",
                }}
              >
                {/* Column header */}
                <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 10 }}>
                  <span style={{ fontSize: 13 }}>{cat.emoji}</span>
                  <span style={{ fontFamily: "'Sora',sans-serif", fontSize: 12, fontWeight: 700, color: cat.color }}>{cat.label}</span>
                  <div style={{ marginLeft: "auto", background: cat.dim, color: cat.color, borderRadius: 20, padding: "1px 7px", fontSize: 11, fontWeight: 700 }}>{col.length}</div>
                </div>

                {/* Insert line */}
                {isO && <div style={{ position: "absolute", top: 42, left: 8, right: 8, height: 3, borderRadius: 2, background: "rgba(99,102,241,.7)", boxShadow: "0 0 8px rgba(99,102,241,.5)", pointerEvents: "none" }} />}

                {/* Cards */}
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {col.length === 0
                    ? <div style={{ border: `2px dashed ${isO ? "rgba(99,102,241,.5)" : cat.border}`, borderRadius: 8, padding: "16px 6px", textAlign: "center", fontSize: 11, color: isO ? "#818cf8" : "#1e2535", transition: "all .15s" }}>
                        {isO ? "⬇ Soltar" : "Arrastra aquí"}
                      </div>
                    : col.map(card => {
                        const isDg   = dragId === card.id;
                        const canSt  = !!dragId && dragId !== card.id;
                        const isExp  = expanded[card.id];
                        return (
                          <div key={card.id}>
                            <div
                              draggable
                              onDragStart={e => { dRef.current = card.id; merged.current = false; setDragId(card.id); e.dataTransfer.effectAllowed = "move"; }}
                              onDragEnd={() => { setDragId(null); setOverCol(null); dRef.current = null; merged.current = false; }}
                              style={{ background: "#161923", border: `1px solid ${cat.border}`, borderRadius: 9, padding: "9px 10px", cursor: isDg ? "grabbing" : "grab", opacity: isDg ? 0.25 : 1, transition: "opacity .1s", userSelect: "none" }}
                            >
                              <p style={{ fontSize: 12, color: "#e2e8f0", lineHeight: 1.4, margin: "0 0 7px" }}>{card.text}</p>
                              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                                <span style={{ fontSize: 11, color: "#334155", flex: 1 }}>{card.author}</span>

                                {/* Stack drop zone — only while dragging another card */}
                                {canSt && (
                                  <div
                                    onDragOver={e => { e.preventDefault(); e.stopPropagation(); }}
                                    onDrop={e => { e.preventDefault(); e.stopPropagation(); merged.current = true; if (dRef.current) mergeInto(dRef.current, card.id); setOverCol(null); setDragId(null); dRef.current = null; }}
                                    style={{ display: "flex", alignItems: "center", gap: 3, background: "rgba(99,102,241,.18)", border: "2px solid rgba(99,102,241,.6)", borderRadius: 20, padding: "2px 8px", fontSize: 11, color: "#818cf8", fontWeight: 600, cursor: "copy", animation: "pulse 1s ease-in-out infinite alternate" }}
                                  >
                                    📎 Apilar
                                  </div>
                                )}

                                {/* Expand button when not dragging */}
                                {!canSt && card.merged.length > 0 && (
                                  <button
                                    onClick={() => setExpanded(p => ({ ...p, [card.id]: !p[card.id] }))}
                                    style={{ background: "rgba(99,102,241,.14)", border: "1px solid rgba(99,102,241,.3)", borderRadius: 20, padding: "2px 7px", fontSize: 11, color: "#818cf8", cursor: "pointer", fontFamily: "inherit" }}
                                  >
                                    📎 {card.merged.length} {isExp ? "▴" : "▾"}
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Sub-cards */}
                            {card.merged.length > 0 && isExp && !canSt && (
                              <div style={{ marginLeft: 8, marginTop: 3, display: "flex", flexDirection: "column", gap: 4 }}>
                                {card.merged.map(sub => (
                                  <div key={sub.id} style={{ background: "rgba(99,102,241,.07)", border: "1px solid rgba(99,102,241,.2)", borderRadius: 7, padding: "6px 9px", display: "flex", gap: 6, alignItems: "flex-start" }}>
                                    <p style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.4, flex: 1, margin: 0 }}>{sub.text}</p>
                                    <button onClick={() => unmerge(card.id, sub.id)} style={{ background: "none", border: "none", color: "#475569", cursor: "pointer", fontSize: 11, fontFamily: "inherit" }}>⤴</button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })
                  }
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
