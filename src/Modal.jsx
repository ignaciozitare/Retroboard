import { useEffect } from "react";

export function Modal({ title, onClose, children, width = 520 }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.6)", zIndex:200,
        display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div style={{ background:"var(--surf)", border:"1px solid var(--border)",
        borderRadius:16, width:"100%", maxWidth:width, maxHeight:"90vh",
        overflow:"hidden", display:"flex", flexDirection:"column",
        boxShadow:"0 24px 64px rgba(0,0,0,.5)", animation:"fadeIn .15s ease" }}>
        {/* Header */}
        <div style={{ padding:"16px 20px", borderBottom:"1px solid var(--border)",
          display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
          <h3 style={{ fontFamily:"'Sora',sans-serif", fontSize:15, color:"var(--tx)",
            margin:0, flex:1, fontWeight:700 }}>{title}</h3>
          <button onClick={onClose}
            style={{ background:"transparent", border:"none", color:"var(--tx3)",
              cursor:"pointer", fontSize:20, lineHeight:1, padding:"2px 6px",
              borderRadius:6, fontFamily:"inherit" }}>✕</button>
        </div>
        {/* Body */}
        <div style={{ overflowY:"auto", flex:1, padding:"18px 20px" }}>
          {children}
        </div>
      </div>
    </div>
  );
}

export function ConfirmModal({ message, onConfirm, onCancel, danger = false }) {
  return (
    <Modal title="Confirmar" onClose={onCancel} width={380}>
      <p style={{ fontSize:14, color:"var(--tx)", marginBottom:20, lineHeight:1.6 }}>{message}</p>
      <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
        <button onClick={onCancel}
          style={{ background:"var(--surf2)", border:"1px solid var(--border)", borderRadius:8,
            padding:"7px 16px", color:"var(--tx2)", cursor:"pointer", fontSize:13, fontFamily:"inherit" }}>
          Cancelar
        </button>
        <button onClick={onConfirm}
          style={{ background: danger ? "var(--red)" : "#6366f1", border:"none", borderRadius:8,
            padding:"7px 16px", color:"#fff", cursor:"pointer", fontSize:13, fontWeight:600, fontFamily:"inherit" }}>
          Confirmar
        </button>
      </div>
    </Modal>
  );
}
