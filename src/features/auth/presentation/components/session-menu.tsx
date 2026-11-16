import Link from "next/link";
import { RoleName } from "@/shared/domain/enums";
import { ButtonLink } from "@/shared/presentation/components";
import { getCurrentUser } from "../../infrastructure/session/get-current-user";
import { LogoutButton } from "./logout-button";

/**
 * Correo del usuario + botón de cerrar sesión, o enlace a /login.
 * Lee la cookie de sesión: con Cache Components debe ir dentro de <Suspense>.
 */
export async function SessionMenu() {
  const user = await getCurrentUser();

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
        <ButtonLink href="/admin/users" variant="ghost" size="sm">
          Roles
        </ButtonLink>
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
