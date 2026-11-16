import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/features/auth/infrastructure/session/get-current-user";
import { UserRolesAdmin } from "@/features/users/presentation/components/user-roles-admin";
import { Container, PageHeader } from "@/shared/presentation/components";

export const metadata: Metadata = { title: "Usuarios y roles" };

/**
 * Administración de roles (solo ADMIN). Lee la sesión y llama al backend: mientras
 * carga se muestra loading.tsx, si falla error.tsx y si no eres ADMIN, not-found.
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