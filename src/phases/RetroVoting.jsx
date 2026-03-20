import { CATS } from "../constants";
import { TimerBar } from "../ui";

export function RetroVoting({
  isMod, allCards, myVotes, onVote, onRemoveVote, votesPerUser,
  timer, setTimer, running, setRunning, phaseMins, setPhaseMins,
  onFinish,
}) {
  const used = Object.values(myVotes).reduce((a, b) => a + b, 0);
  const rem  = votesPerUser - used;

  const VoteDots = ({ total, myCount }) => (
    <div style={{ display: "flex", gap: 3 }}>
      {total === 0
        ? <span style={{ fontSize: 11, color: "#1e2535" }}>sin votos</span>
        : Array.from({ length: Math.min(total, 12) }).map((_, i) => (
            <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: i < myCount ? "#6366f1" : "rgba(255,255,255,.15)" }} />
          ))
      }
    </div>
  );

  return (
    <div>
      <TimerBar
        timer={timer} setTimer={setTimer} running={running} setRunning={setRunning}
        isMod={isMod} phaseMins={phaseMins} setPhaseMins={setPhaseMins}
        onNext={onFinish} nextLabel="Cerrar →"
        extraContent={
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <span style={{ fontSize: 11, color: "#475569" }}>Votos restantes:</span>
            <div style={{ display: "flex", gap: 3 }}>
              {Array.from({ length: votesPerUser }).map((_, i) => (
                <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: i < rem ? "#6366f1" : "rgba(255,255,255,.1)", transition: "background .2s" }} />
              ))}
            </div>
            <span style={{ fontSize: 11, color: "#334155" }}>{rem} de {votesPerUser}</span>
          </div>
        }
      />

      <div style={{ maxWidth: 1060, margin: "0 auto", padding: "16px 18px 50px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {CATS.map(cat => {
            const catCards = allCards.filter(c => c.category === cat.id);
            return (
              <div key={cat.id}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 9 }}>
                  <span style={{ fontSize: 14 }}>{cat.emoji}</span>
                  <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: 12, color: cat.color, margin: 0 }}>{cat.label}</h3>
                  <span style={{ background: cat.dim, color: cat.color, borderRadius: 20, padding: "1px 7px", fontSize: 11, fontWeight: 700, marginLeft: 3 }}>{catCards.length}</span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {catCards.map(card => {
                    const mv = myVotes[card.id] || 0;
                    return (
                      <div key={card.id} style={{ background: "#161923", border: `1px solid ${cat.border}`, borderLeft: `3px solid ${cat.color}`, borderRadius: 9, padding: "10px 11px" }}>
                        <p style={{ fontSize: 12, color: "#e2e8f0", lineHeight: 1.45, margin: "0 0 5px" }}>{card.text}</p>
                        {card.merged?.length > 0 && (
                          <p style={{ fontSize: 11, color: "#475569", margin: "0 0 5px" }}>📎 +{card.merged.length} apilada{card.merged.length > 1 ? "s" : ""}</p>
                        )}
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ fontSize: 11, color: "#334155", flex: 1 }}>{card.author}</span>
                          <button
                            onClick={() => onRemoveVote(card.id)} disabled={mv <= 0}
                            style={{ width: 20, height: 20, borderRadius: "50%", border: "1px solid rgba(255,255,255,.1)", background: "transparent", color: mv > 0 ? "#94a3b8" : "#1e2535", cursor: mv > 0 ? "pointer" : "not-allowed", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit" }}
                          >−</button>
                          <VoteDots total={card.votes} myCount={mv} />
                          <button
                            onClick={() => onVote(card.id)} disabled={rem <= 0}
                            style={{ width: 20, height: 20, borderRadius: "50%", border: `1px solid rgba(99,102,241,${rem > 0 ? 0.5 : 0.1})`, background: rem > 0 ? "rgba(99,102,241,.2)" : "transparent", color: rem > 0 ? "#818cf8" : "#1e2535", cursor: rem > 0 ? "pointer" : "not-allowed", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit" }}
                          >+</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
