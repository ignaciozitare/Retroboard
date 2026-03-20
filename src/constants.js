// ─── ROLE METADATA ────────────────────────────────────────────────────────────
export const ROLE_META = {
  admin:    { label:"Admin",         color:"#f87171", bg:"rgba(248,113,113,.13)" },
  owner:    { label:"Mod. Owner",    color:"#818cf8", bg:"rgba(129,140,248,.13)" },
  temporal: { label:"Mod. Temporal", color:"#fbbf24", bg:"rgba(251,191,36,.13)"  },
  member:   { label:"Participante",  color:"#94a3b8", bg:"rgba(148,163,184,.1)"  },
};

// ─── PRIORITY METADATA ────────────────────────────────────────────────────────
export const PRIORITIES = [
  { id:"minor",    label:"Minor",    color:"#94a3b8", bg:"rgba(148,163,184,.15)" },
  { id:"medium",   label:"Medium",   color:"#60a5fa", bg:"rgba(96,165,250,.15)"  },
  { id:"major",    label:"Major",    color:"#fbbf24", bg:"rgba(251,191,36,.15)"  },
  { id:"critical", label:"Critical", color:"#f97316", bg:"rgba(249,115,22,.15)"  },
  { id:"blocker",  label:"Blocker",  color:"#f87171", bg:"rgba(248,113,113,.15)" },
];
export const PRIORITY_MAP = Object.fromEntries(PRIORITIES.map(p => [p.id, p]));

// ─── CATEGORY METADATA ───────────────────────────────────────────────────────
export const CATS = [
  { id:"good",   label:"Hacemos Bien",      emoji:"✨", color:"#4ade80", dim:"rgba(74,222,128,0.13)",  border:"rgba(74,222,128,0.3)"  },
  { id:"bad",    label:"Hacemos Mal",        emoji:"⚡", color:"#f87171", dim:"rgba(248,113,113,0.13)", border:"rgba(248,113,113,0.3)" },
  { id:"change", label:"Deberíamos Cambiar", emoji:"🔄", color:"#fbbf24", dim:"rgba(251,191,36,0.13)",  border:"rgba(251,191,36,0.3)"  },
  { id:"stop",   label:"Dejar de Hacer",     emoji:"🛑", color:"#a78bfa", dim:"rgba(167,139,250,0.13)", border:"rgba(167,139,250,0.3)" },
];
export const CATS_MAP = Object.fromEntries(CATS.map(c => [c.id, c]));

// ─── PHASES ───────────────────────────────────────────────────────────────────
export const PHASES = ["lobby","creating","grouping","voting","discussion","summary"];
export const PHASE_META = {
  lobby:      { label:"Config",     icon:"⚙️",  color:"#64748b" },
  creating:   { label:"Crear",      icon:"📝",   color:"#818cf8" },
  grouping:   { label:"Organizar",  icon:"🗂️",   color:"#fbbf24" },
  voting:     { label:"Votación",   icon:"🗳️",   color:"#f472b6" },
  discussion: { label:"Discusión",  icon:"💬",   color:"#34d399" },
  summary:    { label:"Resumen",    icon:"🏁",   color:"#fb923c" },
};
export const TIMED_PHASES = ["creating","grouping","voting","discussion"];

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
export const MAX_TITLE = 50;
export const HEADER_H  = 50;

// ─── DEMO USERS — now with teamIds (array, multi-team support) ────────────────
export const DEMO_USERS = [
  { id:"u0", name:"Root Admin",  email:"admin@retro.io",    role:"admin",   teamIds:["t1","t2"], initials:"RA", color:"#f87171" },
  { id:"u1", name:"Ignacio Z.",  email:"ignacio@atlas.io",  role:"owner",   teamIds:["t1"],      initials:"IZ", color:"#818cf8" },
  { id:"u2", name:"Ana G.",      email:"ana@atlas.io",      role:"temporal",teamIds:["t1"],      initials:"AG", color:"#f472b6" },
  { id:"u3", name:"Carlos L.",   email:"carlos@atlas.io",   role:"member",  teamIds:["t1"],      initials:"CL", color:"#60a5fa" },
  { id:"u4", name:"Marta R.",    email:"marta@atlas.io",    role:"member",  teamIds:["t1","t2"], initials:"MR", color:"#34d399" },
  { id:"u5", name:"Pepe T.",     email:"pepe@atlas.io",     role:"member",  teamIds:["t1"],      initials:"PT", color:"#fb923c" },
  { id:"u6", name:"Laura S.",    email:"laura@nexus.io",    role:"owner",   teamIds:["t2"],      initials:"LS", color:"#a78bfa" },
  { id:"u7", name:"David K.",    email:"david@nexus.io",    role:"member",  teamIds:["t2"],      initials:"DK", color:"#38bdf8" },
];

// ─── DEMO TEAMS ───────────────────────────────────────────────────────────────
export const DEMO_TEAMS = [
  { id:"t1", name:"Equipo Atlas", color:"#818cf8", ownerId:"u1" },
  { id:"t2", name:"Equipo Nexus", color:"#a78bfa", ownerId:"u6" },
];

// ─── DEMO HISTORY ─────────────────────────────────────────────────────────────
export const DEMO_HISTORY = [
  {
    id:"h1", name:"Retro Sprint 39", date:"2025-02-14", teamId:"t1",
    participants:["u1","u3","u4","u5"],
    stats:{ cards:14, withAction:8, votes:42 },
    actionables:[
      { id:"a1", text:"Estimar con planning poker",    assignee:"Carlos L.", due:"2025-02-21", status:"done",  priority:"major"   },
      { id:"a2", text:"Crear plantilla de onboarding", assignee:"Marta R.",  due:"2025-02-28", status:"open",  priority:"medium"  },
      { id:"a3", text:"Cancelar reporte semanal",      assignee:"Pepe T.",   due:"2025-02-18", status:"done",  priority:"minor"   },
    ],
    cards:[
      { text:"Daily standups efectivas",  cat:"good"   },
      { text:"Estimaciones sin estructura",cat:"bad"   },
      { text:"Mejorar onboarding",         cat:"change" },
      { text:"Dejar reportes manuales",    cat:"stop"   },
    ],
  },
  {
    id:"h2", name:"Retro Sprint 40", date:"2025-02-28", teamId:"t1",
    participants:["u1","u3","u4"],
    stats:{ cards:10, withAction:6, votes:31 },
    actionables:[
      { id:"a4", text:"Limitar status a 30 min",       assignee:"Ana G.",    due:"2025-03-07", status:"open",  priority:"critical" },
      { id:"a5", text:"Viernes para documentación",    assignee:"Carlos L.", due:"2025-03-14", status:"open",  priority:"medium"  },
    ],
    cards:[
      { text:"Comunicación fluida",        cat:"good"   },
      { text:"Docs desactualizadas",        cat:"bad"   },
      { text:"Cambiar herramienta sprints", cat:"change" },
      { text:"Reuniones sin resultado",     cat:"stop"   },
    ],
  },
  {
    id:"h3", name:"Retro Sprint 41", date:"2025-03-14", teamId:"t1",
    participants:["u1","u2","u3","u4","u5"],
    stats:{ cards:12, withAction:9, votes:38 },
    actionables:[
      { id:"a6", text:"Daily asíncrona los viernes",      assignee:"Marta R.",  due:"2025-03-21", status:"open", priority:"major"   },
      { id:"a7", text:"Review deuda técnica cada sprint", assignee:"Pepe T.",   due:"2025-03-28", status:"open", priority:"blocker" },
      { id:"a8", text:"Actualizar README de repos",       assignee:"Carlos L.", due:"2025-04-04", status:"open", priority:"minor"   },
    ],
    cards:[
      { text:"Deploy muy estable",        cat:"good"   },
      { text:"Muchas interrupciones",      cat:"bad"   },
      { text:"Trunk-based development",    cat:"change" },
      { text:"Estimaciones de un punto",   cat:"stop"   },
    ],
  },
];

// ─── DEMO CARDS (retro flow) ──────────────────────────────────────────────────
export const DEMO_CARDS = [
  { id:"d1",  text:"Daily standups muy efectivas",             category:"good",   author:"Ana G.",    votes:0, actionable:"", assignee:"", dueDate:"", priority:"medium", merged:[] },
  { id:"d2",  text:"Code review mejora la calidad del código", category:"good",   author:"Carlos L.", votes:0, actionable:"", assignee:"", dueDate:"", priority:"medium", merged:[] },
  { id:"d3",  text:"Estimaciones que no reflejan complejidad", category:"bad",    author:"Pepe T.",   votes:0, actionable:"", assignee:"", dueDate:"", priority:"medium", merged:[] },
  { id:"d4",  text:"Demasiadas reuniones no planificadas",     category:"bad",    author:"Ana G.",    votes:0, actionable:"", assignee:"", dueDate:"", priority:"medium", merged:[] },
  { id:"d5",  text:"Mejorar onboarding para nuevos",          category:"change", author:"Marta R.",  votes:0, actionable:"", assignee:"", dueDate:"", priority:"medium", merged:[] },
  { id:"d6",  text:"Cambiar herramienta de sprints",          category:"change", author:"Pepe T.",   votes:0, actionable:"", assignee:"", dueDate:"", priority:"medium", merged:[] },
  { id:"d7",  text:"Reportes semanales que nadie lee",         category:"stop",   author:"Carlos L.", votes:0, actionable:"", assignee:"", dueDate:"", priority:"medium", merged:[] },
  { id:"d8",  text:"Reuniones de status sin agenda",           category:"stop",   author:"Marta R.",  votes:0, actionable:"", assignee:"", dueDate:"", priority:"medium", merged:[] },
];
