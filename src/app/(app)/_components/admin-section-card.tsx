import { getCurrentUser } from "@/features/auth/infrastructure/session/get-current-user";
import { RoleName } from "@/shared/domain/enums";
import { Badge } from "@/shared/presentation/components";
import { SectionCard } from "./section-card";

/** Accesos de administración (moderación y roles): solo aparecen si la sesión es de un ADMIN. */
export async function AdminSectionCard() {
  const user = await getCurrentUser();
  if (!user?.roles.includes(RoleName.ADMIN)) return null;

  return (
    <>
      <SectionCard
        href="/admin/moderation"
        title="Moderación"
        description="Confirma o rechaza los reportes ciudadanos con sus evidencias."
        badge={<Badge tone="primary">Admin</Badge>}
      />
      <SectionCard
        href="/admin/users"
        title="Usuarios y roles"
        description="Asigna roles de usuario, propietario o administrador."
        badge={<Badge tone="primary">Admin</Badge>}
      />
    </>
  );
}