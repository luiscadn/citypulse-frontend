import { getCurrentUser } from "@/features/auth/infrastructure/session/get-current-user";
import { RoleName } from "@/shared/domain/enums";
import { Badge } from "@/shared/presentation/components";
import { SectionCard } from "./section-card";

/**
 * Componente Server Component AdminSectionCard: Tarjeta condicional de administración.
 *
 * - **¿Qué hace?**: Consulta asíncronamente en el servidor la sesión del usuario actual (`getCurrentUser()`).
 *   Si el usuario no posee el rol `ADMIN`, retorna `null` (no renderiza nada). Si es administrador,
 *   renderiza la tarjeta `SectionCard` que conduce a `/admin/users` con una insignia distintiva "Admin".
 * - **¿Cómo interactúa con el sistema en general?**: Se monta en la pantalla principal (`page.tsx`) dentro de `<Suspense>`.
 * - **¿Cuál es su importancia?**: Implementa seguridad a nivel de UI basada en roles (RBAC). Al ser un Server Component,
 *   la verificación de roles ocurre en el servidor y no envía código de administración ni enlaces sensibles a clientes no autorizados.
 */
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