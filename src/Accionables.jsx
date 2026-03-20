import { useState } from "react";
import { DEMO_HISTORY, DEMO_TEAMS } from "./constants";
import { Btn, dateStr } from "./ui";
import { useT } from "./i18n";

const COLS = [
  { id:"todo",      label:"colTodo",      color:"#64748b", bg:"rgba(100,116,139,.1)" },
  { id:"inprogress",label:"colInProgress",color:"#818cf8", bg:"rgba(129,140,248,.12)" },
  { id:"done",      label:"colDone",      color:"#4ade80", bg:"rgba(74,222,128,.1)"  },
  { id:"cancelled", label:"colCancelled", color:"#f87171", bg:"rgba(248,113,113,.1)" },
];

const TRANSITIONS = {
  todo:       ["inprogress","done","cancelled"],
  inprogress: ["done","cancelled","todo"],
  done:       ["todo","inprogress"],
  cancelled:  ["todo"],
};

function ActionCard({ item, onMove, t }) {
  const team = DEMO_TEAMS.find(te => te.id === item.teamId);
  const col  = COLS.find(c => c.id === item.status);

  return (
    <div style={{ background:"var(--surf)", border:"1px solid var(--border)", borderLeft:`3px solid ${col.color}`, borderRadius:10, padding:"11px 13px", marginBottom:8, animation:"fadeIn .2s ease" }}>
      <p style={{ fontSize:13, color:"var(--tx)", lineHeight:1.45, margin:"0 0 6px", fontWeight:500 }}>{item.text}</p>
      <div style={{ fontSize:11, color:"var(--tx3)", marginBottom:8 }}>
        {item.retroName} · {team && <span style={{ color:team.color }}>{team.name}</span>}
      </div>
      <div style={{ display:"flex", gap:6, flexWrap:"wrap", alignItems:"center" }}>
        {item.assignee && <span style={{ fontSize:11, color:"var(--tx3)" }}>👤 {item.assignee}</span>}
        {item.due      && <span style={{ fontSize:11, color:"var(--tx3)" }}>📅 {item.due}</span>}
        <div style={{ marginLeft:"auto", display:"flex", gap:4 }}>
          {TRANSITIONS[item.status]?.map(next => {
            const nc = COLS.find(c => c.id === next);
            return (
              <button key={next} onClick={() => onMove(item.id, next)}
                title={t[nc.label]}
                style={{ fontSize:10, padding:"2px 8px", borderRadius:20, border:`1px solid ${nc.color}40`, background:nc.bg, color:nc.color, cursor:"pointer", fontFamily:"inherit", fontWeight:600 }}>
                → {t[nc.label]}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function Accionables({ user, actionableStatuses, setActionableStatuses, history: historyProp, lang }) {
  const t = useT(lang);
  const allHistory = historyProp || DEMO_HISTORY;
  const myHistory  = allHistory.filter(r => user.role === "admin" || r.teamId === user.teamId);

  // Build flat list of all actionables with IDs
  const allItems = myHistory.flatMap(r =>
    r.actionables.map((a, i) => ({
      id:       `${r.id}-${i}`,
      text:     a.text,
      assignee: a.assignee,
      due:      a.due,
      retroName:r.name,
      teamId:   r.teamId,
      status:   actionableStatuses[`${r.id}-${i}`] || (a.status === "done" ? "done" : "todo"),
    }))
  );

  const move = (id, newStatus) => {
    setActionableStatuses(p => ({ ...p, [id]: newStatus }));
  };

  const byCol = (colId) => allItems.filter(x => x.status === colId);

  return (
    <div style={{ padding:"20px", height:"100%", display:"flex", flexDirection:"column", overflow:"hidden" }}>
      <h2 style={{ fontFamily:"'Sora',sans-serif", fontSize:17, color:"var(--tx)", marginBottom:20 }}>{t.kanbanTitle}</h2>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(220px,1fr))", gap:14, flex:1, overflowY:"auto", alignItems:"start" }}>
        {COLS.map(col => {
          const items = byCol(col.id);
          return (
            <div key={col.id} style={{ background:"var(--surf2)", border:`1px solid ${col.color}20`, borderTop:`3px solid ${col.color}`, borderRadius:12, padding:"12px 10px", minHeight:200 }}>
              <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:12 }}>
                <span style={{ fontSize:12, fontWeight:700, color:col.color }}>{t[col.label]}</span>
                <span style={{ marginLeft:"auto", background:col.bg, color:col.color, borderRadius:20, padding:"1px 8px", fontSize:11, fontWeight:700 }}>{items.length}</span>
              </div>
              {items.length === 0
                ? <p style={{ fontSize:12, color:"var(--dim)", textAlign:"center", padding:"20px 0" }}>{t.noActionables}</p>
                : items.map(item => <ActionCard key={item.id} item={item} onMove={move} t={t} />)
              }
            </div>
          );
        })}
      </div>
    </div>
  );
}
