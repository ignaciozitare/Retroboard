import { useState, useRef } from "react";
import { DEMO_HISTORY, DEMO_TEAMS, DEMO_USERS, PRIORITIES, PRIORITY_MAP } from "./constants";
import { Btn, dateStr } from "./ui";
import { Modal } from "./Modal";
import { useT } from "./i18n";

// ─── KANBAN CONFIG ────────────────────────────────────────────────────────────
const COLS = [
  { id:"todo",       labelKey:"colTodo",       color:"#64748b", bg:"rgba(100,116,139,.08)" },
  { id:"inprogress", labelKey:"colInProgress",  color:"#818cf8", bg:"rgba(129,140,248,.12)" },
  { id:"done",       labelKey:"colDone",        color:"#4ade80", bg:"rgba(74,222,128,.1)"   },
  { id:"cancelled",  labelKey:"colCancelled",   color:"#f87171", bg:"rgba(248,113,113,.1)"  },
];
const COL_LABEL = { todo:"Por hacer", inprogress:"En progreso", done:"Hecho", cancelled:"Cancelado" };

const NEXT_STATUS = {
  todo:       ["inprogress","done","cancelled"],
  inprogress: ["done","cancelled","todo"],
  done:       ["todo","inprogress"],
  cancelled:  ["todo"],
};

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
function CardDetailModal({ item, onClose, onUpdate }) {
  const [data, setData] = useState({ ...item });
  const upd = (k, v) => setData(d => ({ ...d, [k]: v }));

  return (
    <Modal title="Editar Accionable" onClose={onClose} width={540}>
      <div style={{ marginBottom:14 }}>
        <label style={{ display:"block", fontSize:11, color:"var(--tx3)", marginBottom:5, fontWeight:600 }}>Accionable</label>
        <textarea value={data.text||""} onChange={e => upd("text", e.target.value)} rows={3}
          style={{ width:"100%", background:"var(--bg)", border:"1px solid var(--border2)",
            borderRadius:7, padding:"8px 11px", color:"var(--tx)", fontSize:13, resize:"none", outline:"none", fontFamily:"inherit" }} />
      </div>

      <div style={{ marginBottom:14 }}>
        <label style={{ display:"block", fontSize:11, color:"var(--tx3)", marginBottom:5, fontWeight:600 }}>Estado</label>
        <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
          {COLS.map(col => (
            <button key={col.id} onClick={() => upd("status", col.id)}
              style={{ padding:"4px 14px", borderRadius:20,
                border:`1px solid ${col.color}50`,
                background: data.status===col.id ? col.bg : "transparent",
                color: col.color, cursor:"pointer", fontSize:12, fontWeight:600, fontFamily:"inherit",
                outline: data.status===col.id ? `2px solid ${col.color}` : "none" }}>
              {COL_LABEL[col.id]}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom:14 }}>
        <label style={{ display:"block", fontSize:11, color:"var(--tx3)", marginBottom:5, fontWeight:600 }}>Prioridad</label>
        <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
          {PRIORITIES.map(p => (
            <button key={p.id} onClick={() => upd("priority", p.id)}
              style={{ padding:"4px 12px", borderRadius:20,
                border:`1px solid ${p.color}50`,
                background: data.priority===p.id ? p.bg : "transparent",
                color: p.color, cursor:"pointer", fontSize:12, fontWeight:700, fontFamily:"inherit",
                outline: data.priority===p.id ? `2px solid ${p.color}` : "none" }}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:14 }}>
        <div>
          <label style={{ display:"block", fontSize:11, color:"var(--tx3)", marginBottom:5, fontWeight:600 }}>Responsable</label>
          <select value={data.assignee||""} onChange={e => upd("assignee", e.target.value)}
            style={{ width:"100%", background:"var(--bg)", border:"1px solid var(--border2)",
              borderRadius:7, padding:"8px 10px", color:"var(--tx)", fontSize:12, fontFamily:"inherit" }}>
            <option value="">Sin asignar</option>
            {DEMO_USERS.map(u => <option key={u.id} value={u.name}>{u.name}</option>)}
          </select>
        </div>
        <div>
          <label style={{ display:"block", fontSize:11, color:"var(--tx3)", marginBottom:5, fontWeight:600 }}>Fecha límite</label>
          <input type="date" value={data.due||data.dueDate||""} onChange={e => upd("due", e.target.value)}
            style={{ width:"100%", background:"var(--bg)", border:"1px solid var(--border2)",
              borderRadius:7, padding:"8px 10px", color:"var(--tx)", fontSize:12, fontFamily:"inherit" }} />
        </div>
      </div>

      <div style={{ padding:"10px 12px", background:"var(--surf2)", borderRadius:8, marginBottom:16, fontSize:12, color:"var(--tx3)" }}>
        📋 {data.retroName} {data.teamName && <span style={{ marginLeft:12 }}>🏷️ {data.teamName}</span>}
      </div>

      <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}>
        <Btn v="ghost" onClick={onClose}>Cancelar</Btn>
        <Btn onClick={() => { onUpdate(data); onClose(); }}>Guardar cambios</Btn>
      </div>
    </Modal>
  );
}

// ─── KANBAN CARD ─────────────────────────────────────────────────────────────
function KanbanCard({ item, onMove, onUpdate, isDragging }) {
  const [showDetail, setShowDetail] = useState(false);
  const col = COLS.find(c => c.id === item.status) || COLS[0];

  return (
    <>
      {showDetail && (
        <CardDetailModal item={item} onClose={() => setShowDetail(false)} onUpdate={onUpdate} />
      )}
      <div style={{
        background:"var(--surf)", border:`1px solid var(--border)`,
        borderLeft:`3px solid ${col.color}`, borderRadius:10,
        padding:"10px 12px", cursor:"grab",
        opacity: isDragging ? 0.3 : 1, userSelect:"none",
        boxShadow: isDragging ? "none" : "0 1px 3px rgba(0,0,0,.12)",
        transition:"opacity .1s",
      }}>
        <p onClick={() => setShowDetail(true)}
          style={{ fontSize:12, color:"var(--tx)", lineHeight:1.45, margin:"0 0 7px",
            fontWeight:500, cursor:"pointer" }}
          title="Clic para editar">
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
                <button key={next}
                  onMouseDown={e => e.stopPropagation()}
                  onClick={e => { e.stopPropagation(); onMove(item.id, next); }}
                  title={COL_LABEL[next]}
                  style={{ width:20, height:20, borderRadius:"50%",
                    border:`1px solid ${nc.color}60`, background:nc.bg, color:nc.color,
                    cursor:"pointer", fontSize:10, fontFamily:"inherit",
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

// ─── KANBAN COLUMN ────────────────────────────────────────────────────────────
function KanbanColumn({ col, items, onMove, onUpdate, dragState, onDragStart, onDragEnterCard, onDropCol }) {
  // dragState = { id, fromCol }
  const isDragTarget = dragState && dragState.fromCol !== col.id;

  return (
    <div
      onDragOver={e => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; }}
      onDrop={e => { e.preventDefault(); onDropCol(col.id, items.length); }}
      style={{
        background: isDragTarget ? `${col.color}08` : "var(--surf2)",
        border:`2px solid ${isDragTarget ? col.color : col.color+"22"}`,
        borderTop:`3px solid ${col.color}`, borderRadius:12,
        padding:"12px 10px", minHeight:220,
        display:"flex", flexDirection:"column",
        transition:"border-color .15s, background .15s",
      }}>

      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:12, flexShrink:0 }}>
        <span style={{ fontSize:12, fontWeight:700, color:col.color }}>{col.label}</span>
        <span style={{ marginLeft:"auto", background:col.bg, color:col.color,
          borderRadius:20, padding:"1px 8px", fontSize:11, fontWeight:700 }}>{items.length}</span>
      </div>

      {/* Drop zone hint when empty */}
      {items.length === 0 && (
        <div
          onDragOver={e => e.preventDefault()}
          onDrop={e => { e.preventDefault(); onDropCol(col.id, 0); }}
          style={{ border:`2px dashed ${isDragTarget ? col.color : col.color+"40"}`,
            borderRadius:8, padding:"24px 8px", textAlign:"center",
            fontSize:12, color: isDragTarget ? col.color : "var(--dim)",
            flex:1, transition:"all .15s" }}>
          {isDragTarget ? `Soltar aquí →` : "Sin tareas"}
        </div>
      )}

      {/* Cards */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", gap:0 }}>
        {items.map((item, idx) => (
          <div key={item.id}>
            {/* Drop zone ABOVE each card */}
            <div
              onDragOver={e => { e.preventDefault(); e.stopPropagation(); onDragEnterCard(col.id, idx); }}
              onDrop={e => { e.preventDefault(); e.stopPropagation(); onDropCol(col.id, idx); }}
              style={{
                height: dragState ? 8 : 4,
                margin:"2px 0",
                borderRadius:4,
                background: dragState?.insertCol===col.id && dragState?.insertIdx===idx
                  ? "#6366f1" : "transparent",
                boxShadow: dragState?.insertCol===col.id && dragState?.insertIdx===idx
                  ? "0 0 8px rgba(99,102,241,.7)" : "none",
                transition:"all .1s",
              }}
            />
            <div
              draggable
              onDragStart={e => {
                e.dataTransfer.effectAllowed = "move";
                e.dataTransfer.setData("text/plain", item.id);
                // small delay so opacity change is visible
                setTimeout(() => onDragStart(item.id, col.id), 0);
              }}
              onDragEnd={() => onDragStart(null, null)}
            >
              <KanbanCard
                item={item}
                onMove={onMove}
                onUpdate={onUpdate}
                isDragging={dragState?.id === item.id}
              />
            </div>
          </div>
        ))}

        {/* Drop zone at END of column */}
        {items.length > 0 && (
          <div
            onDragOver={e => { e.preventDefault(); e.stopPropagation(); onDragEnterCard(col.id, items.length); }}
            onDrop={e => { e.preventDefault(); e.stopPropagation(); onDropCol(col.id, items.length); }}
            style={{
              height: dragState ? 8 : 4,
              margin:"2px 0",
              borderRadius:4,
              background: dragState?.insertCol===col.id && dragState?.insertIdx===items.length
                ? "#6366f1" : "transparent",
              boxShadow: dragState?.insertCol===col.id && dragState?.insertIdx===items.length
                ? "0 0 8px rgba(99,102,241,.7)" : "none",
              transition:"all .1s",
            }}
          />
        )}
      </div>
    </div>
  );
}

// ─── MAIN VIEW ────────────────────────────────────────────────────────────────
export function Accionables({ user, items, setItems, history: historyProp, lang }) {
  const t = useT(lang);
  const allHistory = historyProp || DEMO_HISTORY;

  const [filterTeam,     setFilterTeam]     = useState("");
  const [filterUser,     setFilterUser]     = useState("");
  const [filterPriority, setFilterPriority] = useState("");

  // dragState: { id, fromCol, insertCol, insertIdx } | null
  const [dragState, setDragState] = useState(null);

  // Build base items from history
  const baseItems = allHistory
    .filter(r => user.role === "admin" || (user.teamIds||[]).includes(r.teamId))
    .flatMap(r => {
      const team = DEMO_TEAMS.find(te => te.id === r.teamId);
      return r.actionables.map(a => ({
        ...a,
        retroId:   r.id,
        retroName: r.name,
        teamId:    r.teamId,
        teamName:  team?.name || "—",
      }));
    });

  // Merge edits
  const mergedItems = baseItems.map(base => {
    const edit = (items||[]).find(x => x.id === base.id);
    return edit ? { ...base, ...edit } : { ...base, status: base.status==="done" ? "done" : "todo" };
  });

  const move = (id, newStatus) => {
    setItems(prev => {
      const existing = prev.find(x => x.id === id);
      if (existing) return prev.map(x => x.id===id ? { ...x, status:newStatus } : x);
      return [...prev, { id, status:newStatus }];
    });
  };

  const updateItem = (updated) => {
    setItems(prev => {
      const existing = prev.find(x => x.id === updated.id);
      if (existing) return prev.map(x => x.id===updated.id ? { ...x, ...updated } : x);
      return [...prev, { ...updated }];
    });
  };

  const handleDragStart = (id, fromCol) => {
    if (!id) { setDragState(null); return; }
    setDragState({ id, fromCol, insertCol: null, insertIdx: null });
  };

  const handleDragEnterCard = (colId, idx) => {
    setDragState(prev => prev ? { ...prev, insertCol: colId, insertIdx: idx } : prev);
  };

  const handleDropCol = (targetColId, targetIdx) => {
    if (!dragState?.id) return;
    const draggedId = dragState.id;

    // Determine final order for target column
    setItems(prev => {
      // Build current merged state with edits applied
      const current = mergedItems.map(base => {
        const e = prev.find(x => x.id === base.id);
        return e ? { ...base, ...e } : base;
      });

      // Move dragged item to target col
      const withNewCol = current.map(x =>
        x.id === draggedId ? { ...x, status: targetColId } : x
      );

      // Get items in target col (excluding dragged), sorted by order
      const inTarget = withNewCol
        .filter(x => x.status === targetColId && x.id !== draggedId)
        .sort((a,b) => (a.order??999) - (b.order??999));

      const dragged = withNewCol.find(x => x.id === draggedId);

      // Insert at targetIdx
      const newOrder = [
        ...inTarget.slice(0, targetIdx),
        dragged,
        ...inTarget.slice(targetIdx),
      ];

      // Assign order numbers
      const reordered = newOrder.map((x, i) => ({ ...x, order: i }));

      // Merge back
      const otherItems = prev.filter(x => !reordered.find(r => r.id === x.id));
      return [...otherItems, ...reordered.map(x => ({ id:x.id, status:x.status, order:x.order, priority:x.priority, assignee:x.assignee, due:x.due, text:x.text }))];
    });

    setDragState(null);
  };

  // Apply filters
  const visible = mergedItems.filter(item => {
    const status = (items||[]).find(x => x.id===item.id)?.status || item.status || "todo";
    const priority = (items||[]).find(x => x.id===item.id)?.priority || item.priority;
    if (filterTeam     && item.teamId   !== filterTeam)    return false;
    if (filterUser     && item.assignee !== filterUser)    return false;
    if (filterPriority && priority      !== filterPriority) return false;
    return true;
  }).map(item => {
    const edit = (items||[]).find(x => x.id===item.id);
    return edit ? { ...item, ...edit } : item;
  });

  const colItems = (colId) =>
    visible
      .filter(x => (x.status||"todo") === colId)
      .sort((a,b) => (a.order??999) - (b.order??999));

  const assignees = [...new Set(mergedItems.map(x => x.assignee).filter(Boolean))];

  return (
    <div style={{ padding:"16px 20px", height:"100%", display:"flex", flexDirection:"column", overflow:"hidden" }}>
      {/* Header + filters */}
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16, flexWrap:"wrap" }}>
        <h2 style={{ fontFamily:"'Sora',sans-serif", fontSize:17, color:"var(--tx)", margin:0 }}>
          🎯 {t.kanbanTitle}
        </h2>
        <div style={{ marginLeft:"auto", display:"flex", gap:8, flexWrap:"wrap" }}>
          <select value={filterTeam} onChange={e => setFilterTeam(e.target.value)}
            style={{ background:"var(--surf)", border:"1px solid var(--border)", borderRadius:7,
              padding:"5px 10px", color:"var(--tx)", fontSize:12, fontFamily:"inherit" }}>
            <option value="">Todos los equipos</option>
            {DEMO_TEAMS.map(te => <option key={te.id} value={te.id}>{te.name}</option>)}
          </select>
          <select value={filterUser} onChange={e => setFilterUser(e.target.value)}
            style={{ background:"var(--surf)", border:"1px solid var(--border)", borderRadius:7,
              padding:"5px 10px", color:"var(--tx)", fontSize:12, fontFamily:"inherit" }}>
            <option value="">Todos los usuarios</option>
            {assignees.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
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

      {/* Board */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4, minmax(200px,1fr))",
        gap:14, flex:1, overflowY:"auto", alignItems:"start" }}>
        {COLS.map(col => (
          <KanbanColumn
            key={col.id}
            col={{ ...col, label: t[col.labelKey] || COL_LABEL[col.id] }}
            items={colItems(col.id)}
            onMove={move}
            onUpdate={updateItem}
            dragState={dragState}
            onDragStart={handleDragStart}
            onDragEnterCard={handleDragEnterCard}
            onDropCol={handleDropCol}
          />
        ))}
      </div>
    </div>
  );
}
