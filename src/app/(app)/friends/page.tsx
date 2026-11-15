import type { Metadata } from "next";
import { Suspense } from "react";
import { friendshipContainer } from "@/features/friendship/di/friendship.container";
import { FriendSearch } from "@/features/friendship/presentation/components/friend-search";
import { FriendshipOverview } from "@/features/friendship/presentation/components/friendship-overview";
import { FriendshipProvider } from "@/features/friendship/presentation/context/friendship-context";
import { Container, PageHeader, Spinner } from "@/shared/presentation/components";

export const metadata: Metadata = { title: "Amigos" };

function SectionSpinner() {
  return (
    <div className="grid h-32 place-items-center text-primary">
      <Spinner />
    </div>
  );
}

export default function FriendsPage({ searchParams }: PageProps<"/friends">) {
  // Sin await: el listado y la búsqueda esperan el resumen dentro de sus <Suspense>
  const overviewPromise = friendshipContainer.getFriendshipOverviewUseCase.execute();

  return (
    <FriendshipProvider overviewPromise={overviewPromise}>
      <Container className="flex flex-col gap-6 pb-12">
        <PageHeader
          title="Amigos"
          description="Busca personas, responde solicitudes y mira a tus amigos."
          className="pb-0"
        />
        {/* Los datos dependen de la petición: van en Suspense para no bloquear el resto de la página */}
        <Suspense fallback={<SectionSpinner />}>
          <FriendSearch searchParams={searchParams} />
        </Suspense>
        <Suspense fallback={<SectionSpinner />}>
          <FriendshipOverview />
        </Suspense>
      </Container>
    </FriendshipProvider>
  );
}
