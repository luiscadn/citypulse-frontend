import type { Metadata } from "next";
import { Breadcrumbs } from "@/shared/presentation/components/breadcrumbs";
import { Suspense } from "react";
import { MyVenues } from "@/features/venue/presentation/components/my-venues";
import { Container, PageHeader, Spinner } from "@/shared/presentation/components";

/** Metadata para la vista de gestión de lugares propios */
export const metadata: Metadata = { title: "Mis lugares" };

/**
 * Componente MyVenuesPage: Panel de administración para propietarios de lugares (rol OWNER / ADMIN).
 *
 * - **¿Qué hace?**: Renderiza las migas de pan de navegación, el encabezado descriptivo y el componente `MyVenues`
 *   dentro de un límite de `<Suspense>`.
 * - **¿Cómo interactúa con el sistema en general?**: `MyVenues` consulta el caso de uso `listMyVenuesUseCase`,
 *   obteniendo exclusivamente los establecimientos creados o administrados por el usuario autenticado.
 * - **¿Cuál es su importancia?**: Ofrece a los comerciantes, gestores culturales y propietarios un panel dedicado
 *   para gestionar el estado de sus establecimientos, solicitar verificación y crear nuevos espacios.
 */
export default function MyVenuesPage() {
  return (
    <Container className="flex flex-col gap-6 pb-12">
      <Breadcrumbs items={[{ label: "Lugares", href: "/venues" }, { label: "Mis lugares" }]} />
      <PageHeader
        title="Mis lugares"
        description="Los lugares que administras, verificados y pendientes."
        className="pt-2 pb-0"
      />
      {/* Lee la sesión: va en Suspense para no bloquear el resto de la página */}
      <Suspense
        fallback={
          <div className="grid h-32 place-items-center text-primary">
            <Spinner />
          </div>
        }
      >
        <MyVenues />
      </Suspense>
    </Container>
  );
}
