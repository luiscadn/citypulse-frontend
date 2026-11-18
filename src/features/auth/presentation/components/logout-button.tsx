"use client";

import { Button } from "@/shared/presentation/components";
import { useLogout } from "../hooks/use-logout";

/**
 * Botón semántico dentro de un formulario para invocar el cierre de sesión.
 *
 * - **¿Qué hace?**: Renderiza un botón secundario que somete una petición POST directa a la Server Action `logoutAction`.
 * - **¿Cómo interactúa con el sistema en general?**: Incrustado en `SessionMenu` en el encabezado principal de la aplicación.
 * - **¿Cuál es su importancia?**: Proporciona una forma estándar y segura de desautenticarse, funcionando incluso si JavaScript estuviera deshabilitado.
 */
export function LogoutButton() {
  const { logout } = useLogout();
  return (
    <form action={logout}>
      <Button type="submit" variant="secondary" size="sm">
        Cerrar sesión
      </Button>
    </form>
  );
}
