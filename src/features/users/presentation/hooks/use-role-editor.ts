"use client";

import { useState, useTransition } from "react";
import type { RoleName } from "@/shared/domain/enums";
import { assignRolesAction } from "../actions/admin-users.actions";

/**
 * Comprueba si dos listas de roles contienen exactamente los mismos elementos.
 *
 * - **¿Qué hace?**: Compara la longitud de ambos arreglos y verifica que cada rol del primero exista en el segundo.
 * - **¿Cómo interactúa con el sistema en general?**: Usada en `useRoleEditor` para calcular la propiedad reactiva `dirty`.
 * - **¿Cuál es su importancia?**: Evita llamadas de red redundantes deshabilitando el botón de guardar si no hay cambios.
 */
const sameRoles = (a: readonly RoleName[], b: readonly RoleName[]) =>
  a.length === b.length && a.every((role) => b.includes(role));

export interface RoleFeedback {
  tone: "success" | "danger";
  text: string;
}

/**
 * Hook fachada del editor interactivo de roles de usuario.
 *
 * - **¿Qué hace?**: Administra la selección actual de roles (`selected`), los roles persistidos (`saved`),
 *   el cálculo de dirty checking (`dirty`), los mensajes de retroalimentación (`feedback`) y la ejecución asíncrona (`save`).
 * - **¿Cómo interactúa con el sistema en general?**: Consumido por el componente `UserRoleEditor` en la vista de administración de usuarios.
 * - **¿Cuál es su importancia?**: Encapsula el ciclo de vida de mutación de roles y desacopla la UI de la Server Action subyacente.
 */
export function useRoleEditor(userId: number, initialRoles: readonly RoleName[]) {
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState<readonly RoleName[]>(initialRoles);
  const [selected, setSelected] = useState<readonly RoleName[]>(initialRoles);
  const [feedback, setFeedback] = useState<RoleFeedback | null>(null);

  const dirty = !sameRoles(selected, saved);

  function toggle(role: RoleName) {
    setFeedback(null);
    setSelected((current) =>
      current.includes(role) ? current.filter((r) => r !== role) : [...current, role],
    );
  }

  function save() {
    setFeedback(null);
    startTransition(async () => {
      const result = await assignRolesAction(userId, [...selected]);
      if (result.ok) {
        setSaved(selected);
        setFeedback({ tone: "success", text: "Roles actualizados." });
      } else {
        setFeedback({ tone: "danger", text: result.error });
      }
    });
  }

  return { selected, dirty, feedback, pending, toggle, save };
}
