// src/shared/domain/enums.ts

/**
 * Enumeración RoleName: Roles de usuario soportados en la plataforma.
 *
 * - **¿Qué hace?**: Define los tres roles de acceso del sistema:
 *   - `USER`: Usuario estándar que puede explorar eventos, confirmar asistencia, interactuar con amigos y enviar invitaciones.
 *   - `OWNER`: Propietario de establecimientos (venues) que puede registrar y administrar sus propios locales comerciales y eventos vinculados.
 *   - `ADMIN`: Administrador global del sistema con permisos para gestionar usuarios, roles, zonas y moderar eventos/lugares.
 * - **¿Cómo interactúa con el sistema en general?**: Debe coincidir estrictamente con el backend (`src/common/enums.ts`).
 *   Se utiliza en la entidad `AuthUser`, en la validación de rutas en el proxy (`proxy.ts`), en el control de acceso en Server Actions,
 *   y en componentes de UI con renderizado condicional según privilegios (`admin-section-card.tsx`, `user-role-editor.tsx`).
 * - **¿Cuál es su importancia?**: Proporciona seguridad de tipos en tiempo de compilación para el control de acceso basado en roles (RBAC).
 *   Evita el uso de cadenas de texto mágicas ("magic strings") propensas a errores tipográficos y facilita la sincronización de contratos con el backend.
 */
export enum RoleName {
  USER = 'USER',
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
}

/**
 * Enumeración EventOrigin: Procedencia u origen de la creación de un evento.
 *
 * - **¿Qué hace?**: Indica si el evento fue propuesto/reportado por un usuario convencional de la comunidad (`REPORTE_USUARIO`)
 *   o si fue creado formalmente por una entidad autorizada u organizador oficial (`OFICIAL`).
 * - **¿Cómo interactúa con el sistema en general?**: Se utiliza en los modelos de eventos (`Event`), formularios de creación (`EventForm`),
 *   mapeadores de infraestructura (`event.mapper.ts`) y filtros de búsqueda de eventos.
 * - **¿Cuál es su importancia?**: Permite al sistema aplicar flujos de moderación diferenciados; los reportes de usuarios típicamente
 *   requieren revisión y confirmación administrativa antes de ser promovidos a eventos confirmados.
 */
export enum EventOrigin {
  REPORTE_USUARIO = 'REPORTE_USUARIO',
  OFICIAL = 'OFICIAL',
}

/**
 * Enumeración EventStatus: Estados del ciclo de vida de un evento.
 *
 * - **¿Qué hace?**: Modela los estados posibles por los que transita un evento:
 *   - `REPORTADO`: Evento registrado por un usuario pero pendiente de validación.
 *   - `CONFIRMADO`: Evento verificado y aprobado para visualización pública.
 *   - `RECHAZADO`: Evento desestimado por los moderadores o administradores.
 *   - `CANCELADO`: Evento previamente confirmado que ha sido dado de baja por su organizador.
 * - **¿Cómo interactúa con el sistema en general?**: Influye en la visibilidad en el listado de eventos (`EventList`),
 *   en las acciones permitidas (cancelación, reporte) y en las insignias de estado visuales en la interfaz.
 * - **¿Cuál es su importancia?**: Garantiza consistencia en la máquina de estados de los eventos, controlando qué acciones
 *   puede realizar un usuario o administrador sobre un evento en un momento determinado.
 */
export enum EventStatus {
  REPORTADO = 'REPORTADO',
  CONFIRMADO = 'CONFIRMADO',
  RECHAZADO = 'RECHAZADO',
  CANCELADO = 'CANCELADO',
}

/**
 * Enumeración EventVisibility: Nivel de privacidad y exposición de un evento.
 *
 * - **¿Qué hace?**: Clasifica el evento como `PUBLICO` (visible para toda la comunidad) o `PRIVADO` (accesible únicamente por invitación o asistentes confirmados).
 * - **¿Cómo interactúa con el sistema en general?**: Es evaluado en el backend y en las reglas de dominio para determinar si un evento
 *   aparece en la cartelera general o requiere invitaciones directas (`invitation.use-case.ts`).
 * - **¿Cuál es su importancia?**: Protege la privacidad de reuniones cerradas y restringe el acceso no autorizado a información sensible de eventos privados.
 */
export enum EventVisibility {
  PUBLICO = 'PUBLICO',
  PRIVADO = 'PRIVADO',
}
