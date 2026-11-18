import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/features/auth/infrastructure/session/get-current-user";
import { UserRolesAdmin } from "@/features/users/presentation/components/user-roles-admin";
import { Container, PageHeader } from "@/shared/presentation/components";

/** Metadata para el panel de administración de usuarios */
export const metadata: Metadata = { title: "Usuarios y roles" };

/**
 * Componente AdminUsersPage: Vista de administración de roles de usuario.
 *
 * - **¿Qué hace?**: Verifica en el servidor la existencia de sesión mediante `getCurrentUser()`.
 *   Si no hay sesión redirige al login con parámetro de retorno (`/login?from=/admin/users`).
 *   Renderiza el encabezado institucional y el componente administrativo `UserRolesAdmin`, pasando el ID del solicitante.
 * - **¿Cómo interactúa con el sistema en general?**: Interactúa con la infraestructura de sesión de Auth
 *   y monta `UserRolesAdmin` del feature de usuarios, el cual a su vez consulta `usersContainer.listUsersUseCase`
 *   y ejecuta el control de acceso en el backend (solo administradores).
 * - **¿Cuál es su importancia?**: Punto central de gobierno de identidades del sistema. Protege la vista desde el servidor
 *   y orquesta la administración de permisos (USER, OWNER, ADMIN).
 */
export default async function AdminUsersPage() {
  const session = await getCurrentUser();
  if (!session) redirect("/login?from=/admin/users");

  return (
    <Container className="flex flex-col gap-6 pb-12">
      <PageHeader
        eyebrow="Administración"
        title="Usuarios y roles"
        description="Define qué puede hacer cada persona en CityPulse. Los cambios aplican de inmediato."
        className="pb-0"
      />
      <UserRolesAdmin requesterId={session.id} />
    </Container>
  );
}
