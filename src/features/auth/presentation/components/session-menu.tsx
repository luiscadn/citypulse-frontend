/**
 * @file session-menu.tsx
 * @description Client Component para el menú de estado de sesión en la barra de navegación superior.
 */

"use client";

import Link from "next/link";
import { RoleName } from "@/shared/domain/enums";
import { ButtonLink } from "@/shared/presentation/components";
import { useSession } from "../hooks/use-session";
import { LogoutButton } from "./logout-button";

/**
 * Menú contextual de usuario en el encabezado.
 *
 * - **¿Qué hace?**:
 *   Consume la sesión a través de `useSession()`. Si el usuario no está autenticado, muestra un botón hacia `/login`.
 *   Si está autenticado, muestra enlace a `/admin/users` (si posee rol ADMIN), enlace con avatar y correo hacia `/profile`,
 *   y el botón de cierre de sesión `LogoutButton`.
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Renderizado en `AppNav` dentro de un `<Suspense>`.
 *
 * - **¿Cuál es su importancia?**:
 *   Ofrece acceso directo a las áreas de perfil y administración según los privilegios del usuario conectado.
 */
export function SessionMenu() {
  const { user } = useSession();

  if (!user) {
    return (
      <ButtonLink href="/login" size="sm">
        Iniciar sesión
      </ButtonLink>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {user.roles.includes(RoleName.ADMIN) && (
        <>
          <ButtonLink href="/admin/moderation" variant="ghost" size="sm" className="hidden md:inline-flex">
            Moderación
          </ButtonLink>
          <ButtonLink href="/admin/users" variant="ghost" size="sm">
            Roles
          </ButtonLink>
        </>
      )}
      <Link
        href="/profile"
        aria-label="Mi perfil"
        className="flex items-center gap-2 rounded-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-ring"
      >
        <span
          aria-hidden
          className="grid size-8 place-items-center rounded-full bg-primary-soft text-sm font-bold text-primary-strong uppercase"
        >
          {user.email.charAt(0)}
        </span>
        <span className="hidden text-sm font-medium text-ink hover:text-primary-strong sm:inline">
          {user.email}
        </span>
      </Link>
      <LogoutButton />
    </div>
  );
}
