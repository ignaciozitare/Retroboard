export const T = {
  es: {
    // Nav
    dashboard: "Dashboard", newRetro: "Nueva Retro", history: "Historial",
    users: "Usuarios", teams: "Equipos", admin: "Admin", actionables: "Accionables",
    logout: "Cerrar sesión",
    // Dashboard
    welcome: "Bienvenido", retrosDone: "Retros realizadas",
    openActions: "Accionables abiertos", activeTeams: "Equipos activos",
    lastRetro: "Última retrospectiva", viewHistory: "Ver historial →",
    readyForRetro: "¿Listo para la próxima retro?", startNewSession: "Crea una nueva sesión en segundos",
    // Kanban
    kanbanTitle: "Tablero de Accionables",
    colTodo: "Por hacer", colInProgress: "En progreso", colDone: "Hecho", colCancelled: "Cancelado",
    markInProgress: "En progreso", markDone: "Hecho", markCancelled: "Cancelar", markTodo: "Reabrir",
    noActionables: "Sin accionables",
    // Retro
    startRetro: "🚀 Comenzar Retrospectiva", exitRetro: "← Salir al dashboard",
    configTitle: "Configuración", configSub: "Configura la sesión antes de que el equipo entre",
    retroName: "Nombre de la retrospectiva", roomCode: "Código de sala",
    phaseTime: "Tiempo por fase (minutos)", votesPerUser: "Votos por participante",
    teamHistory: "📚 Historial del equipo", pendingActions: "🎯 Accionables pendientes",
    viewPrevRetros: "Ver retros anteriores", reviewPrev: "Revisar compromisos anteriores",
    // Summary
    retroComplete: "RETROSPECTIVA COMPLETADA", cards: "Tarjetas", withAction: "Con accionable",
    noAction: "Sin accionable", totalVotes: "Votos totales",
    copyActions: "📋 Copiar accionables", exportCSV: "📥 CSV",
    backDashboard: "← Volver al dashboard",
    selectForKanban: "Selecciona accionables para trabajar en la próxima iteración",
    // Misc
    save: "Guardar", cancel: "Cancelar", edit: "Editar", delete: "Eliminar",
    add: "Añadir", create: "Crear", close: "Cerrar",
  },
  en: {
    dashboard: "Dashboard", newRetro: "New Retro", history: "History",
    users: "Users", teams: "Teams", admin: "Admin", actionables: "Actionables",
    logout: "Log out",
    welcome: "Welcome", retrosDone: "Retros done",
    openActions: "Open actionables", activeTeams: "Active teams",
    lastRetro: "Last retrospective", viewHistory: "View history →",
    readyForRetro: "Ready for the next retro?", startNewSession: "Create a new session in seconds",
    kanbanTitle: "Actionables Board",
    colTodo: "To do", colInProgress: "In progress", colDone: "Done", colCancelled: "Cancelled",
    markInProgress: "In progress", markDone: "Done", markCancelled: "Cancel", markTodo: "Reopen",
    noActionables: "No actionables",
    startRetro: "🚀 Start Retrospective", exitRetro: "← Back to dashboard",
    configTitle: "Setup", configSub: "Configure the session before the team joins",
    retroName: "Retrospective name", roomCode: "Room code",
    phaseTime: "Time per phase (minutes)", votesPerUser: "Votes per participant",
    teamHistory: "📚 Team history", pendingActions: "🎯 Pending actionables",
    viewPrevRetros: "View previous retros", reviewPrev: "Review previous commitments",
    retroComplete: "RETROSPECTIVE COMPLETE", cards: "Cards", withAction: "With actionable",
    noAction: "No actionable", totalVotes: "Total votes",
    copyActions: "📋 Copy actionables", exportCSV: "📥 CSV",
    backDashboard: "← Back to dashboard",
    selectForKanban: "Select actionables to work on in the next iteration",
    save: "Save", cancel: "Cancel", edit: "Edit", delete: "Delete",
    add: "Add", create: "Create", close: "Close",
  },
};

export const useT = (lang) => T[lang] || T.es;
