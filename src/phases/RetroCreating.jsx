import { useState } from "react";
import { CATS } from "../constants";
import { TimerBar, Avatar, Btn } from "../ui";

const DEMO_PARTICIPANTS = [
  { id:"u2", name:"Ana G.",   initials:"AG", color:"#f472b6" },
  { id:"u3", name:"Carlos L.",initials:"CL", color:"#60a5fa" },
  { id:"u4", name:"Marta R.", initials:"MR", color:"#34d399" },
];

export function RetroCreating({
  isMod, myCards, setMyCards,
  timer, setTimer, running, setRunning, phaseMins, setPhaseMins,
  onFinish,
}) {
  const [text, setText] = useState("");
  const [cat, setCat]   = useState("good");

  const add = () => {
    if (!text.trim()) return;
    setMyCards(p => [...p, {
      id: `me-${Date.now()}`, text: text.trim(), category: cat,
      author: "Yo", votes: 0, actionable: "", assignee: "", dueDate: "", merged: [],
    }]);
    setText("");
  };

  return (
    <div>
      <TimerBar
        timer={timer} setTimer={setTimer} running={running} setRunning={setRunning}
        isMod={isMod} phaseMins={phaseMins} setPhaseMins={setPhaseMins}
        onNext={onFinish} nextLabel="→ Organizar"
        extraContent={<span style={{ fontSize: 11, color: "#334155" }}>Las tarjetas son privadas hasta que el moderador cierre la fase</span>}
      />

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "16px 18px 50px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>

          {/* Input panel */}
          <div>
            <div style={{ background: "#161923", border: "1px solid rgba(255,255,255,.08)", borderRadius: 12, padding: "16px 20px", marginBottom: 12 }}>
              <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: 13, color: "#e2e8f0", margin: "0 0 11px" }}>Nueva tarjeta</h3>

              {/* Category selector */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 10 }}>
                {CATS.map(c => (
                  <button key={c.id} onClick={() => setCat(c.id)} style={{
                    padding: "7px 10px", borderRadius: 7,
                    border: `1px solid ${cat === c.id ? c.color : "rgba(255,255,255,.07)"}`,
                    background: cat === c.id ? c.dim : "transparent",
                    color: cat === c.id ? c.color : "#475569",
                    cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", gap: 4,
                    transition: "all .14s", fontFamily: "inherit",
                  }}>
                    {c.emoji} {c.label}
                  </button>
                ))}
              </div>

              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); add(); } }}
                placeholder="Escribe tu observación… (Enter para añadir)"
                rows={3}
                style={{ width: "100%", background: "#0c0e14", border: "1px solid rgba(255,255,255,.12)", borderRadius: 8, padding: "9px 11px", color: "#e2e8f0", fontSize: 13, resize: "none", fontFamily: "inherit", outline: "none" }}
              />
              <Btn full onClick={add} sx={{ marginTop: 8 }}>+ Añadir tarjeta</Btn>
            </div>

            {/* Category counts */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))", gap: 7 }}>
              {CATS.map(c => {
                const n = myCards.filter(x => x.category === c.id).length;
                return (
                  <div key={c.id} style={{ background: "#161923", border: `1px solid ${c.border}`, borderRadius: 8, padding: "8px", textAlign: "center" }}>
                    <div style={{ fontSize: 13 }}>{c.emoji}</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: c.color, fontFamily: "'Sora',sans-serif" }}>{n}</div>
                    <div style={{ fontSize: 10, color: "#334155", lineHeight: 1.3 }}>{c.label}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* My cards + team status */}
          <div>
            <div style={{ fontSize: 11, color: "#475569", marginBottom: 7, fontWeight: 600 }}>
              Mis tarjetas ({myCards.length})
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 320, overflowY: "auto" }}>
              {myCards.length === 0
                ? <p style={{ color: "#1e2535", fontSize: 12, textAlign: "center", padding: "26px 0" }}>Aún no has añadido ninguna</p>
                : myCards.map(card => {
                    const cc = CATS.find(c => c.id === card.category);
                    return (
                      <div key={card.id} style={{ background: "#161923", border: `1px solid ${cc.border}`, borderLeft: `3px solid ${cc.color}`, borderRadius: 8, padding: "8px 10px", display: "flex", gap: 7 }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 10, color: cc.color, marginBottom: 2 }}>{cc.emoji} {cc.label}</div>
                          <p style={{ fontSize: 12, color: "#cbd5e1", margin: 0, lineHeight: 1.4 }}>{card.text}</p>
                        </div>
                        <button onClick={() => setMyCards(p => p.filter(x => x.id !== card.id))} style={{ background: "none", border: "none", color: "#334155", cursor: "pointer", fontSize: 12, fontFamily: "inherit" }}>✕</button>
                      </div>
                    );
                  })}
            </div>

            {/* Team status */}
            <div style={{ marginTop: 12, background: "#161923", border: "1px solid rgba(255,255,255,.05)", borderRadius: 9, padding: "10px 12px" }}>
              <p style={{ fontSize: 11, color: "#334155", marginBottom: 7 }}>Estado del equipo</p>
              {DEMO_PARTICIPANTS.map(p => (
                <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
                  <Avatar initials={p.initials} color={p.color} size={20} />
                  <span style={{ fontSize: 11, color: "#475569", flex: 1 }}>{p.name}</span>
                  <span style={{ fontSize: 10, color: "#4ade80" }}>✎</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
