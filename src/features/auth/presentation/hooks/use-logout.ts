"use client";

import { logoutAction } from "../actions/auth.actions";

/** Hook fachada del cierre de sesión: entrega la acción que borra la sesión. */
export function useLogout() {
  return { logout: logoutAction };
}
