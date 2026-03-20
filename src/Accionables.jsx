import { useState, useRef, useCallback } from "react";
import { DEMO_HISTORY, DEMO_TEAMS, DEMO_USERS, PRIORITIES, PRIORITY_MAP } from "./constants";
import { Btn, Avatar, dateStr } from "./ui";
import { Modal } from "./Modal";
import { useT } from "./i18n";

// ─── KANBAN CONFIG ────────────────────────────────────────────────────────────
const COLS = [
  { id:"todo",       labelKey:"colTodo",       color:"#64748b", bg:"rgba(100,116,139,.08)" },
  { id:"inprogress", labelKey:"colInProgress",  color:"#818cf8", bg:"rgba(129,140,248,.1)"  },
  { id:"done",       labelKey:"colDone",        color:"#4ade80", bg:"rgba(74,222,128,.08)"  },
  { id:"cancelled",  labelKey:"colCancelled",   color:"#f87171", bg:"rgba(248,113,113,.08)" },
];

const NEXT_STATUS = {
  todo:       ["inprogress","done","cancelled"],
  inprogress: ["done","cancelled","todo"],
  done:       ["todo","inprogress"],
  cancelled:  ["todo"],
};

// ─── PRIORITY BADGE ───────────────────────────────────────────────────────────
function PriorityBadge({ priority }) {
  const p = PRIORITY_MAP[priority] || PRIORITY_MAP.medium;
  return (
    <span style={{ fontSize:10, padding:"1px 7px", borderRadius:20, fontWeight:700,
      background:p.bg, color:p.color, whiteSpace:"nowrap" }}>
      {p.label}
    </span>
  );
}

// ─── CARD DETAIL MODAL ────────────────────────────────────────────────────────
function CardDetailModal({ item, onClose, onUpdate, allUsers, teams }) {
  const [data, setData] = useState({ ...item });
  const upd = (k, v) => setData(d => ({ ...d, [k]: v }));

  const inp = (label, key, type="text") => (
    <div style={{ marginBottom:14 }}>
      <label style={{ display:"block", fontSize:11, color:"var(--tx3)", marginBottom:5, fontWeight:600 }}>{label}</label>
      <input type={type} value={data[key]||""} onChange={e => upd(key, e.target.value)}
        style={{ width:"100%", background:"var(--bg)", border:"1px solid var(--border2)",
          borderRadius:7, padding:"8px 11px", color:"var(--tx)", fontSize:13, outline:"none", fontFamily:"inherit" }} />
    </div>
  );

  return (
    <Modal title="Editar Accionable" onClose={onClose} width={540}>
      {/* Title / description */}
      <div style={{ marginBottom:14 }}>
        <label style={{ display:"block", fontSize:11, color:"var(--tx3)", marginBottom:5, fontWeight:600 }}>Accionable</label>
        <textarea value={data.text||""} onChange={e => upd("text", e.target.value)} rows={3}
          style={{ width:"100%", background:"var(--bg)", border:"1px solid var(--border2)",
            borderRadius:7, padding:"8px 11px", color:"var(--tx)", fontSize:13, resize:"none", outline:"none", fontFamily:"inherit" }} />
      </div>

      {/* Status */}
      <div style={{ marginBottom:14 }}>
        <label style={{ display:"block", fontSize:11, color:"var(--tx3)", marginBottom:5, fontWeight:600 }}>Estado</label>
        <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
          {COLS.map(col => (
            <button key={col.id} onClick={() => upd("status", col.id)}
              style={{ padding:"4px 12px", borderRadius:20, border:`1px solid ${col.color}40`,
                background: data.status===col.id ? col.bg : "transparent",
                color: col.color, cursor:"pointer", fontSize:12, fontWeight:600, fontFamily:"inherit",
                outline: data.status===col.id ? `2px solid ${col.color}` : "none" }}>
              {col.id === "todo" ? "Por hacer" : col.id === "inprogress" ? "En progreso" : col.id === "done" ? "Hecho" : "Cancelado"}
            </button>
          ))}
        </div>
      </div>

      {/* Priority */}
      <div style={{ marginBottom:14 }}>
        <label style={{ display:"block", fontSize:11, color:"var(--tx3)", marginBottom:5, fontWeight:600 }}>Prioridad</label>
        <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
          {PRIORITIES.map(p => (
            <button key={p.id} onClick={() => upd("priority", p.id)}
              style={{ padding:"4px 12px", borderRadius:20, border:`1px solid ${p.color}40`,
                background: data.priority===p.id ? p.bg : "transparent",
                color: p.color, cursor:"pointer", fontSize:12, fontWeight:700, fontFamily:"inherit",
                outline: data.priority===p.id ? `2px solid ${p.color}` : "none" }}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Assignee + Due date */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:14 }}>
        <div>
          <label style={{ display:"block", fontSize:11, color:"var(--tx3)", marginBottom:5, fontWeight:600 }}>Responsable</label>
          <select value={data.assignee||""} onChange={e => upd("assignee", e.target.value)}
            style={{ width:"100%", background:"var(--bg)", border:"1px solid var(--border2)",
              borderRadius:7, padding:"8px 10px", color:"var(--tx)", fontSize:12, fontFamily:"inherit" }}>
            <option value="">Sin asignar</option>
            {allUsers.map(u => <option key={u.id} value={u.name}>{u.name}</option>)}
          </select>
        </div>
        <div>
          <label style={{ display:"block", fontSize:11, color:"var(--tx3)", marginBottom:5, fontWeight:600 }}>Fecha límite</label>
          <input type="date" value={data.due||data.dueDate||""} onChange={e => upd("due", e.target.value)}
            style={{ width:"100%", background:"var(--bg)", border:"1px solid var(--border2)",
              borderRadius:7, padding:"8px 10px", color:"var(--tx)", fontSize:12, fontFamily:"inherit" }} />
        </div>
      </div>

      {/* Meta info */}
      <div style={{ padding:"10px 12px", background:"var(--surf2)", borderRadius:8, marginBottom:16, fontSize:12, color:"var(--tx3)" }}>
        <span>📋 {data.retroName}</span>
        {data.teamName && <span style={{ marginLeft:12 }}>🏷️ {data.teamName}</span>}
      </div>

      <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}>
        <Btn v="ghost" onClick={onClose}>Cancelar</Btn>
        <Btn onClick={() => { onUpdate(data); onClose(); }}>Guardar cambios</Btn>
      </div>
    </Modal>
  );
}

// ─── SINGLE KANBAN CARD ───────────────────────────────────────────────────────
function KanbanCard({ item, onMove, onUpdate, allUsers, teams, isDragging, dragHandleProps }) {
  const [showDetail, setShowDetail] = useState(false);
  const col = COLS.find(c => c.id === item.status) || COLS[0];

  return (
    <>
      {showDetail && (
        <CardDetailModal
          item={item} onClose={() => setShowDetail(false)}
          onUpdate={onUpdate} allUsers={allUsers} teams={teams}
        />
      )}
      <div
        {...dragHandleProps}
        style={{
          background:"var(--surf)", border:`1px solid var(--border)`,
          borderLeft:`3px solid ${col.color}`, borderRadius:10,
          padding:"10px 12px", marginBottom:6, cursor:"grab",
          opacity: isDragging ? 0.35 : 1, userSelect:"none",
          transition:"opacity .1s, box-shadow .15s",
          boxShadow: isDragging ? "none" : "0 1px 4px rgba(0,0,0,.15)",
        }}
      >
        {/* Click zone for detail modal (not the whole card — just the text) */}
        <p
          onClick={() => setShowDetail(true)}
          style={{ fontSize:12, color:"var(--tx)", lineHeight:1.45, margin:"0 0 7px",
            fontWeight:500, cursor:"pointer" }}
          title="Clic para editar"
        >
          {item.text}
        </p>

        <div style={{ display:"flex", alignItems:"center", gap:5, flexWrap:"wrap", marginBottom:6 }}>
          <PriorityBadge priority={item.priority} />
          {item.teamName && (
            <span style={{ fontSize:10, color:"var(--tx3)", background:"var(--surf2)", borderRadius:20, padding:"1px 7px" }}>
              {item.teamName}
            </span>
          )}
        </div>

        <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:11, color:"var(--tx3)" }}>
          {item.assignee && <span>👤 {item.assignee}</span>}
          {(item.due||item.dueDate) && <span>📅 {item.due||item.dueDate}</span>}
          <div style={{ marginLeft:"auto", display:"flex", gap:4 }}>
            {NEXT_STATUS[item.status]?.map(next => {
              const nc = COLS.find(c => c.id === next);
              return (
                <button key={next} onClick={e => { e.stopPropagation(); onMove(item.id, next); }}
                  title={next}
                  style={{ width:20, height:20, borderRadius:"50%", border:`1px solid ${nc.color}60`,
                    background:nc.bg, color:nc.color, cursor:"pointer", fontSize:10, fontFamily:"inherit",
                    display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700 }}>
                  {next==="done"?"✓":next==="cancelled"?"✕":next==="inprogress"?"▶":"↩"}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

// ─── KANBAN COLUMN WITH DND ───────────────────────────────────────────────────
function KanbanColumn({ col, items, onMove, onUpdate, onDrop, allUsers, teams, draggingId, setDraggingId, onDragOver }) {
  const [overIdx, setOverIdx] = useState(null);

  const handleDragStart = (e, itemId) => {
    setDraggingId(itemId);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", itemId);
  };

  const handleDragOver = (e, idx) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setOverIdx(idx);
    onDragOver(col.id);
  };

  const handleDrop = (e, dropIdx) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    onDrop(id, col.id, dropIdx);
    setOverIdx(null);
  };

  const handleDragLeave = () => setOverIdx(null);
  const handleDragEnd = () => { setDraggingId(null); setOverIdx(null); };

  return (
    <div
      onDragOver={e => handleDragOver(e, items.length)}
      onDrop={e => handleDrop(e, items.length)}
      onDragLeave={handleDragLeave}
      style={{ background:"var(--surf2)", border:`1px solid ${col.color}20`,
        borderTop:`3px solid ${col.color}`, borderRadius:12,
        padding:"12px 10px", minHeight:200, display:"flex", flexDirection:"column" }}>

      {/* Column header */}
      <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:12 }}>
        <span style={{ fontSize:12, fontWeight:700, color:col.color }}>{col.label}</span>
        <span style={{ marginLeft:"auto", background:col.bg, color:col.color,
          borderRadius:20, padding:"1px 8px", fontSize:11, fontWeight:700 }}>{items.length}</span>
      </div>

      {/* Cards */}
      <div style={{ flex:1 }}>
        {items.length === 0 && (
          <div style={{ border:`2px dashed ${col.color}30`, borderRadius:8,
            padding:"20px 8px", textAlign:"center", fontSize:12, color:"var(--dim)" }}>
            Sin tareas
          </div>
        )}
        {items.map((item, idx) => (
          <div key={item.id}>
            {/* Drop indicator above card */}
            {overIdx === idx && draggingId && draggingId !== item.id && (
              <div style={{ height:3, borderRadius:2, background:"#6366f1",
                margin:"0 0 4px", boxShadow:"0 0 6px rgba(99,102,241,.6)" }} />
            )}
            <div
              draggable
              onDragStart={e => handleDragStart(e, item.id)}
              onDragEnd={handleDragEnd}
              onDragOver={e => { e.preventDefault(); e.stopPropagation(); handleDragOver(e, idx); }}
              onDrop={e => { e.stopPropagation(); handleDrop(e, idx); }}
            >
              <KanbanCard
                item={item} onMove={onMove} onUpdate={onUpdate}
                allUsers={allUsers} teams={teams}
                isDragging={draggingId === item.id}
                dragHandleProps={{}}
              />
            </div>
          </div>
        ))}
        {/* Drop indicator at end */}
        {overIdx === items.length && draggingId && (
          <div style={{ height:3, borderRadius:2, background:"#6366f1",
            margin:"4px 0 0", boxShadow:"0 0 6px rgba(99,102,241,.6)" }} />
        )}
      </div>
    </div>
  );
}

// ─── MAIN ACCIONABLES VIEW ────────────────────────────────────────────────────
export function Accionables({ user, items, setItems, history: historyProp, lang }) {
  const t = useT(lang);
  const allHistory = historyProp || DEMO_HISTORY;
  const allUsers   = DEMO_USERS;
  const teams      = DEMO_TEAMS;

  // Filters
  const [filterTeam,    setFilterTeam]    = useState("");
  const [filterUser,    setFilterUser]    = useState("");
  const [filterPriority,setFilterPriority]= useState("");

  const [draggingId, setDraggingId] = useState(null);
  const [overCol,    setOverCol]    = useState(null);

  // Build canonical item list from history + overlay edits
  const baseItems = allHistory
    .filter(r => user.role === "admin" || r.teamId === (user.primaryTeamId || user.teamIds?.[0]))
    .flatMap(r => {
      const team = teams.find(te => te.id === r.teamId);
      return r.actionables.map(a => ({
        ...a,
        retroId:   r.id,
        retroName: r.name,
        teamId:    r.teamId,
        teamName:  team?.name || "—",
      }));
    });

  // Merge with any edits
  const allItems = baseItems.map(base => {
    const edited = (items || []).find(x => x.id === base.id);
    return edited ? { ...base, ...edited } : base;
  });

  const move = (id, newStatus) => {
    setItems(prev => {
      const existing = prev.find(x => x.id === id);
      if (existing) return prev.map(x => x.id === id ? { ...x, status: newStatus } : x);
      return [...prev, { id, status: newStatus }];
    });
  };

  const updateItem = (updated) => {
    setItems(prev => {
      const existing = prev.find(x => x.id === updated.id);
      if (existing) return prev.map(x => x.id === updated.id ? { ...x, ...updated } : x);
      return [...prev, { ...updated }];
    });
  };

  const handleDrop = (draggedId, targetColId, targetIdx) => {
    const dragged = allItems.find(x => x.id === draggedId);
    if (!dragged) return;

    // Move to new column
    move(draggedId, targetColId);

    // Reorder within column: build new order
    setItems(prev => {
      const withCol = allItems.map(x =>
        x.id === draggedId ? { ...x, status: targetColId } : (prev.find(p => p.id === x.id) ? { ...x, ...prev.find(p => p.id === x.id) } : x)
      );
      const inCol = withCol.filter(x => x.status === targetColId && x.id !== draggedId);
      const newOrder = [...inCol.slice(0, targetIdx), dragged, ...inCol.slice(targetIdx)].map((x, i) => ({ ...x, order: i }));

      const otherEdits = prev.filter(x => !newOrder.find(n => n.id === x.id));
      return [...otherEdits, ...newOrder.map(x => ({ id: x.id, status: x.status, order: x.order, ...x }))];
    });
    setDraggingId(null);
  };

  // Apply filters
  const visible = allItems.filter(item => {
    if (filterTeam     && item.teamId    !== filterTeam)     return false;
    if (filterUser     && item.assignee  !== filterUser)     return false;
    if (filterPriority && item.priority  !== filterPriority) return false;
    return true;
  });

  // Get items for a column, sorted by order
  const colItems = (colId) =>
    visible
      .filter(x => {
        const edited = (items||[]).find(e => e.id === x.id);
        const status = edited?.status || x.status || (x.status === "done" ? "done" : "todo");
        return status === colId;
      })
      .sort((a, b) => {
        const oa = (items||[]).find(e => e.id === a.id)?.order ?? 999;
        const ob = (items||[]).find(e => e.id === b.id)?.order ?? 999;
        return oa - ob;
      });

  // Unique assignees for filter
  const assignees = [...new Set(allItems.map(x => x.assignee).filter(Boolean))];

  return (
    <div style={{ padding:"16px 20px", height:"100%", display:"flex", flexDirection:"column", overflow:"hidden" }}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16, flexWrap:"wrap" }}>
        <h2 style={{ fontFamily:"'Sora',sans-serif", fontSize:17, color:"var(--tx)", margin:0 }}>
          🎯 {t.kanbanTitle}
        </h2>
        <div style={{ marginLeft:"auto", display:"flex", gap:8, flexWrap:"wrap" }}>
          {/* Team filter */}
          <select value={filterTeam} onChange={e => setFilterTeam(e.target.value)}
            style={{ background:"var(--surf)", border:"1px solid var(--border)", borderRadius:7,
              padding:"5px 10px", color:"var(--tx)", fontSize:12, fontFamily:"inherit" }}>
            <option value="">Todos los equipos</option>
            {teams.map(te => <option key={te.id} value={te.id}>{te.name}</option>)}
          </select>
          {/* User filter */}
          <select value={filterUser} onChange={e => setFilterUser(e.target.value)}
            style={{ background:"var(--surf)", border:"1px solid var(--border)", borderRadius:7,
              padding:"5px 10px", color:"var(--tx)", fontSize:12, fontFamily:"inherit" }}>
            <option value="">Todos los usuarios</option>
            {assignees.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
          {/* Priority filter */}
          <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)}
            style={{ background:"var(--surf)", border:"1px solid var(--border)", borderRadius:7,
              padding:"5px 10px", color:"var(--tx)", fontSize:12, fontFamily:"inherit" }}>
            <option value="">Todas las prioridades</option>
            {PRIORITIES.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
          </select>
          {(filterTeam||filterUser||filterPriority) && (
            <Btn sm v="ghost" onClick={() => { setFilterTeam(""); setFilterUser(""); setFilterPriority(""); }}>
              ✕ Limpiar
            </Btn>
          )}
        </div>
      </div>

      {/* Kanban board */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(220px,1fr))",
        gap:14, flex:1, overflowY:"auto", alignItems:"start" }}>
        {COLS.map(col => (
          <KanbanColumn
            key={col.id}
            col={{ ...col, label: t[col.labelKey] || col.labelKey }}
            items={colItems(col.id)}
            onMove={move}
            onUpdate={updateItem}
            onDrop={handleDrop}
            allUsers={allUsers}
            teams={teams}
            draggingId={draggingId}
            setDraggingId={setDraggingId}
            onDragOver={(cid) => setOverCol(cid)}
          />
        ))}
      </div>
    </div>
  );
}
