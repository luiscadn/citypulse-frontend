import { getCurrentUser } from "@/features/auth/infrastructure/session/get-current-user";
import { RoleName } from "@/shared/domain/enums";
import { Badge } from "@/shared/presentation/components";
import { SectionCard } from "./section-card";

/** Acceso a la administración de roles: solo aparece si la sesión es de un ADMIN. */
export async function AdminSectionCard() {
  const user = await getCurrentUser();
  if (!user?.roles.includes(RoleName.ADMIN)) return null;

  return (
    <SectionCard
      href="/admin/users"
      title="Usuarios y roles"
      description="Asigna roles de usuario, propietario o administrador."
      badge={<Badge tone="primary">Admin</Badge>}
    />
  );
}