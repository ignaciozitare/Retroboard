import { useState } from "react";
import { DEMO_USERS } from "./constants";
import { Btn } from "./ui";

const DEMO_ACCOUNTS = [
  { email: "admin@retro.io",    label: "Admin"          },
  { email: "ignacio@atlas.io",  label: "Mod. Owner"     },
  { email: "ana@atlas.io",      label: "Mod. Temporal"  },
  { email: "carlos@atlas.io",   label: "Participante"   },
];

export function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [pass, setPass]   = useState("");
  const [err, setErr]     = useState("");

  const submit = () => {
    const user = DEMO_USERS.find(u => u.email === email);
    if (!user) { setErr("Usuario no encontrado"); return; }
    // Demo: any password accepted
    setErr("");
    onLogin(user);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0C0E14" }}>
      <div style={{ width: 380, padding: "40px 36px", background: "#161923", border: "1px solid rgba(255,255,255,.08)", borderRadius: 18, boxShadow: "0 24px 64px rgba(0,0,0,.5)" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 34, marginBottom: 8 }}>🔁</div>
          <h1 style={{ fontFamily: "'Sora',sans-serif", fontSize: 22, color: "#e2e8f0", marginBottom: 4 }}>RetroBoard</h1>
          <p style={{ fontSize: 13, color: "#475569" }}>Inicia sesión para continuar</p>
        </div>

        {/* Email */}
        <label style={{ display: "block", fontSize: 12, color: "#64748b", marginBottom: 5 }}>Correo electrónico</label>
        <input
          value={email} onChange={e => setEmail(e.target.value)}
          placeholder="nombre@empresa.io" type="email"
          style={{ width: "100%", background: "#0c0e14", border: "1px solid rgba(255,255,255,.12)", borderRadius: 8, padding: "10px 13px", color: "#e2e8f0", fontSize: 13, outline: "none", marginBottom: 12 }}
        />

        {/* Password */}
        <label style={{ display: "block", fontSize: 12, color: "#64748b", marginBottom: 5 }}>Contraseña</label>
        <input
          value={pass} onChange={e => setPass(e.target.value)}
          placeholder="••••••••••" type="password"
          onKeyDown={e => e.key === "Enter" && submit()}
          style={{ width: "100%", background: "#0c0e14", border: "1px solid rgba(255,255,255,.12)", borderRadius: 8, padding: "10px 13px", color: "#e2e8f0", fontSize: 13, outline: "none", marginBottom: err ? 8 : 16 }}
        />
        {err && <p style={{ fontSize: 12, color: "#f87171", marginBottom: 12 }}>{err}</p>}

        <Btn full onClick={submit} sx={{ padding: "11px", fontSize: 14, marginBottom: 20 }}>Iniciar sesión</Btn>

        {/* Demo accounts */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,.06)", paddingTop: 14 }}>
          <p style={{ fontSize: 11, color: "#334155", marginBottom: 8 }}>Cuentas demo (cualquier contraseña):</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {DEMO_ACCOUNTS.map(a => (
              <button
                key={a.email}
                onClick={() => setEmail(a.email)}
                style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)", borderRadius: 7, padding: "5px 10px", cursor: "pointer", fontSize: 11, color: "#64748b", textAlign: "left", display: "flex", gap: 8 }}
              >
                <span style={{ color: "#475569" }}>→</span>
                <span style={{ flex: 1 }}>{a.email}</span>
                <span style={{ color: "#334155" }}>{a.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
