"use client";

import { RoleName } from "@/shared/domain/enums";
import { Alert, Button } from "@/shared/presentation/components";
import { ALL_ROLES } from "../../domain/rules/roles";
import { useRoleEditor } from "../hooks/use-role-editor";
import { ROLE_LABEL } from "../role-labels";

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
  const { selected, dirty, feedback, pending, toggle, save } = useRoleEditor(userId, initialRoles);

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