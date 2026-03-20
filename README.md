# RetroBoard

Aplicación web para liderar retrospectivas de equipo en tiempo real.  
Stack: **React 18 + Vite + Supabase + Vercel**

---

## Funcionalidades

- **Auth**: login con email/contraseña, sin auto-registro
- **Roles**: Admin · Mod. Owner · Mod. Temporal · Participante
- **Historial**: retros pasadas con accionables y estado abierto/cerrado
- **Gestión de usuarios**: crear con contraseña generada, tabla de credenciales
- **Gestión de equipos**: owner + moderadores temporales + participantes
- **Panel Admin**: cambio de rol inline, reglas de promoción automáticas
- **Flujo de retro** (6 fases):
  1. Lobby — configuración (nombre, tiempos, votos)
  2. Crear tarjetas — privadas hasta que el mod cierre la fase
  3. Organizar — Kanban con drag & drop y apilado
  4. Votar — puntos acumulables por tarjeta
  5. Discutir — spotlight + accionable + responsable + fecha
  6. Resumen — exportar, crear tickets Jira

---

## Setup local

```bash
# 1. Instalar dependencias
npm install

# 2. Crear .env con tus credenciales de Supabase
cp .env.example .env
# Edita .env con VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY

# 3. Arrancar en local
npm run dev
```

Sin credenciales de Supabase la app arranca en **modo demo** con datos ficticios.

---

## Deploy en Vercel

1. Sube este repositorio a GitHub
2. Importa el proyecto en [vercel.com](https://vercel.com)
3. Añade las variables de entorno:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy automático en cada push a `main`

---

## Estructura

```
src/
├── constants.js          — datos demo, tokens de diseño, configuración
├── supabase.js           — cliente Supabase (nulo si no hay .env)
├── ui.jsx                — átomos: Avatar, Btn, RoleBadge, TimerBar…
├── App.jsx               — shell principal + router
├── Login.jsx
├── Sidebar.jsx
├── Dashboard.jsx
├── Historial.jsx
├── Usuarios.jsx
├── Equipos.jsx
├── AdminPanel.jsx
├── RetroFlow.jsx         — orquestador del flujo de retro
└── phases/
    ├── RetroLobby.jsx
    ├── RetroCreating.jsx
    ├── RetroGrouping.jsx
    ├── RetroVoting.jsx
    ├── RetroDiscussion.jsx
    └── RetroSummary.jsx
```

---

## Roadmap — próximas iteraciones

- [ ] Conectar auth con Supabase Auth
- [ ] Persistencia de sesiones y tarjetas en Postgres
- [ ] Realtime con Supabase subscriptions (tarjetas y votos en vivo)
- [ ] Integración Jira (Atlassian OAuth 2.0 — ya implementado en WorkSuite)
- [ ] Exportar PDF / copiar accionables
- [ ] Notificaciones de accionables vencidos
