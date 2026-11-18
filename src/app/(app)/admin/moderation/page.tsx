import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/features/auth/infrastructure/session/get-current-user";
import { canModerateEvents } from "@/features/events/domain/rules/event-permissions";
import { ModerationQueue } from "@/features/events/presentation/components/moderation-queue";
import { Container, PageHeader } from "@/shared/presentation/components";

export const metadata: Metadata = { title: "Moderación de reportes" };

/**
 * Página Administrativa de la Cola de Moderación de Reportes Comunitarios
 *
 * - **¿Qué hace?**: Verifica en el servidor la sesión del usuario (`getCurrentUser()`) y evalúa sus permisos
 *   con `canModerateEvents(user)`. Si no hay sesión, redirige a `/login?from=...`; si no tiene rol `ADMIN`,
 *   devuelve `notFound()` (404) para no divulgar la existencia de la ruta. Renderiza `ModerationQueue`.
 * - **¿Cómo interactúa con el sistema en general?**: Es la vista raíz del módulo de moderación en el App Router (`/admin/moderation`).
 *   Durante su carga asíncrona, Next.js monta automáticamente `loading.tsx`.
 * - **¿Cuál es su importancia?**: Implementa control de acceso basado en roles (RBAC) a nivel de página (Server Component),
 *   asegurando que únicamente los administradores autorizados puedan revisar y procesar reportes ciudadanos.
 */
export default async function ModerationPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?from=/admin/moderation");
  if (!canModerateEvents(user)) notFound();

  return (
    <Container className="flex flex-col gap-6 pb-12">
      <PageHeader
        eyebrow="Administración"
        title="Moderación de reportes"
        description="Confirma los reportes que sus evidencias respaldan o recházalos con un motivo."
        className="pb-0"
      />
      <ModerationQueue />
    </Container>
  );
}
