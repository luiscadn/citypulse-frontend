import type { Metadata } from "next";
import { Suspense } from "react";
import { FriendshipOverview } from "@/features/friendship/presentation/components/friendship-overview";
import { Container, PageHeader, Spinner } from "@/shared/presentation/components";

export const metadata: Metadata = { title: "Amigos" };

export default function FriendsPage() {
  return (
    <Container className="pb-12">
      <PageHeader title="Amigos" description="Tus amigos y las solicitudes de amistad pendientes." />
      {/* Los datos dependen de la sesión: van en Suspense para no bloquear el resto de la página */}
      <Suspense
        fallback={
          <div className="grid h-64 place-items-center text-primary">
            <Spinner />
          </div>
        }
      >
        <FriendshipOverview />
      </Suspense>
    </Container>
  );
}
