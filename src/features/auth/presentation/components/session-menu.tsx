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
      <span className="flex items-center gap-2">
        <span
          aria-hidden
          className="grid size-8 place-items-center rounded-full bg-primary-soft text-sm font-bold text-primary-strong uppercase"
        >
          {user.email.charAt(0)}
        </span>
        <span className="hidden text-sm font-medium text-ink sm:inline">{user.email}</span>
      </span>
      <LogoutButton />
    </div>
  );
}
