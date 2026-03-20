# RetroBoard — Spec Context
> Documento vivo. Actualizar con cada iteración.

---

## 1. Visión general

RetroBoard es una aplicación web para liderar retrospectivas de equipo en tiempo real, basada en el método de cuatro categorías:

| Categoría | Emoji | Significado |
|-----------|-------|-------------|
| Hacemos Bien | ✨ | Prácticas a mantener |
| Hacemos Mal | ⚡ | Problemas actuales |
| Deberíamos Cambiar | 🔄 | Mejoras a implementar |
| Dejar de Hacer | 🛑 | Hábitos a eliminar |

---

## 2. Autenticación

- Pantalla de login con email + contraseña al entrar a la aplicación
- **Sin auto-registro**: solo usuarios creados por un Moderador Owner o el Admin pueden acceder
- El Moderador Owner crea usuarios (nombre + email → contraseña generada automáticamente)
- Las credenciales generadas se muestran en tabla con botón de copia individual

---

## 3. Roles

| Rol | Símbolo | Capacidades |
|-----|---------|-------------|
| **Admin** | 🔴 | Acceso total. Gestiona todos los usuarios, equipos y roles. Promueve/degrada cualquier usuario |
| **Moderador Owner** | 🟣 | Exactamente uno por equipo. Crea usuarios, gestiona su equipo, designa moderadores temporales. Lidera retros |
| **Moderador Temporal** | 🟡 | Varios por equipo. Puede liderar retros. No puede crear usuarios ni gestionar el equipo |
| **Participante** | ⚪ | Se une a retros, crea tarjetas, vota, añade accionables |

### Reglas de roles
- Cada equipo tiene **exactamente un** Moderador Owner
- Un equipo puede tener **múltiples** Moderadores Temporales
- El Admin puede promover cualquier usuario; al promover un nuevo Owner, el anterior pasa a Moderador Temporal
- Los usuarios y equipos están vinculados a su Moderador Owner

---

## 4. Estructura de la aplicación

### 4.1 Navegación global (sidebar)

| Sección | Admin | Mod Owner | Mod Temp | Participante |
|---------|-------|-----------|----------|--------------|
| Dashboard | ✓ | ✓ | ✓ | ✓ |
| Nueva Retro | — | ✓ | ✓ | — |
| Historial | ✓ | ✓ | ✓ | ✓ |
| Usuarios | ✓ | ✓ (su equipo) | — | — |
| Equipos | ✓ | ✓ (su equipo) | — | — |
| Admin | ✓ | — | — | — |

### 4.2 Vista de Historial (sección propia)
- **Panel izquierdo**: lista de retros pasadas ordenadas cronológicamente (nombre, fecha, equipo)
- **Panel derecho**: detalle de la retro seleccionada
  - Cabecera: nombre, fecha, equipo, avatares de participantes
  - Stats: tarjetas totales, con accionable, sin accionable, votos totales
  - Lista de accionables con responsable, fecha límite y estado (abierto / cerrado)
  - Tarjetas agrupadas por categoría

### 4.3 Gestión de Usuarios (Mod Owner + Admin)
- Formulario: nombre + email → contraseña generada segura
- Tabla de credenciales generadas con copia individual
- Tabla de usuarios: nombre, email, rol, equipo, acciones (cambiar rol, eliminar)
- Mod Owner gestiona solo su equipo; Admin gestiona todos

### 4.4 Gestión de Equipos (Mod Owner + Admin)
- Crear / renombrar equipo
- Lista de miembros con roles y avatares
- Asignar / quitar miembros
- Admin ve y gestiona todos los equipos

### 4.5 Panel de Admin
- Tabla global de todos los usuarios con rol y equipo
- Cambiar rol (dropdown inline)
- Promover a Mod Owner o Mod Temporal por equipo
- Vista de todos los equipos con sus moderadores

---

## 5. Flujo de fases de una retro

```
Lobby → Crear → Organizar (Kanban) → Votar → Discutir → Resumen
```

### 5.1 Lobby
- Nombre (máx. 50 chars, contador regresivo)
- Tiempo por fase configurable (+/−)
- Votos por participante (1–20)
- Código de sala compartible
- Lista de participantes conectados
- "Comenzar Retrospectiva" avanza a Crear

### 5.2 Crear Tarjetas
- Timer controlable (▶/⏸) por moderador; editable in-situ (✎)
- Tarjetas privadas hasta que el moderador cierre la fase
- Categoría seleccionable; Enter añade

### 5.3 Organizar (Kanban)
- Timer controlable y editable
- 4 columnas por categoría
- **Drag & Drop (reglas definitivas):**
  - Soltar en zona vacía/cabecera de columna → recategoriza
  - Soltar en botón "📎 Apilar" de una tarjeta → apila (merge)
  - El botón de apilar solo aparece durante drag de otra tarjeta
  - La columna muestra línea azul de inserción al hacer hover
  - `stopPropagation` en el botón de apilar evita que el drop llegue a la columna
- Tarjetas apiladas: badge con conteo, expandibles, desapilables con ⤴

### 5.4 Votar
- Timer controlable y editable
- N votos acumulables por tarjeta; indicador visual (puntos)

### 5.5 Discutir
- Timer controlable y editable
- Tarjetas ordenadas por votos (mayor → menor)
- Accionable + responsable + fecha por tarjeta
- Sidebar navegable

### 5.6 Resumen
- Stats, accionables completos, exportar (Copiar / PDF / Jira)

---

## 6. Header y navegación

- Header global sticky (`position: sticky; top: 0`, backdrop blur)
- Barra de timer/votos sticky bajo el header en fases cronometradas
- Stepper: moderador navega adelante y atrás; participantes solo lectura
- Nombre de retro en header: truncado con ellipsis (max-width fijo, sin reflow)

---

## 7. Diseño / UI

- Tema oscuro: `#0C0E14` fondo, `#161923` superficies
- Fuentes: Sora 700 (headings) + DM Sans 400/500 (texto)
- Accent: `#6366f1` (indigo)
- Roles: Admin `#f87171` · Mod Owner `#818cf8` · Mod Temp `#fbbf24` · Participante `#94a3b8`

---

## 8. Stack técnico (producción objetivo)

| Capa | Tecnología |
|------|------------|
| Frontend | React + TypeScript (Vite) |
| Backend / Realtime | Supabase (Postgres + Realtime) |
| Auth | Supabase Auth |
| Deploy | Vercel |
| Integración Jira | Atlassian OAuth 2.0 (WorkSuite) |
| Monorepo | WorkSuite (`apps/retro-board/`) |

---

## 9. Modelo de datos (Supabase — provisional)

```sql
users        (id, name, email, role, team_id, created_by, created_at)
teams        (id, name, color, owner_id, created_at)
sessions     (id, code, name, team_id, status, phase, votes_per_user, phase_times jsonb, created_by, created_at)
participants (id, session_id, user_id, role)
cards        (id, session_id, text, category, author_id, parent_card_id, created_at)
votes        (id, card_id, user_id, count)
actionables  (id, card_id, text, assignee, due_date, status, created_at)
```

---

## 10. Historial de iteraciones

### v1 — Prototipo inicial
- 5 fases: Lobby, Crear, Votar, Discutir, Resumen
- Timer único, cards demo, accionables con responsable y fecha

### v2 — Kanban + timers por fase
- Fase Organizar (Kanban) con drag & drop
- Timer independiente por fase; chip flotante de navegación

### v3 — UX Kanban + navegación global + timer editable
- Botón "📎 Apilar" explícito durante drag; línea azul de inserción
- Stepper clicable por moderador; timer editable in-situ

### v4 — Sticky UI + historial en Lobby + título 50 chars
- Header y timer bar sticky; navegación bidireccional de fases
- Título limitado a 50 chars; historial expandible en Lobby

### v5 — Auth + roles + historial como vista propia + usuarios/equipos + admin + fix kanban
- **Login**: pantalla de acceso; cuentas demo por rol (admin, mod owner, mod temp, participante)
- **App shell**: sidebar navegable con ítems filtrados según rol del usuario
- **Dashboard**: stats resumen + última retro con estado de accionables
- **Historial**: vista dedicada — sidebar con lista de retros + panel detalle con stats, accionables (abierto/cerrado) y tarjetas por categoría
- **Usuarios**: formulario crear usuario (nombre + email → contraseña generada segura); tabla de credenciales con copia individual; tabla de usuarios con eliminación. Mod Owner gestiona solo su equipo; Admin gestiona todos
- **Equipos**: tarjetas por equipo mostrando owner, mod temporales y participantes con avatares; Admin puede crear equipos nuevos
- **Admin Panel**: tabla global de usuarios con filtro por equipo; cambio de rol inline con dropdown; al promover nuevo Owner, el anterior pasa a Temporal automáticamente
- **Fix Kanban**: `mergedRef` booleano — el botón 📎 lo activa antes de hacer merge; el `onDrop` de columna lo comprueba y aborta si ya fue gestionado

### v6 — QA completo + responsive + eliminación de Jira
- **Jira eliminado**: botón "Crear tickets Jira" retirado del Resumen
- **Responsive global**: todas las grids fijas convertidas a `repeat(auto-fit, minmax(...))`:
  - Votación: `1fr 1fr` → una columna en móvil
  - Kanban: 4 columnas fijas → auto-fit
  - Crear tarjetas, Discusión, Dashboard stats, Resumen stats, Equipos: todos responsive
- **Tablas con scroll horizontal**: Usuarios y Admin Panel envueltos en `overflowX: auto` con `minWidth` para evitar desbordamiento en pantallas pequeñas
- **Formulario crear usuario**: grid de 5 columnas fijas → auto-fit
- **Historial sidebar**: ancho fijo → `clamp(160px, 30%, 250px)`
- **Copiar accionables**: botón funcional — copia texto real al portapapeles con feedback visual ✓; "Exportar PDF" llama a `window.print()`
- **Admin Panel**: estado vacío cuando el filtro de equipo no devuelve usuarios
- **Build verificado**: `npm run build` limpio sin errores (216KB bundle / 62KB gzip)
- **SPEC_CONTEXT.md**: añadido a la raíz del repositorio

### v7 — Bug fixes QA ronda 2 + nuevas funcionalidades
**Bugs corregidos:**
- **Historial pantalla negra**: `RetroDetail` era función de módulo pero accedía a `usersProp` del scope padre; ahora recibe `users` como prop explícita
- **Admin no puede gestionar retro**: rol `admin` añadido a `canMod` — puede crear y liderar retros
- **Nueva Retro no navega**: `onNuevaRetro` no llegaba al Sidebar en ciertos estados; corregido el binding en App
- **Sin salida desde retro**: botón ✕ Salir siempre visible, llama a `onFinish` que resetea `inRetro`
- **Export no funciona**: CSV real implementado con `Blob` + `URL.createObjectURL`; PDF usa `window.print()`
- **No se puede quitar rol admin si es el último**: guard en `AdminPanel` — bloquea el dropdown si quedaría 0 admins
- **No se pueden editar usuarios ni contraseñas**: fila inline con modo edición (nombre, email, rol) + botón "Resetear contraseña" que genera nueva y la muestra
- **No se pueden editar equipos**: `Equipos` tiene panel de añadir miembro por email y botón eliminar por miembro

**Nuevas funcionalidades:**
- **Historial agrupado por equipo**: la vista Historial muestra secciones colapsables por equipo con sus retros
- **Pre-retro: historial del equipo**: en el Lobby, botón "📚 Ver historial del equipo" abre panel lateral con las retros anteriores del mismo equipo
- **Pre-retro: accionables pendientes**: en el Lobby, botón "🎯 Accionables pendientes" muestra los accionables abiertos de la última retro del equipo para revisarlos antes de empezar
