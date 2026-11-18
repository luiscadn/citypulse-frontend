"use client";

import { logoutAction } from "../actions/auth.actions";

/**
 * Hook fachada para el cierre de sesión del usuario.
 *
 * - **¿Qué hace?**: Expone la función `logoutAction` para ser invocada por botones o menús interactivos del cliente.
 * - **¿Cómo interactúa con el sistema en general?**: Utilizada en el menú de navegación del usuario (`SessionMenu`).
 * - **¿Cuál es su importancia?**: Proporciona un punto de acceso desacoplado para invalidar la sesión y limpiar cookies.
 */
export function useLogout() {
  return { logout: logoutAction };
}
