
// ─── ROLE METADATA ────────────────────────────────────────────────────────────
export const ROLE_META = {
  admin:    { label:"Admin",        color:"#f87171", bg:"rgba(248,113,113,.13)" },
  owner:    { label:"Mod. Owner",   color:"#818cf8", bg:"rgba(129,140,248,.13)" },
  temporal: { label:"Mod. Temporal",color:"#fbbf24", bg:"rgba(251,191,36,.13)"  },
  member:   { label:"Participante", color:"#94a3b8", bg:"rgba(148,163,184,.1)"  },
};

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
  lobby:      { label:"Configuración", icon:"⚙️",  color:"#64748b" },
  creating:   { label:"Crear",         icon:"📝",   color:"#818cf8" },
  grouping:   { label:"Organizar",     icon:"🗂️",   color:"#fbbf24" },
  voting:     { label:"Votación",      icon:"🗳️",   color:"#f472b6" },
  discussion: { label:"Discusión",     icon:"💬",   color:"#34d399" },
  summary:    { label:"Resumen",       icon:"🏁",   color:"#fb923c" },
};
export const TIMED_PHASES = ["creating","grouping","voting","discussion"];

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
export const MAX_TITLE = 50;
export const HEADER_H  = 50; // px

// ─── DEMO USERS ───────────────────────────────────────────────────────────────
export const DEMO_USERS = [
  { id:"u0", name:"Root Admin",  email:"admin@retro.io",    role:"admin",   teamId:null, initials:"RA", color:"#f87171" },
  { id:"u1", name:"Ignacio Z.",  email:"ignacio@atlas.io",  role:"owner",   teamId:"t1", initials:"IZ", color:"#818cf8" },
  { id:"u2", name:"Ana G.",      email:"ana@atlas.io",      role:"temporal",teamId:"t1", initials:"AG", color:"#f472b6" },
  { id:"u3", name:"Carlos L.",   email:"carlos@atlas.io",   role:"member",  teamId:"t1", initials:"CL", color:"#60a5fa" },
  { id:"u4", name:"Marta R.",    email:"marta@atlas.io",    role:"member",  teamId:"t1", initials:"MR", color:"#34d399" },
  { id:"u5", name:"Pepe T.",     email:"pepe@atlas.io",     role:"member",  teamId:"t1", initials:"PT", color:"#fb923c" },
  { id:"u6", name:"Laura S.",    email:"laura@nexus.io",    role:"owner",   teamId:"t2", initials:"LS", color:"#a78bfa" },
  { id:"u7", name:"David K.",    email:"david@nexus.io",    role:"member",  teamId:"t2", initials:"DK", color:"#38bdf8" },
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
      { text:"Estimar con planning poker",          assignee:"Carlos L.", due:"2025-02-21", status:"done" },
      { text:"Crear plantilla de onboarding",       assignee:"Marta R.",  due:"2025-02-28", status:"open" },
      { text:"Cancelar reporte semanal",            assignee:"Pepe T.",   due:"2025-02-18", status:"done" },
    ],
    cards:[
      { text:"Daily standups muy efectivas", cat:"good"   },
      { text:"Code review riguroso",          cat:"good"   },
      { text:"Estimaciones sin estructura",   cat:"bad"    },
      { text:"Reuniones sin agenda",          cat:"bad"    },
      { text:"Mejorar onboarding",            cat:"change" },
      { text:"Dejar reportes manuales",       cat:"stop"   },
    ],
  },
  {
    id:"h2", name:"Retro Sprint 40", date:"2025-02-28", teamId:"t1",
    participants:["u1","u3","u4"],
    stats:{ cards:10, withAction:6, votes:31 },
    actionables:[
      { text:"Limitar status a 30 min con agenda", assignee:"Ana G.",    due:"2025-03-07", status:"open" },
      { text:"Viernes para documentación técnica", assignee:"Carlos L.", due:"2025-03-14", status:"open" },
    ],
    cards:[
      { text:"Comunicación fluida entre equipos", cat:"good"   },
      { text:"Documentación desactualizada",      cat:"bad"    },
      { text:"Falta estructura en reviews",       cat:"bad"    },
      { text:"Cambiar herramienta de sprints",    cat:"change" },
      { text:"Reuniones sin resultado claro",     cat:"stop"   },
    ],
  },
  {
    id:"h3", name:"Retro Sprint 41", date:"2025-03-14", teamId:"t1",
    participants:["u1","u2","u3","u4","u5"],
    stats:{ cards:12, withAction:9, votes:38 },
    actionables:[
      { text:"Daily asíncrona los viernes",          assignee:"Marta R.",  due:"2025-03-21", status:"open" },
      { text:"Review de deuda técnica cada sprint",  assignee:"Pepe T.",   due:"2025-03-28", status:"open" },
      { text:"Actualizar README de repos activos",   assignee:"Carlos L.", due:"2025-04-04", status:"open" },
    ],
    cards:[
      { text:"Deploy muy estable",                   cat:"good"   },
      { text:"Demos del sprint bien recibidas",      cat:"good"   },
      { text:"Muchas interrupciones mid-sprint",     cat:"bad"    },
      { text:"Adoptar trunk-based development",      cat:"change" },
      { text:"Retros quincenales",                   cat:"change" },
      { text:"Estimaciones de un punto",             cat:"stop"   },
    ],
  },
];

// ─── DEMO CARDS (for retro flow) ──────────────────────────────────────────────
export const DEMO_CARDS = [
  { id:"d1",  text:"Las daily standups son muy efectivas",             category:"good",   author:"Ana G.",    votes:0, actionable:"", assignee:"", dueDate:"", merged:[] },
  { id:"d2",  text:"Buena comunicación entre producto y dev",          category:"good",   author:"Carlos L.", votes:0, actionable:"", assignee:"", dueDate:"", merged:[] },
  { id:"d3",  text:"El code review mejora la calidad del código",      category:"good",   author:"Marta R.",  votes:0, actionable:"", assignee:"", dueDate:"", merged:[] },
  { id:"d4",  text:"Estimaciones que no reflejan la complejidad real", category:"bad",    author:"Pepe T.",   votes:0, actionable:"", assignee:"", dueDate:"", merged:[] },
  { id:"d5",  text:"Demasiadas reuniones no planificadas",             category:"bad",    author:"Ana G.",    votes:0, actionable:"", assignee:"", dueDate:"", merged:[] },
  { id:"d6",  text:"Documentación técnica muy desactualizada",         category:"bad",    author:"Carlos L.", votes:0, actionable:"", assignee:"", dueDate:"", merged:[] },
  { id:"d7",  text:"Mejorar onboarding para nuevos compañeros",        category:"change", author:"Marta R.",  votes:0, actionable:"", assignee:"", dueDate:"", merged:[] },
  { id:"d8",  text:"Cambiar herramienta de gestión de sprints",        category:"change", author:"Pepe T.",   votes:0, actionable:"", assignee:"", dueDate:"", merged:[] },
  { id:"d9",  text:"Retrospectivas cada 2 semanas",                    category:"change", author:"Ana G.",    votes:0, actionable:"", assignee:"", dueDate:"", merged:[] },
  { id:"d10", text:"Reportes semanales de estado que nadie lee",       category:"stop",   author:"Carlos L.", votes:0, actionable:"", assignee:"", dueDate:"", merged:[] },
  { id:"d11", text:"Reuniones de status sin agenda 1h+",               category:"stop",   author:"Marta R.",  votes:0, actionable:"", assignee:"", dueDate:"", merged:[] },
];
