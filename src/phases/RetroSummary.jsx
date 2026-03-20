import { useState } from "react";
import { CATS } from "../constants";
import { Btn } from "../ui";

export function CopyActionsBar({ sortedCards }) {
  const [copied, setCopied] = useState(false);
  const withAct = sortedCards.filter(c => c.actionable);
  const copyText = withAct.map(c =>
    `• ${c.actionable}\n  Responsable: ${c.assignee || "Sin asignar"}  Fecha: ${c.dueDate || "—"}`
  ).join("\n\n");
  const doCopy = () => {
    navigator.clipboard?.writeText(copyText).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
      <Btn v={copied ? "success" : "ghost"} full onClick={doCopy}>
        {copied ? "✓ Copiado" : "📋 Copiar accionables"}
      </Btn>
      <Btn v="ghost" full onClick={() => window.print()}>📄 Imprimir / PDF</Btn>
    </div>
  );
}

export function RetroSummary({ sortedCards, retroName, onExit }) {
  const withAct = sortedCards.filter(c => c.actionable);
  const without = sortedCards.filter(c => !c.actionable);

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "24px 18px 60px" }}>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{ fontSize: 36, marginBottom: 8 }}>🏁</div>
        <p style={{ fontSize: 11, color: "#4ade80", fontWeight: 600, marginBottom: 4 }}>RETROSPECTIVA COMPLETADA</p>
        <h2 style={{ fontFamily: "'Sora',sans-serif", fontSize: 20, color: "#e2e8f0", margin: 0 }}>
          {retroName || "Retrospectiva"}
        </h2>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 10, marginBottom: 22 }}>
        {[
          { l: "Tarjetas",      v: sortedCards.length,                              c: "#818cf8" },
          { l: "Con accionable",v: withAct.length,                                  c: "#4ade80" },
          { l: "Sin accionable",v: without.length,                                  c: "#f87171" },
          { l: "Votos totales", v: sortedCards.reduce((a, c) => a + c.votes, 0),    c: "#fbbf24" },
        ].map(s => (
          <div key={s.l} style={{ background: "#161923", border: "1px solid rgba(255,255,255,.07)", borderRadius: 11, padding: "11px", textAlign: "center" }}>
            <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "'Sora',sans-serif", color: s.c }}>{s.v}</div>
            <div style={{ fontSize: 10, color: "#334155", marginTop: 2 }}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* Actionables */}
      <div style={{ background: "#161923", border: "1px solid rgba(255,255,255,.08)", borderRadius: 13, overflow: "hidden", marginBottom: 14 }}>
        <div style={{ padding: "12px 20px", borderBottom: "1px solid rgba(255,255,255,.07)", display: "flex", alignItems: "center", gap: 8 }}>
          <h3 style={{ fontFamily: "'Sora',sans-serif", fontSize: 13, color: "#e2e8f0", margin: 0 }}>🎯 Accionables</h3>
          <span style={{ background: "rgba(74,222,128,.1)", color: "#4ade80", borderRadius: 20, padding: "2px 8px", fontSize: 11, fontWeight: 700 }}>{withAct.length}</span>
        </div>
        {withAct.length === 0
          ? <p style={{ padding: 18, color: "#1e2535", textAlign: "center", fontSize: 13 }}>No se definieron accionables</p>
          : withAct.map((card, i) => {
              const cat = CATS.find(c => c.id === card.category);
              return (
                <div key={card.id} style={{ padding: "12px 20px", borderBottom: i < withAct.length - 1 ? "1px solid rgba(255,255,255,.05)" : "none", display: "flex", gap: 11 }}>
                  <div style={{ width: 3, borderRadius: 2, background: cat.color, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 11, color: "#334155", margin: "0 0 3px" }}>{cat.emoji} {card.text}</p>
                    <p style={{ fontSize: 13, color: "#e2e8f0", margin: "0 0 6px", fontWeight: 600 }}>→ {card.actionable}</p>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {card.assignee && <span style={{ background: "rgba(255,255,255,.05)", color: "#64748b", borderRadius: 20, padding: "2px 8px", fontSize: 11 }}>👤 {card.assignee}</span>}
                      {card.dueDate  && <span style={{ background: "rgba(255,255,255,.05)", color: "#64748b", borderRadius: 20, padding: "2px 8px", fontSize: 11 }}>📅 {card.dueDate}</span>}
                      <span style={{ background: "rgba(129,140,248,.1)", color: "#818cf8", borderRadius: 20, padding: "2px 8px", fontSize: 11 }}>🗳 {card.votes}</span>
                    </div>
                  </div>
                </div>
              );
            })
        }
      </div>

      {/* Cards without actionable */}
      {without.length > 0 && (
        <div style={{ background: "#161923", border: "1px solid rgba(255,255,255,.06)", borderRadius: 11, overflow: "hidden", marginBottom: 20 }}>
          <div style={{ padding: "9px 18px", borderBottom: "1px solid rgba(255,255,255,.05)" }}>
            <span style={{ fontFamily: "'Sora',sans-serif", fontSize: 11, color: "#334155" }}>Sin accionable ({without.length})</span>
          </div>
          {without.map((c, i) => {
            const cat = CATS.find(x => x.id === c.category);
            return (
              <div key={c.id} style={{ padding: "8px 18px", borderBottom: i < without.length - 1 ? "1px solid rgba(255,255,255,.04)" : "none", display: "flex", gap: 8, alignItems: "center" }}>
                <span>{cat.emoji}</span>
                <p style={{ fontSize: 11, color: "#334155", margin: 0, flex: 1 }}>{c.text}</p>
                <span style={{ fontSize: 10, color: "#1e2535" }}>🗳 {c.votes}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Actions */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <Btn v="ghost" full>📋 Copiar accionables</Btn>
        <Btn v="ghost" full>📄 Exportar PDF</Btn>

      </div>

      <div style={{ textAlign: "center" }}>
        <Btn v="ghost" onClick={onExit}>← Volver al dashboard</Btn>
      </div>
    </div>
  );
}
