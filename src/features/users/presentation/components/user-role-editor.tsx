/**
 * @file user-role-editor.tsx
 * @description Client Component interactivo para la asignación granular de Roles de Usuario.
 * Permite marcar/desmarcar casillas de roles y guardar cambios con retroalimentación inline accesible.
 */

"use client";

import { useState, useTransition } from "react";
import { RoleName } from "@/shared/domain/enums";
import { Alert, Button } from "@/shared/presentation/components";
import { ALL_ROLES } from "../../domain/rules/roles";
import { assignRolesAction } from "../actions/admin-users.actions";
import { ROLE_LABEL } from "../role-labels";

/** Comprueba si dos listas de roles contienen exactamente los mismos elementos. */
const sameRoles = (a: readonly RoleName[], b: readonly RoleName[]) =>
  a.length === b.length && a.every((role) => b.includes(role));

/**
 * Editor interactivo de roles para un usuario en el panel administrativo.
 *
 * - **¿Qué hace?**:
 *   Muestra casillas de verificación para cada rol del sistema (`USER`, `OWNER`, `ADMIN`).
 *   Si el usuario que se edita es el propio administrador en sesión (`isSelf`), bloquea la casilla ADMIN
 *   para evitar la auto-democión accidental. Al guardar, invoca `assignRolesAction` en una transición React y
 *   despliega el resultado (éxito o error) en un `Alert` en línea sin diálogos emergentes.
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Incrustado en cada fila de usuario dentro de `UserRolesAdmin`.
 *
 * - **¿Cuál es su importancia?**:
 *   Brinda una experiencia de usuario segura y libre de alertas bloqueantes (`window.alert`),
 *   impidiendo guardar estados vacíos o que el administrador pierda sus propios privilegios.
 */
export function UserRoleEditor({
  userId,
  userName,
  initialRoles,
  isSelf,
}: {
  userId: number;
  userName: string;
  initialRoles: readonly RoleName[];
  /** Indica si la cuenta administrada corresponde a quien está en la sesión actual */
  isSelf: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState<readonly RoleName[]>(initialRoles);
  const [selected, setSelected] = useState<readonly RoleName[]>(initialRoles);
  const [feedback, setFeedback] = useState<{ tone: "success" | "danger"; text: string } | null>(null);

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

  return (
    <div className="flex flex-col gap-3">
      <fieldset className="flex flex-col gap-2" disabled={pending}>
        <legend className="sr-only">Roles de {userName}</legend>
        {ALL_ROLES.map((role) => {
          const lockedAdmin = isSelf && role === RoleName.ADMIN;
          return (
            <label
              key={role}
              className="flex cursor-pointer items-start gap-2.5 text-sm has-disabled:cursor-not-allowed has-disabled:opacity-70"
            >
              <input
                type="checkbox"
                checked={selected.includes(role)}
                disabled={lockedAdmin}
                onChange={() => toggle(role)}
                className="mt-0.5 size-4 accent-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-ring"
              />
              <span className="flex flex-col">
                <span className="font-semibold text-ink">{ROLE_LABEL[role].label}</span>
                <span className="text-xs text-ink-muted">
                  {lockedAdmin ? "No puedes quitarte tu propio rol de administrador." : ROLE_LABEL[role].description}
                </span>
              </span>
            </label>
          );
        })}
      </fieldset>

      {selected.length === 0 && (
        <p className="text-xs font-medium text-danger-strong">Cada usuario necesita al menos un rol.</p>
      )}
      {feedback && <Alert tone={feedback.tone}>{feedback.text}</Alert>}

      <div>
        <Button size="sm" onClick={save} loading={pending} disabled={!dirty || selected.length === 0}>
          Guardar roles
        </Button>
      </div>
    </div>
  );
}
