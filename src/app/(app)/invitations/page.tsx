import type { Metadata } from "next";
import { Suspense } from "react";
import { invitationContainer } from "@/features/invitation/di/invitation.container";
import { InvitationInbox } from "@/features/invitation/presentation/components/invitation-inbox";
import { InvitationProvider } from "@/features/invitation/presentation/context/invitation-context";
import { Container, PageHeader, Spinner } from "@/shared/presentation/components";

/** Metadata para la vista de buzón de invitaciones */
export const metadata: Metadata = { title: "Invitaciones" };

/**
 * Componente InvitationsPage: Vista de la bandeja de entrada de invitaciones a eventos.
 *
 * - **¿Qué hace?**: Dispara la carga de invitaciones pendientes (`getPendingInvitationsUseCase.execute()`) como una promesa,
 *   la suministra a través de `InvitationProvider` y renderiza el buzón interactivo `InvitationInbox` dentro de un límite `<Suspense>`.
 * - **¿Cómo interactúa con el sistema en general?**: Orquesta el caso de uso de invitaciones pendientes con el contexto de React
 *   `InvitationContext`. Desde `InvitationInbox`, el usuario puede aceptar o declinar invitaciones, lo que repercute en la asistencia
 *   a eventos mediante Server Actions.
 * - **¿Cuál es su importancia?**: Permite que los usuarios interactúen con invitaciones privadas a eventos sociales
 *   sin bloquear la navegación inicial gracias a Streaming SSR.
 */
export default function InvitationsPage() {
  // Sin await: la bandeja espera las invitaciones dentro de su <Suspense>
  const pendingPromise = invitationContainer.getPendingInvitationsUseCase.execute();

  return (
    <InvitationProvider pendingPromise={pendingPromise}>
      <Container className="flex flex-col gap-6 pb-12">
        <PageHeader
          title="Invitaciones"
          description="Responde las invitaciones a eventos que te enviaron tus amigos."
          className="pb-0"
        />
        {/* Los datos dependen de la petición: van en Suspense para no bloquear el resto de la página */}
        <Suspense
          fallback={
            <div className="grid h-32 place-items-center text-primary">
              <Spinner />
            </div>
          }
        >
          <InvitationInbox />
        </Suspense>
      </Container>
    </InvitationProvider>
  );
}
