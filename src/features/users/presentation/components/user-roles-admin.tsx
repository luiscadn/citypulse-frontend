/**
 * @file user-roles-admin.tsx
 * @description Server Component para la pantalla de Administración de Usuarios y Roles.
 * Carga los usuarios directamente desde el backend y delega la gestión interactiva a `UserRoleEditor`.
 */

import { notFound } from "next/navigation";
import { Badge, Card, EmptyState } from "@/shared/presentation/components";
import { usersContainer } from "../../di/users.container";
import { canAssignRoles } from "../../domain/rules/permissions";
import { UserRoleEditor } from "./user-role-editor";

/**
 * Componente de servidor que muestra el listado completo de usuarios y sus controles de roles.
 *
 * - **¿Qué hace?**:
 *   Consulta al usuario solicitante directamente desde la base de datos para asegurar que los roles
 *   estén actualizados en tiempo real; si no cuenta con rol ADMIN (`canAssignRoles`), interrumpe respondiendo
 *   `notFound()`. Luego obtiene todos los usuarios (`listUsers`) y renderiza la lista con avatares iniciales,
 *   insignias de estado ("Tú", "Inactivo") y el editor interactivo `UserRoleEditor`.
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Es el componente principal de la ruta protegida `/admin/users`. Conecta los casos de uso de usuarios con la vista de administración.
 *
 * - **¿Cuál es su importancia?**:
 *   Proporciona el panel de gobierno y autorización central de la plataforma, impidiendo que usuarios no autorizados sospechen la existencia del panel al devolver 404.
 */
export async function UserRolesAdmin({ requesterId }: { requesterId: number }) {
  const me = await usersContainer.getUser(requesterId);
  if (!canAssignRoles({ id: me.id, email: me.email, username: me.username, roles: me.roles })) notFound();

  const users = await usersContainer.listUsers();

  if (users.length === 0) {
    return <EmptyState title="Aún no hay usuarios" description="Cuando alguien se registre aparecerá aquí." />;
  }

  return (
    <Card>
      <ul className="divide-y divide-line">
        {users.map((user) => (
          <li key={user.id} className="flex flex-col gap-4 px-5 py-4 md:flex-row md:items-start md:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <span
                aria-hidden
                className="grid size-10 shrink-0 place-items-center rounded-full bg-primary-soft text-sm font-bold text-primary-strong uppercase"
              >
                {user.fullName.charAt(0)}
              </span>
              <div className="flex min-w-0 flex-col gap-0.5">
                <p className="flex flex-wrap items-center gap-2 text-sm font-semibold text-ink">
                  <span className="truncate">{user.fullName}</span>
                  {user.id === me.id && <Badge tone="primary">Tú</Badge>}
                  {!user.isActive && <Badge tone="warning">Inactivo</Badge>}
                </p>
                <p className="truncate text-xs text-ink-muted">
                  @{user.username} · {user.email}
                </p>
              </div>
            </div>

            <UserRoleEditor
              userId={user.id}
              userName={user.fullName}
              initialRoles={user.roles}
              isSelf={user.id === me.id}
            />
          </li>
        ))}
      </ul>
    </Card>
  );
}
