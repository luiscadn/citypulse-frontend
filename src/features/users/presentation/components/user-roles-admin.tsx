import { notFound } from "next/navigation";
import { Badge, Card, EmptyState } from "@/shared/presentation/components";
import { usersContainer } from "../../di/users.container";
import { canAssignRoles } from "../../domain/rules/permissions";
import { UserRoleEditor } from "./user-role-editor";

/**
 * Listado de usuarios con su editor de roles. Solo para ADMIN: para cualquier otra
 * persona la ruta responde "no encontrada" (el backend también lo rechaza con 403).
 */
export async function UserRolesAdmin({ requesterId }: { requesterId: number }) {
  // Se lee de la base (no del JWT) para que un cambio de rol aplique de inmediato
  const me = await usersContainer.getUser(requesterId);
  if (!canAssignRoles({ id: me.id, email: me.email, username: me.username, roles: me.roles })) notFound();

  const users = await usersContainer.listUsers();

  if (users.length === 0) {
    return <EmptyState title="Aún no hay usuarios" description="Cuando alguien se registre aparecerá aquí." />;
  }

  return (
    <Card>
      <ul className="stagger divide-y divide-line">
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