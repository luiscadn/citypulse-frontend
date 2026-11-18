import type { Metadata } from "next";
import { Suspense } from "react";
import { friendshipContainer } from "@/features/friendship/di/friendship.container";
import { FriendSearch } from "@/features/friendship/presentation/components/friend-search";
import { FriendshipOverview } from "@/features/friendship/presentation/components/friendship-overview";
import { FriendshipProvider } from "@/features/friendship/presentation/context/friendship-context";
import { Container, PageHeader, Spinner } from "@/shared/presentation/components";

/** Metadata para la pantalla de amigos y red social */
export const metadata: Metadata = { title: "Amigos" };

/** Spinner de carga visual para subsecciones de la pantalla de amigos */
function SectionSpinner() {
  return (
    <div className="grid h-32 place-items-center text-primary">
      <Spinner />
    </div>
  );
}

/**
 * Componente FriendsPage: Vista principal del módulo de amistades y red social.
 *
 * - **¿Qué hace?**: Inicia la carga del resumen de amistades (`getFriendshipOverviewUseCase.execute()`) como una promesa
 *   sin bloquear con `await`, proveyéndola mediante `FriendshipProvider` al árbol de componentes.
 *   Renderiza de forma concurrente el buscador de personas (`FriendSearch`) y el resumen de amistades (`FriendshipOverview`),
 *   cada uno envuelto en su propio `<Suspense>`.
 * - **¿Cómo interactúa con el sistema en general?**: Conecta la capa de presentación de amistades (`Friendship`) con el contenedor
 *   de dependencias (`friendshipContainer`). Recibe `searchParams` para filtrar candidatos de amistad según el término tecleado.
 * - **¿Cuál es su importancia?**: Aprovecha la arquitectura de Streaming SSR de React 19 / Next.js para que el layout
 *   y los encabezados se envíen de inmediato al cliente, mientras que la lista de amigos y el buscador se transmiten de forma asíncrona.
 */
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
