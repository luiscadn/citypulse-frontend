import type { Metadata } from "next";
import { Suspense } from "react";
import { invitationContainer } from "@/features/invitation/di/invitation.container";
import { InvitationInbox } from "@/features/invitation/presentation/components/invitation-inbox";
import { InvitationProvider } from "@/features/invitation/presentation/context/invitation-context";
import { Container, PageHeader, Spinner } from "@/shared/presentation/components";

export const metadata: Metadata = { title: "Invitaciones" };

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
