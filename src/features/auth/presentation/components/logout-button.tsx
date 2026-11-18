/**
 * @file logout-button.tsx
 * @description Componente para el botón de cierre de sesión seguro.
 */

import { Button } from "@/shared/presentation/components";
import { logoutAction } from "../actions/auth.actions";

/**
 * Botón semántico dentro de un formulario para invocar el cierre de sesión.
 *
 * - **¿Qué hace?**: Renderiza un botón secundario que somete una petición POST directa a la Server Action `logoutAction`.
 * - **¿Cómo interactúa con el sistema en general?**: Incrustado en `SessionMenu` en el encabezado principal de la aplicación.
 * - **¿Cuál es su importancia?**: Proporciona una forma estándar y segura de desautenticarse, funcionando incluso si JavaScript estuviera deshabilitado.
 */
export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <Button type="submit" variant="secondary" size="sm">
        Cerrar sesión
      </Button>
    </form>
  );
}
