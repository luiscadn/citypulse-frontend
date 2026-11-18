import type { ReactNode } from "react";
import type { FriendUser } from "../../domain/entities/friendship";

/**
 * Componente FriendUserRow: Fila estándar de usuario para listados de amistades.
 *
 * - **¿Qué hace?**: Renderiza un elemento de lista (`<li>`) con un avatar circular mostrando la inicial
 *   del nombre completo en mayúscula, el nombre completo (`fullName`), el nombre de usuario (`@username`),
 *   y un espacio a la derecha (`children`) para acciones o insignias complementarias.
 * - **¿Cómo interactúa con el sistema en general?**: Es el componente compartido utilizado por `FriendSearchResults`
 *   y `FriendshipOverview` para renderizar amigos, solicitudes entrantes y solicitudes salientes.
 * - **¿Cuál es su importancia?**: Provee una presentación homogénea, accesible y atractiva para perfiles de usuario
 *   en todo el módulo social.
 */
export function FriendUserRow({ user, children }: { user: FriendUser; children?: ReactNode }) {
  return (
    <li className="flex flex-wrap items-center justify-between gap-3 px-5 py-3">
      <div className="flex min-w-0 items-center gap-3">
        <span
          aria-hidden
          className="grid size-9 shrink-0 place-items-center rounded-full bg-primary-soft text-sm font-bold text-primary-strong uppercase"
        >
          {user.fullName.charAt(0)}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-ink">{user.fullName}</p>
          <p className="truncate text-sm text-ink-muted">@{user.username}</p>
        </div>
      </div>
      {children}
    </li>
  );
}
