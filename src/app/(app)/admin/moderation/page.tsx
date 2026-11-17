import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/features/auth/infrastructure/session/get-current-user";
import { canModerateEvents } from "@/features/events/domain/rules/event-permissions";
import { ModerationQueue } from "@/features/events/presentation/components/moderation-queue";
import { Container, PageHeader } from "@/shared/presentation/components";

export const metadata: Metadata = { title: "Moderación de reportes" };

/**
 * Cola de reportes por revisar (solo ADMIN). Mientras carga se muestra loading.tsx,
 * si falla error.tsx y si no eres ADMIN, not-found.
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
