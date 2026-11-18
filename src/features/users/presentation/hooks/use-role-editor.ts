"use client";

import { useState, useTransition } from "react";
import type { RoleName } from "@/shared/domain/enums";
import { assignRolesAction } from "../actions/admin-users.actions";

const sameRoles = (a: readonly RoleName[], b: readonly RoleName[]) =>
  a.length === b.length && a.every((role) => b.includes(role));

export interface RoleFeedback {
  tone: "success" | "danger";
  text: string;
}

/**
 * Hook fachada del editor de roles: guarda los roles elegidos y los guardados,
 * y llama a la acción del servidor que los asigna.
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
