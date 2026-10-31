import Link from "next/link";
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
      <Link href="/login" className="text-sm font-medium hover:underline">
        Iniciar sesión
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="hidden text-sm text-zinc-600 sm:inline dark:text-zinc-400">{user.email}</span>
      <LogoutButton />
    </div>
  );
}
